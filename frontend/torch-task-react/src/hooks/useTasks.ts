import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { taskService } from "../services/taskService";
import type {CreateTaskInput,UpdateTaskInput,TaskStatus} from "../types";

//React Query Hook for fetching data and other API operations

export const useTasks = (filters?: {
  status?: TaskStatus;
  sortBy?: string;
}) => {
  return useQuery({
    queryKey: ["tasks", filters],
    queryFn: () => taskService.getTasks(filters),
    enabled: true, // Only fetch when authenticated (handled by service)
  });
};

export const useTask = (id: number) => {
  return useQuery({
    queryKey: ["task", id],
    queryFn: () => taskService.getTaskById(id),
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTaskInput) => taskService.createTask(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateTaskInput }) =>
      taskService.updateTask(id, input),
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", updatedTask.id] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => taskService.deleteTask(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.removeQueries({ queryKey: ["task", deletedId] });
    },
  });
};
