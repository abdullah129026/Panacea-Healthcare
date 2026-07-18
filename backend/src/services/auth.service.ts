import { PrismaClient } from '@prisma/client';
import { generateToken } from '../lib/jwt.js';
import { hashPassword, verifyPassword } from '../lib/password.js';
import { createError } from '../middleware/errorHandler.js';
import type { User } from '../types/index.js';

const prisma = new PrismaClient();

export async function login(email: string, password: string): Promise<{ token: string; user: User }> {
  try {
    const dbUser = await prisma.user.findUnique({
      where: { email },
      include: { clinic: true },
    });

    if (!dbUser) {
      throw createError('Invalid credentials', 401);
    }

    const isValidPassword = await verifyPassword(password, dbUser.passwordHash);
    if (!isValidPassword) {
      throw createError('Invalid credentials', 401);
    }

    if (dbUser.deactivatedAt) {
      throw createError('Account is deactivated', 403);
    }

    const token = generateToken(dbUser.id, dbUser.clinicId, dbUser.role);

    const user: User = {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      title: dbUser.title || undefined,
      role: dbUser.role as any,
      clinicId: dbUser.clinicId,
      twoFactorEnabled: dbUser.twoFactorEnabled,
      createdAt: dbUser.createdAt.toISOString(),
      updatedAt: dbUser.updatedAt.toISOString(),
    };

    return { token, user };
  } catch (err) {
    if (err instanceof Error && 'statusCode' in err) {
      throw err;
    }
    throw createError('[auth/login] Unknown error', 500);
  }
}

export async function register(
  email: string,
  password: string,
  name: string,
  clinicName: string
): Promise<{ token: string; user: User }> {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw createError('Email already registered', 400);
    }

    const passwordHash = await hashPassword(password);

    const clinic = await prisma.clinic.create({
      data: {
        name: clinicName,
      },
    });

    const dbUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        clinicId: clinic.id,
        role: 'admin',
      },
      include: { clinic: true },
    });

    const token = generateToken(dbUser.id, dbUser.clinicId, dbUser.role);

    const user: User = {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      title: dbUser.title || undefined,
      role: dbUser.role as any,
      clinicId: dbUser.clinicId,
      twoFactorEnabled: dbUser.twoFactorEnabled,
      createdAt: dbUser.createdAt.toISOString(),
      updatedAt: dbUser.updatedAt.toISOString(),
    };

    return { token, user };
  } catch (err) {
    if (err instanceof Error && 'statusCode' in err) {
      throw err;
    }
    throw createError('[auth/register] Unknown error', 500);
  }
}

export async function verifySession(_token: string): Promise<User | null> {
  try {
    const dbUser = await prisma.user.findUnique({
      where: { email: 'placeholder@example.com' },
    });

    if (!dbUser || dbUser.deactivatedAt) {
      return null;
    }

    const user: User = {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      title: dbUser.title || undefined,
      role: dbUser.role as any,
      clinicId: dbUser.clinicId,
      twoFactorEnabled: dbUser.twoFactorEnabled,
      createdAt: dbUser.createdAt.toISOString(),
      updatedAt: dbUser.updatedAt.toISOString(),
    };

    return user;
  } catch (_err) {
    return null;
  }
}

export async function forgotPassword(email: string): Promise<void> {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.log(`[auth/forgot-password] User not found: ${email}`);
      return;
    }

    console.log(`[auth/forgot-password] Reset token would be sent to ${email}`);
  } catch (err) {
    console.error(`[auth/forgot-password] Error: ${err}`);
  }
}

export async function resetPassword(token: string, _newPassword: string): Promise<void> {
  try {
    console.log(`[auth/reset-password] Reset with token: ${token.slice(0, 10)}...`);
    console.log(`[auth/reset-password] Would update password`);
  } catch (err) {
    throw createError('[auth/reset-password] Error', 500);
  }
}
