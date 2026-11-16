// Código compartilhado pelas páginas: endereço da API, token no localStorage
// e a função `requisitar`, que envia o header Authorization em cada fetch.

// Se a página for servida pelo próprio Express (http://localhost:3000),
// usamos caminho relativo. Caso contrário (file://, Live Server...),
// apontamos para o back-end em localhost:3000.
const API_URL = window.location.port === '3000' ? '' : 'http://localhost:3000';

const CHAVE_TOKEN = 'token';
const CHAVE_USUARIO = 'usuario';

// ---------- localStorage (protegido: pode estar bloqueado no navegador) ----------
function lerStorage(chave) {
  try {
    return localStorage.getItem(chave);
  } catch {
    return null;
  }
}

function salvarStorage(chave, valor) {
  try {
    localStorage.setItem(chave, valor);
  } catch {
    /* sem storage: o usuário terá de logar de novo a cada página */
  }
}

function obterToken() {
  return lerStorage(CHAVE_TOKEN);
}

function obterUsuario() {
  try {
    return JSON.parse(lerStorage(CHAVE_USUARIO));
  } catch {
    return null;
  }
}

function salvarSessao(token, usuario) {
  salvarStorage(CHAVE_TOKEN, token);
  salvarStorage(CHAVE_USUARIO, JSON.stringify(usuario));
}

function limparSessao() {
  try {
    localStorage.removeItem(CHAVE_TOKEN);
    localStorage.removeItem(CHAVE_USUARIO);
  } catch {
    /* ignora */
  }
}

function sair() {
  limparSessao();
  window.location.href = 'login.html';
}

// ---------- fetch com Authorization ----------
// Faz a requisição e devolve o JSON. Se a API responder com erro, lança um
// Error com a mensagem do back-end ({ erro: "..." }) e o status em erro.status.
//
// Opções extras: { publica: true } não envia token (usado no login).
async function requisitar(url, opcoes = {}) {
  const { publica, ...opcoesFetch } = opcoes;

  const headers = { ...(opcoesFetch.headers || {}) };

  const token = obterToken();
  if (token && !publica) {
    headers.Authorization = `Bearer ${token}`;
  }

  let resposta;

  try {
    resposta = await fetch(url, { ...opcoesFetch, headers });
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Ele está rodando?');
  }

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    // Token ausente, inválido ou expirado: volta para o login.
    if (resposta.status === 401 && !publica) {
      limparSessao();
      window.location.href = 'login.html?motivo=sessao';
    }

    const erro = new Error(
      (dados && dados.erro) || `Erro ${resposta.status} ao falar com o servidor.`
    );
    erro.status = resposta.status;
    throw erro;
  }

  return dados;
}
