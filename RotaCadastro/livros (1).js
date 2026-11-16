// routes/livros.js
// Rotas relacionadas aos livros (montadas em /livros pelo server.js).

const express = require('express');
const {
  cadastrarLivro,
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

// POST /livros
// Corpo (JSON): { "id": 6, "titulo": "...", "autor": "...", "ano": 2020, "categoria": "..." }
router.post('/', (req, res) => {
  try {
    const livro = cadastrarLivro(req.body);
    res.status(201).json(livro);
  } catch (erro) {
    // erros de validação trazem o status (400 ou 409); qualquer outro é inesperado
    if (erro.status) {
      return res.status(erro.status).json({ erro: erro.message });
    }
    console.error(erro);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
});

module.exports = router;
