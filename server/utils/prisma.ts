import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

declare global {
  var __prisma: PrismaClient | undefined
  var DB: D1Database | undefined
}

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  // In production (Cloudflare), use D1 adapter
  if (globalThis.DB) {
    const adapter = new PrismaD1(globalThis.DB)
    prisma = new PrismaClient({ adapter })
  } else {
    throw new Error('D1 database binding not found. Make sure DB is properly configured in wrangler.toml')
  }
} else {
  // In development, use SQLite file
  prisma = globalThis.__prisma || new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL || 'file:./prisma/data/app.db'
      }
    }
  })
  
  if (process.env.NODE_ENV !== 'production') {
    globalThis.__prisma = prisma
  }
}

export { prisma }
