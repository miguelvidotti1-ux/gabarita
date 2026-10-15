import React, { useState } from 'react';
import { 
  Target, 
  Award, 
  Compass, 
  Sparkles, 
  GraduationCap, 
  Users, 
  CheckCircle2, 
  BookOpen, 
  Brain, 
  Code2, 
  HeartHandshake,
  MessageSquare,
  ShieldCheck,
  Zap,
  Play
} from 'lucide-react';
import { motion } from 'motion/react';
import SplashScreen from './SplashScreen';

export default function Sobre() {
  const [showIntroModal, setShowIntroModal] = useState(false);
  const highlights = [
    {
      icon: BookOpen,
      stat: '+15.000',
      label: 'Questões Oficiais',
      detail: 'ENEM, FUVEST, UNICAMP, UNESP e mais'
    },
    {
      icon: Brain,
      stat: '100%',
      label: 'Gabaritos Comentados',
      detail: 'Explicações passo a passo com resolução'
    },
    {
      icon: Zap,
      stat: 'Tempo Real',
      label: 'Simulados & TRI',
      detail: 'Cronômetro oficial e cálculo de pontuação'
    },
    {
      icon: ShieldCheck,
      stat: 'Atualizado',
      label: 'Editais Vigentes',
      detail: 'Obras literárias e critérios revisados'
    }
  ];

  return (
    <div className="space-y-10 py-2 sm:py-6 max-w-5xl mx-auto font-sans transition-colors duration-200">
      
      {/* HERO SECTION */}
      <section className="text-center space-y-3 px-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-badge)] border border-[var(--primary-border)] text-[var(--primary)] text-xs font-semibold"
        >
          <Sparkles size={14} className="text-[var(--primary)]" />
          <span>Sobre a Plataforma VESTIBULARPRO</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-main)]"
        >
          Transformando o Preparo para os{' '}
          <span className="text-[var(--primary)]">
            Vestibulares do Brasil
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm sm:text-base text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed"
        >
          O VESTIBULARPRO nasceu com o propósito de unir tecnologia educacional de ponta, 
          gamificação e rigor metodológico para oferecer a cada estudante uma preparação 
          eficiente, inteligente e acessível.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="pt-2 flex justify-center"
        >
          <button
            onClick={() => setShowIntroModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-[var(--primary)] text-xs font-bold text-[var(--text-main)] hover:text-[var(--primary)] transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Play size={14} className="text-[var(--primary)] fill-[var(--primary)]" />
            <span>Assistir Animação de Abertura</span>
          </button>
        </motion.div>
      </section>

      {showIntroModal && (
        <SplashScreen onFinish={() => setShowIntroModal(false)} />
      )}

      {/* THREE PILLARS (MISSÃO, VISÃO, VALORES) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* CARD 1: NOSSA MISSÃO */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] shadow-sm hover:border-[var(--border-color)] transition-all flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Target size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text-main)] mb-2">
                Nossa Missão
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                Democratizar o acesso à preparação de alta qualidade para o ENEM e os vestibulares mais concorridos, capacitando os estudantes a conquistarem suas vagas nas universidades dos seus sonhos.
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-[var(--border-light)] flex items-center gap-2 text-xs font-semibold text-blue-400">
            <CheckCircle2 size={15} />
            <span>Educação de alto impacto</span>
          </div>
        </motion.div>

        {/* CARD 2: NOSSA VISÃO */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] shadow-sm hover:border-[var(--border-color)] transition-all flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Compass size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text-main)] mb-2">
                Nossa Visão
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                Ser a principal referência em ecossistemas de aprendizagem digital no Brasil, integrando simulados realistas, inteligência analítica de desempenho e suporte pedagógico humanizado.
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-[var(--border-light)] flex items-center gap-2 text-xs font-semibold text-indigo-400">
            <CheckCircle2 size={15} />
            <span>Inovação constante</span>
          </div>
        </motion.div>

        {/* CARD 3: NOSSOS VALORES */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] shadow-sm hover:border-[var(--border-color)] transition-all flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Award size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text-main)] mb-2">
                Nossos Valores
              </h2>
              <ul className="space-y-2 text-xs sm:text-sm text-[var(--text-muted)]">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>Excelência acadêmica e rigor</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>Inclusão e acessibilidade</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>Transparência pedagógica</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>Empatia com a rotina do aluno</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-[var(--border-light)] flex items-center gap-2 text-xs font-semibold text-amber-400">
            <CheckCircle2 size={15} />
            <span>Compromisso com o aluno</span>
          </div>
        </motion.div>

      </section>

      {/* HIGHLIGHT NUMBERS & CAPABILITIES */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)]">
        <div className="text-center max-w-xl mx-auto mb-6">
          <h3 className="text-lg font-bold text-[var(--text-main)]">
            Estrutura Completa de Aprendizado
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Projetado para abranger todas as etapas da sua preparação em um único ambiente.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="p-4 bg-[var(--bg-hover)] rounded-xl border border-[var(--border-light)] text-center space-y-1.5"
              >
                <div className="w-9 h-9 mx-auto rounded-lg bg-[var(--bg-badge)] text-[var(--primary)] flex items-center justify-center border border-[var(--primary-border)]">
                  <Icon size={18} />
                </div>
                <div className="text-xl font-bold text-[var(--text-main)]">
                  {item.stat}
                </div>
                <div className="text-xs font-semibold text-[var(--text-main)]">
                  {item.label}
                </div>
                <div className="text-[11px] text-[var(--text-muted)]">
                  {item.detail}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* NOSSA EQUIPE & CRIADOR */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-card)] border border-[var(--border-light)] text-[var(--text-muted)] text-xs font-semibold">
            <Users size={14} />
            <span>Liderança e Desenvolvimento</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)]">
            Nossa Equipe
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Conheça quem idealizou e constrói a plataforma diariamente.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-[var(--bg-card)] p-6 sm:p-7 rounded-2xl border border-[var(--border-light)] shadow-sm flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            
            {/* Foto Miguel Vidotti */}
            <div className="relative shrink-0 group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[var(--border-color)] group-hover:border-[var(--primary)] shadow-lg shadow-indigo-500/10 transition-all duration-300 group-hover:scale-105 bg-slate-900">
                <img
                  src="/miguel_vidotti.jpg"
                  alt="Miguel Vidotti"
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[var(--bg-card)] flex items-center justify-center shadow-md" title="Ativo">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            {/* Info */}
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-lg font-bold text-[var(--text-main)]">
                  Miguel Vidotti
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[var(--bg-badge)] border border-[var(--primary-border)] text-[11px] font-bold text-[var(--primary)]">
                  Criador & Desenvolvedor
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                Idealizador e responsável pelo desenvolvimento técnico e pedagógico do VESTIBULARPRO. Dedicado a construir ferramentas educacionais intuitivas que ajudem estudantes a alcançarem seus objetivos acadêmicos com autonomia e confiança.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-[var(--text-muted)] font-medium">
                <span className="flex items-center gap-1">
                  <Code2 size={14} className="text-[var(--primary)]" />
                  Engenharia de Software
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <GraduationCap size={14} className="text-[var(--primary)]" />
                  Educação & Tecnologia
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEEDBACK & CONTATO FOOTER */}
      <section className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/10 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/15 rounded-full text-xs font-semibold">
            <HeartHandshake size={13} />
            <span>Construído para você</span>
          </div>
          <h3 className="text-lg font-bold">
            Tem alguma sugestão ou feedback?
          </h3>
          <p className="text-xs text-blue-100 max-w-md">
            Sua opinião é fundamental para continuarmos melhorando as ferramentas e simulados do VESTIBULARPRO.
          </p>
        </div>

        <div className="shrink-0">
          <a
            href="mailto:miguelvidotti1@gmail.com?subject=App%20Vestibular%20Pro%20%E2%80%93%20Feedback&body=Ol%C3%A1!%0A%0AMinha%20d%C3%BAvida%2Ffeedback%20%C3%A9%20sobre%3A%20%0A%0AP%C3%A1gina%20do%20app%20onde%20estou%3A%20%0A"
            className="px-4 py-2.5 bg-white text-indigo-700 hover:bg-blue-50 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 inline-flex items-center gap-2 cursor-pointer"
          >
            <MessageSquare size={14} />
            <span>Falar com o Suporte</span>
          </a>
        </div>
      </section>

    </div>
  );
}
