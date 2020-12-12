const { Schema, model } = require( 'mongoose' );

const TicketAtendidoSchema = new Schema( {
    dayDate: {
        type: Number,
        required: [ true, 'El día del mes es obligatorio' ]
    },
    ticket: {
        type: Number,
        required: [ true, 'El ticket es obligatorio' ]
    },
    state: {
        type: Boolean,
        required: [ true, 'El estado del ticket es obligatorio' ],
        default: true
    },
    client: {
        type: Number,
        required: [ true, 'La identificación del cliente es obligatoria' ]
    },
    desk: {
        type: Number
    }
} );

module.exports = model( 'TicketAtendido', TicketAtendidoSchema );
