/**
 * Shared route constants for auth guarding and navigation.
 *
 * Route groups `(auth)` / `(portal)` don't appear in the URL, so protection is
 * expressed as path prefixes. Consumed by `proxy.ts` (optimistic guard) and the
 * shell navigation.
 */

/** Unauthenticated routes; a signed-in user visiting these is bounced home. */
export const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/verify-email",
] as const;

/** Prefixes under the authenticated `(portal)` shell — require a session. */
export const PORTAL_ROUTE_PREFIXES = [
  "/dashboard",
  "/patients",
  "/appointments",
  "/ai-cds",
  "/clinical-operations",
  "/medical-records",
  "/billing",
  "/inventory",
  "/reports",
  "/communications",
  "/support",
  "/settings",
] as const;

export const LOGIN_ROUTE = "/login";
export const DEFAULT_AUTHED_ROUTE = "/dashboard";

export function isPortalPath(pathname: string): boolean {
  return PORTAL_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function isAuthPath(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname === route);
}
