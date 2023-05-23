const express = require('express');
const { fillForm } = require("./Editar_PDF4.cjs");
const moment = require('moment');
const qrcode = require('qrcode');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');

let qr_data = "";
let formVisible = false; // Variable para controlar la visibilidad del formulario
let loading = true;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/pdfs', express.static(__dirname + '/out'));
let placas = '120363044029875718@g.us'
let portapapeles = '120363044942242672@g.us'

let error_message = null;
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox'],
  }
});



let loader = fs.readFileSync('./loader.html', 'utf-8');

client.on('qr', (qr) => {
  console.log('QR RECEIVED', qr);
  qr_data = qr;
  loading = false;
  formVisible = false; // Ocultar el formulario cuando se recibe el código QR
});


client.on('ready', async () => {
  console.log('Client is ready!');
  formVisible = true;
  loading = false;
  console.log("WhatsApp Web v", await client.getWWebVersion());
  client.getChats().then((chats) => {
    // console.log(chats);
    //for (let chat of chats) {
    //console.log(chat.name, chat.id._serialized);
    //}
    console.log(placas, portapapeles)
    placas = chats.find(chat => chat.name == 'Placas')?.id._serialized;
    portapapeles = chats.find(chat => chat.name.includes('Portapa'))?.id._serialized;
    //
    // console.log(portapapeles)
    // }
    console.log(placas, portapapeles)


  })
});

client.initialize();



function Uint8ToString(u8a) {
  var CHUNK_SZ = 0x8000;
  var c = [];
  for (var i = 0; i < u8a.length; i += CHUNK_SZ) {
    c.push(String.fromCharCode.apply(null, u8a.subarray(i, i + CHUNK_SZ)));
  }
  return c.join("");
}

app.get('/', async (req, res) => {

  if (loading) {
    res.send(loader);
  }
  else if (formVisible && !loading) {
    // Mostrar el formulario si formVisible es true
    const defaultValues = {
      VIN: "",
      YEAR: "",
      MAKE_COMPLETO: "",
      MAKE: "",
      COLOR: "",
      NAME: "",
      DIRECCION: "",
      MODEL: "LL",
      BODY: "LL",
      MINOR: "",
      date_ISS: moment().format(),
      add_exp_monts: 2,
      subs_exp_days: 1,
      DEALER_NUMBER: "P163943",
      DEALER: "HEMPHILL MOTORS",
      COUNTY: 227,
    };
    // const filePath = path.join(__dirname, 'formulario.html');

    // Leer el contenido del archivo HTML
    let html = fs.readFileSync('./form.html', 'utf-8');
    Object.entries(defaultValues).forEach(([key, value]) => {
      let regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, value);
    });
    if (error_message) {
      html = html.replace('{{error_message}}', `<p class="error-message">${error_message}</p>`);
    }
    else {
      html = html.replace('{{error_message}}', '');
    }
    res.send(html);
  } else {
    // Generar el código QR
    qrcode.toDataURL(qr_data, (err, url) => {
      if (err) {
        console.error('Error generando el código QR:', err);
        res.sendStatus(500);
        return;
      }
      // Renderizar la página HTML con el código QR
      res.send(`
                <!DOCTYPE html>
                <html>
                    <head>
                        <title>WhatsApp QR</title>
                    </head>
                    <body>
                        <h1>Escanear el código QR</h1>
                        <img src="${url}" alt="WhatsApp QR">
                    </body>
                </html>
            `);
    });
  }
});

