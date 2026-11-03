export interface WeeklyStudySlot {
  id: string;
  horario: string;
  materia: string;
  conteudo: string;
  tipo: 'teoria' | 'questoes' | 'revisao' | 'redacao' | 'simulado';
  duracaoMin: number;
  prioritaria: boolean;
  concluido: boolean;
}

export interface WeeklyStudyDay {
  dia: string;
  diaCurto: string;
  dataLabel?: string;
  turno: string;
  slots: WeeklyStudySlot[];
}

export interface PlanejamentoSemanalData {
  geradoEm: string;
  periodoEstudo: string; // "Manhã", "Tarde", "Noite", "Integral"
  horarioPico: string;
  horasSemanais: number;
  vestibulares: string[];
  pioresMaterias: string[];
  dias: WeeklyStudyDay[];
}

const TOPICOS_POR_MATERIA: Record<string, string[]> = {
  Matemática: [
    'Funções de 1º e 2º Grau & Gráficos',
    'Geometria Plana & Trigonometria',
    'Probabilidade & Estatística Descritiva',
    'Análise Combinatória & Arranjos',
    'Razão, Proporção e Regra de Três'
  ],
  Física: [
    'Cinemática & Movimento Uniformemente Variado',
    'Leis de Newton & Dinâmica',
    'Trabalho, Energia & Conservação',
    'Eletrodinâmica & Leis de Ohm',
    'Calorimetria & Mudanças de Fase'
  ],
  Química: [
    'Estequiometria & Rendimento de Reações',
    'Funções Orgânicas & Isomeria',
    'Ligações Químicas & Interações Moleculares',
    'Equilíbrio Químico, pH e Soluções',
    'Eletroquímica (Pilhas e Eletrólise)'
  ],
  Biologia: [
    'Ecologia & Ciclos Biogeoquímicos',
    'Genética Mendeliana & Biologia Molecular',
    'Citologia & Fisiologia Celular',
    'Fisiologia Humana & Sistemas',
    'Evolução & Seleção Natural'
  ],
  'Língua Portuguesa': [
    'Interpretação Textual & Coesão',
    'Sintaxe do Período Composto & Regência',
    'Pontuação & Crase',
    'Figuras de Linguagem & Variação Linguística'
  ],
  Redação: [
    'Estrutura Dissertativo-Argumentativa & Tese',
    'Repertório Sociocultural Produtivo',
    'Proposta de Intervenção Detalhada (5 Elementos)',
    'Conectivos Interparágrafos & Coesão Referencial'
  ],
  Literatura: [
    'Modernismo no Brasil (1ª, 2ª e 3ª Fases)',
    'Romantismo & Realismo Machado de Assis',
    'Obras Obrigatórias Fuvest/Unicamp'
  ],
  História: [
    'Brasil Colônia & Ciclo do Ouro',
    'Era Vargas & Ditadura Militar no Brasil',
    'Revolução Industrial & Imperialismo',
    'Guerras Mundiais & Guerra Fria'
  ],
  Geografia: [
    'Geopolítica Contemporânea & Globalização',
    'Urbanização & Demografia Brasileira',
    'Climatologia, Biomas e Impactos Ambientais',
    'Agropecuária Brasileira & Conflitos de Terra'
  ],
  Filosofia: [
    'Filosofia Antiga: Sócrates, Platão e Aristóteles',
    'Contratualismo: Hobbes, Locke e Rousseau',
    'Ética, Política e Teoria Crítica'
  ],
  Sociologia: [
    'Clássicos da Sociologia: Marx, Durkheim e Weber',
    'Cidadania, Direitos Humanos e Movimentos Sociais',
    'Indústria Cultural e Sociedade de Consumo'
  ],
  Inglês: [
    'Interpretação de Textos de Atualidades',
    'Técnicas de Leitura Rápida (Skimming & Scanning)',
    'Vocabulário Contextualizado & Conectivos'
  ]
};

