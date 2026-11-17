import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Flame,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  X,
  Sparkles,
  Flag,
  Pause,
  ArrowRight,
  Strikethrough,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import LatexText from './LatexText';
import {
  ExplicacaoCache,
  Letra,
  ModoTreino,
  MotivoReporte,
  Questao,
  QuestaoCliente,
  TEMPO_MEDIO_SEGUNDOS,
  Tentativa,
} from './treinoEngine';
import {
  ExplicacaoResponse,
  ResponderResponse,
  fetchExplicacaoQuestao,
  reportarQuestao,
  responderOffline,
  responderQuestaoOnline,
} from './treinoService';

interface TreinoRunnerProps {
  questoes: Array<QuestaoCliente | Questao>;
  indiceInicial: number;
  tentativasIniciais: Tentativa[];
  streakInicial: number;
  modo: ModoTreino;
  offlineMode: boolean;
  onAttemptRecorded: (
    tentativa: Tentativa,
    novoStreak: number,
    indiceAtual: number,
    todasTentativas: Tentativa[]
  ) => void;
  onPausarESair: (indiceAtual: number, tentativas: Tentativa[], streakAtual: number) => void;
  onFinalizarSessao: (tentativas: Tentativa[]) => void;
  onAskVestBot: (prompt: string) => void;
}

const MOTIVOS_REPORTE: { id: MotivoReporte; label: string }[] = [
  { id: 'gabarito_errado', label: 'Gabarito incorreto' },
  { id: 'enunciado_incompleto', label: 'Enunciado cortado ou incompleto' },
  { id: 'imagem_quebrada', label: 'Imagem não carrega ou ilegível' },
  { id: 'formula_ilegivel', label: 'Fórmula matemática mal formatada' },
  { id: 'anulada_oficialmente', label: 'Questão anulada oficialmente' },
  { id: 'outro', label: 'Outro problema' },
];

