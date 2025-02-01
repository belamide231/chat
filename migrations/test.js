const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const test = async () => {
    try {

        if(process.env.LOCAL) {

            connectionInstance = mysql.createPool({
                uri: 'mysql://root:belamide231@localhost:3306',
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });        
    
        } else {

            connectionInstance = mysql.createPool({
                uri: process.env.MYSQL_PUBLIC_URL,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });    

        }

        await connectionInstance.promise().query(`CREATE DATABASE IF NOT EXISTS railway;`);      
        console.log(await connectionInstance.promise().query(`SHOW DATABASES;`));    
        await connectionInstance.end();

        process.exit();
    } catch (error) {
        console.log(error);
        process.exit();
    }
};

test();






// 'mysql://root:gyallAiFGHYtUyAUDFPtIdNDSGAkUMWe@viaduct.proxy.rlwy.net:11009/railway'