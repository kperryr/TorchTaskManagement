import { TaskService } from './task.service';
import { CreateTaskSchema, UpdateTaskSchema, CreateTaskInput, UpdateTaskInput } from './task.schema';
import { validation } from '../../lib/validation';
import { GraphQLContext } from '../../middleware/auth';

const taskService = new TaskService();

export const taskResolvers = {
  Query: {
     taskByUser: async (_: unknown, { filters }: { filters?: any }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated. Please log in.');
      }
      const filterParams = filters || {};
       const tasks = await taskService.getTasksByUserId(context.user.id, filterParams);
      
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
      const task = await taskService.getTaskById(validatedId, context.user.id);
      
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
      return await taskService.createTask(validatedData, context.user.id);
    },

    updateTask: async (_: unknown, { id, input }: { id: string; input: UpdateTaskInput }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated. Please log in.');
      }
      const validatedData = UpdateTaskSchema.parse(input);
      const validatedId = validation.parseId(id);
      return await taskService.updateTask(validatedId, validatedData, context.user.id);
    },

     deleteTask: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated. Please log in.');
      }
      const taskId = validation.parseId(id);
      return await taskService.deleteTask(taskId, context.user.id);
    },
  },

  // Field resolvers
  Task: {
    user: async (task: any, _args: unknown, context: GraphQLContext) => {
      if (task.user) return task.user;
      
      return context.prisma.user.findUnique({
        where: { id: task.userId }
      });
    },
  }
};