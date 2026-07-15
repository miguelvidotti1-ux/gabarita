import React, { useState, useEffect } from 'react';
import { 
  Trophy, Award, Zap, Clock, Calendar, AlertCircle, 
  CheckCircle, XCircle, ArrowRight, Play, RefreshCw, 
  Plus, Minus, Shield, ListOrdered, User, Hourglass, Sparkles,
  Crown, Medal
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
  const [totalTimeLeft, setTotalTimeLeft] = useState<number | null>(null); // in seconds
  const [totalTimeSelected, setTotalTimeSelected] = useState(40); // standard 40 min default matching Medium level
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
        handleFinishQuiz(true); // Auto-finish on timeout
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
        // Load ranking
        const r = await weeklyChallengeService.calcularRankingSemanal(active.id);
        setRanking(r);

        // Load current user's participation
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
      console.warn("AI Question Generation for level failed, using custom local questions for level", err);
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
      // Finished all questions
      finishQuizFlow(newAns);
    }
  };

  const handleFinishQuiz = (timeout = false) => {
    if (!desafio) return;
    
    // Fill in unanswered remaining questions if timeout
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

    // Refresh ranking instantly
    const r = await weeklyChallengeService.calcularRankingSemanal(desafio.id);
    setRanking(r);
  };

  // Simulating custom week generation
  const handleCreateChallenge = async () => {
    setIsGenerating(true);
    try {
      // Dynamically load high-quality questions for this vestibular
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
        console.warn("AI Generation failed/offline, using robust fallback questions", err);
        // Copy static questions but assign unique IDs so user can do week over week
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

  // Run cycle actions
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

  // Registering mock student
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
    <div className="space-y-8 select-none">
      {/* Animated premium header banner */}
      <div className="relative bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-[2rem] p-8 md:p-10 text-white shadow-xl shadow-slate-950/20 overflow-hidden border border-indigo-500/20">
        {/* Abstract futuristic grid pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Animated fluid glow orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/30 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-fuchsia-500/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider leading-none">
              <Sparkles size={12} className="text-amber-400 animate-pulse" />
              <span>Arena Semanal de Inteligência</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200">
              Desafio Semanal
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Aceite o desafio! Uma seleção de 5 testes multidisciplinares premium projetada para levar suas capacidades interpretativas e analíticas ao limite. Acumule prestígio e reine no ranking.
            </p>
          </div>
          
          <div className="shrink-0 flex items-center justify-center md:justify-end">
            <div className="p-4 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl flex items-center gap-4 shadow-lg">
              <div className="p-3 bg-indigo-500/20 rounded-xl">
                <Trophy size={28} className="text-amber-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black tracking-widest text-indigo-300">Resgate de Prestígio</p>
                <p className="text-lg font-black text-white flex items-center gap-1">50 <span className="text-xs text-amber-400 font-bold">XP/Ptos</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern navigation tabs */}
      <div className="flex bg-slate-100/80 dark:bg-slate-950/40 p-1.5 rounded-2xl max-w-md border border-slate-200/50 dark:border-blue-950/40 backdrop-blur">
        <button 
          onClick={() => setActiveTab('status')}
          className={`flex-1 py-3 text-center rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            activeTab === 'status' 
              ? 'bg-white dark:bg-blue-900 text-blue-600 dark:text-blue-200 shadow-sm ring-1 ring-black/5 dark:ring-white/10' 
              : 'text-slate-500 hover:text-slate-800 dark:text-blue-300 dark:hover:text-blue-100'
          }`}
        >
          <Zap size={14} className={activeTab === 'status' ? 'text-amber-500 animate-pulse' : ''} />
          Desafio Atual
        </button>
        <button 
          onClick={() => setActiveTab('ranking')}
          className={`flex-1 py-3 text-center rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            activeTab === 'ranking' 
              ? 'bg-white dark:bg-blue-900 text-blue-600 dark:text-blue-200 shadow-sm ring-1 ring-black/5 dark:ring-white/10' 
              : 'text-slate-500 hover:text-slate-800 dark:text-blue-300 dark:hover:text-blue-100'
          }`}
        >
          <Award size={14} className={activeTab === 'ranking' ? 'text-indigo-400' : ''} />
          Ranking Semanal
        </button>
        <button 
          onClick={() => setActiveTab('admin')}
          className={`flex-1 py-3 text-center rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            activeTab === 'admin' 
              ? 'bg-white dark:bg-blue-900 text-blue-600 dark:text-blue-200 shadow-sm ring-1 ring-black/5 dark:ring-white/10' 
              : 'text-slate-500 hover:text-slate-800 dark:text-blue-300 dark:hover:text-blue-100'
          }`}
        >
          <Shield size={14} className={activeTab === 'admin' ? 'text-red-400' : ''} />
          Ciclo de Teste
        </button>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin" />
              <Trophy size={20} className="text-indigo-500 absolute animate-pulse" />
            </div>
            <p className="text-sm font-extrabold text-slate-500 dark:text-blue-300 uppercase tracking-widest animate-pulse">Preparando arena do desafio...</p>
          </div>
        ) : isGeneratingQuiz ? (
          <motion.div
            key="generating-quiz-spinner"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-blue-900 p-12 rounded-[2.5rem] border dark:border-blue-800 text-center space-y-6 shadow-sm flex flex-col items-center justify-center min-h-[400px]"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-ping opacity-15 absolute inset-0 m-auto" />
              <RefreshCw className="text-blue-500 animate-spin w-16 h-16 relative z-10" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-slate-800 dark:text-white">Gerando Arena de Simulado</h3>
              <p className="text-slate-500 dark:text-blue-200 max-w-sm mx-auto font-medium text-sm leading-relaxed">
                O Gemini está configurando um set exclusivo de olimpíada de nível <span className="font-extrabold capitalize text-blue-600 dark:text-blue-400">{selectedLevel}</span> para o {vestibular}...
              </p>
              <p className="text-xs text-indigo-400 font-extrabold uppercase tracking-widest bg-indigo-500/10 px-3 py-1.5 rounded-full w-fit mx-auto">
                Cronômetro de {totalTimeSelected} minutos ativo.
              </p>
            </div>
          </motion.div>
        ) : isPlaying ? (
          // Play interactive quiz directly inside
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-blue-950 p-8 md:p-12 rounded-[2rem] border border-slate-200/60 dark:border-blue-800/60 shadow-lg space-y-8 relative overflow-hidden"
          >
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-fuchsia-500" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-blue-800">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950/60 rounded-md border border-indigo-200/50 dark:border-indigo-800/30">
                    Questão {currentIdx + 1} de {gameQuestions.length}
                  </span>
                  
                  {gameQuestions[currentIdx]?.subject && (
                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-md border ${
                      gameQuestions[currentIdx].subject === 'Matemática' 
                        ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200/50' 
                        : gameQuestions[currentIdx].subject === 'Português'
                        ? 'bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-950/40 dark:text-fuchsia-300 border-fuchsia-200/50'
                        : gameQuestions[currentIdx].subject === 'História'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/50'
                        : gameQuestions[currentIdx].subject === 'Física'
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200/50'
                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/50'
                    }`}>
                      {gameQuestions[currentIdx].subject}
                    </span>
                  )}
                </div>
                
                {/* Stepper dots visualizer */}
                <div className="flex items-center gap-1.5 mt-2 pt-1">
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
                            ? 'w-8 bg-blue-500 dark:bg-blue-400 shadow-sm shadow-blue-500/50' 
                            : isCompleted
                              ? isCorrect === false
                                ? 'w-2.5 bg-red-400'
                                : 'w-2.5 bg-green-500'
                              : 'w-2.5 bg-slate-200 dark:bg-blue-900'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {totalTimeLeft !== null && (
                <div className="flex items-center gap-2.5 px-4 py-2.5 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-100 dark:border-red-900/40 text-red-600 dark:text-red-400">
                  <Hourglass size={15} className="animate-spin shrink-0" />
                  <div>
                    <p className="text-[8px] uppercase font-black text-red-400 leading-none">Tempo Restante</p>
                    <span className="font-mono text-base font-black tracking-tight leading-none pt-0.5 block">{formatTime(totalTimeLeft)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <p className="text-lg md:text-xl text-slate-800 dark:text-slate-100 leading-relaxed font-extrabold">
                {gameQuestions[currentIdx]?.text}
              </p>

              <div className="grid grid-cols-1 gap-4 pt-4">
                {gameQuestions[currentIdx]?.options.map((opt, oIdx) => {
                  const isSelected = selectedOpt === oIdx;
                  let optionStyle = "border-slate-200 dark:border-blue-900/60 bg-slate-50/50 dark:bg-blue-950/20 text-slate-700 dark:text-blue-100 hover:bg-slate-50 dark:hover:bg-blue-950/50 hover:border-slate-300 dark:hover:border-blue-800";
                  
                  if (isSelected) {
                    optionStyle = "border-blue-500 dark:border-blue-400 bg-blue-500/[0.04] dark:bg-blue-500/[0.08] text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/50";
                  }

                  if (isAnswerSubmitted) {
                    if (oIdx === gameQuestions[currentIdx].correctAnswer) {
                      optionStyle = "border-green-500 bg-green-500/10 text-green-700 dark:text-green-300 ring-2 ring-green-500";
                    } else if (isSelected) {
                      optionStyle = "border-red-500 bg-red-500/10 text-red-700 dark:text-red-300 ring-2 ring-red-500 animate-shake";
                    } else {
                      optionStyle = "opacity-50 border-slate-100 dark:border-blue-900 bg-transparent text-slate-400";
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={isAnswerSubmitted}
                      onClick={() => setSelectedOpt(oIdx)}
                      className={`flex items-start gap-4 p-5 rounded-2xl border text-left font-bold transition-all hover:scale-[1.005] active:scale-[0.995] disabled:scale-100 ${optionStyle}`}
                    >
                      <span className={`font-black flex items-center justify-center w-7 h-7 rounded-xl border text-xs shrink-0 mt-0.5 transition-all ${
                        isSelected 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : isAnswerSubmitted && oIdx === gameQuestions[currentIdx].correctAnswer
                          ? 'bg-green-600 text-white border-green-600'
                          : isAnswerSubmitted && isSelected
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-white dark:bg-blue-900 border-slate-200 dark:border-blue-800 text-slate-500'
                      }`}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="leading-relaxed pt-0.5">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-100 dark:border-blue-800">
              <button 
                onClick={() => handleFinishQuiz(false)}
                className="w-full sm:w-auto px-6 py-4 rounded-xl border border-slate-200 dark:border-blue-800/80 text-slate-600 dark:text-blue-300 hover:bg-slate-50 dark:hover:bg-blue-900/40 font-bold transition-all text-sm "
              >
                Suspender Desafio e Salvar Pontos
              </button>
              
              {!isAnswerSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOpt === null}
                  className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-350 disabled:to-slate-350 disabled:opacity-50 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
                >
                  Confirmar Escolha
                  <CheckCircle size={16} />
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/10"
                >
                  {currentIdx + 1 < gameQuestions.length ? 'Avançar Questão' : 'Ver Resultados Finais'}
                  <ArrowRight size={16} />
                </button>
              )}
            </div>

            {isAnswerSubmitted && (
              <motion.div 
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-indigo-50/50 dark:bg-blue-950/20 rounded-2xl border-2 border-dashed border-indigo-200/50 dark:border-indigo-900/50 space-y-2 mt-4"
              >
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                  <AlertCircle size={14} className="text-indigo-500" />
                  <span>Explicação da Banca Examinadora</span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                  {gameQuestions[currentIdx]?.explanation}
                </p>
              </motion.div>
            )}
          </motion.div>
        ) : activeTab === 'status' ? (
          <motion.div 
            key="status"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {desafio ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual state card of active/inactive challenge */}
                <div className="lg:col-span-2 bg-white dark:bg-blue-900/70 p-8 rounded-[2rem] border border-slate-200/60 dark:border-blue-800 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white">Desafio Semanal #{desafio.semana}</h3>
                      </div>
                      <p className="text-slate-500 dark:text-blue-300 font-bold text-sm mt-0.5">Ciclo Oficial em Andamento</p>
                    </div>
                    
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                      desafio.ativo 
                        ? 'bg-green-150 text-green-700 dark:bg-green-950/50 dark:text-green-300 border border-green-200 dark:border-green-800/30' 
                        : 'bg-red-100 text-red-700 dark:bg-red-950/55 dark:text-red-300 border border-red-200 dark:border-red-900'
                    }`}>
                      {desafio.ativo ? 'Disponível' : 'Finalizado'}
                    </span>
                  </div>

                  {/* Dates banner with timeline meter */}
                  <div className="space-y-3 p-5 bg-slate-50/50 dark:bg-blue-950/20 rounded-2xl border border-slate-200/40 dark:border-blue-950">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Abertura dos Portões</p>
                        <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-blue-200 text-sm">
                          <Calendar size={13} className="text-blue-500" />
                          <span>{new Date(desafio.dataInicio).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Encerramento do Ciclo</p>
                        <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-blue-200 text-sm">
                          <Calendar size={13} className="text-red-500 animate-pulse" />
                          <span>{new Date(desafio.dataFim).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                    {/* Visual week indicator bar */}
                    <div className="h-1.5 w-full bg-slate-200/60 dark:bg-blue-950 rounded-full overflow-hidden">
                      <div className="h-full w-3/5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
                    </div>
                  </div>

                  {/* Participation feedback */}
                  {participacao ? (
                    <div className="space-y-6">
                      {/* Visual score gauge indicator */}
                      <div className="p-6 bg-gradient-to-tr from-green-500/10 via-emerald-500/[0.03] to-transparent border border-green-500/30 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-green-500 text-white rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-lg shadow-green-500/20 border border-green-400">
                            <span className="text-2xl font-black">{participacao.pontos}</span>
                            <span className="text-[9px] font-bold uppercase tracking-tight -mt-1">Acertos</span>
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-extrabold text-lg text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
                              {participacao.pontos === 5 ? (
                                <>🏆 Gabaritou! (Lendário)</>
                              ) : participacao.pontos >= 3 ? (
                                <>🌟 Excelente Trabalho</>
                              ) : (
                                <>📚 Boa Tentativa!</>
                              )}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-emerald-300/80 leading-relaxed max-w-md">
                              Você completou esta semana com sucesso. Seu tempo de participação foi computado diretamente para os critérios de desempate do ranking.
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-2 bg-green-500/20 text-green-700 dark:text-green-300 font-black text-xs uppercase px-3 py-1.5 rounded-xl border border-green-500/30">
                          <CheckCircle size={14} />
                          CONCLUÍDO
                        </div>
                      </div>

                      {/* Display reviews of how questions went */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                          <Award size={14} className="text-indigo-500" />
                          Prancha de Resoluções Individuais
                        </h4>
                        
                        <div className="grid grid-cols-5 gap-3">
                          {desafio.questoes.map((q, idx) => {
                            const ans = participacao.respostas.find(r => r.questaoId === q.id);
                            const isCorrect = ans?.correta;
                            return (
                              <div 
                                key={idx}
                                className={`p-4 rounded-2xl border text-center font-black transition-all hover:scale-[1.03] ${
                                  isCorrect 
                                    ? 'bg-green-500/[0.04] dark:bg-green-950/20 border-green-250 dark:border-green-900/50 text-green-600 dark:text-green-400 shadow-sm shadow-green-100 dark:shadow-none' 
                                    : 'bg-red-500/[0.04] dark:bg-red-950/20 border-red-250 dark:border-red-900/50 text-red-600 dark:text-red-400 shadow-sm shadow-red-100 dark:shadow-none'
                                }`}
                              >
                                <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">Questão</p>
                                <p className="text-lg font-black mt-2 leading-none">0{idx + 1}</p>
                                <div className="mt-3 inline-flex items-center justify-center w-6 h-6 rounded-lg bg-white dark:bg-blue-900 border text-xs font-bold leading-none shadow-sm">
                                  {isCorrect ? '✓' : '✗'}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6 pt-4">
                      {/* Interactive Configuration Banner with levels */}
                      <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-indigo-200 flex items-center gap-2">
                          <Crown size={14} className="text-amber-500 animate-bounce" />
                          Escolha o Nível de Treinamento Semanal
                        </label>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Card Fácil */}
                          <button
                            onClick={() => {
                              setSelectedLevel('facil');
                              setTotalTimeSelected(50);
                            }}
                            className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all relative overflow-hidden group ${
                              selectedLevel === 'facil'
                                ? 'border-green-500 bg-green-500/[0.03] dark:bg-green-500/[0.05] ring-2 ring-green-400/50 shadow-md shadow-green-200/10'
                                : 'border-slate-200 dark:border-blue-900/60 bg-white dark:bg-blue-950/20 hover:bg-slate-50 dark:hover:bg-blue-950/40'
                            }`}
                          >
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className={`px-2.5 py-1 text-[9px] font-black tracking-widest uppercase rounded-lg ${
                                  selectedLevel === 'facil' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' : 'bg-slate-100 text-slate-500 dark:bg-blue-950/80 dark:text-blue-300'
                                }`}>
                                  Fácil
                                </span>
                                <Sparkles className={`w-4 h-4 transition-all duration-300 ${selectedLevel === 'facil' ? 'text-green-500 scale-125' : 'text-slate-300'}`} />
                              </div>
                              <div>
                                <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">Aquecimento</h4>
                                <p className="text-xs text-slate-500 dark:text-blue-300 font-medium mt-1 leading-relaxed">
                                  • 4 questões fáceis<br />
                                  • 1 questão difícil especial
                                </p>
                              </div>
                            </div>
                            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-blue-900/60 flex justify-between items-center text-xs font-bold text-slate-400">
                              <span>Período limite:</span>
                              <span className="text-green-600 dark:text-green-400 font-extrabold">50 min</span>
                            </div>
                          </button>

                          {/* Card Médio */}
                          <button
                            onClick={() => {
                              setSelectedLevel('medio');
                              setTotalTimeSelected(40);
                            }}
                            className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all relative overflow-hidden group ${
                              selectedLevel === 'medio'
                                ? 'border-blue-500 bg-blue-500/[0.03] dark:bg-blue-500/[0.05] ring-2 ring-blue-400/50 shadow-md shadow-blue-200/10'
                                : 'border-slate-200 dark:border-blue-900/60 bg-white dark:bg-blue-950/20 hover:bg-slate-50 dark:hover:bg-blue-950/40'
                            }`}
                          >
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className={`px-2.5 py-1 text-[9px] font-black tracking-widest uppercase rounded-lg ${
                                  selectedLevel === 'medio' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'bg-slate-100 text-slate-500 dark:bg-blue-950/80 dark:text-blue-300'
                                }`}>
                                  Médio
                                </span>
                                <Zap className={`w-4 h-4 transition-all duration-300 ${selectedLevel === 'medio' ? 'text-blue-500 scale-125' : 'text-slate-300'}`} />
                              </div>
                              <div>
                                <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">Moderado</h4>
                                <p className="text-xs text-slate-500 dark:text-blue-300 font-medium mt-1 leading-relaxed">
                                  • 3 questões intermédias<br />
                                  • 2 questões difíceis
                                </p>
                              </div>
                            </div>
                            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-blue-900/60 flex justify-between items-center text-xs font-bold text-slate-400">
                              <span>Período limite:</span>
                              <span className="text-blue-600 dark:text-blue-400 font-extrabold">40 min</span>
                            </div>
                          </button>

                          {/* Card Difícil */}
                          <button
                            onClick={() => {
                              setSelectedLevel('dificil');
                              setTotalTimeSelected(30);
                            }}
                            className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all relative overflow-hidden group ${
                              selectedLevel === 'dificil'
                                ? 'border-red-500 bg-red-500/[0.03] dark:bg-red-500/[0.05] ring-2 ring-red-400/50 shadow-md shadow-red-200/10'
                                : 'border-slate-200 dark:border-blue-900/60 bg-white dark:bg-blue-950/20 hover:bg-slate-50 dark:hover:bg-blue-950/40'
                            }`}
                          >
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className={`px-2.5 py-1 text-[9px] font-black tracking-widest uppercase rounded-lg ${
                                  selectedLevel === 'dificil' ? 'bg-red-100 text-red-705 dark:bg-red-950 dark:text-red-350' : 'bg-slate-100 text-slate-500 dark:bg-blue-950/80 dark:text-blue-300'
                                }`}>
                                  Difícil
                                </span>
                                <Trophy className={`w-4 h-4 transition-all duration-300 ${selectedLevel === 'dificil' ? 'text-red-500 scale-125' : 'text-slate-300'}`} />
                              </div>
                              <div>
                                <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">Maratona Crítica</h4>
                                <p className="text-xs text-slate-500 dark:text-blue-300 font-medium mt-1 leading-relaxed">
                                  • 5 questões de olimpíada ou doutorado técnico.
                                </p>
                              </div>
                            </div>
                            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-blue-900/60 flex justify-between items-center text-xs font-bold text-slate-400">
                              <span>Período limite:</span>
                              <span className="text-red-600 dark:text-red-400 font-extrabold">30 min</span>
                            </div>
                          </button>
                        </div>
                      </div>

                      <div className="bg-slate-50/50 dark:bg-blue-950/40 p-5 rounded-2xl border border-slate-200/40 dark:border-blue-800/40 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-blue-500/10 rounded-xl">
                            <Clock size={16} className="text-blue-500 shrink-0" />
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cronômetro Automatico</p>
                            <p className="text-xs font-bold text-slate-500 dark:text-blue-100 mt-0.5">Determinado inteligentemente pela série selecionada.</p>
                          </div>
                        </div>
                        <span className="text-sm font-black text-blue-600 dark:text-blue-400 bg-white dark:bg-blue-900 px-3.5 py-2 rounded-xl border dark:border-blue-800 shadow-sm leading-none">
                          {totalTimeSelected} MIN
                        </span>
                      </div>

                      <button
                        onClick={handleStartGame}
                        disabled={!desafio.ativo}
                        className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black py-4.5 rounded-2xl text-base flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 shadow-lg shadow-indigo-500/10"
                      >
                        <Play size={18} fill="currentColor" />
                        Começar Desafio Semanal ({desafio.questoes.length} Questões)
                      </button>
                    </div>
                  )}
                </div>

                {/* mini ranking preview side card */}
                <div className="bg-white dark:bg-blue-900/70 p-8 rounded-[2rem] border border-slate-200/60 dark:border-blue-800 shadow-sm flex flex-col justify-between">
                  <div className="space-y-6">
                    <h3 className="text-[15px] font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
                      <Trophy size={16} className="text-amber-500" />
                      Líderes da Semana
                    </h3>

                    <div className="space-y-3">
                      {ranking.slice(0, 3).map((r, i) => (
                        <div 
                          key={r.usuarioId} 
                          className={`flex items-center justify-between p-3.5 rounded-xl border transition-all hover:-translate-y-0.5 ${
                            r.usuarioId === auth.currentUser?.uid || r.usuarioId === 'guest_user' 
                              ? 'bg-blue-500/[0.05] border-blue-500/30' 
                              : 'bg-slate-50/50 dark:bg-blue-950/20 border-slate-100 dark:border-blue-900/10'
                          }`}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            {i === 0 ? (
                              <Crown size={15} className="text-amber-500 drop-shadow" />
                            ) : i === 1 ? (
                              <Medal size={15} className="text-slate-400 drop-shadow" />
                            ) : (
                              <Medal size={15} className="text-amber-705 drop-shadow" />
                            )}
                            
                            <div className="flex flex-col truncate">
                              <span className="font-extrabold text-xs text-slate-700 dark:text-blue-100 truncate">{r.usuarioNome}</span>
                              {r.nivel && (
                                <span className={`text-[7px] font-black uppercase tracking-wider text-left ${
                                  r.nivel === 'facil' ? 'text-green-500' :
                                  r.nivel === 'medio' ? 'text-blue-500' :
                                  'text-red-500'
                                }`}>
                                  Nível: {r.nivel}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <span className="font-black text-sm text-blue-600 dark:text-blue-400 shrink-0">{r.pontos}</span>
                            <span className="text-[10px] text-slate-400 font-extrabold">/5</span>
                          </div>
                        </div>
                      ))}

                      {ranking.length === 0 && (
                        <div className="p-6 border border-dashed border-slate-250 dark:border-blue-800 rounded-xl text-center">
                          <p className="text-[11px] text-slate-400 font-bold italic">Nenhum guerreiro registrou acertos até o momento.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveTab('ranking')}
                    className="w-full mt-6 py-3 border border-slate-200 dark:border-blue-800/80 rounded-xl font-bold text-slate-500 dark:text-blue-200 hover:bg-slate-50 dark:hover:bg-blue-950/30 text-xs text-center transition-all "
                  >
                    Ver Classificação Geral Completada
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-blue-900 p-12 rounded-[2rem] border border-dashed border-indigo-200 dark:border-blue-800 text-center space-y-6">
                <AlertCircle size={40} className="text-amber-500 mx-auto animate-pulse" />
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white">Aguardando Abertura de Ciclo</h3>
                  <p className="text-slate-500 dark:text-blue-300 max-w-sm mx-auto text-sm">
                    Não há desafios vigentes para esta temporada. Inicie a primeira semana no painel de Ciclo de Teste.
                  </p>
                </div>
                <button 
                  onClick={() => setActiveTab('admin')}
                  className="px-6 py-3.5 bg-indigo-650 hover:bg-indigo-700 text-white font-black rounded-xl text-sm transition-all"
                >
                  Configurar Novo Período
                </button>
              </div>
            )}
          </motion.div>
        ) : activeTab === 'ranking' ? (
          <motion.div 
            key="ranking"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-blue-900/60 p-8 md:p-12 rounded-[2.2rem] border border-slate-200/60 dark:border-blue-800 shadow-sm space-y-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-blue-800">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2.5">
                  <ListOrdered className="text-indigo-500" />
                  Mural da Fama
                </h3>
                <p className="text-slate-500 dark:text-blue-350 font-semibold text-sm">
                  Estudantes ordenados por acerto geral e melhor tempo de resposta.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {ranking.map((r, i) => (
                <div 
                  key={r.usuarioId} 
                  className={`flex items-center justify-between p-4.5 rounded-2xl border transition-all ${
                    r.usuarioId === auth.currentUser?.uid || r.usuarioId === 'guest_user'
                      ? 'bg-blue-500/[0.04] border-blue-500/30 shadow-sm' 
                      : 'bg-slate-50/50 dark:bg-blue-950 border-slate-100 dark:border-blue-900/30'
                  }`}
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <span className="w-8 shrink-0 flex items-center justify-center">
                      {i === 0 ? (
                        <Crown size={20} className="text-amber-500 drop-shadow-[0_2px_4px_rgba(245,158,11,0.3)]" />
                      ) : i === 1 ? (
                        <Medal size={20} className="text-slate-400 drop-shadow-[0_2px_4px_rgba(148,163,184,0.3)]" />
                      ) : i === 2 ? (
                        <Medal size={20} className="text-amber-700 drop-shadow-[0_2px_4px_rgba(180,83,9,0.3)]" />
                      ) : (
                        <span className="text-xs font-black text-slate-400">0{i + 1}</span>
                      )}
                    </span>
                    
                    <div className="flex flex-col truncate">
                      <span className="font-extrabold text-sm text-slate-800 dark:text-white truncate">{r.usuarioNome}</span>
                      {r.nivel && (
                        <span className={`text-[8px] font-black uppercase tracking-wider text-left w-fit px-2 py-0.5 mt-1 rounded ${
                          r.nivel === 'facil' ? 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300' :
                          r.nivel === 'medio' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' :
                          'bg-red-150 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                        }`}>
                          Nível: {r.nivel}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 font-bold shrink-0">
                    <span className="text-[11px] text-slate-400 font-extrabold uppercase tracking-wide hidden sm:inline">
                      {new Date(r.dataParticipacao).toLocaleDateString('pt-BR')}
                    </span>
                    <div className="flex items-center gap-1 bg-white dark:bg-blue-900 px-3 py-1.5 rounded-xl border dark:border-blue-800 shadow-sm">
                      <span className="text-indigo-600 dark:text-indigo-400 text-sm font-black">{r.pontos}</span>
                      <span className="text-[10px] text-slate-400 font-extrabold">/5 Ptos</span>
                    </div>
                  </div>
                </div>
              ))}

              {ranking.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-blue-800 rounded-3xl">
                  <Award size={36} className="text-slate-300 mx-auto" />
                  <p className="text-sm text-slate-400 font-bold italic mt-3">Ainda não há participações registradas. Quebre a inércia!</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          // Admin simulated actions for debugging & resetting cycles
          <motion.div 
            key="admin"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="bg-white dark:bg-blue-900/60 p-8 rounded-[2rem] border border-slate-200/60 dark:border-blue-800 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <Shield size={18} className="text-indigo-500" />
                  Gerenciamento do Ciclo
                </h3>
                <p className="text-sm text-slate-500 dark:text-blue-300 font-medium">
                  Controle administrativo para simular a mudança de ciclo sem comprometer dados reais.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2 p-5 bg-slate-50/50 dark:bg-blue-950/20 border border-slate-200/40 dark:border-blue-800/50 rounded-2xl">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Abrir Novo Turno</span>
                  <div className="flex gap-4 items-center mt-2">
                    <label className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-blue-350">Semana Alvo:</label>
                    <input 
                      type="number" 
                      value={newWeekNum}
                      onChange={e => setNewWeekNum(Math.max(1, Number(e.target.value)))}
                      className="w-18 p-2 rounded-lg bg-white dark:bg-blue-950 border dark:border-blue-800 font-black text-sm text-center"
                    />
                  </div>
                  <button
                    onClick={handleCreateChallenge}
                    disabled={isGenerating}
                    className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 px-4 rounded-xl text-center text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    {isGenerating ? <RefreshCw className="animate-spin" size={13} /> : <Plus size={13} />}
                    {isGenerating ? 'Gemini está desenhando as questões...' : 'Gerar e Lançar Novo Desafio'}
                  </button>
                </div>

                <div className="space-y-3 p-5 bg-slate-50/50 dark:bg-blue-950/20 border border-slate-200/40 dark:border-blue-800/50 rounded-2xl">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Operações do Servidor</span>
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={handleFinalize}
                      disabled={!desafio?.ativo}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all disabled:opacity-40"
                    >
                      Trancar Semana
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all"
                    >
                      Apagar Tudo
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated candidate registry */}
            <div className="bg-white dark:bg-blue-900/60 p-8 rounded-[2rem] border border-slate-200/60 dark:border-blue-800 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <User size={18} className="text-blue-500" />
                  Simular Auditório
                </h3>
                <p className="text-sm text-slate-500 dark:text-blue-300 font-medium">
                  Popule concorrentes dinâmicos para auditar as recalibrações do Mural da Fama.
                </p>
              </div>

              <form onSubmit={handleRegisterSimulatedStudent} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pseudônimo ou Cadastro</label>
                  <input 
                    type="text" 
                    value={simName}
                    onChange={e => setSimName(e.target.value)}
                    required
                    placeholder="Ex: Pedro Henrique"
                    className="w-full px-4 py-3 text-sm rounded-xl bg-slate-50/50 dark:bg-blue-950 border border-slate-200/40 dark:border-blue-800 font-bold"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Volume de Acertos</label>
                    <span className="text-blue-600 dark:text-blue-400 font-black text-xs bg-blue-100 dark:bg-blue-950 px-2 py-1 rounded border dark:border-blue-800">{simScore} de 5</span>
                  </div>
                  <input 
                    type="range" 
                    min="0"
                    max="5"
                    step="1"
                    value={simScore}
                    onChange={e => setSimScore(Number(e.target.value))}
                    className="w-full accent-blue-600 mt-2 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!desafio}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4.5 rounded-xl text-center text-xs tracking-wider uppercase transition-all disabled:opacity-50 mt-4 shadow-sm"
                >
                  Confirmar Inclusão Amostral
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
