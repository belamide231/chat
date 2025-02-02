import sqlite3, { Database } from "sqlite3";
import path from "path";
import fs from "fs";

// Function to get SQLite connection
export const getSqliteConnection = (): Database => {
    // Use absolute path
    const dbPath = path.resolve(__dirname, '../../db/sqlite.db');

    // Check if the directory exists
    const dirPath = path.dirname(dbPath);
    if (!fs.existsSync(dirPath)) {
        console.error('Directory does not exist:', dirPath);
        fs.mkdirSync(dirPath, { recursive: true });
        console.log('Directory created:', dirPath);
    }

    console.log('Database path:', dbPath);

    const connection = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Failed to connect to the database:', err.message);
        } else {
            console.log('Connected to SQLite database.');
        }
    });

    // Create table if it does not exist
    connection.run(`CREATE TABLE IF NOT EXISTS access_token(
        token TEXT, 
        expiry TEXT
    )`, (err) => {
        if (err) {
            console.error('Failed to create table:', err.message);
        }
    });

    // Select all entries from access_token table
    connection.all('SELECT * FROM access_token', (err, rows) => {
        if (err) {
            console.error('Failed to retrieve data:', err.message);
        } else {
            console.log('Access tokens:', rows);
        }
    });

    return connection;
};
