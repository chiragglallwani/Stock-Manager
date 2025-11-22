import type { Request, Response } from "express";
import { UserService } from "../services/user.service.js";
import { ResponseHandler } from "../utils/response.js";

export class UserController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserService.getAllUsers();
      ResponseHandler.success(res, users, "Users retrieved successfully");
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error ? error.message : "Failed to retrieve users",
        500
      );
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        ResponseHandler.error(res, "Invalid user ID", 400);
        return;
      }

      const user = await UserService.getUserById(id);
      if (!user) {
        ResponseHandler.error(res, "User not found", 404);
        return;
      }

      ResponseHandler.success(res, user, "User retrieved successfully");
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error ? error.message : "Failed to retrieve user",
        500
      );
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        ResponseHandler.error(res, "Invalid user ID", 400);
        return;
      }

      const { username, email } = req.body;
      const user = await UserService.updateUser(id, { username, email });

      if (!user) {
        ResponseHandler.error(res, "User not found", 404);
        return;
      }

      ResponseHandler.success(res, user, "User updated successfully");
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error ? error.message : "Failed to update user",
        400
      );
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        ResponseHandler.error(res, "Invalid user ID", 400);
        return;
      }

      const deleted = await UserService.deleteUser(id);
      if (!deleted) {
        ResponseHandler.error(res, "User not found", 404);
        return;
      }

      ResponseHandler.success(res, null, "User deleted successfully");
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error ? error.message : "Failed to delete user",
        500
      );
    }
  }
}
