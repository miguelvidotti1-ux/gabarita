import { Router, Request, Response, RequestHandler } from 'express';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import {
  AuthenticatedRequest,
  authenticateFirebaseUser,
  requireActiveSubscription,
} from '../authMiddleware';
import {
  CursoSisu,
  EDICOES_VALIDAS,
  ModalidadeCodigo,
} from '../../shared/sisuTypes';
import {
  formatarNotaBR,
  gerarAnaliseLocalSisu,
  simularCurso,
} from '../../shared/sisuEngine';
import sampleCoursesRaw from '../../src/data/sisu/cursos.sample.json';

const IMPORTED_COURSES_PATH = path.resolve(process.cwd(), 'data', 'sisu_cursos_importados.json');

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function loadCoursesCatalog(): { cursos: CursoSisu[]; fonteDados: 'ilustrativo' | 'oficial' } {
  const sample = sampleCoursesRaw as CursoSisu[];
  try {
    if (fs.existsSync(IMPORTED_COURSES_PATH)) {
      const raw = JSON.parse(fs.readFileSync(IMPORTED_COURSES_PATH, 'utf-8'));
      if (Array.isArray(raw) && raw.length > 0) {
        const mergedMap = new Map<string, CursoSisu>();
        for (const c of sample) mergedMap.set(c.id, c);
        for (const c of raw as CursoSisu[]) mergedMap.set(c.id, c);
        return {
          cursos: Array.from(mergedMap.values()),
          fonteDados: 'oficial',
        };
      }
    }
  } catch (err) {
    console.warn('[Sisu] Erro ao ler cursos importados:', err);
  }
  return { cursos: sample, fonteDados: 'ilustrativo' };
}

const MODALIDADES_ZOD = z.enum([
  'AC',
  'LB_PPI',
  'LB_Q',
  'LB_PCD',
  'LB_EP',
  'LI_PPI',
  'LI_Q',
  'LI_PCD',
  'LI_EP',
  'AA_IES',
]);

const NotasSchema = z.object({
  LC: z.number().min(0).max(1000),
  CH: z.number().min(0).max(1000),
  CN: z.number().min(0).max(1000),
  MT: z.number().min(0).max(1000),
  RED: z.number().min(0).max(1000),
});

const EdicaoSchema = z.object({
  edicao: z.number().int().min(2009).max(2100),
  notas: NotasSchema,
  treineiro: z.boolean().default(false),
});

const SimularBodySchema = z.object({
  edicoes: z.array(EdicaoSchema).min(1).max(10),
  curso1Id: z.string().min(1).max(128),
  curso2Id: z.string().min(1).max(128).optional(),
  modalidade: MODALIDADES_ZOD.default('AC'),
  cumpreBonus: z.boolean().default(false),
});

const AnaliseBodySchema = z.object({
  edicoes: z.array(EdicaoSchema).min(1).max(10),
  cursoId: z.string().min(1).max(128),
  modalidade: MODALIDADES_ZOD.default('AC'),
  cumpreBonus: z.boolean().default(false),
  perguntaUsuario: z.string().max(400).optional(),
});

