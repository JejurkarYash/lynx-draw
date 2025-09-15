import { RedisClient } from "./redisClient.ts";
import { Queue } from "bullmq";

const myQueue = new Queue("MessageQueue", {
    connection: RedisClient
})

export default myQueue; 