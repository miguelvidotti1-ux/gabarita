import React, { useState, useMemo } from 'react';
import { 
  FileText, Search, Filter, Download, 
  CheckCircle2, ChevronRight, FileSpreadsheet, 
  ChevronDown, Calendar, GraduationCap, ArrowLeft, X,
  Sparkles, Award, Trophy, Play, RefreshCw, BarChart2,
  TrendingUp, Check, AlertCircle, HelpCircle, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Vestibular, GabaritoOficial } from '../types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generates rich sample questions with realistic content based on exam subjects
const generateRichQuestions = (exame: Vestibular, dia: number) => {
  const subjects = {
    [Vestibular.ENEM]: dia === 1 
      ? ['Linguagens e Códigos', 'Ciências Humanas'] 
      : ['Ciências da Natureza', 'Matemática'],
    [Vestibular.FUVEST]: ['Português e Literatura', 'História e Geografia', 'Física e Química', 'Biologia', 'Matemática']
  };

  const currentSubjects = subjects[exame as keyof typeof subjects] || ['Conhecimentos Gerais'];
  const answerKeys = ['A', 'B', 'C', 'D', 'E'];

  const realProblemTemplates = [
    {
      enunciado: "Considerando a crise hídrica global e os crescentes desafios de saneamento urbano básico no Brasil, qual das opções a seguir propõe a solução sustentável mais eficiente sob a perspectiva da engenharia ecológica moderna?",
      alternativas: [
        "Captação direta de lençóis subterrâneos profundos sem tratamento prévio.",
        "Implementação obrigatória de sistemas descentralizados de filtragem por fitorrestauração e wetlands nas periferias urbanas.",
        "Privatização total de mananciais de água para regular o consumo pelo preço de mercado de alta demanda.",
        "Transferência artificial de bacias hidrográficas em larga escala através de megaborbardeamento mecânico.",
        "Substituição de redes de distribuição tradicionais por caminhões-pipa autônomos movidos a energia solar."
      ],
      justificativa: "A fitorrestauração utilizando wetlands construídas promove o tratamento biológico descentralizado de águas cinzas de maneira extremamente econômica, regenerando ecótopos locais."
    },
    {
      enunciado: "O movimento estético do Modernismo no Brasil, consolidado na histórica Semana de Arte Moderna de 1922, representou uma ruptura drástica com a tradição acadêmica acadêmica anterior. Que aspecto central define a proposta antropofágica de Oswald de Andrade?",
      alternativas: [
        "A cópia fiel dos modelos expressionistas e futuristas europeus sem alterações temáticas nacionais.",
        "A rejeição absoluta de qualquer influência artística vinda do exterior do país.",
        "A assimilação crítica da bagagem cultural estrangeira para recriá-la com teor nativo e original brasileiro.",
        "O resgate purista e inalterado da literatura jesuítica do período colonial.",
        "A subordinação da estética literária aos rígidos padrões formais do parnasianismo luso."
      ],
      justificativa: "A antropofagia propõe deglutir a cultura colonizadora estrangeira, reprocessando seus elementos para criar uma arte puramente brasileira, moderna e irreverente."
    },
    {
      enunciado: "Uma espira condutora circular, imersa em um campo magnético uniforme de intensidade variável, experimenta uma corrente induzida conforme previsto pelas leis da eletrodinâmica clássica de Faraday-Lenz. A respeito do sentido da corrente elétrica induzida, está correto afirmar que:",
      alternativas: [
        "O sentido será sempre no sentido horário para anular qualquer campo presente.",
        "O sentido da corrente gera um campo magnético que se opõe à variação do fluxo magnético original.",
        "A intensidade da corrente induzida independe da velocidade de variação do fluxo magnético externo.",
        "O fluxo de elétrons induzido migra com velocidade infinita em regime estacionário constante.",
        "O efeito fotoelétrico adjacente impede a flutuação direcional do vetor induzido livre."
      ],
      justificativa: "De acordo com a Lei de Lenz, a corrente elétrica induzida apresenta sentido tal que seu próprio efeito magnético se opõe à variação do fluxo que a produziu."
    },
    {
      enunciado: "Em uma floresta tropical primária temperada, a dinâmica populacional de produtores e consumidores é estritamente afetada pela introdução acidental de uma espécie exótica invasora de hábitos herbívoros generalistas sem predadores naturais no ecossistema local. Esta perturbação ecológica resulta diretamente em:",
      alternativas: [
        "Aumento imediato da biodiversidade nativa de consumidores secundários e terciários.",
        "Redução drástica da biomassa dos produtores primários locais e desequilíbrio das teias tróficas subsequentes.",
        "Estabilização imediata da capacidade de carga total daquele nicho biogeográfico.",
        "Neutralização da competição intraespecífica e interespecífica dos mamíferos de grande porte.",
        "Expansão homogênea de ecossistemas clímax para todos os biomas florestais adjacentes."
      ],
      justificativa: "Sem predadores naturais e com hábitos generalistas, a espécie exótica consome excessivamente os produtores primários nativos, desencadeando um efeito cascata que compromete toda a estabilidade trófica."
    },
    {
      enunciado: "Analise a função quadrática f(x) = -2x² + 12x - 10, que descreve a curva de lucro estimado de uma startup educacional de tecnologia em milhares de reais. O lucro máximo alcançável por essa empresa e o número correspondente de assinaturas ativas vendidas (x) estão corretamente expressos por:",
      alternativas: [
        "Lucro máximo de R$ 8.000,00 quando comercializadas 3.000 assinaturas.",
        "Lucro máximo de R$ 10.000,00 quando comercializadas 5.000 assinaturas.",
        "Lucro máximo de R$ 12.000,00 quando comercializadas 2.000 assinaturas.",
        "Lucro máximo de R$ 6.000,00 quando comercializadas 3.000 assinaturas.",
        "Lucro máximo de R$ 14.000,00 quando comercializadas 4.000 assinaturas."
      ],
      justificativa: "Calculando o vértice da parábola: Xv = -b / (2a) = -12 / (-4) = 3. Substituindo na função: Yv = -2(3)² + 12(3) - 10 = -18 + 36 - 10 = 8. Logo, o pico é de 8 unidades de lucro para x = 3."
    }
  ];

  const totalQuestionsList = Array.from({ length: 90 }, (_, i) => {
    // Determine subject based on index
    const subjectIndex = Math.floor((i / 90) * currentSubjects.length);
    const disciplina = currentSubjects[subjectIndex] || currentSubjects[0];
    
    // Pick template index or generate custom
    const template = realProblemTemplates[i % realProblemTemplates.length];
    const correctLetter = answerKeys[Math.floor((Math.sin(i + 13) + 1) * 2.5) % 5]; // deterministic pseudorandom answer key

    return {
      numero: i + 1,
      resposta: correctLetter,
      disciplina: disciplina,
      enunciado: template.enunciado,
      alternativas: template.alternativas,
      justificativa: template.justificativa
    };
  });

  return totalQuestionsList;
};

