export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { password } = body

  if (!password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Parola gereklidir'
    })
  }

  // For Cloudflare Workers, we'll use a hardcoded password or environment variable
  // In production, you should set this in Cloudflare Pages environment variables
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  
  if (password !== adminPassword) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Yanlış parola'
    })
  }

  // Basit JWT benzeri token (production'da gerçek JWT kullanın)
  // Use btoa instead of Buffer for Cloudflare Workers compatibility
  const token = btoa(`admin:${Date.now()}`)
  
  // HttpOnly cookie set et
  // In Cloudflare Workers, secure should be true for HTTPS
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
