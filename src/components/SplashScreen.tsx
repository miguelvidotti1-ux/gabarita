import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Volume2, VolumeX, Sparkles, RefreshCw } from 'lucide-react';
import { VestibularPro3DMark } from './VestibularProLogo';

interface SplashScreenProps {
  onFinish: () => void;
  videoSrc?: string;
}

export default function SplashScreen({ onFinish, videoSrc }: SplashScreenProps) {
  const [phase, setPhase] = useState<number>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [hasVideoError, setHasVideoError] = useState<boolean>(false);

  // Background floating stars/particles for ambient depth
  const particles = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      x: (i * 37) % 100,
      y: (i * 23) % 100,
      size: (i % 3) + 1.2,
      delay: (i * 0.12) % 2.5,
      duration: 2.8 + (i % 3),
      opacity: 0.15 + ((i % 5) * 0.14),
    }));
  }, []);

  // Sequenciador de animação de entrada cinema 3D
  useEffect(() => {
    // 0s: Ambient dark canvas initiates
    // 0.4s: Blue Cap floats in and scales up
    // 1.5s: Shockwave flash, Book base opens and stacks up
    // 2.7s: 3D Blue & White 'V' glyph drops & locks inside cap
    // 4.0s: Letters 'V', 'e', 's', 't', 'H', 'u', 'b' assemble with light flare
    // 5.5s: Subtitle "PREPARAÇÃO INTELIGENTE. FUTURO REAL." reveals with circular border ring
    // 6.8s: Optical flare sweep & pulse
    // 8.0s: Seamless transition into the application

    const t1 = setTimeout(() => setPhase(1), 350);
    const t2 = setTimeout(() => setPhase(2), 1500);
    const t3 = setTimeout(() => setPhase(3), 2700);
    const t4 = setTimeout(() => setPhase(4), 3900);
    const t5 = setTimeout(() => setPhase(5), 5300);
    const t6 = setTimeout(() => setPhase(6), 6600);
    const autoExit = setTimeout(() => triggerExit(), 8500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(autoExit);
    };
  }, []);

  const triggerExit = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onFinish();
    }, 550);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="vesthub-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: 'brightness(1.2)' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] bg-[#07090D] flex flex-col items-center justify-between py-8 px-6 overflow-hidden select-none cursor-pointer"
          onClick={triggerExit}
        >
          {/* CASO UM ARQUIVO DE VÍDEO SEJA FORNECIDO OU DETECTADO */}
          {videoSrc && !hasVideoError && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
              <video
                src={videoSrc}
                autoPlay
                muted
                playsInline
                onEnded={triggerExit}
                onError={() => setHasVideoError(true)}
                onLoadedData={() => setVideoLoaded(true)}
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>
          )}

          {/* CINEMATIC BACKDROP ATMOSPHERE (Deep Matte Dark Texture) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Dark vignette */}
            <div className="absolute inset-0 bg-radial from-transparent via-[#06080D]/70 to-[#020305]" />

            {/* Subtle rotating circular dark ring accent (from the video composition) */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[680px] md:w-[840px] md:h-[840px] rounded-full border-[18px] md:border-[28px] border-[#10141D] opacity-60 shadow-[inset_0_4px_16px_rgba(0,0,0,0.9),0_12px_40px_rgba(0,0,0,0.8)]"
              style={{
                borderLeftColor: '#171D2A',
                borderTopColor: '#0E121B',
              }}
            />

            {/* Glowing optical flare light burst */}
            <motion.div
              animate={phase >= 2 ? {
                opacity: [0, 0.45, 0.15],
                scale: [0.8, 1.4, 1.1]
              } : { opacity: 0 }}
              transition={{ duration: 1.6, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-r from-blue-600/30 via-sky-400/40 to-blue-700/30 rounded-full blur-[110px]"
            />

            {/* Fine Starlight Dust */}
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
                  opacity: [p.opacity * 0.3, p.opacity, p.opacity * 0.3],
                  scale: [0.8, 1.3, 0.8],
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

          {/* TOP BAR: PULAR / ENTRAR */}
          <div className="w-full max-w-5xl flex justify-between items-center z-30">
            <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                VestHub Experience
              </span>
            </div>

            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              onClick={(e) => {
                e.stopPropagation();
                triggerExit();
              }}
              className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-1.5 shadow-lg shadow-black/40 cursor-pointer group"
            >
              <span>Pular introdução</span>
              <ArrowRight size={13} className="text-blue-400 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </div>

          {/* MAIN CINEMATIC ANIMATION STAGE */}
          <div className="relative z-20 flex flex-col items-center justify-center my-auto w-full max-w-2xl text-center">

            {/* STAGE 1: EXPANDING SHOCKWAVE / OPTICAL BURST */}
            <AnimatePresence>
              {phase >= 2 && phase < 5 && (
                <motion.div
                  initial={{ scale: 0.2, opacity: 0 }}
                  animate={{ 
                    scale: [0.2, 1.3, 1.8], 
                    opacity: [0, 0.8, 0] 
                  }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute w-64 h-64 rounded-full border border-sky-400/80 shadow-[0_0_80px_rgba(56,189,248,0.7),inset_0_0_40px_rgba(56,189,248,0.4)] pointer-events-none"
                />
              )}
            </AnimatePresence>

            {/* STAGE 2: LIGHT FLARE BURST HORIZONTAL */}
            <AnimatePresence>
              {phase === 2 && (
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ 
                    scaleX: [0, 1.6, 2], 
                    opacity: [0, 1, 0] 
                  }}
                  transition={{ duration: 0.85, ease: "easeInOut" }}
                  className="absolute w-[450px] h-[3px] bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_24px_#38bdf8] pointer-events-none"
                />
              )}
            </AnimatePresence>

            {/* 3D LOGO EMBLEM: GRADUATION CAP + BOOK + 3D 'V' (REPLICATING VIDEO TIMELINE) */}
            <div className="relative mb-6 flex flex-col items-center justify-center">
              
              {/* Backlight circular glow behind emblem */}
              <motion.div
                animate={phase >= 3 ? {
                  opacity: [0.35, 0.65, 0.35],
                  scale: [0.95, 1.05, 0.95]
                } : { opacity: 0.2 }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-44 h-44 rounded-full bg-blue-600/30 blur-2xl pointer-events-none"
              />

              {/* The 3D Shield / Emblem Badge */}
              <motion.div
                initial={{ scale: 0.3, y: -40, opacity: 0 }}
                animate={phase >= 1 ? {
                  scale: phase >= 4 ? 0.92 : 1.08,
                  y: 0,
                  opacity: 1,
                  transition: {
                    type: "spring",
                    stiffness: 240,
                    damping: 20,
                  }
                } : {}}
                className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center filter drop-shadow-[0_16px_36px_rgba(0,0,0,0.85)]"
              >
                {/* SVG High-Fidelity 3D VestHub Emblem */}
                <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-contain">
                  <defs>
                    <linearGradient id="vhCapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="45%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#1e3a8a" />
                    </linearGradient>

                    <linearGradient id="vhBlueVGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="50%" stopColor="#1d4ed8" />
                      <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>

                    <linearGradient id="vhWhiteBookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="70%" stopColor="#f1f5f9" />
                      <stop offset="100%" stopColor="#cbd5e1" />
                    </linearGradient>

                    <filter id="vhGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#2563eb" floodOpacity="0.45" />
                    </filter>
                  </defs>

                  {/* 3D BLUE GRADUATION CAP (TOP) */}
                  <g filter="url(#vhGlow)">
                    {/* Cap base band */}
                    <path
                      d="M50 48 V56 C50 63 110 63 110 56 V48"
                      fill="#172554"
                      stroke="#3b82f6"
                      strokeWidth="1.5"
                    />

                    {/* Cap Diamond Rooftop (3D perspective) */}
                    <path
                      d="M80 20 L132 38 L80 56 L28 38 Z"
                      fill="url(#vhCapGrad)"
                      stroke="#93c5fd"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />

                    {/* White Cap Tassel hanging on right */}
                    <path
                      d="M80 38 Q118 42 126 62"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <circle cx="126" cy="63" r="3" fill="#ffffff" />
                    <circle cx="80" cy="38" r="2.5" fill="#ffffff" />
                  </g>

                  {/* OPEN BOOK / WHITE WINGS GEOMETRY (MIDDLE) */}
                  <g>
                    {/* Left Page Wing */}
                    <path
                      d="M80 56 L34 50 L42 66 L80 72 Z"
                      fill="url(#vhWhiteBookGrad)"
                      stroke="#ffffff"
                      strokeWidth="1"
                    />
                    {/* Right Page Wing */}
                    <path
                      d="M80 56 L126 50 L118 66 L80 72 Z"
                      fill="url(#vhWhiteBookGrad)"
                      stroke="#ffffff"
                      strokeWidth="1"
                    />
                    {/* Book spine line */}
                    <line x1="80" y1="56" x2="80" y2="72" stroke="#94a3b8" strokeWidth="2" />
                  </g>

                  {/* LOWER SHARP 3D 'V' (BOTTOM WINGS) */}
                  <g>
                    {/* Left Wing Facet */}
                    <path
                      d="M44 68 L80 138 L80 72 L44 68 Z"
                      fill="#1e40af"
                    />
                    {/* Right Wing Facet */}
                    <path
                      d="M116 68 L80 138 L80 72 L116 68 Z"
                      fill="url(#vhBlueVGrad)"
                    />
                    {/* Outer 3D Wing Edges */}
                    <path
                      d="M36 64 L80 148 L44 68 Z"
                      fill="#1e3a8a"
                    />
                    <path
                      d="M124 64 L80 148 L116 68 Z"
                      fill="#1d4ed8"
                    />
                  </g>
                </svg>
              </motion.div>
            </div>

            {/* BRAND TYPOGRAPHY: "VestHub" WITH OPTICAL SHEEN */}
            <div className="relative overflow-hidden py-2">
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={phase >= 4 ? {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] }
                } : {}}
                className="flex items-center justify-center font-sans"
              >
                {/* Letter V with stylized font */}
                <span className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tight drop-shadow-[0_4px_18px_rgba(255,255,255,0.25)]">
                  Vest
                </span>

                {/* Letters Hub in vivid royal cobalt blue with neon core */}
                <span className="text-5xl sm:text-6xl md:text-7xl font-black text-[#2563eb] tracking-tight drop-shadow-[0_0_30px_rgba(37,99,235,0.85)] ml-0.5">
                  Hub
                </span>

                {/* Light lens reflection gleam on letter H */}
                <motion.div
                  initial={{ x: '-150%', opacity: 0 }}
                  animate={phase >= 5 ? {
                    x: '200%',
                    opacity: [0, 0.85, 0]
                  } : {}}
                  transition={{ duration: 1.1, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-20 pointer-events-none"
                />
              </motion.div>
            </div>

            {/* OFFICIAL SLOGAN SUBTITLE: "PREPARAÇÃO INTELIGENTE. FUTURO REAL." */}
            <motion.div
              initial={{ opacity: 0, letterSpacing: '0.12em', y: 10 }}
              animate={phase >= 5 ? {
                opacity: 1,
                letterSpacing: '0.26em',
                y: 0,
                transition: { duration: 0.75, ease: "easeOut" }
              } : {}}
              className="mt-3 flex items-center justify-center gap-2"
            >
              <div className="h-[1px] w-6 md:w-10 bg-gradient-to-r from-transparent to-blue-400/60" />
              <p className="text-[11px] sm:text-xs md:text-sm font-extrabold uppercase text-slate-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] tracking-[0.25em]">
                PREPARAÇÃO INTELIGENTE. FUTURO REAL.
              </p>
              <div className="h-[1px] w-6 md:w-10 bg-gradient-to-l from-transparent to-blue-400/60" />
            </motion.div>
          </div>

          {/* BOTTOM: SUBTLE PULSING TOUCH/PROGRESS CUE */}
          <div className="w-full max-w-sm flex flex-col items-center gap-2.5 z-30">
            {/* Cinematic progress bar */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={phase >= 4 ? { opacity: 1, width: '100%' } : {}}
              transition={{ duration: 0.4 }}
              className="h-1 bg-slate-900/90 rounded-full border border-white/10 overflow-hidden relative"
            >
              <motion.div
                initial={{ width: '0%' }}
                animate={phase >= 4 ? { width: '100%' } : { width: '0%' }}
                transition={{ duration: 4.2, ease: "linear" }}
                className="h-full bg-gradient-to-r from-blue-600 via-sky-400 to-blue-500 rounded-full"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.35, 0.8, 0.35] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              className="text-[10px] text-slate-400 font-medium uppercase tracking-widest"
            >
              Toque na tela para iniciar
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
