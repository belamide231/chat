import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();


export const getMysqlConnection = () => {

    try {

        const connectionInstance = mysql.createPool({
            uri: process.env.LOCAL ? 'mysql://root:belamide231@localhost:3306/' + process.env.MYSQL_DATABASE : process.env.MYSQL_URL + '/' + process.env.MYSQL_DATABASE,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });    

        console.log(process.env.LOCAL ? 'LOCAL' : 'CLOUD' + ' CONNECTED TO MYSQL');
        return connectionInstance;

    } catch(error) {

        console.log(error);
        process.exit();
    }
};