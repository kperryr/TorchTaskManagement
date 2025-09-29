import type { AuthPayload, User } from "../types";
import { apiService } from "./api";
//handles all authentication-related API calls to GraphQL API

export class AuthService {
  async register(
    email: string,
    password: string,
    name: string
  ): Promise<AuthPayload> {
    const query = `
      mutation Register($input: CreateUserInput!) {
        register(input: $input) {
          token
          user {
            id
            email
            name
            createdAt
          }
        }
      }
    `;

    return await apiService
      .graphqlRequest<{ register: AuthPayload }>(query, {
        input: { email, password, name },
      })
      .then((data) => data.register);
  }

  async login(email: string, password: string): Promise<AuthPayload> {
    const query = `
      mutation Login($input: LoginInput!) {
        login(input: $input) {
          token
          user {
            id
            email
            name
            createdAt
          }
        }
      }
    `;

    return await apiService
      .graphqlRequest<{ login: AuthPayload }>(query, {
        input: { email, password },
      })
      .then((data) => data.login);
  }

  async logout(): Promise<boolean> {
    const query = `
      mutation Logout {
        logout
      }
    `;

    return await apiService
      .graphqlRequest<{ logout: boolean }>(query)
      .then((data) => data.logout)
      .catch(() => true); // Always return true even if logout fails
  }

  async getCurrentUser(): Promise<User> {
    const query = `
      query Me {
        me {
          id
          email
          name
          createdAt
        }
      }
    `;

    return await apiService
      .graphqlRequest<{ me: User }>(query)
      .then((data) => data.me);
  }
}

export const authService = new AuthService();
