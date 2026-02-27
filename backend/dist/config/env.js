"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const resolvedEnv = {
    ...process.env,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || process.env.JWT_ACCESS_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || process.env.JWT_REFRESH_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || process.env.ACCESS_TOKEN_EXPIRES,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || process.env.REFRESH_TOKEN_EXPIRES,
};
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    PORT: zod_1.z.coerce.number().default(5000),
    DATABASE_URL: zod_1.z.string().min(1),
    ACCESS_TOKEN_SECRET: zod_1.z.string().min(32),
    REFRESH_TOKEN_SECRET: zod_1.z.string().min(32),
    ACCESS_TOKEN_EXPIRES_IN: zod_1.z.string().default('15m'),
    REFRESH_TOKEN_EXPIRES_IN: zod_1.z.string().default('7d'),
    FRONTEND_ORIGIN: zod_1.z.string().url().default('http://localhost:3000'),
    BCRYPT_SALT_ROUNDS: zod_1.z.coerce.number().int().min(8).max(15).default(12),
});
const parsedEnv = envSchema.safeParse(resolvedEnv);
if (!parsedEnv.success) {
    console.error('Invalid environment variables:', parsedEnv.error.flatten().fieldErrors);
    process.exit(1);
}
exports.env = parsedEnv.data;
