// Configuração da conexão com o MySQL.
// Usa um "pool" (conjunto de conexões reutilizáveis) com mysql2/promise,
// lendo as credenciais do arquivo .env.

require('dotenv').config();

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true, // DECIMAL (preco) volta como número, não como texto
});

// Testa a conexão ao iniciar, para falhar cedo se o .env estiver errado.
async function testarConexao() {
  const conexao = await pool.getConnection();
  conexao.release();
}

module.exports = { pool, testarConexao };
