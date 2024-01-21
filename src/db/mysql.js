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

// check cnection
conection.getConnection()
    .then((connection) => {
        console.log('🚀[DB READY]🚀');
        connection.release();
    })
    .catch((err) => {
        // Paramos nodejs
        console.error("⏰  !!! [DB ERROR] !!! ⏰");
    });


module.exports = conection;
