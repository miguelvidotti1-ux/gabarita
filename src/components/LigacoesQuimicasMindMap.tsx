import React, { useState } from 'react';
import { Sparkles, Zap, ArrowRight, CheckCircle2, RefreshCw, HelpCircle, Info, ShieldCheck } from 'lucide-react';

export default function LigacoesQuimicasMindMap() {
  const [activeBond, setActiveBond] = useState<'ionica' | 'covalente' | 'metalica' | null>('ionica');
  const [simElement1, setSimElement1] = useState<'metal' | 'ametal' | 'hidrogenio'>('metal');
  const [simElement2, setSimElement2] = useState<'metal' | 'ametal' | 'hidrogenio'>('ametal');

  const getSimulationResult = () => {
    if (simElement1 === 'metal' && simElement2 === 'ametal') {
      return {
        type: 'Ligação Iônica',
        description: 'O Metal doa elétrons (cátion) para o Ametal (ânion). Atração eletrostática forte!',
        color: 'from-blue-500 to-indigo-600',
        textColor: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-950/50',
        borderColor: 'border-blue-200 dark:border-blue-800',
        example: 'NaCl (Sal de Cozinha), MgO'
      };
    }
    if (simElement1 === 'ametal' && simElement2 === 'metal') {
      return {
        type: 'Ligação Iônica',
        description: 'O Metal doa elétrons para o Ametal. Formação de íons de cargas opostas.',
        color: 'from-blue-500 to-indigo-600',
        textColor: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-950/50',
        borderColor: 'border-blue-200 dark:border-blue-800',
        example: 'CaCl₂, LiF'
      };
    }
    if ((simElement1 === 'ametal' || simElement1 === 'hidrogenio') && (simElement2 === 'ametal' || simElement2 === 'hidrogenio')) {
      return {
        type: 'Ligação Covalente',
        description: 'Compartilhamento de pares de elétrons entre ametais/hidrogênio para atingir o octeto.',
        color: 'from-rose-500 to-pink-600',
        textColor: 'text-rose-600 dark:text-rose-400',
        bgColor: 'bg-rose-50 dark:bg-rose-950/50',
        borderColor: 'border-rose-200 dark:border-rose-800',
        example: 'H₂O (Água), CO₂, O₂, CH₄'
      };
    }
    if (simElement1 === 'metal' && simElement2 === 'metal') {
      return {
        type: 'Ligação Metálica',
        description: 'Cátions metálicos imersos em um "mar de elétrons libres" deslocalizados.',
        color: 'from-amber-500 to-orange-600',
        textColor: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-amber-50 dark:bg-amber-950/50',
        borderColor: 'border-amber-200 dark:border-amber-800',
        example: 'Fe (Ferro), Cu (Cobre), Au (Ouro), Aço'
      };
    }
    return {
      type: 'Caso Especial',
      description: 'Ligas metálicas ou interações atômicas específicas.',
      color: 'from-slate-500 to-gray-600',
      textColor: 'text-slate-600 dark:text-slate-400',
      bgColor: 'bg-slate-50 dark:bg-slate-900',
      borderColor: 'border-slate-200 dark:border-slate-800',
      example: 'Ligas metálicas complexas'
    };
  };

  const simResult = getSimulationResult();

  return (
    <div className="space-y-8 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl font-sans text-slate-800 dark:text-slate-100">
      
      {/* TÍTULO PRINCIPAL DO MAPA MENTAL */}
      <div className="text-center space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-300/50 dark:border-amber-500/30">
          <Sparkles size={14} className="text-amber-500" />
          <span>Mapa Mental Interativo • Química</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          A Busca pela Estabilidade: <span className="bg-gradient-to-r from-blue-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">Guia das Ligações Químicas</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Compreenda como os átomos ganham, perdem ou compartilham elétrons para atingir a estabilidade dos gases nobres.
        </p>
      </div>

      {/* SEÇÃO SUPERIOR: REGRA DO OCTETO & GASES NOBRES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Regra do Octeto */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-blue-200/80 dark:border-blue-900/60 shadow-sm hover:shadow-md transition-all space-y-3 relative overflow-hidden group">
          <div className="w-2 h-full bg-blue-500 absolute left-0 top-0"></div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black text-sm">
            <ShieldCheck size={18} />
            <h3>A Regra do Octeto</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Átomos <strong className="text-blue-600 dark:text-blue-400">ganham, perdem ou compartilham</strong> elétrons para atingir <strong className="text-slate-900 dark:text-white">8 elétrons</strong> na camada de valência (ou 2, como o Hélio).
          </p>
        </div>

        {/* Card 2: Gases Nobres */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-amber-200/80 dark:border-amber-900/60 shadow-sm hover:shadow-md transition-all space-y-3 relative overflow-hidden">
          <div className="w-2 h-full bg-amber-500 absolute left-0 top-0"></div>
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-sm">
            <span className="text-base">👑</span>
            <h3>Gases Nobres: A Realeza</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Elementos do <strong className="text-amber-600 dark:text-amber-400">Grupo 18</strong> já possuem 8 elétrons de valência (estáveis sozinhos) e servem de modelo para os demais átomos.
          </p>
        </div>

        {/* Card 3: Exceções de Estabilidade */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/60 shadow-sm hover:shadow-md transition-all space-y-3 relative overflow-hidden">
          <div className="w-2 h-full bg-emerald-500 absolute left-0 top-0"></div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-sm">
            <Info size={18} />
            <h3>Exceções de Estabilidade</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            O <strong className="text-emerald-600 dark:text-emerald-400">Hidrogênio (H)</strong> e o <strong className="text-emerald-600 dark:text-emerald-400">Lítio (Li)</strong> estabilizam-se com apenas <strong className="text-slate-900 dark:text-white">2 elétrons</strong>, assemelhando-se ao gás Hélio (He).
          </p>
        </div>
      </div>

      {/* TITULO SEÇÃO CENTRAL */}
      <div className="text-center pt-2">
        <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-wider border border-slate-300 dark:border-slate-700 inline-block">
          Os Três Caminhos da Conexão
        </span>
      </div>

      {/* OS TRÊS CAMINHOS DA CONEXÃO - CARDS DETALHADOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LIGAÇÃO IÔNICA */}
        <div 
          onClick={() => setActiveBond('ionica')}
          className={`bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 transition-all cursor-pointer flex flex-col justify-between ${
            activeBond === 'ionica' 
              ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-lg scale-[1.02]' 
              : 'border-slate-200 dark:border-slate-800 hover:border-blue-300'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-black px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                Transferência
              </span>
              <span className="text-xs font-bold text-slate-400">01</span>
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              Ligação Iônica
            </h3>

            {/* Ilustração Visual SVG */}
            <div className="bg-blue-50/80 dark:bg-blue-950/40 p-4 rounded-xl border border-blue-100 dark:border-blue-900/40 flex items-center justify-center min-h-[110px]">
              <svg width="100%" height="80" viewBox="0 0 200 80" className="max-w-[180px]">
                {/* Doador (Metal) */}
                <circle cx="45" cy="40" r="24" stroke="#3b82f6" strokeWidth="2" fill="none" />
                <circle cx="45" cy="40" r="8" fill="#3b82f6" />
                <text x="45" y="44" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Na⁺</text>
                
                {/* Seta de Transferência de e- */}
                <path d="M 72 32 Q 100 15 128 32" stroke="#ef4444" strokeWidth="2" fill="none" strokeDasharray="3 3" />
                <polygon points="128,32 120,28 122,35" fill="#ef4444" />
                <circle cx="100" cy="18" r="4" fill="#ef4444" />
                
                {/* Receptor (Ametal) */}
                <circle cx="155" cy="40" r="28" stroke="#ef4444" strokeWidth="2" fill="none" />
                <circle cx="155" cy="40" r="10" fill="#ef4444" />
                <text x="155" y="44" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Cl⁻</text>
              </svg>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg font-semibold">
                <span>Participantes:</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">Metal (Doador) + Ametal (Receptor)</span>
              </div>
              <p className="leading-relaxed">
                Ocorre a <strong className="text-slate-900 dark:text-white">transferência definitiva de elétrons</strong>. Formam-se íons de cargas opostas (cátions e ânions) que se atraem por <strong className="text-blue-600 dark:text-blue-400">forças eletrostáticas</strong>.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Exemplo: NaCl, MgO</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
              Detalhes <ArrowRight size={12} />
            </span>
          </div>
        </div>

        {/* LIGAÇÃO COVALENTE */}
        <div 
          onClick={() => setActiveBond('covalente')}
          className={`bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 transition-all cursor-pointer flex flex-col justify-between ${
            activeBond === 'covalente' 
              ? 'border-rose-500 ring-4 ring-rose-500/10 shadow-lg scale-[1.02]' 
              : 'border-slate-200 dark:border-slate-800 hover:border-rose-300'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-black px-3 py-1 rounded-full border border-rose-200 dark:border-rose-800">
                Compartilhamento
              </span>
              <span className="text-xs font-bold text-slate-400">02</span>
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              Ligação Covalente
            </h3>

            {/* Ilustração Visual SVG */}
            <div className="bg-rose-50/80 dark:bg-rose-950/40 p-4 rounded-xl border border-rose-100 dark:border-rose-900/40 flex items-center justify-center min-h-[110px]">
              <svg width="100%" height="80" viewBox="0 0 200 80" className="max-w-[180px]">
                {/* Átomo 1 */}
                <circle cx="75" cy="40" r="30" stroke="#f43f5e" strokeWidth="2" fill="#f43f5e" fillOpacity="0.15" />
                <circle cx="75" cy="40" r="6" fill="#f43f5e" />
                
                {/* Átomo 2 */}
                <circle cx="125" cy="40" r="30" stroke="#f43f5e" strokeWidth="2" fill="#f43f5e" fillOpacity="0.15" />
                <circle cx="125" cy="40" r="6" fill="#f43f5e" />

                {/* Elétrons Compartilhados no centro */}
                <circle cx="95" cy="40" r="3.5" fill="#3b82f6" />
                <circle cx="105" cy="40" r="3.5" fill="#f43f5e" />
              </svg>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg font-semibold">
                <span>Participantes:</span>
                <span className="text-rose-600 dark:text-rose-400 font-bold">Ametal + Ametal</span>
              </div>
              <p className="leading-relaxed">
                Ametais <strong className="text-slate-900 dark:text-white">compartilham pares de elétrons</strong> de forma generosa para que ambos alcancem o octeto simultaneamente.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Exemplo: H₂O, CO₂, O₂</span>
            <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
              Detalhes <ArrowRight size={12} />
            </span>
          </div>
        </div>

        {/* LIGAÇÃO METÁLICA */}
        <div 
          onClick={() => setActiveBond('metalica')}
          className={`bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 transition-all cursor-pointer flex flex-col justify-between ${
            activeBond === 'metalica' 
              ? 'border-amber-500 ring-4 ring-amber-500/10 shadow-lg scale-[1.02]' 
              : 'border-slate-200 dark:border-slate-800 hover:border-amber-300'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-black px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                Mar de Elétrons
              </span>
              <span className="text-xs font-bold text-slate-400">03</span>
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              Ligação Metálica
            </h3>

            {/* Ilustração Visual SVG */}
            <div className="bg-amber-50/80 dark:bg-amber-950/40 p-4 rounded-xl border border-amber-100 dark:border-amber-900/40 flex items-center justify-center min-h-[110px]">
              <svg width="100%" height="80" viewBox="0 0 200 80" className="max-w-[180px]">
                {/* Nuvem de elétrons */}
                <rect x="20" y="15" width="160" height="50" rx="15" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
                
                {/* Cátions metálicos */}
                <circle cx="50" cy="32" r="10" fill="#f59e0b" />
                <text x="50" y="35" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">+</text>

                <circle cx="100" cy="32" r="10" fill="#f59e0b" />
                <text x="100" y="35" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">+</text>

                <circle cx="150" cy="32" r="10" fill="#f59e0b" />
                <text x="150" y="35" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">+</text>

                <circle cx="75" cy="50" r="10" fill="#f59e0b" />
                <text x="75" y="53" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">+</text>

                <circle cx="125" cy="50" r="10" fill="#f59e0b" />
                <text x="125" y="53" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">+</text>

                {/* Elétrons livres flutuantes */}
                <circle cx="35" cy="25" r="2.5" fill="#ef4444" />
                <circle cx="85" cy="22" r="2.5" fill="#ef4444" />
                <circle cx="135" cy="22" r="2.5" fill="#ef4444" />
                <circle cx="60" cy="58" r="2.5" fill="#ef4444" />
                <circle cx="110" cy="58" r="2.5" fill="#ef4444" />
                <circle cx="160" cy="52" r="2.5" fill="#ef4444" />
              </svg>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg font-semibold">
                <span>Participantes:</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">Metal + Metal</span>
              </div>
              <p className="leading-relaxed">
                Cátions metálicos ficam imersos em uma <strong className="text-amber-600 dark:text-amber-400">"nuvem/mar" de elétrons livres</strong>, o que explica a alta condutividade térmica e elétrica dos metais.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Exemplo: Fe, Cu, Au, Aço</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
              Detalhes <ArrowRight size={12} />
            </span>
          </div>
        </div>

      </div>

      {/* TABELA DE COMPARAÇÃO RÁPIDA */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500/10 p-2 rounded-xl text-blue-600 dark:text-blue-400">
            <Zap size={18} />
          </div>
          <div>
            <h3 className="font-black text-slate-900 dark:text-white text-base">Tabela de Comparação Rápida</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Resumo essencial para acelerar sua revisão para o vestibular</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-black uppercase text-[11px] tracking-wider">
                <th className="p-3 rounded-l-xl">Tipo de Ligação</th>
                <th className="p-3">Participantes</th>
                <th className="p-3">O que ocorre com o Elétron?</th>
                <th className="p-3 rounded-r-xl">Propriedades Físicas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr className={`hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-colors ${activeBond === 'ionica' ? 'bg-blue-50/80 dark:bg-blue-950/40 font-bold' : ''}`}>
                <td className="p-3 font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  Iônica
                </td>
                <td className="p-3 text-slate-700 dark:text-slate-300 font-semibold">Metal + Ametal</td>
                <td className="p-3 text-slate-600 dark:text-slate-300">
                  <strong className="text-blue-600 dark:text-blue-400">Transferência</strong> (um doa elétrons, o outro recebe)
                </td>
                <td className="p-3 text-slate-500 dark:text-slate-400">
                  Altos pontos de fusão/ebulição; conduzem eletricidade quando fundidos ou dissolvidos em água.
                </td>
              </tr>
              <tr className={`hover:bg-rose-50/50 dark:hover:bg-rose-950/30 transition-colors ${activeBond === 'covalente' ? 'bg-rose-50/80 dark:bg-rose-950/40 font-bold' : ''}`}>
                <td className="p-3 font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  Covalente
                </td>
                <td className="p-3 text-slate-700 dark:text-slate-300 font-semibold">Ametal + Ametal (ou H)</td>
                <td className="p-3 text-slate-600 dark:text-slate-300">
                  <strong className="text-rose-600 dark:text-rose-400">Compartilhamento</strong> de elétrons em pares
                </td>
                <td className="p-3 text-slate-500 dark:text-slate-400">
                  Pontos de fusão moderados/baixos; maus condutores elétricos (isolantes térmicos e elétricos).
                </td>
              </tr>
              <tr className={`hover:bg-amber-50/50 dark:hover:bg-amber-950/30 transition-colors ${activeBond === 'metalica' ? 'bg-amber-50/80 dark:bg-amber-950/40 font-bold' : ''}`}>
                <td className="p-3 font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  Metálica
                </td>
                <td className="p-3 text-slate-700 dark:text-slate-300 font-semibold">Metal + Metal</td>
                <td className="p-3 text-slate-600 dark:text-slate-300">
                  <strong className="text-amber-600 dark:text-amber-400">Elétrons livres</strong> (Mar de elétrons deslocalizados)
                </td>
                <td className="p-3 text-slate-500 dark:text-slate-400">
                  Altíssima condutividade elétrica e térmica; ductilidade (fios) e maleabilidade (chapas).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SIMULADOR INTERATIVO RÁPIDO */}
      <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-2xl p-6 space-y-4 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <HelpCircle size={20} className="text-amber-400" />
            <h3 className="font-bold text-sm sm:text-base">Simulador de Ligações Químicas</h3>
          </div>
          <span className="text-xs text-slate-400">Escolha dois tipos de elementos para simular a ligação:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Elemento 1 */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Elemento 1</label>
            <div className="flex gap-2">
              {[
                { id: 'metal', label: 'Metal (ex: Na, Fe)' },
                { id: 'ametal', label: 'Ametal (ex: Cl, O)' },
                { id: 'hidrogenio', label: 'Hidrogênio (H)' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setSimElement1(item.id as any)}
                  className={`flex-1 py-2 px-2 text-[11px] font-bold rounded-xl border transition-all ${
                    simElement1 === item.id
                      ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Elemento 2 */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Elemento 2</label>
            <div className="flex gap-2">
              {[
                { id: 'metal', label: 'Metal (ex: K, Cu)' },
                { id: 'ametal', label: 'Ametal (ex: F, N)' },
                { id: 'hidrogenio', label: 'Hidrogênio (H)' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setSimElement2(item.id as any)}
                  className={`flex-1 py-2 px-2 text-[11px] font-bold rounded-xl border transition-all ${
                    simElement2 === item.id
                      ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resultado da Simulação */}
        <div className={`p-4 rounded-xl border ${simResult.bgColor} ${simResult.borderColor} space-y-2 mt-4 transition-all`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-black ${simResult.textColor} flex items-center gap-1.5`}>
              <CheckCircle2 size={16} /> Resultado: {simResult.type}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900/60 text-slate-300">
              Exemplos: {simResult.example}
            </span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
            {simResult.description}
          </p>
        </div>
      </div>

    </div>
  );
}
