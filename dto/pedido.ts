import {Request} from 'express'
import { ArrayMinSize, IsArray, IsDate, IsDateString, MinLength, ValidateNested } from "class-validator"
import { ClienteDTO } from "./cliente"
import { ProductoDTO } from "./producto"

export class PedidoDTO{
    @IsDateString()
    fecha!: string

    @ValidateNested()
    cliente!: ClienteDTO

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested()
    productos!: ProductoDTO[]   

    constructor(req:Request){
        this.fecha = req.body.fecha
        this.cliente = new ClienteDTO(req)
        this.productos = req.body.productos?.map((producto:any)=>{
            return new ProductoDTO(producto)
        })
    }
}