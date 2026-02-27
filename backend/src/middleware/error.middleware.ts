import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/apiError';
import { env } from '../config/env';

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(404, 'Route not found'));
};

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: err.issues.map((issue) => issue.message).join(', '),
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: env.NODE_ENV === 'production' ? 'Internal server error' : 'Internal server error',
  });
};
