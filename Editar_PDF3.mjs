import { PDFDocument, rgb, degrees } from 'pdf-lib'
import moment from 'moment';
import fs from 'fs';

import fontkit from '@pdf-lib/fontkit'
// import { Canvas } from "canvas"
import QRCode from 'qrcode'

import cmd from 'node-cmd'
// NO USAR I Ñ O Q
let s = 'ABCDEFGHJKLMNPRSTUVWXYZ'

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
let letter = s[Math.floor(Math.random() * (22 + 1))];

let TAG = (rand + letter + Math.floor(Math.random() * (99 - 11 + 1) + 11));

let output_name = TAG

let VIN = `
4T3BK3BB9EU09989
`

let YEAR = `
2014

`
let MAKE_COMPLETO = `Toyota
`
let MAKE = `Toyota
`

let COLOR = `Negro

`
let NAME = `Luis Miguel Díaz Dominicci

`
let DIRECCION = `1097 Hollywell Ave apt 304 |Chambersburg,PA |17201

`
let MODEL = ` Venza
`
let BODY = `XL
`
let MINOR = `
`

let DEALER_NUMBER = "P163943"
let DEALER = "HEMPHILL MOTORS"
let COUNTY = 227
COLOR = translate_color(COLOR)
MINOR = translate_color(MINOR)
MODEL = MODEL.toUpperCase().replace("\n", "").trim().substring(0, 3);
console.log(MODEL)
NAME = removeAccents(NAME)
DIRECCION = removeAccents(DIRECCION)

let date_ISS = moment();
let ISSUE = date_ISS.format("MMM DD, YYYY");
console.log(ISSUE)
// let ISSUE = "SEP 28, 2022";

const date_EXP = date_ISS.clone().add(2, 'months').subtract(1, 'days');
//subtract(1, 'days')
let EXP = date_EXP.format("MMM DD, YYYY");
console.log(EXP, "EXP")
// let EXP = "NOV 27, 2022";

MAKE = MAKE.toUpperCase().replace("\n", "").trim().substring(0, 4);

