import { getPrisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const prisma = getPrisma(event)
  const query = getQuery(event)

  try {
    const where: any = {}
    // ?aktif=true -> sadece aktif turlar (rezervasyon formu için)
    if (query.aktif === 'true') {
      where.aktif = true
    }

    const tours = await prisma.tour.findMany({
      where,
      orderBy: { ad: 'asc' }
    })

    return { tours }
  } catch (error) {
    console.error('Tur listesi hatası:', error)
    throw createError({
      statusCode: 500,
      message: 'Turlar alınamadı'
    })
  }
})
