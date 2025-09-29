import path from 'path';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config({ path: path.resolve(__dirname, "../../env") });

export const env = {

  jwtSecret: process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex'),
  databaseUrl: process.env.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 4000,
};

if (!env.databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}