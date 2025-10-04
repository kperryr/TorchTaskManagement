import { UpdateUserInputSchema, CreateUserInput, UpdateUserInput, LoginInput} from './user.schema';
import { AppError } from '../../lib/AppErrors';
import { handlePrismaError } from '../../lib/PrismaErrorHelper';
import { generateToken, hashPassword, comparePassword } from '../../utils/auth';
import {PrismaClientType } from '../../lib/prisma';
import { AuthPayload } from '../../types';



export class UserService {

  // Create
  async createUser(data: CreateUserInput, prisma: PrismaClientType ) {

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new AppError('Email already exists', 'EMAIL_EXISTS', 400);
    }

    try {
      // Hash password before saving
      const hashedPassword = await hashPassword(data.password);

      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name,
        },
      });

      // Remove password from returned user object
      const { password, ...userWithoutPassword } = user;
      
      // Generate JWT token
      const token = generateToken(user.id);

      return {
        token,
        user: userWithoutPassword
      };
    } catch (error) {
      handlePrismaError(error, 'User');
      throw new AppError('User creation failed', 'USER_CREATION_FAILED', 500);
    }
  }
//--------------------------------------------------------------------------------


  //login
  async login(data: LoginInput , prisma: PrismaClientType ): Promise<AuthPayload> {
  
    try {
      const user = await prisma.user.findUnique({
        where: { email: data.email }
      });

      if (!user) {
        throw new AppError('Invalid email or password', 'INVALID_CREDENTIALS', 401);
      }

      // Verify password
      const isValidPassword = await comparePassword(data.password, user.password);
      if (!isValidPassword) {
        throw new AppError('Invalid email or password', 'INVALID_CREDENTIALS', 401);
      }

      // Generate JWT token
      const token = generateToken(user.id);

      // Remove password from user object
      const { password, ...userWithoutPassword } = user;

      return {
        token,
        user: userWithoutPassword
      };

    } catch (error) {
      handlePrismaError(error, 'User');
      throw new AppError('Login failed', 'LOGIN_FAILED', 500);
    }
  }
//--------------------------------------------------------------------------------

  // Read
  // Get user by ID without password (for authentication context)
  async getUserByIdWithoutPassword(id: number, prisma: PrismaClientType ) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          tasks: true
        }
      });

      if (!user) {
        throw new AppError('User not found', 'NOT_FOUND', 404);
      }

      return user;
    } catch (error) {
      handlePrismaError(error, 'User', id);
    }
  }

  //eventually change for admin only
  async getUsers(prisma: PrismaClientType ) {
    try {
      return await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          tasks: true
        }
      });
    } catch (error) {
      handlePrismaError(error, 'User');
    }
  }

  async getUserById(id: number, prisma: PrismaClientType ) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: { tasks: true },
      });

      if (!user) {
        throw new AppError('User not found', 'NOT_FOUND', 404);
      }

      // Remove password from returned user object
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      handlePrismaError(error, 'User', id);
    }
  }

  async getUserByEmail(email: string, prisma: PrismaClientType ) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { tasks: true },
      });

      if (!user) {
        throw new AppError('User not found', 'NOT_FOUND', 404);
      }

      // Remove password from returned user object
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      handlePrismaError(error, 'User');
    }
  }

  async getUserTasks(userId: number, prisma: PrismaClientType ) {
    try {
      return await prisma.task.findMany({
        where: { userId },
      });
    } catch (error) {
      handlePrismaError(error, 'User', userId);
    }
  }
//--------------------------------------------------------------------------------


  // Update
  async updateUser(id: number, data: UpdateUserInput, prisma: PrismaClientType ) {
    // Remove the currentUserId parameter since we're already checking in resolvers
    const validatedData = UpdateUserInputSchema.parse(data);
    
   try {
      const updateData: any = {
        email: validatedData.email,
        name: validatedData.name,
      };

      // Only update password if provided
      if (validatedData.password) {
        updateData.password = await hashPassword(validatedData.password);
      }

      const user = await prisma.user.update({
        where: { id },
        data: updateData,
      });

      // Remove password from returned user object
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      handlePrismaError(error, 'User', id);
    }
  }
//--------------------------------------------------------------------------------


  // Delete
  async deleteUser(id: number, prisma: PrismaClientType) {
    try {
        await prisma.user.delete({ where: { id } });
        return true;
    } catch (error) {
        handlePrismaError(error, 'User', id);
    }
  }
}