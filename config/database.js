const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'wantsdb.clkqhot636j7.ap-northeast-2.rds.amazonaws.com',
    user: 'wantsadmin',
    port: '3306',
    password: 'wants-rds',
    database: 'covac'
});

module.exports = {
    pool: pool
};

