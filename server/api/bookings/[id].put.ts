import { prisma } from '../../utils/prisma'
import { calculateTotal } from '../../utils/helpers'
import { validateBooking } from '../../utils/validators'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Rezervasyon ID gereklidir'
    })
  }

  // Validasyon
  const errors = validateBooking(body)
  if (errors.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validasyon hatası',
      data: errors
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

    // Toplam tutarı hesapla
    const toplamTutar = calculateTotal(body.kacKisi, body.turFiyati)

    const booking = await prisma.booking.update({
      where: { id: id },
      data: {
        adSoyad: body.adSoyad.trim(),
        telefon: body.telefon.trim(),
        kacKisi: body.kacKisi,
        turTarihi: new Date(body.turTarihi),
        turAdi: body.turAdi.trim(),
        turFiyati: body.turFiyati,
        toplamTutar,
        not: body.not?.trim() || null
      }
    })

    return {
      success: true,
      booking,
      message: 'Rezervasyon güncellendi'
    }
  } catch (error) {
    console.error('Rezervasyon güncelleme hatası:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Rezervasyon güncellenemedi'
    })
  }
})

