import React, { useState } from 'react';
import { ExternalLink, FileText, Search, CheckCircle2, BookOpen, Layers } from 'lucide-react';
import { FUVEST_ACERVO_TABLE, FuvestYearItem } from '../data/fuvest_acervo';

interface Props {
  onSelectYear?: (ano: number) => void;
}

export default function FuvestAcervoTable({ onSelectYear }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = FUVEST_ACERVO_TABLE.filter(item => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    const matchMain =
      item.ano.toString().includes(term) ||
      (item.rotulo && item.rotulo.toLowerCase().includes(term)) ||
      (item.observacao && item.observacao.toLowerCase().includes(term)) ||
      item.fase1.provaLabel.toLowerCase().includes(term) ||
      item.fase1.gabaritoLabel.toLowerCase().includes(term);
    const matchExtraGab = item.fase1.gabaritosAdicionais?.some(g => g.label.toLowerCase().includes(term));
    const matchF2Dias = item.fase2.dias.some(d => d.label.toLowerCase().includes(term));
    const matchF2Gab = item.fase2.gabaritos?.some(g => g.label.toLowerCase().includes(term));
    return Boolean(matchMain || matchExtraGab || matchF2Dias || matchF2Gab);
  });

  return (
    <div className="space-y-4">
      {/* Header Info Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-purple-500/10 border border-indigo-500/20 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                Acervo Oficial FUVEST · USP
              </span>
              <span className="text-xs text-[var(--text-secondary)] font-medium">2010–2027 · Acervo Gabarita</span>
            </div>
            <h3 className="text-lg md:text-xl font-black text-[var(--text-primary)] mt-1 flex items-center gap-2">
              <span>Provas FUVEST (USP) 2010–2027</span>
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-2xl leading-relaxed">
              Tabela histórica oficial com cadernos de 1ª Fase, Gabaritos definitivos e corrigidos, provas dissertativas de 2ª Fase e guias de respostas esperadas.
            </p>
            <p className="text-[11px] text-[var(--text-secondary)]/80 mt-1 max-w-2xl leading-relaxed">
              Até 2018 a 2ª fase era composta por 3 dias consecutivos de aplicação. A partir da FUVEST 2019, passou para 2 dias (Dia 1: Português e Redação; Dia 2: Disciplinas Específicas).
            </p>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0 self-start sm:self-center">
            <a
              href="https://www.fuvest.br/vestibular-da-usp/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-all flex items-center gap-1.5 shrink-0"
            >
              <ExternalLink size={13} />
              <span>Portal FUVEST</span>
            </a>
            <a
              href="https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 transition-all flex items-center gap-1.5 shrink-0"
            >
              <BookOpen size={13} />
              <span>Resoluções Objetivo</span>
            </a>
          </div>
        </div>
      </div>

      {/* Filter and Counter */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Buscar por ano, prova ou gabarito (ex: 2027, retificado, redação, matemática)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border-light)] rounded-xl text-xs font-semibold outline-none focus:border-indigo-500 transition-all text-[var(--text-main)]"
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
                <th className="py-3 px-4">1ª Fase (Prova)</th>
                <th className="py-3 px-4">1ª Fase (Gabarito)</th>
                <th className="py-3 px-4">2ª Fase (Provas e Gabaritos)</th>
                <th className="py-3 px-4">Resolução / Oficial</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              {filteredItems.map((item) => (
                <tr key={item.ano} className="hover:bg-[var(--bg-hover)]/60 transition-colors align-top">
                  {/* Ano */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-black flex items-center justify-center shrink-0">
                        {item.ano.toString().slice(2)}
                      </span>
                      <div>
                        <span className="font-bold text-[var(--text-main)] block">{item.rotulo || `FUVEST ${item.ano}`}</span>
                        {item.observacao && (
                          <span className="text-[10px] text-[var(--text-muted)] block line-clamp-2">{item.observacao}</span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* 1ª Fase Prova */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-1.5">
                      <a
                        href={item.fase1.provaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/25 transition-all w-fit"
                      >
                        <FileText size={12} className="shrink-0" />
                        <span>{item.fase1.provaLabel}</span>
                        <ExternalLink size={10} className="shrink-0" />
                      </a>
                      {item.fase1.cadernosAdicionais && item.fase1.cadernosAdicionais.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.fase1.cadernosAdicionais.map(cad => (
                            <a
                              key={cad.label}
                              href={cad.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-indigo-400 border border-[var(--border-light)] transition-colors"
                            >
                              {cad.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* 1ª Fase Gabarito */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-1.5">
                      <a
                        href={item.fase1.gabaritoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25 transition-all w-fit"
                      >
                        <CheckCircle2 size={12} className="shrink-0" />
                        <span>{item.fase1.gabaritoLabel}</span>
                        <ExternalLink size={10} className="shrink-0" />
                      </a>
                      {item.fase1.gabaritosAdicionais?.map((gab) => (
                        <a
                          key={gab.url}
                          href={gab.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 hover:bg-teal-500/25 transition-all w-fit"
                        >
                          <CheckCircle2 size={12} className="shrink-0" />
                          <span>{gab.label}</span>
                          <ExternalLink size={10} className="shrink-0" />
                        </a>
                      ))}
                    </div>
                  </td>

                  {/* 2ª Fase Dias e Gabaritos */}
                  <td className="py-3.5 px-4">
                    {item.fase2.dias.length === 0 && (!item.fase2.gabaritos || item.fase2.gabaritos.length === 0) ? (
                      <span className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-[var(--bg-hover)] text-[var(--text-muted)] border border-[var(--border-light)]">
                        2ª fase ainda não disponível
                      </span>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        {item.fase2.dias.map((dia, dIdx) => (
                          <a
                            key={`${dia.url}-${dIdx}`}
                            href={dia.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/25 transition-all w-fit"
                          >
                            <FileText size={12} className="shrink-0" />
                            <span>{dia.label}</span>
                            <ExternalLink size={10} className="shrink-0" />
                          </a>
                        ))}
                        {item.fase2.gabaritos?.map((gab, gIdx) => (
                          <a
                            key={`${gab.url}-${gIdx}`}
                            href={gab.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25 transition-all w-fit"
                          >
                            <CheckCircle2 size={12} className="shrink-0" />
                            <span>{gab.label}</span>
                            <ExternalLink size={10} className="shrink-0" />
                          </a>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Resolução Comentada / Links */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      {item.resolucaoObjetivoUrl && (
                        <a
                          href={item.resolucaoObjetivoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-light)] hover:border-indigo-500 transition-all"
                        >
                          <BookOpen size={11} className="text-indigo-400" />
                          <span>Resolução</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                      {item.paginaOficial && (
                        <a
                          href={item.paginaOficial}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-lg text-[var(--text-muted)] hover:text-indigo-400 transition-colors"
                          title="Portal Oficial FUVEST"
                        >
                          <ExternalLink size={13} />
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
