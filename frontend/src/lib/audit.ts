import { serverApi } from "@/lib/api";

export type AuditAction =
  | "login"
  | "logout"
  | "register"
  | "password_change"
  | "2fa_enable"
  | "2fa_disable"
  | "patient_create"
  | "patient_update"
  | "patient_delete"
  | "appointment_create"
  | "appointment_cancel"
  | "document_upload"
  | "document_delete"
  | "invoice_create"
  | "profile_update"
  | "settings_change"
  | "member_invite"
  | "member_remove"
  | "member_role_change";

export interface AuditLog {
  action: AuditAction;
  entityType?: string;
  entityId?: string;
  details?: Record<string, unknown>;
}

export async function logAudit(log: AuditLog): Promise<void> {
  try {
    await serverApi.post("/audit-logs", {
      body: {
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        details: log.details,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(`[audit] Failed to log ${log.action}:`, error);
  }
}

export async function logLoginAttempt(
  success: boolean,
  email: string
): Promise<void> {
  await logAudit({
    action: "login",
    details: { success, email, timestamp: new Date().toISOString() },
  });
}

export async function logPasswordChange(userId: string): Promise<void> {
  await logAudit({
    action: "password_change",
    entityType: "user",
    entityId: userId,
  });
}

export async function log2FAChange(
  userId: string,
  action: "enable" | "disable"
): Promise<void> {
  await logAudit({
    action: action === "enable" ? "2fa_enable" : "2fa_disable",
    entityType: "user",
    entityId: userId,
  });
}
