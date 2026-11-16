// Inicia o servidor HTTP (depois de confirmar que o banco responde).

require('dotenv').config();

const app = require('./app');
const { testarConexao } = require('./db');

const PORT = process.env.PORT || 3000;

async function iniciar() {
  try {
    await testarConexao();
    console.log('Conectado ao MySQL.');
  } catch (erro) {
    console.error('Não foi possível conectar ao MySQL. Confira o arquivo .env.');
    console.error(`Motivo: ${erro.code || erro.message}`);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

iniciar();
