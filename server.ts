import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
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
import { chatStore } from "./server/chatStore";
import { onboardingStore, PERGUNTAS_ONBOARDING, MATERIAS, HORAS_MAP } from "./server/onboardingStore";
import { boletimStore, ServicoBoletim, ServicoAnaliseNotas } from "./server/boletimStore";
import multer from "multer";
import { mercadoPagoRouter, PLANOS_PADRAO } from "./server/mercadoPagoRoutes";

async function startServer() {
  const app = express();
  const PORT = 3000;
  app.use(express.json({ limit: "20mb" }));
  app.use(cookieParser());

  // Mount Spotify OAuth 2.0 API routes
  app.use("/api/spotify", spotifyRouter);

  // Mount Mercado Pago API routes
  app.use("/api/mercadopago", mercadoPagoRouter);

  // Endpoint de Planos Padrão
  app.get("/api/planos", (_req, res) => {
    res.json({ planos: PLANOS_PADRAO });
  });

  // Endpoint de Pesquisa de Mercado / Black Friday
  app.post("/api/pesquisa", (req, res) => {
    try {
      const dados = req.body || {};
      const filePath = path.join(process.cwd(), "data", "pesquisas.json");
      let lista: any[] = [];
      if (fs.existsSync(filePath)) {
        try {
          lista = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        } catch (_) {}
      }
      lista.push({
        id: "pq_" + Date.now(),
        ...dados,
        criado_em: new Date().toISOString()
      });
      fs.writeFileSync(filePath, JSON.stringify(lista, null, 2), "utf-8");
      res.json({ ok: true, mensagem: "Pesquisa registrada com sucesso!" });
    } catch (e: any) {
      res.status(500).json({ ok: false, erro: e?.message || "Erro ao salvar pesquisa" });
    }
  });

  app.get("/api/pesquisa", (_req, res) => {
    try {
      const filePath = path.join(process.cwd(), "data", "pesquisas.json");
      if (fs.existsSync(filePath)) {
        const lista = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        return res.json({ total: lista.length, respostas: lista });
      }
      res.json({ total: 0, respostas: [] });
    } catch (e: any) {
      res.json({ total: 0, respostas: [] });
    }
  });

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  const DEFAULT_CANDIDATE_MODELS = [
    'gemini-3.1-flash-lite',
    'gemini-3.5-transcribe',
    'gemini-3.8-flash',
    'gemini-flash-latest',
  ];

  // Armazena cooldown temporário para modelos que excederam a cota diária ou por minuto
  const modelCooldowns = new Map<string, number>();

  async function generateWithFallback(options: {
    contents: any;
    config?: any;
    candidateModels?: string[];
  }) {
    const models = options.candidateModels || DEFAULT_CANDIDATE_MODELS;
    let lastError: any = null;

    for (const modelName of models) {
      // Se o modelo estiver em cooldown devido a cota esgotada (429), pula para o próximo modelo
      const cooldownUntil = modelCooldowns.get(modelName) || 0;
      if (Date.now() < cooldownUntil) {
        continue;
      }

      // Clona e higieniza a configuração conforme diretrizes do modelo
      const cleanConfig = options.config ? { ...options.config } : {};
      if (
        modelName.startsWith('gemini-3.') ||
        modelName.startsWith('gemini-4') ||
        modelName.includes('flash')
      ) {
        delete cleanConfig.temperature;
        delete cleanConfig.topP;
        delete cleanConfig.topK;
        delete cleanConfig.candidateCount;
      }

      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: options.contents,
            config: cleanConfig,
          });
          if (response && response.text) {
            return response;
          }
        } catch (err: any) {
          lastError = err;
          const msg = err?.message || '';
          const is429 =
            err?.status === 429 ||
            msg.includes('429') ||
            msg.includes('RESOURCE_EXHAUSTED') ||
            msg.includes('Quota exceeded') ||
            msg.includes('rate-limits');

          const isTransient =
            err?.status === 503 ||
            msg.includes('503') ||
            msg.includes('high demand') ||
            msg.includes('UNAVAILABLE');

          console.warn(`[Gemini API] Info com modelo ${modelName} (tentativa ${attempt + 1}):`, is429 ? 'Cota de requisições atingida (429), ativando modelo alternativo...' : msg);

          // Se a cota do modelo esgotou (429):
          if (is429) {
            // Se for cota diária (per day), aplica cooldown longo (4h), caso contrário 60s
            const isDaily = msg.includes('per day') || msg.includes('PerDay') || msg.includes('hours') || msg.includes('RetryInfo');
            const cooldownTime = isDaily ? Date.now() + 4 * 60 * 60 * 1000 : Date.now() + 60 * 1000;
            modelCooldowns.set(modelName, cooldownTime);
            if (modelName === 'gemini-3.8-flash' || modelName === 'gemini-flash-latest') {
              modelCooldowns.set('gemini-3.8-flash', cooldownTime);
              modelCooldowns.set('gemini-flash-latest', cooldownTime);
            }
            break;
          }

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

  // ========== SYSTEM PROMPT — TUTOR INTELIGENTE / VESTBOT (SEM RESTRIÇÃO DE TÓPICO) ==========
  const SYSTEM_PROMPT_VESTBOT = `Você é o Tutor de IA do Gabarita (VestBot), um assistente educacional completo, inteligente, prestativo e amigável.
Você tem liberdade total para responder a qualquer dúvida e pergunta do usuário, sobre todos os temas:
- Conteúdo acadêmico, matérias escolares e disciplinas (Matemática, Física, Química, Biologia, História, Geografia, Filosofia, Sociologia, Literatura, Português, Inglês, Redação, etc.)
- Vestibulares brasileiros e exames (ENEM, FUVEST, UNICAMP, UNESP, IME, ITA, UERJ, etc.)
- Resoluções de questões, explicações passo a passo, resumos e macetes de estudo
- Temas de ciências, tecnologia, artes, curiosidades gerais e perguntas cotidianas que o usuário fizer

DIRETRIZES:
- Responda prontamente com entusiasmo e sem recusas por tópico.
- Seja claro, didático, didaticamente estruturado e empático.
- Use formatação Markdown (negrito, listas, tópicos, código ou fórmulas) sempre que facilitar o entendimento.`;

  // Helper para identificar o usuário (suporta auth token, header customizado ou fallback de sessão)
  const getUsuarioId = (req: express.Request): string => {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      if (token) return token.slice(0, 32);
    }
    const headerId = req.headers['x-usuario-id'];
    if (typeof headerId === 'string' && headerId.trim()) {
      return headerId.trim();
    }
    if (req.cookies && req.cookies.gabarita_usuario_id) {
      return req.cookies.gabarita_usuario_id;
    }
    return 'usuario_padrao';
  };

  // Limite máximo de caracteres/tokens enviado à IA por conversa
  const LIMITE_MENSAGENS = 5000;

  // ---------- CHAT: CONVERSAS SALVAS ----------

  // Lista as conversas do usuário, da mais recente para a mais antiga
  app.get('/api/chat/conversas', (req: express.Request, res: express.Response) => {
    try {
      const usuarioId = getUsuarioId(req);
      const conversas = chatStore.listarConversas(usuarioId);
      res.json({ conversas });
    } catch (err: any) {
      console.error('Erro ao listar conversas:', err);
      res.status(500).json({ erro: 'Erro ao listar conversas' });
    }
  });

  // Cria uma nova conversa vazia
  app.post('/api/chat/conversas', (req: express.Request, res: express.Response) => {
    try {
      const usuarioId = getUsuarioId(req);
      const titulo = (req.body?.titulo || 'Nova conversa').trim();
      const nova = chatStore.criarConversa(usuarioId, titulo || 'Nova conversa');
      res.status(201).json({ conversa_id: nova.id, titulo: nova.titulo });
    } catch (err: any) {
      console.error('Erro ao criar conversa:', err);
      res.status(500).json({ erro: 'Erro ao criar conversa' });
    }
  });

  // Restaura toda a conversa ao voltar para a página
  app.get('/api/chat/conversas/:cid/mensagens', (req: express.Request, res: express.Response) => {
    try {
      const usuarioId = getUsuarioId(req);
      const cid = parseInt(req.params.cid, 10);
      if (isNaN(cid)) {
        return res.status(400).json({ erro: 'ID de conversa inválido' });
      }

      const dados = chatStore.obterMensagens(cid, usuarioId);
      if (!dados) {
        return res.status(404).json({ erro: 'Conversa não encontrada' });
      }

      res.json(dados);
    } catch (err: any) {
      console.error('Erro ao obter mensagens da conversa:', err);
      res.status(500).json({ erro: 'Erro ao obter mensagens' });
    }
  });

  // Exclui uma conversa e suas mensagens
  app.delete('/api/chat/conversas/:cid', (req: express.Request, res: express.Response) => {
    try {
      const usuarioId = getUsuarioId(req);
      const cid = parseInt(req.params.cid, 10);
      if (isNaN(cid)) {
        return res.status(400).json({ erro: 'ID de conversa inválido' });
      }

      const sucesso = chatStore.excluirConversa(cid, usuarioId);
      if (!sucesso) {
        return res.status(404).json({ erro: 'Conversa não encontrada' });
      }

      res.json({ sucesso: true, mensagem: 'Conversa excluída' });
    } catch (err: any) {
      console.error('Erro ao excluir conversa:', err);
      res.status(500).json({ erro: 'Erro ao excluir conversa' });
    }
  });

  // Handler para processamento de mensagens no VestBot com histórico persistido
  const handleChatRequest = async (req: express.Request, res: express.Response) => {
    try {
      const usuarioId = getUsuarioId(req);
      const { pergunta, message, historico, history, conversa_id } = req.body;
      const questionText = (pergunta || message || '').trim();

      if (!questionText) {
        return res.status(400).json({ erro: 'Pergunta vazia', error: 'Pergunta vazia' });
      }

      // 1. Obter ou criar a conversa correspondente
      let cid = conversa_id ? parseInt(String(conversa_id), 10) : null;
      let conversa = (cid && !isNaN(cid)) ? chatStore.obterConversa(cid, usuarioId) : null;

      if (!conversa) {
        conversa = chatStore.criarConversa(usuarioId, 'Nova conversa');
        cid = conversa.id;
      }

      // 2. Se a conversa ainda tiver o título padrão, gerar título baseado na 1ª pergunta
      if (conversa.titulo === 'Nova conversa' || !conversa.titulo.trim()) {
        const tituloSugerido = questionText.length > 55 ? questionText.slice(0, 52) + '...' : questionText;
        chatStore.atualizarTitulo(conversa.id, usuarioId, tituloSugerido);
        conversa.titulo = tituloSugerido;
      }

      // 3. Salvar pergunta do usuário
      chatStore.adicionarMensagem(conversa.id, usuarioId, 'user', questionText);

      // 4. Histórico para a IA respeitando LIMITE_MENSAGENS
      // Prioriza mensagens salvas da conversa (excluindo a pergunta atual recém adicionada)
      const anteriores = conversa.mensagens.slice(0, -1);
      const mensagensSelecionadas: typeof anteriores = [];
      let totalCaracteres = 0;

      for (let i = anteriores.length - 1; i >= 0; i--) {
        const m = anteriores[i];
        if (totalCaracteres + m.content.length > LIMITE_MENSAGENS) {
          break;
        }
        totalCaracteres += m.content.length;
        mensagensSelecionadas.unshift(m);
      }

      // Se não havia mensagens salvas suficientes mas veio raw history no payload, usa como fallback
      const rawFallback = (Array.isArray(historico) ? historico : (Array.isArray(history) ? history : []))
        .map((msg: any) => ({
          role: msg.role === 'ai' || msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user',
          parts: [{ text: msg.content || msg.text || '' }],
        }))
        .filter((item: any) => item.parts[0].text.trim().length > 0);

      const contentsFromDB = mensagensSelecionadas.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const baseHistory = contentsFromDB.length > 0 ? contentsFromDB : rawFallback;

      // Garantir que a primeira mensagem não seja do model
      while (baseHistory.length > 0 && baseHistory[0].role === 'model') {
        baseHistory.shift();
      }

      const formattedContents = [
        ...baseHistory,
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

      const respostaTexto = response.text || 'Desculpe, não consegui formular uma resposta no momento.';

      // 6. Salvar resposta do assistente no banco
      chatStore.adicionarMensagem(conversa.id, usuarioId, 'assistant', respostaTexto);

      res.json({
        resposta: respostaTexto,
        text: respostaTexto,
        conversa_id: conversa.id,
        titulo: conversa.titulo,
        bloqueado: false,
        topico: 'vestibular',
      });
    } catch (err: any) {
      console.error('Erro no chat com IA:', err);
      res.status(500).json({
        erro: 'Erro ao processar: ' + (err?.message || ''),
        error: err?.message || 'Erro ao processar mensagem',
      });
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
        candidateModels: ['gemini-3.1-flash-lite', 'gemini-3.5-transcribe'],
        contents: {
          parts: [audioPart, { text: instruction }],
        },
      });

      const transcription = response.text?.trim() || "";
      return res.json({ text: transcription });
    } catch (err: any) {
      console.warn("Aviso na transcrição de áudio por IA:", err?.message || err);
      const isQuota = String(err?.message || '').includes('429') || String(err?.message || '').includes('RESOURCE_EXHAUSTED');
      return res.json({ 
        text: "", 
        error: isQuota 
          ? "Cota de transcrição por IA temporariamente atingida. O áudio foi capturado pelo microfone do navegador ou você pode digitar sua mensagem."
          : (err?.message || "Erro ao transcrever áudio por IA.")
      });
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

  // ========== ROTAS DE ONBOARDING E PERFIL ==========
  function extractUsuarioId(req: express.Request): string {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const raw = authHeader.substring(7).trim();
      if (raw.startsWith("auth_vesthub_")) {
        try {
          const decoded = Buffer.from(raw.replace("auth_vesthub_", ""), "base64").toString("utf-8");
          const email = decoded.split(":")[0];
          if (email) return email;
        } catch (e) {}
      }
      return raw;
    }
    if (req.headers["x-usuario-id"]) {
      return String(req.headers["x-usuario-id"]);
    }
    if (req.cookies && req.cookies.usuario_id) {
      return String(req.cookies.usuario_id);
    }
    if (req.query?.usuario_id) {
      return String(req.query.usuario_id);
    }
    return "usuario_padrao";
  }

  // 1. Obter perguntas estruturadas do questionário
  const handleGetPerguntas = (_req: express.Request, res: express.Response) => {
    return res.json({ perguntas: PERGUNTAS_ONBOARDING });
  };
  app.get("/api/auth/onboarding/perguntas", handleGetPerguntas);
  app.get("/api/onboarding/perguntas", handleGetPerguntas);

  // 2. Salvar respostas do onboarding e calcular resumo
  const handlePostOnboarding = (req: express.Request, res: express.Response) => {
    try {
      const respostas = req.body?.respostas || req.body || {};
      const uid = String(req.body?.usuario_id || extractUsuarioId(req));
      const email = req.body?.email || (uid.includes("@") ? uid : undefined);
      const nome = req.body?.nome;

      // Validação de campos obrigatórios
      const requiredFields = ["etapa", "vestibulares", "prazo", "piores_materias", "autoavaliacao", "horas_semana", "horas_fds"];
      const missing = requiredFields.filter((field) => {
        const val = respostas[field];
        if (val === undefined || val === null || val === "") return true;
        if (Array.isArray(val) && val.length === 0) return true;
        return false;
      });

      if (missing.length > 0) {
        return res.status(400).json({
          sucesso: false,
          erro: `Campos obrigatórios não preenchidos: ${missing.join(", ")}`
        });
      }

      const result = onboardingStore.salvarOnboarding(uid, respostas, { email, nome });
      return res.json(result);
    } catch (err: any) {
      console.error("[Onboarding API] Erro ao salvar respostas:", err);
      return res.status(500).json({ sucesso: false, erro: err?.message || "Erro interno ao salvar onboarding." });
    }
  };
  app.post("/api/auth/onboarding", handlePostOnboarding);
  app.post("/api/onboarding", handlePostOnboarding);

  // 3. Obter perfil e status de onboarding do usuário logado
  app.get("/api/auth/me", (req, res) => {
    const uid = extractUsuarioId(req);
    const user = onboardingStore.getOrCreateUser(uid);
    let parsedPerfil = null;
    if (user.perfil_json) {
      try {
        parsedPerfil = JSON.parse(user.perfil_json);
      } catch (e) {}
    }
    return res.json({
      uid: user.uid,
      nome: user.nome,
      email: user.email,
      onboarding_completo: user.onboarding_completo,
      perfil: parsedPerfil,
      piores_materias: user.piores_materias,
      vestibulares_alvo: user.vestibulares_alvo,
      resumo_plano: user.resumo_plano || null
    });
  });

  // 4. Relatório administrativo do usuário
  app.get("/api/admin/usuario/:uid/relatorio", (req, res) => {
    const uid = req.params.uid;
    const user = onboardingStore.obterUsuario(uid);
    if (!user) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }
    let parsedRelatorio = null;
    if (user.perfil_json) {
      try {
        parsedRelatorio = JSON.parse(user.perfil_json);
      } catch (e) {}
    }
    return res.json({
      uid: user.uid,
      nome: user.nome,
      email: user.email,
      onboarding_completo: user.onboarding_completo,
      relatorio: parsedRelatorio,
      resumo: user.resumo_plano || null,
      piores_materias: user.piores_materias,
      vestibulares_alvo: user.vestibulares_alvo,
      atualizado_em: user.atualizado_em
    });
  });

  // ========== ROTAS DE BOLETIM ESCOLAR E CALIBRAÇÃO DE NOTAS ==========
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 8 * 1024 * 1024 } // 8 MB
  });

  const ALLOWED_FOTO = new Set(["png", "jpg", "jpeg", "webp"]);

  // 1. Extração de notas a partir da foto do boletim com IA
  app.post("/api/onboarding/notas/foto", upload.single("boletim"), async (req, res) => {
    try {
      let fileBuffer: Buffer | null = null;
      let mimetype = "image/jpeg";

      if (req.file) {
        const ext = (req.file.originalname.split(".").pop() || "").toLowerCase();
        if (!ALLOWED_FOTO.has(ext)) {
          return res.status(400).json({ erro: "Formato inválido. Use PNG, JPG ou WEBP" });
        }
        fileBuffer = req.file.buffer;
        mimetype = req.file.mimetype;
      } else if (req.body?.foto || req.body?.boletim) {
        const raw = String(req.body.foto || req.body.boletim);
        const match = raw.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
        if (match) {
          mimetype = match[1];
          fileBuffer = Buffer.from(match[2], "base64");
        } else {
          fileBuffer = Buffer.from(raw, "base64");
        }
      }

      if (!fileBuffer || fileBuffer.length === 0) {
        return res.status(400).json({ erro: "Envie a foto do boletim" });
      }

      if (fileBuffer.length > 8 * 1024 * 1024) {
        return res.status(400).json({ erro: "Imagem muito grande (máx. 8 MB)" });
      }

      const resultado = await ServicoBoletim.extrairDaFoto(fileBuffer, mimetype, ai);
      if (resultado.erro) {
        return res.status(422).json(resultado);
      }

      const extraidas: { materia: string; nome: string; nota: number }[] = [];
      const nao: string[] = [];

      for (const [nome, nota] of Object.entries(resultado.notas || {})) {
        const chave = ServicoBoletim.mapear(nome);
        if (chave && MATERIAS[chave]) {
          try {
            extraidas.push({
              materia: chave,
              nome: MATERIAS[chave],
              nota: ServicoAnaliseNotas.normalizar(nota)
            });
          } catch (e) {}
        } else {
          nao.push(nome);
        }
      }

      return res.json({
        notas_extraidas: extraidas,
        nao_identificadas: nao.slice(0, 8),
        media_boletim: resultado.media_boletim
      });
    } catch (err: any) {
      console.error("[Boletim Foto] Erro:", err);
      return res.status(500).json({ erro: "Falha ao processar boletim. Tente digitar manualmente.", fallback: "manual" });
    }
  });

  // 2. Salvar notas confirmadas (da foto ou digitadas) e calcular análise
  app.post("/api/onboarding/notas", (req, res) => {
    try {
      const d = req.body || {};
      const origem = d.origem === "foto" ? "foto" : "manual";
      let me: number | null = null;
      if (d.media_escola !== undefined && d.media_escola !== null && d.media_escola !== "") {
        me = ServicoAnaliseNotas.normalizar(d.media_escola);
      }

      const notas: Record<string, number> = {};
      for (const [k, v] of Object.entries(d.notas || {})) {
        if (!MATERIAS[k]) continue;
        try {
          const val = ServicoAnaliseNotas.normalizar(v);
          if (val >= 0) notas[k] = val;
        } catch (e) {}
      }

      if (Object.keys(notas).length < 3) {
        return res.status(400).json({ erro: "Informe notas de pelo menos 3 matérias (escala 0–10)" });
      }

      const uid = String(d.usuario_id || extractUsuarioId(req));
      const usuario = onboardingStore.obterUsuario(uid);
      const analise = ServicoAnaliseNotas.analisar(notas, me, usuario);

      if (!analise) {
        return res.status(400).json({ erro: "Nenhuma matéria válida analisada." });
      }

      boletimStore.salvarBoletim(uid, origem, me, notas, analise);
      return res.json({ sucesso: true, analise });
    } catch (err: any) {
      console.error("[Salvar Notas] Erro:", err);
      return res.status(500).json({ erro: err?.message || "Erro ao salvar notas do boletim." });
    }
  });

  // 3. Ver última análise do boletim do usuário
  app.get("/api/onboarding/notas/analise", (req, res) => {
    const uid = extractUsuarioId(req);
    const b = boletimStore.obterUltimoBoletim(uid);
    if (!b) {
      return res.json({ existe: false });
    }
    let parsedAnalise = null;
    try {
      parsedAnalise = JSON.parse(b.analise_json);
    } catch (e) {}
    return res.json({
      existe: true,
      origem: b.origem,
      media_geral: b.media_geral,
      media_escola: b.media_escola,
      analise: parsedAnalise
    });
  });

  // 4. Plano calibrado por questionário + notas do boletim
  app.get("/api/onboarding/plano", (req, res) => {
    try {
      const uid = extractUsuarioId(req);
      const u = onboardingStore.obterUsuario(uid);
      let perfil: any = {};
      if (u?.perfil_json) {
        try {
          perfil = JSON.parse(u.perfil_json);
        } catch (e) {}
      }

      const hs = (HORAS_MAP[String(perfil.horas_semana)] || 1.5) * 5 + (HORAS_MAP[String(perfil.horas_fds)] || 3) * 2;
      const b = boletimStore.obterUltimoBoletim(uid);

      if (!b) {
        return res.json({
          com_notas: false,
          horas_semanais: Math.round(hs * 10) / 10
        });
      }

      let analise: any = null;
      try {
        analise = JSON.parse(b.analise_json);
      } catch (e) {}

      if (!analise) {
        return res.json({
          com_notas: false,
          horas_semanais: Math.round(hs * 10) / 10
        });
      }

      const distribuicao = ServicoAnaliseNotas.distribuir(analise, perfil, Math.round(hs));
      return res.json({
        com_notas: true,
        horas_semanais: Math.round(hs * 10) / 10,
        resumo: analise.resumo,
        distribuicao
      });
    } catch (err: any) {
      console.error("[Onboarding Plano] Erro:", err);
      return res.status(500).json({ erro: "Erro ao gerar distribuição do plano." });
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
