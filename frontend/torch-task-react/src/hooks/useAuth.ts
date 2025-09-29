import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";

//Hook to check for User Authenication with Zustand State Management
export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
  } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };
};
