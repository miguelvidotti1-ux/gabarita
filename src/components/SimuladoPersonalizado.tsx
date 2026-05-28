import React, { useState } from 'react';
import { Vestibular } from '../types';
import { Sparkles, Plus, Minus, Loader2, BookOpen, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { generateQuestions, Question, SubjectConfig } from '../services/geminiService';
import { VESTIBULARES_DATA } from '../constants';

interface Props {
  vestibular: Vestibular;
  onStartQuiz: (questions: Question[], isFull: boolean, timeLimit?: number) => void;
}

export default function SimuladoPersonalizado({ vestibular, onStartQuiz }: Props) {
  const vestibularInfo = VESTIBULARES_DATA[vestibular];
  const subjects = vestibularInfo.map(s => s.subject);
  const [selectedSubjects, setSelectedSubjects] = useState<Record<string, SubjectConfig>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [totalTimeLimit, setTotalTimeLimit] = useState(0); // 0 means unlimited
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

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
    <div className="bg-white dark:bg-blue-900 p-8 rounded-3xl border dark:border-blue-800 shadow-sm space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Sparkles className="text-blue-600 dark:text-blue-400" />
          Simulado Personalizado - {vestibular}
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-blue-950 rounded-xl border dark:border-blue-800">
            <span className="text-xs font-bold text-slate-500 dark:text-blue-400 uppercase tracking-wider">Tempo Geral:</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setTotalTimeLimit(Math.max(0, totalTimeLimit - 5))}
                className="p-1 hover:bg-slate-200 dark:hover:bg-blue-800 rounded text-slate-600 dark:text-blue-300"
              >
                <Minus size={14} />
              </button>
              <span className="text-sm font-black text-blue-600 dark:text-blue-400 min-w-[3rem] text-center">
                {totalTimeLimit === 0 ? 'Livre' : `${totalTimeLimit} min`}
              </span>
              <button 
                onClick={() => setTotalTimeLimit(totalTimeLimit + 5)}
                className="p-1 hover:bg-slate-200 dark:hover:bg-blue-800 rounded text-slate-600 dark:text-blue-300"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
          <button 
            onClick={selectAll}
            className="px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 font-semibold text-sm hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
          >
            {Object.keys(selectedSubjects).length === subjects.length ? 'Desmarcar Todas' : 'Selecionar Todas'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vestibularInfo.map(subjectInfo => {
          const subject = subjectInfo.subject;
          const isSelected = !!selectedSubjects[subject];
          const isExpanded = expandedSubject === subject;

          return (
            <div key={subject} className={`p-5 rounded-3xl border transition-all ${isSelected ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-800/20 shadow-md shadow-blue-100/50 dark:shadow-none' : 'border-slate-200 dark:border-blue-800 bg-white dark:bg-blue-900/50'}`}>
              <div className="flex items-center justify-between gap-3 overflow-hidden">
                <label className="flex-1 flex items-center gap-3 font-black text-slate-800 dark:text-white cursor-pointer group overflow-hidden">
                  <div className={`
                    w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all shrink-0
                    ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-transparent border-slate-300 dark:border-blue-800 group-hover:border-blue-400'}
                  `}>
                    {isSelected && <Check size={14} className="text-white" />}
                  </div>
                  <input 
                    type="checkbox" 
                    checked={isSelected} 
                    onChange={() => toggleSubject(subject)}
                    className="hidden"
                  />
                  <span className="truncate">{subject}</span>
                </label>
                {isSelected && (
                  <button 
                    onClick={() => setExpandedSubject(isExpanded ? null : subject)}
                    className="p-2 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-full text-blue-600 dark:text-blue-400 transition-colors shrink-0"
                  >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                )}
              </div>

              {isSelected && (
                <div className={`mt-6 space-y-6 ${isExpanded ? 'block' : 'hidden md:block'}`}>
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-blue-950 rounded-2xl border dark:border-blue-800">
                    <button onClick={() => updateCount(subject, -5)} className="p-2 rounded-xl bg-slate-50 dark:bg-blue-900 text-slate-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors">
                      <Minus size={16} />
                    </button>
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Questões</p>
                      <span className="font-black text-xl text-blue-600 dark:text-blue-400">{selectedSubjects[subject].count}</span>
                    </div>
                    <button onClick={() => updateCount(subject, 5)} className="p-2 rounded-xl bg-slate-50 dark:bg-blue-900 text-slate-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors">
                      <Plus size={16} />
                    </button>
                  </div>

                  <select 
                    value={selectedSubjects[subject].difficulty}
                    onChange={(e) => updateDifficulty(subject, e.target.value as 'fácil' | 'médio' | 'difícil')}
                    className="w-full bg-white dark:bg-blue-950 border dark:border-blue-800 rounded-2xl p-3 text-sm font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="fácil">📊 Nível: Fácil</option>
                    <option value="médio">📈 Nível: Médio</option>
                    <option value="difícil">🔥 Nível: Difícil</option>
                  </select>

                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Tópicos (Opcional):</p>
                    <div className="flex flex-wrap gap-2">
                       {subjectInfo.topics.map(topic => {
                         const isTopicSelected = selectedSubjects[subject].topics?.includes(topic.name);
                         return (
                           <button
                             key={topic.name}
                             onClick={() => toggleTopic(subject, topic.name)}
                             className={`
                               px-3 py-1.5 rounded-xl text-xs font-bold transition-all border
                               ${isTopicSelected 
                                 ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none' 
                                 : 'bg-white dark:bg-blue-950 border-slate-200 dark:border-blue-800 text-slate-600 dark:text-blue-400 hover:border-blue-300'}
                             `}
                           >
                             {topic.name}
                           </button>
                         );
                       })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-200 dark:border-blue-800">
        <div className="flex items-center gap-4">
          <div className="text-left">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Resumo do Simulado</p>
            <span className="text-2xl font-black text-slate-800 dark:text-white">
              {totalQuestions} <span className="text-slate-400 font-bold text-lg uppercase">Questões</span>
            </span>
          </div>
          <div className="h-10 w-px bg-slate-200 dark:bg-blue-800"></div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Matérias</p>
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {Object.keys(selectedSubjects).length}
            </span>
          </div>
        </div>
        
        <button 
          onClick={handleGenerate}
          disabled={isGenerating || Object.keys(selectedSubjects).length === 0}
          className="w-full sm:w-auto px-12 py-5 rounded-2xl font-black text-xl bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-blue-200 dark:shadow-none"
        >
          {isGenerating ? <Loader2 size={24} className="animate-spin" /> : <BookOpen size={24} />}
          <span>{isGenerating ? 'Gerando...' : 'Iniciar Simulado'}</span>
        </button>
      </div>
    </div>
  );
}
