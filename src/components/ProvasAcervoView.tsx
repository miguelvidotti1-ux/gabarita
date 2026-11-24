import React, { useState } from 'react';
import { 
  FileText, Search, Download, CheckCircle2, ChevronRight, 
  ChevronDown, Calendar, GraduationCap, Sparkles, BookOpen, 
  ExternalLink, Layers 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PROVAS_LINKS } from '../data/provas_links';
import FuvestAcervoTable from './FuvestAcervoTable';
import EnemAcervoTable from './EnemAcervoTable';
import UnicampAcervoTable from './UnicampAcervoTable';
import ImeAcervoTable from './ImeAcervoTable';
import UnespAcervoTable from './UnespAcervoTable';
import UerjAcervoTable from './UerjAcervoTable';
import UnifespAcervoTable from './UnifespAcervoTable';
import MackenzieAcervoTable from './MackenzieAcervoTable';
import FgvAcervoTable from './FgvAcervoTable';
import { getFuvestYearItem } from '../data/fuvest_acervo';
import { getEnemYearItem, EnemDocItem } from '../data/enem_acervo';
import { getUnicampYearItem } from '../data/unicamp_acervo';
import { getImeYearItem } from '../data/ime_acervo';
import { 
  getUnespYearItem, 
  getUerjYearItem, 
  getUnifespYearItem, 
  MACKENZIE_ACERVO_TABLE, 
  FGV_ACERVO_TABLE 
} from '../data/novos_acervos';
import { DATABASE, getExamLink, getItaExamLink } from './ExamAcervoModal';

const VESTIBULAR_TABS = [
  'Todos',
  'ENEM',
  'Fuvest',
  'Unicamp',
  'Unesp',
  'UERJ',
  'ITA',
  'IME',
  'UNIFESP',
  'Mackenzie',
  'FGV'
];

