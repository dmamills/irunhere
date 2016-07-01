"use strict";

let config = {
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    }
};

if(process.env.APP_ENV === 'development') {
    config.debug = true;
}

const knex = require('knex')(config);
module.exports = require('bookshelf')(knex);
