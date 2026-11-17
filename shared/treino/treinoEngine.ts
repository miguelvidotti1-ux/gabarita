import {
  FiltrosTreino,
  INTERVALOS_REVISAO_DIAS,
  ItemRevisao,
  Letra,
  Questao,
  QuestaoCliente,
  ResumoSessao,
  Tentativa,
  XP_ACERTO,
  XP_BONUS_STREAK,
  XP_ERRO,
} from './types';

export function corrigir(
  questao: Pick<Questao, 'correta' | 'anulada'>,
  escolhida: Letra
): { acertou: boolean; correta: Letra } {
  const acertou = questao.anulada ? true : escolhida === questao.correta;
  return {
    acertou,
    correta: questao.correta,
  };
}

export function proximaRevisao(
  questaoId: string,
  itemAtual: ItemRevisao | null | undefined,
  acertou: boolean,
  agora: Date = new Date()
): ItemRevisao {
  const maxIdx = INTERVALOS_REVISAO_DIAS.length - 1;
  let passo = 0;

  if (acertou) {
    if (itemAtual) {
      passo = Math.min(maxIdx, Math.max(0, itemAtual.passo + 1));
    } else {
      passo = 0;
    }
  } else {
    passo = 0;
  }

  const intervaloDias = INTERVALOS_REVISAO_DIAS[passo];
  const proxima = new Date(agora.getTime() + intervaloDias * 24 * 60 * 60 * 1000);

  return {
    questaoId,
    passo,
    intervaloDias,
    acertosSeguidos: acertou ? (itemAtual?.acertosSeguidos ?? 0) + 1 : 0,
    totalTentativas: (itemAtual?.totalTentativas ?? 0) + 1,
    totalAcertos: (itemAtual?.totalAcertos ?? 0) + (acertou ? 1 : 0),
    ultimaRespostaEm: agora.toISOString(),
    proximaRevisaoEm: proxima.toISOString(),
  };
}

export function calcularXP(
  acertou: boolean,
  novoStreak: number
): { xpGanho: number; bonusStreak: boolean } {
  if (!acertou) {
    return { xpGanho: XP_ERRO, bonusStreak: false };
  }
  const bonusStreak = novoStreak > 0 && novoStreak % 5 === 0;
  return {
    xpGanho: XP_ACERTO + (bonusStreak ? XP_BONUS_STREAK : 0),
    bonusStreak,
  };
}

export function resumoSessao(tentativas: Tentativa[]): ResumoSessao {
  const total = tentativas.length;
  let acertos = 0;
  let xpTotal = 0;
  let maiorStreak = 0;
  let tempoTotalSeg = 0;
  const mapaMateria = new Map<string, { total: number; acertos: number }>();
  const errosDetalhados: Tentativa[] = [];

  for (const t of tentativas) {
    if (t.acertou) {
      acertos += 1;
    } else {
      errosDetalhados.push(t);
    }
    xpTotal += t.xpGanho;
    if (t.streakApos > maiorStreak) {
      maiorStreak = t.streakApos;
    }
    tempoTotalSeg += Math.max(0, t.tempoSeg);

    const prev = mapaMateria.get(t.materia) ?? { total: 0, acertos: 0 };
    mapaMateria.set(t.materia, {
      total: prev.total + 1,
      acertos: prev.acertos + (t.acertou ? 1 : 0),
    });
  }

  const erros = total - acertos;
  const pctAcerto = total > 0 ? Math.round((acertos / total) * 100) : 0;
  const tempoMedioSeg = total > 0 ? Math.round(tempoTotalSeg / total) : 0;

  const porMateria = Array.from(mapaMateria.entries())
    .map(([materia, info]) => ({
      materia,
      total: info.total,
      acertos: info.acertos,
      erros: info.total - info.acertos,
      pctAcerto: info.total > 0 ? Math.round((info.acertos / info.total) * 100) : 0,
    }))
    .sort((a, b) => a.materia.localeCompare(b.materia, 'pt-BR'));

  return {
    total,
    acertos,
    erros,
    pctAcerto,
    xpTotal,
    maiorStreak,
    tempoTotalSeg,
    tempoMedioSeg,
    porMateria,
    errosDetalhados,
  };
}

