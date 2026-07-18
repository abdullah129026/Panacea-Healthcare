import { z } from "zod";

/** Update user profile settings. */
export const updateProfileSchema = z.object({
  name: z.string().min(1, "Full name is required."),
  title: z.string().optional(),
  language: z.enum(["en", "es", "fr"]),
  timezone: z.string().min(1, "Timezone is required."),
  dateFormat: z.enum(["MM/DD/YYYY", "DD/MM/YYYY"]),
  interfaceMode: z.enum(["standard", "night-shift", "dynamic"]).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

/** Update user password. */
export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(12, "Password must be at least 12 characters.")
      .regex(/[A-Z]/, "Password must contain an uppercase letter.")
      .regex(/[a-z]/, "Password must contain a lowercase letter.")
      .regex(/[0-9]/, "Password must contain a number.")
      .regex(/[^a-zA-Z0-9]/, "Password must contain a special character."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password.",
    path: ["newPassword"],
  });

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

/** Update notification preferences. */
export const updateNotificationPreferencesSchema = z.object({
  emailEnabled: z.boolean(),
  smsEnabled: z.boolean(),
  inAppEnabled: z.boolean(),
  criticalAlerts: z.boolean(),
  vitalOutOfRange: z.boolean(),
  statLabResults: z.boolean(),
  emergencyAdmissions: z.boolean(),
  appointmentBookings: z.boolean(),
  appointmentCancellations: z.boolean(),
  appointmentReminders: z.boolean(),
  staffChat: z.boolean(),
  patientInquiries: z.boolean(),
  insuranceLiaison: z.boolean(),
  doNotDisturbStart: z.string().optional(),
  doNotDisturbEnd: z.string().optional(),
});

export type UpdateNotificationPreferencesInput = z.infer<
  typeof updateNotificationPreferencesSchema
>;

/** Update clinic information (admin only). */
export const updateClinicInfoSchema = z.object({
  name: z.string().min(1, "Clinic name is required."),
  facilityId: z.string().min(1, "Facility ID is required."),
  address: z.string().min(5, "Address is required."),
  phone: z.string().min(7, "Enter a valid phone number."),
  emergencyLine: z.string().min(7, "Enter a valid emergency line."),
  adminEmail: z.string().email("Enter a valid admin email."),
});

export type UpdateClinicInfoInput = z.infer<typeof updateClinicInfoSchema>;

/** Add or update payment method (admin only). */
export const updateBillingMethodSchema = z.object({
  type: z.enum(["card", "bank-account"]),
  last4: z.string().length(4, "Last 4 digits required."),
  brand: z.string().optional(),
  expiryMonth: z.coerce.number().int().min(1).max(12).optional(),
  expiryYear: z.coerce.number().int().min(2024).max(2100).optional(),
  isDefault: z.boolean(),
});

export type UpdateBillingMethodInput = z.infer<typeof updateBillingMethodSchema>;

/** Enable 2FA (choose method). */
export const enable2FASchema = z.object({
  method: z.enum(["authenticator", "sms"], { message: "Choose an authentication method." }),
  phoneNumber: z.string().optional(),
});

export type Enable2FAInput = z.infer<typeof enable2FASchema>;

/** Confirm 2FA setup with code. */
export const confirm2FASchema = z.object({
  code: z.string().min(6, "Enter the 6-digit code.").max(6, "Code must be 6 digits."),
});

export type Confirm2FAInput = z.infer<typeof confirm2FASchema>;

/** Deactivate account (requires password). */
export const deactivateAccountSchema = z.object({
  password: z.string().min(1, "Password is required to deactivate your account."),
});

export type DeactivateAccountInput = z.infer<typeof deactivateAccountSchema>;

/** Invite clinic user. */
export const inviteClinicUserSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  role: z.enum(["clinician", "admin", "support", "billing"], {
    message: "Select a role.",
  }),
});

export type InviteClinicUserInput = z.infer<typeof inviteClinicUserSchema>;

/** Update clinic user role. */
export const updateClinicUserRoleSchema = z.object({
  userId: z.string().min(1, "User ID is required."),
  role: z.enum(["clinician", "admin", "support", "billing"], {
    message: "Select a role.",
  }),
});

export type UpdateClinicUserRoleInput = z.infer<typeof updateClinicUserRoleSchema>;

/** Remove clinic member. */
export const removeClinicMemberSchema = z.object({
  userId: z.string().min(1, "User ID is required."),
  password: z.string().min(1, "Password is required to remove a member."),
});

export type RemoveClinicMemberInput = z.infer<typeof removeClinicMemberSchema>;
