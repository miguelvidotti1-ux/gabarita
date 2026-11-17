import React from 'react';
import {
  Zap,
  Clock,
  Layers,
  RotateCcw,
  Download,
  WifiOff,
  CheckCircle2,
  Play,
  RefreshCw,
} from 'lucide-react';
import {
  BANCAS_TREINO,
  Banca,
  Dificuldade,
  FiltrosTreino,
  MATERIAS_TREINO,
  ModoTreino,
} from './treinoEngine';
import { PacoteOffline, SessaoPausada } from './treinoService';

interface TreinoSetupProps {
  filtros: FiltrosTreino;
  onChangeFiltros: (next: FiltrosTreino) => void;
  onIniciar: (filtros: FiltrosTreino, usarOffline?: boolean) => void;
  loading: boolean;
  revisoesPendentes: number;
  sessaoPausada: SessaoPausada | null;
  onRetomarPausada: () => void;
  onDescartarPausada: () => void;
  pacoteOffline: PacoteOffline | null;
  onBaixarOffline: () => void;
  baixandoOffline: boolean;
  filaSyncCount: number;
  onSincronizarFila: () => void;
  isOnline: boolean;
  erro?: string | null;
}

const MODOS: { id: ModoTreino; label: string; desc: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: 'livre', label: 'Treino Livre', desc: 'Sem pressão de relógio, foco em fixação', icon: Zap },
  { id: 'cronometrado', label: 'Cronometrado', desc: 'Tempo médio real por banca na tela', icon: Clock },
  { id: 'simulado_express', label: 'Simulado Express', desc: 'Mix equilibrado entre todas as matérias', icon: Layers },
  { id: 'revisao', label: 'Revisão Espaçada', desc: 'Questões vencidas de 1, 3, 7, 15 e 30 dias', icon: RotateCcw },
];

const QUANTIDADES = [5, 10, 15, 20, 30];

