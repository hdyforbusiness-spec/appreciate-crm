import { PrismaClient } from '@prisma/client'

declare global {
  var __prisma: PrismaClient | undefined
}

export const prisma = globalThis.__prisma || new PrismaClient()

// Remove process.env completely
if (globalThis.__prisma === undefined) {
  globalThis.__prisma = prisma
}