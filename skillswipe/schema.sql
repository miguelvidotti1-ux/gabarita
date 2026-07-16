CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE trails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50) DEFAULT 'general',
  color_theme VARCHAR(7) DEFAULT '#6C63FF',
  total_cards INTEGER DEFAULT 0
);

CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trail_id UUID REFERENCES trails(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  front_content TEXT NOT NULL,
  back_content TEXT NOT NULL
);

CREATE TABLE user_progress (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  trail_id UUID REFERENCES trails(id) ON DELETE CASCADE,
  cards_completed INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'not_started',
  completed_at TIMESTAMP,
  PRIMARY KEY(user_id, trail_id)
);

CREATE TABLE card_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  action VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE streaks (
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date DATE
);

-- 11 TRILHAS
INSERT INTO trails (title, description, category, color_theme, total_cards) VALUES
  ('História do Brasil', 'Da colonização à república', 'história', '#FF6B6B', 20),
  ('Geografia Mundial', 'Continentes, países e capitais', 'geografia', '#4ECDC4', 20),
  ('Biologia Básica', 'Células, genética e ecologia', 'ciências', '#95E1D3', 20),
  ('Matemática Fundamental', 'Operações, frações e geometria', 'matemática', '#A8E6CF', 20),
  ('Química Geral', 'Átomos, reações, ligações e estequiometria', 'Química', '#F7786B', 10),
  ('Física para Vestibulares', 'Mecânica, cinemática, ondulatória e eletricidade', 'Física', '#3498DB', 10),
  ('Sociologia', 'Cultura, movimentos sociais, cidadania e desigualdades', 'Sociologia', '#9B59B6', 10),
  ('Filosofia', 'De Sócrates ao existencialismo, ética e política', 'Filosofia', '#E67E22', 10),
  ('Artes', 'Movimentos artísticos, Barroco, Modernismo e Arte Contemporânea', 'Artes', '#E74C3C', 10),
  ('Português & Literatura', 'Sintaxe, figuras de linguagem, literatura brasileira e coesão', 'Português', '#1ABC9C', 10),
  ('Inglês', 'Leitura, termos frequentes e interpretação de texto', 'Inglês', '#F1C40F', 10);

-- HISTÓRIA (20 cards)
INSERT INTO cards (trail_id, position, front_content, back_content) VALUES
  ((SELECT id FROM trails WHERE title='História do Brasil'),1,'Em que ano o Brasil foi descoberto?','1500, por Pedro Álvares Cabral.'),
  ((SELECT id FROM trails WHERE title='História do Brasil'),2,'Quem foi o primeiro governador-geral?','Tomé de Sousa, em 1549.'),
  ((SELECT id FROM trails WHERE title='História do Brasil'),3,'O que foi o Ciclo do Pau-Brasil?','Extração intensiva no litoral, primeiro produto de exportação.'),
  ((SELECT id FROM trails WHERE title='História do Brasil'),4,'Quando a família real chegou ao Brasil?','1808, com D. João VI.'),
  ((SELECT id FROM trails WHERE title='História do Brasil'),5,'O que foi a Lei Áurea?','Lei que aboliu a escravidão em 1888, pela Princesa Isabel.'),
  ((SELECT id FROM trails WHERE title='História do Brasil'),6,'Quando o Brasil se tornou independente?','1822, com o Grito do Ipiranga de D. Pedro I.'),
  ((SELECT id FROM trails WHERE title='História do Brasil'),7,'O que foi a Guerra do Paraguai?','Conflito (1864-1870) entre Brasil, Argentina e Uruguai vs Paraguai.'),
  ((SELECT id FROM trails WHERE title='História do Brasil'),8,'Quem foi Tiradentes?','Joaquim José da Silva Xavier, mártir da Inconfidência Mineira (1789).'),
  ((SELECT id FROM trails WHERE title='História do Brasil'),9,'O que foi a Proclamação da República?','Golpe militar em 15/11/1889 que depôs o império.'),
  ((SELECT id FROM trails WHERE title='História do Brasil'),10,'O que foi o período colonial?','Fase entre 1500 e 1815 sob domínio português.'),
  ((SELECT id FROM trails WHERE title='História do Brasil'),11,'Quando ocorreu a Abolição da Escravatura?','1888, com a Lei Áurea.'),
  ((SELECT id FROM trails WHERE title='História do Brasil'),12,'Quem foi D. Pedro II?','Último imperador do Brasil, reinou de 1831 a 1889.'),
  ((SELECT id FROM trails WHERE title='História do Brasil'),13,'O que foi a Revolta de Canudos?','Conflito (1896-1897) no sertão baiano liderado por Antônio Conselheiro.'),
  ((SELECT id FROM trails WHERE title='História do Brasil'),14,'O que foi a Era Vargas?','Período (1930-1945) de governo de Getúlio Vargas.'),
  ((SELECT id FROM trails WHERE title='História do Brasil'),15,'Quando ocorreu o Golpe Militar?','1964, deposição de João Goulart.'),
  ((SELECT id FROM trails WHERE title='História do Brasil'),16,'O que foi a Constituição de 1988?','Constituição Cidadã que restabeleceu a democracia.'),
  ((SELECT id FROM trails WHERE title='História do Brasil'),17,'Quem foi Zumbi dos Palmares?','Líder do Quilombo dos Palmares, símbolo da resistência negra (1655-1695).'),
  ((SELECT id FROM trails WHERE title='História do Brasil'),18,'O que foi o Tratado de Tordesilhas?','Acordo de 1494 entre Portugal e Espanha dividindo o Novo Mundo.'),
  ((SELECT id FROM trails WHERE title='História do Brasil'),19,'Quem foi Marechal Deodoro?','Proclamador da República e primeiro presidente (1889-1891).'),
  ((SELECT id FROM trails WHERE title='História do Brasil'),20,'O que foi a Inconfidência Mineira?','Movimento de 1789 em Minas Gerais por independência de Portugal.');

