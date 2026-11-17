import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Download,
  Loader2,
  Sparkles,
  Star,
  TrendingDown,
  TrendingUp,
  Minus,
  Info,
} from 'lucide-react';
import { animate, motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AREAS_ENEM_META,
  AreaEnem,
  ClassificacaoChance,
  EdicaoNotasUsuario,
  MODALIDADES_INFO,
  ModalidadeCodigo,
  ResultadoSimulacaoCurso,
  SISU_EDICAO_ATUAL,
} from '../../../shared/sisuTypes';
import { formatarNotaBR } from '../../../shared/sisuEngine';

interface SisuStepResultadoProps {
  edicoes: EdicaoNotasUsuario[];
  opcao1: ResultadoSimulacaoCurso;
  opcao2: ResultadoSimulacaoCurso | null;
  modalidade: ModalidadeCodigo;
  favoritos: string[];
  onToggleFavorito: (sim: ResultadoSimulacaoCurso) => void;
  onVoltar: () => void;
  onExportarCSV: () => void;
  onSolicitarAnaliseIA: (
    sim: ResultadoSimulacaoCurso,
    pergunta?: string
  ) => Promise<{ analise: string; origem: 'ia' | 'local_fallback' }>;
}

const AREA_KEYS: AreaEnem[] = ['LC', 'CH', 'CN', 'MT', 'RED'];

function getChanceClasses(cor: ClassificacaoChance['cor']): string {
  switch (cor) {
    case 'emerald':
      return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/35';
    case 'lime':
      return 'bg-lime-500/15 text-lime-500 border-lime-500/35';
    case 'amber':
      return 'bg-amber-500/15 text-amber-500 border-amber-500/35';
    case 'rose':
      return 'bg-rose-500/15 text-rose-500 border-rose-500/35';
    default:
      return 'bg-slate-500/15 text-[var(--text-muted)] border-[var(--border-color)]';
  }
}

const AnimatedScore: React.FC<{ value: number | null }> = ({ value }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === null) {
      setDisplay(0);
      return;
    }
    const controls = animate(0, value, {
      duration: 0.75,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [value]);

  if (value === null) {
    return <span className="font-mono">—</span>;
  }
  return <span className="font-mono">{formatarNotaBR(display)}</span>;
};

const TendenciaBadge: React.FC<{ tendencia: 'alta' | 'queda' | 'estavel' | 'indisponivel' }> = ({
  tendencia,
}) => {
  if (tendencia === 'alta') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500">
        <TrendingUp size={12} /> Tendência de alta
      </span>
    );
  }
  if (tendencia === 'queda') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
        <TrendingDown size={12} /> Tendência de queda
      </span>
    );
  }
  if (tendencia === 'estavel') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400">
        <Minus size={12} /> Estável
      </span>
    );
  }
  return null;
};

