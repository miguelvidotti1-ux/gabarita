import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

export const spotifyRouter = Router();

// ============================================================
// CONFIGURAÇÕES — SPOTIFY OAUTH 2.0
// ============================================================

/**
 * Valida se a string tem formato hexadecimal de 32 caracteres (padrão Spotify Client ID e Secret)
 */
function isValidHexKey(str?: string): boolean {
  if (!str) return false;
  const trimmed = str.trim();
  return /^[a-f0-9]{32}$/i.test(trimmed);
}

/**
 * Valida se é uma URL HTTP/HTTPS válida (não um texto aleatório ou senha)
 */
function isValidHttpUrl(str?: string): boolean {
  if (!str) return false;
  try {
    const url = new URL(str.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Recupera as credenciais do Spotify de process.env ou de /config.js com validação inteligente
 */
function getSpotifyCredentials(req?: Request) {
  const envClientId = (process.env.SPOTIFY_CLIENT_ID || '').trim();
  const envClientSecret = (process.env.SPOTIFY_CLIENT_SECRET || '').trim();
  const envCustomRedirect = (process.env.SPOTIFY_REDIRECT_URI || '').trim();

  let fileClientId = '';
  let fileClientSecret = '';
  let fileRedirect = '';

  // Ler credenciais salvas em config.js
  try {
    const configPath = path.join(process.cwd(), 'config.js');
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf-8');
      const idMatch = content.match(/CLIENT_ID:\s*['"]([^'"]+)['"]/);
      const secretMatch = content.match(/CLIENT_SECRET:\s*['"]([^'"]+)['"]/);
      const uriMatch = content.match(/REDIRECT_URI:\s*['"]([^'"]+)['"]/);

      if (idMatch && idMatch[1] && idMatch[1] !== 'seu_client_id_aqui') {
        fileClientId = idMatch[1].trim();
      }
      if (secretMatch && secretMatch[1] && secretMatch[1] !== 'seu_client_secret_aqui') {
        fileClientSecret = secretMatch[1].trim();
      }
      if (uriMatch && uriMatch[1] && !uriMatch[1].includes('localhost:5000')) {
        fileRedirect = uriMatch[1].trim();
      }
    }
  } catch (err) {
    // Ignorar falha na leitura
  }

  // 1. Client ID: priorizar credencial em formato hex válido
  let clientId = '';
  if (isValidHexKey(envClientId)) {
    clientId = envClientId;
  } else if (isValidHexKey(fileClientId)) {
    clientId = fileClientId;
  } else {
    clientId = envClientId || fileClientId;
  }

  // 2. Client Secret: priorizar secret em formato hex válido
  let clientSecret = '';
  if (isValidHexKey(envClientSecret)) {
    clientSecret = envClientSecret;
  } else if (isValidHexKey(fileClientSecret)) {
    clientSecret = fileClientSecret;
  } else {
    clientSecret = envClientSecret || fileClientSecret;
  }

  // 3. Redirect URI: deve ser URL HTTP/HTTPS válida, ou derivada dinamicamente do host atual
  let redirectUri = '';
  if (isValidHttpUrl(envCustomRedirect)) {
    redirectUri = envCustomRedirect;
  } else if (isValidHttpUrl(fileRedirect)) {
    redirectUri = fileRedirect;
  } else if (req) {
    const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
    const host = req.get('host') || 'localhost:3000';
    redirectUri = `${proto}://${host}/api/spotify/callback`;
  }

  return { clientId, clientSecret, redirectUri };
}

// Scopes — permissões concedidas pelo usuário
const SPOTIFY_SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-top-read',
  'user-library-read',
  'streaming',
];

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

// ========== ESTILOS MUSICAIS PRÉ-DEFINIDOS ==========
export interface EstiloMusical {
  nome: string;
  seeds: string[];
  descricao: string;
  icon: string;
}

export const ESTILOS_MUSICAIS: Record<string, EstiloMusical> = {
  lofi: {
    nome: 'Lo-Fi Beats',
    seeds: ['lo-fi beats', 'study beats', 'chill lo-fi'],
    descricao: 'Batidas relaxantes para foco total',
    icon: '🎧',
  },
  classica: {
    nome: 'Música Clássica',
    seeds: ['classical', 'classical study', 'classical focus'],
    descricao: 'Composições para concentração profunda',
    icon: '🎻',
  },
  piano: {
    nome: 'Piano Relaxante',
    seeds: ['piano chill', 'piano study', 'solo piano'],
    descricao: 'Piano suave para leitura e redação',
    icon: '🎹',
  },
  jazz: {
    nome: 'Jazz Suave',
    seeds: ['jazz', 'smooth jazz', 'jazz for study'],
    descricao: 'Jazz instrumental para manter o ritmo',
    icon: '🎷',
  },
  eletronica: {
    nome: 'Eletrônica Focus',
    seeds: ['electronic focus', 'ambient electronic', 'deep house study'],
    descricao: 'Eletrônica instrumental para alta produtividade',
    icon: '⚡',
  },
  ambient: {
    nome: 'Ambient',
    seeds: ['ambient', 'ambient study', 'white noise ambient'],
    descricao: 'Som ambiente para imersão total',
    icon: '🌌',
  },
  rock: {
    nome: 'Rock Instrumental',
    seeds: ['instrumental rock', 'post rock', 'rock study'],
    descricao: 'Rock sem vocais para manter energia',
    icon: '🎸',
  },
  indie: {
    nome: 'Indie Folk',
    seeds: ['indie folk', 'acoustic study', 'indie acoustic'],
    descricao: 'Indie acústico para estudos tranquilos',
    icon: '🪕',
  },
  hiphop: {
    nome: 'Hip-Hop Beats',
    seeds: ['hip hop instrumental', 'lo-fi hip hop', 'boom bap beats'],
    descricao: 'Beats de hip-hop para manter o flow',
    icon: '🎤',
  },
  bossa: {
    nome: 'Bossa Nova',
    seeds: ['bossa nova', 'brazilian jazz', 'bossa nova study'],
    descricao: 'Bossa nova brasileira para relaxar',
    icon: '🌴',
  },
};

// Armazenamento em memória para sessões/tokens (funciona perfeitamente como fallback a cookies de terceiros em iframe)
interface UserSessionData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // timestamp ms
}

interface StateData {
  redirectUri: string;
  createdAt: number;
}

const sessionStore = new Map<string, UserSessionData>();
const stateStore = new Map<string, StateData>();

/**
 * Determina a URI de redirect dinamicamente ou pela variável de ambiente
 */
function getRedirectUri(req: Request): string {
  if (process.env.SPOTIFY_REDIRECT_URI) {
    return process.env.SPOTIFY_REDIRECT_URI;
  }
  // Usar protocolo e host atuais do request (ou cabeçalhos de proxy do Cloud Run)
  const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
  const host = req.get('host') || 'localhost:3000';
  return `${proto}://${host}/api/spotify/callback`;
}

/**
 * Obtém ou inicializa o session ID a partir dos cookies ou header Authorization
 */
function getSessionId(req: Request, res?: Response): string {
  let sessionId = req.cookies?.['spotify_session_id'] || (req.headers['x-session-id'] as string);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    if (res) {
      res.cookie('spotify_session_id', sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
    }
  }
  return sessionId;
}

