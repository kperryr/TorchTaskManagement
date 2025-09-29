import { UserService } from './user.service';
import { CreateUserSchema, UpdateUserInputSchema, LoginSchema, CreateUserInput, UpdateUserInput, LoginInput, } from './user.schema';
import { UserWithTasks } from '../../types';
import { validation } from '../../lib/validation';
import { GraphQLContext } from '../../middleware/auth';

const userService = new UserService();

export const userResolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated. Please log in.');
      }
      return context.user; 
    },

    users: async (_: unknown, __: unknown, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated. Please log in.');
      }
      throw new Error('Access denied. Use the "me" query to see your own profile.');

    },

    user: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated. Please log in.');
      }
      
      const userId = validation.parseId(id);
      
      // Users can only see their own profile
      if (context.user.id !== userId) {
        throw new Error('You can only view your own profile.');
      }
      
      return userService.getUserById(userId);
    },

    userByEmail: async (_: unknown, { email }: { email: string }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated. Please log in.');
      }
      
      const userEmail = validation.parseEmail(email);
      
      // Users can only see their own profile by email
      if (context.user.email !== userEmail) {
        throw new Error('You can only view your own profile.');
      }
      
      return userService.getUserByEmail(userEmail);
    },
  },

   Mutation: {
    register: async (_: unknown, { input }: { input: CreateUserInput }) => {
      const validatedData = CreateUserSchema.parse(input);
      return userService.createUser(validatedData);
    },

    login: async (_: unknown, { input }: { input: LoginInput }) => {
      const validatedData = LoginSchema.parse(input);
      return userService.login(validatedData);
    },

    updateUser: async (_: unknown, { id, input }: { id: string; input: UpdateUserInput }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated. Please log in.');
      }
      
      const validatedData = UpdateUserInputSchema.parse(input);
      const userId = validation.parseId(id);
      
      // Users can only update their own account
      if (context.user.id !== userId) {
        throw new Error('You can only update your own account.');
      }
      
      return userService.updateUser(userId, validatedData);
    },

    deleteUser: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated. Please log in.');
      }
      
      const userId = validation.parseId(id);
      
      // Users can only delete their own account
      if (context.user.id !== userId) {
        throw new Error('You can only delete your own account.');
      }
      return userService.deleteUser(userId);
    },
  },

  // Field resolvers for relations 
  User: {
    tasks: (user: UserWithTasks, _: unknown, context: GraphQLContext) => {      
      // If tasks are already loaded via include, return them
      if (user.tasks) return user.tasks;
      
      // Otherwise fetch them
      return userService.getUserTasks(user.id);
    },
  },
};