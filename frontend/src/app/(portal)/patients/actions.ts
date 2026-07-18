"use server";

import { revalidatePath } from "next/cache";
import type { Patient } from "@/types";
import { serverApi } from "@/lib/api";
import { requireRole } from "@/lib/auth";
import { createPatientSchema } from "@/lib/schemas";
import { fieldErrorsFromZod, type FormState } from "@/lib/forms";

/** Roles permitted to manage the patient directory. */
const PATIENT_WRITE_ROLES = ["clinician", "admin"] as const;

export async function createPatient(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireRole(PATIENT_WRITE_ROLES);

  const parsed = createPatientSchema.safeParse({
    name: formData.get("name"),
    age: formData.get("age"),
    gender: formData.get("gender"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    condition: formData.get("condition"),
    department: formData.get("department"),
    status: formData.get("status"),
    doctor: formData.get("doctor"),
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const result = await serverApi.post<Patient>("/patients", {
    body: parsed.data,
  });

  if (!result.success) {
    return { error: result.error };
  }

  revalidatePath("/patients");
  return { success: true, message: "Patient registered." };
}
