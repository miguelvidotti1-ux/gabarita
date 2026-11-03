import fs from "fs";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { MATERIAS, UsuarioPerfilData } from "./onboardingStore";

export const SINONIMOS: Record<string, string[]> = {
  matematica: ["matemática", "matematica", "mat", "mtm", "álgebra", "algebra", "geometria", "cálculo", "calculo"],
  portugues: ["português", "portugues", "língua portuguesa", "lingua portuguesa", "lp", "gramática", "gramatica"],
  redacao: ["redação", "redacao", "produção de texto", "producao de texto", "escrita"],
  fisica: ["física", "fisica", "fis"],
  quimica: ["química", "quimica", "qui"],
  biologia: ["biologia", "bio", "ciências", "ciencias"],
  historia: ["história", "historia", "his"],
  geografia: ["geografia", "geo"],
  filosofia: ["filosofia", "filo"],
  sociologia: ["sociologia", "socio"],
  literatura: ["literatura", "lit"],
  ingles: ["inglês", "ingles", "língua estrangeira", "lingua estrangeira", "ing"],
  espanhol: ["espanhol", "español", "esp"]
};

export interface MateriaAnalise {
  materia: string;
  nome: string;
  nota: number;
  classe: "critica" | "atencao" | "solida" | "forte";
  confirmada: boolean;
  peso: number;
}

export interface AnaliseBoletim {
  media_geral: number;
  media_escola: number | null;
  por_materia: MateriaAnalise[];
  prioridades: string[];
  resumo: string;
}

export interface BoletimData {
  id: number;
  usuario_id: string;
  origem: "foto" | "manual";
  media_escola: number | null;
  media_geral: number;
  notas_json: string; // Record<string, number>
  analise_json: string; // AnaliseBoletim
  data: string;
}

const DATA_DIR = path.resolve(process.cwd(), "data");
const BOLETINS_FILE = path.join(DATA_DIR, "boletins.json");

export class ServicoBoletim {
  public static mapear(nome: string): string | null {
    const n = (nome || "").toLowerCase().trim();
    for (const [chave, sins] of Object.entries(SINONIMOS)) {
      if (sins.some((s) => n.includes(s))) {
        return chave;
      }
    }
    return null;
  }

  public static async extrairDaFoto(
    imgBuffer: Buffer,
    mime: string = "image/jpeg",
    aiClient: GoogleGenAI
  ): Promise<{
    escala?: string;
    notas?: Record<string, number>;
    media_boletim?: number;
    erro?: string;
    fallback?: string;
  }> {
    if (!process.env.GEMINI_API_KEY) {
      return {
        erro: 'Leitura por foto exige GEMINI_API_KEY — use "Digitar notas"',
        fallback: "manual"
      };
    }

    try {
      const b64 = imgBuffer.toString("base64");
      const cleanMime = mime.includes("png")
        ? "image/png"
        : mime.includes("webp")
        ? "image/webp"
        : "image/jpeg";

      const promptText = `Extraia as notas deste boletim escolar brasileiro.
CONVERTA tudo para escala 0-10 (se for 0-100, divida por 10).
Use o nome da matéria como escrito, com acentos. Ignore matérias sem nota numérica (letras, 'Aprovado', '—', faltas).
Se houver média geral visível, extraia como 'media_boletim'.
Responda APENAS com JSON no seguinte formato:
{"escala":"0-10","notas":{"Matemática":6.5,"Física":5.0},"media_boletim":7.2}`;

      const response = await aiClient.models.generateContent({
        model: "gemini-flash-latest",
        contents: {
          parts: [
            { text: promptText },
            {
              inlineData: {
                mimeType: cleanMime,
                data: b64
              }
            }
          ]
        },
        config: {
          temperature: 0.1,
          maxOutputTokens: 800,
          responseMimeType: "application/json"
        }
      });

      const text = response.text?.trim() || "{}";
      const parsed = JSON.parse(text);
      return parsed;
    } catch (err: any) {
      console.error("[ServicoBoletim] Erro ao extrair com IA:", err?.message || err);
      return {
        erro: "Não consegui ler a imagem. Tente outra foto mais nítida ou digite manualmente.",
        fallback: "manual"
      };
    }
  }
}

export class ServicoAnaliseNotas {
  public static readonly CLASSE_HORAS: Record<string, number> = {
    critica: 4.0,
    atencao: 2.5,
    solida: 1.5,
    forte: 0.75,
    sem_nota: 2.5
  };

  public static normalizar(v: any): number {
    let n = parseFloat(String(v).replace(",", "."));
    if (isNaN(n)) return 0;
    if (n > 10) n /= 10.0; // aceita escala 0–100 e converte
    return Math.round(Math.max(0, Math.min(10, n)) * 10) / 10;
  }

  public static classe(n: number): "critica" | "atencao" | "solida" | "forte" {
    return n < 5 ? "critica" : n < 7 ? "atencao" : n < 8.5 ? "solida" : "forte";
  }

