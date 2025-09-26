// import { RedisClient } from "./redisClient.js";
import { Worker } from "bullmq";
import prisma from "@repo/db/PrismaClient";
import { config } from "dotenv"
// import { Redis } from "ioredis";
// import { redis } from "@repo/redis-client/redis"
import { getBullMQRedis } from "./RedisManager.js"

config();

// const redisConnection = new Redis(process.env.REDIS_URL as string, {
//     maxRetriesPerRequest: null
// })

// redisConnection.on("connect", () => console.log("redis worker is connected"))
// redisConnection.on("error", (e: any) => console.log("redis worker error: ", e.message))

const redisConnection = getBullMQRedis();

const worker = new Worker("MessageQueue", async (job) => {
    console.log("data receive");
    const message = job.data;
    // console.log(job.data);

    if (message.type === "CHAT") {

        console.log("inside if statement")
        try {


            await prisma.shapes.create({
                data: {
                    roomId: Number(message.roomId),
                    type: message.content.type,
                    startX: message.content.startX,
                    startY: message.content.startY,
                    width: message.content.width,
                    height: message.content.height,
                    radius: message.content.radius,
                    endX: message.content.endX,
                    endY: message.content.endY,
                    pencilPath: message.content.pencilPath,
                    userId: message.userId,
                    createdAt: message.timeStamp

                }
            })
            console.log("data inserted succesfully")

        } catch (e) {
            console.log("something went wrong while putting data into db", e);

        }



    } else if (message.type === "UPDATE_CHATS") {

        let existingShapeS = message.content;
        console.log(existingShapeS);
        console.log(message.roomId);
        let existingShapeIds: number[] = existingShapeS.map((shape: any) => shape.id);



        try {

            await prisma.shapes.deleteMany({
                where: {
                    roomId: Number(message.roomId),
                    id: {
                        notIn: existingShapeIds
                    }

                }
            })
        } catch (e) {
            console.log("something went wrong while deleting the shapes ", e);
        }

    }
}, {
    connection: redisConnection
})



worker.on("completed", (job) => {

    console.log("id:", job.id, " name: ", job.name);
    if (job.name === "insertIntoDB") {

        console.log("Data inserted Successfully!")
    } else if (job.name === "UPDATED_CHATS") {
        console.log("Data updated Successfylly !")
    }
    console.log("job process succesfully")
});

worker.on("error", (e) => {
    console.log("something went wrong while processing job ", e.message);
})
