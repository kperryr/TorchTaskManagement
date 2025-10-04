import { User, Task, TaskStatus } from '@prisma/client';
import { UserService } from './modules/user/user.service';
import { TaskService } from './modules/task/task.service';
import { PrismaClientType } from './lib/prisma';


export type UserWithTasks = User & {
  tasks?: Task[];
};

export type TaskWithUser = Task & {
  user: User;
};

export type UserWithoutPassword = {
  id: number;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export interface GraphQLContext {
  user?: UserWithoutPassword;
  prisma: PrismaClientType;
   services: {
    userService: UserService;
    taskService: TaskService;
  }
}

export type AuthPayload = {
  token: string;
  user: UserWithoutPassword;
};

 export interface JWTPayload {
  userId: number; 
}

export interface JWTDecoded extends JWTPayload {
  iat: number;
  exp: number;
}

export interface TaskFilters {
  status?: TaskStatus;
  sortBy?: 'CREATED_ASC' | 'CREATED_DESC' | 'DUE_ASC' | 'DUE_DESC' | 'NAME_ASC' | 'NAME_DESC';
}