import { getPrisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'
import { validateBookingDataStrict } from '../../utils/validators'

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
    const body = await readBody(event)
    
    // Validate the data
    const validationResult = validateBookingDataStrict(body)
    if (!validationResult.success) {
      throw createError({
        statusCode: 400,
        statusMessage: validationResult.error
      })
    }

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

    // Update the booking
    const updatedBooking = await prisma.booking.update({
      where: { id: id },
      data: {
        adSoyad: body.adSoyad,
        telefon: body.telefon,
        kacKisi: parseInt(body.kacKisi),
        cocukSayisi: parseInt(body.cocukSayisi) || 0,
        turTarihi: new Date(body.turTarihi),
        turAdi: body.turAdi,
        turFiyati: parseFloat(body.turFiyati),
        toplamTutar: parseFloat(body.toplamTutar),
        not: body.not || null,
        biletTipi: body.biletTipi,
        alinisYeri: body.alinisYeri || null,
        alinisSaati: body.alinisSaati || null
      }
    })

    return {
      success: true,
      message: 'Rezervasyon güncellendi',
      booking: updatedBooking
    }
  } catch (error) {
    console.error('Rezervasyon güncelleme hatası:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Rezervasyon güncellenemedi'
    })
  }
})

