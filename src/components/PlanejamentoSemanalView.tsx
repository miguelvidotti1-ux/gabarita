import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Sparkles,
  Target,
  Zap,
  TrendingUp,
  RefreshCw,
  BookOpen,
  ArrowRight,
  Layers,
  Award,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Edit3,
  Check,
  Save,
  ListTodo,
  Sliders,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  PlanejamentoSemanalService,
  PlanejamentoSemanalData,
  WeeklyStudyDay,
  WeeklyStudySlot
} from '../services/planejamentoSemanalService';

export interface CronogramaSemana {
  week: number;
  topic: string;
  focus: string;
  estimatedHours: number;
}

interface PlanejamentoSemanalViewProps {
  onAbrirDiagnostico?: () => void;
  onNavegarParaAba?: (aba: string) => void;
  subAbaInicial?: 'grade' | 'roteiro';
}

const MATERIAS_SUGESTOES = [
  'Matemática',
  'Física',
  'Química',
  'Biologia',
  'História',
  'Geografia',
  'Português',
  'Redação',
  'Filosofia',
  'Sociologia',
  'Inglês'
];

export const PlanejamentoSemanalView: React.FC<PlanejamentoSemanalViewProps> = ({
  onAbrirDiagnostico,
  onNavegarParaAba,
  subAbaInicial = 'grade'
}) => {
  // Estado da Grade Diária
  const [plano, setPlano] = useState<PlanejamentoSemanalData | null>(null);
  const [diaSelecionado, setDiaSelecionado] = useState<number>(0);
  const [visaoGrade, setVisaoGrade] = useState<'dia' | 'semana'>('dia');
  const [animandoSlot, setAnimandoSlot] = useState<string | null>(null);

  // Estado Unificado: Alternador Principal ('grade' = Grade Diária / 'roteiro' = Roteiro Macro de Semanas)
  const [modoPrincipal, setModoPrincipal] = useState<'grade' | 'roteiro'>(subAbaInicial);

  // Estado do Roteiro Macro (Meu Cronograma - 8+ semanas)
  const [semanas, setSemanas] = useState<CronogramaSemana[]>([]);
  const [carregandoSemanas, setCarregandoSemanas] = useState<boolean>(false);
  const [salvandoSemanas, setSalvandoSemanas] = useState<boolean>(false);
  const [regenerandoIdx, setRegenerandoIdx] = useState<number | null>(null);
  const [editandoIdx, setEditandoIdx] = useState<number | null>(null);
  const [editCampo, setEditCampo] = useState<'topic' | 'focus' | 'estimatedHours' | null>(null);
  const [editValor, setEditValor] = useState<string>('');
  const [feedbackStatus, setFeedbackStatus] = useState<{ tipo: 'sucesso' | 'erro' | 'info'; mensagem: string } | null>(null);
  const [semanaAtivaFoco, setSemanaAtivaFoco] = useState<number>(1);

  useEffect(() => {
    carregarOuGerarPlano();
    carregarSemanas();

    // Ouvir evento global para abrir a aba macro diretamente
    const handleAbrirMacro = () => {
      setModoPrincipal('roteiro');
    };
    window.addEventListener('abrir-cronograma-macro', handleAbrirMacro);

    return () => {
      window.removeEventListener('abrir-cronograma-macro', handleAbrirMacro);
    };
  }, []);

  // 1. Carregar Grade Diária de Horários
  const carregarOuGerarPlano = () => {
    let data = PlanejamentoSemanalService.carregar();
    if (!data) {
      let perfil: any = {};
      try {
        const raw = localStorage.getItem('vestibularpro_resumo_plano');
        if (raw) perfil = JSON.parse(raw);
        const userProf = localStorage.getItem('vestibularpro_user_profile');
        if (userProf) {
          const u = JSON.parse(userProf);
          if (u.piores_materias) perfil.piores_materias = u.piores_materias;
          if (u.vestibulares_alvo) perfil.vestibulares = u.vestibulares_alvo;
        }
      } catch (e) {}

      data = PlanejamentoSemanalService.gerar(perfil);
    }
    setPlano(data);

    const hoje = new Date().getDay();
    const diaIndex = hoje === 0 ? 6 : hoje - 1;
    setDiaSelecionado(diaIndex);
  };

  // 2. Carregar Roteiro Macro de Semanas
  const carregarSemanas = async () => {
    setCarregandoSemanas(true);
    let semanasCarregadas: CronogramaSemana[] | null = null;

    // Tenta carregar do backend
    try {
      const headers: Record<string, string> = {};
      try {
        const sessao = localStorage.getItem('vestibularpro_session_user');
        if (sessao) {
          const u = JSON.parse(sessao);
          if (u.uid) headers['x-usuario-id'] = u.uid;
        }
      } catch (_) {}

      const res = await fetch('/api/cronograma', { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.existe && Array.isArray(data.cronograma?.semanas) && data.cronograma.semanas.length > 0) {
          semanasCarregadas = data.cronograma.semanas;
        }
      }
    } catch (err) {
      console.warn('Erro ao carregar cronograma remoto:', err);
    }

    // Fallback para cache local
    if (!semanasCarregadas) {
      try {
        const local = localStorage.getItem('cronograma_semanas_salvas');
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            semanasCarregadas = parsed;
          }
        }
      } catch (_) {}
    }

    // Se ainda não existir, gera plano base com IA
    if (!semanasCarregadas || semanasCarregadas.length === 0) {
      try {
        const r = await fetch('/api/gemini/study-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ weakSubjects: plano?.pioresMaterias || [], upcomingExams: plano?.vestibulares || ['ENEM'], weeks: 8 })
        });
        if (r.ok) {
          const gerado = await r.json();
          if (Array.isArray(gerado) && gerado.length > 0) {
            semanasCarregadas = gerado;
            localStorage.setItem('cronograma_semanas_salvas', JSON.stringify(gerado));
          }
        }
      } catch (err) {
        console.warn('Erro ao gerar plano inicial via Gemini:', err);
      }
    }

    // Fallback padrão robusto de 8 semanas se a API offline
    if (!semanasCarregadas || semanasCarregadas.length === 0) {
      semanasCarregadas = [
        { week: 1, topic: 'Funções Matemáticas & Termodinâmica', focus: 'Fundamentos de cálculo, gráficos e calorimetria para o ENEM', estimatedHours: 12 },
        { week: 2, topic: 'Estequiometria & Eletrodinâmica', focus: 'Relações molares, circuitos elétricos e Leis de Ohm', estimatedHours: 14 },
        { week: 3, topic: 'Ecologia, Genética & Biologia Celular', focus: 'Ciclos biogeoquímicos, mitose e 1ª Lei de Mendel', estimatedHours: 12 },
        { week: 4, topic: 'Redação Dissertativa & Argumentação', focus: 'Estruturação de tese, repertórios socioculturais e proposta de intervenção', estimatedHours: 10 },
        { week: 5, topic: 'Brasil Colônia, Império & Cidadania', focus: 'Ciclos econômicos, escravismo e formação social brasileira', estimatedHours: 12 },
        { week: 6, topic: 'Geometria Espacial & Funções Orgânicas', focus: 'Prismas, pirâmides, isomeria e reações de hidrocarbonetos', estimatedHours: 14 },
        { week: 7, topic: 'Simulado Geral & Revisão de Erros', focus: 'Treinamento de tempo de prova e diagnóstico de deficiências', estimatedHours: 16 },
        { week: 8, topic: 'Reta Final: Fórmulas Chave & Estratégia TRI', focus: 'Fixação de macetes, calma emocional e priorização de questões fáceis', estimatedHours: 10 }
      ];
    }

    setSemanas(semanasCarregadas);
    setCarregandoSemanas(false);
  };

  // 3. Salvar Roteiro Macro no Backend e Local
  const handleSalvarCronograma = async () => {
    setSalvandoSemanas(true);
    setFeedbackStatus({ tipo: 'info', mensagem: 'Salvando seu cronograma...' });

    try {
      localStorage.setItem('cronograma_semanas_salvas', JSON.stringify(semanas));
    } catch (_) {}

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      try {
        const sessao = localStorage.getItem('vestibularpro_session_user');
        if (sessao) {
          const u = JSON.parse(sessao);
          if (u.uid) headers['x-usuario-id'] = u.uid;
        }
      } catch (_) {}

      const res = await fetch('/api/cronograma', {
        method: 'POST',
        headers,
        body: JSON.stringify({ cronograma: semanas })
      });

      const d = await res.json();
      if (d.sucesso) {
        setFeedbackStatus({ tipo: 'sucesso', mensagem: 'Cronograma e semanas salvos com sucesso!' });
      } else {
        setFeedbackStatus({ tipo: 'sucesso', mensagem: 'Cronograma salvo em cache local!' });
      }
    } catch (err) {
      setFeedbackStatus({ tipo: 'sucesso', mensagem: 'Cronograma salvo no seu dispositivo!' });
    } finally {
      setSalvandoSemanas(false);
      setTimeout(() => setFeedbackStatus(null), 3500);
    }
  };

  // 4. Regenerar uma única semana com IA
  const handleRegenerarSemana = async (index: number) => {
    const alvo = semanas[index];
    if (!alvo) return;

    setRegenerandoIdx(index);
    setFeedbackStatus({ tipo: 'info', mensagem: `Regenerando Semana ${alvo.week} com IA...` });

    try {
      const res = await fetch('/api/cronograma/regenerar-semana', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          week: alvo.week,
          weakSubjects: plano?.pioresMaterias || [],
          upcomingExams: plano?.vestibulares || ['ENEM']
        })
      });

      if (res.ok) {
        const nova = await res.json();
        if (!nova.erro && nova.topic) {
          const atualizadas = [...semanas];
          atualizadas[index] = nova;
          setSemanas(atualizadas);
          setFeedbackStatus({ tipo: 'sucesso', mensagem: `Semana ${alvo.week} atualizada pela IA!` });
        }
      }
    } catch (err) {
      setFeedbackStatus({ tipo: 'erro', mensagem: 'Não foi possível regenerar esta semana agora.' });
    } finally {
      setRegenerandoIdx(null);
      setTimeout(() => setFeedbackStatus(null), 3500);
    }
  };

  // 5. Regenerar todo o cronograma com IA
  const handleRegenerarTudoIA = async () => {
    setCarregandoSemanas(true);
    setFeedbackStatus({ tipo: 'info', mensagem: 'Gerando roteiro completo de 8 semanas com IA...' });

    try {
      const r = await fetch('/api/gemini/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weakSubjects: plano?.pioresMaterias || [],
          upcomingExams: plano?.vestibulares || ['ENEM'],
          weeks: 8
        })
      });
      if (r.ok) {
        const gerado = await r.json();
        if (Array.isArray(gerado) && gerado.length > 0) {
          setSemanas(gerado);
          localStorage.setItem('cronograma_semanas_salvas', JSON.stringify(gerado));
          setFeedbackStatus({ tipo: 'sucesso', mensagem: 'Novo roteiro completo gerado com sucesso!' });
        }
      }
    } catch (e) {
      setFeedbackStatus({ tipo: 'erro', mensagem: 'Falha ao conectar com o serviço de IA.' });
    } finally {
      setCarregandoSemanas(false);
      setTimeout(() => setFeedbackStatus(null), 3500);
    }
  };

  // 6. Manipulações de semanas
  const handleAdicionarSemana = () => {
    const proximoNum = Math.max(0, ...semanas.map((s) => Number(s.week) || 0)) + 1;
    const novaSemana: CronogramaSemana = {
      week: proximoNum,
      topic: 'Novo Tópico de Estudo',
      focus: 'Defina o foco e exercícios prioritários desta semana',
      estimatedHours: 10
    };
    const atualizadas = [...semanas, novaSemana];
    setSemanas(atualizadas);
    setEditandoIdx(atualizadas.length - 1);
    setEditCampo('topic');
    setEditValor('Novo Tópico de Estudo');
  };

  const handleMoverSemana = (index: number, direcao: 'up' | 'down') => {
    const destino = direcao === 'up' ? index - 1 : index + 1;
    if (destino < 0 || destino >= semanas.length) return;

    const copia = [...semanas];
    const temp = copia[index];
    copia[index] = copia[destino];
    copia[destino] = temp;

    // Preserva numeração das semanas sequencial
    copia.forEach((s, idx) => {
      s.week = idx + 1;
    });

    setSemanas(copia);
  };

  const handleExcluirSemana = (index: number) => {
    if (semanas.length <= 1) return;
    const filtradas = semanas.filter((_, idx) => idx !== index);
    filtradas.forEach((s, idx) => {
      s.week = idx + 1;
    });
    setSemanas(filtradas);
  };

  const iniciarEdicao = (index: number, campo: 'topic' | 'focus' | 'estimatedHours') => {
    setEditandoIdx(index);
    setEditCampo(campo);
    setEditValor(String(semanas[index][campo]));
  };

  const salvarEdicao = () => {
    if (editandoIdx === null || editCampo === null) return;
    const atualizadas = [...semanas];
    if (editCampo === 'estimatedHours') {
      atualizadas[editandoIdx].estimatedHours = Math.max(1, Math.min(80, Number(editValor) || 0));
    } else {
      atualizadas[editandoIdx][editCampo] = editValor.trim() || (editCampo === 'topic' ? 'Sem tópico' : 'Sem foco definido');
    }
    setSemanas(atualizadas);
    setEditandoIdx(null);
    setEditCampo(null);
  };

  // 7. Ações da Grade Diária
  const handleToggleSlot = (slotId: string) => {
    setAnimandoSlot(slotId);
    setTimeout(() => setAnimandoSlot(null), 400);

    const atualizado = PlanejamentoSemanalService.toggleSlot(slotId);
    if (atualizado) {
      setPlano({ ...atualizado });
    }
  };

  const handleRegenerarGradeDiaria = () => {
    let perfil: any = {};
    try {
      const raw = localStorage.getItem('vestibularpro_resumo_plano');
      if (raw) perfil = JSON.parse(raw);
      const userProf = localStorage.getItem('vestibularpro_user_profile');
      if (userProf) {
        const u = JSON.parse(userProf);
        if (u.piores_materias) perfil.piores_materias = u.piores_materias;
        if (u.vestibulares_alvo) perfil.vestibulares = u.vestibulares_alvo;
      }
    } catch (e) {}

    const novo = PlanejamentoSemanalService.gerar(perfil);
    setPlano(novo);
  };

  if (!plano) {
    return (
      <div className="py-20 text-center space-y-4">
        <Sparkles className="w-10 h-10 text-blue-400 mx-auto animate-pulse" />
        <p className="text-sm text-[#A3A3A3]">Carregando Meu Cronograma & Planejamento...</p>
      </div>
    );
  }

  const progresso = PlanejamentoSemanalService.calcularProgresso(plano);
  const diaAtualObj = plano.dias[diaSelecionado] || plano.dias[0];
  const semanaAtivaObj = semanas.find((s) => s.week === semanaAtivaFoco) || semanas[0];
  const totalHorasMacro = semanas.reduce((acc, s) => acc + (Number(s.estimatedHours) || 0), 0);

  const getTipoBadge = (tipo: WeeklyStudySlot['tipo']) => {
    switch (tipo) {
      case 'simulado':
        return { label: 'Simulado Real', bg: 'bg-amber-500/15 border-amber-500/30 text-amber-300' };
      case 'redacao':
        return { label: 'Redação', bg: 'bg-purple-500/15 border-purple-500/30 text-purple-300' };
      case 'questoes':
        return { label: 'Questões', bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' };
      case 'revisao':
        return { label: 'Revisão', bg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300' };
      case 'teoria':
      default:
        return { label: 'Teoria & Prática', bg: 'bg-blue-500/15 border-blue-500/30 text-blue-300' };
    }
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* ===== HERO UNIFICADO ===== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#10141D] via-[#10141D] to-[#151D30] border border-[#1E2534] p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-bold text-blue-400">
              <Sparkles size={14} className="animate-pulse" />
              <span>MEU CRONOGRAMA & PLANEJAMENTO IA</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#FAFAFA] tracking-tight">
              Meu Cronograma & Planejamento Semanal
            </h1>

            <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed">
              Integração completa: sua grade diária de horários sincronizada ao roteiro macro de {semanas.length} semanas calibrado por IA para os vestibulares.
            </p>

            {/* TAGS DO PERFIL ATIVO & METAS */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="px-3 py-1 rounded-lg bg-[#151A24] border border-[#232B3C] text-[#D1D5DB] font-semibold flex items-center gap-1.5">
                <Clock size={13} className="text-blue-400" />
                Turno: <strong className="text-white">{plano.periodoEstudo}</strong>
              </span>

              <span className="px-3 py-1 rounded-lg bg-[#151A24] border border-[#232B3C] text-[#D1D5DB] font-semibold flex items-center gap-1.5">
                <Zap size={13} className="text-amber-400" />
                Foco: <strong className="text-white">{plano.horarioPico}</strong>
              </span>

              <span className="px-3 py-1 rounded-lg bg-[#151A24] border border-[#232B3C] text-[#D1D5DB] font-semibold flex items-center gap-1.5">
                <Target size={13} className="text-emerald-400" />
                Alvo: <strong className="text-white">{plano.vestibulares.join(', ')}</strong>
              </span>

              <span className="px-3 py-1 rounded-lg bg-[#151A24] border border-[#232B3C] text-[#D1D5DB] font-semibold flex items-center gap-1.5">
                <Calendar size={13} className="text-indigo-400" />
                Roteiro: <strong className="text-white">{semanas.length} Semanas ({totalHorasMacro}h)</strong>
              </span>
            </div>
          </div>

          {/* CARD RESUMO DE METAS */}
          <div className="bg-[#000000]/60 border border-[#1E2534] p-5 rounded-2xl shrink-0 w-full md:w-72 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#A3A3A3] font-medium">Meta da Semana</span>
              <span className="text-blue-400 font-bold text-sm">{progresso.porcentagem}%</span>
            </div>

            <div className="w-full h-2.5 bg-[#1E2534] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progresso.porcentagem}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#737373]">
              <span>{progresso.concluidos} de {progresso.total} blocos feitos</span>
              <span className="text-emerald-400 font-semibold">{progresso.porcentagem}% da meta</span>
            </div>

            <div className="pt-1 flex gap-2">
              <button
                type="button"
                onClick={handleRegenerarGradeDiaria}
                className="flex-1 py-1.5 bg-[#151A24] hover:bg-[#1E2534] text-[11px] font-bold text-[#D1D5DB] rounded-lg border border-[#232B3C] flex items-center justify-center gap-1 transition-colors"
                title="Recalibrar grade horária diária"
              >
                <RefreshCw size={11} />
                Recalibrar
              </button>
              {onAbrirDiagnostico && (
                <button
                  type="button"
                  onClick={onAbrirDiagnostico}
                  className="px-2.5 py-1.5 bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 text-[11px] font-bold rounded-lg border border-blue-500/20 transition-colors"
                  title="Ajustar matérias e turnos no onboarding"
                >
                  Perfil
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FEEDBACK STATUS FLUTUANTE */}
      {feedbackStatus && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between gap-3 transition-all ${
            feedbackStatus.tipo === 'sucesso'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : feedbackStatus.tipo === 'erro'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="shrink-0" />
            <span>{feedbackStatus.mensagem}</span>
          </div>
          <button
            onClick={() => setFeedbackStatus(null)}
            className="text-xs opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* ===== ABAS DE NAVEGAÇÃO DA FUNCIONALIDADE UNIDA ===== */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1E2534] pb-4">
        <div className="flex items-center p-1 bg-[#10141D] rounded-2xl border border-[#1E2534] gap-1">
          <button
            type="button"
            onClick={() => setModoPrincipal('grade')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              modoPrincipal === 'grade'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-[#A3A3A3] hover:text-white hover:bg-[#151A24]'
            }`}
          >
            <Clock size={14} />
            <span>Grade Diária de Horários</span>
          </button>

          <button
            type="button"
            onClick={() => setModoPrincipal('roteiro')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              modoPrincipal === 'roteiro'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-[#A3A3A3] hover:text-white hover:bg-[#151A24]'
            }`}
          >
            <ListTodo size={14} />
            <span>Roteiro Macro ({semanas.length} Semanas)</span>
          </button>
        </div>

        {modoPrincipal === 'roteiro' ? (
          <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleAdicionarSemana}
              className="px-3.5 py-2 rounded-xl bg-[#151A24] border border-[#232B3C] hover:bg-[#1E2534] text-xs font-bold text-blue-400 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} />
              <span>Adicionar Semana</span>
            </button>

            <button
              type="button"
              onClick={handleRegenerarTudoIA}
              disabled={carregandoSemanas}
              className="px-3.5 py-2 rounded-xl bg-purple-600/15 border border-purple-500/30 hover:bg-purple-600/25 text-xs font-bold text-purple-300 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Sparkles size={14} />
              <span>Regenerar com IA</span>
            </button>

            <button
              type="button"
              onClick={handleSalvarCronograma}
              disabled={salvandoSemanas}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/25 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Save size={14} />
              <span>{salvandoSemanas ? 'Salvando...' : 'Salvar Cronograma'}</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setVisaoGrade(visaoGrade === 'dia' ? 'semana' : 'dia')}
              className="px-3.5 py-2 rounded-xl bg-[#10141D] border border-[#1E2534] text-xs font-bold text-[#A3A3A3] hover:text-white hover:bg-[#151A24] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar size={14} />
              <span>{visaoGrade === 'dia' ? 'Ver Semana Completa' : 'Ver Dia Atual'}</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODO 1: GRADE DIÁRIA DE HORÁRIOS                                          */}
      {/* ========================================================================= */}
      {modoPrincipal === 'grade' && (
        <div className="space-y-6">
          {/* BANNER DE SINCRONIA COM O ROTEIRO MACRO */}
          {semanaAtivaObj && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-[#10141D] to-indigo-950/30 border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                  S{semanaAtivaObj.week}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-400">Tópico Ativo no Cronograma:</span>
                    <span className="text-xs font-bold text-white">{semanaAtivaObj.topic}</span>
                  </div>
                  <p className="text-[11px] text-[#A3A3A3] mt-0.5 truncate max-w-xl">
                    Foco: {semanaAtivaObj.focus} • Carga estimada: {semanaAtivaObj.estimatedHours}h
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModoPrincipal('roteiro')}
                className="px-3 py-1.5 rounded-lg bg-[#151A24] hover:bg-[#1E2534] text-blue-400 text-xs font-semibold flex items-center gap-1 self-start sm:self-center transition-colors border border-[#232B3C] shrink-0"
              >
                <span>Ver Roteiro de {semanas.length} Semanas</span>
                <ChevronRight size={13} />
              </button>
            </div>
          )}

          {/* SELETOR DE DIAS DA SEMANA */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-[#10141D] rounded-2xl border border-[#1E2534]">
            {plano.dias.map((d, idx) => {
              const isAtivo = diaSelecionado === idx;
              const concluidosDoDia = d.slots.filter((s) => s.concluido).length;
              const totalDoDia = d.slots.length;
              const dia100 = totalDoDia > 0 && concluidosDoDia === totalDoDia;

              return (
                <button
                  key={d.dia}
                  type="button"
                  onClick={() => {
                    setDiaSelecionado(idx);
                    setVisaoGrade('dia');
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isAtivo
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-[#A3A3A3] hover:text-white hover:bg-[#151A24]'
                  }`}
                >
                  <span>{d.diaCurto}</span>
                  {dia100 ? (
                    <CheckCircle2 size={13} className="text-emerald-400" />
                  ) : (
                    <span className="text-[10px] opacity-70">
                      {concluidosDoDia}/{totalDoDia}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* EXIBIÇÃO: MODO DIA ESPECÍFICO */}
          {visaoGrade === 'dia' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <div>
                  <h2 className="text-lg font-bold text-[#FAFAFA] flex items-center gap-2">
                    <span>{diaAtualObj.dia}</span>
                    <span className="text-xs font-normal text-[#A3A3A3] bg-[#151A24] px-2.5 py-0.5 rounded-full border border-[#1E2534]">
                      {diaAtualObj.turno}
                    </span>
                  </h2>
                </div>
                <span className="text-xs text-[#737373]">
                  {diaAtualObj.slots.filter((s) => s.concluido).length} de {diaAtualObj.slots.length} concluídos
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {diaAtualObj.slots.map((slot) => {
                  const badge = getTipoBadge(slot.tipo);
                  const isAnim = animandoSlot === slot.id;

                  return (
                    <div
                      key={slot.id}
                      className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        slot.concluido
                          ? 'bg-[#10141D]/50 border-emerald-500/20 opacity-80'
                          : slot.prioritaria
                          ? 'bg-[#10141D] border-blue-500/40 shadow-lg shadow-blue-900/10'
                          : 'bg-[#10141D] border-[#1E2534] hover:border-[#2A3348]'
                      } ${isAnim ? 'scale-[1.01]' : ''}`}
                    >
                      {/* CHECK + DETALHES */}
                      <div className="flex items-start gap-4 flex-1">
                        <button
                          type="button"
                          onClick={() => handleToggleSlot(slot.id)}
                          className="mt-1 cursor-pointer transition-transform active:scale-90 text-[#737373] hover:text-emerald-400"
                        >
                          {slot.concluido ? (
                            <CheckCircle2 size={24} className="text-emerald-400" />
                          ) : (
                            <Circle size={24} />
                          )}
                        </button>

                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-md">
                              {slot.horario}
                            </span>

                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${badge.bg}`}>
                              {badge.label}
                            </span>

                            {slot.prioritaria && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300">
                                ⭐ Alta Dificuldade
                              </span>
                            )}
                          </div>

                          <h3
                            className={`text-base font-bold text-[#FAFAFA] transition-all ${
                              slot.concluido ? 'line-through text-[#737373]' : ''
                            }`}
                          >
                            {slot.materia}
                          </h3>

                          <p className="text-xs text-[#A3A3A3] leading-relaxed">
                            {slot.conteudo}
                          </p>
                        </div>
                      </div>

                      {/* AÇÕES RÁPIDAS DE ESTUDO */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {onNavegarParaAba && slot.tipo === 'redacao' && (
                          <button
                            type="button"
                            onClick={() => onNavegarParaAba('redacao')}
                            className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            Treinar Redação <ArrowRight size={13} />
                          </button>
                        )}

                        {onNavegarParaAba && slot.tipo === 'simulado' && (
                          <button
                            type="button"
                            onClick={() => onNavegarParaAba('vestibulares')}
                            className="px-3 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            Simulado <ArrowRight size={13} />
                          </button>
                        )}

                        {onNavegarParaAba && (slot.tipo === 'questoes' || slot.tipo === 'teoria') && (
                          <button
                            type="button"
                            onClick={() => onNavegarParaAba('skillswipe')}
                            className="px-3 py-1.5 rounded-xl bg-[#151A24] hover:bg-[#1E2534] text-[#D1D5DB] border border-[#232B3C] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Layers size={13} className="text-blue-400" />
                            Flashcards
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleToggleSlot(slot.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            slot.concluido
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                          }`}
                        >
                          {slot.concluido ? '✓ Feito' : 'Concluir'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* EXIBIÇÃO: MODO SEMANA COMPLETA */}
          {visaoGrade === 'semana' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {plano.dias.map((d, dIdx) => {
                const concluidos = d.slots.filter((s) => s.concluido).length;
                const total = d.slots.length;
                const pct = total > 0 ? Math.round((concluidos / total) * 100) : 0;

                return (
                  <div
                    key={d.dia}
                    className="p-5 rounded-2xl bg-[#10141D] border border-[#1E2534] flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-base text-[#FAFAFA]">{d.dia}</span>
                        <span className="text-[11px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                          {pct}%
                        </span>
                      </div>

                      <p className="text-[11px] text-[#737373] mb-3">{d.turno}</p>

                      <div className="space-y-2">
                        {d.slots.map((s) => (
                          <div
                            key={s.id}
                            onClick={() => handleToggleSlot(s.id)}
                            className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-2 ${
                              s.concluido
                                ? 'bg-[#151A24]/50 border-emerald-500/20 opacity-70 line-through text-[#737373]'
                                : s.prioritaria
                                ? 'bg-[#151A24] border-blue-500/30 text-[#FAFAFA]'
                                : 'bg-[#151A24] border-[#1E2534] text-[#D1D5DB]'
                            }`}
                          >
                            <div className="truncate flex-1">
                              <span className="font-bold block truncate">{s.materia}</span>
                              <span className="text-[10px] text-[#A3A3A3] truncate block">{s.horario}</span>
                            </div>
                            {s.concluido ? (
                              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                            ) : (
                              <Circle size={16} className="text-[#737373] shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setDiaSelecionado(dIdx);
                        setVisaoGrade('dia');
                      }}
                      className="w-full py-2 bg-[#151A24] hover:bg-[#1E2534] text-xs font-bold text-blue-400 rounded-xl border border-[#232B3C] text-center transition-colors"
                    >
                      Focar neste dia →
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODO 2: ROTEIRO MACRO DE SEMANAS (MEU CRONOGRAMA INTEGRADO)               */}
      {/* ========================================================================= */}
      {modoPrincipal === 'roteiro' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#10141D] border border-[#1E2534] p-4 rounded-2xl">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-[#FAFAFA] flex items-center gap-2">
                <span>Roteiro de Semanas para os Vestibulares</span>
                <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">
                  {semanas.length} Semanas
                </span>
              </h2>
              <p className="text-xs text-[#A3A3A3]">
                Clique diretamente em qualquer tópico, foco ou carga horária para editar sob medida. Você também pode reorganizar ou regenerar individualmente com IA.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => setModoPrincipal('grade')}
                className="px-3.5 py-2 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 text-xs font-bold border border-blue-500/20 flex items-center gap-1.5 transition-colors"
              >
                <span>Ver Grade Horária da Semana</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* LISTA DE SEMANAS DO CRONOGRAMA */}
          <div className="space-y-3">
            {semanas.map((sem, idx) => {
              const isEditando = editandoIdx === idx;
              const isRegenerando = regenerandoIdx === idx;
              const isSemanaAtiva = semanaAtivaFoco === sem.week;

              return (
                <div
                  key={sem.week}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 bg-[#10141D] ${
                    isSemanaAtiva
                      ? 'border-blue-500/50 shadow-lg shadow-blue-900/10 bg-gradient-to-r from-[#10141D] to-[#141B29]'
                      : 'border-[#1E2534] hover:border-[#2A3348]'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* ESQUERDA: NÚMERO DA SEMANA & CONTEÚDO EDITÁVEL */}
                    <div className="flex items-start gap-4 flex-1">
                      {/* BADGE DA SEMANA */}
                      <button
                        type="button"
                        onClick={() => setSemanaAtivaFoco(sem.week)}
                        className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold shrink-0 transition-transform active:scale-95 border ${
                          isSemanaAtiva
                            ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30'
                            : 'bg-[#151A24] text-blue-400 border-[#232B3C] hover:border-blue-500/40'
                        }`}
                        title="Marcar como semana foco ativa"
                      >
                        <span className="text-[10px] uppercase tracking-wider opacity-80">Sem</span>
                        <span className="text-lg leading-tight">{sem.week}</span>
                      </button>

                      {/* CONTEÚDO */}
                      <div className="space-y-2 flex-1 min-w-0">
                        {/* TÓPICO */}
                        <div>
                          {isEditando && editCampo === 'topic' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editValor}
                                onChange={(e) => setEditValor(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') salvarEdicao();
                                  if (e.key === 'Escape') setEditandoIdx(null);
                                }}
                                autoFocus
                                className="w-full bg-[#151A24] border border-blue-500 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none"
                              />
                              <button
                                onClick={salvarEdicao}
                                className="p-1.5 rounded-lg bg-blue-600 text-white text-xs hover:bg-blue-500"
                              >
                                <Check size={14} />
                              </button>
                            </div>
                          ) : (
                            <div
                              onClick={() => iniciarEdicao(idx, 'topic')}
                              className="group flex items-center gap-2 cursor-pointer"
                              title="Clique para editar o tópico"
                            >
                              <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                                {sem.topic || 'Clique para definir o tópico'}
                              </h3>
                              <Edit3 size={13} className="text-[#737373] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          )}
                        </div>

                        {/* FOCO */}
                        <div>
                          {isEditando && editCampo === 'focus' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editValor}
                                onChange={(e) => setEditValor(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') salvarEdicao();
                                  if (e.key === 'Escape') setEditandoIdx(null);
                                }}
                                autoFocus
                                className="w-full bg-[#151A24] border border-blue-500 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                              />
                              <button
                                onClick={salvarEdicao}
                                className="p-1.5 rounded-lg bg-blue-600 text-white text-xs hover:bg-blue-500"
                              >
                                <Check size={14} />
                              </button>
                            </div>
                          ) : (
                            <div
                              onClick={() => iniciarEdicao(idx, 'focus')}
                              className="group flex items-center gap-2 cursor-pointer"
                              title="Clique para editar o foco"
                            >
                              <p className="text-xs text-[#A3A3A3] group-hover:text-[#D1D5DB] transition-colors leading-relaxed">
                                {sem.focus || 'Clique para definir o objetivo'}
                              </p>
                              <Edit3 size={12} className="text-[#737373] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* DIREITA: CARGA HORÁRIA & BOTÕES DE AÇÃO */}
                    <div className="flex flex-wrap items-center gap-3 justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-[#1E2534]">
                      {/* CARGA HORÁRIA ESTIMADA */}
                      <div className="flex items-center gap-1.5">
                        {isEditando && editCampo === 'estimatedHours' ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="1"
                              max="80"
                              value={editValor}
                              onChange={(e) => setEditValor(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') salvarEdicao();
                                if (e.key === 'Escape') setEditandoIdx(null);
                              }}
                              autoFocus
                              className="w-16 bg-[#151A24] border border-blue-500 rounded-lg px-2 py-1 text-xs text-white text-center"
                            />
                            <button
                              onClick={salvarEdicao}
                              className="p-1 rounded bg-blue-600 text-white text-xs"
                            >
                              <Check size={12} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => iniciarEdicao(idx, 'estimatedHours')}
                            className="px-2.5 py-1 rounded-lg bg-[#151A24] hover:bg-[#1E2534] border border-[#232B3C] text-xs font-mono font-bold text-blue-400 flex items-center gap-1 transition-colors cursor-pointer"
                            title="Clique para alterar a carga horária"
                          >
                            <Clock size={12} />
                            <span>{sem.estimatedHours ?? 0}h</span>
                          </button>
                        )}
                      </div>

                      {/* BOTÕES DE REORDENAÇÃO & AÇÃO */}
                      <div className="flex items-center gap-1 bg-[#151A24] p-1 rounded-xl border border-[#232B3C]">
                        <button
                          type="button"
                          onClick={() => handleMoverSemana(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 text-[#A3A3A3] hover:text-white hover:bg-[#1E2534] rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none"
                          title="Mover para cima"
                        >
                          <ArrowUp size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleMoverSemana(idx, 'down')}
                          disabled={idx === semanas.length - 1}
                          className="p-1.5 text-[#A3A3A3] hover:text-white hover:bg-[#1E2534] rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none"
                          title="Mover para baixo"
                        >
                          <ArrowDown size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRegenerarSemana(idx)}
                          disabled={isRegenerando}
                          className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-600/20 rounded-lg transition-colors disabled:opacity-50"
                          title="Regenerar esta semana com IA"
                        >
                          <RefreshCw size={14} className={isRegenerando ? 'animate-spin' : ''} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleExcluirSemana(idx)}
                          disabled={semanas.length <= 1}
                          className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-600/20 rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none"
                          title="Excluir semana"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* BOTÃO FOCAR NA GRADE DESTA SEMANA */}
                      <button
                        type="button"
                        onClick={() => {
                          setSemanaAtivaFoco(sem.week);
                          setModoPrincipal('grade');
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                          isSemanaAtiva
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-[#151A24] text-[#D1D5DB] hover:text-white hover:bg-[#1E2534] border border-[#232B3C]'
                        }`}
                      >
                        <span>{isSemanaAtiva ? 'Semana Ativa' : 'Focar'}</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RODAPÉ DE AÇÕES DA LISTA */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#1E2534]">
            <div className="text-xs text-[#737373]">
              {semanas.length} semanas planejadas • {totalHorasMacro} horas totais de estudo
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAdicionarSemana}
                className="px-4 py-2.5 rounded-xl border border-blue-500/30 text-blue-400 hover:bg-blue-600/10 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} />
                <span>+ Adicionar Semana</span>
              </button>

              <button
                type="button"
                onClick={handleSalvarCronograma}
                disabled={salvandoSemanas}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <Save size={14} />
                <span>{salvandoSemanas ? 'Salvando...' : 'Salvar Alterações'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanejamentoSemanalView;
