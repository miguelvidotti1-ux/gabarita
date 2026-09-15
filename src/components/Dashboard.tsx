import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from 'recharts';
import { Trophy, Target, Clock, BookOpen, Loader2, FileText, Zap, CheckCircle, Lightbulb, Sparkles, RefreshCw, CheckSquare, Square, BookmarkCheck, X, Award } from 'lucide-react';
import { useState, useEffect } from 'react';
import { generateStudyPlan, StudyPlan, getDailyStudyTip, DailyStudyTip } from '../services/geminiService';
import { levelSystem, LevelSystemStatus } from '../services/levelService';
import { missionEngine, MissionStatus } from '../services/missionService';
import DailyMissions from './DailyMissions';
import PomodoroTimer from './PomodoroTimer';
import StudyMethodsSection from './StudyMethodsSection';
import SubjectPerformanceEvolutionChart, { QuizResultDoc } from './SubjectPerformanceEvolutionChart';
import QuizAccuracyHistoryChart from './QuizAccuracyHistoryChart';
import { GraficosProvider, useGraficos } from './GraficosContext';
import { SeletorFiltros } from './SeletorFiltros';
import { collection, getDocs, query, where, doc, setDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';

interface SubjectPerformance {
  id: string;
  subject: string;
  percentage: number;
}

interface Goal {
  targetAccuracy: number;
  targetHours: number;
}

const normalizeSubject = (subject: string) => {
  const s = subject.trim().toLowerCase();
  if (s.includes('matem')) return 'matemática';
  if (s.includes('port')) return 'português';
  if (s.includes('hist')) return 'história';
  if (s.includes('geo')) return 'geografia';
  if (s.includes('fis')) return 'física';
  if (s.includes('quim')) return 'química';
  if (s.includes('bio')) return 'biologia';
  return s;
};

interface QuizHistoryItem {
  id: string;
  vestibular: string;
  score: number;
  totalQuestions: number;
  date: string;
  subjectStats?: Record<string, { total: number; correct: number }>;
  timestamp?: any;
}

interface Competency {
  name: string;
  score: number;
  strengths: string;
  weaknesses: string;
  improvementExample: string;
}

interface EssayHistoryItem {
  id: string;
  theme: string;
  status: string;
  grade?: number;
  date: string;
  essayText?: string;
  generalCorrection?: string;
  competencies?: Competency[];
}

interface DashboardProps {
  selectedVestibular?: string;
}

export default function Dashboard(props: DashboardProps) {
  return (
    <GraficosProvider>
      <DashboardInner {...props} />
    </GraficosProvider>
  );
}

function DashboardInner({ selectedVestibular }: DashboardProps) {
  const { filtroGlobal } = useGraficos();
  const [studyPlan, setStudyPlan] = useState<StudyPlan[]>([]);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [planWeeks, setPlanWeeks] = useState(4);
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [upcomingExamsInput, setUpcomingExamsInput] = useState('');
  const [performance, setPerformance] = useState<SubjectPerformance[]>([]);
  const [goals, setGoals] = useState<Record<string, Goal>>({});
  const [quizHistory, setQuizHistory] = useState<QuizHistoryItem[]>([]);
  const [essayHistory, setEssayHistory] = useState<EssayHistoryItem[]>([]);
  const [selectedEssay, setSelectedEssay] = useState<EssayHistoryItem | null>(null);
  const [loadingPerformance, setLoadingPerformance] = useState(true);
  const [levelStatus, setLevelStatus] = useState<LevelSystemStatus | null>(null);
  const [missions, setMissions] = useState<MissionStatus[]>([]);
  const [stats, setStats] = useState({
    resolvedQuestions: 0,
    accuracyRate: 0,
    studyTime: '0h',
    simulatedCount: 0
  });
  const [vestibularStats, setVestibularStats] = useState<{ name: string, acertos: number, total: number }[]>([]);

  // State for Dica de Estudo do Dia (Gemini API)
  const [dailyTip, setDailyTip] = useState<DailyStudyTip | null>(null);
  const [loadingTip, setLoadingTip] = useState<boolean>(true);
  const [completedTipSteps, setCompletedTipSteps] = useState<Record<number, boolean>>({});
  const [tipVestibular, setTipVestibular] = useState<string>(selectedVestibular || 'ENEM');
  const [tipSaved, setTipSaved] = useState<boolean>(false);

  const fetchDailyTip = async (vestib: string, forceRefresh: boolean = false) => {
    setLoadingTip(true);
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const cacheKey = `vesthub_daily_tip_${vestib}_${todayStr}`;
      
      if (!forceRefresh) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            setDailyTip(parsed);
            setLoadingTip(false);
            return;
          } catch (e) {
            console.error("Cache de dica inválido:", e);
          }
        }
      }

      const tip = await getDailyStudyTip(vestib);
      setDailyTip(tip);
      setCompletedTipSteps({});
      setTipSaved(false);
      localStorage.setItem(cacheKey, JSON.stringify(tip));
    } catch (err) {
      console.error("Erro ao carregar dica de estudo do dia:", err);
    } finally {
      setLoadingTip(false);
    }
  };

  useEffect(() => {
    const currentVestib = selectedVestibular || 'ENEM';
    setTipVestibular(currentVestib);
    fetchDailyTip(currentVestib);
  }, [selectedVestibular]);

  useEffect(() => {
    if (selectedVestibular) {
      setUpcomingExamsInput(selectedVestibular);
    } else {
      setUpcomingExamsInput('ENEM');
    }
  }, [selectedVestibular]);

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) return;
      try {
        // Fetch performance
        const perfRef = collection(db, 'users', auth.currentUser.uid, 'subject_performance');
        const querySnapshot = await getDocs(perfRef);
        const perfData: SubjectPerformance[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          subject: normalizeSubject(doc.data().subject),
          percentage: doc.data().percentage,
        }));
        setPerformance(perfData);

        // Fetch goals
        const goalsRef = collection(db, 'users', auth.currentUser.uid, 'goals');
        const goalsSnapshot = await getDocs(goalsRef);
        const goalsData: Record<string, Goal> = {};
        goalsSnapshot.forEach(doc => {
          goalsData[doc.id] = doc.data() as Goal;
        });
        setGoals(goalsData);

        // Fetch quiz results for stats
        const resultsRef = collection(db, 'quiz_results');
        const q = query(resultsRef, where('userId', '==', auth.currentUser.uid));
        const resultsSnap = await getDocs(q);
        
        let totalQ = 0;
        let correctQ = 0;
        const vestMap: Record<string, { acertos: number, total: number }> = {
          'ENEM': { acertos: 0, total: 0 },
          'Fuvest': { acertos: 0, total: 0 },
          'Unicamp': { acertos: 0, total: 0 },
          'Unesp': { acertos: 0, total: 0 },
          'UERJ': { acertos: 0, total: 0 },
          'ITA': { acertos: 0, total: 0 }
        };

        const history: QuizHistoryItem[] = [];
        resultsSnap.forEach(doc => {
          const d = doc.data();
          totalQ += d.totalQuestions || 0;
          correctQ += d.score || 0;
          if (d.vestibular && vestMap[d.vestibular]) {
            vestMap[d.vestibular].acertos += d.score || 0;
            vestMap[d.vestibular].total += d.totalQuestions || 0;
          }

          const rawDate = d.createdAt || d.timestamp;
          let dateStr = 'N/A';
          if (rawDate) {
            if (typeof rawDate.toDate === 'function') {
              dateStr = rawDate.toDate().toLocaleDateString('pt-BR');
            } else if (rawDate instanceof Date) {
              dateStr = rawDate.toLocaleDateString('pt-BR');
            } else if (typeof rawDate === 'string' || typeof rawDate === 'number') {
              dateStr = new Date(rawDate).toLocaleDateString('pt-BR');
            }
          }

          history.push({
            id: doc.id,
            vestibular: d.vestibular || 'N/A',
            score: d.score || 0,
            totalQuestions: d.totalQuestions || 0,
            date: dateStr,
            subjectStats: d.subjectStats || undefined,
            timestamp: rawDate || undefined
          });
        });

        // Sort history chronologically if timestamps are present
        history.sort((a, b) => {
          const timeA = a.timestamp?.seconds || (typeof a.timestamp === 'number' ? a.timestamp : 0);
          const timeB = b.timestamp?.seconds || (typeof b.timestamp === 'number' ? b.timestamp : 0);
          return timeB - timeA;
        });

        setQuizHistory(history);
        setStats({
          resolvedQuestions: totalQ,
          accuracyRate: totalQ > 0 ? Math.round((correctQ / totalQ) * 100) : 0,
          studyTime: `${Math.round(totalQ * 2 / 60)}h`, // Estimating 2 mins per question
          simulatedCount: resultsSnap.size
        });

        setVestibularStats(Object.entries(vestMap).map(([name, data]) => ({
          name,
          acertos: data.total > 0 ? Math.round((data.acertos / data.total) * 100) : 0,
          total: 100
        })));

        // Fetch essay history
        const essaysRef = collection(db, 'essays');
        const essaysQ = query(essaysRef, where('userId', '==', auth.currentUser.uid));
        const essaysSnap = await getDocs(essaysQ);
        
        // Load Level System Status and Active missions
        setLevelStatus(levelSystem.getStatus());
        setMissions(missionEngine.getStatus());

        const essaysHistoryData: EssayHistoryItem[] = essaysSnap.docs.map(doc => {
          const d = doc.data();
          return {
            id: doc.id,
            theme: d.theme || 'Sem tema',
            status: d.status || 'rascunho',
            grade: d.grade,
            date: d.timestamp ? d.timestamp.toDate().toLocaleDateString() : 'N/A',
            essayText: d.essayText || '',
            generalCorrection: d.generalCorrection || '',
            competencies: d.competencies || [],
            timestamp: d.timestamp
          };
        }).sort((a, b) => {
          const tA = (a.timestamp as any)?.seconds || 0;
          const tB = (b.timestamp as any)?.seconds || 0;
          return tB - tA;
        });
        setEssayHistory(essaysHistoryData);

      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'dashboard_data');
      } finally {
        setLoadingPerformance(false);
      }
    };
    fetchData();
  }, []);

  const statsCards = [
    { label: 'Questões Resolvidas', value: stats.resolvedQuestions.toLocaleString(), icon: BookOpen, iconBg: 'bg-blue-100 dark:bg-blue-900/40', iconColor: 'text-blue-600 dark:text-blue-400' },
    { label: 'Taxa de Acerto', value: `${stats.accuracyRate}%`, icon: Target, iconBg: 'bg-emerald-100 dark:bg-emerald-900/40', iconColor: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Tempo de Estudo', value: stats.studyTime, icon: Clock, iconBg: 'bg-purple-100 dark:bg-purple-900/40', iconColor: 'text-purple-600 dark:text-purple-400' },
    { label: 'Simulados', value: stats.simulatedCount.toString(), icon: Trophy, iconBg: 'bg-amber-100 dark:bg-amber-900/40', iconColor: 'text-amber-600 dark:text-amber-400' },
  ];

  const handleGeneratePlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const weakSubjects = difficulties;
      const upcomingExams = upcomingExamsInput.split(',').map(e => e.trim()).filter(e => e !== '');
      
      if (weakSubjects.length === 0 || upcomingExams.length === 0) {
        alert("Por favor, selecione pelo menos uma matéria de dificuldade e informe o vestibular de destino.");
        setIsGeneratingPlan(false);
        return;
      }

      const plan = await generateStudyPlan(weakSubjects, upcomingExams, planWeeks);
      setStudyPlan(plan);
    } catch (error) {
      console.error("Failed to generate study plan:", error);
      alert("Erro ao gerar plano de estudos. Tente novamente.");
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleUpdateGoal = async (subject: string, field: 'targetAccuracy' | 'targetHours', value: number) => {
    if (!auth.currentUser) return;
    const sanitizedValue = isNaN(value) ? 0 : value;
    const path = `users/${auth.currentUser.uid}/goals/${subject}`;
    try {
      const docRef = doc(db, 'users', auth.currentUser.uid, 'goals', subject);
      const currentGoal = goals[subject] || { targetAccuracy: 0, targetHours: 0 };
      const newGoal = { ...currentGoal, [field]: sanitizedValue, userId: auth.currentUser.uid, subject };
      await setDoc(docRef, newGoal);
      setGoals(prev => ({ ...prev, [subject]: newGoal }));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const completedMissionsCount = missions.filter(m => m.completed).length;
  const totalMissionsCount = missions.length;
  const pendingMissionsCount = totalMissionsCount - completedMissionsCount;
  const missionsCompletionPercentage = totalMissionsCount > 0 ? Math.round((completedMissionsCount / totalMissionsCount) * 100) : 0;

  const missionsChartData = totalMissionsCount > 0 ? [
    { name: 'Concluídas', value: completedMissionsCount, color: '#10b981' },
    { name: 'Pendentes', value: pendingMissionsCount, color: '#3b82f6' }
  ] : [
    { name: 'Concluídas', value: 0, color: '#10b981' },
    { name: 'Pendentes', value: 1, color: '#94a3b8' }
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-[var(--text-main)]">Seu Painel</h1>
          <p className="text-[var(--text-muted)]">Acompanhe seu desempenho acadêmico.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          {levelStatus && (
            <>
              <div className="bg-[var(--bg-card)] p-3 px-4 rounded-2xl border border-[var(--border-light)] shadow-sm flex items-center gap-3">
                <div className="bg-indigo-100 dark:bg-zinc-800 p-2 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <Zap size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-[var(--text-label)] uppercase font-extrabold tracking-wider">XP Total</p>
                  <p className="font-bold text-[var(--text-main)]">{levelStatus.global.xp.toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-[var(--bg-card)] p-3 px-4 rounded-2xl border border-[var(--border-light)] shadow-sm flex items-center gap-3">
                <div className="bg-amber-100 dark:bg-zinc-800 p-2 rounded-xl text-amber-600 dark:text-amber-400">
                  <Trophy size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-[var(--text-label)] uppercase font-extrabold tracking-wider">Nível</p>
                  <p className="font-bold text-[var(--text-main)]">{levelStatus.global.level}</p>
                </div>
              </div>
              <div className="bg-[var(--bg-card)] p-3 px-4 rounded-2xl border border-[var(--border-light)] shadow-sm flex items-center gap-3">
                <div className="bg-rose-100 dark:bg-zinc-800 p-2 rounded-xl text-rose-600 dark:text-rose-400">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-[var(--text-label)] uppercase font-extrabold tracking-wider">Ofensiva</p>
                  <p className="font-bold text-[var(--text-main)]">{levelStatus.global.streak} dias</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, i) => (
          <div key={i} className="bg-[var(--bg-card)] border border-[var(--border-light)] p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-[var(--primary)] transition-all">
            <div className={`${stat.iconBg} w-10 h-10 rounded-xl flex items-center justify-center ${stat.iconColor} mb-4`}>
              <stat.icon size={20} />
            </div>
            <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-black text-[var(--text-main)]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Pomodoro & Study Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PomodoroTimer />
        </div>
        <div className="lg:col-span-2">
          <StudyMethodsSection />
        </div>
      </div>

      {/* Dica de Estudo do Dia */}
      <div id="dica-de-estudo-do-dia" className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-2xl p-6 md:p-8 relative overflow-hidden transition-all shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-light)] pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 dark:bg-zinc-800 p-3 rounded-xl text-amber-600 dark:text-amber-400">
              <Lightbulb size={24} />
            </div>
            <div>
              <h2 className="text-xl font-display font-black text-[var(--text-main)]">Dica de Estudo</h2>
              <p className="text-[var(--text-muted)] text-xs">Estratégia diária recomendada</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-[var(--bg-hover)] dark:bg-[#15181E] p-1 rounded-xl border border-[var(--border-light)] text-xs font-semibold">
              {['ENEM', 'FUVEST', 'UNICAMP', 'UNESP', 'UERJ', 'ITA'].map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    setTipVestibular(v);
                    fetchDailyTip(v, false);
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    tipVestibular === v
                      ? 'bg-[var(--primary)] text-white shadow-sm font-bold'
                      : 'text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            <button
              onClick={() => fetchDailyTip(tipVestibular, true)}
              disabled={loadingTip}
              className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] active:scale-95 disabled:opacity-50 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              title="Gerar uma nova dica com a API Gemini"
            >
              <RefreshCw size={14} className={loadingTip ? 'animate-spin' : ''} />
              <span>Nova Dica</span>
            </button>
          </div>
        </div>

        {loadingTip ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
            <Loader2 size={36} className="text-[var(--primary)] animate-spin" />
            <p className="text-sm font-medium text-[var(--text-muted)] animate-pulse">
              Consultando o Gemini para gerar uma dica estratégica para o {tipVestibular}...
            </p>
          </div>
        ) : dailyTip ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-[var(--bg-badge)] text-[var(--primary)] text-xs font-bold px-3 py-1 rounded-full border border-[var(--border-light)]">
                {dailyTip.category}
              </span>
              <span className="bg-[var(--bg-badge-neutral)] text-[var(--text-muted)] text-xs font-bold px-3 py-1 rounded-full border border-[var(--border-light)]">
                Foco: {tipVestibular}
              </span>
            </div>

            <div>
              <h3 className="text-lg md:text-xl font-bold text-[var(--text-main)] mb-2 leading-snug">
                {dailyTip.title}
              </h3>
              <p className="text-[var(--text-muted)] text-sm md:text-base leading-relaxed whitespace-pre-line">
                {dailyTip.content}
              </p>
            </div>

            {dailyTip.actionableSteps && dailyTip.actionableSteps.length > 0 && (
              <div className="bg-[var(--bg-hover)] dark:bg-[#15181E] p-4 md:p-5 rounded-2xl border border-[var(--border-light)] space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-[var(--primary)] flex items-center gap-1.5">
                  <Zap size={14} /> Como aplicar essa dica hoje:
                </h4>
                <div className="space-y-2">
                  {dailyTip.actionableSteps.map((step, idx) => {
                    const isDone = !!completedTipSteps[idx];
                    return (
                      <button
                        key={idx}
                        onClick={() => setCompletedTipSteps(prev => ({ ...prev, [idx]: !prev[idx] }))}
                        className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl hover:bg-[var(--bg-card)] transition-colors group cursor-pointer"
                      >
                        <div className="mt-0.5 text-[var(--primary)] shrink-0">
                          {isDone ? (
                            <CheckSquare size={18} className="text-[var(--success)]" />
                          ) : (
                            <Square size={18} className="group-hover:scale-110 transition-transform" />
                          )}
                        </div>
                        <span className={`text-xs md:text-sm transition-all ${
                          isDone
                            ? 'line-through text-[var(--text-label)]'
                            : 'text-[var(--text-main)] font-medium'
                        }`}>
                          {step}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-[var(--text-muted)] font-semibold mr-1">Disciplinas sugeridas:</span>
                {dailyTip.recommendedSubjects.map((sub, i) => (
                  <span key={i} className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[var(--bg-badge)] text-[var(--primary)] border border-[var(--border-light)]">
                    #{sub}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTipSaved(!tipSaved)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer ${
                    tipSaved
                      ? 'bg-emerald-500/10 text-[var(--success)] border border-emerald-500/30'
                      : 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-light)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <BookmarkCheck size={14} />
                  <span>{tipSaved ? 'Dica Salva!' : 'Salvar Dica'}</span>
                </button>
              </div>
            </div>

            {dailyTip.quote && (
              <div className="border-t border-[var(--border-light)] pt-4">
                <p className="italic text-xs md:text-sm text-[var(--text-muted)] font-serif text-center">
                  "{dailyTip.quote}"
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>

      <DailyMissions />

      {/* Planejamento de Rotina com IA */}
      <div className="bg-[var(--bg-card)] text-[var(--text-main)] p-8 rounded-2xl border border-[var(--border-light)] shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-[var(--border-light)] pb-6">
          <div className="bg-[var(--primary-light)] dark:bg-zinc-800 p-3 rounded-2xl text-[var(--primary)]">
            <Target size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[var(--text-main)]">Cronograma de Estudos IA</h2>
            <p className="text-sm text-[var(--text-muted)] font-medium">Gere um planejamento estratégico de estudo semanal personalizado para seu vestibular.</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-[var(--bg-hover)] dark:bg-[#15181E] border border-[var(--border-light)] rounded-2xl p-8 text-[var(--text-main)] flex flex-col lg:flex-row justify-between items-center gap-8 shadow-sm">
            <div className="max-w-md w-full space-y-5">
              <div>
                <h3 className="text-2xl font-black mb-2 text-[var(--text-main)]">Plano Estratégico do Vestibular</h3>
                <p className="text-[var(--text-muted)] text-sm">Organize as semanas restantes até a prova de forma inteligente e personalizada.</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[var(--text-label)]">Próximos Vestibulares</label>
                <input 
                  type="text"
                  value={upcomingExamsInput}
                  onChange={(e) => setUpcomingExamsInput(e.target.value)}
                  className="w-full p-4 rounded-xl text-[var(--text-main)] bg-[var(--bg-card)] focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all placeholder-[var(--text-muted)] font-semibold border border-[var(--border-light)]"
                  placeholder="Ex: ENEM, Fuvest, ITA, Unicamp"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[var(--text-label)]">Focar nas matérias mais desafiadoras</label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Matemática', 'Português', 'Física', 'Química', 'História', 'Geografia', 'Biologia', 'Filosofia/Sociologia', 'Inglês'].map((subj) => {
                    const isSelected = difficulties.includes(subj);
                    return (
                      <button
                        key={subj}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setDifficulties(prev => prev.filter(d => d !== subj));
                          } else {
                            setDifficulties(prev => [...prev, subj]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm scale-105'
                            : 'bg-[var(--bg-badge-neutral)] text-[var(--text-muted)] border-[var(--border-light)] hover:bg-[var(--bg-card)] hover:text-[var(--text-main)]'
                        }`}
                      >
                        {subj}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center text-[var(--text-main)]">
                  <label className="text-xs font-black uppercase tracking-widest text-[var(--text-label)]">Período de estudos</label>
                  <span className="font-black text-xl text-[var(--text-main)]">{planWeeks} {planWeeks === 1 ? 'Semana' : 'Semanas'}</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={planWeeks}
                  onChange={(e) => setPlanWeeks(Number(e.target.value))}
                  className="w-full h-2 bg-[#2d457f] rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
                  style={{ backgroundColor: '#2d457f' }}
                />
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-4 shrink-0 w-full lg:w-auto">
              <button 
                onClick={handleGeneratePlan}
                disabled={isGeneratingPlan}
                className="w-full lg:w-auto bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-12 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-md cursor-pointer"
              >
                {isGeneratingPlan ? <Loader2 size={24} className="animate-spin text-white" /> : <Clock size={24} />}
                <span>{isGeneratingPlan ? 'Gerando Plano...' : 'Criar Plano com IA'}</span>
              </button>
              <p className="text-[10px] text-[var(--text-muted)] font-medium">Processado via Gemini-3 Flash</p>
            </div>
          </div>

          {studyPlan.length > 0 && (
            <div className="p-6 rounded-2xl border border-[var(--border-light)] bg-[var(--bg-hover)] dark:bg-[#15181E] space-y-4 animate-in fade-in duration-300">
              <h4 className="text-lg font-black text-[var(--text-main)] flex items-center gap-2">
                <span>Cronograma IA Gerado</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studyPlan.map((week) => (
                  <div key={week.week} className="p-4 rounded-xl border border-[var(--border-light)] bg-[var(--bg-card)] shadow-sm space-y-2">
                    <div className="flex justify-between items-center bg-[var(--bg-hover)] dark:bg-zinc-800 px-3 py-1.5 rounded-lg">
                      <p className="font-bold text-xs text-[var(--primary)]">Semana {week.week}</p>
                      <span className="text-xs font-black text-[var(--primary)]">{week.estimatedHours}h semanais</span>
                    </div>
                    <div>
                      <p className="font-bold text-[var(--text-main)] text-sm">{week.topic}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">{week.focus}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Barra de Filtros Globais dos Gráficos com SeletorFiltros */}
      <div className="bg-[var(--bg-card)] text-[var(--text-main)] p-5 rounded-2xl border border-[var(--border-light)] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-lg font-black text-[var(--text-main)]">Painel Analítico de Gráficos</h3>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/10 text-[var(--primary)] border border-blue-500/20">
              Filtro Global
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Selecione uma disciplina específica ou visualize todas para atualizar as curvas de evolução e o progresso.
          </p>
        </div>
        <SeletorFiltros />
      </div>

      {/* Gráfico de Desempenho e Evolução por Disciplina (Recharts) */}
      <SubjectPerformanceEvolutionChart quizHistory={quizHistory} overallAccuracy={stats.accuracyRate} />

      <div className="bg-[var(--bg-card)] text-[var(--text-main)] p-8 rounded-2xl border border-[var(--border-light)] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <h3 className="text-xl font-bold text-[var(--text-main)]">Progresso por Disciplina</h3>
          {filtroGlobal?.materia && filtroGlobal.materia !== 'Todas' && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-500/10 text-[var(--primary)] border border-blue-500/20 w-fit">
              Filtrado por: <strong>{filtroGlobal.materia}</strong>
            </span>
          )}
        </div>
        {loadingPerformance ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 size={32} className="text-[var(--primary)] animate-spin" />
          </div>
        ) : performance.length > 0 ? (
          <div className="space-y-6">
            {Array.from(new Map(performance.map(p => [p.subject, p])).values())
              .filter(p => {
                if (!filtroGlobal?.materia || filtroGlobal.materia === 'Todas') return true;
                return p.subject.toLowerCase() === filtroGlobal.materia.toLowerCase();
              })
              .map((p, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center gap-4">
                  <span className="font-bold text-[var(--text-main)] truncate">{p.subject}</span>
                  <span className="text-sm font-bold text-[var(--primary)] shrink-0">{p.percentage}%</span>
                </div>
                <div className="h-3 bg-[var(--bg-hover)] dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[var(--primary)] rounded-full transition-all duration-1000" 
                    style={{ width: `${p.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[var(--text-muted)] text-center py-8">Nenhum quiz realizado ainda.</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[var(--bg-card)] text-[var(--text-main)] p-8 rounded-2xl border border-[var(--border-light)] shadow-sm">
          <h3 className="text-xl font-bold text-[var(--text-main)] mb-6">Desempenho por Disciplina (Gráfico)</h3>
          <div className="h-80 flex items-center justify-center">
            {performance.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(performance.reduce((acc, curr) => {
                      if (!acc[curr.subject]) {
                        acc[curr.subject] = { total: 0, count: 0 };
                      }
                      acc[curr.subject].total += curr.percentage;
                      acc[curr.subject].count += 1;
                      return acc;
                    }, {} as Record<string, { total: number, count: number }>)).map(([subject, data]) => ({
                      name: subject,
                      value: Math.round(data.total / data.count)
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {performance.reduce((acc, curr) => {
                      if (!acc.find(item => item.subject === curr.subject)) {
                        acc.push(curr);
                      }
                      return acc;
                    }, [] as SubjectPerformance[]).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={['#1D4ED8', '#0D9488', '#0284C7', '#4F46E5'][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '8px', color: 'var(--text-main)' }} />
                  <Legend formatter={(value) => <span className="text-[var(--text-main)]">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center space-y-3">
                <div className="p-3 bg-[var(--primary-light)] dark:bg-zinc-800 rounded-full text-[var(--primary)] w-fit mx-auto">
                  <Target size={28} />
                </div>
                <p className="text-[var(--text-muted)] text-sm font-medium">Nenhum dado de desempenho cadastrado ainda.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[var(--bg-card)] text-[var(--text-main)] p-8 rounded-2xl border border-[var(--border-light)] shadow-sm">
          <h3 className="text-xl font-bold text-[var(--text-main)] mb-6">Progresso por Vestibular</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vestibularStats.length > 0 ? vestibularStats : [
                { name: 'ENEM', acertos: 0, total: 100 },
                { name: 'Fuvest', acertos: 0, total: 100 },
                { name: 'Unicamp', acertos: 0, total: 100 },
                { name: 'Unesp', acertos: 0, total: 100 },
                { name: 'UERJ', acertos: 0, total: 100 },
                { name: 'ITA', acertos: 0, total: 100 },
              ]}>
                <XAxis dataKey="name" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '8px', color: 'var(--text-main)' }} />
                <Bar dataKey="acertos" fill="#1D4ED8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Gráfico de Linhas do Histórico de Acertos nos Quizzes (Recharts) */}
      <QuizAccuracyHistoryChart quizHistory={quizHistory} targetAccuracy={80} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Donut / Rosca Chart for Daily Missions and Tasks */}
        <div className="bg-[var(--bg-card)] text-[var(--text-main)] p-8 rounded-2xl border border-[var(--border-light)] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">Conclusão de Missões do Dia</h3>
            <p className="text-xs text-[var(--text-muted)] font-medium mb-6">Visualização do percentual de conclusão das missões diárias.</p>
          </div>
          <div className="h-64 flex items-center justify-center relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              <span className="text-3xl font-black text-[var(--text-main)] leading-none">{missionsCompletionPercentage}%</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--success)] mt-2 font-mono">Concluído</span>
            </div>
            
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={missionsChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={80}
                  paddingAngle={totalMissionsCount > 1 ? 4 : 0}
                  dataKey="value"
                >
                  {missionsChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'Pendentes' ? '#94A3B8' : '#0D9488'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} itens`, 'Quantidade']} contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col gap-2.5 w-full mt-4 pt-4 border-t border-[var(--border-light)] text-sm font-bold text-[var(--text-main)]">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 font-semibold text-[var(--text-muted)]">
                <span className="w-3 h-3 rounded-full bg-[#0D9488]"></span>
                Missões Realizadas
              </span>
              <span className="font-mono text-sm">{completedMissionsCount} de {totalMissionsCount} ({missionsCompletionPercentage}%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 font-semibold text-[var(--text-muted)]">
                <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                Missões Restantes
              </span>
              <span className="font-mono text-sm">{pendingMissionsCount} de {totalMissionsCount}</span>
            </div>
          </div>
        </div>

        {/* Ranking de Desempenho */}
        <div className="bg-[var(--bg-card)] text-[var(--text-main)] p-8 rounded-2xl border border-[var(--border-light)] shadow-sm">
          <h3 className="text-xl font-bold text-[var(--text-main)] mb-6 flex items-center gap-2">
            <Trophy className="text-amber-500" />
            Ranking de Desempenho
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Ana Silva', score: 95, subject: 'Matemática' },
              { name: 'Você', score: 88, subject: 'Matemática' },
              { name: 'Carlos Souza', score: 82, subject: 'Matemática' },
              { name: 'Beatriz Lima', score: 79, subject: 'Matemática' },
            ].map((user, i) => {
              const isUser = i === 1;
              const rankColor = i === 0 ? 'text-amber-500' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-amber-700' : 'text-[var(--text-muted)]';
              return (
                <div key={i} className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
                  isUser 
                    ? 'bg-[var(--primary)] text-white shadow-sm' 
                    : 'bg-[var(--bg-hover)] dark:bg-[#15181E] border border-[var(--border-light)] text-[var(--text-main)]'
                }`}>
                  <div className="flex items-center gap-4 overflow-hidden">
                    <span className={`font-bold text-lg shrink-0 ${isUser ? 'text-white' : rankColor}`}>#{i + 1}</span>
                    <span className={`font-medium truncate ${isUser ? 'text-white' : 'text-[var(--text-main)]'}`}>{user.name}</span>
                  </div>
                  <div className="flex items-center gap-6 shrink-0 ml-4">
                    <span className={`text-sm hidden sm:inline truncate max-w-[100px] ${isUser ? 'text-blue-100' : 'text-[var(--text-muted)]'}`}>{user.subject}</span>
                    <span className={`font-bold ${isUser ? 'text-white' : 'text-[var(--text-main)]'}`}>{user.score}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[var(--bg-card)] text-[var(--text-main)] p-8 rounded-2xl border border-[var(--border-light)] shadow-sm">
          <h3 className="text-xl font-bold text-[var(--text-main)] mb-6">Histórico de Simulados</h3>
          {quizHistory.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {quizHistory.map((h) => (
                <div key={h.id} className="flex justify-between items-center p-4 rounded-xl border border-[var(--border-light)] bg-[var(--bg-hover)] dark:bg-[#15181E]">
                  <div>
                    <p className="font-bold text-[var(--text-main)]">{h.vestibular}</p>
                    <p className="text-sm text-[var(--text-muted)]">{h.date}</p>
                  </div>
                  <span className="font-bold text-[var(--primary)]">{h.score} / {h.totalQuestions}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[var(--text-muted)] text-center py-8">Nenhum simulado realizado ainda.</p>
          )}
        </div>

        <div className="bg-[var(--bg-card)] text-[var(--text-main)] p-8 rounded-2xl border border-[var(--border-light)] shadow-sm">
          <h3 className="text-xl font-bold text-[var(--text-main)] mb-6 flex items-center gap-2">
            <FileText size={20} />
            Histórico de Redações
          </h3>
          {essayHistory.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {essayHistory.map((h) => (
                <div 
                  key={h.id} 
                  onClick={() => setSelectedEssay(h)}
                  className="flex justify-between items-center p-4 rounded-xl border border-[var(--border-light)] bg-[var(--bg-hover)] dark:bg-[#15181E] hover:border-[var(--primary)] transition-all cursor-pointer group"
                >
                  <div className="overflow-hidden">
                    <p className="font-bold text-[var(--text-main)] truncate group-hover:text-[var(--primary)] transition-colors">{h.theme}</p>
                    <p className="text-sm text-[var(--text-muted)]">{h.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        h.status === 'corrected' 
                          ? 'bg-emerald-500/10 text-[var(--success)] border border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}>
                        {h.status === 'corrected' ? 'Corrigida' : 'Rascunho'}
                      </span>
                    {h.status === 'corrected' && (
                      <span className="font-bold text-[var(--success)]">{h.grade}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[var(--text-muted)] text-center py-8">Nenhuma redação encontrada no histórico.</p>
          )}
        </div>
      </div>

      {/* Modal de Detalhes da Redação */}
      <AnimatePresence>
        {selectedEssay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedEssay(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-[var(--bg-card)] w-full max-w-4xl rounded-3xl shadow-2xl border border-[var(--border-light)] overflow-hidden relative max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 md:p-8 text-white relative shrink-0">
                <button 
                  onClick={() => setSelectedEssay(null)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all shadow-sm cursor-pointer"
                >
                  <X size={20} />
                </button>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pr-10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-md">
                      {selectedEssay.status === 'corrected' ? 'Redação Corrigida' : 'Rascunho Salvo'}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold leading-snug truncate max-w-xl" title={selectedEssay.theme}>
                      {selectedEssay.theme}
                    </h3>
                    <p className="text-xs text-blue-100 font-medium">Enviada em {selectedEssay.date}</p>
                  </div>
                  {selectedEssay.status === 'corrected' && selectedEssay.grade !== undefined && (
                    <div className="relative group shrink-0">
                      <div className="absolute inset-0 bg-white/25 blur-xl rounded-full"></div>
                      <div className="relative bg-[var(--bg-card)] text-white w-20 h-20 md:w-24 md:h-24 rounded-full flex flex-col items-center justify-center border-4 border-white/20 shadow-lg">
                        <span className="text-2xl md:text-3xl font-extrabold text-[var(--primary)]">{selectedEssay.grade}</span>
                        <span className="text-[8px] font-bold uppercase tracking-widest mt-[-2px] text-[var(--text-muted)]">Nota</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-8 flex-1">
                {/* Texto da Redação */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[var(--text-label)] uppercase tracking-wider">Texto da Redação</h4>
                  <div className="p-6 md:p-8 rounded-2xl border border-[var(--border-light)] bg-[var(--bg-hover)] text-[var(--text-main)] text-base sm:text-lg leading-relaxed whitespace-pre-wrap shadow-inner max-h-80 overflow-y-auto">
                    {selectedEssay.essayText || 'Nenhum texto salvo para esta redação.'}
                  </div>
                </div>

                {/* Seção de Correção para Corrigidas */}
                {selectedEssay.status === 'corrected' ? (
                  <div className="space-y-8 pt-4 border-t border-[var(--border-light)]">
                    {/* Competências com Barras */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-[var(--text-label)] uppercase tracking-wider">Desempenho por Competência</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedEssay.competencies && selectedEssay.competencies.map((c, i) => (
                          <div key={i} className="bg-[var(--bg-hover)] p-5 rounded-2xl border border-[var(--border-light)] flex flex-col justify-between gap-3">
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] bg-[var(--bg-badge)] px-2.5 py-0.5 rounded border border-[var(--primary-border)]">
                                  Comp. {i + 1}
                                </span>
                                <span className="font-mono text-sm font-bold text-[var(--primary)]">{c.score} <span className="text-[10px] font-medium text-[var(--text-label)]">/ 200</span></span>
                              </div>
                              <h5 className="font-bold text-[var(--text-main)] text-xs leading-tight mb-2">{c.name}</h5>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="h-1.5 bg-[var(--bg-card)] rounded-full overflow-hidden border border-[var(--border-light)]">
                                <div 
                                  className="h-full bg-[var(--primary)] rounded-full transition-all duration-500"
                                  style={{ width: `${(c.score / 200) * 100}%` }}
                                ></div>
                              </div>
                              <div className="text-[11px] space-y-1.5 text-[var(--text-muted)]">
                                <p><span className="font-bold text-emerald-400">Pontos Fortes:</span> {c.strengths}</p>
                                <p><span className="font-bold text-amber-400">Melhorar:</span> {c.weaknesses}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Destaques e Evolução */}
                    {selectedEssay.generalCorrection && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--border-light)]">
                        <div className="space-y-3 p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/20">
                          <div className="flex items-center gap-2.5 text-emerald-400">
                            <CheckCircle size={22} />
                            <h4 className="font-bold text-sm uppercase tracking-wide">Destaques Positivos</h4>
                          </div>
                          <p className="text-sm text-[var(--text-muted)] leading-relaxed italic">
                            {selectedEssay.generalCorrection}
                          </p>
                        </div>

                        {selectedEssay.competencies && selectedEssay.competencies[0] && (
                          <div className="space-y-3 p-6 bg-amber-500/5 rounded-2xl border border-amber-500/20">
                            <div className="flex items-center gap-2.5 text-amber-400">
                              <Award size={22} />
                              <h4 className="font-bold text-sm uppercase tracking-wide">Plano de Evolução</h4>
                            </div>
                            <p className="text-sm text-[var(--text-muted)] leading-relaxed font-medium">
                              {selectedEssay.competencies[0].improvementExample || selectedEssay.competencies[0].weaknesses}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 bg-amber-500/5 rounded-2xl border border-amber-500/20 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                    <div className="bg-amber-500/10 p-3 rounded-xl text-amber-400">
                      <FileText size={28} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[var(--text-main)]">Este é um rascunho de redação</h4>
                      <p className="text-sm text-[var(--text-muted)]">Ela foi salva como rascunho e ainda não foi submetida para avaliação técnica.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-5 bg-[var(--bg-hover)] border-t border-[var(--border-light)] flex justify-end gap-3 shrink-0">
                <button 
                  onClick={() => setSelectedEssay(null)}
                  className="px-6 py-2.5 rounded-xl font-bold bg-[var(--bg-card)] border border-[var(--border-light)] text-[var(--text-main)] hover:bg-[var(--border-color)] transition-all text-xs sm:text-sm cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
