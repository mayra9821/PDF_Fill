import express from 'express';
import path from 'path';
import fillForm from "./Editar_PDF4.js"
import moment from 'moment';
import express from 'express';
import qrcode from 'qrcode';
import { Client } from 'whatsapp-web.js';


const app = express();
app.use(express.json());

const client = new Client();


app.get('/', (req, res) => {
    // Genera el código QR
    qrcode.toDataURL(client.generateLink(), (err, url) => {
      if (err) {
        console.error('Error generando el código QR:', err);
        res.sendStatus(500);
        return;
      }
  
      // Renderiza la página HTML con el código QR
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>WhatsApp QR</title>
          </head>
          <body>
            <img src="${url}" alt="WhatsApp QR">
          </body>
        </html>
      `);
    });
  });
  
  client.on('authenticated', (session) => {
    console.log('Cliente de WhatsApp autenticado');
    // Puedes guardar la sesión para usarla en futuros reinicios
    // session.save();
  });
  
  client.initialize();
  


app.post('/endpoint', async (req, res) => {
    try {
        console.log(req.body)
        const data = await {
            "VIN": req.body.VIN, //
            "YEAR": req.body.YEAR, //
            "MAKE_COMPLETO": req.body.MAKE_COMPLETO,//
            "MAKE": req.body.MAKE ? req.body.MAKE : req.body.MAKE_COMPLETO, //
            "COLOR": req.body.COLOR,
            "NAME": req.body.NAME,
            "DIRECCION": req.body.DIRECCION,
            "MODEL": req.body.MODEL ? req.body.MODEL : 'll',
            "BODY": req.body.BODY ? req.body.BODY : 'll',
            "MINOR": req.body?.MINOR,
            "date_ISS": req.body.date_ISS ? req.body?.date_ISS: moment(),
            "add_exp_monts": req.body.add_exp_monts ? req.body?.add_exp_monts : 2,
            "subs_exp_days": req.body.subs_exp_days ? req.body?.subs_exp_days : 1,
            "DEALER_NUMBER": req.body.DEALER_NUMBER ? req.body.DEALER_NUMBER : "P163943",
            "DEALER":  req.body.DEALER  ? req.body?.DEALER : "HEMPHILL MOTORS",
            "COUNTY": req.body.COUNTY ? req.body?.COUNTY :227,
        }
        console.log(data)
        if (!data?.DIRECCION || !data.DIRECCION.includes('|')) {
            res.status(400).json({ error: 'Ocurrió un error al generar el PDF' });
        }
        console.log("paso")
        const [ruta, archivo] = await fillForm(...Object.values(data))
        console.log(ruta)
        // Establecer los encabezados de la respuesta
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${archivo}.pdf"`);
        
        // Enviar el archivo como la respuesta
        res.sendFile(ruta);
    } catch (error) {
        // Manejo de errores
        res.status(500).json({ error: error.message });
    }
});
  


app.get('/descargar-archivo', (req, res) => {
    const filePath = path.join(__dirname, 'ruta-del-archivo'); // Reemplaza 'ruta-del-archivo' con la ubicación real del archivo en tu sistema
    res.download(filePath);
});
  

app.listen(3000, () => {
    console.log('Servidor iniciado en el puerto 3000');
  });