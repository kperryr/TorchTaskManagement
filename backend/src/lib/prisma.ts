import { PrismaClient } from '@prisma/client';

//for testing
export function createPrismaClient() {
  return new PrismaClient();
}

//singleton instance
export const prisma = new PrismaClient();

export type PrismaClientType = typeof prisma;