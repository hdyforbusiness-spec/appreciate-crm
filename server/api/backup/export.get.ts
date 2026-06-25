import { getPrisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

// Tüm veritabanını (rezervasyonlar + turlar) tek bir JSON dosyası olarak indirtir.
// Cloudflare D1'de dosya sistemi olmadığı için yedek, veriyi okuyup indirten
// bu endpoint üzerinden alınır. Dönen dosya daha sonra geri yükleme için kullanılabilir.
export default defineEventHandler(async (event) => {
  requireAuth(event)
  const prisma = getPrisma(event)

  try {
    const [bookings, tours] = await Promise.all([
      prisma.booking.findMany({ orderBy: { createdAt: 'asc' } }),
      prisma.tour.findMany({ orderBy: { ad: 'asc' } })
    ])

    const backup = {
      meta: {
        format: 'appreciate-crm-backup',
        version: 1,
        exportedAt: new Date().toISOString(),
        counts: {
          bookings: bookings.length,
          tours: tours.length
        }
      },
      data: {
        bookings,
        tours
      }
    }

    // Dosya adı için tarih damgası: 2026-06-25_14-30-00
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`
    const filename = `appreciate-crm-yedek_${stamp}.json`

    setHeader(event, 'Content-Type', 'application/json; charset=utf-8')
    setHeader(event, 'Content-Disposition', `attachment; filename="${filename}"`)
    setHeader(event, 'Cache-Control', 'no-store')

    // Decimal alanlar JSON.stringify ile string'e döner; bu kasıtlı (hassasiyet korunur).
    return JSON.stringify(backup, null, 2)
  } catch (error) {
    console.error('Yedek dışa aktarma hatası:', error)
    throw createError({
      statusCode: 500,
      message: 'Yedek oluşturulamadı'
    })
  }
})
