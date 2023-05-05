import { Column, TDocumentDefinitions, TableCell } from 'pdfmake/interfaces';
import { PDFDefaultOptions, printer } from './core';
import { Pedido } from '../models/pedido';
import path from 'path';

const pdfComprobanteHeaderFragment = (data:Pedido) => {	
	const [year, mes, dia] = data.fecha.split('-')
	return {
		columns: [
			{
				width: '*',
				type:'none',
				ul:[
					{
						style: ['center'],
						margin: [0, 5, 0, 5],
						bold:true,
						fontSize:14,
						text: 'Fecha de emisión',
					},
					{
						style: ['center'],
						margin: [0, 5, 0, 5],
						text: `${dia}/${mes}/${year}`,
					},
					{
						style: ['center'],
						margin: [0, 5, 0, 5],
						bold:true,
						fontSize:14,
						text: 'Cotización',
					},
					{
						style: ['center'],
						margin: [0, 5, 0, 5],
						text: data.cotizacion,
					},
				]
			},
			{
				image:path.join(__dirname,'assets','logo.jpg'),
				width: 150 ,
				height: 100,
			},
			{
				width: '*',
				type:'none',
				ul:[
					{
						style: ['center'],
						margin: [0, 5, 0, 5],
						bold:true,
						text: 'CONTACTANOS A TRAVÉS DE:',
					},
					{
						margin: [0, 5, 0, 5],
						bold:true,
						text: 'WSA y Llamadas: ' + process.env.OWNER_PHONE || 'N/A',
					},
					{
						margin: [0, 5, 0, 5],
						bold:true,
						text: 'Instagram: @venemexi.aunclik',
					},
					{
						margin: [0, 5, 0, 5],
						bold:true,
						lineHeight:1.5,
						text: "Barrancas del Orinoco Estado Monagas Calle Piar cruce con Calle Miranda",
					},
				]
				
			}
		]
	}
}

const pdfComprobanteFooterFragment = (total:number,transporte:number,porcentaje:number):{tableOnFooter:TableCell[][],enterpriseFooter:Column[]}=>{
	const impuesto = porcentaje / 100
	const totalPedido = total + impuesto + transporte

	return {
		tableOnFooter:[
			[
				{
					margin:[0,5,0,5],
					style:['center'],
					fontSize:12,
					bold:true,
					text:'TOTAL PEDIDO'
				},
				{
					margin:[0,5,0,5],
					style:['center'],
					fontSize:12,
					bold:true,
					text:'$ '+total.toFixed(2)
				}
			],
			[
				{
					margin:[0,5,0,5],
					style:['center'],
					fontSize:12,
					bold:true,
					text:'IMPUESTO COBRADO POR SHEIN '+porcentaje+'%'
				},
				{
					margin:[0,5,0,5],
					style:['center'],
					fontSize:12,
					bold:true,
					text:'$ '+(impuesto*total).toFixed(2)
				}
			],
			[
				{
					margin:[0,5,0,5],
					style:['center'],
					fontSize:12,
					bold:true,
					text:'(+) TRANSPORTE'
				},
				{
					margin:[0,5,0,5],
					style:['center'],
					fontSize:12,
					bold:true,
					text:'$ '+transporte
				}
			],
			[
				{
					margin:[0,5,0,5],
					style:['center'],
					fontSize:12,
					bold:true,
					fillColor:'#FECB00',
					color:'white',
					text:'TOTAL'
				},
				{
					margin:[0,5,0,5],
					style:['center'],
					fontSize:12,
					bold:true,
					fillColor:'#FECB00',
					color:'white',
					text:'$ '+totalPedido
				}
			],
		],
		enterpriseFooter:[
			{
				width:'*',
				type:'none',
				ul:[
					{
						style:['center'],
						marginLeft:100,
						table:{		
							widths:['auto',200],					
							body:[
								[
									{
										bold:true,
										fontSize:12,
										margin:[0,5,0,5],
										text:'ENTREGADO A:'
									},
									{
										bold:true,
										fontSize:12,
										margin:[0,5,0,5],
										text:' '
									}
								],
								[
									{
										bold:true,
										fontSize:12,
										margin:[0,5,0,5],
										text:'ENVIADO A:'
									},
									{
										bold:true,
										fontSize:12,
										margin:[0,5,0,5],
										text:' '
									}
								],
							]
						}
					}
				]
			}			
			
		]
	}
}


export const genComprobante = (data: Pedido): Promise<any> => {
	const defDoc = PDFDefaultOptions();
	const header = pdfComprobanteHeaderFragment(data)
	let total = 0
	data.productos.forEach(({precioUnitario,cantidad})=>{total+=precioUnitario*cantidad})
	const {tableOnFooter,enterpriseFooter} = pdfComprobanteFooterFragment(total,10,5)
	
	return new Promise((res) => {
		const doc: TDocumentDefinitions = {
			...defDoc,
			content: [
				header as any,
				{
					margin:[0,10,0,10],
					table:{
						widths:['auto','*'],
						body:[
							[
								{
									style: ['center'],
									margin: [0, 5, 0, 5],
									bold:true,
									fontSize:10,
									color:'blue',
									text: 'CLIENTE',
								},
								{
									margin: [0, 5, 0, 5],
									bold:true,
									fontSize:10,
									text: (`${data.cliente.nombre} ${data.cliente.apellido}`).toUpperCase(),
								}
							],[
								{
									style: ['center'],
									margin: [0, 5, 0, 5],
									bold:true,
									fontSize:10,
									color:'blue',
									text: 'TELEFONO',
								},
								{
									margin: [0, 5, 0, 5],
									bold:true,
									fontSize:10,
									text: data.cliente.telefono,
								}
							]
						]
					}
				},
				{
					table: {
						headerRows: 1,
						widths: ['*', '*', '*', '*', '*'],
						body: [
							[
								{
									style: ['center'],
									margin: [0, 5, 0, 5],
									text: 'LINK',
								},
								{
									style: ['center'],
									margin: [0, 5, 0, 5],
									text: 'TALLA',
								},
								{
									style: ['center'],
									margin: [0, 5, 0, 5],
									text: 'CANT',
								},
								{
									style: ['center'],
									margin: [0, 5, 0, 5],
									text: 'P.UNIT',
								},
								{
									style: ['center'],
									margin: [0, 5, 0, 5],
									text: 'TOTAL',
								},
							],
							
						],
					},
				},
				{
					margin:[0,5,0,5],
					table:{
						widths:['*','auto'],
						body:tableOnFooter
					}
				},
				{
					margin:[0,5,0,5],
					style:['center'],
					columns:enterpriseFooter,
				}
			],
		};

		data.productos.forEach(producto=>{
			const totalProducto = producto.cantidad*producto.precioUnitario;
			(doc.content as any)[2].table.body.push([
				{
          style: ['center','link'],
          margin: [0, 5, 0, 5],
          text: producto.link,
          link: producto.link,
        },
        {
          style: ['center'],
          margin: [0, 5, 0, 5],
          text: producto.talla,
        },
        {
          style: ['center'],
          margin: [0, 5, 0, 5],
          text: producto.cantidad,
        },
        {
					style: ['center'],
          margin: [0, 5, 0, 5],
          text: '$ '+ producto.precioUnitario,
        },
        {
					style: ['center'],
          margin: [0, 5, 0, 5],
          text: '$ '+ totalProducto,
        },
			])
		})
		
		const PDF = printer.createPdfKitDocument(doc);
		const chunks: any[] = [];
		PDF.on('data', (chunk: any) => chunks.push(chunk));
		PDF.on('end', () => {
			res(chunks);
		});
		PDF.end();
	});
};