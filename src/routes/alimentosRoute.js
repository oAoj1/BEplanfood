const express = require('express')
const router = express.Router()
const alimentosController = require('../controllers/alimentosController.js')

router.get('/alimentos/filtrar',alimentosController.filtrarAlimentos) 
router.get('/alimentos', alimentosController.lerAlimentos)
router.get('/alimentos/:id',alimentosController.lerAlimentoID)
router.post('/alimentos',alimentosController.criarAlimento)
router.put('/alimentos/:id',alimentosController.editarAlimento)
router.delete('/alimentos/:id',alimentosController.deletarAlimento)

module.exports = router