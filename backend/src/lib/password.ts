import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  try {
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (err) {
    throw new Error(`[password/hash] ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (err) {
    throw new Error(`[password/verify] ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}