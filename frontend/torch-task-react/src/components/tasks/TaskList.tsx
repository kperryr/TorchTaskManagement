import React from "react";
import { useTasks } from "../../hooks/useTasks";
import { TaskItem } from "./TaskItem";
import { LoadingSpinner } from "../UI/LoadingSpinner";
import { TaskStatus } from "../../types";

interface TaskListProps {
  filters: {
    status?: TaskStatus;
    sortBy?: string;
  };
}

export const TaskList: React.FC<TaskListProps> = ({ filters }) => {
  const { data: tasks, isLoading, error } = useTasks(filters);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 text-sm">
          Error loading tasks: {error.message}
        </div>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 text-sm">
          No tasks found. Create your first task!
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};
