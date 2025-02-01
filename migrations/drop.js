const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const dropDatabase = async () => {

    try {

        let connectionInstance;

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
