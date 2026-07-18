import express, { type Request, type Response } from 'express';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { createError } from '../middleware/errorHandler.js';
import * as authService from '../services/auth.service.js';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../lib/schemas/auth.js';
import type { AuthRequest } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.post(
  '/login',
  asyncHandler(async (req: Request, res: Response) => {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      throw createError('Invalid request: ' + JSON.stringify(validation.error.flatten()), 400);
    }

    const { email, password } = validation.data;
    const result = await authService.login(email, password);

    res.json({
      success: true,
      token: result.token,
      user: result.user,
    });
  })
);

router.post(
  '/register',
  asyncHandler(async (req: Request, res: Response) => {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      throw createError('Invalid request: ' + JSON.stringify(validation.error.flatten()), 400);
    }

    const { email, password, name, clinicName } = validation.data;
    const result = await authService.register(email, password, name, clinicName);

    res.json({
      success: true,
      token: result.token,
      user: result.user,
    });
  })
);

router.get(
  '/me',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw createError('No user context', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user || user.deactivatedAt) {
      throw createError('User not found', 404);
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        title: user.title || undefined,
        role: user.role,
        clinicId: user.clinicId,
        twoFactorEnabled: user.twoFactorEnabled,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    });
  })
);

router.post(
  '/forgot-password',
  asyncHandler(async (req: Request, res: Response) => {
    const validation = forgotPasswordSchema.safeParse(req.body);
    if (!validation.success) {
      throw createError('Invalid request: ' + JSON.stringify(validation.error.flatten()), 400);
    }

    const { email } = validation.data;
    await authService.forgotPassword(email);

    res.status(204).send();
  })
);

router.post(
  '/reset-password',
  asyncHandler(async (req: Request, res: Response) => {
    const validation = resetPasswordSchema.safeParse(req.body);
    if (!validation.success) {
      throw createError('Invalid request: ' + JSON.stringify(validation.error.flatten()), 400);
    }

    const { token, password } = validation.data;
    await authService.resetPassword(token, password);

    res.status(204).send();
  })
);

router.post(
  '/logout',
  authenticate,
  asyncHandler(async (_req: AuthRequest, res: Response) => {
    res.status(204).send();
  })
);

export default router;