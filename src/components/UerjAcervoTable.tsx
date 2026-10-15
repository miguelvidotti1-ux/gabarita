import React, { useState } from 'react';
import { ExternalLink, FileText, Search, CheckCircle2, Bookmark, Award, BookOpen } from 'lucide-react';
import { UERJ_ACERVO_TABLE, UerjEdicao } from '../data/novos_acervos';

interface Props {
  onSelectYear?: (ano: number) => void;
}

export default function UerjAcervoTable({ onSelectYear }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = UERJ_ACERVO_TABLE.filter(item => {
    const term = searchTerm.toLowerCase();
    return item.ano.toString().includes(term) || item.rotulo.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 via-purple-900/30 to-slate-950 border border-purple-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-black uppercase tracking-wider border border-purple-500/30">
              <CheckCircle2 size={13} className="text-purple-400" />
              Vestibular Estadual UERJ · DSEA (2007–2026)
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Acervo Oficial de Provas e Gabaritos UERJ
            </h3>
            <p className="text-xs sm:text-sm text-purple-200/80 max-w-2xl leading-relaxed">
              Exames de Qualificação (1º e 2º EQ), Exame Discursivo, Padrões de Resposta oficiais e cadernos históricos da DSE/DSEA.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://www.vestibular.uerj.br/?page_id=7069"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-bold text-purple-300 bg-purple-500/10 hover:bg-purple-500/25 border border-purple-500/30 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <ExternalLink size={14} />
              <span>Portal DSEA</span>
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
            placeholder="Buscar por ano da UERJ (ex: 2025, 2023)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border-light)] rounded-xl text-xs font-semibold outline-none focus:border-purple-500 transition-all text-[var(--text-main)]"
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
                <th className="py-3 px-4">Ano</th>
                <th className="py-3 px-4">1º Exame Qualificação</th>
                <th className="py-3 px-4">2º Exame Qualificação</th>
                <th className="py-3 px-4">Discursivo / Gabarito</th>
                <th className="py-3 px-4">Página Oficial / Acesso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              {filteredItems.map((item, idx) => (
                <tr key={`${item.ano}-${idx}`} className="hover:bg-[var(--bg-hover)]/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 font-black flex items-center justify-center shrink-0">
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
                    {item.eq1ProvaUrl ? (
                      <a
                        href={item.eq1ProvaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/25 transition-all"
                      >
                        <FileText size={12} />
                        <span>1º EQ Prova</span>
                        <ExternalLink size={10} />
                      </a>
                    ) : (
                      <span className="text-[var(--text-label)] italic text-[11px]">—</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    {item.eq2ProvaUrl ? (
                      <a
                        href={item.eq2ProvaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/25 transition-all"
                      >
                        <FileText size={12} />
                        <span>2º EQ Prova</span>
                        <ExternalLink size={10} />
                      </a>
                    ) : (
                      <span className="text-[var(--text-label)] italic text-[11px]">—</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-1 items-start">
                      {item.eq1GabaritoUrl && (
                        <a
                          href={item.eq1GabaritoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:underline"
                        >
                          <CheckCircle2 size={11} />
                          <span>Gabarito Retificado (PDF)</span>
                        </a>
                      )}
                      {item.padroesRespostaUrl && (
                        <a
                          href={item.padroesRespostaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:underline"
                        >
                          <Award size={11} />
                          <span>Padrões de Resposta</span>
                        </a>
                      )}
                      {!item.eq1GabaritoUrl && !item.padroesRespostaUrl && (
                        <span className="text-[var(--text-label)] italic text-[11px]">Na página oficial</span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <a
                      href={item.paginaOficialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[var(--bg-hover)] text-purple-300 hover:bg-purple-500/20 border border-[var(--border-light)] transition-all"
                    >
                      <span>Abrir Página</span>
                      <ExternalLink size={10} />
                    </a>
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
