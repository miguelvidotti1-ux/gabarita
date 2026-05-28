import { useState, useMemo } from 'react';
import { Vestibular } from '../types';
import { Play, Search, Filter, Clock, GraduationCap } from 'lucide-react';

const VIDEOS = [
  {
    title: "Resolução de Equações Quadráticas",
    materia: "Matemática",
    vestibular: "ENEM",
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop",
    duracao: "12:45"
  },
  {
    title: "Funções Trigonométricas",
    materia: "Matemática",
    vestibular: "FUVEST",
    thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop",
    duracao: "15:30"
  },
  {
    title: "Geometria Analítica",
    materia: "Matemática",
    vestibular: "UNICAMP",
    thumbnail: "https://images.unsplash.com/photo-1543286386-2e671340c33c?w=800&auto=format&fit=crop",
    duracao: "10:15"
  },
  {
    title: "Razão e Proporção - Prof. Robson Liers",
    materia: "Matemática",
    vestibular: "ENEM",
    thumbnail: "https://img.youtube.com/vi/OC3GHbT7-uI/maxresdefault.jpg",
    duracao: "4:27",
    url: "https://www.youtube.com/watch?v=OC3GHbT7-uI"
  },
  {
    title: "Interpretação de Textos Narrativos",
    materia: "Português",
    vestibular: "ENEM",
    thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop",
    duracao: "08:20"
  },
  {
    title: "Gramática Normativa",
    materia: "Português",
    vestibular: "FUVEST",
    thumbnail: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop",
    duracao: "11:05"
  },
  {
    title: "Células e Tecidos",
    materia: "Biologia",
    vestibular: "ENEM",
    thumbnail: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&auto=format&fit=crop",
    duracao: "14:00"
  },
  {
    title: "Genética Mendelliana",
    materia: "Biologia",
    vestibular: "UNICAMP",
    thumbnail: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&auto=format&fit=crop",
    duracao: "13:40"
  },
  {
    title: "Leis de Newton",
    materia: "Física",
    vestibular: "FUVEST",
    thumbnail: "https://images.unsplash.com/photo-1636466484362-ad1388d21cf7?w=800&auto=format&fit=crop",
    duracao: "16:25"
  },
  {
    title: "Ondulatória",
    materia: "Física",
    vestibular: "ENEM",
    thumbnail: "https://images.unsplash.com/photo-1517466787929-bc904b77ed21?w=800&auto=format&fit=crop",
    duracao: "09:50"
  },
  {
    title: "Reações Químicas",
    materia: "Química",
    vestibular: "ENEM",
    thumbnail: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&auto=format&fit=crop",
    duracao: "12:10"
  },
  {
    title: "Revolução Industrial",
    materia: "História",
    vestibular: "FUVEST",
    thumbnail: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop",
    duracao: "17:00"
  },
  {
    title: "O Barroco no Brasil: Arte, Arquitetura e Contexto Histórico",
    materia: "Artes",
    vestibular: "ENEM",
    thumbnail: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop",
    duracao: "14:20",
    url: "https://www.youtube.com/watch?v=X7K6GZJnyIs"
  },
  {
    title: "Romantismo nas Artes: Emoção e Nacionalismo",
    materia: "Artes",
    vestibular: "FUVEST",
    thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop",
    duracao: "11:15",
    url: "https://www.youtube.com/watch?v=Z0lVfB_J3k4"
  },
  {
    title: "Realismo e a Crítica Social na Pintura",
    materia: "Artes",
    vestibular: "UNICAMP",
    thumbnail: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop",
    duracao: "13:10",
    url: "https://www.youtube.com/watch?v=v8A9U1T5tRE"
  },
  {
    title: "Modernismo e a Semana de Arte Moderna de 1922",
    materia: "Artes",
    vestibular: "ENEM",
    thumbnail: "https://images.unsplash.com/photo-1601887389937-0b02c26b6c3c?w=800&auto=format&fit=crop",
    duracao: "18:45",
    url: "https://www.youtube.com/watch?v=pS2tE6a-T5g"
  },
  {
    title: "Arte Contemporânea: Conceitos, Performances e Instalações",
    materia: "Artes",
    vestibular: "FUVEST",
    thumbnail: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop",
    duracao: "15:22",
    url: "https://www.youtube.com/watch?v=lZ_2p18Y0qg"
  }
];

export default function Videos({ vestibular: currentVestibularProp }: { vestibular: Vestibular }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [materiaFilter, setMateriaFilter] = useState('all');
  const [vestibularFilter, setVestibularFilter] = useState('all');

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
                    onClick={() => (video as any).url && window.open((video as any).url, '_blank')}
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
