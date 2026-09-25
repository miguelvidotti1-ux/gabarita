import { Vestibular } from "../types";

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  subject: string;
  image?: string;
}

export interface SubjectConfig {
  count: number;
  difficulty: 'fácil' | 'médio' | 'difícil';
  topics?: string[];
}

export async function generateQuestions(
  vestibular: Vestibular,
  subjects: Record<string, SubjectConfig>
): Promise<Question[]> {
  const vestibularStyles: Record<Vestibular, string> = {
    [Vestibular.ENEM]: "Foque em questões contextualizadas, interdisciplinares, com textos longos e interpretação de gráficos/tabelas, seguindo o padrão da matriz de referência do ENEM.",
    [Vestibular.FUVEST]: "Foque em questões diretas, com alto rigor acadêmico, exigindo profundo conhecimento teórico e capacidade de análise crítica.",
    [Vestibular.UNICAMP]: "Foque em questões que exigem raciocínio lógico, interdisciplinaridade e capacidade de relacionar conceitos com o cotidiano, com um estilo mais dissertativo e analítico.",
    [Vestibular.UNESP]: "Foque em questões que equilibram teoria e prática, com textos de apoio claros e objetivos, cobrindo todo o conteúdo programático do ensino médio.",
    [Vestibular.UERJ]: "Foque em questões que valorizam a leitura e a interpretação de textos, com um estilo que pode ser mais literário ou analítico, dependendo da disciplina.",
    [Vestibular.ITA]: "Foque em questões de altíssima complexidade, exigindo raciocínio matemático e físico avançado, com um nível de exigência muito superior ao ensino médio padrão.",
    [Vestibular.FGV]: "Foque em questões analíticas com forte viés para lógica, matemática financeira, economia e atualidades, exigindo capacidade de interpretação de dados complexos.",
    [Vestibular.MACKENZIE]: "Foque em questões diretas e abrangentes, com boa base conceitual em humanidades e linguagens, seguindo o perfil tradicional da universidade.",
    [Vestibular.PUC_SP]: "Foque em questões que exigem análise crítica e contextualização histórica e sociológica, com textos de base de alta qualidade.",
    [Vestibular.UNIFESP]: "Foque em questões com rigor científico, especialmente em biologia e química, mantendo um nível de profundidade acadêmica elevado.",
    [Vestibular.ANHEMBI_MORUMBI]: "Foque em questões diversificadas que cobrem a base nacional comum com foco em aplicação prática e mercado de trabalho.",
    [Vestibular.ESTACIO]: "Foque em questões objetivas que cobrem o conteúdo do ensino médio de forma clara e direta.",
    [Vestibular.UNISINOS]: "Foque em questões que integram conhecimentos gerais com inovações tecnológicas e desafios contemporâneos."
  };

  const subjectEntries = Object.entries(subjects);
  if (subjectEntries.length > 1) {
    const results = await Promise.all(subjectEntries.map(([subject, config]) => 
      generateQuestionsInternal(vestibular, vestibularStyles[vestibular], { [subject]: config })
    ));
    return results.flat();
  }

  return generateQuestionsInternal(vestibular, vestibularStyles[vestibular], subjects);
}

async function generateQuestionsInternal(
  vestibular: string,
  style: string,
  subjects: Record<string, SubjectConfig>
): Promise<Question[]> {
  const subjectPrompt = Object.entries(subjects).map(([subject, config]) => 
     `${subject}${config.topics && config.topics.length > 0 ? ` (Tópicos específicos: ${config.topics.join(", ")})` : ""}: ${config.count} questões, dificuldade ${config.difficulty}`
  ).join(", ");

  const res = await fetch('/api/gemini/questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vestibular, style, subjectPrompt }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Falha ao gerar questões: HTTP ${res.status}`);
  }

  return res.json();
}

