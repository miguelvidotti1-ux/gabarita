/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
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
import DesafioSemanalComponent from './components/DesafioSemanal';
import CronogramaVestibulares from './components/CronogramaVestibulares';
import SistemasConquistasMetas from './components/SistemasConquistasMetas';
import GabaritosOficiais from './components/GabaritosOficiais';
import { Question } from './services/geminiService';
import { GraduationCap, LogIn, Sparkles, BookOpen, Target, Award, Trophy, Zap, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [user, setUser] = React.useState<User | null>(null);
  const [activeTab, setActiveTab] = React.useState('home');
  const [selectedVestibular, setSelectedVestibular] = React.useState<Vestibular>(Vestibular.ENEM);
  const [loading, setLoading] = React.useState(true);
  const [quizQuestions, setQuizQuestions] = React.useState<Question[]>([]);
  const [isFullExam, setIsFullExam] = React.useState(false);
  const [quizTimeLimit, setQuizTimeLimit] = React.useState<number | undefined>(undefined);

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
          handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
        }
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login error:', error);
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
          <div className="space-y-16 py-10">
            {/* Hero Section */}
            <div className="text-center space-y-6 max-w-4xl mx-auto px-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-[var(--bg-secondary)] text-[var(--text-accent)] px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider border border-[var(--card-border)] shadow-sm"
              >
                <Sparkles size={14} className="animate-pulse" />
                <span>Preparação Completa 2026 • Premium</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-[var(--text-primary)] leading-tight tracking-tight font-sans"
              >
                Sua Aprovação Começa <span className="bg-gradient-to-r from-[var(--text-accent)] to-[#8b5cf6] bg-clip-text text-transparent">Hoje</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed"
              >
                A plataforma definitiva para os principais vestibulares do Brasil. Provas integradas, simulados customizados, correção de redação e auxílio IA de alta performance.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row justify-center gap-4 pt-6"
              >
                <button 
                  onClick={() => setActiveTab('vestibulares')}
                  className="bg-[var(--button-bg)] text-white px-8 py-4 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-[var(--button-bg-hover)] hover:-translate-y-0.5 transition-all shadow-lg shadow-[var(--button-bg)]/20 cursor-pointer active:scale-95"
                >
                  Começar Agora
                </button>
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className="bg-[var(--card-bg)] text-[var(--text-primary)] border border-[var(--card-border)] px-8 py-4 px-10 py-5 rounded-2xl font-semibold text-lg hover:bg-[var(--bg-secondary)] hover:-translate-y-0.5 transition-all shadow-sm cursor-pointer active:scale-95"
                >
                  Ver Painel de Estudos
                </button>
              </motion.div>
            </div>

            {/* Highlighting Key Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
              {[
                { 
                  title: '+ de 200 Provas', 
                  desc: 'O acervo completo dos últimos 16 anos dos principais vestibulares com gabarito.', 
                  icon: GraduationCap, 
                  gradient: 'from-blue-500/10 to-indigo-500/10 border-blue-500/10 text-blue-600 dark:text-blue-450' 
                },
                { 
                  title: 'IA de Redação', 
                  desc: 'Gerador de temas e correção automática baseada em competências.', 
                  icon: Sparkles, 
                  gradient: 'from-purple-500/10 to-pink-500/10 border-purple-500/10 text-purple-600 dark:text-purple-450' 
                },
                { 
                  title: 'Conteúdo Focado', 
                  desc: 'Análise estatística do que mais cai em cada disciplina.', 
                  icon: Target, 
                  gradient: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                },
              ].map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 * i }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className="bg-[var(--card-bg)] p-8 rounded-[2rem] border border-[var(--card-border)] shadow-sm hover:shadow-xl hover:border-[var(--text-accent)]/15 transition-all group"
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${feature.gradient} border group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={26} />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--text-accent)] transition-colors">{feature.title}</h3>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{feature.desc}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Daily Missions */}
            <div className="max-w-4xl mx-auto w-full px-4 pt-4">
              <DailyMissions />
            </div>
          </div>
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
      case 'desafio':
        return <DesafioSemanalComponent vestibular={selectedVestibular} onStartQuiz={(questions, isFull, timeLimit) => startQuiz(questions, isFull, timeLimit)} />;
      case 'agenda':
        return <CronogramaVestibulares />;
      case 'conquistas':
        return <SistemasConquistasMetas />;
      case 'gabaritos':
        return <GabaritosOficiais />;
      case 'redacao':
        return <Redacao vestibular={selectedVestibular} setVestibular={setSelectedVestibular} />;
      case 'conteudos':
        return <Conteudos vestibular={selectedVestibular} onStartQuiz={(questions, isFull, timeLimit) => startQuiz(questions, isFull, timeLimit)} />;
      case 'videos':
        return <Videos vestibular={selectedVestibular} />;
      case 'chat':
        return <ChatWithAI />;
      case 'biblioteca':
        return <Biblioteca />;
      case 'sobre':
        return <Sobre />;
      case 'dashboard':
        return <Dashboard selectedVestibular={selectedVestibular} />;
      case 'quiz':
        return <Quiz questions={quizQuestions} isFullExam={isFullExam} onComplete={() => setActiveTab('home')} vestibular={selectedVestibular} timeLimit={quizTimeLimit} />;
      case 'login':
        return (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="bg-[var(--card-bg)] p-12 rounded-3xl border border-[var(--card-border)] shadow-xl max-w-md w-full text-center space-y-8">
              <div className="bg-[var(--bg-secondary)] w-20 h-20 rounded-2xl flex items-center justify-center text-[var(--text-accent)] mx-auto">
                <GraduationCap size={48} />
              </div>
              <div>
                <h2 className="text-3xl font-black">Bem-vindo de volta!</h2>
                <p className="text-[var(--text-secondary)]">Entre para salvar seu progresso e acessar simulados personalizados.</p>
              </div>
              <button 
                onClick={handleLogin}
                className="w-full flex items-center justify-center gap-3 bg-[var(--button-bg)] text-white py-4 rounded-2xl font-bold hover:bg-[var(--button-bg-hover)] transition-all text-lg shadow-lg"
              >
                <LogIn size={20} />
                <span>Entrar com Google</span>
              </button>
              <p className="text-xs text-[var(--text-secondary)] opacity-70">Ao entrar, você concorda com nossos termos de uso e política de privacidade.</p>
            </div>
          </div>
        );
      default:
        return <div>Página não encontrada</div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <GraduationCap className="text-[var(--text-accent)] w-16 h-16 animate-bounce" />
          <p className="text-[var(--text-primary)] font-bold animate-pulse">Carregando Vestibular Pro...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-blue-500/30 overflow-hidden relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              rotate: [0, 90, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-blue-600/20 blur-[120px] rounded-full"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2],
              rotate: [0, -45, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[10%] -right-[5%] w-[60%] h-[60%] bg-indigo-600/20 blur-[100px] rounded-full"
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 bg-white/5 backdrop-blur-3xl p-8 md:p-14 rounded-[3rem] border border-white/10 shadow-[0_0_80px_rgba(37,99,235,0.1)] max-w-lg w-full text-center space-y-10"
        >
          <div className="space-y-6">
            <motion.div 
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 3 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
              className="bg-gradient-to-br from-blue-600 to-indigo-700 w-24 h-24 rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-blue-600/30 ring-8 ring-white/5"
            >
              <GraduationCap size={56} />
            </motion.div>
            
            <div className="space-y-3">
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-5xl font-black text-white tracking-tighter"
              >
                Vestibular <span className="text-blue-500">Pro</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-slate-400 font-medium text-lg max-w-sm mx-auto leading-relaxed"
              >
                A plataforma definitiva para sua aprovação nos maiores vestibulares do país.
              </motion.p>
            </div>
          </div>

          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.6 }}
             className="space-y-4"
          >
            <button 
              onClick={handleLogin}
              className="group relative w-full overflow-hidden flex items-center justify-center gap-4 bg-white text-slate-950 py-6 rounded-3xl font-black hover:bg-blue-50 transition-all text-xl shadow-2xl active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <LogIn size={26} className="relative z-10 text-blue-600" />
              <span className="relative z-10">Entrar com Google</span>
            </button>
            <p className="text-slate-500 text-sm font-bold flex items-center justify-center gap-2">
              <Sparkles size={16} className="text-blue-500" />
              Acesso Gratuito para Estudantes
            </p>
          </motion.div>

          <div className="grid grid-cols-3 gap-6 pt-4">
            {[
              { icon: BookOpen, label: "Conteúdo" },
              { icon: Target, label: "Simulados" },
              { icon: Award, label: "IA Pro" }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + (idx * 0.1) }}
                className="space-y-2 opacity-50"
              >
                <item.icon size={20} className="mx-auto text-blue-400" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-[10px] text-slate-600 uppercase tracking-[0.3em] font-black"
          >
            Futuro • Excelência • 2026
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user}>
        {renderContent()}
      </Layout>
    </ErrorBoundary>
  );
}
