/*
  Warnings:

  - You are about to drop the column `accessoryId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleId` on the `Post` table. All the data in the column will be lost.
  - Added the required column `vehicleId` to the `Accessory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_accessoryId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_vehicleId_fkey";

-- DropIndex
DROP INDEX "Post_accessoryId_key";

-- DropIndex
DROP INDEX "Post_vehicleId_key";

-- AlterTable
ALTER TABLE "Accessory" ADD COLUMN     "vehicleId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "accessoryId",
DROP COLUMN "vehicleId";

-- CreateTable
CREATE TABLE "PostVehicle" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "vehicleId" INTEGER NOT NULL,

    CONSTRAINT "PostVehicle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostVehicle_postId_vehicleId_key" ON "PostVehicle"("postId", "vehicleId");

-- AddForeignKey
ALTER TABLE "Accessory" ADD CONSTRAINT "Accessory_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostVehicle" ADD CONSTRAINT "PostVehicle_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostVehicle" ADD CONSTRAINT "PostVehicle_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
