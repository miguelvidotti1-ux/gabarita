import React, { useState } from 'react';
import { 
  Mic, 
  Copy, 
  Check, 
  Trash2, 
  Sparkles, 
  FileText, 
  ArrowRight, 
  HelpCircle,
  Clock,
  History,
  Volume2
} from 'lucide-react';
import AudioTranscriber from './AudioTranscriber';

interface AudioTranscriberViewProps {
  onSendToChat?: (text: string) => void;
  onSendToRedacao?: (text: string) => void;
}

interface SavedNote {
  id: string;
  text: string;
  timestamp: string;
  wordsCount: number;
}

export default function AudioTranscriberView({
  onSendToChat,
  onSendToRedacao
}: AudioTranscriberViewProps) {
  const [currentText, setCurrentText] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>(() => {
    try {
      const stored = localStorage.getItem('vestibular_transcription_notes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const handleSaveNote = () => {
    if (!currentText.trim()) return;
    const newNote: SavedNote = {
      id: 'note_' + Date.now(),
      text: currentText.trim(),
      timestamp: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
      wordsCount: currentText.trim().split(/\s+/).length,
    };
    const updated = [newNote, ...savedNotes];
    setSavedNotes(updated);
    localStorage.setItem('vestibular_transcription_notes', JSON.stringify(updated));
  };

  const handleDeleteNote = (id: string) => {
    const updated = savedNotes.filter(n => n.id !== id);
    setSavedNotes(updated);
    localStorage.setItem('vestibular_transcription_notes', JSON.stringify(updated));
  };

  const handleCopyCurrent = () => {
    if (!currentText) return;
    navigator.clipboard.writeText(currentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 font-mono">
              gemini-3.5-transcribe
            </span>
            <span className="text-xs text-slate-400 dark:text-zinc-500">IA de Áudio & Fala</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
            Transcrição de Áudio por Microfone
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Grave suas falas, raciocínios, argumentos de redação ou dúvidas em voz alta com transcrição instantânea via IA.
          </p>
        </div>
      </div>

      {/* ÁREA DE GRAVAÇÃO PRINCIPAL */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-light)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Mic size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-main)]">
                Entrada de Microfone ao Vivo
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Pressione o botão para gravar seu áudio e aguarde a conversão em texto
              </p>
            </div>
          </div>

          <AudioTranscriber
            onTranscriptionComplete={(text) => {
              setCurrentText((prev) => (prev ? `${prev.trim()}\n\n${text}` : text));
            }}
            buttonLabel="Gravar novo áudio"
          />
        </div>

        {/* ÁREA DO TEXTO TRANSCRITO */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Texto Transcrito
            </span>
            {currentText && (
              <div className="flex items-center gap-3">
                <span>{currentText.split(/\s+/).filter(Boolean).length} palavras</span>
                <button
                  type="button"
                  onClick={handleCopyCurrent}
                  className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentText('')}
                  className="flex items-center gap-1 text-rose-500 hover:underline cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>Limpar</span>
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <textarea
              rows={8}
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              placeholder="Grave seu áudio pelo botão acima ou fale pelo microfone. O texto transcrito pelo modelo gemini-3.5-transcribe aparecerá aqui..."
              style={{ color: '#000000', backgroundColor: '#ffffff' }}
              className="w-full p-5 rounded-2xl border border-[var(--border-light)] text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none leading-relaxed placeholder:text-slate-400 font-medium"
            />
          </div>

          {/* AÇÕES COM O TEXTO TRANSCRITO */}
          {currentText && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleSaveNote}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#222630] dark:hover:bg-[#2c3240] text-xs font-semibold text-[var(--text-main)] transition-all cursor-pointer flex items-center gap-2"
              >
                <FileText size={14} />
                <span>Salvar nas Minhas Notas de Áudio</span>
              </button>

              <div className="flex items-center gap-2">
                {onSendToChat && (
                  <button
                    type="button"
                    onClick={() => onSendToChat(currentText)}
                    className="px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles size={14} />
                    <span>Perguntar ao Tutor IA</span>
                  </button>
                )}

                {onSendToRedacao && (
                  <button
                    type="button"
                    onClick={() => onSendToRedacao(currentText)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <FileText size={14} />
                    <span>Usar na Redação</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* NOTAS SALVAS & DICAS DE USO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Histórico / Notas salvas */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History size={18} className="text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-bold text-[var(--text-main)]">
                Histórico de Transcrições Salvas ({savedNotes.length})
              </h3>
            </div>
          </div>

          {savedNotes.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--text-muted)]">
              Nenhuma anotação de áudio salva ainda. Grave seu primeiro áudio acima e clique em "Salvar nas Minhas Notas".
            </div>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {savedNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 group shadow-2xs"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock size={12} /> {note.timestamp}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{note.wordsCount} palavras</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-rose-500 hover:text-rose-700 p-1 opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Excluir nota"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <p style={{ color: '#000000' }} className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed font-medium">
                    {note.text}
                  </p>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(note.text);
                      }}
                      className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Copy size={11} /> Copiar
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentText(note.text)}
                      className="text-[11px] text-slate-600 dark:text-zinc-300 hover:underline flex items-center gap-1 cursor-pointer ml-2"
                    >
                      Carregar no editor
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card explicativo */}
        <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-amber-500" />
            <h3 className="text-sm font-bold text-[var(--text-main)]">
              Dicas Pedagógicas
            </h3>
          </div>
          <ul className="space-y-3 text-xs text-[var(--text-muted)] leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <span><strong>Técnica Feynman:</strong> Explique em voz alta conceitos difíceis como se estivesse ensinando alguém. A transcrição registrará lacunas no seu raciocínio.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <span><strong>Brainstorm de Redação:</strong> Ditando argumentos e exemplos históricos sem parar para destravar o bloqueio criativo antes de escrever.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <span><strong>Dúvidas Diretas:</strong> Use o botão de microfone também direto na tela "Conversar com IA" para tirar dúvidas sem digitar.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
