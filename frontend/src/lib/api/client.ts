import { env } from "@/lib/env";
import type { ApiResult } from "@/types";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type QueryValue = string | number | boolean | undefined | null;

export type RequestOptions = {
  method?: HttpMethod;
  /** JSON-serialized automatically, unless a `FormData` (file upload) is passed. */
  body?: unknown;
  query?: Record<string, QueryValue>;
  /** Bearer token for the current session. Resolved by the server helper. */
  token?: string;
  /** Current clinic id — scopes the request to the tenant. */
  clinicId?: string;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  /** Next.js fetch cache controls (RSC data fetching). */
  cache?: RequestCache;
  next?: { revalidate?: number | false; tags?: string[] };
};

const USER_FACING_ERROR =
  "Something went wrong. Please try again in a moment.";

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const base = env.apiBaseUrl.replace(/\/$/, "");
  const url = new URL(`${base}/${path.replace(/^\//, "")}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

/**
 * Core HTTP wrapper. Always resolves to an `ApiResult` — it never throws and
 * never surfaces a raw backend error to the caller. Server-only: callers are
 * Server Components, route handlers, and Server Actions (never client code).
 */
export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiResult<T>> {
  const {
    method = "GET",
    body,
    query,
    token,
    clinicId,
    headers = {},
    signal,
    cache,
    next,
  } = options;

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(isFormData ? {} : body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(clinicId ? { "X-Clinic-Id": clinicId } : {}),
    ...headers,
  };

  try {
    const response = await fetch(buildUrl(path, query), {
      method,
      headers: finalHeaders,
      body:
        body === undefined
          ? undefined
          : isFormData
            ? (body as FormData)
            : JSON.stringify(body),
      signal,
      cache,
      next,
    });

    if (!response.ok) {
      let backendMessage: string | undefined;
      try {
        const payload: unknown = await response.json();
        if (
          payload &&
          typeof payload === "object" &&
          "error" in payload &&
          typeof (payload as { error: unknown }).error === "string"
        ) {
          backendMessage = (payload as { error: string }).error;
        }
      } catch {
        // Non-JSON error body — fall through to the generic message.
      }
      console.error(
        `[api/request] ${method} ${path} → ${response.status}`,
        backendMessage ?? ""
      );

      // Provide specific error messages for common HTTP statuses
      let errorMessage = USER_FACING_ERROR;
      if (response.status === 429) {
        errorMessage =
          "Too many requests. Please wait a moment and try again.";
      } else if (response.status === 401 || response.status === 403) {
        errorMessage = "You don't have permission to do that.";
      } else if (response.status === 404) {
        errorMessage = "That resource was not found.";
      } else if (response.status === 422) {
        errorMessage = backendMessage ?? "The data you provided is invalid.";
      }

      return { success: false, error: errorMessage };
    }

    if (response.status === 204) {
      return { success: true, data: undefined as T };
    }

    const data = (await response.json()) as T;
    return { success: true, data };
  } catch (error) {
    console.error(`[api/request] ${method} ${path} failed`, error);
    return { success: false, error: USER_FACING_ERROR };
  }
}

type BodylessOptions = Omit<RequestOptions, "method" | "body">;
type BodyOptions = Omit<RequestOptions, "method">;

/** Convenience verbs over `apiRequest`. */
export const api = {
  get: <T>(path: string, options?: BodylessOptions): Promise<ApiResult<T>> =>
    apiRequest<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, options?: BodyOptions): Promise<ApiResult<T>> =>
    apiRequest<T>(path, { ...options, method: "POST" }),
  put: <T>(path: string, options?: BodyOptions): Promise<ApiResult<T>> =>
    apiRequest<T>(path, { ...options, method: "PUT" }),
  patch: <T>(path: string, options?: BodyOptions): Promise<ApiResult<T>> =>
    apiRequest<T>(path, { ...options, method: "PATCH" }),
  del: <T>(path: string, options?: BodylessOptions): Promise<ApiResult<T>> =>
    apiRequest<T>(path, { ...options, method: "DELETE" }),
};
