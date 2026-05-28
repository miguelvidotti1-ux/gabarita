import React, { useState } from 'react';
import { X, ExternalLink, Library, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PROVAS_LINKS } from '../data/provas_links';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  targetVestibular: string | null;
}

const DATABASE: Record<string, { year: string; size: string }[]> = {
  ENEM: Array.from({ length: 16 }, (_, i) => ({ year: (2025 - i).toString(), size: `${(2 + Math.random()).toFixed(1)} MB` })),
  USP: Array.from({ length: 16 }, (_, i) => ({ year: (2025 - i).toString(), size: `${(2 + Math.random()).toFixed(1)} MB` })),
  Fuvest: Array.from({ length: 17 }, (_, i) => ({ year: (2026 - i).toString(), size: `${(3 + Math.random()).toFixed(1)} MB` })),
  Unicamp: Array.from({ length: 16 }, (_, i) => ({ year: (2025 - i).toString(), size: `${(2 + Math.random()).toFixed(1)} MB` })),
  Unesp: Array.from({ length: 16 }, (_, i) => ({ year: (2025 - i).toString(), size: `${(2.5 + Math.random()).toFixed(1)} MB` })),
};

const getExamLink = (vest: string, year: string, day?: string, color?: string) => {
  if (vest.toUpperCase() === 'ENEM' && day && color) {
    const key = `ENEM_${year}_${day}_${color}`;
    if (PROVAS_LINKS[key]) {
      return PROVAS_LINKS[key];
    }
    // Predictable fallback Inep format when possible, else fallback to search
    const cdMapDay1: Record<string, string> = { 'Azul': 'CD1', 'Amarelo': 'CD2', 'Branco': 'CD3', 'Verde': 'CD4' };
    const cdMapDay2: Record<string, string> = { 'Amarelo': 'CD5', 'Cinza': 'CD6', 'Azul': 'CD7', 'Verde': 'CD8' };
    
    if (year === '2025' || year === '2024') {
      const cd = day === '1' ? cdMapDay1[color] : cdMapDay2[color];
      if (cd) {
        return `https://download.inep.gov.br/enem/provas_e_gabaritos/${year}_PV_impresso_D${day}_${cd}.pdf`;
      }
    }
    return `https://www.google.com/search?q=prova+enem+${year}+dia+${day}+caderno+${color.toLowerCase()}+pdf`;
  }
  
  if (vest.toLowerCase() === 'fuvest' && year === '2025-dia1-V1') {
    return 'https://www.fuvest.br/wp-content/uploads/fuvest2025_primeira_fase_prova_V1.pdf';
  }
  if (vest.toLowerCase() === 'fuvest' && year === '2025-dia1-V2') {
    return 'https://www.fuvest.br/wp-content/uploads/fuvest2025_primeira_fase_prova_V2.pdf';
  }
  if (vest.toLowerCase() === 'fuvest' && year === '2025-dia1-V3') {
    return 'https://www.fuvest.br/wp-content/uploads/fuvest2025_primeira_fase_prova_V3.pdf';
  }
  if (vest.toLowerCase() === 'fuvest' && year === '2026-dia1-V1') {
    return 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase1-prova-V1.pdf';
  }
  if (vest.toLowerCase() === 'fuvest' && year === '2026-dia1-V2') {
    return 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase1-prova-V2.pdf';
  }
  if (vest.toLowerCase() === 'fuvest' && year === '2026-dia1-V3') {
    return 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase1-prova-V3.pdf';
  }
  if (vest.toLowerCase() === 'fuvest' && year === '2026-dia1-V4') {
    return 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase1-prova-V4.pdf';
  }
  return `https://www.google.com/search?q=prova+${vest.toLowerCase()}+${year}+pdf`;
};

