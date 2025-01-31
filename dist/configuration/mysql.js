"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMysqlConnection = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getMysqlConnection = () => {
    try {
        let connectionInstance;
        if (process.env.PORT) {
            connectionInstance = mysql2_1.default.createPool({
                uri: `${process.env.MYSQL_PUBLIC_URL}/${process.env.MYSQL_DATABASE}`,
                database: process.env.DATABASE,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });
        }
        else {
            connectionInstance = mysql2_1.default.createPool({
                uri: `${process.env.MYSQL_URL}/${process.env.MYSQL_DATABASE}`,
                database: process.env.DATABASE,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });
        }
        console.log("MYSQL IS READY");
        return connectionInstance;
    }
    catch (error) {
        console.log(error);
        process.exit();
    }
};
exports.getMysqlConnection = getMysqlConnection;
