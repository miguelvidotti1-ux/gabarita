import { Router, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { Type } from '@google/genai';
import {
  AuthenticatedRequest,
  FIREBASE_PROJECT_ID,
  getFirestoreRestBase,
  requireActiveSubscription,
} from '../authMiddleware';
import { GenerateFallbackOptions } from '../geminiClient';
import {
  Banca,
  Dificuldade,
  ExplicacaoCache,
  ItemRevisao,
  Letra,
  Questao,
  Tentativa,
} from '../../shared/treino/types';
import {
  calcularXP,
  corrigir,
  omitirGabaritoParaCliente,
  proximaRevisao,
  selecionarQuestoesFiltradas,
} from '../../shared/treino/treinoEngine';
import sampleQuestoesRaw from '../../src/data/treino/questoes.sample.json';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const IMPORTED_QUESTOES_PATH = path.join(DATA_DIR, 'treino_questoes.json');
const EXPLICACOES_CACHE_PATH = path.join(DATA_DIR, 'treino_explicacoes_cache.json');
const USUARIO_TREINO_PATH = path.join(DATA_DIR, 'treino_usuario.json');
const REPORTES_PATH = path.join(DATA_DIR, 'treino_reportes.json');

interface UsuarioTreinoStore {
  revisao: Record<string, ItemRevisao>;
  tentativas: Tentativa[];
}

function readJsonSafe<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
    }
  } catch (err) {
    console.warn(`[Treino] Falha ao ler ${filePath}:`, err);
  }
  return fallback;
}

function writeJsonSafe(filePath: string, value: unknown): void {
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf-8');
  } catch (err) {
    console.warn(`[Treino] Falha ao gravar ${filePath}:`, err);
  }
}

export function loadExplicacoesCacheMap(): Record<string, ExplicacaoCache> {
  return readJsonSafe<Record<string, ExplicacaoCache>>(EXPLICACOES_CACHE_PATH, {});
}

export function saveExplicacaoCacheItem(questaoId: string, explicacao: ExplicacaoCache): void {
  const atual = loadExplicacoesCacheMap();
  atual[questaoId] = explicacao;
  writeJsonSafe(EXPLICACOES_CACHE_PATH, atual);
}

export function loadBancoQuestoes(): Questao[] {
  const sample = sampleQuestoesRaw as Questao[];
  const imported = readJsonSafe<Questao[]>(IMPORTED_QUESTOES_PATH, []);
  const cacheMap = loadExplicacoesCacheMap();

  const merged = new Map<string, Questao>();
  for (const q of sample) {
    merged.set(q.id, { ...q, explicacaoCache: cacheMap[q.id] ?? q.explicacaoCache });
  }
  if (Array.isArray(imported)) {
    for (const q of imported) {
      if (q && q.id) {
        merged.set(q.id, { ...q, explicacaoCache: cacheMap[q.id] ?? q.explicacaoCache });
      }
    }
  }
  return Array.from(merged.values());
}

function loadAllUsuarioStores(): Record<string, UsuarioTreinoStore> {
  return readJsonSafe<Record<string, UsuarioTreinoStore>>(USUARIO_TREINO_PATH, {});
}

function getUsuarioStore(uid: string): UsuarioTreinoStore {
  const all = loadAllUsuarioStores();
  return all[uid] ?? { revisao: {}, tentativas: [] };
}

function saveUsuarioStore(uid: string, store: UsuarioTreinoStore): void {
  const all = loadAllUsuarioStores();
  all[uid] = {
    revisao: store.revisao,
    tentativas: store.tentativas.slice(-500),
  };
  writeJsonSafe(USUARIO_TREINO_PATH, all);
}

type FirestoreValue =
  | { stringValue: string }
  | { integerValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean };

function toFirestoreFields(obj: Record<string, string | number | boolean>): Record<string, FirestoreValue> {
  const fields: Record<string, FirestoreValue> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string') {
      fields[k] = { stringValue: v };
    } else if (typeof v === 'boolean') {
      fields[k] = { booleanValue: v };
    } else if (typeof v === 'number') {
      fields[k] = Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
    }
  }
  return fields;
}

