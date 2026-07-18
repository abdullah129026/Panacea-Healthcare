import { cookies } from "next/headers";

/**
 * Resolved session context used to authenticate and tenant-scope API calls.
 *
 * The real session (httpOnly cookie + decode) lands in Phase 1 (auth). This is
 * the single seam every server-side API call reads from — wiring the login flow
 * only needs to set these cookies, not touch call sites.
 */
export type AuthContext = {
  token?: string;
  clinicId?: string;
};

/** Cookie names owned by the (planned) auth layer. */
export const SESSION_COOKIE = "panacea_session";
export const CLINIC_COOKIE = "panacea_clinic";

export async function getServerAuthContext(): Promise<AuthContext> {
  try {
    const store = await cookies();
    return {
      token: store.get(SESSION_COOKIE)?.value,
      clinicId: store.get(CLINIC_COOKIE)?.value,
    };
  } catch (error) {
    console.error("[api/context] failed to read auth context", error);
    return {};
  }
}
