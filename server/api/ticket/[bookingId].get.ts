import { getPrisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'
import { formatDateTR, formatCurrency, formatPhoneForTicket } from '../../utils/helpers'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const prisma = getPrisma(event)
  
  const bookingId = getRouterParam(event, 'bookingId')
  
  console.log('Ticket data requested for booking ID:', bookingId)
  
  if (!bookingId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Rezervasyon ID gereklidir'
    })
  }

  try {
    // Get booking data
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId, isDeleted: false }
    })

    if (!booking) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Rezervasyon bulunamadı'
      })
    }

    // Return ticket data as JSON (works in both development and production)
    setHeader(event, 'Content-Type', 'application/json')
    return {
      success: true,
      message: 'Ticket data retrieved successfully',
      ticketData: {
        reservationId: booking.reservationId,
        adSoyad: booking.adSoyad,
        telefon: formatPhoneForTicket(booking.telefon),
        turAdi: booking.turAdi,
        turTarihi: formatDateTR(booking.turTarihi),
        kacKisi: booking.kacKisi,
        turFiyati: formatCurrency(Number(booking.turFiyati)),
        toplamTutar: formatCurrency(Number(booking.toplamTutar)),
        biletTipi: booking.biletTipi,
        alinisYeri: booking.alinisYeri,
        alinisSaati: booking.alinisSaati,
        not: booking.not,
        createdAt: formatDateTR(booking.createdAt)
      }
    }

  } catch (error) {
    console.error('Ticket data retrieval error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Bilet bilgileri alınamadı'
    })
  }
})
