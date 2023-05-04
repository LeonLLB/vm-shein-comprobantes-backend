import { DataSource } from "typeorm";
import { Cliente } from "./models/cliente";
import { Producto } from "./models/producto";
import { Pedido } from "./models/pedido";

export const AppDataSource = new DataSource({
    type:'postgres',
    url:process.env.DB_URL,
    synchronize:true,
    entities:[
        Cliente,
        Producto,
        Pedido
    ],
})
