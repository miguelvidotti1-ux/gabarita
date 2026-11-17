import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  ChevronDown,
  ChevronUp,
  Filter,
  Loader2,
  MapPin,
  Search,
  ShieldCheck,
  Star,
} from 'lucide-react';
import {
  AREAS_ENEM_META,
  AreaEnem,
  CursoSisu,
  MODALIDADES_INFO,
  ModalidadeCodigo,
  PerfilSisuUsuario,
  QuestionarioCota,
  recomendarModalidadesPorQuestionario,
} from '../../../shared/sisuTypes';
import { formatarNotaBR } from '../../../shared/sisuEngine';

interface SisuStepCursoProps {
  cursos: CursoSisu[];
  carregandoCursos: boolean;
  busca: string;
  onChangeBusca: (val: string) => void;
  filtroUf: string;
  onChangeFiltroUf: (val: string) => void;
  filtroTurno: string;
  onChangeFiltroTurno: (val: string) => void;
  filtroGrau: string;
  onChangeFiltroGrau: (val: string) => void;
  filtroModalidade: ModalidadeCodigo | '';
  onChangeFiltroModalidade: (val: ModalidadeCodigo | '') => void;
  perfil: PerfilSisuUsuario;
  onChangePerfil: (updated: PerfilSisuUsuario) => void;
  favoritos: string[];
  onToggleFavorito: (curso: CursoSisu) => void;
  onVoltar: () => void;
  onSimularResultado: () => void;
}

const UFS = [
  'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR',
  'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO',
];

const TURNOS = ['Integral', 'Matutino', 'Vespertino', 'Noturno'];
const GRAUS = ['Bacharelado', 'Licenciatura', 'Tecnológico'];
const AREA_KEYS: AreaEnem[] = ['LC', 'CH', 'CN', 'MT', 'RED'];

