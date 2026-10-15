export interface AcervoLinkItem {
  titulo: string;
  url: string;
  tipo: 'prova' | 'gabarito' | 'pacote_zip' | 'resolucao' | 'pagina_oficial';
  destaque?: boolean;
}

export interface UnespEdicao {
  ano: number;
  rotulo: string;
  fase1ProvaUrl?: string;
  fase1GabaritoUrl?: string;
  fase2ProvaUrl?: string;
  fase2GabaritoUrl?: string;
  pacoteZipUrl?: string;
  resolucaoObjetivoUrl?: string;
  observacao?: string;
}

export interface UerjEdicao {
  ano: number;
  rotulo: string;
  eq1ProvaUrl?: string;
  eq1GabaritoUrl?: string;
  eq2ProvaUrl?: string;
  eq2GabaritoUrl?: string;
  discursivaProvaUrl?: string;
  padroesRespostaUrl?: string;
  paginaOficialUrl: string;
  observacao?: string;
}

export interface UnifespEdicao {
  ano: number;
  rotulo: string;
  cadernoMistoUrl?: string;
  gabaritoUrl?: string;
  paginaOficialUrl: string;
  resolucaoObjetivoUrl?: string;
  observacao?: string;
}

export interface MackenzieEdicao {
  semestre: string;
  campusOuCurso: string;
  dataRealizacao: string;
  provaUrl: string;
  gabaritoUrl: string;
  portalOficialUrl: string;
}

export interface FgvEdicao {
  edicao: string;
  cursoOuUnidade: string;
  pacoteZipUrl: string;
  conteudoPacote: string;
  portalOficialUrl: string;
}

