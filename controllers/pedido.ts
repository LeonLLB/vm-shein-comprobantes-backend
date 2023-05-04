import {Request, Response} from 'express'
import { Pedido } from '../models/pedido'
import { validateOrReject } from 'class-validator'
import { PedidoDTO } from '../dto/pedido'
import { pedidoRepository } from '../repositories/pedido'
import { clienteRepository } from '../repositories/cliente'
import { productoRepository } from '../repositories/producto'

class PedidoController{

    async registrar(req: Request,res: Response){
        
        const pedidoDto = new PedidoDTO(req)

        try {
            await validateOrReject(pedidoDto)
        } catch (errors) {
            return res.status(400).send(errors)
        }

        const pedido = pedidoRepository.create({
            fecha: pedidoDto.fecha,
            horaMinutosEmision:pedidoDto.horaMinutosEmision,
            cliente: clienteRepository.create(pedidoDto.cliente),
            productos: pedidoDto.productos.map(producto=>{
                return productoRepository.create(producto)
            })
        })


        await pedidoRepository.save(pedido)

        return res.status(200).send({
            message:'All ok!',
            pedido
        })
        
    }

}

export const pedidoController = new PedidoController()