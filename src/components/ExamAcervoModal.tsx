import React, { useState } from 'react';
import { X, ExternalLink, Library, ChevronRight, ChevronDown, FileText, Download, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PROVAS_LINKS } from '../data/provas_links';
import { getUnespYearItem } from '../data/novos_acervos';
import { getImeYearItem } from '../data/ime_acervo';
import { getFuvestYearItem } from '../data/fuvest_acervo';
import { getEnemYearItem, EnemDocItem } from '../data/enem_acervo';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  targetVestibular: string | null;
}

export const DATABASE: Record<string, { year: string; size: string }[]> = {
  ENEM: Array.from({ length: 17 }, (_, i) => ({ year: (2026 - i).toString(), size: `${(2.1 + ((i * 3) % 10) * 0.1).toFixed(1)} MB` })),
  USP: Array.from({ length: 17 }, (_, i) => ({ year: (2026 - i).toString(), size: `${(2.1 + ((i * 3) % 10) * 0.1).toFixed(1)} MB` })),
  Fuvest: Array.from({ length: 18 }, (_, i) => ({ year: (2027 - i).toString(), size: `${(3 + ((i * 3) % 10) * 0.1).toFixed(1)} MB` })),
  Unicamp: Array.from({ length: 16 }, (_, i) => ({ year: (2025 - i).toString(), size: `${(2 + Math.random()).toFixed(1)} MB` })),
  Unesp: Array.from({ length: 18 }, (_, i) => ({ year: (2026 - i).toString(), size: `${(2.5 + Math.random()).toFixed(1)} MB` })),
  ITA: Array.from({ length: 19 }, (_, i) => ({ year: (2027 - i).toString(), size: `${(3.2 + ((i * 3) % 10) * 0.15).toFixed(1)} MB` })),
  IME: [
    { year: '2026/2027', size: '2.5 MB' },
    { year: '2025/2026', size: '2.1 MB' },
    { year: '2024/2025', size: '2.8 MB' },
    { year: '2023/2024', size: '2.3 MB' },
    { year: '2022/2023', size: '2.6 MB' },
    { year: '2021/2022', size: '2.2 MB' },
    { year: '2020/2021', size: '2.0 MB' },
    { year: '2019/2020', size: '2.4 MB' },
    { year: '2018/2019', size: '2.5 MB' },
    { year: '2017/2018', size: '2.1 MB' },
    { year: '2016/2017', size: '2.3 MB' },
    { year: '2015/2016', size: '2.4 MB' },
    { year: '2014/2015', size: '2.2 MB' },
    { year: '2013/2014', size: '2.1 MB' },
    { year: '2012/2013', size: '2.3 MB' },
    { year: '2011/2012', size: '2.2 MB' },
    { year: '2010/2011', size: '2.0 MB' },
    { year: '2009/2010', size: '2.1 MB' },
    { year: '2008/2009', size: '2.4 MB' },
    { year: '2007/2008', size: '2.2 MB' },
    { year: '2006/2007', size: '2.5 MB' },
  ],
  UERJ: Array.from({ length: 14 }, (_, i) => ({ year: (2026 - i).toString(), size: `${(2.2 + Math.random()).toFixed(1)} MB` })),
  UNIFESP: Array.from({ length: 14 }, (_, i) => ({ year: (2025 - i).toString(), size: `${(2.1 + Math.random()).toFixed(1)} MB` })),
  Mackenzie: [
    { year: '2026-1', size: '2.0 MB' },
    { year: '2025-2', size: '1.9 MB' },
    { year: '2025-1', size: '2.1 MB' },
    { year: '2024-2', size: '2.0 MB' },
    { year: '2024-1', size: '1.8 MB' },
    { year: '2023-2', size: '2.2 MB' },
    { year: '2023-1', size: '1.9 MB' }
  ],
  FGV: [
    { year: '2026-1', size: '2.4 MB' },
    { year: '2025-2', size: '2.2 MB' },
    { year: '2025-1', size: '2.3 MB' },
    { year: '2024-2', size: '2.1 MB' },
    { year: '2024-1', size: '2.5 MB' }
  ]
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
      const matSlug = materia.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return `https://www.vestibular.ita.br/provas/${matSlug}_${year}.pdf`;
    }
    const key = `ITA_${year}_unica_Prova`;
    if (PROVAS_LINKS[key]) return PROVAS_LINKS[key];
    return `https://www.vestibular.ita.br/provas/${year}_prova.pdf`;
  }
};

