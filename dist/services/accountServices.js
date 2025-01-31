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
exports.inviteToSignupService = exports.createAccountService = exports.loginAccountService = void 0;
const app_1 = require("../app");
const jwt_1 = require("../utilities/jwt");
const nodemailer_1 = require("../utilities/nodemailer");
const bcrypt_1 = require("../utilities/bcrypt");
const loginAccountService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!data.username || !data.password)
        return { status: 401, rtk: null };
    const result = (yield app_1.mysql.promise().query(`CALL login_account(?)`, [data.username]))[0][0][0];
    if (result.id === 0)
        return { status: 404, rtk: null };
    const match = yield (0, bcrypt_1.comparePassword)(data.password, result.password);
    if (!match)
        return { status: 400, rtk: null };
    const rtk = (0, jwt_1.generateRefreshToken)(result.id, result.name, result.role, result.picture);
    if (!rtk)
        return { status: 500, rtk: null };
    return { status: 200, rtk: rtk };
});
exports.loginAccountService = loginAccountService;
const createAccountService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield app_1.mysql.promise().query(" ", [data.username, data.password]);
        return 200;
    }
    catch (error) {
        console.error(error);
        return 500;
    }
});
exports.createAccountService = createAccountService;
const inviteToSignupService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const invitationKey = (0, jwt_1.generateInvitationToken)(data.email, data.company, data.role);
    const url = `http://localhost:3000/invite?invitation=${invitationKey}`;
    try {
        yield app_1.redis.db1.del('db2:' + data.email);
        const sent = yield (0, nodemailer_1.nodeMailer)(data.email, url);
        if (!sent)
            return 403;
    }
    catch (_a) {
        return 400;
    }
    return 200;
});
exports.inviteToSignupService = inviteToSignupService;
