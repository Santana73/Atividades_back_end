// index.js
// Arquivo principal: controla o fluxo do sistema (menu) e chama as funções.

const readline = require('readline/promises');
const {
  cadastrarLivro,
  listarLivros,
  buscarLivroPorId,
  removerLivro,
} = require('./funcoes');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function mostrarMenu() {
  console.log('\n=== CADASTRO DE LIVROS ===');
  console.log('1 - Cadastrar livro');
  console.log('2 - Listar livros');
  console.log('3 - Buscar livro por ID');
  console.log('4 - Remover livro por ID');
  console.log('0 - Sair');
}

function mostrarLivro(l) {
  console.log(`ID: ${l.id} | Título: ${l.titulo} | Autor: ${l.autor} | Ano: ${l.ano}`);
}

async function main() {
  let opcao;

  do {
    mostrarMenu();
    opcao = (await rl.question('Escolha uma opção: ')).trim();

    try {
      switch (opcao) {
        case '1': {
          const titulo = (await rl.question('Título: ')).trim();
          const autor = (await rl.question('Autor: ')).trim();
          const ano = Number(await rl.question('Ano: '));
          const livro = cadastrarLivro(titulo, autor, ano);
          console.log('Livro cadastrado com sucesso!');
          mostrarLivro(livro);
          break;
        }
        case '2': {
          const lista = listarLivros();
          if (lista.length === 0) console.log('Nenhum livro cadastrado.');
          else lista.forEach(mostrarLivro);
          break;
        }
        case '3': {
          const id = Number(await rl.question('ID do livro: '));
          const livro = buscarLivroPorId(id);
          if (livro) mostrarLivro(livro);
          else console.log('Livro não encontrado.');
          break;
        }
        case '4': {
          const id = Number(await rl.question('ID do livro a remover: '));
          const removido = removerLivro(id);
          if (removido) console.log(`Livro "${removido.titulo}" removido.`);
          else console.log('Livro não encontrado.');
          break;
        }
        case '0':
          console.log('Encerrando...');
          break;
        default:
          console.log('Opção inválida.');
      }
    } catch (erro) {
      console.log(`Erro: ${erro.message}`);
    }
  } while (opcao !== '0');

  rl.close();
}

main();
