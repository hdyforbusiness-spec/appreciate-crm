<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Ayarlar
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          Sistem ayarlarını ve güvenlik seçeneklerini yönetin
        </p>
      </div>

      <div class="space-y-6">
        
        <!-- Parola Değiştirme -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              Parola Değiştirme
            </h3>
            <form @submit.prevent="changePassword">
              <div class="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                <div class="sm:col-span-2">
                  <label for="currentPassword" class="block text-sm font-medium text-gray-700">
                    Mevcut Parola <span class="text-red-500">*</span>
                  </label>
                  <div class="mt-1">
                    <input
                      id="currentPassword"
                      v-model="passwordForm.currentPassword"
                      type="password"
                      required
                      class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      :class="{ 'border-red-300': passwordErrors.currentPassword }"
                    />
                    <p v-if="passwordErrors.currentPassword" class="mt-2 text-sm text-red-600">
                      {{ passwordErrors.currentPassword }}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label for="newPassword" class="block text-sm font-medium text-gray-700">
                    Yeni Parola <span class="text-red-500">*</span>
                  </label>
                  <div class="mt-1">
                    <input
                      id="newPassword"
                      v-model="passwordForm.newPassword"
                      type="password"
                      required
                      minlength="6"
                      class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      :class="{ 'border-red-300': passwordErrors.newPassword }"
                    />
                    <p v-if="passwordErrors.newPassword" class="mt-2 text-sm text-red-600">
                      {{ passwordErrors.newPassword }}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
                    Yeni Parola (Tekrar) <span class="text-red-500">*</span>
                  </label>
                  <div class="mt-1">
                    <input
                      id="confirmPassword"
                      v-model="passwordForm.confirmPassword"
                      type="password"
                      required
                      class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      :class="{ 'border-red-300': passwordErrors.confirmPassword }"
                    />
                    <p v-if="passwordErrors.confirmPassword" class="mt-2 text-sm text-red-600">
                      {{ passwordErrors.confirmPassword }}
                    </p>
                  </div>
                </div>
              </div>
              
              <div class="mt-4">
                <button
                  type="submit"
                  :disabled="passwordLoading"
                  class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg v-if="passwordLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ passwordLoading ? 'Değiştiriliyor...' : 'Parolayı Değiştir' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Yedekleme İşlemleri -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              Yedekleme İşlemleri
            </h3>
            
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <!-- Manuel Yedekleme -->
              <div class="border border-gray-200 rounded-lg p-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Manuel Yedekleme</h4>
                <p class="text-sm text-gray-500 mb-3">
                  Veritabanının anlık yedeğini alın
                </p>
                <button
                  @click="createBackup"
                  :disabled="backupLoading"
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg v-if="backupLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ backupLoading ? 'Yedekleniyor...' : 'Yedek Al' }}
                </button>
              </div>

              <!-- Otomatik Yedekleme Durumu -->
              <div class="border border-gray-200 rounded-lg p-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Otomatik Yedekleme</h4>
                <p class="text-sm text-gray-500 mb-3">
                  Son otomatik yedek: {{ lastBackupDate }}
                </p>
                <div class="flex items-center">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg class="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Aktif
                  </span>
                </div>
              </div>
            </div>

            <!-- Yedek Dosyaları Listesi -->
            <div class="mt-6">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Mevcut Yedekler</h4>
              <div class="bg-gray-50 rounded-lg p-4">
                <div v-if="backups.length === 0" class="text-sm text-gray-500 text-center py-4">
                  Henüz yedek dosyası bulunmamaktadır.
                </div>
                <div v-else class="space-y-2">
                  <div v-for="backup in backups" :key="backup.name" 
                    class="flex items-center justify-between py-2 px-3 bg-white rounded border">
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ backup.name }}</div>
                      <div class="text-xs text-gray-500">{{ backup.size }} • {{ backup.date }}</div>
                    </div>
                    <button
                      @click="downloadBackup(backup.name)"
                      class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      İndir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sistem Bilgileri -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              Sistem Bilgileri
            </h3>
            
            <dl class="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <div>
                <dt class="text-sm font-medium text-gray-500">Uygulama Versiyonu</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ systemInfo.version }}</dd>
              </div>
              
              <div>
                <dt class="text-sm font-medium text-gray-500">Node.js Versiyonu</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ systemInfo.nodeVersion }}</dd>
              </div>
              
              <div>
                <dt class="text-sm font-medium text-gray-500">Veritabanı Boyutu</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ systemInfo.dbSize }}</dd>
              </div>
              
              <div>
                <dt class="text-sm font-medium text-gray-500">Toplam Rezervasyon</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ systemInfo.totalBookings }}</dd>
              </div>
              
              <div>
                <dt class="text-sm font-medium text-gray-500">Son Güncelleme</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ systemInfo.lastUpdate }}</dd>
              </div>
              
              <div>
                <dt class="text-sm font-medium text-gray-500">Çalışma Süresi</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ systemInfo.uptime }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Tehlikeli İşlemler -->
        <div class="bg-white shadow rounded-lg border-l-4 border-red-400">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-red-900 mb-4">
              Tehlikeli İşlemler
            </h3>
            <div class="rounded-md bg-red-50 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">
                    Dikkat!
                  </h3>
                  <div class="mt-2 text-sm text-red-700">
                    <p>
                      Aşağıdaki işlemler geri alınamaz. Devam etmeden önce lütfen yedek aldığınızdan emin olun.
                    </p>
                  </div>
                  <div class="mt-4">
                    <button
                      @click="confirmDataReset"
                      class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                      Tüm Verileri Sıfırla
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: 'Ayarlar'
})

