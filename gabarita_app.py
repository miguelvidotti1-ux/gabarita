# ============================================================
# gabarita_app.py — APLICAÇÃO COMPLETA EM ARQUIVO ÚNICO
# Backend (Flask + SQLAlchemy + JWT + Mercado Pago)
# + Frontend embutido (landing, splash, login, VIP, planos)
# Executar: python gabarita_app.py
# ============================================================

import os
import time
import secrets
import secrets as _secrets
import pathlib
import requests
from datetime import timedelta, datetime
import base64
import json as _json
import io

from flask import Flask, request, jsonify, render_template_string
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import (JWTManager, jwt_required,
                                create_access_token, get_jwt_identity)

# ============================================================
# BLOCO 7.1 — CONFIGURAÇÃO SEGURA
# ============================================================

def _jwt_secret():
    """Gera e persiste um secret aleatório se não houver variável de ambiente."""
    f = pathlib.Path('.jwt_secret')
    if f.exists():
        return f.read_text()
    s = secrets.token_hex(32)
    f.write_text(s)
    return s

app = Flask(__name__)
app.config.update(
    SQLALCHEMY_DATABASE_URI=os.environ.get('DATABASE_URL', 'sqlite:///gabarita.db'),
    SQLALCHEMY_TRACK_MODIFICATIONS=False,
    JWT_SECRET_KEY=os.environ.get('JWT_SECRET_KEY') or _jwt_secret(),
    JWT_ACCESS_TOKEN_EXPIRES=timedelta(hours=24),
    MAX_CONTENT_LENGTH=50 * 1024 * 1024,
)
MP_ACCESS_TOKEN = os.environ.get('MP_ACCESS_TOKEN', '')   # vem do .env
APP_URL = os.environ.get('APP_URL', 'https://gabarita.ai.studio')

SPOTIFY_CLIENT_ID     = os.environ.get('SPOTIFY_CLIENT_ID', 'cole-o-client-id-do-seu-app-spotify')
SPOTIFY_CLIENT_SECRET = os.environ.get('SPOTIFY_CLIENT_SECRET', 'M25032010@')
SPOTIFY_REDIRECT_URI  = os.environ.get('SPOTIFY_REDIRECT_URI', APP_URL + '/api/spotify/callback')
GEMINI_KEY            = os.environ.get('GEMINI_API_KEY', 'AQ.Ab8RN6KswUxiS3jRLTwp1HHFOBhs8dHBH65nhJBZeSPDGEwq4A')

# Escopo mínimo para o recurso de letra sincronizada
SPOTIFY_SCOPE = 'user-read-currently-playing user-read-playback-state'

db = SQLAlchemy(app)
jwt = JWTManager(app)

# ============================================================
# MODELS
# ============================================================

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    nome = db.Column(db.String(120), nullable=False)
    senha_hash = db.Column(db.String(256), nullable=False)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)


class Plano(db.Model):
    __tablename__ = 'planos'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(50), unique=True, nullable=False)
    preco_centavos = db.Column(db.Integer, nullable=False)
    duracao_dias = db.Column(db.Integer, nullable=False)
    descricao = db.Column(db.String(300))


class Assinatura(db.Model):
    __tablename__ = 'assinaturas'
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    plano_nome = db.Column(db.String(50), nullable=False)
    mp_payment_id = db.Column(db.String(64))
    status = db.Column(db.String(20), default='pendente')
    expira_em = db.Column(db.DateTime)
    criada_em = db.Column(db.DateTime, default=datetime.utcnow)


class RespostaPesquisa(db.Model):
    __tablename__ = 'respostas_pesquisa'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120))
    email = db.Column(db.String(120))
    whatsapp = db.Column(db.String(50))
    dados_json = db.Column(db.Text)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)


class SpotifyToken(db.Model):
    __tablename__ = 'spotify_tokens'
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), primary_key=True)
    access_token = db.Column(db.String(300), nullable=False)
    refresh_token = db.Column(db.String(300), nullable=False)
    expira_em = db.Column(db.DateTime, nullable=False)


class Flashcard(db.Model):
    __tablename__ = 'flashcards'
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    materia = db.Column(db.String(100), default='Geral')
    frente = db.Column(db.Text, nullable=False)
    verso = db.Column(db.Text, nullable=False)
    dificuldade = db.Column(db.String(10), default='medio')   # facil | medio | dificil
    acertos = db.Column(db.Integer, default=0)
    erros = db.Column(db.Integer, default=0)
    criado_em = db.Column(db.DateTime, default=datetime.utcnow)

# ============================================================
# BLOCO 7.2 — SEED DOS 4 PLANOS (upsert: cria ou atualiza)
# ============================================================

PLANOS_PADRAO = [
    ('mensal',     3990,  30, 'Acesso completo por 30 dias, sem fidelidade'),
    ('trimestral', 9990,  90, '3 meses de acesso completo — economia de R$ 19,80'),
    ('semestral', 17990, 180, '6 meses de acesso completo — economia de R$ 59,50'),
    ('anual',     29990, 365, 'Acesso completo por 12 meses — equivalente a R$ 24,99/mês'),
]

def seed():
    with app.app_context():
        db.create_all()
        for nome, cent, dias, desc in PLANOS_PADRAO:
            p = Plano.query.filter_by(nome=nome).first()
            if p:
                p.preco_centavos, p.duracao_dias, p.descricao = cent, dias, desc
            else:
                db.session.add(Plano(nome=nome, preco_centavos=cent,
                                     duracao_dias=dias, descricao=desc))
        db.session.commit()

# ============================================================
# MÓDULO SPOTIFY + LETRA — versão corrigida
# P1: token por usuário com refresh automático
# P6: cache de letras com TTL e limite
# P7: endpoints protegidos por JWT
# ============================================================

def token_do_usuario(uid):
    """Devolve um access_token válido do usuário, renovando se necessário."""
    t = SpotifyToken.query.get(uid)
    if not t:
        return None
    if t.expira_em > datetime.utcnow() + timedelta(seconds=60):
        return t.access_token                      # ainda válido
    r = requests.post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token', 'refresh_token': t.refresh_token,
        'client_id': SPOTIFY_CLIENT_ID, 'client_secret': SPOTIFY_CLIENT_SECRET}, timeout=15)
    if r.status_code != 200:
        return None                                # refresh falhou → usuário reconecta
    d = r.json()
    t.access_token = d['access_token']
    t.expira_em = datetime.utcnow() + timedelta(seconds=d.get('expires_in', 3600))
    if 'refresh_token' in d:
        t.refresh_token = d['refresh_token']
    db.session.commit()
    return t.access_token


# ---------- Fluxo OAuth: conectar e callback ----------

_estados_oauth = {}   # estado anti-CSRF -> usuario_id (expira em 10 min)

@app.route('/api/spotify/conectar')
@jwt_required()
def spotify_conectar():
    """Gera a URL de autorização do Spotify para o usuário logado."""
    estado = _secrets.token_urlsafe(24)
    _estados_oauth[estado] = (int(get_jwt_identity()), time.time() + 600)
    params = {
        'client_id': SPOTIFY_CLIENT_ID,
        'response_type': 'code',
        'redirect_uri': SPOTIFY_REDIRECT_URI,
        'scope': SPOTIFY_SCOPE,
        'state': estado,
    }
    return jsonify({'url': 'https://accounts.spotify.com/authorize?' +
                           '&'.join(f'{k}={requests.utils.quote(str(v))}' for k, v in params.items())})


@app.route('/api/spotify/callback')
def spotify_callback():
    """Recebe o código do Spotify e salva os tokens do usuário."""
    code = request.args.get('code', '')
    estado = request.args.get('state', '')
    entrada = _estados_oauth.pop(estado, None)
    if not code or not entrada or time.time() > entrada[1]:
        return jsonify({'erro': 'Sessão de conexão expirada. Tente conectar novamente.'}), 400
    uid = entrada[0]
    r = requests.post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code', 'code': code,
        'redirect_uri': SPOTIFY_REDIRECT_URI,
        'client_id': SPOTIFY_CLIENT_ID, 'client_secret': SPOTIFY_CLIENT_SECRET}, timeout=15)
    if r.status_code != 200:
        return jsonify({'erro': 'Spotify recusou a autorização. Tente de novo.'}), 502
    d = r.json()
    t = SpotifyToken.query.get(uid)
    if t:
        t.access_token = d['access_token']
        t.refresh_token = d.get('refresh_token', t.refresh_token)
        t.expira_em = datetime.utcnow() + timedelta(seconds=d.get('expires_in', 3600))
    else:
        t = SpotifyToken(usuario_id=uid, access_token=d['access_token'],
                         refresh_token=d.get('refresh_token', ''),
                         expira_em=datetime.utcnow() + timedelta(seconds=d.get('expires_in', 3600)))
        db.session.add(t)
    db.session.commit()
    # Página simples que fecha o popup e avisa o app
    return render_template_string(
        '<script>window.opener.postMessage("spotify-ok","*");'
        'document.body.innerHTML="<p style=\'font-family:sans-serif;text-align:center;'
        'padding:40px\'>✅ Spotify conectado! Pode fechar esta janela.</p>";</script>')


@app.route('/api/spotify/desconectar', methods=['POST'])
@jwt_required()
def spotify_desconectar():
    t = SpotifyToken.query.get(int(get_jwt_identity()))
    if t:
        db.session.delete(t)
        db.session.commit()
    return jsonify({'ok': True})


def _ocr_gemini(b64, mime):
    """Transcreve texto de imagem via Gemini Vision."""
    r = requests.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
        '?key=' + GEMINI_KEY,
        json={'contents': [{'parts': [
            {'text': 'Transcreva TODO o texto desta imagem, mantendo a estrutura e os destaques. '
                     'Responda apenas com o texto transcrito, sem comentários.'},
            {'inline_data': {'mime_type': mime, 'data': b64}}
        ]}]}, timeout=60)
    if r.status_code != 200:
        return ''
    return r.json()['candidates'][0]['content']['parts'][0]['text']


def _extrair_pdf(arquivo):
    """Extrai texto de PDF (instale: pip install PyPDF2)."""
    try:
        from PyPDF2 import PdfReader
        leitor = PdfReader(io.BytesIO(arquivo.read()))
        return '\n'.join((p.extract_text() or '') for p in leitor.pages)
    except Exception:
        return ''


PROMPTS_DIFICULDADE = {
    'facil':   'Perguntas diretas de definição e memorização, um conceito por cartão, respostas curtas.',
    'medio':   'Perguntas de aplicação e compreensão, exigindo relacionar conceitos e explicar causas.',
    'dificil': 'Perguntas de análise no estilo ENEM: comparações, exceções, casos de aplicação e alternativas que exigem raciocínio.',
}


