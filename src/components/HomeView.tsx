import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  GraduationCap, 
  BookOpen, 
  Target, 
  Award, 
  ArrowRight, 
  Zap, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Layers, 
  TrendingUp, 
  Calendar, 
  Flame, 
  BrainCircuit, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import DailyMissions from './DailyMissions';
import { Vestibular } from '../types';

interface HomeViewProps {
  setActiveTab: (tab: string) => void;
  selectedVestibular: Vestibular;
  setSelectedVestibular: (v: Vestibular) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setActiveTab,
  selectedVestibular,
  setSelectedVestibular
}) => {
  const quickActions = [
    {
      id: 'vestibulares',
      title: 'Simulados Oficiais',
      desc: 'Provas do ENEM, FUVEST, UNICAMP e UNESP dos últimos 16 anos com cronômetro real.',
      icon: GraduationCap,
      badge: 'Gabaritos 100%',
      gradient: 'from-blue-500/10 via-indigo-500/10 to-blue-500/5',
      borderColor: 'group-hover:border-[var(--text-accent)]/40',
      iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      accentColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      id: 'skillswipe',
      title: 'SkillSwipe Flashcards',
      desc: 'Memorização acelerada por repetição espaçada. Deslize para a direita se souber!',
      icon: Layers,
      badge: 'Popular',
      gradient: 'from-amber-500/10 via-orange-500/10 to-amber-500/5',
      borderColor: 'group-hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      accentColor: 'text-amber-600 dark:text-amber-400'
    },
    {
      id: 'redacao',
      title: 'Correção de Redação IA',
      desc: 'Análise automática baseada nas 5 competências do ENEM com nota estimada e feedback.',
      icon: BrainCircuit,
      badge: 'IA Integrada',
      gradient: 'from-purple-500/10 via-violet-500/10 to-purple-500/5',
      borderColor: 'group-hover:border-purple-500/40',
      iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      accentColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      id: 'gabaritos',
      title: 'Gabaritos Comentados',
      desc: 'Acervo completo de resoluções passo a passo de todas as disciplinas.',
      icon: FileText,
      badge: '2010 - 2025',
      gradient: 'from-emerald-500/10 via-teal-500/10 to-emerald-500/5',
      borderColor: 'group-hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      accentColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      id: 'agenda',
      title: 'Agenda de Exames',
      desc: 'Calendário atualizado de inscrições, isenções e datas de provas dos vestibulares.',
      icon: Calendar,
      badge: 'Calendário 2026',
      gradient: 'from-sky-500/10 via-cyan-500/10 to-sky-500/5',
      borderColor: 'group-hover:border-sky-500/40',
      iconBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
      accentColor: 'text-sky-600 dark:text-sky-400'
    },
    {
      id: 'desafio',
      title: 'Desafio Semanal',
      desc: 'Teste seus conhecimentos contra milhares de vestibulandos e ganhe XP bônus.',
      icon: Flame,
      badge: 'Ranking XP',
      gradient: 'from-rose-500/10 via-pink-500/10 to-rose-500/5',
      borderColor: 'group-hover:border-rose-500/40',
      iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      accentColor: 'text-rose-600 dark:text-rose-400'
    }
  ];

  const statHighlights = [
    { label: 'Provas Integradas', val: '16+ Anos', sub: 'ENEM & Estaduais' },
    { label: 'Gabaritos Oficiais', val: '200+', sub: 'Provas e Resoluções' },
    { label: 'Correções IA', val: 'Instantâneas', sub: 'Por Competência' },
    { label: 'Taxa de Aprovação', val: 'Gratuito', sub: 'Sem Custos Ocultos' }
  ];

  return (
    <div className="space-y-12 py-6 font-sans">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-[var(--card-bg)] text-[var(--text-primary)] p-8 sm:p-12 lg:p-16 border border-[var(--card-border)] shadow-xl transition-colors">
        {/* Subtle Ambient Glows matching app colors */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-[var(--text-accent)]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          {/* Tagline Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--card-border)] text-xs font-semibold tracking-wide text-[var(--text-accent)] shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <Sparkles size={14} className="text-amber-500" />
            <span>VESTHUB 2026 • PREPARAÇÃO INTELIGENTE</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display leading-[1.1] text-[var(--text-primary)]"
          >
            Sua Aprovação nos Maiores <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-accent)] via-purple-500 to-indigo-500">Vestibulares</span> Começa Aqui.
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed max-w-2xl font-normal"
          >
            Estude com provas reais dos últimos 16 anos, resolva simulados com tempo controlado, treine redação com feedback da IA e fixe conteúdo com nossos flashcards interativos.
          </motion.p>

          {/* Action CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 pt-4"
          >
            <button
              onClick={() => setActiveTab('vestibulares')}
              className="px-7 py-3.5 rounded-xl bg-[var(--button-bg)] hover:bg-[var(--button-bg-hover)] text-white font-bold text-sm sm:text-base transition-all flex items-center gap-2 shadow-lg shadow-[var(--button-bg)]/25 active:scale-[0.98] cursor-pointer"
            >
              <span>Começar Simulado</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => setActiveTab('skillswipe')}
              className="px-7 py-3.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--card-border)]/60 text-[var(--text-primary)] border border-[var(--card-border)] font-semibold text-sm sm:text-base transition-all flex items-center gap-2 active:scale-[0.98] cursor-pointer"
            >
              <Layers size={18} className="text-amber-500" />
              <span>Praticar Flashcards</span>
            </button>

            <button
              onClick={() => setActiveTab('redacao')}
              className="px-7 py-3.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--card-border)]/60 text-[var(--text-primary)] border border-[var(--card-border)] font-semibold text-sm sm:text-base transition-all flex items-center gap-2 active:scale-[0.98] cursor-pointer"
            >
              <BrainCircuit size={18} className="text-[var(--text-accent)]" />
              <span>Corrigir Redação</span>
            </button>
          </motion.div>
        </div>

        {/* Quick Vestibular Selector Pill */}
        <div className="relative z-10 mt-10 pt-8 border-t border-[var(--card-border)] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>Exame em foco:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.values(Vestibular).map((vest) => {
              const isActive = selectedVestibular === vest;
              return (
                <button
                  key={vest}
                  onClick={() => setSelectedVestibular(vest)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[var(--button-bg)] text-white shadow-md shadow-[var(--button-bg)]/20'
                      : 'bg-[var(--bg-secondary)] hover:bg-[var(--card-border)]/70 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--card-border)]'
                  }`}
                >
                  {vest}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== HIGHLIGHT STATS BAR ===== */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statHighlights.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-sm flex flex-col justify-between"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              {stat.label}
            </span>
            <div className="my-1">
              <span className="text-2xl sm:text-3xl font-extrabold font-display text-[var(--text-primary)]">
                {stat.val}
              </span>
            </div>
            <span className="text-xs font-medium text-[var(--text-secondary)]">
              {stat.sub}
            </span>
          </motion.div>
        ))}
      </section>

      {/* ===== QUICK ACTIONS & HUB GRID ===== */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-display text-[var(--text-primary)] tracking-tight">
              O que você quer estudar hoje?
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Escolha um dos módulos interativos para impulsionar seu aprendizado.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                onClick={() => setActiveTab(item.id)}
                className={`group relative p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-sm hover:shadow-xl hover:border-[var(--text-accent)]/40 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden`}
              >
                {/* Background Gradient Effect on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}></div>

                <div>
                  {/* Card Header: Icon & Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.iconBg} shadow-sm group-hover:scale-105 transition-transform`}>
                      <Icon size={22} />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                      {item.badge}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-lg font-bold font-display text-[var(--text-primary)] mb-2 group-hover:text-[var(--text-accent)] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Footer Link */}
                <div className="mt-6 pt-4 border-t border-[var(--card-border)] flex items-center justify-between text-xs font-semibold">
                  <span className={item.accentColor}>Acessar agora</span>
                  <ChevronRight size={16} className={`${item.accentColor} group-hover:translate-x-1 transition-transform`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ===== DAILY MISSIONS SECTION ===== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-display text-[var(--text-primary)] tracking-tight">
              Suas Missões e Progresso Diário
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Mantenha seu ritmo de estudos para acumular XP e subir de nível.
            </p>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-[var(--card-border)] bg-[var(--card-bg)]">
          <DailyMissions />
        </div>
      </section>
    </div>
  );
};

export default HomeView;
