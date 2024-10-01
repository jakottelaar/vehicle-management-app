-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL DEFAULT 0,
    "purchasePrice" DECIMAL(10,2) NOT NULL,
    "purchaseDate" TIMESTAMP NOT NULL,
    "mileage" INTEGER NOT NULL DEFAULT 0,
    "vin" TEXT,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);
