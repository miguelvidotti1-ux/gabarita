import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  CreditCard, 
  QrCode, 
  FileText, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  Sun, 
  Moon, 
  Copy, 
  User, 
  Mail, 
  Lock,
  Sparkles
} from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useTheme } from '../hooks/useTheme';
import VestibularProLogo from './VestibularProLogo';

interface OnboardingFunnelProps {
  onComplete?: (userObj: any) => void;
  onGoToLogin?: () => void;
}

interface PlanOption {
  id: 'mensal' | 'trimestral' | 'semestral' | 'anual';
  name: string;
  price: number;
  periodLabel: string;
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
    features: [
      { text: 'Acesso a todas as provas', enabled: true },
      { text: 'Gabaritos comentados', enabled: true },
      { text: 'Simulados ilimitados', enabled: true },
      { text: 'Análise de desempenho', enabled: false },
      { text: 'Suporte prioritário', enabled: false },
    ]
  },
  {
    id: 'trimestral',
    name: 'Trimestral',
    price: 99.90,
    periodLabel: 'a cada 3 meses',
    savings: 'Economize 16%',
    features: [
      { text: 'Acesso a todas as provas', enabled: true },
      { text: 'Gabaritos comentados', enabled: true },
      { text: 'Simulados ilimitados', enabled: true },
      { text: 'Análise de desempenho', enabled: true },
      { text: 'Suporte prioritário', enabled: false },
    ]
  },
  {
    id: 'semestral',
    name: 'Semestral',
    price: 179.90,
    periodLabel: 'a cada 6 meses',
    savings: 'Economize 25%',
    popular: true,
    features: [
      { text: 'Acesso a todas as provas', enabled: true },
      { text: 'Gabaritos comentados', enabled: true },
      { text: 'Simulados ilimitados', enabled: true },
      { text: 'Análise de desempenho', enabled: true },
      { text: 'Suporte prioritário', enabled: true },
    ]
  },
  {
    id: 'anual',
    name: 'Anual',
    price: 299.90,
    periodLabel: 'por ano',
    savings: 'Economize 37%',
    features: [
      { text: 'Acesso a todas as provas', enabled: true },
      { text: 'Gabaritos comentados', enabled: true },
      { text: 'Simulados ilimitados', enabled: true },
      { text: 'Análise de desempenho avançada', enabled: true },
      { text: 'Suporte prioritário + mentorias', enabled: true },
    ]
  }
];

