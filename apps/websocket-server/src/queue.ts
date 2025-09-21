import { RedisClient } from "./redisClient.js";
import { Queue } from "bullmq";

const myQueue = new Queue("MessageQueue", {
    connection: RedisClient
})

export default myQueue; 