export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { password } = body

  if (!password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Parola gereklidir'
    })
  }

  const adminPassword = process.env.ADMIN_PASSWORD
  
  if (password !== adminPassword) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Yanlış parola'
    })
  }

  // Basit JWT benzeri token (production'da gerçek JWT kullanın)
  const token = Buffer.from(`admin:${Date.now()}`).toString('base64')
  
  // HttpOnly cookie set et
  setCookie(event, 'auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7 // 7 gün
  })

  return {
    success: true,
    message: 'Giriş başarılı'
  }
})
