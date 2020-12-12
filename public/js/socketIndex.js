const socket = io();

const formDesk = $( 'form' );
const inputDesk = $( 'input' );
const botonDesk = $( 'button' );

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
    console.log( 'Conectado al sevidor: Index' );
} );

socket.on( 'disconnect', () => {
    console.log( 'Servidor desconectado: Index' );
} );

formDesk.submit( ( event ) => {
    event.preventDefault();

    const desk = event.target.desk.value;

    if( isNaN( desk ) || desk <= 0 || desk >= 5 ) {
        inputDesk.val( '' );
        showSweetAlert( '#990000', 'error', 'Error...', 'El número de escritorio es inválido. Escritorios disponibles: 1, 2, 3, 4' );
        return;
    }

    inputDesk.val( '' );
    botonDesk.attr( 'disabled', '' );

    window.location = `escritorio.html?desk=${ desk }`;
} );