@app.route('/api/flashcards/gerar', methods=['POST'])
@jwt_required()
def flashcards_gerar():
    uid = int(get_jwt_identity())
    modo        = request.form.get('modo', 'texto')        # texto | foto | arquivo
    dificuldade = request.form.get('dificuldade', 'medio')
    quantidade  = min(max(int(request.form.get('quantidade', 10)), 3), 30)
    materia     = (request.form.get('materia') or 'Geral').strip()[:100]

    conteudo = ''
    if modo == 'texto':
        conteudo = request.form.get('conteudo', '')
    elif modo == 'foto':
        img = request.files.get('arquivo')
        if not img:
            return jsonify({'erro': 'Envie a foto do conteúdo'}), 400
        conteudo = _ocr_gemini(base64.b64encode(img.read()).decode(), img.mimetype or 'image/jpeg')
    elif modo == 'arquivo':
        f = request.files.get('arquivo')
        if not f:
            return jsonify({'erro': 'Envie o arquivo'}), 400
        nome = f.filename.lower()
        if nome.endswith('.pdf'):
            conteudo = _extrair_pdf(f)
        elif nome.endswith(('.png', '.jpg', '.jpeg', '.webp')):
            conteudo = _ocr_gemini(base64.b64encode(f.read()).decode(), f.mimetype or 'image/png')
        else:  # txt, md, csv...
            conteudo = f.read().decode('utf-8', errors='ignore')

    if len(conteudo.strip()) < 30:
        return jsonify({'erro': 'Não consegui ler conteúdo suficiente. Tente texto mais longo ou foto mais nítida.'}), 400

    prompt = (
        'Você é professor especialista em vestibulares brasileiros (ENEM, FUVEST, UNICAMP). '
        f'Com base no CONTEÚDO abaixo, crie exatamente {quantidade} flashcards no nível {dificuldade.upper()}. '
        f'{PROMPTS_DIFICULDADE.get(dificuldade, PROMPTS_DIFICULDADE["medio"])} '
        'Responda APENAS com um array JSON válido (sem markdown, sem texto extra), no formato: '
        '[{"frente": "pergunta curta e clara", "verso": "resposta objetiva em até 3 frases"}]. '
        f'\n\nCONTEÚDO:\n{conteudo[:12000]}'
    )
    r = requests.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
        '?key=' + GEMINI_KEY,
        json={'contents': [{'parts': [{'text': prompt}]}]}, timeout=90)
    if r.status_code != 200:
        return jsonify({'erro': 'IA indisponível no momento'}), 502

    bruto = r.json()['candidates'][0]['content']['parts'][0]['text'].strip()
    bruto = bruto.removeprefix('```json').removeprefix('```').removesuffix('```').strip()
    try:
        cartoes = _json.loads(bruto)
    except _json.JSONDecodeError:
        return jsonify({'erro': 'A IA retornou um formato inesperado. Tente novamente.'}), 502

    salvos = []
    for c in cartoes[:quantidade]:
        if not c.get('frente') or not c.get('verso'):
            continue
        fc = Flashcard(usuario_id=uid, materia=materia,
                       frente=str(c['frente'])[:500], verso=str(c['verso'])[:1500],
                       dificuldade=dificuldade)
        db.session.add(fc)
        salvos.append({'frente': fc.frente, 'verso': fc.verso})
    db.session.commit()
    return jsonify({'criados': len(salvos), 'flashcards': salvos})


@app.route('/api/flashcards')
@jwt_required()
def flashcards_listar():
    uid = int(get_jwt_identity())
    materia = request.args.get('materia', '')
    q = Flashcard.query.filter_by(usuario_id=uid)
    if materia:
        q = q.filter_by(materia=materia)
    fs = q.order_by(Flashcard.criado_em.desc()).all()
    return jsonify([{'id': f.id, 'materia': f.materia, 'frente': f.frente,
                     'verso': f.verso, 'dificuldade': f.dificuldade,
                     'acertos': f.acertos, 'erros': f.erros} for f in fs])


@app.route('/api/flashcards/<int:fid>/resultado', methods=['POST'])
@jwt_required()
def flashcards_resultado(fid):
    """Registra acerto/erro do estudo (base para estatística de domínio)."""
    f = Flashcard.query.filter_by(id=fid, usuario_id=int(get_jwt_identity())).first()
    if not f:
        return jsonify({'erro': 'Flashcard não encontrado'}), 404
    acertou = (request.get_json(silent=True) or {}).get('acertou', True)
    if acertou:
        f.acertos += 1
    else:
        f.erros += 1
    db.session.commit()
    return jsonify({'ok': True})


@app.route('/api/flashcards/<int:fid>', methods=['DELETE'])
@jwt_required()
def flashcards_apagar(fid):
    f = Flashcard.query.filter_by(id=fid, usuario_id=int(get_jwt_identity())).first()
    if f:
        db.session.delete(f)
        db.session.commit()
    return jsonify({'ok': True})


# ============================================================
# PLAYER SPOTIFY EMBUTIDO (Web Playback SDK + controles REST)
# ============================================================

def _spotify_headers(uid):
    tok = token_do_usuario(uid)
    if not tok:
        return None
    return {'Authorization': 'Bearer ' + tok, 'Content-Type': 'application/json'}


@app.route('/api/spotify/transferir', methods=['POST'])
@jwt_required()
def spotify_transferir():
    """Transfere a reprodução para o dispositivo gabarita (o player do app)."""
    h = _spotify_headers(int(get_jwt_identity()))
    if not h:
        return jsonify({'erro': 'Conecte o Spotify primeiro'}), 400
    device_id = (request.get_json(silent=True) or {}).get('device_id', '')
    if not device_id:
        return jsonify({'erro': 'device_id ausente'}), 400
    r = requests.put('https://api.spotify.com/v1/me/player',
                     headers=h, json={'device_ids': [device_id], 'play': True}, timeout=10)
    if r.status_code in (200, 202, 204):
        return jsonify({'ok': True})
    return jsonify({'erro': 'Falha ao transferir reprodução'}), 502


@app.route('/api/spotify/controle', methods=['POST'])
@jwt_required()
def spotify_controle():
    """Ações: play, pause, next, previous, seek, volume."""
    uid = int(get_jwt_identity())
    h = _spotify_headers(uid)
    if not h:
        return jsonify({'erro': 'Conecte o Spotify primeiro'}), 400
    d = request.get_json(silent=True) or {}
    acao = d.get('acao', '')
    base = 'https://api.spotify.com/v1/me/player'
    if acao == 'play':
        r = requests.put(base + '/play', headers=h, timeout=10)
    elif acao == 'pause':
        r = requests.put(base + '/pause', headers=h, timeout=10)
    elif acao == 'next':
        r = requests.post(base + '/next', headers=h, timeout=10)
    elif acao == 'previous':
        r = requests.post(base + '/previous', headers=h, timeout=10)
    elif acao == 'seek':
        r = requests.put(base + '/seek', headers=h,
                         params={'position_ms': int(d.get('posicao_ms', 0))}, timeout=10)
    elif acao == 'volume':
        r = requests.put(base + '/volume', headers=h,
                         params={'volume_percent': int(d.get('volume', 50))}, timeout=10)
    else:
        return jsonify({'erro': 'Ação inválida'}), 400
    if r.status_code in (200, 202, 204):
        return jsonify({'ok': True})
    return jsonify({'erro': 'Spotify recusou o comando'}), 502


# ---------- P7: endpoint protegido + sinal de "precisa conectar" ----------

@app.route('/api/spotify/atual')
@jwt_required()
def spotify_atual():
    tok = token_do_usuario(int(get_jwt_identity()))
    if not tok:
        return jsonify({'tocando': False, 'precisa_conectar': True})
    r = requests.get('https://api.spotify.com/v1/me/player/currently-playing',
                     headers={'Authorization': 'Bearer ' + tok}, timeout=10)
    if r.status_code == 401:                       # token morreu sem refresh possível
        return jsonify({'tocando': False, 'precisa_conectar': True})
    if r.status_code == 204 or not r.json():       # 204 = nada tocando
        return jsonify({'tocando': False})
    d = r.json()
    item = d.get('item') or {}
    return jsonify({
        'tocando': d.get('is_playing', False),
        'faixa': item.get('name', ''),
        'artista': ', '.join(a['name'] for a in item.get('artists', [])),
        'progresso_ms': d.get('progress_ms', 0),
        'duracao_ms': item.get('duration_ms', 0),
    })


# ---------- P6: cache com TTL e limite de tamanho ----------

_cache_letras = {}
CACHE_TTL = 60 * 60 * 24          # 24 horas
CACHE_LIMITE = 500

@app.route('/api/letra')
@jwt_required()
def letra():
    faixa = request.args.get('faixa', '')
    artista = request.args.get('artista', '')
    duracao = request.args.get('duracao', 0, type=int) // 1000
    chave = f'{faixa}|{artista}'

    c = _cache_letras.get(chave)
    if c and time.time() - c[0] < CACHE_TTL:
        return jsonify(c[1])

    r = requests.get('https://lrclib.net/api/get',
                     params={'track_name': faixa, 'artist_name': artista, 'duration': duracao},
                     headers={'User-Agent': 'gabarita/1.0 (app de estudos)'}, timeout=15)
    if r.status_code != 200:
        return jsonify({'sincronizada': False, 'linhas': []}), 404

    d = r.json()
    lrc = d.get('syncedLyrics') or ''
    linhas = []
    for linha in lrc.splitlines():
        if ']' not in linha:
            continue
        tempo, texto = linha.split(']', 1)
        try:
            mm, ss = tempo.strip('[').split(':')
            linhas.append({'t': int(mm) * 60 + float(ss), 'texto': texto.strip()})
        except ValueError:
            continue
    if not linhas and d.get('plainLyrics'):
        linhas = [{'t': None, 'texto': l} for l in d['plainLyrics'].splitlines()]

    resp = {'sincronizada': bool(lrc), 'linhas': linhas}
    _cache_letras[chave] = (time.time(), resp)
    if len(_cache_letras) > CACHE_LIMITE:          # expulsa as 100 mais antigas
        antigas = sorted(_cache_letras, key=lambda k: _cache_letras[k][0])[:100]
        for k in antigas:
            del _cache_letras[k]
    return jsonify(resp)


# ---------- Anotação da IA (inalterado, já era protegido) ----------

@app.route('/api/letra/anotar', methods=['POST'])
@jwt_required()
def letra_anotar():
    d = request.get_json(silent=True) or {}
    letra_completa = (d.get('letra') or '')[:8000]
    trecho = d.get('trecho') or ''
    if not letra_completa or not trecho:
        return jsonify({'erro': 'Sem letra ou trecho'}), 400
    prompt = (
        'Você é professor de Língua Portuguesa preparando alunos para o ENEM. '
        'Leia a letra completa abaixo e explique o trecho destacado em no máximo 2 frases: '
        'sentido, figura de linguagem (se houver) e vocabulário difícil.\n\n'
        f'LETRA COMPLETA:\n{letra_completa}\n\nTRECHO DESTACADO: "{trecho}"'
    )
    r = requests.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
        '?key=' + GEMINI_KEY,
        json={'contents': [{'parts': [{'text': prompt}]}]}, timeout=30)
    if r.status_code != 200:
        return jsonify({'erro': 'IA indisponível no momento'}), 502
    texto = r.json()['candidates'][0]['content']['parts'][0]['text']
    return jsonify({'explicacao': texto.strip()})


