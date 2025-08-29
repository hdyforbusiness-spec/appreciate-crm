import { getPrisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'
import { formatDateTR, formatCurrency, formatPhoneForTicket } from '../../utils/helpers'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const prisma = getPrisma(event)
  
  const bookingId = getRouterParam(event, 'bookingId')
  
  console.log('Ticket data requested for booking ID:', bookingId)
  
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

    // Generate HTML ticket
    const htmlTicket = generateHTMLTicket({
      reservationId: booking.reservationId,
      adSoyad: booking.adSoyad,
      telefon: formatPhoneForTicket(booking.telefon),
      turAdi: booking.turAdi,
      turTarihi: formatDateTR(booking.turTarihi),
      kacKisi: booking.kacKisi,
      turFiyati: formatCurrency(Number(booking.turFiyati)),
      toplamTutar: formatCurrency(Number(booking.toplamTutar)),
      biletTipi: booking.biletTipi,
      alinisYeri: booking.alinisYeri,
      alinisSaati: booking.alinisSaati,
      not: booking.not,
      createdAt: formatDateTR(booking.createdAt)
    })

    // For Cloudflare Workers environment, we'll use a different approach
    // Since we can't use Puppeteer in Workers, we'll create a minimal HTML page
    // that immediately converts to JPG and downloads without showing content
    
    const autoDownloadHTML = generateAutoDownloadHTML(htmlTicket, booking.reservationId)
    
    // Set HTML content type but this will auto-download JPG
    setHeader(event, 'Content-Type', 'text/html; charset=utf-8')
    setHeader(event, 'Content-Disposition', `attachment; filename="ticket-${booking.reservationId}.html"`)
    
    return autoDownloadHTML

  } catch (error) {
    console.error('Ticket data retrieval error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Bilet bilgileri alınamadı'
    })
  }
})

function generateAutoDownloadHTML(htmlTicket: string, reservationId: string) {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generating JPG...</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: #f5f5f5;
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        
        .loading {
            text-align: center;
            color: #333;
        }
        
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #2563eb;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .hidden {
            display: none !important;
        }
    </style>
</head>
<body>
    <div class="loading">
        <div class="spinner"></div>
        <div>JPG oluşturuluyor...</div>
        <div style="font-size: 14px; margin-top: 10px; color: #666;">
            Bilet JPG formatında indirilecek
        </div>
    </div>
    
    <div class="hidden" id="ticket-content">
        ${htmlTicket}
    </div>
    
    <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
    <script>
        // Immediately start conversion when page loads
        window.onload = function() {
            setTimeout(() => {
                convertToJPG();
            }, 500);
        };
        
        function convertToJPG() {
            const ticketContainer = document.getElementById('ticket-content');
            
            if (!ticketContainer) {
                showError('Ticket content not found');
                return;
            }
            
            html2canvas(ticketContainer, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                width: 800,
                height: 1200,
                logging: false,
                allowTaint: true
            }).then(canvas => {
                // Convert to blob for better file handling
                canvas.toBlob(function(blob) {
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.download = 'ticket-${reservationId}.jpg';
                        link.href = url;
                        link.click();
                        
                        // Clean up and show success
                        setTimeout(() => {
                            URL.revokeObjectURL(url);
                            showSuccess();
                        }, 100);
                    } else {
                        showError('Failed to generate image blob');
                    }
                }, 'image/jpeg', 0.95);
            }).catch(error => {
                console.error('Error generating JPG:', error);
                showError('JPG oluşturulamadı: ' + error.message);
                showManualDownload();
            });
        }
        
        function showSuccess() {
            document.querySelector('.loading').innerHTML = 
                '<div style="color: #059669; font-size: 18px;">✅ JPG başarıyla indirildi!</div>' +
                '<div style="margin-top: 20px; font-size: 14px; color: #666;">Bu sayfa kapatılabilir</div>';
        }
        
        function showError(message) {
            document.querySelector('.loading').innerHTML = 
                '<div style="color: #dc2626; font-size: 18px;">❌ Hata: ' + message + '</div>';
        }
        
        function showManualDownload() {
            const button = document.createElement('button');
            button.textContent = '📥 Manuel JPG İndir';
            button.style.cssText = 'margin-top: 20px; padding: 12px 24px; background: #dc2626; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;';
            button.onclick = function() {
                convertToJPG();
            };
            document.querySelector('.loading').appendChild(button);
        }
    </script>
