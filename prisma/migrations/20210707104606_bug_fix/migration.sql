-- DropIndex
DROP INDEX "registration_user_id_unique";

-- AlterTable
ALTER TABLE "participants" ALTER COLUMN "gender" DROP NOT NULL,
ALTER COLUMN "blood_group" DROP NOT NULL;

-- AlterTable
ALTER TABLE "registration" ALTER COLUMN "idprof_name" DROP NOT NULL,
ALTER COLUMN "id_prof1" DROP NOT NULL;
