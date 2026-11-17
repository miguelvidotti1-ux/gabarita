import 'dotenv/config';
import { Type } from '@google/genai';
import { generateWithFallback } from '../geminiClient';
import {
  loadBancoQuestoes,
  loadExplicacoesCacheMap,
  saveExplicacaoCacheItem,
} from '../routes/treino';
import { ExplicacaoCache, Letra } from '../../shared/treino/types';

async function main() {
  const banco = loadBancoQuestoes();
  const cacheAtual = loadExplicacoesCacheMap();

  const pendentes = banco.filter(
    (q) => !q.anulada && !q.explicacaoCache?.resolucao && !cacheAtual[q.id]?.resolucao
  );

  console.log(`[Treino CLI] Total no banco: ${banco.length} | Pendentes de explicação: ${pendentes.length}`);

  let geradas = 0;
  let falhas = 0;

  for (const questao of pendentes) {
    const alternativasTexto = questao.alternativas
      .map((a) => `${a.letra}) ${a.texto}`)
      .join('\n');

    const prompt = `Você é professor especialista em vestibulares brasileiros.
Gere a explicação didática da questão abaixo respeitando RIGOROSAMENTE o gabarito oficial (${questao.correta}).

Banca/Ano: ${questao.banca} ${questao.ano}
Matéria: ${questao.materia} · ${questao.topico}
${questao.textoBase ? `Texto-base:\n${questao.textoBase}\n` : ''}
Enunciado:
${questao.enunciado}

Alternativas:
${alternativasTexto}

Gabarito oficial: ${questao.correta}

Responda exclusivamente em JSON válido:
{
  "resolucao": "resolução completa usando LaTeX $...$ quando necessário",
  "porQueErrada": { "A": "...", ... },
  "macete": "dica rápida"
}`;

    try {
      const response = await generateWithFallback({
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              resolucao: { type: Type.STRING },
              porQueErrada: { type: Type.OBJECT },
              macete: { type: Type.STRING },
            },
            required: ['resolucao', 'porQueErrada'],
          },
        },
      });

      const parsed = response.text ? (JSON.parse(response.text) as Partial<ExplicacaoCache>) : null;
      if (!parsed || typeof parsed.resolucao !== 'string') {
        throw new Error('JSON inválido retornado pelo modelo.');
      }

      const porQueErrada: Partial<Record<Letra, string>> = {};
      for (const alt of questao.alternativas) {
        if (alt.letra !== questao.correta && parsed.porQueErrada?.[alt.letra]) {
          porQueErrada[alt.letra] = String(parsed.porQueErrada[alt.letra]).trim();
        }
      }

      saveExplicacaoCacheItem(questao.id, {
        resolucao: parsed.resolucao.trim(),
        porQueErrada,
        macete: parsed.macete ? String(parsed.macete).trim() : undefined,
      });

      geradas += 1;
      console.log(`[Treino CLI] Explicação salva (${geradas}/${pendentes.length}): ${questao.id}`);
    } catch (err) {
      falhas += 1;
      console.warn(`[Treino CLI] Falha em ${questao.id}:`, err);
    }
  }

  console.log(`[Treino CLI] Concluído. Geradas: ${geradas}, Falhas: ${falhas}`);
}

main().catch((err) => {
  console.error('[Treino CLI] Erro fatal:', err);
  process.exit(1);
});
