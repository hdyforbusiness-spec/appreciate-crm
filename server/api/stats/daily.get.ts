import { getPrisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const prisma = getPrisma(event)
  
  const query = getQuery(event)
  const { startDate, endDate } = query

  // Validate date parameters
  if (!startDate || !endDate) {
    throw createError({
      statusCode: 400,
      message: 'startDate ve endDate parametreleri gereklidir'
    })
  }

  const start = new Date(startDate as string)
  const end = new Date(endDate as string)
  
  // Set time to start and end of day
  start.setHours(0, 0, 0, 0)
  end.setHours(23, 59, 59, 999)

  try {
    // Get bookings in date range
    const bookings = await prisma.booking.findMany({
      where: {
        turTarihi: {
          gte: start,
          lte: end
        }
      },
      orderBy: { turTarihi: 'asc' }
    })

    // Calculate aggregated statistics
    const totalBookings = bookings.length
    const totalRevenue = bookings.reduce((sum, booking) => sum + Number(booking.toplamTutar), 0)
    const totalPersonCount = bookings.reduce((sum, booking) => sum + booking.kacKisi, 0)
    const totalChildCount = bookings.reduce((sum, booking) => sum + booking.cocukSayisi, 0)
    
    // Calculate costs (1200 TL per adult, 600 TL per child)
    const totalCost = totalPersonCount * 1200 + totalChildCount * 600
    
    // Calculate profit (Revenue - Cost)
    const totalProfit = totalRevenue - totalCost

    // Group by date for daily breakdown
    const dailyStats = bookings.reduce((acc, booking) => {
      const date = booking.turTarihi.toISOString().split('T')[0]
      
      if (!acc[date]) {
        acc[date] = {
          date,
          bookings: 0,
          revenue: 0,
          personCount: 0,
          childCount: 0,
          cost: 0,
          profit: 0
        }
      }
      
      acc[date].bookings += 1
      acc[date].revenue += Number(booking.toplamTutar)
      acc[date].personCount += booking.kacKisi
      acc[date].childCount += booking.cocukSayisi
      acc[date].cost += booking.kacKisi * 1200 + booking.cocukSayisi * 600
      acc[date].profit = acc[date].revenue - acc[date].cost
      
      return acc
    }, {} as Record<string, any>)

    // Convert to array and sort by date
    const dailyBreakdown = Object.values(dailyStats).sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    return {
      dateRange: {
        startDate: startDate,
        endDate: endDate
      },
      summary: {
        totalBookings,
        totalRevenue,
        totalPersonCount,
        totalChildCount,
        totalCost,
        totalProfit
      },
      dailyBreakdown,
      bookings: bookings.map(booking => ({
        id: booking.id,
        reservationId: booking.reservationId,
        adSoyad: booking.adSoyad,
        telefon: booking.telefon,
        turTarihi: booking.turTarihi,
        turAdi: booking.turAdi,
        kacKisi: booking.kacKisi,
        cocukSayisi: booking.cocukSayisi,
        toplamTutar: booking.toplamTutar,
        biletTipi: booking.biletTipi,
        alinisYeri: booking.alinisYeri,
        alinisSaati: booking.alinisSaati
      }))
    }
  } catch (error) {
    console.error('Daily stats hatası:', error)
    throw createError({
      statusCode: 500,
      message: 'Günlük istatistikler alınamadı'
    })
  }
})
