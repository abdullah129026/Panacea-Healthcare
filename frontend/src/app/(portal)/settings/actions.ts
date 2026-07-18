"use server";

import { revalidatePath } from "next/cache";
import { serverApi } from "@/lib/api/serverClient";
import { getCurrentUser, requireRole } from "@/lib/auth/dal";
import {
  updateProfileSchema,
  updatePasswordSchema,
  updateNotificationPreferencesSchema,
  updateClinicInfoSchema,
  updateBillingMethodSchema,
  enable2FASchema,
  confirm2FASchema,
  deactivateAccountSchema,
  inviteClinicUserSchema,
  updateClinicUserRoleSchema,
  removeClinicMemberSchema,
} from "@/lib/schemas/settings";
import { fieldErrorsFromZod } from "@/lib/forms";
import type { FormState } from "@/lib/forms";

/**
 * Update user's profile settings.
 */
export async function updateProfile(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Unauthorized." };
    }

    const parsed = updateProfileSchema.safeParse({
      name: formData.get("name"),
      title: formData.get("title") || undefined,
      language: formData.get("language"),
      timezone: formData.get("timezone"),
      dateFormat: formData.get("dateFormat"),
      interfaceMode: formData.get("interfaceMode") || undefined,
    });

    if (!parsed.success) {
      return { fieldErrors: fieldErrorsFromZod(parsed.error) };
    }

    const result = await serverApi.put<{ success: boolean }>(
      `/users/${encodeURIComponent(user.id)}/profile`,
      { body: parsed.data }
    );

    if (!result.success) {
      return { error: result.error };
    }

    revalidatePath("/settings");
    return { success: true, message: "Profile updated successfully." };
  } catch (error) {
    console.error("[settings/updateProfile]", error);
    return { error: "Failed to update profile. Please try again." };
  }
}

/**
 * Update user's password.
 */
export async function updatePassword(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Unauthorized." };
    }

    const parsed = updatePasswordSchema.safeParse({
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword"),
    });

    if (!parsed.success) {
      return { fieldErrors: fieldErrorsFromZod(parsed.error) };
    }

    const result = await serverApi.post<{ success: boolean }>(
      `/users/${encodeURIComponent(user.id)}/password`,
      {
        body: {
          currentPassword: parsed.data.currentPassword,
          newPassword: parsed.data.newPassword,
        },
      }
    );

    if (!result.success) {
      return { error: result.error };
    }

    revalidatePath("/settings/security");
    return { success: true, message: "Password updated successfully." };
  } catch (error) {
    console.error("[settings/updatePassword]", error);
    return { error: "Failed to update password. Please try again." };
  }
}

/**
 * Update user's notification preferences.
 */
export async function updateNotifications(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Unauthorized." };
    }

    const parsed = updateNotificationPreferencesSchema.safeParse({
      emailEnabled: formData.get("emailEnabled") === "on",
      smsEnabled: formData.get("smsEnabled") === "on",
      inAppEnabled: formData.get("inAppEnabled") === "on",
      criticalAlerts: formData.get("criticalAlerts") === "on",
      vitalOutOfRange: formData.get("vitalOutOfRange") === "on",
      statLabResults: formData.get("statLabResults") === "on",
      emergencyAdmissions: formData.get("emergencyAdmissions") === "on",
      appointmentBookings: formData.get("appointmentBookings") === "on",
      appointmentCancellations: formData.get("appointmentCancellations") === "on",
      appointmentReminders: formData.get("appointmentReminders") === "on",
      staffChat: formData.get("staffChat") === "on",
      patientInquiries: formData.get("patientInquiries") === "on",
      insuranceLiaison: formData.get("insuranceLiaison") === "on",
      doNotDisturbStart: formData.get("doNotDisturbStart") || undefined,
      doNotDisturbEnd: formData.get("doNotDisturbEnd") || undefined,
    });

    if (!parsed.success) {
      return { fieldErrors: fieldErrorsFromZod(parsed.error) };
    }

    const result = await serverApi.put<{ success: boolean }>(
      `/users/${encodeURIComponent(user.id)}/notifications`,
      { body: parsed.data }
    );

    if (!result.success) {
      return { error: result.error };
    }

    revalidatePath("/settings/notifications");
    return { success: true, message: "Notification preferences updated." };
  } catch (error) {
    console.error("[settings/updateNotifications]", error);
    return { error: "Failed to update preferences. Please try again." };
  }
}

/**
 * Update clinic information (admin only).
 */
