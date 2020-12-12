const socket = io();

const labelTicket = $( '#lblNuevoTicket' );
const formNewTicket = $( 'form' );
const inputClient = $( 'input' );
const botonNuevoTicket = $( 'button' );

const showSweetAlert = ( color, icon, title, text ) => {
    Swal.fire({
        confirmButtonColor: color,
        hideClass: {
            popup: 'animate__animated animate__zoomOut'
        },
        icon: icon,
        iconColor: color,
        showClass: {
            icon: 'animate__animated animate__flipInX',
            popup: 'animate__animated animate__zoomIn'
        },
        title: title,
        text: text,
        width: '24rem'
    } );
};

socket.on( 'connect', () => {
    console.log( 'Conectado al sevidor: Nuevo Ticket' );
} );

socket.on( 'disconnect', () => {
    console.log( 'Servidor desconectado: Nuevo Ticket' );
} );

socket.on( 'ultimoTicket', ( { lastTicket } ) => {
    labelTicket.text( lastTicket );
} );

formNewTicket.submit( ( event ) => {
    event.preventDefault();

    const client = event.target.client.value;

    if( isNaN( client ) || client.length > 8 || client.length < 7 ) {
        inputClient.val( '' );
        showSweetAlert( '#990000', 'error', 'Error...', 'El número de cliente es inválido, intente nuevamente' );
        return;
    }

    inputClient.val( '' );
    botonNuevoTicket.attr( 'disabled', '' );

    socket.emit( 'crearTicket', { client: client }, ( respuestaServidor ) => {
        if( respuestaServidor.err ) {
            showSweetAlert( '#990000', 'error', 'Error...', respuestaServidor.err );
            botonNuevoTicket.removeAttr( 'disabled' );

            return;
        }

        if( respuestaServidor.info ) {
            showSweetAlert( '#031441', 'info', 'Info...', respuestaServidor.info );
            botonNuevoTicket.removeAttr( 'disabled' );

            return;
        }

        socket.emit( 'ultimoTicket', { lastTicket: respuestaServidor.ticket } );
        labelTicket.text( respuestaServidor.ticket );
        botonNuevoTicket.removeAttr( 'disabled' );
    } );
} );