-- GEOGRAFIA (20 cards)
INSERT INTO cards (trail_id, position, front_content, back_content) VALUES
  ((SELECT id FROM trails WHERE title='Geografia Mundial'),1,'Qual é a capital da Austrália?','Camberra.'),
  ((SELECT id FROM trails WHERE title='Geografia Mundial'),2,'Qual é o maior continente em área?','A Ásia.'),
  ((SELECT id FROM trails WHERE title='Geografia Mundial'),3,'Qual é o rio mais extenso do mundo?','O Rio Nilo, com aproximadamente 6.650 km.'),
  ((SELECT id FROM trails elevation WHERE title='Geografia Mundial'),4,'Qual é o menor país do mundo?','Vaticano, com apenas 0,44 km².'),
  ((SELECT id FROM trails WHERE title='Geografia Mundial'),5,'Onde fica o deserto do Saara?','África.'),
  ((SELECT id FROM trails WHERE title='Geografia Mundial'),6,'Qual é a capital do Japão?','Tóquio.'),
  ((SELECT id FROM trails WHERE title='Geografia Mundial'),7,'Qual é a montanha mais alta do mundo?','Monte Everest, com 8.848 metros.'),
  ((SELECT id FROM trails WHERE title='Geografia Mundial'),8,'Qual país tem a maior population?','Índia (desde 2023).'),
  ((SELECT id FROM trails WHERE title='Geografia Mundial'),9,'O que é a Linha do Equador?','Paralelo 0° que divide a Terra em hemisférios Norte e Sul.'),
  ((SELECT id FROM trails WHERE title='Geografia Mundial'),10,'Qual é o maior oceano?','Oceano Pacífico.'),
  ((SELECT id FROM trails WHERE title='Geografia Mundial'),11,'Qual é a capital da Rússia?','Moscou.'),
  ((SELECT id FROM trails WHERE title='Geografia Mundial'),12,'Onde fica o Taj Mahal?','Índia, na cidade de Agra.'),
  ((SELECT id FROM trails WHERE title='Geografia Mundial'),13,'Qual canal liga o Atlântico ao Pacífico?','Canal do Panamá.'),
  ((SELECT id FROM trails WHERE title='Geografia Mundial'),14,'Qual é a capital do Egito?','Cairo.'),
  ((SELECT id FROM trails WHERE title='Geografia Mundial'),15,'Qual é o maior país em área?','Rússia.'),
  ((SELECT id FROM trails WHERE title='Geografia Mundial'),16,'Em qual continente fica Madagascar?','África.'),
  ((SELECT id FROM trails WHERE title='Geografia Mundial'),17,'Qual é a capital do Canadá?','Ottawa (não é Toronto).'),
  ((SELECT id FROM trails WHERE title='Geografia Mundial'),18,'O que são os Círculos Polares?','Paralelos a 66°33 que delimitam as regiões polares.'),
  ((SELECT id FROM trails WHERE title='Geografia Mundial'),19,'Qual é o lago mais profundo do mundo?','Lago Baikal, na Rússia, com 1.642m.'),
  ((SELECT id FROM trails WHERE title='Geografia Mundial'),20,'Qual país tem formato de bota?','Itália.');

