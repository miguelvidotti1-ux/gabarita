import { levelSystem } from './levelService';

export type MissionType = 'questions' | 'watch' | 'essay' | 'flashcards' | 'review';

export interface Mission {
  id: string;
  title: string;
  type: MissionType;
  topic: string;
  target: number;
  progress: number;
  completed: boolean;
  xp: number;
}

export interface MissionStatus {
  id: string;
  title: string;
  progress: string;
  reward: string;
  completed: boolean;
  rawProgress: number;
  rawTarget: number;
}

class MissionEngine {
  private static _hash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash);
  }

  private static _seededRandom(seed: number): () => number {
    let s = seed % 2147483647;
    return () => {
      s = (s * 16807 + 0xDEADBEEF) % 2147483647;
      return s / 2147483647;
    };
  }

  constructor() {}

  public getDailyStudyPlan(dateStr: string): string[] {
    const seed = MissionEngine._hash(dateStr);
    const rand = MissionEngine._seededRandom(seed);
    const subjects = ['Matemática', 'Português', 'Física', 'Química', 'Biologia', 'História', 'Geografia'];
    const numSubjects = 3 + Math.floor(rand() * 3);
    const plan = new Set<string>();
    while (plan.size < numSubjects) {
      plan.add(subjects[Math.floor(rand() * subjects.length)]);
    }
    return Array.from(plan);
  }

  private _calculateXp(type: MissionType, target: number): number {
    switch (type) {
      case 'questions': return Math.floor(target * 3);
      case 'watch': return Math.floor(target * 1.5);
      case 'essay': return 50;
      case 'flashcards': return Math.floor(target * 2);
      case 'review': return 30;
      default: return 10;
    }
  }

  private _pickType(topic: string, rand: () => number): MissionType {
    if (topic === 'Português' && rand() < 0.3) {
      return 'essay';
    }
    const types: MissionType[] = ['questions', 'watch', 'flashcards'];
    return types[Math.floor(rand() * types.length)];
  }

  private _createMission(type: MissionType, topic: string, rand: () => number): Mission {
    let title = '', target = 0;
    const num = Math.floor(3 + rand() * 12);
    switch (type) {
      case 'questions':
        target = num;
        title = `Resolva ${target} questões de ${topic}`;
        break;
      case 'watch':
        target = num;
        title = `Assista ${target} minutos de aula sobre ${topic}`;
        break;
      case 'essay':
        target = 1;
        title = `Faça 1 Redação sobre ${topic}`;
        break;
      case 'flashcards':
        target = num;
        title = `Revise ${target} Flashcards de ${topic}`;
        break;
      case 'review':
        target = Math.floor(5 + rand() * 6);
        title = `Revise ${target} sobre ${topic}`;
        break;
    }
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const xp = this._calculateXp(type, target);
    return { id, title, type, topic, target, progress: 0, completed: false, xp };
  }

  public generateNewMissions(dateStr: string): Mission[] {
    const seed = MissionEngine._hash(dateStr);
    const rand = MissionEngine._seededRandom(seed);
    const studyPlan = this.getDailyStudyPlan(dateStr);
    const historyStr = localStorage.getItem('mission_history') || '[]';
    const history = JSON.parse(historyStr);
    const missions: Mission[] = [];

    if (history.length > 0) {
      const reviewIdx = Math.floor(rand() * Math.min(3, history.length));
      const reviewTopic = history[history.length - 1 - reviewIdx];
      missions.push(this._createMission('review', reviewTopic, rand));
    }

    for (const topic of studyPlan) {
      const type = this._pickType(topic, rand);
      missions.push(this._createMission(type, topic, rand));
    }

    const finalMissions = missions.slice(0, 4);
    finalMissions.push({
      id: `sisu-2a-opcao-${dateStr}`,
      title: 'Simule sua 2ª opção no Simulador Sisu',
      type: 'review',
      topic: 'Simulador Sisu',
      target: 1,
      progress: 0,
      completed: false,
      xp: 35,
    });
    finalMissions.push({
      id: `treino-rapido-${dateStr}`,
      title: 'Responda 10 questões no Treino Rápido',
      type: 'questions',
      topic: 'Treino Rápido',
      target: 10,
      progress: 0,
      completed: false,
      xp: 40,
    });

    return finalMissions;
  }

  public completeSisuSecondOptionMission(): boolean {
    const missions = this.getMissionsForToday();
    const targetMission = missions.find(
      (m) => m.topic === 'Simulador Sisu' || m.id.startsWith('sisu-2a-opcao')
    );
    if (!targetMission || targetMission.completed) return false;
    this.updateProgress(targetMission.id, 1);
    return true;
  }

  public updateTreinoProgress(delta: number = 1): void {
    const missions = this.getMissionsForToday();
    const targetMission = missions.find(
      (m) => m.topic === 'Treino Rápido' || m.id.startsWith('treino-rapido')
    );
    if (!targetMission || targetMission.completed) return;
    this.updateProgress(targetMission.id, delta);
  }

  public getMissionsForToday(): Mission[] {
    const today = new Date().toISOString().slice(0, 10);
    const key = `missions_${today}`;
    const stored = localStorage.getItem(key);
    let missions: Mission[];
    
    if (!stored) {
      missions = this.generateNewMissions(today);
      localStorage.setItem(key, JSON.stringify(missions));
    } else {
      missions = JSON.parse(stored);
      let changed = false;
      if (!missions.some((m) => m.id.startsWith('sisu-2a-opcao'))) {
        missions.push({
          id: `sisu-2a-opcao-${today}`,
          title: 'Simule sua 2ª opção no Simulador Sisu',
          type: 'review',
          topic: 'Simulador Sisu',
          target: 1,
          progress: 0,
          completed: false,
          xp: 35,
        });
        changed = true;
      }
      if (!missions.some((m) => m.id.startsWith('treino-rapido'))) {
        missions.push({
          id: `treino-rapido-${today}`,
          title: 'Responda 10 questões no Treino Rápido',
          type: 'questions',
          topic: 'Treino Rápido',
          target: 10,
          progress: 0,
          completed: false,
          xp: 40,
        });
        changed = true;
      }
      if (changed) {
        localStorage.setItem(key, JSON.stringify(missions));
      }
    }
    return missions;
  }

  public updateProgress(missionId: string, delta: number): void {
    const today = new Date().toISOString().slice(0, 10);
    const key = `missions_${today}`;
    const stored = localStorage.getItem(key);
    if (!stored) return;

    const missions: Mission[] = JSON.parse(stored);
    const missionIdx = missions.findIndex(m => m.id === missionId);
    
    if (missionIdx !== -1) {
      const mission = missions[missionIdx];
      if (mission.completed) return;

      mission.progress = Math.max(0, Math.min(mission.target, mission.progress + delta));
      if (!mission.completed && mission.progress >= mission.target) {
        mission.completed = true;
        // Reward XP to the global level system
        levelSystem.addXP(mission.xp, mission.topic);
      }
      localStorage.setItem(key, JSON.stringify(missions));

      if (missions.every(m => m.completed)) {
        this._updateHistory();
      }
    }
  }

  private _updateHistory(): void {
    const today = new Date().toISOString().slice(0, 10);
    const key = `missions_${today}`;
    const stored = localStorage.getItem(key);
    if (!stored) return;

    const missions: Mission[] = JSON.parse(stored);
    const topics = missions.map(m => m.topic).filter(Boolean);
    const historyStr = localStorage.getItem('mission_history') || '[]';
    let history: string[] = JSON.parse(historyStr);
    history.push(...topics);
    history = history.slice(-10);
    localStorage.setItem('mission_history', JSON.stringify(history));
  }

  public getStatus(): MissionStatus[] {
    const missions = this.getMissionsForToday();
    return missions.map(({ id, title, progress, target, xp, completed }) => ({
      id,
      title,
      progress: `${progress}/${target}`,
      reward: `${xp} XP`,
      completed,
      rawProgress: progress,
      rawTarget: target
    }));
  }

  public suggestNextChallenge(performance: Record<string, number> = {}): string {
    const lowPerf = Object.entries(performance).filter(([, score]) => score < 0.7);
    if (lowPerf.length > 0) {
      const [topic] = lowPerf[0];
      return `IA sugere: Revise ${topic} com exercícios adicionais.`;
    }
    return 'IA aprova: Prossiga com as missões diárias.';
  }
}

export const missionEngine = new MissionEngine();