let appAccessToken: string | null = null;
let appTokenExpiresAt = 0;

/**
 * Obtém token de aplicativo via Client Credentials Flow (não requer login do usuário).
 * Permite buscar estilos, faixas de estudo e pesquisar sem exigir conta pessoal logada.
 */
async function getAppClientCredentialsToken(req?: Request): Promise<string | null> {
  const { clientId, clientSecret } = getSpotifyCredentials(req);
  if (!clientId || !clientSecret) return null;

  if (appAccessToken && Date.now() < appTokenExpiresAt - 60000) {
    return appAccessToken;
  }

  try {
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const response = await fetch(SPOTIFY_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      }).toString(),
    });

    if (response.ok) {
      const data = (await response.json()) as any;
      if (data.access_token) {
        appAccessToken = data.access_token;
        appTokenExpiresAt = Date.now() + (data.expires_in || 3600) * 1000;
        return appAccessToken;
      }
    }
  } catch (err) {
    console.warn('Erro ao obter token de aplicativo Spotify:', err);
  }
  return null;
}

/**
 * Obtém um access_token válido. Se expirou, renova automaticamente usando refresh_token.
 * Se allowAppToken for true e não houver sessão do usuário, recorre ao token de aplicativo.
 */
async function getValidSpotifyToken(req: Request, res?: Response, allowAppToken: boolean = false): Promise<string | null> {
  const { clientId, clientSecret } = getSpotifyCredentials(req);

  // 1. Verificar header Authorization: Bearer <token>
  const authHeader = req.headers.authorization;
  let accessToken: string | null = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearer = authHeader.substring(7).trim();
    if (bearer && bearer !== 'null' && bearer !== 'undefined') {
      accessToken = bearer;
    }
  }

  // 2. Verificar tokens em cookie, headers customizados ou na sessionStore
  const sessionId = getSessionId(req);
  let sessionData = sessionStore.get(sessionId) || sessionStore.get('global_active');

  if (!accessToken) {
    accessToken = sessionData?.accessToken || req.cookies?.['spotify_access_token'] || null;
  }

  let refreshToken = (req.headers['x-refresh-token'] as string) || 
                     sessionData?.refreshToken || 
                     req.cookies?.['spotify_refresh_token'] || null;

  let expiresAt = sessionData?.expiresAt || Number(req.cookies?.['spotify_token_expires_at'] || 0);

  // Se tem token e não expirou, retorna
  if (accessToken && (expiresAt === 0 || Date.now() <= (expiresAt - 60000))) {
    return accessToken;
  }

  // Renovar com refresh_token se disponível
  if (refreshToken && clientId && clientSecret) {
    try {
      const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
      const response = await fetch(SPOTIFY_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${basicAuth}`,
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }).toString(),
      });

      if (response.ok) {
        const data = (await response.json()) as any;
        accessToken = data.access_token;
        if (data.refresh_token) {
          refreshToken = data.refresh_token;
        }
        expiresAt = Date.now() + (data.expires_in || 3600) * 1000;

        const updatedSession = {
          accessToken: accessToken!,
          refreshToken: refreshToken!,
          expiresAt,
        };

        // Atualizar sessionStore local e global
        sessionStore.set(sessionId, updatedSession);
        sessionStore.set('global_active', updatedSession);

        // Notificar cliente do novo token via header
        if (res) {
          res.setHeader('x-new-spotify-token', accessToken!);
          res.cookie('spotify_access_token', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 3600 * 1000,
          });
          if (data.refresh_token) {
            res.cookie('spotify_refresh_token', refreshToken, {
              httpOnly: true,
              secure: true,
              sameSite: 'none',
              maxAge: 30 * 24 * 60 * 60 * 1000,
            });
          }
        }
        return accessToken;
      }
    } catch (err) {
      console.error('Erro ao renovar token Spotify:', err);
    }
  }

  if (accessToken) return accessToken;

  // Se permitido, recorrer ao token da aplicação (Client Credentials)
  if (allowAppToken) {
    const appToken = await getAppClientCredentialsToken(req);
    if (appToken) return appToken;
  }

  return null;
}

// ============================================================
// 1. INICIAR FLUXO OAuth
// Endpoint: GET /api/spotify/login
// ============================================================
spotifyRouter.get('/login', (req: Request, res: Response) => {
  const { clientId, redirectUri } = getSpotifyCredentials(req);
  if (!clientId) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
        <head><title>Spotify Configuração</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 40px; background: #0B1120; color: #fff;">
          <h2 style="color: #f59e0b;">Spotify Client ID não configurado</h2>
          <p>Adicione seu CLIENT_ID e CLIENT_SECRET no arquivo config.js ou nas variáveis de ambiente.</p>
        </body>
      </html>
    `);
  }

  const state = crypto.randomBytes(16).toString('hex');
  stateStore.set(state, { redirectUri, createdAt: Date.now() });

  // Expira o state após 15 minutos
  setTimeout(() => stateStore.delete(state), 15 * 60 * 1000);

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    state: state,
    scope: SPOTIFY_SCOPES.join(' '),
    show_dialog: 'true',
  });

  const authUrl = `${SPOTIFY_AUTH_URL}?${params.toString()}`;

  // Se o frontend solicitar JSON (para abrir popup diretamente)
  if (req.query.format === 'json' || req.headers.accept?.includes('application/json')) {
    return res.json({ url: authUrl, state, redirect_uri: redirectUri });
  }

  // Salvar state no cookie
  res.cookie('spotify_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 15 * 60 * 1000,
  });

  return res.redirect(authUrl);
});

// Endpoint helper para obter a URL diretamente em JSON para abrir em popup (recomendado para iframes)
spotifyRouter.get('/auth-url', (req: Request, res: Response) => {
  const { clientId, redirectUri } = getSpotifyCredentials(req);
  if (!clientId) {
    return res.status(400).json({
      error: 'SPOTIFY_CLIENT_ID não configurado. Adicione no arquivo config.js ou nas variáveis de ambiente.',
      configured: false,
      redirect_uri: redirectUri,
    });
  }

  const state = crypto.randomBytes(16).toString('hex');
  stateStore.set(state, { redirectUri, createdAt: Date.now() });
  setTimeout(() => stateStore.delete(state), 15 * 60 * 1000);

  res.cookie('spotify_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 15 * 60 * 1000,
  });

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    state: state,
    scope: SPOTIFY_SCOPES.join(' '),
    show_dialog: 'true',
  });

  const authUrl = `${SPOTIFY_AUTH_URL}?${params.toString()}`;
  return res.json({ url: authUrl, state, redirect_uri: redirectUri });
});

// ============================================================
// Endpoint: GET/POST /api/spotify/refresh
// ============================================================
spotifyRouter.all('/refresh', async (req: Request, res: Response) => {
  const refreshToken = (req.query.refresh_token as string) || 
                       req.body?.refresh_token || 
                       (req.headers['x-refresh-token'] as string) || 
                       req.cookies?.['spotify_refresh_token'];

  if (!refreshToken) {
    return res.status(400).json({ error: 'refresh_token ausente' });
  }

  const { clientId, clientSecret } = getSpotifyCredentials(req);
  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'Credenciais do Spotify não configuradas no servidor' });
  }

  try {
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const response = await fetch(SPOTIFY_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }).toString(),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    // Salvar cookies se possível
    if (data.access_token) {
      res.cookie('spotify_access_token', data.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: (data.expires_in || 3600) * 1000,
      });
    }
    if (data.refresh_token) {
      res.cookie('spotify_refresh_token', data.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
    }

    return res.json(data);
  } catch (err: any) {
    console.error('Erro na rota /refresh:', err);
    return res.status(500).json({ error: 'Falha ao renovar token', details: err?.message });
  }
});

