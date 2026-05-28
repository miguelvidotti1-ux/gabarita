import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from 'recharts';
import { Trophy, Target, Clock, BookOpen, Loader2, FileText, Zap, CheckCircle, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { generateStudyPlan, StudyPlan } from '../services/geminiService';
import { levelSystem, LevelSystemStatus } from '../services/levelService';
import DailyMissions from './DailyMissions';
import StudyDashboard from './StudyDashboard';
import { collection, getDocs, query, where, doc, setDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';

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

interface EssayHistoryItem {
  id: string;
  theme: string;
  status: string;
  grade?: number;
  date: string;
}

export default function Dashboard() {
  const [studyPlan, setStudyPlan] = useState<StudyPlan[]>([]);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [planWeeks, setPlanWeeks] = useState(4);
  const [difficulties, setDifficulties] = useState<string[]>(['', '', '', '']);
  const [upcomingExamsInput, setUpcomingExamsInput] = useState('');
  const [performance, setPerformance] = useState<SubjectPerformance[]>([]);
  const [goals, setGoals] = useState<Record<string, Goal>>({});
  const [quizHistory, setQuizHistory] = useState<QuizHistoryItem[]>([]);
  const [essayHistory, setEssayHistory] = useState<EssayHistoryItem[]>([]);
  const [loadingPerformance, setLoadingPerformance] = useState(true);
  const [levelStatus, setLevelStatus] = useState<LevelSystemStatus | null>(null);
  const [stats, setStats] = useState({
    resolvedQuestions: 0,
    accuracyRate: 0,
    studyTime: '0h',
    simulatedCount: 0
  });
  const [vestibularStats, setVestibularStats] = useState<{ name: string, acertos: number, total: number }[]>([]);

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
        
        // Load Level System Status
        setLevelStatus(levelSystem.getStatus());

        const essaysHistoryData: EssayHistoryItem[] = essaysSnap.docs.map(doc => {
          const d = doc.data();
          return {
            id: doc.id,
            theme: d.theme || 'Sem tema',
            status: d.status || 'rascunho',
            grade: d.grade,
            date: d.timestamp ? d.timestamp.toDate().toLocaleDateString() : 'N/A'
          };
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
    { label: 'Questões Resolvidas', value: stats.resolvedQuestions.toLocaleString(), icon: BookOpen, color: 'blue' },
    { label: 'Taxa de Acerto', value: `${stats.accuracyRate}%`, icon: Target, color: 'green' },
    { label: 'Tempo de Estudo', value: stats.studyTime, icon: Clock, color: 'purple' },
    { label: 'Simulados', value: stats.simulatedCount.toString(), icon: Trophy, color: 'yellow' },
  ];

  const handleGeneratePlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const weakSubjects = difficulties.filter(d => d.trim() !== '');
      const upcomingExams = upcomingExamsInput.split(',').map(e => e.trim()).filter(e => e !== '');
      
      if (weakSubjects.length === 0 || upcomingExams.length === 0) {
        alert("Por favor, preencha pelo menos uma matéria com dificuldade e um próximo vestibular.");
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
            <div className={`bg-${stat.color}-100 dark:bg-${stat.color}-900/30 w-12 h-12 rounded-xl flex items-center justify-center text-${stat.color}-600 dark:text-${stat.color}-400 mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-slate-500 dark:text-blue-300 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white mb-4">{stat.value}</p>
          </div>
        ))}
      </div>

      <DailyMissions />

      <StudyDashboard />

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
          <div className="h-80">
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
                <Legend formatter={(value) => <span className="text-slate-200">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
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

        <div className="bg-white dark:bg-blue-900 p-8 rounded-2xl border dark:border-blue-800 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Progresso Geral ao Longo do Tempo</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={quizHistory}>
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e3a8a', border: 'none', borderRadius: '8px', color: '#f8fafc' }} />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
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

      <div className="bg-blue-600 rounded-2xl p-8 text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-xl shadow-blue-200 dark:shadow-none">
        <div className="max-w-md w-full space-y-4">
          <div>
            <h3 className="text-2xl font-black mb-2">Plano de Estudos IA</h3>
            <p className="text-blue-100 mb-4">Personalize seu cronograma com inteligência.</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-blue-200">Próximos Vestibulares</label>
            <input 
              type="text"
              value={upcomingExamsInput}
              onChange={(e) => setUpcomingExamsInput(e.target.value)}
              className="w-full p-4 rounded-xl text-slate-800 bg-white/95 focus:ring-4 focus:ring-white/20 outline-none transition-all"
              placeholder="Ex: ENEM, Fuvest, ITA"
            />
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center text-blue-100">
              <label className="text-xs font-black uppercase tracking-widest text-blue-200">Duração do Plano</label>
              <span className="font-black text-xl">{planWeeks} {planWeeks === 1 ? 'Semana' : 'Semanas'}</span>
            </div>
            <input 
              type="range"
              min="1"
              max="12"
              step="1"
              value={planWeeks}
              onChange={(e) => setPlanWeeks(Number(e.target.value))}
              className="w-full h-2 bg-blue-400 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={handleGeneratePlan}
            disabled={isGeneratingPlan}
            className="w-full md:w-auto bg-white text-blue-600 px-12 py-5 rounded-2xl font-black text-xl hover:bg-blue-50 hover:scale-105 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isGeneratingPlan ? <Loader2 size={24} className="animate-spin" /> : <Clock size={24} />}
            <span>{isGeneratingPlan ? 'Gerando...' : 'Criar Plano'}</span>
          </button>
          <p className="text-[10px] text-blue-100 opacity-60 font-medium">Geração via Gemini-3 Flash Preview</p>
        </div>
      </div>

      {studyPlan.length > 0 && (
        <div className="bg-white dark:bg-blue-900 p-8 rounded-2xl border dark:border-blue-800 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Seu Plano de Estudos Detalhado</h3>
          <div className="space-y-4">
            {studyPlan.map((week) => (
              <div key={week.week} className="p-4 rounded-xl border border-blue-100 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-bold text-slate-800 dark:text-white">Semana {week.week}: {week.topic}</p>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{week.estimatedHours}h</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-blue-200">{week.focus}</p>
              </div>
            ))}
          </div>
        </div>
      )}

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
                <div key={h.id} className="flex justify-between items-center p-4 rounded-xl border border-purple-100 dark:border-purple-900 bg-purple-50 dark:bg-purple-950/30">
                  <div className="overflow-hidden">
                    <p className="font-bold text-slate-800 dark:text-white truncate">{h.theme}</p>
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
    </div>
  );
}
