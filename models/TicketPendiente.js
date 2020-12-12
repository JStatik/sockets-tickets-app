const { Schema, model } = require( 'mongoose' );
const uniqueValidator = require( 'mongoose-unique-validator' );

const TicketPendienteSchema = new Schema( {
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
        required: [ true, 'La identificación del cliente es obligatoria' ],
        unique: true
    },
    desk: {
        type: Number
    }
} );

TicketPendienteSchema.plugin( uniqueValidator, { message: 'El cliente ingresado, ya tiene un ticket activo' } );

module.exports = model( 'TicketPendiente', TicketPendienteSchema );
