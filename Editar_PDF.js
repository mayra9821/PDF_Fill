import { PDFDocument, rgb, degrees } from 'pdf-lib'
import moment from 'moment';
import fs from 'fs';

import fontkit from '@pdf-lib/fontkit'
import { Canvas } from "canvas"
import PDF417 from "pdf417-generator"

// NO USAR I Ñ O Q

const TIPO_BASE = '1'

const output_name = '5,'
var TAG = "32738r5"

var VIN = ` 1G1AK15FX77194743
     
`

var YEAR = ` 2007 
`

var MAKE = ` chev      
`

var COLOR = ` Red

`

var NAME = `Simon posada




`

var DIRECCION = `581 n 600 w apt.#1 |provo ut |84601



`
var MODEL = ` Lan 
`
var BODY = ` ll
`



var ISSUE = moment().format("MMM DD, YYYY");
var EXP = moment().add(2, 'months').subtract(1, 'days').format("MMM DD, YYYY");


// NO se cambian 
const DEALER_NUMBER = "P163908"
const DEALER = "ACTIVE DEALERSHIP LLC"
const COUNTY = 227
MAKE = MAKE.toUpperCase().replace("\n", "").trim().substring(0, 4);


const CREATED_QR = new Date(Date.parse(ISSUE)).toLocaleDateString("en-US")
const EXPIRATION_QR = new Date(Date.parse(EXP)).toLocaleDateString("en-US")

const QR = `  ${VIN.toUpperCase().replace("\n", "").trim()}
YEAR: ${YEAR}
MAKE: ${MAKE.toUpperCase().replace("\n", "").trim()}
COLOR: ${COLOR.toUpperCase().replace("\n", "").trim()}
VIN: ${VIN.toUpperCase().replace("\n", "").trim()}
TAG #: ${TAG.toUpperCase().replace("\n", "").trim()}
CREATED: ${CREATED_QR}
EXPIRATION: ${EXPIRATION_QR}
DEALER: ${DEALER.toUpperCase().replace("\n", "").trim()}
COUNTY: ${COUNTY}
TAG Type: BUYER`

// console.log(QR)

