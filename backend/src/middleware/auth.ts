import { Request, Response } from 'express';
import { verifyToken } from '../utils/auth';
import { UserService } from '../modules/user/user.service';
import { prisma} from '../lib/prisma';
import { GraphQLContext } from '../types';

const userService = new UserService();

export const createGraphQLContext = async ({ req, res }: { req: Request; res: Response }): Promise<GraphQLContext> => {
  try {
    const authHeader = req.headers.authorization;
    
    //for logging in and registering further access is restricted in resolvers
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { prisma }; 
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    const user = await userService.getUserByIdWithoutPassword(decoded.userId, prisma);

    return { user, prisma };
  } catch (error) {
    // Return context without user on error
    return { prisma };
  }
};