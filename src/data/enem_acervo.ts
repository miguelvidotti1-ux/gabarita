// Arquivo gerado a partir do acervo oficial INEP (ENEM 2010–2026)

export type EnemAplicacao = 'Regular' | 'PPL / 2ª Aplicação' | 'Digital' | '3ª Aplicação';

export interface EnemDocItem {
  label: string;
  shortLabel: string;
  url: string;
  tipo: 'prova' | 'gabarito';
  dia: 1 | 2;
  aplicacao: EnemAplicacao;
  caderno?: string;
  cor?: string;
  acessibilidade?: string;
  idioma?: 'Inglês' | 'Espanhol';
  isRedacaoTema?: boolean;
}

export interface EnemYearItem {
  ano: number;
  rotulo: string;
  paginaOficial: string;
  observacao?: string;
  dia1: {
    provas: EnemDocItem[];
    gabaritos: EnemDocItem[];
  };
  dia2: {
    provas: EnemDocItem[];
    gabaritos: EnemDocItem[];
  };
}

export const ENEM_ACERVO_TABLE: EnemYearItem[] = [
  {
    "ano": 2026,
    "rotulo": "ENEM 2026",
    "paginaOficial": "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos",
    "dia1": {
      "provas": [
        {
          "label": "ENEM 2026 — 1º Dia Prova — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Prova (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_PV_impresso_D1_CD1.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2026 — 1º Dia Prova — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Prova (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_PV_impresso_D1_CD2.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2026 — 1º Dia Prova — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_PV_impresso_D1_CD3.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2026 — 1º Dia Prova — Caderno 4 Verde",
          "shortLabel": "Caderno 4 Verde — Prova (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_PV_impresso_D1_CD4.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Verde",
          "cor": "Verde"
        },
        {
          "label": "ENEM 2026 — 1º Dia Prova — Caderno 9 Marrom · Braile e Ledor",
          "shortLabel": "Caderno 9 Marrom · Braile e Ledor — Prova (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_PV_impresso_D1_CD9.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Marrom",
          "cor": "Marrom",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2026 — 1º Dia Prova — Caderno 9 Marrom · Ledor",
          "shortLabel": "Caderno 9 Marrom · Ledor — Prova (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_PV_impresso_D1_CD9_ledor.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Marrom",
          "cor": "Marrom",
          "acessibilidade": "Ledor"
        },
        {
          "label": "ENEM 2026 — 1º Dia Prova — Caderno 9 Marrom · Ampliada",
          "shortLabel": "Caderno 9 Marrom · Ampliada — Prova (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_PV_impresso_D1_CD9_ampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Marrom",
          "cor": "Marrom",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2026 — 1º Dia Prova — Caderno 9 Marrom · Superampliada",
          "shortLabel": "Caderno 9 Marrom · Superampliada — Prova (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_PV_impresso_D1_CD9_superampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Marrom",
          "cor": "Marrom",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2026 — 1º Dia Prova — Caderno 9 Marrom · NVDA",
          "shortLabel": "Caderno 9 Marrom · NVDA — Prova (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_Dia_1_P1_LC_CH_Caderno_09_Marrom_NVDA.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Marrom",
          "cor": "Marrom",
          "acessibilidade": "NVDA"
        },
        {
          "label": "ENEM 2026 — 1º Dia Prova — Caderno 9 Marrom · DOSVOX TXT",
          "shortLabel": "Caderno 9 Marrom · DOSVOX TXT — Prova (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_Dia_1_P1_LC_CH_Caderno_09_Marrom_DOSVOX.txt",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Marrom",
          "cor": "Marrom",
          "acessibilidade": "DOSVOX TXT"
        },
        {
          "label": "ENEM 2026 — 1º Dia Prova — Caderno 10 Roxo · Libras",
          "shortLabel": "Caderno 10 Roxo · Libras — Prova (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_PV_impresso_D1_CD10.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 10 Roxo",
          "cor": "Roxo",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2026 — 1º Dia Prova — Caderno 10 Roxo · Ampliada · Libras",
          "shortLabel": "Caderno 10 Roxo · Ampliada · Libras — Prova (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_PV_impresso_D1_CD10_ampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 10 Roxo",
          "cor": "Roxo",
          "acessibilidade": "Ampliada · Libras"
        },
        {
          "label": "ENEM 2026 — 1º Dia Prova — Caderno 10 Roxo · Superampliada · Libras",
          "shortLabel": "Caderno 10 Roxo · Superampliada · Libras — Prova (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_PV_impresso_D1_CD10_superampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 10 Roxo",
          "cor": "Roxo",
          "acessibilidade": "Superampliada · Libras"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2026 — 1º Dia Gabarito — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Gabarito (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_GB_impresso_D1_CD1.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2026 — 1º Dia Gabarito — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Gabarito (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_GB_impresso_D1_CD2.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2026 — 1º Dia Gabarito — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Gabarito (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_GB_impresso_D1_CD3.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2026 — 1º Dia Gabarito — Caderno 4 Verde",
          "shortLabel": "Caderno 4 Verde — Gabarito (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_GB_impresso_D1_CD4.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Verde",
          "cor": "Verde"
        },
        {
          "label": "ENEM 2026 — 1º Dia Gabarito — Caderno 9 Marrom · Braile e Ledor",
          "shortLabel": "Caderno 9 Marrom · Braile e Ledor — Gabarito (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_GB_impresso_D1_CD9.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Marrom",
          "cor": "Marrom",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2026 — 1º Dia Gabarito — Caderno 10 Roxo · Libras",
          "shortLabel": "Caderno 10 Roxo · Libras — Gabarito (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_GB_impresso_D1_CD10.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 10 Roxo",
          "cor": "Roxo",
          "acessibilidade": "Libras"
        }
      ]
    },
    "dia2": {
      "provas": [
        {
          "label": "ENEM 2026 — 2º Dia Prova — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Prova (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_PV_impresso_D2_CD5.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2026 — 2º Dia Prova — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_PV_impresso_D2_CD6.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2026 — 2º Dia Prova — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Prova (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_PV_impresso_D2_CD7.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2026 — 2º Dia Prova — Caderno 8 Verde",
          "shortLabel": "Caderno 8 Verde — Prova (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_PV_impresso_D2_CD8.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Verde",
          "cor": "Verde"
        },
        {
          "label": "ENEM 2026 — 2º Dia Prova — Caderno 11 Marrom · Braile e Ledor",
          "shortLabel": "Caderno 11 Marrom · Braile e Ledor — Prova (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_PV_impresso_D2_CD11.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Marrom",
          "cor": "Marrom",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2026 — 2º Dia Prova — Caderno 11 Marrom · Ledor",
          "shortLabel": "Caderno 11 Marrom · Ledor — Prova (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_PV_impresso_D2_CD11_ledor.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Marrom",
          "cor": "Marrom",
          "acessibilidade": "Ledor"
        },
        {
          "label": "ENEM 2026 — 2º Dia Prova — Caderno 11 Marrom · Ampliada",
          "shortLabel": "Caderno 11 Marrom · Ampliada — Prova (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_PV_impresso_D2_CD11_ampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Marrom",
          "cor": "Marrom",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2026 — 2º Dia Prova — Caderno 11 Marrom · Superampliada",
          "shortLabel": "Caderno 11 Marrom · Superampliada — Prova (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_PV_impresso_D2_CD11_superampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Marrom",
          "cor": "Marrom",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2026 — 2º Dia Prova — Caderno 11 Marrom · NVDA",
          "shortLabel": "Caderno 11 Marrom · NVDA — Prova (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_Dia_2_P1_CN_MT_Caderno_11_Marrom_NVDA.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Marrom",
          "cor": "Marrom",
          "acessibilidade": "NVDA"
        },
        {
          "label": "ENEM 2026 — 2º Dia Prova — Caderno 11 Marrom · DOSVOX TXT",
          "shortLabel": "Caderno 11 Marrom · DOSVOX TXT — Prova (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_Dia_2_P1_CN_MT_Caderno_11_Marrom_DOSVOX.txt",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Marrom",
          "cor": "Marrom",
          "acessibilidade": "DOSVOX TXT"
        },
        {
          "label": "ENEM 2026 — 2º Dia Prova — Caderno 12 Roxo · Libras",
          "shortLabel": "Caderno 12 Roxo · Libras — Prova (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_PV_impresso_D2_CD12.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 12 Roxo",
          "cor": "Roxo",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2026 — 2º Dia Prova — Caderno 12 Roxo · Ampliada · Libras",
          "shortLabel": "Caderno 12 Roxo · Ampliada · Libras — Prova (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_PV_impresso_D2_CD12_ampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 12 Roxo",
          "cor": "Roxo",
          "acessibilidade": "Ampliada · Libras"
        },
        {
          "label": "ENEM 2026 — 2º Dia Prova — Caderno 12 Roxo · Superampliada · Libras",
          "shortLabel": "Caderno 12 Roxo · Superampliada · Libras — Prova (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_PV_impresso_D2_CD12_superampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 12 Roxo",
          "cor": "Roxo",
          "acessibilidade": "Superampliada · Libras"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2026 — 2º Dia Gabarito — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Gabarito (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_GB_impresso_D2_CD5.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2026 — 2º Dia Gabarito — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Gabarito (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_GB_impresso_D2_CD6.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2026 — 2º Dia Gabarito — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Gabarito (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_GB_impresso_D2_CD7.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2026 — 2º Dia Gabarito — Caderno 8 Verde",
          "shortLabel": "Caderno 8 Verde — Gabarito (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_GB_impresso_D2_CD8.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Verde",
          "cor": "Verde"
        },
        {
          "label": "ENEM 2026 — 2º Dia Gabarito — Caderno 11 Marrom · Braile e Ledor",
          "shortLabel": "Caderno 11 Marrom · Braile e Ledor — Gabarito (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_GB_impresso_D2_CD11.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Marrom",
          "cor": "Marrom",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2026 — 2º Dia Gabarito — Caderno 12 Roxo · Libras",
          "shortLabel": "Caderno 12 Roxo · Libras — Gabarito (2026)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2026_GB_impresso_D2_CD12.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 12 Roxo",
          "cor": "Roxo",
          "acessibilidade": "Libras"
        }
      ]
    },
    "observacao": "Aplicação Regular (38 arquivos oficiais INEP)"
  },
  {
    "ano": 2025,
    "rotulo": "ENEM 2025",
    "paginaOficial": "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos",
    "dia1": {
      "provas": [
        {
          "label": "ENEM 2025 — 1º Dia Prova — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D1_CD1.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2025 — 1º Dia Prova — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D1_CD2.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2025 — 1º Dia Prova — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D1_CD3.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2025 — 1º Dia Prova — Caderno 4 Verde",
          "shortLabel": "Caderno 4 Verde — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D1_CD4.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Verde",
          "cor": "Verde"
        },
        {
          "label": "ENEM 2025 — 1º Dia Prova — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D1_CD9.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2025 — 1º Dia Prova — Caderno 9 Laranja · Ledor",
          "shortLabel": "Caderno 9 Laranja · Ledor — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D1_CD9_ledor.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Ledor"
        },
        {
          "label": "ENEM 2025 — 1º Dia Prova — Caderno 9 Laranja · Ampliada",
          "shortLabel": "Caderno 9 Laranja · Ampliada — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D1_CD9_ampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2025 — 1º Dia Prova — Caderno 9 Laranja · Superampliada",
          "shortLabel": "Caderno 9 Laranja · Superampliada — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D1_CD9_superampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2025 — 1º Dia Prova — Caderno 9 Laranja · NVDA",
          "shortLabel": "Caderno 9 Laranja · NVDA — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_Dia_1_P1_LC_CH_Caderno_09_Laranja_NVDA.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "NVDA"
        },
        {
          "label": "ENEM 2025 — 1º Dia Prova — Caderno 9 Laranja · DOSVOX TXT",
          "shortLabel": "Caderno 9 Laranja · DOSVOX TXT — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_Dia_1_P1_LC_CH_Caderno_09_Laranja_DOSVOX.txt",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "DOSVOX TXT"
        },
        {
          "label": "ENEM 2025 — 1º Dia Prova — Caderno 10 Roxo · Libras",
          "shortLabel": "Caderno 10 Roxo · Libras — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D1_CD10.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 10 Roxo",
          "cor": "Roxo",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2025 — 1º Dia Prova — Caderno 10 Roxo · Ampliada · Libras",
          "shortLabel": "Caderno 10 Roxo · Ampliada · Libras — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D1_CD10_ampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 10 Roxo",
          "cor": "Roxo",
          "acessibilidade": "Ampliada · Libras"
        },
        {
          "label": "ENEM 2025 — 1º Dia Prova — Caderno 10 Roxo · Superampliada · Libras",
          "shortLabel": "Caderno 10 Roxo · Superampliada · Libras — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D1_CD10_superampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 10 Roxo",
          "cor": "Roxo",
          "acessibilidade": "Superampliada · Libras"
        },
        {
          "label": "ENEM 2025 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D3_CD1.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2025 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D3_CD2.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2025 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D3_CD3.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2025 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 4 Verde",
          "shortLabel": "Caderno 4 Verde — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D3_CD4.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 4 Verde",
          "cor": "Verde"
        },
        {
          "label": "ENEM 2025 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D3_CD9.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2025 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 9 Laranja · Ledor",
          "shortLabel": "Caderno 9 Laranja · Ledor — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D3_CD9_ledor.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Ledor"
        },
        {
          "label": "ENEM 2025 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 9 Laranja · Ampliada",
          "shortLabel": "Caderno 9 Laranja · Ampliada — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D3_CD9_ampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2025 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 9 Laranja · Superampliada",
          "shortLabel": "Caderno 9 Laranja · Superampliada — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D3_CD9_superampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2025 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 9 Laranja · NVDA",
          "shortLabel": "Caderno 9 Laranja · NVDA — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_Dia_1_P2_LC_CH_Caderno_09_Laranja_NVDA.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "NVDA"
        },
        {
          "label": "ENEM 2025 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 9 Laranja · DOSVOX TXT",
          "shortLabel": "Caderno 9 Laranja · DOSVOX TXT — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_Dia_1_P2_LC_CH_Caderno_09_Laranja_DOSVOX.txt",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "DOSVOX TXT"
        },
        {
          "label": "ENEM 2025 — 1º Dia Prova (3ª Aplicação) — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D5_CD1.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "3ª Aplicação",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2025 — 1º Dia Prova (3ª Aplicação) — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D5_CD2.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "3ª Aplicação",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2025 — 1º Dia Prova (3ª Aplicação) — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D5_CD3.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "3ª Aplicação",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2025 — 1º Dia Prova (3ª Aplicação) — Caderno 4 Verde",
          "shortLabel": "Caderno 4 Verde — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D5_CD4.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "3ª Aplicação",
          "caderno": "Caderno 4 Verde",
          "cor": "Verde"
        },
        {
          "label": "ENEM 2025 — 1º Dia Prova (3ª Aplicação) — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D5_CD9.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "3ª Aplicação",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2025 — 1º Dia Prova (3ª Aplicação) — Caderno 9 Laranja · Ledor",
          "shortLabel": "Caderno 9 Laranja · Ledor — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D5_CD9_ledor.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "3ª Aplicação",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Ledor"
        },
        {
          "label": "ENEM 2025 — 1º Dia Prova (3ª Aplicação) — Caderno 9 Laranja · Ampliada",
          "shortLabel": "Caderno 9 Laranja · Ampliada — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D5_CD9_ampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "3ª Aplicação",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2025 — 1º Dia Prova (3ª Aplicação) — Caderno 9 Laranja · Superampliada",
          "shortLabel": "Caderno 9 Laranja · Superampliada — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D5_CD9_superampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "3ª Aplicação",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Superampliada"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2025 — 1º Dia Gabarito — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Gabarito (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D1_CD1.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2025 — 1º Dia Gabarito — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Gabarito (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D1_CD2.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2025 — 1º Dia Gabarito — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Gabarito (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D1_CD3.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2025 — 1º Dia Gabarito — Caderno 4 Verde",
          "shortLabel": "Caderno 4 Verde — Gabarito (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D1_CD4.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Verde",
          "cor": "Verde"
        },
        {
          "label": "ENEM 2025 — 1º Dia Gabarito — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Gabarito (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D1_CD9.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2025 — 1º Dia Gabarito — Caderno 10 Roxo · Libras",
          "shortLabel": "Caderno 10 Roxo · Libras — Gabarito (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D1_CD10.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 10 Roxo",
          "cor": "Roxo",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2025 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Gabarito (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D3_CD1.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2025 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Gabarito (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D3_CD2.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2025 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Gabarito (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D3_CD3.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2025 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 4 Verde",
          "shortLabel": "Caderno 4 Verde — Gabarito (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D3_CD4.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 4 Verde",
          "cor": "Verde"
        },
        {
          "label": "ENEM 2025 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Gabarito (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D3_CD9.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2025 — 1º Dia Gabarito (3ª Aplicação) — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Gabarito (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D5_CD1.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "3ª Aplicação",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2025 — 1º Dia Gabarito (3ª Aplicação) — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Gabarito (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D5_CD2.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "3ª Aplicação",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2025 — 1º Dia Gabarito (3ª Aplicação) — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Gabarito (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D5_CD3.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "3ª Aplicação",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2025 — 1º Dia Gabarito (3ª Aplicação) — Caderno 4 Verde",
          "shortLabel": "Caderno 4 Verde — Gabarito (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D5_CD4.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "3ª Aplicação",
          "caderno": "Caderno 4 Verde",
          "cor": "Verde"
        },
        {
          "label": "ENEM 2025 — 1º Dia Gabarito (3ª Aplicação) — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Gabarito (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D5_CD9.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "3ª Aplicação",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        }
      ]
    },
    "dia2": {
      "provas": [
        {
          "label": "ENEM 2025 — 2º Dia Prova — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D2_CD5.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2025 — 2º Dia Prova — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D2_CD6.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2025 — 2º Dia Prova — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D2_CD7.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2025 — 2º Dia Prova — Caderno 8 Verde",
          "shortLabel": "Caderno 8 Verde — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D2_CD8.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Verde",
          "cor": "Verde"
        },
        {
          "label": "ENEM 2025 — 2º Dia Prova — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D2_CD11.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2025 — 2º Dia Prova — Caderno 11 Laranja · Ledor",
          "shortLabel": "Caderno 11 Laranja · Ledor — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D2_CD11_ledor.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Ledor"
        },
        {
          "label": "ENEM 2025 — 2º Dia Prova — Caderno 11 Laranja · Ampliada",
          "shortLabel": "Caderno 11 Laranja · Ampliada — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D2_CD11_ampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2025 — 2º Dia Prova — Caderno 11 Laranja · Superampliada",
          "shortLabel": "Caderno 11 Laranja · Superampliada — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D2_CD11_superampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2025 — 2º Dia Prova — Caderno 11 Laranja · NVDA",
          "shortLabel": "Caderno 11 Laranja · NVDA — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_Dia_2_P1_CN_MT_Caderno_11_Laranja_NVDA.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "NVDA"
        },
        {
          "label": "ENEM 2025 — 2º Dia Prova — Caderno 11 Laranja · DOSVOX TXT",
          "shortLabel": "Caderno 11 Laranja · DOSVOX TXT — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_Dia_2_P1_CN_MT_Caderno_11_Laranja_DOSVOX.txt",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "DOSVOX TXT"
        },
        {
          "label": "ENEM 2025 — 2º Dia Prova — Caderno 12 Roxo · Libras",
          "shortLabel": "Caderno 12 Roxo · Libras — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D2_CD12.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 12 Roxo",
          "cor": "Roxo",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2025 — 2º Dia Prova — Caderno 12 Roxo · Ampliada · Libras",
          "shortLabel": "Caderno 12 Roxo · Ampliada · Libras — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D2_CD12_ampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 12 Roxo",
          "cor": "Roxo",
          "acessibilidade": "Ampliada · Libras"
        },
        {
          "label": "ENEM 2025 — 2º Dia Prova — Caderno 12 Roxo · Superampliada · Libras",
          "shortLabel": "Caderno 12 Roxo · Superampliada · Libras — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D2_CD12_superampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 12 Roxo",
          "cor": "Roxo",
          "acessibilidade": "Superampliada · Libras"
        },
        {
          "label": "ENEM 2025 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D4_CD5.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2025 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D4_CD6.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2025 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D4_CD7.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2025 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 8 Verde",
          "shortLabel": "Caderno 8 Verde — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D4_CD8.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 8 Verde",
          "cor": "Verde"
        },
        {
          "label": "ENEM 2025 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D4_CD11.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2025 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 11 Laranja · Ledor",
          "shortLabel": "Caderno 11 Laranja · Ledor — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D4_CD11_ledor.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Ledor"
        },
        {
          "label": "ENEM 2025 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 11 Laranja · Ampliada",
          "shortLabel": "Caderno 11 Laranja · Ampliada — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D4_CD11_ampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2025 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 11 Laranja · Superampliada",
          "shortLabel": "Caderno 11 Laranja · Superampliada — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D4_CD11_superampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2025 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 11 Laranja · NVDA",
          "shortLabel": "Caderno 11 Laranja · NVDA — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_Dia_2_P2_CN_MT_Caderno_11_Laranja_NVDA.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "NVDA"
        },
        {
          "label": "ENEM 2025 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 11 Laranja · DOSVOX TXT",
          "shortLabel": "Caderno 11 Laranja · DOSVOX TXT — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_Dia_2_P2_CN_MT_Caderno_11_Laranja_DOSVOX.txt",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "DOSVOX TXT"
        },
        {
          "label": "ENEM 2025 — 2º Dia Prova (3ª Aplicação) — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D6_CD5.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "3ª Aplicação",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2025 — 2º Dia Prova (3ª Aplicação) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D6_CD6.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "3ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2025 — 2º Dia Prova (3ª Aplicação) — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D6_CD7.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "3ª Aplicação",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2025 — 2º Dia Prova (3ª Aplicação) — Caderno 8 Verde",
          "shortLabel": "Caderno 8 Verde — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D6_CD8.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "3ª Aplicação",
          "caderno": "Caderno 8 Verde",
          "cor": "Verde"
        },
        {
          "label": "ENEM 2025 — 2º Dia Prova (3ª Aplicação) — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D6_CD11.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "3ª Aplicação",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2025 — 2º Dia Prova (3ª Aplicação) — Caderno 11 Laranja · Ledor",
          "shortLabel": "Caderno 11 Laranja · Ledor — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D6_CD11_ledor.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "3ª Aplicação",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Ledor"
        },
        {
          "label": "ENEM 2025 — 2º Dia Prova (3ª Aplicação) — Caderno 11 Laranja · Ampliada",
          "shortLabel": "Caderno 11 Laranja · Ampliada — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D6_CD11_ampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "3ª Aplicação",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2025 — 2º Dia Prova (3ª Aplicação) — Caderno 11 Laranja · Superampliada",
          "shortLabel": "Caderno 11 Laranja · Superampliada — Prova (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D6_CD11_superampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "3ª Aplicação",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Superampliada"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2025 — 2º Dia Gabarito — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Gabarito (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D2_CD5.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2025 — 2º Dia Gabarito — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Gabarito (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D2_CD6.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2025 — 2º Dia Gabarito — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Gabarito (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D2_CD7.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2025 — 2º Dia Gabarito — Caderno 8 Verde",
          "shortLabel": "Caderno 8 Verde — Gabarito (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D2_CD8.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Verde",
          "cor": "Verde"
        },
        {
          "label": "ENEM 2025 — 2º Dia Gabarito — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Gabarito (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D2_CD11.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2025 — 2º Dia Gabarito — Caderno 12 Roxo · Libras",
          "shortLabel": "Caderno 12 Roxo · Libras — Gabarito (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D2_CD12.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 12 Roxo",
          "cor": "Roxo",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2025 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Gabarito (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D4_CD5.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2025 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Gabarito (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D4_CD6.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2025 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Gabarito (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D4_CD7.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2025 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 8 Verde",
          "shortLabel": "Caderno 8 Verde — Gabarito (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D4_CD8.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 8 Verde",
          "cor": "Verde"
        },
        {
          "label": "ENEM 2025 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Gabarito (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D4_CD11.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2025 — 2º Dia Gabarito (3ª Aplicação) — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Gabarito (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D6_CD5.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "3ª Aplicação",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2025 — 2º Dia Gabarito (3ª Aplicação) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Gabarito (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D6_CD6.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "3ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2025 — 2º Dia Gabarito (3ª Aplicação) — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Gabarito (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D6_CD7.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "3ª Aplicação",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2025 — 2º Dia Gabarito (3ª Aplicação) — Caderno 8 Verde",
          "shortLabel": "Caderno 8 Verde — Gabarito (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D6_CD8.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "3ª Aplicação",
          "caderno": "Caderno 8 Verde",
          "cor": "Verde"
        },
        {
          "label": "ENEM 2025 — 2º Dia Gabarito (3ª Aplicação) — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Gabarito (2025)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D6_CD11.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "3ª Aplicação",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        }
      ]
    },
    "observacao": "Aplicação Regular · Reaplicação / PPL · 3ª Aplicação (94 arquivos oficiais INEP)"
  },
  {
    "ano": 2024,
    "rotulo": "ENEM 2024",
    "paginaOficial": "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos",
    "dia1": {
      "provas": [
        {
          "label": "ENEM 2024 — 1º Dia Prova — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D1_CD1.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2024 — 1º Dia Prova — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D1_CD2.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2024 — 1º Dia Prova — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D1_CD3.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2024 — 1º Dia Prova — Caderno 4 Verde",
          "shortLabel": "Caderno 4 Verde — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D1_CD4.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Verde",
          "cor": "Verde"
        },
        {
          "label": "ENEM 2024 — 1º Dia Prova — Caderno 4 Verde · Ampliada",
          "shortLabel": "Caderno 4 Verde · Ampliada — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D1_CD4_ampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Verde",
          "cor": "Verde",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2024 — 1º Dia Prova — Caderno 4 Verde · Superampliada",
          "shortLabel": "Caderno 4 Verde · Superampliada — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D1_CD4_superampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Verde",
          "cor": "Verde",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2024 — 1º Dia Prova — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D1_CD9.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2024 — 1º Dia Prova — Caderno 9 Laranja · NVDA",
          "shortLabel": "Caderno 9 Laranja · NVDA — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_Dia_1_P1_LC_CH_Caderno_09_Laranja_NVDA.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "NVDA"
        },
        {
          "label": "ENEM 2024 — 1º Dia Prova — Caderno 9 Laranja · DOSVOX TXT",
          "shortLabel": "Caderno 9 Laranja · DOSVOX TXT — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_Dia_1_P1_LC_CH_Caderno_09_Laranja_DOSVOX.txt",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "DOSVOX TXT"
        },
        {
          "label": "ENEM 2024 — 1º Dia Prova — Caderno 10 Roxo · Libras",
          "shortLabel": "Caderno 10 Roxo · Libras — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D1_CD10.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 10 Roxo",
          "cor": "Roxo",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2024 — 1º Dia Prova — Caderno 10 Roxo · Ampliada · Libras",
          "shortLabel": "Caderno 10 Roxo · Ampliada · Libras — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D1_CD10_ampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 10 Roxo",
          "cor": "Roxo",
          "acessibilidade": "Ampliada · Libras"
        },
        {
          "label": "ENEM 2024 — 1º Dia Prova — Caderno 10 Roxo · Superampliada · Libras",
          "shortLabel": "Caderno 10 Roxo · Superampliada · Libras — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D1_CD10_superampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 10 Roxo",
          "cor": "Roxo",
          "acessibilidade": "Superampliada · Libras"
        },
        {
          "label": "ENEM 2024 — Tema da Redação (PPL / 2ª Aplicação)",
          "shortLabel": "Tema da Redação (PPL / 2ª Aplicação) (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/tema_redacao_2_aplicacao_2024.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "isRedacaoTema": true
        },
        {
          "label": "ENEM 2024 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_reaplicacao_PPL_D1_CD1.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2024 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_reaplicacao_PPL_D1_CD2.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2024 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_reaplicacao_PPL_D1_CD3.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2024 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 4 Verde",
          "shortLabel": "Caderno 4 Verde — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_reaplicacao_PPL_D1_CD4.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 4 Verde",
          "cor": "Verde"
        },
        {
          "label": "ENEM 2024 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 4 Verde · Ampliada",
          "shortLabel": "Caderno 4 Verde · Ampliada — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_reaplicacao_PPL_D1_CD4_ampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 4 Verde",
          "cor": "Verde",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2024 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 4 Verde · Superampliada",
          "shortLabel": "Caderno 4 Verde · Superampliada — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_reaplicacao_PPL_D1_CD4_superampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 4 Verde",
          "cor": "Verde",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2024 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_reaplicacao_PPL_D1_CD9_braile_e_ledor.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2024 — 1º Dia Gabarito — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Gabarito (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D1_CD1.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2024 — 1º Dia Gabarito — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Gabarito (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D1_CD2.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2024 — 1º Dia Gabarito — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Gabarito (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D1_CD3.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2024 — 1º Dia Gabarito — Caderno 4 Verde",
          "shortLabel": "Caderno 4 Verde — Gabarito (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D1_CD4.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Verde",
          "cor": "Verde"
        },
        {
          "label": "ENEM 2024 — 1º Dia Gabarito — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Gabarito (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D1_CD9.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2024 — 1º Dia Gabarito — Caderno 10 Roxo · Libras",
          "shortLabel": "Caderno 10 Roxo · Libras — Gabarito (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D1_CD10.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 10 Roxo",
          "cor": "Roxo",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2024 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Gabarito (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_reaplicacao_PPL_D1_CD1.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2024 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Gabarito (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_reaplicacao_PPL_D1_CD2.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2024 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Gabarito (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_reaplicacao_PPL_D1_CD3.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2024 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 4 Verde",
          "shortLabel": "Caderno 4 Verde — Gabarito (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_reaplicacao_PPL_D1_CD4.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 4 Verde",
          "cor": "Verde"
        },
        {
          "label": "ENEM 2024 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Gabarito (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_reaplicacao_PPL_D1_CD9_braile_e_ledor.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        }
      ]
    },
    "dia2": {
      "provas": [
        {
          "label": "ENEM 2024 — 2º Dia Prova — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D2_CD5.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2024 — 2º Dia Prova — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D2_CD6.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2024 — 2º Dia Prova — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D2_CD7.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2024 — 2º Dia Prova — Caderno 8 Verde",
          "shortLabel": "Caderno 8 Verde — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D2_CD8.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Verde",
          "cor": "Verde"
        },
        {
          "label": "ENEM 2024 — 2º Dia Prova — Caderno 8 Verde · Ampliada",
          "shortLabel": "Caderno 8 Verde · Ampliada — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D2_CD8_ampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Verde",
          "cor": "Verde",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2024 — 2º Dia Prova — Caderno 8 Verde · Superampliada",
          "shortLabel": "Caderno 8 Verde · Superampliada — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D2_CD8_superampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Verde",
          "cor": "Verde",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2024 — 2º Dia Prova — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D2_CD11.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2024 — 2º Dia Prova — Caderno 11 Laranja · NVDA",
          "shortLabel": "Caderno 11 Laranja · NVDA — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_Dia_2_P1_CN_MT_Caderno_11_Laranja_NVDA.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "NVDA"
        },
        {
          "label": "ENEM 2024 — 2º Dia Prova — Caderno 11 Laranja · DOSVOX TXT",
          "shortLabel": "Caderno 11 Laranja · DOSVOX TXT — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_Dia_2_P1_CN_MT_Caderno_11_Laranja_DOSVOX.txt",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "DOSVOX TXT"
        },
        {
          "label": "ENEM 2024 — 2º Dia Prova — Caderno 12 Roxo · Libras",
          "shortLabel": "Caderno 12 Roxo · Libras — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D2_CD12.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 12 Roxo",
          "cor": "Roxo",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2024 — 2º Dia Prova — Caderno 12 Roxo · Ampliada · Libras",
          "shortLabel": "Caderno 12 Roxo · Ampliada · Libras — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D2_CD12_ampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 12 Roxo",
          "cor": "Roxo",
          "acessibilidade": "Ampliada · Libras"
        },
        {
          "label": "ENEM 2024 — 2º Dia Prova — Caderno 12 Roxo · Superampliada · Libras",
          "shortLabel": "Caderno 12 Roxo · Superampliada · Libras — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D2_CD12_Superampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 12 Roxo",
          "cor": "Roxo",
          "acessibilidade": "Superampliada · Libras"
        },
        {
          "label": "ENEM 2024 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_reaplicacao_PPL_D2_CD5.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2024 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_reaplicacao_PPL_D2_CD6.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2024 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_reaplicacao_PPL_D2_CD7.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2024 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 8 Verde",
          "shortLabel": "Caderno 8 Verde — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_reaplicacao_PPL_D2_CD8.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 8 Verde",
          "cor": "Verde"
        },
        {
          "label": "ENEM 2024 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 8 Verde · Ampliada",
          "shortLabel": "Caderno 8 Verde · Ampliada — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_reaplicacao_PPL_D2_CD8_ampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 8 Verde",
          "cor": "Verde",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2024 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 8 Verde · Superampliada",
          "shortLabel": "Caderno 8 Verde · Superampliada — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_reaplicacao_PPL_D2_CD8_superampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 8 Verde",
          "cor": "Verde",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2024 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Prova (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_reaplicacao_PPL_D2_CD11_braile_e_ledor.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2024 — 2º Dia Gabarito — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Gabarito (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D2_CD5.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2024 — 2º Dia Gabarito — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Gabarito (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D2_CD6.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2024 — 2º Dia Gabarito — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Gabarito (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D2_CD7.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2024 — 2º Dia Gabarito — Caderno 8 Verde",
          "shortLabel": "Caderno 8 Verde — Gabarito (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D2_CD8.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Verde",
          "cor": "Verde"
        },
        {
          "label": "ENEM 2024 — 2º Dia Gabarito — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Gabarito (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D2_CD11.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2024 — 2º Dia Gabarito — Caderno 12 Roxo · Libras",
          "shortLabel": "Caderno 12 Roxo · Libras — Gabarito (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D2_CD12.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 12 Roxo",
          "cor": "Roxo",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2024 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Gabarito (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_reaplicacao_PPL_D2_CD5.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2024 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Gabarito (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_reaplicacao_PPL_D2_CD6.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2024 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Gabarito (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_reaplicacao_PPL_D2_CD7.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2024 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 8 Verde",
          "shortLabel": "Caderno 8 Verde — Gabarito (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_reaplicacao_PPL_D2_CD8.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 8 Verde",
          "cor": "Verde"
        },
        {
          "label": "ENEM 2024 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Gabarito (2024)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_reaplicacao_PPL_D2_CD11_braile_e_ledor.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        }
      ]
    },
    "observacao": "Aplicação Regular · Reaplicação / PPL (61 arquivos oficiais INEP)"
  },
  {
    "ano": 2023,
    "rotulo": "ENEM 2023",
    "paginaOficial": "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos",
    "dia1": {
      "provas": [
        {
          "label": "ENEM 2023 — Tema da Redação",
          "shortLabel": "Tema da Redação (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/tema_redacao_2023.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "isRedacaoTema": true
        },
        {
          "label": "ENEM 2023 — 1º Dia Prova — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D1_CD1.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2023 — 1º Dia Prova — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D1_CD2.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2023 — 1º Dia Prova — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D1_CD3.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2023 — 1º Dia Prova — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D1_CD4.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2023 — 1º Dia Prova — Caderno 4 Rosa · Ampliada",
          "shortLabel": "Caderno 4 Rosa · Ampliada — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D1_CD4_ampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2023 — 1º Dia Prova — Caderno 4 Rosa · Superampliada",
          "shortLabel": "Caderno 4 Rosa · Superampliada — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D1_CD4_superampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2023 — 1º Dia Prova — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D1_CD9.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2023 — 1º Dia Prova — Caderno 9 Laranja · Ciências Humanas · NVDA",
          "shortLabel": "Caderno 9 Laranja · Ciências Humanas · NVDA — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_Dia_1_P1_CH_Caderno_09_Laranja_NVDA.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "NVDA"
        },
        {
          "label": "ENEM 2023 — 1º Dia Prova — Caderno 9 Laranja · Ciências Humanas · DOSVOX TXT",
          "shortLabel": "Caderno 9 Laranja · Ciências Humanas · DOSVOX TXT — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_Dia_1_P1_CH_Caderno_09_Laranja_DOSVOX.txt",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "DOSVOX TXT"
        },
        {
          "label": "ENEM 2023 — 1º Dia Prova — Caderno 9 Laranja · Linguagens · NVDA",
          "shortLabel": "Caderno 9 Laranja · Linguagens · NVDA — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_Dia_1_P1_LC_Caderno_09_Laranja_NVDA.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "NVDA"
        },
        {
          "label": "ENEM 2023 — 1º Dia Prova — Caderno 9 Laranja · Linguagens · DOSVOX TXT",
          "shortLabel": "Caderno 9 Laranja · Linguagens · DOSVOX TXT — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_Dia_1_P1_LC_Caderno_09_Laranja_DOSVOX.txt",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "DOSVOX TXT"
        },
        {
          "label": "ENEM 2023 — 1º Dia Prova — Caderno 10 Verde · Libras",
          "shortLabel": "Caderno 10 Verde · Libras — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D1_CD10.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 10 Verde",
          "cor": "Verde",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2023 — 1º Dia Prova — Caderno 10 Verde · Ampliada · Libras",
          "shortLabel": "Caderno 10 Verde · Ampliada · Libras — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D1_CD10_ampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 10 Verde",
          "cor": "Verde",
          "acessibilidade": "Ampliada · Libras"
        },
        {
          "label": "ENEM 2023 — 1º Dia Prova — Caderno 10 Verde · Superampliada · Libras",
          "shortLabel": "Caderno 10 Verde · Superampliada · Libras — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D1_CD10_superampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 10 Verde",
          "cor": "Verde",
          "acessibilidade": "Superampliada · Libras"
        },
        {
          "label": "ENEM 2023 — Tema da Redação (PPL / 2ª Aplicação)",
          "shortLabel": "Tema da Redação (PPL / 2ª Aplicação) (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/tema_redacao_2_aplicacao_2023.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "isRedacaoTema": true
        },
        {
          "label": "ENEM 2023 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_reaplicacao_PPL_D1_CD1.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2023 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_reaplicacao_PPL_D1_CD2.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2023 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_reaplicacao_PPL_D1_CD3.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2023 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_reaplicacao_PPL_D1_CD4.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2023 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 4 Rosa · Ampliada",
          "shortLabel": "Caderno 4 Rosa · Ampliada — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_reaplicacao_PPL_D1_CD4_ampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2023 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 4 Rosa · Superampliada",
          "shortLabel": "Caderno 4 Rosa · Superampliada — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_reaplicacao_PPL_D1_CD4_superampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2023 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_reaplicacao_PPL_D1_CD9_braile_e_ledor.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2023 — 1º Dia Gabarito — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Gabarito (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D1_CD1.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2023 — 1º Dia Gabarito — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Gabarito (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D1_CD2.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2023 — 1º Dia Gabarito — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Gabarito (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D1_CD3.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2023 — 1º Dia Gabarito — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Gabarito (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D1_CD4.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2023 — 1º Dia Gabarito — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Gabarito (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D1_CD9.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2023 — 1º Dia Gabarito — Caderno 10 Verde · Libras",
          "shortLabel": "Caderno 10 Verde · Libras — Gabarito (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D1_CD10.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 10 Verde",
          "cor": "Verde",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2023 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Gabarito (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_reaplicacao_PPL_D1_CD1.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2023 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Gabarito (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_reaplicacao_PPL_D1_CD2.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2023 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Gabarito (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_reaplicacao_PPL_D1_CD3.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2023 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Gabarito (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_reaplicacao_PPL_D1_CD4.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2023 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Gabarito (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_reaplicacao_PPL_D1_CD9_braile_e_ledor.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        }
      ]
    },
    "dia2": {
      "provas": [
        {
          "label": "ENEM 2023 — 2º Dia Prova — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D2_CD5.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2023 — 2º Dia Prova — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D2_CD6.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2023 — 2º Dia Prova — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D2_CD7.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2023 — 2º Dia Prova — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D2_CD8.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2023 — 2º Dia Prova — Caderno 8 Rosa · Ampliada",
          "shortLabel": "Caderno 8 Rosa · Ampliada — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D2_CD8_ampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2023 — 2º Dia Prova — Caderno 8 Rosa · Superampliada",
          "shortLabel": "Caderno 8 Rosa · Superampliada — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D2_CD8_superampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2023 — 2º Dia Prova — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D2_CD11.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2023 — 2º Dia Prova — Caderno 11 Laranja · Natureza · NVDA",
          "shortLabel": "Caderno 11 Laranja · Natureza · NVDA — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_Dia_2_P1_CN_Caderno_11_Laranja_NVDA.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "NVDA"
        },
        {
          "label": "ENEM 2023 — 2º Dia Prova — Caderno 11 Laranja · Natureza · DOSVOX TXT",
          "shortLabel": "Caderno 11 Laranja · Natureza · DOSVOX TXT — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_Dia_2_P1_CN_Caderno_11_Laranja_DOSVOX.txt",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "DOSVOX TXT"
        },
        {
          "label": "ENEM 2023 — 2º Dia Prova — Caderno 11 Laranja · Matemática · NVDA",
          "shortLabel": "Caderno 11 Laranja · Matemática · NVDA — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_Dia_2_P1_MT_Caderno_11_Laranja_NVDA.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "NVDA"
        },
        {
          "label": "ENEM 2023 — 2º Dia Prova — Caderno 11 Laranja · Matemática · DOSVOX TXT",
          "shortLabel": "Caderno 11 Laranja · Matemática · DOSVOX TXT — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_Dia_2_P1_MT_Caderno_11_Laranja_DOSVOX.txt",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "DOSVOX TXT"
        },
        {
          "label": "ENEM 2023 — 2º Dia Prova — Caderno 12 Verde · Libras",
          "shortLabel": "Caderno 12 Verde · Libras — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D2_CD12.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 12 Verde",
          "cor": "Verde",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2023 — 2º Dia Prova — Caderno 12 Verde · Ampliada · Libras",
          "shortLabel": "Caderno 12 Verde · Ampliada · Libras — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D2_CD12_ampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 12 Verde",
          "cor": "Verde",
          "acessibilidade": "Ampliada · Libras"
        },
        {
          "label": "ENEM 2023 — 2º Dia Prova — Caderno 12 Verde · Superampliada · Libras",
          "shortLabel": "Caderno 12 Verde · Superampliada · Libras — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D2_CD12_Superampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 12 Verde",
          "cor": "Verde",
          "acessibilidade": "Superampliada · Libras"
        },
        {
          "label": "ENEM 2023 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_reaplicacao_PPL_D2_CD5.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2023 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_reaplicacao_PPL_D2_CD6.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2023 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_reaplicacao_PPL_D2_CD7.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2023 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_reaplicacao_PPL_D2_CD8.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2023 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 8 Rosa · Ampliada",
          "shortLabel": "Caderno 8 Rosa · Ampliada — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_reaplicacao_PPL_D2_CD8_ampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2023 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 8 Rosa · Superampliada",
          "shortLabel": "Caderno 8 Rosa · Superampliada — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_reaplicacao_PPL_D2_CD8_superampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2023 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Prova (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_reaplicacao_PPL_D2_CD11_braile_e_ledor.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2023 — 2º Dia Gabarito — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Gabarito (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D2_CD5.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2023 — 2º Dia Gabarito — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Gabarito (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D2_CD6.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2023 — 2º Dia Gabarito — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Gabarito (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D2_CD7.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2023 — 2º Dia Gabarito — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Gabarito (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D2_CD8.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2023 — 2º Dia Gabarito — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Gabarito (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D2_CD11.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2023 — 2º Dia Gabarito — Caderno 12 Verde · Libras",
          "shortLabel": "Caderno 12 Verde · Libras — Gabarito (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D2_CD12.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 12 Verde",
          "cor": "Verde",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2023 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Gabarito (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_reaplicacao_PPL_D2_CD5.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2023 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Gabarito (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_reaplicacao_PPL_D2_CD6.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2023 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Gabarito (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_reaplicacao_PPL_D2_CD7.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2023 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Gabarito (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_reaplicacao_PPL_D2_CD8.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2023 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Gabarito (2023)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_reaplicacao_PPL_D2_CD11_braile_e_ledor.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        }
      ]
    },
    "observacao": "Aplicação Regular · Reaplicação / PPL (66 arquivos oficiais INEP)"
  },
  {
    "ano": 2022,
    "rotulo": "ENEM 2022",
    "paginaOficial": "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos",
    "dia1": {
      "provas": [
        {
          "label": "ENEM 2022 — 1º Dia Prova — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D1_CD1.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2022 — 1º Dia Prova — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D1_CD2.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2022 — 1º Dia Prova — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D1_CD3.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2022 — 1º Dia Prova — Caderno 3 Branco · Ampliada",
          "shortLabel": "Caderno 3 Branco · Ampliada — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D1_CD3_ampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2022 — 1º Dia Prova — Caderno 3 Branco · Superampliada",
          "shortLabel": "Caderno 3 Branco · Superampliada — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D1_CD3_superampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2022 — 1º Dia Prova — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D1_CD4.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2022 — 1º Dia Prova — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D1_CD9.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2022 — 1º Dia Prova — Caderno 10 Verde · Libras",
          "shortLabel": "Caderno 10 Verde · Libras — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D1_CD10.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 10 Verde",
          "cor": "Verde",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2022 — 1º Dia Prova — Caderno 10 Verde · Ampliada · Libras",
          "shortLabel": "Caderno 10 Verde · Ampliada · Libras — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D1_CD10_ampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 10 Verde",
          "cor": "Verde",
          "acessibilidade": "Ampliada · Libras"
        },
        {
          "label": "ENEM 2022 — 1º Dia Prova — Caderno 10 Verde · Superampliada · Libras",
          "shortLabel": "Caderno 10 Verde · Superampliada · Libras — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D1_CD10_superampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 10 Verde",
          "cor": "Verde",
          "acessibilidade": "Superampliada · Libras"
        },
        {
          "label": "ENEM 2022 — 1º Dia Prova (Digital) — Caderno 1 Azul · Inglês",
          "shortLabel": "Caderno 1 Azul · Inglês — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_digital_D1_CD1_ingles.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul",
          "idioma": "Inglês"
        },
        {
          "label": "ENEM 2022 — 1º Dia Prova (Digital) — Caderno 1 Azul · Espanhol",
          "shortLabel": "Caderno 1 Azul · Espanhol — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_digital_D1_CD1_espanhol.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul",
          "idioma": "Espanhol"
        },
        {
          "label": "ENEM 2022 — 1º Dia Prova (Digital) — Caderno 2 Amarelo · Inglês",
          "shortLabel": "Caderno 2 Amarelo · Inglês — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_digital_D1_CD2_ingles.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo",
          "idioma": "Inglês"
        },
        {
          "label": "ENEM 2022 — 1º Dia Prova (Digital) — Caderno 2 Amarelo · Espanhol",
          "shortLabel": "Caderno 2 Amarelo · Espanhol — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_digital_D1_CD2_espanhol.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo",
          "idioma": "Espanhol"
        },
        {
          "label": "ENEM 2022 — 1º Dia Prova (Digital) — Caderno 3 Branco · Inglês",
          "shortLabel": "Caderno 3 Branco · Inglês — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_digital_D1_CD3_ingles.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco",
          "idioma": "Inglês"
        },
        {
          "label": "ENEM 2022 — 1º Dia Prova (Digital) — Caderno 3 Branco · Espanhol",
          "shortLabel": "Caderno 3 Branco · Espanhol — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_digital_D1_CD3_espanhol.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco",
          "idioma": "Espanhol"
        },
        {
          "label": "ENEM 2022 — 1º Dia Prova (Digital) — Caderno 4 Rosa · Inglês",
          "shortLabel": "Caderno 4 Rosa · Inglês — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_digital_D1_CD4_ingles.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa",
          "idioma": "Inglês"
        },
        {
          "label": "ENEM 2022 — 1º Dia Prova (Digital) — Caderno 4 Rosa · Espanhol",
          "shortLabel": "Caderno 4 Rosa · Espanhol — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_digital_D1_CD4_espanhol.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa",
          "idioma": "Espanhol"
        },
        {
          "label": "ENEM 2022 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_reaplicacao_PPL_D1_CD1.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2022 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_reaplicacao_PPL_D1_CD2.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2022 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_reaplicacao_PPL_D1_CD3.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2022 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_reaplicacao_PPL_D1_CD4.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2022 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 3 Branco · Ampliada",
          "shortLabel": "Caderno 3 Branco · Ampliada — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_reaplicacao_PPL_D1_CD3_ampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2022 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 3 Branco · Superampliada",
          "shortLabel": "Caderno 3 Branco · Superampliada — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_reaplicacao_PPL_D1_CD3_superampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2022 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_reaplicacao_PPL_D1_CD9_braile_e_ledor.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2022 — 1º Dia Gabarito — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D1_CD1.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2022 — 1º Dia Gabarito — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D1_CD2.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2022 — 1º Dia Gabarito — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D1_CD3.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2022 — 1º Dia Gabarito — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D1_CD4.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2022 — 1º Dia Gabarito — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D1_CD9.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2022 — 1º Dia Gabarito — Caderno 10 Verde · Libras",
          "shortLabel": "Caderno 10 Verde · Libras — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D1_CD10.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 10 Verde",
          "cor": "Verde",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2022 — 1º Dia Gabarito (Digital) — Caderno 1 Azul · Inglês",
          "shortLabel": "Caderno 1 Azul · Inglês — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_digital_D1_CD1_ingles.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul",
          "idioma": "Inglês"
        },
        {
          "label": "ENEM 2022 — 1º Dia Gabarito (Digital) — Caderno 1 Azul · Espanhol",
          "shortLabel": "Caderno 1 Azul · Espanhol — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_digital_D1_CD1_espanhol.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul",
          "idioma": "Espanhol"
        },
        {
          "label": "ENEM 2022 — 1º Dia Gabarito (Digital) — Caderno 2 Amarelo · Inglês",
          "shortLabel": "Caderno 2 Amarelo · Inglês — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_digital_D1_CD2_ingles.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo",
          "idioma": "Inglês"
        },
        {
          "label": "ENEM 2022 — 1º Dia Gabarito (Digital) — Caderno 2 Amarelo · Espanhol",
          "shortLabel": "Caderno 2 Amarelo · Espanhol — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_digital_D1_CD2_espanhol.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo",
          "idioma": "Espanhol"
        },
        {
          "label": "ENEM 2022 — 1º Dia Gabarito (Digital) — Caderno 3 Branco · Inglês",
          "shortLabel": "Caderno 3 Branco · Inglês — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_digital_D1_CD3_ingles.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco",
          "idioma": "Inglês"
        },
        {
          "label": "ENEM 2022 — 1º Dia Gabarito (Digital) — Caderno 3 Branco · Espanhol",
          "shortLabel": "Caderno 3 Branco · Espanhol — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_digital_D1_CD3_espanhol.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco",
          "idioma": "Espanhol"
        },
        {
          "label": "ENEM 2022 — 1º Dia Gabarito (Digital) — Caderno 4 Rosa · Inglês",
          "shortLabel": "Caderno 4 Rosa · Inglês — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_digital_D1_CD4_ingles.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa",
          "idioma": "Inglês"
        },
        {
          "label": "ENEM 2022 — 1º Dia Gabarito (Digital) — Caderno 4 Rosa · Espanhol",
          "shortLabel": "Caderno 4 Rosa · Espanhol — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_digital_D1_CD4_espanhol.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa",
          "idioma": "Espanhol"
        },
        {
          "label": "ENEM 2022 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_reaplicacao_PPL_D1_CD1.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2022 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_reaplicacao_PPL_D1_CD2.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2022 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_reaplicacao_PPL_D1_CD3.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2022 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_reaplicacao_PPL_D1_CD4.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2022 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_reaplicacao_PPL_D1_CD9_braile_e_ledor.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        }
      ]
    },
    "dia2": {
      "provas": [
        {
          "label": "ENEM 2022 — 2º Dia Prova — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D2_CD5.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2022 — 2º Dia Prova — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D2_CD6.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2022 — 2º Dia Prova — Caderno 6 Cinza · Ampliada",
          "shortLabel": "Caderno 6 Cinza · Ampliada — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D2_CD6_ampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2022 — 2º Dia Prova — Caderno 6 Cinza · Superampliada",
          "shortLabel": "Caderno 6 Cinza · Superampliada — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D2_CD6_superampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2022 — 2º Dia Prova — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D2_CD7.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2022 — 2º Dia Prova — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D2_CD8.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2022 — 2º Dia Prova — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D2_CD11.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2022 — 2º Dia Prova — Caderno 12 Verde · Libras",
          "shortLabel": "Caderno 12 Verde · Libras — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D2_CD12.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 12 Verde",
          "cor": "Verde",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2022 — 2º Dia Prova — Caderno 12 Verde · Ampliada · Libras",
          "shortLabel": "Caderno 12 Verde · Ampliada · Libras — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D2_CD12_ampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 12 Verde",
          "cor": "Verde",
          "acessibilidade": "Ampliada · Libras"
        },
        {
          "label": "ENEM 2022 — 2º Dia Prova — Caderno 12 Verde · Superampliada · Libras",
          "shortLabel": "Caderno 12 Verde · Superampliada · Libras — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D2_CD12_superampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 12 Verde",
          "cor": "Verde",
          "acessibilidade": "Superampliada · Libras"
        },
        {
          "label": "ENEM 2022 — 2º Dia Prova (Digital) — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_digital_D2_CD5.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Digital",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2022 — 2º Dia Prova (Digital) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_digital_D2_CD6.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Digital",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2022 — 2º Dia Prova (Digital) — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_digital_D2_CD7.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Digital",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2022 — 2º Dia Prova (Digital) — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_digital_D2_CD8.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Digital",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2022 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_reaplicacao_PPL_D2_CD5.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2022 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_reaplicacao_PPL_D2_CD6.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2022 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_reaplicacao_PPL_D2_CD7.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2022 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_reaplicacao_PPL_D2_CD8.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2022 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 6 Cinza · Ampliada",
          "shortLabel": "Caderno 6 Cinza · Ampliada — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_reaplicacao_PPL_D2_CD6_ampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2022 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 6 Cinza · Superampliada",
          "shortLabel": "Caderno 6 Cinza · Superampliada — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_reaplicacao_PPL_D2_CD6_superampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2022 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Prova (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_reaplicacao_PPL_D2_CD11_braile_e_ledor.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2022 — 2º Dia Gabarito — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D2_CD5.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2022 — 2º Dia Gabarito — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D2_CD6.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2022 — 2º Dia Gabarito — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D2_CD7.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2022 — 2º Dia Gabarito — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D2_CD8.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2022 — 2º Dia Gabarito — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D2_CD11.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2022 — 2º Dia Gabarito — Caderno 12 Verde · Libras",
          "shortLabel": "Caderno 12 Verde · Libras — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D2_CD12.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 12 Verde",
          "cor": "Verde",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2022 — 2º Dia Gabarito (Digital) — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_digital_D2_CD5.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Digital",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2022 — 2º Dia Gabarito (Digital) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_digital_D2_CD6.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Digital",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2022 — 2º Dia Gabarito (Digital) — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_digital_D2_CD7.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Digital",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2022 — 2º Dia Gabarito (Digital) — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_digital_D2_CD8.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Digital",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2022 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_reaplicacao_PPL_D2_CD5.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2022 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_reaplicacao_PPL_D2_CD6.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2022 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_reaplicacao_PPL_D2_CD7.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2022 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_reaplicacao_PPL_D2_CD8.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2022 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Gabarito (2022)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_reaplicacao_PPL_D2_CD11_braile_e_ledor.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        }
      ]
    },
    "observacao": "Aplicação Regular · Reaplicação / PPL · ENEM Digital (80 arquivos oficiais INEP)"
  },
  {
    "ano": 2021,
    "rotulo": "ENEM 2021",
    "paginaOficial": "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos",
    "dia1": {
      "provas": [
        {
          "label": "ENEM 2021 — 1º Dia Prova — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D1_CD1.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2021 — 1º Dia Prova — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D1_CD2.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2021 — 1º Dia Prova — Caderno 2 Amarelo · Ampliada",
          "shortLabel": "Caderno 2 Amarelo · Ampliada — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D1_CD2_ampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2021 — 1º Dia Prova — Caderno 2 Amarelo · Superampliada",
          "shortLabel": "Caderno 2 Amarelo · Superampliada — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D1_CD2_superampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2021 — 1º Dia Prova — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D1_CD3.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2021 — 1º Dia Prova — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D1_CD4.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2021 — 1º Dia Prova — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D1_CD9.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2021 — 1º Dia Prova — Caderno 10 Verde · Libras",
          "shortLabel": "Caderno 10 Verde · Libras — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D1_CD10.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 10 Verde",
          "cor": "Verde",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2021 — 1º Dia Prova — Caderno 10 Verde · Ampliada · Libras",
          "shortLabel": "Caderno 10 Verde · Ampliada · Libras — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D1_CD10_ampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 10 Verde",
          "cor": "Verde",
          "acessibilidade": "Ampliada · Libras"
        },
        {
          "label": "ENEM 2021 — 1º Dia Prova — Caderno 10 Verde · Superampliada · Libras",
          "shortLabel": "Caderno 10 Verde · Superampliada · Libras — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D1_CD10_superampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 10 Verde",
          "cor": "Verde",
          "acessibilidade": "Superampliada · Libras"
        },
        {
          "label": "ENEM 2021 — 1º Dia Prova (Digital) — Caderno 1 Azul · Inglês",
          "shortLabel": "Caderno 1 Azul · Inglês — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_digital_D1_CD1_ingles.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul",
          "idioma": "Inglês"
        },
        {
          "label": "ENEM 2021 — 1º Dia Prova (Digital) — Caderno 1 Azul · Espanhol",
          "shortLabel": "Caderno 1 Azul · Espanhol — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_digital_D1_CD1_espanhol.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul",
          "idioma": "Espanhol"
        },
        {
          "label": "ENEM 2021 — 1º Dia Prova (Digital) — Caderno 2 Amarelo · Inglês",
          "shortLabel": "Caderno 2 Amarelo · Inglês — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_digital_D1_CD2_ingles.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo",
          "idioma": "Inglês"
        },
        {
          "label": "ENEM 2021 — 1º Dia Prova (Digital) — Caderno 2 Amarelo · Espanhol",
          "shortLabel": "Caderno 2 Amarelo · Espanhol — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_digital_D1_CD2_espanhol.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo",
          "idioma": "Espanhol"
        },
        {
          "label": "ENEM 2021 — 1º Dia Prova (Digital) — Caderno 3 Branco · Inglês",
          "shortLabel": "Caderno 3 Branco · Inglês — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_digital_D1_CD3_ingles.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco",
          "idioma": "Inglês"
        },
        {
          "label": "ENEM 2021 — 1º Dia Prova (Digital) — Caderno 3 Branco · Espanhol",
          "shortLabel": "Caderno 3 Branco · Espanhol — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_digital_D1_CD3_espanhol.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco",
          "idioma": "Espanhol"
        },
        {
          "label": "ENEM 2021 — 1º Dia Prova (Digital) — Caderno 4 Rosa · Inglês",
          "shortLabel": "Caderno 4 Rosa · Inglês — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_digital_D1_CD4_ingles.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa",
          "idioma": "Inglês"
        },
        {
          "label": "ENEM 2021 — 1º Dia Prova (Digital) — Caderno 4 Rosa · Espanhol",
          "shortLabel": "Caderno 4 Rosa · Espanhol — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_digital_D1_CD4_espanhol.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa",
          "idioma": "Espanhol"
        },
        {
          "label": "ENEM 2021 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_reaplicacao_PPL_D1_CD1.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2021 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_reaplicacao_PPL_D1_CD2.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2021 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_reaplicacao_PPL_D1_CD3.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2021 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_reaplicacao_PPL_D1_CD4.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2021 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 2 Amarelo · Ampliada",
          "shortLabel": "Caderno 2 Amarelo · Ampliada — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_reaplicacao_PPL_D1_CD2_ampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2021 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 2 Amarelo · Superampliada",
          "shortLabel": "Caderno 2 Amarelo · Superampliada — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_reaplicacao_PPL_D1_CD2_superampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2021 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_reaplicacao_PPL_D1_CD9_braile_e_ledor.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2021 — 1º Dia Gabarito — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D1_CD1.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2021 — 1º Dia Gabarito — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D1_CD2.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2021 — 1º Dia Gabarito — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D1_CD3.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2021 — 1º Dia Gabarito — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D1_CD4.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2021 — 1º Dia Gabarito — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D1_CD9.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2021 — 1º Dia Gabarito — Caderno 10 Verde · Libras",
          "shortLabel": "Caderno 10 Verde · Libras — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D1_CD10.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 10 Verde",
          "cor": "Verde",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2021 — 1º Dia Gabarito (Digital) — Caderno 1 Azul · Inglês",
          "shortLabel": "Caderno 1 Azul · Inglês — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_digital_D1_CD1_ingles.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul",
          "idioma": "Inglês"
        },
        {
          "label": "ENEM 2021 — 1º Dia Gabarito (Digital) — Caderno 1 Azul · Espanhol",
          "shortLabel": "Caderno 1 Azul · Espanhol — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_digital_D1_CD1_espanhol.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul",
          "idioma": "Espanhol"
        },
        {
          "label": "ENEM 2021 — 1º Dia Gabarito (Digital) — Caderno 2 Amarelo · Inglês",
          "shortLabel": "Caderno 2 Amarelo · Inglês — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_digital_D1_CD2_ingles.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo",
          "idioma": "Inglês"
        },
        {
          "label": "ENEM 2021 — 1º Dia Gabarito (Digital) — Caderno 2 Amarelo · Espanhol",
          "shortLabel": "Caderno 2 Amarelo · Espanhol — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_digital_D1_CD2_espanhol.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo",
          "idioma": "Espanhol"
        },
        {
          "label": "ENEM 2021 — 1º Dia Gabarito (Digital) — Caderno 3 Branco · Inglês",
          "shortLabel": "Caderno 3 Branco · Inglês — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_digital_D1_CD3_ingles.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco",
          "idioma": "Inglês"
        },
        {
          "label": "ENEM 2021 — 1º Dia Gabarito (Digital) — Caderno 3 Branco · Espanhol",
          "shortLabel": "Caderno 3 Branco · Espanhol — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_digital_D1_CD3_espanhol.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco",
          "idioma": "Espanhol"
        },
        {
          "label": "ENEM 2021 — 1º Dia Gabarito (Digital) — Caderno 4 Rosa · Inglês",
          "shortLabel": "Caderno 4 Rosa · Inglês — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_digital_D1_CD4_ingles.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa",
          "idioma": "Inglês"
        },
        {
          "label": "ENEM 2021 — 1º Dia Gabarito (Digital) — Caderno 4 Rosa · Espanhol",
          "shortLabel": "Caderno 4 Rosa · Espanhol — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_digital_D1_CD4_espanhol.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa",
          "idioma": "Espanhol"
        },
        {
          "label": "ENEM 2021 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_reaplicacao_PPL_D1_CD1.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2021 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_reaplicacao_PPL_D1_CD2.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2021 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_reaplicacao_PPL_D1_CD3.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2021 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_reaplicacao_PPL_D1_CD4.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2021 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_reaplicacao_PPL_D1_CD9_braile_e_ledor.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        }
      ]
    },
    "dia2": {
      "provas": [
        {
          "label": "ENEM 2021 — 2º Dia Prova — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD5.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2021 — 2º Dia Prova — Caderno 5 Amarelo · Ampliada",
          "shortLabel": "Caderno 5 Amarelo · Ampliada — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD5_ampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2021 — 2º Dia Prova — Caderno 5 Amarelo · Superampliada",
          "shortLabel": "Caderno 5 Amarelo · Superampliada — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD5_superampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2021 — 2º Dia Prova — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD6.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2021 — 2º Dia Prova — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD7.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2021 — 2º Dia Prova — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD8.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2021 — 2º Dia Prova — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD11.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2021 — 2º Dia Prova — Caderno 12 Verde · Libras",
          "shortLabel": "Caderno 12 Verde · Libras — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD12.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 12 Verde",
          "cor": "Verde",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2021 — 2º Dia Prova — Caderno 12 Verde · Ampliada · Libras",
          "shortLabel": "Caderno 12 Verde · Ampliada · Libras — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD12_ampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 12 Verde",
          "cor": "Verde",
          "acessibilidade": "Ampliada · Libras"
        },
        {
          "label": "ENEM 2021 — 2º Dia Prova — Caderno 12 Verde · Superampliada · Libras",
          "shortLabel": "Caderno 12 Verde · Superampliada · Libras — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD12_superampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 12 Verde",
          "cor": "Verde",
          "acessibilidade": "Superampliada · Libras"
        },
        {
          "label": "ENEM 2021 — 2º Dia Prova (Digital) — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_digital_D2_CD5.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Digital",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2021 — 2º Dia Prova (Digital) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_digital_D2_CD6.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Digital",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2021 — 2º Dia Prova (Digital) — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_digital_D2_CD7.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Digital",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2021 — 2º Dia Prova (Digital) — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_digital_D2_CD8.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Digital",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2021 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_reaplicacao_PPL_D2_CD5.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2021 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_reaplicacao_PPL_D2_CD6.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2021 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_reaplicacao_PPL_D2_CD7.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2021 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_reaplicacao_PPL_D2_CD8.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2021 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 5 Amarelo · Ampliada",
          "shortLabel": "Caderno 5 Amarelo · Ampliada — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_reaplicacao_PPL_D2_CD5_ampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2021 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 5 Amarelo · Superampliada",
          "shortLabel": "Caderno 5 Amarelo · Superampliada — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_reaplicacao_PPL_D2_CD5_superampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2021 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Prova (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_reaplicacao_PPL_D2_CD11_braile_e_ledor.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2021 — 2º Dia Gabarito — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D2_CD5.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2021 — 2º Dia Gabarito — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D2_CD6.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2021 — 2º Dia Gabarito — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D2_CD7.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2021 — 2º Dia Gabarito — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D2_CD8.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2021 — 2º Dia Gabarito — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D2_CD11.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2021 — 2º Dia Gabarito — Caderno 12 Verde · Libras",
          "shortLabel": "Caderno 12 Verde · Libras — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D2_CD12.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 12 Verde",
          "cor": "Verde",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2021 — 2º Dia Gabarito (Digital) — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_digital_D2_CD5.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Digital",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2021 — 2º Dia Gabarito (Digital) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_digital_D2_CD6.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Digital",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2021 — 2º Dia Gabarito (Digital) — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_digital_D2_CD7.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Digital",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2021 — 2º Dia Gabarito (Digital) — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_digital_D2_CD8.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Digital",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2021 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_reaplicacao_PPL_D2_CD5.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2021 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_reaplicacao_PPL_D2_CD6.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2021 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_reaplicacao_PPL_D2_CD7.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2021 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_reaplicacao_PPL_D2_CD8.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2021 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Gabarito (2021)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_reaplicacao_PPL_D2_CD11_braile_e_ledor.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        }
      ]
    },
    "observacao": "Aplicação Regular · Reaplicação / PPL · ENEM Digital (80 arquivos oficiais INEP)"
  },
  {
    "ano": 2020,
    "rotulo": "ENEM 2020",
    "paginaOficial": "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos",
    "dia1": {
      "provas": [
        {
          "label": "ENEM 2020 — 1º Dia Prova — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D1_CD1.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2020 — 1º Dia Prova — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D1_CD2.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2020 — 1º Dia Prova — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D1_CD3.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2020 — 1º Dia Prova — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D1_CD4.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2020 — 1º Dia Prova — Caderno 4 Rosa · Ampliada",
          "shortLabel": "Caderno 4 Rosa · Ampliada — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D1_CD4_ampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2020 — 1º Dia Prova — Caderno 4 Rosa · Superampliada",
          "shortLabel": "Caderno 4 Rosa · Superampliada — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D1_CD4_superampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2020 — 1º Dia Prova — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D1_CD9.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2020 — 1º Dia Prova — Caderno 10 Verde · Libras",
          "shortLabel": "Caderno 10 Verde · Libras — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D1_CD10.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 10 Verde",
          "cor": "Verde",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2020 — 1º Dia Prova (Digital) — Caderno 1 Azul · Inglês",
          "shortLabel": "Caderno 1 Azul · Inglês — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_digital_D1_CD1_ingles.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul",
          "idioma": "Inglês"
        },
        {
          "label": "ENEM 2020 — 1º Dia Prova (Digital) — Caderno 1 Azul · Espanhol",
          "shortLabel": "Caderno 1 Azul · Espanhol — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_digital_D1_CD1_espanhol.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul",
          "idioma": "Espanhol"
        },
        {
          "label": "ENEM 2020 — 1º Dia Prova (Digital) — Caderno 2 Amarelo · Inglês",
          "shortLabel": "Caderno 2 Amarelo · Inglês — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_digital_D1_CD2_ingles.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo",
          "idioma": "Inglês"
        },
        {
          "label": "ENEM 2020 — 1º Dia Prova (Digital) — Caderno 2 Amarelo · Espanhol",
          "shortLabel": "Caderno 2 Amarelo · Espanhol — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_digital_D1_CD2_espanhol.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo",
          "idioma": "Espanhol"
        },
        {
          "label": "ENEM 2020 — 1º Dia Prova (Digital) — Caderno 3 Branco · Inglês",
          "shortLabel": "Caderno 3 Branco · Inglês — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_digital_D1_CD3_ingles.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco",
          "idioma": "Inglês"
        },
        {
          "label": "ENEM 2020 — 1º Dia Prova (Digital) — Caderno 3 Branco · Espanhol",
          "shortLabel": "Caderno 3 Branco · Espanhol — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_digital_D1_CD3_espanhol.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco",
          "idioma": "Espanhol"
        },
        {
          "label": "ENEM 2020 — 1º Dia Prova (Digital) — Caderno 4 Rosa · Inglês",
          "shortLabel": "Caderno 4 Rosa · Inglês — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_digital_D1_CD4_ingles.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa",
          "idioma": "Inglês"
        },
        {
          "label": "ENEM 2020 — 1º Dia Prova (Digital) — Caderno 4 Rosa · Espanhol",
          "shortLabel": "Caderno 4 Rosa · Espanhol — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_digital_D1_CD4_espanhol.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa",
          "idioma": "Espanhol"
        },
        {
          "label": "ENEM 2020 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_reaplicacao_PPL_D1_CD1.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2020 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_reaplicacao_PPL_D1_CD2.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2020 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_reaplicacao_PPL_D1_CD3.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2020 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_reaplicacao_PPL_D1_CD4.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2020 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 4 Rosa · Ampliada",
          "shortLabel": "Caderno 4 Rosa · Ampliada — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_reaplicacao_PPL_D1_CD4_ampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2020 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 4 Rosa · Superampliada",
          "shortLabel": "Caderno 4 Rosa · Superampliada — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_reaplicacao_PPL_D1_CD4_superampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2020 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_reaplicacao_PPL_D1_CD9.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2020 — 1º Dia Gabarito — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D1_CD1.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2020 — 1º Dia Gabarito — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D1_CD2.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2020 — 1º Dia Gabarito — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D1_CD3.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2020 — 1º Dia Gabarito — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D1_CD4.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2020 — 1º Dia Gabarito — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D1_CD9.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2020 — 1º Dia Gabarito — Caderno 10 Verde · Libras",
          "shortLabel": "Caderno 10 Verde · Libras — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D1_CD10.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 10 Verde",
          "cor": "Verde",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2020 — 1º Dia Gabarito (Digital) — Caderno 1 Azul · Inglês",
          "shortLabel": "Caderno 1 Azul · Inglês — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_digital_D1_CD1_ingles.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul",
          "idioma": "Inglês"
        },
        {
          "label": "ENEM 2020 — 1º Dia Gabarito (Digital) — Caderno 1 Azul · Espanhol",
          "shortLabel": "Caderno 1 Azul · Espanhol — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_digital_D1_CD1_espanhol.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul",
          "idioma": "Espanhol"
        },
        {
          "label": "ENEM 2020 — 1º Dia Gabarito (Digital) — Caderno 2 Amarelo · Inglês",
          "shortLabel": "Caderno 2 Amarelo · Inglês — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_digital_D1_CD2_ingles.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo",
          "idioma": "Inglês"
        },
        {
          "label": "ENEM 2020 — 1º Dia Gabarito (Digital) — Caderno 2 Amarelo · Espanhol",
          "shortLabel": "Caderno 2 Amarelo · Espanhol — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_digital_D1_CD2_espanhol.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo",
          "idioma": "Espanhol"
        },
        {
          "label": "ENEM 2020 — 1º Dia Gabarito (Digital) — Caderno 3 Branco · Inglês",
          "shortLabel": "Caderno 3 Branco · Inglês — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_digital_D1_CD3_ingles.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco",
          "idioma": "Inglês"
        },
        {
          "label": "ENEM 2020 — 1º Dia Gabarito (Digital) — Caderno 3 Branco · Espanhol",
          "shortLabel": "Caderno 3 Branco · Espanhol — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_digital_D1_CD3_espanhol.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco",
          "idioma": "Espanhol"
        },
        {
          "label": "ENEM 2020 — 1º Dia Gabarito (Digital) — Caderno 4 Rosa · Inglês",
          "shortLabel": "Caderno 4 Rosa · Inglês — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_digital_D1_CD4_ingles.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa",
          "idioma": "Inglês"
        },
        {
          "label": "ENEM 2020 — 1º Dia Gabarito (Digital) — Caderno 4 Rosa · Espanhol",
          "shortLabel": "Caderno 4 Rosa · Espanhol — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_digital_D1_CD4_espanhol.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Digital",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa",
          "idioma": "Espanhol"
        },
        {
          "label": "ENEM 2020 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_reaplicacao_PPL_D1_CD1.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2020 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_reaplicacao_PPL_D1_CD2.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2020 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_reaplicacao_PPL_D1_CD3.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2020 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_reaplicacao_PPL_D1_CD4.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2020 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_reaplicacao_PPL_D1_CD9.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        }
      ]
    },
    "dia2": {
      "provas": [
        {
          "label": "ENEM 2020 — 2º Dia Prova — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D2_CD5.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2020 — 2º Dia Prova — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D2_CD6.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2020 — 2º Dia Prova — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D2_CD7.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2020 — 2º Dia Prova — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D2_CD8.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2020 — 2º Dia Prova — Caderno 8 Rosa · Ampliada",
          "shortLabel": "Caderno 8 Rosa · Ampliada — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D2_CD8_ampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2020 — 2º Dia Prova — Caderno 8 Rosa · Superampliada",
          "shortLabel": "Caderno 8 Rosa · Superampliada — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D2_CD8_superampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2020 — 2º Dia Prova — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D2_CD11.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2020 — 2º Dia Prova — Caderno 12 Verde · Libras",
          "shortLabel": "Caderno 12 Verde · Libras — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D2_CD12.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 12 Verde",
          "cor": "Verde",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2020 — 2º Dia Prova (Digital) — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_digital_D2_CD5.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Digital",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2020 — 2º Dia Prova (Digital) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_digital_D2_CD6.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Digital",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2020 — 2º Dia Prova (Digital) — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_digital_D2_CD7.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Digital",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2020 — 2º Dia Prova (Digital) — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_digital_D2_CD8.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Digital",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2020 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_reaplicacao_PPL_D2_CD5.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2020 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_reaplicacao_PPL_D2_CD6.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2020 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_reaplicacao_PPL_D2_CD7.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2020 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_reaplicacao_PPL_D2_CD8.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2020 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 8 Rosa · Ampliada",
          "shortLabel": "Caderno 8 Rosa · Ampliada — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_reaplicacao_PPL_D2_CD8_ampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2020 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 8 Rosa · Superampliada",
          "shortLabel": "Caderno 8 Rosa · Superampliada — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_reaplicacao_PPL_D2_CD8_superampliada.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2020 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Prova (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_reaplicacao_PPL_D2_CD11.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2020 — 2º Dia Gabarito — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D2_CD5.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2020 — 2º Dia Gabarito — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D2_CD6.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2020 — 2º Dia Gabarito — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D2_CD7.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2020 — 2º Dia Gabarito — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D2_CD8.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2020 — 2º Dia Gabarito — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D2_CD11.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2020 — 2º Dia Gabarito — Caderno 12 Verde · Libras",
          "shortLabel": "Caderno 12 Verde · Libras — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D2_CD12.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 12 Verde",
          "cor": "Verde",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2020 — 2º Dia Gabarito (Digital) — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_digital_D2_CD5.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Digital",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2020 — 2º Dia Gabarito (Digital) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_digital_D2_CD6.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Digital",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2020 — 2º Dia Gabarito (Digital) — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_digital_D2_CD7.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Digital",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2020 — 2º Dia Gabarito (Digital) — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_digital_D2_CD8.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Digital",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2020 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_reaplicacao_PPL_D2_CD5.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2020 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_reaplicacao_PPL_D2_CD6.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2020 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_reaplicacao_PPL_D2_CD7.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2020 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_reaplicacao_PPL_D2_CD8.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2020 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Gabarito (2020)",
          "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_reaplicacao_PPL_D2_CD11.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        }
      ]
    },
    "observacao": "Aplicação Regular · Reaplicação / PPL · ENEM Digital (76 arquivos oficiais INEP)"
  },
  {
    "ano": 2019,
    "rotulo": "ENEM 2019",
    "paginaOficial": "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos",
    "dia1": {
      "provas": [
        {
          "label": "ENEM 2019 — 1º Dia Prova — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Prova (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2019/2019_PV_impresso_D1_CD1.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2019 — 1º Dia Prova — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Prova (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2019/2019_PV_impresso_D1_CD2.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2019 — 1º Dia Prova — Caderno 2 Amarelo · Ampliada",
          "shortLabel": "Caderno 2 Amarelo · Ampliada — Prova (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2019/caderno_de_questoes_1_dia_caderno_2_amarelo_ampliada_aplicacao_regular.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2019 — 1º Dia Prova — Caderno 2 Amarelo · Superampliada",
          "shortLabel": "Caderno 2 Amarelo · Superampliada — Prova (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2019/caderno_de_questoes_1_dia_caderno_2_amarelo_superampliada_aplicacao_regular.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2019 — 1º Dia Prova — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2019/2019_PV_impresso_D1_CD3.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2019 — 1º Dia Prova — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Prova (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2019/2019_PV_impresso_D1_CD4.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2019 — 1º Dia Prova — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Prova (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2019/2019_PV_impresso_D1_CD9.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2019 — 1º Dia Prova — Caderno 10 Verde · Libras",
          "shortLabel": "Caderno 10 Verde · Libras — Prova (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2019/2019_PV_impresso_D1_CD10.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 10 Verde",
          "cor": "Verde",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2019 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Prova (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2019/2019_PV_reaplicacao_PPL_D1_CD1.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2019 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 1 Azul · Ampliada",
          "shortLabel": "Caderno 1 Azul · Ampliada — Prova (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2019/provas/BAIXA_PPL_1_DIA_CADERNO_1_AZUL_AMPLIA.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2019 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 1 Azul · Superampliada",
          "shortLabel": "Caderno 1 Azul · Superampliada — Prova (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2019/provas/BAIXA_PPL_1_DIA_CADERNO_1_AZUL_SUP.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2019 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Prova (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2019/provas/BAIXA_PPL_1_DIA_CADERNO_2_AMARELO.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2019 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2019/2019_PV_reaplicacao_PPL_D1_CD3.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2019 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Prova (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2019/2019_PV_reaplicacao_PPL_D1_CD4.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2019 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Prova (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2019/2019_PV_reaplicacao_PPL_D1_CD9.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2019 — 1º Dia Gabarito — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Gabarito (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2019/gabarito_1_dia_caderno_1_azul_aplicacao_regular.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2019 — 1º Dia Gabarito — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Gabarito (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2019/gabarito_1_dia_caderno_2_amarelo_aplicacao_regular.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2019 — 1º Dia Gabarito — Caderno 2 Amarelo · Ampliada",
          "shortLabel": "Caderno 2 Amarelo · Ampliada — Gabarito (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2019/gabarito_1_dia_caderno_2_amarelo_ampliada_aplicacao_regular.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2019 — 1º Dia Gabarito — Caderno 2 Amarelo · Superampliada",
          "shortLabel": "Caderno 2 Amarelo · Superampliada — Gabarito (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2019/gabarito_1_dia_caderno_2_amarelo_superampliada_aplicacao_regular.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2019 — 1º Dia Gabarito — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Gabarito (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2019/gabarito_1_dia_caderno_3_branco_aplicacao_regular.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2019 — 1º Dia Gabarito — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Gabarito (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2019/gabarito_1_dia_caderno_4_rosa_aplicacao_regular.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2019 — 1º Dia Gabarito — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Gabarito (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2019/gabarito_1_dia_caderno_9_laranja_braile_e_ledor_aplicacao_regular.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2019 — 1º Dia Gabarito — Caderno 10 Verde · Libras",
          "shortLabel": "Caderno 10 Verde · Libras — Gabarito (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2019/gabarito_1_dia_caderno_10_verde_libras_aplicacao_regular.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 10 Verde",
          "cor": "Verde",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2019 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Gabarito (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2019/gabaritos/gabarito_1_dia_caderno_1_azul_2_aplicacao.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2019 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Gabarito (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2019/gabaritos/gabarito_1_dia_caderno_2_amarelo_2_aplicacao.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2019 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Gabarito (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2019/gabaritos/gabarito_1_dia_caderno_3_branco_2_aplicacao.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2019 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Gabarito (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2019/gabaritos/gabarito_1_dia_caderno_4_rosa_2_aplicacao.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2019 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Gabarito (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2019/gabaritos/gabarito_1_dia_caderno_9_laranja_2_aplicacao.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        }
      ]
    },
    "dia2": {
      "provas": [
        {
          "label": "ENEM 2019 — 2º Dia Prova — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Prova (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2019/2019_PV_impresso_D2_CD5.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2019 — 2º Dia Prova — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2019/2019_PV_impresso_D2_CD6.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2019 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 6 Cinza · Ampliada",
          "shortLabel": "Caderno 6 Cinza · Ampliada — Prova (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2019/caderno_de_questoes_2_dia_caderno_6_cinza_ampliada_aplicacao_regular.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2019 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 6 Cinza · Superampliada",
          "shortLabel": "Caderno 6 Cinza · Superampliada — Prova (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2019/caderno_de_questoes_2_dia_caderno_6_cinza_superampliada_aplicacao_regular.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2019 — 2º Dia Prova — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Prova (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2019/2019_PV_impresso_D2_CD7.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2019 — 2º Dia Prova — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Prova (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2019/2019_PV_impresso_D2_CD8.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2019 — 2º Dia Prova — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Prova (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2019/2019_PV_impresso_D2_CD11.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2019 — 2º Dia Prova — Caderno 12 Verde · Libras",
          "shortLabel": "Caderno 12 Verde · Libras — Prova (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2019/2019_PV_impresso_D2_CD12.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 12 Verde",
          "cor": "Verde",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2019 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Prova (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2019/2019_PV_reaplicacao_PPL_D2_CD5.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2019 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 5 Amarelo · Ampliada",
          "shortLabel": "Caderno 5 Amarelo · Ampliada — Prova (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2019/provas/BAIXA_PPL_2_DIA_CADERNO_5_AMARELO_AMP.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2019 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2019/2019_PV_reaplicacao_PPL_D2_CD6.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2019 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Prova (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2019/2019_PV_reaplicacao_PPL_D2_CD7.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2019 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Prova (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2019/2019_PV_reaplicacao_PPL_D2_CD8.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2019 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Prova (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2019/2019_PV_reaplicacao_PPL_D2_CD9.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2019 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Gabarito (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2019/gabarito_2_dia_caderno_5_amarelo_aplicacao_regular.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2019 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Gabarito (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2019/gabarito_2_dia_caderno_6_cinza_aplicacao_regular.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2019 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 6 Cinza · Ampliada",
          "shortLabel": "Caderno 6 Cinza · Ampliada — Gabarito (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2019/gabarito_2_dia_caderno_6_cinza_ampliada_aplicacao_regular.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2019 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 6 Cinza · Superampliada",
          "shortLabel": "Caderno 6 Cinza · Superampliada — Gabarito (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2019/gabarito_2_dia_caderno_6_cinza_superampliada_aplicacao_regular.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2019 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Gabarito (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2019/gabarito_2_dia_caderno_7_azul_aplicacao_regular.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2019 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Gabarito (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2019/gabarito_2_dia_caderno_8_rosa_aplicacao_regular.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2019 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Gabarito (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2019/gabarito_2_dia_caderno_11_laranja_braile_e_ledor_aplicacao_regular.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2019 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 12 Verde · Libras",
          "shortLabel": "Caderno 12 Verde · Libras — Gabarito (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2019/gabarito_2_dia_caderno_12_verde_libras_aplicacao_regular.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 12 Verde",
          "cor": "Verde",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2019 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Gabarito (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2019/gabaritos/gabarito_2_dia_caderno_5_amarelo_2_aplicacao.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2019 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Gabarito (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2019/gabaritos/gabarito_2_dia_caderno_6_cinza_2_aplicacao.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2019 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Gabarito (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2019/gabaritos/gabarito_2_dia_caderno_7_azul_2_aplicacao.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2019 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Gabarito (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2019/gabaritos/gabarito_2_dia_caderno_8_rosa_2_aplicacao.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2019 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Gabarito (2019)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2019/gabaritos/gabarito_2_dia_caderno_11_laraja_2_aplicacao.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        }
      ]
    },
    "observacao": "Aplicação Regular · Reaplicação / PPL (55 arquivos oficiais INEP)"
  },
  {
    "ano": 2018,
    "rotulo": "ENEM 2018",
    "paginaOficial": "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos",
    "dia1": {
      "provas": [
        {
          "label": "ENEM 2018 — 1º Dia Prova — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Prova (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2018/2018_PV_impresso_D1_CD1.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2018 — 1º Dia Prova — Caderno 1 Azul · Ampliada",
          "shortLabel": "Caderno 1 Azul · Ampliada — Prova (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2018/1DIA_AMPLIADA_01_AZUL_BAIXA.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2018 — 1º Dia Prova — Caderno 1 Azul · Superampliada",
          "shortLabel": "Caderno 1 Azul · Superampliada — Prova (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2018/2018_PV_impresso_D1_CD1_superampliada.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2018 — 1º Dia Prova — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Prova (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2018/2018_PV_impresso_D1_CD2.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2018 — 1º Dia Prova — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2018/2018_PV_impresso_D1_CD3.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2018 — 1º Dia Prova — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Prova (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2018/2018_PV_impresso_D1_CD4.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2018 — 1º Dia Prova — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Prova (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2018/2018_PV_impresso_D1_CD9.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2018 — 1º Dia Prova — Caderno 10 Verde · Libras",
          "shortLabel": "Caderno 10 Verde · Libras — Prova (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2018/2018_PV_impresso_D1_CD10.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 10 Verde",
          "cor": "Verde",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2018 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 13 Azul",
          "shortLabel": "Caderno 13 Azul — Prova (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2018/2018_PV_reaplicacao_PPL_D1_CD13.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 13 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2018 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 14 Amarelo",
          "shortLabel": "Caderno 14 Amarelo — Prova (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2018/2018_PV_reaplicacao_PPL_D1_CD14.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 14 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2018 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 15 Branco",
          "shortLabel": "Caderno 15 Branco — Prova (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2018/2018_PV_reaplicacao_PPL_D1_CD15.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 15 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2018 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 16 Rosa",
          "shortLabel": "Caderno 16 Rosa — Prova (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2018/2018_PV_reaplicacao_PPL_D1_CD16.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 16 Rosa",
          "cor": "Rosa"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2018 — 1º Dia Gabarito — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Gabarito (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2018/GAB_ENEM_2018_DIA_1_AZUL.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2018 — 1º Dia Gabarito — Caderno 1 Amarelo",
          "shortLabel": "Caderno 1 Amarelo — Gabarito (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2018/GAB_ENEM_2018_DIA_1_AMARELO.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2018 — 1º Dia Gabarito — Caderno 1 Branco",
          "shortLabel": "Caderno 1 Branco — Gabarito (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2018/GAB_ENEM_2018_DIA_1_BRANCO.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2018 — 1º Dia Gabarito — Caderno 1 Rosa",
          "shortLabel": "Caderno 1 Rosa — Gabarito (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2018/GAB_ENEM_2018_DIA_1_ROSA.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2018 — 1º Dia Gabarito — Caderno Laranja · Ledor",
          "shortLabel": "Caderno Laranja · Ledor — Gabarito (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2018/GAB_ENEM_2018_DIA_1_LARANJA_LEDOR.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno Laranja",
          "cor": "Laranja",
          "acessibilidade": "Ledor"
        },
        {
          "label": "ENEM 2018 — 1º Dia Gabarito — Caderno Verde · Libras",
          "shortLabel": "Caderno Verde · Libras — Gabarito (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2018/GAB_ENEM_2018_DIA_1_VERDE_LIBRAS.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno Verde",
          "cor": "Verde",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2018 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno Azul",
          "shortLabel": "Caderno Azul — Gabarito (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2018/GAB_ENEM_2018_DIA_1_P2_Azul.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2018 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno Amarelo",
          "shortLabel": "Caderno Amarelo — Gabarito (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2018/GAB_ENEM_2018_DIA_1_P2_Amarelo.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2018 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno Branco",
          "shortLabel": "Caderno Branco — Gabarito (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2018/GAB_ENEM_2018_DIA_1_P2_branco.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2018 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno Rosa",
          "shortLabel": "Caderno Rosa — Gabarito (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2018/GAB_ENEM_2018_DIA_1_P2_Rosa.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno Rosa",
          "cor": "Rosa"
        }
      ]
    },
    "dia2": {
      "provas": [
        {
          "label": "ENEM 2018 — 2º Dia Prova — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Prova (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2018/2DIA_05_AMARELO_BAIXA.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2018 — 2º Dia Prova — Caderno 5 Amarelo · Ampliada",
          "shortLabel": "Caderno 5 Amarelo · Ampliada — Prova (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2018/2DIA_AMPLIADA_05_AMARELO_BAIXA.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2018 — 2º Dia Prova — Caderno 5 Amarelo · Superampliada",
          "shortLabel": "Caderno 5 Amarelo · Superampliada — Prova (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2018/2DIA_SUPER_05_AMARELO_BAIXA.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2018 — 2º Dia Prova — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2018/2018_PV_impresso_D2_CD6.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2018 — 2º Dia Prova — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Prova (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2018/2018_PV_impresso_D2_CD7.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2018 — 2º Dia Prova — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Prova (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2018/2018_PV_impresso_D2_CD8.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2018 — 2º Dia Prova — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Prova (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2018/2018_PV_impresso_D2_CD11.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2018 — 2º Dia Prova — Caderno 12 Verde · Libras",
          "shortLabel": "Caderno 12 Verde · Libras — Prova (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2018/2018_PV_impresso_D2_CD12.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 12 Verde",
          "cor": "Verde",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2018 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 17 Amarelo",
          "shortLabel": "Caderno 17 Amarelo — Prova (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2018/2018_PV_reaplicacao_PPL_D2_CD17.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 17 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2018 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 18 Cinza",
          "shortLabel": "Caderno 18 Cinza — Prova (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2018/2018_PV_reaplicacao_PPL_D2_CD18.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 18 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2018 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 19 Azul",
          "shortLabel": "Caderno 19 Azul — Prova (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2018/2018_PV_reaplicacao_PPL_D2_CD19.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 19 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2018 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 20 Rosa",
          "shortLabel": "Caderno 20 Rosa — Prova (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2018/2018_PV_reaplicacao_PPL_D2_CD20.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 20 Rosa",
          "cor": "Rosa"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2018 — 2º Dia Gabarito — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Gabarito (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2018/GAB_ENEM_2018_DIA_2_AMARELO.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2018 — 2º Dia Gabarito — Caderno 2 Azul",
          "shortLabel": "Caderno 2 Azul — Gabarito (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2018/GAB_ENEM_2018_DIA_2_AZUL.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2018 — 2º Dia Gabarito — Caderno 2 Rosa",
          "shortLabel": "Caderno 2 Rosa — Gabarito (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2018/GAB_ENEM_2018_DIA_2_ROSA.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2018 — 2º Dia Gabarito — Caderno Laranja · Ledor",
          "shortLabel": "Caderno Laranja · Ledor — Gabarito (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2018/GAB_ENEM_2018_DIA_2_LARANJA_LEDOR.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno Laranja",
          "cor": "Laranja",
          "acessibilidade": "Ledor"
        },
        {
          "label": "ENEM 2018 — 2º Dia Gabarito — Caderno Verde · Libras",
          "shortLabel": "Caderno Verde · Libras — Gabarito (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2018/GAB_ENEM_2018_DIA_2_VERDE_LIBRAS.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno Verde",
          "cor": "Verde",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2018 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno Amarelo",
          "shortLabel": "Caderno Amarelo — Gabarito (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2018/GAB_ENEM_2018_DIA_2_P2_Amarelo.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2018 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno Cinza",
          "shortLabel": "Caderno Cinza — Gabarito (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2018/GAB_ENEM_2018_DIA_2_P2_Cinza.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2018 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno Azul",
          "shortLabel": "Caderno Azul — Gabarito (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2018/GAB_ENEM_2018_DIA_2_P2_Azul.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2018 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno Rosa",
          "shortLabel": "Caderno Rosa — Gabarito (2018)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2018/GAB_ENEM_2018_DIA_2_P2_Rosa.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno Rosa",
          "cor": "Rosa"
        }
      ]
    },
    "observacao": "Aplicação Regular · Reaplicação / PPL (43 arquivos oficiais INEP)"
  },
  {
    "ano": 2017,
    "rotulo": "ENEM 2017",
    "paginaOficial": "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos",
    "dia1": {
      "provas": [
        {
          "label": "ENEM 2017 — 1º Dia Prova — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Prova (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2017/2017_PV_impresso_D1_CD1.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2017 — 1º Dia Prova — Caderno 1 Azul · Ampliada",
          "shortLabel": "Caderno 1 Azul · Ampliada — Prova (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2017/cad_1_ampliada_azul_5112017.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2017 — 1º Dia Prova — Caderno 1 Azul · Superampliada",
          "shortLabel": "Caderno 1 Azul · Superampliada — Prova (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2017/cad_1_superampliada_azul_05112017.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2017 — 1º Dia Prova — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Prova (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2017/cad_2_prova_amarelo_5112017.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2017 — 1º Dia Prova — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2017/2017_PV_impresso_D1_CD3.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2017 — 1º Dia Prova — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Prova (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2017/2017_PV_impresso_D1_CD4.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2017 — 1º Dia Prova — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Prova (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2017/2017_PV_impresso_D1_CD9.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2017 — 1º Dia Prova — Caderno 10 Verde · Libras",
          "shortLabel": "Caderno 10 Verde · Libras — Prova (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2017/2017_PV_impresso_D1_CD10.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 10 Verde",
          "cor": "Verde",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2017 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Prova (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2017/P2_01_azul.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2017 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Prova (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2017/provas/P2_02_AMARELO.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2017 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2017/2017_PV_reaplicacao_PPL_D1_CD3.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2017 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Prova (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2017/2017_PV_reaplicacao_PPL_D1_CD4.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2017 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Prova (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2017/2017_PV_reaplicacao_PPL_D1_CD9.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2017 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 13 Azul",
          "shortLabel": "Caderno 13 Azul — Prova (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2017/2017_PV_reaplicacao_PPL_D1_CD13.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 13 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2017 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 14 Amarelo",
          "shortLabel": "Caderno 14 Amarelo — Prova (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2017/2017_PV_reaplicacao_PPL_D1_CD14.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 14 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2017 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 15 Branco",
          "shortLabel": "Caderno 15 Branco — Prova (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2017/2017_PV_reaplicacao_PPL_D1_CD15.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 15 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2017 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 16 Rosa",
          "shortLabel": "Caderno 16 Rosa — Prova (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2017/2017_PV_reaplicacao_PPL_D1_CD16.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 16 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2017 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 21 · Libras",
          "shortLabel": "Caderno 21 · Libras — Prova (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2017/2017_PV_reaplicacao_PPL_D1_CD21.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 21",
          "acessibilidade": "Libras"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2017 — 1º Dia Gabarito — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Gabarito (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2017/cad_1_gabarito_azul_5112017.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2017 — 1º Dia Gabarito — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Gabarito (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2017/cad_2_gabarito_amarelo_5112017.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2017 — 1º Dia Gabarito — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Gabarito (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2017/cad_3_gabarito_branco_5112017.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2017 — 1º Dia Gabarito — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Gabarito (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2017/cad_4_gabarito_rosa_5112017.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2017 — 1º Dia Gabarito — Caderno 9 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 9 Laranja · Braile e Ledor — Gabarito (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2017/cad_9_gabarito_laranja_5112017.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 9 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2017 — 1º Dia Gabarito — Caderno 10 Verde · Libras",
          "shortLabel": "Caderno 10 Verde · Libras — Gabarito (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2017/cad_10_gabarito_verde_5112017.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 10 Verde",
          "cor": "Verde",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2017 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno Azul",
          "shortLabel": "Caderno Azul — Gabarito (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2017/gab_enem2017_2_dia1_Azul.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2017 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Gabarito (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2017/gabaritos/GAB_ENEM_2017_2_APL_DIA_1_Amarelo_cad_2.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2017 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Gabarito (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2017/gabaritos/GAB_ENEM_2017_2_APL_DIA_1_Branco_cad_3.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2017 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Gabarito (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2017/gabaritos/GAB_ENEM_2017_2_APL_DIA_1_Rosa_cad_4.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        }
      ]
    },
    "dia2": {
      "provas": [
        {
          "label": "ENEM 2017 — 2º Dia Prova — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Prova (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2017/2017_PV_impresso_D2_CD5.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2017 — 2º Dia Prova — Caderno 5 Amarelo · Ampliada",
          "shortLabel": "Caderno 5 Amarelo · Ampliada — Prova (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2017/cad_5_ampliada_amarelo_12112017.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo",
          "acessibilidade": "Ampliada"
        },
        {
          "label": "ENEM 2017 — 2º Dia Prova — Caderno 5 Amarelo · Superampliada",
          "shortLabel": "Caderno 5 Amarelo · Superampliada — Prova (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2017/cad_5_superampliada_amarelo_12112017.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo",
          "acessibilidade": "Superampliada"
        },
        {
          "label": "ENEM 2017 — 2º Dia Prova — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2017/2017_PV_impresso_D2_CD6.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2017 — 2º Dia Prova — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Prova (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2017/2017_PV_impresso_D2_CD7.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2017 — 2º Dia Prova — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Prova (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2017/2017_PV_impresso_D2_CD8.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2017 — 2º Dia Prova — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Prova (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2017/2017_PV_impresso_D2_CD11.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2017 — 2º Dia Prova — Caderno 12 Verde · Libras",
          "shortLabel": "Caderno 12 Verde · Libras — Prova (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2017/2017_PV_impresso_D2_CD12.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 12 Verde",
          "cor": "Verde",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2017 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Prova (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2017/provas/P2_05_AMARELO.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2017 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2017/provas/P2_06_CINZA.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2017 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Prova (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2017/2017_PV_reaplicacao_PPL_D2_CD7.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2017 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Prova (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2017/2017_PV_reaplicacao_PPL_D2_CD8.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2017 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Prova (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2017/2017_PV_reaplicacao_PPL_D2_CD11.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2017 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 18 Cinza",
          "shortLabel": "Caderno 18 Cinza — Prova (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2017/2017_PV_reaplicacao_PPL_D2_CD18.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 18 Cinza",
          "cor": "Cinza"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2017 — 2º Dia Gabarito — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Gabarito (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2017/cad_5_gabarito_amarelo_12112017.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2017 — 2º Dia Gabarito — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Gabarito (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2017/cad_6_gabarito_cinza_12112017.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2017 — 2º Dia Gabarito — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Gabarito (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2017/cad_7_gabarito_azul_12112017.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2017 — 2º Dia Gabarito — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Gabarito (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2017/cad_8_gabarito_rosa_12112017.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2017 — 2º Dia Gabarito — Caderno 11 Laranja · Braile e Ledor",
          "shortLabel": "Caderno 11 Laranja · Braile e Ledor — Gabarito (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2017/cad_11_gabarito_laranja_12112017.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 11 Laranja",
          "cor": "Laranja",
          "acessibilidade": "Braile e Ledor"
        },
        {
          "label": "ENEM 2017 — 2º Dia Gabarito — Caderno 12 Verde · Libras",
          "shortLabel": "Caderno 12 Verde · Libras — Gabarito (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2017/cad_12_gabarito_verde_12112017.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 12 Verde",
          "cor": "Verde",
          "acessibilidade": "Libras"
        },
        {
          "label": "ENEM 2017 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Gabarito (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2017/gabaritos/GAB_ENEM_2017_2_APL_DIA_2_Amarelo_cad_5.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2017 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Gabarito (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2017/gabaritos/GAB_ENEM_2017_2_APL_DIA_2_Cinza_cad_6.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2017 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Gabarito (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2017/gabaritos/GAB_ENEM_2017_2_APL_DIA_2_Azul_cad-7.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2017 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Gabarito (2017)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2017/gabaritos/GAB_ENEM_2017_2_APL_DIA_2_Rosa_cad_8.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        }
      ]
    },
    "observacao": "Aplicação Regular · Reaplicação / PPL (52 arquivos oficiais INEP)"
  },
  {
    "ano": 2016,
    "rotulo": "ENEM 2016",
    "paginaOficial": "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos",
    "dia1": {
      "provas": [
        {
          "label": "ENEM 2016 — 1º Dia Prova — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Prova (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2016/2016_PV_impresso_D1_CD1.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2016 — 1º Dia Prova — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Prova (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2016/2016_PV_impresso_D1_CD2.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2016 — 1º Dia Prova — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2016/2016_PV_impresso_D1_CD3.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2016 — 1º Dia Prova — Caderno 3 Branco · Ledor",
          "shortLabel": "Caderno 3 Branco · Ledor — Prova (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2016/2016_PV_impresso_D1_CD3_ledor.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco",
          "acessibilidade": "Ledor"
        },
        {
          "label": "ENEM 2016 — 1º Dia Prova — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Prova (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2016/2016_PV_impresso_D1_CD4.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2016 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Prova (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2016/P2_01_AZUL_CH_CN_2016_REG.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2016 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Prova (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2016/P2_02_AMARELO_CH_CN_2016_REG.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2016 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2016/P2_03_BRANCO_CH_CN_2016_REG.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2016 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Prova (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2016/P2_04_ROSA_CH_CN_2016_REG.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2016 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 9 Branco",
          "shortLabel": "Caderno 9 Branco — Prova (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2016/2016_PV_reaplicacao_PPL_D1_CD9.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 9 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2016 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 10",
          "shortLabel": "Caderno 10 — Prova (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2016/2016_PV_reaplicacao_PPL_D1_CD10.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 10"
        },
        {
          "label": "ENEM 2016 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 11 Branco",
          "shortLabel": "Caderno 11 Branco — Prova (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2016/2016_PV_reaplicacao_PPL_D1_CD11.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 11 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2016 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 12",
          "shortLabel": "Caderno 12 — Prova (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2016/2016_PV_reaplicacao_PPL_D1_CD12.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 12"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2016 — 1º Dia Gabarito — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Gabarito (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2016/GAB_ENEM_2016_DIA_1_01_AZUL.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2016 — 1º Dia Gabarito — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Gabarito (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2016/GAB_ENEM_2016_DIA_1_02_AMARELO.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2016 — 1º Dia Gabarito — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Gabarito (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2016/GAB_ENEM_2016_DIA_1_03_BRANCO.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2016 — 1º Dia Gabarito — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Gabarito (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2016/GAB_ENEM_2016_DIA_1_04_ROSA.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2016 — 1º Dia Gabarito — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Gabarito (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2016/GAB_ENEM_2016_DIA_2_08_ROSA.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2016 — 1º Dia Gabarito — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Gabarito (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2016/GAB_ENEM_2016_DIA_1_02_AMARELO_2.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2016 — 1º Dia Gabarito — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Gabarito (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2016/GAB_ENEM_2016_DIA_1_03_BRANCO_2.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2016 — 1º Dia Gabarito — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Gabarito (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2016/GAB_ENEM_2016_DIA_1_04_ROSA_2.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2016 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 9 Branco",
          "shortLabel": "Caderno 9 Branco — Gabarito (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2016/gabarito_caderno_branco_9_2016.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 9 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2016 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 10 Branco",
          "shortLabel": "Caderno 10 Branco — Gabarito (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2016/gabarito_caderno_branco_10_2016.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 10 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2016 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 12 Branco",
          "shortLabel": "Caderno 12 Branco — Gabarito (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2016/gabarito_caderno_branco_12_2016.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 12 Branco",
          "cor": "Branco"
        }
      ]
    },
    "dia2": {
      "provas": [
        {
          "label": "ENEM 2016 — 2º Dia Prova — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Prova (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2016/2016_PV_impresso_D2_CD5.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2016 — 2º Dia Prova — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2016/2016_PV_impresso_D2_CD6.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2016 — 2º Dia Prova — Caderno 6 Cinza · Ledor",
          "shortLabel": "Caderno 6 Cinza · Ledor — Prova (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2016/2016_PV_impresso_D2_CD6_ledor.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza",
          "acessibilidade": "Ledor"
        },
        {
          "label": "ENEM 2016 — 2º Dia Prova — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Prova (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2016/2016_PV_impresso_D2_CD7.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2016 — 2º Dia Prova — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Prova (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2016/2016_PV_impresso_D2_CD8.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2016 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Prova (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2016/P2_05_AMARELO_LC_MT_2016_REG.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2016 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2016/P2_06_CINZA_LC_MT_2016_REG.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2016 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Prova (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2016/P2_07_AZUL_LC_MT_2016_REG.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2016 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Prova (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2016/P2_08_ROSA_LC_MT_2016_REG.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2016 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 13 Azul",
          "shortLabel": "Caderno 13 Azul — Prova (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2016/2016_PV_reaplicacao_PPL_D2_CD13.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 13 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2016 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 14 Amarelo",
          "shortLabel": "Caderno 14 Amarelo — Prova (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2016/2016_PV_reaplicacao_PPL_D2_CD14.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 14 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2016 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 15 Branco",
          "shortLabel": "Caderno 15 Branco — Prova (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2016/2016_PV_reaplicacao_PPL_D2_CD15.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 15 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2016 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 16 Rosa",
          "shortLabel": "Caderno 16 Rosa — Prova (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2016/2016_PV_reaplicacao_PPL_D2_CD16.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 16 Rosa",
          "cor": "Rosa"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2016 — 2º Dia Gabarito — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Gabarito (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2016/GAB_ENEM_2016_DIA_2_05_AMARELO.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2016 — 2º Dia Gabarito — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Gabarito (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2016/GAB_ENEM_2016_DIA_2_06_CINZA.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2016 — 2º Dia Gabarito — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Gabarito (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2016/GAB_ENEM_2016_DIA_2_07_AZUL.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2016 — 2º Dia Gabarito — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Gabarito (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2016/GAB_ENEM_2016_DIA_2_08_ROSA.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2016 — 2º Dia Gabarito — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Gabarito (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2016/GAB_ENEM_2016_DIA_2_05_AMARELO_2.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2016 — 2º Dia Gabarito — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Gabarito (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2016/GAB_ENEM_2016_DIA_2_06_CINZA_2.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2016 — 2º Dia Gabarito — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Gabarito (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2016/GAB_ENEM_2016_DIA_2_07_AZUL_2.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2016 — 2º Dia Gabarito — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Gabarito (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2016/GAB_ENEM_2016_DIA_2_08_ROSA_2.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2016 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 13 Cinza",
          "shortLabel": "Caderno 13 Cinza — Gabarito (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2016/gabarito_caderno_cinza_13_2016.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 13 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2016 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 14 Cinza",
          "shortLabel": "Caderno 14 Cinza — Gabarito (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2016/gabarito_caderno_cinza_14_2016.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 14 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2016 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 15 Cinza",
          "shortLabel": "Caderno 15 Cinza — Gabarito (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2016/gabarito_caderno_cinza_15_2016.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 15 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2016 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 16 Cinza",
          "shortLabel": "Caderno 16 Cinza — Gabarito (2016)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2016/gabarito_caderno_cinza_16_2016.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 16 Cinza",
          "cor": "Cinza"
        }
      ]
    },
    "observacao": "Aplicação Regular · Reaplicação / PPL (49 arquivos oficiais INEP)"
  },
  {
    "ano": 2015,
    "rotulo": "ENEM 2015",
    "paginaOficial": "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos",
    "dia1": {
      "provas": [
        {
          "label": "ENEM 2015 — 1º Dia Prova — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Prova (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2015/2015_PV_impresso_D1_CD1.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2015 — 1º Dia Prova — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Prova (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2015/2015_PV_impresso_D1_CD2.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2015 — 1º Dia Prova — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2015/2015_PV_impresso_D1_CD3.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2015 — 1º Dia Prova — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Prova (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2015/2015_PV_impresso_D1_CD4.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2015 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 9",
          "shortLabel": "Caderno 9 — Prova (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2015/2015_PV_reaplicacao_PPL_D1_CD9.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 9"
        },
        {
          "label": "ENEM 2015 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 10",
          "shortLabel": "Caderno 10 — Prova (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2015/2015_PV_reaplicacao_PPL_D1_CD10.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 10"
        },
        {
          "label": "ENEM 2015 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 11",
          "shortLabel": "Caderno 11 — Prova (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2015/2015_PV_reaplicacao_PPL_D1_CD11.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 11"
        },
        {
          "label": "ENEM 2015 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 11 · Ledor",
          "shortLabel": "Caderno 11 · Ledor — Prova (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2015/2015_PV_reaplicacao_PPL_D1_CD11_ledor.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 11",
          "acessibilidade": "Ledor"
        },
        {
          "label": "ENEM 2015 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 12",
          "shortLabel": "Caderno 12 — Prova (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2015/2015_PV_reaplicacao_PPL_D1_CD12.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 12"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2015 — 1º Dia Gabarito — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Gabarito (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2015/CADERNO_1_AZUL_SABADO.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2015 — 1º Dia Gabarito — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Gabarito (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2015/CADERNO_2_AMARELO_SABADO.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2015 — 1º Dia Gabarito — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Gabarito (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2015/CADERNO_3_BRANCO_SABADO.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2015 — 1º Dia Gabarito — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Gabarito (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2015/CADERNO_4_ROSA_SABADO.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2015 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 9",
          "shortLabel": "Caderno 9 — Gabarito (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2015/GAB_ENEM2015_2aAPLICACAO_DIA1_CADERNO_9.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 9"
        },
        {
          "label": "ENEM 2015 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 10",
          "shortLabel": "Caderno 10 — Gabarito (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2015/GAB_ENEM2015_2aAPLICACAO_DIA1_CADERNO_10.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 10"
        },
        {
          "label": "ENEM 2015 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 11",
          "shortLabel": "Caderno 11 — Gabarito (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2015/GAB_ENEM2015_2aAPLICACAO_DIA1_CADERNO_11.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 11"
        },
        {
          "label": "ENEM 2015 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 12",
          "shortLabel": "Caderno 12 — Gabarito (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2015/GAB_ENEM2015_2aAPLICACAO_DIA1_CADERNO_12.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 12"
        }
      ]
    },
    "dia2": {
      "provas": [
        {
          "label": "ENEM 2015 — 2º Dia Prova — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Prova (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2015/2015_PV_impresso_D2_CD5.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2015 — 2º Dia Prova — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2015/2015_PV_impresso_D2_CD6.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2015 — 2º Dia Prova — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Prova (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2015/2015_PV_impresso_D2_CD7.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2015 — 2º Dia Prova — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Prova (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2015/2015_PV_impresso_D2_CD8.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2015 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 13 Azul",
          "shortLabel": "Caderno 13 Azul — Prova (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2015/2015_PV_reaplicacao_PPL_D2_CD13.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 13 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2015 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 14 Amarelo",
          "shortLabel": "Caderno 14 Amarelo — Prova (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2015/2015_PV_reaplicacao_PPL_D2_CD14.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 14 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2015 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 14 Amarelo · Ledor",
          "shortLabel": "Caderno 14 Amarelo · Ledor — Prova (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2015/2015_PV_reaplicacao_PPL_D2_CD14_ledor.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 14 Amarelo",
          "cor": "Amarelo",
          "acessibilidade": "Ledor"
        },
        {
          "label": "ENEM 2015 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 15 Branco",
          "shortLabel": "Caderno 15 Branco — Prova (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2015/2015_PV_reaplicacao_PPL_D2_CD15.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 15 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2015 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 16 Rosa",
          "shortLabel": "Caderno 16 Rosa — Prova (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2015/2015_PV_reaplicacao_PPL_D2_CD16.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 16 Rosa",
          "cor": "Rosa"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2015 — 2º Dia Gabarito — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Gabarito (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2015/CADERNO_5_AMARELO_DOMINGO.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2015 — 2º Dia Gabarito — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Gabarito (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2015/CADERNO_6_CINZA_DOMINGO.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2015 — 2º Dia Gabarito — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Gabarito (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2015/CADERNO_7_AZUL_DOMINGO.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2015 — 2º Dia Gabarito — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Gabarito (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2015/CADERNO_8_ROSA_DOMINGO.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2015 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 12",
          "shortLabel": "Caderno 12 — Gabarito (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2015/GAB_ENEM2015_2aAPLICACAO_DIA1_CADERNO_12.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 12"
        },
        {
          "label": "ENEM 2015 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 13 Azul",
          "shortLabel": "Caderno 13 Azul — Gabarito (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2015/GAB_ENEM2015_2aAPLICACAO_DIA2_CADERNO_13.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 13 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2015 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 15 Branco",
          "shortLabel": "Caderno 15 Branco — Gabarito (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2015/GAB_ENEM2015_2aAPLICACAO_DIA2_CADERNO_15.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 15 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2015 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 16 Rosa",
          "shortLabel": "Caderno 16 Rosa — Gabarito (2015)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2015/GAB_ENEM2015_2aAPLICACAO_DIA2_CADERNO_16.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 16 Rosa",
          "cor": "Rosa"
        }
      ]
    },
    "observacao": "Aplicação Regular · Reaplicação / PPL (34 arquivos oficiais INEP)"
  },
  {
    "ano": 2014,
    "rotulo": "ENEM 2014",
    "paginaOficial": "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos",
    "dia1": {
      "provas": [
        {
          "label": "ENEM 2014 — 1º Dia Prova — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Prova (2014)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2014/2014_PV_impresso_D1_CD1.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2014 — 1º Dia Prova — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Prova (2014)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2014/2014_PV_impresso_D1_CD2.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2014 — 1º Dia Prova — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2014)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2014/2014_PV_impresso_D1_CD3.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2014 — 1º Dia Prova — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Prova (2014)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2014/2014_PV_impresso_D1_CD4.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2014 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2014)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2014/2014_PPL_PV_D1_CD3.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2014 — 1º Dia Prova (3ª Aplicação) — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2014)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2014/2014_PV_terceira_aplicacao_D1_CD3.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "3ª Aplicação",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2014 — 1º Dia Gabarito — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Gabarito (2014)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2014/CADERNO_1_AZUL_SABADO.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2014 — 1º Dia Gabarito — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Gabarito (2014)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2014/CADERNO_2_AMARELO_SABADO.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2014 — 1º Dia Gabarito — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Gabarito (2014)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2014/CADERNO_3_BRANCO_SABADO.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2014 — 1º Dia Gabarito — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Gabarito (2014)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2014/CADERNO_4_ROSA_SABADO.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2014 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Gabarito (2014)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2014/2014_PPL_GB_D1_CD3.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2014 — 1º Dia Gabarito (3ª Aplicação) — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Gabarito (2014)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2014/2014_GB_terceira_aplicacao_D1_CD3.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "3ª Aplicação",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        }
      ]
    },
    "dia2": {
      "provas": [
        {
          "label": "ENEM 2014 — 2º Dia Prova — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Prova (2014)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2014/2014_PV_impresso_D2_CD5.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2014 — 2º Dia Prova — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2014)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2014/2014_PV_impresso_D2_CD6.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2014 — 2º Dia Prova — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Prova (2014)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2014/2014_PV_impresso_D2_CD7.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2014 — 2º Dia Prova — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Prova (2014)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2014/2014_PV_impresso_D2_CD8.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2014 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2014)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2014/2014_PPL_PV_D2_CD6.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2014 — 2º Dia Prova (3ª Aplicação) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2014)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2014/2014_PV_terceira_aplicacao_D2_CD6.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "3ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2014 — 2º Dia Gabarito — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Gabarito (2014)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2014/CADERNO_5_AMARELO_DOMINGO.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2014 — 2º Dia Gabarito — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Gabarito (2014)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2014/CADERNO_6_CINZA_DOMINGO.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2014 — 2º Dia Gabarito — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Gabarito (2014)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2014/CADERNO_7_AZUL_DOMINGO.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2014 — 2º Dia Gabarito — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Gabarito (2014)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2014/CADERNO_8_ROSA_DOMINGO.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2014 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Gabarito (2014)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2014/2014_PPL_GB_D2_CD6.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2014 — 2º Dia Gabarito (3ª Aplicação) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Gabarito (2014)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2014/2014_GB_terceira_aplicacao_D2_CD6.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "3ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        }
      ]
    },
    "observacao": "Aplicação Regular · Reaplicação / PPL · 3ª Aplicação (24 arquivos oficiais INEP)"
  },
  {
    "ano": 2013,
    "rotulo": "ENEM 2013",
    "paginaOficial": "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos",
    "dia1": {
      "provas": [
        {
          "label": "ENEM 2013 — 1º Dia Prova — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Prova (2013)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2013/dia1_caderno1_azul.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2013 — 1º Dia Prova — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Prova (2013)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2013/dia1_caderno2_amarelo.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2013 — 1º Dia Prova — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2013)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2013/dia1_caderno3_branco.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2013 — 1º Dia Prova — Caderno 3 Branco · Ledor",
          "shortLabel": "Caderno 3 Branco · Ledor — Prova (2013)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2013/dia1_caderno3_branco_ledor.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco",
          "acessibilidade": "Ledor"
        },
        {
          "label": "ENEM 2013 — 1º Dia Prova — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Prova (2013)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2013/dia1_caderno4_rosa.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2013 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2013)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2013/2013_PV_reaplicacao_PPL_D1_CD3.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2013 — 1º Dia Gabarito — Caderno Azul",
          "shortLabel": "Caderno Azul — Gabarito (2013)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2013/dia1_azul.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2013 — 1º Dia Gabarito — Caderno Amarelo",
          "shortLabel": "Caderno Amarelo — Gabarito (2013)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2013/dia1_amarelo.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2013 — 1º Dia Gabarito — Caderno Branco",
          "shortLabel": "Caderno Branco — Gabarito (2013)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2013/dia1_branco.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2013 — 1º Dia Gabarito — Caderno Rosa",
          "shortLabel": "Caderno Rosa — Gabarito (2013)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2013/dia1_rosa.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2013 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno Branco",
          "shortLabel": "Caderno Branco — Gabarito (2013)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2013/gabarito_enem_ppl_2013_dia1_branca.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno Branco",
          "cor": "Branco"
        }
      ]
    },
    "dia2": {
      "provas": [
        {
          "label": "ENEM 2013 — 2º Dia Prova — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Prova (2013)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2013/dia2_caderno5_amarelo.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2013 — 2º Dia Prova — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2013)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2013/dia2_caderno6_cinza.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2013 — 2º Dia Prova — Caderno 6 Cinza · Ledor",
          "shortLabel": "Caderno 6 Cinza · Ledor — Prova (2013)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2013/dia2_caderno6_cinza_ledor.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza",
          "acessibilidade": "Ledor"
        },
        {
          "label": "ENEM 2013 — 2º Dia Prova — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Prova (2013)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2013/dia2_caderno7_azul.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2013 — 2º Dia Prova — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Prova (2013)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2013/dia2_caderno8_rosa.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2013 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2013)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2013/2013_PV_reaplicacao_PPL_D1_CD6.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2013 — 2º Dia Gabarito — Caderno Amarelo",
          "shortLabel": "Caderno Amarelo — Gabarito (2013)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2013/dia2_amarelo.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2013 — 2º Dia Gabarito — Caderno Cinza",
          "shortLabel": "Caderno Cinza — Gabarito (2013)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2013/dia2_cinza.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2013 — 2º Dia Gabarito — Caderno Azul",
          "shortLabel": "Caderno Azul — Gabarito (2013)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2013/dia2_azul.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2013 — 2º Dia Gabarito — Caderno Rosa",
          "shortLabel": "Caderno Rosa — Gabarito (2013)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2013/dia2_rosa.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2013 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno Cinza",
          "shortLabel": "Caderno Cinza — Gabarito (2013)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2013/gabarito_enem_ppl_2013_dia2_cinza.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno Cinza",
          "cor": "Cinza"
        }
      ]
    },
    "observacao": "Aplicação Regular · Reaplicação / PPL (22 arquivos oficiais INEP)"
  },
  {
    "ano": 2012,
    "rotulo": "ENEM 2012",
    "paginaOficial": "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos",
    "dia1": {
      "provas": [
        {
          "label": "ENEM 2012 — 1º Dia Prova — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Prova (2012)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2012/dia1_caderno1_azul.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2012 — 1º Dia Prova — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Prova (2012)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2012/dia1_caderno2_amarelo.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2012 — 1º Dia Prova — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2012)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2012/dia1_caderno3_branco.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2012 — 1º Dia Prova — Caderno 3 Branco · Ledor",
          "shortLabel": "Caderno 3 Branco · Ledor — Prova (2012)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2012/dia1_caderno3_branco_ledor.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco",
          "acessibilidade": "Ledor"
        },
        {
          "label": "ENEM 2012 — 1º Dia Prova — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Prova (2012)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2012/dia1_caderno4_rosa.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2012 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2012)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2012/2012_PV_reaplicacao_PPL_D1_CD3.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2012 — 1º Dia Gabarito — Caderno Azul",
          "shortLabel": "Caderno Azul — Gabarito (2012)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2012/dia1_azul.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2012 — 1º Dia Gabarito — Caderno Amarelo",
          "shortLabel": "Caderno Amarelo — Gabarito (2012)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2012/dia1_amarelo.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2012 — 1º Dia Gabarito — Caderno Branco",
          "shortLabel": "Caderno Branco — Gabarito (2012)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2012/dia1_branco.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2012 — 1º Dia Gabarito — Caderno Rosa",
          "shortLabel": "Caderno Rosa — Gabarito (2012)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2012/dia1_rosa.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2012 — 1º Dia Gabarito (PPL / 2ª Aplicação) — Caderno Branco",
          "shortLabel": "Caderno Branco — Gabarito (2012)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2012/p2_dia1_branco_2012.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno Branco",
          "cor": "Branco"
        }
      ]
    },
    "dia2": {
      "provas": [
        {
          "label": "ENEM 2012 — 2º Dia Prova — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Prova (2012)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2012/dia2_caderno5_amarelo.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2012 — 2º Dia Prova — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2012)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2012/dia2_caderno6_cinza.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2012 — 2º Dia Prova — Caderno 6 Cinza · Ledor",
          "shortLabel": "Caderno 6 Cinza · Ledor — Prova (2012)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2012/dia2_caderno6_cinza_ledor.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza",
          "acessibilidade": "Ledor"
        },
        {
          "label": "ENEM 2012 — 2º Dia Prova — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Prova (2012)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2012/dia2_caderno7_azul.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2012 — 2º Dia Prova — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Prova (2012)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2012/dia2_caderno8_rosa.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2012 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2012)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2012/2012_PV_reaplicacao_PPL_D2_CD6.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2012 — 2º Dia Gabarito — Caderno Amarelo",
          "shortLabel": "Caderno Amarelo — Gabarito (2012)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2012/dia2_amarelo.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2012 — 2º Dia Gabarito — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Gabarito (2012)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2011/06_CINZA_GABARITO.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2012 — 2º Dia Gabarito — Caderno Azul",
          "shortLabel": "Caderno Azul — Gabarito (2012)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2012/dia2_azul.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2012 — 2º Dia Gabarito — Caderno Rosa",
          "shortLabel": "Caderno Rosa — Gabarito (2012)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2012/dia2_rosa.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2012 — 2º Dia Gabarito (PPL / 2ª Aplicação) — Caderno Cinza",
          "shortLabel": "Caderno Cinza — Gabarito (2012)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2012/p2_dia2_cinza_2012.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno Cinza",
          "cor": "Cinza"
        }
      ]
    },
    "observacao": "Aplicação Regular · Reaplicação / PPL (22 arquivos oficiais INEP)"
  },
  {
    "ano": 2011,
    "rotulo": "ENEM 2011",
    "paginaOficial": "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos",
    "dia1": {
      "provas": [
        {
          "label": "ENEM 2011 — 1º Dia Prova — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Prova (2011)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2011/dia1_caderno1_azul.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2011 — 1º Dia Prova — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Prova (2011)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2011/dia1_caderno2_amarelo.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2011 — 1º Dia Prova — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2011)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2011/dia1_caderno3_branco.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2011 — 1º Dia Prova — Caderno 3 Branco · Ledor",
          "shortLabel": "Caderno 3 Branco · Ledor — Prova (2011)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2011/dia1_caderno3_branco_ledor.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco",
          "acessibilidade": "Ledor"
        },
        {
          "label": "ENEM 2011 — 1º Dia Prova — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Prova (2011)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2011/dia1_caderno4_rosa.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2011 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2011)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2011/PPL_ENEM_2011_03_BRANCO.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2011 — 1º Dia Gabarito — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Gabarito (2011)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2011/01_AZUL_GABARITO.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2011 — 1º Dia Gabarito — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Gabarito (2011)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2011/02_AMARELO_GABARITO.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2011 — 1º Dia Gabarito — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Gabarito (2011)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2011/03_BRANCO_GABARITO.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2011 — 1º Dia Gabarito — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Gabarito (2011)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2011/04_ROSA_GABARITO.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        }
      ]
    },
    "dia2": {
      "provas": [
        {
          "label": "ENEM 2011 — 2º Dia Prova — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Prova (2011)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2011/dia2_caderno5_amarelo.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2011 — 2º Dia Prova — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2011)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2011/dia2_caderno6_cinza.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2011 — 2º Dia Prova — Caderno 6 Cinza · Ledor",
          "shortLabel": "Caderno 6 Cinza · Ledor — Prova (2011)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2011/dia2_caderno6_cinza_ledor.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza",
          "acessibilidade": "Ledor"
        },
        {
          "label": "ENEM 2011 — 2º Dia Prova — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Prova (2011)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2011/dia2_caderno7_azul.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2011 — 2º Dia Prova — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Prova (2011)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2011/dia2_caderno8_rosa.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2011 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2011)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/ppl/2011/PPL_ENEM_2011_06_CINZA.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2011 — 2º Dia Gabarito — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Gabarito (2011)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2011/05_AMARELO_GABARITO.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2011 — 2º Dia Gabarito — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Gabarito (2011)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2011/06_CINZA_GABARITO.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2011 — 2º Dia Gabarito — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Gabarito (2011)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2011/07_AZUL_GABARITO.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2011 — 2º Dia Gabarito — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Gabarito (2011)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/gabaritos/2011/08_ROSA_GABARITO.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        }
      ]
    },
    "observacao": "Aplicação Regular · Reaplicação / PPL (20 arquivos oficiais INEP)"
  },
  {
    "ano": 2010,
    "rotulo": "ENEM 2010",
    "paginaOficial": "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos",
    "dia1": {
      "provas": [
        {
          "label": "ENEM 2010 — 1º Dia Prova — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Prova (2010)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2010/dia1_caderno1_azul.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2010 — 1º Dia Prova — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Prova (2010)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2010/dia1_caderno2_amarelo.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2010 — 1º Dia Prova — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2010)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2010/dia1_caderno3_branco.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2010 — 1º Dia Prova — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Prova (2010)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2010/dia1_caderno4_rosa.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2010 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Prova (2010)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2010/2010_PV_reaplicacao_PPL_D1_CD1.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2010 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Prova (2010)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2010/2010_PV_reaplicacao_PPL_D1_CD2.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2010 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Prova (2010)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2010/2010_PV_reaplicacao_PPL_D1_CD3.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2010 — 1º Dia Prova (PPL / 2ª Aplicação) — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Prova (2010)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2010/2010_PV_reaplicacao_PPL_D1_CD4.pdf",
          "tipo": "prova",
          "dia": 1,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2010 — 1º Dia Gabarito — Caderno 1 Azul",
          "shortLabel": "Caderno 1 Azul — Gabarito (2010)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2010/dia1_caderno1_azul_com_gab.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 1 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2010 — 1º Dia Gabarito — Caderno 2 Amarelo",
          "shortLabel": "Caderno 2 Amarelo — Gabarito (2010)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2010/dia1_caderno2_amarelo_com_gab.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 2 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2010 — 1º Dia Gabarito — Caderno 3 Branco",
          "shortLabel": "Caderno 3 Branco — Gabarito (2010)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2010/dia1_caderno3_branco_com_gab.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 3 Branco",
          "cor": "Branco"
        },
        {
          "label": "ENEM 2010 — 1º Dia Gabarito — Caderno 4 Rosa",
          "shortLabel": "Caderno 4 Rosa — Gabarito (2010)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2010/dia1_caderno4_rosa_com_gab.pdf",
          "tipo": "gabarito",
          "dia": 1,
          "aplicacao": "Regular",
          "caderno": "Caderno 4 Rosa",
          "cor": "Rosa"
        }
      ]
    },
    "dia2": {
      "provas": [
        {
          "label": "ENEM 2010 — 2º Dia Prova — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Prova (2010)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2010/dia2_caderno5_amarelo.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2010 — 2º Dia Prova — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2010)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2010/dia2_caderno6_cinza.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2010 — 2º Dia Prova — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Prova (2010)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2010/dia2_caderno7_azul.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2010 — 2º Dia Prova — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Prova (2010)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2010/dia2_caderno8_rosa.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        },
        {
          "label": "ENEM 2010 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Prova (2010)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2010/2010_PV_reaplicacao_PPL_D2_CD5.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2010 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Prova (2010)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2010/2010_PV_reaplicacao_PPL_D2_CD6.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2010 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Prova (2010)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2010/2010_PV_reaplicacao_PPL_D2_CD7.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2010 — 2º Dia Prova (PPL / 2ª Aplicação) — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Prova (2010)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2010/2010_PV_reaplicacao_PPL_D2_CD8.pdf",
          "tipo": "prova",
          "dia": 2,
          "aplicacao": "PPL / 2ª Aplicação",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        }
      ],
      "gabaritos": [
        {
          "label": "ENEM 2010 — 2º Dia Gabarito — Caderno 5 Amarelo",
          "shortLabel": "Caderno 5 Amarelo — Gabarito (2010)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2010/dia2_caderno5_amarelo_com_gab.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 5 Amarelo",
          "cor": "Amarelo"
        },
        {
          "label": "ENEM 2010 — 2º Dia Gabarito — Caderno 6 Cinza",
          "shortLabel": "Caderno 6 Cinza — Gabarito (2010)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2010/dia2_caderno6_cinza_com_gab.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 6 Cinza",
          "cor": "Cinza"
        },
        {
          "label": "ENEM 2010 — 2º Dia Gabarito — Caderno 7 Azul",
          "shortLabel": "Caderno 7 Azul — Gabarito (2010)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2010/dia2_caderno7_azul_com_gab.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 7 Azul",
          "cor": "Azul"
        },
        {
          "label": "ENEM 2010 — 2º Dia Gabarito — Caderno 8 Rosa",
          "shortLabel": "Caderno 8 Rosa — Gabarito (2010)",
          "url": "https://download.inep.gov.br/educacao_basica/enem/provas/2010/dia2_caderno8_rosa_com_gab.pdf",
          "tipo": "gabarito",
          "dia": 2,
          "aplicacao": "Regular",
          "caderno": "Caderno 8 Rosa",
          "cor": "Rosa"
        }
      ]
    },
    "observacao": "Aplicação Regular · Reaplicação / PPL (24 arquivos oficiais INEP)"
  }
];

export const getEnemYearItem = (year: number | string): EnemYearItem | undefined => {
  const y = typeof year === 'string' ? parseInt(year, 10) : year;
  return ENEM_ACERVO_TABLE.find(item => item.ano === y);
};
