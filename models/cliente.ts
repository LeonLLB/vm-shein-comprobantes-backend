import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Pedido } from "./pedido";

@Entity({name:'clientes'})
export class Cliente{
    @PrimaryGeneratedColumn()
    id!:number

    @Column('text')
    nombre!:string

    @Column('text')
    apellido!: string

    @Column('text')
    telefono!: string

    @OneToMany(()=>Pedido,(pedido)=>pedido.cliente,{onDelete:'CASCADE'})
    pedidos!: Pedido[]
}