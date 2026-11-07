import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Target,
  TrendingUp,
  Camera,
  Keyboard,
  Upload,
  AlertCircle
} from 'lucide-react';
import { PlanejamentoSemanalService, PlanejamentoSemanalData } from '../services/planejamentoSemanalService';

export const ONB_MATERIAS: [string, string][] = [
  ['matematica', 'Matemática'],
  ['fisica', 'Física'],
  ['quimica', 'Química'],
  ['biologia', 'Biologia'],
  ['portugues', 'Língua Portuguesa'],
  ['redacao', 'Redação'],
  ['literatura', 'Literatura'],
  ['historia', 'História'],
  ['geografia', 'Geografia'],
  ['filosofia', 'Filosofia'],
  ['sociologia', 'Sociologia'],
  ['ingles', 'Inglês']
];

interface QuestionOption {
  v: string;
  t: string;
}

interface OnboardingQuestion {
  id: string;
  passo: number;
  tipo: 'single' | 'multi' | 'escala' | 'notas';
  obrigatoria: boolean;
  pergunta: string;
  sub: string;
  min?: number;
  max?: number;
  opcoes?: QuestionOption[];
}

interface ResumoPlano {
  total_horas_semanais: number;
  horas_uteis_semana: number;
  horas_fds_semana: number;
  media_diaria: number;
  vestibulares: string[];
  cursos: string[];
  materias_foco_prioritario: string[];
  materias_revisao_rapida: string[];
  base_inicial: string;
  ritmo: string;
  prazo: string;
  mensagem_motivacional: string;
}

interface DynamicOnboardingModalProps {
  isOpen: boolean;
  onClose: (resumo?: ResumoPlano) => void;
  currentUser?: any;
}

