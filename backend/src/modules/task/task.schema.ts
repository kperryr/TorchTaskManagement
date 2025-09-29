import { z } from 'zod';

// Task Status Enum
export const TaskStatusEnum = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']);
export type TaskStatus = z.infer<typeof TaskStatusEnum>;

// Zod Validation for creating a task
export const CreateTaskSchema = z.object({
  taskName: z
    .string()
    .trim()
    .min(5,{message:"Must be at least 5 characters"})
    .max(50, 'Task name must be less than 50 characters'),
  description: z
    .string()
    .trim()
    .max(500, 'Description must be less than 500 characters'),
  status: TaskStatusEnum.default('PENDING'),
  dueDate: z
    .string()
    .datetime({ message: 'Due date must be a valid ISO date string' })
    .optional()
});

// Zod Validation for updating a task
export const UpdateTaskSchema = z.object({
  taskName: z
    .string()
    .trim()
    .min(1, 'Task name is required')
    .max(100, 'Task name must be less than 100 characters')
    .optional(),
  description: z
    .string()
    .trim()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  status: TaskStatusEnum.optional(),
  dueDate: z
    .string()
    .datetime({ message: 'Due date must be a valid ISO date string' })
    .optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

// Validation for task ID
export const TaskIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'ID must contain only numbers')
    .transform(val => parseInt(val, 10))
    .refine(val => val > 0, 'ID must be positive'),
});

// Inferred TypeScript type for use in services, controllers, etc.
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type TaskIdInput = z.infer<typeof TaskIdSchema>;