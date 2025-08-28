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
    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id: id, isDeleted: false }
    })

    if (!existingBooking) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Rezervasyon bulunamadı'
      })
    }

    // Soft delete
    const booking = await prisma.booking.update({
      where: { id: id },
      data: {
        isDeleted: true,
        deletedAt: new Date()
      }
    })

    return {
      success: true,
      message: 'Rezervasyon silindi'
    }
  } catch (error) {
    console.error('Rezervasyon silme hatası:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Rezervasyon silinemedi'
    })
  }
})

