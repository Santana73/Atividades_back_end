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

module.exports = { ValidacaoError, NaoEncontradoError, ConflitoError };
