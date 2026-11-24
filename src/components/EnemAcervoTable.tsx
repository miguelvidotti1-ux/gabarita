import React, { useState } from 'react';
import {
  ExternalLink,
  FileText,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Accessibility
} from 'lucide-react';
import {
  ENEM_ACERVO_TABLE,
  EnemAplicacao,
  EnemDocItem,
  EnemYearItem
} from '../data/enem_acervo';

interface Props {
  onSelectYear?: (ano: number) => void;
}

const APLICACAO_FILTERS: ('Todas' | EnemAplicacao)[] = [
  'Todas',
  'Regular',
  'PPL / 2ª Aplicação',
  'Digital',
  '3ª Aplicação'
];

function getColorDotClass(cor?: string): string {
  switch (cor?.toLowerCase()) {
    case 'azul':
      return 'bg-blue-500';
    case 'amarelo':
      return 'bg-yellow-400';
    case 'branco':
      return 'bg-slate-200 border border-slate-400';
    case 'rosa':
      return 'bg-pink-500';
    case 'verde':
      return 'bg-emerald-500';
    case 'cinza':
      return 'bg-gray-400';
    case 'laranja':
      return 'bg-orange-500';
    case 'marrom':
      return 'bg-amber-800';
    case 'roxo':
      return 'bg-purple-500';
    default:
      return 'bg-teal-500';
  }
}

function isRegularCore(doc: EnemDocItem): boolean {
  if (doc.isRedacaoTema) return true;
  if (doc.aplicacao !== 'Regular') return false;
  return !doc.acessibilidade;
}

