import { Vestibular, ContentTopic } from './types';

export const VESTIBULARES_DATA: Record<Vestibular, ContentTopic[]> = {
  [Vestibular.ENEM]: [
    {
      subject: 'Química',
      topics: [
        { name: 'Ligações químicas', percentage: 10, summary: 'Estudo das uniões entre átomos.' },
        { name: 'Funções orgânicas', percentage: 10, summary: 'Estudo dos grupos funcionais orgânicos.' },
        { name: 'Estequiometria', percentage: 10, summary: 'Cálculos químicos.' },
        { name: 'Soluções', percentage: 10, summary: 'Misturas homogêneas.' },
        { name: 'pH e pOH', percentage: 10, summary: 'Acidez e alcalinidade.' },
        { name: 'Reações químicas', percentage: 10, summary: 'Transformações da matéria.' },
        { name: 'Eletroquímica', percentage: 10, summary: 'Oxirredução e pilhas.' },
        { name: 'Química ambiental', percentage: 10, summary: 'Solos, água e atmosfera.' },
        { name: 'Petróleo e polímeros', percentage: 10, summary: 'Combustíveis e macromoléculas.' },
        { name: 'Separação de misturas', percentage: 10, summary: 'Processos de separação.' },
      ]
    },
    {
      subject: 'Física',
      topics: [
        { name: 'Cinemática', percentage: 10, summary: 'Estudo do movimento.' },
        { name: 'Leis de Newton', percentage: 10, summary: 'Dinâmica clássica.' },
        { name: 'Trabalho e energia', percentage: 10, summary: 'Conceitos de energia.' },
        { name: 'Potência', percentage: 10, summary: 'Taxa de realização de trabalho.' },
        { name: 'Calorimetria', percentage: 10, summary: 'Trocas de calor.' },
        { name: 'Ondulatória', percentage: 10, summary: 'Propriedades das ondas.' },
        { name: 'Eletricidade básica', percentage: 10, summary: 'Carga e campo elétrico.' },
        { name: 'Circuitos elétricos', percentage: 10, summary: 'Resistores e leis de Ohm.' },
        { name: 'Pressão e hidrostática', percentage: 10, summary: 'Fluidos em equilíbrio.' },
        { name: 'Óptica', percentage: 10, summary: 'Luz e fontes luminosas.' },
      ]
    },
    {
      subject: 'Biologia',
      topics: [
        { name: 'Ecologia', percentage: 10, summary: 'Estudo das interações.' },
        { name: 'Cadeia alimentar', percentage: 10, summary: 'Fluxo de energia.' },
        { name: 'Genética', percentage: 10, summary: 'Hereditariedade.' },
        { name: 'DNA e RNA', percentage: 10, summary: 'Ácidos nucleicos.' },
        { name: 'Evolução', percentage: 10, summary: 'Seleção natural.' },
        { name: 'Citologia', percentage: 10, summary: 'Estrutura celular.' },
        { name: 'Sistema imunológico', percentage: 10, summary: 'Defesa do organismo.' },
        { name: 'Fisiologia humana', percentage: 10, summary: 'Sistemas corporais.' },
        { name: 'Biotecnologia', percentage: 10, summary: 'Tecnologias biológicas.' },
        { name: 'Ciclos biogeoquímicos', percentage: 10, summary: 'Ciclos da matéria.' },
      ]
    },
    {
      subject: 'Matemática',
      topics: [
        { name: 'Funções (1º e 2º grau)', percentage: 10, summary: 'Modelagem algébrica.' },
        { name: 'Porcentagem', percentage: 10, summary: 'Razões centesimais.' },
        { name: 'Razão e proporção', percentage: 10, summary: 'Proporcionalidade.' },
        { name: 'Regra de três', percentage: 10, summary: 'Resolução de problemas.' },
        { name: 'Estatística', percentage: 10, summary: 'Média, moda, mediana.' },
        { name: 'Probabilidade', percentage: 10, summary: 'Análise de chances.' },
        { name: 'Geometria plana', percentage: 10, summary: 'Figuras bidimensionais.' },
        { name: 'Geometria espacial', percentage: 10, summary: 'Corpos tridimensionais.' },
        { name: 'Escala', percentage: 10, summary: 'Proporções em mapas e modelos.' },
        { name: 'Análise de gráficos', percentage: 10, summary: 'Interpretação de dados visuais.' },
      ]
    },
    {
      subject: 'História',
      topics: [
        { name: 'Brasil Colônia', percentage: 10, summary: 'Período colonial.' },
        { name: 'Escravidão', percentage: 10, summary: 'Estrutura social colônia/imperial.' },
        { name: 'Independência do Brasil', percentage: 10, summary: 'Processo emancipatório.' },
        { name: 'Brasil República', percentage: 10, summary: 'Início da República.' },
        { name: 'Era Vargas', percentage: 10, summary: 'Governo de Getúlio Vargas.' },
        { name: 'Ditadura militar', percentage: 10, summary: 'Regime pós-1964.' },
        { name: 'Revolução Industrial', percentage: 10, summary: 'Transformações globais.' },
        { name: 'Imperialismo', percentage: 10, summary: 'Expansão colonial tardia.' },
        { name: 'Guerras Mundiais', percentage: 10, summary: 'Conflitos globais.' },
        { name: 'Guerra Fria', percentage: 10, summary: 'Polarização global.' },
      ]
    },
    {
      subject: 'Geografia',
      topics: [
        { name: 'Globalização', percentage: 10, summary: 'Interdependência mundial.' },
        { name: 'Geopolítica', percentage: 10, summary: 'Poder e espaço.' },
        { name: 'Urbanização', percentage: 10, summary: 'Processos urbanos.' },
        { name: 'Industrialização', percentage: 10, summary: 'Mudanças no espaço industrial.' },
        { name: 'Questões ambientais', percentage: 10, summary: 'Sustentabilidade.' },
        { name: 'Energia', percentage: 10, summary: 'Fontes energéticas.' },
        { name: 'Agricultura', percentage: 10, summary: 'Espaço rural.' },
        { name: 'Demografia', percentage: 10, summary: 'Dinâmica populacional.' },
        { name: 'Cartografia', percentage: 10, summary: 'Representação do espaço.' },
        { name: 'Clima', percentage: 10, summary: 'Dinâmica climática.' },
      ]
    },
    {
      subject: 'Sociologia',
      topics: [
        { name: 'Cultura', percentage: 10, summary: 'Conceitos culturais.' },
        { name: 'Cidadania', percentage: 10, summary: 'Exercício de direitos.' },
        { name: 'Movimentos sociais', percentage: 10, summary: 'Lutas por direitos.' },
        { name: 'Desigualdade social', percentage: 10, summary: 'Estrutura de classes.' },
        { name: 'Poder e política', percentage: 10, summary: 'Relações de domínio.' },
        { name: 'Trabalho e sociedade', percentage: 10, summary: 'Relações laborales.' },
        { name: 'Globalização', percentage: 10, summary: 'Aspectos sociológicos.' },
        { name: 'Ideologia', percentage: 10, summary: 'Representações sociais.' },
        { name: 'Indústria cultural', percentage: 10, summary: 'Produção em massa.' },
        { name: 'Controle social', percentage: 10, summary: 'Regulação social.' },
      ]
    },
    {
      subject: 'Filosofia',
      topics: [
        { name: 'Mito e filosofia', percentage: 10, summary: 'A passagem do mito ao logos.' },
        { name: 'Sócrates, Platão e Aristóteles', percentage: 10, summary: 'Filosofia grega clássica.' },
        { name: 'Ética', percentage: 10, summary: 'Teorias éticas.' },
        { name: 'Moral', percentage: 10, summary: 'Fundamentos da moral.' },
        { name: 'Política', percentage: 10, summary: 'Filosofia política.' },
        { name: 'Contratualismo', percentage: 10, summary: 'Teorias do contrato social.' },
        { name: 'Iluminismo', percentage: 10, summary: 'Século das Luzes.' },
        { name: 'Existencialismo', percentage: 10, summary: 'Filosofia da existência.' },
        { name: 'Filosofia moderna', percentage: 10, summary: 'Pensamento moderno.' },
        { name: 'Filosofia contemporânea', percentage: 10, summary: 'Pensamento atual.' },
      ]
    },
    {
      subject: 'Artes',
      topics: [
        { name: 'Barroco', percentage: 20, summary: 'O estilo Barroco no Brasil e na Europa: contraste, drama e religiosidade.', youtubeId: 'X7K6GZJnyIs' },
        { name: 'Romantismo', percentage: 20, summary: 'A subjetividade, emoção e nacionalismo nas artes do Romantismo.', youtubeId: 'Z0lVfB_J3k4' },
        { name: 'Realismo', percentage: 20, summary: 'O Realismo nas artes: a representação fiel do cotidiano e a crítica social.', youtubeId: 'v8A9U1T5tRE' },
        { name: 'Modernismo', percentage: 20, summary: 'A Semana de Arte Moderna de 1922 e as vanguardas artísticas europeias.', youtubeId: 'pS2tE6a-T5g' },
        { name: 'Arte Contemporânea', percentage: 20, summary: 'As novas linguagens: conceitualismo, performance, instalações e efemeridade.', youtubeId: 'lZ_2p18Y0qg' }
      ]
    }
  ],
  [Vestibular.FUVEST]: [
    {
      subject: 'Matemática',
      topics: [
        { name: 'Geometria Plana', percentage: 20, summary: 'Áreas, semelhança de triângulos e trigonometria.', youtubeId: 'Fuv_m_1_real' },
        { name: 'Trigonometria', percentage: 15, summary: 'Funções trigonométricas e identidades.', youtubeId: 'Fuv_m_2_real' },
        { name: 'Geometria Analítica', percentage: 12, summary: 'Retas, circunferências e cônicas.', youtubeId: 'Fuv_m_3_real' },
        { name: 'Logaritmos e Exponenciais', percentage: 10, summary: 'Propriedades e equações.', youtubeId: 'Fuv_m_4_real' },
        { name: 'Análise Combinatória', percentage: 8, summary: 'Arranjos, combinações e permutações.', youtubeId: 'Fuv_m_5_real' }
      ]
    },
    {
      subject: 'Português',
      topics: [
        { name: 'Gramática', percentage: 30, summary: 'Sintaxe, morfologia e pontuação.', youtubeId: 'Fuv_p_1' },
        { name: 'Literatura Brasileira', percentage: 25, summary: 'Obras obrigatórias e escolas literárias.', youtubeId: 'Fuv_p_2' },
        { name: 'Figuras de Linguagem', percentage: 10, summary: 'Metáfora, metonímia, antítese, etc.', youtubeId: 'Fuv_p_3' },
        { name: 'Coesão e Coerência', percentage: 10, summary: 'Mecanismos de articulação textual.', youtubeId: 'Fuv_p_4' }
      ]
    },
    {
      subject: 'Biologia',
      topics: [
        { name: 'Ecologia', percentage: 20, summary: 'Cadeias alimentares, ciclos biogeoquímicos e impactos ambientais.', youtubeId: 'Fuv_b_1' },
        { name: 'Genética', percentage: 15, summary: 'Leis de Mendel, biotecnologia e DNA.', youtubeId: 'Fuv_b_2' },
        { name: 'Fisiologia Animal', percentage: 12, summary: 'Sistemas do corpo humano.', youtubeId: 'Fuv_b_3' }
      ]
    },
    {
      subject: 'Física',
      topics: [
        { name: 'Mecânica', percentage: 35, summary: 'Dinâmica, estática e gravitação.', youtubeId: 'Fuv_f_1' },
        { name: 'Óptica', percentage: 15, summary: 'Reflexão, refração e lentes.', youtubeId: 'Fuv_f_2' }
      ]
    },
    {
      subject: 'Química',
      topics: [
        { name: 'Físico-Química', percentage: 30, summary: 'Equilíbrio químico e soluções.', youtubeId: 'Fuv_q_1' },
        { name: 'Química Orgânica', percentage: 25, summary: 'Reações orgânicas e isomeria.', youtubeId: 'Fuv_q_2' }
      ]
    },
    {
      subject: 'História',
      topics: [
        { name: 'História Geral', percentage: 40, summary: 'Antiguidade, Idade Média e Contemporânea.', youtubeId: 'Fuv_h_1' },
        { name: 'História do Brasil', percentage: 40, summary: 'Império e República.', youtubeId: 'Fuv_h_2' }
      ]
    },
    {
      subject: 'Geografia',
      topics: [
        { name: 'Geografia Física', percentage: 30, summary: 'Clima, relevo e vegetação.', youtubeId: 'Fuv_g_1' },
        { name: 'Geografia Humana', percentage: 30, summary: 'Demografia e urbanização.', youtubeId: 'Fuv_g_2' }
      ]
    },
    {
      subject: 'Filosofia',
      topics: [
        { name: 'Filosofia Moderna', percentage: 20, summary: 'Racionalismo e Empirismo.', youtubeId: 'Fuv_phi_1' }
      ]
    },
    {
      subject: 'Sociologia',
      topics: [
        { name: 'Mundo do Trabalho', percentage: 20, summary: 'Transformações produtivas e sociais.', youtubeId: 'Fuv_soc_1' }
      ]
    },
    {
      subject: 'Artes',
      topics: [
        { name: 'Barroco', percentage: 20, summary: 'O estilo Barroco no Brasil e na Europa: contraste, drama e religiosidade.', youtubeId: 'X7K6GZJnyIs' },
        { name: 'Romantismo', percentage: 20, summary: 'A subjetividade, emoção e nacionalismo nas artes do Romantismo.', youtubeId: 'Z0lVfB_J3k4' },
        { name: 'Realismo', percentage: 20, summary: 'O Realismo nas artes: a representação fiel do cotidiano e a crítica social.', youtubeId: 'v8A9U1T5tRE' },
        { name: 'Modernismo', percentage: 20, summary: 'A Semana de Arte Moderna de 1922 e as vanguardas artísticas europeias.', youtubeId: 'pS2tE6a-T5g' },
        { name: 'Arte Contemporânea', percentage: 20, summary: 'As novas linguagens: conceitualismo, performance, instalações e efemeridade.', youtubeId: 'lZ_2p18Y0qg' }
      ]
    },
    {
      subject: 'Inglês',
      topics: [
        { name: 'Interpretação de Texto', percentage: 100, summary: 'Análise de textos acadêmicos e jornalísticos.', youtubeId: 'Fuv_eng_1' }
      ]
    }
  ],
  [Vestibular.UNICAMP]: [
    {
      subject: 'Matemática',
      topics: [
        { name: 'Funções', percentage: 20, summary: 'Análise de gráficos e modelagem.', youtubeId: 'Uni_m_1' },
        { name: 'Probabilidade', percentage: 15, summary: 'Cálculos de chances e análise combinatória.', youtubeId: 'Uni_m_2' }
      ]
    },
    {
      subject: 'Português',
      topics: [
        { name: 'Gêneros Textuais', percentage: 40, summary: 'Produção e análise de diversos gêneros.', youtubeId: 'Uni_p_1' },
        { name: 'Literatura', percentage: 30, summary: 'Obras obrigatórias e intertextualidade.', youtubeId: 'Uni_p_2' }
      ]
    },
    {
      subject: 'História',
      topics: [
        { name: 'Brasil Colônia', percentage: 18, summary: 'Ciclo do açúcar, ouro e escravidão.', youtubeId: 'Uni_h_1' },
        { name: 'Idade Moderna', percentage: 15, summary: 'Renascimento e Reformas Religiosas.', youtubeId: 'Uni_h_2' },
        { name: 'História da África', percentage: 10, summary: 'Reinos africanos e diáspora.', youtubeId: 'Uni_h_3' }
      ]
    },
    {
      subject: 'Geografia',
      topics: [
        { name: 'Geopolítica', percentage: 25, summary: 'Conflitos e relações internacionais.', youtubeId: 'Uni_g_1' },
        { name: 'Geografia do Brasil', percentage: 25, summary: 'Regiões e economia brasileira.', youtubeId: 'Uni_g_2' }
      ]
    },
    {
      subject: 'Biologia',
      topics: [
        { name: 'Botânica', percentage: 15, summary: 'Fisiologia e morfologia vegetal.', youtubeId: 'Uni_b_1' },
        { name: 'Evolução', percentage: 15, summary: 'Teorias evolutivas e especiação.', youtubeId: 'Uni_b_2' }
      ]
    },
    {
      subject: 'Física',
      topics: [
        { name: 'Termodinâmica', percentage: 20, summary: 'Leis da termodinâmica e máquinas térmicas.', youtubeId: 'Uni_f_1' },
        { name: 'Ondulatória', percentage: 20, summary: 'Fenômenos ondulatórios e som.', youtubeId: 'Uni_f_2' }
      ]
    },
    {
      subject: 'Química',
      topics: [
        { name: 'Atomística', percentage: 20, summary: 'Modelos atômicos e tabela periódica.', youtubeId: 'Uni_q_1' },
        { name: 'Estequiometria', percentage: 20, summary: 'Cálculos químicos e leis ponderais.', youtubeId: 'Uni_q_2' }
      ]
    },
    {
      subject: 'Filosofia',
      topics: [
        { name: 'Ética', percentage: 20, summary: 'Valores e conduta humana.', youtubeId: 'Uni_phi_1' }
      ]
    },
    {
      subject: 'Sociologia',
      topics: [
        { name: 'Cidadania', percentage: 20, summary: 'Direitos e deveres na sociedade.', youtubeId: 'Uni_soc_1' }
      ]
    },
    {
      subject: 'Artes',
      topics: [
        { name: 'Barroco', percentage: 20, summary: 'O estilo Barroco no Brasil e na Europa: contraste, drama e religiosidade.', youtubeId: 'X7K6GZJnyIs' },
        { name: 'Romantismo', percentage: 20, summary: 'A subjetividade, emoção e nacionalismo nas artes do Romantismo.', youtubeId: 'Z0lVfB_J3k4' },
        { name: 'Realismo', percentage: 20, summary: 'O Realismo nas artes: a representação fiel do cotidiano e a crítica social.', youtubeId: 'v8A9U1T5tRE' },
        { name: 'Modernismo', percentage: 20, summary: 'A Semana de Arte Moderna de 1922 e as vanguardas artísticas europeias.', youtubeId: 'pS2tE6a-T5g' },
        { name: 'Arte Contemporânea', percentage: 20, summary: 'As novas linguagens: conceitualismo, performance, instalações e efemeridade.', youtubeId: 'lZ_2p18Y0qg' }
      ]
    },
    {
      subject: 'Inglês',
      topics: [
        { name: 'Interpretação', percentage: 100, summary: 'Textos de diversas fontes.', youtubeId: 'Uni_eng_1' }
      ]
    }
  ],
  [Vestibular.UNESP]: [
    {
      subject: 'Matemática',
      topics: [
        { name: 'Geometria', percentage: 25, summary: 'Plana e espacial.', youtubeId: 'Une_m_1' },
        { name: 'Álgebra', percentage: 20, summary: 'Equações e sistemas.', youtubeId: 'Une_m_2' }
      ]
    },
    {
      subject: 'Português',
      topics: [
        { name: 'Literatura', percentage: 30, summary: 'Autores brasileiros e portugueses.', youtubeId: 'Une_p_1' },
        { name: 'Gramática Aplicada', percentage: 30, summary: 'Uso da língua em contextos.', youtubeId: 'Une_p_2' }
      ]
    },
    {
      subject: 'Química',
      topics: [
        { name: 'Fisico-Química', percentage: 25, summary: 'Termoquímica, cinética e equilíbrio.', youtubeId: 'Une_q_1' },
        { name: 'Química Orgânica', percentage: 20, summary: 'Funções orgânicas e reações.', youtubeId: 'Une_q_2' },
        { name: 'Química Geral', percentage: 20, summary: 'Ligações e reações inorgânicas.', youtubeId: 'Une_q_3' }
      ]
    },
    {
      subject: 'Biologia',
      topics: [
        { name: 'Zoologia', percentage: 15, summary: 'Classificação e fisiologia animal.', youtubeId: 'Une_b_1' },
        { name: 'Citologia', percentage: 15, summary: 'Estrutura e função celular.', youtubeId: 'Une_b_2' }
      ]
    },
    {
      subject: 'Física',
      topics: [
        { name: 'Mecânica', percentage: 30, summary: 'Leis de Newton e trabalho.', youtubeId: 'Une_f_1' },
        { name: 'Eletromagnetismo', percentage: 15, summary: 'Ímãs e correntes.', youtubeId: 'Une_f_2' }
      ]
    },
    {
      subject: 'História',
      topics: [
        { name: 'Brasil República', percentage: 25, summary: 'Da proclamação aos dias atuais.', youtubeId: 'Une_h_1' },
        { name: 'História Contemporânea', percentage: 20, summary: 'Guerras Mundiais e Guerra Fria.', youtubeId: 'Une_h_2' }
      ]
    },
    {
      subject: 'Geografia',
      topics: [
        { name: 'Cartografia', percentage: 15, summary: 'Mapas, escalas e projeções.', youtubeId: 'Une_g_1' },
        { name: 'Geografia Econômica', percentage: 20, summary: 'Globalização e blocos.', youtubeId: 'Une_g_2' }
      ]
    },
    {
      subject: 'Filosofia',
      topics: [
        { name: 'Filosofia Política', percentage: 20, summary: 'Contratualismo e Estado.', youtubeId: 'Une_phi_1' }
      ]
    },
    {
      subject: 'Sociologia',
      topics: [
        { name: 'Cultura', percentage: 20, summary: 'Diversidade e identidade.', youtubeId: 'Une_soc_1' }
      ]
    },
    {
      subject: 'Inglês',
      topics: [
        { name: 'Interpretação', percentage: 100, summary: 'Textos variados.', youtubeId: 'Une_eng_1' }
      ]
    },
    {
      subject: 'Artes',
      topics: [
        { name: 'Barroco', percentage: 20, summary: 'O estilo Barroco no Brasil e na Europa: contraste, drama e religiosidade.', youtubeId: 'X7K6GZJnyIs' },
        { name: 'Romantismo', percentage: 20, summary: 'A subjetividade, emoção e nacionalismo nas artes do Romantismo.', youtubeId: 'Z0lVfB_J3k4' },
        { name: 'Realismo', percentage: 20, summary: 'O Realismo nas artes: a representação fiel do cotidiano e a crítica social.', youtubeId: 'v8A9U1T5tRE' },
        { name: 'Modernismo', percentage: 20, summary: 'A Semana de Arte Moderna de 1922 e as vanguardas artísticas europeias.', youtubeId: 'pS2tE6a-T5g' },
        { name: 'Arte Contemporânea', percentage: 20, summary: 'As novas linguagens: conceitualismo, performance, instalações e efemeridade.', youtubeId: 'lZ_2p18Y0qg' }
      ]
    }
  ],
  [Vestibular.UERJ]: [
    {
      subject: 'Língua Portuguesa',
      topics: [
        { name: 'Análise de Discurso', percentage: 40, summary: 'Ideologia e persuasão nos textos.', youtubeId: 'Uerj_p_1' }
      ]
    },
    {
      subject: 'Literatura',
      topics: [
        { name: 'Livro do Exame', percentage: 30, summary: 'Análise da obra indicada para o vestibular.', youtubeId: 'Uerj_l_1' }
      ]
    },
    {
      subject: 'Matemática',
      topics: [
        { name: 'Aritmética', percentage: 25, summary: 'Operações e problemas.', youtubeId: 'Uerj_m_1' },
        { name: 'Geometria', percentage: 20, summary: 'Cálculos de áreas e volumes.', youtubeId: 'Uerj_m_2' }
      ]
    },
    {
      subject: 'Geografia',
      topics: [
        { name: 'Geopolítica', percentage: 30, summary: 'Conflitos mundiais e blocos econômicos.', youtubeId: 'Uerj_g_1' },
        { name: 'Urbanização', percentage: 20, summary: 'Crescimento das cidades e problemas urbanos.', youtubeId: 'Uerj_g_2' },
        { name: 'Questões Ambientais', percentage: 15, summary: 'Rio de Janeiro e Brasil.', youtubeId: 'Uerj_g_3' }
      ]
    },
    {
      subject: 'História',
      topics: [
        { name: 'História do Rio de Janeiro', percentage: 15, summary: 'Formação e transformações.', youtubeId: 'Uerj_h_1' },
        { name: 'Brasil Contemporâneo', percentage: 25, summary: 'Ditadura e Redemocratização.', youtubeId: 'Uerj_h_2' }
      ]
    },
    {
      subject: 'Filosofia',
      topics: [
        { name: 'Filosofia e Cidadania', percentage: 15, summary: 'Conceitos de ética e política.', youtubeId: 'Uerj_phi_1' }
      ]
    },
    {
      subject: 'Sociologia',
      topics: [
        { name: 'Estrutura Social', percentage: 15, summary: 'Classes sociais e desigualdade.', youtubeId: 'Uerj_soc_1' }
      ]
    },
    {
      subject: 'Biologia',
      topics: [
        { name: 'Bioquímica', percentage: 20, summary: 'Proteínas, enzimas e metabolismo.', youtubeId: 'Uerj_b_1' },
        { name: 'Saúde Pública', percentage: 15, summary: 'Doenças e vacinação.', youtubeId: 'Uerj_b_2' }
      ]
    },
    {
      subject: 'Física',
      topics: [
        { name: 'Mecânica dos Fluidos', percentage: 15, summary: 'Empuxo e pressão.', youtubeId: 'Uerj_f_1' },
        { name: 'Eletrodinâmica', percentage: 20, summary: 'Leis de Ohm.', youtubeId: 'Uerj_f_2' }
      ]
    },
    {
      subject: 'Química',
      topics: [
        { name: 'Radioatividade', percentage: 10, summary: 'Emissões e meia-vida.', youtubeId: 'Uerj_q_1' },
        { name: 'Química Ambiental', percentage: 15, summary: 'Poluição e tratamento.', youtubeId: 'Uerj_q_2' }
      ]
    },
    {
      subject: 'Língua Estrangeira',
      topics: [
        { name: 'Interpretação', percentage: 100, summary: 'Inglês, Espanhol ou Francês.', youtubeId: 'Uerj_eng_1' }
      ]
    }
  ],
  [Vestibular.ITA]: [
    {
      subject: 'Matemática',
      topics: [
        { name: 'Números Complexos', percentage: 15, summary: 'Forma algébrica e trigonométrica.', youtubeId: 'Ita_m_1' },
        { name: 'Polinômios', percentage: 15, summary: 'Raízes e divisibilidade.', youtubeId: 'Ita_m_2' },
        { name: 'Matrizes e Determinantes', percentage: 12, summary: 'Sistemas lineares.', youtubeId: 'Ita_m_3' }
      ]
    },
    {
      subject: 'Física',
      topics: [
        { name: 'Mecânica', percentage: 35, summary: 'Cinemática, dinâmica e estática de corpos rígidos.', youtubeId: 'Ita_f_1' },
        { name: 'Eletromagnetismo', percentage: 25, summary: 'Campos elétricos, magnéticos e indução.', youtubeId: 'Ita_f_2' },
        { name: 'Física Moderna', percentage: 10, summary: 'Relatividade e física quântica.', youtubeId: 'Ita_f_3' }
      ]
    },
    {
      subject: 'Química',
      topics: [
        { name: 'Termodinâmica Química', percentage: 20, summary: 'Entropia e energia livre.', youtubeId: 'Ita_q_1' },
        { name: 'Cinética e Equilíbrio', percentage: 20, summary: 'Velocidade de reação.', youtubeId: 'Ita_q_2' },
        { name: 'Química Orgânica Avançada', percentage: 15, summary: 'Mecanismos de reação.', youtubeId: 'Ita_q_3' }
      ]
    },
    {
      subject: 'Português',
      topics: [
        { name: 'Literatura Brasileira', percentage: 40, summary: 'Obras clássicas e modernas.', youtubeId: 'Ita_p_1' },
        { name: 'Redação', percentage: 30, summary: 'Dissertação argumentativa.', youtubeId: 'Ita_p_2' }
      ]
    },
    {
      subject: 'Inglês',
      topics: [
        { name: 'Vocabulário Técnico', percentage: 40, summary: 'Termos científicos.', youtubeId: 'Ita_eng_1' },
        { name: 'Interpretação Avançada', percentage: 60, summary: 'Textos complexos.', youtubeId: 'Ita_eng_2' }
      ]
    }
  ],
  [Vestibular.FGV]: [
    {
      subject: 'Matemática',
      topics: [
        { name: 'Matemática Financeira', percentage: 30, summary: 'Juros, descontos e taxas.', youtubeId: 'Fgv_m_1' },
        { name: 'Análise de Dados', percentage: 25, summary: 'Gráficos e tabelas.', youtubeId: 'Fgv_m_2' }
      ]
    },
    {
      subject: 'Português',
      topics: [
        { name: 'Interpretação e Lógica', percentage: 50, summary: 'Raciocínio crítico e textual.', youtubeId: 'Fgv_p_1' }
      ]
    }
  ],
  [Vestibular.MACKENZIE]: [
    {
      subject: 'Linguagens',
      topics: [
        { name: 'Literatura e Gramática', percentage: 40, summary: 'Norma culta e escolas literárias.', youtubeId: 'Mack_L_1' }
      ]
    }
  ],
  [Vestibular.PUC_SP]: [
    {
      subject: 'Humanas',
      topics: [
        { name: 'História e Geografia', percentage: 40, summary: 'Atualidades e fundamentos.', youtubeId: 'Puc_H_1' }
      ]
    }
  ],
  [Vestibular.UNIFESP]: [
    {
      subject: 'Ciências da Natureza',
      topics: [
        { name: 'Biologia e Química', percentage: 40, summary: 'Fisiologia e Bioquímica.', youtubeId: 'Unf_N_1' }
      ]
    }
  ],
  [Vestibular.ANHEMBI_MORUMBI]: [
    {
      subject: 'Geral',
      topics: [
        { name: 'Conhecimentos Gerais', percentage: 100, summary: 'Tópicos variados do ensino médio.', youtubeId: 'Am_G_1' }
      ]
    }
  ],
  [Vestibular.ESTACIO]: [
    {
      subject: 'Geral',
      topics: [
        { name: 'Conhecimentos Gerais', percentage: 100, summary: 'Base nacional comum.', youtubeId: 'Est_G_1' }
      ]
    }
  ],
  [Vestibular.UNISINOS]: [
    {
      subject: 'Geral',
      topics: [
        { name: 'Conhecimentos Gerais', percentage: 100, summary: 'Base nacional comum e atualidades.', youtubeId: 'Uni_G_1' }
      ]
    }
  ]
};

