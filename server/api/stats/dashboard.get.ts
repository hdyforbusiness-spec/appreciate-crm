import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  
  try {
    // Get total bookings
    const totalBookings = await prisma.booking.count({
      where: { isDeleted: false }
    })
    
    // Get this month's bookings
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    
    const thisMonth = await prisma.booking.count({
      where: {
        isDeleted: false,
        createdAt: {
          gte: startOfMonth
        }
      }
    })
    
    const lastMonth = await prisma.booking.count({
      where: {
        isDeleted: false,
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth
        }
      }
    })
    
    // Get revenue stats
    const revenueData = await prisma.booking.aggregate({
      where: { isDeleted: false },
      _sum: {
        toplamTutar: true
      }
    })
    
    const monthlyRevenueData = await prisma.booking.aggregate({
      where: {
        isDeleted: false,
        createdAt: {
          gte: startOfMonth
        }
      },
      _sum: {
        toplamTutar: true
      }
    })
    
    return {
      totalBookings,
      activeBookings: totalBookings,
      thisMonth,
      lastMonth,
      totalRevenue: revenueData._sum.toplamTutar || 0,
      monthlyRevenue: monthlyRevenueData._sum.toplamTutar || 0
    }
  } catch (error) {
    console.error('Dashboard stats error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'İstatistikler alınamadı'
    })
  }
})
