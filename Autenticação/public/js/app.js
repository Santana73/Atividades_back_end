// FRONT-END: consome a API de produtos usando fetch.

// API_URL, token e a função requisitar() (que envia o header Authorization)
// vêm de auth.js, carregado antes deste arquivo.
const ENDPOINT = `${API_URL}/produtos`;

// ---------- Elementos da página ----------
const listaEl = document.getElementById('lista-produtos');
const contagemEl = document.getElementById('contagem');
const mensagemListaEl = document.getElementById('mensagem-lista');
const filtroEl = document.getElementById('filtro-categoria');
const categoriasSugeridasEl = document.getElementById('categorias-sugeridas');

const formEl = document.getElementById('form-produto');
const botaoEl = document.getElementById('botao-cadastrar');
const mensagemFormEl = document.getElementById('mensagem-form');

const usuarioLogadoEl = document.getElementById('usuario-logado');
const botaoSairEl = document.getElementById('botao-sair');
const avisoPermissaoEl = document.getElementById('aviso-permissao');

const formatoMoeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

// ---------- Utilidades ----------
function mostrarMensagem(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className = `mensagem mensagem--${tipo}`;
  elemento.hidden = false;
}

function esconderMensagem(elemento) {
  elemento.hidden = true;
  elemento.textContent = '';
}

// ---------- Renderização ----------
function criarCard(produto, destacar) {
  const card = document.createElement('article');
  card.className = destacar ? 'card card--novo' : 'card';

  const categoria = document.createElement('span');
  categoria.className = 'card__categoria';
  categoria.textContent = produto.categoria;

  const nome = document.createElement('h3');
  nome.className = 'card__nome';
  nome.textContent = produto.nome;

  const preco = document.createElement('div');
  preco.className = 'card__preco';
  preco.textContent = formatoMoeda.format(produto.preco);

  const rodape = document.createElement('div');
  rodape.className = 'card__rodape';

  const id = document.createElement('span');
  id.textContent = `#${produto.id}`;

  const estoque = document.createElement('span');
  estoque.className = 'card__estoque';
  if (produto.estoque === 0) {
    estoque.classList.add('card__estoque--zerado');
    estoque.textContent = 'Sem estoque';
  } else {
    if (produto.estoque <= 5) estoque.classList.add('card__estoque--baixo');
    estoque.textContent = `${produto.estoque} em estoque`;
  }

  rodape.append(id, estoque);
  card.append(categoria, nome, preco, rodape);
  return card;
}

function renderizarProdutos(produtos, idDestaque) {
  listaEl.replaceChildren();

  if (produtos.length === 0) {
    mostrarMensagem(mensagemListaEl, 'Nenhum produto encontrado.', 'info');
    contagemEl.textContent = '';
    return;
  }

  esconderMensagem(mensagemListaEl);
  contagemEl.textContent =
    produtos.length === 1 ? '1 produto' : `${produtos.length} produtos`;

  produtos.forEach((produto) => {
    listaEl.append(criarCard(produto, produto.id === idDestaque));
  });
}

// Mantém o filtro e as sugestões do formulário com as categorias existentes.
function atualizarCategorias(produtos) {
  const categorias = [...new Set(produtos.map((p) => p.categoria))]
    .sort((a, b) => a.localeCompare(b, 'pt-BR'));

  const selecionada = filtroEl.value;

  filtroEl.replaceChildren(new Option('Todas', ''));
  categoriasSugeridasEl.replaceChildren();

  categorias.forEach((categoria) => {
    filtroEl.append(new Option(categoria, categoria));
    categoriasSugeridasEl.append(new Option(categoria));
  });

  // Se a categoria filtrada ainda existe, mantém a seleção.
  if (categorias.includes(selecionada)) filtroEl.value = selecionada;
}

// ---------- Ações ----------
// GET /produtos (ou /produtos?categoria=X quando há filtro)
async function carregarProdutos(idDestaque) {
  const categoria = filtroEl.value;
  const url = categoria
    ? `${ENDPOINT}?categoria=${encodeURIComponent(categoria)}`
    : ENDPOINT;

  try {
    const produtos = await requisitar(url);
    renderizarProdutos(produtos, idDestaque);

    // As categorias vêm sempre da lista completa.
    if (categoria) {
      atualizarCategorias(await requisitar(ENDPOINT));
    } else {
      atualizarCategorias(produtos);
    }
  } catch (erro) {
    listaEl.replaceChildren();
    contagemEl.textContent = '';
    mostrarMensagem(mensagemListaEl, erro.message, 'erro');
  }
}

// POST /produtos
async function cadastrarProduto(evento) {
  evento.preventDefault();
  esconderMensagem(mensagemFormEl);

  const dados = new FormData(formEl);

  // O back-end exige preco/estoque como números (não texto).
  const produto = {
    nome: dados.get('nome').trim(),
    categoria: dados.get('categoria').trim(),
    preco: Number(dados.get('preco')),
    estoque: Number(dados.get('estoque')),
  };

  // Campo numérico vazio vira 0 em Number(''): trata antes de enviar.
  if (dados.get('preco') === '' || dados.get('estoque') === '') {
    mostrarMensagem(mensagemFormEl, 'Preencha todos os campos.', 'erro');
    return;
  }

  botaoEl.disabled = true;
  botaoEl.textContent = 'Cadastrando...';

  try {
    const criado = await requisitar(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(produto),
    });

    formEl.reset();
    mostrarMensagem(mensagemFormEl, `"${criado.nome}" cadastrado com sucesso!`, 'sucesso');

    // Mostra todos os produtos de novo para o novo item aparecer na listagem.
    filtroEl.value = '';
    await carregarProdutos(criado.id);
  } catch (erro) {
    mostrarMensagem(mensagemFormEl, erro.message, 'erro');
  } finally {
    botaoEl.disabled = false;
    botaoEl.textContent = 'Cadastrar produto';
  }
}

// ---------- Sessão e permissões ----------
// Só esconde/desabilita o que o usuário não pode usar (conforto de uso).
// Quem realmente barra a ação é o back-end, que devolve 403 para não-admin.
function prepararSessao(usuario) {
  const rotulo = usuario.role === 'admin' ? 'admin' : 'usuário';
  usuarioLogadoEl.textContent = `${usuario.nome} (${rotulo})`;

  if (usuario.role !== 'admin') {
    avisoPermissaoEl.hidden = false;
    formEl.querySelectorAll('input, button').forEach((campo) => {
      campo.disabled = true;
    });
  }
}

// ---------- Eventos ----------
formEl.addEventListener('submit', cadastrarProduto);
filtroEl.addEventListener('change', () => carregarProdutos());
botaoSairEl.addEventListener('click', sair);

// ---------- Início ----------
const usuarioAtual = obterUsuario();

if (!obterToken() || !usuarioAtual) {
  // Sem token: volta para o login antes de chamar a API.
  sair();
} else {
  prepararSessao(usuarioAtual);
  carregarProdutos();
}
