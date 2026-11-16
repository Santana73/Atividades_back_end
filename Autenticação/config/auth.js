// Configurações de autenticação.
//
// Em produção, defina a variável de ambiente JWT_SECRET com um valor longo e
// secreto. O valor padrão abaixo serve apenas para desenvolvimento/aulas.

const SEGREDO_PADRAO = 'segredo-de-desenvolvimento-troque-em-producao';

if (!process.env.JWT_SECRET) {
  console.warn('[auth] JWT_SECRET não definido: usando segredo de desenvolvimento.');
}

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || SEGREDO_PADRAO,
  JWT_EXPIRA_EM: process.env.JWT_EXPIRA_EM || '1h',
  JWT_ALGORITMO: 'HS256',
};
