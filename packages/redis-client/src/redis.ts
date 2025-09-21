import { Redis } from 'ioredis';

console.log("creating redis connection ");

declare global {
    var redisClient: Redis | undefined;
}
const redis = global.redisClient || new Redis(process.env.REDIS_URL as string)

if (process.env.NODE_ENV !== "production") global.redisClient = redis;


redis.on("connect", () => {
    console.log("redis is connected....");
})


redis.on('error', (e: any) => {
    console.log("something went wrong ", e.message);
})

export { redis };





