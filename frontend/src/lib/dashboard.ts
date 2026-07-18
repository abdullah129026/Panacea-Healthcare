import "server-only";

import type { ApiResult, Dashboard } from "@/types";
import { serverApi } from "@/lib/api";

/**
 * Server-only dashboard data access. Aggregates data from multiple domains.
 * Thin, typed wrappers over the API client. Tenant scope + auth headers are
 * injected by `serverApi`; every call resolves to `ApiResult` (never throws).
 */

export function getDashboard(): Promise<ApiResult<Dashboard>> {
  return serverApi.get<Dashboard>("/dashboard");
}
