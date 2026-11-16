// MIDDLEWARE de autenticação: roda a cada requisição de rota privada.
// Espera o header  Authorization: Bearer <token>.
// Se o token for válido, guarda os dados do usuário em req.usuario.

const authService = require('../services/authService');
const { NaoAutorizadoError } = require('../errors/AppErrors');

function autenticar(req, res, next) {
  try {
    const cabecalho = req.headers.authorization;

    if (!cabecalho) {
      throw new NaoAutorizadoError('Token não informado. Faça login.');
    }

    const [tipo, token] = cabecalho.split(' ');

    if (tipo !== 'Bearer' || !token) {
      throw new NaoAutorizadoError('Formato inválido. Use: Authorization: Bearer <token>.');
    }

    const dados = authService.verificarToken(token);

    req.usuario = { id: Number(dados.sub), nome: dados.nome, role: dados.role };
    next();
  } catch (erro) {
    next(erro);
  }
}

module.exports = { autenticar };
