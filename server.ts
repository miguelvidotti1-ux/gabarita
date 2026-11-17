import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import cookieParser from "cookie-parser";
import { createServer as createViteServer } from "vite";
import { Type } from "@google/genai";
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
import { randomBytes, scryptSync, timingSafeEqual, createHmac } from "crypto";
import { mercadoPagoRouter, PLANOS_PADRAO } from "./server/mercadoPagoRoutes";
import { createSisuRouter } from "./server/routes/sisu";
import { createTreinoRouter } from "./server/routes/treino";
import { ai, generateWithFallback } from "./server/geminiClient";

async function startServer() {
  const app = express();
  const PORT = 3000;
  app.use(express.json({ limit: "20mb" }));
  app.use(cookieParser());

  // ========== MULTER (upload de arquivos) — deve vir ANTES de qualquer rota ==========
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 8 * 1024 * 1024 } // 8 MB
  });
  const ALLOWED_FOTO = new Set(["png", "jpg", "jpeg", "webp"]);
  // ========== SEGURANÇA: credenciais, tokens assinados e limites ==========
  const DATA_DIR = path.join(process.cwd(), "data");
  try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (_) {}

  // Secret que assina os tokens (persistido para sobreviver a reinícios)
  const AUTH_SECRET_PATH = path.join(DATA_DIR, "auth_secret.txt");
  function carregarAuthSecret(): string {
    try {
      const salvo = fs.readFileSync(AUTH_SECRET_PATH, "utf-8").trim();
      if (salvo.length >= 32) return salvo;
    } catch (_) {}
    const novo = randomBytes(32).toString("hex");
    try { fs.writeFileSync(AUTH_SECRET_PATH, novo, "utf-8"); } catch (_) {}
    return novo;
  }
  const AUTH_SECRET = carregarAuthSecret();

  // Senhas: guarda SOMENTE hash scrypt + salt (nunca a senha)
  interface Credencial { salt: string; hash: string; criado_em: string; }
  const CREDENCIAIS_PATH = path.join(DATA_DIR, "usuarios_credenciais.json");
  function carregarCredenciais(): Record<string, Credencial> {
    try {
      const dados = JSON.parse(fs.readFileSync(CREDENCIAIS_PATH, "utf-8"));
      if (dados && typeof dados === "object") return dados;
    } catch (_) {}
    return {};
  }
  function salvarCredenciais(mapa: Record<string, Credencial>): void {
    try { fs.writeFileSync(CREDENCIAIS_PATH, JSON.stringify(mapa, null, 2), "utf-8"); } catch (_) {}
  }
  function hashSenha(senha: string, salt: string): string {
    return scryptSync(senha, salt, 64).toString("hex");
  }

  // Rate limit de login: por e-mail (5 tentativas/15 min) e por IP (100/h)
  const tentativasLogin = new Map<string, { count: number; until: number }>();
  const MAX_TENTATIVAS = 5;
  const BLOQUEIO_MS = 15 * 60 * 1000;
  const loginsPorIp = new Map<string, number[]>();
  function limiteLoginIp(ip: string): boolean {
    const agora = Date.now();
    const recentes = (loginsPorIp.get(ip) || []).filter((t) => agora - t < 60 * 60 * 1000);
    if (recentes.length >= 100) { loginsPorIp.set(ip, recentes); return false; }
    recentes.push(agora);
    loginsPorIp.set(ip, recentes);
    return true;
  }

  // Valida o token assinado e devolve o e-mail (ou null se forjado/expirado)
  function verificarToken(authHeader?: string | string[]): string | null {
    const header = Array.isArray(authHeader) ? authHeader[0] : authHeader;
    if (!header || !header.startsWith("Bearer ")) return null;
    const raw = header.substring(7).trim();
    if (!raw.startsWith("auth_vesthub_")) return null;
    const resto = raw.slice("auth_vesthub_".length);
    const ponto = resto.lastIndexOf(".");
    if (ponto <= 0) return null;
    const b64 = resto.slice(0, ponto);
    const assinatura = resto.slice(ponto + 1);
    const esperada = createHmac("sha256", AUTH_SECRET).update(b64).digest("hex");
    const a = Buffer.from(assinatura);
    const b = Buffer.from(esperada);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    try {
      const email = Buffer.from(b64, "base64").toString("utf-8").split(":")[0];
      return email || null;
    } catch (_) { return null; }
  }

  // Chaves VIP: variável de ambiente VIP_KEYS ou arquivo data/vip_keys.json
  const VIP_KEYS_PATH = path.join(DATA_DIR, "vip_keys.json");
  function carregarChavesVIP(): string[] {
    const doEnv = (process.env.VIP_KEYS || "")
      .split(",").map((k) => k.trim().toUpperCase()).filter(Boolean);
    if (doEnv.length) return doEnv;
    try {
      const lista = JSON.parse(fs.readFileSync(VIP_KEYS_PATH, "utf-8"));
      if (Array.isArray(lista)) {
        return lista.map((k: any) => String(k).trim().toUpperCase()).filter(Boolean);
      }
    } catch (_) {}
    return [];
  }

  // Rate limit de envios da pesquisa (anti-spam): 5 por hora por IP
  const enviosPesquisa = new Map<string, number[]>();
  function podeEnviarPesquisa(ip: string): boolean {
    const agora = Date.now();
    const recentes = (enviosPesquisa.get(ip) || []).filter((t) => agora - t < 60 * 60 * 1000);
    if (recentes.length >= 5) { enviosPesquisa.set(ip, recentes); return false; }
    recentes.push(agora);
    enviosPesquisa.set(ip, recentes);
    return true;
  }
  // Mount Spotify OAuth 2.0 API routes
  app.use("/api/spotify", spotifyRouter);
  // Mount Mercado Pago API routes
  app.use("/api/mercadopago", mercadoPagoRouter);

  // ========== FLASHCARDS GENERATOR ==========
  app.post("/api/flashcards/generate", upload.single("file"), async (req, res) => {
    console.log("Flashcard generation route hit!");
    try {
      const { prompt, difficulty, numCards } = req.body;
      const file = req.file;

      console.log("Request body:", req.body);
      console.log("Request file:", req.file ? req.file.originalname : "No file");

      // Prepare contents for Gemini
      let contents: any[] = [{ text: `Gere ${numCards || 5} flashcards de dificuldade ${difficulty || 'média'}.` }];
      if (prompt) contents.push({ text: prompt });

      if (file) {
        contents.push({
          inlineData: {
            mimeType: file.mimetype,
            data: file.buffer.toString("base64"),
          },
        });
      }

      const response = await generateWithFallback({
        contents: contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                front_content: { type: Type.STRING },
                back_content: { type: Type.STRING },
                topic: { type: Type.STRING },
              },
              required: ["id", "front_content", "back_content", "topic"],
            },
          },
        },
      });

      const cards = JSON.parse(response.text || "[]");
      res.json({ cards });
    } catch (err: any) {
      console.error("Erro ao gerar flashcards:", err);
      res.status(500).json({ error: err?.message || "Erro ao gerar flashcards" });
    }
  });

  // Endpoint de Planos Padrão
  app.get("/api/planos", (_req, res) => {
    res.json({ planos: PLANOS_PADRAO });
  });

    // Endpoint de Pesquisa de Mercado / Black Friday
  app.post("/api/pesquisa", (req, res) => {
    try {
      if (!podeEnviarPesquisa(req.ip || "desconhecido")) {
        return res.status(429).json({ ok: false, erro: "Muitas respostas enviadas. Tente novamente mais tarde." });
      }
      const dados = req.body || {};
      // Saneamento: só campos simples, com tamanho limitado
      const limpo: Record<string, string> = {};
      let total = 0;
      for (const [campo, valor] of Object.entries(dados)) {
        if (typeof campo !== "string" || !campo || campo.length > 60) continue;
        let texto: string;
        if (typeof valor === "object" && valor !== null) {
          try { texto = JSON.stringify(valor); } catch (_) { texto = String(valor); }
        } else if (typeof valor === "string" || typeof valor === "number" || typeof valor === "boolean") {
          texto = String(valor);
        } else { continue; }
        texto = texto.slice(0, 1000);
        total += texto.length;
        if (total > 10000) break;
        limpo[campo] = texto;
      }
      const filePath = path.join(DATA_DIR, "pesquisas.json");
      let lista: any[] = [];
      if (fs.existsSync(filePath)) {
        try { lista = JSON.parse(fs.readFileSync(filePath, "utf-8")); } catch (_) {}
      }
      if (!Array.isArray(lista)) lista = [];
      const usuario = extractUsuarioId(req);
      lista.push({
        id: "pq_" + Date.now(),
        usuario: usuario !== "usuario_padrao" ? usuario : null,
        ...limpo,
        criado_em: new Date().toISOString(),
      });
      if (lista.length > 5000) lista = lista.slice(-5000);
      fs.writeFileSync(filePath, JSON.stringify(lista, null, 2), "utf-8");
      res.json({ ok: true, mensagem: "Pesquisa registrada com sucesso!" });
    } catch (e: any) {
      res.status(500).json({ ok: false, erro: e?.message || "Erro ao salvar pesquisa" });
    }
  });

  app.get("/api/pesquisa", (req, res) => {
    try {
      // Leitura restrita ao administrador (chave no ambiente)
      const chaveAdmin = String(req.headers["x-admin-key"] || req.query.admin_key || "");
      const esperada = process.env.ADMIN_KEY || "";
      if (!esperada || chaveAdmin !== esperada) {
        return res.status(401).json({ erro: "Acesso restrito ao administrador." });
      }
      const filePath = path.join(DATA_DIR, "pesquisas.json");
      if (fs.existsSync(filePath)) {
        const lista = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        return res.json({ total: lista.length, respostas: lista });
      }
      res.json({ total: 0, respostas: [] });
    } catch (e: any) {
      res.json({ total: 0, respostas: [] });
    }
  });

  // Mount Simulador Sisu API routes (reuses existing Gemini generateWithFallback pipeline)
  app.use(
    "/api/sisu",
    createSisuRouter({
      generateWithFallback,
      uploadMiddleware: upload.single("arquivo"),
    })
  );

  // Mount Treino Rápido API routes (protected by subscription middleware + Gemini fallback)
  app.use(
    "/api/treino",
    createTreinoRouter({
      generateWithFallback,
    })
  );

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
  // ========== GERADOR DE SIMULADOS PERSONALIZADOS ==========
  const SIMULADOS_PATH = path.join(process.cwd(), "data", "simulados.json");
  const SIM_IMAGENS_DIR = path.join(process.cwd(), "data", "simulado_imagens");
  try { fs.mkdirSync(SIM_IMAGENS_DIR, { recursive: true }); } catch (_) {}

  function carregarSimulados(): Record<string, any> {
    try {
      const dados = JSON.parse(fs.readFileSync(SIMULADOS_PATH, "utf-8"));
      if (dados && typeof dados === "object") return dados;
    } catch (_) {}
    return {};
  }
  function salvarSimulados(mapa: Record<string, any>): void {
    try {
      fs.mkdirSync(path.dirname(SIMULADOS_PATH), { recursive: true });
      fs.writeFileSync(SIMULADOS_PATH, JSON.stringify(mapa, null, 2), "utf-8");
    } catch (e: any) {
      console.error("[Simulado] Erro ao salvar:", e);
    }
  }

  // Gera a imagem de uma questão a partir da descrição (modelo de imagem do Gemini).
  // Salva o PNG em data/simulado_imagens e devolve a URL interna. Falha graciosa: null.
  async function gerarImagemQuestao(descricao: string, vestibular: string): Promise<string | null> {
    try {
      const promptImagem = `Gere uma ilustração didática, de estilo limpo e acadêmico, para uma questão de prova do vestibular "${vestibular}". A imagem deve conter EXATAMENTE a figura descrita a seguir, com os dados visíveis e legíveis, sem texto explicativo adicional fora da figura: ${descricao}`;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: promptImagem,
        config: { responseModalities: ["TEXT", "IMAGE"] },
      });
      const partes: any[] = (response as any).candidates?.[0]?.content?.parts || [];
      for (const parte of partes) {
        const inline = parte.inlineData || parte.inline_data;
        if (inline?.data) {
          const nomeArquivo = `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.png`;
          fs.writeFileSync(path.join(SIM_IMAGENS_DIR, nomeArquivo), Buffer.from(inline.data, "base64"));
          return `/api/simulado/imagem/${nomeArquivo}`;
        }
      }
    } catch (e: any) {
      console.warn("[Simulado] Geração de imagem indisponível, questão seguirá com fallback:", e?.message || e);
    }
    return null;
  }

  // Servir as imagens geradas (arquivos de nome controlado)
  app.get("/api/simulado/imagem/:arquivo", (req, res) => {
    try {
      const nome = String(req.params.arquivo || "");
      if (!/^img_[0-9]+_[a-z0-9]+\.png$/.test(nome)) {
        return res.status(400).json({ erro: "Arquivo inválido." });
      }
      const caminho = path.join(SIM_IMAGENS_DIR, nome);
      if (!fs.existsSync(caminho)) {
        return res.status(404).json({ erro: "Imagem não encontrada." });
      }
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Cache-Control", "public, max-age=86400");
      return res.send(fs.readFileSync(caminho));
    } catch (_) {
      return res.status(500).json({ erro: "Erro ao carregar imagem." });
    }
  });

  // CRIAR simulado: vestibular + matéria + dificuldade + n° de questões
  app.post("/api/simulado/criar", async (req, res) => {
    try {
      const uid = String(req.body?.usuario_id || extractUsuarioId(req) || "usuario_padrao");
      const vestibular = String(req.body?.vestibular || "ENEM").toUpperCase().slice(0, 20);
      const materia = String(req.body?.materia || "").trim().slice(0, 60);
      const dificuldade = ["facil", "media", "dificil"].includes(String(req.body?.dificuldade))
        ? String(req.body.dificuldade) : "media";
      const numQuestoes = Math.max(5, Math.min(45, Number(req.body?.numQuestoes) || 10));
      if (!materia) {
        return res.status(400).json({ erro: "Escolha a matéria do simulado." });
      }

      // Geração em 2 níveis: com figuras (descrição) e autossuficiente (sem figuras)
      const prompt = `Você é uma banca examinadora do vestibular ${vestibular}.
Crie ${numQuestoes} questões de MÚLTIPLA ESCOLHA sobre ${materia}, dificuldade ${dificuldade}.
REGRAS:
- Estilo fiel às provas do ${vestibular} (enunciados com contexto do mundo real).
- 5 alternativas (A-E) por questão; APENAS UMA correta.
- Se a questão DEPENDER de figura (gráfico, mapa, tabela, circuito, célula, reação etc.), preencha o campo "imagem_descricao" com uma descrição TÉCNICA E COMPLETA da figura que deve ser gerada (rótulos, eixos, valores, cores) — a imagem será criada automaticamente a partir desse texto. NÃO coloque URL externa.
- Se a questão NÃO precisar de figura, deixe "imagem_descricao" vazio e garanta que TODOS os dados necessários estejam no enunciado.
- Distribua as questões entre subtemas variados de ${materia}.
Retorne APENAS um array JSON com EXATAMENTE ${numQuestoes} itens:
[
  {
    "id": "string",
    "text": "enunciado completo e autossuficiente",
    "options": ["texto da alternativa A", "texto da B", "texto da C", "texto da D", "texto da E"],
    "correctAnswer": 0,
    "explanation": "resolução passo a passo",
    "subject": "${materia}",
    "topic": "subtema específico",
    "imagem_descricao": ""
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
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
                subject: { type: Type.STRING },
                topic: { type: Type.STRING },
                imagem_descricao: { type: Type.STRING, nullable: true },
              },
              required: ["id", "text", "options", "correctAnswer", "explanation", "subject"],
            },
          },
        },
      });
      const rawText = (response.text || "").trim();
      if (!rawText) return res.status(500).json({ erro: "Sem resposta do modelo." });
      const cleanJson = rawText.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
      let questoes: any[] = JSON.parse(cleanJson);
      if (!Array.isArray(questoes)) return res.status(500).json({ erro: "Formato de resposta inesperado." });

      questoes = questoes.slice(0, numQuestoes).map((q: any, i: number) => {
        const opts = (Array.isArray(q.options) ? q.options : []).slice(0, 5).map((o: any) => String(o).slice(0, 500));
        const maxIdx = Math.max(0, opts.length - 1);
        const rawAns = Number(q.correctAnswer);
        const correctAnswer = Number.isFinite(rawAns) ? Math.max(0, Math.min(maxIdx, Math.trunc(rawAns))) : 0;
        return {
          id: String(q.id || `q${i + 1}`),
          text: String(q.text || `Questão ${i + 1}`).slice(0, 2000),
          options: opts,
          correctAnswer,
          explanation: String(q.explanation || "").slice(0, 2000),
          subject: materia,
          topic: String(q.topic || materia).slice(0, 100),
          image: null as string | null,
          imagem_descricao: String(q.imagem_descricao || "").trim().slice(0, 1000) || undefined,
        };
      });

      // Gera até 5 imagens por simulado para evitar timeout (falha mantém imagem_descricao como fallback)
      let imagensGeradas = 0;
      for (const q of questoes) {
        if (imagensGeradas >= 5) break;
        if (q.imagem_descricao && q.options.length >= 2) {
          const url = await gerarImagemQuestao(q.imagem_descricao, vestibular);
          if (url) {
            q.image = url;
            q.imagem_descricao = undefined;
          }
          imagensGeradas++;
        }
      }

      const simulado = {
        id: "sim_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
        usuario: uid,
        vestibular,
        materia,
        dificuldade,
        criado_em: new Date().toISOString(),
        respondido: false,
        acertos: null,
        questoes,
      };

      const todos = carregarSimulados();
      todos[uid] = todos[uid] || [];
      todos[uid].unshift(simulado);
      if (todos[uid].length > 15) todos[uid] = todos[uid].slice(0, 15); // guarda os 15 mais recentes
      salvarSimulados(todos);

      return res.json({ sucesso: true, simulado });
    } catch (err: any) {
      console.error("[Simulado] Erro ao criar:", err);
      return res.status(500).json({ erro: err?.message || "Erro ao criar simulado." });
    }
  });

  // Listar os meus simulados
  app.get("/api/simulado", (req, res) => {
    try {
      const uid = String(req.query?.usuario_id || extractUsuarioId(req) || "usuario_padrao");
      const lista = (carregarSimulados()[uid] || []).map((s: any) => ({
        id: s.id, vestibular: s.vestibular, materia: s.materia,
        dificuldade: s.dificuldade, criado_em: s.criado_em,
        numQuestoes: s.questoes?.length || 0, respondido: s.respondido, acertos: s.acertos,
      }));
      return res.json({ simulados: lista });
    } catch (_) {
      return res.json({ simulados: [] });
    }
  });

  // Registra o resultado do simulado (quando a pessoa termina e confere)
  app.post("/api/simulado/:id/finalizar", (req, res) => {
    try {
      const uid = String(req.body?.usuario_id || extractUsuarioId(req) || "usuario_padrao");
      const sid = String(req.params.id || "");
      const todos = carregarSimulados();
      const simulado =
        (todos[uid] || []).find((s: any) => s.id === sid) ||
        (todos["usuario_padrao"] || []).find((s: any) => s.id === sid);
      if (!simulado) return res.status(404).json({ erro: "Simulado não encontrado." });
      const respostas = req.body?.respostas;
      if (!Array.isArray(respostas)) return res.status(400).json({ erro: "Respostas inválidas." });
      let acertos = 0;
      for (const r of respostas.slice(0, 45)) {
        if (r?.escolha === null || r?.escolha === undefined || r?.escolha === "") continue;
        const escolhaNum = Number(r.escolha);
        if (!Number.isInteger(escolhaNum)) continue;
        const q = simulado.questoes.find((x: any) => x.id === String(r?.id));
        if (q && escolhaNum === q.correctAnswer) acertos++;
      }
      simulado.respondido = true;
      simulado.acertos = acertos;
      salvarSimulados(todos);
      return res.json({
        sucesso: true, acertos, total: simulado.questoes.length,
        percentual: Math.round((acertos / Math.max(1, simulado.questoes.length)) * 100),
      });
    } catch (err: any) {
      return res.status(500).json({ erro: err?.message || "Erro ao finalizar simulado." });
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

    // ========== ROTAS DE AUTENTICAÇÃO E VIP (LOGIN SEGURO) ==========
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
    if (!limiteLoginIp(req.ip || "desconhecido")) {
      return res.status(429).json({ error: "Muitas tentativas. Aguarde alguns minutos." });
    }

    // Rate limit por e-mail (proteção contra força bruta)
    const chaveTent = String(email).toLowerCase();
    const registro = tentativasLogin.get(chaveTent);
    if (registro && Date.now() < registro.until) {
      const segundos = Math.ceil((registro.until - Date.now()) / 1000);
      return res.status(429).json({ error: `Muitas tentativas. Tente novamente em ${segundos}s.` });
    }

    const credenciais = carregarCredenciais();
    const existente = credenciais[chaveTent];

    if (existente) {
      // Conta já existe: a senha PRECISA conferir (comparação em tempo constante)
      const tentativa = Buffer.from(hashSenha(senha, existente.salt), "hex");
      const correta = Buffer.from(existente.hash, "hex");
      const ok = tentativa.length === correta.length && timingSafeEqual(tentativa, correta);
      if (!ok) {
        const count = (registro?.count || 0) + 1;
        if (count >= MAX_TENTATIVAS) {
          tentativasLogin.set(chaveTent, { count: 0, until: Date.now() + BLOQUEIO_MS });
        } else {
          tentativasLogin.set(chaveTent, { count, until: 0 });
        }
        return res.status(401).json({ error: "E-mail ou senha incorretos." });
      }
    } else {
      // Primeiro login com este e-mail: cria a conta com a senha informada
      const salt = randomBytes(16).toString("hex");
      credenciais[chaveTent] = { salt, hash: hashSenha(senha, salt), criado_em: new Date().toISOString() };
      salvarCredenciais(credenciais);
    }

    tentativasLogin.delete(chaveTent);

    const username = email.split("@")[0];
    const displayName = username.charAt(0).toUpperCase() + username.slice(1);
    const payload = Buffer.from(`${email}:${Date.now()}`).toString("base64");
    const assinatura = createHmac("sha256", AUTH_SECRET).update(payload).digest("hex");
    const token = "auth_vesthub_" + payload + "." + assinatura;
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
    if (!regexChave.test(chave)) {
      return res.status(400).json({
        success: false,
        mensagem: "Formato inválido. Use o padrão: XXXX-XXXX-XXXX",
      });
    }
    // A chave só vale se estiver na lista configurada (env VIP_KEYS ou data/vip_keys.json)
    if (!carregarChavesVIP().includes(chave)) {
      return res.status(400).json({ success: false, mensagem: "Chave inválida ou expirada." });
    }
    return res.json({
      success: true,
      mensagem: "Chave VIP resgatada com sucesso! Acesso Pro ativado.",
      nivel: "vip_pro",
    });
  });

  // ========== ROTAS DE ONBOARDING E PERFIL ==========
   function extractUsuarioId(req: express.Request): string {
    // Com Bearer: só aceita token com assinatura válida — não é mais possível forjar
    if (req.headers.authorization) {
      const email = verificarToken(req.headers.authorization);
      return email || "usuario_padrao";
    }
    // Sem Bearer: caminhos legados mantidos por compatibilidade
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
    // ========== CRONOGRAMA PERSONALIZADO PELO USUÁRIO ==========
  const CRONOGRAMA_PATH = path.join(process.cwd(), "data", "cronogramas.json");
  function carregarCronogramas(): Record<string, any> {
    try {
      const dados = JSON.parse(fs.readFileSync(CRONOGRAMA_PATH, "utf-8"));
      if (dados && typeof dados === "object") return dados;
    } catch (_) {}
    return {};
  }
  function salvarCronogramas(mapa: Record<string, any>): void {
    try {
      fs.mkdirSync(path.dirname(CRONOGRAMA_PATH), { recursive: true });
      fs.writeFileSync(CRONOGRAMA_PATH, JSON.stringify(mapa, null, 2), "utf-8");
    } catch (e: any) {
      console.error("Erro ao salvar cronograma:", e);
    }
  }

  // Carrega o cronograma do usuário (as alterações dele têm prioridade sobre a IA)
  app.get("/api/cronograma", (req, res) => {
    try {
      const uid = String(req.query?.usuario_id || extractUsuarioId(req) || "usuario_padrao");
      const todos = carregarCronogramas();
      if (todos[uid]) {
        return res.json({ existe: true, cronograma: todos[uid] });
      }
      if (todos["usuario_padrao"]) {
        return res.json({ existe: true, cronograma: todos["usuario_padrao"] });
      }
      return res.json({ existe: false, cronograma: null });
    } catch (err: any) {
      console.error("[Cronograma] Erro ao carregar:", err);
      return res.status(500).json({ erro: "Erro ao carregar cronograma." });
    }
  });

  // Salva o cronograma editado pelo usuário
  app.post("/api/cronograma", (req, res) => {
    try {
      const uid = String(req.body?.usuario_id || extractUsuarioId(req) || "usuario_padrao");
      const lista = req.body?.cronograma;
      if (!Array.isArray(lista) || lista.length === 0 || lista.length > 52) {
        return res.status(400).json({ erro: "Cronograma inválido (1 a 52 semanas)." });
      }
      // Saneamento: só campos conhecidos, textos limitados
      const semanas = lista.slice(0, 52).map((sem: any, indice: number) => ({
        week: Number(sem?.week) || indice + 1,
        topic: String(sem?.topic || "").slice(0, 200),
        focus: String(sem?.focus || "").slice(0, 300),
        estimatedHours: Math.max(0, Math.min(80, Number(sem?.estimatedHours) || 0))
      }));
      const todos = carregarCronogramas();
      todos[uid] = { semanas, atualizado_em: new Date().toISOString() };
      salvarCronogramas(todos);
      return res.json({ sucesso: true, mensagem: "Cronograma salvo com sucesso!" });
    } catch (err: any) {
      console.error("[Cronograma] Erro ao salvar:", err);
      return res.status(500).json({ erro: "Erro ao salvar cronograma." });
    }
  });

  // Regenera uma única semana com IA (mantém o resto que o usuário editou)
  app.post("/api/cronograma/regenerar-semana", async (req, res) => {
    try {
      const { week, weakSubjects = [], upcomingExams = [] } = req.body || {};
      if (!week || Number(week) < 1) {
        return res.status(400).json({ erro: "Número da semana inválido." });
      }
      const prompt = `Você é um mentor de estudos especialista em vestibulares.
Gere o conteúdo de UMA única semana (semana ${week}) de um plano de estudos.
Pontos fracos do aluno: ${weakSubjects.join(", ") || "não especificados"}
Próximos exames: ${upcomingExams.join(", ") || "não especificados"}
Retorne APENAS um objeto JSON no formato:
{ "week": ${Number(week)}, "topic": "tópico principal da semana", "focus": "foco principal da semana", "estimatedHours": number }`;
      const response = await generateWithFallback({
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              week: { type: Type.INTEGER },
              topic: { type: Type.STRING },
              focus: { type: Type.STRING },
              estimatedHours: { type: Type.INTEGER }
            },
            required: ["week", "topic", "focus", "estimatedHours"]
          }
        }
      });
      const text = response.text;
      if (!text) return res.status(500).json({ erro: "Sem resposta do modelo" });
      return res.json(JSON.parse(text));
    } catch (err: any) {
      console.error("[Cronograma] Erro ao regenerar semana:", err);
      return res.status(500).json({ erro: err?.message || "Erro ao regenerar semana." });
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
