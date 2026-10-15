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
  Zap,
  HelpCircle,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import AudioTranscriber from './AudioTranscriber';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp?: string;
}

const SUGGESTED_QUESTIONS = [
  {
    topic: 'Redação',
    icon: '📝',
    text: 'Como estruturar uma proposta de intervenção completa no ENEM?'
  },
  {
    topic: 'Física',
    icon: '⚡',
    text: 'Explique a conservação da quantidade de movimento com um exemplo prático.'
  },
  {
    topic: 'Química',
    icon: '🧪',
    text: 'Qual a diferença entre forças intermoleculares e ligações químicas?'
  },
  {
    topic: 'Literatura',
    icon: '📚',
    text: 'Quais os temas centrais de "Angústia" de Graciliano Ramos?'
  },
  {
    topic: 'Matemática',
    icon: '📐',
    text: 'Dicas para resolver questões de probabilidade condicional sem se perder.'
  }
];

export default function ChatWithAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      role: 'ai',
      text: 'Olá! Sou o seu **Tutor de IA do Gabarita**. 🎓\n\nEstou aqui para tirar dúvidas sobre matérias do ENEM e dos principais vestibulares (FUVEST, UNICAMP, UNESP, etc.), explicar resoluções passo a passo ou dar dicas de redação.\n\nComo posso te ajudar hoje?',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
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

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset-' + Date.now(),
        role: 'ai',
        text: 'Histórico limpo! Pode me enviar uma nova pergunta quando quiser. 🚀',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
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
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map(m => ({ role: m.role, text: m.text })).slice(-10),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || `HTTP error! status: ${response.status}`);
      }

      const aiResponse = data.text || 'Desculpe, não consegui processar sua dúvida agora.';
      
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
    <div className="max-w-4xl mx-auto py-2 sm:py-4 px-2 sm:px-4 font-sans">
      
      {/* CHAT MAIN CARD */}
      <div className="flex flex-col h-[750px] max-h-[85vh] bg-white dark:bg-[#15171C] rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-xl overflow-hidden transition-colors">
        
        {/* HEADER */}
        <div className="px-5 sm:px-7 py-4 border-b border-slate-100 dark:border-white/10 bg-slate-50/70 dark:bg-[#181A20] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 dark:bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Conversar com IA
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Tutor inteligente de estudos • Respostas rápidas e didáticas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClearHistory}
              title="Limpar histórico de conversa"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* MESSAGES VIEWPORT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/40 dark:bg-[#0E1015]">
          
          {/* SUGGESTIONS PILLS WHEN CHAT IS FRESH */}
          {messages.length <= 2 && (
            <div className="mb-4 p-4 rounded-2xl bg-white dark:bg-[#181A20] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-300">
                <Lightbulb size={15} className="text-amber-500" />
                <span>Sugestões de perguntas para começar:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SUGGESTED_QUESTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(item.text)}
                    className="p-2.5 text-left rounded-xl bg-slate-50 dark:bg-[#20232B] hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/70 dark:border-white/5 hover:border-blue-300 dark:hover:border-blue-500/30 transition-all text-xs text-slate-700 dark:text-zinc-200 flex items-start gap-2 group cursor-pointer"
                  >
                    <span className="text-sm shrink-0">{item.icon}</span>
                    <span className="flex-1 line-clamp-2 leading-relaxed">{item.text}</span>
                    <ArrowRight size={13} className="text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                  <div className="w-8 h-8 rounded-xl bg-blue-600 dark:bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <Bot size={16} />
                  </div>
                )}

                {/* Message Content Container */}
                <div className={`max-w-[85%] sm:max-w-[78%] space-y-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
                  
                  <div
                    className={`
                      p-4 rounded-2xl text-xs sm:text-sm leading-relaxed transition-colors relative group
                      ${isUser 
                        ? 'bg-blue-600 text-white rounded-tr-xs shadow-md shadow-blue-500/10' 
                        : 'bg-white dark:bg-[#1A1D24] text-slate-800 dark:text-zinc-200 rounded-tl-xs border border-slate-200/80 dark:border-white/10 shadow-xs'
                      }
                    `}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    ) : (
                      <div className="space-y-2">
                        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-code:text-blue-600 dark:prose-code:text-blue-400">
                          <Markdown>{message.text}</Markdown>
                        </div>

                        {/* AI Bubble Action Bar */}
                        <div className="pt-2 mt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[10px] text-slate-400 dark:text-zinc-500">
                          <span>{message.timestamp}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(message.id, message.text)}
                            className="inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer px-1.5 py-0.5 rounded"
                          >
                            {copiedId === message.id ? (
                              <>
                                <Check size={11} className="text-emerald-500" />
                                <span className="text-emerald-500 font-bold">Copiado</span>
                              </>
                            ) : (
                              <>
                                <Copy size={11} />
                                <span>Copiar</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {isUser && message.timestamp && (
                    <div className="text-[10px] text-slate-400 dark:text-zinc-500 text-right px-1">
                      {message.timestamp}
                    </div>
                  )}

                </div>

                {/* User Avatar */}
                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-[#222630] text-slate-700 dark:text-zinc-300 flex items-center justify-center shrink-0 mt-0.5">
                    <User size={16} />
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
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Bot size={16} />
              </div>
              <div className="p-4 bg-white dark:bg-[#1A1D24] border border-slate-200/80 dark:border-white/10 rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-3">
                <div className="flex gap-1.5 items-center">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-slate-500 dark:text-zinc-400">
                  Formulando resposta...
                </span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT CONTAINER */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-white/10 bg-white dark:bg-[#15171C]">
          <div className="relative flex items-end gap-2 bg-slate-50 dark:bg-[#1A1D24] border border-slate-300/80 dark:border-white/15 rounded-2xl p-2 focus-within:border-blue-600 dark:focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15 transition-all">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua dúvida ou use o microfone para falar..."
              className="flex-1 bg-transparent border-0 resize-none px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-zinc-100 outline-none max-h-32 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
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
              className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer shrink-0"
              title="Enviar mensagem"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-500 mt-2 px-1">
            <span>Pressione <strong className="font-semibold text-slate-600 dark:text-zinc-400">Enter</strong> para enviar, <strong className="font-semibold text-slate-600 dark:text-zinc-400">Shift + Enter</strong> para nova linha</span>
            <span className="hidden sm:inline">IA Gabarita • Respostas didáticas</span>
          </div>
        </div>

      </div>

    </div>
  );
}
