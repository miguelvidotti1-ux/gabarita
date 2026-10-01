import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  GraduationCap, 
  Camera, 
  Sliders, 
  X, 
  Check, 
  Trash2, 
  Upload, 
  Clock, 
  Sparkles, 
  Award, 
  Circle, 
  Flame, 
  BookOpen, 
  Compass, 
  Activity, 
  BarChart3, 
  FileText,
  AlertCircle,
  CheckCircle2,
  Lock,
  Star,
  Zap,
  Crown
} from 'lucide-react';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface UserProfileData {
  displayName: string;
  email: string;
  bio: string;
  dailyGoalMinutes: number;
  photoUrl: string | null;
  avatarColor: string;
  vestibulares: string[];
  focusAreas: string[];
  notifications: {
    lembretes: boolean;
    novosGabaritos: boolean;
    resumoSemanal: boolean;
  };
  frame: string;
  badge: string;
  themeColor: string;
}

const DEFAULT_PROFILE: UserProfileData = {
  displayName: 'Miguel Vidotti',
  email: 'miguel@email.com',
  bio: 'Estudante focado em Medicina. Preparando para ENEM, FUVEST e UNICAMP.',
  dailyGoalMinutes: 40,
  photoUrl: null,
  avatarColor: '#2563EB',
  vestibulares: ['ENEM', 'FUVEST', 'UNICAMP'],
  focusAreas: ['Linguagens', 'Ciências da Natureza', 'Matemática'],
  notifications: {
    lembretes: true,
    novosGabaritos: true,
    resumoSemanal: false,
  },
  frame: 'padrao',
  badge: 'iniciante',
  themeColor: 'azul',
};

const PRESET_AVATAR_COLORS = [
  '#2563EB',
  '#7C3AED',
  '#059669',
  '#DC2626',
  '#EA580C',
  '#DB2777',
  '#0891B2',
  '#4F46E5',
  '#16A34A',
  '#CA8A04',
  '#9333EA',
  '#1A1A1A'
];

const AVAILABLE_VESTIBULARES = [
  'ENEM',
  'FUVEST',
  'UNICAMP',
  'UNESP',
  'UFRJ',
  'UFMG',
  'UFSC',
  'Mackenzie',
  'FGV'
];

