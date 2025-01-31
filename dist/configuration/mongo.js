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
exports.getMongoConnection = void 0;
const mongodb_1 = require("mongodb");
const uri = "mongodb://localhost:27017";
const dbName = 'socketClientsDb';
const client = new mongodb_1.MongoClient(uri);
let getMongoConnection;
const connectToMongo = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        const db = client.db(dbName);
        exports.getMongoConnection = getMongoConnection = db.collection('clients');
        console.log("MONGO IS READY");
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit();
    }
});
connectToMongo();
