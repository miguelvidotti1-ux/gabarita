import React from 'react';
import { Users, Target, Award } from 'lucide-react';

export default function Sobre() {
  return (
    <div className="space-y-12 py-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white">Sobre o Vestibular Pro</h1>
        <p className="text-xl text-slate-600 dark:text-blue-200 max-w-2xl mx-auto">
          Transformando a jornada de estudos em uma experiência eficiente, inteligente e acessível.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-blue-900 p-8 rounded-2xl shadow-sm border border-blue-100 dark:border-blue-800 space-y-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-200">
            <Target size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Nossa Missão</h2>
          <p className="text-slate-600 dark:text-blue-200 leading-relaxed">
            Democratizar o acesso à preparação de alta qualidade para vestibulares e ENEM, 
            utilizando tecnologia de ponta para personalizar o aprendizado e maximizar 
            o potencial de cada estudante, independentemente de onde ele esteja.
          </p>
        </div>

        <div className="bg-white dark:bg-blue-900 p-8 rounded-2xl shadow-sm border border-blue-100 dark:border-blue-800 space-y-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-200">
            <Award size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Nossos Valores</h2>
          <ul className="text-slate-600 dark:text-blue-200 leading-relaxed list-disc list-inside space-y-2">
            <li>Excelência acadêmica</li>
            <li>Inclusão e acessibilidade</li>
            <li>Inovação constante</li>
            <li>Foco no sucesso do aluno</li>
          </ul>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white text-center">Nossa Equipe</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { name: 'Miguel Vidotti', role: 'Criador do Aplicativo' },
          ].map((member) => (
            <div key={member.name} className="bg-white dark:bg-blue-900 p-6 rounded-2xl shadow-sm border border-blue-100 dark:border-blue-800 text-center space-y-2 overflow-hidden hover:shadow-md transition-shadow">
              <div className="w-20 h-20 mx-auto bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-200 text-2xl font-bold">
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white">{member.name}</h3>
              <p className="text-blue-600 dark:text-blue-300 text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