// ===== UNESP (VUNESP) ACERVO 2007–2026 =====
export const UNESP_ACERVO_TABLE: UnespEdicao[] = [
  {
    ano: 2026,
    rotulo: 'Vestibular UNESP 2026',
    pacoteZipUrl: 'https://vestibular.brasilescola.uol.com.br/baixar/47786',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unesp.aspx',
    observacao: 'Pacote completo oficial com cadernos de provas e gabaritos definitivos (ZIP).'
  },
  {
    ano: 2025,
    rotulo: 'Vestibular UNESP 2025 (2ª Fase Conhec. Específicos & Redação)',
    fase1ProvaUrl: 'https://vestibular.brasilescola.uol.com.br/baixar/47686',
    fase2ProvaUrl: 'https://vestibular.brasilescola.uol.com.br/baixar/47687',
    fase2GabaritoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unesp.aspx',
    pacoteZipUrl: 'https://vestibular.brasilescola.uol.com.br/baixar/47687',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unesp.aspx',
    observacao: 'Caderno 2ª fase completo (Questões 1 a 36), Proposta de Redação "Medicalização da vida: a quem interessa?" e Resolução comentada Objetivo.'
  },
  {
    ano: 2025,
    rotulo: 'Vestibular Meio do Ano 2025',
    pacoteZipUrl: 'https://vestibular.brasilescola.uol.com.br/baixar/47738',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unesp.aspx',
    observacao: 'Exame de meio de ano VUNESP (ZIP completo).'
  },
  {
    ano: 2024,
    rotulo: 'Vestibular UNESP 2024/2',
    pacoteZipUrl: 'https://vestibular.brasilescola.uol.com.br/baixar/47657',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unesp.aspx',
    observacao: 'Processo seletivo de meio de ano (ZIP).'
  },
  {
    ano: 2024,
    rotulo: 'Vestibular UNESP 2024',
    pacoteZipUrl: 'https://vestibular.brasilescola.uol.com.br/baixar/47619',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unesp.aspx',
    observacao: 'Pacote completo 1ª e 2ª fase com gabarito VUNESP (RAR).'
  },
  {
    ano: 2023,
    rotulo: 'Vestibular UNESP 2023',
    fase1ProvaUrl: 'https://guiadoestudante.abril.com.br/wp-content/uploads/sites/4/2023/11/prova-unesp-2023.pdf',
    fase1GabaritoUrl: 'https://guiadoestudante.abril.com.br/wp-content/uploads/sites/4/2023/11/gabarito-unesp-2023.pdf',
    fase2ProvaUrl: 'https://guiadoestudante.abril.com.br/wp-content/uploads/sites/4/2023/11/prova-segunda-fase-unesp-2023.pdf',
    pacoteZipUrl: 'https://vestibular.brasilescola.uol.com.br/baixar/47559',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unesp.aspx',
    observacao: 'PDFs diretos oficiais de 1ª e 2ª fase e gabarito VUNESP.'
  },
  {
    ano: 2022,
    rotulo: 'Vestibular UNESP 2022',
    fase1ProvaUrl: 'https://vestibular.unesp.br/portal#!/Home/documentos/provafase1_biologicas.pdf',
    fase1GabaritoUrl: 'https://vestibular.unesp.br/Home/documentos/provafase1_biologicas_gabarito.pdf',
    pacoteZipUrl: 'https://vestibular.brasilescola.uol.com.br/baixar/47407',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unesp.aspx',
    observacao: 'Prova 1ª fase Biológicas oficial e Gabarito oficial VUNESP.'
  },
  {
    ano: 2021,
    rotulo: 'Vestibular UNESP 2021',
    fase2GabaritoUrl: 'https://vestibular.unesp.br/Home/2021/caderno_2afase_unesp2021_versao_1.pdf',
    pacoteZipUrl: 'https://vestibular.brasilescola.uol.com.br/baixar/47311',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unesp.aspx',
    observacao: 'Caderno 2ª fase Versão 1 (oficial VUNESP) e pacote completo.'
  },
  {
    ano: 2020,
    rotulo: 'Vestibular UNESP 2020 (1ª Fase Conhecimentos Gerais)',
    fase1ProvaUrl: 'https://vestibular.unesp.br/Home/2020/unesp_caderno_de_questoes_prova_de_conhecimentos_gerais_15_nov_2019__v1.pdf',
    fase1GabaritoUrl: 'https://vestibular.unesp.br/Home/2020/unesp_gabarito_prova_de_conhecimentos_gerais_15_nov_2019__v1.pdf',
    fase2ProvaUrl: 'https://vestibular.unesp.br/Home/unesp-2a-fase-2020-caderno-linguagens.pdf',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unesp.aspx',
    observacao: 'Caderno de Conhecimentos Gerais (todas as 90 questões objetivas oficiais) e Gabarito oficial VUNESP.'
  },
  {
    ano: 2019,
    rotulo: 'Vestibular UNESP 2019',
    fase1ProvaUrl: 'https://vestibular.unesp.br/Home/2019/caderno-cg-1a-fase-versao-1-2019.pdf',
    fase1GabaritoUrl: 'https://vestibular.unesp.br/Home/2019/gabarito-cg-1a-fase-versao-1-2019.pdf',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unesp.aspx',
    observacao: 'Caderno CG 1ª fase Versão 1 e Gabarito oficial VUNESP.'
  },
  {
    ano: 2018,
    rotulo: 'Vestibular UNESP 2018',
    fase1ProvaUrl: 'https://network.grupoabril.com.br/wp-content/uploads/sites/4/2017/11/prova-unesp.pdf',
    fase1GabaritoUrl: 'https://network.grupoabril.com.br/wp-content/uploads/sites/4/2017/11/unesp-gabarito1.pdf',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unesp.aspx',
    observacao: 'Prova 1ª fase e Gabarito oficial 1.'
  },
  {
    ano: 2016,
    rotulo: 'Vestibular UNESP 2016',
    fase1ProvaUrl: 'https://network.grupoabril.com.br/wp-content/uploads/sites/4/2017/10/unesp2016-1fase.pdf',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unesp.aspx',
    observacao: 'Prova 1ª fase (PDF oficial preservado).'
  },
  {
    ano: 2015,
    rotulo: 'Vestibular UNESP 2015',
    fase1ProvaUrl: 'https://network.grupoabril.com.br/wp-content/uploads/sites/4/2017/10/unesp2015-1fase.pdf',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unesp.aspx',
    observacao: 'Prova 1ª fase (PDF oficial preservado).'
  },
  {
    ano: 2014,
    rotulo: 'Vestibular UNESP 2014',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unesp.aspx',
    observacao: 'Resoluções comentadas completas e acervo histórico VUNESP por edital.'
  },
  {
    ano: 2013,
    rotulo: 'Vestibular UNESP 2013',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unesp.aspx',
    observacao: 'Resoluções comentadas completas Objetivo e portal VUNESP.'
  },
  {
    ano: 2012,
    rotulo: 'Vestibular UNESP 2012',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unesp.aspx',
    observacao: 'Resoluções comentadas completas Objetivo e portal VUNESP.'
  },
  {
    ano: 2011,
    rotulo: 'Vestibular UNESP 2011',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unesp.aspx',
    observacao: 'Resoluções comentadas completas Objetivo e portal VUNESP.'
  },
  {
    ano: 2010,
    rotulo: 'Vestibular UNESP 2010',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unesp.aspx',
    observacao: 'Resoluções comentadas completas Objetivo e portal VUNESP.'
  },
  {
    ano: 2009,
    rotulo: 'Vestibular UNESP 2009',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unesp.aspx',
    observacao: 'Resoluções comentadas completas Objetivo e portal VUNESP.'
  },
  {
    ano: 2008,
    rotulo: 'Vestibular UNESP 2008',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unesp.aspx',
    observacao: 'Resoluções comentadas completas Objetivo e portal VUNESP.'
  },
  {
    ano: 2007,
    rotulo: 'Vestibular UNESP 2007',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unesp.aspx',
    observacao: 'Resoluções comentadas completas Objetivo e portal VUNESP.'
  }
];

