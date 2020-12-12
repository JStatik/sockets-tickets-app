const dotenv = require( 'dotenv' ).config();
const colors = require( 'colors' );
const path = require( 'path' );
const cors = require( 'cors' );
const express = require( 'express' );
const http = require( 'http' );
const socketIO = require( 'socket.io' );
const { dbConnection } = require( './database/config' );

const app = express();
const server = http.createServer( app );

if( dotenv.error ) {
    return console.log( colors.magenta( dotenv.error ) );
}

/**************************************************************************** BASE DE DATOS ****************************************************************************/
dbConnection();

/**************************************************************************** CORS ****************************************************************************/
app.use( cors() );

/************************************************************************** DIRECTORIO PUBLICO **************************************************************************/
app.use( express.static( path.resolve( __dirname, './public' ) ) );

/****************************************************************************** SOCKET IO ******************************************************************************/
module.exports.io = socketIO( server );
require( './sockets/socket' );

/******************************************************************************** SERVER ********************************************************************************/
server.listen( process.env.PORT, () => {
    console.log( colors.yellow( `Servidor corriendo en puerto: ${ process.env.PORT }` ) );
} );
