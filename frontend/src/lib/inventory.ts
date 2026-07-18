import "server-only";

import type { ApiResult, Paginated, InventoryItem } from "@/types";
import { serverApi } from "@/lib/api";

/**
 * Server-only inventory item data access. Thin, typed wrappers over the
 * API client. Tenant scope + auth headers are injected by `serverApi`; every
 * call resolves to `ApiResult` (never throws).
 */

export type InventoryListParams = {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  pageSize?: number;
};

export function listInventoryItems(
  params: InventoryListParams = {}
): Promise<ApiResult<Paginated<InventoryItem>>> {
  return serverApi.get<Paginated<InventoryItem>>("/inventory", {
    query: {
      search: params.search,
      category: params.category,
      status: params.status,
      page: params.page,
      pageSize: params.pageSize,
    },
  });
}

export function getInventoryItem(id: string): Promise<ApiResult<InventoryItem>> {
  return serverApi.get<InventoryItem>(
    `/inventory/${encodeURIComponent(id)}`
  );
}