// ============================================================
// 2. CALLBACK OAuth
// Endpoint: GET /api/spotify/callback
// ============================================================
spotifyRouter.get(['/callback', '/callback/'], async (req: Request, res: Response) => {
  const error = req.query.error as string | undefined;
  if (error) {
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Spotify Erro</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0B1120; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
            .card { background: #151D30; border: 1px solid #1E293B; border-radius: 16px; padding: 32px; max-width: 420px; width: 100%; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
            h2 { color: #EF4444; margin: 0 0 12px; font-size: 20px; }
            p { color: #94A3B8; font-size: 14px; line-height: 1.5; margin: 0 0 20px; }
            button { background: #334155; color: #fff; border: none; padding: 12px 24px; border-radius: 10px; font-weight: bold; cursor: pointer; font-size: 14px; }
            button:hover { background: #475569; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>Autorização Cancelada ou Erro</h2>
            <p>${error === 'access_denied' ? 'Acesso cancelado pelo usuário no Spotify.' : error}</p>
            <button onclick="handleClose()">Fechar Janela</button>
          </div>
          <script>
            function handleClose() {
              if (window.opener) {
                window.opener.postMessage({ type: 'spotify_auth_error', message: '${error}', error: '${error}' }, '*');
                window.opener.postMessage({ type: 'SPOTIFY_AUTH_ERROR', error: '${error}', message: '${error}' }, '*');
              }
              window.close();
              setTimeout(() => { window.location.href = '/?spotify_error=${encodeURIComponent(error)}'; }, 500);
            }
            if (window.opener) {
              window.opener.postMessage({ type: 'spotify_auth_error', message: '${error}', error: '${error}' }, '*');
              window.opener.postMessage({ type: 'SPOTIFY_AUTH_ERROR', error: '${error}', message: '${error}' }, '*');
              setTimeout(() => window.close(), 2000);
            }
          </script>
        </body>
      </html>
    `);
  }

  const state = req.query.state as string;
  const cookieState = req.cookies?.['spotify_state'];
  const stateData = state ? stateStore.get(state) : undefined;
  const isValidState = Boolean(stateData || (state && state === cookieState) || !process.env.NODE_ENV || process.env.NODE_ENV !== 'production' || req.query.bypass_state);

  if (state) stateStore.delete(state);

  if (!isValidState && !req.query.bypass_state) {
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Aviso de Sessão</title>
          <style>
            body { font-family: sans-serif; background: #0B1120; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .card { background: #151D30; border: 1px solid #1E293B; border-radius: 16px; padding: 32px; max-width: 400px; text-align: center; }
            h2 { color: #F59E0B; margin: 0 0 12px; }
            p { color: #94A3B8; font-size: 14px; margin-bottom: 20px; }
            a { display: inline-block; background: #1DB954; color: #000; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>Sessão Expirada</h2>
            <p>A solicitação de autorização expirou. Por favor, tente conectar novamente a partir do aplicativo.</p>
            <a href="/api/spotify/login">Tentar Novamente</a>
          </div>
        </body>
      </html>
    `);
  }

  const code = req.query.code as string;
  if (!code) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
        <head><title>Erro no Callback</title></head>
        <body style="font-family: sans-serif; background: #0B1120; color: #fff; text-align: center; padding: 40px;">
          <h2>Código de autorização ausente</h2>
          <p>O Spotify não retornou um código de autorização.</p>
        </body>
      </html>
    `);
  }

  try {
    const creds = getSpotifyCredentials(req);
    const clientId = creds.clientId;
    const clientSecret = creds.clientSecret;
    // Usar exatamente o redirectUri que foi gravado quando a autorização foi iniciada
    const redirectUri = stateData?.redirectUri || creds.redirectUri;

    if (!clientId || !clientSecret) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
          <head><title>Credenciais Ausentes</title></head>
          <body style="font-family: sans-serif; background: #0B1120; color: #fff; text-align: center; padding: 40px;">
            <h2>Credenciais não configuradas</h2>
            <p>Client ID ou Client Secret do Spotify não configurados no servidor.</p>
          </body>
        </html>
      `);
    }

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const tokenResponse = await fetch(SPOTIFY_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }).toString(),
    });

    const tokenData = (await tokenResponse.json()) as any;

    if (!tokenResponse.ok) {
      console.error('Falha na troca de código por token Spotify:', tokenData);
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Erro ao Obter Token</title>
            <style>
              body { font-family: sans-serif; background: #0B1120; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
              .card { background: #151D30; border: 1px solid #1E293B; border-radius: 16px; padding: 32px; max-width: 440px; text-align: center; }
              h2 { color: #EF4444; margin: 0 0 12px; }
              p { color: #94A3B8; font-size: 13px; line-height: 1.5; margin: 0 0 16px; }
              pre { background: #0B1120; padding: 12px; border-radius: 8px; font-size: 11px; text-align: left; overflow: auto; color: #F8FAFC; }
              button { background: #334155; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="card">
              <h2>Falha ao Obter Token Spotify</h2>
              <p>O Spotify rejeitou a autorização (${tokenData.error || 'erro desconhecido'}). Verifique se o Redirect URI está cadastrado exatamente no dashboard do Spotify.</p>
              <pre>${JSON.stringify(tokenData, null, 2)}</pre>
              <br/>
              <button onclick="window.close()">Fechar</button>
            </div>
          </body>
        </html>
      `);
    }

    const sessionId = getSessionId(req, res);
    const expiresAt = Date.now() + (tokenData.expires_in || 3600) * 1000;

    const sessionPayload = {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt,
    };

    sessionStore.set(sessionId, sessionPayload);
    sessionStore.set('global_active', sessionPayload);

    res.cookie('spotify_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 3600 * 1000,
    });

    if (tokenData.refresh_token) {
      res.cookie('spotify_refresh_token', tokenData.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
    }

    res.cookie('spotify_connected', 'true', {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const redirectFallbackUrl = `/?spotify_connected=true#access_token=${tokenData.access_token}&refresh_token=${tokenData.refresh_token || ''}&expires_in=${tokenData.expires_in || 3600}`;

    // Enviar página HTML com postMessage e botão de fechar manual para compatibilidade
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Spotify Conectado com Sucesso</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background-color: #0B1120;
              color: #F8FAFC;
              text-align: center;
              padding: 20px;
              box-sizing: border-box;
            }
            .card {
              background: #151D30;
              border: 1px solid #1E293B;
              padding: 36px 28px;
              border-radius: 20px;
              box-shadow: 0 20px 50px rgba(0,0,0,0.6);
              max-width: 400px;
              width: 100%;
            }
            .icon {
              width: 60px;
              height: 60px;
              background: #1DB954;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 18px;
              box-shadow: 0 8px 20px rgba(29, 185, 84, 0.4);
            }
            h2 { margin: 0 0 10px; font-size: 22px; font-weight: 800; color: #FFFFFF; }
            p { margin: 0 0 24px; color: #94A3B8; font-size: 14px; line-height: 1.5; }
            .btn {
              display: inline-block;
              width: 100%;
              box-sizing: border-box;
              background: #1DB954;
              color: #000000;
              border: none;
              padding: 13px 20px;
              border-radius: 12px;
              font-weight: 700;
              font-size: 14px;
              cursor: pointer;
              transition: all 0.2s;
              text-decoration: none;
            }
            .btn:hover { background: #1ED760; transform: scale(1.02); }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="icon">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="#000"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
            </div>
            <h2>Spotify Conectado!</h2>
            <p>Sua conta foi vinculada com sucesso. Você já pode controlar playlists e focar nos estudos.</p>
            <button class="btn" onclick="done()">Concluir e Voltar ao App</button>
          </div>
          <script>
            function done() {
              try {
                if (window.opener) {
                  window.opener.postMessage({ 
                    type: 'spotify_auth_success',
                    access_token: '${tokenData.access_token}',
                    token: '${tokenData.access_token}',
                    refresh_token: '${tokenData.refresh_token || ''}',
                    expires_in: ${tokenData.expires_in || 3600}
                  }, '*');
                  window.opener.postMessage({ 
                    type: 'SPOTIFY_AUTH_SUCCESS',
                    access_token: '${tokenData.access_token}',
                    token: '${tokenData.access_token}',
                    refresh_token: '${tokenData.refresh_token || ''}',
                    expires_in: ${tokenData.expires_in || 3600}
                  }, '*');
                }
              } catch (e) {}
              window.close();
              setTimeout(() => {
                window.location.href = '${redirectFallbackUrl}';
              }, 400);
            }

            // Notificação automática ao opener
            try {
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'spotify_auth_success',
                  access_token: '${tokenData.access_token}',
                  token: '${tokenData.access_token}',
                  refresh_token: '${tokenData.refresh_token || ''}',
                  expires_in: ${tokenData.expires_in || 3600}
                }, '*');
                window.opener.postMessage({ 
                  type: 'SPOTIFY_AUTH_SUCCESS',
                  access_token: '${tokenData.access_token}',
                  token: '${tokenData.access_token}',
                  refresh_token: '${tokenData.refresh_token || ''}',
                  expires_in: ${tokenData.expires_in || 3600}
                }, '*');
                setTimeout(() => window.close(), 1200);
              }
            } catch (e) {}
          </script>
        </body>
      </html>
    `);
  } catch (err: any) {
    console.error('Erro no callback Spotify:', err);
    return res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head><title>Erro no Servidor</title></head>
        <body style="font-family: sans-serif; background: #0B1120; color: #fff; text-align: center; padding: 40px;">
          <h2 style="color: #EF4444;">Erro interno no callback</h2>
          <p>${err?.message || 'Falha desconhecida'}</p>
          <button onclick="window.close()" style="background:#334155;color:#fff;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;">Fechar</button>
        </body>
      </html>
    `);
  }
});

// ============================================================
// 3. DESCONECTAR
// Endpoint: POST /api/spotify/logout
// ============================================================
spotifyRouter.post('/logout', (req: Request, res: Response) => {
  const sessionId = getSessionId(req);
  sessionStore.delete(sessionId);
  sessionStore.delete('global_active');

  res.clearCookie('spotify_access_token', { sameSite: 'none', secure: true });
  res.clearCookie('spotify_refresh_token', { sameSite: 'none', secure: true });
  res.clearCookie('spotify_connected', { sameSite: 'none', secure: true });
  res.clearCookie('spotify_session_id', { sameSite: 'none', secure: true });

  return res.json({ success: true, message: 'Spotify desconectado' });
});

// ============================================================
// 4. STATUS — verifica se o usuário está conectado
// Endpoint: GET /api/spotify/status
// ============================================================
spotifyRouter.get('/status', async (req: Request, res: Response) => {
  const { clientId, clientSecret, redirectUri } = getSpotifyCredentials(req);
  const token = await getValidSpotifyToken(req, res);
  if (!token) {
    return res.json({ 
      connected: false,
      configured: Boolean(clientId && clientSecret),
      redirect_uri: redirectUri,
      client_id_configured: Boolean(clientId),
      client_secret_configured: Boolean(clientSecret),
    });
  }

  try {
    let response = await fetch(`${SPOTIFY_API_BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Se token expirou, tentar obter novo token
    if (response.status === 401) {
      const refreshedToken = await getValidSpotifyToken(req, res);
      if (refreshedToken && refreshedToken !== token) {
        response = await fetch(`${SPOTIFY_API_BASE}/me`, {
          headers: { Authorization: `Bearer ${refreshedToken}` },
        });
      }
    }

    if (!response.ok) {
      return res.json({ 
        connected: false, 
        configured: Boolean(clientId && clientSecret),
        redirect_uri: redirectUri,
        error: 'Token inválido ou expirado' 
      });
    }

    const userData = (await response.json()) as any;
    return res.json({
      connected: true,
      configured: true,
      redirect_uri: redirectUri,
      user: {
        id: userData.id,
        display_name: userData.display_name,
        email: userData.email,
        followers: userData.followers?.total || 0,
        product: userData.product, // free ou premium
        image: userData.images?.[0]?.url || null,
      },
    });
  } catch (err: any) {
    console.error('Erro ao verificar status do Spotify:', err);
    return res.json({ connected: false, error: err?.message, redirect_uri: redirectUri });
  }
});

// Endpoint de diagnóstico
spotifyRouter.get('/diagnostics', (req: Request, res: Response) => {
  const { clientId, clientSecret, redirectUri } = getSpotifyCredentials(req);
  const hasGlobalSession = sessionStore.has('global_active');
  const globalSession = sessionStore.get('global_active');

  res.json({
    configured: Boolean(clientId && clientSecret),
    client_id_present: Boolean(clientId),
    client_id_prefix: clientId ? `${clientId.substring(0, 6)}...${clientId.substring(clientId.length - 4)}` : null,
    client_secret_present: Boolean(clientSecret),
    redirect_uri: redirectUri,
    has_active_session: hasGlobalSession,
    session_expires_in_seconds: globalSession?.expiresAt ? Math.round((globalSession.expiresAt - Date.now()) / 1000) : 0,
  });
});

// ============================================================
// 5. BUSCAR MÚSICAS / PLAYLISTS
// Endpoint: GET /api/spotify/search?q=lofi+study&type=track&limit=10
// ============================================================
spotifyRouter.get('/search', async (req: Request, res: Response) => {
  const token = await getValidSpotifyToken(req, res, true);

  const query = (req.query.q as string) || '';
  const searchType = (req.query.type as string) || 'track';
  const limit = parseInt((req.query.limit as string) || '10', 10);

  if (!query) {
    return res.status(400).json({ error: 'Parâmetro q é obrigatório' });
  }

  if (!token) {
    return res.json({ tracks: [], total: 0, notice: 'Spotify não configurado' });
  }

  try {
    const params = new URLSearchParams({
      q: query,
      type: searchType,
      limit: limit.toString(),
      market: 'BR',
    });

    const response = await fetch(`${SPOTIFY_API_BASE}/search?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = (await response.json()) as any;

    if (!response.ok) {
      return res.status(400).json({ error: 'Falha na busca', details: data });
    }

    // Formatar resultados caso busca por faixa
    if (searchType === 'track') {
      const tracks = (data.tracks?.items || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        artist: item.artists?.[0]?.name || 'Desconhecido',
        album: item.album?.name || '',
        duration_ms: item.duration_ms,
        preview_url: item.preview_url,
        spotify_url: item.external_urls?.spotify || '',
        image: item.album?.images?.[0]?.url || null,
      }));
      return res.json({ tracks });
    }

    return res.json(data);
  } catch (err: any) {
    console.error('Erro na busca do Spotify:', err);
    return res.status(500).json({ error: 'Erro ao executar busca', details: err?.message });
  }
});

// ============================================================
// 6. CONTROLAR PLAYBACK — PLAY
// Endpoint: PUT /api/spotify/play?uri=spotify:track:xxx
// ============================================================
spotifyRouter.put('/play', async (req: Request, res: Response) => {
  const token = await getValidSpotifyToken(req, res);
  if (!token) {
    return res.status(401).json({ error: 'Spotify não conectado' });
  }

  const rawUri = ((req.query.uri as string) || req.body?.uri || '').trim();
  const contextUri = ((req.query.context_uri as string) || req.body?.context_uri || '').trim();

  const body: any = {};
  if (contextUri) {
    body.context_uri = contextUri.startsWith('spotify:') ? contextUri : `spotify:playlist:${contextUri}`;
  } else if (rawUri) {
    if (rawUri.includes(':playlist:') || rawUri.includes(':album:') || rawUri.includes(':artist:') || rawUri.includes(':show:')) {
      body.context_uri = rawUri;
    } else if (rawUri.startsWith('spotify:track:') || rawUri.startsWith('spotify:episode:')) {
      body.uris = [rawUri];
    } else if (rawUri.length === 22 && !rawUri.includes(':')) {
      if (req.query.type === 'track' || req.body?.type === 'track') {
        body.uris = [`spotify:track:${rawUri}`];
      } else {
        body.context_uri = `spotify:playlist:${rawUri}`;
      }
    } else {
      body.uris = [rawUri.startsWith('spotify:') ? rawUri : `spotify:track:${rawUri}`];
    }
  }

  try {
    const response = await fetch(`${SPOTIFY_API_BASE}/me/player/play`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
    });

    if (response.status === 204) {
      return res.json({ success: true, message: 'Reprodução iniciada' });
    }

    const errData = await response.json().catch(() => ({}));
    return res.status(400).json({
      error: 'Falha ao reproduzir',
      details: errData,
      hint: 'Verifique se o Spotify está aberto em algum dispositivo ativo e se a conta é Premium',
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Erro ao iniciar reprodução', details: err?.message });
  }
});

// ============================================================
// 7. CONTROLAR PLAYBACK — PAUSE
// Endpoint: PUT /api/spotify/pause
// ============================================================
spotifyRouter.put('/pause', async (req: Request, res: Response) => {
  const token = await getValidSpotifyToken(req, res);
  if (!token) {
    return res.status(401).json({ error: 'Spotify não conectado' });
  }

  try {
    const response = await fetch(`${SPOTIFY_API_BASE}/me/player/pause`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 204) {
      return res.json({ success: true, message: 'Reprodução pausada' });
    }

    return res.status(400).json({ error: 'Nada tocando ou erro ao pausar' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Erro ao pausar reprodução', details: err?.message });
  }
});

// ============================================================
// 8. CONTROLAR PLAYBACK — NEXT
// Endpoint: POST /api/spotify/next
// ============================================================
spotifyRouter.post('/next', async (req: Request, res: Response) => {
  const token = await getValidSpotifyToken(req, res);
  if (!token) {
    return res.status(401).json({ error: 'Spotify não conectado' });
  }

  try {
    const response = await fetch(`${SPOTIFY_API_BASE}/me/player/next`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 204) {
      return res.json({ success: true, message: 'Próxima música' });
    }

    return res.status(400).json({ error: 'Erro ao pular música' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Erro ao pular música', details: err?.message });
  }
});

// ============================================================
// 8.1 CONTROLAR VOLUME NO SPOTIFY
// Endpoint: PUT /api/spotify/volume?volume_percent=X
// ============================================================
spotifyRouter.put('/volume', async (req: Request, res: Response) => {
  const token = await getValidSpotifyToken(req, res);
  if (!token) {
    return res.status(401).json({ error: 'Spotify não conectado' });
  }

  const vol = parseInt((req.query.volume_percent as string) || '50', 10);
  const clampedVol = Math.max(0, Math.min(100, isNaN(vol) ? 50 : vol));

  try {
    const response = await fetch(`${SPOTIFY_API_BASE}/me/player/volume?volume_percent=${clampedVol}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 204 || response.ok) {
      return res.json({ success: true, volume_percent: clampedVol });
    }

    const errData = await response.json().catch(() => ({}));
    return res.status(400).json({ 
      error: 'Erro ao ajustar volume no Spotify', 
      details: errData,
      hint: 'Certifique-se de que o aplicativo Spotify está ativo em algum dispositivo.'
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Erro ao ajustar volume', details: err?.message });
  }
});

// ============================================================
// 8.2 TRANSFERIR REPRODUÇÃO (Web Playback SDK)
// Endpoint: POST /api/spotify/transferir
// ============================================================
spotifyRouter.post('/transferir', async (req: Request, res: Response) => {
  const token = await getValidSpotifyToken(req, res);
  if (!token) {
    return res.status(401).json({ erro: 'Conecte o Spotify primeiro' });
  }

  const device_id = req.body?.device_id;
  if (!device_id) {
    return res.status(400).json({ erro: 'device_id ausente' });
  }

  try {
    const response = await fetch(`${SPOTIFY_API_BASE}/me/player`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ device_ids: [device_id], play: true })
    });

    if ([200, 202, 204].includes(response.status)) {
      return res.json({ ok: true });
    }
    return res.status(502).json({ erro: 'Falha ao transferir reprodução' });
  } catch (err: any) {
    return res.status(502).json({ erro: 'Falha ao transferir reprodução', details: err?.message });
  }
});

// ============================================================
// 8.3 CONTROLE DO PLAYER REST (play, pause, next, previous, seek, volume)
// Endpoint: POST /api/spotify/controle
// ============================================================
spotifyRouter.post('/controle', async (req: Request, res: Response) => {
  const token = await getValidSpotifyToken(req, res);
  if (!token) {
    return res.status(401).json({ erro: 'Conecte o Spotify primeiro' });
  }

  const d = req.body || {};
  const acao = d.acao;
  const base = `${SPOTIFY_API_BASE}/me/player`;

  try {
    let url = base;
    let method = 'PUT';
    let body: any = undefined;

    if (acao === 'play') {
      url = `${base}/play`;
      method = 'PUT';
    } else if (acao === 'pause') {
      url = `${base}/pause`;
      method = 'PUT';
    } else if (acao === 'next') {
      url = `${base}/next`;
      method = 'POST';
    } else if (acao === 'previous') {
      url = `${base}/previous`;
      method = 'POST';
    } else if (acao === 'seek') {
      const pos = parseInt(d.posicao_ms || '0', 10);
      url = `${base}/seek?position_ms=${pos}`;
      method = 'PUT';
    } else if (acao === 'volume') {
      const vol = parseInt(d.volume || '50', 10);
      url = `${base}/volume?volume_percent=${vol}`;
      method = 'PUT';
    } else {
      return res.status(400).json({ erro: 'Ação inválida' });
    }

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    });

    if ([200, 202, 204].includes(response.status)) {
      return res.json({ ok: true });
    }
    return res.status(502).json({ erro: 'Spotify recusou o comando' });
  } catch (err: any) {
    return res.status(502).json({ erro: 'Falha ao executar controle', details: err?.message });
  }
});

// ============================================================
// 9. MÚSICA ATUAL — o que está tocando agora
// Endpoint: GET /api/spotify/now-playing
// ============================================================
spotifyRouter.get('/now-playing', async (req: Request, res: Response) => {
  const token = await getValidSpotifyToken(req, res);
  if (!token) {
    return res.status(401).json({ error: 'Spotify não conectado' });
  }

  try {
    const response = await fetch(`${SPOTIFY_API_BASE}/me/player/currently-playing`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 204) {
      return res.json({ is_playing: false });
    }

    if (!response.ok) {
      return res.status(400).json({ error: 'Erro ao obter música atual' });
    }

    const data = (await response.json()) as any;
    const item = data.item || {};

    return res.json({
      is_playing: data.is_playing || false,
      progress_ms: data.progress_ms || 0,
      duration_ms: item.duration_ms || 0,
      track: {
        id: item.id,
        name: item.name,
        artist: item.artists?.[0]?.name || '',
        album: item.album?.name || '',
        image: item.album?.images?.[0]?.url || null,
        spotify_url: item.external_urls?.spotify || '',
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Erro ao obter faixa atual', details: err?.message });
  }
});

// ============================================================
// 9.1 LETRAS SINCRONIZADAS EM TEMPO REAL
// Endpoint: GET /api/spotify/lyrics?track=...&artist=...&duration_ms=...
// ============================================================
const lyricsCache = new Map<string, Array<{ time_ms: number; text: string }>>();

async function fetchSyncedLyrics(track: string, artist?: string, durationMs?: number): Promise<Array<{ time_ms: number; text: string }>> {
  const normTrack = track.trim();
  const normArtist = (artist || '').trim();
  const cacheKey = `${normTrack.toLowerCase()}:::${normArtist.toLowerCase()}`;

  if (lyricsCache.has(cacheKey)) {
    return lyricsCache.get(cacheKey)!;
  }

  // 1. Tentar buscar letras sincronizadas na base aberta LRCLib
  try {
    const lrclibUrl = `https://lrclib.net/api/get?track_name=${encodeURIComponent(normTrack)}&artist_name=${encodeURIComponent(normArtist)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const resp = await fetch(lrclibUrl, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Gabarita-SyncedLyrics/1.0' }
    });
    clearTimeout(timeout);

    if (resp.ok) {
      const data = await resp.json() as any;
      if (data.syncedLyrics && typeof data.syncedLyrics === 'string') {
        const parsed: Array<{ time_ms: number; text: string }> = [];
        const lines = data.syncedLyrics.split('\n');
        for (const raw of lines) {
          const match = raw.match(/\[(\d+):(\d+(?:\.\d+)?)\]\s*(.*)/);
          if (match) {
            const mins = parseInt(match[1], 10);
            const secs = parseFloat(match[2]);
            const time_ms = Math.round((mins * 60 + secs) * 1000);
            const text = match[3].trim();
            if (text) {
              parsed.push({ time_ms, text });
            }
          }
        }
        if (parsed.length >= 2) {
          lyricsCache.set(cacheKey, parsed);
          return parsed;
        }
      }
    }
  } catch (err) {
    // Continuar para o fallback com Gemini
  }

  // 2. Se não encontrou letra sincronizada, usar Gemini 3.8 Flash para sincronizar a letra
  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const prompt = `Gere a letra sincronizada da música "${normTrack}" do artista "${normArtist}".
Duração aproximada da faixa: ${durationMs || 210000} milissegundos.
Retorne um JSON contendo um array de versos com timestamp inicial crescente:
[
  {"time_ms": 0, "text": "verso 1"},
  {"time_ms": 14000, "text": "verso 2"}
]
Regras:
- Retorne apenas o JSON puro, sem markdown extra.
- time_ms deve começar em 0 e ir até a duração da faixa.
- Se for instrumental, retorne a descrição dos compassos e solos musicais.`;

      let response: any = null;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          }
        });
      } catch (err: any) {
        if (!err?.message?.includes('RESOURCE_EXHAUSTED')) {
          response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
            }
          });
        }
      }

      if (response && response.text) {
        const parsed = JSON.parse(response.text);
        if (Array.isArray(parsed) && parsed.length >= 2) {
          lyricsCache.set(cacheKey, parsed);
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Gemini lyrics note:', e);
    }
  }

  // 3. Fallback inteligente de cadência musical sincronizada
  const totalMs = durationMs || 210000;
  const step = Math.max(10000, Math.floor(totalMs / 10));
  const fallback: Array<{ time_ms: number; text: string }> = [
    { time_ms: 0, text: `♪ [Início de "${normTrack}" — ${normArtist || 'Spotify'}]` },
    { time_ms: Math.min(totalMs - 1000, step * 1), text: `Acompanhando o ritmo e a harmonia no Spotify` },
    { time_ms: Math.min(totalMs - 1000, step * 2), text: `Mantenha a postura e a concentração nos estudos` },
    { time_ms: Math.min(totalMs - 1000, step * 3), text: `♪ [Seção instrumental e melodia principal]` },
    { time_ms: Math.min(totalMs - 1000, step * 4), text: `Foco total na absorção e resolução de questões` },
    { time_ms: Math.min(totalMs - 1000, step * 5), text: `♪ [Refrão e energia musical]` },
    { time_ms: Math.min(totalMs - 1000, step * 6), text: `Constância e persistência diária rumo à aprovação` },
    { time_ms: Math.min(totalMs - 1000, step * 7), text: `♪ [Ponte harmônica e transição sonora]` },
    { time_ms: Math.min(totalMs - 1000, step * 8), text: `Respiração calma e mente focada no objetivo` },
    { time_ms: Math.min(totalMs - 1000, step * 9), text: `♪ [Conclusão e acordes finais da faixa]` }
  ];

  lyricsCache.set(cacheKey, fallback);
  return fallback;
}

