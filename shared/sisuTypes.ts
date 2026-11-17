export const SISU_EDICAO_ATUAL = 2027;
export const EDICOES_VALIDAS = [2024, 2025, 2026] as const;

export const CHANCE_THRESHOLDS = {
  ALTA_MIN_DIFF: 20,
  BOA_MIN_DIFF: 0,
  POSSIVEL_MIN_DIFF: -15,
  BAIXA_MIN_DIFF: -40,
  PROJECAO_MAX_DELTA: 30,
} as const;

export type AreaEnem = 'LC' | 'CH' | 'CN' | 'MT' | 'RED';

export const AREAS_ENEM_META: Record<
  AreaEnem,
  { codigo: AreaEnem; nome: string; nomeCurto: string; descricao: string }
> = {
  LC: {
    codigo: 'LC',
    nome: 'Linguagens, Códigos e suas Tecnologias',
    nomeCurto: 'Linguagens',
    descricao: 'Língua Portuguesa, Literatura, Língua Estrangeira, Artes e Ed. Física',
  },
  CH: {
    codigo: 'CH',
    nome: 'Ciências Humanas e suas Tecnologias',
    nomeCurto: 'Humanas',
    descricao: 'História, Geografia, Filosofia e Sociologia',
  },
  CN: {
    codigo: 'CN',
    nome: 'Ciências da Natureza e suas Tecnologias',
    nomeCurto: 'Natureza',
    descricao: 'Química, Física e Biologia',
  },
  MT: {
    codigo: 'MT',
    nome: 'Matemática e suas Tecnologias',
    nomeCurto: 'Matemática',
    descricao: 'Matemática e suas Tecnologias',
  },
  RED: {
    codigo: 'RED',
    nome: 'Redação',
    nomeCurto: 'Redação',
    descricao: 'Texto dissertativo-argumentativo (0 a 1000; nota 0 invalida a edição)',
  },
};

export type ModalidadeCodigo =
  | 'AC'
  | 'LB_PPI'
  | 'LB_Q'
  | 'LB_PCD'
  | 'LB_EP'
  | 'LI_PPI'
  | 'LI_Q'
  | 'LI_PCD'
  | 'LI_EP'
  | 'AA_IES';

export interface ModalidadeInfo {
  codigo: ModalidadeCodigo;
  nome: string;
  siglaCurta: string;
  lei: string;
  descricao: string;
  exigeEscolaPublica: boolean;
  exigeBaixaRenda: boolean;
}

