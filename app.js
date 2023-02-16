const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MySQLAdapter = require('@bot-whatsapp/database/mysql')

/**
 * Declaramos las conexiones de MySQL
 */
const MYSQL_DB_HOST = 'containers-us-west-156.railway.app'
const MYSQL_DB_USER = 'root'
const MYSQL_DB_PASSWORD = 'nXHt2myrS7CBr7GcwdGO'
const MYSQL_DB_NAME = 'railway'
const MYSQL_DB_PORT = 7011

/**
 * Aqui declaramos los flujos hijos, los flujos se declaran de atras para adelante, es decir que si tienes un flujo de este tipo:
 *
 *          Menu Principal
 *           - SubMenu 1
 *             - Submenu 1.1
 *           - Submenu 2
 *             - Submenu 2.1
 *
 * Primero declaras los submenus 1.1 y 2.1, luego el 1 y 2 y al final el principal.
 */
const flowFormulario = addKeyword(['formulario'])
    .addAnswer(
        ['Hola!', 'Escriba su *Nombre* para generar su solicitud'], { capture: true, buttons: [{ body: '❌ Cancelar solicitud' }] },
        async(ctx, { flowDynamic, endFlow }) => {
            if (ctx.body == '❌ Cancelar solicitud') {
                await flowDynamic([{
                    body: '❌ *Su solicitud de cita ha sido cancelada* ❌',
                    buttons: [{ body: '⬅️ Volver al Inicio' }],
                }, ])
                return endFlow()
            }
        }
    )
    .addAnswer(
        ['También necesito tus dos apellidos'], { capture: true, buttons: [{ body: '❌ Cancelar solicitud' }] },
        async(ctx, { flowDynamic, endFlow }) => {
            if (ctx.body == '❌ Cancelar solicitud') {
                await flowDynamic([{
                    body: '❌ *Su solicitud de cita ha sido cancelada* ❌',
                    buttons: [{ body: '⬅️ Volver al Inicio' }],
                }, ])
                return endFlow()
            }
        }
    )
    .addAnswer(
        ['Dejeme su número de teléfono y le llamaré lo antes posible.'], { capture: true, buttons: [{ body: '❌ Cancelar solicitud' }] },
        async(ctx, { flowDynamic, endFlow }) => {
            if (ctx.body == '❌ Cancelar solicitud') {
                await flowDynamic([{
                    body: '❌ *Su solicitud de cita ha sido cancelada* ❌',
                    buttons: [{ body: '⬅️ Volver al Inicio' }],
                }, ])
                return endFlow()
            }
        }
    )

const flowStringBtn = addKeyword('btn', 'boton', 'botón').addAnswer('Este mensaje envia tres botones', {
    buttons: [{
            body: 'Boton 1',
            id: 'token-asd'
        },
        {
            body: 'Boton 2',
            id: 'token-123'
        },
        {
            body: 'Boton 3',
            id: 'token-xyz'
        },
        {
            body: 'Boton 4',
            id: 'token-abc'
        }
    ],
    capture: true,
    delay: (0)
})

const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer(['📄 Aquí tenemos el flujo secundario'])

const flowDocs = addKeyword(['doc', 'documentacion', 'documentación']).addAnswer(
    [
        '📄 Aquí encontras las documentación recuerda que puedes mejorarla',
        'https://bot-whatsapp.netlify.app/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null, [flowSecundario]
)

const flowTuto = addKeyword(['tutorial', 'tuto']).addAnswer(
    [
        '🙌 Aquí encontras un ejemplo rapido',
        'https://bot-whatsapp.netlify.app/docs/example/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null, [flowSecundario]
)

const flowGracias = addKeyword(['gracias', 'grac', 'salir']).addAnswer(
    [
        '🚀 Puedes aportar tu granito de arena a este proyecto',
        '[*opencollective*] https://opencollective.com/bot-whatsapp',
        '[*buymeacoffee*] https://www.buymeacoffee.com/leifermendez',
        '[*patreon*] https://www.patreon.com/leifermendez',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null, [flowSecundario]
)

const flowDiscord = addKeyword(['discord']).addAnswer(
    ['🤪 Únete al discord', 'https://link.codigoencasa.com/DISCORD', '\n*2* Para siguiente paso.'],
    null,
    null, [flowSecundario]
)

const flowImg = addKeyword(['imagen', 'img']).addAnswer('Este mensaje envia una imagen', {
    media: 'https://content.app-sources.com/s/71425562438133975/uploads/Images/Foto4-9413559.png',
}).addAnswer('Para volver al fluo principal', {
    buttons: [{
            body: 'regresar',
            id: 'token-asd'
        },
        {
            body: 'salir',
            id: 'token-123'
        }
    ],
    capture: true,
    delay: (0)
}, null, [flowGracias])

const flowPrincipal = addKeyword(['halo', 'ole', 'alo', 'Volver', 'regresar', 'volver al flujo principal'])
    .addAnswer('🙌 Hola bienvenido a este *Chatbot*')
    .addAnswer(
        [
            'te comparto los siguientes links de interes sobre el proyecto',
            '👉 *doc* para ver la documentación',
            '👉 *gracias*  para ver la lista de videos',
            '👉 *discord* unirte al discord',
        ],
        null,
        null, [flowDocs, flowGracias, flowTuto, flowDiscord, flowImg]
    )

const main = async() => {
    const adapterDB = new MySQLAdapter({
        host: MYSQL_DB_HOST,
        user: MYSQL_DB_USER,
        database: MYSQL_DB_NAME,
        password: MYSQL_DB_PASSWORD,
        port: MYSQL_DB_PORT
    })
    const adapterFlow = createFlow([flowPrincipal, flowStringBtn, flowFormulario])
    const adapterProvider = createProvider(BaileysProvider)
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    QRPortalWeb()
}

main()