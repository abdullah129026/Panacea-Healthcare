import "server-only";

import type { ApiResult, Paginated, Document } from "@/types";
import { serverApi } from "@/lib/api";

/**
 * Server-only document (medical record) data access. Thin, typed wrappers
 * over the API client. Tenant scope + auth headers are injected by `serverApi`;
 * every call resolves to `ApiResult` (never throws).
 */

export type DocumentListParams = {
  search?: string;
  category?: string;
  status?: string;
  patientId?: string;
  page?: number;
  pageSize?: number;
};

export function listDocuments(
  params: DocumentListParams = {}
): Promise<ApiResult<Paginated<Document>>> {
  return serverApi.get<Paginated<Document>>("/documents", {
    query: {
      search: params.search,
      category: params.category,
      status: params.status,
      patientId: params.patientId,
      page: params.page,
      pageSize: params.pageSize,
    },
  });
}

export function getDocument(id: string): Promise<ApiResult<Document>> {
  return serverApi.get<Document>(`/documents/${encodeURIComponent(id)}`);
}
