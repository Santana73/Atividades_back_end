// Tela de login: envia as credenciais para POST /login e guarda o token.

const formLoginEl = document.getElementById('form-login');
const botaoLoginEl = document.getElementById('botao-login');
const mensagemLoginEl = document.getElementById('mensagem-login');

function mostrarMensagemLogin(texto, tipo) {
  mensagemLoginEl.textContent = texto;
  mensagemLoginEl.className = `mensagem mensagem--${tipo}`;
  mensagemLoginEl.hidden = false;
}

// Já logado? Vai direto para a listagem.
if (obterToken()) {
  window.location.href = 'index.html';
}

// Veio redirecionado porque a sessão expirou/ficou inválida.
if (new URLSearchParams(window.location.search).get('motivo') === 'sessao') {
  mostrarMensagemLogin('Sua sessão expirou. Entre novamente.', 'info');
}

formLoginEl.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  mensagemLoginEl.hidden = true;

  const usuario = formLoginEl.usuario.value.trim();
  const senha = formLoginEl.senha.value;

  if (!usuario || !senha) {
    mostrarMensagemLogin('Informe usuário e senha.', 'erro');
    return;
  }

  botaoLoginEl.disabled = true;
  botaoLoginEl.textContent = 'Entrando...';

  try {
    const resposta = await requisitar(`${API_URL}/login`, {
      method: 'POST',
      publica: true, // o login ainda não tem token
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, senha }),
    });

    // Guarda o token (e os dados de exibição do usuário) no localStorage.
    salvarSessao(resposta.token, resposta.usuario);
    window.location.href = 'index.html';
  } catch (erro) {
    mostrarMensagemLogin(erro.message, 'erro');
    formLoginEl.senha.value = '';
    formLoginEl.senha.focus();
    botaoLoginEl.disabled = false;
    botaoLoginEl.textContent = 'Entrar';
  }
});
