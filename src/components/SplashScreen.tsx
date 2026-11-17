import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Volume2, VolumeX, Play, RotateCcw } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
  videoSrc?: string;
}

const DEFAULT_VIDEO = '/assets/aistudio/Animate_logo_with_camera_movement_20261022074301_6b06e15f.mp4';

export default function SplashScreen({
  onFinish,
  videoSrc = DEFAULT_VIDEO
}: SplashScreenProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(10);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const triggerExit = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onFinish();
    }, 500);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = isMuted;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.warn('Autoplay with sound prevented, playing muted:', err);
            video.muted = true;
            setIsMuted(true);
            video.play().catch(() => {});
          });
      }
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        triggerExit();
      }
    };
    window.addEventListener('keydown', handleKey);

    // Failsafe timeout in case video stalls or fails to end (11 seconds max)
    const failsafe = setTimeout(() => {
      triggerExit();
    }, 11500);

    return () => {
      window.removeEventListener('keydown', handleKey);
      clearTimeout(failsafe);
    };
  }, []);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.duration) {
      setDuration(video.duration);
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (video) {
      const nextMuted = !isMuted;
      video.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const restartVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="vesthub-splash-video"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03, filter: 'brightness(1.15)' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] bg-[#03060c] flex flex-col items-center justify-between overflow-hidden select-none cursor-pointer"
          onClick={triggerExit}
        >
          {/* TOP CONTROLS BAR */}
          <header className="w-full max-w-6xl px-6 pt-5 pb-3 flex justify-between items-center z-30 pointer-events-auto">
            {/* Logo Badge */}
            <div className="flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-black tracking-widest text-slate-200 uppercase">
                Gabarita
              </span>
              <span className="text-[10px] text-blue-400 font-bold px-1.5 py-0.5 rounded bg-blue-500/20">
                Abertura Oficial
              </span>
            </div>

            {/* Actions: Sound toggle + Skip button */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={toggleSound}
                title={isMuted ? 'Ativar som' : 'Desativar som'}
                className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-black/40 hover:bg-black/70 active:scale-95 border border-white/10 text-slate-200 hover:text-white text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-1.5 shadow-lg shadow-black/40 cursor-pointer"
              >
                {isMuted ? (
                  <>
                    <VolumeX size={15} className="text-amber-400" />
                    <span className="hidden sm:inline text-[11px] font-bold">Ativar Som</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={15} className="text-emerald-400" />
                    <span className="hidden sm:inline text-[11px] font-bold">Som Ativo</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerExit();
                }}
                className="px-4 py-1.5 rounded-full bg-blue-600/80 hover:bg-blue-600 active:scale-95 border border-blue-400/40 text-white text-xs font-bold backdrop-blur-md transition-all flex items-center gap-1.5 shadow-lg shadow-blue-500/20 cursor-pointer group"
              >
                <span>Pular</span>
                <ArrowRight size={13} className="text-white group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </header>

          {/* MAIN VIDEO PLAYER CONTAINER */}
          <main className="relative flex-1 w-full flex items-center justify-center p-0 md:p-4 overflow-hidden">
            {/* Subtle background ambient glow matching video hues */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
              <div className="w-[80vw] max-w-[800px] h-[50vh] bg-blue-700/15 rounded-full blur-[140px]" />
              <div className="w-[60vw] max-w-[600px] h-[40vh] bg-sky-500/10 rounded-full blur-[110px]" />
            </div>

            {/* Video element */}
            <video
              ref={videoRef}
              src={videoSrc}
              autoPlay
              muted={isMuted}
              playsInline
              preload="auto"
              onTimeUpdate={handleTimeUpdate}
              onEnded={triggerExit}
              onError={() => {
                console.warn('Video failed to load, falling back to instant enter.');
                setHasError(true);
                setTimeout(triggerExit, 1200);
              }}
              className="w-full h-full max-h-[88vh] object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
            />
          </main>

          {/* BOTTOM PROGRESS AND HINT BAR */}
          <footer className="w-full max-w-2xl px-6 pb-6 pt-2 flex flex-col items-center gap-2 z-30 pointer-events-none">
            {/* Synchronized timeline progress line */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-blue-400 rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                transition={{ ease: 'linear', duration: 0.1 }}
              />
            </div>

            <div className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-400" />
                <span>Toque na tela ou pressione Espaço para entrar</span>
              </span>

              <span className="text-[10px] text-slate-500 font-mono">
                {videoRef.current ? `${videoRef.current.currentTime.toFixed(1)}s / ${duration.toFixed(0)}s` : '10s'}
              </span>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