async function syncFirestoreDoc(
  docPath: string,
  idToken: string,
  payload: Record<string, string | number | boolean>
): Promise<void> {
  if (!FIREBASE_PROJECT_ID || !idToken) return;
  try {
    const url = `${getFirestoreRestBase()}/${docPath}`;
    await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ fields: toFirestoreFields(payload) }),
    });
  } catch {
    // Falha silenciosa de rede — fallback local já gravado
  }
}

const aiRateBuckets = new Map<string, number[]>();
function checkAiRateLimit(uid: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxPerMinute = 15;
  const timestamps = (aiRateBuckets.get(uid) ?? []).filter((ts) => now - ts < windowMs);
  if (timestamps.length >= maxPerMinute) {
    aiRateBuckets.set(uid, timestamps);
    return false;
  }
  timestamps.push(now);
  aiRateBuckets.set(uid, timestamps);
  return true;
}

const ResponderSchema = z.object({
  questaoId: z.string().min(1).max(128),
  alternativaEscolhida: z.enum(['A', 'B', 'C', 'D', 'E']),
  tempoSeg: z.number().min(0).max(36000),
  streakAtual: z.number().int().min(0).max(10000).default(0),
});

const ExplicacaoSchema = z.object({
  questaoId: z.string().min(1).max(128),
  alternativaEscolhida: z.enum(['A', 'B', 'C', 'D', 'E']).optional(),
});

const ReportarSchema = z.object({
  questaoId: z.string().min(1).max(128),
  motivo: z.enum([
    'gabarito_errado',
    'enunciado_incompleto',
    'imagem_quebrada',
    'formula_ilegivel',
    'anulada_oficialmente',
    'outro',
  ]),
  detalhe: z.string().max(1000).optional(),
});

const ExplicacaoAiResponseSchema = z.object({
  resolucao: z.string().min(10),
  porQueErrada: z.record(z.string(), z.string()).default({}),
  macete: z.string().optional(),
});

export interface TreinoRouterDeps {
  generateWithFallback: (options: GenerateFallbackOptions) => Promise<{ text?: string }>;
}

