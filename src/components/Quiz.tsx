import * as React from 'react';
import { Question } from '../services/geminiService';
import { CheckCircle, XCircle, ArrowRight, Trophy, AlertCircle, RefreshCw, Clock, Sparkles, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { levelSystem } from '../services/levelService';
import { missionEngine } from '../services/missionService';
import { achievementService } from '../services/achievementService';
import { doc, setDoc, serverTimestamp, runTransaction, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import QuizSummary from './QuizSummary';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { saveToCache } from '../services/offlineCache';

interface QuizProps {
  questions: Question[];
  onComplete: () => void;
  isFullExam?: boolean;
  vestibular: string;
  timeLimit?: number; // Time in seconds
}

export default function Quiz({ questions, onComplete, isFullExam = false, vestibular, timeLimit }: QuizProps) {
  const isOnline = useOnlineStatus();

  React.useEffect(() => {
    if (questions && questions.length > 0) {
      saveToCache(vestibular || 'general', questions);
    }
  }, [questions, vestibular]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null);
  const [userAnswers, setUserAnswers] = React.useState<number[]>(new Array(questions.length).fill(-1));
  const [showResult, setShowResult] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [quizFinished, setQuizFinished] = React.useState(false);
  const [isExplanationOpen, setIsExplanationOpen] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(() => {
    if (isFullExam) return 4.5 * 60 * 60;
    if (timeLimit) return timeLimit;
    return 0;
  });
  const [isTimeUp, setIsTimeUp] = React.useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  React.useEffect(() => {
    if (isTimeUp) {
      setQuizFinished(true);
    }
  }, [isTimeUp]);

  React.useEffect(() => {
    if ((!isFullExam && !timeLimit) || quizFinished || isTimeUp) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizFinished, isTimeUp]);

  React.useEffect(() => {
    if (quizFinished) {
      saveQuizResult();
    }
  }, [quizFinished]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const saveQuizResult = async () => {
    if (!auth.currentUser) return;
    
    const resultId = `${auth.currentUser.uid}_${Date.now()}`;
    const resultPath = `quiz_results/${resultId}`;
    
    try {
      const subjectStats: Record<string, { total: number, correct: number }> = {};
      questions.forEach((q, i) => {
        if (!subjectStats[q.subject]) {
          subjectStats[q.subject] = { total: 0, correct: 0 };
        }
        subjectStats[q.subject].total += 1;
        if (userAnswers[i] === q.correctAnswer) {
          subjectStats[q.subject].correct += 1;
        }
      });

      await setDoc(doc(db, 'quiz_results', resultId), {
        userId: auth.currentUser.uid,
        vestibular,
        score,
        totalQuestions: questions.length,
        isFullExam,
        subjectStats,
        createdAt: serverTimestamp()
      });

      // Update User Performance Metrics in Firestore
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) return;

        const data = userDoc.data();
        const performance = data.performance || {};
        
        Object.entries(subjectStats).forEach(([subj, st]) => {
          const currentSubj = performance[subj] || { total: 0, correct: 0 };
          performance[subj] = {
            total: currentSubj.total + st.total,
            correct: currentSubj.correct + st.correct
          };
        });

        transaction.update(userRef, {
          performance,
          totalResolvedQuestions: (data.totalResolvedQuestions || 0) + questions.length,
          totalCorrectQuestions: (data.totalCorrectQuestions || 0) + score,
          simulatedCount: (data.simulatedCount || 0) + 1
        });
      });

      // XP & Level Progression
      const earnedXP = score * 10 + (isFullExam ? 50 : 0);
      levelSystem.addXP(earnedXP, 'general');

      // Update Missions
      missionEngine.getMissionsForToday().forEach(m => {
        if (m.type === 'questions') {
          missionEngine.updateProgress(m.id, questions.length);
        }
      });

      // Track Achievements
      if (auth.currentUser) {
        achievementService.trackActivity(auth.currentUser.uid, 'questoes', questions.length);
      }

    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, resultPath);
    }
  };

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = index;
    setUserAnswers(newAnswers);

    if (index === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
    setShowResult(true);

    // Registra progresso do Quiz no window.Progresso
    if (typeof window !== 'undefined' && (window as any).Progresso && (window as any).DisciplinaAtual) {
      const respondidas = newAnswers.filter(a => a !== undefined && a !== null).length;
      const totalQuestoes = questions.length || 1;
      const temaAtual = (currentQuestion as any)?.topic || currentQuestion?.subject || 'geral';
      const disciplina = (window as any).DisciplinaAtual.detectar(currentQuestion?.subject);
      (window as any).Progresso.registrar(disciplina, (window as any).DisciplinaAtual.slug(temaAtual), 'quiz', respondidas / totalQuestoes);
      (window as any).Progresso.aplicarNaTela(disciplina);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsExplanationOpen(false);
    } else {
      setQuizFinished(true);
    }
  };

  if (quizFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-8 font-sans pb-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="w-20 h-20 rounded-2xl bg-[var(--bg-badge)] border border-[var(--primary-border)] flex items-center justify-center text-[var(--primary)] mx-auto shadow-xl shadow-[var(--shadow-primary)]">
            <Trophy size={40} />
          </div>
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)] mb-1">
              Simulado Concluído!
            </h2>
            <p className="text-[var(--text-muted)] text-sm sm:text-base">
              Confira seu desempenho detalhado e gabarito comentado abaixo.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[var(--bg-card)] p-6 sm:p-8 rounded-2xl border border-[var(--border-light)] shadow-sm text-center">
              <p className="text-[var(--text-label)] text-xs font-bold uppercase tracking-wider mb-1">Total de Acertos</p>
              <p className="text-4xl font-black text-[var(--primary)]">{score} / {questions.length}</p>
            </div>
            <div className="bg-[var(--bg-card)] p-6 sm:p-8 rounded-2xl border border-[var(--border-light)] shadow-sm text-center">
              <p className="text-[var(--text-label)] text-xs font-bold uppercase tracking-wider mb-1">Aproveitamento Geral</p>
              <p className="text-4xl font-black text-emerald-400">{percentage}%</p>
            </div>
          </div>
          
          <QuizSummary questions={questions} userAnswers={userAnswers} />
        </motion.div>

        {/* Resumo das Questões */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[var(--text-main)]">
            Gabarito Comentado das Questões
          </h3>
          {questions.map((q, i) => {
            const isCorrect = userAnswers[i] === q.correctAnswer;
            return (
              <div 
                key={q.id || i} 
                className={`p-6 rounded-2xl border transition-all ${
                  isCorrect 
                    ? 'bg-emerald-500/5 border-emerald-500/30' 
                    : 'bg-rose-500/5 border-rose-500/30'
                }`}
              >
                <div className="flex items-start gap-3.5 mb-4">
                  {isCorrect ? (
                    <CheckCircle className="text-emerald-400 shrink-0 mt-0.5" size={22} />
                  ) : (
                    <XCircle className="text-rose-400 shrink-0 mt-0.5" size={22} />
                  )}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--bg-card)] border border-[var(--border-light)] text-[var(--text-muted)] mr-2">
                      Questão {i + 1} · {q.subject}
                    </span>
                    <p className="font-semibold text-[var(--text-main)] text-base sm:text-lg mt-2 leading-relaxed">
                      {q.text}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 ml-9">
                  <div className="text-sm text-[var(--text-muted)] flex items-center gap-2">
                    <span>Sua resposta:</span>
                    <span className={`font-bold ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {userAnswers[i] !== -1 ? q.options[userAnswers[i]] : 'Não respondida'}
                    </span>
                  </div>

                  {!isCorrect && (
                    <div className="text-sm text-[var(--text-muted)] flex items-center gap-2">
                      <span>Resposta correta:</span>
                      <span className="font-bold text-emerald-400">{q.options[q.correctAnswer]}</span>
                    </div>
                  )}

                  <div className="bg-[var(--bg-card)] p-4 rounded-xl mt-3 border border-[var(--border-light)]">
                    <p className="font-bold text-xs uppercase tracking-wider text-[var(--primary)] mb-1">
                      Explicação pedagógica:
                    </p>
                    <p className="text-[var(--text-muted)] text-xs sm:text-sm leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-6 flex justify-center">
          <button 
            onClick={onComplete}
            className="px-8 py-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-xl font-bold text-sm shadow-lg shadow-[var(--shadow-primary)] transition-all cursor-pointer hover:-translate-y-0.5"
          >
            Voltar para a Lista de Provas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6 font-sans pb-16">
      {!isOnline && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-4 rounded-2xl flex items-center gap-3 font-semibold text-sm">
          <AlertCircle className="text-amber-400 shrink-0" size={20} />
          <span>Você está offline. Exibindo questões salvas localmente no seu dispositivo.</span>
        </div>
      )}

      {/* Floating Timer if Exam has time limit */}
      {(isFullExam || timeLimit) && (
        <div className="fixed top-4 right-4 bg-[var(--bg-card)] p-3 px-4 rounded-xl border border-[var(--border-light)] shadow-2xl z-50 flex items-center gap-2">
          <Clock size={16} className="text-[var(--primary)] animate-pulse" />
          <span className={`text-lg font-black ${isTimeUp ? 'text-rose-400' : 'text-[var(--text-main)]'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex justify-between items-center bg-[var(--bg-card)] p-4 px-6 rounded-2xl border border-[var(--border-light)]">
        <div className="space-y-0.5">
          <span className="bg-[var(--bg-badge)] text-[var(--primary)] px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border border-[var(--primary-border)]">
            {currentQuestion.subject}
          </span>
          <h2 className="text-xs sm:text-sm font-semibold text-[var(--text-muted)]">
            Questão {currentQuestionIndex + 1} de {questions.length}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[var(--text-muted)]">
            {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
          </span>
          <div className="w-28 sm:w-36 h-2 bg-[var(--bg-hover)] rounded-full overflow-hidden border border-[var(--border-light)]">
            <motion.div 
              className="h-full bg-[var(--primary)]" 
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Question Body */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -15 }}
          transition={{ duration: 0.25 }}
          className="bg-[var(--bg-card)] p-6 sm:p-8 rounded-3xl border border-[var(--border-light)] shadow-2xl space-y-6"
        >
          {currentQuestion.image && (
            <div className="mb-4">
              <img
                src={currentQuestion.image}
                alt="Ilustração da questão"
                className="w-full max-h-96 object-contain rounded-2xl border border-[var(--border-light)] bg-black/40"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          <p className="text-base sm:text-lg text-[var(--text-main)] leading-relaxed font-medium">
            {currentQuestion.text}
          </p>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const isWrong = isSelected && !isCorrect;
              
              let buttonStyle = "w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ";
              
              if (showResult) {
                if (isCorrect) {
                  buttonStyle += "bg-emerald-500/10 border-emerald-500 text-emerald-300 font-semibold";
                } else if (isWrong) {
                  buttonStyle += "bg-rose-500/10 border-rose-500 text-rose-300 font-semibold";
                } else {
                  buttonStyle += "bg-[var(--bg-card-elevated)] border-[var(--border-light)] text-[var(--text-label)] opacity-40";
                }
              } else {
                if (isSelected) {
                  buttonStyle += "bg-[var(--bg-badge)] border-[var(--primary)] text-[var(--text-main)] shadow-md shadow-[var(--shadow-primary)] font-semibold";
                } else {
                  buttonStyle += "bg-[var(--bg-card-elevated)] border-[var(--border-light)] text-[var(--text-main)] hover:border-[var(--border-color)] hover:bg-[var(--bg-hover)]";
                }
              }

              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: !showResult ? 1.005 : 1 }}
                  whileTap={{ scale: !showResult ? 0.995 : 1 }}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={buttonStyle}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <span className={`
                      w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors
                      ${isSelected ? 'bg-[var(--primary)] text-white' : 'bg-[var(--bg-hover)] text-[var(--text-muted)] border border-[var(--border-light)] group-hover:text-[var(--text-main)]'}
                      ${showResult && isCorrect ? 'bg-emerald-500 text-white' : ''}
                      ${showResult && isWrong ? 'bg-rose-500 text-white' : ''}
                    `}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1 text-sm sm:text-base leading-relaxed break-words">{option}</span>
                  </div>
                  {showResult && isCorrect && <CheckCircle className="text-emerald-400 shrink-0 ml-2" size={20} />}
                  {showResult && isWrong && <XCircle className="text-rose-400 shrink-0 ml-2" size={20} />}
                </motion.button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {showResult && (
            <div className="mt-4 pt-4 border-t border-[var(--border-light)] space-y-3">
              <button
                onClick={() => setIsExplanationOpen(!isExplanationOpen)}
                className="flex items-center gap-2 text-xs sm:text-sm text-[var(--primary)] font-bold hover:underline cursor-pointer"
              >
                <span>{isExplanationOpen ? 'Ocultar Resolução Comentada' : 'Ver Resolução Comentada'}</span>
                {isExplanationOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              <AnimatePresence>
                {isExplanationOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] space-y-2 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed"
                  >
                    <p className="font-bold text-[var(--primary)] uppercase text-[11px] tracking-wider">
                      Resolução oficial comentada:
                    </p>
                    <p className="whitespace-pre-line">{currentQuestion.explanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-xl font-semibold text-sm inline-flex items-center gap-2 shadow-md shadow-[var(--shadow-primary)] transition-all cursor-pointer hover:-translate-y-0.5"
                >
                  <span>{currentQuestionIndex < questions.length - 1 ? 'Próxima Questão' : 'Finalizar Simulado'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
