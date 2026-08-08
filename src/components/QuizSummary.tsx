import React from 'react';
import { BookOpen } from 'lucide-react';
import { Question } from '../types';

interface QuizSummaryProps {
  questions: any[];
  userAnswers: number[];
}

export default function QuizSummary({ questions, userAnswers }: QuizSummaryProps) {
  const topicsToReview = React.useMemo(() => {
    const topics = new Set<string>();
    questions.forEach((q, i) => {
      // Usando 'correctAnswer' conforme usado em Quiz.tsx
      if (userAnswers[i] !== (q as any).correctAnswer) {
        topics.add(q.topic);
      }
    });
    return Array.from(topics);
  }, [questions, userAnswers]);

  if (topicsToReview.length === 0) return (
    <div className="bg-green-50 dark:bg-green-900/20 p-8 rounded-3xl border border-green-200 dark:border-green-800 shadow-sm text-center">
        <h4 className="text-xl font-bold text-green-800 dark:text-green-300">Parabéns!</h4>
        <p className="text-green-700 dark:text-green-400">Você acertou todas as questões!</p>
    </div>
  );

  return (
    <div className="bg-white dark:bg-blue-900 p-8 rounded-3xl border border-blue-100 dark:border-blue-800 shadow-sm">
      <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
        <BookOpen className="text-blue-600 dark:text-blue-400" />
        Temas para Revisão
      </h4>
      <p className="text-slate-500 dark:text-blue-300 text-sm mb-6">
        Você errou questões sobre estes temas. Dedique um tempo para revisá-los:
      </p>
      <div className="flex flex-wrap gap-2">
        {topicsToReview.map(topic => (
          <span key={topic} className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-semibold">
            {topic}
          </span>
        ))}
      </div>
    </div>
  );
}
