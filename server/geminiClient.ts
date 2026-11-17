import { GoogleGenAI } from '@google/genai';

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export const DEFAULT_CANDIDATE_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.5-transcribe',
  'gemini-3.8-flash',
  'gemini-flash-latest',
];

const modelCooldowns = new Map<string, number>();

type GenerateContentParams = Parameters<typeof ai.models.generateContent>[0];

export interface GenerateFallbackOptions {
  contents: GenerateContentParams['contents'];
  config?: GenerateContentParams['config'];
  candidateModels?: string[];
}

export async function generateWithFallback(options: GenerateFallbackOptions) {
  const models = options.candidateModels || DEFAULT_CANDIDATE_MODELS;
  let lastError: unknown = null;

  for (const modelName of models) {
    const cooldownUntil = modelCooldowns.get(modelName) || 0;
    if (Date.now() < cooldownUntil) {
      continue;
    }

    const cleanConfig = options.config ? { ...options.config } : {};
    if (
      modelName.startsWith('gemini-3.') ||
      modelName.startsWith('gemini-4') ||
      modelName.includes('flash')
    ) {
      delete cleanConfig.temperature;
      delete cleanConfig.topP;
      delete cleanConfig.topK;
      delete cleanConfig.candidateCount;
    }

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: options.contents,
          config: cleanConfig,
        });
        if (response && response.text) {
          return response;
        }
      } catch (err: unknown) {
        lastError = err;
        const errObj = err as { status?: number; message?: string };
        const msg = errObj?.message || '';
        const is429 =
          errObj?.status === 429 ||
          msg.includes('429') ||
          msg.includes('RESOURCE_EXHAUSTED') ||
          msg.includes('Quota exceeded') ||
          msg.includes('rate-limits');

        const isTransient =
          errObj?.status === 503 ||
          msg.includes('503') ||
          msg.includes('high demand') ||
          msg.includes('UNAVAILABLE');

        console.warn(
          `[Gemini API] Info com modelo ${modelName} (tentativa ${attempt + 1}):`,
          is429 ? 'Cota de requisições atingida (429), ativando modelo alternativo...' : msg
        );

        if (is429) {
          const isDaily =
            msg.includes('per day') ||
            msg.includes('PerDay') ||
            msg.includes('hours') ||
            msg.includes('RetryInfo');
          const cooldownTime = isDaily ? Date.now() + 4 * 60 * 60 * 1000 : Date.now() + 60 * 1000;
          modelCooldowns.set(modelName, cooldownTime);
          if (modelName === 'gemini-3.8-flash' || modelName === 'gemini-flash-latest') {
            modelCooldowns.set('gemini-3.8-flash', cooldownTime);
            modelCooldowns.set('gemini-flash-latest', cooldownTime);
          }
          break;
        }

        if (isTransient && attempt === 0) {
          await new Promise((r) => setTimeout(r, 600));
        } else {
          break;
        }
      }
    }
  }

  throw lastError || new Error('Não foi possível obter resposta dos modelos de IA.');
}
