import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, Plus, Trash2, Bell, Info, 
  Clock, AlertTriangle, ChevronLeft, ChevronRight, GraduationCap, 
  Search, CalendarDays, Archive, Bookmark, RefreshCw, Sparkles, AlertCircle,
  MapPin, Map, Navigation, ExternalLink, Car
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  vestibularEventService, VestibularEvent, VestibularList 
} from '../services/vestibularEventService';

interface ExamVenue {
  name: string;
  address: string;
  tips: string;
}

const POPULAR_VENUES: Record<string, ExamVenue[]> = {
  'ENEM': [
    {
      name: 'USP - Cidade Universitária (Butantã)',
      address: 'Av. Prof. Almeida Prado, 1280 - Butantã, São Paulo - SP, 05508-070',
      tips: 'Próximo à Estação Butantã (Linha 4-Amarela). No dia, use os circulares especiais de ônibus. Muito procurado, chegue cedo!'
    },
    {
      name: 'PUC-SP - Campus Monte Alegre (Perdizes)',
      address: 'Rua Monte Alegre, 984 - Perdizes, São Paulo - SP, 05014-901',
      tips: 'Estação Palmeiras-Barra Funda do Metrô e pegue ônibus integrado. Ônibus fretados costumam parar perto. Portões fecham rigorosamente.'
    },
    {
      name: 'UNIP - Campus Paraíso / Vergueiro',
      address: 'Rua Vergueiro, 1211 - Paraíso, São Paulo - SP, 01504-001',
      tips: 'Estação Paraíso ou Vergueiro do Metrô (Linha 1-Azul e Linha 2-Verde). Muito fácil acesso por transporte sobre trilhos!'
    },
    {
      name: 'Colégio Bandeirantes (Vila Mariana)',
      address: 'Rua Estela, 268 - Vila Mariana, São Paulo - SP, 04011-001',
      tips: 'Próximo ao Metrô Paraíso. Excelente infraestrutura de salas silenciosas e climatizadas.'
    },
    {
      name: 'Universidade Presbiteriana Mackenzie (Consolação)',
      address: 'Rua da Consolação, 930 - Consolação, São Paulo - SP, 01302-907',
      tips: 'Estação Higienópolis-Mackenzie (Linha 4-Amarela).'
    }
  ],
  'FUVEST': [
    {
      name: 'Escola Politécnica (Poli-USP)',
      address: 'Av. Prof. Luciano Gualberto, 380 - Butantã, São Paulo - SP, 05508-010',
      tips: 'Campus Butantã da USP. Estação de Metrô Butantã + Linha de ônibus Circular 8012-10 ou 8022-10.'
    },
    {
      name: 'Faculdade de Economia, Administração e Contabilidade (FEA-USP)',
      address: 'Av. Prof. Luciano Gualberto, 908 - Butantã, São Paulo - SP, 05508-010',
      tips: 'Próximo à Biblioteca Florestan Fernandes na USP Butantã. Estacionamento costuma lotar.'
    },
    {
      name: 'FFLCH - Prédio de Letras (USP)',
      address: 'Av. Prof. Lineu Prestes, 338 - Butantã, São Paulo - SP, 05508-000',
      tips: 'Prédios grandes. Verifique com antecedência o bloco e sala exatos no cartão do candidato. Metrô Butantã.'
    },
    {
      name: 'Colégio Etapa (Vila Mariana)',
      address: 'Rua Vergueiro, 1987 - Vila Mariana, São Paulo - SP, 04101-000',
      tips: 'Ao lado do Metrô Ana Rosa (Linha 1-Azul/Linha 2-Verde).'
    }
  ],
  'UNICAMP': [
    {
      name: 'UNICAMP - Ciclo Básico II (Campinas)',
      address: 'Rua Sérgio Buarque de Holanda, 251 - Cidade Universitária, Campinas - SP, 13083-859',
      tips: 'Principal polo de provas na Cidade Universitária Zeferino Vaz. Há linhas diretas da rodoviária de Campinas.'
    },
    {
      name: 'Faculdade de Engenharia de Alimentos (FEA-UNICAMP)',
      address: 'Rua Monteiro Lobato, 80 - Cidade Universitária, Campinas - SP, 13083-862',
      tips: 'Dentro do campus de Barão Geraldo. Ótima acessibilidade, refeitórios e áreas de convivência por perto.'
    },
    {
      name: 'Colégio Técnico de Campinas (COTUCA)',
      address: 'Rua Jorge de Figueiredo Corrêa, 735 - Chácara Primavera, Campinas - SP, 13087-261',
      tips: 'Fácil parada para carros de aplicativos. Chegue 1h antes para localizar a sala.'
    }
  ],
  'UNESP': [
    {
      name: 'UNESP - Campus Barra Funda',
      address: 'Rua Dr. Bento Teobaldo Ferraz, 271 - Barra Funda, São Paulo - SP, 01140-070',
      tips: 'Fica logo atrás do Terminal Intermodal Palmeiras-Barra Funda. Extremamente fácil de chegar de Metrô, CPTM ou Ônibus!'
    },
    {
      name: 'UNESP - Câmpus de Bauru',
      address: 'Av. Eng. Luiz Edmundo Carrijo Coube, 14-01 - Vargem Limpa, Bauru - SP, 17033-360',
      tips: 'Amplo campus com muitas salas. Vá de ônibus da linha UNESP ou carro próprio.'
    }
  ],
  'ITA': [
    {
      name: 'ITA - Campus DCTA (São José dos Campos)',
      address: 'Praça Marechal Eduardo Gomes, 50 - Vila das Açácias, São José dos Campos - SP, 12228-900',
      tips: 'Acesso pelo portão do DCTA. Necessário apresentar documento oficial com foto na guarita. Vá com bastante antecedência.'
    },
    {
      name: 'CPOR / Colégio Militar de São Paulo (Santana)',
      address: 'Rua Alfredo Pujol, 681 - Santana, São Paulo - SP, 02017-011',
      tips: 'Próximo à Estação Santana (Linha 1-Azul). Apresentação formal recomendada, portões fechados estritamente no horário.'
    }
  ],
  'OUTROS': [
    {
      name: 'Colégio Dante Alighieri',
      address: 'Alameda Jaú, 1061 - Cerqueira César, São Paulo - SP, 01420-001',
      tips: 'Metrô Consolação ou Trianon-Masp (Linha 2-Verde).'
    },
    {
      name: 'Colégio São Luís',
      address: 'Rua Haddock Lobo, 400 - Cerqueira César, São Paulo - SP, 01414-001',
      tips: 'Próximo à Av. Paulista, Estação Consolação.'
    }
  ]
};

