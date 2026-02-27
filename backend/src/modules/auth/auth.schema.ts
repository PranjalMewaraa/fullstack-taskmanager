import { z } from 'zod';

const email = z.string().email('Invalid email');
const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password too long');

export const registerSchema = z.object({
  body: z.object({
    email,
    password,
  }),
  params: z.object({}),
  query: z.object({}),
});

export const loginSchema = z.object({
  body: z.object({
    email,
    password,
  }),
  params: z.object({}),
  query: z.object({}),
});

export const emptyBodySchema = z.object({
  body: z.object({}).optional().default({}),
  params: z.object({}),
  query: z.object({}),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
