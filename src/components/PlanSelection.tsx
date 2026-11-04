import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  CreditCard, 
  QrCode, 
  FileText, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Copy, 
  ShieldCheck,
  Crown,
  RefreshCw,
  TrendingUp,
  Calendar,
  Info,
  ChevronRight,
  Zap,
  ExternalLink,
  Lock,
  Loader2,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { MercadoPagoService, PixPaymentResponse } from '../services/mercadoPagoService';

interface PlanSelectionProps {
  onComplete?: () => void;
  userEmail?: string;
  userName?: string;
  currentPlanId?: 'mensal' | 'trimestral' | 'semestral' | 'anual';
}

interface PlanOption {
  id: 'mensal' | 'trimestral' | 'semestral' | 'anual';
  name: string;
  price: number;
  periodLabel: string;
  cycleLabel: string;
  savings?: string;
  popular?: boolean;
  features: { text: string; enabled: boolean }[];
}

export const PLAN_PIX_KEYS: Record<
  'mensal' | 'trimestral' | 'semestral' | 'anual',
  { code: string; price: number; formattedPrice: string; beneficiary: string; city: string; txid: string }
> = {
  mensal: {
    price: 39.90,
    formattedPrice: 'R$ 39,90',
    beneficiary: 'Luiz De Luca',
    city: 'São Paulo',
    txid: '1745077504960226',
    code: '00020126580014br.gov.bcb.pix0136b07c3c7d-57b9-4a7f-b19d-2963b5c4018b520400005303986540539.905802BR5912Luiz De Luca6009Sao Paulo62230519daqr1745077504960226304EDA0'
  },
  trimestral: {
    price: 99.90,
    formattedPrice: 'R$ 99,90',
    beneficiary: 'Luiz De Luca',
    city: 'São Paulo',
    txid: '1745077506510046',
    code: '00020126580014br.gov.bcb.pix0136b07c3c7d-57b9-4a7f-b19d-2963b5c4018b520400005303986540590.905802BR5912Luiz De Luca6009Sao Paulo62230519daqr1745077506510046304EE43'
  },
  semestral: {
    price: 179.90,
    formattedPrice: 'R$ 179,90',
    beneficiary: 'Luiz De Luca',
    city: 'São Paulo',
    txid: '1745077507226366',
    code: '00020126580014br.gov.bcb.pix0136b07c3c7d-57b9-4a7f-b19d-2963b5c4018b5204000053039865406179.905802BR5912Luiz De Luca6009Sao Paulo62230519daqr17450775072263663049663'
  },
  anual: {
    price: 299.90,
    formattedPrice: 'R$ 299,90',
    beneficiary: 'Luiz De Luca',
    city: 'São Paulo',
    txid: '1745077507570396',
    code: '00020126580014br.gov.bcb.pix0136b07c3c7d-57b9-4a7f-b19d-2963b5c4018b5204000053039865406299.905802BR5912Luiz De Luca6009Sao Paulo62230519daqr1745077507570396304CDF1'
  }
};

const PLANS: PlanOption[] = [
  {
    id: 'mensal',
    name: 'Mensal',
    price: 39.90,
    periodLabel: 'por mês',
    cycleLabel: 'Cobrança mensal recorrente',
    features: [
      { text: 'Acesso a todas as provas e vestibulares', enabled: true },
      { text: 'Gabaritos comentados detalhados', enabled: true },
      { text: 'Simulados ilimitados com cronômetro', enabled: true },
      { text: 'Análise de desempenho por disciplina', enabled: false },
      { text: 'Suporte prioritário e mentorias', enabled: false },
    ]
  },
  {
    id: 'trimestral',
    name: 'Trimestral',
    price: 99.90,
    periodLabel: 'a cada 3 meses',
    cycleLabel: 'Cobrança a cada 3 meses',
    savings: 'Economize 16%',
    features: [
      { text: 'Acesso a todas as provas e vestibulares', enabled: true },
      { text: 'Gabaritos comentados detalhados', enabled: true },
      { text: 'Simulados ilimitados com cronômetro', enabled: true },
      { text: 'Análise de desempenho por disciplina', enabled: true },
      { text: 'Suporte prioritário e mentorias', enabled: false },
    ]
  },
  {
    id: 'semestral',
    name: 'Semestral',
    price: 179.90,
    periodLabel: 'a cada 6 meses',
    cycleLabel: 'Cobrança a cada 6 meses',
    savings: 'Economize 25%',
    popular: true,
    features: [
      { text: 'Acesso a todas as provas e vestibulares', enabled: true },
      { text: 'Gabaritos comentados detalhados', enabled: true },
      { text: 'Simulados ilimitados com cronômetro', enabled: true },
      { text: 'Análise de desempenho por disciplina', enabled: true },
      { text: 'Suporte prioritário com tiradúvidas', enabled: true },
    ]
  },
  {
    id: 'anual',
    name: 'Anual Premium',
    price: 299.90,
    periodLabel: 'por ano',
    cycleLabel: 'Cobrança anual única',
    savings: 'Economize 37%',
    features: [
      { text: 'Acesso a todas as provas e vestibulares', enabled: true },
      { text: 'Gabaritos comentados detalhados', enabled: true },
      { text: 'Simulados ilimitados com cronômetro', enabled: true },
      { text: 'Análise de desempenho avançada com IA', enabled: true },
      { text: 'Suporte prioritário + mentorias exclusivas', enabled: true },
    ]
  }
];

