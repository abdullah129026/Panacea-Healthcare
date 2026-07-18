import "server-only";

import { cookies } from "next/headers";
import { SESSION_COOKIE, CLINIC_COOKIE } from "@/lib/api";

/**
 * Session cookie management for the custom (backend-issued token) auth strategy.
 *
 * The backend owns identity: on login it returns an opaque bearer `token`. We
 * persist it — plus the resolved `clinicId` for tenant scoping — in httpOnly
 * cookies that the API layer (`src/lib/api/context.ts`) already reads. Setting
 * these cookies is the *only* thing the login flow has to do to authenticate
 * every downstream server-side API call.
 *
 * Cookies must be written from a Server Action or Route Handler (see the
 * Next.js `cookies` docs) — never during render.
 */

const THIRTY_DAYS_SECONDS = 60 * 60 * 24 * 30;

type CreateSessionInput = {
  token: string;
  clinicId: string;
  /** "Stay signed in" — persists the cookie for 30 days instead of the session. */
  rememberMe?: boolean;
};

const baseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
} as const;

export async function createSession({
  token,
  clinicId,
  rememberMe = false,
}: CreateSessionInput): Promise<void> {
  const cookieStore = await cookies();
  const options = {
    ...baseCookieOptions,
    ...(rememberMe ? { maxAge: THIRTY_DAYS_SECONDS } : {}),
  };

  cookieStore.set(SESSION_COOKIE, token, options);
  cookieStore.set(CLINIC_COOKIE, clinicId, options);
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(CLINIC_COOKIE);
}
