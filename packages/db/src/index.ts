import { PrismaClient } from "@prisma/client";

const prismaSingleton = () => {
  return new PrismaClient();
};

type PrismaSingleton = ReturnType<typeof prismaSingleton>;

const globalPrisma = globalThis as unknown as {
  prisma: PrismaSingleton | undefined;
};

const prisma = globalPrisma.prisma ?? prismaSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalPrisma.prisma = prisma;
}
