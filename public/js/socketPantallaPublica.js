const socket = io();

const ticketsPantalla = $( '.ticket' );
const escritoriosPantalla = $( '.escritorio' );

const showSweetAlert = ( color, icon, title, text ) => {
    Swal.fire({
        hideClass: {
            popup: 'animate__animated animate__zoomOut'
        },
        icon: icon,
        iconColor: color,
        showClass: {
            icon: 'animate__animated animate__flipInX',
            popup: 'animate__animated animate__zoomIn'
        },
        showConfirmButton: false,
        title: title,
        text: text,
        width: '24rem'
    } );
};

const hideSweetAlert = () => {
    Swal.close();
};

socket.on( 'connect', () => {
    console.log( 'Conectado al sevidor: Pantalla publica' );
} );

socket.on( 'disconnect', () => {
    console.log( 'Servidor desconectado: Pantalla publica' );
} );

socket.on( 'ticketsAtendidos', ( { tickets } ) => {
    if( typeof tickets === 'string' ) {
        showSweetAlert( '#031441', 'info', 'Info...', tickets );
        return;
    }

    hideSweetAlert();

    tickets.map( ( ticket, ind ) => {
        ticketsPantalla[ ind ].innerText = `Ticket ${ ticket.ticket }`;
        escritoriosPantalla[ ind ].innerText = `Escritorio ${ ticket.desk }`;
    } );

    const audio = new Audio( '../audio/new-ticket.mp3' );
    audio.play();
} );
