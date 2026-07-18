"use server";

import { revalidatePath } from "next/cache";
import type { Invoice } from "@/types";
import { serverApi } from "@/lib/api";
import { requireRole } from "@/lib/auth";
import { createInvoiceSchema } from "@/lib/schemas";
import { fieldErrorsFromZod, type FormState } from "@/lib/forms";

/** Roles permitted to create invoices. */
const INVOICE_WRITE_ROLES = ["admin", "billing"] as const;

export async function createInvoice(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireRole(INVOICE_WRITE_ROLES);

  const lineItemsJson = formData.get("lineItems");
  const lineItems = lineItemsJson ? JSON.parse(String(lineItemsJson)) : [];

  const parsed = createInvoiceSchema.safeParse({
    patientId: formData.get("patientId"),
    payer: formData.get("payer"),
    status: formData.get("status"),
    currency: formData.get("currency"),
    issuedAt: formData.get("issuedAt"),
    dueAt: formData.get("dueAt"),
    lineItems,
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const result = await serverApi.post<Invoice>("/invoices", {
    body: parsed.data,
  });

  if (!result.success) {
    return { error: result.error };
  }

  revalidatePath("/billing");
  return { success: true, message: "Invoice created successfully." };
}
