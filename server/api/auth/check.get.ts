import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    requireAuth(event)
    return { authenticated: true }
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Not authenticated'
    })
  }
})
