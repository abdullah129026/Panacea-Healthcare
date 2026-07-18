import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import type { Role, User } from "@/types";
import { serverApi, getServerAuthContext } from "@/lib/api";

/**
 * Data Access Layer for authentication.
 *
 * `getCurrentUser` is the single source of truth for "who is this request" — a
 * secure check that resolves the session token against the backend (`/auth/me`)
 * rather than trusting the cookie alone. It's wrapped in React `cache` so the
 * many callers in one render pass (layout, page, leaf components) share one
 * request. The optimistic cookie-presence check lives in `proxy.ts`.
 */

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const { token } = await getServerAuthContext();
  if (!token) {
    return null;
  }

  const result = await serverApi.get<User>("/auth/me");
  if (!result.success) {
    return null;
  }

  return result.data;
});

/**
 * Guard for Server Components / Actions that require a session. Redirects
 * unauthenticated requests to `/login` and otherwise returns the user.
 */
export async function verifySession(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

/**
 * Guard that additionally enforces role membership. Authenticated users lacking
 * an allowed role are sent to the dashboard (not the login page).
 */
export async function requireRole(allowed: readonly Role[]): Promise<User> {
  const user = await verifySession();
  if (!allowed.includes(user.role)) {
    redirect("/dashboard");
  }
  return user;
}
