import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;
  app.use(express.json());

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Routes
  app.post("/api/gemini/recommendation", async (req, res) => {
    const { performanceData, vestibular } = req.body;
    
    // Logic: Read performance, generate plan
    // Using a stub for now
    res.json({ plan: "Estude Matemática e Física." });
  });

  app.post("/api/gemini/study-tip", async (req, res) => {
    try {
      const { vestibular = "ENEM" } = req.body;
      const prompt = `Você é um mentor especialista em aprovação nos principais vestibulares do Brasil (ENEM, FUVEST, UNICAMP, UNESP, UERJ, ITA, FGV, etc.).
Gere uma "Dica de Estudo do Dia" altamente estratégica, prática e motivadora focada nas especificidades do vestibular: ${vestibular}.

Retorne exclusivamente um JSON com este formato:
{
  "title": "Título chamativo e objetivo da dica de estudo",
  "category": "Estratégia de Prova | Gestão de Tempo | Técnica de Estudo | Redação | Revisão e Memorização",
  "content": "Texto detalhado e explicativo de 2 a 3 parágrafos curtos com dicas valiosas especificamente adaptadas ao estilo e cobrança do vestibular ${vestibular}.",
  "actionableSteps": [
    "Passo prático 1 para aplicar hoje nos estudos",
    "Passo prático 2 para aplicar hoje nos estudos",
    "Passo prático 3 para aplicar hoje nos estudos"
  ],
  "recommendedSubjects": ["Matemática", "Redação"],
  "quote": "Frase motivadora curta focada na jornada até a aprovação"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              category: { type: Type.STRING },
              content: { type: Type.STRING },
              actionableSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              recommendedSubjects: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              quote: { type: Type.STRING },
            },
            required: ["title", "category", "content", "actionableSteps", "recommendedSubjects"],
          },
        },
      });

      const text = response.text;
      if (!text) {
        return res.status(500).json({ error: "Sem resposta do modelo Gemini" });
      }

      const tip = JSON.parse(text);
      res.json(tip);
    } catch (err: any) {
      console.error("Erro ao gerar dica de estudo no servidor:", err);
      res.status(500).json({ error: err?.message || "Erro ao processar dica de estudo" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
