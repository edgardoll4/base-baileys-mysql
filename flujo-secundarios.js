const{ addKeyword } = require('@bot-whatsapp/bot')

const flowGracias = addKeyword(['gracias', 'grac', 'salir']).addAnswer(
    [
        '🚀 Puedes probar nuestro periodo de prueba',
        '\n[*Keo planner*] https://www.keoplanner.com',
    ],
    {media:'https://www.keoplanner.com/assets/img/planner/logo.svg'},
    null
)

const flowImgTasa = addKeyword(['imagen', 'img']).addAnswer('Este mensaje envia una imagen', {
    media: 'https://content.app-sources.com/s/71425562438133975/uploads/Images/Foto4-9413559.png',
}).addAnswer('Para volver al fluo principal', {
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

const flowTasa = addKeyword(['Tasa','tasa']).addAnswer(
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

const flowImg = addKeyword(['imagen', 'img']).addAnswer('Este mensaje envia una imagen', {
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
    .addAnswer(['*Estadisticas de los ultimos 7 días*'],
    {
        media:'https://mpnecuador.files.wordpress.com/2014/06/website-analytics.png',
        buttons: [
            {
                body: 'salir',
                id: 'token-salir',
            }
        ]
    },
    async (ctx,{flowDynamic}) =>{
        dataInit = Date();
        dataEnd = dateInit[Symbol.toPrimitive]('number');
        okPlanner = '';
        errorPlanner = '';
        msgUser = '';
        total = '';
        const statistic = await axios({
            method:'get',
            url:'https://api-ws-prod.herokuapp.com/api/chat/statistics-button-pressed/?end-time=' + dataEnd + '&start-time=' + (Number(dataEnd) - 604800000),
        })

        const statisticHour = await axios({
            method:'get',
            url:'https://api-ws-prod.herokuapp.com/api/chat/statistics/'+168,
        })

        if (statistic){
            total = statistic.countConfirmar;
            asistir = statistic.countAsistir;
            anular = statistic.countAnular;
            ambos = statistic.countAmbos;
            sinAccion = total - asistir - anular - sinAccion;
        }

        if (statisticHour){
            okPlanner = statisticHour.countSuccess;
            errorPlanner = statisticHour.countFailBadRequest + statisticHour.countFailNotAcceptable + statisticHour.countFailNotFound + statisticHour.countFailUnauthorized + statisticHour.countFailConflict + statisticHour.countFailUnprocessableEntity + statisticHour.countFailOther;
            msgUser = statisticHour.countMsgText;
        }

        return flowDynamic([`*Estadisticas de las plantillas de confirmaciones de reservas*
            \nTotal de plantillas enviadas: ${total}
            \n\nBotones presionados:
            \nAsisti: ${asistir}
            \nAnular: ${anular}
            \nAmbos: ${ambos}
            \nSin acciones: ${sinAccion}`,
            `\n*staditicas del estatus de los botones presionados*,
            \nOK: ${okPlanner}
            \nError: ${errorPlanner}
            \n\nCantidad de mensajes de textos escritos por el usuario: ${msgUser}`])

    },[flowGracias]
    )

const flowInfo = addKeyword(['info', 'informacion']).addAnswer(
    [
        '🚀 Para más información le invito a ir al siguiente link.',
        '\n[*Keo planner*] https://www.keoplanner.com',
    ],
    {media:'https://www.keoplanner.com/assets/img/planner/logo.svg'},
    null
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
    flowInfo
}