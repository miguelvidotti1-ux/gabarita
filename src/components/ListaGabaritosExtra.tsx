import React from 'react';
import { Download } from 'lucide-react';

const GABARITOS = [
  { cd: "CD1", cor: "Azul", url: "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D3_CD1.pdf" },
  { cd: "CD2", cor: "Amarelo", url: "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D3_CD2.pdf" },
  { cd: "CD3", cor: "Branco", url: "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D3_CD3.pdf" },
  { cd: "CD4", cor: "Verde", url: "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D3_CD4.pdf" },
  { cd: "CD9", cor: "Laranja", url: "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D3_CD9.pdf" },
];

export default function ListaGabaritosExtra() {
  return (
    <div className="space-y-6">
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-black text-[var(--text-primary)] mb-4">Gabaritos Extra (ENEM 2025 - D3)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--card-border)] text-[var(--text-secondary)]">
                <th className="text-left p-3 font-black">Caderno</th>
                <th className="text-left p-3 font-black">Cor</th>
                <th className="text-left p-3 font-black text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {GABARITOS.map(g => (
                <tr key={g.cd} className="border-b last:border-b-0 border-[var(--card-border)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]">
                  <td className="p-3 font-bold">{g.cd}</td>
                  <td className="p-3">{g.cor}</td>
                  <td className="p-3 text-right">
                    <a 
                      href={g.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-indigo-500 hover:text-indigo-600 font-bold text-xs bg-indigo-50 dark:bg-indigo-950/20 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <Download size={14} /> Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
