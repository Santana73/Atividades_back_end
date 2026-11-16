// CONTROLLER: lê params, query e body da requisição, chama o service
// (com await, pois o banco é assíncrono) e envia a resposta. Erros seguem para o middleware de tratamento.

const produtosService = require('../services/produtosService');

async function listar(req, res, next) {
  try {
    const categoria = req.query.categoria;
    const produtos = await produtosService.listar(categoria);
    res.json(produtos);
  } catch (erro) {
    next(erro);
  }
}

async function buscarPorId(req, res, next) {
  try {
    const id = Number(req.params.id);
    const produto = await produtosService.buscarPorId(id);
    res.json(produto);
  } catch (erro) {
    next(erro);
  }
}

async function cadastrar(req, res, next) {
  try {
    const produto = await produtosService.cadastrar(req.body);
    res.status(201).json(produto);
  } catch (erro) {
    next(erro);
  }
}

async function atualizar(req, res, next) {
  try {
    const id = Number(req.params.id);
    const produto = await produtosService.atualizar(id, req.body);
    res.json(produto);
  } catch (erro) {
    next(erro);
  }
}

async function remover(req, res, next) {
  try {
    const id = Number(req.params.id);
    await produtosService.remover(id);
    res.status(204).send();
  } catch (erro) {
    next(erro);
  }
}

module.exports = { listar, buscarPorId, cadastrar, atualizar, remover };