export function omitirGabaritoParaCliente(q: Questao): QuestaoCliente {
  const { correta: _correta, explicacaoCache: _explicacaoCache, ...cliente } = q;
  return {
    ...cliente,
    alternativas: cliente.alternativas.map((alt) => ({ ...alt })),
  };
}

export function normalizarTextoFiltro(val: string): string {
  return val
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function selecionarQuestoesFiltradas(
  banco: Questao[],
  filtros: FiltrosTreino,
  revisaoMap: Record<string, ItemRevisao> = {},
  agora: Date = new Date()
): Questao[] {
  const validas = banco.filter((q) => !q.anulada);

  const filtradasPorCriterio = validas.filter((q) => {
    if (filtros.banca && filtros.banca !== 'TODAS' && q.banca !== filtros.banca) {
      return false;
    }
    if (
      filtros.materia &&
      filtros.materia !== 'TODAS' &&
      normalizarTextoFiltro(q.materia) !== normalizarTextoFiltro(filtros.materia)
    ) {
      return false;
    }
    if (
      filtros.topico &&
      filtros.topico.trim() !== '' &&
      !normalizarTextoFiltro(q.topico).includes(normalizarTextoFiltro(filtros.topico))
    ) {
      return false;
    }
    if (filtros.dificuldade && filtros.dificuldade !== 'todas' && q.dificuldade !== filtros.dificuldade) {
      return false;
    }
    return true;
  });

  const base = filtradasPorCriterio.length > 0 ? filtradasPorCriterio : validas;
  const limite = Math.max(1, Math.min(50, filtros.quantidade || 10));

  if (filtros.modo === 'revisao') {
    const agoraMs = agora.getTime();
    const pendentes = base
      .filter((q) => {
        const rev = revisaoMap[q.id];
        if (!rev) return false;
        return new Date(rev.proximaRevisaoEm).getTime() <= agoraMs;
      })
      .sort((a, b) => {
        const revA = new Date(revisaoMap[a.id].proximaRevisaoEm).getTime();
        const revB = new Date(revisaoMap[b.id].proximaRevisaoEm).getTime();
        return revA - revB;
      });

    if (pendentes.length >= limite) {
      return pendentes.slice(0, limite);
    }

    const usadas = new Set(pendentes.map((q) => q.id));
    const restantes = base.filter((q) => !usadas.has(q.id));
    return [...pendentes, ...restantes].slice(0, limite);
  }

  const trintaDiasAtrasMs = agora.getTime() - 30 * 24 * 60 * 60 * 1000;
  const naoAcertadasRecente = base.filter((q) => {
    const rev = revisaoMap[q.id];
    if (!rev || rev.acertosSeguidos <= 0) return true;
    const ultimaMs = new Date(rev.ultimaRespostaEm).getTime();
    return ultimaMs < trintaDiasAtrasMs;
  });

  const acertadasRecente = base.filter((q) => !naoAcertadasRecente.includes(q));
  const pool =
    naoAcertadasRecente.length >= limite
      ? naoAcertadasRecente
      : [...naoAcertadasRecente, ...acertadasRecente];

  if (filtros.modo === 'simulado_express') {
    const porMateria = new Map<string, Questao[]>();
    for (const q of pool) {
      const lista = porMateria.get(q.materia) ?? [];
      lista.push(q);
      porMateria.set(q.materia, lista);
    }
    const resultado: Questao[] = [];
    const filas = Array.from(porMateria.values());
    let idx = 0;
    while (resultado.length < limite && filas.some((f) => f.length > idx)) {
      for (const fila of filas) {
        if (resultado.length >= limite) break;
        if (fila[idx]) {
          resultado.push(fila[idx]);
        }
      }
      idx += 1;
    }
    return resultado;
  }

  return pool.slice(0, limite);
}
