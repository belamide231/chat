import mysql from 'mysql2';
import dotenv from 'dotenv';
import { Pool } from 'mysql2/typings/mysql/lib/Pool';
dotenv.config();


export const getMysqlConnection = () => {

    try {

        let connectionInstance: Pool;

        if(process.env.PORT) {

            connectionInstance = mysql.createPool({
                uri: `${process.env.MYSQL_PUBLIC_URL}/${process.env.MYSQL_DATABASE}`,
                database: process.env.DATABASE,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });

        } else {

            connectionInstance = mysql.createPool({
                uri: `${process.env.MYSQL_URL}/${process.env.MYSQL_DATABASE}`,
                database: process.env.DATABASE,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });
        }

        console.log("MYSQL IS READY");

        return connectionInstance;

    } catch(error) {

        console.log(error);
        process.exit();
    }
};