import jwt from "jsonwebtoken";

export interface TokenPayload {
  id: number;
  username: string;
  email: string;
}

export class JWTUtil {
  static generateAccessToken(payload: TokenPayload): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    return jwt.sign(payload, secret, {
      expiresIn: "15m",
    });
  }

  static generateRefreshToken(payload: TokenPayload): string {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
      throw new Error(
        "JWT_REFRESH_SECRET is not defined in environment variables"
      );
    }

    return jwt.sign(payload, secret, {
      expiresIn: "7d",
    });
  }

  static verifyAccessToken(token: string): TokenPayload {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    try {
      return jwt.verify(token, secret) as TokenPayload;
    } catch (error) {
      throw new Error("Invalid or expired access token");
    }
  }

  static verifyRefreshToken(token: string): TokenPayload {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
      throw new Error(
        "JWT_REFRESH_SECRET is not defined in environment variables"
      );
    }

    try {
      return jwt.verify(token, secret) as TokenPayload;
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }
  }
}
