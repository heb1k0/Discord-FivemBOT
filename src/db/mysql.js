const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const conection = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

module.exports = conection;