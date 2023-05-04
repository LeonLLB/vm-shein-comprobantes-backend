import express from 'express'
import { pedidoController } from './pedido'

const router = express.Router()

router.post('/registrar-pedido',pedidoController.registrar)
router.put('/editar-pedido/:queryParam',pedidoController.actualizar)

export default router