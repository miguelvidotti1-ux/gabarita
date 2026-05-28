import { auth, db } from '../firebase';
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, query, where, deleteDoc } from 'firebase/firestore';
import { Question } from './geminiService';

export interface DesafioSemanal {
  id: string;
  semana: number;
  dataInicio: string; // ISO string
  dataFim: string; // ISO string
  questoes: Question[]; // Storing full questions directly for instant playability
  ativo: boolean;
}

export interface Participacao {
  usuarioId: string;
  usuarioNome: string;
  desafioId: string;
  pontos: number;
  respostas: { questaoId: string; correta: boolean; respostaSelecionada?: number }[];
  dataParticipacao: string; // ISO string
  nivel?: 'facil' | 'medio' | 'dificil';
}

export interface RankingItem {
  usuarioId: string;
  usuarioNome: string;
  pontos: number;
  posicao: number;
  dataParticipacao: string;
  nivel?: 'facil' | 'medio' | 'dificil';
}

// Memory and LocalStorage fallback
let localDesafios: DesafioSemanal[] = [];
let localParticipacoes: Participacao[] = [];

// Base questions for fallback/generation when Firebase/AI is offline
const FALLBACK_QUESTIONS: Question[] = [
  {
    id: 'f_q1',
    subject: 'Matemática',
    text: 'Seja a progressão aritmética (2, 7, 12, 17, ...). Qual é o vigésimo termo dessa sequência?',
    options: ['87', '92', '97', '102', '107'],
    correctAnswer: 2, // 97 (2 + 19 * 5 = 2 + 95 = 97)
    explanation: 'A fórmula do termo geral de uma PA é an = a1 + (n-1)*r. Aqui, a1 = 2, r = 5, n = 20. Logo, a20 = 2 + 19*5 = 97.'
  },
  {
    id: 'f_q2',
    subject: 'Português',
    text: 'Identifique o movimento literário brasileiro que valorizava o nacionalismo, o indianismo e o sentimentalismo exagerado no século XIX:',
    options: ['Barroco', 'Arcadismo', 'Romantismo', 'Realismo', 'Modernismo'],
    correctAnswer: 2, // Romantismo
    explanation: 'O Romantismo em sua primeira geração (nacionalista/indianista) exalta a pátria, a natureza e o índio como herói nacional, sob forte carga emocional.'
  },
  {
    id: 'f_q3',
    subject: 'Física',
    text: 'Um objeto é solto de uma altura de 45 metros em queda livre (g = 10 m/s²). Desprezando a resistência do ar, quanto tempo ele leva para atingir o solo?',
    options: ['2 segundos', '3 segundos', '4 segundos', '5 segundos', '6 segundos'],
    correctAnswer: 1, // 3 segundos (h = 0.5 * g * t^2 => 45 = 5 * t^2 => t^2 = 9 => t = 3)
    explanation: 'Usando h = (g * t²) / 2, temos 45 = (10 * t²) / 2 => 45 = 5 * t² => t² = 9 => t = 3 segundos.'
  },
  {
    id: 'f_q4',
    subject: 'História',
    text: 'A revolta que ocorreu em Pernambuco em 1817, caracterizada pelo ideal republicano e de emancipação nacional influenciado pelo Iluminismo, é conhecida como:',
    options: ['Inconfidência Mineira', 'Conjuração Baiana', 'Revolução Pernambucana', 'Sabinada', 'Balaiada'],
    correctAnswer: 2, // Revolução Pernambucana
    explanation: 'A Revolução Pernambucana de 1817 foi um movimento de caráter republicano e separatista que chegou a tomar o poder temporariamente na província.'
  },
  {
    id: 'f_q5',
    subject: 'Biologia',
    text: 'No processo de síntese proteica celular, qual organela é diretamente responsável pela tradução da sequência de nucleotídeos do RNAm em aminoácidos?',
    options: ['Complexo de Golgi', 'Mitocôndria', 'Ribossomo', 'Lisossomo', 'Cloroplasto'],
    correctAnswer: 2, // Ribossomo
    explanation: 'Os ribossomos realizam a síntese de proteínas por meio do processo de tradução do RNA mensageiro.'
  }
];

