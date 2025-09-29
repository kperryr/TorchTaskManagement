import type {Task, CreateTaskInput, UpdateTaskInput, TaskStatus} from "../types";
import { apiService } from "./api";
//handles all task-related CRUD operations API calls to GraphQL API

export class TaskService {
  async getTasks(filters?: {
    status?: TaskStatus;
    sortBy?: string;
  }): Promise<Task[]> {
    const query = `
      query GetTasks($filters: TaskFilters) {
        taskByUser(filters: $filters) {
          id
          taskName
          description
          status
          dueDate
          createdAt
          updatedAt
          userId
        }
      }
    `;

    return await apiService
      .graphqlRequest<{ taskByUser: Task[] }>(query, { filters })
      .then((data) => data.taskByUser);
  }

  async getTaskById(id: number): Promise<Task> {
    const query = `
      query GetTask($id: ID!) {
        taskById(id: $id) {
          id
          taskName
          description
          status
          dueDate
          createdAt
          updatedAt
          userId
        }
      }
    `;

    return await apiService
      .graphqlRequest<{ taskById: Task }>(query, { id: id.toString() })
      .then((data) => data.taskById);
  }

  async createTask(input: CreateTaskInput): Promise<Task> {
    const query = `
      mutation CreateTask($input: CreateTaskInput!) {
        createTask(input: $input) {
          id
          taskName
          description
          status
          dueDate
          createdAt
          updatedAt
          userId
        }
      }
    `;

    return await apiService
      .graphqlRequest<{ createTask: Task }>(query, { input })
      .then((data) => data.createTask);
  }

  async updateTask(id: number, input: UpdateTaskInput): Promise<Task> {
    const query = `
      mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
        updateTask(id: $id, input: $input) {
          id
          taskName
          description
          status
          dueDate
          updatedAt
        }
      }
    `;

    return await apiService
      .graphqlRequest<{ updateTask: Task }>(query, {
        id: id.toString(),
        input,
      })
      .then((data) => data.updateTask);
  }

  async deleteTask(id: number): Promise<boolean> {
    const query = `
      mutation DeleteTask($id: ID!) {
        deleteTask(id: $id)
      }
    `;

    return await apiService
      .graphqlRequest<{ deleteTask: boolean }>(query, { id: id.toString() })
      .then((data) => data.deleteTask);
  }
}

export const taskService = new TaskService();
