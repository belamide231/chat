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
exports.seenConversationService = exports.loadConversationService = exports.getConversationService = exports.getMessageService = exports.getConversationsHeadsService = exports.getActiveClientsService = exports.insertMessageService = void 0;
const app_1 = require("../app");
const validContentType_1 = require("../validations/validContentType");
const validRoles_1 = require("../validations/validRoles");
const insertMessageService = (data, senderId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!data.receiverId || !validContentType_1.validContentType.includes(data.contentType) || !data.content)
        return 401;
    try {
        const result = (yield app_1.mysql.promise().query('CALL insert_message(?, ?, ?, ?)', [data.contentType, data.content, senderId, data.receiverId]))[0][0][0];
        let socketIds = [];
        socketIds = socketIds.concat(app_1.socketClients.clientConnections[senderId]);
        socketIds = socketIds.concat(app_1.socketClients.clientConnections[data.receiverId]);
        socketIds.forEach((v) => __awaiter(void 0, void 0, void 0, function* () { return yield app_1.io.to(v).emit('newmessage', JSON.stringify({ receiverId: result.receiver_id, messageId: result.message_id })); }));
        return 200;
    }
    catch (_a) {
        return 500;
    }
});
exports.insertMessageService = insertMessageService;
const getActiveClientsService = (role) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(role);
    if (!validRoles_1.validRoles.includes(role))
        return { status: 401, result: null };
    let actives = [];
    switch (role) {
        case 'admin':
            actives = actives.concat(app_1.socketClients.adminsId);
            actives = actives.concat(app_1.socketClients.accountsId);
            break;
        case 'account':
            actives = actives.concat(app_1.socketClients.adminsId);
            actives = actives.concat(app_1.socketClients.superUsersId);
            break;
        case 'superUser':
            actives = actives.concat(app_1.socketClients.accountsId);
            break;
        default:
            break;
    }
    if (actives.length === 0)
        return { status: 200, result: [] };
    // const result = await redis.db4.mGet([...actives.map(String)]);
    const result = yield app_1.redis.db1.mGet([...actives.map((v) => 'db4:' + v.toString())]);
    const sids = result.map((v) => {
        if (v !== null)
            return v.toString();
    });
    if (sids.length === 0)
        return { status: 200, result: [] };
    const data = yield app_1.redis.db1.mGet([...sids]);
    const json = data.map(v => {
        if (v !== null)
            return JSON.parse(v);
    });
    if (json.length === 0)
        return { status: 200, result: [] };
    return { status: 200, result: json };
});
exports.getActiveClientsService = getActiveClientsService;
const getConversationsHeadsService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = (yield app_1.mysql.promise().query('CALL get_conversations_heads(?)', [id]))[0];
        const custom = result[0].map((v) => [v]);
        custom[0] = result[1];
        return { status: 200, result: custom };
    }
    catch (error) {
        return { status: 500, result: null };
    }
});
exports.getConversationsHeadsService = getConversationsHeadsService;
const getMessageService = (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!data.messageId)
        return { status: 401, result: null };
    try {
        const result = (yield app_1.mysql.promise().query('CALL get_message(?, ?);', [data.messageId, userId]))[0][0][0];
        return { status: 200, result: result };
    }
    catch (_a) {
        return { status: 500, result: null };
    }
});
exports.getMessageService = getMessageService;
const getConversationService = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(!data.chatmateId);
    if (!data.chatmateId)
        return { status: 401, result: null };
    try {
        const result = (yield app_1.mysql.promise().query('CALL get_conversation(?, ?)', [userId, data.chatmateId]))[0][0];
        return { status: 200, result: result };
    }
    catch (_a) {
        return { status: 500, result: null };
    }
});
exports.getConversationService = getConversationService;
const loadConversationService = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!data.chatmateId || !data.messageLength)
        return { status: 401, result: null };
    try {
        const result = (yield app_1.mysql.promise().query('CALL load_messages(?, ?, ?)', [data.messageLength, userId, data.chatmateId]))[0][0];
        console.log(result);
        return { status: 200, result: result };
    }
    catch (_a) {
        return { status: 500, result: null };
    }
});
exports.loadConversationService = loadConversationService;
const seenConversationService = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!data.chatmateId)
        return 401;
    try {
        yield app_1.mysql.promise().query('CALL seen_conversation(?, ?)', [userId, data.chatmateId]);
        return 200;
    }
    catch (_a) {
        return 500;
    }
});
exports.seenConversationService = seenConversationService;