if (MAKE.replace("\n", "").trim() == '') {
  MAKE = MAKE_COMPLETO.toUpperCase().replace("\n", "").trim().substring(0, 4);
}
if (MAKE == 'TOYO') {
  MAKE = 'TOYT'
}
if (MAKE == 'LEXU') {
  MAKE = 'LEXS'
}
if (MAKE == 'MERC' || MAKE_COMPLETO == "MERCEDES BENZ") {
  MAKE = 'MERZ'
}

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
  let base = "base5.pdf"
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
  const pages = pdfDoc.getPages()


  // PRIMERA PAGINA
  pages[0].drawText(VIN.toUpperCase().replace("\n", "").trim(), {
    y: 312 * 0.4349755881, // + -> , - <-
    x: 1170 * 0.4349755881,
    size: 45.06 * 0.4349755881,
    font: font,
    rotate: degrees(rotate),
    color: rgb(0, 0, 0),
  })

  pages[0].drawText(DEALER.toUpperCase().replace("\n", "").trim(), {
    y: 259 * 0.4349755881, // + -> , - <-
    x: 1170 * 0.4349755881,
    size: 45.06 * 0.4349755881,
    font: font,
    rotate: degrees(rotate),
    color: rgb(0, 0, 0),
  })

  pages[0].drawText(YEAR.toUpperCase().replace("\n", "").trim(), {
    y: 298 * 0.4349755881,
    x: 55 * 0.4349755881,
    size: 61.30 * 0.4349755881,
    font: font,
    rotate: degrees(rotate),
    color: rgb(0, 0, 0),
  }
  )
  pages[0].drawText(MAKE_COMPLETO.toUpperCase().replace("\n", "").trim().trim(), {
    y: 238 * 0.4349755881,
    x: 55 * 0.4349755881,
    size: 61.30 * 0.4349755881,
    font: font,
    rotate: degrees(rotate),
    color: rgb(0, 0, 0),
  })

  const x = (1700 * 0.4349755881 - font.widthOfTextAtSize(TAG.toUpperCase().replace("\n", "").trim(), 383.46 * 0.4349755881)) / 2

  // draw_spaced(TAG.toUpperCase().replace("\n", "").trim(), x, 397, font, 383.5, 220, false, rgb(0, 0, 0), rotate)

  pages[0].drawText(TAG.toUpperCase().replace("\n", "").trim(), {
    y: 397 * 0.4349755881,
    x: x,
    size: 383.5 * 0.4349755881,
    font: font,
    rotate: degrees(rotate),
    color: rgb(0, 0, 0),
  })



  const x2 = (1800 - font.widthOfTextAtSize(EXP.toUpperCase().trim().replace("\n", "").toUpperCase().trim(), 159.61)) / 2

  pages[0].drawText(EXP.toUpperCase().trim().replace("\n", "").toUpperCase().trim(), {
    y: 740 * 0.4349755881,
    x: x2 * 0.4349755881,
    size: 159.61 * 0.4349755881,
    font: font,
    rotate: degrees(rotate),
    color: rgb(0, 0, 0),
  })

  heigh = 194 * 0.4349755881
  let qrOpt =
  {
    rotate: degrees(rotate),
    y: 706 * 0.4349755881,
    x: 1465 * 0.4349755881,
    height: heigh,
    width: heigh,
  }

  pages[0].drawImage(qr_i, qrOpt)

  console.log(date_ISS)
  let COD = date_ISS.format('MMDDYY') + s[Math.floor(Math.random() * (21 + 1))] + s[Math.floor(Math.random() * (21 + 1))] + (Math.floor(Math.random() * (10))) + (Math.floor(Math.random() * (10)))


  for (const c in COD) {
    pages[0].drawText(COD[c], {
      y: (825 - (74 * c)) * 0.4349755881,
      x: (1750 - (font.widthOfTextAtSize(COD[c], 56.30 * 0.4349755881) / 2)) * 0.4349755881,
      size: 56.30 * 0.4349755881,
      font: font,
      rotate: degrees(rotate),
      color: rgb(1, 1, 1),
    })
  }

  /// SEGUNDA PAGINA
  const sansef = await pdfDoc.embedFont(fs.readFileSync('bases/micross.ttf'), { subset: true, customName: "Microsoft Sans Serif" })

  pages[1].drawText(TAG.toUpperCase().replace("\n", "").trim(), {
    y: 708,
    x: 160,
    size: 10,
    font: sansef,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(ISSUE.toUpperCase().replace("\n", "").trim(), {
    y: 710,
    x: 435,
    size: 10,
    font: sansef,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(EXP.toUpperCase().replace("\n", "").trim(), {
    y: 694,
    x: 435,
    size: 10,
    font: sansef,
    color: rgb(0, 0, 0),
  })

  let init = 665

  pages[1].drawText(ISSUE.toUpperCase().replace("\n", "").trim(), {
    y: init,
    x: 160,
    size: 10,
    font: sansef,
    color: rgb(0, 0, 0),
  })


  pages[1].drawText(VIN.toUpperCase().replace("\n", "").trim(), {
    y: init - 16 * 1,
    x: 160,
    size: 10,
    font: sansef,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(YEAR.toUpperCase().replace("\n", "").trim(), {
    y: init - 16 * 2,
    x: 160,
    size: 10,
    font: sansef,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(MAKE.toUpperCase().replace("\n", "").trim(), {
    y: init - 16 * 3,
    x: 160,
    size: 10,
    font: sansef,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(COLOR.toUpperCase().replace("\n", "").trim(), {
    y: init - 16 * 4,
    x: 160,
    size: 10,
    font: sansef,
    color: rgb(0, 0, 0),
  })

  // body model minor
  let init1 = 640
  pages[1].drawText(BODY.toUpperCase().replace("\n", "").trim(), {
    y: init1,
    x: 435,
    size: 10,
    font: sansef,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(MODEL.toUpperCase().replace("\n", "").trim(), {
    y: init1 - 16,
    x: 435,
    size: 10,
    font: sansef,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(MINOR.toUpperCase().replace("\n", "").trim(), {
    y: init1 - 32,
    x: 435,
    size: 10,
    font: sansef,
    color: rgb(0, 0, 0),
  })

  init1 = 565
  pages[1].drawText(DEALER.toUpperCase().replace("\n", "").trim(), {
    y: init1,
    x: 307,
    size: 10,
    font: sansef,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(DEALER_NUMBER.toUpperCase().replace("\n", "").trim(), {
    y: init1 - 16,
    x: 307,
    size: 10,
    font: sansef,
    color: rgb(0, 0, 0),
  })



  init1 = 505
  pages[1].drawText(NAME.toUpperCase().replace("Ñ", "N").replace("\n", "").trim().replace("\n", ""), {
    y: init1,
    x: 307,
    size: 10,
    font: sansef,
    color: rgb(0, 0, 0),
  })


  DIRECCION.replace("\n", "").split("|").forEach(
    (line, index) => {
      pages[1].drawText(line.toUpperCase().replace("\n", "").trim(), {
        y: init1 - (16 * (index + 1)),
        x: 307,
        size: 10,
        font: sansef,
        color: rgb(0, 0, 0),
      })
    }
  )

  const pdfBytes = await pdfDoc.save()

  fs.writeFile('./out/' + OUTPUT + '.pdf', pdfBytes, err => {
    if (err) {
      console.error("error", err)
      let filename = OUTPUT + rand
      fs.writeFile('./out/' + filename + '.pdf', pdfBytes, err => { let syncClone = cmd.runSync(`"C:\\Program Files\\Adobe\\Acrobat DC\\Acrobat\\Acrobat.exe"  "${process.cwd()}\\out\\${filename}.pdf"`) })
      console.log("TERMINO PLACA " + filename)
      // cmd.runSync(`"C:\\Program Files\\Adobe\\Acrobat DC\\Acrobat\\Acrobat.exe"  "${process.cwd()}\\out\\${filename}.pdf"`);
      // console.log("TERMINO PLACA " + OUTPUT)
    }
    else {
      // cmd.runSync(`"C:\\Program Files\\Adobe\\Acrobat DC\\Acrobat\\Acrobat.exe"  "${process.cwd()}\\out\\${OUTPUT}.pdf"`);
      console.log("TERMINO PLACA " + OUTPUT)
    }

  })
  console.log("TERMINO PLACA " + OUTPUT)

}

fillForm(output_name)