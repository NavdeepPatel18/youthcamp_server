/*
  Warnings:

  - You are about to alter the column `distance` on the `Camp` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Camp" ALTER COLUMN "distance" SET DATA TYPE INTEGER;
