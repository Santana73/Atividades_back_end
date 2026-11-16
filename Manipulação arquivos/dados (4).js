// dados.js
// Responsável por ler e gravar o acervo no arquivo livros.json (módulo fs).
// Cada livro tem o formato: { id, titulo, autor, ano, categoria }

const fs = require('fs');
const path = require('path');

const ARQUIVO = path.join(__dirname, 'livros.json');

// Lê o arquivo (texto JSON) e converte para array de objetos
function lerLivros() {
  try {
    const texto = fs.readFileSync(ARQUIVO, 'utf-8');
    const livros = JSON.parse(texto);

    if (!Array.isArray(livros)) {
      throw new Error('o conteúdo do arquivo não é uma lista de livros.');
    }

    return livros;
  } catch (erro) {
    if (erro.code === 'ENOENT') {
      return []; // arquivo ainda não existe: acervo vazio
    }
    throw new Error(`Não foi possível ler o arquivo livros.json: ${erro.message}`);
  }
}

// Converte o array de objetos para texto JSON e grava no arquivo
function salvarLivros(livros) {
  const texto = JSON.stringify(livros, null, 2);
  fs.writeFileSync(ARQUIVO, texto, 'utf-8');
}

module.exports = { lerLivros, salvarLivros };