// ===== UERJ VESTIBULAR ESTADUAL 2007–2026 =====
export const UERJ_ACERVO_TABLE: UerjEdicao[] = [
  {
    ano: 2026,
    rotulo: 'Vestibular Estadual UERJ 2026',
    eq2ProvaUrl: 'https://www.vestibular.uerj.br/?page_id=15994',
    padroesRespostaUrl: 'https://www.vestibular.uerj.br/?page_id=16334',
    paginaOficialUrl: 'https://www.vestibular.uerj.br/?page_id=15994',
    observacao: '2º Exame de Qualificação e Padrões de Resposta oficiais DSEA.'
  },
  {
    ano: 2025,
    rotulo: 'Vestibular Estadual UERJ 2025',
    eq1ProvaUrl: 'https://www.vestibular.uerj.br/?page_id=14486',
    eq2ProvaUrl: 'https://www.vestibular.uerj.br/?page_id=14817',
    padroesRespostaUrl: 'https://www.vestibular.uerj.br/?page_id=15203',
    paginaOficialUrl: 'https://www.vestibular.uerj.br/?page_id=14486',
    observacao: '1º EQ, 2º EQ e Caderno de Padrões de Resposta oficiais.'
  },
  {
    ano: 2024,
    rotulo: 'Vestibular Estadual UERJ 2024',
    eq1ProvaUrl: 'https://www.vestibular.uerj.br/?page_id=13475',
    eq2ProvaUrl: 'https://www.vestibular.uerj.br/?page_id=13774',
    padroesRespostaUrl: 'https://www.vestibular.uerj.br/?page_id=13975',
    paginaOficialUrl: 'https://www.vestibular.uerj.br/?page_id=13475',
    observacao: '1º e 2º Exames de Qualificação e Padrões de Resposta DSEA.'
  },
  {
    ano: 2023,
    rotulo: 'Vestibular Estadual UERJ 2023',
    eq1ProvaUrl: 'https://www.vestibular.uerj.br/anexos/233/prova_vetibular_2023.pdf',
    eq1GabaritoUrl: 'https://www.vestibular.uerj.br/anexos/233/gabarito_vestibular_2023_retificado.pdf',
    paginaOficialUrl: 'https://www.vestibular.uerj.br/?page_id=12911',
    observacao: 'Prova completa oficial e Gabarito Oficial Retificado (PDFs diretos).'
  },
  {
    ano: 2022,
    rotulo: 'Vestibular Estadual UERJ 2022',
    eq1ProvaUrl: 'https://www.vestibular.uerj.br/?page_id=12028',
    paginaOficialUrl: 'https://www.vestibular.uerj.br/?page_id=12028',
    observacao: 'Prova e Gabarito oficiais do Vestibular Estadual 2022.'
  },
  {
    ano: 2021,
    rotulo: 'Vestibular Estadual UERJ 2021',
    eq1ProvaUrl: 'https://www.vestibular.uerj.br/?page_id=11072',
    paginaOficialUrl: 'https://www.vestibular.uerj.br/?page_id=11072',
    observacao: 'Edição adaptada pós-pandemia com provas e gabarito oficial.'
  },
  {
    ano: 2020,
    rotulo: 'Vestibular Estadual UERJ 2020',
    eq1ProvaUrl: 'https://www.vestibular.uerj.br/?page_id=7641',
    eq2ProvaUrl: 'https://www.vestibular.uerj.br/?page_id=7763',
    padroesRespostaUrl: 'https://www.vestibular.uerj.br/?page_id=9245',
    paginaOficialUrl: 'https://www.vestibular.uerj.br/?page_id=7641',
    observacao: '1º e 2º EQ e Padrões de Resposta do Exame Discursivo.'
  },
  {
    ano: 2019,
    rotulo: 'Vestibular Estadual UERJ 2019',
    eq1ProvaUrl: 'https://www.vestibular.uerj.br/?page_id=6445',
    eq2ProvaUrl: 'https://www.vestibular.uerj.br/?page_id=6700',
    paginaOficialUrl: 'https://www.vestibular.uerj.br/?page_id=6445',
    observacao: 'Provas e Gabaritos oficiais 1º e 2º EQ DSEA.'
  },
  {
    ano: 2018,
    rotulo: 'Vestibular Estadual UERJ 2018',
    paginaOficialUrl: 'https://www.vestibular.uerj.br/?page_id=7069',
    observacao: 'Provas e gabaritos históricos DSEA por disciplina.'
  },
  {
    ano: 2017,
    rotulo: 'Vestibular Estadual UERJ 2017',
    paginaOficialUrl: 'https://www.vestibular.uerj.br/?page_id=7069',
    observacao: 'Provas e gabaritos históricos DSEA por disciplina.'
  },
  {
    ano: 2016,
    rotulo: 'Vestibular Estadual UERJ 2016',
    paginaOficialUrl: 'https://www.vestibular.uerj.br/?page_id=7069',
    observacao: 'Provas e gabaritos históricos DSEA por disciplina.'
  },
  {
    ano: 2015,
    rotulo: 'Vestibular Estadual UERJ 2015',
    paginaOficialUrl: 'https://www.vestibular.uerj.br/?page_id=7069',
    observacao: 'Provas e gabaritos históricos DSEA por disciplina.'
  },
  {
    ano: 2014,
    rotulo: 'Vestibular Estadual UERJ 2014',
    paginaOficialUrl: 'https://www.vestibular.uerj.br/?page_id=7069',
    observacao: 'Provas e gabaritos históricos DSEA por disciplina.'
  },
  {
    ano: 2013,
    rotulo: 'Vestibular Estadual UERJ 2013',
    paginaOficialUrl: 'https://www.vestibular.uerj.br/?page_id=7069',
    observacao: 'Provas e gabaritos históricos DSEA por disciplina.'
  },
  {
    ano: 2012,
    rotulo: 'Vestibular Estadual UERJ 2012',
    paginaOficialUrl: 'https://www.vestibular.uerj.br/?page_id=7069',
    observacao: 'Provas e gabaritos históricos DSEA por disciplina.'
  },
  {
    ano: 2011,
    rotulo: 'Vestibular Estadual UERJ 2011',
    eq1ProvaUrl: 'https://sistema.vestibular.uerj.br/portal_vestibular_uerj/2011/exame_de_qualificacao/',
    discursivaProvaUrl: 'https://sistema.vestibular.uerj.br/portal_vestibular_uerj/2011/exame_discursivo/',
    paginaOficialUrl: 'https://sistema.vestibular.uerj.br/portal_vestibular_uerj/2011/exame_de_qualificacao/',
    observacao: 'Portal DSE preservado com listagem de PDFs de Exame de Qualificação e Discursivo.'
  },
  {
    ano: 2010,
    rotulo: 'Vestibular Estadual UERJ 2010',
    eq1ProvaUrl: 'https://sistema.vestibular.uerj.br/portal_vestibular_uerj/2010/exame_de_qualificacao/eq_prova_e_gabarito.html',
    paginaOficialUrl: 'https://sistema.vestibular.uerj.br/portal_vestibular_uerj/2010/exame_de_qualificacao/eq_prova_e_gabarito.html',
    observacao: '1º Exame de Qualificação prova e gabarito oficial DSE.'
  },
  {
    ano: 2009,
    rotulo: 'Vestibular Estadual UERJ 2009',
    eq1ProvaUrl: 'https://sistema.vestibular.uerj.br/portal_vestibular_uerj/2009/exame_de_qualificacao/eq_prova_e_gabarito.html',
    paginaOficialUrl: 'https://sistema.vestibular.uerj.br/portal_vestibular_uerj/2009/exame_de_qualificacao/eq_prova_e_gabarito.html',
    observacao: '1º Exame de Qualificação prova e gabarito oficial DSE.'
  },
  {
    ano: 2008,
    rotulo: 'Vestibular Estadual UERJ 2008',
    eq1ProvaUrl: 'https://sistema.vestibular.uerj.br/portal_vestibular_uerj/2008/exame_de_qualificacao/eq_prova_e_gabarito.html',
    paginaOficialUrl: 'https://sistema.vestibular.uerj.br/portal_vestibular_uerj/2008/exame_de_qualificacao/eq_prova_e_gabarito.html',
    observacao: '1º Exame de Qualificação prova e gabarito oficial DSE.'
  },
  {
    ano: 2007,
    rotulo: 'Vestibular Estadual UERJ 2007',
    eq1ProvaUrl: 'https://sistema.vestibular.uerj.br/portal_vestibular_uerj/arquivos/arquivos2007/2007_1eq_1de3.pdf',
    paginaOficialUrl: 'https://sistema.vestibular.uerj.br/portal_vestibular_uerj/2007/exame_de_qualificacao/eq_prova_e_gabarito.html',
    observacao: '1º Exame de Qualificação prova + gabarito (PDF direto parte 1 de 3).'
  }
];

