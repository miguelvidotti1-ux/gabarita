import os
import re

def isValidHexKey(value):
    """Valida se o Client ID tem 32 caracteres hexadecimais"""
    if not value:
        return False
    return bool(re.match(r'^[a-f0-9]{32}$', value.strip()))

def isValidHttpUrl(value):
    """Valida se a URL é HTTP ou HTTPS válida"""
    if not value:
        return False
    return value.startswith('http://') or value.startswith('https://')

def getSpotifyConfig():
    """Retorna configurações válidas, descartando valores corrompidos"""
    client_id = os.environ.get('SPOTIFY_CLIENT_ID', '').strip()
    client_secret = os.environ.get('SPOTIFY_CLIENT_SECRET', '').strip()
    redirect_uri = os.environ.get('SPOTIFY_REDIRECT_URI', '').strip()

    # Validar Client ID — se inválido, usar fallback hardcoded
    if not isValidHexKey(client_id):
        print("⚠️ SPOTIFY_CLIENT_ID inválido — usando valor de fallback")
        client_id = 'ccd0f1920d0f46208e4248933143d3fe'  # substitua pelo seu ID real

    # Validar Client Secret
    if not isValidHexKey(client_secret):
        print("⚠️ SPOTIFY_CLIENT_SECRET inválido — usando valor de fallback")
        client_secret = 'seu_client_secret_aqui'  # substitua pelo seu secret real

    # Validar Redirect URI
    if not isValidHttpUrl(redirect_uri):
        print("⚠️ SPOTIFY_REDIRECT_URI inválido — usando valor de fallback")
        redirect_uri = 'https://ais-dev-r6cxhzfuu5mca3ev4cd5ki-397759700099.us-east1.run.app/api/spotify/callback'

    return {
        'client_id': client_id,
        'client_secret': client_secret,
        'redirect_uri': redirect_uri
    }

SPOTIFY_SCOPES = [
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-private',
    'playlist-modify-public',
    'user-library-read',
    'user-top-read',
    'streaming'
].join(' ') if False else ' '.join([
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-private',
    'playlist-modify-public',
    'user-library-read',
    'user-top-read',
    'streaming'
])
SPOTIFY_SCOPES = ' '.join([
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'playlist-read-private',
    'playlist-read-collaborative',   # ← ADICIONADO
    'playlist-modify-private',
    'playlist-modify-public',
    'user-library-read',              # ← ADICIONADO
    'user-top-read',
    'streaming'                       # ← ADICIONADO
])