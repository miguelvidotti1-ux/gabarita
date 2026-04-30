import { GoogleGenAI } from "@google/genai";

async function main() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Find the text and options for questions 61 to 90 of ENEM 2025 Day 1 Blue version (Caderno Azul). Return them as a JSON array of objects with fields: id, text, options, correctAnswer (0-4), explanation, subject.",
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  console.log(response.text);
}

main();
