export type Banca =
  | 'ENEM'
  | 'FUVEST'
  | 'UNICAMP'
  | 'UNESP'
  | 'ITA'
  | 'UERJ'
  | 'FGV'
  | 'MACKENZIE'
  | 'UNIFESP';

export type Letra = 'A' | 'B' | 'C' | 'D' | 'E';

export type Dificuldade = 'facil' | 'media' | 'dificil';

export type ModoTreino = 'livre' | 'cronometrado' | 'simulado_express' | 'revisao';

export interface Alternativa {
  letra: Letra;
  texto: string;
}

export interface ExplicacaoCache {
  resolucao: string;
  porQueErrada: Partial<Record<Letra, string>>;
  macete?: string;
}

export interface Questao {
  id: string;
  banca: Banca;
  ano: number;
  materia: string;
  topico: string;
  dificuldade: Dificuldade;
  textoBase?: string;
  enunciado: string;
  imagemUrl?: string;
  alternativas: Alternativa[];
  correta: Letra;
  anulada?: boolean;
  fonte?: string;
  explicacaoCache?: ExplicacaoCache;
}

export type QuestaoCliente = Omit<Questao, 'correta' | 'explicacaoCache'>;

export const INTERVALOS_REVISAO_DIAS = [1, 3, 7, 15, 30] as const;

export const XP_ACERTO = 10;
export const XP_ERRO = 2;
export const XP_BONUS_STREAK = 5;

export const TEMPO_MEDIO_SEGUNDOS: Record<Banca, number> = {
  ENEM: 180,
  FUVEST: 200,
  UNICAMP: 190,
  UNESP: 180,
  ITA: 240,
  UERJ: 180,
  FGV: 200,
  MACKENZIE: 170,
  UNIFESP: 180,
};

export const BANCAS_TREINO: Banca[] = [
  'ENEM',
  'FUVEST',
  'UNICAMP',
  'UNESP',
  'ITA',
  'UERJ',
  'FGV',
  'MACKENZIE',
  'UNIFESP',
];

export const MATERIAS_TREINO: string[] = [
  'Matemática',
  'Física',
  'Química',
  'Biologia',
  'Português',
  'História',
  'Geografia',
  'Filosofia',
];

export interface ItemRevisao {
  questaoId: string;
  passo: number; // Índice em INTERVALOS_REVISAO_DIAS (0..4)
  intervaloDias: number;
  acertosSeguidos: number;
  totalTentativas: number;
  totalAcertos: number;
  ultimaRespostaEm: string;
  proximaRevisaoEm: string;
}

export interface Tentativa {
  questaoId: string;
  banca: Banca;
  materia: string;
  topico: string;
  alternativaEscolhida: Letra;
  correta: Letra;
  acertou: boolean;
  tempoSeg: number;
  xpGanho: number;
  bonusStreak: boolean;
  streakApos: number;
  respondidaEm: string;
}

export interface DesempenhoMateria {
  materia: string;
  total: number;
  acertos: number;
  erros: number;
  pctAcerto: number;
}

export interface ResumoSessao {
  total: number;
  acertos: number;
  erros: number;
  pctAcerto: number;
  xpTotal: number;
  maiorStreak: number;
  tempoTotalSeg: number;
  tempoMedioSeg: number;
  porMateria: DesempenhoMateria[];
  errosDetalhados: Tentativa[];
}

export interface FiltrosTreino {
  banca?: Banca | 'TODAS';
  materia?: string | 'TODAS';
  topico?: string;
  dificuldade?: Dificuldade | 'todas';
  quantidade: number;
  modo: ModoTreino;
}

export type MotivoReporte =
  | 'gabarito_errado'
  | 'enunciado_incompleto'
  | 'imagem_quebrada'
  | 'formula_ilegivel'
  | 'anulada_oficialmente'
  | 'outro';
