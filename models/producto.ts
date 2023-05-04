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

    @Column('text')
    color!: string

    @Column('numeric')
    cantidad!: number

    @Column('float')
    precioUnitario!:number

    @ManyToOne(()=>Pedido,(pedido)=>pedido.productos,{onDelete:'CASCADE'})
    pedido!: Pedido
}