import { useState, useRef, useMemo } from 'react';
import { Vestibular } from '../types';
import { VESTIBULARES_DATA } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { BookOpen, CheckCircle, ArrowRight, Book, X, Loader2, Share2, Download, Plus, Minus, Search, Target, Zap, GraduationCap, Sparkles } from 'lucide-react';
import { generateStudyMaterial, StudyMaterial, generateQuestions, Question } from '../services/geminiService';
import { missionEngine } from '../services/missionService';
import { auth } from '../firebase';
import { achievementService } from '../services/achievementService';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import LigacoesQuimicasMindMap from './LigacoesQuimicasMindMap';

const SUBJECT_COLORS: Record<string, { bg: string, text: string, border: string, btn: string }> = {
  'Matemática': { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-200', btn: 'bg-blue-600' },
  'Física': { bg: 'bg-indigo-500/10', text: 'text-indigo-600', border: 'border-indigo-200', btn: 'bg-indigo-600' },
  'Química': { bg: 'bg-cyan-500/10', text: 'text-cyan-600', border: 'border-cyan-200', btn: 'bg-cyan-600' },
  'Biologia': { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-200', btn: 'bg-emerald-600' },
  'Português': { bg: 'bg-rose-500/10', text: 'text-rose-600', border: 'border-rose-200', btn: 'bg-rose-600' },
  'Literatura': { bg: 'bg-pink-500/10', text: 'text-pink-600', border: 'border-pink-200', btn: 'bg-pink-600' },
  'História': { bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-200', btn: 'bg-amber-600' },
  'Geografia': { bg: 'bg-orange-500/10', text: 'text-orange-600', border: 'border-orange-200', btn: 'bg-orange-600' },
  'Sociologia': { bg: 'bg-violet-500/10', text: 'text-violet-600', border: 'border-violet-200', btn: 'bg-violet-600' },
  'English': { bg: 'bg-sky-500/10', text: 'text-sky-600', border: 'border-sky-200', btn: 'bg-sky-600' },
  'Filosofia': { bg: 'bg-purple-500/10', text: 'text-purple-600', border: 'border-purple-200', btn: 'bg-purple-600' },
  'Artes': { bg: 'bg-teal-500/10', text: 'text-teal-600', border: 'border-teal-200', btn: 'bg-teal-600' }
};

const getSubjectStyles = (subject: string) => {
  return SUBJECT_COLORS[subject] || { bg: 'bg-slate-500/10', text: 'text-slate-600', border: 'border-slate-200', btn: 'bg-blue-600' };
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
  const contentRef = useRef<HTMLDivElement>(null);

  const handleGenerateRecommendation = async () => {
    setLoadingRecommendation(true);
    try {
      // In a real app, we would fetch performance data here. 
      // For now, we simulate sending a request to our new backend route.
      const response = await fetch("/api/gemini/recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            vestibular,
            performanceData: {} // Placeholder
        }),
      });
      const data = await response.json();
      alert(`Plano sugerido: ${data.plan}`);
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
      
      // Add static mind maps if they exist in constants
      const updatedResult = result.map(item => {
        const topicData = data.find(s => s.subject === subject)?.topics.find(t => t.name === item.topicName);
        return {
          ...item,
          staticMindMapUrl: topicData?.mindMapUrl
        };
      });
      
      setMaterial(updatedResult);
      
      // Update Mission Progress
      missionEngine.getMissionsForToday().forEach(m => {
        if (m.type === 'review' && (m.topic === subject || m.topic === 'review')) {
          missionEngine.updateProgress(m.id, 1);
        }
      });

      // Update user Metas/Achievements automatically
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
      
      // Add static mind map if it exists in constants
      const topicData = data.find(s => s.subject === subject)?.topics.find(t => t.name === topicName);
      const updatedResult = result.map(item => ({
        ...item,
        staticMindMapUrl: topicData?.mindMapUrl
      }));
      
      setMaterial(updatedResult);
      
      // Update Mission Progress
      missionEngine.getMissionsForToday().forEach(m => {
        if (m.type === 'review' && (m.topic === subject || m.topic === 'review')) {
          missionEngine.updateProgress(m.id, 1);
        }
      });

      // Update user Metas/Achievements automatically
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
      // Pick 3 random subjects
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
    <div className="space-y-12">
      <div className="relative overflow-hidden bg-white dark:bg-blue-900 rounded-[2rem] p-8 md:p-12 border dark:border-blue-800 shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-3xl rounded-full -mr-20 -mt-20"></div>
        <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-800/50 text-blue-600 dark:text-blue-300 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
                <Target size={16} />
                <span>Análise Estatística 2026</span>
              </div>
              <button 
                onClick={handleGenerateRecommendation}
                disabled={loadingRecommendation}
                className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-500/20 transition-colors"
              >
                {loadingRecommendation ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                <span>Recomendação IA</span>
              </button>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white leading-tight tracking-tight">
              O que você <span className="text-blue-600">realmente</span> precisa estudar
            </h1>
            <p className="text-lg text-slate-500 dark:text-blue-300 max-w-xl leading-relaxed">
              Mapeamos os conteúdos mais recorrentes do <span className="font-bold text-blue-600">{vestibular}</span> para direcionar seu esforço onde ele traz mais resultado.
            </p>
          </div>
          
          <div className="w-full lg:w-auto space-y-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={22} />
              <input 
                type="text" 
                placeholder="Ex: 'Óptica', 'Matemática', 'Geometria'..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full lg:w-80 pl-12 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-blue-950 border border-slate-200 dark:border-blue-800 text-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-lg"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-blue-900 bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-[10px] font-bold text-blue-600">👤</div>
                ))}
              </div>
              <p className="text-xs font-bold text-slate-400 dark:text-blue-400 uppercase tracking-tighter">Usado por +10k estudantes hoje</p>
            </div>
          </div>
        </div>
      </div>

      {searchResults && (
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-blue-500/5 dark:bg-blue-900/20 p-8 rounded-[2.5rem] border border-blue-500/20 space-y-6"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-blue-600 dark:text-blue-400 flex items-center gap-3">
                <Search size={22} />
                <span>Explorando Resultados ({searchResults.length})</span>
              </h3>
              <button 
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-blue-600 transition-colors"
                title="Limpar busca"
              >
                <X size={20} />
              </button>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((res, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white dark:bg-blue-950 p-6 rounded-2xl border dark:border-blue-800 shadow-sm hover:shadow-md transition-shadow group/card overflow-hidden"
                  >
                    <div className="flex justify-between items-center mb-4 gap-2">
                      <span className="text-xs font-black text-blue-500 uppercase tracking-widest truncate">{res.materia}</span>
                      <span className="text-[10px] font-black bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200 px-2.5 py-1 rounded-lg shrink-0">{res.vestibular}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {res.topicos.map((topico, j) => (
                        <button 
                          key={j}
                          onClick={() => handleGenerateTopicMaterial(res.materia, topico)}
                          className="text-xs font-bold text-slate-600 dark:text-blue-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-blue-900 transition-all truncate max-w-full flex items-center gap-2 group/btn"
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
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-slate-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <Book size={32} />
                </div>
                <p className="text-slate-500 dark:text-blue-300 font-bold">Nenhum conteúdo encontrado para "{searchQuery}".</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {data.map((subject, i) => {
          const styles = getSubjectStyles(subject.subject);
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white dark:bg-blue-900 rounded-[2.5rem] border dark:border-blue-800 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all overflow-hidden flex flex-col"
            >
              <div className="p-8 md:p-10 flex-1 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className={`w-14 h-14 ${styles.bg} ${styles.text} rounded-2xl flex items-center justify-center mb-4 ring-4 ring-white dark:ring-blue-900`}>
                      <BookOpen size={32} />
                    </div>
                    <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{subject.subject}</h3>
                    <p className="text-sm font-bold text-slate-400 dark:text-blue-400 uppercase tracking-widest">Temas Recorrentes</p>
                  </div>
                  
                  <div className="relative w-24 h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={subject.topics}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={45}
                          paddingAngle={4}
                          dataKey="percentage"
                          stroke="none"
                        >
                          {subject.topics.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={['#3b82f6', '#4f46e5', '#06b6d4', '#10b981'][index % 4]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Zap size={14} className="text-blue-500 animate-pulse" />
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  {subject.topics.map((topic, j) => (
                    <div key={j} className="relative pl-6 border-l-2 border-slate-100 dark:border-blue-800 group/topic">
                      <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-white dark:ring-blue-900"></div>
                      
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-lg text-slate-800 dark:text-white group-hover/topic:text-blue-600 transition-colors">{topic.name}</span>
                            <span className="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 px-2.5 py-0.5 rounded-full text-[10px] font-black">{topic.percentage}%</span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2">
                            {topic.mindMapUrl && (
                              <button 
                                onClick={() => {
                                  setSelectedSubject({ subject: subject.subject, topics: [topic.name] });
                                  setMaterial([{
                                    topicName: topic.name,
                                    summary: topic.summary,
                                    mindMap: { label: topic.name, children: [] },
                                    staticMindMapUrl: topic.mindMapUrl
                                  }]);
                                }}
                                className="text-[10px] font-black uppercase tracking-tighter bg-emerald-500/10 text-emerald-600 px-3 py-1.5 rounded-lg hover:bg-emerald-500/20 flex items-center gap-1.5 transition-colors"
                              >
                                <Share2 size={12} />
                                <span>Mapa</span>
                              </button>
                            )}
                            <button 
                              onClick={() => handleGenerateTopicMaterial(subject.subject, topic.name)}
                              disabled={loadingTopic === topic.name}
                              className="text-[10px] font-black uppercase tracking-tighter bg-blue-500/10 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-500/20 flex items-center gap-1.5 transition-colors"
                            >
                              {loadingTopic === topic.name ? <Loader2 size={12} className="animate-spin" /> : <BookOpen size={12} />}
                              <span>Resumo</span>
                            </button>
                            <button 
                              onClick={() => handleGenerateTopicQuiz(subject.subject, topic.name)}
                              disabled={loadingQuizTopic === topic.name}
                              className="text-[10px] font-black uppercase tracking-tighter bg-purple-500/10 text-purple-600 px-3 py-1.5 rounded-lg hover:bg-purple-500/20 flex items-center gap-1.5 transition-colors"
                            >
                              {loadingQuizTopic === topic.name ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
                              <span>Quiz</span>
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-slate-500 dark:text-blue-300 leading-relaxed line-clamp-2 italic">
                          "{topic.summary}"
                        </p>
                        
                        <div className="relative h-2 bg-slate-50 dark:bg-blue-950 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${topic.percentage}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full"
                          ></motion.div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-slate-50 dark:bg-blue-950/50 border-t dark:border-blue-800">
                <button 
                  onClick={() => handleVerResumos(subject.subject, subject.topics.map(t => t.name))}
                  className={`w-full py-5 rounded-2xl ${styles.btn} text-white font-black text-lg hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-500/10 flex items-center justify-center gap-3`}
                >
                  <GraduationCap size={22} />
                  <span>Caminho Completo da Aprovação</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedSubject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 p-2 rounded-xl text-white">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-800 dark:text-white">Material de Estudo: {selectedSubject.subject}</h2>
                    <p className="text-sm text-slate-500 dark:text-blue-300">Resumos e Mapas Mentais gerados por IA</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setSelectedSubject(null); setMaterial(null); }}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-blue-300"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-12" ref={contentRef}>
                {loading ? (
                  <div className="h-64 flex flex-col items-center justify-center gap-4">
                    <Loader2 size={48} className="text-blue-600 animate-spin" />
                    <p className="text-slate-600 dark:text-blue-300 font-bold animate-pulse">Gerando seu material personalizado...</p>
                  </div>
                ) : material ? (
                  material.map((item, idx) => (
                    <div key={idx} className="space-y-8 pb-12 border-b last:border-0 dark:border-slate-800">
                      <div className="space-y-4">
                        <h3 className="text-3xl font-black text-blue-600 dark:text-blue-400">{item.topicName}</h3>
                        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-blue-100 leading-relaxed">
                          <ReactMarkdown>{item.summary}</ReactMarkdown>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h4 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <Share2 className="text-blue-500" size={20} />
                          <span>Mapa Mental Explicativo</span>
                        </h4>
                        
                        {(item.staticMindMapUrl === 'custom_ligacoes_quimicas' || item.topicName.toLowerCase().includes('ligações') || item.topicName.toLowerCase().includes('ligacoes')) ? (
                          <LigacoesQuimicasMindMap />
                        ) : item.staticMindMapUrl ? (
                          <div className="bg-slate-50 dark:bg-slate-950/50 rounded-3xl p-4 border dark:border-slate-800 overflow-hidden">
                            <img 
                              src={item.staticMindMapUrl} 
                              alt={`Mapa Mental de ${item.topicName}`} 
                              className="w-full h-auto rounded-2xl shadow-lg"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ) : (
                          <div className="bg-slate-50 dark:bg-slate-950/50 rounded-3xl p-8 border dark:border-slate-800">
                            <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
                              {/* Central Node */}
                              <div className="relative z-10">
                                <div className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-center shadow-xl shadow-blue-600/20 min-w-[200px]">
                                  {item.mindMap.label}
                                </div>
                                {/* Connector lines (Desktop) */}
                                <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] -z-10">
                                  <svg width="100%" height="100%" viewBox="0 0 600 400">
                                    {item.mindMap.children.map((_, i) => {
                                      const angle = (i / item.mindMap.children.length) * 2 * Math.PI;
                                      const x2 = 300 + Math.cos(angle) * 200;
                                      const y2 = 200 + Math.sin(angle) * 120;
                                      return (
                                        <line 
                                          key={i} 
                                          x1="300" y1="200" 
                                          x2={x2} y2={y2} 
                                          stroke="#3b82f6" 
                                          strokeWidth="2" 
                                          strokeDasharray="4 4"
                                          className="opacity-40"
                                        />
                                      );
                                    })}
                                  </svg>
                                </div>
                              </div>

                              {/* Child Nodes */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full lg:w-auto">
                                {item.mindMap.children.map((child, i) => (
                                  <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border dark:border-slate-800 shadow-sm hover:border-blue-500 transition-colors group">
                                    <h5 className="font-black text-blue-600 dark:text-blue-400 mb-1 group-hover:translate-x-1 transition-transform">{child.label}</h5>
                                    <p className="text-xs text-slate-500 dark:text-blue-300 leading-tight">{child.description}</p>
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

              <div className="p-6 border-t dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                <p className="text-xs text-slate-500 dark:text-blue-400 italic">Este material foi gerado por inteligência artificial e deve ser usado como complemento aos seus estudos.</p>
                <div className="flex gap-3">
                  <button 
                    onClick={handleDownloadPDF}
                    disabled={isDownloading || loading}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl border dark:border-slate-700 text-slate-600 dark:text-blue-300 font-bold hover:bg-white dark:hover:bg-slate-800 transition-all disabled:opacity-50"
                  >
                    {isDownloading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Download size={18} />
                    )}
                    <span>PDF</span>
                  </button>
                  <button className="flex items-center gap-2 px-6 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                    <Share2 size={18} />
                    <span>Compartilhar</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="relative overflow-hidden bg-slate-900 dark:bg-blue-950 rounded-[3rem] p-12 text-white border dark:border-blue-900 shadow-2xl shadow-blue-500/10">
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full"></div>
        <div className="relative flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div className="max-w-2xl space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <h3 className="text-4xl font-black tracking-tight">Quizzes Dinâmicos</h3>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-md">
                <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest leading-none">Tempo Geral</span>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setTotalTimeLimit(Math.max(0, totalTimeLimit - 5))}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-black text-white min-w-[3rem] text-center">
                    {totalTimeLimit === 0 ? 'ILIMITADO' : `${totalTimeLimit} MIN`}
                  </span>
                  <button 
                    onClick={() => setTotalTimeLimit(totalTimeLimit + 5)}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
            <p className="text-slate-400 text-xl leading-relaxed">
              Pratique com questões selecionadas pela nossa IA para reforçar os pontos onde você ainda tem dúvida. <span className="text-blue-400 font-bold">Respostas imediatas e explicações completas.</span>
            </p>
          </div>
          
          <button 
            onClick={handleStartRandomQuiz}
            disabled={loadingQuiz}
            className="group relative bg-white text-slate-900 px-12 py-6 rounded-[2rem] font-black text-2xl hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-4 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
            {loadingQuiz ? (
              <>
                <Loader2 className="animate-spin" size={28} />
                <span>PROCESSANDO...</span>
              </>
            ) : (
              <>
                <Zap size={28} className="text-blue-600" />
                <span>INICIAR AGORA</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
