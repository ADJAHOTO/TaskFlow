/*
  Warnings:

  - You are about to drop the column `hashPassword` on the `User` table. All the data in the column will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "status" SET DEFAULT 'todo',
ALTER COLUMN "priority" SET DEFAULT 'low';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "hashPassword",
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
