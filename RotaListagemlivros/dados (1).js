// dados.js
// Responsável apenas por guardar os dados (array de livros em memória).
// Cada livro tem o formato: { id, titulo, autor, ano }
// Alguns livros iniciais para a listagem não ficar vazia.

const livros = [
  { id: 1, titulo: 'Dom Casmurro', autor: 'Machado de Assis', ano: 1899 },
  { id: 2, titulo: 'O Cortiço', autor: 'Aluísio Azevedo', ano: 1890 },
  { id: 3, titulo: 'Clean Code', autor: 'Robert C. Martin', ano: 2008 },
];

module.exports = livros;
