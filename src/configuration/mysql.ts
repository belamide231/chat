import mysql from 'mysql2';
import dotenv from 'dotenv';
import { Pool } from 'mysql2/typings/mysql/lib/Pool';
dotenv.config();


export const getMysqlConnection = () => {

    try {

        let connectionInstance: Pool;

        if(process.env.LOCAL) {

            connectionInstance = mysql.createPool({
                uri: 'mysql://root:belamide231@localhost:3306/railway',
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

        console.log("MYSQL IS READY");
        return connectionInstance;

    } catch(error) {

        console.log(error);
        process.exit();
    }
};