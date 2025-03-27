/*
  Warnings:

  - A unique constraint covering the columns `[userId,categoryId]` on the table `Nomination` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Nomination" ADD COLUMN     "instagramUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Nomination_userId_categoryId_key" ON "Nomination"("userId", "categoryId");