export const MODALIDADES_INFO: Record<ModalidadeCodigo, ModalidadeInfo> = {
  AC: {
    codigo: 'AC',
    nome: 'Ampla Concorrência',
    siglaCurta: 'Ampla Concorrência (AC)',
    lei: 'Regra Geral',
    descricao: 'Todos os candidatos concorrem primeiro na Ampla Concorrência.',
    exigeEscolaPublica: false,
    exigeBaixaRenda: false,
  },
  LB_PPI: {
    codigo: 'LB_PPI',
    nome: 'Escola Pública + Renda ≤ 1 SM + Pretos, Pardos ou Indígenas',
    siglaCurta: 'LB_PPI (EP + ≤1 SM + PPI)',
    lei: 'Lei 12.711/2012 · Lei 14.723/2023',
    descricao: 'Ensino médio integral em escola pública, renda familiar bruta per capita ≤ 1 salário mínimo e autodeclaração PPI.',
    exigeEscolaPublica: true,
    exigeBaixaRenda: true,
  },
  LB_Q: {
    codigo: 'LB_Q',
    nome: 'Escola Pública + Renda ≤ 1 SM + Quilombolas',
    siglaCurta: 'LB_Q (EP + ≤1 SM + Quilombola)',
    lei: 'Lei 12.711/2012 · Lei 14.723/2023',
    descricao: 'Ensino médio integral em escola pública, renda per capita ≤ 1 salário mínimo e pertencimento a comunidade quilombola.',
    exigeEscolaPublica: true,
    exigeBaixaRenda: true,
  },
  LB_PCD: {
    codigo: 'LB_PCD',
    nome: 'Escola Pública + Renda ≤ 1 SM + Pessoa com Deficiência',
    siglaCurta: 'LB_PCD (EP + ≤1 SM + PcD)',
    lei: 'Lei 12.711/2012 · Lei 14.723/2023',
    descricao: 'Ensino médio integral em escola pública, renda per capita ≤ 1 salário mínimo e pessoa com deficiência.',
    exigeEscolaPublica: true,
    exigeBaixaRenda: true,
  },
  LB_EP: {
    codigo: 'LB_EP',
    nome: 'Escola Pública + Renda ≤ 1 SM',
    siglaCurta: 'LB_EP (EP + ≤1 SM)',
    lei: 'Lei 12.711/2012 · Lei 14.723/2023',
    descricao: 'Ensino médio integral em escola pública com renda familiar bruta per capita ≤ 1 salário mínimo.',
    exigeEscolaPublica: true,
    exigeBaixaRenda: true,
  },
  LI_PPI: {
    codigo: 'LI_PPI',
    nome: 'Escola Pública (Independente de Renda) + Pretos, Pardos ou Indígenas',
    siglaCurta: 'LI_PPI (EP + PPI)',
    lei: 'Lei 12.711/2012 · Lei 14.723/2023',
    descricao: 'Ensino médio integral em escola pública, independente de renda, e autodeclaração PPI.',
    exigeEscolaPublica: true,
    exigeBaixaRenda: false,
  },
  LI_Q: {
    codigo: 'LI_Q',
    nome: 'Escola Pública (Independente de Renda) + Quilombolas',
    siglaCurta: 'LI_Q (EP + Quilombola)',
    lei: 'Lei 12.711/2012 · Lei 14.723/2023',
    descricao: 'Ensino médio integral em escola pública, independente de renda, e pertencimento quilombola.',
    exigeEscolaPublica: true,
    exigeBaixaRenda: false,
  },
  LI_PCD: {
    codigo: 'LI_PCD',
    nome: 'Escola Pública (Independente de Renda) + Pessoa com Deficiência',
    siglaCurta: 'LI_PCD (EP + PcD)',
    lei: 'Lei 12.711/2012 · Lei 14.723/2023',
    descricao: 'Ensino médio integral em escola pública, independente de renda, e pessoa com deficiência.',
    exigeEscolaPublica: true,
    exigeBaixaRenda: false,
  },
  LI_EP: {
    codigo: 'LI_EP',
    nome: 'Escola Pública (Independente de Renda)',
    siglaCurta: 'LI_EP (Escola Pública)',
    lei: 'Lei 12.711/2012 · Lei 14.723/2023',
    descricao: 'Ensino médio integral em escola pública, independente da renda familiar.',
    exigeEscolaPublica: true,
    exigeBaixaRenda: false,
  },
  AA_IES: {
    codigo: 'AA_IES',
    nome: 'Ações Afirmativas Próprias da Instituição',
    siglaCurta: 'AA_IES (Ação Afirmativa IES)',
    lei: 'Política específica da IES',
    descricao: 'Modalidades ou bônus regionais/institucionais definidos no Termo de Adesão da universidade.',
    exigeEscolaPublica: false,
    exigeBaixaRenda: false,
  },
};

export interface NotasEnem {
  LC: number;
  CH: number;
  CN: number;
  MT: number;
  RED: number;
}

export interface EdicaoNotasUsuario {
  edicao: number;
  notas: NotasEnem;
  treineiro: boolean;
  origem?: 'manual' | 'simulados';
  atualizadoEm?: string;
}

export type PesosCurso = Record<AreaEnem, number>;
export type NotasMinimasPorArea = Partial<Record<AreaEnem, number>>;

export interface CorteHistoricoAnual {
  ano: number;
  fonte?: string;
  modalidades: Partial<Record<ModalidadeCodigo, number>>;
}

export interface CursoSisu {
  id: string;
  ies: string;
  iesSigla: string;
  curso: string;
  campus: string;
  cidade: string;
  uf: string;
  grau: 'Bacharelado' | 'Licenciatura' | 'Tecnológico';
  turno: 'Integral' | 'Matutino' | 'Vespertino' | 'Noturno' | 'EAD';
  pesos: PesosCurso;
  notasMinimasPorArea?: NotasMinimasPorArea;
  mediaMinima?: number;
  bonusPercentual?: number;
  bonusDescricao?: string;
  vagasPorModalidade: Partial<Record<ModalidadeCodigo, number>>;
  cortesHistoricos: CorteHistoricoAnual[];
  acaoAfirmativaIesDescricao?: string;
  ilustrativo: boolean;
  fonte: string;
}

export interface QuestionarioCota {
  escolaPublicaIntegral: boolean;
  rendaPerCapitaAte1SM: boolean;
  ppi: boolean;
  quilombola: boolean;
  pcd: boolean;
  acaoAfirmativaPropria?: string;
}

export interface PerfilSisuUsuario {
  questionario: QuestionarioCota;
  modalidadePreferida: ModalidadeCodigo;
  cumpreBonusRegional: boolean;
  opcao1CursoId?: string;
  opcao2CursoId?: string;
  atualizadoEm?: string;
}

