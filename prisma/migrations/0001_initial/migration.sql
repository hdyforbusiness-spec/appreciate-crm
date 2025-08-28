-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reservationId" TEXT NOT NULL,
    "adSoyad" TEXT NOT NULL,
    "telefon" TEXT NOT NULL,
    "kacKisi" INTEGER NOT NULL,
    "turTarihi" DATETIME NOT NULL,
    "turAdi" TEXT NOT NULL,
    "turFiyati" DECIMAL NOT NULL,
    "toplamTutar" DECIMAL NOT NULL,
    "not" TEXT,
    "biletTipi" TEXT NOT NULL DEFAULT 'Servis Kullanacak',
    "alinisYeri" TEXT,
    "alinisSaati" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "bookings_reservationId_key" ON "bookings"("reservationId");

-- CreateIndex for better query performance
CREATE INDEX "bookings_turTarihi_idx" ON "bookings"("turTarihi");

-- CreateIndex for soft delete queries
CREATE INDEX "bookings_isDeleted_idx" ON "bookings"("isDeleted");

-- CreateIndex for tour name filtering
CREATE INDEX "bookings_turAdi_idx" ON "bookings"("turAdi");
