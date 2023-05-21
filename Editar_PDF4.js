import { PDFDocument, rgb, degrees } from 'pdf-lib'
import moment from 'moment';
import fs from 'fs';

import fontkit from '@pdf-lib/fontkit'
// import { Canvas } from "canvas"
import QRCode from 'qrcode'

import cmd from 'node-cmd'



// NO USAR I Ñ O Q

//let TAG = "1975U25"

let VIN1 = `3GNEC12T84G233045      
`
let YEAR1 = `2004        
`
let MAKE_COMPLETO1 = `Chevrolet             
`

let COLOR1 = `negro       
`
let NAME1 = `Maria Flores 


`
let DIRECCION1 = `515 Arizona st south |Houston tx |77587

`
let MODEL1 = ` avalanche  
`


const removeAccents = (str_input) => {
  return str_input.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function translate_color(color_in) {
  // console.log(color_in)
  let new_color_in = color_in.toLowerCase().replace("\n", "").trim()

  switch (new_color_in) {
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
      return new_color_in.toUpperCase()
  }

}
// let EXP = "NOV 27, 2022";

export default async function fillForm(VIN, YEAR, MAKE_COMPLETO, MAKE, COLOR, NAME, DIRECCION, MODEL, BODY = 'll', MINOR = null, date_ISS = moment(), add_exp_monts = 2, subs_exp_days = 1, DEALER_NUMBER = "P163943", DEALER = "HEMPHILL MOTORS", COUNTY = 227) {

  let s = 'ABCDEFGHJKLMNPRSTUVWXYZ'

  let rand = Math.floor(Math.random() * (9898 - 3747 + 1) + 1247);

  let letter = s[Math.floor(Math.random() * (22 + 1))];

  let TAG = (rand + letter + Math.floor(Math.random() * (99 - 11 + 1) + 11));

  let OUTPUT = TAG

  let ISSUE = moment(date_ISS).format("MMM DD, YYYY");
  // console.log(ISSUE)
  // let ISSUE = "SEP 28, 2022";

  const date_EXP = moment(date_ISS).clone().add(add_exp_monts, 'months').subtract(subs_exp_days, 'days');
  //subtract(1, 'days')
  let EXP = date_EXP.format("MMM DD,YYYY");
  // console.log(EXP, "EXP")

  MAKE = MAKE ? MAKE : MAKE_COMPLETO.substring(0, 3)
  COLOR = translate_color(COLOR)
  if (MINOR != null && MINOR != '') {
    MINOR = translate_color(MINOR)
  }
  MODEL = MODEL.toUpperCase().replace("\n", "").trim().substring(0, 3);
  // console.log(MODEL)
  NAME = removeAccents(NAME)
  DIRECCION = removeAccents(DIRECCION)
  MAKE = MAKE_COMPLETO.toUpperCase().replace("\n", "").trim().substring(0, 4);

  const CREATED_QR = new Date(Date.parse(ISSUE)).toLocaleDateString("en-US")
  const EXPIRATION_QR = new Date(Date.parse(EXP)).toLocaleDateString("en-US")

  let QR = `VIN: ${VIN.toUpperCase().replace("\n", "").trim()}
  YEAR: ${YEAR.replace("\n", "").trim()}
  MAKE: ${MAKE.toUpperCase().replace("\n", "").trim()}
  `
  if (!MINOR || MINOR.replace("\n", "").trim() == '') {
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

  ///////////////////////////////////

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
      // console.log(y + (c * space))
      // console.log(text[c])
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

  // console.log(moment(date_ISS))
  let COD = moment(date_ISS).format('MMDDYY') + s[Math.floor(Math.random() * (21 + 1))] + s[Math.floor(Math.random() * (21 + 1))] + (Math.floor(Math.random() * (10))) + (Math.floor(Math.random() * (10)))


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

  if (MINOR) {
    pages[1].drawText(MINOR.toUpperCase().replace("\n", "").trim(), {
      y: init1 - 32,
      x: 435,
      size: 10,
      font: sansef,
      color: rgb(0, 0, 0),
    })
  }

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
      fs.writeFile('./out/' + filename + '.pdf', pdfBytes, err => {
        console.error(err)
      })
      OUTPUT = filename
      // console.log("TERMINO PLACA Dentro " + filename)
      // cmd.runSync(`"C:\\Program Files\\Adobe\\Acrobat DC\\Acrobat\\Acrobat.exe"  "${process.cwd()}\\out\\${filename}.pdf"`);
      // console.log("TERMINO PLACA " + OUTPUT)
    }
    // else {
    //   // cmd.runSync(`"C:\\Program Files\\Adobe\\Acrobat DC\\Acrobat\\Acrobat.exe"  "${process.cwd()}\\out\\${OUTPUT}.pdf"c);
    //   console.log("TERMINO PLACA Dentro" + OUTPUT)
    // }

  })
  // console.log("TERMINO PLACA " + OUTPUT)
  return [`${process.cwd()}\\out\\${OUTPUT}.pdf`, OUTPUT, pdfBytes]
}

// fillForm(VIN1, YEAR1, MAKE_COMPLETO1, COLOR1, NAME1, DIRECCION1, MODEL1)