from flask import Flask, request, redirect, jsonify, session
import requests
import secrets
import time
import json
from spotify_config import getSpotifyConfig, SPOTIFY_SCOPES

app = Flask(__name__)
app.secret_key = 'sua-chave-secreta-aqui'

# ========== STATE STORE EM MEMÓRIA (Problema 3) ==========
# Substitui a dependência de cookies que são bloqueados em iFrames
stateStore = {}

def createStateEntry(redirectUri):
    """Cria uma entrada segura no stateStore com expiração de 15 minutos"""
    stateKey = secrets.token_urlsafe(32)
    stateStore[stateKey] = {
        'redirectUri': redirectUri,
        'createdAt': time.time(),
        'expiresIn': 900  # 15 minutos
    }
    return stateKey

def validateStateEntry(stateKey):
    """Valida e consome a entrada do stateStore"""
    if stateKey not in stateStore:
        return None
    entry = stateStore[stateKey]
    # Verificar expiração
    if time.time() - entry['createdAt'] > entry['expiresIn']:
        del stateStore[stateKey]
        return None
    # Consumir entrada (one-time use)
    redirectUri = entry['redirectUri']
    del stateStore[stateKey]
    return redirectUri

# ========== ROTA: INICIAR LOGIN ==========
@app.route('/api/spotify/login')
def spotifyLogin():
    config = getSpotifyConfig()

    # Criar state seguro e armazenar redirectUri exato
    stateKey = createStateEntry(config['redirect_uri'])

    authUrl = 'https://accounts.spotify.com/authorize?' + \
        'response_type=code' + \
        '&client_id=' + config['client_id'] + \
        '&scope=' + requests.utils.quote(SPOTIFY_SCOPES) + \
        '&redirect_uri=' + requests.utils.quote(config['redirect_uri']) + \
        '&state=' + stateKey

    return redirect(authUrl)

# ========== ROTA: CALLBACK DO SPOTIFY ==========
@app.route('/api/spotify/callback')
def spotifyCallback():
    code = request.args.get('code')
    stateKey = request.args.get('state')
    error = request.args.get('error')

    if error:
        return renderCallbackPage('error', 'Spotify negou acesso: ' + error)

    # Validar state e recuperar redirectUri EXATO (Problema 2)
    redirectUri = validateStateEntry(stateKey)
    if not redirectUri:
        return renderCallbackPage('error', 'State inválido ou expirado. Tente novamente.')

    # Trocar código por token usando o redirectUri EXATO
    config = getSpotifyConfig()
    tokenResponse = requests.post(
        'https://accounts.spotify.com/api/token',
        data={
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': redirectUri,  # ← usa o MESMO URI do /authorize
            'client_id': config['client_id'],
            'client_secret': config['client_secret']
        }
    )

    if tokenResponse.status_code != 200:
        return renderCallbackPage('error', 'Erro ao obter token: ' + tokenResponse.text)

    tokenData = tokenResponse.json()
    accessToken = tokenData.get('access_token')
    refreshToken = tokenData.get('refresh_token')
    expiresIn = tokenData.get('expires_in', 3600)

    # Retornar página de sucesso que envia o token via postMessage (Problema 5)
    return renderCallbackPage('success', 'Conta conectada!', accessToken, refreshToken, expiresIn)

# ========== ROTA: REFRESH TOKEN ==========
@app.route('/api/spotify/refresh')
def spotifyRefresh():
    refreshToken = request.args.get('refresh_token')
    if not refreshToken:
        return jsonify({'error': 'refresh_token ausente'}), 400

    config = getSpotifyConfig()
    response = requests.post(
        'https://accounts.spotify.com/api/token',
        data={
            'grant_type': 'refresh_token',
            'refresh_token': refreshToken,
            'client_id': config['client_id'],
            'client_secret': config['client_secret']
        }
    )
    return jsonify(response.json()), response.status_code

# ========== RENDERIZAR PÁGINA DE CALLBACK (Problema 5) ==========
def renderCallbackPage(status, message, accessToken=None, refreshToken=None, expiresIn=None):
    """Gera HTML que envia o token via postMessage e mostra confirmação visual"""
    if status == 'success':
        html = '''
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: -apple-system, sans-serif; background: #0A0A0A; color: #FAFAFA; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
                .card { background: #1A1A1A; border-radius: 16px; padding: 40px; text-align: center; max-width: 400px; }
                .icon { width: 64px; height: 64px; margin: 0 auto 20px; background: rgba(29,185,84,0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
                .icon svg { width: 32px; height: 32px; color: #1DB954; }
                h2 { font-size: 20px; margin-bottom: 8px; }
                p { color: #A3A3A3; font-size: 14px; margin-bottom: 24px; }
                .btn { background: #1DB954; color: #000; border: none; padding: 12px 24px; border-radius: 10px; font-weight: 600; cursor: pointer; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg>
                </div>
                <h2>Spotify conectado!</h2>
                <p>Você já pode fechar esta janela.</p>
                <button class="btn" onclick="window.close()">Fechar</button>
            </div>
            <script>
                // Enviar token via postMessage para a janela pai
                if (window.opener) {
                    window.opener.postMessage({
                        type: 'spotify_auth_success',
                        access_token: ''' + json.dumps(accessToken) + ''',
                        refresh_token: ''' + json.dumps(refreshToken) + ''',
                        expires_in: ''' + str(expiresIn) + '''
                    }, '*');
                }
                // Também enviar via URL hash como fallback
                window.location.hash = 'access_token=' + encodeURIComponent(''' + json.dumps(accessToken) + ''') +
                    '&refresh_token=' + encodeURIComponent(''' + json.dumps(refreshToken) + ''') +
                    '&expires_in=' + ''' + str(expiresIn) + ''';
            </script>
        </body>
        </html>
        '''
    else:
        html = '''
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: -apple-system, sans-serif; background: #0A0A0A; color: #FAFAFA; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
                .card { background: #1A1A1A; border-radius: 16px; padding: 40px; text-align: center; max-width: 400px; }
                .icon { width: 64px; height: 64px; margin: 0 auto 20px; background: rgba(220,38,38,0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
                .icon svg { width: 32px; height: 32px; color: #DC2626; }
                h2 { font-size: 20px; margin-bottom: 8px; }
                p { color: #A3A3A3; font-size: 14px; margin-bottom: 24px; }
                .btn { background: #404040; color: #FAFAFA; border: none; padding: 12px 24px; border-radius: 10px; font-weight: 600; cursor: pointer; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
                </div>
                <h2>Erro na conexão</h2>
                <p>''' + message + '''</p>
                <button class="btn" onclick="window.close()">Fechar</button>
            </div>
            <script>
                if (window.opener) {
                    window.opener.postMessage({
                        type: 'spotify_auth_error',
                        message: ''' + json.dumps(message) + '''
                    }, '*');
                }
            </script>
        </body>
        </html>
        '''
    return html

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
    # Em vez de usar cookies (que são bloqueados em iFrames):
# session['spotify_state'] = state  ← NÃO USA ISSO

# Usa stateStore em memória:
stateKey = createStateEntry(redirectUri)  # ← USA ISSO