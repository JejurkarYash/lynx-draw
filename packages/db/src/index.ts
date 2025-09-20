import { PrismaClient } from "@prisma/client";

const prismaSinglton = () => { return new PrismaClient() }

type prismaSinglton = ReturnType<typeof prismaSinglton>


const globalPrisma = globalThis as unknown as {
    prisma: prismaSinglton | undefined
}

const prisma = globalPrisma.prisma ?? new PrismaClient()

export default prisma;

if (process.env.NODE_ENV !== "production") globalPrisma.prisma = prisma

