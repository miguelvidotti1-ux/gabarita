import { describe, expect, it } from 'vitest';
import {
  calcularXP,
  corrigir,
  omitirGabaritoParaCliente,
  proximaRevisao,
  resumoSessao,
  selecionarQuestoesFiltradas,
  INTERVALOS_REVISAO_DIAS,
  Questao,
  Tentativa,
} from './treinoEngine';

const sampleQ: Questao = {
  id: 'q-test-1',
  banca: 'ENEM',
  ano: 2025,
  materia: 'Matemática',
  topico: 'Funções',
  dificuldade: 'media',
  enunciado: 'Calcule o valor de $f(2)$ para $f(x) = 3x + 1$.',
  alternativas: [
    { letra: 'A', texto: '5' },
    { letra: 'B', texto: '6' },
    { letra: 'C', texto: '7' },
    { letra: 'D', texto: '8' },
    { letra: 'E', texto: '9' },
  ],
  correta: 'C',
  fonte: 'Questão de exemplo',
  explicacaoCache: {
    resolucao: 'Substituindo $x = 2$, temos $f(2) = 3(2) + 1 = 7$.',
    porQueErrada: {
      A: 'Erro ao somar 1.',
    },
    macete: 'Substitua o argumento diretamente na lei de formação.',
  },
};

describe('treinoEngine', () => {
  it('corrige corretamente questões objetivas e respeita questões anuladas', () => {
    expect(corrigir(sampleQ, 'C')).toEqual({ acertou: true, correta: 'C' });
    expect(corrigir(sampleQ, 'A')).toEqual({ acertou: false, correta: 'C' });
    expect(corrigir({ correta: 'B', anulada: true }, 'E')).toEqual({
      acertou: true,
      correta: 'B',
    });
  });

  it('avança intervalos de revisão espaçada [1, 3, 7, 15, 30] ao acertar e reinicia para 1 dia ao errar', () => {
    const base = new Date('2026-11-10T12:00:00.000Z');
    let item = proximaRevisao('q-test-1', null, true, base);
    expect(item.intervaloDias).toBe(1);
    expect(item.passo).toBe(0);

    for (const esperado of INTERVALOS_REVISAO_DIAS.slice(1)) {
      item = proximaRevisao('q-test-1', item, true, base);
      expect(item.intervaloDias).toBe(esperado);
    }

    // Não passa de 30 dias quando já está no último passo
    item = proximaRevisao('q-test-1', item, true, base);
    expect(item.intervaloDias).toBe(30);

    // Ao errar, reinicia para 1 dia e zera acertosSeguidos
    item = proximaRevisao('q-test-1', item, false, base);
    expect(item.intervaloDias).toBe(1);
    expect(item.passo).toBe(0);
    expect(item.acertosSeguidos).toBe(0);
  });

  it('calcula XP com bônus de sequência nos múltiplos de 5 e +2 no erro', () => {
    expect(calcularXP(true, 1)).toEqual({ xpGanho: 10, bonusStreak: false });
    expect(calcularXP(true, 5)).toEqual({ xpGanho: 15, bonusStreak: true });
    expect(calcularXP(true, 10)).toEqual({ xpGanho: 15, bonusStreak: true });
    expect(calcularXP(false, 0)).toEqual({ xpGanho: 2, bonusStreak: false });
  });

  it('gera resumoSessao preciso por matéria, maior streak e tempo médio', () => {
    const tentativas: Tentativa[] = [
      {
        questaoId: 'q1',
        banca: 'ENEM',
        materia: 'Matemática',
        topico: 'Funções',
        alternativaEscolhida: 'C',
        correta: 'C',
        acertou: true,
        tempoSeg: 40,
        xpGanho: 10,
        bonusStreak: false,
        streakApos: 1,
        respondidaEm: '2026-11-10T12:00:00.000Z',
      },
      {
        questaoId: 'q2',
        banca: 'FUVEST',
        materia: 'Física',
        topico: 'Dinâmica',
        alternativaEscolhida: 'A',
        correta: 'D',
        acertou: false,
        tempoSeg: 80,
        xpGanho: 2,
        bonusStreak: false,
        streakApos: 0,
        respondidaEm: '2026-11-10T12:01:20.000Z',
      },
    ];

    const resumo = resumoSessao(tentativas);
    expect(resumo.total).toBe(2);
    expect(resumo.acertos).toBe(1);
    expect(resumo.erros).toBe(1);
    expect(resumo.pctAcerto).toBe(50);
    expect(resumo.xpTotal).toBe(12);
    expect(resumo.maiorStreak).toBe(1);
    expect(resumo.tempoMedioSeg).toBe(60);
    expect(resumo.errosDetalhados).toHaveLength(1);
    expect(resumo.porMateria).toHaveLength(2);
  });

  it('omite gabarito e explicação cacheada para o cliente e exclui anuladas da seleção', () => {
    const cliente = omitirGabaritoParaCliente(sampleQ);
    expect('correta' in cliente).toBe(false);
    expect('explicacaoCache' in cliente).toBe(false);

    const anulada: Questao = { ...sampleQ, id: 'q-anulada', anulada: true };
    const selecionadas = selecionarQuestoesFiltradas(
      [sampleQ, anulada],
      { banca: 'ENEM', materia: 'Matemática', quantidade: 10, modo: 'livre' }
    );
    expect(selecionadas.map((q) => q.id)).toEqual(['q-test-1']);
  });
});
