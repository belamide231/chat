"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookiesParser = void 0;
const cookiesParser = (cookies) => {
    cookies = `{ "${cookies}" }`;
    cookies = cookies.replace(new RegExp('=', 'g'), '":"');
    cookies = cookies.replace(new RegExp('; ', 'g'), '", "');
    try {
        return JSON.parse(cookies);
    }
    catch (_a) {
        return false;
    }
};
exports.cookiesParser = cookiesParser;