export default function EnemAcervoTable({ onSelectYear }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [aplicacaoFilter, setAplicacaoFilter] = useState<'Todas' | EnemAplicacao>('Todas');
  const [expandedExtras, setExpandedExtras] = useState<Record<number, boolean>>({});

  const term = searchTerm.trim().toLowerCase();

  const matchesDoc = (doc: EnemDocItem): boolean => {
    if (aplicacaoFilter !== 'Todas' && doc.aplicacao !== aplicacaoFilter) {
      return false;
    }
    if (!term) return true;
    return (
      doc.label.toLowerCase().includes(term) ||
      doc.aplicacao.toLowerCase().includes(term) ||
      (doc.cor ? doc.cor.toLowerCase().includes(term) : false) ||
      (doc.acessibilidade ? doc.acessibilidade.toLowerCase().includes(term) : false) ||
      (doc.idioma ? doc.idioma.toLowerCase().includes(term) : false)
    );
  };

  const filteredItems = ENEM_ACERVO_TABLE.filter((item: EnemYearItem) => {
    const allDocs = [
      ...item.dia1.provas,
      ...item.dia1.gabaritos,
      ...item.dia2.provas,
      ...item.dia2.gabaritos
    ];
    if (aplicacaoFilter !== 'Todas' && !allDocs.some((d) => d.aplicacao === aplicacaoFilter)) {
      return false;
    }
    if (!term) return true;
    if (
      item.ano.toString().includes(term) ||
      item.rotulo.toLowerCase().includes(term) ||
      (item.observacao && item.observacao.toLowerCase().includes(term))
    ) {
      return true;
    }
    return allDocs.some(matchesDoc);
  });

  const totalMatchingFiles = filteredItems.reduce((acc, item) => {
    const allDocs = [
      ...item.dia1.provas,
      ...item.dia1.gabaritos,
      ...item.dia2.provas,
      ...item.dia2.gabaritos
    ];
    return acc + allDocs.filter(matchesDoc).length;
  }, 0);

  const toggleExtras = (ano: number) => {
    setExpandedExtras((prev) => ({ ...prev, [ano]: !prev[ano] }));
  };

  const renderDocLink = (doc: EnemDocItem, idx: number) => {
    const isGab = doc.tipo === 'gabarito';
    const isTema = doc.isRedacaoTema;
    return (
      <a
        key={`${doc.url}-${idx}`}
        href={doc.url}
        target="_blank"
        rel="noopener noreferrer"
        title={doc.label}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all w-fit max-w-full ${
          isTema
            ? 'bg-purple-500/10 text-purple-500 dark:text-purple-300 border-purple-500/30 hover:bg-purple-500/20'
            : isGab
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/25'
              : 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/25 hover:bg-teal-500/20'
        }`}
      >
        {isTema ? (
          <Sparkles size={12} className="shrink-0" />
        ) : isGab ? (
          <CheckCircle2 size={12} className="shrink-0" />
        ) : (
          <span className={`w-2 h-2 rounded-full shrink-0 ${getColorDotClass(doc.cor)}`} />
        )}
        <span className="truncate">{doc.label}</span>
        <ExternalLink size={10} className="shrink-0 opacity-70" />
      </a>
    );
  };

  const renderDayColumn = (
    item: EnemYearItem,
    provas: EnemDocItem[],
    gabaritos: EnemDocItem[],
    isExpanded: boolean
  ) => {
    const filteredProvas = provas.filter((d) => {
      if (aplicacaoFilter !== 'Todas' && d.aplicacao !== aplicacaoFilter) return false;
      if (!term) return true;
      if (item.ano.toString().includes(term) || item.rotulo.toLowerCase().includes(term)) {
        return true;
      }
      return matchesDoc(d);
    });

    const filteredGabs = gabaritos.filter((d) => {
      if (aplicacaoFilter !== 'Todas' && d.aplicacao !== aplicacaoFilter) return false;
      if (!term) return true;
      if (item.ano.toString().includes(term) || item.rotulo.toLowerCase().includes(term)) {
        return true;
      }
      return matchesDoc(d);
    });

    const forceShowAll = isExpanded || aplicacaoFilter !== 'Todas' || Boolean(term && !item.ano.toString().includes(term));

    const coreProvas = filteredProvas.filter(isRegularCore);
    const extraProvas = filteredProvas.filter((d) => !isRegularCore(d));

    const coreGabs = filteredGabs.filter(isRegularCore);
    const extraGabs = filteredGabs.filter((d) => !isRegularCore(d));

    const visibleProvas = forceShowAll ? filteredProvas : coreProvas;
    const visibleGabs = forceShowAll ? filteredGabs : coreGabs;

    return (
      <div className="space-y-3">
        {visibleProvas.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1">
              <FileText size={11} />
              <span>Provas ({visibleProvas.length})</span>
            </span>
            <div className="flex flex-col gap-1.5">
              {visibleProvas.map((doc, idx) => renderDocLink(doc, idx))}
            </div>
          </div>
        )}

        {visibleGabs.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 size={11} />
              <span>Gabaritos ({visibleGabs.length})</span>
            </span>
            <div className="flex flex-col gap-1.5">
              {visibleGabs.map((doc, idx) => renderDocLink(doc, idx))}
            </div>
          </div>
        )}

        {!forceShowAll && (extraProvas.length > 0 || extraGabs.length > 0) && (
          <button
            type="button"
            onClick={() => toggleExtras(item.ano)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-teal-500 border border-[var(--border-light)] transition-colors cursor-pointer"
          >
            <Accessibility size={11} />
            <span>
              +{extraProvas.length + extraGabs.length} arquivos (PPL, Digital, Acessibilidade)
            </span>
            <ChevronDown size={11} />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header Info Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border border-teal-500/20 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-teal-500/20 border border-teal-500/30 text-[10px] font-black text-teal-500 dark:text-teal-300 uppercase tracking-widest">
                Acervo Oficial ENEM · INEP
              </span>
              <span className="text-xs text-[var(--text-secondary)] font-medium">
                2010–2026 · Acervo Gabarita
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-black text-[var(--text-primary)] mt-1">
              Provas e Gabaritos ENEM 2010–2026
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-2xl leading-relaxed">
              Acervo oficial completo do INEP com 1º e 2º dia, gabaritos correspondentes, Reaplicação / PPL, ENEM Digital (2020–2022), 3ª Aplicação (2014), Temas de Redação e versões de acessibilidade (Libras, Braile/Ledor, Ampliada, Superampliada, NVDA e DOSVOX).
            </p>
          </div>

          <a
            href="https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-teal-600 dark:text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-center"
          >
            <ExternalLink size={13} />
            <span>Portal INEP</span>
          </a>
        </div>
      </div>

      {/* Filter Pills + Search */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {APLICACAO_FILTERS.map((app) => {
            const active = aplicacaoFilter === app;
            return (
              <button
                key={app}
                type="button"
                onClick={() => setAplicacaoFilter(app)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer border ${
                  active
                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                    : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-light)] hover:border-teal-500/40'
                }`}
              >
                {app}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Buscar por ano, caderno, cor, gabarito, PPL, digital, libras, redação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border-light)] rounded-xl text-xs font-semibold outline-none focus:border-teal-500 transition-all text-[var(--text-main)]"
            />
          </div>
          <span className="text-xs font-bold text-[var(--text-muted)] shrink-0">
            {filteredItems.length} edições · {totalMatchingFiles} arquivos
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--bg-card)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[var(--bg-hover)] border-b border-[var(--border-light)] text-[var(--text-muted)] uppercase tracking-wider font-extrabold text-[10px]">
                <th className="py-3 px-4 w-52">Edição / Ano</th>
                <th className="py-3 px-4 min-w-[290px]">1º Dia — Provas e Gabaritos</th>
                <th className="py-3 px-4 min-w-[290px]">2º Dia — Provas e Gabaritos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              {filteredItems.map((item) => {
                const isExpanded = Boolean(expandedExtras[item.ano]);
                return (
                  <tr
                    key={item.ano}
                    onClick={() => onSelectYear?.(item.ano)}
                    className="hover:bg-[var(--bg-hover)]/40 transition-colors align-top"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 font-black flex items-center justify-center shrink-0">
                            {item.ano.toString().slice(2)}
                          </span>
                          <div>
                            <span className="font-black text-[var(--text-main)] block">
                              {item.rotulo}
                            </span>
                            {item.observacao && (
                              <span className="text-[10px] text-[var(--text-muted)] block leading-snug">
                                {item.observacao}
                              </span>
                            )}
                          </div>
                        </div>

                        {aplicacaoFilter === 'Todas' && !term && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExtras(item.ano);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-teal-500 border border-[var(--border-light)] w-fit cursor-pointer"
                          >
                            {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                            <span>
                              {isExpanded
                                ? 'Recolher extras'
                                : 'Expandir PPL / Digital / Acessib.'}
                            </span>
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {renderDayColumn(item, item.dia1.provas, item.dia1.gabaritos, isExpanded)}
                    </td>

                    <td className="py-3.5 px-4">
                      {renderDayColumn(item, item.dia2.provas, item.dia2.gabaritos, isExpanded)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
