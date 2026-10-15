import React, { useState, useEffect } from 'react';
import { Vestibular } from '../types';
import { 
  FileText, 
  Sparkles, 
  PenTool, 
  CheckCircle2, 
  Loader2, 
  Award, 
  History, 
  Camera, 
  Target, 
  Zap, 
  Clock, 
  Share2, 
  ChevronDown, 
  Lightbulb, 
  Check,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { ESSAY_THEMES } from '../constants';
import { UNESP_2025_REDACAO } from '../data/unesp_recentes_data';
import { 
  generateEssayTheme, 
  analyzeEssayFromImage, 
  corrigirRedacaoCorrigeBot, 
  EssayAnalysis, 
  Competency,
  CorrigeBotSugestaoIntervencao 
} from '../services/geminiService';
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
  nota_final?: number;
  conceito_geral?: string;
  zerada?: boolean;
  motivo_zeramento?: string | null;
  pontos_fortes?: string[];
  pontos_melhoria?: string[];
  sugestao_proposta_intervencao?: CorrigeBotSugestaoIntervencao;
  parecer_geral?: string;
  banca?: string;
  banca_nome?: string;
  timestamp: Timestamp;
  status: string;
}

const BANCAS_CORRIGEBOT = [
  {
    id: 'enem',
    vestibular: Vestibular.ENEM,
    nome: 'ENEM',
    info: 'Nota 0–1000 · 5 competências · Proposta de intervenção'
  },
  {
    id: 'fuvest',
    vestibular: Vestibular.FUVEST,
    nome: 'FUVEST',
    info: 'Conceito · Dissertativo · Sem intervenção · 30 linhas'
  },
  {
    id: 'unicamp',
    vestibular: Vestibular.UNICAMP,
    nome: 'UNICAMP',
    info: '2 propostas · Gêneros variados · 30 linhas'
  },
  {
    id: 'unesp',
    vestibular: Vestibular.UNESP,
    nome: 'UNESP',
    info: 'Dissertativo-argumentativo · 30 linhas'
  },
  {
    id: 'ita',
    vestibular: Vestibular.ITA,
    nome: 'ITA',
    info: 'Nota 0–10 · Rigor lógico-analítico · Sem clichês'
  }
];

