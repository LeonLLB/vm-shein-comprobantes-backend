import { IsNumber, IsString, IsUrl } from "class-validator"


export class ProductoDTO{
    @IsString()
    @IsUrl()
    link!: string

    @IsString()
    talla!: string

    @IsNumber({maxDecimalPlaces:0})
    cantidad!: number

    @IsNumber()
    precioUnitario!:number

    @IsNumber()
    envioUnitario!:number

    constructor(rawProducto:any){
        this.link = rawProducto?.link
        this.talla = rawProducto?.talla
        this.cantidad = rawProducto?.cantidad
        this.precioUnitario = rawProducto?.precioUnitario
        this.envioUnitario = rawProducto?.envioUnitario
    }

}