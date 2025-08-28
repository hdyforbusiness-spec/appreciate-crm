export interface Booking {
  id: string
  reservationId: string
  adSoyad: string
  telefon: string
  kacKisi: number
  turTarihi: Date
  turAdi: string
  turFiyati: number
  toplamTutar: number
  not?: string
  biletTipi: string
  alinisYeri?: string
  alinisSaati?: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
  isDeleted: boolean
}

export interface CreateBookingData {
  adSoyad: string
  telefon: string
  kacKisi: number
  turTarihi: Date
  turAdi: string
  turFiyati: number
  not?: string
  biletTipi: string
  alinisYeri?: string
  alinisSaati?: string
}

export interface UpdateBookingData extends Partial<CreateBookingData> {
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
