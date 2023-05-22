import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Pedido } from "./pedido";

@Entity({name:'productos'})
export class Producto{

    @PrimaryGeneratedColumn()
    id!: number

    @Column('text')
    link!: string

    @Column('text')
    talla!: string

    @Column('numeric')
    cantidad!: number

    @Column('float')
    precioUnitario!:number

    @Column('float',{default:2})
    envioUnitario!:number

    @Column('text',{default:''})
    nombre!: string

    @ManyToOne(()=>Pedido,(pedido)=>pedido.productos,{onDelete:'CASCADE'})
    pedido!: Pedido
}