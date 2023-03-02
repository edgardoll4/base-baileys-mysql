const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const { flowGracias, flowImgTasa, flowInfo, flowFormulario, flowStatistics, flowTransfe } = require('./flujo-secundarios')

const  luxon  = require('luxon');
const  axios  = require('axios');

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

const flowPrincipal = addKeyword(['halo', 'ole', 'alo', 'Volver', 'regresar', 'menu', 'menu principal'])
    .addAnswer('🙌 Bienvenido a este *Chatbot*')
    .addAnswer(
        [
            'Hola soy Keo su asistente virtual de Planner',
            '\nBienvenido estimado clinte',
        ],
        null,
        null
    ).addAnswer(['Tenemos las siguientes opciones para seguir interactuando'], {
        buttons: [{
                body: 'Ver tasa del día',
                id: 'token-tasa'
            },
            {
                body: 'Datos para tansferir',
                id: 'token-info'
            },
            {
                body: 'Salir',
                id: 'token-salir'
            }
        ],
        // capture: true,
        delay: (0)
    },null,[flowGracias, flowImgTasa, flowTransfe])

const flowAdmin = addKeyword(['admin', 'administracion', 'administración', 'administrador'])
    .addAnswer('🙌 Bienvenido a este *Chatbot*',{media:'https://drive.google.com/file/d/1UDaVnUpZOhEC9lmn9X4eiSMNntR7PwcL/view?usp=share_link'})
    .addAnswer(
        [
            '¡Hola soy Keo su asistente virtual de Planner!',
            '\nBienvenido estimado administador',
        ],
        null,
        null
    ).addAnswer(['Tenemos las siguientes opciones para seguir interactuando'], {
        buttons: [{
                body: 'Estadistica',
                id: 'token-statistic'
            },
            {
                body: 'Keoplanner',
                id: 'token-web'
            },
            {
                body: 'Salir',
                id: 'token-salir'
            }
        ],
        // capture: true,
        delay: (0)
    },null,[flowGracias, flowInfo, flowStatistics, flowFormulario])


const main = async() => {
    const adapterDB = new MySQLAdapter({
        host: MYSQL_DB_HOST,
        user: MYSQL_DB_USER,
        database: MYSQL_DB_NAME,
        password: MYSQL_DB_PASSWORD,
        port: MYSQL_DB_PORT
    })
    const adapterFlow = createFlow([flowPrincipal, flowAdmin ])
    const adapterProvider = createProvider(BaileysProvider)
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    QRPortalWeb()
}

main()