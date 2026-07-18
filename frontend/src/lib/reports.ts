import "server-only";

import type { ApiResult, Report } from "@/types";
import { serverApi } from "@/lib/api";

/**
 * Server-only reports & analytics data access. Thin, typed wrappers over the
 * API client. Tenant scope + auth headers are injected by `serverApi`; every
 * call resolves to `ApiResult` (never throws).
 */

export type ReportParams = {
  period?: string;
};

export function getReport(
  params: ReportParams = {}
): Promise<ApiResult<Report>> {
  return serverApi.get<Report>("/reports/current", {
    query: {
      period: params.period,
    },
  });
}

export function exportReport(format: "pdf" | "csv" | "xlsx"): Promise<ApiResult<Blob>> {
  return serverApi.get<Blob>("/reports/export", {
    query: {
      format,
    },
  });
}
