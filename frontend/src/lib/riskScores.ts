import "server-only";

import type { ApiResult, Paginated, RiskScore } from "@/types";
import { serverApi } from "@/lib/api";

/**
 * Server-only risk score (AI CDS analysis result) data access. Thin, typed
 * wrappers over the API client. Tenant scope + auth headers are injected
 * by `serverApi`; every call resolves to `ApiResult` (never throws).
 */

export type RiskScoreListParams = {
  search?: string;
  level?: string;
  page?: number;
  pageSize?: number;
};

export function listRiskScores(
  params: RiskScoreListParams = {}
): Promise<ApiResult<Paginated<RiskScore>>> {
  return serverApi.get<Paginated<RiskScore>>("/risk-scores", {
    query: {
      search: params.search,
      level: params.level,
      page: params.page,
      pageSize: params.pageSize,
    },
  });
}

export function getRiskScore(id: string): Promise<ApiResult<RiskScore>> {
  return serverApi.get<RiskScore>(`/risk-scores/${encodeURIComponent(id)}`);
}
