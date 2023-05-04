import { IsNumber, IsString, IsUrl } from "class-validator"


export class ProductoDTO{
    @IsString()
    @IsUrl()
    link!: string

    @IsString()
    talla!: string

    @IsString()
    color!: string

    @IsNumber({maxDecimalPlaces:0})
    cantidad!: number

    @IsNumber()
    precioUnitario!:number

    constructor(rawProducto:any){
        this.link = rawProducto?.link
        this.talla = rawProducto?.talla
        this.color = rawProducto?.color
        this.cantidad = rawProducto?.cantidad
        this.precioUnitario = rawProducto?.precioUnitario
    }

}