export default function ExamAcervoModal({ isOpen, onClose, targetVestibular }: Props) {
  const [expandedEnemYear, setExpandedEnemYear] = useState<string | null>(null);
  const [expandedFuvestYear, setExpandedFuvestYear] = useState<string | null>(null);
  const [expandedFuvestDay, setExpandedFuvestDay] = useState<string | null>(null);

  const filteredDatabase = targetVestibular 
    ? { [targetVestibular]: DATABASE[targetVestibular] || [] }
    : DATABASE;

  const handleClose = () => {
    setExpandedEnemYear(null);
    setExpandedFuvestYear(null);
    setExpandedFuvestDay(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-6 md:p-8 border-b border-[var(--card-border)] flex justify-between items-center bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--card-bg)]">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-2xl text-white shadow-xl">
                  <Library size={28} />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-[var(--text-primary)]">Acervo de Provas</h2>
                  <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">
                    {targetVestibular 
                      ? `${targetVestibular} — ${DATABASE[targetVestibular]?.length || 16} Anos` 
                      : 'Acervo Histórico'}
                  </p>
                </div>
              </div>
              <button 
                onClick={handleClose}
                className="p-3 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 text-[var(--text-secondary)] shadow-sm hover:shadow-lg hover:shadow-red-500/20"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-12 custom-scrollbar">
              {Object.entries(filteredDatabase).map(([vest, items]) => (
                <div key={vest} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="px-4 py-1.5 bg-[var(--text-accent)] text-white text-sm font-black rounded-lg shadow-lg shadow-[var(--text-accent)]/20">
                      {vest}
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-[var(--card-border)] to-transparent" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map(item => {
                      const isEnem = vest === 'ENEM';
                      const isFuvest = vest === 'Fuvest';
                      
                      const isEnemExpanded = expandedEnemYear === item.year;
                      const isFuvestExpanded = expandedFuvestYear === item.year;

                      if (isEnem) {
                        return (
                          <div key={`${vest}-${item.year}`} className="flex flex-col gap-2">
                            <button
                              onClick={() => setExpandedEnemYear(isEnemExpanded ? null : item.year)}
                              className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                                isEnemExpanded 
                                  ? 'bg-[var(--text-accent)] border-[var(--text-accent)] shadow-lg text-white' 
                                  : 'bg-[var(--bg-secondary)] border-[var(--card-border)] hover:bg-white dark:hover:bg-[var(--card-border)] hover:border-[var(--text-accent)] text-[var(--text-primary)]'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <span className={`w-12 h-12 flex items-center justify-center rounded-xl font-black text-sm shadow-md transition-all ${
                                  isEnemExpanded ? 'bg-white/20 text-white' : 'bg-gradient-to-br from-[#00b894] to-[#00cec9] text-white'
                                }`}>
                                  {item.year.slice(2)}
                                </span>
                                <div className="flex flex-col items-start">
                                  <span className="text-sm font-black">{vest} {item.year}</span>
                                  <span className={`text-[10px] font-bold ${isEnemExpanded ? 'text-white/80' : 'text-[var(--text-secondary)]'}`}>Ver opções de dias</span>
                                </div>
                              </div>
                              <ChevronRight size={20} className={`transition-transform duration-300 ${isEnemExpanded ? 'rotate-90' : ''}`} />
                            </button>

                            <AnimatePresence>
                              {isEnemExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden space-y-4 ml-2 pl-3 border-l-2 border-[var(--text-accent)]/30 mt-1"
                                >
                                  {/* 1º DIA Row */}
                                  <div className="space-y-1.5 text-left">
                                    <div className="flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-accent)]" />
                                      <span className="text-[10px] font-black uppercase text-[var(--text-accent)] tracking-wider">
                                        1º DIA — Linguagens, Humanas e Redação
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      {[
                                        { color: 'Azul', bg: 'hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-500 border-[var(--card-border)] text-[var(--text-primary)]', dot: 'bg-blue-500' },
                                        { color: 'Branco', bg: 'hover:bg-slate-55 dark:hover:bg-slate-900/30 hover:border-slate-400 border-[var(--card-border)] text-[var(--text-primary)]', dot: 'bg-slate-100 border border-slate-400' },
                                        parseInt(item.year, 10) >= 2010 && parseInt(item.year, 10) <= 2023
                                          ? { color: 'Rosa', bg: 'hover:bg-pink-50 dark:hover:bg-pink-950/20 hover:border-pink-500 border-[var(--card-border)] text-[var(--text-primary)]', dot: 'bg-pink-500' }
                                          : { color: 'Verde', bg: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:border-emerald-500 border-[var(--card-border)] text-[var(--text-primary)]', dot: 'bg-emerald-500' },
                                        { color: 'Amarelo', bg: 'hover:bg-amber-50 dark:hover:bg-amber-950/20 hover:border-amber-500 border-[var(--card-border)] text-[var(--text-primary)]', dot: 'bg-yellow-400' }
                                      ].map((btn) => (
                                        <a
                                          key={`d1-${btn.color}`}
                                          href={getExamLink(vest, item.year, "1", btn.color)}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className={`flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-secondary)] border text-xs font-bold transition-all active:scale-95 duration-200 group/btn ${btn.bg}`}
                                        >
                                          <div className="flex items-center gap-2">
                                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${btn.dot}`} />
                                            <span>Caderno {btn.color}</span>
                                          </div>
                                          <ExternalLink size={10} className="opacity-40 group-hover/btn:opacity-100 transition-opacity" />
                                        </a>
                                      ))}
                                    </div>
                                  </div>

                                  {/* 2º DIA Row */}
                                  <div className="space-y-1.5 text-left">
                                    <div className="flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                                      <span className="text-[10px] font-black uppercase text-violet-500 dark:text-violet-400 tracking-wider">
                                        2º DIA — Matemática e Natureza
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      {[
                                        { color: 'Amarelo', bg: 'hover:bg-amber-50 dark:hover:bg-amber-950/20 hover:border-amber-500 border-[var(--card-border)] text-[var(--text-primary)]', dot: 'bg-yellow-400' },
                                        { color: 'Cinza', bg: 'hover:bg-gray-50 dark:hover:bg-gray-900/30 hover:border-gray-500 border-[var(--card-border)] text-[var(--text-primary)]', dot: 'bg-gray-400' },
                                        { color: 'Azul', bg: 'hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-500 border-[var(--card-border)] text-[var(--text-primary)]', dot: 'bg-blue-500' },
                                        parseInt(item.year, 10) >= 2010 && parseInt(item.year, 10) <= 2023
                                          ? { color: 'Rosa', bg: 'hover:bg-pink-50 dark:hover:bg-pink-950/20 hover:border-pink-500 border-[var(--card-border)] text-[var(--text-primary)]', dot: 'bg-pink-500' }
                                          : { color: 'Verde', bg: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:border-emerald-500 border-[var(--card-border)] text-[var(--text-primary)]', dot: 'bg-emerald-500' }
                                      ].map((btn) => (
                                        <a
                                          key={`d2-${btn.color}`}
                                          href={getExamLink(vest, item.year, "2", btn.color)}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className={`flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-secondary)] border text-xs font-bold transition-all active:scale-95 duration-200 group/btn ${btn.bg}`}
                                        >
                                          <div className="flex items-center gap-2">
                                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${btn.dot}`} />
                                            <span>Caderno {btn.color}</span>
                                          </div>
                                          <ExternalLink size={10} className="opacity-40 group-hover/btn:opacity-100 transition-opacity" />
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      }

                      if (isFuvest) {
                        return (
                          <div key={`${vest}-${item.year}`} className="flex flex-col gap-2">
                            <button
                              onClick={() => {
                                setExpandedFuvestYear(isFuvestExpanded ? null : item.year);
                                setExpandedFuvestDay(null);
                              }}
                              className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                                isFuvestExpanded 
                                  ? 'bg-[#764ba2] border-[#764ba2] shadow-lg text-white' 
                                  : 'bg-[var(--bg-secondary)] border-[var(--card-border)] hover:bg-white dark:hover:bg-[var(--card-border)] hover:border-[var(--text-accent)] text-[var(--text-primary)]'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <span className={`w-12 h-12 flex items-center justify-center rounded-xl font-black text-sm shadow-md transition-all ${
                                  isFuvestExpanded ? 'bg-white/20 text-white' : 'bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white'
                                }`}>
                                  {item.year.slice(2)}
                                </span>
                                <div className="flex flex-col items-start">
                                  <span className="text-sm font-black">{vest} {item.year}</span>
                                  <span className={`text-[10px] font-bold ${isFuvestExpanded ? 'text-white/80' : 'text-[var(--text-secondary)]'}`}>Ver opções de fases</span>
                                </div>
                              </div>
                              <ChevronRight size={20} className={`transition-transform duration-300 ${isFuvestExpanded ? 'rotate-90' : ''}`} />
                            </button>

                            <AnimatePresence>
                              {isFuvestExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden space-y-3 ml-4"
                                >
                                  {/* Day Selection */}
                                  <div className="grid grid-cols-2 gap-2">
                                    <button
                                      onClick={() => setExpandedFuvestDay(expandedFuvestDay === '1' ? null : '1')}
                                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-black transition-all ${
                                        expandedFuvestDay === '1'
                                          ? 'bg-[var(--text-accent)] border-[var(--text-accent)] text-white'
                                          : 'bg-[var(--bg-secondary)] border-[var(--card-border)] hover:border-[var(--text-accent)]'
                                      }`}
                                    >
                                      <span>1ª FASE</span>
                                      <ChevronRight size={14} className={`transition-transform ${expandedFuvestDay === '1' ? 'rotate-90' : ''}`} />
                                    </button>
                                    <a
                                      href={getExamLink(vest, `${item.year}-dia2`)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--card-border)] hover:border-[var(--text-accent)] text-xs font-black text-[var(--text-primary)] transition-all"
                                    >
                                      <span>2ª FASE</span>
                                      <ExternalLink size={12} />
                                    </a>
                                  </div>

                                  {/* Version Selection for Day 1 */}
                                  <AnimatePresence>
                                    {expandedFuvestDay === '1' && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden pl-2 border-l-2 border-[var(--text-accent)]/30 space-y-2"
                                      >
                                        <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase px-1">Escolha a versão:</p>
                                        <div className="grid grid-cols-4 gap-2">
                                          {['V1', 'V2', 'V3', 'V4'].map(version => (
                                            <a
                                              key={version}
                                              href={getExamLink(vest, `${item.year}-dia1-${version}`)}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="flex items-center justify-center p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--card-border)] hover:bg-[var(--text-accent)] hover:text-white text-[10px] font-black transition-all"
                                            >
                                              {version}
                                            </a>
                                          ))}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      }

                      return (
                        <a
                          key={`${vest}-${item.year}`}
                          href={getExamLink(vest, item.year)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center justify-between p-4 rounded-2xl border border-[var(--card-border)] bg-[var(--bg-secondary)] hover:bg-white dark:hover:bg-[var(--card-border)] hover:border-[var(--text-accent)] hover:shadow-xl hover:shadow-[var(--text-accent)]/10 transition-all duration-300"
                        >
                          <div className="flex items-center gap-4">
                            <span className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#00b894] to-[#00cec9] text-white font-black text-sm shadow-md group-hover:scale-110 transition-transform">
                              {item.year.slice(2)}
                            </span>
                            <div className="flex flex-col">
                              <span className="text-sm font-black text-[var(--text-primary)]">{vest} {item.year}</span>
                              <span className="text-[10px] font-bold text-[var(--text-secondary)]">{item.size} • PDF Oficial</span>
                            </div>
                          </div>
                          <div className="p-2 rounded-lg bg-[var(--card-border)] text-[var(--text-accent)] group-hover:bg-[var(--text-accent)] group-hover:text-white transition-all">
                            <ExternalLink size={16} />
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
