// DADOS: persistência. Só guarda e consulta os produtos (array em memória),
// sem validar nada e sem lançar erros de negócio.

const produtos = [
  { id: 1, nome: 'Notebook Dell Inspiron 15', categoria: 'Computadores', preco: 3499.9, estoque: 8 },
  { id: 2, nome: 'Mouse sem fio Logitech', categoria: 'Periféricos', preco: 89.9, estoque: 40 },
  { id: 3, nome: 'Teclado mecânico Redragon', categoria: 'Periféricos', preco: 249.9, estoque: 15 },
  { id: 4, nome: 'Monitor LG 24 polegadas', categoria: 'Monitores', preco: 799, estoque: 12 },
  { id: 5, nome: 'SSD Kingston 480GB', categoria: 'Armazenamento', preco: 279.9, estoque: 25 },
];

let proximoId = Math.max(0, ...produtos.map((produto) => produto.id)) + 1;

function minusculo(texto) {
  return String(texto).trim().toLowerCase();
}

function listar() {
  return [...produtos];
}

function listarPorCategoria(categoria) {
  return produtos.filter((produto) => minusculo(produto.categoria) === minusculo(categoria));
}

function buscarPorId(id) {
  return produtos.find((produto) => produto.id === id) || null;
}

function buscarPorNome(nome) {
  return produtos.find((produto) => minusculo(produto.nome) === minusculo(nome)) || null;
}

function inserir(dados) {
  const produto = { id: proximoId++, ...dados };
  produtos.push(produto);
  return produto;
}

function atualizar(id, dados) {
  const indice = produtos.findIndex((produto) => produto.id === id);
  if (indice === -1) return null;

  produtos[indice] = { id, ...dados };
  return produtos[indice];
}

function remover(id) {
  const indice = produtos.findIndex((produto) => produto.id === id);
  if (indice === -1) return null;

  const [removido] = produtos.splice(indice, 1);
  return removido;
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
