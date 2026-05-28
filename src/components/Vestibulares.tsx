import { useState, useEffect } from 'react';
import { Vestibular } from '../types';
import { GraduationCap, BookOpen, FileText, Video, ArrowRight, Sparkles, Lock, CheckCircle2, Library } from 'lucide-react';
import SimuladoPersonalizado from './SimuladoPersonalizado';
import ExamAcervoModal from './ExamAcervoModal';
import { Question } from '../services/geminiService';
import { levelSystem } from '../services/levelService';

const XP_COST = 150;

const VESTIBULARES = [
  { id: Vestibular.ENEM, name: 'ENEM', color: 'from-blue-600 to-blue-800', description: 'Exame Nacional do Ensino Médio. Porta de entrada para universidades federais e ProUni.' },
  { id: Vestibular.FUVEST, name: 'Fuvest', color: 'from-red-600 to-red-800', description: 'Vestibular da USP. Um dos mais concorridos e tradicionais do país.' },
  { id: Vestibular.UNICAMP, name: 'Unicamp', color: 'from-green-600 to-green-800', description: 'Vestibular da Universidade Estadual de Campinas. Conhecido por questões interdisciplinares.' },
  { id: Vestibular.UNESP, name: 'Unesp', color: 'from-yellow-600 to-yellow-800', description: 'Vestibular da Universidade Estadual Paulista. Abrange diversas cidades do interior de SP.' },
  { id: Vestibular.UERJ, name: 'UERJ', color: 'from-purple-600 to-purple-800', description: 'Vestibular da Universidade do Estado do Rio de Janeiro. Foco em cidadania e atualidades.' },
  { id: Vestibular.ITA, name: 'ITA', color: 'from-slate-600 to-slate-800', description: 'Instituto Tecnológico de Aeronáutica. O vestibular de engenharia mais difícil do Brasil.' },
  { id: Vestibular.FGV, name: 'FGV', color: 'from-orange-600 to-orange-800', description: 'Fundação Getulio Vargas. Excelência em administração, economia e direito.' },
  { id: Vestibular.MACKENZIE, name: 'Mackenzie', color: 'from-rose-600 to-rose-800', description: 'Universidade Presbiteriana Mackenzie. Referência em diversas áreas do conhecimento.' },
  { id: Vestibular.PUC_SP, name: 'PUC-SP', color: 'from-sky-600 to-sky-800', description: 'Pontifícia Universidade Católica de SP. Tradição e qualidade acadêmica.' },
  { id: Vestibular.UNIFESP, name: 'UNIFESP', color: 'from-emerald-600 to-emerald-800', description: 'Universidade Federal de São Paulo. Destaque nas áreas da saúde e medicina.' },
  { id: Vestibular.ANHEMBI_MORUMBI, name: 'Anhembi Morumbi', color: 'from-indigo-600 to-indigo-800', description: 'Universidade Anhembi Morumbi. Inovação e conexão com o mercado de trabalho.' },
  { id: Vestibular.ESTACIO, name: 'Estácio de Sá', color: 'from-cyan-600 to-cyan-800', description: 'Universidade Estácio de Sá. Ampla capilaridade e foco na carreira.' },
  { id: Vestibular.UNISINOS, name: 'Unisinos', color: 'from-teal-600 to-teal-800', description: 'Universidade do Vale do Rio dos Sinos. Referência em pesquisa e tecnologia.' },
];

