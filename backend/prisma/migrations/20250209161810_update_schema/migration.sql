/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Nomination` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Nomination_nomineeEmail_key";

-- AlterTable
ALTER TABLE "Nomination" DROP COLUMN "categoryId";
