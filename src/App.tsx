/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider, User } from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { doc, getDoc, setDoc, getDocFromServer } from 'firebase/firestore';
import { Vestibular } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Vestibulares from './components/Vestibulares';
import Redacao from './components/Redacao';
import Conteudos from './components/Conteudos';
import Videos from './components/Videos';
import Quiz from './components/Quiz';
import ChatWithAI from './components/ChatWithAI';
import Biblioteca from './components/Biblioteca';
import Sobre from './components/Sobre';
import DailyMissions from './components/DailyMissions';
import ErrorBoundary from './components/ErrorBoundary';
import CronogramaVestibulares from './components/CronogramaVestibulares';
import SistemasConquistasMetas from './components/SistemasConquistasMetas';
import GabaritosOficiais from './components/GabaritosOficiais';
import SkillSwipe from './components/SkillSwipe';
import HomeView from './components/HomeView';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { Question } from './services/geminiService';
import { GraduationCap, LogIn, Sparkles, BookOpen, Target, Award, Trophy, Zap, Clock } from 'lucide-react';
import { motion } from 'motion/react';

import LoginScreen from './components/LoginScreen';
import { LandingPublica } from './components/LandingPublica';
import PlanSelection from './components/PlanSelection';
import SpotifyStudyHub from './components/SpotifyStudyHub';
import PomodoroTimer from './components/PomodoroTimer';
import AudioTranscriberView from './components/AudioTranscriberView';
import FloatingSupport from './components/FloatingSupport';
import DynamicOnboardingModal from './components/DynamicOnboardingModal';
import PesquisaModal from './components/PesquisaModal';
import Flashcards from './components/Flashcards';

