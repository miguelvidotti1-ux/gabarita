import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  HelpCircle,
  Loader2,
  Sparkles,
  Trash2,
} from 'lucide-react';
import {
  AREAS_ENEM_META,
  AreaEnem,
  EDICOES_VALIDAS,
  EdicaoNotasUsuario,
  NotasEnem,
  SISU_EDICAO_ATUAL,
} from '../../../shared/sisuTypes';
import { formatarNotaBR, mediaSimples, parseNotaBR } from '../../../shared/sisuEngine';
import { vestibularEventService, VestibularEvent } from '../../services/vestibularEventService';

interface SisuStepNotasProps {
  edicoes: EdicaoNotasUsuario[];
  onChangeEdicao: (updated: EdicaoNotasUsuario) => void;
  onEstimarDosSimulados: () => Promise<{
    baseadoEmDadosReais: boolean;
    detalhes: string[];
    edicaoAlvo: number;
  }>;
  onAvancar: () => void;
}

const AREA_ORDER: AreaEnem[] = ['LC', 'CH', 'CN', 'MT', 'RED'];

export const SisuStepNotas: React.FC<SisuStepNotasProps> = ({
  edicoes,
  onChangeEdicao,
  onEstimarDosSimulados,
  onAvancar,
}) => {
  const [edicaoAtiva, setEdicaoAtiva] = useState<number>(
    EDICOES_VALIDAS[EDICOES_VALIDAS.length - 1]
  );
  const [inputsTexto, setInputsTexto] = useState<Record<AreaEnem, string>>({
    LC: '',
    CH: '',
    CN: '',
    MT: '',
    RED: '',
  });
  const [erros, setErros] = useState<Partial<Record<AreaEnem, string>>>({});
  const [estimando, setEstimando] = useState(false);
  const [avisoEstimativa, setAvisoEstimativa] = useState<{
    mensagem: string;
    detalhes: string[];
  } | null>(null);
  const [sisuEvent, setSisuEvent] = useState<VestibularEvent | null>(null);

  const registroAtivo =
    edicoes.find((e) => e.edicao === edicaoAtiva) || {
      edicao: edicaoAtiva,
      notas: { LC: 0, CH: 0, CN: 0, MT: 0, RED: 0 },
      treineiro: false,
      origem: 'manual' as const,
    };

  useEffect(() => {
    const nextTexts: Record<AreaEnem, string> = {
      LC: registroAtivo.notas.LC > 0 ? String(registroAtivo.notas.LC).replace('.', ',') : '',
      CH: registroAtivo.notas.CH > 0 ? String(registroAtivo.notas.CH).replace('.', ',') : '',
      CN: registroAtivo.notas.CN > 0 ? String(registroAtivo.notas.CN).replace('.', ',') : '',
      MT: registroAtivo.notas.MT > 0 ? String(registroAtivo.notas.MT).replace('.', ',') : '',
      RED: registroAtivo.notas.RED > 0 ? String(registroAtivo.notas.RED).replace('.', ',') : '',
    };
    setInputsTexto(nextTexts);
    setErros({});
  }, [edicaoAtiva, registroAtivo.atualizadoEm, registroAtivo.origem]);

  useEffect(() => {
    vestibularEventService.getEvents().then((events) => {
      const sisu = events.find((ev) => ev.name.toUpperCase().includes('SISU')) || null;
      setSisuEvent(sisu);
    });
  }, []);

  const handleInputChange = (area: AreaEnem, raw: string) => {
    setInputsTexto((prev) => ({ ...prev, [area]: raw }));

    if (raw.trim() === '') {
      setErros((prev) => {
        const copy = { ...prev };
        delete copy[area];
        return copy;
      });
      onChangeEdicao({
        ...registroAtivo,
        origem: 'manual',
        notas: { ...registroAtivo.notas, [area]: 0 },
      });
      return;
    }

    const parsed = parseNotaBR(raw);
    if (parsed === null) {
      setErros((prev) => ({
        ...prev,
        [area]: 'Informe um valor entre 0 e 1000 (ex.: 712,45).',
      }));
      return;
    }

    setErros((prev) => {
      const copy = { ...prev };
      delete copy[area];
      return copy;
    });

    const nextNotas: NotasEnem = { ...registroAtivo.notas, [area]: parsed };
    onChangeEdicao({
      ...registroAtivo,
      origem: 'manual',
      notas: nextNotas,
    });
  };

  const handleToggleTreineiro = (checked: boolean) => {
    onChangeEdicao({
      ...registroAtivo,
      treineiro: checked,
    });
  };

  const handleLimparEdicao = () => {
    setInputsTexto({ LC: '', CH: '', CN: '', MT: '', RED: '' });
    setErros({});
    onChangeEdicao({
      edicao: edicaoAtiva,
      notas: { LC: 0, CH: 0, CN: 0, MT: 0, RED: 0 },
      treineiro: false,
      origem: 'manual',
    });
  };

  const handleEstimarClick = async () => {
    setEstimando(true);
    setAvisoEstimativa(null);
    try {
      const res = await onEstimarDosSimulados();
      setEdicaoAtiva(res.edicaoAlvo);
      setAvisoEstimativa({
        mensagem: res.baseadoEmDadosReais
          ? `Notas estimadas a partir do seu histórico de simulados e redações no Gabarita (Enem ${res.edicaoAlvo}).`
          : `Sem simulados suficientes no histórico ainda — preenchemos uma base inicial para Enem ${res.edicaoAlvo} que você pode ajustar livremente.`,
        detalhes: res.detalhes,
      });
    } finally {
      setEstimando(false);
    }
  };

  const temAlgumaNotaEdicao = (ed: EdicaoNotasUsuario) =>
    Object.values(ed.notas).some((v) => v > 0);

  const temAoMenosUmaEdicaoValida = edicoes.some(
    (e) => !e.treineiro && e.notas.RED > 0 && temAlgumaNotaEdicao(e)
  );

  const mediaAtualSimples = mediaSimples(registroAtivo.notas);
  const redacaoZerada =
    temAlgumaNotaEdicao(registroAtivo) && registroAtivo.notas.RED <= 0;

  return (
    <div className="space-y-6">
      {/* Banner da Próxima Data Sisu */}
      {sisuEvent && (
        <div className="p-4 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--primary-soft)] text-blue-400 flex items-center justify-center shrink-0">
              <Calendar size={18} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-bold text-[var(--text-main)]">{sisuEvent.name}</p>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-500 border border-amber-500/30">
                  a confirmar pelo MEC
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Previsão: {new Date(sisuEvent.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })} · Para o Sisu {SISU_EDICAO_ATUAL}, valem as edições {EDICOES_VALIDAS.join(', ')}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cabeçalho e Ação Estimar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-main)]">
            1. Informe suas notas do Enem
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Preencha uma ou mais das últimas {EDICOES_VALIDAS.length} edições válidas ({EDICOES_VALIDAS.join(', ')}). O Gabarita calcula cada ano separado e escolhe sua maior média ponderada.
          </p>
        </div>

        <button
          type="button"
          onClick={handleEstimarClick}
          disabled={estimando}
          className="px-4 py-2.5 rounded-xl bg-[var(--primary-soft)] hover:bg-[var(--primary-light)] text-blue-400 border border-[var(--primary-border)] text-xs font-bold inline-flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 disabled:opacity-60"
        >
          {estimando ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
          <span>Usar estimativa dos meus simulados</span>
        </button>
      </div>

      {avisoEstimativa && (
        <div
          role="status"
          className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-xs text-[var(--text-main)] space-y-1.5"
        >
          <p className="font-semibold text-blue-400">{avisoEstimativa.mensagem}</p>
          {avisoEstimativa.detalhes.length > 0 && (
            <ul className="list-disc list-inside text-[var(--text-muted)] space-y-0.5">
              {avisoEstimativa.detalhes.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Seletor de Edições do Enem */}
      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Edições do Enem">
        {EDICOES_VALIDAS.map((ano) => {
          const item = edicoes.find((e) => e.edicao === ano);
          const preenchida = Boolean(item && temAlgumaNotaEdicao(item));
          const valida = Boolean(item && !item.treineiro && item.notas.RED > 0 && preenchida);
          const ativa = edicaoAtiva === ano;

          return (
            <button
              key={ano}
              type="button"
              role="tab"
              aria-selected={ativa}
              onClick={() => setEdicaoAtiva(ano)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
                ativa
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-md shadow-[var(--shadow-primary)]'
                  : 'bg-[var(--bg-hover)] text-[var(--text-muted)] border-[var(--border-light)] hover:text-[var(--text-main)]'
              }`}
            >
              <span>Enem {ano}</span>
              {item?.treineiro ? (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">
                  Treineiro
                </span>
              ) : valida ? (
                <CheckCircle2 size={13} className={ativa ? 'text-emerald-300' : 'text-emerald-500'} />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Formulário da Edição Selecionada */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-light)]">
          <div className="flex items-center gap-3">
            <span className="text-base font-extrabold text-[var(--text-main)]">
              Notas — Enem {edicaoAtiva}
            </span>
            {registroAtivo.origem === 'simulados' && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30">
                Estimativa — não é nota oficial
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-main)] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={registroAtivo.treineiro}
                onChange={(e) => handleToggleTreineiro(e.target.checked)}
                className="w-4 h-4 rounded accent-[var(--primary)] cursor-pointer"
              />
              <span>Fiz esta edição como treineiro</span>
            </label>

            <button
              type="button"
              onClick={handleLimparEdicao}
              className="text-xs font-semibold text-[var(--text-muted)] hover:text-rose-400 inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Trash2 size={13} />
              <span>Limpar ano</span>
            </button>
          </div>
        </div>

        {registroAtivo.treineiro && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-400">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <span>
              <strong>Edição descartada para o Sisu:</strong> notas obtidas como treineiro não podem ser usadas no Sisu. Você pode mantê-las apenas para registro ou preencher outro ano válido.
            </span>
          </div>
        )}

        {!registroAtivo.treineiro && redacaoZerada && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-400">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <span>
              <strong>Atenção:</strong> Redação igual a 0 invalida toda a edição do Enem {edicaoAtiva} no Sisu.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {AREA_ORDER.map((area) => {
            const meta = AREAS_ENEM_META[area];
            const inputId = `sisu-nota-${edicaoAtiva}-${area}`;
            const erro = erros[area];
            return (
              <div key={area} className="space-y-1.5">
                <label
                  htmlFor={inputId}
                  className="block text-xs font-bold text-[var(--text-main)]"
                >
                  {meta.nomeCurto} ({area})
                </label>
                <input
                  id={inputId}
                  type="text"
                  inputMode="decimal"
                  placeholder="Ex.: 712,50"
                  value={inputsTexto[area]}
                  onChange={(e) => handleInputChange(area, e.target.value)}
                  aria-invalid={Boolean(erro)}
                  aria-describedby={erro ? `${inputId}-erro` : undefined}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border text-sm font-mono font-bold text-[var(--text-main)] outline-none transition-all ${
                    erro
                      ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/30'
                      : 'border-[var(--border-color)] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  }`}
                />
                <p className="text-[11px] text-[var(--text-label)] leading-tight">
                  {meta.descricao}
                </p>
                {erro && (
                  <p id={`${inputId}-erro`} className="text-[11px] text-rose-400 font-semibold">
                    {erro}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[var(--border-light)]">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <HelpCircle size={14} className="text-blue-400 shrink-0" />
            <span>
              Média simples em {edicaoAtiva}:{' '}
              <strong className="text-[var(--text-main)] font-mono">
                {formatarNotaBR(mediaAtualSimples)}
              </strong>{' '}
              (os pesos reais do curso serão aplicados no próximo passo).
            </span>
          </div>

          <button
            type="button"
            onClick={onAvancar}
            disabled={!temAoMenosUmaEdicaoValida || Object.keys(erros).length > 0}
            className="px-6 py-3 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-45 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 shadow-md shadow-[var(--shadow-primary)] transition-all cursor-pointer"
          >
            <span>Escolher curso e cota</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SisuStepNotas;
