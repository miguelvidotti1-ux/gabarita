export interface FuvestYearItem {
  ano: number;
  rotulo?: string;
  paginaOficial?: string;
  fase1: {
    provaLabel: string;
    provaUrl: string;
    gabaritoLabel: string;
    gabaritoUrl: string;
    cadernosAdicionais?: { label: string; url: string }[];
    resolucaoUrl?: string;
  };
  fase2: {
    dias: { label: string; url: string; resolucaoUrl?: string }[];
  };
  resolucaoObjetivoUrl?: string;
  observacao?: string;
}

export const FUVEST_ACERVO_TABLE: FuvestYearItem[] = [
  // 2026
  {
    ano: 2026,
    rotulo: 'FUVEST 2026',
    paginaOficial: 'https://www.fuvest.br/vestibular-da-usp/',
    fase1: {
      provaLabel: 'Prova 1ª Fase (Caderno V1)',
      provaUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase1-prova-V1.pdf',
      gabaritoLabel: 'Gabarito Oficial 1ª Fase',
      gabaritoUrl: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase1-gabarito.pdf',
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2026_1fase.aspx',
      cadernosAdicionais: [
        { label: 'Caderno K1', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase1-prova-K1.pdf' },
        { label: 'Caderno Q1', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase1-prova-Q1.pdf' },
        { label: 'Caderno X1', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase1-prova-X1.pdf' },
        { label: 'Caderno Z1', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase1-prova-Z1.pdf' }
      ]
    },
    fase2: {
      dias: [
        { label: 'Dia 1: Português e Redação', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia1.pdf', resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2026_2fase_1dia.aspx' },
        { label: 'Dia 2: Disciplinas Específicas', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2.pdf', resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2026_2fase_2dia.aspx' }
      ]
    },
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest.aspx',
    observacao: 'Edição mais recente FUVEST 2026 (Ingresso 2026)'
  },
  // 2025
  {
    ano: 2025,
    rotulo: 'FUVEST 2025',
    paginaOficial: 'https://www.fuvest.br/vestibular-da-usp/',
    fase1: {
      provaLabel: 'Prova 1ª Fase (Caderno V)',
      provaUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2025_1fase.aspx',
      gabaritoLabel: 'Gabarito Oficial 1ª Fase',
      gabaritoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2025_1fase.aspx',
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2025_1fase.aspx',
      cadernosAdicionais: [
        { label: 'Caderno K', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2025_1fase.aspx' },
        { label: 'Caderno Q', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2025_1fase.aspx' },
        { label: 'Caderno X', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2025_1fase.aspx' },
        { label: 'Caderno Z', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2025_1fase.aspx' }
      ]
    },
    fase2: {
      dias: [
        { label: 'Dia 1: Português e Redação', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2025_2fase_1dia.aspx', resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2025_2fase_1dia.aspx' },
        { label: 'Dia 2: Disciplinas Específicas', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2025_2fase_2dia.aspx', resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2025_2fase_2dia.aspx' }
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
      provaLabel: 'Prova 1ª Fase Oficial',
      provaUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2024_1fase.aspx',
      gabaritoLabel: 'Gabarito Oficial',
      gabaritoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2024_1fase.aspx',
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2024_1fase.aspx'
    },
    fase2: {
      dias: [
        { label: 'Dia 1: Português e Redação', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2024_2fase_1dia.aspx' },
        { label: 'Dia 2: Disciplinas Específicas', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2024_2fase_2dia.aspx' }
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
      provaLabel: 'Prova 1ª Fase Oficial',
      provaUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2023_1fase.aspx',
      gabaritoLabel: 'Gabarito Oficial',
      gabaritoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2023_1fase.aspx',
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2023_1fase.aspx'
    },
    fase2: {
      dias: [
        { label: 'Dia 1: Português e Redação', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2023_2fase_1dia.aspx' },
        { label: 'Dia 2: Disciplinas Específicas', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2023_2fase_2dia.aspx' }
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
      provaLabel: 'Prova 1ª Fase Oficial',
      provaUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2022_1fase.aspx',
      gabaritoLabel: 'Gabarito Oficial',
      gabaritoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2022_1fase.aspx',
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2022_1fase.aspx'
    },
    fase2: {
      dias: [
        { label: 'Dia 1: Português e Redação', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2022_2fase_1dia.aspx' },
        { label: 'Dia 2: Disciplinas Específicas', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2022_2fase_2dia.aspx' }
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
      provaLabel: 'Prova 1ª Fase Oficial',
      provaUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2021_1fase.aspx',
      gabaritoLabel: 'Gabarito Oficial',
      gabaritoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2021_1fase.aspx',
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2021_1fase.aspx'
    },
    fase2: {
      dias: [
        { label: 'Dia 1: Português e Redação', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2021_2fase_1dia.aspx' },
        { label: 'Dia 2: Disciplinas Específicas', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2021_2fase_2dia.aspx' }
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
      provaLabel: 'Prova 1ª Fase Oficial',
      provaUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2020_1fase.aspx',
      gabaritoLabel: 'Gabarito Oficial',
      gabaritoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2020_1fase.aspx',
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2020_1fase.aspx'
    },
    fase2: {
      dias: [
        { label: 'Dia 1: Português e Redação', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2020_2fase_1dia.aspx' },
        { label: 'Dia 2: Disciplinas Específicas', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2020_2fase_2dia.aspx' }
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
      provaLabel: 'Prova 1ª Fase Oficial',
      provaUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2019_1fase.aspx',
      gabaritoLabel: 'Gabarito Oficial',
      gabaritoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2019_1fase.aspx',
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2019_1fase.aspx'
    },
    fase2: {
      dias: [
        { label: 'Dia 1: Português e Redação', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2019_2fase_1dia.aspx' },
        { label: 'Dia 2: Disciplinas Específicas', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2019_2fase_2dia.aspx' }
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
      provaLabel: 'Prova 1ª Fase Oficial',
      provaUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2018_1fase.aspx',
      gabaritoLabel: 'Gabarito Oficial',
      gabaritoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2018_1fase.aspx',
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2018_1fase.aspx'
    },
    fase2: {
      dias: [
        { label: 'Dia 1: Português e Redação', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2018_2fase_1dia.aspx' },
        { label: 'Dia 2: Conhecimentos Gerais', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2018_2fase_2dia.aspx' },
        { label: 'Dia 3: Disciplinas Específicas', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2018_2fase_3dia.aspx' }
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
      provaLabel: 'Prova 1ª Fase Oficial',
      provaUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2017_1fase.aspx',
      gabaritoLabel: 'Gabarito Oficial',
      gabaritoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2017_1fase.aspx',
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2017_1fase.aspx'
    },
    fase2: {
      dias: [
        { label: 'Dia 1: Português e Redação', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2017_2fase_1dia.aspx' },
        { label: 'Dia 2: Conhecimentos Gerais', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2017_2fase_2dia.aspx' },
        { label: 'Dia 3: Disciplinas Específicas', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2017_2fase_3dia.aspx' }
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
      provaLabel: 'Prova 1ª Fase Oficial',
      provaUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2016_1fase.aspx',
      gabaritoLabel: 'Gabarito Oficial',
      gabaritoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2016_1fase.aspx',
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2016_1fase.aspx'
    },
    fase2: {
      dias: [
        { label: 'Dia 1: Português e Redação', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2016_2fase_1dia.aspx' },
        { label: 'Dia 2: Conhecimentos Gerais', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2016_2fase_2dia.aspx' },
        { label: 'Dia 3: Disciplinas Específicas', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2016_2fase_3dia.aspx' }
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
      provaLabel: 'Prova 1ª Fase Oficial',
      provaUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2015_1fase.aspx',
      gabaritoLabel: 'Gabarito Oficial',
      gabaritoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2015_1fase.aspx',
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2015_1fase.aspx'
    },
    fase2: {
      dias: [
        { label: 'Dia 1: Português e Redação', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2015_2fase_1dia.aspx' },
        { label: 'Dia 2: Conhecimentos Gerais', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2015_2fase_2dia.aspx' },
        { label: 'Dia 3: Disciplinas Específicas', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2015_2fase_3dia.aspx' }
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
      provaLabel: 'Prova 1ª Fase Oficial',
      provaUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2014_1fase.aspx',
      gabaritoLabel: 'Gabarito Oficial',
      gabaritoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2014_1fase.aspx',
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2014_1fase.aspx'
    },
    fase2: {
      dias: [
        { label: 'Dia 1: Português e Redação', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2014_2fase_1dia.aspx' },
        { label: 'Dia 2: Conhecimentos Gerais', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2014_2fase_2dia.aspx' },
        { label: 'Dia 3: Disciplinas Específicas', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2014_2fase_3dia.aspx' }
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
      provaLabel: 'Prova 1ª Fase Oficial',
      provaUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2013_1fase.aspx',
      gabaritoLabel: 'Gabarito Oficial',
      gabaritoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2013_1fase.aspx',
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2013_1fase.aspx'
    },
    fase2: {
      dias: [
        { label: 'Dia 1: Português e Redação', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2013_2fase_1dia.aspx' },
        { label: 'Dia 2: Conhecimentos Gerais', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2013_2fase_2dia.aspx' },
        { label: 'Dia 3: Disciplinas Específicas', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2013_2fase_3dia.aspx' }
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
      provaLabel: 'Prova 1ª Fase Oficial',
      provaUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2012_1fase.aspx',
      gabaritoLabel: 'Gabarito Oficial',
      gabaritoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2012_1fase.aspx',
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2012_1fase.aspx'
    },
    fase2: {
      dias: [
        { label: 'Dia 1: Português e Redação', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2012_2fase_1dia.aspx' },
        { label: 'Dia 2: Conhecimentos Gerais', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2012_2fase_2dia.aspx' },
        { label: 'Dia 3: Disciplinas Específicas', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2012_2fase_3dia.aspx' }
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
      provaLabel: 'Prova 1ª Fase Oficial',
      provaUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2011_1fase.aspx',
      gabaritoLabel: 'Gabarito Oficial',
      gabaritoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2011_1fase.aspx',
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2011_1fase.aspx'
    },
    fase2: {
      dias: [
        { label: 'Dia 1: Português e Redação', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2011_2fase_1dia.aspx' },
        { label: 'Dia 2: Conhecimentos Gerais', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2011_2fase_2dia.aspx' },
        { label: 'Dia 3: Disciplinas Específicas', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2011_2fase_3dia.aspx' }
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
      provaLabel: 'Prova 1ª Fase Oficial',
      provaUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2010_1fase.aspx',
      gabaritoLabel: 'Gabarito Oficial',
      gabaritoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2010_1fase.aspx',
      resolucaoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2010_1fase.aspx'
    },
    fase2: {
      dias: [
        { label: 'Dia 1: Português e Redação', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2010_2fase_1dia.aspx' },
        { label: 'Dia 2: Conhecimentos Gerais', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2010_2fase_2dia.aspx' },
        { label: 'Dia 3: Disciplinas Específicas', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2010_2fase_3dia.aspx' }
      ]
    },
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/fuvest2010_1fase.aspx'
  }
];

export const getFuvestYearItem = (year: number | string): FuvestYearItem | undefined => {
  const y = typeof year === 'string' ? parseInt(year, 10) : year;
  return FUVEST_ACERVO_TABLE.find(item => item.ano === y);
};
