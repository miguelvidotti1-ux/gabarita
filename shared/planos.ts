export type PlanoId = 'mensal' | 'trimestral' | 'semestral' | 'anual';

export interface PlanoConfig {
  id: PlanoId;
  nome: string;
  price: number;
  preco: number;
  preco_centavos: number;
  formattedPrice: string;
  meses: number;
  duracao_dias: number;
  periodLabel: string;
  cycleLabel: string;
  descricao: string;
  subtext: string;
  savings?: string;
  equivalenteMensal: string;
  destaque?: boolean;
}

export const PLANOS: Record<PlanoId, PlanoConfig> = {
  mensal: {
    id: 'mensal',
    nome: 'Mensal',
    price: 39.9,
    preco: 39.9,
    preco_centavos: 3990,
    formattedPrice: 'R$ 39,90',
    meses: 1,
    duracao_dias: 30,
    periodLabel: '/mês',
    cycleLabel: 'Acesso completo por 30 dias, sem fidelidade',
    descricao: 'Acesso completo por 30 dias: Treino Rápido, Simulador Sisu, IA, correções, simulados e playlists',
    subtext: 'Acesso completo por 30 dias, sem fidelidade',
    equivalenteMensal: 'R$ 39,90/mês',
  },
  trimestral: {
    id: 'trimestral',
    nome: 'Trimestral',
    price: 99.9,
    preco: 99.9,
    preco_centavos: 9990,
    formattedPrice: 'R$ 99,90',
    meses: 3,
    duracao_dias: 90,
    periodLabel: '/3 meses',
    cycleLabel: '3 meses de acesso completo — economia de R$ 19,80',
    descricao: '3 meses de acesso completo (R$ 33,30/mês — economia de R$ 19,80 sobre o mensal)',
    subtext: 'Economia de R$ 19,80 — equivalente a R$ 33,30/mês',
    savings: 'Economia de R$ 19,80',
    equivalenteMensal: 'R$ 33,30/mês',
  },
  semestral: {
    id: 'semestral',
    nome: 'Semestral',
    price: 179.9,
    preco: 179.9,
    preco_centavos: 17990,
    formattedPrice: 'R$ 179,90',
    meses: 6,
    duracao_dias: 180,
    periodLabel: '/6 meses',
    cycleLabel: '6 meses de acesso completo — economia de R$ 59,50',
    descricao: '6 meses de acesso completo — equivalente a R$ 29,98/mês (economia de R$ 59,50)',
    subtext: 'Economia de R$ 59,50 — acompanha o ciclo completo de simulados',
    savings: 'Economia de R$ 59,50',
    equivalenteMensal: 'R$ 29,98/mês',
    destaque: true,
  },
  anual: {
    id: 'anual',
    nome: 'Anual',
    price: 299.9,
    preco: 299.9,
    preco_centavos: 29990,
    formattedPrice: 'R$ 299,90',
    meses: 12,
    duracao_dias: 365,
    periodLabel: '/ano',
    cycleLabel: 'Acesso completo por 12 meses — equivalente a R$ 24,99/mês',
    descricao: 'Acesso completo por 12 meses — economia de R$ 178,90 no ano (R$ 24,99/mês)',
    subtext: 'Equivalente a R$ 24,99/mês — do início do ano até a prova',
    savings: 'Economia de R$ 178,90',
    equivalenteMensal: 'R$ 24,99/mês',
  },
};

export const PLANOS_CONFIG = PLANOS;

export const PLANOS_LISTA: PlanoConfig[] = [
  PLANOS.mensal,
  PLANOS.trimestral,
  PLANOS.semestral,
  PLANOS.anual,
];

export const PLANOS_IDS_VALIDOS = ['mensal', 'trimestral', 'semestral', 'anual', 'vip_pro'] as const;

export function formatarMoedaBRL(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function crc16Ccitt(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export function gerarPixEmvComValor(valor: number, txid: string): string {
  const valStr = valor.toFixed(2);
  const valLen = String(valStr.length).padStart(2, '0');
  const txidClean = txid.replace(/[^a-zA-Z0-9]/g, '').slice(0, 25);
  const txidField = `05${String(txidClean.length).padStart(2, '0')}${txidClean}`;
  const addDataField = `62${String(txidField.length).padStart(2, '0')}${txidField}`;
  const semCrc =
    '000201' +
    '26580014br.gov.bcb.pix0136b07c3c7d-57b9-4a7f-b19d-2963b5c4018b' +
    '52040000' +
    '5303986' +
    `54${valLen}${valStr}` +
    '5802BR' +
    '5912Luiz De Luca' +
    '6009Sao Paulo' +
    addDataField +
    '6304';
  return semCrc + crc16Ccitt(semCrc);
}