app.post('/generar', async (req, res) => {
  if (loading) {
    return res.redirect('/');
  }
  try {
    error_message = null;
    console.log("request", req.body);
    const data = {
      VIN: req.body.VIN,
      YEAR: req.body.YEAR,
      MAKE_COMPLETO: req.body.MAKE_COMPLETO,
      MAKE: req.body.MAKE || req.body.MAKE_COMPLETO || "",
      COLOR: req.body.COLOR,
      NAME: req.body.NAME,
      DIRECCION: req.body.DIRECCION,
      MODEL: req.body.MODEL || "LL",
      BODY: req.body.BODY || "LL",
      MINOR: req.body.MINOR || "",
      date_ISS: req.body.date_ISS || moment().format(),
      add_exp_monts: req.body.add_exp_monts || 2,
      subs_exp_days: req.body.subs_exp_days || 1,
      DEALER_NUMBER: req.body.DEALER_NUMBER || "P163943",
      DEALER: req.body.DEALER || "HEMPHILL MOTORS",
      COUNTY: req.body.COUNTY || 227,
    };
    console.log("data: ", JSON.stringify(data));
    if (!data?.DIRECCION || !data.DIRECCION.includes('|')) {
      error_message = `Datos Faltantes o incorrectos ${req.body}`;
      throw new Error('Datos Faltantes o incorrectos');
    }
    client.sendMessage(portapapeles, `Preparando`)
    fillForm(...Object.values(data)).then(async ([ruta, archivo, pdfBytes]) => {

      console.log(ruta);

      // let b64encoded = btoa(Uint8ToString(pdfBytes));
      // const media = new MessageMedia('application/pdf', b64encoded);
      // media.filename = archivo + ".pdf";
      // const media = MessageMedia.fromFilePath(path);
      // console.log(media)

      let path = "http://localhost:3000/pdfs/" + archivo + ".pdf";
      console.log(path)
      const media = await MessageMedia.fromUrl(path);
      console.log(media)
      console.log("sending");
      client.sendMessage(portapapeles, `Enviando archivo ${media}`,)

      const chat = await client.getChatById(portapapeles);


      chat.sendMessage(media)
        .then((msg) => {
          console.log(msg)
          chat.sendMessage(portapapeles, `archivo ${archivo} enviado`)
        }).catch((err) => {
          console.log(err)
          chat.sendMessage(portapapeles, `Error enviando archivo ${archivo} ${err}`)
        })
      // client.sendMessage(portapapeles, media, {
      //   sendMediaAsDocument: true,
      // }).then((msg) => {
      //   console.log(msg)
      //   client.sendMessage(portapapeles, `archivo ${archivo} enviado`)
      // }).catch((err) => {
      //   console.log(err)
      //   client.sendMessage(portapapeles, `Error enviando archivo ${archivo} ${err}`)
      // })
    })

  } catch (error) {
    client.sendMessage(portapapeles, error.message);
  }
  res.status(200);
  res.redirect('/');
});



client.on('message_create', msg => {
  if (msg.body.includes("data:")) {
    try {
      let msg_data1 = msg.body.split("data:")[1];
      let msg_data = JSON.parse(msg_data1.replace("\n", ""));
      let data = {
        VIN: msg_data.VIN,
        YEAR: msg_data.YEAR,
        MAKE_COMPLETO: msg_data.MAKE_COMPLETO,
        MAKE: msg_data.MAKE || msg_data.MAKE_COMPLETO || "",
        COLOR: msg_data.COLOR,
        NAME: msg_data.NAME,
        DIRECCION: msg_data.DIRECCION,
        MODEL: msg_data.MODEL || "ll",
        BODY: msg_data.BODY || "ll",
        MINOR: msg_data.MINOR || "",
        date_ISS: msg_data.date_ISS || moment().format(),
        add_exp_monts: msg_data.add_exp_monts || 2,
        subs_exp_days: msg_data.subs_exp_days || 1,
        DEALER_NUMBER: msg_data.DEALER_NUMBER || "P163943",
        DEALER: msg_data.DEALER || "HEMPHILL MOTORS",
        COUNTY: msg_data.COUNTY || 227,
      };

      msg.reply(JSON.stringify(data));

      if (!data?.DIRECCION || !data.DIRECCION.includes('|')) {
        throw new Error({ message: 'Ocurrió un error al generar el PDF' });
      }
      client.sendMessage(portapapeles, `Preparando`)
      fillForm(...Object.values(data)).then(([ruta, archivo, pdfBytes, read]) => {


        var b64encoded = btoa(Uint8ToString(pdfBytes));
        const media = new MessageMedia('application/pdf', b64encoded);
        media.filename = archivo + ".pdf";
        client.sendMessage(portapapeles, media, { sendMediaAsDocument: true, caption: null }).then(() => {
          msg.reply(`archivo ${archivo} enviado`)
        })
        client.sendMessage(portapapeles, `archivo ${archivo} enviado`)
      })
    }
    catch (e) {
      msg.reply(e.message);
    }
  }
});

app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});