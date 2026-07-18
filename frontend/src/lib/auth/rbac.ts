import type { Role } from "@/types";

/**
 * Role-based access map keyed by top-level portal route.
 *
 * Gates both sidebar visibility (client) and page access (server via
 * `requireRole`). A route absent from this map is treated as available to every
 * authenticated role (e.g. dashboard-level defaults). Tenant scoping is handled
 * separately by the API client, which injects the clinic from the session.
 */
export const ROUTE_ROLES: Record<string, readonly Role[]> = {
  "/dashboard": ["clinician", "admin", "support", "billing"],
  "/patients": ["clinician", "admin"],
  "/ai-cds": ["clinician", "admin"],
  "/appointments": ["clinician", "admin", "support"],
  "/clinical-operations": ["clinician", "admin"],
  "/billing": ["admin", "billing"],
  "/medical-records": ["clinician", "admin"],
  "/inventory": ["admin", "support"],
  "/reports": ["admin", "billing"],
  "/communications": ["clinician", "admin", "support", "billing"],
  "/settings": ["clinician", "admin", "support", "billing"],
  "/support": ["clinician", "admin", "support", "billing"],
};

export function canAccessRoute(role: Role, href: string): boolean {
  const allowed = ROUTE_ROLES[href];
  return allowed ? allowed.includes(role) : true;
}
