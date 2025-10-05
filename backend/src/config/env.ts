import dotenv from 'dotenv';

dotenv.config();

export const env = {
  jwtSecret: process.env.JWT_SECRET,
  databaseUrl: process.env.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
};

if (!env.jwtSecret) {
  throw new Error('JWT_SECRET environment variable is required');
}
if (!env.databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}