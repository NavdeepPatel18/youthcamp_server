/*
  Warnings:

  - You are about to drop the column `id_prof` on the `registration` table. All the data in the column will be lost.
  - You are about to drop the column `package_id` on the `registration` table. All the data in the column will be lost.
  - You are about to drop the column `subpackage_name` on the `registration` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[registration_id]` on the table `participants` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `registration` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `camp_name` to the `registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_prof1` to the `registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `package_name` to the `registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `travel_modw` to the `registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `registration` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "registration" DROP CONSTRAINT "registration_package_id_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dob" DATE,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "id_prof" TEXT,
ADD COLUMN     "idprof_name" TEXT,
ADD COLUMN     "mobileno" BIGINT;

-- AlterTable
ALTER TABLE "participants" ADD COLUMN     "id_proof2" TEXT,
ALTER COLUMN "id_proof" DROP NOT NULL,
ALTER COLUMN "health_problem" DROP NOT NULL;

-- AlterTable
ALTER TABLE "registration" DROP COLUMN "id_prof",
DROP COLUMN "package_id",
DROP COLUMN "subpackage_name",
ADD COLUMN     "camp_name" TEXT NOT NULL,
ADD COLUMN     "id_prof1" TEXT NOT NULL,
ADD COLUMN     "id_prof2" TEXT,
ADD COLUMN     "package_name" TEXT NOT NULL,
ADD COLUMN     "travel_modw" TEXT NOT NULL,
ADD COLUMN     "user_id" BIGINT NOT NULL,
ALTER COLUMN "health_problem" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "participants_registration_id_unique" ON "participants"("registration_id");

-- CreateIndex
CREATE UNIQUE INDEX "registration_user_id_unique" ON "registration"("user_id");

-- AddForeignKey
ALTER TABLE "registration" ADD FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
