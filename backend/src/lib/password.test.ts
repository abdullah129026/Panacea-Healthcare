import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from './password.js';

describe('Password utilities', () => {
  describe('hashPassword', () => {
    it('hashes a password', async () => {
      const password = 'MyP@ssw0rd123';
      const hash = await hashPassword(password);

      expect(hash).toBeTruthy();
      expect(typeof hash).toBe('string');
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(20);
    });

    it('produces different hashes for the same password', async () => {
      const password = 'MyP@ssw0rd123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('verifies correct password against hash', async () => {
      const password = 'MyP@ssw0rd123';
      const hash = await hashPassword(password);

      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('rejects incorrect password', async () => {
      const password = 'MyP@ssw0rd123';
      const wrongPassword = 'WrongPassword456';
      const hash = await hashPassword(password);

      const isValid = await verifyPassword(wrongPassword, hash);
      expect(isValid).toBe(false);
    });

    it('is case-sensitive', async () => {
      const password = 'MyP@ssw0rd123';
      const hash = await hashPassword(password);

      const isValid = await verifyPassword('myp@ssw0rd123', hash);
      expect(isValid).toBe(false);
    });
  });
});