import { AppDataSource } from "../db";
import { Pedido } from "../models/pedido";


export const pedidoRepository = AppDataSource.getRepository(Pedido)