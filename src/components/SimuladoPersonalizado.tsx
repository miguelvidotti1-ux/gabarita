import React, { useState } from 'react';
import { Vestibular } from '../types';
import { Sparkles, Plus, Minus, Loader2, BookOpen, ChevronDown, ChevronUp, Check, Clock, Sliders, Library } from 'lucide-react';
import { generateQuestions, Question, SubjectConfig } from '../services/geminiService';
import { VESTIBULARES_DATA } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import ExamAcervoModal from './ExamAcervoModal';

interface Props {
  vestibular: Vestibular;
  onStartQuiz: (questions: Question[], isFull: boolean, timeLimit?: number) => void;
}

export default function SimuladoPersonalizado({ vestibular, onStartQuiz }: Props) {
  const vestibularInfo = VESTIBULARES_DATA[vestibular] || [];
  const subjects = vestibularInfo.map(s => s.subject);
  const [selectedSubjects, setSelectedSubjects] = useState<Record<string, SubjectConfig>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [totalTimeLimit, setTotalTimeLimit] = useState(0); // 0 means unlimited
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [showAcervoModal, setShowAcervoModal] = useState(false);

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev => {
      const next = { ...prev };
      if (next[subject]) {
        delete next[subject];
      } else {
        next[subject] = { count: 5, difficulty: 'médio', topics: [] };
      }
      return next;
    });
  };

  const selectAll = () => {
    if (Object.keys(selectedSubjects).length === subjects.length) {
      setSelectedSubjects({});
    } else {
      const all: Record<string, SubjectConfig> = {};
      subjects.forEach(s => { all[s] = { count: 5, difficulty: 'médio', topics: [] }; });
      setSelectedSubjects(all);
    }
  };

  const updateCount = (subject: string, delta: number) => {
    setSelectedSubjects(prev => ({
      ...prev,
      [subject]: { ...prev[subject], count: Math.max(5, (prev[subject]?.count || 5) + delta) }
    }));
  };

  const updateDifficulty = (subject: string, difficulty: 'fácil' | 'médio' | 'difícil') => {
    setSelectedSubjects(prev => ({
      ...prev,
      [subject]: { ...prev[subject], difficulty }
    }));
  };

  const toggleTopic = (subject: string, topicName: string) => {
    setSelectedSubjects(prev => {
      const currentTopics = prev[subject].topics || [];
      const nextTopics = currentTopics.includes(topicName)
        ? currentTopics.filter(t => t !== topicName)
        : [...currentTopics, topicName];
      
      return {
        ...prev,
        [subject]: { ...prev[subject], topics: nextTopics }
      };
    });
  };

  const totalQuestions = Object.values(selectedSubjects).reduce((a, b) => a + b.count, 0);

  const handleGenerate = async () => {
    if (totalQuestions === 0) return alert("Selecione pelo menos uma matéria e quantidade de questões.");

    setIsGenerating(true);
    try {
      const questions = await generateQuestions(vestibular, selectedSubjects);
      const totalTime = totalTimeLimit > 0 ? totalTimeLimit * 60 : undefined;
      onStartQuiz(questions, false, totalTime);
    } catch (error) {
      console.error("Erro ao gerar simulado:", error);
      alert("Erro ao gerar simulado. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-[var(--bg-card)] p-6 sm:p-8 rounded-3xl border border-[var(--border-light)] shadow-2xl space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border-light)]">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-badge)] text-[var(--primary)] text-xs font-semibold border border-[var(--primary-border)]">
              <Sliders size={13} />
              <span>Configurador Adaptativo</span>
            </div>
            {vestibular === Vestibular.ITA && (
              <button
                type="button"
                onClick={() => setShowAcervoModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-bold border border-sky-500/30 hover:bg-sky-500/20 transition-all cursor-pointer shadow-sm"
              >
                <Library size={13} />
                <span>Provas Oficiais ITA (18 Anos)</span>
              </button>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] flex items-center gap-2.5">
            <Sparkles className="text-[var(--primary)]" />
            Simulado Personalizado — {vestibular}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Monte um caderno sob medida escolhendo disciplinas, tópicos e tempo de prova.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 px-4 py-2 bg-[var(--bg-hover)] rounded-xl border border-[var(--border-light)]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              <Clock size={14} className="text-[var(--primary)]" />
              <span>Tempo:</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setTotalTimeLimit(Math.max(0, totalTimeLimit - 5))}
                className="w-7 h-7 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--border-light)] text-[var(--text-main)] flex items-center justify-center font-bold transition-colors cursor-pointer border border-[var(--border-light)]"
              >
                -
              </button>
              <span className="text-xs font-bold text-[var(--text-main)] min-w-[60px] text-center">
                {totalTimeLimit === 0 ? 'Livre' : `${totalTimeLimit} min`}
              </span>
              <button 
                onClick={() => setTotalTimeLimit(totalTimeLimit + 5)}
                className="w-7 h-7 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--border-light)] text-[var(--text-main)] flex items-center justify-center font-bold transition-colors cursor-pointer border border-[var(--border-light)]"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={selectAll}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--primary)] bg-[var(--bg-badge)] border border-[var(--primary-border)] hover:bg-[var(--primary-light)] transition-colors cursor-pointer"
          >
            {Object.keys(selectedSubjects).length === subjects.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
          </button>
        </div>
      </div>

      {/* Grid of Subjects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vestibularInfo.map((info) => {
          const isSelected = !!selectedSubjects[info.subject];
          const isExpanded = expandedSubject === info.subject;
          const currentConfig = selectedSubjects[info.subject];

          return (
            <div 
              key={info.subject}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isSelected 
                  ? 'bg-[var(--bg-hover)] border-[var(--primary)] ring-1 ring-[var(--primary)]/30' 
                  : 'bg-[var(--bg-card-elevated)] border-[var(--border-light)] hover:border-[var(--border-color)]'
              }`}
            >
              <div className="p-5 flex items-center justify-between gap-4">
                <div 
                  className="flex items-center gap-3 cursor-pointer flex-1"
                  onClick={() => toggleSubject(info.subject)}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors border ${
                    isSelected 
                      ? 'bg-[var(--primary)] border-[var(--primary)] text-white' 
                      : 'border-[var(--border-color)] bg-[var(--bg-card)]'
                  }`}>
                    {isSelected && <Check size={14} strokeWidth={3} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-[var(--text-main)]">{info.subject}</h3>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      {info.topics.length} tópicos disponíveis
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="flex items-center gap-3">
                    {/* Counter */}
                    <div className="flex items-center gap-1.5 bg-[var(--bg-card)] px-2.5 py-1 rounded-xl border border-[var(--border-light)]">
                      <button 
                        onClick={() => updateCount(info.subject, -5)}
                        className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-0.5 cursor-pointer"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="text-xs font-bold text-[var(--text-main)] min-w-[20px] text-center">
                        {currentConfig?.count}
                      </span>
                      <button 
                        onClick={() => updateCount(info.subject, 5)}
                        className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-0.5 cursor-pointer"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <button 
                      onClick={() => setExpandedSubject(isExpanded ? null : info.subject)}
                      className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg hover:bg-[var(--bg-card)] transition-colors cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                )}
              </div>

              {/* Expanded Options */}
              <AnimatePresence>
                {isSelected && isExpanded && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-5 border-t border-[var(--border-light)] bg-[var(--bg-card)] space-y-4"
                  >
                    <div>
                      <label className="text-[11px] font-bold text-[var(--text-label)] uppercase tracking-wider block mb-2">
                        Nível de Dificuldade
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['fácil', 'médio', 'difícil'] as const).map((diff) => (
                          <button
                            key={diff}
                            onClick={() => updateDifficulty(info.subject, diff)}
                            className={`py-2 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer border ${
                              currentConfig?.difficulty === diff
                                ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm'
                                : 'bg-[var(--bg-hover)] text-[var(--text-muted)] border-[var(--border-light)] hover:text-[var(--text-main)]'
                            }`}
                          >
                            {diff}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[var(--text-label)] uppercase tracking-wider block mb-2">
                        Tópicos Específicos (opcional)
                      </label>
                      <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                        {info.topics.map(topic => {
                          const isTopicSelected = currentConfig?.topics?.includes(topic.name);
                          return (
                            <button
                              key={topic.name}
                              onClick={() => toggleTopic(info.subject, topic.name)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                                isTopicSelected
                                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                                  : 'bg-[var(--bg-hover)] text-[var(--text-muted)] border-[var(--border-light)] hover:text-[var(--text-main)]'
                              }`}
                            >
                              {topic.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Footer / Generate Action */}
      <div className="p-6 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <p className="text-xs font-bold text-[var(--text-label)] uppercase tracking-wider">Total de Questões Selecionadas</p>
          <p className="text-2xl font-black text-[var(--text-main)]">{totalQuestions} questões</p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || totalQuestions === 0}
          className="w-full sm:w-auto px-8 py-3.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-50 text-white rounded-xl font-bold text-sm inline-flex items-center justify-center gap-2.5 shadow-lg shadow-[var(--shadow-primary)] transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>Gerando Simulado com IA...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Iniciar Simulado Agora</span>
            </>
          )}
        </button>
      </div>

      <ExamAcervoModal
        isOpen={showAcervoModal}
        onClose={() => setShowAcervoModal(false)}
        targetVestibular="ITA"
      />
    </div>
  );
}
