import { Column, TDocumentDefinitions, TableCell } from 'pdfmake/interfaces';
import { PDFDefaultOptions, printer } from './core';
import { Pedido } from '../models/pedido';
import logoBase64 from './logo-base64'

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
				image: logoBase64,
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

const pdfComprobanteFooterFragment = (subTotal:number,transporte:number,porcentaje:number):{tableOnFooter:TableCell[][],enterpriseFooter:Column[]}=>{
	const impuesto = porcentaje / 100
	const totalPedido = subTotal + (impuesto * subTotal) + transporte

	return {
		tableOnFooter:[
			[
				{
					margin:[0,5,0,5],
					style:['center'],
					fontSize:8,
					bold:true,
					text:'SUB-TOTAL'
				},
				{
					margin:[0,5,0,5],
					style:['center'],
					fontSize:8,
					bold:true,
					text:'$ '+subTotal.toFixed(2)
				}
			],
			[
				{
					margin:[0,5,0,5],
					style:['center'],
					fontSize:8,
					bold:true,
					text:'IMPUESTO COBRADO POR SHEIN '+porcentaje+'%'
				},
				{
					margin:[0,5,0,5],
					style:['center'],
					fontSize:8,
					bold:true,
					text:'$ '+(impuesto*subTotal).toFixed(2)
				}
			],
			[
				{
					margin:[0,5,0,5],
					style:['center'],
					fontSize:8,
					bold:true,
					text:'(+) TRANSPORTE'
				},
				{
					margin:[0,5,0,5],
					style:['center'],
					fontSize:8,
					bold:true,
					text:'$ '+transporte
				}
			],
			[
				{
					margin:[0,5,0,5],
					style:['center'],
					fontSize:8,
					bold:true,
					fillColor:'#FECB00',
					color:'white',
					text:'TOTAL'
				},
				{
					margin:[0,5,0,5],
					style:['center'],
					fontSize:8,
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
							dontBreakRows:true,		
							widths:['auto',200],					
							body:[
								[
									{
										bold:true,
										fontSize:8,
										margin:[0,5,0,5],
										text:'ENTREGADO A:'
									},
									{
										bold:true,
										fontSize:8,
										margin:[0,5,0,5],
										text:' '
									}
								],
								[
									{
										bold:true,
										fontSize:8,
										margin:[0,5,0,5],
										text:'ENVIADO A:'
									},
									{
										bold:true,
										fontSize:8,
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


export const genComprobante = (dataT: Pedido): Promise<any> => {
	const defDoc = PDFDefaultOptions();
	
	const data:Pedido={
		...dataT,
		productos:[],
		beforeInsert(){}
	}
	for (let i = 0; i < 10; i++) {
		data.productos.push(dataT.productos[0])		
	}
	const header = pdfComprobanteHeaderFragment(data)
	let total = 0;
	let transporte = 0;
	data.productos.forEach(({precioUnitario,envioUnitario,cantidad})=>{transporte+=envioUnitario*cantidad;total+=precioUnitario*cantidad})
	const {tableOnFooter,enterpriseFooter} = pdfComprobanteFooterFragment(total,transporte,5)
	
	return new Promise((res) => {
		const doc: TDocumentDefinitions = {
			...defDoc,
			footer:function(currentPage, pageCount) {
				return pageCount === 1 ? undefined : {
					text:`Página ${currentPage} de ${pageCount}\n\nCOD: ${data.cotizacion}`,
					alignment:'center',
				}
			},
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
									fontSize:8,
									color:'blue',
									text: 'CLIENTE',
								},
								{
									margin: [0, 5, 0, 5],
									bold:true,
									fontSize:8,
									text: (`${data.cliente.nombre} ${data.cliente.apellido}`).toUpperCase(),
								}
							],[
								{
									style: ['center'],
									margin: [0, 5, 0, 5],
									bold:true,
									fontSize:8,
									color:'blue',
									text: 'TELEFONO',
								},
								{
									margin: [0, 5, 0, 5],
									bold:true,
									fontSize:8,
									text: data.cliente.telefono,
								}
							]
						]
					}
				},
				{
					table: {
						dontBreakRows:true,
						headerRows: 1,
						widths: [150, 'auto','auto', '*', '*', '*','*'],
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
									text: 'SUBTOTAL',
								},
								{
									style: ['center'],
									margin: [0, 5, 0, 5],
									text: 'ENVÍO',
								},
								{
									style: ['center'],
									bold:true,
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
						dontBreakRows:true,
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
			const subTotalProducto = producto.cantidad*producto.precioUnitario;
			const envioTotalProducto = producto.cantidad*producto.envioUnitario;
			const totalProducto = subTotalProducto+envioTotalProducto;
			(doc.content as any)[2].table.body.push([
				{
          style: ['center','link'],
          margin: [0, 5, 0, 5],
		  fontSize:8,
		  lineHeight:1.25,
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
		  text: '$ '+ subTotalProducto,
		},
		{
		  style: ['center'],
		  margin: [0, 5, 0, 5],
		  text: '$ '+envioTotalProducto,
		},
		{
		  style: ['center'],
		  margin: [0, 5, 0, 5],
		  text: '$ '+totalProducto,
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