"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emptyBodySchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const email = zod_1.z.string().email('Invalid email');
const password = zod_1.z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password too long');
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        email,
        password,
    }),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email,
        password,
    }),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
exports.emptyBodySchema = zod_1.z.object({
    body: zod_1.z.object({}).optional().default({}),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
