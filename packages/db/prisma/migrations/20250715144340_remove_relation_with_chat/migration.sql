/*
  Warnings:

  - You are about to drop the column `shapeId` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the `Shape` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `message` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "shapeType" ADD VALUE 'ERASER';
ALTER TYPE "shapeType" ADD VALUE 'PENCIL';

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_shapeId_fkey";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "shapeId",
ADD COLUMN     "message" TEXT NOT NULL;

-- DropTable
DROP TABLE "Shape";

-- CreateTable
CREATE TABLE "Shapes" (
    "id" SERIAL NOT NULL,
    "type" "shapeType" NOT NULL,
    "startX" INTEGER NOT NULL,
    "startY" INTEGER NOT NULL,
    "color" TEXT,
    "height" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "lineWidth" INTEGER,
    "endX" INTEGER,
    "endY" INTEGER,
    "radius" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "roomId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Shapes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shapes_type_key" ON "Shapes"("type");

-- AddForeignKey
ALTER TABLE "Shapes" ADD CONSTRAINT "Shapes_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shapes" ADD CONSTRAINT "Shapes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
