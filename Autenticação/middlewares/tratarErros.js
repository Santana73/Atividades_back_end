// Traduz os erros de negócio em respostas HTTP.

const {
  ValidacaoError,
  NaoEncontradoError,
  ConflitoError,
  NaoAutorizadoError,
  AcessoNegadoError,
} = require('../errors/AppErrors');

function rotaNaoEncontrada(req, res) {
  res.status(404).json({ erro: 'Rota não encontrada.' });
}

function tratarErros(erro, req, res, next) {
  if (erro instanceof ValidacaoError) {
    return res.status(400).json({ erro: erro.message });
  }

  if (erro instanceof NaoAutorizadoError) {
    return res.status(401).json({ erro: erro.message });
  }

  if (erro instanceof AcessoNegadoError) {
    return res.status(403).json({ erro: erro.message });
  }

  if (erro instanceof NaoEncontradoError) {
    return res.status(404).json({ erro: erro.message });
  }

  if (erro instanceof ConflitoError) {
    return res.status(409).json({ erro: erro.message });
  }

  if (erro instanceof SyntaxError && erro.status === 400 && 'body' in erro) {
    return res.status(400).json({ erro: 'JSON inválido no corpo da requisição.' });
  }

  console.error(erro);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
}

module.exports = { rotaNaoEncontrada, tratarErros };
