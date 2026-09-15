import React from 'react';
import { BookOpen, CheckCircle } from 'lucide-react';

interface QuizSummaryProps {
  questions: any[];
  userAnswers: number[];
}

export default function QuizSummary({ questions, userAnswers }: QuizSummaryProps) {
  const topicsToReview = React.useMemo(() => {
    const topics = new Set<string>();
    questions.forEach((q, i) => {
      if (userAnswers[i] !== (q as any).correctAnswer && q.topic) {
        topics.add(q.topic);
      }
    });
    return Array.from(topics);
  }, [questions, userAnswers]);

  if (topicsToReview.length === 0) {
    return (
      <div className="bg-emerald-500/10 p-6 sm:p-8 rounded-2xl border border-emerald-500/30 shadow-sm text-center space-y-1">
        <CheckCircle className="text-emerald-400 mx-auto mb-2" size={32} />
        <h4 className="text-lg font-bold text-emerald-300">Desempenho Impecável!</h4>
        <p className="text-xs sm:text-sm text-emerald-400/90">Você acertou todas as questões deste simulado!</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-card)] p-6 sm:p-8 rounded-2xl border border-[var(--border-light)] shadow-sm text-left">
      <h4 className="text-lg font-bold text-[var(--text-main)] mb-2 flex items-center gap-2">
        <BookOpen className="text-[var(--primary)]" size={20} />
        Temas Sugeridos para Revisão
      </h4>
      <p className="text-[var(--text-muted)] text-xs sm:text-sm mb-4">
        Com base nos seus erros, recomendamos reforçar o estudo dos seguintes tópicos:
      </p>
      <div className="flex flex-wrap gap-2">
        {topicsToReview.map(topic => (
          <span 
            key={topic} 
            className="bg-[var(--bg-hover)] text-[var(--primary)] border border-[var(--border-light)] px-3.5 py-1.5 rounded-xl text-xs font-semibold"
          >
            {topic}
          </span>
        ))}
      </div>
    </div>
  );
}