export default function ProvasAcervoView() {
  const [selectedVestibular, setSelectedVestibular] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedYearKey, setExpandedYearKey] = useState<string | null>(null);

  // Table view states per vestibular
  const [enemViewMode, setEnemViewMode] = useState<'anos' | 'tabela'>('anos');
  const [expandedEnemExtras, setExpandedEnemExtras] = useState<Record<string, boolean>>({});
  const [fuvestViewMode, setFuvestViewMode] = useState<'anos' | 'tabela'>('anos');
  const [unicampViewMode, setUnicampViewMode] = useState<'anos' | 'tabela'>('anos');
  const [imeViewMode, setImeViewMode] = useState<'anos' | 'tabela'>('anos');
  const [unespViewMode, setUnespViewMode] = useState<'anos' | 'tabela'>('anos');
  const [uerjViewMode, setUerjViewMode] = useState<'anos' | 'tabela'>('anos');
  const [unifespViewMode, setUnifespViewMode] = useState<'anos' | 'tabela'>('anos');
  const [mackenzieViewMode, setMackenzieViewMode] = useState<'anos' | 'tabela'>('anos');
  const [fgvViewMode, setFgvViewMode] = useState<'anos' | 'tabela'>('anos');

  // Filtered vestibular entries
  const displayEntries = Object.entries(DATABASE).filter(([vest]) => {
    if (selectedVestibular === 'Todos') return vest !== 'USP';
    return vest.toLowerCase() === selectedVestibular.toLowerCase();
  });

  return (
    <div className="space-y-8 pb-16 font-sans animate-in fade-in duration-500">
      {/* Hero Header */}
      <div className="bg-slate-950 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 blur-[150px] rounded-full -ml-48 -mb-48 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                <BookOpen size={12} className="text-blue-400" />
                Acervo Oficial de Provas
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                <CheckCircle2 size={12} className="text-emerald-400" />
                Padrão ENEM Unificado
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-500/20">
                <Sparkles size={12} className="text-purple-400" />
                2007 — 2027
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
              Biblioteca de <span className="text-blue-400">Provas Oficiais</span>
            </h1>
            <p className="text-slate-400 font-medium leading-relaxed text-sm md:text-base">
              Cadernos de provas originais completos dos principais vestibulares com o mesmo design padrão do ENEM:
              baixe os PDFs oficiais das primeiras e segundas fases e acesse os gabaritos correspondentes.
            </p>
          </div>
        </div>
      </div>

      {/* Vestibular Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {VESTIBULAR_TABS.map((vest) => {
          const isActive = selectedVestibular === vest;
          return (
            <button
              key={vest}
              onClick={() => setSelectedVestibular(vest)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer border ${
                isActive
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-md shadow-[var(--primary)]/20'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border-[var(--border-light)] hover:border-[var(--primary-border)]'
              }`}
            >
              {vest}
            </button>
          );
        })}
      </div>

      {/* Search Toolbar */}
      <div className="bg-[var(--bg-card)] p-5 sm:p-6 rounded-2xl border border-[var(--border-light)] flex flex-col sm:flex-row gap-4 items-center shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-label)]" size={18} />
          <input 
            type="text"
            placeholder="Buscar por ano, exame ou caderno..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl text-sm font-semibold outline-none focus:border-[var(--primary)] transition-all text-[var(--text-main)] placeholder-[var(--text-label)]"
          />
        </div>

        {/* View Mode Toggle when a specific vestibular that has table is selected */}
        {selectedVestibular === 'ENEM' && (
          <div className="flex items-center gap-1 p-1 bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl">
            <button
              onClick={() => setEnemViewMode('anos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                enemViewMode === 'anos' ? 'bg-teal-600 text-white shadow-sm' : 'text-[var(--text-muted)]'
              }`}
            >
              <Calendar size={13} />
              <span>Cards (Padrão ENEM)</span>
            </button>
            <button
              onClick={() => setEnemViewMode('tabela')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                enemViewMode === 'tabela' ? 'bg-teal-600 text-white shadow-sm' : 'text-[var(--text-muted)]'
              }`}
            >
              <Layers size={13} />
              <span>Tabela Oficial</span>
            </button>
          </div>
        )}

        {selectedVestibular === 'Fuvest' && (
          <div className="flex items-center gap-1 p-1 bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl">
            <button
              onClick={() => setFuvestViewMode('anos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                fuvestViewMode === 'anos' ? 'bg-[var(--primary)] text-white shadow-sm' : 'text-[var(--text-muted)]'
              }`}
            >
              <Calendar size={13} />
              <span>Cards (Padrão ENEM)</span>
            </button>
            <button
              onClick={() => setFuvestViewMode('tabela')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                fuvestViewMode === 'tabela' ? 'bg-[var(--primary)] text-white shadow-sm' : 'text-[var(--text-muted)]'
              }`}
            >
              <Layers size={13} />
              <span>Tabela Oficial</span>
            </button>
          </div>
        )}

        {selectedVestibular === 'Unicamp' && (
          <div className="flex items-center gap-1 p-1 bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl">
            <button
              onClick={() => setUnicampViewMode('anos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                unicampViewMode === 'anos' ? 'bg-emerald-600 text-white shadow-sm' : 'text-[var(--text-muted)]'
              }`}
            >
              <Calendar size={13} />
              <span>Cards (Padrão ENEM)</span>
            </button>
            <button
              onClick={() => setUnicampViewMode('tabela')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                unicampViewMode === 'tabela' ? 'bg-emerald-600 text-white shadow-sm' : 'text-[var(--text-muted)]'
              }`}
            >
              <Layers size={13} />
              <span>Tabela Oficial</span>
            </button>
          </div>
        )}

        {selectedVestibular === 'IME' && (
          <div className="flex items-center gap-1 p-1 bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl">
            <button
              onClick={() => setImeViewMode('anos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                imeViewMode === 'anos' ? 'bg-emerald-700 text-white shadow-sm' : 'text-[var(--text-muted)]'
              }`}
            >
              <Calendar size={13} />
              <span>Cards (Padrão ENEM)</span>
            </button>
            <button
              onClick={() => setImeViewMode('tabela')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                imeViewMode === 'tabela' ? 'bg-emerald-700 text-white shadow-sm' : 'text-[var(--text-muted)]'
              }`}
            >
              <Layers size={13} />
              <span>Tabela Oficial</span>
            </button>
          </div>
        )}

        {selectedVestibular === 'Unesp' && (
          <div className="flex items-center gap-1 p-1 bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl">
            <button
              onClick={() => setUnespViewMode('anos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                unespViewMode === 'anos' ? 'bg-amber-600 text-white shadow-sm' : 'text-[var(--text-muted)]'
              }`}
            >
              <Calendar size={13} />
              <span>Cards (Padrão ENEM)</span>
            </button>
            <button
              onClick={() => setUnespViewMode('tabela')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                unespViewMode === 'tabela' ? 'bg-amber-600 text-white shadow-sm' : 'text-[var(--text-muted)]'
              }`}
            >
              <Layers size={13} />
              <span>Tabela Oficial</span>
            </button>
          </div>
        )}

        {selectedVestibular === 'UERJ' && (
          <div className="flex items-center gap-1 p-1 bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl">
            <button
              onClick={() => setUerjViewMode('anos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                uerjViewMode === 'anos' ? 'bg-purple-600 text-white shadow-sm' : 'text-[var(--text-muted)]'
              }`}
            >
              <Calendar size={13} />
              <span>Cards (Padrão ENEM)</span>
            </button>
            <button
              onClick={() => setUerjViewMode('tabela')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                uerjViewMode === 'tabela' ? 'bg-purple-600 text-white shadow-sm' : 'text-[var(--text-muted)]'
              }`}
            >
              <Layers size={13} />
              <span>Tabela Oficial</span>
            </button>
          </div>
        )}

        {selectedVestibular === 'UNIFESP' && (
          <div className="flex items-center gap-1 p-1 bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl">
            <button
              onClick={() => setUnifespViewMode('anos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                unifespViewMode === 'anos' ? 'bg-teal-600 text-white shadow-sm' : 'text-[var(--text-muted)]'
              }`}
            >
              <Calendar size={13} />
              <span>Cards (Padrão ENEM)</span>
            </button>
            <button
              onClick={() => setUnifespViewMode('tabela')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                unifespViewMode === 'tabela' ? 'bg-teal-600 text-white shadow-sm' : 'text-[var(--text-muted)]'
              }`}
            >
              <Layers size={13} />
              <span>Tabela Oficial</span>
            </button>
          </div>
        )}

        {selectedVestibular === 'Mackenzie' && (
          <div className="flex items-center gap-1 p-1 bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl">
            <button
              onClick={() => setMackenzieViewMode('anos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                mackenzieViewMode === 'anos' ? 'bg-rose-600 text-white shadow-sm' : 'text-[var(--text-muted)]'
              }`}
            >
              <Calendar size={13} />
              <span>Cards (Padrão ENEM)</span>
            </button>
            <button
              onClick={() => setMackenzieViewMode('tabela')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                mackenzieViewMode === 'tabela' ? 'bg-rose-600 text-white shadow-sm' : 'text-[var(--text-muted)]'
              }`}
            >
              <Layers size={13} />
              <span>Tabela Oficial</span>
            </button>
          </div>
        )}

        {selectedVestibular === 'FGV' && (
          <div className="flex items-center gap-1 p-1 bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl">
            <button
              onClick={() => setFgvViewMode('anos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                fgvViewMode === 'anos' ? 'bg-orange-600 text-white shadow-sm' : 'text-[var(--text-muted)]'
              }`}
            >
              <Calendar size={13} />
              <span>Cards (Padrão ENEM)</span>
            </button>
            <button
              onClick={() => setFgvViewMode('tabela')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                fgvViewMode === 'tabela' ? 'bg-orange-600 text-white shadow-sm' : 'text-[var(--text-muted)]'
              }`}
            >
              <Layers size={13} />
              <span>Tabela Oficial</span>
            </button>
          </div>
        )}
      </div>

      {/* Render Provas by Vestibular */}
      <div className="space-y-10">
        {displayEntries.map(([vest, items]) => {
          const isEnem = vest.toUpperCase() === 'ENEM';
          const isFuvest = vest.toLowerCase() === 'fuvest';
          const isUnicamp = vest.toLowerCase() === 'unicamp';
          const isIme = vest.toUpperCase() === 'IME';
          const isIta = vest.toUpperCase() === 'ITA';
          const isUnesp = vest.toLowerCase() === 'unesp';
          const isUerj = vest.toUpperCase() === 'UERJ';
          const isUnifesp = vest.toUpperCase() === 'UNIFESP';
          const isMackenzie = vest.toLowerCase() === 'mackenzie';
          const isFgv = vest.toUpperCase() === 'FGV';

          // Filter by search
          const filteredItems = items.filter(item => {
            if (!searchTerm) return true;
            const term = searchTerm.toLowerCase();
            if (`${vest} ${item.year}`.toLowerCase().includes(term)) return true;
            if (isEnem) {
              const enemData = getEnemYearItem(item.year);
              if (!enemData) return false;
              return [
                ...enemData.dia1.provas,
                ...enemData.dia1.gabaritos,
                ...enemData.dia2.provas,
                ...enemData.dia2.gabaritos
              ].some(doc => doc.label.toLowerCase().includes(term));
            }
            return false;
          });

          if (filteredItems.length === 0) return null;

          // Check if table view is active
          if (isEnem && enemViewMode === 'tabela') {
            return (
              <div key={vest} className="space-y-4">
                <h2 className="text-xl font-black text-[var(--text-main)] flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#00b894]" />
                  ENEM (INEP) — Tabela Oficial
                </h2>
                <EnemAcervoTable />
              </div>
            );
          }
          if (isFuvest && fuvestViewMode === 'tabela') {
            return (
              <div key={vest} className="space-y-4">
                <h2 className="text-xl font-black text-[var(--text-main)] flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-500" />
                  Fuvest (USP) — Tabela Oficial
                </h2>
                <FuvestAcervoTable />
              </div>
            );
          }
          if (isUnicamp && unicampViewMode === 'tabela') {
            return (
              <div key={vest} className="space-y-4">
                <h2 className="text-xl font-black text-[var(--text-main)] flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  Unicamp — Tabela Oficial
                </h2>
                <UnicampAcervoTable />
              </div>
            );
          }
          if (isIme && imeViewMode === 'tabela') {
            return (
              <div key={vest} className="space-y-4">
                <h2 className="text-xl font-black text-[var(--text-main)] flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-700" />
                  IME — Tabela Oficial
                </h2>
                <ImeAcervoTable />
              </div>
            );
          }
          if (isUnesp && unespViewMode === 'tabela') {
            return (
              <div key={vest} className="space-y-4">
                <h2 className="text-xl font-black text-[var(--text-main)] flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-600" />
                  UNESP — Tabela Oficial
                </h2>
                <UnespAcervoTable />
              </div>
            );
          }
          if (isUerj && uerjViewMode === 'tabela') {
            return (
              <div key={vest} className="space-y-4">
                <h2 className="text-xl font-black text-[var(--text-main)] flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-600" />
                  UERJ — Tabela Oficial
                </h2>
                <UerjAcervoTable />
              </div>
            );
          }
          if (isUnifesp && unifespViewMode === 'tabela') {
            return (
              <div key={vest} className="space-y-4">
                <h2 className="text-xl font-black text-[var(--text-main)] flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-teal-600" />
                  UNIFESP — Tabela Oficial
                </h2>
                <UnifespAcervoTable />
              </div>
            );
          }
          if (isMackenzie && mackenzieViewMode === 'tabela') {
            return (
              <div key={vest} className="space-y-4">
                <h2 className="text-xl font-black text-[var(--text-main)] flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-600" />
                  Mackenzie — Tabela Oficial
                </h2>
                <MackenzieAcervoTable />
              </div>
            );
          }
          if (isFgv && fgvViewMode === 'tabela') {
            return (
              <div key={vest} className="space-y-4">
                <h2 className="text-xl font-black text-[var(--text-main)] flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-orange-600" />
                  FGV — Tabela Oficial
                </h2>
                <FgvAcervoTable />
              </div>
            );
          }

          // Unified ENEM Accordion Cards Grid
          return (
            <div key={vest} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-black text-[var(--text-main)] flex items-center gap-2.5">
                  <span className={`w-3.5 h-3.5 rounded-full ${
                    isEnem ? 'bg-[#00b894]' :
                    isFuvest ? 'bg-[#764ba2]' :
                    isUnicamp ? 'bg-emerald-500' :
                    isUnesp ? 'bg-amber-600' :
                    isUerj ? 'bg-purple-600' :
                    isIme ? 'bg-emerald-700' :
                    isIta ? 'bg-blue-600' :
                    isUnifesp ? 'bg-teal-600' :
                    isMackenzie ? 'bg-rose-600' : 'bg-orange-500'
                  }`} />
                  <span>{vest}</span>
                  <span className="text-xs font-bold text-[var(--text-muted)] bg-[var(--bg-hover)] px-2.5 py-1 rounded-full border border-[var(--border-light)]">
                    {filteredItems.length} edições
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map(item => {
                  const cardKey = `${vest}-${item.year}`;
                  const isExpanded = expandedYearKey === cardKey;

                  const vestGradient = 
                    isEnem ? 'bg-gradient-to-br from-[#00b894] to-[#00cec9]' :
                    isFuvest ? 'bg-gradient-to-br from-[#667eea] to-[#764ba2]' :
                    isUnicamp ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
                    isUnesp ? 'bg-gradient-to-br from-amber-600 to-amber-800' :
                    isUerj ? 'bg-gradient-to-br from-purple-700 to-indigo-800' :
                    isIme ? 'bg-gradient-to-br from-emerald-700 to-amber-600' :
                    isIta ? 'bg-gradient-to-br from-blue-600 to-indigo-800' :
                    isUnifesp ? 'bg-gradient-to-br from-teal-700 to-emerald-800' :
                    isMackenzie ? 'bg-gradient-to-br from-rose-600 to-red-800' :
                    'bg-gradient-to-br from-orange-500 to-amber-600';

                  return (
                    <div key={cardKey} className="flex flex-col gap-2">
                      <button
                        onClick={() => setExpandedYearKey(isExpanded ? null : cardKey)}
                        className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 w-full text-left cursor-pointer ${
                          isExpanded 
                            ? 'bg-[var(--text-accent, #6366f1)] border-[var(--text-accent, #6366f1)] shadow-lg text-white' 
                            : 'bg-[var(--bg-card)] border-[var(--border-light)] hover:bg-[var(--bg-hover)] hover:border-[var(--primary)] text-[var(--text-main)]'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`w-12 h-12 flex items-center justify-center rounded-xl font-black text-sm shadow-md transition-all ${
                            isExpanded ? 'bg-white/20 text-white' : `${vestGradient} text-white`
                          }`}>
                            {item.year.slice(-2)}
                          </span>
                          <div className="flex flex-col items-start">
                            <span className="text-sm font-black">{vest} {item.year}</span>
                            <span className={`text-[10px] font-bold ${isExpanded ? 'text-white/80' : 'text-[var(--text-muted)]'}`}>
                              Ver opções de fases e cadernos
                            </span>
                          </div>
                        </div>
                        <ChevronRight size={20} className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden space-y-4 ml-2 pl-3 border-l-2 border-[var(--primary)]/30 mt-1"
                          >
                            {/* ENEM Specific Cadernos e Gabaritos */}
                            {isEnem && (() => {
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

                              const d1ExtraDocs = [
                                ...(enemData?.dia1.provas.filter(d => !isCore(d)) || []),
                                ...(enemData?.dia1.gabaritos.filter(d => !isCore(d)) || [])
                              ];
                              const d2ExtraDocs = [
                                ...(enemData?.dia2.provas.filter(d => !isCore(d)) || []),
                                ...(enemData?.dia2.gabaritos.filter(d => !isCore(d)) || [])
                              ];
                              const totalExtras = d1ExtraDocs.length + d2ExtraDocs.length;

                              return (
                                <div className="space-y-3">
                                  {/* 1º DIA */}
                                  <div className="space-y-1.5 text-left">
                                    <div className="flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#00b894]" />
                                      <span className="text-[10px] font-black uppercase text-[#00b894] tracking-wider">
                                        1º DIA — Provas e Gabaritos ({item.year})
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-1.5">
                                      {d1CoreProvas.map((doc, idx) => (
                                        <a
                                          key={`enem-d1-p-${idx}`}
                                          href={doc.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-teal-500 text-xs font-bold transition-all group/btn"
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
                                          key={`enem-d1-g-${idx}`}
                                          href={doc.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all group/btn"
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
                                      <span className="text-[10px] font-black uppercase text-violet-500 tracking-wider">
                                        2º DIA — Provas e Gabaritos ({item.year})
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-1.5">
                                      {d2CoreProvas.map((doc, idx) => (
                                        <a
                                          key={`enem-d2-p-${idx}`}
                                          href={doc.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-violet-500 text-xs font-bold transition-all group/btn"
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
                                          key={`enem-d2-g-${idx}`}
                                          href={doc.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all group/btn"
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

                                  {/* PPL / Digital / Acessibilidade */}
                                  {totalExtras > 0 && (
                                    <div className="pt-1 space-y-2 text-left">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setExpandedEnemExtras(prev => ({
                                            ...prev,
                                            [item.year]: !prev[item.year]
                                          }))
                                        }
                                        className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] hover:border-teal-500/40 text-[11px] font-black text-[var(--text-muted)] hover:text-teal-500 transition-colors cursor-pointer"
                                      >
                                        <span>
                                          {showExtras
                                            ? `Ocultar PPL, Digital e Acessibilidade (${totalExtras})`
                                            : `Ver PPL, Digital e Acessibilidade (+${totalExtras} arquivos)`}
                                        </span>
                                        <ChevronDown
                                          size={13}
                                          className={`transition-transform ${showExtras ? 'rotate-180' : ''}`}
                                        />
                                      </button>

                                      {showExtras && (
                                        <div className="grid grid-cols-1 gap-1.5">
                                          {[...d1ExtraDocs, ...d2ExtraDocs].map((doc, idx) => (
                                            <a
                                              key={`enem-extra-${idx}`}
                                              href={doc.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className={`flex items-center justify-between p-2 rounded-xl border text-[11px] font-bold transition-all group/btn ${
                                                doc.tipo === 'gabarito'
                                                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400'
                                                  : 'bg-[var(--bg-card)] border-[var(--border-light)] hover:border-teal-500 text-[var(--text-main)]'
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
                                </div>
                              );
                            })()}

                            {/* FUVEST Cadernos */}
                            {isFuvest && (() => {
                              const fuvestData = getFuvestYearItem(item.year);
                              const hasFase2Dias = Boolean(fuvestData?.fase2.dias && fuvestData.fase2.dias.length > 0);
                              const hasFase2Gabaritos = Boolean(fuvestData?.fase2.gabaritos && fuvestData.fase2.gabaritos.length > 0);
                              return (
                                <div className="space-y-3">
                                  <div className="space-y-1.5 text-left">
                                    <div className="flex items-center justify-between px-1">
                                      <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">
                                        1ª FASE — Prova e Gabarito ({item.year})
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                      <a
                                        href={fuvestData?.fase1.provaUrl || getExamLink(vest, item.year)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-indigo-500 text-xs font-bold transition-all group/btn"
                                      >
                                        <div className="flex items-center gap-2 min-w-0">
                                          <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-indigo-500" />
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

                                    {fuvestData?.fase1.cadernosAdicionais && fuvestData.fase1.cadernosAdicionais.length > 0 && (
                                      <div className="flex flex-wrap gap-1.5 pt-1">
                                        {fuvestData.fase1.cadernosAdicionais.map(cad => (
                                          <a
                                            key={cad.url}
                                            href={cad.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-indigo-500 text-[10px] font-bold text-[var(--text-muted)] hover:text-indigo-400 transition-colors"
                                          >
                                            <span>{cad.label}</span>
                                            <ExternalLink size={9} />
                                          </a>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  {(hasFase2Dias || hasFase2Gabaritos) && (
                                    <div className="space-y-1.5 text-left">
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
                                            className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-purple-500 text-xs font-bold transition-all group/btn"
                                          >
                                            <div className="flex items-center gap-2 min-w-0">
                                              <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-purple-500" />
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
                                </div>
                              );
                            })()}

                            {/* UNICAMP Cadernos */}
                            {isUnicamp && (() => {
                              const unicampData = getUnicampYearItem(item.year);
                              return (
                                <div className="space-y-3">
                                  <div className="space-y-1.5 text-left">
                                    <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                                      1ª FASE — {unicampData?.fase1.isDiscursiva ? 'Prova Discursiva' : 'Prova Objetiva'}
                                    </span>
                                    <div className="grid grid-cols-2 gap-2">
                                      <a
                                        href={unicampData?.fase1.provaUrl || getExamLink(vest, item.year)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-emerald-500 text-xs font-bold transition-all group/btn"
                                      >
                                        <div className="flex items-center gap-2">
                                          <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-emerald-500" />
                                          <span>{unicampData?.fase1.provaLabel || 'Caderno 1ª Fase (PDF)'}</span>
                                        </div>
                                        <ExternalLink size={10} className="opacity-40 group-hover/btn:opacity-100" />
                                      </a>
                                      {unicampData?.fase1.gabaritoUrl && (
                                        <a
                                          href={unicampData.fase1.gabaritoUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all group/btn"
                                        >
                                          <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-emerald-500" />
                                            <span>Gabarito 1ªF (PDF)</span>
                                          </div>
                                          <ExternalLink size={10} className="opacity-70 group-hover/btn:opacity-100" />
                                        </a>
                                      )}
                                    </div>
                                  </div>

                                  {unicampData?.fase2 && unicampData.fase2.dias.length > 0 && (
                                    <div className="space-y-1.5 text-left">
                                      <span className="text-[10px] font-black uppercase text-teal-600 dark:text-teal-400 tracking-wider">
                                        2ª FASE — Provas Específicas
                                      </span>
                                      <div className="grid grid-cols-2 gap-2">
                                        {unicampData.fase2.dias.map(d => (
                                          <a
                                            key={d.label}
                                            href={d.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-teal-500 text-xs font-bold transition-all group/btn"
                                          >
                                            <div className="flex items-center gap-2">
                                              <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-teal-500" />
                                              <span>2ª Fase {d.label}</span>
                                            </div>
                                            <ExternalLink size={10} className="opacity-40 group-hover/btn:opacity-100" />
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })()}

                            {/* UNESP Cadernos */}
                            {isUnesp && (() => {
                              const unespData = getUnespYearItem(item.year);
                              return (
                                <div className="space-y-3">
                                  {/* 1ª Fase */}
                                  <div className="space-y-1.5 text-left">
                                    <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                                      1ª FASE — Conhecimentos Gerais (VUNESP)
                                    </span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      <a
                                        href={unespData?.fase1ProvaUrl || getExamLink(vest, item.year)}
                                        download={unespData?.fase1ProvaUrl?.startsWith('/assets/')}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-amber-500 text-xs font-bold transition-all group/btn"
                                      >
                                        <div className="flex items-center gap-2">
                                          {unespData?.fase1ProvaUrl?.startsWith('/assets/') ? (
                                            <Download size={13} className="text-amber-500 shrink-0" />
                                          ) : (
                                            <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-amber-500" />
                                          )}
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
                                            {unespData.fase1GabaritoUrl.startsWith('/assets/') ? (
                                              <Download size={13} className="text-emerald-500 shrink-0" />
                                            ) : (
                                              <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-emerald-500" />
                                            )}
                                            <span>Gabarito Oficial (PDF)</span>
                                          </div>
                                          <ExternalLink size={10} className="opacity-70 group-hover/btn:opacity-100" />
                                        </a>
                                      )}
                                    </div>
                                  </div>

                                  {/* 2ª Fase */}
                                  {(unespData?.fase2Cadernos || unespData?.fase2ProvaUrl) && (
                                    <div className="space-y-1.5 text-left pt-1 border-t border-[var(--border-light)]">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">
                                          2ª FASE — Provas Específicas & Redação
                                        </span>
                                        {unespData?.fase2Cadernos && (
                                          <span className="text-[10px] font-bold text-amber-400/90 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                                            {unespData.fase2Cadernos.length} Cadernos
                                          </span>
                                        )}
                                      </div>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {unespData?.fase2Cadernos ? (
                                          unespData.fase2Cadernos.map((cad) => (
                                            <a
                                              key={cad.disciplina}
                                              href={cad.url}
                                              download
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 hover:border-amber-500 hover:bg-amber-500/20 text-xs font-bold text-amber-300 transition-all group/btn"
                                            >
                                              <div className="flex items-center gap-2 truncate">
                                                <Download size={12} className="text-amber-400 shrink-0" />
                                                <span className="truncate">{cad.disciplina}</span>
                                              </div>
                                              <ExternalLink size={10} className="opacity-60 group-hover/btn:opacity-100 shrink-0 ml-1" />
                                            </a>
                                          ))
                                        ) : unespData?.fase2ProvaUrl ? (
                                          <a
                                            href={unespData.fase2ProvaUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-amber-500 text-xs font-bold transition-all group/btn"
                                          >
                                            <div className="flex items-center gap-2">
                                              <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-amber-500" />
                                              <span>Prova 2ª Fase (PDF)</span>
                                            </div>
                                            <ExternalLink size={10} className="opacity-40 group-hover/btn:opacity-100" />
                                          </a>
                                        ) : null}
                                        {unespData?.fase2GabaritoUrl && (
                                          <a
                                            href={unespData.fase2GabaritoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all group/btn"
                                          >
                                            <div className="flex items-center gap-2">
                                              <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-emerald-500" />
                                              <span>Gabarito 2ª Fase</span>
                                            </div>
                                            <ExternalLink size={10} className="opacity-70 group-hover/btn:opacity-100" />
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })()}

                            {/* UERJ Cadernos */}
                            {isUerj && (() => {
                              const uerjData = getUerjYearItem(item.year);
                              return (
                                <div className="space-y-1.5 text-left">
                                  <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 tracking-wider">
                                    1º EXAME DE QUALIFICAÇÃO (1º EQ)
                                  </span>
                                  <div className="grid grid-cols-2 gap-2">
                                    <a
                                      href={uerjData?.eq1ProvaUrl || getExamLink(vest, item.year)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-purple-500 text-xs font-bold transition-all group/btn"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-purple-500" />
                                        <span>Caderno 1º EQ (PDF)</span>
                                      </div>
                                      <ExternalLink size={10} className="opacity-40 group-hover/btn:opacity-100" />
                                    </a>
                                    {uerjData?.eq1GabaritoUrl && (
                                      <a
                                        href={uerjData.eq1GabaritoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all group/btn"
                                      >
                                        <div className="flex items-center gap-2">
                                          <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-emerald-500" />
                                          <span>Gabarito 1º EQ (PDF)</span>
                                        </div>
                                        <ExternalLink size={10} className="opacity-70 group-hover/btn:opacity-100" />
                                      </a>
                                    )}
                                  </div>
                                </div>
                              );
                            })()}

                            {/* IME Cadernos */}
                            {isIme && (() => {
                              const imeData = getImeYearItem(item.year);
                              const provaUrl = imeData?.fase1.provaUrl || getExamLink(vest, item.year);
                              return (
                                <div className="space-y-2 text-left">
                                  <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                                    1ª FASE — Prova Objetiva
                                  </span>
                                  <div className="grid grid-cols-2 gap-2">
                                    <a
                                      href={provaUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-emerald-500 text-xs font-bold transition-all group/btn"
                                    >
                                      <div className="flex items-center gap-2 truncate">
                                        <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-emerald-500" />
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
                                          <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-emerald-500" />
                                          <span className="truncate">Gabarito Oficial (PDF)</span>
                                        </div>
                                        <ExternalLink size={10} className="opacity-70 group-hover/btn:opacity-100 shrink-0 ml-1" />
                                      </a>
                                    )}
                                  </div>

                                  {/* 2ª Fase if available */}
                                  {imeData?.fase2?.discursivas && imeData.fase2.discursivas.length > 0 && (
                                    <div className="space-y-1.5 pt-1 border-t border-[var(--border-light)]">
                                      <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                                        2ª FASE — Provas Discursivas
                                      </span>
                                      <div className="grid grid-cols-2 gap-2">
                                        {imeData.fase2.discursivas.map(disc => (
                                          <a
                                            key={disc.nome}
                                            href={disc.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-emerald-500 text-xs font-bold transition-all group/btn"
                                          >
                                            <div className="flex items-center gap-1.5 truncate">
                                              <span className={`w-2 h-2 rounded-full shrink-0 ${disc.isGabarito ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                              <span className="truncate">{disc.nome}</span>
                                            </div>
                                            <ExternalLink size={9} className="opacity-40 group-hover/btn:opacity-100 shrink-0 ml-1" />
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })()}

                            {/* ITA Cadernos */}
                            {isIta && (
                              <div className="space-y-2 text-left">
                                <span className="text-[10px] font-black uppercase text-blue-500 tracking-wider">
                                  CADERNOS OFICIAIS ITA {item.year}
                                </span>
                                {item.year === '2027' ? (
                                  <div className="space-y-2">
                                    <a
                                      href={getItaExamLink('2027', '1')}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-blue-500 text-xs font-bold transition-all group/btn"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-blue-500" />
                                        <span>1ª Fase — Prova Objetiva 2027 (PDF)</span>
                                      </div>
                                      <ExternalLink size={10} className="opacity-40 group-hover/btn:opacity-100" />
                                    </a>
                                    <div className="grid grid-cols-2 gap-2">
                                      <a
                                        href={getItaExamLink('2027', '2', 'Matemática')}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-amber-500 text-xs font-bold transition-all group/btn"
                                      >
                                        <div className="flex items-center gap-2 truncate">
                                          <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-amber-400" />
                                          <span className="truncate">2ª Fase Matemática (PDF)</span>
                                        </div>
                                        <ExternalLink size={10} className="opacity-40 group-hover/btn:opacity-100 shrink-0 ml-1" />
                                      </a>
                                      <a
                                        href={getItaExamLink('2027', '2', 'Química')}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-emerald-500 text-xs font-bold transition-all group/btn"
                                      >
                                        <div className="flex items-center gap-2 truncate">
                                          <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-emerald-500" />
                                          <span className="truncate">2ª Fase Química (PDF)</span>
                                        </div>
                                        <ExternalLink size={10} className="opacity-40 group-hover/btn:opacity-100 shrink-0 ml-1" />
                                      </a>
                                    </div>
                                  </div>
                                ) : (['2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010', '2009'].includes(item.year)) ? (
                                  <div className="space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                      {[
                                        { name: 'Física', dot: 'bg-sky-500' },
                                        { name: 'Português', dot: 'bg-purple-500' },
                                        { name: 'Inglês', dot: 'bg-rose-500' },
                                        { name: 'Matemática', dot: 'bg-amber-400' },
                                        { name: 'Química', dot: 'bg-emerald-500' },
                                      ].map((m) => (
                                        <a
                                          key={`ita-${item.year}-${m.name}`}
                                          href={getItaExamLink(item.year, 'unica', m.name)}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-blue-500 text-xs font-bold transition-all group/btn"
                                        >
                                          <div className="flex items-center gap-2 truncate">
                                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${m.dot}`} />
                                            <span className="truncate">Caderno {m.name}</span>
                                          </div>
                                          <ExternalLink size={10} className="opacity-40 group-hover/btn:opacity-100 shrink-0 ml-1" />
                                        </a>
                                      ))}
                                      <a
                                        href={getItaExamLink(item.year, 'gabarito')}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all group/btn"
                                      >
                                        <div className="flex items-center gap-2 truncate">
                                          <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-emerald-500" />
                                          <span className="truncate">Gabarito Oficial</span>
                                        </div>
                                        <ExternalLink size={10} className="opacity-70 group-hover/btn:opacity-100 shrink-0 ml-1" />
                                      </a>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-2 gap-2">
                                    <a
                                      href={getItaExamLink(item.year, '1')}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-blue-500 text-xs font-bold transition-all group/btn"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-blue-500" />
                                        <span>Prova Oficial (PDF)</span>
                                      </div>
                                      <ExternalLink size={10} className="opacity-40 group-hover/btn:opacity-100" />
                                    </a>
                                    <a
                                      href={getItaExamLink(item.year, 'gabarito')}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all group/btn"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-emerald-500" />
                                        <span>Gabarito Oficial (PDF)</span>
                                      </div>
                                      <ExternalLink size={10} className="opacity-70 group-hover/btn:opacity-100" />
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* UNIFESP Cadernos */}
                            {isUnifesp && (() => {
                              const unifespData = getUnifespYearItem(item.year);
                              return (
                                <div className="space-y-1.5 text-left">
                                  <span className="text-[10px] font-black uppercase text-teal-600 dark:text-teal-400 tracking-wider">
                                    SISTEMA MISTO (MEDICINA & SAÚDE)
                                  </span>
                                  <div className="grid grid-cols-2 gap-2">
                                    <a
                                      href={unifespData?.cadernoMistoUrl || getExamLink(vest, item.year)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-teal-500 text-xs font-bold transition-all group/btn"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-teal-500" />
                                        <span>Caderno Misto (PDF)</span>
                                      </div>
                                      <ExternalLink size={10} className="opacity-40 group-hover/btn:opacity-100" />
                                    </a>
                                    {unifespData?.gabaritoUrl && (
                                      <a
                                        href={unifespData.gabaritoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all group/btn"
                                      >
                                        <div className="flex items-center gap-2">
                                          <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-emerald-500" />
                                          <span>Gabarito Oficial (PDF)</span>
                                        </div>
                                        <ExternalLink size={10} className="opacity-70 group-hover/btn:opacity-100" />
                                      </a>
                                    )}
                                  </div>
                                </div>
                              );
                            })()}

                            {/* Mackenzie & FGV fallback */}
                            {(isMackenzie || isFgv || (!isEnem && !isFuvest && !isUnicamp && !isUnesp && !isUerj && !isIme && !isIta && !isUnifesp)) && (
                              <div className="space-y-1.5 text-left">
                                <span className="text-[10px] font-black uppercase text-[var(--primary)] tracking-wider">
                                  PROVAS E GABARITOS
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <a
                                    href={getExamLink(vest, item.year)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-[var(--primary)] text-xs font-bold transition-all group/btn"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-[var(--primary)]" />
                                      <span>Caderno Oficial {vest} (PDF)</span>
                                    </div>
                                    <ExternalLink size={10} className="opacity-40 group-hover/btn:opacity-100" />
                                  </a>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