export const DynamicOnboardingModal: React.FC<DynamicOnboardingModalProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const [perguntas, setPerguntas] = useState<OnboardingQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [passoAtual, setPassoAtual] = useState<number>(1);
  const [respostas, setRespostas] = useState<Record<string, any>>({
    autoavaliacao: 3,
    vestibulares: ['ENEM'],
    prazo: '2026',
    horas_semana: '2a3',
    horas_fds: '2a4'
  });

  // Estado para Notas do Boletim
  const [modoNotas, setModoNotas] = useState<'foto' | 'manual'>('foto');
  const [valoresNotas, setValoresNotas] = useState<Record<string, string>>({});
  const [mediaEscola, setMediaEscola] = useState<string>('');
  const [fotoStatus, setFotoStatus] = useState<string | null>(null);
  const [fotoLoading, setFotoLoading] = useState<boolean>(false);
  const [analiseNotas, setAnaliseNotas] = useState<any>(null);
  const [salvandoNotas, setSalvandoNotas] = useState<boolean>(false);
  const [planoDistribuicao, setPlanoDistribuicao] = useState<any>(null);
  const [planoSemanalGerado, setPlanoSemanalGerado] = useState<PlanejamentoSemanalData | null>(null);

  const [resumoFinal, setResumoFinal] = useState<ResumoPlano | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalPassos = 7;

  // Carregar perguntas da API
  useEffect(() => {
    let isMounted = true;
    async function carregarPerguntas() {
      try {
        const res = await fetch('/api/auth/onboarding/perguntas');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data?.perguntas?.length) {
            setPerguntas(data.perguntas);
          }
        }
      } catch (e) {
        console.warn('Usando perguntas padrão:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (isOpen) {
      carregarPerguntas();
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const perguntasDoPasso = perguntas.filter((p) => p.passo === passoAtual);

  const handleSelectSingle = (id: string, val: string) => {
    setRespostas((prev) => ({
      ...prev,
      [id]: val
    }));
    setErrorMsg(null);
  };

  const handleToggleMulti = (id: string, val: string) => {
    setRespostas((prev) => {
      const current = Array.isArray(prev[id]) ? [...prev[id]] : [];
      const idx = current.indexOf(val);
      if (idx >= 0) {
        current.splice(idx, 1);
      } else {
        current.push(val);
      }
      return {
        ...prev,
        [id]: current
      };
    });
    setErrorMsg(null);
  };

  const handleSelectEscala = (id: string, val: number) => {
    setRespostas((prev) => ({
      ...prev,
      [id]: val
    }));
    setErrorMsg(null);
  };

  // Upload e OCR de boletim
  const handleArquivoBoletim = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setFotoStatus('Imagem muito grande (máx. 8 MB). Reduza ou tente outra.');
      return;
    }

    setFotoLoading(true);
    setFotoStatus('📖 Lendo seu boletim com IA...');
    setErrorMsg(null);

    try {
      const fd = new FormData();
      fd.append('boletim', file);

      const usuarioId =
        currentUser?.uid ||
        currentUser?.email ||
        localStorage.getItem('gabarita_usuario_id') ||
        'usuario_padrao';

      const res = await fetch('/api/onboarding/notas/foto', {
        method: 'POST',
        headers: {
          'x-usuario-id': usuarioId
        },
        body: fd
      });

      const d = await res.json();
      if (!res.ok || d.erro) {
        setFotoStatus(d.erro || 'Falha ao ler o boletim.');
        if (d.fallback === 'manual') setModoNotas('manual');
        return;
      }

      const novosValores: Record<string, string> = { ...valoresNotas };
      if (Array.isArray(d.notas_extraidas)) {
        d.notas_extraidas.forEach((item: { materia: string; nota: number }) => {
          novosValores[item.materia] = String(item.nota);
        });
        setValoresNotas(novosValores);
      }

      if (d.media_boletim) {
        setMediaEscola(String(d.media_boletim));
      }

      const count = d.notas_extraidas?.length || 0;
      const naoRec = d.nao_identificadas?.length
        ? ` · não reconhecidas: ${d.nao_identificadas.join(', ')}`
        : '';
      setFotoStatus(`✅ ${count} matérias lidas${naoRec}. Confira e corrija abaixo.`);
    } catch (err) {
      console.error('Erro no upload do boletim:', err);
      setFotoStatus('Falha na conexão. Digite as notas manualmente abaixo.');
    } finally {
      setFotoLoading(false);
    }
  };

  // Salvar notas escolares
  const handleSalvarNotas = async () => {
    const notas: Record<string, number> = {};
    Object.entries(valoresNotas).forEach(([k, v]) => {
      const num = parseFloat(String(v).replace(',', '.'));
      if (!isNaN(num) && num >= 0) {
        notas[k] = num;
      }
    });

    if (Object.keys(notas).length < 3) {
      setErrorMsg('Informe notas de pelo menos 3 matérias (escala 0 a 10).');
      return;
    }

    setSalvandoNotas(true);
    setErrorMsg(null);

    try {
      const usuarioId =
        currentUser?.uid ||
        currentUser?.email ||
        localStorage.getItem('vestibularpro_usuario_id') ||
        'usuario_padrao';

      const me = parseFloat(String(mediaEscola || '').replace(',', '.'));

      const res = await fetch('/api/onboarding/notas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-usuario-id': usuarioId
        },
        body: JSON.stringify({
          usuario_id: usuarioId,
          notas,
          origem: modoNotas,
          media_escola: isNaN(me) ? null : me
        })
      });

      const d = await res.json();
      if (!res.ok || d.erro) {
        setErrorMsg(d.erro || 'Erro ao analisar notas.');
      } else {
        setAnaliseNotas(d.analise);
        setRespostas((prev) => ({ ...prev, notas_boletim: true }));
      }
    } catch (err: any) {
      console.error('Erro ao salvar notas:', err);
      setErrorMsg('Falha de rede ao analisar notas.');
    } finally {
      setSalvandoNotas(false);
    }
  };

  // Validação do passo atual
  const passoValido = perguntasDoPasso.every((p) => {
    if (!p.obrigatoria) return true;
    const val = respostas[p.id];
    if (val === undefined || val === null || val === '') return false;
    if (Array.isArray(val) && val.length === 0) return false;
    return true;
  });

  const handleNext = () => {
    if (!passoValido) {
      setErrorMsg('Por favor, responda às perguntas obrigatórias antes de avançar.');
      return;
    }
    setErrorMsg(null);
    if (passoAtual < totalPassos) {
      setPassoAtual((p) => p + 1);
    } else {
      finalizarOnboarding();
    }
  };

  const handlePrev = () => {
    if (passoAtual > 1) {
      setPassoAtual((p) => p - 1);
      setErrorMsg(null);
    }
  };

  const finalizarOnboarding = async () => {
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const usuarioId =
        currentUser?.uid ||
        currentUser?.email ||
        localStorage.getItem('vestibularpro_usuario_id') ||
        'usuario_padrao';

      const payload = {
        usuario_id: usuarioId,
        email: currentUser?.email,
        nome: currentUser?.displayName,
        respostas
      };

      const res = await fetch('/api/auth/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-usuario-id': usuarioId
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.sucesso) {
        setResumoFinal(data.resumo);

        let dist = null;
        try {
          const planoRes = await fetch('/api/onboarding/plano', {
            headers: { 'x-usuario-id': usuarioId }
          });
          if (planoRes.ok) {
            const planoData = await planoRes.json();
            if (planoData?.com_notas && planoData.distribuicao) {
              setPlanoDistribuicao(planoData);
              dist = planoData.distribuicao;
            }
          }
        } catch (e) {
          console.warn('Erro ao carregar plano calibrado:', e);
        }

        // Gerar planejamento semanal de acordo com o período e opções selecionadas
        try {
          const weekly = PlanejamentoSemanalService.gerar(
            {
              ...respostas,
              resumo: data.resumo
            },
            dist
          );
          setPlanoSemanalGerado(weekly);
        } catch (e) {
          console.error('Erro ao gerar planejamento semanal:', e);
        }

        try {
          localStorage.setItem('vestibularpro_onboarding_completo', 'true');
          if (data.resumo) {
            localStorage.setItem('vestibularpro_resumo_plano', JSON.stringify(data.resumo));
          }
          if (data.user) {
            localStorage.setItem('vestibularpro_user_profile', JSON.stringify(data.user));
          }
        } catch (e) {}
      } else {
        setErrorMsg(data.erro || 'Erro ao salvar perfil. Tente novamente.');
      }
    } catch (err: any) {
      console.error('Erro ao finalizar onboarding:', err);
      // Fallback em caso de offline
      const hsSemana = respostas.horas_semana === 'gt4' ? 4.5 : 2.5;
      const hsFds = respostas.horas_fds === 'gt6' ? 6.5 : 3;
      const total = Math.round(hsSemana * 5 + hsFds * 2);
      const fallbackResumo: ResumoPlano = {
        total_horas_semanais: total,
        horas_uteis_semana: hsSemana * 5,
        horas_fds_semana: hsFds * 2,
        media_diaria: Number((total / 7).toFixed(1)),
        vestibulares: respostas.vestibulares || ['ENEM'],
        cursos: respostas.cursos || ['Geral'],
        materias_foco_prioritario: respostas.piores_materias || ['Matemática', 'Física'],
        materias_revisao_rapida: respostas.melhores_materias || [],
        base_inicial: 'Intermediária',
        ritmo: respostas.ritmo || 'equilibrado',
        prazo: respostas.prazo || '2026',
        mensagem_motivacional: 'Plano personalizado salvo localmente com sucesso!'
      };
      setResumoFinal(fallbackResumo);
      try {
        const weeklyFallback = PlanejamentoSemanalService.gerar({
          ...respostas,
          resumo: fallbackResumo
        });
        setPlanoSemanalGerado(weeklyFallback);
        localStorage.setItem('vestibularpro_onboarding_completo', 'true');
      } catch (e) {}
    } finally {
      setSubmitting(false);
    }
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return 'Momento de Estudo';
      case 2:
        return 'Alvos & Vestibulares';
      case 3:
        return 'Diagnóstico de Matérias';
      case 4:
        return 'Rotina & Disponibilidade';
      case 5:
        return 'Metodologia de Estudo';
      case 6:
        return 'Metas & Superação';
      case 7:
        return 'Boletim & Notas';
      default:
        return 'Personalização';
    }
  };

  return (
    <div className="onb-overlay">
      <div className="onb-card">
        {/* HEADER */}
        <div className="onb-header">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                {resumoFinal ? '✓' : passoAtual}
              </div>
              <span className="onb-step-tag">
                {resumoFinal
                  ? 'Plano Calibrado'
                  : `Passo ${passoAtual} de ${totalPassos} • ${getStepTitle(passoAtual)}`}
              </span>
            </div>
            {!resumoFinal && (
              <span className="text-[11px] text-[#A3A3A3] font-medium">
                {Math.round((passoAtual / totalPassos) * 100)}% concluído
              </span>
            )}
          </div>

          <div className="onb-progress-wrap">
            <div className="onb-progress-bg">
              <div
                className="onb-bar"
                style={{
                  width: resumoFinal ? '100%' : `${(passoAtual / totalPassos) * 100}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* TELA DE CONCLUSÃO COM RESUMO */}
        {resumoFinal ? (
          <div className="onb-body">
            <div className="text-center space-y-2 py-2">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-400 mb-2 border border-emerald-500/30">
                <CheckCircle2 size={30} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#FAFAFA] tracking-tight">
                Seu Plano de Estudos está Pronto!
              </h2>
              <p className="text-xs sm:text-sm text-[#A3A3A3] max-w-md mx-auto leading-relaxed">
                {resumoFinal.mensagem_motivacional}
              </p>
            </div>

            <div className="onb-resumo-card">
              <div className="onb-resumo-stat">
                <span className="onb-resumo-label flex items-center gap-1.5">
                  <Clock size={14} className="text-blue-400" /> Carga Semanal Sugerida:
                </span>
                <span className="onb-resumo-val text-blue-400">
                  {resumoFinal.total_horas_semanais}h / semana (~{resumoFinal.media_diaria}h/dia)
                </span>
              </div>

              <div className="onb-resumo-stat">
                <span className="onb-resumo-label flex items-center gap-1.5">
                  <Target size={14} className="text-amber-400" /> Vestibulares Alvo:
                </span>
                <span className="font-semibold text-[#FAFAFA]">
                  {resumoFinal.vestibulares.join(', ')}
                </span>
              </div>

              <div className="onb-resumo-stat">
                <span className="onb-resumo-label flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-purple-400" /> Nível Inicial:
                </span>
                <span className="font-medium text-purple-300">
                  {resumoFinal.base_inicial}
                </span>
              </div>

              <div className="pt-2">
                <span className="text-xs font-semibold text-[#9CA3AF] block mb-2">
                  Matérias com Reforço Prioritário:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {resumoFinal.materias_foco_prioritario.length > 0 ? (
                    resumoFinal.materias_foco_prioritario.map((m, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-red-500/15 border border-red-500/30 text-red-300"
                      >
                        ⚡ {m}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[#737373]">Equilíbrio geral configurado</span>
                  )}
                </div>
              </div>
            </div>

            {/* SE HOUVER DISTRIBUIÇÃO COM NOTAS ESCOLARES */}
            {planoDistribuicao?.distribuicao?.materias && (
              <div className="comp-c mt-1">
                <div className="comp-nm mb-2.5 flex items-center justify-between">
                  <span>🗓 Sua rotina semanal ({planoDistribuicao.horas_semanais}h)</span>
                  <span className="text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                    Calibrada por notas reais
                  </span>
                </div>
                <div className="divide-y divide-[#1E2534] max-h-48 overflow-y-auto pr-1">
                  {planoDistribuicao.distribuicao.materias.map((item: any) => (
                    <div key={item.materia} className="dist-linha py-2">
                      <span className="text-xs text-[#FAFAFA] font-medium">{item.nome}</span>
                      <span className="dist-h text-xs">{item.horas_semanais}h/sem</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PLANEJAMENTO SEMANAL INICIALIZADO DE ACORDO COM O TURNO / PERÍODO */}
            {planoSemanalGerado && (
              <div className="comp-c mt-2 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold text-sm text-[#FAFAFA]">
                      Planejamento Semanal Inicializado
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-blue-400 bg-blue-500/15 border border-blue-500/30 px-2.5 py-0.5 rounded-md">
                    {planoSemanalGerado.periodoEstudo}
                  </span>
                </div>

                <p className="text-xs text-[#A3A3A3] leading-relaxed">
                  Sua rotina semanal foi montada especificamente para o período de <strong>{planoSemanalGerado.periodoEstudo}</strong> com foco prioritário em <strong>{planoSemanalGerado.horarioPico}</strong>. Veja os primeiros blocos de Segunda-feira:
                </p>

                <div className="space-y-1.5 pt-1">
                  {planoSemanalGerado.dias[0]?.slots.slice(0, 3).map((slot) => (
                    <div
                      key={slot.id}
                      className="dist-linha py-2 rounded-lg bg-[#000000]/40 px-3 border border-[#1E2534] text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-400">{slot.horario}</span>
                        <span className="font-semibold text-[#FAFAFA]">{slot.materia}</span>
                        {slot.prioritaria && (
                          <span className="text-amber-400 text-[10px] bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                            ⭐ Prioritária
                          </span>
                        )}
                      </div>
                      <span className="text-[#A3A3A3] text-[11px] truncate max-w-[160px]">{slot.conteudo}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.setItem('vestibularpro_abrir_rotina', 'true');
                  } catch (e) {}
                  onClose(resumoFinal);
                }}
                className="onb-btn onb-btn-primary w-full py-3.5 text-sm font-bold shadow-lg"
              >
                Iniciar meu planejamento semanal agora
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          /* CORPO DO FORMULÁRIO DINÂMICO */
          <>
            <div className="onb-body">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle size={15} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {loading ? (
                <div className="py-12 text-center text-xs text-[#A3A3A3]">
                  Carregando questionário adaptativo...
                </div>
              ) : (
                perguntasDoPasso.map((q) => {
                  const currentValue = respostas[q.id];

                  // PASSO ESPECIAL: NOTAS DO BOLETIM (tipo === 'notas')
                  if (q.tipo === 'notas') {
                    return (
                      <div key={q.id} className="space-y-4">
                        <div>
                          <h3 className="onb-question-title">{q.pergunta}</h3>
                          <p className="onb-question-sub">{q.sub}</p>
                        </div>

                        {/* ABAS: FOTO vs MANUAL */}
                        <div className="onb-tabs">
                          <button
                            type="button"
                            className={`onb-tab ${modoNotas === 'foto' ? 'on' : ''}`}
                            onClick={() => setModoNotas('foto')}
                          >
                            <Camera size={14} className="inline mr-1.5" />
                            Foto do boletim
                          </button>
                          <button
                            type="button"
                            className={`onb-tab ${modoNotas === 'manual' ? 'on' : ''}`}
                            onClick={() => setModoNotas('manual')}
                          >
                            <Keyboard size={14} className="inline mr-1.5" />
                            Digitar notas
                          </button>
                        </div>

                        {/* MODO FOTO: UPLOAD COM OCR */}
                        {modoNotas === 'foto' && (
                          <div className="space-y-3 p-4 rounded-xl bg-[#000000] border border-[#1E2534]">
                            <input
                              type="file"
                              ref={fileInputRef}
                              accept="image/png,image/jpeg,image/webp"
                              style={{ display: 'none' }}
                              onChange={handleArquivoBoletim}
                            />
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={fotoLoading}
                              className="onb-btn w-full bg-[#1A2130] text-[#FAFAFA] hover:bg-[#232B3C] border border-[#2A3348] flex items-center justify-center gap-2 py-3"
                            >
                              <Upload size={16} />
                              {fotoLoading ? 'Lendo boletim...' : 'Selecionar foto do boletim'}
                            </button>
                            <p className="text-[11px] text-[#A3A3A3] text-center leading-relaxed">
                              {fotoStatus ||
                                'PNG, JPG ou WEBP até 8 MB. A IA lê as notas e você confere tudo antes de salvar.'}
                            </p>
                          </div>
                        )}

                        {/* INPUT: MÉDIA DA ESCOLA */}
                        <div>
                          <label className="text-xs text-[#A3A3A3] mb-1.5 block">
                            Média de aprovação da sua escola (opcional):
                          </label>
                          <input
                            type="number"
                            className="onb-input"
                            min="0"
                            max="100"
                            step="0.5"
                            placeholder="Ex: 6.0 ou 7.0 (opcional)"
                            value={mediaEscola}
                            onChange={(e) => setMediaEscola(e.target.value)}
                          />
                        </div>

                        {/* GRID DE NOTAS DAS MATÉRIAS */}
                        <div>
                          <label className="text-xs font-semibold text-[#D1D5DB] mb-2 block">
                            Notas das disciplinas (escala 0 a 10):
                          </label>
                          <div className="onb-grid-notas">
                            {ONB_MATERIAS.map(([key, label]) => {
                              const val = valoresNotas[key] ?? '';
                              return (
                                <div key={key} className="onb-linha">
                                  <span>{label}</span>
                                  <input
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    max="100"
                                    placeholder="0–10"
                                    value={val}
                                    onChange={(e) =>
                                      setValoresNotas((prev) => ({
                                        ...prev,
                                        [key]: e.target.value
                                      }))
                                    }
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* BOTÃO ANALISAR E SALVAR */}
                        <button
                          type="button"
                          onClick={handleSalvarNotas}
                          disabled={salvandoNotas}
                          className="onb-btn onb-btn-primary w-full py-3 font-bold"
                        >
                          {salvandoNotas ? 'Analisando notas...' : '📊 Analisar e calibrar com notas'}
                        </button>

                        {/* RESULTADO DA ANÁLISE */}
                        {analiseNotas && (
                          <div className="comp-c mt-3 space-y-2.5">
                            <div className="comp-nm">📊 Análise da IA</div>
                            <p className="text-xs text-[#A3A3A3] leading-relaxed">
                              {analiseNotas.resumo}
                            </p>
                            <div className="divide-y divide-[#1E2534] pt-1">
                              {analiseNotas.por_materia.slice(0, 6).map((m: any) => {
                                const lbMap: Record<string, string> = {
                                  critica: 'Crítica',
                                  atencao: 'Atenção',
                                  solida: 'Sólida',
                                  forte: 'Forte'
                                };
                                return (
                                  <div key={m.materia} className="dist-linha py-1.5">
                                    <span className="text-xs text-[#FAFAFA]">
                                      {m.nome}
                                      {m.confirmada && <span className="text-amber-400 ml-1">⭐</span>}
                                    </span>
                                    <span className="flex items-center gap-2">
                                      <span className={`classe-chip classe-${m.classe}`}>
                                        {lbMap[m.classe] || m.classe}
                                      </span>
                                      <span className="text-xs font-bold text-[#FAFAFA]">
                                        {Number(m.nota).toFixed(1)}
                                      </span>
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                            {analiseNotas.por_materia.length > 6 && (
                              <p className="text-[11px] text-[#737373] text-center pt-1">
                                + {analiseNotas.por_materia.length - 6} outras disciplinas analisadas
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // PERGUNTAS SINGLE / MULTI / ESCALA PADRÃO
                  return (
                    <div key={q.id} className="onb-question-block">
                      <div className="flex items-baseline justify-between gap-2">
                        <label className="onb-question-title">
                          {q.pergunta}
                          {q.obrigatoria && <span className="text-blue-400 ml-1 font-bold">*</span>}
                        </label>
                      </div>
                      {q.sub && <p className="onb-question-sub">{q.sub}</p>}

                      {/* TIPO: SINGLE */}
                      {q.tipo === 'single' && q.opcoes && (
                        <div className="onb-chips">
                          {q.opcoes.map((op) => {
                            const isAtivo = currentValue === op.v;
                            return (
                              <button
                                key={op.v}
                                type="button"
                                onClick={() => handleSelectSingle(q.id, op.v)}
                                className={`onb-chip ${isAtivo ? 'ativo' : ''}`}
                              >
                                <span>{op.t}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* TIPO: MULTI */}
                      {q.tipo === 'multi' && q.opcoes && (
                        <div className="onb-chips">
                          {q.opcoes.map((op) => {
                            const isAtivo =
                              Array.isArray(currentValue) && currentValue.includes(op.v);
                            return (
                              <button
                                key={op.v}
                                type="button"
                                onClick={() => handleToggleMulti(q.id, op.v)}
                                className={`onb-chip ${isAtivo ? 'ativo' : ''}`}
                              >
                                <span className={`text-xs ${isAtivo ? 'text-blue-400' : 'text-[#737373]'}`}>
                                  {isAtivo ? '✓' : '+'}
                                </span>
                                <span>{op.t}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* TIPO: ESCALA (1 a 5) */}
                      {q.tipo === 'escala' && (
                        <div className="onb-escala">
                          {[1, 2, 3, 4, 5].map((val) => {
                            const isAtivo = Number(currentValue) === val;
                            const labels = ['Básica', 'Iniciante', 'Intermediária', 'Boa', 'Avançada'];
                            return (
                              <button
                                key={val}
                                type="button"
                                onClick={() => handleSelectEscala(q.id, val)}
                                className={`onb-esc ${isAtivo ? 'ativo' : ''}`}
                              >
                                <span className="text-lg leading-none">{val}</span>
                                <span className="onb-esc-sub">{labels[val - 1]}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* FOOTER COM BOTÕES */}
            <div className="onb-footer">
              <div>
                {passoAtual > 1 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={submitting}
                    className="onb-btn onb-btn-secondary"
                  >
                    <ArrowLeft size={16} />
                    Voltar
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {passoAtual === totalPassos && !analiseNotas && (
                  <button
                    type="button"
                    onClick={finalizarOnboarding}
                    disabled={submitting}
                    className="onb-skip"
                  >
                    Pular esta etapa
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!passoValido || submitting}
                  className="onb-btn onb-btn-primary"
                >
                  {submitting ? (
                    'Gerando planejamento...'
                  ) : passoAtual === totalPassos ? (
                    <>
                      Gerar meu planejamento semanal
                      <Sparkles size={16} />
                    </>
                  ) : (
                    <>
                      Continuar
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DynamicOnboardingModal;
