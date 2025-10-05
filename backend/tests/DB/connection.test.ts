import {createPrismaClient} from '../../src/lib/prisma';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env.test
config({ path: path.join(__dirname, '../.env.test') });


test('should connect to Docker database', async () => {
  const prisma = createPrismaClient();
  
  try {
    await prisma.$connect();
    console.log('Connected to Docker database successfully');
    
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('Database version:', result);
    
    expect(result).toBeTruthy();
  } finally {
    await prisma.$disconnect();
  }
});