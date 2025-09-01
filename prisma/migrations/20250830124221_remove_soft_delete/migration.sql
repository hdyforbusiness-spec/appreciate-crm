-- Remove soft delete columns
-- SQLite has limitations with ALTER TABLE, so we'll recreate the table

-- First drop the index on isDeleted column
DROP INDEX "bookings_isDeleted_idx";

-- Create new table without soft delete columns
CREATE TABLE "bookings_new" (
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

-- Copy data from old table to new table (excluding soft delete columns)
INSERT INTO "bookings_new" (
    "id", "reservationId", "adSoyad", "telefon", "kacKisi", "cocukSayisi", 
    "turTarihi", "turAdi", "turFiyati", "toplamTutar", "not", "biletTipi", 
    "alinisYeri", "alinisSaati", "createdAt", "updatedAt"
)
SELECT 
    "id", "reservationId", "adSoyad", "telefon", "kacKisi", 
    COALESCE("cocukSayisi", 0) as "cocukSayisi",
    "turTarihi", "turAdi", "turFiyati", "toplamTutar", "not", "biletTipi", 
    "alinisYeri", "alinisSaati", "createdAt", "updatedAt"
FROM "bookings"
WHERE "isDeleted" = 0 OR "isDeleted" IS NULL;

-- Drop old table
DROP TABLE "bookings";

-- Rename new table to original name
ALTER TABLE "bookings_new" RENAME TO "bookings";

-- Recreate necessary indexes
CREATE UNIQUE INDEX "bookings_reservationId_key" ON "bookings"("reservationId");
CREATE INDEX "bookings_turTarihi_idx" ON "bookings"("turTarihi");
CREATE INDEX "bookings_turAdi_idx" ON "bookings"("turAdi");
