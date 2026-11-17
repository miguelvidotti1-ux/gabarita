<div align="center">

# 🎯 gabarita
<img width="1536" height="864" alt="Imagemgerada_1794951622060" src="https://github.com/user-attachments/assets/9d0e8e34-0bf7-4079-ae0e-714d2be4eb53" />


**Treine como a banca corrige.**

Plataforma de preparação para o ENEM e os maiores vestibulares do Brasil —
com IA generativa em cada etapa do estudo.

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-SPA-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Gemini](https://img.shields.io/badge/Gemini%20AI-powered-8E75B2?logo=google&logoColor=white)](https://ai.google.dev)
[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)]()

*ENEM · FUVEST · UNICAMP · UNESP · ITA · IME · UERJ · FGV · UNIFESP · PUC-SP*

</div>

---

## 📖 Sobre

O **gabarita** é a plataforma que prepara o estudante como se a banca estivesse corrigindo cada resposta: simulados no estilo fiel do vestibular escolhido, correção de redação com rubricas oficiais, cronograma personalizado e um tutor de IA disponível 24h — todo o ciclo de estudo em um só lugar, com visual dark premium focado em foco.

## ✨ Funcionalidades

| Módulo | O que faz |
|---|---|
| 🤖 **VestBot — Tutor 24h** | Assistente de IA que responde qualquer dúvida de conteúdo, resolve questões passo a passo e gera resumos e macetes de estudo |
| ✍️ **CorrigeBot — Redações oficiais** | Correção no padrão de cada banca (ENEM com as 5 competências, FUVEST, UNICAMP, UNESP e mais), com nota por critério, parecer geral e exemplo de melhoria |
| 📝 **Simulados personalizados** | Escolha vestibular + matéria + dificuldade + nº de questões (5–45). Questões que dependem de figura **recebem imagem gerada por IA na hora** |
| 🗂️ **Flashcards inteligentes** | Geração automática de cartões a partir de resumos ou foto do material (upload com OCR) |
| 📋 **Cronograma editável** | Plano de estudos semana a semana gerado por IA — e 100% editável pelo usuário (reordenar, editar, regenerar semanas) |
| 📷 **Boletim escolar com OCR** | Foto do boletim → notas extraídas por IA → diagnóstico de matérias fracas → plano calibrado |
| 🧠 **Mapas mentais** | Cada tópico vem com mapa mental estruturado para revisão rápida |
| 🎧 **Spotify Focus** | Login OAuth, player embutido e playlists de concentração com letras sincronizadas para estudar no ritmo |
| 📊 **Progresso real** | Barras de progresso por tema e por matéria que sobem conforme o conteúdo é consumido |
| 💳 **Planos & PIX** | Checkout Pro do Mercado Pago com planos mensal, trimestral, semestral e anual |
| 🔐 **Segurança** | Login com hash scrypt, tokens assinados (HMAC), rate limiting e chaves VIP fora do código-fonte |

## 🖼️ Screenshots

<!-- Adicione as imagens do app dentro de docs/ e descomente:
<p align="center">
  <<img width="1360" height="608" alt="Captura de tela 2026-11-17 182829" src="https://github.com/user-attachments/assets/6e596246-2026-406d-875a-dd869821201c" />>
  <img src="docs/screenshot-redacao.png" width="45%" alt="Correção de redação"/>
</p>
-->
<img width="1360" height="608" alt="Captura de tela 2026-11-17 182829" src="https://github.com/user-attachments/assets/15c8170a-f300-49fa-86d0-97830d1e1ae2" />
<img width="1365" height="605" alt="Captura de tela 2026-11-17 182812" src="https://github.com/user-attachments/assets/3a04ccb6-7212-477b-9076-199e07abbe62" />
<img width="1361" height="604" alt="Captura de tela 2026-11-17 182733" src="https://github.com/user-attachments/assets/f33a17a9-c708-4ebc-9db2-4a122bb51afb" />
<img width="1366" height="606" alt="Captura de tela 2026-11-17 182654" src="https://github.com/user-attachments/assets/76f0809b-5ddb-481e-a91a-2ae06d846a8c" />
<img width="1356" height="602" alt="Captura de tela 2026-11-17 182854" src="https://github.com/user-attachments/assets/7b4f9f55-a01c-4f4e-a727-9c10f9cbdd41" />


## 🏗️ Arquitetura

    gabarita/
    ├── index.html              # SPA (front-end completo do app)
    ├── server.ts               # API Express + integração Gemini
    ├── server/
    │   ├── spotifyRoutes.ts    # OAuth 2.0 + player Spotify
    │   ├── mercadoPagoRoutes.ts# Checkout & planos
    │   ├── corretorRedacao.ts  # Rubricas oficiais das bancas
    │   ├── onboardingStore.ts  # Perfil & questionário do aluno
    │   ├── boletimStore.ts     # OCR do boletim & análise de notas
    │   └── chatStore.ts        # Histórico de conversas do tutor
    └── data/                   # Persistência em JSON (cronogramas, simulados, pesquisa)

**Stack:** Node.js · Express · TypeScript · Vite · Gemini API (texto + imagem) · Spotify Web API · Mercado Pago · Multer

## 🚀 Começando

**Pré-requisitos:** Node.js 20+ e npm.

    git clone https://github.com/miguelvidotti1-ux/gabarita.git
    cd gabarita
    npm install
    npm run dev

O app sobe em `http://localhost:3000` (dev roda Vite + API no mesmo servidor).

### Variáveis de ambiente

Crie um arquivo `.env` na raiz:

    GEMINI_API_KEY=sua-chave-do-google-ai-studio
    ADMIN_KEY=valor-longo-e-aleatorio-para-painel-admin
    VIP_KEYS=CHAVE-2026-TESTE,OUTRA-CHAVE

> Chaves VIP lidas de `VIP_KEYS` ou de `data/vip_keys.json` — **nunca hardcoded**.

## 🔌 Principais rotas da API

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/simulado/criar` | Cria simulado (vestibular, matéria, dificuldade, nº de questões) com imagens geradas por IA |
| `POST` | `/api/simulado/:id/finalizar` | Corrige o simulado e devolve percentual de acertos |
| `POST` | `/api/redacao/corrigir` | Correção de redação na rubrica oficial da banca |
| `GET` | `/api/redacao/bancas` | Lista bancas com regras oficiais |
| `POST` | `/api/chat` | Tutor VestBot (com histórico salvo por usuário) |
| `GET/POST` | `/api/cronograma` | Carrega/salva cronograma editável |
| `POST` | `/api/cronograma/regenerar-semana` | Regenera uma semana com IA |
| `POST` | `/api/flashcards/generate` | Gera flashcards de resumo ou de imagem enviada |
| `POST` | `/api/onboarding/notas/foto` | Extrai notas do boletim por OCR |
| `GET` | `/api/planos` | Planos e preços |
| `POST` | `/api/auth/login` | Autenticação (senha com hash scrypt, token HMAC) |

## 🗺️ Roadmap

- [ ] Persistência de progresso por conta (sincronização multi-dispositivo)
- [ ] Estatísticas comparativas por disciplina simulado a simulado
- [ ] Modo prova cronometrado com tempo da banca real
- [ ] Simulados interdisciplinares estilo ENEM (2ª série de questões)
- [ ] PWA: gabarita instalável no celular

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie sua branch: `git checkout -b feature/minha-feature`
3. Commit: `git commit -m "feat: minha feature"`
4. Push e abra um Pull Request

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

<div align="center">
  <sub>Feito com 💙 para quem vai gabaritar.</sub>
</div>
