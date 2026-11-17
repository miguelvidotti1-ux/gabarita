import { auth } from '../../firebase';
import { levelSystem } from '../../services/levelService';
import { missionEngine } from '../../services/missionService';
import { achievementService } from '../../services/achievementService';
import {
  ExplicacaoCache,
  FiltrosTreino,
  ItemRevisao,
  Letra,
  MotivoReporte,
  Questao,
  QuestaoCliente,
  Tentativa,
} from './treinoEngine';
import { calcularXP, corrigir, proximaRevisao } from './treinoEngine';

const OFFLINE_PACOTE_KEY = 'gabarita_treino_offline_pacote_v1';
const OFFLINE_FILA_KEY = 'gabarita_treino_fila_sync_v1';
const REVISAO_LOCAL_KEY = 'gabarita_treino_revisao_v1';
const SESSAO_PAUSADA_KEY = 'gabarita_treino_sessao_pausada_v1';
const STATS_HOJE_KEY = 'gabarita_treino_stats_v1';

export class TreinoApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'TreinoApiError';
    this.status = status;
    this.code = code;
  }
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await auth.currentUser?.getIdToken().catch(() => undefined);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function parseResponse<T>(res: Response): Promise<T> {
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    throw new TreinoApiError(
      typeof data.erro === 'string' ? data.erro : 'Falha na comunicação com o servidor.',
      res.status,
      typeof data.code === 'string' ? data.code : undefined
    );
  }
  return data as T;
}

export interface QuestoesResponse {
  questoes: QuestaoCliente[];
  totalDisponivel: number;
  revisoesPendentes: number;
}

export async function fetchQuestoesTreino(filtros: FiltrosTreino): Promise<QuestoesResponse> {
  const params = new URLSearchParams();
  if (filtros.banca) params.set('banca', filtros.banca);
  if (filtros.materia) params.set('materia', filtros.materia);
  if (filtros.topico) params.set('topico', filtros.topico);
  if (filtros.dificuldade) params.set('dificuldade', filtros.dificuldade);
  params.set('quantidade', String(filtros.quantidade));
  params.set('modo', filtros.modo);

  const headers = await getAuthHeaders();
  const res = await fetch(`/api/treino/questoes?${params.toString()}`, { headers });
  return parseResponse<QuestoesResponse>(res);
}

export interface ResponderResponse {
  acertou: boolean;
  correta: Letra;
  xpGanho: number;
  bonusStreak: boolean;
  novoStreak: number;
  proximaRevisao: ItemRevisao;
  explicacaoDisponivel: boolean;
}

export async function responderQuestaoOnline(payload: {
  questaoId: string;
  alternativaEscolhida: Letra;
  tempoSeg: number;
  streakAtual: number;
}): Promise<ResponderResponse> {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/treino/responder', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  return parseResponse<ResponderResponse>(res);
}

export interface ExplicacaoResponse {
  origem: 'cache' | 'ia' | 'fallback';
  explicacao?: ExplicacaoCache;
  erro?: string;
}

export async function fetchExplicacaoQuestao(
  questaoId: string,
  alternativaEscolhida?: Letra
): Promise<ExplicacaoResponse> {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/treino/explicacao', {
    method: 'POST',
    headers,
    body: JSON.stringify({ questaoId, alternativaEscolhida }),
  });
  return parseResponse<ExplicacaoResponse>(res);
}

export interface RevisaoResponse {
  pendentes: Array<{ questao: QuestaoCliente; revisao: ItemRevisao }>;
  totalPendentes: number;
  estatisticas: { totalRevisadas: number; hojeRespondidas: number };
}

export async function fetchRevisoesPendentes(): Promise<RevisaoResponse> {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/treino/revisao', { headers });
  return parseResponse<RevisaoResponse>(res);
}

