<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">PDF Test Sayfası</h1>
      
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-lg font-semibold mb-4">Test Rezervasyonu Oluştur</h2>
        <button 
          @click="createTestBooking"
          :disabled="loading"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {{ loading ? 'Oluşturuluyor...' : 'Test Rezervasyonu Oluştur' }}
        </button>
        
        <div v-if="testBooking" class="mt-6 p-4 bg-green-50 border border-green-200 rounded">
          <h3 class="font-semibold text-green-800">Rezervasyon Oluşturuldu!</h3>
          <p class="text-sm text-green-700 mt-1">ID: {{ testBooking.id }}</p>
          <p class="text-sm text-green-700">Rezervasyon No: {{ testBooking.reservationId }}</p>
          
          <button 
            @click="downloadPDF(testBooking.id)"
            class="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            PDF Bileti İndir
          </button>
        </div>

        <div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded">
          <p class="text-red-800">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const loading = ref(false)
const testBooking = ref(null)
const error = ref('')

const createTestBooking = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await $fetch('/api/test/create-sample-booking', {
      method: 'POST'
    })
    
    testBooking.value = response.booking
  } catch (err) {
    error.value = err.data?.message || 'Test rezervasyon oluşturulamadı'
  } finally {
    loading.value = false
  }
}

const downloadPDF = (bookingId) => {
  window.open(`/api/ticket/${bookingId}`, '_blank')
}
</script>

