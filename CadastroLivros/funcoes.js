// funcoes.js
// Responsável pelas regras e operações sobre os livros.

const livros = require('./dados');

let proximoId = 1; // controla o ID automático

function cadastrarLivro(titulo, autor, ano) {
  if (!titulo || !autor) {
    throw new Error('Título e autor são obrigatórios.');
  }
  if (!Number.isInteger(ano) || ano <= 0) {
    throw new Error('Ano inválido.');
  }

  const livro = { id: proximoId++, titulo, autor, ano };
  livros.push(livro);
  return livro;
}

function listarLivros() {
  return livros;
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
  buscarLivroPorId,
  removerLivro,
};
