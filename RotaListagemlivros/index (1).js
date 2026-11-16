// index.js
// Arquivo principal: cria o servidor Express e define as rotas.

const express = require('express');
const { listarLivros } = require('./funcoes');

const app = express();
const PORT = 3000;

// Rota raiz: mensagem de boas-vindas
app.get('/', (req, res) => {
  res.send('Bem-vindo ao Sistema de Cadastro de Livros!');
});

// Rota GET de listagem de livros
app.get('/livros', (req, res) => {
  res.json(listarLivros());
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
