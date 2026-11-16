// routes/index.js
// Rota raiz da aplicação.

const express = require('express');

const router = express.Router();

// GET /
router.get('/', (req, res) => {
  res.send('Bem-vindo ao Sistema de Cadastro de Livros!');
});

module.exports = router;
