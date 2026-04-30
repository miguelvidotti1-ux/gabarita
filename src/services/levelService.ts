
export interface SubjectStatus {
  xp: number;
  level: number;
}

export interface GlobalStatus {
  xp: number;
  level: number;
  streak: number;
}

export interface LevelSystemStatus {
  global: GlobalStatus;
  subjects: Record<string, SubjectStatus>;
}

class LevelSystem {
  private subjectsXP: Record<string, number> = {};
  private streak: number = 0;
  private lastStudyDate: string | null = null;

  constructor() {
    this.load();
  }

  private getToday(): string {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now.toISOString().split('T')[0];
  }

  private load(): void {
    try {
      const data = JSON.parse(localStorage.getItem('levelSystem') || '{}');
      this.subjectsXP = data.subjectsXP || {};
      this.streak = data.streak || 0;
      this.lastStudyDate = data.lastStudyDate || null;
    } catch (e) {
      this.subjectsXP = {};
      this.streak = 0;
      this.lastStudyDate = null;
    }
  }

  private save(): void {
    const data = {
      subjectsXP: this.subjectsXP,
      streak: this.streak,
      lastStudyDate: this.lastStudyDate
    };
    localStorage.setItem('levelSystem', JSON.stringify(data));
  }

  private getTotalXP(): number {
    return Object.values(this.subjectsXP).reduce((sum, xp) => sum + xp, 0);
  }

  private getLevel(xp: number): number {
    let level = 1;
    let xpNeeded = 0;
    while (true) {
      const nextNeeded = xpNeeded + 100 * level;
      if (xp < nextNeeded) {
        return level;
      }
      xpNeeded = nextNeeded;
      level++;
    }
  }

  private updateStreak(): void {
    const today = this.getToday();
    if (this.lastStudyDate === today) {
      return;
    }
    if (this.lastStudyDate) {
      const lastDate = new Date(this.lastStudyDate + 'T00:00:00');
      const todayDate = new Date(today + 'T00:00:00');
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        this.streak++;
      } else {
        this.streak = 1;
      }
    } else {
      this.streak = 1;
    }
    this.lastStudyDate = today;
  }

  public addXP(amount: number, subject: string): void {
    this.updateStreak();
    const multiplier = this.streak >= 5 ? 1.5 : 1;
    const xpGain = amount * multiplier;
    if (!this.subjectsXP[subject]) {
      this.subjectsXP[subject] = 0;
    }
    this.subjectsXP[subject] += xpGain;
    this.save();
  }

  public getStatus(): LevelSystemStatus {
    const totalXP = this.getTotalXP();
    const subjectsStatus: Record<string, SubjectStatus> = {};
    for (const [subject, xp] of Object.entries(this.subjectsXP)) {
      subjectsStatus[subject] = {
        xp,
        level: this.getLevel(xp)
      };
    }
    return {
      global: {
        xp: totalXP,
        level: this.getLevel(totalXP),
        streak: this.streak
      },
      subjects: subjectsStatus
    };
  }
}

export const levelSystem = new LevelSystem();
