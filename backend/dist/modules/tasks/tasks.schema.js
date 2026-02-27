"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaskSchema = exports.toggleTaskSchema = exports.updateTaskSchema = exports.getTaskSchema = exports.createTaskSchema = exports.listTasksSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const idParam = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid task id'),
});
exports.listTasksSchema = zod_1.z.object({
    body: zod_1.z.object({}).optional().default({}),
    params: zod_1.z.object({}),
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().int().min(1).default(1),
        limit: zod_1.z.coerce.number().int().min(1).max(100).default(10),
        status: zod_1.z.nativeEnum(client_1.TaskStatus).optional(),
        search: zod_1.z.string().trim().max(100).optional(),
    }),
});
exports.createTaskSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().trim().min(1, 'Title is required').max(200, 'Title too long'),
        description: zod_1.z.string().trim().max(2000, 'Description too long').optional(),
    }),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
exports.getTaskSchema = zod_1.z.object({
    body: zod_1.z.object({}).optional().default({}),
    params: idParam,
    query: zod_1.z.object({}),
});
exports.updateTaskSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        title: zod_1.z.string().trim().min(1, 'Title is required').max(200, 'Title too long').optional(),
        description: zod_1.z.string().trim().max(2000, 'Description too long').nullable().optional(),
        status: zod_1.z.nativeEnum(client_1.TaskStatus).optional(),
    })
        .refine((data) => Object.keys(data).length > 0, 'At least one field is required'),
    params: idParam,
    query: zod_1.z.object({}),
});
exports.toggleTaskSchema = zod_1.z.object({
    body: zod_1.z.object({}).optional().default({}),
    params: idParam,
    query: zod_1.z.object({}),
});
exports.deleteTaskSchema = zod_1.z.object({
    body: zod_1.z.object({}).optional().default({}),
    params: idParam,
    query: zod_1.z.object({}),
});
