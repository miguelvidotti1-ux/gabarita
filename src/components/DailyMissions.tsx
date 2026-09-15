import React, { useState, useEffect } from 'react';
import { CheckCircle, Plus, Zap, Trophy, Clock, Sparkles } from 'lucide-react';
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

  const completedCount = missions.filter(m => m.completed).length;
  const totalCount = missions.length;
  const pendingCount = totalCount - completedCount;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const chartData = totalCount > 0 ? [
    { name: 'Concluídas', value: completedCount, color: '#10B981' },
    { name: 'Pendentes', value: pendingCount, color: '#3B82F6' }
  ] : [
    { name: 'Concluídas', value: 0, color: '#10B981' },
    { name: 'Pendentes', value: 1, color: '#374151' }
  ];

  return (
    <div className="bg-[var(--bg-card)] p-6 sm:p-8 rounded-2xl border border-[var(--border-light)] shadow-sm h-full text-[var(--text-main)] font-sans">
      {showHeader && (
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-[var(--border-light)]">
          <div className="flex items-center gap-2">
            <Zap className="text-[var(--primary)]" size={20} />
            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-main)]">Missões & Metas Diárias</h3>
          </div>
          <span className="text-xs text-[var(--text-muted)] font-medium">Renovação automática diária</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {missions.map((mission) => (
            <div 
              key={mission.id} 
              className={`p-4 sm:p-5 rounded-xl border transition-all flex flex-col justify-between bg-[var(--bg-hover)] ${
                mission.completed 
                  ? 'border-emerald-500/40 bg-emerald-500/5' 
                  : 'border-[var(--border-light)] hover:border-[var(--border-color)]'
              }`}
            >
              <div>
                <div className="flex justify-between items-start gap-3 mb-3">
                  <div className="flex-1">
                    <h4 className={`font-bold text-sm text-[var(--text-main)] ${mission.completed ? 'line-through text-[var(--text-muted)]' : ''}`}>
                      {mission.title}
                    </h4>
                    <p className="text-[11px] text-[var(--primary)] font-semibold mt-1">
                      Recompensa: +{mission.reward} XP
                    </p>
                  </div>
                  {mission.completed ? (
                    <div className="bg-emerald-500 text-white p-1 rounded-full shrink-0 shadow-sm">
                      <CheckCircle size={15} />
                    </div>
                  ) : (
                    <div className="p-1 rounded-lg bg-[var(--bg-card)] text-[var(--text-label)] border border-[var(--border-light)] shrink-0 flex items-center justify-center">
                      <Clock size={15} className="animate-pulse text-[var(--primary)]" />
                    </div>
                  )}
                </div>
              </div>

              <div className="relative pt-2">
                <div className="flex mb-1.5 items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-label)]">
                    Progresso
                  </span>
                  <span className="text-[11px] font-bold font-mono text-[var(--primary)]">
                    {mission.progress}
                  </span>
                </div>
                <div className="overflow-hidden h-2 rounded-full bg-[var(--bg-card)] border border-[var(--border-light)]">
                  <div 
                    style={{ width: `${Math.min(100, (mission.rawProgress / (mission.rawTarget || 1)) * 100)}%` }}
                    className="h-full bg-[var(--primary)] rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ring Chart */}
        <div className="bg-[var(--bg-hover)] p-6 rounded-2xl border border-[var(--border-light)] flex flex-col items-center justify-center min-h-[220px]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3 text-center">
            Aproveitamento do Dia
          </h4>
          
          <div className="relative w-36 h-36 flex items-center justify-center">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              <span className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] leading-none">{completionPercentage}%</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] mt-1">Concluído</span>
            </div>
            
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={65}
                  paddingAngle={totalCount > 1 ? 4 : 0}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'Pendentes' ? '#3B82F6' : '#10B981'} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col gap-2 w-full mt-4 pt-3 border-t border-[var(--border-light)] text-xs text-[var(--text-muted)]">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 font-medium text-[var(--text-main)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Concluídas
              </span>
              <span className="font-mono font-semibold text-[var(--text-main)]">{completedCount} / {totalCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 font-medium text-[var(--text-muted)]">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                Pendentes
              </span>
              <span className="font-mono font-semibold text-[var(--text-muted)]">{pendingCount} / {totalCount}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-5 p-3.5 bg-[var(--bg-badge)] rounded-xl border border-[var(--primary-border)] text-center flex items-center justify-center gap-2">
        <Sparkles size={14} className="text-[var(--primary)] shrink-0" />
        <p className="text-xs text-[var(--text-main)] font-medium">
          {missionEngine.suggestNextChallenge()}
        </p>
      </div>

      {levelStatus && (
        <div className="mt-6 pt-5 border-t border-[var(--border-light)] grid grid-cols-3 gap-2">
          <div className="text-center">
            <p className="text-[10px] uppercase font-bold text-[var(--text-label)] mb-0.5">XP Total</p>
            <p className="text-base font-extrabold text-[var(--text-main)]">{levelStatus.global.xp.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase font-bold text-[var(--text-label)] mb-0.5">Ofensiva</p>
            <p className="text-base font-extrabold text-amber-400">{levelStatus.global.streak} dias 🔥</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase font-bold text-[var(--text-label)] mb-0.5">Nível</p>
            <p className="text-base font-extrabold text-indigo-400">Nvl {levelStatus.global.level}</p>
          </div>
        </div>
      )}
    </div>
  );
}