-- CIÊNCIAS (20 cards)
INSERT INTO cards (trail_id, position, front_content, back_content) VALUES
  ((SELECT id FROM trails WHERE title='Biologia Básica'),1,'O que é mitocôndria?','Organela responsável pela produção de energia (ATP) na célula.'),
  ((SELECT id FROM trails WHERE title='Biologia Básica'),2,'O que é DNA?','Ácido desoxirribonucleico, molécula que armazena informação genética.'),
  ((SELECT id FROM trails WHERE title='Biologia Básica'),3,'O que é fotossíntese?','Processo em que plantas convertem luz, CO₂ e água em glicose e oxigênio.'),
  ((SELECT id FROM trails WHERE title='Biologia Básica'),4,'Quais os 4 tecidos do corpo humano?','Epitelial, conjuntivo, muscular e nervoso.'),
  ((SELECT id FROM trails WHERE title='Biologia Básica'),5,'O que é um ecossistema?','Conjunto de seres vivos e ambiente físico interagindo como unidade.'),
  ((SELECT id FROM trails WHERE title='Biologia Básica'),6,'O que é mitose?','Divisão celular que produz duas células-filhas idênticas.'),
  ((SELECT id FROM trails WHERE title='Biologia Básica'),7,'O que é um gene?','Segmento de DNA que codifica uma proteína ou função.'),
  ((SELECT id FROM trails WHERE title='Biologia Básica'),8,'O que é cadeia alimentar?','Sequência de organismos onde cada um se alimenta do anterior.'),
  ((SELECT id FROM trails WHERE title='Biologia Básica'),9,'Função dos glóbulos vermelhos?','Transportar oxigênio dos pulmões para os tecidos.'),
  ((SELECT id FROM trails WHERE title='Biologia Básica'),10,'O que é célula-tronco?','Célula capaz de se diferenciar em diversos tipos celulares.'),
  ((SELECT id FROM trails WHERE title='Biologia Básica'),11,'O que é biodiversidade?','Variedade de seres vivos em um ecossistema ou no planeta.'),
  ((SELECT id FROM trails WHERE title='Biologia Básica'),12,'Diferença entre procariontes e eucariontes?','Procariontes não têm núcleo definido; eucariontes têm.'),
  ((SELECT id FROM trails WHERE title='Biologia Básica'),13,'O que é evolução natural?','Mudança nas características de uma população ao longo de gerações.'),
  ((SELECT id FROM trails WHERE title='Biologia Básica'),14,'O que é um vírus?','Agente infeccioso que precisa de uma célula hospedeira para se reproduzir.'),
  ((SELECT id FROM trails WHERE title='Biologia Básica'),15,'O que é homeostase?','Capacidade do organismo de manter o equilíbrio interno.'),
  ((SELECT id FROM trails WHERE title='Biologia Básica'),16,'Quem foi Charles Darwin?','Cientista que propôs a teoria da evolução por seleção natural.'),
  ((SELECT id FROM trails WHERE title='Biologia Básica'),17,'O que é o ciclo da água?','Ciclo de evaporação, condensação e precipitação que renova a água.'),
  ((SELECT id FROM trails WHERE title='Biologia Básica'),18,'O que é clorofila?','Pigmento verde das plantas que capta luz para a fotossíntese.'),
  ((SELECT id FROM trails WHERE title='Biologia Básica'),19,'Função do sistema nervoso?','Coordenar e controlar as funções do corpo.'),
  ((SELECT id FROM trails WHERE title='Biologia Básica'),20,'O que é ecossistema marinho?','Conjunto de organismos e ambiente físico dos oceanos.');

