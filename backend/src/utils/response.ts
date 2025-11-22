import type { Response } from "express";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export class ResponseHandler {
  static success<T>(
    res: Response,
    data?: T,
    message?: string,
    statusCode: number = 200
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
    };

    if (data !== undefined) {
      response.data = data;
    }

    if (message) {
      response.message = message;
    }

    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    error: string | Error,
    statusCode: number = 400
  ): Response {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : error,
    };

    return res.status(statusCode).json(response);
  }
}