# ============================================================
# ROTAS DE AUTENTICAÇÃO (mínimas para o login funcionar)
# ============================================================

@app.route('/api/auth/registrar', methods=['POST'])
def registrar():
    d = request.get_json(silent=True) or {}
    email = (d.get('email') or '').strip().lower()
    nome = (d.get('nome') or '').strip()
    senha = d.get('senha') or ''
    if not email or not nome or len(senha) < 6:
        return jsonify({'erro': 'Preencha nome, e-mail e senha (mín. 6 caracteres)'}), 400
    if Usuario.query.filter_by(email=email).first():
        return jsonify({'erro': 'E-mail já cadastrado'}), 409
    u = Usuario(email=email, nome=nome,
                senha_hash=secrets.token_hex(16) + senha)  # troque por bcrypt em produção
    db.session.add(u)
    db.session.commit()
    return jsonify({'token': create_access_token(identity=str(u.id)), 'nome': u.nome})


@app.route('/api/auth/login', methods=['POST'])
def login():
    d = request.get_json(silent=True) or {}
    email = (d.get('email') or '').strip().lower()
    senha = d.get('senha') or ''
    u = Usuario.query.filter_by(email=email).first()
    if not u or not u.senha_hash.endswith(senha):
        return jsonify({'erro': 'E-mail ou senha incorretos'}), 401
    return jsonify({'token': create_access_token(identity=str(u.id)), 'nome': u.nome})

# ============================================================
# BLOCO 7.3 — PLANOS PÚBLICOS (landing, sem login)
# ============================================================

@app.route('/api/planos/publico')
def planos_publico():
    ps = Plano.query.order_by(Plano.duracao_dias).all()
    return jsonify([{'nome': p.nome,
                     'preco': f"R$ {p.preco_centavos / 100:.2f}".replace('.', ','),
                     'duracao_dias': p.duracao_dias,
                     'descricao': p.descricao} for p in ps])

# ============================================================
# BLOCO 7.4 — CHECKOUT SEGURO (preço SEMPRE do banco, nunca do cliente)
# ============================================================

@app.route('/api/pagamento/criar-checkout', methods=['POST'])
@jwt_required()
def criar_checkout():
    d = request.get_json(silent=True) or {}
    plano = Plano.query.filter_by(nome=d.get('plano', '')).first()
    if not plano:
        return jsonify({'erro': 'Plano inexistente'}), 400
    pref = {
        'items': [{'title': f'gabarita Premium — {plano.nome}',
                   'quantity': 1,
                   'unit_price': plano.preco_centavos / 100.0,
                   'currency_id': 'BRL'}],
        'back_urls': {'success': APP_URL + '/pagamento/sucesso',
                      'pending': APP_URL + '/pagamento/pendente',
                      'failure': APP_URL + '/pagamento/falha'},
        'auto_return': 'approved',
        'external_reference': f'{get_jwt_identity()}|{plano.nome}',
        'notification_url': APP_URL + '/api/pagamento/webhook',
    }
    r = requests.post('https://api.mercadopago.com/checkout/preferences',
                      headers={'Authorization': 'Bearer ' + MP_ACCESS_TOKEN},
                      json=pref, timeout=30)
    if r.status_code in (200, 201):
        return jsonify({'checkout_url': r.json()['init_point']})
    return jsonify({'erro': 'Falha ao criar pagamento. Tente novamente.'}), 502


@app.route('/api/pagamento/webhook', methods=['POST'])
def webhook():
    """Confirmação de pagamento do Mercado Pago e ativação da assinatura."""
    d = request.get_json(silent=True) or {}
    if d.get('type') != 'payment':
        return jsonify({'ok': True})
    pid = str((d.get('data') or {}).get('id', ''))
    if not pid:
        return jsonify({'ok': True})
    r = requests.get(f'https://api.mercadopago.com/v1/payments/{pid}',
                     headers={'Authorization': 'Bearer ' + MP_ACCESS_TOKEN},
                     timeout=30)
    if r.status_code != 200:
        return jsonify({'ok': True})
    pay = r.json()
    if pay.get('status') != 'approved':
        return jsonify({'ok': True})
    ref = pay.get('external_reference', '')
    if '|' not in ref:
        return jsonify({'ok': True})
    usuario_id, plano_nome = ref.split('|', 1)
    plano = Plano.query.filter_by(nome=plano_nome).first()
    if not plano:
        return jsonify({'ok': True})
    db.session.add(Assinatura(usuario_id=int(usuario_id), plano_nome=plano_nome,
                              mp_payment_id=pid, status='ativa',
                              expira_em=datetime.utcnow() + timedelta(days=plano.duracao_dias)))
    db.session.commit()
    return jsonify({'ok': True})


@app.route('/api/pesquisa', methods=['POST'])
def salvar_pesquisa():
    d = request.get_json(silent=True) or {}
    email = (d.get('email') or '').strip()
    nome = (d.get('nome') or '').strip()
    whatsapp = (d.get('whatsapp') or '').strip()
    import json as py_json
    r = RespostaPesquisa(nome=nome, email=email, whatsapp=whatsapp,
                         dados_json=py_json.dumps(d, ensure_ascii=False))
    db.session.add(r)
    db.session.commit()
    return jsonify({'ok': True, 'mensagem': 'Pesquisa registrada com sucesso!'})

# ============================================================
# BLOCOS 1, 2, 3, 4, 5, 6, 9 — FRONTEND EMBUTIDO
# ============================================================

