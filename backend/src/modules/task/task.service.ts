import { CreateTaskInput, UpdateTaskInput } from './task.schema';
import { Prisma } from '@prisma/client';
import { AppError } from '../../lib/AppErrors';
import { handlePrismaError } from '../../lib/PrismaErrorHelper';
import { TaskFilters } from '../../types';
import { PrismaClientType } from '../../lib/prisma';

export class TaskService {
  constructor(private prisma: PrismaClientType) {}

  async verifyTaskOwnership(taskId: number, userId: number) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      select: { userId: true }
    });

    if (!task) {
      throw new AppError('Task not found', 'NOT_FOUND', 404);
    }

    if (task.userId !== userId) {
      throw new AppError('You can only access your own tasks', 'FORBIDDEN', 403);
    }

    return true;
  }

  
  //create
  async createTask(data: CreateTaskInput, userId: number) {
    try {
      const existingTask = await this.prisma.task.findFirst({
        where: {
          taskName: data.taskName,
          userId: userId,
        }
      });

      if (existingTask) {
        throw new AppError('Task with this title already exists for this user', 'TASK_EXISTS', 400);
      }

      return await this.prisma.task.create({ 
        data: {
          ...data,
          userId: userId // Uses the authenticated user's ID
        }
      });
    } catch (error) {
      handlePrismaError(error, 'Task');
    }
  }

  
//Read
 async getTaskById(id: number, userId: number) {
    try {
      await this.verifyTaskOwnership(id, userId);
      
      const task = await this.prisma.task.findUnique({ 
        where: { id }
      });
      
      if (!task) {
        throw new AppError(`Task with ID ${id} not found`, 'TASK_NOT_FOUND', 404);
      }
      return task;
    } catch (error) {
      handlePrismaError(error, 'Task', id);
    }
  }


  async getTasksByUserId(userId: number, filters : TaskFilters = {}) {
  try {
    const where: Prisma.TaskWhereInput= { userId };

    // Default sorting
    let orderBy: Prisma.TaskOrderByWithRelationInput = { createdAt: 'desc' };

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'CREATED_ASC':
          orderBy = { createdAt: 'asc' };
          break;
        case 'DUE_ASC':
          orderBy = { dueDate: 'asc' };
          break;
        case 'DUE_DESC':
          orderBy = { dueDate: 'desc' };
          break;
        case 'NAME_ASC':
          orderBy = { taskName: 'asc' };
          break;
        case 'NAME_DESC':
          orderBy = { taskName: 'desc' };
          break;
        default:
          orderBy = { createdAt: 'desc' };
      }
    }
    
    return await this.prisma.task.findMany({ 
      where,
      orderBy
    });
    
  } catch (error) {
    handlePrismaError(error, 'Task');
  }
}

//Update
   async updateTask(id: number, data: UpdateTaskInput, userId: number) {
    try {
      await this.verifyTaskOwnership(id, userId);

      return await this.prisma.task.update({
        where: { id },
        data: { 
          ...data, 
          updatedAt: new Date() 
        },
      });
    } catch (error) {
      handlePrismaError(error, 'Task', id);
    }
  }


//delete
  async deleteTask(id: number, userId: number) {
    try {
      await this.verifyTaskOwnership(id, userId);

      await this.prisma.task.delete({ where: { id } });
      return true;
    } catch (error) {
      handlePrismaError(error, 'Task', id);
    }
  }
}
