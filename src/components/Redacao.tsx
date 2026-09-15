import React, { useState, useEffect } from 'react';
import { Vestibular } from '../types';
import { 
  FileText, 
  Sparkles, 
  PenTool, 
  CheckCircle2, 
  BookOpen, 
  Loader2, 
  Award, 
  History, 
  Camera, 
  Target, 
  Zap, 
  Clock, 
  Info, 
  Share2, 
  ArrowRight,
  ChevronDown,
  RotateCcw,
  TrendingUp,
  Lightbulb,
  Check
} from 'lucide-react';
import { ESSAY_THEMES } from '../constants';
import { generateEssayTheme, analyzeEssay, analyzeEssayFromImage, EssayAnalysis, Competency } from '../services/geminiService';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { missionEngine } from '../services/missionService';
import { achievementService } from '../services/achievementService';
import { collection, addDoc, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import GalleryPicker from './GalleryPicker';
import NativeCameraLauncher from './NativeCameraLauncher';
import { motion, AnimatePresence } from 'motion/react';
import AudioTranscriber from './AudioTranscriber';

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
  const [saveSuccess, setSaveSuccess] = useState(false);

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
      
      await addDoc(collection(db, 'essays'), {
        userId: auth.currentUser.uid,
        theme: selectedTheme,
        essayText: 'Transcrição da imagem...',
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

      if (auth.currentUser) {
        achievementService.trackActivity(auth.currentUser.uid, 'redacoes', 1);
      }
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
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
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

      // Update user Metas/Achievements automatically
      if (auth.currentUser) {
        achievementService.trackActivity(auth.currentUser.uid, 'redacoes', 1);
      }
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
    <div className="space-y-8 max-w-7xl mx-auto font-sans transition-colors duration-200">
      
      {/* HERO / HEADER SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-8 md:p-10 rounded-3xl bg-white dark:bg-[#15171C] border border-slate-200/90 dark:border-white/10 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
      >
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            <PenTool size={14} className="text-blue-600 dark:text-blue-400" />
            <span>Laboratório de Escrita</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Sua redação{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              nota 1000
            </span>{' '}
            começa aqui
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 leading-relaxed">
            Pratique com temas reais e receba correção instantânea com inteligência artificial baseada nos critérios oficiais do{' '}
            <strong className="font-bold text-slate-900 dark:text-white">{vestibular}</strong>.
          </p>
        </div>
        
        {/* EXAM SELECTOR */}
        <div className="w-full lg:w-72 space-y-2 shrink-0">
          <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider pl-1">
            Selecione o Exame
          </label>
          <div className="relative">
            <select 
              value={vestibular}
              onChange={(e) => setVestibular(e.target.value as Vestibular)}
              className="w-full bg-slate-50 dark:bg-[#1C1F26] border border-slate-300/80 dark:border-white/10 rounded-2xl px-4 py-3.5 text-slate-900 dark:text-white font-bold text-base outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all appearance-none cursor-pointer pr-10"
            >
              {Object.values(Vestibular).map(v => (
                <option key={v} value={v} className="bg-white dark:bg-[#1C1F26] text-slate-900 dark:text-white">
                  {v}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-zinc-500">
              <ChevronDown size={18} />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* MAIN EDITOR SECTION (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#15171C] rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-sm overflow-hidden"
          >
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* TOP BAR: OFFICE TITLE & TOOLS */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/5">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Oficina de Redação
                  </h3>
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-zinc-400 mt-1">
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="text-slate-400" />
                      60 min sugeridos
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold">
                      <FileText size={14} />
                      {wordCount} palavras
                    </span>
                    <span>•</span>
                    <span>{lineCount} linhas</span>
                  </div>
                </div>
                
                {/* CAMERA & SCAN BUTTONS */}
                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => { setShowCamera(!showCamera); setShowGallery(false); }}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      showCamera 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                        : 'bg-slate-50 dark:bg-[#1C1F26] text-slate-700 dark:text-zinc-200 border-slate-200 dark:border-white/10 hover:border-blue-300'
                    }`}
                    title="Tirar foto da folha manuscrita"
                  >
                    <Camera size={16} />
                    <span className="hidden sm:inline">Câmera</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => { setShowGallery(!showGallery); setShowCamera(false); }}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      showGallery 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                        : 'bg-slate-50 dark:bg-[#1C1F26] text-slate-700 dark:text-zinc-200 border-slate-200 dark:border-white/10 hover:border-blue-300'
                    }`}
                    title="Enviar foto da folha pela galeria"
                  >
                    <Share2 size={16} />
                    <span className="hidden sm:inline">Galeria</span>
                  </button>
                </div>
              </div>

              {/* CAMERA / GALLERY DRAWERS */}
              <AnimatePresence mode="wait">
                {showCamera && (
                  <motion.div 
                    key="camera"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-slate-50 dark:bg-[#1A1D24] rounded-2xl p-5 border border-blue-200 dark:border-blue-500/20"
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
                    className="bg-slate-50 dark:bg-[#1A1D24] rounded-2xl p-5 border border-blue-200 dark:border-blue-500/20"
                  >
                    <GalleryPicker onFilesSelect={(files) => {
                      if (files.length > 0) handleImageEssayCorrection(files[0]);
                    }} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* IMAGE LOADING OVERLAY */}
              <AnimatePresence mode="wait">
                {isAnalyzingFromImage && (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16 space-y-4 text-center bg-slate-50 dark:bg-[#181A20] rounded-2xl border border-blue-200 dark:border-blue-500/20"
                  >
                    <Loader2 size={36} className="animate-spin text-blue-600 dark:text-blue-400" />
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                      Analisando Manuscrito com IA...
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm">
                      Identificando caligrafia e aplicando os critérios de competência do {vestibular}.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ESSAY WRITING FORM */}
              <div className={`space-y-6 ${(showCamera || showGallery || isAnalyzingFromImage) ? 'hidden' : ''}`}>
                
                {/* THEME SELECTOR & AI PROMPT */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider pl-1">
                      Tema da Proposta
                    </label>
                    <span className="text-[11px] text-slate-400 dark:text-zinc-500">
                      Oficiais e Inéditos
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <select
                        value={themes.find(t => t.theme === selectedTheme) ? selectedTheme : 'custom'}
                        onChange={(e) => {
                          if (e.target.value === 'custom') return;
                          setSelectedTheme(e.target.value);
                          setCorrection(null);
                        }}
                        className="w-full bg-slate-50 dark:bg-[#1A1D24] border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3.5 text-slate-900 dark:text-white font-medium text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all appearance-none cursor-pointer pr-10 truncate"
                      >
                        {themes.length > 0 ? (
                          themes.map((t, i) => (
                            <option key={i} value={t.theme} className="bg-white dark:bg-[#1A1D24] text-slate-900 dark:text-white">
                              {t.year}: {t.theme}
                            </option>
                          ))
                        ) : (
                          <option disabled>Nenhum tema disponível</option>
                        )}
                        {selectedTheme && !themes.some(t => t.theme === selectedTheme) && (
                          <option value="custom">Tema Gerado: {selectedTheme}</option>
                        )}
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ChevronDown size={16} />
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={handleGenerateAITheme}
                      disabled={isGenerating}
                      className="px-5 py-3.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shrink-0"
                    >
                      {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                      <span>Gerar Tema IA</span>
                    </button>
                  </div>
                </div>

                {/* ESSAY TEXTAREA WITH SUBTLE NUMBERING */}
                <div className="space-y-2">
                  <div className="relative rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#111317] overflow-hidden focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/15 transition-all">
                    <textarea 
                      value={essayText}
                      onChange={(e) => { setEssayText(e.target.value); setCorrection(null); }}
                      rows={18}
                      className="w-full p-5 sm:p-6 bg-transparent text-slate-900 dark:text-zinc-100 outline-none resize-none font-sans text-sm sm:text-base leading-relaxed placeholder:text-slate-400 dark:placeholder:text-zinc-600"
                      placeholder="Comece a digitar seu texto aqui... Desenvolva sua introdução com tese clara, argumentos nos parágrafos intermediários e proposta de intervenção."
                    />

                    {/* BOTTOM STATUS BAR */}
                    <div className="px-5 py-3 bg-white dark:bg-[#181A20] border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Zap size={14} className={wordCount >= 250 ? 'text-emerald-500' : 'text-slate-400'} />
                        <span>
                          {wordCount < 100 
                            ? 'Mínimo de ~250 palavras para uma boa nota' 
                            : `${wordCount} palavras contabilizadas`}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <AudioTranscriber
                          compact={true}
                          onTranscriptionComplete={(text) => {
                            setEssayText((prev) => (prev ? `${prev.trim()}\n${text}` : text));
                            setCorrection(null);
                          }}
                        />
                        <span>{lineCount} linhas</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-5 py-3 rounded-xl border border-slate-200 dark:border-white/10 text-xs sm:text-sm font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {saveSuccess ? (
                      <>
                        <Check size={16} className="text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">Rascunho Salvo!</span>
                      </>
                    ) : (
                      <>
                        <Clock size={16} />
                        <span>Salvar Rascunho</span>
                      </>
                    )}
                  </button>

                  <button 
                    type="button"
                    onClick={handleAnalyzeEssay}
                    disabled={isAnalyzing || !essayText.trim()}
                    className="px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Corrigindo Redação...</span>
                      </>
                    ) : (
                      <>
                        <Award size={16} />
                        <span>Avaliar com IA</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

            </div>
          </motion.div>

          {/* DETAILED CORRECTION SECTION */}
          <AnimatePresence>
            {correction && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white dark:bg-[#15171C] rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-lg overflow-hidden">
                  
                  {/* SCORE HEADER */}
                  <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 text-center sm:text-left">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold">
                        <CheckCircle2 size={14} />
                        <span>Avaliação Oficial Concluída</span>
                      </div>
                      <h3 className="text-2xl font-black">
                        Diagnóstico da Redação
                      </h3>
                      <p className="text-xs sm:text-sm text-blue-100">
                        Critérios e pontuação alinhados à matriz de referência do {vestibular}.
                      </p>
                    </div>

                    <div className="bg-white text-slate-900 dark:text-slate-900 px-6 py-4 rounded-2xl text-center shadow-lg shrink-0">
                      <div className="text-3xl sm:text-4xl font-black text-blue-600">
                        {correction.grade}
                      </div>
                      <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                        Nota Total
                      </div>
                    </div>
                  </div>
                  
                  {/* COMPETENCIES GRID */}
                  <div className="p-6 sm:p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {correction.competencies.map((c, i) => (
                        <div 
                          key={i} 
                          className="bg-slate-50 dark:bg-[#1A1D24] p-5 rounded-2xl border border-slate-200/80 dark:border-white/5 space-y-4 flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400">
                                Comp. {i + 1}
                              </span>
                              <span className="text-base font-black text-blue-600 dark:text-blue-400">
                                {c.score} pts
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                              {c.name}
                            </h4>
                          </div>

                          <div className="space-y-2.5">
                            <div className="h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
                                style={{ width: `${(c.score / 200) * 100}%` }}
                              />
                            </div>
                            <div className="space-y-1 text-[11px] leading-relaxed">
                              <p className="text-slate-600 dark:text-zinc-300">
                                <strong className="text-emerald-600 dark:text-emerald-400">Pontos Fortes:</strong> {c.strengths}
                              </p>
                              <p className="text-slate-600 dark:text-zinc-300">
                                <strong className="text-amber-600 dark:text-amber-400">Aprimorar:</strong> {c.weaknesses}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* GENERAL FEEDBACK & EVOLUTION PLAN */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20 space-y-2">
                        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                          <CheckCircle2 size={16} />
                          <span>Destaques Positivos</span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-zinc-200 leading-relaxed">
                          {correction.generalCorrection}
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/20 space-y-2">
                        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs">
                          <Target size={16} />
                          <span>Plano de Melhoria Prática</span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-zinc-200 leading-relaxed">
                          {correction.competencies[0]?.improvementExample || 'Revise a conexão entre os parágrafos de argumentação e certifique-se de detalhar os elementos da proposta de intervenção.'}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* SIDEBAR (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* ESSAY HISTORY CARD */}
          <div className="bg-white dark:bg-[#15171C] rounded-3xl p-6 border border-slate-200/90 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <History size={16} />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Histórico de Redações
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {essayHistory.length}
              </span>
            </div>
            
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {essayHistory.map((h) => (
                <div 
                  key={h.id} 
                  onClick={() => handleLoadEssay(h)}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1A1D24] hover:bg-blue-50/50 dark:hover:bg-[#20242D] border border-slate-200/70 dark:border-white/5 hover:border-blue-300 dark:hover:border-blue-500/30 transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-xs text-slate-800 dark:text-zinc-200 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {h.theme}
                    </p>
                    {h.status === 'corrected' && h.grade !== undefined && (
                      <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-extrabold text-[11px] shrink-0">
                        {h.grade}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-zinc-500">
                    <span>{h.timestamp ? h.timestamp.toDate().toLocaleDateString('pt-BR') : 'Hoje'}</span>
                    <span className={`px-1.5 py-0.5 rounded font-bold uppercase ${
                      h.status === 'corrected' 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`}>
                      {h.status === 'corrected' ? 'Corrigida' : 'Rascunho'}
                    </span>
                  </div>
                </div>
              ))}
              
              {essayHistory.length === 0 && (
                <div className="text-center py-8 space-y-2">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-400 dark:text-zinc-600">
                    <FileText size={18} />
                  </div>
                  <p className="text-xs text-slate-400 dark:text-zinc-500">
                    Nenhuma redação registrada ainda.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* TIPS CARD: MAPA DA NOTA 1000 */}
          <div className="bg-white dark:bg-[#15171C] rounded-3xl p-6 border border-slate-200/90 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Lightbulb size={16} />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Guia Rápido Nota 1000
              </h3>
            </div>
            
            <div className="space-y-3">
              {[
                { 
                  title: "Introdução & Tese Clara", 
                  desc: "Apresente o tema e posicione sua tese com precisão nas primeiras linhas." 
                },
                { 
                  title: "Repertório Sociocultural", 
                  desc: "Utilize referências históricas, filosóficas ou dados legítimos e pertinentes." 
                },
                { 
                  title: "5 Elementos da Proposta", 
                  desc: "Agente, Ação, Modo/Meio, Efeito e Detalhamento em conformidade com o tema." 
                }
              ].map((tip, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-[#1A1D24] border border-slate-200/70 dark:border-white/5 space-y-1">
                  <h4 className="font-bold text-xs text-slate-800 dark:text-zinc-200">
                    {tip.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                    {tip.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
