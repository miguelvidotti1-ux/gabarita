import { GoogleGenAI } from "@google/genai";

async function getQuestions() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "List questions 61 to 90 of ENEM 2025 Day 1 Blue version (Caderno Azul). For each question, provide the text, options (A to E), correct answer (0-4), and a brief explanation. Return in JSON format matching the Question interface: { id: string, text: string, options: string[], correctAnswer: number, explanation: string, subject: string }.",
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  console.log(response.text);
}

getQuestions();
