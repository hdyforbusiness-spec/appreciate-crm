// /utils/prisma.ts  (EDGE UYUMLU)
import { PrismaClient } from '@prisma/client/edge'
import { PrismaD1 } from '@prisma/adapter-d1'
import type { H3Event } from 'h3'

export function getPrisma(event: H3Event) {
  // Cloudflare Pages Functions → env binding buradan gelir:
  const env = event.context.cloudflare?.env
  const db = env?.DB
  if (!db) {
    throw createError({ statusCode: 500, statusMessage: 'D1 binding (env.DB) tanımlı değil' })
  }
  const adapter = new PrismaD1(db)
  // Workers’da istek başına instance güvenli. Global cache tutma!
  return new PrismaClient({ adapter })
}
