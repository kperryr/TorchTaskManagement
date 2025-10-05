import { TaskService } from '../../src/modules/task/task.service';
import { createPrismaClient,PrismaClientType } from '../../src/lib/prisma';


const createMockPrisma = () => {
  const mockTask = {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  return {
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

describe('TaskService - Unit Tests', () => {
  let taskService: TaskService;
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    (createPrismaClient as jest.Mock).mockReturnValue(mockPrisma);
    taskService = new TaskService(mockPrisma);
    jest.clearAllMocks();
  });

  const task = () => mockPrisma.task as any;

  // 1. Test verifyTaskOwnership
  describe('verifyTaskOwnership', () => {
    it('should return true when user owns task', async () => {
      task().findUnique.mockResolvedValue({ userId: 1 });
      const result = await taskService.verifyTaskOwnership(1, 1);
      expect(result).toBe(true);
    });

    it('should throw error when task not found', async () => {
      task().findUnique.mockResolvedValue(null);
      await expect(taskService.verifyTaskOwnership(999, 1))
        .rejects.toThrow('Task not found');
    });
  });

  // 2.Test createTask
  describe('createTask', () => {
    it('should create task successfully', async () => {
      const taskData = { 
        taskName: 'Test', 
        description: 'Test description',
        status: 'PENDING' as const 
      };
      const mockTask = { 
        id: 1, 
        ...taskData, 
        userId: 1,
        dueDate: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      task().findFirst.mockResolvedValue(null);
      task().create.mockResolvedValue(mockTask);

      const result = await taskService.createTask(taskData, 1);
      
      expect(task().create).toHaveBeenCalledWith({
        data: { ...taskData, userId: 1 }
      });
      expect(result).toEqual(mockTask);
    });

    it('should throw error for duplicate task name', async () => {
      const taskData = { 
        taskName: 'Duplicate', 
        description: 'Test description',
        status: 'PENDING' as const 
      };
      task().findFirst.mockResolvedValue({ id: 1 });

      await expect(taskService.createTask(taskData, 1))
        .rejects.toThrow('Task with this title already exists for this user');
    });
  });

  // 3. Test getTaskById
  describe('getTaskById', () => {
    it('should return task when found', async () => {
      const mockTask = { 
        id: 1, 
        taskName: 'Test', 
        description: 'Test description',
        status: 'PENDING' as const,
        userId: 1 
      };
      task().findUnique
        .mockResolvedValueOnce({ userId: 1 })
        .mockResolvedValueOnce(mockTask); 

      const result = await taskService.getTaskById(1, 1);
      expect(result).toEqual(mockTask);
    });
  });

  // 4. Test getTasksByUserId
  describe('getTasksByUserId', () => {
    it('should return user tasks with default sorting', async () => {
      const mockTasks = [{ 
        id: 1, 
        taskName: 'Task 1', 
        description: 'Test description',
        status: 'PENDING' as const,
        userId: 1 
      }];
      task().findMany.mockResolvedValue(mockTasks);

      const result = await taskService.getTasksByUserId(1);

      expect(task().findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: { createdAt: 'desc' }
      });
      expect(result).toEqual(mockTasks);
    });

    it('should apply status filter', async () => {
      const mockTasks = [{ 
        id: 1, 
        taskName: 'Completed Task', 
        description: 'Test description',
        status: 'COMPLETED' as const,
        userId: 1 
      }];
      task().findMany.mockResolvedValue(mockTasks);

      await taskService.getTasksByUserId(1, { status: 'COMPLETED' });

      expect(task().findMany).toHaveBeenCalledWith({
        where: { 
          userId: 1,
          status: 'COMPLETED'
        },
        orderBy: { createdAt: 'desc' }
      });
    });
  });

  // 5. Test updateTask
  describe('updateTask', () => {
    it('should update task successfully', async () => {
      const updateData = { 
        taskName: 'Updated',
        description: 'Updated description'
      };
      const mockUpdatedTask = { 
        id: 1, 
        ...updateData, 
        userId: 1,
        status: 'PENDING' as const
      };
      
      task().findUnique.mockResolvedValue({ userId: 1 });
      task().update.mockResolvedValue(mockUpdatedTask);

      const result = await taskService.updateTask(1, updateData, 1);

      expect(task().update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { ...updateData, updatedAt: expect.any(Date) }
      });
      expect(result).toEqual(mockUpdatedTask);
    });
  });

  // 6. Test deleteTask
  describe('deleteTask', () => {
    it('should delete task and return true', async () => {
      task().findUnique.mockResolvedValue({ userId: 1 }); 
      task().delete.mockResolvedValue({});

      const result = await taskService.deleteTask(1, 1);

      expect(task().delete).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(result).toBe(true);
    });
  });
});