import { auth, db } from '../firebase';
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, query, where, deleteDoc } from 'firebase/firestore';

export interface VestibularEvent {
  id: string;
  name: string;
  institution: string;
  date: string; // ISO String (yyyy-mm-dd or full ISO)
  notes?: string;
  alertDaysBefore?: number;
  localDeProva?: string;
  enderecoDeProva?: string;
  dicasTransporte?: string;
  oficial?: boolean;
}

export type VestibularList = VestibularEvent[];

// Initial list of major real Brazilian vestibular milestones for late 2026 / exams
const DEFAULT_EVENTS: VestibularEvent[] = [
  {
    id: 'e_1',
    name: 'ENEM - 1º Dia',
    institution: 'INEP (ENEM)',
    date: '2026-11-08T13:00:00.000Z',
    notes: 'Linguagens, Códigos, Ciências Humanas e Redação. Abertura dos portões às 12h, fechamento às 13h.',
    alertDaysBefore: 15,
    localDeProva: 'USP - Cidade Universitária (Butantã)',
    enderecoDeProva: 'Av. Prof. Almeida Prado, 1280 - Butantã, São Paulo - SP, 05508-070',
    dicasTransporte: 'Próximo à Estação Butantã (Linha 4-Amarela). No dia, use os circulares especiais de ônibus da USP. Muito procurado, chegue cedo!'
  },
  {
    id: 'e_2',
    name: 'ENEM - 2º Dia',
    institution: 'INEP (ENEM)',
    date: '2026-11-15T13:00:00.000Z',
    notes: 'Ciências da Natureza e Matemática. Abertura dos portões às 12h, fechamento às 13h.',
    alertDaysBefore: 15,
    localDeProva: 'USP - Cidade Universitária (Butantã)',
    enderecoDeProva: 'Av. Prof. Almeida Prado, 1280 - Butantã, São Paulo - SP, 05508-070',
    dicasTransporte: 'Próximo à Estação Butantã (Linha 4-Amarela). Use linhas Circulares de Integração do Metrô.'
  },
  {
    id: 'e_3',
    name: 'Fuvest - 1ª Fase',
    institution: 'USP',
    date: '2026-11-22T13:00:00.000Z',
    notes: 'Prova de Conhecimentos Gerais. 90 questões de múltipla escolha.',
    alertDaysBefore: 10,
    localDeProva: 'Escola Politécnica (Poli-USP)',
    enderecoDeProva: 'Av. Prof. Luciano Gualberto, 380 - Butantã, São Paulo - SP, 05508-010',
    dicasTransporte: 'Campus Butantã da USP. Estação de Metrô Butantã + Linha de ônibus Circular USP 8012-10 ou 8022-10. Evite ir de carro.'
  },
  {
    id: 'e_3_f2_d1',
    name: 'Fuvest - 2ª Fase (Dia 1)',
    institution: 'USP',
    date: '2026-12-13T13:00:00.000Z',
    notes: 'Redação e Português. Prova discursiva obrigatória para convocados.',
    alertDaysBefore: 10,
    localDeProva: 'FFLCH - Prédio de Letras (USP)',
    enderecoDeProva: 'Av. Prof. Lineu Prestes, 338 - Butantã, São Paulo - SP, 05508-000',
    dicasTransporte: 'Prédios grandes da FFLCH. Verifique com antecedência o bloco e sala exatos no cartão do candidato.'
  },
  {
    id: 'e_3_f2_d2',
    name: 'Fuvest - 2ª Fase (Dia 2)',
    institution: 'USP',
    date: '2026-12-14T13:00:00.000Z',
    notes: 'Disciplinas específicas conforme a carreira escolhida.',
    alertDaysBefore: 10,
    localDeProva: 'Faculdade de Economia, Administração e Contabilidade (FEA-USP)',
    enderecoDeProva: 'Av. Prof. Luciano Gualberto, 908 - Butantã, São Paulo - SP, 05508-010',
    dicasTransporte: 'Próximo à Biblioteca Florestan Fernandes na USP Butantã. Estacionamento costuma lotar nas vagas públicas do entorno.'
  },
  {
    id: 'e_4',
    name: 'Unicamp - 1ª Fase',
    institution: 'Unicamp',
    date: '2026-10-25T13:00:00.000Z',
    notes: 'Prova de Conhecimentos Gerais. 72 questões de múltipla escolha.',
    alertDaysBefore: 14,
    localDeProva: 'UNICAMP - Ciclo Básico II (Campinas)',
    enderecoDeProva: 'Rua Sérgio Buarque de Holanda, 251 - Cidade Universitária, Campinas - SP, 13083-859',
    dicasTransporte: 'Principal polo de provas na Cidade Universitária Zeferino Vaz de Barão Geraldo. Há linhas diretas de ônibus saindo da rodoviária de Campinas.'
  },
  {
    id: 'e_4_f2_d1',
    name: 'Unicamp - 2ª Fase (Dia 1)',
    institution: 'Unicamp',
    date: '2026-11-29T13:00:00.000Z',
    notes: 'Redação, Língua Portuguesa e Literatura, e questões interdisciplinares.',
    alertDaysBefore: 10,
    localDeProva: 'Faculdade de Engenharia de Alimentos (FEA-UNICAMP)',
    enderecoDeProva: 'Rua Monteiro Lobato, 80 - Cidade Universitária, Campinas - SP, 13083-862',
    dicasTransporte: 'Dentro do campus de Barão Geraldo. Ótima acessibilidade de ônibus urbano e fácil desembarque para veículos de aplicativo.'
  },
  {
    id: 'e_4_f2_d2',
    name: 'Unicamp - 2ª Fase (Dia 2)',
    institution: 'Unicamp',
    date: '2026-11-30T13:00:00.000Z',
    notes: 'Questões específicas da área de opção do candidato.',
    alertDaysBefore: 10,
    localDeProva: 'Colégio Técnico de Campinas (COTUCA)',
    enderecoDeProva: 'Rua Jorge de Figueiredo Corrêa, 735 - Chácara Primavera, Campinas - SP, 13087-261',
    dicasTransporte: 'Fácil parada para carros de aplicativos. Chegue 1h antes para localizar com calma a sua respectiva sala.'
  },
  {
    id: 'e_5',
    name: 'Unesp - 1ª Fase',
    institution: 'Unesp',
    date: '2026-11-14T14:00:00.000Z',
    notes: 'Prova com 90 questões de múltipla escolha.',
    alertDaysBefore: 7,
    localDeProva: 'UNESP - Campus Barra Funda',
    enderecoDeProva: 'Rua Dr. Bento Teobaldo Ferraz, 271 - Barra Funda, São Paulo - SP, 01140-070',
    dicasTransporte: 'Fica logo atrás do Terminal Intermodal Palmeiras-Barra Funda. Extremamente fácil de chegar de Metrô (Linha Vermelha), CPTM ou Ônibus!'
  },
  {
    id: 'e_5_f2',
    name: 'Unesp - 2ª Fase',
    institution: 'Unesp',
    date: '2026-12-13T14:00:00.000Z',
    notes: 'Prova comum de conhecimentos gerais mais redação de caráter unificado.',
    alertDaysBefore: 10,
    localDeProva: 'UNIP - Campus Paraíso / Vergueiro',
    enderecoDeProva: 'Rua Vergueiro, 1211 - Paraíso, São Paulo - SP, 01504-001',
    dicasTransporte: 'Entrada ao lado das estações Paraíso ou Vergueiro do Metrô (Linhas 1-Azul/2-Verde). Muito prático e conveniente!'
  },
  {
    id: 'e_6',
    name: 'ITA - Prova de 1ª Fase',
    institution: 'ITA',
    date: '2026-10-18T13:00:00.000Z',
    notes: 'Matemática, Química, Física, Português e Inglês.',
    alertDaysBefore: 20,
    localDeProva: 'ITA - Campus DCTA (São José dos Campos)',
    enderecoDeProva: 'Praça Marechal Eduardo Gomes, 50 - Vila das Açácias, São José dos Campos - SP, 12228-900',
    dicasTransporte: 'Acesso pelo portão correspondente de pedestre do DCTA. Apresente documento oficial com foto e comprovante de inscrição na guarita.'
  },
  {
    id: 'e_6_f2_d1',
    name: 'ITA - 2ª Fase (Dia 1)',
    institution: 'ITA',
    date: '2026-11-05T13:00:00.000Z',
    notes: 'Matemática e Química (Discursivas).',
    alertDaysBefore: 15,
    localDeProva: 'CPOR / Colégio Militar de São Paulo (Santana)',
    enderecoDeProva: 'Rua Alfredo Pujol, 681 - Santana, São Paulo - SP, 02017-011',
    dicasTransporte: 'Próximo à Estação Santana (Linha 1-Azul). Apresentação formal recomendada, portões fechados estritamente às 12h45.'
  },
  {
    id: 'e_6_f2_d2',
    name: 'ITA - 2ª Fase (Dia 2)',
    institution: 'ITA',
    date: '2026-11-06T13:00:00.000Z',
    notes: 'Física e Português + Redação.',
    alertDaysBefore: 15,
    localDeProva: 'CPOR / Colégio Militar de São Paulo (Santana)',
    enderecoDeProva: 'Rua Alfredo Pujol, 681 - Santana, São Paulo - SP, 02017-011',
    dicasTransporte: 'Próximo à Estação Santana (Linha 1-Azul). Portões fechados estritamente às 12h45.'
  },
  {
    id: 'e_7',
    name: 'ENEM 2026 - 2º Dia',
    institution: 'INEP (ENEM)',
    date: '2026-11-15T13:30:00.000Z',
    notes: 'Ciências da Natureza e Matemática. Portões fecham às 13h.',
    alertDaysBefore: 3
  },
  {
    id: 'e_8',
    name: 'Vestibular UnB 2027',
    institution: 'UnB',
    date: '2026-11-21T13:00:00.000Z',
    notes: 'Vestibular Tradicional e Libras, fase única.',
    alertDaysBefore: 5
  },
  {
    id: 'e_9',
    name: 'Vestibular Unesp 2027 - 1ª Fase',
    institution: 'Unesp',
    date: '2026-11-22T13:00:00.000Z',
    notes: '90 questões objetivas, 5h de duração.',
    alertDaysBefore: 5
  },
  {
    id: 'e_10',
    name: 'Vestibular UFRGS 2027 - Dia 1',
    institution: 'UFRGS',
    date: '2026-11-28T14:30:00.000Z',
    notes: 'Provas em fase única.',
    alertDaysBefore: 5
  },
  {
    id: 'e_11',
    name: 'Vestibular UFRGS 2027 - Dia 2',
    institution: 'UFRGS',
    date: '2026-11-29T14:30:00.000Z',
    notes: 'Provas em fase única.',
    alertDaysBefore: 5
  },
  {
    id: 'e_12',
    name: 'Vestibular Estadual UERJ 2027',
    institution: 'UERJ',
    date: '2026-11-29T13:00:00.000Z',
    notes: 'Exame Discursivo: redação + duas provas específicas.',
    alertDaysBefore: 5
  },
  {
    id: 'e_13',
    name: 'Unicamp 2027 - 2ª Fase (Dia 1)',
    institution: 'Unicamp',
    date: '2026-11-29T09:00:00.000Z',
    notes: 'Provas pela manhã.',
    alertDaysBefore: 5
  },
  {
    id: 'e_14',
    name: 'PAS 3ª etapa UnB',
    institution: 'UnB',
    date: '2026-11-29T13:00:00.000Z',
    notes: 'Prova da etapa final do PAS.',
    alertDaysBefore: 5
  },
  {
    id: 'e_15',
    name: 'Unicamp 2027 - 2ª Fase (Dia 2)',
    institution: 'Unicamp',
    date: '2026-11-30T09:00:00.000Z',
    notes: 'Provas pela manhã.',
    alertDaysBefore: 5
  },
  {
    id: 'e_16',
    name: 'Vestibular UFSC/IFC 2027',
    institution: 'UFSC/IFC',
    date: '2026-12-05T09:00:00.000Z',
    notes: 'Vestibular Unificado.',
    alertDaysBefore: 5
  },
  {
    id: 'e_17',
    name: 'Fuvest 2027 - 2ª Fase (Dia 1)',
    institution: 'USP',
    date: '2026-12-06T13:00:00.000Z',
    notes: 'Português + Redação.',
    alertDaysBefore: 5
  },
  {
    id: 'e_18',
    name: 'PAS 1ª etapa UnB',
    institution: 'UnB',
    date: '2026-12-06T13:00:00.000Z',
    notes: 'Prova do PAS.',
    alertDaysBefore: 5
  },
  {
    id: 'e_19',
    name: 'Fuvest 2027 - 2ª Fase (Dia 2)',
    institution: 'USP',
    date: '2026-12-07T13:00:00.000Z',
    notes: 'Segunda prova.',
    alertDaysBefore: 5
  },
  {
    id: 'e_20',
    name: 'Fuvest 2027 - Competências Específicas',
    institution: 'USP',
    date: '2026-12-08T09:00:00.000Z',
    notes: 'Artes (Música, Artes Cênicas, Visuais).',
    alertDaysBefore: 5
  },
  {
    id: 'e_21',
    name: 'Unesp 2027 - 2ª Fase (Dia 1)',
    institution: 'Unesp',
    date: '2026-12-13T13:00:00.000Z',
    notes: '36 questões discursivas + redação.',
    alertDaysBefore: 5
  },
  {
    id: 'e_22',
    name: 'PAS 2ª etapa UnB',
    institution: 'UnB',
    date: '2026-12-13T13:00:00.000Z',
    notes: 'Prova do PAS.',
    alertDaysBefore: 5
  },
  {
    id: 'e_23',
    name: 'Unesp 2027 - 2ª Fase (Dia 2)',
    institution: 'Unesp',
    date: '2026-12-14T13:00:00.000Z',
    notes: '36 questões discursivas + redação.',
    alertDaysBefore: 5
  },
  {
    id: 'e_sisu_2027',
    name: 'Sisu 2027 — Inscrições (Previsão)',
    institution: 'MEC (Sisu)',
    date: '2027-01-19T12:00:00.000Z',
    notes: 'Previsão de abertura das inscrições do Sisu 2027 após divulgação das notas do Enem 2026 — data a confirmar pelo MEC.',
    alertDaysBefore: 15,
    oficial: false
  }
];

