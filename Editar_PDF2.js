import { PDFDocument, rgb, degrees } from 'pdf-lib'
import moment from 'moment';
import fs from 'fs';

import fontkit from '@pdf-lib/fontkit'
// import { Canvas } from "canvas"
import QRCode from 'qrcode'

import cmd from 'node-cmd'
// NO USAR I Ñ O Q
let s = 'ABCDEFGHJKLNPRSTUVWXYZ'

let rand = Math.floor(Math.random() * (9898 - 3747 + 1) + 1247);

const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function translate_color(color) {
  let new_color = color.toLowerCase().replace("\n", "").trim()

  switch (new_color) {
    case 'negro':
      return 'BLACK'
    case 'negra':
      return 'BLACK'
    case 'blanco':
      return 'WHITE'
    case 'blanca':
      return 'WHITE'
    case 'roja':
      return 'RED'
    case 'rojo':
      return 'RED'
    case 'azul':
      return 'BLUE'
    case 'verde':
      return 'GREEN'
    case 'amarilla':
      return 'YELLOW'
    case 'amarillo':
      return 'YELLOW'
    case 'naranja':
      return 'ORANGE'
    case 'anaranjado':
      return 'ORANGE'
    case 'anaranjada':
      return 'ORANGE'
    case 'marron':
      return 'BROWN'
    case 'gris':
      return 'GRAY'
    case 'dorado':
      return 'GOLD'
    case 'dorada':
      return 'GOLD'
    default:
      return new_color.toUpperCase()
  }

}


function draw_spaced(text, x, y, font, size, space, vert, color = rgb(0, 0, 0), rotate = 0) {

  for (const c in text) {
    console.log(y + (c * space))
    console.log(text[c])
    if (vert) {
      pages[0].drawText(text[c], {
        y: y + (c * space),
        x: x,
        size: size,
        font: font,
        rotate: degrees(rotate),
        color: color,
      })
    }
    else {
      pages[0].drawText(text[c], {
        y: y,
        x: x + (c * space),
        size: size,
        font: font,
        rotate: degrees(rotate),
        color: color,
      })
    }
  }
}

let letter = s[Math.floor(Math.random() * (22 + 1))];

let TAG = (rand + letter + (Math.floor(Math.random() * 99) + 1));
// TAG = "7359T07"

let output_name = TAG + ','


let VIN = `WBA7T2C02LGL17252 
`
let YEAR = `2020        

`
let MAKE_COMPLETO = `BMW 
`

let MAKE = `  BMW  
`
let COLOR = `NEGRO       
`
let NAME = `Maria Gutierrez
`
let DIRECCION = `2727 Pawnee rd |Waukegan il|60087
`

let MODEL = `  740
`
let BODY = `ll
`
let MINOR = `
`

let DEALER_NUMBER = "P163915"
let DEALER = "RDG ENTERPRISES LLC"
let COUNTY = 227

COLOR = translate_color(COLOR)
MINOR = translate_color(MINOR)

NAME = removeAccents(NAME)
DIRECCION = removeAccents(DIRECCION)

let date_ISS = moment().subtract(23, 'days')
let ISSUE = date_ISS.format("MMM DD, YYYY");
console.log(ISSUE)
// let ISSUE = "SEP 28, 2022";

let date_EXP = date_ISS.clone().add(2, 'months').add(1, 'days')
let EXP = date_EXP.format("MMM DD,YYYY");
// let EXP = "NOV 27, 2022";


MAKE = MAKE.toUpperCase().replace("\n", "").trim().substring(0, 4);

const CREATED_QR = new Date(Date.parse(ISSUE)).toLocaleDateString("en-US")
const EXPIRATION_QR = new Date(Date.parse(EXP)).toLocaleDateString("en-US")

let QR = `VIN: ${VIN.toUpperCase().replace("\n", "").trim()}
YEAR: ${YEAR.replace("\n", "").trim()}
MAKE: ${MAKE.toUpperCase().replace("\n", "").trim()}
`
if (MINOR.replace("\n", "").trim() == '') {
  QR = QR + `COLOR: ${COLOR.toUpperCase().replace("\n", "").trim()}
`
}
else {
  QR = QR + `MAJOR COLOR: ${COLOR.toUpperCase().replace("\n", "").trim()}
MINOR COLOR: ${MINOR.toUpperCase().replace("\n", "").trim()}
` }

