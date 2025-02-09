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
import { pageController } from './controllers/pageController';
import { companyController } from './controllers/companyController';

export const tmp = path.join(__dirname, '../tmp');
export const level = getLevelConnection();
export const mysql = getMysqlConnection();
export const redis = new getRedisConnection();
export const dropbox: any = {};
export const events: any = {};

fs.mkdirSync(tmp, { recursive: true });

const origin = [
    'http://localhost:4200',
    'http://localhost:3000'
];

console.log(process.env.DNS?.slice(0, -1));
const app = express();
const store = MemoryStore(session);
const server = http.createServer(app);
export const chance = new Chance();
export const io = new Server(server, {
    cors: {
        origin: process.env.CLOUD_HOST ? process.env.DNS?.slice(0, -1) : origin,
        methods: ['POST', 'GET'],
        credentials: true
    }
});
export const socketClients: socketClientsInterface = {
    clientConnections: {},
    adminsId: [],
    accountsId: [],
    superUsersId: [],
    usersId: []
};
export const sids: Record<string, string> = {}
export const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 30 * 12 * 100,
    path: '/',
};

app
.use(cookieParser())
.use(json())
.use(urlencoded({ 
    extended: true 
}))
.use(cors({
    origin,
    credentials: true
}))
.set("trust proxy", 1)
.use(session({ 
    secret: process.env.SESSION_SECRET ? process.env.SESSION_SECRET : 'secret',
    store: new store({
        checkPeriod: 86400000
    }),
    resave: false, 
    saveUninitialized: true, 
    cookie: { 
        secure: false 
    } 
}))
.use(passport.initialize())
.use(passport.session())
.use(pageController)
.use(messageController)
.use(accountController)
.use(companyController)
.use(express.static(path.join(__dirname, '../public/browser')));
  
refresher();
io.on('connection', connection);

(async () => {
    if(mysql && await redis.con.ping()) 
        server.listen(process.env.CLOUD_HOST ? process.env.PORT : 3000, () => console.log(`RUNNING ON PORT: ${process.env.CLOUD_HOST ? process.env.PORT : '3000'}`));
})();