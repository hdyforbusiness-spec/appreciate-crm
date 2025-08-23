<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="md:flex md:items-center md:justify-between mb-6">
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Rezervasyonlar
          </h2>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <NuxtLink to="/" 
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Ana Sayfa
          </NuxtLink>
          <NuxtLink to="/yeni-rezervasyon" 
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Yeni Rezervasyon
          </NuxtLink>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Filtreleme</h3>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Arama</label>
              <input v-model="filters.search" type="text" placeholder="Ad, telefon veya rezervasyon ID..."
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Tur Adı</label>
              <select v-model="filters.turAdi"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="">Tümü</option>
                <option v-for="tur in turListesi" :key="tur" :value="tur">{{ tur }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Başlangıç Tarihi</label>
              <input v-model="filters.startDate" type="date"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Bitiş Tarihi</label>
              <input v-model="filters.endDate" type="date"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
          </div>
          <div class="mt-4 flex justify-between">
            <button @click="clearFilters"
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Filtreleri Temizle
            </button>
            <button @click="exportCSV"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              CSV Dışa Aktar
            </button>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Rezervasyon Listesi ({{ totalBookings }} kayıt)
            </h3>
            <div v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Yükleniyor...
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rezervasyon ID
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Müşteri Bilgileri
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tur Bilgileri
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutar
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="booking in bookings" :key="booking.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ booking.reservationId }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ booking.adSoyad }}</div>
                  <div class="text-sm text-gray-500">{{ formatPhone(booking.telefon) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ booking.turAdi }}</div>
                  <div class="text-sm text-gray-500">{{ booking.kacKisi }} kişi</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatCurrency(booking.toplamTutar) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(booking.turTarihi) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button @click="downloadTicket(booking.id)"
                      class="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      title="PDF Bilet İndir">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                    <button @click="editBooking(booking)"
                      class="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                      title="Düzenle">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="deleteBooking(booking)"
                      class="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                      title="Sil">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!loading && bookings.length === 0">
                <td colspan="6" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  Henüz rezervasyon bulunmamaktadır.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button @click="previousPage" :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Önceki
            </button>
            <button @click="nextPage" :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Sonraki
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                <span class="font-medium">{{ (currentPage - 1) * 20 + 1 }}</span>
                -
                <span class="font-medium">{{ Math.min(currentPage * 20, totalBookings) }}</span>
                arası, toplam
                <span class="font-medium">{{ totalBookings }}</span>
                kayıt
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button @click="previousPage" :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Önceki
                </button>
                <button @click="nextPage" :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Sonraki
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: 'Rezervasyonlar'
})

// Reactive data
const loading = ref(false)
const bookings = ref([])
const totalBookings = ref(0)
const totalPages = ref(0)
const currentPage = ref(1)
const turListesi = ref([])

const filters = ref({
  search: '',
  turAdi: '',
  startDate: '',
  endDate: ''
})

// Computed
const filteredBookings = computed(() => {
  // This will be implemented with API calls
  return bookings.value
})

// Methods
const loadBookings = async () => {
  loading.value = true
  try {
    const query = {
      page: currentPage.value,
      limit: 20,
      ...filters.value
    }
    
    const data = await $fetch('/api/bookings', { query })
    bookings.value = data.bookings || []
    totalBookings.value = data.total || 0
    totalPages.value = data.totalPages || 0
  } catch (error) {
    console.error('Rezervasyonlar yüklenirken hata:', error)
    // Set empty data on error
    bookings.value = []
    totalBookings.value = 0
    totalPages.value = 0
  } finally {
    loading.value = false
  }
}

const loadTurListesi = async () => {
  try {
    // This would fetch unique tour names from the API
    turListesi.value = ['Kapadokya Turu', 'Pamukkale Turu', 'Antalya Turu']
  } catch (error) {
    console.error('Tur listesi yüklenirken hata:', error)
  }
}

const clearFilters = () => {
  filters.value = {
    search: '',
    turAdi: '',
    startDate: '',
    endDate: ''
  }
  currentPage.value = 1
  loadBookings()
}

const exportCSV = async () => {
  try {
    const query = { ...filters.value, export: 'csv' }
    window.open(`/api/export/bookings?${new URLSearchParams(query)}`)
  } catch (error) {
    console.error('CSV dışa aktarma hatası:', error)
  }
}

const downloadTicket = async (bookingId) => {
  try {
    const response = await $fetch(`/api/ticket/${bookingId}`, {
      method: 'GET',
      responseType: 'arrayBuffer'
    })
    
    // Create blob and download
    const blob = new Blob([response], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `bilet-${bookingId}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('PDF bilet indirme hatası:', error)
    alert('PDF indirme sırasında bir hata oluştu.')
  }
}

const editBooking = (booking) => {
  // Navigate to edit page or open modal
  navigateTo(`/yeni-rezervasyon?edit=${booking.id}`)
}

const deleteBooking = async (booking) => {
  if (!confirm(`${booking.adSoyad} müşterisinin rezervasyonunu silmek istediğinizden emin misiniz?`)) {
    return
  }
  
  try {
    await $fetch(`/api/bookings/${booking.id}`, { method: 'DELETE' })
    await loadBookings()
  } catch (error) {
    console.error('Rezervasyon silme hatası:', error)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadBookings()
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadBookings()
  }
}

// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY'
  }).format(amount)
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}

const formatPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9)}`
  }
  return phone
}

// Watchers
watch(filters, () => {
  currentPage.value = 1
  loadBookings()
}, { deep: true })

// Check authentication and load data
const checkAuthAndLoad = async () => {
  try {
    await $fetch('/api/auth/check')
    await loadBookings()
    await loadTurListesi()
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
