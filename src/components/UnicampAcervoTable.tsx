import React, { useState } from 'react';
import { ExternalLink, FileText, Search, CheckCircle2, BookOpen, Layers } from 'lucide-react';
import { UNICAMP_ACERVO_TABLE, UnicampYearItem } from '../data/unicamp_acervo';

interface Props {
  onSelectYear?: (ano: number) => void;
}

export default function UnicampAcervoTable({ onSelectYear }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = UNICAMP_ACERVO_TABLE.filter(item => {
    if (!searchTerm.trim()) return true;
    return item.ano.toString().includes(searchTerm.trim());
  });

  return (
    <div className="space-y-4">
      {/* Header Info matching the user document */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border border-emerald-500/20 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                Acervo Oficial Unicamp
              </span>
              <span className="text-xs text-[var(--text-secondary)] font-medium">2007–2025 · @Hirata</span>
            </div>
            <h3 className="text-lg md:text-xl font-black text-[var(--text-primary)] mt-1 flex items-center gap-2">
              <span>Provas Unicamp 2007–2025</span>
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-2xl leading-relaxed">
              Cada link abre direto o PDF e a resolução comentada no Curso Objetivo, que guarda os cadernos originais de todas as edições. Na 1ª fase há várias versões da mesma prova; o link leva a uma delas e ao gabarito correspondente.
            </p>
            <p className="text-[11px] text-[var(--text-secondary)]/80 mt-1 max-w-2xl leading-relaxed">
              Até 2010 a 1ª fase era discursiva (redação + questões), por isso não tem gabarito. Na 2ª fase, a partir de 2020 o 2º dia passou a ter uma prova por área (Biológicas, Exatas, Humanas).
            </p>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0 self-start sm:self-center">
            <a
              href="https://www.curso-objetivo.br/vestibular/resolucao-comentada/unicamp.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm"
            >
              <span>Curso Objetivo</span>
              <ExternalLink size={12} />
            </a>
            <a
              href="https://www.comvest.unicamp.br/vestibulares-anteriores/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--card-border)] border border-[var(--card-border)] text-[var(--text-primary)] text-xs font-bold transition-all shadow-sm"
            >
              <span>Comvest Acervo</span>
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
              placeholder="Filtrar por ano (ex: 2025, 2020, 2015)..."
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
              <th className="py-3 px-3.5 w-20 text-center">Ano</th>
              <th className="py-3 px-3.5 w-48 sm:w-56">1ª fase – prova</th>
              <th className="py-3 px-3.5 w-44 sm:w-52">1ª fase – gabarito</th>
              <th className="py-3 px-3.5 min-w-[280px]">2ª fase – provas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--card-border)]/50 font-medium">
            {filteredItems.map((item) => (
              <tr 
                key={item.ano}
                className="hover:bg-emerald-500/[0.04] transition-colors"
              >
                {/* Ano */}
                <td className="py-3 px-3.5 text-center font-black text-sm text-[var(--text-primary)]">
                  <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--card-border)]">
                    {item.ano}
                  </span>
                </td>

                {/* 1ª Fase - Prova */}
                <td className="py-3 px-3.5">
                  <a
                    href={item.fase1.provaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-600 text-emerald-600 dark:text-emerald-400 hover:text-white border border-emerald-500/20 hover:border-emerald-600 text-xs font-black transition-all group"
                    title={`Baixar ${item.fase1.provaLabel} Unicamp ${item.ano}`}
                  >
                    <FileText size={12} />
                    <span>{item.fase1.provaLabel}</span>
                    <ExternalLink size={10} className="opacity-60 group-hover:opacity-100" />
                  </a>
                </td>

                {/* 1ª Fase - Gabarito */}
                <td className="py-3 px-3.5">
                  {item.fase1.isDiscursiva ? (
                    <span 
                      className="inline-block px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold"
                      title={item.fase1.observacao || '1ª fase discursiva (redação + questões)'}
                    >
                      discursiva
                    </span>
                  ) : item.fase1.gabaritoUrl ? (
                    <a
                      href={item.fase1.gabaritoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-500/10 hover:bg-teal-600 text-teal-600 dark:text-teal-400 hover:text-white border border-teal-500/20 hover:border-teal-600 text-xs font-black transition-all group"
                      title={item.fase1.observacao || `Abrir ${item.fase1.gabaritoLabel} Unicamp ${item.ano}`}
                    >
                      <CheckCircle2 size={12} />
                      <span>{item.fase1.gabaritoLabel}</span>
                      <ExternalLink size={10} className="opacity-60 group-hover:opacity-100" />
                    </a>
                  ) : (
                    <span className="text-[var(--text-secondary)]">—</span>
                  )}
                </td>

                {/* 2ª Fase */}
                <td className="py-3 px-3.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {item.fase2.dias.map((d, i) => (
                      <React.Fragment key={d.label}>
                        <a
                          href={d.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[var(--bg-secondary)] border border-[var(--card-border)] hover:bg-emerald-600 hover:text-white hover:border-emerald-600 text-xs font-bold transition-all shadow-2xs group"
                          title={`Baixar Prova 2ª Fase ${d.label} Unicamp ${item.ano}`}
                        >
                          <span>{d.label}</span>
                          <ExternalLink size={10} className="opacity-50 group-hover:opacity-100" />
                        </a>
                        {i < item.fase2.dias.length - 1 && (
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
          Nota sobre os gabaritos da 1ª fase de 2022 e 2023:
        </p>
        <p className="text-[11px] leading-relaxed">
          O gabarito oficial da 1ª fase de 2022 e 2023 está disponível na íntegra através da resolução comentada do Curso Objetivo, com as respostas e análises completas questão por questão. A 2ª fase é discursiva e não possui gabarito de múltipla escolha.
        </p>
      </div>
    </div>
  );
}
