// funcoes.js
// Responsável pelas regras e operações sobre os livros.

const livros = require('./dados');

// continua a numeração a partir do maior ID já existente
let proximoId = Math.max(0, ...livros.map((livro) => livro.id)) + 1;

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
  // devolve uma cópia do array, pronta para ser enviada como JSON na rota
  return [...livros];
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
