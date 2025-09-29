import React, { useState } from "react";
import { TaskStatus } from "../../types";
import type { Task, UpdateTaskInput } from "../../types";
import { useUpdateTask, useDeleteTask } from "../../hooks/useTasks";
import {formatDateForDisplay,formatDateForInput,formatDateForDatabase,} from "../../utils/dateUtils";
import { LoadingSpinner } from "../UI/LoadingSpinner";

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UpdateTaskInput>({
    taskName: task.taskName,
    description: task.description,
    status: task.status,
    dueDate: task.dueDate,
  });
  const [error, setError] = useState<string>("");

  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const handleSave = async () => {
    setError("");

    try {
      await updateTaskMutation.mutateAsync({ id: task.id, input: editData });
      setIsEditing(false);
    } catch (err: any) {
      // Handle error message from API
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Failed to update task. Please try again.");
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTaskMutation.mutateAsync(task.id);
      } catch (err: any) {
        if (err.response?.data?.message) {
          alert(`Failed to delete task: ${err.response.data.message}`);
        } else {
          alert("Failed to delete task. Please try again.");
        }
      }
    }
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      await updateTaskMutation.mutateAsync({
        id: task.id,
        input: { status: newStatus },
      });
    } catch (err: any) {

      if (err.response?.data?.message) {
        console.error("Status change failed:", err.response.data.message);
      }
    }
  };

  const statusColors = {
    [TaskStatus.PENDING]: "bg-yellow-100 text-yellow-800",
    [TaskStatus.IN_PROGRESS]: "bg-blue-100 text-blue-800",
    [TaskStatus.COMPLETED]: "bg-green-100 text-green-800",
    [TaskStatus.CANCELLED]: "bg-red-100 text-red-800",
  };

  const isMutating =
    updateTaskMutation.isPending || deleteTaskMutation.isPending;

  return (
    <div
      className={`border rounded-lg p-4 bg-white ${
        isMutating ? "opacity-50" : ""
      }`}
    >
      {isEditing ? (
        <div className="space-y-3">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Task Name */}
          <input
            type="text"
            value={editData.taskName || ""}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, taskName: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Task name"
          />

          {/* Description*/}
          <textarea
            value={editData.description || ""}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description"
            rows={3}
          />
          {/* Due Date */}
          <input
            type="datetime-local"
            value={formatDateForInput(editData.dueDate)}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                dueDate: formatDateForDatabase(e.target.value) || "",
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setError("");
              }}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={updateTaskMutation.isPending}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {updateTaskMutation.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {error && (
            <div className="p-2 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{task.taskName}</h3>
              <p className="text-gray-600 text-sm mt-1">{task.description}</p>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  statusColors[task.status]
                }`}
              >
                {task.status.replace("_", " ")}
              </span>
            </div>
          </div>

          {task.dueDate && (
            <div className="text-sm text-gray-500">
              Due: {formatDateForDisplay(task.dueDate)}
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <div className="text-xs text-gray-500">
              Created: {formatDateForDisplay(task.createdAt)}
            </div>

            <div className="flex space-x-2">
              <select
                value={task.status}
                onChange={(e) =>
                  handleStatusChange(e.target.value as TaskStatus)
                }
                disabled={isMutating}
                className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value={TaskStatus.PENDING}>Pending</option>
                <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                <option value={TaskStatus.COMPLETED}>Completed</option>
                <option value={TaskStatus.CANCELLED}>Cancelled</option>
              </select>

              <button
                onClick={() => {
                  setIsEditing(true);
                  setError("");
                }}
                disabled={isMutating}
                className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
              >
                Edit
              </button>

              <button
                onClick={handleDelete}
                disabled={isMutating}
                className="text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                {deleteTaskMutation.isPending ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
