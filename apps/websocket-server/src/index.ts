import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "@repo/backend-common/config"
import WebSocket from 'ws';
import { Redis } from 'ioredis';
import myQueue from './queue.js';
import { getGeneralRedis } from "./RedisManager.js"

// initialzing redis connection
const redis = getGeneralRedis();



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
    type: "JOIN_ROOM" | "CHAT" | "LEAVE_ROOM" | "UPDATE_CHATS",
    content?: string,
    roomId?: number,
    timestamp?: string
}

//  function to authenticate usser
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

//  function to add user into redis 
const addUserToRedis = async (userId: string, roomIds: number[] = []) => {
    await redis.set(`users:${userId}`, JSON.stringify({ userId, roomIds }));
}

//  function to push user into a particular room 
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




//* Entry point 
wss.on("connection", async (ws, req) => {
    try {
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
                // console.log(msg.toString());
                const message: message = JSON.parse(msg.toString());
                if (message.type === "JOIN_ROOM" && message.roomId) {
                    //  pushing the user into particular room 
                    await addUserToRoom(userId, message?.roomId);
                } else if (message.type === "CHAT" && message.content) {
                    //  pushing the messages to the message queue 

                    await myQueue.add("insertIntoDB", {
                        ...message,
                        userId,
                        timeStamep: new Date().toString()
                    })
                    console.log("after  pushing it into Queue")

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

                    // pushing it into database




                } else if (message.type === "UPDATE_CHATS" && message.content) {
                    // pusing chats into queue for processing 
                    // const res = await redis.lpush("messages:messageQeue", JSON.stringify({
                    //     ...message,
                    //     userId,
                    //     timestamp: new Date().toISOString()
                    // }));

                    await myQueue.add("UPDATED_CHATS", {
                        ...message,
                        userId,
                        roomId: message.roomId,
                        timeStamp: new Date().toString()
                    })


                    console.log("UPDATE_CHATS pushed to the queue ");



                    // broadcasting messages to the other usres in the same room 
                    const users = await redis.smembers(`rooms:${message.roomId}:users`);
                    users.forEach((user) => {
                        // getting user'f from map
                        const client = socketMap.get(user);
                        // braodcasting message to everyone except this websocket connection 
                        if (client && client !== ws) {
                            client.send(JSON.stringify({
                                type: "UPDATE_CHATS",
                                content: message.content,
                                roomId: message.roomId,
                                userId,
                                timestamp: new Date().toISOString()
                            }))

                        }
                    });

                    console.log("UPDATED_CHATS broadcasted succesfully ");
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




