import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface FiltroGlobal {
  materia: string;
  vestibular?: string;
  periodo?: string;
}

export interface GraficosContextType {
  filtroGlobal: FiltroGlobal;
  atualizarFiltro: (novoFiltro: Partial<FiltroGlobal>) => void;
  resetarFiltros: () => void;
}

const filtroInicialPadrao: FiltroGlobal = {
  materia: 'Todas',
  vestibular: 'Todos',
  periodo: 'all',
};

const GraficosContext = createContext<GraficosContextType | undefined>(undefined);

export const GraficosProvider: React.FC<{ children: ReactNode; initialFilters?: Partial<FiltroGlobal> }> = ({
  children,
  initialFilters,
}) => {
  const [filtroGlobal, setFiltroGlobal] = useState<FiltroGlobal>({
    ...filtroInicialPadrao,
    ...initialFilters,
  });

  const atualizarFiltro = (novoFiltro: Partial<FiltroGlobal>) => {
    setFiltroGlobal((prev) => ({
      ...prev,
      ...novoFiltro,
    }));
  };

  const resetarFiltros = () => {
    setFiltroGlobal(filtroInicialPadrao);
  };

  return (
    <GraficosContext.Provider value={{ filtroGlobal, atualizarFiltro, resetarFiltros }}>
      {children}
    </GraficosContext.Provider>
  );
};

export const useGraficos = (): GraficosContextType => {
  const context = useContext(GraficosContext);
  if (!context) {
    // Fallback gracioso para evitar quebrar caso renderizado sem Provider
    return {
      filtroGlobal: filtroInicialPadrao,
      atualizarFiltro: () => {},
      resetarFiltros: () => {},
    };
  }
  return context;
};

export default GraficosContext;
