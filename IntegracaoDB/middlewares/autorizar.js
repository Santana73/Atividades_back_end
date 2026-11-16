// MIDDLEWARE de autorização por role. Deve vir DEPOIS de `autenticar`,
// pois depende de req.usuario.
//
// Uso: router.post('/', autorizar('admin'), controller.cadastrar);

const { NaoAutorizadoError, AcessoNegadoError } = require('../errors/AppErrors');

function autorizar(...rolesPermitidas) {
  return (req, res, next) => {
    if (!req.usuario) {
      return next(new NaoAutorizadoError('Faça login para continuar.'));
    }

    if (!rolesPermitidas.includes(req.usuario.role)) {
      return next(new AcessoNegadoError(
        'Acesso negado: apenas administradores podem realizar esta ação.'
      ));
    }

    next();
  };
}

module.exports = { autorizar };
