// funcoes.js
// Regras e operações sobre os livros. Não conhece o Express:
// só recebe valores e devolve resultados.

const livros = require('./dados');

let proximoId = Math.max(0, ...livros.map((livro) => livro.id)) + 1;

// deixa o texto em minúsculas e sem acentos para comparar categorias
function normalizar(texto) {
  return String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function cadastrarLivro(titulo, autor, ano, categoria) {
  if (!titulo || !autor || !categoria) {
    throw new Error('Título, autor e categoria são obrigatórios.');
  }
  if (!Number.isInteger(ano) || ano <= 0) {
    throw new Error('Ano inválido.');
  }

  const livro = { id: proximoId++, titulo, autor, ano, categoria };
  livros.push(livro);
  return livro;
}

function listarLivros() {
  return [...livros];
}

function listarPorCategoria(categoria) {
  const procurada = normalizar(categoria);
  return livros.filter((livro) => normalizar(livro.categoria) === procurada);
}

function buscarLivroPorId(id) {
  return livros.find((livro) => livro.id === id) || null;
}

function removerLivro(id) {
  const posicao = livros.findIndex((livro) => livro.id === id);
  if (posicao === -1) return null;

  const [removido] = livros.splice(posicao, 1);
  return removido;
}

module.exports = {
  cadastrarLivro,
  listarLivros,
  listarPorCategoria,
  buscarLivroPorId,
  removerLivro,
};
