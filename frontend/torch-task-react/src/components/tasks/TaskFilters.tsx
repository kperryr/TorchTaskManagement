import React from "react";
import { TaskStatus } from "../../types";

interface TaskFiltersProps {
  filters: {
    status?: TaskStatus;
    sortBy?: string;
  };
  onFiltersChange: (filters: { status?: TaskStatus; sortBy?: string }) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const handleStatusChange = (status: TaskStatus | "ALL") => {
    onFiltersChange({
      ...filters,
      status: status === "ALL" ? undefined : status,
    });
  };

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({
      ...filters,
      sortBy,
    });
  };

  return (
    <div className="space-y-4">
      {/* Status Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Status
        </label>
        <select
          value={filters.status || "ALL"}
          onChange={(e) =>
            handleStatusChange(e.target.value as TaskStatus | "ALL")
          }
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="ALL">All Statuses</option>
          <option value={TaskStatus.PENDING}>Pending</option>
          <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
          <option value={TaskStatus.COMPLETED}>Completed</option>
          <option value={TaskStatus.CANCELLED}>Cancelled</option>
        </select>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sort By
        </label>
        <select
          value={filters.sortBy || "CREATED_DESC"}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="CREATED_DESC">Newest First</option>
          <option value="CREATED_ASC">Oldest First</option>
          <option value="DUE_ASC">Due Date (Earliest)</option>
          <option value="DUE_DESC">Due Date (Latest)</option>
          <option value="NAME_ASC">Name (A-Z)</option>
          <option value="NAME_DESC">Name (Z-A)</option>
        </select>
      </div>

      {/* Clear Filter*/}
      {(filters.status || filters.sortBy !== "CREATED_DESC") && (
        <button
          onClick={() => onFiltersChange({})}
          className="w-full text-sm text-gray-600 hover:text-gray-800 underline"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};
