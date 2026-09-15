import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  GraduationCap, 
  Layers, 
  TrendingUp, 
  Calendar, 
  Flame, 
  BrainCircuit, 
  ChevronRight,
  CheckCircle2,
  Clock,
  Edit3,
  ArrowRight,
  FileSpreadsheet,
  Plus,
  Sparkles,
  BookOpen,
  Award,
  Zap,
  Target
} from 'lucide-react';
import DailyMissions from './DailyMissions';
import SpotifyStudyHub from './SpotifyStudyHub';
import ToastFeedback, { ToastData } from './ToastFeedback';
import { Vestibular } from '../types';

interface HomeViewProps {
  setActiveTab: (tab: string) => void;
  selectedVestibular: Vestibular;
  setSelectedVestibular: (v: Vestibular) => void;
}

const examesList = [
  'ENEM',
  'Fuvest',
  'Unicamp',
  'Unesp',
  'UERJ',
  'ITA',
  'Anhembi Morumbi',
  'Estácio de Sá'
];

interface RecentExam {
  id: string;
  prova: string;
  ano: string;
  disciplina: string;
  acertos: string;
  status: 'Concluído' | 'Em andamento' | 'Não iniciado';
}

const recentExamsData: RecentExam[] = [
  {
    id: '1',
    prova: 'ENEM 1º Dia',
    ano: '2025',
    disciplina: 'Linguagens & Humanas',
    acertos: '38/45',
    status: 'Concluído'
  },
  {
    id: '2',
    prova: 'ENEM 2º Dia',
    ano: '2025',
    disciplina: 'Ciências da Natureza & Mat.',
    acertos: '31/45',
    status: 'Concluído'
  },
  {
    id: '3',
    prova: 'FUVEST 1ª Fase',
    ano: '2025',
    disciplina: 'Conhecimentos Gerais',
    acertos: '—',
    status: 'Em andamento'
  },
  {
    id: '4',
    prova: 'UNICAMP 1ª Fase',
    ano: '2024',
    disciplina: 'Geral Interdisciplinar',
    acertos: '52/72',
    status: 'Concluído'
  },
  {
    id: '5',
    prova: 'UNESP Conhecimentos Gerais',
    ano: '2024',
    disciplina: 'Ciências Humanas e Linguagens',
    acertos: '—',
    status: 'Não iniciado'
  }
];

