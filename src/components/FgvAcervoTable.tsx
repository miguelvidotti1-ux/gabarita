import React, { useState } from 'react';
import { ExternalLink, Archive, Search, CheckCircle2, Download, Briefcase } from 'lucide-react';
import { FGV_ACERVO_TABLE, FgvEdicao } from '../data/novos_acervos';

export default function FgvAcervoTable() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = FGV_ACERVO_TABLE.filter(item => {
    const term = searchTerm.toLowerCase();
    return item.edicao.toLowerCase().includes(term) || item.cursoOuUnidade.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-950/60 via-orange-900/30 to-slate-950 border border-orange-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs font-black uppercase tracking-wider border border-orange-500/30">
              <CheckCircle2 size={13} className="text-orange-400" />
              Fundação Getulio Vargas · Pacotes Oficiais (2022–2026)
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Acervo de Provas, Gabaritos e Grades FGV
            </h3>
            <p className="text-xs sm:text-sm text-orange-200/80 max-w-2xl leading-relaxed">
              Pacotes completos oficiais (ZIP) com provas objetivas, discursivas, propostas de redação, gabaritos oficiais e grades analíticas de correção.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://vestibular.fgv.br/provas-gabaritos"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-bold text-orange-300 bg-orange-500/10 hover:bg-orange-500/25 border border-orange-500/30 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <ExternalLink size={14} />
              <span>Portal FGV</span>
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
            placeholder="Buscar por edição ou curso FGV (ex: 2026, Direito, RI, Unificado)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border-light)] rounded-xl text-xs font-semibold outline-none focus:border-orange-500 transition-all text-[var(--text-main)]"
          />
        </div>
      </div>

      {/* Cards list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-[var(--border-light)] bg-[var(--bg-card)] hover:border-orange-500/40 transition-all space-y-3.5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20 inline-block mb-1.5">
                  {item.edicao}
                </span>
                <h4 className="text-base font-black text-[var(--text-main)] flex items-center gap-1.5">
                  <Briefcase size={15} className="text-orange-400 shrink-0" />
                  {item.cursoOuUnidade}
                </h4>
              </div>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {item.conteudoPacote}
            </p>

            <div className="pt-2 border-t border-[var(--border-light)] flex items-center justify-between">
              <a
                href={item.pacoteZipUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-4 rounded-xl text-xs font-extrabold bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Download size={14} />
                <span>Baixar Pacote Completo (ZIP)</span>
              </a>
              <a
                href={item.portalOficialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-orange-400 hover:underline flex items-center gap-1"
              >
                <span>Portal</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
