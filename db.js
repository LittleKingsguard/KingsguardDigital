const postgres = require('postgres');

const sql = postgres({
    host: process.env.dbhost,
    port: process.env.dbport,
    database: process.env.dbname,
    username: process.env.dbuser,
    password: process.env.dbpassword
});

module.exports = sql;