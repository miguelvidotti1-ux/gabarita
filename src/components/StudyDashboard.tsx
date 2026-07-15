import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Sparkles, Book, Target, AlertCircle, X } from 'lucide-react';

interface Subject {
  name: string;
  difficulty: number;
  contents: string[];
}

interface RoutineDay {
  day: string;
  slots: {
    subject: string;
    content: string;
  }[];
}

const DEFAULT_SUBJECTS: Subject[] = [
  { name: 'Matemática', difficulty: 8, contents: ['Álgebra', 'Geometria', 'Funções'] },
  { name: 'Português', difficulty: 6, contents: ['Gramática', 'Leitura e Interpretação'] },
  { name: 'Física', difficulty: 7, contents: ['Mecânica', 'Cinemática'] },
  { name: 'Química', difficulty: 6, contents: ['Química Orgânica', 'Estequiometria'] },
  { name: 'História', difficulty: 5, contents: ['História do Brasil', 'História Geral'] },
  { name: 'Biologia', difficulty: 5, contents: ['Citologia', 'Genética'] },
];

interface StudyDashboardProps {
  hideHeader?: boolean;
}

export default function StudyDashboard({ hideHeader = false }: StudyDashboardProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [routine, setRoutine] = useState<RoutineDay[] | null>(null);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectDiff, setNewSubjectDiff] = useState(5);
  const [contentInputs, setContentInputs] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const savedSubjects = localStorage.getItem('study_subjects');
    const savedRoutine = localStorage.getItem('study_routine');
    
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects).sort((a: Subject, b: Subject) => b.difficulty - a.difficulty));
    } else {
      setSubjects(DEFAULT_SUBJECTS.sort((a, b) => b.difficulty - a.difficulty));
    }
    if (savedRoutine) {
      setRoutine(JSON.parse(savedRoutine));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('study_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    if (routine) {
      localStorage.setItem('study_routine', JSON.stringify(routine));
    }
  }, [routine]);

  const addSubject = () => {
    if (!newSubjectName.trim() || subjects.length >= 6) return;
    if (subjects.some(s => s.name.toLowerCase() === newSubjectName.toLowerCase())) {
      alert('Matéria já existe!');
      return;
    }

    const newSubject: Subject = {
      name: newSubjectName.trim(),
      difficulty: newSubjectDiff,
      contents: []
    };

    setSubjects(prev => [...prev, newSubject].sort((a, b) => b.difficulty - a.difficulty));
    setNewSubjectName('');
    setNewSubjectDiff(5);
  };

  const removeSubject = (index: number) => {
    setSubjects(prev => prev.filter((_, i) => i !== index));
    setRoutine(null);
  };

  const addContent = (index: number) => {
    const content = contentInputs[index]?.trim();
    if (!content) return;

    setSubjects(prev => {
      const updated = [...prev];
      updated[index].contents.push(content);
      return updated;
    });

    setContentInputs(prev => ({ ...prev, [index]: '' }));
  };

  const removeContent = (subIndex: number, contentIndex: number) => {
    setSubjects(prev => {
      const updated = [...prev];
      updated[subIndex].contents = updated[subIndex].contents.filter((_, i) => i !== contentIndex);
      return updated;
    });
  };

  const shuffle = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const generateRoutine = () => {
    if (subjects.length === 0) return;

    const totalWeight = subjects.reduce((sum, s) => sum + s.difficulty, 0);
    const totalSlots = 28; // 4 slots * 7 days
    let assignments: string[] = [];

    subjects.forEach(s => {
      const slotsCount = Math.max(1, Math.round((s.difficulty / totalWeight) * totalSlots));
      for (let i = 0; i < slotsCount; i++) {
        assignments.push(s.name);
      }
    });

    while (assignments.length < totalSlots) {
      assignments.push(subjects[0].name);
    }
    
    assignments = shuffle(assignments).slice(0, totalSlots);

    const dayNames = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
    const newRoutine: RoutineDay[] = [];

    for (let d = 0; d < 7; d++) {
      const daySlots = [];
      for (let slot = 0; slot < 4; slot++) {
        const subName = assignments[d * 4 + slot] || (subjects[0] ? subjects[0].name : 'Estudo Geral');
        const sub = subjects.find(s => s.name === subName);
        const content = sub && sub.contents && sub.contents.length > 0 
          ? sub.contents[Math.floor(Math.random() * sub.contents.length)]
          : 'Estudo geral';
        daySlots.push({ subject: subName, content });
      }
      newRoutine.push({ day: dayNames[d], slots: daySlots });
    }

    setRoutine(newRoutine);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Configuration Header */}
      <div className="bg-[var(--card-bg)] p-8 rounded-3xl border border-[var(--card-border)] shadow-xl space-y-6">
        {!hideHeader && (
          <div className="flex items-center gap-3">
            <div className="bg-[var(--bg-secondary)] p-3 rounded-2xl text-[var(--text-accent)]">
              <Target size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black">Planejamento de Rotina Semanal</h2>
              <p className="text-[var(--text-secondary)]">Otimize seu tempo focando no que é mais difícil.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            type="text" 
            placeholder="Nome da matéria (ex: Matemática)"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            disabled={subjects.length >= 6}
            className="bg-[var(--bg-secondary)] border border-[var(--card-border)] p-4 rounded-2xl focus:ring-2 focus:ring-[var(--text-accent)] outline-none"
          />
          <div className="flex items-center gap-4 bg-[var(--bg-secondary)] border border-[var(--card-border)] p-4 rounded-2xl">
            <span className="text-sm font-bold whitespace-nowrap">Peso: {newSubjectDiff}</span>
            <input 
              type="range" 
              min="1" 
              max="10"
              value={newSubjectDiff}
              onChange={(e) => setNewSubjectDiff(Number(e.target.value))}
              disabled={subjects.length >= 6}
              className="w-full accent-[var(--text-accent)]"
            />
          </div>
          <button 
            onClick={addSubject}
            disabled={subjects.length >= 6 || !newSubjectName}
            className={`flex items-center justify-center gap-2 font-bold p-4 rounded-2xl transition-all ${
              subjects.length >= 6 
                ? 'bg-red-500/20 text-red-500 cursor-not-allowed'
                : 'bg-[var(--button-bg)] text-white hover:bg-[var(--button-bg-hover)]'
            }`}
          >
            {subjects.length >= 6 ? <AlertCircle size={20} /> : <Plus size={20} />}
            <span>{subjects.length >= 6 ? 'Limite Máximo' : 'Adicionar Matéria'}</span>
          </button>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((sub, idx) => (
          <div key={idx} className="bg-[var(--card-bg)] p-6 rounded-3xl border border-[var(--card-border)] shadow-lg hover:shadow-xl transition-all space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-black">{sub.name}</h3>
                <span className="inline-block bg-[var(--bg-secondary)] text-[var(--text-accent)] text-xs font-black uppercase px-3 py-1 rounded-full mt-1 border border-[var(--card-border)]">
                  Peso {sub.difficulty}/10
                </span>
              </div>
              <button 
                onClick={() => removeSubject(idx)}
                className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                title="Remover Matéria"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {sub.contents.length === 0 ? (
                <p className="text-sm text-[var(--text-secondary)] italic opacity-50">Nenhum tópico adicionado</p>
              ) : (
                sub.contents.map((content, cIdx) => (
                  <div key={cIdx} className="flex justify-between items-center bg-[var(--bg-secondary)] p-3 rounded-xl text-sm border border-[var(--card-border)]">
                    <span className="truncate flex-1 pr-2">{content}</span>
                    <button 
                      onClick={() => removeContent(idx, cIdx)}
                      className="text-[var(--text-secondary)] hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <input 
                type="text"
                placeholder="Novo tópico..."
                value={contentInputs[idx] || ''}
                onChange={(e) => setContentInputs(prev => ({ ...prev, [idx]: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && addContent(idx)}
                className="flex-1 bg-[var(--bg-secondary)] border border-[var(--card-border)] p-3 rounded-xl text-sm focus:ring-2 focus:ring-[var(--text-accent)] outline-none"
              />
              <button 
                onClick={() => addContent(idx)}
                className="p-3 bg-[var(--bg-secondary)] text-[var(--text-accent)] rounded-xl hover:bg-[var(--card-border)] border border-[var(--card-border)]"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Routine Section */}
      <div className="flex flex-col items-center gap-6 pt-8">
        <button 
          onClick={generateRoutine}
          disabled={subjects.length === 0}
          className="bg-[var(--button-bg)] text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-[var(--button-bg-hover)] hover:scale-105 transition-all shadow-2xl flex items-center gap-3 disabled:opacity-50 disabled:scale-100"
        >
          <Sparkles size={24} />
          <span>{routine ? 'Recalcular Rotina Inteligente' : 'Gerar Rotina Semanal'}</span>
        </button>

        {routine && (
          <div className="w-full space-y-6">
            <div className="flex items-center gap-3">
              <Calendar className="text-[var(--text-accent)]" size={32} />
              <h2 className="text-3xl font-black">Seu Plano de Batalha</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {routine.map((day, idx) => (
                <div key={idx} className="bg-[var(--card-bg)] rounded-3xl border border-[var(--card-border)] overflow-hidden shadow-lg">
                  <h3 className="bg-[var(--button-bg)] text-white p-4 font-black text-center uppercase tracking-wider text-sm">
                    {day.day}
                  </h3>
                  <div className="p-4 space-y-3">
                    {day.slots.map((slot, sIdx) => (
                      <div key={sIdx} className="bg-[var(--bg-secondary)] p-4 rounded-2xl border-l-4 border-[var(--button-bg)] space-y-1">
                        <strong className="block text-sm font-black">{slot.subject}</strong>
                        <span className="text-xs text-[var(--text-secondary)] line-clamp-1">{slot.content}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