export const HomeView: React.FC<HomeViewProps> = ({
  setActiveTab,
  selectedVestibular,
  setSelectedVestibular
}) => {
  const [focoExame, setFocoExame] = useState<string>('ENEM');
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = (type: 'success' | 'error', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const quickActions = [
    {
      id: 'vestibulares',
      title: 'Simulados Oficiais',
      desc: 'Provas do ENEM, FUVEST, UNICAMP, UNESP e ITA dos últimos 18 anos com cronômetro real.',
      icon: GraduationCap,
      badge: 'Gabaritos 100%',
      gradient: 'from-blue-500/10 to-indigo-500/10',
      borderGlow: 'hover:border-blue-500/40',
      iconColor: 'text-blue-400'
    },
    {
      id: 'skillswipe',
      title: 'SkillSwipe Flashcards',
      desc: 'Memorização acelerada por repetição espaçada. Deslize para a direita se souber!',
      icon: Layers,
      badge: 'Repetição Ativa',
      gradient: 'from-cyan-500/10 to-blue-500/10',
      borderGlow: 'hover:border-cyan-500/40',
      iconColor: 'text-cyan-400'
    },
    {
      id: 'redacao',
      title: 'Correção de Redação IA',
      desc: 'Análise automática baseada nas competências oficiais com nota estimada e feedback.',
      icon: BrainCircuit,
      badge: 'IA Integrada',
      gradient: 'from-purple-500/10 to-pink-500/10',
      borderGlow: 'hover:border-purple-500/40',
      iconColor: 'text-purple-400'
    },
    {
      id: 'gabaritos',
      title: 'Gabaritos Oficiais',
      desc: 'Acervo completo de resoluções comentadas passo a passo de todas as disciplinas.',
      icon: FileSpreadsheet,
      badge: '2008 - 2026',
      gradient: 'from-emerald-500/10 to-teal-500/10',
      borderGlow: 'hover:border-emerald-500/40',
      iconColor: 'text-emerald-400'
    },
    {
      id: 'agenda',
      title: 'Agenda de Exames',
      desc: 'Calendário atualizado de inscrições, isenções e datas de provas dos vestibulares.',
      icon: Calendar,
      badge: 'Calendário 2026',
      gradient: 'from-amber-500/10 to-orange-500/10',
      borderGlow: 'hover:border-amber-500/40',
      iconColor: 'text-amber-400'
    },
    {
      id: 'desafio',
      title: 'Desafio Semanal',
      desc: 'Teste seus conhecimentos contra milhares de vestibulandos e ganhe XP bônus.',
      icon: Flame,
      badge: 'Ranking XP',
      gradient: 'from-rose-500/10 to-amber-500/10',
      borderGlow: 'hover:border-rose-500/40',
      iconColor: 'text-rose-400'
    }
  ];

  const metrics = [
    {
      title: 'Questões Resolvidas',
      value: '1.247',
      trend: '+12% este mês',
      icon: CheckCircle2,
      accent: 'text-emerald-400',
      bgAccent: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'Taxa de Acerto',
      value: '78,4%',
      trend: '+5.2% vs. média',
      icon: TrendingUp,
      accent: 'text-blue-400',
      bgAccent: 'bg-blue-500/10 border-blue-500/20'
    },
    {
      title: 'Simulados Feitos',
      value: '18',
      trend: '+3 nesta semana',
      icon: Clock,
      accent: 'text-purple-400',
      bgAccent: 'bg-purple-500/10 border-purple-500/20'
    },
    {
      title: 'Redações Treinadas',
      value: '24',
      trend: 'Média 880 pts',
      icon: GraduationCap,
      accent: 'text-amber-400',
      bgAccent: 'bg-amber-500/10 border-amber-500/20'
    }
  ];

  const handleSelectExame = (exame: string) => {
    setFocoExame(exame);
    const upper = exame.toUpperCase();
    if (upper.includes('ENEM')) setSelectedVestibular(Vestibular.ENEM);
    else if (upper.includes('FUVEST')) setSelectedVestibular(Vestibular.FUVEST);
    else if (upper.includes('UNICAMP')) setSelectedVestibular(Vestibular.UNICAMP);
    else if (upper.includes('UNESP')) setSelectedVestibular(Vestibular.UNESP);
    else if (upper.includes('UERJ')) setSelectedVestibular(Vestibular.UERJ);
    else if (upper.includes('ITA')) setSelectedVestibular(Vestibular.ITA);
  };

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* ===== HERO CARD ELEVADO ===== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-card)] to-[#151D30] border border-[var(--border-light)] p-7 sm:p-9 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-badge)] border border-[var(--primary-border)] text-xs font-semibold text-[var(--primary)]">
            <Sparkles size={14} className="animate-pulse text-[var(--primary)]" />
            <span>Plataforma Premium de Preparação para Vestibulares</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)] tracking-tight leading-tight">
            Seu centro de estudos inteligente de alta performance
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
            Pratique com mais de 18 anos de provas reais com gabaritos oficiais comentados, correção instantânea de redação por IA, flashcards de memorização espaçada e cronograma automatizado.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                showToast('success', 'Iniciando simulado...');
                setTimeout(() => setActiveTab('vestibulares'), 250);
              }}
              className="px-6 py-3.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-xl font-semibold text-sm inline-flex items-center gap-2 shadow-lg shadow-[var(--shadow-primary)] transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Começar Simulado</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => {
                showToast('success', 'Modo prática ativado!');
                setTimeout(() => setActiveTab('skillswipe'), 250);
              }}
              className="px-5 py-3.5 bg-[var(--bg-hover)] hover:bg-[var(--border-color)] text-[var(--text-main)] border border-[var(--border-light)] rounded-xl font-semibold text-sm inline-flex items-center gap-2 transition-all cursor-pointer hover:-translate-y-0.5"
            >
              <Layers size={16} className="text-cyan-400" />
              <span>Praticar Flashcards</span>
            </button>

            <button
              onClick={() => {
                showToast('success', 'Abrindo laboratório de redação...');
                setTimeout(() => setActiveTab('redacao'), 250);
              }}
              className="px-5 py-3.5 bg-[var(--bg-hover)] hover:bg-[var(--border-color)] text-[var(--text-main)] border border-[var(--border-light)] rounded-xl font-semibold text-sm inline-flex items-center gap-2 transition-all cursor-pointer hover:-translate-y-0.5"
            >
              <BrainCircuit size={16} className="text-purple-400" />
              <span>Treinar Redação</span>
            </button>
          </div>
        </div>
      </section>

      {/* ===== SEÇÃO SPOTIFY — MÚSICAS PARA ESTUDAR ===== */}
      <SpotifyStudyHub onToast={showToast} />

      {/* ===== EXAME EM FOCO ===== */}
      <section className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-[var(--primary)]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Foco do vestibular ativo
            </span>
          </div>
          <span className="text-xs text-[var(--text-label)]">
            Personaliza questões, dicas e temas de redação
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {examesList.map((exame) => {
            const isActive = focoExame === exame;
            return (
              <button
                key={exame}
                onClick={() => handleSelectExame(exame)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-md shadow-[var(--shadow-primary)]'
                    : 'bg-[var(--bg-hover)] text-[var(--text-muted)] hover:bg-[var(--border-color)] hover:text-[var(--text-main)] border-[var(--border-light)]'
                }`}
              >
                {isActive && <span className="inline-block mr-1.5 font-bold">✓</span>}
                {exame}
              </button>
            );
          })}
        </div>
      </section>

      {/* ===== CARDS DE MÉTRICAS ===== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
              className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] shadow-sm hover:border-[var(--border-color)] hover:bg-[var(--bg-card-elevated)] transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${metric.bgAccent} ${metric.accent}`}>
                  <Icon size={20} />
                </div>
                <span className="text-[11px] font-semibold text-[var(--success)] bg-[var(--success-light)] px-2.5 py-0.5 rounded-full">
                  {metric.trend}
                </span>
              </div>
              <div className="text-xs font-semibold text-[var(--text-muted)] mb-1">
                {metric.title}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
                {metric.value}
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* ===== TABELA DE PROVAS RECENTES ===== */}
      <section className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] overflow-hidden shadow-sm">
        <div className="p-5 sm:p-6 border-b border-[var(--border-light)] flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-main)]">
              Histórico & Provas Recentes
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Retome seus simulados ou inicie uma nova prova
            </p>
          </div>
          <button
            onClick={() => setActiveTab('vestibulares')}
            className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 shadow-sm shadow-[var(--shadow-primary)] transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Novo Simulado</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-table-header)] border-b border-[var(--border-light)]">
                <th className="py-3.5 px-6 text-xs font-semibold uppercase tracking-wider text-[var(--text-label)]">
                  Prova
                </th>
                <th className="py-3.5 px-6 text-xs font-semibold uppercase tracking-wider text-[var(--text-label)]">
                  Edição
                </th>
                <th className="py-3.5 px-6 text-xs font-semibold uppercase tracking-wider text-[var(--text-label)]">
                  Disciplina
                </th>
                <th className="py-3.5 px-6 text-xs font-semibold uppercase tracking-wider text-[var(--text-label)]">
                  Desempenho
                </th>
                <th className="py-3.5 px-6 text-xs font-semibold uppercase tracking-wider text-[var(--text-label)]">
                  Status
                </th>
                <th className="py-3.5 px-6 text-xs font-semibold uppercase tracking-wider text-[var(--text-label)] text-right">
                  Ação
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              {recentExamsData.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setActiveTab('vestibulares')}
                  className="hover:bg-[var(--bg-hover)] transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-6 text-sm font-semibold text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">
                    {item.prova}
                  </td>
                  <td className="py-4 px-6 text-sm text-[var(--text-muted)]">
                    {item.ano}
                  </td>
                  <td className="py-4 px-6 text-sm text-[var(--text-muted)]">
                    {item.disciplina}
                  </td>
                  <td className="py-4 px-6 text-sm font-semibold text-[var(--text-main)]">
                    {item.acertos}
                  </td>
                  <td className="py-4 px-6 text-sm">
                    {item.status === 'Concluído' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--success-light)] text-[var(--success)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]"></span>
                        Concluído
                      </span>
                    )}
                    {item.status === 'Em andamento' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--warning-light)] text-[var(--warning)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--warning)]"></span>
                        Em andamento
                      </span>
                    )}
                    {item.status === 'Não iniciado' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--bg-hover)] text-[var(--text-muted)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-label)]"></span>
                        Não iniciado
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-sm text-right">
                    <span className="text-xs font-semibold text-[var(--primary)] inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Acessar <ChevronRight size={14} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===== MÓDULOS DE ESTUDO HUB ===== */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
            Módulos Interativos
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
            Ferramentas com tecnologia de ponta para potencializar cada etapa da sua aprovação.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
                onClick={() => setActiveTab(item.id)}
                className={`group p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] ${item.borderGlow} shadow-sm hover:shadow-xl hover:bg-[var(--bg-card-elevated)] transition-all duration-200 cursor-pointer flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-[var(--bg-hover)] border border-[var(--border-light)] ${item.iconColor}`}>
                      <Icon size={22} />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--bg-badge)] text-[var(--primary)] border border-[var(--primary-border)]">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[var(--border-light)] flex items-center justify-between text-xs font-semibold text-[var(--primary)]">
                  <span>Abrir ferramenta</span>
                  <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ===== MISSÕES DIÁRIAS ===== */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
            Metas Diárias & Conquistas
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
            Mantenha sua ofensiva ativa todos os dias para maximizar sua retenção e acumular XP.
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden border border-[var(--border-light)] bg-[var(--bg-card)] shadow-sm">
          <DailyMissions />
        </div>
      </section>

      {/* Toast notifications */}
      <ToastFeedback 
        toasts={toasts} 
        onRemove={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} 
      />
    </div>
  );
};

export default HomeView;
