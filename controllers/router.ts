import express from 'express'
import { pedidoController } from './pedido'

const router = express.Router()

router.post('/registrar-pedido',pedidoController.registrar)

export default router