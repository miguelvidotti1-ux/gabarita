import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { motion } from 'motion/react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      id="theme-toggler-btn"
      onClick={toggleTheme}
      className="relative p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--card-border)] text-[var(--text-primary)] hover:text-[var(--text-accent)] hover:border-[var(--text-accent)]/30 transition-all duration-200 cursor-pointer shadow-sm active:scale-95 flex items-center justify-center w-10 h-10 overflow-hidden"
      title="Alternar Tema"
    >
      <motion.div
        key={theme}
        initial={{ y: -15, opacity: 0, rotate: -45 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-amber-400" />
        ) : (
          <Moon className="w-5 h-5 text-indigo-600" />
        )}
      </motion.div>
    </button>
  );
}
