const { addKeyword } = require('@bot-whatsapp/bot');
const  luxon  = require('luxon');
const  axios  = require('axios');

const flowGracias = addKeyword(['gracias', 'grac', 'salir']).addAnswer(
    [
        '🚀 Puedes probar nuestro periodo de prueba',
        '\n[*Keo planner*] https://www.keoplanner.com',
    ],
    {media:'https://content.app-sources.com/s/71425562438133975/uploads/Images/Logo_PNG-9411025.png'},
    null
)

const flowImgTasa = addKeyword(['tasa del dia','Ver tasa del día']).addAnswer('Tasa del día', {
    media: 'https://drive.google.com/file/d/19dQ5te_ocfVau2-X_vgvsezvgIGZcJkz/view',
}).addAnswer('¿Qué desea hacer?', {
    buttons: [{
            body: 'menu principal',
            id: 'token-menu',
        },
        {
            body: 'salir',
            id: 'token-salir',
        }
    ],
    capture: true,
    delay: (0)
}, null, [flowGracias])

const flowTasa = addKeyword(['Ta5sa','tas5a']).addAnswer(
    ['Elija un país:','Venezuela','Perú','Chile','Argentina','Colombia','Ecuador', 'Otro', '\n Para siguiente saber la tasa del mismo.'],
    {
        buttons: [{
                body: 'menu principal',
                id: 'token-menu',
            },
            {
                body: 'salir',
                id: 'token-salir',
            }
        ],
        capture: true,
        delay: (0)
    },
    null, [flowGracias]
)

const flowImg = addKeyword(['tasa', 'Tasa del día']).addAnswer('Este mensaje envia una imagen', {
    media: 'https://content.app-sources.com/s/71425562438133975/uploads/Images/Foto4-9413559.png',
}).addAnswer('Para volver al fluo principal', {
    buttons: [{
            body: 'regresar',
            id: 'token-menu',
        },
        {
            body: 'salir',
            id: 'token-salir',
        }
    ],
    // capture: true,
    delay: (0)
}, null, [flowGracias, flowImgTasa])

const flowStatistics = addKeyword(['estadistica', 'metrica'])
    .addAnswer('Estamos procesando su solicitud.', {
        media:'https://mpnecuador.files.wordpress.com/2014/06/website-analytics.png',
        delay: (5)
    },
    async (ctx,{flowDynamic}) =>{
        console.log('Mensaje: ',ctx)
        dataInit = Number(ctx.messageTimestamp)*1000;
        // dataEnd = dateInit[Symbol.toPrimitive]('number');
        let okPlanner;
        let errorPlanner;
        let msgUser;
        let total;
        let sinAccion;
        const statistic = await axios({
            method:'get',
            url:'https://api-ws-prod.herokuapp.com/api/chat/statistics-button-pressed/?end-time=' + dataInit + '&start-time=' + (Number(dataInit) - 604800000),
        })

        const statisticHour = await axios({
            method:'get',
            url:'https://api-ws-prod.herokuapp.com/api/chat/statistics/168'
        })

        // console.log('AAA: ',statistic.data);
        // console.log('BBB: ',statisticHour.data);

        if (statistic){
            total = statistic.data.countConfirmar;
            asistir = statistic.data.countAsistir;
            anular = statistic.data.countAnular;
            ambos = statistic.data.countAmbos;
            sinAccion = total - asistir - anular - ambos;
        }

        if (statisticHour){
            okPlanner = statisticHour.data.countSuccess;
            errorPlanner = statisticHour.data.countFailBadRequest + statisticHour.data.countFailNotAcceptable + statisticHour.data.countFailNotFound + statisticHour.data.countFailUnauthorized + statisticHour.data.countFailConflict + statisticHour.data.countFailUnprocessableEntity + statisticHour.data.countFailOther;
            msgUser = statisticHour.data.countMsgText;
        }

        return flowDynamic(`*Estadisticas de los ultimos 7 días*
            \n\n*Estadisticas de las plantillas de confirmaciones de reservas*
            \nTotal de plantillas enviadas: ${total}
            \n\nBotones presionados:
            \nAsistir: ${asistir}
            Anular: ${anular}
            Ambos: ${ambos}
            Sin acciones: ${sinAccion}
            \n\n*Estaditicas del estatus de los botones presionados*,
            \nOK: ${okPlanner}
            Error: ${errorPlanner}
            Cantidad de mensajes de textos escritos por el usuario: ${msgUser}`)

    },
    [flowGracias])

const flowInfo = addKeyword(['info', 'informacion', 'keoplanner', 'Información sobre Keoplanner']).addAnswer(
    [
        '🚀 Para más información le invito a ir al siguiente link.',
        '\n[*Keo planner*] https://www.keoplanner.com',
    ],
    {media:'https://content.app-sources.com/s/71425562438133975/uploads/Images/Logo_PNG-9411025.png'},
    nul,
    [flowGracias]
)

const flowTransfe = addKeyword(['trasnferencia', 'Datos para tansferir']).addAnswer(
    [
        '🚀 Para más información le invito a ir al siguiente link.',
        '\n[*Keo planner*] https://www.keoplanner.com',
    ],
    {media:'https://content.app-sources.com/s/71425562438133975/uploads/Images/Logo_PNG-9411025.png'},
    nul,
    [flowGracias]
)

let nombre;
let apellidos;
let telefono;

const flowFormulario = addKeyword(['Hola','⬅️ Volver al Inicio'])
    .addAnswer(
        ['Hola!','Para enviar el formulario necesito unos datos...' ,'Escriba su *Nombre*'],
        { capture: true, buttons: [{ body: '❌ Cancelar solicitud' }] },

        async (ctx, { flowDynamic, endFlow }) => {
            if (ctx.body == '❌ Cancelar solicitud')
             return endFlow({body: '❌ Su solicitud ha sido cancelada ❌',    // Aquí terminamos el flow si la condicion se comple
                 buttons:[{body:'⬅️ Volver al Inicio' }]                      // Y además, añadimos un botón por si necesitas derivarlo a otro flow

            
            })
            nombre = ctx.body
            return flowDynamic(`Encantado *${nombre}*, continuamos...`)
        }
    )
    .addAnswer(
        ['También necesito tus dos apellidos'],
        { capture: true, buttons: [{ body: '❌ Cancelar solicitud' }] },

        async (ctx, { flowDynamic, endFlow }) => {
            if (ctx.body == '❌ Cancelar solicitud') 
                return endFlow({body: '❌ Su solicitud ha sido cancelada ❌',
                    buttons:[{body:'⬅️ Volver al Inicio' }]


        })
        apellidos = ctx.body
        return flowDynamic(`Perfecto *${nombre}*, por último...`)
        }
    )
    .addAnswer(
        ['Dejeme su número de teléfono y le llamaré lo antes posible.'],
        { capture: true, buttons: [{ body: '❌ Cancelar solicitud' }] },

        async (ctx, { flowDynamic, endFlow }) => {
            if (ctx.body == '❌ Cancelar solicitud') 
                return endFlow({body: '❌ Su solicitud ha sido cancelada ❌',
                      buttons:[{body:'⬅️ Volver al Inicio' }]
                })


                telefono = ctx.body
                await delay(2000)
                return flowDynamic(`Estupendo *${nombre}*! te dejo el resumen de tu formulario
                \n- Nombre y apellidos: *${nombre} ${apellidos}*
                \n- Telefono: *${telefono}*`)
        }
    )

module.exports = {
    flowImg,
    flowTasa,
    flowGracias,
    flowImgTasa,
    flowFormulario,
    flowStatistics,
    flowInfo,
    flowTransfe
}