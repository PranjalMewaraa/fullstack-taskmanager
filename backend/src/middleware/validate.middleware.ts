import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import { ApiError } from '../utils/apiError';

export const validate = (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
  const parsed = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => issue.message).join(', ');
    return next(new ApiError(400, details || 'Validation error'));
  }

  const data = parsed.data as { body: unknown; params: unknown; query: unknown };

  req.validated = data;
  req.body = data.body;

  next();
};
