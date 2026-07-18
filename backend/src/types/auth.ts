/**
 * Authentication types
 * Mirrors frontend src/types/auth.ts
 */

export type UserRole = 'clinician' | 'admin' | 'support' | 'billing';

export interface User {
  id: string;
  email: string;
  name: string;
  title?: string;
  role: UserRole;
  clinicId: string;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user?: User;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  clinicName: string;
  agree: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface JwtPayload {
  userId: string;
  clinicId: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
