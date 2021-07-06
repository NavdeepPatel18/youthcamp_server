/*
  Warnings:

  - You are about to drop the column `dob` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `id_prof` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `idprof_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `mobileno` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `registration` table. All the data in the column will be lost.
  - You are about to drop the `checkout` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "checkout" DROP CONSTRAINT "checkout_registration_id_fkey";

-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_registration_id_fkey";

-- DropForeignKey
ALTER TABLE "registration" DROP CONSTRAINT "registration_user_id_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "dob",
DROP COLUMN "gender",
DROP COLUMN "id_prof",
DROP COLUMN "idprof_name",
DROP COLUMN "mobileno";

-- AlterTable
ALTER TABLE "registration" DROP COLUMN "user_id";

-- DropTable
DROP TABLE "checkout";

-- DropTable
DROP TABLE "payment";
