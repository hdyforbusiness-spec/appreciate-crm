<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-6">
        <nav class="flex" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-4">
            <li>
              <NuxtLink to="/" class="text-gray-400 hover:text-gray-500">
                <svg class="flex-shrink-0 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span class="sr-only">Ana Sayfa</span>
              </NuxtLink>
            </li>
            <li>
              <div class="flex items-center">
                <svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <NuxtLink to="/rezervasyonlar" class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                  Rezervasyonlar
                </NuxtLink>
              </div>
            </li>
            <li>
              <div class="flex items-center">
                <svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="ml-4 text-sm font-medium text-gray-500">
                  {{ isEdit ? 'Rezervasyon Düzenle' : 'Yeni Rezervasyon' }}
                </span>
              </div>
            </li>
          </ol>
        </nav>
        
        <div class="mt-4">
          <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {{ isEdit ? 'Rezervasyon Düzenle' : 'Yeni Rezervasyon' }}
          </h1>
          <p class="mt-1 text-sm text-gray-500">
            {{ isEdit ? 'Mevcut rezervasyon bilgilerini güncelleyin' : 'Yeni bir tur rezervasyonu oluşturun' }}
          </p>
        </div>
      </div>

      <!-- Form -->
      <div class="bg-white shadow rounded-lg">
        <form @submit.prevent="submitForm">
          <div class="px-4 py-5 sm:p-6">
            <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              
              <!-- Ad Soyad -->
              <div class="sm:col-span-2">
                <label for="adSoyad" class="block text-sm font-medium text-gray-700">
                  Ad Soyad <span class="text-red-500">*</span>
                </label>
                <div class="mt-1">
                  <input
                    id="adSoyad"
                    v-model="form.adSoyad"
                    type="text"
                    required
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    :class="{ 'border-red-300': errors.adSoyad }"
                    placeholder="Müşteri adı ve soyadı"
                  />
                  <p v-if="errors.adSoyad" class="mt-2 text-sm text-red-600">{{ errors.adSoyad }}</p>
                </div>
              </div>

              <!-- Telefon -->
              <div>
                <label for="telefon" class="block text-sm font-medium text-gray-700">
                  Telefon <span class="text-red-500">*</span>
                </label>
                <div class="mt-1">
                  <input
                    id="telefon"
                    v-model="form.telefon"
                    type="tel"
                    required
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    :class="{ 'border-red-300': errors.telefon }"
                    placeholder="05XX XXX XX XX"
                  />
                  <p v-if="errors.telefon" class="mt-2 text-sm text-red-600">{{ errors.telefon }}</p>
                </div>
              </div>

              <!-- Kişi Sayısı -->
              <div>
                <label for="kacKisi" class="block text-sm font-medium text-gray-700">
                  Kişi Sayısı <span class="text-red-500">*</span>
                </label>
                <div class="mt-1">
                  <input
                    id="kacKisi"
                    v-model.number="form.kacKisi"
                    type="number"
                    min="1"
                    max="50"
                    required
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    :class="{ 'border-red-300': errors.kacKisi }"
                  />
                  <p v-if="errors.kacKisi" class="mt-2 text-sm text-red-600">{{ errors.kacKisi }}</p>
                </div>
              </div>

              <!-- Tur Adı -->
              <div>
                <label for="turAdi" class="block text-sm font-medium text-gray-700">
                  Tur Adı <span class="text-red-500">*</span>
                </label>
                <div class="mt-1">
                  <input
                    id="turAdi"
                    v-model="form.turAdi"
                    type="text"
                    required
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    :class="{ 'border-red-300': errors.turAdi }"
                    placeholder="Tur adı"
                  />
                  <p v-if="errors.turAdi" class="mt-2 text-sm text-red-600">{{ errors.turAdi }}</p>
                </div>
              </div>

              <!-- Tur Tarihi -->
              <div>
                <label for="turTarihi" class="block text-sm font-medium text-gray-700">
                  Tur Tarihi <span class="text-red-500">*</span>
                </label>
                <div class="mt-1">
                  <input
                    id="turTarihi"
                    v-model="form.turTarihi"
                    type="date"
                    required
                    :min="minDate"
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    :class="{ 'border-red-300': errors.turTarihi }"
                  />
                  <p v-if="errors.turTarihi" class="mt-2 text-sm text-red-600">{{ errors.turTarihi }}</p>
                </div>
              </div>

              <!-- Tur Fiyatı -->
              <div>
                <label for="turFiyati" class="block text-sm font-medium text-gray-700">
                  Kişi Başı Fiyat (₺) <span class="text-red-500">*</span>
                </label>
                <div class="mt-1">
                  <input
                    id="turFiyati"
                    v-model.number="form.turFiyati"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    :class="{ 'border-red-300': errors.turFiyati }"
                    placeholder="0.00"
                  />
                  <p v-if="errors.turFiyati" class="mt-2 text-sm text-red-600">{{ errors.turFiyati }}</p>
                </div>
              </div>

              <!-- Toplam Tutar (Readonly) -->
              <div>
                <label for="toplamTutar" class="block text-sm font-medium text-gray-700">
                  Toplam Tutar (₺)
                </label>
                <div class="mt-1">
                  <input
                    id="toplamTutar"
                    :value="toplamTutar"
                    type="text"
                    readonly
                    class="shadow-sm bg-gray-50 border-gray-300 block w-full sm:text-sm rounded-md cursor-not-allowed"
                  />
                </div>
              </div>

              <!-- Not -->
              <div class="sm:col-span-2">
                <label for="not" class="block text-sm font-medium text-gray-700">
                  Not (Opsiyonel)
                </label>
                <div class="mt-1">
                  <textarea
                    id="not"
                    v-model="form.not"
                    rows="3"
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Ek bilgiler veya özel istekler..."
                  ></textarea>
                </div>
              </div>

            </div>
          </div>

          <!-- Form Actions -->
          <div class="px-4 py-3 bg-gray-50 text-right sm:px-6 rounded-b-lg">
            <div class="flex justify-end space-x-3">
              <NuxtLink to="/rezervasyonlar"
                class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                İptal
              </NuxtLink>
              <button
                type="submit"
                :disabled="loading"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ loading ? 'Kaydediliyor...' : (isEdit ? 'Güncelle' : 'Kaydet') }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: 'Yeni Rezervasyon'
})