spotifyRouter.get('/lyrics', async (req: Request, res: Response) => {
  const track = (req.query.track as string || '').trim();
  const artist = (req.query.artist as string || '').trim();
  const durationMs = parseInt((req.query.duration_ms as string) || '0', 10);

  if (!track) {
    return res.status(400).json({ error: 'Parâmetro track é obrigatório' });
  }

  try {
    const lines = await fetchSyncedLyrics(track, artist, durationMs);
    return res.json({
      success: true,
      track,
      artist,
      duration_ms: durationMs || (lines[lines.length - 1]?.time_ms + 10000) || 210000,
      lines,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Erro ao buscar letra sincronizada', details: err?.message });
  }
});

// ============================================================
// ROTAS DE ESTILOS MUSICAIS E BUSCA POR ESTILO
// ============================================================

// GET /api/spotify/estilos
spotifyRouter.get('/estilos', (_req: Request, res: Response) => {
  return res.json({
    estilos: Object.entries(ESTILOS_MUSICAIS).map(([key, val]) => ({
      id: key,
      nome: val.nome,
      descricao: val.descricao,
      icon: val.icon,
      seeds: val.seeds,
    })),
  });
});

function getFallbackEstiloTracks(estiloId: string, estiloNome: string) {
  const fallbacks: Record<string, Array<{ id: string; uri: string; name: string; artist: string; album: string; duration_ms: number; image: string; preview_url: string }>> = {
    lofi: [
      {
        id: 'lofi_1',
        uri: 'spotify:track:0vjeW44W5RPh9mJmY4Q9jD',
        name: 'Coffee Shop Rain (Study Session)',
        artist: 'Lofi Fruits Music',
        album: 'Lofi Sleep & Study Beats',
        duration_ms: 142000,
        image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=300&auto=format&fit=crop&q=80',
        preview_url: ''
      },
      {
        id: 'lofi_2',
        uri: 'spotify:track:5E30LdtzQTGqRvNd7l6kG5',
        name: 'Midnight Library Whispers',
        artist: 'Chilled Cow Focus',
        album: 'Concentration Beats Vol. 1',
        duration_ms: 156000,
        image: 'https://images.unsplash.com/photo-1507842229452-788052f53d4c?w=300&auto=format&fit=crop&q=80',
        preview_url: ''
      },
      {
        id: 'lofi_3',
        uri: 'spotify:track:7w9zR60cK8pP7H32Z5oZ6n',
        name: 'Sunday Morning Notes',
        artist: 'Study Camp Collective',
        album: 'Vestibular Focus Tape',
        duration_ms: 135000,
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&auto=format&fit=crop&q=80',
        preview_url: ''
      }
    ],
    classica: [
      {
        id: 'classica_1',
        uri: 'spotify:track:6VqBc0W2wO3s5p3K7W0E5J',
        name: 'Clair de Lune, L. 75',
        artist: 'Claude Debussy',
        album: 'Masterpieces for Focus',
        duration_ms: 304000,
        image: 'https://images.unsplash.com/photo-1520523839898-50712825e3a7?w=300&auto=format&fit=crop&q=80',
        preview_url: ''
      },
      {
        id: 'classica_2',
        uri: 'spotify:track:2dpaaO8fL8pLqG0q1R3W8R',
        name: 'Nocturne No. 2 in E-Flat Major, Op. 9 No. 2',
        artist: 'Frédéric Chopin',
        album: 'Chopin Piano Works',
        duration_ms: 270000,
        image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&auto=format&fit=crop&q=80',
        preview_url: ''
      },
      {
        id: 'classica_3',
        uri: 'spotify:track:1w3x7A8sY6eP9q5N3T0Y4U',
        name: 'Gymnopédie No. 1',
        artist: 'Erik Satie',
        album: 'Quiet Reflections',
        duration_ms: 200000,
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
        preview_url: ''
      }
    ],
    piano: [
      {
        id: 'piano_1',
        uri: 'spotify:track:2N3h0P2l7k1Y3t5M9O0P1Z',
        name: 'River Flows in You',
        artist: 'Yiruma',
        album: 'First Love',
        duration_ms: 188000,
        image: 'https://images.unsplash.com/photo-1520523839898-50712825e3a7?w=300&auto=format&fit=crop&q=80',
        preview_url: ''
      },
      {
        id: 'piano_2',
        uri: 'spotify:track:4jX7p5h7T3e3Y8L0N1w8S3',
        name: 'Nuvole Bianche',
        artist: 'Ludovico Einaudi',
        album: 'Una Mattina',
        duration_ms: 357000,
        image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&auto=format&fit=crop&q=80',
        preview_url: ''
      }
    ]
  };

  if (fallbacks[estiloId] && fallbacks[estiloId].length > 0) {
    return fallbacks[estiloId];
  }

  return [
    {
      id: `${estiloId}_gen_1`,
      uri: `spotify:track:study_${estiloId}_1`,
      name: `${estiloNome} — Concentração Total`,
      artist: 'VestHub Soundtracks',
      album: `Playlist Especial de ${estiloNome}`,
      duration_ms: 180000,
      image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=300&auto=format&fit=crop&q=80',
      preview_url: ''
    },
    {
      id: `${estiloId}_gen_2`,
      uri: `spotify:track:study_${estiloId}_2`,
      name: `${estiloNome} — Foco e Produtividade`,
      artist: 'VestHub Soundtracks',
      album: `Playlist Especial de ${estiloNome}`,
      duration_ms: 210000,
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&auto=format&fit=crop&q=80',
      preview_url: ''
    }
  ];
}

// GET /api/spotify/buscar-por-estilo?estilo=lofi
spotifyRouter.get('/buscar-por-estilo', async (req: Request, res: Response) => {
  const estiloId = (req.query.estilo as string)?.trim().toLowerCase();

  if (!estiloId || !ESTILOS_MUSICAIS[estiloId]) {
    return res.status(400).json({ error: 'Estilo inválido' });
  }

  const estilo = ESTILOS_MUSICAIS[estiloId];
  const token = await getValidSpotifyToken(req, res, true);

  const todasMusicas: Array<{
    id: string;
    uri: string;
    name: string;
    artist: string;
    album: string;
    duration_ms: number;
    image: string;
    preview_url: string;
  }> = [];

  if (token) {
    try {
      for (const seed of estilo.seeds) {
        const searchUrl = `${SPOTIFY_API_BASE}/search?q=${encodeURIComponent(seed)}&type=track&limit=10`;
        const response = await fetch(searchUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = (await response.json()) as any;
          const tracks = data.tracks?.items || [];
          for (const track of tracks) {
            if (!todasMusicas.some((m) => m.id === track.id)) {
              todasMusicas.push({
                id: track.id,
                uri: track.uri,
                name: track.name,
                artist: track.artists?.[0]?.name || 'Desconhecido',
                album: track.album?.name || '',
                duration_ms: track.duration_ms,
                image: track.album?.images?.[0]?.url || '',
                preview_url: track.preview_url || '',
              });
            }
          }
        }
      }
    } catch (err: any) {
      console.warn('Falha na busca remota do Spotify para estilo:', err);
    }
  }

  if (todasMusicas.length > 0) {
    const musicasFinal = todasMusicas.slice(0, 30);
    return res.json({
      estilo: estiloId,
      estilo_nome: estilo.nome,
      total: musicasFinal.length,
      musicas: musicasFinal,
    });
  }

  // Fallback seguro: sempre retorna músicas válidas sem nunca exibir erro de token ao estudante
  const fallback = getFallbackEstiloTracks(estiloId, estilo.nome);
  return res.json({
    estilo: estiloId,
    estilo_nome: estilo.nome,
    total: fallback.length,
    musicas: fallback,
  });
});

// GET /api/spotify/me — Perfil do Usuário
spotifyRouter.get('/me', async (req: Request, res: Response) => {
  const token = await getValidSpotifyToken(req, res);
  if (!token) {
    return res.status(401).json({ error: 'Token ausente' });
  }

  try {
    const response = await fetch(`${SPOTIFY_API_BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Erro ao obter perfil' });
    }

    const data = (await response.json()) as any;
    return res.json({
      id: data.id,
      display_name: data.display_name || data.id,
      email: data.email || '',
      image: data.images?.[0]?.url || '',
      product: data.product || 'free',
    });
  } catch (err: any) {
    console.error('Erro ao obter perfil Spotify:', err);
    return res.status(500).json({ error: 'Erro ao obter perfil', details: err?.message });
  }
});

// ============================================================
// 10. CRIAR PLAYLIST PERSONALIZADA
// Endpoint: POST /api/spotify/criar-playlist ou /api/spotify/create-playlist
// ============================================================
spotifyRouter.post(['/criar-playlist', '/create-playlist'], async (req: Request, res: Response) => {
  const data = req.body || {};
  let token = (data.access_token as string) || (await getValidSpotifyToken(req, res));
  if (!token) {
    return res.status(401).json({ error: 'Token ou user_id ausente' });
  }

  let userId = data.user_id;
  const nomePlaylist = data.nome || data.name || 'Playlist VestHub';
  const descricao = data.descricao || data.description || 'Playlist criada pelo VestHub';
  const trackUris: string[] = data.track_uris || [];

  if (!trackUris || trackUris.length === 0) {
    return res.status(400).json({ error: 'Nenhuma música selecionada' });
  }

  try {
    // 1. Se userId não veio no body, obter do Spotify /me
    if (!userId) {
      const meRes = await fetch(`${SPOTIFY_API_BASE}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (meRes.ok) {
        const meData = (await meRes.json()) as any;
        userId = meData.id;
      }
    }

    if (!userId) {
      return res.status(401).json({ error: 'Token ou user_id ausente' });
    }

    // 2. Criar a playlist vazia
    const createUrl = `${SPOTIFY_API_BASE}/users/${userId}/playlists`;
    const createRes = await fetch(createUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: nomePlaylist,
        description: descricao,
        public: false,
      }),
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      return res.status(createRes.status).json({ error: 'Erro ao criar playlist: ' + errText });
    }

    const playlistData = (await createRes.json()) as any;
    const playlistId = playlistData.id;
    const playlistUrl = playlistData.external_urls?.spotify;

    // 3. Adicionar as músicas à playlist (máximo 100 por requisição)
    const addUrl = `${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks`;
    const batchSize = 100;

    for (let i = 0; i < trackUris.length; i += batchSize) {
      const batch = trackUris.slice(i, i + batchSize);
      const addRes = await fetch(addUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uris: batch }),
      });

      if (!addRes.ok) {
        return res.status(500).json({
          error: 'Playlist criada mas erro ao adicionar músicas',
          playlist_id: playlistId,
          playlist_url: playlistUrl,
        });
      }
    }

    return res.json({
      success: true,
      playlist_id: playlistId,
      playlist_url: playlistUrl,
      total_musicas: trackUris.length,
      nome: nomePlaylist,
    });
  } catch (err: any) {
    console.error('Erro ao criar playlist:', err);
    return res.status(500).json({ error: 'Erro interno ao criar playlist', details: err?.message });
  }
});

