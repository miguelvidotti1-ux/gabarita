import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2, Volume2, Check, AlertCircle, Sparkles, Copy, X } from 'lucide-react';

interface AudioTranscriberProps {
  onTranscriptionComplete: (text: string) => void;
  className?: string;
  buttonLabel?: string;
  showModalTrigger?: boolean;
  inline?: boolean;
  compact?: boolean;
}

export default function AudioTranscriber({
  onTranscriptionComplete,
  className = '',
  buttonLabel = 'Gravar áudio',
  showModalTrigger = false,
  inline = false,
  compact = false,
}: AudioTranscriberProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastTranscript, setLastTranscript] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stopTracks();
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  const stopTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startVisualizer = (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const checkLevel = () => {
        if (!isRecording && !mediaRecorderRef.current) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setAudioLevel(Math.min(100, Math.round((avg / 255) * 100)));
        animationFrameRef.current = requestAnimationFrame(checkLevel);
      };
      animationFrameRef.current = requestAnimationFrame(checkLevel);
    } catch (e) {
      console.warn('Audio visualizer not supported or failed:', e);
    }
  };

  const startRecording = async () => {
    setTranscriptionError(null);
    audioChunksRef.current = [];
    setRecordingDuration(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Suporte para webm, ogg ou mp4
      let mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
          mimeType = 'audio/ogg;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else {
          mimeType = '';
        }
      }

      const mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const recordedBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || 'audio/webm',
        });
        stopTracks();
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        setAudioLevel(0);
        await sendAudioToGemini(recordedBlob);
      };

      mediaRecorder.start(250); // Coletar fatias a cada 250ms
      setIsRecording(true);
      startVisualizer(stream);

      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Erro ao acessar microfone:', err);
      let msg = 'Não foi possível acessar o microfone.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Permissão de acesso ao microfone negada no navegador.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = 'Nenhum microfone foi detectado neste dispositivo.';
      }
      setTranscriptionError(msg);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const sendAudioToGemini = async (audioBlob: Blob) => {
    if (audioBlob.size === 0) {
      setTranscriptionError('Nenhum áudio foi capturado.');
      return;
    }

    setIsTranscribing(true);
    setTranscriptionError(null);

    try {
      // Converter blob para Base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(audioBlob);
      const dataUrl = await base64Promise;

      const response = await fetch('/api/gemini/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioData: dataUrl,
          mimeType: audioBlob.type || 'audio/webm',
          prompt: 'Transcreva este áudio com máxima fidelidade em português. Mantenha pontuação e estrutura natural das frases faladas.',
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Falha ao processar áudio com Gemini.');
      }

      const transcribedText = data.text || '';
      setLastTranscript(transcribedText);

      if (transcribedText.trim()) {
        onTranscriptionComplete(transcribedText.trim());
      } else {
        setTranscriptionError('Não foi possível identificar falas claras no áudio gravado.');
      }
    } catch (err: any) {
      console.error('Erro na transcrição:', err);
      setTranscriptionError(err.message || 'Erro ao transcrever áudio.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleCopyTranscript = () => {
    if (!lastTranscript) return;
    navigator.clipboard.writeText(lastTranscript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Modo compacto (para barras de input como no chat ou redação)
  if (compact) {
    return (
      <div className={`relative flex items-center ${className}`}>
        {isRecording ? (
          <div className="flex items-center gap-1.5 bg-rose-500/15 border border-rose-500/30 px-2.5 py-1.5 rounded-xl text-rose-500 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-mono font-medium">{formatDuration(recordingDuration)}</span>
            <button
              type="button"
              onClick={stopRecording}
              className="ml-1 p-1 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-all active:scale-95 cursor-pointer shadow-xs"
              title="Finalizar gravação e transcrever"
            >
              <MicOff size={14} />
            </button>
          </div>
        ) : isTranscribing ? (
          <div className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1.5 rounded-xl text-blue-500">
            <Loader2 size={14} className="animate-spin" />
            <span className="text-[11px] font-medium">Transcrevendo (gemini-3.5-transcribe)...</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={startRecording}
            style={{ color: '#aaa5a5', backgroundColor: '#aaa5a5' }}
            className="p-2 sm:p-2.5 rounded-xl text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all active:scale-95 cursor-pointer"
            title="Gravar áudio pelo microfone e transcrever com IA"
          >
            <svg 
              viewBox="0 0 24 24" 
              width="16" 
              height="16" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              style={{ borderColor: '#212223' }}
            >
              <rect x="9" y="2" width="6" height="11" rx="3" style={{ color: '#090a0a' }} />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" style={{ color: '#0f0f10' }} />
              <path d="M12 19v4m-4 0h8" style={{ color: '#0f0f10' }} />
            </svg>
          </button>
        )}

        {transcriptionError && (
          <div className="absolute bottom-full right-0 mb-2 w-64 p-2.5 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900 rounded-xl shadow-lg text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2 z-50">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">Falha na gravação</p>
              <p className="text-[11px] opacity-90">{transcriptionError}</p>
            </div>
            <button
              type="button"
              onClick={() => setTranscriptionError(null)}
              className="text-rose-400 hover:text-rose-600"
            >
              <X size={12} />
            </button>
          </div>
        )}
      </div>
    );
  }

  // Modo inline ou botão dedicado
  return (
    <>
      <div className={`flex flex-col gap-2 ${className}`}>
        <div className="flex items-center gap-2">
          {isRecording ? (
            <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/30 px-3.5 py-2 rounded-xl text-rose-500">
              <div className="relative flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="absolute w-5 h-5 rounded-full bg-rose-500/40 animate-ping" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold">{formatDuration(recordingDuration)}</span>
                {/* Visualizador de volume */}
                <div className="flex items-center gap-0.5 h-3">
                  {[...Array(6)].map((_, i) => (
                    <span
                      key={i}
                      className="w-1 bg-rose-500 rounded-full transition-all duration-75"
                      style={{
                        height: `${Math.max(3, (audioLevel / 100) * (12 + (i % 3) * 3))}px`,
                      }}
                    />
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={stopRecording}
                className="flex items-center gap-1.5 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-lg transition-all active:scale-95 shadow-sm cursor-pointer"
              >
                <MicOff size={13} />
                <span>Parar e Transcrever</span>
              </button>
            </div>
          ) : isTranscribing ? (
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium">
              <Loader2 size={15} className="animate-spin text-blue-600 dark:text-blue-400" />
              <span>Transcrevendo áudio com <strong>gemini-3.5-transcribe</strong>...</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={startRecording}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#222630] dark:hover:bg-[#2a303c] text-slate-700 dark:text-zinc-200 text-xs font-medium transition-all active:scale-95 border border-slate-200/80 dark:border-white/10 cursor-pointer shadow-xs"
            >
              <Mic size={14} className="text-blue-600 dark:text-blue-400" />
              <span>{buttonLabel}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono">
                IA 3.5
              </span>
            </button>
          )}

          {showModalTrigger && (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-xs text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 underline underline-offset-2 ml-1"
            >
              Painel de Transcrição
            </button>
          )}
        </div>

        {transcriptionError && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{transcriptionError}</span>
            </div>
            <button
              type="button"
              onClick={() => setTranscriptionError(null)}
              className="text-rose-400 hover:text-rose-600 text-[11px]"
            >
              Fechar
            </button>
          </div>
        )}
      </div>

      {/* MODAL COMPLETO DE TRANSCRIÇÃO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1500] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1D24] border border-slate-200 dark:border-white/15 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-[#15171C]/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Mic size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Transcrição de Áudio por Microfone
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                    Alimentado pelo modelo <code className="text-blue-600 dark:text-blue-400 font-mono">gemini-3.5-transcribe</code>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5"
              >
                <X size={16} />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex flex-col items-center justify-center py-6 px-4 rounded-2xl bg-slate-50 dark:bg-[#15171C] border border-slate-200/80 dark:border-white/5 text-center">
                {isRecording ? (
                  <div className="space-y-3">
                    <div className="relative inline-flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center animate-pulse">
                        <Mic size={28} className="text-rose-500" />
                      </div>
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 animate-ping" />
                    </div>
                    <div>
                      <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white">
                        {formatDuration(recordingDuration)}
                      </div>
                      <p className="text-xs text-rose-500 font-medium">Gravando microfone em tempo real...</p>
                    </div>
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-rose-500/25 transition-all active:scale-95 cursor-pointer"
                    >
                      Finalizar e Transcrever
                    </button>
                  </div>
                ) : isTranscribing ? (
                  <div className="space-y-3 py-4">
                    <Loader2 size={36} className="animate-spin text-blue-600 mx-auto" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                        Processando transcrição...
                      </p>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        O Gemini 3.5 Transcribe está convertendo a fala em texto.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={startRecording}
                      className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Mic size={26} />
                    </button>
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                        Clique para Iniciar a Gravação
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                        Fale dúvidas, rascunhos de redação ou anotações de estudo
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Resultado da última transcrição */}
              {lastTranscript && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
                    <span className="font-semibold">Texto Transcrito:</span>
                    <button
                      type="button"
                      onClick={handleCopyTranscript}
                      className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copied ? 'Copiado!' : 'Copiar texto'}</span>
                    </button>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#15171C] border border-slate-200/80 dark:border-white/10 text-xs sm:text-sm text-slate-800 dark:text-zinc-200 max-h-40 overflow-y-auto leading-relaxed">
                    {lastTranscript}
                  </div>
                </div>
              )}
            </div>

            {/* Rodapé */}
            <div className="p-4 border-t border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-[#15171C]/50 flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-[#262A35] dark:hover:bg-[#303542] text-slate-700 dark:text-zinc-200 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
