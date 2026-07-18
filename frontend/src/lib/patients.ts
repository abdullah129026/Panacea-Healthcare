import "server-only";

import type { ApiResult, Paginated, Patient } from "@/types";
import { serverApi } from "@/lib/api";

/**
 * Server-only patient data access. Thin, typed wrappers over the API client so
 * pages and the loading path share one seam. Tenant scope + auth headers are
 * injected by `serverApi`; every call resolves to `ApiResult` (never throws).
 *
 * This is the template read layer every Phase 2 domain slice mirrors.
 */

export type PatientListParams = {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
};

export function listPatients(
  params: PatientListParams = {}
): Promise<ApiResult<Paginated<Patient>>> {
  return serverApi.get<Paginated<Patient>>("/patients", {
    query: {
      search: params.search,
      status: params.status,
      page: params.page,
      pageSize: params.pageSize,
    },
  });
}

export function getPatient(id: string): Promise<ApiResult<Patient>> {
  return serverApi.get<Patient>(`/patients/${encodeURIComponent(id)}`);
}
