import * as React from 'react';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { Send, Loader2, Sparkles, User, Bot } from 'lucide-react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface Message {
  role: 'user' | 'ai';
  text: string;
}

export default function ChatWithAI() {
  const [messages, setMessages] = React.useState<Message[]>([
    { role: 'ai', text: 'Oi! Como posso te ajudar com seus estudos hoje? Pode mandar sua dúvida, vou te responder de forma bem prática e direta.' }
  ]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const chat = React.useMemo(() => ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      systemInstruction: "Você é um tutor de estudos amigável e direto. Responda às dúvidas do estudante de forma natural, conversacional e resumida. Evite o uso de listas, marcadores, asteriscos ou outros símbolos. Use apenas texto plano que flua como uma conversa real entre pessoas."
    }
  }), []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const response = await chat.sendMessage({ message: userMessage });
      const aiResponse = response.text || 'Desculpe, não consegui processar sua dúvida agora.';
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'ai', text: 'Ocorreu um erro ao processar sua dúvida. Tente novamente.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-blue-900 rounded-3xl border dark:border-blue-800 shadow-sm overflow-hidden">
      <div className="p-6 border-b dark:border-blue-800 bg-slate-50 dark:bg-blue-950/50 flex items-center gap-3">
        <Sparkles className="text-blue-600 dark:text-blue-400" size={24} />
        <h2 className="text-xl font-black text-slate-800 dark:text-white">Conversar com IA</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message, index) => (
          <div key={index} className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
            {message.role === 'ai' && (
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-300 shrink-0">
                <Bot size={20} />
              </div>
            )}
            <div className={`max-w-[80%] p-4 rounded-2xl ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-blue-950 text-slate-800 dark:text-blue-100'}`}>
              <p className="leading-relaxed">{message.text}</p>
            </div>
            {message.role === 'user' && (
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-blue-800 flex items-center justify-center text-slate-600 dark:text-blue-300 shrink-0">
                <User size={20} />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-300 shrink-0">
              <Bot size={20} />
            </div>
            <div className="bg-slate-100 dark:bg-blue-950 p-4 rounded-2xl">
              <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={20} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 border-t dark:border-blue-800 bg-slate-50 dark:bg-blue-950/50">
        <div className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Digite sua dúvida aqui..."
            className="flex-1 bg-white dark:bg-blue-900 border dark:border-blue-800 rounded-2xl px-6 py-4 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
