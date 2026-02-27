"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tasksService = void 0;
const prisma_1 = require("../../lib/prisma");
const apiError_1 = require("../../utils/apiError");
exports.tasksService = {
    async list(userId, query) {
        const { page, limit, status, search } = query;
        const where = {
            userId,
            ...(status ? { status } : {}),
            ...(search
                ? {
                    title: {
                        contains: search,
                        mode: 'insensitive',
                    },
                }
                : {}),
        };
        const [tasks, total] = await Promise.all([
            prisma_1.prisma.task.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma_1.prisma.task.count({ where }),
        ]);
        return {
            items: tasks,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.max(1, Math.ceil(total / limit)),
            },
        };
    },
    async create(userId, input) {
        return prisma_1.prisma.task.create({
            data: {
                ...input,
                userId,
            },
        });
    },
    async getById(userId, taskId) {
        const task = await prisma_1.prisma.task.findFirst({
            where: {
                id: taskId,
                userId,
            },
        });
        if (!task) {
            throw new apiError_1.ApiError(404, 'Task not found');
        }
        return task;
    },
    async update(userId, taskId, input) {
        await this.getById(userId, taskId);
        return prisma_1.prisma.task.update({
            where: { id: taskId },
            data: input,
        });
    },
    async remove(userId, taskId) {
        await this.getById(userId, taskId);
        await prisma_1.prisma.task.delete({ where: { id: taskId } });
    },
    async toggle(userId, taskId) {
        const task = await this.getById(userId, taskId);
        return prisma_1.prisma.task.update({
            where: { id: taskId },
            data: {
                status: task.status === 'PENDING' ? 'COMPLETED' : 'PENDING',
            },
        });
    },
};
