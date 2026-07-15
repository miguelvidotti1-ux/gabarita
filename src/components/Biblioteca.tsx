import React, { useState } from 'react';
import { BookOpen, Book, Users, Target, Search, FileText } from 'lucide-react';
import ListaGabaritosExtra from './ListaGabaritosExtra';

const Database = {
  repertorios: [
    { id: '1', tema: "Sociedade", autor: "Zygmunt Bauman", obra: "Modernidade Líquida", conteudo: "As relações escorrem por entre os dedos, nada é feito para durar.", uso: "Consumismo, redes sociais, relações humanas." },
    { id: '2', tema: "Sociedade", autor: "Thomas Hobbes", obra: "O Contrato Social", conteudo: "O Estado deve garantir a segurança para evitar o caos.", uso: "Segurança pública, violência, papel do governo." },
    { id: '3', tema: "Sociedade", autor: "Hannah Arendt", obra: "A Banalidade do Mal", conteudo: "Quando o mal se torna comum e aceito burocraticamente.", uso: "Cyberbullying, preconceito, indiferença social." },
    { id: '4', tema: "Sociedade", autor: "Émile Durkheim", obra: "Fato Social", conteudo: "A sociedade molda o indivíduo através de normas e pressões.", uso: "Padrões de beleza, comportamento coletivo." },
    { id: '5', tema: "Sociedade", autor: "Gilberto Freyre", obra: "Casa-Grande & Senzala", conteudo: "Raízes do patriarcalismo na formação brasileira.", uso: "Racismo, desigualdade social." },
    { id: '6', tema: "Sociedade", autor: "Sérgio Buarque", obra: "O Homem Cordial", conteudo: "A tendência de agir pela emoção e laços pessoais em vez de leis.", uso: "Corrupção, jeitinho brasileiro, nepotismo." },
    { id: '7', tema: "Sociedade", autor: "José Saramago", obra: "Ensaio sobre a Cegueira", conteudo: "A cegueira moral diante do sofrimento alheio.", uso: "Indiferença social, crises humanitárias." },
    { id: '8', tema: "Sociedade", autor: "Bong Joon-ho", obra: "Filme: Parasita", conteudo: "A barreira invisível e intransponível entre as classes sociais.", uso: "Desigualdade habitacional, segregação urbana." },
    { id: '9', tema: "Sociedade", autor: "Pierre Bourdieu", obra: "Violência Simbólica", conteudo: "Formas de imposição cultural que naturalizam a exclusão.", uso: "Preconceito linguístico, exclusão escolar." },
    { id: '10', tema: "Sociedade", autor: "Aristóteles", obra: "Zoon Politikon", conteudo: "O homem é um animal destinado a viver em pólis.", uso: "Participação democrática, apatia política." },
    { id: '11', tema: "Meio Ambiente", autor: "Ailton Krenak", obra: "Ideias para adiar o fim do mundo", conteudo: "A natureza não é um recurso, é nossa extensão.", uso: "Desmatamento, crise climática, causa indígena." },
    { id: '12', tema: "Meio Ambiente", autor: "Hans Jonas", obra: "Princípio Responsabilidade", conteudo: "Agir para que as gerações futuras tenham direito à vida.", uso: "Sustentabilidade, ética ambiental." },
    { id: '13', tema: "Meio Ambiente", autor: "Disney/Pixar", obra: "Filme: Wall-E", conteudo: "O rastro de lixo deixado pelo consumo desenfreado.", uso: "Gestão de resíduos, poluição terrestre." },
    { id: '14', tema: "Meio Ambiente", autor: "Wim Wenders", obra: "Doc: O Sal da Terra", conteudo: "A jornada de destruição e recuperação da biodiversidade.", uso: "Reflorestamento, impacto humano no solo." },
    { id: '15', tema: "Meio Ambiente", autor: "Rees e Wackernagel", obra: "Pegada Ecológica", conteudo: "A medida do impacto do consumo humano na Terra.", uso: "Consumo consciente." },
    { id: '16', tema: "Tecnologia", autor: "George Orwell", obra: "Livro: 1984", conteudo: "Vigilância constante e manipulação da verdade pelo Estado.", uso: "Privacidade de dados, Fake News, Autoritarismo." },
    { id: '17', tema: "Tecnologia", autor: "Pierre Lévy", obra: "Cibercultura", conteudo: "A tecnologia como motor da inteligência coletiva.", uso: "Inclusão digital, educação a distância." },
    { id: '18', tema: "Tecnologia", autor: "Charlie Brooker", obra: "Série: Black Mirror", conteudo: "O lado obscuro e antiético da dependência tecnológica.", uso: "IA, algoritmos, desumanização digital." },
    { id: '19', tema: "Tecnologia", autor: "Byung-Chul Han", obra: "Sociedade do Cansaço", conteudo: "A autoexigência e o excesso de informação digital.", uso: "Burnout, saúde mental, cansaço digital." },
    { id: '20', tema: "Tecnologia", autor: "Manuel Castells", obra: "A Sociedade em Rede", conteudo: "Como a internet mudou a estrutura da comunicação global.", uso: "Ativismo digital, globalização." },
    { id: '21', tema: "Educação", autor: "Paulo Freire", obra: "Pedagogia do Oprimido", conteudo: "Educação como ferramenta de libertação política e social.", uso: "Evasão escolar, alfabetização, consciência crítica." },
    { id: '22', tema: "Educação", autor: "Immanuel Kant", obra: "Crítica da Razão", conteudo: "O homem é o que a educação faz dele.", uso: "Investimento escolar, formação de caráter." },
    { id: '23', tema: "Educação", autor: "Malala Yousafzai", obra: "Eu sou Malala", conteudo: "A educação é o maior medo dos opressores.", uso: "Desigualdade de gênero, direito ao ensino." },
    { id: '24', tema: "Educação", autor: "Nelson Mandela", obra: "Discurso", conteudo: "A educação é a arma mais poderosa para mudar o mundo.", uso: "Transformação social através do ensino." },
    { id: '25', tema: "Educação", autor: "Jean Piaget", obra: "Psicologia", conteudo: "Educar é criar pessoas capazes de inovar, não repetir.", uso: "Metodologias ativas, criatividade escolar." },
    { id: '26', tema: "Saúde", autor: "Drauzio Varella", obra: "Estação Carandiru", conteudo: "A negligência estatal em ambientes de confinamento.", uso: "Saúde pública, sistema prisional." },
    { id: '27', tema: "Saúde", autor: "Michel Foucault", obra: "Biopolítica", conteudo: "O controle estatal sobre a vida e a saúde dos corpos.", uso: "Vacinação, epidemias, controle social." },
    { id: '28', tema: "Saúde", autor: "Todd Phillips", obra: "Filme: Coringa", conteudo: "A falta de apoio para transtornos mentais gera caos.", uso: "Estigma de doenças mentais, descaso na saúde." },
    { id: '29', tema: "Saúde", autor: "Epicuro", obra: "Carta a Meneceu", conteudo: "A busca pela ausência de dor física e mental.", uso: "Estresse moderno, bem-estar." },
    { id: '30', tema: "Saúde", autor: "Nise da Silveira", obra: "Humanização", conteudo: "O tratamento psiquiátrico deve ser feito com afeto e arte.", uso: "Humanização da medicina, terapias alternativas." },
    { id: '31', tema: "Cultura", autor: "Adorno/Horkheimer", obra: "Indústria Cultural", conteudo: "A arte vira mercadoria para alienar a população.", uso: "Consumo cultural, democratização da arte." },
    { id: '32', tema: "Cultura", autor: "Chimamanda Adichie", obra: "História Única", conteudo: "O perigo de conhecer apenas um lado de um povo.", uso: "Estereótipos, xenofobia, racismo." },
    { id: '33', tema: "Cultura", autor: "UNESCO", obra: "Patrimônio", conteudo: "A preservação de saberes imateriais define um povo.", uso: "Cultura indígena, tradições populares." },
    { id: '34', tema: "Cultura", autor: "Euclides da Cunha", obra: "Os Sertões", conteudo: "O sertanejo é, antes de tudo, um forte.", uso: "Resistência regional, identidade brasileira." },
    { id: '35', tema: "Cultura", autor: "Tarsila do Amaral", obra: "Antropofagia", conteudo: "Transformar o estrangeiro em algo genuinamente brasileiro.", uso: "Valorização nacional, arte brasileira." },
    { id: '36', tema: "Ética", autor: "John Rawls", obra: "Justiça como Equidade", conteudo: "O véu da ignorância como base para leis justas.", uso: "Políticas de cotas, equidade social." },
    { id: '37', tema: "Ética", autor: "Maquiavel", obra: "O Príncipe", conteudo: "A manutenção do poder exige pragmatismo ético.", uso: "Ética política, governabilidade." },
    { id: '38', tema: "Ética", autor: "Constituição 1988", obra: "Artigo 3º", conteudo: "Constituir uma sociedade livre, justa e solidária.", uso: "Direitos humanos, cidadania." },
    { id: '39', tema: "Ética", autor: "Sófocles", obra: "Peça: Antígona", conteudo: "O dever moral superior às leis injustas dos homens.", uso: "Desobediência civil, justiça moral." },
    { id: '40', tema: "Ética", autor: "Mendeleiev", obra: "Metáfora", conteudo: "Cada elemento tem seu lugar único no sistema.", uso: "Inclusão de minorias, diversidade." },
    { id: '41', tema: "Economia", autor: "Karl Marx", obra: "O Capital", conteudo: "A alienação do trabalhador em relação ao seu produto.", uso: "Trabalho escravo, uberização, exploração." },
    { id: '42', tema: "Economia", autor: "Adam Smith", obra: "A Riqueza das Nações", conteudo: "A mão invisível que regula o interesse coletivo.", uso: "Capitalismo, livre mercado." },
    { id: '43', tema: "Economia", autor: "Max Weber", obra: "Ética Protestante", conteudo: "O trabalho como forma de glorificação e progresso.", uso: "Valorização profissional, cultura do esforço." },
    { id: '44', tema: "Economia", autor: "Charlie Chaplin", obra: "Filme: Tempos Modernos", conteudo: "O homem virando peça da engrenagem industrial.", uso: "Automação, precarização do trabalho." },
    { id: '45', tema: "Economia", autor: "App Economy", obra: "Gig Economy", conteudo: "A flexibilização extrema que gera insegurança jurídica.", uso: "Trabalho via apps, informalidade." },
    { id: '46', tema: "Cultura", autor: "Machado de Assis", obra: "Brás Cubas", conteudo: "A elite que evita o trabalho e vive de aparências.", uso: "Egoísmo, crítica social brasileira." },
    { id: '47', tema: "Literatura", autor: "Carolina de Jesus", obra: "Quarto de Despejo", conteudo: "A fome é a pior forma de exclusão humana.", uso: "Pobreza, segurança alimentar, favelas." },
    { id: '48', tema: "Cultura", autor: "Moira Walley-Beckett", obra: "Série: Anne with an E", conteudo: "O acolhimento vence o preconceito e o bullying.", uso: "Adoção, feminismo, bullying." },
    { id: '49', tema: "Cultura", autor: "Peter Weir", obra: "O Show de Truman", conteudo: "A vida privada transformada em entretenimento público.", uso: "Espetacularização da vida, redes sociais." },
    { id: '50', tema: "Literatura", autor: "Clarice Lispector", obra: "A Hora da Estrela", conteudo: "A existência invisível de quem ninguém nota.", uso: "Marginalização, invisibilidade social." }
  ],
  leituras: [
    // --- FUVEST ---
    { id: 'fuv26_1', obra: "Alguma Poesia", autor: "Carlos Drummond de Andrade", vestibular: "Fuvest", ano: 2026 },
    { id: 'fuv26_2', obra: "Mensagem", autor: "Fernando Pessoa", vestibular: "Fuvest", ano: 2026 },
    { id: 'fuv26_3', obra: "Marília de Dirceu", autor: "Tomás Antônio Gonzaga", vestibular: "Fuvest", ano: 2026 },
    { id: 'fuv26_4', obra: "Quincas Borba", autor: "Machado de Assis", vestibular: "Fuvest", ano: 2026 },
    { id: 'fuv26_5', obra: "Angústia", autor: "Graciliano Ramos", vestibular: "Fuvest", ano: 2026 },
    { id: 'fuv26_6', obra: "Campo Geral", autor: "João Guimarães Rosa", vestibular: "Fuvest", ano: 2026 },
    { id: 'fuv26_7', obra: "Romanceiro da Inconfidência", autor: "Cecília Meireles", vestibular: "Fuvest", ano: 2026 },
    { id: 'fuv26_8', obra: "Nós Matamos o Cão Tinhoso!", autor: "Luís Bernardo Honwana", vestibular: "Fuvest", ano: 2026 },
    { id: 'fuv26_9', obra: "Dois Irmãos", autor: "Milton Hatoum", vestibular: "Fuvest", ano: 2026 },
    { id: 'fuv27_1', obra: "A Paixão Segundo G.H.", autor: "Clarice Lispector", vestibular: "Fuvest", ano: 2027 },
    { id: 'fuv27_2', obra: "Canções Escolhidas", autor: "Cartola", vestibular: "Fuvest", ano: 2027 },
    { id: 'fuv27_3', obra: "Marília de Dirceu", autor: "Tomás Antônio Gonzaga", vestibular: "Fuvest", ano: 2027 },
    { id: 'fuv27_4', obra: "Quincas Borba", autor: "Machado de Assis", vestibular: "Fuvest", ano: 2027 },
    { id: 'fuv27_5', obra: "Angústia", autor: "Graciliano Ramos", vestibular: "Fuvest", ano: 2027 },
    { id: 'fuv27_6', obra: "Primeiras Estórias", autor: "João Guimarães Rosa", vestibular: "Fuvest", ano: 2027 },
    { id: 'fuv27_7', obra: "Romanceiro da Inconfidência", autor: "Cecília Meireles", vestibular: "Fuvest", ano: 2027 },
    { id: 'fuv27_8', obra: "Nós Matamos o Cão Tinhoso!", autor: "Luís Bernardo Honwana", vestibular: "Fuvest", ano: 2027 },
    { id: 'fuv27_9', obra: "Opúsculo Humanitário", autor: "Nísia Floresta", vestibular: "Fuvest", ano: 2027 },
    { id: 'fuv28_1', obra: "João Miguel", autor: "Rachel de Queiroz", vestibular: "Fuvest", ano: 2028 },
    { id: 'fuv28_2', obra: "Minha Vida de Menina", autor: "Helena Morley", vestibular: "Fuvest", ano: 2028 },
    { id: 'fuv28_3', obra: "Quincas Borba", autor: "Machado de Assis", vestibular: "Fuvest", ano: 2028 },
    { id: 'fuv28_4', obra: "Vidas Secas", autor: "Graciliano Ramos", vestibular: "Fuvest", ano: 2028 },
    { id: 'fuv28_5', obra: "O Cortiço", autor: "Aluísio Azevedo", vestibular: "Fuvest", ano: 2028 },
    { id: 'fuv28_6', obra: "A Relíquia", autor: "Eça de Queirós", vestibular: "Fuvest", ano: 2028 },
    { id: 'fuv28_7', obra: "Sagarana", autor: "João Guimarães Rosa", vestibular: "Fuvest", ano: 2028 },
    { id: 'fuv28_8', obra: "Opúsculo Humanitário", autor: "Nísia Floresta", vestibular: "Fuvest", ano: 2028 },
    { id: 'fuv29_1', obra: "Memórias Póstumas de Brás Cubas", autor: "Machado de Assis", vestibular: "Fuvest", ano: 2029 },
    { id: 'fuv29_2', obra: "Iracema", autor: "José de Alencar", vestibular: "Fuvest", ano: 2029 },
    { id: 'fuv29_3', obra: "Macunaíma", autor: "Mário de Andrade", vestibular: "Fuvest", ano: 2029 },
    { id: 'fuv29_4', obra: "Sentimento do Mundo", autor: "Carlos Drummond de Andrade", vestibular: "Fuvest", ano: 2029 },
    { id: 'fuv29_5', obra: "Claro Enigma", autor: "Carlos Drummond de Andrade", vestibular: "Fuvest", ano: 2029 },

    // --- UNICAMP ---
    { id: 'uni26_1', obra: "Olhos d'Água", autor: "Conceição Evaristo", vestibular: "Unicamp", ano: 2026 },
    { id: 'uni26_2', obra: "Casa de Pensão", autor: "Aluísio Azevedo", vestibular: "Unicamp", ano: 2026 },
    { id: 'uni26_3', obra: "Carta de Achamento do Brasil", autor: "Pero Vaz de Caminha", vestibular: "Unicamp", ano: 2026 },
    { id: 'uni26_4', obra: "As Três Marias", autor: "Rachel de Queiroz", vestibular: "Unicamp", ano: 2026 },
    { id: 'uni26_5', obra: "Niketche: Uma História de Poligamia", autor: "Paulina Chiziane", vestibular: "Unicamp", ano: 2026 },
    { id: 'uni26_6', obra: "Morangos Mofados", autor: "Caio Fernando Abreu", vestibular: "Unicamp", ano: 2026 },
    { id: 'uni26_7', obra: "A Vida Não é Útil", autor: "Ailton Krenak", vestibular: "Unicamp", ano: 2026 },
    { id: 'uni26_8', obra: "Alice no País das Maravilhas", autor: "Lewis Carroll", vestibular: "Unicamp", ano: 2026 },
    { id: 'uni27_1', obra: "A Vida Não é Útil", autor: "Ailton Krenak", vestibular: "Unicamp", ano: 2027 },
    { id: 'uni27_2', obra: "Olhos d'Água", autor: "Conceição Evaristo", vestibular: "Unicamp", ano: 2027 },
    { id: 'uni27_3', obra: "Inocência", autor: "Visconde de Taunay", vestibular: "Unicamp", ano: 2027 },
    { id: 'uni27_4', obra: "Seminário dos Ratos", autor: "Lygia Fagundes Telles", vestibular: "Unicamp", ano: 2027 },
    { id: 'uni27_5', obra: "Canções Escolhidas", autor: "Cartola", vestibular: "Unicamp", ano: 2027 },
    { id: 'uni27_6', obra: "Niketche: Uma História de Poligamia", autor: "Paulina Chiziane", vestibular: "Unicamp", ano: 2027 },
    { id: 'uni27_7', obra: "Vida e Morte de M. J. Gonzaga de Sá", autor: "Lima Barreto", vestibular: "Unicamp", ano: 2027 },
    { id: 'uni28_1', obra: "O Ateneu", autor: "Raul Pompeia", vestibular: "Unicamp", ano: 2028 },
    { id: 'uni28_2', obra: "Cartas Chilenas", autor: "Tomás Antônio Gonzaga", vestibular: "Unicamp", ano: 2028 },
    { id: 'uni28_3', obra: "Úrsula", autor: "Maria Firmina dos Reis", vestibular: "Unicamp", ano: 2028 },
    { id: 'uni28_4', obra: "Negrinha", autor: "Monteiro Lobato", vestibular: "Unicamp", ano: 2028 },
    { id: 'uni28_5', obra: "Sobrevivendo no Inferno", autor: "Racionais MC's", vestibular: "Unicamp", ano: 2028 },
    { id: 'uni29_1', obra: "Quarto de Despejo", autor: "Carolina Maria de Jesus", vestibular: "Unicamp", ano: 2029 },
    { id: 'uni29_2', obra: "Laços de Família", autor: "Clarice Lispector", vestibular: "Unicamp", ano: 2029 },
    { id: 'uni29_3', obra: "Vidas Secas", autor: "Graciliano Ramos", vestibular: "Unicamp", ano: 2029 },

    // --- UERJ ---
    { id: 'uerj26_1', obra: "O Casamento", autor: "Nelson Rodrigues", vestibular: "UERJ", ano: 2026 },
    { id: 'uerj26_2', obra: "As Mentiras que os Homens Contam", autor: "Luis Fernando Verissimo", vestibular: "UERJ", ano: 2026 },
    { id: 'uerj26_3', obra: "O Seminarista", autor: "Bernardo Guimarães", vestibular: "UERJ", ano: 2026 },
    { id: 'uerj27_1', obra: "Ainda Estou Aqui", autor: "Marcelo Rubens Paiva", vestibular: "UERJ", ano: 2027 },
    { id: 'uerj27_2', obra: "O Alienista", autor: "Machado de Assis", vestibular: "UERJ", ano: 2027 },
    { id: 'uerj27_3', obra: "Lucíola", autor: "José de Alencar", vestibular: "UERJ", ano: 2027 },
    { id: 'uerj28_1', obra: "Baú de Ossos", autor: "Pedro Nava", vestibular: "UERJ", ano: 2028 },
    { id: 'uerj28_2', obra: "O Bem-Amado", autor: "Dias Gomes", vestibular: "UERJ", ano: 2028 },
    { id: 'uerj29_1', obra: "Morte e Vida Severina", autor: "João Cabral de Melo Neto", vestibular: "UERJ", ano: 2029 },
    { id: 'uerj29_2', obra: "Bagagem", autor: "Adélia Prado", vestibular: "UERJ", ano: 2029 },

    // --- ITA ---
    { id: 'ita26_1', obra: "A Falência", autor: "Júlia Lopes de Almeida", vestibular: "ITA", ano: 2026 },
    { id: 'ita26_2', obra: "A Relíquia", autor: "Eça de Queirós", vestibular: "ITA", ano: 2026 },
    { id: 'ita26_3', obra: "Melhores Poemas", autor: "Cláudio Manuel da Costa", vestibular: "ITA", ano: 2026 },
    { id: 'ita27_1', obra: "Os Ratos", autor: "Dyonélio Machado", vestibular: "ITA", ano: 2027 },
    { id: 'ita27_2', obra: "O Seminarista", autor: "Bernardo Guimarães", vestibular: "ITA", ano: 2027 },
    { id: 'ita27_3', obra: "Antologia Poética", autor: "Vinicius de Moraes", vestibular: "ITA", ano: 2027 },
    { id: 'ita28_1', obra: "O Cortiço", autor: "Aluísio Azevedo", vestibular: "ITA", ano: 2028 },
    { id: 'ita28_2', obra: "Poemas Escolhidos", autor: "Gregório de Matos", vestibular: "ITA", ano: 2028 },
    { id: 'ita29_1', obra: "Dom Casmurro", autor: "Machado de Assis", vestibular: "ITA", ano: 2029 },
    { id: 'ita29_2', obra: "O Triste Fim de Policarpo Quaresma", autor: "Lima Barreto", vestibular: "ITA", ano: 2029 },

    // --- UNESP ---
    { id: 'unesp26_1', obra: "O Ateneu", autor: "Raul Pompeia", vestibular: "Unesp", ano: 2026 },
    { id: 'unesp27_1', obra: "Dom Casmurro", autor: "Machado de Assis", vestibular: "Unesp", ano: 2027 },
    { id: 'unesp28_1', obra: "Mayombe", autor: "Pepetela", vestibular: "Unesp", ano: 2028 },
    { id: 'unesp29_1', obra: "Capitães da Areia", autor: "Jorge Amado", vestibular: "Unesp", ano: 2029 },

    // --- FGV ---
    { id: 'fgv26_1', obra: "A Teus Pés", autor: "Ana Cristina Cesar", vestibular: "FGV", ano: 2026 },
    { id: 'fgv27_1', obra: "Seminário dos Ratos", autor: "Lygia Fagundes Telles", vestibular: "FGV", ano: 2027 },

    // --- MACKENZIE ---
    { id: 'mack26_1', obra: "Memórias de um Sargento de Milícias", autor: "Manuel Antônio de Almeida", vestibular: "Mackenzie", ano: 2026 },
    { id: 'mack27_1', obra: "A Hora da Estrela", autor: "Clarice Lispector", vestibular: "Mackenzie", ano: 2027 },
    { id: 'mack28_1', obra: "Sagarana", autor: "João Guimarães Rosa", vestibular: "Mackenzie", ano: 2028 },
    { id: 'mack29_1', obra: "Iracema", autor: "José de Alencar", vestibular: "Mackenzie", ano: 2029 }
  ]
};

