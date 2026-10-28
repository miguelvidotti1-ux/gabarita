import React, { useState, useEffect } from 'react';
import { Vestibular } from '../types';
import { 
  FileText, 
  Sparkles, 
  PenTool, 
  CheckCircle2, 
  Loader2, 
  Award, 
  History, 
  Camera, 
  Target, 
  Zap, 
  Clock, 
  Share2, 
  ChevronDown, 
  Lightbulb, 
  Check,
  AlertTriangle,
  XCircle,
  BookOpen,
  ArrowRight,
  Shield,
  Layers,
  BookMarked,
  Info,
  X,
  RefreshCw
} from 'lucide-react';
import { ESSAY_THEMES, EssayThemeItem } from '../constants';
import { UNESP_2025_REDACAO } from '../data/unesp_recentes_data';
import { 
  generateEssayTheme, 
  generateDetailedEssayTheme,
  analyzeEssayFromImage, 
  corrigirRedacaoCorrigeBot, 
  EssayAnalysis, 
  Competency,
  CorrigeBotSugestaoIntervencao 
} from '../services/geminiService';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { missionEngine } from '../services/missionService';
import { achievementService } from '../services/achievementService';
import { collection, addDoc, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import GalleryPicker from './GalleryPicker';
import NativeCameraLauncher from './NativeCameraLauncher';
import { motion, AnimatePresence } from 'motion/react';
import AudioTranscriber from './AudioTranscriber';

interface EssayResult {
  id: string;
  theme: string;
  essayText: string;
  generalCorrection?: string;
  competencies?: Competency[];
  grade?: number;
  nota_final?: number;
  conceito_geral?: string;
  zerada?: boolean;
  motivo_zeramento?: string | null;
  pontos_fortes?: string[];
  pontos_melhoria?: string[];
  sugestao_proposta_intervencao?: CorrigeBotSugestaoIntervencao;
  parecer_geral?: string;
  banca?: string;
  banca_nome?: string;
  timestamp: Timestamp;
  status: string;
}

export interface BancaCorrigebotConfig {
  id: string;
  vestibular: Vestibular;
  nome: string;
  badge: string;
  escala: string;
  notaMaxima: number | null;
  exigeIntervencao: boolean;
  limiteLinhas: number | null;
  tipoTexto: string;
  info: string;
  obra?: string | null;
  criterios: Array<{ id: number; nome: string; peso: string; desc: string }>;
  zeramento: string[];
  dicaOuro: string;
}

export const BANCAS_CORRIGEBOT: BancaCorrigebotConfig[] = [
  {
    id: 'enem',
    vestibular: Vestibular.ENEM,
    nome: 'ENEM',
    badge: 'Nota 0–1000 · 5 Competências',
    escala: '0 a 1000 pontos (5 competências de 0 a 200 pts)',
    notaMaxima: 1000,
    exigeIntervencao: true,
    limiteLinhas: 30,
    tipoTexto: 'Dissertativo-argumentativo em prosa',
    info: '5 competências oficiais (0–200 pts) · Proposta de intervenção com 5 elementos obrigatórios',
    criterios: [
      { id: 1, nome: 'Domínio da norma culta formal', peso: '0 a 200 pts', desc: 'Avalia a correção gramatical, concordância, regência, pontuação e precisão sintática.' },
      { id: 2, nome: 'Compreensão do tema e repertório sociocultural', peso: '0 a 200 pts', desc: 'Exige abordagem completa do tema e uso de repertório legítimo, pertinente e produtivo.' },
      { id: 3, nome: 'Projeto de texto e consistência argumentativa', peso: '0 a 200 pts', desc: 'Avalia a seleção, organização e interpretação de fatos e argumentos em defesa de um ponto de vista.' },
      { id: 4, nome: 'Coesão inter e intraparágrafos', peso: '0 a 200 pts', desc: 'Uso diversificado de operadores argumentativos, sem repetições excessivas ou inadequações.' },
      { id: 5, nome: 'Proposta de intervenção social', peso: '0 a 200 pts', desc: 'Elaboração de proposta articulada com Agente, Ação, Meio/Modo, Efeito e Detalhamento.' }
    ],
    zeramento: [
      'Fuga total ao tema',
      'Não atendimento ao tipo dissertativo-argumentativo',
      'Extensão de até 7 linhas escritas',
      'Cópia mecânica da coletânea motivadora (linhas contadas desconsideradas)',
      'Impropérios, desenhos ou partes desconexas deliberadas'
    ],
    dicaOuro: 'Garanta repertório legitimado e produtivo em cada parágrafo de desenvolvimento e estruture a proposta de intervenção social completa com os 5 elementos essenciais.'
  },
  {
    id: 'fuvest',
    vestibular: Vestibular.FUVEST,
    nome: 'FUVEST',
    badge: 'Nota 0–50 · Dissertação Reflexiva',
    escala: '0 a 50 pontos (Tema 20, Estrutura 15, Linguagem 15)',
    notaMaxima: 50,
    exigeIntervencao: false,
    limiteLinhas: 30,
    tipoTexto: 'Dissertativo-argumentativo reflexivo e acadêmico',
    info: 'Rigor filosófico e conceitual denso · NÃO exige intervenção social · Obras literárias e coesão madura',
    criterios: [
      { id: 1, nome: 'Desenvolvimento do tema e abordagem crítica', peso: '0 a 20 pts', desc: 'Profundidade conceitual, maturidade reflexiva e capacidade de abstração.' },
      { id: 2, nome: 'Estrutura, coerência dos argumentos e projeto de texto', peso: '0 a 15 pts', desc: 'Encadeamento lúcido das ideias, ausência de contradições e progressão contínua.' },
      { id: 3, nome: 'Expressão, correção gramatical e precisão vocabular', peso: '0 a 15 pts', desc: 'Domínio culto, clareza sintática, concisão e variedade lexical.' }
    ],
    zeramento: [
      'Fuga total ao tema proposto',
      'Desvio do gênero dissertativo-argumentativo',
      'Menos de 15 linhas escritas',
      'Identificação de autoria na folha de resposta'
    ],
    dicaOuro: 'Problematize a questão em nível conceitual e filosófico. Não tente "resolver" o problema com receitas prontas; faça um diagnóstico crítico e lúcido.'
  },
  {
    id: 'unicamp',
    vestibular: Vestibular.UNICAMP,
    nome: 'UNICAMP',
    badge: 'Gêneros Específicos & Autoria',
    escala: 'Avaliação holística por competências sociais (Nota conceitual ou 0–12)',
    notaMaxima: null,
    exigeIntervencao: false,
    limiteLinhas: 30,
    tipoTexto: 'Gênero textual social específico (carta, artigo, manifesto, crônica, etc.)',
    info: '2 opções de temas com gêneros da vida social · Máscara autoral e interlocução obrigatórias',
    criterios: [
      { id: 1, nome: 'Cumprimento integral da proposta temática', peso: 'Critério eliminatório', desc: 'Fidelidade às diretrizes e às discussões solicitadas pelo enunciado.' },
      { id: 2, nome: 'Adequação ao gênero textual solicitado', peso: 'Critério essencial', desc: 'Respeito estrito às convenções do gênero (carta, manifesto, depoimento, crônica, discurso).' },
      { id: 3, nome: 'Leitura crítica e integração da coletânea', peso: 'Critério de repertório', desc: 'Apropriação autoral e reflexiva dos textos motivadores sem paráfrases mecânicas.' },
      { id: 4, nome: 'Articulação linguística e construção da voz autoral', peso: 'Critério linguístico', desc: 'Registro compatível com o interlocutor e o contexto de circulação social.' }
    ],
    zeramento: [
      'Fuga ao tema ou ao gênero textual solicitado',
      'Menos de 15 linhas escritas',
      'Identificação do candidato'
    ],
    dicaOuro: 'Assuma estritamente a voz do enunciador pedido na proposta e dirija-se com precisão ao interlocutor real definido na situação de comunicação.'
  },
  {
    id: 'unesp',
    vestibular: Vestibular.UNESP,
    nome: 'UNESP',
    badge: 'Nota 0–28 · Pergunta Problematizadora',
    escala: '0 a 28 pontos (Critério A: 8 pts, Critério B: 10 pts, Critério C: 10 pts)',
    notaMaxima: 28,
    exigeIntervencao: false,
    limiteLinhas: 30,
    tipoTexto: 'Dissertativo-argumentativo padrão VUNESP',
    info: 'Pergunta reflexiva direta · Posicionamento explícito desde a introdução sem ficar em cima do muro',
    criterios: [
      { id: 1, nome: 'Critério A: Adequação temática e ao tipo textual', peso: '0 a 8 pts', desc: 'Compreensão da pergunta problematizadora e manutenção estrita da dissertação.' },
      { id: 2, nome: 'Critério B: Estrutura argumentativa e consistência da tese', peso: '0 a 10 pts', desc: 'Posicionamento claro na introdução e sustentação coerente no desenvolvimento.' },
      { id: 3, nome: 'Critério C: Coesão e modalidade escrita formal', peso: '0 a 10 pts', desc: 'Correção gramatical, pontuação expressiva e articulação coesiva.' }
    ],
    zeramento: [
      'Fuga total ao tema',
      'Não atendimento ao tipo dissertativo',
      'Menos de 15 linhas escritas',
      'Identificação ou cópia integral da coletânea'
    ],
    dicaOuro: 'Responda objetivamente à pergunta-tema no primeiro parágrafo. Não fique em cima do muro nem tente contemporizar sem assumir uma posição sólida.'
  },
  {
    id: 'uerj',
    vestibular: Vestibular.UERJ,
    nome: 'UERJ',
    badge: 'Nota 0–10 · Obra Literária',
    escala: '0 a 10 pontos (Tema/Obra 0-4, Estrutura 0-3, Norma Culta 0-3)',
    notaMaxima: 10,
    exigeIntervencao: false,
    limiteLinhas: 30,
    tipoTexto: 'Dissertativo-argumentativo reflexivo',
    info: 'Articulação direta com a obra literária indicada no edital · Crítica social aguda e problematizadora',
    obra: 'Leitura indicada pelo edital oficial da UERJ',
    criterios: [
      { id: 1, nome: 'Adequação temática e diálogo reflexivo com a obra', peso: '0 a 4,0 pts', desc: 'Relação autêntica entre os dilemas da obra literária e as questões humanas universais.' },
      { id: 2, nome: 'Estrutura argumentativa, progressão e coesão', peso: '0 a 3,0 pts', desc: 'Encadeamento dos parágrafos, tese consistente e conclusão analítica sem chavões.' },
      { id: 3, nome: 'Domínio da norma culta e recursos expressivos', peso: '0 a 3,0 pts', desc: 'Precisão vocabular, variedade de estruturas sintáticas e correção gramatical.' }
    ],
    zeramento: [
      'Fuga total ao tema',
      'Desvio do tipo dissertativo',
      'Menos de 15 linhas',
      'Identificação do candidato'
    ],
    dicaOuro: 'Não faça mero resumo do livro. Conecte as tensões éticas e os personagens às contradições do Brasil contemporâneo.'
  },
  {
    id: 'ita',
    vestibular: Vestibular.ITA,
    nome: 'ITA',
    badge: 'Nota 0–10 · Rigor Lógico & Analítico',
    escala: '0 a 10 pontos (4 critérios de 2,5 pts cada)',
    notaMaxima: 10,
    exigeIntervencao: false,
    limiteLinhas: 28,
    tipoTexto: 'Dissertativo-argumentativo de alto rigor analítico',
    info: 'Rigor lógico implacável · Argumentação densa sem clichês · Domínio formal irrepreensível',
    criterios: [
      { id: 1, nome: 'Tema, gênero dissertativo e profundidade da tese', peso: '0 a 2,5 pts', desc: 'Tese madura, sem redundâncias e com recortes analíticos precisos.' },
      { id: 2, nome: 'Consistência lógica e solidez argumentativa', peso: '0 a 2,5 pts', desc: 'Cadeia de causas e consequências isenta de falácias e generalizações ingênuas.' },
      { id: 3, nome: 'Coesão, encadeamento e concisão sintática', peso: '0 a 2,5 pts', desc: 'Poder de síntese apurado, encadeamento lógico natural e fluidez.' },
      { id: 4, nome: 'Correção gramatical e precisão léxica culta', peso: '0 a 2,5 pts', desc: 'Domínio impecável da norma padrão e exatidão semântica dos termos empregados.' }
    ],
    zeramento: [
      'Fuga ao tema',
      'Estrutura não dissertativa',
      'Menos de 15 linhas escritas',
      'Identificação do candidato'
    ],
    dicaOuro: 'Mantenha total sobriedade no tom, corte adjetivações vazias e priorize a conexão de causa-efeito estrita em cada parágrafo.'
  },
  {
    id: 'ime',
    vestibular: Vestibular.IME,
    nome: 'IME',
    badge: 'Nota 0–10 · Ciência, Defesa & Soberania',
    escala: '0 a 10 pontos (Tema 0-3, Estrutura 0-3, Gramática 0-2,5, Concisão 0-1,5)',
    notaMaxima: 10,
    exigeIntervencao: false,
    limiteLinhas: 30,
    tipoTexto: 'Dissertativo-argumentativo técnico e reflexivo',
    info: 'Foco em soberania nacional, tecnologia, ética científica e desenvolvimento estratégico',
    criterios: [
      { id: 1, nome: 'Pertinência temática e profundidade reflexiva', peso: '0 a 3,0 pts', desc: 'Compreensão ampla da proposta, visão crítica e conhecimento de contexto.' },
      { id: 2, nome: 'Estruturação dissertativa e consistência argumentativa', peso: '0 a 3,0 pts', desc: 'Projeto de texto lúcido, tese firme e concatenação irrefutável de ideias.' },
      { id: 3, nome: 'Domínio estrito da norma culta e correção gramatical', peso: '0 a 2,5 pts', desc: 'Correção ortográfica, regência, concordância e sintaxe elaborada.' },
      { id: 4, nome: 'Concisão, clareza e precisão terminológica', peso: '0 a 1,5 pts', desc: 'Linguagem objetiva, poder de síntese e vocabulário técnico e maduro.' }
    ],
    zeramento: [
      'Fuga total ao tema',
      'Texto em gênero que não seja dissertativo',
      'Menos de 15 linhas escritas',
      'Qualquer sinal de identificação na folha'
    ],
    dicaOuro: 'Articule inovação científica e engenharia à soberania nacional e ao interesse coletivo estratégico, fugindo de abordagens ingênuas.'
  },
  {
    id: 'fgv',
    vestibular: Vestibular.FGV,
    nome: 'FGV',
    badge: 'Nota 0–10 · Economia, Gestão & Instituições',
    escala: '0 a 10 pontos (4 critérios de 2,5 pts cada)',
    notaMaxima: 10,
    exigeIntervencao: false,
    limiteLinhas: 30,
    tipoTexto: 'Dissertativo-argumentativo com viés socioeconômico',
    info: 'Raciocínio socioeconômico e institucional · Clareza de projeto de texto e rigor analítico',
    criterios: [
      { id: 1, nome: 'Interpretação temática e leitura de conjuntura', peso: '0 a 2,5 pts', desc: 'Capacidade de interpretar fenômenos econômicos, sociais e institucionais.' },
      { id: 2, nome: 'Rigor argumentativo, dados e autoria', peso: '0 a 2,5 pts', desc: 'Defesa consistente com suporte teórico e ausência de lugares-comuns.' },
      { id: 3, nome: 'Estrutura, encadeamento e progressão textual', peso: '0 a 2,5 pts', desc: 'Parágrafos bem delimitados com tópicos frasais e transições harmônicas.' },
      { id: 4, nome: 'Domínio da norma culta e precisão conceitual', peso: '0 a 2,5 pts', desc: 'Vocabulário maduro, preciso e adequado ao debate acadêmico e corporativo.' }
    ],
    zeramento: [
      'Fuga total ao tema',
      'Menos de 15 linhas',
      'Identificação do candidato'
    ],
    dicaOuro: 'Mobilize conceitos das ciências sociais, economia e direito para demonstrar visão pragmática das instituições e dos mercados.'
  },
  {
    id: 'mackenzie',
    vestibular: Vestibular.MACKENZIE,
    nome: 'MACKENZIE',
    badge: 'Nota 0–10 · Ética, Cidadania & Família',
    escala: '0 a 10 pontos (Tema 0-3, Estrutura 0-3, Coesão 0-2, Linguagem 0-2)',
    notaMaxima: 10,
    exigeIntervencao: false,
    limiteLinhas: 30,
    tipoTexto: 'Dissertativo-argumentativo',
    info: 'Valores éticos, responsabilidade social e cidadania ativa · Equilíbrio dissertativo',
    criterios: [
      { id: 1, nome: 'Adequação ao tema e abordagem ética', peso: '0 a 3,0 pts', desc: 'Compreensão da proposta e reflexão com ênfase na responsabilidade humana.' },
      { id: 2, nome: 'Estruturação argumentativa e consistência', peso: '0 a 3,0 pts', desc: 'Desenvolvimento lógico, argumentos embasados e síntese conclusiva.' },
      { id: 3, nome: 'Coesão interparágrafos e intraparágrafos', peso: '0 a 2,0 pts', desc: 'Articulação fluida, conectivos precisos e pontuação expressiva.' },
      { id: 4, nome: 'Domínio da norma culta formal', peso: '0 a 2,0 pts', desc: 'Correção ortográfica e sintática, variedade lexical e clareza.' }
    ],
    zeramento: [
      'Fuga total ao tema',
      'Não atendimento ao gênero dissertativo',
      'Menos de 15 linhas escritas',
      'Identificação do candidato'
    ],
    dicaOuro: 'Destaque o protagonismo individual e coletivo, a ética do bem comum e a cooperação solidária na superação dos dilemas contemporâneos.'
  },
  {
    id: 'puc_sp',
    vestibular: Vestibular.PUC_SP,
    nome: 'PUC-SP',
    badge: 'Nota 0–100 · Direitos Humanos & Cidadania',
    escala: '0 a 100 pontos (4 critérios de 25 pts cada)',
    notaMaxima: 100,
    exigeIntervencao: false,
    limiteLinhas: 30,
    tipoTexto: 'Dissertativo-argumentativo reflexivo e humanista',
    info: 'Perspectiva humanista e crítica social · Direitos humanos, cidadania e alteridade',
    criterios: [
      { id: 1, nome: 'Compreensão do tema e relevância social', peso: '0 a 25 pts', desc: 'Capacidade de problematizar o tema sob a ótica dos direitos e da justiça social.' },
      { id: 2, nome: 'Consistência da tese e profundidade argumentativa', peso: '0 a 25 pts', desc: 'Argumentação crítica sólida, fundamentada em fatos e teorias humanistas.' },
      { id: 3, nome: 'Estrutura dissertativa e coerência macrotextual', peso: '0 a 25 pts', desc: 'Organização lógica equilibrada entre introdução, desenvolvimento e conclusão.' },
      { id: 4, nome: 'Recursos coesivos e domínio da norma culta formal', peso: '0 a 25 pts', desc: 'Precisão vocabular, coesão sequencial e correção gramatical estrita.' }
    ],
    zeramento: [
      'Fuga total ao tema',
      'Violação explícita aos direitos humanos fundamentais',
      'Menos de 15 linhas escritas',
      'Identificação do candidato'
    ],
    dicaOuro: 'Demonstre compromisso com a justiça social e a dignidade humana, analisando as contradições estruturais da sociedade brasileira.'
  },
  {
    id: 'unifesp',
    vestibular: Vestibular.UNIFESP,
    nome: 'UNIFESP',
    badge: 'Nota 0–100 · Bioética, Saúde & Sociedade',
    escala: '0 a 100 pontos (Tema 0-30, Estrutura 0-40, Coesão e Norma 0-30)',
    notaMaxima: 100,
    exigeIntervencao: false,
    limiteLinhas: 30,
    tipoTexto: 'Dissertativo-argumentativo acadêmico (VUNESP Misto)',
    info: 'Vestibular Misto formulado pela VUNESP · Bioética, saúde coletiva, ciência e impactos humanos',
    criterios: [
      { id: 1, nome: 'Tema e abordagem crítica reflexiva', peso: '0 a 30 pts', desc: 'Compreensão integral do tema e sustentação de ponto de vista claro.' },
      { id: 2, nome: 'Estrutura, gênero dissertativo e consistência da tese', peso: '0 a 40 pts', desc: 'Organização macrotextual, consistência dos argumentos e profundidade analítica.' },
      { id: 3, nome: 'Coesão textual e domínio da norma culta formal', peso: '0 a 30 pts', desc: 'Emprego correto dos recursos de coesão, sintaxe clara e correção gramatical.' }
    ],
    zeramento: [
      'Fuga total ao tema proposto',
      'Desvio do gênero dissertativo',
      'Menos de 15 linhas escritas',
      'Identificação do candidato'
    ],
    dicaOuro: 'Debata implicações bioéticas e impactos humanos dos avanços científicos, articulando rigor conceitual com sensibilidade humanitária.'
  }
];

export default function Redacao({ vestibular, setVestibular }: { vestibular: Vestibular, setVestibular: (v: Vestibular) => void }) {
  const themes: EssayThemeItem[] = (ESSAY_THEMES[vestibular] as EssayThemeItem[]) || [];
  const activeBanca = BANCAS_CORRIGEBOT.find(b => b.vestibular === vestibular) || BANCAS_CORRIGEBOT[0];
  const [selectedTheme, setSelectedTheme] = useState<string>(themes[0]?.theme || '');
  const [propostaNumero, setPropostaNumero] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingSimilar, setIsGeneratingSimilar] = useState(false);
  const [showMetodologia, setShowMetodologia] = useState(false);
  const [aiJustificativa, setAiJustificativa] = useState<string | null>(null);
  const [aiSimilares, setAiSimilares] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzingFromImage, setIsAnalyzingFromImage] = useState(false);
  const [essayText, setEssayText] = useState('');
  const [correction, setCorrection] = useState<EssayAnalysis | null>(null);
  const [essayHistory, setEssayHistory] = useState<EssayResult[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showMotivadores, setShowMotivadores] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [toast, setToast] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const currentThemeItem = themes.find(t => t.theme === selectedTheme);

  const showToast = (type: 'error' | 'success', text: string) => {
    setToast({ type, text });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  useEffect(() => {
    setSelectedTheme(themes[0]?.theme || '');
    setCorrection(null);
    setAiJustificativa(null);
    setAiSimilares([]);
  }, [vestibular]);

  // Carregar histórico do usuário do Firestore
  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'essays'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const history: EssayResult[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as EssayResult));
      setEssayHistory(history);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'essays');
    });

    return () => unsubscribe();
  }, []);

  const handleImageEssayCorrection = async (file: File) => {
    if (!auth.currentUser) {
      showToast('error', "Você precisa estar logado para enviar redações.");
      return;
    }

    setIsAnalyzingFromImage(true);
    try {
      const result = await analyzeEssayFromImage(vestibular, selectedTheme, file);
      setCorrection(result);
      
      await addDoc(collection(db, 'essays'), {
        userId: auth.currentUser.uid,
        banca: vestibular,
        banca_nome: result.banca_nome || activeBanca.nome,
        theme: selectedTheme,
        essayText: 'Transcrição da imagem...',
        generalCorrection: result.generalCorrection,
        competencies: result.competencies,
        grade: result.grade,
        nota_final: result.nota_final ?? result.grade,
        conceito_geral: result.conceito_geral ?? null,
        zerada: Boolean(result.zerada),
        motivo_zeramento: result.motivo_zeramento ?? null,
        pontos_fortes: result.pontos_fortes ?? [],
        pontos_melhoria: result.pontos_melhoria ?? [],
        sugestao_proposta_intervencao: result.sugestao_proposta_intervencao ?? null,
        parecer_geral: result.parecer_geral ?? result.generalCorrection,
        status: 'corrected',
        timestamp: Timestamp.now()
      });

      missionEngine.getMissionsForToday().forEach(m => {
        if (m.type === 'essay') {
          missionEngine.updateProgress(m.id, 1);
        }
      });

      if (auth.currentUser) {
        achievementService.trackActivity(auth.currentUser.uid, 'redacoes', 1);
      }
      showToast('success', 'Redação por imagem analisada!');
    } catch (error) {
      console.error("Error analyzing essay from image:", error);
      showToast('error', "Erro ao analisar imagem. Tente novamente.");
    } finally {
      setIsAnalyzingFromImage(false);
      setShowCamera(false);
      setShowGallery(false);
    }
  };

  const handleGenerateAITheme = async () => {
    setIsGenerating(true);
    setAiJustificativa(null);
    try {
      const res = await generateDetailedEssayTheme(vestibular, themes);
      if (res && res.theme) {
        setSelectedTheme(res.theme);
        setAiJustificativa(res.justificativa || null);
        setAiSimilares(res.similares || []);
        setCorrection(null);
        showToast('success', `Novo tema inédito gerado para ${activeBanca.nome}!`);
      }
    } catch (error) {
      console.error("Failed to generate theme:", error);
      showToast('error', 'Falha ao gerar tema por IA.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateSimilarTheme = async (baseThemeToUse?: string) => {
    const targetBase = (baseThemeToUse || selectedTheme || '').trim();
    if (!targetBase) {
      showToast('error', 'Selecione ou insira um tema primeiro.');
      return;
    }
    setIsGeneratingSimilar(true);
    setAiJustificativa(null);
    try {
      const currentItem = themes.find(t => t.theme === targetBase);
      const res = await generateDetailedEssayTheme(vestibular, themes, {
        baseTheme: targetBase,
        thematicAxis: currentItem?.eixo
      });
      if (res && res.theme) {
        setSelectedTheme(res.theme);
        setAiJustificativa(res.justificativa || null);
        setAiSimilares(res.similares || []);
        setCorrection(null);
        showToast('success', 'Tema semelhante gerado com sucesso!');
      }
    } catch (error) {
      console.error("Failed to generate similar theme:", error);
      showToast('error', 'Falha ao gerar tema semelhante.');
    } finally {
      setIsGeneratingSimilar(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!essayText.trim()) {
      showToast('error', "Escreva sua redação primeiro antes de salvar.");
      return;
    }
    if (!auth.currentUser) {
      showToast('error', "Você precisa estar logado para salvar rascunhos.");
      return;
    }

    try {
      await addDoc(collection(db, 'essays'), {
        userId: auth.currentUser.uid,
        banca: vestibular,
        theme: selectedTheme,
        essayText,
        status: 'draft',
        timestamp: Timestamp.now()
      });
      setSaveSuccess(true);
      showToast('success', 'Rascunho salvo com sucesso!');
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'essays');
    }
  };

  const handleAnalyzeEssay = async () => {
    const tema = selectedTheme.trim();
    const texto = essayText.trim();

    if (!tema || !texto) {
      showToast('error', 'Preencha o tema e o texto da redação');
      return;
    }

    if (texto.length < 200) {
      showToast('error', 'Texto muito curto para análise (mínimo ~200 caracteres)');
      return;
    }

    if (texto.length > 12000) {
      showToast('error', 'Texto excede o limite de 12.000 caracteres');
      return;
    }

    setIsAnalyzing(true);
    try {
      const bancaKey = vestibular.toLowerCase();
      const propNum = vestibular === Vestibular.UNICAMP ? propostaNumero : undefined;

      const result = await corrigirRedacaoCorrigeBot(
        bancaKey,
        tema,
        texto,
        propNum,
        auth.currentUser?.uid
      );

      setCorrection(result);

      if (auth.currentUser) {
        await addDoc(collection(db, 'essays'), {
          userId: auth.currentUser.uid,
          banca: vestibular,
          banca_nome: result.banca_nome || vestibular,
          theme: tema,
          essayText: texto,
          generalCorrection: result.generalCorrection,
          competencies: result.competencies,
          grade: result.grade,
          nota_final: result.nota_final ?? (result.grade !== undefined ? result.grade : null),
          conceito_geral: result.conceito_geral ?? null,
          zerada: Boolean(result.zerada),
          motivo_zeramento: result.motivo_zeramento ?? null,
          pontos_fortes: result.pontos_fortes ?? [],
          pontos_melhoria: result.pontos_melhoria ?? [],
          sugestao_proposta_intervencao: result.sugestao_proposta_intervencao ?? null,
          parecer_geral: result.parecer_geral ?? result.generalCorrection,
          status: 'corrected',
          timestamp: Timestamp.now()
        });
      }

      // Update Mission Progress
      missionEngine.getMissionsForToday().forEach(m => {
        if (m.type === 'essay') {
          missionEngine.updateProgress(m.id, 1);
        }
      });

      if (auth.currentUser) {
        achievementService.trackActivity(auth.currentUser.uid, 'redacoes', 1);
      }

      showToast('success', 'Redação corrigida com sucesso pelo CorrigeBot!');

      // Scroll suave para a seção do resultado
      setTimeout(() => {
        const el = document.getElementById('redacao-resultado');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);

    } catch (error: any) {
      console.error("Erro na correção:", error);
      showToast('error', error.message || 'Erro ao corrigir redação');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoadEssay = (essay: EssayResult) => {
    setEssayText(essay.essayText);
    setSelectedTheme(essay.theme);
    if (essay.generalCorrection && essay.competencies) {
      setCorrection({
        grade: essay.grade ?? essay.nota_final ?? 0,
        competencies: essay.competencies,
        generalCorrection: essay.generalCorrection,
        nota_final: essay.nota_final,
        conceito_geral: essay.conceito_geral,
        zerada: essay.zerada,
        motivo_zeramento: essay.motivo_zeramento,
        pontos_fortes: essay.pontos_fortes,
        pontos_melhoria: essay.pontos_melhoria,
        sugestao_proposta_intervencao: essay.sugestao_proposta_intervencao,
        parecer_geral: essay.parecer_geral,
        banca: essay.banca
      });
    } else {
      setCorrection(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const wordCount = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;
  const lineCount = essayText.trim() ? Math.max(1, Math.floor(essayText.trim().length / 72)) : 0;
  const charCount = essayText.length;

  return (
    <div className="space-y-8 pb-16 font-sans animate-in fade-in duration-500">
      
      {/* TOAST FLUTUANTE */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 text-sm font-semibold backdrop-blur-md ${
              toast.type === 'error'
                ? 'bg-red-950/90 text-red-200 border-red-700/60'
                : 'bg-emerald-950/90 text-emerald-200 border-emerald-700/60'
            }`}
          >
            {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
            <span>{toast.text}</span>
            <button 
              type="button" 
              onClick={() => setToast(null)}
              className="ml-2 hover:opacity-75 cursor-pointer text-white/70"
            >
              <XCircle size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO HEADER — PADRÃO UNIFICADO VESTIBULARPRO */}
      <div className="bg-slate-950 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 blur-[150px] rounded-full -ml-48 -mb-48 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                <PenTool size={12} className="text-blue-400" />
                Laboratório de Redação
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                <CheckCircle2 size={12} className="text-emerald-400" />
                Bancas Oficiais 2026
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-500/20">
                <Sparkles size={12} className="text-purple-400" />
                CorrigeBot IA
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
              Oficina de <span className="text-blue-400">Redação & CorrigeBot</span>
            </h1>
            <p className="text-slate-400 font-medium leading-relaxed text-sm md:text-base">
              Escreva, fotografe folhas manuscritas ou dite seu texto. Receba correções linha a linha
              com as rubricas e critérios oficiais de avaliação do ENEM, Fuvest, Unicamp, Unesp e ITA.
            </p>
          </div>

          <div className="bg-[var(--bg-hover)] p-5 px-6 rounded-2xl border border-[var(--border-light)] text-center shrink-0 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Award size={24} />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-bold text-[var(--text-label)] uppercase tracking-wider">Histórico Pessoal</p>
              <p className="text-2xl font-extrabold text-[var(--text-main)]">
                {essayHistory.length} {essayHistory.length === 1 ? 'Redação' : 'Redações'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* VESTIBULAR FILTER TABS — BARRA DE ABAS PADRÃO */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {BANCAS_CORRIGEBOT.map((b) => {
          const isActive = vestibular === b.vestibular;
          return (
            <button
              key={b.id}
              onClick={() => {
                setVestibular(b.vestibular);
                setCorrection(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer border ${
                isActive
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-md shadow-[var(--shadow-primary)]'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border-[var(--border-light)] hover:border-[var(--primary-border)]'
              }`}
            >
              {b.nome}
            </button>
          );
        })}
      </div>

      {/* GRID PRINCIPAL: CORRETOR (8 COLS) + SIDEBAR (4 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUNA PRINCIPAL: CORRIGEBOT (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* SEÇÃO CORRIGEBOT PRINCIPAL */}
          <div 
            id="corrigebot-section"
            className="rounded-3xl p-6 sm:p-8 border border-[var(--border-light)] bg-[var(--bg-card)] text-[var(--text-main)] shadow-sm transition-all space-y-6"
          >
            
            {/* CABEÇALHO DO EDITOR */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-[var(--border-light)]">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[var(--text-main)] tracking-tight flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <PenTool size={18} />
                  </div>
                  <span>CorrigeBot — Avaliação Oficial {vestibular}</span>
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 font-medium">
                  {BANCAS_CORRIGEBOT.find(b => b.vestibular === vestibular)?.info}
                </p>
              </div>

              {/* FERRAMENTAS DE FOTO E SCAN */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button 
                  type="button"
                  id="btn-camera"
                  onClick={() => { setShowCamera(!showCamera); setShowGallery(false); }}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                    showCamera 
                      ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-md shadow-[var(--shadow-primary)]' 
                      : 'bg-[var(--bg-hover)] text-[var(--text-main)] border-[var(--border-light)] hover:border-[var(--primary)]'
                  }`}
                  title="Tirar foto da folha manuscrita"
                >
                  <Camera size={14} className={showCamera ? 'text-white' : 'text-blue-400'} />
                  <span>Câmera</span>
                </button>

                <button 
                  type="button"
                  id="btn-galeria"
                  onClick={() => { setShowGallery(!showGallery); setShowCamera(false); }}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                    showGallery 
                      ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-md shadow-[var(--shadow-primary)]' 
                      : 'bg-[var(--bg-hover)] text-[var(--text-main)] border-[var(--border-light)] hover:border-[var(--primary)]'
                  }`}
                  title="Enviar foto da galeria"
                >
                  <Share2 size={14} className={showGallery ? 'text-white' : 'text-blue-400'} />
                  <span>Galeria</span>
                </button>
              </div>
            </div>

            {/* SELETOR DE BANCA EM CARDS */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-[var(--text-label)] uppercase tracking-wider block">
                Banca Avaliadora Selecionada
              </label>
              
              <div id="banca-selector" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BANCAS_CORRIGEBOT.map((b) => {
                  const isSelected = vestibular === b.vestibular;
                  return (
                    <div
                      key={b.id}
                      id={`banca-card-${b.id}`}
                      data-banca={b.id}
                      onClick={() => {
                        setVestibular(b.vestibular);
                        setCorrection(null);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                        isSelected
                          ? 'border-[var(--primary)] bg-[var(--primary)]/10 ring-2 ring-[var(--primary)]/20 shadow-md shadow-[var(--shadow-primary)]'
                          : 'border-[var(--border-light)] bg-[var(--bg-hover)] hover:border-[var(--primary-border)] hover:bg-[var(--bg-card-elevated)]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-[var(--text-main)] tracking-wide">
                            {b.nome}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--bg-card)] border border-[var(--border-light)] text-[var(--text-muted)]">
                            {b.badge}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
                        )}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] mt-2 line-clamp-2 leading-relaxed">
                        {b.info}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DRAWER DA CÂMERA */}
            <AnimatePresence mode="wait">
              {showCamera && (
                <motion.div 
                  key="camera"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[var(--bg-hover)] rounded-2xl p-5 border border-[var(--border-light)]"
                >
                  <NativeCameraLauncher onImageCapture={(file) => {
                    handleImageEssayCorrection(file);
                  }} />
                </motion.div>
              )}

              {showGallery && (
                <motion.div 
                  key="gallery"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[var(--bg-hover)] rounded-2xl p-5 border border-[var(--border-light)]"
                >
                  <GalleryPicker onFilesSelect={(files) => {
                    if (files.length > 0) handleImageEssayCorrection(files[0]);
                  }} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* SELETOR DE PROPOSTA PARA UNICAMP */}
            {vestibular === Vestibular.UNICAMP && (
              <motion.div 
                id="unicamp-proposta" 
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] space-y-2"
              >
                <label className="text-xs font-bold text-[var(--text-main)] block">
                  Qual proposta da UNICAMP você está desenvolvendo?
                </label>
                <select
                  id="proposta-numero"
                  value={propostaNumero}
                  onChange={(e) => {
                    setPropostaNumero(parseInt(e.target.value, 10));
                    setCorrection(null);
                  }}
                  className="w-full p-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl text-xs sm:text-sm text-[var(--text-main)] font-semibold outline-none focus:border-[var(--primary)] cursor-pointer"
                >
                  <option value="1">Proposta 1 (dissertativa-argumentativa padrão)</option>
                  <option value="2">Proposta 2 (gênero específico: carta, artigo, discurso, manifesto)</option>
                </select>
              </motion.div>
            )}

            {/* CAMPO DE TEMA DA REDAÇÃO & CONTROLES IA */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-[var(--text-label)] uppercase tracking-wider">
                    Tema da Redação
                  </label>
                  {currentThemeItem?.eixo && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {currentThemeItem.eixo}
                    </span>
                  )}
                  {currentThemeItem?.obra && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {currentThemeItem.obra}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowMetodologia(!showMetodologia)}
                    className="text-xs font-bold text-[var(--text-muted)] hover:text-blue-400 flex items-center gap-1.5 cursor-pointer transition-colors py-1 px-2.5 rounded-lg bg-[var(--bg-hover)] border border-[var(--border-light)] hover:border-blue-500/30"
                    title="Ver critérios oficiais, pesos e regras de pontuação"
                  >
                    <BookOpen size={12} className="text-blue-400" />
                    <span>{showMetodologia ? 'Ocultar Critérios' : 'Critérios da Banca'}</span>
                  </button>

                  <button
                    type="button"
                    id="btn-gerar-tema"
                    onClick={handleGenerateAITheme}
                    disabled={isGenerating || isGeneratingSimilar}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50 py-1 px-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20"
                    title="Gera um novo tema inédito seguindo a banca atual"
                  >
                    {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    <span>Gerar Inédito</span>
                  </button>

                  <button
                    type="button"
                    id="btn-gerar-tema-semelhante"
                    onClick={() => handleGenerateSimilarTheme()}
                    disabled={isGenerating || isGeneratingSimilar || !selectedTheme.trim()}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50 py-1 px-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20"
                    title="Gera um tema correlato e no mesmo eixo temático do tema selecionado"
                  >
                    {isGeneratingSimilar ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                    <span>Gerar Semelhante com IA</span>
                  </button>
                </div>
              </div>

              {/* PAINEL DE METODOLOGIA & CRITÉRIOS DA BANCA */}
              <AnimatePresence>
                {showMetodologia && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-5 rounded-2xl bg-[var(--bg-hover)] border border-blue-500/30 space-y-4 text-xs overflow-hidden"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-[var(--border-light)]">
                      <div className="flex items-center gap-2">
                        <Shield size={16} className="text-blue-400" />
                        <span className="font-black text-sm text-[var(--text-main)]">
                          Metodologia Oficial de Avaliação — {activeBanca.nome}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowMetodologia(false)}
                        className="text-[var(--text-muted)] hover:text-white cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)]">
                        <div className="text-[10px] font-bold text-[var(--text-label)] uppercase">Escala de Pontuação</div>
                        <div className="text-xs font-black text-blue-400 mt-1">{activeBanca.escala}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)]">
                        <div className="text-[10px] font-bold text-[var(--text-label)] uppercase">Tipo Textual & Linhas</div>
                        <div className="text-xs font-black text-emerald-400 mt-1">
                          {activeBanca.tipoTexto} {activeBanca.limiteLinhas ? `(até ${activeBanca.limiteLinhas} linhas)` : ''}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)]">
                        <div className="text-[10px] font-bold text-[var(--text-label)] uppercase">Intervenção Social</div>
                        <div className="text-xs font-black text-purple-400 mt-1">
                          {activeBanca.exigeIntervencao ? 'Obrigatória (5 elementos)' : 'Não exigida (foco analítico)'}
                        </div>
                      </div>
                    </div>

                    {/* CRITÉRIOS AVALIADOS */}
                    <div className="space-y-2">
                      <div className="font-bold text-[var(--text-main)] uppercase tracking-wider text-[11px]">
                        Competências & Critérios Pontuados:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeBanca.criterios.map((crit) => (
                          <div key={crit.id} className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] space-y-1">
                            <div className="flex items-center justify-between font-bold text-[var(--text-main)]">
                              <span>{crit.id}. {crit.nome}</span>
                              <span className="text-blue-400 text-[10px] shrink-0 font-black">{crit.peso}</span>
                            </div>
                            <div className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                              {crit.desc}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* MOTIVOS DE ZERAMENTO */}
                    <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/30 space-y-1.5">
                      <div className="font-black text-red-400 flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
                        <AlertTriangle size={13} />
                        <span>Situações que ZERAM a redação nesta banca:</span>
                      </div>
                      <ul className="list-disc list-inside text-[11px] text-red-200/90 space-y-1 pl-1">
                        {activeBanca.zeramento.map((z, idx) => (
                          <li key={idx}>{z}</li>
                        ))}
                      </ul>
                    </div>

                    {/* DICA DE OURO */}
                    <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 text-[11px] leading-relaxed flex items-start gap-2">
                      <Lightbulb size={16} className="text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-amber-300">Dica de Ouro dos Corretores:</strong> {activeBanca.dicaOuro}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SELETOR RÁPIDO DE TEMAS OFICIAIS */}
              {themes.length > 0 && (
                <div className="relative">
                  <select
                    value={themes.find(t => t.theme === selectedTheme) ? selectedTheme : 'custom'}
                    onChange={(e) => {
                      if (e.target.value === 'custom') return;
                      const val = e.target.value;
                      setSelectedTheme(val);
                      setCorrection(null);
                      setAiJustificativa(null);
                      setAiSimilares([]);
                      if (vestibular === Vestibular.UNICAMP) {
                        if (val.includes('Proposta 2')) {
                          setPropostaNumero(2);
                        } else if (val.includes('Proposta 1')) {
                          setPropostaNumero(1);
                        }
                      }
                    }}
                    className="w-full bg-[var(--bg-hover)] border border-[var(--border-light)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-muted)] outline-none appearance-none cursor-pointer pr-8 truncate font-medium hover:border-[var(--border-color)] transition-all"
                  >
                    <option value="" disabled>Selecione um tema oficial do histórico {vestibular}...</option>
                    {themes.map((t, i) => (
                      <option key={i} value={t.theme} className="bg-[var(--bg-card)] text-[var(--text-main)]">
                        {t.year ? `${t.year}: ` : ''}{t.theme} {t.eixo ? `(${t.eixo})` : ''}
                      </option>
                    ))}
                    {selectedTheme && !themes.some(t => t.theme === selectedTheme) && (
                      <option value="custom">Tema personalizado: {selectedTheme}</option>
                    )}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-label)]">
                    <ChevronDown size={14} />
                  </div>
                </div>
              )}

              <input
                type="text"
                id="redacao-tema"
                value={selectedTheme}
                onChange={(e) => {
                  setSelectedTheme(e.target.value);
                  setCorrection(null);
                }}
                className="w-full px-4 py-3 border border-[var(--border-color)] rounded-xl text-xs sm:text-sm text-[var(--text-main)] bg-[var(--bg-input)] outline-none focus:border-[var(--primary)] transition-all placeholder-[var(--text-label)] font-medium"
                placeholder="Tema da redação (ex: Invisibilidade e registro civil: garantia de acesso à cidadania no Brasil)"
              />

              {/* EXPLICAÇÃO / JUSTIFICATIVA DA IA DO TEMA GERADO */}
              {aiJustificativa && (
                <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/30 flex items-start gap-2.5 text-xs text-blue-200">
                  <Sparkles size={14} className="text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-blue-300">Enquadramento da Banca {activeBanca.nome}:</strong> {aiJustificativa}
                  </div>
                </div>
              )}

              {/* SEÇÃO DE TEMAS SEMELHANTES & PROPOSTAS CORRELATAS */}
              {((currentThemeItem?.similares && currentThemeItem.similares.length > 0) || aiSimilares.length > 0) && (
                <div className="p-4 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers size={14} className="text-emerald-400" />
                      <span className="text-xs font-black text-[var(--text-main)] uppercase tracking-wider">
                        Temas Semelhantes & Desdobramentos da Proposta
                      </span>
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)] font-semibold">
                      Clique para treinar com este recorte
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {Array.from(new Set([
                      ...(currentThemeItem?.similares || []),
                      ...aiSimilares
                    ])).map((similar, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedTheme(similar);
                          setCorrection(null);
                          showToast('success', 'Tema adotado!');
                        }}
                        className="text-left p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-emerald-500/40 hover:bg-emerald-950/10 text-xs font-medium text-[var(--text-main)] transition-all flex items-center justify-between gap-3 group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                          <span className="group-hover:text-emerald-300 transition-colors">{similar}</span>
                        </div>
                        <ArrowRight size={13} className="text-[var(--text-label)] group-hover:text-emerald-400 shrink-0 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* COLETÂNEA OFICIAL DE TEXTOS MOTIVADORES UNESP 2025 */}
              {selectedTheme.toLowerCase().includes('medicalização') && (
                <div className="mt-3 p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-xs font-black text-amber-400 uppercase tracking-wide">
                        Caderno Oficial UNESP 2025 — Coletânea de Textos Motivadores
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowMotivadores(!showMotivadores)}
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
                    >
                      {showMotivadores ? 'Recolher Textos ▲' : 'Ler Textos de Apoio ▼'}
                    </button>
                  </div>

                  {showMotivadores && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4 pt-3 border-t border-amber-500/20 text-xs text-[#E5E5E5] leading-relaxed"
                    >
                      <div className="p-3.5 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] text-amber-200">
                        <strong>Comando da Prova:</strong> {UNESP_2025_REDACAO.instrucoes}
                      </div>

                      {UNESP_2025_REDACAO.textosMotivadores.map((t) => (
                        <div key={t.numero} className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] space-y-2">
                          <div className="flex items-center justify-between font-bold text-amber-400">
                            <span>Texto {t.numero}{t.titulo ? `: ${t.titulo}` : ''}</span>
                            <span className="text-[10px] text-[var(--text-muted)] font-normal">{t.fonte}</span>
                          </div>
                          <p className="whitespace-pre-line text-[var(--text-muted)]">{t.conteudo}</p>
                        </div>
                      ))}

                      <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-100 space-y-2">
                        <strong className="text-amber-400 block text-xs">Critérios & Comentário da Banca VUNESP:</strong>
                        <p className="whitespace-pre-line text-[11px] leading-relaxed text-zinc-300">
                          {UNESP_2025_REDACAO.comentarioBanca}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* TEXTAREA DA REDAÇÃO */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <label className="font-bold uppercase tracking-wider text-[var(--text-label)]">
                  Texto da Redação
                </label>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-[var(--text-main)]">{wordCount} palavras</span>
                  <span>•</span>
                  <span className="font-semibold text-[var(--text-main)]">~{lineCount} linhas</span>
                  <span>•</span>
                  <span className={charCount > 12000 ? 'text-red-400 font-bold' : 'text-[var(--text-muted)]'}>
                    {charCount}/12000 carac.
                  </span>
                </div>
              </div>

              <textarea
                id="redacao-texto"
                value={essayText}
                onChange={(e) => {
                  setEssayText(e.target.value);
                  setCorrection(null);
                }}
                rows={15}
                className="w-full p-4 sm:p-5 border border-[var(--border-color)] rounded-2xl text-xs sm:text-sm text-[var(--text-main)] bg-[var(--bg-input)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all resize-vertical leading-relaxed font-sans placeholder-[var(--text-label)]"
                placeholder="Cole ou digite sua redação completa aqui. Respeite as regras de linhas da banca escolhida..."
              />

              {/* FERRAMENTA DE TRANSCRIÇÃO DE ÁUDIO E SALVAR RASCUNHO */}
              <div className="flex items-center justify-between pt-1">
                <AudioTranscriber
                  compact={true}
                  onTranscriptionComplete={(text) => {
                    setEssayText((prev) => (prev ? `${prev.trim()}\n${text}` : text));
                    setCorrection(null);
                  }}
                />
                
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1.5 transition-colors cursor-pointer py-1.5 px-3 rounded-lg hover:bg-[var(--bg-hover)]"
                >
                  {saveSuccess ? (
                    <>
                      <Check size={14} className="text-emerald-400" />
                      <span className="text-emerald-400">Rascunho salvo</span>
                    </>
                  ) : (
                    <>
                      <Clock size={14} />
                      <span>Salvar rascunho</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* BOTÃO PRINCIPAL DE CORREÇÃO */}
            <button
              type="button"
              id="btn-corrigir"
              onClick={handleAnalyzeEssay}
              disabled={isAnalyzing || !essayText.trim() || !selectedTheme.trim()}
              className="w-full py-4 px-6 rounded-2xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm sm:text-base tracking-wide shadow-lg shadow-[var(--shadow-primary)] transition-all flex items-center justify-center gap-2.5 cursor-pointer hover:-translate-y-0.5"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={18} className="animate-spin text-white" />
                  <span>Avaliando critérios oficiais... aguarde alguns segundos</span>
                </>
              ) : (
                <>
                  <Award size={18} />
                  <span>Submeter para Correção Oficial CorrigeBot</span>
                </>
              )}
            </button>

            {/* ========== SEÇÃO DE RESULTADO DO CORRIGEBOT ========== */}
            {correction && (
              <motion.div 
                id="redacao-resultado"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 pt-8 border-t border-[var(--border-light)] space-y-6"
              >
                {/* 1. NOTA OU CONCEITO / ZERADA */}
                {correction.zerada ? (
                  <div 
                    id="box-redacao-zerada"
                    className="p-6 rounded-2xl text-center border-2 border-red-500/50 bg-red-950/20 shadow-lg"
                  >
                    <div className="text-2xl sm:text-3xl font-black text-red-400 tracking-tight flex items-center justify-center gap-2">
                      <AlertTriangle size={28} />
                      <span>REDAÇÃO ZERADA</span>
                    </div>
                    <div className="text-xs sm:text-sm text-red-200 mt-2 font-medium max-w-xl mx-auto leading-relaxed">
                      {correction.motivo_zeramento || 'Não atendimento aos critérios essenciais da banca examinadora.'}
                    </div>
                  </div>
                ) : (correction.nota_final !== undefined && correction.nota_final !== null) ? (
                  <div 
                    id="box-nota-final"
                    className="p-6 rounded-2xl text-center border border-[var(--primary-border)] bg-gradient-to-r from-blue-900/40 via-blue-800/30 to-indigo-900/40 shadow-xl"
                  >
                    <div className="text-5xl sm:text-6xl font-black text-white tracking-tight">
                      {correction.nota_final}
                    </div>
                    <div className="text-xs font-black text-blue-300 mt-2 uppercase tracking-widest">
                      {activeBanca.notaMaxima 
                        ? `Nota Final Oficial · ${activeBanca.nome} (Escala 0 a ${activeBanca.notaMaxima} Pontos)`
                        : `Nota Final Oficial · ${activeBanca.nome}`}
                    </div>
                  </div>
                ) : correction.conceito_geral ? (
                  <div 
                    id="box-conceito-geral"
                    className="p-6 rounded-2xl text-center border border-emerald-500/30 bg-emerald-950/30 shadow-xl"
                  >
                    <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
                      {correction.conceito_geral}
                    </div>
                    <div className="text-xs font-black text-emerald-300 mt-2 uppercase tracking-widest">
                      Conceito Geral Avaliado — {correction.banca_nome || vestibular}
                    </div>
                  </div>
                ) : (
                  <div 
                    id="box-nota-generica"
                    className="p-6 rounded-2xl text-center border border-[var(--primary-border)] bg-[var(--primary)]/15 shadow-xl"
                  >
                    <div className="text-4xl sm:text-5xl font-black text-white">
                      {correction.grade}
                    </div>
                    <div className="text-xs font-black text-blue-300 mt-2 uppercase tracking-widest">
                      Pontuação Avaliada — {vestibular}
                    </div>
                  </div>
                )}

                {/* 2. COMPETÊNCIAS DA BANCA */}
                <div className="space-y-3">
                  <div className="text-xs font-black text-[var(--text-label)] uppercase tracking-widest px-1 flex items-center gap-2">
                    <Shield size={14} className="text-blue-400" />
                    <span>Critérios & Competências Oficiais da Banca</span>
                  </div>

                  <div className="space-y-3">
                    {(correction.competencies || []).map((comp, idx) => (
                      <div 
                        key={idx}
                        className="p-5 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] hover:border-[var(--border-color)] transition-all space-y-2.5 shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-black text-[var(--text-main)] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                            <span>C{comp.id || (idx + 1)} — {comp.nome || comp.name}</span>
                          </div>
                          {comp.nota !== undefined ? (
                            <div className="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-black text-sm shrink-0">
                              {comp.nota}/{comp.nota_max || 200}
                            </div>
                          ) : comp.conceito ? (
                            <div className="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-black text-xs shrink-0">
                              {comp.conceito}
                            </div>
                          ) : (
                            <div className="px-3 py-1 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 font-black text-xs shrink-0">
                              {comp.score} pts
                            </div>
                          )}
                        </div>
                        <div className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed pl-4 border-l-2 border-[var(--border-color)]">
                          {comp.comentario || comp.strengths || comp.weaknesses}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. PONTOS FORTES */}
                {correction.pontos_fortes && correction.pontos_fortes.length > 0 && (
                  <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2.5 shadow-sm">
                    <div className="text-xs sm:text-sm font-black text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      <span>Pontos Fortes Demonstrados</span>
                    </div>
                    <div className="space-y-1.5 text-xs sm:text-sm text-emerald-200/90 leading-relaxed pl-1">
                      {correction.pontos_fortes.map((p, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. PONTOS DE MELHORIA */}
                {correction.pontos_melhoria && correction.pontos_melhoria.length > 0 && (
                  <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2.5 shadow-sm">
                    <div className="text-xs sm:text-sm font-black text-amber-400 flex items-center gap-2">
                      <AlertTriangle size={16} />
                      <span>Oportunidades de Melhoria & Ajustes</span>
                    </div>
                    <div className="space-y-1.5 text-xs sm:text-sm text-amber-200/90 leading-relaxed pl-1">
                      {correction.pontos_melhoria.map((p, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. MODELO DE PROPOSTA DE INTERVENÇÃO (ENEM) */}
                {correction.sugestao_proposta_intervencao && (
                  <div className="p-5 rounded-2xl bg-blue-950/20 border border-blue-500/30 space-y-3 shadow-sm">
                    <div className="text-xs sm:text-sm font-black text-blue-400 flex items-center gap-2">
                      <Lightbulb size={16} />
                      <span>Modelo Exemplar de Proposta de Intervenção Social (ENEM)</span>
                    </div>
                    <div className="text-xs sm:text-sm text-blue-200/90 leading-relaxed space-y-2 bg-[var(--bg-card)]/50 p-4 rounded-xl border border-blue-500/20">
                      <div><b className="text-white">1. Agente Responsável:</b> {correction.sugestao_proposta_intervencao.agente || '—'}</div>
                      <div><b className="text-white">2. Ação Concreta:</b> {correction.sugestao_proposta_intervencao.acao || '—'}</div>
                      <div><b className="text-white">3. Meio / Modo de Execução:</b> {correction.sugestao_proposta_intervencao.meio || '—'}</div>
                      <div><b className="text-white">4. Finalidade / Efeito Esperado:</b> {correction.sugestao_proposta_intervencao.finalidade || '—'}</div>
                      <div><b className="text-white">5. Detalhamento & Especificidade:</b> {correction.sugestao_proposta_intervencao.detalhamento || '—'}</div>
                    </div>
                  </div>
                )}

                {/* 6. PARECER GERAL DO CORRETOR */}
                {(correction.parecer_geral || correction.generalCorrection) && (
                  <div className="p-5 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] space-y-2.5 shadow-sm">
                    <div className="text-xs sm:text-sm font-black text-[var(--text-main)] flex items-center gap-2">
                      <BookOpen size={16} className="text-blue-400" />
                      <span>Parecer Pedagógico Geral da Banca</span>
                    </div>
                    <div className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-line pl-1">
                      {correction.parecer_geral || correction.generalCorrection}
                    </div>
                  </div>
                )}

              </motion.div>
            )}

          </div>

        </div>

        {/* SIDEBAR LATERAL (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* HISTÓRICO DE REDAÇÕES */}
          <div className="bg-[var(--bg-card)] rounded-3xl p-6 border border-[var(--border-light)] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-light)]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                  <History size={16} />
                </div>
                <h3 className="font-black text-sm text-[var(--text-main)]">
                  Histórico de Redações
                </h3>
              </div>
              <span className="text-xs font-black text-[var(--text-muted)] bg-[var(--bg-hover)] px-2.5 py-1 rounded-full border border-[var(--border-light)]">
                {essayHistory.length}
              </span>
            </div>
            
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {essayHistory.map((h) => (
                <div 
                  key={h.id} 
                  onClick={() => handleLoadEssay(h)}
                  className="p-3.5 rounded-2xl bg-[var(--bg-hover)] hover:bg-[var(--bg-card-elevated)] border border-[var(--border-light)] hover:border-[var(--primary)] transition-all cursor-pointer space-y-2 group shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-xs text-[var(--text-main)] line-clamp-1 group-hover:text-blue-400 transition-colors">
                      {h.theme}
                    </p>
                    {h.status === 'corrected' && (
                      <span className="px-2 py-0.5 rounded-lg bg-[var(--primary)]/20 border border-[var(--primary-border)] text-blue-300 font-black text-[10px] shrink-0">
                        {h.nota_final !== undefined && h.nota_final !== null
                          ? `${h.nota_final} pts`
                          : h.conceito_geral
                          ? h.conceito_geral
                          : `${h.grade ?? 0} pts`}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-medium">
                    <span>
                      {h.timestamp ? h.timestamp.toDate().toLocaleDateString('pt-BR') : 'Hoje'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider text-[9px] ${
                      h.status === 'corrected' 
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' 
                        : 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                    }`}>
                      {h.status === 'corrected' ? 'Corrigida' : 'Rascunho'}
                    </span>
                  </div>
                </div>
              ))}
              
              {essayHistory.length === 0 && (
                <div className="text-center py-8 space-y-2">
                  <div className="w-10 h-10 bg-[var(--bg-hover)] border border-[var(--border-light)] rounded-2xl flex items-center justify-center mx-auto text-[var(--text-label)]">
                    <FileText size={18} />
                  </div>
                  <p className="text-xs font-medium text-[var(--text-muted)]">
                    Nenhuma redação registrada no seu histórico ainda.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* DICAS OFICIAIS DE REDAÇÃO */}
          <div className="bg-[var(--bg-card)] rounded-3xl p-6 border border-[var(--border-light)] shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--border-light)]">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Lightbulb size={16} />
              </div>
              <h3 className="font-black text-sm text-[var(--text-main)]">
                Guia Rápido por Banca
              </h3>
            </div>
            
            <div className="space-y-3 text-xs max-h-[500px] overflow-y-auto pr-1">
              <div className="p-3.5 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] hover:border-blue-500/30 transition-all">
                <div className="font-black text-blue-400">ENEM (0 a 1000)</div>
                <div className="text-[var(--text-muted)] mt-1 leading-relaxed font-medium">
                  5 competências de 200 pts. Proposta de intervenção social obrigatória com Agente, Ação, Meio, Efeito e Detalhamento.
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] hover:border-purple-500/30 transition-all">
                <div className="font-black text-purple-400">FUVEST — USP (0 a 50)</div>
                <div className="text-[var(--text-muted)] mt-1 leading-relaxed font-medium">
                  Rigor reflexivo e filosófico (Tema 20, Estrutura 15, Linguagem 15). NÃO exige intervenção social. Obras obrigatórias e densidade crítica.
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] hover:border-emerald-500/30 transition-all">
                <div className="font-black text-emerald-400">UNICAMP (Gêneros Sociais)</div>
                <div className="text-[var(--text-muted)] mt-1 leading-relaxed font-medium">
                  2 propostas temáticas com gêneros textuais específicos da vida social (carta, artigo, manifesto, crônica). Avalia a máscara autoral e interlocução.
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] hover:border-amber-500/30 transition-all">
                <div className="font-black text-amber-400">UNESP — VUNESP (0 a 28)</div>
                <div className="text-[var(--text-muted)] mt-1 leading-relaxed font-medium">
                  Tema apresentado como pergunta problematizadora (Tema 8, Estrutura 10, Expressão 10). Tese clara e posicionamento explícito na introdução.
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] hover:border-rose-500/30 transition-all">
                <div className="font-black text-rose-400">UERJ (0 a 10)</div>
                <div className="text-[var(--text-muted)] mt-1 leading-relaxed font-medium">
                  Tema centrado na obra literária obrigatória do edital (Tema/Obra 4, Estrutura 3, Gramática 3). Foco na reflexão crítica sobre a condição humana.
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] hover:border-cyan-500/30 transition-all">
                <div className="font-black text-cyan-400">ITA (0 a 10)</div>
                <div className="text-[var(--text-muted)] mt-1 leading-relaxed font-medium">
                  Rigor analítico implacável (4 critérios de 2,5 pts). Lógica causal estrita, ausência de falácias e zero tolerância a chavões e adjetivações vazias.
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] hover:border-sky-500/30 transition-all">
                <div className="font-black text-sky-400">IME (0 a 10)</div>
                <div className="text-[var(--text-muted)] mt-1 leading-relaxed font-medium">
                  Foco em soberania nacional, inovação científica, ética e defesa (Tema 3,0, Estrutura 3,0, Gramática 2,5, Concisão 1,5).
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] hover:border-indigo-500/30 transition-all">
                <div className="font-black text-indigo-400">FGV (0 a 10)</div>
                <div className="text-[var(--text-muted)] mt-1 leading-relaxed font-medium">
                  Análise socioeconômica, jurídica e institucional (4 critérios de 2,5 pts). Projeto de texto lúcido com dados e teorias sólidas.
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] hover:border-teal-500/30 transition-all">
                <div className="font-black text-teal-400">MACKENZIE (0 a 10)</div>
                <div className="text-[var(--text-muted)] mt-1 leading-relaxed font-medium">
                  Ética, cidadania ativa, família e responsabilidade social (Tema 3,0, Estrutura 3,0, Coesão 2,0, Norma 2,0).
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] hover:border-yellow-500/30 transition-all">
                <div className="font-black text-yellow-400">PUC-SP (0 a 100)</div>
                <div className="text-[var(--text-muted)] mt-1 leading-relaxed font-medium">
                  Perspectiva humanista centrada nos direitos humanos e justiça social (4 critérios de 25 pts cada). Repúdio a retrocessos civilizatórios.
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] hover:border-red-400/30 transition-all">
                <div className="font-black text-red-300">UNIFESP — Misto (0 a 100)</div>
                <div className="text-[var(--text-muted)] mt-1 leading-relaxed font-medium">
                  Prova formulada pela VUNESP (Tema 30, Estrutura 40, Expressão 30). Grande foco em bioética, saúde pública, ciência e sociedade.
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
