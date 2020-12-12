const colors = require( 'colors' );
const { io } = require( '../app' );
const { TicketControl } = require( '../classes/ticketControl' );

const ticketControl = new TicketControl();

io.on( 'connection', async( client ) => {
    console.log( colors.yellow( 'Usuario conectado' ) );

    client.on( 'disconnect', () => {
        console.log( colors.red( 'Usuario desconectado' ) );
    } );



    client.on( 'crearTicket', async( data, callback ) => {
        if( !callback ) return;

        if( !data.client ) {
            return callback( { err: 'El cliente es obligatorio.' } );
        }

        const ticketDB = await ticketControl.verificarExisteCliente( data.client );

        if( ticketDB.ticket ) {
            return callback( { info: `Ya posee el ticket Nº ${ ticketDB.ticket }, en breve será atendido.` } );
        }

        if( !ticketDB.ticket ) {
            await ticketControl.generarTicket( data.client );

            client.broadcast.emit( 'ticketAtendidoInfo', await ticketControl.obtenerUltimoTicketAtendido() );

            return callback( { ticket: `Ticket ${ ticketControl.lastTicket }` } );
        }
    } );

    client.on( 'ultimoTicket', ( data ) => {
        client.broadcast.emit( 'ultimoTicket', data );
    } );

    client.emit( 'ultimoTicket', { lastTicket: await ticketControl.obtenerUltimoTicket() } );



    client.on( 'atenderTicket', async( data, callback ) => {
        if( !callback ) return;

        if( !data.desk ) {
            return callback( { err: 'El escritorio es obligatorio' } );
        }

        const ticketAtendido = await ticketControl.atenderTickets( data.desk );

        if( typeof ticketAtendido.ticket !== 'string' ) {
            client.broadcast.emit( 'ticketsAtendidos', await ticketControl.obtenerUltimosTicketsAtentidos() );
        }

        return callback( ticketAtendido );
    } );

    client.on( 'ticketAtendido', ( data ) => {
        client.broadcast.emit( 'ticketAtendidoInfo', data );
    } );

    client.emit( 'ticketAtendidoInfo', await ticketControl.obtenerUltimoTicketAtendido() );


    
    client.emit( 'ticketsAtendidos', await ticketControl.obtenerUltimosTicketsAtentidos() );
} );