const CursoImportSchema = z.object({
  id: z.string().min(2).max(128),
  ies: z.string().min(2).max(200),
  iesSigla: z.string().min(2).max(32),
  curso: z.string().min(2).max(180),
  campus: z.string().min(1).max(160).default('Campus Central'),
  cidade: z.string().min(1).max(120),
  uf: z.string().length(2),
  grau: z.enum(['Bacharelado', 'Licenciatura', 'Tecnológico']).default('Bacharelado'),
  turno: z.enum(['Integral', 'Matutino', 'Vespertino', 'Noturno', 'EAD']).default('Integral'),
  pesos: z.object({
    LC: z.number().min(0).max(20),
    CH: z.number().min(0).max(20),
    CN: z.number().min(0).max(20),
    MT: z.number().min(0).max(20),
    RED: z.number().min(0).max(20),
  }),
  notasMinimasPorArea: z
    .object({
      LC: z.number().min(0).max(1000).optional(),
      CH: z.number().min(0).max(1000).optional(),
      CN: z.number().min(0).max(1000).optional(),
      MT: z.number().min(0).max(1000).optional(),
      RED: z.number().min(0).max(1000).optional(),
    })
    .optional(),
  mediaMinima: z.number().min(0).max(1000).optional(),
  bonusPercentual: z.number().min(0).max(50).optional(),
  bonusDescricao: z.string().max(400).optional(),
  vagasPorModalidade: z.record(z.string(), z.number().int().min(0)).default({ AC: 20 }),
  cortesHistoricos: z
    .array(
      z.object({
        ano: z.number().int().min(2015).max(2035),
        fonte: z.string().max(200).optional(),
        modalidades: z.record(z.string(), z.number().min(0).max(1000)),
      })
    )
    .default([]),
  fonte: z.string().min(2).max(200).default('Importação Oficial MEC / IES'),
});

function parseCsvCourses(csvText: string): CursoSisu[] {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];

  const delimiter = lines[0].includes(';') ? ';' : ',';
  const headers = lines[0].split(delimiter).map((h) => h.trim().toLowerCase());
  const idx = (name: string) => headers.indexOf(name.toLowerCase());

  const num = (cols: string[], name: string, fallback = 0) => {
    const i = idx(name);
    if (i < 0 || !cols[i]) return fallback;
    const parsed = Number(cols[i].replace(',', '.'));
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const str = (cols: string[], name: string, fallback = '') => {
    const i = idx(name);
    return i >= 0 && cols[i] ? cols[i].trim() : fallback;
  };

  const out: CursoSisu[] = [];
  for (let r = 1; r < lines.length; r++) {
    const cols = lines[r].split(delimiter).map((c) => c.trim());
    const ies = str(cols, 'ies');
    const curso = str(cols, 'curso');
    if (!ies || !curso) continue;

    const uf = str(cols, 'uf', 'SP').toUpperCase().slice(0, 2);
    const id =
      str(cols, 'id') ||
      `${normalizeText(ies).replace(/[^a-z0-9]+/g, '-')}-${normalizeText(curso).replace(/[^a-z0-9]+/g, '-')}-${uf.toLowerCase()}-${r}`;

    const anoCorte = num(cols, 'ano_corte', 2025);
    const corteAC = num(cols, 'corte_ac', 0);
    const corteLB_PPI = num(cols, 'corte_lb_ppi', 0);
    const corteLB_EP = num(cols, 'corte_lb_ep', 0);
    const corteLI_PPI = num(cols, 'corte_li_ppi', 0);
    const corteLI_EP = num(cols, 'corte_li_ep', 0);

    const modalidades: Partial<Record<ModalidadeCodigo, number>> = {};
    if (corteAC > 0) modalidades.AC = corteAC;
    if (corteLB_PPI > 0) modalidades.LB_PPI = corteLB_PPI;
    if (corteLB_EP > 0) modalidades.LB_EP = corteLB_EP;
    if (corteLI_PPI > 0) modalidades.LI_PPI = corteLI_PPI;
    if (corteLI_EP > 0) modalidades.LI_EP = corteLI_EP;

    out.push({
      id,
      ies,
      iesSigla: str(cols, 'ies_sigla', ies.slice(0, 8).toUpperCase()),
      curso,
      campus: str(cols, 'campus', 'Campus Principal'),
      cidade: str(cols, 'cidade', 'Capital'),
      uf,
      grau: (str(cols, 'grau', 'Bacharelado') as CursoSisu['grau']),
      turno: (str(cols, 'turno', 'Integral') as CursoSisu['turno']),
      pesos: {
        LC: num(cols, 'peso_lc', 1),
        CH: num(cols, 'peso_ch', 1),
        CN: num(cols, 'peso_cn', 1),
        MT: num(cols, 'peso_mt', 1),
        RED: num(cols, 'peso_red', 1),
      },
      mediaMinima: num(cols, 'media_minima', 0) || undefined,
      bonusPercentual: num(cols, 'bonus_percentual', 0) || undefined,
      vagasPorModalidade: {
        AC: Math.round(num(cols, 'vagas_ac', 20)),
        LB_PPI: Math.round(num(cols, 'vagas_lb_ppi', 5)),
        LB_EP: Math.round(num(cols, 'vagas_lb_ep', 5)),
        LI_PPI: Math.round(num(cols, 'vagas_li_ppi', 5)),
        LI_EP: Math.round(num(cols, 'vagas_li_ep', 5)),
      },
      cortesHistoricos: Object.keys(modalidades).length > 0
        ? [{ ano: anoCorte, fonte: str(cols, 'fonte', 'Edital Oficial IES'), modalidades }]
        : [],
      ilustrativo: false,
      fonte: str(cols, 'fonte', 'Planilha oficial importada via Admin Gabarita'),
    });
  }
  return out;
}

