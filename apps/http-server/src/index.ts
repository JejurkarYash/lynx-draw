import express, { Request, Response } from 'express';
import { Auth } from "./middlewares/middleware.js"
import dotenv from 'dotenv';
import cors from "cors";
import { userSchema, signInSchema, roomTypes } from "@lynx-draw/common"
import prisma from '@repo/db/PrismaClient'
import { ZodError } from 'zod/v4';
import { JWT_SECRET } from "@repo/backend-common";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt"

dotenv.config();
const PORT = process.env.PORT

const app = express();

// parsing the request body
app.use(express.json())
// allowing the cors 
app.use(cors())



// this is the testing endpoint 
app.get("/", (req: Request, res: Response) => {

    res.json("hello from http server")
})



// creating signup endpoint for user signup 
app.post("/signup", async (req: Request, res: Response) => {


    try {
        const body = req.body
        // parsing the body with zod schema 
        const parseBody = userSchema.parse(body);


        // hash the password before storing it in db 
        const hashPassword = await bcrypt.hash(parseBody.password, 10);
        const user = await prisma.user.create({
            data: {
                name: parseBody.name,
                email: parseBody.email,
                password: hashPassword
            }
        })


        res.status(200).json({
            "message": "User Created Succesfully",
            "userId": user.id
        })

    } catch (e: any) {

        if (e instanceof ZodError) {
            res.status(400).json({
                "message": "Validation Error ",
                "error": e.message
            });

        } else if (e.code === "P2002") {
            res.json({
                message: "User Already Exists ! ",
                error: e
            }).status(409);
        } else {
            res.json({
                message: "something went wrong ",
                error: e
            })
        }
    }


})

app.post("/google-login", async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const parseBody = userSchema.omit({ password: true }).parse(body);


        // check if user already exists
        let user = await prisma.user.findUnique({
            where: {
                email: parseBody.email,
            }
        })


        if (!user) {
            user = await prisma.user.create({
                data: {
                    name: parseBody.name,
                    email: parseBody.email,
                    password: " "
                }
            })
        }

        console.log(user);

        const token = jwt.sign({ email: user.email, userId: user.id }, JWT_SECRET as string)
        res.status(200).json({
            message: "Google Login Successful",
            token: token
        })

    } catch (e: any) {
        if (e instanceof ZodError) {
            res.status(400).json({
                "message": "Invalid Input !",
                "error": e.message
            })
        } else {
            console.log("something went wrong with prisma")
            res.status(500).json({
                "message": "Something went wrong ! ",
                error: e
            })
        }
    }
})

// creating a signin endpoint for user to signin
app.post("/signin", async (req: Request, res: Response) => {

    try {
        const body = req.body;
        const parseBody = signInSchema.safeParse(body);

        if (!parseBody.success) {
            res.status(400).json({
                "message": "Invalid Inputs"
            })
            return
        }

        const user = await prisma.user.findUnique({
            where: {
                email: parseBody.data.email,
            }
        })

        if (!user) {
            res.status(403).json({
                message: "Not Authorized "
            })

            return
        }

        const checkPassword = await bcrypt.compare(parseBody.data.password, user.password)
        if (!checkPassword) {
            res.status(401).json({
                "message": "Invalid Credentials "
            })
            return;
        }

        // signing the jwt token
        const token = jwt.sign({ email: user.email, userId: user.id }, JWT_SECRET as string)
        res.status(200).json({
            message: "Signin Succesfully ",
            token: token
        })


    } catch (e: any) {

        if (e instanceof ZodError) {
            res.json({
                "message": "Invalid Input !",
                "error": e.message
            }).status(400)
            return
        } else {
            res.status(500).json({
                "message": "Something went wrong ! ",
                error: e
            })
        }




    }

})
app.post("/room", Auth, async (req: Request, res: Response) => {
    try {

        const parseBody = roomTypes.parse(req.body);
        const userId = req.userId;

        if (!parseBody || !userId) {
            res.status(400).json({
                message: "provide room name ",
            })

            return;
        }

        console.log(userId);
        console.log("before creating room");
        const room = await prisma.room.create({
            data: {
                slug: parseBody.roomName,
                adminId: userId

            }
        })
        console.log(room);

        if (!room) {
            res.json({
                message: "somethign went wrong"
            })
            return;
        }

        res.status(200).json({
            message: "Room Created Succesfully ! ",
            roomId: room.id,
            adminId: room.adminId
        })


    } catch (e) {

        res.status(500).json({
            message: "something went wrong",
            error: e
        })
    }

})


app.get("/shapes/:roomId", async (req: Request, res: Response) => {
    try {
        const roomId = req.params.roomId;
        // getting all chats of a particular room 
        const chats = await prisma.shapes.findMany({
            where: {
                roomId: Number(roomId),
            },
        })
        if (!chats) {
            res.json({
                message: "No chats found "
            })
        }

        // sending chats to user
        res.json({
            chats: chats
        })



    } catch (e) {
        console.log("something went wrong ", e);
    }

})

app.listen(PORT, () => {
    console.log("server is running on port ", PORT)
})