export async function generateEssayTheme(
  vestibular: Vestibular,
  previousThemes: { year: number | string; theme: string }[]
): Promise<string> {
  const themesContext = previousThemes
    .map((t) => `${t.year}: ${t.theme}`)
    .join("\n");

  try {
    const res = await fetch('/api/gemini/essay-theme', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vestibular, themesContext }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.theme) {
        return data.theme;
      }
    } else {
      console.warn(`[Tema Redação] Status ${res.status} ao contactar API.`);
    }
  } catch (err) {
    console.warn("[Tema Redação] Erro de rede ou servidor:", err);
  }

  // Backup seguro para garantir que o aluno nunca receba erro ou fique sem proposta
  const fallbackThemes: Record<string, string[]> = {
    [Vestibular.ENEM]: [
      "Perspectivas para a inclusão produtiva e dignidade da população idosa no Brasil",
      "Desafios para a preservação hídrica e a segurança alimentar no Brasil",
      "A proteção dos direitos das crianças na era dos influenciadores digitais",
      "Caminhos para combater a evasão escolar e democratizar o ensino técnico no Brasil",
      "O impacto da inteligência artificial na empregabilidade e direitos trabalhistas no Brasil",
      "Desafios para a valorização dos profissionais da educação básica no Brasil"
    ],
    [Vestibular.FUVEST]: [
      "O papel da dúvida na construção do conhecimento científico contemporâneo",
      "A mercantilização do tempo e do afeto nas sociedades conectadas",
      "Utopia e distopia: os rumos da imaginação humana no século XXI"
    ],
    [Vestibular.UNICAMP]: [
      "A linguagem como instrumento de poder e exclusão social no Brasil",
      "A cultura do cancelamento e os limites do debate público na internet"
    ]
  };

  const pool = fallbackThemes[vestibular] || fallbackThemes[Vestibular.ENEM];
  return pool[Math.floor(Math.random() * pool.length)];
}

export interface StudyMaterial {
  topicName: string;
  summary: string;
  mindMap: {
    label: string;
    children: { label: string; description: string }[];
  };
  staticMindMapUrl?: string;
}

export async function generateStudyMaterial(
  vestibular: Vestibular,
  subject: string,
  topics: string[]
): Promise<StudyMaterial[]> {
  if (topics.length > 1) {
    const results = await Promise.all(topics.map(topic => 
      generateStudyMaterialInternal(vestibular, subject, [topic])
    ));
    return results.flat();
  }

  return generateStudyMaterialInternal(vestibular, subject, topics);
}

async function generateStudyMaterialInternal(
  vestibular: string,
  subject: string,
  topics: string[]
): Promise<StudyMaterial[]> {
  const res = await fetch('/api/gemini/study-material', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vestibular, subject, topics }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Falha ao gerar material de estudo: HTTP ${res.status}`);
  }

  return res.json();
}

export interface StudyPlan {
  week: number;
  topic: string;
  focus: string;
  estimatedHours: number;
}

export async function generateStudyPlan(
  weakSubjects: string[],
  upcomingExams: string[],
  weeks: number = 4
): Promise<StudyPlan[]> {
  const res = await fetch('/api/gemini/study-plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ weakSubjects, upcomingExams, weeks }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Falha ao gerar plano de estudo: HTTP ${res.status}`);
  }

  return res.json();
}

export interface Competency {
  id?: number;
  name: string;
  score: number;
  strengths: string;
  weaknesses: string;
  improvementExample: string;
  // CorrigeBot extended fields
  nome?: string;
  nota?: number;
  nota_max?: number;
  conceito?: string;
  comentario?: string;
}

export interface CorrigeBotSugestaoIntervencao {
  agente?: string;
  acao?: string;
  meio?: string;
  finalidade?: string;
  detalhamento?: string;
}

export interface EssayAnalysis {
  grade: number;
  competencies: Competency[];
  generalCorrection: string;
  // CorrigeBot official rubric extensions
  zerada?: boolean;
  motivo_zeramento?: string | null;
  nota_final?: number;
  conceito_geral?: string;
  pontos_fortes?: string[];
  pontos_melhoria?: string[];
  sugestao_proposta_intervencao?: CorrigeBotSugestaoIntervencao;
  parecer_geral?: string;
  banca?: string;
  banca_nome?: string;
  linhas_estimadas?: number;
  redacao_id?: string;
}

export interface CorrigeBotBancaInfo {
  id: string;
  nome: string;
  tipo_texto: string;
  nota_maxima: number | null;
  exige_proposta_intervencao: boolean;
  limite_linhas: number | null;
  num_competencias: number;
  observacao?: string | null;
}

export async function getCorrigeBotBancas(): Promise<CorrigeBotBancaInfo[]> {
  try {
    const res = await fetch('/api/redacao/bancas');
    if (!res.ok) throw new Error('Falha ao carregar bancas');
    const data = await res.json();
    return data.bancas || [];
  } catch (err) {
    console.warn('Erro ao carregar bancas de redação:', err);
    return [];
  }
}