export async function reportarQuestao(
  questaoId: string,
  motivo: MotivoReporte,
  detalhe?: string
): Promise<{ sucesso: boolean; protocolo: string }> {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/treino/reportar', {
    method: 'POST',
    headers,
    body: JSON.stringify({ questaoId, motivo, detalhe }),
  });
  return parseResponse<{ sucesso: boolean; protocolo: string }>(res);
}

export interface PacoteOffline {
  questoes: Questao[];
  geradoEm: string;
  total: number;
}

export async function baixarPacoteOffline(): Promise<PacoteOffline> {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/treino/pacote-offline', { headers });
  const data = await parseResponse<PacoteOffline>(res);
  try {
    localStorage.setItem(OFFLINE_PACOTE_KEY, JSON.stringify(data));
  } catch {}
  return data;
}

export function getPacoteOffline(): PacoteOffline | null {
  try {
    const raw = localStorage.getItem(OFFLINE_PACOTE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PacoteOffline;
    return Array.isArray(parsed.questoes) ? parsed : null;
  } catch {
    return null;
  }
}

interface FilaOfflineItem {
  questaoId: string;
  alternativaEscolhida: Letra;
  tempoSeg: number;
  streakAtual: number;
  criadoEm: string;
}

function getRevisaoLocalMap(): Record<string, ItemRevisao> {
  try {
    const raw = localStorage.getItem(REVISAO_LOCAL_KEY);
    return raw ? (JSON.parse(raw) as Record<string, ItemRevisao>) : {};
  } catch {
    return {};
  }
}

export function getFilaOfflineCount(): number {
  try {
    const raw = localStorage.getItem(OFFLINE_FILA_KEY);
    const list = raw ? (JSON.parse(raw) as FilaOfflineItem[]) : [];
    return Array.isArray(list) ? list.length : 0;
  } catch {
    return 0;
  }
}

export function responderOffline(
  questao: Questao,
  alternativaEscolhida: Letra,
  tempoSeg: number,
  streakAtual: number
): ResponderResponse {
  const res = corrigir(questao, alternativaEscolhida);
  const novoStreak = res.acertou ? streakAtual + 1 : 0;
  const { xpGanho, bonusStreak } = calcularXP(res.acertou, novoStreak);

  const revisaoMap = getRevisaoLocalMap();
  const atualizada = proximaRevisao(questao.id, revisaoMap[questao.id], res.acertou);
  revisaoMap[questao.id] = atualizada;
  try {
    localStorage.setItem(REVISAO_LOCAL_KEY, JSON.stringify(revisaoMap));
    const rawFila = localStorage.getItem(OFFLINE_FILA_KEY);
    const fila = rawFila ? (JSON.parse(rawFila) as FilaOfflineItem[]) : [];
    fila.push({
      questaoId: questao.id,
      alternativaEscolhida,
      tempoSeg: Math.round(tempoSeg),
      streakAtual,
      criadoEm: new Date().toISOString(),
    });
    localStorage.setItem(OFFLINE_FILA_KEY, JSON.stringify(fila));
  } catch {}

  return {
    acertou: res.acertou,
    correta: res.correta,
    xpGanho,
    bonusStreak,
    novoStreak,
    proximaRevisao: atualizada,
    explicacaoDisponivel: Boolean(questao.explicacaoCache),
  };
}

export async function sincronizarFilaOffline(): Promise<number> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return 0;
  if (!auth.currentUser) return 0;

  let fila: FilaOfflineItem[] = [];
  try {
    const raw = localStorage.getItem(OFFLINE_FILA_KEY);
    fila = raw ? (JSON.parse(raw) as FilaOfflineItem[]) : [];
  } catch {
    return 0;
  }

  if (!Array.isArray(fila) || fila.length === 0) return 0;

  let sincronizados = 0;
  const restantes: FilaOfflineItem[] = [];

  for (const item of fila) {
    try {
      await responderQuestaoOnline({
        questaoId: item.questaoId,
        alternativaEscolhida: item.alternativaEscolhida,
        tempoSeg: item.tempoSeg,
        streakAtual: item.streakAtual,
      });
      sincronizados += 1;
    } catch {
      restantes.push(item);
    }
  }

  try {
    if (restantes.length === 0) {
      localStorage.removeItem(OFFLINE_FILA_KEY);
    } else {
      localStorage.setItem(OFFLINE_FILA_KEY, JSON.stringify(restantes));
    }
  } catch {}

  return sincronizados;
}

