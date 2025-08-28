import { getPrisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const prisma = getPrisma(event)
  
  const query = getQuery(event)
  const { 
    search, 
    turAdi, 
    startDate, 
    endDate, 
    kacKisi,
    page = '1',
    limit = '20'
  } = query

  const skip = (parseInt(page as string) - 1) * parseInt(limit as string)
  const take = parseInt(limit as string)

  // Filtre koşulları
  const where: any = {
    isDeleted: false
  }

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
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.booking.count({ where })
    ])

    return {
      bookings,
      total,
      page: parseInt(page as string),
      totalPages: Math.ceil(total / take)
    }
  } catch (error) {
    console.error('Rezervasyon listesi hatası:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Rezervasyonlar alınamadı'
    })
  }
})
