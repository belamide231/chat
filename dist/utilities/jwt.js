"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyInvitationToken = exports.generateInvitationToken = exports.verifyAccessToken = exports.generateAccessToken = exports.verifyRefreshToken = exports.generateRefreshToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const timestamp = () => Math.floor(Date.now() / 1000);
const generateRefreshToken = (id, name, role, picture) => {
    const privateKey = process.env.JWT_REFRESH_SECRET;
    return privateKey ? jsonwebtoken_1.default.sign({
        sub: id,
        iat: timestamp(),
        exp: timestamp() + (60 * 60 * 24 * 30 * 6),
        iss: process.env.URL,
        aud: 'app-api',
        name,
        role,
        picture
    }, privateKey, {
        algorithm: 'HS256'
    }) : false;
};
exports.generateRefreshToken = generateRefreshToken;
const verifyRefreshToken = (token) => {
    try {
        const secret = process.env.JWT_REFRESH_SECRET;
        return secret ? {
            token: true,
            payload: jsonwebtoken_1.default.verify(token, secret)
        } : {
            token: false,
            payload: null
        };
    }
    catch (_a) {
        return {
            token: false,
            payload: null
        };
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
const generateAccessToken = (sid, id, name, role, picture) => {
    const privateKey = process.env.JWT_ACCESS_SECRET;
    return privateKey ? jsonwebtoken_1.default.sign({
        sid,
        sub: id,
        iat: timestamp(),
        exp: timestamp() + (60 * 60),
        iss: process.env.URL,
        aud: 'app-api',
        name,
        role,
        picture
    }, privateKey, {
        algorithm: 'HS256'
    }) : false;
};
exports.generateAccessToken = generateAccessToken;
const verifyAccessToken = (token) => {
    try {
        const secret = process.env.JWT_ACCESS_SECRET;
        return secret ? {
            token: true,
            payload: jsonwebtoken_1.default.verify(token, secret)
        } : {
            token: false,
            payload: null
        };
    }
    catch (_a) {
        return {
            token: false,
            payload: null
        };
    }
};
exports.verifyAccessToken = verifyAccessToken;
const generateInvitationToken = (email, company, role) => {
    const privateKey = process.env.JWT_REFRESH_SECRET;
    return privateKey ? jsonwebtoken_1.default.sign({
        iat: timestamp(),
        exp: timestamp() + (60 * 60),
        iss: process.env.URL,
        aud: 'invitation-api',
        email,
        company,
        role,
    }, privateKey, {
        algorithm: 'HS256'
    }) : false;
};
exports.generateInvitationToken = generateInvitationToken;
const verifyInvitationToken = (invitationToken) => {
    try {
        const secret = process.env.JWT_REFRESH_SECRET;
        return secret ? {
            token: true,
            payload: jsonwebtoken_1.default.verify(invitationToken, secret)
        } : {
            token: false,
            payload: null
        };
    }
    catch (_a) {
        return {
            token: false,
            payload: null
        };
    }
};
exports.verifyInvitationToken = verifyInvitationToken;