-- MATEMÁTICA (20 cards)
INSERT INTO cards (trail_id, position, front_content, back_content) VALUES
  ((SELECT id FROM trails WHERE title='Matemática Fundamental'),1,'Quanto é 15% de 200?','30.'),
  ((SELECT id FROM trails WHERE title='Matemática Fundamental'),2,'O que é um número primo?','Número maior que 1 divisível apenas por 1 e por si mesmo.'),
  ((SELECT id FROM trails WHERE title='Matemática Fundamental'),3,'Valor aproximado de π (pi)?','3,14159.'),
  ((SELECT id FROM trails WHERE title='Matemática Fundamental'),4,'Área de um retângulo?','Base × altura (A = b × h).'),
  ((SELECT id FROM trails WHERE title='Matemática Fundamental'),5,'O que são frações equivalentes?','Frações que representam o mesmo valor (ex: 1/2 = 2/4).'),
  ((SELECT id FROM trails WHERE title='Matemática Fundamental'),6,'Teorema de Pitágoras?','a² + b² = c², para triângulos retângulos.'),
  ((SELECT id FROM trails WHERE title='Matemática Fundamental'),7,'Raiz quadrada de 144?','12.'),
  ((SELECT id FROM trails WHERE title='Matemática Fundamental'),8,'O que é ângulo reto?','Ângulo de 90 graus.'),
  ((SELECT id FROM trails WHERE title='Matemática Fundamental'),9,'Quanto é 7 × 8?','56.'),
  ((SELECT id FROM trails WHERE title='Matemática Fundamental'),10,'O que é MDC?','Máximo Divisor Comum de dois ou mais números.'),
  ((SELECT id FROM trails WHERE title='Matemática Fundamental'),11,'O que é MMC?','Mínimo Múltiplo Comum de dois ou mais números.'),
  ((SELECT id FROM trails WHERE title='Matemática Fundamental'),12,'Perímetro de um quadrado?','4 × lado (P = 4 × l).'),
  ((SELECT id FROM trails WHERE title='Matemática Fundamental'),13,'Área do círculo?','A = π × r².'),
  ((SELECT id FROM trails WHERE title='Matemática Fundamental'),14,'O que é número racional?','Número que pode ser escrito como fração a/b, com b ≠ 0.'),
  ((SELECT id FROM trails WHERE title='Matemática Fundamental'),15,'Quanto é 3³ (três ao cubo)?','27.'),
  ((SELECT id FROM trails WHERE title='Matemática Fundamental'),16,'O que é equação do 1º grau?','Equação da forma ax + b = 0, onde a ≠ 0.'),
  ((SELECT id FROM trails WHERE title='Matemática Fundamental'),17,'Como calcular média aritmética?','Soma dos valores dividida pela quantidade de valores.'),
  ((SELECT id FROM trails WHERE title='Matemática Fundamental'),18,'O que é número irracional?','Número que não pode ser escrito como fração (ex: √2).'),
  ((SELECT id FROM trails WHERE title='Matemática Fundamental'),19,'Quanto é 2/3 + 1/3?','1 (um inteiro).'),
  ((SELECT id FROM trails WHERE title='Matemática Fundamental'),20,'O que é regra de três simples?','Método para encontrar um valor desconhecido a partir de três conhecidos.');

-- QUÍMICA (10 cards)
INSERT INTO cards (trail_id, position, front_content, back_content) VALUES
  ((SELECT id FROM trails WHERE title='Química Geral'),1,'O que é a Tabela Periódica?','Organização dos elementos químicos por ordem crescente de número atômico.'),
  ((SELECT id FROM trails WHERE title='Química Geral'),2,'O que é ligação iônica?','Ligação química caracterizada pela transferência definitiva de elétrons de um átomo para outro.'),
  ((SELECT id FROM trails WHERE title='Química Geral'),3,'O que é ligação covalente?','Compartilhamento de pares de elétrons entre átomos.'),
  ((SELECT id FROM trails WHERE title='Química Geral'),4,'O que é pH?','Potencial Hidrogeniônico, que mede a acidez ou alcalinidade de uma solução (escala de 0 a 14).'),
  ((SELECT id FROM trails WHERE title='Química Geral'),5,'O que caracteriza uma solução ácida?','Concentração de íons H⁺ elevada, com valor de pH inferior a 7.'),
  ((SELECT id FROM trails WHERE title='Química Geral'),6,'O que é estequiometria?','Cálculo das quantidades de reagentes e produtos em uma reação química.'),
  ((SELECT id FROM trails WHERE title='Química Geral'),7,'O que é uma reação de combustão?','Reação exotérmica entre um combustível e um comburente (geralmente oxigênio), liberando calor.'),
  ((SELECT id FROM trails WHERE title='Química Geral'),8,'O que é ponto de ebulição?','Temperatura em que uma substância passa do estado líquido para o gasoso.'),
  ((SELECT id FROM trails WHERE title='Química Geral'),9,'O que são hidrocarbonetos?','Compostos orgânicos formados exclusivamente por átomos de carbono e hidrogênio.'),
  ((SELECT id FROM trails WHERE title='Química Geral'),10,'O que diz a Lei de Lavoisier?','Na natureza, nada se cria, nada se perde, tudo se transforma (conservação das massas).');

