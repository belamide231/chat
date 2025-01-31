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
exports.isAuthenticated = void 0;
const jwt_1 = require("../utilities/jwt");
const app_1 = require("../app");
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = {};
    const atk = (0, jwt_1.verifyAccessToken)(req.cookies['atk']);
    if (!atk.token) {
        const rtk = (0, jwt_1.verifyRefreshToken)(req.cookies['rtk']);
        if (!rtk.token) {
            res.clearCookie('atk');
            res.clearCookie('rtk');
            res.cookie('unauthorized', true);
            return res.redirect('/login');
        }
        const sid = req.sessionID;
        const payload = rtk.payload;
        const refreshToken = (0, jwt_1.generateRefreshToken)(payload.sub, payload.name, payload.role, payload.picture);
        const accessToken = (0, jwt_1.generateAccessToken)(sid, payload.sub, payload.name, payload.role, payload.picture);
        payload.id = payload.sub;
        res.cookie('rtk', refreshToken, app_1.cookieOptions);
        res.cookie('atk', accessToken, app_1.cookieOptions);
        user['id'] = payload.sub;
        user['name'] = payload.name;
        user['role'] = payload.role;
        user['picture'] = payload.picture;
        delete payload.sub;
        delete payload.iat;
        delete payload.exp;
        delete payload.iss;
        delete payload.aud;
        try {
            yield app_1.redis.db1.set(sid, JSON.stringify(payload), { EX: 60 * 60 });
        }
        catch (_a) {
            return res.status(500).redirect('/login');
        }
    }
    else {
        const payload = atk.payload;
        user['id'] = payload.sub;
        user['name'] = payload.name;
        user['role'] = payload.role;
        user['picture'] = payload.picture;
    }
    req.user = user;
    next();
});
exports.isAuthenticated = isAuthenticated;
