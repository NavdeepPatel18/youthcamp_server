-- CreateTable
CREATE TABLE "User" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "mobileno" BIGINT NOT NULL,
    "email" TEXT NOT NULL,
    "idprof_name" TEXT NOT NULL,
    "id_prof" TEXT NOT NULL,
    "dob" DATE NOT NULL,
    "gender" TEXT NOT NULL,
    "photo" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registration" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "mobileno" BIGINT NOT NULL,
    "emailid" TEXT NOT NULL,
    "idprof_name" TEXT NOT NULL,
    "id_prof" TEXT NOT NULL,
    "dob" DATE NOT NULL,
    "gender" TEXT NOT NULL,
    "health_problem" TEXT NOT NULL,
    "blood_group" TEXT NOT NULL,
    "subpackage_name" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "status" TEXT NOT NULL,
    "package_id" INTEGER NOT NULL,
    "user_id" BIGINT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participants" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "mobile_no" BIGINT NOT NULL,
    "email" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "id_proof_name" TEXT NOT NULL,
    "id_proof" TEXT NOT NULL,
    "dob" DATE NOT NULL,
    "health_problem" TEXT NOT NULL,
    "blood_group" TEXT NOT NULL,
    "registration_id" BIGINT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkout" (
    "id" BIGSERIAL NOT NULL,
    "method" TEXT NOT NULL,
    "booking_date" DATE NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "tax_price" DOUBLE PRECISION NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "registration_id" BIGINT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" BIGSERIAL NOT NULL,
    "payment_method" TEXT NOT NULL,
    "payment_token" TEXT NOT NULL,
    "registration_id" BIGINT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "checkout_registration_id_unique" ON "checkout"("registration_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_registration_id_unique" ON "payment"("registration_id");

-- AddForeignKey
ALTER TABLE "registration" ADD FOREIGN KEY ("package_id") REFERENCES "packageName"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registration" ADD FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD FOREIGN KEY ("registration_id") REFERENCES "registration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkout" ADD FOREIGN KEY ("registration_id") REFERENCES "registration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD FOREIGN KEY ("registration_id") REFERENCES "registration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
