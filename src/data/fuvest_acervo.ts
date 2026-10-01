export interface FuvestYearItem {
  ano: number;
  fase1: {
    versoes?: { label: string; url: string }[];
    provaUrl?: string;
    gabaritoUrl: string;
  };
  fase2: {
    dias?: { label: string; url: string }[];
    respostasEsperadasUrl?: string;
    materias?: { sigla: string; nome: string; url: string }[];
  };
}

export const FUVEST_ACERVO_TABLE: FuvestYearItem[] = [
  // 2026
  {
    ano: 2026,
    fase1: {
      versoes: [
        { label: 'V1', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase1-prova-V1.pdf' },
      ],
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2026_gabarito_primeira_fase.pdf'
    },
    fase2: {
      dias: [
        { label: 'Dia 1', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia1-prova.pdf' },
        { label: 'Dia 2', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-prova.pdf' },
      ],
      respostasEsperadasUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest_2026_guia_respostas.pdf'
    }
  },
  // 2025
  {
    ano: 2025,
    fase1: {
      versoes: [
        { label: 'V1', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2025_primeira_fase_prova_V1.pdf' },
      ],
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2025_gabarito_primeira_fase.pdf'
    },
    fase2: {
      dias: [
        { label: 'Dia 1', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2025_prova_2fase_dia1.pdf' },
        { label: 'Dia 2', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2025_prova_2fase_dia2.pdf' },
      ],
      respostasEsperadasUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest_2025_guia_respostas.pdf'
    }
  },
  // 2024
  {
    ano: 2024,
    fase1: {
      versoes: [
        { label: 'V', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2024_primeira_fase_prova_V.pdf' },
      ],
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2024_gabarito_primeira_fase_retificado_2023-11-24.pdf'
    },
    fase2: {
      dias: [
        { label: 'Dia 1', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2024_segunda_fase_prova_1dia.pdf' },
        { label: 'Dia 2', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2024_segunda_fase_prova_2dia.pdf' },
      ],
      respostasEsperadasUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest_2024_2024.01.22_RESPOSTAS_USP_Guia.pdf'
    }
  },
  // 2023
  {
    ano: 2023,
    fase1: {
      versoes: [
        { label: 'V', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2023_primeira_fase_prova_V.pdf' },
        { label: 'K', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2023_primeira_fase_prova_K.pdf' },
        { label: 'Q', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2023_primeira_fase_prova_Q.pdf' },
        { label: 'X', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2023_primeira_fase_prova_X.pdf' },
        { label: 'Z', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2023_primeira_fase_prova_Z.pdf' },
      ],
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2023_gabarito_primeira_fase.pdf'
    },
    fase2: {
      dias: [
        { label: 'Dia 1', url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2023_segunda_fase_dia_1.pdf' },
        { label: 'Dia 2', url: 'https://www.fuvest.br/wp-content/uploads/fuvest_2023_segunda_fase_dia_2.pdf' },
      ],
      respostasEsperadasUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2023_abordagens_esperadas_2fase.pdf'
    }
  },
  // 2022
  {
    ano: 2022,
    fase1: {
      versoes: [
        { label: 'V', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2022_primeira_fase_prova_V.pdf' },
        { label: 'K', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2022_primeira_fase_prova_K.pdf' },
        { label: 'Q', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2022_primeira_fase_prova_Q.pdf' },
        { label: 'X', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2022_primeira_fase_prova_X.pdf' },
        { label: 'Z', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2022_primeira_fase_prova_Z.pdf' },
      ],
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2022_gabarito_primeira_fase.pdf'
    },
    fase2: {
      dias: [
        { label: 'Dia 1', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2022_segunda_fase_prova_1dia.pdf' },
        { label: 'Dia 2', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2022_segunda_fase_prova_2dia.pdf' },
      ]
    }
  },
  // 2021
  {
    ano: 2021,
    fase1: {
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2021_primeira_fase_prova.pdf',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2021_gabarito_primeira_fase.pdf'
    },
    fase2: {
      dias: [
        { label: 'Dia 1', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2021_segunda_fase_prova_1dia.pdf' },
        { label: 'Dia 2', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2021_segunda_fase_prova_2dia.pdf' },
      ]
    }
  },
  // 2020
  {
    ano: 2020,
    fase1: {
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2020_primeira_fase_prova.pdf',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2020_gabarito_primeira_fase.pdf'
    },
    fase2: {
      dias: [
        { label: 'Dia 1', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2020_segunda_fase_prova_1dia.pdf' },
        { label: 'Dia 2', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2020_segunda_fase_prova_2dia.pdf' },
      ]
    }
  },
  // 2019
  {
    ano: 2019,
    fase1: {
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2019_primeira_fase_prova.pdf',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2019_gabarito_primeira_fase.pdf'
    },
    fase2: {
      dias: [
        { label: 'Dia 1', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2019_segunda_fase_prova_1dia.pdf' },
        { label: 'Dia 2', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2019_segunda_fase_prova_2dia.pdf' },
      ]
    }
  },
  // 2018
  {
    ano: 2018,
    fase1: {
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2018_primeira_fase_prova.pdf',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2018_gabarito_primeira_fase.pdf'
    },
    fase2: {
      dias: [
        { label: 'Dia 1', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2018_segunda_fase_prova_1dia.pdf' },
        { label: 'Dia 2', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2018_segunda_fase_prova_2dia.pdf' },
        { label: 'Dia 3', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2018_segunda_fase_prova_3dia.pdf' },
      ]
    }
  },
  // 2017
  {
    ano: 2017,
    fase1: {
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2017_primeira_fase_prova.pdf',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2017_gabarito_primeira_fase.pdf'
    },
    fase2: {
      dias: [
        { label: 'Dia 1', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2017_segunda_fase_prova_1dia.pdf' },
        { label: 'Dia 2', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2017_segunda_fase_prova_2dia.pdf' },
        { label: 'Dia 3', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2017_segunda_fase_prova_3dia.pdf' },
      ]
    }
  },
  // 2016
  {
    ano: 2016,
    fase1: {
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2016_primeira_fase_prova.pdf',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2016_gabarito_primeira_fase.pdf'
    },
    fase2: {
      dias: [
        { label: 'Dia 1', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2016_segunda_fase_prova_1dia.pdf' },
        { label: 'Dia 2', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2016_segunda_fase_prova_2dia.pdf' },
        { label: 'Dia 3', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2016_segunda_fase_prova_3dia.pdf' },
      ]
    }
  },
  // 2015
  {
    ano: 2015,
    fase1: {
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2015_primeira_fase_prova.pdf',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2015_gabarito_primeira_fase.pdf'
    },
    fase2: {
      dias: [
        { label: 'Dia 1', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2015_segunda_fase_prova_1dia.pdf' },
        { label: 'Dia 2', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2015_segunda_fase_prova_2dia.pdf' },
        { label: 'Dia 3', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2015_segunda_fase_prova_3dia.pdf' },
      ]
    }
  },
  // 2014
  {
    ano: 2014,
    fase1: {
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2014_primeira_fase_prova.pdf',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2014_gabarito_primeira_fase.pdf'
    },
    fase2: {
      dias: [
        { label: 'Dia 1', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2014_segunda_fase_prova_1dia.pdf' },
        { label: 'Dia 2', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2014_segunda_fase_prova_2dia.pdf' },
        { label: 'Dia 3', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2014_segunda_fase_prova_3dia.pdf' },
      ]
    }
  },
  // 2013
  {
    ano: 2013,
    fase1: {
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2013_primeira_fase_prova.pdf',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2013_gabarito_primeira_fase.pdf'
    },
    fase2: {
      dias: [
        { label: 'Dia 1', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2013_segunda_fase_prova_1dia.pdf' },
        { label: 'Dia 2', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2013_segunda_fase_prova_2dia.pdf' },
        { label: 'Dia 3', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2013_segunda_fase_prova_3dia.pdf' },
      ]
    }
  },
  // 2012
  {
    ano: 2012,
    fase1: {
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2012_primeira_fase_prova.pdf',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2012_gabarito_primeira_fase.pdf'
    },
    fase2: {
      dias: [
        { label: 'Dia 1', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2012_segunda_fase_prova_1dia.pdf' },
        { label: 'Dia 2', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2012_segunda_fase_prova_2dia.pdf' },
        { label: 'Dia 3', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2012_segunda_fase_prova_3dia.pdf' },
      ]
    }
  },
  // 2011
  {
    ano: 2011,
    fase1: {
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2011_primeira_fase_prova.pdf',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2011_gabarito_primeira_fase.pdf'
    },
    fase2: {
      dias: [
        { label: 'Dia 1', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2011_segunda_fase_prova_1dia.pdf' },
        { label: 'Dia 2', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2011_segunda_fase_prova_2dia.pdf' },
        { label: 'Dia 3', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2011_segunda_fase_prova_3dia.pdf' },
      ]
    }
  },
  // 2010
  {
    ano: 2010,
    fase1: {
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2010_primeira_fase_prova.pdf',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2010_gabarito_primeira_fase.pdf'
    },
    fase2: {
      dias: [
        { label: 'Dia 1', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2010_segunda_fase_prova_1dia.pdf' },
        { label: 'Dia 2', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2010_segunda_fase_prova_2dia.pdf' },
        { label: 'Dia 3', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2010_segunda_fase_prova_3dia.pdf' },
      ]
    }
  },
  // 2009
  {
    ano: 2009,
    fase1: {
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2009_primeira_fase_prova.pdf',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2009_gabarito_primeira_fase.pdf'
    },
    fase2: {
      materias: [
        { sigla: 'Bio', nome: 'Biologia', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2009_fase2_biologia.pdf' },
        { sigla: 'Fís', nome: 'Física', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2009_fase2_fisica.pdf' },
        { sigla: 'Geo', nome: 'Geografia', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2009_fase2_geografia.pdf' },
        { sigla: 'His', nome: 'História', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2009_fase2_historia.pdf' },
        { sigla: 'Mat', nome: 'Matemática', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2009_fase2_matematica.pdf' },
        { sigla: 'Por', nome: 'Português', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2009_fase2_portugues.pdf' },
        { sigla: 'Quí', nome: 'Química', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2009_fase2_quimica.pdf' },
      ]
    }
  },
  // 2008
  {
    ano: 2008,
    fase1: {
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2008_primeira_fase_prova.pdf',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2008_gabarito_primeira_fase.pdf'
    },
    fase2: {
      materias: [
        { sigla: 'Bio', nome: 'Biologia', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2008_fase2_biologia.pdf' },
        { sigla: 'Fís', nome: 'Física', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2008_fase2_fisica.pdf' },
        { sigla: 'Geo', nome: 'Geografia', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2008_fase2_geografia.pdf' },
        { sigla: 'His', nome: 'História', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2008_fase2_historia.pdf' },
        { sigla: 'Mat', nome: 'Matemática', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2008_fase2_matematica.pdf' },
        { sigla: 'Por', nome: 'Português', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2008_fase2_portugues.pdf' },
        { sigla: 'Quí', nome: 'Química', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2008_fase2_quimica.pdf' },
      ]
    }
  },
  // 2007
  {
    ano: 2007,
    fase1: {
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2007_primeira_fase_prova.pdf',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2007_gabarito_primeira_fase.pdf'
    },
    fase2: {
      materias: [
        { sigla: 'Bio', nome: 'Biologia', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2007_fase2_biologia.pdf' },
        { sigla: 'Fís', nome: 'Física', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2007_fase2_fisica.pdf' },
        { sigla: 'Geo', nome: 'Geografia', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2007_fase2_geografia.pdf' },
        { sigla: 'His', nome: 'História', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2007_fase2_historia.pdf' },
        { sigla: 'Mat', nome: 'Matemática', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2007_fase2_matematica.pdf' },
        { sigla: 'Por', nome: 'Português', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2007_fase2_portugues.pdf' },
        { sigla: 'Quí', nome: 'Química', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2007_fase2_quimica.pdf' },
      ]
    }
  }
];

export const getFuvestYearItem = (year: number | string): FuvestYearItem | undefined => {
  const y = typeof year === 'string' ? parseInt(year, 10) : year;
  return FUVEST_ACERVO_TABLE.find(item => item.ano === y);
};
