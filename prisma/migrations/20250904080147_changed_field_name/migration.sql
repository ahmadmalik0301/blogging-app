/*
  Warnings:

  - You are about to drop the column `dateOfbirth` on the `User` table. All the data in the column will be lost.
  - Added the required column `dateOfBirth` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "dateOfbirth",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL;
