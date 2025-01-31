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
exports.messageController = void 0;
const express_1 = require("express");
const messageServices_1 = require("../services/messageServices");
const isAuthenticated_1 = require("../guards/isAuthenticated");
exports.messageController = (0, express_1.Router)();
exports.messageController.post('/insertMessage', isAuthenticated_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.sendStatus(yield (0, messageServices_1.insertMessageService)(req.body, req.user.id));
}));
exports.messageController.post('/getActiveClients', isAuthenticated_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, messageServices_1.getActiveClientsService)(req.user.role);
    if (response.status !== 200)
        return res.sendStatus(response.status);
    return res.status(200).json(response.result);
}));
exports.messageController.post('/getConversationsHeads', isAuthenticated_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, messageServices_1.getConversationsHeadsService)(req.user.id);
    if (response.status !== 200)
        return res.sendStatus(response.status);
    return res.status(response.status).json(response.result);
}));
exports.messageController.post('/getConversation', isAuthenticated_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, messageServices_1.getConversationService)(req.user.id, req.body);
    if (response.status !== 200)
        return res.sendStatus(response.status);
    return res.status(200).json(response.result);
}));
exports.messageController.post('/getMessage', isAuthenticated_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, messageServices_1.getMessageService)(req.body, req.user.id);
    if (response.status !== 200)
        return res.sendStatus(response.status);
    return res.status(response.status).json(response.result);
}));
exports.messageController.post('/loadConversation', isAuthenticated_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, messageServices_1.loadConversationService)(req.user.id, req.body);
    if (response.status !== 200)
        return res.sendStatus(response.status);
    return res.status(200).json(response.result);
}));
exports.messageController.post('/seenConversation', isAuthenticated_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.sendStatus(yield (0, messageServices_1.seenConversationService)(req.user.id, req.body));
}));