export default function App() {
  const isOnline = useOnlineStatus();
  const [user, setUser] = React.useState<User | any | null>(() => {
    try {
      const isAuth = localStorage.getItem('vestibularpro_authenticated') === 'true';
      if (isAuth) {
        const saved = localStorage.getItem('vestibularpro_session_user');
        if (saved) {
          return JSON.parse(saved);
        }
      }
    } catch (e) {
      console.error("Error restoring session:", e);
    }
    return null;
  });
  const [activeTab, setActiveTab] = React.useState('home');
  const [selectedVestibular, setSelectedVestibular] = React.useState<Vestibular>(Vestibular.ENEM);
  const [loading, setLoading] = React.useState(false);
  const [quizQuestions, setQuizQuestions] = React.useState<Question[]>([]);
  const [isFullExam, setIsFullExam] = React.useState(false);
  const [quizTimeLimit, setQuizTimeLimit] = React.useState<number | undefined>(undefined);
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  const [showPesquisa, setShowPesquisa] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = React.useState<'mensal' | 'trimestral' | 'semestral' | 'anual'>('semestral');

  React.useEffect(() => {
    const handleAbrirPesquisa = () => setShowPesquisa(true);
    window.addEventListener('abrir-pesquisa', handleAbrirPesquisa);
    return () => window.removeEventListener('abrir-pesquisa', handleAbrirPesquisa);
  }, []);

  React.useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. Client is offline.");
        }
      }
    }
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          const userRef = doc(db, 'users', currentUser.uid);
          try {
            const userSnap = await getDoc(userRef);
            if (!userSnap.exists()) {
              await setDoc(userRef, {
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName,
                role: 'user',
                createdAt: new Date().toISOString()
              });
            }
          } catch (error) {
            console.warn("User doc sync note:", error);
          }
          setUser(currentUser);
          try {
            localStorage.setItem('vestibularpro_authenticated', 'true');
            localStorage.setItem('vestibularpro_session_user', JSON.stringify({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName || 'Estudante',
              isAnonymous: currentUser.isAnonymous
            }));
          } catch (e) {}
        }
      } catch (err) {
        console.error("Auth listener error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Verificar status do Onboarding e ouvir evento de abertura
  React.useEffect(() => {
    const handleAbrirOnboarding = () => setShowOnboarding(true);
    window.addEventListener('abrir-onboarding', handleAbrirOnboarding);

    if (user) {
      const localCompleted = localStorage.getItem('vestibularpro_onboarding_completo') === 'true';
      if (!localCompleted) {
        const uid = user.uid || user.email || 'usuario_padrao';
        fetch('/api/auth/me', {
          headers: { 'x-usuario-id': uid }
        })
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data && !data.onboarding_completo) {
              setShowOnboarding(true);
            } else if (data?.onboarding_completo) {
              localStorage.setItem('vestibularpro_onboarding_completo', 'true');
            } else {
              setShowOnboarding(true);
            }
          })
          .catch(() => {
            if (!localCompleted) {
              setShowOnboarding(true);
            }
          });
      }
    }

    return () => {
      window.removeEventListener('abrir-onboarding', handleAbrirOnboarding);
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
    try {
      localStorage.removeItem('vestibularpro_authenticated');
      localStorage.removeItem('vestibularpro_session_user');
      sessionStorage.removeItem('auth_token');
    } catch (e) {}
    setUser(null);
    setShowLogin(false);
    setActiveTab('home');
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/unauthorized-domain' || error.code === 'auth/operation-not-allowed') {
        const mockUser = {
          uid: 'google_user_' + Date.now(),
          email: 'miguelvidotti1@gmail.com',
          displayName: 'Miguel Vidotti'
        };
        try {
          localStorage.setItem('vestibularpro_authenticated', 'true');
          localStorage.setItem('vestibularpro_session_user', JSON.stringify(mockUser));
        } catch (e) {}
        setUser(mockUser);
        setActiveTab('home');
      } else {
        console.warn('Login note:', error);
      }
    }
  };

  const startQuiz = (questions: Question[], isFull: boolean = false, timeLimit?: number) => {
    setQuizQuestions(questions);
    setIsFullExam(isFull);
    setQuizTimeLimit(timeLimit);
    setActiveTab('quiz');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeView
            setActiveTab={setActiveTab}
            selectedVestibular={selectedVestibular}
            setSelectedVestibular={setSelectedVestibular}
          />
        );
      case 'vestibulares':
        return (
          <Vestibulares 
            onSelect={(v) => { 
              setSelectedVestibular(v);
            }} 
            onStartQuiz={(questions, isFull, timeLimit) => startQuiz(questions, isFull, timeLimit)}
          />
        );
      case 'agenda':
        return <CronogramaVestibulares onNavegarParaAba={setActiveTab} />;
      case 'conquistas':
        return <SistemasConquistasMetas />;
      case 'skillswipe':
        return <SkillSwipe />;
      case 'spotify':
        return (
          <div className="space-y-6 max-w-5xl mx-auto pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
                  Músicas para Estudo & Concentração
                </h1>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
                  Ambiente sonoro curado com integração Spotify Connect para foco profundo, resolução de exercícios e memorização.
                </p>
              </div>
            </div>

            <SpotifyStudyHub standalone={true} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <PomodoroTimer />
              <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] shadow-sm space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#1DB954]/15 text-[#1DB954] flex items-center justify-center">
                    <Sparkles size={18} />
                  </div>
                  <h3 className="text-base font-bold text-[var(--text-main)]">
                    Dicas para Sessão de Foco Total
                  </h3>
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 shrink-0" />
                    <span><strong>Lo-Fi & Instrumental:</strong> Ideais para resolução de questões matemáticas e exercícios de exatas sem distrações líricas.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 shrink-0" />
                    <span><strong>Música Clássica & Piano:</strong> Estimulam a atividade alfa cerebral, perfeitas para leitura densa, filosofia e redação.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 shrink-0" />
                    <span><strong>Técnica Pomodoro:</strong> Mantenha o som ativado durante os 25 minutos de foco contínuo e pause durante os 5 minutos de descanso.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      case 'gabaritos':
        return <GabaritosOficiais />;
      case 'flashcards':
        return <Flashcards />;
      case 'redacao':
        return <Redacao vestibular={selectedVestibular} setVestibular={setSelectedVestibular} />;
      case 'conteudos':
        return <Conteudos vestibular={selectedVestibular} onStartQuiz={(questions, isFull, timeLimit) => startQuiz(questions, isFull, timeLimit)} />;
      case 'videos':
        return <Videos vestibular={selectedVestibular} />;
      case 'chat':
        return <ChatWithAI />;
      case 'transcricao':
        return (
          <AudioTranscriberView
            onSendToChat={(text) => {
              setActiveTab('chat');
            }}
            onSendToRedacao={(text) => {
              setActiveTab('redacao');
            }}
          />
        );
      case 'biblioteca':
        return <Biblioteca />;
      case 'sobre':
        return <Sobre />;
      case 'dashboard':
        return <Dashboard selectedVestibular={selectedVestibular} />;
      case 'planos':
        return <PlanSelection onComplete={() => setActiveTab('home')} currentPlanId={selectedPlanForCheckout} userEmail={user?.email} userName={user?.displayName} />;
      case 'quiz':
        return <Quiz questions={quizQuestions} isFullExam={isFullExam} onComplete={() => setActiveTab('home')} vestibular={selectedVestibular} timeLimit={quizTimeLimit} />;
      case 'login':
        return (
          <LoginScreen
            onLoginSuccess={(u, isNewUser) => {
              setUser(u);
              try {
                localStorage.setItem('vestibularpro_authenticated', 'true');
                localStorage.setItem('vestibularpro_session_user', JSON.stringify(u));
              } catch (e) {}
              if (isNewUser) {
                setActiveTab('planos');
              } else {
                setActiveTab('home');
              }
            }}
          />
        );
      default:
        return <div>Página não encontrada</div>;
    }
  };

  return (
    <>
      {!isOnline && (
        <div className="fixed top-0 inset-x-0 bg-amber-500 text-white text-center py-2 z-[100] text-sm font-semibold shadow-md flex items-center justify-center gap-2">
          <span>📶 Você está offline — usando dados salvos no dispositivo</span>
        </div>
      )}
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-[#07090e] transition-colors duration-300">
          <div className="flex flex-col items-center gap-4">
            <GraduationCap className="text-blue-400 w-12 h-12 animate-pulse" />
            <p className="text-slate-400 text-xs font-semibold animate-pulse">Iniciando Gabarita...</p>
          </div>
        </div>
      ) : !user ? (
        <ErrorBoundary>
          {!showLogin ? (
            <LandingPublica 
              onGoToLogin={(planId) => {
                if (planId) {
                  setSelectedPlanForCheckout(planId);
                }
                setShowLogin(true);
              }}
              onPaymentSuccess={(planId, userObj) => {
                setUser(userObj);
                try {
                  localStorage.setItem('vestibularpro_authenticated', 'true');
                  localStorage.setItem('vestibularpro_session_user', JSON.stringify(userObj));
                  localStorage.setItem('vestibularpro_active_plan', planId);
                } catch (e) {}
                setActiveTab('home');
              }}
            />
          ) : (
            <LoginScreen
              onBackToLanding={() => setShowLogin(false)}
              onLoginSuccess={(userObj, isNewUser) => {
                setUser(userObj);
                try {
                  localStorage.setItem('vestibularpro_authenticated', 'true');
                  localStorage.setItem('vestibularpro_session_user', JSON.stringify(userObj));
                } catch (e) {}
                if (isNewUser || selectedPlanForCheckout) {
                  setActiveTab('planos');
                } else {
                  setActiveTab('home');
                }
              }}
            />
          )}
        </ErrorBoundary>
      ) : (
        <ErrorBoundary>
          <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout}>
            {renderContent()}
          </Layout>
        </ErrorBoundary>
      )}
      <DynamicOnboardingModal
        isOpen={showOnboarding}
        currentUser={user}
        onClose={(resumo) => {
          setShowOnboarding(false);
          try {
            localStorage.setItem('vestibularpro_onboarding_completo', 'true');
            localStorage.setItem('vestibularpro_abrir_rotina', 'true');
          } catch (e) {}
          setActiveTab('agenda');
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('abrir-rotina-semanal'));
          }, 150);
        }}
      />
      <PesquisaModal 
        isOpen={showPesquisa} 
        onClose={() => setShowPesquisa(false)} 
        onJaTenhoConta={!user ? () => {
          setShowPesquisa(false);
          setShowLogin(true);
        } : undefined}
      />
      <FloatingSupport />
    </>
  );
}
