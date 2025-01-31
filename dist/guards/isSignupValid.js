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
exports.isSignupValid = void 0;
const app_1 = require("../app");
const isSignupValid = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.cookies['rtk'])
        return res.redirect('/');
    const email = yield app_1.redis.db1.get('db3:' + req.sessionID);
    if (email === null)
        return res.redirect('/login');
    console.log(email);
    const data = yield app_1.redis.db1.get(email);
    if (data === null)
        return res.redirect('/login');
    next();
});
exports.isSignupValid = isSignupValid;
