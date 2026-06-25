import { getPrisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const prisma = getPrisma(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Tur ID gereklidir' })
  }

  try {
    const existing = await prisma.tour.findUnique({ where: { id } })
    if (!existing) {
      throw createError({ statusCode: 404, message: 'Tur bulunamadı' })
    }

    await prisma.tour.delete({ where: { id } })

    return { success: true, message: 'Tur silindi' }
  } catch (error: any) {
    if (error?.statusCode) throw error
    console.error('Tur silme hatası:', error)
    throw createError({ statusCode: 500, message: 'Tur silinemedi' })
  }
})
