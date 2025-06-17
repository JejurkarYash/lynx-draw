import { z } from "zod"



export const userSchema = z.object({
    name: z.string().min(3),
    email: z.string().email().min(4),
    password: z.string().min(6)
})

export const signInSchema = z.object({
    email: z.string().min(3).email(),
    password: z.string().min(3).max(20)
})


export const roomTypes = z.object({
    roomName: z.string()
})