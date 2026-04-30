import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, X, CheckCircle2 } from 'lucide-react';

interface Props {
  onFilesSelect?: (files: File[]) => void;
}

const GalleryPicker = ({ onFilesSelect }: Props) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(newPreviewUrls);
    setFiles(newFiles);
    onFilesSelect?.(newFiles);
  };

  const clearSelection = () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFilesSelect?.([]);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6">
      {previewUrls.length === 0 ? (
        <button 
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group flex flex-col items-center gap-4 bg-white dark:bg-blue-900 p-8 rounded-[2.5rem] border-4 border-dashed border-blue-200 dark:border-blue-800 hover:border-blue-500 transition-all active:scale-95 w-full max-w-md overflow-hidden"
        >
          <div className="bg-blue-50 dark:bg-blue-800 p-6 rounded-full text-blue-600 dark:text-blue-200 group-hover:scale-110 transition-transform">
            <Upload size={48} />
          </div>
          <div className="text-center">
            <span className="block text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Escolher da Galeria</span>
            <span className="text-sm font-bold text-slate-400 dark:text-blue-400">Selecione fotos ou scans da sua redação</span>
          </div>
        </button>
      ) : (
        <div className="w-full max-w-md space-y-6 overflow-hidden">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black text-blue-600 dark:text-blue-300 uppercase tracking-widest flex items-center gap-2 truncate flex-1 min-w-0">
              <CheckCircle2 size={14} className="shrink-0" />
              <span className="truncate">{files.length} {files.length === 1 ? 'Arquivo Selecionado' : 'Arquivos Selecionados'}</span>
            </h3>
            <button 
              onClick={clearSelection}
              className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline flex items-center gap-1"
            >
              <X size={12} />
              Limpar
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative aspect-square group">
                <img
                  src={url}
                  alt={`Selected image ${index + 1}`}
                  className="w-full h-full object-cover rounded-2xl border-2 border-slate-200 dark:border-blue-800 group-hover:border-blue-500 transition-all"
                />
                <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
              </div>
            ))}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 dark:border-blue-800 rounded-2xl text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-all bg-slate-50 dark:bg-blue-950"
            >
              <ImageIcon size={24} />
              <span className="text-[10px] font-black uppercase">Adicionar</span>
            </button>
          </div>

          <p className="text-center text-[10px] font-bold text-slate-400 dark:text-blue-400 leading-relaxed max-w-[280px] mx-auto">
            Suas imagens serão processadas por IA para extração de texto e correção automática.
          </p>
        </div>
      )}

      <input
        id="gallery-picker-input"
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
};

export default GalleryPicker;
