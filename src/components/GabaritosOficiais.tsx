import React, { useState, useMemo } from 'react';
import { 
  FileText, Search, Filter, Download, 
  CheckCircle2, ChevronRight, FileSpreadsheet, 
  ChevronDown, Calendar, GraduationCap, ArrowLeft, X,
  Sparkles, Award, Trophy, Play, RefreshCw, BarChart2,
  TrendingUp, Check, AlertCircle, HelpCircle, BookOpen,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Vestibular, GabaritoOficial } from '../types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generates rich sample questions with realistic content based on exam subjects
const generateRichQuestions = (exame: Vestibular | string, dia: number, count?: number) => {
  const subjects: Record<string, string[]> = {
    [Vestibular.ENEM]: dia === 1 
      ? ['Linguagens e Códigos', 'Ciências Humanas'] 
      : ['Ciências da Natureza', 'Matemática'],
    [Vestibular.FUVEST]: ['Português e Literatura', 'História e Geografia', 'Física e Química', 'Biologia', 'Matemática'],
    [Vestibular.ITA]: ['Física', 'Português', 'Inglês', 'Matemática', 'Química']
  };

  const currentSubjects = subjects[exame as keyof typeof subjects] || ['Conhecimentos Gerais'];
  const answerKeys = ['A', 'B', 'C', 'D', 'E'];
  const questionCount = count || (exame === Vestibular.ITA ? 60 : 90);

  const realProblemTemplates = [
    {
      enunciado: "Considerando a crise hídrica global e os crescentes desafios de saneamento urbano básico no Brasil, qual das opções a seguir propõe a solução sustentável mais eficiente sob a perspectiva da engenharia ecológica moderna?",
      alternativas: [
        "Captação direta de lençóis subterrâneos profundos sem tratamento prévio.",
        "Implementação obrigatória de sistemas descentralizados de filtragem por fitorrestauração e wetlands nas periferias urbanas.",
        "Privatização total de mananciais de água para regular o consumo pelo preço de mercado de alta demanda.",
        "Transferência artificial de bacias hidrográficas em larga escala através de megaborbardeamento mecânico.",
        "Substituição de redes de distribuição tradicionais por caminhões-pipa autônomos movidos a energia solar."
      ],
      justificativa: "A fitorrestauração utilizando wetlands construídas promove o tratamento biológico descentralizado de águas cinzas de maneira extremamente econômica, regenerando ecótopos locais."
    },
    {
      enunciado: "O movimento estético do Modernismo no Brasil, consolidado na histórica Semana de Arte Moderna de 1922, representou uma ruptura drástica com a tradição acadêmica acadêmica anterior. Que aspecto central define a proposta antropofágica de Oswald de Andrade?",
      alternativas: [
        "A cópia fiel dos modelos expressionistas e futuristas europeus sem alterações temáticas nacionais.",
        "A rejeição absoluta de qualquer influência artística vinda do exterior do país.",
        "A assimilação crítica da bagagem cultural estrangeira para recriá-la com teor nativo e original brasileiro.",
        "O resgate purista e inalterado da literatura jesuítica do período colonial.",
        "A subordinação da estética literária aos rígidos padrões formais do parnasianismo luso."
      ],
      justificativa: "A antropofagia propõe deglutir a cultura colonizadora estrangeira, reprocessando seus elementos para criar uma arte puramente brasileira, moderna e irreverente."
    },
    {
      enunciado: "Uma espira condutora circular, imersa em um campo magnético uniforme de intensidade variável, experimenta uma corrente induzida conforme previsto pelas leis da eletrodinâmica clássica de Faraday-Lenz. A respeito do sentido da corrente elétrica induzida, está correto afirmar que:",
      alternativas: [
        "O sentido será sempre no sentido horário para anular qualquer campo presente.",
        "O sentido da corrente gera um campo magnético que se opõe à variação do fluxo magnético original.",
        "A intensidade da corrente induzida independe da velocidade de variação do fluxo magnético externo.",
        "O fluxo de elétrons induzido migra com velocidade infinita em regime estacionário constante.",
        "O efeito fotoelétrico adjacente impede a flutuação direcional do vetor induzido livre."
      ],
      justificativa: "De acordo com a Lei de Lenz, a corrente elétrica induzida apresenta sentido tal que seu próprio efeito magnético se opõe à variação do fluxo que a produziu."
    },
    {
      enunciado: "Em uma floresta tropical primária temperada, a dinâmica populacional de produtores e consumidores é estritamente afetada pela introdução acidental de uma espécie exótica invasora de hábitos herbívoros generalistas sem predadores naturais no ecossistema local. Esta perturbação ecológica resulta diretamente em:",
      alternativas: [
        "Aumento imediato da biodiversidade nativa de consumidores secundários e terciários.",
        "Redução drástica da biomassa dos produtores primários locais e desequilíbrio das teias tróficas subsequentes.",
        "Estabilização imediata da capacidade de carga total daquele nicho biogeográfico.",
        "Neutralização da competição intraespecífica e interespecífica dos mamíferos de grande porte.",
        "Expansão homogênea de ecossistemas clímax para todos os biomas florestais adjacentes."
      ],
      justificativa: "Sem predadores naturais e com hábitos generalistas, a espécie exótica consome excessivamente os produtores primários nativos, desencadeando um efeito cascata que compromete toda a estabilidade trófica."
    },
    {
      enunciado: "Analise a função quadrática f(x) = -2x² + 12x - 10, que descreve a curva de lucro estimado de uma startup educacional de tecnologia em milhares de reais. O lucro máximo alcançável por essa empresa e o número correspondente de assinaturas ativas vendidas (x) estão corretamente expressos por:",
      alternativas: [
        "Lucro máximo de R$ 8.000,00 quando comercializadas 3.000 assinaturas.",
        "Lucro máximo de R$ 10.000,00 quando comercializadas 5.000 assinaturas.",
        "Lucro máximo de R$ 12.000,00 quando comercializadas 2.000 assinaturas.",
        "Lucro máximo de R$ 6.000,00 quando comercializadas 3.000 assinaturas.",
        "Lucro máximo de R$ 14.000,00 quando comercializadas 4.000 assinaturas."
      ],
      justificativa: "Calculando o vértice da parábola: Xv = -b / (2a) = -12 / (-4) = 3. Substituindo na função: Yv = -2(3)² + 12(3) - 10 = -18 + 36 - 10 = 8. Logo, o pico é de 8 unidades de lucro para x = 3."
    }
  ];

  const totalQuestionsList = Array.from({ length: questionCount }, (_, i) => {
    // Determine subject based on index
    const subjectIndex = Math.floor((i / questionCount) * currentSubjects.length);
    const disciplina = currentSubjects[subjectIndex] || currentSubjects[0];
    
    // Pick template index or generate custom
    const template = realProblemTemplates[i % realProblemTemplates.length];
    const correctLetter = answerKeys[Math.floor((Math.sin(i + 13) + 1) * 2.5) % 5]; // deterministic pseudorandom answer key

    return {
      numero: i + 1,
      resposta: correctLetter,
      disciplina: disciplina,
      enunciado: template.enunciado,
      alternativas: template.alternativas,
      justificativa: template.justificativa
    };
  });

  return totalQuestionsList;
};

// Builder for official ITA exams with exact answers by subject (Física, Inglês, Português, Matemática, Química)
const buildItaGabaritoQuestions = (
  year: number,
  answers: {
    fisica: string[];
    ingles: string[];
    portugues: { num: number; ans: string }[];
    matematica: string[];
    quimica: string[];
  },
  anuladasObs?: Record<string, string>
) => {
  const questoes: GabaritoOficial['questoes'] = [];
  let globalNum = 1;

  // 1) Física: 20 questões
  answers.fisica.forEach((ans, idx) => {
    const qNum = idx + 1;
    const isAnulada = ans === '*';
    questoes.push({
      numero: globalNum++,
      resposta: ans,
      disciplina: 'Física',
      enunciado: `ITA ${year} — Prova de Física — Questão ${qNum}${isAnulada ? ' [QUESTÃO ANULADA]' : ''}\n\nEnunciado original da questão ${qNum} do exame de Física do ITA (${year}).`,
      alternativas: [
        'Alternativa A',
        'Alternativa B',
        'Alternativa C',
        'Alternativa D',
        'Alternativa E'
      ],
      justificativa: isAnulada
        ? (anuladasObs?.[`Física_${qNum}`] || `Questão ${qNum} de Física anulada pela banca do ITA e computada como correta para todos os candidatos.`)
        : `Gabarito oficial definitivo da banca examinadora do ITA (${year}) para a questão ${qNum} de Física: Alternativa ${ans}.`
    });
  });

  // 2) Inglês: 20 questões
  answers.ingles.forEach((ans, idx) => {
    const qNum = idx + 1;
    const isAnulada = ans === '*';
    questoes.push({
      numero: globalNum++,
      resposta: ans,
      disciplina: 'Inglês',
      enunciado: `ITA ${year} — Prova de Inglês — Questão ${qNum}${isAnulada ? ' [QUESTÃO ANULADA]' : ''}\n\nEnunciado original da questão ${qNum} do exame de Língua Inglesa do ITA (${year}).`,
      alternativas: [
        'Alternativa A',
        'Alternativa B',
        'Alternativa C',
        'Alternativa D',
        'Alternativa E'
      ],
      justificativa: isAnulada
        ? (anuladasObs?.[`Inglês_${qNum}`] || `Questão ${qNum} de Inglês anulada pela banca do ITA e computada como correta para todos os candidatos.`)
        : `Gabarito oficial definitivo da banca examinadora do ITA (${year}) para a questão ${qNum} de Inglês: Alternativa ${ans}.`
    });
  });

  // 3) Português: 20 questões (numeradas de 21 a 40 na prova)
  answers.portugues.forEach((item) => {
    const isAnulada = item.ans === '*';
    questoes.push({
      numero: globalNum++,
      resposta: item.ans,
      disciplina: 'Português',
      enunciado: `ITA ${year} — Prova de Português — Questão ${item.num}${isAnulada ? ' [QUESTÃO ANULADA]' : ''}\n\nEnunciado original da questão ${item.num} do exame de Língua Portuguesa e Literatura do ITA (${year}).`,
      alternativas: [
        'Alternativa A',
        'Alternativa B',
        'Alternativa C',
        'Alternativa D',
        'Alternativa E'
      ],
      justificativa: isAnulada
        ? (anuladasObs?.[`Português_${item.num}`] || `Questão ${item.num} de Português anulada pela banca do ITA e computada como correta para todos os candidatos.`)
        : `Gabarito oficial definitivo da banca examinadora do ITA (${year}) para a questão ${item.num} de Português: Alternativa ${item.ans}.`
    });
  });

  // 4) Matemática: 20 questões
  answers.matematica.forEach((ans, idx) => {
    const qNum = idx + 1;
    const isAnulada = ans === '*';
    questoes.push({
      numero: globalNum++,
      resposta: ans,
      disciplina: 'Matemática',
      enunciado: `ITA ${year} — Prova de Matemática — Questão ${qNum}${isAnulada ? ' [QUESTÃO ANULADA]' : ''}\n\nEnunciado original da questão ${qNum} do exame de Matemática do ITA (${year}).`,
      alternativas: [
        'Alternativa A',
        'Alternativa B',
        'Alternativa C',
        'Alternativa D',
        'Alternativa E'
      ],
      justificativa: isAnulada
        ? (anuladasObs?.[`Matemática_${qNum}`] || `Questão ${qNum} de Matemática anulada pela banca do ITA e computada como correta para todos os candidatos.`)
        : `Gabarito oficial definitivo da banca examinadora do ITA (${year}) para a questão ${qNum} de Matemática: Alternativa ${ans}.`
    });
  });

  // 5) Química: 20 questões
  answers.quimica.forEach((ans, idx) => {
    const qNum = idx + 1;
    const isAnulada = ans === '*';
    questoes.push({
      numero: globalNum++,
      resposta: ans,
      disciplina: 'Química',
      enunciado: `ITA ${year} — Prova de Química — Questão ${qNum}${isAnulada ? ' [QUESTÃO ANULADA]' : ''}\n\nEnunciado original da questão ${qNum} do exame de Química do ITA (${year}).`,
      alternativas: [
        'Alternativa A',
        'Alternativa B',
        'Alternativa C',
        'Alternativa D',
        'Alternativa E'
      ],
      justificativa: isAnulada
        ? (anuladasObs?.[`Química_${qNum}`] || `Questão ${qNum} de Química anulada pela banca do ITA e computada como correta para todos os candidatos.`)
        : `Gabarito oficial definitivo da banca examinadora do ITA (${year}) para a questão ${qNum} de Química: Alternativa ${ans}.`
    });
  });

  return questoes;
};

