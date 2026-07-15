import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from 'recharts';
import { Trophy, Target, Clock, BookOpen, Loader2, FileText, Zap, CheckCircle, Plus, X, Award } from 'lucide-react';
import { useState, useEffect } from 'react';
import { generateStudyPlan, StudyPlan } from '../services/geminiService';
import { levelSystem, LevelSystemStatus } from '../services/levelService';
import { missionEngine, MissionStatus } from '../services/missionService';
import DailyMissions from './DailyMissions';
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

export default function Dashboard({ selectedVestibular }: DashboardProps) {
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
          history.push({
            id: doc.id,
            vestibular: d.vestibular || 'N/A',
            score: d.score || 0,
            totalQuestions: d.totalQuestions || 0,
            date: d.timestamp ? d.timestamp.toDate().toLocaleDateString() : 'N/A'
          });
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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Seu Progresso</h1>
          <p className="text-slate-500 dark:text-blue-300">Acompanhe seu desempenho e pontos fracos.</p>
        </div>
        <div className="flex gap-2">
          {levelStatus && (
            <>
              <div className="bg-white dark:bg-blue-900 p-3 rounded-xl border dark:border-blue-800 shadow-sm flex items-center gap-3">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg text-purple-600 dark:text-purple-400">
                  <Zap size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-blue-300 uppercase font-bold tracking-wider">XP Total</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-white">{levelStatus.global.xp.toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-white dark:bg-blue-900 p-3 rounded-xl border dark:border-blue-800 shadow-sm flex items-center gap-3">
                <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg text-yellow-600 dark:text-yellow-400">
                  <Trophy size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-blue-300 uppercase font-bold tracking-wider">Nível</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-white">{levelStatus.global.level}</p>
                </div>
              </div>
              <div className="bg-white dark:bg-blue-900 p-3 rounded-xl border dark:border-blue-800 shadow-sm flex items-center gap-3">
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg text-red-600 dark:text-red-400">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-blue-300 uppercase font-bold tracking-wider">Ofensiva</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-white">{levelStatus.global.streak} dias</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-blue-900/50 p-6 rounded-2xl border dark:border-blue-800 shadow-sm hover:shadow-md transition-shadow">
            <div className={`${stat.iconBg} w-12 h-12 rounded-xl flex items-center justify-center ${stat.iconColor} mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-slate-500 dark:text-blue-300 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white mb-4">{stat.value}</p>
          </div>
        ))}
      </div>

      <DailyMissions />

      {/* Planejamento de Rotina com IA */}
      <div className="bg-white dark:bg-blue-900 p-8 rounded-2xl border dark:border-blue-800 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b dark:border-blue-800 pb-6">
          <div className="bg-blue-100 dark:bg-blue-950 p-3 rounded-2xl text-blue-600 dark:text-blue-400">
            <Target size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">Cronograma de Estudos IA</h2>
            <p className="text-sm text-slate-500 dark:text-blue-300 font-medium">Gere um planejamento estratégico de estudo semanal personalizado para seu vestibular.</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white flex flex-col lg:flex-row justify-between items-center gap-8 shadow-xl">
            <div className="max-w-md w-full space-y-5">
              <div>
                <h3 className="text-2xl font-black mb-2">Plano Estratégico do Vestibular</h3>
                <p className="text-blue-100 text-sm">Organize as semanas restantes até a prova de forma inteligente e personalizada.</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-blue-200">Próximos Vestibulares</label>
                <input 
                  type="text"
                  value={upcomingExamsInput}
                  onChange={(e) => setUpcomingExamsInput(e.target.value)}
                  className="w-full p-4 rounded-xl text-slate-800 bg-white/95 focus:ring-4 focus:ring-white/20 outline-none transition-all placeholder-indigo-300 font-semibold"
                  placeholder="Ex: ENEM, Fuvest, ITA, Unicamp"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-blue-200">Focar nas matérias mais desafiadoras</label>
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
                            ? 'bg-white text-blue-600 border-white shadow-sm scale-105'
                            : 'bg-blue-700/40 text-blue-100 border-blue-500 hover:bg-blue-700/60'
                        }`}
                      >
                        {subj}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center text-blue-100">
                  <label className="text-xs font-black uppercase tracking-widest text-blue-200">Período de estudos</label>
                  <span className="font-black text-xl">{planWeeks} {planWeeks === 1 ? 'Semana' : 'Semanas'}</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={planWeeks}
                  onChange={(e) => setPlanWeeks(Number(e.target.value))}
                  className="w-full h-2 bg-blue-400 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-4 shrink-0 w-full lg:w-auto">
              <button 
                onClick={handleGeneratePlan}
                disabled={isGeneratingPlan}
                className="w-full lg:w-auto bg-white text-blue-600 px-12 py-5 rounded-2xl font-black text-lg hover:bg-blue-50 hover:scale-105 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-md animate-pulse"
              >
                {isGeneratingPlan ? <Loader2 size={24} className="animate-spin text-blue-600" /> : <Clock size={24} />}
                <span>{isGeneratingPlan ? 'Gerando Plano...' : 'Criar Plano com IA'}</span>
              </button>
              <p className="text-[10px] text-blue-100 opacity-60 font-medium">Processado via Gemini-3 Flash</p>
            </div>
          </div>

          {studyPlan.length > 0 && (
            <div className="p-6 rounded-2xl border border-blue-100 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30 space-y-4 animate-in fade-in duration-300">
              <h4 className="text-lg font-black text-slate-800 dark:text-blue-100 flex items-center gap-2">
                <span>Cronograma IA Gerado</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studyPlan.map((week) => (
                  <div key={week.week} className="p-4 rounded-xl border border-blue-100 dark:border-blue-950 bg-white dark:bg-blue-900/50 shadow-sm space-y-2">
                    <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-950 px-3 py-1.5 rounded-lg">
                      <p className="font-bold text-xs text-blue-700 dark:text-blue-300">Semana {week.week}</p>
                      <span className="text-xs font-black text-blue-600 dark:text-blue-400">{week.estimatedHours}h semanais</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white text-sm">{week.topic}</p>
                      <p className="text-xs text-slate-500 dark:text-blue-300 mt-1">{week.focus}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-blue-900 p-8 rounded-2xl border dark:border-blue-800 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Progresso por Disciplina</h3>
        {loadingPerformance ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 size={32} className="text-blue-600 animate-spin" />
          </div>
        ) : performance.length > 0 ? (
          <div className="space-y-6">
            {Array.from(new Map(performance.map(p => [p.subject, p])).values()).map((p, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center gap-4">
                  <span className="font-bold text-slate-700 dark:text-blue-200 truncate">{p.subject}</span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400 shrink-0">{p.percentage}%</span>
                </div>
                <div className="h-3 bg-slate-100 dark:bg-blue-950 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-1000" 
                    style={{ width: `${p.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 dark:text-blue-300 text-center py-8">Nenhum quiz realizado ainda.</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-blue-900 p-8 rounded-2xl border dark:border-blue-800 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Desempenho por Disciplina (Gráfico)</h3>
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
                      <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e3a8a', border: 'none', borderRadius: '8px', color: '#f8fafc' }} />
                  <Legend formatter={(value) => <span className="text-slate-600 dark:text-slate-200">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-blue-950 rounded-full text-blue-500 w-fit mx-auto">
                  <Target size={28} />
                </div>
                <p className="text-slate-500 dark:text-blue-300 text-sm font-medium">Nenhum dado de desempenho cadastrado ainda.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-blue-900 p-8 rounded-2xl border dark:border-blue-800 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Progresso por Vestibular</h3>
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
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e3a8a', border: 'none', borderRadius: '8px', color: '#f8fafc' }} />
                <Bar dataKey="acertos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut / Rosca Chart for Daily Missions and Tasks */}
        <div className="bg-white dark:bg-blue-900 p-8 rounded-2xl border dark:border-blue-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Conclusão de Missões do Dia</h3>
            <p className="text-xs text-slate-500 dark:text-blue-300 font-medium mb-6">Visualização do percentual de conclusão das missões diárias.</p>
          </div>
          <div className="h-64 flex items-center justify-center relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              <span className="text-3xl font-black text-slate-800 dark:text-white leading-none">{missionsCompletionPercentage}%</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#10b981] mt-2 font-mono">Concluído</span>
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
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} itens`, 'Quantidade']} contentStyle={{ backgroundColor: '#1e3a8a', border: 'none', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col gap-2.5 w-full mt-4 pt-4 border-t dark:border-blue-800 text-sm font-bold text-slate-600 dark:text-blue-100">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 font-semibold text-slate-500 dark:text-blue-300">
                <span className="w-3 h-3 rounded-full bg-[#10b981]"></span>
                Missões Realizadas
              </span>
              <span className="font-mono text-sm">{completedMissionsCount} de {totalMissionsCount} ({missionsCompletionPercentage}%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 font-semibold text-slate-500 dark:text-blue-300">
                <span className="w-3 h-3 rounded-full bg-[#3b82f6]"></span>
                Missões Restantes
              </span>
              <span className="font-mono text-sm">{pendingMissionsCount} de {totalMissionsCount}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-blue-900 p-8 rounded-2xl border dark:border-blue-800 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Progresso Geral ao Longo do Tempo</h3>
          <div className="h-80 flex items-center justify-center">
            {quizHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={quizHistory}>
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e3a8a', border: 'none', borderRadius: '8px', color: '#f8fafc' }} />
                  <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-blue-950 rounded-full text-blue-500 w-fit mx-auto">
                  <Clock size={28} />
                </div>
                <p className="text-slate-500 dark:text-blue-300 text-sm font-medium">Sem dados históricos. Complete simulados para iniciar.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-blue-900 p-8 rounded-2xl border dark:border-blue-800 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <Trophy className="text-yellow-500" />
          Ranking de Desempenho
        </h3>
        <div className="space-y-4">
          {[
            { name: 'Ana Silva', score: 95, subject: 'Matemática' },
            { name: 'Você', score: 88, subject: 'Matemática' },
            { name: 'Carlos Souza', score: 82, subject: 'Matemática' },
            { name: 'Beatriz Lima', score: 79, subject: 'Matemática' },
          ].map((user, i) => (
            <div key={i} className={`flex items-center justify-between p-4 rounded-xl ${user.name === 'Você' ? 'bg-blue-50 dark:bg-blue-800/50' : 'bg-slate-50 dark:bg-blue-950'}`}>
              <div className="flex items-center gap-4 overflow-hidden">
                <span className={`font-bold text-lg shrink-0 ${i < 3 ? 'text-yellow-500' : 'text-slate-400'}`}>#{i + 1}</span>
                <span className="font-medium text-slate-800 dark:text-white truncate">{user.name}</span>
              </div>
              <div className="flex items-center gap-6 shrink-0 ml-4">
                <span className="text-sm text-slate-500 dark:text-blue-300 hidden sm:inline truncate max-w-[100px]">{user.subject}</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{user.score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* O antigo layout redundante foi integrado de forma harmoniosa no bloco unificado acima */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-blue-900 p-8 rounded-2xl border dark:border-blue-800 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Histórico de Simulados</h3>
          {quizHistory.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {quizHistory.map((h) => (
                <div key={h.id} className="flex justify-between items-center p-4 rounded-xl border border-blue-100 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">{h.vestibular}</p>
                    <p className="text-sm text-slate-500 dark:text-blue-300">{h.date}</p>
                  </div>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{h.score} / {h.totalQuestions}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 dark:text-blue-300 text-center py-8">Nenhum simulado realizado ainda.</p>
          )}
        </div>

        <div className="bg-white dark:bg-blue-900 p-8 rounded-2xl border dark:border-blue-800 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <FileText size={20} />
            Histórico de Redações
          </h3>
          {essayHistory.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {essayHistory.map((h) => (
                <div 
                  key={h.id} 
                  onClick={() => setSelectedEssay(h)}
                  className="flex justify-between items-center p-4 rounded-xl border border-purple-100 dark:border-purple-900 bg-purple-50 dark:bg-purple-950/30 hover:scale-[1.01] hover:shadow-sm active:scale-[0.99] transition-all cursor-pointer group"
                >
                  <div className="overflow-hidden">
                    <p className="font-bold text-slate-800 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-350 transition-colors">{h.theme}</p>
                    <p className="text-sm text-slate-500 dark:text-purple-300">{h.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        h.status === 'corrected' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                      }`}>
                        {h.status === 'corrected' ? 'Corrigida' : 'Rascunho'}
                      </span>
                    {h.status === 'corrected' && (
                      <span className="font-bold text-green-600 dark:text-green-400">{h.grade}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 dark:text-blue-300 text-center py-8">Nenhuma redação encontrada no histórico.</p>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedEssay(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white dark:bg-blue-900 w-full max-w-4xl rounded-[2.5rem] shadow-2xl border dark:border-blue-800 overflow-hidden relative max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 md:p-8 text-white relative shrink-0">
                <button 
                  onClick={() => setSelectedEssay(null)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/25 active:scale-95 text-white transition-all shadow-sm"
                >
                  <X size={20} />
                </button>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pr-10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-md">
                      {selectedEssay.status === 'corrected' ? 'Redação Corrigida' : 'Rascunho Salvo'}
                    </span>
                    <h3 className="text-xl md:text-2xl font-black leading-snug truncate max-w-xl" title={selectedEssay.theme}>
                      {selectedEssay.theme}
                    </h3>
                    <p className="text-xs text-blue-100 font-medium">Enviada em {selectedEssay.date}</p>
                  </div>
                  {selectedEssay.status === 'corrected' && selectedEssay.grade !== undefined && (
                    <div className="relative group shrink-0">
                      <div className="absolute inset-0 bg-white/25 blur-xl rounded-full"></div>
                      <div className="relative bg-white text-blue-600 w-20 h-20 md:w-24 md:h-24 rounded-full flex flex-col items-center justify-center border-4 border-white/30 shadow-lg">
                        <span className="text-2xl md:text-3xl font-black">{selectedEssay.grade}</span>
                        <span className="text-[8px] font-black uppercase tracking-widest mt-[-2px]">Nota</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-8 flex-1">
                {/* Texto da Redação */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-400 dark:text-blue-300 uppercase tracking-widest">Texto da Redação</h4>
                  <div className="p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-blue-950 bg-slate-50 dark:bg-blue-950/40 text-slate-800 dark:text-white font-serif text-lg leading-relaxed whitespace-pre-wrap shadow-inner max-h-80 overflow-y-auto">
                    {selectedEssay.essayText || 'Nenhum texto salvo para esta redação.'}
                  </div>
                </div>

                {/* Seção de Correção para Corrigidas */}
                {selectedEssay.status === 'corrected' ? (
                  <div className="space-y-8 pt-4 border-t border-slate-100 dark:border-blue-950">
                    {/* Competências com Barras */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-slate-400 dark:text-blue-300 uppercase tracking-widest">Desempenho por Competência</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedEssay.competencies && selectedEssay.competencies.map((c, i) => (
                          <div key={i} className="bg-slate-50/50 dark:bg-blue-950/20 p-5 rounded-2xl border border-slate-100 dark:border-blue-950 flex flex-col justify-between gap-3">
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 px-2.5 py-0.5 rounded">
                                  Comp. {i + 1}
                                </span>
                                <span className="font-mono text-sm font-black text-blue-600 dark:text-blue-400">{c.score} <span className="text-[10px] font-bold text-slate-400">/ 200</span></span>
                              </div>
                              <h5 className="font-bold text-slate-800 dark:text-white text-xs leading-tight mb-2">{c.name}</h5>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="h-1.5 bg-slate-100 dark:bg-blue-950 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                  style={{ width: `${(c.score / 200) * 100}%` }}
                                ></div>
                              </div>
                              <div className="text-[11px] space-y-1.5 text-slate-500 dark:text-blue-300">
                                <p><span className="font-bold text-green-600">Pontos Fortes:</span> {c.strengths}</p>
                                <p><span className="font-bold text-amber-600">Melhorar:</span> {c.weaknesses}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Destaques e Evolução */}
                    {selectedEssay.generalCorrection && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-blue-950">
                        <div className="space-y-3 p-6 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-3xl border border-emerald-500/20">
                          <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle size={22} />
                            <h4 className="font-black text-sm uppercase tracking-wide">Destaques Positivos</h4>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-blue-100 leading-relaxed italic">
                            {selectedEssay.generalCorrection}
                          </p>
                        </div>

                        {selectedEssay.competencies && selectedEssay.competencies[0] && (
                          <div className="space-y-3 p-6 bg-amber-500/5 dark:bg-amber-500/10 rounded-3xl border border-amber-500/20">
                            <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400">
                              <Award size={22} className="rotate-12" />
                              <h4 className="font-black text-sm uppercase tracking-wide">Plano de Evolução</h4>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-blue-100 leading-relaxed font-medium">
                              {selectedEssay.competencies[0].improvementExample || selectedEssay.competencies[0].weaknesses}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 bg-amber-500/5 rounded-3xl border border-amber-500/20 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                    <div className="bg-amber-100 dark:bg-amber-950/50 p-3 rounded-2xl text-amber-600 dark:text-amber-400">
                      <FileText size={28} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white">Este é um rascunho de redação</h4>
                      <p className="text-sm text-slate-500 dark:text-blue-300">Ela foi salva como rascunho e ainda não foi submetida para avaliação técnica.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-5 bg-slate-50 dark:bg-blue-950 border-t dark:border-blue-800 flex justify-end gap-3 shrink-0">
                <button 
                  onClick={() => setSelectedEssay(null)}
                  className="px-6 py-3 rounded-xl font-bold bg-white dark:bg-blue-900 border dark:border-blue-800 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-blue-800 transition-all text-sm"
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
