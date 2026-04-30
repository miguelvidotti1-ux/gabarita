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
import TodasProvas from './components/TodasProvas';
import Redacao from './components/Redacao';
import Conteudos from './components/Conteudos';
import Videos from './components/Videos';
import Quiz from './components/Quiz';
import ChatWithAI from './components/ChatWithAI';
import Sobre from './components/Sobre';
import DailyMissions from './components/DailyMissions';
import ErrorBoundary from './components/ErrorBoundary';
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
          <div className="space-y-12 py-8">
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-black uppercase tracking-widest">
                <Sparkles size={16} />
                <span>Preparação Completa 2026</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
                Sua Aprovação Começa <span className="text-blue-500">Hoje</span>
              </h1>
              <p className="text-xl text-slate-500 dark:text-blue-300 max-w-2xl mx-auto leading-relaxed">
                A plataforma definitiva para os principais vestibulares do Brasil. Provas, simulados, redação e conteúdos que realmente caem.
              </p>
              <div className="flex flex-col md:flex-row justify-center gap-4 pt-4">
                <button 
                  onClick={() => setActiveTab('vestibulares')}
                  className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-blue-700 hover:scale-105 transition-all shadow-xl shadow-blue-200 dark:shadow-none"
                >
                  Começar Agora
                </button>
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className="bg-white dark:bg-blue-900 text-slate-800 dark:text-white border-2 border-slate-200 dark:border-blue-800 px-10 py-5 rounded-2xl font-black text-xl hover:bg-white dark:hover:bg-blue-800 transition-all"
                >
                  Ver Dashboard
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: '48 Provas Oficiais', desc: 'As últimas 8 edições dos 6 principais vestibulares com gabarito.', icon: 'FileText' },
                { title: 'IA de Redação', desc: 'Gerador de temas e correção automática baseada em competências.', icon: 'PenTool' },
                { title: 'Conteúdo Focado', desc: 'Análise estatística do que mais cai em cada disciplina.', icon: 'Target' },
              ].map((feature, i) => (
                <div key={i} className="bg-white dark:bg-blue-900 p-8 rounded-3xl border dark:border-blue-800 shadow-sm hover:shadow-md transition-all">
                  <div className="bg-blue-50 dark:bg-blue-800 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-200 mb-6">
                    <GraduationCap size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-500 dark:text-blue-300 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>

            <div className="max-w-4xl mx-auto w-full">
              <DailyMissions />
            </div>
          </div>
        );
      case 'vestibulares':
        return (
          <Vestibulares 
            onSelect={(v) => { 
              setSelectedVestibular(v);
              setActiveTab('todas-provas');
            }} 
            onStartQuiz={(questions, isFull, timeLimit) => startQuiz(questions, isFull, timeLimit)}
          />
        );
      case 'todas-provas':
        return (
          <TodasProvas 
            onStartQuiz={(questions) => startQuiz(questions, true)}
            initialVestibular={selectedVestibular}
          />
        );
      case 'redacao':
        return <Redacao vestibular={selectedVestibular} setVestibular={setSelectedVestibular} />;
      case 'conteudos':
        return <Conteudos vestibular={selectedVestibular} onStartQuiz={(questions, isFull, timeLimit) => startQuiz(questions, isFull, timeLimit)} />;
      case 'videos':
        return <Videos vestibular={selectedVestibular} />;
      case 'chat':
        return <ChatWithAI />;
      case 'sobre':
        return <Sobre />;
      case 'dashboard':
        return <Dashboard />;
      case 'quiz':
        return <Quiz questions={quizQuestions} isFullExam={isFullExam} onComplete={() => setActiveTab('home')} vestibular={selectedVestibular} timeLimit={quizTimeLimit} />;
      case 'login':
        return (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="bg-white dark:bg-blue-900 p-12 rounded-3xl border dark:border-blue-800 shadow-xl max-w-md w-full text-center space-y-8">
              <div className="bg-blue-100 dark:bg-blue-800 w-20 h-20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-200 mx-auto">
                <GraduationCap size={48} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-800 dark:text-white">Bem-vindo de volta!</h2>
                <p className="text-slate-500 dark:text-blue-300">Entre para salvar seu progresso e acessar simulados personalizados.</p>
              </div>
              <button 
                onClick={handleLogin}
                className="w-full flex items-center justify-center gap-3 bg-blue-600 dark:bg-blue-700 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 dark:hover:bg-blue-600 transition-all text-lg"
              >
                <LogIn size={20} />
                <span>Entrar com Google</span>
              </button>
              <p className="text-xs text-slate-400 dark:text-blue-400">Ao entrar, você concorda com nossos termos de uso e política de privacidade.</p>
            </div>
          </div>
        );
      default:
        return <div>Página não encontrada</div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-blue-950 transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <GraduationCap className="text-blue-600 dark:text-blue-400 w-16 h-16 animate-bounce" />
          <p className="text-slate-500 dark:text-blue-300 font-bold animate-pulse">Carregando Vestibular Pro...</p>
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
