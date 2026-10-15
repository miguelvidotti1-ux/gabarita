import React, { useState } from 'react';
import { ExternalLink, FileText, Search, CheckCircle2, Download, BookOpen } from 'lucide-react';
import { UNIFESP_ACERVO_TABLE, UnifespEdicao } from '../data/novos_acervos';

interface Props {
  onSelectYear?: (ano: number) => void;
}

export default function UnifespAcervoTable({ onSelectYear }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = UNIFESP_ACERVO_TABLE.filter(item => {
    const term = searchTerm.toLowerCase();
    return item.ano.toString().includes(term) || item.rotulo.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-950/60 via-teal-900/30 to-slate-950 border border-teal-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-black uppercase tracking-wider border border-teal-500/30">
              <CheckCircle2 size={13} className="text-teal-400" />
              Vestibular Misto UNIFESP (2007–2025)
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Acervo de Provas e Gabaritos UNIFESP
            </h3>
            <p className="text-xs sm:text-sm text-teal-200/80 max-w-2xl leading-relaxed">
              Sistema Misto (medicina e biomédicas), cadernos oficiais de questões, gabarito versão imprensa e resoluções comentadas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://ingresso.unifesp.br/vestibulares-anteriores.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-bold text-teal-300 bg-teal-500/10 hover:bg-teal-500/25 border border-teal-500/30 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <ExternalLink size={14} />
              <span>Portal Ingresso UNIFESP</span>
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
            placeholder="Buscar por ano UNIFESP (ex: 2025, 2024)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border-light)] rounded-xl text-xs font-semibold outline-none focus:border-teal-500 transition-all text-[var(--text-main)]"
          />
        </div>
        <span className="text-xs font-bold text-[var(--text-muted)] shrink-0">
          {filteredItems.length} edições catalogadas
        </span>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--bg-card)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[var(--bg-hover)] border-b border-[var(--border-light)] text-[var(--text-muted)] uppercase tracking-wider font-extrabold text-[10px]">
                <th className="py-3 px-4">Edição / Ano</th>
                <th className="py-3 px-4">Caderno de Questões</th>
                <th className="py-3 px-4">Gabarito Oficial</th>
                <th className="py-3 px-4">Resoluções & Portal Oficial</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              {filteredItems.map((item, idx) => (
                <tr key={`${item.ano}-${idx}`} className="hover:bg-[var(--bg-hover)]/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 font-black flex items-center justify-center shrink-0">
                        {item.ano.toString().slice(2)}
                      </span>
                      <div>
                        <span className="font-bold text-[var(--text-main)] block">{item.rotulo}</span>
                        {item.observacao && (
                          <span className="text-[10px] text-[var(--text-muted)] block line-clamp-1">{item.observacao}</span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {item.cadernoMistoUrl ? (
                      <a
                        href={item.cadernoMistoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-teal-500/10 text-teal-300 border border-teal-500/20 hover:bg-teal-500/25 transition-all"
                      >
                        <FileText size={12} />
                        <span>Caderno Misto (Download)</span>
                        <Download size={10} />
                      </a>
                    ) : (
                      <span className="text-[var(--text-label)] italic text-[11px]">Disponível na página oficial</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    {item.gabaritoUrl ? (
                      <a
                        href={item.gabaritoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25 transition-all"
                      >
                        <CheckCircle2 size={12} />
                        <span>Gabarito Versão Imprensa</span>
                        <Download size={10} />
                      </a>
                    ) : (
                      <span className="text-[var(--text-label)] italic text-[11px]">Disponível na página oficial</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-2 items-center">
                      <a
                        href={item.paginaOficialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-teal-500/15 text-teal-300 hover:bg-teal-500/30 border border-teal-500/30 transition-all"
                      >
                        <span>Página do Ano</span>
                        <ExternalLink size={10} />
                      </a>
                      {item.resolucaoObjetivoUrl && (
                        <a
                          href={item.resolucaoObjetivoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-teal-400 border border-[var(--border-light)] transition-all"
                        >
                          <BookOpen size={10} />
                          <span>Resolução</span>
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
