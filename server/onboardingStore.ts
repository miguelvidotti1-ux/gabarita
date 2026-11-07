import fs from "fs";
import path from "path";

export const CURSOS: Record<string, string> = {
  medicina: "Medicina",
  engenharia: "Engenharia",
  direito: "Direito",
  ti: "TI e Computação",
  adm: "Administração e Economia",
  saude: "Outras áreas da Saúde",
  outro: "Outro"
};

export const VESTIBULARES: Record<string, string> = {
  ENEM: "ENEM",
  FUVEST: "FUVEST (USP)",
  UNICAMP: "UNICAMP",
  UNESP: "UNESP",
  UERJ: "UERJ",
  ITA: "ITA",
  IME: "IME",
  UNIFESP: "UNIFESP",
  MACKENZIE: "Mackenzie",
  FGV: "FGV",
  UFRJ: "UFRJ",
  UFMG: "UFMG"
};

export const MATERIAS: Record<string, string> = {
  matematica: "Matemática",
  fisica: "Física",
  quimica: "Química",
  biologia: "Biologia",
  portugues: "Língua Portuguesa",
  redacao: "Redação",
  literatura: "Literatura",
  historia: "História",
  geografia: "Geografia",
  filosofia: "Filosofia",
  sociologia: "Sociologia",
  ingles: "Inglês"
};

export const HORAS_MAP: Record<string, number> = {
  lt1: 0.5,
  "1a2": 1.5,
  "2a3": 2.5,
  "3a4": 3.5,
  gt4: 4.5,
  "2a4": 3,
  "4a6": 5,
  gt6: 6.5
};

export interface OnboardingPergunta {
  id: string;
  passo: number;
  tipo: "single" | "multi" | "escala" | "notas";
  obrigatoria: boolean;
  pergunta: string;
  sub: string;
  min?: number;
  max?: number;
  opcoes?: { v: string; t: string }[];
}