const getVenuesForEvent = (event: VestibularEvent): ExamVenue[] => {
  const nameUpper = event.name.toUpperCase();
  const instUpper = event.institution.toUpperCase();
  
  if (nameUpper.includes('ENEM') || instUpper.includes('ENEM')) {
    return POPULAR_VENUES['ENEM'];
  }
  if (nameUpper.includes('FUVEST') || instUpper.includes('USP') || nameUpper.includes('USP')) {
    return POPULAR_VENUES['FUVEST'];
  }
  if (nameUpper.includes('UNICAMP') || instUpper.includes('UNICAMP')) {
    return POPULAR_VENUES['UNICAMP'];
  }
  if (nameUpper.includes('UNESP') || instUpper.includes('UNESP')) {
    return POPULAR_VENUES['UNESP'];
  }
  if (nameUpper.includes('ITA') || instUpper.includes('ITA')) {
    return POPULAR_VENUES['ITA'];
  }
  return POPULAR_VENUES['OUTROS'];
};

export default function CronogramaVestibulares() {
  const [events, setEvents] = useState<VestibularList>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'calendar' | 'list'>('calendar');
  const [searchText, setSearchText] = useState('');
  
  // Calendar states
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10); // November by default (index 10)
  
  // Create state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [newEventInst, setNewEventInst] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventNotes, setNewEventNotes] = useState('');
  const [newEventAlertDays, setNewEventAlertDays] = useState(7);
  const [saving, setSaving] = useState(false);

  // States for active event local setup selection interactive modal
  const [selectedEvent, setSelectedEvent] = useState<VestibularEvent | null>(null);
  const [selectedVenueType, setSelectedVenueType] = useState<'preset' | 'custom'>('preset');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(-1);
  const [customLocalName, setCustomLocalName] = useState('');
  const [customEndereco, setCustomEndereco] = useState('');
  const [customDicas, setCustomDicas] = useState('');
  const [savingLocation, setSavingLocation] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const allEvents = await vestibularEventService.getEvents();
      setEvents(allEvents);
    } catch (err) {
      console.error("Error loading events", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setSavingLocation(true);
    try {
      let localDeProva = '';
      let enderecoDeProva = '';
      let dicasTransporte = '';

      if (selectedVenueType === 'preset') {
        const venues = getVenuesForEvent(selectedEvent);
        const venue = venues[selectedPresetIndex];
        if (venue) {
          localDeProva = venue.name;
          enderecoDeProva = venue.address;
          dicasTransporte = venue.tips;
        } else {
          return;
        }
      } else {
        if (!customLocalName.trim() || !customEndereco.trim()) return;
        localDeProva = customLocalName.trim();
        enderecoDeProva = customEndereco.trim();
        dicasTransporte = customDicas.trim();
      }

      await vestibularEventService.updateEvent(selectedEvent.id, {
        localDeProva,
        enderecoDeProva,
        dicasTransporte
      });

      // Reload lists
      const updatedList = await vestibularEventService.getEvents();
      setEvents(updatedList);
      
      // Sync active selected event details directly
      setSelectedEvent(prev => prev ? {
        ...prev,
        localDeProva,
        enderecoDeProva,
        dicasTransporte
      } : null);

      // Clean selectors
      setSelectedPresetIndex(-1);
      setCustomLocalName('');
      setCustomEndereco('');
      setCustomDicas('');
    } catch (err) {
      console.error("Erro ao salvar local de prova:", err);
    } finally {
      setSavingLocation(false);
    }
  };

  const handleClearLocation = async () => {
    if (!selectedEvent) return;
    if (!confirm("Deseja mesmo remover o local de prova cadastrado para esta prova?")) return;

    setSavingLocation(true);
    try {
      await vestibularEventService.updateEvent(selectedEvent.id, {
        localDeProva: undefined,
        enderecoDeProva: undefined,
        dicasTransporte: undefined
      });

      const updatedList = await vestibularEventService.getEvents();
      setEvents(updatedList);
      
      setSelectedEvent(prev => prev ? {
        ...prev,
        localDeProva: undefined,
        enderecoDeProva: undefined,
        dicasTransporte: undefined
      } : null);
    } catch (err) {
      console.error("Erro ao limpar local de prova:", err);
    } finally {
      setSavingLocation(false);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventName.trim() || !newEventInst.trim() || !newEventDate) return;

    setSaving(true);
    try {
      // Create local ISO formatted date string
      const isoDate = new Date(newEventDate).toISOString();
      await vestibularEventService.addVestibular({
        name: newEventName.trim(),
        institution: newEventInst.trim(),
        date: isoDate,
        notes: newEventNotes.trim() || undefined,
        alertDaysBefore: newEventAlertDays
      });
      
      // Reset form states
      setNewEventName('');
      setNewEventInst('');
      setNewEventDate('');
      setNewEventNotes('');
      setNewEventAlertDays(7);
      setShowAddForm(false);
      
      // Reload lists
      await loadEvents();
    } catch (err) {
      console.error("Error adding event:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm("Deseja realmente excluir este evento da sua agenda?")) {
      try {
        await vestibularEventService.deleteEvent(id);
        await loadEvents();
      } catch (err) {
        console.error("Error deleting event:", err);
      }
    }
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay(); // Sunday=0, Monday=1 etc.
  };

  const monthsPortuguese = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Calculated variables
  const filteredEvents = events.filter(e => {
    const term = searchText.toLowerCase();
    return (
      e.name.toLowerCase().includes(term) ||
      e.institution.toLowerCase().includes(term) ||
      (e.notes && e.notes.toLowerCase().includes(term))
    );
  });

  const nextEvents = vestibularEventService.getNextEvents(events, 4);
  const alerts = vestibularEventService.getAlerts(events);
  const monthEvents = vestibularEventService.listByMonth(events, currentYear, currentMonth);

  // Generate calendar grid
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfWeek = getFirstDayOfMonth(currentYear, currentMonth);
  const calendarCells = [];

  // Empty cells for alignment
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(null);
  }

  // Days of month
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  return (
    <div className="space-y-8 select-none pb-20">
      {/* Header section with glow */}
      <div className="relative bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 rounded-[2rem] p-8 md:p-12 text-white shadow-2xl shadow-indigo-950/30 overflow-hidden border border-white/10">
        {/* Animated ambient light orb - More subtle */}
        <div className="absolute -top-1/2 -right-1/4 w-[500px] h-[500px] bg-indigo-500/20 blur-[100px] rounded-full" />
        
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-indigo-200">
            <CalendarIcon size={14} />
            <span>CRONOGRAMA OFICIAL 2026</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-2">
            Agenda de Vestibulares
          </h1>
          <p className="text-indigo-100 text-base md:text-xl leading-relaxed font-medium max-w-xl">
            Monitore datas cruciais, configure lembretes inteligentes e mantenha o foco no dia de cada prova.
          </p>
        </div>
      </div>

      {/* Grid: Alerts & Upcoming items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Dynamic Warning Banners (Urgent alerts) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-black text-[var(--text-primary)] flex items-center gap-2">
            <Bell className="text-amber-500 animate-swing" size={20} />
            Alertas Importantes
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {alerts.length > 0 ? (
              alerts.map((al, idx) => (
                <div 
                  key={idx} 
                  className="flex items-start gap-4 p-6 bg-slate-900 border border-amber-900/40 rounded-3xl text-amber-500 shadow-lg"
                >
                  <div className="p-3 bg-amber-500/10 rounded-2xl">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-sm uppercase tracking-wider text-amber-400">Prova Se Aproximando</h4>
                    <p className="text-sm font-medium mt-1 text-slate-300">{al.message}</p>
                    {al.event.notes && (
                      <p className="text-xs mt-3 italic border-l-2 border-amber-500/30 pl-3 text-slate-400">
                        {al.event.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl text-center text-[var(--text-secondary)] font-medium text-sm">
                Nenhum sinal de prova crítica nos próximos dias. Continue firme nos estudos!
              </div>
            )}
          </div>
        </div>

        {/* Next Exams List */}
        <div className="bg-[var(--card-bg)] p-6 rounded-3xl border border-[var(--card-border)] shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-md font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
              <Clock size={16} className="text-teal-500" />
              Próximos Eventos
            </h3>
            
            <div className="space-y-3">
              {nextEvents.length > 0 ? (
                nextEvents.map(e => {
                  const daysLeft = vestibularEventService.daysRemaining(e.date);
                  return (
                    <div 
                      key={e.id}
                      className="p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--card-border)] flex items-center justify-between gap-3"
                    >
                      <div className="overflow-hidden">
                        <p className="font-bold text-xs text-[var(--text-primary)] truncate">{e.name}</p>
                        <p className="text-[10px] text-[var(--text-secondary)] font-semibold uppercase">{e.institution}</p>
                      </div>
                      <div className="text-right shrink-0">
                        {daysLeft < 0 ? (
                          <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">Passou</span>
                        ) : daysLeft === 0 ? (
                          <span className="text-[10px] font-bold text-emerald-500 animate-pulse px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 rounded-md">É Hoje!</span>
                        ) : (
                          <span className="text-[10px] font-bold text-blue-500 px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 rounded-md">Faltam {daysLeft}d</span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-[var(--text-secondary)] italic">Sem exames futuros na agenda.</p>
              )}
            </div>
          </div>
          
          <button 
            onClick={() => setShowAddForm(true)}
            className="w-full mt-4 py-3 bg-[var(--button-bg)] hover:bg-[var(--button-bg-hover)] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            <Plus size={14} />
            Agendar Novo Exame
          </button>
        </div>
      </div>

      {/* Main Tabs / Display logic */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Calendar view selector */}
          <div className="flex bg-[var(--bg-secondary)] p-1 rounded-xl border border-[var(--card-border)] shrink-0">
            <button 
              onClick={() => setActiveView('calendar')}
              className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                activeView === 'calendar' 
                  ? 'bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Exibição em Calendário
            </button>
            <button 
              onClick={() => setActiveView('list')}
              className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                activeView === 'list' 
                  ? 'bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Todos como Lista ({filteredEvents.length})
            </button>
          </div>

          {/* Search bar inputs */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={16} />
            <input 
              type="text" 
              placeholder="Buscar exames ou notas..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--text-accent)] transition-all font-medium"
            />
          </div>
        </div>

        {/* View render area */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4">
              <RefreshCw className="text-[var(--text-accent)] animate-spin w-10 h-10" />
              <p className="text-sm font-semibold text-[var(--text-secondary)]">Organizando datas e lembretes...</p>
            </div>
          ) : activeView === 'calendar' ? (
            <motion.div 
              key="calendar"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-[var(--card-bg)] p-6 md:p-8 rounded-[2rem] border border-[var(--card-border)] space-y-6"
            >
              {/* Month selector header */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--card-border)]">
                <div className="flex items-center gap-3">
                  <CalendarDays className="text-[var(--text-accent)]" size={24} />
                  <h3 className="text-lg md:text-xl font-bold">
                    {monthsPortuguese[currentMonth]} {currentYear}
                  </h3>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handlePrevMonth}
                    className="p-2 border border-[var(--card-border)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    onClick={handleNextMonth}
                    className="p-2 border border-[var(--card-border)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Grid labels */}
              <div className="grid grid-cols-7 gap-1 md:gap-4 text-center text-xs font-black uppercase tracking-wider text-[var(--text-secondary)] pt-2">
                <div>Dom</div>
                <div>Seg</div>
                <div>Ter</div>
                <div>Qua</div>
                <div>Qui</div>
                <div>Sex</div>
                <div>Sáb</div>
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-1 md:gap-4">
                {calendarCells.map((day, idx) => {
                  if (day === null) {
                    return <div key={`empty-${idx}`} className="h-16 md:h-24 bg-[var(--bg-secondary)]/10 rounded-xl" />;
                  }

                  // Find events on this day
                  const hasEvents = monthEvents.filter(e => {
                    const d = new Date(e.date);
                    return d.getUTCDate() === day;
                  });

                  return (
                    <div 
                      key={`day-${day}`}
                      onClick={() => {
                        if (hasEvents.length > 0) {
                          setSelectedEvent(hasEvents[0]);
                        }
                      }}
                      className={`h-24 p-2 md:p-3 rounded-2xl md:rounded-3xl border transition-all flex flex-col justify-between overflow-hidden relative cursor-pointer ${
                        hasEvents.length > 0 
                          ? 'border-[var(--text-accent)]/30 bg-[var(--text-accent)]/[0.05] hover:bg-[var(--text-accent)]/[0.09] shadow-sm' 
                          : 'border-transparent bg-slate-100 dark:bg-slate-800/30 hover:bg-slate-200 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="font-mono text-xs md:text-sm font-bold text-[var(--text-primary)]">{day}</span>
                      
                      {/* Show mini pointers for events */}
                      <div className="space-y-1 overflow-y-auto max-h-12 scrollbar-none">
                        {hasEvents.map(e => (
                          <button 
                            key={e.id}
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedEvent(e);
                            }}
                            className="w-full text-left bg-indigo-500/20 hover:bg-indigo-500/35 text-indigo-700 dark:text-indigo-300 text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-lg truncate block leading-tight mb-1 active:scale-95 transition-all outline-none"
                            title={`${e.name} (${e.institution}) - Clique para ver local de prova`}
                          >
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                              <span className="truncate">{e.name}</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend of month's events details */}
              <div className="space-y-4 pt-6 border-t border-[var(--card-border)]">
                <h4 className="text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">Exames De {monthsPortuguese[currentMonth]}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {monthEvents.map(e => {
                    const daysLeft = vestibularEventService.daysRemaining(e.date);
                    return (
                      <div 
                        key={e.id}
                        className="p-4 rounded-2xl bg-[var(--bg-secondary)]/55 border border-[var(--card-border)] flex flex-col justify-between relative group hover:border-indigo-500/20 transition-all"
                      >
                        <div>
                          <div className="flex items-start justify-between">
                            <h5 className="font-bold text-sm text-[var(--text-primary)]">{e.name}</h5>
                            {daysLeft >= 0 && (
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-md">
                                {daysLeft} d
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-wider">{e.institution}</p>
                          {e.notes && <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2 font-medium">{e.notes}</p>}
                          
                          {/* Location setup status Badge */}
                          <div className="mt-3">
                            {e.localDeProva ? (
                              <button
                                onClick={() => setSelectedEvent(e)}
                                className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg transition-all active:scale-95 text-left w-full"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                                <span className="truncate">Local: {e.localDeProva}</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => setSelectedEvent(e)}
                                className="flex items-center gap-1.5 text-[10px] text-indigo-500 dark:text-indigo-400 font-bold bg-indigo-500/10 hover:bg-indigo-500/20 px-2.5 py-1.5 rounded-lg transition-all active:scale-95 w-full text-left"
                              >
                                <MapPin size={10} className="shrink-0" />
                                <span>Definir onde vai fazer</span>
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--card-border)]/50">
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(e.date).toLocaleDateString()}
                          </span>
                          <button 
                            onClick={() => handleDeleteEvent(e.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {monthEvents.length === 0 && (
                    <p className="text-sm text-[var(--text-secondary)] italic py-4 col-span-3 text-center">Nenhum evento agendado para este mês.</p>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[var(--card-bg)] p-6 md:p-8 rounded-[2rem] border border-[var(--card-border)] space-y-6"
            >
              <div className="flex items-center gap-2 pb-4 border-b border-[var(--card-border)]">
                <Archive size={20} className="text-[var(--text-accent)]" />
                <h3 className="text-lg font-bold">Histórico Geral de Datas</h3>
              </div>

              <div className="space-y-4">
                {filteredEvents.map(e => {
                  const daysLeft = vestibularEventService.daysRemaining(e.date);
                  return (
                    <div 
                      key={e.id}
                      className="p-5 bg-[var(--bg-secondary)]/30 border border-[var(--card-border)] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-indigo-500/15 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-md text-[var(--text-primary)]">{e.name}</h4>
                          <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-md">
                            {e.institution}
                          </span>
                        </div>
                        {e.notes && <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed max-w-xl">{e.notes}</p>}
                        
                        <div className="pt-2">
                          {e.localDeProva ? (
                            <button
                              onClick={() => setSelectedEvent(e)}
                              className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1 rounded-xl transition-all active:scale-95"
                            >
                              <MapPin size={12} className="shrink-0 animate-pulse text-emerald-500" />
                              <span>Local: {e.localDeProva}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => setSelectedEvent(e)}
                              className="inline-flex items-center gap-1.5 text-xs text-indigo-500 dark:text-indigo-400 font-bold bg-indigo-500/10 hover:bg-indigo-500/20 px-3.5 py-1.5 rounded-xl transition-all active:scale-95"
                            >
                              <MapPin size={12} className="shrink-0" />
                              <span>Definir onde vai fazer</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-6 justify-between md:justify-end">
                        <div className="text-right">
                          <p className="text-xs font-mono font-bold">{new Date(e.date).toLocaleDateString()}</p>
                          <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 font-bold">
                            {daysLeft < 0 ? 'Já concluído' : `Faltam ${daysLeft} dias`}
                          </p>
                        </div>

                        <button 
                          onClick={() => handleDeleteEvent(e.id)}
                          className="p-2 hover:bg-red-500/10 hover:text-red-500 text-slate-400 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {filteredEvents.length === 0 && (
                  <div className="text-center py-12 text-[var(--text-secondary)] font-bold italic">
                    Nenhum vestibular encontrado para os critérios informados.
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pop up form modal to insert more exams */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 md:p-8 rounded-[2rem] w-full max-w-lg shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[var(--card-border)] mb-6">
                <div className="flex items-center gap-2 text-[var(--text-accent)]">
                  <CalendarIcon size={20} />
                  <h3 className="text-lg font-black">Adicionar Exame / Evento</h3>
                </div>
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="p-1 px-2.5 hover:bg-[var(--bg-secondary)] rounded-md font-bold text-slate-400"
                >
                  X
                </button>
              </div>

              <form onSubmit={handleAddEvent} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-[var(--text-secondary)]">Nome da Prova / Marco</label>
                  <input 
                    type="text"
                    required
                    placeholder="Ex: Prova de Matemática - Unicamp"
                    value={newEventName}
                    onChange={e => setNewEventName(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-xl text-sm font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-[var(--text-secondary)]">Instituição / Vestibular</label>
                  <input 
                    type="text"
                    required
                    placeholder="Ex: UNICAMP"
                    value={newEventInst}
                    onChange={e => setNewEventInst(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-xl text-sm font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-[var(--text-secondary)]">Data e Hora da Prova</label>
                    <input 
                      type="datetime-local"
                      required
                      value={newEventDate}
                      onChange={e => setNewEventDate(e.target.value)}
                      className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-xl text-sm font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-[var(--text-secondary)]">Dias anteriores p/ Alerta</label>
                    <input 
                      type="number"
                      min="1"
                      max="30"
                      value={newEventAlertDays}
                      onChange={e => setNewEventAlertDays(Number(e.target.value))}
                      className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-xl text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-[var(--text-secondary)]">Observações / Detalhes (Opcional)</label>
                  <textarea 
                    placeholder="Ex: Trazer caneta preta de material transparente, documento impresso, etc"
                    value={newEventNotes}
                    onChange={e => setNewEventNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-xl text-sm font-medium resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-4 border-t border-[var(--card-border)]">
                  <button 
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-3 text-sm font-bold border border-[var(--card-border)] rounded-xl hover:bg-[var(--bg-secondary)]"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 text-sm font-black bg-[var(--button-bg)] hover:bg-[var(--button-bg-hover)] text-white rounded-xl flex items-center justify-center gap-2 shadow-lg"
                  >
                    {saving ? <RefreshCw className="animate-spin" size={14} /> : null}
                    Confirmar Envio
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pop up modal to select/view exam location and address details */}
      <AnimatePresence>
        {selectedEvent && (() => {
          const venues = getVenuesForEvent(selectedEvent);
          const hasLocation = !!selectedEvent.localDeProva;

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-[2.5rem] w-full max-w-2xl shadow-2xl relative my-8 text-white text-left"
              >
                {/* Header info */}
                <div className="flex items-start justify-between pb-4 border-b border-slate-800 mb-6 font-sans">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="text-indigo-400" size={20} />
                      <span className="text-xs font-black uppercase tracking-wider text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                        {selectedEvent.institution}
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-white">{selectedEvent.name}</h3>
                    <p className="text-xs text-slate-400 font-medium">
                      Data da Prova: <span className="font-mono text-indigo-200">{new Date(selectedEvent.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedEvent(null);
                      setSelectedPresetIndex(-1);
                      setSelectedVenueType('preset');
                    }}
                    className="p-1.5 hover:bg-slate-850 rounded-full font-black text-slate-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {hasLocation ? (
                  /* Option 1: View active selected local, address & interactive mockup map */
                  <div className="space-y-6 font-sans">
                    <div className="p-5 bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-900/30 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-widest">
                        <MapPin size={14} />
                        <span>CONVOCAÇÃO EXTRAÍDA COM SUCESSO</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-white tracking-tight">{selectedEvent.localDeProva}</h4>
                        <p className="text-sm font-semibold text-slate-300 mt-1 select-all select-text">{selectedEvent.enderecoDeProva}</p>
                      </div>

                      {selectedEvent.dicasTransporte && (
                        <div className="mt-3 pt-3 border-t border-slate-850/60 flex items-start gap-2.5">
                          <Car className="text-indigo-400 shrink-0 mt-0.5" size={16} />
                          <p className="text-xs text-slate-400 font-medium leading-relaxed font-sans">
                            <strong className="text-slate-300 font-bold">Dicas para o dia:</strong> {selectedEvent.dicasTransporte}
                          </p>
                        </div>
                      )}

                      <div className="pt-2 flex flex-wrap gap-2.5">
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedEvent.localDeProva} ${selectedEvent.enderecoDeProva}`)}`}
                          target="_blank" 
                          rel="noreferrer"
                          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
                        >
                          <ExternalLink size={12} />
                          Abrir no Google Maps
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            if (selectedEvent.enderecoDeProva) {
                              navigator.clipboard.writeText(selectedEvent.enderecoDeProva);
                              alert("Endereço copiado para a área de transferência!");
                            }
                          }}
                          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 active:scale-95 text-slate-200 font-medium text-xs rounded-xl border border-slate-700 transition-all font-bold"
                        >
                          Copiar Endereço
                        </button>
                      </div>
                    </div>

                    {/* Highly interactive, gorgeous high-fidelity dynamic satellite/vector simulated map route widget */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                        <Map size={12} />
                        Simulador de Rota e Entorno (GPS Vetorial)
                      </h4>
                      <div className="relative h-48 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between p-4 font-mono">
                        {/* Realistic CSS blueprint/radar background */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-indigo-950/40 via-transparent to-transparent opacity-60" />
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
                        
                        {/* Active radar overlay sweep effect */}
                        <div className="absolute inset-x-0 inset-y-0 bg-transparent overflow-hidden">
                          <div className="w-[200%] h-[200%] bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 -translate-x-[50%] -translate-y-[50%] animate-spin" style={{ animationDuration: '6s' }} />
                        </div>

                        {/* Top HUD bar */}
                        <div className="relative z-10 flex items-center justify-between text-[10px] text-indigo-400 font-bold">
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>GPS ATIVO (COORDS_OK)</span>
                          </div>
                          <div className="text-right">
                            <span>SINAL: EXCELENTE</span>
                          </div>
                        </div>

                        {/* Center Pin & Street Layout Simulation Graphics */}
                        <div className="relative z-10 flex flex-col items-center justify-center space-y-1.5 my-auto">
                          <div className="relative">
                            <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-md animate-ping" style={{ animationDuration: '2s' }} />
                            <div className="w-10 h-10 rounded-full bg-indigo-500/10 border-2 border-indigo-400/80 flex items-center justify-center relative">
                              <MapPin size={18} className="text-indigo-400 animate-bounce" />
                            </div>
                          </div>
                          <div className="text-center">
                            <span className="text-xs font-extrabold text-white bg-slate-900/90 px-3 py-1 border border-slate-800 rounded-full shadow-lg block max-w-sm truncate">
                              {selectedEvent.localDeProva}
                            </span>
                            <span className="text-[9px] text-indigo-300 font-medium mt-1 inline-block uppercase tracking-wider">
                              GPS LOCK • Portão de Acesso Principal
                            </span>
                          </div>
                        </div>

                        {/* Bottom stats HUD */}
                        <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-400">
                          <div>
                            <span>RAIO DE ALERTA: 1.5KM</span>
                          </div>
                          <div className="flex items-center gap-1 text-emerald-400 font-bold">
                            <Navigation size={10} className="transform rotate-45" />
                            <span>COBERTURA ATIVA</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          // Clear active and open selection mode
                          const venuesList = getVenuesForEvent(selectedEvent);
                          if (venuesList.length > 0) {
                            setSelectedPresetIndex(0);
                          }
                          setSelectedVenueType('preset');
                          setSelectedEvent(prev => prev ? {
                            ...prev,
                            localDeProva: undefined,
                            enderecoDeProva: undefined,
                            dicasTransporte: undefined
                          } : null);
                        }}
                        className="flex-1 py-3 text-xs font-bold bg-slate-800 hover:bg-slate-750 rounded-xl transition-all active:scale-95 border border-slate-700 text-indigo-400"
                      >
                        ✏ Alterar Local de Prova
                      </button>
                      <button
                        type="button"
                        onClick={handleClearLocation}
                        className="py-3 px-5 text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/15 rounded-xl transition-all active:scale-95"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Option 2: Choose / Setup local de prova */
                  <form onSubmit={handleSaveLocation} className="space-y-6 font-sans">
                    <p className="text-sm text-slate-400">
                      Onde você fará a prova do vestibular? Selecione um dos pólos/locais comuns ou digite um endereço customizado.
                    </p>

                    {/* Tabs / Selector type */}
                    <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850">
                      <button
                        type="button"
                        onClick={() => setSelectedVenueType('preset')}
                        className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${
                          selectedVenueType === 'preset'
                            ? 'bg-slate-800 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Centros Recomendados
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedVenueType('custom')}
                        className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${
                          selectedVenueType === 'custom'
                            ? 'bg-slate-800 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Digitar Manualmente
                      </button>
                    </div>

                    {selectedVenueType === 'preset' ? (
                      /* Preset Options list */
                      <div className="space-y-3">
                        <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Selecione o Local de Prova:</label>
                        <div className="grid grid-cols-1 gap-2.5 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 pr-1.5">
                          {venues.map((v, index) => (
                            <div
                              key={index}
                              onClick={() => setSelectedPresetIndex(index)}
                              className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                                selectedPresetIndex === index
                                  ? 'border-indigo-500 bg-indigo-500/10'
                                  : 'border-slate-800 bg-slate-950/40 hover:bg-slate-800/10'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <h5 className="font-bold text-sm text-white">{v.name}</h5>
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                  selectedPresetIndex === index ? 'border-indigo-500 bg-indigo-500' : 'border-slate-600'
                                }`}>
                                  {selectedPresetIndex === index && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                              </div>
                              <p className="text-xs text-slate-400 mt-1">{v.address}</p>
                              {v.tips && selectedPresetIndex === index && (
                                <p className="text-[11px] text-indigo-300 font-medium italic mt-2.5 border-t border-indigo-900/10 pt-2 leading-relaxed">
                                  💡 {v.tips}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Custom Form Option */
                      <div className="space-y-4 text-left">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">Nome do Local (Ex: Escola, Bloco)</label>
                          <input 
                            type="text"
                            required
                            placeholder="Ex: Escola Estadual Professor Mário de Andrade - Bloco B"
                            value={customLocalName}
                            onChange={e => setCustomLocalName(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">Endereço Completo</label>
                          <input 
                            type="text"
                            required
                            placeholder="Ex: Rua das Flores, 450 - Centro, São Paulo - SP"
                            value={customEndereco}
                            onChange={e => setCustomEndereco(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">Recomendações de Transporte / Observação (Opcional)</label>
                          <textarea 
                            placeholder="Ex: Sala 4 no 2º andar. Linha de Metrô mais próxima: Linha Azul..."
                            value={customDicas}
                            onChange={e => setCustomDicas(e.target.value)}
                            rows={2}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white resize-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* Actions bar */}
                    <div className="flex gap-4 pt-4 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedEvent(null);
                          setSelectedPresetIndex(-1);
                        }}
                        className="flex-1 py-3 text-sm font-bold border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={savingLocation || (selectedVenueType === 'preset' && selectedPresetIndex === -1) || (selectedVenueType === 'custom' && (!customLocalName || !customEndereco))}
                        className="flex-1 py-3 text-sm font-black bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98]"
                      >
                        {savingLocation ? <RefreshCw className="animate-spin" size={14} /> : null}
                        Cadastrar Local de Prova
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
