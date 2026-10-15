import React, { useState } from 'react';
import { ExternalLink, FileText, Search, CheckCircle2, Shield, Award } from 'lucide-react';
import { IME_ACERVO_TABLE, ImeConcursoItem } from '../data/ime_acervo';

interface Props {
  onSelectYear?: (ano: number) => void;
}

export default function ImeAcervoTable({ onSelectYear }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = IME_ACERVO_TABLE.filter(item => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.trim().toLowerCase();
    return (
      item.concurso.toLowerCase().includes(term) ||
      item.anoIngresso.toString().includes(term)
    );
  });

  return (
    <div className="space-y-4">
      {/* Header Info matching the user document */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-600/15 via-slate-900/40 to-amber-600/10 border border-emerald-500/20 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                <Shield size={10} />
                Acervo Oficial IME · CFG
              </span>
              <span className="text-xs text-[var(--text-secondary)] font-medium">Concursos 2007–2026 · @Hirata</span>
            </div>
            <h3 className="text-lg md:text-xl font-black text-[var(--text-primary)] mt-1 flex items-center gap-2">
              <span>Provas e Gabaritos IME (2007–2025/2026)</span>
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-2xl leading-relaxed">
              Links diretos para os PDFs oficiais hospedados pelo Instituto Militar de Engenharia. A 1ª fase contempla a prova objetiva e gabarito definitivo. A 2ª fase reúne cadernos discursivos de Matemática, Física, Química, Línguas e os gabaritos de questões de múltipla escolha de idiomas.
            </p>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0 self-start sm:self-center">
            <a
              href="https://www.ime.eb.mil.br/vestibular-cfg.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-sm"
            >
              <span>Portal Admissão IME</span>
              <ExternalLink size={12} />
            </a>
            <a
              href="https://www.ime.eb.mil.br/provas-anteriores.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--card-border)] border border-[var(--card-border)] text-[var(--text-primary)] text-xs font-bold transition-all shadow-sm"
            >
              <span>Acervo Histórico</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-4 pt-3 border-t border-[var(--card-border)]/50 flex items-center justify-between gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Filtrar por concurso (ex: 2025, 2024/2025)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--card-border)] text-xs text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-emerald-500"
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
              <th className="py-3 px-3.5 w-32 text-center">Concurso</th>
              <th className="py-3 px-3.5 w-48 sm:w-56">1ª fase – prova</th>
              <th className="py-3 px-3.5 w-44 sm:w-52">1ª fase – gabarito</th>
              <th className="py-3 px-3.5 min-w-[320px]">2ª fase – discursivas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--card-border)]/50 font-medium">
            {filteredItems.map((item) => (
              <tr 
                key={item.concurso}
                className="hover:bg-emerald-500/[0.04] transition-colors"
              >
                {/* Concurso / Ano */}
                <td className="py-3 px-3.5 text-center font-black text-xs text-[var(--text-primary)]">
                  <div className="inline-flex flex-col items-center px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--card-border)]">
                    <span className="font-extrabold text-[var(--text-primary)]">{item.concurso}</span>
                    <span className="text-[9px] text-[var(--text-secondary)] font-normal">Turma {item.anoIngresso}</span>
                  </div>
                </td>

                {/* 1ª Fase - Prova */}
                <td className="py-3 px-3.5">
                  {item.fase1.provaUrl ? (
                    <a
                      href={item.fase1.provaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-600 text-emerald-600 dark:text-emerald-400 hover:text-white border border-emerald-500/20 hover:border-emerald-600 text-xs font-black transition-all group"
                      title={`Baixar Prova Objetiva 1ª Fase IME ${item.concurso}`}
                    >
                      <FileText size={12} />
                      <span>Objetiva</span>
                      <ExternalLink size={10} className="opacity-60 group-hover:opacity-100" />
                    </a>
                  ) : item.fase1.materiasObjetivas ? (
                    <div className="flex flex-wrap items-center gap-1">
                      {item.fase1.materiasObjetivas.map((m) => (
                        <a
                          key={m.sigla}
                          href={m.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--card-border)] hover:bg-emerald-600 hover:text-white text-[11px] font-bold transition-all"
                          title={m.nome}
                        >
                          <span>{m.sigla}</span>
                          <ExternalLink size={9} />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[var(--text-secondary)]">—</span>
                  )}
                </td>

                {/* 1ª Fase - Gabarito */}
                <td className="py-3 px-3.5">
                  {item.fase1.gabaritoUrl ? (
                    <a
                      href={item.fase1.gabaritoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-500/10 hover:bg-teal-600 text-teal-600 dark:text-teal-400 hover:text-white border border-teal-500/20 hover:border-teal-600 text-xs font-black transition-all group"
                      title={`Abrir Gabarito Definitivo IME ${item.concurso}`}
                    >
                      <CheckCircle2 size={12} />
                      <span>Gabarito Oficial</span>
                      <ExternalLink size={10} className="opacity-60 group-hover:opacity-100" />
                    </a>
                  ) : (
                    <span className="text-[var(--text-secondary)]">—</span>
                  )}
                </td>

                {/* 2ª Fase - Discursivas */}
                <td className="py-3 px-3.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {item.fase2.discursivas.map((d, i) => (
                      <React.Fragment key={`${d.sigla}-${i}`}>
                        <a
                          href={d.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all shadow-2xs group ${
                            d.isGabarito
                              ? 'bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white'
                              : 'bg-[var(--bg-secondary)] border border-[var(--card-border)] hover:bg-emerald-600 hover:text-white hover:border-emerald-600'
                          }`}
                          title={`Baixar Prova 2ª Fase ${d.nome} IME ${item.concurso}`}
                        >
                          <span>{d.sigla}</span>
                          <ExternalLink size={10} className="opacity-50 group-hover:opacity-100" />
                        </a>
                        {i < item.fase2.discursivas.length - 1 && (
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

      {/* Footer observation note */}
      <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)]/60 border border-[var(--card-border)] text-xs text-[var(--text-secondary)] space-y-1">
        <p className="font-semibold text-[var(--text-primary)]">
          Padrão do Concurso de Admissão ao CFG/IME:
        </p>
        <p className="text-[11px] leading-relaxed">
          O vestibular do IME adota a nomenclatura Concurso (ex: 2024/2025 para ingresso no ano de 2025). A 1ª fase contém prova de múltipla escolha (Matemática, Física e Química). A 2ª fase reúne cadernos discursivos com resolução passo a passo e prova mista de línguas com gabarito oficial definitivo.
        </p>
      </div>
    </div>
  );
}