export const PlanSelection: React.FC<PlanSelectionProps> = ({ 
  onComplete, 
  userEmail,
  userName,
  currentPlanId = 'semestral'
}) => {
  // State
  const [activePlanId, setActivePlanId] = useState<'mensal' | 'trimestral' | 'semestral' | 'anual'>(currentPlanId);
  const [screen, setScreen] = useState<'overview' | 'payment' | 'success'>('overview');
  const [selectedPlanForMigration, setSelectedPlanForMigration] = useState<PlanOption | null>(null);
  
  const [paymentMethod, setPaymentMethod] = useState<'cartao' | 'pix' | 'boleto'>('cartao');
  
  // Payment Form Fields
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardName, setCardName] = useState(userName || 'ESTUDANTE GABARITA');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');

  // UI States
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [loadingMpCheckout, setLoadingMpCheckout] = useState(false);
  const [loadingPix, setLoadingPix] = useState(false);
  const [mpCheckoutUrl, setMpCheckoutUrl] = useState<string | null>(null);
  const [mpPixData, setMpPixData] = useState<PixPaymentResponse | null>(null);
  const [mpPaymentId, setMpPaymentId] = useState<string | number | null>(null);
  const [mpSuccessMessage, setMpSuccessMessage] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'warning' | 'success'; message: string } | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  // Check URL params for Mercado Pago return (approved, pending, etc.)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const status = params.get('status') || params.get('mp_status');
      const plan = params.get('plan');
      if (status === 'approved' && plan && ['mensal', 'trimestral', 'semestral', 'anual'].includes(plan)) {
        const matchedPlan = PLANS.find(p => p.id === plan);
        if (matchedPlan) {
          setActivePlanId(matchedPlan.id);
          setSelectedPlanForMigration(matchedPlan);
          setScreen('success');
          setMpSuccessMessage('Pagamento confirmado com sucesso pelo Mercado Pago! Seu plano foi ativado.');
          if (auth.currentUser) {
            updateDoc(doc(db, 'users', auth.currentUser.uid), {
              activePlanId: matchedPlan.id,
              planUpdatedAt: new Date().toISOString(),
              paymentProvider: 'mercadopago',
              paymentStatus: 'approved',
            }).catch(console.error);
          }
          try {
            localStorage.setItem('vestibularpro_active_plan', matchedPlan.id);
          } catch (_) {}
        }
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (e) {
      console.error('Error reading MP status params:', e);
    }
  }, []);

  // Real-time automatic polling when on payment screen
  // Automatically detects payment on Mercado Pago and activates plan without user button
  useEffect(() => {
    if (screen !== 'payment' || !selectedPlanForMigration) return;

    let isSubscribed = true;

    const checkApproval = async () => {
      try {
        const res = await MercadoPagoService.verificarStatus({
          planId: selectedPlanForMigration.id,
          paymentId: mpPaymentId,
          userEmail: userEmail || auth.currentUser?.email || undefined,
          price: selectedPlanForMigration.price,
        });

        if (isSubscribed && res.approved && res.status === 'approved') {
          setActivePlanId(selectedPlanForMigration.id);
          if (auth.currentUser) {
            updateDoc(doc(db, 'users', auth.currentUser.uid), {
              activePlanId: selectedPlanForMigration.id,
              planUpdatedAt: new Date().toISOString(),
              paymentProvider: 'mercadopago',
              paymentStatus: 'approved',
              paymentId: res.paymentId || 'mp_verified',
            }).catch(console.error);
          }
          try {
            localStorage.setItem('vestibularpro_active_plan', selectedPlanForMigration.id);
          } catch (_) {}

          setMpSuccessMessage(
            `Pagamento de R$ ${selectedPlanForMigration.price.toFixed(2).replace('.', ',')} identificado e aprovado! Seu Plano ${selectedPlanForMigration.name} foi liberado com sucesso.`
          );
          setScreen('success');
        }
      } catch (e) {
        // Continue polling silently
      }
    };

    // Immediate check
    checkApproval();

    // Poll every 3.5 seconds
    const interval = setInterval(checkApproval, 3500);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [screen, selectedPlanForMigration, mpPaymentId, userEmail]);

  // Sync plan from Firestore if available
  useEffect(() => {
    const fetchUserPlan = async () => {
      if (auth.currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (userDoc.exists() && userDoc.data().activePlanId) {
            setActivePlanId(userDoc.data().activePlanId);
          }
        } catch (e) {
          console.error("Error loading user plan:", e);
        }
      }
    };
    fetchUserPlan();
  }, []);

  const activePlanObj = PLANS.find(p => p.id === activePlanId) || PLANS[2];

  // Mercado Pago Checkout Pro
  const handleMercadoPagoCheckout = async (plan: PlanOption) => {
    setLoadingMpCheckout(true);
    setFeedback(null);
    try {
      const pref = await MercadoPagoService.criarPreferencia({
        planId: plan.id,
        planName: plan.name,
        price: plan.price,
        userEmail: userEmail || auth.currentUser?.email || undefined,
        userName: userName || auth.currentUser?.displayName || undefined,
      });

      if (pref.init_point) {
        setMpCheckoutUrl(pref.init_point);
        const isInIframe = window.self !== window.top;
        if (!isInIframe) {
          window.location.href = pref.init_point;
        }
      } else {
        throw new Error('Link de checkout não recebido do Mercado Pago.');
      }
    } catch (err: any) {
      console.error('Erro Mercado Pago:', err);
      setFeedback({
        type: 'error',
        message: err.message || 'Erro ao conectar ao Mercado Pago. Tente novamente.',
      });
    } finally {
      setLoadingMpCheckout(false);
    }
  };

  // Mercado Pago Instant PIX
  const handleGerarPixMercadoPago = async (plan: PlanOption) => {
    setLoadingPix(true);
    setFeedback(null);
    try {
      const res = await MercadoPagoService.criarPix({
        planId: plan.id,
        planName: plan.name,
        price: plan.price,
        userEmail: userEmail || auth.currentUser?.email || undefined,
        userName: userName || auth.currentUser?.displayName || undefined,
      });

      if (res.fallbackToCheckout) {
        await handleMercadoPagoCheckout(plan);
        return;
      }

      setMpPixData(res);
      if (res.id) {
        setMpPaymentId(res.id);
      }
    } catch (err: any) {
      console.error('Erro ao gerar PIX direto:', err);
      // Fallback directly to Checkout Pro
      await handleMercadoPagoCheckout(plan);
    } finally {
      setLoadingPix(false);
    }
  };

  // Card Formatters
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

  const handleCopyPix = (customCode?: string) => {
    const planKey = (selectedPlanForMigration?.id || activePlanId) as 'mensal' | 'trimestral' | 'semestral' | 'anual';
    const targetCode = customCode || PLAN_PIX_KEYS[planKey]?.code || PLAN_PIX_KEYS.anual.code;
    navigator.clipboard.writeText(targetCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  const handleInitiatePlanChange = (plan: PlanOption) => {
    if (plan.id === activePlanId) return;
    setSelectedPlanForMigration(plan);
    setScreen('payment');
  };

  const handleVerificarStatusManual = async (showWarning = true) => {
    if (!selectedPlanForMigration) return;
    setCheckingStatus(true);
    setFeedback(null);

    try {
      const res = await MercadoPagoService.verificarStatus({
        planId: selectedPlanForMigration.id,
        paymentId: mpPaymentId,
        userEmail: userEmail || auth.currentUser?.email || undefined,
        price: selectedPlanForMigration.price,
      });

      if (res.approved && res.status === 'approved') {
        setActivePlanId(selectedPlanForMigration.id);
        if (auth.currentUser) {
          try {
            await updateDoc(doc(db, 'users', auth.currentUser.uid), {
              activePlanId: selectedPlanForMigration.id,
              planUpdatedAt: new Date().toISOString(),
              paymentProvider: 'mercadopago',
              paymentStatus: 'approved',
              paymentId: res.paymentId || 'mp_verified',
            });
          } catch (e) {
            console.error('Error saving active plan to user:', e);
          }
        }
        try {
          localStorage.setItem('vestibularpro_active_plan', selectedPlanForMigration.id);
        } catch (_) {}

        setMpSuccessMessage(
          `Pagamento de R$ ${selectedPlanForMigration.price.toFixed(2).replace('.', ',')} identificado e aprovado! Seu Plano ${selectedPlanForMigration.name} foi liberado com sucesso.`
        );
        setScreen('success');
        return true;
      } else {
        if (showWarning) {
          setFeedback({
            type: 'warning',
            message: 'Nenhum pagamento correspondente identificado no Mercado Pago ainda. Conclua o PIX no aplicativo do seu banco ou pague via Mercado Pago para que a liberação ocorra.',
          });
        }
        return false;
      }
    } catch (err: any) {
      if (showWarning) {
        setFeedback({
          type: 'error',
          message: 'Erro ao consultar Mercado Pago. Verifique sua conexão e tente novamente.',
        });
      }
      return false;
    } finally {
      setCheckingStatus(false);
    }
  };

  const calculateNextBillingDate = (planId: string) => {
    const date = new Date();
    if (planId === 'mensal') date.setMonth(date.getMonth() + 1);
    if (planId === 'trimestral') date.setMonth(date.getMonth() + 3);
    if (planId === 'semestral') date.setMonth(date.getMonth() + 6);
    if (planId === 'anual') date.setFullYear(date.getFullYear() + 1);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const formatPrice = (price: number) => {
    const parts = price.toFixed(2).split('.');
    return { main: parts[0], cents: parts[1] };
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex items-center justify-center p-3 sm:p-6 lg:p-8 font-sans transition-colors duration-200 relative">
      
      {/* Glow aura background accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mt-20" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -mb-20" />

      {/* MAIN CONTAINER */}
      <motion.div 
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-5xl rounded-3xl border border-[var(--border-light)] bg-[var(--bg-card)] shadow-2xl overflow-hidden transition-all relative z-10"
      >
        
        {/* HEADER SECTION */}
        <div className="px-6 py-7 sm:px-10 sm:py-8 border-b border-[var(--border-light)] bg-gradient-to-r from-blue-950/20 via-transparent to-transparent">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/25 rounded-full text-xs font-semibold text-amber-400">
                <Crown size={14} className="text-amber-400" />
                <span>Gestão de Assinatura & Acesso Premium</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
                Planos & Assinatura
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-xl">
                Acesso completo a mais de 18 anos de simulados com cronômetro oficial, gabaritos comentados e correção de redação com IA.
              </p>
            </div>

            {userName && (
              <div className="self-start sm:self-auto px-4 py-2.5 bg-[var(--bg-hover)] border border-[var(--border-light)] rounded-2xl shadow-xs flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm shadow-blue-500/30">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="text-xs">
                  <div className="text-[var(--text-muted)] text-[10px]">Estudante Gabarita</div>
                  <div className="font-bold text-[var(--text-main)]">{userName}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* OVERVIEW SCREEN */}
        {screen === 'overview' && (
          <div className="p-6 sm:p-10 space-y-10">

            {/* SEU PLANO ATUAL CARD */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} className="text-emerald-400" />
                  <h2 className="text-lg font-bold text-[var(--text-main)]">
                    Seu Plano Atual
                  </h2>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Assinatura Ativa
                </span>
              </div>

              {/* ACTIVE PLAN HIGHLIGHT BOX */}
              <div className="rounded-2xl border border-blue-500/40 bg-gradient-to-br from-blue-950/30 via-[#101524] to-[#0d111d] p-6 sm:p-8 shadow-xl transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

                {/* Header of Active Plan */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-light)]">
                  <div className="flex items-center gap-4">
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
                      <Crown size={26} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-xl font-extrabold text-white">
                          Plano {activePlanObj.name}
                        </h3>
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          ATIVO
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">
                        {activePlanObj.cycleLabel}
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <div className="text-2xl sm:text-3xl font-black text-white">
                      R$&nbsp;{activePlanObj.price.toFixed(2).replace('.', ',')}
                    </div>
                    <div className="text-xs text-[var(--text-muted)] font-medium">
                      {activePlanObj.periodLabel}
                    </div>
                  </div>
                </div>

                {/* Status & Billing Mini Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-6">
                  
                  {/* Renewal Date */}
                  <div className="p-4 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] shadow-xs transition-all hover:border-blue-500/30">
                    <div className="text-[11px] font-medium text-[var(--text-muted)] flex items-center gap-1.5 mb-1.5">
                      <Calendar size={14} className="text-blue-400" />
                      <span>Próxima renovação</span>
                    </div>
                    <div className="text-sm font-bold text-white">
                      {calculateNextBillingDate(activePlanObj.id)}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="p-4 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] shadow-xs transition-all hover:border-blue-500/30">
                    <div className="text-[11px] font-medium text-[var(--text-muted)] flex items-center gap-1.5 mb-1.5">
                      <CreditCard size={14} className="text-blue-400" />
                      <span>Forma de pagamento</span>
                    </div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Cartão •••• 4242</span>
                      <span className="text-[10px] bg-blue-500/15 border border-blue-500/30 text-blue-400 font-bold px-2 py-0.5 rounded-md">
                        Principal
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="p-4 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] shadow-xs transition-all hover:border-blue-500/30">
                    <div className="text-[11px] font-medium text-[var(--text-muted)] flex items-center gap-1.5 mb-1.5">
                      <RefreshCw size={14} className="text-blue-400" />
                      <span>Status da renovação</span>
                    </div>
                    <div className="text-sm font-bold text-emerald-400">
                      Renovação Automática
                    </div>
                  </div>

                </div>

                {/* Features Included List */}
                <div className="space-y-3 mb-6">
                  <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    Benefícios ativos neste plano:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activePlanObj.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                          feat.enabled 
                            ? 'bg-emerald-500/15 text-emerald-400' 
                            : 'bg-slate-800 text-slate-600'
                        }`}>
                          <Check size={11} strokeWidth={3} />
                        </div>
                        <span className={feat.enabled ? 'font-medium text-slate-200' : 'text-slate-500 line-through'}>
                          {feat.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-[var(--border-light)]">
                  <button
                    type="button"
                    onClick={() => {
                      const nextPlan = PLANS.find(p => p.id !== activePlanId) || PLANS[3];
                      handleInitiatePlanChange(nextPlan);
                    }}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-500/25 flex items-center gap-2 text-xs cursor-pointer active:scale-95"
                  >
                    <Sparkles size={15} />
                    <span>Alterar ou fazer upgrade</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCancelModal(true)}
                    className="text-xs text-[var(--text-muted)] hover:text-rose-400 font-medium transition-colors cursor-pointer"
                  >
                    Cancelar assinatura
                  </button>
                </div>

              </div>
            </div>

            {/* SELEÇÃO DE NOVOS PLANOS */}
            <div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={20} className="text-blue-400" />
                  <h2 className="text-xl font-bold text-[var(--text-main)]">
                    Opções de Mudança de Plano
                  </h2>
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  Escolha o melhor plano para seu ritmo de estudos. Ao fazer upgrade, a alteração é imediata.
                </p>
              </div>

              {/* 4 Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {PLANS.map((plan) => {
                  const isActive = plan.id === activePlanId;
                  const isUpgrade = plan.price > activePlanObj.price;
                  const isTopPick = plan.id === 'anual' || plan.popular;
                  const { main, cents } = formatPrice(plan.price);

                  return (
                    <div
                      key={plan.id}
                      className={`
                        relative p-5 sm:p-6 rounded-2xl border-2 transition-all flex flex-col justify-between
                        ${isActive 
                          ? 'border-emerald-500/80 bg-emerald-950/15 shadow-md shadow-emerald-500/10' 
                          : isTopPick
                          ? 'border-blue-500/60 bg-gradient-to-b from-[#131929] to-[#0f1422] shadow-lg shadow-blue-500/10 hover:border-blue-500' 
                          : 'border-[var(--border-light)] bg-[var(--bg-hover)] hover:border-slate-500/40 shadow-sm'
                        }
                      `}
                    >
                      {/* Top Badges */}
                      {isActive && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white font-bold text-[10px] px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                          <CheckCircle size={11} />
                          <span>PLANO ATUAL</span>
                        </div>
                      )}

                      {!isActive && plan.savings && (
                        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 font-bold text-[10px] px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1 ${
                          plan.id === 'anual' ? 'bg-amber-500 text-slate-950' : 'bg-blue-600 text-white'
                        }`}>
                          <Zap size={11} />
                          <span>{plan.savings}</span>
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-emerald-400' : isTopPick ? 'text-blue-400' : 'text-[var(--text-muted)]'}`}>
                            {plan.name}
                          </span>
                        </div>

                        <div className="flex items-baseline gap-0.5 mb-1">
                          <span className="text-sm font-bold text-[var(--text-muted)]">R$&nbsp;</span>
                          <span className="text-3xl font-extrabold tracking-tight text-white">{main}</span>
                          <span className="text-sm font-semibold text-[var(--text-muted)]">,{cents}</span>
                        </div>

                        <div className="text-xs text-[var(--text-muted)] mb-4">
                          {plan.periodLabel}
                        </div>

                        {/* Features checklist */}
                        <ul className="space-y-2 mb-6 border-t border-[var(--border-light)] pt-4">
                          {plan.features.map((f, i) => (
                            <li key={i} className={`text-[11px] flex items-start gap-2 ${f.enabled ? 'text-slate-200' : 'text-slate-500 line-through'}`}>
                              <Check size={12} className={`shrink-0 mt-0.5 ${f.enabled ? 'text-emerald-400' : 'text-slate-600'}`} />
                              <span>{f.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Button */}
                      <div className="space-y-2 pt-2">
                        {isActive ? (
                          <div className="w-full py-2.5 px-3 bg-emerald-500/15 text-emerald-400 rounded-xl text-xs font-bold text-center border border-emerald-500/30">
                            ✓ Seu plano ativo
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleInitiatePlanChange(plan)}
                              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98] ${
                                isTopPick 
                                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20' 
                                  : 'bg-[var(--bg-card)] hover:bg-white/10 text-white border border-[var(--border-light)]'
                              }`}
                            >
                              <span>{isUpgrade ? 'Fazer Upgrade' : 'Mudar para este'}</span>
                              <ChevronRight size={14} />
                            </button>

                            <button
                              type="button"
                              disabled={loadingMpCheckout}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMercadoPagoCheckout(plan);
                              }}
                              className="w-full py-1.5 px-2.5 rounded-lg text-[10px] font-bold bg-[#009EE3]/15 hover:bg-[#009EE3]/25 text-[#38bdf8] border border-[#009EE3]/30 transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 disabled:opacity-50"
                            >
                              <ExternalLink size={11} />
                              <span>Pagar com Mercado Pago</span>
                            </button>
                          </>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* INFO CALLOUT BANNER */}
            <div className="p-4 sm:p-5 bg-blue-950/20 rounded-2xl border border-blue-500/30 flex items-start gap-3.5">
              <Info size={20} className="text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-200 leading-relaxed">
                <strong className="font-bold text-white">Como funciona a migração de plano? </strong>
                Ao alterar sua assinatura para um plano de maior periodicidade (Semestral ou Anual), a ativação de todos os novos recursos ocorre imediatamente. Qualquer valor não utilizado do período anterior é recalculado automaticamente em créditos de estudo.
              </div>
            </div>

          </div>
        )}

        {/* PAYMENT SCREEN */}
        {screen === 'payment' && selectedPlanForMigration && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 sm:p-10 space-y-6 max-w-2xl mx-auto"
          >
            {/* BACK BUTTON & TITLE */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-light)]">
              <button
                type="button"
                onClick={() => setScreen('overview')}
                className="text-xs text-[var(--text-muted)] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Voltar aos planos</span>
              </button>
              <div className="text-xs font-semibold text-blue-400 flex items-center gap-1">
                <ShieldCheck size={14} />
                <span>Ambiente Seguro SSL</span>
              </div>
            </div>

            {/* PLAN RESUMO TICKET */}
            <div className="p-5 bg-[var(--bg-hover)] rounded-2xl border border-[var(--border-light)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/20 shrink-0">
                  <Sparkles size={20} />
                </div>
                <div>
                  <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-bold">Novo Plano Selecionado</div>
                  <div className="text-lg font-bold text-white">Plano {selectedPlanForMigration.name}</div>
                  <div className="text-xs text-[var(--text-muted)]">{selectedPlanForMigration.cycleLabel}</div>
                </div>
              </div>
              <div className="sm:text-right">
                <div className="text-2xl font-black text-white">
                  R$&nbsp;{selectedPlanForMigration.price.toFixed(2).replace('.', ',')}
                </div>
                <div className="text-xs text-[var(--text-muted)]">{selectedPlanForMigration.periodLabel}</div>
              </div>
            </div>

            {/* FEEDBACK ALERT */}
            {feedback && (
              <div className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
                feedback.type === 'error' ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300' :
                feedback.type === 'warning' ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300' :
                'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
              }`}>
                <AlertCircle size={15} className="shrink-0" />
                <span>{feedback.message}</span>
              </div>
            )}

            {/* MERCADO PAGO QUICK CHECKOUT BANNER */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#009EE3]/15 via-blue-500/10 to-indigo-500/10 border border-[#009EE3]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#009EE3] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-[#009EE3]/25">
                  MP
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Checkout Oficial Mercado Pago</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-[#009EE3] text-white">RECOMENDADO</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Cartão em até 12x, Débito imediato, PIX Instantâneo ou Boleto Bancário.
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={loadingMpCheckout}
                onClick={() => handleMercadoPagoCheckout(selectedPlanForMigration)}
                className="px-4 py-2.5 bg-[#009EE3] hover:bg-[#0089c7] text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-[#009EE3]/25 active:scale-95 cursor-pointer shrink-0 disabled:opacity-50"
              >
                {loadingMpCheckout ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <>
                    <ExternalLink size={14} />
                    <span>Pagar no Mercado Pago</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-[var(--border-light)]"></div>
              <span className="flex-shrink mx-3 text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                Ou selecione a forma abaixo
              </span>
              <div className="flex-grow border-t border-[var(--border-light)]"></div>
            </div>

            {/* PAYMENT METHOD SELECTOR */}
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('cartao')}
                className={`p-3.5 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'cartao'
                    ? 'border-blue-500 bg-blue-950/30 text-blue-400 font-bold shadow-md shadow-blue-500/10'
                    : 'border-[var(--border-light)] text-[var(--text-muted)] hover:border-slate-500/40'
                }`}
              >
                <CreditCard size={22} />
                <span className="text-xs text-center leading-tight">Crédito ou Débito</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`p-3.5 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'pix'
                    ? 'border-blue-500 bg-blue-950/30 text-blue-400 font-bold shadow-md shadow-blue-500/10'
                    : 'border-[var(--border-light)] text-[var(--text-muted)] hover:border-slate-500/40'
                }`}
              >
                <QrCode size={22} />
                <span className="text-xs text-center leading-tight">PIX Instantâneo</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('boleto')}
                className={`p-3.5 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'boleto'
                    ? 'border-blue-500 bg-blue-950/30 text-blue-400 font-bold shadow-md shadow-blue-500/10'
                    : 'border-[var(--border-light)] text-[var(--text-muted)] hover:border-slate-500/40'
                }`}
              >
                <FileText size={22} />
                <span className="text-xs text-center leading-tight">Boleto Bancário</span>
              </button>
            </div>

            {/* FORM CARTAO */}
            {paymentMethod === 'cartao' && (
              <div className="space-y-3.5 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Número do cartão</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--border-light)] rounded-xl text-sm text-[var(--text-main)] outline-none focus:border-blue-500 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Nome impresso no cartão</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Como aparece no cartão"
                    className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--border-light)] rounded-xl text-sm text-[var(--text-main)] outline-none focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Validade</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => handleExpiryChange(e.target.value)}
                      placeholder="MM/AA"
                      maxLength={5}
                      className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--border-light)] rounded-xl text-sm text-[var(--text-main)] outline-none focus:border-blue-500 transition-all font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">CVV</label>
                    <input
                      type="text"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      placeholder="123"
                      maxLength={4}
                      className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--border-light)] rounded-xl text-sm text-[var(--text-main)] outline-none focus:border-blue-500 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-950/20 border border-blue-500/25 text-[11px] text-blue-300">
                  <CreditCard size={15} className="shrink-0 text-blue-400" />
                  <span>Aceita <strong>Cartão de Crédito</strong> (em até 12x) e <strong>Cartão de Débito</strong> (Visa, Mastercard, Elo) com ativação imediata.</span>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    disabled={loadingMpCheckout}
                    onClick={() => handleMercadoPagoCheckout(selectedPlanForMigration)}
                    className="w-full py-3 bg-[#009EE3] hover:bg-[#0089c7] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-[#009EE3]/20 active:scale-[0.99] cursor-pointer mb-2"
                  >
                    {loadingMpCheckout ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <ExternalLink size={15} />
                        <span>Pagar com Cartão (Crédito ou Débito) no Mercado Pago</span>
                      </>
                    )}
                  </button>

                  {mpCheckoutUrl && (
                    <div className="mt-3 p-3.5 bg-[#009EE3]/10 border border-[#009EE3]/30 rounded-xl text-center space-y-2">
                      <p className="text-xs text-[var(--text-main)] font-medium">
                        Link de checkout gerado com sucesso!
                      </p>
                      <a
                        href={mpCheckoutUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#009EE3] hover:bg-[#0089c7] text-white text-xs font-bold rounded-xl shadow-md transition-all"
                      >
                        <ExternalLink size={14} />
                        <span>Abrir Checkout Oficial do Mercado Pago</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* FORM PIX */}
            {paymentMethod === 'pix' && (() => {
              const currentTargetPlan = selectedPlanForMigration || activePlanObj;
              const targetKey = (currentTargetPlan.id || 'anual') as 'mensal' | 'trimestral' | 'semestral' | 'anual';
              const currentPix = PLAN_PIX_KEYS[targetKey] || PLAN_PIX_KEYS.anual;
              const qrImageUrl = mpPixData?.qr_code_base64
                ? `data:image/png;base64,${mpPixData.qr_code_base64}`
                : `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=8&data=${encodeURIComponent(currentPix.code)}`;
              const activePixCode = mpPixData?.qr_code || currentPix.code;

              return (
                <div className="p-6 space-y-5 bg-[var(--bg-hover)] rounded-2xl border border-[var(--border-light)] text-left">
                  {/* Plan & Beneficiary Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-light)]">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>PIX Oficial Mercado Pago · {currentPix.formattedPrice}</span>
                      </div>
                      <h4 className="text-base font-bold text-white mt-1">
                        Plano {currentTargetPlan.name}
                      </h4>
                    </div>

                    <div className="text-xs text-[var(--text-muted)] sm:text-right space-y-0.5">
                      <div>Beneficiário: <strong className="text-white">{currentPix.beneficiary}</strong></div>
                      <div>Cidade: <strong className="text-white">{currentPix.city}</strong></div>
                    </div>
                  </div>

                  {/* QR Code Container */}
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-48 h-48 sm:w-52 sm:h-52 bg-white p-3 rounded-2xl border-2 border-emerald-500/40 shadow-xl flex items-center justify-center shrink-0">
                      <img
                        src={qrImageUrl}
                        alt="QR Code PIX Mercado Pago"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="space-y-3 flex-1 text-center sm:text-left">
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
                          <CheckCircle2 size={15} className="text-emerald-400" />
                          <span>Como pagar:</span>
                        </div>
                        <ol className="text-xs text-[var(--text-muted)] space-y-1 list-decimal list-inside leading-relaxed">
                          <li>Abra o aplicativo do seu banco (qualquer banco com PIX)</li>
                          <li>Escolha <strong>Pagar com QR Code</strong> ou <strong>PIX Copia e Cola</strong></li>
                          <li>Confirme o valor de <strong>{currentPix.formattedPrice}</strong> para <strong>{currentPix.beneficiary}</strong></li>
                        </ol>
                      </div>

                      {/* Copia e Cola Input */}
                      <div className="space-y-1.5 pt-1">
                        <label className="text-[11px] font-semibold text-[var(--text-muted)]">
                          Código PIX Copia e Cola:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={activePixCode}
                            className="w-full px-3 py-2 bg-[var(--bg-main)] border border-[var(--border-light)] rounded-xl text-xs font-mono text-slate-300 select-all outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleCopyPix(activePixCode)}
                            className="px-4 py-2 bg-[#009EE3] hover:bg-[#0089c7] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
                          >
                            <Copy size={13} />
                            <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Real-time Status & Payment Check */}
                  <div className="pt-3 border-t border-[var(--border-light)] flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                      <div className="relative flex items-center justify-center shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute opacity-75" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      </div>
                      <span>Aguardando transferência de <strong className="text-white">{currentPix.formattedPrice}</strong> no seu banco</span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        disabled={checkingStatus}
                        onClick={() => handleVerificarStatusManual(true)}
                        className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw size={13} className={checkingStatus ? "animate-spin" : ""} />
                        <span>{checkingStatus ? 'Consultando Mercado Pago...' : 'Checar pagamento agora'}</span>
                      </button>

                      <button
                        type="button"
                        disabled={loadingMpCheckout}
                        onClick={() => handleMercadoPagoCheckout(currentTargetPlan)}
                        className="w-full sm:w-auto px-3.5 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[var(--border-light)]"
                      >
                        <ExternalLink size={13} />
                        <span>Pagar no Cartão</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* FORM BOLETO */}
            {paymentMethod === 'boleto' && (
              <div className="text-center p-6 space-y-4 bg-[var(--bg-hover)] rounded-2xl border border-[var(--border-light)]">
                <FileText size={44} className="mx-auto text-[var(--text-muted)]" />
                <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-sm mx-auto">
                  Para pagar via boleto com segurança e registro bancário imediato, utilize o Checkout Oficial do Mercado Pago.
                </p>
                <button
                  type="button"
                  disabled={loadingMpCheckout}
                  onClick={() => handleMercadoPagoCheckout(selectedPlanForMigration)}
                  className="py-2.5 px-5 bg-[#009EE3] hover:bg-[#0089c7] text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-2 cursor-pointer shadow-md shadow-[#009EE3]/20"
                >
                  {loadingMpCheckout ? <Loader2 size={15} className="animate-spin" /> : <ExternalLink size={14} />}
                  <span>Gerar Boleto no Mercado Pago</span>
                </button>
              </div>
            )}

            {/* LIVE DETECTION BANNER */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-[#101524] border border-blue-500/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center shrink-0">
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping absolute opacity-75" />
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>Liberação automática pós-pagamento</span>
                    <Loader2 size={12} className="animate-spin text-blue-400" />
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    O plano é ativado automaticamente assim que o pagamento for registrado pelo Mercado Pago.
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={checkingStatus}
                onClick={() => handleVerificarStatusManual(true)}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 active:scale-95 cursor-pointer shrink-0 disabled:opacity-50"
              >
                <RefreshCw size={14} className={checkingStatus ? "animate-spin" : ""} />
                <span>{checkingStatus ? 'Verificando no Mercado Pago...' : 'Verificar confirmação agora'}</span>
              </button>
            </div>

            {/* SECURITY ASSURANCE */}
            <div className="flex items-center justify-center gap-3 text-[11px] text-[var(--text-muted)] pt-1">
              <div className="flex items-center gap-1">
                <Lock size={12} className="text-emerald-400" />
                <span>Criptografia 256-bit</span>
              </div>
              <span>•</span>
              <span>Processamento Mercado Pago</span>
              <span>•</span>
              <span>Garantia de 7 dias</span>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setScreen('overview')}
                className="text-xs text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <ArrowLeft size={13} />
                <span>Voltar para meus planos</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* SUCCESS SCREEN */}
        {screen === 'success' && selectedPlanForMigration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 sm:p-14 text-center space-y-6 max-w-lg mx-auto"
          >
            <div className="w-20 h-20 mx-auto bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/10">
              <CheckCircle size={44} />
            </div>

            <div>
              <h2 className="text-2xl font-black text-white mb-1">
                Plano atualizado com sucesso!
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                {mpSuccessMessage || (
                  <>Sua migração para o <span className="font-bold text-white">Plano {selectedPlanForMigration.name}</span> foi concluída.</>
                )}
              </p>
              {mpSuccessMessage && (
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-semibold">
                  <CheckCircle2 size={14} />
                  <span>Transação autenticada via Mercado Pago</span>
                </div>
              )}
            </div>

            <div className="p-5 bg-[var(--bg-hover)] rounded-2xl border border-[var(--border-light)] text-xs space-y-2.5 text-left">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Novo Plano</span>
                <span className="font-bold text-white">Plano {selectedPlanForMigration.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Valor</span>
                <span className="font-bold text-white">R$&nbsp;{selectedPlanForMigration.price.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Próxima renovação</span>
                <span className="font-bold text-white">{calculateNextBillingDate(selectedPlanForMigration.id)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setScreen('overview');
                if (onComplete) onComplete();
              }}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20 active:scale-[0.99] cursor-pointer"
            >
              <span>Acessar Recursos da Plataforma</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>
        )}

      </motion.div>

      {/* CANCEL SUBSCRIPTION MODAL */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#121620] rounded-2xl p-6 sm:p-8 max-w-md w-full border border-[var(--border-light)] shadow-2xl space-y-4 text-left"
            >
              {!cancelSuccess ? (
                <>
                  <div className="w-12 h-12 bg-rose-500/15 border border-rose-500/30 rounded-2xl flex items-center justify-center text-rose-400">
                    <AlertCircle size={28} />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Cancelar Assinatura?
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
                      Seu plano atual continuará ativo até <span className="font-semibold text-white">{calculateNextBillingDate(activePlanObj.id)}</span>. Após essa data, seu acesso aos simulados e gabaritos comentados será limitado.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setCancelSuccess(true)}
                      className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Confirmar Cancelamento
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCancelModal(false)}
                      className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer border border-[var(--border-light)]"
                    >
                      Manter minha assinatura
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4 space-y-4">
                  <div className="w-12 h-12 mx-auto bg-amber-500/15 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-400">
                    <CheckCircle size={28} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Solicitação registrada
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                      A renovação automática foi desativada. Você ainda pode aproveitar todos os benefícios até o fim do período já pago.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCancelModal(false);
                      setCancelSuccess(false);
                    }}
                    className="w-full py-3 bg-white text-slate-900 rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-100"
                  >
                    Entendido
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default PlanSelection;