export interface ResultadoElegibilidade {
  elegivel: boolean;
  edicaoValida: boolean;
  motivosFalha: string[];
  areasReprovadas: AreaEnem[];
  notaBruta: number;
  notaComBonus: number;
}

export type ChanceNivel = 'ALTA' | 'BOA' | 'POSSIVEL' | 'BAIXA' | 'MUITO_BAIXA' | 'INELEGIVEL';

export interface ClassificacaoChance {
  nivel: ChanceNivel;
  label: string;
  cor: 'emerald' | 'lime' | 'amber' | 'rose' | 'slate';
  diferenca: number | null;
}

export interface ProjecaoCorteResultado {
  modalidade: ModalidadeCodigo;
  ultimoAno: number | null;
  ultimoCorte: number | null;
  corteProjetado: number | null;
  deltaAplicado: number;
  tendencia: 'alta' | 'queda' | 'estavel' | 'indisponivel';
  historico: { ano: number; corte: number; fonte?: string }[];
  aviso?: string;
}

export interface AnaliseAreaQuantoFalta {
  area: AreaEnem;
  nomeCurto: string;
  peso: number;
  notaAtual: number;
  pontosNecessarios: number;
  notaAlvo: number;
  possivelNoEnem: boolean;
}

export interface AnaliseQuantoFalta {
  jaAtingiu: boolean;
  diferencaPonderada: number;
  corteReferencia: number;
  areas: AnaliseAreaQuantoFalta[];
  melhorArea: AnaliseAreaQuantoFalta | null;
}

export interface ResultadoEdicaoAvaliada {
  edicao: number;
  treineiro: boolean;
  redacaoZero: boolean;
  descartada: boolean;
  motivoDescarte?: string;
  elegibilidade: ResultadoElegibilidade;
  notaFinal: number;
}

export interface ResultadoSimulacaoCurso {
  curso: CursoSisu;
  temEdicaoValida: boolean;
  melhorEdicao: ResultadoEdicaoAvaliada | null;
  todasEdicoes: ResultadoEdicaoAvaliada[];
  notaFinal: number | null;
  elegivel: boolean;
  motivosInelegibilidade: string[];
  modalidadeEscolhida: ModalidadeCodigo;
  resultadoAC: {
    projecao: ProjecaoCorteResultado;
    chanceUltimoCorte: ClassificacaoChance;
    chanceProjetada: ClassificacaoChance;
    quantoFaltaUltimoCorte: AnaliseQuantoFalta | null;
  };
  resultadoCota: {
    projecao: ProjecaoCorteResultado;
    chanceUltimoCorte: ClassificacaoChance;
    chanceProjetada: ClassificacaoChance;
    quantoFaltaUltimoCorte: AnaliseQuantoFalta | null;
  } | null;
  vagasAC: number;
  vagasCota: number;
}

export interface CombinacaoReversaArea {
  area: AreaEnem;
  nomeCurto: string;
  peso: number;
  notaSugerida: number;
}

export interface CenarioCalculadoraReversa {
  titulo: string;
  descricao: string;
  notaPonderadaAlcancada: number;
  atingivel: boolean;
  areas: CombinacaoReversaArea[];
}

export interface SisuSimulacaoSalva {
  id: string;
  userId: string;
  criadoEm: string;
  curso1Id: string;
  curso1Nome: string;
  curso1Ies: string;
  curso2Id?: string;
  curso2Nome?: string;
  curso2Ies?: string;
  modalidade: ModalidadeCodigo;
  edicaoUsada: number | null;
  notaFinalOpcao1: number | null;
  chanceOpcao1: ChanceNivel;
  notaFinalOpcao2?: number | null;
  chanceOpcao2?: ChanceNivel;
  cumpreBonus: boolean;
}

export function recomendarModalidadesPorQuestionario(q: QuestionarioCota): ModalidadeCodigo[] {
  const lista: ModalidadeCodigo[] = ['AC'];
  if (q.escolaPublicaIntegral) {
    if (q.rendaPerCapitaAte1SM) {
      if (q.ppi) lista.push('LB_PPI');
      if (q.quilombola) lista.push('LB_Q');
      if (q.pcd) lista.push('LB_PCD');
      lista.push('LB_EP');
    }
    if (q.ppi) lista.push('LI_PPI');
    if (q.quilombola) lista.push('LI_Q');
    if (q.pcd) lista.push('LI_PCD');
    lista.push('LI_EP');
  }
  if (q.acaoAfirmativaPropria && q.acaoAfirmativaPropria.trim().length > 0) {
    lista.push('AA_IES');
  }
  return lista;
}
