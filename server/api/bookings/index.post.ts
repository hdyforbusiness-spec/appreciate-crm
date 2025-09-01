import { getPrisma } from '../../utils/prisma'
import { generateReservationId, calculateTotal } from '../../utils/helpers'
import { validateBooking } from '../../utils/validators'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const prisma = getPrisma(event)
  
  const body = await readBody(event)
  
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
    // Rezervasyon ID'si üret
    let reservationId: string
    let isUnique = false
    
    do {
      reservationId = generateReservationId()
      const existing = await prisma.booking.findUnique({
        where: { reservationId }
      })
      isUnique = !existing
    } while (!isUnique)

    // Toplam tutarı hesapla
    const toplamTutar = calculateTotal(body.kacKisi, body.turFiyati, body.cocukSayisi || 0)

    const booking = await prisma.booking.create({
      data: {
        reservationId,
        adSoyad: body.adSoyad.trim(),
        telefon: body.telefon.trim(),
        kacKisi: body.kacKisi,
        cocukSayisi: body.cocukSayisi || 0,
        turTarihi: new Date(body.turTarihi),
        turAdi: body.turAdi.trim(),
        turFiyati: body.turFiyati,
        toplamTutar,
        not: body.not?.trim() || null,
        biletTipi: body.biletTipi || 'Servis Kullanacak',
        alinisYeri: body.biletTipi === 'Servis Kullanacak' ? body.alinisYeri?.trim() || null : null,
        alinisSaati: body.biletTipi === 'Servis Kullanacak' ? body.alinisSaati?.trim() || null : null
      }
    })

    return {
      success: true,
      booking,
      message: 'Rezervasyon oluşturuldu'
    }
  } catch (error) {
    console.error('Rezervasyon oluşturma hatası:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Rezervasyon oluşturulamadı'
    })
  }
})