  public static analisar(
    notas: Record<string, number>,
    mediaEscola: number | null,
    usuario?: UsuarioPerfilData | null
  ): AnaliseBoletim | null {
    const por: MateriaAnalise[] = [];

    for (const [k, v] of Object.entries(notas)) {
      if (MATERIAS[k]) {
        const notaNorm = this.normalizar(v);
        por.push({
          materia: k,
          nome: MATERIAS[k],
          nota: notaNorm,
          classe: this.classe(notaNorm),
          confirmada: false,
          peso: 0
        });
      }
    }

    if (por.length === 0) return null;

    // Cruza com o auto-relato do questionário: nota confirma (⭐) quem o usuário disse ser pior
    const reportadas = new Set(
      Array.isArray(usuario?.piores_materias)
        ? usuario.piores_materias
        : (usuario?.piores_materias ? String(usuario.piores_materias).split(",") : [])
    );

    for (const m of por) {
      m.confirmada = reportadas.has(m.materia);
      m.peso = Math.round((10 - m.nota + (m.confirmada ? 1.5 : 0)) * 10) / 10;
    }

    // Ordena decrescente por peso (maior prioridade primeiro)
    por.sort((a, b) => b.peso - a.peso);

    const sum = por.reduce((acc, m) => acc + m.nota, 0);
    const media = Math.round((sum / por.length) * 100) / 100;
    const criticas = por.filter((m) => m.classe === "critica").map((m) => m.nome);

    let resumo = `Sua média geral é ${media.toFixed(1)} (escala 0–10)`;
    if (mediaEscola !== null && !isNaN(mediaEscola)) {
      const dif = Math.round((media - mediaEscola) * 10) / 10;
      if (dif >= 1) {
        resumo += ` — ${dif} ponto(s) ACIMA da média da sua escola. Mantenha o ritmo e suba o nível.`;
      } else if (dif <= -1) {
        resumo += ` — ${Math.abs(dif)} ponto(s) ABAIXO da média da sua escola. Prioridade em recuperação.`;
      } else {
        resumo += " — na média da sua escola. Reforço equilibrado.";
      }
    }

    if (criticas.length > 0) {
      resumo += ` Matérias críticas: ${criticas.slice(0, 3).join(", ")}.`;
    }

    return {
      media_geral: media,
      media_escola: mediaEscola,
      por_materia: por,
      prioridades: por.slice(0, 3).map((m) => m.materia),
      resumo
    };
  }

  public static distribuir(
    analise: AnaliseBoletim,
    perfil: any,
    horasDisp: number
  ): {
    horas_disponiveis: number;
    materias: { materia: string; nome: string; horas_semanais: number; peso: number }[];
  } {
    const itens = analise.por_materia.map((m) => ({
      materia: m.materia,
      nome: m.nome,
      peso: this.CLASSE_HORAS[m.classe] || 1.5,
      horas_semanais: 0
    }));

    const materiasSet = new Set(itens.map((i) => i.materia));
    const pioresAuto = Array.isArray(perfil?.piores_materias)
      ? perfil.piores_materias
      : [];

    const semNota = pioresAuto.filter((k: string) => MATERIAS[k] && !materiasSet.has(k));

    for (const k of semNota.slice(0, 2)) {
      itens.push({
        materia: k,
        nome: MATERIAS[k],
        peso: this.CLASSE_HORAS["sem_nota"] || 2.5,
        horas_semanais: 0
      });
    }

    const tot = itens.reduce((acc, i) => acc + i.peso, 0) || 1;
    for (const i of itens) {
      i.horas_semanais = Math.max(0.5, Math.round(((i.peso / tot) * horasDisp * 2)) / 2);
    }

    itens.sort((a, b) => b.horas_semanais - a.horas_semanais);

    return {
      horas_disponiveis: horasDisp,
      materias: itens
    };
  }
}

class BoletimStore {
  private db: { nextId: number; boletins: BoletimData[] } = {
    nextId: 1,
    boletins: []
  };
  private initialized = false;

  private ensureInitialized() {
    if (this.initialized) return;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(BOLETINS_FILE)) {
        const raw = fs.readFileSync(BOLETINS_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.boletins)) {
          this.db = parsed;
        }
      } else {
        this.saveToFile();
      }
    } catch (err) {
      console.error("[BoletimStore] Erro ao carregar boletins.json:", err);
    }
    this.initialized = true;
  }

  private saveToFile() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(BOLETINS_FILE, JSON.stringify(this.db, null, 2), "utf-8");
    } catch (err) {
      console.error("[BoletimStore] Erro ao salvar boletins.json:", err);
    }
  }

  public salvarBoletim(
    usuarioId: string,
    origem: "foto" | "manual",
    mediaEscola: number | null,
    notas: Record<string, number>,
    analise: AnaliseBoletim
  ): BoletimData {
    this.ensureInitialized();
    const boletim: BoletimData = {
      id: this.db.nextId++,
      usuario_id: usuarioId,
      origem,
      media_escola: mediaEscola,
      media_geral: analise.media_geral,
      notas_json: JSON.stringify(notas),
      analise_json: JSON.stringify(analise),
      data: new Date().toISOString()
    };
    this.db.boletins.push(boletim);
    this.saveToFile();
    return boletim;
  }

  public obterUltimoBoletim(usuarioId: string): BoletimData | null {
    this.ensureInitialized();
    const filtrados = this.db.boletins
      .filter((b) => b.usuario_id === usuarioId)
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    return filtrados[0] || null;
  }
}

export const boletimStore = new BoletimStore();
