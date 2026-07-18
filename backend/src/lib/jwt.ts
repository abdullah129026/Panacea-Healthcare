import jwt, { type JwtPayload as JwtPayloadType } from 'jsonwebtoken';
import { config } from '../config.js';
import type { JwtPayload } from '../types/index.js';

export function generateToken(
  userId: string,
  clinicId: string,
  role: string
): string {
  const payload: JwtPayload = {
    userId,
    clinicId,
    role: role as any,
  };

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
    algorithm: 'HS256',
  } as any);
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, config.jwtSecret, {
      algorithms: ['HS256'],
    });
    return decoded as JwtPayloadType as JwtPayload;
  } catch (_err) {
    return null;
  }
}

export function generateRefreshToken(
  userId: string,
  clinicId: string,
  role: string
): string {
  const payload: JwtPayload = {
    userId,
    clinicId,
    role: role as any,
  };

  return jwt.sign(payload, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn,
    algorithm: 'HS256',
  } as any);
}

export function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, config.jwtRefreshSecret, {
      algorithms: ['HS256'],
    });
    return decoded as JwtPayloadType as JwtPayload;
  } catch (_err) {
    return null;
  }
}