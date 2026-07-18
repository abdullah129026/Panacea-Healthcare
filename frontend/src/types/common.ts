/**
 * Cross-cutting domain primitives shared by every entity and the API layer.
 */

/** Staff roles used for RBAC. Gates nav items and pages. */
export type Role = "clinician" | "admin" | "support" | "billing";

export const ROLES: readonly Role[] = [
  "clinician",
  "admin",
  "support",
  "billing",
];

/** Every entity is scoped to a clinic (tenant). */
export type TenantScoped = {
  clinicId: string;
};

/** ISO-8601 timestamp string as returned by the backend API. */
export type ISODateString = string;

/**
 * The single shape every Server Action and API call returns.
 * Never return raw data without this wrapper (see code-standards.md).
 */
export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/** Envelope for paginated list endpoints. */
export type Paginated<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};
