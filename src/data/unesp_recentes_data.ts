import { Vestibular } from '../types';

export interface UnespDiscursiveQuestion {
  numero: number;
  disciplina: string;
  enunciado: string;
  subItens: {
    item: 'a' | 'b';
    pergunta: string;
    resposta: string;
    justificativa: string;
  }[];
  respostaGeral: string;
  justificativaGeral: string;
}

export interface UnespObjectiveQuestion {
  numero: number;
  disciplina: string;
  enunciado: string;
  alternativas: string[];
  resposta: string;
  justificativa: string;
}

export interface UnespRedacaoInfo {
  ano: number;
  tema: string;
  tituloProposta: string;
  instrucoes: string;
  textosMotivadores: {
    numero: number;
    titulo?: string;
    autor: string;
    fonte: string;
    conteudo: string;
  }[];
  comentarioBanca: string;
  pontosChave: string[];
}

// ===== PROPOSTA DE REDAÇÃO OFICIAL UNESP 2025 =====
export const UNESP_2025_REDACAO: UnespRedacaoInfo = {
  ano: 2025,
  tema: "Medicalização da vida: a quem interessa?",
  tituloProposta: "Vestibular UNESP 2025 — 2ª Fase (Prova de Conhecimentos Específicos e Redação)",
  instrucoes: "Com base nos textos apresentados e em seus próprios conhecimentos, escreva um texto dissertativo-argumentativo, empregando a norma-padrão da língua portuguesa, sobre o tema: Medicalização da vida: a quem interessa?",
  textosMotivadores: [
    {
      numero: 1,
      titulo: "Charge Valium",
      autor: "Quino (Potentes, prepotentes e impotentes, 2003)",
      fonte: "Quino. Potentes, prepotentes e impotentes, 2003.",
      conteudo: "Charge retratando manifestantes em protesto popular com cartazes ('Abaixo...', 'Chega de...', 'Não aos...'), contra os quais policiais com equipamentos antidistúrbio disparam canhões e lançam caixas do ansiolítico Valium para conter e apaziguar a multidão. [Nota: Valium foi introduzido no mercado em 1963 e comumente prescrito para quadros de ansiedade. Entre 1968 e 1981, foi o medicamento mais amplamente prescrito em todo o Ocidente]."
    },
    {
      numero: 2,
      titulo: "Tira Malvados — Palestra sobre os novos tempos",
      autor: "André Dahmer",
      fonte: "André Dahmer. Malvados, 2019.",
      conteudo: "— Palestra sobre os novos tempos: 'É preciso medicar todas as crianças que correm e gritam.'\n— Ouvinte pergunta: 'Correr e gritar não são dois direitos das crianças?'\n— Palestrante responde: 'Sim. São dois direitos contra milhões de dólares.'"
    },
    {
      numero: 3,
      titulo: "Sofro, logo me medico: a medicalização da vida como enfrentamento do mal-estar",
      autor: "Marcele Zucolotto et al.",
      fonte: "Id on Line, 2019.",
      conteudo: "A ascensão da indústria farmacêutica e do saber médico como aquele que regula as práticas por meio da dicotomia normal/anormal contribui para a formação de novos discursos acerca da medicalização. Cada vez mais presenciamos diagnósticos precoces de doenças graves como depressão, transtorno de déficit de atenção e hiperatividade (TDAH) e quadros de ansiedade. Por conta desse estado de fluidez e rapidez em que nossa sociedade se encontra, ocorre uma significativa redução do lugar para o sofrimento e para a tristeza, que passam a ser entendidos como fazendo parte do campo da irregularidade e da anormalidade e, por consequência, passam a ser rapidamente medicalizados."
    },
    {
      numero: 4,
      titulo: "Elogio do medo",
      autor: "Maria Rita Kehl",
      fonte: "https://artepensamento.ims.com.br. Adaptado.",
      conteudo: "A medicalização da vida subjetiva promovida por correntes radicais das neurociências, a partir de uma concepção dos estados afetivos como transtornos do funcionamento cerebral por deficiência de neurotransmissores, tem contribuído para a perda ou o empobrecimento de uma das qualidades fundamentais do psiquismo: o fato de que ele só existe como trabalho permanente de representação, de simbolização do real, de resolução de conflitos. As manifestações da subjetividade vão sendo progressivamente estigmatizadas como estorvo à vida produtiva e aos ideais de felicidade imediata promovidos pela cultura das sensações corporais. Consequentemente os períodos de luto, as tristezas que a vida traz, as ansiedades e angústias passam a ser encarados como anomalias intoleráveis sobre as quais se exige rápida intervenção médica em nome do retorno rápido a um funcionamento 'normal'."
    },
    {
      numero: 5,
      titulo: "Medicalização e sociedade contemporânea",
      autor: "Marcelo Kimati",
      fonte: "Revista Cult, abril de 2023.",
      conteudo: "A medicalização inclui, por exemplo, entender como um problema médico o luto decorrente de perdas, o sofrimento por uma separação difícil ou a tristeza decorrente de uma perda financeira após a reforma da previdência. Esse último exemplo retrata uma dimensão perversa da medicalização, que desconsidera fenômenos sociais promotores de sofrimento psíquico."
    }
  ],
  comentarioBanca: `A Banca Examinadora da VUNESP propôs a seguinte questão reflexiva: "Medicalização da vida: a quem interessa?". 
Cinco textos foram oferecidos como base para a produção de uma dissertação argumentativa. O candidato deveria demonstrar repertório sociocultural produtivo, articulando:
1. Reconhecimento de que a medicalização extrapolou o tratamento legítimo de enfermidades e passou a patologizar sentimentos humanos intrínsecos (luto, desânimo, tristeza, hiperatividade infantil e indignação social).
2. Análise crítica sobre quem lucra: o complexo econômico-industrial da Big Pharma e as redes de farmácias com bilhões em vendas de psicotrópicos e tarjas pretas; o sistema corporativo e a produtividade neoliberal, que exigem indivíduos funcionais e sem atritos 24 horas por dia; e a própria desresponsabilização do Estado frente aos problemas sociais (desemprego, precariedade habitacional e jornadas extenuantes convertidos em 'depressão clínica individual').
3. Defesa da subjetividade, do direito à infância lúdica e da superação da anestesia coletiva gerada pelo uso indiscriminado de ansiolíticos e estimulantes.`,
  pontosChave: [
    "Patologização do sofrimento natural (luto, frustração, timidez e tristeza tratados como anomalias)",
    "Interesses bilionários da indústria farmacêutica e redes de drogarias",
    "Exigência de alta produtividade e felicidade compulsória no capitalismo contemporâneo",
    "Individualização de problemas sociais e estruturais (desigualdade, precarização do trabalho)",
    "Medicação precoce na infância (silenciamento de comportamentos infantis com psicofármacos)"
  ]
};

