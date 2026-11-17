import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Calculator,
  Compass,
  Crown,
  GraduationCap,
  HelpCircle,
  Loader2,
  Star,
  WifiOff,
  Check,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  CursoSisu,
  EDICOES_VALIDAS,
  EdicaoNotasUsuario,
  ModalidadeCodigo,
  PerfilSisuUsuario,
  ResultadoSimulacaoCurso,
  SISU_EDICAO_ATUAL,
  SisuSimulacaoSalva,
} from '../../../shared/sisuTypes';
import { simularCurso } from '../../../shared/sisuEngine';
import {
  UserLike,
  createDefaultEdicoes,
  createDefaultPerfil,
  estimarNotasDosSimulados,
  exportarSimulacoesCSV,
  fetchCursosSisu,
  filterCursosLocally,
  getCachedCursosLocal,
  importarCursosAdmin,
  loadFavoritos,
  loadNotasUsuario,
  loadPerfilSisu,
  loadSimulacoes,
  saveNotasEdicao,
  savePerfilSisu,
  saveSimulacao,
  solicitarAnaliseIA,
  toggleFavorito,
} from './sisuService';
import { usePremiumStatus } from './useSisu';
import SisuPaywall from './SisuPaywall';
import SisuStepNotas from './SisuStepNotas';
import SisuStepCurso from './SisuStepCurso';
import SisuStepResultado from './SisuStepResultado';
import {
  CalculadoraReversaTab,
  EntendaSisuTab,
  FavoritosHistoricoTab,
  OndeEuPassoTab,
} from './SisuExtrasTabs';
import { levelSystem } from '../../services/levelService';
import { missionEngine } from '../../services/missionService';
import { achievementService } from '../../services/achievementService';

type SubAbaSisu = 'simulador' | 'onde_passo' | 'reversa' | 'favoritos' | 'entenda';

interface SimuladorSisuViewProps {
  user: UserLike | null;
  onNavigatePlanos: () => void;
  onNavigateLogin?: () => void;
}

