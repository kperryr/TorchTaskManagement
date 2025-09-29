import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navbar } from "../UI/Navbar";
import { TaskList } from "./TaskList";
import { TaskFilters } from "./TaskFilters";
import { TaskStatus } from "../../types";
import { LoadingSpinner } from "../UI/LoadingSpinner";
import { CreateTaskForm } from "./CreateTaskForm";

export const Dashboard: React.FC = () => {
  const { isLoading } = useAuth();
  const [filters, setFilters] = useState<{
    status?: TaskStatus;
    sortBy?: string;
  }>({});

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NavBar */}
      <Navbar/>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Left Sidebar - Filters & Create Task */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Create Task Form */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Create New Task
                </h2>
                <CreateTaskForm />
              </div>

              {/* Filters */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Filters & Sorting
                </h2>
                <TaskFilters filters={filters} onFiltersChange={setFilters} />
              </div>
            </div>

            {/* Main Content - Task List */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">
                    My Tasks
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Manage all your tasks in one place
                  </p>
                </div>
                <div className="p-6">
                  <TaskList filters={filters} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
