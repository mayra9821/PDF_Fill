const express = require('express');
const { fillForm } = require("./Editar_PDF4.cjs");
const moment = require('moment');
const qrcode = require('qrcode');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

let qr_data = "";
let formVisible = false; // Variable para controlar la visibilidad del formulario
let loading = true;
let ultimo_pdf = null
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/pdfs', express.static(__dirname + '/out'));
let placas = '120363044029875718@g.us'
let portapapeles = '120363044942242672@g.us'
let aleja = '12818980063@c.us'

let error_message = null;
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox'],
  },
  webVersionCache: {
    type: 'remote',
    remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2410.1.html',
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
    // for (let chat of chats) {
    //   console.log(chat.name, chat.id._serialized);
    // }
    // console.log(placas, portapapeles)
    placas = chats.find(chat => chat.name == 'Placas')?.id._serialized;
    portapapeles = chats.find(chat => chat.name.includes('Portapa'))?.id._serialized;
    aleja = chats.find(chat => chat.name == 'Cuñada Aleja')?.id._serialized;
    //
    // console.log(portapapeles)
    // }
    console.log(placas, portapapeles, aleja)
    client.getChatById(portapapeles).then((chat) => {
      chat.sendMessage(`Servidor Listo...... ${moment().format()}`)
    })

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
    ultimo_pdf = null
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
      MODEL: "",
      BODY: "",
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
    if (ultimo_pdf) {
      html = html.replace('{{ultimo_pdf}}', `<a href='/pdfs/${ultimo_pdf}.pdf' class="ultimo_pdf">Ver Ultimo PDF ${ultimo_pdf} </a>`);
    } else {
      html = html.replace('{{ultimo_pdf}}', '');
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
    // console.log("request", req.body);
    const data = {
      VIN: req.body.VIN,
      YEAR: req.body.YEAR,
      MAKE_COMPLETO: req.body.MAKE_COMPLETO,
      MAKE: req.body?.MAKE != '' ? req.body.MAKE : req.body.MAKE_COMPLETO,
      COLOR: req.body.COLOR,
      NAME: req.body.NAME,
      DIRECCION: req.body.DIRECCION,
      MODEL: req.body?.MODEL != '' ? req.body.MODEL : "LL",
      BODY: req.body?.BODY != '' ? req.body.BODY : "LL",
      MINOR: req.body.MINOR || "",
      date_ISS: req.body.date_ISS || moment().format(),
      add_exp_monts: req.body.add_exp_monts || 2,
      subs_exp_days: req.body.subs_exp_days || 1,
      DEALER_NUMBER: req.body.DEALER_NUMBER || "P163943",
      DEALER: req.body.DEALER || "HEMPHILL MOTORS",
      COUNTY: req.body.COUNTY || 227,
    };
    // console.log("data: ", JSON.stringify(data));
    if (!data?.DIRECCION || !data.DIRECCION.includes('|')) {
      error_message = `Datos Faltantes o incorrectos ${req.body}`;
      throw new Error('Datos Faltantes o incorrectos');
    }
    const [ruta, archivo, pdfBytes] = await fillForm(...Object.values(data))

    console.log(ruta);
    ultimo_pdf = archivo;
    let b64encoded = btoa(Uint8ToString(pdfBytes));
    const media = new MessageMedia('application/pdf', b64encoded);
    media.filename = archivo + ".pdf";
    // const media = MessageMedia.fromFilePath(path);
    // console.log(media)

    // let path = "http://localhost:3000/pdfs/" + archivo + ".pdf";
    // console.log(path)
    // const media = await MessageMedia.fromUrl(path);
    // console.log(media)

    const porta_chat = await client.getChatById(portapapeles);

    var chat = null
    if (req.body.CHAT == "placas") {
      chat = await client.getChatById(placas);
    }
    else if (req.body.CHAT == "aleja") {
      chat = await client.getChatById(aleja);
    }
    else if (req.body.CHAT == "portapapeles") {
      chat = porta_chat;
    }
    else {
      chat = await client.getChatById(placas);
    }



    porta_chat.sendMessage(`Enviando archivo ${media.filename}`)
    console.log(`sending ${archivo}`);
    await chat.sendMessage(media)
    await porta_chat.sendMessage(`archivo ${archivo} enviado`)
    console.log(`sent ${archivo}`);
    res.status(200);
    res.redirect('/');
    return res.end();
    // client.sendMessage(portapapeles, media, {
    //   sendMediaAsDocument: true,
    // }).then((msg) => {
    //   console.log(msg)
    //   client.sendMessage(portapapeles, `archivo ${archivo} enviado`)
    // }).catch((err) => {
    //   console.log(err)
    //   client.sendMessage(portapapeles, `Error enviando archivo ${archivo} ${err}`)
    // })

  } catch (error) {
    console.log(error)
    client.sendMessage(portapapeles, error.message);
  }
});

