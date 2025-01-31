"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieOptions = exports.socketClients = exports.io = exports.chance = exports.redis = exports.mysql = void 0;
const express_1 = __importStar(require("express"));
const memorystore_1 = __importDefault(require("memorystore"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const chance_1 = __importDefault(require("chance"));
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
const mysql_1 = require("./configuration/mysql");
const redis_1 = require("./configuration/redis");
const controller_1 = require("./controllers/controller");
const connection_1 = require("./sockets/connection");
// import { getMongoConnection } from './configuration/mongo';
// export const mongo = getMongoConnection;
exports.mysql = (0, mysql_1.getMysqlConnection)();
exports.redis = new redis_1.getRedisConnection();
const app = (0, express_1.default)();
const store = (0, memorystore_1.default)(express_session_1.default);
const server = http_1.default.createServer(app);
exports.chance = new chance_1.default();
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: '*'
    }
});
exports.socketClients = {
    clientConnections: {},
    adminsId: [],
    accountsId: [],
    superUsersId: [],
    usersId: []
};
exports.cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 30 * 12 * 100,
    path: '/',
};
app.use((0, cookie_parser_1.default)());
app.use((0, express_1.json)());
app.use((0, express_1.urlencoded)({
    extended: true
}));
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true
}));
app.set("trust proxy", 1);
app.use((0, express_session_1.default)({
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
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(controller_1.controller);
app.use(express_1.default.static(path_1.default.join(__dirname, '../public/browser')));
exports.io.on('connection', connection_1.connection);
const port = process.env.PORT;
if (port)
    server.listen(port, () => console.log(`http://localhost:${port}`));