// ===== UNIFESP PROVAS E GABARITOS 2007–2025 =====
export const UNIFESP_ACERVO_TABLE: UnifespEdicao[] = [
  {
    ano: 2025,
    rotulo: 'Vestibular Misto UNIFESP 2025',
    gabaritoUrl: 'https://ingresso.unifesp.br/vestibulares-anteriores/84-2025.html?download=961:2025-gabarito-caderno-de-questes-verso-imprensa',
    paginaOficialUrl: 'https://ingresso.unifesp.br/vestibulares-anteriores/84-2025.html',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unifesp/unifesp2026.aspx',
    observacao: 'Gabarito Oficial + Caderno de questões (versão imprensa direta).'
  },
  {
    ano: 2024,
    rotulo: 'Vestibular Misto UNIFESP 2024',
    cadernoMistoUrl: 'https://ingresso.unifesp.br/vestibulares-anteriores/77-2024.html?download=828:2024-caderno-de-questes-misto',
    paginaOficialUrl: 'https://ingresso.unifesp.br/vestibulares-anteriores/77-2024.html',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unifesp/unifesp2026.aspx',
    observacao: 'Caderno de questões Misto oficial (download direto).'
  },
  {
    ano: 2023,
    rotulo: 'Vestibular Misto UNIFESP 2023',
    paginaOficialUrl: 'https://ingresso.unifesp.br/vestibulares-anteriores/65-2023.html',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unifesp/unifesp2026.aspx',
    observacao: 'Página oficial de download UNIFESP com cadernos e gabaritos.'
  },
  {
    ano: 2022,
    rotulo: 'Vestibular Misto UNIFESP 2022',
    paginaOficialUrl: 'https://ingresso.unifesp.br/vestibulares-anteriores/57-2022.html',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unifesp/unifesp2026.aspx',
    observacao: 'Página oficial com provas 1º e 2º dia e gabarito oficial.'
  },
  {
    ano: 2021,
    rotulo: 'Vestibular Misto UNIFESP 2021',
    paginaOficialUrl: 'https://ingresso.unifesp.br/vestibulares-anteriores/48-2021.html',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unifesp/unifesp2026.aspx',
    observacao: 'Vestibular misto adaptado com cadernos e gabarito.'
  },
  {
    ano: 2020,
    rotulo: 'Vestibular Misto UNIFESP 2020',
    paginaOficialUrl: 'https://ingresso.unifesp.br/vestibulares-anteriores/33-2020.html',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unifesp/unifesp2026.aspx',
    observacao: 'Página oficial de download com cadernos e gabaritos.'
  },
  {
    ano: 2019,
    rotulo: 'Vestibular Misto UNIFESP 2019',
    paginaOficialUrl: 'https://ingresso.unifesp.br/vestibulares-anteriores/21-2019.html',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unifesp/unifesp2026.aspx',
    observacao: 'Acervo oficial categoria 112 e portal de provas.'
  },
  {
    ano: 2018,
    rotulo: 'Vestibular Misto UNIFESP 2018',
    paginaOficialUrl: 'https://ingresso.unifesp.br/vestibulares-anteriores/9-2018/20-provas-e-gabaritos.html',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unifesp/unifesp2026.aspx',
    observacao: 'Cadernos de provas completos + gabaritos oficiais.'
  },
  {
    ano: 2017,
    rotulo: 'Vestibular Misto UNIFESP 2017',
    paginaOficialUrl: 'https://ingresso.unifesp.br/vestibulares-anteriores/4-2017.html',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unifesp/unifesp2026.aspx',
    observacao: 'Página oficial de download UNIFESP.'
  },
  {
    ano: 2016,
    rotulo: 'Vestibular Misto UNIFESP 2016',
    paginaOficialUrl: 'https://ingresso.unifesp.br/vestibulares-anteriores/2-2016/3-provas-e-gabaritos.html',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unifesp/unifesp2026.aspx',
    observacao: '1º e 2º dia de prova + gabarito oficial.'
  },
  {
    ano: 2015,
    rotulo: 'Vestibular UNIFESP 2015',
    paginaOficialUrl: 'https://ingresso.unifesp.br/vestibulares-anteriores/category/68-provas-e-gabaritos',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unifesp/unifesp2026.aspx',
    observacao: 'Categoria 68 provas e gabaritos históricos.'
  },
  {
    ano: 2013,
    rotulo: 'Vestibular UNIFESP 2013',
    paginaOficialUrl: 'https://ingresso.unifesp.br/vestibulares-anteriores/category/14-provas-e-gabaritos',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unifesp/unifesp2026.aspx',
    observacao: 'Categoria 14 provas e gabaritos históricos.'
  },
  {
    ano: 2012,
    rotulo: 'Vestibular UNIFESP 2012',
    paginaOficialUrl: 'https://ingresso.unifesp.br/vestibulares-anteriores/category/19-provas-e-gabaritos',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unifesp/unifesp2026.aspx',
    observacao: 'Categoria 19 provas e gabaritos históricos.'
  },
  {
    ano: 2007,
    rotulo: 'Vestibular UNIFESP 2007',
    paginaOficialUrl: 'https://ingresso.unifesp.br/vestibulares-anteriores/category/44-provas-e-gabaritos',
    resolucaoObjetivoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unifesp/unifesp2026.aspx',
    observacao: 'Categoria 44 provas e gabaritos históricos.'
  }
];

