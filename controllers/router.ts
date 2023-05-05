import express from 'express'
import { pedidoController } from './pedido'

const router = express.Router()

router.post('/registrar-pedido',pedidoController.registrar)
router.put('/editar-pedido/:queryParam',pedidoController.actualizar)
router.delete('/eliminar-pedido/:queryParam',pedidoController.eliminar)
router.get('/comprobante/:queryParam',pedidoController.emitirComprobante)
router.get('/pedido/:queryParam',pedidoController.consultarPedido)
router.get('/pedidos',pedidoController.consultarPedidos)

export default router