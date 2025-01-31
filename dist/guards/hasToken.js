"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasToken = void 0;
const hasToken = (req, res, next) => {
    if (req.cookies['rtk'])
        return res.redirect('/');
    next();
};
exports.hasToken = hasToken;
