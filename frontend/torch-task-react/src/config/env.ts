import dotenv from 'dotenv';

dotenv.config();

export const env = {
  apiUrl: process.env.API_URL || 'https://torchtaskmanagement.onrender.com/graphql',
};