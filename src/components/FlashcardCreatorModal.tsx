import React, { useState } from 'react';
import { X, Upload, Sparkles, Loader2, Plus, Trash2, AlertCircle, PenLine, Tag } from 'lucide-react';
import { Flashcard } from '../data/flashcardsData';

export interface CreatedFlashcardsPayload {
  title: string;
  category: string;
  description: string;
  cards: Flashcard[];
}

interface FlashcardCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (payload: CreatedFlashcardsPayload) => void;
}

const CATEGORY_OPTIONS = [
  'Personalizado',
  'História',
  'Geografia',
  'Ciências',
  'Biologia',
  'Matemática',
  'Química',
  'Física',
  'Português',
  'Inglês',
  'Sociologia',
  'Filosofia',
  'Artes',
  'Redação',
  'Atualidades',
];

interface ManualCardDraft {
  front_content: string;
  back_content: string;
}

export const FlashcardCreatorModal: React.FC<FlashcardCreatorModalProps> = ({ isOpen, onClose, onCreated }) => {
  const [mode, setMode] = useState<'ai' | 'manual'>('ai');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Personalizado');
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [difficulty, setDifficulty] = useState('média');
  const [numCards, setNumCards] = useState(5);
  const [manualCards, setManualCards] = useState<ManualCardDraft[]>([
    { front_content: '', back_content: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setTitle('');
    setCategory('Personalizado');
    setDescription('');
    setPrompt('');
    setFile(null);
    setDifficulty('média');
    setNumCards(5);
    setManualCards([{ front_content: '', back_content: '' }]);
    setErrorMsg(null);
  };

  const handleClose = () => {
    if (loading) return;
    setErrorMsg(null);
    onClose();
  };

  const handleAddManualCard = () => {
    if (manualCards.length >= 30) return;
    setManualCards((prev) => [...prev, { front_content: '', back_content: '' }]);
  };

  const handleRemoveManualCard = (index: number) => {
    if (manualCards.length <= 1) return;
    setManualCards((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateManualCard = (index: number, field: keyof ManualCardDraft, value: string) => {
    setManualCards((prev) =>
      prev.map((card, i) => (i === index ? { ...card, [field]: value } : card))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setErrorMsg('Informe um título para facilitar a procura do seu baralho.');
      return;
    }

    const trimmedDescription = description.trim();

    if (mode === 'manual') {
      const validCards = manualCards
        .map((c, idx) => ({
          id: `manual_${Date.now()}_${idx + 1}`,
          front_content: c.front_content.trim(),
          back_content: c.back_content.trim(),
          topic: trimmedTitle,
        }))
        .filter((c) => c.front_content.length > 0 && c.back_content.length > 0);

      if (validCards.length === 0) {
        setErrorMsg('Preencha pelo menos 1 flashcard com pergunta (frente) e resposta (verso).');
        return;
      }

      onCreated({
        title: trimmedTitle,
        category,
        description: trimmedDescription || `Baralho personalizado • ${validCards.length} ${validCards.length === 1 ? 'card' : 'cards'}`,
        cards: validCards,
      });
      resetForm();
      onClose();
      return;
    }

    if (!prompt.trim() && !file) {
      setErrorMsg('Escreva o conteúdo/tema ou anexe um arquivo/foto para gerar os flashcards.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('prompt', `Título do baralho: ${trimmedTitle}\nMatéria: ${category}\n${prompt.trim()}`);
    formData.append('difficulty', difficulty);
    formData.append('numCards', numCards.toString());
    if (file) formData.append('file', file);

    try {
      const response = await fetch('/api/flashcards/generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error || 'Falha na geração dos flashcards');
      }

      const data = await response.json();
      const rawCards = Array.isArray(data?.cards) ? data.cards : [];
      const normalizedCards: Flashcard[] = rawCards
        .map((c: any, idx: number) => ({
          id: String(c?.id || `gen_${Date.now()}_${idx + 1}`),
          front_content: String(c?.front_content || c?.front || '').trim(),
          back_content: String(c?.back_content || c?.back || '').trim(),
          topic: String(c?.topic || trimmedTitle).trim(),
        }))
        .filter((c: Flashcard) => c.front_content.length > 0 && c.back_content.length > 0);

      if (normalizedCards.length === 0) {
        throw new Error('Não foi possível gerar cards válidos. Tente detalhar um pouco mais o conteúdo.');
      }

      onCreated({
        title: trimmedTitle,
        category,
        description: trimmedDescription || `Criado com IA • ${normalizedCards.length} ${normalizedCards.length === 1 ? 'card' : 'cards'} (${difficulty})`,
        cards: normalizedCards,
      });
      resetForm();
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Erro ao gerar flashcards. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#10141D] border border-[#2A3348] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="text-indigo-500" size={20} /> Criar Flashcards
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-white cursor-pointer"
            aria-label="Fechar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Creation Mode Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#090D15] border border-[#2A3348] rounded-xl mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('ai');
              setErrorMsg(null);
            }}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'ai'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles size={14} /> Gerar com IA
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('manual');
              setErrorMsg(null);
            }}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'manual'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PenLine size={14} /> Criar Manualmente
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Field */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">
              Título do Baralho *
            </label>
            <div className="relative">
              <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                placeholder="Ex: Revolução Industrial, Funções Orgânicas..."
                className="w-full pl-9 pr-3 py-2.5 bg-[#090D15] border border-[#2A3348] rounded-xl text-white text-sm outline-none focus:border-indigo-500"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Esse título aparecerá na lista de trilhas e facilitará a busca depois.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">
                Matéria / Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-[#090D15] border border-[#2A3348] rounded-xl text-white text-sm outline-none focus:border-indigo-500"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">
                Descrição (opcional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={200}
                placeholder="Ex: Revisão Fuvest 2ª fase"
                className="w-full p-2.5 bg-[#090D15] border border-[#2A3348] rounded-xl text-white text-sm outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {mode === 'ai' ? (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Conteúdo</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Cole aqui suas anotações, resumo ou tema para gerar os flashcards..."
                  className="w-full p-3 bg-[#090D15] border border-[#2A3348] rounded-xl text-white text-sm outline-none focus:border-indigo-500"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Arquivo/Foto</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    className="hidden"
                    id="file-upload"
                    accept="image/*,.pdf,.txt"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-[#090D15] border border-[#2A3348] rounded-xl text-slate-300 text-sm cursor-pointer hover:border-indigo-500"
                  >
                    <Upload size={16} /> {file ? file.name : 'Selecionar arquivo'}
                  </label>
                  {file && (
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-xs text-slate-400 hover:text-rose-400 cursor-pointer"
                    >
                      Remover
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Dificuldade</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full p-2.5 bg-[#090D15] border border-[#2A3348] rounded-xl text-white text-sm outline-none focus:border-indigo-500"
                  >
                    <option value="fácil">Fácil</option>
                    <option value="média">Média</option>
                    <option value="difícil">Difícil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Número de Cards</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={numCards}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setNumCards(isNaN(val) ? 1 : Math.max(1, Math.min(20, val)));
                    }}
                    className="w-full p-2.5 bg-[#090D15] border border-[#2A3348] rounded-xl text-white text-sm outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-300 uppercase">
                  Cards ({manualCards.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddManualCard}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} /> Adicionar Card
                </button>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {manualCards.map((card, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#090D15] border border-[#2A3348] rounded-xl space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase">
                        Card #{idx + 1}
                      </span>
                      {manualCards.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveManualCard(idx)}
                          className="text-slate-500 hover:text-rose-400 cursor-pointer"
                          aria-label={`Remover card ${idx + 1}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={card.front_content}
                      onChange={(e) => handleUpdateManualCard(idx, 'front_content', e.target.value)}
                      placeholder="Frente (Pergunta ou conceito)"
                      className="w-full px-3 py-2 bg-[#10141D] border border-[#2A3348] rounded-lg text-white text-xs outline-none focus:border-indigo-500"
                    />
                    <textarea
                      value={card.back_content}
                      onChange={(e) => handleUpdateManualCard(idx, 'back_content', e.target.value)}
                      placeholder="Verso (Resposta ou explicação)"
                      rows={2}
                      className="w-full px-3 py-2 bg-[#10141D] border border-[#2A3348] rounded-lg text-white text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 cursor-pointer transition-colors"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : mode === 'ai' ? (
              <>
                <Sparkles size={16} /> Gerar Flashcards
              </>
            ) : (
              <>
                <Plus size={16} /> Salvar Baralho
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
