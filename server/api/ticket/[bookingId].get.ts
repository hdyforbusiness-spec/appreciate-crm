import { defineEventHandler, getRouterParam, setHeader, createError } from 'h3'
import { getPrisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'
import { formatDateTR, formatCurrency, formatPhoneForTicket } from '../../utils/helpers'

export default defineEventHandler(async (event) => {
  try {
    requireAuth(event)
    const prisma = getPrisma(event)
    
    const bookingId = getRouterParam(event, 'bookingId')
    
    if (!bookingId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Rezervasyon ID gereklidir'
      })
    }

    // Get booking data
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    })

    if (!booking) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Rezervasyon bulunamadı'
      })
    }

    // Prepare ticket data
    const ticketData = {
      reservationId: booking.reservationId,
      adSoyad: booking.adSoyad,
      telefon: formatPhoneForTicket(booking.telefon),
      turAdi: booking.turAdi,
      turTarihi: formatDateTR(booking.turTarihi),
      kacKisi: booking.kacKisi.toString(),
      cocukSayisi: booking.cocukSayisi,
      turFiyati: formatCurrency(Number(booking.turFiyati)),
      toplamTutar: formatCurrency(Number(booking.toplamTutar)),
      biletTipi: booking.biletTipi,
      alinisYeri: booking.alinisYeri,
      alinisSaati: booking.alinisSaati,
      not: booking.not,
      createdAt: formatDateTR(booking.createdAt)
    }

    // Generate SVG
    const svg = generateTicketSVG(ticketData)

    // Return HTML that auto-converts and downloads PNG
    const html = generateAutoDownloadHTML(svg, ticketData.reservationId)
    
    setHeader(event, 'Content-Type', 'text/html')
    setHeader(event, 'Cache-Control', 'no-store')
    return html

  } catch (error) {
    console.error('Ticket generation error:', error)
    
    if (error instanceof Error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Bilet oluşturulamadı: ${error.message}`
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Bilet oluşturulamadı'
    })
  }
})

function generateTicketSVG(ticketData: any): string {
  const width = 800
  const height = 1400 // Increased height to accommodate new fields
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${ticketData.biletTipi === 'Kendi Aracı ile Gelecek' ? '#dc2626' : '#2563eb'};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${ticketData.biletTipi === 'Kendi Aracı ile Gelecek' ? '#b91c1c' : '#1d4ed8'};stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="#ffffff"/>
  
  <!-- Header -->
  <rect x="32" y="32" width="${width-64}" height="160" rx="12" fill="url(#headerGradient)"/>
  <text x="${width/2}" y="80" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="45" font-weight="bold">APPRECIATE TRAVEL</text>
  <text x="${width/2}" y="110" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="34" font-weight="600">TUR BİLETİ</text>
  <text x="${width/2}" y="140" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="25" font-weight="600">#${ticketData.reservationId}</text>
  
  <!-- Customer Info -->
  <text x="64" y="240" fill="#1f2937" font-family="Arial, sans-serif" font-size="31" font-weight="700">MÜŞTERİ BİLGİLERİ</text>
  <text x="64" y="270" fill="#6b7280" font-family="Arial, sans-serif" font-size="28">Ad Soyad: ${ticketData.adSoyad}</text>
  <text x="64" y="300" fill="#6b7280" font-family="Arial, sans-serif" font-size="28">Telefon: ${ticketData.telefon}</text>
  
  <!-- Tour Info -->
  <text x="64" y="360" fill="#1f2937" font-family="Arial, sans-serif" font-size="31" font-weight="700">TUR BİLGİLERİ</text>
  <text x="64" y="390" fill="#6b7280" font-family="Arial, sans-serif" font-size="28">Tur Adı: ${ticketData.turAdi}</text>
  <text x="64" y="420" fill="#6b7280" font-family="Arial, sans-serif" font-size="28">Tarih: ${ticketData.turTarihi}</text>
  <text x="64" y="450" fill="#1f2937" font-family="Arial, sans-serif" font-size="28" font-weight="700">Kişi Sayısı: ${ticketData.kacKisi}</text>
  ${ticketData.cocukSayisi > 0 ? `<text x="64" y="480" fill="#1f2937" font-family="Arial, sans-serif" font-size="28" font-weight="700">Çocuk Sayısı: ${ticketData.cocukSayisi}</text>` : ''}
  <text x="64" y="${ticketData.cocukSayisi > 0 ? 510 : 480}" fill="#6b7280" font-family="Arial, sans-serif" font-size="28">Kişi Başı Fiyat: ${ticketData.turFiyati}</text>
  
  <!-- Total Amount -->
  <rect x="64" y="${ticketData.cocukSayisi > 0 ? 520 : 500}" width="${width-128}" height="100" rx="8" fill="#f0fdf4" stroke="#22c55e" stroke-width="2"/>
  <text x="${width/2}" y="${ticketData.cocukSayisi > 0 ? 550 : 530}" text-anchor="middle" fill="#166534" font-family="Arial, sans-serif" font-size="25" font-weight="700">TOPLAM TUTAR</text>
  <text x="${width/2}" y="${ticketData.cocukSayisi > 0 ? 580 : 560}" text-anchor="middle" fill="#16a34a" font-family="Arial, sans-serif" font-size="29" font-weight="800">${ticketData.toplamTutar}</text>
  
  <!-- Ticket Type -->
  <text x="64" y="${ticketData.cocukSayisi > 0 ? 660 : 640}" fill="#1f2937" font-family="Arial, sans-serif" font-size="31" font-weight="700">BİLET TİPİ</text>
  <text x="64" y="${ticketData.cocukSayisi > 0 ? 690 : 670}" fill="#6b7280" font-family="Arial, sans-serif" font-size="28">Tip: ${ticketData.biletTipi}</text>
  
  <!-- Contact Info based on ticket type -->
  ${ticketData.biletTipi === 'Kendi Aracı ile Gelecek' ? `
  <text x="64" y="${ticketData.cocukSayisi > 0 ? 740 : 720}" fill="#1f2937" font-family="Arial, sans-serif" font-size="31" font-weight="700">İLETİŞİM BİLGİLERİ</text>
  <text x="64" y="${ticketData.cocukSayisi > 0 ? 770 : 750}" fill="#6b7280" font-family="Arial, sans-serif" font-size="28">İletişim Numarası: +90 555 081 9869</text>
  ` : ''}
  
  ${ticketData.biletTipi === 'Servis Kullanacak' ? `
  <text x="64" y="${ticketData.cocukSayisi > 0 ? 740 : 720}" fill="#1f2937" font-family="Arial, sans-serif" font-size="31" font-weight="700">İLETİŞİM BİLGİLERİ</text>
  <text x="64" y="${ticketData.cocukSayisi > 0 ? 770 : 750}" fill="#6b7280" font-family="Arial, sans-serif" font-size="28">İletişim Numarası: +90 507 881 7824</text>
  ` : ''}
  
  <!-- Pickup Info (conditional) -->
  ${ticketData.biletTipi === 'Servis Kullanacak' && (ticketData.alinisYeri || ticketData.alinisSaati) ? `
  <text x="64" y="${ticketData.cocukSayisi > 0 ? 820 : 800}" fill="#1f2937" font-family="Arial, sans-serif" font-size="31" font-weight="700">ALIŞ BİLGİLERİ</text>
  ${ticketData.alinisYeri ? `<text x="64" y="${ticketData.cocukSayisi > 0 ? 850 : 830}" fill="#6b7280" font-family="Arial, sans-serif" font-size="28">Alınış Yeri: ${ticketData.alinisYeri}</text>` : ''}
  ${ticketData.alinisSaati ? `<text x="64" y="${ticketData.cocukSayisi > 0 ? 880 : 860}" fill="#6b7280" font-family="Arial, sans-serif" font-size="28">Alınış Saati: ${ticketData.alinisSaati}</text>` : ''}
  ` : ''}
  
  <!-- Notes (conditional) -->
  ${ticketData.not ? `
  <text x="64" y="${ticketData.cocukSayisi > 0 ? 940 : 920}" fill="#1f2937" font-family="Arial, sans-serif" font-size="31" font-weight="700">NOTLAR</text>
  <text x="64" y="${ticketData.cocukSayisi > 0 ? 970 : 950}" fill="#6b7280" font-family="Arial, sans-serif" font-size="28">${ticketData.not}</text>
  ` : ''}
  
  <!-- TURSAB Info above footer -->
  <text x="64" y="${height-160}" fill="#1f2937" font-family="Arial, sans-serif" font-size="24" font-weight="700">TURSAB BELGE NO: 15964</text>
  
  <!-- Footer -->
  <rect x="32" y="${height-120}" width="${width-64}" height="88" rx="0 0 8 8" fill="#f8fafc" stroke="#e5e7eb" stroke-width="1"/>
  <text x="${width/2}" y="${height-70}" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif" font-size="22">Oluşturulma Tarihi: ${ticketData.createdAt}</text>
  <text x="${width/2}" y="${height-50}" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif" font-size="22">İş Bu Bilet Yabancı Tur Operatörü Bölgesindeki Kontrol İçindir.</text>
  <text x="${width/2}" y="${height-30}" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif" font-size="22">Hiçbir Mali Hükmü Yoktur.</text>
</svg>`
}

function generateAutoDownloadHTML(svg: string, reservationId: string): string {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bilet İndiriliyor - ${reservationId}</title>
    <style>
        body {
            margin: 0;
            padding: 40px;
            background: #f3f4f6;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
            justify-content: center;
        }
        
        .container {
            background: white;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 10px 50px rgba(0,0,0,0.1);
            max-width: 500px;
            width: 100%;
            text-align: center;
        }
        
        .spinner {
            border: 4px solid #e5e7eb;
            border-top: 4px solid #3b82f6;
            border-radius: 50%;
            width: 48px;
            height: 48px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .title {
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 10px;
        }
        
        .subtitle {
            color: #6b7280;
            font-size: 16px;
            margin-bottom: 30px;
        }
        
        .status {
            padding: 15px;
            border-radius: 8px;
            font-weight: 500;
            margin-top: 20px;
        }
        
        .status.success {
            background: #d1fae5;
            color: #065f46;
            border: 1px solid #a7f3d0;
        }
        
        .status.error {
            background: #fee2e2;
            color: #991b1b;
            border: 1px solid #fecaca;
        }
        
        .retry-btn {
            padding: 12px 24px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            margin-top: 15px;
        }
        
        .retry-btn:hover {
            background: #2563eb;
        }
        
        .hidden-svg {
            position: absolute;
            left: -9999px;
            top: -9999px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="spinner" id="spinner"></div>
        <div class="title">Biletiniz Hazırlanıyor</div>
        <div class="subtitle">Rezervasyon #${reservationId}</div>
        <div class="status" id="status" style="display: none;"></div>
        <button class="retry-btn" id="retryBtn" onclick="convertToPNG()" style="display: none;">
            Tekrar Dene
        </button>
    </div>
    
    <!-- Hidden SVG for conversion -->
    <div class="hidden-svg">
        ${svg}
    </div>
    
    <script>
        // Auto-start conversion when page loads
        window.addEventListener('load', function() {
            setTimeout(convertToPNG, 500); // Small delay to ensure DOM is ready
        });
        
        async function convertToPNG() {
            const spinner = document.getElementById('spinner');
            const status = document.getElementById('status');
            const retryBtn = document.getElementById('retryBtn');
            
            try {
                spinner.style.display = 'block';
                status.style.display = 'none';
                retryBtn.style.display = 'none';
                
                const svgElement = document.querySelector('svg');
                if (!svgElement) {
                    throw new Error('SVG elementi bulunamadı');
                }
                
                // Create canvas
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Set high resolution
                const scale = 2;
                canvas.width = 800 * scale;
                canvas.height = 1400 * scale;
                
                // Create image from SVG
                const img = new Image();
                const svgData = new XMLSerializer().serializeToString(svgElement);
                const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
                const url = URL.createObjectURL(svgBlob);
                
                img.onload = function() {
                    try {
                        // Scale context for high resolution
                        ctx.scale(scale, scale);
                        
                        // Draw white background
                        ctx.fillStyle = 'white';
                        ctx.fillRect(0, 0, 800, 1400);
                        
                        // Draw SVG
                        ctx.drawImage(img, 0, 0, 800, 1400);
                        
                        // Convert to PNG and download
                        canvas.toBlob(function(blob) {
                            if (blob) {
                                const downloadUrl = URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = downloadUrl;
                                link.download = 'ticket-${reservationId}.png';
                                link.click();
                                
                                URL.revokeObjectURL(downloadUrl);
                                showStatus('Bilet başarıyla indirildi!', 'success');
                                
                                // Close window after successful download
                                setTimeout(() => {
                                    window.close();
                                }, 2000);
                            } else {
                                throw new Error('PNG oluşturulamadı');
                            }
                        }, 'image/png', 0.95);
                        
                    } catch (error) {
                        console.error('Canvas error:', error);
                        showStatus('PNG oluşturulurken hata: ' + error.message, 'error');
                    } finally {
                        URL.revokeObjectURL(url);
                        spinner.style.display = 'none';
                    }
                };
                
                img.onerror = function() {
                    URL.revokeObjectURL(url);
                    showStatus('SVG yüklenemedi', 'error');
                    spinner.style.display = 'none';
                };
                
                img.src = url;
                
            } catch (error) {
                console.error('Conversion error:', error);
                showStatus('Hata: ' + error.message, 'error');
                spinner.style.display = 'none';
            }
        }
        
        function showStatus(message, type) {
            const status = document.getElementById('status');
            const retryBtn = document.getElementById('retryBtn');
            
            status.textContent = message;
            status.className = \`status \${type}\`;
            status.style.display = 'block';
            
            if (type === 'error') {
                retryBtn.style.display = 'inline-block';
            }
        }
    </script>
</body>
</html>`
}