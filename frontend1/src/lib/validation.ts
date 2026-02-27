import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const taskCreateSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().trim().max(2000, 'Description too long').optional(),
});

export const taskUpdateSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().trim().max(2000, 'Description too long').optional(),
});
