import React, { useState } from 'react';
import { X, ExternalLink, Library, ChevronRight, FileText } from 'lucide-react';
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
  ITA: Array.from({ length: 18 }, (_, i) => ({ year: (2026 - i).toString(), size: `${(3.2 + ((i * 3) % 10) * 0.15).toFixed(1)} MB` })),
};

export const getItaExamLink = (
  year: string,
  fase?: '1' | '2' | 'unica' | 'gabarito',
  materia?: string
): string => {
  const y = parseInt(year, 10);
  if (fase === 'gabarito' || materia?.toLowerCase() === 'gabarito') {
    const keyGab = `ITA_${year}_Gabarito`;
    if (PROVAS_LINKS[keyGab]) return PROVAS_LINKS[keyGab];
    const keyUnicaGab = `ITA_${year}_unica_Gabarito`;
    if (PROVAS_LINKS[keyUnicaGab]) return PROVAS_LINKS[keyUnicaGab];
    return `https://www.vestibular.ita.br/provas/gabarito_${year}.pdf`;
  }
  if (materia) {
    const key2 = `ITA_${year}_2_${materia}`;
    if (PROVAS_LINKS[key2]) return PROVAS_LINKS[key2];
    const keyUnica = `ITA_${year}_unica_${materia}`;
    if (PROVAS_LINKS[keyUnica]) return PROVAS_LINKS[keyUnica];
    const keyDirect = `ITA_${year}_${materia}`;
    if (PROVAS_LINKS[keyDirect]) return PROVAS_LINKS[keyDirect];
  }
  if (y >= 2019) {
    if (fase === '2') {
      if (materia) {
        const matSlug = materia.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return `https://www.vestibular.ita.br/provas/${year}_fase2_${matSlug}.pdf`;
      }
      const key = `ITA_${year}_2_Prova`;
      if (PROVAS_LINKS[key]) return PROVAS_LINKS[key];
      return `https://www.vestibular.ita.br/provas/${year}_fase2.pdf`;
    }
    const key = `ITA_${year}_1_Prova`;
    if (PROVAS_LINKS[key]) return PROVAS_LINKS[key];
    return `https://www.vestibular.ita.br/provas/${year}_fase1.pdf`;
  } else {
    if (materia) {
      const keyUnica = `ITA_${year}_unica_${materia}`;
      if (PROVAS_LINKS[keyUnica]) return PROVAS_LINKS[keyUnica];
      const keyDirect = `ITA_${year}_${materia}`;
      if (PROVAS_LINKS[keyDirect]) return PROVAS_LINKS[keyDirect];
      return `https://www.vestibular.ita.br/provas/matematica_${year}.pdf`;
    }
    const key = `ITA_${year}_unica_Prova`;
    if (PROVAS_LINKS[key]) return PROVAS_LINKS[key];
    return `https://www.vestibular.ita.br/provas/${year}_prova.pdf`;
  }
};

