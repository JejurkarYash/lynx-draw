/*
  Warnings:

  - You are about to drop the column `message` on the `Chat` table. All the data in the column will be lost.
  - Added the required column `shapeId` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "shapeType" AS ENUM ('RECTANGLE', 'CIRCLE', 'LINE');

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "message",
ADD COLUMN     "shapeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Shape" (
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

    CONSTRAINT "Shape_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shape_type_key" ON "Shape"("type");

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_shapeId_fkey" FOREIGN KEY ("shapeId") REFERENCES "Shape"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
