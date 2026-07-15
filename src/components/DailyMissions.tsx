import React, { useState, useEffect } from 'react';
import { CheckCircle, Plus, Zap, Trophy, Clock } from 'lucide-react';
import { missionEngine, MissionStatus } from '../services/missionService';
import { levelSystem, LevelSystemStatus } from '../services/levelService';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

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

  const completedCount = missions.filter(m => m.completed).length;
  const totalCount = missions.length;
  const pendingCount = totalCount - completedCount;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const chartData = totalCount > 0 ? [
    { name: 'Concluídas', value: completedCount, color: '#10b981' },
    { name: 'Pendentes', value: pendingCount, color: '#3b82f6' }
  ] : [
    { name: 'Concluídas', value: 0, color: '#10b981' },
    { name: 'Pendentes', value: 1, color: '#94a3b8' }
  ];

  return (
    <div className="bg-white dark:bg-blue-900 p-8 rounded-2xl border dark:border-blue-800 shadow-sm h-full">
      {showHeader && (
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">Missões Diárias</h3>
          <span className="text-xs text-slate-400 font-medium">Renova à meia-noite</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {missions.map((mission) => (
            <div 
              key={mission.id} 
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                mission.completed 
                  ? 'bg-green-50/50 dark:bg-green-950/10 border-green-200 dark:border-green-900/30 opacity-75' 
                  : 'bg-white dark:bg-blue-950 border-slate-100 dark:border-blue-800 shadow-sm'
              }`}
            >
              <div>
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
                    <div className="bg-green-500 text-white p-1 rounded-full shrink-0">
                      <CheckCircle size={14} />
                    </div>
                  ) : (
                    <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 shrink-0 flex items-center justify-center" title="Pendente - Conclua as atividades na plataforma para progredir!">
                      <Clock size={14} className="animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-[10px] font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 dark:bg-blue-900 dark:text-blue-200">
                      Progresso
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-semibold inline-block text-blue-600 dark:text-blue-400 font-mono">
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

        <div className="bg-slate-50 dark:bg-blue-950/50 p-6 rounded-2xl border border-slate-100 dark:border-blue-900/45 flex flex-col items-center justify-center min-h-[240px]">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-blue-300 mb-4 text-center">Conclusão das Missões</h4>
          
          <div className="relative w-40 h-40 flex items-center justify-center">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              <span className="text-3xl font-black text-slate-800 dark:text-white leading-none">{completionPercentage}%</span>
              <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 dark:text-blue-400 mt-1">Concluído</span>
            </div>
            
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={70}
                  paddingAngle={totalCount > 1 ? 4 : 0}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col gap-2 w-full mt-5 pt-4 border-t border-slate-200/60 dark:border-blue-900/60 text-[11px] font-bold text-slate-600 dark:text-blue-200">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 font-semibold text-slate-500 dark:text-blue-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
                Concluídas
              </span>
              <span className="font-mono">{completedCount} de {totalCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 font-semibold text-slate-500 dark:text-blue-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]"></span>
                Pendentes
              </span>
              <span className="font-mono">{pendingCount} de {totalCount}</span>
            </div>
          </div>
        </div>
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
