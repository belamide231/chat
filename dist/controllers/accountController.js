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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountController = void 0;
const express_1 = require("express");
const accountServices_1 = require("../services/accountServices");
const isInvited_1 = require("../guards/isInvited");
const app_1 = require("../app");
const isSignupValid_1 = require("../guards/isSignupValid");
const path_1 = __importDefault(require("path"));
exports.accountController = (0, express_1.Router)();
exports.accountController.post('/invite', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.sendStatus(yield (0, accountServices_1.inviteToSignupService)(req.body));
})).get('/invite', isInvited_1.isInvited);
exports.accountController.get('/sign-up', isSignupValid_1.isSignupValid, (_, res) => {
    return res.status(200).sendFile(path_1.default.join(__dirname, '../testPages/signup.html'));
});
exports.accountController.post('/loginAccount', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, accountServices_1.loginAccountService)(req.body);
    if (response.status !== 200)
        return res.status(response.status).json({ message: 'Login Invalid' });
    res.cookie('rtk', response.rtk, app_1.cookieOptions);
    return res.status(response.status).json({ message: 'Login Successful' });
}));
exports.accountController.post('/logoutAccount', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield app_1.redis.db1.del(req.sessionID);
        res.clearCookie('rtk');
        res.clearCookie('atk');
    }
    catch (_a) {
        return res.sendStatus(500);
    }
    return res.status(200).json({ message: 'Cookie cleared, logged out successfully' });
}));
exports.accountController.post('/createAccount', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.sendStatus(yield (0, accountServices_1.createAccountService)(req.body));
}));
