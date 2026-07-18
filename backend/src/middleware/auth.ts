import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt.js';
import { createError } from './errorHandler.js';
import type { JwtPayload, UserRole } from '../types/index.js';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function authenticate(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError('Missing or invalid authorization header', 401);
    }

    const token = authHeader.slice(7);
    const payload = verifyToken(token);

    if (!payload) {
      throw createError('Invalid or expired token', 401);
    }

    req.user = payload;
    next();
  } catch (err) {
    if (err instanceof Error && 'statusCode' in err) {
      next(err);
    } else {
      next(createError('Unauthorized', 401));
    }
  }
}

export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw createError('No user in request', 401);
      }

      if (!allowedRoles.includes(req.user.role as UserRole)) {
        throw createError('Insufficient permissions', 403);
      }

      next();
    } catch (err) {
      if (err instanceof Error && 'statusCode' in err) {
        next(err);
      } else {
        next(createError('Forbidden', 403));
      }
    }
  };
}

export function optionalAuth(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    const payload = verifyToken(token);
    if (payload) {
      req.user = payload;
    }
  }
  next();
}
