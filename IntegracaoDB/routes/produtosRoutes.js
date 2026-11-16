// ROTAS: só associam método + caminho a uma função do controller.
//
// PROTEÇÃO:
//   - router.use(autenticar): toda rota de produtos exige token válido (401).
//   - autorizar('admin'): rotas que alteram dados exigem role admin (403).

const express = require('express');
const produtosController = require('../controllers/produtosController');
const { autenticar } = require('../middlewares/autenticar');
const { autorizar } = require('../middlewares/autorizar');

const router = express.Router();

router.use(autenticar);

// Qualquer usuário autenticado pode consultar.
router.get('/', produtosController.listar);
router.get('/:id', produtosController.buscarPorId);

// Somente administradores podem cadastrar, atualizar e remover.
router.post('/', autorizar('admin'), produtosController.cadastrar);
router.put('/:id', autorizar('admin'), produtosController.atualizar);
router.delete('/:id', autorizar('admin'), produtosController.remover);

module.exports = router;
