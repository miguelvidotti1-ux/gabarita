import React, { useState, useEffect } from 'react';
import { 
  Award, Trophy, Clock, Flame, Zap, CheckSquare, Sparkles, Plus, Trash2, 
  PlusCircle, Filter, Calendar, Lock, Unlock, Timer, Compass, RefreshCw, 
  HelpCircle, ChevronRight, CheckCircle2, AlertCircle, Info, BookOpen, GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { auth } from '../firebase';
import { 
  achievementService, Conquista, Meta, UsuarioConquistas, DEFAULT_CONQUISTAS,
  criarMeta, registrarProgresso, verificarConquistas, desbloquearConquista,
  listarConquistasUsuario, calcularPercentual
} from '../services/achievementService';

// Dynamic icon renderer helper
const renderIcon = (name: string, className: string = "w-6 h-6") => {
  const IconComp = (Icons as any)[name] || Award;
  return <IconComp className={className} />;
};

export default function SistemasConquistasMetas() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'metas' | 'conquistas'>('metas');
  const [filter, setFilter] = useState<'todas' | 'liberadas' | 'pendentes'>('todas');
  
  // Back-end linked states
  const [metas, setMetas] = useState<Meta[]>([]);
  const [profile, setProfile] = useState<UsuarioConquistas>({
    usuarioId: 'guest',
    conquistasLiberadas: [],
    metasCompletas: 0,
    totalHorasEstudo: 0,
    diasConsecutivos: 1,
    tarefasConcluidas: 0
  });

  // Modal / Toast celebrate state
  const [unlockedCongrats, setUnlockedCongrats] = useState<Conquista[]>([]);
  const [showCongrats, setShowCongrats] = useState(false);

  // Form states for creating a new Goal (Meta)
  const [desc, setDesc] = useState('');
  const [type, setType] = useState('questoes');
  const [target, setTarget] = useState(10);
  const [submitting, setSubmitting] = useState(false);

  // Authenticated user tracking
  const [userId, setUserId] = useState('guest');

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(user => {
      const uId = user ? user.uid : 'guest';
      setUserId(uId);
      loadUserData(uId);
    });
    return () => unsub();
  }, []);

  const loadUserData = async (uId: string) => {
    setLoading(true);
    try {
      const dbMetas = await achievementService.getMetas(uId);
      const dbProfile = await achievementService.getUsuarioConquistas(uId);
      
      setMetas(dbMetas);
      setProfile(dbProfile);
    } catch (e) {
      console.error("Error fetching user goals data: ", e);
    } finally {
      setLoading(false);
    }
  };

  // Perform instant client-side verification of any newly qualified Achievements
  const checkNewAchievements = (currentProfile: UsuarioConquistas, currentMetas: Meta[]) => {
    const newlyweds = verificarConquistas(currentProfile, DEFAULT_CONQUISTAS, currentMetas);
    if (newlyweds.length > 0) {
      let updatedProfile = { ...currentProfile };
      newlyweds.forEach(conq => {
        updatedProfile = desbloquearConquista(updatedProfile, conq);
      });
      
      // Save updated achievements statistics
      setProfile(updatedProfile);
      achievementService.saveUsuarioConquistas(userId, updatedProfile);
      
      // Show congrats Modal
      setUnlockedCongrats(newlyweds);
      setShowCongrats(true);
    }
  };

  // Log study progress (hours, streak, etc)
  const adjustProfileStat = async (stat: 'totalHorasEstudo' | 'diasConsecutivos' | 'tarefasConcluidas', value: number) => {
    const updated = {
      ...profile,
      [stat]: Math.max(0, (profile as any)[stat] + value)
    };
    setProfile(updated);
    await achievementService.saveUsuarioConquistas(userId, updated);
    checkNewAchievements(updated, metas);
  };

  // Handle Meta insertion
  const handleCreateMeta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim() || target <= 0) return;

    setSubmitting(true);
    try {
      const newMeta = criarMeta(userId, desc.trim(), target, type);
      const updatedMetas = [...metas, newMeta];
      
      setMetas(updatedMetas);
      await achievementService.saveMeta(newMeta);
      
      // Reset form fields
      setDesc('');
      setTarget(10);
      
      // Check achievements after adding goal list
      checkNewAchievements(profile, updatedMetas);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Register progress increments to a Meta
  const handleUpdateMetaProgress = async (metaId: string, increment: number) => {
    const updated = metas.map(m => {
      if (m.id === metaId) {
        const after = registrarProgresso(m, increment);
        // Save singular progress in Firebase
        achievementService.saveMeta(after);
        return after;
      }
      return m;
    });

    setMetas(updated);
    
    // Count how many goals are now completed
    const currentCompletedCount = updated.filter(m => m.concluida).length;
    
    const updatedProfile = {
      ...profile,
      metasCompletas: currentCompletedCount
    };
    
    setProfile(updatedProfile);
    await achievementService.saveUsuarioConquistas(userId, updatedProfile);
    
    // Check if new milestone triggers achievement badges
    checkNewAchievements(updatedProfile, updated);
  };

  // Remove a Goal
  const handleDeleteMeta = async (metaId: string) => {
    if (confirm("Deseja realmente remover esta meta de estudos?")) {
      const filtered = metas.filter(m => m.id !== metaId);
      setMetas(filtered);
      await achievementService.deleteMeta(userId, metaId);
    }
  };

  // Calculate achievements category
  const { liberadas, pendentes } = listarConquistasUsuario(profile, DEFAULT_CONQUISTAS, metas);
  
  const filteredAchievements = () => {
    if (filter === 'liberadas') return liberadas;
    if (filter === 'pendentes') return pendentes;
    return DEFAULT_CONQUISTAS;
  };

  return (
    <div className="space-y-8 select-none pb-24">
      {/* Dynamic Header */}
      <div className="relative bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 rounded-[2.5rem] p-8 md:p-12 text-white shadow-xl shadow-purple-500/10 overflow-hidden">
        <div className="absolute -top-[50%] -right-[30%] w-96 h-96 bg-white/10 blur-3xl rounded-full" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest leading-none">
              <Award size={14} className="text-violet-300" />
              <span>SISTEMA DE SELOS & METAS</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-white">
              Evolução e Reconhecimento
            </h1>
            <p className="text-purple-50 text-base md:text-lg leading-relaxed font-semibold">
              Trace suas metas personalizadas, registre suas horas de foco e desbloqueie conquistas oficiais celebrando cada etapa rumo à aprovação.
            </p>
          </div>

          {/* Dynamic badge indicator */}
          <div className="shrink-0 bg-white/10 border border-white/20 p-6 rounded-3xl flex flex-col items-center justify-center text-center">
            <span className="text-sm font-bold text-violet-200">Selos Liberados</span>
            <span className="text-4xl font-extrabold text-white mt-1">
              {liberadas.length} <span className="text-xl text-violet-300 font-bold">/ {DEFAULT_CONQUISTAS.length}</span>
            </span>
            <div className="w-24 bg-white/20 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${(liberadas.length / DEFAULT_CONQUISTAS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid: User study statistics & logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Item: Completed Goals */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-3xl flex flex-col justify-between shadow-sm relative group">
          <div>
            <div className="flex items-center justify-between">
              <div className="p-3 bg-violet-500/10 rounded-2xl text-violet-500">
                <Trophy size={20} />
              </div>
              <span className="text-[10px] uppercase font-black tracking-wider text-[var(--text-secondary)]">Metas Batidas</span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-black">{profile.metasCompletas}</h3>
              <p className="text-xs text-[var(--text-secondary)] font-medium mt-1">Metas finalizadas de seus estudos</p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-[var(--card-border)] text-xs text-violet-500 font-bold flex items-center gap-1">
            Progrida nas metas abaixo!
          </div>
        </div>

        {/* Stat Item: Study Hours */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-3xl flex flex-col justify-between shadow-sm relative group">
          <div>
            <div className="flex items-center justify-between">
              <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                <Clock size={20} />
              </div>
              <span className="text-[10px] uppercase font-black tracking-wider text-[var(--text-secondary)]">Tempo de Foco</span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-black">{profile.totalHorasEstudo} <span className="text-sm text-[var(--text-secondary)] font-bold">horas</span></h3>
              <p className="text-xs text-[var(--text-secondary)] font-medium mt-1">Horas totais registradas automaticamente</p>
            </div>
          </div>
        </div>

        {/* Stat Item: Streak */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-3xl flex flex-col justify-between shadow-sm relative group">
          <div>
            <div className="flex items-center justify-between">
              <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500">
                <Flame size={20} className="animate-pulse" />
              </div>
              <span className="text-[10px] uppercase font-black tracking-wider text-[var(--text-secondary)]">Ofensiva Atual</span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-black">{profile.diasConsecutivos} <span className="text-sm text-[var(--text-secondary)] font-bold">dias</span></h3>
              <p className="text-xs text-[var(--text-secondary)] font-medium mt-1">Dias sucessivos com registro de estudo</p>
            </div>
          </div>
        </div>

        {/* Stat Item: Finished Tasks */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-3xl flex flex-col justify-between shadow-sm relative group">
          <div>
            <div className="flex items-center justify-between">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                <CheckSquare size={20} />
              </div>
              <span className="text-[10px] uppercase font-black tracking-wider text-[var(--text-secondary)]">Missões Concluídas</span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-black">{profile.tarefasConcluidas} <span className="text-sm text-[var(--text-secondary)] font-bold">tarefas</span></h3>
              <p className="text-xs text-[var(--text-secondary)] font-medium mt-1">Exercícios ou atividades completadas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation and views panels toggles */}
      <div className="flex border-b border-[var(--card-border)]">
        <button 
          onClick={() => setActiveTab('metas')}
          className={`pb-4 px-6 font-bold text-sm border-b-2 transition-all ${
            activeTab === 'metas' 
              ? 'border-violet-600 text-violet-600 dark:text-violet-400' 
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Minhas Metas de Estudo ({metas.length})
        </button>
        <button 
          onClick={() => setActiveTab('conquistas')}
          className={`pb-4 px-6 font-bold text-sm border-b-2 transition-all ${
            activeTab === 'conquistas' 
              ? 'border-violet-600 text-violet-600 dark:text-violet-400' 
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Seus Selos & Badges ({liberadas.length})
        </button>
      </div>

      {/* Rendering contents based on active tab */}
      <AnimatePresence mode="wait">
        {loading ? (
          <div className="h-48 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="animate-spin text-purple-600 w-8 h-8" />
            <p className="text-xs font-semibold text-[var(--text-secondary)]">Carregando seus dados com segurança...</p>
          </div>
        ) : activeTab === 'metas' ? (
          <motion.div 
            key="goals_view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left section: Goals Creation panel removed (AUTOMATIC) */}
            <div className="hidden"></div>

            {/* Right section: List of User Metas */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-md font-black text-[var(--text-primary)] flex items-center gap-2">
                <CheckCircle2 className="text-emerald-500" size={18} />
                Metas Ativas & Concluídas
              </h3>

              <div className="space-y-4">
                {metas.length > 0 ? (
                  metas.map(m => {
                    const pct = calcularPercentual(m);
                    return (
                      <div 
                        key={m.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          m.concluida 
                            ? 'bg-emerald-500/5 border-emerald-500/20' 
                            : 'bg-[var(--card-bg)] border-[var(--card-border)]'
                        } flex flex-col md:flex-row md:items-center justify-between gap-4`}
                      >
                        <div className="space-y-3 flex-1">
                          <div className="flex items-start gap-3">
                            <span className={`px-2 py-0.5 font-black text-[9px] uppercase tracking-wider rounded-md mt-0.5 ${
                              m.concluida 
                                ? 'bg-emerald-500/10 text-emerald-600' 
                                : 'bg-violet-500/10 text-violet-600'
                            }`}>
                              {m.tipo}
                            </span>
                            <div>
                              <p className={`font-bold text-sm ${m.concluida ? 'line-through text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>
                                {m.descricao}
                              </p>
                              <p className="text-[10px] text-[var(--text-secondary)] font-bold mt-0.5 flex items-center gap-1">
                                <Calendar size={10} />
                                Criada em {m.dataCriacao.toLocaleDateString('pt-BR')}
                                {m.dataConclusao && ` • Concluída em ${m.dataConclusao.toLocaleDateString('pt-BR')}`}
                              </p>
                            </div>
                          </div>

                          {/* Progress Line */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold text-[var(--text-secondary)]">
                              <span>Progresso: {m.progresso} / {m.objetivo}</span>
                              <span>{pct}%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-300 ${m.concluida ? 'bg-emerald-500' : 'bg-gradient-to-r from-violet-500 to-indigo-600'}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Interactive adjustment controls removed (AUTOMATIC) */}
                        <div className="hidden"></div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-12 text-center bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl text-[var(--text-secondary)] font-medium text-sm space-y-4">
                    <Info className="mx-auto w-8 h-8 text-slate-300" />
                    <p>Nenhuma meta de estudos configurada para este perfil.</p>
                    <p className="text-xs max-w-sm mx-auto opacity-70">Escreva uma meta no formulário ao lado para começar seu controle diário de performance e evoluir rápido!</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="badge_view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Filter buttons */}
            <div className="flex gap-2">
              <button 
                onClick={() => setFilter('todas')}
                className={`px-4 py-2 font-black text-xs rounded-xl border transition-all ${
                  filter === 'todas' 
                    ? 'bg-violet-600 text-white border-violet-600' 
                    : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border-[var(--card-border)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                Todos ({DEFAULT_CONQUISTAS.length})
              </button>
              <button 
                onClick={() => setFilter('liberadas')}
                className={`px-4 py-2 font-black text-xs rounded-xl border transition-all ${
                  filter === 'liberadas' 
                    ? 'bg-emerald-600 text-white border-emerald-600' 
                    : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border-[var(--card-border)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                Desbloqueados ({liberadas.length})
              </button>
              <button 
                onClick={() => setFilter('pendentes')}
                className={`px-4 py-2 font-black text-xs rounded-xl border transition-all ${
                  filter === 'pendentes' 
                    ? 'bg-amber-600 text-white border-amber-600' 
                    : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border-[var(--card-border)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                Pendentes ({pendentes.length})
              </button>
            </div>

            {/* Grid of badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAchievements().map(c => {
                const isUnlocked = profile.conquistasLiberadas.some(cl => cl.conquistaId === c.id);
                const unlockDateStr = profile.conquistasLiberadas.find(cl => cl.conquistaId === c.id)?.dataLiberacao;
                
                // Track progress towards requirements
                let progressValue = 0;
                if (c.requisito.tipo === 'metas_atingidas') progressValue = profile.metasCompletas;
                if (c.requisito.tipo === 'horas_estudo') progressValue = profile.totalHorasEstudo;
                if (c.requisito.tipo === 'dias_consecutivos') progressValue = profile.diasConsecutivos;
                if (c.requisito.tipo === 'tarefas_concluidas') progressValue = profile.tarefasConcluidas;

                const requirementPercent = Math.min(100, Math.round((progressValue / c.requisito.valor) * 100));

                return (
                  <div 
                    key={c.id}
                    className={`p-6 bg-[var(--card-bg)] border rounded-[2.2rem] shadow-sm relative overflow-hidden group flex flex-col justify-between transition-all duration-300 ${
                      isUnlocked 
                        ? 'border-emerald-500/30 shadow-emerald-500/5 bg-gradient-to-tr from-[var(--card-bg)] to-emerald-500/[0.02]' 
                        : 'border-[var(--card-border)]'
                    }`}
                  >
                    {/* Background glow behind icon */}
                    <div className={`absolute -top-10 -left-10 w-32 h-32 rounded-full blur-2xl opacity-10 transition-transform group-hover:scale-125 ${isUnlocked ? 'bg-emerald-500' : 'bg-gray-500'}`} />

                    <div className="space-y-4 relative z-10">
                      <div className="flex items-start justify-between">
                        {/* Dynamic badge render */}
                        <div className={`p-4 rounded-2xl relative ${
                          isUnlocked 
                            ? 'bg-gradient-to-tr from-emerald-500 to-green-400 text-white shadow-lg shadow-emerald-500/20 animate-wiggle' 
                            : 'bg-[var(--bg-secondary)] text-slate-400 border border-[var(--card-border)]'
                        }`}>
                          {renderIcon(c.icone, "w-6 h-6")}
                          {!isUnlocked && (
                            <div className="absolute -bottom-1 -right-1 p-1 bg-amber-500 text-white rounded-md">
                              <Lock size={8} />
                            </div>
                          )}
                        </div>

                        {/* Status Label */}
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                          isUnlocked 
                            ? 'bg-emerald-500/10 text-emerald-500' 
                            : 'bg-amber-500/10 text-amber-600'
                        }`}>
                          {isUnlocked ? 'Desbloqueado' : 'Bloqueado'}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-extrabold text-sm text-[var(--text-primary)] group-hover:text-violet-500 transition-colors">
                          {c.nome}
                        </h4>
                        <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
                          {c.descricao}
                        </p>
                      </div>
                    </div>

                    {/* Progress representation or Unlocked date */}
                    <div className="mt-6 pt-4 border-t border-[var(--card-border)]/50 space-y-3 relative z-10">
                      {isUnlocked ? (
                        <div className="text-[10px] text-[var(--text-secondary)] font-bold flex items-center justify-between">
                          <span className="flex items-center gap-1 text-emerald-500">
                            <Unlock size={10} /> Ativo
                          </span>
                          <span>
                            Liberado em: {new Date(unlockDateStr!).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-bold text-[var(--text-secondary)]">
                            <span>Progresso do Ganho</span>
                            <span>{progressValue} / {c.requisito.valor}</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-amber-500 h-full rounded-full transition-all duration-300"
                              style={{ width: `${requirementPercent}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* EXTRA RECOMPENSA */}
                      {c.recompensa && (
                        <div className="p-2.5 bg-violet-500/5 border border-violet-500/15 rounded-xl text-[10px] font-bold text-violet-600 dark:text-violet-400 flex items-center gap-2">
                          <Sparkles size={11} className="text-violet-500 animate-spin-slow animate-bounce" />
                          <span>Recompensa: <span className="opacity-85 font-black">{c.recompensa}</span></span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pop up congrats celebrate Modal */}
      <AnimatePresence>
        {showCongrats && unlockedCongrats.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="bg-gradient-to-b from-slate-900 to-indigo-950 text-white rounded-[2.5rem] p-8 md:p-12 max-w-lg w-full text-center border border-violet-500/30 shadow-2xl relative overflow-hidden"
            >
              {/* Animated star backgrounds */}
              <div className="absolute top-0 inset-x-0 h-40 bg-violet-600/15 blur-3xl pointer-events-none" />

              <div className="space-y-6 relative z-10">
                <div className="inline-flex p-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Trophy size={48} className="animate-bounce" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-300 tracking-tight leading-none">
                    NOVO SELO DESBLOQUEADO!
                  </h2>
                  <p className="text-sm font-semibold text-slate-300">
                    Seu esforço e regularidade nos estudos renderam conquistas históricas!
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
                  {unlockedCongrats.map(item => (
                    <div key={item.id} className="flex items-center gap-4 text-left">
                      <div className="p-3 bg-gradient-to-tr from-emerald-500 to-green-400 text-white rounded-xl shadow-md">
                        {renderIcon(item.icone, "w-8 h-8")}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-white text-base">{item.nome}</h4>
                        <p className="text-xs text-slate-300 font-medium leading-relaxed">{item.descricao}</p>
                        {item.recompensa && (
                          <p className="text-[10px] text-emerald-400 font-black mt-1 uppercase tracking-wide">
                            🎁 Recompensa: {item.recompensa}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => {
                    setShowCongrats(false);
                    setUnlockedCongrats([]);
                  }}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95 text-slate-900"
                >
                  Continuar Aprendizado!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
