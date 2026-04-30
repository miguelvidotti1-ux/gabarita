import { useState } from 'react';
import { Vestibular } from '../types';
import { GraduationCap, BookOpen, FileText, Video, ArrowRight, Sparkles } from 'lucide-react';
import SimuladoPersonalizado from './SimuladoPersonalizado';
import { Question } from '../services/geminiService';

const VESTIBULARES = [
  { id: Vestibular.ENEM, name: 'ENEM', color: 'blue', description: 'Exame Nacional do Ensino Médio. Porta de entrada para universidades federais e ProUni.' },
  { id: Vestibular.FUVEST, name: 'Fuvest', color: 'red', description: 'Vestibular da USP. Um dos mais concorridos e tradicionais do país.' },
  { id: Vestibular.UNICAMP, name: 'Unicamp', color: 'green', description: 'Vestibular da Universidade Estadual de Campinas. Conhecido por questões interdisciplinares.' },
  { id: Vestibular.UNESP, name: 'Unesp', color: 'yellow', description: 'Vestibular da Universidade Estadual Paulista. Abrange diversas cidades do interior de SP.' },
  { id: Vestibular.UERJ, name: 'UERJ', color: 'purple', description: 'Vestibular da Universidade do Estado do Rio de Janeiro. Foco em cidadania e atualidades.' },
  { id: Vestibular.ITA, name: 'ITA', color: 'slate', description: 'Instituto Tecnológico de Aeronáutica. O vestibular de engenharia mais difícil do Brasil.' },
];

export default function Vestibulares({ onSelect, onStartQuiz }: { onSelect: (v: Vestibular) => void, onStartQuiz: (questions: Question[], isFull: boolean, timeLimit?: number) => void }) {
  const [selectedVestibular, setSelectedVestibular] = useState<Vestibular | null>(null);

  if (selectedVestibular) {
    return (
      <div className="space-y-8">
        <button onClick={() => setSelectedVestibular(null)} className="text-blue-600 dark:text-blue-400 font-bold">← Voltar</button>
        <SimuladoPersonalizado vestibular={selectedVestibular} onStartQuiz={onStartQuiz} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">Escolha seu Vestibular</h1>
        <p className="text-slate-500 dark:text-blue-300 text-lg">Selecione o vestibular que você está se preparando para acessar conteúdos específicos, provas e simulados.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {VESTIBULARES.map((v) => (
          <div 
            key={v.id} 
            className="bg-white dark:bg-blue-900 rounded-3xl border dark:border-blue-800 shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col"
          >
            <div className={`bg-${v.color}-600 p-8 text-white flex justify-between items-start`}>
              <GraduationCap size={40} className="opacity-80" />
              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">Vestibular</p>
                <h2 className="text-3xl font-black">{v.name}</h2>
              </div>
            </div>
            
            <div className="p-8 flex-1 flex flex-col">
              <p className="text-slate-600 dark:text-blue-200 mb-8 leading-relaxed">{v.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-2 text-slate-500 dark:text-blue-300 text-sm">
                  <FileText size={16} />
                  <span>8 Provas</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-blue-300 text-sm">
                  <BookOpen size={16} />
                  <span>200+ Questões</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-blue-300 text-sm">
                  <Video size={16} />
                  <span>Aulas em Vídeo</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-auto">
                <button 
                  onClick={() => onSelect(v.id)}
                  className={`
                    w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all
                    bg-${v.color}-50 dark:bg-${v.color}-900/20 text-${v.color}-600 dark:text-${v.color}-400 hover:bg-${v.color}-600 hover:text-white dark:hover:bg-${v.color}-600 dark:hover:text-white
                  `}
                >
                  <span>Explorar {v.name}</span>
                  <ArrowRight size={18} />
                </button>
                <button 
                  onClick={() => setSelectedVestibular(v.id)}
                  className={`
                    w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all
                    bg-blue-600 text-white hover:bg-blue-700
                  `}
                >
                  <Sparkles size={18} />
                  <span>Simulado Personalizado</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