export async function updateClinicInfo(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    await requireRole(["admin"]);
    const user = await getCurrentUser();

    if (!user) {
      return { error: "Unauthorized." };
    }

    const parsed = updateClinicInfoSchema.safeParse({
      name: formData.get("name"),
      facilityId: formData.get("facilityId"),
      address: formData.get("address"),
      phone: formData.get("phone"),
      emergencyLine: formData.get("emergencyLine"),
      adminEmail: formData.get("adminEmail"),
    });

    if (!parsed.success) {
      return { fieldErrors: fieldErrorsFromZod(parsed.error) };
    }

    const result = await serverApi.put<{ success: boolean }>(
      `/clinics/${encodeURIComponent(user.clinicId)}`,
      { body: parsed.data }
    );

    if (!result.success) {
      return { error: result.error };
    }

    revalidatePath("/settings/clinic");
    return { success: true, message: "Clinic information updated." };
  } catch (error) {
    console.error("[settings/updateClinicInfo]", error);
    return { error: "Failed to update clinic info. Please try again." };
  }
}

/**
 * Update billing payment method (admin only).
 */
export async function updateBillingMethod(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    await requireRole(["admin"]);
    const user = await getCurrentUser();

    if (!user) {
      return { error: "Unauthorized." };
    }

    const parsed = updateBillingMethodSchema.safeParse({
      type: formData.get("type"),
      last4: formData.get("last4"),
      brand: formData.get("brand") || undefined,
      expiryMonth: formData.get("expiryMonth")
        ? Number(formData.get("expiryMonth"))
        : undefined,
      expiryYear: formData.get("expiryYear")
        ? Number(formData.get("expiryYear"))
        : undefined,
      isDefault: formData.get("isDefault") === "on",
    });

    if (!parsed.success) {
      return { fieldErrors: fieldErrorsFromZod(parsed.error) };
    }

    const result = await serverApi.post<{ success: boolean }>(
      `/clinics/${encodeURIComponent(user.clinicId)}/billing-methods`,
      { body: parsed.data }
    );

    if (!result.success) {
      return { error: result.error };
    }

    revalidatePath("/settings/billing");
    return { success: true, message: "Payment method updated." };
  } catch (error) {
    console.error("[settings/updateBillingMethod]", error);
    return { error: "Failed to update payment method. Please try again." };
  }
}

/**
 * Enable 2FA (authenticator or SMS).
 */
export async function enable2FA(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Unauthorized." };
    }

    const parsed = enable2FASchema.safeParse({
      method: formData.get("method"),
      phoneNumber: formData.get("phoneNumber") || undefined,
    });

    if (!parsed.success) {
      return { fieldErrors: fieldErrorsFromZod(parsed.error) };
    }

    const body = parsed.data.method === "sms"
      ? { method: "sms", phoneNumber: parsed.data.phoneNumber }
      : { method: "authenticator" };

    const result = await serverApi.post<{ qrCode?: string; phoneNumber?: string }>(
      `/users/${encodeURIComponent(user.id)}/2fa/enable`,
      { body }
    );

    if (!result.success) {
      return { error: result.error };
    }

    return {
      success: true,
      data: result.data,
      message: `${parsed.data.method === "authenticator" ? "Authenticator" : "SMS"} setup initiated.`,
    };
  } catch (error) {
    console.error("[settings/enable2FA]", error);
    return { error: "Failed to initiate 2FA setup. Please try again." };
  }
}

/**
 * Confirm 2FA setup with code.
 */
export async function confirmTwoFactor(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Unauthorized." };
    }

    const parsed = confirm2FASchema.safeParse({
      code: formData.get("code"),
    });

    if (!parsed.success) {
      return { fieldErrors: fieldErrorsFromZod(parsed.error) };
    }

    const result = await serverApi.post<{ success: boolean }>(
      `/users/${encodeURIComponent(user.id)}/2fa/confirm`,
      { body: { code: parsed.data.code } }
    );

    if (!result.success) {
      return { error: result.error };
    }

    revalidatePath("/settings/security");
    return { success: true, message: "Two-factor authentication enabled." };
  } catch (error) {
    console.error("[settings/confirmTwoFactor]", error);
    return { error: "Failed to confirm 2FA. Please check the code and try again." };
  }
}

/**
 * Disable 2FA.
 */
export async function disableTwoFactor(): Promise<FormState> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Unauthorized." };
    }

    const result = await serverApi.post<{ success: boolean }>(
      `/users/${encodeURIComponent(user.id)}/2fa/disable`,
      { body: {} }
    );

    if (!result.success) {
      return { error: result.error };
    }

    revalidatePath("/settings/security");
    return { success: true, message: "Two-factor authentication disabled." };
  } catch (error) {
    console.error("[settings/disableTwoFactor]", error);
    return { error: "Failed to disable 2FA. Please try again." };
  }
}

