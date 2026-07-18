import "server-only";

import type { ApiResult, Paginated, Invoice } from "@/types";
import { serverApi } from "@/lib/api";

/**
 * Server-only invoice (billing) data access. Thin, typed wrappers over the
 * API client. Tenant scope + auth headers are injected by `serverApi`; every
 * call resolves to `ApiResult` (never throws).
 */

export type InvoiceListParams = {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
};

export function listInvoices(
  params: InvoiceListParams = {}
): Promise<ApiResult<Paginated<Invoice>>> {
  return serverApi.get<Paginated<Invoice>>("/invoices", {
    query: {
      search: params.search,
      status: params.status,
      page: params.page,
      pageSize: params.pageSize,
    },
  });
}

export function getInvoice(id: string): Promise<ApiResult<Invoice>> {
  return serverApi.get<Invoice>(`/invoices/${encodeURIComponent(id)}`);
}
