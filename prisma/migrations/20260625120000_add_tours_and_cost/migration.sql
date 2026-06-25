-- AlterTable: bookings tablosuna maliyet snapshot alanları
ALTER TABLE "bookings" ADD COLUMN "birimMaliyet" DECIMAL NOT NULL DEFAULT 0;
ALTER TABLE "bookings" ADD COLUMN "toplamMaliyet" DECIMAL NOT NULL DEFAULT 0;

-- Backfill: mevcut rezervasyonlar için eski global varsayım (yetişkin 1200 / çocuk 600)
-- ile geriye doldur ki geçmiş kâr/maliyet raporları değişmesin.
UPDATE "bookings"
SET "birimMaliyet" = 1200,
    "toplamMaliyet" = "kacKisi" * 1200 + "cocukSayisi" * 600
WHERE "birimMaliyet" = 0;

-- CreateTable: tours
CREATE TABLE "tours" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ad" TEXT NOT NULL,
    "maliyet" DECIMAL NOT NULL DEFAULT 0,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "tours_ad_key" ON "tours"("ad");
