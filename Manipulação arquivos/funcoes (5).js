// funcoes.js
// Regras e operações sobre os livros. Não conhece o Express:
// só recebe valores e devolve resultados.
// Toda função lê o acervo do arquivo na hora de usar, e quem altera o
// acervo grava o arquivo de volta.

const { lerLivros, salvarLivros } = require('./dados');

// deixa o texto em minúsculas e sem acentos para comparar categorias
function normalizar(texto) {
  return String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

// cria um erro com o código HTTP que a rota deve responder
function erroComStatus(mensagem, status) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

function cadastrarLivro(dados) {
  const { id, titulo, autor, ano, categoria } = dados || {};
  const campos = { id, titulo, autor, ano, categoria };

  // 1) campos obrigatórios
  const faltando = Object.keys(campos).filter((nome) => {
    const valor = campos[nome];
    return valor === undefined || valor === null ||
      (typeof valor === 'string' && valor.trim() === '');
  });

  if (faltando.length > 0) {
    throw erroComStatus(`Campos obrigatórios não informados: ${faltando.join(', ')}.`, 400);
  }

  // 2) tipos e valores válidos
  if (!Number.isInteger(id) || id <= 0) {
    throw erroComStatus('O campo id deve ser um número inteiro maior que zero.', 400);
  }

  for (const nome of ['titulo', 'autor', 'categoria']) {
    if (typeof campos[nome] !== 'string') {
      throw erroComStatus(`O campo ${nome} deve ser um texto.`, 400);
    }
  }

  const anoAtual = new Date().getFullYear();
  if (!Number.isInteger(ano) || ano <= 0 || ano > anoAtual) {
    throw erroComStatus(`O campo ano deve ser um número inteiro entre 1 e ${anoAtual}.`, 400);
  }

  // 3) não permitir dois livros com o mesmo ID
  const livros = lerLivros();

  if (livros.some((livro) => livro.id === id)) {
    throw erroComStatus(`Já existe um livro cadastrado com o ID ${id}.`, 409);
  }

  const livro = {
    id,
    titulo: titulo.trim(),
    autor: autor.trim(),
    ano,
    categoria: categoria.trim(),
  };

  livros.push(livro);
  salvarLivros(livros); // grava a alteração no arquivo

  return livro;
}

function listarLivros() {
  return lerLivros();
}

function listarPorCategoria(categoria) {
  const procurada = normalizar(categoria);
  return lerLivros().filter((livro) => normalizar(livro.categoria) === procurada);
}

function buscarLivroPorId(id) {
  return lerLivros().find((livro) => livro.id === id) || null;
}

function removerLivro(id) {
  const livros = lerLivros();
  const posicao = livros.findIndex((livro) => livro.id === id);
  if (posicao === -1) return null;

  const [removido] = livros.splice(posicao, 1);
  salvarLivros(livros); // grava a alteração no arquivo

  return removido;
}

module.exports = {
  cadastrarLivro,
  listarLivros,
  listarPorCategoria,
  buscarLivroPorId,
  removerLivro,
};