const route = useRoute()
const router = useRouter()

// Reactive data
const loading = ref(false)
const isEdit = ref(false)
const bookingId = ref(null)

const form = ref({
  adSoyad: '',
  telefon: '',
  kacKisi: 1,
  turAdi: '',
  turTarihi: '',
  turFiyati: 0,
  not: ''
})

const errors = ref({})

// Computed
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const toplamTutar = computed(() => {
  const total = (form.value.kacKisi || 0) * (form.value.turFiyati || 0)
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY'
  }).format(total)
})

// Methods
const validateForm = () => {
  errors.value = {}
  
  if (!form.value.adSoyad || form.value.adSoyad.trim().length < 2) {
    errors.value.adSoyad = 'Ad Soyad en az 2 karakter olmalıdır'
  }
  
  if (!form.value.telefon || !isValidPhone(form.value.telefon)) {
    errors.value.telefon = 'Geçerli bir telefon numarası giriniz'
  }
  
  if (!form.value.kacKisi || form.value.kacKisi < 1 || form.value.kacKisi > 50) {
    errors.value.kacKisi = 'Kişi sayısı 1 ile 50 arasında olmalıdır'
  }
  
  if (!form.value.turAdi || form.value.turAdi.trim().length < 2) {
    errors.value.turAdi = 'Tur adı en az 2 karakter olmalıdır'
  }
  
  if (!form.value.turTarihi) {
    errors.value.turTarihi = 'Tur tarihi seçilmelidir'
  } else {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const turDate = new Date(form.value.turTarihi)
    turDate.setHours(0, 0, 0, 0)
    
    if (turDate < today) {
      errors.value.turTarihi = 'Tur tarihi bugünden önce olamaz'
    }
  }
  
  if (!form.value.turFiyati || form.value.turFiyati <= 0) {
    errors.value.turFiyati = 'Tur fiyatı 0\'dan büyük olmalıdır'
  }
  
  return Object.keys(errors.value).length === 0
}

const isValidPhone = (phone) => {
  const phoneRegex = /^(0|90)?[5][0-9]{9}$/
  const cleaned = phone.replace(/\D/g, '')
  return phoneRegex.test(cleaned)
}

const submitForm = async () => {
  if (!validateForm()) {
    return
  }
  
  loading.value = true
  
  try {
    const method = isEdit.value ? 'PUT' : 'POST'
    const url = isEdit.value ? `/api/bookings/${bookingId.value}` : '/api/bookings'
    
    await $fetch(url, {
      method,
      body: form.value
    })
    
    // Navigate back to bookings list
    await router.push('/rezervasyonlar')
  } catch (error) {
    console.error('Form gönderme hatası:', error)
    // Handle error (show toast, etc.)
  } finally {
    loading.value = false
  }
}

const loadBooking = async (id) => {
  try {
    const booking = await $fetch(`/api/bookings/${id}`)
    
    form.value = {
      adSoyad: booking.adSoyad,
      telefon: booking.telefon,
      kacKisi: booking.kacKisi,
      turAdi: booking.turAdi,
      turTarihi: new Date(booking.turTarihi).toISOString().split('T')[0],
      turFiyati: booking.turFiyati,
      not: booking.not || ''
    }
  } catch (error) {
    console.error('Rezervasyon yüklenirken hata:', error)
    await router.push('/rezervasyonlar')
  }
}

// Check authentication and load data
const checkAuthAndLoad = async () => {
  try {
    await $fetch('/api/auth/check')
    
    const editId = route.query.edit
    if (editId) {
      isEdit.value = true
      bookingId.value = editId
      await loadBooking(editId)
    }
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
