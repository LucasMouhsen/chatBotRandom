const wbm = require('wbm');


/* function enviarWsp(phones, messaje) {
    wbm.start()
    .then( async () =>{
        await wbm.send(phones,messaje)
        await wbm.end();

    }).catch( err => console.log(err))
} */

async function enviarWsp(phones, messaje) {
    await wbm.send(phones, messaje)
}

async function whatsapp(numero) {
    const { Client, LocalAuth } = require('whatsapp-web.js');
    const qrcode = require('qrcode-terminal');

    const client = new Client({
        puppeteer: { args: ["--no-sandbox"] },
        ffmpeg: './ffmpeg',
        authStrategy: new LocalAuth({
            clientId: 'BOT_WSP'
        })
    });
    client.on('qr', (qr) => {
        qrcode.generate(qr, { small: true });
    });
    
    client.on('ready', () => {
        console.log('Client is ready!');
    });
    await client.sendMessage(numero,'Hola pa')
    
    client.initialize();
}

module.exports = { enviarWsp, whatsapp }