export default function Vestibulares({ onSelect, onStartQuiz }: { onSelect: (v: Vestibular) => void, onStartQuiz: (questions: Question[], isFull: boolean, timeLimit?: number) => void }) {
  const [selectedVestibular, setSelectedVestibular] = useState<Vestibular | null>(null);
  const [selectedAcervoVestibular, setSelectedAcervoVestibular] = useState<string | null>(null);
  const [firstChoiceMade, setFirstChoiceMade] = useState<boolean>(localStorage.getItem('vestibular_firstChoiceMade') === 'true');
  const [currentVestibular, setCurrentVestibular] = useState<string | null>(localStorage.getItem('vestibular_active'));
  const [unlocked, setUnlocked] = useState<string[]>(JSON.parse(localStorage.getItem('vestibular_unlocked') || '[]'));
  const [userXP, setUserXP] = useState(levelSystem.getStatus().global.xp);

  useEffect(() => {
    localStorage.setItem('vestibular_firstChoiceMade', firstChoiceMade.toString());
    localStorage.setItem('vestibular_active', currentVestibular || '');
    localStorage.setItem('vestibular_unlocked', JSON.stringify(unlocked));
    
    // Update local XP state whenever unlocked changes or on mount
    setUserXP(levelSystem.getStatus().global.xp);
  }, [unlocked, firstChoiceMade, currentVestibular]);

  const handleSelect = (v: Vestibular) => {
    if (!firstChoiceMade) {
      setFirstChoiceMade(true);
      const newUnlocked = [v];
      setUnlocked(newUnlocked);
      setCurrentVestibular(v);
    } else if (unlocked.includes(v)) {
      setCurrentVestibular(v);
    }
    // We don't call onSelect(v) immediately if we want to stay in the menu, 
    // but the snippet says "this.render()" which means it updates the UI.
    // However, the app usually transitions to a specific view when onSelect is called.
    // Let's call it to keep existing app behavior if that's what was intended.
    onSelect(v);
  };

  const handleUnlock = (vestId: string, vestName: string) => {
    if (levelSystem.spendXP(XP_COST)) {
       setUnlocked(prev => [...new Set([...prev, vestId])]);
       setCurrentVestibular(vestId);
       setUserXP(levelSystem.getStatus().global.xp);
       alert(`${vestName} desbloqueado com sucesso!`);
    } else {
       alert(`XP insuficiente! Você precisa de ${XP_COST} XP.`);
    }
  };

  const isUnlocked = (vestId: string) => unlocked.includes(vestId);
  
  if (selectedVestibular) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button 
          onClick={() => setSelectedVestibular(null)} 
          className="group flex items-center gap-2 text-[var(--text-accent)] font-black hover:translate-x-[-4px] transition-transform"
        >
          <ArrowRight size={20} className="rotate-180" />
          <span>Voltar para Lista</span>
        </button>
        <SimuladoPersonalizado vestibular={selectedVestibular} onStartQuiz={onStartQuiz} />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex justify-between items-center">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-[var(--bg-secondary)] text-[var(--text-accent)] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-[var(--card-border)]">
            <BookOpen size={14} />
            <span>{firstChoiceMade ? 'Seletor de Foco' : 'Início de Jornada'}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] leading-tight">
            {!firstChoiceMade 
              ? 'Escolha seu primeiro ' 
              : 'Selecione seu '
            }
            <span className="text-[var(--text-accent)] underline decoration-wavy decoration-2">
              {!firstChoiceMade ? 'Vestibular Grátis' : 'Vestibular Ativo'}
            </span>
          </h1>
        </div>
        <div className="bg-[var(--card-bg)] p-6 rounded-3xl border border-[var(--card-border)] shadow-lg text-center">
          <p className="text-xs font-black text-[var(--text-secondary)] uppercase">Seu XP</p>
          <p className="text-3xl font-black text-[var(--text-accent)]">⭐ {userXP.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {VESTIBULARES.map((v) => {
          const isUnlocked = unlocked.includes(v.id);
          const locked = firstChoiceMade && !isUnlocked;
          const isActive = currentVestibular === v.id;
          const isFreeOption = !firstChoiceMade;

          return (
            <div 
              key={v.id} 
              className={`group relative bg-[var(--card-bg)] rounded-[2.5rem] border transition-all duration-500 overflow-hidden flex flex-col
                ${locked ? 'opacity-80 grayscale-[0.5]' : 'hover:shadow-2xl hover:shadow-[var(--text-accent)]/10 hover:-translate-y-2'}
                ${isActive ? 'border-[var(--text-accent)] shadow-lg ring-2 ring-[var(--text-accent)]/20' : 'border-[var(--card-border)]'}
              `}
            >
              <div className={`bg-gradient-to-br ${v.color} p-8 text-white relative overflow-hidden`}>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-black/5 rounded-full blur-xl" />
                
                <div className="relative z-10 flex justify-between items-start">
                  <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                    <GraduationCap size={32} />
                  </div>
                  <div className="text-right">
                    <div className="flex flex-col items-end">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-1">
                        {isActive ? '✓ Ativo' : isUnlocked ? 'Desbloqueado' : isFreeOption ? 'Grátis' : 'Bloqueado'}
                      </p>
                      <h2 className="text-3xl font-black">{v.name}</h2>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col space-y-6">
                <div className="space-y-2">
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed line-clamp-3">
                    {v.description}
                  </p>
                  {isFreeOption && <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-bold rounded-md uppercase tracking-wider animate-pulse">Escolha Inicial Grátis</span>}
                  {isActive && <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-md uppercase tracking-wider">Foco Principal</span>}
                </div>
                
                <div className="flex flex-col gap-3 pt-4 mt-auto">
                {locked ? (
                    <button 
                      onClick={() => handleUnlock(v.id, v.name)}
                      disabled={userXP < XP_COST}
                      className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--card-border)] hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                    >
                      <Lock size={18} className="group-hover/btn:animate-bounce" />
                      <span>Desbloquear ({XP_COST} XP)</span>
                    </button>
                ) : (
                  <>
                    <button 
                      onClick={() => handleSelect(v.id as Vestibular)}
                      className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all border
                        ${isActive 
                          ? 'bg-[var(--text-accent)] text-white border-[var(--text-accent)] shadow-lg' 
                          : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-[var(--card-border)] hover:bg-[var(--text-accent)] hover:text-white hover:border-[var(--text-accent)]'
                        }
                      `}
                    >
                      {isActive ? <CheckCircle2 size={18} /> : <BookOpen size={18} />}
                      <span>{isActive ? 'Ativo no Momento' : isFreeOption ? 'Começar Grátis' : 'Ativar Estudo'}</span>
                    </button>
                    {isUnlocked && (
                      <>
                        <button 
                          onClick={() => setSelectedVestibular(v.id)}
                          className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all bg-[var(--button-bg)] text-white hover:bg-[var(--button-bg-hover)] shadow-lg shadow-[var(--button-bg)]/20"
                        >
                          <Sparkles size={18} />
                          <span>Fazer Simulado</span>
                        </button>
                        {['ENEM', 'Fuvest', 'Unicamp', 'Unesp', 'USP'].includes(v.name) && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAcervoVestibular(v.name);
                            }}
                            className="w-full py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all bg-[var(--bg-secondary)] text-[var(--text-accent)] border border-[var(--text-accent)] hover:bg-[var(--text-accent)] hover:text-white"
                          >
                            <Library size={16} />
                            <span>📚 Ver Provas ({v.name === 'Fuvest' ? '17' : '16'} anos)</span>
                          </button>
                        )}
                      </>
                    )}
                  </>
                )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ExamAcervoModal 
        isOpen={selectedAcervoVestibular !== null} 
        onClose={() => setSelectedAcervoVestibular(null)} 
        targetVestibular={selectedAcervoVestibular}
      />
    </div>
  );
}
