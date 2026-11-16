// SERVICE: regras de negócio e validações. Não conhece req/res nem status HTTP:
// quando algo dá errado, lança um erro de negócio.

const produtosData = require('../data/produtosData');
const {
  ValidacaoError,
  NaoEncontradoError,
  ConflitoError,
} = require('../errors/AppErrors');

function validarId(id) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidacaoError('ID inválido. Use um número inteiro maior que zero.');
  }
}

function validarProduto(dados) {
  const { nome, categoria, preco, estoque } = dados || {};
  const campos = { nome, categoria, preco, estoque };

  const faltando = Object.keys(campos).filter((campo) => {
    const valor = campos[campo];
    return valor === undefined || valor === null ||
      (typeof valor === 'string' && valor.trim() === '');
  });

  if (faltando.length > 0) {
    throw new ValidacaoError(`Campos obrigatórios não informados: ${faltando.join(', ')}.`);
  }

  if (typeof nome !== 'string') {
    throw new ValidacaoError('O campo nome deve ser um texto.');
  }

  if (typeof categoria !== 'string') {
    throw new ValidacaoError('O campo categoria deve ser um texto.');
  }

  if (typeof preco !== 'number' || !Number.isFinite(preco) || preco <= 0) {
    throw new ValidacaoError('O campo preco deve ser um número maior que zero.');
  }

  if (!Number.isInteger(estoque) || estoque < 0) {
    throw new ValidacaoError('O campo estoque deve ser um número inteiro maior ou igual a zero.');
  }

  return {
    nome: nome.trim(),
    categoria: categoria.trim(),
    preco: Math.round(preco * 100) / 100,
    estoque,
  };
}

async function listar(categoria) {
  if (categoria === undefined) {
    return await produtosData.listar();
  }

  if (typeof categoria !== 'string' || categoria.trim() === '') {
    throw new ValidacaoError('Informe uma categoria válida. Exemplo: /produtos?categoria=Periféricos');
  }

  return await produtosData.listarPorCategoria(categoria.trim());
}

async function buscarPorId(id) {
  validarId(id);

  const produto = await produtosData.buscarPorId(id);

  if (!produto) {
    throw new NaoEncontradoError(`Produto com ID ${id} não encontrado.`);
  }

  return produto;
}

// A UNIQUE KEY do banco é a garantia final contra nomes repetidos: se dois
// cadastros simultâneos passarem pela checagem, o MySQL recusa o segundo
// (erro ER_DUP_ENTRY) e traduzimos para um erro de conflito.
function ehNomeDuplicado(erro) {
  return erro && erro.code === 'ER_DUP_ENTRY';
}

async function cadastrar(dados) {
  const produto = validarProduto(dados);

  if (await produtosData.buscarPorNome(produto.nome)) {
    throw new ConflitoError(`Já existe um produto cadastrado com o nome "${produto.nome}".`);
  }

  try {
    return await produtosData.inserir(produto);
  } catch (erro) {
    if (ehNomeDuplicado(erro)) {
      throw new ConflitoError(`Já existe um produto cadastrado com o nome "${produto.nome}".`);
    }
    throw erro;
  }
}

async function atualizar(id, dados) {
  validarId(id);

  const produto = validarProduto(dados);

  if (!(await produtosData.buscarPorId(id))) {
    throw new NaoEncontradoError(`Produto com ID ${id} não encontrado.`);
  }

  const mesmoNome = await produtosData.buscarPorNome(produto.nome);

  if (mesmoNome && mesmoNome.id !== id) {
    throw new ConflitoError(`Já existe outro produto com o nome "${produto.nome}".`);
  }

  try {
    const atualizado = await produtosData.atualizar(id, produto);

    if (!atualizado) {
      throw new NaoEncontradoError(`Produto com ID ${id} não encontrado.`);
    }

    return atualizado;
  } catch (erro) {
    if (ehNomeDuplicado(erro)) {
      throw new ConflitoError(`Já existe outro produto com o nome "${produto.nome}".`);
    }
    throw erro;
  }
}

async function remover(id) {
  validarId(id);

  const removido = await produtosData.remover(id);

  if (!removido) {
    throw new NaoEncontradoError(`Produto com ID ${id} não encontrado.`);
  }
}

module.exports = { listar, buscarPorId, cadastrar, atualizar, remover };
