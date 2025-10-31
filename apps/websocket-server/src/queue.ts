import { Queue } from "bullmq";
// import { Redis } from "ioredis";
import { config } from "dotenv"
import { getBullMQRedis } from "./RedisManager.js"

const Redis = getBullMQRedis();

// const redisConnection = new Redis(process.env.REDIS_URL as string, {
//     maxRetriesPerRequest: null
// })

// redisConnection.on("connect", () => console.log("Redis queue is connected "))
// redisConnection.on("error", (e: any) => console.log("Redis queue Error: ", e.message));


config();
const myQueue = new Queue("MessageQueue", {

    connection: Redis
})

export default myQueue; 