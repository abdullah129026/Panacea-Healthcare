"use server";

import { redirect } from "next/navigation";
import type { RiskScore } from "@/types";
import { serverApi } from "@/lib/api";
import { requireRole } from "@/lib/auth";
import { newAnalysisSchema } from "@/lib/schemas";
import { fieldErrorsFromZod, type FormState } from "@/lib/forms";

/** Roles permitted to create clinical analyses. */
const ANALYSIS_WRITE_ROLES = ["clinician", "admin"] as const;

export async function createAnalysis(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireRole(ANALYSIS_WRITE_ROLES);

  const parsed = newAnalysisSchema.safeParse({
    patientId: formData.get("patientId"),
    symptoms: formData.get("symptoms"),
    vitals: formData.get("vitals"),
    history: formData.get("history"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const result = await serverApi.post<RiskScore>("/risk-scores", {
    body: parsed.data,
  });

  if (!result.success) {
    return { error: result.error };
  }

  redirect(`/ai-cds/result/${result.data.id}`);
}