export default function Redacao({ vestibular, setVestibular }: { vestibular: Vestibular, setVestibular: (v: Vestibular) => void }) {
  const themes = ESSAY_THEMES[vestibular] || [];
  const [selectedTheme, setSelectedTheme] = useState<string>(themes[0]?.theme || '');
  const [propostaNumero, setPropostaNumero] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzingFromImage, setIsAnalyzingFromImage] = useState(false);
  const [essayText, setEssayText] = useState('');
  const [correction, setCorrection] = useState<EssayAnalysis | null>(null);
  const [essayHistory, setEssayHistory] = useState<EssayResult[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showMotivadores, setShowMotivadores] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [toast, setToast] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const showToast = (type: 'error' | 'success', text: string) => {
    setToast({ type, text });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  useEffect(() => {
    setSelectedTheme(themes[0]?.theme || '');
    setCorrection(null);
  }, [vestibular]);

  // Carregar histórico do usuário do Firestore
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

  const handleImageEssayCorrection = async (file: File) => {
    if (!auth.currentUser) {
      showToast('error', "Você precisa estar logado para enviar redações.");
      return;
    }

    setIsAnalyzingFromImage(true);
    try {
      const result = await analyzeEssayFromImage(vestibular, selectedTheme, file);
      setCorrection(result);
      
      await addDoc(collection(db, 'essays'), {
        userId: auth.currentUser.uid,
        banca: vestibular,
        theme: selectedTheme,
        essayText: 'Transcrição da imagem...',
        generalCorrection: result.generalCorrection,
        competencies: result.competencies,
        grade: result.grade,
        nota_final: result.nota_final ?? result.grade,
        conceito_geral: result.conceito_geral ?? null,
        zerada: Boolean(result.zerada),
        motivo_zeramento: result.motivo_zeramento ?? null,
        pontos_fortes: result.pontos_fortes ?? [],
        pontos_melhoria: result.pontos_melhoria ?? [],
        sugestao_proposta_intervencao: result.sugestao_proposta_intervencao ?? null,
        parecer_geral: result.parecer_geral ?? result.generalCorrection,
        status: 'corrected',
        timestamp: Timestamp.now()
      });

      missionEngine.getMissionsForToday().forEach(m => {
        if (m.type === 'essay') {
          missionEngine.updateProgress(m.id, 1);
        }
      });

      if (auth.currentUser) {
        achievementService.trackActivity(auth.currentUser.uid, 'redacoes', 1);
      }
      showToast('success', 'Redação por imagem analisada!');
    } catch (error) {
      console.error("Error analyzing essay from image:", error);
      showToast('error', "Erro ao analisar imagem. Tente novamente.");
    } finally {
      setIsAnalyzingFromImage(false);
      setShowCamera(false);
      setShowGallery(false);
    }
  };

  const handleGenerateAITheme = async () => {
    setIsGenerating(true);
    try {
      const newTheme = await generateEssayTheme(vestibular, themes);
      if (newTheme) {
        setSelectedTheme(newTheme);
        setCorrection(null);
        showToast('success', 'Novo tema gerado!');
      }
    } catch (error) {
      console.error("Failed to generate theme:", error);
      showToast('error', 'Falha ao gerar tema por IA.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!essayText.trim()) {
      showToast('error', "Escreva sua redação primeiro antes de salvar.");
      return;
    }
    if (!auth.currentUser) {
      showToast('error', "Você precisa estar logado para salvar rascunhos.");
      return;
    }

    try {
      await addDoc(collection(db, 'essays'), {
        userId: auth.currentUser.uid,
        banca: vestibular,
        theme: selectedTheme,
        essayText,
        status: 'draft',
        timestamp: Timestamp.now()
      });
      setSaveSuccess(true);
      showToast('success', 'Rascunho salvo com sucesso!');
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'essays');
    }
  };

  const handleAnalyzeEssay = async () => {
    const tema = selectedTheme.trim();
    const texto = essayText.trim();

    if (!tema || !texto) {
      showToast('error', 'Preencha o tema e o texto da redação');
      return;
    }

    if (texto.length < 200) {
      showToast('error', 'Texto muito curto para análise (mínimo ~200 caracteres)');
      return;
    }

    if (texto.length > 12000) {
      showToast('error', 'Texto excede o limite de 12.000 caracteres');
      return;
    }

    setIsAnalyzing(true);
    try {
      const bancaKey = vestibular.toLowerCase();
      const propNum = vestibular === Vestibular.UNICAMP ? propostaNumero : undefined;

      const result = await corrigirRedacaoCorrigeBot(
        bancaKey,
        tema,
        texto,
        propNum,
        auth.currentUser?.uid
      );

      setCorrection(result);

      if (auth.currentUser) {
        await addDoc(collection(db, 'essays'), {
          userId: auth.currentUser.uid,
          banca: vestibular,
          banca_nome: result.banca_nome || vestibular,
          theme: tema,
          essayText: texto,
          generalCorrection: result.generalCorrection,
          competencies: result.competencies,
          grade: result.grade,
          nota_final: result.nota_final ?? (result.grade !== undefined ? result.grade : null),
          conceito_geral: result.conceito_geral ?? null,
          zerada: Boolean(result.zerada),
          motivo_zeramento: result.motivo_zeramento ?? null,
          pontos_fortes: result.pontos_fortes ?? [],
          pontos_melhoria: result.pontos_melhoria ?? [],
          sugestao_proposta_intervencao: result.sugestao_proposta_intervencao ?? null,
          parecer_geral: result.parecer_geral ?? result.generalCorrection,
          status: 'corrected',
          timestamp: Timestamp.now()
        });
      }

      // Update Mission Progress
      missionEngine.getMissionsForToday().forEach(m => {
        if (m.type === 'essay') {
          missionEngine.updateProgress(m.id, 1);
        }
      });

      if (auth.currentUser) {
        achievementService.trackActivity(auth.currentUser.uid, 'redacoes', 1);
      }

      showToast('success', 'Redação corrigida com sucesso pelo CorrigeBot!');

      // Scroll suave para a seção do resultado
      setTimeout(() => {
        const el = document.getElementById('redacao-resultado');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);

    } catch (error: any) {
      console.error("Erro na correção:", error);
      showToast('error', error.message || 'Erro ao corrigir redação');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoadEssay = (essay: EssayResult) => {
    setEssayText(essay.essayText);
    setSelectedTheme(essay.theme);
    if (essay.generalCorrection && essay.competencies) {
      setCorrection({
        grade: essay.grade ?? essay.nota_final ?? 0,
        competencies: essay.competencies,
        generalCorrection: essay.generalCorrection,
        nota_final: essay.nota_final,
        conceito_geral: essay.conceito_geral,
        zerada: essay.zerada,
        motivo_zeramento: essay.motivo_zeramento,
        pontos_fortes: essay.pontos_fortes,
        pontos_melhoria: essay.pontos_melhoria,
        sugestao_proposta_intervencao: essay.sugestao_proposta_intervencao,
        parecer_geral: essay.parecer_geral,
        banca: essay.banca
      });
    } else {
      setCorrection(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const wordCount = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;
  const lineCount = essayText.trim() ? Math.max(1, Math.floor(essayText.trim().length / 72)) : 0;
  const charCount = essayText.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans transition-colors duration-200">
      
      {/* TOAST FLUTUANTE */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 text-sm font-medium ${
              toast.type === 'error'
                ? 'bg-red-900/90 text-red-100 border-red-700'
                : 'bg-emerald-900/90 text-emerald-100 border-emerald-700'
            }`}
          >
            {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
            <span>{toast.text}</span>
            <button 
              type="button" 
              onClick={() => setToast(null)}
              className="ml-2 hover:opacity-75 cursor-pointer"
            >
              <XCircle size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUNA PRINCIPAL: CORRIGEBOT (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* SEÇÃO CORRIGEBOT PRINCIPAL */}
          <div 
            id="corrigebot-section"
            className="rounded-2xl p-6 sm:p-7 border border-[#262626] bg-[#1A1A1A] text-white shadow-sm transition-all"
          >
            
            {/* CABEÇALHO DA SEÇÃO */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-4 border-b border-[#262626]">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#FAFAFA] tracking-tight flex items-center gap-2">
                  <PenTool className="text-blue-500" size={22} />
                  <span>CorrigeBot — Correção de Redação</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#A3A3A3] mt-1">
                  Escolha a banca e receba a correção com as regras oficiais dela
                </p>
              </div>

              {/* FERRAMENTAS DE FOTO E SCAN */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button 
                  type="button"
                  id="btn-camera"
                  onClick={() => { setShowCamera(!showCamera); setShowGallery(false); }}
                  className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    showCamera 
                      ? 'bg-blue-600 text-white border-blue-500' 
                      : 'bg-[#222222] text-[#FAFAFA] border-[#333333] hover:border-blue-500'
                  }`}
                  title="Tirar foto da folha manuscrita"
                >
                  <Camera size={15} />
                  <span>Câmera</span>
                </button>

                <button 
                  type="button"
                  id="btn-galeria"
                  onClick={() => { setShowGallery(!showGallery); setShowCamera(false); }}
                  className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    showGallery 
                      ? 'bg-blue-600 text-white border-blue-500' 
                      : 'bg-[#222222] text-[#FAFAFA] border-[#333333] hover:border-blue-500'
                  }`}
                  title="Enviar foto da galeria"
                >
                  <Share2 size={15} />
                  <span>Galeria</span>
                </button>
              </div>
            </div>

            {/* SELETOR DE BANCA (CARDS OFICIAIS) */}
            <div className="mb-5 space-y-2">
              <label className="text-xs font-bold text-[#A3A3A3] uppercase tracking-wider block">
                Banca Avaliadora
              </label>
              
              <div id="banca-selector" className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {BANCAS_CORRIGEBOT.map((b) => {
                  const isSelected = vestibular === b.vestibular;
                  return (
                    <div
                      key={b.id}
                      id={`banca-card-${b.id}`}
                      data-banca={b.id}
                      onClick={() => {
                        setVestibular(b.vestibular);
                        setCorrection(null);
                      }}
                      className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer select-none flex flex-col justify-center ${
                        isSelected
                          ? 'border-[#1E3A8A] bg-[#1E3A8A]/15 shadow-sm'
                          : 'border-[#262626] bg-[#1A1A1A] hover:border-[#404040]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#FAFAFA] tracking-wide">
                          {b.nome}
                        </span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#A3A3A3] mt-1 line-clamp-2 leading-tight">
                        {b.info}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DRAWER DA CÂMERA */}
            <AnimatePresence mode="wait">
              {showCamera && (
                <motion.div 
                  key="camera"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 bg-[#141414] rounded-2xl p-4 border border-[#333333]"
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
                  className="mb-5 bg-[#141414] rounded-2xl p-4 border border-[#333333]"
                >
                  <GalleryPicker onFilesSelect={(files) => {
                    if (files.length > 0) handleImageEssayCorrection(files[0]);
                  }} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* SELETOR DE PROPOSTA PARA UNICAMP */}
            {vestibular === Vestibular.UNICAMP && (
              <motion.div 
                id="unicamp-proposta" 
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3.5 rounded-xl bg-[#141414] border border-[#333333] space-y-1.5"
              >
                <label className="text-xs font-semibold text-[#A3A3A3] block">
                  Qual proposta está corrigindo?
                </label>
                <select
                  id="proposta-numero"
                  value={propostaNumero}
                  onChange={(e) => {
                    setPropostaNumero(parseInt(e.target.value, 10));
                    setCorrection(null);
                  }}
                  className="w-full p-2.5 bg-[#1A1A1A] border border-[#404040] rounded-lg text-xs sm:text-sm text-[#FAFAFA] font-medium outline-none focus:border-[#1E3A8A] cursor-pointer"
                >
                  <option value="1">Proposta 1 (dissertativa-argumentativa)</option>
                  <option value="2">Proposta 2 (gênero específico: carta, artigo, discurso, manifesto)</option>
                </select>
              </motion.div>
            )}

            {/* CAMPO DE TEMA DA REDAÇÃO */}
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#A3A3A3] uppercase tracking-wider">
                  Tema da Redação
                </label>
                <button
                  type="button"
                  id="btn-gerar-tema"
                  onClick={handleGenerateAITheme}
                  disabled={isGenerating}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                  <span>Gerar Tema IA</span>
                </button>
              </div>

              {/* SELETOR RÁPIDO DE TEMAS OFICIAIS */}
              {themes.length > 0 && (
                <div className="relative mb-2">
                  <select
                    value={themes.find(t => t.theme === selectedTheme) ? selectedTheme : 'custom'}
                    onChange={(e) => {
                      if (e.target.value === 'custom') return;
                      const val = e.target.value;
                      setSelectedTheme(val);
                      setCorrection(null);
                      if (vestibular === Vestibular.UNICAMP) {
                        if (val.includes('Proposta 2')) {
                          setPropostaNumero(2);
                        } else if (val.includes('Proposta 1')) {
                          setPropostaNumero(1);
                        }
                      }
                    }}
                    className="w-full bg-[#141414] border border-[#333333] rounded-lg px-3 py-2 text-xs text-[#A3A3A3] outline-none appearance-none cursor-pointer pr-8 truncate"
                  >
                    <option value="" disabled>Selecione um tema oficial do {vestibular}...</option>
                    {themes.map((t, i) => (
                      <option key={i} value={t.theme} className="bg-[#1A1A1A] text-white">
                        {t.year ? `${t.year}: ` : ''}{t.theme}
                      </option>
                    ))}
                    {selectedTheme && !themes.some(t => t.theme === selectedTheme) && (
                      <option value="custom">Tema personalizado: {selectedTheme}</option>
                    )}
                  </select>
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                    <ChevronDown size={14} />
                  </div>
                </div>
              )}

              <input
                type="text"
                id="redacao-tema"
                value={selectedTheme}
                onChange={(e) => {
                  setSelectedTheme(e.target.value);
                  setCorrection(null);
                }}
                className="w-full px-3.5 py-3 border border-[#404040] rounded-xl text-xs sm:text-sm text-[#FAFAFA] bg-[#1A1A1A] outline-none focus:border-[#1E3A8A] transition-colors"
                placeholder="Tema da redação (ex: Perspectivas acerca do envelhecimento na sociedade brasileira)"
              />

              {/* COLETÂNEA OFICIAL DE TEXTOS MOTIVADORES UNESP 2025 */}
              {selectedTheme.toLowerCase().includes('medicalização') && (
                <div className="mt-3 p-4 rounded-xl bg-[#141414] border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                        Caderno Oficial UNESP 2025 — Coletânea de Textos Motivadores
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowMotivadores(!showMotivadores)}
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
                    >
                      {showMotivadores ? 'Recolher Textos ▲' : 'Ler Textos de Apoio ▼'}
                    </button>
                  </div>

                  {showMotivadores && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4 pt-2 border-t border-[#262626] text-xs text-[#E5E5E5] leading-relaxed"
                    >
                      <div className="p-3 rounded-lg bg-[#1F1F1F] border border-[#333] text-amber-200">
                        <strong>Comando da Prova:</strong> {UNESP_2025_REDACAO.instrucoes}
                      </div>

                      {UNESP_2025_REDACAO.textosMotivadores.map((t) => (
                        <div key={t.numero} className="p-3.5 rounded-lg bg-[#1A1A1A] border border-[#2E2E2E] space-y-1.5">
                          <div className="flex items-center justify-between font-bold text-amber-400">
                            <span>Texto {t.numero}{t.titulo ? `: ${t.titulo}` : ''}</span>
                            <span className="text-[10px] text-zinc-400 font-normal">{t.fonte}</span>
                          </div>
                          <p className="whitespace-pre-line text-[#D4D4D4]">{t.conteudo}</p>
                        </div>
                      ))}

                      <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-amber-100 space-y-2">
                        <strong className="text-amber-400 block text-xs">Critérios & Comentário da Banca VUNESP:</strong>
                        <p className="whitespace-pre-line text-[11px] leading-relaxed text-zinc-300">
                          {UNESP_2025_REDACAO.comentarioBanca}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* TEXTAREA DA REDAÇÃO */}
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center justify-between text-xs text-[#A3A3A3]">
                <label className="font-bold uppercase tracking-wider">
                  Texto da Redação
                </label>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{wordCount} palavras</span>
                  <span>•</span>
                  <span className="font-semibold">~{lineCount} linhas</span>
                  <span>•</span>
                  <span className={charCount > 12000 ? 'text-red-400 font-bold' : ''}>
                    {charCount}/12000 carac.
                  </span>
                </div>
              </div>

              <textarea
                id="redacao-texto"
                value={essayText}
                onChange={(e) => {
                  setEssayText(e.target.value);
                  setCorrection(null);
                }}
                rows={15}
                className="w-full p-4 border border-[#404040] rounded-xl text-xs sm:text-sm text-[#FAFAFA] bg-[#1A1A1A] outline-none focus:border-[#1E3A8A] transition-colors resize-vertical leading-relaxed font-sans"
                placeholder="Cole ou digite sua redação aqui..."
              />

              {/* FERRAMENTA DE TRANSCRIÇÃO DE ÁUDIO */}
              <div className="flex items-center justify-between pt-1">
                <AudioTranscriber
                  compact={true}
                  onTranscriptionComplete={(text) => {
                    setEssayText((prev) => (prev ? `${prev.trim()}\n${text}` : text));
                    setCorrection(null);
                  }}
                />
                
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer py-1"
                >
                  {saveSuccess ? (
                    <>
                      <Check size={14} className="text-emerald-400" />
                      <span className="text-emerald-400">Rascunho salvo</span>
                    </>
                  ) : (
                    <>
                      <Clock size={14} />
                      <span>Salvar rascunho</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* BOTÃO PRINCIPAL DE CORREÇÃO */}
            <button
              type="button"
              id="btn-corrigir"
              onClick={handleAnalyzeEssay}
              disabled={isAnalyzing || !essayText.trim() || !selectedTheme.trim()}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Corrigindo... isso pode levar até 1 minuto</span>
                </>
              ) : (
                <>
                  <Award size={18} />
                  <span>Corrigir Redação</span>
                </>
              )}
            </button>

            {/* ========== SEÇÃO DE RESULTADO DO CORRIGEBOT ========== */}
            {correction && (
              <motion.div 
                id="redacao-resultado"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 pt-6 border-t border-[#262626] space-y-4"
              >
                {/* 1. NOTA OU CONCEITO / ZERADA */}
                {correction.zerada ? (
                  <div 
                    id="box-redacao-zerada"
                    className="p-5 rounded-xl text-center border-2 border-[#DC2626] bg-[#DC2626]/10"
                  >
                    <div className="text-2xl sm:text-3xl font-black text-[#DC2626] tracking-tight">
                      REDAÇÃO ZERADA
                    </div>
                    <div className="text-xs sm:text-sm text-red-300 mt-2 font-medium">
                      {correction.motivo_zeramento || 'Não atendimento aos critérios essenciais da banca.'}
                    </div>
                  </div>
                ) : (correction.nota_final !== undefined && correction.nota_final !== null) ? (
                  <div 
                    id="box-nota-final"
                    className="p-5 rounded-xl text-center border border-[#1E3A8A] bg-[#1E3A8A]/15"
                  >
                    <div className="text-4xl sm:text-5xl font-black text-[#FAFAFA] tracking-tight">
                      {correction.nota_final}
                    </div>
                    <div className="text-xs text-[#A3A3A3] mt-1.5 font-semibold uppercase tracking-wider">
                      Nota final na escala do ENEM (0–1000)
                    </div>
                  </div>
                ) : correction.conceito_geral ? (
                  <div 
                    id="box-conceito-geral"
                    className="p-5 rounded-xl text-center border border-[#1E3A8A] bg-[#1E3A8A]/15"
                  >
                    <div className="text-3xl sm:text-4xl font-black text-[#1DB954] tracking-tight">
                      {correction.conceito_geral}
                    </div>
                    <div className="text-xs text-[#A3A3A3] mt-1.5 font-semibold uppercase tracking-wider">
                      Conceito geral — {correction.banca_nome || vestibular}
                    </div>
                  </div>
                ) : (
                  <div 
                    id="box-nota-generica"
                    className="p-5 rounded-xl text-center border border-[#1E3A8A] bg-[#1E3A8A]/15"
                  >
                    <div className="text-4xl font-black text-[#FAFAFA]">
                      {correction.grade}
                    </div>
                    <div className="text-xs text-[#A3A3A3] mt-1.5 font-semibold uppercase tracking-wider">
                      Pontuação Avaliada — {vestibular}
                    </div>
                  </div>
                )}

                {/* 2. COMPETÊNCIAS DA BANCA */}
                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-[#A3A3A3] uppercase tracking-wider px-1">
                    Critérios & Competências Oficiais
                  </div>

                  {(correction.competencies || []).map((comp, idx) => (
                    <div 
                      key={idx}
                      className="p-4 rounded-xl bg-[#141414] border border-[#262626] space-y-2"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-xs sm:text-sm font-bold text-[#FAFAFA]">
                          C{comp.id || (idx + 1)} — {comp.nome || comp.name}
                        </div>
                        {comp.nota !== undefined ? (
                          <div className="text-base sm:text-lg font-bold text-[#1DB954] shrink-0">
                            {comp.nota}/{comp.nota_max || 200}
                          </div>
                        ) : comp.conceito ? (
                          <div className="text-xs sm:text-sm font-bold text-[#1DB954] px-2 py-0.5 rounded bg-[#1DB954]/10 shrink-0">
                            {comp.conceito}
                          </div>
                        ) : (
                          <div className="text-sm font-bold text-[#1DB954] shrink-0">
                            {comp.score} pts
                          </div>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed">
                        {comp.comentario || comp.strengths || comp.weaknesses}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 3. PONTOS FORTES */}
                {correction.pontos_fortes && correction.pontos_fortes.length > 0 && (
                  <div className="p-4 rounded-xl bg-[#141414] border border-[#262626] space-y-2">
                    <div className="text-xs sm:text-sm font-bold text-emerald-400">
                      ✅ Pontos fortes
                    </div>
                    <div className="space-y-1 text-xs sm:text-sm text-[#A3A3A3] leading-relaxed">
                      {correction.pontos_fortes.map((p, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-500">•</span>
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. PONTOS DE MELHORIA */}
                {correction.pontos_melhoria && correction.pontos_melhoria.length > 0 && (
                  <div className="p-4 rounded-xl bg-[#141414] border border-[#262626] space-y-2">
                    <div className="text-xs sm:text-sm font-bold text-amber-400">
                      ⚠️ Pontos de melhoria
                    </div>
                    <div className="space-y-1 text-xs sm:text-sm text-[#A3A3A3] leading-relaxed">
                      {correction.pontos_melhoria.map((p, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-500">•</span>
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. MODELO DE PROPOSTA DE INTERVENÇÃO (ENEM) */}
                {correction.sugestao_proposta_intervencao && (
                  <div className="p-4 rounded-xl bg-[#141414] border border-[#262626] space-y-2.5">
                    <div className="text-xs sm:text-sm font-bold text-blue-400 flex items-center gap-1.5">
                      <Lightbulb size={16} />
                      <span>💡 Modelo de proposta de intervenção</span>
                    </div>
                    <div className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed space-y-1.5">
                      <div><b className="text-[#FAFAFA]">Agente:</b> {correction.sugestao_proposta_intervencao.agente || '—'}</div>
                      <div><b className="text-[#FAFAFA]">Ação:</b> {correction.sugestao_proposta_intervencao.acao || '—'}</div>
                      <div><b className="text-[#FAFAFA]">Meio/Modo:</b> {correction.sugestao_proposta_intervencao.meio || '—'}</div>
                      <div><b className="text-[#FAFAFA]">Finalidade:</b> {correction.sugestao_proposta_intervencao.finalidade || '—'}</div>
                      <div><b className="text-[#FAFAFA]">Detalhamento:</b> {correction.sugestao_proposta_intervencao.detalhamento || '—'}</div>
                    </div>
                  </div>
                )}

                {/* 6. PARECER GERAL DO CORRETOR */}
                {(correction.parecer_geral || correction.generalCorrection) && (
                  <div className="p-4 rounded-xl bg-[#141414] border border-[#262626] space-y-2">
                    <div className="text-xs sm:text-sm font-bold text-[#FAFAFA] flex items-center gap-1.5">
                      <span>📝 Parecer geral do corretor</span>
                    </div>
                    <div className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed whitespace-pre-line">
                      {correction.parecer_geral || correction.generalCorrection}
                    </div>
                  </div>
                )}

              </motion.div>
            )}

          </div>

        </div>

        {/* SIDEBAR LATERAL (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* HISTÓRICO DE REDAÇÕES */}
          <div className="bg-[#1A1A1A] rounded-2xl p-5 border border-[#262626] shadow-sm space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#262626]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-950/60 text-blue-400 flex items-center justify-center">
                  <History size={15} />
                </div>
                <h3 className="font-bold text-sm text-[#FAFAFA]">
                  Histórico de Redações
                </h3>
              </div>
              <span className="text-xs font-bold text-[#A3A3A3]">
                {essayHistory.length}
              </span>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {essayHistory.map((h) => (
                <div 
                  key={h.id} 
                  onClick={() => handleLoadEssay(h)}
                  className="p-3 rounded-xl bg-[#141414] hover:bg-[#202020] border border-[#262626] hover:border-blue-500/40 transition-all cursor-pointer space-y-1.5 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-xs text-[#FAFAFA] line-clamp-1 group-hover:text-blue-400 transition-colors">
                      {h.theme}
                    </p>
                    {h.status === 'corrected' && (
                      <span className="px-1.5 py-0.5 rounded bg-blue-600/30 text-blue-300 font-bold text-[10px] shrink-0">
                        {h.nota_final !== undefined && h.nota_final !== null
                          ? `${h.nota_final} pts`
                          : h.conceito_geral
                          ? h.conceito_geral
                          : `${h.grade ?? 0} pts`}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#A3A3A3]">
                    <span>
                      {h.timestamp ? h.timestamp.toDate().toLocaleDateString('pt-BR') : 'Hoje'}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded font-bold uppercase ${
                      h.status === 'corrected' 
                        ? 'bg-emerald-500/15 text-emerald-400' 
                        : 'bg-amber-500/15 text-amber-400'
                    }`}>
                      {h.status === 'corrected' ? 'Corrigida' : 'Rascunho'}
                    </span>
                  </div>
                </div>
              ))}
              
              {essayHistory.length === 0 && (
                <div className="text-center py-7 space-y-2">
                  <div className="w-8 h-8 bg-[#222222] rounded-full flex items-center justify-center mx-auto text-[#A3A3A3]">
                    <FileText size={15} />
                  </div>
                  <p className="text-xs text-[#A3A3A3]">
                    Nenhuma redação registrada ainda.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* DICAS OFICIAIS DE REDAÇÃO */}
          <div className="bg-[#1A1A1A] rounded-2xl p-5 border border-[#262626] shadow-sm space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#262626]">
              <div className="w-7 h-7 rounded-lg bg-amber-950/50 text-amber-400 flex items-center justify-center">
                <Lightbulb size={15} />
              </div>
              <h3 className="font-bold text-sm text-[#FAFAFA]">
                Guia Rápido por Banca
              </h3>
            </div>
            
            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-[#141414] border border-[#262626]">
                <div className="font-bold text-blue-400">ENEM (0 a 1000)</div>
                <div className="text-[#A3A3A3] mt-0.5 leading-relaxed">
                  5 competências de 200 pts. Proposta de intervenção obrigatória com Agente, Ação, Meio, Efeito e Detalhamento.
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#141414] border border-[#262626]">
                <div className="font-bold text-purple-400">FUVEST (USP)</div>
                <div className="text-[#A3A3A3] mt-0.5 leading-relaxed">
                  Rigor reflexivo e filosófico. Não exige intervenção. Valoriza repertório articulado e obras obrigatórias.
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#141414] border border-[#262626]">
                <div className="font-bold text-emerald-400">UNICAMP</div>
                <div className="text-[#A3A3A3] mt-0.5 leading-relaxed">
                  Foco na situação de enunciação e gênero textual específico (artigo, manifesto, carta etc.).
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#141414] border border-[#262626]">
                <div className="font-bold text-amber-400">UNESP</div>
                <div className="text-[#A3A3A3] mt-0.5 leading-relaxed">
                  Temas costumam ser perguntas reflexivas. Posicionamento claro e coesão madura.
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#141414] border border-[#262626]">
                <div className="font-bold text-cyan-400">ITA (0 a 10)</div>
                <div className="text-[#A3A3A3] mt-0.5 leading-relaxed">
                  Rigor formal, clareza lógica implacável e poder de síntese. Evite lugares-comuns e propostas ingênuas.
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
