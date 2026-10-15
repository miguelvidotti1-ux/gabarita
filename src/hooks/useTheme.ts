import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme] = useState<'dark'>('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
    root.style.setProperty('--bg-color', '#000000');
    root.style.setProperty('--text-color', '#FAFAFA');
    try {
      localStorage.setItem('theme', 'dark');
      localStorage.setItem('vestibular-theme', 'dark');
    } catch (e) {}
  }, []);

  const toggleTheme = () => {
    // Permanent dark mode
  };

  return { theme: 'dark' as const, toggleTheme };
}

