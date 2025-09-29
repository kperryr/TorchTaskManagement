import { Request, Response } from 'express';
import { verifyToken } from '../utils/auth';
import { UserService } from '../modules/user/user.service';
import { PrismaClient } from '@prisma/client';

const userService = new UserService();
const prisma = new PrismaClient();

export interface GraphQLContext {
  user?: any;
  prisma: PrismaClient;
}

export const createGraphQLContext = async ({ req, res }: { req: Request; res: Response }): Promise<GraphQLContext> => {
  try {
    const authHeader = req.headers.authorization;
    
    //for logging in and registering further access is restricted in resolvers
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { prisma }; 
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    const user = await userService.getUserByIdWithoutPassword(decoded.userId);

    return { user, prisma };
  } catch (error) {
    // Return context without user on error
    return { prisma };
  }
};