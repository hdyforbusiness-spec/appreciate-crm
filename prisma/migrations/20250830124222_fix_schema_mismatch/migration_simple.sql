-- Fix schema mismatch - ensure database matches current Prisma schema
-- This migration will recreate the table with the correct structure

-- Drop existing table and recreate it
DROP TABLE IF EXISTS "bookings";

-- Create table with correct schema (matching current Prisma schema)
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reservationId" TEXT NOT NULL,
    "adSoyad" TEXT NOT NULL,
    "telefon" TEXT NOT NULL,
    "kacKisi" INTEGER NOT NULL,
    "cocukSayisi" INTEGER NOT NULL DEFAULT 0,
    "turTarihi" DATETIME NOT NULL,
    "turAdi" TEXT NOT NULL,
    "turFiyati" DECIMAL NOT NULL,
    "toplamTutar" DECIMAL NOT NULL,
    "not" TEXT,
    "biletTipi" TEXT NOT NULL DEFAULT 'Servis Kullanacak',
    "alinisYeri" TEXT,
    "alinisSaati" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Create necessary indexes
CREATE UNIQUE INDEX "bookings_reservationId_key" ON "bookings"("reservationId");
CREATE INDEX "bookings_turTarihi_idx" ON "bookings"("turTarihi");
CREATE INDEX "bookings_turAdi_idx" ON "bookings"("turAdi");
