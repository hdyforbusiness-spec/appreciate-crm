<template>
  <div class="ticket-display bg-white p-6 max-w-2xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-6">
      <h1 class="text-3xl font-bold text-blue-600">APPRECIATE TRAVEL</h1>
      <h2 class="text-2xl font-semibold text-gray-700 mt-2">TUR BİLETİ</h2>
      <p class="text-lg text-gray-600 mt-1">{{ ticketData.reservationId }}</p>
    </div>

    <!-- Customer Information -->
    <div class="mb-6">
      <h3 class="text-xl font-bold text-blue-600 mb-3 border-b-2 border-blue-600 pb-2">
        MÜŞTERİ BİLGİLERİ
      </h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <span class="font-semibold text-gray-700">Ad Soyad:</span>
          <span class="ml-2 text-gray-900">{{ ticketData.adSoyad }}</span>
        </div>
        <div>
          <span class="font-semibold text-gray-700">Telefon:</span>
          <span class="ml-2 text-gray-900">{{ ticketData.telefon }}</span>
        </div>
      </div>
    </div>

    <!-- Tour Information -->
    <div class="mb-6">
      <h3 class="text-xl font-bold text-blue-600 mb-3 border-b-2 border-blue-600 pb-2">
        TUR BİLGİLERİ
      </h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <span class="font-semibold text-gray-700">Tur Adı:</span>
          <span class="ml-2 text-gray-900">{{ ticketData.turAdi }}</span>
        </div>
        <div>
          <span class="font-semibold text-gray-700">Tarih:</span>
          <span class="ml-2 text-gray-900">{{ ticketData.turTarihi }}</span>
        </div>
        <div>
          <span class="font-semibold text-gray-700">Kişi Sayısı:</span>
          <span class="ml-2 text-gray-900">{{ ticketData.kacKisi }}</span>
        </div>
        <div>
          <span class="font-semibold text-gray-700">Kişi Başı Fiyat:</span>
          <span class="ml-2 text-gray-900">{{ ticketData.turFiyati }}</span>
        </div>
        <div class="col-span-2">
          <span class="font-semibold text-gray-700">Toplam Tutar:</span>
          <span class="ml-2 text-xl font-bold text-green-600">{{ ticketData.toplamTutar }}</span>
        </div>
      </div>
    </div>

    <!-- Ticket Type -->
    <div class="mb-6">
      <h3 class="text-xl font-bold text-blue-600 mb-3 border-b-2 border-blue-600 pb-2">
        BİLET TİPİ
      </h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <span class="font-semibold text-gray-700">Tip:</span>
          <span class="ml-2 text-gray-900">{{ ticketData.biletTipi }}</span>
        </div>
      </div>
    </div>

    <!-- Pickup Information (if applicable) -->
    <div v-if="ticketData.biletTipi === 'Servis Kullanacak' && (ticketData.alinisYeri || ticketData.alinisSaati)" class="mb-6">
      <h3 class="text-xl font-bold text-blue-600 mb-3 border-b-2 border-blue-600 pb-2">
        ALIŞ BİLGİLERİ
      </h3>
      <div class="grid grid-cols-2 gap-4">
        <div v-if="ticketData.alinisYeri">
          <span class="font-semibold text-gray-700">Alınış Yeri:</span>
          <span class="ml-2 text-gray-900">{{ ticketData.alinisYeri }}</span>
        </div>
        <div v-if="ticketData.alinisSaati">
          <span class="font-semibold text-gray-700">Alınış Saati:</span>
          <span class="ml-2 text-gray-900">{{ ticketData.alinisSaati }}</span>
        </div>
      </div>
    </div>

    <!-- Notes -->
    <div v-if="ticketData.not" class="mb-6">
      <h3 class="text-xl font-bold text-blue-600 mb-3 border-b-2 border-blue-600 pb-2">
        NOTLAR
      </h3>
      <p class="text-gray-900">{{ ticketData.not }}</p>
    </div>

    <!-- Footer -->
    <div class="mt-8 pt-4 border-t-2 border-gray-300">
      <p class="text-sm text-gray-600 text-center mb-2">
        Bu bilet elektronik olarak oluşturulmuştur.
      </p>
      <p class="text-sm text-gray-600 text-center mb-2">
        Oluşturulma Tarihi: {{ ticketData.createdAt }}
      </p>
      <p class="text-xs text-gray-500 text-center">
        İş Bu Bilet Yabancı Tur Operatörü Bölgesindeki Kontrol İçindir. Hiçbir Mali Hükmü Yoktur.
      </p>
    </div>

    <!-- Print Button -->
    <div class="text-center mt-6">
      <button 
        @click="printTicket" 
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Yazdır
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TicketData {
  reservationId: string
  adSoyad: string
  telefon: string
  turAdi: string
  turTarihi: string
  kacKisi: number
  turFiyati: string
  toplamTutar: string
  biletTipi: string
  alinisYeri?: string
  alinisSaati?: string
  not?: string
  createdAt: string
}

interface Props {
  ticketData: TicketData
}

const props = defineProps<Props>()

const printTicket = () => {
  window.print()
}
</script>

<style scoped>
@media print {
  .ticket-display {
    max-width: none;
    padding: 0;
  }
  
  button {
    display: none;
  }
}
</style>
