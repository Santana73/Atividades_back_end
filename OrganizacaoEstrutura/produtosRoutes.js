// ROTAS: só associam método + caminho a uma função do controller.

const express = require('express');
const produtosController = require('../controllers/produtosController');

const router = express.Router();

router.get('/', produtosController.listar);
router.get('/:id', produtosController.buscarPorId);
router.post('/', produtosController.cadastrar);
router.put('/:id', produtosController.atualizar);
router.delete('/:id', produtosController.remover);

module.exports = router;