-- FÍSICA (10 cards)
INSERT INTO cards (trail_id, position, front_content, back_content) VALUES
  ((SELECT id FROM trails WHERE title='Física para Vestibulares'),1,'Qual é a fórmula da velocidade média?','Vm = Δs / Δt (variação do espaço dividida pela variação do tempo).'),
  ((SELECT id FROM trails WHERE title='Física para Vestibulares'),2,'O que diz a 1ª Lei de Newton (Inércia)?','Um corpo tende a permanecer em repouso ou em movimento retilíneo uniforme a menos que forças externas atuem sobre ele.'),
  ((SELECT id FROM trails WHERE title='Física para Vestibulares'),3,'Qual é a fórmula da 2ª Lei de Newton?','Fr = m × a (Força resultante é igual a massa vezes aceleração).'),
  ((SELECT id FROM trails WHERE title='Física para Vestibulares'),4,'O que diz a 3ª Lei de Newton?','A toda ação há sempre uma reação oposta e de igual intensidade.'),
  ((SELECT id FROM trails WHERE title='Física para Vestibulares'),5,'O que é energia cinética?','Energia associada ao movimento de um corpo, calculada por Ec = (m × v²) / 2.'),
  ((SELECT id FROM trails WHERE title='Física para Vestibulares'),6,'O que estuda a calorimetria?','As trocas de calor e variações de temperatura entre corpos.'),
  ((SELECT id FROM trails WHERE title='Física para Vestibulares'),7,'Qual é a velocidade da luz no vácuo?','Aproximadamente 300.000 km/s (3 × 10⁸ m/s).'),
  ((SELECT id FROM trails WHERE title='Física para Vestibulares'),8,'O que é a Lei de Ohm?','V = R × I (Diferença de potencial é igual à resistência vezes a corrente elétrica).'),
  ((SELECT id FROM trails WHERE title='Física para Vestibulares'),9,'Qual é a diferença entre som e luz?','O som é uma onda mecânica (precisa de meio para se propagar); a luz é uma onda eletromagnética (propaga-se no vácuo).'),
  ((SELECT id FROM trails WHERE title='Física para Vestibulares'),10,'O que é gravidade?','Força de atração mútua que corpos com massa exercem uns sobre os outros.');

-- SOCIOLOGIA (10 cards)
INSERT INTO cards (trail_id, position, front_content, back_content) VALUES
  ((SELECT id FROM trails WHERE title='Sociologia'),1,'Quem é considerado o pai da Sociologia?','Auguste Comte, criador da corrente positivista.'),
  ((SELECT id FROM trails WHERE title='Sociologia'),2,'O que é etnocentrismo?','Tendência de julgar outras culturas com base nos padrões e valores da própria cultura.'),
  ((SELECT id FROM trails WHERE title='Sociologia'),3,'O que é o conceito de Fato Social de Durkheim?','Maneiras de agir, pensar e sentir exteriores ao indivíduo e dotadas de poder coercitivo.'),
  ((SELECT id FROM trails WHERE title='Sociologia'),4,'Qual a definição sociológica de cultura?','Conjunto de saberes, costumes, crenças, artes, leis e comportamentos partilhados por uma sociedade.'),
  ((SELECT id FROM trails WHERE title='Sociologia'),5,'O que é desigualdade social?','Diferença na distribuição de recursos, oportunidades, riqueza e direitos entre membros de uma sociedade.'),
  ((SELECT id FROM trails WHERE title='Sociologia'),6,'O que são movimentos sociais?','Ações coletivas organizadas que visam manter ou transformar relações de poder na sociedade.'),
  ((SELECT id FROM trails WHERE title='Sociologia'),7,'O que é cidadania?','Exercício de direitos civis, políticos e sociais garantidos pelas leis de um Estado.'),
  ((SELECT id FROM trails WHERE title='Sociologia'),8,'O que representa a Indústria Cultural de Adorno e Horkheimer?','Produção em massa de bens culturais para entretenimento e controle social.'),
  ((SELECT id FROM trails WHERE title='Sociologia'),9,'O que é estratificação social?','Divisão de uma sociedade em camadas ou classes com diferentes níveis de privilégios e recursos.'),
  ((SELECT id FROM trails WHERE title='Sociologia'),10,'O que é alienação para Karl Marx?','Processo no qual o trabalhador perde o controle sobre o produto do seu próprio trabalho.');

