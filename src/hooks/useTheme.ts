import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme] = useState<'dark'>('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
    root.style.setProperty('--bg-color', '#0A0A0A');
    root.style.setProperty('--text-color', '#FAFAFA');
    localStorage.setItem('theme', 'dark');
    localStorage.setItem('vestibular-theme', 'dark');
  }, []);

  const toggleTheme = () => {
    // Permanent dark mode
  };

  return { theme: 'dark' as const, toggleTheme };
}