export const SisuStepResultado: React.FC<SisuStepResultadoProps> = ({
  edicoes,
  opcao1,
  opcao2,
  modalidade,
  favoritos,
  onToggleFavorito,
  onVoltar,
  onExportarCSV,
  onSolicitarAnaliseIA,
}) => {
  const [abaAtiva, setAbaAtiva] = useState<'1' | '2'>('1');
  const [analiseTexto, setAnaliseTexto] = useState<string | null>(null);
  const [analiseOrigem, setAnaliseOrigem] = useState<'ia' | 'local_fallback' | null>(null);
  const [carregandoIA, setCarregandoIA] = useState(false);

  const simAtual = abaAtiva === '2' && opcao2 ? opcao2 : opcao1;
  const ehFav = favoritos.includes(simAtual.curso.id);

  const edicaoUsadaObj = simAtual.melhorEdicao
    ? edicoes.find((e) => e.edicao === simAtual.melhorEdicao?.edicao) || null
    : null;

  const ac = simAtual.resultadoAC;
  const cota = simAtual.resultadoCota;

  // Dados para gráfico de barras: Sua nota × Corte anterior × Projeção
  const barData = [
    {
      nome: 'Sua Nota',
      valor: simAtual.notaFinal ? Number(simAtual.notaFinal.toFixed(2)) : 0,
      cor: '#2563EB',
    },
    ...(ac.projecao.ultimoCorte !== null
      ? [
          {
            nome: `Corte AC (${ac.projecao.ultimoAno})`,
            valor: Number(ac.projecao.ultimoCorte.toFixed(2)),
            cor: '#64748B',
          },
        ]
      : []),
    ...(cota && cota.projecao.ultimoCorte !== null
      ? [
          {
            nome: `Corte ${modalidade}`,
            valor: Number(cota.projecao.ultimoCorte.toFixed(2)),
            cor: '#10B981',
          },
        ]
      : []),
  ];

  // Dados para gráfico radar: Nota do aluno vs Peso normalizado do curso
  const maxPeso = Math.max(...AREA_KEYS.map((k) => simAtual.curso.pesos[k]), 1);
  const radarData = AREA_KEYS.map((k) => ({
    area: AREAS_ENEM_META[k].nomeCurto,
    suaNota: edicaoUsadaObj ? Math.round(edicaoUsadaObj.notas[k]) : 0,
    pesoCursoEscala: Math.round((simAtual.curso.pesos[k] / maxPeso) * 900),
  }));

  const qfPrincipal =
    cota && cota.quantoFaltaUltimoCorte ? cota.quantoFaltaUltimoCorte : ac.quantoFaltaUltimoCorte;

  const handleExplicarIA = async () => {
    setCarregandoIA(true);
    try {
      const resp = await onSolicitarAnaliseIA(simAtual);
      setAnaliseTexto(resp.analise);
      setAnaliseOrigem(resp.origem);
    } finally {
      setCarregandoIA(false);
    }
  };

  useEffect(() => {
    setAnaliseTexto(null);
    setAnaliseOrigem(null);
  }, [simAtual.curso.id, modalidade]);

  return (
    <div className="space-y-6">
      {/* Barra superior */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-main)]">
            3. Resultado da sua simulação Sisu {SISU_EDICAO_ATUAL}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
            Cálculo oficial com pesos do curso, regras de elegibilidade e dupla leitura (AC + Cota).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onVoltar}
            className="px-3.5 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-hover)] hover:bg-[var(--border-light)] text-xs font-semibold text-[var(--text-main)] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Alterar cursos</span>
          </button>

          <button
            type="button"
            onClick={onExportarCSV}
            className="px-3.5 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-hover)] hover:bg-[var(--border-light)] text-xs font-semibold text-[var(--text-main)] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Seletor 1ª / 2ª opção caso tenha duas opções */}
      {opcao2 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setAbaAtiva('1')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              abaAtiva === '1'
                ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                : 'bg-[var(--bg-hover)] text-[var(--text-muted)] border-[var(--border-light)] hover:text-[var(--text-main)]'
            }`}
          >
            1ª Opção: {opcao1.curso.curso} ({opcao1.curso.iesSigla})
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva('2')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              abaAtiva === '2'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-[var(--bg-hover)] text-[var(--text-muted)] border-[var(--border-light)] hover:text-[var(--text-main)]'
            }`}
          >
            2ª Opção: {opcao2.curso.curso} ({opcao2.curso.iesSigla})
          </button>
        </div>
      )}

      {/* Alerta de Inelegibilidade se houver */}
      {!simAtual.elegivel && (
        <div
          role="alert"
          className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/35 space-y-2"
        >
          <div className="flex items-center gap-2 text-rose-500 font-bold text-sm">
            <AlertTriangle size={18} />
            <span>Inelegível para este curso</span>
          </div>
          <ul className="list-disc list-inside text-xs text-[var(--text-main)] space-y-1">
            {simAtual.motivosInelegibilidade.map((motivo, idx) => (
              <li key={idx}>{motivo}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Cards Principais de Pontuação + AC + Cota */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Card Nota Ponderada */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] flex flex-col justify-between gap-3"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                  Sua Média Ponderada
                </span>
                {simAtual.curso.ilustrativo && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">
                    Dado ilustrativo
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-[var(--text-main)] mt-1">
                {simAtual.curso.curso} — {simAtual.curso.iesSigla}
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                {simAtual.curso.cidade}/{simAtual.curso.uf} · {simAtual.curso.turno}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onToggleFavorito(simAtual)}
              className={`p-2 rounded-xl border cursor-pointer transition-colors ${
                ehFav
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                  : 'bg-[var(--bg-card)] border-[var(--border-light)] text-[var(--text-label)] hover:text-amber-400'
              }`}
              title={ehFav ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
            >
              <Star size={15} fill={ehFav ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div>
            <p className="text-4xl font-black text-[var(--text-main)] tracking-tight">
              <AnimatedScore value={simAtual.notaFinal} />
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {simAtual.melhorEdicao ? (
                <>
                  Melhor edição selecionada:{' '}
                  <strong className="text-[var(--text-main)]">
                    Enem {simAtual.melhorEdicao.edicao}
                  </strong>
                </>
              ) : (
                'Sem edição válida informada'
              )}
            </p>
          </div>
        </motion.div>

        {/* Card Ampla Concorrência */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-5 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] flex flex-col justify-between gap-3"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-label)]">
              Na AC (Ampla Concorrência)
            </span>
            <div>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-extrabold border mt-1 ${getChanceClasses(
                  ac.chanceUltimoCorte.cor
                )}`}
              >
                {ac.chanceUltimoCorte.label}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">
                Último corte ({ac.projecao.ultimoAno || '—'}):
              </span>
              <strong className="font-mono text-[var(--text-main)]">
                {formatarNotaBR(ac.projecao.ultimoCorte)}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Corte projetado (teto ±30):</span>
              <strong className="font-mono text-[var(--text-main)]">
                {formatarNotaBR(ac.projecao.corteProjetado)}
              </strong>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-[var(--border-light)]">
              <span className="text-[var(--text-muted)]">Diferença vs último corte:</span>
              <strong
                className={`font-mono ${
                  (ac.chanceUltimoCorte.diferenca ?? 0) >= 0
                    ? 'text-emerald-500'
                    : 'text-rose-400'
                }`}
              >
                {ac.chanceUltimoCorte.diferenca !== null
                  ? `${ac.chanceUltimoCorte.diferenca >= 0 ? '+' : ''}${formatarNotaBR(
                      ac.chanceUltimoCorte.diferenca
                    )} pts`
                  : '—'}
              </strong>
            </div>
            <TendenciaBadge tendencia={ac.projecao.tendencia} />
          </div>
        </motion.div>

        {/* Card Cota do Usuário (ou Vagas se AC) */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] flex flex-col justify-between gap-3"
        >
          {cota && modalidade !== 'AC' ? (
            <>
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                  Na sua cota ({MODALIDADES_INFO[modalidade].codigo})
                </span>
                <div>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-extrabold border mt-1 ${getChanceClasses(
                      cota.chanceUltimoCorte.cor
                    )}`}
                  >
                    {cota.chanceUltimoCorte.label}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">
                    Último corte ({cota.projecao.ultimoAno || '—'}):
                  </span>
                  <strong className="font-mono text-[var(--text-main)]">
                    {formatarNotaBR(cota.projecao.ultimoCorte)}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Corte projetado (teto ±30):</span>
                  <strong className="font-mono text-[var(--text-main)]">
                    {formatarNotaBR(cota.projecao.corteProjetado)}
                  </strong>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-[var(--border-light)]">
                  <span className="text-[var(--text-muted)]">Vagas nesta cota:</span>
                  <strong className="font-mono text-[var(--text-main)]">
                    {simAtual.vagasCota} vagas
                  </strong>
                </div>
                <TendenciaBadge tendencia={cota.projecao.tendencia} />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-label)]">
                  Vagas & Edições Avaliadas
                </span>
                <p className="text-sm font-bold text-[var(--text-main)]">
                  {simAtual.vagasAC} vagas na Ampla Concorrência
                </p>
              </div>
              <div className="space-y-1.5 text-xs">
                {simAtual.todasEdicoes.map((ed) => (
                  <div
                    key={ed.edicao}
                    className="flex items-center justify-between py-1 border-b border-[var(--border-light)] last:border-b-0"
                  >
                    <span className="text-[var(--text-muted)]">Enem {ed.edicao}</span>
                    {ed.descartada ? (
                      <span className="text-[11px] text-amber-500 font-semibold">
                        {ed.treineiro ? 'Treineiro' : 'Redação = 0'}
                      </span>
                    ) : (
                      <strong className="font-mono text-[var(--text-main)]">
                        {formatarNotaBR(ed.notaFinal)}
                      </strong>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Comparativo lado a lado 1ª vs 2ª Opção */}
      {opcao2 && (
        <div className="p-5 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] space-y-3">
          <h3 className="text-sm font-bold text-[var(--text-main)]">
            Comparativo lado a lado: 1ª Opção vs 2ª Opção
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: '1ª Opção', sim: opcao1, accent: 'border-blue-500/40' },
              { label: '2ª Opção', sim: opcao2, accent: 'border-emerald-500/40' },
            ].map(({ label, sim, accent }) => {
              const chanceRef =
                modalidade !== 'AC' && sim.resultadoCota
                  ? sim.resultadoCota.chanceUltimoCorte
                  : sim.resultadoAC.chanceUltimoCorte;
              const corteRef =
                modalidade !== 'AC' && sim.resultadoCota
                  ? sim.resultadoCota.projecao.ultimoCorte
                  : sim.resultadoAC.projecao.ultimoCorte;

              return (
                <div
                  key={label}
                  className={`p-4 rounded-xl bg-[var(--bg-card)] border ${accent} space-y-2`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase text-[var(--text-label)]">
                      {label}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${getChanceClasses(
                        chanceRef.cor
                      )}`}
                    >
                      {chanceRef.label}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-[var(--text-main)]">
                    {sim.curso.curso} — {sim.curso.iesSigla}
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-muted)] pt-1 border-t border-[var(--border-light)]">
                    <span>
                      Sua nota:{' '}
                      <strong className="font-mono text-[var(--text-main)]">
                        {formatarNotaBR(sim.notaFinal)}
                      </strong>
                    </span>
                    <span>
                      Corte ({modalidade}):{' '}
                      <strong className="font-mono text-[var(--text-main)]">
                        {formatarNotaBR(corteRef)}
                      </strong>
                    </span>
                    <span>
                      Edição:{' '}
                      <strong className="text-[var(--text-main)]">
                        {sim.melhorEdicao?.edicao || '—'}
                      </strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Gráficos Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] space-y-3">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-main)]">
              Sua nota × Nota de corte e projeção
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Linha tracejada indica a projeção linear limitada a ±30 pontos do último corte.
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 12, right: 16, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="nome" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis domain={[400, 950]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Tooltip
                  formatter={(v: number) => [formatarNotaBR(v), 'Pontuação']}
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    color: 'var(--text-main)',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="valor" radius={[8, 8, 0, 0]} maxBarSize={64}>
                  {barData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.cor} />
                  ))}
                </Bar>
                {ac.projecao.corteProjetado !== null && (
                  <ReferenceLine
                    y={ac.projecao.corteProjetado}
                    stroke="#F59E0B"
                    strokeDasharray="6 4"
                    label={{
                      value: `Proj. AC: ${formatarNotaBR(ac.projecao.corteProjetado)}`,
                      fill: '#F59E0B',
                      fontSize: 11,
                      position: 'insideTopRight',
                    }}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] space-y-3">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-main)]">
              Equilíbrio das suas notas × Pesos do curso
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Compare seu desempenho por área com as exigências de peso deste curso.
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border-color)" />
                <PolarAngleAxis
                  dataKey="area"
                  tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                />
                <PolarRadiusAxis domain={[0, 1000]} tick={false} axisLine={false} />
                <Radar
                  name="Sua nota"
                  dataKey="suaNota"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.35}
                />
                <Radar
                  name="Ênfase do peso"
                  dataKey="pesoCursoEscala"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.18}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    color: 'var(--text-main)',
                    fontSize: '12px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Painel Quanto Falta? */}
      {qfPrincipal && (
        <div className="p-5 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-main)]">
                Quanto falta para alcançar o último corte ({cota ? modalidade : 'AC'})?
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                {qfPrincipal.jaAtingiu ? (
                  <span className="text-emerald-500 font-semibold inline-flex items-center gap-1">
                    <CheckCircle2 size={14} /> Você já atingiu o corte de referência ({formatarNotaBR(qfPrincipal.corteReferencia)}).
                  </span>
                ) : (
                  <>
                    Faltam{' '}
                    <strong className="text-amber-500 font-mono">
                      +{formatarNotaBR(qfPrincipal.diferencaPonderada)} pontos
                    </strong>{' '}
                    na média ponderada para igualar o corte de{' '}
                    <strong className="font-mono text-[var(--text-main)]">
                      {formatarNotaBR(qfPrincipal.corteReferencia)}
                    </strong>
                    .
                  </>
                )}
              </p>
            </div>
          </div>

          {!qfPrincipal.jaAtingiu && qfPrincipal.melhorArea && (
            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-[var(--text-main)]">
              <strong className="text-blue-400">Alavanca mais eficiente:</strong> pelo peso{' '}
              <strong>{qfPrincipal.melhorArea.peso}</strong>, subir{' '}
              <strong className="font-mono">
                +{formatarNotaBR(qfPrincipal.melhorArea.pontosNecessarios)} pts
              </strong>{' '}
              em <strong>{qfPrincipal.melhorArea.nomeCurto}</strong> (indo de{' '}
              {formatarNotaBR(qfPrincipal.melhorArea.notaAtual)} para{' '}
              {formatarNotaBR(qfPrincipal.melhorArea.notaAlvo)}) já cobriria toda a diferença!
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-light)] text-[var(--text-label)] uppercase text-[10px]">
                  <th className="py-2 pr-3">Área do Enem</th>
                  <th className="py-2 px-3">Peso</th>
                  <th className="py-2 px-3">Sua Nota</th>
                  <th className="py-2 px-3">Precisaria subir</th>
                  <th className="py-2 pl-3">Nota-alvo isolada</th>
                </tr>
              </thead>
              <tbody>
                {qfPrincipal.areas.map((a) => (
                  <tr
                    key={a.area}
                    className="border-b border-[var(--border-light)] last:border-b-0"
                  >
                    <td className="py-2.5 pr-3 font-semibold text-[var(--text-main)]">
                      {a.nomeCurto} ({a.area})
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[var(--text-muted)]">p{a.peso}</td>
                    <td className="py-2.5 px-3 font-mono text-[var(--text-main)]">
                      {formatarNotaBR(a.notaAtual)}
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      {qfPrincipal.jaAtingiu ? (
                        <span className="text-emerald-500">Meta atingida</span>
                      ) : a.possivelNoEnem ? (
                        <span className="text-amber-500 font-bold">
                          +{formatarNotaBR(a.pontosNecessarios)}
                        </span>
                      ) : (
                        <span className="text-rose-400">Passa de 1000 isoladamente</span>
                      )}
                    </td>
                    <td className="py-2.5 pl-3 font-mono text-[var(--text-main)]">
                      {qfPrincipal.jaAtingiu
                        ? formatarNotaBR(a.notaAtual)
                        : a.possivelNoEnem
                        ? formatarNotaBR(a.notaAlvo)
                        : 'Combine 2+ áreas'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Explicação com IA */}
      <div className="p-5 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
              <Sparkles size={16} className="text-blue-400" />
              <span>Orientação Estratégica com IA do Gabarita</span>
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Resumo objetivo, área de maior retorno e plano de 4 semanas com estratégia de 2ª opção.
            </p>
          </div>

          <button
            type="button"
            disabled={carregandoIA}
            onClick={handleExplicarIA}
            className="px-4 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-50 text-white text-xs font-bold inline-flex items-center justify-center gap-2 shadow-md shadow-[var(--shadow-primary)] transition-all cursor-pointer"
          >
            {carregandoIA ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            <span>{carregandoIA ? 'Analisando...' : 'Explicar meu resultado com IA'}</span>
          </button>
        </div>

        {analiseTexto && (
          <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] space-y-2">
            <div className="flex items-center justify-between text-[11px] text-[var(--text-label)]">
              <span>
                {analiseOrigem === 'ia'
                  ? 'Gerado com IA do Gabarita'
                  : 'Análise estratégica instantânea (modo offline/local)'}
              </span>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm text-[var(--text-main)]">
              <ReactMarkdown>{analiseTexto}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Aviso fixo de transparência */}
      <footer className="p-3.5 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] flex items-start gap-2.5 text-[11px] text-[var(--text-muted)]">
        <Info size={14} className="text-blue-400 shrink-0 mt-0.5" />
        <span>
          Simulação não oficial. Notas de corte reais e inscrições somente no Portal Único de Acesso ao Ensino Superior do MEC (acessounico.mec.gov.br).
        </span>
      </footer>
    </div>
  );
};

export default SisuStepResultado;
