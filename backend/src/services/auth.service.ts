import argon2 from "argon2";
import { UserModel, type User } from "../models/User.js";
import { JWTUtil, type TokenPayload } from "../utils/jwt.js";
import { OTPService } from "./otp.service.js";
import { EmailService } from "./email.service.js";

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
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

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
}

export class AuthService {
  static async register(data: RegisterData): Promise<AuthResponse> {
    // Check if user already exists
    const existingUserByUsername = await UserModel.findByUsername(
      data.username
    );
    if (existingUserByUsername) {
      throw new Error("Username already exists");
    }

    const existingUserByEmail = await UserModel.findByEmail(data.email);
    if (existingUserByEmail) {
      throw new Error("Email already exists");
    }

    // Hash password
    const hashedPassword = await argon2.hash(data.password);

    // Create user
    const user = await UserModel.create({
      username: data.username,
      email: data.email,
      password: hashedPassword,
    });

    // Generate tokens
    const payload: TokenPayload = {
      id: user.id!,
      username: user.username,
      email: user.email,
    };

    const access_token = JWTUtil.generateAccessToken(payload);
    const refresh_token = JWTUtil.generateRefreshToken(payload);

    // Store refresh token in database
    await UserModel.update(user.id!, { refresh_token });

    return {
      user: {
        id: user.id!,
        username: user.username,
        email: user.email,
      },
      access_token,
      refresh_token,
    };
  }

  static async login(data: LoginData): Promise<AuthResponse> {
    // Find user by username
    const user = await UserModel.findByUsername(data.username);
    if (!user) {
      throw new Error("Invalid username or password");
    }

    // Verify password
    const isValidPassword = await argon2.verify(user.password, data.password);
    if (!isValidPassword) {
      throw new Error("Invalid username or password");
    }

    // Generate tokens
    const payload: TokenPayload = {
      id: user.id!,
      username: user.username,
      email: user.email,
    };

    const access_token = JWTUtil.generateAccessToken(payload);
    const refresh_token = JWTUtil.generateRefreshToken(payload);

    // Store refresh token in database
    await UserModel.update(user.id!, { refresh_token });

    return {
      user: {
        id: user.id!,
        username: user.username,
        email: user.email,
      },
      access_token,
      refresh_token,
    };
  }

  static async forgotPassword(data: ForgotPasswordData): Promise<void> {
    // Check if user exists
    const user = await UserModel.findByEmail(data.email);
    if (!user) {
      // Don't reveal if email exists or not for security
      return;
    }

    // Generate and store OTP
    const otp = OTPService.generateOTP();
    await OTPService.storeOTP(data.email, otp);

    // Send OTP via email
    try {
      EmailService.initialize();
      await EmailService.sendOTP(data.email, otp);
    } catch (error) {
      console.error("Error sending OTP email:", error);
      // Re-throw the error with detailed message from EmailService
      throw error instanceof Error
        ? error
        : new Error("Failed to send OTP email");
    }
  }

  static async resetPassword(data: ResetPasswordData): Promise<void> {
    // Verify OTP
    const isValidOTP = await OTPService.verifyOTP(data.email, data.otp);
    if (!isValidOTP) {
      throw new Error("Invalid or expired OTP");
    }

    // Find user
    const user = await UserModel.findByEmail(data.email);
    if (!user) {
      throw new Error("User not found");
    }

    // Hash new password
    const hashedPassword = await argon2.hash(data.newPassword);

    // Update password
    await UserModel.update(user.id!, { password: hashedPassword });
  }

  static async logout(id: number): Promise<void> {
    // Find user
    const user = await UserModel.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    // Update refresh token to null
    await UserModel.update(id, { refresh_token: null });
  }

  static async refreshToken(refresh_token: string): Promise<AuthResponse> {
    // Verify refresh token
    const payload = JWTUtil.verifyRefreshToken(refresh_token);
    if (!payload) {
      throw new Error("Invalid or expired refresh token");
    }

    // Find user
    const user = await UserModel.findById(payload.id);
    if (!user) {
      throw new Error("User not found");
    }

    // Generate new tokens
    const newAccessToken = JWTUtil.generateAccessToken(payload);
    const newRefreshToken = JWTUtil.generateRefreshToken(payload);

    // Store new refresh token in database
    await UserModel.update(user.id!, { refresh_token: newRefreshToken });

    return {
      user: {
        id: user.id!,
        username: user.username,
        email: user.email,
      },
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }
}
