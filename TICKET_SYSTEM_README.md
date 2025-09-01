# Ticket Generation System

This project now uses a modern SVG-to-PNG ticket generation system that's fully compatible with Cloudflare Pages/Workers.

## How It Works

1. **SVG Generation**: Uses [satori](https://github.com/vercel/satori) to convert JSX-like structures to SVG
2. **PNG Rasterization**: Uses [@resvg/resvg-wasm](https://github.com/yisibl/resvg-js) to convert SVG to PNG using WebAssembly
3. **Edge Compatibility**: Works perfectly on Cloudflare Pages/Workers without requiring Puppeteer

## API Endpoint

```
GET /api/ticket/[bookingId]
```

### Response
- **Content-Type**: `image/png`
- **Content-Disposition**: `attachment; filename="ticket-[reservationId].png"`
- **Body**: PNG image bytes

### Features
- ✅ **Immediate Download**: No HTML trampoline needed
- ✅ **High Quality**: 1200x1800 resolution with 2x scale
- ✅ **Professional Design**: Beautiful gradient headers and clean typography
- ✅ **Edge Compatible**: Works on Cloudflare Pages/Workers
- ✅ **WASM Powered**: Fast SVG-to-PNG conversion

## Technical Details

### Dependencies
- `satori`: JSX-to-SVG conversion
- `@resvg/resvg-wasm`: SVG-to-PNG rasterization
- `Inter` font: Professional typography

### Font Setup
The system uses the Inter font located at `server/assets/fonts/Inter.woff2`

### WASM Initialization
The system automatically initializes the WASM module on cold start and reuses it for subsequent requests.

## Usage Example

```typescript
// The endpoint automatically:
// 1. Fetches booking data from database
// 2. Generates SVG using satori
// 3. Converts to PNG using resvg-wasm
// 4. Returns PNG bytes with proper headers

// Client usage:
const response = await fetch(`/api/ticket/${bookingId}`)
const blob = await response.blob()
const url = URL.createObjectURL(blob)

// Download automatically or display inline
const link = document.createElement('a')
link.href = url
link.download = `ticket-${bookingId}.png`
link.click()
```

## Benefits Over Previous System

- **No HTML Trampoline**: Direct PNG download
- **Better Performance**: WASM-based conversion vs client-side html2canvas
- **Edge Compatible**: Works on Cloudflare Pages/Workers
- **Higher Quality**: Better typography and resolution
- **Smaller Bundle**: No need for html2canvas client-side library

## Deployment

The system is already configured for Cloudflare Pages deployment with:
- WASM experimental features enabled
- Proper build configuration
- Optimized for edge runtime

## Troubleshooting

If you encounter issues:

1. **WASM Loading**: Ensure `nuxt.config.ts` has `experimental.wasm: true`
2. **Font Loading**: Verify `server/assets/fonts/Inter.woff2` exists
3. **Build Errors**: Check that all dependencies are properly installed

## Future Enhancements

- [ ] Add JPEG support (requires different WASM package)
- [ ] Customizable ticket templates
- [ ] Multiple language support
- [ ] QR code integration
- [ ] Digital signature support
