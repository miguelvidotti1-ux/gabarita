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
  Zap
} from 'lucide-react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

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
  const [cardName, setCardName] = useState(userName || 'ESTUDANTE VESTHUB');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');

  // UI States
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'warning' | 'success'; message: string } | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

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

  const handleCopyPix = () => {
    const pixCode = "00020126580014BR.GOV.BCB.PIX0136a6295348-2f8c-4f4e-9d5a-3b8e1c7f4d2a5204000053039865802BR5913VESTHUB6009SAOPAULO62070503***6304A2B3";
    navigator.clipboard.writeText(pixCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  const handleInitiatePlanChange = (plan: PlanOption) => {
    if (plan.id === activePlanId) return;
    setSelectedPlanForMigration(plan);
    setScreen('payment');
  };

  const handleConfirmPlanChange = async () => {
    if (!selectedPlanForMigration) return;
    setFeedback(null);

    if (paymentMethod === 'cartao') {
      const cleanNum = cardNumber.replace(/\s/g, '');
      if (cleanNum.length < 13) {
        setFeedback({ type: 'error', message: 'Número do cartão inválido.' });
        return;
      }
      if (!cardName.trim()) {
        setFeedback({ type: 'error', message: 'Digite o nome impresso no cartão.' });
        return;
      }
      if (cardExpiry.length < 5) {
        setFeedback({ type: 'error', message: 'Data de validade inválida (MM/AA).' });
        return;
      }
      if (cardCvv.length < 3) {
        setFeedback({ type: 'error', message: 'CVV inválido.' });
        return;
      }
    }

    setLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 1400));

      // Save active plan to Firestore if logged in
      if (auth.currentUser) {
        try {
          await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            activePlanId: selectedPlanForMigration.id,
            planUpdatedAt: new Date().toISOString()
          });
        } catch (_) {}
      }

      setActivePlanId(selectedPlanForMigration.id);
      setScreen('success');
    } catch (err) {
      setFeedback({ type: 'error', message: 'Erro ao migrar o plano. Tente novamente.' });
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0C0E] text-slate-900 dark:text-zinc-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans transition-colors duration-200 relative">
      {/* MAIN CONTAINER */}
      <motion.div 
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-5xl bg-white dark:bg-[#15171C] rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-xl overflow-hidden transition-colors"
      >
        
        {/* HEADER SECTION */}
        <div className="px-6 py-8 sm:px-10 sm:py-9 border-b border-slate-100 dark:border-white/10 bg-slate-50/60 dark:bg-white/[0.02]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-full text-xs font-semibold text-amber-700 dark:text-amber-400">
                <Crown size={14} className="text-amber-600 dark:text-amber-400" />
                <span>Gestão de Assinatura</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Planos & Assinatura
              </h1>
              <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-xl">
                Visualize seu plano ativo, acompanhe renovações ou escolha uma nova opção de estudos.
              </p>
            </div>

            {userName && (
              <div className="self-start sm:self-auto px-4 py-2.5 bg-white dark:bg-[#1F222A] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xs flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="text-xs">
                  <div className="text-slate-400 dark:text-zinc-400 text-[10px]">Usuário logado</div>
                  <div className="font-bold text-slate-800 dark:text-white">{userName}</div>
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
                  <ShieldCheck size={20} className="text-emerald-600 dark:text-emerald-400" />
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Seu Plano Atual
                  </h2>
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">
                  Assinatura Ativa
                </span>
              </div>

              {/* ACTIVE PLAN HIGHLIGHT BOX */}
              <div className="rounded-2xl border-2 border-blue-500/30 dark:border-blue-500/40 bg-gradient-to-br from-blue-50/40 via-white to-slate-50/60 dark:from-blue-950/20 dark:via-[#181A20] dark:to-[#181A20] p-6 sm:p-8 shadow-sm transition-colors">
                
                {/* Header of Active Plan */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-13 h-13 rounded-2xl bg-blue-600 dark:bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                      <Crown size={26} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                          Plano {activePlanObj.name}
                        </h3>
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
                          ATIVO
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                        {activePlanObj.cycleLabel}
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      R$&nbsp;{activePlanObj.price.toFixed(2).replace('.', ',')}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                      {activePlanObj.periodLabel}
                    </div>
                  </div>
                </div>

                {/* Status & Billing Mini Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-6">
                  
                  {/* Renewal Date */}
                  <div className="p-4 bg-white dark:bg-[#1E2128] rounded-xl border border-slate-200/80 dark:border-white/10 shadow-xs">
                    <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium flex items-center gap-1.5 mb-1.5">
                      <Calendar size={14} className="text-blue-600 dark:text-blue-400" />
                      <span>Próxima renovação</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {calculateNextBillingDate(activePlanObj.id)}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="p-4 bg-white dark:bg-[#1E2128] rounded-xl border border-slate-200/80 dark:border-white/10 shadow-xs">
                    <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium flex items-center gap-1.5 mb-1.5">
                      <CreditCard size={14} className="text-blue-600 dark:text-blue-400" />
                      <span>Forma de pagamento</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Cartão •••• 4242</span>
                      <span className="text-[10px] bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-zinc-300 font-bold px-2 py-0.5 rounded-md">
                        Principal
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="p-4 bg-white dark:bg-[#1E2128] rounded-xl border border-slate-200/80 dark:border-white/10 shadow-xs">
                    <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium flex items-center gap-1.5 mb-1.5">
                      <RefreshCw size={14} className="text-blue-600 dark:text-blue-400" />
                      <span>Status da renovação</span>
                    </div>
                    <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      Renovação Automática
                    </div>
                  </div>

                </div>

                {/* Features Included List */}
                <div className="space-y-3 mb-6">
                  <div className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                    Benefícios ativos neste plano:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activePlanObj.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                          feat.enabled 
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' 
                            : 'bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-zinc-600'
                        }`}>
                          <Check size={11} strokeWidth={3} />
                        </div>
                        <span className={feat.enabled ? 'font-medium text-slate-800 dark:text-zinc-200' : 'text-slate-400 dark:text-zinc-500 line-through'}>
                          {feat.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-slate-200/80 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      const nextPlan = PLANS.find(p => p.id !== activePlanId) || PLANS[3];
                      handleInitiatePlanChange(nextPlan);
                    }}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 text-xs cursor-pointer active:scale-95"
                  >
                    <Sparkles size={15} />
                    <span>Alterar ou fazer upgrade</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCancelModal(true)}
                    className="text-xs text-slate-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 font-medium transition-colors cursor-pointer"
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
                  <TrendingUp size={20} className="text-blue-600 dark:text-blue-400" />
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Opções de Mudança de Plano
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Escolha o melhor plano para seu ritmo de estudos. Ao fazer upgrade, a alteração é imediata.
                </p>
              </div>

              {/* 4 Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {PLANS.map((plan) => {
                  const isActive = plan.id === activePlanId;
                  const isUpgrade = plan.price > activePlanObj.price;
                  const { main, cents } = formatPrice(plan.price);

                  return (
                    <div
                      key={plan.id}
                      className={`
                        relative p-5 sm:p-6 rounded-2xl border-2 transition-all flex flex-col justify-between
                        ${isActive 
                          ? 'bg-emerald-500/[0.03] dark:bg-emerald-500/[0.05] border-emerald-500 dark:border-emerald-500 shadow-sm' 
                          : plan.popular 
                          ? 'bg-white dark:bg-[#1B1D24] border-blue-500/60 dark:border-blue-500/50 shadow-md' 
                          : 'bg-white dark:bg-[#181A20] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
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

                      {!isActive && isUpgrade && plan.savings && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-bold text-[10px] px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                          <Zap size={11} />
                          <span>{plan.savings}</span>
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-zinc-400'}`}>
                            {plan.name}
                          </span>
                        </div>

                        <div className="flex items-baseline gap-0.5 mb-1">
                          <span className="text-sm font-bold text-slate-500 dark:text-zinc-400">R$&nbsp;</span>
                          <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{main}</span>
                          <span className="text-sm font-semibold text-slate-400 dark:text-zinc-400">,{cents}</span>
                        </div>

                        <div className="text-xs text-slate-500 dark:text-zinc-400 mb-4">
                          {plan.periodLabel}
                        </div>

                        {/* Features checklist */}
                        <ul className="space-y-2 mb-6 border-t border-slate-100 dark:border-white/10 pt-4">
                          {plan.features.map((f, i) => (
                            <li key={i} className={`text-[11px] flex items-start gap-2 ${f.enabled ? 'text-slate-700 dark:text-zinc-300' : 'text-slate-400 dark:text-zinc-600 line-through'}`}>
                              <Check size={12} className={`shrink-0 mt-0.5 ${f.enabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-300 dark:text-zinc-700'}`} />
                              <span>{f.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Button */}
                      <div>
                        {isActive ? (
                          <div className="w-full py-2.5 px-3 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-bold text-center border border-emerald-500/20">
                            ✓ Seu plano ativo
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleInitiatePlanChange(plan)}
                            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98] ${
                              isUpgrade 
                                ? 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-blue-600 dark:hover:bg-blue-500' 
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-white/10 dark:hover:bg-white/15 dark:text-zinc-200'
                            }`}
                          >
                            <span>{isUpgrade ? 'Fazer Upgrade' : 'Mudar para este'}</span>
                            <ChevronRight size={14} />
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* INFO CALLOUT BANNER */}
            <div className="p-4 sm:p-5 bg-blue-50/70 dark:bg-blue-950/30 rounded-2xl border border-blue-200/80 dark:border-blue-500/20 flex items-start gap-3.5">
              <Info size={20} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-950 dark:text-blue-200 leading-relaxed">
                <strong className="font-bold">Como funciona a migração de plano? </strong>
                Ao solicitar um upgrade ou mudança, o acesso é liberado instantaneamente. Qualquer valor restante do ciclo atual é convertido em crédito automático proporcional.
              </div>
            </div>

          </div>
        )}

        {/* PAYMENT / CONFIRMATION SCREEN */}
        {screen === 'payment' && selectedPlanForMigration && (
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            className="p-6 sm:p-10 max-w-xl mx-auto space-y-6"
          >
            {/* Header */}
            <div className="text-center">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Confirmação de Migração
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                Migrar para o Plano {selectedPlanForMigration.name}
              </h2>
            </div>

            {/* FEEDBACK BANNERS */}
            {feedback && (
              <div className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2.5 ${
                feedback.type === 'error'
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
              }`}>
                <AlertCircle size={16} className="shrink-0" />
                <span>{feedback.message}</span>
              </div>
            )}

            {/* ORDER COMPARISON */}
            <div className="p-5 bg-slate-50 dark:bg-[#1A1D24] rounded-2xl border border-slate-200 dark:border-white/10 space-y-3 text-xs">
              <div className="flex justify-between text-slate-500 dark:text-zinc-400">
                <span>Plano Atual</span>
                <span className="font-semibold text-slate-800 dark:text-zinc-200">{activePlanObj.name} (R$ {activePlanObj.price.toFixed(2).replace('.', ',')})</span>
              </div>
              <div className="flex justify-between text-blue-600 dark:text-blue-400 font-medium">
                <span>Novo Plano Selecionado</span>
                <span className="font-bold">{selectedPlanForMigration.name} ({selectedPlanForMigration.periodLabel})</span>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Ajuste proporcional aplicado</span>
                <span>Desconto imediato na fatura</span>
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex justify-between font-bold text-base text-slate-900 dark:text-white">
                <span>Valor Final a Pagar</span>
                <span>R$&nbsp;{selectedPlanForMigration.price.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            {/* PAYMENT METHOD SELECTOR */}
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('cartao')}
                className={`p-3.5 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'cartao'
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 font-bold'
                    : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:border-slate-300'
                }`}
              >
                <CreditCard size={22} />
                <span className="text-xs">Cartão</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`p-3.5 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'pix'
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 font-bold'
                    : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:border-slate-300'
                }`}
              >
                <QrCode size={22} />
                <span className="text-xs">PIX</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('boleto')}
                className={`p-3.5 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'boleto'
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 font-bold'
                    : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:border-slate-300'
                }`}
              >
                <FileText size={22} />
                <span className="text-xs">Boleto</span>
              </button>
            </div>

            {/* FORM CARTAO */}
            {paymentMethod === 'cartao' && (
              <div className="space-y-3.5 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Número do cartão</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="w-full px-4 py-3 bg-white dark:bg-[#181A20] border border-slate-300 dark:border-white/15 rounded-xl text-sm text-slate-900 dark:text-zinc-100 outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Nome impresso no cartão</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Como aparece no cartão"
                    className="w-full px-4 py-3 bg-white dark:bg-[#181A20] border border-slate-300 dark:border-white/15 rounded-xl text-sm text-slate-900 dark:text-zinc-100 outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Validade</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => handleExpiryChange(e.target.value)}
                      placeholder="MM/AA"
                      maxLength={5}
                      className="w-full px-4 py-3 bg-white dark:bg-[#181A20] border border-slate-300 dark:border-white/15 rounded-xl text-sm text-slate-900 dark:text-zinc-100 outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">CVV</label>
                    <input
                      type="text"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      placeholder="123"
                      maxLength={4}
                      className="w-full px-4 py-3 bg-white dark:bg-[#181A20] border border-slate-300 dark:border-white/15 rounded-xl text-sm text-slate-900 dark:text-zinc-100 outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* FORM PIX */}
            {paymentMethod === 'pix' && (
              <div className="text-center p-6 space-y-4 bg-slate-50 dark:bg-[#181A20] rounded-2xl border border-slate-200 dark:border-white/10">
                <div className="w-40 h-40 mx-auto bg-white p-3 rounded-xl border border-slate-200 dark:border-zinc-700 flex items-center justify-center">
                  <QrCode size={120} className="text-slate-900" />
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400">
                  Escaneie o QR Code ou copie a chave PIX para confirmar a troca de plano:
                </p>
                <button
                  type="button"
                  onClick={handleCopyPix}
                  className="py-2.5 px-5 bg-white dark:bg-[#20232B] border border-slate-300 dark:border-white/15 rounded-xl text-xs font-semibold text-slate-800 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-white/10 transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <Copy size={14} />
                  <span>{copiedPix ? 'Código PIX copiado!' : 'Copiar código PIX'}</span>
                </button>
              </div>
            )}

            {/* FORM BOLETO */}
            {paymentMethod === 'boleto' && (
              <div className="text-center p-6 space-y-3 bg-slate-50 dark:bg-[#181A20] rounded-2xl border border-slate-200 dark:border-white/10">
                <FileText size={44} className="mx-auto text-slate-400 dark:text-zinc-500" />
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Ao selecionar boleto, o novo plano será ativado após a compensação bancária.
                </p>
              </div>
            )}

            {/* ACTION BUTTON */}
            <button
              type="button"
              disabled={loading}
              onClick={handleConfirmPlanChange}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Confirmar Mudança de Plano</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setScreen('overview')}
                className="text-xs text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1"
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
            <div className="w-20 h-20 mx-auto bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner">
              <CheckCircle size={44} />
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
                Plano atualizado com sucesso!
              </h2>
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                Sua migração para o <span className="font-bold text-slate-900 dark:text-white">Plano {selectedPlanForMigration.name}</span> foi concluída.
              </p>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-[#181A20] rounded-2xl border border-slate-200 dark:border-white/10 text-xs space-y-2.5 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-zinc-400">Novo Plano</span>
                <span className="font-bold text-slate-900 dark:text-white">Plano {selectedPlanForMigration.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-zinc-400">Valor</span>
                <span className="font-bold text-slate-900 dark:text-white">R$&nbsp;{selectedPlanForMigration.price.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-zinc-400">Próxima renovação</span>
                <span className="font-bold text-slate-900 dark:text-white">{calculateNextBillingDate(selectedPlanForMigration.id)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setScreen('overview');
                if (onComplete) onComplete();
              }}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20 active:scale-[0.99] cursor-pointer"
            >
              <span>Voltar ao Meu Painel</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>
        )}

      </motion.div>

      {/* CANCEL SUBSCRIPTION MODAL */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#1A1D24] rounded-2xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl space-y-4"
            >
              {!cancelSuccess ? (
                <>
                  <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950/60 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-400">
                    <AlertCircle size={28} />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Cancelar Assinatura?
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
                      Seu plano atual continuará ativo até <span className="font-semibold text-slate-800 dark:text-zinc-200">{calculateNextBillingDate(activePlanObj.id)}</span>. Após essa data, seu acesso aos simulados e gabaritos comentados será limitado.
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
                      className="w-full py-2.5 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-zinc-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    >
                      Manter minha assinatura
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4 space-y-4">
                  <div className="w-12 h-12 mx-auto bg-amber-100 dark:bg-amber-950/60 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <CheckCircle size={28} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Solicitação registrada
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                      A renovação automática foi desativada. Você ainda pode aproveitar todos os benefícios até o fim do período já pago.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCancelModal(false);
                      setCancelSuccess(false);
                    }}
                    className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold cursor-pointer"
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
