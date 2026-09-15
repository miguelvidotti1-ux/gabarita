import React, { useState, useEffect } from 'react';
import { 
  Trophy, Award, Zap, Clock, Calendar, AlertCircle, 
  CheckCircle, XCircle, ArrowRight, Play, RefreshCw, 
  Plus, Minus, Shield, ListOrdered, User, Hourglass, Sparkles,
  Crown, Medal, Check, ChevronRight, Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  weeklyChallengeService, DesafioSemanal as IDesafioSemanal, 
  Participacao, RankingItem 
} from '../services/weeklyChallengeService';
import { generateQuestions, Question } from '../services/geminiService';
import { Vestibular } from '../types';
import { auth } from '../firebase';

const FALLBACK_QUESTIONS_FACIL: Question[] = [
  {
    id: 'ff_q1',
    subject: 'Português',
    text: 'Identifique qual das alternativas abaixo apresenta um erro de concordância verbal:',
    options: ['Fazem cinco anos que não o vejo.', 'Eles vieram ontem à tarde.', 'Havia muitas pessoas na sala.', 'Fui eu quem fez o bolo.', 'Nós fomos ao cinema ontem.'],
    correctAnswer: 0,
    explanation: 'O verbo fazer, quando indica tempo decorrido, é impessoal e deve permanecer na terceira pessoa do singular: "Faz cinco anos..."'
  },
  {
    id: 'ff_q2',
    subject: 'Matemática',
    text: 'Se uma pizza inteira de 8 fatias custa R$ 40,00, qual é o valor proporcional de 3 fatias?',
    options: ['R$ 12,00', 'R$ 15,00', 'R$ 18,00', 'R$ 20,00', 'R$ 24,00'],
    correctAnswer: 1,
    explanation: 'Cada fatia custa R$ 40,00 / 8 = R$ 5,00. Logo, 3 fatias custam 3 * R$ 5,00 = R$ 15,00.'
  },
  {
    id: 'ff_q3',
    subject: 'História',
    text: 'O descobrimento do Brasil pelos portugueses, em 1500, ocorreu no início de qual período histórico?',
    options: ['Idade Antiga', 'Idade Média', 'Idade Moderna', 'Idade Contemporânea', 'Pré-História'],
    correctAnswer: 2,
    explanation: 'O início da Idade Moderna é convencionado em 1453 com a queda de Constantinopla. Portugal chegou ao Brasil em 1500, logo, no início da Idade Moderna.'
  },
  {
    id: 'ff_q4',
    subject: 'Biologia',
    text: 'Qual gás é essencial para a respiração celular humana e é absorvido pelos pulmões durante a inspiração?',
    options: ['Nitrogênio', 'Gás Carbônico', 'Hélio', 'Oxigênio', 'Monóxido de Carbono'],
    correctAnswer: 3,
    explanation: 'O oxigênio (O2) é fundamental para a respiração aeróbica das células humanas, sendo transportado pela hemoglobina do sangue.'
  },
  {
    id: 'ff_q5',
    subject: 'Física',
    text: 'Um bloco de massa m = 2 kg está em repouso sobre um plano inclinado de 30° com a horizontal. Sabendo que o coeficiente de atrito estático é 0.6, determine o valor máximo da força de atrito estático que pode atuar no bloco antes de ele começar a deslizar. (g = 10 m/s², cos(30°) = 0.866)',
    options: ['6.0 N', '8.5 N', '10.0 N', '10.4 N', '12.0 N'],
    correctAnswer: 3,
    explanation: 'A força normal no plano inclinado é N = m * g * cos(30°) = 2 * 10 * 0.866 = 17.32 N. A força de atrito estático máxima é fat_max = N * u_e = 17.32 * 0.6 = 10.39 N ≈ 10.4 N.'
  }
];

const FALLBACK_QUESTIONS_MEDIO: Question[] = [
  {
    id: 'fm_q1',
    subject: 'Português',
    text: 'Assinale a alternativa em que a palavra destacada é classificada como pronome demonstrativo neutro:',
    options: ['Aquilo que disseram era mentira.', 'Esta caneta não escreve bem.', 'Nenhum homem é uma ilha.', 'Gostaria de ver o outro livro.', 'Qualquer opção me serve.'],
    correctAnswer: 0,
    explanation: 'O pronome "Aquilo" é um pronome demonstrativo neutro invariável.'
  },
  {
    id: 'fm_q2',
    subject: 'Matemática',
    text: 'Se os termos de uma progressão geométrica (PG) são (x, x + 3, x + 9), calcule o valor de x:',
    options: ['1', '2', '3', '4', '5'],
    correctAnswer: 2,
    explanation: 'Numa PG de três termos, o quadrado do termo central é igual ao produto dos extremos: (x + 3)² = x * (x + 9) => x² + 6x + 9 = x² + 9x => 3x = 9 => x = 3.'
  },
  {
    id: 'fm_q3',
    subject: 'Biologia',
    text: 'Na herança mendeliana simples com dominância completa, o cruzamento entre dois indivíduos heterozigotos (Aa x Aa) produz uma proporção fenotípica esperada de:',
    options: ['1:1', '3:1', '9:3:3:1', '1:2:1', 'Todos dominantes'],
    correctAnswer: 1,
    explanation: 'O cruzamento gera genótipos 1 AA, 2 Aa e 1 aa. Os fenótipos serão 3 Dominantes (AA e Aa) para 1 Recessivo (aa), gerando a clássica proporção 3:1.'
  },
  {
    id: 'fm_q4',
    subject: 'História',
    text: 'Durante a República Oligárquica no Brasil, a política que garantia apoio mútuo entre o governo federal e os governadores estaduais locais, blindando o poder das oligarquias cafeeiras, ficou conhecida como:',
    options: ['Política dos Governadores', 'Política do Café com Leite', 'Coronelismo', 'Encilhamento', 'Voto de Cabresto'],
    correctAnswer: 0,
    explanation: 'Instituída por Campos Sales, a Política dos Governadores estabelecia um pacto de apoio mútuo e de não-intervenção mútua entre o governo federal e as oligarquias estaduais dominantes.'
  },
  {
    id: 'fm_q5',
    subject: 'Física',
    text: 'Um oscilador harmônico ideal composto por uma mola de constante k e um bloco de massa m tem seu período duplicado se:',
    options: ['A massa m for multiplicada por 2', 'A massa m for multiplicada por 4', 'A mola for substituída por outra de constante 2k', 'A amplitude de oscilação for duplicada', 'A constante k for multiplicada por 4'],
    correctAnswer: 1,
    explanation: 'O período de um oscilador massa-mola é T = 2 * pi * sqrt(m / k). Para duplicar o período (T\' = 2T), debaixo da raiz a massa deve ser quadruplicada (m\' = 4m).'
  }
];