</body>
</html>`
}

function generateHTMLTicket(ticketData: any) {
  return `<style>
        .ticket-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .ticket-header {
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .ticket-header.red {
            background: linear-gradient(135deg, #dc2626, #b91c1c);
        }
        
        .ticket-header.blue {
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
        }
        
        .logo-container {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 15px;
        }
        
        .tursab-logo {
            width: 60px;
            height: 60px;
            margin-right: 15px;
        }
        
        .company-name {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 8px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .ticket-title {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 15px;
            opacity: 0.9;
        }
        
        .reservation-id {
            font-size: 18px;
            background: rgba(255,255,255,0.2);
            padding: 8px 16px;
            border-radius: 20px;
            display: inline-block;
            font-family: 'Courier New', monospace;
        }
        
        .ticket-content {
            padding: 30px;
        }
        
        .section {
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .section:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        
        .section-title {
            font-size: 20px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #3b82f6;
            display: inline-block;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
        }
        
        .info-item {
            display: flex;
            align-items: center;
            padding: 12px 0;
        }
        
        .info-label {
            font-weight: 600;
            color: #6b7280;
            min-width: 120px;
            margin-right: 15px;
        }
        
        .info-value {
            font-weight: 500;
            color: #1f2937;
        }
        
        .total-amount {
            background: #f0fdf4;
            border: 2px solid #22c55e;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            margin: 20px 0;
        }
        
        .total-amount .label {
            font-size: 18px;
            font-weight: 600;
            color: #166534;
            margin-bottom: 8px;
        }
        
        .total-amount .amount {
            font-size: 28px;
            font-weight: bold;
            color: #16a34a;
        }
        
        .ticket-footer {
            background: #f8fafc;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        
        .footer-text {
            font-size: 14px;
            color: #6b7280;
            line-height: 1.5;
        }
    </style>
    <div class="ticket-container">
        <div class="ticket-header ${ticketData.biletTipi === 'Kendi Aracı İle Gelecek' ? 'red' : 'blue'}">
            <div class="logo-container">
                <img src="/tursab.png" alt="TÜRSAB Logo" class="tursab-logo">
                <div class="company-name">APPRECIATE TRAVEL</div>
            </div>
            <div class="ticket-title">TUR BİLETİ</div>
            <div class="reservation-id">${ticketData.reservationId}</div>
        </div>
        
        <div class="ticket-content">
            <div class="section">
                <div class="section-title">MÜŞTERİ BİLGİLERİ</div>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Ad Soyad:</span>
                        <span class="info-value">${ticketData.adSoyad}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Telefon:</span>
                        <span class="info-value">${ticketData.telefon}</span>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">TUR BİLGİLERİ</div>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Tur Adı:</span>
                        <span class="info-value">${ticketData.turAdi}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Tarih:</span>
                        <span class="info-value">${ticketData.turTarihi}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Kişi Sayısı:</span>
                        <span class="info-value">${ticketData.kacKisi}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Kişi Başı Fiyat:</span>
                        <span class="info-value">${ticketData.turFiyati}</span>
                    </div>
                </div>
                
                <div class="total-amount">
                    <div class="label">TOPLAM TUTAR</div>
                    <div class="amount">${ticketData.toplamTutar}</div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">BİLET TİPİ</div>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Tip:</span>
                        <span class="info-value">${ticketData.biletTipi}</span>
                    </div>
                </div>
            </div>
            
            ${ticketData.biletTipi === 'Servis Kullanacak' && (ticketData.alinisYeri || ticketData.alinisSaati) ? `
            <div class="section">
                <div class="section-title">ALIŞ BİLGİLERİ</div>
                <div class="info-grid">
                    ${ticketData.alinisYeri ? `
                    <div class="info-item">
                        <span class="info-label">Alınış Yeri:</span>
                        <span class="info-value">${ticketData.alinisYeri}</span>
                    </div>
                    ` : ''}
                    ${ticketData.alinisSaati ? `
                    <div class="info-item">
                        <span class="info-label">Alınış Saati:</span>
                        <span class="info-value">${ticketData.alinisSaati}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
            ` : ''}
            
            ${ticketData.not ? `
            <div class="section">
                <div class="section-title">NOTLAR</div>
                <div class="info-item">
                    <span class="info-value">${ticketData.not}</span>
                </div>
            </div>
            ` : ''}
        </div>
        
        <div class="ticket-footer">
            <div class="footer-text">
                Bu bilet elektronik olarak oluşturulmuştur.<br>
                Oluşturulma Tarihi: ${ticketData.createdAt}<br>
                İş Bu Bilet Yabancı Tur Operatörü Bölgesindeki Kontrol İçindir. Hiçbir Mali Hükmü Yoktur.
            </div>
        </div>
    </div>`
}
