"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const env_1 = require("../../config/env");
const asyncHandler_1 = require("../../utils/asyncHandler");
const response_1 = require("../../utils/response");
const apiError_1 = require("../../utils/apiError");
const auth_service_1 = require("./auth.service");
const refreshTokenMaxAgeMs = 7 * 24 * 60 * 60 * 1000;
const cookieOptions = {
    httpOnly: true,
    secure: env_1.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: refreshTokenMaxAgeMs,
    path: '/',
};
exports.authController = {
    register: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const user = await auth_service_1.authService.register(req.body);
        (0, response_1.sendSuccess)(res, 201, 'User registered successfully', user);
    }),
    login: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const result = await auth_service_1.authService.login(req.body);
        res.cookie('refreshToken', result.refreshToken, cookieOptions);
        (0, response_1.sendSuccess)(res, 200, 'Login successful', {
            accessToken: result.accessToken,
            user: result.user,
        });
    }),
    refresh: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const token = req.cookies?.refreshToken;
        if (!token) {
            throw new apiError_1.ApiError(401, 'Refresh token missing');
        }
        const result = await auth_service_1.authService.refresh(token);
        (0, response_1.sendSuccess)(res, 200, 'Token refreshed', result);
    }),
    logout: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const token = req.cookies?.refreshToken;
        if (token) {
            try {
                const refreshed = await auth_service_1.authService.refresh(token);
                await auth_service_1.authService.logout(refreshed.user.id);
            }
            catch {
                // Clear cookie even if token is invalid/expired.
            }
        }
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: env_1.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
        });
        (0, response_1.sendSuccess)(res, 200, 'Logout successful');
    }),
};