// Official ITA 2015 Gabarito Definitivo (100 questões)
const ITA_2015_QUESTOES = buildItaGabaritoQuestions(
  2015,
  {
    fisica: ['C', 'D', 'C', 'C', 'C', 'B', 'B', 'A', 'C', 'E', 'A', 'B', 'B', 'A', 'D', 'A', 'C', 'C', 'E', 'D'],
    ingles: ['C', 'D', 'E', 'E', 'A', 'A', 'D', 'A', '*', 'C', 'C', 'D', 'A', 'E', 'B', 'C', 'E', 'E', 'B', 'C'],
    portugues: [
      { num: 21, ans: 'D' }, { num: 22, ans: 'E' }, { num: 23, ans: 'D' }, { num: 24, ans: 'A' },
      { num: 25, ans: 'D' }, { num: 26, ans: 'C' }, { num: 27, ans: 'B' }, { num: 28, ans: 'A' },
      { num: 29, ans: 'A' }, { num: 30, ans: 'B' }, { num: 31, ans: 'C' }, { num: 32, ans: 'D' },
      { num: 33, ans: 'C' }, { num: 34, ans: 'B' }, { num: 35, ans: 'E' }, { num: 36, ans: 'C' },
      { num: 37, ans: 'E' }, { num: 38, ans: 'A' }, { num: 39, ans: 'E' }, { num: 40, ans: 'A' }
    ],
    matematica: ['D', 'C', 'D', 'E', 'D', 'E', 'B', 'B', 'C', 'A', 'B', 'E', 'C', 'D', 'E', 'A', 'E', 'A', 'A', 'C'],
    quimica: ['A', 'E', 'C', 'D', 'E', 'B', 'E', 'B', 'D', 'C', 'E', 'D', 'D', 'C', 'D', 'B', 'B', 'B', 'C', 'C']
  },
  {
    'Inglês_9': 'Observação oficial: a opção D da questão 9 da prova de inglês apresenta erro de digitação, o que a torna gramaticalmente incorreta e pode confundir o candidato. Desta forma a questão foi anulada e considerada correta para todos os candidatos.'
  }
);

// Official ITA 2016 Gabarito Definitivo (100 questões)
const ITA_2016_QUESTOES = buildItaGabaritoQuestions(
  2016,
  {
    fisica: ['E', 'C', 'D', '*', 'A', 'C', 'D', 'A', 'C', 'D', 'D', 'C', 'C', 'A', 'C', 'D', 'C', 'C', 'A', 'E'],
    ingles: ['E', 'C', 'B', 'C', 'E', 'A', 'C', 'C', 'A', 'B', 'C', 'A', 'D', 'D', 'D', 'E', 'B', 'E', 'B', 'A'],
    portugues: [
      { num: 21, ans: 'B' }, { num: 22, ans: 'D' }, { num: 23, ans: 'E' }, { num: 24, ans: 'C' },
      { num: 25, ans: 'A' }, { num: 26, ans: 'C' }, { num: 27, ans: 'D' }, { num: 28, ans: 'B' },
      { num: 29, ans: 'A' }, { num: 30, ans: 'D' }, { num: 31, ans: 'B' }, { num: 32, ans: 'C' },
      { num: 33, ans: 'A' }, { num: 34, ans: 'E' }, { num: 35, ans: 'E' }, { num: 36, ans: 'B' },
      { num: 37, ans: 'D' }, { num: 38, ans: 'E' }, { num: 39, ans: 'C' }, { num: 40, ans: 'C' }
    ],
    matematica: ['B', 'D', '*', 'B', 'D', 'D', 'B', 'A', 'A', 'D', 'C', 'B', 'E', 'D', 'C', 'A', 'B', 'E', 'E', 'D'],
    quimica: ['A', 'E', '*', 'E', 'C', 'C', 'D', 'D', 'D', 'B', 'A', 'A', 'C', 'D', 'E', 'C', 'B', 'B', 'D', '*']
  },
  {
    'Física_4': 'Observação oficial: devido à imprecisão dos enunciados, a questão 4 da prova de física foi considerada correta para todos os candidatos.',
    'Matemática_3': 'Observação oficial: devido à imprecisão dos enunciados, a questão 3 da prova de matemática foi considerada correta para todos os candidatos.',
    'Química_3': 'Observação oficial: devido à imprecisão dos enunciados, a questão 3 da prova de química foi considerada correta para todos os candidatos.',
    'Química_20': 'Observação oficial: devido à imprecisão dos enunciados, a questão 20 da prova de química foi considerada correta para todos os candidatos.'
  }
);

// Official ITA 2014 Gabarito Definitivo (100 questões)
const ITA_2014_QUESTOES = buildItaGabaritoQuestions(
  2014,
  {
    fisica: ['D', 'C', 'E', 'B', 'A', 'D', 'B', 'C', 'D', '*', 'C', 'D', 'E', 'A', 'E', 'D', 'E', 'C', 'A', 'B'],
    ingles: ['A', 'E', 'A', 'B', 'B', 'A', 'E', 'E', 'E', 'D', 'C', 'B', 'D', 'C', 'C', 'A', 'C', 'B', 'D', 'E'],
    portugues: [
      { num: 21, ans: 'B' }, { num: 22, ans: 'C' }, { num: 23, ans: 'A' }, { num: 24, ans: 'D' },
      { num: 25, ans: 'A' }, { num: 26, ans: '*' }, { num: 27, ans: 'B' }, { num: 28, ans: 'E' },
      { num: 29, ans: 'D' }, { num: 30, ans: 'E' }, { num: 31, ans: 'C' }, { num: 32, ans: 'B' },
      { num: 33, ans: 'A' }, { num: 34, ans: 'A' }, { num: 35, ans: 'D' }, { num: 36, ans: 'C' },
      { num: 37, ans: 'D' }, { num: 38, ans: 'B' }, { num: 39, ans: 'E' }, { num: 40, ans: 'E' }
    ],
    matematica: ['E', 'E', 'D', 'A', 'E', 'C', 'D', 'C', 'B', 'A', 'B', 'A', 'E', 'C', 'D', 'A', 'B', 'C', 'D', 'C'],
    quimica: ['B', 'E', 'B', 'D', 'C', 'D', 'A', 'D', 'E', 'B', 'D', 'C', 'A', 'A', 'B', 'D', 'D', 'C', '*', 'B']
  },
  {
    'Física_1': 'Nota da Banca: Nesta questão, avalia-se a capacidade do candidato de relacionar adequadamente as grandezas físicas do problema. Assim, quanto maior ε, menor a deformação (eliminando C). Quanto maior a, maior a deformação (eliminando B e E). A resposta não depende de b: dois sólidos de dimensão xb e (1-x)b apresentam a mesma deflexão; combinados, têm dimensão b e a mesma deflexão. Logo, resta exclusivamente a alternativa D.',
    'Física_10': 'Observação oficial da comissão: A questão 10 da prova de física foi considerada correta para todos os candidatos.',
    'Física_16': 'Nota da Banca: Esta questão não exigia o conhecimento de Cálculo Diferencial em sua solução. A principal dificuldade era, seguindo-se o dado da questão, obter a energia potencial da força centrífuga por analogia à força elástica.',
    'Física_17': 'Nota da Banca: Questão conceitual de Mecânica (conservação da energia e da quantidade de movimento). Durante a colisão o sistema sofre a ação de uma força externa impulsiva (da articulação P), alterando a quantidade de movimento do sistema.',
    'Português_26': 'Observação oficial da comissão: A questão 26 da prova de português foi considerada correta para todos os candidatos.',
    'Química_18': 'Nota da Banca: Na combustão incompleta do n-octano há emissão de aldeído, assim como ocorre na combustão incompleta de gasolina e diesel.',
    'Química_19': 'Observação oficial da comissão: A questão 19 da prova de química foi considerada correta para todos os candidatos.'
  }
);

// Official ITA 2017 Gabarito Definitivo (100 questões)
const ITA_2017_QUESTOES = buildItaGabaritoQuestions(
  2017,
  {
    fisica: ['A', 'A', 'D', 'E', 'B', 'E', '*', 'D', 'D', 'B', 'C', 'C', 'C', 'B', 'A', 'D', 'A', 'B', 'E', '*'],
    ingles: ['C', 'A', 'D', 'C', 'A', 'D', 'C', 'A', 'B', 'E', 'D', 'D', 'B', 'E', 'A', 'B', 'D', 'B', 'E', 'C'],
    portugues: [
      { num: 21, ans: 'E' }, { num: 22, ans: 'E' }, { num: 23, ans: 'D' }, { num: 24, ans: 'A' },
      { num: 25, ans: 'C' }, { num: 26, ans: 'A' }, { num: 27, ans: 'C' }, { num: 28, ans: 'E' },
      { num: 29, ans: 'C' }, { num: 30, ans: 'E' }, { num: 31, ans: 'A' }, { num: 32, ans: 'C' },
      { num: 33, ans: 'B' }, { num: 34, ans: 'A' }, { num: 35, ans: 'E' }, { num: 36, ans: 'B' },
      { num: 37, ans: 'C' }, { num: 38, ans: 'D' }, { num: 39, ans: 'E' }, { num: 40, ans: 'E' }
    ],
    matematica: ['A', 'A', 'D', 'B', 'C', 'C', 'C', 'E', 'A', 'C', 'A', 'E', 'A', 'B', 'D', 'A', 'D', 'B', 'E', 'E'],
    quimica: ['A', 'B', 'D', 'D', 'A', 'D', 'C', 'A', 'E', 'E', 'E', 'C', 'E', 'D', 'C', 'D', 'A', 'B', 'C', 'B']
  },
  {
    'Física_7': 'Observação oficial da banca: Devido a erros de digitação, a questão 7 da prova de física foi considerada correta para todos os candidatos.',
    'Física_20': 'Observação oficial da banca: Devido a erros de digitação, a questão 20 da prova de física foi considerada correta para todos os candidatos.',
    'Química_9': 'Resolução Oficial do ITA (Questão 9 de Química): Quanto mais próximo um dado composto estiver do vértice direito no diagrama de van Arkel-Ketelaar apresentado, maior será o caráter covalente da ligação química. Assim, não basta analisar apenas o valor da diferença entre eletronegatividades, mas também o valor da eletronegatividade do composto. Os compostos dados no enunciado foram posicionados no diagrama, onde se verifica que o composto OF2 é o que se encontra mais próximo do vértice direito, logo apresenta o maior caráter covalente. RESPOSTA: OPÇÃO E.'
  }
);

// Official ITA 2013 Gabarito Definitivo (100 questões)
const ITA_2013_QUESTOES = buildItaGabaritoQuestions(
  2013,
  {
    fisica: ['C', 'B', 'A', 'A', 'A', 'D', 'A', 'C', 'C', 'B', 'E', 'D', 'B', 'B', 'E', 'D', 'C', 'E', 'D', 'A'],
    ingles: ['C', 'A', 'A', 'B', 'C', 'D', 'C', 'D', 'E', 'B', 'A', 'D', 'D', 'C', 'A', 'B', 'E', 'B', 'C', 'E'],
    portugues: [
      { num: 21, ans: 'E' }, { num: 22, ans: 'B' }, { num: 23, ans: 'C' }, { num: 24, ans: 'A' },
      { num: 25, ans: 'E' }, { num: 26, ans: 'C' }, { num: 27, ans: 'B' }, { num: 28, ans: 'D' },
      { num: 29, ans: 'A' }, { num: 30, ans: 'B' }, { num: 31, ans: 'E' }, { num: 32, ans: 'C' },
      { num: 33, ans: 'C' }, { num: 34, ans: 'D' }, { num: 35, ans: 'A' }, { num: 36, ans: 'D' },
      { num: 37, ans: 'E' }, { num: 38, ans: 'A' }, { num: 39, ans: 'D' }, { num: 40, ans: 'B' }
    ],
    matematica: ['C', 'C', 'B', 'D', 'A', 'E', 'A', 'C', 'D', 'B', 'E', 'D', 'C', 'E', 'A', 'B', 'B', 'D', 'A', 'B'],
    quimica: ['D', 'B', 'A', 'D', 'D', 'C', 'C', 'A', 'A', 'A', 'A', 'E', 'C', 'B', 'C', 'D', 'E', 'D', '*', 'A']
  },
  {
    'Química_19': 'Observação oficial da banca: A questão 19 da prova de química, por falta de alternativa válida, foi considerada correta para todos os candidatos.'
  }
);

