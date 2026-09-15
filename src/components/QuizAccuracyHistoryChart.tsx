import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Area,
  ComposedChart,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Calendar,
  CheckCircle2,
  SlidersHorizontal,
  Info,
  Sparkles,
  HelpCircle,
  Eye,
  BarChart2,
} from 'lucide-react';

export interface QuizHistoryItemInput {
  id: string;
  vestibular: string;
  score: number;
  totalQuestions: number;
  date: string;
  timestamp?: any;
  subjectStats?: Record<string, { total: number; correct: number }>;
}

interface QuizAccuracyHistoryChartProps {
  quizHistory: QuizHistoryItemInput[];
  targetAccuracy?: number;
  className?: string;
}

// Realistic demo dataset for users who haven't accumulated multiple quizzes yet
const DEMO_QUIZ_HISTORY: QuizHistoryItemInput[] = [
  { id: 'demo-1', vestibular: 'ENEM', score: 9, totalQuestions: 15, date: '04/01', timestamp: 1735992000000 },
  { id: 'demo-2', vestibular: 'FUVEST', score: 10, totalQuestions: 15, date: '11/01', timestamp: 1736596800000 },
  { id: 'demo-3', vestibular: 'ENEM', score: 12, totalQuestions: 15, date: '18/01', timestamp: 1737201600000 },
  { id: 'demo-4', vestibular: 'UNICAMP', score: 11, totalQuestions: 15, date: '25/01', timestamp: 1737806400000 },
  { id: 'demo-5', vestibular: 'ENEM', score: 13, totalQuestions: 15, date: '01/02', timestamp: 1738411200000 },
  { id: 'demo-6', vestibular: 'UNESP', score: 13, totalQuestions: 15, date: '08/02', timestamp: 1739016000000 },
  { id: 'demo-7', vestibular: 'ENEM', score: 14, totalQuestions: 15, date: '15/02', timestamp: 1739620800000 },
  { id: 'demo-8', vestibular: 'UERJ', score: 13, totalQuestions: 15, date: '22/02', timestamp: 1740225600000 },
  { id: 'demo-9', vestibular: 'ENEM', score: 15, totalQuestions: 15, date: '01/03', timestamp: 1740830400000 },
];