export const PERGUNTAS_ONBOARDING: OnboardingPergunta[] = [
  // PASSO 1 - Momento de Estudo
  {
    id: "etapa",
    passo: 1,
    tipo: "single",
    obrigatoria: true,
    pergunta: "Em qual etapa dos estudos você está?",
    sub: "Isso define a profundidade e as datas do seu cronograma.",
    opcoes: [
      { v: "2ano", t: "2º ano do Ensino Médio" },
      { v: "3ano", t: "3º ano do Ensino Médio" },
      { v: "formado", t: "Já terminei o EM (estudando sozinho/treineiro)" },
      { v: "cursinho", t: "Cursinho pré-vestibular intensivo" }
    ]
  },
  {
    id: "turno",
    passo: 1,
    tipo: "single",
    obrigatoria: false,
    pergunta: "Você estuda ou trabalha em qual turno?",
    sub: "Usamos isso para liberar os horários do seu plano diário.",
    opcoes: [
      { v: "manha", t: "Manhã" },
      { v: "tarde", t: "Tarde" },
      { v: "noite", t: "Noite" },
      { v: "integral", t: "Integral" }
    ]
  },

  // PASSO 2 - Objetivos e Alvos
  {
    id: "vestibulares",
    passo: 2,
    tipo: "multi",
    obrigatoria: true,
    pergunta: "Qual(is) vestibular(es) você almeja passar?",
    sub: "Seu foco define os simulados recomendados e correção de redação.",
    opcoes: Object.entries(VESTIBULARES).map(([v, t]) => ({ v, t }))
  },
  {
    id: "cursos",
    passo: 2,
    tipo: "multi",
    obrigatoria: false,
    pergunta: "Qual curso você quer fazer?",
    sub: "Podemos marcar mais de um — ajustamos as prioridades dos pesos.",
    opcoes: Object.entries(CURSOS).map(([v, t]) => ({ v, t }))
  },
  {
    id: "prazo",
    passo: 2,
    tipo: "single",
    obrigatoria: true,
    pergunta: "Qual é o seu ano alvo para ser aprovado?",
    sub: "Calculamos o ritmo de matérias até a data da sua prova.",
    opcoes: [
      { v: "2026", t: "Vestibular 2026 (Este ano)" },
      { v: "2027", t: "Vestibular 2027 (Próximo ano)" },
      { v: "2028+", t: "2028 em diante" }
    ]
  },

  // PASSO 3 - Diagnóstico de Matérias
  {
    id: "piores_materias",
    passo: 3,
    tipo: "multi",
    obrigatoria: true,
    pergunta: "Quais matérias você sente mais dificuldade?",
    sub: "Vamos dar prioridade e peso duplo para essas disciplinas no cronograma.",
    opcoes: Object.entries(MATERIAS).map(([v, t]) => ({ v, t }))
  },
  {
    id: "melhores_materias",
    passo: 3,
    tipo: "multi",
    obrigatoria: false,
    pergunta: "Quais matérias você tem mais facilidade?",
    sub: "Focaremos em revisões rápidas para manter seus acertos altos.",
    opcoes: Object.entries(MATERIAS).map(([v, t]) => ({ v, t }))
  },
  {
    id: "autoavaliacao",
    passo: 3,
    tipo: "escala",
    obrigatoria: true,
    pergunta: "Como você avalia sua base geral de conhecimento hoje?",
    sub: "1 = Iniciante com muitas lacunas | 5 = Base sólida e avançada",
    min: 1,
    max: 5
  },
  {
    id: "experiencia",
    passo: 3,
    tipo: "single",
    obrigatoria: false,
    pergunta: "Já fez vestibulares ou ENEM anteriormente?",
    sub: "Ajuda a calibrar o nível de aprofundamento das questões.",
    opcoes: [
      { v: "nunca", t: "Primeira vez prestando vestibular" },
      { v: "treineiro", t: "Já fiz como treineiro para testar" },
      { v: "valendo", t: "Já prestei valendo vaga 1 ou mais vezes" }
    ]
  },

  // PASSO 4 - Rotina e Disponibilidade
  {
    id: "horas_semana",
    passo: 4,
    tipo: "single",
    obrigatoria: true,
    pergunta: "Quantas horas por dia útil você pode dedicar aos estudos?",
    sub: "Seja realista: consistência vale muito mais do que excesso pontual.",
    opcoes: [
      { v: "lt1", t: "Menos de 1h por dia útil" },
      { v: "1a2", t: "1h a 2h por dia" },
      { v: "2a3", t: "2h a 3h por dia" },
      { v: "3a4", t: "3h a 4h por dia" },
      { v: "gt4", t: "Mais de 4h por dia" }
    ]
  },
  {
    id: "horas_fds",
    passo: 4,
    tipo: "single",
    obrigatoria: true,
    pergunta: "E nos finais de semana (sábado e domingo somados)?",
    sub: "Tempo dedicado para realização de simulados e revisões semanais.",
    opcoes: [
      { v: "lt1", t: "Menos de 2h no total" },
      { v: "2a4", t: "2h a 4h no total" },
      { v: "4a6", t: "4h a 6h no total" },
      { v: "gt6", t: "Mais de 6h no total" }
    ]
  },
  {
    id: "horario_pico",
    passo: 4,
    tipo: "single",
    obrigatoria: false,
    pergunta: "Em qual horário do dia você se sente mais produtivo?",
    sub: "Agendaremos os tópicos mais complexos no seu horário de maior foco.",
    opcoes: [
      { v: "manha", t: "Manhã (07h às 12h)" },
      { v: "tarde", t: "Tarde (13h às 18h)" },
      { v: "noite", t: "Noite (19h às 23h)" },
      { v: "madrugada", t: "Madrugada" }
    ]
  },

  // PASSO 5 - Metodologia e Ambiente
  {
    id: "metodo",
    passo: 5,
    tipo: "multi",
    obrigatoria: false,
    pergunta: "Quais métodos de estudo você mais gosta ou utiliza?",
    sub: "Personalizamos os recursos sugeridos de acordo com o seu perfil.",
    opcoes: [
      { v: "questoes", t: "Resolução massiva de questões comentadas" },
      { v: "videoaulas", t: "Videoaulas e explicações didáticas" },
      { v: "resumos", t: "Mapas mentais e esquemas visuais" },
      { v: "flashcards", t: "Flashcards e repetição espaçada" },
      { v: "pomodoro", t: "Técnica Pomodoro (blocos de 25 min com pausas)" },
      { v: "livros", t: "Leitura de livros, apostilas e teoria pura" }
    ]
  },
  {
    id: "musica",
    passo: 5,
    tipo: "single",
    obrigatoria: false,
    pergunta: "Como você prefere o ambiente sonoro ao estudar?",
    sub: "Configuramos seu hub de estudos sonoro e playlists recomendadas.",
    opcoes: [
      { v: "silencio", t: "Silêncio absoluto" },
      { v: "lofi", t: "Lo-Fi Beats e batidas relaxantes" },
      { v: "classica", t: "Música clássica e piano para foco" },
      { v: "qualquer", t: "Minhas músicas favoritas do Spotify" }
    ]
  },

  // PASSO 6 - Desafios e Metas Pessoais
  {
    id: "dificuldades",
    passo: 6,
    tipo: "multi",
    obrigatoria: false,
    pergunta: "Quais são os seus maiores obstáculos nos estudos?",
    sub: "Identificamos os pontos críticos para apoiar sua constância diária.",
    opcoes: [
      { v: "procrastinacao", t: "Procrastinação e distrações com celular/redes" },
      { v: "constancia", t: "Falta de rotina fixa e constância diária" },
      { v: "redacao", t: "Dificuldade na estrutura da redação nota 1000" },
      { v: "exatas", t: "Fórmulas de matemática e física aplicada" },
      { v: "tempo", t: "Pouco tempo para equilibrar escola/trabalho" },
      { v: "ansiedade", t: "Ansiedade e pressão com a aprovação" }
    ]
  },
  {
    id: "motivacao",
    passo: 6,
    tipo: "single",
    obrigatoria: false,
    pergunta: "O que mais te motiva a estudar todos os dias?",
    sub: "Seu lembrete pessoal para os momentos de cansaço.",
    opcoes: [
      { v: "sonho", t: "Realizar o sonho de entrar na faculdade desejada" },
      { v: "familia", t: "Dar orgulho para minha família e mudar de vida" },
      { v: "carreira", t: "Construir uma carreira estável e bem-sucedida" },
      { v: "desafio", t: "Superar meus limites e provar minha capacidade" }
    ]
  },
  {
    id: "ritmo",
    passo: 6,
    tipo: "single",
    obrigatoria: false,
    pergunta: "Qual ritmo de preparação você prefere seguir?",
    sub: "Definimos o volume diário de metas e simulados.",
    opcoes: [
      { v: "intenso", t: "Intenso: alta cadência de exercícios para vagas concorridas" },
      { v: "equilibrado", t: "Equilibrado: evolução constante com pausas saudáveis" },
      { v: "flexivel", t: "Flexível: rotina adaptável para os dias mais corridos" }
    ]
  },

  // PASSO 7 - Calibração com Boletim Escolar (Notas)
  {
    id: "notas",
    passo: 7,
    tipo: "notas",
    obrigatoria: false,
    pergunta: "Quer calibrar o plano com suas notas da escola?",
    sub: "Envie a foto do boletim ou digite as notas — a IA analisa e ajusta suas prioridades reais.",
    opcoes: []
  }
];

