import * as React from 'react';
import { motion } from 'motion/react';
import { 
  Book, 
  BookOpen, 
  GraduationCap, 
  LayoutDashboard, 
  FileText, 
  Video, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Sparkles, 
  Users, 
  Trophy, 
  Calendar, 
  Award, 
  FileSpreadsheet, 
  Layers, 
  Crown,
  CheckCircle,
  Home,
  Pencil,
  BarChart2,
  PieChart,
  Settings,
  Info,
  Headphones,
  Mic,
  Zap
} from 'lucide-react';
import { auth, db } from '../firebase';
import VestibularProLogo from './VestibularProLogo';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useTheme } from '../hooks/useTheme';
import ThemeToggle from './ThemeToggle';
import EditProfileModal, { UserProfileData } from './EditProfileModal';
import ConfigModal from './ConfigModal';
import ToastFeedback, { ToastData } from './ToastFeedback';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
  onLogout?: () => void;
}

export default function Layout({ children, activeTab, setActiveTab, user, onLogout }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = React.useState(false);
  const [isConfigOpen, setIsConfigOpen] = React.useState(false);
  const [profileData, setProfileData] = React.useState<UserProfileData | null>(null);
  const [toasts, setToasts] = React.useState<ToastData[]>([]);
  const { theme } = useTheme();

  const addToast = (type: 'success' | 'error', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  // Load profile data on mount or user change
  React.useEffect(() => {
    const loadProfile = async () => {
      try {
        const local = localStorage.getItem('vesthub_user_profile');
        if (local) {
          try {
            setProfileData(JSON.parse(local));
          } catch (e) {
            console.error('Failed to parse local profile', e);
          }
        }

        if (user?.uid) {
          const userRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const data = snap.data() as any;
            setProfileData((prev) => ({
              displayName: data.displayName || prev?.displayName || user.displayName || 'Miguel Vidotti',
              email: data.email || prev?.email || user.email || 'miguel@email.com',
              bio: data.bio || prev?.bio || '',
              dailyGoalMinutes: data.dailyGoalMinutes || prev?.dailyGoalMinutes || 40,
              photoUrl: data.photoUrl || prev?.photoUrl || user.photoURL || null,
              avatarColor: data.avatarColor || prev?.avatarColor || '#2563EB',
              vestibulares: data.vestibulares || prev?.vestibulares || ['ENEM', 'FUVEST', 'UNICAMP'],
              focusAreas: data.focusAreas || prev?.focusAreas || ['Linguagens', 'Ciências da Natureza', 'Matemática'],
              notifications: data.notifications || prev?.notifications || { lembretes: true, novosGabaritos: true, resumoSemanal: false },
              frame: data.frame || prev?.frame || 'padrao',
              badge: data.badge || prev?.badge || 'iniciante',
              themeColor: data.themeColor || prev?.themeColor || 'azul'
            }));
          }
        }
      } catch (err) {
        console.warn('Error loading user profile in layout:', err);
      }
    };

    loadProfile();
  }, [user]);

  const sections: {
    title: string;
    items: {
      id: string;
      label: string;
      icon: any;
      isNew?: boolean;
      onClick?: () => void;
    }[];
  }[] = [
    {
      title: 'Principal',
      items: [
        { id: 'home', label: 'Início', icon: Home },
        { id: 'dashboard', label: 'Meu Painel', icon: LayoutDashboard },
        { id: 'treino', label: 'Treino Rápido', icon: Zap, isNew: true },
        { id: 'agenda', label: 'Cronograma', icon: Calendar },
        { id: 'vestibulares', label: 'Vestibulares', icon: GraduationCap },
        { id: 'sisu', label: 'Simulador Sisu', icon: GraduationCap, isNew: true },
        { id: 'gabaritos', label: 'Gabaritos', icon: CheckCircle },
      ]
    },
    {
      title: 'Análise',
      items: [
        { id: 'desempenho', label: 'Desempenho', icon: BarChart2, onClick: () => setActiveTab('dashboard') },
        { id: 'relatorios', label: 'Relatórios', icon: PieChart, onClick: () => setActiveTab('dashboard') },
      ]
    },
    {
      title: 'Estudos & Módulos',
      items: [
        { id: 'skillswipe', label: 'FlashCards', icon: Layers },
        { id: 'spotify', label: 'Músicas para Estudar', icon: Headphones },
        { id: 'redacao', label: 'Redação IA', icon: FileText },
        { id: 'conteudos', label: 'Matérias', icon: BookOpen },
        { id: 'videos', label: 'Vídeo-Aulas', icon: Video },
        { id: 'chat', label: 'Conversar com IA', icon: Sparkles },
        { id: 'transcricao', label: 'Transcrever Áudio', icon: Mic },
      ]
    },
    {
      title: 'Conta & Plataforma',
      items: [
        { 
          id: 'configuracoes', 
          label: 'Configurações', 
          icon: Settings,
          onClick: () => setIsConfigOpen(true)
        },
        { 
          id: 'onboarding', 
          label: 'Diagnóstico & Metas', 
          icon: Sparkles,
          onClick: () => window.dispatchEvent(new CustomEvent('abrir-onboarding'))
        },
        { id: 'planos', label: 'Plano & Assinatura', icon: Crown },
        { id: 'sobre', label: 'Sobre o App', icon: Info },
      ]
    }
  ];

  // Close mobile drawer on Escape key and lock background scroll while open on mobile
  React.useEffect(() => {
    if (!isMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const prevOverflow = document.body.style.overflow;
    if (isMobile) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (isMobile) {
        document.body.style.overflow = prevOverflow;
      }
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Error during signOut:', err);
    }
    if (onLogout) {
      onLogout();
    }
  };

  const displayName = profileData?.displayName || user?.displayName || 'Miguel Vidotti';
  const displayRole = user?.role === 'admin' ? 'Administrador' : 'Assinante Gabarita';

  const getInitials = () => {
    if (displayName) {
      const parts = displayName.trim().split(' ').filter(Boolean);
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return displayName.substring(0, 2).toUpperCase();
    }
    if (user?.email) return user.email.substring(0, 2).toUpperCase();
    return 'MV';
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col md:flex-row transition-colors duration-300">
      {/* Mobile Header */}
      <header className="md:hidden bg-[var(--bg-sidebar)] border-b border-[var(--border-light)] px-4 py-2.5 flex justify-between items-center sticky top-0 z-30">
        <button 
          type="button"
          onClick={() => {
            setActiveTab('home');
            setIsMenuOpen(false);
          }}
          className="flex items-center gap-2.5 min-h-[44px] cursor-pointer"
        >
          <VestibularProLogo className="w-9 h-9 shrink-0" bgVariant={theme === 'dark' ? 'black' : 'primary'} />
          <span className="font-extrabold tracking-tight text-xl text-[var(--text-main)] whitespace-nowrap">Gabarita</span>
        </button>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <button 
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            aria-label={isMenuOpen ? 'Fechar menu lateral' : 'Abrir menu lateral'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-sidebar"
            className="text-[var(--text-muted)] hover:text-[var(--text-main)] min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] md:hidden"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        id="mobile-sidebar"
        aria-label="Menu principal"
        className={`
          fixed inset-y-0 left-0 z-50 bg-[var(--bg-sidebar)] border-r border-[var(--border-light)] w-[min(288px,85vw)] md:w-68 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:z-auto
          flex flex-col h-dvh md:h-screen md:sticky md:top-0
          ${isMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:shadow-none'}
        `}
      >
        {/* Sidebar Header / Logo (visible on both mobile drawer & desktop sidebar) */}
        <div className="px-4 py-3 md:p-6 flex items-center justify-between border-b border-[var(--border-light)] bg-[var(--bg-sidebar)] shrink-0">
          <button 
            type="button"
            onClick={() => {
              setActiveTab('home');
              setIsMenuOpen(false);
            }}
            className="flex items-center gap-2.5 min-h-[44px] md:min-h-0 cursor-pointer"
          >
            <VestibularProLogo className="w-9 h-9 shrink-0" bgVariant={theme === 'dark' ? 'black' : 'primary'} />
            <span className="font-extrabold tracking-tight text-xl text-[var(--text-main)] whitespace-nowrap">Gabarita</span>
          </button>
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Fechar menu lateral"
              className="text-[var(--text-muted)] hover:text-[var(--text-main)] min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="p-4 space-y-5 md:space-y-6 flex-1 min-h-0 overflow-y-auto overscroll-contain bg-[var(--bg-sidebar)]">
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <div className="text-[11px] font-semibold text-[var(--text-label)] uppercase tracking-wider px-2 pb-1.5">
                {section.title}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;
                  const isAgenda = item.id === 'agenda';
                  return (
                    <div key={item.id} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (item.onClick) {
                            item.onClick();
                          } else {
                            setActiveTab(item.id);
                          }
                          setIsMenuOpen(false);
                        }}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 min-h-[44px] md:min-h-0 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer text-left
                          ${isActive 
                            ? 'bg-[var(--primary)] text-white shadow-sm shadow-[var(--shadow-primary)] font-semibold' 
                            : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'}
                        `}
                      >
                        <Icon size={18} className="shrink-0" />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.isNew ? (
                          <span className="bg-sky-100 dark:bg-zinc-800 text-sky-800 dark:text-zinc-200 font-bold text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0">
                            Novo
                          </span>
                        ) : null}
                      </button>
                      {isAgenda && (
                        <div className="pl-6 pr-1">
                          <button
                            id="btn-abrir-cronograma-menu"
                            type="button"
                            onClick={() => {
                              setActiveTab('agenda');
                              window.dispatchEvent(new CustomEvent('abrir-cronograma-macro'));
                              setIsMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 md:py-1.5 min-h-[40px] md:min-h-0 rounded-lg text-xs font-semibold bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 hover:text-blue-300 border border-blue-500/20 transition-all cursor-pointer text-left"
                            title="Abrir Meu Cronograma & Planejamento"
                          >
                            <Sparkles size={12} className="text-blue-400 shrink-0" />
                            <span className="truncate">Meu Cronograma & Planejamento</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-[var(--border-light)] bg-[var(--bg-sidebar)] shrink-0">
          {user ? (
            <div 
              id="sidebar-user-profile"
              onClick={() => {
                setIsMenuOpen(false);
                setIsConfigOpen(true);
              }}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--bg-hover)] hover:bg-[var(--border-light)] transition-all group cursor-pointer border border-transparent hover:border-[var(--border-color)]"
              title="Clique para abrir configurações e perfil"
            >
              <div 
                id="sidebar-avatar"
                className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm overflow-hidden border-2 border-[var(--border-light)] relative"
                style={{
                  backgroundColor: profileData?.photoUrl ? 'transparent' : (profileData?.avatarColor || 'var(--primary)')
                }}
              >
                {profileData?.photoUrl ? (
                  <img
                    src={profileData.photoUrl}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{getInitials()}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p id="sidebar-name" className="text-xs font-semibold text-[var(--text-main)] truncate">
                  {displayName}
                </p>
                <p className="text-[11px] text-[var(--text-label)] truncate">
                  {displayRole}
                </p>
              </div>
              
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    setIsEditProfileOpen(true);
                  }}
                  title="Editar perfil"
                  aria-label="Editar perfil"
                  className="text-[var(--text-label)] hover:text-[var(--primary)] transition-colors min-h-[40px] min-w-[40px] md:min-h-0 md:min-w-0 flex items-center justify-center p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <Pencil size={15} />
                </button>
                <button 
                  id="btn-sidebar-logout"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLogout();
                  }} 
                  title="Sair da conta"
                  aria-label="Sair da conta"
                  className="text-[var(--text-label)] hover:text-rose-600 dark:hover:text-rose-400 transition-colors min-h-[40px] min-w-[40px] md:min-h-0 md:min-w-0 flex items-center justify-center p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          ) : (
            <button 
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                setActiveTab('login');
              }}
              className="w-full flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white py-2.5 min-h-[44px] rounded-lg transition-all font-semibold text-xs shadow-md shadow-[var(--shadow-primary)] cursor-pointer"
            >
              <User size={16} />
              <span>Entrar</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main 
        className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto bg-[var(--bg-main)]"
      >
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="max-w-7xl mx-auto"
        >
          {children}
        </motion.div>
      </main>

      {/* CONFIG MODAL */}
      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onToast={addToast}
      />

      {/* EDIT PROFILE MODAL */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={user}
        onProfileUpdated={(updated) => {
          setProfileData(updated);
          addToast('success', 'Perfil atualizado com sucesso!');
        }}
      />

      {/* GLOBAL TOAST FEEDBACK */}
      <ToastFeedback
        toasts={toasts}
        onRemove={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
}

