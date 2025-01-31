"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageController = void 0;
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const isAuthenticated_1 = require("../guards/isAuthenticated");
const hasToken_1 = require("../guards/hasToken");
exports.pageController = (0, express_1.Router)();
exports.pageController.get('/login', hasToken_1.hasToken, (req, res) => {
    if (req.cookies['unauthorized']) {
        res.clearCookie('unauthorized');
        res.status(401).sendFile(path_1.default.join(__dirname, '../testPages/login.html'));
    }
    return res.sendFile(path_1.default.join(__dirname, '../testPages/login.html'));
});
exports.pageController.get('/chat', isAuthenticated_1.isAuthenticated, (req, res) => {
    return res.status(200).sendFile(path_1.default.join(__dirname, '../testPages/chat.html'));
});
exports.pageController.get(['/', 'users', 'notification', 'settings', 'profile'], isAuthenticated_1.isAuthenticated, (req, res) => {
    return res.status(200).sendFile(path_1.default.join(__dirname, '../../public/browser/index.html'));
});
