import { Request, Response } from 'express';
import { verifyToken } from '../utils/auth';
import { UserService } from '../modules/user/user.service';
import { prisma} from '../lib/prisma';
import { GraphQLContext } from '../types';
import { TaskService } from '../modules/task/task.service';


export const createGraphQLContext = async ({ req, res }: { req: Request; res: Response }): Promise<GraphQLContext> => {
  
  const services = {
    userService: new UserService(prisma),
    taskService: new TaskService(prisma),
  };

  try {

    const authHeader = req.headers.authorization;
    
    //for logging in and registering further access is restricted in resolvers
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { prisma, services}; 
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    const user = await services.userService.getUserByIdWithoutPassword(decoded.userId);

    return { user, prisma, services};
  } catch (error) {
    // Return context without user on error
    return { prisma, services};
  }
};