import { getPrisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const prisma = getPrisma(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Tur ID gereklidir' })
  }

  const body = await readBody(event)

  const ad = (body.ad || '').trim()
  if (ad.length < 2) {
    throw createError({ statusCode: 400, message: 'Tur adı en az 2 karakter olmalıdır' })
  }

  const maliyetServis = parseFloat(body.maliyetServis)
  if (isNaN(maliyetServis) || maliyetServis < 0) {
    throw createError({ statusCode: 400, message: 'Servis maliyeti 0 veya daha büyük olmalıdır' })
  }

  const maliyetKendiArac = parseFloat(body.maliyetKendiArac)
  if (isNaN(maliyetKendiArac) || maliyetKendiArac < 0) {
    throw createError({ statusCode: 400, message: 'Kendi aracı maliyeti 0 veya daha büyük olmalıdır' })
  }

  try {
    const existing = await prisma.tour.findUnique({ where: { id } })
    if (!existing) {
      throw createError({ statusCode: 404, message: 'Tur bulunamadı' })
    }

    // Aynı isimde başka bir tur olmamalı
    const dup = await prisma.tour.findFirst({ where: { ad, NOT: { id } } })
    if (dup) {
      throw createError({ statusCode: 409, message: 'Bu isimde başka bir tur mevcut' })
    }

    const tour = await prisma.tour.update({
      where: { id },
      data: {
        ad,
        maliyetServis,
        maliyetKendiArac,
        aktif: body.aktif !== false
      }
    })

    return { success: true, tour, message: 'Tur güncellendi' }
  } catch (error: any) {
    if (error?.statusCode) throw error
    console.error('Tur güncelleme hatası:', error)
    throw createError({ statusCode: 500, message: 'Tur güncellenemedi' })
  }
})
