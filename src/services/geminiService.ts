import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
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
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
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
  // Parallelize for any multiple subjects to improve speed
  if (subjectEntries.length > 1) {
    const results = await Promise.all(subjectEntries.map(([subject, config]) => 
      generateQuestionsInternal(ai, vestibular, vestibularStyles[vestibular], { [subject]: config })
    ));
    return results.flat();
  }

  return generateQuestionsInternal(ai, vestibular, vestibularStyles[vestibular], subjects);
}

async function generateQuestionsInternal(
  ai: GoogleGenAI,
  vestibular: string,
  style: string,
  subjects: Record<string, SubjectConfig>
): Promise<Question[]> {
  const subjectPrompt = Object.entries(subjects).map(([subject, config]) => 
     `${subject}${config.topics && config.topics.length > 0 ? ` (Tópicos específicos: ${config.topics.join(", ")})` : ""}: ${config.count} questões, dificuldade ${config.difficulty}`
  ).join(", ");

  const prompt = `Gere questões de múltipla escolha para o vestibular ${vestibular} sobre: ${subjectPrompt}.
  Estilo: ${style}
  Formato: 5 alternativas (A-E).
  Se houver imagem, forneça a URL no campo "image", senão null.
  Retorne APENAS um array JSON:
  [
    {
      "id": "string",
      "text": "enunciado",
      "options": ["A", "B", "C", "D", "E"],
      "correctAnswer": 0-4,
      "explanation": "explicação",
      "subject": "disciplina",
      "image": "URL ou null"
    }
  ]`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              text: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctAnswer: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
              subject: { type: Type.STRING },
              image: { type: Type.STRING, nullable: true },
            },
            required: ["id", "text", "options", "correctAnswer", "explanation", "subject"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
}

export async function generateEssayTheme(
  vestibular: Vestibular,
  previousThemes: { year: number; theme: string }[]
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  const themesContext = previousThemes
    .map((t) => `${t.year}: ${t.theme}`)
    .join("\n");

  const prompt = `Você é um especialista em bancas examinadoras de vestibulares brasileiros. 
  Gere um NOVO tema de redação inédito para o vestibular ${vestibular}.
  
  Contexto de temas anteriores do ${vestibular}:
  ${themesContext}
  
  Instruções:
  1. O tema deve seguir o estilo e a complexidade típicos do ${vestibular}.
  2. Considere eventos, debates sociais e notícias relevantes do início de 2026.
  3. O tema deve ser dissertativo-argumentativo.
  4. Retorne APENAS a frase temática central, CURTA e OBJETIVA (máximo 10 palavras), sem explicações adicionais.
  
  Exemplo de saída: "Os impactos da inteligência artificial generativa na integridade acadêmica do século XXI"`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return text.trim().replace(/^"|"$/g, "");
  } catch (error) {
    console.error("Error generating essay theme:", error);
    throw error;
  }
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
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

  if (topics.length > 1) {
    const results = await Promise.all(topics.map(topic => 
      generateStudyMaterialInternal(ai, vestibular, subject, [topic])
    ));
    return results.flat();
  }

  return generateStudyMaterialInternal(ai, vestibular, subject, topics);
}

async function generateStudyMaterialInternal(
  ai: GoogleGenAI,
  vestibular: string,
  subject: string,
  topics: string[]
): Promise<StudyMaterial[]> {
  const prompt = `Você é um professor especialista em vestibulares brasileiros. 
  Gere materiais de estudo (resumo e mapa mental) para a disciplina de ${subject} do vestibular ${vestibular}.
  Foque nos seguintes tópicos: ${topics.join(", ")}.
  
  Para CADA tópico, forneça:
  1. Um resumo explicativo de 3 a 5 parágrafos, ORGANIZADO EM TÓPICOS (use subtítulos, listas com marcadores e negrito para destacar conceitos-chave).
  SE O TÓPICO FOR "Funções", explique todos os tipos de funções (afim, quadrática, exponencial, logarítmica, etc.) e INCLUA EXEMPLOS COM LINKS DE IMAGENS (use markdown: ![alt](url)) para cada tipo de função.
  2. Um mapa mental estruturado com um nó central e 4 a 6 ramificações (nós filhos), cada um com uma breve descrição.
  
  Retorne um array de objetos JSON seguindo este esquema:
  {
    "topicName": "nome do tópico",
    "summary": "resumo em markdown",
    "mindMap": {
      "label": "nó central",
      "children": [
        { "label": "subtópico 1", "description": "explicação curta" },
        ...
      ]
    }
  }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              topicName: { type: Type.STRING },
              summary: { type: Type.STRING },
              mindMap: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  children: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        label: { type: Type.STRING },
                        description: { type: Type.STRING },
                      },
                      required: ["label", "description"],
                    },
                  },
                },
                required: ["label", "children"],
              },
            },
            required: ["topicName", "summary", "mindMap"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating study material:", error);
    throw error;
  }
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
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  const prompt = `Você é um mentor de estudos especialista em vestibulares.
  Com base nos pontos fracos do aluno: ${weakSubjects.join(", ")}
  E nos próximos exames: ${upcomingExams.join(", ")}
  
  Gere um plano de estudos detalhado de ${weeks} semanas (semana a semana).
  
  Retorne um array de objetos JSON seguindo este esquema:
  {
    "week": number (1-${weeks}),
    "topic": "tópico principal da semana",
    "focus": "foco principal da semana",
    "estimatedHours": number (horas estimadas)
  }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              week: { type: Type.INTEGER },
              topic: { type: Type.STRING },
              focus: { type: Type.STRING },
              estimatedHours: { type: Type.INTEGER },
            },
            required: ["week", "topic", "focus", "estimatedHours"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating study plan:", error);
    throw error;
  }
}

