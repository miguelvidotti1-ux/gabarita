import React, { useState, useEffect } from 'react';
import { CheckCircle, Plus, Zap, Trophy, Clock } from 'lucide-react';
import { missionEngine, MissionStatus } from '../services/missionService';
import { levelSystem, LevelSystemStatus } from '../services/levelService';

export default function DailyMissions({ showHeader = true }: { showHeader?: boolean }) {
  const [missions, setMissions] = useState<MissionStatus[]>([]);
  const [levelStatus, setLevelStatus] = useState<LevelSystemStatus | null>(null);

  useEffect(() => {
    setMissions(missionEngine.getStatus());
    setLevelStatus(levelSystem.getStatus());
  }, []);

  const handleUpdateMission = (id: string, delta: number) => {
    missionEngine.updateProgress(id, delta);
    setMissions(missionEngine.getStatus());
    setLevelStatus(levelSystem.getStatus());
  };

  return (
    <div className="bg-white dark:bg-blue-900 p-8 rounded-2xl border dark:border-blue-800 shadow-sm h-full">
      {showHeader && (
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">Missões Diárias</h3>
          <span className="text-xs text-slate-400 font-medium">Renova à meia-noite</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {missions.map((mission) => (
          <div 
            key={mission.id} 
            className={`p-4 rounded-xl border transition-all ${
              mission.completed 
                ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/50 opacity-75' 
                : 'bg-white dark:bg-blue-950 border-slate-100 dark:border-blue-800 shadow-sm'
            }`}
          >
            <div className="flex justify-between items-start gap-4 mb-3">
              <div className="flex-1">
                <h4 className={`font-bold text-sm ${mission.completed ? 'text-green-700 dark:text-green-400 line-through' : 'text-slate-800 dark:text-white'}`}>
                  {mission.title}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-blue-300 uppercase tracking-widest font-black mt-1">
                  Recompensa: {mission.reward}
                </p>
              </div>
              {mission.completed ? (
                <div className="bg-green-500 text-white p-1 rounded-full">
                  <CheckCircle size={14} />
                </div>
              ) : (
                <button 
                  onClick={() => handleUpdateMission(mission.id, 1)}
                  className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 transition-colors"
                  title="Simular progresso"
                >
                  <Plus size={14} />
                </button>
              )}
            </div>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 dark:bg-blue-900 dark:text-blue-200">
                    Progresso
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-semibold inline-block text-blue-600 dark:text-blue-400">
                    {mission.progress}
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100 dark:bg-blue-950/50">
                <div 
                  style={{ width: `${(mission.rawProgress / mission.rawTarget) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-slate-50 dark:bg-blue-950/50 rounded-xl border border-dashed border-slate-200 dark:border-blue-800 text-center">
        <p className="text-xs italic text-slate-500 dark:text-blue-300">
           {missionEngine.suggestNextChallenge()}
        </p>
      </div>

      {levelStatus && (
        <div className="mt-8 pt-6 border-t dark:border-blue-800 grid grid-cols-3 gap-2">
            <div className="text-center">
                <p className="text-[10px] uppercase font-black text-slate-400 mb-1">XP</p>
                <p className="font-bold text-slate-800 dark:text-white">{levelStatus.global.xp}</p>
            </div>
            <div className="text-center">
                <p className="text-[10px] uppercase font-black text-slate-400 mb-1">STREAK</p>
                <p className="font-bold text-slate-800 dark:text-white">{levelStatus.global.streak}d</p>
            </div>
            <div className="text-center">
                <p className="text-[10px] uppercase font-black text-slate-400 mb-1">NÍVEL</p>
                <p className="font-bold text-slate-800 dark:text-white">{levelStatus.global.level}</p>
            </div>
        </div>
      )}
    </div>
  );
}
