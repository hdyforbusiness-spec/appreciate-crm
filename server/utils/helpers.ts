/**
 * Rezervasyon ID'si üretir (AP-YYYYMMDD-XXXX formatında)
 */
export function generateReservationId(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
  
  return `AP-${year}${month}${day}-${random}`
}

/**
 * Toplam tutarı hesaplar
 */
export function calculateTotal(kacKisi: number, turFiyati: number): number {
  return kacKisi * turFiyati
}

/**
 * Tarihi Türkçe formatında döndürür
 */
export function formatDateTR(date: Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}

/**
 * Para formatını Türkçe olarak döndürür
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY'
  }).format(amount)
}

/**
 * Telefon numarasını formatlar
 */
export function formatPhone(phone: string): string {
  // Sayıları temizle
  const cleaned = phone.replace(/\D/g, '')
  
  // Türkiye formatında (0XXX XXX XX XX)
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9)}`
  }
  
  return phone
}

/**
 * Telefon numarasını bilet için özel formatlar - supports international
 */
export function formatPhoneForTicket(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  
  // Türkiye numarası ise (11 haneli ve 0 ile başlıyor)
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    const countryCode = '90'
    const areaCode = cleaned.slice(1, 4)
    const firstPart = cleaned.slice(4, 7)
    const secondPart = cleaned.slice(7, 10)
    const lastPart = cleaned.slice(10)
    
    return `+(${countryCode}) ${areaCode} ${firstPart} ${secondPart}${lastPart}`
  }
  
  // Türkiye numarası (90 ile başlayan)
  if (cleaned.length === 12 && cleaned.startsWith('90')) {
    const areaCode = cleaned.slice(2, 5)
    const firstPart = cleaned.slice(5, 8)
    const secondPart = cleaned.slice(8, 11)
    const lastPart = cleaned.slice(11)
    
    return `+(90) ${areaCode} ${firstPart} ${secondPart}${lastPart}`
  }
  
  // International number formatting
  if (cleaned.length >= 7 && cleaned.length <= 15) {
    // Try to identify country code (1-4 digits)
    if (cleaned.length >= 10) {
      // Assume 1-3 digit country code for longer numbers
      const countryCode = cleaned.slice(0, cleaned.length <= 11 ? 1 : cleaned.length <= 12 ? 2 : 3)
      const number = cleaned.slice(countryCode.length)
      
      // Format: +(CC) XXX XXX XXXX
      if (number.length >= 6) {
        const part1 = number.slice(0, 3)
        const part2 = number.slice(3, 6)
        const part3 = number.slice(6)
        return `+(${countryCode}) ${part1} ${part2} ${part3}`
      }
    }
    
    // Simple international format for shorter numbers
    return `+${cleaned}`
  }
  
  // Fallback to original
  return phone
}