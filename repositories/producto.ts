import { AppDataSource } from "../db";
import { Producto } from "../models/producto";


export const productoRepository = AppDataSource.getRepository(Producto)