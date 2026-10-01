import * as React from 'react';

// ========== CONFIGURAÇÃO ==========
// Formato: código do país + DDD + número (somente dígitos)
const WHATSAPP_NUMERO = '55119876543210';
const DEFAULT_VERIFY_TOKEN = 'vesthub_verify_2026';

interface TopicOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const TOPICS: TopicOption[] = [
  {
    id: 'Dúvida geral',
    label: 'Dúvida geral',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </svg>
    ),
  },
  {
    id: 'Problema com pagamento',
    label: 'Pagamento',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    id: 'Problema técnico no app',
    label: 'Problema técnico',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
    ),
  },
  {
    id: 'Sugestão de melhoria',
    label: 'Sugestão',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <path d="M9 18h6M10 22h4" />
        <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.4 1 2.3h6c0-.9.4-1.8 1-2.3A7 7 0 0 0 12 2z" />
      </svg>
    ),
  },
];

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  isEscalated?: boolean;
}

export default function FloatingSupport() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'whatsapp' | 'simulator' | 'config'>('whatsapp');
  const [topicoSelecionado, setTopicoSelecionado] = React.useState('Dúvida geral');
  const [mensagem, setMensagem] = React.useState('');

  // Simulador State
  const [simMessages, setSimMessages] = React.useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Olá! Sou o assistente de suporte do VestHub no WhatsApp. Como posso te ajudar hoje com funcionalidades, simulados, planos ou vestibulares?',
      time: 'Agora',
    },
  ]);
  const [simInput, setSimInput] = React.useState('');
  const [isSimLoading, setIsSimLoading] = React.useState(false);
  const chatEndRef = React.useRef<HTMLDivElement>(null);
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const webhookUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/whatsapp/webhook` : '/api/whatsapp/webhook';

  const abrirSuporte = () => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const fecharSuporte = (e?: React.MouseEvent) => {
    if (e && e.target !== e.currentTarget) return;
    setIsOpen(false);
    document.body.style.overflow = '';
  };

  // Fechar com tecla ESC
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        document.body.style.overflow = '';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Scroll no chat simulador
  React.useEffect(() => {
    if (activeTab === 'simulator') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [simMessages, activeTab]);

  const enviarWhatsApp = () => {
    const msgTrimmed = mensagem.trim();

    // Montar mensagem pré-preenchida
    let texto = 'Olá! Preciso de suporte no VestHub.\n\n';
    texto += '*Assunto:* ' + topicoSelecionado;

    if (msgTrimmed) {
      texto += '\n\n*Mensagem:*\n' + msgTrimmed;
    }

    const textoCodificado = encodeURIComponent(texto);
    const url = 'https://wa.me/' + WHATSAPP_NUMERO + '?text=' + textoCodificado;
    window.open(url, '_blank');
    fecharSuporte();
  };

  const handleSendSimMessage = async (textToSend?: string) => {
    const text = (textToSend || simInput).trim();
    if (!text || isSimLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setSimMessages((prev) => [...prev, userMsg]);
    setSimInput('');
    setIsSimLoading(true);

    try {
      const res = await fetch('/api/whatsapp/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, name: 'Estudante VestHub' }),
      });

      if (!res.ok) throw new Error('Falha na resposta do assistente');

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'Recebi sua mensagem!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEscalated: data.isHumanEscalated,
      };

      setSimMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setSimMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: 'Tive um probleminha para processar agora. Pode repetir? 😊',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsSimLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  return (
    <>
      {/* ========== BOTÃO FLUTUANTE DE SUPORTE ========== */}
      <button 
        id="btn-suporte-flutuante"
        className="support-fab" 
        onClick={abrirSuporte} 
        aria-label="Falar com o suporte"
        type="button"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
        </svg>
      </button>

      {/* ========== MODAL DE SUPORTE ========== */}
      <div 
        className={`support-overlay ${isOpen ? 'show' : ''}`}
        id="support-overlay" 
        onClick={fecharSuporte}
        style={{ display: isOpen ? 'flex' : 'none' }}
      >
        <div 
          className="support-modal max-w-lg w-full" 
          onClick={(e) => e.stopPropagation()} 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="support-title"
        >
          {/* Header */}
          <div className="support-header">
            <div className="support-header-info">
              <div className="support-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <h3 id="support-title">Suporte VestHub</h3>
                <p>Agente IA 24/7 & WhatsApp Business</p>
              </div>
            </div>
            <button 
              className="support-close" 
              onClick={() => fecharSuporte()} 
              aria-label="Fechar"
              type="button"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Abas Superiores */}
          <div className="flex border-b border-[var(--border-light)] bg-[var(--bg-card)] px-4 pt-2 gap-2 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`pb-2.5 px-2 transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
                activeTab === 'whatsapp'
                  ? 'border-[#25D366] text-[#25D366] font-bold'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <span>Abrir WhatsApp</span>
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`pb-2.5 px-2 transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
                activeTab === 'simulator'
                  ? 'border-[#25D366] text-[#25D366] font-bold'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]"></span>
              </span>
              <span>Testar Agente IA</span>
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`pb-2.5 px-2 transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
                activeTab === 'config'
                  ? 'border-[#25D366] text-[#25D366] font-bold'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <span>Webhook Meta</span>
            </button>
          </div>

          {/* Conteúdo Aba 1: Abrir WhatsApp */}
          {activeTab === 'whatsapp' && (
            <div className="support-body">
              <label className="support-label">Sobre o que você precisa falar?</label>
              <div className="support-topics" id="support-topics">
                {TOPICS.map((topic) => (
                  <div
                    key={topic.id}
                    className={`support-topic ${topicoSelecionado === topic.id ? 'selected' : ''}`}
                    onClick={() => setTopicoSelecionado(topic.id)}
                    data-topico={topic.id}
                  >
                    {topic.icon}
                    {topic.label}
                  </div>
                ))}
              </div>

              <label className="support-label" htmlFor="support-msg">Mensagem (opcional)</label>
              <textarea 
                className="support-textarea" 
                id="support-msg" 
                rows={3}
                placeholder="Descreva sua dúvida ou problema..."
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
              />

              <button 
                className="support-btn-whatsapp" 
                onClick={enviarWhatsApp}
                type="button"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                Iniciar Conversa no WhatsApp
              </button>

              <p className="support-note">
                Ao clicar, você será direcionado ao WhatsApp com sua mensagem já preenchida.
              </p>
            </div>
          )}

          {/* Conteúdo Aba 2: Simulador do Agente WhatsApp */}
          {activeTab === 'simulator' && (
            <div className="p-4 flex flex-col h-[400px]">
              {/* Sugestões rápidas */}
              <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2 text-[11px] shrink-0 custom-scrollbar">
                <button
                  type="button"
                  onClick={() => handleSendSimMessage('Como funciona o CorrigeBot?')}
                  className="px-2.5 py-1 rounded-full bg-[var(--bg-hover)] border border-[var(--border-light)] hover:border-[#25D366] text-[var(--text-muted)] hover:text-[var(--text-main)] whitespace-nowrap transition-colors"
                >
                  📝 CorrigeBot
                </button>
                <button
                  type="button"
                  onClick={() => handleSendSimMessage('Qual o preço do Premium?')}
                  className="px-2.5 py-1 rounded-full bg-[var(--bg-hover)] border border-[var(--border-light)] hover:border-[#25D366] text-[var(--text-muted)] hover:text-[var(--text-main)] whitespace-nowrap transition-colors"
                >
                  💰 Planos
                </button>
                <button
                  type="button"
                  onClick={() => handleSendSimMessage('/ajuda')}
                  className="px-2.5 py-1 rounded-full bg-[var(--bg-hover)] border border-[var(--border-light)] hover:border-[#25D366] text-[var(--text-muted)] hover:text-[var(--text-main)] whitespace-nowrap transition-colors"
                >
                  📋 /ajuda
                </button>
                <button
                  type="button"
                  onClick={() => handleSendSimMessage('Como faço para cancelar?')}
                  className="px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/50 text-rose-400 whitespace-nowrap transition-colors"
                >
                  🚨 Testar [HUMANO]
                </button>
              </div>

              {/* Balões de conversa WhatsApp */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] p-3 text-xs custom-scrollbar">
                {simMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm whitespace-pre-wrap ${
                        m.sender === 'user'
                          ? 'bg-[#005c4b] text-white rounded-tr-none'
                          : m.isEscalated
                          ? 'bg-amber-500/15 border border-amber-500/30 text-[var(--text-main)] rounded-tl-none'
                          : 'bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-light)] rounded-tl-none'
                      }`}
                    >
                      {m.isEscalated && (
                        <div className="text-[10px] font-bold text-amber-400 mb-1 flex items-center gap-1">
                          <span>🔔 Transferência para Equipe Humana</span>
                        </div>
                      )}
                      <p className="leading-relaxed">{m.text}</p>
                      <div className="text-[9px] text-[var(--text-muted)] text-right mt-1">
                        {m.time}
                      </div>
                    </div>
                  </div>
                ))}
                {isSimLoading && (
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] p-2">
                    <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping"></span>
                    <span>Agente VestHub digitando...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input de envio do simulador */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendSimMessage();
                }}
                className="flex gap-2 mt-2"
              >
                <input
                  type="text"
                  value={simInput}
                  onChange={(e) => setSimInput(e.target.value)}
                  placeholder="Envie uma mensagem para testar o agente..."
                  className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] text-xs text-[var(--text-main)] focus:outline-none focus:border-[#25D366]"
                />
                <button
                  type="submit"
                  disabled={!simInput.trim() || isSimLoading}
                  className="px-4 py-2 rounded-xl bg-[#25D366] text-black font-bold text-xs hover:bg-[#1ed760] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Enviar
                </button>
              </form>
            </div>
          )}

          {/* Conteúdo Aba 3: Configuração do Webhook Meta */}
          {activeTab === 'config' && (
            <div className="p-4 space-y-3.5 text-xs text-[var(--text-main)]">
              <div className="p-3 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] space-y-2">
                <span className="font-bold text-[var(--text-main)] block">
                  📡 URL de Retorno de Chamada (Webhook Meta):
                </span>
                <div className="flex items-center gap-2 bg-[var(--bg-card)] p-2 rounded-lg border border-[var(--border-light)] font-mono text-[11px] select-all">
                  <span className="flex-1 truncate text-[#25D366]">{webhookUrl}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(webhookUrl, 'url')}
                    className="px-2 py-1 rounded bg-[var(--bg-hover)] hover:bg-[#25D366] hover:text-black font-sans text-[10px] font-bold transition-all cursor-pointer shrink-0"
                  >
                    {copiedKey === 'url' ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] space-y-2">
                <span className="font-bold text-[var(--text-main)] block">
                  🔑 Token de Verificação (Verify Token):
                </span>
                <div className="flex items-center gap-2 bg-[var(--bg-card)] p-2 rounded-lg border border-[var(--border-light)] font-mono text-[11px] select-all">
                  <span className="flex-1 truncate text-[#25D366]">{DEFAULT_VERIFY_TOKEN}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(DEFAULT_VERIFY_TOKEN, 'token')}
                    className="px-2 py-1 rounded bg-[var(--bg-hover)] hover:bg-[#25D366] hover:text-black font-sans text-[10px] font-bold transition-all cursor-pointer shrink-0"
                  >
                    {copiedKey === 'token' ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] space-y-1.5 text-[11px] text-[var(--text-muted)] leading-relaxed">
                <p className="font-bold text-[var(--text-main)]">Como configurar no Meta for Developers:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Acesse o app do WhatsApp no <strong>Meta for Developers</strong>.</li>
                  <li>Vá em <strong>WhatsApp &gt; Configuração &gt; Webhook</strong>.</li>
                  <li>Cole a <strong>URL de Retorno</strong> e o <strong>Token de Verificação</strong> acima.</li>
                  <li>Clique em <strong>Verificar e Salvar</strong>.</li>
                  <li>Em <em>Campos de Webhook</em>, assine o evento <strong>messages</strong>.</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
