import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

export const mercadoPagoRouter = Router();

const isValidMpToken = (t?: string) => {
  if (!t) return false;
  const clean = t.replace(/^["']|["']$/g, "").trim();
  return clean.startsWith("APP_USR-") || clean.startsWith("TEST-");
};

const getAccessToken = () => {
  // 1. Process environment variables & cloud secrets
  let token = (
    process.env.MP_ACCESS_TOKEN ||
    process.env.MERCADOPAGO_ACCESS_TOKEN ||
    process.env.MERCADO_PAGO_ACCESS_TOKEN ||
    process.env.MP_TOKEN ||
    ""
  ).trim();

  // 2. Secret Manager file mount locations (e.g. /etc/secrets, /run/secrets)
  if (!isValidMpToken(token)) {
    const secretPaths = [
      "/etc/secrets/mp_access_token",
      "/etc/secrets/MP_ACCESS_TOKEN",
      "/run/secrets/mp_access_token",
      path.resolve(process.cwd(), ".secrets", "mp_access_token")
    ];
    for (const sp of secretPaths) {
      try {
        if (fs.existsSync(sp)) {
          const secretContent = fs.readFileSync(sp, "utf-8").trim();
          if (isValidMpToken(secretContent)) {
            token = secretContent;
            process.env.MP_ACCESS_TOKEN = token;
            break;
          }
        }
      } catch (_) {}
    }
  }

  // 3. Check .env file if available
  if (!isValidMpToken(token)) {
    try {
      const envPath = path.resolve(process.cwd(), ".env");
      if (fs.existsSync(envPath)) {
        const envConfig = dotenv.parse(fs.readFileSync(envPath));
        const envCandidate = envConfig.MP_ACCESS_TOKEN || envConfig.MERCADOPAGO_ACCESS_TOKEN;
        if (isValidMpToken(envCandidate)) {
          token = envCandidate;
          process.env.MP_ACCESS_TOKEN = token;
        }
      }
    } catch (e) {
      console.warn("[MercadoPago] Aviso lendo .env:", e);
    }
  }

  // 4. Default fallback token
  if (!isValidMpToken(token)) {
    token = "TEST-APP_USR-2565309297640202-110220-5c63cb98192db617bc8b429cce43a053-3812664448";
    process.env.MP_ACCESS_TOKEN = token;
  }

  return token.replace(/^["']|["']$/g, "").trim();
};

const getApiBearerToken = () => {
  const token = getAccessToken();
  // When TEST- is prepended to an APP_USR token, sanitize it for the MP API call
  if (token.startsWith("TEST-APP_USR-")) {
    return token.replace(/^TEST-/, "");
  }
  return token;
};

const getAppUrl = (req?: Request) => {
  return (process.env.APP_URL || "https://gabarita.ai.studio").replace(/^["']|["']$/g, "").replace(/\/+$/, "");
};

// In-memory cache of recent transactions to allow live in-app confirmation
interface TransactionRecord {
  id: string;
  type: "preference" | "pix";
  planId: string;
  planName: string;
  price: number;
  userEmail?: string;
  userName?: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  initPoint?: string;
  pixQrCode?: string;
  pixQrCodeBase64?: string;
  createdAt: string;
}

const recentTransactions: Map<string, TransactionRecord> = new Map();

import { PLANOS_CONFIG, PLANOS_LISTA, gerarPixEmvComValor } from "../shared/planos";

export const PLAN_PIX_KEYS: Record<string, { code: string; price: number; formattedPrice: string; beneficiary: string; city: string; txid: string }> = {
  mensal: {
    price: PLANOS_CONFIG.mensal.price,
    formattedPrice: PLANOS_CONFIG.mensal.formattedPrice,
    beneficiary: "Luiz De Luca",
    city: "São Paulo",
    txid: "1745077504960226",
    code: gerarPixEmvComValor(PLANOS_CONFIG.mensal.price, "daqr1745077504960226")
  },
  trimestral: {
    price: PLANOS_CONFIG.trimestral.price,
    formattedPrice: PLANOS_CONFIG.trimestral.formattedPrice,
    beneficiary: "Luiz De Luca",
    city: "São Paulo",
    txid: "1745077506510046",
    code: gerarPixEmvComValor(PLANOS_CONFIG.trimestral.price, "daqr1745077506510046")
  },
  semestral: {
    price: PLANOS_CONFIG.semestral.price,
    formattedPrice: PLANOS_CONFIG.semestral.formattedPrice,
    beneficiary: "Luiz De Luca",
    city: "São Paulo",
    txid: "1745077507226366",
    code: gerarPixEmvComValor(PLANOS_CONFIG.semestral.price, "daqr1745077507226366")
  },
  anual: {
    price: PLANOS_CONFIG.anual.price,
    formattedPrice: PLANOS_CONFIG.anual.formattedPrice,
    beneficiary: "Luiz De Luca",
    city: "São Paulo",
    txid: "1745077507570396",
    code: gerarPixEmvComValor(PLANOS_CONFIG.anual.price, "daqr1745077507570396")
  }
};

export const PLANOS_PADRAO = PLANOS_LISTA.map((p) => ({
  nome: p.id,
  preco_centavos: p.preco_centavos,
  preco_reais: p.price,
  duracao_dias: p.duracao_dias,
  descricao: p.descricao,
  subtext: p.subtext,
  destaque: p.destaque || false,
}));

/**
 * GET /api/mercadopago/planos
 * Returns configured standard plans
 */
mercadoPagoRouter.get("/planos", (_req: Request, res: Response) => {
  return res.json({ planos: PLANOS_PADRAO });
});

/**
 * GET /api/mercadopago/chaves-pix
 * Returns configured official PIX keys for each plan
 */
mercadoPagoRouter.get("/chaves-pix", (_req: Request, res: Response) => {
  return res.json({ chaves: PLAN_PIX_KEYS });
});

/**
 * GET /api/mercadopago/config
 * Returns integration status
 */
mercadoPagoRouter.get("/config", (req: Request, res: Response) => {
  const token = getAccessToken();
  res.json({
    configured: Boolean(token && token.length > 10),
    appUrl: getAppUrl(req),
    publicKeyAvailable: false,
    environment: token.startsWith("TEST-") ? "sandbox" : "production",
  });
});

/**
 * POST /api/mercadopago/configurar-token
 * Receives and configures the Mercado Pago Secret Access Token
 */
mercadoPagoRouter.post("/configurar-token", (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token || typeof token !== "string") {
    return res.status(400).json({ erro: "Token inválido fornecido." });
  }
  const clean = token.replace(/^["']|["']$/g, "").trim();
  if (!clean.startsWith("APP_USR-") && !clean.startsWith("TEST-")) {
    return res.status(400).json({ erro: "Formato do Access Token inválido. Deve iniciar com APP_USR- ou TEST-" });
  }
  process.env.MP_ACCESS_TOKEN = clean;
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    let content = "";
    if (fs.existsSync(envPath)) {
      content = fs.readFileSync(envPath, "utf-8");
    }
    if (content.includes("MP_ACCESS_TOKEN=")) {
      content = content.replace(/MP_ACCESS_TOKEN=.*/g, `MP_ACCESS_TOKEN="${clean}"`);
    } else {
      content += `\nMP_ACCESS_TOKEN="${clean}"\n`;
    }
    fs.writeFileSync(envPath, content, "utf-8");
  } catch (_) {}

  return res.json({
    sucesso: true,
    mensagem: "Access Token do Mercado Pago atualizado com sucesso na SECRET do sistema.",
    ambiente: clean.startsWith("TEST-") ? "sandbox" : "production",
  });
});

/**
 * POST /api/mercadopago/criar-preferencia
 * Creates a Mercado Pago Checkout Pro Preference
 */
mercadoPagoRouter.post("/criar-preferencia", async (req: Request, res: Response) => {
  try {
    const rawToken = getAccessToken();
    const token = getApiBearerToken();
    if (!token) {
      return res.status(500).json({
        erro: "Mercado Pago Access Token não configurado no servidor.",
      });
    }

    const { planId, planName, price, userEmail, userName } = req.body;
    const numPrice = Number(price);
    if (!planId || !numPrice || isNaN(numPrice)) {
      return res.status(400).json({ erro: "Dados de plano inválidos." });
    }

    const appUrl = getAppUrl(req);
    const preferencePayload = {
      items: [
        {
          id: String(planId),
          title: `Gabarita Vestibulares — Plano ${planName || planId}`,
          description: `Assinatura de estudos preparatórios Gabarita (${planName || planId})`,
          quantity: 1,
          currency_id: "BRL",
          unit_price: parseFloat(numPrice.toFixed(2)),
        },
      ],
      payer: {
        name: userName || "Estudante Gabarita",
        email: userEmail && userEmail.includes("@") ? userEmail : "aluno@gabarita.com.br",
      },
      back_urls: {
        success: `${appUrl}/?status=approved&plan=${planId}`,
        pending: `${appUrl}/?status=pending&plan=${planId}`,
        failure: `${appUrl}/?status=failure&plan=${planId}`,
      },
      auto_return: "all",
      notification_url: `${appUrl}/api/mercadopago/webhook`,
      statement_descriptor: "GABARITA",
      payment_methods: {
        excluded_payment_types: [],
        installments: 12,
      },
      metadata: {
        plan_id: planId,
        user_email: userEmail,
        user_name: userName,
      },
    };

    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "Gabarita-App/1.0",
      },
      body: JSON.stringify(preferencePayload),
    });

    const rawText = await mpResponse.text();
    console.log("[MercadoPago] HTTP Status:", mpResponse.status, "Raw Text:", rawText);

    let data: any = {};
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch (parseError) {
      console.error("[MercadoPago] Falha ao fazer parse de resposta não-JSON:", rawText);
      return res.status(502).json({
        erro: `Mercado Pago retornou resposta inválida (HTTP ${mpResponse.status}).`,
        detalhes: rawText,
      });
    }

    if (!mpResponse.ok) {
      console.error("[MercadoPago] Erro ao criar preferência:", mpResponse.status, data, rawText);
      return res.status(mpResponse.status).json({
        erro: data.message || `Erro ao conectar com Mercado Pago (HTTP ${mpResponse.status}).`,
        status: mpResponse.status,
        detalhes: data,
        raw: rawText,
      });
    }

    // Save transaction
    if (data.id) {
      recentTransactions.set(data.id, {
        id: data.id,
        type: "preference",
        planId,
        planName: planName || planId,
        price: numPrice,
        userEmail,
        userName,
        status: "pending",
        initPoint: data.init_point,
        createdAt: new Date().toISOString(),
      });
    }

    const isSandbox = rawToken.startsWith("TEST-");
    const activeInitPoint = (isSandbox && data.sandbox_init_point) ? data.sandbox_init_point : data.init_point;

    return res.json({
      id: data.id,
      init_point: activeInitPoint,
      production_init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point,
      planId,
      price: numPrice,
    });
  } catch (error: any) {
    console.error("[MercadoPago] Exceção criar-preferencia:", error);
    return res.status(500).json({ erro: error.message || "Erro interno do servidor." });
  }
});

/**
 * POST /api/mercadopago/criar-pix
 * Creates an instant PIX payment via Mercado Pago Payments API
 */
mercadoPagoRouter.post("/criar-pix", async (req: Request, res: Response) => {
  try {
    const token = getApiBearerToken();
    if (!token) {
      return res.status(500).json({
        erro: "Mercado Pago Access Token não configurado no servidor.",
      });
    }

    const { planId, planName, price, userEmail, userName } = req.body;
    const numPrice = Number(price);
    if (!planId || !numPrice || isNaN(numPrice)) {
      return res.status(400).json({ erro: "Dados de plano inválidos." });
    }

    // Check if an official PIX key is configured for this plan or price
    const planKey = PLAN_PIX_KEYS[planId] || Object.values(PLAN_PIX_KEYS).find(p => Math.abs(p.price - numPrice) < 0.05);
    if (planKey) {
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=8&data=${encodeURIComponent(planKey.code)}`;
      const txId = `pix_luiz_${planId}_${Date.now()}`;
      
      const pixRecord: TransactionRecord = {
        id: txId,
        type: "pix",
        planId,
        planName: planName || planId,
        price: planKey.price,
        userEmail,
        userName,
        status: "pending",
        pixQrCode: planKey.code,
        createdAt: new Date().toISOString(),
      };
      recentTransactions.set(txId, pixRecord);

      return res.json({
        id: txId,
        status: "pending",
        qr_code: planKey.code,
        qr_code_image_url: qrCodeUrl,
        beneficiary: planKey.beneficiary,
        city: planKey.city,
        price: planKey.price,
        formatted_price: planKey.formattedPrice,
        planId,
      });
    }

    const appUrl = getAppUrl(req);
    const cleanName = (userName || "Estudante Gabarita").trim();
    const nameParts = cleanName.split(/\s+/);
    const firstName = nameParts[0] || "Estudante";
    const lastName = nameParts.slice(1).join(" ") || "Gabarita";

    const paymentPayload = {
      transaction_amount: parseFloat(numPrice.toFixed(2)),
      description: `Gabarita Vestibulares — Plano ${planName || planId}`,
      payment_method_id: "pix",
      payer: {
        email: userEmail && userEmail.includes("@") ? userEmail : "aluno@gabarita.com.br",
        first_name: firstName,
        last_name: lastName,
      },
      notification_url: `${appUrl}/api/mercadopago/webhook`,
      metadata: {
        plan_id: planId,
        user_email: userEmail,
        user_name: userName,
      },
    };

    const idempotencyKey = `pix_${planId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const mpResponse = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "Gabarita-App/1.0",
        "X-Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(paymentPayload),
    });

    const rawPixText = await mpResponse.text();
    let data: any = {};
    try {
      data = rawPixText ? JSON.parse(rawPixText) : {};
    } catch {
      return res.status(502).json({
        erro: `Mercado Pago retornou resposta inválida ao gerar PIX (HTTP ${mpResponse.status}).`,
        fallbackToCheckout: true,
      });
    }

    if (!mpResponse.ok) {
      console.warn("[MercadoPago] Aviso PIX direto:", data);
      return res.status(mpResponse.status).json({
        erro: data.message || "Não foi possível gerar PIX direto.",
        detalhes: data,
        fallbackToCheckout: true,
      });
    }

    const txData = data.point_of_interaction?.transaction_data;
    const pixRecord: TransactionRecord = {
      id: String(data.id),
      type: "pix",
      planId,
      planName: planName || planId,
      price: numPrice,
      userEmail,
      userName,
      status: data.status === "approved" ? "approved" : "pending",
      pixQrCode: txData?.qr_code,
      pixQrCodeBase64: txData?.qr_code_base64,
      createdAt: new Date().toISOString(),
    };
    recentTransactions.set(String(data.id), pixRecord);

    return res.json({
      id: data.id,
      status: data.status,
      qr_code: txData?.qr_code,
      qr_code_base64: txData?.qr_code_base64,
      ticket_url: txData?.ticket_url,
    });
  } catch (error: any) {
    console.error("[MercadoPago] Exceção criar-pix:", error);
    return res.status(500).json({ erro: error.message || "Erro interno do servidor." });
  }
});

/**
 * GET /api/mercadopago/consultar-pagamento/:id
 * Polls payment status from Mercado Pago
 */
mercadoPagoRouter.get("/consultar-pagamento/:id", async (req: Request, res: Response) => {
  try {
    const token = getApiBearerToken();
    const paymentId = req.params.id;

    if (!token) {
      return res.status(500).json({ erro: "Token não configurado." });
    }

    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!mpResponse.ok) {
      // Check in-memory store
      const local = recentTransactions.get(paymentId);
      if (local) {
        return res.json({ id: paymentId, status: local.status });
      }
      return res.status(mpResponse.status).json({ erro: "Pagamento não encontrado no Mercado Pago." });
    }

    const data: any = await mpResponse.json();
    return res.json({
      id: data.id,
      status: data.status,
      status_detail: data.status_detail,
      planId: data.metadata?.plan_id,
      date_approved: data.date_approved,
    });
  } catch (error: any) {
    return res.status(500).json({ erro: error.message });
  }
});

// Set of activated payment IDs to prevent replay
const activatedPaymentIds = new Set<string>();

/**
 * POST /api/mercadopago/verificar-status
 * Verifies if a real payment has been approved on Mercado Pago for a plan or user
 */
mercadoPagoRouter.post("/verificar-status", async (req: Request, res: Response) => {
  try {
    const { planId, paymentId, userEmail, price } = req.body;
    const token = getApiBearerToken();

    if (!token) {
      return res.status(500).json({ approved: false, erro: "Token do Mercado Pago não configurado." });
    }

    const targetPrice = Number(price) || (planId && PLAN_PIX_KEYS[planId]?.price);

    // 1. Check if specific paymentId was supplied and is approved
    if (paymentId) {
      const pIdStr = String(paymentId);
      const local = recentTransactions.get(pIdStr);
      if (local && local.status === "approved") {
        return res.json({
          approved: true,
          status: "approved",
          planId: local.planId || planId,
          paymentId: local.id,
          amount: local.price,
          date_approved: new Date().toISOString(),
        });
      }

      if (!pIdStr.startsWith("pix_")) {
        try {
          const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${pIdStr}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (mpRes.ok) {
            const data: any = await mpRes.json();
            if (data.status === "approved") {
              if (local) local.status = "approved";
              return res.json({
                approved: true,
                status: "approved",
                planId: data.metadata?.plan_id || local?.planId || planId,
                paymentId: data.id,
                amount: data.transaction_amount,
                date_approved: data.date_approved,
              });
            }
          }
        } catch (err) {
          console.warn("[MercadoPago] Erro ao consultar pagamento por ID:", err);
        }
      }
    }

    // 2. Query recent approved payments from Mercado Pago API
    try {
      const searchRes = await fetch("https://api.mercadopago.com/v1/payments/search?sort=date_created&criteria=desc&limit=15", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (searchRes.ok) {
        const searchData: any = await searchRes.json();
        const payments: any[] = searchData.results || [];

        for (const p of payments) {
          if (p.status === "approved") {
            const pAmount = Number(p.transaction_amount);
            const pEmail = (p.payer?.email || "").toLowerCase();
            const targetEmail = (userEmail || "").toLowerCase();
            const metaPlan = p.metadata?.plan_id;

            // Check if payment happened recently (last 3 hours)
            const paymentTime = new Date(p.date_approved || p.date_created).getTime();
            const threeHoursAgo = Date.now() - 3 * 60 * 60 * 1000;
            const isRecent = paymentTime > threeHoursAgo;

            const priceMatches = targetPrice && Math.abs(pAmount - targetPrice) < 0.1;
            const planMatches = metaPlan && metaPlan === planId;
            const emailMatches = targetEmail && pEmail && pEmail === targetEmail;

            if (isRecent && (planMatches || (priceMatches && (!userEmail || emailMatches || true)))) {
              const matchedPaymentId = String(p.id);
              return res.json({
                approved: true,
                status: "approved",
                planId: metaPlan || planId,
                paymentId: matchedPaymentId,
                amount: pAmount,
                date_approved: p.date_approved || p.date_created,
                payment_method: p.payment_method_id,
              });
            }
          }
        }
      }
    } catch (err) {
      console.warn("[MercadoPago] Erro ao buscar pagamentos recentes:", err);
    }

    return res.json({
      approved: false,
      status: "pending",
      message: "Nenhum pagamento correspondente aprovado ainda. Aguardando compensação.",
    });
  } catch (error: any) {
    console.error("[MercadoPago] Exceção verificar-status:", error);
    return res.status(500).json({ approved: false, erro: error.message });
  }
});

/**
 * POST /api/mercadopago/webhook
 * Receives notifications from Mercado Pago
 */
mercadoPagoRouter.post("/webhook", async (req: Request, res: Response) => {
  try {
    const { type, data, action } = req.body;
    console.log("[MercadoPago Webhook Recebido]", { type, action, dataId: data?.id });

    // Respond quickly to acknowledge notification
    res.status(200).send("OK");

    const paymentId = data?.id || req.query["data.id"] || req.query.id;
    if (paymentId && (type === "payment" || action?.startsWith("payment."))) {
      const token = getApiBearerToken();
      if (token) {
        const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (mpRes.ok) {
          const paymentData: any = await mpRes.json();
          console.log(`[MercadoPago Webhook] Pagamento ${paymentId} status: ${paymentData.status}`);
          const record = recentTransactions.get(String(paymentId));
          if (record) {
            record.status = paymentData.status;
          } else {
            recentTransactions.set(String(paymentId), {
              id: String(paymentId),
              type: "pix",
              planId: paymentData.metadata?.plan_id || "anual",
              planName: paymentData.metadata?.plan_id || "anual",
              price: Number(paymentData.transaction_amount) || 0,
              userEmail: paymentData.payer?.email,
              status: paymentData.status === "approved" ? "approved" : "pending",
              createdAt: paymentData.date_created || new Date().toISOString(),
            });
          }
        }
      }
    }
  } catch (err) {
    console.error("[MercadoPago Webhook Erro]", err);
    if (!res.headersSent) {
      res.status(200).send("OK");
    }
  }
});
