import { AppDataSource } from "../db";
import { PedidoDTO } from "../dto/pedido";
import { Cliente } from "../models/cliente";
import { Pedido } from "../models/pedido";
import { Producto } from "../models/producto";
import { clienteRepository } from "../repositories/cliente";
import { pedidoRepository } from "../repositories/pedido";
import { productoRepository } from "../repositories/producto";
import { pdfPedidoService } from "./pdf";


class PedidoService{

    private genError(status: number, message: string, name = 'Error'){
        return new Error(JSON.stringify({status,message,name}))
    }

    private async prepareQueryRunner(){
        const queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        return queryRunner
    }
    
    async create(dto: PedidoDTO):Promise<Pedido>{
        const pedido = pedidoRepository.create({
            fecha: dto.fecha,
            horaMinutosEmision:dto.horaMinutosEmision,
            cliente: clienteRepository.create(dto.cliente),
            conImpuesto: dto.conImpuesto,
            productos: dto.productos.map(producto=>{
                return productoRepository.create(producto)
            })
        })

        await pedidoRepository.save(pedido)
        
        return pedido
    }

    async getPedido(queryParam:string|number){
        const pedido = await pedidoRepository.findOneBy(
            isNaN(+queryParam) ? {cotizacion:queryParam as string} : {id:+queryParam}
        )
        if(!pedido) throw this.genError(404,'No existe ese pedido','Not Found')
        return pedido
    }

    async getPedidos(){
        const pedidos = await pedidoRepository.find()
        if(pedidos.length === 0) throw this.genError(404,'No existen pedidos','Not Found')
        return pedidos
    }

    async update(queryParam:number | string,dto:PedidoDTO):Promise<Error | null>{
        let pedidoViejo: Pedido

        try {
            pedidoViejo = await this.getPedido(queryParam)
        } catch (error: any) {
            return error
        }

        const queryRunner = await this.prepareQueryRunner()

        try {
            await queryRunner.manager.update(Cliente,{id:pedidoViejo.cliente.id},{...dto.cliente})

            await queryRunner.manager.update(Pedido,{id:pedidoViejo.id},{conImpuesto:dto.conImpuesto})
        
            await queryRunner.manager.delete(Producto,{pedido: pedidoViejo.id})
        
            for (const producto of dto.productos) {
                await queryRunner.manager.save(Producto,{
                    ...producto,
                    pedido:pedidoViejo
                })
            
            }
        
            await queryRunner.commitTransaction()
            await queryRunner.release()
            return null
            
        } catch (error: any) {
            await queryRunner.rollbackTransaction()
            await queryRunner.release()
            return error
        }

    }

    async delete(queryParam: number | string):Promise<Error|null>{
        let pedidoViejo: Pedido

        try {
            pedidoViejo = await this.getPedido(queryParam)
        } catch (error: any) {
            return error
        }

        const queryRunner = await this.prepareQueryRunner()

        try {
            await queryRunner.manager.delete(Cliente,{id:pedidoViejo.cliente.id})
        
            await queryRunner.manager.delete(Pedido,{id:pedidoViejo.id})
        
            await queryRunner.commitTransaction()
            await queryRunner.release()
            return null
            
        } catch (error: any) {
            await queryRunner.rollbackTransaction()
            await queryRunner.release()
            return error
        }
    }

    async prepareComprobante(queryParam:string|number){
        const pedido = await this.getPedido(queryParam)
        
        const comprobante = await pdfPedidoService.generateComprobante(pedido)
        return comprobante
    }

}

export const pedidoService = new PedidoService()