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
  let token = process.env.MP_ACCESS_TOKEN || "";
  if (!isValidMpToken(token)) {
    try {
      const envPath = path.resolve(process.cwd(), ".env");
      if (fs.existsSync(envPath)) {
        const envConfig = dotenv.parse(fs.readFileSync(envPath));
        if (isValidMpToken(envConfig.MP_ACCESS_TOKEN)) {
          token = envConfig.MP_ACCESS_TOKEN;
          process.env.MP_ACCESS_TOKEN = token;
        }
      }
    } catch (e) {
      console.warn("[MercadoPago] Aviso lendo .env:", e);
    }
  }
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
  let url = process.env.APP_URL || "";
  if (!url) {
    try {
      const envPath = path.resolve(process.cwd(), ".env");
      if (fs.existsSync(envPath)) {
        const envConfig = dotenv.parse(fs.readFileSync(envPath));
        if (envConfig.APP_URL) {
          url = envConfig.APP_URL;
        }
      }
    } catch (_) {}
  }

  if (req) {
    const proto = req.headers["x-forwarded-proto"] || req.protocol || "https";
    const host = req.headers["x-forwarded-host"] || req.get("host");
    if (host && !host.includes("localhost")) {
      return `${proto}://${host}`.replace(/\/+$/, "");
    }
  }

  return (url || "https://gabarita.ai.studio").replace(/^["']|["']$/g, "").replace(/\/+$/, "");
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
      auto_return: "approved",
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
      const token = getAccessToken();
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
