/*
  Warnings:

  - A unique constraint covering the columns `[nomineeEmail]` on the table `Nomination` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Nomination_nomineeEmail_key" ON "Nomination"("nomineeEmail");
