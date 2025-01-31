import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();


export const getMysqlConnection = () => {

    try {

        // const connectionInstance = mysql.createPool({
        //     host: 'localhost',
        //     database: process.env.MYSQL_DATABASE,
        //     user: 'root',
        //     password: 'belamide231',
        //     waitForConnections: true,
        //     connectionLimit: 10,
        //     queueLimit: 0
        // });

        const connectionInstance = mysql.createPool({
            uri: `${process.env.MYSQL_PUBLIC_URL}/${process.env.MYSQL_DATABASE}`,
            database: process.env.DATABASE,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        console.log("MYSQL IS READY");

        return connectionInstance;

    } catch(error) {

        console.log(error);
        process.exit();
    }
};