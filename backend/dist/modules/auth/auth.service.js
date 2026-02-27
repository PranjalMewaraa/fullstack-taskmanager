"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const prisma_1 = require("../../lib/prisma");
const apiError_1 = require("../../utils/apiError");
const signToken = (payload, secret, expiresIn) => {
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
};
const buildTokens = (user) => {
    const payload = {
        sub: user.id,
        email: user.email,
    };
    return {
        accessToken: signToken(payload, env_1.env.ACCESS_TOKEN_SECRET, env_1.env.ACCESS_TOKEN_EXPIRES_IN),
        refreshToken: signToken(payload, env_1.env.REFRESH_TOKEN_SECRET, env_1.env.REFRESH_TOKEN_EXPIRES_IN),
    };
};
exports.authService = {
    async register(input) {
        const existingUser = await prisma_1.prisma.user.findUnique({ where: { email: input.email } });
        if (existingUser) {
            throw new apiError_1.ApiError(400, 'Email already in use');
        }
        const passwordHash = await bcrypt_1.default.hash(input.password, env_1.env.BCRYPT_SALT_ROUNDS);
        const user = await prisma_1.prisma.user.create({
            data: {
                email: input.email,
                password: passwordHash,
            },
            select: {
                id: true,
                email: true,
                createdAt: true,
            },
        });
        return user;
    },
    async login(input) {
        const user = await prisma_1.prisma.user.findUnique({ where: { email: input.email } });
        if (!user) {
            throw new apiError_1.ApiError(401, 'Invalid credentials');
        }
        const isValidPassword = await bcrypt_1.default.compare(input.password, user.password);
        if (!isValidPassword) {
            throw new apiError_1.ApiError(401, 'Invalid credentials');
        }
        const tokens = buildTokens(user);
        const hashedRefreshToken = await bcrypt_1.default.hash(tokens.refreshToken, env_1.env.BCRYPT_SALT_ROUNDS);
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: hashedRefreshToken },
        });
        return {
            accessToken: tokens.accessToken,
            user: {
                id: user.id,
                email: user.email,
            },
            refreshToken: tokens.refreshToken,
        };
    },
    async refresh(refreshToken) {
        let payload;
        try {
            payload = jsonwebtoken_1.default.verify(refreshToken, env_1.env.REFRESH_TOKEN_SECRET);
        }
        catch {
            throw new apiError_1.ApiError(401, 'Invalid refresh token');
        }
        const user = await prisma_1.prisma.user.findUnique({ where: { id: payload.sub } });
        if (!user?.refreshToken) {
            throw new apiError_1.ApiError(401, 'Invalid refresh token');
        }
        const isTokenMatch = await bcrypt_1.default.compare(refreshToken, user.refreshToken);
        if (!isTokenMatch) {
            throw new apiError_1.ApiError(401, 'Invalid refresh token');
        }
        const newAccessToken = signToken({ sub: user.id, email: user.email }, env_1.env.ACCESS_TOKEN_SECRET, env_1.env.ACCESS_TOKEN_EXPIRES_IN);
        return {
            accessToken: newAccessToken,
            user: {
                id: user.id,
                email: user.email,
            },
        };
    },
    async logout(userId) {
        await prisma_1.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
    },
};
