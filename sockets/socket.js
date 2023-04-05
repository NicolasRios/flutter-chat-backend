const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');


// Mensajes de Sockets
io.on('connection',  (client) => {
    console.log('Cliente conectado');

    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']);

    //Verificar Autenticação
    if(!valido){return client.disconnect();}

    //Cliente Autenticado
    usuarioConectado( uid );

    //Ingressar Usuario em uma sala particular
    client.join( uid );

    //Eschuchar del Client el mensagem personal
    client.on('mensaje-personal', async(payload) => {
        
        await grabarMensaje(payload);
        io.to(payload.para).emit('mensaje-personal', payload);
    });

    client.on('disconnect', () => {
        usuarioDesconectado( uid );
    });

    client.on('mensaje', ( payload ) => {
        console.log('Mensaje', payload);

        io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );

    });


});
