import React from 'react';
import { BookOpen, Brain, Users, Zap } from 'lucide-react';

export default function StudyMethodsSection() {
  const methods = [
    { name: 'Técnica Pomodoro', icon: Zap, desc: 'Foco intenso intercalado com pausas curtas.', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/60' },
    { name: 'Técnica Feynman', icon: Brain, desc: 'Explique um conceito como se estivesse ensinando alguém.', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/60' },
    { name: 'Active Recall', icon: BookOpen, desc: 'Testar-se ativamente em vez de apenas reler.', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/60' },
    { name: 'Estudo em Grupo', icon: Users, desc: 'Discutir tópicos com outras pessoas.', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/60' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <h3 className="text-lg font-black font-display text-slate-900 dark:text-white flex items-center gap-2">
        <BookOpen className="text-indigo-600 dark:text-indigo-400" size={20} />
        Técnicas de Estudo
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {methods.map((method, i) => (
          <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1">
            <div className={`w-8 h-8 rounded-lg ${method.bg} flex items-center justify-center ${method.color} mb-2`}>
              <method.icon size={18} />
            </div>
            <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{method.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{method.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
