import { Pedido } from "../models/pedido";
import { genComprobante } from "../templates/comprobante";


class PDFPedidoService{

    async generateComprobante(pedido:Pedido){
        return await genComprobante(pedido)
    }

}

export const pdfPedidoService = new PDFPedidoService()