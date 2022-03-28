

import { PDFDocument, rgb, degrees } from 'pdf-lib'
import fs from 'fs';

import fontkit from '@pdf-lib/fontkit'
import { Canvas } from "canvas"
import PDF417 from "pdf417-generator"

const output_name = '24,'

const TAG = "77128W9"

const VIN = "12ojn98213onm89012"

const YEAR = "2019"

const MAKE = "ford"

const COLOR = "gray"

const NAME = "mayra campo"

const DIRECCION = "123321 VERMONT ST\nsanta marta TX\n723230"

const MODEL = "acc"

const BODY = "ll"



const ISSUE = "feb 02, 2020"
const EXP = "jul 30, 2020"
const CREATED_QR = new Date(Date.parse(ISSUE)).toLocaleDateString("en-US")
const EXPIRATION_QR = new Date(Date.parse(EXP)).toLocaleDateString("en-US")
const DEALER = "ACTIVE DEALERSHIP LLC"
const DEALER_NUMBER = "P163908"

const COUNTY = 227

const QR = `${VIN.toUpperCase().trim()}
YEAR: ${YEAR}
MAKE: ${MAKE.toUpperCase().trim()}
COLOR: ${COLOR.toUpperCase().trim()}
VIN: ${VIN.toUpperCase().trim()}
TAG #: ${TAG.toUpperCase().trim()}
CREATED: ${CREATED_QR}
EXPIRATION: ${EXPIRATION_QR}
DEALER: ${DEALER.toUpperCase().trim()}
COUNTY: ${COUNTY}
TAG Type: BUYER`


console.log(QR)

async function fillForm(OUTPUT) {

  const file = await fs.readFileSync("bases/base1.pdf")


  let canvas = new Canvas()
  PDF417.draw(QR, canvas)

  var heigh = 30
  const pdfDoc = await PDFDocument.load(file)
  pdfDoc.registerFontkit(fontkit)

  const qr_i = await pdfDoc.embedPng(canvas.toDataURL())
  const image = await pdfDoc.embedPng(fs.readFileSync('bases/ORIGINAL.png'))

  const fontBold = await pdfDoc.embedFont(fs.readFileSync('bases/refsanb.ttf'))
  const font = await pdfDoc.embedFont(fs.readFileSync('bases/refsan.ttf'))

  const pages = pdfDoc.getPages()

  // PRIMERA PAGINA
  pages[0].drawText(VIN.toUpperCase().trim(), {
    y: 76,
    x: 470,
    size: 18,
    font: fontBold,
    rotate: degrees(90),
    color: rgb(0, 0, 0),
  })

  pages[0].drawText(YEAR.toUpperCase().trim() + ' ' + MAKE.toUpperCase().trim(), {
    y: 275,
    x: 344,
    size: 40,
    font: fontBold,
    rotate: degrees(90),
    color: rgb(0, 0, 0),
  })

  const fontSize = 140
  pages[0].drawText(TAG.toUpperCase().trim(), {
    y: 61.76,
    x: 287.01,
    size: fontSize,
    font: fontBold,
    rotate: degrees(90),
    color: rgb(0, 0, 0),
  })

  pages[0].drawText(EXP.replace(",", "").toUpperCase().trim(), {
    y: 140,
    x: 430,
    size: 80,
    font: fontBold,
    rotate: degrees(90),
    color: rgb(0, 0, 0),
  })

  pages[0].drawImage(qr_i, {
    rotate: degrees(90),
    y: 520,
    x: 450 + heigh,
    height: heigh,
    width: 7 * heigh,
  })

  heigh = 213
  pages[0].drawImage(image, {
    // rotate: degrees(90),
    y: 0,
    x: 0,
    height: 792,
    width: 612,
  })

  /// SEGUNDA PAGINA

  pages[1].drawText(TAG.replace(",", "").toUpperCase().trim(), {
    y: 708,
    x: 160,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(ISSUE.toUpperCase().trim(), {
    y: 710,
    x: 435,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(EXP.toUpperCase().trim(), {
    y: 694,
    x: 435,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  var init = 624

  pages[1].drawText(ISSUE.toUpperCase().trim(), {
    y: init,
    x: 160,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })


  pages[1].drawText(VIN.toUpperCase().trim(), {
    y: init - 16 * 1,
    x: 160,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(YEAR.toUpperCase().trim(), {
    y: init - 16 * 2,
    x: 160,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(MAKE.toUpperCase().trim(), {
    y: init - 16 * 3,
    x: 160,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(COLOR.toUpperCase().trim(), {
    y: init - 16 * 4,
    x: 160,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(BODY.toUpperCase().trim(), {
    y: 625,
    x: 435,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(MODEL.toUpperCase().trim(), {
    y: 609,
    x: 435,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(DEALER.toUpperCase().trim(), {
    y: 530,
    x: 307,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })
  pages[1].drawText(DEALER_NUMBER.toUpperCase().trim(), {
    y: 530 - 16,
    x: 307,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(NAME.toUpperCase().trim(), {
    y: 467,
    x: 307,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })


  DIRECCION.split("\n").map(
    (line, index) => {
      pages[1].drawText(line.toUpperCase().trim(), {
        y: 451 - 12 * index,
        x: 307,
        size: 10,
        font: font,
        color: rgb(0, 0, 0),
      })
    }
  )



  /// TERCERA PAGINA
  pages[2].drawText(TAG.replace(",", "").toUpperCase().trim(), {
    y: 708,
    x: 160,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[2].drawText(ISSUE.toUpperCase().trim(), {
    y: 710,
    x: 435,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[2].drawText(EXP.toUpperCase().trim(), {
    y: 694,
    x: 435,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  init = 670

  pages[2].drawText(ISSUE.toUpperCase().trim(), {
    y: init,
    x: 160,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })


  pages[2].drawText(VIN.toUpperCase().trim(), {
    y: init - 16 * 1,
    x: 160,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[2].drawText(YEAR.toUpperCase().trim(), {
    y: init - 16 * 2,
    x: 160,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[2].drawText(MAKE.toUpperCase().trim(), {
    y: init - 16 * 3,
    x: 160,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[2].drawText(COLOR.toUpperCase().trim(), {
    y: init - 16 * 4,
    x: 160,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[2].drawText(BODY.toUpperCase().trim(), {
    y: 656,
    x: 435,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[2].drawText(MODEL.toUpperCase().trim(), {
    y: 656 - 16,
    x: 435,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[2].drawText(DEALER.toUpperCase().trim(), {
    y: 576,
    x: 307,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })
  pages[2].drawText(DEALER_NUMBER.toUpperCase().trim(), {
    y: 576 - 16,
    x: 307,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })




  pages[2].drawText(NAME.toUpperCase().trim(), {
    y: 512,
    x: 307,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })


  DIRECCION.split("\n").map(
    (line, index) => {
      pages[2].drawText(line.toUpperCase().trim(), {
        y: 512 - 16 * (index + 1),
        x: 307,
        size: 10,
        font: font,
        color: rgb(0, 0, 0),
      })
    }
  )


  const pdfBytes = await pdfDoc.save()


  fs.writeFile(OUTPUT + '.pdf', pdfBytes, err => {
    if (err) {
      console.error(err)
      return
    }
  })
}



fillForm(output_name)








