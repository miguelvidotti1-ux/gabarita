import { describe, expect, it } from 'vitest';
import {
  EDICOES_VALIDAS,
  calcularCombinacoesReversas,
  classificarChance,
  formatarNotaBR,
  mediaPonderada,
  melhorEdicao,
  ondeEuPasso,
  parseNotaBR,
  projetarCorte,
  quantoFalta,
  recomendarModalidadesPorQuestionario,
  simularCurso,
  verificarElegibilidade,
  type CursoSisu,
  type EdicaoNotasUsuario,
  type NotasEnem,
} from './sisuEngine';

const cursoExemplo: CursoSisu = {
  id: 'curso-teste-ufpe',
  ies: 'Universidade Federal de Pernambuco',
  iesSigla: 'UFPE',
  curso: 'Ciência da Computação',
  campus: 'Recife',
  cidade: 'Recife',
  uf: 'PE',
  grau: 'Bacharelado',
  turno: 'Integral',
  pesos: { LC: 2, CH: 1, CN: 2, MT: 4, RED: 2 },
  bonusPercentual: 10,
  vagasPorModalidade: { AC: 40, LB_PPI: 10, LI_EP: 10 },
  cortesHistoricos: [
    { ano: 2023, modalidades: { AC: 730, LB_PPI: 680, LI_EP: 705 } },
    { ano: 2024, modalidades: { AC: 735, LB_PPI: 684, LI_EP: 708 } },
    { ano: 2025, modalidades: { AC: 740, LB_PPI: 688, LI_EP: 712 } },
  ],
  ilustrativo: true,
  fonte: 'Teste unitário',
};

