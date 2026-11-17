import {
  AREAS_ENEM_META,
  AnaliseAreaQuantoFalta,
  AnaliseQuantoFalta,
  AreaEnem,
  CHANCE_THRESHOLDS,
  CenarioCalculadoraReversa,
  ClassificacaoChance,
  CorteHistoricoAnual,
  CursoSisu,
  EDICOES_VALIDAS,
  EdicaoNotasUsuario,
  MODALIDADES_INFO,
  ModalidadeCodigo,
  NotasEnem,
  PesosCurso,
  ProjecaoCorteResultado,
  ResultadoEdicaoAvaliada,
  ResultadoElegibilidade,
  ResultadoSimulacaoCurso,
} from './sisuTypes';

const AREA_KEYS: AreaEnem[] = ['LC', 'CH', 'CN', 'MT', 'RED'];

export function clampNota(valor: number): number {
  if (!Number.isFinite(valor)) return 0;
  return Math.max(0, Math.min(1000, valor));
}

export function formatarNotaBR(valor: number | null | undefined): string {
  if (valor === null || valor === undefined || !Number.isFinite(valor)) return '—';
  return valor.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function parseNotaBR(texto: string): number | null {
  const limpo = texto.trim().replace(/\s+/g, '');
  if (!limpo) return null;
  const normalizado = limpo.includes(',')
    ? limpo.replace(/\./g, '').replace(',', '.')
    : limpo;
  if (!/^-?\d+(\.\d+)?$/.test(normalizado)) return null;
  const num = Number(normalizado);
  if (!Number.isFinite(num) || num < 0 || num > 1000) return null;
  return num;
}

export function somaPesos(pesos: PesosCurso): number {
  return AREA_KEYS.reduce((acc, k) => acc + Math.max(0, pesos[k] || 0), 0);
}

export function mediaSimples(notas: NotasEnem): number {
  return (notas.LC + notas.CH + notas.CN + notas.MT + notas.RED) / 5;
}

/**
 * Calcula média ponderada mantendo precisão total em ponto flutuante.
 * Arredondamento ocorre apenas na exibição (formatarNotaBR).
 */
export function mediaPonderada(
  notas: NotasEnem,
  pesos: PesosCurso,
  bonusPercentual = 0
): { bruta: number; comBonus: number; somaPesos: number } {
  const totalPesos = somaPesos(pesos);
  if (totalPesos <= 0) {
    return { bruta: 0, comBonus: 0, somaPesos: 0 };
  }

  const somaPonderada =
    notas.LC * pesos.LC +
    notas.CH * pesos.CH +
    notas.CN * pesos.CN +
    notas.MT * pesos.MT +
    notas.RED * pesos.RED;

  const bruta = somaPonderada / totalPesos;
  const fatorBonus = bonusPercentual > 0 ? 1 + bonusPercentual / 100 : 1;
  const comBonus = bruta * fatorBonus;

  return { bruta, comBonus, somaPesos: totalPesos };
}

export function verificarElegibilidade(
  notas: NotasEnem,
  curso: CursoSisu,
  cumpreBonus: boolean,
  treineiro = false
): ResultadoElegibilidade {
  const bonusAplicar = cumpreBonus && curso.bonusPercentual ? curso.bonusPercentual : 0;
  const { bruta, comBonus } = mediaPonderada(notas, curso.pesos, bonusAplicar);
  const motivosFalha: string[] = [];
  const areasReprovadas: AreaEnem[] = [];

  if (treineiro) {
    return {
      elegivel: false,
      edicaoValida: false,
      motivosFalha: ['Edição marcada como treineiro não é válida para concorrer no Sisu.'],
      areasReprovadas: [],
      notaBruta: bruta,
      notaComBonus: comBonus,
    };
  }

  if (notas.RED <= 0) {
    areasReprovadas.push('RED');
    return {
      elegivel: false,
      edicaoValida: false,
      motivosFalha: ['Redação igual a 0 invalida esta edição do Enem.'],
      areasReprovadas,
      notaBruta: bruta,
      notaComBonus: comBonus,
    };
  }

  if (curso.notasMinimasPorArea) {
    for (const area of AREA_KEYS) {
      const minima = curso.notasMinimasPorArea[area];
      if (typeof minima === 'number' && minima > 0 && notas[area] < minima) {
        areasReprovadas.push(area);
        motivosFalha.push(
          `${AREAS_ENEM_META[area].nomeCurto}: obteve ${formatarNotaBR(notas[area])}, mínimo exigido é ${formatarNotaBR(minima)}`
        );
      }
    }
  }

  if (typeof curso.mediaMinima === 'number' && curso.mediaMinima > 0 && comBonus < curso.mediaMinima) {
    motivosFalha.push(
      `Média mínima geral: obteve ${formatarNotaBR(comBonus)}, mínimo exigido é ${formatarNotaBR(curso.mediaMinima)}`
    );
  }

  return {
    elegivel: motivosFalha.length === 0,
    edicaoValida: true,
    motivosFalha,
    areasReprovadas,
    notaBruta: bruta,
    notaComBonus: comBonus,
  };
}

/**
 * Avalia todas as edições válidas independentemente (sem nunca misturar áreas entre anos)
 * e escolhe a edição com maior nota ponderada elegível (ou maior entre as válidas se todas falharem nota mínima).
 */
export function melhorEdicao(
  edicoes: EdicaoNotasUsuario[],
  curso: CursoSisu,
  cumpreBonus: boolean,
  edicoesValidas: readonly number[] = EDICOES_VALIDAS
): {
  melhor: ResultadoEdicaoAvaliada | null;
  todasEdicoes: ResultadoEdicaoAvaliada[];
} {
  const validSet = new Set<number>(edicoesValidas);
  const avaliadas: ResultadoEdicaoAvaliada[] = edicoes
    .filter((ed) => validSet.has(ed.edicao))
    .map((ed) => {
      const redacaoZero = ed.notas.RED <= 0;
      const descartada = ed.treineiro || redacaoZero;
      const elegibilidade = verificarElegibilidade(ed.notas, curso, cumpreBonus, ed.treineiro);

      let motivoDescarte: string | undefined;
      if (ed.treineiro) {
        motivoDescarte = 'Edição realizada como treineiro não é válida no Sisu.';
      } else if (redacaoZero) {
        motivoDescarte = 'Nota 0 na Redação invalida esta edição do Enem.';
      }

      return {
        edicao: ed.edicao,
        treineiro: ed.treineiro,
        redacaoZero,
        descartada,
        motivoDescarte,
        elegibilidade,
        notaFinal: elegibilidade.notaComBonus,
      };
    })
    .sort((a, b) => b.edicao - a.edicao);

  const candidatasValidas = avaliadas.filter((item) => !item.descartada);
  if (candidatasValidas.length === 0) {
    return { melhor: null, todasEdicoes: avaliadas };
  }

  const elegiveis = candidatasValidas.filter((item) => item.elegibilidade.elegivel);
  const pool = elegiveis.length > 0 ? elegiveis : candidatasValidas;

  const melhor = pool.reduce((best, curr) => {
    if (curr.notaFinal > best.notaFinal) return curr;
    if (curr.notaFinal === best.notaFinal && curr.edicao > best.edicao) return curr;
    return best;
  });

  return { melhor, todasEdicoes: avaliadas };
}

/**
 * Projeta a nota de corte como ultimoCorte + tendencia,
 * onde tendencia é a média das variações ano a ano limitada a [-30, +30].
 */
export function projetarCorte(
  cortesHistoricos: CorteHistoricoAnual[],
  modalidade: ModalidadeCodigo
): ProjecaoCorteResultado {
  const serie = cortesHistoricos
    .map((c): { ano: number; corte: number; fonte?: string } | null => {
      const valor = c.modalidades[modalidade];
      return typeof valor === 'number' && Number.isFinite(valor)
        ? { ano: c.ano, corte: valor, fonte: c.fonte }
        : null;
    })
    .filter((item): item is { ano: number; corte: number; fonte?: string } => item !== null)
    .sort((a, b) => a.ano - b.ano);

  if (serie.length === 0) {
    return {
      modalidade,
      ultimoAno: null,
      ultimoCorte: null,
      corteProjetado: null,
      deltaAplicado: 0,
      tendencia: 'indisponivel',
      historico: [],
      aviso: `Sem histórico de corte suficiente para ${modalidade}.`,
    };
  }

  const ultimo = serie[serie.length - 1];
  if (serie.length === 1) {
    return {
      modalidade,
      ultimoAno: ultimo.ano,
      ultimoCorte: ultimo.corte,
      corteProjetado: ultimo.corte,
      deltaAplicado: 0,
      tendencia: 'estavel',
      historico: serie,
      aviso: 'Apenas 1 edição no histórico — projeção mantida no último corte conhecido.',
    };
  }

  let somaVariacoes = 0;
  for (let i = 1; i < serie.length; i++) {
    somaVariacoes += serie[i].corte - serie[i - 1].corte;
  }
  const mediaVariacao = somaVariacoes / (serie.length - 1);

  const maxDelta = CHANCE_THRESHOLDS.PROJECAO_MAX_DELTA;
  const clampedDelta = Math.max(-maxDelta, Math.min(maxDelta, mediaVariacao));
  const corteProjetado = Math.max(0, Math.min(1000, ultimo.corte + clampedDelta));

  let tendencia: 'alta' | 'queda' | 'estavel' = 'estavel';
  if (clampedDelta >= 1.5) tendencia = 'alta';
  else if (clampedDelta <= -1.5) tendencia = 'queda';

  return {
    modalidade,
    ultimoAno: ultimo.ano,
    ultimoCorte: ultimo.corte,
    corteProjetado,
    deltaAplicado: clampedDelta,
    tendencia,
    historico: serie,
  };
}

export function classificarChance(
  notaUsuario: number | null,
  notaCorte: number | null,
  elegivel: boolean
): ClassificacaoChance {
  if (!elegivel) {
    return {
      nivel: 'INELEGIVEL',
      label: 'Inelegível para este curso',
      cor: 'slate',
      diferenca: null,
    };
  }

  if (notaUsuario === null || notaCorte === null) {
    return {
      nivel: 'POSSIVEL',
      label: 'Sem corte histórico na modalidade',
      cor: 'slate',
      diferenca: null,
    };
  }

  const diff = notaUsuario - notaCorte;
  if (diff >= CHANCE_THRESHOLDS.ALTA_MIN_DIFF) {
    return { nivel: 'ALTA', label: 'Alta chance', cor: 'emerald', diferenca: diff };
  }
  if (diff >= CHANCE_THRESHOLDS.BOA_MIN_DIFF) {
    return { nivel: 'BOA', label: 'Boa chance', cor: 'lime', diferenca: diff };
  }
  if (diff >= CHANCE_THRESHOLDS.POSSIVEL_MIN_DIFF) {
    return {
      nivel: 'POSSIVEL',
      label: 'Possível (lista de espera)',
      cor: 'amber',
      diferenca: diff,
    };
  }
  if (diff >= CHANCE_THRESHOLDS.BAIXA_MIN_DIFF) {
    return { nivel: 'BAIXA', label: 'Baixa chance', cor: 'rose', diferenca: diff };
  }
  return { nivel: 'MUITO_BAIXA', label: 'Muito baixa', cor: 'rose', diferenca: diff };
}

/**
 * Calcula exatamente quantos pontos faltam na média ponderada e quanto precisaria subir
 * em CADA área isoladamente mantendo precisão completa até o fim.
 */
export function quantoFalta(
  notas: NotasEnem,
  curso: CursoSisu,
  corteAlvo: number,
  cumpreBonus: boolean
): AnaliseQuantoFalta {
  const bonusPct = cumpreBonus && curso.bonusPercentual ? curso.bonusPercentual : 0;
  const { bruta, comBonus, somaPesos: totalPesos } = mediaPonderada(notas, curso.pesos, bonusPct);
  const diferencaPonderada = corteAlvo - comBonus;

  if (diferencaPonderada <= 0) {
    return {
      jaAtingiu: true,
      diferencaPonderada,
      corteReferencia: corteAlvo,
      areas: AREA_KEYS.map((area) => ({
        area,
        nomeCurto: AREAS_ENEM_META[area].nomeCurto,
        peso: curso.pesos[area],
        notaAtual: notas[area],
        pontosNecessarios: 0,
        notaAlvo: notas[area],
        possivelNoEnem: true,
      })),
      melhorArea: null,
    };
  }

  const fatorBonus = bonusPct > 0 ? 1 + bonusPct / 100 : 1;
  const alvoBruto = corteAlvo / fatorBonus;
  const pontosPonderadosTotaisFaltantes = (alvoBruto - bruta) * totalPesos;

  const areas: AnaliseAreaQuantoFalta[] = AREA_KEYS.map((area) => {
    const peso = curso.pesos[area];
    const notaAtual = notas[area];
    if (peso <= 0) {
      return {
        area,
        nomeCurto: AREAS_ENEM_META[area].nomeCurto,
        peso,
        notaAtual,
        pontosNecessarios: Infinity,
        notaAlvo: Infinity,
        possivelNoEnem: false,
      };
    }

    const pontosNecessarios = pontosPonderadosTotaisFaltantes / peso;
    const notaAlvo = notaAtual + pontosNecessarios;
    const possivelNoEnem = notaAlvo <= 1000 + 1e-9;

    return {
      area,
      nomeCurto: AREAS_ENEM_META[area].nomeCurto,
      peso,
      notaAtual,
      pontosNecessarios,
      notaAlvo,
      possivelNoEnem,
    };
  });

  // Melhor área: menor incremento necessário (maior peso), dentre as possíveis no limite de 1000
  const possiveis = areas
    .filter((a) => a.possivelNoEnem && a.peso > 0)
    .sort((a, b) => a.pontosNecessarios - b.pontosNecessarios);

  return {
    jaAtingiu: false,
    diferencaPonderada,
    corteReferencia: corteAlvo,
    areas,
    melhorArea: possiveis[0] || null,
  };
}

export function simularCurso(
  edicoes: EdicaoNotasUsuario[],
  curso: CursoSisu,
  modalidadeEscolhida: ModalidadeCodigo,
  cumpreBonus: boolean,
  edicoesValidas: readonly number[] = EDICOES_VALIDAS
): ResultadoSimulacaoCurso {
  const { melhor, todasEdicoes } = melhorEdicao(edicoes, curso, cumpreBonus, edicoesValidas);
  const edicaoFonte = melhor ? edicoes.find((e) => e.edicao === melhor.edicao) || null : null;

  const projecaoAC = projetarCorte(curso.cortesHistoricos, 'AC');
  const temEdicaoValida = Boolean(melhor);
  const elegivel = Boolean(melhor && melhor.elegibilidade.elegivel);
  const notaFinal = melhor ? melhor.notaFinal : null;

  const chanceACUltimo = classificarChance(notaFinal, projecaoAC.ultimoCorte, elegivel);
  const chanceACProj = classificarChance(notaFinal, projecaoAC.corteProjetado, elegivel);
  const qfAC =
    edicaoFonte && projecaoAC.ultimoCorte !== null
      ? quantoFalta(edicaoFonte.notas, curso, projecaoAC.ultimoCorte, cumpreBonus)
      : null;

  let resultadoCota: ResultadoSimulacaoCurso['resultadoCota'] = null;
  if (modalidadeEscolhida !== 'AC') {
    const projecaoCota = projetarCorte(curso.cortesHistoricos, modalidadeEscolhida);
    const chanceCotaUltimo = classificarChance(notaFinal, projecaoCota.ultimoCorte, elegivel);
    const chanceCotaProj = classificarChance(notaFinal, projecaoCota.corteProjetado, elegivel);
    const qfCota =
      edicaoFonte && projecaoCota.ultimoCorte !== null
        ? quantoFalta(edicaoFonte.notas, curso, projecaoCota.ultimoCorte, cumpreBonus)
        : null;

    resultadoCota = {
      projecao: projecaoCota,
      chanceUltimoCorte: chanceCotaUltimo,
      chanceProjetada: chanceCotaProj,
      quantoFaltaUltimoCorte: qfCota,
    };
  }

  let motivosInelegibilidade: string[] = [];
  if (!melhor) {
    motivosInelegibilidade = [
      'Nenhuma edição válida do Enem encontrada (verifique se não marcou todas como treineiro ou se Redação é maior que 0).',
    ];
  } else if (!melhor.elegibilidade.elegivel) {
    motivosInelegibilidade = melhor.elegibilidade.motivosFalha;
  }

  return {
    curso,
    temEdicaoValida,
    melhorEdicao: melhor,
    todasEdicoes,
    notaFinal,
    elegivel,
    motivosInelegibilidade,
    modalidadeEscolhida,
    resultadoAC: {
      projecao: projecaoAC,
      chanceUltimoCorte: chanceACUltimo,
      chanceProjetada: chanceACProj,
      quantoFaltaUltimoCorte: qfAC,
    },
    resultadoCota,
    vagasAC: curso.vagasPorModalidade.AC || 0,
    vagasCota:
      modalidadeEscolhida === 'AC'
        ? curso.vagasPorModalidade.AC || 0
        : curso.vagasPorModalidade[modalidadeEscolhida] || 0,
  };
}

export interface ItemOndeEuPasso {
  simulacao: ResultadoSimulacaoCurso;
  melhorChance: ClassificacaoChance;
  corteReferencia: number | null;
  modalidadeReferencia: ModalidadeCodigo;
  margem: number;
}

export function ondeEuPasso(
  edicoes: EdicaoNotasUsuario[],
  cursos: CursoSisu[],
  modalidade: ModalidadeCodigo,
  cumpreBonus: boolean,
  edicoesValidas: readonly number[] = EDICOES_VALIDAS
): ItemOndeEuPasso[] {
  const rankMap: Record<ClassificacaoChance['nivel'], number> = {
    ALTA: 5,
    BOA: 4,
    POSSIVEL: 3,
    BAIXA: 2,
    MUITO_BAIXA: 1,
    INELEGIVEL: 0,
  };

  return cursos
    .map((curso) => {
      const simulacao = simularCurso(edicoes, curso, modalidade, cumpreBonus, edicoesValidas);
      const acDiff = simulacao.resultadoAC.chanceUltimoCorte.diferenca ?? -999;
      const cotaDiff = simulacao.resultadoCota?.chanceUltimoCorte.diferenca ?? -999;

      const usarCota =
        modalidade !== 'AC' &&
        simulacao.resultadoCota &&
        simulacao.resultadoCota.projecao.ultimoCorte !== null &&
        (simulacao.resultadoAC.chanceUltimoCorte.nivel === 'BAIXA' ||
          simulacao.resultadoAC.chanceUltimoCorte.nivel === 'MUITO_BAIXA' ||
          simulacao.resultadoAC.chanceUltimoCorte.nivel === 'POSSIVEL' ||
          cotaDiff > acDiff);

      const melhorChance = usarCota && simulacao.resultadoCota
        ? simulacao.resultadoCota.chanceUltimoCorte
        : simulacao.resultadoAC.chanceUltimoCorte;
      const corteReferencia = usarCota && simulacao.resultadoCota
        ? simulacao.resultadoCota.projecao.ultimoCorte
        : simulacao.resultadoAC.projecao.ultimoCorte;
      const modalidadeReferencia: ModalidadeCodigo = usarCota ? modalidade : 'AC';
      const margem = melhorChance.diferenca ?? -999;

      return {
        simulacao,
        melhorChance,
        corteReferencia,
        modalidadeReferencia,
        margem,
      };
    })
    .sort((a, b) => {
      const rankDiff = rankMap[b.melhorChance.nivel] - rankMap[a.melhorChance.nivel];
      if (rankDiff !== 0) return rankDiff;
      return b.margem - a.margem;
    });
}

/**
 * Calculadora reversa: dada uma nota de corte alvo e um curso, calcula cenários
 * plausíveis de combinação de notas nas 5 áreas (Equilibrado, Foco nos Pesos Maiores,
 * e Forte na Redação).
 */
export function calcularCombinacoesReversas(
  notaCorteAlvo: number,
  curso: CursoSisu,
  cumpreBonus = false
): CenarioCalculadoraReversa[] {
  const bonusPct = cumpreBonus && curso.bonusPercentual ? curso.bonusPercentual : 0;
  const fator = bonusPct > 0 ? 1 + bonusPct / 100 : 1;
  const alvoBruto = Math.min(1000, Math.max(0, notaCorteAlvo / fator));
  const totalPesos = somaPesos(curso.pesos);

  if (totalPesos <= 0) return [];

  const montarCenario = (
    titulo: string,
    descricao: string,
    multiplicadores: Record<AreaEnem, number>
  ): CenarioCalculadoraReversa => {
    // Escala os multiplicadores respeitando mínimos do curso e teto 1000
    const pesos = curso.pesos;
    const baseNotas: Record<AreaEnem, number> = {
      LC: alvoBruto,
      CH: alvoBruto,
      CN: alvoBruto,
      MT: alvoBruto,
      RED: alvoBruto,
    };

    // Ajusta proporcionalmente ao multiplicador em torno do alvoBruto
    let somaPondMultiplicadores = 0;
    for (const k of AREA_KEYS) {
      somaPondMultiplicadores += pesos[k] * multiplicadores[k];
    }

    const fatorEscala =
      somaPondMultiplicadores > 0
        ? (alvoBruto * totalPesos) / somaPondMultiplicadores
        : 1;

    for (const k of AREA_KEYS) {
      const minArea = curso.notasMinimasPorArea?.[k] || (k === 'RED' ? 100 : 0);
      const val = Math.max(minArea, Math.min(1000, Math.round(multiplicadores[k] * fatorEscala)));
      baseNotas[k] = val;
    }

    // Ajuste fino iterativo para aproximar ou superar ligeiramente o alvoBruto sem ultrapassar 1000
    for (let iter = 0; iter < 150; iter++) {
      const { bruta } = mediaPonderada(baseNotas, pesos, 0);
      const diff = alvoBruto - bruta;
      if (Math.abs(diff) < 0.25) break;

      const sortedAreas = [...AREA_KEYS].sort((a, b) =>
        diff > 0 ? pesos[b] - pesos[a] : pesos[a] - pesos[b]
      );
      let adjusted = false;
      for (const k of sortedAreas) {
        const minArea = curso.notasMinimasPorArea?.[k] || (k === 'RED' ? 100 : 0);
        const step = diff > 0 ? Math.min(10, Math.ceil(diff)) : -Math.min(10, Math.ceil(-diff));
        const nextVal = baseNotas[k] + step;
        if (nextVal <= 1000 && nextVal >= minArea) {
          baseNotas[k] = nextVal;
          adjusted = true;
          break;
        }
      }
      if (!adjusted) break;
    }

    const { comBonus } = mediaPonderada(baseNotas, pesos, bonusPct);

    return {
      titulo,
      descricao,
      notaPonderadaAlcancada: comBonus,
      atingivel: comBonus + 0.01 >= notaCorteAlvo,
      areas: AREA_KEYS.map((k) => ({
        area: k,
        nomeCurto: AREAS_ENEM_META[k].nomeCurto,
        peso: pesos[k],
        notaSugerida: baseNotas[k],
      })),
    };
  };

  // Ordena áreas por peso
  const maxPeso = Math.max(...AREA_KEYS.map((k) => curso.pesos[k]));
  const pesoMult: Record<AreaEnem, number> = {
    LC: curso.pesos.LC >= maxPeso ? 1.08 : 0.96,
    CH: curso.pesos.CH >= maxPeso ? 1.08 : 0.96,
    CN: curso.pesos.CN >= maxPeso ? 1.08 : 0.96,
    MT: curso.pesos.MT >= maxPeso ? 1.08 : 0.96,
    RED: curso.pesos.RED >= maxPeso ? 1.12 : 1.04,
  };

  return [
    montarCenario(
      'Perfil Equilibrado',
      'Distribuição uniforme nas 5 áreas mantendo consistência geral.',
      { LC: 1, CH: 1, CN: 1, MT: 1, RED: 1 }
    ),
    montarCenario(
      'Estratégia nos Pesos Maiores',
      'Prioriza as disciplinas de maior peso deste curso para ganhar pontos com menos esforço.',
      pesoMult
    ),
    montarCenario(
      'Alavanca em Redação (900+)',
      'Usa uma redação de alto desempenho para compensar oscilações nas provas objetivas.',
      { LC: 0.95, CH: 0.95, CN: 0.93, MT: 0.95, RED: 1.2 }
    ),
  ];
}

export function gerarAnaliseLocalSisu(sim: ResultadoSimulacaoCurso): string {
  const { curso, notaFinal, melhorEdicao: ed, elegivel, motivosInelegibilidade, modalidadeEscolhida } = sim;
  const ac = sim.resultadoAC;
  const cota = sim.resultadoCota;
  const modLabel = MODALIDADES_INFO[modalidadeEscolhida].siglaCurta;

  if (!ed) {
    return [
      `### Diagnóstico Inicial — ${curso.curso} (${curso.iesSigla})`,
      `Ainda não há uma edição válida do Enem preenchida para calcular sua média neste curso.`,
      `- Verifique se todas as edições foram marcadas como **treineiro** ou se alguma está com **Redação = 0** (que invalida a edição inteira).`,
      `- Preencha ao menos uma edição válida em **Suas notas** para receber o plano de ação personalizado.`,
    ].join('\n\n');
  }

  if (!elegivel) {
    return [
      `### Atenção aos Requisitos Mínimos — ${curso.curso} (${curso.iesSigla})`,
      `Na edição **${ed.edicao}**, sua média ponderada ficou em **${formatarNotaBR(notaFinal)}**, porém o sistema acusou **inelegibilidade**:`,
      ...motivosInelegibilidade.map((m) => `- ${m}`),
      `**Próximo passo prático:** concentre sua próxima semana de estudos exatamente nos requisitos acima antes de comparar notas de corte, pois no Sisu o não cumprimento de nota mínima impede a classificação mesmo que a média final seja alta.`,
    ].join('\n\n');
  }

  const lines: string[] = [
    `### Análise Estratégica — ${curso.curso} (${curso.iesSigla})`,
    `Sua melhor edição do Enem para este curso é **${ed.edicao}**, alcançando **${formatarNotaBR(notaFinal)} pontos** ponderados.`,
    `- **Na Ampla Concorrência (AC):** ${ac.chanceUltimoCorte.label}${ac.projecao.ultimoCorte !== null ? ` (último corte registrado: ${formatarNotaBR(ac.projecao.ultimoCorte)} em ${ac.projecao.ultimoAno})` : ''}.`,
  ];

  if (cota && modalidadeEscolhida !== 'AC') {
    lines.push(
      `- **Na sua cota (${modLabel}):** ${cota.chanceUltimoCorte.label}${cota.projecao.ultimoCorte !== null ? ` (último corte registrado: ${formatarNotaBR(cota.projecao.ultimoCorte)} em ${cota.projecao.ultimoAno})` : ''}.`
    );
  }

  const qfAlvo =
    cota && cota.quantoFaltaUltimoCorte && !cota.quantoFaltaUltimoCorte.jaAtingiu
      ? cota.quantoFaltaUltimoCorte
      : ac.quantoFaltaUltimoCorte;

  if (qfAlvo && !qfAlvo.jaAtingiu && qfAlvo.melhorArea) {
    lines.push(
      `**Onde você ganha mais pontos por hora estudada:** pelo peso **${qfAlvo.melhorArea.peso}** neste curso, **${qfAlvo.melhorArea.nomeCurto}** é sua alavanca mais eficiente — subir **+${formatarNotaBR(qfAlvo.melhorArea.pontosNecessarios)} pontos** nessa área (indo para **${formatarNotaBR(qfAlvo.melhorArea.notaAlvo)}**) já cobriria a diferença até o último corte.`
    );
  } else if (qfAlvo?.jaAtingiu) {
    lines.push(
      `**Margem favorável:** sua pontuação atual supera o último corte de referência. Mantenha consistência nos simulados e na Redação para construir folga contra eventuais oscilações nas chamadas do Sisu.`
    );
  }

  lines.push(
    `*Nota: projeções e chances são estimativas educativas com base em ${curso.ilustrativo ? 'dados ilustrativos de referência' : curso.fonte} e não garantem aprovação.*`
  );

  return lines.join('\n\n');
}
