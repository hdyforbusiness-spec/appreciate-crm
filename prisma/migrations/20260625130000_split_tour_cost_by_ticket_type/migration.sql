-- tours.maliyet -> bilet tipine göre iki ayrı maliyet
ALTER TABLE "tours" ADD COLUMN "maliyetServis" DECIMAL NOT NULL DEFAULT 0;
ALTER TABLE "tours" ADD COLUMN "maliyetKendiArac" DECIMAL NOT NULL DEFAULT 0;

-- Mevcut tek maliyeti ikisine de kopyala (varsa)
UPDATE "tours" SET "maliyetServis" = "maliyet", "maliyetKendiArac" = "maliyet";

-- Eski tek maliyet kolonunu kaldır
ALTER TABLE "tours" DROP COLUMN "maliyet";
