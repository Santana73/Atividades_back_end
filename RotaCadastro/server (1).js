// server.js
// Cria o servidor Express, registra as rotas e inicia a escuta na porta.

const express = require('express');
const rotasIndex = require('./routes/index');
const rotasLivros = require('./routes/livros');

const app = express();
const PORT = 3000;

// permite ler o corpo das requisições em JSON (req.body)
app.use(express.json());

app.use('/', rotasIndex);
app.use('/livros', rotasLivros);

// JSON malformado no corpo da requisição
app.use((erro, req, res, next) => {
  if (erro instanceof SyntaxError && erro.status === 400 && 'body' in erro) {
    return res.status(400).json({ erro: 'JSON inválido no corpo da requisição.' });
  }
  next(erro);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
