import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { ApiError } from '../../utils/apiError';
import { CreateTaskInput, ListTasksQuery, UpdateTaskInput } from './tasks.schema';

export const tasksService = {
  async list(userId: string, query: ListTasksQuery) {
    const { page, limit, status, search } = query;

    const where: Prisma.TaskWhereInput = {
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
      prisma.task.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.task.count({ where }),
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

  async create(userId: string, input: CreateTaskInput) {
    return prisma.task.create({
      data: {
        ...input,
        userId,
      },
    });
  },

  async getById(userId: string, taskId: string) {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });

    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    return task;
  },

  async update(userId: string, taskId: string, input: UpdateTaskInput) {
    await this.getById(userId, taskId);

    return prisma.task.update({
      where: { id: taskId },
      data: input,
    });
  },

  async remove(userId: string, taskId: string) {
    await this.getById(userId, taskId);

    await prisma.task.delete({ where: { id: taskId } });
  },

  async toggle(userId: string, taskId: string) {
    const task = await this.getById(userId, taskId);

    return prisma.task.update({
      where: { id: taskId },
      data: {
        status: task.status === 'PENDING' ? 'COMPLETED' : 'PENDING',
      },
    });
  },
};