const SAMPLE_GABARITOS: GabaritoOficial[] = [
  {
    id: 'enem-2023-d1',
    exame: Vestibular.ENEM,
    ano: 2023,
    dia: 1,
    caderno: 'Azul',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2023-d2',
    exame: Vestibular.ENEM,
    ano: 2023,
    dia: 2,
    caderno: 'Cinza',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'enem-2014-d1-azul',
    exame: Vestibular.ENEM,
    ano: 2014,
    dia: 1,
    caderno: 'Azul',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2014-d1-amarelo',
    exame: Vestibular.ENEM,
    ano: 2014,
    dia: 1,
    caderno: 'Amarelo',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2014-d1-branco',
    exame: Vestibular.ENEM,
    ano: 2014,
    dia: 1,
    caderno: 'Branco',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2014-d1-rosa',
    exame: Vestibular.ENEM,
    ano: 2014,
    dia: 1,
    caderno: 'Rosa',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2014-d2-amarelo',
    exame: Vestibular.ENEM,
    ano: 2014,
    dia: 2,
    caderno: 'Amarelo',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'enem-2014-d2-cinza',
    exame: Vestibular.ENEM,
    ano: 2014,
    dia: 2,
    caderno: 'Cinza',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'enem-2014-d2-azul',
    exame: Vestibular.ENEM,
    ano: 2014,
    dia: 2,
    caderno: 'Azul',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'enem-2014-d2-rosa',
    exame: Vestibular.ENEM,
    ano: 2014,
    dia: 2,
    caderno: 'Rosa',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'enem-2013-d1-azul',
    exame: Vestibular.ENEM,
    ano: 2013,
    dia: 1,
    caderno: 'Azul',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2013-d1-amarelo',
    exame: Vestibular.ENEM,
    ano: 2013,
    dia: 1,
    caderno: 'Amarelo',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2013-d1-branco',
    exame: Vestibular.ENEM,
    ano: 2013,
    dia: 1,
    caderno: 'Branco',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2013-d1-rosa',
    exame: Vestibular.ENEM,
    ano: 2013,
    dia: 1,
    caderno: 'Rosa',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2013-d2-amarelo',
    exame: Vestibular.ENEM,
    ano: 2013,
    dia: 2,
    caderno: 'Amarelo',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'enem-2013-d2-cinza',
    exame: Vestibular.ENEM,
    ano: 2013,
    dia: 2,
    caderno: 'Cinza',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'enem-2013-d2-azul',
    exame: Vestibular.ENEM,
    ano: 2013,
    dia: 2,
    caderno: 'Azul',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'enem-2013-d2-rosa',
    exame: Vestibular.ENEM,
    ano: 2013,
    dia: 2,
    caderno: 'Rosa',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'enem-2012-d1-azul',
    exame: Vestibular.ENEM,
    ano: 2012,
    dia: 1,
    caderno: 'Azul',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2012-d1-amarelo',
    exame: Vestibular.ENEM,
    ano: 2012,
    dia: 1,
    caderno: 'Amarelo',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2012-d1-branco',
    exame: Vestibular.ENEM,
    ano: 2012,
    dia: 1,
    caderno: 'Branco',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2012-d1-rosa',
    exame: Vestibular.ENEM,
    ano: 2012,
    dia: 1,
    caderno: 'Rosa',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2012-d2-amarelo',
    exame: Vestibular.ENEM,
    ano: 2012,
    dia: 2,
    caderno: 'Amarelo',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'enem-2012-d2-cinza',
    exame: Vestibular.ENEM,
    ano: 2012,
    dia: 2,
    caderno: 'Cinza',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'enem-2012-d2-azul',
    exame: Vestibular.ENEM,
    ano: 2012,
    dia: 2,
    caderno: 'Azul',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'enem-2012-d2-rosa',
    exame: Vestibular.ENEM,
    ano: 2012,
    dia: 2,
    caderno: 'Rosa',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'enem-2011-d1-azul',
    exame: Vestibular.ENEM,
    ano: 2011,
    dia: 1,
    caderno: 'Azul',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2011-d1-amarelo',
    exame: Vestibular.ENEM,
    ano: 2011,
    dia: 1,
    caderno: 'Amarelo',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2011-d1-branco',
    exame: Vestibular.ENEM,
    ano: 2011,
    dia: 1,
    caderno: 'Branco',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2011-d1-rosa',
    exame: Vestibular.ENEM,
    ano: 2011,
    dia: 1,
    caderno: 'Rosa',
    questoes: generateRichQuestions(Vestibular.ENEM, 1)
  },
  {
    id: 'enem-2011-d2-amarelo',
    exame: Vestibular.ENEM,
    ano: 2011,
    dia: 2,
    caderno: 'Amarelo',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'enem-2011-d2-cinza',
    exame: Vestibular.ENEM,
    ano: 2011,
    dia: 2,
    caderno: 'Cinza',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'enem-2011-d2-azul',
    exame: Vestibular.ENEM,
    ano: 2011,
    dia: 2,
    caderno: 'Azul',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'enem-2011-d2-rosa',
    exame: Vestibular.ENEM,
    ano: 2011,
    dia: 2,
    caderno: 'Rosa',
    questoes: generateRichQuestions(Vestibular.ENEM, 2)
  },
  {
    id: 'fuvest-2024',
    exame: Vestibular.FUVEST,
    ano: 2024,
    dia: 1,
    caderno: 'V',
    questoes: generateRichQuestions(Vestibular.FUVEST, 1)
  }
];

