import React, { useState } from 'react';
import { BookOpen, Book, Users, Target, Search } from 'lucide-react';

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
    { id: 'fuv26', obra: "Opúsculo Humanitário", autor: "Nísia Floresta", vestibular: "FUVEST", ano: 2026 },
    { id: 'fuv27', obra: "A Paixão Segundo G.H.", autor: "Clarice Lispector", vestibular: "FUVEST", ano: 2027 },
    { id: 'uni27', obra: "A vida não é útil", autor: "Ailton Krenak", vestibular: "UNICAMP", ano: 2027 },
    { id: 'uerj27', obra: "Ainda estou aqui", autor: "Marcelo Rubens Paiva", vestibular: "UERJ", ano: 2027 },
    { id: 'fuv28', obra: "João Miguel", autor: "Rachel de Queiroz", vestibular: "FUVEST", ano: 2028 }
  ]
};

export default function Biblioteca() {
  const [activeTab, setActiveTab] = useState<'repertorio' | 'leituras'>('repertorio');
  const [anoFiltro, setAnoFiltro] = useState(2027);
  const [busca, setBusca] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState('Todos');

  const anos = [2026, 2027, 2028, 2029];
  const eixos = ['Todos', 'Sociedade', 'Tecnologia', 'Educação', 'Saúde', 'Economia', 'Ética', 'Cultura'];

  const repertoriosFiltrados = Database.repertorios.filter(item => {
    const combinaFiltro = filtroAtivo === 'Todos' || item.tema === filtroAtivo;
    const combinaBusca = item.uso.toLowerCase().includes(busca.toLowerCase()) || 
                         item.autor.toLowerCase().includes(busca.toLowerCase()) ||
                         item.obra.toLowerCase().includes(busca.toLowerCase());
    return combinaFiltro && combinaBusca;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-[var(--text-primary)]">Biblioteca de Apoio</h1>
        <p className="text-[var(--text-secondary)]">Materiais essenciais para turbinar suas redações.</p>
      </div>
      
      {/* Navegação entre Abas */}
      <div className="flex bg-[var(--bg-secondary)] p-1.5 rounded-2xl border border-[var(--card-border)] max-w-sm mx-auto">
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
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
              {anos.map(ano => (
                <button 
                  key={ano}
                  onClick={() => setAnoFiltro(ano)}
                  className={`py-2 px-4 rounded-full font-black text-sm whitespace-nowrap transition-all ${
                    anoFiltro === ano ? 'bg-[var(--text-accent)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--card-border)]'
                  }`}
                >
                  {ano}
                </button>
              ))}
            </div>
            {Database.leituras.filter(l => l.ano === anoFiltro).map(item => (
              <div key={item.id} className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black text-lg text-[var(--text-primary)]">{item.obra}</h3>
                  <span className="text-[10px] font-black uppercase text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-2 py-1 rounded">{item.vestibular}</span>
                </div>
                <p className="text-[var(--text-secondary)] text-sm">{item.autor}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
