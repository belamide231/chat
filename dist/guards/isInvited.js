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
exports.isInvited = void 0;
const jwt_1 = require("../utilities/jwt");
const app_1 = require("../app");
const isInvited = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.sessionID);
    const invitation = req.query['invitation'];
    if (!invitation)
        return res.sendStatus(401);
    const decoded = (0, jwt_1.verifyInvitationToken)(invitation);
    if (!decoded['token'])
        return res.sendStatus(401);
    const payload = decoded['payload'];
    const redisData = yield app_1.redis.db1.get('db2:' + payload.email);
    if (redisData === null) {
        const data = {
            role: payload.role,
            email: payload.email,
            company: payload.company
        };
        const sid = req.sessionID;
        try {
            yield app_1.redis.db1.set('db2:' + payload.email, JSON.stringify(data), { EX: 60 * 60 });
            yield app_1.redis.db1.set('db3:' + sid, 'db2:' + payload.email, { EX: 60 * 60 });
        }
        catch (_a) {
            return res.sendStatus(500);
        }
    }
    return res.redirect('/sign-up');
});
exports.isInvited = isInvited;
