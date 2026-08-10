import * as React from 'react';
import { motion } from 'motion/react';
import { Book, BookOpen, GraduationCap, LayoutDashboard, FileText, Video, User, LogOut, Menu, X, Sparkles, Users, Trophy, Calendar, Award, FileSpreadsheet, Layers, Crown } from 'lucide-react';
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
        { id: 'planos', label: 'Planos & Assinatura', icon: Crown, isNew: true },
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
        { id: 'skillswipe', label: 'Flashcards', icon: Layers },
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-300">
      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800/80 p-4 flex justify-between items-center sticky top-0 z-50">
        <button 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2"
        >
          <GraduationCap className="text-indigo-600 dark:text-indigo-400 w-8 h-8" />
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">VestHub</span>
        </button>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 dark:text-slate-400 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 bg-white dark:bg-[#0F172A] border-r border-slate-200 dark:border-slate-800/80 w-72 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        flex flex-col h-screen md:sticky md:top-0
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 hidden md:flex items-center justify-between">
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2"
          >
            <GraduationCap className="text-indigo-600 dark:text-indigo-400 w-8 h-8" />
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent">VestHub</span>
          </button>
          <ThemeToggle />
        </div>

        <nav className="p-4 space-y-6 flex-1 overflow-y-auto">
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1.5">
              <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
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
                        ? 'bg-indigo-600 dark:bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-500/20' 
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'}
                    `}
                  >
                    <item.icon size={18} className={activeTab === item.id ? "text-white" : "text-slate-500 dark:text-slate-400"} />
                    <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                    {item.isNew && (
                      <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider border border-amber-300/50 dark:border-amber-700/50">
                        Novo
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="w-full p-6 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#0F172A]">
          <div className="flex flex-col gap-4">
            {user ? (
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
                    {user.displayName?.[0] || user.email?.[0].toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{user.displayName || 'Usuário'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="text-slate-400 hover:text-rose-500 transition-colors p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setActiveTab('login')}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl transition-all font-bold text-sm shadow-md shadow-indigo-500/20"
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
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="max-w-7xl mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