export function createTreinoRouter(deps: TreinoRouterDeps): Router {
  const router = Router();

  // Todas as rotas /api/treino/* exigem token Firebase válido + assinatura ativa
  router.use(
    requireActiveSubscription('Sua assinatura não está ativa. Renove para continuar treinando.')
  );

  // 1. GET /api/treino/questoes — NUNCA retorna correta nem explicacaoCache no modo online
  router.get('/questoes', (req: AuthenticatedRequest, res: Response) => {
    try {
      const uid = req.authUser!.uid;
      const store = getUsuarioStore(uid);
      const banco = loadBancoQuestoes();

      const bancaRaw = String(req.query.banca || 'TODAS').toUpperCase();
      const materiaRaw = String(req.query.materia || 'TODAS');
      const topicoRaw = typeof req.query.topico === 'string' ? req.query.topico : '';
      const difRaw = String(req.query.dificuldade || 'todas').toLowerCase();
      const modoRaw = String(req.query.modo || 'livre').toLowerCase();
      const quantidadeRaw = Number(req.query.quantidade || 10);

      const modoValido =
        modoRaw === 'cronometrado' ||
        modoRaw === 'simulado_express' ||
        modoRaw === 'revisao'
          ? modoRaw
          : 'livre';

      const dificuldadeValida: Dificuldade | 'todas' =
        difRaw === 'facil' || difRaw === 'media' || difRaw === 'dificil' ? difRaw : 'todas';

      const selecionadas = selecionarQuestoesFiltradas(
        banco,
        {
          banca: bancaRaw === 'TODAS' ? 'TODAS' : (bancaRaw as Banca),
          materia: materiaRaw,
          topico: topicoRaw,
          dificuldade: dificuldadeValida,
          quantidade: Number.isFinite(quantidadeRaw) ? quantidadeRaw : 10,
          modo: modoValido,
        },
        store.revisao
      );

      const agoraMs = Date.now();
      const revisoesPendentes = Object.values(store.revisao).filter(
        (item) => new Date(item.proximaRevisaoEm).getTime() <= agoraMs
      ).length;

      return res.json({
        questoes: selecionadas.map(omitirGabaritoParaCliente),
        totalDisponivel: banco.filter((q) => !q.anulada).length,
        revisoesPendentes,
      });
    } catch (err) {
      console.error('[Treino] Erro em GET /questoes:', err);
      return res.status(500).json({ erro: 'Erro ao buscar questões de treino.' });
    }
  });

  // 2. POST /api/treino/responder — corrige no servidor, calcula XP e agenda revisão espaçada
  router.post('/responder', async (req: AuthenticatedRequest, res: Response) => {
    try {
      const parsed = ResponderSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ erro: 'Dados de resposta inválidos.' });
      }

      const uid = req.authUser!.uid;
      const idToken = req.authUser!.idToken;
      const { questaoId, alternativaEscolhida, tempoSeg, streakAtual } = parsed.data;

      const banco = loadBancoQuestoes();
      const questao = banco.find((q) => q.id === questaoId);
      if (!questao) {
        return res.status(404).json({ erro: 'Questão não encontrada no banco.' });
      }

      const validLetters = new Set(questao.alternativas.map((a) => a.letra));
      if (!validLetters.has(alternativaEscolhida)) {
        return res.status(400).json({ erro: 'Alternativa não disponível para esta questão.' });
      }

      const resultado = corrigir(questao, alternativaEscolhida);
      const novoStreak = resultado.acertou ? streakAtual + 1 : 0;
      const { xpGanho, bonusStreak } = calcularXP(resultado.acertou, novoStreak);

      const store = getUsuarioStore(uid);
      const itemAnterior = store.revisao[questaoId];
      const itemAtualizado = proximaRevisao(questaoId, itemAnterior, resultado.acertou);

      const tentativa: Tentativa = {
        questaoId,
        banca: questao.banca,
        materia: questao.materia,
        topico: questao.topico,
        alternativaEscolhida,
        correta: resultado.correta,
        acertou: resultado.acertou,
        tempoSeg: Math.round(tempoSeg),
        xpGanho,
        bonusStreak,
        streakApos: novoStreak,
        respondidaEm: new Date().toISOString(),
      };

      store.revisao[questaoId] = itemAtualizado;
      store.tentativas.push(tentativa);
      saveUsuarioStore(uid, store);

      const tentativaId = `tr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      void Promise.all([
        syncFirestoreDoc(`users/${encodeURIComponent(uid)}/tentativas/${tentativaId}`, idToken, {
          userId: uid,
          questaoId,
          banca: questao.banca,
          materia: questao.materia,
          topico: questao.topico,
          alternativaEscolhida,
          correta: resultado.correta,
          acertou: resultado.acertou,
          tempoSeg: Math.round(tempoSeg),
          xpGanho,
          respondidaEm: tentativa.respondidaEm,
        }),
        syncFirestoreDoc(
          `users/${encodeURIComponent(uid)}/revisao/${encodeURIComponent(questaoId)}`,
          idToken,
          {
            userId: uid,
            questaoId,
            passo: itemAtualizado.passo,
            intervaloDias: itemAtualizado.intervaloDias,
            acertosSeguidos: itemAtualizado.acertosSeguidos,
            totalTentativas: itemAtualizado.totalTentativas,
            totalAcertos: itemAtualizado.totalAcertos,
            ultimaRespostaEm: itemAtualizado.ultimaRespostaEm,
            proximaRevisaoEm: itemAtualizado.proximaRevisaoEm,
          }
        ),
      ]);

      return res.json({
        acertou: resultado.acertou,
        correta: resultado.correta,
        xpGanho,
        bonusStreak,
        novoStreak,
        proximaRevisao: itemAtualizado,
        explicacaoDisponivel: Boolean(questao.explicacaoCache),
      });
    } catch (err) {
      console.error('[Treino] Erro em POST /responder:', err);
      return res.status(500).json({ erro: 'Erro ao registrar resposta.' });
    }
  });

  // 3. POST /api/treino/explicacao — usa cache primeiro; senão gera com Gemini sem contradizer gabarito
  router.post('/explicacao', async (req: AuthenticatedRequest, res: Response) => {
    try {
      const parsed = ExplicacaoSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ erro: 'Requisição de explicação inválida.' });
      }

      const uid = req.authUser!.uid;
      const { questaoId, alternativaEscolhida } = parsed.data;
      const banco = loadBancoQuestoes();
      const questao = banco.find((q) => q.id === questaoId);
      if (!questao) {
        return res.status(404).json({ erro: 'Questão não encontrada.' });
      }

      if (questao.explicacaoCache?.resolucao) {
        return res.json({
          origem: 'cache',
          explicacao: questao.explicacaoCache,
        });
      }

      if (!checkAiRateLimit(uid)) {
        return res.status(429).json({
          erro: 'Muitas solicitações de explicação em sequência. Aguarde alguns segundos.',
        });
      }

      const alternativasTexto = questao.alternativas
        .map((a) => `${a.letra}) ${a.texto}`)
        .join('\n');

      const prompt = `Você é professor especialista em vestibulares brasileiros (ENEM, FUVEST, UNICAMP, UNESP, ITA, UERJ).
