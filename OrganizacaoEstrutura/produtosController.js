// CONTROLLER: lê params, query e body da requisição, chama o service
// e envia a resposta. Erros seguem para o middleware de tratamento.

const produtosService = require('../services/produtosService');

function listar(req, res, next) {
  try {
    const categoria = req.query.categoria;
    const produtos = produtosService.listar(categoria);
    res.json(produtos);
  } catch (erro) {
    next(erro);
  }
}

function buscarPorId(req, res, next) {
  try {
    const id = Number(req.params.id);
    const produto = produtosService.buscarPorId(id);
    res.json(produto);
  } catch (erro) {
    next(erro);
  }
}

function cadastrar(req, res, next) {
  try {
    const produto = produtosService.cadastrar(req.body);
    res.status(201).json(produto);
  } catch (erro) {
    next(erro);
  }
}

function atualizar(req, res, next) {
  try {
    const id = Number(req.params.id);
    const produto = produtosService.atualizar(id, req.body);
    res.json(produto);
  } catch (erro) {
    next(erro);
  }
}

function remover(req, res, next) {
  try {
    const id = Number(req.params.id);
    produtosService.remover(id);
    res.status(204).send();
  } catch (erro) {
    next(erro);
  }
}

module.exports = { listar, buscarPorId, cadastrar, atualizar, remover };
