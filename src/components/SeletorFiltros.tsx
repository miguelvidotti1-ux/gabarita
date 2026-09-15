import React from 'react';
import { useGraficos } from './GraficosContext';
import { Filter } from 'lucide-react';

interface SeletorFiltrosProps {
  className?: string;
  showIcon?: boolean;
}

export const SeletorFiltros: React.FC<SeletorFiltrosProps> = ({ className = '', showIcon = true }) => {
  const { filtroGlobal, atualizarFiltro } = useGraficos();

  return (
    <div className={`flex items-center gap-2 text-sm font-medium ${className}`}>
      {showIcon && <Filter size={16} className="text-[var(--primary)] shrink-0" />}
      <label htmlFor="seletor-materia" className="text-[var(--text-muted)] font-semibold whitespace-nowrap">
        Matéria:
      </label>
      <select
        id="seletor-materia"
        value={filtroGlobal.materia}
        onChange={(e) => atualizarFiltro({ materia: e.target.value })}
        className="bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-light)] rounded-lg px-3 py-1.5 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all cursor-pointer shadow-sm"
      >
        <option value="Todas">Todas</option>
        <option value="Biologia">Biologia</option>
        <option value="Matemática">Matemática</option>
        <option value="Física">Física</option>
        <option value="Química">Química</option>
        <option value="Português">Português</option>
        <option value="História">História</option>
        <option value="Geografia">Geografia</option>
        <option value="Filosofia">Filosofia</option>
      </select>
    </div>
  );
};

export default SeletorFiltros;