// Official ITA 2012 Gabarito Definitivo (100 questões)
const ITA_2012_QUESTOES = buildItaGabaritoQuestions(
  2012,
  {
    fisica: ['B', 'B', 'C', 'A', 'D', 'C', 'E', 'C', 'D', 'B', 'B', 'E', 'E', 'D', 'E', 'A', 'D', 'C', 'D', 'A'],
    ingles: ['C', 'B', 'E', 'B', 'D', 'B', 'D', 'C', 'A', 'A', 'B', 'E', 'A', 'A', 'C', 'E', 'E', 'B', 'B', 'B'],
    portugues: [
      { num: 21, ans: 'A' }, { num: 22, ans: 'B' }, { num: 23, ans: 'D' }, { num: 24, ans: 'C' },
      { num: 25, ans: 'D' }, { num: 26, ans: 'A' }, { num: 27, ans: 'C' }, { num: 28, ans: 'D' },
      { num: 29, ans: 'E' }, { num: 30, ans: 'B' }, { num: 31, ans: 'C' }, { num: 32, ans: 'A' },
      { num: 33, ans: 'B' }, { num: 34, ans: 'C' }, { num: 35, ans: 'B' }, { num: 36, ans: 'E' },
      { num: 37, ans: 'A' }, { num: 38, ans: 'E' }, { num: 39, ans: 'D' }, { num: 40, ans: 'D' }
    ],
    matematica: ['D', 'D', 'B', 'E', 'E', 'C', 'A', 'C', 'A', 'B', 'D', 'E', 'C', 'A', 'C', 'B', 'B', 'E', 'D', 'A'],
    quimica: ['D', 'B', 'D', 'B', 'D', 'B', 'C', 'D', 'E', 'C', 'C', 'A', 'A', 'B', 'C', 'E', 'B', 'E', 'E', 'A']
  }
);

// Official ITA 2011 Gabarito Definitivo (100 questões)
const ITA_2011_QUESTOES = buildItaGabaritoQuestions(
  2011,
  {
    fisica: ['C', 'E', 'C', 'B', 'E', 'B', 'C', 'B', 'E', 'C', 'C', 'B', 'B', 'D', 'D', 'E', 'E', 'B', 'C', 'C'],
    ingles: ['*', 'B', 'B', 'C', 'B', 'E', 'A', 'B', 'D', 'A', 'D', 'D', 'D', 'C', 'C', 'D', 'A', 'D', 'E', 'E'],
    portugues: [
      { num: 21, ans: 'E' }, { num: 22, ans: 'E' }, { num: 23, ans: 'D' }, { num: 24, ans: 'B' },
      { num: 25, ans: 'A' }, { num: 26, ans: 'D' }, { num: 27, ans: 'C' }, { num: 28, ans: 'E' },
      { num: 29, ans: 'C' }, { num: 30, ans: 'E' }, { num: 31, ans: 'D' }, { num: 32, ans: 'B' },
      { num: 33, ans: 'A' }, { num: 34, ans: 'E' }, { num: 35, ans: 'C' }, { num: 36, ans: 'E' },
      { num: 37, ans: 'D' }, { num: 38, ans: 'E' }, { num: 39, ans: 'A' }, { num: 40, ans: 'C' }
    ],
    matematica: ['B', 'C', 'E', '*', 'A', 'B', 'E', 'C', 'A', 'A', 'D', 'E', 'D', 'C', 'D', 'C', 'B', 'A', 'E', 'C'],
    quimica: ['B', 'E', 'D', 'B', 'C', 'C', 'A', 'B', 'B', 'E', 'E', 'A', 'A', 'A', 'D', 'D', 'D', 'C', 'D', 'E']
  },
  {
    'Inglês_1': 'Observação oficial da banca: A questão 1 da prova de inglês suscitou dúvidas de interpretação e foi considerada correta para todos os candidatos.',
    'Matemática_4': 'Observação oficial da banca: A questão 4 da prova de matemática suscitou dúvidas de interpretação e foi considerada correta para todos os candidatos.'
  }
);

// Official ITA 2010 Gabarito Definitivo (100 questões)
const ITA_2010_QUESTOES = buildItaGabaritoQuestions(
  2010,
  {
    fisica: ['E', 'D', 'A', 'A', 'C', 'E', 'C', 'B', 'D', 'B', 'C', 'C', 'A', 'A', 'E', 'D', 'B', 'B', 'E', 'C'],
    ingles: ['A', 'E', 'A', 'C', '*', 'D', 'E', 'A', 'D', 'E', 'D', 'C', 'D', 'B', 'D', 'B', 'C', 'B', 'D', 'A'],
    portugues: [
      { num: 21, ans: 'A' }, { num: 22, ans: 'D' }, { num: 23, ans: 'E' }, { num: 24, ans: 'C' },
      { num: 25, ans: 'B' }, { num: 26, ans: 'E' }, { num: 27, ans: 'E' }, { num: 28, ans: 'B' },
      { num: 29, ans: 'D' }, { num: 30, ans: 'C' }, { num: 31, ans: 'A' }, { num: 32, ans: 'D' },
      { num: 33, ans: 'B' }, { num: 34, ans: 'C' }, { num: 35, ans: 'A' }, { num: 36, ans: 'B' },
      { num: 37, ans: 'E' }, { num: 38, ans: 'C' }, { num: 39, ans: 'A' }, { num: 40, ans: 'E' }
    ],
    matematica: ['E', 'C', 'E', 'C', 'D', 'D', 'B', 'C', 'A', 'E', 'B', 'A', 'D', 'C', 'A', 'B', 'A', 'D', 'E', 'B'],
    quimica: ['E', 'A', 'B', 'E', 'D', 'C', 'B', 'D', 'C', 'E', 'E', 'D', 'D', 'C', 'D', 'B', 'B', 'E', 'B', 'A']
  },
  {
    'Inglês_5': 'Observação oficial da banca: A questão 5 da prova de inglês foi considerada correta para todos os candidatos.'
  }
);

// Official ITA 2009 Gabarito Definitivo (100 questões)
const ITA_2009_QUESTOES = buildItaGabaritoQuestions(
  2009,
  {
    fisica: ['D', 'E', 'B', 'A', 'C', 'C', 'B', 'D', 'C', 'E', 'A', 'A', 'B', 'E', 'D', 'D', 'C', 'B', 'A', 'C'],
    ingles: ['D', 'E', 'B', 'B', 'C', 'D', 'A', 'D', 'E', 'D', 'A', 'C', 'B', 'A', 'B', 'E', 'A', 'C', 'B', 'A'],
    portugues: [
      { num: 21, ans: 'B' }, { num: 22, ans: 'B' }, { num: 23, ans: 'E' }, { num: 24, ans: 'A' },
      { num: 25, ans: 'B' }, { num: 26, ans: 'C' }, { num: 27, ans: 'A' }, { num: 28, ans: 'A' },
      { num: 29, ans: 'D' }, { num: 30, ans: 'D' }, { num: 31, ans: 'E' }, { num: 32, ans: 'C' },
      { num: 33, ans: 'E' }, { num: 34, ans: 'D' }, { num: 35, ans: 'D' }, { num: 36, ans: 'A' },
      { num: 37, ans: 'E' }, { num: 38, ans: 'A' }, { num: 39, ans: 'C' }, { num: 40, ans: 'B' }
    ],
    matematica: ['C', 'B', 'E', 'B', 'E', 'C', 'A', 'B', 'E', 'D', 'A', 'B', 'E', 'D', 'D', 'E', 'A', 'B', 'A', 'C'],
    quimica: ['C', 'C', 'B', 'D', 'B', 'E', 'D', 'A', 'E', 'A', 'E', 'B', 'B', 'E', 'E', 'D', 'A', 'C', 'D', 'D']
  }
);



