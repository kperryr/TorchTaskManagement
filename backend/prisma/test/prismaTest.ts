// test-prisma.ts
import { PrismaClient } from '@prisma/client';

async function prismaDebugTest() {
  const prisma = new PrismaClient();
  
  try {
    const result = await prisma.$queryRaw`SELECT 1 as connection_test`;
    console.log( 'Prisma connection successful!', result);
  } catch (error) {
    console.error( 'Prisma connection failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

prismaDebugTest();