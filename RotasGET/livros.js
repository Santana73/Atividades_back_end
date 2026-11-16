// routes/livros.js
// Rotas relacionadas aos livros (montadas em /livros pelo server.js).

const express = require('express');
const {
  listarLivros,
  listarPorCategoria,
  buscarLivroPorId,
} = require('../funcoes');

const router = express.Router();

// GET /livros
// GET /livros?categoria=Romance
router.get('/', (req, res) => {
  const { categoria } = req.query;

  // sem filtro: lista todos
  if (categoria === undefined) {
    return res.json(listarLivros());
  }

  // ?categoria vazia ou repetida (?categoria=a&categoria=b) não é válida
  if (typeof categoria !== 'string' || categoria.trim() === '') {
    return res.status(400).json({ erro: 'Informe uma categoria válida. Exemplo: /livros?categoria=Romance' });
  }

  res.json(listarPorCategoria(categoria));
});

// GET /livros/:id
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ erro: 'ID inválido. Use um número inteiro maior que zero.' });
  }

  const livro = buscarLivroPorId(id);

  if (!livro) {
    return res.status(404).json({ erro: `Livro com ID ${id} não encontrado.` });
  }

  res.json(livro);
});

module.exports = router;
