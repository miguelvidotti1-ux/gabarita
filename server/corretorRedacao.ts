// ==========================================================
// CORRIGEBOT — SERVIÇO DE CORREÇÃO DE REDAÇÃO MULTI-BANCA
// Regras oficiais, rubricas, validações e construção de prompts
// ==========================================================

export const REDACAO_MAX_TOKENS = 1500;
export const REDACAO_TEMPERATURE = 0.2; // Baixa temperatura = correção mais consistente e rigorosa
export const REDACAO_LIMITE_CARACTERES = 12000; // ~30 a 35 linhas com margem de segurança

export interface CompetenciaRubrica {
  id: number;
  nome: string;
  criterios: string;
}

export interface RubricaBanca {
  id: string;
  nome: string;
  tipo_texto: string;
  nota_maxima: number | null;
  escala_por_competencia: number | null;
  exige_proposta_intervencao: boolean;
  limite_linhas: number | null;
  competencias: CompetenciaRubrica[];
  zerar_redacao: string[];
  observacao?: string;
}

export const RUBRICAS: Record<string, RubricaBanca> = {
  enem: {
    id: 'enem',
    nome: 'ENEM',
    tipo_texto: 'dissertativo-argumentativo',
    nota_maxima: 1000,
    escala_por_competencia: 200,
    exige_proposta_intervencao: true,
    limite_linhas: null, // ENEM limita espaço físico da folha oficial (até 30 linhas)
    competencias: [
      {
        id: 1,
        nome: 'Domínio da modalidade escrita formal da língua portuguesa',
        criterios: 'Norma culta, concordância, regência, pontuação, ortografia, acentuação. Erros gramaticais descontam progressivamente (200 = sem desvios ou apenas 1 deslize isolado; 160 = poucos desvios; 120 = desvios medianos; 80 = muitos desvios; 40 = vocabulário precário; 0 = desconhecimento da norma).'
      },
      {
        id: 2,
        nome: 'Compreender a proposta de redação e aplicar conceitos das áreas de conhecimento',
        criterios: 'Fuga total ao tema = nota 0. Tangenciamento desconta severamente. Deve desenvolver o tema nos limites do tipo dissertativo-argumentativo com repertório sociocultural legitimado, pertinente e produtivo.'
      },
      {
        id: 3,
        nome: 'Selecionar, relacionar, organizar e interpretar informações, fatos, opiniões e argumentos',
        criterios: 'Argumentação consistente, projeto de texto estratégico e evidente, autoria crítica e ausência de contradições ou lacunas argumentativas.'
      },
      {
        id: 4,
        nome: 'Conhecimento dos mecanismos linguísticos necessários para a construção da argumentação',
        criterios: 'Coesão textual interparágrafos e intraparágrafos: conectivos variados, operadores argumentativos, retomadas pronominais e lexicais sem repetições viciosas.'
      },
      {
        id: 5,
        nome: 'Elaborar proposta de intervenção para o problema abordado, respeitando os direitos humanos',
        criterios: 'A proposta deve conter 5 elementos essenciais: AGENTE (quem vai agir), AÇÃO (o que será feito), MEIO/MODO (como será executado), FINALIDADE/EFEITO (para quê) e DETALHAMENTO (especificação de um dos elementos). Cada elemento ausente desconta 40 pontos. Proposta que ofenda direitos humanos = nota 0 na redação.'
      }
    ],
    zerar_redacao: [
      'Fuga total ao tema',
      'Não obediência ao tipo dissertativo-argumentativo',
      'Extensão inferior a 7 linhas',
      'Cópia dos textos motivadores com menos de 8 linhas autorais',
      'Proposta de intervenção ou texto que fira expressamente os direitos humanos',
      'Identificação do candidato no texto (nome, assinatura, desenhos)',
      'Texto com formas propositais de anulação (impropérios, desenhos, recados à banca)',
      'Texto em língua estrangeira'
    ]
  },

  fuvest: {
    id: 'fuvest',
    nome: 'FUVEST (USP)',
    tipo_texto: 'dissertativo',
    nota_maxima: null, // FUVEST não divulga nota numérica por competência pública — avalia conceito e matriz interna
    escala_por_competencia: null,
    exige_proposta_intervencao: false,
    limite_linhas: 30,
    competencias: [
      {
        id: 1,
        nome: 'Adequação ao tema e ao tipo de texto',
        criterios: 'Compreensão da proposta e problematização do tema, recorte reflexivo pertinente, permanência rigorosa no gênero dissertativo. A FUVEST valoriza a definição de um ponto de vista autônomo e filosófico.'
      },
      {
        id: 2,
        nome: 'Estrutura e progressão textual',
        criterios: 'Introdução problematizadora, desenvolvimento consistente e conclusão reflexiva bem delimitados; progressão argumentativa sem repetições ou circularidade; parágrafos articulados em torno de uma tese madura.'
      },
      {
        id: 3,
        nome: 'Argumentação e repertório crítico',
        criterios: 'Argumentos consistentes e aprofundados; repertório legitimado (literário, filosófico, histórico, sociológico) organicamente integrado à reflexão — nunca apenas citado superficialmente. Valoriza diálogo com obras literárias obrigatórias e clássicos do pensamento.'
      },
      {
        id: 4,
        nome: 'Coesão e articulação lógica',
        criterios: 'Uso variado e preciso de conectivos; articulação sintática e semântica entre períodos e parágrafos; encadeamento lógico e elegante das ideias.'
      },
      {
        id: 5,
        nome: 'Domínio da norma culta e precisão vocabular',
        criterios: 'Gramática, ortografia, pontuação, regência, concordância. Elegância estilística, precisão vocabular e clareza conceitual.'
      }
    ],
    zerar_redacao: [
      'Fuga total ao tema',
      'Não atendimento ao tipo dissertativo',
      'Extensão inferior ao mínimo exigido (menos de 20 linhas)',
      'Identificação do candidato',
      'Texto em verso ou língua estrangeira'
    ],
    observacao: 'A FUVEST avalia a maturidade reflexiva e não exige proposta de intervenção. A correção atribui um CONCEITO (Insuficiente / Regular / Bom / Ótimo / Excelente) por critério com parecer aprofundado.'
  },

  unicamp: {
    id: 'unicamp',
    nome: 'UNICAMP',
    tipo_texto: 'dissertativo-argumentativo (Proposta 1) ou gênero textual específico (Proposta 2)',
    nota_maxima: null,
    escala_por_competencia: null,
    exige_proposta_intervencao: false,
    limite_linhas: 30,
    competencias: [
      {
        id: 1,
        nome: 'Compreensão da proposta e atendimento às instruções',
        criterios: 'Leitura atenta dos textos de apoio e do comando da banca; recorte adequado do tema; cumprimento integral da situação de enunciação.'
      },
      {
        id: 2,
        nome: 'Adequação ao gênero discursivo e interlocução',
        criterios: 'Atendimento estrito ao gênero solicitado (artigo de opinião, carta aberta, discurso, resenha, manifesto, crônica). Definição clara de quem fala (locutor), para quem fala (interlocutor) e objetivo comunicativo.'
      },
      {
        id: 3,
        nome: 'Construção argumentativa e uso de informações',
        criterios: 'Tese lúcida, argumentos desenvolvidos com substância, incorporação crítica de dados dos textos motivadores sem cópia mecânica, originalidade de perspectiva.'
      },
      {
        id: 4,
        nome: 'Estrutura, coesão e adequação linguística',
        criterios: 'Organização textual coerente com o gênero, registro linguístico compatível com o interlocutor e domínio sólido da norma formal da língua portuguesa.'
      }
    ],
    zerar_redacao: [
      'Fuga total ao tema ou ao gênero solicitado',
      'Extensão inferior ao mínimo exigido',
      'Identificação do candidato no corpo da redação',
      'Cópia integral dos textos motivadores sem produção autoral'
    ],
    observacao: 'A UNICAMP aplica propostas vinculadas a gêneros textuais específicos da vida social. A avaliação considera a fidelidade à situação de comunicação solicitada.'
  },

  unesp: {
    id: 'unesp',
    nome: 'UNESP',
    tipo_texto: 'dissertativo-argumentativo',
    nota_maxima: null,
    escala_por_competencia: null,
    exige_proposta_intervencao: false,
    limite_linhas: 30,
    competencias: [
      {
        id: 1,
        nome: 'Adequação ao tema e ao tipo textual',
        criterios: 'Compreensão ampla da pergunta-tema proposta pela banca, permanência temática constante e respeito estrito ao tipo dissertativo-argumentativo.'
      },
      {
        id: 2,
        nome: 'Estrutura argumentativa e consistência da tese',
        criterios: 'Tese bem posicionada desde a introdução, argumentos sólidos e equilibrados ao longo dos parágrafos, conclusão que sintetiza as discussões sem propor fórmulas prontas de intervenção.'
      },
      {
        id: 3,
        nome: 'Coesão, coerência e progressão textual',
        criterios: 'Articulação lógica entre as ideias, uso adequado e não repetitivo de operadores argumentativos, unidade temática e fluidez de leitura.'
      },
      {
        id: 4,
        nome: 'Domínio da norma padrão e variedade lexical',
        criterios: 'Correção gramatical, rigor ortográfico e de pontuação, riqueza vocabular e clareza de exposição.'
      }
    ],
    zerar_redacao: [
      'Fuga total ao tema',
      'Não atendimento ao tipo dissertativo-argumentativo',
      'Extensão inferior a 7 linhas',
      'Identificação do candidato'
    ],
    observacao: 'A UNESP costuma formular seus temas como perguntas provocativas (ex: "X: indispensável ou superado?"). O candidato deve se posicionar claramente.'
  },
  ita: {
    id: 'ita',
    nome: 'ITA',
    tipo_texto: 'dissertativo-argumentativo',
    nota_maxima: 10,
    escala_por_competencia: 2.5,
    exige_proposta_intervencao: false,
    limite_linhas: 32,
    competencias: [
      {
        id: 1,
        nome: 'Tema, gênero e tese crítica',
        criterios: 'Compreensão profunda e problematizadora do tema; adesão irrestrita ao gênero dissertativo-argumentativo; formulação de tese explícita e consistente, sem senso comum ou clichês.'
      },
      {
        id: 2,
        nome: 'Consistência argumentativa e repertório',
        criterios: 'Solidez e rigor analítico dos argumentos; integração orgânica de repertório filosófico, sociológico, histórico ou científico; profundidade reflexiva e capacidade de abstração.'
      },
      {
        id: 3,
        nome: 'Coerência, raciocínio lógico e progressão',
        criterios: 'Encadeamento estritamente lógico entre premissas e conclusões; relações precisas de causa, efeito e contraste; ausência de contradições, circularidade ou saltos lógicos.'
      },
      {
        id: 4,
        nome: 'Modalidade culta, concisão e elegância formal',
        criterios: 'Domínio primoroso da norma culta formal (sintaxe, concordância, regência e pontuação); precisão lexical, concisão elegante e vocabulário denso, sem rebuscamento estéril.'
      }
    ],
    zerar_redacao: [
      'Fuga total ao tema',
      'Não atendimento ao gênero dissertativo-argumentativo',
      'Extensão inferior ao mínimo (menos de 20 linhas)',
      'Identificação ou assinatura em local indevido',
      'Texto com partes desconexas ou desenhos'
    ],
    observacao: 'O ITA valoriza elevado rigor de raciocínio, maturidade analítica e precisão lógica. Não exige proposta de intervenção.'
  },

  ime: {
    id: 'ime',
    nome: 'IME (Instituto Militar de Engenharia)',
    tipo_texto: 'dissertativo-argumentativo',
    nota_maxima: 10,
    escala_por_competencia: 2.5,
    exige_proposta_intervencao: false,
    limite_linhas: 30,
    competencias: [
      {
        id: 1,
        nome: 'Tema, tese crítica e cobertura do debate',
        criterios: 'Compreensão exata do tema e formulação de ponto de vista claro sobre os impactos da ciência, tecnologia, soberania e ética no mundo contemporâneo.'
      },
      {
        id: 2,
        nome: 'Raciocínio lógico e solidez argumentativa',
        criterios: 'Estruturação lógica rigorosa dos argumentos; clareza demonstrativa; ausência de contradições, sofismas ou sentimentalismo ingênuo.'
      },
      {
        id: 3,
        nome: 'Estrutura dissertativa e progressão textual',
        criterios: 'Introdução, desenvolvimento e conclusão articulados; coesão inter e intraparágrafos; encadeamento fluido e ausência de repetições.'
      },
      {
        id: 4,
        nome: 'Correção vernácula e precisão terminológica',
        criterios: 'Domínio impecável da norma culta formal (morfossintaxe, pontuação, regência, concordância); vocabulário técnico e preciso, com concisão.'
      }
    ],
    zerar_redacao: [
      'Fuga total ao tema',
      'Extensão inferior a 15 linhas',
      'Não atendimento ao gênero dissertativo-argumentativo',
      'Identificação do candidato no corpo do texto',
      'Texto com impropérios ou incompreensível'
    ],
    observacao: 'O Concurso de Admissão ao IME avalia a maturidade reflexiva voltada para questões de ciência, engenharia, ética, defesa nacional e desafios estratégicos do Brasil. Não exige intervenção social.'
  },

  uerj: {
    id: 'uerj',
    nome: 'UERJ',
    tipo_texto: 'dissertativo-argumentativo com base em obra literária',
    nota_maxima: 10,
    escala_por_competencia: null,
    exige_proposta_intervencao: false,
    limite_linhas: 30,
    competencias: [
      {
        id: 1,
        nome: 'Adequação ao tema e diálogo com a obra literária indicada',
        criterios: 'Compreensão crítica da questão-problema suscitada pelo livro do exame (0 a 4,0 pontos). O texto deve articular as ideias da obra à realidade social contemporânea, sem se limitar a um mero resumo do enredo.'
      },
      {
        id: 2,
        nome: 'Estrutura dissertativo-argumentativa, projeto de texto e coesão',
        criterios: 'Construção de tese autônoma (0 a 3,0 pontos), progressão temática sem repetições, coerência interna dos argumentos e articulação entre parágrafos.'
      },
      {
        id: 3,
        nome: 'Domínio da norma culta e recursos expressivos',
        criterios: 'Adequação ao registro formal da língua portuguesa (0 a 3,0 pontos), precisão vocabular, variedade de estruturas sintáticas e correção gramatical.'
      }
    ],
    zerar_redacao: [
      'Fuga total ao tema',
      'Desvio do tipo dissertativo-argumentativo',
      'Menos de 15 linhas escritas',
      'Identificação do candidato',
      'Texto em língua estrangeira'
    ],
    observacao: 'A UERJ baseia seu tema na leitura de uma obra literária indicada no edital. O foco é a discussão reflexiva e a problematização, sem exigência de proposta de intervenção.'
  },

  fgv: {
    id: 'fgv',
    nome: 'FGV (Fundação Getulio Vargas)',
    tipo_texto: 'dissertativo-argumentativo',
    nota_maxima: 10,
    escala_por_competencia: 2.5,
    exige_proposta_intervencao: false,
    limite_linhas: 30,
    competencias: [
      {
        id: 1,
        nome: 'Interpretação temática e leitura de conjuntura',
        criterios: 'Compreensão abrangente da proposta; capacidade de interpretar fenômenos socioeconômicos, jurídicos ou institucionais com visão crítica e contemporânea.'
      },
      {
        id: 2,
        nome: 'Rigor argumentativo, consistência e autoria',
        criterios: 'Defesa consistente de tese; uso produtivo de dados, fatos e teorias das ciências sociais e econômicas; originalidade e ausência de senso comum.'
      },
      {
        id: 3,
        nome: 'Estrutura, encadeamento e progressão textual',
        criterios: 'Projeto de texto lúcido e progressivo; parágrafos bem delimitados com tópicos frasais claros; conclusão que arremata os argumentos com solidez.'
      },
      {
        id: 4,
        nome: 'Domínio da norma culta e precisão terminológica',
        criterios: 'Correção gramatical estrita; vocabulário maduro, preciso e adequado ao debate acadêmico e profissional.'
      }
    ],
    zerar_redacao: [
      'Fuga total ao tema',
      'Não atendimento ao tipo dissertativo-argumentativo',
      'Menos de 15 linhas',
      'Identificação do candidato'
    ],
    observacao: 'A FGV valoriza forte capacidade analítica, visão crítica sobre instituições, mercado e sociedade, e argumentação embasada.'
  },

  mackenzie: {
    id: 'mackenzie',
    nome: 'Mackenzie',
    tipo_texto: 'dissertativo-argumentativo',
    nota_maxima: 10,
    escala_por_competencia: 2.5,
    exige_proposta_intervencao: false,
    limite_linhas: 30,
    competencias: [
      {
        id: 1,
        nome: 'Adequação ao tema e clareza da tese',
        criterios: 'Compreensão do tema escolhido e formulação de ponto de vista explícito e sustentável desde a introdução.'
      },
      {
        id: 2,
        nome: 'Estrutura dissertativa e coerência argumentativa',
        criterios: 'Desenvolvimento consistente dos argumentos, relação de causa e consequência, ausência de contradições e conclusão coerente.'
      },
      {
        id: 3,
        nome: 'Coesão textual e variedade de conectivos',
        criterios: 'Emprego correto e diversificado de mecanismos de coesão referencial e sequencial entre os períodos e parágrafos.'
      },
      {
        id: 4,
        nome: 'Modalidade escrita padrão e correção vernácula',
        criterios: 'Domínio da gramática normativa (concordância, regência, crase, pontuação e ortografia) e clareza de expressão.'
      }
    ],
    zerar_redacao: [
      'Fuga ao tema',
      'Texto com menos de 15 linhas',
      'Não observância do padrão dissertativo',
      'Identificação'
    ],
    observacao: 'O Mackenzie costuma apresentar reflexões sobre ética, convivência social e cultura contemporânea.'
  },

  puc_sp: {
    id: 'puc_sp',
    nome: 'PUC-SP',
    tipo_texto: 'dissertativo-argumentativo',
    nota_maxima: 100,
    escala_por_competencia: 25,
    exige_proposta_intervencao: false,
    limite_linhas: 30,
    competencias: [
      {
        id: 1,
        nome: 'Compreensão temática e problematização crítica',
        criterios: 'Leitura atenta dos textos motivadores e formulação de tese com sensibilidade social e perspectiva humanística (0 a 25 pts).'
      },
      {
        id: 2,
        nome: 'Repertório sociocultural e consistência argumentativa',
        criterios: 'Argumentação fundamentada em conceitos históricos, filosóficos e sociológicos; articulação coerente e autoria (0 a 25 pts).'
      },
      {
        id: 3,
        nome: 'Estrutura dissertativa, coesão e progressão textual',
        criterios: 'Organização em parágrafos bem estruturados, transições lógicas entre ideias e conclusão reflexiva (0 a 25 pts).'
      },
      {
        id: 4,
        nome: 'Domínio da norma padrão da língua portuguesa',
        criterios: 'Correção gramatical, pontuação, acentuação, precisão lexical e clareza sintática (0 a 25 pts).'
      }
    ],
    zerar_redacao: [
      'Fuga total ao tema',
      'Menos de 15 linhas',
      'Desrespeito à tipologia dissertativa',
      'Identificação'
    ],
    observacao: 'A PUC-SP avalia a redação na escala de 0 a 100 pontos, destacando a dimensão ética e a cidadania.'
  },

  unifesp: {
    id: 'unifesp',
    nome: 'UNIFESP',
    tipo_texto: 'dissertativo-argumentativo (Padrão VUNESP)',
    nota_maxima: 100,
    escala_por_competencia: null,
    exige_proposta_intervencao: false,
    limite_linhas: 30,
    competencias: [
      {
        id: 1,
        nome: 'Tema e abordagem crítica reflexiva',
        criterios: 'Compreensão integral do tema proposto, pertinência da abordagem e sustentação de ponto de vista claro (0 a 30 pts).'
      },
      {
        id: 2,
        nome: 'Estrutura, gênero dissertativo e consistência da tese',
        criterios: 'Organização macrotextual dissertativa, consistência dos argumentos e profundidade reflexiva (0 a 40 pts).'
      },
      {
        id: 3,
        nome: 'Coesão textual e domínio da norma culta formal',
        criterios: 'Emprego correto dos recursos de coesão, correção gramatical, sintaxe clara e precisão vocabular (0 a 30 pts).'
      }
    ],
    zerar_redacao: [
      'Fuga total ao tema',
      'Não atendimento ao gênero dissertativo',
      'Menos de 15 linhas',
      'Identificação do candidato'
    ],
    observacao: 'No Vestibular Misto da UNIFESP, a prova dissertativa é formulada pela VUNESP com alto nível de exigência conceitual, especialmente em temas éticos, sociais e biomédicos.'
  }
};

