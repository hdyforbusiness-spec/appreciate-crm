import { getPrisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const prisma = getPrisma(event)

  try {
    // Get total bookings
    const totalBookings = await prisma.booking.count()

    // Get today's bookings
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayBookings = await prisma.booking.count({
      where: {
        turTarihi: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    // Get this month's bookings
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    const monthBookings = await prisma.booking.count({
      where: {
        turTarihi: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    })

    // Get total revenue
    const totalRevenue = await prisma.booking.aggregate({
      _sum: {
        toplamTutar: true
      }
    })

    // Get today's revenue
    const todayRevenue = await prisma.booking.aggregate({
      _sum: {
        toplamTutar: true
      },
      where: {
        turTarihi: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    // Get this month's revenue
    const monthRevenue = await prisma.booking.aggregate({
      _sum: {
        toplamTutar: true
      },
      where: {
        turTarihi: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    })

    return {
      totalBookings,
      todayBookings,
      monthBookings,
      totalRevenue: totalRevenue._sum.toplamTutar || 0,
      todayRevenue: todayRevenue._sum.toplamTutar || 0,
      monthRevenue: monthRevenue._sum.toplamTutar || 0
    }
  } catch (error) {
    console.error('Dashboard stats hatası:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Dashboard istatistikleri alınamadı'
    })
  }
})
