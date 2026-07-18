import type { ApiResult } from "@/types";
import { apiRequest, type RequestOptions } from "./client";
import { getServerAuthContext } from "./context";

/**
 * Server-side API entrypoint for Server Components, route handlers, and Server
 * Actions. Auto-injects the session token and clinic scope from the request
 * cookies so call sites never handle auth or tenancy by hand.
 *
 * Explicit `token` / `clinicId` in `options` still win, for the rare call that
 * must override (e.g. the login handler before a session exists).
 */
async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiResult<T>> {
  const context = await getServerAuthContext();
  return apiRequest<T>(path, {
    token: context.token,
    clinicId: context.clinicId,
    ...options,
  });
}

type BodylessOptions = Omit<RequestOptions, "method" | "body">;
type BodyOptions = Omit<RequestOptions, "method">;

export const serverApi = {
  get: <T>(path: string, options?: BodylessOptions): Promise<ApiResult<T>> =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, options?: BodyOptions): Promise<ApiResult<T>> =>
    request<T>(path, { ...options, method: "POST" }),
  put: <T>(path: string, options?: BodyOptions): Promise<ApiResult<T>> =>
    request<T>(path, { ...options, method: "PUT" }),
  patch: <T>(path: string, options?: BodyOptions): Promise<ApiResult<T>> =>
    request<T>(path, { ...options, method: "PATCH" }),
  del: <T>(path: string, options?: BodylessOptions): Promise<ApiResult<T>> =>
    request<T>(path, { ...options, method: "DELETE" }),
};
