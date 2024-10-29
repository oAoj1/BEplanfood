const express = require('express')
const router = express.Router()
const refeicoesController = require('../controllers/refeicoesController.js')

/* REFEICOES */
router.get('/refeicoes/hoje',refeicoesController.lerRefeicoesHoje)
router.get('/refeicoes/agora',refeicoesController.lerRefeicaoAgora)
router.get('/refeicoes', refeicoesController.lerRefeicoes)
router.get('/refeicoes/:dia', refeicoesController.filtrarRefeicoes)
router.get('/refeicoes/:id', refeicoesController.lerRefeicoesID)
router.post('/refeicoes', refeicoesController.criarRefeicoes)
router.delete('/refeicoes/:id', refeicoesController.deletarRefeicoes)

/* ALIMENTOS */
router.post('/refeicoes/:idRefeicao/alimentos/:idAlimento',refeicoesController.criarAlimentoEmRefeicao)
router.put('/refeicoes/:idRefeicao/alimentos/:idAlimento',refeicoesController.atualizarAlimentoEmRefeicao)
router.delete('/refeicoes/:idRefeicao/alimentos/:idAlimento',refeicoesController.deletarAlimentoEmRefeicao)

module.exports = router