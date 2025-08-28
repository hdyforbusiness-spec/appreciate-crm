import { getPrisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const prisma = getPrisma(event)
  
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Rezervasyon ID gereklidir'
    })
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: {
        id: id,
        isDeleted: false
      }
    })

    if (!booking) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Rezervasyon bulunamadı'
      })
    }

    return booking
  } catch (error) {
    console.error('Rezervasyon getirme hatası:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Rezervasyon getirilemedi'
    })
  }
})

