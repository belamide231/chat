const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const dropDatabase = async () => {

    try {

        // const connectionInstance = mysql.createPool({
        //     host: 'localhost',
        //     user: 'root',
        //     password: 'belamide231',
        //     waitForConnections: true,
        //     connectionLimit: 10,
        //     queueLimit: 0
        // });

        const connectionInstance = mysql.createPool({
            uri: process.env.MYSQL_PUBLIC_URL,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        await connectionInstance.promise().query(`DROP DATABASE IF EXISTS ${process.env.MYSQL_DATABASE};`);                  
        await connectionInstance.end();

        console.log("DATABASE DROPPED SUCCESSFULLY");
        process.exit();

    } catch (error) {
        
        console.log("DATABASE DROP FAILED");
        console.log(error);
        process.exit();
    }
};
dropDatabase();
