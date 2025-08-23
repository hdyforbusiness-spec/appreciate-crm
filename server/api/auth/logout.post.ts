export default defineEventHandler(async (event) => {
  // Cookie'yi sil
  deleteCookie(event, 'auth-token')

  return {
    success: true,
    message: 'Çıkış başarılı'
  }
})
