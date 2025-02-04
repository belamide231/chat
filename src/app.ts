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
import fs from 'fs';
import { Server } from 'socket.io';

dontenv.config();

import { getMysqlConnection } from './configuration/mysql';
import { getRedisConnection } from './configuration/redis';
import { connection } from './sockets/connection';
import { socketClientsInterface } from './interfaces/socketClientsInterface';
import { getLevelConnection } from './configuration/level';
import { refresher } from './configuration/refresher';
import { messageController } from './controllers/messageController';
import { accountController } from './controllers/accountController';

export const tmp = path.join(__dirname, '../tmp');
export const level = getLevelConnection();
export const mysql = getMysqlConnection();
export const redis = new getRedisConnection();
export const dropbox: any = {};

fs.mkdirSync(tmp, { recursive: true });
  
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

refresher();
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
app.use(messageController);
app.use(accountController);
app.use(express.static(path.join(__dirname, '../public/browser')));

io.on('connection', connection);

(async () => {
    if(mysql && await redis.con.ping()) 
        server.listen(process.env.CLOUD_HOST ? process.env.PORT : 3000, () => console.log(`RUNNING ON PORT: ${process.env.LOCAL ? process.env.PORT : '3000'}`));
})();