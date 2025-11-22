import type { Request, Response, NextFunction } from "express";
import { JWTUtil } from "../utils/jwt.js";
import { ResponseHandler } from "../utils/response.js";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      ResponseHandler.error(res, "Authorization token is required", 401);
      return;
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    const payload = JWTUtil.verifyAccessToken(token);
    req.user = payload;

    next();
  } catch (error) {
    ResponseHandler.error(
      res,
      error instanceof Error ? error.message : "Invalid token",
      401
    );
  }
};
