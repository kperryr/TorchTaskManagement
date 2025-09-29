import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { LoadingSpinner } from "../UI/LoadingSpinner"; 

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false); 

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">Task Manager</h1>
            <span className="text-sm text-gray-500">Welcome, {user?.name}</span>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoggingOut ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Logging out...</span>
              </>
            ) : (
              <span>Logout</span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