export async function corrigirRedacaoCorrigeBot(
  banca: string,
  tema: string,
  texto: string,
  propostaNumero?: number,
  usuarioId?: string
): Promise<EssayAnalysis> {
  const res = await fetch('/api/redacao/corrigir', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      banca,
      tema,
      texto,
      proposta_numero: propostaNumero,
      usuario_id: usuarioId,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = Array.isArray(data.erro) ? data.erro[0] : (data.erro || `Falha na correção: HTTP ${res.status}`);
    throw new Error(msg);
  }

  const c = data.correcao || data;

  // Normalizar para garantir compatibilidade com EssayAnalysis
  const comps: Competency[] = (c.competencias || []).map((comp: any, idx: number) => ({
    id: comp.id || (idx + 1),
    name: comp.nome || comp.name || `Competência ${idx + 1}`,
    nome: comp.nome || comp.name || `Competência ${idx + 1}`,
    score: comp.nota ?? comp.score ?? (comp.conceito === 'Excelente' ? 200 : comp.conceito === 'Ótimo' ? 160 : comp.conceito === 'Bom' ? 120 : comp.conceito === 'Regular' ? 80 : 40),
    nota: comp.nota,
    nota_max: comp.nota_max ?? 200,
    conceito: comp.conceito,
    comentario: comp.comentario || comp.strengths || comp.weaknesses || '',
    strengths: comp.strengths || (comp.conceito ? `Desempenho avaliado como ${comp.conceito}` : 'Atendeu aos critérios da banca'),
    weaknesses: comp.weaknesses || (comp.conceito === 'Excelente' ? 'Sem desvios expressivos' : 'Reforce a fundamentação e precisão textual'),
    improvementExample: comp.improvementExample || comp.comentario || 'Pratique aprofundando o repertório e a coesão.'
  }));

  const grade = c.nota_final ?? c.grade ?? (c.conceito_geral === 'Excelente' ? 1000 : c.conceito_geral === 'Ótimo' ? 850 : c.conceito_geral === 'Bom' ? 700 : c.conceito_geral === 'Regular' ? 500 : 350);

  return {
    grade,
    competencies: comps,
    generalCorrection: c.parecer_geral || c.generalCorrection || 'Redação analisada com sucesso conforme as diretrizes da banca.',
    zerada: c.zerada,
    motivo_zeramento: c.motivo_zeramento,
    nota_final: c.nota_final,
    conceito_geral: c.conceito_geral,
    pontos_fortes: c.pontos_fortes || [],
    pontos_melhoria: c.pontos_melhoria || [],
    sugestao_proposta_intervencao: c.sugestao_proposta_intervencao,
    parecer_geral: c.parecer_geral,
    banca: c.banca,
    banca_nome: c.banca_nome,
    linhas_estimadas: c.linhas_estimadas,
    redacao_id: c.redacao_id
  };
}

const vestibularCriteria: Record<Vestibular, string> = {
  [Vestibular.ENEM]: "Use as 5 competências do ENEM (0-200 cada, total 1000). Analise detalhadamente a proposta de intervenção e o repertório sociocultural.",
  [Vestibular.FUVEST]: "Use a escala de 0 a 50 pontos. Foque em: Desenvolvimento do tema (0-20), Coerência (0-15) e Correção gramatical (0-15).",
  [Vestibular.UNICAMP]: "Use a escala de 0 a 12 pontos conforme os critérios oficiais da COMVEST (Proposta temática, Gênero, Leitura, Articulação).",
  [Vestibular.UNESP]: "Use a escala de 0 a 11 (ou 0 a 100 conforme o ano). Foque em Tema, Estrutura e Expressão.",
  [Vestibular.UERJ]: "Use a escala de 0 a 10. Foque em Domínio da norma culta, Estrutura argumentativa e Coerência.",
  [Vestibular.ITA]: "Use a escala de 0 a 10. Foque em Tema e estrutura, Coerência e coesão, e Modalidade gramatical.",
  [Vestibular.FGV]: "Use a escala de 0 a 10. Valorize o raciocínio lógico, a clareza argumentativa e o repertório específico da área escolhida.",
  [Vestibular.MACKENZIE]: "Use a escala de 0 a 10. Foque em clareza, coesão e domínio da norma culta.",
  [Vestibular.PUC_SP]: "Use a escala de 0 a 10. Valorize a capacidade crítica e a articulação de idéias.",
  [Vestibular.UNIFESP]: "Use a escala de 0 a 20. Analise o domínio da norma culta, a estrutura textual e o desenvolvimento do tema.",
  [Vestibular.ANHEMBI_MORUMBI]: "Use a escala de 0 a 10. Foque em clareza e objetividade na defesa de um ponto de vista.",
  [Vestibular.ESTACIO]: "Use a escala de 0 a 10. Valorize a estrutura básica da dissertação e a correção gramatical.",
  [Vestibular.UNISINOS]: "Use a escala de 0 a 10. Foque na inovação das idéias e na qualidade da argumentação."
};