let localEvents: VestibularEvent[] = [];

// Initialize local cache with localStorage
try {
  const stored = localStorage.getItem('levelup_vestibular_events');
  if (stored) {
    localEvents = JSON.parse(stored);
    let updated = false;

    // First enrich already stored entries
    localEvents = localEvents.map(le => {
      const defaultEv = DEFAULT_EVENTS.find(de => de.id === le.id);
      if (defaultEv && (!le.enderecoDeProva || le.enderecoDeProva !== defaultEv.enderecoDeProva)) {
        updated = true;
        return {
          ...le,
          localDeProva: defaultEv.localDeProva,
          enderecoDeProva: defaultEv.enderecoDeProva,
          dicasTransporte: defaultEv.dicasTransporte
        };
      }
      return le;
    });

    // Second check if we have any newly added default days that are missing altogether
    DEFAULT_EVENTS.forEach(de => {
      const exists = localEvents.some(le => le.id === de.id);
      if (!exists) {
        localEvents.push(de);
        updated = true;
      }
    });

    if (updated) {
      localStorage.setItem('levelup_vestibular_events', JSON.stringify(localEvents));
    }
  } else {
    localEvents = [...DEFAULT_EVENTS];
    localStorage.setItem('levelup_vestibular_events', JSON.stringify(localEvents));
  }
} catch (e) {
  console.error("Error setting up local vestibular events storage:", e);
  localEvents = [...DEFAULT_EVENTS];
}