// Reactive data
const passwordLoading = ref(false)
const backupLoading = ref(false)

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordErrors = ref({})

const backups = ref([
  { name: 'backup_2024-01-15_14-30.db', size: '2.1 MB', date: '15 Ocak 2024, 14:30' },
  { name: 'backup_2024-01-14_14-30.db', size: '2.0 MB', date: '14 Ocak 2024, 14:30' },
  { name: 'backup_2024-01-13_14-30.db', size: '1.9 MB', date: '13 Ocak 2024, 14:30' }
])

const systemInfo = ref({
  version: '1.0.0',
  nodeVersion: '18.17.0',
  dbSize: '2.1 MB',
  totalBookings: '0',
  lastUpdate: '22 Ağustos 2024',
  uptime: '2 gün, 14 saat'
})

// Computed
const lastBackupDate = computed(() => {
  return backups.value.length > 0 ? backups.value[0].date : 'Henüz yedek alınmadı'
})

// Methods
const validatePasswordForm = () => {
  passwordErrors.value = {}
  
  if (!passwordForm.value.currentPassword) {
    passwordErrors.value.currentPassword = 'Mevcut parola gereklidir'
  }
  
  if (!passwordForm.value.newPassword || passwordForm.value.newPassword.length < 6) {
    passwordErrors.value.newPassword = 'Yeni parola en az 6 karakter olmalıdır'
  }
  
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordErrors.value.confirmPassword = 'Parolalar eşleşmiyor'
  }
  
  return Object.keys(passwordErrors.value).length === 0
}

const changePassword = async () => {
  if (!validatePasswordForm()) {
    return
  }
  
  passwordLoading.value = true
  
  try {
    await $fetch('/api/auth/change-password', {
      method: 'POST',
      body: {
        currentPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword
      }
    })
    
    // Reset form
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    
    alert('Parola başarıyla değiştirildi')
  } catch (error) {
    console.error('Parola değiştirme hatası:', error)
    passwordErrors.value.currentPassword = 'Mevcut parola yanlış'
  } finally {
    passwordLoading.value = false
  }
}

const createBackup = async () => {
  backupLoading.value = true
  
  try {
    const result = await $fetch('/api/backup/create', { method: 'POST' })
    
    // Add new backup to list
    backups.value.unshift({
      name: result.filename,
      size: result.size,
      date: new Date().toLocaleString('tr-TR')
    })
    
    alert('Yedek başarıyla oluşturuldu')
  } catch (error) {
    console.error('Yedek oluşturma hatası:', error)
    alert('Yedek oluşturulurken hata oluştu')
  } finally {
    backupLoading.value = false
  }
}

const downloadBackup = (filename) => {
  window.open(`/api/backup/download?file=${filename}`)
}

const loadSystemInfo = async () => {
  try {
    const info = await $fetch('/api/system/info')
    systemInfo.value = info
  } catch (error) {
    console.error('Sistem bilgileri yüklenirken hata:', error)
  }
}

const loadBackups = async () => {
  try {
    const backupList = await $fetch('/api/backup/list')
    backups.value = backupList
  } catch (error) {
    console.error('Yedek listesi yüklenirken hata:', error)
  }
}

const confirmDataReset = () => {
  const confirmation = prompt(
    'Tüm rezervasyon verilerini silmek istediğinizden emin misiniz?\n' +
    'Bu işlem geri alınamaz. Onaylamak için "SIFIRLA" yazın:'
  )
  
  if (confirmation === 'SIFIRLA') {
    resetAllData()
  }
}

const resetAllData = async () => {
  try {
    await $fetch('/api/system/reset', { method: 'POST' })
    alert('Tüm veriler başarıyla sıfırlandı')
    await loadSystemInfo()
  } catch (error) {
    console.error('Veri sıfırlama hatası:', error)
    alert('Veri sıfırlama sırasında hata oluştu')
  }
}

// Check authentication and load data
const checkAuthAndLoad = async () => {
  try {
    await $fetch('/api/auth/check')
    await loadSystemInfo()
    await loadBackups()
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
