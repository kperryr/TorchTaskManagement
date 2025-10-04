import { User, Task, TaskStatus } from '@prisma/client';
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
}

export type AuthPayload = {
  token: string;
  user: UserWithoutPassword;
};

//fix soon
 export interface JWTPayload {
  userId: number; 
}

export interface TaskFilters {
  status?: TaskStatus;
  sortBy?: 'CREATED_ASC' | 'CREATED_DESC' | 'DUE_ASC' | 'DUE_DESC' | 'NAME_ASC' | 'NAME_DESC';
}