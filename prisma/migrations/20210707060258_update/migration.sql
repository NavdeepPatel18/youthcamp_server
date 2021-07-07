/*
  Warnings:

  - You are about to drop the column `id_prof` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "id_prof",
ADD COLUMN     "id_prof1" TEXT,
ADD COLUMN     "id_prof2" TEXT;