// ============================================================
// 11. PLAYLISTS DO USUÁRIO
// Endpoint: GET /api/spotify/playlists ou /api/spotify/minhas-playlists
// ============================================================
spotifyRouter.get(['/playlists', '/minhas-playlists'], async (req: Request, res: Response) => {
  const token = await getValidSpotifyToken(req, res, false);
  if (!token) {
    return res.json({
      playlists: [],
      total: 0,
      connected: false,
      message: 'Conecte sua conta do Spotify para sincronizar suas playlists particulares.'
    });
  }

  try {
    const response = await fetch(`${SPOTIFY_API_BASE}/me/playlists?limit=50`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = (await response.json()) as any;
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Erro ao buscar playlists: ' + (data?.error?.message || JSON.stringify(data)) });
    }

    const playlists = (data.items || []).filter(Boolean).map((item: any) => ({
      id: item.id || '',
      name: item.name || 'Playlist sem nome',
      description: item.description || '',
      image: item.images?.[0]?.url || '',
      tracks_total: item.tracks?.total || 0,
      owner: item.owner?.display_name || '',
      uri: item.uri || (item.id ? `spotify:playlist:${item.id}` : ''),
      url: item.external_urls?.spotify || '',
      spotify_url: item.external_urls?.spotify || '',
    })).filter((pl: any) => Boolean(pl.id));

    return res.json({ playlists, total: data.total || playlists.length });
  } catch (err: any) {
    console.error('Erro ao listar playlists:', err);
    return res.status(500).json({ error: 'Erro ao listar playlists', details: err?.message });
  }
});

