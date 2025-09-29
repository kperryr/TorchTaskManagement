import React, { useState } from "react";
import type { CreateTaskInput } from "../../types";
import { TaskStatus } from "../../types";
import { useCreateTask } from "../../hooks/useTasks";
import { LoadingSpinner } from "../UI/LoadingSpinner";

export const CreateTaskForm: React.FC = () => {
  const [formData, setFormData] = useState<CreateTaskInput>({
    taskName: "",
    description: "",
    status: TaskStatus.PENDING,
    dueDate: "",
  });
  const [error, setError] = useState("");

  const createTaskMutation = useCreateTask();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submissionData: CreateTaskInput = {
        taskName: formData.taskName,
        description: formData.description,
        status: formData.status,
        dueDate:
          formData.dueDate && formData.dueDate.trim() !== ""
            ? new Date(formData.dueDate).toISOString()
            : undefined,
      };

      await createTaskMutation.mutateAsync(submissionData);
      // Reset form State on success
      setFormData({
        taskName: "",
        description: "",
        status: TaskStatus.PENDING,
        dueDate: "",
      });
      setError("");
    } catch (err: any) {

      //Handle errors from Api
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Failed to create task. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Task Name */}
      <div>
        <label
          htmlFor="taskName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Task Name *
        </label>
        <input
          type="text"
          id="taskName"
          name="taskName"
          value={formData.taskName}
          onChange={handleChange}
          required
          minLength={5}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          placeholder="Enter task name (min 5 characters)"
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          placeholder="Enter task description"
        />
      </div>

      {/* Status */}
      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          <option value={TaskStatus.PENDING}>Pending</option>
          <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
          <option value={TaskStatus.COMPLETED}>Completed</option>
          <option value={TaskStatus.CANCELLED}>Cancelled</option>
        </select>
      </div>

      {/* Due Date */}
      <div>
        <label
          htmlFor="dueDate"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Due Date (Optional)
        </label>
        <input
          type="datetime-local"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={createTaskMutation.isPending}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
      >
        {createTaskMutation.isPending ? (
          <div className="flex items-center justify-center">
            <LoadingSpinner size="sm" className="mr-2" />
            Creating...
          </div>
        ) : (
          "Create Task"
        )}
      </button>

      {/* Success Message */}
      {createTaskMutation.isSuccess && (
        <div className="rounded-md bg-green-50 p-3">
          <div className="text-sm text-green-700">
            Task created successfully!
          </div>
        </div>
      )}
    </form>
  );
};
