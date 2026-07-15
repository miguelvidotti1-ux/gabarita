import { useState, useMemo } from 'react';
import { Vestibular } from '../types';
import { Play, Search, Filter, Clock, GraduationCap } from 'lucide-react';
import { auth } from '../firebase';
import { achievementService } from '../services/achievementService';
import { missionEngine } from '../services/missionService';

const VIDEOS = [
  { title: "Introdução à Química Geral", materia: "Química", vestibular: "ENEM", thumbnail: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&auto=format&fit=crop", duracao: "12:10" },
  { title: "Leis de Newton na Prática", materia: "Física", vestibular: "ENEM", thumbnail: "https://images.unsplash.com/photo-1636466484362-ad1388d21cf7?w=800&auto=format&fit=crop", duracao: "16:25" },
  { title: "Ecologia e Meio Ambiente", materia: "Biologia", vestibular: "ENEM", thumbnail: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&auto=format&fit=crop", duracao: "14:00" },
  { title: "Matemática Básica para o ENEM", materia: "Matemática", vestibular: "ENEM", thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop", duracao: "12:45" },
  { title: "Brasil Colônia: Sociedade e Economia", materia: "História", vestibular: "ENEM", thumbnail: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop", duracao: "17:00" },
  { title: "Geografia e Globalização", materia: "Geografia", vestibular: "ENEM", thumbnail: "https://images.unsplash.com/photo-1526628929780-1a7428f57279?w=800&auto=format&fit=crop", duracao: "15:45" },
  { title: "Sociologia: Cultura e Indústria Cultural", materia: "Sociologia", vestibular: "ENEM", thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop", duracao: "14:30" },
  { title: "Filosofia: O pensamento Socrático", materia: "Filosofia", vestibular: "ENEM", thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop", duracao: "16:15" },
  { title: "O Barroco no Brasil", materia: "Artes", vestibular: "ENEM", thumbnail: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop", duracao: "14:20", url: "https://www.youtube.com/watch?v=X7K6GZJnyIs" }
];

export default function Videos({ vestibular: currentVestibularProp }: { vestibular: Vestibular }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [materiaFilter, setMateriaFilter] = useState('all');
  const [vestibularFilter, setVestibularFilter] = useState('all');

  const handleVideoClick = (video: any) => {
    // Open URL if available (if not, search on YouTube)
    const url = video.url || "https://www.youtube.com/results?search_query=" + encodeURIComponent("Aula " + video.title);
    window.open(url, '_blank');

    // Update Daily Missions for video-watching ('watch')
    try {
      missionEngine.getMissionsForToday().forEach(m => {
        if (m.type === 'watch' && (m.topic === video.materia || m.topic === 'review')) {
          missionEngine.updateProgress(m.id, 1);
        }
      });
    } catch (err) {
      console.error(err);
    }

    // Update User Metas/Achievements automatically
    if (auth.currentUser) {
      achievementService.trackActivity(auth.currentUser.uid, 'aulas', 1);
    }
  };

  const materias = useMemo(() => ['all', ...new Set(VIDEOS.map(v => v.materia))].sort(), []);
  const vestibularesList = useMemo(() => ['all', ...new Set(VIDEOS.map(v => v.vestibular))].sort(), []);

  const filteredVideos = useMemo(() => {
    return VIDEOS.filter(video =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (materiaFilter === 'all' || video.materia === materiaFilter) &&
      (vestibularFilter === 'all' || video.vestibular === vestibularFilter)
    );
  }, [searchQuery, materiaFilter, vestibularFilter]);

  const groupedVideos = useMemo(() => {
    const groups: Record<string, typeof VIDEOS> = {};
    filteredVideos.forEach(video => {
      if (!groups[video.materia]) {
        groups[video.materia] = [];
      }
      groups[video.materia].push(video);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredVideos]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col gap-6">
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-4xl font-black text-[var(--text-primary)]">Vídeo Hub</h1>
          <p className="text-[var(--text-secondary)]">Explore nossa biblioteca de aulas preparatórias.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] transition-colors group-focus-within:text-[var(--text-accent)]" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por título..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--text-accent)] focus:border-transparent outline-none shadow-sm transition-all"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" size={18} />
            <select 
              value={materiaFilter}
              onChange={(e) => setMateriaFilter(e.target.value)}
              className="w-full pl-12 pr-10 py-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-primary)] appearance-none focus:ring-2 focus:ring-[var(--text-accent)] outline-none cursor-pointer shadow-sm transition-all"
            >
              {materias.map(m => (
                <option key={m} value={m} className="bg-[var(--bg-primary)]">
                  {m === 'all' ? 'Todas as Matérias' : m}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-secondary)]">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
          </div>

          <div className="relative">
            <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" size={18} />
            <select 
              value={vestibularFilter}
              onChange={(e) => setVestibularFilter(e.target.value)}
              className="w-full pl-12 pr-10 py-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-primary)] appearance-none focus:ring-2 focus:ring-[var(--text-accent)] outline-none cursor-pointer shadow-sm transition-all"
            >
              {vestibularesList.map(v => (
                <option key={v} value={v} className="bg-[var(--bg-primary)]">
                  {v === 'all' ? 'Todos os Vestibulares' : v}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-secondary)]">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {groupedVideos.length === 0 ? (
          <div className="text-center py-20 bg-[var(--card-bg)] border border-dashed border-[var(--card-border)] rounded-[2.5rem]">
            <Play size={48} className="mx-auto text-[var(--text-accent)] mb-4 opacity-20" />
            <p className="text-[var(--text-secondary)] text-lg">Nenhum vídeo encontrado para os filtros selecionados.</p>
          </div>
        ) : (
          groupedVideos.map(([materia, videos]) => (
            <div key={materia} className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black text-[var(--text-primary)]">{materia}</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-[var(--card-border)] to-transparent" />
                <span className="text-xs font-black text-[var(--text-accent)] bg-[var(--bg-secondary)] px-3 py-1 rounded-full border border-[var(--card-border)]">
                  {videos.length} {videos.length === 1 ? 'Aula' : 'Aulas'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videos.map((video, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => handleVideoClick(video)}
                    className="group bg-[var(--card-bg)] rounded-[2.5rem] border border-[var(--card-border)] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[var(--text-accent)]/10 hover:-translate-y-2 transition-all duration-500 cursor-pointer"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <div className="bg-white/90 p-4 rounded-full text-[var(--text-accent)] scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all shadow-xl">
                          <Play size={24} fill="currentColor" />
                        </div>
                      </div>
                      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-md flex items-center gap-1">
                        <Clock size={12} />
                        {video.duracao}
                      </div>
                    </div>
                    
                    <div className="p-8 space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-[var(--text-accent)] uppercase tracking-wider">{video.vestibular}</span>
                        <h3 className="text-lg font-black text-[var(--text-primary)] leading-tight group-hover:text-[var(--text-accent)] transition-colors line-clamp-2">
                          {video.title}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm font-medium">
                        <GraduationCap size={16} />
                        <span>{video.materia}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
