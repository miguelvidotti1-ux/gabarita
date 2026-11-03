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
  Sun,
  Sunset,
  Moon,
  Layers,
  Award
} from 'lucide-react';
import {
  PlanejamentoSemanalService,
  PlanejamentoSemanalData,
  WeeklyStudyDay,
  WeeklyStudySlot
} from '../services/planejamentoSemanalService';

interface PlanejamentoSemanalViewProps {
  onAbrirDiagnostico?: () => void;
  onNavegarParaAba?: (aba: string) => void;
}

export const PlanejamentoSemanalView: React.FC<PlanejamentoSemanalViewProps> = ({
  onAbrirDiagnostico,
  onNavegarParaAba
}) => {
  const [plano, setPlano] = useState<PlanejamentoSemanalData | null>(null);
  const [diaSelecionado, setDiaSelecionado] = useState<number>(0);
  const [visao, setVisao] = useState<'dia' | 'semana'>('dia');
  const [animandoSlot, setAnimandoSlot] = useState<string | null>(null);

  useEffect(() => {
    carregarOuGerarPlano();
  }, []);

  const carregarOuGerarPlano = () => {
    let data = PlanejamentoSemanalService.carregar();
    if (!data) {
      // Tentar pegar do perfil salvo no onboarding
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

    // Selecionar o dia atual da semana (0 = Segunda, ..., 6 = Domingo)
    const hoje = new Date().getDay(); // 0 é domingo
    const diaIndex = hoje === 0 ? 6 : hoje - 1;
    setDiaSelecionado(diaIndex);
  };

  const handleToggleSlot = (slotId: string) => {
    setAnimandoSlot(slotId);
    setTimeout(() => setAnimandoSlot(null), 400);

    const atualizado = PlanejamentoSemanalService.toggleSlot(slotId);
    if (atualizado) {
      setPlano({ ...atualizado });
    }
  };

  const handleRegenerar = () => {
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
        <p className="text-sm text-[#A3A3A3]">Carregando seu cronograma semanal personalizado...</p>
      </div>
    );
  }

  const progresso = PlanejamentoSemanalService.calcularProgresso(plano);
  const diaAtualObj = plano.dias[diaSelecionado] || plano.dias[0];

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
      {/* ===== HERO DO PLANEJAMENTO SEMANAL ===== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#10141D] via-[#10141D] to-[#151D30] border border-[#1E2534] p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-bold text-blue-400">
              <Sparkles size={14} className="animate-pulse" />
              <span>Cronograma Calibrado por Inteligência Artificial</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#FAFAFA] tracking-tight">
              Planejamento Semanal de Estudos
            </h1>

            <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed">
              Grade de horários distribuída sob medida para seu período de estudo e prioridades de prova.
            </p>

            {/* TAGS DO PERFIL ATIVO */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="px-3 py-1 rounded-lg bg-[#151A24] border border-[#232B3C] text-[#D1D5DB] font-semibold flex items-center gap-1.5">
                <Clock size={13} className="text-blue-400" />
                Turno: <strong className="text-white">{plano.periodoEstudo}</strong>
              </span>

              <span className="px-3 py-1 rounded-lg bg-[#151A24] border border-[#232B3C] text-[#D1D5DB] font-semibold flex items-center gap-1.5">
                <Zap size={13} className="text-amber-400" />
                Foco Máximo: <strong className="text-white">{plano.horarioPico}</strong>
              </span>

              <span className="px-3 py-1 rounded-lg bg-[#151A24] border border-[#232B3C] text-[#D1D5DB] font-semibold flex items-center gap-1.5">
                <Target size={13} className="text-emerald-400" />
                Alvo: <strong className="text-white">{plano.vestibulares.join(', ')}</strong>
              </span>
            </div>
          </div>

          {/* CARD DE PROGRESSO SEMANAL */}
          <div className="bg-[#000000]/60 border border-[#1E2534] p-5 rounded-2xl shrink-0 w-full md:w-64 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#A3A3A3] font-medium">Meta Semanal</span>
              <span className="text-blue-400 font-bold text-sm">{progresso.porcentagem}%</span>
            </div>

            <div className="w-full h-2.5 bg-[#1E2534] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progresso.porcentagem}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#737373]">
              <span>{progresso.concluidos} blocos feitos</span>
              <span>{progresso.total} no total</span>
            </div>

            <button
              type="button"
              onClick={handleRegenerar}
              className="w-full py-2 bg-[#151A24] hover:bg-[#1E2534] text-xs font-bold text-[#D1D5DB] rounded-lg border border-[#232B3C] flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw size={13} />
              Recalibrar Semana
            </button>
          </div>
        </div>
      </div>

      {/* ===== CONTROLES DE VISUALIZAÇÃO ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* DIAS DA SEMANA */}
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
                  setVisao('dia');
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

        {/* ALTERNADOR DE MODO: DIA vs SEMANA COMPLETA */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setVisao(visao === 'dia' ? 'semana' : 'dia')}
            className="px-3.5 py-2 rounded-xl bg-[#10141D] border border-[#1E2534] text-xs font-bold text-[#A3A3A3] hover:text-white hover:bg-[#151A24] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar size={14} />
            <span>{visao === 'dia' ? 'Ver Semana Completa' : 'Ver Dia Atual'}</span>
          </button>

          {onAbrirDiagnostico && (
            <button
              type="button"
              onClick={onAbrirDiagnostico}
              className="px-3.5 py-2 rounded-xl bg-[#10141D] border border-[#1E2534] text-xs font-bold text-blue-400 hover:bg-[#151A24] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles size={14} />
              <span>Ajustar Perfil</span>
            </button>
          )}
        </div>
      </div>

      {/* ===== EXIBIÇÃO: MODO DIA ESPECÍFICO ===== */}
      {visao === 'dia' && (
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
              {diaAtualObj.slots.filter((s) => s.concluido).length} de {diaAtualObj.slots.length} concluidos
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
                  {/* ESQUERDA: CHECK + DETALHES */}
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

                  {/* DIREITA: AÇÕES RÁPIDAS */}
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
                        Iniciar Simulado <ArrowRight size={13} />
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

      {/* ===== EXIBIÇÃO: MODO SEMANA COMPLETA ===== */}
      {visao === 'semana' && (
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
                    setVisao('dia');
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
  );
};

export default PlanejamentoSemanalView;
