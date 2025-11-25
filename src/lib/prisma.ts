import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

export const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

// Test connection
prisma.$connect()
    .then((): void => console.log('Successfully connected to database'))
    .catch((e: Error): void => console.error('Database connection failed:', e))