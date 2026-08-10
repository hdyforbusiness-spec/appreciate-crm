import { getPrisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

// Rezervasyon listesini (ekrandaki filtrelerle aynı koşullarda, sayfalama olmadan)
// CSV olarak indirtir. Hedef tüketici Excel tr-TR olduğu için:
//  - ayraç  ";"   (tr-TR'de liste ayracı virgül değil noktalı virgüldür)
//  - ondalık ","  (aksi halde Excel tutarları metin olarak okur)
//  - UTF-8 BOM    (aksi halde Türkçe karakterler bozulur)
const DELIMITER = ';'
const NEWLINE = '\r\n'
// BOM koddan üretiliyor: kaynağa gömülü çıplak U+FEFF editörde ve diff'te
// görünmez olduğu için yanlışlıkla silinmeye açıktır.
const BOM = String.fromCharCode(0xFEFF)

const dateFmt = new Intl.DateTimeFormat('tr-TR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'Europe/Istanbul'
})

const dateTimeFmt = new Intl.DateTimeFormat('tr-TR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Europe/Istanbul'
})

// Dosya adı damgası. Worker'lar UTC'de çalıştığı için new Date().getHours()
// kullanılsaydı dosya adı, içerideki saatlerden 3 saat sapardı.
// sv-SE "2026-08-09 11:33:43" verir; tarih damgası için doğrudan kullanışlı.
const stampFmt = new Intl.DateTimeFormat('sv-SE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZone: 'Europe/Istanbul'
})

/**
 * Bir hücreyi CSV'ye güvenli şekilde yazar.
 * Ayraç/tırnak/satır sonu içeren değerler tırnaklanır, içteki tırnak ikilenir.
 */
function csvCell(value: unknown): string {
  if (value === null || value === undefined) return ''

  let text = String(value)

  // Excel formül enjeksiyonu koruması. "-" bilinçli olarak hariç:
  // negatif kâr tutarlarını ve tire içeren telefonları bozmamak için.
  if (/^[=+@\t\r]/.test(text)) {
    text = `'${text}`
  }

  if (text.includes(DELIMITER) || /["\r\n]/.test(text)) {
    text = `"${text.replace(/"/g, '""')}"`
  }

  return text
}

/** Prisma Decimal / number değerini "1500,00" biçimine çevirir. */
function csvMoney(value: unknown): string {
  if (value === null || value === undefined) return ''
  const num = Number(value)
  if (!Number.isFinite(num)) return ''
  return num.toFixed(2).replace('.', ',')
}

const COLUMNS = [
  'Rezervasyon No',
  'Ad Soyad',
  'Telefon',
  'Yetişkin',
  'Çocuk',
  'Tur Tarihi',
  'Tur Adı',
  'Bilet Tipi',
  'Alınış Yeri',
  'Alınış Saati',
  'Kişi Başı Fiyat',
  'Toplam Tutar',
  'Kişi Başı Maliyet',
  'Toplam Maliyet',
  'Kâr',
  'Not',
  'Kayıt Tarihi'
]

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const prisma = getPrisma(event)

  const query = getQuery(event)
  const { search, turAdi, startDate, endDate, kacKisi } = query

  // Filtre koşulları listeleme ucuyla (api/bookings) birebir aynı tutulmalı;
  // aksi halde CSV, ekranda görünen kayıt kümesinden sapar.
  const where: any = {}

  if (search) {
    where.OR = [
      { adSoyad: { contains: search as string } },
      { telefon: { contains: search as string } },
      { reservationId: { contains: search as string } }
    ]
  }

  if (turAdi) {
    where.turAdi = { contains: turAdi as string }
  }

  if (startDate || endDate) {
    where.turTarihi = {}
    if (startDate) {
      where.turTarihi.gte = new Date(startDate as string)
    }
    if (endDate) {
      where.turTarihi.lte = new Date(endDate as string)
    }
  }

  if (kacKisi) {
    where.kacKisi = parseInt(kacKisi as string)
  }

  try {
    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    const rows = [COLUMNS.join(DELIMITER)]

    for (const b of bookings) {
      const kar = Number(b.toplamTutar) - Number(b.toplamMaliyet)

      rows.push([
        csvCell(b.reservationId),
        csvCell(b.adSoyad),
        csvCell(b.telefon),
        csvCell(b.kacKisi),
        csvCell(b.cocukSayisi),
        csvCell(dateFmt.format(new Date(b.turTarihi))),
        csvCell(b.turAdi),
        csvCell(b.biletTipi),
        csvCell(b.alinisYeri),
        csvCell(b.alinisSaati),
        csvCell(csvMoney(b.turFiyati)),
        csvCell(csvMoney(b.toplamTutar)),
        csvCell(csvMoney(b.birimMaliyet)),
        csvCell(csvMoney(b.toplamMaliyet)),
        csvCell(csvMoney(kar)),
        csvCell(b.not),
        csvCell(dateTimeFmt.format(new Date(b.createdAt)))
      ].join(DELIMITER))
    }

    // Dosya adı için tarih damgası: 2026-06-25_14-30-00
    const stamp = stampFmt.format(new Date()).replace(' ', '_').replace(/:/g, '-')
    const filename = `rezervasyonlar_${stamp}.csv`

    setHeader(event, 'Content-Type', 'text/csv; charset=utf-8')
    setHeader(event, 'Content-Disposition', `attachment; filename="${filename}"`)
    setHeader(event, 'Cache-Control', 'no-store')

    return BOM + rows.join(NEWLINE) + NEWLINE
  } catch (error) {
    console.error('CSV dışa aktarma hatası:', error)
    throw createError({
      statusCode: 500,
      message: 'CSV oluşturulamadı'
    })
  }
})
