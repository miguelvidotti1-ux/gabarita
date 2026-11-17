import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Trophy, Sparkles, RotateCcw, PlusCircle, AlertCircle } from 'lucide-react';
import { Tentativa, resumoSessao } from './treinoEngine';

interface TreinoResumoProps {
  tentativas: Tentativa[];
  onNovoTreino: () => void;
  onRefazerErros: (questaoIds: string[]) => void;
  onAskVestBot: (prompt: string) => void;
}

export const TreinoResumo: React.FC<TreinoResumoProps> = ({
  tentativas,
  onNovoTreino,
  onRefazerErros,
  onAskVestBot,
}) => {
  const resumo = useMemo(() => resumoSessao(tentativas), [tentativas]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Cabeçalho resumo */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-500">
            <Trophy size={15} />
            <span>Sessão concluída</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-main)]">
            Resumo do seu Treino Rápido
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Confira seu aproveitamento por matéria e revise os pontos que merecem atenção.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {resumo.errosDetalhados.length > 0 && (
            <button
              type="button"
              onClick={() => onRefazerErros(resumo.errosDetalhados.map((e) => e.questaoId))}
              className="px-4 py-2.5 rounded-xl bg-[var(--bg-hover)] hover:border-[var(--primary)] border border-[var(--border-light)] text-xs font-bold text-[var(--text-main)] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RotateCcw size={14} />
              <span>Revisar erros ({resumo.errosDetalhados.length})</span>
            </button>
          )}
          <button
            type="button"
            onClick={onNovoTreino}
            className="px-5 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <PlusCircle size={15} />
            <span>Novo Treino</span>
          </button>
        </div>
      </div>

      {/* KPIs tabulares */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)]">
          <div className="text-xs font-semibold text-[var(--text-label)]">Acertos</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[var(--text-main)] mt-1">
            {resumo.acertos}/{resumo.total}
          </div>
          <div className="text-xs text-[var(--text-muted)] font-mono tabular-nums mt-0.5">
            {resumo.pctAcerto}% de aproveitamento
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)]">
          <div className="text-xs font-semibold text-[var(--text-label)]">XP ganho na sessão</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-blue-500 mt-1">
            +{resumo.xpTotal} XP
          </div>
          <div className="text-xs text-[var(--text-muted)] mt-0.5">Somado ao seu nível</div>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)]">
          <div className="text-xs font-semibold text-[var(--text-label)]">Maior sequência</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-500 mt-1">
            {resumo.maiorStreak} seguidas
          </div>
          <div className="text-xs text-[var(--text-muted)] mt-0.5">Bônus a cada 5 acertos</div>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)]">
          <div className="text-xs font-semibold text-[var(--text-label)]">Tempo médio</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[var(--text-main)] mt-1">
            {resumo.tempoMedioSeg}s
          </div>
          <div className="text-xs text-[var(--text-muted)] font-mono tabular-nums mt-0.5">
            Total {resumo.tempoTotalSeg}s
          </div>
        </div>
      </div>

      {/* Gráfico Recharts por matéria */}
      {resumo.porMateria.length > 0 && (
        <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] space-y-4">
          <h2 className="text-base font-bold text-[var(--text-main)]">
            Aproveitamento por matéria (%)
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resumo.porMateria}>
                <XAxis dataKey="materia" stroke="var(--text-muted)" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="var(--text-muted)" fontSize={12} />
                <Tooltip
                  formatter={(value: unknown) => [`${String(value)}%`, 'Aproveitamento']}
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '10px',
                    color: 'var(--text-main)',
                  }}
                />
                <Bar dataKey="pctAcerto" radius={[6, 6, 0, 0]}>
                  {resumo.porMateria.map((entry, idx) => (
                    <Cell
                      key={idx}
                      fill={entry.pctAcerto >= 70 ? '#059669' : entry.pctAcerto >= 40 ? '#2563eb' : '#d97706'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Lista de erros detalhados */}
      {resumo.errosDetalhados.length > 0 && (
        <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="text-rose-500" />
            <h2 className="text-base font-bold text-[var(--text-main)]">
              Questões para revisar ({resumo.errosDetalhados.length})
            </h2>
          </div>

          <div className="space-y-3">
            {resumo.errosDetalhados.map((err, i) => (
              <div
                key={`${err.questaoId}-${i}`}
                className="p-4 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-[var(--text-muted)]">
                    {err.banca} · {err.materia} · {err.topico}
                  </div>
                  <div className="text-sm font-medium text-[var(--text-main)]">
                    Você marcou <strong className="text-rose-500">{err.alternativaEscolhida}</strong> · Gabarito:{' '}
                    <strong className="text-emerald-500">{err.correta}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onAskVestBot(
                      `Errei uma questão de ${err.materia} (${err.topico}, banca ${err.banca}). Marquei a alternativa ${err.alternativaEscolhida}, mas o gabarito oficial é ${err.correta}. Como revisar esse tópico de forma objetiva?`
                    )
                  }
                  className="px-3.5 py-2 rounded-xl bg-[var(--bg-card)] hover:border-[var(--primary)] border border-[var(--border-light)] text-xs font-bold text-[var(--text-main)] inline-flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                >
                  <Sparkles size={13} className="text-blue-500" />
                  <span>Pergunte ao VestBot</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TreinoResumo;
