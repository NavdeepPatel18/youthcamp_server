/*
  Warnings:

  - You are about to drop the column `travel_modw` on the `registration` table. All the data in the column will be lost.
  - Added the required column `travel_mode` to the `registration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "registration" DROP COLUMN "travel_modw",
ADD COLUMN     "travel_mode" TEXT NOT NULL;
