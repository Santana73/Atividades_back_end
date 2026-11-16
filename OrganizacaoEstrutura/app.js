// Monta a aplicação Express: middlewares, rotas e tratamento de erros.

const express = require('express');
const produtosRoutes = require('./routes/produtosRoutes');
const { rotaNaoEncontrada, tratarErros } = require('./middlewares/tratarErros');

const app = express();

app.use(express.json());

app.use('/produtos', produtosRoutes);

app.use(rotaNaoEncontrada);
app.use(tratarErros);

module.exports = app;