export const TreinoSetup: React.FC<TreinoSetupProps> = ({
  filtros,
  onChangeFiltros,
  onIniciar,
  loading,
  revisoesPendentes,
  sessaoPausada,
  onRetomarPausada,
  onDescartarPausada,
  pacoteOffline,
  onBaixarOffline,
  baixandoOffline,
  filaSyncCount,
  onSincronizarFila,
  isOnline,
  erro,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      {/* Cabeçalho editorial limpo */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--primary)] dark:text-blue-400">
            <Zap size={15} />
            <span>Treino Rápido · Gabarita</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-[var(--text-main)]">
            Prática objetiva de alta velocidade
          </h1>
          <p className="text-sm text-[var(--text-muted)] max-w-2xl">
            Resolva questões reais e modelo de vestibular com correção instantânea, atalhos de teclado, revisão espaçada e explicação sob demanda.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-3 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] text-right">
            <div className="text-[11px] font-semibold text-[var(--text-label)]">Revisões pendentes</div>
            <div className="text-xl font-bold font-mono tabular-nums text-[var(--text-main)]">
              {revisoesPendentes}
            </div>
          </div>
        </div>
      </div>

      {/* Retomar sessão pausada */}
      {sessaoPausada && (
        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--primary-border)] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-blue-500">Sessão pausada encontrada</div>
            <p className="text-sm font-semibold text-[var(--text-main)]">
              Questão {sessaoPausada.indiceAtual + 1} de {sessaoPausada.questoes.length} ·{' '}
              {sessaoPausada.tentativas.length} respondida(s)
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onDescartarPausada}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-hover)] border border-[var(--border-light)] cursor-pointer transition-colors"
            >
              Descartar
            </button>
            <button
              type="button"
              onClick={onRetomarPausada}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Play size={14} />
              <span>Retomar treino</span>
            </button>
          </div>
        </div>
      )}

      {/* Card principal de configuração */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] shadow-sm space-y-7">
        {/* 1. Modo */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-[var(--text-main)]">1. Escolha o modo de treino</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {MODOS.map((modo) => {
              const Icon = modo.icon;
              const active = filtros.modo === modo.id;
              return (
                <button
                  key={modo.id}
                  type="button"
                  onClick={() => onChangeFiltros({ ...filtros, modo: modo.id })}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                    active
                      ? 'bg-[var(--primary-soft)] border-[var(--primary)] text-[var(--text-main)]'
                      : 'bg-[var(--bg-hover)] border-[var(--border-light)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-color)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={active ? 'text-blue-500' : 'text-[var(--text-label)]'}>
                      <Icon size={17} />
                    </span>
                    {modo.id === 'revisao' && revisoesPendentes > 0 && (
                      <span className="text-[11px] font-bold font-mono tabular-nums text-blue-500">
                        {revisoesPendentes} hoje
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-bold text-[var(--text-main)]">{modo.label}</div>
                  <div className="text-xs text-[var(--text-muted)] leading-snug">{modo.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="treino-banca" className="block text-xs font-semibold text-[var(--text-label)]">
              Banca / Vestibular
            </label>
            <select
              id="treino-banca"
              value={filtros.banca || 'TODAS'}
              onChange={(e) =>
                onChangeFiltros({
                  ...filtros,
                  banca: e.target.value as Banca | 'TODAS',
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-sm font-medium text-[var(--text-main)] outline-none focus:border-[var(--primary)]"
            >
              <option value="TODAS">Todas as bancas</option>
              {BANCAS_TREINO.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="treino-materia" className="block text-xs font-semibold text-[var(--text-label)]">
              Matéria
            </label>
            <select
              id="treino-materia"
              value={filtros.materia || 'TODAS'}
              onChange={(e) =>
                onChangeFiltros({
                  ...filtros,
                  materia: e.target.value,
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-sm font-medium text-[var(--text-main)] outline-none focus:border-[var(--primary)]"
            >
              <option value="TODAS">Todas as matérias</option>
              {MATERIAS_TREINO.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="treino-dificuldade" className="block text-xs font-semibold text-[var(--text-label)]">
              Dificuldade
            </label>
            <select
              id="treino-dificuldade"
              value={filtros.dificuldade || 'todas'}
              onChange={(e) =>
                onChangeFiltros({
                  ...filtros,
                  dificuldade: e.target.value as Dificuldade | 'todas',
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-sm font-medium text-[var(--text-main)] outline-none focus:border-[var(--primary)]"
            >
              <option value="todas">Mista (todas)</option>
              <option value="facil">Fácil</option>
              <option value="media">Média</option>
              <option value="dificil">Difícil</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="treino-topico" className="block text-xs font-semibold text-[var(--text-label)]">
              Tópico específico (opcional)
            </label>
            <input
              id="treino-topico"
              type="text"
              value={filtros.topico || ''}
              onChange={(e) => onChangeFiltros({ ...filtros, topico: e.target.value })}
              placeholder="Ex: Funções, Era Vargas..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-sm font-medium text-[var(--text-main)] placeholder:text-[var(--text-label)] outline-none focus:border-[var(--primary)]"
            />
          </div>
        </div>

        {/* 3. Quantidade */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold text-[var(--text-label)]">Quantidade de questões</div>
          <div className="flex flex-wrap gap-2">
            {QUANTIDADES.map((qtd) => {
              const active = filtros.quantidade === qtd;
              return (
                <button
                  key={qtd}
                  type="button"
                  onClick={() => onChangeFiltros({ ...filtros, quantidade: qtd })}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-mono tabular-nums border cursor-pointer transition-colors ${
                    active
                      ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                      : 'bg-[var(--bg-hover)] text-[var(--text-muted)] border-[var(--border-light)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {qtd} questões
                </button>
              );
            })}
          </div>
        </div>

        {erro && (
          <div
            role="alert"
            className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-sm text-rose-400 font-medium"
          >
            {erro}
          </div>
        )}

        {/* Ação principal */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[var(--border-light)]">
          <div className="text-xs text-[var(--text-muted)]">
            Atalhos no desktop: teclas <strong className="text-[var(--text-main)]">A–E</strong> ou{' '}
            <strong className="text-[var(--text-main)]">1–5</strong> selecionam ·{' '}
            <strong className="text-[var(--text-main)]">Shift+Letra</strong> risca ·{' '}
            <strong className="text-[var(--text-main)]">Enter</strong> confirma.
          </div>

          {isOnline ? (
            <button
              type="button"
              onClick={() => onIniciar(filtros, false)}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-60 text-white text-sm font-bold inline-flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors whitespace-nowrap shrink-0"
            >
              <Zap size={16} />
              <span>{loading ? 'Preparando questões...' : 'Começar Treino'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onIniciar(filtros, true)}
              disabled={loading || !pacoteOffline}
              className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer transition-colors whitespace-nowrap shrink-0"
            >
              <WifiOff size={16} />
              <span>{pacoteOffline ? 'Treinar com pacote offline' : 'Sem pacote offline salvo'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Pacote Offline & Sincronização */}
      <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-main)]">
            <Download size={16} className="text-blue-500" />
            <span>Modo Offline (Pacote de 30 questões)</span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            {pacoteOffline
              ? `Pacote pronto (${pacoteOffline.total} questões salvas em ${new Date(pacoteOffline.geradoEm).toLocaleDateString('pt-BR')}).`
              : 'Baixe 30 questões balanceadas para responder mesmo sem internet.'}
            {filaSyncCount > 0 && ` · ${filaSyncCount} resposta(s) aguardando sincronização.`}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {filaSyncCount > 0 && isOnline && (
            <button
              type="button"
              onClick={onSincronizarFila}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RefreshCw size={14} />
              <span>Sincronizar ({filaSyncCount})</span>
            </button>
          )}
          {isOnline && (
            <button
              type="button"
              onClick={onBaixarOffline}
              disabled={baixandoOffline}
              className="px-4 py-2 rounded-xl bg-[var(--bg-hover)] hover:border-[var(--primary)] border border-[var(--border-light)] text-xs font-bold text-[var(--text-main)] inline-flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
            >
              {pacoteOffline ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Download size={14} />}
              <span>{baixandoOffline ? 'Baixando...' : pacoteOffline ? 'Atualizar pacote' : 'Baixar pacote'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TreinoSetup;
