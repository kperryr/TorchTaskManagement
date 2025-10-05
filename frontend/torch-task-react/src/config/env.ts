import dotenv from 'dotenv';

dotenv.config();

export const env = {
  apiUrl: import.meta.env.VITE_API_URL || 'https://torchtaskmanagement.onrender.com/graphql',
};