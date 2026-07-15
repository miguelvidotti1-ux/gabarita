import * as React from 'react';
import { motion } from 'motion/react';
import { Book, BookOpen, GraduationCap, LayoutDashboard, FileText, Video, User, LogOut, Menu, X, Moon, Sun, Sparkles, Users, Zap, Trophy, Calendar, Award, FileSpreadsheet } from 'lucide-react';
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

  const sections: {
    title: string;
    items: {
      id: string;
      label: string;
      icon: any;
      isNew?: boolean;
    }[];
  }[] = [
    {
      title: 'Principal',
      items: [
        { id: 'home', label: 'Início', icon: BookOpen },
        { id: 'dashboard', label: 'Meu Painel', icon: LayoutDashboard },
        { id: 'agenda', label: 'Cronograma', icon: Calendar },
      ]
    },
    {
      title: 'Provas & Conteúdos',
      items: [
        { id: 'vestibulares', label: 'Vestibulares', icon: GraduationCap },
        { id: 'gabaritos', label: 'Gabaritos Oficiais', icon: FileSpreadsheet },
        { id: 'conteudos', label: 'Matérias', icon: BookOpen },
        { id: 'videos', label: 'Vídeo-Aulas', icon: Video },
        { id: 'biblioteca', label: 'Biblioteca', icon: Book },
      ]
    },
    {
      title: 'Prática & Gamificação',
      items: [
        { id: 'desafio', label: 'Desafio Semanal', icon: Trophy },
        { id: 'conquistas', label: 'Metas e Conquistas', icon: Award },
        { id: 'redacao', label: 'Laboratório de Redação', icon: FileText },
      ]
    },
    {
      title: 'Tutor & Info',
      items: [
        { id: 'chat', label: 'Conversar com IA', icon: Sparkles },
        { id: 'sobre', label: 'Sobre o App', icon: Users },
      ]
    }
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
          <GraduationCap className="text-[var(--text-accent)] w-8 h-8" />
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-[var(--text-accent)] to-purple-600 bg-clip-text text-transparent">Vestibular Pro</span>
        </button>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-[var(--text-primary)] p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 bg-[var(--card-bg)] border-r border-[var(--card-border)] w-68 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        flex flex-col h-screen md:sticky md:top-0
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 hidden md:flex items-center justify-between border-b border-[var(--card-border)]">
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2"
          >
            <GraduationCap className="text-[var(--text-accent)] w-8 h-8" />
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-[var(--text-accent)] to-indigo-500 bg-clip-text text-transparent">Vestibular Pro</span>
          </button>
          <ThemeToggle />
        </div>

        <nav className="p-4 space-y-5 flex-1 overflow-y-auto">
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1.5">
              <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] opacity-60">
                {section.title}
              </span>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer
                      ${activeTab === item.id 
                        ? 'bg-[var(--button-bg)] text-white shadow-md shadow-[var(--button-bg)]/20 font-semibold' 
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'}
                    `}
                  >
                    <item.icon size={18} className={activeTab === item.id ? "text-white" : "text-[var(--text-secondary)]"} />
                    <span className="text-[13px] font-medium flex-1 text-left">{item.label}</span>
                    {item.isNew && (
                      <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold text-[8px] px-1.5 py-0.5 rounded-md uppercase tracking-wider animate-pulse shadow-sm">
                        Novo
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
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