const MATERIAS_MAP: Record<string, string> = {
  matematica: 'Matemática',
  fisica: 'Física',
  quimica: 'Química',
  biologia: 'Biologia',
  portugues: 'Língua Portuguesa',
  redacao: 'Redação',
  literatura: 'Literatura',
  historia: 'História',
  geografia: 'Geografia',
  filosofia: 'Filosofia',
  sociologia: 'Sociologia',
  ingles: 'Inglês'
};

const STORAGE_KEY = 'vestibularpro_planejamento_semanal';

export class PlanejamentoSemanalService {
  public static gerar(perfil: any, distribuicaoNotas?: any): PlanejamentoSemanalData {
    const turno = perfil?.turno || 'manha';
    const horarioPico = perfil?.horario_pico || 'manha';

    // Mapear piores matérias
    const rawPiores: string[] = Array.isArray(perfil?.piores_materias)
      ? perfil.piores_materias
      : [];
    const pioresNomes = rawPiores.map((m) => MATERIAS_MAP[m] || m).filter(Boolean);

    // Mapear vestibulares
    const vestibulares: string[] = Array.isArray(perfil?.vestibulares)
      ? perfil.vestibulares
      : ['ENEM'];

    // Carga horária
    const horasSemanais = Number(perfil?.resumo?.total_horas_semanais) || 24;

    const periodoLabels: Record<string, string> = {
      manha: 'Manhã (07h30 às 12h30)',
      tarde: 'Tarde (13h30 às 18h30)',
      noite: 'Noite (19h00 às 23h00)',
      integral: 'Integral (Manhã + Tarde)'
    };

    const diasNomes = [
      { nome: 'Segunda-feira', curto: 'SEG' },
      { nome: 'Terça-feira', curto: 'TER' },
      { nome: 'Quarta-feira', curto: 'QUA' },
      { nome: 'Quinta-feira', curto: 'QUI' },
      { nome: 'Sexta-feira', curto: 'SEX' },
      { nome: 'Sábado', curto: 'SÁB' },
      { nome: 'Domingo', curto: 'DOM' }
    ];

    // Horários de slots baseados no turno selecionado
    const getHorariosParaTurno = (t: string): string[] => {
      switch (t) {
        case 'tarde':
          return ['14:00 - 15:30', '15:45 - 17:15', '17:30 - 18:30'];
        case 'noite':
          return ['19:00 - 20:15', '20:30 - 21:45', '22:00 - 23:00'];
        case 'integral':
          return ['09:00 - 10:30', '10:45 - 12:15', '14:30 - 16:00', '16:15 - 17:30'];
        case 'manha':
        default:
          return ['08:00 - 09:30', '09:45 - 11:15', '11:30 - 12:30'];
      }
    };

    const horariosUteis = getHorariosParaTurno(turno);

    // Pool de matérias geral ordenadas por prioridade
    const todasMaterias = Object.values(MATERIAS_MAP);
    const priorizadas = [
      ...pioresNomes,
      ...todasMaterias.filter((m) => !pioresNomes.includes(m))
    ];

    let matIndex = 0;
    const dias: WeeklyStudyDay[] = [];

    // SEGUNDA A SEXTA
    for (let i = 0; i < 5; i++) {
      const dInfo = diasNomes[i];
      const slots: WeeklyStudySlot[] = [];

      horariosUteis.forEach((horario, slotIdx) => {
        // Se for o primeiro slot do dia e o horário de pico coincide, prioriza pior matéria
        const ehPrimeiroSlot = slotIdx === 0;
        const materiaNome = priorizadas[matIndex % priorizadas.length];
        matIndex++;

        const topicos = TOPICOS_POR_MATERIA[materiaNome] || ['Resolução de questões comentadas', 'Revisão teórica'];
        const conteudo = topicos[Math.floor(Math.random() * topicos.length)];
        const ehPrioritaria = pioresNomes.includes(materiaNome);

        let tipo: WeeklyStudySlot['tipo'] = 'teoria';
        if (slotIdx === horariosUteis.length - 1) {
          tipo = 'questoes';
        } else if (slotIdx === 1) {
          tipo = 'revisao';
        }

        slots.push({
          id: `slot_${i}_${slotIdx}`,
          horario,
          materia: materiaNome,
          conteudo,
          tipo,
          duracaoMin: slotIdx === horariosUteis.length - 1 ? 60 : 90,
          prioritaria: ehPrioritaria,
          concluido: false
        });
      });

      dias.push({
        dia: dInfo.nome,
        diaCurto: dInfo.curto,
        turno: periodoLabels[turno] || 'Manhã',
        slots
      });
    }

    // SÁBADO: Simulado & Análise de Desempenho
    dias.push({
      dia: 'Sábado',
      diaCurto: 'SÁB',
      turno: 'Manhã & Tarde',
      slots: [
        {
          id: 'slot_5_0',
          horario: '08:30 - 12:30',
          materia: `Simulado Oficial ${vestibulares[0] || 'ENEM'}`,
          conteudo: 'Simulado de 1ª Fase com cronômetro real e gabarito oficial',
          tipo: 'simulado',
          duracaoMin: 240,
          prioritaria: true,
          concluido: false
        },
        {
          id: 'slot_5_1',
          horario: '14:30 - 16:30',
          materia: 'Análise de Erros & Raio-X',
          conteudo: 'Mapeamento detalhado das questões erradas no simulado',
          tipo: 'revisao',
          duracaoMin: 120,
          prioritaria: false,
          concluido: false
        }
      ]
    });

    // DOMINGO: Redação & Organização da Próxima Semana
    dias.push({
      dia: 'Domingo',
      diaCurto: 'DOM',
      turno: 'Manhã',
      slots: [
        {
          id: 'slot_6_0',
          horario: '09:00 - 11:00',
          materia: 'Redação Nota 1000',
          conteudo: 'Redação completa com introdução, tese e proposta de intervenção',
          tipo: 'redacao',
          duracaoMin: 120,
          prioritaria: true,
          concluido: false
        },
        {
          id: 'slot_6_1',
          horario: '11:15 - 12:30',
          materia: 'Flashcards & Repetição Espaçada',
          conteudo: 'Revisão rápida das fórmulas e conceitos-chave da semana',
          tipo: 'questoes',
          duracaoMin: 75,
          prioritaria: false,
          concluido: false
        }
      ]
    });

    const data: PlanejamentoSemanalData = {
      geradoEm: new Date().toISOString(),
      periodoEstudo: periodoLabels[turno] || 'Manhã (07h30 às 12h30)',
      horarioPico: horarioPico.charAt(0).toUpperCase() + horarioPico.slice(1),
      horasSemanais,
      vestibulares,
      pioresMaterias: pioresNomes,
      dias
    };

    this.salvar(data);
    return data;
  }

