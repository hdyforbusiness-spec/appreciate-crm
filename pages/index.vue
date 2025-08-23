<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Dashboard
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          Tur rezervasyonlarınızın genel görünümü
        </p>
      </div>

      <!-- Quick Actions -->
      <div class="mb-6">
        <div class="flex flex-col sm:flex-row gap-3">
          <NuxtLink to="/yeni-rezervasyon"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Yeni Rezervasyon
          </NuxtLink>
          <NuxtLink to="/rezervasyonlar"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Rezervasyonları Görüntüle
          </NuxtLink>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <!-- Toplam Rezervasyon -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Toplam Rezervasyon
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ loading ? '...' : stats.totalBookings }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <span class="text-gray-600">Aktif:</span>
              <span class="font-medium text-green-600 ml-1">{{ stats.activeBookings }}</span>
            </div>
          </div>
        </div>

        <!-- Bu Ay -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Bu Ay
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ loading ? '...' : stats.thisMonth }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <span :class="monthChangeClass">
                {{ monthChangeText }}
              </span>
            </div>
          </div>
        </div>

        <!-- Toplam Gelir -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Toplam Gelir
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ loading ? '...' : formatCurrency(stats.totalRevenue) }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <span class="text-gray-600">Bu ay:</span>
              <span class="font-medium text-green-600 ml-1">{{ formatCurrency(stats.monthlyRevenue) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Search -->
      <div class="bg-white shadow rounded-lg mb-8">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            Hızlı Arama
          </h3>
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rezervasyon ID, ad soyad veya telefon numarası ile arama yapın..."
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                @keyup.enter="performSearch"
              />
            </div>
            <button
              @click="performSearch"
              :disabled="!searchQuery.trim()"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Ara
            </button>
          </div>
        </div>
      </div>

      <!-- Recent Bookings -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Son Rezervasyonlar
            </h3>
            <NuxtLink to="/rezervasyonlar" class="text-sm font-medium text-blue-600 hover:text-blue-500">
              Tümünü görüntüle
            </NuxtLink>
          </div>
          
          <div v-if="loading" class="text-center py-4">
            <svg class="animate-spin mx-auto h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="mt-2 text-sm text-gray-500">Rezervasyonlar yükleniyor...</p>
          </div>

          <div v-else-if="recentBookings.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Henüz rezervasyon yok</h3>
            <p class="mt-1 text-sm text-gray-500">İlk rezervasyonunuzu oluşturmak için başlayın.</p>
            <div class="mt-6">
              <NuxtLink to="/yeni-rezervasyon"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Yeni Rezervasyon
              </NuxtLink>
            </div>
          </div>

          <div v-else class="overflow-hidden">
            <ul class="divide-y divide-gray-200">
              <li v-for="booking in recentBookings" :key="booking.id" class="py-4">
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg class="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">
                      {{ booking.adSoyad }}
                    </p>
                    <p class="text-sm text-gray-500 truncate">
                      {{ booking.turAdi }} • {{ booking.kacKisi }} kişi • {{ formatDate(booking.turTarihi) }}
                    </p>
                  </div>
                  <div class="flex-shrink-0 text-right">
                    <p class="text-sm font-medium text-gray-900">
                      {{ formatCurrency(booking.toplamTutar) }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ booking.reservationId }}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: 'Dashboard'
})

// Reactive data
const loading = ref(true)
const searchQuery = ref('')

const stats = ref({
  totalBookings: 0,
  activeBookings: 0,
  thisMonth: 0,
  lastMonth: 0,
  totalRevenue: 0,
  monthlyRevenue: 0
})

const recentBookings = ref([])

// Computed
const monthChangeText = computed(() => {
  const change = stats.value.thisMonth - stats.value.lastMonth
  if (change > 0) {
    return `+${change} geçen aya göre`
  } else if (change < 0) {
    return `${change} geçen aya göre`
  } else {
    return 'Geçen ay ile aynı'
  }
})

const monthChangeClass = computed(() => {
  const change = stats.value.thisMonth - stats.value.lastMonth
  if (change > 0) {
    return 'text-green-600 font-medium'
  } else if (change < 0) {
    return 'text-red-600 font-medium'
  } else {
    return 'text-gray-600'
  }
})

// Methods
const loadDashboardData = async () => {
  loading.value = true
  try {
    // Try to load stats from API first
    try {
      const statsData = await $fetch('/api/stats/dashboard')
      stats.value = statsData
    } catch (statsError) {
      console.log('Stats API not available, calculating from bookings')
    }
    
    // Load recent bookings
    const recentData = await $fetch('/api/bookings', { 
      query: { limit: 5, page: 1 } 
    })
    recentBookings.value = recentData.bookings || []
    
    // If stats API failed, calculate stats from bookings data
    if (stats.value.totalBookings === 0 && recentData.total > 0) {
      const totalBookings = recentData.total || 0
      const now = new Date()
      const thisMonth = now.getMonth()
      const thisYear = now.getFullYear()
      
      const thisMonthBookings = recentBookings.value.filter(booking => {
        const bookingDate = new Date(booking.createdAt)
        return bookingDate.getMonth() === thisMonth && bookingDate.getFullYear() === thisYear
      })
      
      const totalRevenue = recentBookings.value.reduce((sum, booking) => sum + (booking.toplamTutar || 0), 0)
      const monthlyRevenue = thisMonthBookings.reduce((sum, booking) => sum + (booking.toplamTutar || 0), 0)
      
      stats.value = {
        totalBookings,
        activeBookings: totalBookings,
        thisMonth: thisMonthBookings.length,
        lastMonth: 0, // We'll calculate this properly when we have more data
        totalRevenue,
        monthlyRevenue
      }
    }
  } catch (error) {
    console.error('Dashboard verileri yüklenirken hata:', error)
    // Set default values for development
    stats.value = {
      totalBookings: 0,
      activeBookings: 0,
      thisMonth: 0,
      lastMonth: 0,
      totalRevenue: 0,
      monthlyRevenue: 0
    }
    recentBookings.value = []
  } finally {
    loading.value = false
  }
}

const performSearch = () => {
  if (!searchQuery.value.trim()) return
  
  navigateTo({
    path: '/rezervasyonlar',
    query: { search: searchQuery.value }
  })
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY'
  }).format(amount)
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date))
}

// Check authentication and load data
const checkAuthAndLoad = async () => {
  try {
    await $fetch('/api/auth/check')
    await loadDashboardData()
  } catch (error) {
    // User is not authenticated, redirect to login
    if (error.statusCode === 401) {
      await navigateTo('/login')
    }
  }
}

// Lifecycle
onMounted(() => {
  checkAuthAndLoad()
})
</script>
