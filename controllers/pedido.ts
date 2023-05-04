import {Request, Response} from 'express'
import { validateOrReject } from 'class-validator'
import { PedidoDTO } from '../dto/pedido'
import { pedidoService } from '../services/pedido'

const getError = (error:Error)=>{

    const decompiledError: {status:number,message:string,name:string} = JSON.parse(error.message)

    if(!decompiledError.status && !decompiledError.message && !decompiledError.name ){
        throw error
    }

    return decompiledError
}

class PedidoController{


    async registrar(req: Request,res: Response){
        
        const pedidoDto = new PedidoDTO(req)

        try {
            await validateOrReject(pedidoDto)
        } catch (errors) {
            return res.status(400).send(errors)
        }

        const pedido = await pedidoService.create(pedidoDto)

        return res.status(200).send({
            message:'All ok!',
            pedido
        })
        
    }

    async actualizar(req:Request,res:Response){

        const {queryParam} = req.params
        const pedidoDto = new PedidoDTO(req)

        try {
            await validateOrReject(pedidoDto)
        } catch (errors) {
            return res.status(400).send(errors)
        }

        let updateError

        if(isNaN(+queryParam)){
            updateError = await pedidoService.update(queryParam,pedidoDto)
        } else {
            updateError = await pedidoService.update(+queryParam,pedidoDto)
        }

        
        if(updateError){
            try {
                const errorObject = getError(updateError)
                return res.status(errorObject.status).send(errorObject)
            } catch (error:any) {
                return res.status(500).send({
                    status:500,
                    message:error.message,
                    name:'Internal Server error'
                })
            }
        }

        return res.status(200).send({
            message:'All ok!'
        })

    }

    async eliminar(req:Request,res:Response){

    }

    async consultarPedidos(req:Request,res:Response){

    }

    async emitirComprobante(req:Request,res:Response){

    }

}

export const pedidoController = new PedidoController()