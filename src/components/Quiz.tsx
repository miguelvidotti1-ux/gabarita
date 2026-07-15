import * as React from 'react';
import { Question } from '../services/geminiService';
import { CheckCircle, XCircle, ArrowRight, Trophy, AlertCircle, RefreshCw } from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { levelSystem } from '../services/levelService';
import { missionEngine } from '../services/missionService';
import { achievementService } from '../services/achievementService';
import { doc, setDoc, serverTimestamp, runTransaction, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';

interface QuizProps {
  questions: Question[];
  onComplete: () => void;
  isFullExam?: boolean;
  vestibular: string;
  timeLimit?: number; // Time in seconds
}

export default function Quiz({ questions, onComplete, isFullExam = false, vestibular, timeLimit }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null);
  const [userAnswers, setUserAnswers] = React.useState<number[]>(new Array(questions.length).fill(-1));
  const [showResult, setShowResult] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [quizFinished, setQuizFinished] = React.useState(false);
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
      // Calculate subject performance
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

      // Save quiz result
      const resultRef = doc(db, 'quiz_results', resultId);
      await setDoc(resultRef, {
        userId: auth.currentUser.uid,
        vestibular,
        score,
        totalQuestions: questions.length,
        percentage: Math.round((score / questions.length) * 100),
        questions: questions.map((q, i) => ({
          questionId: q.id,
          selectedAnswer: userAnswers[i],
          isCorrect: userAnswers[i] === q.correctAnswer
        })),
        timestamp: serverTimestamp()
      });

      // Update subject performance
      for (const subject in subjectStats) {
        const stats = subjectStats[subject];
        
        // Add XP
        levelSystem.addXP(stats.correct * 10, subject);

        // Update Mission Progress
        missionEngine.getMissionsForToday().forEach(m => {
          if (m.type === 'questions' && (m.topic === subject || m.topic === 'review')) {
            missionEngine.updateProgress(m.id, stats.correct);
          }
        });

        // Update user Metas/Achievements automatically
        achievementService.trackActivity(auth.currentUser?.uid || 'guest', 'questoes', stats.total);

        const performanceRef = doc(db, 'users', auth.currentUser.uid, 'subject_performance', subject);
        const performancePath = `users/${auth.currentUser.uid}/subject_performance/${subject}`;
        
        try {
          await runTransaction(db, async (transaction) => {
            const perfDoc = await transaction.get(performanceRef);
            if (!perfDoc.exists()) {
              transaction.set(performanceRef, {
                userId: auth.currentUser!.uid,
                subject,
                totalQuestions: stats.total,
                correctQuestions: stats.correct,
                percentage: Math.round((stats.correct / stats.total) * 100)
              });
            } else {
              const data = perfDoc.data();
              const totalQuestions = data.totalQuestions + stats.total;
              const correctQuestions = data.correctQuestions + stats.correct;
              transaction.update(performanceRef, {
                totalQuestions,
                correctQuestions,
                percentage: Math.round((correctQuestions / totalQuestions) * 100)
              });
            }
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, performancePath);
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, resultPath);
    }
  };

  const handleAnswerSelect = (index: number) => {
    if (showResult || isTimeUp) return;
    setSelectedAnswer(index);
  };

  const handleConfirm = () => {
    if (selectedAnswer === null || isTimeUp) return;
    
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setUserAnswers(newAnswers);

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
    setShowResult(true);
  };

  const [isExplanationOpen, setIsExplanationOpen] = React.useState(false);

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
      <div className="max-w-3xl mx-auto py-12 space-y-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8"
        >
          <div className="bg-blue-600 w-24 h-24 rounded-full flex items-center justify-center text-white mx-auto shadow-xl shadow-blue-200 dark:shadow-none">
            <Trophy size={48} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-2">Simulado Concluído!</h2>
            <p className="text-slate-500 dark:text-blue-300 text-lg">Veja seu desempenho no simulado gerado por IA.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-blue-900 p-8 rounded-3xl border dark:border-blue-800 shadow-sm">
              <p className="text-slate-500 dark:text-blue-400 text-sm font-bold uppercase tracking-widest mb-1">Acertos</p>
              <p className="text-4xl font-black text-blue-600 dark:text-blue-400">{score} / {questions.length}</p>
            </div>
            <div className="bg-white dark:bg-blue-900 p-8 rounded-3xl border dark:border-blue-800 shadow-sm">
              <p className="text-slate-500 dark:text-blue-400 text-sm font-bold uppercase tracking-widest mb-1">Aproveitamento</p>
              <p className="text-4xl font-black text-blue-600 dark:text-blue-400">{percentage}%</p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Resumo das Questões</h3>
          {questions.map((q, i) => {
            const isCorrect = userAnswers[i] === q.correctAnswer;
            return (
              <div key={q.id} className={`p-6 rounded-3xl border-2 ${isCorrect ? 'bg-green-50 dark:bg-green-900/20 border-green-500' : 'bg-red-50 dark:bg-red-900/20 border-red-500'}`}>
                <div className="flex items-start gap-4 mb-4">
                  {isCorrect ? <CheckCircle className="text-green-600 dark:text-green-400 mt-1" size={24} /> : <XCircle className="text-red-600 dark:text-red-400 mt-1" size={24} />}
                  <p className="font-bold text-slate-800 dark:text-white text-lg">{q.text}</p>
                </div>
                <div className="space-y-2 ml-10">
                  <p className="text-sm font-bold text-slate-700 dark:text-blue-200 flex items-center gap-2">
                    Sua resposta: <span className={isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                      {userAnswers[i] !== -1 ? q.options[userAnswers[i]] : 'Não respondida'}
                    </span>
                    {!isCorrect && userAnswers[i] !== -1 && <XCircle className="text-red-600" size={16} />}
                  </p>
                  {!isCorrect && (
                    <p className="text-sm font-bold text-slate-700 dark:text-blue-200">
                      Resposta correta: <span className="text-green-700 dark:text-green-400">{q.options[q.correctAnswer]}</span>
                    </p>
                  )}
                  <div className="bg-white dark:bg-blue-950 p-4 rounded-xl mt-4 border border-blue-100 dark:border-blue-800">
                    <p className="font-bold text-blue-800 dark:text-blue-200 mb-1">Explicação:</p>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">{q.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={onComplete}
            className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black text-xl hover:bg-blue-700 hover:scale-105 transition-all shadow-xl shadow-blue-200 dark:shadow-none"
          >
            Voltar para Provas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      {(isFullExam || timeLimit) && (
        <div className="fixed top-4 right-4 bg-white dark:bg-blue-900 p-4 rounded-2xl border dark:border-blue-800 shadow-lg z-50">
          <p className={`text-2xl font-black ${isTimeUp ? 'text-red-600' : 'text-slate-800 dark:text-white'}`}>
            {formatTime(timeLeft)}
          </p>
        </div>
      )}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
            {currentQuestion.subject}
          </span>
          <h2 className="text-slate-500 dark:text-blue-300 font-bold">Questão {currentQuestionIndex + 1} de {questions.length}</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-500 dark:text-blue-400">{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
          <div className="w-32 h-2 bg-slate-100 dark:bg-blue-900 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-600" 
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-blue-900 p-8 rounded-3xl border dark:border-blue-800 shadow-sm space-y-8"
        >
          {currentQuestion.image && (
            <div className="mb-6">
              <img
                src={currentQuestion.image}
                alt="Ilustração da questão"
                className="w-full h-auto rounded-2xl border border-slate-200 dark:border-blue-800"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          <p className="text-xl text-slate-800 dark:text-white leading-relaxed font-medium">
            {currentQuestion.text}
          </p>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const isWrong = isSelected && !isCorrect;
              
              let buttonClass = "w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between group ";
              
              if (showResult) {
                if (isCorrect) buttonClass += "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400";
                else if (isWrong) buttonClass += "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400";
                else buttonClass += "bg-white dark:bg-blue-950 border-slate-100 dark:border-blue-800 text-slate-400 dark:text-blue-500 opacity-50";
              } else {
                if (isSelected) buttonClass += "bg-blue-50 dark:bg-blue-800 border-blue-600 text-blue-600 dark:text-blue-200";
                else buttonClass += "bg-white dark:bg-blue-950 border-slate-100 dark:border-blue-800 text-slate-600 dark:text-blue-300 hover:border-blue-200 dark:hover:border-blue-700";
              }

              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: !showResult ? 1.01 : 1 }}
                  whileTap={{ scale: !showResult ? 0.98 : 1 }}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={buttonClass}
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <span className={`
                      w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shrink-0
                      ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-blue-800 text-slate-500 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-700 group-hover:text-blue-600 dark:group-hover:text-white'}
                      ${showResult && isCorrect ? 'bg-green-500 text-white' : ''}
                      ${showResult && isWrong ? 'bg-red-500 text-white' : ''}
                    `}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1 break-words">{option}</span>
                  </div>
                  {showResult && isCorrect && <CheckCircle className="text-green-500 shrink-0 ml-2" size={20} />}
                  {showResult && isWrong && <XCircle className="text-red-600 shrink-0 ml-2" size={24} />}
                </motion.button>
              );
            })}
          </div>

          {showResult && (
            <div className="mt-6">
              <button
                onClick={() => setIsExplanationOpen(!isExplanationOpen)}
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                <AlertCircle size={20} />
                {isExplanationOpen ? 'Ocultar Explicação' : 'Ver Explicação'}
              </button>
              
              <AnimatePresence>
                {isExplanationOpen && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 bg-blue-50 dark:bg-blue-950/50 p-6 rounded-2xl border border-blue-100 dark:border-blue-800"
                  >
                    <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">{currentQuestion.explanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <div className="pt-4">
            {isTimeUp && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl border border-red-200 dark:border-red-800 font-bold text-center mb-4">
                O tempo acabou! Você não pode mais responder questões.
              </div>
            )}
            {!showResult ? (
              <button
                onClick={handleConfirm}
                disabled={selectedAnswer === null || isTimeUp}
                className={`
                  w-full py-5 rounded-2xl font-black text-xl transition-all shadow-xl
                  ${(selectedAnswer === null || isTimeUp)
                    ? 'bg-slate-200 dark:bg-blue-800 text-slate-400 dark:text-blue-500 cursor-not-allowed shadow-none' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02] shadow-blue-200 dark:shadow-none'}
                `}
              >
                {isTimeUp ? 'Tempo Esgotado' : 'Confirmar Resposta'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full py-5 rounded-2xl bg-blue-600 dark:bg-blue-700 text-white font-black text-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all flex items-center justify-center gap-3"
              >
                <span>{currentQuestionIndex < questions.length - 1 ? 'Próxima Questão' : 'Ver Resultado'}</span>
                <ArrowRight size={24} />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
