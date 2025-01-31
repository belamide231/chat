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
exports.nodeMailer = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GOOGLE_APP_EMAIL,
        pass: process.env.GOOGLE_APP_PASSWORD,
    },
});
const expiry = () => {
    const timestamp = Date.now() + (1000 * 60 * 60);
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    if (hours > 12) {
        return `${hours -= 12}:${minutes} PM`;
    }
    else if (hours === 0) {
        return `12:${minutes} AM`;
    }
    return `${hours}:${minutes} AM`;
};
const nodeMailer = (email, url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mailOptions = {
            from: process.env.GOOGLE_APP_EMAIL,
            to: email,
            subject: 'You are invited to join Chat-App Application',
            text: 'Please click the link to fill up your information.',
            html: `
              <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                <p style="font-size: 16px;">You are invited to join the Chat-App, please click the button below to fill in your details.</p>
                <p style="font-size: 14px; color: green;">Note: This will be available until ${expiry()}</p>
                <button style="background-color: #007BFF; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
                  <a href="${url}" style="text-decoration: none; color: white; font-size: 16px;">Fill In Information</a>
                </button>
              </div>
            `,
        };
        yield transporter.sendMail(mailOptions);
    }
    catch (error) {
        return false;
    }
    return true;
});
exports.nodeMailer = nodeMailer;
