const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const JsonFileAdapter = require('@bot-whatsapp/database/json')
const { giphyApi } = require('./apiGif')
const { traerPokemon } = require('./apiPoke')


const flowDiscord = addKeyword(['4', 'cuatro', 'discord'])
    .addAnswer('Aca va mi discord: https://discord.gg/aydeGtu')

const flowPoke = addKeyword(['3', 'tres', 'pokemon'])
    .addAnswer(['Pone cualquier cosa, sino no arranca'],
        { capture: true },
        async (ctx, { flowDynamic }) => {
            const {nombre, url} = await traerPokemon()
            return flowDynamic([{ body: `Te toco ${nombre}`, media: await url }])
        },
        
    )

const flowMonkeys = addKeyword(['2', 'dos', 'gif', 'monitos'])
    .addAnswer(`¿De que queres un gif? (Funciona mejor en ingles 🇬🇧💩 )`,
        { capture: true },
        async (ctx, { flowDynamic }) => {
            const {mp4Url, ismonkey} = await giphyApi(ctx.body)
            return flowDynamic([{ body: ismonkey ? 'Escribi bien salame, te dejo un gif de mono': `Buscaste ${ctx.body}`, media: mp4Url }])
        }

    )

const flowAbout = addKeyword(['1', 'uno', 'lucas'])
    .addAnswer('Lucas es un Crack 😎',
        { media: './lucasMc.png' })

const flowPrincipal = addKeyword(EVENTS.WELCOME)
    .addAnswer('🙌 Hola, soy el chatbot🤖 de Lucas')
    .addAnswer(
        [
            '¿En que te gustaria que te ayude?',
            '*1* 👉 Saber de *Lucas*🧌',
            '*2* 👉 Gif (proridad monitos🐒)',
            '*3* 👉 ¿Que pokemon sos?*💽',
            '*4* 👉 Unirte al *discord*💽',
        ],
        null,
        null,
        [flowAbout, flowMonkeys, flowPoke, flowDiscord]
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
