# Appreciate Travel CRM - Pre-Development Dokümanı

## 📋 Proje Özeti

Appreciate Travel benzeri turlar için basit, tek kullanıcılı web tabanlı CRM sistemi. Müşteri kayıtlarını yönetme, arama/filtreleme, CSV dışa aktarma ve JPG bilet üretme özellikleri içerir.

## 🎯 Teknik Spesifikasyonlar

### Frontend
- **Framework:** Nuxt 3
- **UI Framework:** Nuxt UI + Tailwind CSS
- **Bileşenler:** Card, Table, Button, Modal, Input, Select, DatePicker, Badge, Alert
- **Durum Yönetimi:** Pinia + VueUse
- **Dil:** Türkçe (tüm arayüz metinleri)

### Backend
- **API:** Nuxt 3 Server API
- **Veritabanı:** SQLite + Prisma ORM
- **Dosya Yolu:** `./data/app.db`
- **JPG Bilet Üretimi:** Server-side canvas ile `/api/ticket/[bookingId]` endpoint

### Kimlik Doğrulama
- **Tip:** Tek kullanıcı (admin)
- **Metod:** Basit parola koruması
- **Konfigürasyon:** `.env` → `ADMIN_PASSWORD`
- **Davranış:** İlk açılışta parola istemi

### Dağıtım
- **Platform:** Vercel veya herhangi bir Node.js ortamı
- **Gereksinimler:** Node.js 18+, SQLite desteği

## 📊 Veri Yapısı

### Booking (Rezervasyon) Tablosu
```prisma
model Booking {
  id              String    @id @default(cuid())
  reservationId   String    @unique // Otomatik üretilen rezervasyon numarası
  adSoyad         String    // Ad Soyad
  telefon         String    // Telefon numarası
  kacKisi         Int       // Kaç kişi
  turTarihi       DateTime  // Tur tarihi
  turAdi          String    // Tur adı
  turFiyati       Decimal   // Kişi başı tur fiyatı
  toplamTutar     Decimal   // Toplam tutar (kacKisi * turFiyati)
  not             String?   // Opsiyonel not
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  deletedAt       DateTime? // Soft delete
  isDeleted       Boolean   @default(false)
}
```

## 🔧 Özellikler

### 1. Müşteri Kayıt Yönetimi
- ✅ Yeni kayıt ekleme
- ✅ Kayıt düzenleme
- ✅ Soft delete (geri dönüştürülebilir silme)
- ✅ Kayıt geri alma
- ✅ Toplam tutar otomatik hesaplama

### 2. Arama ve Filtreleme
- ✅ Ad/Soyad ile arama
- ✅ Telefon numarasıyla arama
- ✅ Rezervasyon ID ile arama
- ✅ Tur adına göre filtreleme
- ✅ Tarih aralığı filtreleme
- ✅ Kişi sayısına göre filtreleme

### 3. Veri Dışa Aktarma
- ✅ CSV formatında tüm kayıtları dışa aktarma
- ✅ Filtrelenmiş sonuçları dışa aktarma
- ✅ Türkçe karakter desteği

### 4. JPG Bilet Üretimi
- ✅ Her rezervasyon için özel JPG bilet
- ✅ Rezervasyon detayları (Ad, Telefon, Tur, Tarih, Tutar)
- ✅ QR kod (rezervasyon ID ile)
- ✅ Şirket logosu ve bilgileri
- ✅ İndirilebilir format

### 5. Güvenlik ve Yedekleme
- ✅ Admin parola koruması
- ✅ Kalıcı SQLite veritabanı
- ✅ Otomatik günlük yedekleme (local)
- ✅ Soft delete ile veri kaybı önleme

## 🎨 Kullanıcı Arayüzü

### Ana Sayfa (Dashboard)
- **Özet kartları:** Toplam rezervasyon, bu ay, gelir
- **Son rezervasyonlar** listesi
- **Hızlı arama** çubuğu

### Rezervasyonlar Sayfası
- **Tablo görünümü:** Tüm rezervasyonlar
- **Filtreleme paneli:** Tarih, tur, durum
- **Aksiyon butonları:** Düzenle, Sil, JPG İndir
- **Toplu işlemler:** CSV dışa aktar

### Rezervasyon Formu
- **Responsive tasarım**
- **Form validasyonu**
- **Otomatik hesaplama** (toplam tutar)
- **Kaydet/İptal** butonları

### Ayarlar Sayfası
- **Parola değiştirme**
- **Yedekleme işlemleri**
- **Sistem bilgileri**

## 🗂️ Dosya Yapısı

