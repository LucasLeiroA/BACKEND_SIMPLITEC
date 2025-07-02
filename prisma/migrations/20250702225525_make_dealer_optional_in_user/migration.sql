-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_dealerId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "dealerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "Dealer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
