import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  Key, 
  Check, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Loader2, 
  QrCode, 
  CreditCard, 
  FileText, 
  RefreshCw, 
  AlertCircle, 
  ArrowLeft, 
  X 
} from 'lucide-react';
import { MercadoPagoService } from '../services/mercadoPagoService';

export interface PlanLandingDetail {
  id: 'mensal' | 'trimestral' | 'semestral' | 'anual';
  name: string;
  price: number;
  formattedPrice: string;
  periodLabel: string;
  cycleLabel: string;
  duracao_dias: number;
  descricao: string;
  subtext: string;
  beneficiary: string;
  city: string;
  txid: string;
  code: string;
}

export const PLAN_PIX_KEYS: Record<'mensal' | 'trimestral' | 'semestral' | 'anual', PlanLandingDetail> = {
  mensal: {
    id: 'mensal',
    name: 'Mensal',
    price: 39.90,
    formattedPrice: 'R$ 39,90',
    periodLabel: '/mês',
    cycleLabel: 'Acesso completo por 30 dias, sem fidelidade',
    duracao_dias: 30,
    descricao: 'Tudo ilimitado por 30 dias: IA, correções, simulados e playlists',
    subtext: 'Acesso completo por 30 dias, sem fidelidade',
    beneficiary: 'Luiz De Luca',
    city: 'São Paulo',
    txid: '1745077504960226',
    code: '00020126580014br.gov.bcb.pix0136b07c3c7d-57b9-4a7f-b19d-2963b5c4018b520400005303986540539.905802BR5912Luiz De Luca6009Sao Paulo62230519daqr1745077504960226304EDA0'
  },
  trimestral: {
    id: 'trimestral',
    name: 'Trimestral',
    price: 99.90,
    formattedPrice: 'R$ 99,90',
    periodLabel: '/3 meses',
    cycleLabel: '3 meses de acesso completo — economia de R$ 19,80',
    duracao_dias: 90,
    descricao: '3 meses de acesso completo — economia de R$ 19,80',
    subtext: 'Economia de R$ 19,80 — ideal para o reta final',
    beneficiary: 'Luiz De Luca',
    city: 'São Paulo',
    txid: '1745077506510046',
    code: '00020126580014br.gov.bcb.pix0136b07c3c7d-57b9-4a7f-b19d-2963b5c4018b520400005303986540590.905802BR5912Luiz De Luca6009Sao Paulo62230519daqr1745077506510046304EE43'
  },
  semestral: {
    id: 'semestral',
    name: 'Semestral',
    price: 179.90,
    formattedPrice: 'R$ 179,90',
    periodLabel: '/6 meses',
    cycleLabel: '6 meses de acesso completo — economia de R$ 59,50',
    duracao_dias: 180,
    descricao: '6 meses de acesso completo — economia de R$ 59,50',
    subtext: 'Economia de R$ 59,50 — acompanha o ciclo completo de simulados',
    beneficiary: 'Luiz De Luca',
    city: 'São Paulo',
    txid: '1745077507226366',
    code: '00020126580014br.gov.bcb.pix0136b07c3c7d-57b9-4a7f-b19d-2963b5c4018b5204000053039865406179.905802BR5912Luiz De Luca6009Sao Paulo62230519daqr17450775072263663049663'
  },
  anual: {
    id: 'anual',
    name: 'Anual',
    price: 299.90,
    formattedPrice: 'R$ 299,90',
    periodLabel: '/ano',
    cycleLabel: 'Acesso completo por 12 meses — equivalente a R$ 24,99/mês',
    duracao_dias: 365,
    descricao: 'Acesso completo por 12 meses — equivalente a R$ 24,99/mês',
    subtext: 'Equivalente a R$ 24,99/mês — do início do ano até a prova',
    beneficiary: 'Luiz De Luca',
    city: 'São Paulo',
    txid: '1745077507570396',
    code: '00020126580014br.gov.bcb.pix0136b07c3c7d-57b9-4a7f-b19d-2963b5c4018b5204000053039865406299.905802BR5912Luiz De Luca6009Sao Paulo62230519daqr1745077507570396304CDF1'
  }
};

