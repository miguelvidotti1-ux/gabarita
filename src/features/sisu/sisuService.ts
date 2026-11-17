import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { auth, db } from '../../firebase';
import sampleCoursesRaw from '../../data/sisu/cursos.sample.json';
import {
  CursoSisu,
  EDICOES_VALIDAS,
  EdicaoNotasUsuario,
  ModalidadeCodigo,
  NotasEnem,
  PerfilSisuUsuario,
  ResultadoSimulacaoCurso,
  SisuSimulacaoSalva,
} from '../../../shared/sisuTypes';
import {
  formatarNotaBR,
  gerarAnaliseLocalSisu,
  simularCurso,
} from '../../../shared/sisuEngine';
import { PLANOS_CONFIG, PLANOS_IDS_VALIDOS } from '../../../shared/planos';

const SAMPLE_COURSES: CursoSisu[] = sampleCoursesRaw as CursoSisu[];

const CACHE_KEYS = {
  cursos: 'gabarita_sisu_cursos_cache_v1',
  notas: (uid: string) => `gabarita_sisu_notas_${uid}`,
  perfil: (uid: string) => `gabarita_sisu_perfil_${uid}`,
  simulacoes: (uid: string) => `gabarita_sisu_sims_${uid}`,
  favoritos: (uid: string) => `gabarita_sisu_favs_${uid}`,
  cursosDistintos: (uid: string) => `gabarita_sisu_distintos_${uid}`,
  xpPrimeiroUso: (uid: string) => `gabarita_sisu_xp_primeiro_${uid}`,
};

const VALID_PREMIUM_PLANS = new Set<string>(PLANOS_IDS_VALIDOS);

export interface PremiumStatus {
  isPremium: boolean;
  isAdmin: boolean;
  loading: boolean;
  planLabel: string;
}

export interface UserLike {
  uid?: string;
  email?: string | null;
  displayName?: string | null;
  role?: string;
  isPremium?: boolean;
  activePlanId?: string;
  paymentStatus?: string;
  premiumUntil?: string;
}

export function evaluatePremiumFromDoc(
  data: Record<string, unknown> | null | undefined,
  fallbackUser?: UserLike | null
): { isPremium: boolean; isAdmin: boolean; planLabel: string } {
  const email = String(data?.email || fallbackUser?.email || '').toLowerCase();
  const role = String(data?.role || fallbackUser?.role || 'user').toLowerCase();
  const isAdmin = role === 'admin' || email === 'miguelvidotti1@gmail.com';

  const activePlanRaw = String(
    data?.activePlanId ||
      fallbackUser?.activePlanId ||
      localStorage.getItem('vestibularpro_active_plan') ||
      ''
  ).toLowerCase();

  const paymentStatus = String(data?.paymentStatus || fallbackUser?.paymentStatus || '').toLowerCase();
  const premiumUntil = data?.premiumUntil || fallbackUser?.premiumUntil;
  const notExpired =
    !premiumUntil ||
    (typeof premiumUntil === 'string' && new Date(premiumUntil).getTime() > Date.now());

  const isPremium =
    isAdmin ||
    (Boolean(data?.isPremium || fallbackUser?.isPremium) && notExpired) ||
    paymentStatus === 'approved' ||
    (VALID_PREMIUM_PLANS.has(activePlanRaw) && notExpired);

  let planLabel = 'Assinatura Inativa';
  if (isAdmin) {
    planLabel = 'Administrador';
  } else if (activePlanRaw in PLANOS_CONFIG) {
    planLabel = `Plano ${PLANOS_CONFIG[activePlanRaw as keyof typeof PLANOS_CONFIG].nome}`;
  } else if (isPremium) {
    planLabel = 'Assinatura Ativa';
  }

  return { isPremium, isAdmin, planLabel };
}

