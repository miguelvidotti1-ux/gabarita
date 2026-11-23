function obterEmailUsuario(): string | null {
  try {
    const direto = localStorage.getItem("usuarioEmail");
    if (direto) return direto;

    const sessaoRaw = localStorage.getItem("vestibularpro_session_user");
    if (sessaoRaw) {
      const sessao = JSON.parse(sessaoRaw);
      if (sessao?.email) return String(sessao.email);
      if (sessao?.uid) return String(sessao.uid);
    }

    const emailSalvo = localStorage.getItem("gabarita_email");
    if (emailSalvo) return emailSalvo;
  } catch {
    // ignora erro de leitura no storage
  }
  return null;
}

function buildAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  try {
    const token = localStorage.getItem("vestibularpro_auth_token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  } catch {
    // ignora erro de leitura no storage
  }
  return headers;
}

// Chama em cada tela aberta (ex.: dentro do useEffect da página de Simulados:
// trackPage("simulados"); )
export function trackPage(pagina: string) {
  const email = obterEmailUsuario();
  if (!email) return;
  fetch("/api/track/page", {
    method: "POST",
    headers: buildAuthHeaders(),
    body: JSON.stringify({ usuario: email, pagina }),
  }).catch(() => {}); // falha silenciosa: rastreio nunca pode quebrar o app
}

// Chama quando o usuário envia o formulário de avaliação
export function enviarPesquisa(nota: number, funcionalidade: string, recomendacao: string) {
  const email = obterEmailUsuario();
  if (!email) return Promise.reject("sem login");
  return fetch("/api/pesquisa", {
    method: "POST",
    headers: buildAuthHeaders(),
    body: JSON.stringify({ usuario: email, nota, funcionalidade, recomendacao }),
  });
}