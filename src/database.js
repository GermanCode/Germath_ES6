//importacion de modulos para conexión La Base de Datos
//Inclusion de EcmaScript6 para soporte de Clases y Constantes en Javascipt Node.JS

import mysql from 'mysql';
import {promisify} from 'es6-promisify';

const { database } = require('./keys.js');
const pool = mysql.createPool( database );

pool.getConnection((err, connection) => {
    if(err) {
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
        console.error('DATABASE CONNECTION WAS CLOSED');
    }
    if(err.code === 'ER_CON_COUNT_ERROR'){
        console.error('DATABASE HAS TO MANY CONNECTIONS');
    }
    if(err.code === 'ECONNREFUSED'){
        console.error('DATABASE CONNECTION WAS REFUSED');
    }
}
    if(connection) connection.release();
    console.log('DB IS CONNECTED');
    return;
});

// Promisify pool querys
pool.query = promisify(pool.query)

module.exports = pool;

