import type { Response, NextFunction } from 'express';
import { createError } from './errorHandler.js';
import type { AuthRequest } from './auth.js';

export function enforceTenant(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void {
  try {
    if (!req.user) {
      throw createError('No user context', 401);
    }

    const clinicIdHeader = req.headers['x-clinic-id'] as string | undefined;

    if (clinicIdHeader && clinicIdHeader !== req.user.clinicId) {
      throw createError(
        'Clinic ID mismatch: request clinic does not match user clinic',
        403
      );
    }

    next();
  } catch (err) {
    if (err instanceof Error && 'statusCode' in err) {
      next(err);
    } else {
      next(createError('Forbidden', 403));
    }
  }
}
