import { useState, useRef, useMemo } from 'react';
import { Vestibular } from '../types';
import { VESTIBULARES_DATA } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { 
  BookOpen, ArrowRight, Book, X, Loader2, Share2, Download, 
  Plus, Minus, Search, Target, Zap, GraduationCap, Sparkles, User
} from 'lucide-react';
import { generateStudyMaterial, StudyMaterial, generateQuestions, Question } from '../services/geminiService';
import { missionEngine } from '../services/missionService';
import { auth } from '../firebase';
import { achievementService } from '../services/achievementService';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import LigacoesQuimicasMindMap from './LigacoesQuimicasMindMap';
import ChemistryVideoModal from './ChemistryVideoModal';

const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string; btn: string; chartColors: string[] }> = {
  'Matemática': { 
    bg: 'bg-blue-50 dark:bg-blue-950/50', 
    text: 'text-blue-600 dark:text-blue-400', 
    border: 'border-blue-200/80 dark:border-blue-500/30', 
    btn: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20',
    chartColors: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd']
  },
  'Física': { 
    bg: 'bg-indigo-50 dark:bg-indigo-950/50', 
    text: 'text-indigo-600 dark:text-indigo-400', 
    border: 'border-indigo-200/80 dark:border-indigo-500/30', 
    btn: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20',
    chartColors: ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc']
  },
  'Química': { 
    bg: 'bg-cyan-50 dark:bg-cyan-950/50', 
    text: 'text-cyan-600 dark:text-cyan-400', 
    border: 'border-cyan-200/80 dark:border-cyan-500/30', 
    btn: 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-500/20',
    chartColors: ['#0891b2', '#06b6d4', '#22d3ee', '#67e8f9']
  },
  'Biologia': { 
    bg: 'bg-emerald-50 dark:bg-emerald-950/50', 
    text: 'text-emerald-600 dark:text-emerald-400', 
    border: 'border-emerald-200/80 dark:border-emerald-500/30', 
    btn: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20',
    chartColors: ['#059669', '#10b981', '#34d399', '#6ee7b7']
  },
  'Português': { 
    bg: 'bg-rose-50 dark:bg-rose-950/50', 
    text: 'text-rose-600 dark:text-rose-400', 
    border: 'border-rose-200/80 dark:border-rose-500/30', 
    btn: 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20',
    chartColors: ['#e11d48', '#f43f5e', '#fb7185', '#fda4af']
  },
  'Literatura': { 
    bg: 'bg-pink-50 dark:bg-pink-950/50', 
    text: 'text-pink-600 dark:text-pink-400', 
    border: 'border-pink-200/80 dark:border-pink-500/30', 
    btn: 'bg-pink-600 hover:bg-pink-700 shadow-pink-500/20',
    chartColors: ['#db2777', '#ec4899', '#f472b6', '#fbcfe8']
  },
  'História': { 
    bg: 'bg-amber-50 dark:bg-amber-950/50', 
    text: 'text-amber-600 dark:text-amber-400', 
    border: 'border-amber-200/80 dark:border-amber-500/30', 
    btn: 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20',
    chartColors: ['#d97706', '#f59e0b', '#fbbf24', '#fde68a']
  },
  'Geografia': { 
    bg: 'bg-orange-50 dark:bg-orange-950/50', 
    text: 'text-orange-600 dark:text-orange-400', 
    border: 'border-orange-200/80 dark:border-orange-500/30', 
    btn: 'bg-orange-600 hover:bg-orange-700 shadow-orange-500/20',
    chartColors: ['#ea580c', '#f97316', '#fb923c', '#fdba74']
  },
  'Sociologia': { 
    bg: 'bg-violet-50 dark:bg-violet-950/50', 
    text: 'text-violet-600 dark:text-violet-400', 
    border: 'border-violet-200/80 dark:border-violet-500/30', 
    btn: 'bg-violet-600 hover:bg-violet-700 shadow-violet-500/20',
    chartColors: ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd']
  },
  'English': { 
    bg: 'bg-sky-50 dark:bg-sky-950/50', 
    text: 'text-sky-600 dark:text-sky-400', 
    border: 'border-sky-200/80 dark:border-sky-500/30', 
    btn: 'bg-sky-600 hover:bg-sky-700 shadow-sky-500/20',
    chartColors: ['#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc']
  },
  'Filosofia': { 
    bg: 'bg-purple-50 dark:bg-purple-950/50', 
    text: 'text-purple-600 dark:text-purple-400', 
    border: 'border-purple-200/80 dark:border-purple-500/30', 
    btn: 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20',
    chartColors: ['#9333ea', '#a855f7', '#c084fc', '#e9d5ff']
  },
  'Artes': { 
    bg: 'bg-teal-50 dark:bg-teal-950/50', 
    text: 'text-teal-600 dark:text-teal-400', 
    border: 'border-teal-200/80 dark:border-teal-500/30', 
    btn: 'bg-teal-600 hover:bg-teal-700 shadow-teal-500/20',
    chartColors: ['#0d9488', '#14b8a6', '#2dd4bf', '#99f6e4']
  }
};

