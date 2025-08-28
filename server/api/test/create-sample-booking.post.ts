import { getPrisma } from '../../utils/prisma'
import { generateReservationId, calculateTotal } from '../../utils/helpers'

export default defineEventHandler(async (event) => {
  const prisma = getPrisma(event)
  
  try {
    // Create a sample booking for testing
    const reservationId = generateReservationId()
    const kacKisi = 2
    const turFiyati = 150
    const toplamTutar = calculateTotal(kacKisi, turFiyati)

    const booking = await prisma.booking.create({
      data: {
        reservationId,
        adSoyad: 'Test Müşteri',
        telefon: '05551234567',
        kacKisi,
        turTarihi: new Date('2024-09-15'),
        turAdi: 'Kapadokya Turu',
        turFiyati,
        toplamTutar,
        not: 'Test için oluşturulmuş rezervasyon'
      }
    })

    return {
      success: true,
      booking,
      pdfUrl: `/api/ticket/${booking.id}`,
      message: 'Test rezervasyonu oluşturuldu'
    }
  } catch (error) {
    console.error('Test rezervasyon oluşturma hatası:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Test rezervasyon oluşturulamadı'
    })
  }
})

