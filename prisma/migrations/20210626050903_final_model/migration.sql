/*
  Warnings:

  - You are about to alter the column `name` on the `Admin` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- CreateTable
CREATE TABLE "Home" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "title_photo" TEXT NOT NULL,
    "youtube_url" TEXT NOT NULL,
    "admin_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homeQuotes" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "home_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "travelQuotes" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "photo" TEXT NOT NULL,
    "home_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "travelStories" (
    "id" SERIAL NOT NULL,
    "review" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "home_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutUs" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "admin_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blog" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "photo" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "admin_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactUs" (
    "id" SERIAL NOT NULL,
    "email_id" TEXT NOT NULL,
    "phoneno" BIGINT NOT NULL,
    "insta_id" TEXT NOT NULL,
    "fb_id" TEXT NOT NULL,
    "admin_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teamMember" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "designation" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "contactUs_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Camp" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "photo" TEXT,
    "location" TEXT,
    "highlights" TEXT,
    "brochure" TEXT,
    "price" REAL NOT NULL,
    "duration_day" INTEGER NOT NULL,
    "duration_nights" INTEGER NOT NULL,
    "difficulty" TEXT,
    "distance" BIGINT NOT NULL,
    "age_group" TEXT,
    "admin_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campDate" (
    "id" SERIAL NOT NULL,
    "start" DATE NOT NULL,
    "end" DATE NOT NULL,
    "camp_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packageName" (
    "id" SERIAL NOT NULL,
    "subpackage" VARCHAR(255) NOT NULL,
    "photo" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "noday_nonight" TEXT NOT NULL,
    "camp_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule" (
    "id" SERIAL NOT NULL,
    "dayno" INTEGER NOT NULL,
    "day_title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "photo" TEXT,
    "camp_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campOtherDetail" (
    "id" SERIAL NOT NULL,
    "inclusion" TEXT[],
    "exclusion" TEXT[],
    "cancel_policy" TEXT[],
    "thing_cary" TEXT[],
    "camp_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campFaqs" (
    "id" SERIAL NOT NULL,
    "question" TEXT,
    "answer" TEXT,
    "camp_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AboutUs_admin_id_unique" ON "AboutUs"("admin_id");

-- CreateIndex
CREATE UNIQUE INDEX "ContactUs.email_id_unique" ON "ContactUs"("email_id");

-- CreateIndex
CREATE UNIQUE INDEX "ContactUs_admin_id_unique" ON "ContactUs"("admin_id");

-- AddForeignKey
ALTER TABLE "Home" ADD FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homeQuotes" ADD FOREIGN KEY ("home_id") REFERENCES "Home"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travelQuotes" ADD FOREIGN KEY ("home_id") REFERENCES "Home"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travelStories" ADD FOREIGN KEY ("home_id") REFERENCES "Home"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutUs" ADD FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactUs" ADD FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teamMember" ADD FOREIGN KEY ("contactUs_id") REFERENCES "ContactUs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Camp" ADD FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campDate" ADD FOREIGN KEY ("camp_id") REFERENCES "Camp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packageName" ADD FOREIGN KEY ("camp_id") REFERENCES "Camp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule" ADD FOREIGN KEY ("camp_id") REFERENCES "Camp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campOtherDetail" ADD FOREIGN KEY ("camp_id") REFERENCES "Camp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campFaqs" ADD FOREIGN KEY ("camp_id") REFERENCES "Camp"("id") ON DELETE CASCADE ON UPDATE CASCADE;
