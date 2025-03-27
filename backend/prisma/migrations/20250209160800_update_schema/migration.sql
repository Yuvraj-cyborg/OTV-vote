/*
  Warnings:

  - Added the required column `categoryId` to the `Nomination` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Nomination" ADD COLUMN     "categoryId" INTEGER NOT NULL;
