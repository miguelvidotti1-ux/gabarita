import React, { useState } from 'react';
import { ExternalLink, FileText, Search, CheckCircle2, Calendar, MapPin } from 'lucide-react';
import { MACKENZIE_ACERVO_TABLE, MackenzieEdicao } from '../data/novos_acervos';

export default function MackenzieAcervoTable() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = MACKENZIE_ACERVO_TABLE.filter(item => {
    const term = searchTerm.toLowerCase();
    return item.semestre.toLowerCase().includes(term) || item.campusOuCurso.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/60 via-red-900/30 to-slate-950 border border-red-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-xs font-black uppercase tracking-wider border border-red-500/30">
              <CheckCircle2 size={13} className="text-red-400" />
              Universidade Presbiteriana Mackenzie · Provas Oficiais
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Acervo Oficial de Provas e Gabaritos Mackenzie
            </h3>
            <p className="text-xs sm:text-sm text-red-200/80 max-w-2xl leading-relaxed">
              PDFs oficiais diretos de provas e gabaritos dos processos seletivos regulares (Higienópolis, Campinas e Medicina Alphaville).
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href="https://www.mackenzie.br/processos-seletivos/vestibular-graduacao/sao-paulo-higienopolis"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-red-300 bg-red-500/10 hover:bg-red-500/25 border border-red-500/30 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <ExternalLink size={13} />
              <span>Higienópolis</span>
            </a>
            <a
              href="https://www.mackenzie.br/processos-seletivos/vestibular-graduacao/medicina"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-red-300 bg-red-500/10 hover:bg-red-500/25 border border-red-500/30 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <ExternalLink size={13} />
              <span>Medicina</span>
            </a>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Buscar por edição ou curso (ex: 2026/1, Medicina, Higienópolis)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border-light)] rounded-xl text-xs font-semibold outline-none focus:border-red-500 transition-all text-[var(--text-main)]"
          />
        </div>
      </div>

      {/* Cards list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-[var(--border-light)] bg-[var(--bg-card)] hover:border-red-500/40 transition-all space-y-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                    {item.semestre}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                    <Calendar size={12} />
                    {item.dataRealizacao}
                  </span>
                </div>
                <h4 className="text-base font-black text-[var(--text-main)] flex items-center gap-1.5">
                  <MapPin size={15} className="text-red-400 shrink-0" />
                  {item.campusOuCurso}
                </h4>
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--border-light)] flex flex-wrap gap-2.5">
              <a
                href={item.provaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-bold bg-red-500/10 text-red-300 hover:bg-red-500/25 border border-red-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText size={14} />
                <span>Prova (PDF)</span>
                <ExternalLink size={11} />
              </a>
              <a
                href={item.gabaritoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 size={14} />
                <span>Gabarito Oficial (PDF)</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
