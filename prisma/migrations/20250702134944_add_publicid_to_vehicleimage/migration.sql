/*
  Warnings:

  - Added the required column `publicId` to the `VehicleImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VehicleImage" ADD COLUMN     "publicId" TEXT NOT NULL;
