import { Task } from '@prisma/client';

export const convertDates = (task: Task) => ({
  ...task,
  createdAt: task.createdAt.toISOString(),
  updatedAt: task.updatedAt.toISOString(),
  dueDate: task.dueDate?.toISOString() || null,
});