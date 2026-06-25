import { getPrisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'
import { validateBookingDataStrict } from '../../utils/validators'
import { calculateTotal } from '../../utils/helpers'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const prisma = getPrisma(event)
  
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Rezervasyon ID gereklidir'
    })
  }

  try {
    const body = await readBody(event)
    
    // Validate the data
    const validationResult = validateBookingDataStrict(body)
    if (!validationResult.success) {
      throw createError({
        statusCode: 400,
        message: validationResult.error
      })
    }

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id: id }
    })

    if (!existingBooking) {
      throw createError({
        statusCode: 404,
        message: 'Rezervasyon bulunamadı'
      })
    }

    // Calculate the total amount server-side
    const toplamTutar = calculateTotal(
      parseInt(body.kacKisi), 
      parseFloat(body.turFiyati), 
      parseInt(body.cocukSayisi) || 0
    )

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
        toplamTutar,
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
      message: 'Rezervasyon güncellenemedi'
    })
  }
})

