import type { CreateBookingData } from '~/types/booking'

export interface ValidationError {
  field: string
  message: string
}

export function validateBooking(data: Partial<CreateBookingData>): ValidationError[] {
  const errors: ValidationError[] = []

  // Ad Soyad kontrolü
  if (!data.adSoyad || data.adSoyad.trim().length < 2) {
    errors.push({ field: 'adSoyad', message: 'Ad Soyad en az 2 karakter olmalıdır' })
  }

  // Telefon kontrolü
  if (!data.telefon || !isValidPhone(data.telefon)) {
    errors.push({ field: 'telefon', message: 'Geçerli bir telefon numarası giriniz' })
  }

  // Kişi sayısı kontrolü
  if (!data.kacKisi || data.kacKisi < 1 || data.kacKisi > 50) {
    errors.push({ field: 'kacKisi', message: 'Kişi sayısı 1 ile 50 arasında olmalıdır' })
  }

  // Tur adı kontrolü
  if (!data.turAdi || data.turAdi.trim().length < 2) {
    errors.push({ field: 'turAdi', message: 'Tur adı en az 2 karakter olmalıdır' })
  }

  // Tur tarihi kontrolü
  if (!data.turTarihi) {
    errors.push({ field: 'turTarihi', message: 'Tur tarihi seçilmelidir' })
  } else {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const turDate = new Date(data.turTarihi)
    turDate.setHours(0, 0, 0, 0)
    
    if (turDate < today) {
      errors.push({ field: 'turTarihi', message: 'Tur tarihi bugünden önce olamaz' })
    }
  }

  // Tur fiyatı kontrolü
  if (!data.turFiyati || data.turFiyati <= 0) {
    errors.push({ field: 'turFiyati', message: 'Tur fiyatı 0\'dan büyük olmalıdır' })
  }

  return errors
}

function isValidPhone(phone: string): boolean {
  // Türkiye telefon numarası formatı
  const phoneRegex = /^(0|90)?[5][0-9]{9}$/
  const cleaned = phone.replace(/\D/g, '')
  return phoneRegex.test(cleaned)
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/<[^>]*>/g, '') // Basit HTML temizleme
}