  public static salvar(data: PlanejamentoSemanalData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      // Sincronizar também com study_routine para retrocompatibilidade
      const studyRoutineFormat = data.dias.map((d) => ({
        day: d.dia,
        slots: d.slots.map((s) => ({
          subject: s.materia,
          content: s.conteudo
        }))
      }));
      localStorage.setItem('study_routine', JSON.stringify(studyRoutineFormat));
    } catch (e) {
      console.error('Erro ao salvar planejamento semanal localmente:', e);
    }
  }

  public static carregar(): PlanejamentoSemanalData | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Erro ao carregar planejamento semanal:', e);
    }
    return null;
  }

  public static toggleSlot(slotId: string): PlanejamentoSemanalData | null {
    const data = this.carregar();
    if (!data) return null;

    let alterado = false;
    data.dias.forEach((d) => {
      d.slots.forEach((s) => {
        if (s.id === slotId) {
          s.concluido = !s.concluido;
          alterado = true;
        }
      });
    });

    if (alterado) {
      this.salvar(data);
    }
    return data;
  }

  public static calcularProgresso(data: PlanejamentoSemanalData): {
    total: number;
    concluidos: number;
    porcentagem: number;
  } {
    let total = 0;
    let concluidos = 0;
    data.dias.forEach((d) => {
      d.slots.forEach((s) => {
        total++;
        if (s.concluido) concluidos++;
      });
    });
    const porcentagem = total > 0 ? Math.round((concluidos / total) * 100) : 0;
    return { total, concluidos, porcentagem };
  }
}
