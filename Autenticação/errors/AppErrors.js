// Erros de negócio. O service lança estes erros; quem decide o código HTTP
// de cada um é o middleware de tratamento de erros.

class ValidacaoError extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'ValidacaoError';
  }
}

class NaoEncontradoError extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'NaoEncontradoError';
  }
}

class ConflitoError extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'ConflitoError';
  }
}

// 401: quem está chamando não se identificou (sem token, token inválido/expirado
// ou credenciais erradas).
class NaoAutorizadoError extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'NaoAutorizadoError';
  }
}

// 403: está identificado, mas não tem permissão (role insuficiente).
class AcessoNegadoError extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'AcessoNegadoError';
  }
}

module.exports = {
  ValidacaoError,
  NaoEncontradoError,
  ConflitoError,
  NaoAutorizadoError,
  AcessoNegadoError,
};
