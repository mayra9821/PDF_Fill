

import { PDFDocument, rgb, degrees } from 'pdf-lib'
import fs from 'fs';

import fontkit from '@pdf-lib/fontkit'
import { Canvas } from "canvas"
import PDF417 from "pdf417-generator"

const VIN = "12ojn98213onm89012";
const YEAR = "2019"
const MAKE = "ford"
const COLOR = "gray"
const TAG = "77128u9"
const ISSUE = "feb 02, 2020"
const EXP = "jul 30, 2020"

const CREATED_QR = new Date(Date.parse(ISSUE)).toLocaleDateString("en-US")
const EXPIRATION_QR = new Date(Date.parse(EXP)).toLocaleDateString("en-US")

const NAME = "mayra campo"
const DIRECCION = "123321 VERMONT ST\nsanta marta TX\n723230"
const BODY = "QQ"
const MODEL = "ttr"

const DEALER = "ACTIVE DEALERSHIP LLC"

const COUNTY = 227

const QR = `${VIN.toUpperCase()}
YEAR: ${YEAR}
MAKE: ${MAKE.toUpperCase()}
COLOR: ${COLOR.toUpperCase()}
VIN: ${VIN.toUpperCase()}
TAG #: ${TAG.toUpperCase()}
CREATED: ${CREATED_QR}
EXPIRATION: ${EXPIRATION_QR}
DEALER: ${DEALER.toUpperCase()}
COUNTY: ${COUNTY}
TAG Type: BUYER`


console.log(QR)

async function fillForm(OUTPUT) {

  const file = await fs.readFileSync("bases/base.pdf")


  let canvas = new Canvas()
  PDF417.draw(QR, canvas)

  var heigh = 30
  const pdfDoc = await PDFDocument.load(file)
  pdfDoc.registerFontkit(fontkit)

  const qr_i = await pdfDoc.embedPng(canvas.toDataURL())
  const image = await pdfDoc.embedPng(fs.readFileSync('bases/lineas.png'))

  const fontBold = await pdfDoc.embedFont(fs.readFileSync('bases/refsanb.ttf'))
  const font = await pdfDoc.embedFont(fs.readFileSync('bases/refsan.ttf'))

  const form = pdfDoc.getForm()

  const firstPage = pdfDoc.getPages()[0]

  const VINField = form.getTextField('VIN')
  const YEARField = form.getTextField('año_fab')
  const MAKEField = form.getTextField('fab')
  const TAGField = form.getTextField('consecutivo')
  const COLORField = form.getTextField('color')
  const ISSUEField = form.getTextField('issue_date,')
  const EXPField = form.getTextField('exp_date')
  const NAMEField = form.getTextField('nombre')
  const DIRECCIONField = form.getTextField('direccion')
  const BODYField = form.getTextField('body')
  const MODELField = form.getTextField('model')



  VINField.setText(VIN.toUpperCase())
  VINField.updateAppearances(font)
  YEARField.setText(YEAR.toUpperCase())
  YEARField.updateAppearances(font)
  MAKEField.setText(MAKE.toUpperCase())
  MAKEField.updateAppearances(font)
  COLORField.setText(COLOR.toUpperCase())
  COLORField.updateAppearances(font)
  TAGField.setText(TAG.toUpperCase())
  TAGField.updateAppearances(font)
  ISSUEField.setText(ISSUE.toUpperCase())
  ISSUEField.updateAppearances(font)
  EXPField.setText(EXP.toUpperCase())
  EXPField.updateAppearances(font)
  NAMEField.setText(NAME.toUpperCase())
  NAMEField.updateAppearances(font)
  DIRECCIONField.setText(DIRECCION.toUpperCase())
  DIRECCIONField.updateAppearances(font)
  BODYField.setText(BODY.toUpperCase())
  BODYField.updateAppearances(font)
  MODELField.setText(MODEL.toUpperCase())
  MODELField.updateAppearances(font)

  firstPage.drawText(VIN.toUpperCase(), {
    y: 76,
    x: 470,
    size: 18,
    font: fontBold,
    rotate: degrees(90),
    color: rgb(0, 0, 0),
  })

  firstPage.drawText(YEAR.toUpperCase() + ' ' + MAKE.toUpperCase(), {
    y: 275,
    x: 344,
    size: 40,
    font: fontBold,
    rotate: degrees(90),
    color: rgb(0, 0, 0),
  })

  const fontSize = 140
  firstPage.drawText(TAG.toUpperCase(), {
    y: 61.76,
    x: 287.01,
    size: fontSize,
    font: fontBold,
    rotate: degrees(90),
    color: rgb(0, 0, 0),
  })

  firstPage.drawText(EXP.replace(",", "").toUpperCase(), {
    y: 140,
    x: 430,
    size: 80,
    font: fontBold,
    rotate: degrees(90),
    color: rgb(0, 0, 0),
  })

  firstPage.drawImage(qr_i, {
    rotate: degrees(90),
    y: 520,
    x: 450 + heigh,
    height: heigh,
    width: 7 * heigh,
  })

  heigh = 213
  firstPage.drawImage(image, {
    rotate: degrees(90),
    y: 0,
    x: 197 + heigh,
    height: heigh,
    width: 3.7144814420 * heigh,
  })

  const pdfBytes = await pdfDoc.save()


  fs.writeFile(OUTPUT + '.pdf', pdfBytes, err => {
    if (err) {
      console.error(err)
      return
    }
  })
}



fillForm("22,")