export const OnboardingFunnel: React.FC<OnboardingFunnelProps> = ({ onComplete, onGoToLogin }) => {
  const { theme, toggleTheme } = useTheme();

  // Wizard Step: 1 = Cadastro, 2 = Escolher Plano, 3 = Pagamento, 4 = Sucesso
  const [currentStep, setCurrentStep] = useState<number>(1);

  // User Registration State
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [registeredUser, setRegisteredUser] = useState<any>(null);

  // Selected Plan State
  const [selectedPlan, setSelectedPlan] = useState<PlanOption | null>(PLANS[2]); // Default Semestral
  const [paymentMethod, setPaymentMethod] = useState<'cartao' | 'pix' | 'boleto'>('cartao');

  // Payment Form Fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // UI Feedback & Loading
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'warning' | 'success'; message: string } | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);

  // Questionnaire state
  const [questionnaire, setQuestionnaire] = useState({
    vestibulares: [] as string[],
    previousExams: [] as { exam: string, grade: number }[],
    studyMethod: '',
    dailyHours: 0,
    easySubjects: [] as string[],
    hardSubjects: [] as string[],
    source: ''
  });

  // Password validation score
  const getPasswordMetrics = (pass: string) => {
    if (!pass) return { score: 0, label: 'Muito fraca', checks: { min: false, upper: false, number: false, special: false } };

    const checks = {
      min: pass.length >= 8,
      upper: /[A-Z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[^A-Za-z0-9]/.test(pass)
    };

    let score = 0;
    if (checks.min) score += 25;
    if (checks.upper) score += 25;
    if (checks.number) score += 25;
    if (checks.special) score += 25;

    const labels: Record<number, string> = {
      25: 'Muito fraca',
      50: 'Fraca',
      75: 'Boa',
      100: 'Forte'
    };

    return { score, label: labels[score] || 'Muito fraca', checks };
  };

  const pwdMetrics = getPasswordMetrics(senha);

  // Handle Step 1: Criar Conta
  const handleCriarConta = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFeedback(null);

    const nomeClean = nome.trim();
    const emailClean = email.trim();

    if (!nomeClean || !emailClean || !senha || !confirmar) {
      setFeedback({ type: 'error', message: 'Preencha todos os campos.' });
      return;
    }

    if (!emailClean.includes('@')) {
      setFeedback({ type: 'error', message: 'Digite um e-mail válido.' });
      return;
    }

    if (senha.length < 8) {
      setFeedback({ type: 'error', message: 'A senha deve ter no mínimo 8 caracteres.' });
      return;
    }

    if (senha !== confirmar) {
      setFeedback({ type: 'error', message: 'As senhas não coincidem.' });
      return;
    }

    if (pwdMetrics.score < 75) {
      setFeedback({ type: 'warning', message: 'Crie uma senha mais forte para maior segurança.' });
      return;
    }

    setLoading(true);

    try {
      let userObj: any = null;
      try {
        const res = await createUserWithEmailAndPassword(auth, emailClean, senha);
        userObj = {
          uid: res.user.uid,
          email: res.user.email || emailClean,
          displayName: nomeClean
        };
      } catch (err) {
        // Fallback demo user
        userObj = {
          uid: 'user_' + Math.random().toString(36).substring(2, 9),
          email: emailClean,
          displayName: nomeClean
        };
      }

      try {
        const userRef = doc(db, 'users', userObj.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: userObj.uid,
            email: userObj.email,
            displayName: userObj.displayName,
            role: 'user',
            createdAt: new Date().toISOString()
          });
        }
      } catch (_) {}

      setRegisteredUser(userObj);
      setLoading(false);
      
      // Auto-advance to Step 2: Escolher Plano
      setCurrentStep(2);
    } catch (error) {
      setFeedback({ type: 'error', message: 'Erro ao criar conta. Tente novamente.' });
      setLoading(false);
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

  const handleCopyPix = () => {
    const code = "00020126580014BR.GOV.BCB.PIX0136a6295348-2f8c-4f4e-9d5a-3b8e1c7f4d2a5204000053039865802BR5913VESTHUB6009SAOPAULO62070503***6304A2B3";
    navigator.clipboard.writeText(code);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  // Handle Step 3: Process Payment
  const handleProcessarPagamento = async () => {
    setFeedback(null);

    if (paymentMethod === 'cartao') {
      const numClean = cardNumber.replace(/\s/g, '');
      if (numClean.length < 13) {
        setFeedback({ type: 'error', message: 'Número do cartão inválido.' });
        return;
      }
      if (!cardName.trim()) {
        setFeedback({ type: 'error', message: 'Digite o nome no cartão.' });
        return;
      }
      if (cardExpiry.length < 5) {
        setFeedback({ type: 'error', message: 'Validade inválida (MM/AA).' });
        return;
      }
      if (cardCvv.length < 3) {
        setFeedback({ type: 'error', message: 'CVV inválido.' });
        return;
      }
    }

    setLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 2200));
      setLoading(false);
      setCurrentStep(4); // Success screen
    } catch (err) {
      setFeedback({ type: 'error', message: 'Erro ao processar pagamento. Tente novamente.' });
      setLoading(false);
    }
  };

  const calculateNextBilling = () => {
    if (!selectedPlan) return '';
    const date = new Date();
    if (selectedPlan.id === 'mensal') date.setMonth(date.getMonth() + 1);
    if (selectedPlan.id === 'trimestral') date.setMonth(date.getMonth() + 3);
    if (selectedPlan.id === 'semestral') date.setMonth(date.getMonth() + 6);
    if (selectedPlan.id === 'anual') date.setFullYear(date.getFullYear() + 1);
    return date.toLocaleDateString('pt-BR');
  };

  const getHeaderTitle = () => {
    if (currentStep === 1) return 'Criar sua conta';
    if (currentStep === 2) return 'Conte-nos um pouco sobre você';
    if (currentStep === 3) return 'Escolha seu plano';
    if (currentStep === 4) return 'Finalizar pagamento';
    return 'Tudo pronto!';
  };

  const getHeaderSubtitle = () => {
    if (currentStep === 1) return 'Preencha os dados para começar';
    if (currentStep === 2) return 'Precisamos conhecer melhor seu perfil de estudante';
    if (currentStep === 3) return `Bem-vindo, ${nome.split(' ')[0] || 'Estudante'}! Selecione o plano ideal para você.`;
    if (currentStep === 4) return 'Complete o pagamento para ativar seu plano';
    return 'Seu plano está ativo. Bons estudos!';
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary,#F0F1F4)] dark:bg-[#0F0F11] flex items-center justify-center p-4 font-sans text-[#1A1A1A] dark:text-[#F0F1F4] transition-colors relative">
      {/* CONTAINER PRINCIPAL */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white dark:bg-[#1A1A1E] rounded-[20px] shadow-2xl overflow-hidden w-[960px] max-w-full transition-colors border border-gray-100 dark:border-gray-800"
      >
        
        {/* HEADER COM STEP BAR */}
        <div className="p-8 sm:p-10 border-b border-gray-100 dark:border-[#2D2D33]">
          <div className="inline-flex items-center gap-2.5 mb-6">
            <VestibularProLogo className="w-9 h-9" bgVariant="black" />
            <span className="text-lg font-semibold tracking-tight text-[#1A1A1A] dark:text-[#F0F1F4]">
              VESTIBULAR<span className="text-blue-600 dark:text-blue-400">PRO</span>
            </span>
          </div>

          {/* STEP PROGRESS INDICATOR */}
          <div className="flex items-center gap-2 sm:gap-3 mb-6 max-w-md">
            {/* STEP 1 */}
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentStep > 1 
                  ? 'bg-emerald-500 text-white' 
                  : currentStep === 1 
                  ? 'bg-[#1A1A1A] dark:bg-[#F0F1F4] text-white dark:text-[#1A1A1A]' 
                  : 'border-2 border-gray-300 text-gray-400'
              }`}>
                {currentStep > 1 ? <Check size={14} /> : '1'}
              </div>
              <span className={`text-xs font-semibold ${currentStep === 1 ? 'text-[#1A1A1A] dark:text-[#F0F1F4]' : 'text-gray-400'}`}>
                Criar conta
              </span>
            </div>

            <div className={`flex-1 h-[2px] transition-colors ${currentStep > 1 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-800'}`} />

            {/* STEP 2 */}
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentStep > 2 
                  ? 'bg-emerald-500 text-white' 
                  : currentStep === 2 
                  ? 'bg-[#1A1A1A] dark:bg-[#F0F1F4] text-white dark:text-[#1A1A1A]' 
                  : 'border-2 border-gray-300 text-gray-400'
              }`}>
                {currentStep > 2 ? <Check size={14} /> : '2'}
              </div>
              <span className={`text-xs font-semibold ${currentStep === 2 ? 'text-[#1A1A1A] dark:text-[#F0F1F4]' : 'text-gray-400'}`}>
                Escolher plano
              </span>
            </div>

            <div className={`flex-1 h-[2px] transition-colors ${currentStep > 2 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-800'}`} />

            {/* STEP 3 */}
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentStep > 3 
                  ? 'bg-emerald-500 text-white' 
                  : currentStep === 3 
                  ? 'bg-[#1A1A1A] dark:bg-[#F0F1F4] text-white dark:text-[#1A1A1A]' 
                  : 'border-2 border-gray-300 text-gray-400'
              }`}>
                {currentStep > 3 ? <Check size={14} /> : '3'}
              </div>
              <span className={`text-xs font-semibold ${currentStep === 3 ? 'text-[#1A1A1A] dark:text-[#F0F1F4]' : 'text-gray-400'}`}>
                Pagamento
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] dark:text-[#F0F1F4] mb-1 tracking-tight">
            {getHeaderTitle()}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {getHeaderSubtitle()}
          </p>
        </div>

        {/* FEEDBACK BANNERS */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-8 pt-6"
            >
              <div className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2.5 ${
                feedback.type === 'error'
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
              }`}>
                <AlertCircle size={16} className="shrink-0" />
                <span>{feedback.message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SCREEN 1: CADASTRO */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="p-8 sm:p-12 max-w-md mx-auto"
          >
            <form onSubmit={handleCriarConta} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5">Nome completo</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Digite seu nome"
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#25252B] border border-gray-300 dark:border-[#3D3D45] rounded-xl text-sm outline-none focus:border-[#1A1A1A] dark:focus:border-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">E-mail</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Digite seu e-mail"
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#25252B] border border-gray-300 dark:border-[#3D3D45] rounded-xl text-sm outline-none focus:border-[#1A1A1A] dark:focus:border-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">Senha</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Crie uma senha forte"
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#25252B] border border-gray-300 dark:border-[#3D3D45] rounded-xl text-sm outline-none focus:border-[#1A1A1A] dark:focus:border-white transition-all"
                  />
                </div>

                {/* Password strength */}
                {senha.length > 0 && (
                  <div className="mt-2.5 space-y-2">
                    <div className="h-1.5 w-full bg-gray-200 dark:bg-[#2D2D33] rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-300"
                        style={{ 
                          width: `${pwdMetrics.score}%`,
                          backgroundColor: pwdMetrics.score <= 25 ? '#EF4444' : pwdMetrics.score <= 50 ? '#F59E0B' : pwdMetrics.score <= 75 ? '#3B82F6' : '#10B981'
                        }}
                      />
                    </div>
                    <span className="text-[11px] text-gray-500 font-medium">
                      {pwdMetrics.label}
                    </span>

                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <div className={`text-[11px] flex items-center gap-1 ${pwdMetrics.checks.min ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>
                        <Check size={12} /> Mínimo 8 caracteres
                      </div>
                      <div className={`text-[11px] flex items-center gap-1 ${pwdMetrics.checks.upper ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>
                        <Check size={12} /> Letra maiúscula
                      </div>
                      <div className={`text-[11px] flex items-center gap-1 ${pwdMetrics.checks.number ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>
                        <Check size={12} /> Número
                      </div>
                      <div className={`text-[11px] flex items-center gap-1 ${pwdMetrics.checks.special ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>
                        <Check size={12} /> Caractere especial
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">Confirmar senha</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="password"
                    value={confirmar}
                    onChange={(e) => setConfirmar(e.target.value)}
                    placeholder="Repita a senha"
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#25252B] border border-gray-300 dark:border-[#3D3D45] rounded-xl text-sm outline-none focus:border-[#1A1A1A] dark:focus:border-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-2 bg-[#1A1A1A] hover:bg-[#2D2D2D] dark:bg-[#F0F1F4] dark:hover:bg-white dark:text-[#1A1A1A] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Criar conta e escolher plano</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-6">
              <button
                type="button"
                onClick={onGoToLogin}
                className="text-xs text-gray-500 hover:text-[#1A1A1A] dark:hover:text-white transition-colors cursor-pointer"
              >
                Já tem conta? <span className="font-semibold underline">Entrar</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* SCREEN 2: QUESTIONARIO */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-8 sm:p-12 max-w-md mx-auto"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5">Qual(is) vestibular(es) pretende cursar esse ano?</label>
                <input
                  type="text"
                  placeholder="Ex: FUVEST, UNICAMP, ENEM, IME"
                  className="w-full px-4 py-3 bg-white dark:bg-[#25252B] border border-gray-300 dark:border-[#3D3D45] rounded-xl text-sm outline-none focus:border-[#1A1A1A] dark:focus:border-white transition-all"
                  onChange={(e) => setQuestionnaire(prev => ({ ...prev, vestibulares: e.target.value.split(',').map(s => s.trim()) }))}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">Já fez algum vestibular? (Qual e nota)</label>
                <input
                  type="text"
                  placeholder="Ex: FUVEST 2024 (nota 65)"
                  className="w-full px-4 py-3 bg-white dark:bg-[#25252B] border border-gray-300 dark:border-[#3D3D45] rounded-xl text-sm outline-none focus:border-[#1A1A1A] dark:focus:border-white transition-all"
                  onChange={(e) => setQuestionnaire(prev => ({ ...prev, previousExams: [{ exam: e.target.value, grade: 0 }] }))}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">Método de estudo preferido</label>
                <input
                  type="text"
                  placeholder="Ex: Resolução de provas antigas, flashcards, resumos"
                  className="w-full px-4 py-3 bg-white dark:bg-[#25252B] border border-gray-300 dark:border-[#3D3D45] rounded-xl text-sm outline-none focus:border-[#1A1A1A] dark:focus:border-white transition-all"
                  onChange={(e) => setQuestionnaire(prev => ({ ...prev, studyMethod: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">Carga horária diária de estudo (horas)</label>
                <input
                  type="number"
                  placeholder="Ex: 4"
                  className="w-full px-4 py-3 bg-white dark:bg-[#25252B] border border-gray-300 dark:border-[#3D3D45] rounded-xl text-sm outline-none focus:border-[#1A1A1A] dark:focus:border-white transition-all"
                  onChange={(e) => setQuestionnaire(prev => ({ ...prev, dailyHours: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Matérias com mais facilidade</label>
                  <input
                    type="text"
                    placeholder="Ex: Biologia, História"
                    className="w-full px-3 py-2.5 bg-white dark:bg-[#25252B] border border-gray-300 dark:border-[#3D3D45] rounded-xl text-xs outline-none focus:border-[#1A1A1A] dark:focus:border-white transition-all"
                    onChange={(e) => setQuestionnaire(prev => ({ ...prev, easySubjects: e.target.value.split(',').map(s => s.trim()) }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Mais dificuldade</label>
                  <input
                    type="text"
                    placeholder="Ex: Física, Matemática"
                    className="w-full px-3 py-2.5 bg-white dark:bg-[#25252B] border border-gray-300 dark:border-[#3D3D45] rounded-xl text-xs outline-none focus:border-[#1A1A1A] dark:focus:border-white transition-all"
                    onChange={(e) => setQuestionnaire(prev => ({ ...prev, hardSubjects: e.target.value.split(',').map(s => s.trim()) }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">De onde conheceu o aplicativo?</label>
                <input
                  type="text"
                  placeholder="Ex: Instagram, indicação de amigo, Google, TikTok"
                  className="w-full px-4 py-3 bg-white dark:bg-[#25252B] border border-gray-300 dark:border-[#3D3D45] rounded-xl text-sm outline-none focus:border-[#1A1A1A] dark:focus:border-white transition-all"
                  onChange={(e) => setQuestionnaire(prev => ({ ...prev, source: e.target.value }))}
                />
              </div>
              
              <button
                type="button"
                onClick={async () => {
                  try {
                    if (registeredUser?.uid) {
                      await setDoc(doc(db, 'users', registeredUser.uid, 'questionnaire', 'data'), questionnaire);
                    }
                    setCurrentStep(3);
                  } catch (e) {
                    setFeedback({ type: 'error', message: 'Erro ao salvar questionário.' });
                  }
                }}
                className="w-full py-4 mt-2 bg-[#1A1A1A] hover:bg-[#2D2D2D] dark:bg-[#F0F1F4] dark:hover:bg-white dark:text-[#1A1A1A] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] cursor-pointer"
              >
                <span>Continuar para Escolha do Plano</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* SCREEN 3: PAGAMENTO */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 sm:p-10 max-w-xl mx-auto space-y-6"
          >
            {/* ORDER SUMMARY */}
            <div className="p-5 bg-gray-50 dark:bg-[#25252B] rounded-2xl border border-gray-100 dark:border-[#3D3D45] space-y-2 text-sm">
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>Plano</span>
                <span className="font-semibold text-[#1A1A1A] dark:text-[#F0F1F4]">{selectedPlan?.name}</span>
              </div>
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>Valor</span>
                <span className="font-semibold text-[#1A1A1A] dark:text-[#F0F1F4]">R$&nbsp;{selectedPlan?.price.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-[#3D3D45] flex justify-between font-bold text-lg text-[#1A1A1A] dark:text-[#F0F1F4]">
                <span>Total</span>
                <span>R$&nbsp;{selectedPlan?.price.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            {/* PAYMENT METHODS */}
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
                <span className="text-xs font-semibold">Cartão</span>
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

            {/* CARTÃO FIELDS */}
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
                  <label className="block text-xs font-semibold mb-1">Nome no cartão</label>
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

            {/* PIX FIELDS */}
            {paymentMethod === 'pix' && (
              <div className="text-center p-6 space-y-4 bg-gray-50 dark:bg-[#25252B] rounded-2xl border border-gray-100 dark:border-[#3D3D45]">
                <div className="w-40 h-40 mx-auto bg-white dark:bg-[#1A1A1E] p-3 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-center">
                  <QrCode size={120} className="text-[#1A1A1A] dark:text-[#F0F1F4]" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Escaneie o QR Code ou copie o código PIX abaixo:
                </p>
                <div className="p-3 bg-white dark:bg-[#1A1A1E] border border-gray-200 dark:border-[#3D3D45] rounded-xl text-[11px] font-mono text-gray-500 break-all select-all">
                  00020126580014BR.GOV.BCB.PIX0136a6295348-2f8c-4f4e-9d5a-3b8e1c7f4d2a5204000053039865802BR5913VESTHUB6009SAOPAULO62070503***6304A2B3
                </div>
                <button
                  type="button"
                  onClick={handleCopyPix}
                  className="py-2 px-5 bg-white dark:bg-[#1A1A1E] border border-gray-300 dark:border-[#3D3D45] rounded-xl text-xs font-semibold text-[#1A1A1A] dark:text-[#F0F1F4] hover:bg-gray-100 dark:hover:bg-[#2D2D33] transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <Copy size={14} />
                  <span>{copiedPix ? 'Copiado!' : 'Copiar código PIX'}</span>
                </button>
              </div>
            )}

            {/* BOLETO FIELDS */}
            {paymentMethod === 'boleto' && (
              <div className="text-center p-6 space-y-3 bg-gray-50 dark:bg-[#25252B] rounded-2xl border border-gray-100 dark:border-[#3D3D45]">
                <FileText size={44} className="mx-auto text-gray-400" />
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  O boleto será gerado após a confirmação. O acesso é liberado em até 2 dias úteis após o pagamento.
                </p>
                <p className="text-[11px] text-gray-400">
                  Taxa bancária de R$ 2,90 será adicionada ao valor total.
                </p>
              </div>
            )}

            <button
              type="button"
              disabled={loading}
              onClick={handleProcessarPagamento}
              className="w-full py-4 bg-[#1A1A1A] hover:bg-[#2D2D2D] dark:bg-[#F0F1F4] dark:hover:bg-white dark:text-[#1A1A1A] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {paymentMethod === 'cartao' && 'Confirmar pagamento'}
                    {paymentMethod === 'pix' && 'Já fiz o pagamento'}
                    {paymentMethod === 'boleto' && 'Gerar boleto'}
                  </span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* SCREEN 4: SUCESSO */}
        {currentStep === 4 && (
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
                Conta criada e plano ativo!
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tudo pronto. Você já pode começar a estudar no Gabarita.
              </p>
            </div>

            <div className="p-5 bg-gray-50 dark:bg-[#25252B] rounded-2xl border border-gray-100 dark:border-[#3D3D45] text-xs space-y-2.5 text-left">
              <div className="flex justify-between">
                <span className="text-gray-400">Nome</span>
                <span className="font-bold text-[#1A1A1A] dark:text-[#F0F1F4]">{nome || 'Estudante'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Plano</span>
                <span className="font-bold text-[#1A1A1A] dark:text-[#F0F1F4]">{selectedPlan?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Valor</span>
                <span className="font-bold text-[#1A1A1A] dark:text-[#F0F1F4]">R$&nbsp;{selectedPlan?.price.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Próxima cobrança</span>
                <span className="font-bold text-[#1A1A1A] dark:text-[#F0F1F4]">{calculateNextBilling()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Método</span>
                <span className="font-bold text-[#1A1A1A] dark:text-[#F0F1F4] uppercase">{paymentMethod}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onComplete) onComplete(registeredUser || { displayName: nome, email });
              }}
              className="w-full py-4 bg-[#1A1A1A] hover:bg-[#2D2D2D] dark:bg-[#F0F1F4] dark:hover:bg-white dark:text-[#1A1A1A] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] cursor-pointer"
            >
              <span>Começar a estudar</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>
        )}

      </motion.div>

    </div>
  );
};

export default OnboardingFunnel;
