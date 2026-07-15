import React, { useState, useEffect } from 'react';
import { 
  Award, Trophy, Clock, Flame, Zap, CheckSquare, Sparkles, Plus, Trash2, 
  PlusCircle, Filter, Calendar, Lock, Unlock, Timer, Compass, RefreshCw, 
  HelpCircle, ChevronRight, CheckCircle2, AlertCircle, Info, BookOpen, GraduationCap, Minus
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

// Canvas-based performant confetti overlay
const ConfettiCanvas: React.FC<{ active: boolean }> = ({ active }) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    const colors = [
      '#FFC107', '#FF5722', '#E91E63', '#9C27B0', '#3F51B5',
      '#00BCD4', '#4CAF50', '#00E676', '#FFEB3B', '#FF3D00',
      '#EC407A', '#AB47BC', '#26A69A', '#D4AF37', '#FFDF00'
    ];

    interface Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
      type: 'circle' | 'square' | 'triangle' | 'stripe';
      opacity: number;
      wobble: number;
      wobbleSpeed: number;
    }

    const particles: Particle[] = [];

    const createParticle = (x: number, y: number, angleRange: number, baseSpeed: number): Particle => {
      return {
        x,
        y,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: Math.cos(angleRange) * (Math.random() * baseSpeed + 4),
        speedY: Math.sin(angleRange) * (Math.random() * baseSpeed + 4) - 5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        type: ['circle', 'square', 'triangle', 'stripe'][Math.floor(Math.random() * 4)] as any,
        opacity: 1,
        wobble: Math.random() * 10,
        wobbleSpeed: Math.random() * 0.1
      };
    };

    // Burst from bottom-left corner shooting up-right
    for (let i = 0; i < 70; i++) {
      const angle = -Math.PI / 4 + (Math.random() - 0.5) * (Math.PI / 5);
      particles.push(createParticle(50, height - 50, angle, 14));
    }

    // Burst from bottom-right corner shooting up-left
    for (let i = 0; i < 70; i++) {
      const angle = -Math.PI * 3 / 4 + (Math.random() - 0.5) * (Math.PI / 5);
      particles.push(createParticle(width - 50, height - 50, angle, 14));
    }

    // Burst from middle center (upwards/sideways)
    for (let i = 0; i < 60; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * (Math.PI / 2.5);
      particles.push(createParticle(width / 2, height / 2 - 100, angle, 9));
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Apply physics
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += 0.22; // gravity
        p.speedX *= 0.98; // horizontal air drag
        p.speedY *= 0.98; // vertical air drag
        p.rotation += p.rotationSpeed;
        p.wobble += p.wobbleSpeed;

        // Custom sway based on wobble speed
        p.x += Math.sin(p.wobble) * 0.5;

        // Draw particle
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        ctx.beginPath();
        if (p.type === 'circle') {
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        } else if (p.type === 'square') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else if (p.type === 'triangle') {
          ctx.moveTo(0, -p.size / 2);
          ctx.lineTo(p.size / 2, p.size / 2);
          ctx.lineTo(-p.size / 2, p.size / 2);
          ctx.closePath();
        } else {
          // Stripe
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size * 1.5, p.size / 2);
        }
        ctx.fill();
        ctx.restore();

        // Fade out slightly when falling down
        if (p.speedY > 2) {
          p.opacity = Math.max(0, p.opacity - 0.006);
        }

        // Check if out of bounds or fully faded
        if (p.y > height + 20 || p.x < -50 || p.x > width + 50 || p.opacity <= 0) {
          particles.splice(i, 1);
        }
      }

      if (particles.length > 0) {
        animFrameId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[100]"
    />
  );
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
    let currentUserId = 'guest';
    const unsub = auth.onAuthStateChanged(user => {
      const uId = user ? user.uid : 'guest';
      currentUserId = uId;
      setUserId(uId);
      loadUserData(uId);
    });

    const handleTrackEvent = () => {
      if (currentUserId && currentUserId !== 'guest') {
        loadUserData(currentUserId);
      }
    };

    const handleAchievementEvent = (e: Event) => {
      const conquista = (e as CustomEvent).detail;
      setUnlockedCongrats(prev => {
        // Prevent duplicate notices
        if (prev.some(p => p.id === conquista.id)) return prev;
        return [...prev, conquista];
      });
      setShowCongrats(true);
    };

    window.addEventListener('user-activity-tracked', handleTrackEvent);
    window.addEventListener('achievement-unlocked', handleAchievementEvent);

    return () => {
      unsub();
      window.removeEventListener('user-activity-tracked', handleTrackEvent);
      window.removeEventListener('achievement-unlocked', handleAchievementEvent);
    };
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
            {/* Left section: Goals Creation panel */}
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-8 rounded-[2rem] shadow-sm space-y-6 h-fit sticky top-6">
              <div className="flex items-center gap-3 border-b border-[var(--card-border)] pb-4">
                <div className="bg-violet-100 dark:bg-violet-900/40 p-2.5 rounded-xl text-violet-600">
                  <PlusCircle size={22} />
                </div>
                <h3 className="text-xl font-black text-[var(--text-primary)]">Nova Meta</h3>
              </div>

              <form onSubmit={handleCreateMeta} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-[var(--text-secondary)] tracking-widest ml-1">Descrição do Objetivo</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Resolver 50 questões de Bio"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--card-border)] p-4 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black text-[var(--text-secondary)] tracking-widest ml-1">Categoria</label>
                    <select 
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--card-border)] p-4 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-violet-500/20 outline-none appearance-none"
                    >
                      <option value="questoes">Questões</option>
                      <option value="horas">Horas</option>
                      <option value="aulas">Aulas</option>
                      <option value="redacoes">Redações</option>
                      <option value="leituras">Leituras</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black text-[var(--text-secondary)] tracking-widest ml-1">Alvo (Valor)</label>
                    <input 
                      type="number" 
                      min="1"
                      value={target}
                      onChange={(e) => setTarget(Number(e.target.value))}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--card-border)] p-4 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-violet-500/20 outline-none"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 active:scale-95"
                >
                  {submitting ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} />}
                  Criar Plano de Meta
                </button>
              </form>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-2xl flex items-start gap-3">
                <HelpCircle className="text-amber-500 shrink-0 mt-0.5" size={16} />
                <p className="text-[11px] text-amber-700 dark:text-amber-300 font-medium leading-relaxed">
                  Ao concluir suas metas, você ganha XP e libera badges exclusivas no seu histórico.
                </p>
              </div>
            </div>

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

                        {/* Interactive adjustment controls */}
                        <div className="flex items-center gap-2">
                          <div className="flex bg-[var(--bg-secondary)] rounded-xl border border-[var(--card-border)] p-1 overflow-hidden">
                            <button 
                              onClick={() => handleUpdateMetaProgress(m.id, -1)}
                              disabled={m.progresso <= 0}
                              className="p-2 hover:bg-[var(--card-border)] text-[var(--text-secondary)] transition-colors rounded-lg disabled:opacity-30"
                            >
                              <Minus size={14} />
                            </button>
                            <button 
                              onClick={() => handleUpdateMetaProgress(m.id, 1)}
                              disabled={m.concluida}
                              className="p-2 hover:bg-[var(--card-border)] text-violet-600 transition-colors rounded-lg disabled:opacity-30"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <button 
                            onClick={() => handleDeleteMeta(m.id)}
                            className="p-3 text-red-400 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            {/* High fidelity confetti shower overlay */}
            <ConfettiCanvas active={showCongrats} />

            <motion.div 
              initial={{ opacity: 0, scale: 0.7, y: 80, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 40, rotate: 1 }}
              transition={{ type: "spring", damping: 18, stiffness: 120 }}
              className="bg-gradient-to-b from-slate-900 to-indigo-950 text-white rounded-[2.5rem] p-8 md:p-12 max-w-lg w-full text-center border-2 border-emerald-500/40 shadow-[0_0_50px_rgba(16,185,129,0.3)] relative overflow-hidden"
            >
              {/* Animated star backgrounds */}
              <div className="absolute top-0 inset-x-0 h-40 bg-violet-600/15 blur-3xl pointer-events-none" />

              <div className="space-y-6 relative z-10">
                
                {/* Immersive orbiting trophy visualization */}
                <div className="relative flex justify-center items-center py-4">
                  {/* Rotating dashed light rings */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute w-36 h-36 border-2 border-dashed border-emerald-500/20 rounded-full pointer-events-none"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute w-44 h-44 border border-violet-500/20 rounded-full pointer-events-none"
                  />

                  {/* Radial neon glow pulse */}
                  <div className="absolute w-24 h-24 bg-emerald-500/20 rounded-full blur-xl animate-pulse pointer-events-none" />

                  {/* Sparklets rising */}
                  <motion.div
                    animate={{ y: [-15, -45], opacity: [0, 1, 0], scale: [0.6, 1.2, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 left-[35%] text-amber-300 pointer-events-none"
                  >
                    <Sparkles size={16} />
                  </motion.div>
                  <motion.div
                    animate={{ y: [-10, -35], opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                    transition={{ duration: 2.5, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-2 right-[30%] text-emerald-300 pointer-events-none"
                  >
                    <Sparkles size={14} />
                  </motion.div>

                  <motion.div 
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: [0, 1.3, 1], rotate: [0, 10, 0] }}
                    transition={{ delay: 0.25, type: "spring", stiffness: 220, damping: 11 }}
                    className="relative z-10 p-6 rounded-full bg-slate-900 border-2 border-emerald-500/60 shadow-lg text-emerald-400"
                  >
                    <Trophy size={54} className="drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse" />
                  </motion.div>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-300 tracking-tight leading-none drop-shadow-sm">
                    NOVO SELO DESBLOQUEADO!
                  </h2>
                  <p className="text-sm font-semibold text-slate-300">
                    Seu esforço e regularidade nos estudos renderam conquistas históricas!
                  </p>
                </motion.div>

                {/* Staggered list of badges unlocked */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4 shadow-inner"
                >
                  {unlockedCongrats.map((item, index) => (
                    <motion.div 
                      key={item.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.15, type: "spring", stiffness: 120 }}
                      className="flex items-center gap-4 text-left p-2.5 rounded-2xl hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="p-3 bg-gradient-to-tr from-emerald-500 to-green-400 text-white rounded-xl shadow-md border border-emerald-400/20">
                        {renderIcon(item.icone, "w-8 h-8")}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-extrabold text-white text-base flex items-center gap-2">
                          {item.nome}
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        </h4>
                        <p className="text-xs text-slate-300 font-medium leading-relaxed">{item.descricao}</p>
                        {item.recompensa && (
                          <div className="inline-flex items-center gap-1.5 text-[10px] text-emerald-400 font-black mt-1 uppercase tracking-wide bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                            🎁 Recompensa: {item.recompensa}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.button 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  onClick={() => {
                    setShowCongrats(false);
                    setUnlockedCongrats([]);
                  }}
                  className="w-full py-4 bg-gradient-to-r from-emerald-400 to-teal-400 hover:brightness-110 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.03] active:scale-95 text-slate-950 font-sans tracking-wide cursor-pointer uppercase"
                >
                  Continuar Aprendizado!
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
