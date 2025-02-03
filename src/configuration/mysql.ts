import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();


export const getMysqlConnection = () => {

    let uri = 'mysql://root:belamide231@localhost:3306';

    try {

        if(process.env.CLOUD_BASE)
            uri = process.env.MYSQL_PUBLIC_URL as string;
        if(process.env.CLOUD_HOST)
            uri = process.env.MYSQL_URL as string;

        const connectionInstance = mysql.createPool({
            uri,
            database: process.env.MYSQL_DATABASE,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        console.log(process.env.LOCAL ? 'LOCAL' : 'CLOUD' + ' CONNECTED TO MYSQL');
        return connectionInstance;

    } catch(error) {

        console.log("MYSQL ERROR");
        console.log(error);
        process.exit();
    }
};