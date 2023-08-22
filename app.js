const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const JsonFileAdapter = require('@bot-whatsapp/database/json')
const { giphyApi } = require('./apiGif')
const { traerPokemon } = require('./apiPoke')
const { generateImage } = require('./apiEdenAi')


const flowEden = addKeyword(['5', 'cinco', 'ai'])
    .addAnswer(['Que imagen queres ver?'],
        { capture: true },
        async (ctx, { flowDynamic }) => {
            const { imagePath } = await generateImage(ctx.body)
            return flowDynamic([{ body: `Imagen generada con el siguiente prompt:\n${ctx.body}`, media: imagePath }])
        },

    )
    .addAnswer('Para ver el menu nuevamente escribi algo'
    )

const flowPoke = addKeyword(['4', 'cuatro', 'pokemon', 'poke'])
    .addAnswer(['Pone cualquier cosa, sino no arranca'],
        { capture: true },
        async (ctx, { flowDynamic }) => {
            const { nombre, url } = await traerPokemon()
            return flowDynamic([{ body: `Te toco ${nombre}`, media: url }])
        },

    )
    .addAnswer('Para ver el menu nuevamente escribi algo'
    )

const flowMonkeys = addKeyword(['3', 'tres', 'gif', 'monitos'])
    .addAnswer(`¿De que queres un gif? (Funciona mejor en ingles 🇬🇧💩 )`,
        { capture: true },
        async (ctx, { flowDynamic }) => {
            const { mp4Url, ismonkey } = await giphyApi(ctx.body)
            return flowDynamic([{ body: ismonkey ? 'Escribi bien salame, te dejo un gif de mono' : `Buscaste ${ctx.body}`, media: mp4Url }])
        }

    )
    .addAnswer('Para ver el menu nuevamente escribi algo')

const flowDiscord = addKeyword(['2', 'dos', 'discord'])
    .addAnswer('Aca va mi discord: https://discord.gg/aydeGtu')

const flowAbout = addKeyword(['1', 'uno', 'lucas'])
    .addAnswer('Lucas es un Crack 😎',
        { media: './lucasMc.png' })



const flowPrincipal = addKeyword(EVENTS.WELCOME)
    .addAnswer('🙌 Hola, soy el chatbot🤖 de Lucas')
    .addAnswer(
        [
            '¿En que te gustaria que te ayude?',
            '*1*. 👉 Saber de *Lucas*🧌',
            '*2*. 👉 Unirte al *discord*💽',
            '*3*. 👉 Gif (proridad monitos🐒)',
            '*4*. 👉 ¿Que pokemon sos?*💽',
            '*5*. 👉 Imagen generada por Ai💽',
        ],
        null,
        null,
        [flowAbout, flowMonkeys, flowPoke, flowDiscord, flowEden]
    )

const main = async () => {
    const adapterDB = new JsonFileAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    QRPortalWeb()
}

main()