const getSubjectStyles = (subject: string) => {
  return SUBJECT_COLORS[subject] || { 
    bg: 'bg-slate-50 dark:bg-white/5', 
    text: 'text-slate-700 dark:text-zinc-300', 
    border: 'border-slate-200 dark:border-white/10', 
    btn: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20',
    chartColors: ['#3b82f6', '#6366f1', '#06b6d4', '#10b981']
  };
};

const VestibularContents: {
  data: Record<string, Record<string, string[]>>,
  buscarConteudos: (args: { vestibular?: string, materia?: string, palavraChave?: string }) => { vestibular: string, materia: string, topicos: string[] }[],
  exportarParaApp: () => string
} = {
  data: {
    ENEM: {
      Quimica: ['Ligações químicas', 'Funções orgânicas', 'Estequiometria', 'Soluções', 'pH e pOH', 'Reações químicas', 'Eletroquímica', 'Química ambiental', 'Petróleo e polímeros', 'Separação de misturas'],
      Fisica: ['Cinemática', 'Leis de Newton', 'Trabalho e energia', 'Potência', 'Calorimetria', 'Ondulatória', 'Eletricidade básica', 'Circuitos elétricos', 'Pressão e hidrostática', 'Óptica'],
      Biologia: ['Ecologia', 'Cadeia alimentar', 'Genética', 'DNA e RNA', 'Evolução', 'Citologia', 'Sistema imunológico', 'Fisiologia humana', 'Biotecnologia', 'Ciclos biogeoquímicos'],
      Matematica: ['Funções (1º e 2º grau)', 'Porcentagem', 'Razão e proporção', 'Regra de três', 'Estatística', 'Probabilidade', 'Geometria plana', 'Geometria espacial', 'Escala', 'Análise de gráficos'],
      Historia: ['Brasil Colônia', 'Escravidão', 'Independência do Brasil', 'Brasil República', 'Era Vargas', 'Ditadura militar', 'Revolução Industrial', 'Imperialismo', 'Guerras Mundiais', 'Guerra Fria'],
      Geografia: ['Globalização', 'Geopolítica', 'Urbanização', 'Industrialização', 'Questões ambientais', 'Energia', 'Agricultura', 'Demografia', 'Cartografia', 'Clima'],
      Sociologia: ['Cultura', 'Cidadania', 'Movimentos sociais', 'Desigualdade social', 'Poder e política', 'Trabalho e sociedade', 'Globalização', 'Ideologia', 'Indústria cultural', 'Controle social'],
      Filosofia: ['Mito e filosofia', 'Sócrates, Platão e Aristóteles', 'Ética', 'Moral', 'Política', 'Contratualismo', 'Iluminismo', 'Existencialismo', 'Filosofia moderna', 'Filosofia contemporânea'],
      Artes: ['Barroco', 'Romantismo', 'Realismo', 'Modernismo', 'Arte Contemporânea']
    },
    FUVEST: {
      Matematica: ['Funções', 'Limites', 'Derivadas'],
      Fisica: ['Cinemática', 'Dinâmica', 'Óptica'],
      Portugues: ['Interpretação de texto', 'Gramática', 'Literatura'],
      Artes: ['Barroco', 'Romantismo', 'Realismo', 'Modernismo', 'Arte Contemporânea']
    },
    UNICAMP: {
      Matematica: ['Matrizes', 'Vetores', 'Análise Combinatória'],
      Quimica: ['Cinética Química', 'Equilíbrio', 'Eletroquímica'],
      Historia: ['Brasil Colonial', 'República', 'Ditadura Militar'],
      Artes: ['Barroco', 'Romantismo', 'Realismo', 'Modernismo', 'Arte Contemporânea']
    },
    UERJ: {
      Matematica: ['Geometria Analítica', 'Sequências'],
      Biologia: ['Evolução', 'Citologia'],
      Geografia: ['Urbanização', 'Meio Ambiente']
    },
    ITA: {
      Matematica: ['Cálculo Diferencial', 'Integral', 'Equações Diferenciais'],
      Fisica: ['Relatividade', 'Quântica', 'Eletromagnetismo']
    },
    UNESP: {
      Matematica: ['Polinômios', 'Logaritmos'],
      Quimica: ['Inorgânica', 'Termoquímica'],
      Sociologia: ['Estrutura Social', 'Desigualdades'],
      Artes: ['Barroco', 'Romantismo', 'Realismo', 'Modernismo', 'Arte Contemporânea']
    }
  },

  buscarConteudos: function({ vestibular, materia, palavraChave }) {
    const resultados: { vestibular: string, materia: string, topicos: string[] }[] = [];
    const chaves = Object.keys(this.data);

    for (const vest of chaves) {
      if (vestibular && vest !== vestibular) continue;

      const materias = this.data[vest];
      const matKeys = Object.keys(materias);

      for (const mat of matKeys) {
        if (materia && mat !== materia) continue;

        const topicos = materias[mat];
        let match = true;

        if (palavraChave) {
          match = topicos.some(topico => 
            topico.toLowerCase().includes(palavraChave.toLowerCase()) ||
            mat.toLowerCase().includes(palavraChave.toLowerCase()) ||
            vest.toLowerCase().includes(palavraChave.toLowerCase())
          );
        }

        if (match) {
          resultados.push({ vestibular: vest, materia: mat, topicos });
        }
      }
    }
    return resultados;
  },

  exportarParaApp: function() {
    return JSON.stringify(this.data, null, 2);
  }
};

