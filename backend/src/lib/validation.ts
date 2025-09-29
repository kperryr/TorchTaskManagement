import { AppError } from './AppErrors';
import { z } from 'zod';

//Validates data from client in resolvers using Zod for database calls in service files
export const validation = {

    parseId : (id: string): number => {
        try {
            return z
                .string()
                .regex(/^\d+$/, 'ID must contain only numbers')
                .transform(val => parseInt(val, 10))
                .refine(val => val > 0, 'ID must be positive')
                .parse(id); 
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new AppError('Invalid user ID', 'INVALID_ID', 400);
            }
            throw error;
        }
    },

    parseEmail: (email: string): string => {
        try {
            return z
                .string()
                .trim()
                .min(1, "Email is required")
                .email("Please enter a valid email address")
                .parse(email);
        } catch (error) {
        if (error instanceof z.ZodError) {
            throw new AppError('Invalid email format', 'INVALID_EMAIL', 400);
        }
        throw error;
        }
  },
};