export const SisuStepCurso: React.FC<SisuStepCursoProps> = ({
  cursos,
  carregandoCursos,
  busca,
  onChangeBusca,
  filtroUf,
  onChangeFiltroUf,
  filtroTurno,
  onChangeFiltroTurno,
  filtroGrau,
  onChangeFiltroGrau,
  filtroModalidade,
  onChangeFiltroModalidade,
  perfil,
  onChangePerfil,
  favoritos,
  onToggleFavorito,
  onVoltar,
  onSimularResultado,
}) => {
  const [questionarioAberto, setQuestionarioAberto] = useState(true);

  const modalidadesElegiveis = useMemo(
    () => recomendarModalidadesPorQuestionario(perfil.questionario),
    [perfil.questionario]
  );

  const cursoOpcao1 = cursos.find((c) => c.id === perfil.opcao1CursoId) || null;
  const cursoOpcao2 = cursos.find((c) => c.id === perfil.opcao2CursoId) || null;

  const temBonusNosSelecionados = Boolean(
    (cursoOpcao1?.bonusPercentual && cursoOpcao1.bonusPercentual > 0) ||
      (cursoOpcao2?.bonusPercentual && cursoOpcao2.bonusPercentual > 0)
  );

  const updateQuestionario = (patch: Partial<QuestionarioCota>) => {
    const nextQ: QuestionarioCota = { ...perfil.questionario, ...patch };
    if (!nextQ.escolaPublicaIntegral) {
      nextQ.rendaPerCapitaAte1SM = false;
      nextQ.ppi = false;
      nextQ.quilombola = false;
      nextQ.pcd = false;
    }
    const recomendadas = recomendarModalidadesPorQuestionario(nextQ);
    const modalidadeAtualAindaVale = recomendadas.includes(perfil.modalidadePreferida);
    const sugestaoPrincipal =
      recomendadas.length > 1 ? recomendadas[1] : 'AC';

    onChangePerfil({
      ...perfil,
      questionario: nextQ,
      modalidadePreferida: modalidadeAtualAindaVale
        ? perfil.modalidadePreferida
        : sugestaoPrincipal,
    });
  };

  const handleSelecionarOpcao = (slot: 1 | 2, cursoId: string) => {
    if (slot === 1) {
      onChangePerfil({
        ...perfil,
        opcao1CursoId: cursoId,
        opcao2CursoId: perfil.opcao2CursoId === cursoId ? undefined : perfil.opcao2CursoId,
      });
    } else {
      if (perfil.opcao1CursoId === cursoId) return;
      onChangePerfil({
        ...perfil,
        opcao2CursoId: perfil.opcao2CursoId === cursoId ? undefined : cursoId,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-main)]">
            2. Escolha seus cursos e modalidade de concorrência
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Selecione até 2 opções de curso (1ª e 2ª opção) e informe sua elegibilidade às cotas pela Lei 12.711/2012 (atualizada pela Lei 14.723/2023).
          </p>
        </div>

        <button
          type="button"
          onClick={onVoltar}
          className="px-4 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-hover)] hover:bg-[var(--border-light)] text-xs font-semibold text-[var(--text-main)] inline-flex items-center gap-1.5 cursor-pointer self-start"
        >
          <ArrowLeft size={14} />
          <span>Voltar às notas</span>
        </button>
      </div>

      {/* Mini-questionário de elegibilidade de cotas */}
      <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--bg-hover)] overflow-hidden">
        <button
          type="button"
          onClick={() => setQuestionarioAberto((prev) => !prev)}
          className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left cursor-pointer hover:bg-[var(--bg-card)]/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--primary-soft)] text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-main)]">
                Modalidade de Concorrência & Questionário de Cotas
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Modalidade ativa: <strong className="text-blue-400">{MODALIDADES_INFO[perfil.modalidadePreferida].siglaCurta}</strong> · Todo candidato concorre primeiro na AC.
              </p>
            </div>
          </div>
          {questionarioAberto ? (
            <ChevronUp size={18} className="text-[var(--text-muted)]" />
          ) : (
            <ChevronDown size={18} className="text-[var(--text-muted)]" />
          )}
        </button>

        {questionarioAberto && (
          <div className="px-5 pb-5 pt-2 border-t border-[var(--border-light)] space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={perfil.questionario.escolaPublicaIntegral}
                  onChange={(e) =>
                    updateQuestionario({ escolaPublicaIntegral: e.target.checked })
                  }
                  className="mt-0.5 w-4 h-4 accent-[var(--primary)]"
                />
                <span className="text-xs text-[var(--text-main)] leading-snug">
                  <strong>Ensino Médio integral em escola pública</strong>
                  <span className="block text-[11px] text-[var(--text-muted)]">
                    Cursou todo o ensino médio na rede pública brasileira.
                  </span>
                </span>
              </label>

              <label
                className={`flex items-start gap-2.5 p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] ${
                  perfil.questionario.escolaPublicaIntegral
                    ? 'cursor-pointer'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <input
                  type="checkbox"
                  disabled={!perfil.questionario.escolaPublicaIntegral}
                  checked={perfil.questionario.rendaPerCapitaAte1SM}
                  onChange={(e) =>
                    updateQuestionario({ rendaPerCapitaAte1SM: e.target.checked })
                  }
                  className="mt-0.5 w-4 h-4 accent-[var(--primary)]"
                />
                <span className="text-xs text-[var(--text-main)] leading-snug">
                  <strong>Renda familiar bruta per capita ≤ 1 salário mínimo</strong>
                  <span className="block text-[11px] text-[var(--text-muted)]">
                    Critério atualizado pela Lei 14.723/2023 para cotas LB_*.
                  </span>
                </span>
              </label>

              <label
                className={`flex items-start gap-2.5 p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] ${
                  perfil.questionario.escolaPublicaIntegral
                    ? 'cursor-pointer'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <input
                  type="checkbox"
                  disabled={!perfil.questionario.escolaPublicaIntegral}
                  checked={perfil.questionario.ppi}
                  onChange={(e) => updateQuestionario({ ppi: e.target.checked })}
                  className="mt-0.5 w-4 h-4 accent-[var(--primary)]"
                />
                <span className="text-xs text-[var(--text-main)] leading-snug">
                  <strong>Autodeclaração Preto, Pardo ou Indígena (PPI)</strong>
                </span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-start gap-2 p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] ${
                    perfil.questionario.escolaPublicaIntegral
                      ? 'cursor-pointer'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <input
                    type="checkbox"
                    disabled={!perfil.questionario.escolaPublicaIntegral}
                    checked={perfil.questionario.quilombola}
                    onChange={(e) =>
                      updateQuestionario({ quilombola: e.target.checked })
                    }
                    className="mt-0.5 w-4 h-4 accent-[var(--primary)]"
                  />
                  <span className="text-xs font-semibold text-[var(--text-main)]">
                    Quilombola
                  </span>
                </label>

                <label
                  className={`flex items-start gap-2 p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] ${
                    perfil.questionario.escolaPublicaIntegral
                      ? 'cursor-pointer'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <input
                    type="checkbox"
                    disabled={!perfil.questionario.escolaPublicaIntegral}
                    checked={perfil.questionario.pcd}
                    onChange={(e) => updateQuestionario({ pcd: e.target.checked })}
                    className="mt-0.5 w-4 h-4 accent-[var(--primary)]"
                  />
                  <span className="text-xs font-semibold text-[var(--text-main)]">
                    Pessoa com Deficiência (PcD)
                  </span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div>
                <label
                  htmlFor="sisu-aa-ies"
                  className="block text-xs font-bold text-[var(--text-main)] mb-1"
                >
                  Ação afirmativa própria da universidade — AA_IES (opcional)
                </label>
                <input
                  id="sisu-aa-ies"
                  type="text"
                  placeholder="Ex.: Bônus estadual ou cota específica da IES"
                  value={perfil.questionario.acaoAfirmativaPropria || ''}
                  onChange={(e) =>
                    updateQuestionario({ acaoAfirmativaPropria: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-xs text-[var(--text-main)] outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="sisu-modalidade-select"
                  className="block text-xs font-bold text-[var(--text-main)] mb-1"
                >
                  Modalidade que você deseja simular
                </label>
                <select
                  id="sisu-modalidade-select"
                  value={perfil.modalidadePreferida}
                  onChange={(e) =>
                    onChangePerfil({
                      ...perfil,
                      modalidadePreferida: e.target.value as ModalidadeCodigo,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-main)] outline-none focus:border-blue-500"
                >
                  {(Object.keys(MODALIDADES_INFO) as ModalidadeCodigo[]).map((cod) => {
                    const info = MODALIDADES_INFO[cod];
                    const elegivel = modalidadesElegiveis.includes(cod);
                    return (
                      <option key={cod} value={cod}>
                        {info.siglaCurta}
                        {elegivel ? ' — Elegível pelo seu perfil' : ' — Fora do questionário'}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Barra de Resumo das 2 Opções Selecionadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className={`p-4 rounded-2xl border transition-all ${
            cursoOpcao1
              ? 'border-blue-500/40 bg-blue-500/10'
              : 'border-dashed border-[var(--border-color)] bg-[var(--bg-hover)]'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
              1ª Opção de Curso
            </span>
            {cursoOpcao1 && (
              <button
                type="button"
                onClick={() => onChangePerfil({ ...perfil, opcao1CursoId: undefined })}
                className="text-[11px] text-[var(--text-muted)] hover:text-rose-400 cursor-pointer"
              >
                Remover
              </button>
            )}
          </div>
          {cursoOpcao1 ? (
            <div className="mt-1">
              <p className="text-sm font-bold text-[var(--text-main)]">
                {cursoOpcao1.curso} — {cursoOpcao1.iesSigla}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {cursoOpcao1.cidade}/{cursoOpcao1.uf} · {cursoOpcao1.turno} · {cursoOpcao1.grau}
              </p>
            </div>
          ) : (
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Escolha um curso na lista abaixo para sua 1ª opção.
            </p>
          )}
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            cursoOpcao2
              ? 'border-emerald-500/40 bg-emerald-500/10'
              : 'border-dashed border-[var(--border-color)] bg-[var(--bg-hover)]'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              2ª Opção de Curso (opcional)
            </span>
            {cursoOpcao2 && (
              <button
                type="button"
                onClick={() => onChangePerfil({ ...perfil, opcao2CursoId: undefined })}
                className="text-[11px] text-[var(--text-muted)] hover:text-rose-400 cursor-pointer"
              >
                Remover
              </button>
            )}
          </div>
          {cursoOpcao2 ? (
            <div className="mt-1">
              <p className="text-sm font-bold text-[var(--text-main)]">
                {cursoOpcao2.curso} — {cursoOpcao2.iesSigla}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {cursoOpcao2.cidade}/{cursoOpcao2.uf} · {cursoOpcao2.turno} · {cursoOpcao2.grau}
              </p>
            </div>
          ) : (
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Opcional: compare uma 2ª opção lado a lado para montar estratégia de aprovação.
            </p>
          )}
        </div>
      </div>

      {/* Checkbox de Bônus Regional se aplicável */}
      {temBonusNosSelecionados && (
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-start gap-3">
          <Award size={18} className="text-indigo-400 shrink-0 mt-0.5" />
          <label className="text-xs text-[var(--text-main)] cursor-pointer space-y-1">
            <span className="flex items-center gap-2 font-bold">
              <input
                type="checkbox"
                checked={perfil.cumpreBonusRegional}
                onChange={(e) =>
                  onChangePerfil({ ...perfil, cumpreBonusRegional: e.target.checked })
                }
                className="w-4 h-4 accent-[var(--primary)]"
              />
              <span>Cumpro os requisitos do Bônus Regional / Inclusão da instituição</span>
            </span>
            <span className="block text-[11px] text-[var(--text-muted)]">
              {cursoOpcao1?.bonusDescricao || cursoOpcao2?.bonusDescricao || 'O bônus percentual só é aplicado na nota final quando confirmado pelo candidato.'}
            </span>
          </label>
        </div>
      )}

      {/* Busca & Filtros */}
      <div className="p-4 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5 relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-label)]"
            />
            <input
              type="text"
              aria-label="Buscar curso, universidade ou cidade"
              placeholder="Buscar curso, universidade (USP, UFRJ...) ou cidade"
              value={busca}
              onChange={(e) => onChangeBusca(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-xs text-[var(--text-main)] outline-none focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <select
              aria-label="Filtrar por UF"
              value={filtroUf}
              onChange={(e) => onChangeFiltroUf(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-xs text-[var(--text-main)] outline-none"
            >
              <option value="">Todas as UFs</option>
              {UFS.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              aria-label="Filtrar por turno"
              value={filtroTurno}
              onChange={(e) => onChangeFiltroTurno(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-xs text-[var(--text-main)] outline-none"
            >
              <option value="">Todos os turnos</option>
              {TURNOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              aria-label="Filtrar por grau"
              value={filtroGrau}
              onChange={(e) => onChangeFiltroGrau(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-xs text-[var(--text-main)] outline-none"
            >
              <option value="">Todos os graus</option>
              {GRAUS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <Filter size={13} />
            <span>{cursos.length} curso(s) encontrado(s)</span>
            {carregandoCursos && <Loader2 size={13} className="animate-spin text-blue-400" />}
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sisu-filtro-mod" className="text-[11px]">
              Vagas na modalidade:
            </label>
            <select
              id="sisu-filtro-mod"
              value={filtroModalidade}
              onChange={(e) =>
                onChangeFiltroModalidade(e.target.value as ModalidadeCodigo | '')
              }
              className="px-2.5 py-1 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] text-[11px] text-[var(--text-main)]"
            >
              <option value="">Qualquer modalidade</option>
              {(Object.keys(MODALIDADES_INFO) as ModalidadeCodigo[]).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Cursos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[560px] overflow-y-auto pr-1">
        {cursos.map((curso) => {
          const ehOp1 = perfil.opcao1CursoId === curso.id;
          const ehOp2 = perfil.opcao2CursoId === curso.id;
          const ehFav = favoritos.includes(curso.id);
          const ultimoCorteAC =
            curso.cortesHistoricos[curso.cortesHistoricos.length - 1]?.modalidades.AC;

          return (
            <div
              key={curso.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                ehOp1
                  ? 'border-blue-500 bg-blue-500/10'
                  : ehOp2
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-[var(--border-light)] bg-[var(--bg-hover)] hover:border-[var(--border-color)]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[var(--primary-soft)] text-blue-400 border border-[var(--primary-border)]">
                        {curso.iesSigla}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-light)]">
                        {curso.grau} · {curso.turno}
                      </span>
                      {curso.ilustrativo && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">
                          Dado ilustrativo
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-[var(--text-main)] mt-1.5 leading-snug">
                      {curso.curso}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                      <MapPin size={12} className="shrink-0" />
                      <span>
                        {curso.campus} · {curso.cidade}/{curso.uf}
                      </span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleFavorito(curso)}
                    aria-label={
                      ehFav
                        ? `Remover ${curso.curso} dos favoritos`
                        : `Favoritar ${curso.curso}`
                    }
                    className={`p-2 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                      ehFav
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                        : 'bg-[var(--bg-card)] border-[var(--border-light)] text-[var(--text-label)] hover:text-amber-400'
                    }`}
                  >
                    <Star size={15} fill={ehFav ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {/* Mini-barras de Pesos */}
                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  {AREA_KEYS.map((area) => (
                    <div
                      key={area}
                      className="p-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-light)] text-center"
                      title={`Peso em ${AREAS_ENEM_META[area].nome}: ${curso.pesos[area]}`}
                    >
                      <span className="block text-[10px] font-bold text-[var(--text-label)]">
                        {area}
                      </span>
                      <span className="block text-xs font-extrabold text-[var(--text-main)] font-mono">
                        p{curso.pesos[area]}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px] text-[var(--text-muted)]">
                  {ultimoCorteAC !== undefined && (
                    <span>
                      Último corte AC:{' '}
                      <strong className="text-[var(--text-main)] font-mono">
                        {formatarNotaBR(ultimoCorteAC)}
                      </strong>
                    </span>
                  )}
                  {curso.bonusPercentual && curso.bonusPercentual > 0 && (
                    <span className="text-indigo-400 font-semibold">
                      · Bônus +{curso.bonusPercentual}%
                    </span>
                  )}
                  {curso.mediaMinima && (
                    <span>· Média mín. {formatarNotaBR(curso.mediaMinima)}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-light)]">
                <button
                  type="button"
                  onClick={() => handleSelecionarOpcao(1, curso.id)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    ehOp1
                      ? 'bg-blue-600 text-white'
                      : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] hover:border-blue-500'
                  }`}
                >
                  {ehOp1 && <Check size={13} />}
                  <span>{ehOp1 ? '1ª opção selecionada' : '1ª opção'}</span>
                </button>

                <button
                  type="button"
                  disabled={ehOp1}
                  onClick={() => handleSelecionarOpcao(2, curso.id)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                    ehOp2
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] hover:border-emerald-500'
                  }`}
                >
                  {ehOp2 && <Check size={13} />}
                  <span>{ehOp2 ? '2ª opção selecionada' : '2ª opção'}</span>
                </button>
              </div>
            </div>
          );
        })}

        {cursos.length === 0 && !carregandoCursos && (
          <div className="col-span-full p-8 rounded-2xl border border-dashed border-[var(--border-color)] text-center text-sm text-[var(--text-muted)]">
            Nenhum curso encontrado com esses filtros. Tente limpar a UF ou alterar o termo de busca.
          </div>
        )}
      </div>

      {/* Rodapé com CTA para Resultado */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[var(--border-light)]">
        <p className="text-xs text-[var(--text-muted)]">
          {cursoOpcao1
            ? `Pronto para simular ${cursoOpcao1.curso}${cursoOpcao2 ? ` e comparar com ${cursoOpcao2.curso}` : ''}.`
            : 'Selecione ao menos a 1ª opção para ver sua chance real.'}
        </p>

        <button
          type="button"
          disabled={!cursoOpcao1}
          onClick={onSimularResultado}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-45 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 shadow-md shadow-[var(--shadow-primary)] transition-all cursor-pointer"
        >
          <span>Calcular meu resultado</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default SisuStepCurso;
