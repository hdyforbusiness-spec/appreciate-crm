import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

declare global {
  var __prisma: PrismaClient | undefined
  var DB: D1Database | undefined
}

let prisma: PrismaClient

// Better environment detection for Cloudflare Workers
if (globalThis.DB) {
  // In production (Cloudflare), use D1 adapter
  const adapter = new PrismaD1(globalThis.DB)
  prisma = new PrismaClient({ adapter })
} else if (process.env.NODE_ENV === 'production') {
  // Fallback check for production environment
  throw new Error('D1 database binding not found. Make sure DB is properly configured in wrangler.toml')
} else {
  // In development, use SQLite file
  prisma = globalThis.__prisma || new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL || 'file:./prisma/data/app.db'
      }
    }
  })
  
  if (!globalThis.__prisma) {
    globalThis.__prisma = prisma
  }
}

export { prisma }