export class CorretorRedacaoService {
  /**
   * Validações mecânicas pré-IA para economizar tokens e tempo
   */
  static normalizarBancaKey(bancaKey: string): string {
    const k = (bancaKey || '').toLowerCase().trim().replace(/[-_]/g, '');
    if (k.includes('enem')) return 'enem';
    if (k.includes('fuvest') || k.includes('usp')) return 'fuvest';
    if (k.includes('unicamp') || k.includes('comvest')) return 'unicamp';
    if (k.includes('unesp') || k.includes('vunesp')) return 'unesp';
    if (k.includes('uerj')) return 'uerj';
    if (k.includes('ita')) return 'ita';
    if (k.includes('ime')) return 'ime';
    if (k.includes('fgv')) return 'fgv';
    if (k.includes('mackenzie')) return 'mackenzie';
    if (k.includes('puc')) return 'puc_sp';
    if (k.includes('unifesp')) return 'unifesp';
    return (bancaKey || '').toLowerCase().trim();
  }

  /**
   * Validações mecânicas pré-IA para economizar tokens e tempo
   */
  static validarSubmissao(bancaKey: string, texto: string): string[] {
    const erros: string[] = [];
    const normalizedKey = this.normalizarBancaKey(bancaKey);

    if (!RUBRICAS[normalizedKey]) {
      erros.push(`Banca inválida. Opções aceitas: ${Object.keys(RUBRICAS).join(', ')}`);
      return erros;
    }

    const rubrica = RUBRICAS[normalizedKey];
    const textoLimpo = (texto || '').trim();

    if (textoLimpo.length < 200) {
      erros.push('Texto muito curto para análise (mínimo 200 caracteres para uma avaliação fidedigna).');
    }

    if (textoLimpo.length > REDACAO_LIMITE_CARACTERES) {
      erros.push(`O texto excede o limite máximo permitido (${REDACAO_LIMITE_CARACTERES} caracteres).`);
    }

    // Contagem aproximada de linhas (~72 caracteres por linha em folha padrão de vestibular)
    const linhasEstimadas = Math.max(1, Math.floor(textoLimpo.length / 72));
    if (rubrica.limite_linhas && linhasEstimadas > rubrica.limite_linhas * 1.5) {
      erros.push(
        `Texto com aproximadamente ~${linhasEstimadas} linhas estimadas. A ${rubrica.nome} limita a prova a ${rubrica.limite_linhas} linhas.`
      );
    }

    // Verificação de texto válido com verbos essenciais em português
    const verbRegex = /\b(está|estao|estão|são|sao|ser|foi|foram|era|eram|há|ha|tem|têm|temos|pode|podem|deve|devem|faz|fazer|existe|existem|torna|tornar|mostra|mostrar|evidencia|evidenciar|busca|gerar|garantir|atingir|conclui-se|observa-se|trata-se)\b/i;
    if (!verbRegex.test(textoLimpo)) {
      erros.push('O texto não parece conter estrutura oracional de redação em língua portuguesa.');
    }

    return erros;
  }

