const CACHE_KEY = 'vestpro_offline';

export interface OfflineData {
  questions: Record<string, any[]>;
  flashcards: Record<string, any[]>;
  lastSync: string;
}

// Salva dados no cache local
export function saveToCache(examId: string, questions: any[]) {
  const cached = loadCache();
  cached.questions[examId] = questions;
  cached.lastSync = new Date().toISOString();
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
  } catch (e) {
    console.warn('Falha ao salvar cache no localStorage:', e);
  }
}

// Carrega dados do cache
export function loadCache(): OfflineData {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : { questions: {}, flashcards: {}, lastSync: '' };
  } catch (e) {
    return { questions: {}, flashcards: {}, lastSync: '' };
  }
}

// Busca questões: tenta online, cai para o cache se offline
export async function getQuestionsWithFallback(
  examId: string,
  fetchOnline: () => Promise<any[]>
) {
  const cached = loadCache();

  if (typeof navigator !== 'undefined' && navigator.onLine) {
    try {
      const data = await fetchOnline();
      if (data && data.length > 0) {
        saveToCache(examId, data);
      }
      return data;
    } catch (error) {
      console.warn('Erro ao buscar online, usando cache offline:', error);
      return cached.questions[examId] || [];
    }
  }

  return cached.questions[examId] || [];
}
