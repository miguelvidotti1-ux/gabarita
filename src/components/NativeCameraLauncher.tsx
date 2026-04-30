import React, { useRef, useState, useEffect } from 'react';
import { Camera, CheckCircle2, RotateCcw } from 'lucide-react';

interface Props {
  onImageCapture: (file: File) => void;
}

const NativeCameraLauncher = ({ onImageCapture }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);

  const handleCaptureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCapturedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      if (onImageCapture) {
        onImageCapture(file);
      }
      event.target.value = '';
    }
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6">
      {!preview ? (
        <button
          onClick={handleCaptureClick}
          className="group flex flex-col items-center gap-4 bg-white dark:bg-blue-900 p-8 rounded-[2.5rem] border-4 border-dashed border-blue-200 dark:border-blue-800 hover:border-blue-500 transition-all active:scale-95 overflow-hidden"
        >
          <div className="bg-blue-100 dark:bg-blue-800 p-6 rounded-full text-blue-600 dark:text-blue-300 group-hover:scale-110 transition-transform">
            <Camera size={48} />
          </div>
          <div className="text-center">
            <span className="block text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Capturar Redação</span>
            <span className="text-sm font-bold text-slate-400 dark:text-blue-400">Use a câmera do seu celular</span>
          </div>
        </button>
      ) : (
        <div className="w-full max-w-sm space-y-6 overflow-hidden">
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <img
              src={preview}
              alt="Captured preview"
              className="relative w-full aspect-[3/4] object-cover rounded-3xl border-4 border-blue-500 shadow-2xl"
            />
            <div className="absolute top-4 right-4 bg-emerald-500 text-white p-2 rounded-full shadow-lg">
              <CheckCircle2 size={24} />
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => { setPreview(null); setCapturedFile(null); }}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-blue-800 text-slate-600 dark:text-blue-200 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all"
            >
              <RotateCcw size={18} />
              Refazer
            </button>
          </div>
          
          <p className="text-center text-xs font-black text-slate-400 dark:text-blue-400 uppercase tracking-widest px-4 truncate w-full">
             {capturedFile?.name} • Pronta para análise
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default NativeCameraLauncher;
