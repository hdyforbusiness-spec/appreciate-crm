export interface Booking {
  id: string
  reservationId: string
  adSoyad: string
  telefon: string
  kacKisi: number
  cocukSayisi: number
  turTarihi: Date
  turAdi: string
  turFiyati: number
  toplamTutar: number
  not?: string | null
  biletTipi: string
  alinisYeri?: string | null
  alinisSaati?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateBookingRequest {
  adSoyad: string
  telefon: string
  kacKisi: number
  cocukSayisi?: number
  turTarihi: string
  turAdi: string
  turFiyati: number
  toplamTutar: number
  not?: string
  biletTipi: string
  alinisYeri?: string
  alinisSaati?: string
}

export interface UpdateBookingRequest extends Partial<CreateBookingRequest> {
  id: string
}

export interface BookingFilters {
  search?: string
  turAdi?: string
  startDate?: Date
  endDate?: Date
  kacKisi?: number
}

export interface BookingStats {
  toplam: number
  buAy: number
  toplamGelir: number
  ortalamaTutar: number
}
