export enum Vestibular {
  ENEM = 'ENEM',
  FUVEST = 'Fuvest',
  UNICAMP = 'Unicamp',
  UNESP = 'Unesp',
  UERJ = 'UERJ',
  ITA = 'ITA',
  FGV = 'FGV',
  MACKENZIE = 'Mackenzie',
  UNIFESP = 'UNIFESP',
  ANHEMBI_MORUMBI = 'Anhembi Morumbi',
  ESTACIO = 'Estácio de Sá',
  UNISINOS = 'Unisinos'
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Exam {
  id: string;
  name: Vestibular;
  year: number;
  description?: string;
}

export interface Question {
  id: string;
  examId: string;
  subject: string;
  topic: string;
  text: string;
  options: string[];
  correctOption: number;
  explanation?: string;
  isOriginal?: boolean;
}

export interface EssayTheme {
  id: string;
  examId: string;
  year: number;
  theme: string;
  description?: string;
}

export interface ProgressRecord {
  id: string;
  userId: string;
  examId: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

export interface GabaritoOficial {
  id: string;
  exame: Vestibular | string;
  ano: number;
  dia: number;
  caderno: string;
  titulo?: string;
  pdfUrl?: string;
  provaPdfUrl?: string;
  questoes: {
    numero: number;
    resposta: string;
    disciplina: string;
    enunciado?: string;
    alternativas?: string[];
    justificativa?: string;
  }[];
}

export interface ContentTopic {
  subject: string;
  topics: {
    name: string;
    percentage: number;
    summary: string;
    youtubeId?: string;
    mindMapUrl?: string;
  }[];
}
