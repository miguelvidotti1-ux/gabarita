import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RefreshCw, Coffee, Brain } from 'lucide-react';
import { motion } from 'motion/react';

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          const nextMode = mode === 'focus' ? 'break' : 'focus';
          setMode(nextMode);
          return nextMode === 'focus' ? 25 * 60 : 5 * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, mode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center gap-4 h-full">
      <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold">
        {mode === 'focus' ? <Brain size={20} className="text-indigo-600 dark:text-indigo-400" /> : <Coffee size={20} className="text-amber-500" />}
        <h3 className="text-base font-display font-extrabold">{mode === 'focus' ? 'Foco Total (25 min)' : 'Hora da Pausa (5 min)'}</h3>
      </div>
      
      <div className="text-5xl font-black font-mono text-slate-900 dark:text-white tracking-wider my-2">
        {formatTime(timeLeft)}
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={() => setIsRunning(!isRunning)}
          className={`p-3.5 rounded-2xl cursor-pointer transition-all ${
            isRunning 
              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 hover:bg-amber-200' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20'
          }`}
          title={isRunning ? 'Pausar Cronômetro' : 'Iniciar Foco'}
        >
          {isRunning ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
        </button>
        <button 
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
          }}
          className="p-3.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-colors cursor-pointer"
          title="Reiniciar"
        >
          <RefreshCw size={22} />
        </button>
      </div>
    </div>
  );
}
