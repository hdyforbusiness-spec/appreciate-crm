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

    // Get total person count (kacKisi)
    const totalPersonCount = await prisma.booking.aggregate({
      _sum: {
        kacKisi: true
      }
    })

    // Get total child count (cocukSayisi)
    const totalChildCount = await prisma.booking.aggregate({
      _sum: {
        cocukSayisi: true
      }
    })

    // Get this month's person count
    const monthPersonCount = await prisma.booking.aggregate({
      _sum: {
        kacKisi: true
      },
      where: {
        turTarihi: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    })

    // Get this month's child count
    const monthChildCount = await prisma.booking.aggregate({
      _sum: {
        cocukSayisi: true
      },
      where: {
        turTarihi: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    })

    // Calculate total cost (1200 TL per adult, 600 TL per child)
    const totalCost = (totalPersonCount._sum.kacKisi || 0) * 1200 + (totalChildCount._sum.cocukSayisi || 0) * 600
    const monthCost = (monthPersonCount._sum.kacKisi || 0) * 1200 + (monthChildCount._sum.cocukSayisi || 0) * 600

    // Calculate profit (Revenue - Cost)
    const totalProfit = (totalRevenue._sum.toplamTutar || 0) - totalCost
    const monthProfit = (monthRevenue._sum.toplamTutar || 0) - monthCost

    return {
      totalBookings,
      todayBookings,
      monthBookings,
      totalRevenue: totalRevenue._sum.toplamTutar || 0,
      todayRevenue: todayRevenue._sum.toplamTutar || 0,
      monthRevenue: monthRevenue._sum.toplamTutar || 0,
      totalPersonCount: totalPersonCount._sum.kacKisi || 0,
      totalChildCount: totalChildCount._sum.cocukSayisi || 0,
      monthPersonCount: monthPersonCount._sum.kacKisi || 0,
      monthChildCount: monthChildCount._sum.cocukSayisi || 0,
      totalCost,
      monthCost,
      totalProfit,
      monthProfit
    }
  } catch (error) {
    console.error('Dashboard stats hatası:', error)
    throw createError({
      statusCode: 500,
      message: 'Dashboard istatistikleri alınamadı'
    })
  }
})
