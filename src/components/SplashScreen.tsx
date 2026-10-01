import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Volume2, VolumeX, Sparkles, Check } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
  videoSrc?: string;
}

/**
 * 3D Shield Emblem from the official video:
 * - Top: Navy Blue Mortarboard (Graduation Cap) with blue tassel on the right
 * - Middle: Spread Open Book with glowing white pages
 * - Bottom: Stylized sharp 3D Royal Blue 'V' Shield
 */
function VestibularProShieldEmblem({ className = "w-28 h-28" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        {/* Cap Diamond Top Gradient */}
        <linearGradient id="vCapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="50%" stopColor="#1e40af" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        {/* Cap Front Bevel */}
        <linearGradient id="vCapBevel" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#172554" />
        </linearGradient>

        {/* White Book Pages Gradient */}
        <linearGradient id="vBookPageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="65%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        {/* 3D Blue 'V' Left Facet (Shadowed) */}
        <linearGradient id="vFacetLeft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e40af" />
          <stop offset="70%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#091428" />
        </linearGradient>

        {/* 3D Blue 'V' Right Facet (Bright) */}
        <linearGradient id="vFacetRight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="45%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>

        {/* Outer Shield Bevel */}
        <linearGradient id="vOuterBevel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#172554" />
        </linearGradient>

        {/* Glow Filter */}
        <filter id="vShieldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#2563eb" floodOpacity="0.5" />
        </filter>
      </defs>

      <g filter="url(#vShieldGlow)">
        {/* 1) TOP: GRADUATION CAP (MORTARBOARD) */}
        <path
          d="M52 46 V53 C52 60 108 60 108 53 V46"
          fill="#0f172a"
          stroke="#1e40af"
          strokeWidth="1.5"
        />

        {/* Diamond Rooftop (3D perspective) */}
        <path
          d="M80 18 L134 36 L80 54 L26 36 Z"
          fill="url(#vCapGrad)"
          stroke="#60a5fa"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Top diamond highlight rim */}
        <path
          d="M80 20 L130 36 L80 52 L30 36 Z"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
        />

        {/* Cap Center Button */}
        <circle cx="80" cy="36" r="3.5" fill="#93c5fd" />

        {/* Blue Tassel Hanging to the Right */}
        <path
          d="M80 36 C105 38 120 48 126 66"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Tassel Bell / Pompom */}
        <path
          d="M123 66 L129 66 L131 78 L121 78 Z"
          fill="#1d4ed8"
          stroke="#60a5fa"
          strokeWidth="1"
        />

        {/* 2) MIDDLE: OPEN BOOK (WHITE WINGS) */}
        <path
          d="M80 54 L32 47 C32 47 38 66 80 72 Z"
          fill="url(#vBookPageGrad)"
          stroke="#ffffff"
          strokeWidth="1.5"
        />
        <path
          d="M80 54 L128 47 C128 47 122 66 80 72 Z"
          fill="url(#vBookPageGrad)"
          stroke="#ffffff"
          strokeWidth="1.5"
        />
        <line x1="80" y1="54" x2="80" y2="72" stroke="#64748b" strokeWidth="2.5" />

        {/* 3) BOTTOM: 3D SHIELD 'V' */}
        <path
          d="M32 47 L80 148 L44 68 Z"
          fill="url(#vOuterBevel)"
        />
        <path
          d="M128 47 L80 148 L116 68 Z"
          fill="#1e3a8a"
        />

        <path
          d="M44 68 L80 142 L80 72 L44 68 Z"
          fill="url(#vFacetLeft)"
        />
        <path
          d="M116 68 L80 142 L80 72 L116 68 Z"
          fill="url(#vFacetRight)"
        />

        <line x1="80" y1="72" x2="80" y2="142" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

/**
 * Classical Baroque Filigree Corner Ornament SVG
 */
function FiligreeCorner({ className = "", flipX = false, flipY = false }: { className?: string; flipX?: boolean; flipY?: boolean }) {
  const transform = `${flipX ? 'scale(-1, 1)' : ''} ${flipY ? 'scale(1, -1)' : ''}`;
  return (
    <div className={className} style={{ transform: transform.trim() || undefined }}>
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M2 46 V12 C2 6.477 6.477 2 12 2 H46"
          stroke="url(#filigreeCyanGold)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M6 34 C6 20 18 8 32 8"
          stroke="#60a5fa"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="2 3"
        />
        <path
          d="M14 14 C18 10 24 10 28 14 C32 18 32 24 28 28 C24 32 18 32 14 28"
          stroke="url(#filigreeCyanGold)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="2.5" fill="#38bdf8" />
        <circle cx="2" cy="2" r="3" fill="#60a5fa" />
      </svg>
    </div>
  );
}

