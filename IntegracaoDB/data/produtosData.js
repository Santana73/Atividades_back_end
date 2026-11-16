// DADOS: acesso ao MySQL. Só executa SQL, sem validar nada e sem lançar
// erros de negócio. Todas as consultas usam "?" (parâmetros), nunca
// concatenam valores no texto do SQL — isso evita SQL Injection.

const { pool } = require('../db');

const COLUNAS = 'id, nome, categoria, preco, estoque';

// SELECT de todos os produtos.
async function listar() {
  const [linhas] = await pool.query(`SELECT ${COLUNAS} FROM produtos ORDER BY id`);
  return linhas;
}

// SELECT com filtro por categoria (a collation do banco ignora maiúsculas/minúsculas).
async function listarPorCategoria(categoria) {
  const [linhas] = await pool.execute(
    `SELECT ${COLUNAS} FROM produtos WHERE categoria = ? ORDER BY id`,
    [categoria]
  );
  return linhas;
}

// SELECT por id.
async function buscarPorId(id) {
  const [linhas] = await pool.execute(
    `SELECT ${COLUNAS} FROM produtos WHERE id = ?`,
    [id]
  );
  return linhas[0] || null;
}

// SELECT por nome (usado para checar duplicidade).
async function buscarPorNome(nome) {
  const [linhas] = await pool.execute(
    `SELECT ${COLUNAS} FROM produtos WHERE nome = ?`,
    [nome]
  );
  return linhas[0] || null;
}

// INSERT: devolve o produto criado, com o id gerado pelo AUTO_INCREMENT.
async function inserir({ nome, categoria, preco, estoque }) {
  const [resultado] = await pool.execute(
    'INSERT INTO produtos (nome, categoria, preco, estoque) VALUES (?, ?, ?, ?)',
    [nome, categoria, preco, estoque]
  );
  return { id: resultado.insertId, nome, categoria, preco, estoque };
}

// UPDATE: devolve o produto atualizado (ou null se o id não existir).
async function atualizar(id, { nome, categoria, preco, estoque }) {
  const [resultado] = await pool.execute(
    'UPDATE produtos SET nome = ?, categoria = ?, preco = ?, estoque = ? WHERE id = ?',
    [nome, categoria, preco, estoque, id]
  );
  if (resultado.affectedRows === 0) return null;
  return { id, nome, categoria, preco, estoque };
}

// DELETE: devolve true se removeu alguma linha.
async function remover(id) {
  const [resultado] = await pool.execute('DELETE FROM produtos WHERE id = ?', [id]);
  return resultado.affectedRows > 0;
}

module.exports = {
  listar,
  listarPorCategoria,
  buscarPorId,
  buscarPorNome,
  inserir,
  atualizar,
  remover,
};
