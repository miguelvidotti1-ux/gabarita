import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { spotifyRouter } from "./server/spotifyRoutes";

async function startServer() {
  const app = express();
  const PORT = 3000;
  app.use(express.json({ limit: "20mb" }));
  app.use(cookieParser());

  // Mount Spotify OAuth 2.0 API routes
  app.use("/api/spotify", spotifyRouter);

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // ========== SYSTEM PROMPT — RESTRIÇÃO DE TÓPICO VESTBOT ==========
  const SYSTEM_PROMPT_VESTBOT = `Você é o VestBot, assistente especializado em vestibulares brasileiros.

REGRAS ABSOLUTAS:
1. Você SÓ responde perguntas sobre vestibulares e temas diretamente relacionados.
2. Se a pergunta NÃO for sobre vestibulares, recuse educadamente.
3. Nunca invente dados. Se não souber, diga que não tem a informação atualizada.

TÓPICOS PERMITIDOS:
- Conteúdo programático (matérias, disciplinas, temas que caem)
- Datas das provas (ENEM, FUVEST, UNICAMP, UNESP, etc.)
- Sistema de notas (como funciona a nota do ENEM, TRI, etc.)
- Funcionamento de cada vestibular (fases, formatos, questões)
- Notas de corte em faculdades (médias mínimas por curso/universidade)
- Dicas de estudo e preparação para vestibulares
- Editais, inscrições e regras dos exames
- Cotas, sisu, fuvest, vagas

RECUSA PADRÃO (use exatamente esta frase):
"Desculpe, eu só respondo perguntas sobre vestibulares. Posso ajudar com conteúdo das provas, datas, sistema de notas, funcionamento dos exames ou notas de corte. O que você gostaria de saber?"

FORMATO DE RESPOSTA:
- Seja direto e objetivo
- Use linguagem acessível para estudantes
- Cite fontes quando mencionar dados específicos
- Para notas de corte, sempre diga que valores podem mudar a cada ano
- Máximo 4 parágrafos por resposta`;

  const RECUSA_PADRAO = "Desculpe, eu só respondo perguntas sobre vestibulares. Posso ajudar com conteúdo das provas, datas, sistema de notas, funcionamento dos exames ou notas de corte. O que você gostaria de saber?";

  // ========== PALAVRAS-CHAVE DE VESTIBULAR ==========
  const PALAVRAS_CHAVE = [
    // Exames
    'enem', 'fuvest', 'unicamp', 'unesp', 'vestibular', 'vestibulares',
    'fuvesp', 'puc', 'mackenzie', 'fgv', 'ufrj', 'ufmg', 'ufsc', 'ufpr',
    'ufba', 'ufpe', 'unb', 'ufrgs', 'ufscar',
    // Processos
    'sisu', 'prouni', 'fies', 'cotas', 'vagas', 'inscrição', 'inscricao',
    'edital', 'resultado', 'chamada', 'lista de espera',
    // Conteúdo
    'prova', 'questão', 'questao', 'questões', 'questoes', 'gabarito',
    'redação', 'redacao', 'dissertação', 'dissertacao',
    'matemática', 'matematica', 'português', 'portugues', 'física', 'fisica',
    'química', 'quimica', 'biologia', 'história', 'historia', 'geografia',
    'filosofia', 'sociologia', 'inglês', 'ingles', 'espanhol', 'literatura',
    'linguagens', 'ciências', 'ciencias', 'humanas', 'natureza',
    // Notas e avaliação
    'nota', 'notas', 'nota de corte', 'tri', 'média', 'media', 'médias',
    'pontuação', 'pontuacao', 'acerto', 'acertos', 'erro', 'erros',
    'desempenho', 'treineiro', 'treineiros',
    // Datas e preparação
    'data', 'datas', 'dia', 'dias', 'calendário', 'calendario',
    'simulado', 'simulados', 'estudar', 'estudo', 'estudos', 'revisão',
    'revisao', 'cronograma', 'plano de estudo',
    // Faculdades e cursos
    'faculdade', 'faculdades', 'universidade', 'universidades',
    'curso', 'cursos', 'medicina', 'direito', 'engenharia', 'computação',
    'computacao', 'administração', 'administracao', 'odontologia',
    'enfermagem', 'arquitetura', 'psicologia', 'veterinária', 'veterinaria',
    // Termos gerais
    'aprovado', 'aprovação', 'aprovacao', 'reprovado', 'reprovação',
    'classificação', 'classificacao', 'ranking', 'desempate',
    'segunda fase', 'primeira fase', 'fase única', 'fase unica',
    'conhecimentos gerais', 'específica', 'especifica',
    'composição', 'composicao', 'prova objetiva', 'discursiva'
  ];

  // ========== PALAVRAS DE BLOQUEIO (OFF-TOPIC) ==========
  const PALAVRAS_BLOQUEIO = [
    'receita', 'receitas', 'cozinhar', 'comida', 'restaurante',
    'filme', 'filmes', 'série', 'series', 'netflix', 'cinema',
    'jogo', 'jogos', 'videogame', 'playstation', 'xbox',
    'futebol', 'vôlei', 'volei', 'basquete', 'esporte',
    'namoro', 'relacionamento', 'paquera',
    'previsão', 'previsao', 'clima', 'tempo', 'chuva',
    'cotação', 'cotacao', 'dólar', 'dolar', 'bitcoin', 'ação', 'acoes',
    'carro', 'moto', 'veículo', 'veiculo',
    'viagem', 'passagem', 'hotel', 'resort',
    'dieta', 'exercício', 'exercicio', 'academia', 'musculação',
    'política', 'politica', 'eleição', 'eleicao', 'partido', 'governo',
    'celebridade', 'famoso', 'famosa', 'influencer',
    'música', 'musica', 'banda', 'show', 'concerto',
    'comprar', 'vender', 'preço', 'preco', 'desconto',
    'horóscopo', 'horoscopo', 'astrologia', 'signo',
    'piada', 'charada', 'adivinha'
  ];

  function isPerguntaVestibular(texto: string): boolean {
    const textoLower = texto.toLowerCase();

    // 1. Verificar palavras de bloqueio primeiro
    for (const palavra of PALAVRAS_BLOQUEIO) {
      if (textoLower.includes(palavra)) {
        // Exceção: se também tem palavra de vestibular, permite
        const temVestibular = PALAVRAS_CHAVE.some((p) => textoLower.includes(p));
        if (!temVestibular) {
          return false;
        }
      }
    }

    // 2. Verificar se tem pelo menos uma palavra-chave de vestibular
    for (const palavra of PALAVRAS_CHAVE) {
      if (textoLower.includes(palavra)) {
        return true;
      }
    }

    // 3. Verificar padrões de pergunta sobre vestibular
    const padroes = [
      /como\s+funciona\s+(o\s+)?(enem|fuvest|unicamp|unesp|vestibular)/i,
      /nota\s+de\s+corte/i,
      /quando\s+(é|será|vai\s+ser)\s+(a\s+)?prova/i,
      /quais\s+(são\s+)?as\s+(matérias|materias|disciplinas)/i,
      /quantas\s+(questões|questoes)/i,
      /quanto\s+(vale|pesa)/i,
      /preciso\s+de\s+quantos\s+acertos/i,
      /como\s+(é|eh)\s+a\s+prova/i,
      /como\s+(estudar|se\s+preparar)/i,
      /qual\s+a\s+(nota|média|media)\s+(mínima|minima)/i,
    ];
    for (const padrao of padroes) {
      if (padrao.test(textoLower)) {
        return true;
      }
    }

    // 4. Se não tem nenhuma palavra-chave nem padrão, bloqueia
    return false;
  }

  // Handler compartilhado para /api/chat e /api/gemini/chat
  const handleChatRequest = async (req: express.Request, res: express.Response) => {
    try {
      const { pergunta, message, historico, history } = req.body;
      const questionText = (pergunta || message || '').trim();
      const rawHistoryList = Array.isArray(historico) ? historico : (Array.isArray(history) ? history : []);

      if (!questionText) {
        return res.status(400).json({ erro: 'Pergunta vazia', error: 'Pergunta vazia' });
      }

      // VALIDAÇÃO: verificar se é sobre vestibular
      if (!isPerguntaVestibular(questionText)) {
        return res.json({
          resposta: RECUSA_PADRAO,
          text: RECUSA_PADRAO,
          bloqueado: true,
          topico: 'off-topic',
        });
      }

      const rawHistory = rawHistoryList
        .map((msg: any) => ({
          role: msg.role === 'ai' || msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user',
          parts: [{ text: msg.content || msg.text || '' }],
        }))
        .filter((item: any) => item.parts[0].text.trim().length > 0);

      // Garantir que a primeira mensagem não seja do model (exigência da API)
      while (rawHistory.length > 0 && rawHistory[0].role === 'model') {
        rawHistory.shift();
      }

      const formattedContents = [
        ...rawHistory,
        {
          role: 'user',
          parts: [{ text: questionText }],
        },
      ];

      const candidateModels = [
        'gemini-flash-latest',
        'gemini-3.8-flash',
        'gemini-3.6-flash',
        'gemini-3.1-flash-lite',
      ];

      let response: any = null;
      let lastError: any = null;

      for (const modelName of candidateModels) {
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents: formattedContents,
            config: {
              systemInstruction: SYSTEM_PROMPT_VESTBOT,
            },
          });
          if (response && response.text) {
            break;
          }
        } catch (mErr: any) {
          console.warn(`Tentativa com ${modelName} falhou:`, mErr?.message);
          lastError = mErr;
        }
      }

      if (!response || !response.text) {
        throw lastError || new Error('Não foi possível obter resposta dos modelos de IA.');
      }

      res.json({
        resposta: response.text,
        text: response.text,
        bloqueado: false,
        topico: 'vestibular',
      });
    } catch (err: any) {
      console.error('Erro no chat com IA:', err);
      res.status(500).json({ erro: 'Erro ao processar: ' + (err?.message || ''), error: err?.message || 'Erro ao processar mensagem' });
    }
  };

  // API Routes
  app.post("/api/chat", handleChatRequest);
  app.post("/api/gemini/chat", handleChatRequest);

  app.get("/api/chat/sugestoes", (_req, res) => {
    res.json({
      sugestoes: [
        'Como funciona a nota do ENEM?',
        'Qual a nota de corte para Medicina na USP?',
        'Quais matérias caem no ENEM?',
        'Quando são as provas da FUVEST?',
        'Como funciona a segunda fase da UNICAMP?',
        'Quantas questões tem o ENEM?',
        'Como é a redação do ENEM?',
        'Qual a diferença entre Sisu e Prouni?'
      ]
    });
  });

  app.post("/api/gemini/questions", async (req, res) => {
    try {
      const { vestibular, style, subjectPrompt } = req.body;
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

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
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
      if (!text) return res.status(500).json({ error: "Sem resposta do modelo" });
      res.json(JSON.parse(text));
    } catch (err: any) {
      console.error("Erro ao gerar questões:", err);
      res.status(500).json({ error: err?.message || "Erro ao gerar questões" });
    }
  });

  app.post("/api/gemini/essay-theme", async (req, res) => {
    try {
      const { vestibular, themesContext } = req.body;
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

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      const text = response.text || "";
      res.json({ theme: text.trim().replace(/^"|"$/g, "") });
    } catch (err: any) {
      console.error("Erro ao gerar tema de redação:", err);
      res.status(500).json({ error: err?.message || "Erro ao gerar tema de redação" });
    }
  });

  app.post("/api/gemini/study-material", async (req, res) => {
    try {
      const { vestibular, subject, topics } = req.body;
      const prompt = `Você é um professor especialista em vestibulares brasileiros. 
Gere materiais de estudo (resumo e mapa mental) para a disciplina de ${subject} do vestibular ${vestibular}.
Foque nos seguintes tópicos: ${Array.isArray(topics) ? topics.join(", ") : topics}.

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
      { "label": "subtópico 1", "description": "explicação curta" }
    ]
  }
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
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
      if (!text) return res.status(500).json({ error: "Sem resposta do modelo" });
      res.json(JSON.parse(text));
    } catch (err: any) {
      console.error("Erro ao gerar material de estudo:", err);
      res.status(500).json({ error: err?.message || "Erro ao gerar material" });
    }
  });

  app.post("/api/gemini/study-plan", async (req, res) => {
    try {
      const { weakSubjects = [], upcomingExams = [], weeks = 4 } = req.body;
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

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
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
      if (!text) return res.status(500).json({ error: "Sem resposta do modelo" });
      res.json(JSON.parse(text));
    } catch (err: any) {
      console.error("Erro ao gerar plano de estudos:", err);
      res.status(500).json({ error: err?.message || "Erro ao gerar plano de estudos" });
    }
  });

  app.post("/api/gemini/analyze-essay", async (req, res) => {
    try {
      const { vestibular, theme, essay, criteria } = req.body;
      const prompt = `Você é um corretor de redação experiente e rigoroso do vestibular ${vestibular}.
Analise a redação abaixo com base no tema: "${theme}".

Critérios específicos do ${vestibular}: ${criteria}

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

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
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
      if (!text) return res.status(500).json({ error: "Sem resposta do modelo" });
      res.json(JSON.parse(text));
    } catch (err: any) {
      console.error("Erro na análise da redação:", err);
      res.status(500).json({ error: err?.message || "Erro ao analisar redação" });
    }
  });

  app.post("/api/gemini/analyze-essay-image", async (req, res) => {
    try {
      const { vestibular, theme, base64Image, mimeType = "image/jpeg", criteria } = req.body;
      const prompt = `Você é um corretor de redação experiente e rigoroso do vestibular ${vestibular}.
Analise a imagem da redação abaixo com base no tema: "${theme}".

Passo 1: Transcreva o texto da imagem da redação.
Passo 2: Analise o texto transcrito seguindo os critérios abaixo.

Critérios específicos do ${vestibular}: ${criteria}

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

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [
          { text: prompt },
          { inlineData: { data: base64Image, mimeType: mimeType } }
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
      if (!text) return res.status(500).json({ error: "Sem resposta do modelo" });
      res.json(JSON.parse(text));
    } catch (err: any) {
      console.error("Erro na análise da redação por imagem:", err);
      res.status(500).json({ error: err?.message || "Erro ao analisar imagem da redação" });
    }
  });

  app.post("/api/gemini/recommendation", async (req, res) => {
    const { performanceData, vestibular } = req.body;
    res.json({ plan: "Estude Matemática e Física." });
  });

  app.post("/api/gemini/study-tip", async (req, res) => {
    try {
      const { vestibular = "ENEM" } = req.body;
      const prompt = `Você é um mentor especialista em aprovação nos principais vestibulares do Brasil (ENEM, FUVEST, UNICAMP, UNESP, UERJ, ITA, FGV, etc.).
Gere uma "Dica de Estudo do Dia" altamente estratégica, prática e motivadora focada nas especificidades do vestibular: ${vestibular}.

Retorne exclusivamente um JSON com este formato:
{
  "title": "Título chamativo e objetivo da dica de estudo",
  "category": "Estratégia de Prova | Gestão de Tempo | Técnica de Estudo | Redação | Revisão e Memorização",
  "content": "Texto detalhado e explicativo de 2 a 3 parágrafos curtos com dicas valiosas especificamente adaptadas ao estilo e cobrança do vestibular ${vestibular}.",
  "actionableSteps": [
    "Passo prático 1 para aplicar hoje nos estudos",
    "Passo prático 2 para aplicar hoje nos estudos",
    "Passo prático 3 para aplicar hoje nos estudos"
  ],
  "recommendedSubjects": ["Matemática", "Redação"],
  "quote": "Frase motivadora curta focada na jornada até a aprovação"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              category: { type: Type.STRING },
              content: { type: Type.STRING },
              actionableSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              recommendedSubjects: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              quote: { type: Type.STRING },
            },
            required: ["title", "category", "content", "actionableSteps", "recommendedSubjects"],
          },
        },
      });

      const text = response.text;
      if (!text) {
        return res.status(500).json({ error: "Sem resposta do modelo Gemini" });
      }

      const tip = JSON.parse(text);
      res.json(tip);
    } catch (err: any) {
      console.error("Erro ao gerar dica de estudo no servidor:", err);
      res.status(500).json({ error: err?.message || "Erro ao processar dica de estudo" });
    }
  });

  // ============================================================
  // TRANSCRIÇÃO DE ÁUDIO (MICROFONE) COM MODELO gemini-3.5-transcribe
  // ============================================================
  app.post("/api/gemini/transcribe", async (req, res) => {
    try {
      const { audioData, mimeType = "audio/webm", prompt } = req.body;
      if (!audioData) {
        return res.status(400).json({ error: "Dados de áudio não fornecidos" });
      }

      // Remover prefixo data:audio/...;base64, se presente
      const cleanBase64 = audioData.includes(",") ? audioData.split(",")[1] : audioData;

      const audioPart = {
        inlineData: {
          mimeType: mimeType || "audio/webm",
          data: cleanBase64,
        },
      };

      const instruction = prompt || "Transcreva este áudio com precisão no idioma original falado (português do Brasil). Retorne apenas o texto transcrito, sem introduções ou explicações.";

      const response = await ai.models.generateContent({
        model: "gemini-3.5-transcribe",
        contents: {
          parts: [audioPart, { text: instruction }],
        },
      });

      const transcription = response.text?.trim() || "";
      return res.json({ text: transcription });
    } catch (err: any) {
      console.error("Erro na transcrição de áudio com gemini-3.5-transcribe:", err);
      return res.status(500).json({ error: err?.message || "Erro ao transcrever áudio com gemini-3.5-transcribe" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