export const getExamLink = (vest: string, year: string, day?: string, color?: string) => {
  if (vest.toUpperCase() === 'ITA') {
    return getItaExamLink(year);
  }

  if (vest.toUpperCase() === 'ENEM' && day && color) {
    const enemItem = getEnemYearItem(year);
    if (enemItem) {
      const provas = day === '1' ? enemItem.dia1.provas : enemItem.dia2.provas;
      const match = provas.find(
        (d) =>
          d.aplicacao === 'Regular' &&
          !d.acessibilidade &&
          d.cor?.toLowerCase() === color.toLowerCase()
      );
      if (match) return match.url;
    }

    const key = `ENEM_${year}_${day}_${color}`;
    if (PROVAS_LINKS[key]) {
      return PROVAS_LINKS[key];
    }
    // Predictable fallback Inep format when possible, else fallback to search
    const cdMapDay1: Record<string, string> = { 'Azul': 'CD1', 'Amarelo': 'CD2', 'Branco': 'CD3', 'Verde': 'CD4', 'Rosa': 'CD4' };
    const cdMapDay2: Record<string, string> = { 'Amarelo': 'CD5', 'Cinza': 'CD6', 'Azul': 'CD7', 'Verde': 'CD8', 'Rosa': 'CD8' };
    
    const yearNum = parseInt(year, 10);
    if (yearNum >= 2015 && yearNum <= 2026) {
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
  if (vest.toLowerCase() === 'fuvest') {
    const fuvestItem = getFuvestYearItem(year);
    if (fuvestItem?.fase1.provaUrl) return fuvestItem.fase1.provaUrl;
  }
  if (vest.toLowerCase() === 'unesp') {
    if (year === '2020') {
      return '/assets/aistudio/unesp_caderno_de_questoes_prova_de_conhecimentos_gerais_15_nov_2019__v1_6f85d56a.pdf';
    }
    if (year === '2019') {
      return '/assets/aistudio/caderno-cg-1a-fase-versao-1-2019_dbeba965.pdf';
    }
    const item = getUnespYearItem(year);
    if (item?.fase1ProvaUrl) return item.fase1ProvaUrl;
    if (item?.pacoteZipUrl) return item.pacoteZipUrl;
  }
  if (vest.toUpperCase() === 'IME') {
    const imeData = getImeYearItem(year);
    if (imeData?.fase1.provaUrl) return imeData.fase1.provaUrl;
    const cleanYear = year.replace('/', '_');
    if (PROVAS_LINKS[`IME_${cleanYear}_1_Prova`]) return PROVAS_LINKS[`IME_${cleanYear}_1_Prova`];
    if (PROVAS_LINKS[`IME_${cleanYear}_Prova`]) return PROVAS_LINKS[`IME_${cleanYear}_Prova`];
    if (PROVAS_LINKS[`IME_${year}_1_Prova`]) return PROVAS_LINKS[`IME_${year}_1_Prova`];
    if (PROVAS_LINKS[`IME_${year}_Prova`]) return PROVAS_LINKS[`IME_${year}_Prova`];
  }
  return `https://www.google.com/search?q=prova+${vest.toLowerCase()}+${year}+pdf`;
};

export default function ExamAcervoModal({ isOpen, onClose, targetVestibular }: Props) {
  const [expandedEnemYear, setExpandedEnemYear] = useState<string | null>(null);
  const [expandedEnemExtras, setExpandedEnemExtras] = useState<Record<string, boolean>>({});
  const [expandedFuvestYear, setExpandedFuvestYear] = useState<string | null>(null);
  const [expandedItaYear, setExpandedItaYear] = useState<string | null>(null);
  const [expandedUnespYear, setExpandedUnespYear] = useState<string | null>(null);
  const [expandedImeYear, setExpandedImeYear] = useState<string | null>(null);

  const filteredDatabase = targetVestibular 
    ? { [targetVestibular]: DATABASE[targetVestibular] || [] }
    : DATABASE;

  const handleClose = () => {
    setExpandedEnemYear(null);
    setExpandedEnemExtras({});
    setExpandedFuvestYear(null);
    setExpandedItaYear(null);
    setExpandedUnespYear(null);
    setExpandedImeYear(null);
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
                        const isUnesp = vest.toLowerCase() === 'unesp';
                        const isIme = vest.toUpperCase() === 'IME';
                      
                        const isEnemExpanded = expandedEnemYear === item.year;
                        const isItaExpanded = expandedItaYear === item.year;
                        const isFuvestExpanded = expandedFuvestYear === item.year;
                        const isUnespExpanded = expandedUnespYear === item.year;
                        const isImeExpanded = expandedImeYear === item.year;

                      if (isEnem) {
                        const enemData = getEnemYearItem(item.year);
                        const showExtras = Boolean(expandedEnemExtras[item.year]);

                        const getDot = (cor?: string) => {
                          switch (cor?.toLowerCase()) {
                            case 'azul': return 'bg-blue-500';
                            case 'amarelo': return 'bg-yellow-400';
                            case 'branco': return 'bg-slate-200 border border-slate-400';
                            case 'rosa': return 'bg-pink-500';
                            case 'verde': return 'bg-emerald-500';
                            case 'cinza': return 'bg-gray-400';
                            case 'laranja': return 'bg-orange-500';
                            case 'marrom': return 'bg-amber-800';
                            case 'roxo': return 'bg-purple-500';
                            default: return 'bg-teal-500';
                          }
                        };

                        const isCore = (d: EnemDocItem) =>
                          d.isRedacaoTema || (d.aplicacao === 'Regular' && !d.acessibilidade);

                        const d1CoreProvas = enemData?.dia1.provas.filter(isCore) || [];
                        const d1CoreGabs = enemData?.dia1.gabaritos.filter(isCore) || [];
                        const d2CoreProvas = enemData?.dia2.provas.filter(isCore) || [];
                        const d2CoreGabs = enemData?.dia2.gabaritos.filter(isCore) || [];

                        const extraDocs = [
                          ...(enemData?.dia1.provas.filter(d => !isCore(d)) || []),
                          ...(enemData?.dia1.gabaritos.filter(d => !isCore(d)) || []),
                          ...(enemData?.dia2.provas.filter(d => !isCore(d)) || []),
                          ...(enemData?.dia2.gabaritos.filter(d => !isCore(d)) || [])
                        ];

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
                                  <span className={`text-[10px] font-bold ${isEnemExpanded ? 'text-white/80' : 'text-[var(--text-secondary)]'}`}>
                                    Ver provas e gabaritos
                                  </span>
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
                                  className="overflow-hidden space-y-3 ml-2 pl-3 border-l-2 border-[var(--text-accent)]/30 mt-1"
                                >
                                  {/* 1º DIA */}
                                  <div className="space-y-1.5 text-left">
                                    <div className="flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-accent)]" />
                                      <span className="text-[10px] font-black uppercase text-[var(--text-accent)] tracking-wider">
                                        1º DIA — Provas e Gabaritos ({item.year})
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-1.5">
                                      {d1CoreProvas.map((doc, idx) => (
                                        <a
                                          key={`modal-enem-d1-p-${idx}`}
                                          href={doc.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--card-border)] hover:border-teal-500 text-[var(--text-primary)] text-xs font-bold transition-all active:scale-95 duration-200 group/btn"
                                        >
                                          <div className="flex items-center gap-2 min-w-0">
                                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${getDot(doc.cor)}`} />
                                            <span className="truncate">{doc.label}</span>
                                          </div>
                                          <ExternalLink size={10} className="opacity-40 group-hover/btn:opacity-100 shrink-0 ml-2" />
                                        </a>
                                      ))}
                                      {d1CoreGabs.map((doc, idx) => (
                                        <a
                                          key={`modal-enem-d1-g-${idx}`}
                                          href={doc.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all active:scale-95 duration-200 group/btn"
                                        >
                                          <div className="flex items-center gap-2 min-w-0">
                                            <CheckCircle2 size={12} className="shrink-0 text-emerald-500" />
                                            <span className="truncate">{doc.label}</span>
                                          </div>
                                          <ExternalLink size={10} className="opacity-70 group-hover/btn:opacity-100 shrink-0 ml-2" />
                                        </a>
                                      ))}
                                    </div>
                                  </div>

                                  {/* 2º DIA */}
                                  <div className="space-y-1.5 text-left">
                                    <div className="flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                                      <span className="text-[10px] font-black uppercase text-violet-500 dark:text-violet-400 tracking-wider">
                                        2º DIA — Provas e Gabaritos ({item.year})
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-1.5">
                                      {d2CoreProvas.map((doc, idx) => (
                                        <a
                                          key={`modal-enem-d2-p-${idx}`}
                                          href={doc.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--card-border)] hover:border-violet-500 text-[var(--text-primary)] text-xs font-bold transition-all active:scale-95 duration-200 group/btn"
                                        >
                                          <div className="flex items-center gap-2 min-w-0">
                                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${getDot(doc.cor)}`} />
                                            <span className="truncate">{doc.label}</span>
                                          </div>
                                          <ExternalLink size={10} className="opacity-40 group-hover/btn:opacity-100 shrink-0 ml-2" />
                                        </a>
                                      ))}
                                      {d2CoreGabs.map((doc, idx) => (
                                        <a
                                          key={`modal-enem-d2-g-${idx}`}
                                          href={doc.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all active:scale-95 duration-200 group/btn"
                                        >
                                          <div className="flex items-center gap-2 min-w-0">
                                            <CheckCircle2 size={12} className="shrink-0 text-emerald-500" />
                                            <span className="truncate">{doc.label}</span>
                                          </div>
                                          <ExternalLink size={10} className="opacity-70 group-hover/btn:opacity-100 shrink-0 ml-2" />
                                        </a>
                                      ))}
                                    </div>
                                  </div>

                                  {extraDocs.length > 0 && (
                                    <div className="pt-1 space-y-2 text-left">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setExpandedEnemExtras((prev) => ({
                                            ...prev,
                                            [item.year]: !prev[item.year]
                                          }))
                                        }
                                        className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--card-border)] hover:border-teal-500/40 text-[11px] font-black text-[var(--text-secondary)] hover:text-teal-500 transition-colors cursor-pointer"
                                      >
                                        <span>
                                          {showExtras
                                            ? `Ocultar PPL, Digital e Acessibilidade (${extraDocs.length})`
                                            : `Ver PPL, Digital e Acessibilidade (+${extraDocs.length} arquivos)`}
                                        </span>
                                        <ChevronDown
                                          size={13}
                                          className={`transition-transform ${showExtras ? 'rotate-180' : ''}`}
                                        />
                                      </button>

                                      {showExtras && (
                                        <div className="grid grid-cols-1 gap-1.5">
                                          {extraDocs.map((doc, idx) => (
                                            <a
                                              key={`modal-enem-extra-${idx}`}
                                              href={doc.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className={`flex items-center justify-between p-2 rounded-xl border text-[11px] font-bold transition-all group/btn ${
                                                doc.tipo === 'gabarito'
                                                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400'
                                                  : 'bg-[var(--bg-secondary)] border-[var(--card-border)] hover:border-teal-500 text-[var(--text-primary)]'
                                              }`}
                                            >
                                              <div className="flex items-center gap-2 min-w-0">
                                                {doc.tipo === 'gabarito' ? (
                                                  <CheckCircle2 size={11} className="shrink-0 text-emerald-500" />
                                                ) : (
                                                  <span className={`w-2 h-2 rounded-full shrink-0 ${getDot(doc.cor)}`} />
                                                )}
                                                <span className="truncate">{doc.label}</span>
                                              </div>
                                              <ExternalLink size={10} className="opacity-50 group-hover/btn:opacity-100 shrink-0 ml-2" />
                                            </a>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )}
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
                                    {is2Fases ? 'Ver opções de fases' : (['2018', '2017', '2016', '2015', '2014', '2013', '2012'].includes(item.year) ? 'Ver cadernos por matéria' : 'Ver caderno integral')}
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
                                          ]
                                            .filter((m) => {
                                              if (y === 2027) {
                                                return m.name === 'Matemática' || m.name === 'Química';
                                              }
                                              return true;
                                            })
                                            .map((m) => (
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
                        const fuvestData = getFuvestYearItem(item.year);
                        const hasFase2Dias = Boolean(fuvestData?.fase2.dias && fuvestData.fase2.dias.length > 0);
                        const hasFase2Gabaritos = Boolean(fuvestData?.fase2.gabaritos && fuvestData.fase2.gabaritos.length > 0);
                        return (
                          <div key={`${vest}-${item.year}`} className="flex flex-col gap-2">
                            <button
                              onClick={() => setExpandedFuvestYear(isFuvestExpanded ? null : item.year)}
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
                                  <span className={`text-[10px] font-bold ${isFuvestExpanded ? 'text-white/80' : 'text-[var(--text-secondary)]'}`}>
                                    Ver provas e gabaritos
                                  </span>
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
                                  className="overflow-hidden space-y-3 ml-2 pl-3 border-l-2 border-indigo-500/30 mt-1"
                                >
                                  {/* 1ª Fase */}
                                  <div className="space-y-1.5 text-left">
                                    <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">
                                      1ª FASE — Prova e Gabarito ({item.year})
                                    </span>
                                    <div className="grid grid-cols-1 gap-2">
                                      <a
                                        href={fuvestData?.fase1.provaUrl || getExamLink(vest, item.year)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--card-border)] hover:border-indigo-500 text-[var(--text-primary)] text-xs font-bold transition-all group/btn"
                                      >
                                        <div className="flex items-center gap-2 min-w-0">
                                          <FileText size={12} className="text-indigo-500 shrink-0" />
                                          <span className="truncate">{fuvestData?.fase1.provaLabel || `FUVEST ${item.year} — Prova 1ª Fase`}</span>
                                        </div>
                                        <ExternalLink size={10} className="opacity-40 group-hover/btn:opacity-100 shrink-0 ml-2" />
                                      </a>
                                      {fuvestData?.fase1.gabaritoUrl && (
                                        <a
                                          href={fuvestData.fase1.gabaritoUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all group/btn"
                                        >
                                          <div className="flex items-center gap-2 min-w-0">
                                            <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-emerald-500" />
                                            <span className="truncate">{fuvestData.fase1.gabaritoLabel}</span>
                                          </div>
                                          <ExternalLink size={10} className="opacity-70 group-hover/btn:opacity-100 shrink-0 ml-2" />
                                        </a>
                                      )}
                                      {fuvestData?.fase1.gabaritosAdicionais?.map(gab => (
                                        <a
                                          key={gab.url}
                                          href={gab.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center justify-between p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 text-xs font-bold transition-all group/btn"
                                        >
                                          <div className="flex items-center gap-2 min-w-0">
                                            <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-teal-500" />
                                            <span className="truncate">{gab.label}</span>
                                          </div>
                                          <ExternalLink size={10} className="opacity-70 group-hover/btn:opacity-100 shrink-0 ml-2" />
                                        </a>
                                      ))}
                                    </div>
                                  </div>

                                  {/* 2ª Fase */}
                                  {(hasFase2Dias || hasFase2Gabaritos) && (
                                    <div className="space-y-1.5 text-left pt-1 border-t border-[var(--card-border)]">
                                      <span className="text-[10px] font-black uppercase text-purple-500 tracking-wider">
                                        2ª FASE — Provas e Gabaritos ({item.year})
                                      </span>
                                      <div className="grid grid-cols-1 gap-2">
                                        {fuvestData?.fase2.dias.map(d => (
                                          <a
                                            key={d.url}
                                            href={d.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--card-border)] hover:border-purple-500 text-[var(--text-primary)] text-xs font-bold transition-all group/btn"
                                          >
                                            <div className="flex items-center gap-2 min-w-0">
                                              <FileText size={12} className="text-purple-500 shrink-0" />
                                              <span className="truncate">{d.label}</span>
                                            </div>
                                            <ExternalLink size={10} className="opacity-40 group-hover/btn:opacity-100 shrink-0 ml-2" />
                                          </a>
                                        ))}
                                        {fuvestData?.fase2.gabaritos?.map(g => (
                                          <a
                                            key={g.url}
                                            href={g.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all group/btn"
                                          >
                                            <div className="flex items-center gap-2 min-w-0">
                                              <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-emerald-500" />
                                              <span className="truncate">{g.label}</span>
                                            </div>
                                            <ExternalLink size={10} className="opacity-70 group-hover/btn:opacity-100 shrink-0 ml-2" />
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      }

                      if (isUnesp) {
                        const unespData = getUnespYearItem(item.year);
                        return (
                          <div key={`${vest}-${item.year}`} className="flex flex-col gap-2">
                            <button
                              onClick={() => setExpandedUnespYear(isUnespExpanded ? null : item.year)}
                              className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                                isUnespExpanded 
                                  ? 'bg-amber-600 border-amber-600 shadow-lg text-white' 
                                  : 'bg-[var(--bg-secondary)] border-[var(--card-border)] hover:bg-white dark:hover:bg-[var(--card-border)] hover:border-amber-500 text-[var(--text-primary)]'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <span className={`w-12 h-12 flex items-center justify-center rounded-xl font-black text-sm shadow-md transition-all ${
                                  isUnespExpanded ? 'bg-white/20 text-white' : 'bg-gradient-to-br from-amber-500 to-amber-700 text-white'
                                }`}>
                                  {item.year.slice(2)}
                                </span>
                                <div className="flex flex-col items-start">
                                  <span className="text-sm font-black">{vest} {item.year}</span>
                                  <span className={`text-[10px] font-bold ${isUnespExpanded ? 'text-white/80' : 'text-[var(--text-secondary)]'}`}>
                                    {item.year === '2020' || item.year === '2019' ? '5 Cadernos Oficiais (PDF)' : 'Ver cadernos e gabaritos'}
                                  </span>
                                </div>
                              </div>
                              <ChevronRight size={20} className={`transition-transform duration-300 ${isUnespExpanded ? 'rotate-90' : ''}`} />
                            </button>

                            <AnimatePresence>
                              {isUnespExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden space-y-3 ml-2 pl-3 border-l-2 border-amber-500/40 mt-1"
                                >
                                  {/* 1ª Fase */}
                                  <div className="space-y-1.5 text-left">
                                    <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">
                                      1ª FASE — Conhecimentos Gerais
                                    </span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      <a
                                        href={unespData?.fase1ProvaUrl || getExamLink(vest, item.year)}
                                        download={unespData?.fase1ProvaUrl?.startsWith('/assets/')}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--card-border)] hover:border-amber-500 text-[var(--text-primary)] text-xs font-bold transition-all group/btn"
                                      >
                                        <div className="flex items-center gap-2">
                                          <Download size={12} className="text-amber-500 shrink-0" />
                                          <span>Caderno 1ª Fase (PDF)</span>
                                        </div>
                                        <ExternalLink size={10} className="opacity-40 group-hover/btn:opacity-100" />
                                      </a>
                                      {unespData?.fase1GabaritoUrl && (
                                        <a
                                          href={unespData.fase1GabaritoUrl}
                                          download={unespData.fase1GabaritoUrl.startsWith('/assets/')}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all group/btn"
                                        >
                                          <div className="flex items-center gap-2">
                                            <Download size={12} className="text-emerald-500 shrink-0" />
                                            <span>Gabarito Oficial (PDF)</span>
                                          </div>
                                          <ExternalLink size={10} className="opacity-70 group-hover/btn:opacity-100" />
                                        </a>
                                      )}
                                    </div>
                                  </div>

                                  {/* 2ª Fase */}
                                  {(unespData?.fase2Cadernos || unespData?.fase2ProvaUrl) && (
                                    <div className="space-y-1.5 text-left pt-1 border-t border-[var(--card-border)]">
                                      <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">
                                        2ª FASE — Cadernos Específicos
                                      </span>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {unespData?.fase2Cadernos ? (
                                          unespData.fase2Cadernos.map((cad) => (
                                            <a
                                              key={cad.disciplina}
                                              href={cad.url}
                                              download
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--card-border)] hover:border-amber-500 text-[var(--text-primary)] text-xs font-bold transition-all group/btn"
                                            >
                                              <div className="flex items-center gap-2 truncate">
                                                <Download size={12} className="text-amber-500 shrink-0" />
                                                <span className="truncate">{cad.disciplina}</span>
                                              </div>
                                              <ExternalLink size={10} className="opacity-40 group-hover/btn:opacity-100 shrink-0 ml-1" />
                                            </a>
                                          ))
                                        ) : unespData?.fase2ProvaUrl ? (
                                          <a
                                            href={unespData.fase2ProvaUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--card-border)] hover:border-amber-500 text-[var(--text-primary)] text-xs font-bold transition-all group/btn"
                                          >
                                            <div className="flex items-center gap-2">
                                              <Download size={12} className="text-amber-500 shrink-0" />
                                              <span>Caderno 2ª Fase (PDF)</span>
                                            </div>
                                            <ExternalLink size={10} className="opacity-40 group-hover/btn:opacity-100" />
                                          </a>
                                        ) : null}
                                      </div>
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      }

                      if (isIme) {
                        const imeData = getImeYearItem(item.year);
                        const provaUrl = imeData?.fase1.provaUrl || getExamLink(vest, item.year);
                        return (
                          <div key={`${vest}-${item.year}`} className="flex flex-col gap-2">
                            <button
                              onClick={() => setExpandedImeYear(isImeExpanded ? null : item.year)}
                              className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                                isImeExpanded 
                                  ? 'bg-emerald-700 border-emerald-700 shadow-lg text-white' 
                                  : 'bg-[var(--bg-secondary)] border-[var(--card-border)] hover:bg-white dark:hover:bg-[var(--card-border)] hover:border-emerald-600 text-[var(--text-primary)]'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <span className={`w-12 h-12 flex items-center justify-center rounded-xl font-black text-sm shadow-md transition-all ${
                                  isImeExpanded ? 'bg-white/20 text-white' : 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white'
                                }`}>
                                  {item.year.length > 4 ? item.year.slice(-2) : item.year.slice(2)}
                                </span>
                                <div className="flex flex-col items-start">
                                  <span className="text-sm font-black">{vest} {item.year}</span>
                                  <span className={`text-[10px] font-bold ${isImeExpanded ? 'text-white/80' : 'text-[var(--text-secondary)]'}`}>
                                    1ª Fase Objetiva {imeData?.fase2?.discursivas?.length ? '• 2ª Fase' : ''}
                                  </span>
                                </div>
                              </div>
                              <ChevronRight size={20} className={`transition-transform duration-300 ${isImeExpanded ? 'rotate-90' : ''}`} />
                            </button>

                            <AnimatePresence>
                              {isImeExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden space-y-3 ml-2 pl-3 border-l-2 border-emerald-500/40 mt-1"
                                >
                                  {/* 1ª Fase */}
                                  <div className="space-y-1.5 text-left">
                                    <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                                      1ª FASE — Prova Objetiva
                                    </span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      <a
                                        href={provaUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--card-border)] hover:border-emerald-500 text-[var(--text-primary)] text-xs font-bold transition-all group/btn"
                                      >
                                        <div className="flex items-center gap-2 truncate">
                                          <Download size={12} className="text-emerald-500 shrink-0" />
                                          <span className="truncate">Prova Objetiva (PDF)</span>
                                        </div>
                                        <ExternalLink size={10} className="opacity-40 group-hover/btn:opacity-100 shrink-0 ml-1" />
                                      </a>
                                      {imeData?.fase1.gabaritoUrl && (
                                        <a
                                          href={imeData.fase1.gabaritoUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all group/btn"
                                        >
                                          <div className="flex items-center gap-2 truncate">
                                            <Download size={12} className="text-emerald-500 shrink-0" />
                                            <span className="truncate">Gabarito Oficial (PDF)</span>
                                          </div>
                                          <ExternalLink size={10} className="opacity-70 group-hover/btn:opacity-100 shrink-0 ml-1" />
                                        </a>
                                      )}
                                    </div>
                                  </div>

                                  {/* 2ª Fase if available */}
                                  {imeData?.fase2?.discursivas && imeData.fase2.discursivas.length > 0 && (
                                    <div className="space-y-1.5 text-left pt-1 border-t border-[var(--card-border)]">
                                      <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                                        2ª FASE — Provas Discursivas
                                      </span>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {imeData.fase2.discursivas.map((disc) => (
                                          <a
                                            key={disc.nome}
                                            href={disc.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--card-border)] hover:border-emerald-500 text-[var(--text-primary)] text-xs font-bold transition-all group/btn"
                                          >
                                            <div className="flex items-center gap-1.5 truncate">
                                              <Download size={11} className="text-emerald-500 shrink-0" />
                                              <span className="truncate">{disc.nome}</span>
                                            </div>
                                            <ExternalLink size={9} className="opacity-40 group-hover/btn:opacity-100 shrink-0 ml-1" />
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  )}
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
                              {item.year.length > 4 ? item.year.slice(-2) : item.year.slice(2)}
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
