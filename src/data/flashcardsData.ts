export interface Flashcard {
  id: string;
  front_content: string;
  back_content: string;
  topic: string;
}

export interface StudyTrail {
  id: string;
  title: string;
  description: string;
  category: string;
  color_theme: string;
  cards: Flashcard[];
}

export const FLASHCARDS_TRAILS: StudyTrail[] = [
  {
    id: 'historia_brasil',
    title: 'História do Brasil',
    description: 'Da colonização à república',
    category: 'História',
    color_theme: '#FF6B6B',
    cards: [
      {
        id: 'h_1',
        topic: 'História',
        front_content: 'Em que ano o Brasil foi descoberto?',
        back_content: '1500, por Pedro Álvares Cabral.'
      },
      {
        id: 'h_2',
        topic: 'História',
        front_content: 'Quem foi o primeiro governador-geral do Brasil?',
        back_content: 'Tomé de Sousa, em 1549.'
      },
      {
        id: 'h_3',
        topic: 'História',
        front_content: 'O que foi o Ciclo do Pau-Brasil?',
        back_content: 'Extração intensiva de pau-brasil no litoral, primeiro produto de exportação.'
      },
      {
        id: 'h_4',
        topic: 'História',
        front_content: 'Em que ano ocorreu a chegada da família real ao Brasil?',
        back_content: '1808, com D. João VI.'
      },
      {
        id: 'h_5',
        topic: 'História',
        front_content: 'O que foi a Lei Áurea?',
        back_content: 'Lei que aboliu a escravidão no Brasil, assinada em 1888 pela Princesa Isabel.'
      },
      {
        id: 'h_6',
        topic: 'História',
        front_content: 'Em que ano o Brasil se tornou independente?',
        back_content: '1822, com o grito do Ipiranga de D. Pedro I.'
      },
      {
        id: 'h_7',
        topic: 'História',
        front_content: 'O que foi a Guerra do Paraguai?',
        back_content: 'Conflito (1864-1870) entre Brasil, Argentina e Uruguai contra o Paraguai.'
      },
      {
        id: 'h_8',
        topic: 'História',
        front_content: 'Quem foi Tiradentes?',
        back_content: 'Joaquim José da Silva Xavier, mártir da Inconfidência Mineira (1789).'
      },
      {
        id: 'h_9',
        topic: 'História',
        front_content: 'O que foi a Proclamação da República?',
        back_content: 'Golpe militar em 15/11/1889 que depôs o império e instaurou a república.'
      },
      {
        id: 'h_10',
        topic: 'História',
        front_content: 'O que foi o período colonial?',
        back_content: 'Fase entre 1500 e 1815 com domínio português e economia baseada em monocultura.'
      },
      {
        id: 'h_11',
        topic: 'História',
        front_content: 'Em que ano ocorreu a Abolição da Escravatura?',
        back_content: '1888, com a Lei Áurea.'
      },
      {
        id: 'h_12',
        topic: 'História',
        front_content: 'Quem foi D. Pedro II?',
        back_content: 'Último imperador do Brasil, reinou de 1831 a 1889.'
      },
      {
        id: 'h_13',
        topic: 'História',
        front_content: 'O que foi a Revolta de Canudos?',
        back_content: 'Conflito (1896-1897) no sertão baiano liderado por Antônio Conselheiro.'
      },
      {
        id: 'h_14',
        topic: 'História',
        front_content: 'O que foi a Era Vargas?',
        back_content: 'Período (1930-1945) de governo de Getúlio Vargas com forte centralização.'
      },
      {
        id: 'h_15',
        topic: 'História',
        front_content: 'Em que ano ocorreu o Golpe Militar no Brasil?',
        back_content: '1964, deposição de João Goulart.'
      },
      {
        id: 'h_16',
        topic: 'História',
        front_content: 'O que foi a Constituição de 1988?',
        back_content: 'Constituição Cidadã que restabeleceu a democracia após a ditadura.'
      },
      {
        id: 'h_17',
        topic: 'História',
        front_content: 'Quem foi Zumbi dos Palmares?',
        back_content: 'Líder do Quilombo dos Palmares, símbolo da resistência negra (1655-1695).'
      },
      {
        id: 'h_18',
        topic: 'História',
        front_content: 'O que foi o Tratado de Tordesilhas?',
        back_content: 'Acordo de 1494 entre Portugal e Espanha dividindo o Novo Mundo.'
      },
      {
        id: 'h_19',
        topic: 'História',
        front_content: 'Quem foi Marechal Deodoro da Fonseca?',
        back_content: 'Proclamador da República e primeiro presidente do Brasil (1889-1891).'
      },
      {
        id: 'h_20',
        topic: 'História',
        front_content: 'O que foi a Inconfidência Mineira?',
        back_content: 'Movimento de 1789 em Minas Gerais que buscou independência de Portugal.'
      }
    ]
  },
  {
    id: 'geografia_mundial',
    title: 'Geografia Mundial',
    description: 'Continentes, países e capitais',
    category: 'Geografia',
    color_theme: '#4ECDC4',
    cards: [
      {
        id: 'g_1',
        topic: 'Geografia',
        front_content: 'Qual é a capital da Austrália?',
        back_content: 'Camberra.'
      },
      {
        id: 'g_2',
        topic: 'Geografia',
        front_content: 'Qual é o maior continente em área?',
        back_content: 'A Ásia.'
      },
      {
        id: 'g_3',
        topic: 'Geografia',
        front_content: 'Qual é o rio mais extenso do mundo?',
        back_content: 'O Rio Nilo, com aproximadamente 6.650 km.'
      },
      {
        id: 'g_4',
        topic: 'Geografia',
        front_content: 'Qual é o menor país do mundo?',
        back_content: 'Vaticano, com apenas 0,44 km².'
      },
      {
        id: 'g_5',
        topic: 'Geografia',
        front_content: 'Em qual continente fica o deserto do Saara?',
        back_content: 'África.'
      },
      {
        id: 'g_6',
        topic: 'Geografia',
        front_content: 'Qual é a capital do Japão?',
        back_content: 'Tóquio.'
      },
      {
        id: 'g_7',
        topic: 'Geografia',
        front_content: 'Qual é a montanha mais alta do mundo?',
        back_content: 'Monte Everest, com 8.848 metros.'
      },
      {
        id: 'g_8',
        topic: 'Geografia',
        front_content: 'Qual país tem a maior population do mundo?',
        back_content: 'Índia (desde 2023, ultrapassou a China).'
      },
      {
        id: 'g_9',
        topic: 'Geografia',
        front_content: 'O que é a Linha do Equador?',
        back_content: 'Paralelo 0° que divide a Terra em hemisférios Norte e Sul.'
      },
      {
        id: 'g_10',
        topic: 'Geografia',
        front_content: 'Qual é o maior oceano da Terra?',
        back_content: 'Oceano Pacífico.'
      },
      {
        id: 'g_11',
        topic: 'Geografia',
        front_content: 'Qual é a capital da Rússia?',
        back_content: 'Moscou.'
      },
      {
        id: 'g_12',
        topic: 'Geografia',
        front_content: 'Em qual país fica o Taj Mahal?',
        back_content: 'Índia, na cidade de Agra.'
      },
      {
        id: 'g_13',
        topic: 'Geografia',
        front_content: 'Qual é o canal que liga o Atlântico ao Pacífico?',
        back_content: 'Canal do Panamá.'
      },
      {
        id: 'g_14',
        topic: 'Geografia',
        front_content: 'Qual é a capital do Egito?',
        back_content: 'Cairo.'
      },
      {
        id: 'g_15',
        topic: 'Geografia',
        front_content: 'Qual é o maior país em área territorial?',
        back_content: 'Rússia.'
      },
      {
        id: 'g_16',
        topic: 'Geografia',
        front_content: 'Em qual continente fica Madagascar?',
        back_content: 'África.'
      },
      {
        id: 'g_17',
        topic: 'Geografia',
        front_content: 'Qual é a capital do Canadá?',
        back_content: 'Ottawa (não é Toronto).'
      },
      {
        id: 'g_18',
        topic: 'Geografia',
        front_content: 'O que são os Círculos Polares?',
        back_content: 'Paralelos a 66°33 que delimitam as regiões polares.'
      },
      {
        id: 'g_19',
        topic: 'Geografia',
        front_content: 'Qual é o lago mais profundo do mundo?',
        back_content: 'Lago Baikal, na Rússia, com 1.642m.'
      },
      {
        id: 'g_20',
        topic: 'Geografia',
        front_content: 'Qual país tem o formato de uma bota?',
        back_content: 'Itália.'
      }
    ]
  },
  {
    id: 'biologia_basica',
    title: 'Biologia Básica',
    description: 'Células, genética e ecologia',
    category: 'Ciências',
    color_theme: '#95E1D3',
    cards: [
      {
        id: 'c_1',
        topic: 'Biologia',
        front_content: 'O que é mitocôndria?',
        back_content: 'Organela responsável pela produção de energia (ATP) na célula.'
      },
      {
        id: 'c_2',
        topic: 'Biologia',
        front_content: 'O que é DNA?',
        back_content: 'Ácido desoxirribonucleico, molécula que armazena a informação genética.'
      },
      {
        id: 'c_3',
        topic: 'Biologia',
        front_content: 'O que é fotossíntese?',
        back_content: 'Processo em que plantas convertem luz, CO₂ e água em glicose e oxigênio.'
      },
      {
        id: 'c_4',
        topic: 'Biologia',
        front_content: 'Quais são os quatro tipos de tecido do corpo humano?',
        back_content: 'Epitelial, conjuntivo, muscular e nervoso.'
      },
      {
        id: 'c_5',
        topic: 'Biologia',
        front_content: 'O que é um ecossistema?',
        back_content: 'Conjunto de seres vivos e seu ambiente físico interagindo como unidade.'
      },
      {
        id: 'c_6',
        topic: 'Biologia',
        front_content: 'O que é mitose?',
        back_content: 'Divisão celular que produz duas células-filhas geneticamente idênticas.'
      },
      {
        id: 'c_7',
        topic: 'Biologia',
        front_content: 'O que é um gene?',
        back_content: 'Segmento de DNA que codifica uma proteína ou função específica.'
      },
      {
        id: 'c_8',
        topic: 'Biologia',
        front_content: 'O que é a cadeia alimentar?',
        back_content: 'Sequência de organismos onde cada um se alimenta do anterior.'
      },
      {
        id: 'c_9',
        topic: 'Biologia',
        front_content: 'Qual é a função dos glóbulos vermelhos?',
        back_content: 'Transportar oxigênio dos pulmões para os tecidos do corpo.'
      },
      {
        id: 'c_10',
        topic: 'Biologia',
        front_content: 'O que é uma célula-tronco?',
        back_content: 'Célula capaz de se diferenciar em diversos tipos celulares.'
      },
      {
        id: 'c_11',
        topic: 'Biologia',
        front_content: 'O que é biodiversidade?',
        back_content: 'Variedade de seres vivos em um ecossistema ou no planeta.'
      },
      {
        id: 'c_12',
        topic: 'Biologia',
        front_content: 'Qual é a diferença entre procariontes e eucariontes?',
        back_content: 'Procariontes não têm núcleo definido; eucariontes têm.'
      },
      {
        id: 'c_13',
        topic: 'Biologia',
        front_content: 'O que é evolução natural?',
        back_content: 'Mudança nas características de uma população ao longo de gerações.'
      },
      {
        id: 'c_14',
        topic: 'Biologia',
        front_content: 'O que é um vírus?',
        back_content: 'Agente infeccioso que precisa de uma célula hospedeira para se reproduzir.'
      },
      {
        id: 'c_15',
        topic: 'Biologia',
        front_content: 'O que é homeostase?',
        back_content: 'Capacidade do organismo de manter o equilíbrio interno.'
      },
      {
        id: 'c_16',
        topic: 'Biologia',
        front_content: 'Quem foi Charles Darwin?',
        back_content: 'Cientista que propôs a teoria da evolução por seleção natural.'
      },
      {
        id: 'c_17',
        topic: 'Biologia',
        front_content: 'O que é o ciclo da água?',
        back_content: 'Ciclo de evaporação, condensação e precipitação que renova a água.'
      },
      {
        id: 'c_18',
        topic: 'Biologia',
        front_content: 'O que é clorofila?',
        back_content: 'Pigmento verde das plantas que capta luz para a fotossíntese.'
      },
      {
        id: 'c_19',
        topic: 'Biologia',
        front_content: 'Qual é a função do sistema nervoso?',
        back_content: 'Coordenar e controlar as funções do corpo.'
      },
      {
        id: 'c_20',
        topic: 'Biologia',
        front_content: 'O que é um ecossistema marinho?',
        back_content: 'Conjunto de organismos e ambiente físico dos oceanos.'
      }
    ]
  },
  {
    id: 'matematica_fundamental',
    title: 'Matemática Fundamental',
    description: 'Operações, frações e geometria',
    category: 'Matemática',
    color_theme: '#A8E6CF',
    cards: [
      {
        id: 'm_1',
        topic: 'Matemática',
        front_content: 'Quanto é 15% de 200?',
        back_content: '30.'
      },
      {
        id: 'm_2',
        topic: 'Matemática',
        front_content: 'O que é um número primo?',
        back_content: 'Número maior que 1 divisível apenas por 1 e por si mesmo.'
      },
      {
        id: 'm_3',
        topic: 'Matemática',
        front_content: 'Qual é o valor de π (pi) aproximado?',
        back_content: '3,14159.'
      },
      {
        id: 'm_4',
        topic: 'Matemática',
        front_content: 'Como calcular a área de um retângulo?',
        back_content: 'Base multiplicada pela altura (A = b × h).'
      },
      {
        id: 'm_5',
        topic: 'Matemática',
        front_content: 'O que é uma fração equivalente?',
        back_content: 'Frações que representam o mesmo valor (ex: 1/2 = 2/4).'
      },
      {
        id: 'm_6',
        topic: 'Matemática',
        front_content: 'Qual é a fórmula do teorema de Pitágoras?',
        back_content: 'a² + b² = c², para triângulos retângulos.'
      },
      {
        id: 'm_7',
        topic: 'Matemática',
        front_content: 'Quanto é a raiz quadrada de 144?',
        back_content: '12.'
      },
      {
        id: 'm_8',
        topic: 'Matemática',
        front_content: 'O que é um ângulo reto?',
        back_content: 'Ângulo de 90 graus.'
      },
      {
        id: 'm_9',
        topic: 'Matemática',
        front_content: 'Qual é o resultado de 7 × 8?',
        back_content: '56.'
      },
      {
        id: 'm_10',
        topic: 'Matemática',
        front_content: 'O que é MDC?',
        back_content: 'Máximo Divisor Comum, o maior número que divide dois ou mais números.'
      },
      {
        id: 'm_11',
        topic: 'Matemática',
        front_content: 'O que é MMC?',
        back_content: 'Mínimo Múltiplo Comum, o menor múltiplo comum a dois ou mais números.'
      },
      {
        id: 'm_12',
        topic: 'Matemática',
        front_content: 'Como se calcula o perímetro de um quadrado?',
        back_content: '4 vezes o lado (P = 4 × l).'
      },
      {
        id: 'm_13',
        topic: 'Matemática',
        front_content: 'Qual é a fórmula da área do círculo?',
        back_content: 'A = π × r².'
      },
      {
        id: 'm_14',
        topic: 'Matemática',
        front_content: 'O que é um número racional?',
        back_content: 'Número que pode ser escrito como fração a/b, com b ≠ 0.'
      },
      {
        id: 'm_15',
        topic: 'Matemática',
        front_content: 'Qual é o resultado de 3³ (três ao cubo)?',
        back_content: '27.'
      },
      {
        id: 'm_16',
        topic: 'Matemática',
        front_content: 'O que é uma equação do 1º grau?',
        back_content: 'Equação da forma ax + b = 0, onde a ≠ 0.'
      },
      {
        id: 'm_17',
        topic: 'Matemática',
        front_content: 'Como calcular a média aritmética?',
        back_content: 'Soma dos valores dividida pela quantidade de valores.'
      },
      {
        id: 'm_18',
        topic: 'Matemática',
        front_content: 'O que é um número irracional?',
        back_content: 'Número que não pode ser escrito como fração (ex: √2).'
      },
      {
        id: 'm_19',
        topic: 'Matemática',
        front_content: 'Quanto é 2/3 + 1/3?',
        back_content: '1 (um inteiro).'
      },
      {
        id: 'm_20',
        topic: 'Matemática',
        front_content: 'O que é a regra de três simples?',
        back_content: 'Método para encontrar um valor desconhecido a partir de três valores conhecidos.'
      }
    ]
  },
  {
    id: 'quimica_geral',
    title: 'Química Geral',
    description: 'Átomos, reações, ligações e estequiometria',
    category: 'Química',
    color_theme: '#F7786B',
    cards: [
      { id: 'q_1', topic: 'Química', front_content: 'O que é a Tabela Periódica?', back_content: 'Organização dos elementos químicos por ordem crescente de número atômico.' },
      { id: 'q_2', topic: 'Química', front_content: 'O que é ligação iônica?', back_content: 'Ligação química caracterizada pela transferência definitiva de elétrons de um átomo para outro.' },
      { id: 'q_3', topic: 'Química', front_content: 'O que é ligação covalente?', back_content: 'Compartilhamento de pares de elétrons entre átomos.' },
      { id: 'q_4', topic: 'Química', front_content: 'O que é pH?', back_content: 'Potencial Hidrogeniônico, que mede a acidez ou alcalinidade de uma solução (escala de 0 a 14).' },
      { id: 'q_5', topic: 'Química', front_content: 'O que caracteriza uma solução ácida?', back_content: 'Concentração de íons H⁺ elevada, com valor de pH inferior a 7.' },
      { id: 'q_6', topic: 'Química', front_content: 'O que é estequiometria?', back_content: 'Cálculo das quantidades de reagentes e produtos em uma reação química.' },
      { id: 'q_7', topic: 'Química', front_content: 'O que é uma reação de combustão?', back_content: 'Reação exotérmica entre um combustível e um comburente (geralmente oxigênio), liberando calor.' },
      { id: 'q_8', topic: 'Química', front_content: 'O que é ponto de ebulição?', back_content: 'Temperatura em que uma substância passa do estado líquido para o gasoso.' },
      { id: 'q_9', topic: 'Química', front_content: 'O que são hidrocarbonetos?', back_content: 'Compostos orgânicos formados exclusivamente por átomos de carbono e hidrogênio.' },
      { id: 'q_10', topic: 'Química', front_content: 'O que diz a Lei de Lavoisier?', back_content: 'Na natureza, nada se cria, nada se perde, tudo se transforma (conservação das massas).' }
    ]
  },
  {
    id: 'fisica_geral',
    title: 'Física para Vestibulares',
    description: 'Mecânica, cinemática, ondulatória e eletricidade',
    category: 'Física',
    color_theme: '#3498DB',
    cards: [
      { id: 'f_1', topic: 'Física', front_content: 'Qual é a fórmula da velocidade média?', back_content: 'Vm = Δs / Δt (variação do espaço dividida pela variação do tempo).' },
      { id: 'f_2', topic: 'Física', front_content: 'O que diz a 1ª Lei de Newton (Inércia)?', back_content: 'Um corpo tende a permanecer em repouso ou em movimento retilíneo uniforme a menos que forças externas atuem sobre ele.' },
      { id: 'f_3', topic: 'Física', front_content: 'Qual é a fórmula da 2ª Lei de Newton?', back_content: 'Fr = m × a (Força resultante é igual a massa vezes aceleração).' },
      { id: 'f_4', topic: 'Física', front_content: 'O que diz a 3ª Lei de Newton?', back_content: 'A toda ação há sempre uma reação oposta e de igual intensidade.' },
      { id: 'f_5', topic: 'Física', front_content: 'O que é energia cinética?', back_content: 'Energia associada ao movimento de um corpo, calculada por Ec = (m × v²) / 2.' },
      { id: 'f_6', topic: 'Física', front_content: 'O que estuda a calorimetria?', back_content: 'As trocas de calor e variações de temperatura entre corpos.' },
      { id: 'f_7', topic: 'Física', front_content: 'Qual é a velocidade da luz no vácuo?', back_content: 'Aproximadamente 300.000 km/s (3 × 10⁸ m/s).' },
      { id: 'f_8', topic: 'Física', front_content: 'O que é a Lei de Ohm?', back_content: 'V = R × I (Diferença de potencial é igual à resistência vezes a corrente elétrica).' },
      { id: 'f_9', topic: 'Física', front_content: 'Qual é a diferença entre som e luz?', back_content: 'O som é uma onda mecânica (precisa de meio para se propagar); a luz é uma onda eletromagnética (propaga-se no vácuo).' },
      { id: 'f_10', topic: 'Física', front_content: 'O que é gravidade?', back_content: 'Força de atração mútua que corpos com massa exercem uns sobre os outros.' }
    ]
  },
  {
    id: 'sociologia_geral',
    title: 'Sociologia',
    description: 'Cultura, movimentos sociais, cidadania e desigualdades',
    category: 'Sociologia',
    color_theme: '#9B59B6',
    cards: [
      { id: 's_1', topic: 'Sociologia', front_content: 'Quem é considerado o pai da Sociologia?', back_content: 'Auguste Comte, criador da corrente positivista.' },
      { id: 's_2', topic: 'Sociologia', front_content: 'O que é etnocentrismo?', back_content: 'Tendência de julgar outras culturas com base nos padrões e valores da própria cultura.' },
      { id: 's_3', topic: 'Sociologia', front_content: 'O que é o conceito de Fato Social de Durkheim?', back_content: 'Maneiras de agir, pensar e sentir exteriores ao indivíduo e dotadas de poder coercitivo.' },
      { id: 's_4', topic: 'Sociologia', front_content: 'Qual a definição sociológica de cultura?', back_content: 'Conjunto de saberes, costumes, crenças, artes, leis e comportamentos partilhados por uma sociedade.' },
      { id: 's_5', topic: 'Sociologia', front_content: 'O que é desigualdade social?', back_content: 'Diferença na distribuição de recursos, oportunidades, riqueza e direitos entre membros de uma sociedade.' },
      { id: 's_6', topic: 'Sociologia', front_content: 'O que são movimentos sociais?', back_content: 'Ações coletivas organizadas que visam manter ou transformar relações de poder na sociedade.' },
      { id: 's_7', topic: 'Sociologia', front_content: 'O que é cidadania?', back_content: 'Exercício de direitos civis, políticos e sociais garantidos pelas leis de um Estado.' },
      { id: 's_8', topic: 'Sociologia', front_content: 'O que representa a Indústria Cultural de Adorno e Horkheimer?', back_content: 'Produção em massa de bens culturais para entretenimento e controle social.' },
      { id: 's_9', topic: 'Sociologia', front_content: 'O que é estratificação social?', back_content: 'Divisão de uma sociedade em camadas ou classes com diferentes níveis de privilégios e recursos.' },
      { id: 's_10', topic: 'Sociologia', front_content: 'O que é alienação para Karl Marx?', back_content: 'Processo no qual o trabalhador perde o controle sobre o produto do seu próprio trabalho.' }
    ]
  },
  {
    id: 'filosofia_geral',
    title: 'Filosofia',
    description: 'De Sócrates ao existencialismo, ética e política',
    category: 'Filosofia',
    color_theme: '#E67E22',
    cards: [
      { id: 'fi_1', topic: 'Filosofia', front_content: 'O que significa a palavra Filosofia?', back_content: 'Amor à sabedoria (do grego philo + sophia).' },
      { id: 'fi_2', topic: 'Filosofia', front_content: 'Qual a famosa frase atribuída a Sócrates?', back_content: '"Só sei que nada sei", que reflete a busca constante pelo conhecimento.' },
      { id: 'fi_3', topic: 'Filosofia', front_content: 'O que é o Mito da Caverna de Platão?', back_content: 'Alegoria sobre a passagem do senso comum e das aparências para o conhecimento verdadeiro da filosofia.' },
      { id: 'fi_4', topic: 'Filosofia', front_content: 'O que é ética?', back_content: 'Estudo reflexivo e crítico sobre os valores morais e a conduta humana.' },
      { id: 'fi_5', topic: 'Filosofia', front_content: 'O que são filósofos pré-socráticos?', back_content: 'Pensadores gregos que buscavam explicar a origem do universo (Arkhé) através dos elementos da natureza.' },
      { id: 'fi_6', topic: 'Filosofia', front_content: 'O que é contratualismo?', back_content: 'Teoria política que explica a origem do Estado a partir de um contrato social imaginário.' },
      { id: 'fi_7', topic: 'Filosofia', front_content: 'Quem escreveu "O Príncipe"?', back_content: 'Nicolau Maquiavel, analisando o poder e o realismo político.' },
      { id: 'fi_8', topic: 'Filosofia', front_content: 'O que é o Iluminismo?', back_content: 'Movimento intelectual do século XVIII baseado no uso da razão e da ciência para guiar a humanidade.' },
      { id: 'fi_9', topic: 'Filosofia', front_content: 'Quem propôs o imperativo categórico?', back_content: 'Immanuel Kant, estabelecendo que uma ação deve ser universalmente aplicável.' },
      { id: 'fi_10', topic: 'Filosofia', front_content: 'O que propõe o Existencialismo?', back_content: 'Filosofia de que "a existência precede a essência", cabendo ao indivíduo definir seu próprio propósito.' }
    ]
  },
  {
    id: 'artes_geral',
    title: 'Artes',
    description: 'Movimentos artísticos, Barroco, Modernismo e Arte Contemporânea',
    category: 'Artes',
    color_theme: '#E74C3C',
    cards: [
      { id: 'a_1', topic: 'Artes', front_content: 'O que caracteriza o estilo Barroco?', back_content: 'Uso intenso de contrastes de luz e sombra, dramaticidade, emoção e temas religiosos.' },
      { id: 'a_2', topic: 'Artes', front_content: 'Qual a importância do Romantismo nas artes?', back_content: 'Valorização da subjetividade, nacionalismo, emoção individual e liberdade criativa.' },
      { id: 'a_3', topic: 'Artes', front_content: 'O que marcou o Realismo na pintura?', back_content: 'Representação objetiva e fiel do cotidiano das pessoas comuns, com crítica social explícita.' },
      { id: 'a_4', topic: 'Artes', front_content: 'O que foi a Semana de Arte Moderna de 1922?', back_content: 'Evento marco do modernismo brasileiro que buscou renovar e criar uma arte genuinamente nacional.' },
      { id: 'a_5', topic: 'Artes', front_content: 'O que é Arte Contemporânea?', back_content: 'Produção artística atual iniciada na segunda metade do século XX, focada no conceito e novas linguagens.' },
      { id: 'a_6', topic: 'Artes', front_content: 'Quem pintou a "Mona Lisa"?', back_content: 'Leonardo da Vinci, no período do Renascentismo.' },
      { id: 'a_7', topic: 'Artes', front_content: 'Quem pintou "Abaporu"?', back_content: 'Tarsila do Amaral, principal pintura do movimento antropofágico brasileiro.' },
      { id: 'a_8', topic: 'Artes', front_content: 'O que é Impressionismo?', back_content: 'Movimento focado na captura dos efeitos de luz e cor do ambiente natural através de pinceladas rápidas.' },
      { id: 'a_9', topic: 'Artes', front_content: 'O que é Cubismo?', back_content: 'Estilo vanguardista que desconstruiu formas geométricas tridimensionais em planos bidimensionais.' },
      { id: 'a_10', topic: 'Artes', front_content: 'O que propõe a arte conceitual?', back_content: 'A ideia ou conceito por trás da obra de arte é mais importante do que o objeto físico final.' }
    ]
  },
  {
    id: 'portugues_geral',
    title: 'Português & Literatura',
    description: 'Sintaxe, figuras de linguagem, literatura brasileira e coesão',
    category: 'Português',
    color_theme: '#1ABC9C',
    cards: [
      { id: 'p_1', topic: 'Português', front_content: 'O que é uma metáfora?', back_content: 'Figura de linguagem baseada em uma comparação implícita, sem conectivo comparativo.' },
      { id: 'p_2', topic: 'Português', front_content: 'Qual a diferença entre coesão e coerência?', back_content: 'Coesão refere-se à ligação gramatical e estrutural entre as partes do texto; coerência refere-se à lógica e sentido global.' },
      { id: 'p_3', topic: 'Português', front_content: 'O que é um pleonasmo?', back_content: 'Uso de termos redundantes para reforçar uma ideia (ex: "subir para cima").' },
      { id: 'p_4', topic: 'Português', front_content: 'O que foi o Arcadismo?', back_content: 'Escola literária do século XVIII caracterizada pela simplicidade, exaltação da natureza e vida pastoril.' },
      { id: 'p_5', topic: 'Português', front_content: 'Quem escreveu "Dom Casmurro"?', back_content: 'Machado de Assis, principal autor do Realismo brasileiro.' },
      { id: 'p_6', topic: 'Português', front_content: 'O que é uma oração coordenada?', back_content: 'Orações independentes sintaticamente ligadas por conjunção ou pontuação.' },
      { id: 'p_7', topic: 'Português', front_content: 'Qual é a função do sujeito em uma frase?', back_content: 'Termo sobre o qual se faz uma declaração e com o qual o verbo concorda.' },
      { id: 'p_8', topic: 'Português', front_content: 'O que foi a Semana de 22 na literatura?', back_content: 'Rompeu com o formalismo do Parnasianismo e inaugurou a liberdade formal e temática do Modernismo.' },
      { id: 'p_9', topic: 'Português', front_content: 'O que são figuras de pensamento?', back_content: 'Recursos estilísticos que trabalham com o sentido das ideias, como ironia, antítese e hipérbole.' },
      { id: 'p_10', topic: 'Português', front_content: 'O que é a crase?', back_content: 'Fusão da preposição "a" com o artigo feminino "a", indicada pelo acento grave (à).' }
    ]
  },
  {
    id: 'ingles_geral',
    title: 'Inglês',
    description: 'Leitura, termos frequentes e interpretação de texto',
    category: 'Inglês',
    color_theme: '#F1C40F',
    cards: [
      { id: 'in_1', topic: 'Inglês', front_content: 'O que significa o termo "However"?', back_content: 'No entanto, contudo, todavia (indica oposição ou contraste).' },
      { id: 'in_2', topic: 'Inglês', front_content: 'O que significa o termo "Therefore"?', back_content: 'Portanto, por isso (indica conclusão ou consequência).' },
      { id: 'in_3', topic: 'Inglês', front_content: 'O que são falsos cognatos (False Friends)?', back_content: 'Palavras em inglês parecidas com o português no som ou grafia, mas com sentidos diferentes (ex: "Actually" significa "Na verdade").' },
      { id: 'in_4', topic: 'Inglês', front_content: 'O que significa o termo "Furthermore"?', back_content: 'Além disso, outrossim (usado para acrescentar informações).' },
      { id: 'in_5', topic: 'Inglês', front_content: 'O que expressa o verbo modal "Should"?', back_content: 'Conselho, recomendação ou dever moral.' },
      { id: 'in_6', topic: 'Inglês', front_content: 'O que expressa o verbo modal "Must"?', back_content: 'Obrigação, necessidade ou dedução lógica forte.' },
      { id: 'in_7', topic: 'Inglês', front_content: 'O que significa "Although"?', back_content: 'Embora, apesar de que (concessão).' },
      { id: 'in_8', topic: 'Inglês', front_content: 'O que significa "Unless"?', back_content: 'A menos que, a não ser que (condição negativa).' },
      { id: 'in_9', topic: 'Inglês', front_content: 'O que significa "Indeed"?', back_content: 'De fato, realmente (ênfase ou confirmação).' },
      { id: 'in_10', topic: 'Inglês', front_content: 'O que significa "Meanwhile"?', back_content: 'Enquanto isso, nesse meio tempo.' }
    ]
  }
];
