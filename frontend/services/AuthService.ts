import { apiClient } from "@/lib/api-client";

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
}

export interface AuthResponse {
  user: {
    id: number;
    username: string;
    email: string;
  };
  access_token: string;
  refresh_token: string;
}

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    if (!response.success || !response.data) {
      throw new Error(response.error || "Registration failed");
    }
    return response.data;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", data);
    if (!response.success || !response.data) {
      throw new Error(response.error || "Login failed");
    }
    return response.data;
  }

  async forgotPassword(data: ForgotPasswordData): Promise<void> {
    const response = await apiClient.post("/auth/forgot-password", data);
    if (!response.success) {
      throw new Error(response.error || "Failed to send OTP");
    }
  }

  async resetPassword(data: ResetPasswordData): Promise<void> {
    const response = await apiClient.post("/auth/reset-password", data);
    if (!response.success) {
      throw new Error(response.error || "Password reset failed");
    }
  }

  async logout(): Promise<void> {
    const response = await apiClient.post("/auth/logout");
    if (!response.success) {
      throw new Error(response.error || "Logout failed");
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/refresh-token", {
      refresh_token: refreshToken,
    });
    if (!response.success || !response.data) {
      throw new Error(response.error || "Token refresh failed");
    }
    return response.data;
  }
}

export const authService = new AuthService();
