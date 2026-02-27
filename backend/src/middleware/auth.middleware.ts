import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { ApiError } from '../utils/apiError';

type AccessPayload = {
  sub: string;
  email: string;
};

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Unauthorized'));
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as AccessPayload;
    req.user = { id: decoded.sub, email: decoded.email };
    next();
  } catch {
    next(new ApiError(401, 'Unauthorized'));
  }
};
