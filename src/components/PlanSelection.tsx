import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  X, 
  CreditCard, 
  QrCode, 
  FileText, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Sun, 
  Moon, 
  Copy, 
  ShieldCheck,
  Crown,
  RefreshCw,
  Zap,
  TrendingUp,
  Calendar,
  Settings,
  ChevronRight,
  Info
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import ThemeToggle from './ThemeToggle';
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
  userEmail, 
  userName,
  currentPlanId = 'semestral'
}) => {
  const { theme, toggleTheme } = useTheme();

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
      await new Promise((r) => setTimeout(r, 1800));

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
    <div className="min-h-screen bg-[var(--bg-primary,#F0F1F4)] dark:bg-[#0F0F11] flex items-center justify-center p-4 font-sans text-[#1A1A1A] dark:text-[#F0F1F4] transition-colors relative">
      
      {/* TOGGLE DARK MODE */}
      <ThemeToggle className="fixed left-4 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-50" />

      {/* MAIN CONTAINER */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white dark:bg-[#1A1A1E] rounded-[24px] shadow-2xl overflow-hidden w-[1020px] max-w-full transition-colors border border-gray-100 dark:border-gray-800"
      >
        
        {/* HEADER */}
        <div className="p-8 sm:p-10 border-b border-gray-100 dark:border-[#2D2D33] bg-gradient-to-b from-gray-50/80 to-transparent dark:from-[#25252B]/40 dark:to-transparent">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-semibold text-amber-600 dark:text-amber-400">
                <Crown size={14} />
                <span>Gestão de Assinatura</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] dark:text-[#F0F1F4] tracking-tight">
                Planos & Assinatura
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Visualize seu plano ativo, acompanhe renovações ou escolha uma nova opção de estudos.
              </p>
            </div>

            {userName && (
              <div className="self-start sm:self-auto px-4 py-2 bg-gray-100 dark:bg-[#25252B] border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300">
                <span>Usuário: </span>
                <span className="font-bold text-[#1A1A1A] dark:text-white">{userName}</span>
              </div>
            )}
          </div>
        </div>

        {/* OVERVIEW SCREEN */}
        {screen === 'overview' && (
          <div className="p-6 sm:p-10 space-y-10">

            {/* SECTION 1: SEU PLANO ATUAL */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#1A1A1A] dark:text-[#F0F1F4] flex items-center gap-2">
                  <ShieldCheck size={20} className="text-emerald-500" />
                  <span>Seu Plano Atual</span>
                </h2>
                <span className="text-xs text-gray-400 font-medium">Assinatura Ativa</span>
              </div>

              <div className="relative overflow-hidden rounded-2xl border-2 border-indigo-600/30 dark:border-indigo-500/40 bg-gradient-to-br from-indigo-50/60 via-white to-gray-50 dark:from-indigo-950/20 dark:via-[#1A1A1E] dark:to-[#25252B] p-6 sm:p-8 shadow-sm">
                
                {/* Status Badge */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-6 border-b border-gray-200/80 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
                      <Crown size={22} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-extrabold text-[#1A1A1A] dark:text-white">
                          Plano {activePlanObj.name}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          ATIVO
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {activePlanObj.cycleLabel}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-2xl font-black text-[#1A1A1A] dark:text-white">
                      R$&nbsp;{activePlanObj.price.toFixed(2).replace('.', ',')}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {activePlanObj.periodLabel}
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-3.5 bg-white dark:bg-[#25252B] rounded-xl border border-gray-200/80 dark:border-gray-800">
                    <div className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5 mb-1">
                      <Calendar size={14} className="text-indigo-500" />
                      Próxima renovação
                    </div>
                    <div className="text-sm font-bold text-[#1A1A1A] dark:text-white">
                      {calculateNextBillingDate(activePlanObj.id)}
                    </div>
                  </div>

                  <div className="p-3.5 bg-white dark:bg-[#25252B] rounded-xl border border-gray-200/80 dark:border-gray-800">
                    <div className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5 mb-1">
                      <CreditCard size={14} className="text-indigo-500" />
                      Forma de pagamento
                    </div>
                    <div className="text-sm font-bold text-[#1A1A1A] dark:text-white flex items-center gap-1.5">
                      <span>Cartão •••• 4242</span>
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded">Principal</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-white dark:bg-[#25252B] rounded-xl border border-gray-200/80 dark:border-gray-800">
                    <div className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5 mb-1">
                      <RefreshCw size={14} className="text-indigo-500" />
                      Status da renovação
                    </div>
                    <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      Renovação Automática
                    </div>
                  </div>
                </div>

                {/* Active Perks List */}
                <div className="space-y-2 mb-6">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Benefícios inclusos no seu plano atual
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activePlanObj.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${feat.enabled ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'}`}>
                          <Check size={10} strokeWidth={3} />
                        </div>
                        <span className={feat.enabled ? '' : 'line-through opacity-40'}>{feat.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-200/80 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const nextPlan = PLANS.find(p => p.id !== activePlanId) || PLANS[3];
                        handleInitiatePlanChange(nextPlan);
                      }}
                      className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#2D2D2D] dark:bg-[#F0F1F4] dark:hover:bg-white text-white dark:text-[#1A1A1A] text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles size={14} />
                      <span>Alterar ou fazer upgrade</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowCancelModal(true)}
                    className="text-xs text-gray-500 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-colors cursor-pointer"
                  >
                    Cancelar assinatura
                  </button>
                </div>

              </div>
            </div>

            {/* SECTION 2: POSSÍVEIS MUDANÇAS DE PLANOS */}
            <div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={20} className="text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-xl font-bold text-[#1A1A1A] dark:text-[#F0F1F4]">
                    Opções de Mudança de Plano
                  </h2>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Migre para um plano superior a qualquer momento com desconto proporcional instantâneo.
                </p>
              </div>

              {/* Grid of All Plans for Migration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {PLANS.map((plan) => {
                  const isActive = plan.id === activePlanId;
                  const isUpgrade = plan.price > activePlanObj.price;
                  const { main, cents } = formatPrice(plan.price);

                  return (
                    <div
                      key={plan.id}
                      className={`
                        relative p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between
                        ${isActive 
                          ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500 dark:border-emerald-500 shadow-md' 
                          : plan.popular 
                          ? 'bg-white dark:bg-[#25252B] border-indigo-600 dark:border-indigo-500 shadow-md' 
                          : 'bg-white dark:bg-[#1A1A1E] border-gray-200 dark:border-[#2D2D33] hover:border-gray-300'
                        }
                      `}
                    >
                      {/* Top Badges */}
                      {isActive && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white font-bold text-[10px] px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                          <CheckCircle size={12} />
                          <span>PLANO ATUAL</span>
                        </div>
                      )}

                      {!isActive && isUpgrade && plan.savings && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white font-bold text-[10px] px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                          <Sparkles size={12} />
                          <span>UPGRADE — {plan.savings}</span>
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            {plan.name}
                          </span>
                        </div>

                        <div className="flex items-baseline gap-0.5 mb-1">
                          <span className="text-sm font-bold">R$&nbsp;</span>
                          <span className="text-3xl font-extrabold tracking-tight">{main}</span>
                          <span className="text-sm font-semibold text-gray-400">,{cents}</span>
                        </div>

                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                          {plan.periodLabel}
                        </div>

                        {/* Features summary */}
                        <ul className="space-y-2 mb-6 border-t border-gray-100 dark:border-gray-800 pt-4">
                          {plan.features.map((f, i) => (
                            <li key={i} className={`text-[11px] flex items-start gap-1.5 ${f.enabled ? 'text-gray-700 dark:text-gray-300' : 'opacity-35 line-through'}`}>
                              <Check size={12} className={`shrink-0 mt-0.5 ${f.enabled ? 'text-emerald-500' : 'text-gray-400'}`} />
                              <span>{f.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Button */}
                      <div>
                        {isActive ? (
                          <div className="w-full py-2.5 px-4 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-bold text-center border border-emerald-500/20">
                            ✓ Seu plano ativo
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleInitiatePlanChange(plan)}
                            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-[0.98] ${
                              isUpgrade 
                                ? 'bg-[#1A1A1A] hover:bg-[#2D2D2D] dark:bg-[#F0F1F4] dark:hover:bg-white text-white dark:text-[#1A1A1A]' 
                                : 'bg-gray-100 hover:bg-gray-200 dark:bg-[#25252B] dark:hover:bg-[#2D2D33] text-gray-800 dark:text-gray-200'
                            }`}
                          >
                            <span>{isUpgrade ? 'Fazer Upgrade' : 'Mudar para este plano'}</span>
                            <ArrowRight size={14} />
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* INFO BOX */}
            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 flex items-start gap-3">
              <Info size={18} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed">
                <span className="font-bold">Como funciona a troca de plano? </span>
                Ao migrar de plano, a alteração entra em vigor imediatamente. O saldo restante do seu plano anterior é convertido automaticamente em desconto na cobrança do novo plano escolhido.
              </div>
            </div>

          </div>
        )}

        {/* PAYMENT / CONFIRMATION SCREEN */}
        {screen === 'payment' && selectedPlanForMigration && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 sm:p-10 max-w-xl mx-auto space-y-6"
          >
            {/* Header */}
            <div className="text-center">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Confirmação de Migração
              </span>
              <h2 className="text-2xl font-bold text-[#1A1A1A] dark:text-white mt-1">
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
            <div className="p-5 bg-gray-50 dark:bg-[#25252B] rounded-2xl border border-gray-200 dark:border-[#3D3D45] space-y-3 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Plano Atual</span>
                <span className="font-semibold text-gray-700 dark:text-gray-300">{activePlanObj.name} (R$ {activePlanObj.price.toFixed(2).replace('.', ',')})</span>
              </div>
              <div className="flex justify-between text-indigo-600 dark:text-indigo-400 font-medium">
                <span>Novo Plano Selecionado</span>
                <span className="font-bold">{selectedPlanForMigration.name} ({selectedPlanForMigration.periodLabel})</span>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Ajuste proporcional aplicado</span>
                <span>Desconto imediato na fatura</span>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-[#3D3D45] flex justify-between font-bold text-base text-[#1A1A1A] dark:text-white">
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
                    ? 'border-[#1A1A1A] dark:border-white bg-indigo-50/50 dark:bg-indigo-950/20 text-[#1A1A1A] dark:text-[#F0F1F4]'
                    : 'border-gray-200 dark:border-[#2D2D33] text-gray-500 hover:border-gray-300'
                }`}
              >
                <CreditCard size={22} />
                <span className="text-xs font-semibold">Cartão de Crédito</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`p-3.5 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'pix'
                    ? 'border-[#1A1A1A] dark:border-white bg-indigo-50/50 dark:bg-indigo-950/20 text-[#1A1A1A] dark:text-[#F0F1F4]'
                    : 'border-gray-200 dark:border-[#2D2D33] text-gray-500 hover:border-gray-300'
                }`}
              >
                <QrCode size={22} />
                <span className="text-xs font-semibold">PIX</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('boleto')}
                className={`p-3.5 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'boleto'
                    ? 'border-[#1A1A1A] dark:border-white bg-indigo-50/50 dark:bg-indigo-950/20 text-[#1A1A1A] dark:text-[#F0F1F4]'
                    : 'border-gray-200 dark:border-[#2D2D33] text-gray-500 hover:border-gray-300'
                }`}
              >
                <FileText size={22} />
                <span className="text-xs font-semibold">Boleto</span>
              </button>
            </div>

            {/* FORM CARTAO */}
            {paymentMethod === 'cartao' && (
              <div className="space-y-3.5 pt-2">
                <div>
                  <label className="block text-xs font-semibold mb-1">Número do cartão</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="w-full px-4 py-3 bg-white dark:bg-[#25252B] border border-gray-300 dark:border-[#3D3D45] rounded-xl text-sm outline-none focus:border-[#1A1A1A] dark:focus:border-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Nome impresso no cartão</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Como aparece no cartão"
                    className="w-full px-4 py-3 bg-white dark:bg-[#25252B] border border-gray-300 dark:border-[#3D3D45] rounded-xl text-sm outline-none focus:border-[#1A1A1A] dark:focus:border-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Validade</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => handleExpiryChange(e.target.value)}
                      placeholder="MM/AA"
                      maxLength={5}
                      className="w-full px-4 py-3 bg-white dark:bg-[#25252B] border border-gray-300 dark:border-[#3D3D45] rounded-xl text-sm outline-none focus:border-[#1A1A1A] dark:focus:border-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">CVV</label>
                    <input
                      type="text"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      placeholder="123"
                      maxLength={4}
                      className="w-full px-4 py-3 bg-white dark:bg-[#25252B] border border-gray-300 dark:border-[#3D3D45] rounded-xl text-sm outline-none focus:border-[#1A1A1A] dark:focus:border-white transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* FORM PIX */}
            {paymentMethod === 'pix' && (
              <div className="text-center p-6 space-y-4 bg-gray-50 dark:bg-[#25252B] rounded-2xl border border-gray-100 dark:border-[#3D3D45]">
                <div className="w-40 h-40 mx-auto bg-white dark:bg-[#1A1A1E] p-3 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-center">
                  <QrCode size={120} className="text-[#1A1A1A] dark:text-[#F0F1F4]" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Escaneie o QR Code ou copie a chave PIX para confirmar a troca de plano:
                </p>
                <button
                  type="button"
                  onClick={handleCopyPix}
                  className="py-2 px-5 bg-white dark:bg-[#1A1A1E] border border-gray-300 dark:border-[#3D3D45] rounded-xl text-xs font-semibold text-[#1A1A1A] dark:text-[#F0F1F4] hover:bg-gray-100 dark:hover:bg-[#2D2D33] transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <Copy size={14} />
                  <span>{copiedPix ? 'Código PIX copiado!' : 'Copiar código PIX'}</span>
                </button>
              </div>
            )}

            {/* FORM BOLETO */}
            {paymentMethod === 'boleto' && (
              <div className="text-center p-6 space-y-3 bg-gray-50 dark:bg-[#25252B] rounded-2xl border border-gray-100 dark:border-[#3D3D45]">
                <FileText size={44} className="mx-auto text-gray-400" />
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Ao selecionar boleto, o novo plano será ativado após a compensação bancária.
                </p>
              </div>
            )}

            {/* ACTION BUTTON */}
            <button
              type="button"
              disabled={loading}
              onClick={handleConfirmPlanChange}
              className="w-full py-4 bg-[#1A1A1A] hover:bg-[#2D2D2D] dark:bg-[#F0F1F4] dark:hover:bg-white dark:text-[#1A1A1A] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black rounded-full animate-spin" />
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
                className="text-xs text-gray-500 hover:text-[#1A1A1A] dark:hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1"
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 sm:p-14 text-center space-y-6 max-w-lg mx-auto"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-20 h-20 mx-auto bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner"
            >
              <CheckCircle size={44} />
            </motion.div>

            <div>
              <h2 className="text-2xl font-bold text-[#1A1A1A] dark:text-[#F0F1F4] mb-1">
                Plano atualizado com sucesso!
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Sua migração para o <span className="font-bold text-[#1A1A1A] dark:text-white">Plano {selectedPlanForMigration.name}</span> foi concluída.
              </p>
            </div>

            <div className="p-5 bg-gray-50 dark:bg-[#25252B] rounded-2xl border border-gray-100 dark:border-[#3D3D45] text-xs space-y-2.5 text-left">
              <div className="flex justify-between">
                <span className="text-gray-400">Novo Plano</span>
                <span className="font-bold text-[#1A1A1A] dark:text-[#F0F1F4]">Plano {selectedPlanForMigration.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Valor</span>
                <span className="font-bold text-[#1A1A1A] dark:text-[#F0F1F4]">R$&nbsp;{selectedPlanForMigration.price.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Próxima renovação</span>
                <span className="font-bold text-[#1A1A1A] dark:text-[#F0F1F4]">{calculateNextBillingDate(selectedPlanForMigration.id)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setScreen('overview');
                if (onComplete) onComplete();
              }}
              className="w-full py-4 bg-[#1A1A1A] hover:bg-[#2D2D2D] dark:bg-[#F0F1F4] dark:hover:bg-white dark:text-[#1A1A1A] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] cursor-pointer"
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
              className="bg-white dark:bg-[#1A1A1E] rounded-2xl p-6 sm:p-8 max-w-md w-full border border-gray-200 dark:border-gray-800 shadow-2xl space-y-4"
            >
              {!cancelSuccess ? (
                <>
                  <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950/60 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-400">
                    <AlertCircle size={28} />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#1A1A1A] dark:text-white">
                      Cancelar Assinatura?
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      Seu plano atual continuará ativo até <span className="font-semibold text-gray-700 dark:text-gray-200">{calculateNextBillingDate(activePlanObj.id)}</span>. Após essa data, seu acesso aos simulados e gabaritos comentados será limitado.
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
                      className="w-full py-2.5 bg-gray-100 dark:bg-[#25252B] hover:bg-gray-200 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    >
                      Manter minha assinatura
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4 space-y-4">
                  <div className="w-12 h-12 mx-auto bg-amber-100 dark:bg-amber-950/60 rounded-full flex items-center justify-center text-amber-600">
                    <CheckCircle size={28} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1A1A1A] dark:text-white">
                      Solicitação registrada
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      A renovação automática foi desativada. Você ainda pode aproveitar todos os benefícios até o fim do período já pago.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCancelModal(false);
                      setCancelSuccess(false);
                    }}
                    className="w-full py-3 bg-[#1A1A1A] dark:bg-white text-white dark:text-black rounded-xl text-xs font-bold cursor-pointer"
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