export default function Conteudos({ vestibular, onStartQuiz }: { vestibular: Vestibular, onStartQuiz: (questions: Question[], isFull: boolean, timeLimit?: number) => void }) {
  const data = VESTIBULARES_DATA[vestibular] || [];
  const [selectedSubject, setSelectedSubject] = useState<{ subject: string; topics: string[] } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const searchResults = useMemo(() => {
    if (!searchQuery) return null;
    return VestibularContents.buscarConteudos({ vestibular, palavraChave: searchQuery });
  }, [vestibular, searchQuery]);

  const [loading, setLoading] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);
  const [material, setMaterial] = useState<StudyMaterial[] | null>(null);
  const [loadingTopic, setLoadingTopic] = useState<string | null>(null);
  const [loadingQuizTopic, setLoadingQuizTopic] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [totalTimeLimit, setTotalTimeLimit] = useState(0);
  const [showChemistryVideoModal, setShowChemistryVideoModal] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleGenerateRecommendation = async () => {
    setLoadingRecommendation(true);
    try {
      const response = await fetch("/api/gemini/recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            vestibular,
            performanceData: {}
        }),
      });
      const resData = await response.json();
      alert(`Plano sugerido: ${resData.plan}`);
    } catch (error) {
      console.error("Erro ao gerar recomendação:", error);
      alert("Houve um erro ao gerar a recomendação. Tente novamente.");
    } finally {
      setLoadingRecommendation(false);
    }
  };

  const handleVerResumos = async (subject: string, topics: string[]) => {
    setSelectedSubject({ subject, topics });
    setLoading(true);
    try {
      const result = await generateStudyMaterial(vestibular, subject, topics);
      
      const updatedResult = result.map(item => {
        const topicData = data.find(s => s.subject === subject)?.topics.find(t => t.name === item.topicName);
        return {
          ...item,
          staticMindMapUrl: topicData?.mindMapUrl
        };
      });
      
      setMaterial(updatedResult);
      
      missionEngine.getMissionsForToday().forEach(m => {
        if (m.type === 'review' && (m.topic === subject || m.topic === 'review')) {
          missionEngine.updateProgress(m.id, 1);
        }
      });

      if (auth.currentUser) {
        achievementService.trackActivity(auth.currentUser.uid, 'leituras', 1);
      }
    } catch (error) {
      console.error("Erro ao gerar material:", error);
      alert("Houve um erro ao gerar o material de estudo. Tente novamente.");
      setSelectedSubject(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTopicMaterial = async (subject: string, topicName: string) => {
    setLoadingTopic(topicName);
    setSelectedSubject({ subject, topics: [topicName] });
    setLoading(true);
    try {
      const result = await generateStudyMaterial(vestibular, subject, [topicName]);
      
      const topicData = data.find(s => s.subject === subject)?.topics.find(t => t.name === topicName);
      const updatedResult = result.map(item => ({
        ...item,
        staticMindMapUrl: topicData?.mindMapUrl
      }));
      
      setMaterial(updatedResult);
      
      missionEngine.getMissionsForToday().forEach(m => {
        if (m.type === 'review' && (m.topic === subject || m.topic === 'review')) {
          missionEngine.updateProgress(m.id, 1);
        }
      });

      if (auth.currentUser) {
        achievementService.trackActivity(auth.currentUser.uid, 'leituras', 1);
      }
    } catch (error) {
      console.error("Erro ao gerar material:", error);
      alert("Houve um erro ao gerar o material de estudo. Tente novamente.");
      setSelectedSubject(null);
    } finally {
      setLoading(false);
      setLoadingTopic(null);
    }
  };

  const handleGenerateTopicQuiz = async (subject: string, topicName: string) => {
    setLoadingQuizTopic(topicName);
    try {
      const questions = await generateQuestions(vestibular, { [`${subject}: ${topicName}`]: { count: 5, difficulty: 'médio' } });
      const totalTime = totalTimeLimit > 0 ? totalTimeLimit * 60 : undefined;
      onStartQuiz(questions, false, totalTime);
    } catch (error) {
      console.error("Erro ao gerar quiz do tópico:", error);
      alert("Houve um erro ao gerar as questões. Tente novamente.");
    } finally {
      setLoadingQuizTopic(null);
    }
  };

  const handleStartRandomQuiz = async () => {
    setLoadingQuiz(true);
    try {
      const subjects = data.map(s => s.subject);
      const randomSubjects = subjects.sort(() => 0.5 - Math.random()).slice(0, 3);
      const questions = await generateQuestions(vestibular, randomSubjects.reduce((acc, s) => ({ ...acc, [s]: { count: 5, difficulty: 'médio' } }), {}));
      const totalTime = totalTimeLimit > 0 ? totalTimeLimit * 60 : undefined;
      onStartQuiz(questions, false, totalTime);
    } catch (error) {
      console.error("Erro ao gerar quiz:", error);
      alert("Houve um erro ao gerar o quiz. Tente novamente.");
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!contentRef.current || isDownloading) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(contentRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Material_Estudo_${selectedSubject?.subject || 'Vestibular'}.pdf`);
    } catch (error) {
      console.error("Erro ao baixar PDF:", error);
      alert("Houve um erro ao gerar o PDF. Tente novamente.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-8 select-none max-w-7xl mx-auto font-sans transition-colors duration-200">
      
      {/* HEADER HERO BANNER */}
      <div className="p-6 sm:p-8 md:p-10 rounded-3xl bg-white dark:bg-[#15171C] border border-slate-200/90 dark:border-white/10 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="space-y-3.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Target size={14} className="text-blue-600 dark:text-blue-400" />
              <span>Análise Estatística 2026</span>
            </div>

            <button 
              type="button"
              onClick={handleGenerateRecommendation}
              disabled={loadingRecommendation}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200/80 dark:border-emerald-500/30 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
            >
              {loadingRecommendation ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              <span>Recomendação IA</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            O que você{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              realmente
            </span>{' '}
            precisa estudar
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 max-w-xl leading-relaxed">
            Mapeamos os conteúdos mais recorrentes do <strong className="font-bold text-slate-900 dark:text-white">{vestibular}</strong> para direcionar seu esforço onde ele traz mais resultado.
          </p>
        </div>
        
        {/* SEARCH BAR & SOCIAL PROOF */}
        <div className="w-full lg:w-auto space-y-3.5 shrink-0">
          <div className="relative group w-full lg:w-88">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Ex: 'Óptica', 'Matemática', 'Geometria'..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-[#1A1D24] border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-xs sm:text-sm"
            />
          </div>

          <div className="flex items-center gap-3 px-1">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full border-2 border-white dark:border-[#15171C] bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-300 shadow-2xs">
                <User size={13} />
              </div>
              <div className="w-7 h-7 rounded-full border-2 border-white dark:border-[#15171C] bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-300 shadow-2xs">
                <User size={13} />
              </div>
              <div className="w-7 h-7 rounded-full border-2 border-white dark:border-[#15171C] bg-cyan-100 dark:bg-cyan-900/60 flex items-center justify-center text-cyan-600 dark:text-cyan-300 shadow-2xs">
                <User size={13} />
              </div>
            </div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              Usado por +10k estudantes hoje
            </p>
          </div>
        </div>
      </div>

      {/* SEARCH RESULTS OVERLAY/SECTION */}
      {searchResults && (
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white dark:bg-[#15171C] p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-white/10 space-y-6 shadow-sm"
          >
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-white/10">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                <Search size={18} className="text-blue-600 dark:text-blue-400" />
                <span>Resultados Encontrados ({searchResults.length})</span>
              </h3>
              <button 
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                title="Limpar busca"
              >
                <X size={18} />
              </button>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((res, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-slate-50/60 dark:bg-[#1A1D24] p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 hover:border-blue-500/40 transition-all space-y-3"
                  >
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider truncate">{res.materia}</span>
                      <span className="text-[10px] font-black bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40 px-2 py-0.5 rounded-md shrink-0">{res.vestibular}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {res.topicos.map((topico, j) => (
                        <button 
                          key={j}
                          type="button"
                          onClick={() => handleGenerateTopicMaterial(res.materia, topico)}
                          className="text-xs font-bold text-slate-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-[#15171C] hover:bg-blue-50 dark:hover:bg-blue-950/40 px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-white/10 transition-all truncate max-w-full flex items-center gap-1.5 cursor-pointer group/btn"
                          title={topico}
                        >
                          <Zap size={10} className="text-blue-500 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                          <span className="truncate">{topico}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 space-y-3">
                <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-slate-400 dark:text-zinc-500">
                  <Book size={22} />
                </div>
                <p className="text-slate-500 dark:text-zinc-400 text-sm font-bold">Nenhum conteúdo encontrado para "{searchQuery}".</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* SUBJECTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {data.map((subject, i) => {
          const styles = getSubjectStyles(subject.subject);
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-[#15171C] rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div className="p-6 sm:p-8 space-y-6 flex-1">
                
                {/* Header with Title and Donut Chart */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1.5">
                    <div className={`w-12 h-12 ${styles.bg} ${styles.text} ${styles.border} border rounded-2xl flex items-center justify-center mb-3 shadow-2xs`}>
                      <BookOpen size={22} />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      {subject.subject}
                    </h3>
                    <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                      Temas Recorrentes
                    </p>
                  </div>
                  
                  {/* CHART GAUGE */}
                  <div className="relative w-20 h-20 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={subject.topics}
                          cx="50%"
                          cy="50%"
                          innerRadius={26}
                          outerRadius={38}
                          paddingAngle={3}
                          dataKey="percentage"
                          stroke="none"
                        >
                          {subject.topics.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={styles.chartColors[index % styles.chartColors.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <Zap size={13} className={styles.text} />
                    </div>
                  </div>
                </div>

                {/* Topics List */}
                <div className="space-y-6 pt-2">
                  {subject.topics.map((topic, j) => (
                    <div key={j} className="relative pl-5 border-l-2 border-slate-200 dark:border-white/10 group/topic space-y-2.5">
                      <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500 ring-4 ring-white dark:ring-[#15171C]"></div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-base sm:text-lg text-slate-900 dark:text-white group-hover/topic:text-blue-600 dark:group-hover/topic:text-blue-400 transition-colors">
                            {topic.name}
                          </span>
                          <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/40 px-2 py-0.5 rounded-md text-[11px] font-black">
                            {topic.percentage}%
                          </span>
                        </div>
                        
                        {/* Quick Topic Actions */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {topic.mindMapUrl && (
                            <button 
                              type="button"
                              onClick={() => {
                                setSelectedSubject({ subject: subject.subject, topics: [topic.name] });
                                setMaterial([{
                                  topicName: topic.name,
                                  summary: topic.summary,
                                  mindMap: { label: topic.name, children: [] },
                                  staticMindMapUrl: topic.mindMapUrl
                                }]);
                              }}
                              className="text-[11px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 px-2.5 py-1 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/60 flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Share2 size={11} />
                              <span>Mapa</span>
                            </button>
                          )}
                          <button 
                            type="button"
                            onClick={() => handleGenerateTopicMaterial(subject.subject, topic.name)}
                            disabled={loadingTopic === topic.name}
                            className="text-[11px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40 px-2.5 py-1 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/60 flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {loadingTopic === topic.name ? <Loader2 size={11} className="animate-spin" /> : <BookOpen size={11} />}
                            <span>Resumo</span>
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleGenerateTopicQuiz(subject.subject, topic.name)}
                            disabled={loadingQuizTopic === topic.name}
                            className="text-[11px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40 px-2.5 py-1 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/60 flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {loadingQuizTopic === topic.name ? <Loader2 size={11} className="animate-spin" /> : <Zap size={11} />}
                            <span>Quiz</span>
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed italic line-clamp-2">
                        "{topic.summary}"
                      </p>
                      
                      <div className="relative h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${topic.percentage}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD FOOTER ACTION */}
              <div className="p-5 sm:p-6 bg-slate-50/70 dark:bg-[#1A1D24] border-t border-slate-100 dark:border-white/10">
                <button 
                  type="button"
                  onClick={() => handleVerResumos(subject.subject, subject.topics.map(t => t.name))}
                  className={`w-full py-3.5 rounded-xl ${styles.btn} text-white font-bold text-sm sm:text-base hover:opacity-95 active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer`}
                >
                  <GraduationCap size={18} />
                  <span>Caminho Completo da Aprovação</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* STUDY MATERIAL MODAL */}
      <AnimatePresence>
        {selectedSubject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-[#15171C] w-full max-w-5xl max-h-[90vh] rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-slate-50/70 dark:bg-[#1A1D24]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      Material de Estudo: {selectedSubject.subject}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Resumos e Mapas Mentais gerados por IA
                    </p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => { setSelectedSubject(null); setMaterial(null); }}
                  className="p-2 hover:bg-slate-200/60 dark:hover:bg-white/10 rounded-xl transition-colors text-slate-500 dark:text-zinc-400 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-10" ref={contentRef}>
                {loading ? (
                  <div className="h-64 flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin" />
                    <p className="text-slate-600 dark:text-zinc-400 text-xs uppercase tracking-wider font-bold animate-pulse">
                      Gerando seu material personalizado...
                    </p>
                  </div>
                ) : material ? (
                  material.map((item, idx) => (
                    <div key={idx} className="space-y-6 pb-8 border-b last:border-0 border-slate-100 dark:border-white/10">
                      <div className="space-y-3">
                        <h3 className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">
                          {item.topicName}
                        </h3>
                        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-zinc-300 leading-relaxed text-sm">
                          <ReactMarkdown>{item.summary}</ReactMarkdown>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {(item.staticMindMapUrl === 'custom_ligacoes_quimicas' || item.topicName.toLowerCase().includes('ligações') || item.topicName.toLowerCase().includes('ligacoes')) && (
                          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-sky-600/20 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                                <Sparkles size={20} />
                              </div>
                              <div>
                                <h5 className="text-sm font-black text-slate-800 dark:text-white">Vídeo-Aula Exclusiva: Ligações Químicas</h5>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Assista à aula interativa com slides explicativos e regra do octeto.</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setShowChemistryVideoModal(true)}
                              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                            >
                              <span>Assistir Vídeo-Aula</span>
                              <ArrowRight size={14} />
                            </button>
                          </div>
                        )}

                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
                          <Share2 className="text-blue-600 dark:text-blue-400" size={16} />
                          <span>Mapa Mental Explicativo</span>
                        </h4>
                        
                        {(item.staticMindMapUrl === 'custom_ligacoes_quimicas' || item.topicName.toLowerCase().includes('ligações') || item.topicName.toLowerCase().includes('ligacoes')) ? (
                          <LigacoesQuimicasMindMap />
                        ) : item.staticMindMapUrl ? (
                          <div className="bg-slate-50 dark:bg-[#1A1D24] rounded-2xl p-4 border border-slate-200/80 dark:border-white/10 overflow-hidden">
                            <img 
                              src={item.staticMindMapUrl} 
                              alt={`Mapa Mental de ${item.topicName}`} 
                              className="w-full h-auto rounded-xl shadow-xs"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ) : (
                          <div className="bg-slate-50 dark:bg-[#1A1D24] rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10">
                            <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
                              <div className="relative z-10">
                                <div className="bg-blue-600 text-white px-6 py-3.5 rounded-xl font-bold text-sm text-center shadow-md shadow-blue-600/20 min-w-[180px]">
                                  {item.mindMap.label}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full lg:w-auto">
                                {item.mindMap.children.map((child, cIdx) => (
                                  <div key={cIdx} className="bg-white dark:bg-[#15171C] p-4 rounded-xl border border-slate-200/80 dark:border-white/10 shadow-xs space-y-1">
                                    <h5 className="font-bold text-xs text-blue-600 dark:text-blue-400">{child.label}</h5>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400 leading-tight">{child.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : null}
              </div>

              <div className="p-5 sm:p-6 border-t border-slate-100 dark:border-white/10 bg-slate-50/70 dark:bg-[#1A1D24] flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-xs text-slate-500 dark:text-zinc-400 italic text-center sm:text-left">
                  Este material foi gerado por IA e deve ser usado como apoio aos seus estudos.
                </p>
                <div className="flex gap-2.5 w-full sm:w-auto">
                  <button 
                    type="button"
                    onClick={handleDownloadPDF}
                    disabled={isDownloading || loading}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 font-bold hover:bg-white dark:hover:bg-[#15171C] transition-all disabled:opacity-50 text-xs cursor-pointer"
                  >
                    {isDownloading ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Download size={15} />
                    )}
                    <span>PDF</span>
                  </button>
                  <button 
                    type="button"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-sm text-xs cursor-pointer"
                  >
                    <Share2 size={15} />
                    <span>Compartilhar</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DYNAMIC QUIZZES PROMO CARD */}
      <div className="relative overflow-hidden bg-slate-900 dark:bg-[#15171C] rounded-3xl p-6 sm:p-8 md:p-10 text-white border border-slate-800 dark:border-white/10 shadow-xl">
        <div className="relative flex flex-col lg:flex-row justify-between items-center gap-8 text-center lg:text-left">
          <div className="max-w-2xl space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">Quizzes Dinâmicos</h3>
              <div className="flex items-center gap-3 bg-white/10 border border-white/15 px-3.5 py-1.5 rounded-xl">
                <span className="text-[10px] font-black text-blue-300 uppercase tracking-wider leading-none">Tempo</span>
                <div className="flex items-center gap-3">
                  <button 
                    type="button"
                    onClick={() => setTotalTimeLimit(Math.max(0, totalTimeLimit - 5))}
                    className="p-1 hover:bg-white/10 rounded text-white transition-colors cursor-pointer"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="text-xs font-black text-white min-w-[3.5rem] text-center">
                    {totalTimeLimit === 0 ? 'ILIMITADO' : `${totalTimeLimit} MIN`}
                  </span>
                  <button 
                    type="button"
                    onClick={() => setTotalTimeLimit(totalTimeLimit + 5)}
                    className="p-1 hover:bg-white/10 rounded text-white transition-colors cursor-pointer"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>
            </div>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Pratique com questões selecionadas pela nossa IA para reforçar os pontos onde você ainda tem dúvida. <span className="text-blue-400 font-bold">Respostas imediatas e explicações completas.</span>
            </p>
          </div>
          
          <button 
            type="button"
            onClick={handleStartRandomQuiz}
            disabled={loadingQuiz}
            className="w-full lg:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm sm:text-base transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2.5 shrink-0 cursor-pointer disabled:opacity-50"
          >
            {loadingQuiz ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>PROCESSANDO...</span>
              </>
            ) : (
              <>
                <Zap size={18} className="text-amber-400" />
                <span>INICIAR AGORA</span>
              </>
            )}
          </button>
        </div>
      </div>

      {showChemistryVideoModal && (
        <ChemistryVideoModal
          onClose={() => setShowChemistryVideoModal(false)}
          onCompleted={() => {
            if (auth.currentUser) {
              achievementService.trackActivity(auth.currentUser.uid, 'aulas', 1);
            }
          }}
        />
      )}
    </div>
  );
}