// Load standard initial mock challenges from localStorage
try {
  const storedDesafios = localStorage.getItem('levelup_weekly_challenges');
  const storedParticipations = localStorage.getItem('levelup_weekly_participations');
  if (storedDesafios) localDesafios = JSON.parse(storedDesafios);
  if (storedParticipations) localParticipacoes = JSON.parse(storedParticipations);

  if (localDesafios.length === 0) {
    // Initial default challenge
    const defaultChallenge: DesafioSemanal = {
      id: 'desafio_semana_1',
      semana: 1,
      dataInicio: new Date().toISOString(),
      dataFim: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      questoes: FALLBACK_QUESTIONS,
      ativo: true
    };
    localDesafios.push(defaultChallenge);
    localStorage.setItem('levelup_weekly_challenges', JSON.stringify(localDesafios));
    
    // Some initial simulated rankings to make it competitive right away!
    const mockParticipations: Participacao[] = [
      {
        usuarioId: 'user_simulas_1',
        usuarioNome: 'Mariana Costa',
        desafioId: 'desafio_semana_1',
        pontos: 5,
        respostas: [
          { questaoId: 'f_q1', correta: true },
          { questaoId: 'f_q2', correta: true },
          { questaoId: 'f_q3', correta: true },
          { questaoId: 'f_q4', correta: true },
          { questaoId: 'f_q5', correta: true }
        ],
        dataParticipacao: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        usuarioId: 'user_simulas_2',
        usuarioNome: 'Rodrigo Nogueira',
        desafioId: 'desafio_semana_1',
        pontos: 4,
        respostas: [
          { questaoId: 'f_q1', correta: true },
          { questaoId: 'f_q2', correta: true },
          { questaoId: 'f_q3', correta: false },
          { questaoId: 'f_q4', correta: true },
          { questaoId: 'f_q5', correta: true }
        ],
        dataParticipacao: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        usuarioId: 'user_simulas_3',
        usuarioNome: 'Julia Fernandes',
        desafioId: 'desafio_semana_1',
        pontos: 3,
        respostas: [
          { questaoId: 'f_q1', correta: false },
          { questaoId: 'f_q2', correta: true },
          { questaoId: 'f_q3', correta: false },
          { questaoId: 'f_q4', correta: true },
          { questaoId: 'f_q5', correta: true }
        ],
        dataParticipacao: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      }
    ];
    localParticipacoes = mockParticipations;
    localStorage.setItem('levelup_weekly_participations', JSON.stringify(localParticipacoes));
  }
} catch (e) {
  console.error("Error reading localStorage:", e);
}

