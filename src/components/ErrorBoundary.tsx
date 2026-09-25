import * as React from 'react';
import { AlertCircle, RefreshCw, Trash2, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary capturou erro:', error, errorInfo);
  }

  handleClearAndReload = async () => {
    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.unregister()));
      }
    } catch (e) {
      console.warn('Erro ao limpar caches:', e);
    }
    try {
      localStorage.removeItem('vestibularpro_session_user');
      localStorage.removeItem('vestibularpro_authenticated');
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      let errorMessage = 'Ocorreu um erro inesperado ao carregar a página.';
      let isFirestoreError = false;

      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error && parsed.operationType) {
            isFirestoreError = true;
            errorMessage = `Erro no banco de dados: ${parsed.error}`;
          }
        }
      } catch (e) {
        if (this.state.error?.message) {
          errorMessage = this.state.error.message;
        }
      }

      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#07090E] text-[#FAFAFA] p-4">
          <div className="max-w-md w-full bg-[#131722] p-8 rounded-3xl border border-white/10 shadow-2xl text-center space-y-6">
            <div className="bg-red-500/10 border border-red-500/20 w-20 h-20 rounded-2xl flex items-center justify-center text-red-400 mx-auto">
              <AlertCircle size={44} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Ops! Algo deu errado.</h2>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">{errorMessage}</p>
              {isFirestoreError && (
                <p className="text-xs text-blue-400/80 mt-3 italic">
                  Isso pode ser uma intermitência de conexão com o banco de dados.
                </p>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <button 
                type="button"
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 px-4 rounded-xl font-bold hover:bg-blue-500 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-blue-600/25"
              >
                <RefreshCw size={18} />
                <span>Recarregar Aplicativo</span>
              </button>

              <button 
                type="button"
                onClick={this.handleClearAndReload}
                className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-slate-300 py-3 px-4 rounded-xl font-semibold hover:bg-white/10 hover:text-white active:scale-[0.98] transition-all cursor-pointer text-xs"
              >
                <Trash2 size={16} />
                <span>Limpar Cache e Reiniciar</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
