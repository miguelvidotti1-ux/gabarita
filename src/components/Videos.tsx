import { useState } from 'react';
import { Vestibular } from '../types';
import { Play, Search, Filter, ExternalLink } from 'lucide-react';
import { VESTIBULARES_DATA } from '../constants';
import { missionEngine } from '../services/missionService';

export default function Videos({ vestibular }: { vestibular: Vestibular }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleVideoClick = (subject: string) => {
    // Each click counts as 10 min of watch time for experimental purposes
    const minutes = 10;
    missionEngine.getMissionsForToday().forEach(m => {
      if (m.type === 'watch' && (m.topic === subject || m.topic === 'review')) {
        missionEngine.updateProgress(m.id, minutes);
      }
    });
  };

  // Group topics by subject for the selected vestibular
  const groupedVideos = VESTIBULARES_DATA[vestibular]
    .map(subject => ({
      ...subject,
      topics: subject.topics.filter(topic =>
        topic.youtubeId &&
        (topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         subject.subject.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }))
    .filter(subject => subject.topics.length > 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Vídeos e Aulas: {vestibular}</h1>
          <p className="text-slate-500 dark:text-blue-300">Aulas curtas e focadas nos temas mais recorrentes.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-blue-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar aula..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-blue-800 bg-white dark:bg-blue-950 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <button className="bg-blue-50 dark:bg-blue-800 p-3 rounded-xl text-slate-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-700 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {groupedVideos.map(subject => (
        <div key={subject.subject} className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{subject.subject}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subject.topics.map(topic => (
              <a 
                key={topic.youtubeId} 
                href={`https://www.youtube.com/watch?v=${topic.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleVideoClick(subject.subject)}
                className="bg-white dark:bg-blue-900 rounded-2xl border dark:border-blue-800 shadow-sm hover:shadow-xl transition-all overflow-hidden group cursor-pointer"
              >
                <div className="relative aspect-video">
                  <img src={`https://img.youtube.com/vi/${topic.youtubeId}/mqdefault.jpg`} alt={topic.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="bg-white/90 dark:bg-blue-950/90 p-4 rounded-full text-blue-600 dark:text-blue-400 scale-90 group-hover:scale-100 transition-transform shadow-xl">
                      <Play size={24} fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink size={16} />
                  </div>
                </div>
                <div className="p-6 overflow-hidden">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2" title={topic.name}>{topic.name}</h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}

      {groupedVideos.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-500 dark:text-blue-300 text-xl">Nenhum vídeo encontrado para sua busca.</p>
        </div>
      )}
    </div>
  );
}