const getExamLink = (vest: string, year: string, day?: string, color?: string) => {
  if (vest.toUpperCase() === 'ITA') {
    return getItaExamLink(year);
  }

  if (vest.toUpperCase() === 'ENEM' && day && color) {
    const key = `ENEM_${year}_${day}_${color}`;
    if (PROVAS_LINKS[key]) {
      return PROVAS_LINKS[key];
    }
    // Predictable fallback Inep format when possible, else fallback to search
    const cdMapDay1: Record<string, string> = { 'Azul': 'CD1', 'Amarelo': 'CD2', 'Branco': 'CD3', 'Verde': 'CD4', 'Rosa': 'CD4' };
    const cdMapDay2: Record<string, string> = { 'Amarelo': 'CD5', 'Cinza': 'CD6', 'Azul': 'CD7', 'Verde': 'CD8', 'Rosa': 'CD8' };
    
    const yearNum = parseInt(year, 10);
    if (yearNum >= 2015 && yearNum <= 2025) {
      const cd = day === '1' ? cdMapDay1[color] : cdMapDay2[color];
      if (cd) {
        return `https://download.inep.gov.br/enem/provas_e_gabaritos/${year}_PV_impresso_D${day}_${cd}.pdf`;
      }
    }
    return `https://www.google.com/search?q=prova+enem+${year}+dia+${day}+caderno+${color.toLowerCase()}+pdf`;
  }
  
  // FUVEST 2025 - 1ª Fase (V1, V2, V3, V4 e Gabarito)
  if (vest.toLowerCase() === 'fuvest' && year === '2025-dia1-V1') {
    return 'https://www.fuvest.br/wp-content/uploads/fuvest2025_primeira_fase_prova_V1.pdf';
  }
  if (vest.toLowerCase() === 'fuvest' && year === '2025-dia1-V2') {
    return 'https://www.fuvest.br/wp-content/uploads/fuvest2025_primeira_fase_prova_V2.pdf';
  }
  if (vest.toLowerCase() === 'fuvest' && year === '2025-dia1-V3') {
    return 'https://www.fuvest.br/wp-content/uploads/fuvest2025_primeira_fase_prova_V3.pdf';
  }
  if (vest.toLowerCase() === 'fuvest' && year === '2025-dia1-V4') {
    return 'https://www.fuvest.br/wp-content/uploads/fuvest2025_primeira_fase_prova_V4.pdf';
  }
  if (vest.toLowerCase() === 'fuvest' && (year === '2025-dia1-gabarito' || year === '2025-fase1-gabarito' || year === '2025-gabarito-1')) {
    return 'https://www.fuvest.br/wp-content/uploads/fuvest2025_gabarito_primeira_fase.pdf';
  }
  // FUVEST 2025 - 2ª Fase (1° Dia, 2° Dia e Guia de Respostas)
  if (vest.toLowerCase() === 'fuvest' && (year === '2025-fase2-dia1' || year === '2025-dia2-1' || year === '2025-dia2' || year === '2025-fase2')) {
    return 'https://www.fuvest.br/wp-content/uploads/fuvest2025_prova_2fase_dia1.pdf';
  }
  if (vest.toLowerCase() === 'fuvest' && (year === '2025-fase2-dia2' || year === '2025-dia2-2')) {
    return 'https://www.fuvest.br/wp-content/uploads/fuvest2025_prova_2fase_dia2.pdf';
  }
  if (vest.toLowerCase() === 'fuvest' && (year === '2025-fase2-guia' || year === '2025-guia-respostas' || year === '2025-fase2-respostas')) {
    return 'https://www.fuvest.br/wp-content/uploads/fuvest_2025_guia_respostas.pdf';
  }
  // FUVEST 2026 - 1ª Fase (V1, V2, V3, V4)
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
  // FUVEST 2ª Fase - 1° Dia (Oficial)
  if (vest.toLowerCase() === 'fuvest' && (year === '2026-fase2-dia1' || year === '2026-dia2-1' || year === '2026-dia2' || year === '2026-fase2')) {
    return 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia1-prova.pdf';
  }
  if (vest.toLowerCase() === 'fuvest' && (year === '2026-fase2-dia2' || year === '2026-dia2-2')) {
    return 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-prova.pdf';
  }
  if (vest.toLowerCase() === 'fuvest' && year.includes('-fase2-dia1')) {
    const y = year.split('-')[0];
    if (y === '2026') {
      return 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia1-prova.pdf';
    }
    if (y === '2025') {
      return 'https://www.fuvest.br/wp-content/uploads/fuvest2025_prova_2fase_dia1.pdf';
    }
    return `https://www.fuvest.br/wp-content/uploads/fuvest${y}_segunda_fase_dia1.pdf`;
  }
  if (vest.toLowerCase() === 'fuvest' && year.includes('-fase2-dia2')) {
    const y = year.split('-')[0];
    if (y === '2026') {
      return 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-prova.pdf';
    }
    if (y === '2025') {
      return 'https://www.fuvest.br/wp-content/uploads/fuvest2025_prova_2fase_dia2.pdf';
    }
    return `https://www.fuvest.br/wp-content/uploads/fuvest${y}_segunda_fase_dia2.pdf`;
  }
  return `https://www.google.com/search?q=prova+${vest.toLowerCase()}+${year}+pdf`;
};

