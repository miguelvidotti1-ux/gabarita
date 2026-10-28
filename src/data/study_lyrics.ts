export interface SyncedLyricLine {
  time_ms: number; // Início da frase em milissegundos
  text: string;
}

export interface StudyTrackWithLyrics {
  id: string;
  title: string;
  artist: string;
  album: string;
  category: string;
  coverUrl: string;
  duration_ms: number;
  spotifyUri?: string;
  themeColor: string;
  soundType: 'lofi' | 'classical' | 'ambient' | 'piano' | 'acoustic';
  lyrics: SyncedLyricLine[];
}

export const STUDY_TRACKS_WITH_LYRICS: StudyTrackWithLyrics[] = [
  {
    id: 'track-lofi-foco',
    title: 'Lo-Fi Foco Total (Respira & Concentra)',
    artist: 'VestibularPro Focus Beats',
    album: 'Sessão de Estudos & Memorização',
    category: 'Lo-Fi Instrumental & Voz Suave',
    coverUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=500&auto=format&fit=crop&q=80',
    duration_ms: 195000, // 3:15
    themeColor: '#10B981',
    soundType: 'lofi',
    lyrics: [
      { time_ms: 0, text: '♪ [Batida Lo-fi suave iniciando... relaxe os ombros e respire fundo]' },
      { time_ms: 8000, text: 'Ajuste sua postura, organize a mesa e foque no presente' },
      { time_ms: 16000, text: 'Cada questão resolvida é mais um passo rumo à aprovação' },
      { time_ms: 25000, text: 'Não tenha pressa, o segredo da excelência é a constância' },
      { time_ms: 34000, text: 'Leia o enunciado com atenção, sublinhe as palavras-chave' },
      { time_ms: 43000, text: 'Elimine as alternativas absurdas com calma e método' },
      { time_ms: 53000, text: '♪ [Pausa instrumental para raciocínio profundo]' },
      { time_ms: 66000, text: 'A mente clareia, as fórmulas começam a se conectar' },
      { time_ms: 76000, text: 'Seja na matemática, na física ou na química' },
      { time_ms: 85000, text: 'O seu esforço diário está construindo a sua vaga' },
      { time_ms: 95000, text: '♪ [Solo de piano elétrico Rhodes e chuva calma ao fundo]' },
      { time_ms: 110000, text: 'Confie na sua preparação, você sabe mais do que imagina' },
      { time_ms: 120000, text: 'A caneta preta na mão, a folha de respostas em mente' },
      { time_ms: 130000, text: 'Visualiza o seu nome na lista dos aprovados da universidade' },
      { time_ms: 142000, text: 'Respira fundo: inspira em 4 segundos, segura e solta em 4' },
      { time_ms: 154000, text: 'Mantenha esse ritmo, o foco está afiado e sereno' },
      { time_ms: 168000, text: 'Você tem tudo que precisa para vencer este desafio' },
      { time_ms: 180000, text: '♪ [Fade out harmônico e ondas de concentração contínua]' }
    ]
  },
  {
    id: 'track-viva-la-vida',
    title: 'Viva La Vida',
    artist: 'Coldplay',
    album: 'Death and All His Friends',
    category: 'Inspiração & Conquista',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
    duration_ms: 242000, // 4:02
    themeColor: '#3B82F6',
    soundType: 'acoustic',
    lyrics: [
      { time_ms: 0, text: '♪ [Cordas orquestrais e percussão de marcha triunfal]' },
      { time_ms: 13000, text: 'I used to rule the world' },
      { time_ms: 17000, text: 'Seas would rise when I gave the word' },
      { time_ms: 22000, text: 'Now in the morning, I sleep alone' },
      { time_ms: 26000, text: 'Sweep the streets I used to own' },
      { time_ms: 31000, text: '♪ [Arpejo de violoncelos ritmados]' },
      { time_ms: 39000, text: 'I used to roll the dice' },
      { time_ms: 43000, text: 'Feel the fear in my enemy\'s eyes' },
      { time_ms: 48000, text: 'Listen as the crowd would sing:' },
      { time_ms: 51000, text: '"Now the old king is dead, long live the king!"' },
      { time_ms: 56000, text: 'One minute, I held the key' },
      { time_ms: 61000, text: 'Next the walls were closed on me' },
      { time_ms: 65000, text: 'And I discovered that my castles stand' },
      { time_ms: 70000, text: 'Upon pillars of salt and pillars of sand' },
      { time_ms: 74000, text: '♪ [Refrão expansivo — sinta a energia para resolver mais questões]' },
      { time_ms: 78000, text: 'I hear Jerusalem bells a-ringin\'' },
      { time_ms: 82000, text: 'Roman cavalry choirs are singin\'' },
      { time_ms: 87000, text: 'Be my mirror, my sword and shield' },
      { time_ms: 91000, text: 'My missionaries in a foreign field' },
      { time_ms: 96000, text: 'For some reason, I can\'t explain' },
      { time_ms: 100000, text: 'Once you\'d gone, there was never' },
      { time_ms: 103000, text: 'Never an honest word' },
      { time_ms: 106000, text: 'And that was when I ruled the world' },
      { time_ms: 112000, text: '♪ [Interlúdio orquestral motivador para o vestibular]' },
      { time_ms: 125000, text: 'It was a wicked and wild wind' },
      { time_ms: 129000, text: 'Blew down the doors to let me in' },
      { time_ms: 134000, text: 'Shattered windows and the sound of drums' },
      { time_ms: 138000, text: 'People couldn\'t believe what I\'d become' },
      { time_ms: 143000, text: 'Revolutionaries wait' },
      { time_ms: 147000, text: 'For my head on a silver plate' },
      { time_ms: 152000, text: 'Just a puppet on a lonely string' },
      { time_ms: 155000, text: 'Oh, who would ever want to be king?' },
      { time_ms: 161000, text: 'I hear Jerusalem bells a-ringin\'' },
      { time_ms: 165000, text: 'Roman cavalry choirs are singin\'' },
      { time_ms: 170000, text: 'Be my mirror, my sword and shield' },
      { time_ms: 174000, text: 'My missionaries in a foreign field' },
      { time_ms: 179000, text: 'For some reason, I can\'t explain' },
      { time_ms: 183000, text: 'I know Saint Peter won\'t call my name' },
      { time_ms: 188000, text: 'Never an honest word' },
      { time_ms: 191000, text: 'But that was when I ruled the world' },
      { time_ms: 198000, text: '♪ [Oooooh-oooh-oh! Coro final épico de determinação]' },
      { time_ms: 220000, text: 'A vitória nos vestibulares exige persistência!' }
    ]
  },
  {
    id: 'track-aquarela',
    title: 'Aquarela',
    artist: 'Toquinho',
    album: 'Aquarela',
    category: 'Música Brasileira & Criação',
    coverUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&auto=format&fit=crop&q=80',
    duration_ms: 255000, // 4:15
    themeColor: '#F59E0B',
    soundType: 'acoustic',
    lyrics: [
      { time_ms: 0, text: '♪ [Violão dedilhado clássico de Toquinho]' },
      { time_ms: 14000, text: 'Numa folha qualquer eu desenho um sol amarelo' },
      { time_ms: 21000, text: 'E com cinco ou seis retas é fácil fazer um castelo' },
      { time_ms: 28000, text: 'Corro o lápis em torno da mão e me dou uma luva' },
      { time_ms: 36000, text: 'E se faço chover, com dois riscos tenho um guarda-chuva' },
      { time_ms: 43000, text: 'Se um pinguinho de tinta cai no azul do papel' },
      { time_ms: 50000, text: 'Num instante imagino uma linda gaivota a voar no céu' },
      { time_ms: 57000, text: 'Vai voando, contornando a imensa curva norte-sul' },
      { time_ms: 64000, text: 'Vou com ela viajando Havaí, Pequim ou Istambul' },
      { time_ms: 71000, text: 'Pinto um barco a vela branco navegando' },
      { time_ms: 75000, text: 'É tanto céu e mar num beijo azul' },
      { time_ms: 81000, text: 'Entre as nuvens vem surgindo um lindo avião rosa e grená' },
      { time_ms: 88000, text: 'Tudo em volta colorindo, com suas luzes a piscar' },
      { time_ms: 95000, text: 'Basta imaginar e ele está partindo, sereno e lindo' },
      { time_ms: 101000, text: 'E se a gente quiser, ele vai pousar' },
      { time_ms: 108000, text: '♪ [Harmonia inspiradora para redação e criatividade]' },
      { time_ms: 122000, text: 'Numa folha qualquer eu desenho um navio de partida' },
      { time_ms: 129000, text: 'Com alguns bons amigos bebendo de bem com a vida' },
      { time_ms: 136000, text: 'De uma América a outra eu consigo passar num segundo' },
      { time_ms: 143000, text: 'Giro um simples compasso e num círculo eu faço o mundo' },
      { time_ms: 151000, text: 'Um menino caminha e caminhando chega no muro' },
      { time_ms: 158000, text: 'E ali logo em frente a esperar pela gente o futuro está' },
      { time_ms: 165000, text: 'E o futuro é uma astronave que tentamos pilotar' },
      { time_ms: 172000, text: 'Não tem tempo nem piedade nem tem hora de chegar' },
      { time_ms: 179000, text: 'Sem pedir licença muda a nossa vida' },
      { time_ms: 183000, text: 'E depois convida a rir ou chorar' },
      { time_ms: 190000, text: 'Nessa estrada não nos cabe conhecer ou ver o que virá' },
      { time_ms: 197000, text: 'O fim dela ninguém sabe bem ao certo onde vai dar' },
      { time_ms: 204000, text: 'Vamos todos numa linda passarela' },
      { time_ms: 209000, text: 'De uma aquarela que um dia, enfim, descolorirá' },
      { time_ms: 220000, text: 'Numa folha qualquer eu desenho um sol amarelo...' }
    ]
  },
  {
    id: 'track-counting-stars',
    title: 'Counting Stars',
    artist: 'OneRepublic',
    album: 'Native',
    category: 'Energia Rápida para Exercícios',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
    duration_ms: 257000, // 4:17
    themeColor: '#8B5CF6',
    soundType: 'acoustic',
    lyrics: [
      { time_ms: 0, text: '♪ [Batida crescente no compasso dos exercícios]' },
      { time_ms: 10000, text: 'Lately, I\'ve been, I\'ve been losing sleep' },
      { time_ms: 14000, text: 'Dreaming about the things that we could be' },
      { time_ms: 19000, text: 'But, baby, I\'ve been, I\'ve been praying hard' },
      { time_ms: 24000, text: 'Said no more counting dollars, we\'ll be counting stars' },
      { time_ms: 28000, text: 'Yeah, we\'ll be counting stars' },
      { time_ms: 38000, text: 'I see this life like a swinging vine' },
      { time_ms: 43000, text: 'Swing my heart across the line' },
      { time_ms: 48000, text: 'In my face is flashing signs' },
      { time_ms: 52000, text: 'Seek it out and you shall find' },
      { time_ms: 57000, text: 'Old, but I\'m not that old' },
      { time_ms: 59000, text: 'Young, but I\'m not that bold' },
      { time_ms: 61000, text: 'And I don\'t think the world is sold' },
      { time_ms: 64000, text: 'On just doing what we\'re told' },
      { time_ms: 66000, text: 'I feel something so right doing the wrong thing' },
      { time_ms: 71000, text: 'I feel something so wrong doing the right thing' },
      { time_ms: 76000, text: 'I could lie, could lie, could lie' },
      { time_ms: 81000, text: 'Everything that kills me makes me feel alive' },
      { time_ms: 85000, text: 'Lately, I\'ve been, I\'ve been losing sleep' },
      { time_ms: 90000, text: 'Dreaming about the things that we could be' },
      { time_ms: 95000, text: 'Said no more counting dollars, we\'ll be counting stars' },
      { time_ms: 105000, text: '♪ [Drop de ritmo acelerado para bater metas de simulado]' }
    ]
  },
  {
    id: 'track-epitafio',
    title: 'Epitáfio',
    artist: 'Titãs',
    album: 'A Melhor Banda de Todos os Tempos',
    category: 'Reflexão & Alívio de Ansiedade',
    coverUrl: 'https://images.unsplash.com/photo-1507842229452-788052f53d4c?w=500&auto=format&fit=crop&q=80',
    duration_ms: 175000, // 2:55
    themeColor: '#06B6D4',
    soundType: 'piano',
    lyrics: [
      { time_ms: 0, text: '♪ [Acordes serenos de piano acústico]' },
      { time_ms: 8000, text: 'Devia ter amado mais, ter chorado mais' },
      { time_ms: 14000, text: 'Ter visto o sol nascer' },
      { time_ms: 19000, text: 'Devia ter arriscado mais e até errado mais' },
      { time_ms: 26000, text: 'Ter feito o que eu queria fazer' },
      { time_ms: 31000, text: 'Queria ter aceitado as pessoas como elas são' },
      { time_ms: 38000, text: 'Cada um sabe a alegria e a dor que traz no coração' },
      { time_ms: 45000, text: 'O acaso vai proteger' },
      { time_ms: 50000, text: 'Enquanto eu andar distraído' },
      { time_ms: 55000, text: 'O acaso vai proteger' },
      { time_ms: 60000, text: 'Enquanto eu andar...' },
      { time_ms: 66000, text: 'Devia ter complicado menos, trabalhado menos' },
      { time_ms: 73000, text: 'Ter visto o sol se pôr' },
      { time_ms: 78000, text: 'Devia ter me importado menos com problemas pequenos' },
      { time_ms: 85000, text: 'Ter morrido de amor' },
      { time_ms: 90000, text: 'Queria ter aceitado a vida como ela é' },
      { time_ms: 97000, text: 'A cada um cabe alegrias e a tristeza que vier' },
      { time_ms: 104000, text: 'O acaso vai proteger' },
      { time_ms: 109000, text: 'Enquanto eu andar distraído' },
      { time_ms: 114000, text: 'O acaso vai proteger' },
      { time_ms: 120000, text: 'Enquanto eu andar...' },
      { time_ms: 135000, text: 'Respire fundo: valorize sua caminhada até a aprovação' }
    ]
  },
  {
    id: 'track-clair-de-lune',
    title: 'Clair de Lune (Guia de Respiração & Mente)',
    artist: 'Claude Debussy',
    album: 'Suite Bergamasque (Foco Alfa)',
    category: 'Música Clássica para Raciocínio Puro',
    coverUrl: 'https://images.unsplash.com/photo-1520523839898-50712825e3a7?w=500&auto=format&fit=crop&q=80',
    duration_ms: 220000, // 3:40
    themeColor: '#6366F1',
    soundType: 'classical',
    lyrics: [
      { time_ms: 0, text: '♪ [Harmonias impressionistas de piano — início do foco alfa]' },
      { time_ms: 12000, text: 'Inspire tranquilidade... solte qualquer tensão nos ombros' },
      { time_ms: 25000, text: 'A mente em repouso absoluto assimila melhor as fórmulas' },
      { time_ms: 38000, text: 'Cada nota abre espaço para o raciocínio dedutivo e clareza mental' },
      { time_ms: 52000, text: '♪ [Crescendo delicado de arpejos]' },
      { time_ms: 68000, text: 'Visualize os conceitos fundamentais de cada matéria' },
      { time_ms: 82000, text: 'História, geografia, literatura, biologia e matemática' },
      { time_ms: 96000, text: 'Tudo se organiza em conexões lógicas e naturais' },
      { time_ms: 112000, text: '♪ [Cascata cristalina de notas agudas em pianíssimo]' },
      { time_ms: 130000, text: 'Você tem calma, tempo e domínio para resolver sua prova' },
      { time_ms: 148000, text: 'A calma vence a ansiedade, o método vence a incerteza' },
      { time_ms: 168000, text: 'Permaneça neste estado de clareza durante toda a sessão' },
      { time_ms: 190000, text: '♪ [Acordes finais em paz e contemplação]' }
    ]
  },
  {
    id: 'track-yellow',
    title: 'Yellow',
    artist: 'Coldplay',
    album: 'Parachutes',
    category: 'Estudo Leve & Revisão Noturna',
    coverUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=80',
    duration_ms: 269000, // 4:29
    themeColor: '#EAB308',
    soundType: 'acoustic',
    lyrics: [
      { time_ms: 0, text: '♪ [Guitarra acústica suave abrindo o ambiente]' },
      { time_ms: 15000, text: 'Look at the stars, look how they shine for you' },
      { time_ms: 24000, text: 'And everything you do, yeah, they were all yellow' },
      { time_ms: 37000, text: 'I came along, I wrote a song for you' },
      { time_ms: 45000, text: 'And all the things you do, and it was called "Yellow"' },
      { time_ms: 57000, text: 'So then I took my turn, oh what a thing to have done' },
      { time_ms: 68000, text: 'And it was all yellow' },
      { time_ms: 78000, text: 'Your skin, oh yeah, your skin and bones' },
      { time_ms: 84000, text: 'Turn into something beautiful' },
      { time_ms: 90000, text: 'And you know, you know I love you so' },
      { time_ms: 96000, text: 'You know I love you so' },
      { time_ms: 104000, text: '♪ [Solo acústico e ritmo de leitura relaxada]' },
      { time_ms: 122000, text: 'I swam across, I jumped across for you' },
      { time_ms: 130000, text: 'Oh, what a thing to do, \'cause you were all yellow' },
      { time_ms: 142000, text: 'I drew a line, I drew a line for you' },
      { time_ms: 151000, text: 'Oh, what a thing to do, and it was all yellow' }
    ]
  },
  {
    id: 'track-construcao',
    title: 'Construção',
    artist: 'Chico Buarque',
    album: 'Construção (1971)',
    category: 'Literatura & Métrica Vestibular (FUVEST/UNICAMP)',
    coverUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=80',
    duration_ms: 258000, // 4:18
    themeColor: '#EF4444',
    soundType: 'acoustic',
    lyrics: [
      { time_ms: 0, text: '♪ [Marcação rítmica clássica em proparoxítonas]' },
      { time_ms: 14000, text: 'Amou daquela vez como se fosse a última' },
      { time_ms: 18000, text: 'Beijou sua mulher como se fosse a última' },
      { time_ms: 22000, text: 'E cada filho seu como se fosse o único' },
      { time_ms: 27000, text: 'E atravessou a rua com seu passo tímido' },
      { time_ms: 31000, text: 'Subiu a construção como se fosse máquina' },
      { time_ms: 36000, text: 'Ergueu no patamar quatro paredes sólidas' },
      { time_ms: 40000, text: 'Tijolo com tijolo num desenho mágico' },
      { time_ms: 44000, text: 'Seus olhos embotados de cimento e lágrima' },
      { time_ms: 49000, text: 'Sentou pra descansar como se fosse sábado' },
      { time_ms: 53000, text: 'Comeu feijão com arroz como se fosse um príncipe' },
      { time_ms: 58000, text: 'Bebeu e soluçou como se fosse um náufrago' },
      { time_ms: 62000, text: 'Dançou e gargalhou como se ouvisse música' },
      { time_ms: 67000, text: 'E tropeçou no céu como se fosse um bêbado' },
      { time_ms: 71000, text: 'E flutuou no ar como se fosse um pássaro' },
      { time_ms: 76000, text: 'E se acabou no chão feito um pacote flácido' },
      { time_ms: 80000, text: 'Agonizou no meio do passeio público' },
      { time_ms: 85000, text: 'Morreu na contramão atrapalhando o tráfego' },
      { time_ms: 95000, text: '♪ [Observe a alternância dos vocábulos proparoxítonos — frequente na FUVEST]' }
    ]
  }
];

export function getTrackLyricsById(id: string): StudyTrackWithLyrics | undefined {
  return STUDY_TRACKS_WITH_LYRICS.find(t => t.id === id);
}

export function searchTrackLyrics(titleOrArtist: string): StudyTrackWithLyrics | undefined {
  if (!titleOrArtist) return undefined;
  const term = titleOrArtist.toLowerCase();
  return STUDY_TRACKS_WITH_LYRICS.find(t => 
    t.title.toLowerCase().includes(term) || 
    t.artist.toLowerCase().includes(term)
  );
}