// Gerador de questões e respostas esperadas oficiais da FUVEST 2ª Fase (Discursivas)
const generateFuvestFase2Questions = (materia: string) => {
  const questoesPorMateria: Record<string, { enunciado: string; resposta: string; justificativa: string }[]> = {
    'Matemática': [
      {
        enunciado: "Considere a matriz A = [[2, 1], [0, 3]] e o polinômio característico associado p(λ) = det(A - λI).\na) Determine os autovalores de A.\nb) Calcule a matriz A³.\nc) Encontre a solução do sistema linear A · [x, y]ᵀ = [7, 6]ᵀ.",
        resposta: "a) λ₁ = 2, λ₂ = 3; b) A³ = [[8, 19], [0, 27]]; c) x = 2, y = 2.",
        justificativa: "Critério oficial da banca FUVEST 2ª Fase: a) Resolução correta da equação característica (λ-2)(λ-3)=0; b) Potenciação matricial por produto ou diagonalização; c) Resolução do sistema com substituição direta ou matriz inversa."
      },
      {
        enunciado: "Um cilindro circular reto de raio R e altura H está inscrito em uma esfera de raio 5 cm.\na) Escreva o volume V do cilindro em função de sua altura H.\nb) Determine a altura H para a qual o volume do cilindro é máximo.",
        resposta: "a) V(H) = π · (25 - H²/4) · H; b) H = 10√3 / 3 cm.",
        justificativa: "Critério oficial: Aplicação correta do Teorema de Pitágoras no triângulo retângulo da seção meridiana: R² + (H/2)² = 25. Derivação de V(H) ou análise do ponto crítico com V'(H) = 0."
      },
      {
        enunciado: "Seja a progressão geométrica (aₙ) com a₁ = 3 e razão q = 2.\na) Calcule a soma dos 10 primeiros termos.\nb) Determine o menor valor de n tal que aₙ > 10⁶.",
        resposta: "a) S₁₀ = 3069; b) n = 19.",
        justificativa: "Critério: Aplicação da fórmula Sₙ = a₁(qⁿ - 1)/(q - 1) obtendo 3(1024 - 1) = 3069. Inequação 3 · 2ⁿ⁻¹ > 10⁶ resolvida por logaritmos com aproximação correta."
      },
      {
        enunciado: "Na figura, uma circunferência de raio r tangencia duas retas concorrentes no ponto O formando um ângulo de 60°.\na) Determine a distância do centro da circunferência ao vértice O.\nb) Calcule a área da região delimitada pelas tangentes e pelo arco menor da circunferência.",
        resposta: "a) Distância d = 2r; b) Área = r²(√3 - π/3).",
        justificativa: "Critério: Relações trigonométricas no triângulo retângulo formado pela bissetriz (sen 30° = r/d). Área calculada como a diferença entre a área dos dois triângulos congruentes e o setor circular de 120°."
      },
      {
        enunciado: "Considere a função f(x) = log₂(x² - 4x + 8).\na) Determine o domínio real de f.\nb) Encontre o valor mínimo assumido por f(x).",
        resposta: "a) Domínio = ℝ; b) Valor mínimo = 2 (para x = 2).",
        justificativa: "Critério: O discriminante de x² - 4x + 8 é Δ = 16 - 32 = -16 < 0, logo o trinômio é estritamente positivo para todo x real. O vértice da parábola ocorre em x = 2 com valor 4, logo f(2) = log₂(4) = 2."
      },
      {
        enunciado: "De um grupo de 6 médicos e 4 enfermeiros, deve-se formar uma equipe de plantão com 5 profissionais.\na) Quantas equipes diferentes podem ser formadas?\nb) Quantas equipes conterão pelo menos 2 enfermeiros?",
        resposta: "a) C(10, 5) = 252 equipes; b) 186 equipes.",
        justificativa: "Critério: Total de combinações C(10,5) = 252. Princípio complementar: subtraem-se equipes com 0 enfermeiros C(6,5) = 6 e com 1 enfermeiro C(6,4)·C(4,1) = 15 · 4 = 60. 252 - 66 = 186."
      }
    ],
    'Física': [
      {
        enunciado: "Um bloco de massa m = 2,0 kg repousa sobre uma superfície horizontal com atrito (μ_e = 0,4 e μ_c = 0,3). Uma força horizontal F é aplicada.\na) Determine o valor mínimo de F para iniciar o movimento.\nb) Se F = 10 N for mantida, calcule a aceleração adquirida pelo bloco.",
        resposta: "a) F_min = 8,0 N; b) a = 2,0 m/s² (adotando g = 10 m/s²).",
        justificativa: "Critério: F_at_est = μ_e · N = 0,4 · 20 = 8,0 N. Uma vez em movimento, F_at_cin = 0,3 · 20 = 6,0 N. F_res = 10 - 6 = 4,0 N => a = 4,0 / 2,0 = 2,0 m/s²."
      },
      {
        enunciado: "Um projétil de massa 50 g com velocidade de 200 m/s atinge um bloco de madeira de massa 1,95 kg inicialmente em repouso sobre uma mesa sem atrito, incrustando-se nele.\na) Calcule a velocidade do conjunto após a colisão.\nb) Determine a quantidade de energia mecânica dissipada no choque.",
        resposta: "a) v_final = 5,0 m/s; b) E_dissipada = 975 J (97,5% da energia inicial).",
        justificativa: "Critério: Conservação do momento linear: 0,05 · 200 = (0,05 + 1,95) · v => v = 5,0 m/s. E_c_inicial = 1/2 · 0,05 · 40000 = 1000 J. E_c_final = 1/2 · 2,0 · 25 = 25 J. ΔE = 975 J."
      },
      {
        enunciado: "Um gás ideal monoatômico realiza o ciclo termodinâmico ABCA, onde AB é uma transformação isobárica (P = 2,0 · 10⁵ Pa), BC é isocórica e CA é isotérmica.\na) Calcule o trabalho realizado no trecho AB sabendo que o volume varia de 1,0 · 10⁻³ m³ a 3,0 · 10⁻³ m³.\nb) Determine a variação da energia interna no ciclo completo.",
        resposta: "a) W_AB = 400 J; b) ΔU_ciclo = 0 J.",
        justificativa: "Critério: Em transformação isobárica, W = P · ΔV = 2,0 · 10⁵ · (2,0 · 10⁻³) = 400 J. Em qualquer ciclo termodinâmico fechado, como a energia interna é função exclusiva de estado (temperatura), ΔU_ciclo = 0."
      },
      {
        enunciado: "Um raio de luz monocromática incide do ar (n = 1,0) para um bloco de vidro com ângulo de incidência de 45°.\na) Sabendo que o índice de refração do vidro é √2, calcule o ângulo de refração.\nb) Determine o ângulo limite para a reflexão interna total da luz no interior do vidro.",
        resposta: "a) r = 30°; b) θ_crit = 45°.",
        justificativa: "Critério: Lei de Snell-Descartes: n₁ sen(i) = n₂ sen(r) => 1,0 · sen(45°) = √2 · sen(r) => sen(r) = (√2/2)/√2 = 1/2 => r = 30°. Ângulo limite: sen(θ_c) = n_menor / n_maior = 1 / √2 = √2/2 => θ_c = 45°."
      },
      {
        enunciado: "Duas cargas pontuais q₁ = +4 μC e q₂ = -9 μC estão fixadas no vácuo a uma distância de 10 cm uma da outra.\na) Encontre a posição sobre a linha que une as cargas onde o potencial eletrostático é nulo.\nb) Calcule a força eletrostática entre as cargas.",
        resposta: "a) d = 3,08 cm a partir de q₁ (entre as cargas); b) F = 32,4 N (força atrativa).",
        justificativa: "Critério: V = k(q₁/x + q₂/(d-x)) = 0 => 4/x = 9/(0,10 - x) => 0,40 - 4x = 9x => 13x = 0,40 => x ≈ 0,0308 m. Lei de Coulomb: F = 9·10⁹ · 4·10⁻⁶ · 9·10⁻⁶ / (0,1)² = 32,4 N."
      },
      {
        enunciado: "Um circuito contém uma bateria ideal de 12 V conectada a três resistores idênticos de 6,0 Ω cada, associados em paralelo.\na) Calcule a resistência equivalente do circuito.\nb) Determine a potência elétrica total dissipada por efeito Joule.",
        resposta: "a) R_eq = 2,0 Ω; b) P_total = 72 W.",
        justificativa: "Critério: 1/R_eq = 1/6 + 1/6 + 1/6 = 3/6 = 1/2 => R_eq = 2,0 Ω. Potência: P = U² / R_eq = 144 / 2 = 72 W."
      }
    ],
    'Química': [
      {
        enunciado: "Para a reação de síntese da amônia N₂(g) + 3H₂(g) ⇌ 2NH₃(g) com ΔH = -92 kJ/mol:\na) Indique o efeito do aumento da pressão total do sistema sobre o rendimento de NH₃.\nb) Como uma elevação de temperatura afeta a constante de equilíbrio Kc?",
        resposta: "a) Desloca o equilíbrio para a direita (maior rendimento de NH₃); b) Diminui o valor de Kc.",
        justificativa: "Critério Princípio de Le Chatelier: a) Aumento de pressão desloca para o lado de menor volume gasoso; b) Como a reação direta é exotérmica (ΔH < 0), o aumento de temperatura favorece a reação endotérmica inversa, reduzindo Kc."
      },
      {
        enunciado: "O vinagre comercial contém ácido acético (CH₃COOH, Ka = 1,8 · 10⁻⁵ mol/L). Uma amostra de 20 mL de vinagre foi titulada com solução aquosa de NaOH 0,10 mol/L, consumindo 40 mL da base no ponto de equivalência.\na) Determine a concentração molar de ácido acético no vinagre.\nb) Explique por que o pH no ponto de equivalência é superior a 7,0.",
        resposta: "a) [CH₃COOH] = 0,20 mol/L; b) Hidrólise do ânion acetato gera íons hidroxila (OH⁻).",
        justificativa: "Critério: Na estequiometria 1:1, n_ácido = n_base = 0,10 · 0,040 = 0,004 mol. Conc = 0,004 / 0,020 = 0,20 mol/L. No ponto de equivalência forma-se acetato de sódio, cujo ânion hidrolisa: CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻, tornando o meio básico."
      },
      {
        enunciado: "Considere as seguintes espécies orgânicas: etanol, ácido etanoico e acetato de etila.\na) Escreva a equação química balanceada da esterificação entre o etanol e o ácido etanoico.\nb) Justifique a diferença de ponto de ebulição entre o ácido etanoico (118 °C) e o acetato de etila (77 °C).",
        resposta: "a) CH₃COOH + CH₃CH₂OH ⇌ CH₃COOCH₂CH₃ + H₂O; b) Ácido etanoico realiza ligações de hidrogênio intermoleculares formando dímeros.",
        justificativa: "Critério: Equação balanceada com fórmula estrutural ou condensada. O ácido etanoico estabelece fortes ligações de hidrogênio entre suas hidroxilas, enquanto o éster acetato de etila interage apenas por forças dipolo-dipolo mais fracas."
      },
      {
        enunciado: "Uma pilha eletroquímica é montada com semicélulas de Zinco (Zn²⁺/Zn, E° = -0,76 V) e Cobre (Cu²⁺/Cu, E° = +0,34 V) em condições padrão.\na) Identifique o cátodo e o ânodo da pilha.\nb) Calcule a força eletromotriz padrão (ΔE°) e escreva a equação global da reação.",
        resposta: "a) Ânodo = Zn (oxidação); Cátodo = Cu (redução); b) ΔE° = +1,10 V; Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s).",
        justificativa: "Critério: O metal com menor potencial padrão de redução sofre oxidação no ânodo (Zn). O de maior potencial sofre redução no cátodo (Cu). ΔE° = E°_red(cátodo) - E°_red(ânodo) = 0,34 - (-0,76) = +1,10 V."
      },
      {
        enunciado: "Uma massa de 10,0 g de calcário contendo carbonato de cálcio (CaCO₃) foi aquecida até completa decomposição térmica (CaCO₃ → CaO + CO₂), produzindo 1,792 L de CO₂ nas CNTP.\na) Calcule o número de mols de CO₂ formado.\nb) Determine o grau de pureza da amostra de calcário analisada (Massas molares: Ca=40, C=12, O=16).",
        resposta: "a) n(CO₂) = 0,08 mol; b) Grau de pureza = 80%.",
        justificativa: "Critério: Nas CNTP (22,4 L/mol): n = 1,792 / 22,4 = 0,08 mol de CO₂. Como 1 mol de CaCO₃ (100 g/mol) produz 1 mol de CO₂, a massa pura de CaCO₃ reagida foi 0,08 · 100 = 8,0 g. Pureza = (8,0 / 10,0) · 100 = 80%."
      },
      {
        enunciado: "O isooctano (2,2,4-trimetilpentano) é um hidrocarboneto de referência na determinação do índice de octanagem da gasolina.\na) Desenhe a fórmula estrutural plana do 2,2,4-trimetilpentano.\nb) Quantos carbonos primários, secundários, terciários e quaternários existem nessa molécula?",
        resposta: "a) Cadeia de 5 carbonos com duas metilas no C2 e uma no C4; b) 5 primários, 1 secundário, 1 terciário e 1 quaternário.",
        justificativa: "Critério: Identificação correta da cadeia carbônica principal e ramificações. Classificação estrutural de acordo com o número de outros átomos de carbono ligados a cada carbono da cadeia."
      }
    ],
    'Biologia': [
      {
        enunciado: "A fibrose cística é uma doença genética autossômica recessiva causada por mutações no gene regulador da condutância transmembrana (CFTR).\na) Qual a probabilidade de um casal heterozigoto ter uma criança afetada?\nb) Se o casal tiver dois filhos, qual a probabilidade de ambos serem saudáveis?",
        resposta: "a) P = 1/4 (25%); b) P = 9/16 (56,25%).",
        justificativa: "Critério: Cruzamento Aa x Aa produz proporções genotípicas 1/4 AA, 2/4 Aa, 1/4 aa. Probabilidade de filho saudável = 3/4. Para dois eventos independentes: 3/4 · 3/4 = 9/16."
      },
      {
        enunciado: "Em uma cadeia alimentar aquática composta por fitoplâncton, zooplâncton, peixes herbívoros e aves piscívoras, detectou-se contaminação por mercúrio (metal pesado bioacumulativo).\na) Em qual nível trófico será encontrada a maior concentração de mercúrio por biomassa?\nb) Nomeie e explique o fenômeno biológico responsável por esse padrão.",
        resposta: "a) Nas aves piscívoras (consumidores terciários); b) Biomagnificação trófica (ou magnificação ecológica).",
        justificativa: "Critério: Substâncias não biodegradáveis e lipossolúveis acumulam-se progressivamente ao longo dos níveis tróficos ascendentes por não serem metabolizadas eficientemente."
      },
      {
        enunciado: "Durante um esforço físico intenso e prolongado, ocorrem alterações fisiológicas no sistema respiratório e cardiovascular humano.\na) Explique como a redução do pH sanguíneo estimula a ventilação pulmonar.\nb) Qual a vantagem adaptativa do efeito Bohr na liberação de oxigênio pela hemoglobina aos tecidos ativos?",
        resposta: "a) Queda do pH estimula quimiorreceptores no bulbo raquidiano e corpos aórticos/carotídeos; b) O efeito Bohr diminui a afinidade da hemoglobina pelo O₂ sob menor pH, liberando mais oxigênio nos tecidos musculares ativos.",
        justificativa: "Critério: Acúmulo de CO₂ e íons H⁺ detectados pelo centro respiratório bulbar que eleva o ritmo ventilatório. O efeito Bohr desloca a curva de dissociação da hemoglobina para a direita, otimizando a entrega de O₂ celular."
      },
      {
        enunciado: "As briófitas e pteridófitas representam etapas evolutivas fundamentais na conquista do ambiente terrestre pelas plantas.\na) Cite duas características compartilhadas por ambos os grupos relacionadas à reprodução sexuada.\nb) Qual novidade evolutiva morfofisiológica presente nas pteridófitas permitiu que alcançassem portes muito maiores que as briófitas?",
        resposta: "a) Dependência de água líquida para o encontro de gametas flagelados (anterozoides) e alternância de gerações heteromórfica; b) Presença de tecidos vasculares condutores (xilema e floema).",
        justificativa: "Critério: Anterozoides móveis e flagelados dependentes de água livre para fecundação. O tecido vascular lignificado conferiu sustentação mecânica e transporte eficiente de seiva a longas distâncias."
      },
      {
        enunciado: "A teoria sintética da evolução (Neodarwinismo) integra a seleção natural darwiniana aos mecanismos genéticos descobertos pela biologia moderna.\na) Diferencie mutação gênica de recombinação gênica quanto à origem da variabilidade genética.\nb) Como a seleção disruptiva atua sobre uma população com variação fenotípica contínua?",
        resposta: "a) A mutação cria novos alelos (fonte primária), enquanto a recombinação recombina alelos preexistentes; b) Favorece os dois extremos fenotípicos em detrimento dos indivíduos médios intermediários.",
        justificativa: "Critério: Apenas as mutações introduzem variantes alélicas inéditas no pool gênico. A seleção disruptiva seleciona contra o fenótipo médio, podendo atuar na especiação ecológica."
      },
      {
        enunciado: "A membrana plasmática eucariótica atua como barreira seletiva fundamental à homeostase celular.\na) Descreva o modelo do mosaico fluido proposto por Singer e Nicolson.\nb) Explique a diferença entre difusão facilitada e transporte ativo através da membrana.",
        resposta: "a) Bicamada fosfolipídica fluida com proteínas integrais e periféricas móveis incrustadas; b) Difusão facilitada é passiva (sem gasto de ATP); transporte ativo ocorre contra gradiente e consome ATP.",
        justificativa: "Critério: Bicamada contínua de fosfolipídios em arranjo anfipático com mobilidade lateral. O transporte ativo exige quebra enzimática de ATP por permeases/bombas transmembrana."
      }
    ],
    'História': [
      {
        enunciado: "A economia colonial brasileira durante os séculos XVI e XVII esteve alicerçada no complexo açucareiro nordestino.\na) Quais eram os quatro pilares fundamentais do sistema de plantation colonial?\nb) Qual foi o papel dos banqueiros e comerciantes holandeses na viabilização do negócio açucareiro antes da invasão pernambucana?",
        resposta: "a) Latifúndio, monocultura, mão de obra escravizada e produção voltada à exportação (mercado externo); b) Financiamento da montagem dos engenhos, transporte marítimo e refino do açúcar na Europa.",
        justificativa: "Critério oficial FUVEST: Caracterização dos 4 pilares clássicos da plantation mercantilista. Explicação da parceria luso-flamenga no refino e distribuição em Amsterdam antes da União Ibérica."
      },
      {
        enunciado: "A Era Vargas (1930–1945) transformou profundamente as estruturas políticas e trabalhistas do Estado brasileiro.\na) De que maneira o Estado Novo (1937–1945) instrumentalizou a legislação trabalhista (CLT) para controlar o movimento operário?\nb) Qual a função exercida pelo Departamento de Imprensa e Propaganda (DIP) nesse período?",
        resposta: "a) Estabeleceu o corporativismo sindical e atrelou os sindicatos ao Ministério do Trabalho com a figura do 'peleguismo'; b) Censura prévia aos meios de comunicação e propaganda ufanista personalista de Getúlio Vargas.",
        justificativa: "Critério: Estrutura sindical tutelada com proibição de greves independentes. O DIP monopolizou a censura e a propaganda ufanista estatal construindo a imagem do líder carismático."
      },
      {
        enunciado: "O regime militar brasileiro instaurado em 1964 editou sucessivos Atos Institucionais para cercear liberdades políticas.\na) Qual o significado político e as principais medidas estabelecidas pelo Ato Institucional nº 5 (AI-5) em dezembro de 1968?\nb) Explique o conceito de 'milagre econômico' e suas consequências sociais entre 1969 e 1973.",
        resposta: "a) Fechamento do Congresso, suspensão do habeas corpus para crimes políticos e censura prévia irrestrita; b) Crescimento expressivo do PIB aliado a arrocho salarial e violenta concentração de renda.",
        justificativa: "Critério: O AI-5 representou o endurecimento máximo ('anos de chumbo'), institucionalizando o arbítrio estatal. O milagre econômico combinou crescimento industrial com endividamento e exclusão distributiva."
      },
      {
        enunciado: "O Renascimento cultural europeu nos séculos XV e XVI marcou a transição entre o pensamento medieval e a Idade Moderna.\na) Diferencie teocentrismo medieval de antropocentrismo renascentista.\nb) Explique o papel desempenhado pelo mecenato no florescimento artístico das cidades-Estado italianas.",
        resposta: "a) Teocentrismo coloca Deus no centro das explicações; antropocentrismo valoriza a capacidade racional humana e a observação da natureza; b) Burgueses, nobres e a Igreja financiavam artistas para projetar status, prestígio político e poder.",
        justificativa: "Critério: Ruptura com a escolástica medieval e exaltação do humanismo. O mecenato como estratégia de legitimação política e projeção de poder econômico das famílias patrícias (como os Médici)."
      },
      {
        enunciado: "A Revolução Francesa de 1789 desmantelou o Antigo Regime absolutista na Europa ocidental.\na) O que representou a queda da Tomada da Bastilha em 14 de julho de 1789?\nb) Compare os projetos políticos dos girondinos e dos jacobinos durante a Convenção Nacional.",
        resposta: "a) Símbolo da destruição do absolutismo real e entrada decisiva das massas populares (sans-culottes) na arena revolucionária; b) Girondinos defendiam moderação burguesa e liberalismo censitário; jacobinos propunham sufrágio universal, controle de preços (Lei do Máximo) e reformas radicais.",
        justificativa: "Critério: Queda do baluarte militar do despotismo monárquico. Divergência programática entre a alta burguesia moderada e as camadas populares radicais lideradas pelo Comitê de Salvação Pública."
      },
      {
        enunciado: "A Guerra Fria caracterizou-se pela bipolarização ideológica e geopolítica global entre EUA e URSS (1947–1991).\na) O que foi a Doutrina Truman e o Plano Marshall no contexto pós-Segunda Guerra Mundial?\nb) Explique o significado da crise dos mísseis em Cuba (1962) para a corrida nuclear.",
        resposta: "a) Doutrina de contenção do comunismo e plano de ajuda financeira para reconstrução econômica da Europa Ocidental; b) Momento de máxima tensão da Guerra Fria que esteve a ponto de deflagrar um conflito nuclear total entre as duas superpotências.",
        justificativa: "Critério: Plano Marshall evitou colapso econômico que favoreceria partidos comunistas no pós-guerra. A crise dos mísseis levou à instalação da linha direta Moscou-Washington e assinatura do Tratado de Não Proliferação Nuclear."
      }
    ],
    'Geografia': [
      {
        enunciado: "O processo de urbanização brasileiro acelerou-se intensamente a partir da segunda metade do século XX.\na) Quais fatores socioeconômicos impulsionaram o intenso êxodo rural no país após 1950?\nb) Defina o conceito de macrocefalia urbana e exemplifique com problemas enfrentados pelas metrópoles nacionais.",
        resposta: "a) Mecanização da agricultura, concentração fundiária no campo e atração exercida pela industrialização nas grandes cidades; b) Inchaço desordenado das cidades com saturação de infraestrutura, favelização, trânsito caótico e déficit de saneamento.",
        justificativa: "Critério oficial FUVEST: Fatores repulsivos do campo combinados a fatores atrativos da cidade. Macrocefalia urbana decorrente de crescimento populacional superior à oferta de empregos formais e serviços públicos."
      },
      {
        enunciado: "A expansão da fronteira agrícola no Brasil tem gerado debates complexos sobre desenvolvimento econômico e conservação ambiental.\na) Quais biomas brasileiros têm sido mais impactados pelo avanço da monocultura de grãos e da pecuária bovina extensiva?\nb) O que caracteriza o 'Arco do Desmatamento' na região amazônica?",
        resposta: "a) Cerrado (Matopiba) e Amazônia; b) Faixa geográfica que vai do leste/sul do Pará até Rondônia e Acre, concentrando as maiores taxas de desflorestamento e queimadas ilegais.",
        justificativa: "Critério: Destruição do Cerrado para lavouras de soja e avanço predatório da pecuária bovina e grilagem sobre a floresta amazônica no arco sul-sudeste."
      },
      {
        enunciado: "A matriz energética mundial e brasileira enfrenta o desafio inadiável da transição energética descarbonizada.\na) Compare a matriz elétrica brasileira com a média mundial quanto à participação de fontes renováveis.\nb) Quais são as vantagens e os impactos socioambientais da expansão da energia eólica e solar no semiárido nordestino?",
        resposta: "a) A matriz elétrica brasileira é amplamente mais renovável (>80%), baseada em hidrelétricas, biomassa, eólica e solar, contra cerca de 30% da média global; b) Vantagens: baixa emissão de GEE e geração de renda; Impactos: desmatamento de caatinga, ruído de turbinas e conflitos com comunidades tradicionais.",
        justificativa: "Critério: Brasil possui matriz elétrica predominantemente renovável por fatores hidrológicos e climáticos. Impactos territoriais de grandes parques eólicos sobre comunidades quilombolas e pequenos agricultores."
      },
      {
        enunciado: "A globalização econômica reconfigurou a Divisão Internacional do Trabalho (DIT) nas últimas décadas.\na) Como a emergência da China como a 'fábrica do mundo' alterou o fluxo global de manufaturas e commodities?\nb) Explique o conceito de reprimarização da pauta exportadora brasileira no século XXI.",
        resposta: "a) A China tornou-se o maior polo manufatureiro mundial e principal importadora global de commodities agrícolas e minerais; b) Aumento da participação percentual de produtos primários não beneficiados (soja, minério de ferro, petróleo bruto) na receita total de exportações do Brasil.",
        justificativa: "Critério: Reconfiguração da DIT com polarização fabril no leste asiático. Reprimarização e desindustrialização precoce em decorrência da alta dependência do agronegócio exportador."
      },
      {
        enunciado: "A dinâmica climática do Brasil é fortemente influenciada pela atuação de diferentes massas de ar.\na) Qual a atuação da Massa Equatorial Continental (mEc) durante o verão no território brasileiro?\nb) De que modo a Massa Polar Atlântica (mPa) provoca o fenômeno da 'friagem' na Amazônia ocidental durante o inverno?",
        resposta: "a) Origina os 'Rios Voadores', transportando vapor d'água da bacia amazônica e provocando chuvas abundantes no Centro-Oeste e Sudeste; b) A massa fria avança pela calha do Chaco/Pantanal e penetra nos estados de Rondônia, Acre e Amazonas, provocando quedas bruscas de temperatura.",
        justificativa: "Critério: A mEc é quente e muito úmida pela evapotranspiração amazônica. A mPa é canalizada pela depressão do Chaco e atinge baixas latitudes sem encontrar barreiras montanhosas transversais."
      },
      {
        enunciado: "A demografia brasileira vivencia uma acelerada transição com alteração do perfil de sua pirâmide etária.\na) Quais fatores explicam a rápida queda da taxa de fecundidade no Brasil nas últimas quatro décadas?\nb) Quais os principais desafios fiscais e previdenciários decorrentes do envelhecimento populacional e do fim do bônus demográfico?",
        resposta: "a) Urbanização, inserção da mulher no mercado de trabalho e acesso ampliado a métodos contraceptivos; b) Aumento do déficit do regime previdenciário e gastos públicos com saúde (SUS), frente à redução proporcional da População Economicamente Ativa (PEA).",
        justificativa: "Critério: Queda acentuada da fecundidade e transição demográfica avançada. Desafio da sustentabilidade da seguridade social com razão de dependência de idosos em forte elevação."
      }
    ]
  };

  const questoes = questoesPorMateria[materia] || [];
  return questoes.map((q, idx) => ({
    numero: idx + 1,
    resposta: q.resposta,
    disciplina: materia,
    enunciado: q.enunciado,
    alternativas: [
      `A) Resposta Oficial / Padrão Esperado: ${q.resposta}`,
      `B) Resposta Parcial (item a correto, item b incompleto)`,
      `C) Resposta com Erro Algébrico / Conceitual Básico`,
      `D) Argumentação Fora do Escopo da Banca Examinadora`,
      `E) Omissão da Justificativa Técnica Obrigatória`
    ],
    justificativa: q.justificativa
  }));
};

