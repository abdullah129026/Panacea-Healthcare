import type { z } from "zod";

/**
 * Shared shape returned by every form-backed Server Action to `useActionState`.
 * `fieldErrors` maps a field name to its validation messages; `error` is a
 * single human-readable message for whole-form failures (never a raw error).
 */
export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  /** Set on actions that report success in-place instead of redirecting. */
  success?: boolean;
  /** Human-readable success/status message paired with `success`. */
  message?: string;
  /** Optional data payload (e.g., QR code from 2FA setup). */
  data?: Record<string, unknown>;
};

/** Flatten a Zod issue list into `{ field: messages[] }`, version-independent. */
export function fieldErrorsFromZod(error: z.ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    (fieldErrors[key] ??= []).push(issue.message);
  }
  return fieldErrors;
}