  /**
   * Constrói o prompt oficial detalhado conforme a rubrica de cada banca
   */
  static construirPrompt(
    bancaKey: string,
    tema: string,
    texto: string,
    propostaNumero?: number
  ): string {
    const normalizedKey = this.normalizarBancaKey(bancaKey);
    const rubrica = RUBRICAS[normalizedKey] || RUBRICAS.enem;

    let competenciasStr = '';
    for (const comp of rubrica.competencias) {
      competenciasStr += `\n**Competência ${comp.id} — ${comp.nome}**\n${comp.criterios}\n`;
    }

    const zerarStr = rubrica.zerar_redacao.map((z) => `- ${z}`).join('\n');

    let instrucaoNota = '';
    let formatoSaida = '';

    if (normalizedKey === 'enem') {
      instrucaoNota = `Atribua uma NOTA de 0 a 200 para cada uma das 5 competências, seguindo estritamente a escala oficial do INEP (0, 40, 80, 120, 160, 200). Some as notas para obter a nota final de 0 a 1000. Analise os 5 elementos obrigatórios da intervenção: Agente, Ação, Meio/Modo, Finalidade e Detalhamento.`;
      formatoSaida = `{
  "zerada": false,
  "motivo_zeramento": null,
  "competencias": [
    {"id": 1, "nome": "Domínio da modalidade escrita formal da língua portuguesa", "nota": 160, "nota_max": 200, "comentario": "Análise crítica com exemplos concretos do texto..."},
    {"id": 2, "nome": "Compreender a proposta de redação e aplicar conceitos das áreas de conhecimento", "nota": 160, "nota_max": 200, "comentario": "..."},
    {"id": 3, "nome": "Selecionar, relacionar, organizar e interpretar informações, fatos, opiniões e argumentos", "nota": 160, "nota_max": 200, "comentario": "..."},
    {"id": 4, "nome": "Conhecimento dos mecanismos linguísticos necessários para a construção da argumentação", "nota": 160, "nota_max": 200, "comentario": "..."},
    {"id": 5, "nome": "Elaborar proposta de intervenção para o problema abordado, respeitando os direitos humanos", "nota": 160, "nota_max": 200, "comentario": "..."}
  ],
  "nota_final": 800,
  "pontos_fortes": ["Ponto forte 1", "Ponto forte 2"],
  "pontos_melhoria": ["Ponto de melhoria com recomendação prática 1", "Ponto de melhoria 2"],
  "sugestao_proposta_intervencao": {
    "agente": "Nome do agente social",
    "acao": "Ação articulada",
    "meio": "Modo/meio de execução",
    "finalidade": "Efeito e propósito",
    "detalhamento": "Especificação técnica de um dos elementos"
  },
  "parecer_geral": "Parecer holístico detalhado do corretor..."
}`;
    } else if (rubrica.nota_maxima !== null) {
      instrucaoNota = `A banca ${rubrica.nome} atribui pontuação oficial na escala de 0 a ${rubrica.nota_maxima}. Avalie cada uma das ${rubrica.competencias.length} competências com uma 'nota' coerente e 'comentario' crítico e fundamentado citando trechos reais. Some as notas para obter a 'nota_final' (de 0 a ${rubrica.nota_maxima}). Calcule também um 'conceito_geral' ('Excelente', 'Ótimo', 'Bom', 'Regular' ou 'Insuficiente'). ${rubrica.exige_proposta_intervencao ? 'Exige proposta de intervenção social.' : 'NÃO exige proposta de intervenção social — valorize a conclusão reflexiva ou síntese dos argumentos.'}`;
      formatoSaida = `{
  "zerada": false,
  "motivo_zeramento": null,
  "competencias": [
    ${rubrica.competencias.map((c, i) => `{"id": ${c.id}, "nome": "${c.nome}", "nota": ${rubrica.escala_por_competencia || (rubrica.nota_maxima! / rubrica.competencias.length)}, "nota_max": ${rubrica.escala_por_competencia || (rubrica.nota_maxima! / rubrica.competencias.length)}, "comentario": "Comentário detalhado citando o texto..."}`).join(',\n    ')}
  ],
  "nota_final": ${rubrica.nota_maxima * 0.8},
  "conceito_geral": "Ótimo",
  "pontos_fortes": ["Ponto forte 1", "Ponto forte 2"],
  "pontos_melhoria": ["Ponto de melhoria 1", "Ponto de melhoria 2"],
  "parecer_geral": "Parecer aprofundado do corretor da banca..."
}`;
    } else {
      instrucaoNota = `A ${rubrica.nome} avalia cada competência prioritariamente por CONCEITO oficial: 'Insuficiente', 'Regular', 'Bom', 'Ótimo' ou 'Excelente'. Calcule também o 'conceito_geral' da redação e uma nota proporcional estimada. Produza um parecer textual detalhado, exatamente como um avaliador experiente da banca faria.`;
      formatoSaida = `{
  "zerada": false,
  "motivo_zeramento": null,
  "competencias": [
    ${rubrica.competencias.map((c, i) => `{"id": ${c.id}, "nome": "${c.nome}", "conceito": "Bom", "comentario": "..."}`).join(',\n    ')}
  ],
  "conceito_geral": "Bom",
  "pontos_fortes": ["Ponto forte 1", "Ponto forte 2"],
  "pontos_melhoria": ["Ponto de melhoria 1", "Ponto de melhoria 2"],
  "parecer_geral": "Parecer aprofundado do corretor da banca..."
}`;
    }

    let propostaStr = '';
    if (normalizedKey === 'unicamp' && propostaNumero) {
      propostaStr = `\nAVALIANDO A PROPOSTA Nº ${propostaNumero} DA UNICAMP (${propostaNumero === 1 ? 'Dissertação argumentativa' : 'Gênero textual específico'}).\n`;
    }

    return `Você é o CorrigeBot, corretor oficial de redações do ${rubrica.nome}, com ampla experiência em bancas de vestibulares. Corrija a redação abaixo com rigor, justiça pedagógica e fidelidade TOTAL aos critérios oficiais da banca.

=== TIPO DE TEXTO EXIGIDO ===
${rubrica.tipo_texto}

=== COMPETÊNCIAS E CRITÉRIOS OFICIAIS DA BANCA ===
${competenciasStr}

=== SITUAÇÕES QUE ZERAM A REDAÇÃO ===
${zerarStr}

=== INSTRUÇÃO DE AVALIAÇÃO ===
${instrucaoNota}
${propostaStr}
${rubrica.observacao ? `ATENÇÃO ESPECIAL: ${rubrica.observacao}` : ''}

=== TEMA PROPOSTO ===
"${tema}"

=== REDAÇÃO DO CANDIDATO ===
${texto}

=== DIRETRIZES DO PARECER ===
- Seja específico: cite trechos reais da redação nos comentários.
- Aponte erros gramaticais e desvios de coesão concretos quando existirem.
- Nos pontos de melhoria, sugira a correção ou reelaboração, não apenas aponte o problema.
- Seja honesto: não infle notas ou conceitos. Corrija exatamente como a banca oficial corrigiria.
- Caso a redação incorra em critérios de anulação/zeramento, defina "zerada": true, atribua a nota 0 ou conceito Insuficiente e justifique em "motivo_zeramento".

=== FORMATO DE SAÍDA EXCLUSIVO ===
Responda APENAS com o JSON estrito abaixo, sem qualquer marcação fora do JSON:
${formatoSaida}`;
  }

  static listarBancas() {
    return Object.values(RUBRICAS).map((b) => ({
      id: b.id,
      nome: b.nome,
      tipo_texto: b.tipo_texto,
      nota_maxima: b.nota_maxima,
      exige_proposta_intervencao: b.exige_proposta_intervencao,
      limite_linhas: b.limite_linhas,
      num_competencias: b.competencias.length,
      observacao: b.observacao || null
    }));
  }
}
