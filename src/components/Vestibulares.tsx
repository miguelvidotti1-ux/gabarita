import { useState, useEffect } from 'react';
import { Vestibular } from '../types';
import { GraduationCap, BookOpen, FileText, Video, ArrowRight, Sparkles, Lock, CheckCircle2, Library, Trophy, Zap, Star } from 'lucide-react';
import SimuladoPersonalizado from './SimuladoPersonalizado';
import ExamAcervoModal from './ExamAcervoModal';
import { Question } from '../services/geminiService';
import { levelSystem } from '../services/levelService';
import { motion } from 'motion/react';

const VESTIBULARES = [
  { id: Vestibular.ENEM, name: 'ENEM', color: 'from-blue-600/20 via-blue-900/40 to-slate-950', badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30', description: 'Exame Nacional do Ensino Médio. Porta de entrada para universidades federais (SiSU), ProUni e FIES.' },
  { id: Vestibular.FUVEST, name: 'Fuvest', color: 'from-rose-600/20 via-red-950 to-slate-950', badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30', description: 'Vestibular oficial da Universidade de São Paulo (USP). Um dos mais concorridos e tradicionais do país.' },
  { id: Vestibular.UNICAMP, name: 'Unicamp', color: 'from-emerald-600/20 via-emerald-950 to-slate-950', badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', description: 'Vestibular da Universidade Estadual de Campinas. Renomado por questões críticas e interdisciplinares.' },
  { id: Vestibular.UNESP, name: 'Unesp', color: 'from-amber-600/20 via-amber-950 to-slate-950', badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30', description: 'Vestibular da Universidade Estadual Paulista. Ampla cobertura nos campi do interior de SP.' },
  { id: Vestibular.UERJ, name: 'UERJ', color: 'from-purple-600/20 via-purple-950 to-slate-950', badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30', description: 'Universidade do Estado do Rio de Janeiro. Exame de qualificação com forte foco em cidadania e atualidades.' },
  { id: Vestibular.ITA, name: 'ITA', color: 'from-blue-600/20 via-blue-900/40 to-slate-950', badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30', description: 'Instituto Tecnológico de Aeronáutica. Referência máxima em ciências exatas e engenharia aeroespacial.' },
  { id: Vestibular.FGV, name: 'FGV', color: 'from-orange-600/20 via-orange-950 to-slate-950', badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/30', description: 'Fundação Getulio Vargas. Excelência em economia, administração pública e direito.' },
  { id: Vestibular.MACKENZIE, name: 'Mackenzie', color: 'from-red-600/20 via-rose-950 to-slate-950', badgeColor: 'bg-red-500/10 text-red-400 border-red-500/30', description: 'Universidade Presbiteriana Mackenzie. Tradição histórica em arquitetura, direito e tecnologia.' },
  { id: Vestibular.UNIFESP, name: 'UNIFESP', color: 'from-teal-600/20 via-teal-950 to-slate-950', badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/30', description: 'Universidade Federal de São Paulo. Destaque nacional e internacional na área médica e de saúde.' },
  { id: Vestibular.ANHEMBI_MORUMBI, name: 'Anhembi Morumbi', color: 'from-cyan-600/20 via-cyan-950 to-slate-950', badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30', description: 'Universidade Anhembi Morumbi. Inovação, metodologia ativa e conexão com o mercado global.' },
  { id: Vestibular.ESTACIO, name: 'Estácio de Sá', color: 'from-blue-600/20 via-blue-950 to-slate-950', badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30', description: 'Universidade Estácio de Sá. Ampla capilaridade e cursos focados na prática profissional.' },
  { id: Vestibular.UNISINOS, name: 'Unisinos', color: 'from-emerald-600/20 via-teal-950 to-slate-950', badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', description: 'Universidade do Vale do Rio dos Sinos. Destaque em tecnologia, pesquisa e inovação no Sul.' },
];

export default function Vestibulares({ onSelect, onStartQuiz }: { onSelect: (v: Vestibular) => void, onStartQuiz: (questions: Question[], isFull: boolean, timeLimit?: number) => void }) {
  const [selectedVestibular, setSelectedVestibular] = useState<Vestibular | null>(null);
  const [selectedAcervoVestibular, setSelectedAcervoVestibular] = useState<string | null>(null);
  const [currentVestibular, setCurrentVestibular] = useState<string | null>(localStorage.getItem('vestibular_active') || Vestibular.ENEM);
  const [userXP, setUserXP] = useState(levelSystem.getStatus().global.xp);

  useEffect(() => {
    localStorage.setItem('vestibular_active', currentVestibular || '');
    setUserXP(levelSystem.getStatus().global.xp);
  }, [currentVestibular]);

  const handleSelect = (v: Vestibular) => {
    setCurrentVestibular(v);
    onSelect(v);
  };

  if (selectedVestibular) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
        <button 
          onClick={() => setSelectedVestibular(null)} 
          className="group flex items-center gap-2 text-[var(--primary)] font-bold hover:translate-x-[-4px] transition-transform cursor-pointer px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-[var(--primary)] w-fit"
        >
          <ArrowRight size={18} className="rotate-180" />
          <span>Voltar para Lista de Vestibulares</span>
        </button>
        <SimuladoPersonalizado vestibular={selectedVestibular} onStartQuiz={onStartQuiz} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-7 sm:p-9 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)]">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-[var(--bg-badge)] text-[var(--primary)] px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-[var(--primary-border)]">
            <BookOpen size={14} />
            <span>Catálogo Completo de Provas</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)] tracking-tight">
            Escolha seu Vestibular de Foco
          </h1>
          <p className="text-[var(--text-muted)] text-sm sm:text-base leading-relaxed">
            Todas as bancas examinadoras estão liberadas com acesso ilimitado a simulados adaptativos, cadernos de questões reais e provas oficiais completas.
          </p>
        </div>
        
        <div className="bg-[var(--bg-hover)] p-5 px-6 rounded-2xl border border-[var(--border-light)] text-center shrink-0 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Star size={24} />
          </div>
          <div className="text-left">
            <p className="text-[11px] font-bold text-[var(--text-label)] uppercase tracking-wider">Seu XP Total</p>
            <p className="text-2xl font-extrabold text-amber-400">{userXP.toLocaleString()} XP</p>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {VESTIBULARES.map((v, i) => {
          const isActive = currentVestibular === v.id;

          return (
            <motion.div 
              key={v.id} 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className={`group relative bg-[var(--bg-card)] rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col hover:shadow-2xl hover:border-[var(--primary)] hover:-translate-y-1
                ${isActive ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]/20 shadow-lg shadow-[var(--shadow-primary)]' : 'border-[var(--border-light)]'}
              `}
            >
              {/* Header Visual with Subtle Gradient */}
              <div className={`bg-gradient-to-br ${v.color} p-6 border-b border-[var(--border-light)] relative overflow-hidden`}>
                <div className="relative z-10 flex justify-between items-start">
                  <div className="w-12 h-12 rounded-xl bg-[var(--bg-card)]/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-[var(--text-main)] shadow-sm">
                    <GraduationCap size={26} />
                  </div>
                  <div className="text-right flex flex-col items-end gap-1.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${v.badgeColor}`}>
                      {isActive ? '✓ Foco Ativo' : 'Liberado'}
                    </span>
                    <h2 className="text-2xl font-extrabold text-[var(--text-main)]">{v.name}</h2>
                  </div>
                </div>
              </div>
              
              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <p className="text-[var(--text-muted)] text-sm leading-relaxed line-clamp-3">
                    {v.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold rounded-lg">
                      100% Gratuito
                    </span>
                    {isActive && (
                      <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-semibold rounded-lg">
                        Exame Principal
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2.5 pt-2">
                  <button 
                    onClick={() => handleSelect(v.id as Vestibular)}
                    className={`w-full py-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border
                      ${isActive 
                        ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-md shadow-[var(--shadow-primary)]' 
                        : 'bg-[var(--bg-hover)] text-[var(--text-muted)] border-[var(--border-light)] hover:bg-[var(--border-color)] hover:text-[var(--text-main)]'
                      }
                    `}
                  >
                    {isActive ? <CheckCircle2 size={16} /> : <BookOpen size={16} />}
                    <span>{isActive ? 'Vestibular Ativo' : 'Definir como Foco'}</span>
                  </button>
                  
                  <button 
                    onClick={() => setSelectedVestibular(v.id as Vestibular)}
                    className="w-full py-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-md shadow-[var(--shadow-primary)] cursor-pointer hover:-translate-y-0.5"
                  >
                    <Sparkles size={16} />
                    <span>Gerar Simulado</span>
                  </button>
                  
                  {['ENEM', 'Fuvest', 'Unicamp', 'Unesp', 'ITA'].includes(v.name) && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAcervoVestibular(v.name);
                      }}
                      className="w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all bg-[var(--bg-hover)] text-[var(--text-muted)] border border-[var(--border-light)] hover:border-[var(--primary-border)] hover:text-[var(--primary)] cursor-pointer"
                    >
                      <Library size={15} />
                      <span>Provas Anteriores (18 anos)</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
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
