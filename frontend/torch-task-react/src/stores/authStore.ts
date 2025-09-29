import { create } from "zustand";
import type { User } from "../types/index";
import { authService } from "../services/authService";

//creates a centralized state store to manage user authentication for useAuth Hook

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    try {
      const authPayload = await authService.login(email, password);
      set({
        user: authPayload.user,
        token: authPayload.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      const authPayload = await authService.register(email, password, name);
      set({
        user: authPayload.user,
        token: authPayload.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      get().clearAuth();
    }
  },

  setAuth: (user: User, token: string) => {
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  clearAuth: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  checkAuth: async () => {
    try {
      const token = get().token;
      if (!token) {
        set({ isLoading: false });
        return;
      }

      const user = await authService.getCurrentUser();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      get().clearAuth();
    }
  },
}));
