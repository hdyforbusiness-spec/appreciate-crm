import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'
import { formatDateTR, formatCurrency, formatPhoneForTicket } from '../../utils/helpers'

// Import canvas directly - it works in development, will be excluded in Cloudflare build
import { createCanvas, loadImage } from 'canvas'
import { readFileSync } from 'fs'
import { join } from 'path'

// Check if we're in a Cloudflare Workers environment
const isCloudflareWorkers = typeof globalThis.DB !== 'undefined' || process.env.CF_PAGES === '1'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  
  const bookingId = getRouterParam(event, 'bookingId')
  
  console.log('JPG ticket generation requested for booking ID:', bookingId)
  
  if (!bookingId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Rezervasyon ID gereklidir'
    })
  }

  try {
    // Check if we're in a Cloudflare Workers environment
    if (isCloudflareWorkers) {
      throw createError({
        statusCode: 501,
        statusMessage: 'JPG bilet oluşturma Cloudflare Workers ortamında desteklenmiyor. Lütfen geliştirme ortamında deneyin.'
      })
    }

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

    // Create canvas - A4 size at 300 DPI (2480 x 3508 pixels)
    const width = 2480
    const height = 3508
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    // Set background to white
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    // Colors - different header color based on ticket type
    const primaryColor = booking.biletTipi === 'Kendi Aracı ile Gelecek' 
      ? '#CC3333' // Red for "Kendi Aracı ile Gelecek"
      : '#3366CC' // Blue for "Servis Kullanacak" (default)
    const darkColor = '#333333' // Dark gray
    const lightColor = '#777777' // Light gray

    // Header background
    ctx.fillStyle = primaryColor
    ctx.fillRect(0, 0, width, 400)

    // Header text
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 120px Arial'
    ctx.fillText('APPRECIATE TRAVEL', 200, 160)

    ctx.font = '80px Arial'
    ctx.fillText('TUR BİLETİ', 200, 280)

    // Reservation ID (top right) - smaller size
    ctx.font = 'bold 60px Arial'
    ctx.textAlign = 'right'
    ctx.fillText(booking.reservationId, width - 200, 200)
    ctx.textAlign = 'left' // Reset text alignment

    // Main content
    let currentY = 600

    // Customer Information
    ctx.fillStyle = primaryColor
    ctx.font = 'bold 110px Arial'
    ctx.fillText('MÜŞTERİ BİLGİLERİ', 200, currentY)

    currentY += 160

    ctx.fillStyle = darkColor
    ctx.font = '90px Arial'
    ctx.fillText(`Ad Soyad: ${booking.adSoyad}`, 280, currentY)

    currentY += 120

    ctx.fillText(`Telefon: ${formatPhoneForTicket(booking.telefon)}`, 280, currentY)

    currentY += 200

    // Tour Information
    ctx.fillStyle = primaryColor
    ctx.font = 'bold 110px Arial'
    ctx.fillText('TUR BİLGİLERİ', 200, currentY)

    currentY += 160

    ctx.fillStyle = darkColor
    ctx.font = '90px Arial'
    ctx.fillText(`Tur Adı: ${booking.turAdi}`, 280, currentY)

    currentY += 120

    ctx.fillText(`Tarih: ${formatDateTR(booking.turTarihi)}`, 280, currentY)

    currentY += 120

    ctx.fillText(`Kişi Sayısı: ${booking.kacKisi}`, 280, currentY)

    currentY += 120

    ctx.fillText(`Kişi Başı Fiyat: ${formatCurrency(Number(booking.turFiyati))}`, 280, currentY)

    currentY += 120

    ctx.fillStyle = darkColor
    ctx.font = 'bold 100px Arial'
    ctx.fillText(`Toplam Tutar: ${formatCurrency(Number(booking.toplamTutar))}`, 280, currentY)

    currentY += 200

    // Ticket Type Information
    ctx.fillStyle = primaryColor
    ctx.font = 'bold 110px Arial'
    ctx.fillText('BİLET TİPİ', 200, currentY)

    currentY += 160

    ctx.fillStyle = darkColor
    ctx.font = '90px Arial'
    ctx.fillText(`Tip: ${booking.biletTipi}`, 280, currentY)

    // Pickup Information (only for "Servis Kullanacak")
    if (booking.biletTipi === 'Servis Kullanacak' && (booking.alinisYeri || booking.alinisSaati)) {
      currentY += 140
      
      ctx.fillStyle = primaryColor
      ctx.font = 'bold 110px Arial'
      ctx.fillText('ALIŞ BİLGİLERİ', 200, currentY)

      if (booking.alinisYeri) {
        currentY += 160
        ctx.fillStyle = darkColor
        ctx.font = '90px Arial'
        ctx.fillText(`Alınış Yeri: ${booking.alinisYeri}`, 280, currentY)
      }

      if (booking.alinisSaati) {
        currentY += 120
        ctx.fillText(`Alınış Saati: ${booking.alinisSaati}`, 280, currentY)
      }
    }

    // Notes (if any)
    if (booking.not) {
      currentY += 200

      ctx.fillStyle = primaryColor
      ctx.font = 'bold 90px Arial'
      ctx.fillText('NOTLAR', 200, currentY)

      currentY += 160

      ctx.fillStyle = darkColor
      ctx.font = '85px Arial'
      
      // Handle long notes by wrapping text
      const maxWidth = width - 600
      const words = booking.not.split(' ')
      let line = ''
      
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' '
        const metrics = ctx.measureText(testLine)
        const testWidth = metrics.width
        
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, 280, currentY)
          line = words[n] + ' '
          currentY += 80
        } else {
          line = testLine
        }
      }
      ctx.fillText(line, 280, currentY)
    }



    // Footer
    const footerY = height - 200
    
    // Line separator
    ctx.strokeStyle = lightColor
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(200, footerY - 100)
    ctx.lineTo(width - 200, footerY - 100)
    ctx.stroke()

    ctx.fillStyle = lightColor
    ctx.font = '50px Arial'
    ctx.fillText('Bu bilet elektronik olarak oluşturulmuştur.', 200, footerY)

    ctx.fillText(`Oluşturulma Tarihi: ${formatDateTR(new Date())}`, 200, footerY + 60)

    // Add regulatory text
    ctx.fillStyle = darkColor
    ctx.font = '45px Arial'
    ctx.fillText('İş Bu Bilet Yabancı Tur Operatörü Bölgesindeki Kontrol İçindir.', 200, footerY + 140)
    ctx.fillText('Hiçbir Mali Hükmü Yoktur.', 200, footerY + 190)

    // Add TURSAB logo to bottom right
    try {
      const logoPath = join(process.cwd(), 'public', 'tursab.png')
      const logoBuffer = readFileSync(logoPath)
      const logoImage = await loadImage(logoBuffer)
      
      // Calculate logo size (maintain aspect ratio, max height 120px)
      const maxLogoHeight = 180
      const logoAspectRatio = logoImage.width / logoImage.height
      const logoHeight = Math.min(maxLogoHeight, logoImage.height)
      const logoWidth = logoHeight * logoAspectRatio
      
      // Position logo in bottom right corner with some margin (adjusted for new text)
      const logoX = width - logoWidth - 100
      const logoY = footerY + 20
      
      ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight)
    } catch (logoError) {
      console.error('TURSAB logo yükleme hatası:', logoError)
      // Continue without logo if there's an error
    }

    // Generate JPG buffer
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 })

    // Set response headers
    setHeader(event, 'Content-Type', 'image/jpeg')
    setHeader(event, 'Content-Disposition', `attachment; filename="bilet-${booking.reservationId}.jpg"`)
    setHeader(event, 'Content-Length', buffer.length)

    // Return the JPG buffer directly
    return buffer

  } catch (error) {
    console.error('JPG bilet oluşturma hatası:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'JPG bilet oluşturulamadı'
    })
  }
})
