import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  Bell,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Search,
  CalendarDays,
  Sparkles,
  MapPin,
  ExternalLink,
  Car,
  CheckCircle2,
  X,
  Edit3,
  Copy,
  Check,
  Compass,
  ArrowRight,
  Filter,
  Flame,
  BookmarkCheck,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  vestibularEventService,
  VestibularEvent,
  VestibularList,
} from "../services/vestibularEventService";
import PlanejamentoSemanalView from "./PlanejamentoSemanalView";

interface ExamVenue {
  name: string;
  address: string;
  tips: string;
}

const POPULAR_VENUES: Record<string, ExamVenue[]> = {
  ENEM: [
    {
      name: "USP - Cidade Universitária (Butantã)",
      address: "Av. Prof. Almeida Prado, 1280 - Butantã, São Paulo - SP, 05508-070",
      tips: "Próximo à Estação Butantã (Linha 4-Amarela). No dia, use os circulares especiais de ônibus. Muito procurado, chegue cedo!",
    },
    {
      name: "PUC-SP - Campus Monte Alegre (Perdizes)",
      address: "Rua Monte Alegre, 984 - Perdizes, São Paulo - SP, 05014-901",
      tips: "Estação Palmeiras-Barra Funda do Metrô e pegue ônibus integrado. Portões fecham rigorosamente às 13h.",
    },
    {
      name: "UNIP - Campus Paraíso / Vergueiro",
      address: "Rua Vergueiro, 1211 - Paraíso, São Paulo - SP, 01504-001",
      tips: "Estação Paraíso ou Vergueiro do Metrô (Linhas 1-Azul e 2-Verde). Muito fácil acesso por transporte público!",
    },
    {
      name: "Colégio Bandeirantes (Vila Mariana)",
      address: "Rua Estela, 268 - Vila Mariana, São Paulo - SP, 04011-001",
      tips: "Próximo ao Metrô Paraíso. Excelente infraestrutura de salas silenciosas e climatizadas.",
    },
    {
      name: "Universidade Presbiteriana Mackenzie (Consolação)",
      address: "Rua da Consolação, 930 - Consolação, São Paulo - SP, 01302-907",
      tips: "Estação Higienópolis-Mackenzie (Linha 4-Amarela).",
    },
  ],
  FUVEST: [
    {
      name: "Escola Politécnica (Poli-USP)",
      address: "Av. Prof. Luciano Gualberto, 380 - Butantã, São Paulo - SP, 05508-010",
      tips: "Campus Butantã da USP. Estação Metrô Butantã + Linha de ônibus Circular 8012-10 ou 8022-10.",
    },
    {
      name: "Faculdade de Economia e Administração (FEA-USP)",
      address: "Av. Prof. Luciano Gualberto, 908 - Butantã, São Paulo - SP, 05508-010",
      tips: "Próximo à Biblioteca Florestan Fernandes na USP Butantã. Estacionamento costuma lotar cedo.",
    },
    {
      name: "FFLCH - Prédio de Letras (USP)",
      address: "Av. Prof. Lineu Prestes, 338 - Butantã, São Paulo - SP, 05508-000",
      tips: "Prédios grandes. Verifique com antecedência o bloco e sala exatos no cartão de confirmação.",
    },
    {
      name: "Colégio Etapa (Vila Mariana)",
      address: "Rua Vergueiro, 1987 - Vila Mariana, São Paulo - SP, 04101-000",
      tips: "Ao lado do Metrô Ana Rosa (Linha 1-Azul / Linha 2-Verde).",
    },
  ],
  UNICAMP: [
    {
      name: "UNICAMP - Ciclo Básico II (Campinas)",
      address: "Rua Sérgio Buarque de Holanda, 251 - Cidade Universitária, Campinas - SP, 13083-859",
      tips: "Principal polo de provas na Cidade Universitária Zeferino Vaz. Há linhas diretas da rodoviária de Campinas.",
    },
    {
      name: "Faculdade de Engenharia de Alimentos (FEA-UNICAMP)",
      address: "Rua Monteiro Lobato, 80 - Cidade Universitária, Campinas - SP, 13083-862",
      tips: "Dentro do campus de Barão Geraldo. Ótima acessibilidade e áreas de convivência por perto.",
    },
    {
      name: "Colégio Técnico de Campinas (COTUCA)",
      address: "Rua Jorge de Figueiredo Corrêa, 735 - Chácara Primavera, Campinas - SP, 13087-261",
      tips: "Fácil parada para carros de aplicativos. Chegue 1 hora antes para localizar a sala.",
    },
  ],
  UNESP: [
    {
      name: "UNESP - Campus Barra Funda",
      address: "Rua Dr. Bento Teobaldo Ferraz, 271 - Barra Funda, São Paulo - SP, 01140-070",
      tips: "Logo atrás do Terminal Palmeiras-Barra Funda. Extremamente fácil de chegar por Metrô, CPTM ou ônibus!",
    },
    {
      name: "UNESP - Câmpus de Bauru",
      address: "Av. Eng. Luiz Edmundo Carrijo Coube, 14-01 - Vargem Limpa, Bauru - SP, 17033-360",
      tips: "Amplo campus com muitas salas. Vá de ônibus da linha UNESP ou carro próprio.",
    },
  ],
  ITA: [
    {
      name: "ITA - Campus DCTA (São José dos Campos)",
      address: "Praça Marechal Eduardo Gomes, 50 - Vila das Acácias, São José dos Campos - SP, 12228-900",
      tips: "Acesso pelo portão do DCTA. Apresente documento oficial com foto na guarita. Vá com bastante antecedência.",
    },
    {
      name: "CPOR / Colégio Militar de São Paulo (Santana)",
      address: "Rua Alfredo Pujol, 681 - Santana, São Paulo - SP, 02017-011",
      tips: "Próximo à Estação Santana (Linha 1-Azul). Portões fechados estritamente no horário.",
    },
  ],
  OUTROS: [
    {
      name: "Colégio Dante Alighieri",
      address: "Alameda Jaú, 1061 - Cerqueira César, São Paulo - SP, 01420-001",
      tips: "Metrô Consolação ou Trianon-Masp (Linha 2-Verde).",
    },
    {
      name: "Colégio São Luís",
      address: "Rua Haddock Lobo, 400 - Cerqueira César, São Paulo - SP, 01414-001",
      tips: "Próximo à Av. Paulista, Estação Consolação.",
    },
  ],
};

