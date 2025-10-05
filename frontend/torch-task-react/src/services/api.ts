import { useAuthStore } from "../stores/authStore";
import { env } from "../config/env";

//Graph API service client that handles authenticated requests to API
// middle man between react query and the API

const API_URL = env.apiUrl;

class ApiService {
  private getToken(): string | null {
    return useAuthStore.getState().token;
  }

  async graphqlRequest<T>(query: string, variables?: any): Promise<T> {
    const token = this.getToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const result = await response.json();

    if (result.errors) {
      const errorMessage = result.errors[0].message;

      // Handle authentication errors
      if (
        errorMessage.includes("authenticated") ||
        errorMessage.includes("token")
      ) {
        useAuthStore.getState().clearAuth();
      }

      throw new Error(errorMessage);
    }

    return result.data;
  }
}

export const apiService = new ApiService();
