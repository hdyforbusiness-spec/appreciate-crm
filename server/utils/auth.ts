import type { EventHandlerRequest, H3Event } from 'h3'

export function requireAuth(event: H3Event<EventHandlerRequest>) {
  const token = getCookie(event, 'auth-token')
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Giriş yapmanız gerekiyor'
    })
  }

  // Basit token doğrulama (production'da JWT kullanın)
  try {
    const decoded = Buffer.from(token, 'base64').toString()
    const [user, timestamp] = decoded.split(':')
    
    if (user !== 'admin') {
      throw new Error('Invalid user')
    }

    // Token 7 gün geçerli
    const tokenAge = Date.now() - parseInt(timestamp)
    const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 gün

    if (tokenAge > maxAge) {
      throw new Error('Token expired')
    }

    return true
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Geçersiz token'
    })
  }
}
