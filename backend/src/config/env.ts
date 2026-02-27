import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const resolvedEnv = {
  ...process.env,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || process.env.JWT_ACCESS_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || process.env.JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || process.env.ACCESS_TOKEN_EXPIRES,
  REFRESH_TOKEN_EXPIRES_IN:
    process.env.REFRESH_TOKEN_EXPIRES_IN || process.env.REFRESH_TOKEN_EXPIRES,
};

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().min(1),
  ACCESS_TOKEN_SECRET: z.string().min(32),
  REFRESH_TOKEN_SECRET: z.string().min(32),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
  FRONTEND_ORIGIN: z.string().url().default('http://localhost:3000'),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(8).max(15).default(12),
});

const parsedEnv = envSchema.safeParse(resolvedEnv);

if (!parsedEnv.success) {
  console.error('Invalid environment variables:', parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsedEnv.data;
