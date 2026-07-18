import { serverApi } from "@/lib/api/serverClient";
import type {
  UserProfile,
  SecuritySettings,
  NotificationPreferences,
  ClinicInfo,
  BillingSettings,
  ClinicMember,
  ClinicInvite,
  TwoFactorSetup,
  Paginated,
} from "@/types";
import type { ApiResult } from "@/types";

/**
 * Fetch user's profile settings.
 * @param userId - The user's ID
 * @returns User profile or error
 */
export async function getUserProfile(
  userId: string
): Promise<ApiResult<UserProfile>> {
  return serverApi.get<UserProfile>(`/users/${encodeURIComponent(userId)}/profile`);
}

/**
 * Fetch user's security settings (2FA status, sessions, login history).
 * @param userId - The user's ID
 * @returns Security settings or error
 */
export async function getSecuritySettings(
  userId: string
): Promise<ApiResult<SecuritySettings>> {
  return serverApi.get<SecuritySettings>(
    `/users/${encodeURIComponent(userId)}/security`
  );
}

/**
 * Fetch user's notification preferences.
 * @param userId - The user's ID
 * @returns Notification preferences or error
 */
export async function getNotificationPreferences(
  userId: string
): Promise<ApiResult<NotificationPreferences>> {
  return serverApi.get<NotificationPreferences>(
    `/users/${encodeURIComponent(userId)}/notifications`
  );
}

/**
 * Fetch clinic information.
 * @param clinicId - The clinic's ID
 * @returns Clinic info or error
 */
export async function getClinicInfo(
  clinicId: string
): Promise<ApiResult<ClinicInfo>> {
  return serverApi.get<ClinicInfo>(
    `/clinics/${encodeURIComponent(clinicId)}/info`
  );
}

/**
 * Fetch clinic's billing settings.
 * @param clinicId - The clinic's ID
 * @returns Billing settings or error
 */
export async function getBillingSettings(
  clinicId: string
): Promise<ApiResult<BillingSettings>> {
  return serverApi.get<BillingSettings>(
    `/clinics/${encodeURIComponent(clinicId)}/billing`
  );
}

/**
 * Fetch clinic members list (admin only).
 * @param clinicId - The clinic's ID
 * @param page - Page number (default 1)
 * @param pageSize - Items per page (default 10)
 * @returns Paginated clinic members or error
 */
export async function listClinicMembers(
  clinicId: string,
  page = 1,
  pageSize = 10
): Promise<ApiResult<Paginated<ClinicMember>>> {
  return serverApi.get<Paginated<ClinicMember>>(
    `/clinics/${encodeURIComponent(clinicId)}/members`,
    { query: { page, pageSize } }
  );
}

/**
 * Fetch pending clinic invites (admin only).
 * @param clinicId - The clinic's ID
 * @returns Clinic invites or error
 */
export async function getClinicInvites(
  clinicId: string
): Promise<ApiResult<ClinicInvite[]>> {
  return serverApi.get<ClinicInvite[]>(
    `/clinics/${encodeURIComponent(clinicId)}/invites`
  );
}
