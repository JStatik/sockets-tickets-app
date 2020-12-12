const colors = require( 'colors' );
const LastTicket = require( '../models/LastTicket' );
const TicketAtendido = require( '../models/TicketAtendido' );
const TicketPendiente = require( '../models/TicketPendiente' );

class TicketControl {
    constructor() {
        this.lastTicket = 0;
        this.dayDate = new Date().getDate();

        LastTicket.findById( process.env.LAST_TICKET_ID, async( err, lastTicketDB ) => {
            if( err ) {
                console.log( colors.magenta( err ) );
                return;
            }

            if( lastTicketDB.dayDate === this.dayDate ) {
                this.lastTicket = lastTicketDB.lastTicket;
            } else {
                await this.reiniciarTicketsDB();
                console.log( colors.white( 'Se ha reseteado el sistema' ) );
            }
        } );
    }



    reiniciarTicketsDB = async() => {
        this.lastTicket = 0;

        const newLastTicket = {
            client: 0,
            dayDate: this.dayDate,
            lastTicket: this.lastTicket
        };

        await this.eliminarTicketsAtendidos();
        await this.eliminarTicketsPendientes();
        await this.actualizarUltimoTicket( newLastTicket );
    };

    eliminarTicketsAtendidos = async() => {
        try {
            await TicketAtendido.deleteMany( { dayDate: ( this.dayDate - 1 ) } );

            return;
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };

    eliminarTicketsPendientes = async() => {
        try {
            await TicketPendiente.deleteMany( { dayDate: ( this.dayDate - 1 ) } );

            return;
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };

    actualizarUltimoTicket = async( newLastTicket ) => {
        try {
            await LastTicket.findByIdAndUpdate( process.env.LAST_TICKET_ID, newLastTicket, { new: true } );

            return;
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };



    verificarExisteCliente = async( client ) => {
        try {
            const ticketPendiente = await TicketPendiente.findOne( { client: client } );

            if( !ticketPendiente ) {
                return {
                    ticket: false
                };
            }

            if( ticketPendiente ) {
                return {
                    ticket: ticketPendiente.ticket
                };
            }
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };

    generarTicket = async( client ) => {
        this.lastTicket += 1;

        const newTicket = {
            dayDate: this.dayDate,
            client: client,
            ticket: this.lastTicket           
        };

        const newLastTicket = {
            client: client,
            lastTicket: this.lastTicket
        };

        await this.crearTicketPendiente( newTicket );
        await this.actualizarUltimoTicket( newLastTicket );
        console.log( colors.white( 'Nuevo ticket creado' ) );
    };

    crearTicketPendiente = async( newTicket ) => {
        try {
            const ticketPendiente = new TicketPendiente( newTicket );
            await ticketPendiente.save();

            return;
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };

    obtenerUltimoTicket = async() => {
        try {
            const { lastTicket } = await LastTicket.findById( process.env.LAST_TICKET_ID );

            return `Ticket ${ lastTicket }`;
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };



    atenderTickets = async( desk ) => {
        try {
            const { ticket } = await this.obtenerTicketPendiente();

            if( ticket === 'Todos los tickets han sido atendidos.' ) {
                return {
                    ticket
                };
            }

            const { dayDate: dayDateAtendido, client: clientAtendido, ticket: ticketAtendido } = ticket;
            await this.crearTicketAtendido( { state: false, dayDate: dayDateAtendido, client: clientAtendido, ticket: ticketAtendido, desk: desk } );
            await this.eliminarTicketPendiente( clientAtendido );
            console.log( colors.white( 'Ticket atendido' ) );

            return {
                ticket: ticketAtendido
            };
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };

    obtenerTicketPendiente = async() => {
        try {
            const tickets = await TicketPendiente.find().sort( { ticket: 'asc' } ).limit( 1 ).exec();

            if( tickets.length === 0 ) {
                return {
                    ticket: 'Todos los tickets han sido atendidos.'
                };
            }

            return {
                ticket: tickets[ 0 ]
            };
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };

    crearTicketAtendido = async( ticket ) => {
        try {
            const ticketAtendido = new TicketAtendido( ticket );
            await ticketAtendido.save();

            return;
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };

    eliminarTicketPendiente = async( client ) => {
        try {
            await TicketPendiente.findOneAndDelete( { client: client } );

            return;
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };

    obtenerUltimoTicketAtendido = async() => {
        try {
            const ticketPendiente = await this.obtenerTicketPendiente();

            if( typeof ticketPendiente.ticket === 'string' ) {
                return {
                    ticket: 'Todos los tickets han sido atendidos.'
                };
            }

            
            if( typeof ticketPendiente.ticket === 'object' ) {
                return {
                    ticket: 'Hay tickets pendientes de atención.'
                };
            }

            const tickets = await TicketAtendido.find().sort( { ticket: 'desc' } ).limit( 1 ).exec();

            if( tickets.length === 0 ) {
                return {
                    ticket: 'Todos los tickets han sido atendidos.'
                };
            }
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };



    obtenerUltimosTicketsAtentidos = async() => {
        try {
            const ticketsAtendidos = await TicketAtendido.find().sort( { ticket: 'desc' } ).limit( 4 ).exec();

            if( ticketsAtendidos.length === 0 ) {
                return {
                    tickets: 'En breve, comenzaremos a antender.'
                }
            }

            return {
                tickets: ticketsAtendidos
            };
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };
};

module.exports = {
    TicketControl
};