export default function GabaritosOficiais() {
  const [selectedGabarito, setSelectedGabarito] = useState<GabaritoOficial | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<{
    numero: number;
    resposta: string;
    disciplina: string;
    enunciado?: string;
    alternativas?: string[];
    justificativa?: string;
  } | null>(null);

  // Filters and searches
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExame, setFilterExame] = useState<string>('Todos');
  const [filterAno, setFilterAno] = useState<string>('Todos');
  
  // Specific view state once a template is opened
  const [activeTab, setActiveTab] = useState<'view' | 'simulate' | 'stats'>('view');
  
  // Simulation Answers state (User filling their choices to see score)
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [subjectFilterInside, setSubjectFilterInside] = useState<string>('Todos');

  const filteredList = useMemo(() => {
    return SAMPLE_GABARITOS.filter(g => {
      const matchesSearch = g.exame.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           g.caderno.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesExame = filterExame === 'Todos' || g.exame === filterExame;
      const matchesAno = filterAno === 'Todos' || String(g.ano) === filterAno;
      return matchesSearch && matchesExame && matchesAno;
    });
  }, [searchTerm, filterExame, filterAno]);

  const examsList = Array.from(new Set(SAMPLE_GABARITOS.map(g => g.exame)));
  const yearsList = Array.from(new Set(SAMPLE_GABARITOS.map(g => String(g.ano))));

  // Filter study questions based on interior filters
  const interiorFilteredQuestions = useMemo(() => {
    if (!selectedGabarito) return [];
    return selectedGabarito.questoes.filter(q => {
      return subjectFilterInside === 'Todos' || q.disciplina === subjectFilterInside;
    });
  }, [selectedGabarito, subjectFilterInside]);

  const insideSubjectsList = useMemo(() => {
    if (!selectedGabarito) return [];
    return Array.from(new Set(selectedGabarito.questoes.map(q => q.disciplina)));
  }, [selectedGabarito]);

  // Answer distribution calculation for stats view
  const distributionStats = useMemo(() => {
    if (!selectedGabarito) return { total: 0, distribute: {} as Record<string, number>, pct: {} as Record<string, string> };
    const distribute: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    selectedGabarito.questoes.forEach(q => {
      distribute[q.resposta] = (distribute[q.resposta] || 0) + 1;
    });
    const total = selectedGabarito.questoes.length;
    const pct: Record<string, string> = {};
    Object.keys(distribute).forEach(key => {
      pct[key] = total > 0 ? ((distribute[key] / total) * 100).toFixed(1) : '0';
    });
    return { total, distribute, pct };
  }, [selectedGabarito]);

  // Simulation scores
  const simulationResults = useMemo(() => {
    if (!selectedGabarito) return { correct: 0, total: 0, percentage: 0 };
    let correct = 0;
    selectedGabarito.questoes.forEach(q => {
      if (userAnswers[q.numero] === q.resposta) {
        correct++;
      }
    });
    const total = selectedGabarito.questoes.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { correct, total, percentage };
  }, [selectedGabarito, userAnswers]);

  const getAnswerColor = (letter: string) => {
    const colors: Record<string, string> = {
      A: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40',
      B: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40',
      C: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40',
      D: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border border-violet-200 dark:border-violet-800/40',
      E: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40'
    };
    return colors[letter] || 'bg-slate-100 text-slate-600';
  };

  const getAnswerSimpleHover = (letter: string) => {
    const colors: Record<string, string> = {
      A: 'hover:border-indigo-400 dark:hover:border-indigo-500',
      B: 'hover:border-emerald-400 dark:hover:border-emerald-500',
      C: 'hover:border-amber-400 dark:hover:border-amber-500',
      D: 'hover:border-violet-400 dark:hover:border-violet-500',
      E: 'hover:border-rose-400 dark:hover:border-rose-500'
    };
    return colors[letter] || '';
  };

  const handleSimulateAnswerChange = (numero: number, letter: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [numero]: prev[numero] === letter ? '' : letter
    }));
  };

  const autofillCorrect = () => {
    if (!selectedGabarito) return;
    const correctAnswers: Record<number, string> = {};
    selectedGabarito.questoes.forEach(q => {
      correctAnswers[q.numero] = q.resposta;
    });
    setUserAnswers(correctAnswers);
  };

  const clearSimulation = () => {
    setUserAnswers({});
  };

  // Excel formatting client-side file exporter
  const triggerSpreadsheetDownload = (gabarito: GabaritoOficial) => {
    const content = gabarito.questoes.map(q => ({
      'Questão': q.numero,
      'Gabarito Oficial': q.resposta,
      'Área de Conhecimento': q.disciplina,
      'Enunciado': q.enunciado || '',
      'Explicativa': q.justificativa || ''
    }));

    const feedbackSpreadsheetString = "data:text/csv;charset=utf-8," 
      + ["Questão,Gabarito,Componente,Explicativa"].join(",") + "\n"
      + content.map(e => `${e.Questão},${e['Gabarito Oficial']},"${e['Área de Conhecimento']}","${e.Explicativa.replace(/"/g, '""')}"`).join("\n");
    
    const encodedUri = encodeURI(feedbackSpreadsheetString);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Gabarito_Oficial_${gabarito.exame}_${gabarito.ano}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (selectedGabarito) {
    return (
      <div className="space-y-8 pb-12 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button 
            onClick={() => {
              setSelectedGabarito(null);
              clearSimulation();
            }}
            id="btn-voltar-index"
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold transition-all group px-4 py-2 bg-slate-100 dark:bg-slate-900 border dark:border-slate-800 rounded-xl"
          >
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            Voltar para Biblioteca
          </button>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => triggerSpreadsheetDownload(selectedGabarito)}
              className="flex items-center gap-2 text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/10 active:scale-95"
            >
              <Download size={15} />
              Salvar Planilha (.CSV)
            </button>
          </div>
        </div>

        {/* Premium Header Container */}
        <div className="bg-slate-950 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden border border-slate-800 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[130px] rounded-full -mr-48 -mt-48 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/5 blur-[150px] rounded-full -ml-48 -mb-48 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                <Sparkles size={12} className="animate-pulse" />
                Vestibular Conectado
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
                {selectedGabarito.exame} <span className="text-indigo-400">{selectedGabarito.ano}</span>
              </h1>
              <div className="flex flex-wrap gap-3 font-semibold text-xs text-slate-400">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl">
                  <Calendar size={13} className="text-indigo-400" />
                  Dia {selectedGabarito.dia}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl">
                  <GraduationCap size={13} className="text-violet-400" />
                  Caderno {selectedGabarito.caderno}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl">
                  <FileSpreadsheet size={13} className="text-emerald-400" />
                  90 Questões Reais
                </span>
              </div>
            </div>

            {/* Simulated Live Track progress if simulating */}
            {activeTab === 'simulate' && (
              <div className="bg-slate-900/60 p-6 rounded-[2rem] border border-slate-800 min-w-[260px] flex items-center gap-5">
                <div className="relative flex items-center justify-center">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle cx="32" cy="32" r="28" fill="transparent" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                    <circle cx="32" cy="32" r="28" fill="transparent" stroke="var(--text-accent, #6366f1)" strokeWidth="4" strokeDasharray="175" strokeDashoffset={175 - (175 * simulationResults.percentage) / 100} className="transition-all duration-500" />
                  </svg>
                  <span className="absolute text-sm font-black">{simulationResults.percentage}%</span>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Desempenho Simulado</p>
                  <p className="text-lg font-black text-white mt-1">{simulationResults.correct} / {simulationResults.total}</p>
                  <p className="text-xs text-indigo-300 font-bold">Acertos Calculados</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Interior Navigation Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--bg-card)] p-3 rounded-2xl border border-[var(--border-light)] shadow-sm">
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('view')}
              className={cn(
                "flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer",
                activeTab === 'view'
                  ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--shadow-primary)]"
                  : "hover:bg-[var(--bg-hover)] text-[var(--text-muted)]"
              )}
            >
              <BookOpen size={14} />
              Gabarito Oficial
            </button>
            <button
              onClick={() => setActiveTab('simulate')}
              className={cn(
                "flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer",
                activeTab === 'simulate'
                  ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--shadow-primary)]"
                  : "hover:bg-[var(--bg-hover)] text-[var(--text-muted)]"
              )}
            >
              <Trophy size={14} />
              Simular Gabarito
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={cn(
                "flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer",
                activeTab === 'stats'
                  ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--shadow-primary)]"
                  : "hover:bg-[var(--bg-hover)] text-[var(--text-muted)]"
              )}
            >
              <BarChart2 size={14} />
              Metodologia & Distribuição
            </button>
          </div>

          {/* Quick Subject Switcher inside template */}
          <div className="relative w-full sm:w-auto">
            <select
              value={subjectFilterInside}
              onChange={(e) => setSubjectFilterInside(e.target.value)}
              className="w-full sm:w-56 appearance-none bg-[var(--bg-input)] border border-[var(--border-light)] px-4 py-2.5 pr-10 rounded-xl text-xs font-bold text-[var(--text-main)] outline-none cursor-pointer hover:border-[var(--primary)] transition-colors"
            >
              <option value="Todos">Todas as Disciplinas</option>
              {insideSubjectsList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-label)] pointer-events-none" size={14} />
          </div>
        </div>

        {/* Tab 1: Static Answer Keys Grid with clicking mechanism */}
        {activeTab === 'view' && (
          <div className="space-y-6">
            <div className="p-4 bg-[var(--bg-badge)] border border-[var(--primary-border)] rounded-2xl flex items-start gap-3">
              <Sparkles className="text-[var(--primary)] shrink-0 mt-0.5" size={16} />
              <p className="text-xs text-[var(--primary)] font-semibold leading-relaxed">
                Dica de Ouro: Toque em qualquer questão do gabarito abaixo para visualizar o enunciado estético original, alternativas reais organizadas e a justificativa didática detalhada de sua resolução.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-4">
              {interiorFilteredQuestions.map((q) => (
                <motion.div 
                  key={q.numero}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setSelectedQuestion(q)}
                  className="bg-[var(--bg-card)] p-4 rounded-2xl border border-[var(--border-light)] flex flex-col justify-between items-center shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[var(--primary)] transition-all cursor-pointer group"
                >
                  <p className="text-[10px] font-bold text-[var(--text-label)] uppercase tracking-widest text-center">Questão</p>
                  <p className="text-xl font-extrabold text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors mt-1 mb-3">{String(q.numero).padStart(2, '0')}</p>
                  
                  <div className={cn(getAnswerColor(q.resposta), "w-11 h-11 rounded-xl flex items-center justify-center text-lg font-black shadow-inner transition-transform group-hover:scale-105")}>
                    {q.resposta}
                  </div>
                  <span className="text-[9px] font-bold text-[var(--text-label)] uppercase tracking-wider text-center block mt-2 text-ellipsis overflow-hidden w-full whitespace-nowrap">
                    {q.disciplina.split(' ')[0]}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Simulated Student Check Panel */}
        {activeTab === 'simulate' && (
          <div className="space-y-6">
            <div className="bg-[var(--bg-card)] border border-[var(--border-light)] p-6 md:p-8 rounded-2xl flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
                  <Trophy size={20} className="text-amber-500" />
                  Auto-avaliação do Estudante
                </h3>
                <p className="text-[var(--text-muted)] text-xs font-medium max-w-xl leading-relaxed">
                  Marque as respostas que você assinalou no dia da prova oficial para conferir sua pontuação simulada de acertos no formato de relatório dinâmico instantâneo.
                </p>
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={autofillCorrect}
                  className="px-4 py-2.5 bg-[var(--bg-hover)] text-[var(--text-main)] hover:bg-[var(--border-color)] text-xs font-bold rounded-xl transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer border border-[var(--border-light)]"
                >
                  Gabaritar Tudo
                </button>
                <button
                  onClick={clearSimulation}
                  className="px-4 py-2.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-bold rounded-xl transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer border border-rose-500/30"
                >
                  <RefreshCw size={12} />
                  Limpar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {interiorFilteredQuestions.map((q) => {
                const userChoice = userAnswers[q.numero];
                const isChecked = !!userChoice;
                const isCorrect = userChoice === q.resposta;
                return (
                  <div
                    key={q.numero}
                    className={cn(
                      "p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 bg-[var(--bg-card)]",
                      isChecked 
                        ? isCorrect 
                          ? "border-emerald-500/40 ring-1 ring-emerald-500/20 bg-emerald-500/5" 
                          : "border-rose-500/40 ring-1 ring-rose-500/20 bg-rose-500/5"
                        : "border-[var(--border-light)] hover:border-[var(--border-color)]"
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-bold text-[var(--text-label)] tracking-wider uppercase">Questão {q.numero}</p>
                        <p className="text-[10px] font-semibold text-[var(--text-muted)]">{q.disciplina}</p>
                      </div>

                      {isChecked && (
                        <span className={cn(
                          "p-1.5 rounded-full text-white",
                          isCorrect ? "bg-emerald-500" : "bg-rose-500"
                        )}>
                          {isCorrect ? <Check size={10} strokeWidth={4} /> : <X size={10} strokeWidth={4} />}
                        </span>
                      )}
                    </div>

                    {/* Interactive Letters Matrix */}
                    <div className="flex gap-2 justify-between">
                      {['A', 'B', 'C', 'D', 'E'].map(letter => {
                        const cellActive = userChoice === letter;
                        return (
                          <button
                            key={letter}
                            onClick={() => handleSimulateAnswerChange(q.numero, letter)}
                            className={cn(
                              "w-8.5 h-8.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center border cursor-pointer",
                              cellActive 
                                ? "bg-[var(--primary)] text-white border-[var(--primary)] scale-105 shadow-md shadow-[var(--shadow-primary)]"
                                : "bg-[var(--bg-hover)] border-[var(--border-light)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:scale-105"
                            )}
                          >
                            {letter}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Detailed statistics analysis on distribution standards */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-8 rounded-[2.5rem] space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-indigo-500">
                  <TrendingUp size={20} />
                  <p className="text-xs font-black uppercase tracking-wider">Uniformidade das Provas</p>
                </div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white">Teoria de Distribuição do ENEM/Vestibulares</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold leading-relaxed">
                  Grandes provas nacionais utilizam a Teoria de Resposta ao Item (TRI) e distribuem as alternativas de maneira homogênea (frequentemente contendo de 17 a 19 acertos para cada letra das 90 totais) para mitigar a probabilidade de aprovação ao acaso ("chute").
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Ocorrência Proporcional Caderno Atual</p>
                
                <div className="space-y-4">
                  {['A', 'B', 'C', 'D', 'E'].map(letter => {
                    const count = distributionStats.distribute[letter] || 0;
                    const pct = distributionStats.pct[letter] || '0';
                    return (
                      <div key={letter} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="flex items-center gap-2">
                            <span className={cn("w-6 h-6 rounded-md flex items-center justify-center font-black text-[10px]", getAnswerColor(letter))}>
                              {letter}
                            </span>
                            Alternativa {letter}
                          </span>
                          <span className="text-slate-500 font-mono">{count} questões ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1 }}
                            className="h-full bg-indigo-500 rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-8 rounded-[2.5rem] text-white space-y-6 border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />
              
              <h3 className="text-xl font-black flex items-center gap-2">
                <Award size={20} className="text-indigo-400" />
                Dica da Banca Organizadora
              </h3>

              <div className="space-y-5 text-sm leading-relaxed text-slate-300 font-medium">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                  <h4 className="font-black text-white text-xs mb-1 uppercase tracking-wider text-indigo-400">Padrão de Segurança Comercial</h4>
                  <p className="text-xs">
                    Uma sequência ininterrupta de 4 respostas idênticas em cadernos de ENEM é extremamente rara. Caso você encontre tal constelação em seu preenchimento, recomendamos revisar atentamente as questões em comum.
                  </p>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                  <h4 className="font-black text-white text-xs mb-1 uppercase tracking-wider text-emerald-400">Abordagem de Leitura Rápida</h4>
                  <p className="text-xs">
                    Inicie sua resolução anotando palavras-chave no gráfico de enunciado base, evitando prender sua atenção unicamente no desfecho da pergunta. Isso simplifica correlacionar os dados de cada alternativa com rapidez.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Question Details Full Aesthetic Modal */}
        <AnimatePresence>
          {selectedQuestion && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 md:p-8 rounded-[2.5rem] w-full max-w-3xl shadow-2xl relative my-8"
              >
                <button 
                  onClick={() => setSelectedQuestion(null)}
                  className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/10">
                      Questão {selectedQuestion.numero} • {selectedQuestion.disciplina}
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                      <BookOpen className="text-indigo-500" size={24} />
                      Resolução Didática
                    </h2>
                  </div>

                  <div className="space-y-5">
                    {/* Enunciado da questão super otimizado e proporcional */}
                    <div className="bg-slate-50 dark:bg-slate-950/60 p-6 sm:p-7 rounded-2xl border-l-[6px] border-indigo-500 border-y border-r border-slate-150 dark:border-slate-800/80 shadow-inner">
                      <p className="text-sm sm:text-[15px] text-slate-800 dark:text-slate-100 leading-relaxed font-semibold whitespace-pre-line">
                        {selectedQuestion.enunciado || "Enunciado oficial desta questão."}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Opções da Questão</p>
                      <div className="space-y-2.5">
                        {(selectedQuestion.alternativas || ['Opção A', 'Opção B', 'Opção C', 'Opção D', 'Opção E']).map((alt, idx) => {
                          const letter = ['A', 'B', 'C', 'D', 'E'][idx];
                          const isCorrect = letter === selectedQuestion.resposta;
                          return (
                            <div 
                              key={letter}
                              className={cn(
                                "p-4 sm:p-5 rounded-xl border flex gap-4 items-start sm:items-center transition-all",
                                isCorrect 
                                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-900 dark:text-emerald-400 font-bold" 
                                  : "bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/70 text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                              )}
                            >
                              <div className={cn(
                                "w-9 h-9 shrink-0 rounded-xl flex items-center justify-center font-black text-sm shadow-sm",
                                isCorrect ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-850 text-slate-600 dark:text-slate-400"
                              )}>
                                {letter}
                              </div>
                              <p className="text-xs sm:text-sm leading-relaxed font-medium">{alt}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Justificativa box com proporções corretas */}
                    <div className="bg-emerald-500/[0.03] p-6 rounded-2xl border border-emerald-500/20 space-y-2.5">
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={16} />
                        <p className="text-xs font-black uppercase tracking-widest">Justificativa da Resposta Correta</p>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-250 leading-relaxed italic font-medium">
                        {selectedQuestion.justificativa || "A justificativa oficial baseia-se na análise direta das competências e das habilidades cognitivas exigidas pelo tema desta questão."}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedQuestion(null)}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-sm transition-all active:scale-95 shadow-md shadow-slate-900/10"
                  >
                    Fechar Resolução
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      {/* Premium Hero Banner */}
      <div className="bg-slate-950 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/5 blur-[150px] rounded-full -ml-48 -mb-48 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                <CheckCircle2 size={12} className="text-indigo-400 animate-pulse" />
                Base Prorrogada e Autêntica
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                <FileSpreadsheet size={12} className="text-emerald-400" />
                + de 200 provas
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
              Biblioteca de <span className="text-indigo-400">Gabaritos</span>
            </h1>
            <p className="text-slate-400 max-w-xl font-medium leading-relaxed text-sm md:text-base">
              Acesse o banco inteligente de gabaritos oficiais das últimas edições dos maiores vestibulares do país. Analise a coerência das questões com justificativas didáticas.
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-[var(--bg-card)] p-5 sm:p-6 rounded-2xl border border-[var(--border-light)] flex flex-col lg:flex-row gap-4 items-center shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-label)]" size={18} />
          <input 
            type="text"
            placeholder="Buscar por exame, caderno ou ano..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl text-sm font-semibold outline-none focus:border-[var(--primary)] transition-all text-[var(--text-main)] placeholder-[var(--text-label)]"
          />
        </div>
        <div className="flex flex-wrap lg:flex-nowrap gap-3 w-full lg:w-auto">
          <div className="relative flex-1 min-w-[140px]">
            <select 
              value={filterExame}
              onChange={(e) => setFilterExame(e.target.value)}
              className="w-full appearance-none px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl text-xs font-bold outline-none cursor-pointer tracking-wide text-[var(--text-main)] hover:border-[var(--primary)]"
            >
              <option value="Todos">Exame: Todos</option>
              {examsList.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-label)] pointer-events-none" size={14} />
          </div>
          <div className="relative flex-1 min-w-[120px]">
            <select 
              value={filterAno}
              onChange={(e) => setFilterAno(e.target.value)}
              className="w-full appearance-none px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl text-xs font-bold outline-none cursor-pointer tracking-wide text-[var(--text-main)] hover:border-[var(--primary)]"
            >
              <option value="Todos">Ano: Todos</option>
              {yearsList.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-label)] pointer-events-none" size={14} />
          </div>
        </div>
      </div>

      {/* Grid of beautiful exam cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredList.map((g) => (
            <motion.div
              layout
              key={g.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => setSelectedGabarito(g)}
              className="group bg-[var(--bg-card)] border border-[var(--border-light)] p-6 rounded-2xl hover:border-[var(--primary)] hover:bg-[var(--bg-card-elevated)] transition-all cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-5">
                <div className="p-3 bg-[var(--bg-hover)] text-[var(--primary)] rounded-xl border border-[var(--border-light)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
                  <FileSpreadsheet size={22} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary)] bg-[var(--bg-badge)] px-2.5 py-1 rounded-full whitespace-nowrap border border-[var(--primary-border)]">
                  {g.questoes.length} Questões
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-label)]">{g.ano}</p>
                <h3 className="text-xl font-bold text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">{g.exame}</h3>
                <p className="text-xs text-[var(--text-muted)]">Caderno {g.caderno} • Dia {g.dia}</p>
              </div>
              <div className="mt-5 pt-4 border-t border-[var(--border-light)] flex items-center justify-between text-[var(--primary)] font-bold text-xs">
                <span>Acessar Biblioteca</span>
                <ChevronRight size={15} className="transition-transform group-hover:translate-x-1" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredList.length === 0 && (
        <div className="text-center py-16 bg-[var(--bg-card)] rounded-2xl border border-dashed border-[var(--border-light)]">
          <FileText size={40} className="mx-auto text-[var(--text-label)] mb-3" />
          <h3 className="text-lg font-bold text-[var(--text-muted)]">Nenhum gabarito encontrado</h3>
          <p className="text-[var(--text-label)] text-xs mt-1">Tente ajustar seus filtros de busca para encontrar cadernos específicos.</p>
        </div>
      )}
    </div>
  );
}
