import {Request, Response} from 'express'
import { Pedido } from '../models/pedido'
import { validateOrReject } from 'class-validator'
import { PedidoDTO } from '../dto/pedido'

class PedidoController{

    async registrar(req: Request,res: Response){
        
        try {
            const pedido = new PedidoDTO(req)
            await validateOrReject(pedido)
        } catch (errors) {
            console.log(errors)
            return res.status(500).send(errors)
        }

        return res.status(200).send({
            message:'All ok!'
        })
        
    }

}

export const pedidoController = new PedidoController()