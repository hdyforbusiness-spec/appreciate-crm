import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

declare global {
  var __prisma: PrismaClient | undefined
  var DB: D1Database | undefined
}

let prisma: PrismaClient

// In Cloudflare Workers, always use D1 adapter
if (globalThis.DB) {
  const adapter = new PrismaD1(globalThis.DB)
  prisma = new PrismaClient({ adapter })
} else {
  // This should never happen in production, but provide a fallback
  throw new Error('D1 database binding not found. Make sure DB is properly configured in wrangler.toml')
}

export { prisma }