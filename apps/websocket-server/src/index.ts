import { WebSocketServer } from 'ws';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { JWT_SECRET } from "@repo/backend-common/config"
import WebSocket from 'ws';
import { Redis } from 'ioredis';
import prisma from '@repo/db/prismaClient';

const redisUrl = process.env.REDIS_URL as string;
// this redis connection is for non-blocking commands 
const redis = new Redis(redisUrl);
// this redis connection is for blocking command 
const redisQueue = new Redis(redisUrl);

redis.on('connect', () => console.log("redis is connected...."))
redisQueue.on('connect', () => console.log("redisQues is connected....."));
redis.on("error", (e) => console.log("something went wrong with redis client  ", e.message));
redisQueue.on("error", (e) => console.log("something went wrong with redis Queue client  ", e.message));

// Initializing a websocket server  
const PORT = Number(process.env.PORT);
const wss = new WebSocketServer({ port: PORT })

wss.on("listening", () => console.log("Websocket server is listening on port: ", PORT))
wss.on("error", (e) => {
    console.log("something went wrong:", e.message)
})


// Initialzing an empty map for storing socket instance 
const socketMap = new Map<string, WebSocket>();


interface User {
    userId: string,
    roomIds: number[]
}

interface socketType {
    userId: WebSocket
}

interface message {
    type: "JOIN_ROOM" | "CHAT" | "LEAVE_ROOM",
    content?: string,
    roomId?: number,
    timestamp?: string
}

// ? function to authenticate usser
const checkUser = (token: string): string | null => {

    try {
        const decode = jwt.verify(token, JWT_SECRET as string)
        if (typeof decode == 'string') {
            return null
        }

        if (!decode || !decode.userId) {
            return null
        }

        return decode.userId;
    }
    catch (e) {
        return null;
    }

}

// ? function to add user into redis 
const addUserToRedis = async (userId: string, roomIds: number[] = []) => {
    await redis.set(`users:${userId}`, JSON.stringify({ userId, roomIds }));
}

// ? function to push user into a particular room 
const addUserToRoom = async (userId: string, roomId: number) => {
    try {

        const userData = await redis.get(`users:${userId}`);
        if (userData) {
            const user = JSON.parse(userData);
            if (!user.roomIds.includes(roomId)) {
                user.roomIds.push(roomId);
                //  pushing the room into user's roomIds array
                await redis.set(`users:${userId}`, JSON.stringify(user));
                // pushing the user into room
                await redis.sadd(`rooms:${roomId}:users`, userId);

            }

        }
    } catch (e) {
        socketMap.get(userId)?.send(`error:${e}`)

    }

}


const processMessageQueue = async () => {
    while (true) {
        try {

            // it will block until the message queue is empty 
            // after that it will process the message one by one 
            const result = await redisQueue.brpop('messages:messageQeue', 0);
            if (result) {
                const [, messageString] = result;
                const message = JSON.parse(messageString);
                console.log("Queue:", message);

                if (message.type === "CHAT" && message.content && message.roomId && message.timestamp) {
                    console.log("if block");
                    const data = {
                        roomId: Number(message.roomId),
                        userId: message.userId,
                        startX: message.content.startX,
                        startY: message.content.startY,
                        height: message.content.height,
                        width: message.content.width,
                        type: message.content.type,
                        radius: message.content.radius,
                        color: message.content.color,
                        lineWidth: message.content.lineWidth,
                        endX: message.content.endX,
                        endY: message.content.endY,
                    }

                    console.log("before puting shape into database ")
                    // storing messages into database 
                    const res = await prisma.default.shapes.create({
                        data: data
                    })

                    console.log(res);
                }

            }

        } catch (e) {
            console.log("something went wrong : ", e);
        }

    }
}

processMessageQueue();


//* Entry point 
wss.on("connection", async (ws, req) => {
    try {
        console.log("control reach here");
        const url = req.url;
        if (!url) {
            return;
        }
        const queryParams = new URLSearchParams(url.split("?")[1]);
        const token = queryParams.get("token");

        if (!token) return;
        const userId = checkUser(token)
        if (userId == null) {
            ws.close();
            return null;
        }

        // storing the userId and websocket to the socketMap 
        socketMap.set(userId, ws);
        // storing user into redis 
        await addUserToRedis(userId, []);
        // ws.send(`user is store in the redis `)



        ws.on("message", async (msg) => {
            try {
                console.log(msg.toString());
                const message: message = JSON.parse(msg.toString());
                if (message.type === "JOIN_ROOM" && message.roomId) {
                    //  pushing the user into particular room 
                    await addUserToRoom(userId, message?.roomId);
                } else if (message.type === "CHAT" && message.content) {
                    //  pushing the messages to the message queue 
                    console.log("before pushing it into Queue")
                    const res = await redis.lpush("messages:messageQeue", JSON.stringify({
                        ...message,
                        userId,
                        timestamp: new Date().toISOString()
                    }));

                    // braodcasting messages to the everyone in that room 

                    const users = await redis.smembers(`rooms:${message.roomId}:users`);
                    users.forEach((user) => {
                        // getting user'f from map
                        const client = socketMap.get(user);
                        // braodcasting message to everyone except this websocket connection 
                        if (client && client !== ws) {
                            client.send(JSON.stringify({
                                type: "CHAT",
                                content: message.content,
                                roomId: message.roomId,
                                userId,
                                timestamp: new Date().toISOString()
                            }))

                        }


                    })

                }


            } catch (e) {
                socketMap.get(userId)?.send(`something went wrong: ${e}`)

            }

        })

    } catch (e) {
        console.log(e);
        return;

    }
})




