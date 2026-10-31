import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Loader2, 
  Sparkles, 
  User, 
  Bot, 
  Trash2, 
  Copy, 
  Check, 
  Lightbulb, 
  RotateCcw,
  Plus,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import Markdown from 'react-markdown';
import { motion } from 'motion/react';
import AudioTranscriber from './AudioTranscriber';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp?: string;
}

interface ConversaItem {
  id: number;
  titulo: string;
  atualizada_em: string;
  total_mensagens: number;
}

const SUGGESTED_QUESTIONS = [
  {
    topic: 'Redação',
    icon: '📝',
    badgeClass: 'bg-rose-50 text-rose-600 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/40',
    text: 'Como estruturar uma proposta de intervenção completa no ENEM?'
  },
  {
    topic: 'Física',
    icon: '⚡',
    badgeClass: 'bg-indigo-50 text-indigo-600 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800/40',
    text: 'Explique a conservação da quantidade de movimento com um exemplo prático.'
  },
  {
    topic: 'Química',
    icon: '🧪',
    badgeClass: 'bg-cyan-50 text-cyan-600 border-cyan-200/80 dark:bg-cyan-950/40 dark:text-cyan-400 dark:border-cyan-800/40',
    text: 'Qual a diferença entre forças intermoleculares e ligações químicas?'
  },
  {
    topic: 'Literatura',
    icon: '📚',
    badgeClass: 'bg-pink-50 text-pink-600 border-pink-200/80 dark:bg-pink-950/40 dark:text-pink-400 dark:border-pink-800/40',
    text: 'Quais os temas centrais de "Angústia" de Graciliano Ramos?'
  },
  {
    topic: 'Matemática',
    icon: '📐',
    badgeClass: 'bg-blue-50 text-blue-600 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/40',
    text: 'Dicas para resolver questões de probabilidade condicional sem se perder.'
  }
];

const WELCOME_MESSAGE: Message = {
  id: 'welcome-msg',
  role: 'ai',
  text: 'Olá! Sou o seu **Tutor de IA do Gabarita**. 🎓\n\nEstou à sua disposição para responder a qualquer dúvida: matérias escolares, vestibulares, redação, exercícios, explicações passo a passo ou qualquer outro tema que você quiser explorar.\n\nComo posso te ajudar hoje?',
  timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
};

