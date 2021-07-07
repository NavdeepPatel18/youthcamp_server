/*
  Warnings:

  - You are about to drop the column `emailid` on the `registration` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `registration` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "participants_registration_id_unique";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "photo" DROP NOT NULL;

-- AlterTable
ALTER TABLE "registration" DROP COLUMN "emailid",
ADD COLUMN     "email" TEXT NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");