export default function ExamAcervoModal({ isOpen, onClose, targetVestibular }: Props) {
  const [expandedEnemYear, setExpandedEnemYear] = useState<string | null>(null);
  const [expandedFuvestYear, setExpandedFuvestYear] = useState<string | null>(null);
  const [expandedFuvestDay, setExpandedFuvestDay] = useState<string | null>(null);
  const [expandedItaYear, setExpandedItaYear] = useState<string | null>(null);

  const filteredDatabase = targetVestibular 
    ? { [targetVestibular]: DATABASE[targetVestibular] || [] }
    : DATABASE;

  const handleClose = () => {
    setExpandedEnemYear(null);
    setExpandedFuvestYear(null);
    setExpandedFuvestDay(null);
    setExpandedItaYear(null);
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
              {Object.entries(filteredDatabase).map(([vest, items]) => {
                return (
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
                        const isIta = vest.toUpperCase() === 'ITA';
                        const isFuvest = vest === 'Fuvest';
                      
                        const isEnemExpanded = expandedEnemYear === item.year;
                        const isItaExpanded = expandedItaYear === item.year;
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
                                      {(() => {
                                        const buttons = [
                                          { color: 'Azul', bg: 'hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-500 border-[var(--card-border)] text-[var(--text-primary)]', dot: 'bg-blue-500' },
                                          { color: 'Branco', bg: 'hover:bg-slate-50 dark:hover:bg-slate-900/30 hover:border-slate-400 border-[var(--card-border)] text-[var(--text-primary)]', dot: 'bg-slate-100 border border-slate-400' },
                                          parseInt(item.year, 10) >= 2010 && parseInt(item.year, 10) <= 2023
                                            ? { color: 'Rosa', bg: 'hover:bg-pink-50 dark:hover:bg-pink-950/20 hover:border-pink-500 border-[var(--card-border)] text-[var(--text-primary)]', dot: 'bg-pink-500' }
                                            : { color: 'Verde', bg: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:border-emerald-500 border-[var(--card-border)] text-[var(--text-primary)]', dot: 'bg-emerald-500' },
                                          { color: 'Amarelo', bg: 'hover:bg-amber-50 dark:hover:bg-amber-950/20 hover:border-amber-500 border-[var(--card-border)] text-[var(--text-primary)]', dot: 'bg-yellow-400' }
                                        ];
                                        if (PROVAS_LINKS[`ENEM_${item.year}_1_Laranja`]) {
                                          buttons.push({ color: 'Laranja', bg: 'hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:border-orange-500 border-[var(--card-border)] text-[var(--text-primary)]', dot: 'bg-orange-500' });
                                        } else if (PROVAS_LINKS[`ENEM_${item.year}_1_Laranja (Braile)`]) {
                                          buttons.push({ color: 'Laranja (Braile)', bg: 'hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:border-orange-500 border-[var(--card-border)] text-[var(--text-primary)]', dot: 'bg-orange-500' });
                                        }
                                        return buttons;
                                      })().map((btn) => (
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
                                      {(() => {
                                        const buttons = [
                                          { color: 'Amarelo', bg: 'hover:bg-amber-50 dark:hover:bg-amber-950/20 hover:border-amber-500 border-[var(--card-border)] text-[var(--text-primary)]', dot: 'bg-yellow-400' },
                                          { color: 'Cinza', bg: 'hover:bg-gray-50 dark:hover:bg-gray-900/30 hover:border-gray-500 border-[var(--card-border)] text-[var(--text-primary)]', dot: 'bg-gray-400' },
                                          { color: 'Azul', bg: 'hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-500 border-[var(--card-border)] text-[var(--text-primary)]', dot: 'bg-blue-500' },
                                          parseInt(item.year, 10) >= 2010 && parseInt(item.year, 10) <= 2023
                                            ? { color: 'Rosa', bg: 'hover:bg-pink-50 dark:hover:bg-pink-950/20 hover:border-pink-500 border-[var(--card-border)] text-[var(--text-primary)]', dot: 'bg-pink-500' }
                                            : { color: 'Verde', bg: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:border-emerald-500 border-[var(--card-border)] text-[var(--text-primary)]', dot: 'bg-emerald-500' }
                                        ];
                                        if (PROVAS_LINKS[`ENEM_${item.year}_2_Laranja`]) {
                                          buttons.push({ color: 'Laranja', bg: 'hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:border-orange-500 border-[var(--card-border)] text-[var(--text-primary)]', dot: 'bg-orange-500' });
                                        }
                                        return buttons;
                                      })().map((btn) => (
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

                      if (isIta) {
                        const y = parseInt(item.year, 10);
                        const is2Fases = y >= 2019;
                        const is2025or2026 = y === 2025 || y === 2026;

                        return (
                          <div key={`${vest}-${item.year}`} className="flex flex-col gap-2">
                            <button
                              onClick={() => setExpandedItaYear(isItaExpanded ? null : item.year)}
                              className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                                isItaExpanded 
                                  ? 'bg-[var(--text-accent)] border-[var(--text-accent)] shadow-lg text-white' 
                                  : 'bg-[var(--bg-secondary)] border-[var(--card-border)] hover:bg-white dark:hover:bg-[var(--card-border)] hover:border-[var(--text-accent)] text-[var(--text-primary)]'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <span className={`w-12 h-12 flex items-center justify-center rounded-xl font-black text-sm shadow-md transition-all ${
                                  isItaExpanded ? 'bg-white/20 text-white' : 'bg-gradient-to-br from-[#00b894] to-[#00cec9] text-white'
                                }`}>
                                  {item.year.slice(2)}
                                </span>
                                <div className="flex flex-col items-start">
                                  <span className="text-sm font-black">{vest} {item.year}</span>
                                  <span className={`text-[10px] font-bold ${isItaExpanded ? 'text-white/80' : 'text-[var(--text-secondary)]'}`}>
                                    {is2Fases ? 'Ver opções de fases' : (['2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010', '2009'].includes(item.year) ? 'Ver cadernos por matéria' : 'Ver caderno integral')}
                                  </span>
                                </div>
                              </div>
                              <ChevronRight size={20} className={`transition-transform duration-300 ${isItaExpanded ? 'rotate-90' : ''}`} />
                            </button>

                            <AnimatePresence>
                              {isItaExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden space-y-4 ml-2 pl-3 border-l-2 border-[var(--text-accent)]/30 mt-1"
                                >
                                  {is2Fases ? (
                                    <>
                                      {/* 1ª FASE Row */}
                                      <div className="space-y-1.5 text-left">
                                        <div className="flex items-center gap-1.5">
                                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-accent)]" />
                                          <span className="text-[10px] font-black uppercase text-[var(--text-accent)] tracking-wider">
                                            1ª FASE — Prova Objetiva
                                          </span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2">
                                          <a
                                            href={getItaExamLink(item.year, '1')}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--card-border)] hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-500 text-[var(--text-primary)] text-xs font-bold transition-all active:scale-95 duration-200 group/btn"
                                          >
                                            <div className="flex items-center gap-2">
                                              <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-blue-500" />
                                              <span>Caderno 1ª Fase</span>
                                            </div>
                                            <ExternalLink size={10} className="opacity-40 group-hover/btn:opacity-100 transition-opacity" />
                                          </a>
                                        </div>
                                      </div>

                                      {/* 2ª FASE Row */}
                                      <div className="space-y-1.5 text-left">
                                        <div className="flex items-center gap-1.5">
                                          <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                                          <span className="text-[10px] font-black uppercase text-violet-500 dark:text-violet-400 tracking-wider">
                                            2ª FASE — Provas Dissertativas
                                          </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                          {[
                                            { name: 'Matemática', dot: 'bg-amber-400', hover: 'hover:bg-amber-50 dark:hover:bg-amber-950/20 hover:border-amber-500' },
                                            { name: 'Física', dot: 'bg-sky-500', hover: 'hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-500' },
                                            { name: 'Química', dot: 'bg-emerald-500', hover: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:border-emerald-500' },
                                            ...(is2025or2026 ? [{ name: 'Português', dot: 'bg-purple-500', hover: 'hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:border-purple-500' }] : []),
                                          ].map((m) => (
                                            <a
                                              key={`ita-${item.year}-f2-${m.name}`}
                                              href={getItaExamLink(item.year, '2', m.name)}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className={`flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--card-border)] ${m.hover} text-[var(--text-primary)] text-xs font-bold transition-all active:scale-95 duration-200 group/btn`}
                                            >
                                              <div className="flex items-center gap-2 truncate">
                                                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${m.dot}`} />
                                                <span className="truncate">Caderno {m.name}</span>
                                              </div>
                                              <ExternalLink size={10} className="opacity-40 group-hover/btn:opacity-100 transition-opacity shrink-0 ml-1" />
                                            </a>
                                          ))}
                                        </div>
                                      </div>
                                    </>
                                  ) : (['2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010', '2009'].includes(item.year)) ? (
                                    <div className="space-y-3 text-left">
                                      <div className="space-y-1.5">
                                        <div className="flex items-center gap-1.5">
                                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                                          <span className="text-[10px] font-black uppercase text-cyan-500 tracking-wider">
                                            PROVAS POR MATÉRIA ({item.year})
                                          </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                          {[
                                            { name: 'Física', dot: 'bg-sky-500', hover: 'hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-500' },
                                            { name: 'Português', dot: 'bg-purple-500', hover: 'hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:border-purple-500' },
                                            { name: 'Inglês', dot: 'bg-rose-500', hover: 'hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:border-rose-500' },
                                            { name: 'Matemática', dot: 'bg-amber-400', hover: 'hover:bg-amber-50 dark:hover:bg-amber-950/20 hover:border-amber-500' },
                                            { name: 'Química', dot: 'bg-emerald-500', hover: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:border-emerald-500' },
                                          ].map((m) => (
                                            <a
                                              key={`ita-${item.year}-${m.name}`}
                                              href={getItaExamLink(item.year, 'unica', m.name)}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className={`flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--card-border)] ${m.hover} text-[var(--text-primary)] text-xs font-bold transition-all active:scale-95 duration-200 group/btn`}
                                            >
                                              <div className="flex items-center gap-2 truncate">
                                                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${m.dot}`} />
                                                <span className="truncate">Caderno {m.name}</span>
                                              </div>
                                              <ExternalLink size={10} className="opacity-40 group-hover/btn:opacity-100 transition-opacity shrink-0 ml-1" />
                                            </a>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Gabarito Oficial */}
                                      {['2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010', '2009'].includes(item.year) && (
                                        <div className="space-y-1.5 pt-2 border-t border-[var(--card-border)]">
                                          <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <span className="text-[10px] font-black uppercase text-emerald-500 tracking-wider">
                                              GABARITO OFICIAL ({item.year})
                                            </span>
                                          </div>
                                          <a
                                            href={getItaExamLink(item.year, 'gabarito')}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all active:scale-95 duration-200 group/btn"
                                          >
                                            <div className="flex items-center gap-2 truncate">
                                              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                              <span className="truncate font-black">Gabarito Oficial ITA {item.year} (PDF)</span>
                                            </div>
                                            <ExternalLink size={10} className="opacity-70 group-hover/btn:opacity-100 transition-opacity shrink-0 ml-1" />
                                          </a>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="space-y-1.5 text-left">
                                      <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span className="text-[10px] font-black uppercase text-emerald-500 tracking-wider">
                                          PROVA ÚNICA — Formato Clássico
                                        </span>
                                      </div>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <a
                                          href={getItaExamLink(item.year, 'unica')}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--card-border)] hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:border-emerald-500 text-[var(--text-primary)] text-xs font-bold transition-all active:scale-95 duration-200 group/btn"
                                        >
                                          <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-emerald-500" />
                                            <span>Caderno Integral (PDF)</span>
                                          </div>
                                          <ExternalLink size={10} className="opacity-40 group-hover/btn:opacity-100 transition-opacity" />
                                        </a>
                                        {(item.year === '2018' || item.year === '2017') && (
                                          <a
                                            href={getItaExamLink(item.year, 'unica', 'Matemática')}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--card-border)] hover:bg-amber-50 dark:hover:bg-amber-950/20 hover:border-amber-500 text-[var(--text-primary)] text-xs font-bold transition-all active:scale-95 duration-200 group/btn"
                                          >
                                            <div className="flex items-center gap-2 truncate">
                                              <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-amber-400" />
                                              <span className="truncate">Caderno Matemática (PDF)</span>
                                            </div>
                                            <ExternalLink size={10} className="opacity-40 group-hover/btn:opacity-100 transition-opacity shrink-0 ml-1" />
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  )}
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
                                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                                        expandedFuvestDay === '1'
                                          ? 'bg-[var(--text-accent)] border-[var(--text-accent)] text-white shadow-sm'
                                          : 'bg-[var(--bg-secondary)] border-[var(--card-border)] hover:border-[var(--text-accent)] text-[var(--text-primary)]'
                                      }`}
                                    >
                                      <span>1ª FASE</span>
                                      <ChevronRight size={14} className={`transition-transform duration-200 ${expandedFuvestDay === '1' ? 'rotate-90' : ''}`} />
                                    </button>
                                    <button
                                      onClick={() => setExpandedFuvestDay(expandedFuvestDay === '2' ? null : '2')}
                                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                                        expandedFuvestDay === '2'
                                          ? 'bg-[var(--text-accent)] border-[var(--text-accent)] text-white shadow-sm'
                                          : 'bg-[var(--bg-secondary)] border-[var(--card-border)] hover:border-[var(--text-accent)] text-[var(--text-primary)]'
                                      }`}
                                    >
                                      <span>2ª FASE</span>
                                      <ChevronRight size={14} className={`transition-transform duration-200 ${expandedFuvestDay === '2' ? 'rotate-90' : ''}`} />
                                    </button>
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
                                        <div className="flex items-center justify-between px-1">
                                          <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">1ª Fase — Escolha a versão:</p>
                                          {item.year === '2025' && (
                                            <a
                                              href="https://www.fuvest.br/wp-content/uploads/fuvest2025_gabarito_primeira_fase.pdf"
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-[10px] font-bold text-emerald-500 hover:underline flex items-center gap-1"
                                              title="Abrir Gabarito Oficial da 1ª Fase (PDF)"
                                            >
                                              <span>Gabarito Oficial</span>
                                              <ExternalLink size={10} />
                                            </a>
                                          )}
                                        </div>
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
                                        {item.year === '2025' && (
                                          <a
                                            href="https://www.fuvest.br/wp-content/uploads/fuvest2025_gabarito_primeira_fase.pdf"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white text-emerald-600 dark:text-emerald-400 text-xs font-black transition-all"
                                          >
                                            <FileText size={13} />
                                            <span>Baixar Gabarito Oficial 1ª Fase (PDF)</span>
                                            <ExternalLink size={11} />
                                          </a>
                                        )}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>

                                  {/* 2ª Fase Selection with 1° Dia and 2° Dia */}
                                  <AnimatePresence>
                                    {expandedFuvestDay === '2' && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden pl-2 border-l-2 border-[var(--text-accent)]/30 space-y-2"
                                      >
                                        <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase px-1">2ª Fase — Cadernos de Prova:</p>
                                        <div className="grid grid-cols-2 gap-2">
                                          <a
                                            href={getExamLink(vest, `${item.year}-fase2-dia1`)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-rose-500/15 to-purple-500/15 border border-rose-500/30 hover:border-rose-500 hover:from-rose-500 hover:to-purple-600 text-xs font-black text-[var(--text-primary)] hover:text-white transition-all shadow-sm group"
                                            title="Baixar Prova FUVEST 2ª Fase — 1° Dia"
                                          >
                                            <FileText size={14} className="text-rose-400 group-hover:text-white" />
                                            <span>1° Dia</span>
                                            <ExternalLink size={12} className="opacity-70 group-hover:opacity-100" />
                                          </a>
                                          <a
                                            href={getExamLink(vest, `${item.year}-fase2-dia2`)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-purple-500/15 to-indigo-500/15 border border-purple-500/30 hover:border-purple-500 hover:from-purple-600 hover:to-indigo-600 text-xs font-black text-[var(--text-primary)] hover:text-white transition-all shadow-sm group"
                                            title="Baixar Prova FUVEST 2ª Fase — 2° Dia"
                                          >
                                            <FileText size={14} className="text-purple-400 group-hover:text-white" />
                                            <span>2° Dia</span>
                                            <ExternalLink size={12} className="opacity-70 group-hover:opacity-100" />
                                          </a>
                                        </div>

                                        {/* Guia de Respostas da 2ª Fase 2025 */}
                                        {item.year === '2025' && (
                                          <div className="pt-2 space-y-1.5 border-t border-[var(--card-border)]/50">
                                            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase px-1">Guia de Respostas Oficial (2ª Fase):</p>
                                            <a
                                              href="https://www.fuvest.br/wp-content/uploads/fuvest_2025_guia_respostas.pdf"
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-emerald-500/15 to-teal-500/15 border border-emerald-500/30 hover:border-emerald-500 hover:from-emerald-500 hover:to-teal-600 text-xs font-black text-[var(--text-primary)] hover:text-white transition-all shadow-sm group"
                                              title="Baixar Guia Oficial de Respostas FUVEST 2025 2ª Fase (PDF)"
                                            >
                                              <div className="flex items-center gap-2">
                                                <FileText size={14} className="text-emerald-500 group-hover:text-white" />
                                                <span>Guia de Respostas Oficial (2ª Fase)</span>
                                              </div>
                                              <ExternalLink size={12} className="opacity-70 group-hover:opacity-100" />
                                            </a>
                                          </div>
                                        )}

                                        {/* Respostas Esperadas da 2ª Fase 2026 */}
                                        {item.year === '2026' && (
                                          <div className="pt-2 space-y-1.5 border-t border-[var(--card-border)]/50">
                                            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase px-1">Gabaritos Oficiais / Respostas Esperadas:</p>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                                              {[
                                                { label: 'Matemática', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-respostas-esperadas-matematica.pdf' },
                                                { label: 'Física', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-respostas-esperadas-fisica.pdf' },
                                                { label: 'Química', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-respostas-esperadas-quimica.pdf' },
                                                { label: 'Biologia', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-respostas-esperadas-biologia.pdf' },
                                                { label: 'História', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-respostas-esperadas-historia.pdf' },
                                                { label: 'Geografia', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-respostas-esperadas-geografia.pdf' },
                                              ].map(gab => (
                                                <a
                                                  key={gab.label}
                                                  href={gab.url}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--card-border)] hover:border-emerald-500 hover:text-emerald-500 text-[10px] font-bold transition-all group"
                                                  title={`Abrir Gabarito Oficial de ${gab.label} (PDF)`}
                                                >
                                                  <span>{gab.label}</span>
                                                  <ExternalLink size={10} className="opacity-60 group-hover:opacity-100" />
                                                </a>
                                              ))}
                                            </div>
                                          </div>
                                        )}
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
              );
            })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
