const socket = io();

const tituloEscritorio = $( 'h1' );
const tituloTicket = $( 'h4' );
const buttonAtender = $( 'button' );
const searchParams = new URLSearchParams( window.location.search );

if( !searchParams.has( 'desk' ) ) {
    window.location = 'index.html';

    throw new Error( 'El escritorio es necesario' );
}

const desk = searchParams.get( 'desk' );

if( isNaN( desk ) || desk <= 0 || desk >= 5 ) {
    window.location = 'index.html';

    throw new Error( 'El escritorio es incorrecto' );
}

tituloEscritorio.text( `Escritorio ${ desk }` );

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
    console.log( 'Conectado al sevidor: Escritorio' );
} );

socket.on( 'disconnect', () => {
    console.log( 'Servidor desconectado: Escritorio' );
} );

socket.on( 'ticketAtendidoInfo', ( data ) => {
    if( typeof data.ticket === 'string' ) {
        tituloTicket.text( data.ticket );

        return;
    }

    const { ticket, desk } = data;
    tituloTicket.text( `Escritorio ${ desk } atendiendo al ticket Nº ${ ticket }` );

    return;
} );

buttonAtender.on( 'click', () => {
    socket.emit( 'atenderTicket', { desk: desk }, ( respuestaServidor ) => {
        if( respuestaServidor.err ) {
            showSweetAlert( '#990000', 'error', 'Error...', respuestaServidor.err );

            return;
        }

        if( typeof respuestaServidor.ticket === 'string' ) {
            showSweetAlert( '#031441', 'info', 'Info...', respuestaServidor.ticket );
            socket.emit( 'ticketAtendido', { ticket: respuestaServidor.ticket } );
            tituloTicket.text( `${ respuestaServidor.ticket }` );

            return;
        }

        socket.emit( 'ticketAtendido', { ticket: respuestaServidor.ticket, desk: desk } );
        tituloTicket.text( `Escritorio ${ desk } atendiendo al ticket Nº ${ respuestaServidor.ticket }` );
    } );
} );
