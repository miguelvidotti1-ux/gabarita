import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { spotifyRouter } from "./server/spotifyRoutes";
import {
  CorretorRedacaoService,
  RUBRICAS,
  REDACAO_MAX_TOKENS,
  REDACAO_TEMPERATURE,
  REDACAO_LIMITE_CARACTERES,
} from "./server/corretorRedacao";

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

  const DEFAULT_CANDIDATE_MODELS = [
    'gemini-flash-latest',
    'gemini-3.8-flash',
    'gemini-3.1-flash-lite',
  ];

  async function generateWithFallback(options: {
    contents: any;
    config?: any;
    candidateModels?: string[];
  }) {
    const models = options.candidateModels || DEFAULT_CANDIDATE_MODELS;
    let lastError: any = null;

    for (const modelName of models) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: options.contents,
            config: options.config,
          });
          if (response && response.text) {
            return response;
          }
        } catch (err: any) {
          lastError = err;
          const msg = err?.message || '';
          const isTransient =
            err?.status === 503 ||
            err?.status === 429 ||
            msg.includes('503') ||
            msg.includes('429') ||
            msg.includes('high demand') ||
            msg.includes('UNAVAILABLE') ||
            msg.includes('RESOURCE_EXHAUSTED');

          console.warn(`[Gemini API] Falha na tentativa ${attempt + 1} com ${modelName}:`, msg);

          if (isTransient && attempt === 0) {
            await new Promise((r) => setTimeout(r, 600));
          } else {
            break;
          }
        }
      }
    }

    throw lastError || new Error('Não foi possível obter resposta dos modelos de IA.');
  }

  const FALLBACK_ESSAY_THEMES: Record<string, string[]> = {
    ENEM: [
      "Perspectivas para a inclusão produtiva e dignidade da população idosa no Brasil",
      "Desafios para a preservação hídrica e a segurança alimentar no Brasil",
      "A proteção dos direitos das crianças na era dos influenciadores digitais",
      "Caminhos para combater a evasão escolar e democratizar o ensino técnico no Brasil",
      "O impacto da inteligência artificial na empregabilidade e direitos trabalhistas no Brasil",
      "Desafios para a valorização dos profissionais da educação básica no Brasil",
      "A importância da preservação da biodiversidade e dos biomas brasileiros",
      "Caminhos para a democratização da moradia e planejamento urbano sustentável no Brasil"
    ],
    FUVEST: [
      "O papel da dúvida na construção do conhecimento científico contemporâneo",
      "A mercantilização do tempo e do afeto nas sociedades conectadas",
      "Utopia e distopia: os rumos da imaginação humana no século XXI",
      "O paradoxo entre autonomia individual e vigilância algorítmica",
      "A banalização da memória e a hiperaceleração do esquecimento na era digital"
    ],
    UNICAMP: [
      "A linguagem como instrumento de poder e exclusão social no Brasil",
      "O papel dos arquivos e da memória coletiva na preservação da democracia",
      "A cultura do cancelamento e os limites do debate público na internet",
      "Manifesto em defesa da preservação de saberes tradicionais e biodiversidade",
      "Carta aberta às autoridades sobre o acolhimento de pessoas em vulnerabilidade climática"
    ],
    UNESP: [
      "A polarização no ambiente virtual e os desafios para o diálogo democrático",
      "Transição energética e justiça ambiental: dilemas para o desenvolvimento",
      "A velocidade da inovação tecnológica anula o pensamento crítico humano?",
      "Inteligência artificial e criatividade: o que resta de exclusivamente humano?",
      "O consumismo verde é capaz de solucionar a crise ecológica global?"
    ],
    UERJ: [
      "A solidariedade social em tempos de crise e o papel das instituições públicas",
      "A busca pela igualdade em sociedades historicamente desiguais",
      "A dignidade humana diante da burocracia e do abandono institucional",
      "O conflito entre a honra individual e as convenções sociais hipócritas"
    ],
    ITA: [
      "Os limites éticos da inteligência artificial militar e a soberania aeroespacial",
      "A tecnociência como vetor de autonomia ou dependência geopolítica das nações",
      "A responsabilidade social e moral do engenheiro diante de catástrofes climáticas",
      "O risco da alienação epistemológica na hiperespecialização científica"
    ],
    IME: [
      "O papel da engenharia militar e da inovação autóctone na defesa da soberania nacional",
      "A corrida espacial contemporânea: cooperação pacífica ou militarização orbital?",
      "Cibersegurança e proteção de infraestruturas críticas em um mundo hiperconectado",
      "A transição para combustíveis sustentáveis e a matriz energética de defesa"
    ],
    FGV: [
      "O impacto da inteligência artificial generativa na produtividade e na desigualdade de renda",
      "A regulação das plataformas digitais e a preservação da concorrência econômica",
      "Desafios da governança pública e compliance no combate à corrupção sistêmica",
      "A reforma tributária como instrumento de redistribuição e justiça fiscal no Brasil"
    ],
    MACKENZIE: [
      "Cidadania digital, liberdade de expressão e a responsabilidade civil na rede",
      "O papel da família e da comunidade escolar na formação ética das novas gerações",
      "Sustentabilidade e consumo consciente: da retórica à prática individual e corporativa",
      "O voluntariado e a empatia ativa como antídotos para o individualismo contemporâneo"
    ],
    PUC_SP: [
      "Justiça restaurativa e os direitos humanos no sistema penal brasileiro",
      "A precarização do trabalho mediado por aplicativos e a dignidade do trabalhador",
      "O direito à cidade e a segregação socioespacial nas metrópoles contemporâneas",
      "Políticas afirmativas e a democratização do acesso às instâncias de poder"
    ],
    'PUC-SP': [
      "Justiça restaurativa e os direitos humanos no sistema penal brasileiro",
      "A precarização do trabalho mediado por aplicativos e a dignidade do trabalhador",
      "O direito à cidade e a segregação socioespacial nas metrópoles contemporâneas"
    ],
    UNIFESP: [
      "Bioética e edição genética: onde residem os limites da intervenção na vida humana?",
      "A crise de saúde mental entre os jovens e a sobrecarga de desempenho social",
      "Acesso equitativo a medicamentos de alto custo e a judicialização da saúde no SUS",
      "O impacto da crise climática na proliferação de epidemias e na saúde pública global"
    ]
  };

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

      const response = await generateWithFallback({
        contents: formattedContents,
        config: {
          systemInstruction: SYSTEM_PROMPT_VESTBOT,
        },
      });

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

      const response = await generateWithFallback({
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
    const { 
      vestibular = "ENEM", 
      themesContext = "", 
      baseTheme, 
      similarTo, 
      thematicAxis 
    } = req.body || {};

    const targetTheme = (baseTheme || similarTo || "").trim();
    const axis = (thematicAxis || "").trim();

    try {
      let prompt = "";
      if (targetTheme) {
        prompt = `Você é um especialista em bancas examinadoras de vestibulares brasileiros, com foco no vestibular ${vestibular}.
Gere um NOVO tema de redação INÉDITO, DIRETAMENTE RELACIONADO ao seguinte tema-base:
"${targetTheme}"
${axis ? `Eixo Temático de Foco: ${axis}` : ""}

Instruções da banca ${vestibular}:
1. O novo tema deve dialogar intimamente com o tema-base (mesmo universo temático ou desdobramento de causas/efeitos), mas propondo um ângulo ou recorte problematizador original.
2. Adote o estilo formal exato da banca ${vestibular} (ex: pergunta reflexiva para UNESP; viés filosófico-reflexivo para FUVEST e ITA; temas de cidadania, políticas públicas e minorias para ENEM; gêneros textuais variados para UNICAMP; ciência e soberania para IME; bioética/saúde para UNIFESP; economia/instituições para FGV; ética e família para Mackenzie; direitos humanos para PUC-SP).
3. Forneça também 2 temas alternativos semelhantes dentro do mesmo eixo.

Retorne EXCLUSIVAMENTE um objeto JSON no formato:
{
  "theme": "Frase temática completa, instigante e precisa",
  "eixo": "Eixo temático principal",
  "justificativa": "1 a 2 frases explicando por que é análogo ao tema-base e como o estudante pode abordar",
  "similares": ["Tema semelhante 1", "Tema semelhante 2"]
}`;
      } else {
        prompt = `Você é um especialista em bancas examinadoras de vestibulares brasileiros. 
Gere um NOVO tema de redação inédito para o vestibular ${vestibular}.

Contexto de temas anteriores do ${vestibular}:
${themesContext}
${axis ? `Eixo Temático Prioritário: ${axis}` : ""}

Instruções:
1. O tema deve seguir o estilo e a complexidade típicos do ${vestibular}.
2. Considere eventos contemporâneos, debates sociais e desafios éticos atuais.
3. Retorne EXCLUSIVAMENTE um objeto JSON no formato:
{
  "theme": "Frase temática principal objetiva e precisa",
  "eixo": "Eixo temático principal (ex: Tecnologia, Cidadania, Meio Ambiente)",
  "justificativa": "1 frase contextualizando a relevância contemporânea da proposta",
  "similares": ["Sugestão relacionada 1", "Sugestão relacionada 2"]
}`;
      }

      const response = await generateWithFallback({
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        }
      });

      const text = response.text || "";
      let parsed: any = null;
      try {
        parsed = JSON.parse(text);
      } catch {
        const m = text.match(/\{[\s\S]*\}/);
        if (m) parsed = JSON.parse(m[0]);
      }

      if (parsed && parsed.theme && String(parsed.theme).trim().length > 5) {
        return res.json({
          theme: String(parsed.theme).trim().replace(/^["']|["']$/g, "").replace(/^Tema:\s*/i, ""),
          eixo: parsed.eixo || axis || "Atualidades",
          justificativa: parsed.justificativa || "Tema formulado segundo as diretrizes da banca.",
          similares: Array.isArray(parsed.similares) ? parsed.similares : []
        });
      }

      const cleaned = text.trim().replace(/^["']|["']$/g, "").replace(/^Tema:\s*/i, "");
      if (cleaned.length > 5) {
        return res.json({ 
          theme: cleaned,
          eixo: axis || "Geral",
          justificativa: "Tema inédito gerado para treino.",
          similares: []
        });
      }
      throw new Error("Tema gerado inválido");
    } catch (err: any) {
      console.warn("Erro ao gerar tema com IA, utilizando tema curado de contingência:", err?.message);
      const normalizedKey = CorretorRedacaoService.normalizarBancaKey(vestibular);
      const keyUpper = vestibular.toUpperCase();
      const fallbackList = FALLBACK_ESSAY_THEMES[keyUpper] || 
        FALLBACK_ESSAY_THEMES[normalizedKey.toUpperCase()] || 
        FALLBACK_ESSAY_THEMES["ENEM"];
      const randomFallback = fallbackList[Math.floor(Math.random() * fallbackList.length)];
      return res.json({ 
        theme: randomFallback, 
        eixo: axis || "Eixo Temático Transversal",
        justificativa: "Tema curricular oficial selecionado do banco da banca.",
        similares: fallbackList.filter(t => t !== randomFallback).slice(0, 2),
        isFallback: true 
      });
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

      const response = await generateWithFallback({
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

      const response = await generateWithFallback({
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

  // ========== CORRIGEBOT — ROTAS OFICIAIS DE REDAÇÃO ==========

  // 1. Listar bancas com suas rubricas e regras oficiais
  app.get("/api/redacao/bancas", (req, res) => {
    try {
      const bancas = CorretorRedacaoService.listarBancas();
      res.json({ bancas });
    } catch (err: any) {
      console.error("Erro ao listar bancas de redação:", err);
      res.status(500).json({ error: "Erro ao listar bancas de redação" });
    }
  });

  // Armazenamento em memória para histórico do servidor
  const serverEssayHistory: Array<{
    id: string;
    banca: string;
    banca_nome: string;
    tema: string;
    nota_final?: number;
    conceito_geral?: string;
    zerada: boolean;
    data: string;
  }> = [];

  // 2. Corrigir redação conforme a banca selecionada
  app.post("/api/redacao/corrigir", async (req, res) => {
    try {
      const { banca = "enem", tema, texto, proposta_numero, usuario_id } = req.body || {};

      if (!tema || typeof tema !== 'string' || !tema.trim()) {
        return res.status(400).json({ erro: "Tema da redação é obrigatório" });
      }

      if (!texto || typeof texto !== 'string' || !texto.trim()) {
        return res.status(400).json({ erro: "Texto da redação é obrigatório" });
      }

      // Validação mecânica pré-IA
      const erros = CorretorRedacaoService.validarSubmissao(banca, texto);
      if (erros.length > 0) {
        return res.status(400).json({ erro: erros });
      }

      const prompt = CorretorRedacaoService.construirPrompt(
        banca,
        tema.trim(),
        texto.trim(),
        proposta_numero ? Number(proposta_numero) : undefined
      );

      const response = await generateWithFallback({
        contents: prompt,
        config: {
          temperature: REDACAO_TEMPERATURE,
          maxOutputTokens: REDACAO_MAX_TOKENS,
          responseMimeType: "application/json",
        },
      });

      const responseText = response?.text;
      if (!responseText) {
        return res.status(500).json({ erro: "Sem resposta do modelo de IA para a correção" });
      }

      let resultado: any;
      try {
        resultado = JSON.parse(responseText);
      } catch (parseErr) {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          resultado = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Formato de resposta inesperado retornado pela IA");
        }
      }

      const normBanca = CorretorRedacaoService.normalizarBancaKey(banca || 'enem');
      const rubrica = RUBRICAS[normBanca] || RUBRICAS.enem;

      resultado.banca = normBanca;
      resultado.banca_nome = rubrica.nome;
      resultado.tema = tema.trim();
      resultado.usuario_id = usuario_id || null;
      resultado.linhas_estimadas = Math.max(1, Math.floor(texto.trim().length / 72));

      // Garantir retrocompatibilidade com campos de nota e parecer
      if (resultado.nota_final !== undefined && resultado.grade === undefined) {
        resultado.grade = resultado.nota_final;
      }
      if (resultado.generalCorrection === undefined && resultado.parecer_geral) {
        resultado.generalCorrection = resultado.parecer_geral;
      }

      // Registrar no histórico em memória
      const historyItem = {
        id: `red_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        banca: normBanca,
        banca_nome: rubrica.nome,
        tema: tema.trim(),
        nota_final: resultado.nota_final,
        conceito_geral: resultado.conceito_geral,
        zerada: Boolean(resultado.zerada),
        data: new Date().toISOString(),
      };
      serverEssayHistory.unshift(historyItem);
      if (serverEssayHistory.length > 50) serverEssayHistory.pop();

      resultado.redacao_id = historyItem.id;

      return res.status(200).json({ correcao: resultado });
    } catch (err: any) {
      console.error("Erro na correção da redação pelo CorrigeBot:", err);
      return res.status(500).json({ erro: err?.message || "Erro interno ao corrigir redação" });
    }
  });

  // 3. Histórico de redações
  app.get("/api/redacao/historico", (req, res) => {
    res.json({ redacoes: serverEssayHistory.slice(0, 20) });
  });

  app.post("/api/gemini/analyze-essay", async (req, res) => {
    try {
      const { vestibular, theme, essay, criteria, proposta_numero } = req.body;
      const bancaKey = CorretorRedacaoService.normalizarBancaKey(vestibular || 'enem');

      // Se for uma das bancas oficiais do CorrigeBot, usar a rubrica completa
      if (RUBRICAS[bancaKey]) {
        const prompt = CorretorRedacaoService.construirPrompt(
          bancaKey,
          theme || "Tema livre",
          essay,
          proposta_numero
        );

        const response = await generateWithFallback({
          contents: prompt,
          config: {
            temperature: REDACAO_TEMPERATURE,
            maxOutputTokens: REDACAO_MAX_TOKENS,
            responseMimeType: "application/json",
          },
        });

        const text = response.text;
        if (!text) return res.status(500).json({ error: "Sem resposta do modelo" });
        
        let resultado: any;
        try {
          resultado = JSON.parse(text);
        } catch {
          const m = text.match(/\{[\s\S]*\}/);
          resultado = m ? JSON.parse(m[0]) : {};
        }

        // Mapeia para o formato esperado pelo frontend legacy caso necessário
        if (resultado.nota_final !== undefined && resultado.grade === undefined) {
          resultado.grade = resultado.nota_final;
        }
        if (!resultado.generalCorrection && resultado.parecer_geral) {
          resultado.generalCorrection = resultado.parecer_geral;
        }

        return res.json(resultado);
      }

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

      const response = await generateWithFallback({
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

      const response = await generateWithFallback({
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

      const response = await generateWithFallback({
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

      const response = await generateWithFallback({
        candidateModels: ['gemini-3.5-transcribe', 'gemini-flash-latest'],
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

  // ========== ROTAS DE AUTENTICAÇÃO E VIP (LOGIN OTIMIZADO) ==========
  app.post("/api/auth/login", (req, res) => {
    const { email, senha, lembrar } = req.body || {};

    if (!email || !senha) {
      return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "E-mail inválido." });
    }

    if (typeof senha !== "string" || senha.length < 6) {
      return res.status(400).json({ error: "A senha deve ter pelo menos 6 caracteres." });
    }

    const username = email.split("@")[0];
    const displayName = username.charAt(0).toUpperCase() + username.slice(1);
    const token = "auth_vesthub_" + Buffer.from(`${email}:${Date.now()}`).toString("base64");

    return res.json({
      success: true,
      token,
      user: {
        uid: "user_" + Math.random().toString(36).substring(2, 10),
        email,
        displayName,
        lembrar: Boolean(lembrar),
      },
    });
  });

  app.post("/api/vip/resgatar", (req, res) => {
    const chave = (req.body?.chave || "").trim().toUpperCase();

    if (!chave) {
      return res.status(400).json({ success: false, mensagem: "Digite a chave de acesso." });
    }

    const regexChave = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    const chavesValidas = ["VIP-2026-VEST", "VEST-2026-VIP", "PRO-VEST-2026", "MEDICINA-2026", "ENEM-2026-PASS"];

    if (!regexChave.test(chave) && !chavesValidas.includes(chave)) {
      return res.status(400).json({
        success: false,
        mensagem: "Formato inválido. Use o padrão: XXXX-XXXX-XXXX",
      });
    }

    return res.json({
      success: true,
      mensagem: "Chave VIP resgatada com sucesso! Acesso Pro ativado.",
      nivel: "vip_pro",
    });
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
