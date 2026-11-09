import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Target, 
  Mail, 
  User, 
  Phone,
  LogIn,
  GraduationCap
} from 'lucide-react';

export interface PesquisaPergunta {
  id: string;
  tipo: 'texto' | 'radio' | 'checkbox' | 'paragrafo';
  obrigatoria: boolean;
  pergunta: string;
  opcoes?: string[];
}

export const PESQUISA_PERGUNTAS: PesquisaPergunta[] = [
  { id: 'nome', tipo: 'texto', obrigatoria: true, pergunta: 'Seu nome completo' },
  { id: 'email', tipo: 'texto', obrigatoria: true, pergunta: 'Seu melhor e-mail' },
  { id: 'whatsapp', tipo: 'texto', obrigatoria: true, pergunta: 'Seu WhatsApp (com DDD)' },
  { 
    id: 'prova', 
    tipo: 'radio', 
    obrigatoria: true, 
    pergunta: 'Para qual prova você está se preparando?',
    opcoes: ['ENEM 2026', 'ENEM 2027', 'FUVEST', 'UNICAMP / UNESP', 'Medicina — foco total', 'Outra']
  },
  { 
    id: 'momento', 
    tipo: 'radio', 
    obrigatoria: true, 
    pergunta: 'Qual é o seu momento agora?',
    opcoes: ['3º ano do ensino médio', '2º ano do ensino médio', 'Cursinho', 'Já terminei a escola, estudando por conta']
  },
  { 
    id: 'dificuldades', 
    tipo: 'checkbox', 
    obrigatoria: true, 
    pergunta: 'Quais são suas maiores dificuldades hoje? (marque todas)',
    opcoes: ['Montar e seguir uma rotina de estudos', 'Redação', 'Conteúdo específico de alguma matéria', 'Foco e constância', 'Ansiedade / pressão da prova', 'Outra']
  },
  { 
    id: 'investiu', 
    tipo: 'radio', 
    obrigatoria: true, 
    pergunta: 'Você já investiu em algum curso ou plataforma de estudos?',
    opcoes: ['Sim', 'Ainda não, seria meu primeiro investimento']
  },
  { 
    id: 'investimento', 
    tipo: 'radio', 
    obrigatoria: true, 
    pergunta: 'Quanto você conseguiria investir na sua preparação?',
    opcoes: ['Até R$ 50', 'R$ 50 a R$ 100', 'R$ 100 a R$ 200', 'R$ 200 a R$ 300', 'Acima de R$ 300']
  },
  { 
    id: 'bonus', 
    tipo: 'checkbox', 
    obrigatoria: false, 
    pergunta: 'O que você mais gostaria de ter como diferencial / bônus?',
    opcoes: ['Correções extras de redação', 'Simulados inéditos', 'Mentoria / acompanhamento', 'Mapas mentais e resumos', 'Plano de estudos personalizado']
  },
  { id: 'mensagem', tipo: 'paragrafo', obrigatoria: false, pergunta: 'Quer deixar uma mensagem? (opcional)' }
];

interface PesquisaModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  onJaTenhoConta?: () => void;
  obrigatorio?: boolean;
}

