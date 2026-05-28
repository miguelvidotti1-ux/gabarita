import { useState, useEffect } from 'react';
import { Vestibular } from '../types';
import { FileText, Sparkles, PenTool, CheckCircle, BookOpen, Loader2, Award, History, Camera, Target, Zap, Clock, Info, Share2, ArrowRight } from 'lucide-react';
import { ESSAY_THEMES } from '../constants';
import { generateEssayTheme, analyzeEssay, analyzeEssayFromImage, EssayAnalysis, Competency } from '../services/geminiService';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { missionEngine } from '../services/missionService';
import { collection, addDoc, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import GalleryPicker from './GalleryPicker';
import NativeCameraLauncher from './NativeCameraLauncher';
import { motion, AnimatePresence } from 'motion/react';


interface EssayResult {
  id: string;
  theme: string;
  essayText: string;
  generalCorrection?: string;
  competencies?: Competency[];
  grade?: number;
  timestamp: Timestamp;
  status: string;
}

export default function Redacao({ vestibular, setVestibular }: { vestibular: Vestibular, setVestibular: (v: Vestibular) => void }) {
  const themes = ESSAY_THEMES[vestibular] || [];
  const [selectedTheme, setSelectedTheme] = useState<string>(themes[0]?.theme || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzingFromImage, setIsAnalyzingFromImage] = useState(false);
  const [essayText, setEssayText] = useState('');
  const [correction, setCorrection] = useState<EssayAnalysis | null>(null);
  const [essayHistory, setEssayHistory] = useState<EssayResult[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    setSelectedTheme(themes[0]?.theme || '');
    setCorrection(null);
  }, [vestibular]);

  const handleImageEssayCorrection = async (file: File) => {
    if (!auth.currentUser) return alert("Você precisa estar logado.");

    setIsAnalyzingFromImage(true);
    try {
      const result = await analyzeEssayFromImage(vestibular, selectedTheme, file);
      setCorrection(result);
      
      // Store draft or corrected essay directly? For now just corrected
      await addDoc(collection(db, 'essays'), {
        userId: auth.currentUser.uid,
        theme: selectedTheme,
        essayText: 'Transcrição da imagem...', // Optionally store transcribed text
        generalCorrection: result.generalCorrection,
        competencies: result.competencies,
        grade: result.grade,
        status: 'corrected',
        timestamp: Timestamp.now()
      });

      alert("Redação corrigida com sucesso!");
    } catch (error) {
      console.error("Error analyzing essay from image:", error);
      alert("Erro ao analisar imagem. Tente novamente.");
    } finally {
      setIsAnalyzingFromImage(false);
      setShowCamera(false);
      setShowGallery(false);
    }
  };

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'essays'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const history: EssayResult[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as EssayResult));
      setEssayHistory(history);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'essays');
    });

    return () => unsubscribe();
  }, []);

  const handleGenerateAITheme = async () => {
    setIsGenerating(true);
    try {
      const newTheme = await generateEssayTheme(vestibular, themes);
      setSelectedTheme(newTheme);
      setCorrection(null);
    } catch (error) {
      console.error("Failed to generate theme:", error);
      alert("Erro ao gerar tema. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!essayText.trim()) return alert("Escreva sua redação primeiro.");
    if (!auth.currentUser) return alert("Você precisa estar logado.");

    try {
      await addDoc(collection(db, 'essays'), {
        userId: auth.currentUser.uid,
        theme: selectedTheme,
        essayText,
        status: 'draft',
        timestamp: Timestamp.now()
      });
      alert("Rascunho salvo com sucesso!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'essays');
    }
  };

  const handleAnalyzeEssay = async () => {
    if (!essayText.trim()) return alert("Escreva sua redação primeiro.");
    if (!auth.currentUser) return alert("Você precisa estar logado.");

    setIsAnalyzing(true);
    try {
      const result = await analyzeEssay(vestibular, selectedTheme, essayText);
      setCorrection(result);

      await addDoc(collection(db, 'essays'), {
        userId: auth.currentUser.uid,
        theme: selectedTheme,
        essayText,
        generalCorrection: result.generalCorrection,
        competencies: result.competencies,
        grade: result.grade,
        status: 'corrected',
        timestamp: Timestamp.now()
      });

      // Update Mission Progress
      missionEngine.getMissionsForToday().forEach(m => {
        if (m.type === 'essay') {
          missionEngine.updateProgress(m.id, 1);
        }
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'essays');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoadEssay = (essay: EssayResult) => {
    setEssayText(essay.essayText);
    setSelectedTheme(essay.theme);
    if (essay.generalCorrection && essay.competencies && essay.grade !== undefined) {
      setCorrection({
        generalCorrection: essay.generalCorrection,
        competencies: essay.competencies,
        grade: essay.grade
      });
    } else {
      setCorrection(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const wordCount = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;
  const lineCount = essayText ? essayText.split('\n').length : 0;

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-white dark:bg-blue-900 rounded-[2.5rem] p-8 md:p-12 border dark:border-blue-800 shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-3xl rounded-full -mr-20 -mt-20"></div>
        <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-800/50 text-blue-600 dark:text-blue-300 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
              <PenTool size={16} />
              <span>Laboratório de Escrita</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white leading-tight tracking-tight">
              Sua redação <span className="text-blue-600">nota mil</span> começa aqui
            </h1>
            <p className="text-lg text-slate-500 dark:text-blue-300 max-w-xl leading-relaxed">
              Pratique com temas reais e receba correção instantânea baseada nos critérios oficiais do <span className="font-bold text-blue-600">{vestibular}</span>.
            </p>
          </div>
          
          <div className="flex flex-col gap-3 w-full lg:w-72">
            <label className="text-xs font-black text-slate-400 dark:text-blue-400 uppercase tracking-widest">Selecione o Exame</label>
            <div className="relative">
              <select 
                value={vestibular}
                onChange={(e) => setVestibular(e.target.value as Vestibular)}
                className="w-full bg-slate-50 dark:bg-blue-950 border border-slate-200 dark:border-blue-800 rounded-2xl px-6 py-4 text-slate-800 dark:text-white font-bold text-lg outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none"
              >
                {Object.values(Vestibular).map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <Target size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Editor Section */}
        <div className="lg:col-span-8 space-y-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-blue-900 rounded-[2.5rem] border dark:border-blue-800 shadow-sm overflow-hidden"
          >
            <div className="p-8 md:p-10 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white">Oficina de Escrita</h3>
                  <div className="flex items-center gap-4 text-sm font-bold text-slate-400 dark:text-blue-400">
                    <span className="flex items-center gap-1"><Clock size={14} /> 60 min sugeridos</span>
                    <span className="flex items-center gap-1 font-black text-blue-600"><FileText size={14} /> {wordCount} palavras</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { setShowCamera(!showCamera); setShowGallery(false); }}
                    className={`p-4 rounded-2xl transition-all ${showCamera ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-50 dark:bg-blue-950 text-slate-600 dark:text-blue-300 hover:bg-slate-100 dark:hover:bg-blue-800'}`}
                    title="Capturar com Câmera"
                  >
                    <Camera size={24} />
                  </button>
                  <button 
                    onClick={() => { setShowGallery(!showGallery); setShowCamera(false); }}
                    className={`p-4 rounded-2xl transition-all ${showGallery ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-50 dark:bg-blue-950 text-slate-600 dark:text-blue-300 hover:bg-slate-100 dark:hover:bg-blue-800'}`}
                    title="Abrir Galeria"
                  >
                    <Share2 size={24} />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <AnimatePresence mode="wait">
                  {showCamera && (
                    <motion.div 
                      key="camera"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-blue-50 dark:bg-blue-950 rounded-3xl p-8 border border-blue-100 dark:border-blue-800"
                    >
                      <NativeCameraLauncher onImageCapture={(file) => {
                          handleImageEssayCorrection(file);
                        }} />
                    </motion.div>
                  )}

                  {showGallery && (
                    <motion.div 
                      key="gallery"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-blue-50 dark:bg-blue-950 rounded-3xl p-8 border border-blue-100 dark:border-blue-800"
                    >
                      <GalleryPicker onFilesSelect={(files) => {
                          if (files.length > 0) handleImageEssayCorrection(files[0]);
                        }} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {isAnalyzingFromImage && (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-20 space-y-6"
                    >
                      <Loader2 size={48} className="animate-spin text-blue-600" />
                      <h3 className="text-2xl font-black text-slate-800 dark:text-white">Analizando sua Redação...</h3>
                      <p className="text-slate-500 dark:text-blue-300">Isso pode levar alguns segundos.</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className={`space-y-6 ${(showCamera || showGallery || isAnalyzingFromImage) ? 'hidden' : ''}`}>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-blue-600 dark:text-blue-300 uppercase tracking-widest pl-1">Escolha o Tema</label>
                    <div className="flex flex-col md:flex-row gap-3">
                      <select
                        value={themes.find(t => t.theme === selectedTheme) ? selectedTheme : 'custom'}
                        onChange={(e) => {
                          if (e.target.value === 'custom') return;
                          setSelectedTheme(e.target.value);
                          setCorrection(null);
                        }}
                        className="flex-1 min-w-0 bg-slate-50 dark:bg-blue-950 border border-slate-200 dark:border-blue-800 rounded-2xl px-6 py-4 text-slate-800 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all truncate"
                      >
                        {themes.length > 0 ? (
                          themes.map((t, i) => (
                            <option key={i} value={t.theme}>{t.year}: {t.theme}</option>
                          ))
                        ) : (
                          <option disabled>Nenhum tema disponível</option>
                        )}
                        {selectedTheme && !themes.some(t => t.theme === selectedTheme) && (
                          <option value="custom">IA: {selectedTheme}</option>
                        )}
                      </select>
                      <button 
                        onClick={handleGenerateAITheme}
                        disabled={isGenerating}
                        className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
                      >
                        {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                        <span>Tema IA</span>
                      </button>
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="absolute top-4 left-4 flex flex-col gap-1 items-center pointer-events-none">
                      {Array.from({ length: Math.max(1, Math.min(lineCount, 25)) }).map((_, i) => (
                        <span key={i} className="text-[10px] font-black text-slate-200 dark:text-blue-900">{i + 1}</span>
                      ))}
                    </div>
                    <textarea 
                      value={essayText}
                      onChange={(e) => { setEssayText(e.target.value); setCorrection(null); }}
                      className="w-full h-[600px] pl-12 pr-8 py-8 rounded-3xl border border-slate-200 dark:border-blue-800 bg-slate-50 dark:bg-blue-950 text-slate-800 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none font-serif text-xl leading-relaxed placeholder:text-slate-300"
                      placeholder="Transcenda seus pensamentos no papel digital..."
                    ></textarea>
                    
                    <div className="absolute bottom-6 right-6 flex items-center gap-3 bg-white/80 dark:bg-blue-900/80 backdrop-blur px-4 py-2 rounded-xl border border-slate-100 dark:border-blue-800 font-black text-xs uppercase tracking-widest text-slate-500 dark:text-blue-300">
                      <Zap size={14} className={wordCount > 300 ? 'text-blue-500' : 'text-slate-300'} />
                      <span>{wordCount} Palavras</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
                    <button 
                      onClick={handleSaveDraft}
                      className="px-8 py-5 rounded-2xl font-black text-slate-600 dark:text-blue-300 hover:bg-slate-100 dark:hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
                    >
                      <Clock size={20} />
                      Salvar Rascunho
                    </button>
                    <button 
                      onClick={handleAnalyzeEssay}
                      disabled={isAnalyzing}
                      className="px-10 py-5 rounded-2xl font-black bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all shadow-2xl shadow-blue-500/25 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isAnalyzing ? <Loader2 size={22} className="animate-spin" /> : <Award size={22} />}
                      <span>{isAnalyzing ? 'Processando Inteligência...' : 'Análise Técnica'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Detailed Correction Section */}
          <AnimatePresence>
            {correction && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
              >
                <div className="bg-white dark:bg-blue-900 rounded-[2.5rem] border-4 border-blue-500/20 shadow-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 md:p-12 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                      <div className="space-y-2 text-center md:text-left">
                        <h3 className="text-3xl font-black tracking-tight">Avaliação Especializada</h3>
                        <p className="text-blue-100 font-medium">Sua redação foi analisada seguindo os parâmetros do {vestibular}</p>
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full group-hover:scale-150 transition-transform"></div>
                        <div className="relative bg-white text-blue-600 w-32 h-32 rounded-full flex flex-col items-center justify-center border-8 border-white/30 shadow-2xl">
                          <span className="text-4xl font-black">{correction.grade}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest mt-[-4px]">Total</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8 md:p-12 space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {correction.competencies.map((c, i) => (
                        <div key={i} className="group bg-slate-50 dark:bg-blue-950 p-8 rounded-[2rem] border border-slate-100 dark:border-blue-800 hover:border-blue-500 transition-all flex flex-col justify-between space-y-6">
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <div className="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                Comp. {i + 1}
                              </div>
                              <span className="text-2xl font-black text-blue-600">{c.score}</span>
                            </div>
                            <h4 className="font-black text-slate-800 dark:text-white leading-tight break-words"> {c.name}</h4>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="h-1.5 bg-slate-200 dark:bg-blue-900 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(c.score / 200) * 100}%` }}
                                className="h-full bg-blue-600"
                              />
                            </div>
                            <div className="space-y-2 text-[11px] text-slate-500 dark:text-blue-300 overflow-hidden">
                                <p className="break-words"><span className="font-bold text-emerald-600 uppercase">Positivo:</span> {c.strengths}</p>
                                <p className="break-words"><span className="font-bold text-amber-600 uppercase">Melhorar:</span> {c.weaknesses}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      <div className="space-y-6 p-10 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-[2.5rem] border border-emerald-500/20">
                        <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle size={28} />
                          <h4 className="text-xl font-black">Pontos de Destaque</h4>
                        </div>
                        <p className="text-lg text-slate-700 dark:text-blue-100 italic leading-relaxed break-words">
                          {correction.generalCorrection.split('.')[0]}.
                        </p>
                      </div>

                      <div className="space-y-6 p-10 bg-amber-500/5 dark:bg-amber-500/10 rounded-[2.5rem] border border-amber-500/20 overflow-hidden">
                        <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
                          <Target size={28} />
                          <h4 className="text-xl font-black">Plano de Evolução</h4>
                        </div>
                        <p className="text-lg text-slate-700 dark:text-blue-100 leading-relaxed font-medium break-words">
                          {correction.competencies[0].improvementExample}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Content */}
        <div className="lg:col-span-4 space-y-10">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
            <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
              <History size={28} className="text-blue-400" />
              <span>Jornada de Escrita</span>
            </h3>
            
            <div className="space-y-4">
              {essayHistory.slice(0, 5).map((h) => (
                <div 
                  key={h.id} 
                  onClick={() => handleLoadEssay(h)}
                  className="group bg-white/5 hover:bg-white/10 p-6 rounded-3xl border border-white/10 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="space-y-1 min-w-0">
                      <p className="font-bold text-sm truncate">{h.theme}</p>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{h.timestamp.toDate().toLocaleDateString()}</p>
                    </div>
                    {h.status === 'corrected' && (
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-black shadow-lg shadow-blue-500/20">
                        {h.grade}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${h.status === 'corrected' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {h.status === 'corrected' ? 'Validada' : 'Rascunho'}
                    </span>
                    <ArrowRight size={14} className="text-white/20 group-hover:text-white transition-colors" />
                  </div>
                </div>
              ))}
              
              {essayHistory.length === 0 && (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-white/10">
                    <History size={32} />
                  </div>
                  <p className="text-sm font-bold text-white/30">Nenhum registro ainda</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-blue-900 rounded-[2.5rem] p-10 border dark:border-blue-800 shadow-sm space-y-8 overflow-hidden">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
              <Info size={28} className="text-blue-600" />
              <span>Mapa da Nota Mil</span>
            </h3>
            
            <div className="space-y-6">
              {[
                { icon: <Zap size={18} />, title: "Inicie com Impacto", desc: "Apresente sua tese de forma clara logo na introdução." },
                { icon: <Target size={18} />, title: "Repertório Crítico", desc: "Use referências históricas ou sociológicas pertinentes ao tema." },
                { icon: <Award size={18} />, title: "Proposta Completa", desc: "Agente, Ação, Meio, Efeito e Detalhamento." },
              ].map((tip, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-800 text-blue-600 dark:text-blue-200 rounded-xl flex items-center justify-center shrink-0">
                    {tip.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-sm text-slate-800 dark:text-white">{tip.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-blue-300 leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
