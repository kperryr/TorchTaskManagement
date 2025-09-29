import { User, Task } from '@prisma/client';

export type UserWithTasks = User & {
  tasks?: Task[];
};

export type TaskWithUser = Task & {
  user: User;
};