export async function analyzeEssayFromImage(
  vestibular: Vestibular,
  theme: string,
  imageFile: File
): Promise<EssayAnalysis> {
  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = error => reject(error);
    });
  };

  const base64Image = await toBase64(imageFile);
  const criteria = vestibularCriteria[vestibular] || "";

  const res = await fetch('/api/gemini/analyze-essay-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vestibular,
      theme,
      base64Image,
      mimeType: imageFile.type,
      criteria,
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Falha na análise da imagem da redação: HTTP ${res.status}`);
  }

  return res.json();
}

export async function analyzeEssay(
  vestibular: Vestibular,
  theme: string,
  essay: string
): Promise<EssayAnalysis> {
  const criteria = vestibularCriteria[vestibular] || "";

  const res = await fetch('/api/gemini/analyze-essay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vestibular,
      theme,
      essay,
      criteria,
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Falha na análise da redação: HTTP ${res.status}`);
  }

  return res.json();
}

export interface DailyStudyTip {
  title: string;
  category: string;
  content: string;
  actionableSteps: string[];
  recommendedSubjects: string[];
  quote?: string;
}

export async function getDailyStudyTip(vestibular: string = 'ENEM'): Promise<DailyStudyTip> {
  try {
    const res = await fetch('/api/gemini/study-tip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vestibular }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data as DailyStudyTip;
  } catch (error) {
    console.warn("Fallback de dica de estudo acionado:", error);
    return getFallbackStudyTip(vestibular);
  }
}

function getFallbackStudyTip(vestibular: string): DailyStudyTip {
  const tipsByVestibular: Record<string, DailyStudyTip> = {
    'ENEM': {
      title: 'Dominando a Matriz de Referência e TRI no ENEM',
      category: 'Estratégia de Prova',
      content: `No ENEM, a Teoria de Resposta ao Item (TRI) penaliza inconsistências pedagógicas. Resolver questões fáceis e médias com total atenção garante uma nota coerente e alta, evitando que o algoritmo considere seus acertos difíceis como mero "chute".`,
      actionableSteps: [
        'Comece pelas questões curtas e diretas de Linguagens e Ciências Humanas.',
        'Ao ler os textos motivadores, grife imediatamente a comanda final da questão.',
        'Mantenha o foco absoluto no projeto de texto na Redação (Competência 3).'
      ],
      recommendedSubjects: ['Matemática', 'Redação', 'Ciências da Natureza'],
      quote: 'A consistência na TRI garante sua aprovação com nota máxima.'
    },
    'FUVEST': {
      title: 'Rigor Conceitual e Domínio de Obras Literárias na FUVEST',
      category: 'Técnica de Estudo',
      content: `A FUVEST exige alto aprofundamento conceitual e capacidade de análise crítica. As questões de primeira e segunda fase costumam relacionar obras literárias obrigatórias com o contexto histórico e social da época.`,
      actionableSteps: [
        'Revise as análises das obras literárias obrigatórias com foco em personagens e temas sociais.',
        'Resolva exercícios discursivos escrevendo respostas diretas e fundamentadas.',
        'Monitore o tempo: reserve ao menos 3 minutos por questão na 1ª fase.'
      ],
      recommendedSubjects: ['Literatura', 'História', 'Física'],
      quote: 'A profundidade conceitual transforma esforço em resultado.'
    },
    'UNICAMP': {
      title: 'Interpretação Textual e Leitura Crítica na UNICAMP',
      category: 'Estratégia de Prova',
      content: `A UNICAMP valoriza a capacidade do candidato em articular conceitos do cotidiano com raciocínio acadêmico. Na redação, atente-se rigorosamente às especificidades do gênero textual solicitado.`,
      actionableSteps: [
        'Leia atentamente o enunciado e identifique exatamente a hipótese testada.',
        'Na redação, adeque a linguagem ao interlocutor definido na proposta.',
        'Treine a resolução de gráficos e dados estatísticos contemporâneos.'
      ],
      recommendedSubjects: ['Biologia', 'Redação', 'Geografia'],
      quote: 'Ler com criticidade é o caminho para gabaritar a UNICAMP.'
    }
  };

  return tipsByVestibular[vestibular] || {
    title: `Estratégia Eficiente para o Vestibular ${vestibular}`,
    category: 'Estratégia de Prova',
    content: `Para obter o melhor rendimento no ${vestibular}, faça simulados cronometrados periodicamente. Identifique os tópicos de maior incidência na banca e priorize seu estudo ativo via resolução de questões.`,
    actionableSteps: [
      'Faça pelo menos 15 questões inéditas da banca hoje.',
      'Anote as dúvidas recorrentes no seu Caderno de Erros.',
      'Revise os conceitos fundamentais antes de avançar para tópicos avançados.'
    ],
    recommendedSubjects: ['Matemática', 'Linguagens'],
    quote: 'Pequenos progressos diários resultam em grandes aprovações.'
  };
}