const FOCUS_AREAS = [
  {
    id: 'Linguagens',
    name: 'Linguagens',
    desc: 'Português, Literatura, Inglês',
    icon: BookOpen
  },
  {
    id: 'Ciências Humanas',
    name: 'Ciências Humanas',
    desc: 'História, Geografia, Filosofia',
    icon: Compass
  },
  {
    id: 'Ciências da Natureza',
    name: 'Ciências da Natureza',
    desc: 'Química, Física, Biologia',
    icon: Activity
  },
  {
    id: 'Matemática',
    name: 'Matemática',
    desc: 'Álgebra, Geometria, Estatística',
    icon: BarChart3
  },
  {
    id: 'Redação',
    name: 'Redação',
    desc: 'Técnicas e prática',
    icon: FileText
  }
];

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onProfileUpdated?: (updatedData: UserProfileData) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  user,
  onProfileUpdated
}: EditProfileModalProps) {
  const [activeTab, setActiveTab] = React.useState<'perfil' | 'vestibulares' | 'foto' | 'acessorios'>('perfil');
  const [profile, setProfile] = React.useState<UserProfileData>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [toast, setToast] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Load user data on open
  React.useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const localSaved = localStorage.getItem('vesthub_user_profile');
        let initialData = { ...DEFAULT_PROFILE };
        
        if (localSaved) {
          try {
            initialData = { ...initialData, ...JSON.parse(localSaved) };
          } catch (e) {
            console.error('Failed to parse local profile:', e);
          }
        }

        if (user?.displayName) initialData.displayName = user.displayName;
        if (user?.email) initialData.email = user.email;
        if (user?.photoURL) initialData.photoUrl = user.photoURL;

        if (user?.uid) {
          try {
            const userRef = doc(db, 'users', user.uid);
            const snap = await getDoc(userRef);
            if (snap.exists()) {
              const data = snap.data();
              initialData = {
                ...initialData,
                displayName: data.displayName || initialData.displayName,
                email: data.email || initialData.email,
                bio: data.bio !== undefined ? data.bio : initialData.bio,
                dailyGoalMinutes: data.dailyGoalMinutes !== undefined ? data.dailyGoalMinutes : initialData.dailyGoalMinutes,
                photoUrl: data.photoUrl !== undefined ? data.photoUrl : initialData.photoUrl,
                avatarColor: data.avatarColor || initialData.avatarColor,
                vestibulares: data.vestibulares || initialData.vestibulares,
                focusAreas: data.focusAreas || initialData.focusAreas,
                notifications: data.notifications || initialData.notifications,
                frame: data.frame || initialData.frame,
                badge: data.badge || initialData.badge,
                themeColor: data.themeColor || initialData.themeColor,
              };
            }
          } catch (err) {
            console.warn('Could not fetch user profile from Firestore:', err);
          }
        }

        setProfile(initialData);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isOpen, user]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 3500);
  };

  const getInitials = (name: string) => {
    if (!name) return 'MV';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('error', 'Selecione um arquivo de imagem válido.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'A imagem deve ter no máximo 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setProfile((prev) => ({
        ...prev,
        photoUrl: base64
      }));
      showToast('success', 'Foto carregada com sucesso!');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setProfile((prev) => ({
      ...prev,
      photoUrl: null
    }));
    showToast('success', 'Foto removida. Usando avatar padrão.');
  };

  const toggleVestibular = (name: string) => {
    setProfile((prev) => {
      const exists = prev.vestibulares.includes(name);
      return {
        ...prev,
        vestibulares: exists
          ? prev.vestibulares.filter((v) => v !== name)
          : [...prev.vestibulares, name]
      };
    });
  };

  const toggleArea = (areaId: string) => {
    setProfile((prev) => {
      const exists = prev.focusAreas.includes(areaId);
      return {
        ...prev,
        focusAreas: exists
          ? prev.focusAreas.filter((a) => a !== areaId)
          : [...prev.focusAreas, areaId]
      };
    });
  };

  const handleSave = async () => {
    if (!profile.displayName.trim()) {
      showToast('error', 'Digite seu nome.');
      return;
    }

    if (!profile.email.trim() || !profile.email.includes('@')) {
      showToast('error', 'Digite um e-mail válido.');
      return;
    }

    if (profile.vestibulares.length === 0) {
      showToast('error', 'Selecione pelo menos um vestibular.');
      return;
    }

    setIsSaving(true);

    try {
      // Save locally
      localStorage.setItem('vesthub_user_profile', JSON.stringify(profile));

      // Save to Firestore if user is authenticated
      const effectiveUid = auth.currentUser?.uid || user?.uid;
      if (effectiveUid) {
        const userRef = doc(db, 'users', effectiveUid);
        try {
          await setDoc(
            userRef,
            {
              uid: effectiveUid,
              displayName: profile.displayName,
              email: profile.email || auth.currentUser?.email || user?.email || 'user@vesthub.com',
              bio: profile.bio || '',
              dailyGoalMinutes: Number(profile.dailyGoalMinutes) || 40,
              photoUrl: profile.photoUrl || null,
              avatarColor: profile.avatarColor || '#2563EB',
              vestibulares: profile.vestibulares || [],
              focusAreas: profile.focusAreas || [],
              notifications: profile.notifications || {},
              frame: profile.frame || 'padrao',
              badge: profile.badge || 'iniciante',
              themeColor: profile.themeColor || 'azul',
              updatedAt: new Date().toISOString()
            },
            { merge: true }
          );
        } catch (firestoreErr) {
          console.warn('Firestore update note (saved locally):', firestoreErr);
        }
      }

      if (onProfileUpdated) {
        onProfileUpdated(profile);
      }

      showToast('success', 'Perfil atualizado com sucesso!');
      setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 700);
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('error', 'Erro ao salvar. Tente novamente.');
      setIsSaving(false);
    }
  };

  const initials = getInitials(profile.displayName);

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          id="modal-overlay"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="bg-[var(--bg-modal,#ffffff)] dark:bg-[#1F2937] text-[var(--text-main,#0F172A)] dark:text-white rounded-3xl shadow-2xl border border-[var(--border-light,#E2E8F0)] dark:border-[#374151] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="px-6 py-5 border-b border-[var(--border-light,#E2E8F0)] dark:border-[#374151] flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[var(--text-main)] dark:text-white flex items-center gap-2.5">
                  Editar perfil
                </h2>
                <p className="text-xs text-[var(--text-muted)] dark:text-gray-400 mt-0.5">
                  Personalize suas informações de estudante e preferências
                </p>
              </div>
              <button
                id="btn-close-edit-modal"
                onClick={onClose}
                aria-label="Fechar"
                className="w-9 h-9 rounded-full bg-[var(--bg-hover,#F1F5F9)] dark:bg-[#374151] text-[var(--text-muted,#64748B)] dark:text-gray-300 hover:text-[var(--text-main)] dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* MODAL TABS */}
            <div className="flex gap-2 px-6 pt-3 border-b border-[var(--border-light,#E2E8F0)] dark:border-[#374151] overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('perfil')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'perfil'
                    ? 'text-[var(--primary,#2563EB)] border-[var(--primary,#2563EB)]'
                    : 'text-[var(--text-muted,#64748B)] dark:text-gray-400 border-transparent hover:text-[var(--text-main)] dark:hover:text-white'
                }`}
              >
                <User size={16} />
                Perfil
              </button>
              <button
                onClick={() => setActiveTab('vestibulares')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'vestibulares'
                    ? 'text-[var(--primary,#2563EB)] border-[var(--primary,#2563EB)]'
                    : 'text-[var(--text-muted,#64748B)] dark:text-gray-400 border-transparent hover:text-[var(--text-main)] dark:hover:text-white'
                }`}
              >
                <GraduationCap size={16} />
                Vestibulares
              </button>
              <button
                onClick={() => setActiveTab('foto')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'foto'
                    ? 'text-[var(--primary,#2563EB)] border-[var(--primary,#2563EB)]'
                    : 'text-[var(--text-muted,#64748B)] dark:text-gray-400 border-transparent hover:text-[var(--text-main)] dark:hover:text-white'
                }`}
              >
                <Camera size={16} />
                Foto
              </button>
              <button
                onClick={() => setActiveTab('acessorios')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'acessorios'
                    ? 'text-[var(--primary,#2563EB)] border-[var(--primary,#2563EB)]'
                    : 'text-[var(--text-muted,#64748B)] dark:text-gray-400 border-transparent hover:text-[var(--text-main)] dark:hover:text-white'
                }`}
              >
                <Sliders size={16} />
                Acessórios
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* TAB 1: PERFIL */}
              {activeTab === 'perfil' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-5"
                >
                  {/* Photo Avatar Preview */}
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div
                      onClick={() => setActiveTab('foto')}
                      className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-[var(--border-light,#E2E8F0)] dark:border-gray-700 shadow-md cursor-pointer group transition-transform hover:scale-105"
                      style={{
                        backgroundColor: profile.photoUrl ? 'transparent' : profile.avatarColor
                      }}
                    >
                      {profile.photoUrl ? (
                        <img
                          src={profile.photoUrl}
                          alt="Foto de perfil"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-3xl">
                          {initials}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                        <Camera size={26} />
                      </div>
                    </div>
                    <span className="text-[11px] text-[var(--text-label,#94A3B8)]">
                      Clique para trocar ou editar foto
                    </span>
                  </div>

                  {/* Nome Completo */}
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-main)] dark:text-gray-200 uppercase tracking-wider mb-1.5">
                      Nome completo
                    </label>
                    <input
                      id="input-nome"
                      type="text"
                      value={profile.displayName}
                      onChange={(e) =>
                        setProfile({ ...profile, displayName: e.target.value })
                      }
                      placeholder="Digite seu nome"
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color,#CBD5E1)] dark:border-gray-700 bg-[var(--bg-input,#FFFFFF)] dark:bg-[#111827] text-sm text-[var(--text-main)] dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary,#2563EB)]/30 focus:border-[var(--primary,#2563EB)]"
                    />
                  </div>

                  {/* E-mail */}
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-main)] dark:text-gray-200 uppercase tracking-wider mb-1.5">
                      E-mail
                    </label>
                    <input
                      id="input-email"
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                      placeholder="Digite seu e-mail"
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color,#CBD5E1)] dark:border-gray-700 bg-[var(--bg-input,#FFFFFF)] dark:bg-[#111827] text-sm text-[var(--text-main)] dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary,#2563EB)]/30 focus:border-[var(--primary,#2563EB)]"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-main)] dark:text-gray-200 uppercase tracking-wider mb-1.5">
                      Bio
                    </label>
                    <textarea
                      id="input-bio"
                      maxLength={150}
                      rows={3}
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile({ ...profile, bio: e.target.value })
                      }
                      placeholder="Conte um pouco sobre você"
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color,#CBD5E1)] dark:border-gray-700 bg-[var(--bg-input,#FFFFFF)] dark:bg-[#111827] text-sm text-[var(--text-main)] dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary,#2563EB)]/30 focus:border-[var(--primary,#2563EB)] resize-none"
                    />
                    <div className="flex justify-between items-center text-[11px] text-[var(--text-label,#94A3B8)] mt-1">
                      <span>Máximo de 150 caracteres</span>
                      <span>{profile.bio.length}/150</span>
                    </div>
                  </div>

                  {/* Meta diária */}
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-main)] dark:text-gray-200 uppercase tracking-wider mb-1.5">
                      Meta de estudo diário (minutos)
                    </label>
                    <div className="relative">
                      <input
                        id="input-meta"
                        type="number"
                        min={0}
                        max={480}
                        value={profile.dailyGoalMinutes}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            dailyGoalMinutes: Number(e.target.value)
                          })
                        }
                        placeholder="Minutos por dia"
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color,#CBD5E1)] dark:border-gray-700 bg-[var(--bg-input,#FFFFFF)] dark:bg-[#111827] text-sm text-[var(--text-main)] dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary,#2563EB)]/30 focus:border-[var(--primary,#2563EB)] pl-10"
                      />
                      <Clock size={18} className="absolute left-3.5 top-3 text-[var(--text-label,#94A3B8)]" />
                    </div>
                    <p className="text-[11px] text-[var(--text-label,#94A3B8)] mt-1">
                      Quantos minutos por dia você quer estudar? (Ex: 40 min = ~4 sessões curtas)
                    </p>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: VESTIBULARES */}
              {activeTab === 'vestibulares' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Vestibulares de interesse */}
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-main)] dark:text-white mb-1">
                      Quais vestibulares você está preparando?
                    </label>
                    <p className="text-xs text-[var(--text-muted,#64748B)] dark:text-gray-400 mb-3">
                      Selecione um ou mais exames. Personalizaremos seu cronograma e recomendações.
                    </p>
                    <div className="flex flex-wrap gap-2" id="vestibulares-grid">
                      {AVAILABLE_VESTIBULARES.map((vest) => {
                        const isSelected = profile.vestibulares.includes(vest);
                        return (
                          <button
                            key={vest}
                            type="button"
                            onClick={() => toggleVestibular(vest)}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-[var(--primary,#2563EB)] text-white border-[var(--primary,#2563EB)] shadow-md shadow-[var(--shadow-primary)]'
                                : 'bg-[var(--bg-hover,#F1F5F9)] dark:bg-[#111827] text-[var(--text-muted,#64748B)] dark:text-gray-300 border-[var(--border-light,#E2E8F0)] dark:border-gray-700 hover:border-gray-400'
                            }`}
                          >
                            {isSelected && <Check size={14} className="stroke-[3]" />}
                            {vest}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Áreas de foco */}
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-main)] dark:text-white mb-1">
                      Áreas de foco
                    </label>
                    <p className="text-xs text-[var(--text-muted,#64748B)] dark:text-gray-400 mb-3">
                      Quais áreas você quer priorizar nos estudos diários?
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {FOCUS_AREAS.map((area) => {
                        const isSelected = profile.focusAreas.includes(area.id);
                        const Icon = area.icon;
                        return (
                          <div
                            key={area.id}
                            onClick={() => toggleArea(area.id)}
                            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3.5 ${
                              isSelected
                                ? 'border-[var(--primary,#2563EB)] bg-blue-50/60 dark:bg-blue-950/20 shadow-sm'
                                : 'border-[var(--border-light,#E2E8F0)] dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-transparent'
                            }`}
                          >
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? 'bg-[var(--primary,#2563EB)] text-white'
                                  : 'bg-[var(--bg-hover,#F1F5F9)] dark:bg-gray-800 text-[var(--primary,#2563EB)]'
                              }`}
                            >
                              <Icon size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-[var(--text-main)] dark:text-white">
                                {area.name}
                              </p>
                              <p className="text-xs text-[var(--text-muted,#64748B)] dark:text-gray-400 truncate">
                                {area.desc}
                              </p>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                isSelected
                                  ? 'bg-[var(--primary,#2563EB)] border-[var(--primary,#2563EB)] text-white'
                                  : 'border-gray-300 dark:border-gray-600'
                              }`}
                            >
                              {isSelected && <Check size={12} className="stroke-[3]" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Notificações */}
                  <div className="pt-2 border-t border-[var(--border-light,#E2E8F0)] dark:border-gray-700 space-y-3">
                    <label className="block text-sm font-bold text-[var(--text-main)] dark:text-white">
                      Notificações e Lembretes
                    </label>

                    {/* Toggle 1 */}
                    <div className="flex items-center justify-between py-2 border-b border-[var(--border-light,#E2E8F0)] dark:border-gray-800">
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-main)] dark:text-white">
                          Lembretes de estudo
                        </p>
                        <p className="text-xs text-[var(--text-muted,#64748B)] dark:text-gray-400">
                          Receba avisos diários no horário definido
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setProfile({
                            ...profile,
                            notifications: {
                              ...profile.notifications,
                              lembretes: !profile.notifications.lembretes
                            }
                          })
                        }
                        className={`w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                          profile.notifications.lembretes
                            ? 'bg-[var(--primary,#2563EB)]'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <div
                          className={`w-5.5 h-5.5 rounded-full bg-white shadow-sm transform transition-transform ${
                            profile.notifications.lembretes
                              ? 'translate-x-5.5'
                              : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Toggle 2 */}
                    <div className="flex items-center justify-between py-2 border-b border-[var(--border-light,#E2E8F0)] dark:border-gray-800">
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-main)] dark:text-white">
                          Novos gabaritos
                        </p>
                        <p className="text-xs text-[var(--text-muted,#64748B)] dark:text-gray-400">
                          Avisar quando novos gabaritos oficiais forem publicados
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setProfile({
                            ...profile,
                            notifications: {
                              ...profile.notifications,
                              novosGabaritos: !profile.notifications.novosGabaritos
                            }
                          })
                        }
                        className={`w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                          profile.notifications.novosGabaritos
                            ? 'bg-[var(--primary,#2563EB)]'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <div
                          className={`w-5.5 h-5.5 rounded-full bg-white shadow-sm transform transition-transform ${
                            profile.notifications.novosGabaritos
                              ? 'translate-x-5.5'
                              : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Toggle 3 */}
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-main)] dark:text-white">
                          Resumo semanal
                        </p>
                        <p className="text-xs text-[var(--text-muted,#64748B)] dark:text-gray-400">
                          Relatório de desempenho e estatísticas todo domingo
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setProfile({
                            ...profile,
                            notifications: {
                              ...profile.notifications,
                              resumoSemanal: !profile.notifications.resumoSemanal
                            }
                          })
                        }
                        className={`w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                          profile.notifications.resumoSemanal
                            ? 'bg-[var(--primary,#2563EB)]'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <div
                          className={`w-5.5 h-5.5 rounded-full bg-white shadow-sm transform transition-transform ${
                            profile.notifications.resumoSemanal
                              ? 'translate-x-5.5'
                              : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: FOTO */}
              {activeTab === 'foto' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col items-center justify-center gap-4 py-2">
                    <div
                      className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--border-light,#E2E8F0)] dark:border-gray-700 shadow-lg cursor-pointer group"
                      style={{
                        backgroundColor: profile.photoUrl ? 'transparent' : profile.avatarColor
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {profile.photoUrl ? (
                        <img
                          src={profile.photoUrl}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-4xl">
                          {initials}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                        <Upload size={28} />
                      </div>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl bg-[var(--primary,#2563EB)] hover:bg-[var(--primary-hover,#1D4ED8)] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-md shadow-[var(--shadow-primary)]"
                      >
                        <Upload size={16} />
                        Enviar foto
                      </button>
                      {profile.photoUrl && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                          Remover
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[var(--text-main)] dark:text-white mb-2">
                      Ou escolha um avatar predefinido
                    </label>
                    <p className="text-xs text-[var(--text-muted,#64748B)] dark:text-gray-400 mb-3">
                      Selecione a cor de fundo do seu avatar com as iniciais
                    </p>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                      {PRESET_AVATAR_COLORS.map((color) => {
                        const isSelected = !profile.photoUrl && profile.avatarColor === color;
                        return (
                          <button
                            key={color}
                            type="button"
                            onClick={() => {
                              setProfile((prev) => ({
                                ...prev,
                                photoUrl: null,
                                avatarColor: color
                              }));
                            }}
                            className={`aspect-square rounded-full flex items-center justify-center font-bold text-white text-sm transition-transform hover:scale-105 cursor-pointer ${
                              isSelected
                                ? 'ring-4 ring-offset-2 ring-[var(--primary,#2563EB)] scale-105'
                                : 'border-2 border-white/40'
                            }`}
                            style={{ backgroundColor: color }}
                          >
                            {initials}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 4: ACESSÓRIOS */}
              {activeTab === 'acessorios' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Molduras */}
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-main)] dark:text-white flex items-center gap-2 mb-3">
                      <Sparkles size={18} className="text-[var(--primary,#2563EB)]" />
                      Molduras de avatar
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {/* Padrão */}
                      <div
                        onClick={() => {
                          setProfile({ ...profile, frame: 'padrao' });
                          showToast('success', 'Moldura Padrão equipada!');
                        }}
                        className={`p-4 rounded-2xl border-2 text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${
                          profile.frame === 'padrao'
                            ? 'border-[var(--primary,#2563EB)] bg-blue-50/60 dark:bg-blue-950/20 shadow-sm'
                            : 'border-[var(--border-light,#E2E8F0)] dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950/40 text-[var(--primary,#2563EB)] flex items-center justify-center">
                          <Circle size={24} />
                        </div>
                        <span className="text-xs font-bold">Padrão</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                          {profile.frame === 'padrao' ? 'Equipado' : 'Disponível'}
                        </span>
                      </div>

                      {/* Estrela */}
                      <div
                        onClick={() => {
                          setProfile({ ...profile, frame: 'estrela' });
                          showToast('success', 'Moldura Estrela equipada!');
                        }}
                        className={`p-4 rounded-2xl border-2 text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${
                          profile.frame === 'estrela'
                            ? 'border-[var(--primary,#2563EB)] bg-blue-50/60 dark:bg-blue-950/20 shadow-sm'
                            : 'border-[var(--border-light,#E2E8F0)] dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                          <Star size={24} />
                        </div>
                        <span className="text-xs font-bold">Estrela</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                          {profile.frame === 'estrela' ? 'Equipado' : 'Disponível'}
                        </span>
                      </div>

                      {/* Diamante */}
                      <div
                        onClick={() => {
                          setProfile({ ...profile, frame: 'diamante' });
                          showToast('success', 'Moldura Diamante equipada!');
                        }}
                        className={`p-4 rounded-2xl border-2 text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${
                          profile.frame === 'diamante'
                            ? 'border-[var(--primary,#2563EB)] bg-blue-50/60 dark:bg-blue-950/20 shadow-sm'
                            : 'border-[var(--border-light,#E2E8F0)] dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                          <Sparkles size={24} />
                        </div>
                        <span className="text-xs font-bold">Diamante</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
                          {profile.frame === 'diamante' ? 'Equipado' : '500 pts'}
                        </span>
                      </div>

                      {/* Raio */}
                      <div
                        onClick={() => {
                          showToast('error', 'Este acessório ainda está bloqueado. Estude mais para desbloquear!');
                        }}
                        className="p-4 rounded-2xl border-2 border-[var(--border-light,#E2E8F0)] dark:border-gray-700 opacity-60 hover:opacity-100 text-center cursor-pointer transition-all flex flex-col items-center gap-2 bg-gray-50/50 dark:bg-gray-800/30"
                      >
                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center">
                          <Zap size={24} />
                        </div>
                        <span className="text-xs font-bold">Raio</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <Lock size={10} /> Bloqueado
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Insígnias */}
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-main)] dark:text-white flex items-center gap-2 mb-3">
                      <Award size={18} className="text-[var(--primary,#2563EB)]" />
                      Insígnias
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {/* Iniciante */}
                      <div
                        onClick={() => {
                          setProfile({ ...profile, badge: 'iniciante' });
                          showToast('success', 'Insígnia Iniciante equipada!');
                        }}
                        className={`p-4 rounded-2xl border-2 text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${
                          profile.badge === 'iniciante'
                            ? 'border-[var(--primary,#2563EB)] bg-blue-50/60 dark:bg-blue-950/20 shadow-sm'
                            : 'border-[var(--border-light,#E2E8F0)] dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                          <CheckCircle2 size={24} />
                        </div>
                        <span className="text-xs font-bold">Iniciante</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                          {profile.badge === 'iniciante' ? 'Equipado' : 'Disponível'}
                        </span>
                      </div>

                      {/* Dedicado */}
                      <div
                        onClick={() => {
                          setProfile({ ...profile, badge: 'dedicado' });
                          showToast('success', 'Insígnia Dedicado equipada!');
                        }}
                        className={`p-4 rounded-2xl border-2 text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${
                          profile.badge === 'dedicado'
                            ? 'border-[var(--primary,#2563EB)] bg-blue-50/60 dark:bg-blue-950/20 shadow-sm'
                            : 'border-[var(--border-light,#E2E8F0)] dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                          <Flame size={24} />
                        </div>
                        <span className="text-xs font-bold">Dedicado</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                          {profile.badge === 'dedicado' ? 'Equipado' : 'Disponível'}
                        </span>
                      </div>

                      {/* Top 100 */}
                      <div
                        onClick={() => {
                          setProfile({ ...profile, badge: 'top100' });
                          showToast('success', 'Insígnia Top 100 equipada!');
                        }}
                        className={`p-4 rounded-2xl border-2 text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${
                          profile.badge === 'top100'
                            ? 'border-[var(--primary,#2563EB)] bg-blue-50/60 dark:bg-blue-950/20 shadow-sm'
                            : 'border-[var(--border-light,#E2E8F0)] dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                          <Award size={24} />
                        </div>
                        <span className="text-xs font-bold">Top 100</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300">
                          {profile.badge === 'top100' ? 'Equipado' : '1000 pts'}
                        </span>
                      </div>

                      {/* Campeão */}
                      <div
                        onClick={() => {
                          showToast('error', 'Este acessório ainda está bloqueado. Estude mais para desbloquear!');
                        }}
                        className="p-4 rounded-2xl border-2 border-[var(--border-light,#E2E8F0)] dark:border-gray-700 opacity-60 hover:opacity-100 text-center cursor-pointer transition-all flex flex-col items-center gap-2 bg-gray-50/50 dark:bg-gray-800/30"
                      >
                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center">
                          <Crown size={24} />
                        </div>
                        <span className="text-xs font-bold">Campeão</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <Lock size={10} /> Bloqueado
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Temas do App */}
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-main)] dark:text-white flex items-center gap-2 mb-3">
                      <Circle size={18} className="text-[var(--primary,#2563EB)]" />
                      Temas do app
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {/* Azul */}
                      <div
                        onClick={() => {
                          setProfile({ ...profile, themeColor: 'azul' });
                          showToast('success', 'Tema Azul Padrão equipado!');
                        }}
                        className={`p-4 rounded-2xl border-2 text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${
                          profile.themeColor === 'azul'
                            ? 'border-[var(--primary,#2563EB)] bg-blue-50/60 dark:bg-blue-950/20 shadow-sm'
                            : 'border-[var(--border-light,#E2E8F0)] dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-blue-600" />
                        </div>
                        <span className="text-xs font-bold">Azul Padrão</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                          {profile.themeColor === 'azul' ? 'Equipado' : 'Disponível'}
                        </span>
                      </div>

                      {/* Roxo */}
                      <div
                        onClick={() => {
                          setProfile({ ...profile, themeColor: 'roxo' });
                          showToast('success', 'Tema Roxo equipado!');
                        }}
                        className={`p-4 rounded-2xl border-2 text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${
                          profile.themeColor === 'roxo'
                            ? 'border-purple-600 bg-purple-50/60 dark:bg-purple-950/20 shadow-sm'
                            : 'border-[var(--border-light,#E2E8F0)] dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-purple-600" />
                        </div>
                        <span className="text-xs font-bold">Roxo</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                          {profile.themeColor === 'roxo' ? 'Equipado' : 'Disponível'}
                        </span>
                      </div>

                      {/* Esmeralda */}
                      <div
                        onClick={() => {
                          setProfile({ ...profile, themeColor: 'esmeralda' });
                          showToast('success', 'Tema Esmeralda equipado!');
                        }}
                        className={`p-4 rounded-2xl border-2 text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${
                          profile.themeColor === 'esmeralda'
                            ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/20 shadow-sm'
                            : 'border-[var(--border-light,#E2E8F0)] dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-emerald-600" />
                        </div>
                        <span className="text-xs font-bold">Esmeralda</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                          {profile.themeColor === 'esmeralda' ? 'Equipado' : '300 pts'}
                        </span>
                      </div>

                      {/* Rosa */}
                      <div
                        onClick={() => {
                          showToast('error', 'Este acessório ainda está bloqueado. Estude mais para desbloquear!');
                        }}
                        className="p-4 rounded-2xl border-2 border-[var(--border-light,#E2E8F0)] dark:border-gray-700 opacity-60 hover:opacity-100 text-center cursor-pointer transition-all flex flex-col items-center gap-2 bg-gray-50/50 dark:bg-gray-800/30"
                      >
                        <div className="w-12 h-12 rounded-full bg-pink-500/20 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-pink-600" />
                        </div>
                        <span className="text-xs font-bold">Rosa</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <Lock size={10} /> Bloqueado
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="px-6 py-4 border-t border-[var(--border-light,#E2E8F0)] dark:border-[#374151] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[var(--bg-sidebar,#F8FAFC)] dark:bg-[#111827]">
              <div className="flex items-center gap-2 text-xs text-[var(--text-label,#94A3B8)] dark:text-gray-400">
                <Clock size={14} />
                <span>Última atualização: hoje</span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-[var(--border-light,#E2E8F0)] dark:border-gray-700 text-sm font-semibold text-[var(--text-main)] dark:text-white hover:bg-[var(--bg-hover,#F1F5F9)] dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  id="btn-salvar"
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[var(--primary,#2563EB)] hover:bg-[var(--primary-hover,#1D4ED8)] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-[var(--shadow-primary)] cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <span>Salvar alterações</span>
                      <Check size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* TOAST FEEDBACK */}
          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className={`fixed bottom-6 right-6 z-[2000] px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm font-semibold text-white ${
                  toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
              >
                {toast.type === 'success' ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}
                <span>{toast.message}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
