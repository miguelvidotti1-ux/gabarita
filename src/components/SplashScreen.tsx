import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { VestibularPro3DMark } from './VestibularProLogo';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [phase, setPhase] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('Iniciando sistema...');
  const [isExiting, setIsExiting] = useState(false);

  // Background stars/particles for ambient depth
  const particles = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      x: (i * 37) % 100,
      y: (i * 23) % 100,
      size: (i % 3) + 1.5,
      delay: (i * 0.15) % 2,
      duration: 2.5 + (i % 3),
      opacity: 0.2 + ((i % 5) * 0.12),
    }));
  }, []);

  useEffect(() => {
    // Phase progression:
    // 0ms: Ambient atmosphere and particles initiate
    // 300ms: Phase 1 - 3D Black Squircle Badge spring entry + ambient pulse
    // 900ms: Phase 2 - Shockwave ring expansion & logo shine
    // 1300ms: Phase 3 - VESTIBULARPRO typography reveal
    // 1700ms: Phase 4 - Slogan subtitle entrance
    // 1900ms: Phase 5 - System loading progress track (0% -> 100%)
    // 3400ms: Phase 6 - Smooth exit into the application

    const t1 = setTimeout(() => setPhase(1), 250);
    const t2 = setTimeout(() => setPhase(2), 850);
    const t3 = setTimeout(() => setPhase(3), 1300);
    const t4 = setTimeout(() => setPhase(4), 1750);
    const t5 = setTimeout(() => setPhase(5), 1950);

    // Dynamic progress bar filling up
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 9) + 6;
        if (next >= 100) {
          setStatusText('Pronto para sua aprovação!');
          return 100;
        } else if (next > 70) {
          setStatusText('Otimizando simulados e cronogramas...');
        } else if (next > 35) {
          setStatusText('Sincronizando banco de questões...');
        } else {
          setStatusText('Carregando métricas de estudo...');
        }
        return next;
      });
    }, 70);

    const autoExitTimer = setTimeout(() => {
      triggerExit();
    }, 3400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(autoExitTimer);
      clearInterval(progressInterval);
    };
  }, []);

  const triggerExit = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onFinish();
    }, 450);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] bg-[#03060C] flex flex-col items-center justify-between py-12 px-6 overflow-hidden select-none cursor-pointer"
          onClick={triggerExit}
        >
          {/* AMBIENT BACKGROUND GLOWS & LIGHTING */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Top Atmospheric Radial Glow */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[450px] bg-gradient-to-b from-blue-600/25 via-sky-500/10 to-transparent rounded-full blur-[120px]" />

            {/* Center Royal Electric Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-600/15 rounded-full blur-[140px]" />

            {/* Bottom Indigo Tint */}
            <div className="absolute -bottom-28 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-indigo-950/40 rounded-full blur-[100px]" />

            {/* Subtle Grid Accent */}
            <div 
              className="absolute inset-0 opacity-[0.035]" 
              style={{
                backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }} 
            />

            {/* Floating Ambient Starlight Particles */}
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full bg-blue-300"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: [p.opacity * 0.4, p.opacity, p.opacity * 0.4],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* TOP BAR: SKIP BUTTON */}
          <div className="w-full max-w-5xl flex justify-end z-30">
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              onClick={(e) => {
                e.stopPropagation();
                triggerExit();
              }}
              className="group px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-1.5 shadow-lg shadow-black/30 cursor-pointer"
            >
              <span>Pular introdução</span>
              <ArrowRight size={13} className="text-blue-400 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </div>

          {/* CENTER: 3D LOGO BADGE + BRANDING */}
          <div className="relative z-20 flex flex-col items-center justify-center text-center my-auto">
            
            {/* EXPANDING SHOCKWAVE / RESONANCE RING */}
            <AnimatePresence>
              {phase >= 2 && (
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ 
                    scale: [0.7, 1.35, 1.6], 
                    opacity: [0, 0.7, 0] 
                  }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full border border-sky-400/70 shadow-[0_0_50px_rgba(56,189,248,0.5),inset_0_0_30px_rgba(56,189,248,0.3)] pointer-events-none"
                />
              )}
            </AnimatePresence>

            {/* SECONDARY SUBTLE ENERGY RING */}
            <AnimatePresence>
              {phase >= 2 && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ 
                    scale: [0.9, 1.7, 2.1], 
                    opacity: [0, 0.35, 0] 
                  }}
                  transition={{ duration: 1.4, delay: 0.15, ease: "easeOut" }}
                  className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full border border-blue-500/40 pointer-events-none"
                />
              )}
            </AnimatePresence>

            {/* THE OFFICIAL BLACK SQUIRCLE WITH 3D V & CAP (From User's Reference) */}
            <motion.div
              initial={{ scale: 0.35, opacity: 0, y: 25 }}
              animate={phase >= 1 ? {
                scale: 1,
                opacity: 1,
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 260,
                  damping: 19,
                }
              } : {}}
              className="relative mb-8 group"
            >
              {/* Backlight halo glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/40 via-sky-400/30 to-blue-700/40 rounded-[35%] blur-xl" />

              {/* The Squircle Container */}
              <div 
                className="relative w-28 h-28 sm:w-32 sm:h-32 bg-black rounded-[24%] border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(59,130,246,0.35)] flex items-center justify-center p-3.5 overflow-hidden"
                style={{ aspectRatio: '1 / 1' }}
              >
                {/* Internal dynamic light sheen sweep */}
                <motion.div
                  initial={{ x: '-150%', opacity: 0 }}
                  animate={phase >= 2 ? {
                    x: '150%',
                    opacity: [0, 0.5, 0]
                  } : {}}
                  transition={{ duration: 0.9, ease: "easeInOut" }}
                  className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 pointer-events-none"
                />

                {/* The 3D V Letter + Graduation Cap */}
                <div className="w-full h-full filter drop-shadow-[0_8px_16px_rgba(37,99,235,0.4)]">
                  <VestibularPro3DMark className="w-full h-full object-contain" />
                </div>
              </div>
            </motion.div>

            {/* BRAND TITLE: VESTIBULARPRO */}
            <motion.div
              initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
              animate={phase >= 3 ? {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
              } : {}}
              className="flex items-center justify-center font-extrabold tracking-tight"
            >
              <span className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-[0_2px_14px_rgba(255,255,255,0.25)]">
                VESTIBULAR
              </span>
              <span className="text-4xl sm:text-5xl md:text-6xl font-black text-[#3b82f6] ml-1 tracking-tight drop-shadow-[0_0_24px_rgba(59,130,246,0.7)]">
                PRO
              </span>
            </motion.div>

            {/* SLOGAN SUBTITLE: "PREPARAÇÃO INTELIGENTE. FUTURO REAL." */}
            <motion.div
              initial={{ opacity: 0, letterSpacing: '0.12em' }}
              animate={phase >= 4 ? {
                opacity: 1,
                letterSpacing: '0.24em',
                transition: { duration: 0.7, ease: "easeOut" }
              } : {}}
              className="mt-3 flex items-center gap-2"
            >
              <div className="h-[1px] w-6 bg-gradient-to-r from-transparent to-blue-400/60 hidden sm:block" />
              <p className="text-[11px] sm:text-xs font-bold uppercase text-sky-200/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                PREPARAÇÃO INTELIGENTE. FUTURO REAL.
              </p>
              <div className="h-[1px] w-6 bg-gradient-to-l from-transparent to-blue-400/60 hidden sm:block" />
            </motion.div>
          </div>

          {/* BOTTOM: MODERN LOADING STATUS & PROGRESS TRACK */}
          <div className="w-full max-w-md flex flex-col items-center gap-3 z-30">
            {/* Dynamic Status Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={phase >= 4 ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="flex items-center justify-between w-full px-1 text-[11px] text-slate-400 font-medium"
            >
              <span className="flex items-center gap-1.5 text-slate-300">
                <Sparkles size={12} className="text-sky-400 animate-spin-slow" />
                {statusText}
              </span>
              <span className="font-mono text-sky-400 font-semibold">{progress}%</span>
            </motion.div>

            {/* Sleek Progress Bar */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0.9 }}
              animate={phase >= 4 ? { opacity: 1, scaleX: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full h-1.5 bg-slate-900/80 rounded-full border border-white/10 overflow-hidden relative shadow-inner"
            >
              {/* Animated Progress Fill */}
              <motion.div
                className="h-full bg-gradient-to-r from-blue-600 via-sky-400 to-blue-500 rounded-full relative"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              >
                {/* Glow leading edge */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full blur-[2px] shadow-[0_0_10px_#38bdf8]" />
              </motion.div>
            </motion.div>

            {/* Touch hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.35, 0.75, 0.35] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: 0.8 }}
              className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-1"
            >
              Toque em qualquer lugar para começar
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
