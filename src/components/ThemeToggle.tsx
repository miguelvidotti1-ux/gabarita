import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
      aria-label={isDark ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
      className={`p-2 rounded-xl border border-[var(--border-light)] bg-[var(--bg-hover)] hover:border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer inline-flex items-center justify-center ${className}`}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
