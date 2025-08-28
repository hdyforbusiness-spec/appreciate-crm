// Mock canvas module for Cloudflare Workers environment
// This prevents canvas from being bundled in production builds

export function createCanvas() {
  throw new Error('Canvas is not available in Cloudflare Workers environment')
}

export function loadImage() {
  throw new Error('Canvas is not available in Cloudflare Workers environment')
}

// Mock other canvas exports that might be used
export const Canvas = null
export const Image = null