export function subscribePremiumStatus(
  user: UserLike | null | undefined,
  callback: (status: PremiumStatus) => void
): () => void {
  if (!user?.uid) {
    callback({ isPremium: false, isAdmin: false, loading: false, planLabel: 'Assinatura Inativa' });
    return () => {};
  }

  const initial = evaluatePremiumFromDoc(undefined, user);
  callback({ ...initial, loading: Boolean(auth.currentUser) });

  if (!auth.currentUser) {
    callback({ ...initial, loading: false });
    return () => {};
  }

  const userRef = doc(db, 'users', user.uid);
  const unsub = onSnapshot(
    userRef,
    (snap) => {
      const data = snap.exists() ? (snap.data() as Record<string, unknown>) : undefined;
      const evaluated = evaluatePremiumFromDoc(data, user);
      callback({ ...evaluated, loading: false });
    },
    () => {
      callback({ ...initial, loading: false });
    }
  );

  return unsub;
}

async function getBearerHeaders(): Promise<Record<string, string>> {
  try {
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      if (token) {
        return { Authorization: `Bearer ${token}` };
      }
    }
  } catch {
    // Fallback offline or local session
  }
  return {};
}

function normalizeStr(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function createDefaultEdicoes(): EdicaoNotasUsuario[] {
  return EDICOES_VALIDAS.map((edicao) => ({
    edicao,
    notas: { LC: 0, CH: 0, CN: 0, MT: 0, RED: 0 },
    treineiro: false,
    origem: 'manual',
  }));
}

export function createDefaultPerfil(): PerfilSisuUsuario {
  return {
    questionario: {
      escolaPublicaIntegral: false,
      rendaPerCapitaAte1SM: false,
      ppi: false,
      quilombola: false,
      pcd: false,
      acaoAfirmativaPropria: '',
    },
    modalidadePreferida: 'AC',
    cumpreBonusRegional: false,
  };
}

export function getCachedCursosLocal(): CursoSisu[] {
  try {
    const raw = localStorage.getItem(CACHE_KEYS.cursos);
    if (raw) {
      const parsed = JSON.parse(raw) as CursoSisu[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Ignore parse error
  }
  return SAMPLE_COURSES;
}

export function setCachedCursosLocal(cursos: CursoSisu[]): void {
  try {
    localStorage.setItem(CACHE_KEYS.cursos, JSON.stringify(cursos));
  } catch {
    // Ignore quota errors
  }
}

export interface FiltrosCursosSisu {
  q?: string;
  uf?: string;
  turno?: string;
  grau?: string;
  modalidade?: ModalidadeCodigo | '';
}

export function filterCursosLocally(
  cursos: CursoSisu[],
  filtros: FiltrosCursosSisu
): CursoSisu[] {
  const qNorm = filtros.q ? normalizeStr(filtros.q) : '';
  const ufUpper = filtros.uf ? filtros.uf.trim().toUpperCase() : '';
  const turnoLower = filtros.turno ? filtros.turno.trim().toLowerCase() : '';
  const grauLower = filtros.grau ? filtros.grau.trim().toLowerCase() : '';
  const mod = filtros.modalidade || '';

  return cursos.filter((c) => {
    if (ufUpper && c.uf.toUpperCase() !== ufUpper) return false;
    if (turnoLower && c.turno.toLowerCase() !== turnoLower) return false;
    if (grauLower && c.grau.toLowerCase() !== grauLower) return false;
    if (
      mod &&
      !c.vagasPorModalidade[mod] &&
      !c.cortesHistoricos.some((h) => h.modalidades[mod] !== undefined)
    ) {
      return false;
    }
    if (qNorm) {
      const hay = normalizeStr(`${c.curso} ${c.ies} ${c.iesSigla} ${c.cidade} ${c.uf} ${c.campus}`);
      if (!hay.includes(qNorm)) return false;
    }
    return true;
  });
}

export async function fetchCursosSisu(filtros: FiltrosCursosSisu = {}): Promise<{
  cursos: CursoSisu[];
  fonteDados: 'ilustrativo' | 'oficial';
  offlineFallback: boolean;
}> {
  const params = new URLSearchParams();
  if (filtros.q) params.set('q', filtros.q);
  if (filtros.uf) params.set('uf', filtros.uf);
  if (filtros.turno) params.set('turno', filtros.turno);
  if (filtros.grau) params.set('grau', filtros.grau);
  if (filtros.modalidade) params.set('modalidade', filtros.modalidade);
  params.set('limit', '100');

  try {
    const headers = await getBearerHeaders();
    if (headers.Authorization && navigator.onLine) {
      const resp = await fetch(`/api/sisu/cursos?${params.toString()}`, { headers });
      if (resp.ok) {
        const data = (await resp.json()) as {
          cursos: CursoSisu[];
          fonteDados: 'ilustrativo' | 'oficial';
        };
        if (Array.isArray(data.cursos)) {
          if (!filtros.q && !filtros.uf && !filtros.turno && !filtros.grau && !filtros.modalidade) {
            setCachedCursosLocal(data.cursos);
          }
          return {
            cursos: data.cursos,
            fonteDados: data.fonteDados,
            offlineFallback: false,
          };
        }
      }
    }
  } catch {
    // Fallback offline below
  }

  const cached = getCachedCursosLocal();
  const filtrados = filterCursosLocally(cached, filtros);
  const temOficial = cached.some((c) => !c.ilustrativo);
  return {
    cursos: filtrados,
    fonteDados: temOficial ? 'oficial' : 'ilustrativo',
    offlineFallback: true,
  };
}

export async function loadNotasUsuario(uid: string): Promise<EdicaoNotasUsuario[]> {
  const base = createDefaultEdicoes();
  try {
    const raw = localStorage.getItem(CACHE_KEYS.notas(uid));
    if (raw) {
      const parsed = JSON.parse(raw) as EdicaoNotasUsuario[];
      for (const item of parsed) {
        const idx = base.findIndex((b) => b.edicao === item.edicao);
        if (idx !== -1) base[idx] = { ...base[idx], ...item };
      }
    }
  } catch {
    // ignore
  }

  if (!auth.currentUser || !navigator.onLine) {
    return base;
  }

  try {
    const snap = await getDocs(collection(db, 'users', uid, 'sisu_notas'));
    if (!snap.empty) {
      snap.forEach((docSnap) => {
        const data = docSnap.data() as Partial<EdicaoNotasUsuario>;
        const edicaoNum = Number(data.edicao || docSnap.id);
        const idx = base.findIndex((b) => b.edicao === edicaoNum);
        if (idx !== -1 && data.notas) {
          base[idx] = {
            edicao: edicaoNum,
            notas: {
              LC: Number(data.notas.LC) || 0,
              CH: Number(data.notas.CH) || 0,
              CN: Number(data.notas.CN) || 0,
              MT: Number(data.notas.MT) || 0,
              RED: Number(data.notas.RED) || 0,
            },
            treineiro: Boolean(data.treineiro),
            origem: data.origem || 'manual',
            atualizadoEm: data.atualizadoEm,
          };
        }
      });
      localStorage.setItem(CACHE_KEYS.notas(uid), JSON.stringify(base));
    }
  } catch (err) {
    console.warn('[Sisu] Usando notas em cache local:', err);
  }

  return base;
}

export async function saveNotasEdicao(
  uid: string,
  edicaoData: EdicaoNotasUsuario,
  allEdicoes: EdicaoNotasUsuario[]
): Promise<void> {
  const updatedList = allEdicoes.map((e) =>
    e.edicao === edicaoData.edicao ? { ...edicaoData, atualizadoEm: new Date().toISOString() } : e
  );
  try {
    localStorage.setItem(CACHE_KEYS.notas(uid), JSON.stringify(updatedList));
  } catch {
    // ignore
  }

  if (auth.currentUser && navigator.onLine) {
    try {
      await setDoc(doc(db, 'users', uid, 'sisu_notas', String(edicaoData.edicao)), {
        ...edicaoData,
        userId: uid,
        atualizadoEm: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('[Sisu] Erro ao sincronizar notas no Firestore:', err);
    }
  }
}

export async function loadPerfilSisu(uid: string): Promise<PerfilSisuUsuario> {
  let perfil = createDefaultPerfil();
  try {
    const raw = localStorage.getItem(CACHE_KEYS.perfil(uid));
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PerfilSisuUsuario>;
      perfil = {
        ...perfil,
        ...parsed,
        questionario: { ...perfil.questionario, ...(parsed.questionario || {}) },
      };
    }
  } catch {
    // ignore
  }

  if (!auth.currentUser || !navigator.onLine) return perfil;

  try {
    const snap = await getDoc(doc(db, 'users', uid, 'sisu_perfil', 'principal'));
    if (snap.exists()) {
      const data = snap.data() as Partial<PerfilSisuUsuario>;
      perfil = {
        ...perfil,
        ...data,
        questionario: { ...perfil.questionario, ...(data.questionario || {}) },
      };
      localStorage.setItem(CACHE_KEYS.perfil(uid), JSON.stringify(perfil));
    }
  } catch (err) {
    console.warn('[Sisu] Usando perfil em cache:', err);
  }

  return perfil;
}

export async function savePerfilSisu(uid: string, perfil: PerfilSisuUsuario): Promise<void> {
  const payload: PerfilSisuUsuario = {
    ...perfil,
    atualizadoEm: new Date().toISOString(),
  };
  try {
    localStorage.setItem(CACHE_KEYS.perfil(uid), JSON.stringify(payload));
  } catch {
    // ignore
  }

  if (auth.currentUser && navigator.onLine) {
    try {
      await setDoc(doc(db, 'users', uid, 'sisu_perfil', 'principal'), {
        ...payload,
        userId: uid,
      });
    } catch (err) {
      console.warn('[Sisu] Erro ao salvar perfil no Firestore:', err);
    }
  }
}

export async function loadFavoritos(uid: string): Promise<string[]> {
  let favs: string[] = [];
  try {
    const raw = localStorage.getItem(CACHE_KEYS.favoritos(uid));
    if (raw) favs = JSON.parse(raw) as string[];
  } catch {
    // ignore
  }

  if (!auth.currentUser || !navigator.onLine) return favs;

  try {
    const snap = await getDocs(collection(db, 'users', uid, 'sisu_favoritos'));
    if (!snap.empty) {
      favs = snap.docs.map((d) => d.id);
      localStorage.setItem(CACHE_KEYS.favoritos(uid), JSON.stringify(favs));
    }
  } catch {
    // use cached
  }
  return favs;
}

export async function toggleFavorito(
  uid: string,
  curso: CursoSisu,
  currentFavs: string[]
): Promise<string[]> {
  const isFav = currentFavs.includes(curso.id);
  const next = isFav ? currentFavs.filter((id) => id !== curso.id) : [...currentFavs, curso.id];

  try {
    localStorage.setItem(CACHE_KEYS.favoritos(uid), JSON.stringify(next));
  } catch {
    // ignore
  }

  if (auth.currentUser && navigator.onLine) {
    try {
      const ref = doc(db, 'users', uid, 'sisu_favoritos', curso.id);
      if (isFav) {
        await deleteDoc(ref);
      } else {
        await setDoc(ref, {
          cursoId: curso.id,
          cursoNome: curso.curso,
          iesSigla: curso.iesSigla,
          uf: curso.uf,
          adicionadoEm: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn('[Sisu] Erro ao atualizar favorito no Firestore:', err);
    }
  }

  return next;
}

export async function loadSimulacoes(uid: string): Promise<SisuSimulacaoSalva[]> {
  let list: SisuSimulacaoSalva[] = [];
  try {
    const raw = localStorage.getItem(CACHE_KEYS.simulacoes(uid));
    if (raw) list = JSON.parse(raw) as SisuSimulacaoSalva[];
  } catch {
    // ignore
  }

  if (auth.currentUser && navigator.onLine) {
    try {
      const snap = await getDocs(collection(db, 'users', uid, 'sisu_simulacoes'));
      if (!snap.empty) {
        list = snap.docs
          .map((d) => d.data() as SisuSimulacaoSalva)
          .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());
        localStorage.setItem(CACHE_KEYS.simulacoes(uid), JSON.stringify(list.slice(0, 30)));
      }
    } catch {
      // use cached
    }
  }
  return list.sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());
}

export function getDistinctSimulatedCourseIds(uid: string): string[] {
  try {
    const raw = localStorage.getItem(CACHE_KEYS.cursosDistintos(uid));
    if (raw) {
      const parsed = JSON.parse(raw) as string[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}

export async function saveSimulacao(
  uid: string,
  sim1: ResultadoSimulacaoCurso,
  sim2: ResultadoSimulacaoCurso | null,
  modalidade: ModalidadeCodigo,
  cumpreBonus: boolean
): Promise<{
  simulacao: SisuSimulacaoSalva;
  totalCursosDistintos: number;
  primeiraSimulacaoUsuario: boolean;
}> {
  const id = `sim_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const chance1 =
    modalidade !== 'AC' && sim1.resultadoCota
      ? sim1.resultadoCota.chanceUltimoCorte.nivel
      : sim1.resultadoAC.chanceUltimoCorte.nivel;
  const chance2 = sim2
    ? modalidade !== 'AC' && sim2.resultadoCota
      ? sim2.resultadoCota.chanceUltimoCorte.nivel
      : sim2.resultadoAC.chanceUltimoCorte.nivel
    : undefined;

  const registro: SisuSimulacaoSalva = {
    id,
    userId: uid,
    criadoEm: new Date().toISOString(),
    curso1Id: sim1.curso.id,
    curso1Nome: sim1.curso.curso,
    curso1Ies: sim1.curso.iesSigla,
    ...(sim2
      ? {
          curso2Id: sim2.curso.id,
          curso2Nome: sim2.curso.curso,
          curso2Ies: sim2.curso.iesSigla,
          notaFinalOpcao2: sim2.notaFinal,
          chanceOpcao2: chance2,
        }
      : {}),
    modalidade,
    edicaoUsada: sim1.melhorEdicao?.edicao || null,
    notaFinalOpcao1: sim1.notaFinal,
    chanceOpcao1: chance1,
    cumpreBonus,
  };

  let existing = getDistinctSimulatedCourseIds(uid);
  const setDistintos = new Set(existing);
  setDistintos.add(sim1.curso.id);
  if (sim2) setDistintos.add(sim2.curso.id);
  const nextDistintos = Array.from(setDistintos);
  try {
    localStorage.setItem(CACHE_KEYS.cursosDistintos(uid), JSON.stringify(nextDistintos));
  } catch {
    // ignore
  }

  const primeiraSimulacaoUsuario = !localStorage.getItem(CACHE_KEYS.xpPrimeiroUso(uid));
  if (primeiraSimulacaoUsuario) {
    try {
      localStorage.setItem(CACHE_KEYS.xpPrimeiroUso(uid), '1');
    } catch {
      // ignore
    }
  }

  let currentList: SisuSimulacaoSalva[] = [];
  try {
    const raw = localStorage.getItem(CACHE_KEYS.simulacoes(uid));
    if (raw) currentList = JSON.parse(raw) as SisuSimulacaoSalva[];
  } catch {
    currentList = [];
  }
  const updated = [registro, ...currentList].slice(0, 30);
  try {
    localStorage.setItem(CACHE_KEYS.simulacoes(uid), JSON.stringify(updated));
  } catch {
    // ignore
  }

  if (auth.currentUser && navigator.onLine) {
    try {
      await setDoc(doc(db, 'users', uid, 'sisu_simulacoes', id), registro);
    } catch (err) {
      console.warn('[Sisu] Erro ao salvar simulação no Firestore:', err);
    }
  }

  return {
    simulacao: registro,
    totalCursosDistintos: nextDistintos.length,
    primeiraSimulacaoUsuario,
  };
}

export async function estimarNotasDosSimulados(uid: string): Promise<{
  notas: NotasEnem;
  edicaoAlvo: number;
  baseadoEmDadosReais: boolean;
  detalhes: string[];
}> {
  const areaScores: Record<'LC' | 'CH' | 'CN' | 'MT', number[]> = {
    LC: [],
    CH: [],
    CN: [],
    MT: [],
  };
  const redacaoNotas: number[] = [];

  const mapSubjectToArea = (subj: string): 'LC' | 'CH' | 'CN' | 'MT' | null => {
    const n = normalizeStr(subj);
    if (n.includes('portug') || n.includes('ling') || n.includes('literat') || n.includes('ingles') || n.includes('espanhol') || n.includes('artes')) {
      return 'LC';
    }
    if (n.includes('hist') || n.includes('geog') || n.includes('filos') || n.includes('sociol') || n.includes('human')) {
      return 'CH';
    }
    if (n.includes('fisic') || n.includes('quim') || n.includes('biolog') || n.includes('natur')) {
      return 'CN';
    }
    if (n.includes('mat')) {
      return 'MT';
    }
    return null;
  };

  if (auth.currentUser && navigator.onLine) {
    try {
      const perfSnap = await getDocs(collection(db, 'users', uid, 'subject_performance'));
      perfSnap.forEach((d) => {
        const data = d.data() as { subject?: string; percentage?: number };
        if (data.subject && typeof data.percentage === 'number') {
          const area = mapSubjectToArea(data.subject);
          if (area) areaScores[area].push(data.percentage);
        }
      });

      const quizQ = query(collection(db, 'quiz_results'), where('userId', '==', uid));
      const quizSnap = await getDocs(quizQ);
      quizSnap.forEach((d) => {
        const data = d.data() as {
          percentage?: number;
          subjectStats?: Record<string, { total: number; correct: number }>;
        };
        if (data.subjectStats) {
          for (const [subj, stat] of Object.entries(data.subjectStats)) {
            const area = mapSubjectToArea(subj);
            if (area && stat.total > 0) {
              areaScores[area].push((stat.correct / stat.total) * 100);
            }
          }
        } else if (typeof data.percentage === 'number') {
          areaScores.LC.push(data.percentage);
          areaScores.CH.push(data.percentage);
        }
      });

      const essayQ = query(collection(db, 'essays'), where('userId', '==', uid));
      const essaySnap = await getDocs(essayQ);
      essaySnap.forEach((d) => {
        const data = d.data() as { grade?: number; status?: string };
        if (typeof data.grade === 'number' && data.grade > 0) {
          redacaoNotas.push(data.grade);
        }
      });
    } catch (err) {
      console.warn('[Sisu] Falha ao estimar notas do Firestore:', err);
    }
  }

  const detalhes: string[] = [];
  let dadosReaisEncontrados = 0;

  const pctToEnem = (arr: number[], fallback: number, label: string): number => {
    if (arr.length === 0) return fallback;
    dadosReaisEncontrados++;
    const avgPct = arr.reduce((a, b) => a + b, 0) / arr.length;
    const estimado = Math.round((430 + Math.min(100, Math.max(0, avgPct)) * 4.5) * 10) / 10;
    detalhes.push(`${label}: ${Math.round(avgPct)}% de acerto -> ~${formatarNotaBR(estimado)}`);
    return estimado;
  };

  const LC = pctToEnem(areaScores.LC, 620, 'Linguagens');
  const CH = pctToEnem(areaScores.CH, 635, 'Humanas');
  const CN = pctToEnem(areaScores.CN, 610, 'Natureza');
  const MT = pctToEnem(areaScores.MT, 650, 'Matemática');

  let RED = 720;
  if (redacaoNotas.length > 0) {
    dadosReaisEncontrados++;
    RED = Math.round((redacaoNotas.reduce((a, b) => a + b, 0) / redacaoNotas.length) * 10) / 10;
    detalhes.push(`Redação: média de ${redacaoNotas.length} correção(ões) -> ${formatarNotaBR(RED)}`);
  }

  return {
    notas: { LC, CH, CN, MT, RED },
    edicaoAlvo: EDICOES_VALIDAS[EDICOES_VALIDAS.length - 1],
    baseadoEmDadosReais: dadosReaisEncontrados > 0,
    detalhes,
  };
}

export async function solicitarAnaliseIA(params: {
  edicoes: EdicaoNotasUsuario[];
  curso: CursoSisu;
  modalidade: ModalidadeCodigo;
  cumpreBonus: boolean;
  perguntaUsuario?: string;
}): Promise<{ analise: string; origem: 'ia' | 'local_fallback' }> {
  const sim = simularCurso(
    params.edicoes,
    params.curso,
    params.modalidade,
    params.cumpreBonus,
    EDICOES_VALIDAS
  );

  try {
    const headers = await getBearerHeaders();
    if (headers.Authorization && navigator.onLine) {
      const resp = await fetch('/api/sisu/analise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify({
          edicoes: params.edicoes,
          cursoId: params.curso.id,
          modalidade: params.modalidade,
          cumpreBonus: params.cumpreBonus,
          perguntaUsuario: params.perguntaUsuario,
        }),
      });
      if (resp.ok) {
        const data = (await resp.json()) as {
          analise: string;
          origem: 'ia' | 'local_fallback';
        };
        if (data.analise) return data;
      }
    }
  } catch {
    // Fallback local
  }

  return {
    analise: gerarAnaliseLocalSisu(sim),
    origem: 'local_fallback',
  };
}

export async function importarCursosAdmin(
  file: File
): Promise<{ sucesso: boolean; mensagem: string; importados?: number }> {
  const headers = await getBearerHeaders();
  if (!headers.Authorization) {
    throw new Error('Autenticação Firebase necessária para importar planilhas.');
  }

  const formData = new FormData();
  formData.append('arquivo', file);

  const resp = await fetch('/api/sisu/importar', {
    method: 'POST',
    headers,
    body: formData,
  });

  const data = (await resp.json()) as {
    sucesso?: boolean;
    mensagem?: string;
    erro?: string;
    importados?: number;
  };
  if (!resp.ok) {
    throw new Error(data.erro || 'Erro ao importar arquivo de cursos.');
  }

  // Refresh local catalog cache
  const updatedCatalog = await fetchCursosSisu();
  setCachedCursosLocal(updatedCatalog.cursos);

  return {
    sucesso: true,
    mensagem: data.mensagem || 'Catálogo atualizado com sucesso.',
    importados: data.importados,
  };
}

export function exportarSimulacoesCSV(simulacoes: SisuSimulacaoSalva[]): void {
  const header = [
    'Data',
    'Edição Enem Usada',
    'Modalidade',
    '1ª Opção - Curso',
    '1ª Opção - IES',
    '1ª Opção - Nota Ponderada',
    '1ª Opção - Chance',
    '2ª Opção - Curso',
    '2ª Opção - IES',
    '2ª Opção - Nota Ponderada',
    '2ª Opção - Chance',
    'Bônus Regional Aplicado',
  ];

  const rows = simulacoes.map((s) => [
    new Date(s.criadoEm).toLocaleString('pt-BR'),
    s.edicaoUsada ? String(s.edicaoUsada) : 'Sem edição válida',
    s.modalidade,
    s.curso1Nome,
    s.curso1Ies,
    s.notaFinalOpcao1 !== null ? formatarNotaBR(s.notaFinalOpcao1) : '—',
    s.chanceOpcao1,
    s.curso2Nome || '—',
    s.curso2Ies || '—',
    s.notaFinalOpcao2 !== undefined && s.notaFinalOpcao2 !== null
      ? formatarNotaBR(s.notaFinalOpcao2)
      : '—',
    s.chanceOpcao2 || '—',
    s.cumpreBonus ? 'Sim' : 'Não',
  ]);

  const escapeCsv = (val: string) => `"${val.replace(/"/g, '""')}"`;
  const csvContent =
    '\uFEFF' +
    [header, ...rows].map((row) => row.map(escapeCsv).join(';')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `gabarita-simulacoes-sisu-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
