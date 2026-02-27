import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/response';
import { ListTasksQuery } from './tasks.schema';
import { tasksService } from './tasks.service';

export const tasksController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const query = (req.validated?.query ?? req.query) as ListTasksQuery;
    const data = await tasksService.list(req.user!.id, query);
    sendSuccess(res, 200, 'Tasks fetched successfully', data);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const body = req.validated?.body ?? req.body;
    const data = await tasksService.create(req.user!.id, body as Parameters<typeof tasksService.create>[1]);
    sendSuccess(res, 201, 'Task created successfully', data);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const params = (req.validated?.params ?? req.params) as { id: string };
    const data = await tasksService.getById(req.user!.id, params.id);
    sendSuccess(res, 200, 'Task fetched successfully', data);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const params = (req.validated?.params ?? req.params) as { id: string };
    const body = req.validated?.body ?? req.body;
    const data = await tasksService.update(
      req.user!.id,
      params.id,
      body as Parameters<typeof tasksService.update>[2],
    );
    sendSuccess(res, 200, 'Task updated successfully', data);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const params = (req.validated?.params ?? req.params) as { id: string };
    await tasksService.remove(req.user!.id, params.id);
    sendSuccess(res, 200, 'Task deleted successfully');
  }),

  toggle: asyncHandler(async (req: Request, res: Response) => {
    const params = (req.validated?.params ?? req.params) as { id: string };
    const data = await tasksService.toggle(req.user!.id, params.id);
    sendSuccess(res, 200, 'Task status toggled successfully', data);
  }),
};
