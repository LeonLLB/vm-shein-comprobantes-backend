import { AppDataSource } from "../db";
import { Cliente } from "../models/cliente";


export const clienteRepository = AppDataSource.getRepository(Cliente)