export default function QuizAccuracyHistoryChart({
  quizHistory,
  targetAccuracy = 80,
  className = '',
}: QuizAccuracyHistoryChartProps) {
  // Mode: percentage ('percent') or raw score ('count')
  const [metricMode, setMetricMode] = useState<'percent' | 'count'>('percent');
  // Range: 'all' | '5' | '10' | '20'
  const [rangeLimit, setRangeLimit] = useState<'5' | '10' | '20' | 'all'>('10');
  // Selected Exam filter
  const [selectedExam, setSelectedExam] = useState<string>('all');
  // Display features
  const [showTrendLine, setShowTrendLine] = useState<boolean>(true);
  const [showTargetLine, setShowTargetLine] = useState<boolean>(true);

  // If user has fewer than 2 quizzes, allow toggling demo view to explore
  const hasRealData = quizHistory && quizHistory.length >= 2;
  const [useDemoData, setUseDemoData] = useState<boolean>(!hasRealData);

  // When real data changes and exceeds 1, switch off demo automatically
  React.useEffect(() => {
    if (quizHistory && quizHistory.length >= 2) {
      setUseDemoData(false);
    }
  }, [quizHistory?.length]);

  // Extract source list
  const activeSourceList = useMemo(() => {
    if (useDemoData || !quizHistory || quizHistory.length === 0) {
      return DEMO_QUIZ_HISTORY;
    }
    return quizHistory;
  }, [useDemoData, quizHistory]);

  // Available exam filters
  const availableExams = useMemo(() => {
    const set = new Set<string>();
    activeSourceList.forEach((item) => {
      if (item.vestibular) set.add(item.vestibular);
    });
    return Array.from(set);
  }, [activeSourceList]);

  // Process data chronologically (oldest to newest: left to right)
  const chartData = useMemo(() => {
    if (!activeSourceList || activeSourceList.length === 0) return [];

    // Clone and sort chronologically (oldest first)
    const sorted = [...activeSourceList].sort((a, b) => {
      const getMillis = (item: QuizHistoryItemInput) => {
        if (!item.timestamp) return 0;
        if (typeof item.timestamp?.toMillis === 'function') return item.timestamp.toMillis();
        if (typeof item.timestamp?.seconds === 'number') return item.timestamp.seconds * 1000;
        if (item.timestamp instanceof Date) return item.timestamp.getTime();
        if (typeof item.timestamp === 'number') return item.timestamp;
        const parsed = Date.parse(item.timestamp);
        return isNaN(parsed) ? 0 : parsed;
      };

      const timeA = getMillis(a);
      const timeB = getMillis(b);

      if (timeA !== 0 && timeB !== 0) {
        return timeA - timeB;
      }
      // Fallback: stable preserve
      return 0;
    });

    // Apply exam filter
    const filteredByExam = selectedExam === 'all'
      ? sorted
      : sorted.filter((q) => q.vestibular?.toLowerCase() === selectedExam.toLowerCase());

    // Apply range limit (takes the last N items)
    let sliced = filteredByExam;
    if (rangeLimit !== 'all') {
      const count = parseInt(rangeLimit, 10);
      sliced = filteredByExam.slice(-count);
    }

    // Cumulative sum tracker for running average
    let cumulativeScore = 0;
    let cumulativeTotal = 0;

    return sliced.map((item, index) => {
      const total = item.totalQuestions > 0 ? item.totalQuestions : 1;
      const score = Math.max(0, Math.min(item.score, total));
      const accuracy = Math.round((score / total) * 100);

      cumulativeScore += score;
      cumulativeTotal += total;
      const cumulativeAccuracy = Math.round((cumulativeScore / cumulativeTotal) * 100);

      // Short readable date/label for X Axis
      const shortDate = item.date ? item.date.replace('/2026', '').replace('/2025', '').replace('/2024', '') : `Q${index + 1}`;
      const displayLabel = `#${index + 1} (${shortDate})`;

      return {
        id: item.id,
        index: index + 1,
        displayLabel,
        date: item.date || 'Recente',
        vestibular: item.vestibular || 'Simulado',
        score,
        totalQuestions: total,
        wrongAnswers: total - score,
        accuracy,
        cumulativeAccuracy,
        targetAccuracy,
      };
    });
  }, [activeSourceList, selectedExam, rangeLimit, targetAccuracy]);

  // Key performance indicators (KPIs)
  const stats = useMemo(() => {
    if (chartData.length === 0) {
      return {
        averageAccuracy: 0,
        highestAccuracy: 0,
        latestAccuracy: 0,
        trendDiff: 0,
        totalQuizzes: 0,
        totalResolved: 0,
        totalCorrect: 0,
      };
    }

    const totalCorrect = chartData.reduce((acc, curr) => acc + curr.score, 0);
    const totalResolved = chartData.reduce((acc, curr) => acc + curr.totalQuestions, 0);
    const averageAccuracy = totalResolved > 0 ? Math.round((totalCorrect / totalResolved) * 100) : 0;
    const highestAccuracy = Math.max(...chartData.map((d) => d.accuracy));
    const latestAccuracy = chartData[chartData.length - 1].accuracy;

    // Trend comparing last quiz to the first quiz in view
    const firstAccuracy = chartData[0].accuracy;
    const trendDiff = latestAccuracy - firstAccuracy;

    return {
      averageAccuracy,
      highestAccuracy,
      latestAccuracy,
      trendDiff,
      totalQuizzes: chartData.length,
      totalResolved,
      totalCorrect,
    };
  }, [chartData]);

  return (
    <div
      className={`bg-[var(--bg-card)] text-[var(--text-main)] p-6 sm:p-8 rounded-2xl border border-[var(--border-light)] shadow-sm transition-all ${className}`}
      id="quiz-accuracy-history-section"
    >
      {/* HEADER WITH TITLE, TAGS AND ACTION CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-[var(--border-light)]">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2 rounded-xl bg-blue-500/10 text-[var(--primary)] border border-blue-500/20">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-main)]">
              Histórico de Acertos nos Quizzes
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-[var(--primary)] border border-blue-500/20">
              Evolução Temporal
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1.5 max-w-2xl">
            Acompanhe o rendimento e a precisão dos seus acertos ao longo das semanas para identificar
            picos de desempenho e consistência de aprovação.
          </p>
        </div>

        {/* DEMO / REAL DATA TOGGLE IF LESS THAN 2 QUIZZES */}
        <div className="flex items-center gap-2 flex-wrap self-start lg:self-center">
          {!hasRealData && (
            <button
              type="button"
              onClick={() => setUseDemoData((prev) => !prev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                useDemoData
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  : 'bg-[var(--bg-hover)] text-[var(--text-muted)] border-[var(--border-light)] hover:text-[var(--text-main)]'
              }`}
              title="Alternar entre simulação demonstrativa e dados reais"
            >
              <Sparkles size={13} className={useDemoData ? 'text-amber-400' : ''} />
              <span>{useDemoData ? 'Modo Exemplo Ativo' : 'Ver Modo Exemplo'}</span>
            </button>
          )}

          {/* Metric Switcher: % vs Quantidade */}
          <div className="flex items-center bg-[var(--bg-hover)] p-1 rounded-xl border border-[var(--border-light)]">
            <button
              type="button"
              onClick={() => setMetricMode('percent')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                metricMode === 'percent'
                  ? 'bg-[var(--primary)] text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Taxa de Acertos (%)
            </button>
            <button
              type="button"
              onClick={() => setMetricMode('count')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                metricMode === 'count'
                  ? 'bg-[var(--primary)] text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Nº de Acertos
            </button>
          </div>
        </div>
      </div>

      {/* DEMO DATA NOTICE BANNER */}
      {useDemoData && (
        <div className="mt-4 p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-between gap-3 text-xs text-blue-200">
          <div className="flex items-center gap-2">
            <Info size={16} className="text-blue-400 shrink-0" />
            <span>
              <strong>Modo de Exemplo:</strong> Visualizando histórico simulado de simulados. Ao responder aos quizzes da plataforma, seus dados reais alimentarão este gráfico automaticamente.
            </span>
          </div>
          {quizHistory && quizHistory.length > 0 && (
            <button
              onClick={() => setUseDemoData(false)}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-[11px] font-bold shrink-0 transition-colors cursor-pointer"
            >
              Usar Meus {quizHistory.length} Quiz(zes)
            </button>
          )}
        </div>
      )}

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-6">
        {/* Média de Acerto */}
        <div className="p-4 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] flex flex-col justify-between">
          <span className="text-xs font-medium text-[var(--text-muted)]">Média de Acertos</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl sm:text-3xl font-black text-[var(--text-main)] font-mono">
              {stats.averageAccuracy}%
            </span>
            <span className="text-xs font-semibold text-[var(--text-muted)]">geral</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                stats.averageAccuracy >= targetAccuracy ? 'bg-emerald-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(100, stats.averageAccuracy)}%` }}
            />
          </div>
        </div>

        {/* Melhor Desempenho */}
        <div className="p-4 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] flex flex-col justify-between">
          <span className="text-xs font-medium text-[var(--text-muted)]">Melhor Desempenho</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              {stats.highestAccuracy}%
            </span>
            <Award size={16} className="text-amber-400" />
          </div>
          <span className="text-[11px] text-[var(--text-muted)] mt-2.5 truncate">
            Pico de assertividade
          </span>
        </div>

        {/* Último Resultado & Tendência */}
        <div className="p-4 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] flex flex-col justify-between">
          <span className="text-xs font-medium text-[var(--text-muted)]">Último Simulado</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl sm:text-3xl font-black text-[var(--text-main)] font-mono">
              {stats.latestAccuracy}%
            </span>
            {stats.trendDiff > 0 ? (
              <span className="text-xs font-bold text-emerald-400 flex items-center">
                <TrendingUp size={12} className="mr-0.5" />+{stats.trendDiff}%
              </span>
            ) : stats.trendDiff < 0 ? (
              <span className="text-xs font-bold text-rose-400 flex items-center">
                <TrendingDown size={12} className="mr-0.5" />{stats.trendDiff}%
              </span>
            ) : (
              <span className="text-xs font-bold text-slate-400">= Estável</span>
            )}
          </div>
          <span className="text-[11px] text-[var(--text-muted)] mt-2.5">
            {stats.trendDiff >= 0 ? 'Trajetória ascendente' : 'Oscilação normal'}
          </span>
        </div>

        {/* Total de Questões */}
        <div className="p-4 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] flex flex-col justify-between">
          <span className="text-xs font-medium text-[var(--text-muted)]">Volume Analisado</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl sm:text-3xl font-black text-[var(--text-main)] font-mono">
              {stats.totalCorrect}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">/ {stats.totalResolved} qsts</span>
          </div>
          <span className="text-[11px] text-[var(--text-muted)] mt-2.5">
            {stats.totalQuizzes} simulados no filtro
          </span>
        </div>
      </div>

      {/* FILTER BAR: RANGE, EXAM, AND TOGGLES */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-3 px-4 rounded-xl bg-[var(--bg-hover)]/60 border border-[var(--border-light)] mb-6 text-xs">
        {/* Left: Range and Exam Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Range Limit */}
          <div className="flex items-center gap-1.5">
            <span className="text-[var(--text-muted)] font-semibold">Exibir:</span>
            {(['5', '10', '20', 'all'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRangeLimit(r)}
                className={`px-2 py-1 rounded-md font-bold transition-all cursor-pointer ${
                  rangeLimit === r
                    ? 'bg-[var(--primary)] text-white'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-card)]'
                }`}
              >
                {r === 'all' ? 'Todos' : `Últimos ${r}`}
              </button>
            ))}
          </div>

          {/* Exam Filter if more than 1 available */}
          {availableExams.length > 1 && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-[var(--border-light)]">
              <span className="text-[var(--text-muted)] font-semibold">Exame:</span>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-light)] rounded-md px-2 py-1 text-xs font-semibold focus:outline-none focus:border-[var(--primary)] cursor-pointer"
              >
                <option value="all">Todos os Vestibulares</option>
                {availableExams.map((ex) => (
                  <option key={ex} value={ex}>
                    {ex}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Right: Feature Toggles */}
        <div className="flex items-center gap-4 flex-wrap">
          <label className="flex items-center gap-1.5 text-[var(--text-muted)] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showTrendLine}
              onChange={(e) => setShowTrendLine(e.target.checked)}
              className="accent-[var(--primary)] rounded cursor-pointer"
            />
            <span className="font-semibold text-emerald-400">Linha de Tendência</span>
          </label>

          <label className="flex items-center gap-1.5 text-[var(--text-muted)] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showTargetLine}
              onChange={(e) => setShowTargetLine(e.target.checked)}
              className="accent-[var(--primary)] rounded cursor-pointer"
            />
            <span className="font-semibold text-amber-400">Meta ({targetAccuracy}%)</span>
          </label>
        </div>
      </div>

      {/* THE RECHARTS LINE CHART CANVAS */}
      <div className="h-80 sm:h-96 w-full relative">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 24, left: -10, bottom: 20 }}
            >
              {/* Subtle Gradient for Area Under Curve */}
              <defs>
                <linearGradient id="quizAccuracyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-light)"
                opacity={0.6}
                vertical={false}
              />

              {/* X Axis */}
              <XAxis
                dataKey="displayLabel"
                stroke="var(--text-muted)"
                fontSize={11}
                tickLine={false}
                dy={8}
                tick={{ fill: 'var(--text-muted)' }}
              />

              {/* Y Axis */}
              <YAxis
                stroke="var(--text-muted)"
                fontSize={11}
                tickLine={false}
                domain={metricMode === 'percent' ? [0, 100] : [0, 'dataMax + 2']}
                tickFormatter={(val) => (metricMode === 'percent' ? `${val}%` : `${val}`)}
                tick={{ fill: 'var(--text-muted)' }}
                dx={-4}
              />

              {/* Custom Recharts Tooltip */}
              <Tooltip
                content={<CustomTooltip metricMode={metricMode} targetAccuracy={targetAccuracy} />}
              />

              {/* Target Goal Reference Line */}
              {showTargetLine && metricMode === 'percent' && (
                <ReferenceLine
                  y={targetAccuracy}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: `Meta (${targetAccuracy}%)`,
                    fill: '#f59e0b',
                    fontSize: 11,
                    position: 'top',
                    fontWeight: 'bold',
                  }}
                />
              )}

              {/* Gradient Area Glow Under the Line */}
              {metricMode === 'percent' && (
                <Area
                  type="monotone"
                  dataKey="accuracy"
                  stroke="none"
                  fill="url(#quizAccuracyGradient)"
                  isAnimationActive={true}
                />
              )}

              {/* Primary Line: Quiz Accuracy or Score */}
              <Line
                type="monotone"
                dataKey={metricMode === 'percent' ? 'accuracy' : 'score'}
                name={metricMode === 'percent' ? 'Taxa de Acertos (%)' : 'Acertos'}
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{
                  r: 4.5,
                  fill: '#3b82f6',
                  stroke: '#0B0E14',
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 7,
                  fill: '#60a5fa',
                  stroke: '#ffffff',
                  strokeWidth: 2.5,
                }}
                isAnimationActive={true}
              />

              {/* Secondary Line: Cumulative Trend Moving Average */}
              {showTrendLine && metricMode === 'percent' && (
                <Line
                  type="monotone"
                  dataKey="cumulativeAccuracy"
                  name="Média Acumulada (Tendência)"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: '#10b981',
                    stroke: '#ffffff',
                    strokeWidth: 2,
                  }}
                  isAnimationActive={true}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-[var(--border-light)] rounded-xl">
            <div className="p-3 bg-blue-500/10 rounded-full text-blue-400 mb-3">
              <BarChart2 size={32} />
            </div>
            <h4 className="font-bold text-base text-[var(--text-main)]">Nenhum quiz no filtro selecionado</h4>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mt-1">
              Tente selecionar outro exame ou mudar o período para visualizar seu progresso.
            </p>
          </div>
        )}
      </div>

      {/* BOTTOM LEGEND & INTERPRETATION GUIDE */}
      <div className="mt-4 pt-4 border-t border-[var(--border-light)] flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-5 flex-wrap">
          {/* Main Line Legend */}
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-1 bg-[#3b82f6] rounded-full" />
            <span className="font-semibold text-[var(--text-main)]">
              {metricMode === 'percent' ? 'Taxa de Acertos no Simulado' : 'Nº de Acertos'}
            </span>
          </div>

          {/* Trend Line Legend */}
          {showTrendLine && metricMode === 'percent' && (
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-0.5 border-t-2 border-dashed border-[#10b981]" />
              <span className="font-semibold text-emerald-400">Média Acumulada</span>
            </div>
          )}

          {/* Goal Line Legend */}
          {showTargetLine && metricMode === 'percent' && (
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-0.5 border-t-2 border-dashed border-amber-400" />
              <span className="font-semibold text-amber-400">Alvo de Aprovação ({targetAccuracy}%)</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
          <HelpCircle size={14} className="text-[var(--primary)]" />
          <span>Passe o mouse sobre os pontos para ver o detalhamento do simulado</span>
        </div>
      </div>
    </div>
  );
}

// CUSTOM TOOLTIP COMPONENT FOR RECHARTS
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  metricMode: 'percent' | 'count';
  targetAccuracy: number;
}

function CustomTooltip({ active, payload, metricMode, targetAccuracy }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const isAboveTarget = data.accuracy >= targetAccuracy;

  return (
    <div className="bg-[#10141D] text-white p-4 rounded-xl border border-white/15 shadow-2xl backdrop-blur-md min-w-[210px] select-none text-xs">
      {/* Tooltip Header */}
      <div className="flex items-center justify-between gap-2 pb-2 mb-2.5 border-b border-white/10">
        <span className="font-bold text-sky-400 flex items-center gap-1">
          <Calendar size={12} />
          {data.date}
        </span>
        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-white/10 text-white border border-white/10">
          {data.vestibular}
        </span>
      </div>

      {/* Accuracy Percentage */}
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-slate-400 font-medium">Aproveitamento:</span>
        <span
          className={`font-mono text-base font-black ${
            data.accuracy >= 80
              ? 'text-emerald-400'
              : data.accuracy >= 65
              ? 'text-blue-400'
              : 'text-amber-400'
          }`}
        >
          {data.accuracy}%
        </span>
      </div>

      {/* Score and Total */}
      <div className="flex items-center justify-between text-slate-300 mb-1">
        <span className="text-slate-400">Acertos:</span>
        <span className="font-bold text-white font-mono">
          {data.score} de {data.totalQuestions} questões
        </span>
      </div>

      {/* Wrong Answers */}
      <div className="flex items-center justify-between text-slate-400 mb-2.5">
        <span>Erros:</span>
        <span className="font-mono text-rose-400">{data.wrongAnswers} questões</span>
      </div>

      {/* Running Cumulative Average */}
      {data.cumulativeAccuracy !== undefined && (
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
          <span className="text-emerald-400 font-medium">Média até este ponto:</span>
          <span className="font-mono font-bold text-emerald-400">{data.cumulativeAccuracy}%</span>
        </div>
      )}

      {/* Target Evaluation Badge */}
      <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center gap-1.5">
        <div
          className={`w-2 h-2 rounded-full ${isAboveTarget ? 'bg-emerald-400' : 'bg-amber-400'}`}
        />
        <span className="text-[10px] text-slate-300 font-medium">
          {isAboveTarget ? 'Acima da meta de aprovação' : 'Abaixo da meta recomendada'}
        </span>
      </div>
    </div>
  );
}
