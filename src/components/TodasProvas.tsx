import * as React from 'react';
import { Vestibular } from '../types';
import { FileText, Download, Play, X, Loader2, Calendar, Palette, Check } from 'lucide-react';
import { VESTIBULARES_DATA } from '../constants';
import { Question } from '../services/geminiService';
import { ENEM_2025_DIA1_AZUL } from '../data/enem2025_dia1_azul';
import { PROVAS_LINKS } from '../data/provas_links';

const YEARS = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];

export default function TodasProvas({ onStartQuiz, initialVestibular }: { onStartQuiz: (questions: Question[], isFull: boolean) => void, initialVestibular?: Vestibular }) {
  const [showSelection, setShowSelection] = React.useState(false);
  const [selectionContext, setSelectionContext] = React.useState<{ year: number; type: 'simulate' | 'download'; vestibular: Vestibular } | null>(null);
  const [selectedDay, setSelectedDay] = React.useState<'1' | '2'>('1');
  const [selectedColor, setSelectedColor] = React.useState<string>('Azul');
  
  const [filterYear, setFilterYear] = React.useState<number | 'all'>('all');
  const [filterVestibular, setFilterVestibular] = React.useState<Vestibular | 'all'>(initialVestibular || 'all');

  React.useEffect(() => {
    setFilterVestibular(initialVestibular || 'all');
  }, [initialVestibular]);

  const COLORS = [
    { name: 'Azul', class: 'bg-blue-500' },
    { name: 'Amarelo', class: 'bg-yellow-400' },
    { name: 'Roxo (Libras)', class: 'bg-purple-600' },
    { name: 'Branco', class: 'bg-white border-2 border-slate-200' },
    { name: 'Verde', class: 'bg-green-500' },
    { name: 'Laranja (Braile)', class: 'bg-orange-500' }
  ];

  const isEnemDay2 = selectionContext?.vestibular === Vestibular.ENEM && selectedDay === '2';
  const isItaPhase1 = selectionContext?.vestibular === Vestibular.ITA && selectedDay === '1';
  const isItaPhase2 = selectionContext?.vestibular === Vestibular.ITA && selectedDay === '2';
  const isItaStandardPhase2 = isItaPhase2 && selectionContext?.year >= 2019 && selectionContext?.year <= 2025;
  const isIta2018Phase1 = isItaPhase1 && selectionContext?.year === 2018;
  
  const displayColors = isItaPhase2 && isItaStandardPhase2
    ? [
        { name: 'Matemática', class: 'bg-indigo-600' },
        { name: 'Física', class: 'bg-blue-600' },
        { name: 'Química', class: 'bg-emerald-600' },
        { name: 'Português', class: 'bg-amber-600' },
        { name: 'Redação', class: 'bg-rose-600' }
      ]
    : isIta2018Phase1
      ? [{ name: 'Física', class: 'bg-slate-600' }, { name: 'Português', class: 'bg-slate-600' }]
      : isItaPhase1 || isItaPhase2
        ? [{ name: 'Prova', class: 'bg-slate-600' }]
        : COLORS.map(c => {
        if (c.name === 'Branco' && isEnemDay2) {
          return { ...c, name: 'Cinza', class: 'bg-slate-400' };
        }
        return c;
      });

  React.useEffect(() => {
    if (selectionContext?.vestibular === Vestibular.ITA) {
      if (selectedDay === '2' && selectionContext?.year >= 2019 && selectionContext?.year <= 2025) {
        const itaSubjects = ['Matemática', 'Física', 'Química', 'Português', 'Redação'];
        if (!itaSubjects.includes(selectedColor)) {
          setSelectedColor('Matemática');
        }
      } else if (selectedDay === '1' && selectionContext?.year === 2018) {
        if (selectedColor !== 'Física' && selectedColor !== 'Português') {
          setSelectedColor('Física');
        }
      } else {
        if (selectedColor !== 'Prova') {
          setSelectedColor('Prova');
        }
      }
    } else if (selectionContext?.vestibular === Vestibular.ENEM) {
      if (selectedDay === '2' && selectedColor === 'Branco') {
        setSelectedColor('Cinza');
      } else if (selectedDay === '1' && selectedColor === 'Cinza') {
        setSelectedColor('Branco');
      }
    } else if (selectedColor === 'Prova') {
      // Reset to default if switching from ITA to another vestibular
      setSelectedColor('Azul');
    }
  }, [selectedDay, selectionContext, selectedColor]);

  const filteredYears = filterYear === 'all' ? YEARS : YEARS.filter(y => y === filterYear);
  const filteredVestibulares = filterVestibular === 'all' ? Object.values(Vestibular) : [filterVestibular];

  const handleSimulate = (year: number, vestibular: Vestibular) => {
    setSelectionContext({ year, type: 'simulate', vestibular });
    setShowSelection(true);
  };

  const handleDownload = (year: number, vestibular: Vestibular) => {
    setSelectionContext({ year, type: 'download', vestibular });
    setShowSelection(true);
  };

  const confirmSelection = () => {
    if (!selectionContext) return;
    
    const { year, type, vestibular } = selectionContext;

    if (type === 'simulate') {
      if (vestibular === Vestibular.ENEM && year === 2025 && selectedDay === '1' && selectedColor === 'Azul') {
        onStartQuiz(ENEM_2025_DIA1_AZUL, true);
      } else {
        const diaOuFase = vestibular === Vestibular.ITA ? 'ª Fase' : 'º Dia';
        alert(`Iniciando simulação da prova ${vestibular} ${year} - ${selectedDay}${diaOuFase} (${selectedColor}). Boa sorte!`);
      }
    } else {
      const linkKey = `${vestibular}_${year}_${selectedDay}_${selectedColor}`;
      const realUrl = PROVAS_LINKS[linkKey];

      if (realUrl) {
        window.open(realUrl, '_blank');
      } else {
        const titleSuffix = vestibular === Vestibular.ITA ? 'Fase' : 'Dia';
        const fileName = `${vestibular}_${year}_${titleSuffix}${selectedDay}_${selectedColor}.pdf`;
        const diaOuFase = vestibular === Vestibular.ITA ? 'ª Fase' : 'º Dia';
        const dummyContent = `Este é um arquivo PDF simulado para a prova ${vestibular} ${year} - ${selectedDay}${diaOuFase} (${selectedColor}).\n\nLink oficial não encontrado.`;
        const blob = new Blob([dummyContent], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }
    
    setShowSelection(false);
    setSelectionContext(null);
  };


  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Todas as Provas</h1>
          <p className="text-slate-500 dark:text-blue-300">Acesse as últimas 8 edições oficiais com gabarito e resolução.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white dark:bg-blue-900 p-4 rounded-2xl border dark:border-blue-800 shadow-sm">
        <div className="flex-1">
          <label className="block text-sm font-bold text-slate-700 dark:text-blue-200 mb-2">Filtrar por Ano</label>
          <select 
            value={filterYear} 
            onChange={(e) => setFilterYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="w-full bg-slate-50 dark:bg-blue-950 border border-slate-200 dark:border-blue-800 rounded-xl px-4 py-3 text-slate-700 dark:text-blue-200"
          >
            <option value="all">Todos os Anos</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-bold text-slate-700 dark:text-blue-200 mb-2">Filtrar por Vestibular</label>
          <select 
            value={filterVestibular} 
            onChange={(e) => setFilterVestibular(e.target.value === 'all' ? 'all' : e.target.value as Vestibular)}
            className="w-full bg-slate-50 dark:bg-blue-950 border border-slate-200 dark:border-blue-800 rounded-xl px-4 py-3 text-slate-700 dark:text-blue-200"
          >
            <option value="all">Todos os Vestibulares</option>
            {Object.values(Vestibular).map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredVestibulares.flatMap(vestibular => 
          filteredYears.map((year) => (
            <div key={`${vestibular}-${year}`} className="bg-white dark:bg-blue-900 rounded-2xl border dark:border-blue-800 shadow-sm hover:shadow-md transition-all overflow-hidden group">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-blue-50 dark:bg-blue-800 p-3 rounded-xl text-slate-600 dark:text-blue-300 group-hover:bg-blue-100 dark:group-hover:bg-blue-700 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">
                    <FileText size={24} />
                  </div>
                  <span className="text-2xl font-black text-slate-300 dark:text-blue-950 group-hover:text-blue-200 dark:group-hover:text-blue-800 transition-colors">{year}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 truncate" title={`${vestibular} ${year}`}>{vestibular} {year}</h3>
                <p className="text-sm text-slate-500 dark:text-blue-300 mb-6 line-clamp-2">Prova completa com 90 questões e redação.</p>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => handleSimulate(year, vestibular)}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                  >
                    <Play size={16} />
                    <span>Simular Prova</span>
                  </button>
                  <button 
                    onClick={() => handleDownload(year, vestibular)}
                    className="w-full flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-800 text-slate-600 dark:text-blue-300 py-3 rounded-xl font-bold hover:bg-blue-100 dark:hover:bg-blue-700 transition-colors"
                  >
                    <Download size={16} />
                    <span>Baixar PDF</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showSelection && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-blue-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-blue-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 border dark:border-blue-800">
            <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">Configurar Prova</h2>
              <button onClick={() => setShowSelection(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              <section className="space-y-4">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Calendar size={18} className="text-blue-600" />
                  {selectionContext?.vestibular === Vestibular.ITA ? 'Selecione a Fase' : 'Selecione o Dia'}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {['1', '2'].map((day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day as '1' | '2')}
                      className={`
                        py-4 rounded-2xl font-bold transition-all border-2 flex items-center justify-center gap-2
                        ${selectedDay === day 
                          ? 'bg-blue-50 dark:bg-blue-800 border-blue-600 text-blue-600 dark:text-blue-200' 
                          : 'bg-white dark:bg-blue-950 border-slate-100 dark:border-blue-800 text-slate-500 dark:text-blue-400 hover:border-slate-200 dark:hover:border-blue-700'}
                      `}
                    >
                      {selectedDay === day && <Check size={16} />}
                      {day}{selectionContext?.vestibular === Vestibular.ITA ? 'ª Fase' : 'º Dia'}
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  {(isItaPhase1 || isItaPhase2) ? <FileText size={18} className="text-blue-600" /> : <Palette size={18} className="text-blue-600" />}
                  {isItaStandardPhase2 || isIta2018Phase1 ? 'Selecione a Prova' : 'Selecione a Cor'}
                </h3>
                <div className={(!isItaStandardPhase2 && !isIta2018Phase1 && (isItaPhase1 || isItaPhase2)) ? "flex justify-center" : "grid grid-cols-2 gap-3"}>
                  {displayColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`
                        flex items-center gap-3 p-3 rounded-xl border-2 transition-all
                        ${selectedColor === color.name 
                          ? 'bg-blue-50 dark:bg-blue-800 border-blue-600' 
                          : 'bg-white dark:bg-blue-950 border-slate-100 dark:border-blue-800 hover:border-slate-200 dark:hover:border-blue-700'}
                      `}
                    >
                      <div className={`w-6 h-6 rounded-full ${color.class} border border-slate-200`}></div>
                      <span className={`text-sm font-bold flex-1 text-left ${selectedColor === color.name ? 'text-blue-600 dark:text-blue-200' : 'text-slate-600 dark:text-blue-400'}`}>
                        {color.name}
                      </span>
                      {selectedColor === color.name && <Check size={16} className="text-blue-600" />}
                    </button>
                  ))}
                </div>
              </section>

              <button 
                onClick={confirmSelection}
                className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none flex items-center justify-center gap-2"
              >
                {selectionContext?.type === 'simulate' ? <Play size={18} /> : <Download size={18} />}
                {selectionContext?.type === 'simulate' ? 'Iniciar Simulado' : 'Baixar Prova'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
