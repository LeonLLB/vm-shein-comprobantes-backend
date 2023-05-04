import { IsNumberString, IsString } from "class-validator"
import { Request } from "express"

export class ClienteDTO{
    @IsString()
    nombre!:string

    @IsString()
    apellido!: string

    @IsString()
    @IsNumberString()
    telefono!: string

    constructor({body}:Request){
        this.nombre = body.cliente?.nombre
        this.apellido = body.cliente?.apellido
        this.telefono = body.cliente?.telefono
    }
}