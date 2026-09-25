import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  X,
  HelpCircle,
  Award
} from 'lucide-react';
import LigacoesQuimicasMindMap from './LigacoesQuimicasMindMap';

interface ChemistryVideoModalProps {
  onClose: () => void;
  onCompleted?: () => void;
}

interface Slide {
  id: number;
  timeStart: number;
  duration: number;
  topic: string;
  badge: string;
  title: string;
  subtitle: string;
  narration: string;
  renderVisual: () => React.ReactNode;
}

export default function ChemistryVideoModal({ onClose, onCompleted }: ChemistryVideoModalProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showMindMap, setShowMindMap] = useState(false);

  // Slides structure based on the user's video "As Ligações Químicas"
  const slides: Slide[] = [
    {
      id: 0,
      timeStart: 0,
      duration: 8,
      topic: 'Abertura & Apresentação',
      badge: 'Introdução',
      title: 'As Ligações Químicas',
      subtitle: 'Por que o universo se mantém unido e como os átomos encontram o equilíbrio',
      narration: 'Hoje vamos mergulhar fundo nas engrenagens ocultas do universo! Vamos focar na famosa Regra do Octeto e nos 3 grandes pilares: Iônica, Covalente e Metálica.',
      renderVisual: () => (
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
          <div className="relative">
            {/* Visual do quebra-cabeça colorido da aula */}
            <div className="w-40 h-40 grid grid-cols-2 gap-2 p-3 bg-white/5 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-md">
              <div className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg animate-pulse">
                🌱
              </div>
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg">
                ⚡
              </div>
              <div className="bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg">
                🔥
              </div>
              <div className="bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg animate-pulse">
                💧
              </div>
            </div>
            <div className="absolute -top-3 -right-3 bg-blue-500 text-white p-2 rounded-full shadow-lg">
              <Sparkles size={16} />
            </div>
          </div>
          <div className="space-y-2 max-w-md">
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">As Ligações Químicas</h3>
            <p className="text-sm text-slate-300">Entenda a regra do octeto, transferência e compartilhamento de elétrons.</p>
          </div>
        </div>
      )
    },
    {
      id: 1,
      timeStart: 8,
      duration: 10,
      topic: 'Fundamento',
      badge: 'Estabilidade',
      title: 'Por que os átomos se unem?',
      subtitle: 'Instabilidade pura e simples: átomos buscam o menor nível de energia',
      narration: 'Na natureza, átomos isolados são instáveis. Como peças de um quebra-cabeça procurando o encaixe perfeito, eles precisam interagir, reagir e se conectar para atingir a paz e estabilidade.',
      renderVisual: () => (
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center text-4xl shadow-inner animate-bounce">
            ❓
          </div>
          <div className="max-w-md space-y-3 bg-white/5 p-6 rounded-2xl border border-white/10">
            <h4 className="text-lg font-bold text-amber-300">Princípio da Mínima Energia</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Átomos isolados têm alta energia potencial e instabilidade. Ao formar ligações, liberam energia e alcançam a configuração estável de um gás nobre.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      timeStart: 18,
      duration: 12,
      topic: 'Pilar 1',
      badge: 'Regra de Ouro',
      title: 'A Regra do Octeto',
      subtitle: 'Átomos buscam 8 elétrons na camada de valência imitando os gases nobres',
      narration: 'Os gases nobres (Hélio, Neônio, Argônio) já nascem com a camada de valência completa. Para imitá-los, os outros átomos ganham, perdem ou compartilham elétrons até atingirem 8 elétrons (ou 2, como o Hélio).',
      renderVisual: () => (
        <div className="flex flex-col items-center justify-center p-6 space-y-4">
          <div className="flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 text-white font-black text-6xl shadow-2xl border-4 border-white/20">
            8
          </div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-sky-300">Elétrons de Valência</span>
          <div className="grid grid-cols-2 gap-3 w-full max-w-sm text-left text-xs text-slate-300 mt-2">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <strong className="text-white block mb-0.5">Meta Universal:</strong>
              Completar o octeto energético estável.
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <strong className="text-white block mb-0.5">Exceção Notável:</strong>
              Hidrogênio estabiliza com 2 elétrons (dupleto do He).
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      timeStart: 30,
      duration: 14,
      topic: 'Pilar 2',
      badge: 'Transferência Total',
      title: 'Ligação Iônica: Metal + Ametal',
      subtitle: 'Metais doam elétrons (cátions) e Ametais recebem (ânions)',
      narration: 'Na ligação iônica, ocorre a transferência definitiva de elétrons! Os metais são generosos e doam elétrons virando cátions (+). Os ametais são ávidos por elétrons e viram ânions (-). A atração eletrostática os une firmemente formando retículos cristalinos.',
      renderVisual: () => (
        <div className="flex flex-col items-center justify-center p-4 space-y-5">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-500/20 border border-blue-400/40 rounded-2xl text-center">
              <span className="text-xs font-bold text-blue-300 block">Metal (Na⁺)</span>
              <span className="text-2xl font-black text-white">Doa e⁻</span>
            </div>
            <span className="text-2xl text-slate-400 font-bold">➔</span>
            <div className="p-4 bg-rose-500/20 border border-rose-400/40 rounded-2xl text-center">
              <span className="text-xs font-bold text-rose-300 block">Ametal (Cl⁻)</span>
              <span className="text-2xl font-black text-white">Recebe e⁻</span>
            </div>
          </div>

          <div className="w-full max-w-md bg-white/5 rounded-xl p-3 border border-white/10 text-xs text-slate-300 space-y-1">
            <div className="flex justify-between py-1 border-b border-white/5">
              <span>Estado a 25°C:</span>
              <strong className="text-white">Sólido cristalino</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span>Ponto de Fusão:</span>
              <strong className="text-white">Altíssimo (&gt; 300°C)</strong>
            </div>
            <div className="flex justify-between py-1">
              <span>Condutividade:</span>
              <strong className="text-white">Fundidos ou em solução aquosa</strong>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      timeStart: 44,
      duration: 12,
      topic: 'Método Prático',
      badge: 'Regra do Escorrega',
      title: 'Fórmula Iônica Cruzada',
      subtitle: 'Cruzar as valências dos íons para obter o composto neutro',
      narration: 'Quer descobrir a fórmula do composto iônico? Aplique a regra do escorrega! Se o Magnésio é 2+ e o Bromo é 1-, a carga do Mg vai pro pé do Br e a do Br vai pro Mg: fórmula resultante MgBr₂.',
      renderVisual: () => (
        <div className="flex flex-col items-center justify-center p-6 space-y-4">
          <div className="flex items-center gap-6 text-xl sm:text-2xl font-black font-mono">
            <div className="p-3 bg-blue-500/20 border border-blue-400 rounded-xl text-blue-300">
              Mg<sup className="text-amber-400 font-bold">2+</sup>
            </div>
            <span className="text-slate-500">+</span>
            <div className="p-3 bg-purple-500/20 border border-purple-400 rounded-xl text-purple-300">
              Br<sup className="text-amber-400 font-bold">1-</sup>
            </div>
            <span className="text-slate-400 font-bold">➔</span>
            <div className="p-3 bg-emerald-500/20 border border-emerald-400 rounded-xl text-emerald-300">
              Mg₁Br₂
            </div>
          </div>
          <p className="text-xs text-slate-400 text-center max-w-sm">
            A carga total do composto é sempre zero. Cruzando os expoentes obtemos a proporção estequiométrica ideal.
          </p>
        </div>
      )
    },
    {
      id: 5,
      timeStart: 56,
      duration: 14,
      topic: 'Pilar 3',
      badge: 'Compartilhamento',
      title: 'Ligação Covalente: Ametal + Ametal',
      subtitle: 'Sem perdedores: pares de elétrons compartilhados pertencem a ambos os átomos',
      narration: 'E quando nenhum átomo quer doar? Na ligação covalente, os ametais cooperam! Eles compartilham pares eletrônicos. Pode ser simples (1 par, H₂), dupla (2 pares, O₂) ou tripla (3 pares, N₂). E tem a dativa: onde um só átomo fornece o par!',
      renderVisual: () => (
        <div className="flex flex-col items-center justify-center p-4 space-y-4">
          <div className="grid grid-cols-3 gap-3 w-full max-w-md text-center text-xs">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-sky-400 font-bold block mb-1">Simples (—)</span>
              <strong className="text-white text-sm">H — H</strong>
              <span className="text-[10px] text-slate-400 block mt-1">1 par (H₂)</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-rose-400 font-bold block mb-1">Dupla (=)</span>
              <strong className="text-white text-sm">O = O</strong>
              <span className="text-[10px] text-slate-400 block mt-1">2 pares (O₂)</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-amber-400 font-bold block mb-1">Tripla (≡)</span>
              <strong className="text-white text-sm">N ≡ N</strong>
              <span className="text-[10px] text-slate-400 block mt-1">3 pares (N₂)</span>
            </div>
          </div>

          <div className="w-full max-w-md p-3 bg-indigo-500/10 rounded-xl border border-indigo-400/20 text-xs text-slate-300">
            <span className="font-bold text-indigo-300 block mb-0.5">Ligação Dativa / Coordenada:</span>
            Um átomo já estável doa o par de elétrons excedente para o outro (ex: O₃ Ozônio, SO₂).
          </div>
        </div>
      )
    },
    {
      id: 6,
      timeStart: 70,
      duration: 14,
      topic: 'Pilar 4',
      badge: 'Mar de Elétrons',
      title: 'Ligação Metálica: Metal + Metal',
      subtitle: 'Cátions fixos imersos em elétrons livres e deslocalizados',
      narration: 'Quando só há átomos metálicos, todos soltam elétrons! Eles formam uma rede de cátions envolvida por um mar fluido de elétrons livres. Isso explica a alta condutividade térmica, elétrica, maleabilidade e ductilidade dos metais.',
      renderVisual: () => (
        <div className="flex flex-col items-center justify-center p-4 space-y-4">
          {/* Mar de elétrons estilizado */}
          <div className="w-full max-w-md h-28 bg-gradient-to-r from-amber-500/15 via-orange-500/20 to-amber-500/15 rounded-2xl border border-amber-500/30 p-3 flex items-center justify-around relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-500/10 animate-pulse pointer-events-none" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-md">
                  +
                </div>
                <span className="text-[9px] font-mono text-amber-300 mt-1">e⁻</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 w-full max-w-md text-xs text-slate-300">
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
              <strong className="text-amber-400 block">Condutores Top:</strong>
              Elétrons livres transportam carga e calor rapidamente.
            </div>
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
              <strong className="text-amber-400 block">Maleáveis & Dúcteis:</strong>
              O mar amortece pancadas sem quebrar a rede.
            </div>
          </div>
        </div>
      )
    },
    {
      id: 7,
      timeStart: 84,
      duration: 12,
      topic: 'Exceções Clássicas',
      badge: 'Atenção Vestibular',
      title: 'Exceções ao Octeto: Berílio e Boro',
      subtitle: 'Contração do octeto: compostos estáveis com menos de 8 elétrons',
      narration: 'Fique atento para a pegadinha dos vestibulares: Berílio (Be) atinge a estabilidade com apenas 4 elétrons (ex: BeCl₂). O Boro (B) estabiliza com 6 elétrons (ex: BF₃). Guarde bem essas exceções!',
      renderVisual: () => (
        <div className="flex flex-col items-center justify-center p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="p-4 bg-rose-500/15 border border-rose-400/40 rounded-2xl text-center">
              <span className="text-3xl font-black text-rose-400 block">4 e⁻</span>
              <strong className="text-white text-sm block mt-1">Berílio (Be)</strong>
              <span className="text-[11px] text-slate-300">Ex: BeCl₂, BeH₂</span>
            </div>
            <div className="p-4 bg-sky-500/15 border border-sky-400/40 rounded-2xl text-center">
              <span className="text-3xl font-black text-sky-400 block">6 e⁻</span>
              <strong className="text-white text-sm block mt-1">Boro (B)</strong>
              <span className="text-[11px] text-slate-300">Ex: BF₃, BCl₃</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/30">
            <Sparkles size={14} />
            <span>Tema frequente na FUVEST, UNICAMP e ENEM!</span>
          </div>
        </div>
      )
    }
  ];

  const currentSlide = slides[currentSlideIndex];

  // Auto-advance progress and slides when playing
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            // Next slide
            if (currentSlideIndex < slides.length - 1) {
              setCurrentSlideIndex((curr) => curr + 1);
              return 0;
            } else {
              setIsPlaying(false);
              if (onCompleted) onCompleted();
              return 100;
            }
          }
          return prev + 1.25;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentSlideIndex, slides.length, onCompleted]);

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((c) => c + 1);
      setProgress(0);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((c) => c - 1);
      setProgress(0);
    }
  };

  const handleSelectSlide = (idx: number) => {
    setCurrentSlideIndex(idx);
    setProgress(0);
    setIsPlaying(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0B0F19] text-white rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* TOP BAR */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#0e1422]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center shadow-md">
              <BookOpen size={20} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Vídeo-Aula Química
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">•</span>
                <span className="text-xs text-slate-400 hidden sm:inline">{currentSlide.topic}</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white leading-tight">
                As Ligações Químicas: Iônica, Covalente e Metálica
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMindMap(!showMindMap)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>{showMindMap ? 'Ver Vídeo' : 'Simulador / Mapa'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Fechar"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* MAIN STAGE CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col justify-between min-h-[380px]">
          {showMindMap ? (
            <div className="py-2">
              <LigacoesQuimicasMindMap />
            </div>
          ) : (
            <>
              {/* CURRENT SLIDE HEADER */}
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-extrabold text-blue-400 uppercase tracking-widest">
                    Módulo {currentSlideIndex + 1} de {slides.length} • {currentSlide.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">{currentSlide.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400">{currentSlide.subtitle}</p>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-mono text-slate-400">
                    {Math.round(((currentSlideIndex * 100) + progress) / slides.length)}% concluído
                  </span>
                </div>
              </div>

              {/* DYNAMIC VISUAL COMPONENT */}
              <div className="flex-1 flex items-center justify-center my-2 bg-gradient-to-b from-white/[0.03] to-white/[0.01] rounded-2xl border border-white/5">
                {currentSlide.renderVisual()}
              </div>

              {/* NARRATION BOX (Subtitles from Video) */}
              <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles size={16} />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                    "{currentSlide.narration}"
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* BOTTOM CONTROLS & TIMELINE TRACK */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0e1422] space-y-3">
          {/* Progress bar per slide */}
          <div className="grid grid-cols-8 gap-1.5 w-full">
            {slides.map((s, idx) => {
              const isPast = idx < currentSlideIndex;
              const isCurrent = idx === currentSlideIndex;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSelectSlide(idx)}
                  className="h-1.5 sm:h-2 rounded-full overflow-hidden bg-white/10 transition-all hover:bg-white/25 cursor-pointer relative"
                  title={s.title}
                >
                  <div
                    className={`h-full transition-all ${
                      isPast
                        ? 'w-full bg-blue-500'
                        : isCurrent
                        ? 'bg-blue-400'
                        : 'w-0'
                    }`}
                    style={isCurrent ? { width: `${progress}%` } : undefined}
                  />
                </button>
              );
            })}
          </div>

          {/* PLAYBACK BUTTONS */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white flex items-center justify-center transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
                title={isPlaying ? 'Pausar' : 'Reproduzir'}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
              </button>

              <button
                onClick={() => {
                  setCurrentSlideIndex(0);
                  setProgress(0);
                  setIsPlaying(true);
                }}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Reiniciar Aula"
              >
                <RotateCcw size={16} />
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title={isMuted ? 'Ativar som' : 'Silenciar'}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentSlideIndex === 0}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold transition-all cursor-pointer"
              >
                Anterior
              </button>

              <button
                onClick={handleNext}
                disabled={currentSlideIndex === slides.length - 1}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/20"
              >
                <span>Próximo Tópico</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
