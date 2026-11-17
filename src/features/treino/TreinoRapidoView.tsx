import React, { useEffect, useState } from 'react';
import { Lock, ArrowRight, LogIn, Zap } from 'lucide-react';
import { usePremiumStatus } from '../sisu/useSisu';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import {
  FiltrosTreino,
  Questao,
  QuestaoCliente,
  Tentativa,
  selecionarQuestoesFiltradas,
} from './treinoEngine';
import {
  PacoteOffline,
  SessaoPausada,
  TreinoApiError,
  baixarPacoteOffline,
  carregarSessaoPausada,
  fetchQuestoesTreino,
  fetchRevisoesPendentes,
  getFilaOfflineCount,
  getPacoteOffline,
  limparSessaoPausada,
  preloadImagensQuestoes,
  registrarGamificacaoTreino,
  salvarSessaoPausada,
  sincronizarFilaOffline,
} from './treinoService';
import TreinoSetup from './TreinoSetup';
import TreinoRunner from './TreinoRunner';
import TreinoResumo from './TreinoResumo';

interface TreinoRapidoViewProps {
  user: { uid?: string; email?: string | null; displayName?: string | null } | null;
  onNavigatePlanos: () => void;
  onNavigateLogin: () => void;
  onAskVestBot: (prompt: string) => void;
}

type FaseTreino = 'setup' | 'runner' | 'resumo';

const FILTROS_INICIAIS: FiltrosTreino = {
  banca: 'TODAS',
  materia: 'TODAS',
  topico: '',
  dificuldade: 'todas',
  quantidade: 10,
  modo: 'livre',
};

