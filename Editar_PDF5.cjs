const { PDFDocument, rgb, degrees } = require('pdf-lib');
const moment = require('moment');
const fs = require('fs');

const fontkit = require('@pdf-lib/fontkit');
// const { Canvas } = require("canvas");
// const QRCode = require('qrcode');


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


async function fillForm2(VIN, YEAR, MAKE_COMPLETO, MAKE, COLOR, NAME, DIRECCION, MODEL_STR, BODY = 'll', MINOR = null, date_ISS = moment("2025-04-30"), add_exp_monts = 2, subs_exp_days = 2, DEALER_NUMBER = "P163943", DEALER = "HEMPHILL MOTORS", COUNTY = 227) {


  let rand = Math.floor(Math.random() * (9898 - 3747 + 1) + 1247);
  // let letter = s[Math.floor(Math.random() * (22 + 1))];

  let TAG = "9897" + rand
  console.log(TAG)

  let OUTPUT = TAG

  let ISSUE = moment(date_ISS).format("MM/DD/YYYY");

  const date_EXP = moment(date_ISS).clone().add(add_exp_monts, 'months').subtract(subs_exp_days, 'days');

  let EXP = date_EXP.format("MM/DD/YYYY");

  MAKE_COMPLETO = MAKE_COMPLETO.toUpperCase().replace("\n", "").trim()

  if (MAKE.replace("\n", "").trim() == '' || MAKE == null) {
    MAKE = MAKE_COMPLETO
  }
  MAKE = MAKE.toUpperCase().replace("\n", "").trim().substring(0, 4);
  if (MAKE == 'TOYO') {
    MAKE = 'TOYT'
  }
  if (MAKE == 'LEXU') {
    MAKE = 'LEXS'
  }
  if (MAKE == 'MERC' || MAKE_COMPLETO == "MERCEDES BENZ") {
    MAKE = 'MERZ'
  }

  COLOR = translate_color(COLOR)
  if (MINOR != null && MINOR != '') {
    MINOR = translate_color(MINOR)
  }

  MODEL = MODEL_STR.toUpperCase().replace("\n", "").trim().substring(0, 3);
  NAME = removeAccents(NAME)
  NAME = NAME.toUpperCase().trim().split(" ")
  FIRST_NAME = NAME[0]
  MIDDLE_NAME = ""
  LAST_NAME = ""
  if (NAME.length == 2) {
    LAST_NAME = NAME[1]
  }
  else {
    if (NAME[3] != undefined) {
      LAST_NAME = NAME[2] + " " + NAME[3]
      MIDDLE_NAME = NAME[1]
    }
    else if (NAME[2] != undefined) {
      LAST_NAME = NAME[2]
      MIDDLE_NAME = NAME[1]
    }
    if (LAST_NAME.includes("JR") || LAST_NAME.includes("SR")) {
      LAST_NAME = MIDDLE_NAME + " " + LAST_NAME
      MIDDLE_NAME = ""

    }
  }


  DIRECCION = removeAccents(DIRECCION)

  DIRECCION = DIRECCION.toUpperCase().replace("\n", "").trim().split("|")
  DIRECCION_1 = DIRECCION[0]
  CITY = DIRECCION[1]
  STATE = DIRECCION[2]
  ZIP = DIRECCION[3] + ""
  ///////////////////////////////////

  let base = "base_lou.pdf"
  let rotate = 0
  const file = await fs.readFileSync("bases/" + base)


  const pdfDoc = await PDFDocument.load(file)

  pdfDoc.registerFontkit(fontkit)

  // const qr_i = await pdfDoc.embedPng(dataurl)
  const arial = await pdfDoc.embedFont(fs.readFileSync('bases/arial.ttf'), { subset: true, customName: "Arial" })
  const helv = await pdfDoc.embedFont(fs.readFileSync('bases/helv.ttf'), { subset: true, customName: "Helvetica" })
  const mvboli = await pdfDoc.embedFont(fs.readFileSync('bases/mvboli.ttf'), { subset: true, customName: "MV Boli" })
  const brush = await pdfDoc.embedFont(fs.readFileSync('bases/brush.ttf'), { subset: true, customName: "Brush Script" })


  const pages = pdfDoc.getPages()

  // PRIMERA PAGINA
  pages[0].drawText(VIN.toUpperCase().replace("\n", "").trim(), {
    y: 386,// + arriba , abajo <-
    x: 539 * 0.4349755881,// + -> , - <-
    size: 22,
    font: mvboli,
    ySkew: degrees(20),
    rotate: degrees(rotate),
    color: rgb(0, 0, 0),
  })

  pages[0].drawText(moment(date_ISS).format("MM-DD-YYYY").toUpperCase().replace("\n", "").trim(), {
    y: 345,
    x: 840 * 0.4349755881,
    size: 22,
    font: mvboli,
    ySkew: degrees(8),
    rotate: degrees(rotate),
    color: rgb(0, 0, 0),
  }
  )

  pages[0].drawText(YEAR.toUpperCase().replace("\n", "").trim(), {
    y: 419,
    x: 685 * 0.4349755881,
    size: 22,
    font: mvboli,
    ySkew: degrees(20),
    rotate: degrees(rotate),
    color: rgb(0, 0, 0),
  }
  )
  pages[0].drawText(MAKE_COMPLETO.toUpperCase().replace("\n", "").trim().trim(), {
    y: 419,
    x: 845 * 0.4349755881,
    size: 22,
    font: mvboli,
    ySkew: degrees(20),
    rotate: degrees(rotate),
    color: rgb(0, 0, 0),
  })

  const x = (2570 * 0.4349755881 - arial.widthOfTextAtSize(TAG.toUpperCase().replace("\n", "").trim(), 383.46 * 0.4349755881)) / 2

  pages[0].drawText(TAG.toUpperCase().replace("\n", "").trim(), {
    y: 465 * 0.4349755881,
    x: x,
    size: 132,
    ySkew: degrees(8),
    font: arial,
    rotate: degrees(rotate),
    color: rgb(0, 0, 0),
  })

  EXP_DATA = EXP.split("/")

  pages[0].drawText(EXP_DATA[0].toUpperCase().trim().replace("\n", "").toUpperCase().trim(), {
    y: 425,
    x: 50,
    size: 105,
    font: brush,
    rotate: degrees(rotate),
    color: rgb(0, 0, 0),
  })
  pages[0].drawText(EXP_DATA[1].toUpperCase().trim().replace("\n", "").toUpperCase().trim(), {
    y: 320,
    x: 50,
    size: 105,
    font: brush,
    rotate: degrees(rotate),
    color: rgb(0, 0, 0),
  })

  pages[0].drawText(EXP_DATA[2].toUpperCase().trim().replace("\n", "").toUpperCase().trim().substring(2, 4), {
    y: 205,
    x: 50,
    size: 105,
    font: brush,
    rotate: degrees(rotate),
    color: rgb(0, 0, 0),
  })




  /// SEGUNDA PAGINA
  const tmnr = await pdfDoc.embedFont(fs.readFileSync('bases/times.ttf'), { subset: true, customName: "Times New Roman" })




  let init = 858

  let x_2p = 180

  pages[1].drawText(TAG.toUpperCase().replace("\n", "").trim(), {
    y: init,
    x: x_2p,
    size: 10,
    font: tmnr,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(VIN.toUpperCase().replace("\n", "").trim(), {
    y: init - 20 * 2,
    x: x_2p,
    size: 10,
    font: tmnr,
    color: rgb(0, 0, 0),
  })


  pages[1].drawText(MAKE.toUpperCase().replace("\n", "").trim(), {
    y: init - 20 * 3,
    x: x_2p,
    size: 10,
    font: tmnr,
    color: rgb(0, 0, 0),
  })


  pages[1].drawText(BODY.toUpperCase().replace("\n", "").trim(), {
    y: init - 20 * 4,
    x: x_2p,
    size: 10,
    font: tmnr,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(MODEL.toUpperCase().replace("\n", "").trim(), {
    y: init - 20 * 5,
    x: x_2p,
    size: 10,
    font: tmnr,
    color: rgb(0, 0, 0),
  })
  init = init - 10

  pages[1].drawText(COLOR.toUpperCase().replace("\n", "").trim(), {
    y: init - 20 * 7,
    x: x_2p,
    size: 10,
    font: tmnr,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(COLOR.toUpperCase().replace("\n", "").trim(), {
    y: init - 20 * 8,
    x: x_2p,
    size: 10,
    font: tmnr,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(YEAR.toUpperCase().replace("\n", "").trim(), {
    y: init - 20 * 9,
    x: x_2p,
    size: 10,
    font: tmnr,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(ISSUE.toUpperCase().replace("\n", "").trim(), {
    y: init - 20 * 10,
    x: x_2p,
    size: 10,
    font: tmnr,
    color: rgb(0, 0, 0),
  })
  pages[1].drawText(EXP.toUpperCase().replace("\n", "").trim(), {
    y: init - 20 * 11,
    x: x_2p,
    size: 10,
    font: tmnr,
    color: rgb(0, 0, 0),
  })




  init1 = 855
  let x_2p_2 = 430

  pages[1].drawText(FIRST_NAME.toUpperCase().replace("Ñ", "N").replace("\n", "").trim().replace("\n", ""), {
    y: init1,
    x: x_2p_2,
    size: 10,
    font: tmnr,
    color: rgb(0, 0, 0),
  })
  pages[1].drawText(MIDDLE_NAME.toUpperCase().replace("Ñ", "N").replace("\n", "").trim().replace("\n", ""), {
    y: init1 - 20 * 1,
    x: x_2p_2,
    size: 10,
    font: tmnr,
    color: rgb(0, 0, 0),
  })
  pages[1].drawText(LAST_NAME.toUpperCase().replace("Ñ", "N").replace("\n", "").trim().replace("\n", ""), {
    y: init1 - 20 * 2,
    x: x_2p_2,
    size: 10,
    font: tmnr,
    color: rgb(0, 0, 0),
  })

  init1 = 730
  pages[1].drawText(DIRECCION_1.toUpperCase().replace("Ñ", "N").replace("\n", "").trim().replace("\n", ""), {
    y: init1,
    x: x_2p_2,
    size: 10,
    font: tmnr,
    color: rgb(0, 0, 0),
  })
  pages[1].drawText(CITY.toUpperCase().replace("Ñ", "N").replace("\n", "").trim().replace("\n", ""), {
    y: init1 - 20 * 1,
    x: x_2p_2,
    size: 10,
    font: tmnr,
    color: rgb(0, 0, 0),
  })


  init1 = init1 - 20
  pages[1].drawText(STATE.toUpperCase().replace("Ñ", "N").replace("\n", "").trim().replace("\n", ""), {
    y: init1 - 20 * 2,
    x: x_2p_2,
    size: 10,
    font: tmnr,
    color: rgb(0, 0, 0),
  })
  pages[1].drawText(ZIP.toUpperCase().replace("Ñ", "N").replace("\n", "").trim().replace("\n", ""), {
    y: init1 - 20 * 3,
    x: x_2p_2,
    size: 10,
    font: tmnr,
    color: rgb(0, 0, 0),
  })


  pages[1].drawText(ISSUE.toUpperCase().replace("Ñ", "N").replace("\n", "").trim().replace("\n", ""), {
    y: 40,
    x: x_2p_2 + 30,
    size: 10,
    font: tmnr,
    color: rgb(0, 0, 0),
  })





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
  return [`${process.cwd()}/out/${OUTPUT}.pdf`, OUTPUT, pdfBytes]
}


module.exports = {
  fillForm2
}

let data = {
  "VIN": "4T1BE32KX60696535",
  "YEAR": "2006",
  "MAKE_COMPLETO": "TOYOTA",
  "MAKE": "TOYOTA",
  "COLOR": "Maroon",
  "NAME": "ROYCE CHUDEJ JR",
  "DIRECCION": "12625 coursey blvd. Apt.#2025 |Baton Rouge| LA |70816",
  "MODEL": "m6asd",
  "BODY": "VN",
  "MINOR": "",
  "date_ISS": "2025-05-01T11:57:14-05:00",
  "add_exp_monts": "2",
  "subs_exp_days": "1",
  "DEALER_NUMBER": "P163943",
  "DEALER": "HEMPHILL MOTORS",
  "COUNTY": "227"
}
fillForm2(data.VIN, data.YEAR, data.MAKE_COMPLETO, data.MAKE, data.COLOR, data.NAME, data.DIRECCION, data.MODEL)