export default function Biblioteca() {
  const [activeTab, setActiveTab] = useState<'repertorio' | 'leituras' | 'gabaritos'>('repertorio');
  const [anoFiltro, setAnoFiltro] = useState<string>('Todos');
  const [vestibularFiltro, setVestibularFiltro] = useState<string>('Todos');
  const [busca, setBusca] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState('Todos');

  const anos = ['Todos', '2026', '2027', '2028', '2029'];
  const eixos = ['Todos', 'Sociedade', 'Tecnologia', 'Educação', 'Saúde', 'Economia', 'Ética', 'Cultura'];
  const vestibulares = ['Todos', 'Fuvest', 'Unicamp', 'UERJ', 'ITA', 'Unesp', 'FGV', 'Mackenzie'];

  const repertoriosFiltrados = Database.repertorios.filter(item => {
    const combinaFiltro = filtroAtivo === 'Todos' || item.tema === filtroAtivo;
    const combinaBusca = item.uso.toLowerCase().includes(busca.toLowerCase()) || 
                         item.autor.toLowerCase().includes(busca.toLowerCase()) ||
                         item.obra.toLowerCase().includes(busca.toLowerCase());
    return combinaFiltro && combinaBusca;
  });

  const leiturasFiltradas = Database.leituras.filter(item => {
    const combinaVestibular = vestibularFiltro === 'Todos' || item.vestibular.toLowerCase() === vestibularFiltro.toLowerCase();
    const combinaAno = anoFiltro === 'Todos' || item.ano.toString() === anoFiltro;
    const combinaBusca = item.obra.toLowerCase().includes(busca.toLowerCase()) || 
                         item.autor.toLowerCase().includes(busca.toLowerCase());
    return combinaVestibular && combinaAno && combinaBusca;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-[var(--text-primary)]">Biblioteca de Apoio</h1>
        <p className="text-[var(--text-secondary)]">Materiais essenciais para turbinar suas redações.</p>
      </div>
      
      {/* Navegação entre Abas */}
      <div className="flex bg-[var(--bg-secondary)] p-1.5 rounded-2xl border border-[var(--card-border)] max-w-lg mx-auto">
        <button 
          onClick={() => setActiveTab('repertorio')} 
          className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${activeTab === 'repertorio' ? 'bg-[var(--button-bg)] text-white shadow-lg' : 'text-[var(--text-primary)] hover:bg-[var(--card-border)]'}`}
        >
          Repertórios
        </button>
        <button 
          onClick={() => setActiveTab('leituras')} 
          className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${activeTab === 'leituras' ? 'bg-[var(--button-bg)] text-white shadow-lg' : 'text-[var(--text-primary)] hover:bg-[var(--card-border)]'}`}
        >
          Leituras
        </button>
        <button 
          onClick={() => setActiveTab('gabaritos')} 
          className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${activeTab === 'gabaritos' ? 'bg-[var(--button-bg)] text-white shadow-lg' : 'text-[var(--text-primary)] hover:bg-[var(--card-border)]'}`}
        >
          Gabaritos
        </button>
      </div>

      {/* Conteúdo */}
      <div className="max-w-2xl mx-auto space-y-6">
        {activeTab === 'repertorio' ? (
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={20} />
              <input 
                type="text" 
                placeholder="Busque por autor, obra ou assunto..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] p-4 pl-12 rounded-2xl shadow-sm focus:ring-2 focus:ring-[var(--text-accent)] outline-none text-[var(--text-primary)]"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2">
              {eixos.map(eixo => (
                <button 
                  key={eixo}
                  onClick={() => setFiltroAtivo(eixo)}
                  className={`py-2 px-4 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                    filtroAtivo === eixo ? 'bg-[var(--text-accent)] text-white' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
                  }`}
                >
                  {eixo}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {repertoriosFiltrados.map(item => (
                <div key={item.id} className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-[var(--text-accent)] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{item.tema}</span>
                    <span className="text-[10px] font-bold text-[var(--text-secondary)] italic">{item.obra}</span>
                  </div>
                  <p className="text-lg italic text-[var(--text-primary)] mb-4">"{item.conteudo}"</p>
                  <p className="text-sm font-black text-[var(--text-primary)]">{item.autor}</p>
                  <div className="mt-4 pt-4 border-t border-[var(--card-border)] flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <Target size={14} className="text-[var(--text-accent)]" /> 
                    {item.uso}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'leituras' ? (
          <div className="space-y-6">
            {/* Campo de Busca de Leituras */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={20} />
              <input 
                type="text" 
                placeholder="Busque por livro ou autor obligatorio..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] p-4 pl-12 rounded-2xl shadow-sm focus:ring-2 focus:ring-[var(--text-accent)] outline-none text-[var(--text-primary)]"
              />
            </div>

            {/* Filtros de Vestibular */}
            <div className="space-y-2">
              <p className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-wider">Filtrar por Vestibular</p>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {vestibulares.map(v => (
                  <button 
                    key={v}
                    onClick={() => setVestibularFiltro(v)}
                    className={`py-2 px-4 rounded-full font-black text-sm whitespace-nowrap transition-all ${
                      vestibularFiltro === v ? 'bg-[var(--text-accent)] text-white shadow-sm' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)] hover:bg-[var(--bg-secondary)]'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtros de Ano */}
            <div className="space-y-2">
              <p className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-wider">Filtrar por Ano da Prova</p>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {anos.map(ano => (
                  <button 
                    key={ano}
                    onClick={() => setAnoFiltro(ano)}
                    className={`py-2 px-4 rounded-full font-black text-sm whitespace-nowrap transition-all ${
                      anoFiltro === ano ? 'bg-[var(--text-accent)] text-white shadow-sm' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)] hover:bg-[var(--bg-secondary)]'
                    }`}
                  >
                    {ano}
                  </button>
                ))}
              </div>
            </div>

            {/* Listagem de Obras Filtradas */}
            <div className="space-y-4 pt-2">
              {leiturasFiltradas.length > 0 ? (
                leiturasFiltradas.map(item => (
                  <div key={item.id} className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-start gap-4">
                    <div className="bg-emerald-100 dark:bg-emerald-950/50 p-3 rounded-xl text-emerald-600 dark:text-emerald-400 shrink-0">
                      <BookOpen size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1.5">
                        <h3 className="font-black text-lg text-[var(--text-primary)] leading-tight">{item.obra}</h3>
                        <div className="flex gap-1.5 shrink-0">
                          <span className="text-[9px] font-black uppercase text-[var(--text-secondary)] bg-[var(--bg-secondary)] border border-[var(--card-border)] px-2 py-0.5 rounded">
                            {item.vestibular}
                          </span>
                          <span className="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 px-2 py-0.5 rounded">
                            {item.ano}
                          </span>
                        </div>
                      </div>
                      <p className="text-[var(--text-secondary)] text-sm font-semibold">{item.autor}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl space-y-2">
                  <p className="font-bold text-[var(--text-primary)]">Nenhuma leitura encontrada</p>
                  <p className="text-xs text-[var(--text-secondary)]">Tente ajustar seus termos de busca ou filtros.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <ListaGabaritosExtra />
        )}
      </div>
    </div>
  );
}
