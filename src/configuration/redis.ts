import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';

dotenv.config();


export class getRedisConnection {
    public con: RedisClientType;

    constructor() {

        this.con = createClient({ url: process.env.LOCAL ? 'redis://localhost:6379' : process.env.REDIS_URL });
        this.initialize();
    }

    private async initialize() {
        try {

            await this.con.connect();
            console.log('CONNECTED TO REDIS');
        } catch (error) {

            console.log(error);
            process.exit();
        }
    }
}