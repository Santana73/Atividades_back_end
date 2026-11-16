// SERVICE de autenticação: valida credenciais e gera o token de acesso (JWT).

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuariosData = require('../data/usuariosData');
const { JWT_SECRET, JWT_EXPIRA_EM, JWT_ALGORITMO } = require('../config/auth');
const { ValidacaoError, NaoAutorizadoError } = require('../errors/AppErrors');

// Hash usado quando o usuário não existe, para que o tempo de resposta seja
// parecido nos dois casos (evita descobrir usuários pelo tempo de resposta).
const HASH_FALSO = bcrypt.hashSync('senha-que-nao-existe', 10);

function login(dados) {
  const { usuario, senha } = dados || {};

  if (typeof usuario !== 'string' || usuario.trim() === '' ||
      typeof senha !== 'string' || senha === '') {
    throw new ValidacaoError('Informe usuario e senha.');
  }

  const encontrado = usuariosData.buscarPorUsuario(usuario);
  const senhaConfere = bcrypt.compareSync(senha, encontrado ? encontrado.senhaHash : HASH_FALSO);

  // Mesma mensagem para "usuário inexistente" e "senha errada".
  if (!encontrado || !senhaConfere) {
    throw new NaoAutorizadoError('Usuário ou senha inválidos.');
  }

  const payload = { nome: encontrado.nome, role: encontrado.role };

  const token = jwt.sign(payload, JWT_SECRET, {
    subject: String(encontrado.id),
    expiresIn: JWT_EXPIRA_EM,
    algorithm: JWT_ALGORITMO,
  });

  return {
    token,
    tipo: 'Bearer',
    usuario: { id: encontrado.id, usuario: encontrado.usuario, ...payload },
  };
}

function verificarToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET, { algorithms: [JWT_ALGORITMO] });
  } catch (erro) {
    const mensagem = erro.name === 'TokenExpiredError'
      ? 'Token expirado. Faça login novamente.'
      : 'Token inválido.';
    throw new NaoAutorizadoError(mensagem);
  }
}

module.exports = { login, verificarToken };
