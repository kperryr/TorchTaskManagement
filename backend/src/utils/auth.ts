import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import { JWTPayload } from '../types';

const JWT_EXPIRES_IN = '7d';


export const generateToken = (userId: number): string => {
    if (!env.jwtSecret) {
        throw new Error('JWT_SECRET is not configured');
    }
    return jwt.sign({ userId }, env.jwtSecret, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): JWTPayload => {
if (!env.jwtSecret) {
    throw new Error('JWT_SECRET is not configured');
  }
  try {
    return jwt.verify(token, env.jwtSecret) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};