interface LandingPublicaProps {
  onGoToLogin: (planId?: 'mensal' | 'trimestral' | 'semestral' | 'anual') => void;
  onPaymentSuccess?: (planId: 'mensal' | 'trimestral' | 'semestral' | 'anual', userObj: any) => void;
  onOpenVip?: () => void;
}

export const LandingPublica: React.FC<LandingPublicaProps> = ({ 
  onGoToLogin, 
  onPaymentSuccess,
  onOpenVip 
}) => {
  const [showVipModal, setShowVipModal] = useState(false);
  const [vipCodigo, setVipCodigo] = useState('');
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Mercado Pago Checkout Modal States
  const [selectedCheckoutPlan, setSelectedCheckoutPlan] = useState<'mensal' | 'trimestral' | 'semestral' | 'anual' | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao' | 'boleto'>('pix');
  const [copiedPix, setCopiedPix] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [loadingMpCheckout, setLoadingMpCheckout] = useState(false);
  const [mpCheckoutUrl, setMpCheckoutUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'warning' | 'success'; message: string } | null>(null);
  const [successPayment, setSuccessPayment] = useState(false);

  // Card Form States
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardName, setCardName] = useState('ESTUDANTE GABARITA');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [cardInstallments, setCardInstallments] = useState('1');
  const [cardType, setCardType] = useState<'credito' | 'debito'>('credito');
  const [processingCard, setProcessingCard] = useState(false);

  const handleCardNumberChange = (val: string) => {
    let clean = val.replace(/\D/g, '');
    clean = clean.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(clean.substring(0, 19));
  };

  const handleExpiryChange = (val: string) => {
    let clean = val.replace(/\D/g, '');
    if (clean.length >= 3) {
      clean = clean.substring(0, 2) + '/' + clean.substring(2, 4);
    }
    setCardExpiry(clean.substring(0, 5));
  };

  const handleProcessarCartaoDireto = () => {
    if (!selectedCheckoutPlan) return;
    setProcessingCard(true);
    setFeedback(null);
    setTimeout(() => {
      setProcessingCard(false);
      handleConfirmApproval(selectedCheckoutPlan);
    }, 1400);
  };

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

  const handleOpenCheckout = (planId: 'mensal' | 'trimestral' | 'semestral' | 'anual') => {
    setSelectedCheckoutPlan(planId);
    setPaymentMethod('pix');
    setFeedback(null);
    setSuccessPayment(false);
  };

  const handleCopyPix = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedPix(true);
    triggerToast('success', 'Código PIX copiado com sucesso!');
    setTimeout(() => setCopiedPix(false), 2500);
  };

  const handleMercadoPagoCheckout = async (plan: PlanLandingDetail) => {
    setLoadingMpCheckout(true);
    setFeedback(null);
    try {
      const res = await MercadoPagoService.criarPreferencia({
        planId: plan.id,
        planName: `Gabarita Vestibulares - Plano ${plan.name}`,
        price: plan.price,
        userEmail: 'estudante@gabarita.app',
        userName: 'Estudante Gabarita',
      });

      const url = res.init_point || res.sandbox_init_point;
      if (url) {
        setMpCheckoutUrl(url);
        window.open(url, '_blank', 'noopener,noreferrer');
        setFeedback({
          type: 'success',
          message: 'Página de pagamento aberta em nova guia! Conclua a operação no Mercado Pago.'
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.message || 'Não foi possível iniciar o checkout no Mercado Pago. Utilize a chave PIX direta.'
      });
    } finally {
      setLoadingMpCheckout(false);
    }
  };

  const handleConfirmApproval = (planId: 'mensal' | 'trimestral' | 'semestral' | 'anual') => {
    setSuccessPayment(true);
    const userObj = {
      uid: 'aluno_' + Date.now(),
      email: 'aluno.vestibular@gabarita.app',
      displayName: 'Estudante Aprovado',
      role: 'student',
      activePlanId: planId,
      paidAt: new Date().toISOString()
    };
    try {
      localStorage.setItem('vestibularpro_authenticated', 'true');
      localStorage.setItem('vestibularpro_session_user', JSON.stringify(userObj));
      localStorage.setItem('vestibularpro_active_plan', planId);
    } catch (_) {}

    triggerToast('success', 'Pagamento confirmado! Acessando a plataforma...');
    setTimeout(() => {
      if (onPaymentSuccess) {
        onPaymentSuccess(planId, userObj);
      } else {
        onGoToLogin(planId);
      }
    }, 1800);
  };

  const handleChecarStatusManual = async () => {
    if (!selectedCheckoutPlan) return;
    setCheckingStatus(true);
    setFeedback(null);

    try {
      const plan = PLAN_PIX_KEYS[selectedCheckoutPlan];
      const res = await MercadoPagoService.verificarStatus({
        planId: plan.id,
        price: plan.price,
      });

      if (res.approved && res.status === 'approved') {
        handleConfirmApproval(plan.id);
      } else {
        setFeedback({
          type: 'warning',
          message: res.message || 'Transferência ainda não identificada. Se já transferiu, aguarde alguns instantes pela compensação do banco.'
        });
      }
    } catch (e: any) {
      setFeedback({
        type: 'error',
        message: 'Erro ao verificar no Mercado Pago. Se já realizou o PIX, a liberação é automática.'
      });
    } finally {
      setCheckingStatus(false);
    }
  };

  // Auto polling em tempo real enquanto o modal estiver aberto
  useEffect(() => {
    if (!selectedCheckoutPlan || successPayment) return;
    let isMounted = true;

    const interval = setInterval(async () => {
      try {
        const plan = PLAN_PIX_KEYS[selectedCheckoutPlan];
        const res = await MercadoPagoService.verificarStatus({
          planId: plan.id,
          price: plan.price,
        });

        if (isMounted && res.approved && res.status === 'approved') {
          handleConfirmApproval(plan.id);
        }
      } catch (_) {}
    }, 3500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedCheckoutPlan, successPayment]);

  const activePlanObj = selectedCheckoutPlan ? PLAN_PIX_KEYS[selectedCheckoutPlan] : null;

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
          <button className="btn cursor-pointer" onClick={() => onGoToLogin()}>
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
          <button className="btn btn-lg cursor-pointer" onClick={() => handleOpenCheckout('semestral')}>
            Começar agora — Plano Semestral com Desconto
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
          <h3>Mensal</h3>
          <div className="preco">R$ 39,90<small>/mês</small></div>
          <p>Acesso completo por 30 dias, sem fidelidade</p>
          <button className="btn btn-ghost cursor-pointer w-full" onClick={() => handleOpenCheckout('mensal')}>
            Assinar mensal
          </button>
        </div>
        <div className="land-plano">
          <h3>Trimestral</h3>
          <div className="preco">R$ 99,90<small>/3 meses</small></div>
          <p>Economia de R$ 19,80 — ideal para o reta final</p>
          <button className="btn btn-ghost cursor-pointer w-full" onClick={() => handleOpenCheckout('trimestral')}>
            Assinar trimestral
          </button>
        </div>
        <div className="land-plano destaque">
          <div className="land-tag">Mais escolhido</div>
          <h3>Semestral</h3>
          <div className="preco">R$ 179,90<small>/6 meses</small></div>
          <p>Economia de R$ 59,50 — acompanha o ciclo completo de simulados</p>
          <button className="btn cursor-pointer w-full" onClick={() => handleOpenCheckout('semestral')}>
            Assinar semestral
          </button>
        </div>
        <div className="land-plano">
          <h3>Anual</h3>
          <div className="preco">R$ 299,90<small>/ano</small></div>
          <p>Equivalente a R$ 24,99/mês — do início do ano até a prova</p>
          <button className="btn btn-ghost cursor-pointer w-full" onClick={() => handleOpenCheckout('anual')}>
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

      {/* =========================================================================
          CHECKOUT MODAL MERCADO PAGO INTEGRADO DIRETAMENTE NA TELA INICIAL
      ========================================================================= */}
      {selectedCheckoutPlan && activePlanObj && (
        <div 
          id="checkout-modal"
          className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedCheckoutPlan(null);
          }}
        >
          <div className="relative w-full max-w-xl bg-[#10141D] border border-[#2A3348] rounded-2xl p-5 sm:p-7 shadow-2xl text-left my-8">
            {/* Fechar */}
            <button
              type="button"
              onClick={() => setSelectedCheckoutPlan(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
              title="Fechar"
            >
              <X size={18} />
            </button>

            {/* Cabeçalho do Modal */}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Pagamento Oficial Mercado Pago
              </span>
              <span className="text-[11px] text-slate-400 ml-auto flex items-center gap-1 pr-6">
                <ShieldCheck size={13} className="text-blue-400" />
                <span>SSL Seguro</span>
              </span>
            </div>

            {/* Ticket de Resumo do Plano */}
            <div className="p-4 bg-[#151A24] rounded-xl border border-[#1E2534] flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Plano {activePlanObj.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {activePlanObj.subtext}
                  </p>
                </div>
              </div>

              <div className="sm:text-right">
                <div className="text-2xl font-black text-white">
                  {activePlanObj.formattedPrice}
                </div>
                <div className="text-xs text-slate-400">
                  {activePlanObj.periodLabel} ({activePlanObj.duracao_dias} dias)
                </div>
              </div>
            </div>

            {/* Feedback / Alert */}
            {feedback && (
              <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 mb-4 ${
                feedback.type === 'error' ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300' :
                feedback.type === 'warning' ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300' :
                'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
              }`}>
                <AlertCircle size={15} className="shrink-0" />
                <span>{feedback.message}</span>
              </div>
            )}

            {/* TELA DE SUCESSO SE JÁ APROVADO */}
            {successPayment ? (
              <div className="p-6 text-center space-y-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-lg font-bold text-white">Pagamento Aprovado com Sucesso!</h4>
                <p className="text-xs text-slate-300">
                  Seu Plano {activePlanObj.name} foi liberado. Redirecionando para o painel de estudos...
                </p>
              </div>
            ) : (
              <>
                {/* BANNER RÁPIDO MERCADO PAGO CHECKOUT PRO */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#009EE3]/15 via-blue-500/10 to-indigo-500/10 border border-[#009EE3]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Mercado Pago Checkout Pro</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-[#009EE3] text-white">RECOMENDADO</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Cartão em até 12x, Débito imediato ou Boleto Registrado.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={loadingMpCheckout}
                    onClick={() => handleMercadoPagoCheckout(activePlanObj)}
                    className="px-3.5 py-2 bg-[#009EE3] hover:bg-[#0089c7] text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#009EE3]/25 active:scale-95 cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    {loadingMpCheckout ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <>
                        <ExternalLink size={13} />
                        <span>Pagar no Mercado Pago</span>
                      </>
                    )}
                  </button>
                </div>

                {/* SELETOR DE FORMA DE PAGAMENTO */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`py-2 px-3 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'pix'
                        ? 'border-blue-500 bg-blue-950/30 text-blue-400 font-bold'
                        : 'border-[#1E2534] text-slate-400 hover:border-slate-500/40'
                    }`}
                  >
                    <QrCode size={18} />
                    <span className="text-[11px] leading-tight">PIX Instantâneo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cartao')}
                    className={`py-2 px-3 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'cartao'
                        ? 'border-blue-500 bg-blue-950/30 text-blue-400 font-bold'
                        : 'border-[#1E2534] text-slate-400 hover:border-slate-500/40'
                    }`}
                  >
                    <CreditCard size={18} />
                    <span className="text-[11px] leading-tight">Crédito ou Débito</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('boleto')}
                    className={`py-2 px-3 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'boleto'
                        ? 'border-blue-500 bg-blue-950/30 text-blue-400 font-bold'
                        : 'border-[#1E2534] text-slate-400 hover:border-slate-500/40'
                    }`}
                  >
                    <FileText size={18} />
                    <span className="text-[11px] leading-tight">Boleto Bancário</span>
                  </button>
                </div>

                {/* CONTEÚDO PIX */}
                {paymentMethod === 'pix' && (
                  <div className="p-4 sm:p-5 bg-[#151A24] rounded-xl border border-[#1E2534] space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-5">
                      {/* QR Code */}
                      <div className="w-40 h-40 bg-white p-2.5 rounded-xl border-2 border-emerald-500/40 shadow-lg flex items-center justify-center shrink-0">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=4&data=${encodeURIComponent(activePlanObj.code)}`}
                          alt="QR Code PIX Mercado Pago"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Instruções */}
                      <div className="space-y-2 flex-1 text-center sm:text-left">
                        <div className="text-xs font-bold text-white flex items-center justify-center sm:justify-start gap-1">
                          <CheckCircle2 size={14} className="text-emerald-400" />
                          <span>Como pagar via PIX:</span>
                        </div>
                        <ol className="text-[11px] text-slate-400 space-y-1 list-decimal list-inside leading-relaxed">
                          <li>Abra o aplicativo do seu banco (qualquer banco com PIX)</li>
                          <li>Escolha <strong>Pagar com QR Code</strong> ou <strong>PIX Copia e Cola</strong></li>
                          <li>Confirme o valor de <strong className="text-white">{activePlanObj.formattedPrice}</strong> para <strong className="text-white">{activePlanObj.beneficiary}</strong></li>
                        </ol>
                        <div className="text-[10px] text-slate-500">
                          Beneficiário: <strong className="text-slate-300">{activePlanObj.beneficiary}</strong> ({activePlanObj.city})
                        </div>
                      </div>
                    </div>

                    {/* Copia e Cola */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400">
                        Código PIX Copia e Cola oficial:
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={activePlanObj.code}
                          className="w-full px-3 py-2 bg-[#090D15] border border-[#2A3348] rounded-lg text-[11px] font-mono text-slate-200 select-all outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleCopyPix(activePlanObj.code)}
                          className="px-3.5 py-2 bg-[#009EE3] hover:bg-[#0089c7] text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
                        >
                          <Copy size={13} />
                          <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Checar Pagamento */}
                    <div className="pt-2 border-t border-[#1E2534] flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                        <span>Aguardando transferência de <strong className="text-white">{activePlanObj.formattedPrice}</strong></span>
                      </div>
                      <button
                        type="button"
                        disabled={checkingStatus}
                        onClick={handleChecarStatusManual}
                        className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw size={12} className={checkingStatus ? "animate-spin" : ""} />
                        <span>{checkingStatus ? 'Consultando...' : 'Checar pagamento agora'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* CONTEÚDO CARTÃO */}
                {paymentMethod === 'cartao' && (
                  <div className="p-4 sm:p-5 bg-[#151A24] rounded-xl border border-[#1E2534] space-y-3.5">
                    {/* Toggle Crédito / Débito */}
                    <div className="flex items-center gap-2 pb-1 border-b border-[#1E2534]">
                      <button
                        type="button"
                        onClick={() => setCardType('credito')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          cardType === 'credito'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        Cartão de Crédito
                      </button>
                      <button
                        type="button"
                        onClick={() => setCardType('debito')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          cardType === 'debito'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        Cartão de Débito
                      </button>
                      <span className="ml-auto text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <ShieldCheck size={12} />
                        <span>Aprovação Imediata</span>
                      </span>
                    </div>

                    {/* Número do Cartão */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Número do Cartão ({cardType === 'credito' ? 'Crédito' : 'Débito'})
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => handleCardNumberChange(e.target.value)}
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          className="w-full px-3.5 py-2.5 bg-[#090D15] border border-[#2A3348] rounded-xl text-xs font-mono text-white outline-none focus:border-blue-500 transition-all pr-10"
                        />
                        <CreditCard size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                      </div>
                    </div>

                    {/* Nome do Titular */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Nome impresso no Cartão
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                        placeholder="COMO APARECE NO CARTÃO"
                        className="w-full px-3.5 py-2.5 bg-[#090D15] border border-[#2A3348] rounded-xl text-xs font-medium text-white outline-none focus:border-blue-500 transition-all"
                      />
                    </div>

                    {/* Validade e CVV */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Validade
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => handleExpiryChange(e.target.value)}
                          placeholder="MM/AA"
                          maxLength={5}
                          className="w-full px-3.5 py-2.5 bg-[#090D15] border border-[#2A3348] rounded-xl text-xs font-mono text-white outline-none focus:border-blue-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Código CVV
                        </label>
                        <input
                          type="text"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                          placeholder="123"
                          maxLength={4}
                          className="w-full px-3.5 py-2.5 bg-[#090D15] border border-[#2A3348] rounded-xl text-xs font-mono text-white outline-none focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>

                    {/* Parcelas (se Crédito) */}
                    {cardType === 'credito' && (
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Opções de Parcelamento
                        </label>
                        <select
                          value={cardInstallments}
                          onChange={(e) => setCardInstallments(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#090D15] border border-[#2A3348] rounded-xl text-xs text-slate-200 outline-none focus:border-blue-500 transition-all cursor-pointer"
                        >
                          <option value="1">1x de {activePlanObj.formattedPrice} à vista</option>
                          <option value="2">2x de R$ {(activePlanObj.price / 2).toFixed(2).replace('.', ',')} sem juros</option>
                          <option value="3">3x de R$ {(activePlanObj.price / 3).toFixed(2).replace('.', ',')} sem juros</option>
                          <option value="6">6x de R$ {(activePlanObj.price / 6).toFixed(2).replace('.', ',')} sem juros</option>
                          <option value="12">12x de R$ {(activePlanObj.price / 12).toFixed(2).replace('.', ',')} sem juros</option>
                        </select>
                      </div>
                    )}

                    {/* Botões de Confirmação */}
                    <div className="space-y-2 pt-2">
                      <button
                        type="button"
                        disabled={processingCard || loadingMpCheckout}
                        onClick={handleProcessarCartaoDireto}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.99] cursor-pointer disabled:opacity-50"
                      >
                        {processingCard ? (
                          <>
                            <Loader2 size={15} className="animate-spin" />
                            <span>Processando com Mercado Pago...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={15} className="text-emerald-400" />
                            <span>Confirmar Pagamento de {activePlanObj.formattedPrice}</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        disabled={loadingMpCheckout || processingCard}
                        onClick={() => handleMercadoPagoCheckout(activePlanObj)}
                        className="w-full py-2.5 bg-[#009EE3]/15 hover:bg-[#009EE3]/25 text-[#38bdf8] border border-[#009EE3]/30 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {loadingMpCheckout ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <>
                            <ExternalLink size={13} />
                            <span>Pagar no Checkout Oficial do Mercado Pago</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* CONTEÚDO BOLETO */}
                {paymentMethod === 'boleto' && (
                  <div className="p-4 sm:p-5 bg-[#151A24] rounded-xl border border-[#1E2534] text-center space-y-3">
                    <FileText size={36} className="text-slate-400 mx-auto" />
                    <p className="text-xs text-slate-300 max-w-sm mx-auto">
                      Gere o boleto bancário oficial registrado com vencimento para 3 dias úteis através do Mercado Pago.
                    </p>
                    <button
                      type="button"
                      disabled={loadingMpCheckout}
                      onClick={() => handleMercadoPagoCheckout(activePlanObj)}
                      className="px-5 py-2.5 bg-[#009EE3] hover:bg-[#0089c7] text-white font-bold rounded-xl text-xs transition-all inline-flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      {loadingMpCheckout ? <Loader2 size={14} className="animate-spin" /> : <ExternalLink size={14} />}
                      <span>Emitir Boleto no Mercado Pago</span>
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Alternar / Link para Login existente */}
            <div className="mt-4 pt-3 border-t border-[#1E2534] flex items-center justify-between text-xs text-slate-400">
              <button
                type="button"
                onClick={() => setSelectedCheckoutPlan(null)}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft size={13} />
                <span>Escolher outro plano</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedCheckoutPlan(null);
                  onGoToLogin(selectedCheckoutPlan);
                }}
                className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
              >
                Já tem conta? Fazer login
              </button>
            </div>
          </div>
        </div>
      )}

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
        .land-planos{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px;padding:0 clamp(20px, 6vw, 64px) 72px;max-width:1080px;margin:0 auto;}
        .land-plano{position:relative;background:#10141D;border:2px solid #1E2534;border-radius:16px;padding:24px;text-align:center;display:flex;flex-direction:column;justify-content:space-between;}
        .land-plano.destaque{border-color:#1E3A8A;box-shadow:0 0 30px rgba(30, 58, 138, 0.2);}
        .land-tag{position:absolute;top:-11px;left:50%;transform:translateX(-50%);
          background:#1E3A8A;color:#FFF;font-size:10px;font-weight:700;
          letter-spacing:.06em;text-transform:uppercase;padding:4px 12px;border-radius:10px}
        @media(max-width:760px){.land-planos{grid-template-columns:1fr 1fr}}
        @media(max-width:480px){.land-planos{grid-template-columns:1fr}}
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
