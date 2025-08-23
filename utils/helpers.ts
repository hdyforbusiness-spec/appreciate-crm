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
