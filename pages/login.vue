<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
          <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Appreciate Travel CRM
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Lütfen giriş yapın
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="password" class="sr-only">Parola</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              :class="{ 'border-red-300': error }"
              placeholder="Admin parolası"
              @keyup.enter="handleLogin"
            />
          </div>
        </div>

        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                {{ error }}
              </h3>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg v-if="loading" class="animate-spin h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="h-5 w-5 text-blue-300 group-hover:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </span>
            {{ loading ? 'Giriş yapılıyor...' : 'Giriş Yap' }}
          </button>
        </div>

        <div class="text-center">
          <p class="text-xs text-gray-500">
            Bu sistem sadece yetkili personel tarafından kullanılabilir.
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: 'Giriş',
  layout: false // Login sayfası için layout kullanma
})

const router = useRouter()

// Reactive data
const password = ref('')
const loading = ref(false)
const error = ref('')

// Methods
const handleLogin = async () => {
  if (!password.value) {
    error.value = 'Lütfen parolanızı girin'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        password: password.value
      }
    })

    // Başarılı giriş, ana sayfaya yönlendir
    await router.push('/')
  } catch (err) {
    if (err.statusCode === 401) {
      error.value = 'Yanlış parola'
    } else {
      error.value = 'Giriş yapılırken bir hata oluştu'
    }
    password.value = ''
  } finally {
    loading.value = false
  }
}

// Check if already logged in
onMounted(async () => {
  try {
    // Check current auth status
    await $fetch('/api/auth/check')
    // If no error, user is already logged in
    await router.push('/')
  } catch {
    // User is not logged in, stay on login page
  }
})
</script>

