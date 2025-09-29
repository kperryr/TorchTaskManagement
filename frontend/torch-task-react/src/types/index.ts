export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
}

export interface Task {
  id: number;
  taskName: string;
  description: string;
  status: TaskStatus;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export const TaskStatus = {
  PENDING: "PENDING" as TaskStatus,
  IN_PROGRESS: "IN_PROGRESS" as TaskStatus,
  COMPLETED: "COMPLETED" as TaskStatus,
  CANCELLED: "CANCELLED" as TaskStatus,
};

export interface AuthPayload {
  token: string;
  user: User;
}

export interface CreateTaskInput {
  taskName: string;
  description: string;
  status?: TaskStatus;
  dueDate?: string;
}

export interface UpdateTaskInput {
  taskName?: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  name: string;
}
