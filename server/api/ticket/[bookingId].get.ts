import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import QRCode from 'qrcode'
import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'
import { formatDateTR, formatCurrency, formatPhone } from '../../utils/helpers'

// Function to replace Turkish characters and symbols with ASCII equivalents for PDF compatibility
function sanitizeTextForPDF(text: string): string {
  if (!text) return text
  
  const charMap: { [key: string]: string } = {
    // Turkish characters
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G', 
    'ı': 'i', 'I': 'I',
    'İ': 'I', 'i': 'i',
    'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U',
    // Currency symbols
    '₺': 'TL',  // Turkish Lira
    '€': 'EUR', // Euro
    '$': 'USD', // Dollar
    '£': 'GBP', // Pound
    // Other special characters
    '\u2019': "'",   // Right single quotation mark
    '\u2018': "'",   // Left single quotation mark
    '\u201C': '"',   // Left double quotation mark
    '\u201D': '"',   // Right double quotation mark
    '\u2013': '-',   // En dash
    '\u2014': '-',   // Em dash
  }
  
  return text.replace(/[çÇğĞıIİiöÖşŞüÜ₺€$£\u2018\u2019\u201C\u201D\u2013\u2014]/g, (match) => charMap[match] || match)
}

export default defineEventHandler(async (event) => {
  requireAuth(event)
  
  const bookingId = getRouterParam(event, 'bookingId')
  
  console.log('PDF generation requested for booking ID:', bookingId)
  
  if (!bookingId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Rezervasyon ID gereklidir'
    })
  }

  try {
    // Get booking data
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId, isDeleted: false }
    })

    if (!booking) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Rezervasyon bulunamadı'
      })
    }

    // Create PDF document
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595.28, 841.89]) // A4 size
    const { width, height } = page.getSize()

    // Load fonts
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

    // Colors
    const primaryColor = rgb(0.2, 0.4, 0.8) // Blue
    const darkColor = rgb(0.2, 0.2, 0.2) // Dark gray
    const lightColor = rgb(0.5, 0.5, 0.5) // Light gray

    // Header
    page.drawRectangle({
      x: 0,
      y: height - 100,
      width: width,
      height: 100,
      color: primaryColor,
    })

    page.drawText('APPRECIATE TRAVEL', {
      x: 50,
      y: height - 40,
      size: 24,
      font: boldFont,
      color: rgb(1, 1, 1),
    })

    page.drawText(sanitizeTextForPDF('TUR BİLETİ'), {
      x: 50,
      y: height - 70,
      size: 16,
      font: regularFont,
      color: rgb(1, 1, 1),
    })

    // Reservation ID (top right)
    page.drawText(booking.reservationId, {
      x: width - 200,
      y: height - 50,
      size: 18,
      font: boldFont,
      color: rgb(1, 1, 1),
    })

    // Main content
    let currentY = height - 150

    // Customer Information
    page.drawText(sanitizeTextForPDF('MÜŞTERİ BİLGİLERİ'), {
      x: 50,
      y: currentY,
      size: 14,
      font: boldFont,
      color: primaryColor,
    })

    currentY -= 30

    page.drawText(sanitizeTextForPDF(`Ad Soyad: ${booking.adSoyad}`), {
      x: 70,
      y: currentY,
      size: 12,
      font: regularFont,
      color: darkColor,
    })

    currentY -= 20

    page.drawText(sanitizeTextForPDF(`Telefon: ${formatPhone(booking.telefon)}`), {
      x: 70,
      y: currentY,
      size: 12,
      font: regularFont,
      color: darkColor,
    })

    currentY -= 40

    // Tour Information
    page.drawText(sanitizeTextForPDF('TUR BİLGİLERİ'), {
      x: 50,
      y: currentY,
      size: 14,
      font: boldFont,
      color: primaryColor,
    })

    currentY -= 30

    page.drawText(sanitizeTextForPDF(`Tur Adı: ${booking.turAdi}`), {
      x: 70,
      y: currentY,
      size: 12,
      font: regularFont,
      color: darkColor,
    })

    currentY -= 20

    page.drawText(sanitizeTextForPDF(`Tarih: ${formatDateTR(booking.turTarihi)}`), {
      x: 70,
      y: currentY,
      size: 12,
      font: regularFont,
      color: darkColor,
    })

    currentY -= 20

    page.drawText(sanitizeTextForPDF(`Kişi Sayısı: ${booking.kacKisi}`), {
      x: 70,
      y: currentY,
      size: 12,
      font: regularFont,
      color: darkColor,
    })

    currentY -= 20

    page.drawText(sanitizeTextForPDF(`Kişi Başı Fiyat: ${formatCurrency(booking.turFiyati)}`), {
      x: 70,
      y: currentY,
      size: 12,
      font: regularFont,
      color: darkColor,
    })

    currentY -= 20

    page.drawText(sanitizeTextForPDF(`Toplam Tutar: ${formatCurrency(booking.toplamTutar)}`), {
      x: 70,
      y: currentY,
      size: 14,
      font: boldFont,
      color: darkColor,
    })

    // Notes (if any)
    if (booking.not) {
      currentY -= 40

      page.drawText(sanitizeTextForPDF('NOTLAR'), {
        x: 50,
        y: currentY,
        size: 14,
        font: boldFont,
        color: primaryColor,
      })

      currentY -= 25

      page.drawText(sanitizeTextForPDF(booking.not), {
        x: 70,
        y: currentY,
        size: 11,
        font: regularFont,
        color: darkColor,
      })
    }

    // QR Code
    try {
      const qrCodeBuffer = await QRCode.toBuffer(booking.reservationId, {
        width: 120,
        margin: 1,
        type: 'png'
      })
      
      const qrCodeImage = await pdfDoc.embedPng(qrCodeBuffer)
      const qrCodeDims = qrCodeImage.scale(0.8)

      page.drawImage(qrCodeImage, {
        x: width - 150,
        y: currentY - 100,
        width: qrCodeDims.width,
        height: qrCodeDims.height,
      })

      page.drawText(sanitizeTextForPDF('QR Kod'), {
        x: width - 130,
        y: currentY - 120,
        size: 10,
        font: regularFont,
        color: lightColor,
      })
    } catch (qrError) {
      console.error('QR kod oluşturma hatası:', qrError)
      // Add a simple text instead of QR code if there's an error
      page.drawText(sanitizeTextForPDF(`ID: ${booking.reservationId}`), {
        x: width - 180,
        y: currentY - 80,
        size: 12,
        font: regularFont,
        color: darkColor,
      })
    }

    // Footer
    const footerY = 100
    page.drawText(sanitizeTextForPDF('Bu bilet elektronik olarak oluşturulmuştur.'), {
      x: 50,
      y: footerY,
      size: 10,
      font: regularFont,
      color: lightColor,
    })

    page.drawText(sanitizeTextForPDF(`Oluşturulma Tarihi: ${formatDateTR(new Date())}`), {
      x: 50,
      y: footerY - 15,
      size: 10,
      font: regularFont,
      color: lightColor,
    })

    // Line separator
    page.drawLine({
      start: { x: 50, y: footerY + 20 },
      end: { x: width - 50, y: footerY + 20 },
      thickness: 0.5,
      color: lightColor,
    })

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save()

    // Set response headers
    setHeader(event, 'Content-Type', 'application/pdf')
    setHeader(event, 'Content-Disposition', `attachment; filename="bilet-${booking.reservationId}.pdf"`)
    setHeader(event, 'Content-Length', pdfBytes.length.toString())

    // Return the PDF bytes directly
    return pdfBytes

  } catch (error) {
    console.error('PDF bilet oluşturma hatası:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'PDF bilet oluşturulamadı'
    })
  }
})
