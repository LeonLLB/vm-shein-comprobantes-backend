import { AppDataSource } from "../db";
import { PedidoDTO } from "../dto/pedido";
import { Cliente } from "../models/cliente";
import { Pedido } from "../models/pedido";
import { Producto } from "../models/producto";
import { clienteRepository } from "../repositories/cliente";
import { pedidoRepository } from "../repositories/pedido";
import { productoRepository } from "../repositories/producto";


class PedidoService{

    private genError(status: number, message: string, name = 'Error'){
        return new Error(JSON.stringify({status,message,name}))
    }

    async create(dto: PedidoDTO):Promise<Pedido>{
        const pedido = pedidoRepository.create({
            fecha: dto.fecha,
            horaMinutosEmision:dto.horaMinutosEmision,
            cliente: clienteRepository.create(dto.cliente),
            productos: dto.productos.map(producto=>{
                return productoRepository.create(producto)
            })
        })

        await pedidoRepository.save(pedido)

        return pedido
    }

    async update(queryParam:number | string,dto:PedidoDTO):Promise<Error | null>{
        const pedidoViejo = await pedidoRepository.findOneBy(
            isNaN(+queryParam) ? {cotizacion:queryParam as string} : {id:+queryParam}
        )
        if(!pedidoViejo) return this.genError(404,'No existe ese pedido','Not Found')

        const queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            await queryRunner.manager.update(Cliente,{id:pedidoViejo.cliente.id},{...dto.cliente})
        
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

}

export const pedidoService = new PedidoService()