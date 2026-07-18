// Client-side rate limit tracking
// The backend enforces real rate limits, but we track attempts locally
// to provide better UX feedback

interface RateLimitKey {
  action: string;
  identifier: string;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimits = new Map<string, RateLimitEntry>();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_ATTEMPTS = 5;

function keyFromRateLimit(rl: RateLimitKey): string {
  return `${rl.action}:${rl.identifier}`;
}

export function trackAttempt(rl: RateLimitKey): boolean {
  const key = keyFromRateLimit(rl);
  const now = Date.now();
  const entry = rateLimits.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  entry.count++;
  if (entry.count > MAX_ATTEMPTS) {
    return false;
  }

  return true;
}

export function getRemainingAttempts(rl: RateLimitKey): number {
  const key = keyFromRateLimit(rl);
  const entry = rateLimits.get(key);

  if (!entry || Date.now() > entry.resetAt) {
    return MAX_ATTEMPTS;
  }

  return Math.max(0, MAX_ATTEMPTS - entry.count);
}

export function clearAttempts(rl: RateLimitKey): void {
  const key = keyFromRateLimit(rl);
  rateLimits.delete(key);
}

export function isRateLimited(rl: RateLimitKey): boolean {
  return getRemainingAttempts(rl) === 0;
}