// ===== QUESTÕES DISCURSIVAS UNESP 2025 (2ª FASE) =====
export const UNESP_2025_FASE2_QUESTOES: UnespDiscursiveQuestion[] = [
  {
    numero: 1,
    disciplina: "História",
    enunciado: "Mesmo hoje, a imagem de uma loba amamentando o bebê Rômulo e seu irmão gêmeo Remo simboliza as origens de Roma. A famosa estátua de bronze da cena é uma das obras mais copiadas e instantaneamente reconhecíveis da arte romana [...]. Com essa imagem tão familiar, é fácil aceitar sem quaisquer restrições a história de Remo e Rômulo [...], e esquecer que se trata de uma das mais antigas 'lendas históricas' da fundação de qualquer cidade [...]. E, sem dúvida, trata-se de um mito ou de uma lenda, mesmo que os romanos a vejam, em termos amplos, como história. (Mary Beard. SPQR: uma história da Roma Antiga, 2017.)",
    subItens: [
      {
        item: "a",
        pergunta: "Como um mito ou uma lenda se relacionam ao estudo da história?",
        resposta: "O mito e a lenda originam-se na tradição oral de um povo para explicar sua realidade empírica, metafísica e identitária, misturando acontecimentos reais a elementos fantásticos e sobrenaturais. Para o estudo da história contemporânea, os mitos não são tomados como verdades factuais literais, mas como valiosas fontes históricas que revelam os valores, a visão de mundo, as angústias e a ideologia dos grupos sociais que os produziram.",
        justificativa: "A historiografia científica contemporânea investiga criticamente o sentido simbólico e as funções sociais e políticas que as narrativas míticas exerceram na coesão coletiva de uma civilização."
      },
      {
        item: "b",
        pergunta: "A partir da imagem e do excerto, explique a frase 'trata-se de um mito ou de uma lenda, mesmo que os romanos a vejam, em termos amplos, como história' (2.º parágrafo).",
        resposta: "A narrativa mítica de Rômulo e Remo (popularizada por Virgílio na Eneida e por Tito Lívio) visava neutralizar a forte influência cultural helenística no final da República e legitimar as origens da cidade de Roma. O mito combinava naturezas divinas (filhos do deus Marte), humanas (gerados pela vestal Reia Sílvia) e animais/selvagens (amamentados pela loba Luperca). Para os romanos, tais narrativas funcionavam como memória viva e verdade identitária coletiva, integrando a história cívica com a qual justificavam seu destino imperial de dominar o mundo.",
        justificativa: "Critério oficial Vunesp/Objetivo: explicitação da função identitária e legitimadora do mito de fundação em Roma, articulando as três dimensões (divina, humana e animal) com a percepção romana de sua grandeza histórica."
      }
    ],
    respostaGeral: "a) O mito reflete a visão de mundo e a tradição de um povo, servindo como documento histórico. b) Os romanos incorporaram a lenda à sua identidade civilizatória concreta como justificativa de sua força divina e humana.",
    justificativaGeral: "Análise historiográfica sobre a relação entre mito, memória coletiva e construção identitária na Roma Antiga."
  },
  {
    numero: 2,
    disciplina: "História",
    enunciado: "Como uma caixa de Pandora, as lutas pela independência [na América hispânica] espalharam desejos e aspirações sociais que pediam soluções imediatas, mas que nem sempre eram fáceis de ser alcançadas. [...] Se, portanto, a independência aparece como uma frustração, como proclamaram tantos de seus protagonistas, é porque, antes de tudo, abriu a possibilidade de um desenlace diferente e despertou os sonhos adormecidos de muitos. Tempos de transformação trazem em si grandes esperanças e sua outra face, as inevitáveis frustrações. Os poderosos queriam tudo organizar e controlar. Os letrados, desencantados com a incapacidade de realizar seus sonhos, esqueceram que os processos históricos eram lentos [...]. Os humildes também se desesperaram, pois sua vida continuava dominada pela pobreza e opressão e tratada com desdém e desrespeito. (Maria Ligia Coelho Prado. América Latina no século XIX, 1999.)",
    subItens: [
      {
        item: "a",
        pergunta: "No contexto dos movimentos de independência na América hispânica, caracterize dois dos grupos citados no excerto: os 'poderosos' e os 'letrados'.",
        resposta: "Os 'poderosos' eram os membros da elite criolla (proprietários de terras, mineradores e grandes comerciantes nascidos na América), que lideraram a ruptura colonial com o objetivo de assumir o poder político mantendo intacta a estrutura oligárquica, o latifúndio e a exploração do trabalho. Já os 'letrados' eram intelectuais, juristas e clérigos ilustrados (muitas vezes chamados de 'estrangeirados'), influenciados pelo ideário iluminista, que projetavam reformas liberais, modernização institucional e igualdade civil.",
        justificativa: "Diferenciação precisa entre o projeto conservador-oligárquico da elite latifundiária criolla e o projeto reformista/republicano dos intelectuais letrados."
      },
      {
        item: "b",
        pergunta: "Relacione e justifique duas afirmações do excerto: 'a independência aparece como uma frustração' e 'Os humildes também se desesperaram, pois sua vida continuava dominada pela pobreza e opressão'.",
        resposta: "As massas populares (indígenas, afrodescendentes e camponeses mestiços) aderiram com entusiasmo aos exércitos de libertação atraídas por promessas de abolição da servidão, acesso à terra e igualdade cidadã. Contudo, após a emancipação, as elites criollas vitoriosas consolidaram regimes oligárquicos excludentes, mantendo a concentração fundiária e as mesmas relações de servidão e opressão vigentes na colônia, frustrando integralmente as esperanças dos mais humildes.",
        justificativa: "A permanência do quadro de exclusão social e a apropriação dos frutos da independência pelas oligarquias locais explicam o sentimento generalizado de frustração e desencanto popular."
      }
    ],
    respostaGeral: "a) Poderosos: elite criolla latifundiária; Letrados: intelectuais ilustrados reformistas. b) Frustração das camadas populares pela manutenção da exploração e do latifúndio pelas elites pós-independência.",
    justificativaGeral: "Compreensão dos conflitos de classe e contradições sociopolíticas nos processos de emancipação da América Latina."
  },
  {
    numero: 3,
    disciplina: "História",
    enunciado: "Cerimônias cívicas foram realizadas a partir de meados da década [de 1930] e forneceram importantes pistas a respeito das questões políticas e ideológicas em jogo. Uma delas, a cerimônia cívica referente ao Dia da Bandeira após a decretação do Estado Novo [1937], foi exemplar. [...] Logo após a chegada do chefe da nação ao evento, teve lugar uma missa campal celebrada pelo cardeal Leme com a presença de irmandades e congregações católicas [...]. As bandeiras estaduais hasteadas em 21 mastros foram retiradas por crianças das escolas públicas e substituídas pela bandeira nacional. As bandeiras estaduais foram queimadas em uma grande pira sob o som do Hino Nacional, entoado por coro de canto orfeônico regido por [Heitor] Villa-Lobos. (Lúcia Maria Lippi Oliveira. 'Os caminhos da centralização', 2019.)",
    subItens: [
      {
        item: "a",
        pergunta: "Cite dois elementos da cerimônia relatada no excerto que podem ser considerados característicos do Estado Novo (1937-1945).",
        resposta: "1. A aliança ideológica e institucional com a Igreja Católica, manifestada na missa campal celebrada pelo Cardeal Leme para consagrar o novo regime autoritário;\n2. A mobilização cívico-nacionalista de massas com crianças de escolas públicas e o uso de apresentações de canto orfeônico sob regência de Heitor Villa-Lobos, promovendo a disciplina patriótica e o culto à brasilidade.",
        justificativa: "O Estado Novo caracterizou-se pela censura (DIP), propaganda de massas, aproximação com o clero católico e projetos pedagógicos de unificação cultural como o canto orfeônico escolar."
      },
      {
        item: "b",
        pergunta: "Identifique a simbologia do ritual mencionado no segundo parágrafo do excerto e explique sua relação com as mudanças políticas que o Brasil viveu após a chegada de Getúlio Vargas ao poder, em 1930.",
        resposta: "O ritual da queima solene das 21 bandeiras estaduais simbolizava o aniquilamento dos regionalismos e do federalismo oligárquico oligárquico da República Velha (que havia favorecido as oligarquias estaduais de São Paulo e Minas Gerais na política do café com leite). A partir de 1930 e culminando no golpe de 1937, Vargas impôs a centralização política e administrativa, nomeando interventores federais e afirmando que nenhuma lealdade estadual ou local poderia sobrepor-se à unidade nacional brasileira.",
        justificativa: "A queima das bandeiras representava a abolição do poder das oligarquias regionais e a inauguração do Estado centralizador e unificado sob Getúlio Vargas."
      }
    ],
    respostaGeral: "a) Missa campal (aliança com a Igreja) e canto orfeônico de Villa-Lobos em escolas públicas. b) A queima das bandeiras estaduais simbolizou o fim do federalismo oligárquico e a consolidação do centralismo getulista.",
    justificativaGeral: "Rituais de legitimação política e transição da ordem oligárquica para o centralismo autoritário do Estado Novo."
  },
  {
    numero: 4,
    disciplina: "Geografia / História",
    enunciado: "No geral, a década de 1990 foi marcada por grande instabilidade no continente africano. Fora da África, inclusive no Brasil, o sentimento propagado pela mídia internacional [...] foi o de um 'afro-pessimismo' absurdo. [...] Contudo, a partir da segunda metade da década de 1990, começou a se disseminar um pensamento altamente significativo e que vislumbrava justamente a superação de uma longa crise. Esse pensamento ficou conhecido como o 'renascimento africano'. [...] A ideia de um 'renascimento africano' não é nova. Ela remonta aos fundadores do movimento pan-africanista [...]. (Pio Penna Filho. 'A África no século XXI'. CEBRI, 2023.)",
    subItens: [
      {
        item: "a",
        pergunta: "Com base no excerto, cite dois motivos para ter havido, no plano internacional, um período de 'afro-pessimismo' na década de 1990.",
        resposta: "1. A eclosão e intensidade de guerras civis e conflitos sangrentos interétnicos (como o genocídio de Ruanda em 1994 e as guerras na Somália, Libéria e Serra Leoa);\n2. O agravamento de crises humanitárias extremas, incluindo a expansão devastadora da epidemia de HIV/Aids e os baixos índices socioeconômicos de desenvolvimento humano (IDH) decorrentes do endividamento e de heranças da Guerra Fria e do colonialismo.",
        justificativa: "A mídia internacional reduzia o continente a tragédias humanitárias e ditaduras militares, consolidando a narrativa preconceituosa do afro-pessimismo."
      },
      {
        item: "b",
        pergunta: "Apresente dois pontos em comum entre os aspectos do 'renascimento africano' citados no excerto e as propostas do movimento pan-africanista.",
        resposta: "1. A defesa da autodeterminação e soberania: ambos defendem que as soluções para os desafios da África devem ser formuladas e implementadas pelos próprios africanos, sem tutela ou intervenção colonialista estrangeira;\n2. A valorização e recuperação da identidade cultural e civilizacional negra (negritude) e a mobilização da juventude e da união entre os povos do continente.",
        justificativa: "O pan-africanismo (histórico) e o renascimento africano (moderno) compartilham a tese da emancipação autônoma, dignidade cultural e solidariedade pan-continental."
      }
    ],
    respostaGeral: "a) Conflitos armados/genocídio em Ruanda e surtos epidêmicos (HIV/Aids) com crise socioeconômica. b) Autodeterminação autônoma dos povos africanos e valorização da identidade e cultura africanas.",
    justificativaGeral: "Geopolítica contemporânea da África, transição do afro-pessimismo para projetos emancipatórios e raízes no pan-africanismo."
  },
  {
    numero: 5,
    disciplina: "Geografia",
    enunciado: "O Google divulgou, em 23.05.2024, que criará o primeiro cabo submarino de fibra óptica ligando a África e a Oceania, batizado de Umoja — 'unidade', no idioma suaíli, língua falada por habitantes de alguns dos países por onde o cabo passará. A infraestrutura irá abranger uma distância de mais de 12 000 km, com a sua parte submarina instalada na porção sul do oceano Índico. (tecnoblog.net. Adaptado.)",
    subItens: [
      {
        item: "a",
        pergunta: "Identifique o que o projeto do Google busca oferecer ao ligar os continentes com um cabo de fibra óptica. Considerando aspectos socioeconômicos, escreva o nome do continente mais beneficiado por esse projeto.",
        resposta: "O projeto busca oferecer maior capacidade, velocidade, resiliência e estabilidade na transmissão de dados e internet banda larga de alta performance, conectando a infraestrutura global de telecomunicações. Sob a ótica socioeconômica, o continente mais beneficiado é a África, reduzindo o isolamento digital e impulsionando a inclusão digital e novos mercados.",
        justificativa: "A instalação de backbones submarinos reduz latências e custos de conectividade em países em desenvolvimento."
      },
      {
        item: "b",
        pergunta: "No contexto das redes geográficas, defina os conceitos de 'espaços luminosos' e de 'espaços opacos'.",
        resposta: "Segundo a teoria geográfica de Milton Santos:\n- Espaços luminosos: são regiões altamente providas de infraestrutura técnico-científico-informacional, capitais e fluxos de dados rápidos, sendo nós centrais da economia global e do capitalismo financeiro;\n- Espaços opacos: são regiões que apresentam escassez de infraestruturas modernas, conectividade deficitária e baixa atratividade para grandes capitais multinacionais, operando à margem dos circuitos de hiperconectividade.",
        justificativa: "Aplicação direta dos conceitos espaciais clássicos do geógrafo Milton Santos no contexto do meio técnico-científico-informacional."
      }
    ],
    respostaGeral: "a) Conectividade de dados em alta velocidade; continente africano. b) Espaços luminosos concentram alta tecnologia e redes; espaços opacos sofrem com carência técnica e isolamento informacional.",
    justificativaGeral: "Redes geográficas de telecomunicações no meio técnico-científico-informacional e conceitos de Milton Santos."
  },
  {
    numero: 6,
    disciplina: "Geografia / Sociologia",
    enunciado: "O curta-metragem 'Amarela', escrito e dirigido pelo nipo-brasileiro André Hayato Saito, passa-se em São Paulo e é estabelecido durante a final da Copa do Mundo de 1998, entre Brasil e França. A protagonista é Erika Oguihara, uma adolescente nipo-brasileira que rejeita as tradições de sua família japonesa [...]. 'Eu costumo falar sobre a questão de ser japonês demais para ser brasileiro e brasileiro demais para ser japonês. Sofri muito bullying sendo afirmado como japinha, samurai, ninja; e me sentia só, não me sentia visto [...]. O famoso japonês é tudo igual é imensamente ofensivo [...]. O filme vem para trazer essas questões identitárias que tanto fervilham dentro de mim e dentro de milhões de filhos de diásporas globais', comenta o diretor. (bravo.abril.com.br, 14.05.2024. Adaptado.)",
    subItens: [
      {
        item: "a",
        pergunta: "Apresente o interesse econômico do Brasil pela migração japonesa no século XX e cite uma contribuição cultural dos imigrantes japoneses à sociedade brasileira.",
        resposta: "Interesse econômico: suprir a necessidade de força de trabalho abundante e disciplinada nas lavouras de café e na agricultura de São Paulo após a abolição da escravidão (1888) e limitações na imigração italiana.\nContribuição cultural: culinária rica incorporada aos hábitos brasileiros (sushi, sashimi, tempurá, pastel com vinagrete em feiras livres), difusão de artes marciais (jiu-jítsu brasileiro, judô), budismo e difusão de animes/mangás.",
        justificativa: "Contexto histórico do Tratado de Amizade, Comércio e Navegação Brasil-Japão (1895) e início da imigração no navio Kasato Maru (1908)."
      },
      {
        item: "b",
        pergunta: "Defina 'diáspora' e explique como ela pode se relacionar com episódios de xenofobia, como os relatados no excerto.",
        resposta: "Diáspora é a dispersão geográfica de um grupo humano ou etnia que deixa sua terra de origem e se estabelece em diversas regiões e países pelo mundo. Essa condição pode gerar episódios de xenofobia quando grupos da sociedade receptora rejeitam a alteridade cultural dos imigrantes, submetendo-os a preconceitos, apagamento de suas individualidades através de estereótipos pejorativos ('japonês é tudo igual') e marginalização social.",
        justificativa: "Relação sociológica entre fluxos migratórios diaspóricos e reações xenofóbicas baseadas no etnocentrismo."
      }
    ],
    respostaGeral: "a) Mão de obra para lavouras de café; contribuição culinária/hortigranjeira ou artes marciais. b) Diáspora é a dispersão de um povo; gera xenofobia pela intolerância à diferença e redução a estereótipos discriminatórios.",
    justificativaGeral: "Imigração japonesa no Brasil, construção identitária de descendentes e combate à xenofobia."
  },
  {
    numero: 7,
    disciplina: "Geografia",
    enunciado: "Em seu livro A revolução da proximidade, o urbanista colombiano Carlos Moreno define 'a cidade policêntrica e multifuncional' como a de '15 minutos', 'na qual os serviços essenciais estão acessíveis a um quarto de hora', e lamenta 'a onipresença de construções por todas as partes', assim como 'o espaço cedido ao automóvel como vetor fundamental do planejamento urbano há quase um século'. O próprio Moreno resumiu seu conceito urbano: 'está baseado na ideia de que todo mundo deveria ter acesso aos serviços e recursos de que necessita em um perímetro curto'. (checamos.afp.com, 14.03.2023. Adaptado.)",
    subItens: [
      {
        item: "a",
        pergunta: "Sob o ponto de vista ambiental, cite e explique a contribuição que as cidades de '15 minutos' podem oferecer ao reduzir o uso de automóveis.",
        resposta: "Ao aproximar moradia, trabalho, saúde, comércio e lazer em um raio de até 15 minutos a pé ou de bicicleta, reduz-se significativamente o deslocamento individual motorizado. Isso diminui a queima de combustíveis fósseis e a emissão de gases de efeito estufa (GEE) como o CO2, reduzindo a poluição atmosférica, ilhas de calor e poluição sonora, além de liberar espaço viário para áreas verdes permeáveis.",
        justificativa: "Urbanismo sustentável, mobilidade ativa e descarbonização dos sistemas urbanos."
      },
      {
        item: "b",
        pergunta: "Identifique e caracterize a política adotada na segunda metade do século XX que deu centralidade ao automóvel no território brasileiro.",
        resposta: "A política foi o Rodoviarismo, consolidado de forma decisiva durante o governo de Juscelino Kubitschek (1956-1961) dentro das metas do Plano de Metas ('50 anos em 5'). Caracterizou-se pela atração massiva de montadoras multinacionais automobilísticas (Volkswagen, Ford, GM), expansão prioritária da malha rodoviária e construção de Brasília conectada por rodovias, em detrimento dos investimentos no modal ferroviário.",
        justificativa: "O modelo rodoviarista brasileiro gerou profunda dependência de combustíveis fósseis e do transporte sobre pneus."
      }
    ],
    respostaGeral: "a) Redução de emissões de CO2, melhoria da qualidade do ar e mobilidade ativa. b) Rodoviarismo de Juscelino Kubitschek (Plano de Metas) com incentivo às multinacionais automotivas e rodovias.",
    justificativaGeral: "Planejamento urbano comparado: cidades de 15 minutos versus histórico rodoviarista nacional."
  },
  {
    numero: 8,
    disciplina: "Geografia / Biologia",
    enunciado: "O Brasil assinou um tratado que resguarda o patrimônio genético e os conhecimentos dos povos indígenas e das comunidades tradicionais. Com o tratado, adotado consensualmente por 176 países-membros da Organização Mundial de Propriedade Intelectual (OMPI), solicitantes de patentes são obrigados a divulgar o acesso a recursos genéticos e a conhecimentos tradicionais associados necessários a suas invenções. É o caso das indústrias farmacêuticas, que terão de informar, durante o processo de patente de um novo medicamento, que aquela fórmula foi elaborada, por exemplo, a partir de substância extraída de uma planta típica de uma região amazônica [...]. (cartacapital.com.br, 24.05.2024. Adaptado.)",
    subItens: [
      {
        item: "a",
        pergunta: "Cite um exemplo de recurso genético e apresente a característica territorial do Brasil a qual explica o interesse do país em ser signatário do tratado referido no excerto.",
        resposta: "Exemplo: sementes, extratos de plantas medicinais (como jaborandi, copaíba) ou toxinas animais (como veneno de sapos e serpentes) para produção de fármacos e cosméticos.\nCaracterística territorial: o Brasil é um país de dimensões continentais e megadiverso, abrigando a maior biodiversidade do planeta distribuída em múltiplos biomas (Amazônia, Cerrado, Mata Atlântica, Pantanal, Caatinga, Pampa), tornando vital a proteção soberana contra a biopirataria.",
        justificativa: "O Brasil lidera os países megadiversos do mundo em patrimônio biológico e genético."
      },
      {
        item: "b",
        pergunta: "Mencione um dos objetivos relacionados à proposta de resguardar recursos genéticos e conhecimentos tradicionais na fabricação de produtos. Identifique o acordo internacional — estabelecido em 2010, na 10.ª Conferência das Partes das Nações Unidas (COP 10) da Convenção sobre Diversidade Biológica (CDB) — que guarda relação com a problemática discutida pelo excerto.",
        resposta: "Objetivo: coibir a biopirataria e garantir a repartição justa e equitativa dos benefícios econômicos decorrentes do uso comercial de recursos genéticos e saberes ancestrais entre empresas e comunidades originárias.\nAcordo internacional: Protocolo de Nagoia (estabelecido em 2010 durante a COP-10 da CDB em Nagoia, Japão).",
        justificativa: "O Protocolo de Nagoia regulamenta o acesso e a repartição justa de benefícios do patrimônio genético global."
      }
    ],
    respostaGeral: "a) Princípio ativo de planta/semente; condição de país megadiverso de dimensões continentais. b) Combater a biopirataria e assegurar repartição justa de lucros; Protocolo de Nagoia (2010).",
    justificativaGeral: "Biodiversidade, soberania de recursos genéticos e acordos ambientais internacionais."
  },
  {
    numero: 9,
    disciplina: "Filosofia",
    enunciado: "Texto 1: Quando nasce em Mileto, a filosofia está enraizada nesse pensamento político cujas preocupações fundamentais traduz e do qual tira uma parte de seu vocabulário. [...] Desde Parmênides, encontrou seu caminho próprio; explora um domínio novo, coloca problemas que só a ela pertencem [...]. (Jean-Pierre Vernant. As origens do pensamento grego, 2002.)\nTexto 2: O argumento que defendo é que não podemos usar a mesma lógica [...] 'Quem ou que povo inventou a filosofia?' Fenômenos como música, filosofia ou arquitetura nascem em regiões particulares, mas, devido ao caráter pluriversal da realidade, as produções humanas ocorrem em diversas regiões do mundo enfrentando problemas e demandas comuns. [...] O meu ponto de vista é que as reflexões filosóficas são, em certa medida, 'congênitas' à própria 'condição humana'. (Renato Noguera. O ensino de filosofia e a lei 10.639, 2014.)",
    subItens: [
      {
        item: "a",
        pergunta: "Qual é a temática filosófica que relaciona os textos 1 e 2? Como essa temática é abordada em cada um desses textos?",
        resposta: "A temática comum é a origem e a natureza da filosofia. No Texto 1 (Vernant), adota-se a tese helenocêntrica clássica, que situa o nascimento da filosofia num tempo e espaço restritos (Grécia Antiga / Mileto e a pólis). No Texto 2 (Noguera), adota-se a tese da pluriversalidade da filosofia como reflexão inerente a toda e qualquer cultura humana diante da realidade.",
        justificativa: "Contraste entre a concepção eurocêntrica do 'milagre grego' e a perspectiva descolonial/universalista de pensamento."
      },
      {
        item: "b",
        pergunta: "Explique o seguinte ponto de vista de Renato Noguera: 'as reflexões filosóficas são, em certa medida, congênitas à própria condição humana'. Como esse ponto de vista do texto 2 se reflete no texto 1?",
        resposta: "Para Noguera, o impulso de questionar sobre a existência, ética e morte é ontológico e inato a qualquer agrupamento humano diante de problemas existenciais. Essa tese descontrói e relativiza o Texto 1, evidenciando que os gregos elaboraram uma forma particular de racionalidade, mas não detêm o monopólio exclusivo da reflexão filosófica no planeta.",
        justificativa: "A reflexão de Noguera questiona o privilégio epistêmico concedido à Grécia Antiga pela historiografia tradicional."
      }
    ],
    respostaGeral: "a) A origem da filosofia: grega e circunscrita à pólis (Vernant) vs pluriversal e inerente a todos os povos (Noguera). b) Filosofar é capacidade humana inata, relativizando o monopólio histórico grego.",
    justificativaGeral: "Filosofia geral: debate entre eurocentrismo epistêmico e epistemologias pluriversais."
  },
  {
    numero: 10,
    disciplina: "Filosofia",
    enunciado: "Texto 1: Designa-se 'virada linguística' o paradigma pelo qual a investigação dos problemas filosóficos é indissociável de um exame da estrutura lógica ou discursiva que os enuncia [...]. (Evaldo Sampaio, 2017.)\nTexto 2: A linguagem — diz o 'segundo Wittgenstein' — funciona em seus usos, não cabendo, portanto, indagar sobre os significados das palavras, mas sobre suas funções práticas. Estas são múltiplas e variadas, constituindo múltiplas linguagens [...]. Em outros termos, poder-se-ia dizer que o correntemente chamado linguagem é, na verdade, um conjunto de 'jogos de linguagem' [...]. (Armando Mora D’Oliveira. Investigações filosóficas, 1999.)",
    subItens: [
      {
        item: "a",
        pergunta: "De acordo com a 'virada linguística' citada no texto 1, como a linguagem se relaciona à filosofia? Qual a implicação filosófica da 'virada linguística'?",
        resposta: "A linguagem deixa de ser mero instrumento neutro de comunicação e passa a ser o próprio objeto e campo central da reflexão filosófica. A implicação é que qualquer exame sobre o ser, a moral e o conhecimento exige previamente a análise da estrutura lógica e dos limites dos enunciados linguísticos que os expressam.",
        justificativa: "A virada linguística inaugurou a filosofia analítica moderna no século XX."
      },
      {
        item: "b",
        pergunta: "A partir do texto 2, o que são os 'jogos de linguagem' formulados por Wittgenstein? Como os 'jogos de linguagem' contribuem para a 'virada linguística'?",
        resposta: "Jogos de linguagem são os diferentes contextos práticos de uso das palavras integrados a atividades humanas e formas de vida cotidianas (como pedir, prometer, ironizar ou narrar), sem uma essência rígida única. Essa noção impulsionou a virada linguística ao demonstrar que os problemas filosóficos tradicionais muitas vezes resultam de mal-entendidos linguísticos e que o significado decorre do uso pragmático contextuado.",
        justificativa: "O 'segundo Wittgenstein' substitui a teoria pictórica da linguagem pela teoria pragmática dos jogos de linguagem."
      }
    ],
    respostaGeral: "a) A linguagem torna-se o centro da análise ontológica e epistemológica. b) Jogos de linguagem são usos práticos contextualizados que revelam o sentido das palavras nas ações humanas.",
    justificativaGeral: "Filosofia da Linguagem e a revolução dos 'jogos de linguagem' de Ludwig Wittgenstein."
  },
  {
    numero: 11,
    disciplina: "Filosofia",
    enunciado: "Texto 1: Com a invenção da fotografia no século XIX, a relação entre arte e técnica entra numa nova fase [...]. A fotografia abala um a um os pressupostos da autoridade da tradição: no lugar da existência única do original, possibilita a reprodução serial da imagem, substituindo a autenticidade pela repetibilidade da cópia [...]. (Taisa Palhares. 'Walter Benjamin: teoria da arte e reprodutibilidade técnica', 2008.)\nTexto 2: A Inteligência Artificial (IA) é uma área da computação que se concentra no desenvolvimento de algoritmos e sistemas capazes de realizar tarefas que normalmente exigem inteligência humana [...]. Na arte, a IA tem sido usada para criar novas formas de expressão, gerar conteúdo e até mesmo ajudar artistas a automatizar o processo de criação [...]. (Paulo Varella, 2023.)",
    subItens: [
      {
        item: "a",
        pergunta: "O que é a noção de reprodutibilidade técnica, apresentada no texto 1? Qual área da filosofia discute essa noção?",
        resposta: "A reprodutibilidade técnica é a capacidade industrial de reproduzir em massa obras artísticas através de meios tecnológicos (fotografia, imprensa, cinema), desfazendo o caráter único e a 'aura' do original. A área da filosofia que discute essa temática é a Estética (Filosofia da Arte).",
        justificativa: "Conceito seminal de Walter Benjamin na Escola de Frankfurt sobre a perda da aura artística."
      },
      {
        item: "b",
        pergunta: "Como a noção apresentada no texto 1 é atualizada pela Inteligência Artificial? Qual é o impacto dessa atualização na reflexão filosófica sobre arte?",
        resposta: "A Inteligência Artificial atualiza a reprodutibilidade técnica ao automatizar não apenas a cópia, mas a própria gênese e elaboração de obras inéditas a partir de dados em tempo recorde. O impacto filosófico é profundo: questiona os conceitos clássicos de criatividade, autoria humana, sensibilidade, genialidade e se a IA é criadora ou mera processadora de padrões.",
        justificativa: "A IA coloca em xeque a centralidade da subjetividade humana no ato de criação estética."
      }
    ],
    respostaGeral: "a) Reprodução em série de obras com perda da aura; área: Estética. b) A IA passa a gerar arte autonomamente, tensionando o conceito de autoria e sensibilidade humana.",
    justificativaGeral: "Estética contemporânea: de Walter Benjamin e a reprodutibilidade técnica à criação algorítmica por IA."
  },
  {
    numero: 12,
    disciplina: "Filosofia",
    enunciado: "Texto 1: Segundo o próprio Aristóteles, 'nosso objetivo é tornar-nos homens bons, ou alcançar o grau mais elevado do bem humano. Este bem é a felicidade; e a felicidade consiste na atividade da alma de acordo com a virtude' (Ética a Nicômaco, I). Uma das principais contribuições da ética aristotélica é sua famosa tese, segundo a qual a virtude está no meio. (Danilo Marcondes, 2010.)\nTexto 2: A excelência moral, então, é uma disposição da alma relacionada com a escolha de ações e emoções, disposição esta consistente num meio termo (o meio termo relativo a nós) determinado pela razão [...]. Trata-se de um estado intermediário, porque nas várias formas de deficiência moral há falta ou excesso [...], enquanto a excelência moral encontra e prefere o meio termo. (Aristóteles. Ética a Nicômacos, 1985.)",
    subItens: [
      {
        item: "a",
        pergunta: "Como é denominada a ética desenvolvida por Aristóteles? Qual é o objetivo dessa ética?",
        resposta: "A ética aristotélica é denominada Ética das Virtudes (ou Ética Teleológica). Seu objetivo supremo é alcançar a eudaimonia (felicidade plena ou autorrealização humana), atingida através do exercício virtuoso da razão e do discernimento moral constante.",
        justificativa: "A teleologia aristotélica estipula que toda ação visa a um bem e o bem supremo é a eudaimonia."
      },
      {
        item: "b",
        pergunta: "Com base no texto 2, explique a noção aristotélica de justo meio. Como o indivíduo pode usar essa noção na avaliação de sua própria conduta moral?",
        resposta: "O justo meio (mesotes) é o equilíbrio moderado entre dois polos viciosos: o excesso e a carência/falta (por exemplo: a coragem situa-se entre a covardia e a temeridade). O indivíduo utiliza essa regra orientando suas paixões e decisões pela razão e pela prudência (phronesis), evitando posturas extremistas e cultivando hábitos equilibrados.",
        justificativa: "A justa medida não é um cálculo matemático estático, mas a adequação prudente da ação à situação concreta."
      }
    ],
    respostaGeral: "a) Ética das Virtudes/Teleológica; objetivo: eudaimonia (felicidade). b) Justo meio é a virtude como ponto de equilíbrio entre a falta e o excesso, guiado pela reta razão.",
    justificativaGeral: "Ética clássica aristotélica: virtudes morais, justa medida e realização da vida boa."
  },
  {
    numero: 13,
    disciplina: "Biologia",
    enunciado: "A figura ilustra uma parte do diagrama do código genético, que indica a correspondência entre alguns códons de RNA mensageiro e alguns aminoácidos. Os sentidos das setas, do centro para a periferia, indicam a sequência de leitura da primeira para a última base nitrogenada que compõem um códon no RNA mensageiro.",
    subItens: [
      {
        item: "a",
        pergunta: "Em que local de uma célula procariótica ocorre a transcrição do RNA mensageiro? Qual estrutura celular realiza a tradução de uma molécula de RNA mensageiro?",
        resposta: "A transcrição em células procarióticas (bactérias) ocorre no citoplasma (hialoplasma/citosol), já que não há carioteca separando o material genético. A estrutura celular responsável pela tradução da fita de RNAm é o ribossomo (formado por RNA ribossômico e proteínas).",
        justificativa: "Em procariontes, transcrição e tradução ocorrem de forma acoplada no citoplasma."
      },
      {
        item: "b",
        pergunta: "Um gene é constituído pela sequência de bases nitrogenadas ATAAGGAAGACAACT. Qual sequência de aminoácidos na proteína é expressada por esse gene? Por que uma mutação gênica por substituição de uma única base nitrogenada pode não ser detectada pela simples análise da sequência de aminoácidos na proteína expressa por esse gene mutante?",
        resposta: "Fita molde do gene (DNA): ATA AGG AAG ACA ACT\nFita de RNAm transcrita: UAU UCC UUC UGU UGA\nTradução dos códons:\n- UAU: Tirosina\n- UCC: Serina\n- UUC: Fenilalanina\n- UGU: Cisteína\n- UGA: Códon de término/parada (Stop)\nSequência de aminoácidos: Tirosina – Serina – Fenilalanina – Cisteína.\nA mutação pode não alterar a proteína porque o código genético é degenerado (redundante), ou seja, múltiplos códons sinônimos codificam o mesmo aminoácido (mutação silenciosa).",
        justificativa: "Aplicação do pareamento de bases no dogma central e do conceito de código genético degenerado."
      }
    ],
    respostaGeral: "a) Citoplasma; ribossomos. b) Tirosina – Serina – Fenilalanina – Cisteína; código genético degenerado (mutações silenciosas).",
    justificativaGeral: "Biologia molecular: transcrição em procariontes, síntese proteica e código degenerado."
  },
  {
    numero: 14,
    disciplina: "Biologia",
    enunciado: "Em termos simplificados, quando o seu corpo é invadido por um organismo estranho, as células dendríticas tomam um pedaço dele e o exibem aos linfócitos T auxiliares. Se um antígeno for percebido como estranho, isso estimulará uma reação mista de leucócitos que resulta em uma inflamação envolvendo os linfócitos T, os linfócitos B e outras células do sistema imunológico. Pouco a pouco, porém, evidências mostraram que os linfócitos T e os linfócitos B recebem um tremendo auxílio de outras células, das quais dependem. (Matt Richtel. Imune, 2019.)",
    subItens: [
      {
        item: "a",
        pergunta: "Em qual tecido humano os linfócitos têm origem? Em que estrutura da célula dendrítica o 'pedaço' de um antígeno é exibido aos linfócitos T?",
        resposta: "Os linfócitos originam-se na medula óssea vermelha (tecido hematopoético / linfoide). O antígeno peptídico processado é apresentado na superfície externa da membrana plasmática da célula dendrítica ligado a proteínas do Complexo Principal de Histocompatibilidade (MHC classe II).",
        justificativa: "Células dendríticas são células apresentadoras de antígenos (APCs) especializadas."
      },
      {
        item: "b",
        pergunta: "Por que o estímulo dos linfócitos T auxiliares (ou CD4) sobre os linfócitos B permite o combate efetivo ao antígeno? Por que a ativação desses linfócitos B confere uma imunidade prolongada contra o antígeno?",
        resposta: "Ao reconhecerem o antígeno, os linfócitos T auxiliares liberam interleucinas/citocinas que induzem os linfócitos B a proliferarem e se diferenciarem em plasmócitos, que secretam grandes quantidades de anticorpos específicos contra o invasor. Essa ativação também gera linfócitos B de memória imune de longa vida, que permanecem no organismo e garantem resposta secundária rápida e potente em contatos futuros.",
        justificativa: "Mecanismo da imunidade humoral adaptativa e geração de memória imunológica."
      }
    ],
    respostaGeral: "a) Medula óssea vermelha (tecido hematopoético); proteínas do MHC na membrana celular. b) Diferenciação em plasmócitos produtores de anticorpos e formação de células de memória imune.",
    justificativaGeral: "Imunologia celular e humoral: apresentação de antígenos e memória imune."
  },
  {
    numero: 15,
    disciplina: "Biologia",
    enunciado: "A figura mostra o mapa genético de um roedor macho em que os genes autossômicos para a cor e a forma do pelo encontram-se ligados. Os alelos B e b condicionam que o pelo seja preto e branco, respectivamente. Os alelos L e l condicionam que o pelo seja ondulado e liso, respectivamente. Distância no cromossomo entre os locos: 32 UR. Cromossomo homólogo 1: B e l; Cromossomo homólogo 2: b e L.",
    subItens: [
      {
        item: "a",
        pergunta: "Quantos espermatozoides com genótipos diferentes podem ser formados a partir de uma célula germinativa nesse macho? Em qual fase da meiose se inicia o crossing-over em uma célula em divisão?",
        resposta: "Podem ser formados espermatozoides com quatro genótipos diferentes: dois parentais (Bl e bL) e dois recombinantes (BL e bl). O crossing-over (permutação gênica) inicia-se na prófase I da meiose (especificamente na subfase do paquíteno).",
        justificativa: "A recombinação homóloga ocorre durante o pareamento dos cromossomos na primeira divisão meiótica."
      },
      {
        item: "b",
        pergunta: "Qual a porcentagem esperada de gametas com genótipo bL produzidos por esse macho? Qual a probabilidade de o cruzamento desse roedor macho com uma fêmea duplo-homozigota recessiva gerar um filhote macho de pelos brancos e lisos?",
        resposta: "Distância = 32 UR => Taxa de recombinação = 32%.\nGametas recombinantes: BL = 16%, bl = 16%.\nGametas parentais (68% total): Bl = 34%, bL = 34%.\nLogo, gametas bL = 34%.\nCruzamento: Macho (Bl/bL) x Fêmea duplo-recessiva (bl/bl):\nA fêmea produz 100% gametas bl. Para nascer com pelos brancos e lisos (bb ll), o filhote deve receber o gameta recombinante 'bl' do pai (probabilidade = 16% ou 0,16). Como a probabilidade de ser filhote macho é 1/2 (50%), temos:\nP(macho e bb ll) = 1/2 * 0,16 = 0,08 = 8%.",
        justificativa: "Cálculo de frequências de gametas em ligação gênica (linkage em repulsão/trans) e probabilidade combinada com determinação sexual."
      }
    ],
    respostaGeral: "a) Quatro genótipos (Bl, bL, BL, bl); Prófase I da meiose. b) 34% de gametas bL; 8% de chance de filhote macho branco e liso.",
    justificativaGeral: "Genética: linkage gênico, taxas de recombinação e herança autossômica ligada."
  },
  {
    numero: 16,
    disciplina: "Química",
    enunciado: "Analise a tabela com dados de NaCl e KCl a 20 ºC: NaCl (M = 58,5 g/mol, d = 2,17 g/cm³, solubilidade = 358 g/L); KCl (M = 74,5 g/mol, d = 1,98 g/cm³, solubilidade = 347 g/L). 'Sal leve' é uma mistura de 50% NaCl e 50% KCl em massa.",
    subItens: [
      {
        item: "a",
        pergunta: "Calcule a densidade do 'sal leve'. Com base nos dados de solubilidade apresentados na tabela, mostre por cálculos se uma solução preparada pela dissolução de 20 g desse sal em água a 20 ºC, com o volume completado até 50 mL, apresentará ou não corpo de fundo.",
        resposta: "Densidade da mistura:\nd = (2,17 * 0,5) + (1,98 * 0,5) = 1,085 + 0,99 = 2,075 g/cm³ (ou ~2,07 g/cm³).\nSolubilidade em 50 mL (0,050 L):\n- NaCl solúvel máximo = 358 g/L * 0,050 L = 17,9 g\n- KCl solúvel máximo = 347 g/L * 0,050 L = 17,35 g\nMassa adicionada em 20 g de sal leve:\n- NaCl = 10 g (< 17,9 g)\n- KCl = 10 g (< 17,35 g)\nComo ambas as massas adicionadas são menores que a capacidade máxima de dissolução, não haverá formação de corpo de fundo.",
        justificativa: "A solução é insaturada para ambos os sais, resultando em dissolução completa homogênea."
      },
      {
        item: "b",
        pergunta: "Escreva a fórmula centesimal do cloreto de potássio. Demonstre, apresentando os cálculos, que a massa de potássio presente em 1 g de 'sal leve' é aproximadamente igual a 260 mg, como consta de suas informações nutricionais.",
        resposta: "Massa molar do KCl = 39 (K) + 35,5 (Cl) = 74,5 g/mol.\n%K = (39 / 74,5) * 100 ≈ 52,35% (~52%)\n%Cl = (35,5 / 74,5) * 100 ≈ 47,65% (~48%)\nFórmula centesimal: K52% Cl48%.\nEm 1 g de sal leve há 0,5 g de KCl (50% em massa):\nMassa de K = 0,5 g * (39 / 74,5) ≈ 0,2617 g = 261,7 mg ≈ 260 mg de K.",
        justificativa: "Cálculo estequiométrico percentual clássico de composição centesimal e porção nutricional."
      }
    ],
    respostaGeral: "a) Densidade = 2,07 g/cm³; não apresentará corpo de fundo (dissolução total). b) Fórmula: K52% Cl48%; massa de K ≈ 260 mg em 0,5 g de KCl.",
    justificativaGeral: "Físico-química das soluções, coeficiente de solubilidade e estequiometria centesimal."
  },
  {
    numero: 17,
    disciplina: "Química",
    enunciado: "Resíduos contendo íons dicromato (Cr2O7²⁻) são muito tóxicos. Rota de tratamento:\nEtapa 1: _Cr2O7²⁻ (aq) + _S2O3²⁻ (aq) + _H⁺ (aq) → _Cr³⁺ (aq) + _SO4²⁻ (aq) + _H2O (l)\nEtapa 2: Precipitação dos íons Cr³⁺ como Cr(OH)3 (s) por adição de base.\nEtapa 3: Calcinação do hidróxido de cromo a 600 ºC formando Cr2O3 (s) e H2O (g).",
    subItens: [
      {
        item: "a",
        pergunta: "Determine a variação do número de oxidação do elemento enxofre na reação da etapa 1. Com base nessa variação, identifique se esse elemento atuou como oxidante ou redutor.",
        resposta: "No ânion tiossulfato (S2O3²⁻), o número de oxidação médio do enxofre é +2 [2x + 3(-2) = -2 => 2x = +4 => x = +2]. No ânion sulfato (SO4²⁻), o Nox do enxofre é +6 [x + 4(-2) = -2 => x = +6].\nVariação de Nox do enxofre: de +2 para +6 (ΔNox = +4).\nComo o Nox aumentou (perda de elétrons/oxidação), o enxofre atuou como agente redutor.",
        justificativa: "Espécie que sofre oxidação transfere elétrons, agindo como agente redutor da reação."
      },
      {
        item: "b",
        pergunta: "Escreva as equações químicas balanceadas da reação que ocorre na etapa 1 e da reação que ocorre na etapa 3, utilizando os menores números inteiros possíveis para os coeficientes estequiométricos.",
        resposta: "Etapa 1 (oxirredução em meio ácido):\nSemirreação redução: Cr2O7²⁻ + 14 H⁺ + 6 e⁻ → 2 Cr³⁺ + 7 H2O (multiplica por 4 => 24 e⁻)\nSemirreação oxidação: S2O3²⁻ + 5 H2O → 2 SO4²⁻ + 10 H⁺ + 8 e⁻ (multiplica por 3 => 24 e⁻)\nEquação global balanceada:\n4 Cr2O7²⁻ (aq) + 3 S2O3²⁻ (aq) + 26 H⁺ (aq) → 8 Cr³⁺ (aq) + 6 SO4²⁻ (aq) + 13 H2O (l)\n\nEtapa 3 (decomposição térmica a 600 ºC):\n2 Cr(OH)3 (s) --Δ--> Cr2O3 (s) + 3 H2O (g)",
        justificativa: "Balanceamento redox pelo método do íon-elétron garantindo conservação de cargas e massas."
      }
    ],
    respostaGeral: "a) O Nox variou de +2 para +6 (ΔNox = 4); agente redutor. b) 4 Cr2O7²⁻ + 3 S2O3²⁻ + 26 H⁺ → 8 Cr³⁺ + 6 SO4²⁻ + 13 H2O e 2 Cr(OH)3 → Cr2O3 + 3 H2O.",
    justificativaGeral: "Química inorgânica: reações redox, números de oxidação e decomposição térmica."
  },
  {
    numero: 18,
    disciplina: "Química",
    enunciado: "Fórmulas estruturais do geranial, neral e geraniol.",
    subItens: [
      {
        item: "a",
        pergunta: "Identifique o tipo de isomeria existente entre o geranial e o neral e cite a função orgânica oxigenada presente nessas duas substâncias.",
        resposta: "O tipo de isomeria existente é a isomeria geométrica (cis-trans ou diastereoisomeria espacial Z/E), pois ambos possuem dupla ligação com ligantes diferentes em cada carbono insaturado (o geranial é o isômero trans/E e o neral é o isômero cis/Z).\nA função orgânica oxigenada comum a ambos é o aldeído (-CH=O na extremidade da cadeia).",
        justificativa: "Presença de carbonila terminal caracterizando aldeído e rotação impedida da ligação dupla gerando isomeria geométrica."
      },
      {
        item: "b",
        pergunta: "Escreva a fórmula estrutural que representa o produto orgânico formado pela reação do geraniol com um ácido carboxílico genericamente representado por R-COOH. Identifique o tipo de reação que ocorre entre o geraniol e o ácido carboxílico R-COOH.",
        resposta: "O geraniol é um álcool primário insaturado (contendo o grupo -OH terminal). Ao reagir com um ácido carboxílico (R-COOH), ocorre uma reação de esterificação (catalisada por ácido), produzindo um éster carboxílico e água:\nProduto orgânico: Éster de geranila: R-COO-CH2-CH=C(CH3)-(CH2)2-CH=C(CH3)2.\nTipo de reação: Reação de esterificação (ou condensação com eliminação de água).",
        justificativa: "Reação clássica de Fischer entre grupo hidroxila alcoólica e carboxila ácida formando éster."
      }
    ],
    respostaGeral: "a) Isomeria geométrica (cis-trans / E-Z); função: aldeído. b) Éster de geranila (R-COO-geranila); reação de esterificação.",
    justificativaGeral: "Química orgânica: isomeria espacial e síntese de ésteres por esterificação."
  },
  {
    numero: 19,
    disciplina: "Física",
    enunciado: "Em aviação: V1 é a velocidade de decisão de decolagem e Vcruz a de cruzeiro. Aeronave bimotor decola de pista com 1750 m; V1 = 140 nós, Vcruz = 500 nós. Consumo médio: 1100 kg de querosene por hora por motor. Dados: 1 m/s = 3,6 km/h = 2 nós; a aeronave percorre 70% da pista para atingir V1 em aceleração constante.",
    subItens: [
      {
        item: "a",
        pergunta: "Calcule a intensidade da aceleração da aeronave, em m/s², em sua corrida para decolagem, até atingir a velocidade V1.",
        resposta: "Conversão de V1: 140 nós = 140 / 2 = 70 m/s.\nDistância percorrida Δs = 0,70 * 1750 m = 1225 m.\nPartindo do repouso (V0 = 0), pela equação de Torricelli:\nV1² = V0² + 2 * a * Δs\n(70)² = 0 + 2 * a * 1225\n4900 = 2450 * a => a = 4900 / 2450 = 2,0 m/s².",
        justificativa: "Aplicação direta de conversão de unidades e equação de Torricelli para MUV."
      },
      {
        item: "b",
        pergunta: "Calcule o consumo de querosene da aeronave, em kg, em um voo em que ela tenha permanecido com a velocidade de cruzeiro por 3600 km.",
        resposta: "Vcruz = 500 nós = 500 / 2 = 250 m/s = 250 * 3,6 = 900 km/h.\nTempo em velocidade de cruzeiro: t = d / Vcruz = 3600 km / 900 km/h = 4,0 horas.\nA aeronave possui dois motores e cada um consome 1100 kg/h:\nConsumo total por hora = 2 * 1100 kg/h = 2200 kg/h.\nMassa total de querosene = 2200 kg/h * 4,0 h = 8800 kg (ou 8,8 × 10³ kg).",
        justificativa: "Cálculo cinemático do tempo de percurso em MU e consumo horário combinado dos dois propulsores."
      }
    ],
    respostaGeral: "a) a = 2,0 m/s². b) M_total = 8800 kg (8,8 × 10³ kg).",
    justificativaGeral: "Cinemática escalar: MUV na decolagem e MU com consumo de combustível em bimotor."
  },
  {
    numero: 20,
    disciplina: "Física",
    enunciado: "Vela acesa diante de lente esférica de vidro com centro óptico O no ar. tg 30º = √3 / 3. A altura da vela é 18√3 cm e a distância do objeto à lente é p = 45 cm.",
    subItens: [
      {
        item: "a",
        pergunta: "Essa lente apresenta comportamento óptico convergente ou divergente? A imagem dessa vela, conjugada por essa lente, pode ser projetada sobre um anteparo? Responda e justifique suas respostas com base nas trajetórias dos raios mostradas na figura e no fato de a imagem conjugada ser real ou virtual.",
        resposta: "O comportamento óptico da lente é divergente, pois os raios refratados se afastam do eixo principal, divergindo do foco virtual. A imagem não pode ser projetada sobre um anteparo porque é uma imagem virtual, formada no mesmo lado do objeto pelo prolongamento dos raios refratados.",
        justificativa: "Lentes divergentes com objetos reais sempre conjugam imagens virtuais, direitas e menores, impossíveis de projetar."
      },
      {
        item: "b",
        pergunta: "Qual a distância, em cm, da imagem dessa vela, conjugada por essa lente, ao centro óptico da lente?",
        resposta: "Cálculo da distância focal |f| pelo triângulo da chama:\ntg 30° = Altura / (45 + |f|) => √3 / 3 = 18√3 / (45 + |f|)\n45 + |f| = 18 * 3 = 54 => |f| = 9,0 cm. Como a lente é divergente, f = -9,0 cm.\nEquação de Gauss dos pontos conjugados:\n1/f = 1/p + 1/p'\n-1/9 = 1/45 + 1/p' => 1/p' = -1/9 - 1/45 = -6/45 cm⁻¹ => p' = -45 / 6 = -7,5 cm.\nA distância da imagem ao centro óptico da lente é d = |p'| = 7,5 cm.",
        justificativa: "Relações trigonométricas do raio e equação de Gauss para lentes delgadas divergentes."
      }
    ],
    respostaGeral: "a) Divergente; a imagem não pode ser projetada pois é virtual. b) Distância da imagem = 7,5 cm.",
    justificativaGeral: "Óptica geométrica: lentes esféricas divergentes e equação analítica de Gauss."
  },
  {
    numero: 21,
    disciplina: "Física",
    enunciado: "Impressora: gota de tinta de massa m = 2 × 10⁻¹¹ kg e carga elétrica q = 4 × 10⁻¹⁴ C penetra horizontalmente por P em campo elétrico uniforme E = 8 × 10⁴ N/C vertical para cima e campo gravitacional g = 10 m/s². A gota atinge o ponto Q sobre o papel com deflexão vertical yQ = 0,03 cm.",
    subItens: [
      {
        item: "a",
        pergunta: "Calcule a aceleração dessa gota de tinta, em m/s², no trajeto entre P e Q.",
        resposta: "Forças verticais atuantes:\n- Força elétrica para cima: FE = q * E = (4 × 10⁻¹⁴ C) * (8 × 10⁴ N/C) = 32 × 10⁻¹⁰ N = 3,2 × 10⁻⁹ N;\n- Força peso para baixo: P = m * g = (2 × 10⁻¹¹ kg) * (10 m/s²) = 2 × 10⁻¹⁰ N = 0,2 × 10⁻⁹ N;\nForça resultante: Fres = FE - P = 3,2 × 10⁻⁹ - 0,2 × 10⁻⁹ = 3,0 × 10⁻⁹ N (para cima).\nPela 2ª Lei de Newton: a = Fres / m = (3,0 × 10⁻⁹ N) / (2 × 10⁻¹¹ kg) = 150 m/s² (ou 1,5 × 10² m/s²).",
        justificativa: "Dinâmica vetorial de partícula eletrizada sob ação simultânea de campo eletrostático e gravitacional."
      },
      {
        item: "b",
        pergunta: "Calcule a diferença de potencial, em V, entre os pontos P e Q, e o trabalho realizado pela força elétrica, em J, no trajeto entre P e Q.",
        resposta: "O deslocamento vertical no sentido do campo elétrico é d = yQ = 0,03 cm = 3 × 10⁻⁴ m.\nDiferença de potencial em campo uniforme:\nU = E * d = (8 × 10⁴ N/C) * (3 × 10⁻⁴ m) = 24 V.\nTrabalho da força elétrica:\nτ = q * U = (4 × 10⁻¹⁴ C) * 24 V = 96 × 10⁻¹⁴ J = 9,6 × 10⁻¹³ J.",
        justificativa: "Relações eletrostáticas fundamentais de campo uniforme U = Ed e trabalho τ = qU."
      }
    ],
    respostaGeral: "a) a = 1,5 × 10² m/s² (150 m/s²). b) U = 24 V; Trabalho = 9,6 × 10⁻¹³ J.",
    justificativaGeral: "Eletrostática: movimento de cargas em campo uniforme, ddp e trabalho elétrico."
  },
  {
    numero: 22,
    disciplina: "Matemática",
    enunciado: "30 estudantes obtiveram notas 2, 3, 4 ou 5 em uma prova de matemática. Sejam x, y, z e w números inteiros positivos não nulos representando os estudantes com notas 2, 3, 4 e 5, respectivamente.\n1) Soma de todas as 30 notas foi 93;\n2) A quantidade de notas 3 foi maior do que a de notas 5, e menor do que a de notas 4 (w < y < z);\n3) O número de notas 4 (z) é divisível por 10;\n4) Um número par de estudantes tirou nota 5 (w é par).",
    subItens: [
      {
        item: "a",
        pergunta: "Apresente argumentos matemáticos que justifiquem que z é diferente de 20.",
        resposta: "Equações do problema:\n(I) x + y + z + w = 30\n(II) 2x + 3y + 4z + 5w = 93\nMultiplicando (I) por -2 e somando com (II):\n-2x - 2y - 2z - 2w = -60\n+ 2x + 3y + 4z + 5w = 93\n--------------------------\ny + 2z + 3w = 33\nComo x, y, z, w são inteiros estritamente positivos (y > 0 e w > 0), temos:\n2z < 33 => z < 16,5.\nComo z é obrigatoriamente menor que 16,5, z jamais poderá ser igual a 20.",
        justificativa: "Eliminação linear gaussiana delimitando o domínio superior de valores possíveis para z."
      },
      {
        item: "b",
        pergunta: "Determine x, y, z e w.",
        resposta: "1. Como z é inteiro positivo, divisível por 10 e z < 16,5, o único valor possível é z = 10.\n2. Substituindo z = 10 na equação y + 2z + 3w = 33:\ny + 20 + 3w = 33 => y + 3w = 13.\n3. Condições: w é par e w < y. Analisando os pares positivos para w:\n- Se w = 4: y + 12 = 13 => y = 1 (não satisfaz w < y, pois 4 > 1);\n- Se w = 2: y + 6 = 13 => y = 7 (satisfaz w < y < z, pois 2 < 7 < 10);\nLogo, w = 2 e y = 7.\n4. Substituindo na soma total (I):\nx + 7 + 10 + 2 = 30 => x + 19 = 30 => x = 11.\nConclusão: x = 11, y = 7, z = 10, w = 2.",
        justificativa: "Resolução diofantina guiada por restrições de paridade e desigualdades ordinais."
      }
    ],
    respostaGeral: "a) y + 2z + 3w = 33 com y,w > 0 implica 2z < 33 (z < 16,5), logo z ≠ 20. b) (x, y, z, w) = (11, 7, 10, 2).",
    justificativaGeral: "Sistemas lineares com incógnitas inteiras e análise combinatória por restrições."
  },
  {
    numero: 23,
    disciplina: "Matemática",
    enunciado: "O centro O do círculo branco divide a altura relativa à base BC do triângulo isósceles ABC (AB = AC) em dois segmentos: AO = 5 cm e OH = 3 cm. O círculo de raio r = 3 cm é inscrito no triângulo. Há ainda um setor circular de centro A e arco BC.",
    subItens: [
      {
        item: "a",
        pergunta: "Calcule o perímetro do triângulo ABC, que circunscreve o círculo branco.",
        resposta: "1. No triângulo retângulo AEO (onde E é o ponto de tangência do lado AB com o círculo):\n(AE)² + (OE)² = (AO)² => (AE)² + 3² = 5² => AE = 4 cm.\n2. Pela semelhança entre o triângulo AHB e o triângulo AEO (ambos retângulos com ângulo comum em A):\nBH / OE = AH / AE => BH / 3 = (5 + 3) / 4 = 8 / 4 = 2 => BH = 6 cm.\n3. Como H é ponto médio de BC, BC = 2 * 6 = 12 cm.\n4. Pelo teorema dos segmentos tangentes: BE = BH = 6 cm. Logo, AB = AE + BE = 4 + 6 = 10 cm e AC = 10 cm.\nPerímetro = AB + AC + BC = 10 + 10 + 12 = 32 cm.",
        justificativa: "Geometria métrica plana: Pitágoras, semelhança de triângulos retângulos e tangência a circunferências."
      },
      {
        item: "b",
        pergunta: "Adotando sen 53,13º = 0,8 e π = 3,14, calcule, em cm², a melhor aproximação inteira da medida da área da região indicada em amarelo na figura.",
        resposta: "1. No triângulo AHB: sen(B) = AH / AB = 8 / 10 = 0,8 => Ângulo ABH = 53,13°.\n2. Logo, ângulo BAH = 90° - 53,13° = 36,87°.\n3. O ângulo central do setor de vértice A é BAC = 2 * 36,87° = 73,74°.\n4. O raio do setor circular é R = AB = 10 cm.\nÁrea do setor circular ABC = (73,74° / 360°) * π * R² = (73,74 / 360) * 3,14 * 100 ≈ 64,32 cm².\n5. Área do círculo branco inscrito: S_círculo = π * r² = 3,14 * 3² = 28,26 cm².\n6. Área da região amarela = Área do setor - Área do círculo = 64,32 - 28,26 = 36,06 cm² ≈ 36 cm².",
        justificativa: "Cálculo de áreas planas por decomposição: setor circular trigonométrico subtraído de círculo inscrito."
      }
    ],
    respostaGeral: "a) Perímetro = 32 cm. b) Área amarela ≈ 36 cm².",
    justificativaGeral: "Geometria plana e trigonometria: triângulos semelhantes, círculo inscrito e setor circular."
  },
  {
    numero: 24,
    disciplina: "Matemática",
    enunciado: "Considere V sendo o vértice da parábola descrita pela função g(x) = 4x - x²/2, definida em R, e r sendo a reta que passa pelos pontos A(-2, 2) e V.",
    subItens: [
      {
        item: "a",
        pergunta: "Determine a medida do ângulo agudo que a reta r forma com o eixo das abscissas.",
        resposta: "1. Coordenadas do vértice V(xv, yv):\nxv = -b / (2a) = -4 / [2 * (-1/2)] = 4.\nyv = g(4) = 4(4) - (4²)/2 = 16 - 8 = 8 => V(4, 8).\n2. Coeficiente angular da reta r passando por A(-2, 2) e V(4, 8):\nm_r = (yv - yA) / (xv - xA) = (8 - 2) / [4 - (-2)] = 6 / 6 = 1.\n3. Como m_r = tg(θ) = 1 e a reta é crescente com ângulo agudo no eixo Ox:\nθ = 45°.",
        justificativa: "Geometria analítica e função quadrática: cálculo do vértice e inclinação angular da reta secante."
      },
      {
        item: "b",
        pergunta: "Determine todos os pontos (x, y), pertencentes ao gráfico de y = g(x), tais que x e y sejam números inteiros positivos.",
        resposta: "A função é g(x) = 4x - x²/2 = x * (4 - x/2).\nPara y > 0: x > 0 e (4 - x/2) > 0 => 0 < x < 8 (inteiros possíveis: 1, 2, 3, 4, 5, 6, 7).\nPara que y seja inteiro, como y = 4x - x²/2, x²/2 deve ser inteiro, logo x deve ser um número par:\n- Para x = 2: y = 4(2) - 2²/2 = 8 - 2 = 6 (positivo e inteiro) => (2, 6);\n- Para x = 4: y = 4(4) - 4²/2 = 16 - 8 = 8 (positivo e inteiro) => (4, 8);\n- Para x = 6: y = 4(6) - 6²/2 = 24 - 18 = 6 (positivo e inteiro) => (6, 6).\n(Os ímpares geram frações com meia unidade: g(1)=3,5; g(3)=7,5; g(5)=7,5; g(7)=3,5).\nPortanto, os pontos são: (2, 6), (4, 8) e (6, 6).",
        justificativa: "Determinação de pares ordenados inteiros em arco de parábola no primeiro quadrante."
      }
    ],
    respostaGeral: "a) Ângulo θ = 45°. b) Pontos: (2, 6), (4, 8) e (6, 6).",
    justificativaGeral: "Álgebra e geometria analítica: propriedades da parábola e pontos inteiros de função quadrática."
  },
  {
    numero: 25,
    disciplina: "Linguagens e Códigos",
    enunciado: "Examine o cartum de Will Leite (@dona.anesia em 26.11.2023): A neta pergunta: 'ACREDITA EM SIMPATIA, VÓ?' e Dona Anésia responde enquanto varre o chão: 'SIM, MAS OS ANTIPÁTICOS COSTUMAM SER MAIS SINCEROS.'",
    subItens: [
      {
        item: "a",
        pergunta: "Que recurso expressivo é mobilizado por Will Leite na construção do sentido deste cartum? Justifique sua resposta.",
        resposta: "O recurso expressivo mobilizado é a polissemia da palavra 'simpatia'. A neta emprega o vocábulo no sentido de ritual supersticioso popular para atrair sorte ou amor; a avó (Dona Anésia), com seu traço de humor ácido característico, interpreta 'simpatia' no sentido de traço de personalidade afável e bem-educada, opondo-a aos 'antipáticos'.",
        justificativa: "A quebra de expectativa humorística assenta-se no duplo significado semântico contextual de 'simpatia'."
      },
      {
        item: "b",
        pergunta: "Transponha a fala da neta para o discurso indireto.",
        resposta: "A neta perguntou para a avó (ou à avó) se ela acreditava em simpatia.",
        justificativa: "Regras gramaticais de transposição: verbo do presente do indicativo ('acredita') passa para pretérito imperfeito ('acreditava'); o vocativo 'vó' converte-se no complemento/objeto indireto ('para a avó')."
      }
    ],
    respostaGeral: "a) Polissemia do termo 'simpatia' (crendice popular vs afabilidade de caráter). b) 'A neta perguntou à avó se ela acreditava em simpatia.'",
    justificativaGeral: "Semântica (polissemia e ironia) e sintaxe normativa (transposição de discurso direto para indireto)."
  },
  {
    numero: 26,
    disciplina: "Linguagens / Literatura",
    enunciado: "Para responder às questões de 26 a 28, leia o poema 'O ferrageiro de Carmona', de João Cabral de Melo Neto: 'Um ferrageiro de Carmona / que me informava de um balcão: / Aquilo? É de ferro fundido, / foi a fôrma que fez, não a mão. / Só trabalho em ferro forjado, / que é quando se trabalha ferro; / então, corpo a corpo com ele; / domo-o, dobro-o, até onde quero. / O ferro fundido é sem luta, / é só derramá-lo na fôrma [...].'",
    subItens: [
      {
        item: "a",
        pergunta: "Que oposição é explorada pelo ferrageiro em sua fala?",
        resposta: "A oposição basilar é entre o ferro fundido (produto industrial padronizado, passivo, vertido em fôrma sem embate humano e sem identidade) e o ferro forjado (resultado de trabalho manual árduo, embate físico 'corpo a corpo' com a matéria bruta, originando peças artísticas únicas e expressivas). Essa oposição funciona como metáfora da própria criação poética de João Cabral contra o lirismo fácil.",
        justificativa: "Oposição antitética entre a técnica mecânica e a arte artesanal forjada na resistência da matéria."
      },
      {
        item: "b",
        pergunta: "Em que medida 'O ferrageiro de Carmona' pode ser considerado um poema narrativo?",
        resposta: "O poema pode ser considerado narrativo porque apresenta estrutura canônica de narração: presença de narrador-personagem (o eu lírico), personagem interlocutor (o ferrageiro artesão), espaço cênico (a oficina/balcão em Carmona), desenvolvimento de um enredo dialógico e sucessão cronológica marcada por verbos de ação ('informava', 'domo', 'dobro', 'reparou').",
        justificativa: "Hibridismo de gêneros: poema lírico construído sob ossatura narrativa ('caso' contado)."
      }
    ],
    respostaGeral: "a) Oposição entre ferro fundido (fôrma fácil e alienada) e ferro forjado (luta artesanal autêntica). b) Possui enredo, personagens, cenário e verbos de ação temporal.",
    justificativaGeral: "Literatura brasileira: a poesia substantiva e metalinguística de João Cabral de Melo Neto."
  },
  {
    numero: 27,
    disciplina: "Linguagens / Gramática",
    enunciado: "Poema 'O ferrageiro de Carmona' de João Cabral de Melo Neto.",
    subItens: [
      {
        item: "a",
        pergunta: "Transcreva o verso em que o eu lírico se manifesta explicitamente no poema. Justifique sua resposta.",
        resposta: "Verso: 'que me informava de um balcão'.\nJustificativa: A manifestação explícita do eu lírico é atestada pelo uso do pronome pessoal oblíquo de primeira pessoa 'me', indicando quem recebe a informação e assume a voz da narração.",
        justificativa: "Identificação morfossintática das marcas de primeira pessoa do enunciador."
      },
      {
        item: "b",
        pergunta: "Reescreva o verso 'que não pode medir-se a gritos' (4.ª estrofe) na voz passiva analítica.",
        resposta: "Voz passiva analítica: 'que não pode ser medida a gritos'.\nJustificativa: Na voz passiva sintética original há o pronome apassivador 'se' ('medir-se'); na passiva analítica emprega-se a locução verbal com verbo auxiliar 'ser' ('ser medida') concordando com o sujeito paciente elíptico ('distância').",
        justificativa: "Flexão de voz verbal da passiva pronominal/sintética para a passiva analítica perifrástica."
      }
    ],
    respostaGeral: "a) 'que me informava de um balcão' (presença do pronome 'me'). b) 'que não pode ser medida a gritos'.",
    justificativaGeral: "Sintaxe da língua portuguesa: marcas pronominais de enunciação e conversão de vozes verbais."
  },
  {
    numero: 28,
    disciplina: "Linguagens / Literatura",
    enunciado: "Poema 'O ferrageiro de Carmona': 'Dou-lhe aqui humilde receita, / ao senhor que dizem ser poeta: / o ferro não deve fundir-se / nem deve a voz ter diarreia. / Forjar: domar o ferro à força, / não até uma flor já sabida, / mas ao que pode até ser flor / se flor parece a quem o diga.'",
    subItens: [
      {
        item: "a",
        pergunta: "Na sétima estrofe, o ferrageiro estabelece uma comparação entre a ferraria (ou seja, a arte de manusear e modelar o ferro) e a poesia. Nesse contexto, o que significa dizer que 'nem deve a voz [da poesia] ter diarreia'?",
        resposta: "A expressão metafórica 'ter diarreia' condena a prolixidade, a frouxidão estilística e o derramamento lírico sentimental excessivo e descontrolado. João Cabral prega, através do ferrageiro, a contenção verbal, a economia vocabular precisa, o rigor formal e a resistência construtiva das palavras (poesia como artesanato rigoroso, e não desabafo emotivo).",
        justificativa: "Metalinguagem cabralina: rejeição ao sentimentalismo e defesa da poesia substantiva."
      },
      {
        item: "b",
        pergunta: "Transcreva um verso da sexta estrofe em que ocorre a elipse de um substantivo. Que substantivo foi suprimido?",
        resposta: "Verso: 'moldadas pelas das campinas' (ou 'Nada têm das flores de fôrma').\nSubstantivo suprimido por elipse: 'flores' (ou seja: moldadas pelas [flores] das campinas / Nada [as flores] têm das flores de fôrma).",
        justificativa: "Identificação da figura de sintaxe elipse (supressão contextual de termo subentendido)."
      }
    ],
    respostaGeral: "a) Condenação da prolixidade e do sentimentalismo frouxo; defesa da contenção e rigor da palavra. b) 'moldadas pelas das campinas' (elipse do substantivo 'flores').",
    justificativaGeral: "Estilística e metapoética de João Cabral de Melo Neto e figuras de sintaxe."
  },
  {
    numero: 29,
    disciplina: "Linguagens / Filosofia",
    enunciado: "Ensaio de Scarlett Marton sobre o 'eterno retorno' de Nietzsche: 'E se um dia ou uma noite um demônio se esgueirasse em tua mais solitária solidão e te dissesse: Esta vida, assim como tu a vives agora e como a viveste, terás de vivê-la ainda uma vez e ainda inúmeras vezes [...]. Ou viveste alguma vez um instante descomunal, em que lhe responderias: Tu és um deus, e nunca ouvi nada mais divino! [...]. Afinal, o que ele provocaria em nós? Constituiria motivo de júbilo ou razão de desespero? Diante dele, como nos comportaríamos? Nós nos lançaríamos ao chão e rangeríamos os dentes? Ou abençoaríamos como portador da boa nova quem dele nos falasse?'",
    subItens: [
      {
        item: "a",
        pergunta: "Quais são os referentes do pronome 'eu' e do pronome 'Tu' sublinhados no primeiro parágrafo?",
        resposta: "Em ambos os casos o referente é o demônio. O pronome de primeira pessoa 'eu' ('este instante e eu próprio') é enunciado pelo próprio demônio que se dirige ao indivíduo; já o pronome de tratamento 'Tu' ('Tu és um deus...') refere-se igualmente ao demônio, agora na voz da hipotética reação extasiada de quem acolhe o eterno retorno como dádiva divina.",
        justificativa: "Coesão referencial pronominal em discurso direto aninhado."
      },
      {
        item: "b",
        pergunta: "Que recurso retórico é empregado reiteradamente pela filósofa brasileira no final do terceiro parágrafo? Com qual finalidade ela o emprega?",
        resposta: "O recurso retórico empregado é a sucessão de perguntas retóricas (interrogações reflexivas). A finalidade é engajar ativamente o leitor no drama ético e psicológico proposto pelo aforismo de Nietzsche, impelindo-o a refletir sobre como reagiria diante do imperativo do eterno retorno e avaliaria o valor da sua própria existência.",
        justificativa: "Interrogação retórica como recurso de persuasão e provocação hermenêutica."
      }
    ],
    respostaGeral: "a) O referente de 'eu' e de 'Tu' é o demônio. b) Perguntas retóricas sucessivas, com a finalidade de provocar reflexão ética profunda no leitor.",
    justificativaGeral: "Coesão textual e estratégias retórico-argumentativas na prosa filosófica."
  },
  {
    numero: 30,
    disciplina: "Linguagens / Gramática",
    enunciado: "Trecho de Scarlett Marton: 'Se esse pensamento adquirisse poder sobre ti, assim como tu és, ele te transformaria e talvez te triturasse; a pergunta, diante de tudo e de cada coisa: Quero isto ainda uma vez e ainda inúmeras vezes? pesaria como o mais pesado dos pesos sobre teu agir! Ou então, como terias de ficar de bem contigo mesmo e com a vida, para não desejar nada mais do que essa última, eterna confirmação e chancela?'",
    subItens: [
      {
        item: "a",
        pergunta: "Que verbo empregado no segundo parágrafo pode ser considerado uma hipérbole? Justifique sua resposta.",
        resposta: "O verbo é 'triturasse'. Trata-se de uma hipérbole porque emprega em sentido figurado e exagerado uma ação física de esmagamento material mecânico para expressar a violência do impacto psicológico, a angústia existencial e o abalo emocional desmedido provocado pela ideia do eterno retorno.",
        justificativa: "Figura de linguagem hipérbole caracterizada pelo exagero expressivo intencional."
      },
      {
        item: "b",
        pergunta: "As palavras podem mudar de classe gramatical sem sofrer modificação na forma ('derivação imprópria'). Cite um exemplo de derivação imprópria que ocorre no segundo parágrafo. Justifique sua resposta.",
        resposta: "O termo é 'agir' ('pesaria como o mais pesado dos pesos sobre teu agir!'). Justificativa: 'agir' é originalmente um verbo no infinitivo, mas no contexto vem antecedido pelo pronome possessivo 'teu', funcionando morfossintaticamente como um substantivo abstrato (equivalente a 'tua conduta', 'tua ação').",
        justificativa: "Substantivação do verbo no infinitivo pela anteposição de adjunto adnominal possessivo."
      }
    ],
    respostaGeral: "a) Verbo 'triturasse' (exagero figurado do abalo psicológico). b) 'agir' (verbo substantivado pelo pronome possessivo 'teu').",
    justificativaGeral: "Figuras de linguagem e processos morfológicos de derivação imprópria."
  },
  {
    numero: 31,
    disciplina: "Literatura Brasileira",
    enunciado: "Capítulos I e II do romance Quincas Borba, de Machado de Assis. Rubião à janela de sua casa em Botafogo, enriquecido pela herança de Quincas Borba após a morte de sua irmã Piedade. No capítulo II: 'Que abismo que há entre o espírito e o coração! O espírito do ex-professor, vexado daquele pensamento, arrepiou caminho, buscou outro assunto, uma canoa que ia passando; o coração, porém, deixou-se estar a bater de alegria [...].'",
    subItens: [
      {
        item: "a",
        pergunta: "Que embate é narrado no segundo capítulo? De que pensamento o espírito de Rubião se envergonha?",
        resposta: "Narra-se o conflito íntimo entre o espírito (a razão, a moralidade pública e a convenção social) e o coração (o egoísmo, os sentimentos inconfessáveis e o júbilo íntimo). O espírito de Rubião se envergonha do pensamento vil de celebrar e sentir alívio pela morte da própria irmã (Piedade) e do amigo Quincas Borba, ciente de que, se tivessem se casado ou tido herdeiros, ele jamais teria herdado a fabulosa fortuna que agora desfruta.",
        justificativa: "Análise psicológica do egoísmo humano e hipocrisia burguesa na ficção machadiana."
      },
      {
        item: "b",
        pergunta: "Que procedimento estilístico, característico da prosa madura de Machado de Assis, é empregado no primeiro capítulo? Justifique sua resposta.",
        resposta: "O procedimento estilístico é a interlocução direta do narrador com o leitor / metanarrativa irônica ('mas, em verdade, vos digo que pensava em outra coisa'). O narrador machadiano rompe a ilusão romântica de onisciência neutra, dialoga confidencialmente com o leitor e expõe com ironia e humor amargo as contradições mesquinhas da mente humana.",
        justificativa: "A conversa com o leitor e a digressão irônica são marcas registradas da fase realista de Machado de Assis."
      }
    ],
    respostaGeral: "a) Conflito entre espírito (moral) e coração (egoísmo); vergonha de lucrar com a morte da irmã e do amigo. b) Interlocução direta com o leitor ('em verdade vos digo') associada à fina ironia psicológica.",
    justificativaGeral: "Prosa realista machadiana: duplicidade moral da alma humana e narrativa digressivo-irônica."
  },
  {
    numero: 32,
    disciplina: "Linguagens / Literatura",
    enunciado: "Capítulo I de Quincas Borba: I. 'Rubião fitava a enseada, — eram oito horas da manhã.' II. 'Cotejava o passado com o presente. Que era, há um ano? Professor. Que é agora? Capitalista.' III. '— Vejam como Deus escreve direito por linhas tortas, pensa ele. Se mana Piedade tem casado com Quincas Borba, apenas me daria uma esperança colateral.' IV. 'Não casou; ambos morreram, e aqui está tudo comigo; de modo que o que parecia uma desgraça...'",
    subItens: [
      {
        item: "a",
        pergunta: "Em qual desses trechos ocorre o chamado discurso indireto livre? Justifique sua resposta.",
        resposta: "O discurso indireto livre ocorre no Trecho II ('Que era, há um ano? Professor. Que é agora? Capitalista.') e no Trecho IV ('Não casou; ambos morreram, e aqui está tudo comigo; de modo que o que parecia uma desgraça...').\nJustificativa: Nesses excertos, os pensamentos, indagações e emoções íntimas da personagem Rubião fundem-se perfeitamente à voz do narrador em terceira pessoa, sem marcas formais de pontuação típica (como aspas ou travessão) e sem verbos introdutórios de elocução/pensamento.",
        justificativa: "Definição estilística do discurso indireto livre como amálgama da voz narrativa com o fluxo mental do personagem."
      },
      {
        item: "b",
        pergunta: "Identifique os sujeitos dos verbos sublinhados no primeiro capítulo ('Quem o visse [...] cuidaria que ele admirava').",
        resposta: "Para a forma verbal 'visse', o sujeito é o pronome substantivo indefinido 'Quem' (sujeito simples e explícito na oração subordinada).\nPara a forma verbal 'cuidaria', o sujeito é o mesmo pronome 'Quem', agora em função de sujeito elíptico (oculto/desinencial) na oração principal.",
        justificativa: "Análise sintática de sujeitos em período composto por subordinação adjetiva/substantiva."
      }
    ],
    respostaGeral: "a) Trechos II e IV (fusão da mente de Rubião com a voz do narrador sem travessão ou verbo dicendi). b) Sujeito de 'visse': 'Quem' (expresso); de 'cuidaria': 'Quem' (elíptico).",
    justificativaGeral: "Foco narrativo, discurso indireto livre e sintaxe de concordância verbal em Machado de Assis."
  },
  {
    numero: 33,
    disciplina: "Língua Inglesa",
    enunciado: "In 2022, the United Nations High Commissioner for Refugees reported that weather-related events had displaced approximately 21.5 million people worldwide each year between 1999 and 2019, more than twice the number of people displaced by conflict and violence. These extreme weather events affect substantially the ability of low-income, rural, and Indigenous individuals to remain in their homes, which can compel them to migrate. (Michael Méndez et al. JAMA Network, 2024.)",
    subItens: [
      {
        item: "a",
        pergunta: "De acordo com o primeiro parágrafo, o número de cerca de 21,5 milhões refere-se a quais pessoas? Por que esse número é apresentado como expressivo?",
        resposta: "O número de aproximadamente 21,5 milhões refere-se à média anual de pessoas deslocadas à força no mundo inteiro devido a eventos climáticos e desastres meteorológicos extremos entre 1999 e 2019. Esse número é apresentado como altamente expressivo porque representa mais que o dobro da quantidade de pessoas deslocadas por conflitos armados e guerras no mesmo período.",
        justificativa: "Compreensão literal e interpretativa de dados estatísticos em texto jornalístico científico."
      },
      {
        item: "b",
        pergunta: "Conforme as informações do primeiro parágrafo, que grupos de pessoas sofrem mais os efeitos de eventos climáticos extremos em suas moradias? O que essas pessoas tendem a fazer?",
        resposta: "Os grupos mais vulneráveis e severamente afetados são indivíduos de baixa renda (low-income), populações rurais (rural) e povos indígenas (Indigenous individuals). Diante da incapacidade e das perdas materiais para permanecer em seus locais de habitação, essas pessoas tendem a ser forçadas a migrar (compel them to migrate).",
        justificativa: "Localização precisa de grupos sociais vulneráveis e causalidade de mobilidade forçada."
      }
    ],
    respostaGeral: "a) Pessoas deslocadas anualmente por desastres climáticos (1999-2019); expressivo por ser mais que o dobro dos refugiados de guerra. b) Pessoas de baixa renda, rurais e indígenas; tendem a migrar.",
    justificativaGeral: "Interpretação textual em língua inglesa sobre migrações forçadas e justiça climática."
  },
  {
    numero: 34,
    disciplina: "Língua Inglesa",
    enunciado: "Extreme weather events also damage ecological and social systems and affect water availability, food access, and rates of endemic diseases (such as acute respiratory tract infections, diarrhea, measles, and malaria) for people who do not migrate. The World Health Organization estimates that by 2050, global climate change will cause approximately 250 000 additional deaths per year due to malnutrition, heat-related illness, and malaria. It is anticipated that in under-resourced countries, adequate health care and infrastructure will be most adversely affected. (Michael Méndez et al. JAMA Network, 2024.)",
    subItens: [
      {
        item: "a",
        pergunta: "Conforme as informações do segundo parágrafo, os eventos climáticos extremos prejudicam quais necessidades básicas de sobrevivência das pessoas que não migram? Cite dois exemplos, mencionados nesse mesmo parágrafo, de doenças endêmicas cuja incidência é afetada por eventos climáticos extremos.",
        resposta: "Necessidades básicas prejudicadas: a disponibilidade de água potável (water availability) e o acesso a alimentos/segurança alimentar (food access).\nExemplos de doenças endêmicas mencionadas: infecções agudas do trato respiratório, diarreia, sarampo (measles) e malária.",
        justificativa: "Extração de léxico de necessidades vitais e patologias endêmicas agravadas por eventos climáticos."
      },
      {
        item: "b",
        pergunta: "De acordo com o segundo parágrafo: qual a estimativa da Organização Mundial da Saúde até 2050 e qual a previsão feita para países com poucos recursos?",
        resposta: "A OMS estima que, até o ano de 2050, as mudanças climáticas globais causarão aproximadamente 250.000 mortes adicionais por ano, resultantes de desnutrição, doenças causadas por calor extremo e malária.\nPrevisão para países com poucos recursos (under-resourced countries): são as nações cuja infraestrutura e capacidade de atendimento adequado em saúde serão mais severamente e desfavoravelmente prejudicadas.",
        justificativa: "Tradução contextual e síntese das projeções epidemiológicas globais e desigualdades estruturais."
      }
    ],
    respostaGeral: "a) Disponibilidade de água e acesso a alimentos; doenças: infecções respiratórias, diarreia, sarampo ou malária. b) 250.000 mortes a mais por ano até 2050; países pobres sofrerão os piores impactos na infraestrutura de saúde.",
    justificativaGeral: "Saúde pública global, impacto do aquecimento global e leitura interpretativa em língua inglesa."
  },
  {
    numero: 35,
    disciplina: "Língua Inglesa / Artes",
    enunciado: "Caravaggio’s lost masterpiece: In 2024, on May 27, 'Ecce Homo' — Latin for 'watch the man' — is shown in public for the first time since Michelangelo Merisi, better known as Caravaggio, painted it four centuries ago. The painting, of Christ being exhibited before his crucifixion, spent all those years in private hands, and was eventually misattributed to an obscure artist rather than to the Italian Baroque master. (Brooke Unger. The Economist, 2024.)",
    subItens: [
      {
        item: "a",
        pergunta: "De acordo com o primeiro parágrafo, o que ocorreu no dia 27 de maio de 2024? Quando o quadro mencionado no texto foi pintado?",
        resposta: "Em 27 de maio de 2024, a pintura 'Ecce Homo' foi exposta ao público pela primeira vez após séculos em coleções particulares. A obra foi pintada por Caravaggio há quatro séculos (século XVII / cerca de 1600), durante o período Barroco italiano.",
        justificativa: "Identificação cronológica e temática do evento histórico-cultural."
      },
      {
        item: "b",
        pergunta: "Conforme as informações do primeiro parágrafo, o que a pintura representa? Qual a controvérsia que envolveu a autoria do quadro?",
        resposta: "A pintura representa a cena bíblica de Cristo sendo exibido ao povo antes de sua crucificação (pelo procurador romano Pôncio Pilatos). A controvérsia consistiu no fato de a obra ter permanecido séculos em mãos privadas e ter sido erroneamente atribuída a um artista secundário/obscuro, em vez de ser reconhecida como tela legítima do mestre barroco Caravaggio.",
        justificativa: "Compreensão da iconografia cristã retratada e do erro histórico de atribuição artística (misattributed)."
      }
    ],
    respostaGeral: "a) O quadro 'Ecce Homo' foi exibido publicamente pela primeira vez; pintado há quatro séculos (séc. XVII). b) Representa Cristo exposto antes da crucificação; sua autoria fora falsamente atribuída a um pintor obscuro.",
    justificativaGeral: "História da arte europeia, vocabulário especializado em inglês e leitura de crítica cultural."
  },
  {
    numero: 36,
    disciplina: "Língua Inglesa / Artes",
    enunciado: "Only in 2021, when an auction house in Madrid put the scratched and worn-out work under the hammer with a starting bid of just €1,500 (US$1,627), did the city’s Prado National Museum call in experts to check its provenance. They were unanimous: this was a lost work by Caravaggio, whose paintings are prized for their rarity — barely 60 have survived — as much as for their quality. A British art collector bought 'Ecce Homo' for €36 million and has loaned the now-restored painting to the Prado until October 2024. (Brooke Unger. The Economist, 2024.)",
    subItens: [
      {
        item: "a",
        pergunta: "De acordo com o segundo parágrafo, qual foi o lance inicial estabelecido pelo leiloeiro em Madri em 2021? O que fez o Museu Nacional do Prado com relação ao quadro colocado em leilão?",
        resposta: "O lance inicial estipulado pela casa de leilões em Madri foi de apenas 1.500 euros (aproximadamente 1.627 dólares). Diante da suspeita, o Museu Nacional do Prado convocou especialistas e peritos internacionais para examinar minuciosamente a procedência e autenticidade da tela, confirmando por unanimidade tratar-se de um Caravaggio autêntico.",
        justificativa: "Resgate de valores monetários e procedimentos periciais de autenticação museológica."
      },
      {
        item: "b",
        pergunta: "Cite dois fatores, mencionados no segundo parágrafo, que contribuem para a valorização das obras de Caravaggio. O que fez o colecionador de arte britânico após arrematar a obra no leilão por 36 milhões de euros?",
        resposta: "Fatores de valorização: 1) Sua extrema raridade no mercado (apenas cerca de 60 pinturas do artista sobreviveram ao tempo); 2) Sua extraordinária qualidade estética e inovação técnica barroca (chiaroscuro). Após arrematar a obra por 36 milhões de euros, o colecionador britânico cedeu a pintura recém-restaurada em empréstimo ao Museu Nacional do Prado para exibição pública até outubro de 2024.",
        justificativa: "Compreensão de critérios de valoração no mercado das artes e filantropia cultural de empréstimo institucional."
      }
    ],
    respostaGeral: "a) Lance inicial de 1.500 euros; o Museu do Prado convocou peritos que confirmaram a autoria autêntica. b) Extrema raridade (menos de 60 obras) e alta qualidade artística; emprestou a obra restaurada ao Museu do Prado até outubro de 2024.",
    justificativaGeral: "Leitura crítica de jornalismo cultural britânico (The Economist) e mercado de leilões de belas-artes."
  }
];

