// Monta a aplicação Express: middlewares, rotas e tratamento de erros.

const path = require('path');
const express = require('express');
const produtosRoutes = require('./routes/produtosRoutes');
const { rotaNaoEncontrada, tratarErros } = require('./middlewares/tratarErros');

const app = express();

// CORS simples: permite que o front-end seja aberto de outra origem
// (ex.: Live Server em http://127.0.0.1:5500) e ainda assim chame a API.
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json());

// FRONT-END: serve os arquivos da pasta /public (index.html, css, js).
app.use(express.static(path.join(__dirname, 'public')));

app.use('/produtos', produtosRoutes);

app.use(rotaNaoEncontrada);
app.use(tratarErros);

module.exports = app;