export const weeklyChallengeService = {
  /**
   * List all challenges (combining Firestore and localStorage fallback)
   */
  async listarDesafios(): Promise<DesafioSemanal[]> {
    try {
      if (auth.currentUser) {
        const ref = collection(db, 'weekly_challenges');
        const snap = await getDocs(ref);
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as DesafioSemanal));
        }
      }
    } catch (e) {
      console.error("Firestore loading challenges error:", e);
    }
    return localDesafios;
  },

  /**
   * Starts a new weekly challenge with questions and dates
   */
  async iniciarDesafioSemanal(
    numSemana: number,
    inicio: Date,
    fim: Date,
    questoes: Question[]
  ): Promise<DesafioSemanal> {
    const novoDesafio: DesafioSemanal = {
      id: `desafio_${numSemana}_${Date.now()}`,
      semana: numSemana,
      dataInicio: inicio.toISOString(),
      dataFim: fim.toISOString(),
      questoes: questoes.length > 0 ? questoes : FALLBACK_QUESTIONS,
      ativo: true
    };

    // Save locally
    // Mark others as inactive if any
    localDesafios = localDesafios.map(d => ({ ...d, ativo: false }));
    localDesafios.unshift(novoDesafio);
    localStorage.setItem('levelup_weekly_challenges', JSON.stringify(localDesafios));

    // Save in Firebase
    try {
      if (auth.currentUser) {
        // Mark existing as inactive in firestore too
        const colRef = collection(db, 'weekly_challenges');
        const snap = await getDocs(colRef);
        for (const docSnap of snap.docs) {
          if (docSnap.data().ativo) {
            await updateDoc(doc(db, 'weekly_challenges', docSnap.id), { ativo: false });
          }
        }
        await setDoc(doc(db, 'weekly_challenges', novoDesafio.id), novoDesafio);
      }
    } catch (e) {
      console.error("Firestore saving challenge error:", e);
    }

    return novoDesafio;
  },

  /**
   * Get active challenge
   */
  async obterDesafioAtivo(): Promise<DesafioSemanal | null> {
    const desafios = await this.listarDesafios();
    const ativo = desafios.find(d => d.ativo);
    if (ativo) return ativo;
    // Fallback to first if none is set active
    return desafios[0] || null;
  },

  /**
   * Get participation of a user for a specific challenge
   */
  async obterParticipacao(usuarioId: string, desafioId: string): Promise<Participacao | null> {
    try {
      if (auth.currentUser) {
        const docRef = doc(db, 'weekly_participations', `${usuarioId}_${desafioId}`);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          return snap.data() as Participacao;
        }
      }
    } catch (e) {
      console.error("Firestore get participacao error:", e);
    }
    const part = localParticipacoes.find(p => p.usuarioId === usuarioId && p.desafioId === desafioId);
    return part || null;
  },

  /**
   * Registers a user's answers and computes the points
   */
  async registrarRespostas(
    usuarioId: string,
    usuarioNome: string,
    desafioId: string,
    respostas: { questaoId: string; correta: boolean; respostaSelecionada?: number }[],
    nivel?: 'facil' | 'medio' | 'dificil'
  ): Promise<Participacao> {
    // Standardize total points
    const pontos = respostas.filter(r => r.correta).length;

    const novaParticipacao: Participacao = {
      usuarioId,
      usuarioNome: usuarioNome || 'Aluno',
      desafioId,
      pontos,
      respostas,
      dataParticipacao: new Date().toISOString(),
      nivel
    };

    // Update locally
    localParticipacoes = localParticipacoes.filter(p => !(p.usuarioId === usuarioId && p.desafioId === desafioId));
    localParticipacoes.push(novaParticipacao);
    localStorage.setItem('levelup_weekly_participations', JSON.stringify(localParticipacoes));

    // Save in Firebase
    try {
      if (auth.currentUser) {
        await setDoc(doc(db, 'weekly_participations', `${usuarioId}_${desafioId}`), novaParticipacao);
      }
    } catch (e) {
      console.error("Firestore save participacao error:", e);
    }

    return novaParticipacao;
  },

  /**
   * Calculates weekly ranking sorted by score and participation date
   */
  async calcularRankingSemanal(desafioId: string): Promise<RankingItem[]> {
    let list: Participacao[] = [];

    try {
      if (auth.currentUser) {
        const colRef = collection(db, 'weekly_participations');
        const q = query(colRef, where('desafioId', '==', desafioId));
        const snap = await getDocs(q);
        if (!snap.empty) {
          list = snap.docs.map(d => d.data() as Participacao);
        }
      }
    } catch (e) {
      console.error("Firestore get ranking error:", e);
    }

    // Merge in local participations if Firestore has none or as a baseline
    const localMatches = localParticipacoes.filter(p => p.desafioId === desafioId);
    localMatches.forEach(lm => {
      if (!list.some(item => item.usuarioId === lm.usuarioId)) {
        list.push(lm);
      }
    });

    // Sort by points desc, then by date asc (earlier is better)
    const ordenado = list.sort((a, b) => {
      if (b.pontos !== a.pontos) {
        return b.pontos - a.pontos;
      }
      return new Date(a.dataParticipacao).getTime() - new Date(b.dataParticipacao).getTime();
    });

    return ordenado.map((p, index) => ({
      usuarioId: p.usuarioId,
      usuarioNome: p.usuarioNome,
      pontos: p.pontos,
      posicao: index + 1,
      dataParticipacao: p.dataParticipacao,
      nivel: p.nivel
    }));
  },

  /**
   * Finalizes the week, deactivating the challenge and calculating final ranking
   */
  async finalizarSemana(desafioId: string) {
    // Update local desafios
    localDesafios = localDesafios.map(d => {
      if (d.id === desafioId) {
        return { ...d, ativo: false };
      }
      return d;
    });
    localStorage.setItem('levelup_weekly_challenges', JSON.stringify(localDesafios));

    // Update Firebase
    try {
      if (auth.currentUser) {
        const docRef = doc(db, 'weekly_challenges', desafioId);
        await updateDoc(docRef, { ativo: false });
      }
    } catch (e) {
      console.error("Firestore update challenge status error:", e);
    }

    const ranking = await this.calcularRankingSemanal(desafioId);
    const desafio = localDesafios.find(d => d.id === desafioId);

    return {
      desafioId,
      semana: desafio ? desafio.semana : 1,
      ranking,
      finalizado: true
    };
  },

  /**
   * Resets the challenge and all corresponding user participations
   */
  async resetarDesafio(desafioId: string): Promise<boolean> {
    localDesafios = localDesafios.filter(d => d.id !== desafioId);
    localParticipacoes = localParticipacoes.filter(p => p.desafioId !== desafioId);
    
    localStorage.setItem('levelup_weekly_challenges', JSON.stringify(localDesafios));
    localStorage.setItem('levelup_weekly_participations', JSON.stringify(localParticipacoes));

    // Update Firebase
    try {
      if (auth.currentUser) {
        await deleteDoc(doc(db, 'weekly_challenges', desafioId));
        // Note: typically we would run a batch delete or query then delete all participations
        const q = query(collection(db, 'weekly_participations'), where('desafioId', '==', desafioId));
        const snap = await getDocs(q);
        for (const docSnap of snap.docs) {
          await deleteDoc(doc(db, 'weekly_participations', docSnap.id));
        }
      }
    } catch (e) {
      console.error("Firestore delete error during reset:", e);
    }

    return true;
  }
};
