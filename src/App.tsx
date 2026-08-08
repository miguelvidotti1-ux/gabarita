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
import SkillSwipe from './components/SkillSwipe';
import HomeView from './components/HomeView';
import { Question } from './services/geminiService';
import { GraduationCap, LogIn, Sparkles, BookOpen, Target, Award, Trophy, Zap, Clock } from 'lucide-react';
import { motion } from 'motion/react';

import LoginScreen from './components/LoginScreen';

export default function App() {
  const [user, setUser] = React.useState<User | any | null>(null);
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
        // Retain local session user if set
        setUser((prev) => (prev && 'uid' in prev && !('getIdToken' in prev) ? prev : null));
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
      case 'desafio':
        return <DesafioSemanalComponent vestibular={selectedVestibular} onStartQuiz={(questions, isFull, timeLimit) => startQuiz(questions, isFull, timeLimit)} />;
      case 'agenda':
        return <CronogramaVestibulares />;
      case 'conquistas':
        return <SistemasConquistasMetas />;
      case 'skillswipe':
        return <SkillSwipe />;
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
        return <LoginScreen onLoginSuccess={(u) => { setUser(u); setActiveTab('home'); }} />;
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
      <LoginScreen
        onLoginSuccess={(userObj) => {
          setUser(userObj);
        }}
      />
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
