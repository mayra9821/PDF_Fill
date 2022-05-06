import { PDFDocument, rgb, degrees } from 'pdf-lib'
import moment from 'moment';
import fs from 'fs';

import fontkit from '@pdf-lib/fontkit'
import { Canvas } from "canvas"
import PDF417 from "pdf417-generator"

import cmd from 'node-cmd'
// NO USAR I Ñ O Q
var s = 'ABCDEFGHJKLMNPRSTUVWXYZ'

let rand = Math.floor(Math.random() * (98987 - 37479 + 1) + 12479);


var letter = s[Math.floor(Math.random() * (22 + 1))];
// const letter = 'k'
const TIPO_BASE = '1'
const output_name = '62,'

var TAG = rand + letter + (Math.floor(Math.random() * 9) + 1);

var VIN = `SHSD78803U118630    
    
`
var YEAR = ` 2003    

`
var MAKE = `Hond       
`

var COLOR = `gray      
          
`
var NAME = `Roberto Lainez 

`
var DIRECCION = `58 Liberty st |New Haven CT |06519

`
var MODEL = ` CRV
        
`
var BODY = `ll   
`

var MINOR = `
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

let QR = `  ${VIN.toUpperCase().replace("\n", "").trim()}
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

QR = QR + `VIN: ${VIN.toUpperCase().replace("\n", "").trim()}
TAG #: ${TAG.toUpperCase().replace("\n", "").trim()}
CREATED: ${CREATED_QR}
EXPIRATION: ${EXPIRATION_QR}
DEALER: ${DEALER.toUpperCase().replace("\n", "").trim()}
COUNTY: ${COUNTY}
TAG Type: BUYER`
// MINOR COLOR: GOLD

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
    y: 53, // + -> , - <-
    x: 459,
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
  let vin_text = ["VIN: " + VIN.toUpperCase().replace("\n", "").trim(), VIN.toUpperCase().replace("\n", "").trim()]
  pages[0].drawText(vin_text[indice], vinOpt[indice])

  let year_make = YEAR.toUpperCase().replace("\n", "").trim() + ' ' + MAKE.toUpperCase().replace("\n", "").trim()
  const x1 = (792 - font.widthOfTextAtSize(year_make, 40)) / 2

  let yearOpt = [
    {
      y: x1,
      x: 346,
      size: 40,
      font: font,
      rotate: degrees(rotate),
      color: rgb(0, 0, 0),
    }, {
      y: 282,
      x: x1,
      size: 40,
      font: font,
      rotate: degrees(rotate),
      color: rgb(0, 0, 0),
    }]


  pages[0].drawText(year_make, yearOpt[indice])




  const x = (792 - font.widthOfTextAtSize(TAG.toUpperCase().replace("\n", "").trim(), fontSize)) / 2

  let tagOpt = [
    {
      y: x,
      x: 320,
      size: fontSize,
      font: font,
      rotate: degrees(rotate),
      color: rgb(0, 0, 0),
    }, {
      x: x,
      y: 309,
      size: fontSize,
      font: font,
      rotate: degrees(rotate),
      color: rgb(0, 0, 0),
    }]

  pages[0].drawText(TAG.toUpperCase().replace("\n", "").trim(), tagOpt[indice])



  let expOpt = [
    {
      y: 165,
      x: 430,
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
  heigh = 22
  let qrOpt = [
    {
      rotate: degrees(rotate),
      y: 575,
      x: 442.5 + heigh,
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

  pages[1].drawText(MINOR.toUpperCase().replace("\n", "").trim(), {
    y: 567,
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
  pages[2].drawText(MINOR.toUpperCase().replace("\n", "").trim(), {
    y: 648 - 32,
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
    else {
      var syncClone = cmd.runSync(`"C:\\Program Files (x86)\\Adobe\\Acrobat DC\\Acrobat\\Acrobat.exe"  "${process.cwd()}\\out\\${OUTPUT}.pdf"`);
      console.log(syncClone)
    }

  })
  console.log("TERMINO")

}



fillForm(output_name)