/**
 * Top & Bottom Filigree Center Flourish
 */
function FiligreeCenter({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <svg width="180" height="22" viewBox="0 0 180 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 12 H70" stroke="url(#filigreeCyanGold)" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M110 12 H170" stroke="url(#filigreeCyanGold)" strokeWidth="1.2" strokeLinecap="round" />
        <path
          d="M74 12 C78 6 86 6 90 12 C94 6 102 6 106 12 C102 18 94 18 90 12 C86 18 78 18 74 12 Z"
          fill="#1d4ed8"
          stroke="url(#filigreeCyanGold)"
          strokeWidth="1.2"
        />
        <circle cx="90" cy="12" r="2.5" fill="#38bdf8" />
        <circle cx="10" cy="12" r="2" fill="#60a5fa" />
        <circle cx="170" cy="12" r="2" fill="#60a5fa" />
      </svg>
    </div>
  );
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  // Timeline Stages corresponding to the 9-second video:
  // Phase 0 (0.0s - 1.5s): Dark ambient awakening, 3D Shield Emblem floats in with starlight
  // Phase 1 (1.5s - 3.2s): Turquoise cosmic vortex spins, glowing open book unfolds
  // Phase 2 (3.2s - 4.8s): 3D Mortarboard floats above the open book with floor reflection
  // Phase 3 (4.8s - 6.2s): Bold 3D letters "Vestibular" fly in with light flashes and sparkles
  // Phase 4 (6.2s - 7.5s): Assembly into "VestibularPro" signature with slogan
  // Phase 5 (7.5s - 9.8s): Illuminated Baroque Luxury Frame forms around the complete emblem lockup
  const [phase, setPhase] = useState<number>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Background floating stars / dust particles
  const particles = useMemo(() => {
    return Array.from({ length: 32 }).map((_, i) => ({
      id: i,
      x: (i * 31) % 100,
      y: (i * 41) % 100,
      size: (i % 3) + 1.2,
      delay: (i * 0.16) % 3,
      duration: 3 + (i % 3),
      opacity: 0.2 + ((i % 5) * 0.15),
    }));
  }, []);

  // Web Audio ambient sound synthesizer for cinematic immersion
  const playSoundEffect = (type: 'whoosh' | 'flare' | 'impact' | 'chime') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          audioCtxRef.current = new AudioCtx();
        }
      }
      const ctx = audioCtxRef.current;
      if (!ctx || ctx.state === 'suspended') {
        ctx?.resume();
      }
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'whoosh') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(420, now + 0.6);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        osc.start(now);
        osc.stop(now + 0.75);
      } else if (type === 'flare') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.5);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.85);
      } else if (type === 'impact') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.4);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.55);
      } else if (type === 'chime') {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const chordOsc = ctx.createOscillator();
          const chordGain = ctx.createGain();
          chordOsc.type = 'sine';
          chordOsc.frequency.setValueAtTime(freq, now + idx * 0.05);
          chordGain.gain.setValueAtTime(0.04, now + idx * 0.05);
          chordGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
          chordOsc.connect(chordGain);
          chordGain.connect(ctx.destination);
          chordOsc.start(now + idx * 0.05);
          chordOsc.stop(now + 1.5);
        });
      }
    } catch (e) {}
  };

  useEffect(() => {
    const t0 = setTimeout(() => {
      setPhase(0);
      playSoundEffect('whoosh');
    }, 200);

    const t1 = setTimeout(() => {
      setPhase(1);
      playSoundEffect('flare');
    }, 1600);

    const t2 = setTimeout(() => {
      setPhase(2);
      playSoundEffect('whoosh');
    }, 3200);

    const t3 = setTimeout(() => {
      setPhase(3);
      playSoundEffect('impact');
    }, 4800);

    const t4 = setTimeout(() => {
      setPhase(4);
      playSoundEffect('flare');
    }, 6200);

    const t5 = setTimeout(() => {
      setPhase(5);
      playSoundEffect('chime');
    }, 7600);

    const autoExit = setTimeout(() => {
      triggerExit();
    }, 10000);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        triggerExit();
      }
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(autoExit);
      window.removeEventListener('keydown', handleKey);
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch (e) {}
      }
    };
  }, []);

  const triggerExit = () => {
    if (isExiting) return;
    if (dontShowAgain) {
      try {
        localStorage.setItem('vestibularpro_hide_splash', 'true');
      } catch (e) {}
    }
    setIsExiting(true);
    setTimeout(() => {
      onFinish();
    }, 500);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="vesthub-video-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: 'brightness(1.2)' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] bg-[#04060A] flex flex-col items-center justify-between py-5 px-4 md:py-8 md:px-8 overflow-hidden select-none cursor-pointer"
          onClick={triggerExit}
        >
          {/* SVG GRADIENT DEFINITIONS */}
          <svg width="0" height="0" className="absolute">
            <defs>
              <linearGradient id="filigreeCyanGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="35%" stopColor="#93c5fd" />
                <stop offset="70%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
          </svg>

          {/* ATMOSPHERIC BACKGROUND */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-radial from-[#09101c]/50 via-[#04060a]/90 to-[#020306]" />

            <motion.div
              animate={{
                opacity: [0.25, 0.45, 0.25],
                scale: [0.95, 1.1, 0.95]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-blue-700/20 via-sky-500/25 to-indigo-700/20 rounded-full blur-[130px]"
            />

            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full bg-sky-200"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                }}
                animate={{
                  opacity: [p.opacity * 0.2, p.opacity, p.opacity * 0.2],
                  scale: [0.8, 1.4, 0.8],
                  y: [-8, 8, -8]
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: "easeInOut",
                }}
              />
            ))}

            <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 pointer-events-none" />
          </div>

          {/* TOP BAR: Controls & Skip */}
          <div className="w-full max-w-5xl flex justify-between items-center z-30">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              <span className="text-[10px] md:text-xs uppercase font-black tracking-[0.2em] text-slate-400">
                VestibularPro • Abertura Oficial
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSoundEnabled(!soundEnabled);
                }}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-slate-400 hover:text-white transition-all backdrop-blur-md cursor-pointer"
                title={soundEnabled ? "Mutar Som" : "Ativar Som"}
              >
                {soundEnabled ? <Volume2 size={14} className="text-sky-400" /> : <VolumeX size={14} />}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerExit();
                }}
                className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-slate-300 hover:text-white text-xs font-bold backdrop-blur-md transition-all flex items-center gap-1.5 group cursor-pointer shadow-lg shadow-black/40"
              >
                <span>Pular introdução</span>
                <ArrowRight size={13} className="text-sky-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* MAIN STAGE REPRODUCING THE VIDEO ANIMATION */}
          <div className="relative z-20 flex flex-col items-center justify-center my-auto w-full max-w-3xl text-center min-h-[420px]">
            <AnimatePresence mode="wait">
              {/* STAGE A (Phases 0 & 1): 3D Shield Emblem & Cosmic Energy Vortex */}
              {phase <= 1 && (
                <motion.div
                  key="scene-emblem"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.15 }}
                  transition={{ duration: 0.55 }}
                  className="relative flex flex-col items-center justify-center"
                >
                  {phase === 1 && (
                    <motion.div
                      initial={{ scale: 0.3, rotate: 0, opacity: 0 }}
                      animate={{ scale: [0.3, 1.25, 1.4], rotate: 360, opacity: [0, 0.9, 0] }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="absolute w-80 h-80 rounded-full border-[10px] border-cyan-400/60 blur-[6px] shadow-[0_0_80px_#06b6d4,inset_0_0_60px_#06b6d4] pointer-events-none"
                    />
                  )}

                  <motion.div
                    animate={{
                      scale: [0.9, 1.15, 0.9],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute w-52 h-52 rounded-full bg-blue-600/30 blur-3xl pointer-events-none"
                  />

                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
                  >
                    <VestibularProShieldEmblem className="w-36 h-36 md:w-44 md:h-44" />
                  </motion.div>

                  <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 0.6 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="mt-6 w-48 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-[1px]"
                  />
                </motion.div>
              )}

              {/* STAGE B (Phase 2): 3D Open Book + Floating Mortarboard */}
              {phase === 2 && (
                <motion.div
                  key="scene-book-mortarboard"
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="relative flex flex-col items-center justify-center"
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(6,182,212,0.35)] border border-cyan-500/30 max-w-lg">
                    <img
                      src="/src/assets/images/vestibularpro_cap_book_1790876133009.jpg"
                      alt="VestibularPro Cap and Book"
                      referrerPolicy="no-referrer"
                      className="w-full h-auto object-cover rounded-2xl"
                    />
                    {/* Ethereal Glow Beam Animation */}
                    <motion.div
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 via-transparent to-transparent pointer-events-none"
                    />
                  </div>
                </motion.div>
              )}

              {/* STAGE C (Phase 3): 3D "Vestibular" Fly-in & Burst */}
              {phase === 3 && (
                <motion.div
                  key="scene-flyin"
                  initial={{ scale: 0.2, z: -100, opacity: 0 }}
                  animate={{ scale: 1, z: 0, opacity: 1 }}
                  exit={{ opacity: 0, scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  className="relative flex flex-col items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: [0, 1.8], opacity: [1, 0] }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="absolute w-96 h-96 rounded-full border border-sky-300 shadow-[0_0_100px_#38bdf8] pointer-events-none"
                  />

                  <div className="opacity-40 scale-75 mb-[-20px] pointer-events-none">
                    <VestibularProShieldEmblem className="w-28 h-28" />
                  </div>

                  <motion.h1
                    initial={{ letterSpacing: '0.02em', filter: 'blur(10px)' }}
                    animate={{ letterSpacing: '0.06em', filter: 'blur(0px)' }}
                    transition={{ duration: 0.6 }}
                    className="text-6xl sm:text-7xl md:text-8xl font-black text-white tracking-tight drop-shadow-[0_10px_35px_rgba(255,255,255,0.4)] relative"
                  >
                    Vestibular
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.6, 0], opacity: [0, 1, 0] }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="absolute -top-3 -left-3 text-cyan-300"
                    >
                      <Sparkles size={32} />
                    </motion.div>
                  </motion.h1>

                  <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: [0, 1.5, 0], opacity: [0, 1, 0] }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_20px_#38bdf8] mt-2"
                  />
                </motion.div>
              )}

              {/* STAGE D (Phase 4): Brand Assembly */}
              {phase === 4 && (
                <motion.div
                  key="scene-lockup"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex flex-col items-center justify-center w-full px-2"
                >
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 my-2">
                    <motion.div
                      initial={{ rotateY: -30, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      transition={{ duration: 0.6 }}
                      className="shrink-0 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]"
                    >
                      <VestibularProShieldEmblem className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32" />
                    </motion.div>

                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                      <div className="flex items-baseline justify-center sm:justify-start">
                        <span className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-[0_4px_16px_rgba(255,255,255,0.3)]">
                          Vestibular
                        </span>
                        <span className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 tracking-tight drop-shadow-[0_0_30px_rgba(56,189,248,0.8)] ml-1">
                          Pro
                        </span>
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_12px_#38bdf8] ml-1 self-baseline" />
                      </div>

                      <motion.p
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mt-1 text-[11px] sm:text-xs md:text-sm font-extrabold uppercase text-slate-300 tracking-[0.24em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                      >
                        PREPARAÇÃO INTELIGENTE. FUTURO REAL.
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STAGE E (Phase 5): The Grand Baroque Luxury Frame (Exact Final Frame from Video) */}
              {phase >= 5 && (
                <motion.div
                  key="scene-grand-finale"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex flex-col items-center justify-center w-full px-2"
                >
                  <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(37,99,235,0.4)] border border-sky-400/40">
                    <img
                      src="/src/assets/images/vestibularpro_splash_frame_1790876119007.jpg"
                      alt="VestibularPro Official Emblem Frame"
                      referrerPolicy="no-referrer"
                      className="w-full h-auto object-cover rounded-2xl"
                    />

                    {/* Optical Flare Sweep Effect */}
                    <motion.div
                      initial={{ x: '-150%', opacity: 0 }}
                      animate={{ x: '200%', opacity: [0, 0.8, 0] }}
                      transition={{ delay: 0.2, duration: 1.4, ease: "easeInOut" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-300/30 to-transparent -skew-x-25 pointer-events-none rounded-2xl"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* BOTTOM BAR: Progress & Preference */}
          <div className="w-full max-w-md flex flex-col items-center gap-3 z-30">
            {/* Progress Bar */}
            <div className="w-full h-1 bg-slate-900/90 rounded-full border border-white/10 overflow-hidden relative">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 9.8, ease: "linear" }}
                className="h-full bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-500 rounded-full shadow-[0_0_10px_#38bdf8]"
              />
            </div>

            <div className="w-full flex items-center justify-between text-[11px] text-slate-400 px-1">
              <label
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 cursor-pointer hover:text-slate-200 transition-colors"
              >
                <div
                  onClick={() => setDontShowAgain(!dontShowAgain)}
                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                    dontShowAgain ? 'bg-sky-500 border-sky-400' : 'border-slate-600 bg-white/5'
                  }`}
                >
                  {dontShowAgain && <Check size={10} className="text-white" />}
                </div>
                <span>Não exibir novamente</span>
              </label>

              <span className="font-semibold uppercase tracking-widest text-[10px] text-sky-400/90 flex items-center gap-1">
                <span>Clique para entrar</span>
                <ArrowRight size={10} />
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
