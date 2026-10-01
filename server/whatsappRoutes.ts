import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

export const whatsappRouter = Router();

// ============================================================
// CONFIGURAÇÃO — AGENTE WHATSAPP
// ============================================================
const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'vesthub_verify_2026';
const WHATSAPP_API_URL = 'https://graph.facebook.com/v21.0/';

const AGENTE_SYSTEM_PROMPT = `Você é o assistente de suporte do VestHub, plataforma de preparação para vestibulares.

REGRAS:
1. Responda apenas sobre: VestHub (funcionalidades, planos, pagamentos), vestibulares (ENEM, FUVEST, UNICAMP, ITA, UNESP) e dúvidas técnicas do app.
2. Se a pergunta for fora desse escopo, diga educadamente que só atende questões do VestHub.
3. Seja breve — WhatsApp exige respostas curtas (máximo 3 parágrafos).
4. Se não souber algo específico (status de pagamento, dados da conta), diga que vai transferir para a equipe humana.
5. NUNCA invente preços, datas de prova ou dados de usuário.
6. Quando transferir para humano, comece a mensagem com "[HUMANO]" para o sistema detectar.

EXEMPLOS:
- "Como funciona o CorrigeBot?" → "O CorrigeBot corrige sua redação com as regras oficiais da banca escolhida (ENEM, FUVEST, UNICAMP ou UNESP). Vá na aba Redação, escolha a banca, cole o texto e receba a correção em segundos!"
- "Qual o preço do Premium?" → "O plano Premium custa R$ 19,90/mês ou R$ 149,90/ano. Você tem simulados ilimitados, CorrigeBot e VestBot sem limites."
- "Como faço para cancelar?" → "[HUMANO] Vou te conectar com nossa equipe para ajudar com o cancelamento."`;

// Inicialização do SDK do Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Banco de Contexto em RAM (últimas 6 mensagens por usuário, 30 minutos de validade)
interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  ts: number;
}

const contextoUsuarios = new Map<string, ChatMessage[]>();
const CONTEXTO_MAX_MENSAGENS = 6;
const CONTEXTO_EXPIRA_MS = 30 * 60 * 1000; // 30 minutos

function obterContexto(remetente: string): ChatMessage[] {
  const agora = Date.now();
  const dados = contextoUsuarios.get(remetente) || [];
  const validos = dados.filter(m => agora - m.ts < CONTEXTO_EXPIRA_MS);
  contextoUsuarios.set(remetente, validos);
  return validos.slice(-CONTEXTO_MAX_MENSAGENS);
}

function salvarContexto(remetente: string, role: 'user' | 'model', content: string) {
  const dados = contextoUsuarios.get(remetente) || [];
  dados.push({ role, content, ts: Date.now() });
  if (dados.length > CONTEXTO_MAX_MENSAGENS * 2) {
    contextoUsuarios.set(remetente, dados.slice(-CONTEXTO_MAX_MENSAGENS * 2));
  } else {
    contextoUsuarios.set(remetente, dados);
  }
}

function menuAjuda(): string {
  return (
    '👋 *VestHub — Suporte*\n\n' +
    'Posso te ajudar com:\n' +
    '📋 Funcionalidades do app\n' +
    '💰 Planos e pagamentos\n' +
    '📝 CorrigeBot (correção de redação)\n' +
    '🤖 VestBot (chat de vestibular)\n' +
    '🎵 Spotify (músicas para estudar)\n' +
    '❓ Dúvidas sobre vestibulares\n\n' +
    'Digite sua dúvida ou:\n' +
    '/humano — falar com atendente\n' +
    '/ajuda — ver este menu'
  );
}

function dividirMensagem(texto: string, maxChars = 4000): string[] {
  if (texto.length <= maxChars) return [texto];
  const partes: string[] = [];
  let atual = texto;

  while (atual.length > maxChars) {
    let corte = atual.lastIndexOf('\n', maxChars);
    if (corte === -1) corte = maxChars;
    partes.push(atual.slice(0, corte));
    atual = atual.slice(corte).trimStart();
  }
  if (atual) partes.push(atual);
  return partes;
}

