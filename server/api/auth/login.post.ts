export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { password } = body

  if (!password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Parola gereklidir'
    })
  }

  // Hardcoded password for Cloudflare Pages (no process.env)
  const adminPassword = 'admin123'
  
  if (password !== adminPassword) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Yanlış parola'
    })
  }

  // Use btoa instead of Buffer for Cloudflare Workers compatibility
  const token = btoa(`admin:${Date.now()}`)
  
  // HttpOnly cookie set et
  setCookie(event, 'auth-token', token, {
    httpOnly: true,
    secure: true, // Always secure in Cloudflare Workers
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7 // 7 gün
  })

  return {
    success: true,
    message: 'Giriş başarılı'
  }
})