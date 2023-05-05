const PdfPrinter = require('pdfmake');
import * as path from 'path';
import {
  PageOrientation,
  PageSize,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';

export const printer = new PdfPrinter({
  Courier: {
    normal: 'Courier',
    bold: 'Courier-Bold',
    italics: 'Courier-Oblique',
    bolditalics: 'Courier-BoldOblique',
  },
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique',
  },
  Times: {
    normal: 'Times-Roman',
    bold: 'Times-Bold',
    italics: 'Times-Italic',
    bolditalics: 'Times-BoldItalic',
  },
  Symbol: {
    normal: 'Symbol',
  },
  ZapfDingbats: {
    normal: 'ZapfDingbats',
  },
});

export const defaultLayout = {
  hLineWidth: function (i:any, node:any) {
    return i === 0 || i === node.table.body.length ? 2 : 1;
  },
  vLineWidth: function (i:any, node:any) {
    return i === 0 || i === node.table.widths.length ? 2 : 1;
  },
  hLineColor: function (i:any, node:any) {
    return i === 0 || i === node.table.body.length ? 'black' : 'gray';
  },
  vLineColor: function (i:any, node:any) {
    return i === 0 || i === node.table.widths.length ? 'black' : 'gray';
  },
};

export const PDFDefaultOptions = (
  pageOrientation: PageOrientation = 'portrait',
  pageSize: PageSize = 'LETTER',
): TDocumentDefinitions => ({
  pageSize: pageSize,
  pageOrientation: pageOrientation,
  defaultStyle: {
    font: 'Helvetica',
    fontSize: 9,
  },
  styles: {
    center: {
      alignment: 'center',
    },
    tabla: {
      margin: [0, 5, 0, 15],
    },
    link:{
        color:'blue',
        decorationColor:'blue',
        decoration:'underline'
    },

  },
  content: [],
});