async function enviarMensagemWhatsApp(destinatario: string, texto: string): Promise<boolean> {
  const phoneId = (process.env.WHATSAPP_PHONE_ID || '').trim();
  const token = (process.env.WHATSAPP_TOKEN || '').trim();

  if (!phoneId || !token) {
    console.warn('[WHATSAPP SIMULAÇÃO] WHATSAPP_PHONE_ID ou WHATSAPP_TOKEN não configurados. Mensagem simulada para', destinatario, ':', texto);
    return true;
  }

  const url = `${WHATSAPP_API_URL}${phoneId}/messages`;
  const partes = dividirMensagem(texto, 4000);

  for (const msg of partes) {
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: destinatario,
      type: 'text',
      text: { body: msg, preview_url: false }
    };

    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!resp.ok) {
        const errText = await resp.text();
        console.error('[ERRO ENVIO WHATSAPP]', resp.status, errText);
        return false;
      }
    } catch (err: any) {
      console.error('[ERRO CONEXÃO WHATSAPP]', err?.message);
      return false;
    }
  }

  return true;
}

async function notificarAdmin(mensagem: string) {
  const adminNumero = (process.env.ADMIN_WHATSAPP || '').trim();
  if (adminNumero) {
    await enviarMensagemWhatsApp(adminNumero, mensagem);
  }
}

async function gerarRespostaIA(remetente: string, pergunta: string, nome?: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    return 'Estou em modo de demonstração agora, mas em breve estarei respondendo suas dúvidas sobre o VestHub! Digite /ajuda para ver o menu.';
  }

  const historico = obterContexto(remetente);
  let promptSistema = AGENTE_SYSTEM_PROMPT;
  if (nome) {
    promptSistema += `\n\nO usuário se chama ${nome}. Seja cordial.`;
  }

  const contents: any[] = [];
  for (const h of historico) {
    contents.push({
      role: h.role,
      parts: [{ text: h.content }]
    });
  }
  contents.push({
    role: 'user',
    parts: [{ text: pergunta }]
  });

  const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-2.5-flash'];

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: { parts: [{ text: promptSistema }] },
          maxOutputTokens: 400,
          temperature: 0.3,
          topP: 0.9
        }
      });

      if (response && response.text) {
        return response.text.trim();
      }
    } catch (err: any) {
      console.warn(`[GEMINI TENTATIVA ${model}]`, err?.message);
    }
  }

  return 'Tive um probleminha para processar agora. Pode repetir? 😊';
}

// ============================================================
// ROTAS DO WEBHOOK (GET / POST)
// ============================================================

// 1. Verificação do Webhook da Meta
const handleWebhookVerification = (req: Request, res: Response) => {
  const mode = req.query['hub.mode'] as string;
  const token = req.query['hub.verify_token'] as string;
  const challenge = req.query['hub.challenge'] as string;

  if (mode === 'subscribe' && token === WHATSAPP_VERIFY_TOKEN) {
    console.log('[WHATSAPP WEBHOOK] Verificado com sucesso pela Meta!');
    return res.status(200).send(challenge);
  }

  console.warn('[WHATSAPP WEBHOOK] Falha na verificação do token:', token);
  return res.status(403).json({ erro: 'Token de verificação inválido' });
};

whatsappRouter.get('/webhook', handleWebhookVerification);
whatsappRouter.get('/', handleWebhookVerification);

// 2. Recebimento de mensagens da Meta
const handleIncomingMessage = async (req: Request, res: Response) => {
  // Responder 200 imediatamente para o webhook da Meta
  res.status(200).json({ status: 'recebido' });

  const data = req.body || {};

  try {
    const entry = data.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    const messages = value?.messages;
    if (!messages || !messages.length) {
      return;
    }

    const msg = messages[0];
    const tipo = msg.type;
    const remetente = msg.from || '';
    const nomeRemetente = value.contacts?.[0]?.profile?.name || '';

    // Apenas mensagens de texto suportadas inicialmente
    if (tipo !== 'text') {
      if (remetente) {
        await enviarMensagemWhatsApp(
          remetente,
          'Recebi sua mensagem! Por enquanto só consigo responder textos. Digite sua dúvida que eu te ajudo! 😊'
        );
      }
      return;
    }

    const textoRecebido = msg.text?.body?.trim() || '';
    if (!textoRecebido || !remetente) return;

    console.log(`[WHATSAPP RECEBIDO] De: ${nomeRemetente || remetente} (${remetente}) - Mensagem: "${textoRecebido}"`);

    // Comandos especiais
    const comando = textoRecebido.toLowerCase().trim();
    if (['/ajuda', 'ajuda', 'menu', '/menu'].includes(comando)) {
      const resposta = menuAjuda();
      await enviarMensagemWhatsApp(remetente, resposta);
      return;
    }

    if (['/humano', 'humano', 'atendente'].includes(comando)) {
      await enviarMensagemWhatsApp(
        remetente,
        '👋 Você está sendo transferido para nossa equipe humana. Em instantes alguém vai te atender!'
      );
      await notificarAdmin(`🔔 Transferência solicitada por ${nomeRemetente || remetente} (${remetente})`);
      return;
    }

    // Processamento com IA Gemini
    const respostaIA = await gerarRespostaIA(remetente, textoRecebido, nomeRemetente);

    // Escalonamento para suporte humano
    if (respostaIA.startsWith('[HUMANO]')) {
      const textoLimpo = respostaIA.replace('[HUMANO]', '').trim();
      if (textoLimpo) {
        await enviarMensagemWhatsApp(remetente, textoLimpo);
      }
      await notificarAdmin(
        `🔔 Escalonamento automático\n` +
        `Usuário: ${nomeRemetente || remetente} (${remetente})\n` +
        `Mensagem: ${textoRecebido.slice(0, 200)}`
      );
      return;
    }

    // Enviar resposta gerada pela IA
    await enviarMensagemWhatsApp(remetente, respostaIA);

    // Salvar no histórico de contexto
    salvarContexto(remetente, 'user', textoRecebido);
    salvarContexto(remetente, 'model', respostaIA);

  } catch (err: any) {
    console.error('[ERRO PROCESSAMENTO WHATSAPP]', err?.message);
  }
};