export interface Competency {
  name: string;
  score: number;
  strengths: string;
  weaknesses: string;
  improvementExample: string;
}

export interface EssayAnalysis {
  grade: number;
  competencies: Competency[];
  generalCorrection: string;
}

export async function analyzeEssayFromImage(
  vestibular: Vestibular,
  theme: string,
  imageFile: File
): Promise<EssayAnalysis> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

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

  const prompt = `Você é um corretor de redação experiente e rigoroso do vestibular ${vestibular}.
  Analise a imagem da redação abaixo com base no tema: "${theme}".
  
  Passo 1: Transcreva o texto da imagem da redação.
  Passo 2: Analise o texto transcrito seguindo os critérios abaixo.

  Critérios específicos do ${vestibular}: ${vestibularCriteria[vestibular]}

  Sua análise deve conter:
  1. Nota final (conforme a escala do ${vestibular}).
  2. Análise detalhada por competências/critérios.
     Para cada critério, forneça: 
     - nome: Nome do critério.
     - score: Nota atribuída.
     - strengths: Onde o estudante foi bem neste critério.
     - weaknesses: Onde o estudante pode melhorar neste critério.
     - improvementExample: Exemplo prático e técnico de como melhorar.
  3. Feedback geral e sugestões práticas de como melhorar a nota final.

  Retorne um JSON seguindo este esquema:
  {
    "grade": number,
    "competencies": [
      {
        "name": "string",
        "score": number,
        "strengths": "string",
        "weaknesses": "string",
        "improvementExample": "string"
      }
    ],
    "generalCorrection": "string"
  }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: [
        { text: prompt },
        { inlineData: { data: base64Image, mimeType: imageFile.type } }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            grade: { type: Type.NUMBER },
            competencies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  strengths: { type: Type.STRING },
                  weaknesses: { type: Type.STRING },
                  improvementExample: { type: Type.STRING },
                },
                required: ["name", "score", "strengths", "weaknesses", "improvementExample"],
              },
            },
            generalCorrection: { type: Type.STRING },
          },
          required: ["grade", "competencies", "generalCorrection"],
        },
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error analyzing essay from image:", error);
    throw error;
  }
}

export async function analyzeEssay(
  vestibular: Vestibular,
  theme: string,
  essay: string
): Promise<EssayAnalysis> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  
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

  const prompt = `Você é um corretor de redação experiente e rigoroso do vestibular ${vestibular}.
  Analise a redação abaixo com base no tema: "${theme}".
  
  Critérios específicos do ${vestibular}: ${vestibularCriteria[vestibular]}

  Sua análise deve conter:
  1. Nota final (conforme a escala do ${vestibular}).
  2. Análise detalhada por competências/critérios.
     Para cada critério, forneça: 
     - nome: Nome do critério.
     - score: Nota atribuída.
     - strengths: Onde o estudante foi bem neste critério.
     - weaknesses: Onde o estudante pode melhorar neste critério.
     - improvementExample: Exemplo prático e técnico de como melhorar.
  3. Feedback geral e sugestões práticas de como melhorar a nota final.

  Retorne um JSON seguindo este esquema:
  {
    "grade": number,
    "competencies": [
      {
        "name": "string",
        "score": number,
        "strengths": "string",
        "weaknesses": "string",
        "improvementExample": "string"
      }
    ],
    "generalCorrection": "string"
  }

  Redação:
  ${essay}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            grade: { type: Type.NUMBER },
            competencies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  strengths: { type: Type.STRING },
                  weaknesses: { type: Type.STRING },
                  improvementExample: { type: Type.STRING },
                },
                required: ["name", "score", "strengths", "weaknesses", "improvementExample"],
              },
            },
            generalCorrection: { type: Type.STRING },
          },
          required: ["grade", "competencies", "generalCorrection"],
        },
        systemInstruction: `Você é um corretor de redação profissional do ${vestibular}, focado em fornecer feedback construtivo, técnico e detalhado para estudantes.`
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error analyzing essay:", error);
    throw error;
  }
}
