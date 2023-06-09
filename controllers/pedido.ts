import { Request, Response } from 'express'
import { validateOrReject } from 'class-validator'
import { PedidoDTO } from '../dto/pedido'
import { pedidoService } from '../services/pedido'
import { Pedido } from '../models/pedido'

const getError = (error: Error) => {

    const decompiledError: { status: number, message: string, name: string } = JSON.parse(error.message)

    if (!decompiledError.status && !decompiledError.message && !decompiledError.name) {
        throw error
    }

    return decompiledError
}

class PedidoController {


    async registrar(req: Request, res: Response) {

        const pedidoDto = new PedidoDTO(req)

        try {
            await validateOrReject(pedidoDto)
        } catch (errors) {
            return res.status(400).send(errors)
        }

        try {
            await pedidoService.create(pedidoDto)
        } catch (error:any) {

            if((error as Error).message.includes('duplic')){
                return res.status(400).send({
                    status: 400,
                    message: 'Ya existe ese registro',
                    name: 'Bad Request'
                })
            }

            console.log(error)
            return res.status(500).send({
                status: 500,
                message: 'Hubo un error en el servidor al crear el pedido',
                name: 'Internal Server Error'
            })
        }

        return res.status(200).send({
            message: 'All ok!'
        })

    }

    async actualizar(req: Request, res: Response) {

        const { queryParam } = req.params
        const pedidoDto = new PedidoDTO(req)

        try {
            await validateOrReject(pedidoDto)
        } catch (errors) {
            return res.status(400).send(errors)
        }

        let updateError

        if (isNaN(+queryParam)) {
            updateError = await pedidoService.update(queryParam, pedidoDto)
        } else {
            updateError = await pedidoService.update(+queryParam, pedidoDto)
        }


        if (updateError) {
            try {
                const errorObject = getError(updateError)
                return res.status(errorObject.status).send(errorObject)
            } catch (error: any) {
                return res.status(500).send({
                    status: 500,
                    message: error.message,
                    name: 'Internal Server error'
                })
            }
        }

        return res.status(200).send({
            message: 'All ok!'
        })

    }

    async eliminar(req: Request, res: Response) {
        const { queryParam } = req.params

        let deleteError

        if (isNaN(+queryParam)) {
            deleteError = await pedidoService.delete(queryParam)
        } else {
            deleteError = await pedidoService.delete(+queryParam)
        }

        if (deleteError) {
            try {
                const errorObject = getError(deleteError)
                return res.status(errorObject.status).send(errorObject)
            } catch (error: any) {
                return res.status(500).send({
                    status: 500,
                    message: error.message,
                    name: 'Internal Server error'
                })
            }
        }

        return res.status(200).send({
            message: 'All ok!'
        })
    }

    async consultarPedidos(req: Request, res: Response) {

        try {
            return res.status(200).send(await pedidoService.getPedidos())
        } catch (error: any) {
            const errorObject = getError(error)
            return res.status(errorObject.status).send(errorObject)
        }

    }
    async consultarPedido(req: Request, res: Response) {

        const { queryParam } = req.params

        let pedido: Pedido

        try {
            if (isNaN(+queryParam)) {
                pedido = await pedidoService.getPedido(queryParam)
            } else {
                pedido = await pedidoService.getPedido(+queryParam)
            }
        } catch (error:any) {
            try {
                console.log(error)
                const errorObject = getError(error)
                return res.status(errorObject.status).send(errorObject)
            } catch (error: any) {
                return res.status(500).send({
                    status: 500,
                    message: error.message,
                    name: 'Internal Server error'
                })
            }
        }


        return res.status(200).send(pedido)

    }

    async emitirComprobante(req: Request, res: Response) {
        const { queryParam } = req.params

        let comprobanteBuffers

        try {
            if (isNaN(+queryParam)) {
                comprobanteBuffers = await pedidoService.prepareComprobante(queryParam)
            } else {
                comprobanteBuffers = await pedidoService.prepareComprobante(+queryParam)
            }
        } catch (error:any) {
            try {
                console.log(error)
                const errorObject = getError(error)
                return res.status(errorObject.status).send(errorObject)
            } catch (error: any) {
                return res.status(500).send({
                    status: 500,
                    message: error.message,
                    name: 'Internal Server error'
                })
            }
        }
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', `attachment; filename="comprobante-${queryParam}.pdf"`)
        return res.status(200).send(Buffer.concat(comprobanteBuffers))
    }

}

export const pedidoController = new PedidoController()