async function fillForm(OUTPUT) {
  let base = "base1.pdf"
  let rotate = 90
  let indice = 0
  let fontSize = 140
  if (TIPO_BASE == '2') {
    base = 'base2.pdf'
    rotate = 0
    indice = 1
    fontSize = 126
  }
  const file = await fs.readFileSync("bases/" + base)
  let canvas = new Canvas()
  PDF417.draw(QR, canvas)

  var heigh = 28
  const pdfDoc = await PDFDocument.load(file)
  pdfDoc.registerFontkit(fontkit)

  const qr_i = await pdfDoc.embedPng(canvas.toDataURL())
  const image = await pdfDoc.embedPng(fs.readFileSync('bases/ORIGINAL.png'))
  const image1 = await pdfDoc.embedPng(fs.readFileSync('bases/lineasV.png'))


  const fontBold = await pdfDoc.embedFont(fs.readFileSync('bases/refsanb.ttf'), { subset: true, customName: "MSReferenceSansSerif" })
  const font = await pdfDoc.embedFont(fs.readFileSync('bases/refsan.ttf'), { subset: true, customName: "MSReferenceSansSerif" })

  const pages = pdfDoc.getPages()

  let vinOpt = [{
    y: 82,
    x: 470,
    size: 18,
    font: font,
    rotate: degrees(rotate),
    color: rgb(0, 0, 0),
  }, {
    y: 157.46,
    x: 111.78,
    size: 18.04,
    font: font,
    rotate: degrees(rotate),
    color: rgb(0, 0, 0)
  }
  ]
  // PRIMERA PAGINA

  pages[0].drawText(VIN.toUpperCase().replace("\n", "").trim(), vinOpt[indice])

  let yearOpt = [
    {
      y: 275,
      x: 354,
      size: 40,
      font: font,
      rotate: degrees(rotate),
      color: rgb(0, 0, 0),
    }, {
      y: 282,
      x: 294.4,
      size: 40,
      font: font,
      rotate: degrees(rotate),
      color: rgb(0, 0, 0),
    }]


  pages[0].drawText(YEAR.toUpperCase().replace("\n", "").trim() + ' ' + MAKE.toUpperCase().replace("\n", "").trim(), yearOpt[indice])

  let tagOpt = [
    {
      y: 61.76,
      x: 315,
      size: fontSize,
      font: font,
      rotate: degrees(rotate),
      color: rgb(0, 0, 0),
    }, {
      x: 130,
      y: 309,
      size: fontSize,
      font: font,
      rotate: degrees(rotate),
      color: rgb(0, 0, 0),
    }]

  pages[0].drawText(TAG.toUpperCase().replace("\n", "").trim(), tagOpt[indice])



  let expOpt = [
    {
      y: 140,
      x: 445,
      size: 80,
      font: font,
      rotate: degrees(rotate),
      color: rgb(0, 0, 0),
    }, {
      y: 182,
      x: 162,
      size: 80,
      font: font,
      rotate: degrees(rotate),
      color: rgb(0, 0, 0),
    }]

  pages[0].drawText(EXP.toUpperCase().replace("\n", "").replace(', ', ',').trim(), expOpt[indice])
  heigh = 21
  let qrOpt = [
    {
      rotate: degrees(rotate),
      y: 520,
      x: 450 + heigh,
      height: heigh,
      width: 8 * heigh,
    }, {
      rotate: degrees(rotate),
      y: 149,
      x: 520 + heigh,
      height: heigh,
      width: 8 * heigh,
    }]

  pages[0].drawImage(qr_i, qrOpt[indice])

  let imageOP = [{
    y: 0,
    x: 0,
    height: 792,
    width: 612,
  },
  {
    y: 612,
    x: 0,
    height: 792,
    width: 612,
    rotate: degrees(rotate - 90),
  }
  ]

  pages[0].drawImage(image, imageOP[indice])

  if (TIPO_BASE == '2') {
    pages[0].drawImage(image1, {
      y: 390,
      x: 36,
      height: 149,
      width: 55,
    })
  }

  /// SEGUNDA PAGINA

  pages[1].drawText(TAG.toUpperCase().replace("\n", "").trim(), {
    y: 708,
    x: 160,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(ISSUE.toUpperCase().replace("\n", "").trim(), {
    y: 710,
    x: 435,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(EXP.toUpperCase().replace("\n", "").trim(), {
    y: 694,
    x: 435,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  var init = 624

  pages[1].drawText(ISSUE.toUpperCase().replace("\n", "").trim(), {
    y: init,
    x: 160,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })


  pages[1].drawText(VIN.toUpperCase().replace("\n", "").trim(), {
    y: init - 16 * 1,
    x: 160,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(YEAR.toUpperCase().replace("\n", "").trim(), {
    y: init - 16 * 2,
    x: 160,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(MAKE.toUpperCase().replace("\n", "").trim(), {
    y: init - 16 * 3,
    x: 160,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(COLOR.toUpperCase().replace("\n", "").trim(), {
    y: init - 16 * 4,
    x: 160,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(BODY.toUpperCase().replace("\n", "").trim(), {
    y: 599,
    x: 435,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(MODEL.toUpperCase().replace("\n", "").trim(), {
    y: 583,
    x: 435,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(DEALER.toUpperCase().replace("\n", "").trim(), {
    y: 530,
    x: 307,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(DEALER_NUMBER.toUpperCase().replace("\n", "").trim(), {
    y: 530 - 16,
    x: 307,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(NAME.toUpperCase().replace("Ñ", "N").replace("\n", "").trim().replace("\n", ""), {
    y: 467,
    x: 307,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })


  DIRECCION.replace("\n", "").split("|").map(
    (line, index) => {
      pages[1].drawText(line.toUpperCase().replace("\n", "").trim(), {
        y: 451 - 16 * index,
        x: 307,
        size: 10,
        font: font,
        color: rgb(0, 0, 0),
      })
    }
  )



  /// TERCERA PAGINA
  pages[2].drawText(TAG.toUpperCase().replace("\n", "").trim(), {
    y: 708,
    x: 160,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[2].drawText(ISSUE.toUpperCase().replace("\n", "").trim(), {
    y: 712,
    x: 435,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[2].drawText(EXP.toUpperCase().replace("\n", "").trim(), {
    y: 694,
    x: 435,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  init = 672

  pages[2].drawText(ISSUE.toUpperCase().replace("\n", "").trim(), {
    y: init,
    x: 160,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })


  pages[2].drawText(VIN.toUpperCase().replace("\n", "").trim(), {
    y: init - 16 * 1,
    x: 160,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[2].drawText(YEAR.toUpperCase().replace("\n", "").trim(), {
    y: init - 16 * 2,
    x: 160,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[2].drawText(MAKE.toUpperCase().replace("\n", "").trim(), {
    y: init - 16 * 3,
    x: 160,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[2].drawText(COLOR.toUpperCase().replace("\n", "").trim(), {
    y: init - 16 * 4,
    x: 160,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[2].drawText(BODY.toUpperCase().replace("\n", "").trim(), {
    y: 648,
    x: 435,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[2].drawText(MODEL.toUpperCase().replace("\n", "").trim(), {
    y: 648 - 16,
    x: 435,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[2].drawText(DEALER.toUpperCase().replace("\n", "").trim(), {
    y: 576,
    x: 307,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[2].drawText(DEALER_NUMBER.toUpperCase().replace("\n", "").trim(), {
    y: 576 - 16,
    x: 307,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[2].drawText(NAME.toUpperCase().replace("Ñ", "N").replace("\n", "").trim().replace("\n", ""), {
    y: 512,
    x: 307,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })


  DIRECCION.replace("\n", "").split("|").map(
    (line, index) => {
      pages[2].drawText(line.toUpperCase().replace("\n", "").trim(), {
        y: 512 - 16 * (index + 1),
        x: 307,
        size: 10,
        font: font,
        color: rgb(0, 0, 0),
      })
    }
  )

  const pdfBytes = await pdfDoc.save()

  fs.writeFile('./out/' + OUTPUT + '.pdf', pdfBytes, err => {
    if (err) {
      console.error(err)
      return
    }

  })
  console.log("TERMINO")
}



fillForm(output_name)








