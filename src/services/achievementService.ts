import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { collection, doc, setDoc, getDoc, getDocs, deleteDoc } from 'firebase/firestore';

export interface Conquista {
  id: string;
  nome: string;
  descricao: string;
  icone: string; // Name of lucide-react icon
  requisito: {
    tipo: 'metas_atingidas' | 'horas_estudo' | 'dias_consecutivos' | 'tarefas_concluidas';
    valor: number;
  };
  recompensa?: string;
}

export interface Meta {
  id: string;
  usuarioId: string;
  descricao: string;
  objetivo: number; // Total number to complete
  progresso: number; // Current progress
  tipo: string; // e.g., 'questoes', 'horas', 'aulas', 'redacoes'
  dataCriacao: Date;
  dataConclusao?: Date;
  concluida: boolean;
}

export interface UsuarioConquistas {
  usuarioId: string;
  conquistasLiberadas: { conquistaId: string; dataLiberacao: Date }[];
  metasCompletas: number;
  totalHorasEstudo: number;
  diasConsecutivos: number;
  tarefasConcluidas: number;
}

// Pre-defined curated high quality brazilian vestibular badges/achievements (over 200 items generated procedurally to reward elite student performance)
const generateAchievements = (): Conquista[] => {
  const list: Conquista[] = [];
  const milestones = [3, 5, 10, 20, 50, 100, 200, 500, 1000];

  const categories: { id: string; tipo: 'metas_atingidas' | 'horas_estudo' | 'dias_consecutivos' | 'tarefas_concluidas'; baseTitle: string; icon: string }[] = [
    { id: 'metas', tipo: 'metas_atingidas', baseTitle: 'Meta', icon: 'Target' },
    { id: 'horas', tipo: 'horas_estudo', baseTitle: 'Hora de Estudo', icon: 'Clock' },
    { id: 'dias', tipo: 'dias_consecutivos', baseTitle: 'Dia de Streak', icon: 'Flame' },
    { id: 'tarefas', tipo: 'tarefas_concluidas', baseTitle: 'Tarefa', icon: 'CheckSquare' },
  ];

  categories.forEach(cat => {
    milestones.forEach((m, idx) => {
      // Choose icon based on tier
      let icon = cat.icon;
      if (idx >= 6) icon = 'Crown';
      else if (idx >= 4) icon = 'Award';

      list.push({
        id: `c_${cat.id}_${m}`,
        nome: `${m} ${cat.baseTitle}${m === 1 ? '' : 's'} Alcançada${m === 1 ? '' : 's'}`,
        descricao: `Alcance ${m} ${cat.tipo.replace('_', ' ')} na plataforma`,
        icone: icon,
        requisito: { tipo: cat.tipo, valor: m },
        recompensa: `Bônus Tier ${idx + 1}`
      });
    });
  });

  return list;
};

export const DEFAULT_CONQUISTAS: Conquista[] = generateAchievements();

// Helper for generating unique IDs (specified in prompt)
let idCounter = 0;
export function gerarIdUnico(): string {
  return (++idCounter).toString(36) + Date.now().toString(36);
}

// Function to create a new meta
export function criarMeta(usuarioId: string, descricao: string, objetivo: number, tipo: string): Meta {
  return {
    id: gerarIdUnico(),
    usuarioId,
    descricao,
    objetivo,
    progresso: 0,
    tipo,
    dataCriacao: new Date(),
    concluida: false
  };
}

// Function to register progress in a meta
export function registrarProgresso(meta: Meta, incremento: number): Meta {
  const novoProgresso = Math.max(0, meta.progresso + incremento);
  const concluidaAgora = novoProgresso >= meta.objetivo && !meta.concluida;
  
  return {
    ...meta,
    progresso: novoProgresso,
    concluida: meta.concluida || concluidaAgora,
    dataConclusao: concluidaAgora ? new Date() : meta.dataConclusao
  };
}

