import { useState, useEffect } from 'react';

export type ThemeMode = 'dark' | 'light';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('theme') || localStorage.getItem('vestibular-theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // ignore
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.setAttribute('data-theme', theme);
    root.style.setProperty('--bg-color', theme === 'dark' ? '#000000' : '#F8FAFC');
    root.style.setProperty('--text-color', theme === 'dark' ? '#FAFAFA' : '#0F172A');
    try {
      localStorage.setItem('theme', theme);
      localStorage.setItem('vestibular-theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return { theme, setTheme, toggleTheme };
}
