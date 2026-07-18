"use server";

import type { FormState } from "@/lib/forms";
import { requireRole } from "@/lib/auth";
import { serverApi } from "@/lib/api";

const REPORTS_WRITE_ROLES = ["admin", "clinician"] as const;

export async function exportReport(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireRole(REPORTS_WRITE_ROLES);

  const format = formData.get("format") as string;
  const dateRange = formData.get("dateRange") as string;
  const dataScope = formData.get("dataScope") as string;

  if (!format || !["pdf", "csv", "xlsx"].includes(format)) {
    return { error: "Invalid export format" };
  }

  const result = await serverApi.get<Blob>("/reports/export", {
    query: {
      format,
      dateRange,
      dataScope,
    },
  });

  if (!result.success) {
    return { error: result.error };
  }

  return { success: true, message: "Report exported successfully." };
}
