export interface ImeDiscursivaSubject {
  sigla: string;
  nome: string;
  url: string;
  isGabarito?: boolean;
}

export interface ImeConcursoItem {
  concurso: string; // Ex: '2025/2026', '2024/2025'
  anoIngresso: number;
  fase1: {
    provaUrl?: string;
    gabaritoUrl?: string;
    isObjetivasMistas?: boolean;
    materiasObjetivas?: { sigla: string; nome: string; url: string }[];
  };
  fase2: {
    discursivas: ImeDiscursivaSubject[];
  };
}

export const IME_ACERVO_TABLE: ImeConcursoItem[] = [
  // 2025/2026
  {
    concurso: '2025/2026',
    anoIngresso: 2026,
    fase1: {
      provaUrl: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2025-2026/Prova1fase2025OBJETIVA.pdf',
      gabaritoUrl: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2025-2026/Gabarito_FINAL_2025-2026OBJETIVA.pdf'
    },
    fase2: {
      discursivas: [
        { sigla: 'Mat', nome: 'Matemática', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2025-2026/Prova_Discursiva_MATEMATICA_CFG25_26.pdf' },
        { sigla: 'Fís', nome: 'Física', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2025-2026/Prova_Discursiva_FISICA_CFG25_26.pdf' },
        { sigla: 'Quí', nome: 'Química', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2025-2026/Prova_Discursiva_QUIMICA_CFG25_26.pdf' },
        { sigla: 'Port/Ing', nome: 'Português - Inglês', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2025-2026/Prova_LINGUAS_CFG25_26%201.pdf' },
        { sigla: 'Gab. línguas', nome: 'Gabarito Línguas', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2025-2026/Gabarito_DEFINITIVO_LINGUAS_CFG25_26.pdf', isGabarito: true }
      ]
    }
  },
  // 2024/2025
  {
    concurso: '2024/2025',
    anoIngresso: 2025,
    fase1: {
      provaUrl: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2024-2025/CFG_Objetiva_24_25.pdf',
      gabaritoUrl: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2024-2025/GabaritoFINAL20242025.pdf'
    },
    fase2: {
      discursivas: [
        { sigla: 'Mat', nome: 'Matemática', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2024-2025/CFG_-_Matematica_Discursiva2024.pdf' },
        { sigla: 'Fís', nome: 'Física', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2024-2025/CFG_-_Fisica_Discursiva2024.pdf' },
        { sigla: 'Quí', nome: 'Química', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2024-2025/CFG_-_Quimica_Discursiva2024.pdf' },
        { sigla: 'Port/Ing', nome: 'Português - Inglês', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2024-2025/CFG_-_Portugues_e_Ingles2024.pdf' },
        { sigla: 'Gab. línguas', nome: 'Gabarito Línguas', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2024-2025/Gabarito_FINAL_Port_CFRG20242025.pdf', isGabarito: true }
      ]
    }
  },
  // 2023/2024
  {
    concurso: '2023/2024',
    anoIngresso: 2024,
    fase1: {
      provaUrl: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2023-2024/Prova_Objetiva_1_FASE.pdf',
      gabaritoUrl: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2023-2024/Gabarito_Prova_Objetiva_1_FASE.pdf'
    },
    fase2: {
      discursivas: [
        { sigla: 'Mat', nome: 'Matemática', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2023-2024/CFG_Matematica_Discursiva.pdf' },
        { sigla: 'Fís', nome: 'Física', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2023-2024/CFG_Fisica_Discursiva.pdf' },
        { sigla: 'Quí', nome: 'Química', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2023-2024/CFG_Quimica_Discursiva.pdf' },
        { sigla: 'Port/Ing', nome: 'Português - Inglês', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2023-2024/CFG_Portugues_Ingles.pdf' },
        { sigla: 'Gab. línguas', nome: 'Gabarito Línguas', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2023-2024/CFG_Gabarito_Final_Portugues_Ingles.pdf', isGabarito: true }
      ]
    }
  },
  // 2022/2023
  {
    concurso: '2022/2023',
    anoIngresso: 2023,
    fase1: {
      provaUrl: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2022-2023/Prova_1_FASE_CACFG_2022_2023.pdf',
      gabaritoUrl: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2022-2023/GABARITO_FINAL_1_FASE_CACFG_2022_2023.pdf'
    },
    fase2: {
      discursivas: [
        { sigla: 'Mat', nome: 'Matemática', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2022-2023/Prova_MATEMATICA_CACFG_2022_2023.pdf' },
        { sigla: 'Fís', nome: 'Física', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2022-2023/Prova_FISICA_CACFG_2022_2023.pdf' },
        { sigla: 'Quí', nome: 'Química', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2022-2023/Prova_QUIMICA_CACFG_2022_2023.pdf' },
        { sigla: 'Port/Ing', nome: 'Português - Inglês', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2022-2023/Prova_PORTUGUES_INGLES_CACFG_2022_2023.pdf' },
        { sigla: 'Gab. línguas', nome: 'Gabarito Línguas', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2022-2023/GABARITO_FINAL_PORTUGUES_INGLES_CACFG_2022_2023.pdf', isGabarito: true }
      ]
    }
  },
  // 2021/2022
  {
    concurso: '2021/2022',
    anoIngresso: 2022,
    fase1: {
      provaUrl: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2021-2022/PROVA_OBJETIVA_CA_CFG_2021_2022.pdf',
      gabaritoUrl: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2021-2022/GABARITO_DEFINITIVO_PROVA_OBJETIVA_CA_CFG_2021_2022.pdf'
    },
    fase2: {
      discursivas: [
        { sigla: 'Mat', nome: 'Matemática', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2021-2022/PROVA_MATEMATICA_CA_CFG_2021_2022.pdf' },
        { sigla: 'Fís', nome: 'Física', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2021-2022/PROVA_FISICA_CA_CFG_2021_2022.pdf' },
        { sigla: 'Quí', nome: 'Química', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2021-2022/PROVA_QUIMICA_CA_CFG_2021_2022.pdf' },
        { sigla: 'Port/Ing', nome: 'Português - Inglês', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2021-2022/PROVA_PORTUGUES_INGLES_CA_CFG_2021_2022.pdf' },
        { sigla: 'Gab. línguas', nome: 'Gabarito Línguas', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2021-2022/GABARITO_DEFINITIVO_PROVA_PORTUGUES_INGLES_CA_CFG_2021_2022.pdf', isGabarito: true }
      ]
    }
  },
  // 2020/2021
  {
    concurso: '2020/2021',
    anoIngresso: 2021,
    fase1: {
      provaUrl: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2020-2021/Prova_Objetiva_1a_Fase_CFG_2020_2021.pdf',
      gabaritoUrl: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2020-2021/Gabarito_Definitivo_Prova_Objetiva_1a_Fase_CFG_2020_2021.pdf'
    },
    fase2: {
      discursivas: [
        { sigla: 'Mat', nome: 'Matemática', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2020-2021/Prova_Discursiva_Matematica_CFG_2020_2021.pdf' },
        { sigla: 'Fís', nome: 'Física', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2020-2021/Prova_Discursiva_Fisica_CFG_2020_2021.pdf' },
        { sigla: 'Quí', nome: 'Química', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2020-2021/Prova_Discursiva_Quimica_CFG_2020_2021.pdf' },
        { sigla: 'Port/Ing', nome: 'Português - Inglês', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2020-2021/Prova_Mista_Portugues_Ingles_CFG_2020_2021.pdf' },
        { sigla: 'Gab. línguas', nome: 'Gabarito Línguas', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2020-2021/Gabarito_Definitivo_Parte_Objetiva_Ingles_CFG_2020_2021.pdf', isGabarito: true }
      ]
    }
  },
  // 2019/2020
  {
    concurso: '2019/2020',
    anoIngresso: 2020,
    fase1: {
      provaUrl: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2019-2020/prova_objetiva_cfg_2019_2020.pdf',
      gabaritoUrl: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2019-2020/gabarito_definitivo_prova_objetiva_cfg_2019_2020.pdf'
    },
    fase2: {
      discursivas: [
        { sigla: 'Mat', nome: 'Matemática', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2019-2020/prova_matematica_cfg_2019_2020.pdf' },
        { sigla: 'Fís', nome: 'Física', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2019-2020/prova_fisica_cfg_2019_2020.pdf' },
        { sigla: 'Quí', nome: 'Química', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2019-2020/prova_quimica_cfg_2019_2020.pdf' },
        { sigla: 'Port/Ing', nome: 'Português - Inglês', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2019-2020/prova_portugues_ingles_cfg_2019_2020.pdf' },
        { sigla: 'Gab. línguas', nome: 'Gabarito Línguas', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2019-2020/gabarito_definitivo_ingles_cfg_2019_2020.pdf', isGabarito: true }
      ]
    }
  },
  // 2018/2019
  {
    concurso: '2018/2019',
    anoIngresso: 2019,
    fase1: {
      provaUrl: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2018-2019/prova_objetiva_cfg_2018_2019.pdf',
      gabaritoUrl: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2018-2019/gabarito_definitivo_objetiva_cfg_2018_2019.pdf'
    },
    fase2: {
      discursivas: [
        { sigla: 'Mat', nome: 'Matemática', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2018-2019/prova_matematica_cfg_2018_2019.pdf' },
        { sigla: 'Fís', nome: 'Física', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2018-2019/prova_fisica_cfg_2018_2019.pdf' },
        { sigla: 'Quí', nome: 'Química', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2018-2019/prova_quimica_cfg_2018_2019.pdf' },
        { sigla: 'Port/Ing', nome: 'Português - Inglês', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2018-2019/prova_portugues_ingles_cfg_2018_2019.pdf' },
        { sigla: 'Gab. línguas', nome: 'Gabarito Línguas', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2018-2019/gabarito_definitivo_ingles_cfg_2018_2019.pdf', isGabarito: true }
      ]
    }
  },
  // 2017/2018
  {
    concurso: '2017/2018',
    anoIngresso: 2018,
    fase1: {
      provaUrl: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2017-2018/Prova_Objetiva_CFG_2017_2018.pdf',
      gabaritoUrl: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2017-2018/Gabarito_Definitivo_Objetiva_CFG_2017_2018.pdf'
    },
    fase2: {
      discursivas: [
        { sigla: 'Mat', nome: 'Matemática', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2017-2018/Prova_Matematica_CFG_2017_2018.pdf' },
        { sigla: 'Fís', nome: 'Física', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2017-2018/Prova_Fisica_CFG_2017_2018.pdf' },
        { sigla: 'Quí', nome: 'Química', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2017-2018/Prova_Quimica_CFG_2017_2018.pdf' },
        { sigla: 'Port/Ing', nome: 'Português - Inglês', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2017-2018/Prova_Portugues_Ingles_CFG_2017_2018.pdf' },
        { sigla: 'Gab. línguas', nome: 'Gabarito Línguas', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2017-2018/Gabarito_Definitivo_Ingles_CFG_2017_2018.pdf', isGabarito: true }
      ]
    }
  },
  // 2016/2017
  {
    concurso: '2016/2017',
    anoIngresso: 2017,
    fase1: {
      provaUrl: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2016-2017/prova_objetiva_cfg_2016_2017.pdf',
      gabaritoUrl: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2016-2017/gabarito_definitivo_objetiva_cfg_2016_2017.pdf'
    },
    fase2: {
      discursivas: [
        { sigla: 'Mat', nome: 'Matemática', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2016-2017/prova_matematica_cfg_2016_2017.pdf' },
        { sigla: 'Fís', nome: 'Física', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2016-2017/prova_fisica_cfg_2016_2017.pdf' },
        { sigla: 'Quí', nome: 'Química', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2016-2017/prova_quimica_cfg_2016_2017.pdf' },
        { sigla: 'Port/Ing', nome: 'Português - Inglês', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2016-2017/prova_portugues_ingles_cfg_2016_2017.pdf' },
        { sigla: 'Gab. línguas', nome: 'Gabarito Línguas', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2016-2017/gabarito_definitivo_ingles_cfg_2016_2017.pdf', isGabarito: true }
      ]
    }
  },
  // 2015/2016
  {
    concurso: '2015/2016',
    anoIngresso: 2016,
    fase1: {
      provaUrl: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2015-2016/prova_objetiva_cfg_2015_2016.pdf',
      gabaritoUrl: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2015-2016/gabarito_definitivo_objetiva_cfg_2015_2016.pdf'
    },
    fase2: {
      discursivas: [
        { sigla: 'Mat', nome: 'Matemática', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2015-2016/prova_matematica_cfg_2015_2016.pdf' },
        { sigla: 'Fís', nome: 'Física', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2015-2016/prova_fisica_cfg_2015_2016.pdf' },
        { sigla: 'Quí', nome: 'Química', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2015-2016/prova_quimica_cfg_2015_2016.pdf' },
        { sigla: 'Port/Ing', nome: 'Português - Inglês', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2015-2016/prova_portugues_ingles_cfg_2015_2016.pdf' },
        { sigla: 'Gab. línguas', nome: 'Gabarito Línguas', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2015-2016/gabarito_definitivo_ingles_cfg_2015_2016.pdf', isGabarito: true }
      ]
    }
  },
  // 2014/2015
  {
    concurso: '2014/2015',
    anoIngresso: 2015,
    fase1: {
      provaUrl: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2014-2015/prova_objetiva_cfg_2014_2015.pdf',
      gabaritoUrl: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2014-2015/gabarito_definitivo_objetiva_cfg_2014_2015.pdf'
    },
    fase2: {
      discursivas: [
        { sigla: 'Mat', nome: 'Matemática', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2014-2015/prova_matematica_cfg_2014_2015.pdf' },
        { sigla: 'Fís', nome: 'Física', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2014-2015/prova_fisica_cfg_2014_2015.pdf' },
        { sigla: 'Quí', nome: 'Química', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2014-2015/prova_quimica_cfg_2014_2015.pdf' },
        { sigla: 'Port/Ing', nome: 'Português - Inglês', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2014-2015/prova_portugues_ingles_cfg_2014_2015.pdf' },
        { sigla: 'Gab. línguas', nome: 'Gabarito Línguas', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2014-2015/gabarito_definitivo_ingles_cfg_2014_2015.pdf', isGabarito: true }
      ]
    }
  },
  // 2013/2014
  {
    concurso: '2013/2014',
    anoIngresso: 2014,
    fase1: {
      provaUrl: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2013-2014/prova_objetiva_cfg_2013_2014.pdf',
      gabaritoUrl: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2013-2014/gabarito_definitivo_objetiva_cfg_2013_2014.pdf'
    },
    fase2: {
      discursivas: [
        { sigla: 'Mat', nome: 'Matemática', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2013-2014/prova_matematica_cfg_2013_2014.pdf' },
        { sigla: 'Fís', nome: 'Física', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2013-2014/prova_fisica_cfg_2013_2014.pdf' },
        { sigla: 'Quí', nome: 'Química', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2013-2014/prova_quimica_cfg_2013_2014.pdf' },
        { sigla: 'Port/Ing', nome: 'Português - Inglês', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2013-2014/prova_portugues_ingles_cfg_2013_2014.pdf' },
        { sigla: 'Gab. línguas', nome: 'Gabarito Línguas', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/2013-2014/gabarito_definitivo_ingles_cfg_2013_2014.pdf', isGabarito: true }
      ]
    }
  },
  // 2012/2013
  {
    concurso: '2012/2013',
    anoIngresso: 2013,
    fase1: {
      provaUrl: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas12_13/Prova_Objetiva_CFG_2012_2013.pdf',
      gabaritoUrl: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Resultados/2012-2013/gabarito_definitivo_objetiva_2012_2013.pdf'
    },
    fase2: {
      discursivas: [
        { sigla: 'Mat', nome: 'Matemática', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas12_13/matematica_CFG_2012_2013.pdf' },
        { sigla: 'Fís', nome: 'Física', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas12_13/fisica_CFG_2012_2013.pdf' },
        { sigla: 'Quí', nome: 'Química', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas12_13/quimica_CFG_2012_2013.pdf' },
        { sigla: 'Port/Ing', nome: 'Português - Inglês', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas12_13/port_ingl_CFG_2012_2013.pdf' },
        { sigla: 'Gab. línguas', nome: 'Gabarito Línguas', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas12_13/gabarito_objetiva_linguas_2012_2013.pdf', isGabarito: true }
      ]
    }
  },
  // 2011/2012
  {
    concurso: '2011/2012',
    anoIngresso: 2012,
    fase1: {
      provaUrl: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas11_12/ProvaObjetiva_CA_CFG_2011_2012.pdf',
      gabaritoUrl: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Resultados/2011-2012/Gabarito_Definitivo_Prova_Objetiva_CA_CFG_2011_2012.pdf'
    },
    fase2: {
      discursivas: [
        { sigla: 'Mat', nome: 'Matemática', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas11_12/Mat_CFG_2011_2012.pdf' },
        { sigla: 'Fís', nome: 'Física', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas11_12/fisica_CFG_2011_2012.pdf' },
        { sigla: 'Quí', nome: 'Química', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas11_12/Quimica-2011.pdf' },
        { sigla: 'Port/Ing', nome: 'Português - Inglês', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas11_12/Port_Ingl.pdf' },
        { sigla: 'Gab. línguas', nome: 'Gabarito Línguas', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas11_12/gabarito_objetiva_linguas_2011.pdf', isGabarito: true }
      ]
    }
  },
  // 2010/2011
  {
    concurso: '2010/2011',
    anoIngresso: 2011,
    fase1: {
      provaUrl: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas10_11/Objetiva.pdf',
      gabaritoUrl: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Resultados/2010-2011/GABARITO_Prova_Objetiva_2010_final.pdf'
    },
    fase2: {
      discursivas: [
        { sigla: 'Mat', nome: 'Matemática', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas10_11/Matematica_CFG_2010.pdf' },
        { sigla: 'Fís', nome: 'Física', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas10_11/Fisica_CFG_2010.pdf' },
        { sigla: 'Quí', nome: 'Química', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas10_11/Quimica_CFG_2010.pdf' },
        { sigla: 'Port/Ing', nome: 'Português - Inglês', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas10_11/Portugues_e_Ingles_CFG_2010.pdf' },
        { sigla: 'Gab. línguas', nome: 'Gabarito Línguas', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Resultados/2010-2011/Gabarito_Questoes_Objetivas_Portugues_e_Ingles_CFG_2010.pdf', isGabarito: true }
      ]
    }
  },
  // 2009/2010
  {
    concurso: '2009/2010',
    anoIngresso: 2010,
    fase1: {
      provaUrl: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas09_10/Objetiva_Final_Formato_A3_02-10.pdf',
      gabaritoUrl: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Resultados/2009-2010/Gabarito_definitivo_objetiva_2009.pdf'
    },
    fase2: {
      discursivas: [
        { sigla: 'Mat', nome: 'Matemática', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas09_10/Matematica_CfG_A4_2009.pdf' },
        { sigla: 'Fís', nome: 'Física', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas09_10/Fisica_CFG_2009.pdf' },
        { sigla: 'Quí', nome: 'Química', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas09_10/Quimica_CFG_2009.pdf' },
        { sigla: 'Port/Ing', nome: 'Português - Inglês', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas09_10/PortIng_CFG_2009.pdf' },
        { sigla: 'Gab. línguas', nome: 'Gabarito Línguas', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Resultados/2009-2010/Gabarito_definitivo_Port_Ing_2009.pdf', isGabarito: true }
      ]
    }
  },
  // 2008/2009
  {
    concurso: '2008/2009',
    anoIngresso: 2009,
    fase1: {
      provaUrl: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas08_09/Objetiva_CFG_2008.pdf',
      gabaritoUrl: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas08_09/Gabarito_Objetiva_CFG_2008.pdf'
    },
    fase2: {
      discursivas: [
        { sigla: 'Mat', nome: 'Matemática', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas08_09/Matematica_CFG_2008.pdf' },
        { sigla: 'Fís', nome: 'Física', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas08_09/Fisica_CFG_2008.pdf' },
        { sigla: 'Quí', nome: 'Química', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas08_09/Quimica_CFG_2008.pdf' },
        { sigla: 'Port/Ing', nome: 'Português - Inglês', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas08_09/Port_Ing_CFG_2008.pdf' }
      ]
    }
  },
  // 2007/2008
  {
    concurso: '2007/2008',
    anoIngresso: 2008,
    fase1: {
      provaUrl: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas07_08/provaobj_2007-2008.pdf',
      gabaritoUrl: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas07_08/gabaritodefinitivo_2007-2008.pdf'
    },
    fase2: {
      discursivas: [
        { sigla: 'Mat', nome: 'Matemática', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas07_08/cfg_matematica_2007-2008.pdf' },
        { sigla: 'Fís', nome: 'Física', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas07_08/cfg_fisica_2007-2008.pdf' },
        { sigla: 'Quí', nome: 'Química', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas07_08/cfg_quimica_2007-2008.pdf' },
        { sigla: 'Port', nome: 'Português', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas07_08/cfg_portugues_2007-2008.pdf' },
        { sigla: 'Ing', nome: 'Inglês', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas07_08/cfg_ingles_2007-2008.pdf' }
      ]
    }
  },
  // 2006/2007
  {
    concurso: '2006/2007',
    anoIngresso: 2007,
    fase1: {
      gabaritoUrl: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas06_07/Gabarito.pdf',
      isObjetivasMistas: true,
      materiasObjetivas: [
        { sigla: 'Mat', nome: 'Matemática Múltipla Escolha', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas06_07/mme.pdf' },
        { sigla: 'Fís', nome: 'Física Múltipla Escolha', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas06_07/fme.pdf' },
        { sigla: 'Quí', nome: 'Química Múltipla Escolha', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas06_07/qme.pdf' }
      ]
    },
    fase2: {
      discursivas: [
        { sigla: 'Mat', nome: 'Matemática Discursiva', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas06_07/CFG-MAT-2006-2007.pdf' },
        { sigla: 'Fís', nome: 'Física Discursiva', url: 'https://www.ime.eb.mil.br/images/arquivos/admissao/cfg/provas-anteriores/provas06_07/CFG-FIS-2006-2007.pdf' },
        { sigla: 'Quí', nome: 'Química Discursiva', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas06_07/CFG-QUIM-2006-2007.pdf' },
        { sigla: 'Port', nome: 'Português', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas06_07/CFG-PORT-2006-2007.pdf' },
        { sigla: 'Ing', nome: 'Inglês', url: 'https://www.ime.eb.mil.br/arquivos/Admissao/Vestibular_CFG/Provas_Anteriores/provas06_07/CFG-ING-2006-2007.pdf' }
      ]
    }
  }
];

export const getImeYearItem = (target: string | number): ImeConcursoItem | undefined => {
  const t = String(target).trim();
  return IME_ACERVO_TABLE.find(item => 
    item.concurso === t || 
    item.concurso.startsWith(t) || 
    item.concurso.endsWith(t) || 
    item.anoIngresso.toString() === t
  );
};
