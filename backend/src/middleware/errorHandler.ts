import type { Request, Response, NextFunction } from 'express';
import { config } from '../config.js';

export interface ApiError extends Error {
  statusCode?: number;
}

export function createError(message: string, statusCode: number = 500): ApiError {
  const error = new Error(message) as ApiError;
  error.statusCode = statusCode;
  return error;
}

export function errorHandler(
  err: ApiError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = 'statusCode' in err && err.statusCode ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[error] ${message}`, {
    statusCode,
    stack: config.isDevelopment ? err.stack : undefined,
  });

  res.status(statusCode).json({
    success: false,
    error: config.isDevelopment ? message : 'Internal Server Error',
  });
}

export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