export interface SessaoPausada {
  filtros: FiltrosTreino;
  questoes: Array<QuestaoCliente | Questao>;
  indiceAtual: number;
  tentativas: Tentativa[];
  streakAtual: number;
  offlineMode: boolean;
  savedAt: string;
}

export function salvarSessaoPausada(sessao: SessaoPausada): void {
  try {
    localStorage.setItem(SESSAO_PAUSADA_KEY, JSON.stringify(sessao));
  } catch {}
}

export function carregarSessaoPausada(): SessaoPausada | null {
  try {
    const raw = localStorage.getItem(SESSAO_PAUSADA_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SessaoPausada;
    if (!Array.isArray(parsed.questoes) || parsed.questoes.length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function limparSessaoPausada(): void {
  try {
    localStorage.removeItem(SESSAO_PAUSADA_KEY);
  } catch {}
}

export interface TreinoStatsHoje {
  data: string;
  respondidasHoje: number;
  acertosHoje: number;
  streakAtual: number;
  maiorStreak: number;
}

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getTreinoStatsHoje(): TreinoStatsHoje {
  const hoje = getTodayKey();
  try {
    const raw = localStorage.getItem(STATS_HOJE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as TreinoStatsHoje;
      if (parsed.data === hoje) {
        return parsed;
      }
      return {
        data: hoje,
        respondidasHoje: 0,
        acertosHoje: 0,
        streakAtual: parsed.streakAtual ?? 0,
        maiorStreak: parsed.maiorStreak ?? 0,
      };
    }
  } catch {}

  return {
    data: hoje,
    respondidasHoje: 0,
    acertosHoje: 0,
    streakAtual: 0,
    maiorStreak: 0,
  };
}

export async function registrarGamificacaoTreino(params: {
  materia: string;
  acertou: boolean;
  xpGanho: number;
  novoStreak: number;
  concluiuRevisaoSemPendencias?: boolean;
}): Promise<void> {
  const stats = getTreinoStatsHoje();
  const updated: TreinoStatsHoje = {
    data: getTodayKey(),
    respondidasHoje: stats.respondidasHoje + 1,
    acertosHoje: stats.acertosHoje + (params.acertou ? 1 : 0),
    streakAtual: params.novoStreak,
    maiorStreak: Math.max(stats.maiorStreak, params.novoStreak),
  };

  try {
    localStorage.setItem(STATS_HOJE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('treino-stats-updated', { detail: updated }));
  } catch {}

  levelSystem.addXP(params.xpGanho, params.materia);
  missionEngine.updateTreinoProgress(1);

  const uid = auth.currentUser?.uid;
  if (uid) {
    if (params.novoStreak >= 10) {
      void achievementService.unlockTreinoBadgeIfNeeded(uid, 'c_treino_streak_10');
    }
    if (params.concluiuRevisaoSemPendencias) {
      void achievementService.unlockTreinoBadgeIfNeeded(uid, 'c_treino_revisao_dia');
    }
    void achievementService.trackActivity(uid, 'questoes', 1);
  }
}

export function preloadImagensQuestoes(
  questoes: Array<{ imagemUrl?: string }>,
  currentIndex: number
): void {
  if (typeof window === 'undefined') return;
  for (let offset = 1; offset <= 2; offset += 1) {
    const q = questoes[currentIndex + offset];
    if (q?.imagemUrl) {
      const img = new Image();
      img.src = q.imagemUrl;
    }
  }
}