// Function to verify achievements based on user statistics
export function verificarConquistas(
  usuario: UsuarioConquistas,
  conquistasDisponiveis: Conquista[],
  metasConcluidas: Meta[]
): Conquista[] {
  const novasConquistas: Conquista[] = [];
  
  // Clean count of completed achievements
  const metasCompletasCount = metasConcluidas.filter(m => m.concluida).length;
  usuario.metasCompletas = metasCompletasCount;

  for (const conquista of conquistasDisponiveis) {
    // Skip if already unlocked
    if (usuario.conquistasLiberadas.some(c => c.conquistaId === conquista.id)) continue;

    let atendeRequisito = false;
    switch (conquista.requisito.tipo) {
      case 'metas_atingidas':
        atendeRequisito = usuario.metasCompletas >= conquista.requisito.valor;
        break;
      case 'horas_estudo':
        atendeRequisito = usuario.totalHorasEstudo >= conquista.requisito.valor;
        break;
      case 'dias_consecutivos':
        atendeRequisito = usuario.diasConsecutivos >= conquista.requisito.valor;
        break;
      case 'tarefas_concluidas':
        atendeRequisito = usuario.tarefasConcluidas >= conquista.requisito.valor;
        break;
    }

    if (atendeRequisito) {
      novasConquistas.push(conquista);
    }
  }
  return novasConquistas;
}

// Function to unlock an achievement
export function desbloquearConquista(
  usuario: UsuarioConquistas,
  conquista: Conquista
): UsuarioConquistas {
  if (!usuario.conquistasLiberadas.some(c => c.conquistaId === conquista.id)) {
    return {
      ...usuario,
      conquistasLiberadas: [
        ...usuario.conquistasLiberadas,
        { conquistaId: conquista.id, dataLiberacao: new Date() }
      ]
    };
  }
  return usuario;
}

// List unlocked and pending achievements
export function listarConquistasUsuario(
  usuario: UsuarioConquistas,
  conquistasDisponiveis: Conquista[],
  metasConcluidas: Meta[]
): { liberadas: Conquista[]; pendentes: Conquista[] } {
  // Update internal completed score tracker
  usuario.metasCompletas = metasConcluidas.filter(m => m.concluida).length;

  const liberadas: Conquista[] = [];
  const pendentes: Conquista[] = [];

  for (const conquista of conquistasDisponiveis) {
    if (usuario.conquistasLiberadas.some(c => c.conquistaId === conquista.id)) {
      liberadas.push(conquista);
    } else {
      pendentes.push(conquista);
    }
  }
  return { liberadas, pendentes };
}

// Calculate progress percentage of a goal
export function calcularPercentual(meta: Meta): number {
  if (meta.objetivo === 0) return 0;
  return Math.min(100, Math.round((meta.progresso / meta.objetivo) * 100));
}

// Storage key names
const METAS_KEY = 'levelup_user_metas';
const USER_ACHIEVES_KEY = 'levelup_user_achievements';