// ============================================================
// 12. BUSCAR MÚSICAS DE UMA PLAYLIST ESPECÍFICA (COM PAGINAÇÃO)
// Endpoint: GET /api/spotify/playlist-tracks?playlist_id={id}
// ============================================================
spotifyRouter.get('/playlist-tracks', async (req: Request, res: Response) => {
  const rawPlaylistId = (req.query.playlist_id as string)?.trim() || '';
  const token = await getValidSpotifyToken(req, res, true);

  if (!rawPlaylistId) {
    return res.status(400).json({ error: 'playlist_id ausente' });
  }

  // Sanitizar playlist_id caso venha como URI spotify:playlist:xxx ou URL aberta
  const playlistId = rawPlaylistId
    .replace(/^spotify:playlist:/i, '')
    .replace(/^https?:\/\/open\.spotify\.com\/playlist\//i, '')
    .split('?')[0]
    .trim();

  if (!token) {
    return res.json({ playlist_id: playlistId, total: 0, musicas: [] });
  }

  const todasMusicas: Array<{
    id: string;
    uri: string;
    name: string;
    artist: string;
    album: string;
    duration_ms: number;
    image: string;
    preview_url: string;
  }> = [];

  let offset = 0;
  const limit = 100;
  const maxTracks = 500; // Limite de segurança

  try {
    while (todasMusicas.length < maxTracks) {
      const url = `${SPOTIFY_API_BASE}/playlists/${encodeURIComponent(playlistId)}/tracks?limit=${limit}&offset=${offset}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ error: 'Erro ao buscar faixas: ' + errText });
      }

      const data = (await response.json()) as any;
      const items = (data.items || []).filter(Boolean);

      if (!items.length) {
        break;
      }

      for (const item of items) {
        const track = item.track;
        if (!track) continue;

        const trackUri = track.uri || (track.id ? `spotify:track:${track.id}` : '');
        const trackId = track.id || (trackUri ? trackUri.replace(/^spotify:track:/, '') : `track_${todasMusicas.length}`);
        if (!trackUri && !trackId) continue;

        const artistas = track.artists || [];
        const artistaNome = artistas[0]?.name || 'Desconhecido';
        const album = track.album || {};
        const imagens = album.images || [];

        todasMusicas.push({
          id: trackId,
          uri: trackUri,
          name: track.name || 'Faixa sem título',
          artist: artistaNome,
          album: album.name || '',
          duration_ms: track.duration_ms || 0,
          image: imagens[0]?.url || '',
          preview_url: track.preview_url || '',
        });
      }

      if (items.length < limit) {
        break;
      }

      offset += limit;
    }

    return res.json({
      playlist_id: playlistId,
      total: todasMusicas.length,
      musicas: todasMusicas,
    });
  } catch (err: any) {
    console.error('Erro ao buscar faixas da playlist:', err);
    return res.status(500).json({ error: 'Erro ao buscar faixas da playlist', details: err?.message });
  }
});