-- FILOSOFIA (10 cards)
INSERT INTO cards (trail_id, position, front_content, back_content) VALUES
  ((SELECT id FROM trails WHERE title='Filosofia'),1,'O que significa a palavra Filosofia?','Amor à sabedoria (do grego philo + sophia).'),
  ((SELECT id FROM trails WHERE title='Filosofia'),2,'Qual a famosa frase atribuída a Sócrates?','"Só sei que nada sei", que reflete a busca constante pelo conhecimento.'),
  ((SELECT id FROM trails WHERE title='Filosofia'),3,'O que é o Mito da Caverna de Platão?','Alegoria sobre a passagem do senso comum e das aparências para o conhecimento verdadeiro da filosofia.'),
  ((SELECT id FROM trails WHERE title='Filosofia'),4,'O que é ética?','Estudo reflexivo e crítico sobre os valores morais e a conduta humana.'),
  ((SELECT id FROM trails WHERE title='Filosofia'),5,'O que são filósofos pré-socráticos?','Pensadores gregos que buscavam explicar a origem do universo (Arkhé) através dos elementos da natureza.'),
  ((SELECT id FROM trails WHERE title='Filosofia'),6,'O que é contratualismo?','Teoria política que explica a origem do Estado a partir de um contrato social imaginário.'),
  ((SELECT id FROM trails WHERE title='Filosofia'),7,'Quem escreveu "O Príncipe"?','Nicolau Maquiavel, analisando o poder e o realismo político.'),
  ((SELECT id FROM trails WHERE title='Filosofia'),8,'O que é o Iluminismo?','Movimento intelectual do século XVIII baseado no uso da razão e da ciência para guiar a humanidade.'),
  ((SELECT id FROM trails WHERE title='Filosofia'),9,'Quem propôs o imperativo categórico?','Immanuel Kant, estabelecendo que uma ação deve ser universalmente aplicável.'),
  ((SELECT id FROM trails WHERE title='Filosofia'),10,'O que propõe o Existencialismo?','Filosofia de que "a existência precede a essência", cabendo ao indivíduo definir seu próprio propósito.');

-- ARTES (10 cards)
INSERT INTO cards (trail_id, position, front_content, back_content) VALUES
  ((SELECT id FROM trails WHERE title='Artes'),1,'O que caracteriza o estilo Barroco?','Uso intenso de contrastes de luz e sombra, dramaticidade, emoção e temas religiosos.'),
  ((SELECT id FROM trails WHERE title='Artes'),2,'Qual a importância do Romantismo nas artes?','Valorização da subjetividade, nacionalismo, emoção individual e liberdade criativa.'),
  ((SELECT id FROM trails WHERE title='Artes'),3,'O que marcou o Realismo na pintura?','Representação objetiva e fiel do cotidiano das pessoas comuns, com crítica social explícita.'),
  ((SELECT id FROM trails WHERE title='Artes'),4,'O que foi a Semana de Arte Moderna de 1922?','Evento marco do modernismo brasileiro que buscou renovar e criar uma arte genuinamente nacional.'),
  ((SELECT id FROM trails WHERE title='Artes'),5,'O que é Arte Contemporânea?','Produção artística atual iniciada na segunda metade do século XX, focada no conceito e novas linguagens.'),
  ((SELECT id FROM trails WHERE title='Artes'),6,'Quem pintou a "Mona Lisa"?','Leonardo da Vinci, no período do Renascentismo.'),
  ((SELECT id FROM trails WHERE title='Artes'),7,'Quem pintou "Abaporu"?','Tarsila do Amaral, principal pintura do movimento antropofágico brasileiro.'),
  ((SELECT id FROM trails WHERE title='Artes'),8,'O que é Impressionismo?','Movimento focado na captura dos efeitos de luz e cor do ambiente natural através de pinceladas rápidas.'),
  ((SELECT id FROM trails WHERE title='Artes'),9,'O que é Cubismo?','Estilo vanguardista que desconstruiu formas geométricas tridimensionais em planos bidimensionais.'),
  ((SELECT id FROM trails WHERE title='Artes'),10,'O que propõe a arte conceitual?','A ideia ou conceito por trás da obra de arte é mais importante do que o objeto físico final.');

