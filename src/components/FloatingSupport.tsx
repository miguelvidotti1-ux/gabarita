import * as React from 'react';

// ========== CONFIGURAÇÃO ==========
// Formato: código do país + DDD + número (somente dígitos)
// Exemplo Brasil: 55 + 11 + 9876543210
const WHATSAPP_NUMERO = '55119876543210';

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

export default function FloatingSupport() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [topicoSelecionado, setTopicoSelecionado] = React.useState('Dúvida geral');
  const [mensagem, setMensagem] = React.useState('');

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

  const enviarWhatsApp = () => {
    const msgTrimmed = mensagem.trim();

    // Montar mensagem pré-preenchida
    let texto = 'Olá! Preciso de suporte no Gabarita.\n\n';
    texto += '*Assunto:* ' + topicoSelecionado;

    if (msgTrimmed) {
      texto += '\n\n*Mensagem:*\n' + msgTrimmed;
    }

    // Codificar para URL
    const textoCodificado = encodeURIComponent(texto);

    // Abrir WhatsApp — funciona em desktop (web.whatsapp.com) e mobile (app)
    const url = 'https://wa.me/' + WHATSAPP_NUMERO + '?text=' + textoCodificado;
    window.open(url, '_blank');

    // Fechar modal após abrir
    fecharSuporte();
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
          className="support-modal" 
          onClick={(e) => e.stopPropagation()} 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="support-title"
        >
          <div className="support-header">
            <div className="support-header-info">
              <div className="support-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <h3 id="support-title">Falar com o suporte</h3>
                <p>Atendimento via WhatsApp • Seg a Sex, 8h às 18h</p>
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
              Abrir WhatsApp
            </button>

            <p className="support-note">
              Ao clicar, você será direcionado ao WhatsApp com sua mensagem já preenchida.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