export default function TreinoRapidoView({
  user,
  onNavigatePlanos,
  onNavigateLogin,
  onAskVestBot,
}: TreinoRapidoViewProps) {
  const { isPremium, loading: loadingPlano } = usePremiumStatus(user);
  const isOnline = useOnlineStatus();

  const [fase, setFase] = useState<FaseTreino>('setup');
  const [filtros, setFiltros] = useState<FiltrosTreino>(FILTROS_INICIAIS);
  const [questoesSessao, setQuestoesSessao] = useState<Array<QuestaoCliente | Questao>>([]);
  const [indiceInicial, setIndiceInicial] = useState(0);
  const [tentativas, setTentativas] = useState<Tentativa[]>([]);
  const [streakInicial, setStreakInicial] = useState(0);
  const [offlineMode, setOfflineMode] = useState(false);

  const [loadingSetup, setLoadingSetup] = useState(false);
  const [erroSetup, setErroSetup] = useState<string | null>(null);
  const [assinaturaBloqueada, setAssinaturaBloqueada] = useState(false);

  const [revisoesPendentes, setRevisoesPendentes] = useState(0);
  const [sessaoPausada, setSessaoPausada] = useState<SessaoPausada | null>(() =>
    carregarSessaoPausada()
  );
  const [pacoteOffline, setPacoteOffline] = useState<PacoteOffline | null>(() =>
    getPacoteOffline()
  );
  const [baixandoOffline, setBaixandoOffline] = useState(false);
  const [filaSyncCount, setFilaSyncCount] = useState(() => getFilaOfflineCount());

  useEffect(() => {
    if (!isPremium || !isOnline) return;
    void sincronizarFilaOffline().then(() => setFilaSyncCount(getFilaOfflineCount()));
    void fetchRevisoesPendentes()
      .then((res) => setRevisoesPendentes(res.totalPendentes))
      .catch((err) => {
        if (err instanceof TreinoApiError && err.code === 'SUBSCRIPTION_INACTIVE') {
          setAssinaturaBloqueada(true);
        }
      });
  }, [isPremium, isOnline]);

  const handleIniciar = async (escolhidos: FiltrosTreino, usarOffline = false) => {
    setErroSetup(null);
    setLoadingSetup(true);
    try {
      let lista: Array<QuestaoCliente | Questao> = [];
      if (usarOffline || !isOnline) {
        const pacote = getPacoteOffline();
        if (!pacote || pacote.questoes.length === 0) {
          setErroSetup('Você está offline e ainda não baixou o pacote de 30 questões.');
          return;
        }
        lista = selecionarQuestoesFiltradas(pacote.questoes, escolhidos);
        setOfflineMode(true);
      } else {
        const res = await fetchQuestoesTreino(escolhidos);
        lista = res.questoes;
        setRevisoesPendentes(res.revisoesPendentes);
        setOfflineMode(false);
      }

      if (lista.length === 0) {
        setErroSetup('Nenhuma questão encontrada para esses filtros. Tente ampliar a busca.');
        return;
      }

      limparSessaoPausada();
      setSessaoPausada(null);
      setQuestoesSessao(lista);
      setIndiceInicial(0);
      setTentativas([]);
      setStreakInicial(0);
      preloadImagensQuestoes(lista, -1);
      setFase('runner');
    } catch (err) {
      if (err instanceof TreinoApiError && err.code === 'SUBSCRIPTION_INACTIVE') {
        setAssinaturaBloqueada(true);
      } else {
        setErroSetup(err instanceof Error ? err.message : 'Erro ao carregar questões.');
      }
    } finally {
      setLoadingSetup(false);
    }
  };

  const handleRetomarPausada = () => {
    if (!sessaoPausada) return;
    setFiltros(sessaoPausada.filtros);
    setQuestoesSessao(sessaoPausada.questoes);
    setIndiceInicial(sessaoPausada.indiceAtual);
    setTentativas(sessaoPausada.tentativas);
    setStreakInicial(sessaoPausada.streakAtual);
    setOfflineMode(sessaoPausada.offlineMode);
    preloadImagensQuestoes(sessaoPausada.questoes, sessaoPausada.indiceAtual - 1);
    setFase('runner');
  };

  const handleBaixarOffline = async () => {
    setBaixandoOffline(true);
    setErroSetup(null);
    try {
      const pacote = await baixarPacoteOffline();
      setPacoteOffline(pacote);
    } catch (err) {
      if (err instanceof TreinoApiError && err.code === 'SUBSCRIPTION_INACTIVE') {
        setAssinaturaBloqueada(true);
      } else {
        setErroSetup('Não foi possível baixar o pacote offline agora.');
      }
    } finally {
      setBaixandoOffline(false);
    }
  };

  const handleSincronizarFila = async () => {
    await sincronizarFilaOffline();
    setFilaSyncCount(getFilaOfflineCount());
  };

  if (loadingPlano) {
    return (
      <div className="min-h-[320px] flex flex-col items-center justify-center gap-3 text-[var(--text-muted)]">
        <Zap className="w-9 h-9 text-blue-500 animate-pulse" />
        <p className="text-sm font-semibold">Carregando Treino Rápido...</p>
      </div>
    );
  }

  // Bloqueio limpo quando a assinatura não está ativa (sem paywall borrado)
  if (!isPremium || assinaturaBloqueada) {
    return (
      <div className="max-w-xl mx-auto my-8 p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] shadow-sm space-y-5 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
          <Lock size={22} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-display font-bold text-[var(--text-main)]">
            Treino Rápido disponível para assinantes
          </h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            Sua assinatura não está ativa. Escolha um plano para desbloquear questões comentadas, revisão espaçada e pacote offline.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
          <button
            type="button"
            onClick={onNavigatePlanos}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <span>Escolher um plano</span>
            <ArrowRight size={15} />
          </button>
          {!user && (
            <button
              type="button"
              onClick={onNavigateLogin}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] text-[var(--text-main)] text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn size={15} />
              <span>Já tenho assinatura · Entrar</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  if (fase === 'runner') {
    return (
      <TreinoRunner
        questoes={questoesSessao}
        indiceInicial={indiceInicial}
        tentativasIniciais={tentativas}
        streakInicial={streakInicial}
        modo={filtros.modo}
        offlineMode={offlineMode}
        onAttemptRecorded={(nova, novoStreak, idxAtual) => {
          preloadImagensQuestoes(questoesSessao, idxAtual);
          setFilaSyncCount(getFilaOfflineCount());
          const concluiuRevisaoSemPendencias =
            filtros.modo === 'revisao' && idxAtual + 1 === questoesSessao.length;
          void registrarGamificacaoTreino({
            materia: nova.materia,
            acertou: nova.acertou,
            xpGanho: nova.xpGanho,
            novoStreak,
            concluiuRevisaoSemPendencias,
          });
        }}
        onPausarESair={(idxAtual, tentativasAtuais, streakAtual) => {
          const pausada: SessaoPausada = {
            filtros,
            questoes: questoesSessao,
            indiceAtual: idxAtual,
            tentativas: tentativasAtuais,
            streakAtual,
            offlineMode,
            savedAt: new Date().toISOString(),
          };
          salvarSessaoPausada(pausada);
          setSessaoPausada(pausada);
          setFase('setup');
        }}
        onFinalizarSessao={(finais) => {
          limparSessaoPausada();
          setSessaoPausada(null);
          setTentativas(finais);
          setFase('resumo');
        }}
        onAskVestBot={onAskVestBot}
      />
    );
  }

  if (fase === 'resumo') {
    return (
      <TreinoResumo
        tentativas={tentativas}
        onNovoTreino={() => setFase('setup')}
        onRefazerErros={(ids) => {
          const conjunto = new Set(ids);
          const apenasErros = questoesSessao.filter((q) => conjunto.has(q.id));
          if (apenasErros.length === 0) {
            setFase('setup');
            return;
          }
          setQuestoesSessao(apenasErros);
          setIndiceInicial(0);
          setTentativas([]);
          setStreakInicial(0);
          setFase('runner');
        }}
        onAskVestBot={onAskVestBot}
      />
    );
  }

  return (
    <TreinoSetup
      filtros={filtros}
      onChangeFiltros={setFiltros}
      onIniciar={(f, off) => void handleIniciar(f, off)}
      loading={loadingSetup}
      revisoesPendentes={revisoesPendentes}
      sessaoPausada={sessaoPausada}
      onRetomarPausada={handleRetomarPausada}
      onDescartarPausada={() => {
        limparSessaoPausada();
        setSessaoPausada(null);
      }}
      pacoteOffline={pacoteOffline}
      onBaixarOffline={() => void handleBaixarOffline()}
      baixandoOffline={baixandoOffline}
      filaSyncCount={filaSyncCount}
      onSincronizarFila={() => void handleSincronizarFila()}
      isOnline={isOnline}
      erro={erroSetup}
    />
  );
}
