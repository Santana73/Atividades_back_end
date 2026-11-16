// DADOS: usuários FICTÍCIOS para fins didáticos (array em memória).
// As senhas ficam guardadas apenas como hash (bcrypt), nunca em texto puro.
//
//   usuário: admin    senha: admin123    role: admin
//   usuário: cliente  senha: cliente123  role: user

const bcrypt = require('bcryptjs');

const usuarios = [
  {
    id: 1,
    usuario: 'admin',
    nome: 'Administrador',
    role: 'admin',
    senhaHash: bcrypt.hashSync('admin123', 10),
  },
  {
    id: 2,
    usuario: 'cliente',
    nome: 'Cliente Comum',
    role: 'user',
    senhaHash: bcrypt.hashSync('cliente123', 10),
  },
];

function buscarPorUsuario(usuario) {
  const alvo = String(usuario).trim().toLowerCase();
  return usuarios.find((u) => u.usuario === alvo) || null;
}

module.exports = { buscarPorUsuario };