export const achievementService = {
  /**
   * Fetch goals for specific user
   */
  async getMetas(usuarioId: string): Promise<Meta[]> {
    try {
      if (auth.currentUser) {
        const path = `users/${usuarioId}/goals`;
        const colRef = collection(db, path);
        const snap = await getDocs(colRef);
        if (!snap.empty) {
          const list = snap.docs.map(docSnap => {
            const data = docSnap.data();
            return {
              ...data,
              id: docSnap.id,
              dataCriacao: data.dataCriacao ? new Date(data.dataCriacao) : new Date(),
              dataConclusao: data.dataConclusao ? new Date(data.dataConclusao) : undefined
            } as Meta;
          });
          // Cache locally
          localStorage.setItem(`${METAS_KEY}_${usuarioId}`, JSON.stringify(list));
          return list;
        }
      }
    } catch (e) {
      console.error("Firestore get goals error, using cache: ", e);
    }

    const stored = localStorage.getItem(`${METAS_KEY}_${usuarioId}`);
    if (stored) {
      try {
        const parsed: any[] = JSON.parse(stored);
        return parsed.map(item => ({
          ...item,
          dataCriacao: new Date(item.dataCriacao),
          dataConclusao: item.dataConclusao ? new Date(item.dataConclusao) : undefined
        }));
      } catch (err) {
        console.error("Error reading cache: ", err);
      }
    }
    return [];
  },

  /**
   * Saves or updates a goal
   */
  async saveMeta(meta: Meta): Promise<void> {
    const usuarioId = meta.usuarioId;
    
    // Read current local cache list & append/replace
    let list: Meta[] = [];
    const stored = localStorage.getItem(`${METAS_KEY}_${usuarioId}`);
    if (stored) {
      try {
        list = JSON.parse(stored).map((item: any) => ({
          ...item,
          dataCriacao: new Date(item.dataCriacao),
          dataConclusao: item.dataConclusao ? new Date(item.dataConclusao) : undefined
        }));
      } catch {}
    }
    
    list = list.filter(m => m.id !== meta.id);
    list.push(meta);
    localStorage.setItem(`${METAS_KEY}_${usuarioId}`, JSON.stringify(list));

    try {
      if (auth.currentUser) {
        const docPath = `users/${usuarioId}/goals/${meta.id}`;
        await setDoc(doc(db, `users/${usuarioId}/goals`, meta.id), {
          ...meta,
          dataCriacao: meta.dataCriacao.toISOString(),
          dataConclusao: meta.dataConclusao ? meta.dataConclusao.toISOString() : null
        });
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${usuarioId}/goals/${meta.id}`);
    }
  },

  /**
   * Delete meta from storage
   */
  async deleteMeta(usuarioId: string, metaId: string): Promise<void> {
    let list: Meta[] = [];
    const stored = localStorage.getItem(`${METAS_KEY}_${usuarioId}`);
    if (stored) {
      try {
        list = JSON.parse(stored).map((item: any) => ({
          ...item,
          dataCriacao: new Date(item.dataCriacao),
          dataConclusao: item.dataConclusao ? new Date(item.dataConclusao) : undefined
        }));
      } catch {}
    }
    
    list = list.filter(m => m.id !== metaId);
    localStorage.setItem(`${METAS_KEY}_${usuarioId}`, JSON.stringify(list));

    try {
      if (auth.currentUser) {
        await deleteDoc(doc(db, `users/${usuarioId}/goals`, metaId));
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `users/${usuarioId}/goals/${metaId}`);
    }
  },

  /**
   * Retrieves profile achievements status
   */
  async getUsuarioConquistas(usuarioId: string): Promise<UsuarioConquistas> {
    const emptyProfile: UsuarioConquistas = {
      usuarioId,
      conquistasLiberadas: [],
      metasCompletas: 0,
      totalHorasEstudo: 0,
      diasConsecutivos: 1,
      tarefasConcluidas: 0
    };

    try {
      if (auth.currentUser) {
        const docRef = doc(db, 'user_achievements', usuarioId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          const profile = {
            ...emptyProfile,
            ...data,
            conquistasLiberadas: (data.conquistasLiberadas || []).map((l: any) => ({
              conquistaId: l.conquistaId,
              dataLiberacao: l.dataLiberacao ? new Date(l.dataLiberacao) : new Date()
            }))
          } as UsuarioConquistas;
          localStorage.setItem(`${USER_ACHIEVES_KEY}_${usuarioId}`, JSON.stringify(profile));
          return profile;
        }
      }
    } catch (e) {
      console.error("Firestore get stats error: ", e);
    }

    const stored = localStorage.getItem(`${USER_ACHIEVES_KEY}_${usuarioId}`);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        return {
          ...emptyProfile,
          ...data,
          conquistasLiberadas: (data.conquistasLiberadas || []).map((l: any) => ({
            conquistaId: l.conquistaId,
            dataLiberacao: new Date(l.dataLiberacao)
          }))
        };
      } catch {}
    }

    return emptyProfile;
  },

  /**
   * Save user statistics and achievements to cloud / localStorage
   */
  async saveUsuarioConquistas(usuarioId: string, profile: UsuarioConquistas): Promise<void> {
    localStorage.setItem(`${USER_ACHIEVES_KEY}_${usuarioId}`, JSON.stringify(profile));

    try {
      if (auth.currentUser) {
        const docRef = doc(db, 'user_achievements', usuarioId);
        await setDoc(docRef, {
          ...profile,
          conquistasLiberadas: profile.conquistasLiberadas.map(l => ({
            conquistaId: l.conquistaId,
            dataLiberacao: l.dataLiberacao instanceof Date ? l.dataLiberacao.toISOString() : l.dataLiberacao
          }))
        });
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `user_achievements/${usuarioId}`);
    }
  },

  /**
   * Tracks user study activities, automatically updating progress on matching Metas
   * and incrementing statistics for Achievements.
   */
  async trackActivity(
    usuarioId: string, 
    tipo: 'questoes' | 'horas' | 'aulas' | 'redacoes' | 'leituras', 
    quantidade: number
  ): Promise<void> {
    try {
      // 1. Load active goals (Metas)
      const metas = await this.getMetas(usuarioId);
      const updatedMetas = metas.map(m => {
        if (m.tipo === tipo && !m.concluida) {
          const after = registrarProgresso(m, quantidade);
          this.saveMeta(after); // async save
          return after;
        }
        return m;
      });

      // 2. Load achievements profile
      const profile = await this.getUsuarioConquistas(usuarioId);
      
      // Update statistics
      profile.tarefasConcluidas += quantidade;
      if (tipo === 'horas') {
        profile.totalHorasEstudo += quantidade;
      } else if (tipo === 'aulas') {
        // approximate: 1 class = 0.5 hours study
        profile.totalHorasEstudo += Math.round(quantidade * 0.5 * 10) / 10;
      } else if (tipo === 'leituras') {
        // approximate: 1 study material = 0.3 hours study
        profile.totalHorasEstudo += Math.round(quantidade * 0.3 * 10) / 10;
      } else if (tipo === 'questoes') {
        // approximate: 5 questions answered = 0.2 hours study (0.04 hours per question)
        profile.totalHorasEstudo += Math.round(quantidade * 0.04 * 10) / 10;
      } else if (tipo === 'redacoes') {
        // approximate: 1 essay = 1.5 hours study
        profile.totalHorasEstudo += quantidade * 1.5;
      }

      // Check current completed count
      profile.metasCompletas = updatedMetas.filter(m => m.concluida).length;

      // 3. Verify new achievements and unlock
      const newlyweds = verificarConquistas(profile, DEFAULT_CONQUISTAS, updatedMetas);
      if (newlyweds.length > 0) {
        newlyweds.forEach(conq => {
          if (!profile.conquistasLiberadas.some(cl => cl.conquistaId === conq.id)) {
            profile.conquistasLiberadas.push({
              conquistaId: conq.id,
              dataLiberacao: new Date()
            });
            // Dispatch dynamic window event so listening page can show congrats popup!
            window.dispatchEvent(new CustomEvent('achievement-unlocked', { detail: conq }));
          }
        });
      }

      // 4. Save profile
      await this.saveUsuarioConquistas(usuarioId, profile);

      // Force a custom event for updated goals, so active screens can re-sync immediately
      window.dispatchEvent(new CustomEvent('user-activity-tracked', { 
        detail: { tipo, quantidade, metas: updatedMetas, profile } 
      }));

    } catch (error) {
      console.error("Error tracking user activity automatically: ", error);
    }
  }
};
