import "server-only";

import type {
  ApiResult,
  Paginated,
  Procedure,
  StaffMember,
  BedOccupancy,
  OperationsMetrics,
} from "@/types";
import { serverApi } from "@/lib/api";

/**
 * Server-only clinical operations data access. Thin, typed wrappers over the
 * API client. Tenant scope + auth headers are injected by `serverApi`; every
 * call resolves to `ApiResult` (never throws).
 */

export type ProcedureListParams = {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
};

export function listProcedures(
  params: ProcedureListParams = {}
): Promise<ApiResult<Paginated<Procedure>>> {
  return serverApi.get<Paginated<Procedure>>("/procedures", {
    query: {
      search: params.search,
      status: params.status,
      page: params.page,
      pageSize: params.pageSize,
    },
  });
}

export function getProcedure(id: string): Promise<ApiResult<Procedure>> {
  return serverApi.get<Procedure>(
    `/procedures/${encodeURIComponent(id)}`
  );
}

export type StaffListParams = {
  search?: string;
  department?: string;
  status?: string;
  page?: number;
  pageSize?: number;
};

export function listStaff(
  params: StaffListParams = {}
): Promise<ApiResult<Paginated<StaffMember>>> {
  return serverApi.get<Paginated<StaffMember>>("/staff", {
    query: {
      search: params.search,
      department: params.department,
      status: params.status,
      page: params.page,
      pageSize: params.pageSize,
    },
  });
}

export function getStaffMember(id: string): Promise<ApiResult<StaffMember>> {
  return serverApi.get<StaffMember>(
    `/staff/${encodeURIComponent(id)}`
  );
}

export function listBedOccupancy(): Promise<ApiResult<BedOccupancy[]>> {
  return serverApi.get<BedOccupancy[]>("/bed-occupancy");
}

export function getOperationsMetrics(): Promise<ApiResult<OperationsMetrics>> {
  return serverApi.get<OperationsMetrics>("/operations/metrics");
}