export const TreinoRunner: React.FC<TreinoRunnerProps> = ({
  questoes,
  indiceInicial,
  tentativasIniciais,
  streakInicial,
  modo,
  offlineMode,
  onAttemptRecorded,
  onPausarESair,
  onFinalizarSessao,
  onAskVestBot,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [indice, setIndice] = useState(indiceInicial);
  const [tentativas, setTentativas] = useState<Tentativa[]>(tentativasIniciais);
  const [streak, setStreak] = useState(streakInicial);
  const [selecionada, setSelecionada] = useState<Letra | null>(null);
  const [riscadas, setRiscadas] = useState<Set<Letra>>(new Set());
  const [textoBaseAberto, setTextoBaseAberto] = useState(true);
  const [avisoSemEscolha, setAvisoSemEscolha] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [feedback, setFeedback] = useState<ResponderResponse | null>(null);
  const [explicacaoState, setExplicacaoState] = useState<{
    loading: boolean;
    data?: ExplicacaoCache;
    erro?: string;
  }>({ loading: false });
  const [liveMsg, setLiveMsg] = useState('');
  const [segundosQuestao, setSegundosQuestao] = useState(0);
  const [zoomImagemAberto, setZoomImagemAberto] = useState(false);
  const [erroImagem, setErroImagem] = useState(false);

  // Modal de reporte
  const [reporteAberto, setReporteAberto] = useState(false);
  const [motivoReporte, setMotivoReporte] = useState<MotivoReporte>('gabarito_errado');
  const [detalheReporte, setDetalheReporte] = useState('');
  const [reporteStatus, setReporteStatus] = useState<string | null>(null);
  const [enviandoReporte, setEnviandoReporte] = useState(false);

  const touchTimerRef = useRef<number | null>(null);
  const questaoAtual = questoes[indice];

  // Reset de estado ao trocar de questão
  useEffect(() => {
    setSelecionada(null);
    setRiscadas(new Set());
    setTextoBaseAberto(true);
    setAvisoSemEscolha(false);
    setFeedback(null);
    setExplicacaoState({ loading: false });
    setSegundosQuestao(0);
    setErroImagem(false);
    setZoomImagemAberto(false);
  }, [indice, questaoAtual?.id]);

  // Cronômetro por questão
  useEffect(() => {
    if (!questaoAtual || feedback) return;
    const timer = window.setInterval(() => {
      setSegundosQuestao((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [questaoAtual?.id, feedback]);

  const tempoLimiteBanca = useMemo(() => {
    if (!questaoAtual) return 180;
    return TEMPO_MEDIO_SEGUNDOS[questaoAtual.banca] ?? 180;
  }, [questaoAtual]);

  const segundosRestantes = Math.max(0, tempoLimiteBanca - segundosQuestao);
  const tempoCritico = modo === 'cronometrado' && segundosRestantes <= 30;

  const formatarTempo = (seg: number) => {
    const mins = Math.floor(seg / 60);
    const secs = seg % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const toggleRiscada = (letra: Letra) => {
    if (feedback) return;
    setRiscadas((prev) => {
      const next = new Set(prev);
      if (next.has(letra)) next.delete(letra);
      else next.add(letra);
      return next;
    });
  };

  const carregarExplicacao = async (q: QuestaoCliente | Questao, escolhida: Letra) => {
    // Offline com explicação embutida
    if (offlineMode && 'explicacaoCache' in q && q.explicacaoCache?.resolucao) {
      setExplicacaoState({ loading: false, data: q.explicacaoCache });
      return;
    }
    if (offlineMode) {
      setExplicacaoState({
        loading: false,
        erro: 'A explicação detalhada não carregou agora. Toque em Pergunte ao VestBot para tirar a dúvida.',
      });
      return;
    }

    setExplicacaoState({ loading: true });
    try {
      const resp: ExplicacaoResponse = await fetchExplicacaoQuestao(q.id, escolhida);
      if (resp.explicacao?.resolucao) {
        setExplicacaoState({ loading: false, data: resp.explicacao });
      } else {
        setExplicacaoState({
          loading: false,
          erro:
            resp.erro ||
            'A explicação detalhada não carregou agora. Toque em Pergunte ao VestBot para tirar a dúvida.',
        });
      }
    } catch {
      setExplicacaoState({
        loading: false,
        erro: 'A explicação detalhada não carregou agora. Toque em Pergunte ao VestBot para tirar a dúvida.',
      });
    }
  };

  const confirmarResposta = async () => {
    if (!questaoAtual || enviando || feedback) return;
    if (!selecionada) {
      setAvisoSemEscolha(true);
      setLiveMsg('Escolha uma alternativa primeiro.');
      return;
    }

    setAvisoSemEscolha(false);
    setEnviando(true);

    try {
      let resultado: ResponderResponse;
      if (offlineMode && 'correta' in questaoAtual) {
        resultado = responderOffline(questaoAtual, selecionada, segundosQuestao, streak);
      } else {
        resultado = await responderQuestaoOnline({
          questaoId: questaoAtual.id,
          alternativaEscolhida: selecionada,
          tempoSeg: segundosQuestao,
          streakAtual: streak,
        });
      }

      try {
        navigator.vibrate?.(resultado.acertou ? [18] : [35, 30, 35]);
      } catch {}

      const novaTentativa: Tentativa = {
        questaoId: questaoAtual.id,
        banca: questaoAtual.banca,
        materia: questaoAtual.materia,
        topico: questaoAtual.topico,
        alternativaEscolhida: selecionada,
        correta: resultado.correta,
        acertou: resultado.acertou,
        tempoSeg: segundosQuestao,
        xpGanho: resultado.xpGanho,
        bonusStreak: resultado.bonusStreak,
        streakApos: resultado.novoStreak,
        respondidaEm: new Date().toISOString(),
      };

      const novasTentativas = [...tentativas, novaTentativa];
      setTentativas(novasTentativas);
      setStreak(resultado.novoStreak);
      setFeedback(resultado);

      setLiveMsg(
        resultado.acertou
          ? `Correta! Mais ${resultado.xpGanho} XP.${resultado.bonusStreak ? ' Bônus de sequência ativado.' : ''}`
          : `Alternativa incorreta. O gabarito oficial é ${resultado.correta}. Mais ${resultado.xpGanho} XP.`
      );

      onAttemptRecorded(novaTentativa, resultado.novoStreak, indice, novasTentativas);
      void carregarExplicacao(questaoAtual, selecionada);
    } catch {
      setLiveMsg('Não foi possível corrigir agora. Verifique sua conexão.');
    } finally {
      setEnviando(false);
    }
  };

  const avancarQuestao = () => {
    if (indice + 1 < questoes.length) {
      setIndice((i) => i + 1);
    } else {
      onFinalizarSessao(tentativas);
    }
  };

  // Atalhos de teclado desktop (A–E, 1–5, Shift+Letra para riscar, Enter para confirmar/avançar)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (reporteAberto || zoomImagemAberto || !questaoAtual) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')
      ) {
        return;
      }

      const key = e.key.toUpperCase();
      const mapNum: Record<string, Letra> = { '1': 'A', '2': 'B', '3': 'C', '4': 'D', '5': 'E' };
      const mapped = mapNum[key] ?? (['A', 'B', 'C', 'D', 'E'].includes(key) ? (key as Letra) : null);

      if (mapped && questaoAtual.alternativas.some((a) => a.letra === mapped)) {
        if (e.shiftKey) {
          e.preventDefault();
          toggleRiscada(mapped);
        } else if (!feedback) {
          e.preventDefault();
          setSelecionada(mapped);
          setAvisoSemEscolha(false);
        }
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (feedback) {
          avancarQuestao();
        } else {
          void confirmarResposta();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  if (!questaoAtual) return null;

  const progressoPct = Math.round(((indice + (feedback ? 1 : 0)) / questoes.length) * 100);

  const handleReportarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviandoReporte(true);
    setReporteStatus(null);
    try {
      const resp = await reportarQuestao(questaoAtual.id, motivoReporte, detalheReporte);
      setReporteStatus(`Reporte enviado (${resp.protocolo}). Obrigado por ajudar a melhorar o Gabarita.`);
      setDetalheReporte('');
    } catch {
      setReporteStatus('Não foi possível enviar o reporte agora. Tente novamente.');
    } finally {
      setEnviandoReporte(false);
    }
  };

  const handleVestBot = () => {
    const prompt = [
      `Estou treinando no Treino Rápido do Gabarita (${questaoAtual.banca} ${questaoAtual.ano} · ${questaoAtual.materia} — ${questaoAtual.topico}) e fiquei com dúvida nesta questão:`,
      questaoAtual.textoBase ? `Texto-base: ${questaoAtual.textoBase}` : '',
      `Enunciado: ${questaoAtual.enunciado}`,
      feedback ? `Gabarito oficial: ${feedback.correta}${selecionada ? ` (eu marquei ${selecionada})` : ''}.` : '',
      'Pode me explicar passo a passo por que essa é a resposta certa e como evitar pegadinhas parecidas?',
    ]
      .filter(Boolean)
      .join('\n\n');

    onAskVestBot(prompt);
  };

  return (
    <div className="max-w-[720px] mx-auto space-y-5 pb-24 sm:pb-10">
      {/* Região acessível live */}
      <div aria-live="polite" className="sr-only">
        {liveMsg}
      </div>

      {/* Barra superior de progresso, streak, timer e pausa */}
      <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold font-mono tabular-nums text-[var(--text-main)]">
              {indice + 1} de {questoes.length}
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-bold font-mono tabular-nums text-amber-500">
              <Flame size={15} />
              <span>{streak} seguidas</span>
            </span>

            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold font-mono tabular-nums ${
                tempoCritico ? 'text-rose-500 font-bold' : 'text-[var(--text-muted)]'
              }`}
            >
              <Clock size={14} />
              <span>
                {modo === 'cronometrado'
                  ? `Restante ${formatarTempo(segundosRestantes)}`
                  : formatarTempo(segundosQuestao)}
              </span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => onPausarESair(indice, tentativas, streak)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--bg-hover)] hover:text-[var(--text-main)] text-[var(--text-muted)] border border-[var(--border-light)] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Pause size={13} />
            <span>Pausar e sair</span>
          </button>
        </div>

        <div className="h-1.5 rounded-full bg-[var(--bg-hover)] overflow-hidden">
          <div
            className="h-full bg-[var(--primary)] transition-all duration-300"
            style={{ width: `${progressoPct}%` }}
          />
        </div>
      </div>

      {/* Card principal da questão */}
      <motion.div
        key={questaoAtual.id}
        initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
        className="p-6 sm:p-7 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] shadow-sm space-y-5"
      >
        {/* Metadados limpos sem pílulas */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
          <div className="flex flex-wrap items-center gap-1.5 font-medium">
            <strong className="text-[var(--text-main)]">{questaoAtual.banca}</strong>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{questaoAtual.ano}</span>
            <span aria-hidden="true">·</span>
            <span>{questaoAtual.materia}</span>
            <span aria-hidden="true">·</span>
            <span>{questaoAtual.topico}</span>
          </div>

          <div className="flex items-center gap-2">
            {questaoAtual.anulada && (
              <span className="text-xs font-bold text-amber-500">Questão anulada</span>
            )}
            {questaoAtual.fonte && (
              <span className="text-[11px] font-medium text-[var(--text-label)]">
                {questaoAtual.fonte}
              </span>
            )}
          </div>
        </div>

        {/* Texto-base recolhível (aberto por padrão) */}
        {questaoAtual.textoBase && (
          <div className="rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] overflow-hidden">
            <button
              type="button"
              onClick={() => setTextoBaseAberto((o) => !o)}
              className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-bold text-[var(--text-main)] cursor-pointer hover:bg-[var(--border-light)]/40 transition-colors"
            >
              <span>Texto-base de apoio</span>
              {textoBaseAberto ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
            {textoBaseAberto && (
              <div className="px-4 pb-3.5 pt-1 text-sm leading-relaxed text-[var(--text-muted)] border-t border-[var(--border-light)]">
                <LatexText text={questaoAtual.textoBase} />
              </div>
            )}
          </div>
        )}

        {/* Enunciado */}
        <div className="text-[15px] sm:text-base leading-relaxed text-[var(--text-main)] font-medium">
          <LatexText text={questaoAtual.enunciado} />
        </div>

        {/* Imagem com zoom ao tocar + fallback */}
        {questaoAtual.imagemUrl && (
          <div>
            {!erroImagem ? (
              <button
                type="button"
                onClick={() => setZoomImagemAberto(true)}
                className="relative group block w-full rounded-xl overflow-hidden border border-[var(--border-light)] bg-[var(--bg-hover)] cursor-zoom-in"
                aria-label="Ampliar imagem da questão"
              >
                <img
                  src={questaoAtual.imagemUrl}
                  alt={`Figura ilustrativa da questão ${questaoAtual.banca} ${questaoAtual.ano}`}
                  referrerPolicy="no-referrer"
                  onError={() => setErroImagem(true)}
                  className="max-h-72 mx-auto object-contain p-2"
                />
                <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/70 text-white text-[11px] font-semibold inline-flex items-center gap-1">
                  <ZoomIn size={13} />
                  Ampliar
                </span>
              </button>
            ) : (
              <div className="p-4 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] text-xs text-[var(--text-muted)] flex items-center gap-2">
                <AlertTriangle size={15} className="text-amber-500 shrink-0" />
                <span>A imagem desta questão não pôde ser carregada no momento.</span>
              </div>
            )}
          </div>
        )}

        {/* Alternativas */}
        <div className="space-y-2.5">
          {questaoAtual.alternativas.map((alt) => {
            const isSelected = selecionada === alt.letra;
            const isRiscada = riscadas.has(alt.letra);
            const isCorrect = feedback?.correta === alt.letra;
            const isWrongChosen = feedback && !feedback.acertou && isSelected && !isCorrect;

            let cardClasses =
              'border-[var(--border-light)] bg-[var(--bg-hover)] hover:border-[var(--border-color)]';
            if (feedback) {
              if (isCorrect) {
                cardClasses = 'border-emerald-500 bg-emerald-500/12';
              } else if (isWrongChosen) {
                cardClasses = 'border-rose-500 bg-rose-500/12';
              } else {
                cardClasses = 'border-[var(--border-light)] bg-[var(--bg-hover)] opacity-70';
              }
            } else if (isSelected) {
              cardClasses = 'border-[var(--primary)] bg-[var(--primary-soft)]';
            }

            return (
              <motion.div
                key={alt.letra}
                animate={
                  !prefersReducedMotion && isWrongChosen
                    ? { x: [0, -6, 6, -4, 4, 0] }
                    : !prefersReducedMotion && feedback && isCorrect && isSelected
                      ? { scale: [1, 1.015, 1] }
                      : { x: 0, scale: 1 }
                }
                transition={{ duration: 0.25 }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  toggleRiscada(alt.letra);
                }}
                onTouchStart={() => {
                  if (feedback) return;
                  touchTimerRef.current = window.setTimeout(() => {
                    toggleRiscada(alt.letra);
                  }, 500);
                }}
                onTouchEnd={() => {
                  if (touchTimerRef.current) {
                    window.clearTimeout(touchTimerRef.current);
                    touchTimerRef.current = null;
                  }
                }}
                onTouchCancel={() => {
                  if (touchTimerRef.current) {
                    window.clearTimeout(touchTimerRef.current);
                    touchTimerRef.current = null;
                  }
                }}
                className={`flex items-stretch rounded-xl border transition-colors ${cardClasses}`}
              >
                <button
                  type="button"
                  disabled={Boolean(feedback)}
                  onClick={() => {
                    setSelecionada(alt.letra);
                    setAvisoSemEscolha(false);
                  }}
                  className="flex-1 flex items-start gap-3 p-3.5 text-left cursor-pointer disabled:cursor-default min-h-[44px]"
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono shrink-0 ${
                      isCorrect
                        ? 'bg-emerald-600 text-white'
                        : isWrongChosen
                          ? 'bg-rose-600 text-white'
                          : isSelected
                            ? 'bg-[var(--primary)] text-white'
                            : 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-light)]'
                    }`}
                  >
                    {alt.letra}
                  </span>

                  <span
                    className={`flex-1 text-sm leading-relaxed text-[var(--text-main)] pt-0.5 ${
                      isRiscada && !feedback ? 'line-through opacity-50' : ''
                    }`}
                  >
                    <LatexText text={alt.texto} />
                  </span>

                  {feedback && isCorrect && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500 shrink-0 pt-0.5">
                      <CheckCircle2 size={16} />
                      <span>Correta</span>
                    </span>
                  )}
                  {isWrongChosen && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-500 shrink-0 pt-0.5">
                      <XCircle size={16} />
                      <span>Sua escolha</span>
                    </span>
                  )}
                </button>

                {!feedback && (
                  <button
                    type="button"
                    onClick={() => toggleRiscada(alt.letra)}
                    title="Riscar alternativa (botão direito, segurar no toque ou Shift+Letra)"
                    aria-label={`Riscar alternativa ${alt.letra}`}
                    className={`px-3 flex items-center justify-center border-l border-[var(--border-light)] cursor-pointer transition-colors ${
                      isRiscada
                        ? 'text-amber-500 bg-amber-500/10'
                        : 'text-[var(--text-label)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    <Strikethrough size={14} />
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Aviso inline quando tenta confirmar sem alternativa */}
        {avisoSemEscolha && !feedback && (
          <p className="text-xs font-semibold text-amber-500">Escolha uma alternativa primeiro.</p>
        )}

        {/* Resultado imediato + Explicação */}
        {feedback && (
          <div className="pt-4 border-t border-[var(--border-light)] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {feedback.acertou ? (
                  <CheckCircle2 size={18} className="text-emerald-500" />
                ) : (
                  <XCircle size={18} className="text-rose-500" />
                )}
                <span className="text-sm font-bold text-[var(--text-main)]">
                  {feedback.acertou
                    ? `Acertou! +${feedback.xpGanho} XP`
                    : `Errou · Gabarito: ${feedback.correta} (+${feedback.xpGanho} XP)`}
                </span>
                {feedback.bonusStreak && (
                  <span className="text-xs font-bold text-amber-500">
                    Bônus de sequência +5 XP
                  </span>
                )}
              </div>

              <span className="text-xs text-[var(--text-muted)] font-mono tabular-nums">
                Próxima revisão em {feedback.proximaRevisao.intervaloDias} dia(s)
              </span>
            </div>

            {/* Bloco da explicação */}
            <div className="p-4 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] space-y-3">
              {explicacaoState.loading ? (
                <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]">
                  <Loader2 size={15} className="animate-spin text-blue-500" />
                  <span>Carregando explicação passo a passo...</span>
                </div>
              ) : explicacaoState.data ? (
                <div className="space-y-3 text-sm text-[var(--text-main)]">
                  <div>
                    <div className="text-xs font-bold text-[var(--text-label)] mb-1">Resolução</div>
                    <p className="leading-relaxed">
                      <LatexText text={explicacaoState.data.resolucao} />
                    </p>
                  </div>

                  {Object.keys(explicacaoState.data.porQueErrada || {}).length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-[var(--border-light)]">
                      <div className="text-xs font-bold text-[var(--text-label)]">
                        Por que as outras estão incorretas
                      </div>
                      {Object.entries(explicacaoState.data.porQueErrada).map(([l, motivo]) =>
                        motivo ? (
                          <div key={l} className="text-xs text-[var(--text-muted)] leading-relaxed">
                            <strong className="text-[var(--text-main)]">{l})</strong>{' '}
                            <LatexText text={motivo} />
                          </div>
                        ) : null
                      )}
                    </div>
                  )}

                  {explicacaoState.data.macete && (
                    <div className="pt-2 border-t border-[var(--border-light)] text-xs text-blue-400 font-medium">
                      <strong>Macete:</strong> <LatexText text={explicacaoState.data.macete} />
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-[var(--text-muted)]">
                  {explicacaoState.erro ||
                    'A explicação detalhada não carregou agora. Toque em Pergunte ao VestBot para tirar a dúvida.'}
                </p>
              )}
            </div>

            {/* Ações pós-resposta: VestBot & Reportar erro */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleVestBot}
                className="px-3.5 py-2 rounded-xl bg-[var(--bg-hover)] hover:border-[var(--primary)] border border-[var(--border-light)] text-xs font-bold text-[var(--text-main)] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Sparkles size={14} className="text-blue-500" />
                <span>Pergunte ao VestBot</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setReporteStatus(null);
                  setReporteAberto(true);
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:text-rose-400 inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Flag size={13} />
                <span>Reportar erro na questão</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* CTA sticky no mobile */}
      <div className="sticky bottom-3 z-20 flex justify-end">
        {!feedback ? (
          <button
            type="button"
            onClick={() => void confirmarResposta()}
            disabled={enviando}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-60 text-white text-sm font-bold shadow-lg cursor-pointer transition-colors whitespace-nowrap"
          >
            {enviando ? 'Corrigindo...' : 'Confirmar resposta'}
          </button>
        ) : (
          <button
            type="button"
            onClick={avancarQuestao}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-bold inline-flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-colors whitespace-nowrap"
          >
            <span>{indice + 1 < questoes.length ? 'Próxima questão' : 'Ver resumo do treino'}</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>

      {/* Modal de zoom na imagem */}
      {zoomImagemAberto && questaoAtual.imagemUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setZoomImagemAberto(false)}
        >
          <button
            type="button"
            onClick={() => setZoomImagemAberto(false)}
            aria-label="Fechar ampliação"
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
          >
            <X size={20} />
          </button>
          <img
            src={questaoAtual.imagemUrl}
            alt="Imagem ampliada da questão"
            referrerPolicy="no-referrer"
            className="max-w-full max-h-[90vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Modal de reporte */}
      {reporteAberto && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
          onClick={() => setReporteAberto(false)}
        >
          <form
            onSubmit={(e) => void handleReportarSubmit(e)}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--text-main)]">
                Reportar erro na questão
              </h3>
              <button
                type="button"
                onClick={() => setReporteAberto(false)}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="motivo-reporte" className="text-xs font-semibold text-[var(--text-label)]">
                Motivo
              </label>
              <select
                id="motivo-reporte"
                value={motivoReporte}
                onChange={(e) => setMotivoReporte(e.target.value as MotivoReporte)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-sm text-[var(--text-main)] outline-none"
              >
                {MOTIVOS_REPORTE.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="detalhe-reporte" className="text-xs font-semibold text-[var(--text-label)]">
                Detalhes (opcional)
              </label>
              <textarea
                id="detalhe-reporte"
                rows={3}
                value={detalheReporte}
                onChange={(e) => setDetalheReporte(e.target.value)}
                placeholder="Descreva rapidamente o que encontrou..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-sm text-[var(--text-main)] outline-none resize-none"
              />
            </div>

            {reporteStatus && (
              <p className="text-xs font-medium text-emerald-500">{reporteStatus}</p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReporteAberto(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--bg-hover)] text-[var(--text-muted)] cursor-pointer"
              >
                Fechar
              </button>
              <button
                type="submit"
                disabled={enviandoReporte}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white cursor-pointer disabled:opacity-50"
              >
                {enviandoReporte ? 'Enviando...' : 'Enviar reporte'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TreinoRunner;
