/*
  Warnings:

  - Added the required column `youtube_description` to the `Home` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Home" ADD COLUMN     "youtube_description" TEXT NOT NULL;