/**
 * Deactivate account (requires password).
 */
export async function deactivateAccount(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Unauthorized." };
    }

    const parsed = deactivateAccountSchema.safeParse({
      password: formData.get("password"),
    });

    if (!parsed.success) {
      return { fieldErrors: fieldErrorsFromZod(parsed.error) };
    }

    const result = await serverApi.post<{ success: boolean }>(
      `/users/${encodeURIComponent(user.id)}/deactivate`,
      { body: { password: parsed.data.password } }
    );

    if (!result.success) {
      return { error: result.error };
    }

    return { success: true, message: "Account deactivated. You will be logged out." };
  } catch (error) {
    console.error("[settings/deactivateAccount]", error);
    return { error: "Failed to deactivate account. Please check your password and try again." };
  }
}

/**
 * Invite clinic user (admin only).
 */
export async function inviteClinicUser(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    await requireRole(["admin"]);
    const user = await getCurrentUser();

    if (!user) {
      return { error: "Unauthorized." };
    }

    const parsed = inviteClinicUserSchema.safeParse({
      email: formData.get("email"),
      role: formData.get("role"),
    });

    if (!parsed.success) {
      return { fieldErrors: fieldErrorsFromZod(parsed.error) };
    }

    const result = await serverApi.post<{ inviteId: string }>(
      `/clinics/${encodeURIComponent(user.clinicId)}/members/invite`,
      { body: parsed.data }
    );

    if (!result.success) {
      return { error: result.error };
    }

    revalidatePath("/settings/clinic");
    return { success: true, message: `Invite sent to ${parsed.data.email}.` };
  } catch (error) {
    console.error("[settings/inviteClinicUser]", error);
    return { error: "Failed to send invite. Please try again." };
  }
}

/**
 * Update clinic member role (admin only).
 */
export async function updateClinicUserRole(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    await requireRole(["admin"]);
    const user = await getCurrentUser();

    if (!user) {
      return { error: "Unauthorized." };
    }

    const parsed = updateClinicUserRoleSchema.safeParse({
      userId: formData.get("userId"),
      role: formData.get("role"),
    });

    if (!parsed.success) {
      return { fieldErrors: fieldErrorsFromZod(parsed.error) };
    }

    const result = await serverApi.patch<{ success: boolean }>(
      `/clinics/${encodeURIComponent(user.clinicId)}/members/${encodeURIComponent(parsed.data.userId)}/role`,
      { body: { role: parsed.data.role } }
    );

    if (!result.success) {
      return { error: result.error };
    }

    revalidatePath("/settings/clinic");
    return { success: true, message: "Member role updated." };
  } catch (error) {
    console.error("[settings/updateClinicUserRole]", error);
    return { error: "Failed to update member role. Please try again." };
  }
}

/**
 * Remove clinic member (admin only).
 */
export async function removeClinicMember(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    await requireRole(["admin"]);
    const user = await getCurrentUser();

    if (!user) {
      return { error: "Unauthorized." };
    }

    const parsed = removeClinicMemberSchema.safeParse({
      userId: formData.get("userId"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      return { fieldErrors: fieldErrorsFromZod(parsed.error) };
    }

    const result = await serverApi.post<{ success: boolean }>(
      `/clinics/${encodeURIComponent(user.clinicId)}/members/${encodeURIComponent(parsed.data.userId)}/remove`,
      { body: { password: parsed.data.password } }
    );

    if (!result.success) {
      return { error: result.error };
    }

    revalidatePath("/settings/clinic");
    return { success: true, message: "Member removed from clinic." };
  } catch (error) {
    console.error("[settings/removeClinicMember]", error);
    return { error: "Failed to remove member. Please try again." };
  }
}

/**
 * Resend clinic invite (admin only).
 */
export async function resendClinicInvite(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    await requireRole(["admin"]);
    const user = await getCurrentUser();

    if (!user) {
      return { error: "Unauthorized." };
    }

    const userId = formData.get("userId") as string;
    if (!userId) {
      return { error: "User ID is required." };
    }

    const result = await serverApi.post<{ success: boolean }>(
      `/clinics/${encodeURIComponent(user.clinicId)}/members/${encodeURIComponent(userId)}/resend-invite`,
      { body: {} }
    );

    if (!result.success) {
      return { error: result.error };
    }

    revalidatePath("/settings/clinic");
    return { success: true, message: "Invite resent." };
  } catch (error) {
    console.error("[settings/resendClinicInvite]", error);
    return { error: "Failed to resend invite. Please try again." };
  }
}