app.post('/generar/test', async (req, res) => {
  if (loading) {
    return res.redirect('/');
  }
  try {
    error_message = null;
    // console.log("request", req.body);
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
    // console.log("data: ", JSON.stringify(data));
    if (!data?.DIRECCION || !data.DIRECCION.includes('|')) {
      error_message = `Datos Faltantes o incorrectos ${req.body}`;
      throw new Error('Datos Faltantes o incorrectos');
    }
    const [ruta, archivo, pdfBytes] = await fillForm(...Object.values(data))
    ultimo_pdf = archivo;


    console.log(ruta);

    // let b64encoded = btoa(Uint8ToString(pdfBytes));
    // const media = new MessageMedia('application/pdf', b64encoded);
    // media.filename = archivo + ".pdf";
    // const media = MessageMedia.fromFilePath(path);
    // console.log(media)

    let path = "http://localhost:3000/pdfs/" + archivo + ".pdf";
    // console.log(path)
    const media = await MessageMedia.fromUrl(path);
    // console.log(media)
    const porta_chat = await client.getChatById(portapapeles);

    porta_chat.sendMessage(`Enviando archivo ${media.filename}`)
    console.log(`sending ${archivo}`);
    await porta_chat.sendMessage(media)
    await porta_chat.sendMessage(`archivo ${archivo} enviado`)
    console.log(`sent ${archivo}`);
    res.status(200);
    res.redirect('/');
    return res.end();
    // client.sendMessage(portapapeles, media, {
    //   sendMediaAsDocument: true,
    // }).then((msg) => {
    //   console.log(msg)
    //   client.sendMessage(portapapeles, `archivo ${archivo} enviado`)
    // }).catch((err) => {
    //   console.log(err)
    //   client.sendMessage(portapapeles, `Error enviando archivo ${archivo} ${err}`)
    // })

  } catch (error) {
    console.log(error)
    client.sendMessage(portapapeles, error.message);
  }
});


client.on('message_create', async (msg) => {

  if (msg.fromMe && msg.body.includes("+57")) {
    const porta_chat = await client.getChatById(portapapeles);
    let number = msg.body.split("+57")[1].replace(" ", "").replace("\n", "")
    porta_chat.sendMessage(`https://api.whatsapp.com/send?phone=57${number}`)
  }

  if (msg.fromMe && msg.body.includes("ping")) {
    const porta_chat = await client.getChatById(portapapeles);
    porta_chat.sendMessage(`pong ${moment().format()}`)
  }

  if (msg.fromMe && msg.body.includes("reboot")) {
    const porta_chat = await client.getChatById(portapapeles);
    porta_chat.sendMessage(`reiniciando ${moment().format()}`)
    exec('sh ./reiniciar-servidor.sh', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al ejecutar el comando: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });

  }

  if (msg.body.includes("data:")) {
    try {
      let msg_data1 = msg.body.split("data:")[1];
      let msg_data = JSON.parse(msg_data1.replace("\n", ""));
      const data = {
        VIN: msg_data.VIN,
        YEAR: msg_data.YEAR,
        MAKE_COMPLETO: msg_data.MAKE_COMPLETO,
        MAKE: msg_data?.MAKE != '' ? msg_data.MAKE : msg_data.MAKE_COMPLETO,
        COLOR: msg_data.COLOR,
        NAME: msg_data.NAME,
        DIRECCION: msg_data.DIRECCION,
        MODEL: msg_data?.MODEL != '' ? msg_data.MODEL : "LL",
        BODY: msg_data?.BODY != '' ? msg_data.BODY : "LL",
        MINOR: msg_data.MINOR || "",
        date_ISS: msg_data.date_ISS || moment().format(),
        add_exp_monts: msg_data.add_exp_monts || 2,
        subs_exp_days: msg_data.subs_exp_days || 1,
        DEALER_NUMBER: msg_data.DEALER_NUMBER || "P163943",
        DEALER: msg_data.DEALER || "HEMPHILL MOTORS",
        COUNTY: msg_data.COUNTY || 227,
      };
      // console.log("data: ", JSON.stringify(data));
      if (!data?.DIRECCION || !data.DIRECCION.includes('|')) {
        error_message = `Datos Faltantes o incorrectos ${req.body}`;
        throw new Error('Datos Faltantes o incorrectos');
      }
      client.sendMessage(portapapeles, `Preparando`)
      fillForm(...Object.values(data)).then(async ([ruta, archivo, pdfBytes, read]) => {


        let path = "http://localhost:3000/pdfs/" + archivo + ".pdf";
        // console.log(path)
        const media = await MessageMedia.fromUrl(path);
        // console.log(media)
        const chat = await client.getChatById(placas);
        const porta_chat = await client.getChatById(portapapeles);
        porta_chat.sendMessage(`Enviando archivo ${media.filename}`)
        console.log("sending");

        chat.sendMessage(media)
          .then((msg) => {
            porta_chat.sendMessage(`archivo ${archivo} enviado`)
            // console.log(msg)
          }).catch((err) => {
            porta_chat.sendMessage(`Error enviando archivo ${archivo} ${err}`)
            // console.log(err)
          })
        console.log(`sent ${archivo} `);
      })
    }
    catch (e) {
      msg.reply(e.message);
    }
  }
});

app.listen(3030, () => {
  console.log('Servidor iniciado en el puerto 3030');
});