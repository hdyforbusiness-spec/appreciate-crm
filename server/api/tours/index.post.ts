import { getPrisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const prisma = getPrisma(event)
  const body = await readBody(event)

  const ad = (body.ad || '').trim()
  if (ad.length < 2) {
    throw createError({ statusCode: 400, message: 'Tur adı en az 2 karakter olmalıdır' })
  }

  const maliyet = parseFloat(body.maliyet)
  if (isNaN(maliyet) || maliyet < 0) {
    throw createError({ statusCode: 400, message: 'Maliyet 0 veya daha büyük olmalıdır' })
  }

  try {
    const existing = await prisma.tour.findFirst({ where: { ad } })
    if (existing) {
      throw createError({ statusCode: 409, message: 'Bu isimde bir tur zaten mevcut' })
    }

    const tour = await prisma.tour.create({
      data: {
        ad,
        maliyet,
        aktif: body.aktif !== false
      }
    })

    return { success: true, tour, message: 'Tur oluşturuldu' }
  } catch (error: any) {
    if (error?.statusCode) throw error
    console.error('Tur oluşturma hatası:', error)
    throw createError({ statusCode: 500, message: 'Tur oluşturulamadı' })
  }
})
