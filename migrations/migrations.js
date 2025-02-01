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

        await connectionInstance.promise().query(`CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DATABASE};`);
        await connectionInstance.promise().query(`USE ${process.env.MYSQL_DATABASE};`);
        
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
