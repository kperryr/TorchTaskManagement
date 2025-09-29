import { AppError } from './AppErrors';

export const handlePrismaError = (error: any, entity: string, id?: number) => {
  if (error && typeof error.code === 'string' && error.code.startsWith('P')) {
    switch (error.code) {
      case 'P2025':
        throw new AppError(`${entity} not found`, 'NOT_FOUND', 404);
      case 'P2002':
        throw new AppError(`${entity} already exists`, 'CONFLICT', 409);
      case 'P2003': // Foreign key violation
        throw new AppError(`Invalid user reference`, 'INVALID_USER', 400);
      default:
        throw new AppError(`Database error`, 'DATABASE_ERROR', 500);
    }
  }
  throw error;
};