/**
 * Mercado Pago Frontend Client Service
 * Interacts with /api/mercadopago/* server endpoints
 */

export interface PreferenceResponse {
  id: string;
  init_point: string;
  sandbox_init_point?: string;
  planId: string;
  price: number;
}

export interface PixPaymentResponse {
  id: string | number;
  status: string;
  qr_code?: string;
  qr_code_base64?: string;
  ticket_url?: string;
  fallbackToCheckout?: boolean;
}

export interface MercadoPagoConfig {
  configured: boolean;
  appUrl: string;
  environment: string;
}

export class MercadoPagoService {
  static async getConfig(): Promise<MercadoPagoConfig> {
    try {
      const res = await fetch('/api/mercadopago/config');
      if (!res.ok) throw new Error('Falha ao obter status do Mercado Pago');
      return await res.json();
    } catch (e) {
      return { configured: false, appUrl: '', environment: 'sandbox' };
    }
  }

  static async criarPreferencia(params: {
    planId: string;
    planName: string;
    price: number;
    userEmail?: string;
    userName?: string;
  }): Promise<PreferenceResponse> {
    const res = await fetch('/api/mercadopago/criar-preferencia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const text = await res.text();
    let data: any = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(`Resposta inválida do servidor (HTTP ${res.status}).`);
    }

    if (!res.ok) {
      throw new Error(data.erro || `Erro ao gerar checkout do Mercado Pago (HTTP ${res.status}).`);
    }
    return data;
  }

  static async criarPix(params: {
    planId: string;
    planName: string;
    price: number;
    userEmail?: string;
    userName?: string;
  }): Promise<PixPaymentResponse> {
    const res = await fetch('/api/mercadopago/criar-pix', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const text = await res.text();
    let data: any = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(`Resposta inválida do servidor ao gerar PIX (HTTP ${res.status}).`);
    }

    if (!res.ok && !data.fallbackToCheckout) {
      throw new Error(data.erro || 'Erro ao gerar cobrança PIX.');
    }
    return data;
  }

  static async consultarPagamento(paymentId: string | number): Promise<{
    id: string | number;
    status: string;
    status_detail?: string;
  }> {
    const res = await fetch(`/api/mercadopago/consultar-pagamento/${paymentId}`);
    const text = await res.text();
    let data: any = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error('Não foi possível verificar status do pagamento');
    }

    if (!res.ok) throw new Error(data.erro || 'Não foi possível verificar status do pagamento');
    return data;
  }

  static async verificarStatus(params: {
    planId: string;
    paymentId?: string | number | null;
    userEmail?: string;
    price?: number;
  }): Promise<{
    approved: boolean;
    status: string;
    planId?: string;
    paymentId?: string | number;
    amount?: number;
    message?: string;
    date_approved?: string;
    payment_method?: string;
  }> {
    try {
      const res = await fetch('/api/mercadopago/verificar-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const text = await res.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        return { approved: false, status: 'error', message: 'Erro ao verificar resposta do servidor.' };
      }
      return data;
    } catch (err: any) {
      return { approved: false, status: 'error', message: err.message || 'Erro ao conectar ao servidor.' };
    }
  }
}
