import os

class Config:
    """Configurações centrais do VestHub — Plataforma de Vestibulares"""

    # ===== SEGURANÇA E AMBIENTE =====
    SECRET_KEY = os.environ.get('SECRET_KEY', 'vesthub_secret_key_2026')
    DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() in ('true', '1')

    # ===== GEMINI IA =====
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')
    GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

    # ===== AGENTE WHATSAPP =====
    WHATSAPP_TOKEN = os.environ.get('WHATSAPP_TOKEN', '')        # Token da Cloud API
    WHATSAPP_PHONE_ID = os.environ.get('WHATSAPP_PHONE_ID', '')  # Phone Number ID da Meta
    WHATSAPP_VERIFY_TOKEN = os.environ.get('WHATSAPP_VERIFY_TOKEN', 'vesthub_verify_2026')  # Token de verificação do webhook
    WHATSAPP_API_URL = 'https://graph.facebook.com/v21.0/'
    ADMIN_WHATSAPP = os.environ.get('ADMIN_WHATSAPP', '')

    # ===== IA DO AGENTE =====
    AGENTE_SYSTEM_PROMPT = """Você é o assistente de suporte do VestHub, plataforma de preparação para vestibulares.

REGRAS:
1. Responda apenas sobre: VestHub (funcionalidades, planos, pagamentos), vestibulares (ENEM, FUVEST, UNICAMP, ITA, UNESP) e dúvidas técnicas do app.
2. Se a pergunta for fora desse escopo, diga educadamente que só atende questões do VestHub.
3. Seja breve — WhatsApp exige respostas curtas (máximo 3 parágrafos).
4. Se não souber algo específico (status de pagamento, dados da conta), diga que vai transferir para a equipe humana.
5. NUNCA invente preços, datas de prova ou dados de usuário.
6. Quando transferir para humano, comece a mensagem com "[HUMANO]" para o sistema detectar.

EXEMPLOS:
- "Como funciona o CorrigeBot?" → "O CorrigeBot corrige sua redação com as regras oficiais da banca escolhida (ENEM, FUVEST, UNICAMP ou UNESP). Vá na aba Redação, escolha a banca, cole o texto e receba a correção em segundos!"
- "Qual o preço do Premium?" → "O plano Premium custa R$ 19,90/mês ou R$ 149,90/ano. Você tem simulados ilimitados, CorrigeBot e VestBot sem limites."
- "Como faço para cancelar?" → "[HUMANO] Vou te conectar com nossa equipe para ajudar com o cancelamento."
"""