```
appreciate/
├── components/
│   ├── BookingForm.vue      # Rezervasyon formu
│   ├── BookingTable.vue     # Rezervasyon tablosu
│   ├── FilterPanel.vue      # Filtreleme paneli
│   ├── StatsCards.vue       # İstatistik kartları
│   └── Layout/
│       ├── Header.vue       # Ana başlık
│       └── Sidebar.vue      # Yan menü
├── pages/
│   ├── index.vue           # Dashboard
│   ├── rezervasyonlar.vue  # Rezervasyon listesi
│   ├── yeni-rezervasyon.vue # Yeni rezervasyon
│   ├── ayarlar.vue         # Ayarlar
│   └── login.vue           # Giriş sayfası
├── server/
│   └── api/
│       ├── bookings/       # Rezervasyon API'leri
│       ├── auth/           # Kimlik doğrulama
│       ├── export/         # CSV dışa aktarma
│       └── ticket/         # JPG bilet üretimi
├── prisma/
│   ├── schema.prisma       # Veritabanı şeması
│   └── migrations/         # Veritabanı migration'ları
├── data/
│   ├── app.db             # SQLite veritabanı
│   └── backups/           # Otomatik yedekler
├── composables/
│   ├── useBookings.ts     # Rezervasyon işlemleri
│   ├── useAuth.ts         # Kimlik doğrulama
│   └── useFilters.ts      # Filtreleme mantığı
├── utils/
│   ├── ticket-generator.ts   # JPG bilet üretimi
│   ├── backup.ts          # Yedekleme işlemleri
│   └── validators.ts      # Form validasyonları
└── types/
    └── booking.ts         # TypeScript tip tanımları
```

## 🚀 Geliştirme Aşamaları

### Faz 1: Proje Kurulumu (1 gün)
1. Nuxt 3 projesi oluşturma
2. Nuxt UI ve Tailwind kurulumu
3. Prisma ve SQLite konfigürasyonu
4. Temel klasör yapısı oluşturma

### Faz 2: Veritabanı ve Auth (1 gün)
1. Prisma schema tanımlama
2. Migration oluşturma
3. Temel auth middleware
4. Login sayfası

### Faz 3: CRUD İşlemleri (2 gün)
1. Booking API endpoints
2. Rezervasyon formu
3. Liste sayfası
4. Düzenleme işlemleri

### Faz 4: Arama ve Filtreleme (1 gün)
1. Arama algoritması
2. Filtreleme komponenti
3. URL state yönetimi

### Faz 5: JPG Bilet ve Export (1 gün)
1. JPG template tasarımı
2. JPG generation API
3. CSV export işlevi

### Faz 6: UI/UX İyileştirmeleri (1 gün)
1. Responsive tasarım
2. Loading states
3. Error handling
4. Toast notifications

### Faz 7: Test ve Dağıtım (1 gün)
1. Temel testler
2. Production build
3. Vercel deployment
4. Backup stratejisi

**Toplam Süre:** ~7 gün

## 📦 Gerekli Paketler

```json
{
  "dependencies": {
    "nuxt": "^3.8.0",
    "@nuxt/ui": "^2.11.0",
    "@prisma/client": "^5.7.0",
    "prisma": "^5.7.0",
    "canvas": "^2.11.2",
    "papaparse": "^5.4.1",
    "bcryptjs": "^2.4.3",
    "qrcode": "^1.5.3"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/papaparse": "^5.3.14",
    "@types/qrcode": "^1.5.5"
  }
}
```

## 🔒 Güvenlik Önlemleri

1. **Şifre Koruması:** bcrypt ile hash'lenmiş admin parolası
2. **SQL Injection:** Prisma ORM ile parametreli sorgular
3. **XSS:** Nuxt'ın built-in güvenlik özellikleri
4. **CSRF:** SameSite cookies
5. **Rate Limiting:** API endpoints için temel sınırlama

## 📱 Responsive Tasarım

- **Desktop:** Full özellik seti
- **Tablet:** Optimize edilmiş tablo görünümü
- **Mobile:** Touch-friendly form ve navigasyon

## 🔄 Backup Stratejisi

1. **Otomatik Günlük Backup:** SQLite dosyasının kopyalanması
2. **Dosya Adlandırma:** `backup_YYYY-MM-DD_HH-mm.db`
3. **Retention:** Son 30 günün yedekleri
4. **Manuel Backup:** Ayarlar sayfasından isteğe bağlı

---

Bu doküman, projenin tüm teknik detaylarını ve geliştirme planını içermektedir. Geliştirme sürecinde referans olarak kullanılabilir.
