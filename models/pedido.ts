import { BeforeInsert, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cliente } from "./cliente";
import { Producto } from "./producto";

@Entity({name:'pedidos'})
export class Pedido{
    @PrimaryGeneratedColumn()
    id!: string

    @Column('varchar',{length:10})
    fecha!: string

    @Column('varchar',{length:24,unique:true})
    cotizacion!: string

    @ManyToOne(()=>Cliente,(cliente)=>cliente.pedidos,{cascade:true,onDelete:'CASCADE'})
    cliente!: Cliente

    @OneToMany(()=>Producto,(producto)=>producto.pedido,{cascade:true,onDelete:'CASCADE'})
    productos!: Producto[]

    @BeforeInsert()
    beforeInsert(){
        this.cotizacion = `VMShein-${this.cliente.nombre[0]}${this.cliente.apellido[0]}-${this.fecha.split('/').join('')}-${this.id}`
    }
}