-- PORTUGUÊS (10 cards)
INSERT INTO cards (trail_id, position, front_content, back_content) VALUES
  ((SELECT id FROM trails WHERE title='Português & Literatura'),1,'O que é uma metáfora?','Figura de linguagem baseada em uma comparação implícita, sem conectivo comparativo.'),
  ((SELECT id FROM trails WHERE title='Português & Literatura'),2,'Qual a diferença entre coesão e coerência?','Coesão refere-se à ligação gramatical e estrutural entre as partes do texto; coerência refere-se à lógica e sentido global.'),
  ((SELECT id FROM trails WHERE title='Português & Literatura'),3,'O que é um pleonasmo?','Uso de termos redundantes para reforçar uma ideia (ex: "subir para cima").'),
  ((SELECT id FROM trails WHERE title='Português & Literatura'),4,'O que foi o Arcadismo?','Escola literária do século XVIII caracterizada pela simplicidade, exaltação da natureza e vida pastoril.'),
  ((SELECT id FROM trails WHERE title='Português & Literatura'),5,'Quem escreveu "Dom Casmurro"?','Machado de Assis, principal autor do Realismo brasileiro.'),
  ((SELECT id FROM trails WHERE title='Português & Literatura'),6,'O que é uma oração coordenada?','Orações independentes sintaticamente ligadas por conjunção ou pontuação.'),
  ((SELECT id FROM trails WHERE title='Português & Literatura'),7,'Qual é a função do sujeito em uma frase?','Termo sobre o qual se faz uma declaração e com o qual o verbo concorda.'),
  ((SELECT id FROM trails WHERE title='Português & Literatura'),8,'O que foi a Semana de 22 na literatura?','Rompeu com o formalismo do Parnasianismo e inaugurou a liberdade formal e temática do Modernismo.'),
  ((SELECT id FROM trails WHERE title='Português & Literatura'),9,'O que são figuras de pensamento?','Recursos estilísticos que trabalham com o sentido das ideias, como ironia, antítese e hipérbole.'),
  ((SELECT id FROM trails WHERE title='Português & Literatura'),10,'O que é a crase?','Fusão da preposição "a" com o artigo feminino "a", indicada pelo acento grave (à).');

-- INGLÊS (10 cards)
INSERT INTO cards (trail_id, position, front_content, back_content) VALUES
  ((SELECT id FROM trails WHERE title='Inglês'),1,'O que significa o termo "However"?','No entanto, contudo, todavia (indica oposição ou contraste).'),
  ((SELECT id FROM trails WHERE title='Inglês'),2,'O que significa o termo "Therefore"?','Portanto, por isso (indica conclusão ou consequência).'),
  ((SELECT id FROM trails WHERE title='Inglês'),3,'O que são falsos cognatos (False Friends)?','Palavras em inglês parecidas com o português no som ou grafia, mas com sentidos diferentes (ex: "Actually" significa "Na verdade").'),
  ((SELECT id FROM trails WHERE title='Inglês'),4,'O que significa o termo "Furthermore"?','Além disso, outrossim (usado para acrescentar informações).'),
  ((SELECT id FROM trails WHERE title='Inglês'),5,'O que expressa o verbo modal "Should"?','Conselho, recomendação ou dever moral.'),
  ((SELECT id FROM trails WHERE title='Inglês'),6,'O que expressa o verbo modal "Must"?','Obrigação, necessidade ou dedução lógica forte.'),
  ((SELECT id FROM trails WHERE title='Inglês'),7,'O que significa "Although"?','Embora, apesar de que (concessão).'),
  ((SELECT id FROM trails WHERE title='Inglês'),8,'O que significa "Unless"?','A menos que, a não ser que (condição negativa).'),
  ((SELECT id FROM trails WHERE title='Inglês'),9,'O que significa "Indeed"?','De fato, realmente (ênfase ou confirmação).'),
  ((SELECT id FROM trails WHERE title='Inglês'),10,'O que significa "Meanwhile"?','Enquanto isso, nesse meio tempo.');
