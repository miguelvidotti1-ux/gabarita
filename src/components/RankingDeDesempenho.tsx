import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Medal,
  Crown,
  Flame,
  Zap,
  TrendingUp,
  Target,
  ArrowUpRight,
  Sparkles,
  Filter,
  CheckCircle2,
  Info,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../firebase';

export type RankingMetric = 'geral' | 'xp' | 'questoes' | 'streak' | 'redacao';
export type VestibularFilter = 'TODOS' | 'ENEM' | 'FUVEST' | 'UNICAMP' | 'UNESP';

export interface RankingUserData {
  id: string;
  name: string;
  avatarText?: string;
  score: number; // Porcentagem geral ou pontuação
  xp: number;
  questoesResolvidas: number;
  streakDias: number;
  notaRedacao: number;
  subject: string;
  targetVestibular: string;
  badge?: string;
  isCurrentUser?: boolean;
}

interface RankingDeDesempenhoProps {
  currentUserScore?: number;
  currentUserResolvedCount?: number;
  currentUserAccuracy?: number;
  currentUserStreak?: number;
  currentUserVestibular?: string;
  onNavigateToStudy?: () => void;
}

// Base de concorrentes e estudantes simulados de alto nível para vestibular
const MOCK_LEADERBOARD_STUDENTS: Omit<RankingUserData, 'isCurrentUser'>[] = [
  {
    id: 'student_1',
    name: 'Ana Beatriz Silva',
    score: 96,
    xp: 4850,
    questoesResolvidas: 1420,
    streakDias: 28,
    notaRedacao: 960,
    subject: 'Matemática & Natureza',
    targetVestibular: 'FUVEST',
    badge: 'Medicina USP'
  },
  {
    id: 'student_2',
    name: 'Lucas Mendonça',
    score: 93,
    xp: 4320,
    questoesResolvidas: 1280,
    streakDias: 21,
    notaRedacao: 940,
    subject: 'Física & Matemática',
    targetVestibular: 'UNICAMP',
    badge: 'Eng. Computação'
  },
  {
    id: 'student_3',
    name: 'Camila Rocha',
    score: 91,
    xp: 3950,
    questoesResolvidas: 1150,
    streakDias: 19,
    notaRedacao: 980,
    subject: 'Linguagens & Redação',
    targetVestibular: 'ENEM',
    badge: 'Direito SanFran'
  },
  {
    id: 'student_4',
    name: 'Carlos Eduardo Souza',
    score: 87,
    xp: 3410,
    questoesResolvidas: 990,
    streakDias: 14,
    notaRedacao: 900,
    subject: 'Biologia & Química',
    targetVestibular: 'UNESP',
    badge: 'Biomedicina'
  },
  {
    id: 'student_5',
    name: 'Beatriz Lima Santos',
    score: 84,
    xp: 3100,
    questoesResolvidas: 870,
    streakDias: 12,
    notaRedacao: 880,
    subject: 'História & Geografia',
    targetVestibular: 'ENEM',
    badge: 'Relações Internacionais'
  },
  {
    id: 'student_6',
    name: 'Guilherme Siqueira',
    score: 81,
    xp: 2850,
    questoesResolvidas: 760,
    streakDias: 9,
    notaRedacao: 860,
    subject: 'Matemática',
    targetVestibular: 'FUVEST',
    badge: 'Economia'
  },
  {
    id: 'student_7',
    name: 'Juliana Paes Correia',
    score: 79,
    xp: 2540,
    questoesResolvidas: 690,
    streakDias: 8,
    notaRedacao: 840,
    subject: 'Química',
    targetVestibular: 'UNICAMP',
    badge: 'Farmácia'
  },
  {
    id: 'student_8',
    name: 'Felipe Barreto',
    score: 76,
    xp: 2200,
    questoesResolvidas: 610,
    streakDias: 6,
    notaRedacao: 820,
    subject: 'Humanas',
    targetVestibular: 'UNESP',
    badge: 'História'
  }
];