Explique de forma clara, didática e rigorosa a questão abaixo.

REGRA CRÍTICA INVIOLÁVEL:
- O gabarito oficial confirmado é a letra **${questao.correta}**.
- NUNCA contradiga o gabarito oficial nem diga que outra alternativa é correta.
- Use fórmulas em LaTeX com $...$ ou $$...$$ apenas quando houver notação matemática/química/física.

Banca/Ano: ${questao.banca} ${questao.ano}
Matéria: ${questao.materia} · ${questao.topico}
${questao.textoBase ? `Texto-base:\n${questao.textoBase}\n` : ''}
Enunciado:
${questao.enunciado}

Alternativas:
${alternativasTexto}

Gabarito oficial: ${questao.correta}
${alternativaEscolhida ? `Alternativa marcada pelo aluno: ${alternativaEscolhida}` : ''}

Retorne JSON estritamente neste formato:
{
  "resolucao": "Explicação passo a passo objetiva chegando na alternativa ${questao.correta}.",
  "porQueErrada": {
    "A": "motivo curto se não for a correta",
    ...
  },
  "macete": "dica prática ou atalho mental de até 2 linhas"
}`;

      try {
        const aiRes = await deps.generateWithFallback({
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                resolucao: { type: Type.STRING },
                porQueErrada: { type: Type.OBJECT },
                macete: { type: Type.STRING },
              },
              required: ['resolucao', 'porQueErrada'],
            },
          },
        });

        const rawJson = aiRes.text ? JSON.parse(aiRes.text) : null;
        const validated = ExplicacaoAiResponseSchema.safeParse(rawJson);

        if (!validated.success) {
          throw new Error('Formato inesperado da IA.');
        }

        const limpaErradas: Partial<Record<Letra, string>> = {};
        for (const alt of questao.alternativas) {
          if (alt.letra !== questao.correta) {
            const msg = validated.data.porQueErrada[alt.letra];
            if (typeof msg === 'string' && msg.trim().length > 0) {
              limpaErradas[alt.letra] = msg.trim();
            }
          }
        }

        const explicacao: ExplicacaoCache = {
          resolucao: validated.data.resolucao.trim(),
          porQueErrada: limpaErradas,
          macete: validated.data.macete?.trim(),
        };

        saveExplicacaoCacheItem(questao.id, explicacao);

        return res.json({
          origem: 'ia',
          explicacao,
        });
      } catch (aiErr) {
        console.warn('[Treino] Fallback em /explicacao:', aiErr);
        return res.status(200).json({
          origem: 'fallback',
          erro: 'A explicação detalhada não carregou agora. Toque em Pergunte ao VestBot para tirar a dúvida.',
        });
      }
    } catch (err) {
      console.error('[Treino] Erro em POST /explicacao:', err);
      return res.status(500).json({ erro: 'Erro ao gerar explicação da questão.' });
    }
  });

  // 4. GET /api/treino/revisao — itens vencidos (sem gabarito!)
  router.get('/revisao', (req: AuthenticatedRequest, res: Response) => {
    try {
      const uid = req.authUser!.uid;
      const store = getUsuarioStore(uid);
      const banco = loadBancoQuestoes();
      const mapBanco = new Map(banco.map((q) => [q.id, q]));

      const agoraMs = Date.now();
      const hojePrefix = new Date().toISOString().slice(0, 10);

      const pendentes = Object.values(store.revisao)
        .filter((rev) => new Date(rev.proximaRevisaoEm).getTime() <= agoraMs)
        .sort(
          (a, b) =>
            new Date(a.proximaRevisaoEm).getTime() - new Date(b.proximaRevisaoEm).getTime()
        )
        .map((rev) => {
          const q = mapBanco.get(rev.questaoId);
          if (!q || q.anulada) return null;
          return {
            questao: omitirGabaritoParaCliente(q),
            revisao: rev,
          };
        })
        .filter((item): item is { questao: ReturnType<typeof omitirGabaritoParaCliente>; revisao: ItemRevisao } => item !== null);

      const hojeRespondidas = store.tentativas.filter((t) =>
        t.respondidaEm.startsWith(hojePrefix)
      ).length;

      return res.json({
        pendentes,
        totalPendentes: pendentes.length,
        estatisticas: {
          totalRevisadas: Object.keys(store.revisao).length,
          hojeRespondidas,
        },
      });
    } catch (err) {
      console.error('[Treino] Erro em GET /revisao:', err);
      return res.status(500).json({ erro: 'Erro ao carregar revisões pendentes.' });
    }
  });

  // 5. POST /api/treino/reportar — envia reporte de problema em questão
  router.post('/reportar', async (req: AuthenticatedRequest, res: Response) => {
    try {
      const parsed = ReportarSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ erro: 'Dados do reporte inválidos.' });
      }

      const uid = req.authUser!.uid;
      const idToken = req.authUser!.idToken;
      const protocolo = `rep_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const criadoEm = new Date().toISOString();

      const lista = readJsonSafe<Array<Record<string, unknown>>>(REPORTES_PATH, []);
      lista.push({
        id: protocolo,
        userId: uid,
        questaoId: parsed.data.questaoId,
        motivo: parsed.data.motivo,
        detalhe: parsed.data.detalhe ?? '',
        status: 'aberto',
        criadoEm,
      });
      writeJsonSafe(REPORTES_PATH, lista);

      void syncFirestoreDoc(`reportes_questoes/${protocolo}`, idToken, {
        id: protocolo,
        userId: uid,
        questaoId: parsed.data.questaoId,
        motivo: parsed.data.motivo,
        detalhe: parsed.data.detalhe ?? '',
        status: 'aberto',
        criadoEm,
      });

      return res.json({ sucesso: true, protocolo });
    } catch (err) {
      console.error('[Treino] Erro em POST /reportar:', err);
      return res.status(500).json({ erro: 'Erro ao registrar reporte da questão.' });
    }
  });

  // 6. GET /api/treino/pacote-offline — baixa pacote de até 30 questões COM gabarito para modo offline
  router.get('/pacote-offline', (_req: AuthenticatedRequest, res: Response) => {
    try {
      const banco = loadBancoQuestoes();
      const pacote = selecionarQuestoesFiltradas(banco, {
        banca: 'TODAS',
        materia: 'TODAS',
        dificuldade: 'todas',
        quantidade: 30,
        modo: 'simulado_express',
      });

      return res.json({
        questoes: pacote,
        geradoEm: new Date().toISOString(),
        total: pacote.length,
      });
    } catch (err) {
      console.error('[Treino] Erro em GET /pacote-offline:', err);
      return res.status(500).json({ erro: 'Erro ao preparar pacote offline.' });
    }
  });

  return router;
}
