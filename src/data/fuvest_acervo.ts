export interface FuvestYearItem {
  ano: number;
  rotulo?: string;
  paginaOficial?: string;
  fase1: {
    provaLabel: string;
    provaUrl: string;
    gabaritoLabel: string;
    gabaritoUrl: string;
    gabaritosAdicionais?: { label: string; url: string }[];
    cadernosAdicionais?: { label: string; url: string }[];
    resolucaoUrl?: string;
  };
  fase2: {
    dias: { label: string; url: string; resolucaoUrl?: string }[];
    gabaritos?: { label: string; url: string }[];
  };
  resolucaoObjetivoUrl?: string;
  observacao?: string;
}

export const FUVEST_ACERVO_TABLE: FuvestYearItem[] = [
  // 2027
  {
    ano: 2027,
    rotulo: 'FUVEST 2027',
    paginaOficial: 'https://www.fuvest.br/vestibular-da-usp/',
    fase1: {
      provaLabel: 'FUVEST 2027 — Prova 1ª Fase (V1)',
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2027-fase1-prova-V1.pdf',
      gabaritoLabel: 'FUVEST 2027 — Gabarito 1ª Fase (Retificado)',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2027-fase1-gabarito-retificado.pdf'
    },
    fase2: {
      dias: []
    },
    observacao: 'Edição mais recente FUVEST 2027 (1ª Fase e Gabarito Retificado)'
  },
  // 2026
  {
    ano: 2026,
    rotulo: 'FUVEST 2026',
    paginaOficial: 'https://www.fuvest.br/vestibular-da-usp/',
    fase1: {
      provaLabel: 'FUVEST 2026 — Prova 1ª Fase (V1)',
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase1-prova-V1.pdf',
      gabaritoLabel: 'FUVEST 2026 — Gabarito 1ª Fase',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase1-gabarito.pdf',
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2026_1fase.aspx',
      cadernosAdicionais: [
        { label: 'Caderno K1 (2026)', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase1-prova-K1.pdf' },
        { label: 'Caderno Q1 (2026)', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase1-prova-Q1.pdf' },
        { label: 'Caderno X1 (2026)', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase1-prova-X1.pdf' },
        { label: 'Caderno Z1 (2026)', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase1-prova-Z1.pdf' }
      ]
    },
    fase2: {
      dias: [
        {
          label: 'FUVEST 2026 — 2ª Fase Dia 1 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia1-prova.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2026_2fase_1dia.aspx'
        },
        {
          label: 'FUVEST 2026 — 2ª Fase Dia 2 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-prova.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2026_2fase_2dia.aspx'
        }
      ],
      gabaritos: [
        {
          label: 'FUVEST 2026 — 2ª Fase Dia 1 (Respostas Esperadas)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia1-respostas-esperadas.pdf'
        },
        {
          label: 'FUVEST 2026 — 2ª Fase Dia 1 (Abordagem Esperada — Redação)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia1-abordagem-esperada-redacao.pdf'
        },
        {
          label: 'FUVEST 2026 — 2ª Fase Dia 2 (Respostas — Matemática)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-respostas-esperadas-matematica.pdf'
        },
        {
          label: 'FUVEST 2026 — 2ª Fase Dia 2 (Respostas — Física)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-respostas-esperadas-fisica.pdf'
        },
        {
          label: 'FUVEST 2026 — 2ª Fase Dia 2 (Respostas — Química)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-respostas-esperadas-quimica.pdf'
        },
        {
          label: 'FUVEST 2026 — 2ª Fase Dia 2 (Respostas — Biologia)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-respostas-esperadas-biologia.pdf'
        },
        {
          label: 'FUVEST 2026 — 2ª Fase Dia 2 (Respostas — História)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-respostas-esperadas-historia.pdf'
        },
        {
          label: 'FUVEST 2026 — 2ª Fase Dia 2 (Respostas — Geografia)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-respostas-esperadas-geografia.pdf'
        }
      ]
    },
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest.aspx',
    observacao: 'Provas oficiais e respostas esperadas por disciplina (2ª Fase)'
  },
  // 2025
  {
    ano: 2025,
    rotulo: 'FUVEST 2025',
    paginaOficial: 'https://www.fuvest.br/vestibular-da-usp/',
    fase1: {
      provaLabel: 'FUVEST 2025 — Prova 1ª Fase (V1)',
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2025_primeira_fase_prova_V1.pdf',
      gabaritoLabel: 'FUVEST 2025 — Gabarito 1ª Fase',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2025_gabarito_primeira_fase.pdf',
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2025_1fase.aspx'
    },
    fase2: {
      dias: [
        {
          label: 'FUVEST 2025 — 2ª Fase Dia 1 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest2025_prova_2fase_dia1.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2025_2fase_1dia.aspx'
        },
        {
          label: 'FUVEST 2025 — 2ª Fase Dia 2 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest2025_prova_2fase_dia2.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2025_2fase_2dia.aspx'
        }
      ],
      gabaritos: [
        {
          label: 'FUVEST 2025 — 2ª Fase (Guia de Respostas)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2025_guia_respostas.pdf'
        }
      ]
    },
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2025_1fase.aspx'
  },
  // 2024
  {
    ano: 2024,
    rotulo: 'FUVEST 2024',
    paginaOficial: 'https://www.fuvest.br/vestibular-da-usp/',
    fase1: {
      provaLabel: 'FUVEST 2024 — Prova 1ª Fase (V)',
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2024_primeira_fase_prova_V.pdf',
      gabaritoLabel: 'FUVEST 2024 — Gabarito 1ª Fase (Retificado)',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2024_gabarito_primeira_fase_retificado_2023-11-24.pdf',
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2024_1fase.aspx'
    },
    fase2: {
      dias: [
        {
          label: 'FUVEST 2024 — 2ª Fase Dia 1 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest2024_segunda_fase_prova_1dia.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2024_2fase_1dia.aspx'
        },
        {
          label: 'FUVEST 2024 — 2ª Fase Dia 2 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest2024_segunda_fase_prova_2dia.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2024_2fase_2dia.aspx'
        }
      ],
      gabaritos: [
        {
          label: 'FUVEST 2024 — 2ª Fase (Guia de Respostas)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2024_2024.01.22_RESPOSTAS_USP_Guia.pdf'
        }
      ]
    },
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2024_1fase.aspx'
  },
  // 2023
  {
    ano: 2023,
    rotulo: 'FUVEST 2023',
    paginaOficial: 'https://www.fuvest.br/vestibular-da-usp/',
    fase1: {
      provaLabel: 'FUVEST 2023 — Prova 1ª Fase (V)',
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2023_primeira_fase_prova_V.pdf',
      gabaritoLabel: 'FUVEST 2023 — Gabarito 1ª Fase',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2023_gabarito_primeira_fase.pdf',
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2023_1fase.aspx'
    },
    fase2: {
      dias: [
        {
          label: 'FUVEST 2023 — 2ª Fase Dia 1 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2023_segunda_fase_dia_1.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2023_2fase_1dia.aspx'
        },
        {
          label: 'FUVEST 2023 — 2ª Fase Dia 2 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2023_segunda_fase_dia_2.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2023_2fase_2dia.aspx'
        }
      ],
      gabaritos: [
        {
          label: 'FUVEST 2023 — 2ª Fase (Abordagens Esperadas)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest2023_abordagens_esperadas_2fase.pdf'
        }
      ]
    },
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2023_1fase.aspx'
  },
  // 2022
  {
    ano: 2022,
    rotulo: 'FUVEST 2022',
    paginaOficial: 'https://www.fuvest.br/vestibular-da-usp/',
    fase1: {
      provaLabel: 'FUVEST 2022 — Prova 1ª Fase (V)',
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest_2022_primeira_fase_tipo_V.pdf',
      gabaritoLabel: 'FUVEST 2022 — Gabarito 1ª Fase (Retificado)',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest_2022_primeira_fase_gabarito_retificado.pdf',
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2022_1fase.aspx'
    },
    fase2: {
      dias: [
        {
          label: 'FUVEST 2022 — 2ª Fase Dia 1 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2022_segunda_fase_dia_1.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2022_2fase_1dia.aspx'
        },
        {
          label: 'FUVEST 2022 — 2ª Fase Dia 2 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2022_segunda_fase_dia_2.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2022_2fase_2dia.aspx'
        }
      ]
    },
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2022_1fase.aspx'
  },
  // 2021
  {
    ano: 2021,
    rotulo: 'FUVEST 2021',
    paginaOficial: 'https://www.fuvest.br/vestibular-da-usp/',
    fase1: {
      provaLabel: 'FUVEST 2021 — Prova 1ª Fase',
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest_2021_primeira_fase.pdf',
      gabaritoLabel: 'FUVEST 2021 — Gabarito 1ª Fase (v2)',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest_2021_primeira_fase_gabarito_v2.pdf',
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2021_1fase.aspx'
    },
    fase2: {
      dias: [
        {
          label: 'FUVEST 2021 — 2ª Fase Dia 1 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuv2021_2fase_dia_1.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2021_2fase_1dia.aspx'
        },
        {
          label: 'FUVEST 2021 — 2ª Fase Dia 2 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuv2021_2fase_dia_2.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2021_2fase_2dia.aspx'
        }
      ]
    },
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2021_1fase.aspx'
  },
  // 2020
  {
    ano: 2020,
    rotulo: 'FUVEST 2020',
    paginaOficial: 'https://www.fuvest.br/vestibular-da-usp/',
    fase1: {
      provaLabel: 'FUVEST 2020 — Prova 1ª Fase (V)',
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest_2020_primeira_fase_prova_V.pdf',
      gabaritoLabel: 'FUVEST 2020 — Gabarito 1ª Fase',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest_2020_primeira_fase_gabaritos.pdf',
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2020_1fase.aspx'
    },
    fase2: {
      dias: [
        {
          label: 'FUVEST 2020 — 2ª Fase Dia 1 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuv2020_2fase_dia_1.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2020_2fase_1dia.aspx'
        },
        {
          label: 'FUVEST 2020 — 2ª Fase Dia 2 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuv2020_2fase_dia_2.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2020_2fase_2dia.aspx'
        }
      ]
    },
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2020_1fase.aspx'
  },
  // 2019
  {
    ano: 2019,
    rotulo: 'FUVEST 2019',
    paginaOficial: 'https://www.fuvest.br/vestibular-da-usp/',
    fase1: {
      provaLabel: 'FUVEST 2019 — Prova 1ª Fase',
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest_2019_primeira_fase.pdf',
      gabaritoLabel: 'FUVEST 2019 — Gabarito Oficial 1ª Fase',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuv2019.gabarito.oficial.pdf',
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2019_1fase.aspx'
    },
    fase2: {
      dias: [
        {
          label: 'FUVEST 2019 — 2ª Fase Dia 1 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuv2019_2fase_dia1.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2019_2fase_1dia.aspx'
        },
        {
          label: 'FUVEST 2019 — 2ª Fase Dia 2 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuv2019_2fase_dia2.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2019_2fase_2dia.aspx'
        }
      ]
    },
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2019_1fase.aspx',
    observacao: 'Primeiro ano com 2ª fase em 2 dias (redução de 3 para 2 dias)'
  },
  // 2018
  {
    ano: 2018,
    rotulo: 'FUVEST 2018',
    paginaOficial: 'https://www.fuvest.br/vestibular-da-usp/',
    fase1: {
      provaLabel: 'FUVEST 2018 — Prova 1ª Fase (V)',
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuv2018_1fase_prova_V.pdf',
      gabaritoLabel: 'FUVEST 2018 — Gabarito 1ª Fase',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuv2018_1fase_prova_gab.pdf',
      gabaritosAdicionais: [
        {
          label: 'FUVEST 2018 — Gabarito 1ª Fase (Corrigido)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuv2018_1fase_prova_gab_cor.pdf'
        }
      ],
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2018_1fase.aspx'
    },
    fase2: {
      dias: [
        {
          label: 'FUVEST 2018 — 2ª Fase Dia 1 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuv2018_2fase_dia1.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2018_2fase_1dia.aspx'
        },
        {
          label: 'FUVEST 2018 — 2ª Fase Dia 2 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuv2018_2fase_dia2.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2018_2fase_2dia.aspx'
        },
        {
          label: 'FUVEST 2018 — 2ª Fase Dia 3 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuv2018_2fase_dia3.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2018_2fase_3dia.aspx'
        }
      ]
    },
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2018_1fase.aspx',
    observacao: '2ª fase realizada em 3 dias'
  },
  // 2017
  {
    ano: 2017,
    rotulo: 'FUVEST 2017',
    paginaOficial: 'https://www.fuvest.br/vestibular-da-usp/',
    fase1: {
      provaLabel: 'FUVEST 2017 — Prova 1ª Fase (V)',
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest_2017_1fase_prova_V.pdf',
      gabaritoLabel: 'FUVEST 2017 — Gabarito 1ª Fase',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest_2017_1fase_prova_gab.pdf',
      gabaritosAdicionais: [
        {
          label: 'FUVEST 2017 — Gabarito 1ª Fase (Corrigido)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2017_1fase_prova_gab_cor.pdf'
        }
      ],
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2017_1fase.aspx'
    },
    fase2: {
      dias: [
        {
          label: 'FUVEST 2017 — 2ª Fase Dia 1 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2017_2fase_dia1.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2017_2fase_1dia.aspx'
        },
        {
          label: 'FUVEST 2017 — 2ª Fase Dia 2 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2017_2fase_dia2.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2017_2fase_2dia.aspx'
        },
        {
          label: 'FUVEST 2017 — 2ª Fase Dia 3 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2017_2fase_dia3.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2017_2fase_3dia.aspx'
        }
      ]
    },
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2017_1fase.aspx'
  },
  // 2016
  {
    ano: 2016,
    rotulo: 'FUVEST 2016',
    paginaOficial: 'https://www.fuvest.br/vestibular-da-usp/',
    fase1: {
      provaLabel: 'FUVEST 2016 — Prova 1ª Fase (V)',
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest_2016_1fase_prova_V.pdf',
      gabaritoLabel: 'FUVEST 2016 — Gabarito 1ª Fase',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest_2016_1fase_prova_gab.pdf',
      gabaritosAdicionais: [
        {
          label: 'FUVEST 2016 — Gabarito 1ª Fase (Corrigido)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2016_1fase_prova_gab_cor.pdf'
        }
      ],
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2016_1fase.aspx'
    },
    fase2: {
      dias: [
        {
          label: 'FUVEST 2016 — 2ª Fase Dia 1 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2016_2fase_dia1.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2016_2fase_1dia.aspx'
        },
        {
          label: 'FUVEST 2016 — 2ª Fase Dia 2 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2016_2fase_dia2.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2016_2fase_2dia.aspx'
        },
        {
          label: 'FUVEST 2016 — 2ª Fase Dia 3 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2016_2fase_dia3.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2016_2fase_3dia.aspx'
        }
      ]
    },
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2016_1fase.aspx'
  },
  // 2015
  {
    ano: 2015,
    rotulo: 'FUVEST 2015',
    paginaOficial: 'https://www.fuvest.br/vestibular-da-usp/',
    fase1: {
      provaLabel: 'FUVEST 2015 — Prova 1ª Fase (V)',
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest_2015_1fase_prova_V.pdf',
      gabaritoLabel: 'FUVEST 2015 — Gabarito 1ª Fase',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest_2015_1fase_prova_gab.pdf',
      gabaritosAdicionais: [
        {
          label: 'FUVEST 2015 — Gabarito 1ª Fase (Corrigido)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2015_1fase_prova_gab_cor.pdf'
        }
      ],
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2015_1fase.aspx'
    },
    fase2: {
      dias: [
        {
          label: 'FUVEST 2015 — 2ª Fase Dia 1 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2015_2fase_dia1.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2015_2fase_1dia.aspx'
        },
        {
          label: 'FUVEST 2015 — 2ª Fase Dia 2 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2015_2fase_dia2.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2015_2fase_2dia.aspx'
        },
        {
          label: 'FUVEST 2015 — 2ª Fase Dia 3 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2015_2fase_dia3.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2015_2fase_3dia.aspx'
        }
      ]
    },
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2015_1fase.aspx'
  },
  // 2014
  {
    ano: 2014,
    rotulo: 'FUVEST 2014',
    paginaOficial: 'https://www.fuvest.br/vestibular-da-usp/',
    fase1: {
      provaLabel: 'FUVEST 2014 — Prova 1ª Fase (V)',
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest_2014_1fase_prova_V.pdf',
      gabaritoLabel: 'FUVEST 2014 — Gabarito 1ª Fase',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest_2014_1fase_prova_gab.pdf',
      gabaritosAdicionais: [
        {
          label: 'FUVEST 2014 — Gabarito 1ª Fase (Corrigido)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2014_1fase_prova_gab_cor.pdf'
        }
      ],
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2014_1fase.aspx'
    },
    fase2: {
      dias: [
        {
          label: 'FUVEST 2014 — 2ª Fase Dia 1 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2014_2fase_dia1.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2014_2fase_1dia.aspx'
        },
        {
          label: 'FUVEST 2014 — 2ª Fase Dia 2 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2014_2fase_dia2.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2014_2fase_2dia.aspx'
        },
        {
          label: 'FUVEST 2014 — 2ª Fase Dia 3 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2014_2fase_dia3.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2014_2fase_3dia.aspx'
        }
      ]
    },
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2014_1fase.aspx'
  },
  // 2013
  {
    ano: 2013,
    rotulo: 'FUVEST 2013',
    paginaOficial: 'https://www.fuvest.br/vestibular-da-usp/',
    fase1: {
      provaLabel: 'FUVEST 2013 — Prova 1ª Fase (V)',
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest_2013_1fase_prova_V.pdf',
      gabaritoLabel: 'FUVEST 2013 — Gabarito 1ª Fase',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest_2013_1fase_prova_gab.pdf',
      gabaritosAdicionais: [
        {
          label: 'FUVEST 2013 — Gabarito 1ª Fase (Corrigido)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2013_1fase_prova_gab_cor.pdf'
        }
      ],
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2013_1fase.aspx'
    },
    fase2: {
      dias: [
        {
          label: 'FUVEST 2013 — 2ª Fase Dia 1 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2013_2fase_dia1.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2013_2fase_1dia.aspx'
        },
        {
          label: 'FUVEST 2013 — 2ª Fase Dia 2 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2013_2fase_dia2.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2013_2fase_2dia.aspx'
        },
        {
          label: 'FUVEST 2013 — 2ª Fase Dia 3 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2013_2fase_dia3.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2013_2fase_3dia.aspx'
        }
      ]
    },
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2013_1fase.aspx'
  },
  // 2012
  {
    ano: 2012,
    rotulo: 'FUVEST 2012',
    paginaOficial: 'https://www.fuvest.br/vestibular-da-usp/',
    fase1: {
      provaLabel: 'FUVEST 2012 — Prova 1ª Fase (V)',
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest_2012_1fase_prova_V.pdf',
      gabaritoLabel: 'FUVEST 2012 — Gabarito 1ª Fase',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest_2012_1fase_prova_gab.pdf',
      gabaritosAdicionais: [
        {
          label: 'FUVEST 2012 — Gabarito 1ª Fase (Corrigido)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2012_1fase_prova_gab_cor.pdf'
        }
      ],
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2012_1fase.aspx'
    },
    fase2: {
      dias: [
        {
          label: 'FUVEST 2012 — 2ª Fase Dia 1 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2012_2fase_dia1.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2012_2fase_1dia.aspx'
        },
        {
          label: 'FUVEST 2012 — 2ª Fase Dia 2 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2012_2fase_dia2.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2012_2fase_2dia.aspx'
        },
        {
          label: 'FUVEST 2012 — 2ª Fase Dia 3 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2012_2fase_dia3.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2012_2fase_3dia.aspx'
        }
      ]
    },
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2012_1fase.aspx'
  },
  // 2011
  {
    ano: 2011,
    rotulo: 'FUVEST 2011',
    paginaOficial: 'https://www.fuvest.br/vestibular-da-usp/',
    fase1: {
      provaLabel: 'FUVEST 2011 — Prova 1ª Fase (V)',
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest_2011_1fase_prova_V.pdf',
      gabaritoLabel: 'FUVEST 2011 — Gabarito 1ª Fase',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest_2011_1fase_prova_gab.pdf',
      gabaritosAdicionais: [
        {
          label: 'FUVEST 2011 — Gabarito 1ª Fase (Corrigido)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2011_1fase_prova_gab_cor.pdf'
        }
      ],
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2011_1fase.aspx'
    },
    fase2: {
      dias: [
        {
          label: 'FUVEST 2011 — 2ª Fase Dia 1 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2011_2fase_dia1.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2011_2fase_1dia.aspx'
        },
        {
          label: 'FUVEST 2011 — 2ª Fase Dia 2 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2011_2fase_dia2.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2011_2fase_2dia.aspx'
        },
        {
          label: 'FUVEST 2011 — 2ª Fase Dia 3 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2011_2fase_dia3.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2011_2fase_3dia.aspx'
        }
      ]
    },
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2011_1fase.aspx'
  },
  // 2010
  {
    ano: 2010,
    rotulo: 'FUVEST 2010',
    paginaOficial: 'https://www.fuvest.br/vestibular-da-usp/',
    fase1: {
      provaLabel: 'FUVEST 2010 — Prova 1ª Fase (V)',
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest_2010_1fase_prova_V.pdf',
      gabaritoLabel: 'FUVEST 2010 — Gabarito 1ª Fase',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest_2010_1fase_prova_gab.pdf',
      gabaritosAdicionais: [
        {
          label: 'FUVEST 2010 — Gabarito 1ª Fase (Corrigido)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2010_1fase_prova_gab_cor.pdf'
        }
      ],
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2010_1fase.aspx'
    },
    fase2: {
      dias: [
        {
          label: 'FUVEST 2010 — 2ª Fase Dia 1 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2010_2fase_dia1.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2010_2fase_1dia.aspx'
        },
        {
          label: 'FUVEST 2010 — 2ª Fase Dia 2 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2010_2fase_dia2.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2010_2fase_2dia.aspx'
        },
        {
          label: 'FUVEST 2010 — 2ª Fase Dia 3 (Prova)',
          url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2010_2fase_dia3.pdf',
          resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2010_2fase_3dia.aspx'
        }
      ]
    },
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2010_1fase.aspx'
  }
];

export const getFuvestYearItem = (year: number | string): FuvestYearItem | undefined => {
  const y = typeof year === 'string' ? parseInt(year, 10) : year;
  return FUVEST_ACERVO_TABLE.find(item => item.ano === y);
};
