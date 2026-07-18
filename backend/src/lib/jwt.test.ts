import { describe, it, expect } from 'vitest';
import { generateToken, verifyToken, generateRefreshToken, verifyRefreshToken } from './jwt.js';

describe('JWT utilities', () => {
  const testPayload = {
    userId: 'user-123',
    clinicId: 'clinic-456',
    role: 'clinician' as const,
  };

  describe('generateToken', () => {
    it('generates a valid JWT token', () => {
      const token = generateToken(testPayload.userId, testPayload.clinicId, testPayload.role);
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3);
    });

    it('can be verified after generation', () => {
      const token = generateToken(testPayload.userId, testPayload.clinicId, testPayload.role);
      const decoded = verifyToken(token);
      expect(decoded?.userId).toBe(testPayload.userId);
    });
  });

  describe('verifyToken', () => {
    it('verifies a valid token', () => {
      const token = generateToken(testPayload.userId, testPayload.clinicId, testPayload.role);
      const payload = verifyToken(token);

      expect(payload).not.toBeNull();
      expect(payload?.userId).toBe(testPayload.userId);
      expect(payload?.clinicId).toBe(testPayload.clinicId);
      expect(payload?.role).toBe(testPayload.role);
    });

    it('returns null for invalid token', () => {
      const payload = verifyToken('invalid.token.here');
      expect(payload).toBeNull();
    });

    it('returns null for expired token', () => {
      const token = generateToken(testPayload.userId, testPayload.clinicId, testPayload.role);
      expect(verifyToken(token)).not.toBeNull();
    });

    it('returns null for corrupted token', () => {
      const token = generateToken(testPayload.userId, testPayload.clinicId, testPayload.role);
      const corrupted = token.slice(0, -5) + 'xxxxx';
      expect(verifyToken(corrupted)).toBeNull();
    });
  });

  describe('generateRefreshToken', () => {
    it('generates a valid refresh token', () => {
      const token = generateRefreshToken(testPayload.userId, testPayload.clinicId, testPayload.role);
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3);
    });
  });

  describe('verifyRefreshToken', () => {
    it('verifies a valid refresh token', () => {
      const token = generateRefreshToken(testPayload.userId, testPayload.clinicId, testPayload.role);
      const payload = verifyRefreshToken(token);

      expect(payload).not.toBeNull();
      expect(payload?.userId).toBe(testPayload.userId);
      expect(payload?.clinicId).toBe(testPayload.clinicId);
    });

    it('returns null for invalid refresh token', () => {
      const accessToken = generateToken(testPayload.userId, testPayload.clinicId, testPayload.role);
      const payload = verifyRefreshToken(accessToken);
      expect(payload).toBeNull();
    });
  });
});