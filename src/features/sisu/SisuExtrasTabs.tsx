import React, { useMemo, useState } from 'react';
import {
  Calculator,
  ChevronDown,
  ChevronUp,
  Compass,
  Download,
  History,
  Info,
  Loader2,
  Star,
  Upload,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  CursoSisu,
  EDICOES_VALIDAS,
  EdicaoNotasUsuario,
  MODALIDADES_INFO,
  ModalidadeCodigo,
  SISU_EDICAO_ATUAL,
  SisuSimulacaoSalva,
} from '../../../shared/sisuTypes';
import {
  calcularCombinacoesReversas,
  formatarNotaBR,
  ondeEuPasso,
  parseNotaBR,
} from '../../../shared/sisuEngine';

interface OndeEuPassoTabProps {
  edicoes: EdicaoNotasUsuario[];
  cursos: CursoSisu[];
  modalidade: ModalidadeCodigo;
  cumpreBonus: boolean;
  onSelecionarCurso: (slot: 1 | 2, cursoId: string) => void;
}

export const OndeEuPassoTab: React.FC<OndeEuPassoTabProps> = ({
  edicoes,
  cursos,
  modalidade,
  cumpreBonus,
  onSelecionarCurso,
}) => {
  const [ufFiltro, setUfFiltro] = useState('');
  const [nivelFiltro, setNivelFiltro] = useState<
    'TODOS' | 'ALTA' | 'BOA' | 'POSSIVEL' | 'BAIXA' | 'MUITO_BAIXA'
  >('TODOS');

  const ufsDisponiveis = useMemo(
    () => Array.from(new Set(cursos.map((c) => c.uf))).sort(),
    [cursos]
  );

  const listaRanqueada = useMemo(() => {
    const filtrados = ufFiltro ? cursos.filter((c) => c.uf === ufFiltro) : cursos;
    const itens = ondeEuPasso(edicoes, filtrados, modalidade, cumpreBonus, EDICOES_VALIDAS);
    if (nivelFiltro === 'TODOS') return itens;
    return itens.filter((i) => i.melhorChance.nivel === nivelFiltro);
  }, [edicoes, cursos, modalidade, cumpreBonus, ufFiltro, nivelFiltro]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
            <Compass size={18} className="text-blue-400" />
            <span>Onde eu passo?</span>
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Ranking automático dos cursos do catálogo onde suas notas atuais ({EDICOES_VALIDAS.join(', ')}) têm maior chance na modalidade {modalidade}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Filtrar por estado"
            value={ufFiltro}
            onChange={(e) => setUfFiltro(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
          >
            <option value="">Todos os estados</option>
            {ufsDisponiveis.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </select>

          <select
            aria-label="Filtrar por nível de chance"
            value={nivelFiltro}
            onChange={(e) =>
              setNivelFiltro(
                e.target.value as 'TODOS' | 'ALTA' | 'BOA' | 'POSSIVEL' | 'BAIXA' | 'MUITO_BAIXA'
              )
            }
            className="px-3 py-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
          >
            <option value="TODOS">Todas as chances</option>
            <option value="ALTA">Alta chance</option>
            <option value="BOA">Boa chance</option>
            <option value="POSSIVEL">Possível (lista de espera)</option>
            <option value="BAIXA">Baixa chance</option>
            <option value="MUITO_BAIXA">Muito baixa</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listaRanqueada.map(({ simulacao, melhorChance, corteReferencia, modalidadeReferencia }) => {
          const badgeCor =
            melhorChance.cor === 'emerald'
              ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/35'
              : melhorChance.cor === 'lime'
              ? 'bg-lime-500/15 text-lime-500 border-lime-500/35'
              : melhorChance.cor === 'amber'
              ? 'bg-amber-500/15 text-amber-500 border-amber-500/35'
              : 'bg-rose-500/15 text-rose-400 border-rose-500/35';

          return (
            <div
              key={simulacao.curso.id}
              className="p-4 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[var(--primary-soft)] text-blue-400">
                      {simulacao.curso.iesSigla} · {simulacao.curso.uf}
                    </span>
                    {simulacao.curso.ilustrativo && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-500">
                        Dado ilustrativo
                      </span>
                    )}
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${badgeCor}`}>
                    {melhorChance.label}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[var(--text-main)]">
                  {simulacao.curso.curso}
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  {simulacao.curso.cidade}/{simulacao.curso.uf} · {simulacao.curso.turno}
                </p>

                <div className="flex flex-wrap gap-3 text-xs pt-1 text-[var(--text-muted)]">
                  <span>
                    Sua nota:{' '}
                    <strong className="font-mono text-[var(--text-main)]">
                      {formatarNotaBR(simulacao.notaFinal)}
                    </strong>
                  </span>
                  <span>
                    Corte ({modalidadeReferencia}):{' '}
                    <strong className="font-mono text-[var(--text-main)]">
                      {formatarNotaBR(corteReferencia)}
                    </strong>
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-[var(--border-light)]">
                <button
                  type="button"
                  onClick={() => onSelecionarCurso(1, simulacao.curso.id)}
                  className="flex-1 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold cursor-pointer transition-colors"
                >
                  Simular 1ª opção
                </button>
                <button
                  type="button"
                  onClick={() => onSelecionarCurso(2, simulacao.curso.id)}
                  className="flex-1 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-emerald-500 text-[var(--text-main)] text-xs font-bold cursor-pointer transition-colors"
                >
                  Simular 2ª opção
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface CalculadoraReversaTabProps {
  cursos: CursoSisu[];
  modalidadePadrao: ModalidadeCodigo;
  cumpreBonus: boolean;
}

export const CalculadoraReversaTab: React.FC<CalculadoraReversaTabProps> = ({
  cursos,
  modalidadePadrao,
  cumpreBonus,
}) => {
  const [cursoId, setCursoId] = useState<string>(cursos[0]?.id || '');
  const [modalidade, setModalidade] = useState<ModalidadeCodigo>(modalidadePadrao);
  const [corteCustom, setCorteCustom] = useState<string>('');

  const cursoSelecionado = cursos.find((c) => c.id === cursoId) || cursos[0];

  const cortePadrao = useMemo(() => {
    if (!cursoSelecionado) return 720;
    const ultimo =
      cursoSelecionado.cortesHistoricos[cursoSelecionado.cortesHistoricos.length - 1];
    return ultimo?.modalidades[modalidade] ?? ultimo?.modalidades.AC ?? 720;
  }, [cursoSelecionado, modalidade]);

  const notaAlvo = useMemo(() => {
    if (corteCustom.trim() === '') return cortePadrao;
    return parseNotaBR(corteCustom) ?? cortePadrao;
  }, [corteCustom, cortePadrao]);

  const cenarios = useMemo(() => {
    if (!cursoSelecionado) return [];
    return calcularCombinacoesReversas(notaAlvo, cursoSelecionado, cumpreBonus);
  }, [cursoSelecionado, notaAlvo, cumpreBonus]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
          <Calculator size={18} className="text-blue-400" />
          <span>Calculadora Reversa (Meta por Área)</span>
        </h2>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Informe o curso e a nota de corte desejada para descobrir 3 combinações realistas de notas nas 5 provas do Enem.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="rev-curso"
            className="block text-xs font-bold text-[var(--text-main)] mb-1"
          >
            Curso de destino
          </label>
          <select
            id="rev-curso"
            value={cursoSelecionado?.id || ''}
            onChange={(e) => {
              setCursoId(e.target.value);
              setCorteCustom('');
            }}
            className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
          >
            {cursos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.curso} — {c.iesSigla} ({c.uf})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="rev-mod"
            className="block text-xs font-bold text-[var(--text-main)] mb-1"
          >
            Modalidade de referência
          </label>
          <select
            id="rev-mod"
            value={modalidade}
            onChange={(e) => {
              setModalidade(e.target.value as ModalidadeCodigo);
              setCorteCustom('');
            }}
            className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
          >
            {(Object.keys(MODALIDADES_INFO) as ModalidadeCodigo[]).map((m) => (
              <option key={m} value={m}>
                {MODALIDADES_INFO[m].siglaCurta}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="rev-corte"
            className="block text-xs font-bold text-[var(--text-main)] mb-1"
          >
            Nota de corte alvo (padrão: {formatarNotaBR(cortePadrao)})
          </label>
          <input
            id="rev-corte"
            type="text"
            inputMode="decimal"
            placeholder={formatarNotaBR(cortePadrao)}
            value={corteCustom}
            onChange={(e) => setCorteCustom(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-main)]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {cenarios.map((cenario) => (
          <div
            key={cenario.titulo}
            className="p-5 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-[var(--text-main)]">{cenario.titulo}</h3>
                <span className="font-mono text-xs font-extrabold text-blue-400">
                  {formatarNotaBR(cenario.notaPonderadaAlcancada)} pts
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">{cenario.descricao}</p>
            </div>

            <div className="space-y-2">
              {cenario.areas.map((a) => (
                <div
                  key={a.area}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] text-xs"
                >
                  <span className="text-[var(--text-main)] font-semibold">
                    {a.nomeCurto}{' '}
                    <span className="text-[10px] text-[var(--text-label)]">(p{a.peso})</span>
                  </span>
                  <strong className="font-mono text-[var(--text-main)]">{a.notaSugerida}</strong>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface FavoritosHistoricoTabProps {
  cursos: CursoSisu[];
  favoritos: string[];
  simulacoes: SisuSimulacaoSalva[];
  isAdmin: boolean;
  onToggleFavorito: (curso: CursoSisu) => void;
  onSelecionarCurso: (slot: 1 | 2, cursoId: string) => void;
  onExportarCSV: () => void;
  onImportarArquivo: (file: File) => Promise<{ mensagem: string }>;
}

export const FavoritosHistoricoTab: React.FC<FavoritosHistoricoTabProps> = ({
  cursos,
  favoritos,
  simulacoes,
  isAdmin,
  onToggleFavorito,
  onSelecionarCurso,
  onExportarCSV,
  onImportarArquivo,
}) => {
  const [importando, setImportando] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    tipo: 'ok' | 'erro';
    texto: string;
  } | null>(null);

  const cursosFavoritos = cursos.filter((c) => favoritos.includes(c.id));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportando(true);
    setImportStatus(null);
    try {
      const res = await onImportarArquivo(file);
      setImportStatus({ tipo: 'ok', texto: res.mensagem });
    } catch (err) {
      setImportStatus({
        tipo: 'erro',
        texto: err instanceof Error ? err.message : 'Erro ao importar arquivo.',
      });
    } finally {
      setImportando(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Favoritos */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
          <Star size={18} className="text-amber-400" />
          <span>Cursos Favoritos ({cursosFavoritos.length})</span>
        </h2>

        {cursosFavoritos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cursosFavoritos.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[var(--text-main)] truncate">
                    {c.curso} — {c.iesSigla}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {c.cidade}/{c.uf} · {c.turno}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onSelecionarCurso(1, c.id)}
                    className="px-3 py-1.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold cursor-pointer"
                  >
                    Simular
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleFavorito(c)}
                    className="p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] text-amber-400 cursor-pointer"
                    aria-label={`Remover ${c.curso} dos favoritos`}
                  >
                    <Star size={14} fill="currentColor" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl border border-dashed border-[var(--border-color)] text-center text-xs text-[var(--text-muted)]">
            Marque seus cursos dos sonhos com a estrela na etapa de escolha para acompanhar aqui e no seu Painel.
          </div>
        )}
      </div>

      {/* Histórico */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
            <History size={17} className="text-blue-400" />
            <span>Histórico de Simulações ({simulacoes.length})</span>
          </h3>

          <button
            type="button"
            disabled={simulacoes.length === 0}
            onClick={onExportarCSV}
            className="px-3.5 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-hover)] hover:bg-[var(--border-light)] disabled:opacity-45 text-xs font-semibold text-[var(--text-main)] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} />
            <span>Exportar CSV</span>
          </button>
        </div>

        {simulacoes.length > 0 ? (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {simulacoes.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <p className="font-bold text-[var(--text-main)]">
                    1ª: {s.curso1Nome} ({s.curso1Ies})
                    {s.curso2Nome ? ` · 2ª: ${s.curso2Nome} (${s.curso2Ies})` : ''}
                  </p>
                  <p className="text-[var(--text-muted)] mt-0.5">
                    {new Date(s.criadoEm).toLocaleString('pt-BR')} · Modalidade {s.modalidade} · Enem{' '}
                    {s.edicaoUsada || '—'}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <strong className="font-mono text-sm text-[var(--text-main)]">
                    {formatarNotaBR(s.notaFinalOpcao1)}
                  </strong>
                  <span className="px-2 py-0.5 rounded-md bg-[var(--bg-card)] border border-[var(--border-light)] font-bold text-[11px] text-blue-400">
                    {s.chanceOpcao1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[var(--text-muted)]">
            Nenhuma simulação salva ainda. Calcule um resultado para registrar automaticamente.
          </p>
        )}
      </div>

      {/* Painel Admin de Importação CSV/JSON */}
      {isAdmin && (
        <div className="p-5 rounded-2xl bg-[var(--bg-hover)] border border-blue-500/30 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                Administração do Catálogo
              </span>
              <h3 className="text-sm font-bold text-[var(--text-main)]">
                Importar dados oficiais de corte (CSV ou JSON)
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Cursos importados substituem os registros ilustrativos com o selo oficial da fonte.
              </p>
            </div>

            <label className="px-4 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer shrink-0">
              {importando ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              <span>{importando ? 'Importando...' : 'Selecionar CSV / JSON'}</span>
              <input
                type="file"
                accept=".csv,.json,text/csv,application/json"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {importStatus && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                importStatus.tipo === 'ok'
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}
            >
              {importStatus.tipo === 'ok' ? (
                <CheckCircle2 size={15} />
              ) : (
                <AlertCircle size={15} />
              )}
              <span>{importStatus.texto}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const EntendaSisuTab: React.FC = () => {
  const [aberto, setAberto] = useState<number>(0);

  const perguntas = [
    {
      q: `Como funciona a regra das 3 últimas edições do Enem no Sisu ${SISU_EDICAO_ATUAL}?`,
      a: `Desde o Sisu 2026, você pode aproveitar automaticamente a melhor edição entre os 3 últimos anos válidos (${EDICOES_VALIDAS.join(', ')}). O sistema nunca mistura áreas de anos diferentes: calcula sua média ponderada completa em cada edição e utiliza a maior.`,
    },
    {
      q: 'O que acontece se eu fiz como treineiro ou tirei zero na Redação?',
      a: 'Notas obtidas como treineiro não valem para o Sisu e são descartadas pelo simulador. Da mesma forma, nota 0 na Redação invalida toda a edição do Enem daquele ano para ingresso.',
    },
    {
      q: 'Como funciona a ordem entre Ampla Concorrência (AC) e Cotas (Lei 14.723/2023)?',
      a: 'Todo candidato cotista concorre primeiro na Ampla Concorrência (AC). Somente se a sua nota não for suficiente para entrar na AC é que ela passa a disputar as vagas reservadas da sua cota. Pela Lei 14.723/2023, o corte de baixa renda passou a ser de até 1 salário mínimo per capita (códigos LB_*).',
    },
    {
      q: 'Como funcionam os pesos e notas mínimas?',
      a: 'Cada universidade atribui pesos (geralmente de 1 a 5) para Linguagens, Humanas, Natureza, Matemática e Redação. Além disso, o curso pode exigir nota mínima por área ou média mínima geral — se não atingir, o candidato fica inelegível naquela opção.',
    },
    {
      q: 'Posso ficar na Lista de Espera das duas opções?',
      a: 'Não. Se você não for selecionado em nenhuma das duas opções na chamada regular, poderá manifestar interesse na Lista de Espera de apenas UMA das opções escolhidas. Por isso, comparar a 1ª e a 2ª opção com atenção é fundamental.',
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
          <Info size={18} className="text-blue-400" />
          <span>Entenda as regras oficiais do Sisu</span>
        </h2>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Guia rápido sobre cálculo ponderado, cotas, 2 opções e lista de espera.
        </p>
      </div>

      <div className="space-y-2.5">
        {perguntas.map((item, idx) => {
          const isOpen = aberto === idx;
          return (
            <div
              key={item.q}
              className="rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] overflow-hidden"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setAberto(isOpen ? -1 : idx)}
                className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left cursor-pointer hover:bg-[var(--bg-card)]/40 transition-colors"
              >
                <span className="text-sm font-bold text-[var(--text-main)]">{item.q}</span>
                {isOpen ? (
                  <ChevronUp size={16} className="text-[var(--text-muted)] shrink-0" />
                ) : (
                  <ChevronDown size={16} className="text-[var(--text-muted)] shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed border-t border-[var(--border-light)]">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
