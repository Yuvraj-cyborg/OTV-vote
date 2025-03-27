-- CreateTable
CREATE TABLE "AdminState" (
    "id" SERIAL NOT NULL,
    "phase" TEXT NOT NULL DEFAULT 'nomination',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminState_pkey" PRIMARY KEY ("id")
);
