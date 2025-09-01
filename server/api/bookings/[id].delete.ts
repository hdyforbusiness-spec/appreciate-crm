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
      where: { id: id }
    })

    if (!existingBooking) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Rezervasyon bulunamadı'
      })
    }

    // Hard delete - physically remove from database
    await prisma.booking.delete({
      where: { id: id }
    })

    return {
      success: true,
      message: 'Rezervasyon kalıcı olarak silindi'
    }
  } catch (error) {
    console.error('Rezervasyon silme hatası:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Rezervasyon silinemedi'
    })
  }
})

