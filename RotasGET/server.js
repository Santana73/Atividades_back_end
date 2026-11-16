// server.js
// Cria o servidor Express, registra as rotas e inicia a escuta na porta.

const express = require('express');
const rotasIndex = require('./routes/index');
const rotasLivros = require('./routes/livros');

const app = express();
const PORT = 3000;

app.use('/', rotasIndex);
app.use('/livros', rotasLivros);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
