import React from 'react';
import { Lock, CreditCard, CheckCircle2, Sparkles, Calculator, Compass, Layers } from 'lucide-react';
import { motion } from 'motion/react';

interface SisuPaywallProps {
  isAuthenticated: boolean;
  onAssinarPremium: () => void;
  onIrParaLogin?: () => void;
  titulo?: string;
}

export const SisuPaywall: React.FC<SisuPaywallProps> = ({
  isAuthenticated,
  onAssinarPremium,
  onIrParaLogin,
  titulo = 'Simulador Sisu completo com regras oficiais e análise por IA',
}) => {
  const recursos = [
    {
      icon: Calculator,
      titulo: 'Pesos reais & 3 edições do Enem',
      desc: 'Calcula automaticamente a melhor média ponderada entre 2024, 2025 e 2026 sem misturar áreas.',
    },
    {
      icon: Layers,
      titulo: 'Ampla Concorrência + Cotas (Lei 14.723/2023)',
      desc: 'Avalia sua nota primeiro na AC e depois na sua cota (LB_PPI, LB_EP, LI_PPI, AA_IES e mais).',
    },
    {
      icon: Compass,
      titulo: 'Onde eu passo? & Calculadora reversa',
      desc: 'Descubra cursos onde sua nota já é competitiva ou quanto tirar em cada área para bater o corte.',
    },
    {
      icon: Sparkles,
      titulo: 'Explicação estratégica com IA',
      desc: 'Saiba exatamente quantos pontos faltam, plano de 4 semanas e sugestão estratégica para 2ª opção.',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border border-[var(--border-light)] bg-[var(--bg-card)] shadow-xl p-6 md:p-10"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Lock size={14} />
          <span>Assinatura Inativa</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-display font-black text-[var(--text-main)] leading-tight">
            {titulo}
          </h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            Sua assinatura não está ativa. Escolha um plano para continuar e liberar o acesso completo ao Simulador Sisu, Treino Rápido, correções de redação e simulados oficiais do Gabarita.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {recursos.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.titulo}
                className="p-3.5 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)] flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-[var(--primary-soft)] text-blue-400 flex items-center justify-center shrink-0">
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-[var(--text-main)]">{item.titulo}</h3>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-snug">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onAssinarPremium}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold text-sm shadow-lg shadow-[var(--shadow-primary)] transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <CreditCard size={18} />
            <span>Escolher um plano</span>
          </button>

          {!isAuthenticated && onIrParaLogin && (
            <button
              type="button"
              onClick={onIrParaLogin}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-hover)] hover:bg-[var(--border-light)] text-[var(--text-main)] font-semibold text-sm transition-all cursor-pointer"
            >
              Já tenho assinatura · Entrar
            </button>
          )}

          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] sm:ml-auto">
            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
            <span>Liberação imediata após ativação</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SisuPaywall;