describe('Simulador Sisu — Engine de Cálculos e Elegibilidade', () => {
  it('calcula exatamente o caso numérico obrigatório (723,64 sem bônus e 796,00 com bônus de 10%)', () => {
    const notas: NotasEnem = { LC: 650, CH: 700, CN: 600, MT: 750, RED: 880 };
    const res = mediaPonderada(notas, cursoExemplo.pesos, cursoExemplo.bonusPercentual);

    // 7960 / 11 = 723.636363... -> 723,64
    expect(formatarNotaBR(res.bruta)).toBe('723,64');
    // (7960 / 11) * 1.10 = 796.0000... -> 796,00
    expect(res.comBonus).toBeCloseTo(796, 8);
    expect(formatarNotaBR(res.comBonus)).toBe('796,00');
  });

  it('calcula exatamente Quanto Falta mantendo precisão total antes de arredondar', () => {
    const notas: NotasEnem = { LC: 650, CH: 700, CN: 600, MT: 750, RED: 880 };
    const qf = quantoFalta(notas, cursoExemplo, 740, false);

    expect(qf.jaAtingiu).toBe(false);
    const mt = qf.areas.find((a) => a.area === 'MT');
    const red = qf.areas.find((a) => a.area === 'RED');
    const ch = qf.areas.find((a) => a.area === 'CH');

    // (740 * 11 - 7960) = 180 pontos ponderados faltantes
    // MT (peso 4): 180 / 4 = +45 pontos
    // RED (peso 2): 180 / 2 = +90 pontos
    // CH (peso 1): 180 / 1 = +180 pontos
    expect(mt?.pontosNecessarios).toBeCloseTo(45, 6);
    expect(red?.pontosNecessarios).toBeCloseTo(90, 6);
    expect(ch?.pontosNecessarios).toBeCloseTo(180, 6);
    expect(qf.melhorArea?.area).toBe('MT');
  });

  it('marca impossibilidade quando nota alvo ultrapassa 1000', () => {
    const notas: NotasEnem = { LC: 500, CH: 500, CN: 500, MT: 900, RED: 500 };
    const qf = quantoFalta(notas, cursoExemplo, 850, false);

    const ch = qf.areas.find((a) => a.area === 'CH');
    expect(ch?.possivelNoEnem).toBe(false);
    expect((ch?.notaAlvo ?? 0) > 1000).toBe(true);
  });

  it('invalida edição quando Redação = 0 e descarta edições de treineiro', () => {
    const edicoes: EdicaoNotasUsuario[] = [
      { edicao: 2024, notas: { LC: 800, CH: 800, CN: 800, MT: 800, RED: 0 }, treineiro: false },
      { edicao: 2025, notas: { LC: 850, CH: 850, CN: 850, MT: 850, RED: 900 }, treineiro: true },
      { edicao: 2026, notas: { LC: 650, CH: 700, CN: 600, MT: 750, RED: 880 }, treineiro: false },
    ];

    const { melhor, todasEdicoes } = melhorEdicao(edicoes, cursoExemplo, false, EDICOES_VALIDAS);
    expect(melhor?.edicao).toBe(2026);
    expect(todasEdicoes.find((e) => e.edicao === 2024)?.descartada).toBe(true);
    expect(todasEdicoes.find((e) => e.edicao === 2025)?.descartada).toBe(true);
  });

  it('nunca mistura áreas de edições diferentes ao escolher a melhor edição', () => {
    // 2024 forte em tudo menos MT; 2025 forte só em MT, fraca no resto
    const edicoes: EdicaoNotasUsuario[] = [
      { edicao: 2024, notas: { LC: 750, CH: 750, CN: 750, MT: 600, RED: 880 }, treineiro: false },
      { edicao: 2025, notas: { LC: 500, CH: 500, CN: 500, MT: 900, RED: 500 }, treineiro: false },
    ];
    // 2024 soma: 750*2 + 750*1 + 750*2 + 600*4 + 880*2 = 1500+750+1500+2400+1760 = 7910 / 11 = 719,09
    // 2025 soma: 500*2 + 500*1 + 500*2 + 900*4 + 500*2 = 1000+500+1000+3600+1000 = 7100 / 11 = 645,45
    // Se misturasse notas máximas daria > 828, mas engine deve dar 719,09 (edição 2024 inteira)
    const { melhor } = melhorEdicao(edicoes, cursoExemplo, false);
    expect(melhor?.edicao).toBe(2024);
    expect(formatarNotaBR(melhor?.notaFinal)).toBe('719,09');
  });

  it('detecta inelegibilidade por nota mínima por área e por média mínima geral', () => {
    const cursoComMinimos: CursoSisu = {
      ...cursoExemplo,
      notasMinimasPorArea: { CN: 550, RED: 600 },
      mediaMinima: 680,
    };

    const notas: NotasEnem = { LC: 700, CH: 700, CN: 520, MT: 700, RED: 580 };
    const elig = verificarElegibilidade(notas, cursoComMinimos, false, false);
    expect(elig.elegivel).toBe(false);
    expect(elig.areasReprovadas).toContain('CN');
    expect(elig.areasReprovadas).toContain('RED');
    expect(elig.motivosFalha.length).toBeGreaterThanOrEqual(3); // CN, RED e média mínima
  });

  it('projeta nota de corte respeitando limite máximo de ±30 pontos e trata falta de histórico', () => {
    const projNormal = projetarCorte(cursoExemplo.cortesHistoricos, 'AC');
    expect(projNormal.ultimoCorte).toBe(740);
    expect(projNormal.corteProjetado).toBeCloseTo(745, 5);
    expect(projNormal.tendencia).toBe('alta');

    const cursoSaltoExtremo: CursoSisu = {
      ...cursoExemplo,
      cortesHistoricos: [
        { ano: 2024, modalidades: { AC: 600 } },
        { ano: 2025, modalidades: { AC: 700 } },
      ],
    };
    const projClamped = projetarCorte(cursoSaltoExtremo.cortesHistoricos, 'AC');
    expect(projClamped.deltaAplicado).toBe(30);
    expect(projClamped.corteProjetado).toBe(730);

    const projVazio = projetarCorte(cursoExemplo.cortesHistoricos, 'LB_Q');
    expect(projVazio.corteProjetado).toBeNull();
    expect(projVazio.tendencia).toBe('indisponivel');
  });

  it('classifica chance corretamente em todas as faixas', () => {
    expect(classificarChance(760, 740, true).nivel).toBe('ALTA');
    expect(classificarChance(745, 740, true).nivel).toBe('BOA');
    expect(classificarChance(740, 740, true).nivel).toBe('BOA');
    expect(classificarChance(725, 740, true).nivel).toBe('POSSIVEL');
    expect(classificarChance(710, 740, true).nivel).toBe('BAIXA');
    expect(classificarChance(690, 740, true).nivel).toBe('MUITO_BAIXA');
    expect(classificarChance(900, 700, false).nivel).toBe('INELEGIVEL');
  });

  it('simula AC e cota simultaneamente (candidato sempre concorre primeiro na AC)', () => {
    const edicoes: EdicaoNotasUsuario[] = [
      { edicao: 2025, notas: { LC: 650, CH: 700, CN: 600, MT: 750, RED: 880 }, treineiro: false },
    ];
    const sim = simularCurso(edicoes, cursoExemplo, 'LB_PPI', false);

    expect(sim.resultadoAC.chanceUltimoCorte.nivel).toBe('BAIXA'); // 723,64 vs 740 = -16,36
    expect(sim.resultadoCota?.chanceUltimoCorte.nivel).toBe('ALTA'); // 723,64 vs 688 = +35,64
  });

  it('recomenda modalidades válidas a partir do questionário de cotas e gera cenários reversos válidos', () => {
    const mods = recomendarModalidadesPorQuestionario({
      escolaPublicaIntegral: true,
      rendaPerCapitaAte1SM: true,
      ppi: true,
      quilombola: false,
      pcd: false,
    });
    expect(mods).toContain('AC');
    expect(mods).toContain('LB_PPI');
    expect(mods).toContain('LB_EP');
    expect(mods).toContain('LI_PPI');

    const cenarios = calcularCombinacoesReversas(740, cursoExemplo, false);
    expect(cenarios.length).toBe(3);
    cenarios.forEach((c) => {
      expect(c.atingivel).toBe(true);
      expect(c.notaPonderadaAlcancada).toBeGreaterThanOrEqual(739.5);
    });
  });

  it('faz parse de nota no padrão brasileiro (vírgula) e ranqueia Onde Eu Passo', () => {
    expect(parseNotaBR('723,64')).toBeCloseTo(723.64, 5);
    expect(parseNotaBR('1005')).toBeNull();
    expect(parseNotaBR('-5')).toBeNull();

    const edicoes: EdicaoNotasUsuario[] = [
      { edicao: 2025, notas: { LC: 750, CH: 750, CN: 750, MT: 780, RED: 900 }, treineiro: false },
    ];
    const ranking = ondeEuPasso(edicoes, [cursoExemplo], 'AC', false);
    expect(ranking[0].melhorChance.nivel).toBe('ALTA');
  });
});
