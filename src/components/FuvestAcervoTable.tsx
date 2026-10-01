import React, { useState } from 'react';
import { ExternalLink, FileText, Search, CheckCircle2, BookOpen, Calendar, HelpCircle, Layers } from 'lucide-react';
import { FUVEST_ACERVO_TABLE, FuvestYearItem } from '../data/fuvest_acervo';

interface Props {
  onSelectYear?: (ano: number) => void;
}

export default function FuvestAcervoTable({ onSelectYear }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = FUVEST_ACERVO_TABLE.filter(item => {
    if (!searchTerm.trim()) return true;
    return item.ano.toString().includes(searchTerm.trim());
  });

  return (
    <div className="space-y-4">
      {/* Header Info matching the user document */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 via-sky-500/5 to-indigo-500/10 border border-blue-500/20 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                Acervo Oficial Fuvest
              </span>
              <span className="text-xs text-[var(--text-secondary)]">2007–2026</span>
            </div>
            <h3 className="text-lg md:text-xl font-black text-[var(--text-primary)] mt-1 flex items-center gap-2">
              <span>Provas Fuvest 2007–2026</span>
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-2xl leading-relaxed">
              Cada link abre direto o PDF no site oficial da Fuvest. Na 1ª fase de 2026 e 2025 disponibilizamos a Versão V1 oficial, e em 2024 a Versão V oficial com os gabaritos correspondentes.
            </p>
          </div>

          <a
            href="https://www.fuvest.br/vestibular-da-usp/"
            target="_blank"
            rel="noopener noreferrer"
            className="self-start sm:self-center shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm"
          >
            <span>Portal Fuvest</span>
            <ExternalLink size={12} />
          </a>
        </div>

        {/* Filter bar */}
        <div className="mt-4 pt-3 border-t border-[var(--card-border)]/50 flex items-center justify-between gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Filtrar por ano (ex: 2024, 2018)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--card-border)] text-xs text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-blue-500"
            />
          </div>
          <span className="text-[11px] font-bold text-[var(--text-secondary)]">
            {filteredItems.length} {filteredItems.length === 1 ? 'edição' : 'edições'}
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[var(--card-border)] bg-[var(--bg-secondary)]/70 text-[10px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
              <th className="py-3 px-3.5 w-20 text-center">Ano</th>
              <th className="py-3 px-3.5 w-52 sm:w-60">1ª fase – prova</th>
              <th className="py-3 px-3.5 w-32 sm:w-36">1ª fase – gabarito</th>
              <th className="py-3 px-3.5 min-w-[280px]">2ª fase</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--card-border)]/50 font-medium">
            {filteredItems.map((item) => (
              <tr 
                key={item.ano}
                className="hover:bg-blue-500/[0.04] transition-colors"
              >
                {/* Ano */}
                <td className="py-3 px-3.5 text-center font-black text-sm text-[var(--text-primary)]">
                  <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--card-border)]">
                    {item.ano}
                  </span>
                </td>

                {/* 1ª Fase - Prova */}
                <td className="py-3 px-3.5">
                  {item.fase1.versoes && item.fase1.versoes.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-1.5">
                      {item.fase1.versoes.map((v, i) => (
                        <React.Fragment key={v.label}>
                          <a
                            href={v.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[var(--bg-secondary)] border border-[var(--card-border)] hover:bg-blue-600 hover:text-white hover:border-blue-600 text-xs font-black transition-all shadow-2xs group"
                            title={`Baixar Prova Versão ${v.label} Fuvest ${item.ano} (PDF)`}
                          >
                            <span>{v.label}</span>
                            <ExternalLink size={10} className="opacity-60 group-hover:opacity-100" />
                          </a>
                          {i < item.fase1.versoes!.length - 1 && (
                            <span className="text-[var(--text-secondary)]/50 select-none">·</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  ) : item.fase1.provaUrl ? (
                    <a
                      href={item.fase1.provaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-500/10 hover:bg-blue-600 text-blue-600 dark:text-blue-400 hover:text-white border border-blue-500/20 hover:border-blue-600 text-xs font-black transition-all group"
                      title={`Baixar Prova Completa 1ª Fase Fuvest ${item.ano} (PDF)`}
                    >
                      <FileText size={12} />
                      <span>Prova</span>
                      <ExternalLink size={10} className="opacity-60 group-hover:opacity-100" />
                    </a>
                  ) : (
                    <span className="text-[var(--text-secondary)]">—</span>
                  )}
                </td>

                {/* 1ª Fase - Gabarito */}
                <td className="py-3 px-3.5">
                  <a
                    href={item.fase1.gabaritoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-600 text-emerald-600 dark:text-emerald-400 hover:text-white border border-emerald-500/20 hover:border-emerald-600 text-xs font-black transition-all group"
                    title={`Baixar Gabarito Oficial 1ª Fase Fuvest ${item.ano} (PDF)`}
                  >
                    <CheckCircle2 size={12} />
                    <span>Gabarito</span>
                    <ExternalLink size={10} className="opacity-60 group-hover:opacity-100" />
                  </a>
                </td>

                {/* 2ª Fase */}
                <td className="py-3 px-3.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Dias de Prova (ex: Dia 1 · Dia 2 · Dia 3) */}
                    {item.fase2.dias && item.fase2.dias.map((d, i) => (
                      <React.Fragment key={d.label}>
                        <a
                          href={d.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-500/10 hover:bg-purple-600 text-purple-600 dark:text-purple-400 hover:text-white border border-purple-500/20 hover:border-purple-600 text-xs font-bold transition-all group"
                          title={`Baixar Prova 2ª Fase ${d.label} Fuvest ${item.ano} (PDF)`}
                        >
                          <span>{d.label}</span>
                          <ExternalLink size={10} className="opacity-60 group-hover:opacity-100" />
                        </a>
                        {(i < item.fase2.dias!.length - 1 || item.fase2.respostasEsperadasUrl) && (
                          <span className="text-[var(--text-secondary)]/50 select-none">·</span>
                        )}
                      </React.Fragment>
                    ))}

                    {/* Respostas Esperadas / Guia */}
                    {item.fase2.respostasEsperadasUrl && (
                      <a
                        href={item.fase2.respostasEsperadasUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/10 hover:bg-amber-600 text-amber-600 dark:text-amber-400 hover:text-white border border-amber-500/20 hover:border-amber-600 text-xs font-bold transition-all group"
                        title={`Baixar Respostas Esperadas 2ª Fase Fuvest ${item.ano} (PDF)`}
                      >
                        <BookOpen size={11} />
                        <span>Respostas esperadas</span>
                        <ExternalLink size={10} className="opacity-60 group-hover:opacity-100" />
                      </a>
                    )}

                    {/* Matérias (Bio · Fís · Geo · His · Mat · Por · Quí) */}
                    {item.fase2.materias && item.fase2.materias.map((m, i) => (
                      <React.Fragment key={m.sigla}>
                        <a
                          href={m.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--bg-secondary)] border border-[var(--card-border)] hover:bg-indigo-600 hover:text-white hover:border-indigo-600 text-xs font-bold transition-all group"
                          title={`Baixar Prova 2ª Fase de ${m.nome} Fuvest ${item.ano} (PDF)`}
                        >
                          <span>{m.sigla}</span>
                          <ExternalLink size={9} className="opacity-50 group-hover:opacity-100" />
                        </a>
                        {i < item.fase2.materias!.length - 1 && (
                          <span className="text-[var(--text-secondary)]/50 select-none">·</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Note matching user document */}
      <div className="p-3 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
        <div className="flex items-center gap-2">
          <HelpCircle size={14} className="text-blue-500 shrink-0" />
          <span>
            <strong>Fonte:</strong> <a href="https://www.fuvest.br/vestibular-da-usp/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline font-bold">Acervo – Vestibular da USP (Fuvest)</a>, onde também ficam notas de corte e listas de chamada de cada ano.
          </span>
        </div>
      </div>
    </div>
  );
}