export const PesquisaModal: React.FC<PesquisaModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  onJaTenhoConta,
  obrigatorio = true
}) => {
  const [respostas, setRespostas] = useState<Record<string, any>>({});
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState<boolean>(false);
  const [sucesso, setSucesso] = useState<boolean>(false);

  // Carregar e-mail salvo no localStorage ao abrir
  useEffect(() => {
    if (!isOpen) return;

    const emailSalvo = localStorage.getItem('gabarita_email');
    if (emailSalvo) {
      setRespostas(prev => ({
        ...prev,
        email: emailSalvo
      }));
    }

    // Preenche campo se existir no DOM
    setTimeout(() => {
      const campo = document.getElementById('pq-email') as HTMLInputElement | null;
      if (campo && emailSalvo && !campo.value) {
        campo.value = emailSalvo;
      }
    }, 100);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTextoChange = (id: string, val: string) => {
    setRespostas(prev => ({ ...prev, [id]: val }));
    if (erro) setErro(null);
  };

  const handleRadioChange = (id: string, val: string) => {
    setRespostas(prev => ({ ...prev, [id]: val }));
    if (erro) setErro(null);
  };

  const handleCheckboxToggle = (id: string, opcao: string) => {
    setRespostas(prev => {
      const atuais: string[] = Array.isArray(prev[id]) ? [...prev[id]] : [];
      const index = atuais.indexOf(opcao);
      if (index >= 0) {
        atuais.splice(index, 1);
      } else {
        atuais.push(opcao);
      }
      return { ...prev, [id]: atuais };
    });
    if (erro) setErro(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    // Valida campos obrigatórios
    for (const p of PESQUISA_PERGUNTAS) {
      const valor = respostas[p.id];
      if (p.obrigatoria) {
        if (!valor || (Array.isArray(valor) && valor.length === 0) || (typeof valor === 'string' && !valor.trim())) {
          setErro(`Por favor, responda o campo obrigatório: "${p.pergunta}"`);
          return;
        }
      }
    }

    // Valida formato do e-mail (pergunta 'email')
    const emailResp = (respostas.email || '').trim();
    if (emailResp && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailResp)) {
      setErro('Digite um e-mail válido (ex.: nome@dominio.com)');
      return;
    }

    // Salva no localStorage
    if (emailResp) {
      localStorage.setItem('gabarita_email', emailResp);
    }
    localStorage.setItem('gabarita_questionario_concluido', 'true');
    localStorage.setItem('gabarita_pesquisa_respondida', 'true');

    setEnviando(true);
    try {
      await fetch('/api/pesquisa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(respostas)
      });

      setSucesso(true);
      if (onSuccess) onSuccess();

      setTimeout(() => {
        if (onClose) onClose();
        setSucesso(false);
      }, 2000);
    } catch (_) {
      // Fallback offline seguro
      setSucesso(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        if (onClose) onClose();
        setSucesso(false);
      }, 2000);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[2500] flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (!obrigatorio && e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-2xl bg-[#10141D] border border-[#2A3348] rounded-2xl p-6 sm:p-8 shadow-2xl text-left my-8 max-h-[92vh] flex flex-col">
        
        {/* Top Action Bar: Botão 'Já tenho uma conta' se for assinante */}
        <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-[#1E2534]">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30">
              <Sparkles size={11} className="text-blue-400" />
              Diagnóstico Obrigatório de Entrada
            </span>
          </div>

          {onJaTenhoConta && (
            <button
              type="button"
              onClick={onJaTenhoConta}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600/15 hover:bg-blue-600/30 text-blue-300 hover:text-white border border-blue-500/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <LogIn size={13} className="text-blue-400" />
              <span>Já tenho uma conta</span>
            </button>
          )}
        </div>

        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0">
            <Target size={20} className="text-blue-200" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Trace seu perfil de estudos antes de começar
            </h2>
            <p className="text-xs text-slate-400">
              Calibramos o CorrigeBot, a régua TRI e o cronograma especificamente para sua meta.
            </p>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
          Preenchimento obrigatório para novos vestibulandos. Se você já assina ou possui login, clique em <strong className="text-blue-400">"Já tenho uma conta"</strong> acima.
        </p>

        {/* Alerta de Erro */}
        {erro && (
          <div className="p-3.5 mb-4 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{erro}</span>
          </div>
        )}

        {/* Sucesso */}
        {sucesso ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-white">Diagnóstico registrado com sucesso!</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Seu perfil de vestibulando foi calibrado na plataforma. Liberando seu acesso aos planos e vestibulares...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto pr-1 space-y-5 flex-1">
            {PESQUISA_PERGUNTAS.map((p, idx) => {
              const valorAtual = respostas[p.id];

              return (
                <div key={p.id} className="p-4 rounded-xl bg-[#151A24] border border-[#1E2534] space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <label className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="text-blue-400 font-mono text-[11px]">{idx + 1}.</span>
                      <span>{p.pergunta}</span>
                      {p.obrigatoria && <span className="text-rose-400">*</span>}
                    </label>
                  </div>

                  {/* Campo Texto */}
                  {p.tipo === 'texto' && (
                    <div className="relative">
                      {p.id === 'email' && <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none" />}
                      {p.id === 'nome' && <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none" />}
                      {p.id === 'whatsapp' && <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none" />}
                      
                      <input
                        type={p.id === 'email' ? 'email' : 'text'}
                        id={`pq-${p.id}`}
                        name={`pq-${p.id}`}
                        value={valorAtual || ''}
                        onChange={(e) => handleTextoChange(p.id, e.target.value)}
                        placeholder={
                          p.id === 'email' ? 'exemplo@dominio.com' :
                          p.id === 'whatsapp' ? '(11) 98765-4321' :
                          'Digite sua resposta...'
                        }
                        className={`w-full py-2.5 bg-[#090D15] border border-[#2A3348] rounded-xl text-xs text-white outline-none focus:border-blue-500 transition-all ${
                          ['email', 'nome', 'whatsapp'].includes(p.id) ? 'pl-10 pr-3' : 'px-3.5'
                        }`}
                      />
                    </div>
                  )}

                  {/* Campo Parágrafo */}
                  {p.tipo === 'paragrafo' && (
                    <textarea
                      id={`pq-${p.id}`}
                      value={valorAtual || ''}
                      onChange={(e) => handleTextoChange(p.id, e.target.value)}
                      placeholder="Deixe sua mensagem, dúvida ou observação..."
                      rows={3}
                      className="w-full px-3.5 py-2.5 bg-[#090D15] border border-[#2A3348] rounded-xl text-xs text-white outline-none focus:border-blue-500 transition-all resize-none"
                    />
                  )}

                  {/* Campo Radio */}
                  {p.tipo === 'radio' && p.opcoes && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {p.opcoes.map((opcao) => {
                        const selecionado = valorAtual === opcao;
                        return (
                          <label
                            key={opcao}
                            className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center gap-2.5 transition-all ${
                              selecionado
                                ? 'bg-blue-600/15 border-blue-500 text-white font-semibold'
                                : 'bg-[#090D15] border-[#2A3348] text-slate-400 hover:border-slate-500/40 hover:text-slate-200'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`pq-${p.id}`}
                              value={opcao}
                              checked={selecionado}
                              onChange={() => handleRadioChange(p.id, opcao)}
                              className="w-3.5 h-3.5 text-blue-600 accent-blue-600 cursor-pointer"
                            />
                            <span>{opcao}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* Campo Checkbox */}
                  {p.tipo === 'checkbox' && p.opcoes && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {p.opcoes.map((opcao) => {
                        const selecionado = Array.isArray(valorAtual) && valorAtual.includes(opcao);
                        return (
                          <label
                            key={opcao}
                            className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center gap-2.5 transition-all ${
                              selecionado
                                ? 'bg-blue-600/15 border-blue-500 text-white font-semibold'
                                : 'bg-[#090D15] border-[#2A3348] text-slate-400 hover:border-slate-500/40 hover:text-slate-200'
                            }`}
                          >
                            <input
                              type="checkbox"
                              name={`pq-${p.id}`}
                              value={opcao}
                              checked={selecionado}
                              onChange={() => handleCheckboxToggle(p.id, opcao)}
                              className="w-3.5 h-3.5 rounded text-blue-600 accent-blue-600 cursor-pointer"
                            />
                            <span>{opcao}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Rodapé com botão 'Já tenho uma conta' e 'Concluir Diagnóstico' */}
            <div className="pt-3 sticky bottom-0 bg-[#10141D] py-3 border-t border-[#1E2534] flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500 flex items-center gap-1.5 order-2 sm:order-1">
                🔒 Seus dados personalizam sua rotina no Gabarita
              </span>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end order-1 sm:order-2">
                {onJaTenhoConta && (
                  <button
                    type="button"
                    onClick={onJaTenhoConta}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#151A24] hover:bg-[#1E2534] text-slate-300 hover:text-white text-xs font-semibold border border-[#2A3348] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <LogIn size={13} />
                    <span>Já tenho uma conta</span>
                  </button>
                )}

                <button
                  type="submit"
                  disabled={enviando}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send size={13} />
                  <span>{enviando ? 'Enviando...' : 'Concluir Diagnóstico'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PesquisaModal;