export default function RankingDeDesempenho({
  currentUserScore = 88,
  currentUserResolvedCount = 420,
  currentUserAccuracy = 88,
  currentUserStreak = 7,
  currentUserVestibular = 'ENEM',
  onNavigateToStudy
}: RankingDeDesempenhoProps) {
  const [metric, setMetric] = useState<RankingMetric>('geral');
  const [selectedVestibular, setSelectedVestibular] = useState<VestibularFilter>('TODOS');
  const [showPodiumDetails, setShowPodiumDetails] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Identificação do usuário logado
  const currentUserName = auth.currentUser?.displayName || 'Você';

  // Monta lista completa com o usuário real inserido com base nos seus dados
  const fullList: RankingUserData[] = useMemo(() => {
    // Calculo do XP do usuário atual a partir de questoes resolvidas e acertos
    const calculatedUserXP = Math.max(1200, currentUserResolvedCount * 12 + currentUserAccuracy * 15);
    const userEstimatedRedacao = 860 + Math.min(100, Math.round(currentUserAccuracy * 1.2));

    const currentUserEntry: RankingUserData = {
      id: 'current_user_me',
      name: currentUserName,
      score: currentUserAccuracy > 0 ? currentUserAccuracy : currentUserScore,
      xp: calculatedUserXP,
      questoesResolvidas: currentUserResolvedCount,
      streakDias: Math.max(1, currentUserStreak),
      notaRedacao: userEstimatedRedacao,
      subject: 'Geral dos Simulados',
      targetVestibular: currentUserVestibular ? currentUserVestibular.toUpperCase() : 'ENEM',
      badge: 'Estudante Focado',
      isCurrentUser: true
    };

    let list = [...MOCK_LEADERBOARD_STUDENTS.map(s => ({ ...s, isCurrentUser: false })), currentUserEntry];

    // Filtro por vestibular
    if (selectedVestibular !== 'TODOS') {
      list = list.filter(item => 
        item.isCurrentUser || item.targetVestibular.toUpperCase() === selectedVestibular
      );
    }

    // Filtro de busca textual
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(item => 
        item.name.toLowerCase().includes(term) ||
        item.subject.toLowerCase().includes(term) ||
        (item.badge && item.badge.toLowerCase().includes(term))
      );
    }

    // Ordenação dinâmica pela métrica selecionada
    list.sort((a, b) => {
      if (metric === 'geral') return b.score - a.score;
      if (metric === 'xp') return b.xp - a.xp;
      if (metric === 'questoes') return b.questoesResolvidas - a.questoesResolvidas;
      if (metric === 'streak') return b.streakDias - a.streakDias;
      if (metric === 'redacao') return b.notaRedacao - a.notaRedacao;
      return b.score - a.score;
    });

    return list;
  }, [
    metric,
    selectedVestibular,
    searchTerm,
    currentUserAccuracy,
    currentUserScore,
    currentUserResolvedCount,
    currentUserStreak,
    currentUserVestibular,
    currentUserName
  ]);

  // Posição do usuário logado na lista
  const userRankIndex = fullList.findIndex(item => item.isCurrentUser);
  const userRank = userRankIndex !== -1 ? userRankIndex + 1 : null;
  const userItem = userRankIndex !== -1 ? fullList[userRankIndex] : null;

  // Três primeiros colocados (Pódio)
  const topThree = fullList.slice(0, 3);
  // Restante da lista (a partir do 4º)
  const remainingList = fullList.slice(3);

  // Formatação de valor conforme métrica
  const formatMetricValue = (item: RankingUserData) => {
    switch (metric) {
      case 'geral':
        return `${item.score}%`;
      case 'xp':
        return `${item.xp.toLocaleString('pt-BR')} XP`;
      case 'questoes':
        return `${item.questoesResolvidas} qts`;
      case 'streak':
        return `${item.streakDias} dias`;
      case 'redacao':
        return `${item.notaRedacao} pts`;
      default:
        return `${item.score}%`;
    }
  };

  const getMetricLabel = () => {
    switch (metric) {
      case 'geral':
        return 'Taxa de Acerto';
      case 'xp':
        return 'Pontos de XP';
      case 'questoes':
        return 'Questões Resolvidas';
      case 'streak':
        return 'Ofensiva Ativa';
      case 'redacao':
        return 'Média em Redação';
      default:
        return 'Desempenho';
    }
  };

  return (
    <div className="bg-[var(--bg-card)] text-[var(--text-main)] p-6 sm:p-8 rounded-2xl border border-[var(--border-light)] shadow-sm space-y-6">
      {/* Header com Título e Filtro de Métrica */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--border-light)]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Trophy size={22} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
                Ranking de Desempenho
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Em Tempo Real
                </span>
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Compare seu aproveitamento nos simulados com outros vestibulandos e acompanhe sua evolução.
              </p>
            </div>
          </div>
        </div>

        {/* Status rápido do Usuário */}
        {userRank && userItem && (
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold block">
                Sua Classificação
              </span>
              <div className="flex items-center justify-end gap-1.5 font-bold">
                <span className="text-sm font-extrabold text-[var(--primary)]">#{userRank}º Lugar</span>
                <span className="text-xs text-[var(--text-muted)]">de {fullList.length}</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
              #{userRank}
            </div>
          </div>
        )}
      </div>

      {/* Controles: Abas de Métricas & Filtro por Vestibular */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Seletor de Métrica */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'geral', label: 'Geral (%)', icon: Target },
            { id: 'xp', label: 'XP Total', icon: Zap },
            { id: 'questoes', label: 'Questões', icon: CheckCircle2 },
            { id: 'streak', label: 'Ofensiva', icon: Flame },
            { id: 'redacao', label: 'Redação', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = metric === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setMetric(tab.id as RankingMetric)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-[var(--primary)] text-white shadow-xs'
                    : 'bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--border-light)]'
                }`}
              >
                <Icon size={14} className={active ? 'text-white' : ''} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filtro de Vestibular */}
        <div className="flex items-center gap-2 shrink-0">
          <Filter size={13} className="text-[var(--text-muted)]" />
          <select
            value={selectedVestibular}
            onChange={(e) => setSelectedVestibular(e.target.value as VestibularFilter)}
            className="bg-[var(--bg-hover)] border border-[var(--border-light)] text-[var(--text-main)] text-xs rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-[var(--primary)] cursor-pointer"
          >
            <option value="TODOS">Todos os Exames</option>
            <option value="ENEM">Foco ENEM</option>
            <option value="FUVEST">Foco FUVEST</option>
            <option value="UNICAMP">Foco UNICAMP</option>
            <option value="UNESP">Foco UNESP</option>
          </select>
        </div>
      </div>

      {/* Pódio Visual dos 3 Primeiros Colocados */}
      {topThree.length >= 3 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2">
          {/* 2º Lugar */}
          {topThree[1] && (
            <div
              className={`p-3 sm:p-4 rounded-xl border flex flex-col items-center text-center transition-all ${
                topThree[1].isCurrentUser
                  ? 'bg-[var(--primary)]/10 border-[var(--primary)] shadow-sm'
                  : 'bg-[var(--bg-hover)] border-[var(--border-light)]'
              }`}
            >
              <div className="relative mb-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 text-sm border-2 border-slate-400">
                  {topThree[1].name.charAt(0)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-400 text-white flex items-center justify-center text-[10px] font-black shadow-xs">
                  2
                </div>
              </div>
              <Medal size={16} className="text-slate-400 mb-1" />
              <h4 className="font-bold text-xs sm:text-sm text-[var(--text-main)] truncate max-w-full">
                {topThree[1].isCurrentUser ? 'Você' : topThree[1].name}
              </h4>
              <span className="text-[10px] text-[var(--text-muted)] truncate max-w-full">
                {topThree[1].targetVestibular} • {topWhitelistedSubject(topThree[1].subject)}
              </span>
              <span className="font-extrabold text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1.5 font-mono">
                {formatMetricValue(topThree[1])}
              </span>
            </div>
          )}

          {/* 1º Lugar (Campeão / Destaque Ouro) */}
          {topThree[0] && (
            <div
              className={`p-3.5 sm:p-5 rounded-xl border flex flex-col items-center text-center -mt-2 transition-all relative overflow-hidden ${
                topThree[0].isCurrentUser
                  ? 'bg-amber-500/15 border-amber-500 shadow-md ring-2 ring-amber-500/30'
                  : 'bg-amber-500/5 border-amber-500/30 shadow-sm'
              }`}
            >
              <div className="absolute top-1.5 right-1.5">
                <Sparkles size={14} className="text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
              </div>
              <div className="relative mb-2">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center font-bold text-amber-700 dark:text-amber-300 text-base border-2 border-amber-400 shadow-xs">
                  {topThree[0].name.charAt(0)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-black shadow-xs">
                  1
                </div>
              </div>
              <Crown size={18} className="text-amber-500 mb-1" />
              <h4 className="font-bold text-xs sm:text-sm text-[var(--text-main)] truncate max-w-full">
                {topThree[0].isCurrentUser ? 'Você' : topThree[0].name}
              </h4>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold truncate max-w-full">
                {topThree[0].targetVestibular} • {topWhitelistedSubject(topThree[0].subject)}
              </span>
              <span className="font-black text-sm sm:text-base text-amber-600 dark:text-amber-400 mt-1.5 font-mono">
                {formatMetricValue(topThree[0])}
              </span>
            </div>
          )}

          {/* 3º Lugar (Bronze) */}
          {topThree[2] && (
            <div
              className={`p-3 sm:p-4 rounded-xl border flex flex-col items-center text-center transition-all ${
                topThree[2].isCurrentUser
                  ? 'bg-[var(--primary)]/10 border-[var(--primary)] shadow-sm'
                  : 'bg-[var(--bg-hover)] border-[var(--border-light)]'
              }`}
            >
              <div className="relative mb-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-900/10 dark:bg-amber-950/40 flex items-center justify-center font-bold text-amber-800 dark:text-amber-400 text-sm border-2 border-amber-700/60">
                  {topThree[2].name.charAt(0)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-700 text-white flex items-center justify-center text-[10px] font-black shadow-xs">
                  3
                </div>
              </div>
              <Medal size={16} className="text-amber-700 mb-1" />
              <h4 className="font-bold text-xs sm:text-sm text-[var(--text-main)] truncate max-w-full">
                {topThree[2].isCurrentUser ? 'Você' : topThree[2].name}
              </h4>
              <span className="text-[10px] text-[var(--text-muted)] truncate max-w-full">
                {topThree[2].targetVestibular} • {topWhitelistedSubject(topThree[2].subject)}
              </span>
              <span className="font-extrabold text-xs sm:text-sm text-amber-700 dark:text-amber-500 mt-1.5 font-mono">
                {formatMetricValue(topThree[2])}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Lista Completa Classificada */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--text-muted)] px-3 uppercase tracking-wider">
          <div className="flex items-center gap-6">
            <span className="w-6 text-center">Pos</span>
            <span>Estudante</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden sm:inline">Exame / Foco</span>
            <span>{getMetricLabel()}</span>
          </div>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {fullList.map((user, i) => {
            const isUser = user.isCurrentUser;
            const rank = i + 1;
            const rankBadgeColor =
              rank === 1
                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30'
                : rank === 2
                ? 'bg-slate-400/20 text-slate-600 dark:text-slate-300 border-slate-400/30'
                : rank === 3
                ? 'bg-amber-700/20 text-amber-800 dark:text-amber-500 border-amber-700/30'
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-light)]';

            return (
              <motion.div
                key={user.id}
                layout
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center justify-between p-3 sm:p-3.5 rounded-xl border transition-all ${
                  isUser
                    ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm font-semibold'
                    : 'bg-[var(--bg-hover)] border-[var(--border-light)] text-[var(--text-main)] hover:border-[var(--primary)]/30'
                }`}
              >
                {/* Lado Esquerdo: Posição + Avatar + Nome */}
                <div className="flex items-center gap-3 overflow-hidden min-w-0">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border ${
                      isUser
                        ? 'bg-white/20 text-white border-white/30'
                        : rankBadgeColor
                    }`}
                  >
                    #{rank}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold text-sm truncate ${isUser ? 'text-white' : 'text-[var(--text-main)]'}`}>
                        {isUser ? `${user.name} (Você)` : user.name}
                      </span>
                      {user.badge && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 hidden md:inline ${
                            isUser
                              ? 'bg-white/20 text-white'
                              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                          }`}
                        >
                          {user.badge}
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] truncate ${isUser ? 'text-blue-100' : 'text-[var(--text-muted)]'}`}>
                      {user.subject}
                    </p>
                  </div>
                </div>

                {/* Lado Direito: Tags + Valor da Métrica */}
                <div className="flex items-center gap-4 sm:gap-6 shrink-0 ml-3">
                  <div className="hidden sm:flex flex-col items-end text-right">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isUser
                          ? 'bg-white/20 text-white'
                          : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-light)]'
                      }`}
                    >
                      {user.targetVestibular}
                    </span>
                    <span className={`text-[10px] mt-0.5 ${isUser ? 'text-blue-100' : 'text-[var(--text-muted)]'}`}>
                      {user.streakDias}d ofensiva
                    </span>
                  </div>

                  <div className="text-right">
                    <span className={`font-extrabold text-sm sm:text-base font-mono ${isUser ? 'text-white' : 'text-[var(--text-main)]'}`}>
                      {formatMetricValue(user)}
                    </span>
                    <span className={`block text-[9px] ${isUser ? 'text-blue-100' : 'text-[var(--text-muted)]'}`}>
                      {user.questoesResolvidas} resolvidas
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Dica de Subida no Ranking & CTA Inteligente */}
      <div className="p-3.5 rounded-xl bg-blue-500/5 dark:bg-blue-950/20 border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2 text-blue-800 dark:text-blue-300">
          <Info size={15} className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
          <span>
            Resolva novos simulados e mantenha sua ofensiva diária ativa para acumular mais XP e subir posições no mural.
          </span>
        </div>

        {onNavigateToStudy && (
          <button
            onClick={onNavigateToStudy}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer shrink-0"
          >
            <span>Fazer Simulado</span>
            <ArrowUpRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

function topWhitelistedSubject(subject: string) {
  if (subject.includes('&')) {
    return subject.split('&')[0].trim();
  }
  return subject;
}
