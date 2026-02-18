import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  adapterFactory: PrismaPg | undefined
}

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// Create adapter factory (PrismaClient will handle connection internally)
const adapterFactory = globalForPrisma.adapterFactory ?? new PrismaPg({ connectionString })

if (!globalForPrisma.adapterFactory) {
  globalForPrisma.adapterFactory = adapterFactory
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter: adapterFactory })

if (process.env.NODE_ENV !== 'production' && !globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma
}
