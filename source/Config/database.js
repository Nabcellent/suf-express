const mysql = require('mysql');

const link = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

link.connect((err) => {
    if(err) {
        console.log(err.message);
    } else {
        console.log('Database ' + link.state);
    }
});

module.exports = link;