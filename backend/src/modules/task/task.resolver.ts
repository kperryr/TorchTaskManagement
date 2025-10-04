import { TaskService } from './task.service';
import { CreateTaskSchema, UpdateTaskSchema, CreateTaskInput, UpdateTaskInput } from './task.schema';
import { validation } from '../../lib/validation';
import { GraphQLContext, TaskFilters, TaskWithUser} from '../../types';

const taskService = new TaskService();

export const taskResolvers = {
  Query: {
     taskByUser: async (_: unknown, { filters }: { filters?: TaskFilters }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated. Please log in.');
      }
      const filterParams = filters || {};
       const tasks = await taskService.getTasksByUserId(context.user.id, filterParams, context.prisma);
      
       if (!tasks) {
        return [];
      }
      
      // Convert dates to ISO strings for frontend
      return tasks.map((task: any) => ({
        ...task,
        createdAt: task?.createdAt?.toISOString(),
        updatedAt: task?.updatedAt?.toISOString(),
        dueDate: task?.dueDate ? task.dueDate.toISOString() : null, 
      }));
    },

    taskById: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated. Please log in.');
      }
      const validatedId = validation.parseId(id);
      const task = await taskService.getTaskById(validatedId, context.user.id, context.prisma);
      
       if (!task) {
        throw new Error('Task not found');
      }
      
      // Convert dates to ISO strings for frontend - use type assertion
    return {
      ...task,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
      dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    };
    },
  },

  Mutation: {
    createTask: async (_: unknown, { input }: { input: CreateTaskInput }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated. Please log in.');
      }
      const validatedData = CreateTaskSchema.parse(input);
      return await taskService.createTask(validatedData, context.user.id, context.prisma);
    },

    updateTask: async (_: unknown, { id, input }: { id: string; input: UpdateTaskInput }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated. Please log in.');
      }
      const validatedData = UpdateTaskSchema.parse(input);
      const validatedId = validation.parseId(id);
      return await taskService.updateTask(validatedId, validatedData, context.user.id, context.prisma);
    },

     deleteTask: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated. Please log in.');
      }
      const taskId = validation.parseId(id);
      return await taskService.deleteTask(taskId, context.user.id,context.prisma);
    },
  },

  // Field resolvers
  Task: {
    user: async (task: TaskWithUser, _args: unknown, context: GraphQLContext) => {
      if (task.user) return task.user;
      
      return context.prisma.user.findUnique({
        where: { id: task.userId }
      });
    },
  }
};