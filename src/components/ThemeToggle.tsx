import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <div
      id="app-icon"
      onClick={toggleTheme}
      className="text-3xl cursor-pointer p-2 rounded-full transition-transform hover:scale-110 active:scale-95 select-none"
      title="Alternar Tema"
    >
      🚀
    </div>
  );
}
