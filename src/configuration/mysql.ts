import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();


export const getMysqlConnection = () => {

    try {

        const connectionInstance = mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
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