QR = QR + `TAG #: ${TAG.toUpperCase().replace("\n", "").trim()}
CREATED: ${CREATED_QR}
EXPIRATION: ${EXPIRATION_QR}
`




async function fillForm(OUTPUT) {
  let base = "base41.pdf"
  let rotate = 0
  let indice = 0
  const file = await fs.readFileSync("bases/" + base)
  const generateQR = async text => {
    try {
      return await QRCode.toDataURL(text, { margin: 0, errorCorrectionLevel: 'l' })
    } catch (err) {
      console.error(err)
    }
  }
  const dataurl = await generateQR(QR)
  let heigh = 28
  const pdfDoc = await PDFDocument.load(file)
  pdfDoc.registerFontkit(fontkit)

  const qr_i = await pdfDoc.embedPng(dataurl)
  const font = await pdfDoc.embedFont(fs.readFileSync('bases/arialbd.ttf'), { subset: true, customName: "Arial" })
  const courier = await pdfDoc.embedFont(fs.readFileSync('bases/cour.ttf'), { subset: true, customName: "Courier New" })

  const pages = pdfDoc.getPages()


  // PRIMERA PAGINA
  pages[0].drawText(VIN.toUpperCase().replace("\n", "").trim(), {
    y: 312, // + -> , - <-
    x: 1200,
    size: 45.06,
    font: font,
    rotate: degrees(rotate),
    color: rgb(0, 0, 0),
  })

  pages[0].drawText(DEALER.toUpperCase().replace("\n", "").trim(), {
    y: 312 - 60, // + -> , - <-
    x: 1200 - 58,
    size: 45.06,
    font: font,
    rotate: degrees(rotate),
    color: rgb(0, 0, 0),
  })

  pages[0].drawText(YEAR.toUpperCase().replace("\n", "").trim(), {
    y: 298,
    x: 55,
    size: 61.30,
    font: font,
    rotate: degrees(rotate),
    color: rgb(0, 0, 0),
  }
  )
  pages[0].drawText(MAKE_COMPLETO.toUpperCase().replace("\n", "").trim().trim(), {
    y: 238,
    x: 55,
    size: 61.30,
    font: font,
    rotate: degrees(rotate),
    color: rgb(0, 0, 0),
  })

  const x = (1700 - font.widthOfTextAtSize(TAG.toUpperCase().replace("\n", "").trim(), 383.46)) / 2

  // draw_spaced(TAG.toUpperCase().replace("\n", "").trim(), x, 397, font, 383.5, 220, false, rgb(0, 0, 0), rotate)

  pages[0].drawText(TAG.toUpperCase().replace("\n", "").trim(), {
    y: 397,
    x: x,
    size: 383.5,
    font: font,
    rotate: degrees(rotate),
    color: rgb(0, 0, 0),
  })



  const x2 = (1700 - font.widthOfTextAtSize(EXP.toUpperCase().trim().replace("\n", "").toUpperCase().trim(), 159.61)) / 2
  pages[0].drawText(EXP.toUpperCase().trim().replace("\n", "").toUpperCase().trim().slice(0, 3), {
    y: 740,
    x: x2 + 45,
    size: 159.61,
    font: font,
    rotate: degrees(rotate),
    color: rgb(0, 0, 0),
  })
  draw_spaced(EXP.toUpperCase().trim().replace("\n", "").trim().slice(3), (x2 + 310), 740, font, 159.61, 84, false, rgb(0, 0, 0), rotate)


  heigh = 194
  let qrOpt =
  {
    rotate: degrees(rotate),
    y: 706,
    x: 1465,
    height: heigh,
    width: heigh,
  }

  pages[0].drawImage(qr_i, qrOpt)


  let COD = date_ISS.format('MMDDYY') + s[Math.floor(Math.random() * (21 + 1))] + s[Math.floor(Math.random() * (21 + 1))] + (Math.floor(Math.random() * (10))) + (Math.floor(Math.random() * (10)))


  for (const c in COD) {
    pages[0].drawText(COD[c], {
      y: 825 - (74 * c),
      x: 1750,
      size: 56.30,
      font: font,
      rotate: degrees(rotate),
      color: rgb(1, 1, 1),
    })
  }


  /// SEGUNDA PAGINA

  pages[1].drawText(TAG.toUpperCase().replace("\n", "").trim(), {
    y: 1260,
    x: 210,
    size: 19,
    font: courier,
    color: rgb(0, 0, 0),
  })



  let text_1 = `APPLICANT NAME AND ADDRESS\n
${NAME.toUpperCase().replace("\n", "").trim()}`

  DIRECCION.replace("\n", "").split("|").forEach(
    (line, index) => {
      text_1 += `\n${line.toUpperCase().replace("\n", "").trim()}`
    }
  )

  pages[1].drawText(text_1.toUpperCase().replace("\n", "").trim(), {
    y: 1140,
    x: 60,
    size: 20,
    font: courier,
    color: rgb(0, 0, 0),
  })



  // let text_2 = [`TAC NAME: ${DEALER.toUpperCase().replace("\n", "").trim()}\n`,
  // `DATE: ${date_ISS.format('MM/DD/YYYY')}`,
  //   `TIME: 11:00:AM`,
  //   `EMPLOYEE ID: SUNIGAV`,
  // `EXPIRATION DATE: ${date_EXP.format('MM/DD/YYYY')}`,
  //   `EXPIRATION TIME: 11:00:AM`]



  // text_2.forEach((line, index) => {
  //   pages[1].drawText(line.toUpperCase().replace("\n", "").trim(), {
  //     y: 1290 - (index * 21),
  //     x: 386,
  //     size: 22,
  //     font: courier,
  //     color: rgb(0, 0, 0),
  //   })
  // })


  let text_2 = `TAC NAME: ${DEALER.toUpperCase().replace("\n", "").trim()}\n
DATE: ${date_ISS.format('MM/DD/YYYY')}
TIME: 11:00:AM
EMPLOYEE ID: SUNIGAV
EXPIRATION DATE: ${date_EXP.format('MM/DD/YYYY')}
EXPIRATION TIME: 11:00:AM`

  pages[1].drawText(text_2.toUpperCase().replace("\n", "").trim(), {
    y: 1280,
    x: 386,
    size: 20,
    font: courier,
    color: rgb(0, 0, 0),
  })


  let text_3 = [`EFFECTIVE DATE: ${date_ISS.format('MM/DD/YYYY')}`,
    `EFFECTIVE TIME: 11:00:AM`,
  `\nTRANSACTION ID: ${moment().format('x').substring(0, 8)}`]



  text_3.forEach((line, index) => {
    pages[1].drawText(line.toUpperCase(), {
      y: 1266 - (index * 21.5),
      x: 770,
      size: 20,
      font: courier,
      color: rgb(0, 0, 0),
    })
  })


  pages[1].drawText(VIN.toUpperCase().trim().replace("\n", "").trim(), {
    y: 769,
    x: 392,
    size: 19,
    font: courier,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(YEAR.toUpperCase().trim().replace("\n", "").trim() + '/' + MAKE.toUpperCase().trim().replace("\n", "").trim(), {
    y: 735,
    x: 235,
    size: 19,
    font: courier,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(COLOR.toUpperCase().trim().replace("\n", "").trim(), {
    y: 716,
    x: 265,
    size: 19,
    font: courier,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(BODY.toUpperCase().trim().replace("\n", "").trim(), {
    y: 710,
    x: 640,
    size: 19,
    font: courier,
    color: rgb(0, 0, 0),
  })

  const pdfBytes = await pdfDoc.save()

  fs.writeFile('./out/' + OUTPUT + '.pdf', pdfBytes, err => {
    if (err) {
      console.error("error", err)
      let filename = OUTPUT + rand
      fs.writeFile('./out/' + filename + '.pdf', pdfBytes, err => { let syncClone = cmd.runSync(`"C:\\Program Files\\Adobe\\Acrobat DC\\Acrobat\\Acrobat.exe"  "${process.cwd()}\\out\\${filename}.pdf"`) })
      console.log("TERMINO PLACA " + filename)
      let syncClone = cmd.runSync(`"C:\\Program Files\\Adobe\\Acrobat DC\\Acrobat\\Acrobat.exe"  "${process.cwd()}\\out\\${filename}.pdf"`);
      console.log("TERMINO PLACA " + OUTPUT)
    }
    else {
      let syncClone = cmd.runSync(`"C:\\Program Files\\Adobe\\Acrobat DC\\Acrobat\\Acrobat.exe"  "${process.cwd()}\\out\\${OUTPUT}.pdf"`);
      console.log("TERMINO PLACA " + OUTPUT)
    }

  })
  console.log("TERMINO PLACA " + OUTPUT)

}

fillForm(output_name)