export const ESSAY_THEMES: Record<Vestibular, { year: number; theme: string }[]> = {
  [Vestibular.ENEM]: [
    { year: 2025, theme: 'A inteligência artificial e os limites da ética na sociedade' },
    { year: 2024, theme: 'Desafios para a valorização da herança africana no Brasil' },
    { year: 2023, theme: 'Invisibilidade do trabalho de cuidado realizado pela mulher' },
    { year: 2022, theme: 'Valorização de comunidades e povos tradicionais no Brasil' },
    { year: 2021, theme: 'Invisibilidade e registro civil: acesso à cidadania' },
    { year: 2020, theme: 'O estigma associado às doenças mentais' },
    { year: 2019, theme: 'Democratização do acesso ao cinema no Brasil' },
    { year: 2018, theme: 'Manipulação do comportamento pelo controle de dados' }
  ],
  [Vestibular.FUVEST]: [
    { year: 2025, theme: 'O papel da tecnologia na preservação das relações humanas' },
    { year: 2024, theme: 'Educação básica: direito de todos ou privilégio de poucos?' },
    { year: 2023, theme: 'Refugiados no Brasil: a busca pela dignidade' },
    { year: 2022, theme: 'As diferentes faces do riso' },
    { year: 2021, theme: 'O mundo contemporâneo: a importância da empatia' },
    { year: 2020, theme: 'O papel da ciência no mundo contemporâneo' },
    { year: 2019, theme: 'Importância do passado para compreensão do presente' },
    { year: 2018, theme: 'Devem existir limites para a arte?' }
  ],
  [Vestibular.UNICAMP]: [
    { year: 2024, theme: 'A importância da preservação da memória indígena' },
    { year: 2023, theme: 'A justiça social e o acesso à educação de qualidade' },
    { year: 2022, theme: 'A pós-verdade no mundo digital' },
    { year: 2021, theme: 'A importância do pensamento crítico na sociedade' },
    { year: 2020, theme: 'O consumismo e seus impactos ambientais' }
  ],
  [Vestibular.UNESP]: [
    { year: 2024, theme: 'A tecnologia a serviço da inclusão social' },
    { year: 2023, theme: 'O desafio da mobilidade urbana sustentável' },
    { year: 2022, theme: 'A importância do voto consciente para a democracia' }
  ],
  [Vestibular.UERJ]: [
    { year: 2025, theme: 'Preservação do patrimônio histórico no RJ' },
    { year: 2024, theme: 'Educação e redução de desigualdades' },
    { year: 2023, theme: 'A importância da cultura popular na identidade nacional' },
    { year: 2022, theme: 'O papel do Estado na garantia da saúde pública' }
  ],
  [Vestibular.ITA]: [
    { year: 2024, theme: 'O avanço da aeroespacial e seus impactos na sociedade' },
    { year: 2023, theme: 'A ética no desenvolvimento de novas tecnologias' }
  ],
  [Vestibular.FGV]: [{ year: 2024, theme: 'O impacto da economia digital no Brasil' }],
  [Vestibular.MACKENZIE]: [{ year: 2024, theme: 'Cidadania e responsabilidade social' }],
  [Vestibular.PUC_SP]: [{ year: 2024, theme: 'Justiça social no mundo contemporâneo' }],
  [Vestibular.UNIFESP]: [{ year: 2024, theme: 'Ética e avanços na medicina' }],
  [Vestibular.ANHEMBI_MORUMBI]: [{ year: 2024, theme: 'O mercado de trabalho e as novas tecnologias' }],
  [Vestibular.ESTACIO]: [{ year: 2024, theme: 'Inclusão digital e educação' }],
  [Vestibular.UNISINOS]: [{ year: 2024, theme: 'Sustentabilidade e inovação' }]
};
