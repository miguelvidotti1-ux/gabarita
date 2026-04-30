import * as React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

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
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = 'Ocorreu um erro inesperado.';
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
        // Not a JSON error message
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-blue-950 p-4">
          <div className="max-w-md w-full bg-white dark:bg-blue-900 p-8 rounded-3xl border dark:border-blue-800 shadow-xl text-center space-y-6">
            <div className="bg-red-100 dark:bg-red-900/30 w-20 h-20 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400 mx-auto">
              <AlertCircle size={48} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white">Ops! Algo deu errado.</h2>
              <p className="text-slate-500 dark:text-blue-300 mt-2">{errorMessage}</p>
              {isFirestoreError && (
                <p className="text-xs text-slate-400 dark:text-blue-400 mt-4 italic">
                  Isso pode ser um problema de permissão ou conexão. Verifique sua conta e tente novamente.
                </p>
              )}
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all"
            >
              <RefreshCw size={20} />
              <span>Recarregar Página</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
