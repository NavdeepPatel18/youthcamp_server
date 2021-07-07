/*
  Warnings:

  - You are about to drop the column `id_proof` on the `participants` table. All the data in the column will be lost.
  - You are about to drop the column `id_proof2` on the `participants` table. All the data in the column will be lost.
  - You are about to drop the column `id_proof_name` on the `participants` table. All the data in the column will be lost.
  - You are about to drop the column `mobile_no` on the `participants` table. All the data in the column will be lost.
  - Added the required column `mobileno` to the `participants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "participants" DROP COLUMN "id_proof",
DROP COLUMN "id_proof2",
DROP COLUMN "id_proof_name",
DROP COLUMN "mobile_no",
ADD COLUMN     "id_prof1" TEXT,
ADD COLUMN     "id_prof2" TEXT,
ADD COLUMN     "idprof_name" TEXT,
ADD COLUMN     "mobileno" BIGINT NOT NULL;
