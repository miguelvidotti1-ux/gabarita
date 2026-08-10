import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { motion } from 'motion/react';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      id="theme-toggler-btn"
      onClick={toggleTheme}
      className={`relative p-2.5 rounded-xl bg-white dark:bg-[#1A1A1E] border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-[#F0F1F4] hover:border-amber-400/50 dark:hover:border-amber-400/50 hover:scale-105 transition-all duration-200 cursor-pointer shadow-xl active:scale-95 flex items-center justify-center w-11 h-11 overflow-hidden ${className}`}
      title={theme === 'dark' ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
    >
      <motion.div
        key={theme}
        initial={{ y: -15, opacity: 0, rotate: -45 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
        ) : (
          <Moon className="w-5 h-5 text-indigo-600" />
        )}
      </motion.div>
    </button>
  );
}