export interface UsuarioPerfilData {
  uid: string;
  email: string;
  nome: string;
  onboarding_completo: boolean;
  perfil_json: string | null;
  piores_materias: string[];
  vestibulares_alvo: string[];
  resumo_plano?: any;
  atualizado_em: string;
}

const DATA_DIR = path.resolve(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "usuarios.json");

class OnboardingStore {
  private users: Record<string, UsuarioPerfilData> = {};
  private initialized = false;

  private ensureInitialized() {
    if (this.initialized) return;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(USERS_FILE)) {
        const raw = fs.readFileSync(USERS_FILE, "utf-8");
        this.users = JSON.parse(raw) || {};
      } else {
        this.saveToFile();
      }
    } catch (err) {
      console.error("[OnboardingStore] Erro ao ler usuarios.json:", err);
    }
    this.initialized = true;
  }

  private saveToFile() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(USERS_FILE, JSON.stringify(this.users, null, 2), "utf-8");
    } catch (err) {
      console.error("[OnboardingStore] Erro ao salvar usuarios.json:", err);
    }
  }

  public getOrCreateUser(uid: string, email?: string, nome?: string): UsuarioPerfilData {
    this.ensureInitialized();
    const cleanUid = (uid || "default_user").trim();
    if (!this.users[cleanUid]) {
      const derivedName = nome || (email ? email.split("@")[0] : "Estudante");
      const capitalized = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
      this.users[cleanUid] = {
        uid: cleanUid,
        email: email || `${cleanUid}@gabarita.com`,
        nome: capitalized,
        onboarding_completo: false,
        perfil_json: null,
        piores_materias: [],
        vestibulares_alvo: ["ENEM"],
        atualizado_em: new Date().toISOString()
      };
      this.saveToFile();
    } else {
      if (nome && this.users[cleanUid].nome === "Estudante") {
        this.users[cleanUid].nome = nome;
      }
      if (email && !this.users[cleanUid].email) {
        this.users[cleanUid].email = email;
      }
    }
    return this.users[cleanUid];
  }

  public salvarOnboarding(uid: string, respostas: Record<string, any>, userData?: { email?: string; nome?: string }) {
    this.ensureInitialized();
    const user = this.getOrCreateUser(uid, userData?.email, userData?.nome);

    // Validação e cálculo
    const horasSemanaVal = HORAS_MAP[String(respostas.horas_semana)] ?? 2.5;
    const horasFdsVal = HORAS_MAP[String(respostas.horas_fds)] ?? 3;
    const horasUteisTotal = Number((horasSemanaVal * 5).toFixed(1));
    const horasFdsTotal = Number((horasFdsVal * 2).toFixed(1));
    const totalHorasSemana = Math.round(horasUteisTotal + horasFdsTotal);

    const vestibularesAlvo: string[] = Array.isArray(respostas.vestibulares)
      ? respostas.vestibulares
      : [respostas.vestibulares || "ENEM"];

    const pioresMaterias: string[] = Array.isArray(respostas.piores_materias)
      ? respostas.piores_materias
      : (respostas.piores_materias ? [respostas.piores_materias] : []);

    const melhoresMaterias: string[] = Array.isArray(respostas.melhores_materias)
      ? respostas.melhores_materias
      : [];

    const cursosAlvo: string[] = Array.isArray(respostas.cursos)
      ? respostas.cursos.map((c: string) => CURSOS[c] || c)
      : [];

    const autoavaliacao = Number(respostas.autoavaliacao) || 3;

    // Resumo personalizado
    const resumo = {
      total_horas_semanais: totalHorasSemana,
      horas_uteis_semana: horasUteisTotal,
      horas_fds_semana: horasFdsTotal,
      media_diaria: Number((totalHorasSemana / 7).toFixed(1)),
      vestibulares: vestibularesAlvo.map(v => VESTIBULARES[v] || v),
      cursos: cursosAlvo,
      materias_foco_prioritario: pioresMaterias.map(m => MATERIAS[m] || m),
      materias_revisao_rapida: melhoresMaterias.map(m => MATERIAS[m] || m),
      base_inicial: autoavaliacao <= 2 ? "Iniciante (Foco em Teoria Básica e Exercícios Nível 1)" :
                    autoavaliacao <= 4 ? "Intermediária (Equilíbrio Teoria + Prática de Provas Anteriores)" :
                    "Avançada (Treinamento de Alto Rendimento e Questões Dissertativas)",
      ritmo: respostas.ritmo || "equilibrado",
      prazo: respostas.prazo || "2026",
      mensagem_motivacional: "Seu cronograma adaptativo foi calibrado! Focaremos estrategicamente nas suas maiores dificuldades mantendo o ritmo de alta aprovação."
    };

    user.perfil_json = JSON.stringify(respostas);
    user.onboarding_completo = true;
    user.piores_materias = pioresMaterias;
    user.vestibulares_alvo = vestibularesAlvo;
    user.resumo_plano = resumo;
    user.atualizado_em = new Date().toISOString();

    this.saveToFile();
    return {
      sucesso: true,
      resumo,
      user: {
        uid: user.uid,
        nome: user.nome,
        email: user.email,
        onboarding_completo: true,
        piores_materias: user.piores_materias,
        vestibulares_alvo: user.vestibulares_alvo
      }
    };
  }

  public obterUsuario(uid: string) {
    this.ensureInitialized();
    return this.users[uid] || null;
  }
}

export const onboardingStore = new OnboardingStore();