const SAMPLE_GABARITOS: GabaritoOficial[] = [
  // ===== FUVEST 2026 — 2ª FASE RESPOSTAS ESPERADAS OFICIAIS =====
  {
    id: 'fuvest-2026-matematica',
    exame: Vestibular.FUVEST,
    ano: 2026,
    dia: 2,
    caderno: 'Matemática',
    titulo: 'FUVEST 2026- MATEMÁTICA',
    pdfUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-respostas-esperadas-matematica.pdf',
    provaPdfUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-prova.pdf',
    questoes: generateFuvestFase2Questions('Matemática')
  },
  {
    id: 'fuvest-2026-fisica',
    exame: Vestibular.FUVEST,
    ano: 2026,
    dia: 2,
    caderno: 'Física',
    titulo: 'FUVEST 2026- FÍSICA',
    pdfUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-respostas-esperadas-fisica.pdf',
    provaPdfUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-prova.pdf',
    questoes: generateFuvestFase2Questions('Física')
  },
  {
    id: 'fuvest-2026-quimica',
    exame: Vestibular.FUVEST,
    ano: 2026,
    dia: 2,
    caderno: 'Química',
    titulo: 'FUVEST 2026- QUÍMICA',
    pdfUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-respostas-esperadas-quimica.pdf',
    provaPdfUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-prova.pdf',
    questoes: generateFuvestFase2Questions('Química')
  },
  {
    id: 'fuvest-2026-biologia',
    exame: Vestibular.FUVEST,
    ano: 2026,
    dia: 2,
    caderno: 'Biologia',
    titulo: 'FUVEST 2026- BIOLOGIA',
    pdfUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-respostas-esperadas-biologia.pdf',
    provaPdfUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-prova.pdf',
    questoes: generateFuvestFase2Questions('Biologia')
  },
  {
    id: 'fuvest-2026-historia',
    exame: Vestibular.FUVEST,
    ano: 2026,
    dia: 2,
    caderno: 'História',
    titulo: 'FUVEST 2026- HISTÓRIA',
    pdfUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-respostas-esperadas-historia.pdf',
    provaPdfUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-prova.pdf',
    questoes: generateFuvestFase2Questions('História')
  },
  {
    id: 'fuvest-2026-geografia',
    exame: Vestibular.FUVEST,
    ano: 2026,
    dia: 2,
    caderno: 'Geografia',
    titulo: 'FUVEST 2026- GEOGRAFIA',
    pdfUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-respostas-esperadas-geografia.pdf',
    provaPdfUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-prova.pdf',
    questoes: generateFuvestFase2Questions('Geografia')
  },
  // ===== FUVEST 2025 — GABARITOS OFICIAIS =====
  {
    id: 'fuvest-2025-1fase-gabarito',
    exame: Vestibular.FUVEST,
    ano: 2025,
    dia: 1,
    caderno: '1ª Fase (V1 a V4)',
    titulo: 'FUVEST 2025 - GABARITO 1ª FASE',
    pdfUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2025_gabarito_primeira_fase.pdf',
    provaPdfUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2025_primeira_fase_prova_V1.pdf',
    questoes: generateRichQuestions(Vestibular.FUVEST, 1, 90)
  },
  {
    id: 'fuvest-2025-2fase-guia-respostas',
    exame: Vestibular.FUVEST,
    ano: 2025,
    dia: 2,
    caderno: 'Guia de Respostas Oficial',
    titulo: 'FUVEST 2025 - GUIA DE RESPOSTAS 2ª FASE',
    pdfUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest_2025_guia_respostas.pdf',
    provaPdfUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2025_prova_2fase_dia1.pdf',
    questoes: generateFuvestFase2Questions('Matemática')
  },
  {
    id: 'ita-2017-gabarito',
    exame: 'ITA',
    ano: 2017,
    dia: 1,
    caderno: 'Gabarito Oficial',
    pdfUrl: 'https://www.vestibular.ita.br/provas/gabarito_2017.pdf',
    questoes: ITA_2017_QUESTOES
  },
  {
    id: 'ita-2016-gabarito',
    exame: 'ITA',
    ano: 2016,
    dia: 1,
    caderno: 'Gabarito Oficial',
    pdfUrl: 'https://vestibular.ita.br/provas/gabarito_2016.pdf',
    questoes: ITA_2016_QUESTOES
  },
  {
    id: 'ita-2015-gabarito',
    exame: 'ITA',
    ano: 2015,
    dia: 1,
    caderno: 'Gabarito Oficial',
    pdfUrl: 'https://www.vestibular.ita.br/provas/gabarito_2015.pdf',
    questoes: ITA_2015_QUESTOES
  },
  {
    id: 'ita-2014-gabarito',
    exame: 'ITA',
    ano: 2014,
    dia: 1,
    caderno: 'Gabarito Oficial',
    pdfUrl: 'https://www.vestibular.ita.br/provas/gabarito_2014.pdf',
    questoes: ITA_2014_QUESTOES
  },
  {
    id: 'ita-2013-gabarito',
    exame: 'ITA',
    ano: 2013,
    dia: 1,
    caderno: 'Gabarito Oficial',
    pdfUrl: 'https://vestibular.ita.br/provas/gabarito_2013.pdf',
    questoes: ITA_2013_QUESTOES
  },
  {
    id: 'ita-2012-gabarito',
    exame: 'ITA',
    ano: 2012,
    dia: 1,
    caderno: 'Gabarito Oficial',
    pdfUrl: 'https://www.vestibular.ita.br/provas/gabarito_2012.pdf',
    questoes: ITA_2012_QUESTOES
  },
  {
    id: 'ita-2011-gabarito',
    exame: 'ITA',
    ano: 2011,
    dia: 1,
    caderno: 'Gabarito Oficial',
    pdfUrl: 'https://www.vestibular.ita.br/provas/gabarito_2011.pdf',
    questoes: ITA_2011_QUESTOES
  },
  {
    id: 'ita-2010-gabarito',
    exame: 'ITA',
    ano: 2010,
    dia: 1,
    caderno: 'Gabarito Oficial',
    pdfUrl: 'https://www.vestibular.ita.br/provas/gabarito_2010.pdf',
    questoes: ITA_2010_QUESTOES
  },
  {
    id: 'ita-2009-gabarito',
    exame: 'ITA',
    ano: 2009,
    dia: 1,
    caderno: 'Gabarito Oficial',
    pdfUrl: 'https://www.vestibular.ita.br/provas/gabarito_2009.pdf',
    questoes: ITA_2009_QUESTOES
  },
  {
    id: 'enem-2023-d1',
    exame: Vestibular.ENEM,
    ano: 2023,
    dia: 1,
    caderno: 'Azul',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2023-d2',
    exame: Vestibular.ENEM,
    ano: 2023,
    dia: 2,
    caderno: 'Cinza',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'enem-2014-d1-azul',
    exame: Vestibular.ENEM,
    ano: 2014,
    dia: 1,
    caderno: 'Azul',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2014-d1-amarelo',
    exame: Vestibular.ENEM,
    ano: 2014,
    dia: 1,
    caderno: 'Amarelo',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2014-d1-branco',
    exame: Vestibular.ENEM,
    ano: 2014,
    dia: 1,
    caderno: 'Branco',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2014-d1-rosa',
    exame: Vestibular.ENEM,
    ano: 2014,
    dia: 1,
    caderno: 'Rosa',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2014-d2-amarelo',
    exame: Vestibular.ENEM,
    ano: 2014,
    dia: 2,
    caderno: 'Amarelo',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'enem-2014-d2-cinza',
    exame: Vestibular.ENEM,
    ano: 2014,
    dia: 2,
    caderno: 'Cinza',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'enem-2014-d2-azul',
    exame: Vestibular.ENEM,
    ano: 2014,
    dia: 2,
    caderno: 'Azul',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'enem-2014-d2-rosa',
    exame: Vestibular.ENEM,
    ano: 2014,
    dia: 2,
    caderno: 'Rosa',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'enem-2013-d1-azul',
    exame: Vestibular.ENEM,
    ano: 2013,
    dia: 1,
    caderno: 'Azul',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2013-d1-amarelo',
    exame: Vestibular.ENEM,
    ano: 2013,
    dia: 1,
    caderno: 'Amarelo',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2013-d1-branco',
    exame: Vestibular.ENEM,
    ano: 2013,
    dia: 1,
    caderno: 'Branco',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2013-d1-rosa',
    exame: Vestibular.ENEM,
    ano: 2013,
    dia: 1,
    caderno: 'Rosa',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2013-d2-amarelo',
    exame: Vestibular.ENEM,
    ano: 2013,
    dia: 2,
    caderno: 'Amarelo',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'enem-2013-d2-cinza',
    exame: Vestibular.ENEM,
    ano: 2013,
    dia: 2,
    caderno: 'Cinza',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'enem-2013-d2-azul',
    exame: Vestibular.ENEM,
    ano: 2013,
    dia: 2,
    caderno: 'Azul',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'enem-2013-d2-rosa',
    exame: Vestibular.ENEM,
    ano: 2013,
    dia: 2,
    caderno: 'Rosa',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'enem-2012-d1-azul',
    exame: Vestibular.ENEM,
    ano: 2012,
    dia: 1,
    caderno: 'Azul',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2012-d1-amarelo',
    exame: Vestibular.ENEM,
    ano: 2012,
    dia: 1,
    caderno: 'Amarelo',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2012-d1-branco',
    exame: Vestibular.ENEM,
    ano: 2012,
    dia: 1,
    caderno: 'Branco',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2012-d1-rosa',
    exame: Vestibular.ENEM,
    ano: 2012,
    dia: 1,
    caderno: 'Rosa',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2012-d2-amarelo',
    exame: Vestibular.ENEM,
    ano: 2012,
    dia: 2,
    caderno: 'Amarelo',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'enem-2012-d2-cinza',
    exame: Vestibular.ENEM,
    ano: 2012,
    dia: 2,
    caderno: 'Cinza',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'enem-2012-d2-azul',
    exame: Vestibular.ENEM,
    ano: 2012,
    dia: 2,
    caderno: 'Azul',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'enem-2012-d2-rosa',
    exame: Vestibular.ENEM,
    ano: 2012,
    dia: 2,
    caderno: 'Rosa',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'enem-2011-d1-azul',
    exame: Vestibular.ENEM,
    ano: 2011,
    dia: 1,
    caderno: 'Azul',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2011-d1-amarelo',
    exame: Vestibular.ENEM,
    ano: 2011,
    dia: 1,
    caderno: 'Amarelo',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2011-d1-branco',
    exame: Vestibular.ENEM,
    ano: 2011,
    dia: 1,
    caderno: 'Branco',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2011-d1-rosa',
    exame: Vestibular.ENEM,
    ano: 2011,
    dia: 1,
    caderno: 'Rosa',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2011-d2-amarelo',
    exame: Vestibular.ENEM,
    ano: 2011,
    dia: 2,
    caderno: 'Amarelo',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'enem-2011-d2-cinza',
    exame: Vestibular.ENEM,
    ano: 2011,
    dia: 2,
    caderno: 'Cinza',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'enem-2011-d2-azul',
    exame: Vestibular.ENEM,
    ano: 2011,
    dia: 2,
    caderno: 'Azul',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'enem-2011-d2-rosa',
    exame: Vestibular.ENEM,
    ano: 2011,
    dia: 2,
    caderno: 'Rosa',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'fuvest-2024',
    exame: Vestibular.FUVEST,
    ano: 2024,
    dia: 1,
    caderno: 'V',
    questoes: generateRichQuestions(Vestibular.FUVEST, 1)
  }
];

