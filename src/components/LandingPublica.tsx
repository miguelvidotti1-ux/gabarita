import React, { useState } from 'react';
import { ShieldCheck, Sparkles, BookOpen, Key, Check } from 'lucide-react';

interface LandingPublicaProps {
  onGoToLogin: () => void;
  onOpenVip?: () => void;
}

export const LandingPublica: React.FC<LandingPublicaProps> = ({ onGoToLogin, onOpenVip }) => {
  const [showVipModal, setShowVipModal] = useState(false);
  const [vipCodigo, setVipCodigo] = useState('');
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const triggerToast = (type: 'success' | 'error', text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const usarVip = () => {
    const c = vipCodigo.trim();
    if (!c) {
      triggerToast('error', 'Informe o código da sua escola');
      return;
    }
    triggerToast('success', 'Código recebido! Ativação em instantes.');
    setTimeout(() => {
      setShowVipModal(false);
      onGoToLogin();
    }, 900);
  };

  return (
    <div id="landing" className="landing">
      {/* Toast notification */}
      {toastMsg && (
        <div 
          className={`fixed top-5 right-5 z-[9999] px-4 py-3 rounded-xl text-xs font-semibold shadow-xl border flex items-center gap-2 transition-all ${
            toastMsg.type === 'success' 
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200' 
              : 'bg-rose-950/90 border-rose-500/40 text-rose-200'
          }`}
        >
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* NAV */}
      <nav className="land-nav">
        <div className="logo cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="logo-ic">g</div>
          <span className="logo-tx">gabarita<i>.</i></span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            className="vip-btn hidden sm:inline-flex items-center gap-1.5"
            onClick={() => setShowVipModal(true)}
          >
            <span>🔑 Acesso Escolar VIP</span>
          </button>
          <button className="btn cursor-pointer" onClick={onGoToLogin}>
            Entrar
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero">
        <h1>
          Treine como<br />
          <span className="hero-destaque">a banca corrige.</span>
        </h1>
        <p className="hero-sub">
          Redação corrigida no padrão ENEM, FUVEST, UNICAMP e UNESP.
          IA de vestibular 24h. Simulados com diagnóstico TRI. Playlists de foco com letras.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button className="btn btn-lg cursor-pointer" onClick={onGoToLogin}>
            Começar agora — conta em 1 minuto
          </button>
        </div>

        <div className="land-trust">
          🔒 Ambiente criptografado SSL · Dados protegidos pela LGPD
        </div>

        <div className="mt-4 sm:hidden">
          <button 
            type="button" 
            className="vip-btn"
            onClick={() => setShowVipModal(true)}
          >
            🔑 Minha escola tem acesso VIP
          </button>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="land-features">
        <div className="land-card">
          <b>📝 CorrigeBot</b>
          <p>
            Sua redação na régua oficial de cada banca, competência por competência.
          </p>
        </div>
        <div className="land-card">
          <b>🤖 VestBot</b>
          <p>
            IA que responde só sobre vestibulares, 24h, com suas conversas salvas.
          </p>
        </div>
        <div className="land-card">
          <b>📊 Diagnóstico TRI</b>
          <p>
            Saiba onde perde pontos e receba um plano montado a partir do seu boletim.
          </p>
        </div>
        <div className="land-card">
          <b>🎵 Foco com música</b>
          <p>
            Playlists de estudo com letras sincronizadas, integradas ao Spotify.
          </p>
        </div>
      </section>

      {/* PRICING PLANS */}
      <section className="land-planos">
        <div className="land-plano">
          <h3>Gratuito</h3>
          <div className="preco">R$ 0</div>
          <p>3 simulados/mês · 2 correções/mês · 10 perguntas/dia na IA</p>
          <button className="btn btn-ghost cursor-pointer w-full" onClick={onGoToLogin}>
            Começar grátis
          </button>
        </div>

        <div className="land-plano destaque">
          <div className="text-[10px] font-bold tracking-wider uppercase text-blue-400 mb-1">Mais Escolhido</div>
          <h3>Premium</h3>
          <div className="preco">
            R$ 19,90<small>/mês</small>
          </div>
          <p>Tudo ilimitado: IA, correções, simulados, playlists e estatísticas</p>
          <button className="btn cursor-pointer w-full" onClick={onGoToLogin}>
            Assinar Premium
          </button>
        </div>

        <div className="land-plano">
          <h3>Anual</h3>
          <div className="preco">
            R$ 149,90<small>/ano</small>
          </div>
          <p>Equivalente a R$ 12,50/mês — tudo do Premium com desconto</p>
          <button className="btn btn-ghost cursor-pointer w-full" onClick={onGoToLogin}>
            Assinar anual
          </button>
        </div>
      </section>

      {/* ESCOLAS PARCEIRAS CALLOUT */}
      <div className="max-w-xl mx-auto px-6 pb-12 text-center">
        <button 
          type="button" 
          className="vip-btn inline-flex items-center gap-1.5"
          onClick={() => setShowVipModal(true)}
        >
          🔑 Minha escola tem acesso VIP
        </button>
      </div>

      {/* FOOTER */}
      <footer className="land-footer">
        Dúvidas? Suporte no WhatsApp · suporte@gabarita.app · © 2026 gabarita
      </footer>

      {/* VIP MODAL */}
      {showVipModal && (
        <div id="vip-modal" className="vip-modal" onClick={(e) => {
          if (e.target === e.currentTarget) setShowVipModal(false);
        }}>
          <div className="vip-card">
            <h3>Acesso VIP — escolas parceiras</h3>
            <p>
              A Chave VIP libera planos institucionais concedidos pela sua escola.
              Se você recebeu uma, insira aqui:
            </p>
            <input 
              type="text" 
              id="vip-codigo" 
              value={vipCodigo}
              onChange={(e) => setVipCodigo(e.target.value)}
              placeholder="Código fornecido pela escola" 
              autoFocus
              className="w-full px-3.5 py-2.5 bg-[#0a0e17] border border-[#2A3348] rounded-xl text-white text-sm outline-none focus:border-[#60A5FA] transition-all"
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
              <button className="btn" style={{ flex: 1 }} onClick={usarVip}>
                Ativar
              </button>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowVipModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STYLES LOCAIS CONFORME ESPECIFICADO PELO USUÁRIO */}
      <style>{`
        .landing { background: #000; min-height: 100vh; color: #FAFAFA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .land-nav { display: flex; justify-content: space-between; align-items: center; padding: 18px clamp(20px, 6vw, 64px); border-bottom: 1px solid #1E2534; }
        .hero { text-align: center; padding: 72px clamp(20px, 6vw, 64px) 56px; max-width: 760px; margin: 0 auto; }
        .hero h1 { font-size: clamp(34px, 6vw, 52px); line-height: 1.1; letter-spacing: -.02em; font-weight: 800; }
        .hero-destaque { color: #60A5FA; }
        .hero-sub { color: #A3A3A3; font-size: 15px; line-height: 1.7; margin: 18px 0 26px; }
        .btn { background: #1E3A8A; color: #FFF; border: none; border-radius: 10px; padding: 10px 20px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all .2s; }
        .btn:hover { background: #1E40AF; }
        .btn-lg { padding: 16px 34px; font-size: 15px; }
        .land-trust { margin-top: 22px; font-size: 12px; color: #737373; }
        .land-features { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; padding: 0 clamp(20px, 6vw, 64px) 56px; max-width: 1080px; margin: 0 auto; }
        .land-card { background: #10141D; border: 1px solid #1E2534; border-radius: 14px; padding: 20px; text-align: left; }
        .land-card b { color: #FFF; font-size: 15px; display: block; margin-bottom: 4px; }
        .land-card p { font-size: 13px; color: #A3A3A3; line-height: 1.6; margin-top: 8px; }
        .land-planos { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; padding: 0 clamp(20px, 6vw, 64px) 72px; max-width: 1080px; margin: 0 auto; }
        .land-plano { background: #10141D; border: 2px solid #1E2534; border-radius: 16px; padding: 24px; text-align: center; display: flex; flex-direction: column; justify-content: space-between; }
        .land-plano.destaque { border-color: #1E3A8A; box-shadow: 0 0 30px rgba(30, 58, 138, 0.2); }
        .land-plano h3 { font-size: 14px; color: #A3A3A3; font-weight: 600; }
        .preco { font-size: 30px; font-weight: 800; margin: 8px 0; color: #FFF; }
        .preco small { font-size: 12px; color: #737373; font-weight: 400; }
        .land-plano p { font-size: 12px; color: #A3A3A3; line-height: 1.6; margin-bottom: 16px; }
        .btn-ghost { background: #1A2130; color: #FAFAFA; border: 1px solid #2A3348; }
        .btn-ghost:hover { background: #232B3C; }
        .land-footer { text-align: center; font-size: 12px; color: #737373; padding: 24px; border-top: 1px solid #1E2534; }
        .logo { display: flex; align-items: center; gap: 10px; }
        .logo-ic { width: 34px; height: 34px; border-radius: 10px; background: #1E3A8A; color: #FFF; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px; }
        .logo-tx { font-size: 20px; font-weight: 800; letter-spacing: -.02em; color: #FFF; }
        .logo-tx i { color: #1E3A8A; font-style: normal; }
        .vip-btn { background: none; border: 1px solid #2A3348; color: #A3A3A3; padding: 8px 14px; border-radius: 8px; font-size: 12px; cursor: pointer; transition: all .2s; }
        .vip-btn:hover { border-color: #60A5FA; color: #FAFAFA; }
        .vip-modal { position: fixed; inset: 0; background: rgba(0,0,0,.75); z-index: 1500; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); }
        .vip-card { background: #10141D; border: 1px solid #1E2534; border-radius: 16px; padding: 28px; max-width: 380px; width: 100%; text-align: left; }
        .vip-card h3 { font-size: 17px; margin-bottom: 10px; font-weight: 700; color: #FFF; }
        .vip-card p { font-size: 13px; color: #A3A3A3; line-height: 1.6; margin-bottom: 14px; }
      `}</style>
    </div>
  );
};

export default LandingPublica;
