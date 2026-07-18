import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/api";
import {
  isAuthPath,
  isPortalPath,
  LOGIN_ROUTE,
  DEFAULT_AUTHED_ROUTE,
} from "@/lib/routes";

/**
 * Optimistic auth guard (Next.js 16 renamed `middleware` → `proxy`).
 *
 * This is a coarse, cookie-presence check only — it never decodes or trusts the
 * token's contents. Real authentication happens in the Data Access Layer
 * (`getCurrentUser` → `/auth/me`) and inside each Server Action. Keeping the
 * proxy free of backend calls avoids per-request latency on every route.
 *
 * - Unauthenticated request to a `(portal)` route → redirect to `/login`
 *   (preserving the intended destination in `?from=`).
 * - Authenticated request to an `(auth)` route → redirect to `/dashboard`.
 */
export function proxy(request: NextRequest): NextResponse {
  const { pathname, search } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  if (isPortalPath(pathname) && !hasSession) {
    const loginUrl = new URL(LOGIN_ROUTE, request.url);
    loginUrl.searchParams.set("from", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPath(pathname) && hasSession) {
    return NextResponse.redirect(new URL(DEFAULT_AUTHED_ROUTE, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