whatsappRouter.post('/webhook', handleIncomingMessage);
whatsappRouter.post('/', handleIncomingMessage);

// 3. Envio Manual (Admin)
whatsappRouter.post('/enviar', async (req: Request, res: Response) => {
  const { destinatario, mensagem } = req.body || {};

  if (!destinatario || !mensagem) {
    return res.status(400).json({ erro: 'destinatario e mensagem são obrigatórios' });
  }

  const ok = await enviarMensagemWhatsApp(destinatario, mensagem);
  if (ok) {
    return res.json({ sucesso: true, destinatario });
  }
  return res.status(500).json({ erro: 'Falha ao enviar mensagem' });
});

// 4. Simulador do Agente WhatsApp (para testes interativos no app)
whatsappRouter.post('/simulate', async (req: Request, res: Response) => {
  try {
    const { message, phone = '5511999999999', name = 'Estudante' } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensagem é obrigatória' });
    }

    const textoRecebido = message.trim();
    const comando = textoRecebido.toLowerCase().trim();

    if (['/ajuda', 'ajuda', 'menu', '/menu'].includes(comando)) {
      const resposta = menuAjuda();
      return res.json({
        status: 'respondido',
        motivo: 'menu',
        reply: resposta,
        isHumanEscalated: false
      });
    }

    if (['/humano', 'humano', 'atendente'].includes(comando)) {
      const resposta = '👋 Você está sendo transferido para nossa equipe humana. Em instantes alguém vai te atender!';
      return res.json({
        status: 'transferido',
        motivo: 'solicitou_humano',
        reply: resposta,
        isHumanEscalated: true
      });
    }

    const respostaIA = await gerarRespostaIA(phone, textoRecebido, name);

    let isEscalated = false;
    let finalReply = respostaIA;

    if (respostaIA.startsWith('[HUMANO]')) {
      isEscalated = true;
      finalReply = respostaIA.replace('[HUMANO]', '').trim();
      if (!finalReply) {
        finalReply = 'Vou te conectar com nossa equipe para ajudar com essa solicitação.';
      }
    }

    salvarContexto(phone, 'user', textoRecebido);
    salvarContexto(phone, 'model', finalReply);

    return res.json({
      status: isEscalated ? 'escalonado' : 'respondido',
      reply: finalReply,
      isHumanEscalated: isEscalated,
      sender: phone,
      name,
      contextCount: (contextoUsuarios.get(phone) || []).length
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Erro ao processar mensagem', details: err?.message });
  }
});

// 5. Status da Integração
whatsappRouter.get('/status', (req: Request, res: Response) => {
  const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
  const host = req.get('host') || 'localhost:3000';
  const webhookUrl = `${proto}://${host}/api/whatsapp/webhook`;

  const phoneIdConfigured = Boolean(process.env.WHATSAPP_PHONE_ID);
  const tokenConfigured = Boolean(process.env.WHATSAPP_TOKEN);

  return res.json({
    configured: phoneIdConfigured && tokenConfigured,
    phone_id_configured: phoneIdConfigured,
    token_configured: tokenConfigured,
    verify_token: WHATSAPP_VERIFY_TOKEN,
    webhook_url: webhookUrl,
    active_conversations: contextoUsuarios.size
  });
});
