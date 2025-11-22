import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import { ResponseHandler } from "../utils/response.js";

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        ResponseHandler.error(
          res,
          "Username, email, and password are required",
          400
        );
        return;
      }

      const result = await AuthService.register({ username, email, password });
      ResponseHandler.success(res, result, "User registered successfully", 201);
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error ? error.message : "Registration failed",
        400
      );
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        ResponseHandler.error(res, "Username and password are required", 400);
        return;
      }

      const result = await AuthService.login({ username, password });
      ResponseHandler.success(res, result, "Login successful");
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error ? error.message : "Login failed",
        401
      );
    }
  }

  static async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        ResponseHandler.error(res, "Email is required", 400);
        return;
      }

      await AuthService.forgotPassword({ email });
      ResponseHandler.success(
        res,
        null,
        "If the email exists, an OTP has been sent to your email address"
      );
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error ? error.message : "Failed to send OTP",
        500
      );
    }
  }

  static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp, newPassword } = req.body;

      if (!email || !otp || !newPassword) {
        ResponseHandler.error(
          res,
          "Email, OTP, and new password are required",
          400
        );
        return;
      }

      await AuthService.resetPassword({ email, otp, newPassword });
      ResponseHandler.success(res, null, "Password reset successfully");
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error ? error.message : "Password reset failed",
        400
      );
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    try {
      await AuthService.logout(req.user.id);
      ResponseHandler.success(res, null, "Logged out successfully");
    } catch (error) {
      ResponseHandler.error(res, "Failed to logout", 500);
    }
  }

  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refresh_token } = req.body;
      if (!refresh_token) {
        ResponseHandler.error(res, "Refresh token is required", 400);
        return;
      }

      const result = await AuthService.refreshToken(refresh_token);
      ResponseHandler.success(res, result, "Token refreshed successfully");
    } catch (error) {
      ResponseHandler.error(res, "Failed to refresh token", 500);
    }
  }
}
