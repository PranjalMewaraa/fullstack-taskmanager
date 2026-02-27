import { TaskStatus } from '@prisma/client';
import { z } from 'zod';

const idParam = z.object({
  id: z.string().uuid('Invalid task id'),
});

export const listTasksSchema = z.object({
  body: z.object({}).optional().default({}),
  params: z.object({}),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    status: z.nativeEnum(TaskStatus).optional(),
    search: z.string().trim().max(100).optional(),
  }),
});

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, 'Title is required').max(200, 'Title too long'),
    description: z.string().trim().max(2000, 'Description too long').optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const getTaskSchema = z.object({
  body: z.object({}).optional().default({}),
  params: idParam,
  query: z.object({}),
});

export const updateTaskSchema = z.object({
  body: z
    .object({
      title: z.string().trim().min(1, 'Title is required').max(200, 'Title too long').optional(),
      description: z.string().trim().max(2000, 'Description too long').nullable().optional(),
      status: z.nativeEnum(TaskStatus).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, 'At least one field is required'),
  params: idParam,
  query: z.object({}),
});

export const toggleTaskSchema = z.object({
  body: z.object({}).optional().default({}),
  params: idParam,
  query: z.object({}),
});

export const deleteTaskSchema = z.object({
  body: z.object({}).optional().default({}),
  params: idParam,
  query: z.object({}),
});

export type ListTasksQuery = z.infer<typeof listTasksSchema>['query'];
export type CreateTaskInput = z.infer<typeof createTaskSchema>['body'];
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>['body'];
