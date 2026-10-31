import fs from "fs";
import path from "path";

export interface MensagemData {
  id: number;
  conversa_id: number;
  role: "user" | "assistant";
  content: string;
  criada_em: string;
}

export interface ConversaData {
  id: number;
  usuario_id: string;
  titulo: string;
  criada_em: string;
  atualizada_em: string;
  mensagens: MensagemData[];
}

interface DatabaseSchema {
  nextConversaId: number;
  nextMensagemId: number;
  conversas: ConversaData[];
}

const DATA_DIR = path.resolve(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "conversas.json");

class ChatStore {
  private db: DatabaseSchema = {
    nextConversaId: 1,
    nextMensagemId: 1,
    conversas: []
  };
  private initialized = false;

  private ensureInitialized() {
    if (this.initialized) return;

    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.conversas)) {
          this.db = parsed;
        }
      } else {
        this.saveToFile();
      }
    } catch (err) {
      console.error("[ChatStore] Erro ao carregar dados do arquivo, iniciando banco em memória:", err);
    }
    this.initialized = true;
  }

  private saveToFile() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.db, null, 2), "utf-8");
    } catch (err) {
      console.error("[ChatStore] Erro ao persistir dados no disco:", err);
    }
  }

  public listarConversas(usuarioId: string) {
    this.ensureInitialized();
    return this.db.conversas
      .filter((c) => c.usuario_id === usuarioId)
      .sort((a, b) => new Date(b.atualizada_em).getTime() - new Date(a.atualizada_em).getTime())
      .slice(0, 50)
      .map((c) => ({
        id: c.id,
        titulo: c.titulo,
        atualizada_em: c.atualizada_em,
        total_mensagens: c.mensagens.length
      }));
  }

  public criarConversa(usuarioId: string, titulo = "Nova conversa"): ConversaData {
    this.ensureInitialized();
    const now = new Date().toISOString();
    const novaConversa: ConversaData = {
      id: this.db.nextConversaId++,
      usuario_id: usuarioId,
      titulo,
      criada_em: now,
      atualizada_em: now,
      mensagens: []
    };
    this.db.conversas.unshift(novaConversa);
    this.saveToFile();
    return novaConversa;
  }

  public obterConversa(cid: number, usuarioId: string): ConversaData | null {
    this.ensureInitialized();
    const c = this.db.conversas.find((item) => item.id === cid && item.usuario_id === usuarioId);
    return c || null;
  }

  public obterMensagens(cid: number, usuarioId: string) {
    const c = this.obterConversa(cid, usuarioId);
    if (!c) return null;
    return {
      conversa_id: c.id,
      titulo: c.titulo,
      mensagens: c.mensagens.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        data: m.criada_em
      }))
    };
  }

  public adicionarMensagem(
    cid: number,
    usuarioId: string,
    role: "user" | "assistant",
    content: string
  ): MensagemData | null {
    const c = this.obterConversa(cid, usuarioId);
    if (!c) return null;

    const now = new Date().toISOString();
    const novaMsg: MensagemData = {
      id: this.db.nextMensagemId++,
      conversa_id: cid,
      role,
      content,
      criada_em: now
    };
    c.mensagens.push(novaMsg);
    c.atualizada_em = now;
    this.saveToFile();
    return novaMsg;
  }

  public atualizarTitulo(cid: number, usuarioId: string, titulo: string): boolean {
    const c = this.obterConversa(cid, usuarioId);
    if (!c) return false;
    c.titulo = titulo;
    c.atualizada_em = new Date().toISOString();
    this.saveToFile();
    return true;
  }

  public excluirConversa(cid: number, usuarioId: string): boolean {
    this.ensureInitialized();
    const index = this.db.conversas.findIndex(
      (item) => item.id === cid && item.usuario_id === usuarioId
    );
    if (index === -1) return false;
    this.db.conversas.splice(index, 1);
    this.saveToFile();
    return true;
  }
}

export const chatStore = new ChatStore();
