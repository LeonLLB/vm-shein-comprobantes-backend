import { BeforeInsert, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cliente } from "./cliente";
import { Producto } from "./producto";

@Entity({name:'pedidos'})
export class Pedido{
    @PrimaryGeneratedColumn()
    id!: number

    @Column('varchar',{length:10})
    fecha!: string
    
    @Column('numeric')
    horaMinutosEmision!: number

    @Column('varchar',{length:30,unique:true})
    cotizacion!: string

    @Column('bool',{default:true})
    conImpuesto!: boolean

    @ManyToOne(()=>Cliente,(cliente)=>cliente.pedidos,{cascade:true,onDelete:'CASCADE',eager:true})
    cliente!: Cliente

    @OneToMany(()=>Producto,(producto)=>producto.pedido,{cascade:true,onDelete:'CASCADE',eager:true})
    productos!: Producto[]

    @BeforeInsert()
    beforeInsert(){
        const fechaDividida = this.fecha.split('-')
        const cotizacionTmp = `VMShein-${this.cliente.nombre[0]}${this.cliente.apellido[0]}-${fechaDividida[2]}${fechaDividida[1]}${fechaDividida[0].split('20').join('')}-${this.productos.length}${this.horaMinutosEmision}`
        this.cotizacion = cotizacionTmp
    }
}