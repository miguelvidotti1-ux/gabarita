import React, { useState } from 'react';
import { ExternalLink, FileText, Search, CheckCircle2, Download, Archive, BookOpen, AlertCircle } from 'lucide-react';
import { UNESP_ACERVO_TABLE, UnespEdicao } from '../data/novos_acervos';

interface Props {
  onSelectYear?: (ano: number) => void;
}

export default function UnespAcervoTable({ onSelectYear }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = UNESP_ACERVO_TABLE.filter(item => {
    const term = searchTerm.toLowerCase();
    return item.ano.toString().includes(term) || item.rotulo.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/60 via-amber-900/30 to-slate-950 border border-amber-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-black uppercase tracking-wider border border-amber-500/30">
              <CheckCircle2 size={13} className="text-amber-400" />
              Acervo Oficial UNESP · VUNESP (2007–2026)
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Tabela Completa de Provas e Gabaritos UNESP
            </h3>
            <p className="text-xs sm:text-sm text-amber-200/80 max-w-2xl leading-relaxed">
              Cadernos oficiais de 1ª e 2ª fase, gabaritos retificados, pacotes completos de download (ZIP/RAR) e resoluções comentadas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://vestibular.unesp.br/provas-e-gabaritos/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/30 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <ExternalLink size={14} />
              <span>Portal VUNESP</span>
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
            placeholder="Buscar por ano ou edição (ex: 2025, meio do ano)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border-light)] rounded-xl text-xs font-semibold outline-none focus:border-amber-500 transition-all text-[var(--text-main)]"
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
                <th className="py-3 px-4">1ª Fase — Provas</th>
                <th className="py-3 px-4">Gabarito 1ª Fase</th>
                <th className="py-3 px-4">2ª Fase / Discursiva</th>
                <th className="py-3 px-4">Pacote Completo / Resoluções</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              {filteredItems.map((item, idx) => (
                <tr key={`${item.ano}-${idx}`} className="hover:bg-[var(--bg-hover)]/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 font-black flex items-center justify-center shrink-0">
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
                    {item.fase1ProvaUrl ? (
                      <a
                        href={item.fase1ProvaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/25 transition-all"
                      >
                        <FileText size={12} />
                        <span>Caderno 1ª F</span>
                        <ExternalLink size={10} />
                      </a>
                    ) : (
                      <span className="text-[var(--text-label)] italic text-[11px]">No pacote ZIP</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    {item.fase1GabaritoUrl ? (
                      <a
                        href={item.fase1GabaritoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25 transition-all"
                      >
                        <CheckCircle2 size={12} />
                        <span>Gabarito Oficial</span>
                        <ExternalLink size={10} />
                      </a>
                    ) : (
                      <span className="text-[var(--text-label)] italic text-[11px]">—</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-1 items-start">
                      {item.fase2ProvaUrl && (
                        <a
                          href={item.fase2ProvaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:underline"
                        >
                          <FileText size={11} />
                          <span>Prova 2ª Fase</span>
                        </a>
                      )}
                      {item.fase2GabaritoUrl && (
                        <a
                          href={item.fase2GabaritoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 hover:underline"
                        >
                          <CheckCircle2 size={11} />
                          <span>Gabarito 2ª F</span>
                        </a>
                      )}
                      {!item.fase2ProvaUrl && !item.fase2GabaritoUrl && (
                        <span className="text-[var(--text-label)] italic text-[11px]">No pacote ZIP / Portal</span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-2 items-center">
                      {item.pacoteZipUrl && (
                        <a
                          href={item.pacoteZipUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/25 transition-all"
                        >
                          <Download size={11} />
                          <span>Download ZIP</span>
                        </a>
                      )}
                      {item.resolucaoObjetivoUrl && (
                        <a
                          href={item.resolucaoObjetivoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-amber-400 border border-[var(--border-light)] transition-all"
                        >
                          <BookOpen size={11} />
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
