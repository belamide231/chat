"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const app_1 = require("../app");
const cookieParser_1 = require("../utilities/cookieParser");
const app_2 = require("../app");
const jwt_1 = require("../utilities/jwt");
const connection = (socket) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = socket.request.headers.cookie;
    if (!cookies)
        return;
    const parsedCookies = (0, cookieParser_1.cookiesParser)(cookies);
    if (!parsedCookies)
        return;
    const decoded = (0, jwt_1.verifyAccessToken)(parsedCookies.atk);
    if (!decoded.token)
        return;
    const client = decoded.payload;
    const id = client.sub;
    try {
        // await redis.db4.set(id.toString(), client.sid, { EX: 60 * 60 });
        yield app_1.redis.db1.set('db4:' + id.toString(), client.sid, { EX: 60 * 60 });
    }
    catch (_a) {
        return;
    }
    app_1.socketClients.clientConnections[id] ? app_1.socketClients.clientConnections[id].push(socket.id) : app_1.socketClients.clientConnections[id] = [socket.id];
    switch (client.role) {
        case 'admin':
            if (!app_1.socketClients.adminsId.includes(id))
                app_1.socketClients.adminsId.push(id);
            break;
        case 'account':
            if (!app_1.socketClients.accountsId.includes(id))
                app_1.socketClients.accountsId.push(id);
            break;
        case 'superUser':
            if (!app_1.socketClients.superUsersId.includes(id))
                app_1.socketClients.superUsersId.push(id);
            break;
        case 'user':
            if (!app_1.socketClients.usersId.includes(id))
                app_1.socketClients.usersId.push(id);
            break;
    }
    app_2.io.emit('connected');
    socket.on('disconnect', () => __awaiter(void 0, void 0, void 0, function* () {
        app_1.socketClients.clientConnections[id].splice(app_1.socketClients.clientConnections[id].indexOf(socket.id), 1);
        if (app_1.socketClients.clientConnections[id].length === 0) {
            app_2.io.emit('disconnected');
            delete app_1.socketClients.clientConnections[id];
            // await redis.db4.del(id.toString());
            yield app_1.redis.db1.del('db4:' + id.toString());
            switch (client.role) {
                case 'admin':
                    app_1.socketClients.adminsId.splice(app_1.socketClients.adminsId.indexOf(id), 1);
                    break;
                case 'account':
                    app_1.socketClients.adminsId.splice(app_1.socketClients.accountsId.indexOf(id), 1);
                    break;
                case 'superUser':
                    app_1.socketClients.adminsId.splice(app_1.socketClients.superUsersId.indexOf(id), 1);
                    break;
                case 'user':
                    app_1.socketClients.adminsId.splice(app_1.socketClients.usersId.indexOf(id), 1);
                    break;
            }
        }
    }));
});
exports.connection = connection;
