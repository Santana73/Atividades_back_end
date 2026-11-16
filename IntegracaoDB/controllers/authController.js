// CONTROLLER de autenticação: recebe as credenciais e devolve o token.

const authService = require('../services/authService');

function login(req, res, next) {
  try {
    const resultado = authService.login(req.body);
    res.json(resultado);
  } catch (erro) {
    next(erro);
  }
}

module.exports = { login };
