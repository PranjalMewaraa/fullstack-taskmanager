import { Request, Response } from "express";
import { env } from "../../config/env";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { ApiError } from "../../utils/apiError";
import { authService } from "./auth.service";

const refreshTokenMaxAgeMs = 7 * 24 * 60 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "none" as const,
  maxAge: refreshTokenMaxAgeMs,
  path: "/",
};

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.register(req.body);
    sendSuccess(res, 201, "User registered successfully", user);
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);

    res.cookie("refreshToken", result.refreshToken, cookieOptions);

    sendSuccess(res, 200, "Login successful", {
      accessToken: result.accessToken,
      user: result.user,
    });
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies?.refreshToken;

    if (!token) {
      throw new ApiError(401, "Refresh token missing");
    }

    const result = await authService.refresh(token);
    sendSuccess(res, 200, "Token refreshed", result);
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies?.refreshToken as string | undefined;

    if (token) {
      try {
        const refreshed = await authService.refresh(token);
        await authService.logout(refreshed.user.id);
      } catch {
        // Clear cookie even if token is invalid/expired.
      }
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    sendSuccess(res, 200, "Logout successful");
  }),
};