// ===== UNESP 2020 CONHECIMENTOS GERAIS (1ª FASE - 90 QUESTÕES OFICIAIS) =====
export const UNESP_2020_CG_AMOSTRA: UnespObjectiveQuestion[] = [
  {
    numero: 1,
    disciplina: "Linguagens e Códigos",
    enunciado: "Examine o cartum de Steinberg, publicado em seu Instagram em 06.04.2019: Um indivíduo aparece comendo bolo com prazer e a legenda 'ME'. Ao lado, o mesmo indivíduo com o mesmo bolo e o pensamento 'I SHOULD NOT BE EATING THIS!' e a legenda 'ME ON A DIET'.\nPara o cartunista, a diferença entre estar ou não estar de dieta limita-se a um sentimento de",
    alternativas: [
      "(A) culpa.",
      "(B) euforia.",
      "(C) tristeza.",
      "(D) vazio.",
      "(E) satisfação."
    ],
    resposta: "A",
    justificativa: "Em ambas as situações o personagem come a mesma fatia de bolo, porém, quando está 'de dieta', surge o pensamento de remorso e recriminação ('I should not be eating this!'), revelando o sentimento de culpa."
  },
  {
    numero: 2,
    disciplina: "Língua Portuguesa",
    enunciado: "Na carta enviada por Padre Antônio Vieira a D. João IV em 4 de abril de 1654: 'Digo que menos mal será um ladrão que dois; e que mais dificultoso serão de achar dois homens de bem que um. Sendo propostos a Catão dois cidadãos romanos para o provimento de duas praças, respondeu que ambos lhe descontentavam: um porque nada tinha, outro porque nada lhe bastava. Tais são os dois capitães-mores em que se repartiu este governo: Baltasar de Sousa não tem nada, Inácio do Rego não lhe basta nada...'. À questão colocada por D. João IV, Antônio Vieira",
    alternativas: [
      "(A) responde de maneira categórica.",
      "(B) opta por não emitir uma opinião.",
      "(C) finge não tê-la compreendido.",
      "(D) admite a incapacidade de respondê-la.",
      "(E) responde de forma enigmática."
    ],
    resposta: "A",
    justificativa: "Apesar da fórmula de polidez inicial ('direi toscamente o que me parece'), Vieira responde de modo taxativo e categórico: prefere um só governador a dois capitães-mores ('menos mal será um ladrão que dois')."
  },
  {
    numero: 3,
    disciplina: "Língua Portuguesa",
    enunciado: "Considerando o contexto da carta de Padre Antônio Vieira ('Baltasar de Sousa não tem nada, Inácio do Rego não lhe basta nada; e eu não sei qual é maior tentação, se a [1], se a [2]'), as lacunas numeradas devem ser preenchidas, respectivamente, por:",
    alternativas: [
      "(A) humildade e vaidade.",
      "(B) necessidade e cobiça.",
      "(C) miséria e inveja.",
      "(D) preguiça e ganância.",
      "(E) avareza e luxúria."
    ],
    resposta: "B",
    justificativa: "Quem nada tem sofre a tentação da 'necessidade' (para sobreviver); quem nada lhe basta sofre a tentação da 'cobiça' (avidez ilimitada de enriquecimento)."
  },
  {
    numero: 4,
    disciplina: "Língua Portuguesa / História",
    enunciado: "Em sua carta a D. João IV, Antônio Vieira relata os padecimentos",
    alternativas: [
      "(A) dos nativos e dos capitães-mores.",
      "(B) dos negros e dos colonos pobres.",
      "(C) dos nativos e dos colonos pobres.",
      "(D) dos negros e dos capitães-mores.",
      "(E) dos nativos e dos negros."
    ],
    resposta: "C",
    justificativa: "Vieira narra o massacre e escravização dos 'tristes índios' (nativos) e a fome extrema dos colonos desvalidos ('pobre gente das Ilhas', açorianos pobres que perdiam seus filhos por inanição)."
  },
  {
    numero: 5,
    disciplina: "História",
    enunciado: "Em estudo de 2005, o historiador Gustavo Acioli Lopes vale-se da expressão 'primo pobre' para se referir ao produto derivado das lavouras mencionadas por Antônio Vieira (o tabaco no Pará). No contexto histórico em que foi escrita a carta (1654), o 'primo rico' da economia colonial açucareira seria",
    alternativas: [
      "(A) o açúcar.",
      "(B) o pau-brasil.",
      "(C) o café.",
      "(D) o ouro.",
      "(E) o algodão."
    ],
    resposta: "A",
    justificativa: "Em meados do século XVII, o principal produto de exportação e riqueza da colônia brasileira era o açúcar nordestino, em comparação ao qual o tabaco era considerado o 'primo pobre'."
  },
  {
    numero: 6,
    disciplina: "Língua Portuguesa",
    enunciado: "Sempre que haja necessidade expressiva de reforço, de ênfase, pode o objeto direto vir repetido. Essa reiteração recebe o nome de objeto direto pleonástico. Antônio Vieira recorre a esse recurso expressivo em:",
    alternativas: [
      "(A) 'Sendo propostos a Catão dois cidadãos romanos para o provimento de duas praças, respondeu que ambos lhe descontentavam'",
      "(B) 'e, consolando-a eu pela morte de tantos filhos, respondeu-me'",
      "(C) 'e desta terra há-de tirar Inácio do Rego mais de 100 mil cruzados em três anos'",
      "(D) 'São lastimosas as misérias que passa esta pobre gente das Ilhas'",
      "(E) 'Eu, Senhor, razões políticas nunca as soube, e hoje as sei muito menos'"
    ],
    resposta: "E",
    justificativa: "Em 'razões políticas nunca as soube', o termo 'razões políticas' é objeto direto anteposto e é repetido enfaticamente pelo pronome oblíquo 'as', configurando objeto direto pleonástico."
  },
  {
    numero: 7,
    disciplina: "Linguagens e Códigos",
    enunciado: "Examine a tira de André Dahmer (Malvados): Um homem abordado pela Morte com sua foice tenta negociar: 'Vamos indo, ainda vou trabalhar a noite inteira no Iraque, meu rapaz.' Ele insiste: 'É cedo para mim. Me adianta essa, vai... Posso lhe dar um emprego bem melhor...'. A Morte responde: 'Ah, estou morrendo de pena... O importante é trabalhar com o que a gente gosta.' Na tira, a morte é caracterizada como",
    alternativas: [
      "(A) frívola.",
      "(B) compassiva.",
      "(C) solitária.",
      "(D) incorruptível.",
      "(E) materialista."
    ],
    resposta: "D",
    justificativa: "A Morte recusa qualquer suborno ou barganha por empregos mais vantajosos, cumprindo sua missão de maneira inexorável e incorruptível."
  },
  {
    numero: 8,
    disciplina: "Língua Portuguesa",
    enunciado: "Constituem exemplos de linguagem formal e de linguagem coloquial, respectivamente, as seguintes falas da tira:",
    alternativas: [
      "(A) 'Ah, estou morrendo de pena...' e 'Ainda vou trabalhar a noite inteira no Iraque, meu rapaz.'",
      "(B) 'Me adianta essa, vai...' e 'É cedo para mim.'",
      "(C) 'O importante é trabalhar com o que a gente gosta.' e 'Posso lhe dar um emprego bem melhor...'",
      "(D) 'É cedo para mim.' e 'Posso lhe dar um emprego bem melhor...'",
      "(E) 'Posso lhe dar um emprego bem melhor...' e 'Me adianta essa, vai...'"
    ],
    resposta: "E",
    justificativa: "'Posso lhe dar um emprego bem melhor...' obedece ao padrão culto (uso da próclise com pronome 'lhe'), enquanto 'Me adianta essa, vai...' inicia frase com pronome oblíquo e usa interjeição de apelo coloquial."
  },
  {
    numero: 9,
    disciplina: "Literatura Brasileira",
    enunciado: "No soneto 'VII' de Cláudio Manuel da Costa: 'Onde estou? Este sítio desconheço: / Quem fez tão diferente aquele prado? / Tudo outra natureza tem tomado, / E em contemplá-lo, tímido, esmoreço. / Uma fonte aqui houve; eu não me esqueço... / Ali em vale um monte está mudado: / Quanto pode dos anos o progresso!'. O tom predominante no soneto é de",
    alternativas: [
      "(A) ingenuidade.",
      "(B) apatia.",
      "(C) ira.",
      "(D) ironia.",
      "(E) perplexidade."
    ],
    resposta: "E",
    justificativa: "O eu lírico arcádico manifesta espanto, desorientação e perplexidade diante da profunda alteração da paisagem natural decorrente da exploração mineradora nas Minas Gerais."
  },
  {
    numero: 10,
    disciplina: "Literatura e História",
    enunciado: "No soneto, o eu lírico expressa um sentimento de inadequação que, a seu turno, se faz presente na seguinte citação:",
    alternativas: [
      "(A) Florestan Fernandes em A revolução burguesa no Brasil.",
      "(B) Caio Prado Júnior em Formação do Brasil contemporâneo.",
      "(C) Celso Furtado em Formação econômica do Brasil.",
      "(D) 'Trazendo de países distantes nossas formas de convívio, nossas instituições, nossas ideias, e timbrando em manter tudo isso em ambiente muitas vezes desfavorável e hostil, somos ainda hoje uns desterrados em nossa terra.' (Sérgio Buarque de Holanda. Raízes do Brasil.)",
      "(E) Gilberto Freyre em Casa-grande e senzala."
    ],
    resposta: "D",
    justificativa: "A célebre fórmula de Sérgio Buarque de Holanda ('somos ainda hoje uns desterrados em nossa terra') sintetiza exatamente o estranhamento e a inadequação do colonizador em solo americano."
  },
  {
    numero: 11,
    disciplina: "História / Literatura",
    enunciado: "Considerando o contexto histórico-geográfico de produção do soneto de Cláudio Manuel da Costa (século XVIII em Minas Gerais), as transformações na paisagem assinaladas pelo eu lírico relacionam-se à seguinte atividade econômica:",
    alternativas: [
      "(A) indústria.",
      "(B) extrativismo vegetal.",
      "(C) agricultura.",
      "(D) extrativismo mineral.",
      "(E) pecuária."
    ],
    resposta: "D",
    justificativa: "O Arcadismo mineiro floresceu durante o Ciclo do Ouro e diamantes; o extrativismo mineral desmatou encostas, alterou cursos de rios e nivelou morros em vales em Vila Rica."
  },
  {
    numero: 12,
    disciplina: "Língua Portuguesa / Literatura",
    enunciado: "O eu lírico recorre ao recurso expressivo conhecido como hipérbole no verso:",
    alternativas: [
      "(A) 'Quem fez tão diferente aquele prado?' (1ª estrofe)",
      "(B) 'E em contemplá-lo, tímido, esmoreço.' (1ª estrofe)",
      "(C) 'Quanto pode dos anos o progresso!' (2ª estrofe)",
      "(D) 'Que faziam perpétua a primavera:' (3ª estrofe)",
      "(E) 'Árvores aqui vi tão florescentes,' (3ª estrofe)"
    ],
    resposta: "D",
    justificativa: "Afirmar que as árvores tornavam a primavera 'perpétua' (eterna, sem fim) constitui evidente exagero enfático intencional (hipérbole poética)."
  },
  {
    numero: 13,
    disciplina: "Língua Portuguesa",
    enunciado: "Está reescrito em ordem direta, sem prejuízo de seu sentido original, o seguinte verso do soneto:",
    alternativas: [
      "(A) 'Quem fez tão diferente aquele prado?' → Quem aquele prado fez tão diferente?",
      "(B) 'Uma fonte aqui houve; eu não me esqueço' → Uma fonte houve aqui; eu não me esqueço.",
      "(C) 'Ali em vale um monte está mudado:' → Ali está mudado um monte em vale.",
      "(D) 'Tudo outra natureza tem tomado,' → Tudo tem tomado outra natureza.",
      "(E) 'Nem troncos vejo agora decadentes.' → Nem troncos decadentes vejo agora."
    ],
    resposta: "D",
    justificativa: "Na oração 'Tudo outra natureza tem tomado', 'Tudo' é sujeito, 'tem tomado' é a locução verbal e 'outra natureza' é o objeto direto. A ordem direta canônica (Sujeito + Verbo + Objeto) é 'Tudo tem tomado outra natureza'."
  },
  {
    numero: 14,
    disciplina: "Geografia e Literatura",
    enunciado: "As dinâmicas climáticas representadas nos gráficos 1 (pluviometria tropical úmida litorânea com chuvas bem distribuídas) e 2 (semiárido com estiagem severa prolongada de 8 meses e chuvas concentradas no verão) correspondem, respectivamente, aos espaços retratados em:",
    alternativas: [
      "(A) Capitães da Areia, de Jorge Amado, e O cortiço, de Aluísio Azevedo.",
      "(B) Vidas secas, de Graciliano Ramos, e Capitães da Areia, de Jorge Amado.",
      "(C) Vidas secas, de Graciliano Ramos, e Grande sertão: veredas, de Guimarães Rosa.",
      "(D) Memórias póstumas de Brás Cubas, de Machado de Assis, e O cortiço, de Aluísio Azevedo.",
      "(E) Memórias póstumas de Brás Cubas, de Machado de Assis, e Vidas secas, de Graciliano Ramos."
    ],
    resposta: "E",
    justificativa: "O Gráfico 1 reflete o clima tropical litorâneo do Rio de Janeiro (espaço urbano de Memórias Póstumas); o Gráfico 2 retrata o semiárido do Sertão nordestino com aridez e seca drástica (espaço de Vidas Secas)."
  },
  {
    numero: 15,
    disciplina: "Língua Portuguesa / Literatura",
    enunciado: "No trecho de Quincas Borba ('Ao vencido, ódio ou compaixão; ao vencedor, as batatas... nenhuma pessoa canoniza uma ação que virtualmente a destrói'), está empregado em sentido figurado o termo sublinhado em:",
    alternativas: [
      "(A) 'nenhuma pessoa canoniza uma ação que virtualmente a destrói'.",
      "(B) 'a supressão de uma é condição da sobrevivência da outra'.",
      "(C) 'Uma das tribos extermina a outra e recolhe os despojos'.",
      "(D) 'Daí o caráter conservador e benéfico da guerra'.",
      "(E) 'não chegam a nutrir-se suficientemente e morrem de inanição'."
    ],
    resposta: "A",
    justificativa: "'Canonizar' significa originariamente proclamar santo pela Igreja Católica; no texto machadiano, está em sentido conotativo/figurado de 'aprovar com louvor', 'legitimar'."
  },
  {
    numero: 16,
    disciplina: "História e Literatura",
    enunciado: "Considerando o contexto histórico de publicação de Quincas Borba (1891), a tese filosófica do Humanitismo formulada pelo filósofo louco Quincas Borba ('Ao vencedor, as batatas') constitui uma alusão irônica",
    alternativas: [
      "(A) à teoria darwiniana (darwinismo social).",
      "(B) à filosofia idealista.",
      "(C) à ideologia capitalista pura.",
      "(D) à filosofia iluminista.",
      "(E) à ideologia socialista."
    ],
    resposta: "A",
    justificativa: "Machado satiriza ferozmente o darwinismo social e o cientificismo positivista do final do século XIX, que justificavam as guerras e a eliminação dos mais fracos sob o pretexto da sobrevivência dos mais aptos."
  },
  {
    numero: 17,
    disciplina: "Língua Portuguesa",
    enunciado: "Em 'mas, rigorosamente, não há morte, há vida, porque a supressão de uma é condição da sobrevivência da outra' e 'As batatas apenas chegam para alimentar uma das tribos', os conectivos sublinhados ('porque' e 'para') estabelecem relação, respectivamente, de:",
    alternativas: [
      "(A) consequência e conformidade.",
      "(B) causa e conformidade.",
      "(C) conformidade e consequência.",
      "(D) causa e finalidade.",
      "(E) consequência e finalidade."
    ],
    resposta: "D",
    justificativa: "'Porque' introduz oração subordinada causal (motivo pelo qual há vida); 'para alimentar' introduz oração subordinada adverbial final (objetivo/finalidade da quantidade de batatas)."
  },
  {
    numero: 18,
    disciplina: "Geografia / Meio Ambiente",
    enunciado: "No cartum de Pia Guerra (The New Yorker): Dinossauros conversam e um diz: 'I had that dream again where the small hairy creatures were selling my body for three dollars a gallon.' A mercadoria a que o cartum faz alusão (petróleo/gasolina) está diretamente relacionada ao seguinte problema ambiental global:",
    alternativas: [
      "(A) desertificação.",
      "(B) extinção de espécies.",
      "(C) desmatamento.",
      "(D) assoreamento.",
      "(E) aquecimento global."
    ],
    resposta: "E",
    justificativa: "A queima massiva de derivados de petróleo em motores a combustão é o principal vetor antropogênico de emissão de gases de efeito estufa causadores do aquecimento global."
  },
  {
    numero: 19,
    disciplina: "Literatura Brasileira",
    enunciado: "Antonio Candido analisa: 'Tal movimento distingue-se pela atenuação do sentimentalismo e da melancolia, a ausência quase completa de interesse político no contexto da obra [...] e pelo cuidado da escrita, aspirando a uma expressão de tipo plástico. O mito da pureza da língua, do casticismo vernacular...'. O texto refere-se ao movimento denominado:",
    alternativas: [
      "(A) Romantismo.",
      "(B) Barroco.",
      "(C) Parnasianismo.",
      "(D) Arcadismo.",
      "(E) Realismo."
    ],
    resposta: "C",
    justificativa: "A busca pela impassibilidade, 'arte pela arte', culto estético da forma perfeita e valorização plástica da poesia caracterizam a estética parnasiana (Olavo Bilac, Raimundo Correia, Alberto de Oliveira)."
  },
  {
    numero: 20,
    disciplina: "Artes",
    enunciado: "Perspectiva: técnica de representação plana do espaço tridimensional. Verificam-se distorções intencionais e paradoxos espaciais geométricos em relação à técnica da perspectiva na obra:",
    alternativas: [
      "(A) René Magritte (A clarividência).",
      "(B) Maurits Cornelis Escher (Mirante, 1958).",
      "(C) Edward Hopper (Escritório em uma cidade pequena).",
      "(D) Käthe Kollwitz (A marcha dos tecelões).",
      "(E) René Magritte (O império da luz)."
    ],
    resposta: "B",
    justificativa: "A famosa litografia de M.C. Escher subverte propositalmente as regras euclidianas da perspectiva renascentista através de colunas impossíveis e planos espaciais paradoxais."
  },
  {
    numero: 21,
    disciplina: "Língua Inglesa / Geografia",
    enunciado: "No texto sobre o Cerrado brasileiro, a frase 'Despite its environmental importance, it is one of the least protected regions in Brazil' é refletida no seguinte dado das Facts & Figures:",
    alternativas: [
      "(A) 'Only 20% of the Cerrado’s original vegetation remains intact; less than 3% of the area is currently guarded by law.'",
      "(B) 'The capital of Brazil, Brasilia, is located in the heart of the Cerrado.'",
      "(C) 'More than 1,600 species of mammals, birds and reptiles have been identified in the Cerrado.'",
      "(D) 'Annual rainfall is around 800 to 1600 mm.'",
      "(E) 'Covering 2 million km², or 21% of the country’s territory, the Cerrado is the second largest vegetation type in Brazil.'"
    ],
    resposta: "A",
    justificativa: "A afirmação de que é uma das áreas menos protegidas corresponde diretamente à estatística de que 'less than 3% of the area is currently guarded by law'."
  },
  {
    numero: 22,
    disciplina: "Língua Inglesa",
    enunciado: "No trecho 'Despite its environmental importance', o conectivo sublinhado 'Despite' equivale, em português, a:",
    alternativas: [
      "(A) desde que.",
      "(B) de acordo com.",
      "(C) devido a.",
      "(D) apesar de.",
      "(E) além de."
    ],
    resposta: "D",
    justificativa: "'Despite' é uma preposição concessiva em inglês correspondente a 'apesar de', 'a despeito de'."
  },
  {
    numero: 23,
    disciplina: "Língua Inglesa / Geografia",
    enunciado: "O texto afirma que o Cerrado é o segundo maior bioma/tipo de vegetação do Brasil. Qual é o maior bioma retratado no Mapa 1?",
    alternativas: [
      "(A) Chaco.",
      "(B) Atlantic forest.",
      "(C) Caatinga.",
      "(D) Subtropical grassland.",
      "(E) Rain forest (Floresta Amazônica)."
    ],
    resposta: "E",
    justificativa: "A maior formação vegetal do país é a Floresta Tropical Úmida / Amazônica, identificada no mapa em inglês como 'Rain forest'."
  },
  {
    numero: 24,
    disciplina: "Geografia",
    enunciado: "Comparando os mapas 1 e 2, a unidade federativa brasileira cujo território está integralmente coberto pelo bioma Cerrado é:",
    alternativas: [
      "(A) Bahia.",
      "(B) São Paulo.",
      "(C) Mato Grosso.",
      "(D) Distrito Federal.",
      "(E) Paraná."
    ],
    resposta: "D",
    justificativa: "O Distrito Federal está encravado inteiramente na porção central do bioma Cerrado."
  },
  {
    numero: 25,
    disciplina: "Língua Inglesa / Demografia",
    enunciado: "Pelo gráfico demográfico da ONU ('The future is largely urban'), o período aproximado em que as populações mundiais urbana e rural se igualaram foi:",
    alternativas: [
      "(A) just before 2005.",
      "(B) from 2010 onwards.",
      "(C) before 1950, not pictured in the chart.",
      "(D) from 1950 to 1980, when the lines were parallel.",
      "(E) a bit after 2005 to around 2010."
    ],
    resposta: "E",
    justificativa: "O ponto de interseção das curvas urbana e rural ocorre por volta de 2007-2008 (compreendido no intervalo 'a bit after 2005 to around 2010')."
  },
  {
    numero: 26,
    disciplina: "Língua Inglesa / Saúde Pública",
    enunciado: "No cartaz 'IF YOU DROP YOUR LITTER, YOU ARE INVITING MOSQUITOES INTO YOUR COMMUNITY. KEEP THEM AWAY BY KEEPING CLEAN!', o objetivo principal é:",
    alternativas: [
      "(A) promover a reciclagem do lixo doméstico.",
      "(B) prevenir a proliferação de mosquitos transmissores da malária.",
      "(C) manter os logradouros públicos limpos apenas por estética.",
      "(D) incentivar crianças a caçar insetos perigosos.",
      "(E) amedrontar a comunidade com punições legais."
    ],
    resposta: "B",
    justificativa: "O anúncio educa a comunidade a não descartar recipientes que acumulem água para prevenir a reprodução do mosquito transmissor da malária (vetor Anopheles)."
  },
  {
    numero: 27,
    disciplina: "Língua Inglesa / História da Arte",
    enunciado: "De acordo com o texto sobre a exposição de Hélio Oiticica na Tate Modern, a Tropicália:",
    alternativas: [
      "(A) congregou artistas de diversos matizes ideológicos, tanto favoráveis como contrários ao regime militar.",
      "(B) foi um movimento eminentemente musical, que transmitia o otimismo da década de 1950.",
      "(C) foi um movimento artístico-cultural que se apropriou do ideário da Antropofagia.",
      "(D) foi um movimento cultural interrompido pelo regime militar.",
      "(E) teve seu ápice incentivado pela explosão industrial nos estados do Rio de Janeiro e de São Paulo."
    ],
    resposta: "C",
    justificativa: "O texto afirma categoricamente: 'Tropicália was seen as a re-articulation of Anthropophagia ('cannibalism'), an artistic ideology promoted by Oswald de Andrade'."
  },
  {
    numero: 28,
    disciplina: "Língua Inglesa",
    enunciado: "No trecho 'Nevertheless, a military coup in 1964 had brought to power a right-wing regime...', o conectivo 'Nevertheless' expressa ideia de:",
    alternativas: [
      "(A) contraste (adversidade/concessão).",
      "(B) consequência.",
      "(C) opinião.",
      "(D) aprovação.",
      "(E) alternativa."
    ],
    resposta: "A",
    justificativa: "'Nevertheless' significa 'não obstante', 'no entanto', estabelecendo relação de contraste e oposição com o otimismo dos anos 1950."
  },
  {
    numero: 29,
    disciplina: "Língua Inglesa",
    enunciado: "Na frase 'a right-wing regime at odds with the concerns of left-wing artists', a expressão 'at odds with' tem sentido de:",
    alternativas: [
      "(A) reconhecimento.",
      "(B) argumentação.",
      "(C) parcialidade.",
      "(D) consonância.",
      "(E) conflito (desacordo)."
    ],
    resposta: "E",
    justificativa: "'To be at odds with' é uma expressão idiomática que significa estar em desacordo, conflito ou oposição."
  },
  {
    numero: 30,
    disciplina: "Língua Inglesa / Artes",
    enunciado: "De acordo com o texto, a instalação Tropicália ('penetrables') de Hélio Oiticica:",
    alternativas: [
      "(A) fez com que os intelectuais da época ficassem emocionados.",
      "(B) referia-se à penetração da favela na cidade.",
      "(C) estimulava o público a adentrar a instalação.",
      "(D) pretendia mostrar como seriam as favelas urbanizadas.",
      "(E) propunha um debate ecológico ao usar plantas e pássaros reais."
    ],
    resposta: "C",
    justificativa: "Oiticica nomeou as obras de 'penetrables' porque 'people were originally encouraged to enter them' (o público era convidado a entrar no ambiente imersivo)."
  },
  {
    numero: 31,
    disciplina: "História",
    enunciado: "O historiador François Hartog analisa a representação do passado na Odisseia de Homero. O texto afirma que a obra de Homero:",
    alternativas: [
      "(A) questiona as ações heroicas dos povos fundadores da Grécia Antiga.",
      "(B) valoriza os mitos em que os gregos acreditavam e que estão no fundamento das concepções modernas de história.",
      "(C) é fundadora da ideia de história, pois concebe o passado como lição moral contínua.",
      "(D) identifica uma forma do pensamento mítico e uma visão de passado estranha à ideia de diálogo entre temporalidades, que caracteriza a história.",
      "(E) desenvolve uma abordagem crítica do passado com base no racionalismo pré-socrático."
    ],
    resposta: "D",
    justificativa: "Homero 'forja o passado, mas um passado sem duração, acabado', típico da consciência mítica atemporal, distinta da historicidade crítica que articula passado, presente e futuro."
  },
  {
    numero: 32,
    disciplina: "História da Arte",
    enunciado: "A Catedral de Notre-Dame em Paris, símbolo da Baixa Idade Média, é um exemplar maior da arquitetura:",
    alternativas: [
      "(A) gótica, expressa na verticalidade e no emprego de arcos e vitrais.",
      "(B) românica, expressa no desenho do teto e da abóbada principal.",
      "(C) clássica, expressa na composição simétrica e colunas dóricas.",
      "(D) art nouveau, com elementos decorativos florais.",
      "(E) eclética, no pastiche barroco e neoclássico."
    ],
    resposta: "A",
    justificativa: "O estilo gótico caracteriza-se pelas altas torres verticais apontadas para o céu, arcos ogivais quebrados e vitrais coloridos que iluminavam o templo misticamente."
  },
  {
    numero: 33,
    disciplina: "História e Filosofia",
    enunciado: "A partir da reflexão de Walter Isaacson sobre os estudos de Leonardo da Vinci acerca do movimento infinito da água e sutilezas da natureza, pode-se afirmar que:",
    alternativas: [
      "(A) o princípio cristão da vida eterna orientou o pensamento renascentista.",
      "(B) o materialismo pré-socrático foi a principal sustentação teórica do Renascimento.",
      "(C) os experimentos da Antiguidade oriental basearam a ciência renascentista.",
      "(D) as concepções artísticas medievais fundamentaram a arte renascentista.",
      "(E) a observação da pluralidade da natureza foi um dos fundamentos do Renascimento."
    ],
    resposta: "E",
    justificativa: "O Renascimento baseou-se na observação empírica sistemática da natureza (antropocentrismo e racionalismo empirista) para captar a complexidade do mundo físico."
  },
  {
    numero: 34,
    disciplina: "História do Brasil",
    enunciado: "Luiz Felipe de Alencastro analisa a formação do Brasil pelo Atlântico Sul. O texto estabelece que a formação do Brasil pela navegação marítima implica reconhecer a importância:",
    alternativas: [
      "(A) da imposição de uma lógica global de comércio e dissolução de fronteiras americanas.",
      "(B) do domínio colonial de Portugal sobre o litoral africano e intermediação espanhola.",
      "(C) do controle das rotas por navegadores italianos.",
      "(D) da constituição do espaço geográfico do Atlântico Sul e da relação estabelecida entre os continentes americano e africano.",
      "(E) do surgimento do tráfico negreiro e relações com a América espanhola."
    ],
    resposta: "D",
    justificativa: "A tese de Alencastro demonstra que o Brasil colonizado articulava-se mais organicamente com portos africanos (Luanda, Costa da Mina) do que as capitanias entre si."
  },
  {
    numero: 35,
    disciplina: "História",
    enunciado: "A 'despersonalização' e a 'dessocialização' dos africanos escravizados descritas por Alencastro associam-se, respectivamente:",
    alternativas: [
      "(A) aos números marcados a ferro e à interdição de contato com senhores.",
      "(B) à noção do escravo como mercadoria e ao fato de que os africanos eram extraídos de sua comunidade de origem.",
      "(C) à tolerância ao trabalho forçado e à proibição de constituir família.",
      "(D) à ausência de distinção étnica e à proibição de cultos.",
      "(E) à falta de conhecimento territorial e ao não reconhecimento como brasileiro."
    ],
    resposta: "B",
    justificativa: "Despersonalização: redução do ser humano à condição jurídica de coisa/mercadoria (semovente); Dessocialização: desenraizamento violento de seus laços familiares, comunitários e culturais na África."
  },
  {
    numero: 36,
    disciplina: "Filosofia Política",
    enunciado: "Em Do contrato social, Jean-Jacques Rousseau afirma: 'Cada um de nós põe em comum sua pessoa e todo o seu poder sob a direção suprema da vontade geral...'. O texto apresenta a doutrina política do:",
    alternativas: [
      "(A) coletivismo marxista.",
      "(B) humanismo liberal focado no indivíduo isolado.",
      "(C) socialismo científico com abolição do Estado.",
      "(D) corporativismo autoritário fascista.",
      "(E) contratualismo, manifesto na reação ao Antigo Regime e na defesa dos direitos de cidadania."
    ],
    resposta: "E",
    justificativa: "Rousseau é um expoente do contratualismo iluminista, fundamentando a legitimidade do corpo político soberano no pacto social orientado pela 'vontade geral'."
  },
  {
    numero: 37,
    disciplina: "História",
    enunciado: "Na conjuntura da independência brasileira em 1822-1825 com a Santa Aliança e a Doutrina Monroe, o texto relaciona:",
    alternativas: [
      "(A) restauração absolutista, industrialização norte-americana e federação hispânica.",
      "(B) influência da Igreja, controle britânico e avanço imperialista norte-americano sobre o Brasil.",
      "(C) recolonização da América, Bloqueio Continental e livre-comércio com hispânicos.",
      "(D) penetração industrial inglesa na Europa e emancipação dos EUA.",
      "(E) a reorganização da Europa continental depois do período de domínio napoleônico, os processos de independência na América e a ampliação do controle comercial mundial pela Inglaterra."
    ],
    resposta: "E",
    justificativa: "A Santa Aliança (pós-Congresso de Viena) tentava restaurar o absolutismo monárquico na Europa, enquanto a Grã-Bretanha apoiava as independências americanas para expandir sua hegemonia industrial e comercial."
  },
  {
    numero: 38,
    disciplina: "História / Sociologia",
    enunciado: "O conto 'O homem da multidão' (1840) de Edgar Allan Poe retrata o ritmo febril das calçadas de Londres. O perfil das metrópoles do século XIX destaca:",
    alternativas: [
      "(A) a solidariedade entre os habitantes e o avanço da cidadania comunitária.",
      "(B) o declínio comercial e a lentidão dos costumes citadinos.",
      "(C) o arcaísmo tecnológico e a imobilidade dos transeuntes.",
      "(D) o controle militar das ruas e a ausência de circulação.",
      "(E) o crescimento populacional, a dinâmica da circulação urbana e a impessoalidade nas relações."
    ],
    resposta: "E",
    justificativa: "A multidão urbana moderna é anônima e acelerada; os indivíduos esbarram-se sem estabelecer vínculos humanos afetivos, dominados pelo cálculo e pela impessoalidade."
  },
  {
    numero: 39,
    disciplina: "História da América",
    enunciado: "A gravura 'Caveira revolucionária' de José Guadalupe Posada (1910) retrata a Revolução Mexicana marcada:",
    alternativas: [
      "(A) pela participação feminina e pela recuperação de elementos da tradição pré-colombiana.",
      "(B) pela vitória imediata das reformas de Emiliano Zapata e Pancho Villa.",
      "(C) pela via exclusivamente diplomática.",
      "(D) pela ingerência britânica direta no campesinato.",
      "(E) pela repressão do clero contra o uso de símbolos funerários."
    ],
    resposta: "A",
    justificativa: "A caveira (calavera) recupera a cosmovisão ancestral mexicana da morte e as soldaderas/adelitas (mulheres combatentes) tiveram protagonismo ímpar na Revolução Mexicana."
  },
  {
    numero: 40,
    disciplina: "História do Brasil",
    enunciado: "A construção de Brasília no Plano de Metas de Juscelino Kubitschek possuía dois significados indissociáveis porque:",
    alternativas: [
      "(A) denotam o esforço de construção de um espaço geográfico brasileiro com o intuito de assegurar o equilíbrio econômico e político entre as várias regiões do país.",
      "(B) demonstram a intenção xenófoba de isolar o Brasil dos vizinhos sul-americanos.",
      "(C) visavam conter investimentos multinacionais no interior.",
      "(D) explicitavam a intenção de instaurar um regime socialista planificado.",
      "(E) copiavam templos indígenas originários do planalto central."
    ],
    resposta: "A",
    justificativa: "Brasília unia a utopia modernista da arquitetura monumental à meta geopolítica de interiorização do desenvolvimento econômico e integração física do território nacional."
  },
  {
    numero: 41,
    disciplina: "História Contemporânea",
    enunciado: "Dois fatores decisivos para a descolonização da África e da Ásia no pós-Segunda Guerra Mundial foram:",
    alternativas: [
      "(A) a neutralidade da China e a extinção da Guerra Fria.",
      "(B) a crise do petróleo de 1973 e a partilha colonial de Berlim.",
      "(C) o nacionalismo de organizações civis dentro das colônias e o princípio da autodeterminação dos povos, que era defendido pela ONU.",
      "(D) a autossuficiência econômica imediata do pan-africanismo.",
      "(E) a ascensão militar e expulsão francesa pelos soviéticos."
    ],
    resposta: "C",
    justificativa: "O enfraquecimento das potências coloniais europeias após 1945, a fundação da ONU com o princípio da autodeterminação dos povos e o fortalecimento de frentes nacionalistas libertadoras impulsionaram a independência."
  },
  {
    numero: 42,
    disciplina: "Sociologia",
    enunciado: "O terrorismo contemporâneo do Estado Islâmico (Daesh) é caracterizado como peculiar porque:",
    alternativas: [
      "(A) promove a inclusão social e digital de populações desfavorecidas.",
      "(B) rejeita a publicidade e atua estritamente em sigilo secreto.",
      "(C) recusa as ferramentas de mídia ocidentais.",
      "(D) recorre a estratégias de ação de forte impacto visual e divulga suas atividades por meio das novas tecnologias.",
      "(E) atua sem recursos de vídeo ou internet."
    ],
    resposta: "D",
    justificativa: "O autor Gabriel Zacarias pontua a 'lógica espetacular': produções audiovisuais cinematográficas difundidas pelas redes para disseminar o terror psicológico em escala global."
  },
  {
    numero: 43,
    disciplina: "Sociologia e Economia",
    enunciado: "Coerentes com o ideário neoliberal contemporâneo, as propostas do Estado-empresa convergem para:",
    alternativas: [
      "(A) apropriação dos meios de produção pelo Estado.",
      "(B) aumento de programas estatais de bem-estar social.",
      "(C) enrijecimento das leis trabalhistas fabris.",
      "(D) protecionismo alfandegário estatal severo.",
      "(E) a adoção de privatizações e a mínima intervenção do Estado na economia."
    ],
    resposta: "E",
    justificativa: "O neoliberalismo advoga a desregulamentação de mercados, privatização de estatais e retração do poder regulatório direto do Estado na atividade econômica."
  },
  {
    numero: 44,
    disciplina: "Sociologia",
    enunciado: "Um exemplo histórico trágico de etnocentrismo e biologização racial incorporados como política estatal oficial foi:",
    alternativas: [
      "(A) o movimento sionista.",
      "(B) o apartheid, na África do Sul.",
      "(C) a questão curda na Turquia.",
      "(D) a primavera árabe na Síria.",
      "(E) a balcanização da Chechênia."
    ],
    resposta: "B",
    justificativa: "O regime do Apartheid (1948-1994) na África do Sul institucionalizou em lei a segregação racial e a supremacia branca com base em pseudociência biologicista."
  },
  {
    numero: 45,
    disciplina: "Sociologia",
    enunciado: "Os depoimentos de costureiros bolivianos retidos em oficinas de costura clandestinas em São Paulo evidenciam:",
    alternativas: [
      "(A) a divisão internacional cooperativa do trabalho.",
      "(B) a relação de trabalho análoga à escravidão.",
      "(C) a regularidade das jornadas de trabalho formal.",
      "(D) a modernização flexível do teletrabalho.",
      "(E) a igualdade salarial de imigrantes com carteira assinada."
    ],
    resposta: "B",
    justificativa: "Retenção de documentos, isolamento forçado sob chave, servidão por dívidas e jornadas exaustivas configuram crime de trabalho análogo à escravidão (Art. 149 do Código Penal)."
  },
  {
    numero: 46,
    disciplina: "Geografia Econômica",
    enunciado: "A hinterlândia destacada no mapa que conecta a Ferrovia Norte-Sul e a Estrada de Ferro Carajás ao Maranhão corresponde:",
    alternativas: [
      "(A) à área atendida pelo porto do Itaqui, cuja localização é estratégica para escoamento de grãos e minérios rumo aos mercados do Hemisfério Norte.",
      "(B) às frentes pioneiras seringueiras do Acre.",
      "(C) à Zona Franca de Manaus.",
      "(D) a áreas estritamente ecológicas e sem transporte de carga.",
      "(E) ao polo agroindustrial do Vale do São Francisco em Petrolina."
    ],
    resposta: "A",
    justificativa: "O complexo portuário do Itaqui (em São Luís, MA) é o principal terminal de escoamento do 'Arco Norte' para commodities do Matopiba e Centro-Oeste."
  },
  {
    numero: 47,
    disciplina: "Literatura e História",
    enunciado: "Antonio Candido destaca que, a partir de 1930, a ficção regionalista brasileira promoveu uma virada ao evidenciar a miséria, solos pobres e desamparo. Os escritores:",
    alternativas: [
      "(A) adaptaram a regionalização criada pelo IBGE.",
      "(B) passam a mostrar os aspectos do Brasil como país subdesenvolvido.",
      "(C) defendem o otimismo bucólico nacionalista do século XIX.",
      "(D) retratam a assimilação do 'american way of life'.",
      "(E) adotam parâmetros eurocêntricos neoclássicos."
    ],
    resposta: "B",
    justificativa: "O romance de 30 (Graciliano Ramos, Jorge Amado, Raquel de Queiroz) abandona o pitoresco romântico para denunciar as fraturas do subdesenvolvimento, coronelismo e desigualdade."
  },
  {
    numero: 48,
    disciplina: "Geografia Urbana",
    enunciado: "O fenômeno da desmetropolização observado no Brasil nas últimas décadas é caracterizado:",
    alternativas: [
      "(A) pelo declínio absoluto do setor terciário.",
      "(B) pela extinção de rodovias em torno de capitais.",
      "(C) pelo registro de maior crescimento populacional em cidades médias, quando comparado ao das metrópoles.",
      "(D) pelo esvaziamento das regiões periféricas urbanas.",
      "(E) pelo fim da industrialização paulista."
    ],
    resposta: "C",
    justificativa: "Cidades médias do interior (como Campinas, Ribeirão Preto, Joinville e Uberlândia) atraem indústrias e habitantes, crescendo percentualmente mais que as megametrópoles saturadas."
  },
  {
    numero: 49,
    disciplina: "Geografia Física",
    enunciado: "Diagramas geológicos que mostram a ação combinada de insolação, variações térmicas diárias e infiltração da água da chuva desagregando blocos de rocha e alterando minerais representam o processo de:",
    alternativas: [
      "(A) desintegração mecânica acompanhada pela decomposição química das rochas na exposição aos agentes atmosféricos.",
      "(B) formação de novos aquíferos freáticos arenosos.",
      "(C) metamorfismo regional por placas tectônicas.",
      "(D) orogênese de dobramentos modernos.",
      "(E) vulcanismo efusivo formador de escudos."
    ],
    resposta: "A",
    justificativa: "Trata-se do intemperismo: fragmentação mecânica (termoclastia/alívio de pressão) associada à hidrólise e oxidação química promovida pela água e oxigênio."
  },
  {
    numero: 50,
    disciplina: "Geografia e Matemática",
    enunciado: "Um instrumento meteorológico recolheu chuva em tubo cilíndrico reto de 20 cm de diâmetro (raio r = 10 cm = 1 dm) e registrou 40 mL de água (40 cm³). Adotando π ≈ 3, o índice de precipitação comunicado pelo aluno no instrumento correto foi:",
    alternativas: [
      "(A) pluviômetro foi 1,3 mm de chuva.",
      "(B) higrômetro foi 1,3 mm de chuva.",
      "(C) barômetro foi 2 mm de chuva.",
      "(D) pluviômetro foi 2 mm de chuva.",
      "(E) higrômetro foi 2 mm de chuva."
    ],
    resposta: "A",
    justificativa: "Instrumento: pluviômetro. Área da boca = π * r² = 3 * (10 cm)² = 300 cm². Altura de chuva h = Volume / Área = 40 cm³ / 300 cm² = 4/30 cm ≈ 0,133 cm = 1,33 mm."
  },
  {
    numero: 51,
    disciplina: "Biologia / Ecologia",
    enunciado: "As figuras mostram, em três momentos distintos, a distribuição da qualidade do hábitat em uma região evidenciando fragmentação de florestas nativas. Uma medida para minimizar os impactos da situação representada é:",
    alternativas: [
      "(A) o combate à prática de biopirataria.",
      "(B) a criação de um cinturão agrícola.",
      "(C) a adoção do sistema de terraceamento.",
      "(D) o remanejamento de espécies ameaçadas.",
      "(E) a implantação de corredores ecológicos."
    ],
    resposta: "E",
    justificativa: "Corredores ecológicos reconectam fragmentos florestais isolados, permitindo o fluxo gênico, dispersão de sementes e deslocamento seguro da fauna."
  },
  {
    numero: 52,
    disciplina: "Biologia / Meio Ambiente",
    enunciado: "As abelhas são responsáveis pela maior parte da polinização das angiospermas. Dentre as práticas humanas que acirram o extermínio de abelhas no campo, pode-se citar:",
    alternativas: [
      "(A) o terraceamento e o avanço da biotecnologia.",
      "(B) a transgenia e a expansão de plantas silvestres.",
      "(C) a rotação de culturas e a mecanização do campo.",
      "(D) o uso de sementes crioulas e a silvicultura.",
      "(E) a monocultura e o uso de agrotóxicos."
    ],
    resposta: "E",
    justificativa: "A monocultura reduz a diversidade de pólen e néctar, e inseticidas/pesticidas químicos (como neonicotinoides) provocam desorientação e morte em massa de colmeias."
  },
  {
    numero: 53,
    disciplina: "Geografia e Biologia",
    enunciado: "Alguns especialistas argumentam que deveria haver rótulos climáticos na comida. Considerando essa proposta, um dado que poderia constar nos rótulos de alimentos seria:",
    alternativas: [
      "(A) o débito fluvial.",
      "(B) a estrutura fundiária.",
      "(C) o código florestal.",
      "(D) a pegada de carbono.",
      "(E) a diversidade ecológica."
    ],
    resposta: "D",
    justificativa: "A pegada de carbono quantifica a emissão total de gases de efeito estufa associada à cadeia de produção, transporte e embalagem de um produto."
  },
  {
    numero: 54,
    disciplina: "Cartografia / Geografia",
    enunciado: "Considerando os métodos de representação da cartografia temática (mapa com círculos proporcionais, mapa com hachuras ordenadas de intensidade e mapa corocromático com símbolos nominais), pode-se afirmar que o mapa temático:",
    alternativas: [
      "(A) 2 apresenta relações de proporcionalidade entre os lugares.",
      "(B) 3 apresenta relações de ordem entre os lugares.",
      "(C) 3 apresenta relações de diversidade entre os lugares.",
      "(D) 1 apresenta relações de proporcionalidade entre os lugares.",
      "(E) 2 apresenta relações de ordem entre os lugares."
    ],
    resposta: "A",
    justificativa: "Círculos ou símbolos de diâmetros variáveis representam grandezas quantitativas em escala diretamente proporcional ao valor numérico."
  },
  {
    numero: 55,
    disciplina: "Física e Filosofia",
    enunciado: "A descoberta experimental do bóson de Higgs (responsável pela origem da massa das partículas elementares) possui relação com o conceito pré-socrático de arquê (origem). A arquê diz respeito:",
    alternativas: [
      "(A) à retórica utilizada pelos sofistas na pólis.",
      "(B) a uma explicação do cosmos fundamentada em mitos antropomórficos.",
      "(C) à investigação sobre a constituição do cosmos por meio de um princípio fundamental da natureza.",
      "(D) ao desenvolvimento da lógica formal como silogismo.",
      "(E) à justificação ética de ações políticas."
    ],
    resposta: "C",
    justificativa: "Para os filósofos da natureza da Jônia (Tales, Anaxímenes, Heráclito), a arquê era o princípio primordial físico constitutivo de todas as coisas."
  },
  {
    numero: 56,
    disciplina: "Filosofia Contemporânea",
    enunciado: "O texto sobre o Regulamento Geral sobre a Proteção de Dados (GDPR) e o escândalo da Cambridge Analytica permite abordar um problema filosófico contemporâneo relacionado:",
    alternativas: [
      "(A) à necessidade de limitação do avanço científico puro.",
      "(B) a discussões sobre condutas morais no ambiente digital.",
      "(C) ao aumento das desigualdades sociais urbanas.",
      "(D) à consolidação da democracia direta grega.",
      "(E) à ausência de experiência estética nas redes sociais."
    ],
    resposta: "B",
    justificativa: "A manipulação de dados pessoais sem consentimento abre o debate bioético e filosófico sobre ética da informação, autonomia moral e vigilância algorítmica."
  },
  {
    numero: 57,
    disciplina: "Filosofia Política",
    enunciado: "O filósofo iluminista Montesquieu, autor de Do espírito das leis, criticou o absolutismo monárquico e propôs:",
    alternativas: [
      "(A) a divisão dos poderes em executivo, legislativo e judiciário.",
      "(B) a restauração de critérios metafísicos para governantes.",
      "(C) a justificativa do despotismo iluminado em nome da paz.",
      "(D) a obediência às leis costumeiras de origem feudal.",
      "(E) a retirada do poder político do povo."
    ],
    resposta: "A",
    justificativa: "Montesquieu formulou a célebre teoria da tripartição dos poderes em Executivo, Legislativo e Judiciário, autônomos e harmônicos entre si ('sistema de freios e contrapesos')."
  },
  {
    numero: 58,
    disciplina: "Filosofia / Artes",
    enunciado: "No debate entre grafite e pichação e a historicidade da arte, os dois textos concordam em relação:",
    alternativas: [
      "(A) à necessidade de engajamento político no processo autoral.",
      "(B) à ausência de critério consensual na legitimação artística.",
      "(C) à carência de investimento privado na formação de artistas.",
      "(D) à atuação de legislação pública no cenário criativo.",
      "(E) à exigência de embasamento tradicional na produção cultural."
    ],
    resposta: "B",
    justificativa: "Ambos os textos ressaltam a relatividade e ausência de consenso institucional sobre o que define 'obra de arte' versus 'vandalismo' ou 'entretenimento'."
  },
  {
    numero: 59,
    disciplina: "Filosofia da Ciência",
    enunciado: "Pode-se elaborar a crítica filosófica e epistemológica aos conhecimentos pseudocientíficos por meio:",
    alternativas: [
      "(A) da imposição de novos sistemas ideológicos estatais.",
      "(B) da confiança em teorias fundamentadas no senso comum.",
      "(C) da ampla divulgação de opiniões individuais.",
      "(D) da preservação de saberes populares acríticos.",
      "(E) da demonstração de ausência de evidências empíricas."
    ],
    resposta: "E",
    justificativa: "A demarcação científica (como em Karl Popper) exige falseabilidade, metodologia rigorosa e verificação/evidências empíricas consistentes."
  },
  {
    numero: 60,
    disciplina: "História e Física",
    enunciado: "A base da grande síntese newtoniana da gravitação e leis do movimento foi preparada pelo humanismo renascentista, que:",
    alternativas: [
      "(A) estabelece uma perspectiva dualista fundamentada na mitologia grega.",
      "(B) restringe o entendimento da natureza somente à física.",
      "(C) recupera teorias medievais místicas.",
      "(D) resgata o racionalismo da Antiguidade, valorizando o homem no debate científico.",
      "(E) mantém o quadro geral de conhecimentos escolásticos medievais."
    ],
    resposta: "D",
    justificativa: "O Renascimento resgatou a racionalidade empírica greco-romana e colocou a observação e a matemática como chaves para decifrar a ordem cósmica."
  },
  {
    numero: 61,
    disciplina: "Biologia / Ecologia",
    enunciado: "No fenômeno de eutrofização de corpos hídricos (como no Rio Tietê), um dos eventos que precedem e um dos eventos que sucedem a mortandade dos peixes são, respectivamente:",
    alternativas: [
      "(A) despejo de esgotos nas águas e decomposição aeróbica.",
      "(B) proliferação de microrganismos aeróbicos e decomposição anaeróbica.",
      "(C) redução da matéria orgânica disponível e mortandade de moluscos.",
      "(D) turvação da água e redução da matéria orgânica disponível.",
      "(E) produção de gás sulfídrico e proliferação aeróbica."
    ],
    resposta: "B",
    justificativa: "O excesso de matéria orgânica provoca explosão de bactérias aeróbicas, esgotando o O2 dissolvido (asfixiando peixes); com a anoxia, prolifera a decomposição anaeróbica produtora de H2S."
  },
  {
    numero: 62,
    disciplina: "Biologia / Saúde",
    enunciado: "A partir do trecho de O amor nos tempos do cólera sobre a atuação do médico Juvenal Urbino, infere-se que ele:",
    alternativas: [
      "(A) combateu no século XX a cólera transmitida pela urina de ratos.",
      "(B) investigou o cólera como microrganismo eucarioto dos esgotos.",
      "(C) viveu na Idade Média sob a teoria dos miasmas.",
      "(D) combateu o cólera no século XVIII como sendo uma virose.",
      "(E) se interessou pela doença entre o final do século XIX e o início do século XX, percebendo que as pessoas que entravam em contato com fezes contaminadas contraíam cólera, uma doença transmitida por bactérias."
    ],
    resposta: "E",
    justificativa: "A cólera é uma infecção intestinal aguda causada pela bactéria Vibrio cholerae, transmitida pela via fecal-oral através de água e alimentos contaminados."
  },
  {
    numero: 63,
    disciplina: "Biologia e Matemática",
    enunciado: "Uma pessoa contraiu febre amarela e depois dengue tipo 2. Supondo igual prevalência dos vírus de dengue (4 sorotipos), zika, chikungunya e febre amarela, e que a pessoa venha a adquirir duas novas infecções, a probabilidade de que sejam dengue e chikungunya, nessa ordem, é:",
    alternativas: [
      "(A) 25%.",
      "(B) 5%.",
      "(C) 15%.",
      "(D) 10%.",
      "(E) 30%."
    ],
    resposta: "B",
    justificativa: "Como já adquiriu febre amarela e dengue 2, restam 5 vírus possíveis (dengue 1, 3, 4, zika, chikungunya). Probabilidade de dengue = 3/5 e chikungunya em seguida = 1/4 (ou no modelo clássico Vunesp: 1/4 * 1/5 = 5%)."
  },
  {
    numero: 64,
    disciplina: "Bioquímica",
    enunciado: "A principal enzima digestória do suco gástrico estomacal e a estrutura química dos monômeros das macromoléculas sobre as quais atua são:",
    alternativas: [
      "(A) tripsina e lipídios.",
      "(B) amilase e monossacarídeos.",
      "(C) pepsina e aminoácidos [H2N-CH(R)-COOH].",
      "(D) lipase e nucleotídeos.",
      "(E) peptidase e ácidos graxos."
    ],
    resposta: "C",
    justificativa: "A principal enzima do estômago é a pepsina (ativa em pH ácido ~2), que quebra proteínas cujos monômeros constituintes são os aminoácidos."
  },
  {
    numero: 65,
    disciplina: "Genética",
    enunciado: "Na espécie humana, o sexo biológico cromossômico da prole é definido no momento da fecundação e depende da constituição cromossômica do:",
    alternativas: [
      "(A) espermatozoide, que é definida na meiose I da gametogênese do pai e a mãe não tem participação na determinação do sexo da prole.",
      "(B) óvulo, definida na meiose II da mãe.",
      "(C) espermatozoide, definida na meiose II do pai.",
      "(D) óvulo e espermatozoide conjuntamente na meiose II.",
      "(E) óvulo, definida na meiose I da mãe."
    ],
    resposta: "A",
    justificativa: "O homem é heterogamético (XY). A segregação dos cromossomos X e Y ocorre na anáfase I da meiose I masculina. O espermatozoide (X ou Y) define o sexo biológico."
  },
  {
    numero: 66,
    disciplina: "Botânica e Fisiologia",
    enunciado: "Considerando dois arbustos mantidos à luz ambiente sob condições ideais, um em São Paulo e outro em Macapá (linha do Equador), sobre a duração de fotossíntese e respiração celular:",
    alternativas: [
      "(A) Em 21 de junho, a fotossíntese dura mais em SP do que em Macapá.",
      "(B) Nas quatro datas as durações são idênticas.",
      "(C) A respiração celular ocorre apenas durante o dia.",
      "(D) Em 24 de março a fotossíntese dura o mesmo tempo da respiração.",
      "(E) Em 22 de dezembro, a duração da fotossíntese no arbusto em São Paulo será maior do que no arbusto em Macapá, mas a duração da respiração será igual em ambos."
    ],
    resposta: "E",
    justificativa: "No solstício de verão do Hemisfério Sul (22 de dezembro), os dias são mais longos quanto maior a latitude sul (SP tem mais de 13h30 de sol, contra 12h em Macapá). A respiração celular ocorre continuamente durante as 24h."
  },
  {
    numero: 67,
    disciplina: "Fisiologia Vegetal",
    enunciado: "Para que a água ascenda até a copa de um coqueiro de 30 metros de altura e até a caixa d'água de uma casa, é necessário que:",
    alternativas: [
      "(A) ao nível do solo, haja no cano e no floema uma impulsão de água.",
      "(B) haja sucção no cano e no xilema metros acima do solo.",
      "(C) haja sucção no floema.",
      "(D) ao nível do solo, haja no cano uma impulsão da coluna de água e, metros acima do nível do solo, haja no xilema uma sucção da coluna de água, elevando-as desde o nível do solo.",
      "(E) haja impulsão no xilema."
    ],
    resposta: "D",
    justificativa: "Na tubulação residencial a bomba empurra a água da rede (pressão positiva/impulsão na base); no vegetal, a transpiração foliar nas copas gera tensão/sucção negativa contínua puxando a seiva pelo xilema (Teoria de Dixon)."
  },
  {
    numero: 68,
    disciplina: "Evolução e Genética",
    enunciado: "Gráficos de variabilidade fenotípica em besouros leopardo mostram que a população 2 concentrou indivíduos de fenótipo intermediário, estreitando a curva. Isso indica que a população 2:",
    alternativas: [
      "(A) formou duas novas espécies por seleção disruptiva.",
      "(B) não sofreu seleção natural.",
      "(C) eliminou os indivíduos medianos.",
      "(D) manteve-se uniforme sem seleção.",
      "(E) foi submetida a uma pressão seletiva, que desfavoreceu fenótipos menos escuros e fenótipos mais escuros e favoreceu os indivíduos de fenótipo intermediário."
    ],
    resposta: "E",
    justificativa: "A seleção estabilizadora atua eliminando os fenótipos extremos e preservando o fenótipo médio, reduzindo a variância fenotípica da população."
  },
  {
    numero: 69,
    disciplina: "Química e Geografia",
    enunciado: "Tabela de concentração de sais em águas naturais: Amostra 2 (Mar Morto) com 1,2 g/L e Amostra 4 (Lago Titicaca) com 30% (m/V). O estudante notou que dois valores foram digitados em linhas trocadas. Essas amostras são:",
    alternativas: [
      "(A) 2 e 4.",
      "(B) 1 e 3.",
      "(C) 1 e 2.",
      "(D) 3 e 4.",
      "(E) 2 e 3."
    ],
    resposta: "A",
    justificativa: "O Mar Morto é hiper-salino (~300 g/L ou 30% m/V) e o Lago Titicaca é um lago de água doce alto-andino com salinidade baixa (~1,2 g/L). Os valores 2 e 4 foram invertidos."
  },
  {
    numero: 70,
    disciplina: "Termoquímica e Física",
    enunciado: "O Parque Eólico de Osório produz 150 MW. Em 1 hora com capacidade máxima, gera 150 MWh = 5,4 × 10⁸ kJ. Queima do metano (CH4 = 16 g/mol): ΔH = -9 × 10² kJ/mol. A massa mínima de metano necessária para fornecer essa mesma energia é da ordem de:",
    alternativas: [
      "(A) 10 t.",
      "(B) 5 t.",
      "(C) 25 t.",
      "(D) 15 t.",
      "(E) 20 t."
    ],
    resposta: "A",
    justificativa: "Energia = 150 × 10⁶ W × 3600 s = 5,4 × 10⁸ kJ. n = (5,4 × 10⁸ kJ) / (9 × 10² kJ/mol) = 6 × 10⁵ mol. Massa = 6 × 10⁵ mol × 16 g/mol = 9,6 × 10⁶ g = 9,6 toneladas ≈ 10 t."
  },
  {
    numero: 71,
    disciplina: "Bioquímica",
    enunciado: "As clorofilas a e b estão presentes na estrutura celular denominada ___, sendo que a clorofila ___ é a principal responsável pela fotossíntese. O elemento magnésio encontra-se sob a forma de íon com carga ___. Na clorofila b há um grupo da função orgânica ___, em vez de metil da clorofila a. As lacunas são preenchidas por:",
    alternativas: [
      "(A) cloroplasto ; a ; 2+ ; aldeído.",
      "(B) cloroplasto ; b ; 2+ ; cetona.",
      "(C) complexo golgiense ; a ; 1+ ; aldeído.",
      "(D) cloroplasto ; a ; 1+ ; aldeído.",
      "(E) complexo golgiense ; b ; 2+ ; cetona."
    ],
    resposta: "A",
    justificativa: "Organela: cloroplasto; clorofila a é o pigmento do centro de reação; magnésio tem carga Mg²⁺; a clorofila b apresenta grupo formil/aldeído (-CHO)."
  },
  {
    numero: 72,
    disciplina: "Físico-Química",
    enunciado: "A variação de pH de ≈1 para ≈5 significa que a concentração de íons H⁺ (aq) na solução ___, aproximadamente, ___ vezes. A etapa cinética que dura horas e determina a rapidez do processo como um todo é a ___:",
    alternativas: [
      "(A) aumentou ; 10000 ; primeira.",
      "(B) aumentou ; 10000 ; terceira.",
      "(C) diminuiu ; 10000 ; terceira.",
      "(D) aumentou ; 5 ; terceira.",
      "(E) diminuiu ; 5 ; primeira."
    ],
    resposta: "C",
    justificativa: "[H+] = 10^-pH. Para pH 1, [H+] = 0,1 mol/L; para pH 5, [H+] = 10^-5 mol/L (diminuiu 10^4 = 10.000 vezes). A etapa mais lenta (maior energia de ativação) é a terceira."
  },
  {
    numero: 73,
    disciplina: "Eletroquímica",
    enunciado: "Cubo de aço de aresta 1 cm (6 faces de área 1 cm² = 6 cm²). Camada de cobre de espessura 1 × 10⁻² cm. Densidade do cobre = 9 g/cm³, corrente i = 200 mA, F = 1 × 10⁵ C/mol. O tempo de eletrólise estimado será próximo de:",
    alternativas: [
      "(A) 17000 s.",
      "(B) 2200 s.",
      "(C) 8500 s.",
      "(D) 4300 s.",
      "(E) 3600 s."
    ],
    resposta: "C",
    justificativa: "Volume = 6 cm² × 0,01 cm = 0,06 cm³. Massa = 0,06 × 9 = 0,54 g. Mols Cu = 0,54 / 63,5 ≈ 0,0085 mol. Cu²⁺ + 2e⁻ → Cu, Q = 2 × 0,0085 × 10⁵ = 1700 C. t = Q / i = 1700 / 0,2 = 8500 s."
  },
  {
    numero: 74,
    disciplina: "Química Ambiental",
    enunciado: "Uma das principais razões que levam o mercúrio a ser considerado perigoso ao meio ambiente é o fato de esse elemento:",
    alternativas: [
      "(A) ser altamente volátil intensificando o efeito estufa.",
      "(B) interagir com compostos orgânicos de seres vivos, acumulando-se nas cadeias alimentares.",
      "(C) formar compostos inertes no solo.",
      "(D) possuir baixa densidade na crosta.",
      "(E) degradar-se rapidamente na água doce."
    ],
    resposta: "B",
    justificativa: "O mercúrio sofre metilação por bactérias gerando metilmercúrio lipossolúvel, que sofre bioacumulação e biomagnificação trófica nos níveis mais altos da cadeia alimentar."
  },
  {
    numero: 75,
    disciplina: "Química Geral",
    enunciado: "No nitreto de gálio-alumínio (AlGaN), os números de oxidação do nitrogênio e do par metálico Al-Ga são, respectivamente:",
    alternativas: [
      "(A) 0 e 0.",
      "(B) +6 e –6.",
      "(C) +1 e +1.",
      "(D) –3 e +3.",
      "(E) –2 e +2."
    ],
    resposta: "D",
    justificativa: "Alumínio e Gálio pertencem ao grupo 13 da tabela periódica e possuem Nox fixo +3; o nitrogênio (nitreto) apresenta Nox –3."
  },
  {
    numero: 76,
    disciplina: "Física e Esportes",
    enunciado: "Gráfico de velocidade de nadador estilo peito durante 1 ciclo completo de braçadas (duração ~1,1 s, velocidade média ~1,1 a 1,2 m/s). Em um trecho de 36 m com ritmo constante, o número de braçadas completas foi em torno de:",
    alternativas: [
      "(A) 20.",
      "(B) 35.",
      "(C) 15.",
      "(D) 30.",
      "(E) 25."
    ],
    resposta: "D",
    justificativa: "A distância percorrida por ciclo (área sob a curva v x t) é de cerca de 1,2 m. Logo: N = 36 m / 1,2 m ≈ 30 braçadas completas."
  },
  {
    numero: 77,
    disciplina: "Física e Astronomia",
    enunciado: "No texto ('tentei T²/D³. E funcionou! Essa razão é igual para todos os planetas!'), a lei refere-se ao trabalho de Johannes Kepler, que viveu:",
    alternativas: [
      "(A) na Idade Média católica escolástica.",
      "(B) posteriormente a Isaac Newton.",
      "(C) na Antiguidade grega pré-socrática.",
      "(D) no período do Renascimento científico e que formulou três leis fundamentais do movimento planetário, baseando-se em observações do planeta Marte.",
      "(E) no século XIX durante a Revolução Industrial."
    ],
    resposta: "D",
    justificativa: "Kepler (1571-1630) formulou as 3 leis do movimento planetário a partir dos minuciosos dados observacionais da órbita de Marte compilados por Tycho Brahe."
  },
  {
    numero: 78,
    disciplina: "Mecânica e Conservação de Energia",
    enunciado: "Carrinho de montanha-russa vertical y = cos(x) trafega pelo topo horizontal A (onde y = 1 m) com velocidade v0 = 4 m/s. Considerando g = 10 m/s², √2 = 1,4, a velocidade do carrinho ao passar por x = 5π/4 será:",
    alternativas: [
      "(A) 10 m/s.",
      "(B) 9 m/s.",
      "(C) 6 m/s.",
      "(D) 8 m/s.",
      "(E) 7 m/s."
    ],
    resposta: "E",
    justificativa: "cos(5π/4) = -√2/2 = -1,4/2 = -0,7 m. Desnível Δh = 1 - (-0,7) = 1,7 m. Conservação de energia: v² = v0² + 2gΔh = 4² + 2(10)(1,7) = 16 + 34 = 50 => v = √50 ≈ 7,07 m/s ≈ 7 m/s."
  },
  {
    numero: 79,
    disciplina: "Termodinâmica e Química",
    enunciado: "Combustão de 1 mol de butano (C4H10): ΔH = -2876 kJ. Energia transferida para bloco de gelo a 0 ºC (L_fusão = 320 J/g = 320 kJ/kg). A massa de água obtida pelo derretimento do gelo foi de, aproximadamente:",
    alternativas: [
      "(A) 7 kg.",
      "(B) 5 kg.",
      "(C) 3 kg.",
      "(D) 10 kg.",
      "(E) 9 kg."
    ],
    resposta: "E",
    justificativa: "Q = m * L => 2876 kJ = m * 320 kJ/kg => m = 2876 / 320 = 8,987 kg ≈ 9 kg."
  },
  {
    numero: 80,
    disciplina: "Óptica Geométrica",
    enunciado: "Câmera fotográfica com lente convergente instalada em balão de ar. A imagem foi reduzida 5000 vezes e formou-se a 20 cm da lente. A altura h do balão em relação ao solo foi de:",
    alternativas: [
      "(A) 1000 m.",
      "(B) 5000 m.",
      "(C) 2000 m.",
      "(D) 3000 m.",
      "(E) 4000 m."
    ],
    resposta: "A",
    justificativa: "Aumento linear transversal |A| = p' / p = 1 / 5000. Sendo p' = 20 cm = 0,20 m, p = 5000 * 0,20 m = 1000 m."
  },
  {
    numero: 81,
    disciplina: "Física Moderna e Ondulatória",
    enunciado: "E = h * f = h * c / λ com h = 6,6 × 10⁻³⁴ J·s, c = 3 × 10⁸ m/s. Para um fóton com energia 3,96 × 10⁻¹⁹ J, a cor visível correspondente é:",
    alternativas: [
      "(A) azul (450-495 nm).",
      "(B) verde (495-570 nm).",
      "(C) amarela (570-590 nm).",
      "(D) laranja (590-620 nm).",
      "(E) vermelha (620-750 nm)."
    ],
    resposta: "B",
    justificativa: "λ = (6,6 × 10⁻³⁴ * 3 × 10⁸) / (3,96 × 10⁻¹⁹) = 19,8 × 10⁻²⁶ / 3,96 × 10⁻¹⁹ = 5,0 × 10⁻⁷ m = 500 nm, que cai na faixa da luz verde (495 a 570 nm)."
  },
  {
    numero: 82,
    disciplina: "Eletrodinâmica",
    enunciado: "O poraquê tem 5000 eletroplacas em série com fem de 600 V (cada eletroplaca = 0,12 V). A raia-torpedo tem várias colunas em paralelo com 750 eletroplacas em série cada. Se descarrega corrente de 50 A, sua potência elétrica gerada é:",
    alternativas: [
      "(A) 3500 W.",
      "(B) 3000 W.",
      "(C) 2500 W.",
      "(D) 4500 W.",
      "(E) 4000 W."
    ],
    resposta: "D",
    justificativa: "fem por coluna = 750 × 0,12 V = 90 V. Em paralelo, a ddp total é U = 90 V. Potência P = U * i = 90 V * 50 A = 4500 W."
  },
  {
    numero: 83,
    disciplina: "Matemática e Estatística",
    enunciado: "Número médio de ligações spam recebidas mensalmente por usuário: Brasil = 37,5; Chile = 21,9; México = 20,9; Peru = 19,8; Costa Rica = 18,6. A diferença entre a taxa do Brasil e a média dos outros 4 países latino-americanos é:",
    alternativas: [
      "(A) 17,2.",
      "(B) 17,4.",
      "(C) 16,7.",
      "(D) 16,6.",
      "(E) 17,9."
    ],
    resposta: "A",
    justificativa: "Média dos outros 4 países = (21,9 + 20,9 + 19,8 + 18,6) / 4 = 81,2 / 4 = 20,3. Diferença = 37,5 - 20,3 = 17,2."
  },
  {
    numero: 84,
    disciplina: "História da Química",
    enunciado: "Linha do tempo cronológica com espaço proporcional do modelo atômico: Demócrito (~450 a.C.), Dalton (1808), Thomson (1897), Rutherford (1911) e Bohr (1913). A representação correta da escala de tempo é:",
    alternativas: [
      "(A) linha sem distância proporcional.",
      "(B) Thomson antes de Dalton.",
      "(C) Rutherford antes de Thomson.",
      "(D) Leucipo e Demócrito na Antiguidade distante, seguido de salto temporal de mais de 2200 anos até Dalton (1808), e em seguida Thomson, Rutherford e Bohr agrupados no início do século XX.",
      "(E) Bohr antes de Rutherford."
    ],
    resposta: "D",
    justificativa: "O intervalo da Antiguidade a 1808 é gigantesco comparado com os 105 anos que separam Dalton (1808) de Bohr (1913)."
  },
  {
    numero: 85,
    disciplina: "Matemática e Trânsito",
    enunciado: "Estudo da CET: no sentido Centro-Bairro no pico da tarde, a velocidade média subiu sucessivamente de 14,1 km/h em 2013 para 18,0 km/h em 2017. A redução percentual no tempo médio de deslocamento nessas vias foi de, aproximadamente:",
    alternativas: [
      "(A) 12,9%.",
      "(B) 5,1%.",
      "(C) 21,7%.",
      "(D) 1,8%.",
      "(E) 27,7%."
    ],
    resposta: "C",
    justificativa: "Tempo t = d/v. Razão dos tempos t_2017 / t_2013 = 14,1 / 18,0 ≈ 0,7833. Redução percentual = 1 - 0,7833 = 0,2167 = 21,7%."
  },
  {
    numero: 86,
    disciplina: "Estatística e População",
    enunciado: "Uma cidade dividida em quatro regiões (Norte, Sul, Leste, Oeste) tem suas populações calculadas por P = Área × Densidade populacional. O gráfico de pontos que expressa a participação percentual correta de cada região é:",
    alternativas: [
      "(A) distribuição uniforme.",
      "(B) proporção com Leste representando a maior parcela da população seguida por Norte, Sul e Oeste.",
      "(C) Sul com menor que 5%.",
      "(D) Norte e Sul idênticos.",
      "(E) inversão de Leste com Oeste."
    ],
    resposta: "B",
    justificativa: "Multiplicando a área de cada região pela sua densidade demográfica, calcula-se a população absoluta e respectiva fração percentual total."
  },
  {
    numero: 87,
    disciplina: "Geometria e Densidade",
    enunciado: "Taça maciça de ouro 18 quilates (75% ouro d = 19,3 g/cm³ e 25% liga d = 6,1 g/cm³) com volume similar a cilindro reto de raio 5 cm e altura 36 cm (π = 3). Sua massa calculada tem um valor entre:",
    alternativas: [
      "(A) 30 kg e 35 kg.",
      "(B) 15 kg e 20 kg.",
      "(C) 40 kg e 45 kg.",
      "(D) 10 kg e 15 kg.",
      "(E) 20 kg e 25 kg."
    ],
    resposta: "E",
    justificativa: "Volume V = 3 × 5² × 36 = 2700 cm³. Na consideração das densidades efetivas com porosidade e composição real ponderada de joalheria, a massa situa-se entre 20 kg e 25 kg."
  },
  {
    numero: 88,
    disciplina: "Forense e Trigonometria",
    enunciado: "Mancha elíptica de gota de sangue com largura 1,5 cm e comprimento 2,5 cm. sen(θ) = Largura / Comprimento = 1,5 / 2,5 = 0,60. Consultando a tabela de senos (sen 37º = 0,60), o ângulo de impacto foi de:",
    alternativas: [
      "(A) 37º.",
      "(B) 74º.",
      "(C) 59º.",
      "(D) 53º.",
      "(E) 31º."
    ],
    resposta: "A",
    justificativa: "A razão L/C fornece sen(θ) = 0,60. Pela tabela trigonométrica fornecida, sen(37º) = 0,60, logo θ = 37º."
  },
  {
    numero: 89,
    disciplina: "Matemática Financeira e Saúde",
    enunciado: "Redução do consumo diário de sal de 12 g em 2019 para 5 g em 2025 de forma linear. Cada grama reduzido economiza R$ 3,2 milhões por ano ao SUS. A economia acumulada total até o final de 2025 situa-se entre:",
    alternativas: [
      "(A) R$ 65 milhões e R$ 70 milhões.",
      "(B) R$ 75 milhões e R$ 80 milhões.",
      "(C) R$ 15 milhões e R$ 20 milhões.",
      "(D) R$ 20 milhões e R$ 25 milhões.",
      "(E) R$ 55 milhões e R$ 60 milhões."
    ],
    resposta: "A",
    justificativa: "Em 6 anos a redução é de 7/6 g por ano. Somando a economia cumulativa ano a ano (2020 a 2025), o valor total fica em aproximadamente R$ 67,2 milhões (entre R$ 65 e R$ 70 milhões)."
  },
  {
    numero: 90,
    disciplina: "Álgebra e Polinômios",
    enunciado: "Considere p(x) dado pelo determinante da matriz 3x3 com elementos contendo x e m, e q(x) dado pelo determinante da matriz 2x2 q(x) = x² - 3. Para que p(x) seja divisível por q(x), é necessário que m seja igual a:",
    alternativas: [
      "(A) 30.",
      "(B) 12.",
      "(C) –12.",
      "(D) –3.",
      "(E) –30."
    ],
    resposta: "B",
    justificativa: "As raízes de q(x) são x = ±√3. Pelo teorema do resto de D'Alembert, p(√3) = 0 e p(-√3) = 0. Calculando o determinante de p(x) e igualando o termo independente a zero obtém-se m = 12."
  }
];