const FALLBACK_QUESTIONS_DIFICIL: Question[] = [
  {
    id: 'fd_q1',
    subject: 'Matemática',
    text: 'Determine o número de soluções reais da equação trigonométrica sen(x) = x / 10.',
    options: ['3', '5', '7', '9', 'Infinitas'],
    correctAnswer: 2,
    explanation: 'Esboçando as curvas y = sen(x) e y = x/10, percebe-se que y = x/10 ultrapassa amplitude 1 em x = 10 e -1 em x = -10. Sendo 3*pi ≈ 9.42 e 4*pi ≈ 12.57, ocorrem 3 cruzamentos do lado positivo, 3 do lado negativo e o cruzamento na origem (x = 0), totalizando 7 soluções.'
  },
  {
    id: 'fd_q2',
    subject: 'Física',
    text: 'Em um experimento de fenda dupla de Young com luz monocromática de comprimento de onda λ, a distância entre as franjas de interferência consecutivas na tela depende inversamente de:',
    options: ['Distância entre as fendas', 'Distância da fenda até a tela', 'Comprimento de onda da luz', 'Frequência da luz', 'Intensidade da fonte emissora'],
    correctAnswer: 0,
    explanation: 'A separação entre franjas consecutivas é dada por Δy = λ * D / d, onde "d" é a distância entre as fendas. Portanto, depende inversamente de d.'
  },
  {
    id: 'fd_q3',
    subject: 'Português',
    text: 'Considere o seguinte verso de Camões: "Amor é um fogo que arde sem se ver". Qual figura de linguagem ou recurso expressivo conceitual predomina estruturalmente na sua argumentação poética?',
    options: ['Anacoluto', 'Paradoxo', 'Polissíndeto', 'Silepse', 'Zeugma'],
    correctAnswer: 1,
    explanation: 'A ideia de fogo que arde sem se ver, ou ferida que dói e não se sente, une conceitos contrários e inconciliáveis em um mesmo enunciado, caracterizando o Paradoxo (ou Oxímoro).'
  },
  {
    id: 'fd_q4',
    subject: 'História',
    text: 'A Paz de Westfália (1648), considerado o marco de surgimento do moderno sistema secular de relações internacionais e soberania dos Estados nacionais, pôs fim a qual grande conflito europeu?',
    options: ['Guerra dos Cem Anos', 'Guerra das Duas Rosas', 'Guerra dos Trinta Anos', 'Guerra de Sucessão Espanhola', 'Guerras Napoleônicas'],
    correctAnswer: 2,
    explanation: 'A Paz de Westfália encerrou a Guerra dos Trinta Anos e a Guerra dos Oito Anos, estabelecendo as bases soberanas dos Estados nacionais da modernidade.'
  },
  {
    id: 'fd_q5',
    subject: 'Biologia',
    text: 'O mecanismo quimiosmótico mitocondrial no qual prótons (H+) acumulados no espaço intermembranar atravessam a ATP sintase a favor de seu gradiente para sintetizar ATP denomina-se:',
    options: ['Fosforilação em nível de substrato', 'Acoplamento quimiosmótico', 'Fotofosforilação acíclica', 'Glicólise anaeróbica', 'Ciclo de Krebs reverso'],
    correctAnswer: 1,
    explanation: 'Proposto por Peter Mitchell, o acoplamento quimiosmótico explica como a força próton-motriz gerada pela cadeia transportadora de elétrons é acoplada à síntese de ATP.'
  }
];

interface Props {
  vestibular: Vestibular;
  onStartQuiz: (questions: Question[], isFull: boolean, timeLimit?: number) => void;
}

