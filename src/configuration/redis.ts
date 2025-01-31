import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

export class getRedisConnection {
  public db1: RedisClientType;

  constructor() {
    const redisUrl = process.env.REDIS_URL;

    this.db1 = createClient({ url: redisUrl });

    this.initialize();
  }

  private async initialize() {
    try {
      await this.db1.connect();

      console.log('REDIS IS READY');
    } catch (err) {
      console.error('Error connecting to Redis:', err);
    }
  }
}