export default function SimuladorSisuView({
  user,
  onNavigatePlanos,
  onNavigateLogin,
}: SimuladorSisuViewProps) {
  const { isPremium, isAdmin, loading: loadingPremium, planLabel } = usePremiumStatus(user);
  const uid = user?.uid || 'convidado';

  const [subAba, setSubAba] = useState<SubAbaSisu>('simulador');
  const [passo, setPasso] = useState<1 | 2 | 3>(1);

  const [edicoes, setEdicoes] = useState<EdicaoNotasUsuario[]>(() => createDefaultEdicoes());
  const [perfil, setPerfil] = useState<PerfilSisuUsuario>(() => createDefaultPerfil());
  const [catalogoBase, setCatalogoBase] = useState<CursoSisu[]>(() => getCachedCursosLocal());
  const [fonteDados, setFonteDados] = useState<'ilustrativo' | 'oficial'>('ilustrativo');
  const [offlineCatalogo, setOfflineCatalogo] = useState(false);
  const [carregandoCursos, setCarregandoCursos] = useState(false);

  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [simulacoes, setSimulacoes] = useState<SisuSimulacaoSalva[]>([]);

  // Filtros do Passo 2 com debounce de 300ms na busca
  const [busca, setBusca] = useState('');
  const [buscaDebounced, setBuscaDebounced] = useState('');
  const [filtroUf, setFiltroUf] = useState('');
  const [filtroTurno, setFiltroTurno] = useState('');
  const [filtroGrau, setFiltroGrau] = useState('');
  const [filtroModalidade, setFiltroModalidade] = useState<ModalidadeCodigo | ''>('');

  const [resultadoAtual, setResultadoAtual] = useState<{
    opcao1: ResultadoSimulacaoCurso;
    opcao2: ResultadoSimulacaoCurso | null;
  } | null>(null);

  const [anuncioLive, setAnuncioLive] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setBuscaDebounced(busca);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [busca]);

  useEffect(() => {
    if (!isPremium || !user?.uid) return;
    let mounted = true;

    (async () => {
      const [notasCarregadas, perfilCarregado, favs, sims] = await Promise.all([
        loadNotasUsuario(user.uid!),
        loadPerfilSisu(user.uid!),
        loadFavoritos(user.uid!),
        loadSimulacoes(user.uid!),
      ]);
      if (!mounted) return;
      setEdicoes(notasCarregadas);
      setPerfil(perfilCarregado);
      setFavoritos(favs);
      setSimulacoes(sims);
    })();

    return () => {
      mounted = false;
    };
  }, [isPremium, user?.uid]);

  useEffect(() => {
    if (!isPremium) return;
    let mounted = true;
    setCarregandoCursos(true);

    fetchCursosSisu()
      .then((res) => {
        if (!mounted) return;
        if (res.cursos.length > 0) {
          setCatalogoBase(res.cursos);
        }
        setFonteDados(res.fonteDados);
        setOfflineCatalogo(res.offlineFallback);
      })
      .finally(() => {
        if (mounted) setCarregandoCursos(false);
      });

    return () => {
      mounted = false;
    };
  }, [isPremium]);

  const cursosFiltrados = useMemo(
    () =>
      filterCursosLocally(catalogoBase, {
        q: buscaDebounced,
        uf: filtroUf,
        turno: filtroTurno,
        grau: filtroGrau,
        modalidade: filtroModalidade,
      }),
    [catalogoBase, buscaDebounced, filtroUf, filtroTurno, filtroGrau, filtroModalidade]
  );

  const handleChangeEdicao = (updated: EdicaoNotasUsuario) => {
    setEdicoes((prev) => {
      const next = prev.map((e) => (e.edicao === updated.edicao ? updated : e));
      saveNotasEdicao(uid, updated, next);
      return next;
    });
  };

  const handleEstimarDosSimulados = async () => {
    const res = await estimarNotasDosSimulados(uid);
    const updatedEd: EdicaoNotasUsuario = {
      edicao: res.edicaoAlvo,
      notas: res.notas,
      treineiro: false,
      origem: 'simulados',
      atualizadoEm: new Date().toISOString(),
    };
    handleChangeEdicao(updatedEd);
    return {
      baseadoEmDadosReais: res.baseadoEmDadosReais,
      detalhes: res.detalhes,
      edicaoAlvo: res.edicaoAlvo,
    };
  };

  const handleChangePerfil = (updated: PerfilSisuUsuario) => {
    setPerfil(updated);
    savePerfilSisu(uid, updated);
  };

  const handleToggleFavorito = async (curso: CursoSisu) => {
    const next = await toggleFavorito(uid, curso, favoritos);
    setFavoritos(next);
  };

  const executarSimulacao = async (
    curso1IdOverride?: string,
    curso2IdOverride?: string
  ) => {
    const id1 = curso1IdOverride ?? perfil.opcao1CursoId;
    const id2 = curso2IdOverride !== undefined ? curso2IdOverride : perfil.opcao2CursoId;
    const curso1 = catalogoBase.find((c) => c.id === id1);
    if (!curso1) return;

    const curso2 = id2 ? catalogoBase.find((c) => c.id === id2) || null : null;

    const sim1 = simularCurso(
      edicoes,
      curso1,
      perfil.modalidadePreferida,
      perfil.cumpreBonusRegional,
      EDICOES_VALIDAS
    );
    const sim2 = curso2
      ? simularCurso(
          edicoes,
          curso2,
          perfil.modalidadePreferida,
          perfil.cumpreBonusRegional,
          EDICOES_VALIDAS
        )
      : null;

    setResultadoAtual({ opcao1: sim1, opcao2: sim2 });
    setSubAba('simulador');
    setPasso(3);

    const saved = await saveSimulacao(
      uid,
      sim1,
      sim2,
      perfil.modalidadePreferida,
      perfil.cumpreBonusRegional
    );
    setSimulacoes((prev) => [saved.simulacao, ...prev.slice(0, 29)]);

    const recompensasMsg: string[] = [];
    if (saved.primeiraSimulacaoUsuario) {
      levelSystem.addXP(50, 'Simulador Sisu');
      recompensasMsg.push('+50 XP pela primeira simulação Sisu');
    }
    if (sim2) {
      const completou = missionEngine.completeSisuSecondOptionMission();
      if (completou) {
        recompensasMsg.push('Missão diária "Simule sua 2ª opção" concluída (+35 XP)');
      }
    }
    if (saved.totalCursosDistintos >= 10) {
      const badge = await achievementService.unlockSisuEstrategistaIfNeeded(
        uid,
        saved.totalCursosDistintos
      );
      if (badge) {
        levelSystem.addXP(100, 'Simulador Sisu');
        recompensasMsg.push('Conquista desbloqueada: Estrategista Sisu!');
      }
    }

    setAnuncioLive(
      `Simulação concluída para ${curso1.curso}. ${recompensasMsg.join(' · ')}`
    );
  };

  const handleSelecionarCursoRapido = (slot: 1 | 2, cursoId: string) => {
    const nextPerfil: PerfilSisuUsuario = {
      ...perfil,
      opcao1CursoId: slot === 1 ? cursoId : perfil.opcao1CursoId || cursoId,
      opcao2CursoId:
        slot === 2
          ? cursoId !== perfil.opcao1CursoId
            ? cursoId
            : perfil.opcao2CursoId
          : perfil.opcao2CursoId === cursoId
          ? undefined
          : perfil.opcao2CursoId,
    };
    handleChangePerfil(nextPerfil);
    setSubAba('simulador');
    setPasso(2);
  };

  if (loadingPremium) {
    return (
      <div className="min-h-[360px] flex flex-col items-center justify-center gap-3 text-[var(--text-muted)]">
        <Loader2 size={28} className="animate-spin text-blue-400" />
        <p className="text-sm font-medium">Verificando seu acesso ao Simulador Sisu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Cabeçalho do Simulador Sisu */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--primary-soft)] text-blue-400 border border-[var(--primary-border)] text-[11px] font-extrabold uppercase tracking-wider">
              <GraduationCap size={14} />
              <span>Simulador Sisu {SISU_EDICAO_ATUAL}</span>
            </span>
            {isPremium && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-[11px] font-bold">
                <Crown size={12} />
                <span>{planLabel}</span>
              </span>
            )}
            {offlineCatalogo && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-500 border border-amber-500/30 text-[11px] font-semibold">
                <WifiOff size={12} />
                <span>Catálogo em cache offline</span>
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-[var(--text-main)] tracking-tight">
            Simulador de Notas & Cotas Sisu
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Pesos reais por curso, melhor média entre {EDICOES_VALIDAS.join(', ')}, dupla leitura (AC + Cota) e análise por IA.
          </p>
        </div>

        {isPremium && (
          <div className="text-xs text-[var(--text-muted)] bg-[var(--bg-card)] px-4 py-2.5 rounded-2xl border border-[var(--border-light)] shrink-0">
            Fonte dos cortes:{' '}
            <strong className={fonteDados === 'oficial' ? 'text-emerald-500' : 'text-amber-500'}>
              {fonteDados === 'oficial' ? 'Planilha oficial importada' : 'Dado ilustrativo de referência'}
            </strong>
          </div>
        )}
      </header>

      {/* Live region acessível */}
      <div className="sr-only" aria-live="polite">
        {anuncioLive}
      </div>

      {anuncioLive && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-500 font-semibold flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles size={15} />
            <span>{anuncioLive}</span>
          </div>
          <button
            type="button"
            onClick={() => setAnuncioLive('')}
            className="text-[11px] underline cursor-pointer"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Paywall se não for Premium */}
      {!isPremium ? (
        <SisuPaywall
          isAuthenticated={Boolean(user?.uid)}
          onAssinarPremium={onNavigatePlanos}
          onIrParaLogin={onNavigateLogin}
        />
      ) : (
        <div className="space-y-6">
          {/* Sub-navegação principal do módulo */}
          <nav
            aria-label="Seções do Simulador Sisu"
            className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)]"
          >
            {[
              { id: 'simulador', label: 'Simulador (3 passos)', icon: GraduationCap },
              { id: 'onde_passo', label: 'Onde eu passo?', icon: Compass },
              { id: 'reversa', label: 'Calculadora reversa', icon: Calculator },
              { id: 'favoritos', label: `Favoritos & Histórico (${favoritos.length})`, icon: Star },
              { id: 'entenda', label: 'Entenda o Sisu', icon: HelpCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              const ativo = subAba === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSubAba(tab.id as SubAbaSisu)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    ativo
                      ? 'bg-[var(--primary)] text-white shadow-sm shadow-[var(--shadow-primary)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Conteúdo da Sub-aba */}
          <motion.div
            key={`${subAba}-${subAba === 'simulador' ? passo : 'tab'}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="p-5 sm:p-6 md:p-7 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] shadow-sm space-y-6"
          >
            {subAba === 'simulador' && (
              <>
                {/* Stepper horizontal no desktop e vertical no mobile */}
                <ol className="flex flex-col md:flex-row md:items-center gap-3 pb-5 border-b border-[var(--border-light)]">
                  {[
                    { num: 1 as const, titulo: 'Suas notas', sub: `Enem ${EDICOES_VALIDAS.join(', ')}` },
                    { num: 2 as const, titulo: 'Escolha o curso', sub: 'Até 2 opções e cota' },
                    { num: 3 as const, titulo: 'Resultado e IA', sub: 'Chances e plano 4 semanas' },
                  ].map((s, idx) => {
                    const ativo = passo === s.num;
                    const concluido = passo > s.num;
                    const desabilitado = s.num === 3 && !resultadoAtual;

                    return (
                      <React.Fragment key={s.num}>
                        <li className="flex-1">
                          <button
                            type="button"
                            disabled={desabilitado}
                            onClick={() => {
                              if (!desabilitado) setPasso(s.num);
                            }}
                            className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
                              ativo
                                ? 'bg-[var(--primary-soft)] border-[var(--primary-border)]'
                                : 'bg-[var(--bg-hover)] border-[var(--border-light)] hover:border-[var(--border-color)]'
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 ${
                                concluido
                                  ? 'bg-emerald-600 text-white'
                                  : ativo
                                  ? 'bg-[var(--primary)] text-white'
                                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-color)]'
                              }`}
                            >
                              {concluido ? <Check size={14} /> : s.num}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-[var(--text-main)] truncate">
                                {s.titulo}
                              </p>
                              <p className="text-[11px] text-[var(--text-muted)] truncate">
                                {s.sub}
                              </p>
                            </div>
                          </button>
                        </li>
                        {idx < 2 && (
                          <div
                            aria-hidden="true"
                            className="hidden md:block w-6 h-px bg-[var(--border-color)] shrink-0"
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </ol>

                {passo === 1 && (
                  <SisuStepNotas
                    edicoes={edicoes}
                    onChangeEdicao={handleChangeEdicao}
                    onEstimarDosSimulados={handleEstimarDosSimulados}
                    onAvancar={() => setPasso(2)}
                  />
                )}

                {passo === 2 && (
                  <SisuStepCurso
                    cursos={cursosFiltrados}
                    carregandoCursos={carregandoCursos}
                    busca={busca}
                    onChangeBusca={setBusca}
                    filtroUf={filtroUf}
                    onChangeFiltroUf={setFiltroUf}
                    filtroTurno={filtroTurno}
                    onChangeFiltroTurno={setFiltroTurno}
                    filtroGrau={filtroGrau}
                    onChangeFiltroGrau={setFiltroGrau}
                    filtroModalidade={filtroModalidade}
                    onChangeFiltroModalidade={setFiltroModalidade}
                    perfil={perfil}
                    onChangePerfil={handleChangePerfil}
                    favoritos={favoritos}
                    onToggleFavorito={handleToggleFavorito}
                    onVoltar={() => setPasso(1)}
                    onSimularResultado={() => executarSimulacao()}
                  />
                )}

                {passo === 3 && resultadoAtual && (
                  <SisuStepResultado
                    edicoes={edicoes}
                    opcao1={resultadoAtual.opcao1}
                    opcao2={resultadoAtual.opcao2}
                    modalidade={perfil.modalidadePreferida}
                    favoritos={favoritos}
                    onToggleFavorito={(sim) => handleToggleFavorito(sim.curso)}
                    onVoltar={() => setPasso(2)}
                    onExportarCSV={() => exportarSimulacoesCSV(simulacoes)}
                    onSolicitarAnaliseIA={(sim, pergunta) =>
                      solicitarAnaliseIA({
                        edicoes,
                        curso: sim.curso,
                        modalidade: perfil.modalidadePreferida,
                        cumpreBonus: perfil.cumpreBonusRegional,
                        perguntaUsuario: pergunta,
                      })
                    }
                  />
                )}
              </>
            )}

            {subAba === 'onde_passo' && (
              <OndeEuPassoTab
                edicoes={edicoes}
                cursos={catalogoBase}
                modalidade={perfil.modalidadePreferida}
                cumpreBonus={perfil.cumpreBonusRegional}
                onSelecionarCurso={handleSelecionarCursoRapido}
              />
            )}

            {subAba === 'reversa' && (
              <CalculadoraReversaTab
                cursos={catalogoBase}
                modalidadePadrao={perfil.modalidadePreferida}
                cumpreBonus={perfil.cumpreBonusRegional}
              />
            )}

            {subAba === 'favoritos' && (
              <FavoritosHistoricoTab
                cursos={catalogoBase}
                favoritos={favoritos}
                simulacoes={simulacoes}
                isAdmin={isAdmin}
                onToggleFavorito={handleToggleFavorito}
                onSelecionarCurso={handleSelecionarCursoRapido}
                onExportarCSV={() => exportarSimulacoesCSV(simulacoes)}
                onImportarArquivo={async (file) => {
                  const res = await importarCursosAdmin(file);
                  const updated = await fetchCursosSisu();
                  setCatalogoBase(updated.cursos);
                  setFonteDados(updated.fonteDados);
                  return { mensagem: res.mensagem };
                }}
              />
            )}

            {subAba === 'entenda' && <EntendaSisuTab />}
          </motion.div>

          <p className="text-center text-[11px] text-[var(--text-muted)] px-4">
            Simulação não oficial. Notas de corte reais e inscrições somente no Portal Único de Acesso ao Ensino Superior do MEC (acessounico.mec.gov.br).
          </p>
        </div>
      )}
    </div>
  );
}
