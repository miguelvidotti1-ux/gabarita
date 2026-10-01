import os
import re
import json
import time
import requests
from datetime import datetime, timedelta
from config import Config

try:
    from flask import current_app
    def _get_active_config():
        try:
            return current_app.config
        except Exception:
            return Config.__dict__
except ImportError:
    def _get_active_config():
        return Config.__dict__

# ============================================================
# BANCO DE CONTEXTO — mensagens recentes por usuário (RAM)
# ============================================================
# Em produção, troque por Redis. Para começar, um dict em memória funciona.
_contexto_usuarios = {}  # {"5511...": [{"role":"user","content":"...","ts":...}, ...]}

CONTEXTO_MAX_MENSAGENS = 6       # últimas 6 mensagens enviadas ao Gemini
CONTEXTO_EXPIRA_SEGUNDOS = 1800  # 30 min sem mensagem = contexto limpo


class AgenteWhatsAppService:
    """Agente de IA que responde mensagens do WhatsApp automaticamente"""

    # ========== VERIFICAR WEBHOOK (GET) ==========
    @staticmethod
    def verificar_webhook(mode, verify_token, challenge):
        """Meta chama este endpoint na configuração do webhook"""
        config = _get_active_config()
        expected = config.get('WHATSAPP_VERIFY_TOKEN', 'vesthub_verify_2026')
        if mode == 'subscribe' and verify_token == expected:
            return True, challenge
        return False, None

    # ========== RECEBER E PROCESSAR MENSAGEM (POST) ==========
    @staticmethod
    def processar_mensagem_recebida(data):
        """
        Ponto de entrada — chamado pelo webhook quando o Meta envia uma mensagem.
        Extrai texto, telefone do remetente, processa com IA e responde.
        """
        try:
            # O payload do Meta vem dentro entry[0].changes[0].value
            entry = data.get('entry', [{}])[0]
            changes = entry.get('changes', [{}])[0]
            value = changes.get('value', {})

            # Mensagens recebidas
            messages = value.get('messages', [])
            if not messages:
                # Pode ser status de entrega/leitura — ignorar
                return {'status': 'ignorado', 'motivo': 'nao_eh_mensagem'}

            msg = messages[0]
            tipo = msg.get('type')

            # Só processa texto por enquanto (pode expandir para áudio/imagem depois)
            if tipo != 'text':
                remetente = msg.get('from', '')
                if remetente:
                    AgenteWhatsAppService._enviar_texto(
                        remetente,
                        'Recebi sua mensagem! Por enquanto só consigo responder textos. '
                        'Digite sua dúvida que eu te ajudo! 😊'
                    )
                return {'status': 'respondido', 'motivo': 'tipo_nao_suportado'}

            # Extrair dados
            texto_recebido = msg.get('text', {}).get('body', '').strip()
            remetente = msg.get('from', '')  # formato: 55119876543210
            nome_remetente = value.get('contacts', [{}])[0].get('profile', {}).get('name', '')

            if not texto_recebido or not remetente:
                return {'status': 'ignorado', 'motivo': 'sem_texto_ou_remetente'}

            # Comandos especiais
            if texto_recebido.lower().strip() in ['/ajuda', 'ajuda', 'menu', '/menu']:
                resposta = AgenteWhatsAppService._menu_ajuda()
                AgenteWhatsAppService._enviar_texto(remetente, resposta)
                return {'status': 'respondido', 'motivo': 'menu'}

            if texto_recebido.lower().strip() in ['/humano', 'humano', 'atendente']:
                AgenteWhatsAppService._enviar_texto(
                    remetente,
                    '👋 Você está sendo transferido para nossa equipe humana. '
                    'Em instantes alguém vai te atender!'
                )
                # Notificação para o WhatsApp do admin
                AgenteWhatsAppService._notificar_admin(
                    f'🔔 Transferência solicitada por {nome_remetente or remetente} ({remetente})'
                )
                return {'status': 'transferido', 'motivo': 'solicitou_humano'}

            # Processar com IA
            resposta_ia = AgenteWhatsAppService._gerar_resposta_ia(
                remetente, texto_recebido, nome_remetente
            )

            # Verificar se a IA quer escalar para humano
            if resposta_ia.startswith('[HUMANO]'):
                # Remove o marcador e envia a parte limpa
                texto_limpo = resposta_ia.replace('[HUMANO]', '').strip()
                if texto_limpo:
                    AgenteWhatsAppService._enviar_texto(remetente, texto_limpo)
                AgenteWhatsAppService._notificar_admin(
                    f'🔔 Escalonamento automático\n'
                    f'Usuário: {nome_remetente or remetente} ({remetente})\n'
                    f'Mensagem: {texto_recebido[:200]}'
                )
                return {'status': 'escalonado', 'motivo': 'ia_solicitou_humano'}

            # Enviar resposta da IA
            AgenteWhatsAppService._enviar_texto(remetente, resposta_ia)

            # Salvar no contexto
            AgenteWhatsAppService._salvar_contexto(remetente, 'user', texto_recebido)
            AgenteWhatsAppService._salvar_contexto(remetente, 'assistant', resposta_ia)

            return {
                'status': 'respondido',
                'remetente': remetente,
                'nome': nome_remetente,
                'pergunta': texto_recebido[:100],
                'resposta': resposta_ia[:100]
            }

        except Exception as e:
            # Log do erro (em produção, usar logging real)
            print(f'[ERRO WEBHOOK] {str(e)}')
            return {'status': 'erro', 'motivo': str(e)}

    # ========== GERAR RESPOSTA COM IA ==========
    @staticmethod
    def _gerar_resposta_ia(remetente, pergunta, nome=''):
        """Chama o Gemini com o system prompt do agente + contexto da conversa"""
        config = _get_active_config()

        gemini_api_key = config.get('GEMINI_API_KEY') or os.environ.get('GEMINI_API_KEY', '')
        if not gemini_api_key:
            return ('Estou em modo de demonstração agora, mas em breve estarei '
                    'respondendo suas dúvidas sobre o VestHub! Digite /ajuda para ver o menu.')

        # Recuperar contexto recente
        historico = AgenteWhatsAppService._obter_contexto(remetente)

        # Personalizar prompt com nome se disponível
        prompt_sistema = config.get('AGENTE_SYSTEM_PROMPT', Config.AGENTE_SYSTEM_PROMPT)
        if nome:
            prompt_sistema += f'\n\nO usuário se chama {nome}. Seja cordial.'

        # Montar conteúdo para o Gemini
        contents = []
        for msg in historico:
            role = 'user' if msg['role'] == 'user' else 'model'
            contents.append({'role': role, 'parts': [{'text': msg['content']}]})

        contents.append({'role': 'user', 'parts': [{'text': pergunta}]})

        body = {
            'system_instruction': {'parts': [{'text': prompt_sistema}]},
            'contents': contents,
            'generationConfig': {
                'maxOutputTokens': 400,   # respostas curtas para WhatsApp
                'temperature': 0.3,       # respostas consistentes
                'topP': 0.9
            }
        }

        try:
            gemini_url = config.get('GEMINI_URL', Config.GEMINI_URL)
            r = requests.post(
                gemini_url + '?key=' + gemini_api_key,
                json=body,
                timeout=20
            )

            if r.status_code != 200:
                return 'Tive um probleminha para processar agora. Pode repetir? 😊'

            resposta = r.json()['candidates'][0]['content']['parts'][0]['text']
            return resposta.strip()

        except (requests.Timeout, requests.ConnectionError):
            return 'Estou com dificuldade de conexão agora. Tente novamente em instantes. 😊'
        except (KeyError, IndexError):
            return 'Não consegui entender sua mensagem. Pode reformular? 😊'

    # ========== ENVIAR MENSAGEM VIA WHATSAPP API ==========
    @staticmethod
    def _enviar_texto(destinatario, texto):
        """Envia uma mensagem de texto via WhatsApp Business Cloud API"""
        config = _get_active_config()
        phone_id = config.get('WHATSAPP_PHONE_ID') or os.environ.get('WHATSAPP_PHONE_ID', '')
        token = config.get('WHATSAPP_TOKEN') or os.environ.get('WHATSAPP_TOKEN', '')

        if not phone_id or not token:
            print('[ERRO] WHATSAPP_PHONE_ID ou WHATSAPP_TOKEN não configurados')
            return False

        api_url = config.get('WHATSAPP_API_URL', 'https://graph.facebook.com/v21.0/')
        if not api_url.endswith('/'):
            api_url += '/'
        url = f'{api_url}{phone_id}/messages'

        # WhatsApp limita mensagens em ~4096 caracteres
        # Se a resposta for muito longa, dividir em partes
        mensagens = AgenteWhatsAppService._dividir_mensagem(texto, 4000)

        for msg in mensagens:
            payload = {
                'messaging_product': 'whatsapp',
                'recipient_type': 'individual',
                'to': destinatario,
                'type': 'text',
                'text': {'body': msg, 'preview_url': False}
            }

            try:
                r = requests.post(url, json=payload, headers={
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }, timeout=15)

                if r.status_code not in (200, 201):
                    print(f'[ERRO ENVIO WHATSAPP] {r.status_code}: {r.text[:200]}')
                    return False

            except (requests.Timeout, requests.ConnectionError):
                print('[ERRO] Timeout ao enviar mensagem WhatsApp')
                return False

        return True

    # ========== UTILITÁRIOS ==========
    @staticmethod
    def _dividir_mensagem(texto, max_chars):
        """Divide texto longo em partes, cortando em quebras de linha"""
        if len(texto) <= max_chars:
            return [texto]

        partes = []
        while len(texto) > max_chars:
            # Procura última quebra de linha antes do limite
            corte = texto.rfind('\n', 0, max_chars)
            if corte == -1:
                corte = max_chars
            partes.append(texto[:corte])
            texto = texto[corte:].lstrip('\n')
        if texto:
            partes.append(texto)
        return partes

    @staticmethod
    def _menu_ajuda():
        return (
            '👋 *VestHub — Suporte*\n\n'
            'Posso te ajudar com:\n'
            '📋 Funcionalidades do app\n'
            '💰 Planos e pagamentos\n'
            '📝 CorrigeBot (correção de redação)\n'
            '🤖 VestBot (chat de vestibular)\n'
            '🎵 Spotify (músicas para estudar)\n'
            '❓ Dúvidas sobre vestibulares\n\n'
            'Digite sua dúvida ou:\n'
            '/humano — falar com atendente\n'
            '/ajuda — ver este menu'
        )

    @staticmethod
    def _notificar_admin(mensagem):
        """Envia notificação para o WhatsApp do admin"""
        config = _get_active_config()
        admin_numero = config.get('ADMIN_WHATSAPP') or os.environ.get('ADMIN_WHATSAPP', '')

        if not admin_numero:
            return

        AgenteWhatsAppService._enviar_texto(admin_numero, mensagem)

    # ========== GESTÃO DE CONTEXTO (memória da conversa) ==========
    @staticmethod
    def _obter_contexto(remetente):
        """Recupera o histórico recente da conversa com o usuário"""
        global _contexto_usuarios

        agora = time.time()
        dados = _contexto_usuarios.get(remetente, [])

        # Filtrar mensagens não expiradas
        dados = [m for m in dados if agora - m['ts'] < CONTEXTO_EXPIRA_SEGUNDOS]

        # Atualizar cache
        _contexto_usuarios[remetente] = dados

        return dados[-CONTEXTO_MAX_MENSAGENS:]

    @staticmethod
    def _salvar_contexto(remetente, role, content):
        """Salva mensagem no contexto da conversa"""
        global _contexto_usuarios

        if remetente not in _contexto_usuarios:
            _contexto_usuarios[remetente] = []

        _contexto_usuarios[remetente].append({
            'role': role,
            'content': content,
            'ts': time.time()
        })

        # Limitar tamanho
        if len(_contexto_usuarios[remetente]) > CONTEXTO_MAX_MENSAGENS * 2:
            _contexto_usuarios[remetente] = _contexto_usuarios[remetente][-CONTEXTO_MAX_MENSAGENS * 2:]
