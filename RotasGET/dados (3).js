// dados.js
// Responsável apenas por guardar os dados (array de livros em memória).
// Cada livro tem o formato: { id, titulo, autor, ano, categoria }

const livros = [
  { id: 1, titulo: 'Dom Casmurro', autor: 'Machado de Assis', ano: 1899, categoria: 'Romance' },
  { id: 2, titulo: 'O Cortiço', autor: 'Aluísio Azevedo', ano: 1890, categoria: 'Romance' },
  { id: 3, titulo: 'Clean Code', autor: 'Robert C. Martin', ano: 2008, categoria: 'Tecnologia' },
  { id: 4, titulo: 'Refactoring', autor: 'Martin Fowler', ano: 1999, categoria: 'Tecnologia' },
  { id: 5, titulo: 'O Hobbit', autor: 'J. R. R. Tolkien', ano: 1937, categoria: 'Fantasia' },
];

module.exports = livros;
