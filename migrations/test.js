const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const test = async () => {
    try {
        const uri = 'mysql://root:gyallAiFGHYtUyAUDFPtIdNDSGAkUMWe@viaduct.proxy.rlwy.net:11009';

        const connectionInstance = mysql.createPool({
            uri,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        await connectionInstance.promise().query(`CREATE DATABASE railway;`);      
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