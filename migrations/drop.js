const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const dropDatabase = async () => {

    try {

        connectionInstance = mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        await connectionInstance.promise().query("DROP DATABASE chat;");        
        await connectionInstance.end();

        console.log("DATABASE DROP SUCCESS");
        process.exit();

    } catch (error) {
        
        console.log("DATABASE DROP FAILED");
        console.log(error);
        process.exit();
    }
};
dropDatabase();
