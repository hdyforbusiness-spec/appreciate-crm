export default defineNuxtRouteMiddleware((to) => {
  // Skip auth check for login page
  if (to.path === '/login') {
    return
  }

  // Check authentication status
  const checkAuth = async () => {
    try {
      await $fetch('/api/auth/check')
      return true
    } catch (error) {
      return false
    }
  }

  // On client side, check auth and redirect if needed
  if (process.client) {
    checkAuth().then(isAuthenticated => {
      if (!isAuthenticated) {
        return navigateTo('/login')
      }
    })
  }
})

