# ============================================================
# gabarita_app.py — APLICAÇÃO COMPLETA EM ARQUIVO ÚNICO
# Backend (Flask + SQLAlchemy + JWT + Mercado Pago)
# + Frontend embutido (landing, splash, login, VIP, planos)
# Executar: python gabarita_app.py
# ============================================================

import os
import secrets
import pathlib
import requests
from datetime import timedelta, datetime

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
SPOTIFY_TOKEN = os.environ.get('SPOTIFY_ACCESS_TOKEN', '')  # token OAuth do usuário
GEMINI_KEY    = os.environ.get('GEMINI_API_KEY', '')
APP_URL = os.environ.get('APP_URL', 'https://gabarita.ai.studio')

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
# MÓDULO LETRA EM TEMPO REAL (Spotify + LRCLIB + Gemini)
# ============================================================

_cache_letras = {}  # evita buscar a mesma faixa repetidamente

@app.route('/api/spotify/atual')
def spotify_atual():
    """Estado atual da reprodução — o front consulta a cada 3s."""
    r = requests.get('https://api.spotify.com/v1/me/player/currently-playing',
                     headers={'Authorization': 'Bearer ' + SPOTIFY_TOKEN}, timeout=10)
    if r.status_code != 200 or not r.json():
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


@app.route('/api/letra')
def letra():
    """Letra completa da faixa atual, sincronizada (formato LRC) quando disponível."""
    faixa = request.args.get('faixa', '')
    artista = request.args.get('artista', '')
    duracao = request.args.get('duracao', 0, type=int) // 1000
    chave = f'{faixa}|{artista}'
    if chave in _cache_letras:
        return jsonify(_cache_letras[chave])

    r = requests.get('https://lrclib.net/api/get',
                     params={'track_name': faixa, 'artist_name': artista, 'duration': duracao},
                     headers={'User-Agent': 'gabarita/1.0 (app de estudos)'},
                     timeout=15)
    if r.status_code != 200:
        return jsonify({'sincronizada': False, 'linhas': []}), 404

    d = r.json()
    lrc = d.get('syncedLyrics') or ''
    linhas = []
    for linha in lrc.splitlines():          # formato LRC: [mm:ss.xx] texto
        if ']' not in linha:
            continue
        tempo, texto = linha.split(']', 1)
        try:
            mm, ss = tempo.strip('[').split(':')
            linhas.append({'t': int(mm) * 60 + float(ss), 'texto': texto.strip()})
        except ValueError:
            continue
    if not linhas and d.get('plainLyrics'):  # fallback: letra sem sincronia
        linhas = [{'t': None, 'texto': l} for l in d['plainLyrics'].splitlines()]

    resp = {'sincronizada': bool(lrc), 'linhas': linhas}
    _cache_letras[chave] = resp
    return jsonify(resp)


@app.route('/api/letra/anotar', methods=['POST'])
@jwt_required()
def letra_anotar():
    """A IA lê a LETRA INTEIRA como contexto e explica o trecho que o usuário tocou."""
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

/* Acessibilidade */
:focus-visible{outline:2px solid var(--blue);outline-offset:2px;border-radius:4px}
@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}
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
    <button class="btn" onclick="irLogin()">Entrar</button>
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

<div id="toast" class="toast"></div>
<div id="app-screen"></div>

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
    toast('success','Bem-vindo, ' + d.nome + '!');
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app-screen').innerHTML =
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

// ===== LETRA EM TEMPO REAL =====
var letraAtual = null;        // {sincronizada, linhas:[{t, texto}]}
var faixaAtual = '';
var progressoLocal = 0;       // ms — interpolado entre polls para fluidez
var ultimoPoll = 0;

async function pollSpotify(){
  try{
    var r = await fetch('/api/spotify/atual');
    var d = await r.json();
    var st = document.getElementById('letra-status');
    if (!st) return;
    if (!d.tocando){ st.textContent = 'Nada tocando no Spotify'; return; }
    st.textContent = 'Sincronizado com o Spotify ●';
    progressoLocal = d.progresso_ms;
    ultimoPoll = Date.now();
    var chave = d.faixa + '|' + d.artista;
    if (chave !== faixaAtual){                 // faixa nova → busca a letra INTEIRA uma vez
      faixaAtual = chave;
      document.getElementById('letra-faixa').textContent = d.faixa + ' — ' + d.artista;
      letraAtual = null;
      var lr = await fetch('/api/letra?faixa=' + encodeURIComponent(d.faixa) +
                           '&artista=' + encodeURIComponent(d.artista) +
                           '&duracao=' + d.duracao_ms);
      letraAtual = await lr.json();
      renderLetra();
    }
  }catch(e){}
}

function renderLetra(){
  var box = document.getElementById('letra-linhas');
  box.innerHTML = '';
  if (!letraAtual || !letraAtual.linhas.length){
    box.innerHTML = '<div class="letra-vazia">Letra não encontrada para esta faixa.</div>';
    return;
  }
  letraAtual.linhas.forEach(function(l, i){
    var div = document.createElement('div');
    div.className = 'letra-linha';
    div.id = 'linha-' + i;
    div.textContent = l.texto || '♪';
    div.onclick = function(){ explicarLinha(i); };   // IA explica a linha tocada
    box.appendChild(div);
  });
}

// Destaque karaoke: 10x por segundo, interpolando o progresso entre os polls
setInterval(function(){
  if (!letraAtual || !letraAtual.sincronizada) return;
  var t = (progressoLocal + (Date.now() - ultimoPoll)) / 1000;
  var linhas = letraAtual.linhas, ativa = -1;
  for (var i = 0; i < linhas.length; i++){
    if (linhas[i].t !== null && linhas[i].t <= t) ativa = i; else break;
  }
  var anterior = document.querySelector('.letra-linha.ativa');
  if (anterior) anterior.classList.remove('ativa');
  if (ativa >= 0){
    var el = document.getElementById('linha-' + ativa);
    if (el){
      el.classList.add('ativa');
      var box = document.getElementById('letra-linhas');
      box.scrollTo({top: el.offsetTop - box.clientHeight/2 + el.clientHeight/2, behavior:'smooth'});
    }
  }
}, 100);

// IA lê a letra completa (contexto) e explica a linha clicada
async function explicarLinha(i){
  var linha = letraAtual.linhas[i];
  if (!linha || !linha.texto) return;
  var el = document.getElementById('linha-' + i);
  el.classList.add('carregando');
  try{
    var r = await fetch('/api/letra/anotar', {
      method:'POST',
      headers:{'Content-Type':'application/json',
               'Authorization':'Bearer ' + localStorage.getItem('gabarita_token')},
      body: JSON.stringify({letra: letraAtual.linhas.map(function(l){return l.texto;}).join('\n'),
                            trecho: linha.texto})});
    var d = await r.json();
    var nota = document.createElement('div');
    nota.className = 'letra-nota';
    nota.textContent = d.explicacao || d.erro || 'Sem explicação no momento';
    el.after(nota);
  }catch(e){}
  el.classList.remove('carregando');
}

setInterval(pollSpotify, 3000);   // poll do Spotify a cada 3s (dentro do rate limit)
pollSpotify();
</script>
</body>
</html>"""

# ============================================================
# ROTA PRINCIPAL — serve o frontend embutido
# ============================================================

@app.route('/')
def index():
    return render_template_string(HTML)

# ============================================================
# START
# ============================================================

if __name__ == '__main__':
    seed()
    app.run(debug=False, host='0.0.0.0', port=5000)