export default function ChatWithAI() {
  const [conversas, setConversas] = useState<ConversaItem[]>([]);
  const [activeConversaId, setActiveConversaId] = useState<number | null>(null);
  const [carregandoConversas, setCarregandoConversas] = useState(false);

  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Carrega as conversas salvas no início
  useEffect(() => {
    carregarConversas();
  }, []);

  const carregarConversas = async (preferredId?: number) => {
    try {
      setCarregandoConversas(true);
      const res = await fetch('/api/chat/conversas');
      if (!res.ok) return;
      const data = await res.json();
      const list: ConversaItem[] = data.conversas || [];
      setConversas(list);

      const savedLocal = localStorage.getItem('gabarita_conversa_id');
      const savedId = preferredId || (savedLocal ? Number(savedLocal) : null);

      if (list.length > 0) {
        const found = savedId ? list.find(c => c.id === savedId) : null;
        const targetId = found ? found.id : list[0].id;
        setActiveConversaId(targetId);
        localStorage.setItem('gabarita_conversa_id', String(targetId));
        await abrirConversa(targetId);
      } else {
        await novaConversa();
      }
    } catch (err) {
      console.error('Erro ao listar conversas:', err);
    } finally {
      setCarregandoConversas(false);
    }
  };

  const abrirConversa = async (cid: number) => {
    try {
      setActiveConversaId(cid);
      localStorage.setItem('gabarita_conversa_id', String(cid));

      const res = await fetch(`/api/chat/conversas/${cid}/mensagens`);
      if (!res.ok) return;

      const data = await res.json();
      if (data && Array.isArray(data.mensagens)) {
        if (data.mensagens.length === 0) {
          setMessages([WELCOME_MESSAGE]);
        } else {
          const loaded: Message[] = data.mensagens.map((m: any) => ({
            id: String(m.id || Math.random()),
            role: m.role === 'assistant' ? 'ai' : 'user',
            text: m.content,
            timestamp: m.data ? new Date(m.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : undefined
          }));
          setMessages(loaded);
        }
      }
    } catch (err) {
      console.error('Erro ao carregar mensagens da conversa:', err);
    }
  };

  const novaConversa = async () => {
    try {
      const res = await fetch('/api/chat/conversas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: 'Nova conversa' })
      });
      if (!res.ok) return;

      const data = await res.json();
      const nova: ConversaItem = {
        id: data.conversa_id,
        titulo: data.titulo || 'Nova conversa',
        atualizada_em: new Date().toISOString(),
        total_mensagens: 0
      };

      setConversas(prev => [nova, ...prev.filter(c => c.id !== nova.id)]);
      setActiveConversaId(nova.id);
      localStorage.setItem('gabarita_conversa_id', String(nova.id));
      setMessages([WELCOME_MESSAGE]);
    } catch (err) {
      console.error('Erro ao criar nova conversa:', err);
    }
  };

  const apagarConversaAtual = async () => {
    if (!activeConversaId) return;

    try {
      const cidToDelete = activeConversaId;
      await fetch(`/api/chat/conversas/${cidToDelete}`, { method: 'DELETE' });

      const restantes = conversas.filter(c => c.id !== cidToDelete);
      setConversas(restantes);

      if (restantes.length > 0) {
        const proxima = restantes[0].id;
        setActiveConversaId(proxima);
        localStorage.setItem('gabarita_conversa_id', String(proxima));
        await abrirConversa(proxima);
      } else {
        localStorage.removeItem('gabarita_conversa_id');
        await novaConversa();
      }
    } catch (err) {
      console.error('Erro ao excluir conversa:', err);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    if (activeConversaId) {
      apagarConversaAtual();
    } else {
      setMessages([WELCOME_MESSAGE]);
    }
  };

  const handleSend = async (messageToSend?: string) => {
    const text = (messageToSend || input).trim();
    if (!text || loading) return;

    const userMsgId = 'user-' + Date.now();
    const timeNow = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const updatedMessages: Message[] = [
      ...messages, 
      { id: userMsgId, role: 'user', text, timestamp: timeNow }
    ];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pergunta: text,
          conversa_id: activeConversaId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.erro || data?.error || `HTTP error! status: ${response.status}`);
      }

      const aiResponse = data.resposta || data.text || 'Desculpe, não consegui processar sua dúvida agora.';
      
      // Atualiza ID ativo e salva no localStorage
      if (data.conversa_id) {
        setActiveConversaId(data.conversa_id);
        localStorage.setItem('gabarita_conversa_id', String(data.conversa_id));
        
        // Se o backend atualizou o título (da primeira pergunta), reflete na lista
        if (data.titulo) {
          setConversas(prev => {
            const exists = prev.some(c => c.id === data.conversa_id);
            if (exists) {
              return prev.map(c => c.id === data.conversa_id 
                ? { ...c, titulo: data.titulo, total_mensagens: c.total_mensagens + 2 } 
                : c
              );
            } else {
              return [
                {
                  id: data.conversa_id,
                  titulo: data.titulo,
                  atualizada_em: new Date().toISOString(),
                  total_mensagens: 2
                },
                ...prev
              ];
            }
          });
        }
      }

      setMessages(prev => [
        ...prev, 
        { 
          id: 'ai-' + Date.now(), 
          role: 'ai', 
          text: aiResponse,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (error: any) {
      console.error('Chat error:', error);
      const isUnavailable = error?.message?.includes('503') || error?.message?.includes('high demand') || error?.message?.includes('UNAVAILABLE');
      const errorMsg = isUnavailable
        ? '⚠️ O serviço de IA está temporariamente com alta demanda. Por favor, aguarde alguns segundos e tente enviar novamente.'
        : '⚠️ Ocorreu uma instabilidade ao conectar com o tutor de IA. Clique no botão de enviar novamente.';

      setMessages(prev => [
        ...prev, 
        { 
          id: 'ai-err-' + Date.now(), 
          role: 'ai', 
          text: errorMsg,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  return (
    <div className="space-y-6 sm:space-y-8 select-none max-w-7xl mx-auto font-sans transition-colors duration-200">
      
      {/* HERO BANNER — PADRÃO UNIFICADO (IGUAL ÀS DEMAIS ABAS DO GABARITA) */}
      <div 
        style={{ backgroundColor: '#10141d' }}
        className="p-6 sm:p-8 md:p-10 rounded-3xl border border-[#10141d] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <div 
              style={{ backgroundColor: '#1e3a8a' }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 text-xs font-bold uppercase tracking-wider"
            >
              <Sparkles size={14} style={{ color: '#b4c5ea' }} />
              <span style={{ color: '#8ca8f9' }}>Tutor Inteligente de Estudos</span>
            </div>
            <div 
              style={{ backgroundColor: '#1e3a8a' }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-500/30 text-xs font-bold"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span style={{ color: '#02fe4a' }}>Online • Respostas Imediatas</span>
            </div>
          </div>

          <h1 
            style={{ color: '#6281cc' }}
            className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight"
          >
            Conversar com IA
          </h1>

          <p 
            style={{ color: '#91a6c5' }}
            className="text-sm sm:text-base leading-relaxed"
          >
            Tire dúvidas sobre todas as matérias, resolva questões passo a passo e receba orientações didáticas em tempo real para os vestibulares.
          </p>
        </div>

        {/* WIDGET LATERAL — SESSÕES ATIVAS */}
        <div 
          style={{ backgroundColor: '#10141d', borderColor: '#10141d' }}
          className="shrink-0 p-4 rounded-2xl border flex items-center gap-4 shadow-xs"
        >
          <div 
            style={{ backgroundColor: '#10141d' }}
            className="w-12 h-12 rounded-xl text-blue-400 flex items-center justify-center border border-blue-500/20"
          >
            <MessageSquare size={22} />
          </div>
          <div>
            <p 
              style={{ color: '#dce7f6' }}
              className="text-[10px] uppercase font-bold tracking-widest"
            >
              Conversas Salvas
            </p>
            <p className="text-lg font-black text-white flex items-center gap-1.5">
              {conversas.length} <span className="text-xs text-blue-400 font-bold">{conversas.length === 1 ? 'sessão' : 'sessões'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* CHAT MAIN CARD */}
      <div 
        style={{ backgroundColor: '#10141d', borderColor: '#10141d' }}
        className="flex flex-col h-[720px] max-h-[82vh] rounded-3xl border shadow-sm overflow-hidden transition-colors"
      >
        
        {/* HEADER DO CHAT */}
        <div 
          style={{ backgroundColor: '#10141d', borderColor: '#10141d' }}
          className="px-5 sm:px-7 py-4 border-b flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div 
              style={{ backgroundColor: '#10141d', borderColor: '#1e3a8a' }}
              className="w-11 h-11 rounded-2xl border flex items-center justify-center shadow-xs shrink-0"
            >
              <Sparkles size={20} style={{ color: '#7590d4' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 
                  style={{ color: '#7590d4' }}
                  className="text-base sm:text-lg font-black tracking-tight"
                >
                  Tutor IA • Assistente de Estudos
                </h2>
                <span 
                  style={{ backgroundColor: '#1e3a8a' }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-blue-500/30 text-[11px] font-bold"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span style={{ color: '#02fe4a' }}>Online</span>
                </span>
              </div>
              <p 
                style={{ color: '#7b9ac7' }}
                className="text-xs"
              >
                Respostas rápidas, didáticas e detalhadas para qualquer dúvida acadêmica
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClearHistory}
              title="Apagar conversa ativa"
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/10 transition-all cursor-pointer"
            >
              <RotateCcw size={16} style={{ color: '#ffffff' }} />
            </button>
          </div>
        </div>

        {/* TOOLBAR CONV-BAR — GERENCIADOR DE CONVERSAS */}
        <div 
          style={{ backgroundColor: '#10141d', borderColor: '#000000' }}
          className="conv-bar px-5 sm:px-7 py-3 border-b flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap"
        >
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <button
              type="button"
              onClick={novaConversa}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 transition-all active:scale-95 cursor-pointer shrink-0"
              title="Criar nova conversa"
            >
              <Plus size={14} className="stroke-[2.5]" />
              <span>Nova conversa</span>
            </button>

            <div className="flex-1 min-w-[140px] relative">
              <select
                id="conv-select"
                value={activeConversaId ?? ''}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val) abrirConversa(val);
                }}
                disabled={carregandoConversas}
                style={{ color: '#ffffff', backgroundColor: '#10141d' }}
                className="w-full border border-slate-700/60 hover:border-blue-400 text-xs rounded-xl px-3.5 py-2 outline-none font-semibold cursor-pointer transition-colors shadow-2xs truncate"
              >
                {conversas.length === 0 ? (
                  <option value="" style={{ backgroundColor: '#10141d', color: '#ffffff' }}>Nova conversa (vazia)</option>
                ) : (
                  conversas.map((conv) => (
                    <option key={conv.id} value={conv.id} style={{ backgroundColor: '#10141d', color: '#ffffff' }}>
                      {conv.titulo || 'Nova conversa'} {conv.total_mensagens > 0 ? `(${conv.total_mensagens} msgs)` : ''}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={apagarConversaAtual}
              disabled={!activeConversaId || conversas.length === 0}
              title="Apagar conversa atual"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-white/10 hover:border-rose-900/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* MESSAGES VIEWPORT */}
        <div 
          style={{ backgroundColor: '#10141d' }}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5"
        >
          
          {/* SUGESTÕES DE PERGUNTAS ESTILIZADAS COM AS CORES DAS MATÉRIAS */}
          {messages.length <= 1 && (
            <div 
              style={{ backgroundColor: '#10141d', borderColor: '#1e2534' }}
              className="mb-4 p-5 rounded-2xl border shadow-xs space-y-3.5"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Lightbulb size={16} className="text-amber-500" />
                <span>Sugestões de perguntas para começar:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SUGGESTED_QUESTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(item.text)}
                    className="p-3 text-left rounded-xl bg-[#141924] hover:bg-blue-950/40 border border-[#1e2534] hover:border-blue-500/40 transition-all text-xs text-zinc-200 flex items-start gap-2.5 group cursor-pointer"
                  >
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${item.badgeClass}`}>
                      {item.icon} {item.topic}
                    </span>
                    <span className="flex-1 line-clamp-2 leading-relaxed font-medium">{item.text}</span>
                    <ArrowRight size={14} className="text-slate-400 group-hover:text-blue-400 shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MESSAGE BUBBLES */}
          {messages.map((message) => {
            const isUser = message.role === 'user';
            
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {/* AI Avatar */}
                {!isUser && (
                  <div 
                    style={{ backgroundColor: '#10141d', borderColor: '#1e3a8a' }}
                    className="w-9 h-9 rounded-xl text-blue-400 border flex items-center justify-center shrink-0 shadow-2xs mt-0.5"
                  >
                    <Bot size={18} />
                  </div>
                )}

                {/* Message Content Container */}
                <div className={`max-w-[85%] sm:max-w-[78%] space-y-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
                  
                  <div
                    style={!isUser ? { backgroundColor: '#10141d', borderColor: '#10141d' } : undefined}
                    className={`
                      p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed transition-colors relative group
                      ${isUser 
                        ? 'bg-blue-600 text-white rounded-tr-xs shadow-sm shadow-blue-500/15 font-medium' 
                        : 'text-white rounded-tl-xs border shadow-xs'
                      }
                    `}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    ) : (
                      <div className="space-y-2">
                        <div 
                          style={{ color: '#ffffff' }}
                          className="prose prose-sm prose-invert max-w-none prose-p:leading-relaxed prose-p:text-white prose-headings:text-white prose-strong:text-white prose-pre:bg-black/60 prose-pre:text-slate-100 prose-code:text-blue-300 font-sans"
                        >
                          <Markdown>{message.text}</Markdown>
                        </div>

                        {/* AI Bubble Action Bar */}
                        <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-400">
                          <span>{message.timestamp}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(message.id, message.text)}
                            className="inline-flex items-center gap-1 text-white hover:text-blue-300 hover:bg-white/5 px-2 py-1 rounded-md transition-colors cursor-pointer"
                          >
                            {copiedId === message.id ? (
                              <>
                                <Check size={12} className="text-emerald-400" />
                                <span className="text-emerald-400 font-bold">Copiado</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} style={{ color: '#ffffff' }} />
                                <span style={{ color: '#ffffff' }}>Copiar</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {isUser && message.timestamp && (
                    <div className="text-[10px] text-zinc-400 text-right px-1 font-medium">
                      {message.timestamp}
                    </div>
                  )}

                </div>

                {/* User Avatar */}
                {isUser && (
                  <div className="w-9 h-9 rounded-xl bg-[#20232B] border border-white/10 text-zinc-300 flex items-center justify-center shrink-0 mt-0.5">
                    <User size={18} />
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* LOADING STATE */}
          {loading && (
            <motion.div 
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div 
                style={{ backgroundColor: '#10141d', borderColor: '#1e3a8a' }}
                className="w-9 h-9 rounded-xl text-blue-400 border flex items-center justify-center shrink-0 mt-0.5"
              >
                <Bot size={18} />
              </div>
              <div 
                style={{ backgroundColor: '#10141d', borderColor: '#1e2534' }}
                className="p-4 border rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-3"
              >
                <div className="flex gap-1.5 items-center">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs font-medium text-zinc-300">
                  Formulando resposta com IA...
                </span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT CONTAINER */}
        <div 
          style={{ backgroundColor: '#10141d', borderColor: '#10141d' }}
          className="p-4 sm:p-5 border-t"
        >
          <div 
            style={{ backgroundColor: '#10141d' }}
            className="relative flex items-end gap-2 border border-slate-700/60 rounded-2xl p-2 sm:p-2.5 focus-within:border-blue-500 focus-within:ring-3 focus-within:ring-blue-500/10 transition-all"
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder="Digite qualquer dúvida ou use o microfone para falar..."
              style={{ color: '#f9f9f9' }}
              className="flex-1 bg-transparent border-0 resize-none px-3 py-2 text-xs sm:text-sm outline-none max-h-32 placeholder:text-zinc-500 font-medium"
            />

            <AudioTranscriber
              compact={true}
              onTranscriptionComplete={(text) => {
                setInput((prev) => (prev ? `${prev.trim()} ${text}` : text));
                setTimeout(() => {
                  if (textareaRef.current) {
                    textareaRef.current.style.height = 'auto';
                    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`;
                    textareaRef.current.focus();
                  }
                }, 50);
              }}
            />
            
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-[#1E222B] disabled:text-zinc-600 disabled:border disabled:border-white/10 text-white rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer shrink-0 disabled:shadow-none disabled:cursor-not-allowed"
              title="Enviar mensagem"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-2 px-1">
            <span>Pressione <strong className="font-semibold text-zinc-300">Enter</strong> para enviar, <strong className="font-semibold text-zinc-300">Shift + Enter</strong> para nova linha</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-950/40 text-blue-400 border border-blue-500/30 font-semibold text-[10px]">
              <Sparkles size={11} /> Gabarita IA
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
