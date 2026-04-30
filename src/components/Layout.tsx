import * as React from 'react';
import { motion } from 'motion/react';
import { BookOpen, GraduationCap, LayoutDashboard, FileText, Video, User, LogOut, Menu, X, Moon, Sun, Sparkles, Users } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../hooks/useTheme';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
}

export default function Layout({ children, activeTab, setActiveTab, user }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { theme } = useTheme();

  const navItems = [
    { id: 'home', label: 'Home', icon: BookOpen },
    { id: 'vestibulares', label: 'Vestibulares', icon: GraduationCap },
    { id: 'todas-provas', label: 'Todas as Provas', icon: FileText },
    { id: 'redacao', label: 'Redação', icon: FileText },
    { id: 'conteudos', label: 'Conteúdos', icon: BookOpen },
    { id: 'videos', label: 'Vídeos', icon: Video },
    { id: 'chat', label: 'Conversar com IA', icon: Sparkles },
    { id: 'sobre', label: 'Sobre', icon: Users },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col md:flex-row transition-colors duration-300">
      {/* Mobile Header */}
      <div className="md:hidden bg-[var(--bg-primary)] border-b border-[var(--card-border)] p-4 flex justify-between items-center sticky top-0 z-50">
        <button 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2"
        >
          <GraduationCap className="text-[var(--text-primary)] w-8 h-8" />
          <span className="font-bold text-xl">Vestibular Pro</span>
        </button>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-[var(--text-primary)]">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-0 z-40 bg-[var(--bg-primary)] border-r border-[var(--card-border)] w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        flex flex-col
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 hidden md:flex items-center justify-between border-b border-[var(--card-border)]">
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2"
          >
            <GraduationCap className="text-[var(--text-primary)] w-8 h-8" />
            <span className="font-bold text-xl">Vestibular Pro</span>
          </button>
          <ThemeToggle />
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMenuOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${activeTab === item.id 
                  ? 'bg-[var(--button-bg)] text-white shadow-lg' 
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="w-full p-4 border-t border-[var(--card-border)] bg-[var(--bg-primary)]">
          <div className="flex flex-col gap-4">
            {user ? (
              <div className="flex items-center justify-between pt-4 border-t border-[var(--card-border)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-primary)] font-bold border border-[var(--card-border)]">
                    {user.displayName?.[0] || user.email?.[0].toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold truncate">{user.displayName || 'Usuário'}</p>
                    <p className="text-xs text-[var(--text-secondary)] truncate">{user.email}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="text-[var(--text-secondary)] hover:text-red-500 transition-colors">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setActiveTab('login')}
                className="w-full flex items-center justify-center gap-2 bg-[var(--button-bg)] text-white py-2 rounded-lg hover:bg-[var(--button-bg-hover)] transition-colors"
              >
                <User size={18} />
                <span>Entrar</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
