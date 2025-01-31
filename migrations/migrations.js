const mysql = require('mysql2');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
dotenv.config();

const recursion = async (connectionInstance, sql) => {

    await connectionInstance.promise().query(sql[0]);
    sql.shift();

    if(sql.length !== 1) {

        await recursion(connectionInstance, sql);
    }

    return;
}

const startMigrations = async () => {

    try {

        connectionInstance = mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        await connectionInstance.promise().query("CREATE DATABASE IF NOT EXISTS chat;");
        await connectionInstance.promise().query("USE chat;");
        
        // TABLES
        await recursion(connectionInstance, fs.readFileSync(path.join(__dirname, 'tables.sql'), 'utf-8').split(';'));

        // PROCEDURES
        await recursion(connectionInstance, fs.readFileSync(path.join(__dirname, './procedures/message.sql'), 'utf-8').split(';;'));
        await recursion(connectionInstance, fs.readFileSync(path.join(__dirname, './procedures/ticket.sql'), 'utf-8').split(';;'));
        await recursion(connectionInstance, fs.readFileSync(path.join(__dirname, './procedures/profile.sql'), 'utf-8').split(';;'));
        await recursion(connectionInstance, fs.readFileSync(path.join(__dirname, './procedures/role.sql'), 'utf-8').split(';;'));
        await recursion(connectionInstance, fs.readFileSync(path.join(__dirname, './procedures/account.sql'), 'utf-8').split(';;'));

        // INITIALS
        await recursion(connectionInstance, fs.readFileSync(path.join(__dirname, 'calls.sql'), 'utf-8').split(';'));
        
        await connectionInstance.end();

        console.log("MIGRATING DATABASE SUCCESS");
        process.exit();


    } catch (error) {

        console.log("MIGRATING DATABASE FAILED");
        console.log(error);
        process.exit();

    }
};
startMigrations();
