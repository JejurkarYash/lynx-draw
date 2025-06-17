import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "@repo/backend-common/config"

const wss = new WebSocketServer({ port: Number(process.env.PORT) })

wss.on("listening", () => {
    console.log("Websocket server is listening on port  8080")
})


interface user {
    ws: WebSocket,
    userId: string,
    room: string[]
}

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

wss.on("connection", (ws, req) => {

    const token = req.headers.authorization;
    if (!token) return;
    
    const userId = checkUser(token)
    if (userId == null) {
        ws.close();
        return null;
    }


    ws.on("message", (msg) => {
        ws.send("hello from websocket server")
        console.log(msg.toString());
    })
})
