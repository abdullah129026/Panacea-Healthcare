"use server";

import { revalidatePath } from "next/cache";
import type { Appointment } from "@/types";
import { serverApi } from "@/lib/api";
import { requireRole } from "@/lib/auth";
import { createAppointmentSchema } from "@/lib/schemas";
import { fieldErrorsFromZod, type FormState } from "@/lib/forms";

/** Roles permitted to manage appointments. */
const APPOINTMENT_WRITE_ROLES = ["clinician", "admin"] as const;

export async function createAppointment(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireRole(APPOINTMENT_WRITE_ROLES);

  const parsed = createAppointmentSchema.safeParse({
    patientId: formData.get("patientId"),
    type: formData.get("type"),
    department: formData.get("department"),
    doctor: formData.get("doctor"),
    mode: formData.get("mode"),
    status: formData.get("status"),
    startsAt: formData.get("startsAt"),
    durationMinutes: formData.get("durationMinutes"),
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const result = await serverApi.post<Appointment>("/appointments", {
    body: parsed.data,
  });

  if (!result.success) {
    return { error: result.error };
  }

  revalidatePath("/appointments");
  return { success: true, message: "Appointment scheduled." };
}
