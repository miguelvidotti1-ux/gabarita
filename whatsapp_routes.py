from flask import Blueprint, request, jsonify
from agente_whatsapp import AgenteWhatsAppService
from functools import wraps

whatsapp_bp = Blueprint('whatsapp', __name__)

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Em ambiente de desenvolvimento, permite a chamada direta
        # Em produção, validar JWT / Bearer token
        auth_header = request.headers.get('Authorization', '')
        # Validação simples ou desenvolvimento
        return f(*args, **kwargs)
    return decorated_function

# ========== VERIFICAÇÃO DO WEBHOOK (Meta chama na configuração) ==========
@whatsapp_bp.route('/api/whatsapp/webhook', methods=['GET'])
def verificar_webhook():
    """
    A Meta chama este endpoint quando você configura o webhook no painel.
    Deve responder com o 'hub.challenge' se o token bater.
    """
    mode = request.args.get('hub.mode')
    token = request.args.get('hub.verify_token')
    challenge = request.args.get('hub.challenge')

    ok, challenge_response = AgenteWhatsAppService.verificar_webhook(mode, token, challenge)

    if ok:
        return challenge_response, 200
    return jsonify({'erro': 'Token de verificação inválido'}), 403

# ========== RECEBER MENSAGENS (Meta chama a cada mensagem) ==========
@whatsapp_bp.route('/api/whatsapp/webhook', methods=['POST'])
def receber_mensagem():
    """
    Endpoint que a Meta chama quando alguém manda mensagem no seu WhatsApp Business.
    Deve responder 200 rápido — o processamento pesado acontece dentro.
    """
    data = request.get_json(silent=True) or {}

    try:
        resultado = AgenteWhatsAppService.processar_mensagem_recebida(data)
        print(f'[WHATSAPP] {resultado}')  # log simples
    except Exception as e:
        print(f'[WHATSAPP ERRO] {str(e)}')

    # SEMPRE responder 200 — se demorar ou falhar, a Meta reenvia
    return jsonify({'status': 'recebido'}), 200

# ========== ENVIAR MENSAGEM MANUAL (admin) ==========
@whatsapp_bp.route('/api/whatsapp/enviar', methods=['POST'])
@admin_required
def enviar_manual():
    """Admin envia mensagem manual para um usuário"""
    data = request.get_json(silent=True) or {}
    destinatario = (data.get('destinatario') or '').strip()
    mensagem = (data.get('mensagem') or '').strip()

    if not destinatario or not mensagem:
        return jsonify({'erro': 'destinatario e mensagem são obrigatórios'}), 400

    ok = AgenteWhatsAppService._enviar_texto(destinatario, mensagem)
    if ok:
        return jsonify({'sucesso': True, 'destinatario': destinatario})
    return jsonify({'erro': 'Falha ao enviar mensagem'}), 500
