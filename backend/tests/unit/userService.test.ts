import { UserService } from '../../src/modules/user/user.service';
import { createPrismaClient, PrismaClientType } from '../../src/lib/prisma';
import { hashPassword, comparePassword, generateToken } from '../../src/utils/auth';

const createMockPrisma = () => {
  const mockUser = {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockTask = {
    findMany: jest.fn(),
  };

  return {
    user: mockUser,
    task: mockTask,
  } as unknown as PrismaClientType;
};

jest.mock('../../src/lib/prisma', () => ({
  createPrismaClient: jest.fn(),
}));

jest.mock('../../src/lib/PrismaErrorHelper', () => ({
  handlePrismaError: jest.fn().mockImplementation((error) => {
    throw error;
  }),
}));

jest.mock('../../src/utils/auth', () => ({
  hashPassword: jest.fn().mockResolvedValue('hashed_password'),
  comparePassword: jest.fn().mockResolvedValue(true),
  generateToken: jest.fn().mockReturnValue('mock_jwt_token'),
}));

describe('UserService - Unit Tests', () => {
  let userService: UserService;
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    (createPrismaClient as jest.Mock).mockReturnValue(mockPrisma);
    userService = new UserService(mockPrisma);
    jest.clearAllMocks();
  });

  const user = () => mockPrisma.user as any;
  const task = () => mockPrisma.task as any;

  // 1. Test createUser
  describe('createUser', () => {
    it('should create user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const mockUser = {
        id: 1,
        email: userData.email,
        password: 'hashed_password',
        name: userData.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      user().findUnique.mockResolvedValue(null);
      user().create.mockResolvedValue(mockUser);

      const result = await userService.createUser(userData);

      expect(user().findUnique).toHaveBeenCalledWith({
        where: { email: userData.email },
      });
      expect(hashPassword).toHaveBeenCalledWith(userData.password);
      expect(user().create).toHaveBeenCalledWith({
        data: {
          email: userData.email,
          password: 'hashed_password',
          name: userData.name,
        },
      });
      expect(generateToken).toHaveBeenCalledWith(1);
      expect(result.token).toBe('mock_jwt_token');
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw error for duplicate email', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'password123',
        name: 'Test User',
      };

      user().findUnique.mockResolvedValue({ id: 1 });

      await expect(userService.createUser(userData))
        .rejects.toThrow('Email already exists');
    });
  });

  // 2. Test login
  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 1,
        email: loginData.email,
        password: 'hashed_password',
        name: 'Test User',
      };

      user().findUnique.mockResolvedValue(mockUser);
      (comparePassword as jest.Mock).mockResolvedValue(true);

      const result = await userService.login(loginData);

      expect(user().findUnique).toHaveBeenCalledWith({
        where: { email: loginData.email },
      });
      expect(comparePassword).toHaveBeenCalledWith(loginData.password, mockUser.password);
      expect(generateToken).toHaveBeenCalledWith(1);
      expect(result.token).toBe('mock_jwt_token');
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw error for invalid email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      user().findUnique.mockResolvedValue(null);

      await expect(userService.login(loginData))
        .rejects.toThrow('Invalid email or password');
    });

    it('should throw error for invalid password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const mockUser = {
        id: 1,
        email: loginData.email,
        password: 'hashed_password',
        name: 'Test User',
      };

      user().findUnique.mockResolvedValue(mockUser);
      (comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(userService.login(loginData))
        .rejects.toThrow('Invalid email or password');
    });
  });

  // 3. Test getUserByIdWithoutPassword
  describe('getUserByIdWithoutPassword', () => {
    it('should return user without password', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
        tasks: [],
      };

      user().findUnique.mockResolvedValue(mockUser);

      const result = await userService.getUserByIdWithoutPassword(1);

      expect(user().findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          tasks: true,
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw error when user not found', async () => {
      user().findUnique.mockResolvedValue(null);

      await expect(userService.getUserByIdWithoutPassword(999))
        .rejects.toThrow('User not found');
    });
  });

  // 4. Test getUsers
  describe('getUsers', () => {
    it('should return all users without passwords', async () => {
      const mockUsers = [
        {
          id: 1,
          email: 'user1@example.com',
          name: 'User 1',
          createdAt: new Date(),
          updatedAt: new Date(),
          tasks: [],
        },
        {
          id: 2,
          email: 'user2@example.com',
          name: 'User 2',
          createdAt: new Date(),
          updatedAt: new Date(),
          tasks: [],
        },
      ];

      user().findMany.mockResolvedValue(mockUsers);

      const result = await userService.getUsers();

      expect(user().findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          tasks: true,
        },
      });
      expect(result).toEqual(mockUsers);
    });
  });

  // 5. Test getUserTasks
  describe('getUserTasks', () => {
    it('should return user tasks', async () => {
      const mockTasks = [
        { id: 1, taskName: 'Task 1', userId: 1 },
        { id: 2, taskName: 'Task 2', userId: 1 },
      ];

      task().findMany.mockResolvedValue(mockTasks);

      const result = await userService.getUserTasks(1);

      expect(task().findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        take: undefined,
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockTasks);
    });

    it('should return limited user tasks', async () => {
      const mockTasks = [{ id: 1, taskName: 'Task 1', userId: 1 }];

      task().findMany.mockResolvedValue(mockTasks);

      const result = await userService.getUserTasks(1, 5);

      expect(task().findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        take: 5,
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockTasks);
    });
  });

  // 6. Test updateUser
  describe('updateUser', () => {
    it('should update user without password', async () => {
      const updateData = { name: 'Updated Name' };
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed_password',
        name: 'Updated Name',
      };

      user().update.mockResolvedValue(mockUser);

      const result = await userService.updateUser(1, updateData);

      expect(user().update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
      });
      expect(result).not.toHaveProperty('password');
    });

    it('should update user with password hashing', async () => {
      const updateData = { password: 'newpassword123' };
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed_new_password',
        name: 'Test User',
      };

      (hashPassword as jest.Mock).mockResolvedValue('hashed_new_password');
      user().update.mockResolvedValue(mockUser);

      const result = await userService.updateUser(1, updateData);

      expect(hashPassword).toHaveBeenCalledWith('newpassword123');
      expect(user().update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { password: 'hashed_new_password' },
      });
      expect(result).not.toHaveProperty('password');
    });
  });

  // 7. Test deleteUser
  describe('deleteUser', () => {
    it('should delete user and return true', async () => {
      user().delete.mockResolvedValue({});

      const result = await userService.deleteUser(1);

      expect(user().delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toBe(true);
    });
  });
});