const getVenuesForEvent = (event: VestibularEvent): ExamVenue[] => {
  const nameUpper = event.name.toUpperCase();
  const instUpper = event.institution.toUpperCase();

  if (nameUpper.includes("ENEM") || instUpper.includes("ENEM")) {
    return POPULAR_VENUES["ENEM"];
  }
  if (nameUpper.includes("FUVEST") || instUpper.includes("USP") || nameUpper.includes("USP")) {
    return POPULAR_VENUES["FUVEST"];
  }
  if (nameUpper.includes("UNICAMP") || instUpper.includes("UNICAMP")) {
    return POPULAR_VENUES["UNICAMP"];
  }
  if (nameUpper.includes("UNESP") || instUpper.includes("UNESP")) {
    return POPULAR_VENUES["UNESP"];
  }
  if (nameUpper.includes("ITA") || instUpper.includes("ITA")) {
    return POPULAR_VENUES["ITA"];
  }
  return POPULAR_VENUES["OUTROS"];
};

interface CronogramaVestibularesProps {
  onNavegarParaAba?: (aba: string) => void;
}

export default function CronogramaVestibulares({ onNavegarParaAba }: CronogramaVestibularesProps = {}) {
  const [events, setEvents] = useState<VestibularList>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<"weekly" | "calendar" | "list">(() => {
    try {
      if (localStorage.getItem("gabarita_abrir_rotina") === "true") {
        localStorage.removeItem("gabarita_abrir_rotina");
        return "weekly";
      }
    } catch (_) {}
    return "weekly";
  });
  const [searchText, setSearchText] = useState("");
  const [selectedInstFilter, setSelectedInstFilter] = useState<string>("Todos");

  // Navegação do calendário
  const todayDate = new Date();
  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(todayDate.getDate());

  // Modal para adicionar exame
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEventName, setNewEventName] = useState("");
  const [newEventInst, setNewEventInst] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventNotes, setNewEventNotes] = useState("");
  const [newEventAlertDays, setNewEventAlertDays] = useState(7);
  const [saving, setSaving] = useState(false);

  // Modal interativo de detalhes e local de prova
  const [selectedEvent, setSelectedEvent] = useState<VestibularEvent | null>(null);
  const [selectedVenueType, setSelectedVenueType] = useState<"preset" | "custom">("preset");
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(-1);
  const [customLocalName, setCustomLocalName] = useState("");
  const [customEndereco, setCustomEndereco] = useState("");
  const [customDicas, setCustomDicas] = useState("");
  const [savingLocation, setSavingLocation] = useState(false);
  const [copiadoEndereco, setCopiadoEndereco] = useState(false);

  // Edição de anotações
  const [editingNotes, setEditingNotes] = useState(false);
  const [temporaryNotes, setTemporaryNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  // Countdown State
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    loadEvents();
    const handleAbrirRotina = () => setActiveView("weekly");
    window.addEventListener("abrir-rotina-semanal", handleAbrirRotina);
    return () => window.removeEventListener("abrir-rotina-semanal", handleAbrirRotina);
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const allEvents = await vestibularEventService.getEvents();
      setEvents(allEvents);
    } catch (err) {
      console.error("Erro ao carregar eventos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetailedModal = (e: VestibularEvent) => {
    setSelectedEvent(e);
    setTemporaryNotes(e.notes || "");
    setEditingNotes(false);
    setCopiadoEndereco(false);
    setSelectedPresetIndex(-1);
    setSelectedVenueType("preset");
  };

  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setSavingLocation(true);
    try {
      let localDeProva = "";
      let enderecoDeProva = "";
      let dicasTransporte = "";

      if (selectedVenueType === "preset") {
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
        dicasTransporte,
      });

      const updatedList = await vestibularEventService.getEvents();
      setEvents(updatedList);

      setSelectedEvent((prev) =>
        prev
          ? {
              ...prev,
              localDeProva,
              enderecoDeProva,
              dicasTransporte,
            }
          : null,
      );

      setSelectedPresetIndex(-1);
      setCustomLocalName("");
      setCustomEndereco("");
      setCustomDicas("");
    } catch (err) {
      console.error("Erro ao salvar local de prova:", err);
    } finally {
      setSavingLocation(false);
    }
  };

  const handleClearLocation = async () => {
    if (!selectedEvent) return;
    if (!confirm("Deseja mesmo remover o local de prova cadastrado para este exame?")) return;

    setSavingLocation(true);
    try {
      await vestibularEventService.updateEvent(selectedEvent.id, {
        localDeProva: undefined,
        enderecoDeProva: undefined,
        dicasTransporte: undefined,
      });

      const updatedList = await vestibularEventService.getEvents();
      setEvents(updatedList);

      setSelectedEvent((prev) =>
        prev
          ? {
              ...prev,
              localDeProva: undefined,
              enderecoDeProva: undefined,
              dicasTransporte: undefined,
            }
          : null,
      );
    } catch (err) {
      console.error("Erro ao limpar local de prova:", err);
    } finally {
      setSavingLocation(false);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleJumpToToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setSelectedCalendarDay(now.getDate());
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventName.trim() || !newEventInst.trim() || !newEventDate) return;

    setSaving(true);
    try {
      const isoDate = new Date(newEventDate).toISOString();
      await vestibularEventService.addVestibular({
        name: newEventName.trim(),
        institution: newEventInst.trim(),
        date: isoDate,
        notes: newEventNotes.trim() || undefined,
        alertDaysBefore: newEventAlertDays,
      });

      setNewEventName("");
      setNewEventInst("");
      setNewEventDate("");
      setNewEventNotes("");
      setNewEventAlertDays(7);
      setShowAddForm(false);

      await loadEvents();
    } catch (err) {
      console.error("Erro ao adicionar evento:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm("Deseja realmente excluir este exame do seu cronograma?")) {
      try {
        await vestibularEventService.deleteEvent(id);
        await loadEvents();
      } catch (err) {
        console.error("Erro ao excluir evento:", err);
      }
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedEvent) return;
    setSavingNotes(true);
    try {
      await vestibularEventService.updateEvent(selectedEvent.id, {
        notes: temporaryNotes,
      });
      const updatedList = await vestibularEventService.getEvents();
      setEvents(updatedList);
      setSelectedEvent((prev) => (prev ? { ...prev, notes: temporaryNotes } : null));
      setEditingNotes(false);
    } catch (err) {
      console.error("Erro ao salvar anotações:", err);
    } finally {
      setSavingNotes(false);
    }
  };

  const monthsPortuguese = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  // Filtros de eventos
  const filteredEvents = events.filter((e) => {
    const term = searchText.toLowerCase();
    const matchesSearch =
      e.name.toLowerCase().includes(term) ||
      e.institution.toLowerCase().includes(term) ||
      (e.notes && e.notes.toLowerCase().includes(term));
    if (selectedInstFilter === "Todos") return matchesSearch;
    if (selectedInstFilter === "Outros") {
      const known = ["ENEM", "FUVEST", "UNICAMP", "UNESP", "ITA"];
      return matchesSearch && !known.includes(e.institution.toUpperCase());
    }
    return matchesSearch && e.institution.toUpperCase() === selectedInstFilter.toUpperCase();
  });

  const nextEvents = vestibularEventService.getNextEvents(events, 5);
  const alerts = vestibularEventService.getAlerts(events);
  const monthEvents = vestibularEventService.listByMonth(filteredEvents, currentYear, currentMonth);

  // Próximo evento absoluto para o Countdown
  const upcomingEvents = events
    .filter((e) => new Date(e.date).getTime() >= Date.now())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const absoluteNextEvent = upcomingEvents[0];

  useEffect(() => {
    if (!absoluteNextEvent) {
      setTimeLeft(null);
      return;
    }

    const calculate = () => {
      const diff = new Date(absoluteNextEvent.date).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
      }
    };

    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [absoluteNextEvent]);

  // Calendário: dias do mês
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfWeek = getFirstDayOfMonth(currentYear, currentMonth);

  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  // Eventos do dia selecionado no calendário
  const selectedDayEvents = monthEvents.filter((e) => {
    const d = new Date(e.date);
    return d.getUTCDate() === selectedCalendarDay;
  });

  const getInstitutionBadgeColor = (inst: string) => {
    const upper = inst.toUpperCase();
    if (upper.includes("ENEM")) return "bg-blue-500/15 border-blue-500/30 text-blue-400";
    if (upper.includes("FUVEST") || upper.includes("USP")) return "bg-indigo-500/15 border-indigo-500/30 text-indigo-400";
    if (upper.includes("UNICAMP")) return "bg-cyan-500/15 border-cyan-500/30 text-cyan-400";
    if (upper.includes("UNESP")) return "bg-amber-500/15 border-amber-500/30 text-amber-400";
    if (upper.includes("ITA") || upper.includes("IME")) return "bg-purple-500/15 border-purple-500/30 text-purple-400";
    return "bg-slate-500/15 border-slate-500/30 text-slate-300";
  };

  return (
    <div className="space-y-6 select-none pb-24 max-w-7xl mx-auto">
      {/* ========================================================================= */}
      {/* 1. HEADER EXECUTIVO DE COMANDO                                            */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B101D] via-[#0E1526] to-[#07090E] border border-[#1E2534] p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-xs font-bold text-blue-400">
              <CalendarIcon size={14} className="text-blue-400" />
              <span>CALENDÁRIO & CRONOGRAMA OFICIAL 2026</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Cronograma & Agenda de Vestibulares
            </h1>

            <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed max-w-xl">
              Monitore todas as datas de provas em contagem regressiva, cadastre seus locais de exame e organize sua grade de estudos sincronizada com inteligência artificial.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2.5 bg-[#151A24] hover:bg-[#1E2534] text-white border border-[#232B3C] rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer hover:border-blue-500/30 active:scale-95 shadow-sm"
            >
              <Plus size={15} className="text-blue-400" />
              <span>Agendar Prova</span>
            </button>

            <button
              id="btn-abrir-cronograma-header"
              onClick={() => setActiveView("weekly")}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-600/25 active:scale-95 border border-white/10"
            >
              <Sparkles size={15} />
              <span>Meu Cronograma & Planejamento</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DASHBOARD DE CONTAGEM REGRESSIVA & ALERTAS CRÍTICOS                    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ESQUERDA: RELÓGIO DE CONTAGEM REGRESSIVA DO PRÓXIMO EXAME */}
        <div className="lg:col-span-2">
          {absoluteNextEvent ? (
            <div className="h-full p-6 sm:p-7 bg-[#10141D] rounded-3xl border border-[#1E2534] shadow-xl flex flex-col justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-black uppercase text-emerald-400 tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>PRÓXIMO OBJETIVO</span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-md border text-[11px] font-bold ${getInstitutionBadgeColor(absoluteNextEvent.institution)}`}>
                    {absoluteNextEvent.institution}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {absoluteNextEvent.name}
                  </h3>
                  <p className="text-xs text-[#A3A3A3] mt-1">
                    Data: <strong className="text-white font-mono">{new Date(absoluteNextEvent.date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</strong> às <strong className="text-white font-mono">{new Date(absoluteNextEvent.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                  </p>
                </div>
              </div>

              {/* DÍGITOS DA CONTAGEM REGRESSIVA */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#1E2534]">
                {timeLeft ? (
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Dias */}
                    <div className="flex flex-col items-center">
                      <div className="w-13 h-13 sm:w-16 sm:h-16 bg-[#0A0D14] border border-[#232B3C] rounded-2xl flex items-center justify-center shadow-inner">
                        <span className="text-xl sm:text-2xl font-black text-white font-mono leading-none">
                          {String(timeLeft.days).padStart(2, "0")}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#A3A3A3] font-bold uppercase mt-1">Dias</span>
                    </div>

                    <span className="text-base font-bold text-[#4B5563] -mt-4">:</span>

                    {/* Horas */}
                    <div className="flex flex-col items-center">
                      <div className="w-13 h-13 sm:w-16 sm:h-16 bg-[#0A0D14] border border-[#232B3C] rounded-2xl flex items-center justify-center shadow-inner">
                        <span className="text-xl sm:text-2xl font-black text-white font-mono leading-none">
                          {String(timeLeft.hours).padStart(2, "0")}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#A3A3A3] font-bold uppercase mt-1">Horas</span>
                    </div>

                    <span className="text-base font-bold text-[#4B5563] -mt-4">:</span>

                    {/* Minutos */}
                    <div className="flex flex-col items-center">
                      <div className="w-13 h-13 sm:w-16 sm:h-16 bg-[#0A0D14] border border-[#232B3C] rounded-2xl flex items-center justify-center shadow-inner">
                        <span className="text-xl sm:text-2xl font-black text-white font-mono leading-none">
                          {String(timeLeft.minutes).padStart(2, "0")}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#A3A3A3] font-bold uppercase mt-1">Min</span>
                    </div>

                    <span className="text-base font-bold text-[#4B5563] -mt-4">:</span>

                    {/* Segundos */}
                    <div className="flex flex-col items-center">
                      <div className="w-13 h-13 sm:w-16 sm:h-16 bg-[#0A0D14] border border-blue-500/40 rounded-2xl flex items-center justify-center shadow-inner">
                        <span className="text-xl sm:text-2xl font-black text-blue-400 font-mono leading-none animate-pulse">
                          {String(timeLeft.seconds).padStart(2, "0")}
                        </span>
                      </div>
                      <span className="text-[10px] text-blue-400 font-bold uppercase mt-1">Seg</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-[#A3A3A3]">
                    <RefreshCw className="animate-spin text-blue-400" size={16} />
                    <span>Calculando tempo restante...</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleOpenDetailedModal(absoluteNextEvent)}
                  className="px-4 py-2 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 text-xs font-bold border border-blue-500/30 transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
                >
                  <MapPin size={13} />
                  <span>{absoluteNextEvent.localDeProva ? "Ver Local de Prova" : "Definir Local de Prova"}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full p-6 bg-[#10141D] border border-[#1E2534] rounded-3xl flex items-center gap-4 text-[#A3A3A3]">
              <CalendarIcon size={24} className="text-blue-400" />
              <p className="text-sm">Nenhum exame cadastrado no momento. Use o botão acima para adicionar suas provas.</p>
            </div>
          )}
        </div>

        {/* DIREITA: ALERTAS & PRÓXIMAS DATAS */}
        <div className="p-6 bg-[#10141D] rounded-3xl border border-[#1E2534] shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E2534]">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Bell size={14} className="text-amber-400" />
                <span>Alertas de Provas</span>
              </h3>
              <span className="text-[11px] font-mono text-[#A3A3A3]">{alerts.length} alertas</span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto scrollbar-thin pr-1">
              {alerts.length > 0 ? (
                alerts.map((al, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleOpenDetailedModal(al.event)}
                    className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 cursor-pointer hover:bg-amber-500/15 transition-all flex items-start gap-2.5"
                  >
                    <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">{al.event.name}</p>
                      <p className="text-[11px] text-amber-300 font-medium">Faltam {al.daysLeft} dias para este exame!</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-[#151A24] border border-[#1E2534] text-center text-xs text-[#737373]">
                  Nenhum exame nos próximos 7 dias. Foco nos estudos!
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-[#1E2534]">
            <button
              onClick={() => setActiveView("list")}
              className="w-full py-2 bg-[#151A24] hover:bg-[#1E2534] text-xs font-bold text-blue-400 rounded-xl border border-[#232B3C] text-center transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Ver todas as datas ({events.length})</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* CARD PRÓXIMA DATA DO SISU (INTEGRAÇÃO COM SIMULADOR SISU) */}
      {(() => {
        const sisuEvent = events.find((ev) => ev.name.toUpperCase().includes("SISU"));
        if (!sisuEvent) return null;
        return (
          <div className="p-5 rounded-3xl bg-[#10141D] border border-[#1E2534] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/15 text-blue-400 flex items-center justify-center shrink-0">
                <CalendarDays size={20} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-white">{sisuEvent.name}</h3>
                  {sisuEvent.oficial === false && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      a confirmar pelo MEC
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#A3A3A3] mt-0.5">
                  Previsão: <strong className="text-white">{new Date(sisuEvent.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</strong> · {sisuEvent.notes}
                </p>
              </div>
            </div>
            {onNavegarParaAba && (
              <button
                type="button"
                onClick={() => onNavegarParaAba("sisu")}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 shrink-0 cursor-pointer transition-colors"
              >
                <span>Abrir Simulador Sisu</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* 3. BARRA DE COMANDO: SELETOR DE MODOS, FILTROS E BUSCA                   */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* SELETOR DE VISUALIZAÇÃO PRINCIPAL */}
          <div className="flex flex-wrap bg-[#10141D] p-1.5 rounded-2xl border border-[#1E2534] gap-1.5 items-center">
            <button
              id="btn-abrir-cronograma"
              onClick={() => setActiveView("weekly")}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                activeView === "weekly"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-[#A3A3A3] hover:text-white hover:bg-[#151A24]"
              }`}
              title="Acessar Meu Cronograma & Planejamento Semanal (IA)"
            >
              <Sparkles size={14} className={activeView === "weekly" ? "text-white animate-pulse" : "text-blue-400"} />
              <span>Meu Cronograma & Planejamento (IA)</span>
            </button>

            <button
              onClick={() => setActiveView("calendar")}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                activeView === "calendar"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-[#A3A3A3] hover:text-white hover:bg-[#151A24]"
              }`}
            >
              <CalendarDays size={14} />
              <span>Exibição em Calendário</span>
            </button>

            <button
              onClick={() => setActiveView("list")}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                activeView === "list"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-[#A3A3A3] hover:text-white hover:bg-[#151A24]"
              }`}
            >
              <Filter size={14} />
              <span>Lista de Vestibulares ({filteredEvents.length})</span>
            </button>
          </div>

          {/* BUSCA RÁPIDA */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]" size={15} />
            <input
              type="text"
              placeholder="Buscar exames ou notas..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#10141D] border border-[#1E2534] text-xs focus:outline-none focus:border-blue-500 text-white transition-all font-medium placeholder-[#737373]"
            />
            {searchText && (
              <button
                onClick={() => setSearchText("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#737373] hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* FILTROS POR INSTITUIÇÃO (VISÍVEIS PARA CALENDÁRIO E LISTA) */}
        {activeView !== "weekly" && (
          <div className="flex flex-wrap items-center gap-1.5 py-1.5 bg-[#10141D] p-3 rounded-2xl border border-[#1E2534]">
            <span className="text-[10px] uppercase font-black text-[#737373] px-2 tracking-wider mr-1">
              Filtro Rápido:
            </span>
            {["Todos", "ENEM", "FUVEST", "UNICAMP", "UNESP", "ITA", "Outros"].map((cat) => {
              const isActive = selectedInstFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedInstFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-[#A3A3A3] hover:text-white hover:bg-[#151A24]"
                  }`}
                >
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. VISUALIZAÇÃO ATIVA                                                     */}
      {/* ========================================================================= */}
      <AnimatePresence mode="wait">
        {/* MODO 1: MEU CRONOGRAMA & PLANEJAMENTO (IA) UNIFICADO */}
        {activeView === "weekly" ? (
          <motion.div
            key="weekly"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <PlanejamentoSemanalView
              onAbrirDiagnostico={() => window.dispatchEvent(new CustomEvent('abrir-onboarding'))}
              onNavegarParaAba={onNavegarParaAba}
            />
          </motion.div>
        ) : activeView === "calendar" ? (
          /* MODO 2: EXIBIÇÃO EM CALENDÁRIO INTERATIVO */
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="bg-[#10141D] p-6 sm:p-8 rounded-3xl border border-[#1E2534] shadow-xl space-y-6">
              {/* CABEÇALHO DO MÊS */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2534]">
                <div className="flex items-center gap-3">
                  <CalendarDays className="text-blue-400" size={24} />
                  <div>
                    <h3 className="text-xl font-black text-white">
                      {monthsPortuguese[currentMonth]} de {currentYear}
                    </h3>
                    <p className="text-xs text-[#A3A3A3]">
                      {monthEvents.length} exames previstos para este mês
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleJumpToToday}
                    className="px-3 py-1.5 text-xs font-bold bg-[#151A24] hover:bg-[#1E2534] text-[#D1D5DB] border border-[#232B3C] rounded-lg transition-colors cursor-pointer"
                  >
                    Mês Atual
                  </button>
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-2 border border-[#232B3C] bg-[#151A24] hover:bg-[#1E2534] text-white rounded-lg transition-colors cursor-pointer"
                    title="Mês anterior"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-2 border border-[#232B3C] bg-[#151A24] hover:bg-[#1E2534] text-white rounded-lg transition-colors cursor-pointer"
                    title="Próximo mês"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* CABEÇALHO DOS DIAS DA SEMANA */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold uppercase tracking-wider text-[#737373]">
                <div>Dom</div>
                <div>Seg</div>
                <div>Ter</div>
                <div>Qua</div>
                <div>Qui</div>
                <div>Sex</div>
                <div>Sáb</div>
              </div>

              {/* GRID DOS DIAS */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {calendarCells.map((day, idx) => {
                  if (day === null) {
                    return <div key={`empty-${idx}`} className="h-20 sm:h-24 bg-transparent rounded-2xl" />;
                  }

                  const hasEvents = monthEvents.filter((e) => {
                    const d = new Date(e.date);
                    return d.getUTCDate() === day;
                  });

                  const isToday =
                    todayDate.getFullYear() === currentYear &&
                    todayDate.getMonth() === currentMonth &&
                    todayDate.getDate() === day;

                  const isSelected = selectedCalendarDay === day;

                  return (
                    <div
                      key={`day-${day}`}
                      onClick={() => {
                        setSelectedCalendarDay(day);
                        if (hasEvents.length > 0) {
                          handleOpenDetailedModal(hasEvents[0]);
                        }
                      }}
                      className={`h-20 sm:h-24 p-2 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? "border-blue-500 bg-blue-600/10 shadow-md shadow-blue-900/20"
                          : isToday
                          ? "border-emerald-500/50 bg-emerald-500/5"
                          : hasEvents.length > 0
                          ? "border-[#2A354C] bg-[#151D2C] hover:border-blue-500/50"
                          : "border-[#1E2534] bg-[#10141D] hover:bg-[#151A24]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isToday ? "text-emerald-400" : isSelected ? "text-blue-400" : "text-white"}`}>
                          {day}
                        </span>
                        {isToday && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        )}
                      </div>

                      {/* Chips de exames */}
                      <div className="space-y-1 overflow-hidden">
                        {hasEvents.slice(0, 2).map((e) => (
                          <div
                            key={e.id}
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded truncate ${getInstitutionBadgeColor(e.institution)}`}
                            title={`${e.name} (${e.institution})`}
                          >
                            {e.institution}
                          </div>
                        ))}
                        {hasEvents.length > 2 && (
                          <span className="text-[9px] text-[#A3A3A3] font-bold block truncate">
                            +{hasEvents.length - 2} mais
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* PAINEL DE DETALHES DO DIA SELECIONADO */}
              <div className="pt-6 border-t border-[#1E2534] space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <CalendarIcon size={15} className="text-blue-400" />
                    <span>Exames em {selectedCalendarDay} de {monthsPortuguese[currentMonth]}</span>
                  </h4>
                  <span className="text-xs text-[#737373] font-mono">{selectedDayEvents.length} exames</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedDayEvents.map((e) => {
                    const daysLeft = vestibularEventService.daysRemaining(e.date);
                    return (
                      <div
                        key={e.id}
                        onClick={() => handleOpenDetailedModal(e)}
                        className="p-4 rounded-2xl bg-[#151A24] border border-[#232B3C] hover:border-blue-500/40 cursor-pointer transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getInstitutionBadgeColor(e.institution)}`}>
                              {e.institution}
                            </span>
                            <h5 className="font-bold text-sm text-white mt-1.5">{e.name}</h5>
                          </div>
                          <span className="text-xs font-mono text-blue-400 shrink-0">
                            {daysLeft < 0 ? "Realizado" : daysLeft === 0 ? "Hoje!" : `${daysLeft}d`}
                          </span>
                        </div>

                        {e.notes && (
                          <p className="text-xs text-[#A3A3A3] line-clamp-2 leading-relaxed">{e.notes}</p>
                        )}

                        <div className="pt-2 border-t border-[#1E2534] flex items-center justify-between text-xs text-blue-400 font-semibold">
                          <span className="truncate">{e.localDeProva ? `📍 ${e.localDeProva}` : "+ Definir Local"}</span>
                          <ChevronRight size={13} />
                        </div>
                      </div>
                    );
                  })}

                  {selectedDayEvents.length === 0 && (
                    <div className="col-span-full py-8 text-center text-xs text-[#737373] italic bg-[#151A24]/40 rounded-2xl border border-[#1E2534]">
                      Nenhum exame agendado para o dia {selectedCalendarDay}. Clique em outro dia com exames ou agende uma nova prova.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* MODO 3: LISTA COMPLETA DE VESTIBULARES */
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="bg-[#10141D] p-6 rounded-3xl border border-[#1E2534] shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E2534]">
                <div>
                  <h3 className="text-base font-bold text-white">Todos os Exames & Vestibulares</h3>
                  <p className="text-xs text-[#A3A3A3]">Exibindo {filteredEvents.length} datas cadastradas no sistema</p>
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>Novo Exame</span>
                </button>
              </div>

              <div className="space-y-3">
                {filteredEvents.map((e) => {
                  const daysLeft = vestibularEventService.daysRemaining(e.date);
                  return (
                    <div
                      key={e.id}
                      className="p-5 bg-[#151A24] border border-[#232B3C] rounded-2xl hover:border-blue-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getInstitutionBadgeColor(e.institution)}`}>
                            {e.institution}
                          </span>
                          <h4 className="text-base font-bold text-white">{e.name}</h4>
                        </div>

                        {e.notes && (
                          <p className="text-xs text-[#A3A3A3] leading-relaxed max-w-2xl line-clamp-2">
                            {e.notes}
                          </p>
                        )}

                        <div className="pt-1 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleOpenDetailedModal(e)}
                            className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                          >
                            <MapPin size={13} />
                            <span>{e.localDeProva ? e.localDeProva : "Definir local de prova"}</span>
                          </button>

                          {e.dicasTransporte && (
                            <span className="text-xs text-[#737373] flex items-center gap-1">
                              <Car size={13} />
                              <span className="truncate max-w-xs">{e.dicasTransporte}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-[#1E2534] shrink-0">
                        <div className="text-right">
                          <p className="text-sm font-mono font-bold text-white">
                            {new Date(e.date).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-[11px] font-semibold mt-0.5">
                            {daysLeft < 0 ? (
                              <span className="text-[#737373]">Concluído</span>
                            ) : daysLeft === 0 ? (
                              <span className="text-emerald-400 font-bold animate-pulse">Hoje!</span>
                            ) : (
                              <span className="text-blue-400">Faltam {daysLeft} dias</span>
                            )}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenDetailedModal(e)}
                            className="p-2 text-[#A3A3A3] hover:text-white hover:bg-[#1E2534] rounded-lg transition-colors cursor-pointer"
                            title="Editar detalhes e local"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteEvent(e.id)}
                            className="p-2 text-[#A3A3A3] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Excluir este exame"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredEvents.length === 0 && (
                  <div className="text-center py-12 text-[#737373] text-xs italic">
                    Nenhum vestibular encontrado para os filtros selecionados.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 5. MODAL: AGENDAR NOVO EXAME                                              */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#10141D] border border-[#1E2534] p-6 sm:p-8 rounded-3xl w-full max-w-lg shadow-2xl relative space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#1E2534]">
                <div className="flex items-center gap-2 text-blue-400">
                  <CalendarIcon size={20} />
                  <h3 className="text-base font-bold text-white">Agendar Novo Exame / Prova</h3>
                </div>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-1 text-[#737373] hover:text-white rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddEvent} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-[#A3A3A3]">Nome da Prova</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: ENEM 2026 - 1º Dia de Provas"
                    value={newEventName}
                    onChange={(e) => setNewEventName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#151A24] border border-[#232B3C] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-[#A3A3A3]">Instituição / Banca</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: INEP, FUVEST, UNICAMP, UNESP"
                    value={newEventInst}
                    onChange={(e) => setNewEventInst(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#151A24] border border-[#232B3C] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-[#A3A3A3]">Data e Hora</label>
                    <input
                      type="datetime-local"
                      required
                      value={newEventDate}
                      onChange={(e) => setNewEventDate(e.target.value)}
                      className="w-full px-3 py-2 bg-[#151A24] border border-[#232B3C] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-[#A3A3A3]">Alerta Prévio (Dias)</label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={newEventAlertDays}
                      onChange={(e) => setNewEventAlertDays(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#151A24] border border-[#232B3C] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-[#A3A3A3]">Observações / Checklist (Opcional)</label>
                  <textarea
                    placeholder="Ex: Caneta preta de tubo transparente, documento com foto, lanche leve..."
                    value={newEventNotes}
                    onChange={(e) => setNewEventNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-[#151A24] border border-[#232B3C] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-medium resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-3 border-t border-[#1E2534]">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-2.5 text-xs font-bold border border-[#232B3C] rounded-xl text-[#A3A3A3] hover:text-white hover:bg-[#151A24] transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {saving ? <RefreshCw className="animate-spin" size={13} /> : null}
                    <span>Cadastrar Exame</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 6. MODAL: DETALHES DO EXAME, LOCAL DE PROVA & ANOTAÇÕES                  */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#10141D] border border-[#1E2534] p-6 sm:p-8 rounded-3xl w-full max-w-2xl shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* TOPO DO MODAL */}
              <div className="flex items-start justify-between pb-4 border-b border-[#1E2534]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${getInstitutionBadgeColor(selectedEvent.institution)}`}>
                      {selectedEvent.institution}
                    </span>
                    <span className="text-xs text-[#737373]">
                      {new Date(selectedEvent.date).toLocaleDateString('pt-BR')} às {new Date(selectedEvent.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white mt-1">{selectedEvent.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-1 text-[#737373] hover:text-white rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* SEÇÃO 1: ANOTAÇÕES & CHECKLIST */}
              <div className="p-4 rounded-2xl bg-[#151A24] border border-[#232B3C] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <span>📝 Anotações & Checklist do Candidato</span>
                  </h4>
                  {!editingNotes && (
                    <button
                      type="button"
                      onClick={() => {
                        setTemporaryNotes(selectedEvent.notes || "");
                        setEditingNotes(true);
                      }}
                      className="text-[11px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 size={12} />
                      <span>Editar</span>
                    </button>
                  )}
                </div>

                {editingNotes ? (
                  <div className="space-y-2">
                    <textarea
                      value={temporaryNotes}
                      onChange={(e) => setTemporaryNotes(e.target.value)}
                      placeholder="Ex: Levar documento original com foto, duas canetas pretas de tubo transparente, água sem rótulo..."
                      rows={3}
                      className="w-full p-3 bg-[#0A0D14] border border-[#232B3C] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-medium resize-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setEditingNotes(false)}
                        className="px-3 py-1 text-xs bg-[#1E2534] hover:bg-[#252E42] text-[#A3A3A3] rounded-lg cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        disabled={savingNotes}
                        onClick={handleSaveNotes}
                        className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {savingNotes ? <RefreshCw className="animate-spin" size={11} /> : null}
                        <span>Salvar</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#A3A3A3] leading-relaxed">
                    {selectedEvent.notes || "Nenhuma anotação configurada. Adicione exigências, documentos ou lanches!"}
                  </p>
                )}
              </div>

              {/* SEÇÃO 2: LOCAL DE PROVA & DICAS DE TRANSPORTE */}
              {selectedEvent.localDeProva ? (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/20 via-[#151A24] to-[#10141D] border border-blue-500/30 space-y-4">
                  <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
                    <MapPin size={14} />
                    <span>Local de Prova Confirmado</span>
                  </div>

                  <div>
                    <h4 className="text-lg font-black text-white">{selectedEvent.localDeProva}</h4>
                    <p className="text-xs text-[#A3A3A3] mt-0.5">{selectedEvent.enderecoDeProva}</p>
                  </div>

                  {selectedEvent.dicasTransporte && (
                    <div className="p-3 bg-[#0A0D14] border border-[#232B3C] rounded-xl flex items-start gap-2 text-xs text-[#D1D5DB]">
                      <Car size={15} className="text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block mb-0.5">Dicas de Transporte:</strong>
                        <span className="text-[#A3A3A3]">{selectedEvent.dicasTransporte}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2.5 pt-1">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedEvent.localDeProva} ${selectedEvent.enderecoDeProva}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <ExternalLink size={13} />
                      <span>Abrir no Google Maps</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        if (selectedEvent.enderecoDeProva) {
                          navigator.clipboard.writeText(selectedEvent.enderecoDeProva);
                          setCopiadoEndereco(true);
                          setTimeout(() => setCopiadoEndereco(false), 2000);
                        }
                      }}
                      className="px-4 py-2 bg-[#1E2534] hover:bg-[#252E42] text-white font-bold text-xs rounded-xl border border-[#2A354C] flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      {copiadoEndereco ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      <span>{copiadoEndereco ? "Copiado!" : "Copiar Endereço"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedEvent((prev) =>
                          prev
                            ? {
                                ...prev,
                                localDeProva: undefined,
                                enderecoDeProva: undefined,
                                dicasTransporte: undefined,
                              }
                            : null,
                        );
                        setSelectedPresetIndex(0);
                        setSelectedVenueType("preset");
                      }}
                      className="px-3 py-2 text-xs font-bold text-[#A3A3A3] hover:text-white rounded-xl transition-colors cursor-pointer"
                    >
                      Alterar
                    </button>

                    <button
                      type="button"
                      onClick={handleClearLocation}
                      className="px-3 py-2 text-xs font-bold text-rose-400 hover:text-rose-300 rounded-xl transition-colors cursor-pointer ml-auto"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ) : (
                /* CONFIGURAÇÃO DO LOCAL DE PROVA */
                <form onSubmit={handleSaveLocation} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white flex items-center gap-2">
                      <MapPin size={14} className="text-blue-400" />
                      <span>Onde você fará esta prova?</span>
                    </h4>

                    {/* Alternador de tipo de local */}
                    <div className="flex bg-[#0A0D14] p-1 rounded-xl border border-[#232B3C] text-xs">
                      <button
                        type="button"
                        onClick={() => setSelectedVenueType("preset")}
                        className={`px-3 py-1 rounded-lg font-bold transition-all ${
                          selectedVenueType === "preset"
                            ? "bg-blue-600 text-white"
                            : "text-[#A3A3A3] hover:text-white"
                        }`}
                      >
                        Pólos Comuns
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedVenueType("custom")}
                        className={`px-3 py-1 rounded-lg font-bold transition-all ${
                          selectedVenueType === "custom"
                            ? "bg-blue-600 text-white"
                            : "text-[#A3A3A3] hover:text-white"
                        }`}
                      >
                        Digitar Manual
                      </button>
                    </div>
                  </div>

                  {selectedVenueType === "preset" ? (
                    <div className="space-y-2 max-h-52 overflow-y-auto scrollbar-thin pr-1">
                      {getVenuesForEvent(selectedEvent).map((v, index) => (
                        <div
                          key={index}
                          onClick={() => setSelectedPresetIndex(index)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                            selectedPresetIndex === index
                              ? "border-blue-500 bg-blue-600/10"
                              : "border-[#232B3C] bg-[#151A24] hover:bg-[#1E2534]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <h5 className="font-bold text-xs text-white">{v.name}</h5>
                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${selectedPresetIndex === index ? "border-blue-500 bg-blue-500" : "border-[#4B5563]"}`}>
                              {selectedPresetIndex === index && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </div>
                          <p className="text-[11px] text-[#A3A3A3] mt-1">{v.address}</p>
                          {v.tips && selectedPresetIndex === index && (
                            <p className="text-[10px] text-blue-300 mt-2 pt-1 border-t border-[#232B3C]">{v.tips}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#A3A3A3] block mb-1">Local / Prédio</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Escola Estadual Maria de Lourdes - Bloco B"
                          value={customLocalName}
                          onChange={(e) => setCustomLocalName(e.target.value)}
                          className="w-full px-3 py-2 bg-[#0A0D14] border border-[#232B3C] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#A3A3A3] block mb-1">Endereço Completo</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Rua das Flores, 120 - Centro, São Paulo - SP"
                          value={customEndereco}
                          onChange={(e) => setCustomEndereco(e.target.value)}
                          className="w-full px-3 py-2 bg-[#0A0D14] border border-[#232B3C] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#A3A3A3] block mb-1">Dicas de Transporte (Opcional)</label>
                        <input
                          type="text"
                          placeholder="Ex: Metrô Linha Azul, descer na estação Sé e caminhar 5 min"
                          value={customDicas}
                          onChange={(e) => setCustomDicas(e.target.value)}
                          className="w-full px-3 py-2 bg-[#0A0D14] border border-[#232B3C] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={
                        savingLocation ||
                        (selectedVenueType === "preset" && selectedPresetIndex === -1) ||
                        (selectedVenueType === "custom" && (!customLocalName || !customEndereco))
                      }
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      {savingLocation ? <RefreshCw className="animate-spin" size={13} /> : null}
                      <span>Salvar Local de Prova</span>
                    </button>
                  </div>
                </form>
              )}

              <div className="pt-4 border-t border-[#1E2534] flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="px-5 py-2.5 bg-[#151A24] hover:bg-[#1E2534] text-white text-xs font-bold rounded-xl border border-[#232B3C] transition-colors cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
