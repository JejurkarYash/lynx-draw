import { Redis } from 'ioredis';
import { config } from "dotenv";

config();

let bullMQRedisConnection: Redis | null = null;
let redisInstance: Redis | null = null;

function createBullMQRedisConnection(): Redis {
    if (!bullMQRedisConnection) {
        bullMQRedisConnection = new Redis(process.env.REDIS_URL as string, {
            family: 4,
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
            lazyConnect: true,
        })

        bullMQRedisConnection.on("connect", () => {
            console.log("BullMQ Redis connected to Upstash");
        });

        bullMQRedisConnection.on('error', (e: any) => {
            console.log("BullMQ Redis error:", e.message);
        })
    } else {
        return bullMQRedisConnection;
    }

    return bullMQRedisConnection;
}

function createRedisConnection(): Redis {
    if (redisInstance) {
        return redisInstance;
    }

    redisInstance = new Redis(process.env.REDIS_URL as string, {
        family: 4,
        maxRetriesPerRequest: null,
        // retryDelayOnFailover: 100,
        enableReadyCheck: true,
        lazyConnect: true,
    });

    redisInstance.on("connect", () => {
        console.log("Redis connected to Upstash");
    });

    redisInstance.on('error', (e: any) => {
        console.log("Redis error:", e.message);
    });

    return redisInstance;
}

export const redis = createRedisConnection();
export const bullMQRedis = createBullMQRedisConnection();