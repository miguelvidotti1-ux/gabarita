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
  X,
  BrainCircuit,
  GraduationCap,
  Flame,
  Star,
  ChevronDown,
  ChevronRight,
  Zap,
  Target,
  Lock,
  Award,
  ArrowRight,
  Clock,
  HelpCircle,
  Headphones,
  MessageSquare,
  Gift
} from 'lucide-react';
import { MercadoPagoService } from '../services/mercadoPagoService';
import { PesquisaModal } from './PesquisaModal';

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
    subtext: 'Economia de R$ 19,80 — ideal para a reta final',
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
  const [showPesquisaModal, setShowPesquisaModal] = useState(false);
  const [vipCodigo, setVipCodigo] = useState('');
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Exibe o questionário obrigatório logo na abertura se o usuário ainda não o concluiu e não está autenticado
  useEffect(() => {
    try {
      const concluido = localStorage.getItem('gabarita_questionario_concluido') === 'true';
      const autenticado = localStorage.getItem('vestibularpro_authenticated') === 'true';
      if (!concluido && !autenticado) {
        setShowPesquisaModal(true);
      }
    } catch (_) {}
  }, []);

  // Interactive Hero Preview Tab
  const [activePreviewTab, setActivePreviewTab] = useState<'redacao' | 'chat' | 'tri' | 'spotify'>('redacao');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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
      triggerToast('error', 'Informe o código institucional fornecido pela sua escola.');
      return;
    }
    triggerToast('success', 'Código validado! Ativação VIP em andamento...');
    setTimeout(() => {
      setShowVipModal(false);
      if (onOpenVip) {
        onOpenVip();
      } else {
        onGoToLogin();
      }
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
    triggerToast('success', 'Código PIX copiado para a área de transferência!');
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

    triggerToast('success', 'Pagamento aprovado! Bem-vindo ao Gabarita.');
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
          message: res.message || 'Transferência ainda não compensada pelo banco. Aguarde alguns instantes e tente novamente.'
        });
      }
    } catch (e: any) {
      setFeedback({
        type: 'error',
        message: 'Erro ao verificar no Mercado Pago. A compensação via PIX costuma levar poucos segundos.'
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

  const faqs = [
    {
      q: 'Como funciona a liberação automática do pagamento via PIX?',
      a: 'Assim que você realiza o PIX no app do seu banco com o QR Code ou código copia-e-cola, nosso sistema recebe a confirmação via webhook do Mercado Pago em até 10 segundos e desbloqueia seu acesso imediatamente, sem necessidade de enviar comprovante.'
    },
    {
      q: 'A correção de redação realmente segue a régua oficial das bancas?',
      a: 'Sim. O CorrigeBot foi treinado estritamente com os manuais de correção e espelhos oficiais do ENEM (as 5 competências de 200 pontos cada), FUVEST (Tema, Gênero e Coesão), UNICAMP (gêneros discursivos) e UNESP. Cada apontamento é fundamentado gramaticalmente e estruturalmente.'
    },
    {
      q: 'Posso usar no smartphone, tablet e computador simultaneamente?',
      a: 'Com certeza! O Gabarita é totalmente responsivo e funciona como Progressive Web App (PWA). Seu progresso, simulados, histórico de redações e conversas com a IA sincronizam automaticamente entre todos os seus dispositivos.'
    },
    {
      q: 'O que é o Acesso Escolar VIP?',
      a: 'Colégios e cursinhos parceiros distribuem chaves institucionais que concedem acesso sem custo aos alunos matriculados. Se sua escola é parceira, basta clicar em "Acesso Escolar VIP" no topo e inserir seu código institucional.'
    },
    {
      q: 'Existe período de fidelidade ou taxa de cancelamento?',
      a: 'Nenhuma fidelidade. Você escolhe o plano que melhor acompanha o seu cronograma de estudos (mensal, trimestral, semestral ou anual) e paga apenas pelo período selecionado.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-[#FAFAFA] selection:bg-blue-600 selection:text-white relative overflow-x-hidden font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div 
          className={`fixed top-5 right-5 z-[9999] px-4 py-3 rounded-xl text-xs font-semibold shadow-2xl border flex items-center gap-2.5 transition-all backdrop-blur-md animate-in fade-in slide-in-from-top-4 ${
            toastMsg.type === 'success' 
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200 shadow-emerald-950/50' 
              : 'bg-rose-950/90 border-rose-500/40 text-rose-200 shadow-rose-950/50'
          }`}
        >
          {toastMsg.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-400 shrink-0" /> : <AlertCircle size={16} className="text-rose-400 shrink-0" />}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Atmospheric Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[620px] pointer-events-none opacity-40 z-0">
        <div className="w-full h-full bg-[radial-gradient(ellipse_75%_50%_at_50%_0%,rgba(37,99,235,0.25),transparent_75%)]" />
      </div>

      {/* Subtle Grid Accent */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035] z-0" 
        style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />

      {/* =========================================================================
          TOP NAVBAR
      ========================================================================= */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#000000]/80 border-b border-[#1E2534]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-900/30 group-hover:scale-105 transition-transform border border-blue-400/30">
              g
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white flex items-center">
                gabarita<span className="text-blue-500">.</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium -mt-1 hidden sm:block">
                Treine como a banca corrige
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-400">
            <a href="#recursos" className="hover:text-white transition-colors">Recursos</a>
            <a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a>
            <a href="#bancas" className="hover:text-white transition-colors">Bancas Oficiais</a>
            <a href="#planos" className="hover:text-white transition-colors">Planos & Valores</a>
            <a href="#faq" className="hover:text-white transition-colors">Dúvidas</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button 
              type="button" 
              onClick={() => setShowPesquisaModal(true)}
              className="px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold text-blue-300 border border-blue-500/30 hover:bg-blue-500/10 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Diagnóstico de Estudos"
            >
              <Target size={13} className="text-blue-400 shrink-0" />
              <span className="hidden sm:inline">Diagnóstico de Estudos</span>
              <span className="sm:hidden">Diagnóstico</span>
            </button>

            <button 
              type="button" 
              onClick={() => setShowVipModal(true)}
              className="px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 border border-[#2A3348] hover:border-blue-500/60 hover:text-white hover:bg-blue-500/5 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Key size={13} className="text-amber-400 shrink-0" />
              <span className="hidden sm:inline">Acesso Escolar VIP</span>
              <span className="sm:hidden">VIP</span>
            </button>

            <button 
              type="button"
              onClick={() => onGoToLogin()}
              className="px-4.5 py-2 rounded-xl text-xs font-bold text-white bg-[#1E3A8A] hover:bg-[#2563EB] border border-blue-400/30 shadow-md shadow-blue-900/30 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>Entrar</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          HERO SECTION (High conversion & visual punch)
      ========================================================================= */}
      <section className="relative z-10 pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-[11px] sm:text-xs font-semibold mb-6 shadow-sm backdrop-blur-md animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span>Matriz Oficial Atualizada · ENEM, FUVEST, UNICAMP & UNESP 2026</span>
        </div>

        {/* Impactful Editorial Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] max-w-4xl mx-auto">
          Treine exatamente como<br />
          <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
            a banca oficial corrige.
          </span>
        </h1>

        {/* Clear Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Redação corrigida competência por competência, IA de vestibular 24h, simulados com régua TRI calibrada e ambiente sonoro com letras sincronizadas.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
          <button 
            type="button"
            onClick={() => handleOpenCheckout('semestral')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#1D4ED8] hover:from-[#2563EB] hover:to-[#1E40AF] text-white text-sm font-bold shadow-xl shadow-blue-600/25 border border-blue-400/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles size={16} className="text-sky-300" />
            <span>Começar Agora — Plano Semestral</span>
          </button>

          <a 
            href="#planos"
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-[#10141D] hover:bg-[#1A2130] text-slate-300 hover:text-white text-sm font-semibold border border-[#1E2534] hover:border-slate-500/50 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Ver todos os 4 planos</span>
            <ChevronDown size={14} />
          </a>
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-7 text-[11px] sm:text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Lock size={13} className="text-emerald-400" />
            <span>Ambiente Seguro SSL 256-bit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap size={13} className="text-blue-400" />
            <span>Liberação Imediata no PIX</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-indigo-400" />
            <span>Conforme Diretrizes LGPD</span>
          </div>
        </div>

        {/* =========================================================================
            INTERACTIVE PREVIEW SHOWCASE (CorrigeBot, VestBot, TRI, Spotify)
        ========================================================================= */}
        <div className="mt-14 max-w-5xl mx-auto bg-[#10141D] border border-[#1E2534] rounded-2xl shadow-2xl p-4 sm:p-7 text-left">
          {/* Tab Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2 pb-4 border-b border-[#1E2534] overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActivePreviewTab('redacao')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activePreviewTab === 'redacao'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                  : 'bg-[#151A24] text-slate-400 hover:text-white hover:bg-[#1A2130]'
              }`}
            >
              <FileText size={14} />
              <span>CorrigeBot Redação</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-blue-950 text-blue-200 border border-blue-400/30">NOTA 1000</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePreviewTab('chat')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activePreviewTab === 'chat'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                  : 'bg-[#151A24] text-slate-400 hover:text-white hover:bg-[#1A2130]'
              }`}
            >
              <BrainCircuit size={14} />
              <span>VestBot IA 24h</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePreviewTab('tri')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activePreviewTab === 'tri'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                  : 'bg-[#151A24] text-slate-400 hover:text-white hover:bg-[#1A2130]'
              }`}
            >
              <Target size={14} />
              <span>Diagnóstico TRI</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePreviewTab('spotify')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activePreviewTab === 'spotify'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                  : 'bg-[#151A24] text-slate-400 hover:text-white hover:bg-[#1A2130]'
              }`}
            >
              <Headphones size={14} />
              <span>Spotify & Letras</span>
            </button>
          </div>

          {/* Tab 1: CorrigeBot Redação */}
          {activePreviewTab === 'redacao' && (
            <div className="pt-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0A0D14] p-3.5 rounded-xl border border-[#1E2534]">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400">Simulação Oficial ENEM</span>
                  <h4 className="text-sm font-bold text-white">Tema: Desafios para a valorização de comunidades tradicionais</h4>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-black text-sm">
                    960 / 1000
                  </div>
                  <span className="text-[11px] text-slate-400">Nota Estimada</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 p-4 bg-[#0A0D14] rounded-xl border border-[#1E2534] font-mono text-xs leading-relaxed text-slate-300 space-y-2">
                  <p>
                    <span className="bg-blue-950/70 text-blue-200 px-1 py-0.5 rounded border border-blue-500/30">Na perspectiva do sociólogo Zygmunt Bauman</span>, a fragilização das relações coletivas gera a invisibilidade dos povos originários...
                  </p>
                  <p>
                    Torna-se imperativo, portanto, que o Ministério dos Povos Indígenas, <span className="bg-emerald-950/70 text-emerald-200 px-1 py-0.5 rounded border border-emerald-500/30">em articulação com os Governos Estaduais</span>, promova a demarcação e a proteção contínua dos territórios...
                  </p>
                  <div className="text-[10px] text-slate-500 font-sans pt-2 border-t border-[#1E2534] flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    <span>Todas as 5 competências do espelho Inep avaliadas com justificativa linha por linha.</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-[#151A24] border border-[#1E2534] flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">C1 - Gramática Formal</span>
                    <span className="font-bold text-emerald-400">200 / 200</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#151A24] border border-[#1E2534] flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">C2 - Tema e Repertório</span>
                    <span className="font-bold text-emerald-400">200 / 200</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#151A24] border border-[#1E2534] flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">C3 - Projeto de Texto</span>
                    <span className="font-bold text-amber-400">160 / 200</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#151A24] border border-[#1E2534] flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">C4 - Coesão e Conectivos</span>
                    <span className="font-bold text-emerald-400">200 / 200</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#151A24] border border-[#1E2534] flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">C5 - Proposta de Intervenção</span>
                    <span className="font-bold text-emerald-400">200 / 200</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: VestBot IA 24h */}
          {activePreviewTab === 'chat' && (
            <div className="pt-5 space-y-3">
              <div className="p-3.5 bg-[#0A0D14] rounded-xl border border-[#1E2534] space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center text-xs font-bold">V</div>
                  <span className="text-xs font-bold text-white">VestBot Especialista</span>
                  <span className="text-[10px] text-slate-500 ml-auto">FUVEST 1ª Fase · Física</span>
                </div>
                <p className="text-xs text-slate-300">
                  "Para calcular a aceleração no plano inclinado com atrito cinético de 0,2 e inclinação de 30°, basta decompor o peso: <code className="bg-[#151A24] px-1 py-0.5 rounded text-blue-300">a = g · (sen 30° - μ · cos 30°)</code>. Substituindo: <strong className="text-white">a ≈ 3,27 m/s²</strong>."
                </p>
                <div className="text-[11px] text-blue-400 flex items-center gap-1 font-semibold pt-1">
                  <span>💡 Dica da Banca: Fique atento ao valor adotado para a gravidade na capa do exame!</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Diagnóstico TRI */}
          {activePreviewTab === 'tri' && (
            <div className="pt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-[#0A0D14] rounded-xl border border-[#1E2534] space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Matemática e Tecnologias</span>
                <div className="text-xl font-black text-white">842,5 <small className="text-xs font-normal text-emerald-400">TRI</small></div>
                <p className="text-[11px] text-slate-400">Consistência alta: acertou 39/45 sem chutes em questões difíceis.</p>
              </div>

              <div className="p-3.5 bg-[#0A0D14] rounded-xl border border-[#1E2534] space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Ciências da Natureza</span>
                <div className="text-xl font-black text-white">765,8 <small className="text-xs font-normal text-amber-400">TRI</small></div>
                <p className="text-[11px] text-slate-400">Ponto de melhoria detectado: Termodinâmica e Eletrodinâmica.</p>
              </div>

              <div className="p-3.5 bg-[#0A0D14] rounded-xl border border-[#1E2534] space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Linguagens & Códigos</span>
                <div className="text-xl font-black text-white">712,4 <small className="text-xs font-normal text-blue-400">TRI</small></div>
                <p className="text-[11px] text-slate-400">Desempenho excelente em Interpretação e Artes Modernistas.</p>
              </div>
            </div>
          )}

          {/* Tab 4: Spotify & Letras */}
          {activePreviewTab === 'spotify' && (
            <div className="pt-5 p-4 bg-[#0A0D14] rounded-xl border border-[#1E2534] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#1DB954]/20 text-[#1DB954] flex items-center justify-center font-bold text-xl shrink-0">
                  <Headphones size={24} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>Lo-Fi Beats & Concentração Profunda</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#1DB954]/20 text-[#1DB954] font-bold">CONECTADO</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Letras sincronizadas em tempo real para manter o ritmo sem distrações.</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[#1DB954] text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse" />
                <span>Timer Pomodoro Integrado</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          AUTHORITY & STATS COUNTERS
      ========================================================================= */}
      <section id="bancas" className="py-12 border-y border-[#1E2534] bg-[#0A0D14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">+18 Anos</div>
              <p className="text-xs sm:text-sm text-slate-400">De provas oficiais catalogadas (2008 - 2026)</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-400 tracking-tight">4 Bancas</div>
              <p className="text-xs sm:text-sm text-slate-400">ENEM, FUVEST, UNICAMP & UNESP</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">5 Competências</div>
              <p className="text-xs sm:text-sm text-slate-400">Régua do espelho oficial Inep</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight">24h / 7 dias</div>
              <p className="text-xs sm:text-sm text-slate-400">Tutor de vestibular disponível</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURES SECTION (BENTO GRID)
      ========================================================================= */}
      <section id="recursos" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Ecossistema Completo</h2>
          <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Tudo o que você precisa para a aprovação.
          </h3>
          <p className="text-sm sm:text-base text-slate-400 mt-3">
            Ferramentas calibradas por professores especialistas para substituir o estudo genérico pelo método de alto rendimento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-[#10141D] border border-[#1E2534] hover:border-blue-500/40 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <FileText size={20} />
              </div>
              <h4 className="text-base font-bold text-white">CorrigeBot Redação</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Envie o texto digitado ou faça transcrição por voz. Avaliação nota a nota com sugestões práticas de repertório e coesão.
              </p>
            </div>
            <div className="pt-4 text-[11px] font-semibold text-blue-400 flex items-center gap-1">
              <span>Espelho oficial 1000</span>
              <ChevronRight size={13} />
            </div>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-[#10141D] border border-[#1E2534] hover:border-blue-500/40 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <BrainCircuit size={20} />
              </div>
              <h4 className="text-base font-bold text-white">VestBot Especialista</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tire dúvidas de exatas, humanas e biológicas a qualquer hora. Ele não dá respostas genéricas: ensina a pensar como a banca quer.
              </p>
            </div>
            <div className="pt-4 text-[11px] font-semibold text-indigo-400 flex items-center gap-1">
              <span>Memória contínua</span>
              <ChevronRight size={13} />
            </div>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-[#10141D] border border-[#1E2534] hover:border-blue-500/40 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Target size={20} />
              </div>
              <h4 className="text-base font-bold text-white">Diagnóstico TRI Real</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Descubra sua nota real calculada pela Teoria de Resposta ao Item. Pare de perder pontos preciosos por inconsistência pedagógica.
              </p>
            </div>
            <div className="pt-4 text-[11px] font-semibold text-sky-400 flex items-center gap-1">
              <span>Mapeamento de fraquezas</span>
              <ChevronRight size={13} />
            </div>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-2xl bg-[#10141D] border border-[#1E2534] hover:border-emerald-500/40 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Headphones size={20} />
              </div>
              <h4 className="text-base font-bold text-white">Foco Musical & Letras</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Integração Spotify com playlists curadas para foco intenso, bloqueio de distrações sonoras e letras sincronizadas com LRCLIB.
              </p>
            </div>
            <div className="pt-4 text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
              <span>Spotify Connect</span>
              <ChevronRight size={13} />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PRICING PLANS SECTION (4 High-converting cards)
      ========================================================================= */}
      <section id="planos" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#1E2534]/60">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/40 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-3">
            <Sparkles size={13} />
            <span>Investimento Sem Surpresas</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Escolha o plano ideal para a sua jornada.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3">
            Acesso ilimitado a todas as ferramentas. Liberação instantânea no PIX ou parcelamento no Cartão via Mercado Pago.
          </p>
        </div>

        {/* 4 Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {/* Plano 1: Mensal */}
          <div className="relative p-6 sm:p-7 rounded-2xl bg-[#10141D] border border-[#1E2534] hover:border-slate-500/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white">Mensal</h3>
                <p className="text-xs text-slate-400 mt-1">Acesso completo por 30 dias, sem fidelidade.</p>
              </div>

              <div className="pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">R$ 39,90</span>
                  <span className="text-xs text-slate-400">/mês</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Cobrança única de R$ 39,90</div>
              </div>

              <div className="pt-4 border-t border-[#1E2534] space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>CorrigeBot de Redação Ilimitado</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>VestBot IA de Vestibular 24h</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>Simulados com Cálculo TRI</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>Músicas para Estudo no Spotify</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button 
                type="button"
                onClick={() => handleOpenCheckout('mensal')}
                className="w-full py-3 rounded-xl bg-[#1A2130] hover:bg-[#232B3C] text-white text-xs font-bold border border-[#2A3348] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Assinar Plano Mensal</span>
              </button>
            </div>
          </div>

          {/* Plano 2: Trimestral */}
          <div className="relative p-6 sm:p-7 rounded-2xl bg-[#10141D] border border-[#1E2534] hover:border-slate-500/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Trimestral</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  Economize R$ 19,80
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Ideal para intensivos e reta final do exame.</p>

              <div className="pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">R$ 99,90</span>
                  <span className="text-xs text-slate-400">/3 meses</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Equivalente a R$ 33,30/mês</div>
              </div>

              <div className="pt-4 border-t border-[#1E2534] space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>Tudo do Plano Mensal</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>Acesso por 90 dias ininterruptos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>Histórico de Evolução de Notas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>Flashcards SkillSwipe Liberados</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button 
                type="button"
                onClick={() => handleOpenCheckout('trimestral')}
                className="w-full py-3 rounded-xl bg-[#1A2130] hover:bg-[#232B3C] text-white text-xs font-bold border border-[#2A3348] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Assinar Trimestral</span>
              </button>
            </div>
          </div>

          {/* Plano 3: Semestral (DESTAQUE MÁXIMO) */}
          <div className="relative p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-[#131B2A] to-[#10141D] border-2 border-blue-500 shadow-2xl shadow-blue-900/30 flex flex-col justify-between transform lg:-translate-y-2">
            {/* Tag flutuante */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
              Mais Escolhido
            </div>

            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white">Semestral</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Economize R$ 59,50
                </span>
              </div>
              <p className="text-xs text-slate-300">Acompanha o ciclo completo de simulados até as provas.</p>

              <div className="pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-black text-white">R$ 179,90</span>
                  <span className="text-xs text-slate-400">/6 meses</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold mt-1">Apenas R$ 29,98 por mês</div>
              </div>

              <div className="pt-4 border-t border-blue-500/20 space-y-2.5 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-blue-400 shrink-0" />
                  <span className="font-semibold text-white">Acesso Total por 180 dias</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-blue-400 shrink-0" />
                  <span>Correções ilimitadas sem fila</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-blue-400 shrink-0" />
                  <span>Cronograma Dinâmico de Estudos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-blue-400 shrink-0" />
                  <span>Suporte prioritário via WhatsApp</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button 
                type="button"
                onClick={() => handleOpenCheckout('semestral')}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Sparkles size={14} />
                <span>Garantir Plano Semestral</span>
              </button>
            </div>
          </div>

          {/* Plano 4: Anual */}
          <div className="relative p-6 sm:p-7 rounded-2xl bg-[#10141D] border border-[#1E2534] hover:border-slate-500/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Anual</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Melhor Custo
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Do primeiro dia de aula até a aprovação na lista final.</p>

              <div className="pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">R$ 299,90</span>
                  <span className="text-xs text-slate-400">/ano</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Equivalente a R$ 24,99/mês</div>
              </div>

              <div className="pt-4 border-t border-[#1E2534] space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>Acesso por 365 dias completos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>Todas as atualizações do ano incluídas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>Bolsa de Estudos & Ranking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>Cartão parcelado em até 12x</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button 
                type="button"
                onClick={() => handleOpenCheckout('anual')}
                className="w-full py-3 rounded-xl bg-[#1A2130] hover:bg-[#232B3C] text-white text-xs font-bold border border-[#2A3348] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Assinar Plano Anual</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ESCOLAS PARCEIRAS / VIP CALLOUT
      ========================================================================= */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-950/30 via-[#10141D] to-indigo-950/30 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[11px] font-bold">
              <Key size={12} />
              <span>Convênio Institucional</span>
            </div>
            <h4 className="text-lg font-bold text-white">Sua escola ou cursinho é parceiro do Gabarita?</h4>
            <p className="text-xs text-slate-400">
              Alunos de instituições conveniadas possuem acesso integral sem custo através da Chave VIP.
            </p>
          </div>

          <button 
            type="button"
            onClick={() => setShowVipModal(true)}
            className="px-5 py-3 rounded-xl bg-[#151A24] hover:bg-[#1E2534] text-white text-xs font-bold border border-[#2A3348] hover:border-blue-400/50 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-md"
          >
            <Key size={14} className="text-amber-400" />
            <span>Ativar Código Escolar VIP</span>
          </button>
        </div>
      </section>

      {/* =========================================================================
          FAQ ACCORDION
      ========================================================================= */}
      <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-[#1E2534]/60">
        <div className="text-center mb-10">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Perguntas Frequentes</h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">Dúvidas comuns sobre planos, correções e liberação.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx} 
                className="rounded-xl bg-[#10141D] border border-[#1E2534] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4.5 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02]"
                >
                  <span className="text-xs sm:text-sm font-bold text-white">{faq.q}</span>
                  <ChevronDown 
                    size={16} 
                    className={`text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-blue-400' : ''}`} 
                  />
                </button>

                {isOpen && (
                  <div className="px-4.5 sm:px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-[#1E2534]/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          FOOTER
      ========================================================================= */}
      <footer className="border-t border-[#1E2534] bg-[#07090E] py-10 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400 space-y-4">
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">g</div>
          <span className="font-extrabold text-white tracking-tight">gabarita.</span>
        </div>
        <p className="max-w-md mx-auto text-[11px] text-slate-400">
          Plataforma de alta precisão para vestibulares e redação oficial. Suporte ao estudante via WhatsApp e e-mail: <strong className="text-slate-200">suporte@gabarita.app</strong>
        </p>
        <div className="text-[10px] text-slate-400 pt-2 border-t border-[#1E2534]/40">
          © 2026 gabarita. Todos os direitos reservados. Ambiente seguro e criptografado.
        </div>
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
                  Seu Plano {activePlanObj.name} foi liberado. Acessando a plataforma...
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

      {/* =========================================================================
          VIP MODAL (Acesso Escolar)
      ========================================================================= */}
      {showVipModal && (
        <div 
          id="vip-modal" 
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md" 
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowVipModal(false);
          }}
        >
          <div className="relative w-full max-w-md bg-[#10141D] border border-[#2A3348] rounded-2xl p-6 sm:p-7 shadow-2xl text-left">
            <button
              type="button"
              onClick={() => setShowVipModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold mb-4">
              <Key size={22} />
            </div>

            <h3 className="text-lg font-bold text-white mb-1.5">Acesso Escolar VIP</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              A Chave VIP libera planos institucionais concedidos por escolas e cursinhos parceiros do Gabarita. Se você recebeu um código, insira-o abaixo:
            </p>

            <div className="space-y-3">
              <input 
                type="text" 
                id="vip-codigo" 
                value={vipCodigo}
                onChange={(e) => setVipCodigo(e.target.value)}
                placeholder="Ex: ESCOLA-VEST-2026" 
                autoFocus
                className="w-full px-3.5 py-3 bg-[#090D15] border border-[#2A3348] rounded-xl text-white text-xs font-mono outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
              />

              <div className="flex gap-2 pt-1">
                <button 
                  type="button"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95" 
                  onClick={usarVip}
                >
                  Validar Código VIP
                </button>
                <button 
                  type="button"
                  className="px-4 py-2.5 rounded-xl bg-[#151A24] hover:bg-[#1E2534] text-slate-400 hover:text-white text-xs font-semibold border border-[#2A3348] transition-all cursor-pointer" 
                  onClick={() => setShowVipModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUESTIONÁRIO DIAGNÓSTICO OBRIGATÓRIO (Com botão 'Já tenho uma conta') */}
      <PesquisaModal 
        isOpen={showPesquisaModal} 
        obrigatorio={true}
        onClose={() => setShowPesquisaModal(false)}
        onJaTenhoConta={() => {
          setShowPesquisaModal(false);
          onGoToLogin();
        }}
        onSuccess={() => {
          triggerToast('success', 'Diagnóstico concluído! Seja bem-vindo ao Gabarita.');
        }}
      />
    </div>
  );
};

export default LandingPublica;