export default function DesafioSemanalComponent({ vestibular, onStartQuiz }: Props) {
  const [desafio, setDesafio] = useState<IDesafioSemanal | null>(null);
  const [loading, setLoading] = useState(true);
  const [participacao, setParticipacao] = useState<Participacao | null>(null);
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [activeTab, setActiveTab] = useState<'status' | 'ranking' | 'admin'>('status');

  // Interactive Quiz States (direct gameplay)
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [gameAnswers, setGameAnswers] = useState<{ questaoId: string; correta: boolean; respostaSelecionada?: number }[]>([]);
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [totalTimeLeft, setTotalTimeLeft] = useState<number | null>(null);
  const [totalTimeSelected, setTotalTimeSelected] = useState(40);
  const [selectedLevel, setSelectedLevel] = useState<'facil' | 'medio' | 'dificil'>('medio');
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Admin simulation states
  const [newWeekNum, setNewWeekNum] = useState(2);
  const [simName, setSimName] = useState('');
  const [simScore, setSimScore] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  // Timer loop for standard countdown
  useEffect(() => {
    if (!isPlaying || totalTimeLeft === null || totalTimeLeft <= 0) {
      if (totalTimeLeft === 0 && isPlaying) {
        setIsTimeUp(true);
        handleFinishQuiz(true);
      }
      return;
    }

    const interval = setInterval(() => {
      setTotalTimeLeft(prev => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, totalTimeLeft]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const active = await weeklyChallengeService.obterDesafioAtivo();
      setDesafio(active);

      if (active) {
        const r = await weeklyChallengeService.calcularRankingSemanal(active.id);
        setRanking(r);

        const userId = auth.currentUser?.uid || 'guest_user';
        const p = await weeklyChallengeService.obterParticipacao(userId, active.id);
        setParticipacao(p);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = async () => {
    if (!desafio) return;
    setIsGeneratingQuiz(true);

    let timeLimitMinutes = 40;
    let subjectsForSelection: Record<string, { count: number; difficulty: 'fácil' | 'médio' | 'difícil'; topics?: string[] }> = {};
    let fallbackSet = FALLBACK_QUESTIONS_MEDIO;

    if (selectedLevel === 'facil') {
      timeLimitMinutes = 50;
      fallbackSet = FALLBACK_QUESTIONS_FACIL;
      subjectsForSelection = {
        'Matemática': { count: 1, difficulty: 'fácil' },
        'Português': { count: 1, difficulty: 'fácil' },
        'História': { count: 1, difficulty: 'fácil' },
        'Biologia': { count: 1, difficulty: 'fácil' },
        'Física': { count: 1, difficulty: 'difícil' }
      };
    } else if (selectedLevel === 'medio') {
      timeLimitMinutes = 40;
      fallbackSet = FALLBACK_QUESTIONS_MEDIO;
      subjectsForSelection = {
        'Matemática': { count: 1, difficulty: 'médio' },
        'Português': { count: 1, difficulty: 'médio' },
        'Biologia': { count: 1, difficulty: 'médio' },
        'Física': { count: 1, difficulty: 'difícil' },
        'História': { count: 1, difficulty: 'difícil' }
      };
    } else if (selectedLevel === 'dificil') {
      timeLimitMinutes = 30;
      fallbackSet = FALLBACK_QUESTIONS_DIFICIL;
      subjectsForSelection = {
        'Matemática': { count: 1, difficulty: 'difícil', topics: ['questão avançada extremamente complexa'] },
        'Português': { count: 1, difficulty: 'difícil', topics: ['interpretação de texto complexa e gramática avançada'] },
        'Física': { count: 1, difficulty: 'difícil', topics: ['problema conceitual de alto nível'] },
        'História': { count: 1, difficulty: 'difícil', topics: ['análise historiográfica detalhada'] },
        'Biologia': { count: 1, difficulty: 'difícil', topics: ['genética molecular ou fisiologia de alta complexidade'] }
      };
    }

    let pQuestions: Question[];
    try {
      pQuestions = await generateQuestions(vestibular, subjectsForSelection);
      if (!pQuestions || pQuestions.length === 0) {
        throw new Error("Zero questions returned");
      }
    } catch (err) {
      console.warn("AI Question Generation for level failed, using fallback questions", err);
      pQuestions = fallbackSet.map(q => ({ ...q, id: `${q.id}_${selectedLevel}_${Date.now()}` }));
    }

    setGameQuestions(pQuestions);
    setCurrentIdx(0);
    setSelectedOpt(null);
    setGameAnswers([]);
    setIsAnswerSubmitted(false);
    setIsTimeUp(false);
    setTotalTimeLeft(timeLimitMinutes * 60);
    setIsPlaying(true);
    setIsGeneratingQuiz(false);
  };

  const handleSubmitAnswer = () => {
    if (selectedOpt === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (!desafio) return;
    const q = gameQuestions[currentIdx];
    const isCorrect = q.correctAnswer === selectedOpt;

    const newAns = [...gameAnswers, { 
      questaoId: q.id, 
      correta: isCorrect, 
      respostaSelecionada: selectedOpt !== null ? selectedOpt : undefined 
    }];
    setGameAnswers(newAns);

    if (currentIdx + 1 < gameQuestions.length) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOpt(null);
      setIsAnswerSubmitted(false);
    } else {
      finishQuizFlow(newAns);
    }
  };

  const handleFinishQuiz = (timeout = false) => {
    if (!desafio) return;
    
    const completedAnswers = [...gameAnswers];
    const answeredIds = completedAnswers.map(ca => ca.questaoId);
    
    gameQuestions.forEach(q => {
      if (!answeredIds.includes(q.id)) {
        completedAnswers.push({
          questaoId: q.id,
          correta: false,
          respostaSelecionada: undefined
        });
      }
    });

    finishQuizFlow(completedAnswers);
  };

  const finishQuizFlow = async (finalAnswers: typeof gameAnswers) => {
    if (!desafio) return;
    const userId = auth.currentUser?.uid || 'guest_user';
    const userName = auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || 'Você (Visitante)';

    const p = await weeklyChallengeService.registrarRespostas(
      userId,
      userName,
      desafio.id,
      finalAnswers,
      selectedLevel
    );

    setParticipacao(p);
    setIsPlaying(false);

    const r = await weeklyChallengeService.calcularRankingSemanal(desafio.id);
    setRanking(r);
  };

  const handleCreateChallenge = async () => {
    setIsGenerating(true);
    try {
      const subjectsForSelection: Record<string, { count: number; difficulty: 'fácil' | 'médio' | 'difícil' }> = {
        'Matemática': { count: 1, difficulty: 'médio' },
        'Português': { count: 1, difficulty: 'médio' },
        'Física': { count: 1, difficulty: 'difícil' },
        'História': { count: 1, difficulty: 'médio' },
        'Biologia': { count: 1, difficulty: 'fácil' }
      };
      
      let newQuestions: Question[];
      try {
        newQuestions = await generateQuestions(vestibular, subjectsForSelection);
      } catch (err) {
        console.warn("AI Generation failed, using fallback questions", err);
        newQuestions = desafio ? desafio.questoes.map(q => ({ ...q, id: `g_${q.id}_${Date.now()}` })) : [];
      }

      const start = new Date();
      const end = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const active = await weeklyChallengeService.iniciarDesafioSemanal(
        newWeekNum,
        start,
        end,
        newQuestions
      );

      setDesafio(active);
      setNewWeekNum(prev => prev + 1);
      setParticipacao(null);
      const r = await weeklyChallengeService.calcularRankingSemanal(active.id);
      setRanking(r);
      setActiveTab('status');
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFinalize = async () => {
    if (!desafio) return;
    const res = await weeklyChallengeService.finalizarSemana(desafio.id);
    setDesafio(prev => prev ? { ...prev, ativo: false } : null);
    setRanking(res.ranking);
  };

  const handleReset = async () => {
    if (!desafio) return;
    if (confirm("Deseja realmente apagar o histórico de desafios e participações?")) {
      await weeklyChallengeService.resetarDesafio(desafio.id);
      setDesafio(null);
      setParticipacao(null);
      setRanking([]);
    }
  };

  const handleRegisterSimulatedStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desafio || !simName.trim()) return;

    const mockId = `mock_${Date.now()}`;
    const mockAnsList = desafio.questoes.map((q, idx) => ({
      questaoId: q.id,
      correta: idx < simScore
    }));

    await weeklyChallengeService.registrarRespostas(
      mockId,
      simName.trim(),
      desafio.id,
      mockAnsList
    );

    setSimName('');
    const r = await weeklyChallengeService.calcularRankingSemanal(desafio.id);
    setRanking(r);
  };

  const formatTime = (secs: number) => {
    const min = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="space-y-8 select-none max-w-7xl mx-auto font-sans transition-colors duration-200">
      
      {/* HEADER HERO BANNER */}
      <div className="p-6 sm:p-8 md:p-10 rounded-3xl bg-white dark:bg-[#15171C] border border-slate-200/90 dark:border-white/10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} className="text-blue-600 dark:text-blue-400" />
            <span>Arena Semanal de Inteligência</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Desafio{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Semanal
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 leading-relaxed">
            Aceite o desafio! Uma seleção de 5 testes multidisciplinares para testar suas capacidades interpretativas e analíticas no <strong className="font-bold text-slate-900 dark:text-white">{vestibular}</strong>.
          </p>
        </div>

        {/* XP BADGE */}
        <div className="shrink-0 p-4 rounded-2xl bg-slate-50 dark:bg-[#1C1F26] border border-slate-200 dark:border-white/10 flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-zinc-500">
              Recompensa
            </p>
            <p className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1">
              +50 <span className="text-xs text-amber-500 font-bold">XP / Pontos</span>
            </p>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex bg-slate-100 dark:bg-[#15171C] p-1.5 rounded-2xl max-w-md border border-slate-200/80 dark:border-white/10">
        <button 
          type="button"
          onClick={() => setActiveTab('status')}
          className={`flex-1 py-2.5 text-center rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'status' 
              ? 'bg-white dark:bg-[#1F222A] text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/60 dark:border-white/10' 
              : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          <Zap size={14} className={activeTab === 'status' ? 'text-amber-500' : ''} />
          <span>Desafio Atual</span>
        </button>

        <button 
          type="button"
          onClick={() => setActiveTab('ranking')}
          className={`flex-1 py-2.5 text-center rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'ranking' 
              ? 'bg-white dark:bg-[#1F222A] text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/60 dark:border-white/10' 
              : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          <Award size={14} className={activeTab === 'ranking' ? 'text-indigo-500' : ''} />
          <span>Ranking Semanal</span>
        </button>

        <button 
          type="button"
          onClick={() => setActiveTab('admin')}
          className={`flex-1 py-2.5 text-center rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'admin' 
              ? 'bg-white dark:bg-[#1F222A] text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/60 dark:border-white/10' 
              : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          <Shield size={14} className={activeTab === 'admin' ? 'text-red-500' : ''} />
          <span>Ciclo de Teste</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4 bg-white dark:bg-[#15171C] rounded-3xl border border-slate-200/90 dark:border-white/10">
            <div className="relative flex items-center justify-center">
              <div className="w-14 h-14 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin" />
              <Trophy size={18} className="text-blue-600 absolute" />
            </div>
            <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">
              Preparando arena do desafio...
            </p>
          </div>
        ) : isGeneratingQuiz ? (
          <motion.div
            key="generating-quiz-spinner"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#15171C] p-12 rounded-3xl border border-slate-200/90 dark:border-white/10 text-center space-y-6 shadow-sm flex flex-col items-center justify-center min-h-[400px]"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-blue-500/10 animate-ping absolute inset-0 m-auto" />
              <RefreshCw className="text-blue-600 dark:text-blue-400 animate-spin w-12 h-12 relative z-10" />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Gerando Arena do Simulado
              </h3>
              <p className="text-slate-600 dark:text-zinc-300 text-sm leading-relaxed">
                Configurando um conjunto exclusivo de questões no nível <strong className="font-bold capitalize text-blue-600 dark:text-blue-400">{selectedLevel}</strong> para o {vestibular}...
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs text-blue-700 dark:text-blue-300 font-bold bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-3.5 py-1.5 rounded-full mt-2">
                <Clock size={13} />
                <span>Cronômetro configurado: {totalTimeSelected} minutos</span>
              </div>
            </div>
          </motion.div>
        ) : isPlaying ? (
          /* QUIZ GAMEPLAY VIEW */
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#15171C] p-6 sm:p-10 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-lg space-y-8 relative overflow-hidden"
          >
            {/* Header with Question Count & Timer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-white/10">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 text-xs font-black uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 rounded-xl border border-blue-200/80 dark:border-blue-800/40">
                    Questão {currentIdx + 1} de {gameQuestions.length}
                  </span>
                  
                  {gameQuestions[currentIdx]?.subject && (
                    <span className="px-3 py-1 text-xs font-bold rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-zinc-300 border border-slate-200/60 dark:border-white/10">
                      {gameQuestions[currentIdx].subject}
                    </span>
                  )}
                </div>
                
                {/* Stepper Dots */}
                <div className="flex items-center gap-1.5 pt-1">
                  {gameQuestions.map((_, dotIdx) => {
                    const isCurrent = dotIdx === currentIdx;
                    const isCompleted = dotIdx < currentIdx;
                    const ans = gameAnswers[dotIdx];
                    const isCorrect = ans?.correta;
                    
                    return (
                      <div 
                        key={dotIdx}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isCurrent 
                            ? 'w-8 bg-blue-600 dark:bg-blue-500 shadow-xs' 
                            : isCompleted
                              ? isCorrect === false
                                ? 'w-2.5 bg-red-500'
                                : 'w-2.5 bg-emerald-500'
                              : 'w-2.5 bg-slate-200 dark:bg-white/10'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {totalTimeLeft !== null && (
                <div className="flex items-center gap-3 px-4 py-2.5 bg-red-50 dark:bg-red-950/30 rounded-2xl border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 self-start sm:self-auto">
                  <Hourglass size={18} className="animate-spin shrink-0" />
                  <div>
                    <p className="text-[9px] uppercase font-black text-red-400 leading-none">Tempo Restante</p>
                    <span className="font-mono text-base font-black tracking-tight leading-none pt-0.5 block">{formatTime(totalTimeLeft)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Question Text */}
            <div className="space-y-6">
              <p className="text-base sm:text-lg md:text-xl text-slate-900 dark:text-white leading-relaxed font-bold">
                {gameQuestions[currentIdx]?.text}
              </p>

              {/* Options */}
              <div className="grid grid-cols-1 gap-3 pt-2">
                {gameQuestions[currentIdx]?.options.map((opt, oIdx) => {
                  const isSelected = selectedOpt === oIdx;
                  let optionStyle = "border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#1A1D24] text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-[#20242D] hover:border-slate-300";
                  
                  if (isSelected) {
                    optionStyle = "border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20";
                  }

                  if (isAnswerSubmitted) {
                    if (oIdx === gameQuestions[currentIdx].correctAnswer) {
                      optionStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20";
                    } else if (isSelected) {
                      optionStyle = "border-red-500 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 ring-2 ring-red-500/20";
                    } else {
                      optionStyle = "opacity-40 border-slate-100 dark:border-white/5 bg-transparent text-slate-400";
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={isAnswerSubmitted}
                      onClick={() => setSelectedOpt(oIdx)}
                      className={`flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl border text-left font-medium transition-all text-sm leading-relaxed cursor-pointer disabled:cursor-default ${optionStyle}`}
                    >
                      <span className={`font-black flex items-center justify-center w-7 h-7 rounded-xl border text-xs shrink-0 mt-0.5 transition-all ${
                        isSelected 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : isAnswerSubmitted && oIdx === gameQuestions[currentIdx].correctAnswer
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : isAnswerSubmitted && isSelected
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-white dark:bg-[#15171C] border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400'
                      }`}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="flex-1 pt-0.5">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Explanation box on submit */}
            {isAnswerSubmitted && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 bg-blue-50/70 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-500/20 space-y-1.5"
              >
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                  <AlertCircle size={15} />
                  <span>Explicação da Banca Examinadora</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed font-normal">
                  {gameQuestions[currentIdx]?.explanation}
                </p>
              </motion.div>
            )}

            {/* Actions Bottom Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-100 dark:border-white/10">
              <button 
                type="button"
                onClick={() => handleFinishQuiz(false)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-white/5 font-bold transition-all text-xs cursor-pointer"
              >
                Suspender Desafio e Salvar
              </button>
              
              {!isAnswerSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={selectedOpt === null}
                  className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 text-xs sm:text-sm cursor-pointer disabled:cursor-not-allowed"
                >
                  <span>Confirmar Resposta</span>
                  <CheckCircle size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 text-xs sm:text-sm cursor-pointer"
                >
                  <span>{currentIdx + 1 < gameQuestions.length ? 'Próxima Questão' : 'Ver Resultado'}</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </motion.div>
        ) : activeTab === 'status' ? (
          /* ACTIVE CHALLENGE TAB (REDESIGNED MATCHING SCREENSHOT) */
          <motion.div 
            key="status"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {desafio ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT: MAIN CARD (2 COLS) */}
                <div className="lg:col-span-2 bg-white dark:bg-[#15171C] p-6 sm:p-8 md:p-10 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-sm space-y-6">
                  
                  {/* Card Header & Status Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                          Desafio Semanal #{desafio.semana}
                        </h3>
                      </div>
                      <p className="text-slate-500 dark:text-zinc-400 font-medium text-xs sm:text-sm">
                        Ciclo Oficial em Andamento
                      </p>
                    </div>
                    
                    <span className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider self-start sm:self-auto border ${
                      desafio.ativo 
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40' 
                        : 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/40'
                    }`}>
                      {desafio.ativo ? 'Disponível' : 'Finalizado'}
                    </span>
                  </div>

                  {/* Dates Timeline Banner */}
                  <div className="p-5 bg-slate-50 dark:bg-[#1A1D24] rounded-2xl border border-slate-200/80 dark:border-white/10 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 tracking-wider">
                          Abertura dos Portões
                        </p>
                        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-zinc-200 text-xs sm:text-sm">
                          <Calendar size={15} className="text-blue-600 dark:text-blue-400" />
                          <span>{new Date(desafio.dataInicio).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 tracking-wider">
                          Encerramento do Ciclo
                        </p>
                        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-zinc-200 text-xs sm:text-sm">
                          <Calendar size={15} className="text-red-500" />
                          <span>{new Date(desafio.dataFim).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-3/5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" />
                    </div>
                  </div>

                  {/* Participation Feedback or Start Screen */}
                  {participacao ? (
                    <div className="space-y-6 pt-2">
                      <div className="p-6 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                            <span className="text-2xl font-black">{participacao.pontos}</span>
                            <span className="text-[9px] font-bold uppercase tracking-tight -mt-1">Acertos</span>
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-bold text-base text-emerald-900 dark:text-emerald-300">
                              {participacao.pontos === 5 ? '🏆 Gabaritou! Desempenho Lendário' : participacao.pontos >= 3 ? '🌟 Excelente Trabalho!' : '📚 Boa Tentativa!'}
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed max-w-md">
                              Você completou esta semana com sucesso. Seu tempo e pontuação foram registrados no ranking geral.
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 inline-flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-bold text-xs px-3.5 py-2 rounded-xl">
                          <CheckCircle size={15} />
                          <span>CONCLUÍDO</span>
                        </div>
                      </div>

                      {/* Question review cards */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                          <Award size={15} className="text-blue-600 dark:text-blue-400" />
                          <span>Prancha de Resoluções</span>
                        </h4>
                        
                        <div className="grid grid-cols-5 gap-2.5">
                          {desafio.questoes.map((q, idx) => {
                            const ans = participacao.respostas.find(r => r.questaoId === q.id);
                            const isCorrect = ans?.correta;
                            return (
                              <div 
                                key={idx}
                                className={`p-3.5 rounded-2xl border text-center transition-all ${
                                  isCorrect 
                                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400' 
                                    : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-400'
                                }`}
                              >
                                <p className="text-[9px] uppercase font-bold text-slate-400">Q{idx + 1}</p>
                                <div className="mt-1.5 inline-flex items-center justify-center w-6 h-6 rounded-lg bg-white dark:bg-[#15171C] border text-xs font-bold leading-none shadow-2xs">
                                  {isCorrect ? '✓' : '✗'}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* LEVEL SELECTION & SMART TIMER (REDESIGNED) */
                    <div className="space-y-6 pt-2">
                      
                      {/* Section Label */}
                      <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300 flex items-center gap-2">
                          <Crown size={15} className="text-amber-500" />
                          <span>Escolha o Nível de Treinamento Semanal</span>
                        </label>
                        
                        {/* 3 LEVEL CARDS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          
                          {/* CARD 1: FÁCIL */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedLevel('facil');
                              setTotalTimeSelected(50);
                            }}
                            className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all relative overflow-hidden group cursor-pointer ${
                              selectedLevel === 'facil'
                                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20 shadow-sm'
                                : 'border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#1A1D24] hover:bg-slate-100 dark:hover:bg-[#20242D]'
                            }`}
                          >
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg ${
                                  selectedLevel === 'facil' 
                                    ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300' 
                                    : 'bg-slate-200/80 dark:bg-white/10 text-slate-600 dark:text-zinc-400'
                                }`}>
                                  Fácil
                                </span>
                                <Sparkles className={`w-4 h-4 transition-all ${selectedLevel === 'facil' ? 'text-emerald-500' : 'text-slate-400 dark:text-zinc-500'}`} />
                              </div>

                              <div>
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                                  Aquecimento
                                </h4>
                                <ul className="text-xs text-slate-500 dark:text-zinc-400 mt-2 space-y-1">
                                  <li>• 4 questões fáceis</li>
                                  <li>• 1 questão difícil especial</li>
                                </ul>
                              </div>
                            </div>

                            <div className="mt-5 pt-3 border-t border-slate-200/60 dark:border-white/5 flex justify-between items-center text-xs">
                              <span className="text-slate-400 dark:text-zinc-500">Período limite:</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">50 min</span>
                            </div>
                          </button>

                          {/* CARD 2: MÉDIO */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedLevel('medio');
                              setTotalTimeSelected(40);
                            }}
                            className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all relative overflow-hidden group cursor-pointer ${
                              selectedLevel === 'medio'
                                ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 ring-2 ring-blue-500/20 shadow-sm'
                                : 'border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#1A1D24] hover:bg-slate-100 dark:hover:bg-[#20242D]'
                            }`}
                          >
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg ${
                                  selectedLevel === 'medio' 
                                    ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300' 
                                    : 'bg-slate-200/80 dark:bg-white/10 text-slate-600 dark:text-zinc-400'
                                }`}>
                                  Médio
                                </span>
                                <Zap className={`w-4 h-4 transition-all ${selectedLevel === 'medio' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-zinc-500'}`} />
                              </div>

                              <div>
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                                  Moderado
                                </h4>
                                <ul className="text-xs text-slate-500 dark:text-zinc-400 mt-2 space-y-1">
                                  <li>• 3 questões intermédias</li>
                                  <li>• 2 questões difíceis</li>
                                </ul>
                              </div>
                            </div>

                            <div className="mt-5 pt-3 border-t border-slate-200/60 dark:border-white/5 flex justify-between items-center text-xs">
                              <span className="text-slate-400 dark:text-zinc-500">Período limite:</span>
                              <span className="text-blue-600 dark:text-blue-400 font-bold">40 min</span>
                            </div>
                          </button>

                          {/* CARD 3: DIFÍCIL */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedLevel('dificil');
                              setTotalTimeSelected(30);
                            }}
                            className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all relative overflow-hidden group cursor-pointer ${
                              selectedLevel === 'dificil'
                                ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 ring-2 ring-red-500/20 shadow-sm'
                                : 'border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#1A1D24] hover:bg-slate-100 dark:hover:bg-[#20242D]'
                            }`}
                          >
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg ${
                                  selectedLevel === 'dificil' 
                                    ? 'bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-300' 
                                    : 'bg-slate-200/80 dark:bg-white/10 text-slate-600 dark:text-zinc-400'
                                }`}>
                                  Difícil
                                </span>
                                <Trophy className={`w-4 h-4 transition-all ${selectedLevel === 'dificil' ? 'text-red-500' : 'text-slate-400 dark:text-zinc-500'}`} />
                              </div>

                              <div>
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                                  Maratona Crítica
                                </h4>
                                <ul className="text-xs text-slate-500 dark:text-zinc-400 mt-2 space-y-1">
                                  <li>• 5 questões avançadas</li>
                                  <li>• Nível olimpíada e aprofundado</li>
                                </ul>
                              </div>
                            </div>

                            <div className="mt-5 pt-3 border-t border-slate-200/60 dark:border-white/5 flex justify-between items-center text-xs">
                              <span className="text-slate-400 dark:text-zinc-500">Período limite:</span>
                              <span className="text-red-600 dark:text-red-400 font-bold">30 min</span>
                            </div>
                          </button>

                        </div>
                      </div>

                      {/* SMART TIMER INFO BANNER */}
                      <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#1A1D24] rounded-2xl border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <Clock size={18} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                              Cronômetro Automático
                            </p>
                            <p className="text-xs text-slate-600 dark:text-zinc-300 font-medium mt-0.5">
                              Determinado inteligentemente pela série selecionada.
                            </p>
                          </div>
                        </div>

                        <span className="text-xs sm:text-sm font-black text-blue-600 dark:text-blue-400 bg-white dark:bg-[#15171C] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 shadow-2xs shrink-0">
                          {totalTimeSelected} MIN
                        </span>
                      </div>

                      {/* START BUTTON */}
                      <button
                        type="button"
                        onClick={handleStartGame}
                        disabled={!desafio.ativo}
                        className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold py-4 rounded-2xl text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <Play size={18} fill="currentColor" />
                        <span>Começar Desafio Semanal ({desafio.questoes.length} Questões)</span>
                      </button>

                    </div>
                  )}

                </div>

                {/* RIGHT: LEADERBOARD PREVIEW (1 COL) */}
                <div className="bg-white dark:bg-[#15171C] p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-sm flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                      <Trophy size={16} className="text-amber-500" />
                      <span>Líderes da Semana</span>
                    </h3>

                    <div className="space-y-2.5">
                      {ranking.slice(0, 4).map((r, i) => (
                        <div 
                          key={r.usuarioId} 
                          className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                            r.usuarioId === auth.currentUser?.uid || r.usuarioId === 'guest_user' 
                              ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/40' 
                              : 'bg-slate-50 dark:bg-[#1A1D24] border-slate-200/70 dark:border-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            {i === 0 ? (
                              <Crown size={18} className="text-amber-500 shrink-0" />
                            ) : i === 1 ? (
                              <Medal size={18} className="text-slate-400 shrink-0" />
                            ) : i === 2 ? (
                              <Medal size={18} className="text-amber-700 shrink-0" />
                            ) : (
                              <span className="text-xs font-bold text-slate-400 w-4 text-center">0{i + 1}</span>
                            )}
                            
                            <div className="flex flex-col truncate">
                              <span className="font-bold text-xs text-slate-900 dark:text-zinc-100 truncate">
                                {r.usuarioNome}
                              </span>
                              {r.nivel && (
                                <span className={`text-[9px] font-bold uppercase tracking-wider ${
                                  r.nivel === 'facil' ? 'text-emerald-600 dark:text-emerald-400' :
                                  r.nivel === 'medio' ? 'text-blue-600 dark:text-blue-400' :
                                  'text-red-600 dark:text-red-400'
                                }`}>
                                  Nível {r.nivel}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="font-black text-sm text-blue-600 dark:text-blue-400">{r.pontos}</span>
                            <span className="text-[10px] text-slate-400 font-bold">/5</span>
                          </div>
                        </div>
                      ))}

                      {ranking.length === 0 && (
                        <div className="p-6 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl text-center">
                          <p className="text-xs text-slate-400 dark:text-zinc-500 font-medium">
                            Nenhum estudante completou o desafio desta semana ainda.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => setActiveTab('ranking')}
                    className="w-full py-3 rounded-xl border border-slate-200 dark:border-white/10 font-bold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-white/5 text-xs text-center transition-all cursor-pointer"
                  >
                    Ver Classificação Completa
                  </button>
                </div>

              </div>
            ) : (
              <div className="bg-white dark:bg-[#15171C] p-12 rounded-3xl border border-dashed border-slate-300 dark:border-white/15 text-center space-y-4">
                <AlertCircle size={36} className="text-amber-500 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Aguardando Abertura de Ciclo
                  </h3>
                  <p className="text-slate-500 dark:text-zinc-400 max-w-sm mx-auto text-xs sm:text-sm">
                    Não há desafios vigentes para esta temporada. Configure um novo ciclo no painel administrativo.
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={() => setActiveTab('admin')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-sm"
                >
                  Configurar Novo Ciclo
                </button>
              </div>
            )}
          </motion.div>
        ) : activeTab === 'ranking' ? (
          /* RANKING TAB */
          <motion.div 
            key="ranking"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#15171C] p-6 sm:p-8 md:p-10 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-sm space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-white/10">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <ListOrdered className="text-blue-600 dark:text-blue-400" />
                  <span>Mural da Fama</span>
                </h3>
                <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm">
                  Estudantes classificados por total de acertos e tempo de resposta.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {ranking.map((r, i) => (
                <div 
                  key={r.usuarioId} 
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    r.usuarioId === auth.currentUser?.uid || r.usuarioId === 'guest_user'
                      ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/40 shadow-xs' 
                      : 'bg-slate-50 dark:bg-[#1A1D24] border-slate-200/70 dark:border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <span className="w-8 shrink-0 flex items-center justify-center">
                      {i === 0 ? (
                        <Crown size={22} className="text-amber-500" />
                      ) : i === 1 ? (
                        <Medal size={22} className="text-slate-400" />
                      ) : i === 2 ? (
                        <Medal size={22} className="text-amber-700" />
                      ) : (
                        <span className="text-xs font-bold text-slate-400">0{i + 1}</span>
                      )}
                    </span>
                    
                    <div className="flex flex-col truncate">
                      <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {r.usuarioNome}
                      </span>
                      {r.nivel && (
                        <span className={`text-[9px] font-bold uppercase tracking-wider text-left w-fit px-2 py-0.5 mt-1 rounded ${
                          r.nivel === 'facil' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
                          r.nivel === 'medio' ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300' :
                          'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                        }`}>
                          Nível: {r.nivel}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 font-bold shrink-0">
                    <span className="text-xs text-slate-400 hidden sm:inline">
                      {new Date(r.dataParticipacao).toLocaleDateString('pt-BR')}
                    </span>
                    <div className="flex items-center gap-1 bg-white dark:bg-[#15171C] px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 shadow-2xs">
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-black">{r.pontos}</span>
                      <span className="text-[10px] text-slate-400 font-bold">/5 pts</span>
                    </div>
                  </div>
                </div>
              ))}

              {ranking.length === 0 && (
                <div className="text-center py-12 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
                  <Award size={32} className="text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-400 dark:text-zinc-500 font-medium mt-2">
                    Ainda não há participações registradas. Seja o primeiro a participar!
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* ADMIN CYCLE SIMULATION TAB */
          <motion.div 
            key="admin"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="bg-white dark:bg-[#15171C] p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Shield size={18} className="text-blue-600 dark:text-blue-400" />
                  <span>Gerenciamento do Ciclo</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  Controle para simular novos ciclos e testes pedagógicos.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-3 p-4 bg-slate-50 dark:bg-[#1A1D24] border border-slate-200/70 dark:border-white/10 rounded-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Abrir Novo Turno</span>
                  <div className="flex gap-4 items-center mt-1">
                    <label className="text-xs font-bold text-slate-600 dark:text-zinc-300">Semana:</label>
                    <input 
                      type="number" 
                      value={newWeekNum}
                      onChange={e => setNewWeekNum(Math.max(1, Number(e.target.value)))}
                      className="w-20 p-2 rounded-xl bg-white dark:bg-[#15171C] border border-slate-200 dark:border-white/10 font-bold text-xs text-center outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleCreateChallenge}
                    disabled={isGenerating}
                    className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-center text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    {isGenerating ? <RefreshCw className="animate-spin" size={14} /> : <Plus size={14} />}
                    <span>{isGenerating ? 'Gerando novas questões...' : 'Gerar e Lançar Novo Desafio'}</span>
                  </button>
                </div>

                <div className="space-y-3 p-4 bg-slate-50 dark:bg-[#1A1D24] border border-slate-200/70 dark:border-white/10 rounded-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Operações do Ciclo</span>
                  <div className="flex gap-3 mt-1">
                    <button
                      type="button"
                      onClick={handleFinalize}
                      disabled={!desafio?.ativo}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-40 cursor-pointer"
                    >
                      Trancar Semana
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Apagar Tudo
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated candidate registration */}
            <div className="bg-white dark:bg-[#15171C] p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <User size={18} className="text-blue-600 dark:text-blue-400" />
                  <span>Simular Candidatos</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  Popule concorrentes de teste para validar o ranking.
                </p>
              </div>

              <form onSubmit={handleRegisterSimulatedStudent} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Nome do Estudante</label>
                  <input 
                    type="text" 
                    value={simName}
                    onChange={e => setSimName(e.target.value)}
                    required
                    placeholder="Ex: Mariana Silva"
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-[#1A1D24] border border-slate-200 dark:border-white/10 font-medium outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Volume de Acertos</label>
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-xs bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">{simScore} de 5</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="5" 
                    step="1" 
                    value={simScore} 
                    onChange={e => setSimScore(Number(e.target.value))}
                    className="w-full accent-blue-600 mt-1 h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!desafio}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  Registrar Estudante
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