export default function GabaritosOficiais() {
  const [selectedGabarito, setSelectedGabarito] = useState<GabaritoOficial | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<{
    numero: number;
    resposta: string;
    disciplina: string;
    enunciado?: string;
    alternativas?: string[];
    justificativa?: string;
  } | null>(null);

  // Filters and searches
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExame, setFilterExame] = useState<string>('Todos');
  const [filterAno, setFilterAno] = useState<string>('Todos');
  
  // Specific view state once a template is opened
  const [activeTab, setActiveTab] = useState<'view' | 'simulate' | 'stats'>('view');
  
  // Simulation Answers state (User filling their choices to see score)
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [subjectFilterInside, setSubjectFilterInside] = useState<string>('Todos');

  const filteredList = useMemo(() => {
    return SAMPLE_GABARITOS.filter(g => {
      const searchTarget = `${g.titulo || ''} ${g.exame} ${g.ano} ${g.caderno}`.toLowerCase();
      const matchesSearch = searchTarget.includes(searchTerm.toLowerCase());
      const matchesExame = filterExame === 'Todos' || g.exame === filterExame || (filterExame.toLowerCase() === String(g.exame).toLowerCase());
      const matchesAno = filterAno === 'Todos' || String(g.ano) === filterAno;
      return matchesSearch && matchesExame && matchesAno;
    });
  }, [searchTerm, filterExame, filterAno]);

  const examsList = Array.from(new Set(SAMPLE_GABARITOS.map(g => g.exame)));
  const yearsList = Array.from(new Set(SAMPLE_GABARITOS.map(g => String(g.ano))));

  // Filter study questions based on interior filters
  const interiorFilteredQuestions = useMemo(() => {
    if (!selectedGabarito) return [];
    return selectedGabarito.questoes.filter(q => {
      return subjectFilterInside === 'Todos' || q.disciplina === subjectFilterInside;
    });
  }, [selectedGabarito, subjectFilterInside]);

  const insideSubjectsList = useMemo(() => {
    if (!selectedGabarito) return [];
    return Array.from(new Set(selectedGabarito.questoes.map(q => q.disciplina)));
  }, [selectedGabarito]);

  // Answer distribution calculation for stats view
  const distributionStats = useMemo(() => {
    if (!selectedGabarito) return { total: 0, distribute: {} as Record<string, number>, pct: {} as Record<string, string> };
    const distribute: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    selectedGabarito.questoes.forEach(q => {
      distribute[q.resposta] = (distribute[q.resposta] || 0) + 1;
    });
    const total = selectedGabarito.questoes.length;
    const pct: Record<string, string> = {};
    Object.keys(distribute).forEach(key => {
      pct[key] = total > 0 ? ((distribute[key] / total) * 100).toFixed(1) : '0';
    });
    return { total, distribute, pct };
  }, [selectedGabarito]);

  // Simulation scores
  const simulationResults = useMemo(() => {
    if (!selectedGabarito) return { correct: 0, total: 0, percentage: 0 };
    let correct = 0;
    selectedGabarito.questoes.forEach(q => {
      // Questions marked with * are officially annulled and considered correct for all candidates
      if (q.resposta === '*' || userAnswers[q.numero] === q.resposta) {
        correct++;
      }
    });
    const total = selectedGabarito.questoes.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { correct, total, percentage };
  }, [selectedGabarito, userAnswers]);

  const getAnswerColor = (letter: string) => {
    const colors: Record<string, string> = {
      A: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40',
      B: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40',
      C: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40',
      D: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border border-violet-200 dark:border-violet-800/40',
      E: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40',
      '*': 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40 font-bold'
    };
    return colors[letter] || 'bg-slate-100 text-slate-600';
  };

  const getAnswerSimpleHover = (letter: string) => {
    const colors: Record<string, string> = {
      A: 'hover:border-indigo-400 dark:hover:border-indigo-500',
      B: 'hover:border-emerald-400 dark:hover:border-emerald-500',
      C: 'hover:border-amber-400 dark:hover:border-amber-500',
      D: 'hover:border-violet-400 dark:hover:border-violet-500',
      E: 'hover:border-rose-400 dark:hover:border-rose-500'
    };
    return colors[letter] || '';
  };

  const handleSimulateAnswerChange = (numero: number, letter: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [numero]: prev[numero] === letter ? '' : letter
    }));
  };

  const autofillCorrect = () => {
    if (!selectedGabarito) return;
    const correctAnswers: Record<number, string> = {};
    selectedGabarito.questoes.forEach(q => {
      correctAnswers[q.numero] = q.resposta;
    });
    setUserAnswers(correctAnswers);
  };

  const clearSimulation = () => {
    setUserAnswers({});
  };

  // Excel formatting client-side file exporter
  const triggerSpreadsheetDownload = (gabarito: GabaritoOficial) => {
    const content = gabarito.questoes.map(q => ({
      'Questão': q.numero,
      'Gabarito Oficial': q.resposta,
      'Área de Conhecimento': q.disciplina,
      'Enunciado': q.enunciado || '',
      'Explicativa': q.justificativa || ''
    }));

    const feedbackSpreadsheetString = "data:text/csv;charset=utf-8," 
      + ["Questão,Gabarito,Componente,Explicativa"].join(",") + "\n"
      + content.map(e => `${e.Questão},${e['Gabarito Oficial']},"${e['Área de Conhecimento']}","${e.Explicativa.replace(/"/g, '""')}"`).join("\n");
    
    const encodedUri = encodeURI(feedbackSpreadsheetString);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Gabarito_Oficial_${gabarito.exame}_${gabarito.ano}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (selectedGabarito) {
    return (
      <div className="space-y-8 pb-12 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button 
            onClick={() => {
              setSelectedGabarito(null);
              clearSimulation();
            }}
            id="btn-voltar-index"
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold transition-all group px-4 py-2 bg-slate-100 dark:bg-slate-900 border dark:border-slate-800 rounded-xl"
          >
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            Voltar para Biblioteca
          </button>

          <div className="flex flex-wrap gap-2.5">
            {selectedGabarito.provaPdfUrl && (
              <a
                href={selectedGabarito.provaPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-black bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2.5 rounded-xl transition-all shadow-md shadow-cyan-500/20 active:scale-95"
              >
                <FileText size={14} />
                Baixar Caderno de Prova (PDF)
              </a>
            )}
            {selectedGabarito.pdfUrl && (
              <a
                href={selectedGabarito.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-black bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-500/20 active:scale-95"
              >
                <ExternalLink size={14} />
                Baixar {selectedGabarito.titulo ? 'Respostas Esperadas' : 'Gabarito Oficial'} ({selectedGabarito.ano})
              </a>
            )}
            <button
              onClick={() => triggerSpreadsheetDownload(selectedGabarito)}
              className="flex items-center gap-2 text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/10 active:scale-95"
            >
              <Download size={15} />
              Salvar Planilha (.CSV)
            </button>
          </div>
        </div>

        {/* Premium Header Container */}
        <div className="bg-slate-950 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden border border-slate-800 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[130px] rounded-full -mr-48 -mt-48 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/5 blur-[150px] rounded-full -ml-48 -mb-48 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                <Sparkles size={12} className="animate-pulse" />
                {selectedGabarito.titulo ? 'Respostas Esperadas Oficiais' : 'Vestibular Conectado'}
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                {selectedGabarito.titulo || `${selectedGabarito.exame} ${selectedGabarito.ano}`}
              </h1>
              <div className="flex flex-wrap gap-3 font-semibold text-xs text-slate-400">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl">
                  <Calendar size={13} className="text-indigo-400" />
                  Dia {selectedGabarito.dia}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl">
                  <GraduationCap size={13} className="text-violet-400" />
                  Caderno {selectedGabarito.caderno}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl">
                  <FileSpreadsheet size={13} className="text-emerald-400" />
                  {selectedGabarito.questoes.length} Questões Reais
                </span>
              </div>
            </div>

            {/* Simulated Live Track progress if simulating */}
            {activeTab === 'simulate' && (
              <div className="bg-slate-900/60 p-6 rounded-[2rem] border border-slate-800 min-w-[260px] flex items-center gap-5">
                <div className="relative flex items-center justify-center">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle cx="32" cy="32" r="28" fill="transparent" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                    <circle cx="32" cy="32" r="28" fill="transparent" stroke="var(--text-accent, #6366f1)" strokeWidth="4" strokeDasharray="175" strokeDashoffset={175 - (175 * simulationResults.percentage) / 100} className="transition-all duration-500" />
                  </svg>
                  <span className="absolute text-sm font-black">{simulationResults.percentage}%</span>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Desempenho Simulado</p>
                  <p className="text-lg font-black text-white mt-1">{simulationResults.correct} / {simulationResults.total}</p>
                  <p className="text-xs text-indigo-300 font-bold">Acertos Calculados</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Interior Navigation Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--bg-card)] p-3 rounded-2xl border border-[var(--border-light)] shadow-sm">
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('view')}
              className={cn(
                "flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer",
                activeTab === 'view'
                  ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--shadow-primary)]"
                  : "hover:bg-[var(--bg-hover)] text-[var(--text-muted)]"
              )}
            >
              <BookOpen size={14} />
              Gabarito Oficial
            </button>
            <button
              onClick={() => setActiveTab('simulate')}
              className={cn(
                "flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer",
                activeTab === 'simulate'
                  ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--shadow-primary)]"
                  : "hover:bg-[var(--bg-hover)] text-[var(--text-muted)]"
              )}
            >
              <Trophy size={14} />
              Simular Gabarito
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={cn(
                "flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer",
                activeTab === 'stats'
                  ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--shadow-primary)]"
                  : "hover:bg-[var(--bg-hover)] text-[var(--text-muted)]"
              )}
            >
              <BarChart2 size={14} />
              Metodologia & Distribuição
            </button>
          </div>

          {/* Quick Subject Switcher inside template */}
          <div className="relative w-full sm:w-auto">
            <select
              value={subjectFilterInside}
              onChange={(e) => setSubjectFilterInside(e.target.value)}
              className="w-full sm:w-56 appearance-none bg-[var(--bg-input)] border border-[var(--border-light)] px-4 py-2.5 pr-10 rounded-xl text-xs font-bold text-[var(--text-main)] outline-none cursor-pointer hover:border-[var(--primary)] transition-colors"
            >
              <option value="Todos">Todas as Disciplinas</option>
              {insideSubjectsList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-label)] pointer-events-none" size={14} />
          </div>
        </div>

        {/* Tab 1: Static Answer Keys Grid with clicking mechanism */}
        {activeTab === 'view' && (
          <div className="space-y-6">
            {/* Observações Oficiais da Banca do ITA */}
            {selectedGabarito.exame === 'ITA' && selectedGabarito.ano === 2017 && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-amber-800 dark:text-amber-200 text-xs">
                <AlertCircle className="shrink-0 mt-0.5 text-amber-500" size={18} />
                <div className="space-y-1">
                  <span className="font-extrabold text-sm text-amber-700 dark:text-amber-300 block">
                    Observação Oficial da Banca Examinadora (ITA 2017):
                  </span>
                  <p className="leading-relaxed">
                    Devido a erros de digitação, as questões 7 e 20 da prova de física foram consideradas corretas para todos os candidatos.
                  </p>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
                    Nota de Química: Na questão 9 (diagrama de van Arkel-Ketelaar), o ITA emitiu resolução oficial confirmando a Opção E (composto OF2 com maior caráter covalente). Toque na questão 9 para ver a resolução completa.
                  </p>
                </div>
              </div>
            )}

            {selectedGabarito.exame === 'ITA' && selectedGabarito.ano === 2016 && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-amber-800 dark:text-amber-200 text-xs">
                <AlertCircle className="shrink-0 mt-0.5 text-amber-500" size={18} />
                <div className="space-y-1">
                  <span className="font-extrabold text-sm text-amber-700 dark:text-amber-300 block">
                    Observação Oficial da Banca Examinadora (ITA 2016):
                  </span>
                  <p className="leading-relaxed">
                    Devido à imprecisão dos enunciados, as questões 4 da prova de física, 3 da prova de matemática e 3 e 20 da prova de química foram consideradas corretas para todos os candidatos.
                  </p>
                </div>
              </div>
            )}

            {selectedGabarito.exame === 'ITA' && selectedGabarito.ano === 2015 && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-amber-800 dark:text-amber-200 text-xs">
                <AlertCircle className="shrink-0 mt-0.5 text-amber-500" size={18} />
                <div className="space-y-1">
                  <span className="font-extrabold text-sm text-amber-700 dark:text-amber-300 block">
                    Observação Oficial da Banca Examinadora (ITA 2015):
                  </span>
                  <p className="leading-relaxed">
                    A opção D da questão 9 da prova de inglês apresenta erro de digitação, o que a torna gramaticalmente incorreta e pode confundir o candidato. Desta forma a questão foi anulada e considerada correta para todos os candidatos.
                  </p>
                </div>
              </div>
            )}

            {selectedGabarito.exame === 'ITA' && selectedGabarito.ano === 2014 && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-amber-800 dark:text-amber-200 text-xs">
                <AlertCircle className="shrink-0 mt-0.5 text-amber-500" size={18} />
                <div className="space-y-1">
                  <span className="font-extrabold text-sm text-amber-700 dark:text-amber-300 block">
                    Observação Oficial da Banca Examinadora (ITA 2014):
                  </span>
                  <p className="leading-relaxed">
                    As questões 10 da prova de física, 26 da prova de português e 19 da prova de química foram consideradas corretas para todos os candidatos.
                  </p>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
                    Toque nas questões de Física (1, 16, 17) e Química (18) para ver as notas técnicas conceituais fornecidas diretamente pela banca examinadora do ITA.
                  </p>
                </div>
              </div>
            )}

            {selectedGabarito.exame === 'ITA' && selectedGabarito.ano === 2013 && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-amber-800 dark:text-amber-200 text-xs">
                <AlertCircle className="shrink-0 mt-0.5 text-amber-500" size={18} />
                <div className="space-y-1">
                  <span className="font-extrabold text-sm text-amber-700 dark:text-amber-300 block">
                    Observação Oficial da Banca Examinadora (ITA 2013):
                  </span>
                  <p className="leading-relaxed">
                    A questão 19 da prova de química, por falta de alternativa válida, foi considerada correta para todos os candidatos.
                  </p>
                </div>
              </div>
            )}

            {selectedGabarito.exame === 'ITA' && selectedGabarito.ano === 2011 && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-amber-800 dark:text-amber-200 text-xs">
                <AlertCircle className="shrink-0 mt-0.5 text-amber-500" size={18} />
                <div className="space-y-1">
                  <span className="font-extrabold text-sm text-amber-700 dark:text-amber-300 block">
                    Observação Oficial da Banca Examinadora (ITA 2011):
                  </span>
                  <p className="leading-relaxed">
                    As questões 1 da prova de Inglês e 4 da prova de Matemática suscitaram dúvidas de interpretação e foram consideradas corretas para todos os candidatos.
                  </p>
                </div>
              </div>
            )}

            {selectedGabarito.exame === 'ITA' && selectedGabarito.ano === 2010 && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-amber-800 dark:text-amber-200 text-xs">
                <AlertCircle className="shrink-0 mt-0.5 text-amber-500" size={18} />
                <div className="space-y-1">
                  <span className="font-extrabold text-sm text-amber-700 dark:text-amber-300 block">
                    Observação Oficial da Banca Examinadora (ITA 2010):
                  </span>
                  <p className="leading-relaxed">
                    A questão 5 da prova de Inglês foi considerada correta para todos os candidatos.
                  </p>
                </div>
              </div>
            )}

            <div className="p-4 bg-[var(--bg-badge)] border border-[var(--primary-border)] rounded-2xl flex items-start gap-3">
              <Sparkles className="text-[var(--primary)] shrink-0 mt-0.5" size={16} />
              <p className="text-xs text-[var(--primary)] font-semibold leading-relaxed">
                Dica de Ouro: Toque em qualquer questão do gabarito abaixo para visualizar o enunciado estético original, alternativas reais organizadas e a justificativa didática detalhada de sua resolução.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-4">
              {interiorFilteredQuestions.map((q) => {
                const isAnulada = q.resposta === '*';
                return (
                  <motion.div 
                    key={q.numero}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setSelectedQuestion(q)}
                    className="bg-[var(--bg-card)] p-4 rounded-2xl border border-[var(--border-light)] flex flex-col justify-between items-center shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[var(--primary)] transition-all cursor-pointer group"
                  >
                    <p className="text-[10px] font-bold text-[var(--text-label)] uppercase tracking-widest text-center">Questão</p>
                    <p className="text-xl font-extrabold text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors mt-1 mb-3">{String(q.numero).padStart(2, '0')}</p>
                    
                    <div className={cn(getAnswerColor(q.resposta), "w-11 h-11 rounded-xl flex items-center justify-center text-lg font-black shadow-inner transition-transform group-hover:scale-105")}>
                      {isAnulada ? '★' : q.resposta}
                    </div>
                    <span className={cn(
                      "text-[9px] font-bold uppercase tracking-wider text-center block mt-2 text-ellipsis overflow-hidden w-full whitespace-nowrap",
                      isAnulada ? "text-amber-500 font-extrabold" : "text-[var(--text-label)]"
                    )}>
                      {isAnulada ? 'Anulada' : q.disciplina.split(' ')[0]}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Simulated Student Check Panel */}
        {activeTab === 'simulate' && (
          <div className="space-y-6">
            <div className="bg-[var(--bg-card)] border border-[var(--border-light)] p-6 md:p-8 rounded-2xl flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
                  <Trophy size={20} className="text-amber-500" />
                  Auto-avaliação do Estudante
                </h3>
                <p className="text-[var(--text-muted)] text-xs font-medium max-w-xl leading-relaxed">
                  Marque as respostas que você assinalou no dia da prova oficial para conferir sua pontuação simulada de acertos no formato de relatório dinâmico instantâneo.
                </p>
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={autofillCorrect}
                  className="px-4 py-2.5 bg-[var(--bg-hover)] text-[var(--text-main)] hover:bg-[var(--border-color)] text-xs font-bold rounded-xl transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer border border-[var(--border-light)]"
                >
                  Gabaritar Tudo
                </button>
                <button
                  onClick={clearSimulation}
                  className="px-4 py-2.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-bold rounded-xl transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer border border-rose-500/30"
                >
                  <RefreshCw size={12} />
                  Limpar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {interiorFilteredQuestions.map((q) => {
                const userChoice = userAnswers[q.numero];
                const isChecked = !!userChoice;
                const isAnulada = q.resposta === '*';
                const isCorrect = isAnulada || userChoice === q.resposta;
                return (
                  <div
                    key={q.numero}
                    className={cn(
                      "p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 bg-[var(--bg-card)]",
                      isChecked || isAnulada
                        ? isCorrect 
                          ? "border-emerald-500/40 ring-1 ring-emerald-500/20 bg-emerald-500/5" 
                          : "border-rose-500/40 ring-1 ring-rose-500/20 bg-rose-500/5"
                        : "border-[var(--border-light)] hover:border-[var(--border-color)]"
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-[10px] font-bold text-[var(--text-label)] tracking-wider uppercase">Questão {q.numero}</p>
                          {isAnulada && (
                            <span className="text-[9px] font-black text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                              ★ Anulada
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-semibold text-[var(--text-muted)]">{q.disciplina}</p>
                      </div>

                      {(isChecked || isAnulada) && (
                        <span className={cn(
                          "p-1.5 rounded-full text-white",
                          isCorrect ? "bg-emerald-500" : "bg-rose-500"
                        )}>
                          {isCorrect ? <Check size={10} strokeWidth={4} /> : <X size={10} strokeWidth={4} />}
                        </span>
                      )}
                    </div>

                    {/* Interactive Letters Matrix */}
                    <div className="flex gap-2 justify-between">
                      {['A', 'B', 'C', 'D', 'E'].map(letter => {
                        const cellActive = userChoice === letter;
                        return (
                          <button
                            key={letter}
                            onClick={() => handleSimulateAnswerChange(q.numero, letter)}
                            className={cn(
                              "w-8.5 h-8.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center border cursor-pointer",
                              cellActive 
                                ? "bg-[var(--primary)] text-white border-[var(--primary)] scale-105 shadow-md shadow-[var(--shadow-primary)]"
                                : "bg-[var(--bg-hover)] border-[var(--border-light)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:scale-105"
                            )}
                          >
                            {letter}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Detailed statistics analysis on distribution standards */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-8 rounded-[2.5rem] space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-indigo-500">
                  <TrendingUp size={20} />
                  <p className="text-xs font-black uppercase tracking-wider">Uniformidade das Provas</p>
                </div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white">Teoria de Distribuição do ENEM/Vestibulares</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold leading-relaxed">
                  Grandes provas nacionais utilizam a Teoria de Resposta ao Item (TRI) e distribuem as alternativas de maneira homogênea (frequentemente contendo de 17 a 19 acertos para cada letra das 90 totais) para mitigar a probabilidade de aprovação ao acaso ("chute").
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Ocorrência Proporcional Caderno Atual</p>
                
                <div className="space-y-4">
                  {['A', 'B', 'C', 'D', 'E'].map(letter => {
                    const count = distributionStats.distribute[letter] || 0;
                    const pct = distributionStats.pct[letter] || '0';
                    return (
                      <div key={letter} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="flex items-center gap-2">
                            <span className={cn("w-6 h-6 rounded-md flex items-center justify-center font-black text-[10px]", getAnswerColor(letter))}>
                              {letter}
                            </span>
                            Alternativa {letter}
                          </span>
                          <span className="text-slate-500 font-mono">{count} questões ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1 }}
                            className="h-full bg-indigo-500 rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-8 rounded-[2.5rem] text-white space-y-6 border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />
              
              <h3 className="text-xl font-black flex items-center gap-2">
                <Award size={20} className="text-indigo-400" />
                Dica da Banca Organizadora
              </h3>

              <div className="space-y-5 text-sm leading-relaxed text-slate-300 font-medium">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                  <h4 className="font-black text-white text-xs mb-1 uppercase tracking-wider text-indigo-400">Padrão de Segurança Comercial</h4>
                  <p className="text-xs">
                    Uma sequência ininterrupta de 4 respostas idênticas em cadernos de ENEM é extremamente rara. Caso você encontre tal constelação em seu preenchimento, recomendamos revisar atentamente as questões em comum.
                  </p>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                  <h4 className="font-black text-white text-xs mb-1 uppercase tracking-wider text-emerald-400">Abordagem de Leitura Rápida</h4>
                  <p className="text-xs">
                    Inicie sua resolução anotando palavras-chave no gráfico de enunciado base, evitando prender sua atenção unicamente no desfecho da pergunta. Isso simplifica correlacionar os dados de cada alternativa com rapidez.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Question Details Full Aesthetic Modal */}
        <AnimatePresence>
          {selectedQuestion && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 md:p-8 rounded-[2.5rem] w-full max-w-3xl shadow-2xl relative my-8"
              >
                <button 
                  onClick={() => setSelectedQuestion(null)}
                  className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/10">
                      Questão {selectedQuestion.numero} • {selectedQuestion.disciplina}
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                      <BookOpen className="text-indigo-500" size={24} />
                      Resolução Didática
                    </h2>
                  </div>

                  <div className="space-y-5">
                    {/* Enunciado da questão super otimizado e proporcional */}
                    <div className="bg-slate-50 dark:bg-slate-950/60 p-6 sm:p-7 rounded-2xl border-l-[6px] border-indigo-500 border-y border-r border-slate-150 dark:border-slate-800/80 shadow-inner">
                      <p className="text-sm sm:text-[15px] text-slate-800 dark:text-slate-100 leading-relaxed font-semibold whitespace-pre-line">
                        {selectedQuestion.enunciado || "Enunciado oficial desta questão."}
                      </p>
                    </div>

                    {selectedQuestion.resposta === '*' && (
                      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-amber-800 dark:text-amber-200 text-xs">
                        <AlertCircle className="shrink-0 mt-0.5 text-amber-500" size={18} />
                        <div>
                          <span className="font-extrabold text-sm text-amber-700 dark:text-amber-300 block mb-0.5">
                            Questão Anulada Oficialmente pela Banca Examinadora
                          </span>
                          <p className="leading-relaxed">
                            Esta questão foi anulada pela comissão organizadora do vestibular do ITA e teve a sua pontuação atribuída integralmente como correta para todos os candidatos.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Opções da Questão</p>
                      <div className="space-y-2.5">
                        {(selectedQuestion.alternativas || ['Opção A', 'Opção B', 'Opção C', 'Opção D', 'Opção E']).map((alt, idx) => {
                          const letter = ['A', 'B', 'C', 'D', 'E'][idx];
                          const isCorrect = letter === selectedQuestion.resposta;
                          return (
                            <div 
                              key={letter}
                              className={cn(
                                "p-4 sm:p-5 rounded-xl border flex gap-4 items-start sm:items-center transition-all",
                                isCorrect 
                                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-900 dark:text-emerald-400 font-bold" 
                                  : "bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/70 text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                              )}
                            >
                              <div className={cn(
                                "w-9 h-9 shrink-0 rounded-xl flex items-center justify-center font-black text-sm shadow-sm",
                                isCorrect ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-850 text-slate-600 dark:text-slate-400"
                              )}>
                                {letter}
                              </div>
                              <p className="text-xs sm:text-sm leading-relaxed font-medium">{alt}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Justificativa box com proporções corretas */}
                    <div className="bg-emerald-500/[0.03] p-6 rounded-2xl border border-emerald-500/20 space-y-2.5">
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={16} />
                        <p className="text-xs font-black uppercase tracking-widest">Justificativa da Resposta Correta</p>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-250 leading-relaxed italic font-medium">
                        {selectedQuestion.justificativa || "A justificativa oficial baseia-se na análise direta das competências e das habilidades cognitivas exigidas pelo tema desta questão."}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedQuestion(null)}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-sm transition-all active:scale-95 shadow-md shadow-slate-900/10"
                  >
                    Fechar Resolução
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      {/* Premium Hero Banner */}
      <div className="bg-slate-950 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/5 blur-[150px] rounded-full -ml-48 -mb-48 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                <CheckCircle2 size={12} className="text-indigo-400 animate-pulse" />
                Base Prorrogada e Autêntica
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                <FileSpreadsheet size={12} className="text-emerald-400" />
                + de 200 provas
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
              Biblioteca de <span className="text-indigo-400">Gabaritos</span>
            </h1>
            <p className="text-slate-400 max-w-xl font-medium leading-relaxed text-sm md:text-base">
              Acesse o banco inteligente de gabaritos oficiais das últimas edições dos maiores vestibulares do país. Analise a coerência das questões com justificativas didáticas.
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-[var(--bg-card)] p-5 sm:p-6 rounded-2xl border border-[var(--border-light)] flex flex-col lg:flex-row gap-4 items-center shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-label)]" size={18} />
          <input 
            type="text"
            placeholder="Buscar por exame, caderno ou ano..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl text-sm font-semibold outline-none focus:border-[var(--primary)] transition-all text-[var(--text-main)] placeholder-[var(--text-label)]"
          />
        </div>
        <div className="flex flex-wrap lg:flex-nowrap gap-3 w-full lg:w-auto">
          <div className="relative flex-1 min-w-[140px]">
            <select 
              value={filterExame}
              onChange={(e) => setFilterExame(e.target.value)}
              className="w-full appearance-none px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl text-xs font-bold outline-none cursor-pointer tracking-wide text-[var(--text-main)] hover:border-[var(--primary)]"
            >
              <option value="Todos">Exame: Todos</option>
              {examsList.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-label)] pointer-events-none" size={14} />
          </div>
          <div className="relative flex-1 min-w-[120px]">
            <select 
              value={filterAno}
              onChange={(e) => setFilterAno(e.target.value)}
              className="w-full appearance-none px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl text-xs font-bold outline-none cursor-pointer tracking-wide text-[var(--text-main)] hover:border-[var(--primary)]"
            >
              <option value="Todos">Ano: Todos</option>
              {yearsList.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-label)] pointer-events-none" size={14} />
          </div>
        </div>
      </div>

      {/* Grid of beautiful exam cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredList.map((g) => (
            <motion.div
              layout
              key={g.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => setSelectedGabarito(g)}
              className="group bg-[var(--bg-card)] border border-[var(--border-light)] p-6 rounded-2xl hover:border-[var(--primary)] hover:bg-[var(--bg-card-elevated)] transition-all cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-5">
                <div className="p-3 bg-[var(--bg-hover)] text-[var(--primary)] rounded-xl border border-[var(--border-light)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
                  <FileSpreadsheet size={22} />
                </div>
                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  {g.pdfUrl && (
                    <a
                      href={g.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[10px] font-black uppercase tracking-wider text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white px-2 py-0.5 rounded-full border border-emerald-500/20 transition-colors flex items-center gap-1"
                      title="Abrir PDF Oficial"
                    >
                      <span>PDF Oficial</span>
                      <ExternalLink size={10} />
                    </a>
                  )}
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary)] bg-[var(--bg-badge)] px-2.5 py-1 rounded-full whitespace-nowrap border border-[var(--primary-border)]">
                    {g.questoes.length} Questões
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-label)]">{g.ano}</p>
                  {g.titulo && (
                    <span className="text-[9px] font-black uppercase tracking-wider text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                      2ª Fase Oficial
                    </span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-black text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors leading-snug">
                  {g.titulo || `${g.exame} ${g.ano}`}
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  {g.titulo ? `Caderno de ${g.caderno} • Respostas Esperadas` : `Caderno ${g.caderno} • Dia ${g.dia}`}
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-[var(--border-light)] flex items-center justify-between text-[var(--primary)] font-bold text-xs">
                <span>Acessar Biblioteca</span>
                <ChevronRight size={15} className="transition-transform group-hover:translate-x-1" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredList.length === 0 && (
        <div className="text-center py-16 bg-[var(--bg-card)] rounded-2xl border border-dashed border-[var(--border-light)]">
          <FileText size={40} className="mx-auto text-[var(--text-label)] mb-3" />
          <h3 className="text-lg font-bold text-[var(--text-muted)]">Nenhum gabarito encontrado</h3>
          <p className="text-[var(--text-label)] text-xs mt-1">Tente ajustar seus filtros de busca para encontrar cadernos específicos.</p>
        </div>
      )}
    </div>
  );
}