export const vestibularEventService = {
  /**
   * Retrieves all vestibular events
   */
  async getEvents(): Promise<VestibularList> {
    try {
      if (auth.currentUser) {
        const colRef = collection(db, 'vestibular_events');
        const snap = await getDocs(colRef);
        let events: VestibularEvent[] = [];
        if (!snap.empty) {
          events = snap.docs.map(d => ({ id: d.id, ...d.data() } as VestibularEvent));
        }

        let updated = false;

        // Auto-enrich any existing Firestore events
        events = events.map(e => {
          const defaultEv = DEFAULT_EVENTS.find(de => de.id === e.id);
          if (defaultEv && (!e.enderecoDeProva || e.enderecoDeProva !== defaultEv.enderecoDeProva)) {
            updated = true;
            return {
              ...e,
              localDeProva: defaultEv.localDeProva,
              enderecoDeProva: defaultEv.enderecoDeProva,
              dicasTransporte: defaultEv.dicasTransporte
            };
          }
          return e;
        });

        // Add any missing DEFAULT_EVENTS altogether to Firestore
        for (const de of DEFAULT_EVENTS) {
          const exists = events.some(e => e.id === de.id);
          if (!exists) {
            events.push(de);
            updated = true;
            // Write it to Firestore asynchronously
            try {
              await setDoc(doc(db, 'vestibular_events', de.id), de);
            } catch (err) {
              console.error("Error writing default event to Firestore:", err);
            }
          }
        }

        if (updated || snap.empty) {
          localStorage.setItem('levelup_vestibular_events', JSON.stringify(events));
        }
        if (events.length > 0) {
          return events;
        }
      }
    } catch (e) {
      console.error("Firestore get events error, returning local copy:", e);
    }
    return localEvents;
  },

  /**
   * Adds an event to database and local cache
   */
  async addVestibular(event: Omit<VestibularEvent, 'id'>): Promise<VestibularEvent> {
    const newEvent: VestibularEvent = {
      ...event,
      id: `event_${Date.now()}`
    };

    // Save in local cache
    localEvents.push(newEvent);
    localStorage.setItem('levelup_vestibular_events', JSON.stringify(localEvents));

    // Save in Firestore
    try {
      if (auth.currentUser) {
        await setDoc(doc(db, 'vestibular_events', newEvent.id), newEvent);
      }
    } catch (e) {
      console.error("Firestore save event error:", e);
    }

    return newEvent;
  },

  /**
   * Deletes an event
   */
  async deleteEvent(id: string): Promise<boolean> {
    localEvents = localEvents.filter(e => e.id !== id);
    localStorage.setItem('levelup_vestibular_events', JSON.stringify(localEvents));

    try {
      if (auth.currentUser) {
        await deleteDoc(doc(db, 'vestibular_events', id));
      }
    } catch (e) {
      console.error("Firestore delete event error:", e);
    }

    return true;
  },

  /**
   * Updates an existing event
   */
  async updateEvent(id: string, updatedFields: Partial<VestibularEvent>): Promise<boolean> {
    localEvents = localEvents.map(e => e.id === id ? { ...e, ...updatedFields } : e);
    localStorage.setItem('levelup_vestibular_events', JSON.stringify(localEvents));

    try {
      if (auth.currentUser) {
        await updateDoc(doc(db, 'vestibular_events', id), updatedFields);
      }
    } catch (e) {
      console.error("Firestore update event error:", e);
    }

    return true;
  },

  /**
   * Returns events filtered by month and year
   */
  listByMonth(events: VestibularList, year: number, month: number): VestibularList {
    return events.filter(e => {
      const d = new Date(e.date);
      return d.getUTCFullYear() === year && d.getUTCMonth() === month;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  /**
   * Returns upcoming events starting from now
   */
  getNextEvents(events: VestibularList, count: number = 5): VestibularList {
    const now = new Date().getTime();
    return events.filter(e => new Date(e.date).getTime() >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, count);
  },

  /**
   * Calculates remaining days to a given ISO string or date
   */
  daysRemaining(dateStr: string): number {
    const now = new Date();
    // Zero out hours/minutes/seconds of "now" to compare whole days
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const eventDate = new Date(dateStr);
    const target = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    
    const diff = target.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  },

  /**
   * Generates custom days left warnings / alert banners
   */
  getAlerts(events: VestibularList): { event: VestibularEvent; daysLeft: number; message: string }[] {
    return events.map(e => {
      const daysLeft = this.daysRemaining(e.date);
      const alertDays = e.alertDaysBefore ?? 7;
      const isAlert = daysLeft <= alertDays && daysLeft >= 0;
      return {
        event: e,
        daysLeft,
        message: isAlert ? `Faltam ${daysLeft} dias para ${e.name} (${e.institution})` : ''
      };
    }).filter(a => a.message !== '');
  }
};
