import type { CreateBookingData } from '../../types/booking'

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

  // Çocuk sayısı kontrolü
  if (data.cocukSayisi !== undefined && (data.cocukSayisi < 0 || !Number.isInteger(data.cocukSayisi))) {
    errors.push({ field: 'cocukSayisi', message: 'Çocuk sayısı 0 veya daha büyük bir tam sayı olmalıdır' })
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

  // Bilet tipi kontrolü
  if (!data.biletTipi || !['Servis Kullanacak', 'Kendi Aracı ile Gelecek'].includes(data.biletTipi)) {
    errors.push({ field: 'biletTipi', message: 'Geçerli bir bilet tipi seçiniz' })
  }

  // Servis Kullanacak için ek alanların validasyonu
  if (data.biletTipi === 'Servis Kullanacak') {
    if (!data.alinisYeri || data.alinisYeri.trim().length < 2) {
      errors.push({ field: 'alinisYeri', message: 'Alınış yeri en az 2 karakter olmalıdır' })
    }
    
    if (!data.alinisSaati || !isValidTime(data.alinisSaati)) {
      errors.push({ field: 'alinisSaati', message: 'Geçerli bir saat formatı giriniz (HH:MM)' })
    }
  }

  return errors
}

function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  
  // Türkiye telefon numarası formatı (priority check)
  const turkishRegex = /^(0|90)?[5][0-9]{9}$/
  if (turkishRegex.test(cleaned)) {
    return true
  }
  
  // International phone number format (basic validation)
  // Accepts: country code (1-4 digits) + phone number (6-14 digits)
  // Total length: 7-15 digits (ITU-T E.164 standard)
  if (cleaned.length >= 7 && cleaned.length <= 15) {
    // Must start with a digit (not 0 for international)
    if (cleaned.startsWith('0')) {
      return false // Invalid international format
    }
    return true
  }
  
  return false
}

function isValidTime(time: string): boolean {
  // HH:MM formatı (00:00 - 23:59)
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  return timeRegex.test(time)
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/<[^>]*>/g, '') // Basit HTML temizleme
}

// Alias for backward compatibility
export const validateBookingData = validateBooking

// New function that returns the format expected by the PUT endpoint
export function validateBookingDataStrict(data: Partial<CreateBookingData>): { success: boolean; error?: string } {
  const errors = validateBooking(data)
  
  if (errors.length === 0) {
    return { success: true }
  }
  
  // Return the first error message
  return { 
    success: false, 
    error: errors[0].message 
  }
}