// ===== MACKENZIE PROVAS E GABARITOS OFICIAIS =====
export const MACKENZIE_ACERVO_TABLE: MackenzieEdicao[] = [
  {
    semestre: '2026/2',
    campusOuCurso: 'Higienópolis / Campinas',
    dataRealizacao: '15/07/2026',
    provaUrl: 'https://www.mackenzie.br/fileadmin/ARQUIVOS/Public/2-processos-seletivos/upm/VESTIBULAR_REGULAR/2026/2026_2/Prova_15.07.2026_-_2026_2__semestre.pdf',
    gabaritoUrl: 'https://www.mackenzie.br/fileadmin/ARQUIVOS/Public/2-processos-seletivos/upm/VESTIBULAR_REGULAR/2026/2026_2/Gabarito_15.07.2026_-_2026_2__semestre.pdf',
    portalOficialUrl: 'https://www.mackenzie.br/processos-seletivos/vestibular-graduacao/sao-paulo-higienopolis'
  },
  {
    semestre: '2026/1',
    campusOuCurso: 'Higienópolis (Geral)',
    dataRealizacao: '27/11/2025',
    provaUrl: 'https://www.mackenzie.br/fileadmin/ARQUIVOS/Public/2-processos-seletivos/upm/VESTIBULAR_REGULAR/2026/2026_1/Prova_27.11.2025_-_Higien%C3%B3polis_-_2026_1__semestre.pdf',
    gabaritoUrl: 'https://www.mackenzie.br/fileadmin/ARQUIVOS/Public/2-processos-seletivos/upm/VESTIBULAR_REGULAR/2026/2026_1/Gabarito_27.11.2025_-_Higien%C3%B3polis_-_2026_1__semestre.pdf',
    portalOficialUrl: 'https://www.mackenzie.br/processos-seletivos/vestibular-graduacao/sao-paulo-higienopolis'
  },
  {
    semestre: '2026/1',
    campusOuCurso: 'Medicina (Alphaville)',
    dataRealizacao: '30/10/2025',
    provaUrl: 'https://www.mackenzie.br/fileadmin/ARQUIVOS/Public/2-processos-seletivos/upm/VESTIBULAR_REGULAR/2026/2026_1/Prova_-_Medicina_-_2026_1__semestre_-_30.10.25.pdf',
    gabaritoUrl: 'https://www.mackenzie.br/fileadmin/ARQUIVOS/Public/2-processos-seletivos/upm/VESTIBULAR_REGULAR/2026/2026_1/Gabarito_-_Medicina_-_2026_1__semestre_-_30.10.25.pdf',
    portalOficialUrl: 'https://www.mackenzie.br/processos-seletivos/vestibular-graduacao/medicina'
  },
  {
    semestre: '2025/2',
    campusOuCurso: 'Higienópolis (Prova B)',
    dataRealizacao: '11/06/2025',
    provaUrl: 'https://www.mackenzie.br/fileadmin/user_upload/Prova_B_-_Higien%C3%B3polis_-_2025_2__semestre_-_Vestibular_-_11.06.25.pdf',
    gabaritoUrl: 'https://www.mackenzie.br/fileadmin/user_upload/Gabarito_-_Prova_B_-_Higien%C3%B3polis_-_2025_2__semestre_-_Vestibular_-_11.06.25.pdf',
    portalOficialUrl: 'https://www.mackenzie.br/processos-seletivos/vestibular-graduacao/sao-paulo-higienopolis'
  }
];

