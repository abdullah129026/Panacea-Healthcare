import "server-only";

import type { ApiResult, Paginated, Appointment } from "@/types";
import { serverApi } from "@/lib/api";

/**
 * Server-only appointment data access. Thin, typed wrappers over the API client so
 * pages and the loading path share one seam. Tenant scope + auth headers are
 * injected by `serverApi`; every call resolves to `ApiResult` (never throws).
 */

export type AppointmentListParams = {
  search?: string;
  status?: string;
  mode?: string;
  page?: number;
  pageSize?: number;
};

export function listAppointments(
  params: AppointmentListParams = {}
): Promise<ApiResult<Paginated<Appointment>>> {
  return serverApi.get<Paginated<Appointment>>("/appointments", {
    query: {
      search: params.search,
      status: params.status,
      mode: params.mode,
      page: params.page,
      pageSize: params.pageSize,
    },
  });
}

export function getAppointment(id: string): Promise<ApiResult<Appointment>> {
  return serverApi.get<Appointment>(
    `/appointments/${encodeURIComponent(id)}`
  );
}
