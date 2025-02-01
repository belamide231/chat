import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();


export const getMysqlConnection = () => {

    try {

        const connectionInstance = mysql.createPool({
            uri: process.env.LOCAL ? 'mysql://root:belamide231@localhost:3306/railway' : process.env.MYSQL_PUBLIC_URL,
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