// ===== FGV VESTIBULAR PACOTES OFICIAIS =====
export const FGV_ACERVO_TABLE: FgvEdicao[] = [
  {
    edicao: 'Vestibular Unificado 2026.1',
    cursoOuUnidade: 'Administração de Empresas / Dupla Titulação',
    pacoteZipUrl: 'https://vestibular.fgv.br/sites/default/files/2025-12/materiais/dupla-ae_0.zip',
    conteudoPacote: 'Prova objetiva, discursiva, redação, gabarito oficial e grade de correção (ZIP).',
    portalOficialUrl: 'https://vestibular.fgv.br/provas-gabaritos'
  },
  {
    edicao: 'Vestibular Unificado 2025.1',
    cursoOuUnidade: 'RJ / RI / EPPG (Com grade de correção)',
    pacoteZipUrl: 'https://vestibular.fgv.br/sites/default/files/2025-01/materiais/rj_ri_eppg_grade_correcao.zip',
    conteudoPacote: 'Cadernos completos RJ/RI/EPPG, gabaritos e critérios de pontuação da banca (ZIP).',
    portalOficialUrl: 'https://vestibular.fgv.br/provas-gabaritos'
  },
  {
    edicao: 'Unificado 2024.1 — Período 3',
    cursoOuUnidade: 'Geral Unificado (Prova aplicada 16/11/2023)',
    pacoteZipUrl: 'https://vestibular.fgv.br/sites/default/files/2024-01/materiais/unificado_16112023_g3.zip',
    conteudoPacote: 'Pacote oficial de provas e gabarito preliminar/definitivo (ZIP).',
    portalOficialUrl: 'https://vestibular.fgv.br/provas-gabaritos'
  },
  {
    edicao: 'Vestibular 2023.1',
    cursoOuUnidade: 'Direito e Administração Pública',
    pacoteZipUrl: 'https://vestibular.fgv.br/sites/default/files/2023-09/materiais/2023.1%20Direito%20e%20Adm.%20P%C3%BAblica.zip',
    conteudoPacote: 'Prova discursiva, redação aplicada e gabarito oficial da banca FGV (ZIP).',
    portalOficialUrl: 'https://vestibular.fgv.br/provas-gabaritos'
  },
  {
    edicao: 'Vestibular 2023.1',
    cursoOuUnidade: 'Relações Internacionais (RI)',
    pacoteZipUrl: 'https://vestibular.fgv.br/sites/default/files/2023-09/materiais/2023.1%20RI.zip',
    conteudoPacote: 'Caderno específico de RI, gabarito e grade analítica de correção (ZIP).',
    portalOficialUrl: 'https://vestibular.fgv.br/provas-gabaritos'
  },
  {
    edicao: 'Vestibular 2022.1',
    cursoOuUnidade: 'Relações Internacionais (RI)',
    pacoteZipUrl: 'https://vestibular.fgv.br/sites/default/files/2023-09/materiais/2022.1%20RI.zip',
    conteudoPacote: 'Caderno integral de RI, gabarito oficial e orientações de resposta (ZIP).',
    portalOficialUrl: 'https://vestibular.fgv.br/provas-gabaritos'
  }
];

export const getUnespYearItem = (ano: number | string) => {
  const y = typeof ano === 'string' ? parseInt(ano, 10) : ano;
  return UNESP_ACERVO_TABLE.find(item => item.ano === y);
};

export const getUerjYearItem = (ano: number | string) => {
  const y = typeof ano === 'string' ? parseInt(ano, 10) : ano;
  return UERJ_ACERVO_TABLE.find(item => item.ano === y);
};

export const getUnifespYearItem = (ano: number | string) => {
  const y = typeof ano === 'string' ? parseInt(ano, 10) : ano;
  return UNIFESP_ACERVO_TABLE.find(item => item.ano === y);
};
