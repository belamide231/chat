import express, { urlencoded, json, CookieOptions } from 'express';
import MemoryStore from 'memorystore';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import dontenv from 'dotenv';
import path from 'path';
import http from 'http';
import cookieParser from 'cookie-parser';
import Chance from 'chance';
import { Server } from 'socket.io';

dontenv.config();

import { getMysqlConnection } from './configuration/mysql';
import { getRedisConnection } from './configuration/redis';
import { getSqliteConnection } from './configuration/sqlite';
import { controller } from './controllers/controller';
import { connection } from './sockets/connection';
import { socketClientsInterface } from './interfaces/socketClientsInterface';
import { observeDropbox } from './utilities/dropboxRenewer';


export const sqlite = getSqliteConnection();
export const mysql = getMysqlConnection();
export const redis = new getRedisConnection();
export const dropbox: Record<string, string> = {};

const app = express();
const store = MemoryStore(session);
const server = http.createServer(app);
export const chance = new Chance();
export const io = new Server(server, {
    cors: {
        origin: '*'
    }
});
export const socketClients: socketClientsInterface = {
    clientConnections: {},
    adminsId: [],
    accountsId: [],
    superUsersId: [],
    usersId: []
};
export const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 30 * 12 * 100,
    path: '/',
};

// observeDropbox();
app.use(cookieParser());
app.use(json());
app.use(urlencoded({ 
    extended: true 
}));
app.use(cors({
    origin: '*',
    credentials: true
}));
app.set("trust proxy", 1);
app.use(session({ 
    secret: process.env.SESSION_SECRET ? process.env.SESSION_SECRET : 'secret',
    store: new store({
        checkPeriod: 86400000
    }),
    resave: false, 
    saveUninitialized: true, 
    cookie: { 
        secure: false 
    } 
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(controller);
app.use(express.static(path.join(__dirname, '../public/browser')));

io.on('connection', connection);

(async () => {
    if(mysql && await redis.con.ping() && sqlite) 
        server.listen(process.env.LOCAL ? 3000 : process.env.PORT, () => console.log(`RUNNING ON PORT: ${process.env.LOCAL ? '3000' : process.env.PORT}`));
})();