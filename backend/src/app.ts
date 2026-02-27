import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { apiRoutes } from './routes';

export const app = express();

const allowedOrigins = new Set([
  env.FRONTEND_ORIGIN,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]);

const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow non-browser requests and local/dev frontend origins.
    if (!origin || allowedOrigins.has(origin) || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
      callback(null, true);
      return;
    }

    // Do not throw CORS errors during preflight; simply omit CORS for disallowed origins.
    callback(null, false);
  },
  credentials: true,
  optionsSuccessStatus: 204,
});

app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1', apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