// Rate limit simples para a rota de análise com IA: 12 chamadas por 10 min por usuário
const aiRateMap = new Map<string, number[]>();
function checkAiRateLimit(key: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const recent = (aiRateMap.get(key) || []).filter((ts) => now - ts < windowMs);
  if (recent.length >= 12) {
    aiRateMap.set(key, recent);
    return false;
  }
  recent.push(now);
  aiRateMap.set(key, recent);
  return true;
}

export function createSisuRouter(deps: {
  generateWithFallback: (options: {
    contents: unknown;
    config?: Record<string, unknown>;
    candidateModels?: string[];
  }) => Promise<{ text?: string }>;
  uploadMiddleware: RequestHandler;
}): Router {
  const router = Router();

  const requireSubscription = requireActiveSubscription(
    'Sua assinatura não está ativa. Renove para continuar usando o Simulador Sisu.'
  );

  // GET /api/sisu/cursos
  router.get('/cursos', requireSubscription, (req: Request, res: Response) => {
    const { cursos, fonteDados } = loadCoursesCatalog();
    const q = typeof req.query.q === 'string' ? normalizeText(req.query.q) : '';
    const uf = typeof req.query.uf === 'string' ? req.query.uf.trim().toUpperCase() : '';
    const turno = typeof req.query.turno === 'string' ? req.query.turno.trim() : '';
    const grau = typeof req.query.grau === 'string' ? req.query.grau.trim() : '';
    const modalidade = typeof req.query.modalidade === 'string' ? (req.query.modalidade.trim() as ModalidadeCodigo) : undefined;
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
    const offset = Math.max(0, Number(req.query.offset) || 0);

    const filtrados = cursos.filter((c) => {
      if (uf && c.uf.toUpperCase() !== uf) return false;
      if (turno && c.turno.toLowerCase() !== turno.toLowerCase()) return false;
      if (grau && c.grau.toLowerCase() !== grau.toLowerCase()) return false;
      if (modalidade && !c.vagasPorModalidade[modalidade] && !c.cortesHistoricos.some((h) => h.modalidades[modalidade])) {
        return false;
      }
      if (q) {
        const hay = normalizeText(`${c.curso} ${c.ies} ${c.iesSigla} ${c.cidade} ${c.uf} ${c.campus}`);
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const paginados = filtrados.slice(offset, offset + limit);
    return res.json({
      total: filtrados.length,
      fonteDados,
      cursos: paginados,
    });
  });

  // GET /api/sisu/cursos/:id
  router.get('/cursos/:id', requireSubscription, (req: Request, res: Response) => {
    const { cursos } = loadCoursesCatalog();
    const curso = cursos.find((c) => c.id === req.params.id);
    if (!curso) {
      return res.status(404).json({ erro: 'Curso não encontrado.' });
    }
    return res.json({ curso });
  });

  // POST /api/sisu/simular
  router.post('/simular', requireSubscription, (req: Request, res: Response) => {
    const parsed = SimularBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        erro: 'Dados de simulação inválidos.',
        detalhes: parsed.error.flatten(),
      });
    }

    const { cursos } = loadCoursesCatalog();
    const { edicoes, curso1Id, curso2Id, modalidade, cumpreBonus } = parsed.data;

    const curso1 = cursos.find((c) => c.id === curso1Id);
    if (!curso1) {
      return res.status(404).json({ erro: 'Curso da 1ª opção não encontrado.' });
    }

    const opcao1 = simularCurso(edicoes, curso1, modalidade, cumpreBonus, EDICOES_VALIDAS);
    let opcao2 = null;
    if (curso2Id) {
      const curso2 = cursos.find((c) => c.id === curso2Id);
      if (curso2) {
        opcao2 = simularCurso(edicoes, curso2, modalidade, cumpreBonus, EDICOES_VALIDAS);
      }
    }

    return res.json({ opcao1, opcao2 });
  });

  // POST /api/sisu/analise
  router.post('/analise', requireSubscription, async (req: Request, res: Response) => {
    const parsed = AnaliseBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        erro: 'Dados inválidos para análise.',
        detalhes: parsed.error.flatten(),
      });
    }

    const user = (req as AuthenticatedRequest).authUser;
    const rateKey = user?.uid || req.ip || 'anon';
    if (!checkAiRateLimit(rateKey)) {
      return res.status(429).json({
        erro: 'Muitas solicitações de análise em sequência. Aguarde alguns minutos.',
      });
    }

    const { cursos } = loadCoursesCatalog();
    const { edicoes, cursoId, modalidade, cumpreBonus, perguntaUsuario } = parsed.data;
    const curso = cursos.find((c) => c.id === cursoId);
    if (!curso) {
      return res.status(404).json({ erro: 'Curso não encontrado.' });
    }

    const simulacao = simularCurso(edicoes, curso, modalidade, cumpreBonus, EDICOES_VALIDAS);
    const localFallback = gerarAnaliseLocalSisu(simulacao);

    const promptSistema = `Você é um orientador pedagógico especialista no Sisu e no Enem no aplicativo Gabarita.
REGRAS OBRIGATÓRIAS:
1. Seja encorajador, honesto e objetivo em português do Brasil. NUNCA prometa aprovação nem garanta que a nota vai bastar.
2. Explique a situação do estudante em 3 frases simples (nota ponderada, melhor edição selecionada e posição diante do corte de ${curso.ilustrativo ? 'dados ilustrativos de referência' : curso.fonte}).
3. Destaque a área/tópico de maior peso onde ele ganha mais pontos por hora estudada considerando os pesos reais do curso.
4. Monte um plano de estudo objetivo para as próximas 4 semanas (Semana 1 a Semana 4, bullets curtos).
5. Inclua uma sugestão estratégica prática de 2ª opção caso a 1ª opção esteja competitiva ou abaixo do corte.`;

    const resumoDados = {
      curso: `${curso.curso} — ${curso.iesSigla} (${curso.cidade}/${curso.uf}, ${curso.turno})`,
      pesos: curso.pesos,
      ilustrativo: curso.ilustrativo,
      fonte: curso.fonte,
      melhorEdicao: simulacao.melhorEdicao?.edicao || null,
      notaPonderada: simulacao.notaFinal !== null ? formatarNotaBR(simulacao.notaFinal) : null,
      elegivel: simulacao.elegivel,
      motivosInelegibilidade: simulacao.motivosInelegibilidade,
      chanceAC: simulacao.resultadoAC.chanceUltimoCorte.label,
      ultimoCorteAC: simulacao.resultadoAC.projecao.ultimoCorte,
      anoUltimoCorteAC: simulacao.resultadoAC.projecao.ultimoAno,
      modalidadeUsuario: modalidade,
      chanceCota: simulacao.resultadoCota?.chanceUltimoCorte.label || null,
      ultimoCorteCota: simulacao.resultadoCota?.projecao.ultimoCorte || null,
      melhorAreaParaSubir: simulacao.resultadoAC.quantoFaltaUltimoCorte?.melhorArea || null,
      perguntaAdicional: perguntaUsuario || null,
    };

    try {
      const response = await deps.generateWithFallback({
        contents: `${promptSistema}\n\nDADOS DA SIMULAÇÃO DO CANDIDATO:\n${JSON.stringify(resumoDados, null, 2)}`,
      });
      const texto = response?.text?.trim();
      if (texto) {
        return res.json({ analise: texto, origem: 'ia' });
      }
    } catch (err) {
      console.warn('[Sisu AI] Fallback para análise determinística local:', err);
    }

    return res.json({ analise: localFallback, origem: 'local_fallback' });
  });

  // POST /api/sisu/importar (Somente Admin)
  router.post(
    '/importar',
    deps.uploadMiddleware,
    async (req: Request, res: Response) => {
      const user = await authenticateFirebaseUser(req);
      if (!user) {
        return res.status(401).json({ erro: 'Autenticação necessária.' });
      }
      if (user.role !== 'admin') {
        return res.status(403).json({ erro: 'Acesso restrito a administradores.' });
      }

      let cursosImportar: CursoSisu[] = [];

      if (req.file && req.file.buffer) {
        const text = req.file.buffer.toString('utf-8');
        const trimmed = text.trim();
        if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
          const parsedJson = JSON.parse(trimmed);
          const arr = Array.isArray(parsedJson) ? parsedJson : parsedJson.cursos || [];
          const valid = z.array(CursoImportSchema).safeParse(arr);
          if (!valid.success) {
            return res.status(400).json({ erro: 'JSON de cursos inválido.', detalhes: valid.error.flatten() });
          }
          cursosImportar = valid.data.map((c) => ({
            ...c,
            vagasPorModalidade: c.vagasPorModalidade as CursoSisu['vagasPorModalidade'],
            cortesHistoricos: c.cortesHistoricos as CursoSisu['cortesHistoricos'],
            ilustrativo: false,
          }));
        } else {
          cursosImportar = parseCsvCourses(text);
        }
      } else if (Array.isArray(req.body?.cursos)) {
        const valid = z.array(CursoImportSchema).safeParse(req.body.cursos);
        if (!valid.success) {
          return res.status(400).json({ erro: 'Lista de cursos inválida.', detalhes: valid.error.flatten() });
        }
        cursosImportar = valid.data.map((c) => ({
          ...c,
          vagasPorModalidade: c.vagasPorModalidade as CursoSisu['vagasPorModalidade'],
          cortesHistoricos: c.cortesHistoricos as CursoSisu['cortesHistoricos'],
          ilustrativo: false,
        }));
      } else {
        return res.status(400).json({ erro: 'Envie um arquivo CSV/JSON ou o array "cursos" no corpo.' });
      }

      if (cursosImportar.length === 0) {
        return res.status(400).json({ erro: 'Nenhum curso válido encontrado na importação.' });
      }

      fs.mkdirSync(path.dirname(IMPORTED_COURSES_PATH), { recursive: true });
      let existing: CursoSisu[] = [];
      if (fs.existsSync(IMPORTED_COURSES_PATH)) {
        try {
          existing = JSON.parse(fs.readFileSync(IMPORTED_COURSES_PATH, 'utf-8'));
        } catch {
          existing = [];
        }
      }

      const merged = new Map<string, CursoSisu>();
      for (const c of existing) merged.set(c.id, c);
      for (const c of cursosImportar) merged.set(c.id, { ...c, ilustrativo: false });
      const finalList = Array.from(merged.values());
      fs.writeFileSync(IMPORTED_COURSES_PATH, JSON.stringify(finalList, null, 2), 'utf-8');

      return res.json({
        sucesso: true,
        importados: cursosImportar.length,
        totalCatalogoImportado: finalList.length,
        mensagem: `${cursosImportar.length} curso(s) importado(s) com selo oficial.`,
      });
    }
  );

  return router;
}
