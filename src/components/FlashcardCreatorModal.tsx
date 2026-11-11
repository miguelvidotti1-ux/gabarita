import React, { useState } from 'react';
import { X, Upload, Sparkles, Loader2, FileText, Image as ImageIcon } from 'lucide-react';

interface FlashcardCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (cards: any[]) => void;
}

export const FlashcardCreatorModal: React.FC<FlashcardCreatorModalProps> = ({ isOpen, onClose, onCreated }) => {
  const [prompt, setPrompt] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [difficulty, setDifficulty] = useState('média');
  const [numCards, setNumCards] = useState(5);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('difficulty', difficulty);
    formData.append('numCards', numCards.toString());
    if (file) formData.append('file', file);

    try {
      const response = await fetch('/api/flashcards/generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Falha na geração');
      
      const data = await response.json();
      onCreated(data.cards);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao gerar flashcards');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#10141D] border border-[#2A3348] rounded-2xl p-6 w-full max-w-lg shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="text-indigo-500" /> Criar Flashcards
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Conteúdo</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Cole aqui suas anotações..."
              className="w-full p-3 bg-[#090D15] border border-[#2A3348] rounded-xl text-white text-sm outline-none focus:border-indigo-500"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Arquivo/Foto</label>
            <div className="flex items-center gap-2">
              <input 
                type="file" 
                onChange={(e) => e.target.files && setFile(e.target.files[0])}
                className="hidden"
                id="file-upload"
                accept="image/*,.pdf,.txt"
              />
              <label htmlFor="file-upload" className="flex items-center gap-2 px-4 py-2 bg-[#090D15] border border-[#2A3348] rounded-xl text-slate-300 text-sm cursor-pointer hover:border-indigo-500">
                <Upload size={16} /> {file ? file.name : 'Selecionar arquivo'}
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Dificuldade</label>
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-2 bg-[#090D15] border border-[#2A3348] rounded-xl text-white text-sm"
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
                  const val = parseInt(e.target.value);
                  setNumCards(isNaN(val) ? 1 : Math.max(1, Math.min(20, val)));
                }}
                className="w-full p-2 bg-[#090D15] border border-[#2A3348] rounded-xl text-white text-sm"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={16} /> Gerar Flashcards</>}
          </button>
        </form>
      </div>
    </div>
  );
};
