-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bookings" (
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
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_bookings" ("adSoyad", "alinisSaati", "alinisYeri", "biletTipi", "createdAt", "deletedAt", "id", "isDeleted", "kacKisi", "not", "reservationId", "telefon", "toplamTutar", "turAdi", "turFiyati", "turTarihi", "updatedAt") SELECT "adSoyad", "alinisSaati", "alinisYeri", "biletTipi", "createdAt", "deletedAt", "id", "isDeleted", "kacKisi", "not", "reservationId", "telefon", "toplamTutar", "turAdi", "turFiyati", "turTarihi", "updatedAt" FROM "bookings";
DROP TABLE "bookings";
ALTER TABLE "new_bookings" RENAME TO "bookings";
CREATE UNIQUE INDEX "bookings_reservationId_key" ON "bookings"("reservationId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
