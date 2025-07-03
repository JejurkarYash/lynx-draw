import { Redis } from 'ioredis';
import type redisType from 'ioredis';

console.log("creating redis connection ");

declare global {
    var redisClient: redisType | undefined;
}
const redis = global.redisClient || new Redis(process.env.REDIS_URL as string)

if (process.env.NODE_ENV !== "production") global.redisClient = redis;


redis.on("connect", () => {
    console.log("redis is connected....");
})


redis.on('error', (e) => {
    console.log("something went wrong ", e.message);
})

export { redis };