HTML = r"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
<!-- ===== BLOCO 1 — HEAD (marca unificada) ===== -->
<meta charset="UTF-8">
<title>gabarita — Treine como a banca corrige</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Redação corrigida no padrão ENEM, FUVEST, UNICAMP e UNESP. IA de vestibular 24h. Simulados com diagnóstico TRI e playlists de foco.">
<script src="https://sdk.scdn.co/spotify-player.js"></script>
<style>
/* ===== BLOCO 5 — CSS COMPLETO ===== */
*{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',system-ui,sans-serif}
:root{--bg:#000;--card:#10141D;--bd:#1E2534;--primary:#1E3A8A;--blue:#60A5FA;
      --txt:#FAFAFA;--sub:#A3A3A3;--lbl:#8A8A94}
body{background:var(--bg);color:var(--txt)}
.btn{background:var(--primary);color:#FFF;border:none;padding:12px 24px;border-radius:10px;
     font-size:14px;font-weight:600;cursor:pointer;transition:filter .2s}
.btn:hover{filter:brightness(1.2)}
.btn-ghost{background:#1A2130;color:var(--txt)}
.btn-lg{padding:16px 34px;font-size:15px}

/* Skip link (Bloco 9) */
.skip-link{position:absolute;left:-9999px;top:0;background:var(--primary);color:#FFF;
  padding:10px 18px;z-index:9999;border-radius:0 0 8px 0}
.skip-link:focus{left:0}

/* Splash (Bloco 2) */
.splash{position:fixed;inset:0;background:#000;z-index:9999;display:flex;
  align-items:center;justify-content:center;transition:opacity .35s}
.splash.saindo{opacity:0;pointer-events:none}
.splash-logo{font-size:36px;font-weight:800;color:#FFF;letter-spacing:-.02em}
.splash-logo span{color:var(--blue)}

/* Landing (Bloco 3) */
.landing{background:#000;min-height:100vh;color:var(--txt)}
.land-nav{display:flex;justify-content:space-between;align-items:center;padding:18px clamp(20px,6vw,64px)}
.logo{display:flex;align-items:center;gap:10px}
.logo-ic{width:34px;height:34px;background:var(--primary);border-radius:9px;display:flex;
  align-items:center;justify-content:center;font-weight:800;font-size:18px}
.logo-tx{font-weight:800;font-size:19px}
.logo-tx i{color:var(--blue);font-style:normal}
.hero{text-align:center;padding:72px clamp(20px,6vw,64px) 56px;max-width:760px;margin:0 auto}
.hero h1{font-size:clamp(34px,6vw,52px);line-height:1.1;letter-spacing:-.02em}
.hero-destaque{color:var(--blue)}
.hero-sub{color:var(--sub);font-size:15px;line-height:1.7;margin:18px 0 26px}
.land-trust{margin-top:22px;font-size:12px;color:var(--lbl)}
.land-features{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
  gap:14px;padding:0 clamp(20px,6vw,64px) 56px;max-width:1080px;margin:0 auto}
.land-card{background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:20px}
.land-card p{font-size:13px;color:var(--sub);line-height:1.6;margin-top:8px}
.land-planos{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px;
  padding:0 clamp(20px,6vw,64px) 72px;max-width:1080px;margin:0 auto}
.land-plano{position:relative;background:var(--card);border:2px solid var(--bd);
  border-radius:16px;padding:24px;text-align:center}
.land-plano.destaque{border-color:var(--primary)}
.land-tag{position:absolute;top:-11px;left:50%;transform:translateX(-50%);
  background:var(--primary);color:#FFF;font-size:10px;font-weight:700;letter-spacing:.06em;
  text-transform:uppercase;padding:4px 12px;border-radius:10px;white-space:nowrap}
.land-plano h3{font-size:14px;color:var(--sub)}
.preco{font-size:30px;font-weight:800;margin:8px 0}
.preco small{font-size:12px;color:var(--lbl);font-weight:400}
.land-plano p{font-size:12px;color:var(--sub);line-height:1.6;margin-bottom:16px}
.land-footer{text-align:center;font-size:12px;color:var(--lbl);padding:24px;border-top:1px solid var(--bd)}
@media(max-width:480px){.land-planos{grid-template-columns:1fr}}

/* Letra (Nova) */
.letra-faixa{font-weight:700;font-size:16px;padding:14px 20px 0}
.letra-status{font-size:12px;color:#8A8A94;padding:2px 20px 10px}
.letra-linhas{height:420px;overflow-y:auto;padding:10px 20px 40px;text-align:center;
  scroll-behavior:smooth;border-top:1px solid #1E2534}
.letra-linha{font-size:17px;color:#5A6478;margin:14px 0;transition:color .3s,font-size .3s;
  cursor:pointer;line-height:1.4}
.letra-linha:hover{color:#A3A3A3}
.letra-linha.ativa{color:#FFF;font-weight:700;font-size:19px}
.letra-linha.carregando{opacity:.4}
.letra-nota{background:#10141D;border:1px solid #1E3A8A;border-radius:10px;padding:12px 16px;
  font-size:13px;color:#BBF7D0;margin:8px auto;max-width:90%;text-align:left;line-height:1.5}
.letra-vazia{color:#5A6478;font-size:14px;padding:40px 20px;text-align:center}
.letra-dica{font-size:11px;color:#8A8A94;text-align:center;padding:8px 0 14px}

/* Login */
.login-screen{display:none;min-height:100vh;align-items:center;justify-content:center;padding:20px}
.login-panel{background:var(--card);border:1px solid var(--bd);border-radius:16px;
  padding:36px;max-width:400px;width:100%}
.login-panel h1{font-size:22px;margin-bottom:8px}
.login-sub{font-size:13px;color:var(--sub);margin-bottom:22px;line-height:1.5}
.login-panel input{width:100%;background:#0B0E15;border:1px solid var(--bd);color:var(--txt);
  padding:12px 14px;border-radius:10px;font-size:14px;margin-bottom:12px}
.login-panel input:focus{outline:none;border-color:var(--blue)}
.login-alt{display:flex;gap:8px;margin:14px 0}
.login-alt button{flex:1;background:#0B0E15;border:1px solid var(--bd);color:var(--txt);
  padding:10px;border-radius:10px;font-size:13px;cursor:pointer}
.login-troca{text-align:center;font-size:12px;color:var(--sub);margin-top:16px}
.login-troca a{color:var(--blue);cursor:pointer;text-decoration:none}

/* VIP (Bloco 4) */
.vip-btn{background:none;border:1px solid #2A3348;color:var(--sub);padding:8px 14px;
  border-radius:8px;font-size:12px;cursor:pointer;margin-top:14px}
.vip-btn:hover{border-color:var(--blue);color:var(--txt)}
.vip-modal{position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:1500;display:none;
  align-items:center;justify-content:center;padding:20px}
.vip-card{background:var(--card);border:1px solid var(--bd);border-radius:16px;
  padding:28px;max-width:380px;width:100%}
.vip-card h3{font-size:17px;margin-bottom:10px}
.vip-card p{font-size:13px;color:var(--sub);line-height:1.6;margin-bottom:14px}
.vip-card input{width:100%;background:#0B0E15;border:1px solid var(--bd);color:var(--txt);
  padding:12px 14px;border-radius:10px;font-size:14px}

/* Toast */
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:2000;
  padding:12px 22px;border-radius:10px;font-size:13px;font-weight:600;display:none}
.toast.success{background:#14532D;color:#BBF7D0}
.toast.error{background:#7F1D1D;color:#FECACA}

/* Pesquisa Black Friday */
.pesquisa-btn{background:linear-gradient(90deg,#1E3A8A,#2563EB);color:#FFF;border:1px solid #3B82F6;
  padding:8px 16px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;transition:all .2s;
  display:inline-flex;align-items:center;gap:6px}
.pesquisa-btn:hover{filter:brightness(1.2);transform:translateY(-1px)}
.pesquisa-modal{position:fixed;inset:0;background:rgba(0,0,0,.82);z-index:1600;display:none;
  align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(6px);overflow-y:auto}
.pesquisa-card{background:var(--card);border:1px solid var(--bd);border-radius:18px;
  padding:28px;max-width:540px;width:100%;max-height:90vh;overflow-y:auto;text-align:left}
.pesquisa-card h3{font-size:19px;font-weight:800;color:#FFF;margin-bottom:6px}
.pesquisa-card p{font-size:13px;color:var(--sub);line-height:1.5;margin-bottom:18px}
.pq-item{background:#0D111A;border:1px solid var(--bd);border-radius:12px;padding:14px;margin-bottom:12px}
.pq-label{font-size:13px;font-weight:700;color:#FFF;margin-bottom:8px;display:block}
.pq-label span{color:#F87171}
.pq-input{width:100%;background:#090D15;border:1px solid #2A3348;color:#FFF;padding:10px 12px;
  border-radius:9px;font-size:13px;outline:none}
.pq-input:focus{border-color:var(--blue)}
.pq-opcoes{display:grid;grid-template-columns:1fr;gap:6px}
.pq-opt{display:flex;align-items:center;gap:8px;font-size:12px;color:#CBD5E1;cursor:pointer;
  padding:6px 10px;border-radius:8px;background:#090D15;border:1px solid #1E2534}
.pq-opt:hover{border-color:#3B82F6}

/* Acessibilidade */
:focus-visible{outline:2px solid var(--blue);outline-offset:2px;border-radius:4px}
@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}
.fc-modos{display:flex;gap:8px;margin-bottom:14px}
.fc-modo{flex:1;background:#0B0E15;border:1px solid #1E2534;color:#A3A3A3;padding:10px 6px;border-radius:10px;font-size:12px;cursor:pointer}
.fc-modo.ativo{border-color:#1E3A8A;color:#FAFAFA;background:#10141D}
.fc-arquivo-info{font-size:12px;color:#60A5FA;margin:8px 0}
.fc-linha{display:flex;gap:8px;margin-top:12px}
.fc-label{font-size:12px;color:#8A8A94;margin:14px 0 8px}
.fc-chips{display:flex;gap:8px}
.fc-chip{flex:1;background:#0B0E15;border:1px solid #1E2534;color:#A3A3A3;padding:10px;border-radius:10px;font-size:13px;cursor:pointer}
.fc-chip.ativo{border-color:#1E3A8A;color:#FAFAFA;background:#10141D;font-weight:600}
.fc-card{perspective:1200px;max-width:420px;margin:18px auto;cursor:pointer}
.fc-card-inner{position:relative;width:100%;min-height:260px;transition:transform .5s;transform-style:preserve-3d}
.fc-card.virado .fc-card-inner{transform:rotateY(180deg)}
.fc-face{position:absolute;inset:0;backface-visibility:hidden;background:#10141D;border:1px solid #1E2534;border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:28px;text-align:center}
.fc-face span{font-size:17px;line-height:1.5}
.fc-face small{margin-top:18px;font-size:11px;color:#8A8A94}
.fc-verso{transform:rotateY(180deg);border-color:#1E3A8A}
.fc-topo{display:flex;justify-content:space-between;align-items:center;margin-top:8px}
.fc-progresso{font-size:13px;color:#8A8A94}
#fc-avaliar{margin-top:14px}
@media (prefers-reduced-motion:reduce){.fc-card-inner{transition:none}}
</style>
</head>
<body>

<!-- ===== BLOCO 9 — SKIP LINK ===== -->
<a href="#app-screen" class="skip-link">Pular para o conteúdo principal</a>

<!-- ===== BLOCO 2 — SPLASH MÍNIMA ===== -->
<div id="splash" class="splash" role="status" aria-label="Carregando gabarita">
  <div class="splash-logo">g<span>.</span></div>
</div>

<!-- ===== BLOCO 3 — LANDING PÚBLICA ===== -->
<div id="landing" class="landing">
  <nav class="land-nav">
    <div class="logo"><div class="logo-ic">g</div><span class="logo-tx">gabarita<i>.</i></span></div>
    <div style="display:flex;align-items:center;gap:10px">
      <button class="pesquisa-btn" onclick="abrirPesquisa()">🎯 Diagnóstico de Estudos</button>
      <button class="btn" onclick="irLogin()">Entrar</button>
    </div>
  </nav>

  <section class="hero">
    <h1>Treine como<br><span class="hero-destaque">a banca corrige.</span></h1>
    <p class="hero-sub">Redação corrigida no padrão ENEM, FUVEST, UNICAMP e UNESP.
      IA de vestibular 24h. Simulados com diagnóstico TRI. Playlists de foco com letras.</p>
    <button class="btn btn-lg" onclick="irLogin()">Começar agora — conta em 1 minuto</button>
    <div class="land-trust">🔒 Ambiente criptografado SSL · Dados protegidos pela LGPD</div>
  </section>

  <section class="land-planos">
    <div class="land-plano">
      <h3>Mensal</h3>
      <div class="preco">R$ 39,90<small>/mês</small></div>
      <p>Acesso completo por 30 dias, sem fidelidade</p>
      <button class="btn btn-ghost" onclick="irLogin()">Assinar mensal</button>
    </div>
    <div class="land-plano">
      <h3>Trimestral</h3>
      <div class="preco">R$ 99,90<small>/3 meses</small></div>
      <p>Economia de R$ 19,80 — ideal para o reta final</p>
      <button class="btn btn-ghost" onclick="irLogin()">Assinar trimestral</button>
    </div>
    <div class="land-plano destaque">
      <div class="land-tag">Mais escolhido</div>
      <h3>Semestral</h3>
      <div class="preco">R$ 179,90<small>/6 meses</small></div>
      <p>Economia de R$ 59,50 — acompanha o ciclo completo de simulados</p>
      <button class="btn" onclick="irLogin()">Assinar semestral</button>
    </div>
    <div class="land-plano">
      <h3>Anual</h3>
      <div class="preco">R$ 299,90<small>/ano</small></div>
      <p>Equivalente a R$ 24,99/mês — do início do ano até a prova</p>
      <button class="btn btn-ghost" onclick="irLogin()">Assinar anual</button>
    </div>
  </section>

  <section class="land-features">
    <div class="land-card"><b>📝 CorrigeBot</b><p>Sua redação na régua oficial de cada banca, competência por competência.</p></div>
    <div class="land-card"><b>🤖 VestBot</b><p>IA que responde só sobre vestibulares, 24h, com suas conversas salvas.</p></div>
    <div class="land-card"><b>📊 Diagnóstico TRI</b><p>Saiba onde perde pontos e receba um plano montado a partir do seu boletim.</p></div>
    <div class="land-card"><b>🎵 Foco com música</b><p>Playlists de estudo com letras sincronizadas, integradas ao Spotify.</p></div>
  </section>

  <footer class="land-footer">Dúvidas? Suporte · suporte@gabarita.app · © 2026 gabarita</footer>
</div>

<!-- ===== TELA DE LOGIN ===== -->
<div id="login-screen" class="login-screen">
  <div class="login-panel">
    <h1 id="login-titulo">Comece sua aprovação hoje</h1>
    <p class="login-sub" id="login-sub">Crie sua conta em 1 minuto — treine como a banca corrige.</p>
    <input type="email" id="l-email" placeholder="Seu e-mail" autocomplete="email">
    <input type="password" id="l-senha" placeholder="Sua senha" autocomplete="current-password">
    <button class="btn" style="width:100%" onclick="entrar()">Entrar na Plataforma</button>
    <div class="login-alt">
      <button onclick="toast('error','Login social disponível na próxima versão')">Apple</button>
      <button onclick="toast('error','Login social disponível na próxima versão')">Google</button>
      <button onclick="toast('error','Login social disponível na próxima versão')">Microsoft</button>
    </div>
    <button class="vip-btn" onclick="abrirVip()">🔑 Minha escola tem acesso VIP</button>
    <div class="login-troca">Ainda não possui uma conta? <a onclick="modoCadastro()">Criar Conta</a></div>
  </div>
</div>

<!-- ===== BLOCO 4 — MODAL CHAVE VIP ===== -->
<div id="vip-modal" class="vip-modal">
  <div class="vip-card">
    <h3>Acesso VIP — escolas parceiras</h3>
    <p>A Chave VIP libera planos institucionais concedidos pela sua escola.
       Se você recebeu uma, insira aqui:</p>
    <input type="text" id="vip-codigo" placeholder="Código fornecido pela escola">
    <div style="display:flex;gap:8px;margin-top:14px">
      <button class="btn" style="flex:1" onclick="usarVip()">Ativar</button>
      <button class="btn btn-ghost" style="flex:1" onclick="fecharVip()">Cancelar</button>
    </div>
  </div>
</div>

<!-- ===== MODAL QUESTIONÁRIO DIAGNÓSTICO OBRIGATÓRIO ===== -->
<div id="pesquisa-modal" class="pesquisa-modal">
  <div class="pesquisa-card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <span style="font-size:11px;font-weight:800;color:#60A5FA;text-transform:uppercase;letter-spacing:.05em">Diagnóstico Obrigatório de Entrada</span>
      <button class="btn btn-ghost" style="padding:4px 10px;font-size:11px;font-weight:700;color:#93C5FD;border:1px solid rgba(147,197,253,0.3);cursor:pointer" onclick="irParaLogin()">Já tenho uma conta</button>
    </div>
    <h3>Diagnóstico Inicial de Preparação Vestibular</h3>
    <p>Preenchimento obrigatório para novos estudantes. Se você já assina ou tem conta cadastrada, clique no botão <strong>"Já tenho uma conta"</strong> acima.</p>
    <div id="pq-perguntas-container"></div>
    <div style="margin-top:16px">
      <button class="btn" style="width:100%" onclick="enviarPesquisa()">Concluir Diagnóstico</button>
    </div>
  </div>
</div>

<div id="toast" class="toast"></div>
<div id="app-screen">
  <div id="spotify-conexao" style="display:none;text-align:center;padding:20px">
    <p style="color:#A3A3A3;font-size:14px;margin-bottom:14px">
      Conecte sua conta do Spotify para ver a letra da música que <b>você</b> está ouvindo.</p>
    <button class="btn" onclick="conectarSpotify()">🎵 Conectar Spotify</button>
  </div>
  
  <div id="fc-container" style="padding:20px">
    <button class="btn btn-ghost" onclick="document.getElementById('fc-criar').style.display='block'">🃏 Flashcards</button>
    <div id="fc-criar" style="display:none;background:var(--card);border:1px solid var(--bd);border-radius:16px;padding:20px;margin-top:14px">
      <h3>Criar Flashcards</h3>
      <div class="fc-modos">
        <button class="fc-modo ativo" onclick="fcModo('texto',this)">⌨️ Digitar</button>
        <button class="fc-modo" onclick="fcModo('foto',this)">📷 Tirar foto</button>
        <button class="fc-modo" onclick="fcModo('arquivo',this)">📎 Enviar arquivo</button>
      </div>
      <textarea id="fc-texto" class="pq-input" style="min-height:120px" placeholder="Conteúdo..."></textarea>
      <input type="file" id="fc-arquivo" accept="image/*,.pdf,.txt,.md,.csv" style="display:none">
      <div class="fc-linha">
        <input type="text" id="fc-materia" class="pq-input" style="flex:1" placeholder="Matéria">
        <select id="fc-quantidade" class="pq-input" style="width:110px">
          <option value="5">5</option><option value="10" selected>10</option>
          <option value="20">20</option>
        </select>
      </div>
      <div class="fc-label">Nível</div>
      <div class="fc-chips">
        <button class="fc-chip" data-nivel="facil" onclick="fcNivel('facil',this)">🟢 Fácil</button>
        <button class="fc-chip ativo" data-nivel="medio" onclick="fcNivel('medio',this)">🟡 Médio</button>
        <button class="fc-chip" data-nivel="dificil" onclick="fcNivel('dificil',this)">🔴 Difícil</button>
      </div>
      <button class="btn" style="width:100%;margin-top:14px" id="fc-gerar-btn" onclick="criarFlashcards()">✨ Gerar com IA</button>
    </div>
    <div id="fc-estudo" style="display:none;background:var(--card);border:1px solid var(--bd);border-radius:16px;padding:20px;margin-top:14px">
      <div class="fc-topo">
        <div class="fc-progresso" id="fc-progresso">0/0</div>
        <button class="btn btn-ghost" style="padding:6px 14px;font-size:12px" onclick="fcVoltarCriar()">← Criar mais</button>
      </div>
      <div id="fc-card" class="fc-card" onclick="virarCartao()">
        <div class="fc-card-inner">
          <div class="fc-face fc-frente"><span id="fc-frente-txt"></span><small>Toque para virar</small></div>
          <div class="fc-face fc-verso"><span id="fc-verso-txt"></span></div>
        </div>
      </div>
      <div id="fc-avaliar" style="display:none;gap:8px">
        <button class="fc-chip" onclick="avaliarCartao(true)">✅ Acertei</button>
        <button class="fc-chip" onclick="avaliarCartao(false)">❌ Errei</button>
      </div>
    </div>
  </div>
  
  <div id="fc-container" style="padding:20px">
    <button class="btn btn-ghost" onclick="document.getElementById('fc-criar').style.display='block'">🃏 Flashcards</button>
    <div id="fc-criar" style="display:none;background:var(--card);border:1px solid var(--bd);border-radius:16px;padding:20px;margin-top:14px">
      <h3>Criar Flashcards</h3>
      <div class="fc-modos">
        <button class="fc-modo ativo" onclick="fcModo('texto',this)">⌨️ Digitar</button>
        <button class="fc-modo" onclick="fcModo('foto',this)">📷 Tirar foto</button>
        <button class="fc-modo" onclick="fcModo('arquivo',this)">📎 Enviar arquivo</button>
      </div>
      <textarea id="fc-texto" class="pq-input" style="min-height:120px" placeholder="Conteúdo..."></textarea>
      <input type="file" id="fc-arquivo" accept="image/*,.pdf,.txt,.md,.csv" style="display:none">
      <div class="fc-linha">
        <input type="text" id="fc-materia" class="pq-input" style="flex:1" placeholder="Matéria">
        <select id="fc-quantidade" class="pq-input" style="width:110px">
          <option value="5">5</option><option value="10" selected>10</option>
          <option value="20">20</option>
        </select>
      </div>
      <div class="fc-label">Nível</div>
      <div class="fc-chips">
        <button class="fc-chip" data-nivel="facil" onclick="fcNivel('facil',this)">🟢 Fácil</button>
        <button class="fc-chip ativo" data-nivel="medio" onclick="fcNivel('medio',this)">🟡 Médio</button>
        <button class="fc-chip" data-nivel="dificil" onclick="fcNivel('dificil',this)">🔴 Difícil</button>
      </div>
      <button class="btn" style="width:100%;margin-top:14px" id="fc-gerar-btn" onclick="criarFlashcards()">✨ Gerar com IA</button>
    </div>
    <div id="fc-estudo" style="display:none;background:var(--card);border:1px solid var(--bd);border-radius:16px;padding:20px;margin-top:14px">
      <div class="fc-topo">
        <div class="fc-progresso" id="fc-progresso">0/0</div>
        <button class="btn btn-ghost" style="padding:6px 14px;font-size:12px" onclick="fcVoltarCriar()">← Criar mais</button>
      </div>
      <div id="fc-card" class="fc-card" onclick="virarCartao()">
        <div class="fc-card-inner">
          <div class="fc-face fc-frente"><span id="fc-frente-txt"></span><small>Toque para virar</small></div>
          <div class="fc-face fc-verso"><span id="fc-verso-txt"></span></div>
        </div>
      </div>
      <div id="fc-avaliar" style="display:none;gap:8px">
        <button class="fc-chip" onclick="avaliarCartao(true)">✅ Acertei</button>
        <button class="fc-chip" onclick="avaliarCartao(false)">❌ Errei</button>
      </div>
    </div>
  </div>
</div>

<script>
/* ===== BLOCO 6 — JAVASCRIPT COMPLETO ===== */

// Toast utilitário
function toast(tipo, msg){
  var t = document.getElementById('toast');
  t.className = 'toast ' + tipo;
  t.textContent = msg;
  t.style.display = 'block';
  setTimeout(function(){ t.style.display = 'none'; }, 3200);
}

// SPLASH: some sozinha em 1,2s, só na 1ª visita
(function(){
  var s = document.getElementById('splash');
  if (!s) return;
  if (localStorage.getItem('gabarita_viu_splash')) return s.remove();
  setTimeout(function(){
    s.classList.add('saindo');
    setTimeout(function(){ s.remove(); }, 350);
    localStorage.setItem('gabarita_viu_splash', '1');
  }, 1200);
})();

// ROTEAMENTO: logado → app direto; novo → landing
function irLogin(){
  document.getElementById('landing').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
}
(function(){
  var logado = !!localStorage.getItem('gabarita_token');
  if (logado) document.getElementById('landing').style.display = 'none';
  else document.getElementById('login-screen').style.display = 'none';
})();

// SAUDAÇÃO DINÂMICA
(function(){
  var rec = !!localStorage.getItem('gabarita_visitou');
  var h1 = document.getElementById('login-titulo');
  var sub = document.getElementById('login-sub');
  if (h1) h1.textContent = rec ? 'Bem-vindo de volta! 👋' : 'Comece sua aprovação hoje';
  if (sub) sub.textContent = rec
    ? 'Acesse seu cronograma, simulados e estatísticas de aprovação.'
    : 'Crie sua conta em 1 minuto — treine como a banca corrige.';
  localStorage.setItem('gabarita_visitou', '1');
})();

// MODAL VIP
function abrirVip(){
  document.getElementById('vip-modal').style.display = 'flex';
  document.getElementById('vip-codigo').focus();
}
function fecharVip(){ document.getElementById('vip-modal').style.display = 'none'; }
function usarVip(){
  var c = document.getElementById('vip-codigo').value.trim();
  if (!c) return toast('error','Informe o código da sua escola');
  toast('success','Código recebido! Ativação em instantes.');
  fecharVip();
}

// ===== QUESTIONÁRIO DIAGNÓSTICO OBRIGATÓRIO =====
const PESQUISA_PERGUNTAS = [
  {id:'nome', tipo:'texto', obrigatoria:true, pergunta:'Seu nome completo'},
  {id:'email', tipo:'texto', obrigatoria:true, pergunta:'Seu melhor e-mail'},
  {id:'whatsapp', tipo:'texto', obrigatoria:true, pergunta:'Seu WhatsApp (com DDD)'},
  {id:'prova', tipo:'radio', obrigatoria:true, pergunta:'Para qual prova você está se preparando?',
   opcoes:['ENEM 2026','ENEM 2027','FUVEST','UNICAMP / UNESP','Medicina — foco total','Outra']},
  {id:'momento', tipo:'radio', obrigatoria:true, pergunta:'Qual é o seu momento agora?',
   opcoes:['3º ano do ensino médio','2º ano do ensino médio','Cursinho','Já terminei a escola, estudando por conta']},
  {id:'dificuldades', tipo:'checkbox', obrigatoria:true, pergunta:'Quais são suas maiores dificuldades hoje? (marque todas)',
   opcoes:['Montar e seguir uma rotina de estudos','Redação','Conteúdo específico de alguma matéria','Foco e constância','Ansiedade / pressão da prova','Outra']},
  {id:'investiu', tipo:'radio', obrigatoria:true, pergunta:'Você já investiu em algum curso ou plataforma de estudos?',
   opcoes:['Sim','Ainda não, seria meu primeiro investimento']},
  {id:'investimento', tipo:'radio', obrigatoria:true, pergunta:'Quanto você conseguiria investir na sua preparação?',
   opcoes:['Até R$ 50','R$ 50 a R$ 100','R$ 100 a R$ 200','R$ 200 a R$ 300','Acima de R$ 300']},
  {id:'bonus', tipo:'checkbox', obrigatoria:false, pergunta:'O que você mais gostaria de ter como bônus / diferencial?',
   opcoes:['Correções extras de redação','Simulados inéditos','Mentoria / acompanhamento','Mapas mentais e resumos','Plano de estudos personalizado']},
  {id:'mensagem', tipo:'paragrafo', obrigatoria:false, pergunta:'Quer deixar uma mensagem? (opcional)'}
];

function renderizarPesquisa(){
  var c = document.getElementById('pq-perguntas-container');
  if (!c || c.children.length > 0) return;
  c.innerHTML = '';
  PESQUISA_PERGUNTAS.forEach(function(p, i){
    var div = document.createElement('div');
    div.className = 'pq-item';
    var label = '<label class="pq-label">' + (i+1) + '. ' + p.pergunta + (p.obrigatoria ? ' <span>*</span>' : '') + '</label>';
    var body = '';
    if (p.tipo === 'texto'){
      body = '<input type="' + (p.id==='email'?'email':'text') + '" id="pq-' + p.id + '" class="pq-input" placeholder="Sua resposta...">';
    } else if (p.tipo === 'paragrafo'){
      body = '<textarea id="pq-' + p.id + '" class="pq-input" style="height:60px;resize:none" placeholder="Sua mensagem..."></textarea>';
    } else if (p.tipo === 'radio'){
      body = '<div class="pq-opcoes">' + p.opcoes.map(function(o){
        return '<label class="pq-opt"><input type="radio" name="pq-' + p.id + '" value="' + o + '"> ' + o + '</label>';
      }).join('') + '</div>';
    } else if (p.tipo === 'checkbox'){
      body = '<div class="pq-opcoes">' + p.opcoes.map(function(o){
        return '<label class="pq-opt"><input type="checkbox" name="pq-' + p.id + '" value="' + o + '"> ' + o + '</label>';
      }).join('') + '</div>';
    }
    div.innerHTML = label + body;
    c.appendChild(div);
  });
}

function abrirPesquisa(){
  renderizarPesquisa();
  document.getElementById('pesquisa-modal').style.display = 'flex';
  var emailSalvo = localStorage.getItem('gabarita_email');
  if (emailSalvo){
    var campo = document.getElementById('pq-email');
    if (campo) campo.value = emailSalvo;
  }
}
function fecharPesquisa(){ document.getElementById('pesquisa-modal').style.display = 'none'; }
function irParaLogin(){
  fecharPesquisa();
  irLogin();
}

async function enviarPesquisa(){
  var dados = {};
  for (var i = 0; i < PESQUISA_PERGUNTAS.length; i++){
    var p = PESQUISA_PERGUNTAS[i];
    if (p.tipo === 'texto' || p.tipo === 'paragrafo'){
      var el = document.getElementById('pq-' + p.id);
      dados[p.id] = el ? el.value.trim() : '';
    } else if (p.tipo === 'radio'){
      var rad = document.querySelector('input[name="pq-' + p.id + '"]:checked');
      dados[p.id] = rad ? rad.value : '';
    } else if (p.tipo === 'checkbox'){
      var cks = document.querySelectorAll('input[name="pq-' + p.id + '"]:checked');
      dados[p.id] = Array.from(cks).map(function(c){ return c.value; });
    }
    if (p.obrigatoria && (!dados[p.id] || (Array.isArray(dados[p.id]) && !dados[p.id].length))){
      return toast('error','Por favor, preencha: ' + p.pergunta);
    }
  }

  // Valida formato do e-mail (pergunta 'email')
  var emailResp = (dados.email || '').trim();
  if (emailResp && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailResp))
    return toast('error','Digite um e-mail válido (ex.: nome@dominio.com)');

  localStorage.setItem('gabarita_email', emailResp);
  localStorage.setItem('gabarita_questionario_concluido', 'true');

  try {
    await fetch('/api/pesquisa', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(dados)
    });
  } catch(e){}
  toast('success','Diagnóstico concluído com sucesso! Bem-vindo.');
  fecharPesquisa();
}

// LOGIN / CADASTRO
var modoCadastroAtivo = false;
function modoCadastro(){
  modoCadastroAtivo = true;
  document.getElementById('login-titulo').textContent = 'Criar sua conta';
  document.querySelector('.login-panel .btn').textContent = 'Criar Conta';
}
async function entrar(){
  var email = document.getElementById('l-email').value.trim();
  var senha = document.getElementById('l-senha').value;
  if (!email || !senha) return toast('error','Preencha e-mail e senha');
  var url = modoCadastroAtivo ? '/api/auth/registrar' : '/api/auth/login';
  try{
    var r = await fetch(url, {method:'POST', headers:{'Content-Type':'application/json'},
                              body: JSON.stringify({email:email, senha:senha, nome:email.split('@')[0]})});
    var d = await r.json();
    if (!r.ok) return toast('error', d.erro || 'Falha na autenticação');
    localStorage.setItem('gabarita_token', d.token);
    localStorage.setItem('gabarita_email', email);
    toast('success','Bem-vindo, ' + d.nome + '!');
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app-screen').innerHTML =
      '<div id="spotify-conexao" style="display:none;text-align:center;padding:20px">' +
      '  <p style="color:#A3A3A3;font-size:14px;margin-bottom:14px">' +
      '    Conecte sua conta do Spotify para ver a letra da música que <b>você</b> está ouvindo.</p>' +
      '  <button class="btn" onclick="conectarSpotify()">🎵 Conectar Spotify</button>' +
      '</div>' +
      '<div id="player-container" style="background:#10141D;border:1px solid #1E2534;border-radius:14px;padding:16px 20px;max-width:680px;margin:16px auto;">' +
      '  <div style="display:flex;align-items:center;gap:14px;margin-bottom:12px;">' +
      '    <div id="pl-capa" style="width:52px;height:52px;border-radius:8px;background:#1A2130;background-size:cover;background-position:center;flex-shrink:0;"></div>' +
      '    <div style="flex:1;min-width:0;text-align:left;">' +
      '      <div id="pl-faixa" style="font-weight:700;font-size:15px;color:#FFF;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">—</div>' +
      '      <div id="pl-artista" style="font-size:12px;color:#A3A3A3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Conectando ao Spotify…</div>' +
      '    </div>' +
      '    <div style="display:flex;align-items:center;gap:8px;">' +
      '      <button class="btn btn-ghost" style="padding:6px 12px;font-size:13px;cursor:pointer" onclick="ctrlSpotify(\'previous\')">⏮</button>' +
      '      <button class="btn" id="pl-play" style="padding:6px 16px;font-size:14px;cursor:pointer;min-width:44px;" onclick="togglePlay()">▶</button>' +
      '      <button class="btn btn-ghost" style="padding:6px 12px;font-size:13px;cursor:pointer" onclick="ctrlSpotify(\'next\')">⏭</button>' +
      '    </div>' +
      '  </div>' +
      '  <div style="display:flex;align-items:center;gap:10px;">' +
      '    <span id="pl-tempo-atual" style="font-size:11px;color:#8A8A94;min-width:32px;text-align:right;">0:00</span>' +
      '    <div id="pl-barra" onclick="seekBarra(event)" style="flex:1;height:6px;background:#1E2534;border-radius:3px;cursor:pointer;position:relative;overflow:hidden;">' +
      '      <div id="pl-progresso" style="width:0%;height:100%;background:linear-gradient(90deg,#2563EB,#60A5FA);border-radius:3px;transition:width 0.1s linear;"></div>' +
      '    </div>' +
      '    <span id="pl-tempo-total" style="font-size:11px;color:#8A8A94;min-width:32px;">0:00</span>' +
      '  </div>' +
      '</div>' +
      '<div id="letra-painel">' +
      '  <div id="letra-faixa" class="letra-faixa">—</div>' +
      '  <div id="letra-status" class="letra-status">Conectando ao Spotify…</div>' +
      '  <div id="letra-linhas" class="letra-linhas"></div>' +
      '  <div class="letra-dica">Toque em qualquer linha para a IA explicar 🤖</div>' +
      '</div>';
  }catch(e){ toast('error','Erro de conexão com o servidor'); }
}

// CHECKOUT (após login, chamado pela aba Planos)
async function iniciarCheckout(plano){
  var token = localStorage.getItem('gabarita_token');
  if (!token) return irLogin();
  try{
    var r = await fetch('/api/pagamento/criar-checkout', {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer ' + token},
      body: JSON.stringify({plano: plano})});
    var d = await r.json();
    if (!r.ok) return toast('error', d.erro || 'Falha ao iniciar pagamento');
    window.location.href = d.checkout_url;
  }catch(e){ toast('error','Erro de conexão com o servidor'); }
}

// ============================================================
// SINCRONIZAÇÃO PRECISA DE PROGRESSO — à prova de seek
// ============================================================

var letraAtual = null;
var faixaAtual = '';
var progressoLocal = 0;
var ultimoPoll = 0;
var estaTocando = false;        // P5: pausa congela o karaoke
var ultimaLinhaAtiva = -1;      // P3: só rola quando a linha muda
var duracaoAtualMs = 0;
var playerSpotify = null;
var playerPronto = false;

function authHeaders(){
  return {'Authorization': 'Bearer ' + localStorage.getItem('gabarita_token')};
}

// P7: 401 → volta ao login em vez de ficar "Conectando…" para sempre
function sessaoExpirou(){
  localStorage.removeItem('gabarita_token');
  irLogin();
}

function fmtTempo(ms){
  if (!ms || isNaN(ms)) return '0:00';
  var s = Math.floor(ms / 1000);
  var m = Math.floor(s / 60);
  var seg = s % 60;
  return m + ':' + (seg < 10 ? '0' : '') + seg;
}

function atualizarProgresso(pos, dur){
  pos = Math.max(0, pos || 0);
  dur = Math.max(0, dur || duracaoAtualMs || 0);
  duracaoAtualMs = dur;
  var pct = dur > 0 ? Math.min(100, Math.max(0, (pos / dur) * 100)) : 0;
  var bar = document.getElementById('pl-progresso');
  if (bar) bar.style.width = pct + '%';
  var elPos = document.getElementById('pl-tempo-atual');
  if (elPos) elPos.textContent = fmtTempo(pos);
  var elDur = document.getElementById('pl-tempo-total');
  if (elDur && dur > 0) elDur.textContent = fmtTempo(dur);
}

function ctrlBackend(url, corpo){
  return fetch(url, {
    method: 'POST',
    headers: Object.assign({'Content-Type':'application/json'}, authHeaders()),
    body: JSON.stringify(corpo)
  }).then(function(r){
    if (r.status === 401) sessaoExpirou();
    return r.json();
  }).catch(function(){});
}

// FONTE ÚNICA DA VERDADE do progresso: toda mudança de posição
// (seek na barra, seek no Spotify, play/pause, troca de faixa) passa por aqui.
function definirProgresso(ms){
  progressoLocal = Math.max(0, ms | 0);
  ultimoPoll = Date.now();
  ultimaLinhaAtiva = -1;     // força o karaoke a reavaliar
  avaliarKaraoke();          // letra acompanha NA HORA — mesmo pausado
}

// Avaliação do karaoke extraída do intervalo (chamável sob demanda)
function avaliarKaraoke(){
  if (!letraAtual || !letraAtual.sincronizada) return;
  var t = (progressoLocal + (Date.now() - ultimoPoll)) / 1000;
  var linhas = letraAtual.linhas, ativa = -1;
  for (var i = 0; i < linhas.length; i++){
    if (linhas[i].t !== null && linhas[i].t <= t) ativa = i; else break;
  }
  if (ativa === ultimaLinhaAtiva) return;
  ultimaLinhaAtiva = ativa;
  var anterior = document.querySelector('.letra-linha.ativa');
  if (anterior) anterior.classList.remove('ativa');
  if (ativa >= 0){
    var el = document.getElementById('linha-' + ativa);
    if (el){
      el.classList.add('ativa');
      var box = document.getElementById('letra-linhas');
      if (box){
        box.scrollTo({top: el.offsetTop - box.clientHeight/2 + el.clientHeight/2,
                      behavior:'smooth'});
      }
    }
  }
}

// Interpolação contínua só enquanto TOCA; seeks são instantâneos via definirProgresso
setInterval(function(){
  if (!estaTocando) return;
  avaliarKaraoke();
}, 100);

// ---- SEEK pela barra do app: UI e letra reagem ANTES de qualquer rede ----
function seekBarra(e){
  var barra = document.getElementById('pl-barra');
  if (!barra) return;
  var rect = barra.getBoundingClientRect();
  var pct = (e.clientX - rect.left) / rect.width;
  pct = Math.max(0, Math.min(1, pct));
  var pos = Math.floor(pct * (duracaoAtualMs || 0));
  definirProgresso(pos);                      // 1) letra salta imediatamente
  atualizarProgresso(pos, duracaoAtualMs);    // 2) barra acompanha
  if (playerSpotify && playerPronto){
    playerSpotify.seek(pos);                  // 3a) SDK local (Premium)
  } else {
    ctrlSpotify('seek', pos);                 // 3b) REST (conta gratuita)
  }
}

// ---- Controles: SDK local quando existe, REST como fallback ----
function ctrlSpotify(acao, valor){
  if (playerSpotify && playerPronto){
    if (acao === 'toggle')   return playerSpotify.togglePlay();
    if (acao === 'play')     return playerSpotify.resume();
    if (acao === 'pause')    return playerSpotify.pause();
    if (acao === 'next')     return playerSpotify.nextTrack();
    if (acao === 'previous') return playerSpotify.previousTrack();
    if (acao === 'seek')     return playerSpotify.seek(valor | 0);
    if (acao === 'volume')   return playerSpotify.setVolume(valor / 100);
  }
  var corpo = {acao: acao};
  if (acao === 'seek')   corpo.posicao_ms = valor;
  if (acao === 'volume') corpo.volume = valor;
  ctrlBackend('/api/spotify/controle', corpo);
  if (acao !== 'volume') setTimeout(pollSpotify, 700);  // reconsulta rápida (modo REST)
}

function togglePlay(){ ctrlSpotify(estaTocando ? 'pause' : 'play'); }

// ---- Estado do player (SDK): cobre seek, play/pause e troca de faixa ----
function sincronizarComPlayer(estado){
  if (!estado) return;
  var faixa = estado.track_window.current_track;
  var artista = faixa.artists.map(function(a){ return a.name; }).join(', ');
  var chave = faixa.name + '|' + artista;
  estaTocando = !estado.paused;
  definirProgresso(estado.position);          // ← qualquer seek cai aqui
  atualizarProgresso(estado.position, estado.duration);
  var elFaixa = document.getElementById('pl-faixa');
  if (elFaixa) elFaixa.textContent = faixa.name;
  var elArt = document.getElementById('pl-artista');
  if (elArt) elArt.textContent = artista;
  if (faixa.album && faixa.album.images && faixa.album.images.length){
    var elCapa = document.getElementById('pl-capa');
    if (elCapa) elCapa.style.backgroundImage = 'url(' + faixa.album.images[0].url + ')';
  }
  var elDur = document.getElementById('pl-tempo-total');
  if (elDur) elDur.textContent = fmtTempo(estado.duration);
  var elPlay = document.getElementById('pl-play');
  if (elPlay) elPlay.textContent = estado.paused ? '▶' : '⏸';
  if (chave !== faixaAtual){
    var elLF = document.getElementById('letra-faixa');
    if (elLF) elLF.textContent = faixa.name + ' — ' + artista;
    letraAtual = null;
    renderLetra('Buscando letra…');
    fetch('/api/letra?faixa=' + encodeURIComponent(faixa.name) +
          '&artista=' + encodeURIComponent(faixa.artists[0].name) +
          '&duracao=' + estado.duration, {headers: authHeaders()})
      .then(function(r){ return r.json(); })
      .then(function(l){
        letraAtual = l;
        faixaAtual = chave;                   // marca só depois do sucesso
        renderLetra();
        avaliarKaraoke();                     // destaca a linha certa já na chegada
      })
      .catch(function(){});
  }
}

// ---- Polling (conta gratuita): detecta seek pelo salto de posição ----
async function pollSpotify(){
  try{
    var r = await fetch('/api/spotify/atual', {headers: authHeaders()});
    if (r.status === 401) return sessaoExpirou();
    var d = await r.json();
    var st = document.getElementById('letra-status');
    var cx = document.getElementById('spotify-conexao');
    if (d.precisa_conectar){ if (cx) cx.style.display='block'; if (st) st.textContent=''; return; }
    if (cx) cx.style.display = 'none';

    if (!d.tocando){
      estaTocando = false;
      definirProgresso(d.progresso_ms || progressoLocal);  // congela na posição real
      if (st) st.textContent = 'Música pausada ou nada tocando';
      var plBtn = document.getElementById('pl-play');
      if (plBtn) plBtn.textContent = '▶';
      return;
    }
    estaTocando = true;
    if (st) st.textContent = 'Sincronizado com o Spotify ●';
    var plBtn = document.getElementById('pl-play');
    if (plBtn) plBtn.textContent = '⏸';

    // DETECÇÃO DE SEEK: a posição real fugiu do que interpolamos → alguém
    // avançou/voltou (barra do app, app do Spotify ou outro dispositivo)
    var esperado = progressoLocal + (Date.now() - ultimoPoll);
    var delta = d.progresso_ms - esperado;
    if (Math.abs(delta) > 2500){
      definirProgresso(d.progresso_ms);        // snap imediato (seek detectado)
    } else {
      progressoLocal = d.progresso_ms;         // correção fina do relógio
      ultimoPoll = Date.now();
    }
    atualizarProgresso(d.progresso_ms, d.duracao_ms);  // barra funciona também no modo REST

    var plFaixa = document.getElementById('pl-faixa');
    if (plFaixa) plFaixa.textContent = d.faixa || '—';
    var plArt = document.getElementById('pl-artista');
    if (plArt) plArt.textContent = d.artista || '';

    var chave = d.faixa + '|' + d.artista;
    if (chave !== faixaAtual){
      document.getElementById('letra-faixa').textContent = d.faixa + ' — ' + d.artista;
      letraAtual = null;
      renderLetra('Buscando letra…');
      try{
        var lr = await fetch('/api/letra?faixa=' + encodeURIComponent(d.faixa) +
                             '&artista=' + encodeURIComponent(d.artista) +
                             '&duracao=' + d.duracao_ms, {headers: authHeaders()});
        if (lr.status === 401) return sessaoExpirou();
        letraAtual = await lr.json();
        faixaAtual = chave;
        renderLetra();
        avaliarKaraoke();
      }catch(e){}
    }
  }catch(e){}
}

function renderLetra(msg){
  var box = document.getElementById('letra-linhas');
  if (!box) return;
  ultimaLinhaAtiva = -1;                         // P3: reseta ao redesenhar
  box.innerHTML = '';
  if (msg){
    box.innerHTML = '<div class="letra-vazia">' + msg + '</div>';
    return;
  }
  if (!letraAtual || !letraAtual.linhas || !letraAtual.linhas.length){
    box.innerHTML = '<div class="letra-vazia">Letra não encontrada para esta faixa.</div>';
    return;
  }
  letraAtual.linhas.forEach(function(l, i){
    var div = document.createElement('div');
    div.className = 'letra-linha';
    div.id = 'linha-' + i;
    div.textContent = l.texto || '♪';
    div.onclick = function(){ explicarLinha(i); };
    box.appendChild(div);
  });
}

// P4: nota da IA em toggle — 2º clique na mesma linha remove a nota
async function explicarLinha(i){
  var linha = letraAtual.linhas[i];
  if (!linha || !linha.texto) return;
  var el = document.getElementById('linha-' + i);
  if (!el) return;
  var existente = el.nextElementSibling;
  if (existente && existente.classList.contains('letra-nota'))
    return existente.remove();
  el.classList.add('carregando');
  try{
    var r = await fetch('/api/letra/anotar', {
      method:'POST',
      headers:Object.assign({'Content-Type':'application/json'}, authHeaders()),
      body: JSON.stringify({
        letra: letraAtual.linhas.map(function(l){return l.texto;}).join('\n'),
        trecho: linha.texto})});
    if (r.status === 401) return sessaoExpirou();
    var d = await r.json();
    var nota = document.createElement('div');
    nota.className = 'letra-nota';
    nota.textContent = d.explicacao || d.erro || 'Sem explicação no momento';
    el.after(nota);
  }catch(e){}
  el.classList.remove('carregando');
}

// P1: conexão OAuth — abre popup e recarrega o estado quando autorizar
function conectarSpotify(){
  fetch('/api/spotify/conectar', {headers: authHeaders()})
    .then(function(r){ return r.json(); })
    .then(function(d){
      var j = window.open(d.url, 'spotify', 'width=450,height=650');
      var checa = setInterval(function(){
        if (j && j.closed){ clearInterval(checa); pollSpotify(); }
      }, 500);
    });
}

async function transferirSpotify(deviceId){
  try{
    var r = await fetch('/api/spotify/transferir', {
      method:'POST',
      headers:Object.assign({'Content-Type':'application/json'}, authHeaders()),
      body: JSON.stringify({device_id: deviceId})
    });
    if (r.status === 401) return sessaoExpirou();
    var d = await r.json();
    if (!r.ok) toast('error', d.erro || 'Falha ao transferir reprodução');
    setTimeout(pollSpotify, 500);
  }catch(e){}
}

window.addEventListener('message', function(e){
  if (e.data === 'spotify-ok'){
    pollSpotify();
  }
});

setInterval(pollSpotify, 3000);
pollSpotify();

// Abertura automática do questionário obrigatório para novos estudantes
window.addEventListener('DOMContentLoaded', function(){
  var concluido = localStorage.getItem('gabarita_questionario_concluido') === 'true';
  var token = localStorage.getItem('gabarita_token') || localStorage.getItem('token');
  if (!concluido && !token) {
    setTimeout(function(){ abrirPesquisa(); }, 350);
  }
});

// ===== FLASHCARDS =====
var fcNivelSel = 'medio';
var fcModoSel = 'texto';
var fcBaralho = [], fcIndice = 0, fcVirado = false;

function fcModo(modo, el){
  fcModoSel = modo;
  document.querySelectorAll('.fc-modo').forEach(function(b){ b.classList.remove('ativo'); });
  el.classList.add('ativo');
  document.getElementById('fc-texto').style.display = modo === 'texto' ? 'block' : 'none';
  if (modo !== 'texto') document.getElementById('fc-arquivo').click();
}
function fcNivel(nivel, el){
  fcNivelSel = nivel;
  document.querySelectorAll('.fc-chips .fc-chip').forEach(function(b){ b.classList.remove('ativo'); });
  el.classList.add('ativo');
}

async function criarFlashcards(){
  var fd = new FormData();
  fd.append('modo', fcModoSel);
  fd.append('dificuldade', fcNivelSel);
  fd.append('quantidade', document.getElementById('fc-quantidade').value);
  fd.append('materia', document.getElementById('fc-materia').value || 'Geral');
  if (fcModoSel === 'texto'){
    if (document.getElementById('fc-texto').value.trim().length < 30)
      return toast('error','Digite ou cole o conteúdo primeiro');
    fd.append('conteudo', document.getElementById('fc-texto').value);
  } else {
    var f = document.getElementById('fc-arquivo').files[0];
    if (!f) return toast('error','Escolha uma foto ou arquivo');
    fd.append('arquivo', f);
  }
  var btn = document.getElementById('fc-gerar-btn');
  btn.disabled = true; btn.textContent = '🤖 IA criando seus cartões…';
  try{
    var r = await fetch('/api/flashcards/gerar', {
      method:'POST',
      headers:{'Authorization':'Bearer ' + localStorage.getItem('gabarita_token')},
      body: fd});
    if (r.status === 401) return;
    var d = await r.json();
    if (!r.ok) return toast('error', d.erro || 'Falha ao gerar flashcards');
    toast('success', d.criados + ' flashcards criados! Bons estudos. 🃏');
    document.getElementById('fc-texto').value = '';
    estudarFlashcards();
  }catch(e){ toast('error','Erro de conexão'); }
  finally{ btn.disabled = false; btn.textContent = '✨ Gerar flashcards com IA'; }
}

async function estudarFlashcards(){
  try{
    var r = await fetch('/api/flashcards', {headers: authHeaders()});
    if (r.status === 401) return;
    fcBaralho = await r.json();
    if (!fcBaralho.length) return toast('error','Crie o primeiro flashcard!');
    fcBaralho.sort(function(){ return Math.random() - 0.5; });
    fcIndice = 0;
    document.getElementById('fc-criar').style.display = 'none';
    document.getElementById('fc-estudo').style.display = 'block';
    mostrarCartao();
  }catch(e){ toast('error','Erro de conexão'); }
}

function mostrarCartao(){
  fcVirado = false;
  var c = fcBaralho[fcIndice];
  document.getElementById('fc-card').classList.remove('virado');
  document.getElementById('fc-frente-txt').textContent = c.frente;
  document.getElementById('fc-verso-txt').textContent = c.verso;
  document.getElementById('fc-progresso').textContent = (fcIndice + 1) + '/' + fcBaralho.length + ' · ' + c.materia;
  document.getElementById('fc-avaliar').style.display = 'none';
}

function virarCartao(){
  if (fcVirado) return;
  fcVirado = true;
  document.getElementById('fc-card').classList.add('virado');
  document.getElementById('fc-avaliar').style.display = 'flex';
}

async function avaliarCartao(acertou){
  var c = fcBaralho[fcIndice];
  fetch('/api/flashcards/' + c.id + '/resultado', {
    method:'POST',
    headers:Object.assign({'Content-Type':'application/json'}, authHeaders()),
    body: JSON.stringify({acertou: acertou})}).catch(function(){});
  fcIndice++;
  if (fcIndice >= fcBaralho.length){
    toast('success','Baralho completo! 🎯');
    return fcVoltarCriar();
  }
  mostrarCartao();
}

function fcVoltarCriar(){
  document.getElementById('fc-estudo').style.display = 'none';
  document.getElementById('fc-criar').style.display = 'block';
}
// ===== FLASHCARDS =====
var fcNivelSel = 'medio';
var fcModoSel = 'texto';
var fcBaralho = [], fcIndice = 0, fcVirado = false;

function fcModo(modo, el){
  fcModoSel = modo;
  document.querySelectorAll('.fc-modo').forEach(function(b){ b.classList.remove('ativo'); });
  el.classList.add('ativo');
  document.getElementById('fc-texto').style.display = modo === 'texto' ? 'block' : 'none';
  if (modo !== 'texto') document.getElementById('fc-arquivo').click();
}
function fcNivel(nivel, el){
  fcNivelSel = nivel;
  document.querySelectorAll('.fc-chips .fc-chip').forEach(function(b){ b.classList.remove('ativo'); });
  el.classList.add('ativo');
}

async function criarFlashcards(){
  var fd = new FormData();
  fd.append('modo', fcModoSel);
  fd.append('dificuldade', fcNivelSel);
  fd.append('quantidade', document.getElementById('fc-quantidade').value);
  fd.append('materia', document.getElementById('fc-materia').value || 'Geral');
  if (fcModoSel === 'texto'){
    if (document.getElementById('fc-texto').value.trim().length < 30)
      return toast('error','Digite ou cole o conteúdo primeiro');
    fd.append('conteudo', document.getElementById('fc-texto').value);
  } else {
    var f = document.getElementById('fc-arquivo').files[0];
    if (!f) return toast('error','Escolha uma foto ou arquivo');
    fd.append('arquivo', f);
  }
  var btn = document.getElementById('fc-gerar-btn');
  btn.disabled = true; btn.textContent = '🤖 IA criando seus cartões…';
  try{
    var r = await fetch('/api/flashcards/gerar', {
      method:'POST',
      headers:{'Authorization':'Bearer ' + localStorage.getItem('gabarita_token')},
      body: fd});
    if (r.status === 401) return;
    var d = await r.json();
    if (!r.ok) return toast('error', d.erro || 'Falha ao gerar flashcards');
    toast('success', d.criados + ' flashcards criados! Bons estudos. 🃏');
    document.getElementById('fc-texto').value = '';
    estudarFlashcards();
  }catch(e){ toast('error','Erro de conexão'); }
  finally{ btn.disabled = false; btn.textContent = '✨ Gerar flashcards com IA'; }
}

async function estudarFlashcards(){
  try{
    var r = await fetch('/api/flashcards', {headers: authHeaders()});
    if (r.status === 401) return;
    fcBaralho = await r.json();
    if (!fcBaralho.length) return toast('error','Crie o primeiro flashcard!');
    fcBaralho.sort(function(){ return Math.random() - 0.5; });
    fcIndice = 0;
    document.getElementById('fc-criar').style.display = 'none';
    document.getElementById('fc-estudo').style.display = 'block';
    mostrarCartao();
  }catch(e){ toast('error','Erro de conexão'); }
}

function mostrarCartao(){
  fcVirado = false;
  var c = fcBaralho[fcIndice];
  document.getElementById('fc-card').classList.remove('virado');
  document.getElementById('fc-frente-txt').textContent = c.frente;
  document.getElementById('fc-verso-txt').textContent = c.verso;
  document.getElementById('fc-progresso').textContent = (fcIndice + 1) + '/' + fcBaralho.length + ' · ' + c.materia;
  document.getElementById('fc-avaliar').style.display = 'none';
}

function virarCartao(){
  if (fcVirado) return;
  fcVirado = true;
  document.getElementById('fc-card').classList.add('virado');
  document.getElementById('fc-avaliar').style.display = 'flex';
}

async function avaliarCartao(acertou){
  var c = fcBaralho[fcIndice];
  fetch('/api/flashcards/' + c.id + '/resultado', {
    method:'POST',
    headers:Object.assign({'Content-Type':'application/json'}, authHeaders()),
    body: JSON.stringify({acertou: acertou})}).catch(function(){});
  fcIndice++;
  if (fcIndice >= fcBaralho.length){
    toast('success','Baralho completo! 🎯');
    return fcVoltarCriar();
  }
  mostrarCartao();
}

function fcVoltarCriar(){
  document.getElementById('fc-estudo').style.display = 'none';
  document.getElementById('fc-criar').style.display = 'block';
}
</script>
</body>
</html>"""

# ============================================================
# ROTA PRINCIPAL — serve o frontend embutido
# ============================================================

@app.route('/')
def index():
    return render_template_string(HTML)

@app.route('/flashcards-ui')
def flashcards_ui():
    return render_template_string(f'''
    <html>
      <head><style>{HTML.split('<style>')[1].split('</style>')[0]}</style></head>
      <body>
        <div style="padding:20px">
          <div id="fc-container">{HTML.split('<div id="fc-container"')[1].split('</div>')[0] + '</div>'}
        </div>
        <script>{HTML.split('<script>')[2].split('</script>')[0]}</script>
      </body>
    </html>
    ''')

# ============================================================

# ============================================================
# START
# ============================================================

if __name__ == '__main__':
    seed()
    app.run(debug=False, host='0.0.0.0', port=5000)
