export interface UnicampYearItem {
  ano: number;
  paginaOficial?: string;
  fase1: {
    provaLabel: string;
    provaUrl: string;
    gabaritoLabel: string;
    gabaritoUrl?: string;
    isDiscursiva?: boolean;
    observacao?: string;
    cadernosAdicionais?: { label: string; url: string }[];
  };
  fase2: {
    dias: { label: string; url: string; area?: string }[];
    respostasEsperadas?: { label: string; url: string }[];
  };
}

export const UNICAMP_ACERVO_TABLE: UnicampYearItem[] = [
  // 2025
  {
    ano: 2025,
    paginaOficial: 'https://www.comvest.unicamp.br/ingresso-2025/',
    fase1: {
      provaLabel: 'Prova Q/Y Oficial',
      provaUrl: 'https://www.comvest.unicamp.br/vest2024/F1/f12024Q_Y.pdf',
      gabaritoLabel: 'Resolução Comentada / COMVEST',
      gabaritoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unicamp/unicamp2025_1fase.aspx',
      cadernosAdicionais: [
        { label: 'Prova R/Z', url: 'https://www.comvest.unicamp.br/vest2024/F1/f12024R_Z.pdf' },
        { label: 'Prova S/W', url: 'https://www.comvest.unicamp.br/vest2024/F1/f12024S_W.pdf' },
        { label: 'Prova T/X', url: 'https://www.comvest.unicamp.br/vest2024/F1/f12024T_X.pdf' }
      ]
    },
    fase2: {
      dias: [
        { label: 'Ciências Biológicas (CB)', url: 'https://www.comvest.unicamp.br/vest2024/F2/provas/2024F2CB.pdf', area: 'bio' },
        { label: 'Ciências Exatas (CE)', url: 'https://www.comvest.unicamp.br/vest2024/F2/provas/2024F2CE.pdf', area: 'exatas' },
        { label: 'Ciências Humanas (CH)', url: 'https://www.comvest.unicamp.br/vest2024/F2/provas/2024F2CH.pdf', area: 'humanas' },
        { label: 'Redação + Português + Inglês', url: 'https://www.comvest.unicamp.br/vest2024/F2/provas/2024F2redporingcn.pdf' }
      ]
    }
  },
  // 2024
  {
    ano: 2024,
    paginaOficial: 'https://www.comvest.unicamp.br/ingresso-2024/',
    fase1: {
      provaLabel: 'Prova 1ª Fase Oficial',
      provaUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unicamp/unicamp2024_1fase.aspx',
      gabaritoLabel: 'Gabarito Oficial',
      gabaritoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unicamp/unicamp2024_1fase.aspx'
    },
    fase2: {
      dias: [
        { label: 'Dia 1 Geral', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unicamp/unicamp2024_2fase.aspx' },
        { label: 'Biológicas', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unicamp/unicamp2024_2fase.aspx', area: 'bio' },
        { label: 'Exatas', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unicamp/unicamp2024_2fase.aspx', area: 'exatas' },
        { label: 'Humanas', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unicamp/unicamp2024_2fase.aspx', area: 'humanas' }
      ]
    }
  },
  // 2023
  {
    ano: 2023,
    paginaOficial: 'https://www.comvest.unicamp.br/ingresso-2023/',
    fase1: {
      provaLabel: 'Prova Q/Z Oficial',
      provaUrl: 'https://www.comvest.unicamp.br/vest2023/F1/f12023Q_Z.pdf',
      gabaritoLabel: 'Gabarito 1ª Fase Oficial (V2)',
      gabaritoUrl: 'https://www.comvest.unicamp.br/wp-content/uploads/2022/11/Gabarito_F1_VEST2023_V2.pdf',
      cadernosAdicionais: [
        { label: 'Prova R/Y', url: 'https://www.comvest.unicamp.br/vest2023/F1/f12023R_Y.pdf' },
        { label: 'Prova S/X', url: 'https://www.comvest.unicamp.br/vest2023/F1/f12023S_X.pdf' },
        { label: 'Prova T/W', url: 'https://www.comvest.unicamp.br/vest2023/F1/f12023T_W.pdf' }
      ]
    },
    fase2: {
      dias: [
        { label: 'Biológicas (CB)', url: 'https://www.comvest.unicamp.br/vest2023/F2/provas/2023F2CB.pdf', area: 'bio' },
        { label: 'Exatas (CE)', url: 'https://www.comvest.unicamp.br/vest2023/F2/provas/2023F2CE.pdf', area: 'exatas' },
        { label: 'Humanas (CH)', url: 'https://www.comvest.unicamp.br/vest2023/F2/provas/2023F2CH.pdf', area: 'humanas' },
        { label: 'Redação + Português + Inglês', url: 'https://www.comvest.unicamp.br/vest2023/F2/provas/2023F2redporingcn.pdf' }
      ],
      respostasEsperadas: [
        { label: 'Respostas Esperadas Dia 1', url: 'https://www.comvest.unicamp.br/wp-content/uploads/2022/12/Respostas-Esperadas_1odia.docx.pdf' },
        { label: 'Respostas Esperadas Dia 2 (CB)', url: 'https://www.comvest.unicamp.br/wp-content/uploads/2022/12/RespostasEsperadas_2odia_CB.pdf' },
        { label: 'Expectativas Redação', url: 'https://www.comvest.unicamp.br/wp-content/uploads/2022/12/Resposta-Esperada_RED.docx.pdf' }
      ]
    }
  },
  // 2022
  {
    ano: 2022,
    paginaOficial: 'https://www.comvest.unicamp.br/ingresso-2022/',
    fase1: {
      provaLabel: 'Prova Q/X Oficial',
      provaUrl: 'https://www.comvest.unicamp.br/vest2022/F1/f12022Q_X.pdf',
      gabaritoLabel: 'Gabarito Oficial Divulgação',
      gabaritoUrl: 'https://www.comvest.unicamp.br/wp-content/uploads/2021/11/gabarito_2022_DIVULGA.pdf',
      cadernosAdicionais: [
        { label: 'Prova R/W', url: 'https://www.comvest.unicamp.br/vest2022/F1/f12022R_W.pdf' },
        { label: 'Prova S/Z', url: 'https://www.comvest.unicamp.br/vest2022/F1/f12022S_Z.pdf' },
        { label: 'Prova T/Y', url: 'https://www.comvest.unicamp.br/vest2022/F1/f12022T_Y.pdf' }
      ]
    },
    fase2: {
      dias: [
        { label: 'Biológicas (CB)', url: 'https://www.comvest.unicamp.br/vest2022/F2/provas/2022F2CB.pdf', area: 'bio' },
        { label: 'Exatas (CE)', url: 'https://www.comvest.unicamp.br/vest2022/F2/provas/2022F2CE.pdf', area: 'exatas' }
      ],
      respostasEsperadas: [
        { label: 'Expectativa Redação', url: 'https://www.comvest.unicamp.br/wp-content/uploads/2022/01/Resposta-Esperada_2022_RED.pdf' },
        { label: 'Respostas CB/S', url: 'https://www.comvest.unicamp.br/wp-content/uploads/2022/01/Resposta-Esperada_CB_S.pdf' },
        { label: 'Respostas CE/T', url: 'https://www.comvest.unicamp.br/wp-content/uploads/2022/01/Resposta-Esperada_CE_T.pdf' }
      ]
    }
  },
  // 2021
  {
    ano: 2021,
    paginaOficial: 'https://www.comvest.unicamp.br/ingresso-2021-comvest/',
    fase1: {
      provaLabel: 'Prova E/G Oficial',
      provaUrl: 'https://www.comvest.unicamp.br/vest2021/F1/f12021E_G.pdf',
      gabaritoLabel: 'Gabarito Oficial Dia 1',
      gabaritoUrl: 'https://www.comvest.unicamp.br/wp-content/uploads/2021/01/DIA1_gabarito_2021.pdf',
      observacao: 'Edição adaptada (Pandemia). 72 questões.',
      cadernosAdicionais: [
        { label: 'Prova F/H', url: 'https://www.comvest.unicamp.br/vest2021/F1/f12021F_H.pdf' },
        { label: 'Prova J/L', url: 'https://www.comvest.unicamp.br/vest2021/F1/f12021J_L.pdf' },
        { label: 'Prova K/M', url: 'https://www.comvest.unicamp.br/vest2021/F1/f12021K_M.pdf' }
      ]
    },
    fase2: {
      dias: [
        { label: 'Biológicas (CB)', url: 'https://www.comvest.unicamp.br/vest2021/F2/provas/2021F2CB.pdf', area: 'bio' },
        { label: 'Exatas (CE)', url: 'https://www.comvest.unicamp.br/vest2021/F2/provas/2021F2CE.pdf', area: 'exatas' },
        { label: 'Humanas (CH)', url: 'https://www.comvest.unicamp.br/vest2021/F2/provas/2021F2CH.pdf', area: 'humanas' },
        { label: 'Redação + Português + Inglês', url: 'https://www.comvest.unicamp.br/vest2021/F2/provas/2021F2redporing.pdf' }
      ],
      respostasEsperadas: [
        { label: 'Gabarito Oficial Dia 2', url: 'https://www.comvest.unicamp.br/wp-content/uploads/2021/01/DIA2_gabarito_2020.pdf' },
        { label: 'Respostas CB/S', url: 'https://www.comvest.unicamp.br/wp-content/uploads/2021/02/Resposta-Esperada_CB_S.pdf' },
        { label: 'Respostas CE/T', url: 'https://www.comvest.unicamp.br/wp-content/uploads/2021/02/Resposta-Esperada_CE_T.pdf' }
      ]
    }
  },
  // 2020
  {
    ano: 2020,
    paginaOficial: 'https://www.comvest.unicamp.br/vestibulares-anteriores/ingresso-2020/',
    fase1: {
      provaLabel: 'Prova Q/X Oficial',
      provaUrl: 'https://www.comvest.unicamp.br/vest2020/F1/f12020Q_X.pdf',
      gabaritoLabel: 'Resolução Comentada',
      gabaritoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unicamp/unicamp2020_1fase.aspx',
      cadernosAdicionais: [
        { label: 'Prova R/W', url: 'https://www.comvest.unicamp.br/vest2020/F1/f12020R_W.pdf' },
        { label: 'Prova S/Z', url: 'https://www.comvest.unicamp.br/vest2020/F1/f12020S_Z.pdf' },
        { label: 'Prova T/Y', url: 'https://www.comvest.unicamp.br/vest2020/F1/f12020T_Y.pdf' }
      ]
    },
    fase2: {
      dias: [
        { label: 'Biológicas (CB)', url: 'https://www.comvest.unicamp.br/vest2020/F2/provas/2020F2CB.pdf', area: 'bio' },
        { label: 'Exatas (CE)', url: 'https://www.comvest.unicamp.br/vest2020/F2/provas/2020F2CE.pdf', area: 'exatas' },
        { label: 'Humanas (CH)', url: 'https://www.comvest.unicamp.br/vest2020/F2/provas/2020F2CH.pdf', area: 'humanas' },
        { label: 'Redação + Português', url: 'https://www.comvest.unicamp.br/vest2020/F2/provas/2020F2redporting.pdf' }
      ],
      respostasEsperadas: [
        { label: 'Respostas Biológicas (CB)', url: 'https://www.comvest.unicamp.br/vest2020/F2/provas/resp_2020F2CB.pdf' },
        { label: 'Respostas Exatas (CE)', url: 'https://www.comvest.unicamp.br/vest2020/F2/provas/resp_2020F2CE.pdf' },
        { label: 'Respostas Humanas (CH)', url: 'https://www.comvest.unicamp.br/vest2020/F2/provas/resp_2020F2CH.pdf' },
        { label: 'Respostas Redação + Português', url: 'https://www.comvest.unicamp.br/vest2020/F2/provas/resp_2020F2redporting.pdf' }
      ]
    }
  },
  // 2019
  {
    ano: 2019,
    paginaOficial: 'https://www.comvest.unicamp.br/vestibulares-anteriores/ingresso-2019/',
    fase1: {
      provaLabel: 'Prova Q/X Oficial',
      provaUrl: 'https://www.comvest.unicamp.br/vest2019/F1/f12019Q_X.pdf',
      gabaritoLabel: 'Resolução Comentada',
      gabaritoUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unicamp/unicamp2019_1fase.aspx',
      cadernosAdicionais: [
        { label: 'Prova R/Z', url: 'https://www.comvest.unicamp.br/vest2019/F1/f12019R_Z.pdf' },
        { label: 'Prova S/Y', url: 'https://www.comvest.unicamp.br/vest2019/F1/f12019S_Y.pdf' },
        { label: 'Prova T/W', url: 'https://www.comvest.unicamp.br/vest2019/F1/f12019T_W.pdf' }
      ]
    },
    fase2: {
      dias: [
        { label: 'Física + Bio + Química', url: 'https://www.comvest.unicamp.br/vest2019/F2/provas/fisbioqui.pdf', area: 'bio' },
        { label: 'Matemática + Geo + História', url: 'https://www.comvest.unicamp.br/vest2019/F2/provas/matgeohis.pdf', area: 'exatas' },
        { label: 'Redação + Português', url: 'https://www.comvest.unicamp.br/vest2019/F2/provas/redport.pdf', area: 'humanas' }
      ],
      respostasEsperadas: [
        { label: 'Respostas Biologia', url: 'https://www.comvest.unicamp.br/vest2019/F2/provas/bioresp.pdf' },
        { label: 'Respostas Física', url: 'https://www.comvest.unicamp.br/vest2019/F2/provas/fisresp.pdf' },
        { label: 'Respostas Geografia', url: 'https://www.comvest.unicamp.br/vest2019/F2/provas/georesp.pdf' },
        { label: 'Respostas História', url: 'https://www.comvest.unicamp.br/vest2019/F2/provas/hisresp.pdf' }
      ]
    }
  },
  // 2018
  {
    ano: 2018,
    paginaOficial: 'https://www.comvest.unicamp.br/vestibulares-anteriores/vestibular-2018/',
    fase1: {
      provaLabel: 'Prova Q Oficial',
      provaUrl: 'https://www.comvest.unicamp.br/vest2018/F1/f12018Q.pdf',
      gabaritoLabel: 'Gabarito Oficial 2018',
      gabaritoUrl: 'https://www.comvest.unicamp.br/vest2018/F1/gabarito2018.pdf',
      cadernosAdicionais: [
        { label: 'Prova R', url: 'https://www.comvest.unicamp.br/vest2018/F1/f12018R.pdf' },
        { label: 'Prova S', url: 'https://www.comvest.unicamp.br/vest2018/F1/f12018S.pdf' },
        { label: 'Prova T', url: 'https://www.comvest.unicamp.br/vest2018/F1/f12018T.pdf' }
      ]
    },
    fase2: {
      dias: [
        { label: 'Física + Bio + Química', url: 'https://www.comvest.unicamp.br/vest2018/F2/provas/fisbioqui.pdf', area: 'bio' },
        { label: 'Matemática + Geo + História', url: 'https://www.comvest.unicamp.br/vest2018/F2/provas/matgeohis.pdf', area: 'exatas' },
        { label: 'Redação + Português', url: 'https://www.comvest.unicamp.br/vest2018/F2/provas/redport.pdf' }
      ],
      respostasEsperadas: [
        { label: 'Respostas Física', url: 'https://www.comvest.unicamp.br/vest2018/F2/provas/fisresp.pdf' },
        { label: 'Respostas Biologia', url: 'https://www.comvest.unicamp.br/vest2018/F2/provas/bioresp.pdf' },
        { label: 'Respostas Geografia', url: 'https://www.comvest.unicamp.br/vest2018/F2/provas/georesp.pdf' },
        { label: 'Respostas História', url: 'https://www.comvest.unicamp.br/vest2018/F2/provas/hisresp.pdf' }
      ]
    }
  },
  // 2017
  {
    ano: 2017,
    paginaOficial: 'https://www.comvest.unicamp.br/vestibulares-anteriores/vestibular-2017/',
    fase1: {
      provaLabel: 'Prova 1ª Fase Oficial',
      provaUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unicamp/unicamp2017_1fase.aspx',
      gabaritoLabel: 'Gabarito Oficial 2017',
      gabaritoUrl: 'https://www.comvest.unicamp.br/wp-content/uploads/2017/02/gabarito2017.pdf'
    },
    fase2: {
      dias: [
        { label: 'Dia 1 Geral', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unicamp/unicamp2017_2fase.aspx' }
      ],
      respostasEsperadas: [
        { label: 'Respostas Biologia', url: 'https://www.comvest.unicamp.br/wp-content/uploads/2017/04/bioresp.pdf' },
        { label: 'Respostas Física', url: 'https://www.comvest.unicamp.br/wp-content/uploads/2017/04/fisresp.pdf' },
        { label: 'Respostas Geografia', url: 'https://www.comvest.unicamp.br/wp-content/uploads/2017/04/georesp.pdf' }
      ]
    }
  },
  // 2016
  {
    ano: 2016,
    paginaOficial: 'https://www.comvest.unicamp.br/vestibulares-anteriores/vestibular-2016/',
    fase1: {
      provaLabel: 'Prova 1ª Fase Oficial',
      provaUrl: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unicamp/unicamp2016_1fase.aspx',
      gabaritoLabel: 'Gabarito Oficial 2016',
      gabaritoUrl: 'https://www.comvest.unicamp.br/wp-content/uploads/2017/02/gabarito2016.pdf'
    },
    fase2: {
      dias: [
        { label: 'Dia 1 Geral', url: 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/unicamp/unicamp2016_2fase.aspx' }
      ],
      respostasEsperadas: [
        { label: 'Respostas Biologia', url: 'https://www.comvest.unicamp.br/wp-content/uploads/2017/02/bioresp-1.pdf' },
        { label: 'Respostas Física', url: 'https://www.comvest.unicamp.br/wp-content/uploads/2017/02/fisresp-1.pdf' },
        { label: 'Respostas Geografia', url: 'https://www.comvest.unicamp.br/wp-content/uploads/2017/02/georesp-1.pdf' }
      ]
    }
  },
  // 2015
  {
    ano: 2015,
    paginaOficial: 'https://www.comvest.unicamp.br/vestibulares-anteriores/vestibular-2015/',
    fase1: {
      provaLabel: 'Prova Q/W Oficial',
      provaUrl: 'https://www.comvest.unicamp.br/vest2015/F1/f12015QW.pdf',
      gabaritoLabel: 'Gabarito Oficial 2015',
      gabaritoUrl: 'https://www.comvest.unicamp.br/vest2015/F1/gabarito2015.pdf',
      cadernosAdicionais: [
        { label: 'Prova R/Z', url: 'https://www.comvest.unicamp.br/vest2015/F1/f12015RZ.pdf' },
        { label: 'Prova S/Y', url: 'https://www.comvest.unicamp.br/vest2015/F1/f12015SY.pdf' },
        { label: 'Prova T/X', url: 'https://www.comvest.unicamp.br/vest2015/F1/f12015TX.pdf' }
      ]
    },
    fase2: {
      dias: [
        { label: 'Física + Química + Bio', url: 'https://www.comvest.unicamp.br/vest2015/F2/provas/fisquibio.pdf' },
        { label: 'Arquitetura Aptidão', url: 'https://www.comvest.unicamp.br/vest2015/F2/provas/he/arquitetura2015.pdf' }
      ],
      respostasEsperadas: [
        { label: 'Respostas Biologia', url: 'https://www.comvest.unicamp.br/vest2015/F2/provas/bioresp.pdf' },
        { label: 'Respostas Física', url: 'https://www.comvest.unicamp.br/vest2015/F2/provas/fisresp.pdf' },
        { label: 'Respostas Geografia', url: 'https://www.comvest.unicamp.br/vest2015/F2/provas/georesp.pdf' },
        { label: 'Respostas História', url: 'https://www.comvest.unicamp.br/vest2015/F2/provas/hisresp.pdf' }
      ]
    }
  },
  // 2014
  {
    ano: 2014,
    paginaOficial: 'https://www.comvest.unicamp.br/vestibulares-anteriores/vestibular-2014/',
    fase1: {
      provaLabel: 'Prova Q/X Oficial',
      provaUrl: 'https://www.comvest.unicamp.br/vest2014/F1/f12014QX.pdf',
      gabaritoLabel: 'Gabarito Oficial 2014',
      gabaritoUrl: 'https://www.comvest.unicamp.br/vest2014/F1/gabarito2014.pdf',
      cadernosAdicionais: [
        { label: 'Prova R/W', url: 'https://www.comvest.unicamp.br/vest2014/F1/f12014RW.pdf' },
        { label: 'Prova S/Z', url: 'https://www.comvest.unicamp.br/vest2014/F1/f12014SZ.pdf' },
        { label: 'Prova T/Y', url: 'https://www.comvest.unicamp.br/vest2014/F1/f12014TY.pdf' }
      ]
    },
    fase2: {
      dias: [
        { label: 'Ciências Humanas e Inglês', url: 'https://www.comvest.unicamp.br/vest2014/F2/provas/ciening.pdf' },
        { label: 'Ciências da Natureza', url: 'https://www.comvest.unicamp.br/vest2014/F2/provas/ciennatu.pdf' }
      ],
      respostasEsperadas: [
        { label: 'Respostas Ciências Humanas', url: 'https://www.comvest.unicamp.br/vest2014/F2/provas/charesp.pdf' },
        { label: 'Respostas Ciências Natureza', url: 'https://www.comvest.unicamp.br/vest2014/F2/provas/cnresp.pdf' },
        { label: 'Respostas Inglês', url: 'https://www.comvest.unicamp.br/vest2014/F2/provas/ingresp.pdf' },
        { label: 'Respostas Matemática', url: 'https://www.comvest.unicamp.br/vest2014/F2/provas/matresp.pdf' }
      ]
    }
  },
  // 2013
  {
    ano: 2013,
    paginaOficial: 'https://www.comvest.unicamp.br/vestibulares-anteriores/vestibular-2013/',
    fase1: {
      provaLabel: 'Prova Q/Z Oficial',
      provaUrl: 'https://www.comvest.unicamp.br/vest2013/F1/f12013QZ.pdf',
      gabaritoLabel: 'Gabarito Oficial 2013',
      gabaritoUrl: 'https://www.comvest.unicamp.br/vest2013/F1/gabarito2013.pdf',
      cadernosAdicionais: [
        { label: 'Prova R/Y', url: 'https://www.comvest.unicamp.br/vest2013/F1/f12013RY.pdf' },
        { label: 'Prova S/X', url: 'https://www.comvest.unicamp.br/vest2013/F1/f12013SX.pdf' },
        { label: 'Prova T/W', url: 'https://www.comvest.unicamp.br/vest2013/F1/f12013TW.pdf' }
      ]
    },
    fase2: {
      dias: [
        { label: 'Ciências Humanas e Inglês', url: 'https://www.comvest.unicamp.br/vest2013/F2/provas/ciening.pdf' },
        { label: 'Ciências da Natureza', url: 'https://www.comvest.unicamp.br/vest2013/F2/provas/ciennatu.pdf' }
      ],
      respostasEsperadas: [
        { label: 'Respostas Humanas', url: 'https://www.comvest.unicamp.br/vest2013/F2/provas/charesp.pdf' },
        { label: 'Respostas Natureza', url: 'https://www.comvest.unicamp.br/vest2013/F2/provas/cnresp.pdf' },
        { label: 'Respostas Inglês', url: 'https://www.comvest.unicamp.br/vest2013/F2/provas/ingresp.pdf' },
        { label: 'Respostas Matemática', url: 'https://www.comvest.unicamp.br/vest2013/F2/provas/matresp.pdf' }
      ]
    }
  },
  // 2012
  {
    ano: 2012,
    paginaOficial: 'https://www.comvest.unicamp.br/vestibulares-anteriores/vestibular-2012/',
    fase1: {
      provaLabel: 'Prova Q/Z Oficial',
      provaUrl: 'https://www.comvest.unicamp.br/vest2012/F1/f12012QZ.pdf',
      gabaritoLabel: 'Gabarito Oficial 2012',
      gabaritoUrl: 'https://www.comvest.unicamp.br/vest2012/F1/gabarito2012.pdf',
      cadernosAdicionais: [
        { label: 'Prova R/Y', url: 'https://www.comvest.unicamp.br/vest2012/F1/f12012RY.pdf' },
        { label: 'Prova S/X', url: 'https://www.comvest.unicamp.br/vest2012/F1/f12012SX.pdf' },
        { label: 'Prova T/W', url: 'https://www.comvest.unicamp.br/vest2012/F1/f12012TW.pdf' }
      ]
    },
    fase2: {
      dias: [
        { label: 'Ciências Humanas e Inglês', url: 'https://www.comvest.unicamp.br/vest2012/F2/provas/ciening.pdf' },
        { label: 'Ciências da Natureza', url: 'https://www.comvest.unicamp.br/vest2012/F2/provas/ciennatu.pdf' }
      ],
      respostasEsperadas: [
        { label: 'Respostas Humanas', url: 'https://www.comvest.unicamp.br/vest2012/F2/provas/charesp.pdf' },
        { label: 'Respostas Natureza', url: 'https://www.comvest.unicamp.br/vest2012/F2/provas/cnresp.pdf' },
        { label: 'Respostas Inglês', url: 'https://www.comvest.unicamp.br/vest2012/F2/provas/ingresp.pdf' },
        { label: 'Respostas Matemática', url: 'https://www.comvest.unicamp.br/vest2012/F2/provas/matresp.pdf' }
      ]
    }
  },
  // 2011
  {
    ano: 2011,
    paginaOficial: 'https://www.comvest.unicamp.br/vestibulares-anteriores/vestibular-2011/',
    fase1: {
      provaLabel: 'Prova Q/Z Oficial',
      provaUrl: 'https://www.comvest.unicamp.br/vest2011/F1/f12011QZ.pdf',
      gabaritoLabel: 'Gabarito Oficial 2011',
      gabaritoUrl: 'https://www.comvest.unicamp.br/vest2011/F1/gabarito2011.pdf',
      cadernosAdicionais: [
        { label: 'Prova R/Y', url: 'https://www.comvest.unicamp.br/vest2011/F1/f12011RY.pdf' },
        { label: 'Prova S/X', url: 'https://www.comvest.unicamp.br/vest2011/F1/f12011SX.pdf' },
        { label: 'Prova T/W', url: 'https://www.comvest.unicamp.br/vest2011/F1/f12011TW.pdf' }
      ]
    },
    fase2: {
      dias: [
        { label: 'Ciências Humanas e Inglês', url: 'https://www.comvest.unicamp.br/vest2011/F2/provas/ciening.pdf' },
        { label: 'Ciências da Natureza', url: 'https://www.comvest.unicamp.br/vest2011/F2/provas/ciennatu.pdf' }
      ],
      respostasEsperadas: [
        { label: 'Respostas Humanas', url: 'https://www.comvest.unicamp.br/vest2011/F2/provas/charesp.pdf' },
        { label: 'Respostas Natureza', url: 'https://www.comvest.unicamp.br/vest2011/F2/provas/cnresp.pdf' },
        { label: 'Respostas Inglês', url: 'https://www.comvest.unicamp.br/vest2011/F2/provas/ingresp.pdf' },
        { label: 'Respostas Matemática', url: 'https://www.comvest.unicamp.br/vest2011/F2/provas/matresp.pdf' }
      ]
    }
  },
  // 2010
  {
    ano: 2010,
    paginaOficial: 'https://www.comvest.unicamp.br/vestibulares-anteriores/vestibular-2010/',
    fase1: {
      provaLabel: 'Questões Fase 1 Oficial',
      provaUrl: 'https://www.comvest.unicamp.br/vest2010/F1/f12010questoes.pdf',
      gabaritoLabel: 'Respostas Esperadas Fase 1',
      gabaritoUrl: 'https://www.comvest.unicamp.br/vest2010/F1/questoesf1_resp_esperadas.pdf',
      isDiscursiva: true,
      cadernosAdicionais: [
        { label: 'Redação Fase 1', url: 'https://www.comvest.unicamp.br/vest2010/F1/f12010redacao.pdf' },
        { label: 'Expectativas Redação', url: 'https://www.comvest.unicamp.br/vest2010/F1/redacao_expectativas.pdf' }
      ]
    },
    fase2: {
      dias: [
        { label: 'Arquitetura', url: 'https://www.comvest.unicamp.br/vest2010/F2/provas/aptidao/arquitetura2010.pdf' }
      ],
      respostasEsperadas: [
        { label: 'Respostas Biologia', url: 'https://www.comvest.unicamp.br/vest2010/F2/provas/bioresp.pdf' },
        { label: 'Respostas Física', url: 'https://www.comvest.unicamp.br/vest2010/F2/provas/fisresp.pdf' },
        { label: 'Respostas Geografia', url: 'https://www.comvest.unicamp.br/vest2010/F2/provas/georesp.pdf' },
        { label: 'Respostas História', url: 'https://www.comvest.unicamp.br/vest2010/F2/provas/hisresp.pdf' }
      ]
    }
  },
  // 2009
  {
    ano: 2009,
    paginaOficial: 'https://www.comvest.unicamp.br/vestibulares-anteriores/vestibular-2009/',
    fase1: {
      provaLabel: 'Questões Fase 1 Oficial',
      provaUrl: 'https://www.comvest.unicamp.br/vest2009/F1/F12009questoes.pdf',
      gabaritoLabel: 'Respostas Esperadas Fase 1',
      gabaritoUrl: 'https://www.comvest.unicamp.br/vest2009/F1/questoesf1_resp_esperadas.pdf',
      isDiscursiva: true,
      cadernosAdicionais: [
        { label: 'Redação Fase 1', url: 'https://www.comvest.unicamp.br/vest2009/F1/f12009redacao.pdf' },
        { label: 'Expectativas Redação', url: 'https://www.comvest.unicamp.br/vest2009/F1/redacao_expectativas.pdf' }
      ]
    },
    fase2: {
      dias: [
        { label: 'Arquitetura', url: 'https://www.comvest.unicamp.br/vest2009/F2/provas/aptidao/arquitetura2009.pdf' }
      ],
      respostasEsperadas: [
        { label: 'Respostas Biologia', url: 'https://www.comvest.unicamp.br/vest2009/F2/provas/bioresp.pdf' },
        { label: 'Respostas Física', url: 'https://www.comvest.unicamp.br/vest2009/F2/provas/fisresp.pdf' },
        { label: 'Respostas Geografia', url: 'https://www.comvest.unicamp.br/vest2009/F2/provas/georesp.pdf' },
        { label: 'Respostas História', url: 'https://www.comvest.unicamp.br/vest2009/F2/provas/hisresp.pdf' }
      ]
    }
  },
  // 2008
  {
    ano: 2008,
    paginaOficial: 'https://www.comvest.unicamp.br/vestibulares-anteriores/vestibular-2008/',
    fase1: {
      provaLabel: 'Prova Fase 1 Oficial',
      provaUrl: 'https://www.comvest.unicamp.br/vest2008/F1/provafase1.pdf',
      gabaritoLabel: 'Respostas Esperadas Fase 1',
      gabaritoUrl: 'https://www.comvest.unicamp.br/vest2008/F1/questoesf1_rep_esperadas.pdf',
      isDiscursiva: true,
      cadernosAdicionais: [
        { label: 'Expectativas Redação', url: 'https://www.comvest.unicamp.br/vest2008/F1/redacao_expectativas.pdf' }
      ]
    },
    fase2: {
      dias: [
        { label: 'Arquitetura', url: 'https://www.comvest.unicamp.br/vest2008/F2/provas/aptidao/arquitetura2008.pdf' }
      ],
      respostasEsperadas: [
        { label: 'Respostas Biologia', url: 'https://www.comvest.unicamp.br/vest2008/F2/provas/bioresp.pdf' },
        { label: 'Respostas Física', url: 'https://www.comvest.unicamp.br/vest2008/F2/provas/fisresp.pdf' },
        { label: 'Respostas Geografia', url: 'https://www.comvest.unicamp.br/vest2008/F2/provas/georesp.pdf' },
        { label: 'Respostas História', url: 'https://www.comvest.unicamp.br/vest2008/F2/provas/hisresp.pdf' }
      ]
    }
  },
  // 2007
  {
    ano: 2007,
    paginaOficial: 'https://www.comvest.unicamp.br/vestibulares-anteriores/vestibular-2007/',
    fase1: {
      provaLabel: 'Fase 1 Geral Oficial',
      provaUrl: 'https://www.comvest.unicamp.br/vest2007/F1/fase1.pdf',
      gabaritoLabel: 'Respostas Esperadas Geral',
      gabaritoUrl: 'https://www.comvest.unicamp.br/vest2007/F1/repostas_esperadas_geral.pdf',
      isDiscursiva: true,
      cadernosAdicionais: [
        { label: 'Fase 1 Comentada', url: 'https://www.comvest.unicamp.br/vest2007/F1/fase1coment.pdf' },
        { label: 'Expectativa Redação', url: 'https://www.comvest.unicamp.br/vest2007/F1/expectativa_RED.pdf' }
      ]
    },
    fase2: {
      dias: [
        { label: 'Arquitetura', url: 'https://www.comvest.unicamp.br/vest2007/F2/provas/aptidao/arquitetura2007.pdf' }
      ],
      respostasEsperadas: [
        { label: 'Respostas Física + Geografia', url: 'https://www.comvest.unicamp.br/vest2007/F2/provas/fisgeoresp.pdf' },
        { label: 'Respostas Matemática + Inglês', url: 'https://www.comvest.unicamp.br/vest2007/F2/provas/matingresp.pdf' },
        { label: 'Respostas Português + Biologia', url: 'https://www.comvest.unicamp.br/vest2007/F2/provas/portbioresp.pdf' },
        { label: 'Respostas Química + História', url: 'https://www.comvest.unicamp.br/vest2007/F2/provas/quihisresp.pdf' }
      ]
    }
  }
];

export const getUnicampYearItem = (year: number | string): UnicampYearItem | undefined => {
  const y = typeof year === 'string' ? parseInt(year, 10) : year;
  return UNICAMP_ACERVO_TABLE.find(item => item.ano === y);
};
